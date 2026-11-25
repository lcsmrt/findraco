package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractContactMoneyIT;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.user.model.User;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;

/** What a contact's statement reports: its shares and payments by month, each share's status and the balance. */
class ContactStatementIT extends AbstractContactMoneyIT {

    @Test
    void groupsByMonthWithStatuses() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        YearMonth thisMonth = YearMonth.from(today());
        LocalDate older = thisMonth.minusMonths(2).atDay(5);
        LocalDate recent = thisMonth.minusMonths(1).atDay(5);
        LocalDate later = thisMonth.minusMonths(1).atDay(20);
        LocalDate planned = today().plusDays(10);
        Transaction paid = fixtures.aContactPurchase(plan, owner, mae, "200.00", older, "Gym");
        Transaction partial = fixtures.aContactPurchase(plan, owner, mae, "300.00", recent, "Market");
        Transaction open = fixtures.aContactPurchase(plan, owner, mae, "50.00", later, "Pharmacy");
        Transaction ahead = fixtures.aContactPurchase(plan, owner, mae, "120.00", planned, "Insurance");
        send(
                        post(TransactionRoutes.TRANSACTION, plan.getId()),
                        owner,
                        repaymentOn(
                                recent.plusDays(10),
                                withAllocations(
                                        repayment("300.00", mae),
                                        allocation(shareOf(paid), "200.00"),
                                        allocation(shareOf(partial), "100.00"))))
                .andExpect(status().isCreated());
        long unallocated = readBody(send(
                                post(TransactionRoutes.TRANSACTION, plan.getId()),
                                owner,
                                repaymentOn(older.plusDays(20), withAllocations(repayment("40.00", mae))))
                        .andExpect(status().isCreated()))
                .path("id")
                .asLong();

        JsonNode statement = statement(plan, owner, mae);

        List<String> months = months(statement);
        assertThat(months)
                .containsExactly(
                        YearMonth.from(planned).toString(),
                        YearMonth.from(recent).toString(),
                        YearMonth.from(older).toString());
        JsonNode plannedMonth = month(statement, YearMonth.from(planned));
        assertThat(plannedMonth.path("shares")).hasSize(1);
        assertShare(
                plannedMonth.path("shares").get(0),
                ahead,
                shareOf(ahead),
                "Insurance",
                planned,
                "120.00",
                "0",
                "PLANNED");
        assertThat(plannedMonth.path("repayments")).isEmpty();

        JsonNode recentMonth = month(statement, YearMonth.from(recent));
        assertThat(recentMonth.path("shares")).hasSize(2);
        assertShare(
                recentMonth.path("shares").get(0),
                partial,
                shareOf(partial),
                "Market",
                recent,
                "300.00",
                "100.00",
                "PARTIAL");
        assertShare(recentMonth.path("shares").get(1), open, shareOf(open), "Pharmacy", later, "50.00", "0", "OPEN");
        assertThat(recentMonth.path("repayments")).hasSize(1);
        assertThat(recentMonth.path("repayments").get(0).path("amount").decimalValue())
                .isEqualByComparingTo("300.00");
        assertThat(recentMonth.path("repayments").get(0).path("unallocated").decimalValue())
                .isEqualByComparingTo("0");

