package com.lcs.findraco.plan.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.plan.model.PlanRole;
import org.junit.jupiter.api.Test;

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
        assertThatCode(() -> authorization.requireOwner(PlanRole.OWNER)).doesNotThrowAnyException();
    }

    @Test
    void ownerOnlyDeniedForEditor() {
        assertThatThrownBy(() -> authorization.requireOwner(PlanRole.EDITOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void ownerOnlyDeniedForContributor() {
        assertThatThrownBy(() -> authorization.requireOwner(PlanRole.CONTRIBUTOR))
                .isInstanceOf(PlanExceptions.InsufficientPlanRoleException.class);
    }

    @Test
    void ownerOnlyDeniedForViewer() {
        assertThatThrownBy(() -> authorization.requireOwner(PlanRole.VIEWER))
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
}
