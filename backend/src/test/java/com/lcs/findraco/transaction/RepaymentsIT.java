package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractContactMoneyIT;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;

/**
 * A payment from a contact through the API: it counts in no total, settles the shares it names (or the oldest ones),
 * never settles a share twice, and follows its purchases and its own edits and trash.
 */
class RepaymentsIT extends AbstractContactMoneyIT {

    @Autowired
    private DataSource dataSource;

    @Test
    void repaymentCountsInNoTotal() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        fixtures.aTransaction(plan, owner, new BigDecimal("100.00"), TransactionType.CREDIT);

        JsonNode repaid = created(plan, owner, repayment("150.00", mae));

        assertThat(repaid.path("kind").asString()).isEqualTo("REPAYMENT");
        assertThat(repaid.path("repayment").path("contactName").asString()).isEqualTo("Mãe");
        JsonNode summary = month(DashboardRoutes.DASHBOARD, plan, owner);
        assertThat(summary.path("totalIncome").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(summary.path("actualIncome").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("0");
        assertThat(summary.path("netBalance").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(summary.path("neutralIn").decimalValue()).isEqualByComparingTo("150.00");
        assertThat(summary.path("neutralOut").decimalValue()).isEqualByComparingTo("0");
        JsonNode people = summary.path("personBreakdown");
        assertThat(people).hasSize(1);
        assertThat(people.get(0).path("income").decimalValue()).isEqualByComparingTo("100.00");
        JsonNode trend = month(DashboardRoutes.DASHBOARD + "/trend", plan, owner);
        assertThat(trend).hasSize(1);
        assertThat(trend.get(0).path("income").decimalValue()).isEqualByComparingTo("100.00");

        JsonNode listed = readBody(send(get(TransactionRoutes.TRANSACTION, plan.getId()), owner, null)
                .andExpect(status().isOk()));
        assertThat(listed.path("content")).hasSize(2);
        JsonNode onlyRepayments = readBody(mockMvc.perform(get(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("kind", "REPAYMENT"))
                .andExpect(status().isOk()));
        assertThat(onlyRepayments.path("content")).hasSize(1);
        assertThat(onlyRepayments
                        .path("content")
                        .get(0)
                        .path("repayment")
                        .path("contactId")
                        .asLong())
                .isEqualTo(mae.getId());
    }

    @Test
    void storesExplicitAllocationsAndKeepsExcessAsCredit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact bia = fixtures.aContact(plan, "Bia");
        Transaction maeOct = purchase(plan, owner, mae, "200.00", 60);
        Transaction maeNov = purchase(plan, owner, mae, "300.00", 30);
        Transaction biaOct = purchase(plan, owner, bia, "200.00", 60);
        Transaction biaNov = purchase(plan, owner, bia, "300.00", 30);

        JsonNode novOnly =
                created(plan, owner, withAllocations(repayment("100.00", mae), allocation(shareOf(maeNov), "100.00")));

        assertThat(allocationsOf(novOnly.path("id").asLong())).containsExactly(shareOf(maeNov) + "=100.00");
        JsonNode stored = novOnly.path("repayment").path("allocations");
        assertThat(stored).hasSize(1);
        assertThat(stored.get(0).path("participantId").asLong()).isEqualTo(shareOf(maeNov));
        assertThat(stored.get(0).path("transactionId").asLong()).isEqualTo(maeNov.getId());
        assertThat(stored.get(0).path("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 400.00");
        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM repayment_allocations WHERE participant_id = ?",
                        Long.class,
                        shareOf(maeOct)))
                .isZero();

        JsonNode full = created(
                plan,
                owner,
                withAllocations(
                        repayment("600.00", bia),
                        allocation(shareOf(biaOct), "200.00"),
                        allocation(shareOf(biaNov), "300.00")));

        assertThat(allocationsOf(full.path("id").asLong()))
                .containsExactly(shareOf(biaOct) + "=200.00", shareOf(biaNov) + "=300.00");
        assertThat(balanceOf(plan, owner, bia)).isEqualTo("credit 100.00");
    }

    @Test
    void omittedAllocationsFillOldestFirst() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact bia = fixtures.aContact(plan, "Bia");
        // The newer purchase is stored first, so the order is the date's, not the id's.
        Transaction maeNov = purchase(plan, owner, mae, "300.00", 30);
        Transaction maeOct = purchase(plan, owner, mae, "200.00", 60);
        Transaction biaNov = purchase(plan, owner, bia, "300.00", 30);
        Transaction biaOct = purchase(plan, owner, bia, "200.00", 60);

        JsonNode three = created(plan, owner, repayment("300.00", mae));
        assertThat(allocationsOf(three.path("id").asLong()))
                .containsExactlyInAnyOrder(shareOf(maeOct) + "=200.00", shareOf(maeNov) + "=100.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 200.00");

        JsonNode more = created(plan, owner, repayment("250.00", mae));
        assertThat(allocationsOf(more.path("id").asLong())).containsExactly(shareOf(maeNov) + "=200.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 50.00");

        JsonNode six = created(plan, owner, repayment("600.00", bia));
        assertThat(allocationsOf(six.path("id").asLong()))
                .containsExactlyInAnyOrder(shareOf(biaOct) + "=200.00", shareOf(biaNov) + "=300.00");
        assertThat(balanceOf(plan, owner, bia)).isEqualTo("credit 100.00");
        assertThat(six.path("repayment").path("allocations")).hasSize(2);
    }

