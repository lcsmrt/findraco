package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;

/** Contacts and payments from them through {@code /mcp}: who a name means, what a payment settles, who is owed. */
class McpContactsIT extends AbstractMcpIntegrationTest {

    private User named(String name) {
        User user = userIn("UTC");
        jdbc.update("UPDATE users SET name = ? WHERE id = ?", name, user.getId());
        return user;
    }

    private User memberNamed(Plan plan, String name, PlanRole role) {
        User user = fixtures.aUser();
        jdbc.update("UPDATE users SET name = ? WHERE id = ?", name, user.getId());
        fixtures.addMember(plan, user, role);
        return user;
    }

    private Map<String, Object> debit(String description, Object... extra) {
        return call(Map.of("type", "DEBIT", "description", description), extra);
    }

    private Map<String, Object> pix(String amount, String contact, Object... extra) {
        Map<String, Object> arguments =
                call(Map.of("type", "CREDIT", "description", "Pix from " + contact), "kind", "REPAYMENT");
        arguments.put("amount", new BigDecimal(amount));
        arguments.put("contact", contact);
        for (int i = 0; i < extra.length; i += 2) {
            arguments.put((String) extra[i], extra[i + 1]);
        }
        return arguments;
    }

    private Map<String, Object> call(Map<String, Object> base, Object... extra) {
        Map<String, Object> arguments = new LinkedHashMap<>(base);
        arguments.putIfAbsent("amount", 100);
        for (int i = 0; i < extra.length; i += 2) {
            arguments.put((String) extra[i], extra[i + 1]);
        }
        return arguments;
    }

    /** The parties a purchase's shares go to, as "contact:Name=amount" or "member:Name=amount", by share order. */
    private List<String> shares(long transactionId) {
        return jdbc.queryForList(
                "SELECT CASE WHEN p.contact_id IS NOT NULL THEN 'contact:' || c.name ELSE 'member:' || u.name END "
                        + "|| '=' || p.share_amount::text FROM transaction_participants p "
                        + "LEFT JOIN contacts c ON c.id = p.contact_id LEFT JOIN users u ON u.id = p.member_user_id "
                        + "WHERE p.transaction_id = ? ORDER BY p.id",
                String.class,
                transactionId);
    }

    private static List<String> texts(JsonNode array) {
        List<String> texts = new ArrayList<>();
        array.forEach(item -> texts.add(item.asString()));
        return texts;
    }

    @Test
    void attributedToResolvesContacts() throws Exception {
        User lucas = named("Lucas Silva");
        Plan plan = plan(lucas, "Home", true);
        memberNamed(plan, "Ana Costa", PlanRole.EDITOR);
        fixtures.aContact(plan, "Mãe");
        McpClient client = clientOf(lucas);

        JsonNode whole = client.callJson("create_transaction", debit("Farmácia", "attributedTo", List.of("mae")));
        JsonNode split =
                client.callJson("create_transaction", debit("Jantar", "attributedTo", List.of("Lucas", "Ana", "Mãe")));

        assertThat(shares(whole.path("transaction").path("id").asLong())).containsExactly("contact:Mãe=100.00");
        assertThat(texts(whole.path("transaction").path("attributedTo"))).containsExactly("Mãe");
        assertThat(shares(split.path("transaction").path("id").asLong()))
                .containsExactly("member:Lucas Silva=33.34", "member:Ana Costa=33.33", "contact:Mãe=33.33");
        assertThat(texts(split.path("transaction").path("attributedTo")))
                .containsExactlyInAnyOrder("Ana", "Lucas", "Mãe");

        String unknown =
                errorText(client.callTool("create_transaction", debit("Posto", "attributedTo", List.of("Zélia"))));
        assertThat(unknown).contains("Zélia", "Lucas Silva", "Ana Costa", "Mãe");

        fixtures.aContact(plan, "Ana");
        fixtures.aContact(plan, "Rafa Souza");
        memberNamed(plan, "Rafa Souza", PlanRole.EDITOR);
        String firstName =
                errorText(client.callTool("create_transaction", debit("Posto", "attributedTo", List.of("ana"))));
        String fullName =
                errorText(client.callTool("create_transaction", debit("Posto", "attributedTo", List.of("Rafa Souza"))));
        assertThat(firstName).contains("ambiguous", "Ana");
        assertThat(fullName).contains("ambiguous", "Rafa Souza");
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isEqualTo(2);
    }

