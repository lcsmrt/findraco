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

class TransactionTest {

    private static final LocalDate DAY = LocalDate.of(2026, 3, 10);

    private final Plan plan = new Plan();
    private final User owner = userWithId(1L);
    private final User partner = userWithId(2L);

    @Test
    void createWithoutParticipantsFails() {
        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, List.of(), List.of())))
                .isInstanceOf(TransactionExceptions.ParticipantsRequiredException.class);
    }

    @Test
    void exactSplitWithAMissingShareFails() {
        List<Share> shares = List.of(share(owner, "100.00"), new Share(partner, null));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EXACT, shares, List.of())))
                .isInstanceOf(TransactionExceptions.ExactShareInvalidException.class);
    }

    @Test
    void exactSplitWithANegativeShareFails() {
        List<Share> shares = List.of(share(owner, "110.00"), share(partner, "-10.00"));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EXACT, shares, List.of())))
                .isInstanceOf(TransactionExceptions.ExactShareInvalidException.class);
    }

    @Test
    void exactSplitThatDoesNotSumToTheAmountFails() {
        List<Share> shares = List.of(share(owner, "60.00"), share(partner, "30.00"));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EXACT, shares, List.of())))
                .isInstanceOf(TransactionExceptions.ParticipantSharesMismatchException.class);
    }

    @Test
    void aMemberTakesPartOnlyOnce() {
        List<Share> shares = List.of(new Share(owner, null), new Share(owner, null));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, shares, List.of())))
                .isInstanceOf(TransactionExceptions.DuplicateParticipantException.class);
    }

    @Test
    void equalSplitGivesEveryParticipantThePartsOfTheAmount() {
        Transaction transaction = Transaction.create(draft(
                details("100.00"),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), new Share(partner, null)),
                List.of()));

        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("50.00"), new BigDecimal("50.00"));
    }

    @Test
    void endBeforeStartFails() {
        TransactionDetails details = new TransactionDetails(
                null, TransactionType.DEBIT, new BigDecimal("100.00"), "Rent", DAY, DAY.minusDays(1), null);

        assertThatThrownBy(() -> Transaction.create(draft(details, SplitMode.EQUAL, self(), List.of())))
                .isInstanceOf(TransactionExceptions.PeriodStartAfterEndException.class);
    }

    @Test
    void categoryOfAnotherTypeFails() {
        TransactionDetails details = new TransactionDetails(
                category(TransactionType.CREDIT),
                TransactionType.DEBIT,
                new BigDecimal("100.00"),
                "Rent",
                DAY,
                null,
                null);

        assertThatThrownBy(() -> Transaction.create(draft(details, SplitMode.EQUAL, self(), List.of())))
                .isInstanceOf(TransactionExceptions.CategoryTypeMismatchException.class);
    }

    @Test
    void itemsAboveTheAmountFail() {
        List<ItemDraft> items = List.of(item("60.00", null), item("50.00", null));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), items)))
                .isInstanceOf(TransactionExceptions.ItemsTotalExceedsAmountException.class);
    }

    @Test
    void itemOfAnotherCategoryTypeFails() {
        List<ItemDraft> items = List.of(item("10.00", category(TransactionType.CREDIT)));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), items)))
                .isInstanceOf(TransactionExceptions.ItemCategoryTypeMismatchException.class);
    }

    @Test
    void itemWithoutDescriptionOrPositiveAmountFails() {
        List<ItemDraft> blank = List.of(new ItemDraft(" ", new BigDecimal("10.00"), null, null));
        List<ItemDraft> zero = List.of(item("0.00", null));

        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), blank)))
                .isInstanceOf(TransactionExceptions.InvalidItemException.class);
        assertThatThrownBy(() -> Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), zero)))
                .isInstanceOf(TransactionExceptions.InvalidItemException.class);
    }

    @Test
    void editKeepsTheRowOfAMemberWhoStays() {
        Transaction transaction = Transaction.create(draft(
                details("100.00"),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), new Share(partner, null)),
                List.of()));
        TransactionParticipant ownerRow = transaction.getParticipants().getFirst();

        transaction.edit(details("80.00"), SplitMode.EQUAL, List.of(new Share(owner, null)), List.of());

        assertThat(transaction.getParticipants()).containsExactly(ownerRow);
        assertThat(ownerRow.getShareAmount()).isEqualByComparingTo("80.00");
    }

    @Test
    void aRefusedEditChangesNothing() {
        Transaction transaction = Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of()));

        assertThatThrownBy(() -> transaction.edit(details("50.00"), SplitMode.EQUAL, List.of(), List.of()))
                .isInstanceOf(TransactionExceptions.ParticipantsRequiredException.class);

        assertThat(transaction.getAmount()).isEqualByComparingTo("100.00");
        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("100.00"));
    }

    @Test
    void editKeepingItemsFailsWhenTheyNoLongerFit() {
        Transaction transaction =
                Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of(item("70.00", null))));

        assertThatThrownBy(() -> transaction.edit(details("50.00"), SplitMode.EQUAL, self()))
                .isInstanceOf(TransactionExceptions.ItemsTotalExceedsAmountException.class);
        assertThat(transaction.getAmount()).isEqualByComparingTo("100.00");
    }

    @Test
    void replaceSplitChecksTheSharesAgainstTheAmount() {
        Transaction transaction = Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of()));

        transaction.replaceSplit(SplitMode.EXACT, List.of(share(owner, "30.00"), share(partner, "70.00")));

        assertThat(transaction.getSplitMode()).isEqualTo(SplitMode.EXACT);
        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("30.00"), new BigDecimal("70.00"));
        assertThatThrownBy(() -> transaction.replaceSplit(SplitMode.EXACT, List.of(share(owner, "30.00"))))
                .isInstanceOf(TransactionExceptions.ParticipantSharesMismatchException.class);
    }

    @Test
    void replaceItemsChecksThemAgainstTheAmount() {
        Transaction transaction = Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of()));

        transaction.replaceItems(List.of(item("40.00", null)));

        assertThat(transaction.getItems())
                .extracting(TransactionItem::getQuantity)
                .containsExactly(1);
        assertThatThrownBy(() -> transaction.replaceItems(List.of(item("101.00", null))))
                .isInstanceOf(TransactionExceptions.ItemsTotalExceedsAmountException.class);
        assertThat(transaction.getItems())
                .extracting(TransactionItem::getAmount)
                .containsExactly(new BigDecimal("40.00"));
    }

    @Test
    void childrenChangeOnlyThroughTheRoot() {
        Transaction transaction = Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of()));

        assertThatThrownBy(() -> transaction.getParticipants().clear())
                .isInstanceOf(UnsupportedOperationException.class);
        assertThatThrownBy(() -> transaction.getItems().clear()).isInstanceOf(UnsupportedOperationException.class);
        assertThat(Arrays.stream(Transaction.class.getMethods()).map(method -> method.getName()))
                .noneMatch(name -> name.startsWith("set"));
    }

    private TransactionDraft draft(
            TransactionDetails details, SplitMode mode, List<Share> shares, List<ItemDraft> items) {
        return new TransactionDraft(plan, owner, details, mode, shares, items, null, null);
    }

    private static TransactionDetails details(String amount) {
        return new TransactionDetails(
                null, TransactionType.DEBIT, new BigDecimal(amount), "Groceries", DAY, null, null);
    }

    private List<Share> self() {
        return List.of(new Share(owner, null));
    }

    private static Share share(User member, String amount) {
        return new Share(member, new BigDecimal(amount));
    }

    private static ItemDraft item(String amount, Category category) {
        return new ItemDraft("Item", new BigDecimal(amount), null, category);
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
