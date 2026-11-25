package com.lcs.findraco.support;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.controller.ContactRoutes;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** What the ITs of money to receive share: contact purchases, payments through the API and the balances they leave. */
public abstract class AbstractContactMoneyIT extends AbstractIntegrationTest {

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected JdbcTemplate jdbc;

    /** A purchase whose whole amount is the contact's share, dated {@code daysAgo} days before today. */
    protected Transaction purchase(Plan plan, User creator, Contact contact, String amount, int daysAgo) {
        return fixtures.aContactPurchase(
                plan, creator, contact, amount, today().minusDays(daysAgo), "Purchase " + amount + " -" + daysAgo);
    }

    /** The id of the purchase's share that goes to a contact: the id an allocation names. */
    protected long shareOf(Transaction purchase) {
        return jdbc.queryForObject(
                "SELECT id FROM transaction_participants WHERE transaction_id = ? AND contact_id IS NOT NULL",
                Long.class,
                purchase.getId());
    }

    protected static Map<String, Object> allocation(long participantId, String amount) {
        Map<String, Object> allocation = new LinkedHashMap<>();
        allocation.put("participantId", participantId);
        allocation.put("amount", new BigDecimal(amount));
        return allocation;
    }

    /** The request body of a payment of {@code amount} from {@code contact}, received by the caller, dated today. */
    protected Map<String, Object> repayment(String amount, Contact contact) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "CREDIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Pix from " + contact.getName());
        body.put("startDate", today().toString());
        body.put("kind", "REPAYMENT");
        body.put("contactId", contact.getId());
        return body;
    }

    protected static Map<String, Object> withAllocations(Map<String, Object> body, Object... allocations) {
        Map<String, Object> copy = new LinkedHashMap<>(body);
        copy.put("allocations", List.of(allocations));
        return copy;
    }

    protected ResultActions send(MockHttpServletRequestBuilder request, User caller, Object body) throws Exception {
        MockHttpServletRequestBuilder signed = request.with(testAuthHelper.asUser(caller));
        if (body != null) {
            signed = signed.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body));
        }
        return mockMvc.perform(signed);
    }

    protected JsonNode readBody(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }

    /** What the contact owes or holds in credit, as the list reports it, as "owed 50.00" or "credit 20.00". */
    protected String balanceOf(Plan plan, User caller, Contact contact) throws Exception {
        JsonNode contacts = readBody(mockMvc.perform(get(ContactRoutes.CONTACT, plan.getId())
                        .with(testAuthHelper.asUser(caller))
                        .param("archived", "true"))
                .andExpect(status().isOk()));
        for (JsonNode node : contacts) {
            if (node.path("id").asLong() == contact.getId()) {
                BigDecimal owed = node.path("owed").decimalValue();
                BigDecimal credit = node.path("credit").decimalValue();
                return credit.signum() > 0
                        ? "credit " + credit.setScale(2).toPlainString()
                        : "owed " + owed.setScale(2).toPlainString();
            }
        }
        throw new AssertionError("contact " + contact.getId() + " not listed in " + contacts);
    }

    protected JsonNode statement(Plan plan, User caller, Contact contact) throws Exception {
        return readBody(mockMvc.perform(get(ContactRoutes.CONTACT + "/{id}/statement", plan.getId(), contact.getId())
                        .with(testAuthHelper.asUser(caller)))
                .andExpect(status().isOk()));
    }

    /** The stored allocations of a repayment as "shareId=amount", by share id. */
    protected List<String> allocationsOf(long repaymentId) {
        return jdbc.queryForList(
                "SELECT participant_id || '=' || amount::text FROM repayment_allocations "
                        + "WHERE repayment_id = ? ORDER BY participant_id",
                String.class,
                repaymentId);
    }
}
