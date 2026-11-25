package com.lcs.findraco.transaction.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.SplitResolver.ParticipantInput;
import com.lcs.findraco.transaction.model.SplitResolver.ResolvedShare;
import com.lcs.findraco.user.model.User;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class SplitResolverTest {

    private final SplitResolver resolver = new SplitResolver();

    @Test
    void equalSplitDividesEvenlyWhenAmountDividesCleanly() {
        List<ParticipantInput> inputs = List.of(new ParticipantInput(1L, null), new ParticipantInput(2L, null));

        List<ResolvedShare> shares = resolver.resolve(new BigDecimal("100.00"), SplitMode.EQUAL, inputs);

        assertThat(shares)
                .extracting(ResolvedShare::shareAmount)
                .containsExactly(new BigDecimal("50.00"), new BigDecimal("50.00"));
        assertThat(sum(shares)).isEqualByComparingTo("100.00");
    }

    @Test
    void equalSplitDistributesResidualCentDeterministicallyToFirstParticipants() {
        List<ParticipantInput> inputs =
                List.of(new ParticipantInput(1L, null), new ParticipantInput(2L, null), new ParticipantInput(3L, null));

        List<ResolvedShare> shares = resolver.resolve(new BigDecimal("100.00"), SplitMode.EQUAL, inputs);

        assertThat(shares)
                .extracting(ResolvedShare::shareAmount)
                .containsExactly(new BigDecimal("33.34"), new BigDecimal("33.33"), new BigDecimal("33.33"));
        assertThat(sum(shares)).isEqualByComparingTo("100.00");
    }

    @Test
    void equalSplitWithSingleParticipantIsFullAmount() {
        List<ParticipantInput> inputs = List.of(new ParticipantInput(1L, null));

        List<ResolvedShare> shares = resolver.resolve(new BigDecimal("42.50"), SplitMode.EQUAL, inputs);

        assertThat(shares).hasSize(1);
        assertThat(shares.get(0).shareAmount()).isEqualByComparingTo("42.50");
    }

    @Test
    void exactSplitUsesGivenSharesWhenTheySumToAmount() {
        List<ParticipantInput> inputs = List.of(
                new ParticipantInput(1L, new BigDecimal("70.00")), new ParticipantInput(2L, new BigDecimal("30.00")));

        List<ResolvedShare> shares = resolver.resolve(new BigDecimal("100.00"), SplitMode.EXACT, inputs);

        assertThat(shares)
                .extracting(ResolvedShare::shareAmount)
                .containsExactly(new BigDecimal("70.00"), new BigDecimal("30.00"));
    }

    @Test
    void exactSplitRejectsSharesThatDoNotSumToAmount() {
        List<ParticipantInput> inputs = List.of(
                new ParticipantInput(1L, new BigDecimal("70.00")), new ParticipantInput(2L, new BigDecimal("20.00")));

        assertThatThrownBy(() -> resolver.resolve(new BigDecimal("100.00"), SplitMode.EXACT, inputs))
                .isInstanceOf(TransactionExceptions.ParticipantSharesMismatchException.class);
    }

    @Test
    void aContactTakesItsShareLikeAMemberAndNeverTwice() {
        Contact mae = contactWithId(1L);

        List<Share> split = resolver.split(
                new BigDecimal("100.01"),
                SplitMode.EQUAL,
                List.of(new Share(userWithId(1L), null), new Share(userWithId(2L), null), Share.ofContact(mae, null)));

        assertThat(split)
                .extracting(Share::amount)
                .containsExactly(new BigDecimal("33.34"), new BigDecimal("33.34"), new BigDecimal("33.33"));
        assertThat(split.get(2).contact()).isSameAs(mae);
        assertThatThrownBy(() -> resolver.split(
                        new BigDecimal("10.00"),
                        SplitMode.EQUAL,
                        List.of(Share.ofContact(mae, null), Share.ofContact(mae, null))))
                .isInstanceOf(TransactionExceptions.DuplicateParticipantException.class);
    }

    @Test
    void aMemberAndAContactOfTheSameNumberAreNotDuplicates() {
        List<Share> split = resolver.split(
                new BigDecimal("10.00"),
                SplitMode.EQUAL,
                List.of(new Share(userWithId(1L), null), Share.ofContact(contactWithId(1L), null)));

        assertThat(split).extracting(Share::amount).containsExactly(new BigDecimal("5.00"), new BigDecimal("5.00"));
    }

    private static Contact contactWithId(long id) {
        Contact contact = Contact.create(new Plan(), "Mae", java.time.Instant.EPOCH);
        setId(contact, Contact.class, id);
        return contact;
    }

    private static User userWithId(long id) {
        User user = new User();
        setId(user, User.class, id);
        return user;
    }

    private static void setId(Object target, Class<?> type, long id) {
        try {
            Field field = type.getDeclaredField("id");
            field.setAccessible(true);
            field.set(target, id);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    private static BigDecimal sum(List<ResolvedShare> shares) {
        return shares.stream().map(ResolvedShare::shareAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