    @Test
    void repaymentAppliesOldestFirst() throws Exception {
        User lucas = named("Lucas Silva");
        Plan plan = plan(lucas, "Home", true);
        Contact mae = fixtures.aContact(plan, "Mãe");
        Contact bia = fixtures.aContact(plan, "Bia");
        fixtures.aContactPurchase(plan, lucas, mae, "300.00", today().minusDays(30), "Market");
        fixtures.aContactPurchase(plan, lucas, mae, "200.00", today().minusDays(60), "Gym");
        fixtures.aContactPurchase(plan, lucas, bia, "300.00", today().minusDays(30), "Market");
        fixtures.aContactPurchase(plan, lucas, bia, "200.00", today().minusDays(60), "Gym");
        McpClient client = clientOf(lucas);

        JsonNode three = client.callJson("create_transaction", pix("300.00", "mae"));

        assertThat(three.path("transaction").path("kind").asString()).isEqualTo("REPAYMENT");
        assertThat(three.path("transaction").path("contact").asString()).isEqualTo("Mãe");
        JsonNode settled = three.path("repayment").path("settled");
        assertThat(settled).hasSize(2);
        assertThat(settled.get(0).path("description").asString()).isEqualTo("Gym");
        assertThat(settled.get(0).path("amount").decimalValue()).isEqualByComparingTo("200.00");
        assertThat(settled.get(0).path("status").asString()).isEqualTo("PAID");
        assertThat(settled.get(1).path("description").asString()).isEqualTo("Market");
        assertThat(settled.get(1).path("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(settled.get(1).path("status").asString()).isEqualTo("PARTIAL");
        assertThat(three.path("repayment").path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(three.path("repayment").path("unallocated").decimalValue()).isEqualByComparingTo("0");
        assertThat(three.path("repayment").path("owed").decimalValue()).isEqualByComparingTo("200.00");

        JsonNode six = client.callJson("create_transaction", pix("600.00", "Bia"));

        assertThat(six.path("repayment").path("settled")).hasSize(2);
        assertThat(six.path("repayment").path("credit").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(six.path("repayment").path("unallocated").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(six.path("repayment").path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(jdbc.queryForList(
                        "SELECT amount::text FROM repayment_allocations WHERE repayment_id = ? ORDER BY id",
                        String.class,
                        three.path("transaction").path("id").asLong()))
                .containsExactlyInAnyOrder("200.00", "100.00");
    }

    @Test
    void aRepaymentNeedsAKnownContactAndNoOtherKindTakesOne() throws Exception {
        User lucas = named("Lucas Silva");
        Plan plan = plan(lucas, "Home", true);
        fixtures.aContact(plan, "Mãe");
        McpClient client = clientOf(lucas);
        Map<String, Object> noContact = pix("10.00", "x");
        noContact.remove("contact");

        String missing = errorText(client.callTool("create_transaction", noContact));
        String unknown = errorText(client.callTool("create_transaction", pix("10.00", "Tia")));
        String stray = errorText(client.callTool("create_transaction", debit("Posto", "contact", "Mãe")));
        String debit = errorText(client.callTool("create_transaction", pix("10.00", "Mãe", "type", "DEBIT")));

        assertThat(missing).contains("contact");
        assertThat(unknown).contains("Tia", "Mãe");
        assertThat(stray).contains("REPAYMENT");
        assertThat(debit).contains("CREDIT");
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class))
                .isZero();
    }

    @Test
    void listsContactsAndNamesThemInTransactions() throws Exception {
        User lucas = named("Lucas Silva");
        Plan plan = plan(lucas, "Home", true);
        Contact ana = fixtures.aContact(plan, "Ana");
        fixtures.aContact(plan, "Bia");
        fixtures.aContact(plan, "Caio");
        Contact gone = fixtures.aContact(plan, "Dora");
        jdbc.update("UPDATE contacts SET archived_at = now() WHERE id = ?", gone.getId());
        fixtures.aContactPurchase(plan, lucas, ana, "50.00", today().minusDays(5), "Cinema");
        McpClient client = clientOf(lucas);
        client.callJson("create_transaction", pix("20.00", "Bia"));

        JsonNode contacts = client.callJson("list_contacts", Map.of());

        assertThat(contacts).hasSize(3);
        assertThat(contacts.get(0).path("name").asString()).isEqualTo("Ana");
        assertThat(contacts.get(0).path("owed").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(contacts.get(0).path("credit").decimalValue()).isEqualByComparingTo("0");
        assertThat(contacts.get(1).path("name").asString()).isEqualTo("Bia");
        assertThat(contacts.get(1).path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(contacts.get(1).path("credit").decimalValue()).isEqualByComparingTo("20.00");
        assertThat(contacts.get(2).path("name").asString()).isEqualTo("Caio");
        assertThat(contacts.get(2).path("owed").decimalValue()).isEqualByComparingTo("0");
        assertThat(contacts.get(2).path("credit").decimalValue()).isEqualByComparingTo("0");

        JsonNode page = client.callJson("list_transactions", Map.of());
        Map<String, JsonNode> byDescription = new LinkedHashMap<>();
        page.path("transactions")
                .forEach(row -> byDescription.put(row.path("description").asString(), row));
        assertThat(texts(byDescription.get("Cinema").path("attributedTo"))).containsExactly("Ana");
        assertThat(byDescription.get("Pix from Bia").path("kind").asString()).isEqualTo("REPAYMENT");
        assertThat(byDescription.get("Pix from Bia").path("contact").asString()).isEqualTo("Bia");
    }

    @Test
    void updatingARepaymentKeepsItsContactAndWhatItSettled() throws Exception {
        User lucas = named("Lucas Silva");
        Plan plan = plan(lucas, "Home", true);
        Contact mae = fixtures.aContact(plan, "Mãe");
        fixtures.aContactPurchase(plan, lucas, mae, "200.00", today().minusDays(60), "Gym");
        fixtures.aContactPurchase(plan, lucas, mae, "300.00", today().minusDays(30), "Market");
        McpClient client = clientOf(lucas);
        long id = client.callJson("create_transaction", pix("300.00", "Mãe"))
                .path("transaction")
                .path("id")
                .asLong();

        client.callJson("update_transaction", Map.of("id", id, "description", "Pix Mãe, March"));
        assertThat(jdbc.queryForList(
                        "SELECT amount::text FROM repayment_allocations WHERE repayment_id = ? ORDER BY id",
                        String.class,
                        id))
                .containsExactlyInAnyOrder("200.00", "100.00");

        client.callJson("update_transaction", Map.of("id", id, "amount", 250));
        assertThat(jdbc.queryForList(
                        "SELECT amount::text FROM repayment_allocations WHERE repayment_id = ? ORDER BY id",
                        String.class,
                        id))
                .containsExactlyInAnyOrder("200.00", "50.00");
        assertThat(jdbc.queryForObject("SELECT repayment_contact_id FROM transactions WHERE id = ?", Long.class, id))
                .isEqualTo(mae.getId());
    }
}
