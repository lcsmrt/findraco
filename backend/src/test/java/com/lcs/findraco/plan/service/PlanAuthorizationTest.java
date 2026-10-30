package com.lcs.findraco.plan.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.plan.model.PlanRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class PlanAuthorizationTest {

    private final PlanAuthorization authorization = new PlanAuthorization();

    private static final long ALICE = 1L;
    private static final long BOB = 2L;

    @Test
    void createAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanCreateTransaction(PlanRole.OWNER))
                .doesNotThrowAnyException();
    }

    @Test
    void createAllowedForEditor() {
        assertThatCode(() -> authorization.requireCanCreateTransaction(PlanRole.EDITOR))
                .doesNotThrowAnyException();
    }

    @Test
    void createAllowedForContributor() {
        assertThatCode(() -> authorization.requireCanCreateTransaction(PlanRole.CONTRIBUTOR))
                .doesNotThrowAnyException();
    }

    @Test
    void createDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanCreateTransaction(PlanRole.VIEWER))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void modifyOwnAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanModifyTransaction(PlanRole.OWNER, ALICE, ALICE))
                .doesNotThrowAnyException();
    }

    @Test
    void modifyOwnAllowedForEditor() {
        assertThatCode(() -> authorization.requireCanModifyTransaction(PlanRole.EDITOR, ALICE, ALICE))
                .doesNotThrowAnyException();
    }

    @Test
    void modifyOwnAllowedForContributor() {
        assertThatCode(() -> authorization.requireCanModifyTransaction(PlanRole.CONTRIBUTOR, ALICE, ALICE))
                .doesNotThrowAnyException();
    }

    @Test
    void modifyOwnDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanModifyTransaction(PlanRole.VIEWER, ALICE, ALICE))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void modifyOthersAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanModifyTransaction(PlanRole.OWNER, ALICE, BOB))
                .doesNotThrowAnyException();
    }

    @Test
    void modifyOthersAllowedForEditor() {
        assertThatCode(() -> authorization.requireCanModifyTransaction(PlanRole.EDITOR, ALICE, BOB))
                .doesNotThrowAnyException();
    }

    @Test
    void modifyOthersDeniedForContributor() {
        assertThatThrownBy(() -> authorization.requireCanModifyTransaction(PlanRole.CONTRIBUTOR, ALICE, BOB))
                .isInstanceOf(PlanExceptions.CannotModifyOthersTransactionException.class);
    }

    @Test
    void modifyOthersDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanModifyTransaction(PlanRole.VIEWER, ALICE, BOB))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void manageCategoriesAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanManageCategories(PlanRole.OWNER))
                .doesNotThrowAnyException();
    }

    @Test
    void manageCategoriesDeniedForEditor() {
        assertThatThrownBy(() -> authorization.requireCanManageCategories(PlanRole.EDITOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void manageCategoriesDeniedForContributor() {
        assertThatThrownBy(() -> authorization.requireCanManageCategories(PlanRole.CONTRIBUTOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void manageCategoriesDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanManageCategories(PlanRole.VIEWER))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void ownerOnlyAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanManagePlan(PlanRole.OWNER)).doesNotThrowAnyException();
    }

    @Test
    void ownerOnlyDeniedForEditor() {
        assertThatThrownBy(() -> authorization.requireCanManagePlan(PlanRole.EDITOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void ownerOnlyDeniedForContributor() {
        assertThatThrownBy(() -> authorization.requireCanManagePlan(PlanRole.CONTRIBUTOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void ownerOnlyDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanManagePlan(PlanRole.VIEWER))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void attributeToOthersAllowedForOwner() {
        assertThatCode(() -> authorization.requireCanAttributeToOthers(PlanRole.OWNER))
                .doesNotThrowAnyException();
    }

    @Test
    void attributeToOthersAllowedForEditor() {
        assertThatCode(() -> authorization.requireCanAttributeToOthers(PlanRole.EDITOR))
                .doesNotThrowAnyException();
    }

    @Test
    void attributeToOthersDeniedForContributor() {
        assertThatThrownBy(() -> authorization.requireCanAttributeToOthers(PlanRole.CONTRIBUTOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void attributeToOthersDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireCanAttributeToOthers(PlanRole.VIEWER))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    // ---- Queries: the answer for each rule and role, which the guards above throw on when false ----

    @ParameterizedTest(name = "{0}: create {1}, attribute {2}, categories {3}, plan {4}")
    @CsvSource({
        "OWNER,       true,  true,  true,  true",
        "EDITOR,      true,  true,  false, false",
        "CONTRIBUTOR, true,  false, false, false",
        "VIEWER,      false, false, false, false"
    })
    void planWideQueriesPerRole(
            PlanRole role, boolean create, boolean attribute, boolean categories, boolean managePlan) {
        assertThat(authorization.canCreateTransactions(role)).isEqualTo(create);
        assertThat(authorization.canAttributeToOthers(role)).isEqualTo(attribute);
        assertThat(authorization.canManageCategories(role)).isEqualTo(categories);
        assertThat(authorization.canManagePlan(role)).isEqualTo(managePlan);
    }

    @ParameterizedTest(name = "{0}: own row {1}, another member's row {2}")
    @CsvSource({
        "OWNER,       true,  true",
        "EDITOR,      true,  true",
        "CONTRIBUTOR, true,  false",
        "VIEWER,      false, false"
    })
    void modifyQueryPerRoleAndRowOwner(PlanRole role, boolean ownRow, boolean othersRow) {
        assertThat(authorization.canModifyTransaction(role, ALICE, ALICE)).isEqualTo(ownRow);
        assertThat(authorization.canModifyTransaction(role, BOB, ALICE)).isEqualTo(othersRow);
    }

    @Test
    void aContributorCannotModifyARowWithoutACreator() {
        assertThat(authorization.canModifyTransaction(PlanRole.CONTRIBUTOR, null, ALICE))
                .isFalse();
        assertThatThrownBy(() -> authorization.requireCanModifyTransaction(PlanRole.CONTRIBUTOR, null, ALICE))
                .isInstanceOf(PlanExceptions.CannotModifyOthersTransactionException.class);
    }
}
