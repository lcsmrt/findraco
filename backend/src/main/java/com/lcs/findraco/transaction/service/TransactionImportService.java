package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.ratelimit.RateLimit;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.lcs.findraco.transaction.config.ImportProperties;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.importer.ImportError;
import com.lcs.findraco.transaction.importer.ImportLimits;
import com.lcs.findraco.transaction.importer.ImportedRow;
import com.lcs.findraco.transaction.importer.ParseResult;
import com.lcs.findraco.transaction.importer.StatementParserRegistry;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.response.ImportResultResponse;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Imports a bank file: all or nothing. The file is checked for size, the caller for rate and role, and the
 * registry reads it; one invalid line rejects the whole file, so a balance is never silently short.
 */
@Service
public class TransactionImportService {

    /** Keeps the import lock keys apart from any other advisory lock keyed by a plan id. */
    private static final long IMPORT_LOCK_NAMESPACE = 1L << 40;

    /** The transaction's description column holds this much; the bank's full text stays in {@code sourceText}. */
    private static final int DESCRIPTION_LENGTH = 255;

    private final TransactionRepository transactionRepository;
    private final StatementParserRegistry registry;
    private final PlanAuthorization planAuthorization;
    private final RateLimiter rateLimiter;
    private final EntityManager entityManager;
    private final ImportProperties properties;

    public TransactionImportService(
            TransactionRepository transactionRepository,
            StatementParserRegistry registry,
            PlanAuthorization planAuthorization,
            RateLimiter rateLimiter,
            EntityManager entityManager,
            ImportProperties properties) {
        this.transactionRepository = transactionRepository;
        this.registry = registry;
        this.planAuthorization = planAuthorization;
        this.rateLimiter = rateLimiter;
        this.entityManager = entityManager;
        this.properties = properties;
    }

    @Transactional
    public ImportResultResponse importFile(MultipartFile file, PlanContext ctx) {
        if (file.getSize() > properties.maxBytes()) {
            throw new TransactionExceptions.ImportFileTooLargeException(properties.maxBytes());
        }
        rateLimiter.consume(RateLimit.IMPORT_USER, String.valueOf(ctx.userId()));
        planAuthorization.requireCanCreateTransaction(ctx.role());

        ParseResult parsed =
                registry.parse(content(file), new ImportLimits(properties.maxRows(), properties.maxErrors()));
        if (!parsed.errors().isEmpty()) {
            boolean capped = parsed.errors().size() > properties.maxErrors();
            List<ImportError> listed = capped ? parsed.errors().subList(0, properties.maxErrors()) : parsed.errors();
            throw new TransactionExceptions.ImportRowsInvalidException(List.copyOf(listed), capped);
        }

        // Imports of one plan run one after the other: the second sees the rows the first committed and
        // skips them, so a file imported twice at once still stores each row once.
        entityManager
                .createNativeQuery("SELECT 1 FROM (SELECT pg_advisory_xact_lock(?1)) AS locked")
                .setParameter(1, IMPORT_LOCK_NAMESPACE + ctx.planId())
                .getSingleResult();

        Plan plan = entityManager.getReference(Plan.class, ctx.planId());
        User user = entityManager.getReference(User.class, ctx.userId());
        Set<String> stored = transactionRepository.findExistingSourceRefs(
                plan,
                parsed.rows().stream()
                        .map(ImportedRow::sourceRef)
                        .filter(Objects::nonNull)
                        .toList());

        Set<String> seenInFile = new HashSet<>();
        List<Transaction> created = new ArrayList<>();
        int skipped = 0;
        for (ImportedRow row : parsed.rows()) {
            // A reference already stored, or repeated earlier in this file, is the same bank row.
            if (row.sourceRef() != null && (stored.contains(row.sourceRef()) || !seenInFile.add(row.sourceRef()))) {
                skipped++;
                continue;
            }
            created.add(Transaction.create(draft(row, plan, user)));
        }

        transactionRepository.saveAll(created);
        return new ImportResultResponse(created.size(), skipped);
    }

    private static TransactionDraft draft(ImportedRow row, Plan plan, User user) {
        TransactionType type = row.amount().signum() > 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
        String description =
                row.sourceText().substring(0, Math.min(row.sourceText().length(), DESCRIPTION_LENGTH));
        TransactionDetails details =
                new TransactionDetails(null, type, row.amount().abs(), description, row.date(), null, null);
        // The importer pays for every row, as a form without participants would.
        return new TransactionDraft(
                plan,
                user,
                details,
                SplitMode.EQUAL,
                List.of(new Share(user, null)),
                List.of(),
                row.sourceRef(),
                row.sourceText(),
                null);
    }

    private static byte[] content(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read the uploaded file.", e);
        }
    }
}
