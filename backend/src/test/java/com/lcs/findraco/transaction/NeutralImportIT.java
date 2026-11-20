package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

/** What the import marks on its own: a card bill payment. A Pix and a purchase stay normal rows. */
class NeutralImportIT extends AbstractIntegrationTest {

    private static final String STATEMENT = """
            date,amount,id,description
            15/11/2026,-1500.00,nu-1,Pagamento de fatura
            16/11/2026,-500.00,nu-2,Transferência enviada pelo Pix - MARINA SOUZA LIMA - ••.123.456-•• - NU PAGAMENTOS
            17/11/2026,-200.00,nu-3,Compra no débito - Mercado Central
            """;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void importMarksOnlyCardBillPayments() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(new MockMultipartFile(
                                "file", "nubank.csv", "text/csv", STATEMENT.getBytes(StandardCharsets.UTF_8)))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isCreated());

        List<Transaction> imported = transactionRepository.findAllByPlan(plan);
        assertThat(imported).hasSize(3);
        assertThat(imported)
                .filteredOn(row -> "nu-1".equals(row.getSourceRef()))
                .singleElement()
                .satisfies(bill -> {
                    assertThat(bill.getKind()).isEqualTo(TransactionKind.CARD_BILL_PAYMENT);
                    assertThat(bill.getAmount()).isEqualByComparingTo("1500.00");
                });
        assertThat(imported)
                .filteredOn(row -> !"nu-1".equals(row.getSourceRef()))
                .extracting(Transaction::getSourceRef, Transaction::getKind)
                .containsExactlyInAnyOrder(tuple("nu-2", null), tuple("nu-3", null));
    }
}
