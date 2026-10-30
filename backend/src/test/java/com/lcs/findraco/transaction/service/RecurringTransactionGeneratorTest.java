package com.lcs.findraco.transaction.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.user.model.User;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import org.junit.jupiter.api.Test;

class RecurringTransactionGeneratorTest {

    // Fixed "today" so open-ended horizon assertions are deterministic regardless of wall-clock time.
    private static final Clock FIXED_CLOCK = Clock.fixed(Instant.parse("2026-07-24T00:00:00Z"), ZoneOffset.UTC);

    private final RecurringTransactionGenerator generator = new RecurringTransactionGenerator(FIXED_CLOCK);

    private final User user = userWithId(1L);
    private final User other = userWithId(2L);
    private final Plan plan = new Plan();
    private final BigDecimal amount = new BigDecimal("300.00");
    private final List<Share> selfShares = List.of(new Share(user, amount));

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

    @Test
    void installmentSeriesExpandsToOneOccurrencePerParcel() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Laptop");
        when(dto.parcelsNumber()).thenReturn(12);
        when(dto.currentParcel()).thenReturn(null);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 15));

        RecurrenceDefinition series = series(dto);
        List<Transaction> result = generator.generate(dto, series, selfShares);

        assertThat(result).hasSize(12);

        Transaction first = result.get(0);
        Transaction last = result.get(11);
        assertThat(first.getStartDate()).isEqualTo(LocalDate.of(2026, 1, 15));
        assertThat(last.getStartDate()).isEqualTo(LocalDate.of(2026, 12, 15));
        assertThat(first.getDescription()).endsWith("(1/12)");
        assertThat(last.getDescription()).endsWith("(12/12)");

        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getAmount()).isEqualTo(amount);
            assertThat(tx.getParcelsNumber()).isEqualTo(12);
            assertThat(tx.getSeriesId()).isEqualTo(series.getSeriesId());
            assertThat(tx.getCreatedBy()).isSameAs(user);
            assertThat(tx.getType()).isEqualTo(TransactionType.DEBIT);
        });
    }

    @Test
    void inProgressInstallmentGeneratesCurrentParcelThroughLast() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Laptop");
        when(dto.parcelsNumber()).thenReturn(12);
        when(dto.currentParcel()).thenReturn(5);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 15));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(8);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 15));
        assertThat(result.get(7).getStartDate()).isEqualTo(LocalDate.of(2026, 8, 15));
        assertThat(result.get(0).getDescription()).endsWith("(5/12)");
        assertThat(result.get(7).getDescription()).endsWith("(12/12)");
        assertThat(result).allSatisfy(tx -> assertThat(tx.getParcelsNumber()).isEqualTo(12));
    }

    @Test
    void installmentWithCurrentParcelOneMatchesDefaultBehaviour() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Laptop");
        when(dto.parcelsNumber()).thenReturn(12);
        when(dto.currentParcel()).thenReturn(1);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 15));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(12);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 15));
        assertThat(result.get(11).getStartDate()).isEqualTo(LocalDate.of(2026, 12, 15));
        assertThat(result.get(0).getDescription()).endsWith("(1/12)");
        assertThat(result.get(11).getDescription()).endsWith("(12/12)");
    }

    @Test
    void inProgressInstallmentAtLastParcelGeneratesSingleRow() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Laptop");
        when(dto.parcelsNumber()).thenReturn(12);
        when(dto.currentParcel()).thenReturn(12);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 15));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 15));
        assertThat(result.get(0).getDescription()).endsWith("(12/12)");
    }

    @Test
    void installmentCapAppliesToGeneratedCountNotTotal() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Laptop");
        when(dto.parcelsNumber()).thenReturn(200);
        when(dto.currentParcel()).thenReturn(1);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 15));

        assertThatThrownBy(() -> generator.generate(dto, series(dto), selfShares))
                .isInstanceOf(TransactionExceptions.SeriesTooManyOccurrencesException.class)
                .hasMessageContaining("too many occurrences");

        when(dto.parcelsNumber()).thenReturn(200);
        when(dto.currentParcel()).thenReturn(81);
        List<Transaction> result = generator.generate(dto, series(dto), selfShares);
        assertThat(result).hasSize(120);
    }

    @Test
    void recurringMonthlySeriesExpandsInclusiveOfEndDate() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Gym membership");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 1));
        when(dto.endDate()).thenReturn(LocalDate.of(2026, 12, 1));

        RecurrenceDefinition series = series(dto);
        List<Transaction> result = generator.generate(dto, series, selfShares);

        assertThat(result).hasSize(12);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(result.get(11).getStartDate()).isEqualTo(LocalDate.of(2026, 12, 1));

        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getDescription()).isEqualTo("Gym membership");
            assertThat(tx.getParcelsNumber()).isNull();
            assertThat(tx.getEndDate()).isNull();
            assertThat(tx.getSeriesId()).isEqualTo(series.getSeriesId());
        });
    }

    @Test
    void installmentSeriesClampsDayOfMonthOverflow() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Rent deposit");
        when(dto.parcelsNumber()).thenReturn(2);
        when(dto.currentParcel()).thenReturn(null);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 31));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 31));
        assertThat(result.get(1).getStartDate()).isEqualTo(LocalDate.of(2026, 2, 28));
    }

    @Test
    void recurringSeriesKeepsTheStartDayAfterAShortMonth() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Rent");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 31));
        when(dto.endDate()).thenReturn(LocalDate.of(2026, 4, 30));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result)
                .extracting(Transaction::getStartDate)
                .containsExactly(
                        LocalDate.of(2026, 1, 31), LocalDate.of(2026, 2, 28),
                        LocalDate.of(2026, 3, 31), LocalDate.of(2026, 4, 30));
    }

    @Test
    void recurringSeriesExceedingCapThrows() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Forever");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 1));
        when(dto.endDate()).thenReturn(LocalDate.of(2050, 1, 1));

        assertThatThrownBy(() -> generator.generate(dto, series(dto), selfShares))
                .isInstanceOf(TransactionExceptions.SeriesTooManyOccurrencesException.class)
                .hasMessageContaining("too many occurrences");
    }

    @Test
    void installmentSeriesStampsSameParticipantSharesOnEveryOccurrence() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.INSTALLMENT);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Rent");
        when(dto.parcelsNumber()).thenReturn(3);
        when(dto.currentParcel()).thenReturn(null);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 1));

        List<Share> shares =
                List.of(new Share(user, new BigDecimal("150.00")), new Share(other, new BigDecimal("150.00")));

        List<Transaction> result = generator.generate(dto, series(dto), shares);

        assertThat(result).hasSize(3);
        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getSplitMode()).isEqualTo(SplitMode.EQUAL);
            assertThat(tx.getParticipants()).hasSize(2);
            assertThat(tx.getParticipants())
                    .extracting(p -> p.getMember().getId())
                    .containsExactlyInAnyOrder(user.getId(), other.getId());
            assertThat(tx.getParticipants())
                    .allSatisfy(p -> assertThat(p.getShareAmount()).isEqualByComparingTo("150.00"));
            assertThat(tx.getParticipants())
                    .allSatisfy(p -> assertThat(p.getTransaction()).isSameAs(tx));
        });
    }

    @Test
    void recurringSeriesStampsSameParticipantSharesOnEveryOccurrence() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Gym membership");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 1));
        when(dto.endDate()).thenReturn(LocalDate.of(2026, 3, 1));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(3);
        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getParticipants()).hasSize(1);
            assertThat(tx.getParticipants().get(0).getMember().getId()).isEqualTo(user.getId());
            assertThat(tx.getParticipants().get(0).getShareAmount()).isEqualByComparingTo(amount);
        });
    }

    @Test
    void recurringSeriesWithEndDateIgnoresClockAndProducesBoundedOutputUnchanged() {
        // Regression: presence of an injected Clock must not alter bounded (endDate-present) output at all.
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Gym membership");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 1, 1));
        when(dto.endDate()).thenReturn(LocalDate.of(2026, 12, 1));

        List<Transaction> result = generator.generate(dto, series(dto), selfShares);

        assertThat(result).hasSize(12);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(result.get(11).getStartDate()).isEqualTo(LocalDate.of(2026, 12, 1));
    }

    @Test
    void openEndedRecurringSeriesGeneratesTwelveMonthHorizonFromToday() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Streaming subscription");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2026, 7, 24));
        when(dto.endDate()).thenReturn(null);

        RecurrenceDefinition series = series(dto);
        List<Transaction> result = generator.generate(dto, series, selfShares);

        // "today" is the fixed clock (2026-07-24); horizon = today + 12 months = 2027-07-24, inclusive.
        assertThat(result).hasSize(13);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 7, 24));
        assertThat(result.get(result.size() - 1).getStartDate()).isEqualTo(LocalDate.of(2027, 7, 24));
        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getEndDate()).isNull();
            assertThat(tx.getParcelsNumber()).isNull();
            assertThat(tx.getSeriesId()).isEqualTo(series.getSeriesId());
        });
    }

    @Test
    void openEndedRecurringSeriesWithVeryOldStartHitsMaxOccurrencesGuard() {
        CreateSeriesRequest dto = mock(CreateSeriesRequest.class);
        when(dto.mode()).thenReturn(RecurrenceMode.RECURRING);
        when(dto.type()).thenReturn(TransactionType.DEBIT);
        when(dto.amount()).thenReturn(amount);
        when(dto.description()).thenReturn("Ancient subscription");
        when(dto.interval()).thenReturn(RecurrenceInterval.MONTHLY);
        when(dto.startDate()).thenReturn(LocalDate.of(2005, 1, 1));
        when(dto.endDate()).thenReturn(null);

        // Span from 2005-01-01 to horizon (2027-07-24, fixed clock + 12mo) is ~270 months, well past 120.
        assertThatThrownBy(() -> generator.generate(dto, series(dto), selfShares))
                .isInstanceOf(TransactionExceptions.SeriesTooManyOccurrencesException.class)
                .hasMessageContaining("too many occurrences");
    }

    @Test
    void forwardWindowGeneratesOnlyMonthsStrictlyAfterWatermarkThroughHorizon() {
        RecurrenceDefinition def = openEndedDefinition(LocalDate.of(2026, 1, 1));

        List<Transaction> result =
                generator.generateForwardWindow(def, LocalDate.of(2026, 6, 1), LocalDate.of(2027, 1, 1), selfShares);

        assertThat(result)
                .extracting(Transaction::getStartDate)
                .containsExactly(
                        LocalDate.of(2026, 7, 1),
                        LocalDate.of(2026, 8, 1),
                        LocalDate.of(2026, 9, 1),
                        LocalDate.of(2026, 10, 1),
                        LocalDate.of(2026, 11, 1),
                        LocalDate.of(2026, 12, 1),
                        LocalDate.of(2027, 1, 1));
        assertThat(result).allSatisfy(tx -> {
            assertThat(tx.getSeriesId()).isEqualTo(def.getSeriesId());
            assertThat(tx.getRecurrenceDefinition()).isSameAs(def);
            assertThat(tx.getParcelsNumber()).isNull();
            assertThat(tx.getEndDate()).isNull();
            assertThat(tx.getDescription()).isEqualTo(def.getDescription());
        });
    }

    @Test
    void forwardWindowNeverProducesAnExceptedDate() {
        RecurrenceDefinition def = openEndedDefinition(LocalDate.of(2026, 1, 1));
        def.except(LocalDate.of(2026, 8, 1));

        List<Transaction> result =
                generator.generateForwardWindow(def, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 10, 1), selfShares);

        assertThat(result)
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 9, 1), LocalDate.of(2026, 10, 1));
    }

    @Test
    void forwardWindowKeepsTheStartDayAfterAShortMonth() {
        RecurrenceDefinition def = openEndedDefinition(LocalDate.of(2026, 1, 31));

        List<Transaction> result =
                generator.generateForwardWindow(def, LocalDate.of(2026, 1, 31), LocalDate.of(2026, 3, 31), selfShares);

        assertThat(result)
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 2, 28), LocalDate.of(2026, 3, 31));
    }

    @Test
    void forwardWindowSecondPassAfterAdvancingWatermarkProducesNoOverlap() {
        RecurrenceDefinition def = openEndedDefinition(LocalDate.of(2026, 1, 1));

        List<Transaction> firstPass =
                generator.generateForwardWindow(def, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 9, 1), selfShares);
        assertThat(firstPass)
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 8, 1), LocalDate.of(2026, 9, 1));

        LocalDate advancedWatermark = firstPass.get(firstPass.size() - 1).getStartDate();
        List<Transaction> secondPass =
                generator.generateForwardWindow(def, advancedWatermark, LocalDate.of(2026, 12, 1), selfShares);

        assertThat(secondPass)
                .extracting(Transaction::getStartDate)
                .containsExactly(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 11, 1), LocalDate.of(2026, 12, 1));

        List<LocalDate> secondPassDates =
                secondPass.stream().map(Transaction::getStartDate).toList();
        assertThat(firstPass).extracting(Transaction::getStartDate).doesNotContainAnyElementsOf(secondPassDates);
    }

    @Test
    void forwardWindowHonorsMaxOccurrencesCapPerPass() {
        RecurrenceDefinition def = openEndedDefinition(LocalDate.of(2000, 1, 1));

        assertThatThrownBy(() -> generator.generateForwardWindow(
                        def, LocalDate.of(2000, 1, 1), LocalDate.of(2020, 1, 1), selfShares))
                .isInstanceOf(TransactionExceptions.SeriesTooManyOccurrencesException.class)
                .hasMessageContaining("too many occurrences");
    }

    /** The series the occurrences belong to, saved before generation as createSeries does. */
    private RecurrenceDefinition series(CreateSeriesRequest dto) {
        return definition(dto.type(), dto.startDate());
    }

    private RecurrenceDefinition openEndedDefinition(LocalDate startDate) {
        return definition(TransactionType.DEBIT, startDate);
    }

    private RecurrenceDefinition definition(TransactionType type, LocalDate startDate) {
        return RecurrenceDefinition.create(new SeriesDraft(
                plan,
                user,
                null,
                type,
                amount,
                "Gym membership",
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                startDate,
                null,
                SplitMode.EQUAL,
                selfShares));
    }
}
