package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.exception.ContactExceptions;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.ContactBalance;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.repository.ContactLedgerRepository;
import com.lcs.findraco.plan.repository.ContactRepository;
import com.lcs.findraco.plan.request.ContactFilter;
import com.lcs.findraco.plan.request.CreateContactRequest;
import com.lcs.findraco.plan.request.UpdateContactRequest;
import com.lcs.findraco.plan.response.ContactResponse;
import com.lcs.findraco.shared.error.StaleVersionException;
import com.lcs.findraco.user.service.UserService;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The plan's contacts: people without a login whose shares of a split are not the plan's spending but money to
 * receive. Every member reads them; owners and editors manage them.
 */
@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final ContactLedgerRepository ledgerRepository;
    private final PlanAuthorization planAuthorization;
    private final UserService userService;
    private final EntityManager entityManager;
    private final Clock clock;

    public ContactService(
            ContactRepository contactRepository,
            ContactLedgerRepository ledgerRepository,
            PlanAuthorization planAuthorization,
            UserService userService,
            EntityManager entityManager,
            Clock clock) {
        this.contactRepository = contactRepository;
        this.ledgerRepository = ledgerRepository;
        this.planAuthorization = planAuthorization;
        this.userService = userService;
        this.entityManager = entityManager;
        this.clock = clock;
    }

    private Plan plan(PlanContext ctx) {
        return entityManager.getReference(Plan.class, ctx.planId());
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> findAll(ContactFilter filter, PlanContext ctx) {
        Map<Long, ContactBalance> balances = balances(ctx);
        return contactRepository.findAllByPlan(plan(ctx), filter.includeArchived()).stream()
                .map(contact ->
                        ContactResponse.from(contact, balances.getOrDefault(contact.getId(), ContactBalance.ZERO)))
                .toList();
    }

    @Transactional
    public ContactResponse create(CreateContactRequest dto, PlanContext ctx) {
        planAuthorization.requireCanManageContacts(ctx.role());
        requireNameFree(dto.name(), 0L, ctx);

        Contact contact = Contact.create(plan(ctx), dto.name(), clock.instant());
        return response(saveCheckingTheName(contact), ctx);
    }

    @Transactional
    public ContactResponse update(Long id, UpdateContactRequest dto, PlanContext ctx) {
        planAuthorization.requireCanManageContacts(ctx.role());
        Contact contact = find(id, ctx);
        StaleVersionException.requireCurrent(contact.getVersion(), dto.version());
        if (!contact.isArchived()) {
            requireNameFree(dto.name(), contact.getId(), ctx);
        }

        contact.rename(dto.name());
        return response(saveCheckingTheName(contact), ctx);
    }

    /** A contact with a balance, owed or credit, stays: only a settled one leaves the pickers. */
    @Transactional
    public ContactResponse archive(Long id, PlanContext ctx) {
        planAuthorization.requireCanManageContacts(ctx.role());
        Contact contact = find(id, ctx);
        if (!balance(contact.getId(), ctx).isSettled()) {
            throw new ContactExceptions.ContactBalanceNotZeroException();
        }

        contact.archive(clock.instant());
        return response(contactRepository.saveAndFlush(contact), ctx);
    }

    @Transactional
    public ContactResponse unarchive(Long id, PlanContext ctx) {
        planAuthorization.requireCanManageContacts(ctx.role());
        Contact contact = find(id, ctx);
        requireNameFree(contact.getName(), contact.getId(), ctx);

        contact.unarchive();
        return response(saveCheckingTheName(contact), ctx);
    }

    /** Only a contact nothing ever referred to goes; one with history is archived instead. */
    @Transactional
    public void delete(Long id, PlanContext ctx) {
        planAuthorization.requireCanManageContacts(ctx.role());
        Contact contact = find(id, ctx);
        if (ledgerRepository.countTransactionShares(contact.getId()) > 0
                || ledgerRepository.countSeriesShares(contact.getId()) > 0
                || ledgerRepository.countRepayments(contact.getId()) > 0) {
            throw new ContactExceptions.ContactInUseException();
        }
        contactRepository.delete(contact);
    }

    /**
     * The contact a split names, for the transaction feature: 404 outside the plan, and 422 when it is archived,
     * unless the row or series being edited already carries it ({@code alreadyOnRow}), which keeps its share until
     * an edit removes it, as a member who left the plan does.
     */
    @Transactional(readOnly = true)
    public Contact findForSplit(Long id, boolean alreadyOnRow, PlanContext ctx) {
        Contact contact = find(id, ctx);
        if (contact.isArchived() && !alreadyOnRow) {
            throw new ContactExceptions.ContactArchivedException();
        }
        return contact;
    }

    /**
     * The contact a repayment comes from, locked, for the transaction feature: 404 outside the plan, 422 when archived
     * unless the repayment being edited already comes from it. The lock serializes this save with every other save
     * that changes what the contact owes or has paid, so the allocations the caller checks next are not stale.
     */
    @Transactional
    public Contact lockForUpdate(Long id, boolean alreadyOnRow, PlanContext ctx) {
        Contact contact = contactRepository
                .findByIdAndPlanForUpdate(id, plan(ctx))
                .orElseThrow(() -> new ContactExceptions.ContactNotFoundException(id));
        if (contact.isArchived() && !alreadyOnRow) {
            throw new ContactExceptions.ContactArchivedException(
                    "contactId", "An archived contact cannot take a new payment.");
        }
        return contact;
    }

    /** One contact with its balance; 404 outside the plan. */
    @Transactional(readOnly = true)
    public ContactResponse get(Long id, PlanContext ctx) {
        return response(find(id, ctx), ctx);
    }

    /**
     * What each contact of the plan owes or holds in credit, by contact id; a contact absent from the map has a
     * zero balance. The one place the balance is computed: the contact's shares on the transactions actual for the
     * reader today (AD-025), less what its live repayments paid. A positive result is owed, a negative one credit.
     */
    @Transactional(readOnly = true)
    public Map<Long, ContactBalance> balances(PlanContext ctx) {
        LocalDate today = userService.today(ctx.userId());
        Map<Long, BigDecimal> net = new HashMap<>();
        for (Object[] row : ledgerRepository.sumActualSharesByContact(plan(ctx), today)) {
            net.merge((Long) row[0], (BigDecimal) row[1], BigDecimal::add);
        }
        for (Object[] row : ledgerRepository.sumLiveRepaymentsByContact(plan(ctx))) {
            net.merge((Long) row[0], ((BigDecimal) row[1]).negate(), BigDecimal::add);
        }
        Map<Long, ContactBalance> balances = new HashMap<>();
        net.forEach((contactId, amount) -> balances.put(contactId, ContactBalance.ofNet(amount)));
        return balances;
    }

    private ContactBalance balance(Long contactId, PlanContext ctx) {
        return balances(ctx).getOrDefault(contactId, ContactBalance.ZERO);
    }

    private ContactResponse response(Contact contact, PlanContext ctx) {
        return ContactResponse.from(contact, balance(contact.getId(), ctx));
    }

    private Contact find(Long id, PlanContext ctx) {
        return contactRepository
                .findByIdAndPlan(id, plan(ctx))
                .orElseThrow(() -> new ContactExceptions.ContactNotFoundException(id));
    }

    private void requireNameFree(String name, long exceptId, PlanContext ctx) {
        if (contactRepository.existsActiveNamed(plan(ctx), name.strip(), exceptId)) {
            throw new ContactExceptions.ContactNameTakenException();
        }
    }

    /** Two requests naming the same contact at once pass the check together; the unique index refuses the second. */
    private Contact saveCheckingTheName(Contact contact) {
        try {
            return contactRepository.saveAndFlush(contact);
        } catch (DataIntegrityViolationException e) {
            throw new ContactExceptions.ContactNameTakenException();
        }
    }
}
