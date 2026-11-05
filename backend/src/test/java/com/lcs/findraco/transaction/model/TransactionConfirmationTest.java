package com.lcs.findraco.transaction.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.user.model.User;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class TransactionConfirmationTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 11, 5);

    private final Plan plan = new Plan();
    private final User owner = userWithId(1L);
    private final User partner = userWithId(2L);

    @Test
    void byDateOnOrBeforeTodayIsActual() {
        assertThat(oneOff(TODAY.minusDays(1)).status(TODAY)).isEqualTo(TransactionStatus.ACTUAL);
        assertThat(oneOff(TODAY.minusMonths(3)).status(TODAY)).isEqualTo(TransactionStatus.ACTUAL);
    }

    @Test
    void confirmedIsActualEvenWhenFuture() {
        Transaction occurrence = occurrence(true, TODAY.plusDays(15));

        occurrence.confirm(new BigDecimal("187.40"), TODAY.plusDays(15));

        assertThat(occurrence.status(TODAY)).isEqualTo(TransactionStatus.ACTUAL);
        assertThat(occurrence.getConfirmation()).isEqualTo(Confirmation.CONFIRMED);
    }

    @Test
    void byDateAfterTodayIsForecast() {
        assertThat(oneOff(TODAY.plusDays(1)).status(TODAY)).isEqualTo(TransactionStatus.FORECAST);
        assertThat(occurrence(false, TODAY.plusDays(1)).status(TODAY)).isEqualTo(TransactionStatus.FORECAST);
    }

    @Test
    void byDateTodayIsActual() {
        assertThat(oneOff(TODAY).status(TODAY)).isEqualTo(TransactionStatus.ACTUAL);
    }

    @Test
    void requiredStaysForecastWhateverItsDate() {
        Transaction occurrence = occurrence(true, TODAY.minusMonths(3));

        assertThat(occurrence.getConfirmation()).isEqualTo(Confirmation.REQUIRED);
        assertThat(occurrence.status(TODAY)).isEqualTo(TransactionStatus.PENDING);
        assertThat(occurrence(true, TODAY.plusMonths(3)).status(TODAY)).isEqualTo(TransactionStatus.FORECAST);
    }

    @Test
    void requiredBeforeTodayIsPending() {
        assertThat(occurrence(true, TODAY.minusDays(1)).status(TODAY)).isEqualTo(TransactionStatus.PENDING);
        assertThat(occurrence(true, TODAY).status(TODAY)).isEqualTo(TransactionStatus.FORECAST);
        assertThat(occurrence(true, TODAY.plusDays(1)).status(TODAY)).isEqualTo(TransactionStatus.FORECAST);
    }

    @Test
    void confirmOnlyFromRequired() {
        Transaction byDate = oneOff(TODAY);
        Transaction confirmed = occurrence(true, TODAY);
        confirmed.confirm(new BigDecimal("10.00"), TODAY);

        assertThatThrownBy(() -> byDate.confirm(new BigDecimal("10.00"), TODAY))
                .isInstanceOf(TransactionExceptions.TransactionNotAwaitingConfirmationException.class);
        assertThatThrownBy(() -> confirmed.confirm(new BigDecimal("10.00"), TODAY))
                .isInstanceOf(TransactionExceptions.TransactionNotAwaitingConfirmationException.class);
    }

    @Test
    void confirmStoresTheAmountAndDateAndKeepsTheSplitWhole() {
        Transaction occurrence = occurrence(true, TODAY.minusDays(2));

        occurrence.confirm(new BigDecimal("187.41"), TODAY);

        assertThat(occurrence.getAmount()).isEqualByComparingTo("187.41");
        assertThat(occurrence.getStartDate()).isEqualTo(TODAY);
        assertThat(occurrence.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("93.71"), new BigDecimal("93.70"));
    }

    @Test
    void unconfirmMakesItForecast() {
        Transaction occurrence = occurrence(true, TODAY.minusDays(2));
        occurrence.confirm(new BigDecimal("187.40"), TODAY.minusDays(2));

        occurrence.markConfirmed(false);

        assertThat(occurrence.getConfirmation()).isEqualTo(Confirmation.REQUIRED);
        assertThat(occurrence.status(TODAY)).isEqualTo(TransactionStatus.PENDING);
    }

    @Test
    void turningTheFlagOnSparesPastOccurrences() {
        RecurrenceDefinition definition = definition(false);
        Transaction past = occurrence(definition, TODAY.minusDays(1));
        Transaction future = occurrence(definition, TODAY.plusDays(1));

        definition.changeRequiresConfirmation(true, List.of(past, future), TODAY);

        assertThat(definition.isRequiresConfirmation()).isTrue();
        assertThat(past.getConfirmation()).isEqualTo(Confirmation.BY_DATE);
        assertThat(future.getConfirmation()).isEqualTo(Confirmation.REQUIRED);
    }

    @Test
    void turningTheFlagOffFreesUnconfirmedAndSparesConfirmed() {
        RecurrenceDefinition definition = definition(true);
        Transaction unconfirmed = occurrence(definition, TODAY.minusDays(1));
        Transaction confirmed = occurrence(definition, TODAY.plusDays(1));
        confirmed.confirm(new BigDecimal("10.00"), TODAY.plusDays(1));

        definition.changeRequiresConfirmation(false, List.of(unconfirmed, confirmed), TODAY);

        assertThat(unconfirmed.getConfirmation()).isEqualTo(Confirmation.BY_DATE);
        assertThat(confirmed.getConfirmation()).isEqualTo(Confirmation.CONFIRMED);
    }

    private Transaction oneOff(LocalDate date) {
        return Transaction.create(
                new TransactionDraft(plan, owner, details(date), SplitMode.EQUAL, shares(), List.of(), null, null));
    }

    private Transaction occurrence(boolean required, LocalDate date) {
        return occurrence(definition(required), date);
    }

    private Transaction occurrence(RecurrenceDefinition definition, LocalDate date) {
        return Transaction.create(new TransactionDraft(
                plan, owner, details(date), SplitMode.EQUAL, shares(), List.of(), null, definition));
    }

    private RecurrenceDefinition definition(boolean required) {
        return RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                null,
                TransactionType.DEBIT,
                new BigDecimal("200.00"),
                "Electricity",
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                TODAY.minusMonths(3),
                null,
                SplitMode.EQUAL,
                shares(),
                required));
    }

    private static TransactionDetails details(LocalDate date) {
        return new TransactionDetails(
                null, TransactionType.DEBIT, new BigDecimal("200.00"), "Electricity", date, null, null);
    }

    private List<Share> shares() {
        return List.of(new Share(owner, null), new Share(partner, null));
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