    @Test
    void allocationLimitsAreEnforced() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact bia = fixtures.aContact(plan, "Bia");
        long maeOct = shareOf(purchase(plan, owner, mae, "200.00", 60));
        long maeNov = shareOf(purchase(plan, owner, mae, "300.00", 30));
        long planned = shareOf(fixtures.aContactPurchase(plan, owner, mae, "120.00", today().plusDays(10), "Planned"));
        long biaShare = shareOf(purchase(plan, owner, bia, "50.00", 5));
        created(plan, owner, withAllocations(repayment("150.00", mae), allocation(maeOct, "150.00")));
        long before = count("transactions");

        // 50 is open on the October share, so 60 does not fit.
        refuse(
                plan,
                owner,
                withAllocations(repayment("100.00", mae), allocation(maeOct, "60.00")),
                "allocation-exceeds-open");
        refuse(
                plan,
                owner,
                withAllocations(repayment("100.00", mae), allocation(planned, "10.00")),
                "allocation-exceeds-open");
        refuse(
                plan,
                owner,
                withAllocations(repayment("100.00", mae), allocation(biaShare, "10.00")),
                "allocation-exceeds-open");
        refuse(
                plan,
                owner,
                withAllocations(repayment("100.00", mae), allocation(987654L, "10.00")),
                "allocation-exceeds-open");
        // Each allocation fits its share, together they exceed the 100 paid.
        refuse(
                plan,
                owner,
                withAllocations(repayment("100.00", mae), allocation(maeOct, "50.00"), allocation(maeNov, "60.00")),
                "allocation-exceeds-amount");