        JsonNode olderMonth = month(statement, YearMonth.from(older));
        assertThat(olderMonth.path("shares")).hasSize(1);
        assertShare(olderMonth.path("shares").get(0), paid, shareOf(paid), "Gym", older, "200.00", "200.00", "PAID");
        assertThat(olderMonth.path("repayments")).hasSize(1);
        assertThat(olderMonth.path("repayments").get(0).path("transactionId").asLong())
                .isEqualTo(unallocated);
        assertThat(olderMonth.path("repayments").get(0).path("unallocated").decimalValue())
                .isEqualByComparingTo("40.00");
        assertThat(statement.path("contact").path("name").asString()).isEqualTo("Mãe");
    }

    @Test
    void balanceLeavesPlannedOutAndShowsCredit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        purchase(plan, owner, mae, "200.00", 20);
        fixtures.aContactPurchase(plan, owner, mae, "120.00", today().plusDays(10), "Insurance");

        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment("150.00", mae))
                .andExpect(status().isCreated());
        JsonNode owing = statement(plan, owner, mae);
        assertThat(owing.path("owed").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(owing.path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(owing.path("contact").path("owed").decimalValue()).isEqualByComparingTo("50.00");

        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment("100.00", mae))
                .andExpect(status().isCreated());
        JsonNode credit = statement(plan, owner, mae);
        assertThat(credit.path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(credit.path("credit").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 50.00");
    }

    @Test
    void trashedRowsLeaveTheStatement() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction dinner = purchase(plan, owner, mae, "200.00", 20);
        long pix = readBody(send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment("150.00", mae))
                        .andExpect(status().isCreated()))
                .path("id")
                .asLong();

        long dinnerTrash = trash(plan, owner, dinner.getId());
        JsonNode withoutDinner = statement(plan, owner, mae);
        assertThat(rows(withoutDinner, "shares")).isEmpty();
        assertThat(rows(withoutDinner, "repayments")).hasSize(1);
        assertThat(withoutDinner.path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(withoutDinner.path("credit").decimalValue()).isEqualByComparingTo("150.00");
        restore(plan, owner, dinnerTrash);
        JsonNode back = statement(plan, owner, mae);
        assertThat(rows(back, "shares")).hasSize(1);
        assertThat(back.path("owed").decimalValue()).isEqualByComparingTo("50.00");

        long pixTrash = trash(plan, owner, pix);
        JsonNode withoutPix = statement(plan, owner, mae);
        assertThat(rows(withoutPix, "repayments")).isEmpty();
        assertThat(rows(withoutPix, "shares").get(0).path("status").asString()).isEqualTo("OPEN");
        assertThat(rows(withoutPix, "shares").get(0).path("allocated").decimalValue())
                .isEqualByComparingTo("0");
        assertThat(withoutPix.path("owed").decimalValue()).isEqualByComparingTo("200.00");
        restore(plan, owner, pixTrash);
        JsonNode restored = statement(plan, owner, mae);
        assertThat(rows(restored, "repayments")).hasSize(1);
        assertThat(rows(restored, "shares").get(0).path("status").asString()).isEqualTo("PARTIAL");
        assertThat(restored.path("owed").decimalValue()).isEqualByComparingTo("50.00");
    }

    private Map<String, Object> repaymentOn(LocalDate date, Map<String, Object> body) {
        Map<String, Object> copy = new LinkedHashMap<>(body);
        copy.put("startDate", date.toString());
        return copy;
    }

    private long trash(Plan plan, User caller, long transactionId) throws Exception {
        return readBody(send(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), transactionId), caller, null)
                        .andExpect(status().isOk()))
                .path("deletionId")
                .asLong();
    }

    private void restore(Plan plan, User caller, long deletionId) throws Exception {
        send(post(TransactionRoutes.TRASH + "/{deletionId}/restore", plan.getId(), deletionId), caller, null)
                .andExpect(status().isOk());
    }

    private static List<String> months(JsonNode statement) {
        return statement
                .path("months")
                .valueStream()
                .map(month -> month.path("month").asString())
                .toList();
    }

    private static JsonNode month(JsonNode statement, YearMonth month) {
        return statement
                .path("months")
                .valueStream()
                .filter(node -> node.path("month").asString().equals(month.toString()))
                .findFirst()
                .orElseThrow();
    }

    private static List<JsonNode> rows(JsonNode statement, String kind) {
        return statement
                .path("months")
                .valueStream()
                .flatMap(month -> month.path(kind).valueStream())
                .toList();
    }

    private void assertShare(
            JsonNode share,
            Transaction purchase,
            long participantId,
            String description,
            LocalDate date,
            String amount,
            String allocated,
            String status) {
        assertThat(share.path("participantId").asLong()).isEqualTo(participantId);
        assertThat(share.path("transactionId").asLong()).isEqualTo(purchase.getId());
        assertThat(share.path("description").asString()).isEqualTo(description);
        assertThat(share.path("date").asString()).isEqualTo(date.toString());
        assertThat(share.path("share").decimalValue()).isEqualByComparingTo(amount);
        assertThat(share.path("allocated").decimalValue()).isEqualByComparingTo(allocated);
        assertThat(share.path("status").asString()).isEqualTo(status);
    }
}
