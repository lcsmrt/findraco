package com.lcs.findraco.transaction.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.user.model.User;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;

class RecurrenceDefinitionTest {

    private static final LocalDate START = LocalDate.of(2026, 1, 10);
    private static final BigDecimal AMOUNT = new BigDecimal("90.00");

    private final Plan plan = new Plan();
    private final User owner = userWithId(1L);

    @Test
    void installmentsNeedTheirNumberOfParcels() {
        assertThatThrownBy(() -> RecurrenceDefinition.create(installments(null, null)))
                .isInstanceOf(TransactionExceptions.SeriesParcelsRequiredException.class);
    }

    @Test
    void theCurrentParcelLiesWithinTheParcels() {
        assertThatThrownBy(() -> RecurrenceDefinition.create(installments(6, 7)))
                .isInstanceOf(TransactionExceptions.SeriesCurrentParcelOutOfRangeException.class);
        assertThatThrownBy(() -> RecurrenceDefinition.create(installments(6, 0)))
                .isInstanceOf(TransactionExceptions.SeriesCurrentParcelOutOfRangeException.class);
    }

    @Test
    void installmentsStartAtTheFirstParcelUnlessToldOtherwise() {
        assertThat(RecurrenceDefinition.create(installments(6, null)).getFirstParcel())
                .isEqualTo(1);
        assertThat(RecurrenceDefinition.create(installments(6, 3)).getFirstParcel())
                .isEqualTo(3);
    }

    @Test
    void aRecurringSeriesNeedsItsInterval() {
        SeriesDraft draft = recurring(null, START.plusMonths(3), null, SplitMode.EQUAL, self());

        assertThatThrownBy(() -> RecurrenceDefinition.create(draft))
                .isInstanceOf(TransactionExceptions.SeriesIntervalRequiredException.class);
    }

    @Test
    void createRefusesAnEndBeforeTheStart() {
        SeriesDraft draft = recurring(RecurrenceInterval.MONTHLY, START.minusDays(1), null, SplitMode.EQUAL, self());

        assertThatThrownBy(() -> RecurrenceDefinition.create(draft))
                .isInstanceOf(TransactionExceptions.PeriodStartAfterEndException.class);
    }

    @Test
    void editRefusesAnEndBeforeTheStartWithTheSameExceptionAsCreate() {
        RecurrenceDefinition definition = RecurrenceDefinition.create(
                recurring(RecurrenceInterval.MONTHLY, START.plusMonths(3), null, SplitMode.EQUAL, self()));

        assertThatThrownBy(() -> definition.editPattern(pattern(null, START.minusDays(1))))
                .isInstanceOf(TransactionExceptions.PeriodStartAfterEndException.class);
        assertThat(definition.getEndDate()).isEqualTo(START.plusMonths(3));
    }

    @Test
    void createRefusesACategoryOfTheOtherType() {
        SeriesDraft draft =
                recurring(RecurrenceInterval.MONTHLY, null, category(TransactionType.CREDIT), SplitMode.EQUAL, self());

        assertThatThrownBy(() -> RecurrenceDefinition.create(draft))
                .isInstanceOf(TransactionExceptions.CategoryTypeMismatchException.class);
    }

    @Test
    void editRefusesACategoryOfTheOtherType() {
        RecurrenceDefinition definition =
                RecurrenceDefinition.create(recurring(RecurrenceInterval.MONTHLY, null, null, SplitMode.EQUAL, self()));

        assertThatThrownBy(() -> definition.editPattern(pattern(category(TransactionType.CREDIT), null)))
                .isInstanceOf(TransactionExceptions.CategoryTypeMismatchException.class);
        assertThat(definition.getCategory()).isNull();
    }

    @Test
    void theSplitFollowsTheTransactionRules() {
        SeriesDraft withoutParticipants = recurring(RecurrenceInterval.MONTHLY, null, null, SplitMode.EQUAL, List.of());
        SeriesDraft missingShare =
                recurring(RecurrenceInterval.MONTHLY, null, null, SplitMode.EXACT, List.of(new Share(owner, null)));

        assertThatThrownBy(() -> RecurrenceDefinition.create(withoutParticipants))
                .isInstanceOf(TransactionExceptions.ParticipantsRequiredException.class);
        assertThatThrownBy(() -> RecurrenceDefinition.create(missingShare))
                .isInstanceOf(TransactionExceptions.ExactShareInvalidException.class);
    }

    @Test
    void shortenToEndsInstallmentsByCountAndRecurringByDate() {
        RecurrenceDefinition installments = RecurrenceDefinition.create(installments(6, 2));
        RecurrenceDefinition recurring =
                RecurrenceDefinition.create(recurring(RecurrenceInterval.MONTHLY, null, null, SplitMode.EQUAL, self()));

        installments.shortenTo(2, START.plusMonths(1));
        recurring.shortenTo(2, START.plusMonths(1));

        assertThat(installments.getParcelsNumber()).isEqualTo(3);
        assertThat(recurring.getEndDate()).isEqualTo(START.plusMonths(1));
    }

    @Test
    void aSeriesHasNoPublicSetters() {
        assertThat(Arrays.stream(RecurrenceDefinition.class.getMethods()).map(method -> method.getName()))
                .noneMatch(name -> name.startsWith("set"));
    }

    private SeriesDraft installments(Integer parcelsNumber, Integer currentParcel) {
        return new SeriesDraft(
                plan,
                owner,
                null,
                TransactionType.DEBIT,
                AMOUNT,
                "Laptop",
                RecurrenceMode.INSTALLMENT,
                null,
                parcelsNumber,
                currentParcel,
                START,
                null,
                SplitMode.EQUAL,
                self());
    }

    private SeriesDraft recurring(
            RecurrenceInterval interval, LocalDate endDate, Category category, SplitMode mode, List<Share> shares) {
        return new SeriesDraft(
                plan,
                owner,
                category,
                TransactionType.DEBIT,
                AMOUNT,
                "Gym",
                RecurrenceMode.RECURRING,
                interval,
                null,
                null,
                START,
                endDate,
                mode,
                shares);
    }

    private SeriesPattern pattern(Category category, LocalDate endDate) {
        return new SeriesPattern(category, AMOUNT, "Gym", null, endDate, SplitMode.EQUAL, self());
    }

    private List<Share> self() {
        return List.of(new Share(owner, null));
    }

    private static Category category(TransactionType type) {
        return Category.create(new Plan(), type, "Category", null);
    }

    private static User userWithId(long id) {
        User user = new User();
        try {
            Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
        return user;
    }
}
