package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Proves {@code POST /transaction/import}: the file is stored whole or not at all, the bank's text and id
 * are kept, a row already stored is skipped, and a file the importer cannot read answers a typed 422. The
 * parsing rules themselves are unit-tested in {@code StatementParserRegistryTest}.
 */
class CsvImportIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    private static final String CSV = """
            date,amount,id,description
            15/07/2026,-50.00,nu-ext-1,Uber trip
            16/07/2026,1200.00,nu-ext-2,Salary payment
            17/07/2026,-89.90,nu-ext-3,"Restaurant, dinner with friends"
            """;

    @Test
    void reimportingTheSameCsvDoesNotDuplicateRowsBySourceRef() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode firstImport = importCsv(plan, owner, CSV);
        assertThat(firstImport.get("imported").asInt()).isEqualTo(3);

        List<Transaction> afterFirstImport = transactionRepository.findAllByPlan(plan);
        assertThat(afterFirstImport).hasSize(3);
        assertThat(afterFirstImport)
                .extracting(Transaction::getSourceRef)
                .containsExactlyInAnyOrder("nu-ext-1", "nu-ext-2", "nu-ext-3");

        JsonNode secondImport = importCsv(plan, owner, CSV);
        assertThat(secondImport.get("imported").asInt()).isEqualTo(0);
        assertThat(secondImport.get("skippedDuplicates").asInt()).isEqualTo(3);

        List<Transaction> afterSecondImport = transactionRepository.findAllByPlan(plan);
        assertThat(afterSecondImport).hasSize(3);
        assertThat(afterSecondImport)
                .extracting(Transaction::getSourceRef)
                .containsExactlyInAnyOrder("nu-ext-1", "nu-ext-2", "nu-ext-3");

        MvcResult listResult = mockMvc.perform(
                        get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode listBody = objectMapper.readTree(listResult.getResponse().getContentAsString());
        assertThat(listBody.get("totalElements").asLong()).isEqualTo(3);
    }

    @Test
    void reimportingWithOneNewSourceRefOnlyAddsTheNewRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        importCsv(plan, owner, CSV);

        String csvWithOneNewRow = CSV + "18/07/2026,-15.00,nu-ext-4,Pharmacy\n";
        JsonNode secondImport = importCsv(plan, owner, csvWithOneNewRow);

        assertThat(secondImport.get("imported").asInt()).isEqualTo(1);
        assertThat(secondImport.get("skippedDuplicates").asInt()).isEqualTo(3);

        List<Transaction> persisted = transactionRepository.findAllByPlan(plan);
        assertThat(persisted).hasSize(4);
        assertThat(persisted)
                .extracting(Transaction::getSourceRef)
                .containsExactlyInAnyOrder("nu-ext-1", "nu-ext-2", "nu-ext-3", "nu-ext-4");
    }

    @Test
    void theBanksTextAndIdAreStoredOnEveryRow() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        importCsv(plan, owner, CSV);

        assertThat(transactionRepository.findAllByPlan(plan))
                .extracting(Transaction::getSourceRef, Transaction::getSourceText, Transaction::getDescription)
                .contains(org.assertj.core.groups.Tuple.tuple(
                        "nu-ext-3", "Restaurant, dinner with friends", "Restaurant, dinner with friends"));
    }

    @Test
    void aLongBankTextIsKeptWholeInSourceTextAndCutInTheDescription() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String bankText = "x".repeat(255) + "-tail-only-the-source-text-keeps";

        importCsv(plan, owner, "date,amount,id,description\n15/07/2026,-5.00,long-1," + bankText + "\n");

        assertThat(transactionRepository.findAllByPlan(plan)).singleElement().satisfies(row -> {
            assertThat(row.getSourceText()).isEqualTo(bankText);
            assertThat(row.getDescription()).isEqualTo("x".repeat(255));
        });
    }

    @Test
    void oneBadLineImportsNothingAndIsListed() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = CSV + "99/99/2026,-1.00,nu-ext-4,Broken\n";

        upload(plan, owner, csv)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "import-line-invalid"))
                .andExpect(jsonPath("$.errors.length()").value(1))
                .andExpect(jsonPath("$.errors[0].line").value(5))
                .andExpect(jsonPath("$.errors[0].field").value("date"))
                .andExpect(jsonPath("$.errors[0].code").value("date-invalid"));

        assertThat(transactionRepository.findAllByPlan(plan)).isEmpty();

        importCsv(plan, owner, CSV);
        assertThat(transactionRepository.findAllByPlan(plan)).hasSize(3);
    }

    @Test
    void theErrorListStopsAtTheCap() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = "date,amount,id,description\n" + "bad,-1.00,x,Row\n".repeat(80);

        upload(plan, owner, csv)
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "import-line-invalid"))
                .andExpect(jsonPath("$.errors.length()").value(50));
    }

    @Test
    void aFileOverTheSizeBoundAnswers422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        String csv = "date,amount,id,description\n" + "a".repeat(1_048_577);

        upload(plan, owner, csv).andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "csv-too-large"));
    }

    @Test
    void aFileOverTheRowBoundAnswers422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        StringBuilder csv = new StringBuilder("date,amount,id,description\n");
        for (int i = 0; i < 5001; i++) {
            csv.append("15/07/2026,-1.00,r").append(i).append(",Row\n");
        }

        upload(plan, owner, csv.toString()).andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "csv-too-many-rows"));
        assertThat(transactionRepository.findAllByPlan(plan)).isEmpty();
    }

    @Test
    void aFileThatIsNotUtf8AnswersWithItsLine() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        byte[] bytes =
                "date,amount,id,description\n15/07/2026,-1.00,a,caf\u00e9\n".getBytes(StandardCharsets.ISO_8859_1);

        mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(new MockMultipartFile("file", "nubank.csv", "text/csv", bytes))
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "csv-encoding-invalid"))
                .andExpect(jsonPath("$.detail").value(org.hamcrest.Matchers.containsString("line 2")));
    }

    @Test
    void anUnknownHeaderAnswers422() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        upload(plan, owner, "foo,bar\n1,2\n")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "csv-unknown-format"));
    }

    @Test
    void aCardBillAnswersItsOwnType() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        upload(plan, owner, "date,category,title,amount\n2026-07-15,food,Pizza,30.00\n")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "csv-format-not-supported"));
    }

    private org.springframework.test.web.servlet.ResultActions upload(Plan plan, User asUser, String csvContent)
            throws Exception {
        return mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                .file(new MockMultipartFile(
                        "file", "nubank.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8)))
                .with(testAuthHelper.asUser(asUser)));
    }

    private JsonNode importCsv(Plan plan, User asUser, String csvContent) throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "nubank.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        MvcResult result = mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                        .file(file)
                        .with(testAuthHelper.asUser(asUser)))
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());

        // Import is 201 when it creates rows and 200 when every row was a duplicate (nothing
        // created) — assert the status honors both cases, keyed off the reported count.
        int expectedStatus = body.get("imported").asInt() > 0 ? 201 : 200;
        assertThat(result.getResponse().getStatus()).isEqualTo(expectedStatus);
        return body;
    }
}