        assertThat(count("transactions")).isEqualTo(before);
        assertThat(count("repayment_allocations")).isEqualTo(1);
        // The same share twice adds up, so it is checked as one allocation.
        refuse(
                plan,
                owner,
                withAllocations(repayment("200.00", mae), allocation(maeOct, "30.00"), allocation(maeOct, "30.00")),
                "allocation-exceeds-open");
        JsonNode exact = created(plan, owner, withAllocations(repayment("100.00", mae), allocation(maeOct, "50.00")));
        assertThat(allocationsOf(exact.path("id").asLong())).containsExactly(maeOct + "=50.00");
    }

    @Test
    void concurrentRepaymentsNeverOverAllocate() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            for (int round = 0; round < 5; round++) {
                Contact contact = fixtures.aContact(plan, "Contact " + round);
                long share = shareOf(purchase(plan, owner, contact, "200.00", 10));
                Map<String, Object> body = withAllocations(repayment("200.00", contact), allocation(share, "200.00"));
                CountDownLatch go = new CountDownLatch(1);
                Callable<String> save = () -> {
                    go.await();
                    ResultActions sent = send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, body);
                    int status = sent.andReturn().getResponse().getStatus();
                    // The loser is the rule's refusal, not some other 422.
                    return status == 201
                            ? "201"
                            : status + " " + readBody(sent).path("type").asString();
                };
                Future<String> first = pool.submit(save);
                Future<String> second = pool.submit(save);
                go.countDown();

                assertThat(List.of(first.get(30, TimeUnit.SECONDS), second.get(30, TimeUnit.SECONDS)))
                        .as("round %d", round)
                        .containsExactlyInAnyOrder("201", "422 urn:findraco:problem:allocation-exceeds-open");
                assertThat(jdbc.queryForObject(
                                "SELECT SUM(amount) FROM repayment_allocations WHERE participant_id = ?",
                                BigDecimal.class,
                                share))
                        .isEqualByComparingTo("200.00");
                assertThat(jdbc.queryForObject(
                                "SELECT count(*) FROM transactions WHERE repayment_contact_id = ?",
                                Long.class,
                                contact.getId()))
                        .isEqualTo(1);
            }
        } finally {
            pool.shutdownNow();
        }
    }

    @Test
    void aRepaymentWaitsForTheLockOnItsContact() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        long share = shareOf(purchase(plan, owner, mae, "200.00", 10));
        long earlier = created(plan, owner, withAllocations(repayment("200.00", mae)))
                .path("id")
                .asLong();
        ExecutorService pool = Executors.newSingleThreadExecutor();
        try (Connection holder = dataSource.getConnection()) {
            // Another save of the same contact is in flight: it holds the lock and has taken the whole share.
            holder.setAutoCommit(false);
            try (Statement statement = holder.createStatement()) {
                statement.execute("SELECT id FROM contacts WHERE id = " + mae.getId() + " FOR NO KEY UPDATE");
                statement.execute("INSERT INTO repayment_allocations (repayment_id, participant_id, amount) VALUES ("
                        + earlier + ", " + share + ", 200.00)");
            }

            Future<ResultActions> waiting = pool.submit(() -> send(
                    post(TransactionRoutes.TRANSACTION, plan.getId()),
                    owner,
                    withAllocations(repayment("200.00", mae), allocation(share, "200.00"))));
            assertThatThrownBy(() -> waiting.get(1500, TimeUnit.MILLISECONDS)).isInstanceOf(TimeoutException.class);
            holder.commit();

            waiting.get(30, TimeUnit.SECONDS)
                    .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "allocation-exceeds-open"));
        } finally {
            pool.shutdownNow();
        }
        assertThat(count("repayment_allocations")).isEqualTo(1);
    }

    @Test
    void editReplacesAndTrashSuspendsAllocations() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction oct = purchase(plan, owner, mae, "200.00", 60);
        Transaction nov = purchase(plan, owner, mae, "300.00", 30);
        JsonNode pix = created(plan, owner, repayment("300.00", mae));
        long pixId = pix.path("id").asLong();
        assertThat(allocationsOf(pixId)).containsExactlyInAnyOrder(shareOf(oct) + "=200.00", shareOf(nov) + "=100.00");

        Map<String, Object> edit =
                new LinkedHashMap<>(withAllocations(repayment("300.00", mae), allocation(shareOf(nov), "300.00")));
        edit.put("items", List.of());
        edit.put("version", pix.path("version").asLong());
        JsonNode edited = readBody(send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), pixId), owner, edit)
                .andExpect(status().isOk()));

        assertThat(allocationsOf(pixId)).containsExactly(shareOf(nov) + "=300.00");
        assertThat(edited.path("repayment").path("allocations")).hasSize(1);
        assertThat(shareStatuses(statement(plan, owner, mae))).containsExactly("PAID", "OPEN");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 200.00");

        long deletionId = readBody(
                        send(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), pixId), owner, null)
                                .andExpect(status().isOk()))
                .path("deletionId")
                .asLong();

        assertThat(shareStatuses(statement(plan, owner, mae))).containsExactly("OPEN", "OPEN");
        assertThat(statement(plan, owner, mae).path("months").get(0).path("repayments"))
                .isEmpty();
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 500.00");
        assertThat(allocationsOf(pixId)).hasSize(1);

        send(post(TransactionRoutes.TRASH + "/{deletionId}/restore", plan.getId(), deletionId), owner, null)
                .andExpect(status().isOk());

        assertThat(shareStatuses(statement(plan, owner, mae))).containsExactly("PAID", "OPEN");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 200.00");
    }

    @Test
    void aSettledPurchaseMovedToAFutureDateReleasesItsAllocation() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction dinner = purchase(plan, owner, mae, "100.00", 10);
        long share = shareOf(dinner);
        long pixId = created(plan, owner, withAllocations(repayment("100.00", mae), allocation(share, "100.00")))
                .path("id")
                .asLong();
        assertThat(allocationsOf(pixId)).containsExactly(share + "=100.00");

        editPurchase(plan, owner, dinner, "100.00", Map.of("contactId", mae.getId()), today().plusDays(40));

        JsonNode after = statement(plan, owner, mae);
        assertThat(shareStatuses(after)).containsExactly("PLANNED");
        assertThat(allocationsOf(pixId)).isEmpty();
        assertThat(unallocatedOf(after, pixId)).isEqualByComparingTo("100.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 100.00");
    }

    @Test
    void editingAPaymentWhileItsPurchaseIsTrashedKeepsThatSettlement() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Transaction dinner = purchase(plan, owner, mae, "200.00", 10);
        long share = shareOf(dinner);
        JsonNode pix = created(plan, owner, withAllocations(repayment("200.00", mae), allocation(share, "200.00")));
        long pixId = pix.path("id").asLong();
        long deletionId = trash(plan, owner, dinner.getId());

        // What the form sends back: the response's allocations, which leave out the trashed purchase.
        Map<String, Object> rename = new LinkedHashMap<>(withAllocations(repayment("200.00", mae)));
        rename.put("description", "Pix, renamed");
        rename.put("items", List.of());
        rename.put("version", pix.path("version").asLong());
        send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), pixId), owner, rename)
                .andExpect(status().isOk());
        assertThat(allocationsOf(pixId)).containsExactly(share + "=200.00");

        restore(plan, owner, deletionId);

        JsonNode restored = statement(plan, owner, mae);
        assertThat(shareStatuses(restored)).containsExactly("PAID");
        assertThat(unallocatedOf(restored, pixId)).isEqualByComparingTo("0");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("owed 0.00");

        // A payment edited down meanwhile never settles more than it paid once the purchase is back.
        Transaction lunch = purchase(plan, owner, mae, "300.00", 8);
        long lunchShare = shareOf(lunch);
        JsonNode second =
                created(plan, owner, withAllocations(repayment("300.00", mae), allocation(lunchShare, "300.00")));
        long secondId = second.path("id").asLong();
        long lunchDeletion = trash(plan, owner, lunch.getId());
        Map<String, Object> lower = new LinkedHashMap<>(withAllocations(repayment("100.00", mae)));
        lower.put("items", List.of());
        lower.put("version", second.path("version").asLong());
        send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), secondId), owner, lower)
                .andExpect(status().isOk());

        restore(plan, owner, lunchDeletion);

        assertThat(allocationsOf(secondId)).containsExactly(lunchShare + "=100.00");
        assertThat(shareStatuses(statement(plan, owner, mae))).containsExactly("PAID", "PARTIAL");
    }

    @Test
    void reducingAShareCutsNewestPaymentsFirst() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact bia = fixtures.aContact(plan, "Bia");
        Transaction dinner = purchase(plan, owner, mae, "100.00", 20);
        long share = shareOf(dinner);
        long pixA = created(plan, owner, on(withAllocations(repayment("60.00", mae), allocation(share, "60.00")), 3))
                .path("id")
                .asLong();
        long pixB = created(plan, owner, on(withAllocations(repayment("40.00", mae), allocation(share, "40.00")), 1))
                .path("id")
                .asLong();

        editPurchase(plan, owner, dinner, "70.00", Map.of("contactId", mae.getId()));

        assertThat(allocationsOf(pixA)).containsExactly(share + "=60.00");
        assertThat(allocationsOf(pixB)).containsExactly(share + "=10.00");
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 30.00");

        editPurchase(plan, owner, dinner, "70.00", Map.of("memberId", owner.getId()));

        assertThat(count("repayment_allocations")).isZero();
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 100.00");

        Transaction lunch = purchase(plan, owner, bia, "100.00", 15);
        long lunchShare = shareOf(lunch);
        long pixC = created(plan, owner, withAllocations(repayment("100.00", bia), allocation(lunchShare, "100.00")))
                .path("id")
                .asLong();
        long deletionId = readBody(
                        send(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), lunch.getId()), owner, null)
                                .andExpect(status().isOk()))
                .path("deletionId")
                .asLong();

        JsonNode trashed = statement(plan, owner, bia);
        assertThat(trashed.path("months").get(0).path("shares")).isEmpty();
        assertThat(trashed.path("months")
                        .get(0)
                        .path("repayments")
                        .get(0)
                        .path("unallocated")
                        .decimalValue())
                .isEqualByComparingTo("100.00");
        assertThat(balanceOf(plan, owner, bia)).isEqualTo("credit 100.00");
        assertThat(allocationsOf(pixC)).containsExactly(lunchShare + "=100.00");

        send(post(TransactionRoutes.TRASH + "/{deletionId}/restore", plan.getId(), deletionId), owner, null)
                .andExpect(status().isOk());

        JsonNode restored = statement(plan, owner, bia);
        assertThat(shareStatuses(restored)).containsExactly("PAID");
        assertThat(restored.path("months")
                        .get(0)
                        .path("repayments")
                        .get(0)
                        .path("unallocated")
                        .decimalValue())
                .isEqualByComparingTo("0");
        assertThat(balanceOf(plan, owner, bia)).isEqualTo("owed 0.00");
    }

    @Test
    void restoringARepaymentCutsBackWhatOthersTookMeanwhile() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        Contact mae = fixtures.aContact(plan, "Mãe");
        long share = shareOf(purchase(plan, owner, mae, "100.00", 20));
        long older = created(plan, owner, on(withAllocations(repayment("100.00", mae), allocation(share, "100.00")), 3))
                .path("id")
                .asLong();
        long deletionId = readBody(
                        send(delete(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), older), owner, null)
                                .andExpect(status().isOk()))
                .path("deletionId")
                .asLong();
        long newer = created(plan, owner, on(withAllocations(repayment("100.00", mae), allocation(share, "100.00")), 1))
                .path("id")
                .asLong();

        send(post(TransactionRoutes.TRASH + "/{deletionId}/restore", plan.getId(), deletionId), owner, null)
                .andExpect(status().isOk());

        assertThat(allocationsOf(older)).containsExactly(share + "=100.00");
        assertThat(allocationsOf(newer)).isEmpty();
        assertThat(balanceOf(plan, owner, mae)).isEqualTo("credit 100.00");
    }

    @Test
    void aRepaymentNeedsItsContactAndFitsItsShape() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User contributor = fixtures.aUser();
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact gone = fixtures.aContact(plan, "Gone");
        Contact foreign = fixtures.aContact(fixtures.aPlan(owner), "Elsewhere");
        send(post(ContactRoutes.CONTACT + "/{id}/archive", plan.getId(), gone.getId()), owner, null)
                .andExpect(status().isOk());

        Map<String, Object> noContact = repayment("10.00", mae);
        noContact.remove("contactId");
        refuse(plan, owner, noContact, "neutral-kind-invalid");
        Map<String, Object> notARepayment = repayment("10.00", mae);
        notARepayment.remove("kind");
        refuse(plan, owner, notARepayment, "neutral-kind-invalid");
        Map<String, Object> allocationsOnly = new LinkedHashMap<>(notARepayment);
        allocationsOnly.remove("contactId");
        allocationsOnly.put("allocations", List.of());
        refuse(plan, owner, allocationsOnly, "neutral-kind-invalid");
        Map<String, Object> debit = repayment("10.00", mae);
        debit.put("type", "DEBIT");
        refuse(plan, owner, debit, "neutral-kind-invalid");
        Map<String, Object> twoMembers = repayment("10.00", mae);
        twoMembers.put(
                "participants", List.of(Map.of("memberId", owner.getId()), Map.of("memberId", contributor.getId())));
        refuse(plan, owner, twoMembers, "neutral-kind-invalid");
        refuse(plan, owner, repayment("10.00", gone), "contact-archived");
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, repayment("10.00", foreign))
                .andExpect(problem(HttpStatus.NOT_FOUND, "contact-not-found"));
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), contributor, repayment("10.00", mae))
                .andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));

        assertThat(count("transactions")).isZero();
        created(plan, owner, repayment("10.00", mae));
    }

    private JsonNode created(Plan plan, User caller, Map<String, Object> body) throws Exception {
        return readBody(send(post(TransactionRoutes.TRANSACTION, plan.getId()), caller, body)
                .andExpect(status().isCreated()));
    }

    private void refuse(Plan plan, User caller, Map<String, Object> body, String slug) throws Exception {
        send(post(TransactionRoutes.TRANSACTION, plan.getId()), caller, body)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, slug));
    }

    private Map<String, Object> on(Map<String, Object> body, int daysAgo) {
        Map<String, Object> copy = new LinkedHashMap<>(body);
        copy.put("startDate", today().minusDays(daysAgo).toString());
        return copy;
    }

    private void editPurchase(
            Plan plan, User caller, Transaction purchase, String amount, Map<String, Object> participant)
            throws Exception {
        editPurchase(plan, caller, purchase, amount, participant, purchase.getStartDate());
    }

    private void editPurchase(
            Plan plan,
            User caller,
            Transaction purchase,
            String amount,
            Map<String, Object> participant,
            LocalDate date)
            throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", purchase.getDescription());
        body.put("startDate", date.toString());
        body.put("splitMode", "EQUAL");
        body.put("participants", List.of(participant));
        body.put("items", List.of());
        body.put("version", fixtures.transactionVersion(purchase.getId()));
        send(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), purchase.getId()), caller, body)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(Double.parseDouble(amount)));
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

    /** What the statement says the payment left unallocated, the contact's credit from it. */
    private static BigDecimal unallocatedOf(JsonNode statement, long repaymentId) {
        for (JsonNode month : statement.path("months")) {
            for (JsonNode payment : month.path("repayments")) {
                if (payment.path("transactionId").asLong() == repaymentId) {
                    return payment.path("unallocated").decimalValue();
                }
            }
        }
        throw new AssertionError("payment " + repaymentId + " not on the statement " + statement);
    }

    private static List<String> shareStatuses(JsonNode statement) {
        List<String> statuses = new ArrayList<>();
        for (JsonNode month : statement.path("months")) {
            for (JsonNode share : month.path("shares")) {
                statuses.add(share.path("status").asString());
            }
        }
        return statuses;
    }

    private JsonNode month(String route, Plan plan, User caller) throws Exception {
        LocalDate first = today().withDayOfMonth(1);
        return readBody(mockMvc.perform(get(route, plan.getId())
                        .with(testAuthHelper.asUser(caller))
                        .param("startDate", first.toString())
                        .param("endDate", first.plusMonths(1).minusDays(1).toString()))
                .andExpect(status().isOk()));
    }

    private long count(String table) {
        return jdbc.queryForObject("SELECT count(*) FROM " + table, Long.class);
    }
}
