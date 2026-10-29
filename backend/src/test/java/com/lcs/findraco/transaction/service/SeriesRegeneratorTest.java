package com.lcs.findraco.transaction.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class SeriesRegeneratorTest {

    // Fixed "today" so open-ended (null endDate) horizon assertions are deterministic regardless of
    // wall-clock time, mirroring RecurringTransactionGeneratorTest's FIXED_CLOCK.
    private static final Clock FIXED_CLOCK = Clock.fixed(Instant.parse("2026-07-24T00:00:00Z"), ZoneOffset.UTC);

    private final SeriesRegenerator regenerator = new SeriesRegenerator(FIXED_CLOCK);

    private final Plan plan = new Plan();
    private final User user = userWithId(1L);
    private final BigDecimal amount = new BigDecimal("300.00");
    private final List<Share> shares = List.of(new Share(user, amount));

    private static User userWithId(Long id) {
        User u = new User();
        try {
            Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(u, id);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
        return u;
    }

    private RecurrenceDefinition installmentDef(
            String description, BigDecimal amt, int firstParcel, int parcelsNumber, LocalDate startDate) {
        return RecurrenceDefinition.create(new SeriesDraft(
                plan,
                user,
                null,
                TransactionType.DEBIT,
                amt,
                description,
                RecurrenceMode.INSTALLMENT,
                null,
                parcelsNumber,
                firstParcel,
                startDate,
                null,
                SplitMode.EQUAL,
                shares));
    }

    private RecurrenceDefinition recurringDef(
            String description, BigDecimal amt, LocalDate startDate, LocalDate endDate) {
        return RecurrenceDefinition.create(new SeriesDraft(
                plan,
                user,
                null,
                TransactionType.DEBIT,
                amt,
                description,
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                startDate,
                endDate,
                SplitMode.EQUAL,
                shares));
    }

    /** Builds existing installment occurrences 1..total for the given base description/amount/start, as the
     * create-time generator would have produced them. */
    private List<Transaction> existingInstallments(String description, BigDecimal amt, int total, LocalDate startDate) {
        List<Transaction> occurrences = new ArrayList<>();
        RecurrenceDefinition stored = installmentDef(description, amt, 1, total, startDate);
        for (int parcel = 1; parcel <= total; parcel++) {
            occurrences.add(occurrence(
                    stored,
                    amt,
                    description + " (" + parcel + "/" + total + ")",
                    startDate.plusMonths(parcel - 1),
                    total));
        }
        return occurrences;
    }

    private List<Transaction> existingRecurring(
            String description, BigDecimal amt, LocalDate startDate, LocalDate endDate) {
        List<Transaction> occurrences = new ArrayList<>();
        RecurrenceDefinition stored = recurringDef(description, amt, startDate, endDate);
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusMonths(1)) {
            occurrences.add(occurrence(stored, amt, description, date, null));
        }
        return occurrences;
    }

    private Transaction occurrence(
            RecurrenceDefinition stored, BigDecimal amt, String description, LocalDate date, Integer parcelsNumber) {
        TransactionDetails details =
                new TransactionDetails(null, TransactionType.DEBIT, amt, description, date, null, parcelsNumber);
        return Transaction.create(
                new TransactionDraft(plan, user, details, SplitMode.EQUAL, shares, List.of(), null, stored));
    }

    @Test
    void thisAndFollowingMidSeriesLeavesEarlierInstallmentsUntouched() {
        LocalDate start = LocalDate.of(2026, 1, 15);
        RecurrenceDefinition def = installmentDef("New Rent", amount, 1, 6, start);
        List<Transaction> existing = existingInstallments("Rent", amount, 6, start);
        LocalDate pivotDate = existing.get(2).getStartDate();

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.THIS_AND_FOLLOWING, pivotDate);

        assertThat(result.toCreate()).isEmpty();
        assertThat(result.toDelete()).isEmpty();
        assertThat(result.toUpdate()).hasSize(4);
        assertThat(result.toUpdate())
                .extracting(Transaction::getDescription)
                .containsExactly("New Rent (3/6)", "New Rent (4/6)", "New Rent (5/6)", "New Rent (6/6)");
        assertThat(result.toUpdate()).doesNotContain(existing.get(0), existing.get(1));
    }

    @Test
    void allScopeTouchesEveryOccurrenceWhenCountUnchanged() {
        LocalDate start = LocalDate.of(2026, 1, 15);
        RecurrenceDefinition def = installmentDef("New Rent", amount, 1, 6, start);
        List<Transaction> existing = existingInstallments("Rent", amount, 6, start);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toUpdate()).hasSize(6);
        assertThat(result.toCreate()).isEmpty();
        assertThat(result.toDelete()).isEmpty();
        assertThat(result.toUpdate()).containsExactlyInAnyOrderElementsOf(existing);
    }

    @Test
    void thisAndFollowingFromFirstOccurrenceMatchesAllScope() {
        LocalDate start = LocalDate.of(2026, 1, 15);
        RecurrenceDefinition def = installmentDef("New Rent", amount, 1, 6, start);
        List<Transaction> existingForAll = existingInstallments("Rent", amount, 6, start);
        List<Transaction> existingForFollowing = existingInstallments("Rent", amount, 6, start);

        SeriesRegenerator.SeriesEditResult allResult =
                regenerator.reconcile(def, existingForAll, shares, SeriesEditScope.ALL, null);
        SeriesRegenerator.SeriesEditResult followingResult =
                regenerator.reconcile(def, existingForFollowing, shares, SeriesEditScope.THIS_AND_FOLLOWING, start);

        assertThat(followingResult.toUpdate()).hasSize(allResult.toUpdate().size());
        assertThat(followingResult.toCreate()).isEmpty();
        assertThat(followingResult.toDelete()).isEmpty();
        assertThat(followingResult.toUpdate())
                .extracting(Transaction::getDescription)
                .containsExactlyInAnyOrderElementsOf(allResult.toUpdate().stream()
                        .map(Transaction::getDescription)
                        .toList());
    }

    @Test
    void installmentCountIncreaseUnderAllCreatesTrailingOccurrences() {
        LocalDate start = LocalDate.of(2026, 1, 15);
        RecurrenceDefinition def = installmentDef("Rent", amount, 1, 9, start);
        List<Transaction> existing = existingInstallments("Rent", amount, 6, start);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toDelete()).isEmpty();
        assertThat(result.toUpdate()).hasSize(6);
        assertThat(result.toUpdate())
                .extracting(Transaction::getDescription)
                .containsExactly("Rent (1/9)", "Rent (2/9)", "Rent (3/9)", "Rent (4/9)", "Rent (5/9)", "Rent (6/9)");

        assertThat(result.toCreate()).hasSize(3);
        assertThat(result.toCreate())
                .extracting(Transaction::getDescription)
                .containsExactly("Rent (7/9)", "Rent (8/9)", "Rent (9/9)");
        assertThat(result.toCreate())
                .extracting(Transaction::getStartDate)
                .containsExactly(start.plusMonths(6), start.plusMonths(7), start.plusMonths(8));
        assertThat(result.toCreate()).allSatisfy(tx -> {
            assertThat(tx.getPlan()).isSameAs(plan);
            assertThat(tx.getCreatedBy()).isSameAs(user);
            assertThat(tx.getSeriesId()).isEqualTo(def.getSeriesId());
            assertThat(tx.getRecurrenceDefinition()).isSameAs(def);
            assertThat(tx.getParcelsNumber()).isEqualTo(9);
            assertThat(tx.getParticipants()).hasSize(1);
        });
    }

    @Test
    void installmentCountDecreaseUnderAllDeletesTrailingOccurrences() {
        LocalDate start = LocalDate.of(2026, 1, 15);
        RecurrenceDefinition def = installmentDef("Rent", amount, 1, 4, start);
        List<Transaction> existing = existingInstallments("Rent", amount, 6, start);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toCreate()).isEmpty();
        assertThat(result.toUpdate()).hasSize(4);
        assertThat(result.toUpdate())
                .extracting(Transaction::getDescription)
                .containsExactly("Rent (1/4)", "Rent (2/4)", "Rent (3/4)", "Rent (4/4)");

        assertThat(result.toDelete()).hasSize(2);
        assertThat(result.toDelete()).containsExactly(existing.get(4), existing.get(5));
    }

    @Test
    void recurringEndDateExtendUnderAllCreatesNewMonths() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate oldEnd = LocalDate.of(2026, 6, 1);
        LocalDate newEnd = LocalDate.of(2026, 8, 1);
        RecurrenceDefinition def = recurringDef("Gym", amount, start, newEnd);
        List<Transaction> existing = existingRecurring("Gym", amount, start, oldEnd);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toDelete()).isEmpty();
        assertThat(result.toUpdate()).hasSize(6);
        assertThat(result.toCreate()).hasSize(2);
        assertThat(result.toCreate())
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 8, 1));
        assertThat(result.toCreate()).allSatisfy(tx -> {
            assertThat(tx.getDescription()).isEqualTo("Gym");
            assertThat(tx.getParcelsNumber()).isNull();
            assertThat(tx.getRecurrenceDefinition()).isSameAs(def);
        });
    }

    @Test
    void recurringEndDateShortenUnderAllDeletesTrailingMonths() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate oldEnd = LocalDate.of(2026, 6, 1);
        LocalDate newEnd = LocalDate.of(2026, 3, 1);
        RecurrenceDefinition def = recurringDef("Gym", amount, start, newEnd);
        List<Transaction> existing = existingRecurring("Gym", amount, start, oldEnd);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toCreate()).isEmpty();
        assertThat(result.toUpdate()).hasSize(3);
        assertThat(result.toUpdate())
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 2, 1), LocalDate.of(2026, 3, 1));

        assertThat(result.toDelete()).hasSize(3);
        assertThat(result.toDelete())
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 4, 1), LocalDate.of(2026, 5, 1), LocalDate.of(2026, 6, 1));
    }

    @Test
    void recurringTargetsKeepTheStartDayAfterAShortMonth() {
        LocalDate start = LocalDate.of(2026, 1, 31);
        RecurrenceDefinition def = recurringDef("Rent", amount, start, LocalDate.of(2026, 3, 31));

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, List.of(), shares, SeriesEditScope.ALL, null);

        assertThat(result.toCreate())
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 1, 31), LocalDate.of(2026, 2, 28), LocalDate.of(2026, 3, 31));
    }

    @Test
    void recurringNullEndDateUnderAllExtendsToRollingHorizon() {
        // P3 re-open: a null endDate on a RECURRING definition means open-ended, so the target list
        // must fall back to the rolling 12-month horizon (from the injected FIXED_CLOCK's "today")
        // instead of NPE-ing on def.getEndDate(). start's day-of-month (1) is preserved by the
        // monthly stepping, so the last generated slot is the last day-1 date not after the horizon.
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate oldEnd = LocalDate.of(2026, 3, 1);
        // FIXED_CLOCK's "today" is 2026-07-24 -> horizon cap 2027-07-24; the last day-1 slot not
        // after that cap is 2027-07-01 (2027-08-01 would be after it).
        LocalDate expectedLastGenerated = LocalDate.of(2027, 7, 1);
        RecurrenceDefinition def = recurringDef("Gym", amount, start, null);
        List<Transaction> existing = existingRecurring("Gym", amount, start, oldEnd);

        SeriesRegenerator.SeriesEditResult result =
                regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null);

        assertThat(result.toDelete()).isEmpty();
        assertThat(result.toUpdate()).hasSize(3);
        assertThat(result.toCreate())
                .extracting(Transaction::getStartDate)
                .contains(expectedLastGenerated)
                .doesNotContain(expectedLastGenerated.plusMonths(1));
        assertThat(result.toCreate()).allSatisfy(tx -> {
            assertThat(tx.getDescription()).isEqualTo("Gym");
            assertThat(tx.getRecurrenceDefinition()).isSameAs(def);
        });
    }

    @Test
    void targetCountExceedingCapThrows() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        RecurrenceDefinition def = installmentDef("Rent", amount, 1, 200, start);
        List<Transaction> existing = existingInstallments("Rent", amount, 6, start);

        assertThatThrownBy(() -> regenerator.reconcile(def, existing, shares, SeriesEditScope.ALL, null))
                .isInstanceOf(TransactionExceptions.SeriesTooManyOccurrencesException.class)
                .hasMessageContaining("too many occurrences");
    }
}
