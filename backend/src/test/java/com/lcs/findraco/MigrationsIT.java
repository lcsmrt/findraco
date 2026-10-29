package com.lcs.findraco;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Proves the FULL Flyway chain (V1..latest) is applied on the test database and that
 * no drift exists between the Flyway-built schema and the JPA entity model under
 * {@code ddl-auto=validate}.
 *
 * <p>The container is one per JVM, so Flyway runs the chain once, against a genuinely
 * empty database, the first time any {@code *IT} boots a context. This test does not
 * depend on which class that was: it inspects {@link Flyway#info()} and asserts that the
 * *exact* set of applied versions matches the *exact* set of {@code V*.sql} files on disk,
 * one-to-one, all in {@link MigrationState#SUCCESS}. That catches a missing, skipped, or
 * silently renamed migration file, which {@code HarnessSmokeIT}'s "at least one success"
 * check would not.
 */
class MigrationsIT extends AbstractIntegrationTest {

    private static final Pattern MIGRATION_FILE_PATTERN = Pattern.compile("V(\\d+(?:_\\d+)*)__.*\\.sql");

    @Autowired
    private Flyway flyway;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private DataSource dataSource;

    @Test
    void contextLoadsUnderDdlAutoValidateWithNoEntitySchemaDrift() {
        // application-test.properties pins spring.jpa.hibernate.ddl-auto=validate.
        // If the Flyway-built schema had drifted from the JPA entity mappings
        // (missing column, wrong type, renamed table, ...), Hibernate would throw
        // a SchemaManagementException during context refresh and this whole class
        // would never reach a @Test method. Asserting on the context here makes
        // that guarantee explicit and first-class rather than an implicit side
        // effect of every other *IT extending AbstractIntegrationTest.
        assertThat(applicationContext).isNotNull();
        assertThat(dataSource).isNotNull();
    }

    @Test
    void everyMigrationOnDiskIsAppliedAndSuccessful() throws IOException {
        List<String> versionsOnDisk = migrationVersionsOnDisk();
        assertThat(versionsOnDisk)
                .as("sanity check: migration files must be discoverable on the classpath")
                .isNotEmpty();

        MigrationInfo[] applied = flyway.info().applied();
        List<String> appliedVersions = Arrays.stream(applied)
                .map(MigrationInfo::getVersion)
                .filter(v -> v != null)
                .map(v -> v.getVersion())
                .collect(Collectors.toList());

        assertThat(appliedVersions)
                .as("every V*.sql file on disk must be applied, in order, with none missing/renamed/extra")
                .containsExactlyElementsOf(versionsOnDisk);

        // A database adopted via baseline-on-migrate reports its baseline row as BASELINE.
        assertThat(applied)
                .as("every applied migration must report state SUCCESS (or BASELINE for the baseline row)")
                .filteredOn(info -> info.getState() != MigrationState.BASELINE
                        || !info.getVersion().equals(flyway.getConfiguration().getBaselineVersion()))
                .extracting(MigrationInfo::getState)
                .containsOnly(MigrationState.SUCCESS);
    }

    /**
     * V11 (categories revamp): a category row written with only the pre-V11 columns, i.e. what
     * every existing category looks like after the migration, is a root with no owner and no
     * per-member limits.
     */
    @Test
    void existingCategoriesBecomeRootsWithNoOwnerAndNoMemberLimits() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        Plan plan = fixtures.aPlan(fixtures.aUser());
        Long categoryId = insertLegacyCategory(jdbc, plan, "Groceries");

        Map<String, Object> row = jdbc.queryForMap(
                "SELECT parent_id, owner_user_id FROM financial_transaction_categories WHERE id = ?", categoryId);
        assertThat(row.get("parent_id")).isNull();
        assertThat(row.get("owner_user_id")).isNull();

        Integer memberLimits = jdbc.queryForObject(
                "SELECT COUNT(*) FROM category_member_limits WHERE category_id = ?", Integer.class, categoryId);
        assertThat(memberLimits).isZero();
    }

    @Test
    void memberLimitForTheSameCategoryAndMemberTwiceIsRejectedByTheDatabase() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        User member = fixtures.aUser();
        Plan plan = fixtures.aPlan(member);
        Long categoryId = insertLegacyCategory(jdbc, plan, "Groceries");

        insertMemberLimit(jdbc, categoryId, member.getId(), "260.00");

        assertThatThrownBy(() -> insertMemberLimit(jdbc, categoryId, member.getId(), "140.00"))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("uk_cml_category_member");
    }

    @Test
    void negativeMemberLimitAmountIsRejectedByTheDatabase() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        User member = fixtures.aUser();
        Plan plan = fixtures.aPlan(member);
        Long categoryId = insertLegacyCategory(jdbc, plan, "Groceries");

        assertThatThrownBy(() -> insertMemberLimit(jdbc, categoryId, member.getId(), "-0.01"))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_cml_amount_non_negative");

        insertMemberLimit(jdbc, categoryId, member.getId(), "0.00");
        Integer stored = jdbc.queryForObject(
                "SELECT COUNT(*) FROM category_member_limits WHERE category_id = ?", Integer.class, categoryId);
        assertThat(stored).isEqualTo(1);
    }

    private static Long insertLegacyCategory(JdbcTemplate jdbc, Plan plan, String description) {
        return jdbc.queryForObject(
                "INSERT INTO financial_transaction_categories (plan_id, type, description, spending_limit) "
                        + "VALUES (?, 'DEBIT', ?, 400.00) RETURNING id",
                Long.class,
                plan.getId(),
                description);
    }

    private static void insertMemberLimit(JdbcTemplate jdbc, Long categoryId, Long memberId, String amount) {
        jdbc.update(
                "INSERT INTO category_member_limits (category_id, member_user_id, amount) VALUES (?, ?, ?::numeric)",
                categoryId,
                memberId,
                amount);
    }

    private List<String> migrationVersionsOnDisk() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath*:db/migration/V*.sql");
        return Arrays.stream(resources)
                .map(Resource::getFilename)
                .map(MIGRATION_FILE_PATTERN::matcher)
                .filter(Matcher::matches)
                .map(m -> m.group(1).replace('_', '.'))
                .sorted(Comparator.comparingDouble(Double::parseDouble))
                .collect(Collectors.toList());
    }
}
