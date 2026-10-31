package com.lcs.findraco.category.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.category.exception.CategoryExceptions;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class CategoryTest {

    private final Plan plan = new Plan();
    private final User member = user(1L);
    private final User partner = user(2L);

    @Test
    void theTypeOfACategoryInUseCannotChange() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        assertThatThrownBy(() -> food.changeType(TransactionType.CREDIT, true))
                .isInstanceOf(CategoryExceptions.CategoryTypeChangeInUseException.class);
        assertThat(food.getType()).isEqualTo(TransactionType.DEBIT);
    }

    @Test
    void theTypeOfAnUnusedCategoryChanges() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        food.changeType(TransactionType.CREDIT, false);

        assertThat(food.getType()).isEqualTo(TransactionType.CREDIT);
    }

    @Test
    void keepingTheTypeIsNotAChangeEvenWhenInUse() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        food.changeType(TransactionType.DEBIT, true);

        assertThat(food.getType()).isEqualTo(TransactionType.DEBIT);
    }

    @Test
    void renameChangesTheDescription() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        food.rename("Groceries");

        assertThat(food.getDescription()).isEqualTo("Groceries");
    }

    @Test
    void aParentIsARootOfTheSameTypeAndNeverTheCategoryItself() {
        Category food = withId(Category.create(plan, TransactionType.DEBIT, "Food", null), 1L);
        Category delivery = Category.create(plan, TransactionType.DEBIT, "Delivery", food);
        Category salary = Category.create(plan, TransactionType.CREDIT, "Salary", null);

        assertThatThrownBy(() -> food.moveUnder(food))
                .isInstanceOf(CategoryExceptions.CategoryParentIsItselfException.class);
        assertThatThrownBy(() -> Category.create(plan, TransactionType.DEBIT, "Pizza", delivery))
                .isInstanceOf(CategoryExceptions.CategoryParentIsChildException.class);
        assertThatThrownBy(() -> Category.create(plan, TransactionType.DEBIT, "Bonus", salary))
                .isInstanceOf(CategoryExceptions.CategoryParentTypeMismatchException.class);
        assertThat(delivery.getParent()).isSameAs(food);
    }

    @Test
    void onlyARootHasAnOwner() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);
        Category delivery = Category.create(plan, TransactionType.DEBIT, "Delivery", food);

        food.assignOwner(member);

        assertThat(food.getOwner()).isSameAs(member);
        assertThatThrownBy(() -> delivery.assignOwner(member))
                .isInstanceOf(CategoryExceptions.CategoryOwnerOnChildException.class);
    }

    @Test
    void anIncomeCategoryHasNoLimit() {
        Category salary = Category.create(plan, TransactionType.CREDIT, "Salary", null);

        salary.changeLimits(new BigDecimal("100.00"), null);

        assertThat(salary.getSpendingLimit()).isNull();
        assertThatThrownBy(() -> salary.changeLimits(null, List.of(limit(member, "10.00"))))
                .isInstanceOf(CategoryExceptions.CategoryMemberLimitsOnCreditException.class);
    }

    @Test
    void perMemberLimitsReplaceThePlainLimit() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);
        food.changeLimits(new BigDecimal("300.00"), null);

        food.changeLimits(new BigDecimal("300.00"), List.of(limit(member, "100.00"), limit(partner, "50.00")));

        assertThat(food.getSpendingLimit()).isNull();
        assertThat(food.getMemberLimits())
                .extracting(CategoryMemberLimit::getAmount)
                .containsExactly(new BigDecimal("100.00"), new BigDecimal("50.00"));
    }

    @Test
    void aKeptMemberLimitIsUpdatedInPlace() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);
        food.changeLimits(null, List.of(limit(member, "100.00"), limit(partner, "50.00")));
        CategoryMemberLimit memberEntry = food.getMemberLimits().getFirst();

        food.changeLimits(null, List.of(limit(member, "80.00")));

        assertThat(food.getMemberLimits()).containsExactly(memberEntry);
        assertThat(memberEntry.getAmount()).isEqualByComparingTo("80.00");
    }

    @Test
    void aMemberHasOneLimitPerCategory() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        assertThatThrownBy(() -> food.changeLimits(null, List.of(limit(member, "10.00"), limit(member, "20.00"))))
                .isInstanceOf(CategoryExceptions.CategoryMemberLimitDuplicateMemberException.class);
        assertThat(food.getMemberLimits()).isEmpty();
    }

    @Test
    void anOwnedCategoryAndItsSubcategoriesHaveNoPerMemberLimits() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);
        food.assignOwner(member);
        Category delivery = Category.create(plan, TransactionType.DEBIT, "Delivery", food);

        assertThatThrownBy(() -> food.changeLimits(null, List.of(limit(partner, "10.00"))))
                .isInstanceOf(CategoryExceptions.CategoryMemberLimitsOnOwnedException.class);
        assertThatThrownBy(() -> delivery.changeLimits(null, List.of(limit(partner, "10.00"))))
                .isInstanceOf(CategoryExceptions.CategoryMemberLimitsOnOwnedException.class);
    }

    @Test
    void aCategoryHasNoPublicSettersAndItsLimitsChangeOnlyThroughIt() {
        Category food = Category.create(plan, TransactionType.DEBIT, "Food", null);

        assertThat(Arrays.stream(Category.class.getMethods()).map(method -> method.getName()))
                .noneMatch(name -> name.startsWith("set"));
        assertThatThrownBy(() -> food.getMemberLimits().clear()).isInstanceOf(UnsupportedOperationException.class);
    }

    private static MemberLimit limit(User member, String amount) {
        return new MemberLimit(member, new BigDecimal(amount));
    }

    private static Category withId(Category category, long id) {
        ReflectionTestUtils.setField(category, "id", id);
        return category;
    }

    private static User user(long id) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }
}
