package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RepaymentAllocation;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.transaction.repository.ContactShareRepository;
import com.lcs.findraco.transaction.repository.RepaymentAllocationRepository;
import com.lcs.findraco.transaction.request.RepaymentAllocationRequest;
import com.lcs.findraco.transaction.response.RepaymentAllocationResponse;
import com.lcs.findraco.transaction.response.RepaymentResponse;
import com.lcs.findraco.user.service.UserService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Which contact shares a repayment settles. The rule: the live allocations of a share never add up to more than the
 * share, and a repayment never allocates more than it paid. Callers lock the contact first (see
 * {@code ContactService#lockForUpdate}), so what is read here is not changed by another save before this one ends.
 */
@Service
public class RepaymentAllocationService {

    private static final BigDecimal ZERO = new BigDecimal("0.00");

    private final RepaymentAllocationRepository allocationRepository;
    private final ContactShareRepository shareRepository;
    private final UserService userService;

    public RepaymentAllocationService(
            RepaymentAllocationRepository allocationRepository,
            ContactShareRepository shareRepository,
            UserService userService) {
        this.allocationRepository = allocationRepository;
        this.shareRepository = shareRepository;
        this.userService = userService;
    }

    /**
     * Replaces what {@code repayment} settles, whether it is new or edited. {@code requested} lists the shares and
     * amounts; omitted, the payment settles the contact's oldest open shares first, the last one possibly in part.
     * Any amount beyond what is allocated is the contact's credit, which has no row. What the payment settles on a
     * purchase in the trash is kept, not replaced: an edit cannot see it, and the purchase comes back settled.
     */
    @Transactional
    public void allocate(Transaction repayment, @Nullable List<RepaymentAllocationRequest> requested, PlanContext ctx) {
        allocationRepository.deleteReplaceableByRepayment(
                repayment, repayment.getRepaymentContact().getId());
        BigDecimal kept = allocationRepository.sumOnTrashedPurchases(repayment);

        Map<Long, Open> open = openShares(repayment, ctx);
        Map<TransactionParticipant, BigDecimal> chosen = requested == null
                ? oldestFirst(repayment.getAmount().subtract(kept).max(ZERO), open)
                : explicit(requested, open);

        BigDecimal total = chosen.values().stream().reduce(ZERO, BigDecimal::add);
        if (total.compareTo(repayment.getAmount()) > 0) {
            throw new TransactionExceptions.AllocationExceedsAmountException();
        }
        chosen.forEach((share, amount) ->
                allocationRepository.save(new RepaymentAllocation(repayment, share, amount.setScale(2))));
    }

    /** The shares of the repayment's contact that can still take money: actual, live, with something open. */
    private Map<Long, Open> openShares(Transaction repayment, PlanContext ctx) {
        LocalDate today = userService.today(ctx.userId());
        List<TransactionParticipant> actual =
                shareRepository
                        .findLiveOfContactOldestFirst(
                                repayment.getRepaymentContact().getId())
                        .stream()
                        .filter(share -> share.getTransaction().status(today) == TransactionStatus.ACTUAL)
                        .toList();
        Map<Long, BigDecimal> settled =
                settledOf(actual.stream().map(TransactionParticipant::getId).toList());

        Map<Long, Open> open = new LinkedHashMap<>();
        for (TransactionParticipant share : actual) {
            BigDecimal left = share.getShareAmount().subtract(settled.getOrDefault(share.getId(), ZERO));
            open.put(share.getId(), new Open(share, left));
        }
        return open;
    }

    private Map<Long, BigDecimal> settledOf(Collection<Long> participantIds) {
        Map<Long, BigDecimal> settled = new HashMap<>();
        if (participantIds.isEmpty()) {
            return settled;
        }
        for (Object[] row : allocationRepository.sumLiveByParticipant(participantIds)) {
            settled.put((Long) row[0], (BigDecimal) row[1]);
        }
        return settled;
    }

    private static Map<TransactionParticipant, BigDecimal> explicit(
            List<RepaymentAllocationRequest> requested, Map<Long, Open> open) {
        Map<Long, BigDecimal> perShare = new LinkedHashMap<>();
        for (RepaymentAllocationRequest allocation : requested) {
            perShare.merge(allocation.participantId(), allocation.amount(), BigDecimal::add);
        }
        Map<TransactionParticipant, BigDecimal> chosen = new LinkedHashMap<>();
        perShare.forEach((participantId, amount) -> {
            // A share of another contact, a planned or trashed one and a made-up id all have no room.
            Open room = open.get(participantId);
            if (room == null || amount.compareTo(room.left()) > 0) {
                throw new TransactionExceptions.AllocationExceedsOpenException();
            }
            chosen.put(room.share(), amount);
        });
        return chosen;
    }

    private static Map<TransactionParticipant, BigDecimal> oldestFirst(BigDecimal amount, Map<Long, Open> open) {
        Map<TransactionParticipant, BigDecimal> chosen = new LinkedHashMap<>();
        BigDecimal remaining = amount;
        for (Open room : open.values()) {
            if (remaining.signum() <= 0) {
                break;
            }
            if (room.left().signum() <= 0) {
                continue;
            }
            BigDecimal take = room.left().min(remaining);
            chosen.put(room.share(), take);
            remaining = remaining.subtract(take);
        }
        return chosen;
    }

    private record Open(TransactionParticipant share, BigDecimal left) {}

    /** Frees what a repayment settled: it stopped being one, so the amount it paid is no longer allocated. */
    @Transactional
    public void release(Transaction repayment) {
        allocationRepository.deleteByRepayment(repayment);
    }

    /**
     * Cuts the allocations of the shares back to what each share holds, newest repayment first: a share reduced
     * below what repayments settled of it gives back the most recent payments' part, which becomes the contact's
     * credit. A share that is not actual (planned, or waiting to be confirmed) holds nothing, so all its allocations
     * go back. Callers flush the change to the shares first.
     */
    @Transactional
    public void fitToShares(Collection<Long> participantIds, PlanContext ctx) {
        if (participantIds.isEmpty()) {
            return;
        }
        LocalDate today = userService.today(ctx.userId());
        Map<Long, BigDecimal> excess = new HashMap<>();
        List<RepaymentAllocation> newestFirst = allocationRepository.findLiveByParticipantNewestFirst(participantIds);
        for (RepaymentAllocation allocation : newestFirst) {
            TransactionParticipant share = allocation.getParticipant();
            excess.merge(share.getId(), allocation.getAmount(), BigDecimal::add);
        }
        for (RepaymentAllocation allocation : newestFirst) {
            TransactionParticipant share = allocation.getParticipant();
            BigDecimal held =
                    share.getTransaction().status(today) == TransactionStatus.ACTUAL ? share.getShareAmount() : ZERO;
            BigDecimal over = excess.get(share.getId()).subtract(held);
            if (over.signum() <= 0) {
                continue;
            }
            BigDecimal cut = over.min(allocation.getAmount());
            excess.put(share.getId(), excess.get(share.getId()).subtract(cut));
            cutBack(allocation, cut);
        }
    }

    private void cutBack(RepaymentAllocation allocation, BigDecimal cut) {
        if (cut.compareTo(allocation.getAmount()) == 0) {
            allocationRepository.delete(allocation);
        } else {
            allocation.cutBackTo(allocation.getAmount().subtract(cut));
        }
    }

    /**
     * After a restore: the shares of the restored purchases and those the restored repayments settle may have been
     * given to others meanwhile, and a payment edited while a purchase was in the trash may now settle more than it
     * paid. Shares are cut back first; then a payment over its amount gives back what it settled on the restored
     * purchases before anything else, as the person editing could not see those.
     */
    @Transactional
    public void fitToRestored(Collection<Transaction> restored, PlanContext ctx) {
        List<Long> repaymentIds = restored.stream()
                .filter(row -> row.getKind() == TransactionKind.REPAYMENT)
                .map(Transaction::getId)
                .toList();
        Set<Long> restoredShares = new HashSet<>();
        restored.stream()
                .filter(row -> row.getKind() != TransactionKind.REPAYMENT)
                .forEach(row -> restoredShares.addAll(contactShareIds(row)));
        Set<Long> shares = new HashSet<>(restoredShares);
        if (!repaymentIds.isEmpty()) {
            shares.addAll(allocationRepository.findParticipantIdsOf(repaymentIds));
        }
        fitToShares(shares, ctx);

        Set<Long> payments = new HashSet<>(repaymentIds);
        if (!restoredShares.isEmpty()) {
            allocationRepository
                    .findLiveByParticipantNewestFirst(restoredShares)
                    .forEach(
                            allocation -> payments.add(allocation.getRepayment().getId()));
        }
        capAtAmounts(payments, restoredShares);
    }

    private void capAtAmounts(Collection<Long> repaymentIds, Set<Long> restoredShares) {
        if (repaymentIds.isEmpty()) {
            return;
        }
        Map<Long, List<RepaymentAllocation>> byRepayment = new HashMap<>();
        for (RepaymentAllocation allocation : allocationRepository.findLiveByRepaymentIn(repaymentIds)) {
            byRepayment
                    .computeIfAbsent(allocation.getRepayment().getId(), id -> new ArrayList<>())
                    .add(allocation);
        }
        Comparator<RepaymentAllocation> restoredFirstThenNewest = Comparator.comparing(
                        (RepaymentAllocation allocation) -> !restoredShares.contains(
                                allocation.getParticipant().getId()))
                .thenComparing(Comparator.comparing(RepaymentAllocation::getId).reversed());
        byRepayment.values().forEach(allocations -> {
            BigDecimal over = allocations.stream()
                    .map(RepaymentAllocation::getAmount)
                    .reduce(ZERO, BigDecimal::add)
                    .subtract(allocations.getFirst().getRepayment().getAmount());
            for (RepaymentAllocation allocation :
                    allocations.stream().sorted(restoredFirstThenNewest).toList()) {
                if (over.signum() <= 0) {
                    break;
                }
                BigDecimal cut = over.min(allocation.getAmount());
                over = over.subtract(cut);
                cutBack(allocation, cut);
            }
        });
    }

    /** The ids of the shares that go to contacts, for {@link #fitToShares}. */
    public static Set<Long> contactShareIds(Transaction transaction) {
        return transaction.getParticipants().stream()
                .filter(share -> share.getContact() != null)
                .map(TransactionParticipant::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    /** What each repayment among {@code transactions} carries, by transaction id; nothing is read when none is one. */
    @Transactional(readOnly = true)
    public Map<Long, RepaymentResponse> responsesOf(Collection<Transaction> transactions) {
        List<Transaction> repayments = transactions.stream()
                .filter(row -> row.getKind() == TransactionKind.REPAYMENT)
                .toList();
        Map<Long, RepaymentResponse> responses = new HashMap<>();
        if (repayments.isEmpty()) {
            return responses;
        }
        Map<Long, List<RepaymentAllocationResponse>> allocations = new HashMap<>();
        for (RepaymentAllocation allocation : allocationRepository.findLiveByRepaymentIn(
                repayments.stream().map(Transaction::getId).toList())) {
            allocations
                    .computeIfAbsent(allocation.getRepayment().getId(), id -> new ArrayList<>())
                    .add(new RepaymentAllocationResponse(
                            allocation.getParticipant().getId(),
                            allocation.getParticipant().getTransaction().getId(),
                            allocation.getAmount()));
        }
        for (Transaction repayment : repayments) {
            responses.put(
                    repayment.getId(),
                    new RepaymentResponse(
                            repayment.getRepaymentContact().getId(),
                            repayment.getRepaymentContact().getName(),
                            allocations.getOrDefault(repayment.getId(), List.of())));
        }
        return responses;
    }
}
