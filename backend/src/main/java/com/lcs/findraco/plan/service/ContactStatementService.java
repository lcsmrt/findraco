package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.model.ContactShareStatus;
import com.lcs.findraco.plan.repository.ContactLedgerRepository;
import com.lcs.findraco.plan.response.ContactResponse;
import com.lcs.findraco.plan.response.ContactStatementMonthResponse;
import com.lcs.findraco.plan.response.ContactStatementRepaymentResponse;
import com.lcs.findraco.plan.response.ContactStatementResponse;
import com.lcs.findraco.plan.response.ContactStatementShareResponse;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionStatus;
import com.lcs.findraco.user.service.UserService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * What one contact owes and why: their shares and payments by month, each share with the status its allocations
 * give it. The balance is {@link ContactService#get}'s, the only place it is computed, so the statement and the
 * contact list never disagree; allocations decide only each line's status, not the balance.
 */
@Service
public class ContactStatementService {

    private static final BigDecimal ZERO = new BigDecimal("0.00");

    private final ContactService contactService;
    private final ContactLedgerRepository ledgerRepository;
    private final UserService userService;

    public ContactStatementService(
            ContactService contactService, ContactLedgerRepository ledgerRepository, UserService userService) {
        this.contactService = contactService;
        this.ledgerRepository = ledgerRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public ContactStatementResponse statement(Long contactId, PlanContext ctx) {
        ContactResponse contact = contactService.get(contactId, ctx);
        LocalDate today = userService.today(ctx.userId());

        Map<Long, BigDecimal> allocatedByShare = sums(ledgerRepository.sumLiveAllocationsByShare(contactId));
        Map<Long, BigDecimal> allocatedByRepayment = sums(ledgerRepository.sumLiveAllocationsByRepayment(contactId));

        Map<YearMonth, List<ContactStatementShareResponse>> shares = new TreeMap<>(Comparator.reverseOrder());
        for (TransactionParticipant share : ledgerRepository.findLiveShares(contactId)) {
            Transaction purchase = share.getTransaction();
            BigDecimal allocated = allocatedByShare.getOrDefault(share.getId(), ZERO);
            shares.computeIfAbsent(YearMonth.from(purchase.getStartDate()), month -> new ArrayList<>())
                    .add(new ContactStatementShareResponse(
                            share.getId(),
                            purchase.getId(),
                            purchase.getStartDate(),
                            purchase.getDescription(),
                            share.getShareAmount(),
                            allocated,
                            status(purchase, share.getShareAmount(), allocated, today)));
        }
        Map<YearMonth, List<ContactStatementRepaymentResponse>> repayments = new TreeMap<>(Comparator.reverseOrder());
        for (Transaction repayment : ledgerRepository.findLiveRepayments(contactId)) {
            BigDecimal allocated = allocatedByRepayment.getOrDefault(repayment.getId(), ZERO);
            repayments
                    .computeIfAbsent(YearMonth.from(repayment.getStartDate()), month -> new ArrayList<>())
                    .add(new ContactStatementRepaymentResponse(
                            repayment.getId(),
                            repayment.getStartDate(),
                            repayment.getAmount(),
                            repayment.getAmount().subtract(allocated)));
        }

        Map<YearMonth, ContactStatementMonthResponse> months = new TreeMap<>(Comparator.reverseOrder());
        shares.forEach((month, rows) ->
                months.put(month, new ContactStatementMonthResponse(month.toString(), rows, new ArrayList<>())));
        repayments.forEach((month, rows) -> months.compute(
                month,
                (key, existing) -> new ContactStatementMonthResponse(
                        key.toString(), existing == null ? List.of() : existing.shares(), rows)));
        return new ContactStatementResponse(contact, contact.owed(), contact.credit(), List.copyOf(months.values()));
    }

    private static ContactShareStatus status(
            Transaction purchase, BigDecimal share, BigDecimal allocated, LocalDate today) {
        if (purchase.status(today) != TransactionStatus.ACTUAL) {
            return ContactShareStatus.PLANNED;
        }
        if (allocated.signum() == 0) {
            return ContactShareStatus.OPEN;
        }
        return allocated.compareTo(share) >= 0 ? ContactShareStatus.PAID : ContactShareStatus.PARTIAL;
    }

    private static Map<Long, BigDecimal> sums(List<Object[]> rows) {
        Map<Long, BigDecimal> sums = new HashMap<>();
        for (Object[] row : rows) {
            sums.put((Long) row[0], (BigDecimal) row[1]);
        }
        return sums;
    }
}
