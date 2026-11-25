package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * What the database refuses on its own, whatever code writes the row: a participant that is both a member and a
 * contact or neither, and a repayment that names no contact (or a contact on a row that is no repayment).
 */
class ContactSchemaIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void aTransactionParticipantIsAMemberOrAContactNeverBothNorNeither() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction row = fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), TransactionType.DEBIT);

        assertThatThrownBy(() -> insertParticipant(row.getId(), owner.getId(), mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_txn_participants_member_or_contact");
        assertThatThrownBy(() -> insertParticipant(row.getId(), null, null))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_txn_participants_member_or_contact");

        assertThat(participantCount(row.getId())).isEqualTo(1);
        insertParticipant(row.getId(), null, mae.getId());
        assertThat(participantCount(row.getId())).isEqualTo(2);
    }

    @Test
    void aContactTakesOnePartOfATransaction() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction row = fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), TransactionType.DEBIT);
        insertParticipant(row.getId(), null, mae.getId());

        assertThatThrownBy(() -> insertParticipant(row.getId(), null, mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("uk_txn_participants_txn_contact");
    }

    @Test
    void aSeriesParticipantIsAMemberOrAContactNeverBothNorNeither() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        long series = insertSeries(plan, owner);

        assertThatThrownBy(() -> insertSeriesParticipant(series, owner.getId(), mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_rec_def_participants_member_or_contact");
        assertThatThrownBy(() -> insertSeriesParticipant(series, null, null))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_rec_def_participants_member_or_contact");

        insertSeriesParticipant(series, null, mae.getId());
        assertThatThrownBy(() -> insertSeriesParticipant(series, null, mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("uk_recdef_participants_def_contact");
    }

    @Test
    void aRepaymentNamesItsContactAndNoOtherRowDoes() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");

        assertThatThrownBy(() -> insertTransaction(plan, owner, "REPAYMENT", null))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_transactions_repayment_contact");
        assertThatThrownBy(() -> insertTransaction(plan, owner, null, mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_transactions_repayment_contact");
        assertThatThrownBy(() -> insertTransaction(plan, owner, "REFUND", mae.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_transactions_repayment_contact");

        insertTransaction(plan, owner, "REPAYMENT", mae.getId());
        insertTransaction(plan, owner, null, null);
        insertTransaction(plan, owner, "REFUND", null);
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isEqualTo(3);
    }

    @Test
    void anAllocationIsPositiveOncePerPairAndFollowsItsRepaymentAndShare() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction purchase = fixtures.aTransaction(plan, owner, new BigDecimal("50.00"), TransactionType.DEBIT);
        insertParticipant(purchase.getId(), null, mae.getId());
        long share =
                jdbc.queryForObject("SELECT id FROM transaction_participants WHERE contact_id IS NOT NULL", Long.class);
        long first = insertRepayment(plan, owner, mae);
        long second = insertRepayment(plan, owner, mae);

        assertThatThrownBy(() -> insertAllocation(first, share, "0.00"))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_repayment_allocations_amount");
        assertThatThrownBy(() -> insertAllocation(first, share, "-1.00"))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_repayment_allocations_amount");
        insertAllocation(first, share, "10.00");
        assertThatThrownBy(() -> insertAllocation(first, share, "5.00"))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("uk_repayment_allocations_repayment_participant");
        insertAllocation(second, share, "5.00");
        assertThat(allocationCount()).isEqualTo(2);

        jdbc.update("DELETE FROM transactions WHERE id = ?", first);
        assertThat(allocationCount()).isEqualTo(1);
        jdbc.update("DELETE FROM transaction_participants WHERE id = ?", share);
        assertThat(allocationCount()).isZero();
    }

    private long insertRepayment(Plan plan, User owner, Contact contact) {
        return jdbc.queryForObject(
                "INSERT INTO transactions (plan_id, created_by, amount, description, type, start_date, "
                        + "confirmation, kind, repayment_contact_id) "
                        + "VALUES (?, ?, 10.00, 'Pix', 'CREDIT', '2026-01-01', 'BY_DATE', 'REPAYMENT', ?) RETURNING id",
                Long.class,
                plan.getId(),
                owner.getId(),
                contact.getId());
    }

    private void insertAllocation(long repaymentId, long participantId, String amount) {
        jdbc.update(
                "INSERT INTO repayment_allocations (repayment_id, participant_id, amount) VALUES (?, ?, ?::numeric)",
                repaymentId,
                participantId,
                amount);
    }

    private long allocationCount() {
        return jdbc.queryForObject("SELECT count(*) FROM repayment_allocations", Long.class);
    }

    private void insertParticipant(long transactionId, Long memberId, Long contactId) {
        jdbc.update(
                "INSERT INTO transaction_participants (transaction_id, member_user_id, contact_id, share_amount) "
                        + "VALUES (?, ?, ?, 10.00)",
                transactionId,
                memberId,
                contactId);
    }

    private long participantCount(long transactionId) {
        return jdbc.queryForObject(
                "SELECT count(*) FROM transaction_participants WHERE transaction_id = ?", Long.class, transactionId);
    }

    private long insertSeries(Plan plan, User owner) {
        return jdbc.queryForObject(
                "INSERT INTO recurrence_definitions (plan_id, created_by, series_id, type, amount, description, mode, "
                        + "recurrence_interval, start_date, day_of_month, requires_confirmation) "
                        + "VALUES (?, ?, 'series-1', 'DEBIT', 80.00, 'Gym', 'RECURRING', 'MONTHLY', '2026-03-16', 16, "
                        + "false) RETURNING id",
                Long.class,
                plan.getId(),
                owner.getId());
    }

    private void insertSeriesParticipant(long definitionId, Long memberId, Long contactId) {
        jdbc.update(
                "INSERT INTO recurrence_definition_participants (recurrence_definition_id, member_user_id, "
                        + "contact_id, share_amount) VALUES (?, ?, ?, 10.00)",
                definitionId,
                memberId,
                contactId);
    }

    private void insertTransaction(Plan plan, User owner, String kind, Long repaymentContactId) {
        jdbc.update(
                "INSERT INTO transactions (plan_id, created_by, amount, description, type, start_date, "
                        + "confirmation, kind, repayment_contact_id) "
                        + "VALUES (?, ?, 10.00, 'T', 'CREDIT', '2026-01-01', 'BY_DATE', ?, ?)",
                plan.getId(),
                owner.getId(),
                kind,
                repaymentContactId);
    }
}
