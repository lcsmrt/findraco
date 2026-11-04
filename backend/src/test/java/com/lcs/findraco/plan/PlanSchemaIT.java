package com.lcs.findraco.plan;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.support.AbstractIntegrationTest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/** A permanent plan deletion is one statement on {@code plans}; the foreign keys carry it to every scoped row. */
class PlanSchemaIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void everyForeignKeyToPlansCascadesOnDelete() {
        List<String> notCascading = jdbcTemplate.queryForList(
                "SELECT conname FROM pg_constraint "
                        + "WHERE contype = 'f' AND confrelid = 'public.plans'::regclass AND confdeltype <> 'c' "
                        + "ORDER BY conname",
                String.class);

        assertThat(notCascading).isEmpty();
    }
}
