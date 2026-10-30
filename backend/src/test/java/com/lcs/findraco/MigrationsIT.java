package com.lcs.findraco;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.model.User;
import java.io.IOException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.testcontainers.postgresql.PostgreSQLContainer;

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

    private static final String SCRATCH_DATABASE = "findraco_test_v13_scratch";

    private static final Pattern MIGRATION_FILE_PATTERN = Pattern.compile("V(\\d+(?:_\\d+)*)__.*\\.sql");

    @Autowired
    private Flyway flyway;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PostgreSQLContainer postgres;

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

        Map<String, Object> row =
                jdbc.queryForMap("SELECT parent_id, owner_user_id FROM categories WHERE id = ?", categoryId);
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

    /** V13: both renamed tables carry only names under the pk_/uk_/fk_/idx_/ck_ convention. */
    @Test
    void transactionsAndCategoriesCarryTheConventionalConstraintAndIndexNames() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);

        assertThat(namesOf(jdbc, "SELECT conname FROM pg_constraint WHERE conrelid = 'public.transactions'::regclass"))
                .containsExactlyInAnyOrder(
                        "pk_transactions",
                        "ck_transactions_type",
                        "fk_transactions_plans",
                        "fk_transactions_created_by",
                        "fk_transactions_categories",
                        "fk_transactions_recurrence_definitions");
        assertThat(namesOf(jdbc, "SELECT conname FROM pg_constraint WHERE conrelid = 'public.categories'::regclass"))
                .containsExactlyInAnyOrder(
                        "pk_categories",
                        "ck_categories_type",
                        "fk_categories_plans",
                        "fk_categories_parent",
                        "fk_categories_owner_user");
        assertThat(namesOf(jdbc, "SELECT indexname FROM pg_indexes WHERE tablename = 'transactions'"))
                .containsExactlyInAnyOrder(
                        "pk_transactions",
                        "idx_transactions_start_date",
                        "idx_transactions_plan_id",
                        "idx_transactions_plan_id_start_date",
                        "idx_transactions_plan_id_series_id",
                        "idx_transactions_recurrence_definition_id");
        assertThat(namesOf(jdbc, "SELECT indexname FROM pg_indexes WHERE tablename = 'categories'"))
                .containsExactlyInAnyOrder("pk_categories", "idx_categories_parent_id");
        assertThat(namesOf(
                        jdbc,
                        "SELECT sequencename FROM pg_sequences WHERE sequencename IN "
                                + "('transactions_id_seq', 'categories_id_seq')"))
                .containsExactlyInAnyOrder("transactions_id_seq", "categories_id_seq");
    }

    /** V14: every instant column is timestamptz, and the old UTC wall-clock values keep their instant. */
    @Test
    void instantColumnsAreTimestamptz() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);

        assertThat(namesOf(
                        jdbc,
                        "SELECT table_name || '.' || column_name FROM information_schema.columns "
                                + "WHERE table_schema = 'public' AND table_name <> 'flyway_schema_history' "
                                + "AND data_type = 'timestamp without time zone'"))
                .isEmpty();
        assertThat(namesOf(
                        jdbc,
                        "SELECT table_name || '.' || column_name FROM information_schema.columns "
                                + "WHERE table_schema = 'public' AND data_type = 'timestamp with time zone'"))
                .containsExactlyInAnyOrder(
                        "password_reset_tokens.expires_at",
                        "user_sessions.expires_at",
                        "user_sessions.replaced_at",
                        "user_sessions.created_at",
                        "plans.deleted_at",
                        "plan_invitations.expires_at");
    }

    @Test
    void timestampsAreReadAsUtcAndExistingUsersGetTheDefaultZone() {
        migrateScratchDatabase(
                "13",
                "INSERT INTO users (id, email, name, password) VALUES (1, 'a@b.c', 'A', 'x');"
                        + "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) "
                        + "VALUES (1, 'h', '2026-01-01 12:00:00')",
                scratch -> {
                    OffsetDateTime expiresAt = scratch.queryForObject(
                            "SELECT expires_at FROM password_reset_tokens", OffsetDateTime.class);
                    assertThat(expiresAt).isNotNull();
                    assertThat(expiresAt.toInstant()).isEqualTo(Instant.parse("2026-01-01T12:00:00Z"));
                    Map<String, Object> user = scratch.queryForMap("SELECT time_zone, time_zone_mode FROM users");
                    assertThat(user)
                            .containsEntry("time_zone", "America/Sao_Paulo")
                            .containsEntry("time_zone_mode", "AUTOMATIC");
                });
    }

    @Test
    void timeZoneModeOutsideTheEnumIsRejectedByTheDatabase() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        User user = fixtures.aUser();

        assertThatThrownBy(
                        () -> jdbc.update("UPDATE users SET time_zone_mode = 'SOMETIMES' WHERE id = ?", user.getId()))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("ck_users_time_zone_mode");
    }

    @Test
    void renameMigrationAbortsWhenTransactionsAlreadyExists() {
        assertThatThrownBy(() -> migrateScratchDatabaseAfter("CREATE TABLE public.transactions (id bigint)"))
                .isInstanceOf(FlywayException.class)
                .hasMessageContaining("V13 precondition failed: transactions or categories already exists");
    }

    @Test
    void renameMigrationAbortsWhenTheOldTablesAreMissing() {
        assertThatThrownBy(() ->
                        migrateScratchDatabaseAfter("ALTER TABLE public.financial_transactions RENAME TO ledger_rows"))
                .isInstanceOf(FlywayException.class)
                .hasMessageContaining(
                        "V13 precondition failed: financial_transactions and financial_transaction_categories must exist");
    }

    /**
     * Builds a scratch database up to V12, applies {@code tamper}, then runs the rest of the chain.
     * The scratch database lives in the same container and is dropped afterwards.
     */
    private void migrateScratchDatabaseAfter(String tamper) {
        migrateScratchDatabase("12", tamper, jdbc -> {});
    }

    /**
     * Builds a scratch database up to {@code target}, applies {@code tamper}, runs the rest of the chain and
     * hands the migrated database to {@code verify}. The scratch database is dropped afterwards.
     */
    private void migrateScratchDatabase(String target, String tamper, Consumer<JdbcTemplate> verify) {
        JdbcTemplate admin = new JdbcTemplate(dataSource);
        admin.execute("DROP DATABASE IF EXISTS " + SCRATCH_DATABASE);
        admin.execute("CREATE DATABASE " + SCRATCH_DATABASE);
        String url = postgres.getJdbcUrl().replace("/" + postgres.getDatabaseName(), "/" + SCRATCH_DATABASE);
        try {
            Flyway.configure()
                    .dataSource(url, postgres.getUsername(), postgres.getPassword())
                    .target(target)
                    .load()
                    .migrate();
            JdbcTemplate scratch =
                    new JdbcTemplate(new DriverManagerDataSource(url, postgres.getUsername(), postgres.getPassword()));
            scratch.execute(tamper);
            Flyway.configure()
                    .dataSource(url, postgres.getUsername(), postgres.getPassword())
                    .load()
                    .migrate();
            verify.accept(scratch);
        } finally {
            admin.execute("DROP DATABASE IF EXISTS " + SCRATCH_DATABASE + " WITH (FORCE)");
        }
    }

    private static List<String> namesOf(JdbcTemplate jdbc, String sql) {
        return jdbc.queryForList(sql, String.class);
    }

    private static Long insertLegacyCategory(JdbcTemplate jdbc, Plan plan, String description) {
        return jdbc.queryForObject(
                "INSERT INTO categories (plan_id, type, description, spending_limit) "
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
