package com.lcs.findraco.transaction.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Contact;
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
    private final Contact mae = contactWithId(1L);

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

    @Test
    void theBanksTextSurvivesEveryEdit() {
        Transaction transaction = Transaction.create(new TransactionDraft(
                plan, owner, details("100.00"), SplitMode.EQUAL, self(), List.of(), "ref-1", "UBER *TRIP", null));

        transaction.edit(
                new TransactionDetails(null, TransactionType.DEBIT, new BigDecimal("90.00"), "Taxi", DAY, null, null),
                SplitMode.EQUAL,
                self());

        assertThat(transaction.getSourceText()).isEqualTo("UBER *TRIP");
        assertThat(transaction.getDescription()).isEqualTo("Taxi");
    }

    @Test
    void aNeutralKindTakesNoCategoryItemsOrSeveralParticipants() {
        for (TransactionKind kind :
                List.of(TransactionKind.TRANSFER, TransactionKind.CARD_BILL_PAYMENT, TransactionKind.SAVINGS)) {
            TransactionDetails withCategory = kindDetails(kind, TransactionType.DEBIT, category(TransactionType.DEBIT));
            TransactionDetails plain = kindDetails(kind, TransactionType.DEBIT, null);

            assertThat(Transaction.create(draft(plain, SplitMode.EQUAL, self(), List.of()))
                            .getKind())
                    .isEqualTo(kind);
            assertThatThrownBy(() -> Transaction.create(draft(withCategory, SplitMode.EQUAL, self(), List.of())))
                    .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
            assertThatThrownBy(() ->
                            Transaction.create(draft(plain, SplitMode.EQUAL, self(), List.of(item("10.00", null)))))
                    .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
            assertThatThrownBy(() -> Transaction.create(draft(
                            plain,
                            SplitMode.EQUAL,
                            List.of(new Share(owner, null), new Share(partner, null)),
                            List.of())))
                    .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        }
    }

    @Test
    void aRefundIsACreditInTheExpenseCategoryItPaysBack() {
        Category food = category(TransactionType.DEBIT);

        Transaction refund = Transaction.create(draft(
                kindDetails(TransactionKind.REFUND, TransactionType.CREDIT, food), SplitMode.EQUAL, self(), List.of()));

        assertThat(refund.getCategory()).isSameAs(food);
        assertThatThrownBy(() -> Transaction.create(draft(
                        kindDetails(TransactionKind.REFUND, TransactionType.CREDIT, null),
                        SplitMode.EQUAL,
                        self(),
                        List.of())))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        assertThatThrownBy(() -> Transaction.create(draft(
                        kindDetails(TransactionKind.REFUND, TransactionType.CREDIT, category(TransactionType.CREDIT)),
                        SplitMode.EQUAL,
                        self(),
                        List.of())))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        assertThatThrownBy(() -> Transaction.create(draft(
                        kindDetails(TransactionKind.REFUND, TransactionType.DEBIT, food),
                        SplitMode.EQUAL,
                        self(),
                        List.of())))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
    }

    @Test
    void aNeutralKindCanBeOnAnyOneMember() {
        TransactionDetails details = kindDetails(TransactionKind.TRANSFER, TransactionType.DEBIT, null);

        Transaction partnersRow =
                Transaction.create(draft(details, SplitMode.EQUAL, List.of(new Share(partner, null)), List.of()));

        assertThat(partnersRow.getParticipants())
                .extracting(participant -> participant.getMember().getId())
                .containsExactly(partner.getId());
    }

    @Test
    void assigningANeutralKindTakesOffWhatItCannotCarry() {
        Transaction shared = Transaction.create(draft(
                detailsIn(category(TransactionType.DEBIT)),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), new Share(partner, null)),
                List.of(item("10.00", null))));
        Transaction partnersOwn = Transaction.create(draft(
                detailsIn(category(TransactionType.DEBIT)),
                SplitMode.EXACT,
                List.of(share(partner, "100.00")),
                List.of()));

        shared.assignKind(TransactionKind.TRANSFER);
        partnersOwn.assignKind(TransactionKind.SAVINGS);

        assertThat(shared.getKind()).isEqualTo(TransactionKind.TRANSFER);
        assertThat(shared.getCategory()).isNull();
        assertThat(shared.getItems()).isEmpty();
        assertThat(shared.getParticipants())
                .extracting(participant -> participant.getMember().getId(), TransactionParticipant::getShareAmount)
                .containsExactly(tuple(owner.getId(), new BigDecimal("100.00")));
        assertThat(partnersOwn.getParticipants())
                .extracting(participant -> participant.getMember().getId())
                .containsExactly(partner.getId());
        assertThat(partnersOwn.getCategory()).isNull();
    }

    @Test
    void assigningARefundChecksTheRowAsItIsAndChangesNothing() {
        Category salary = category(TransactionType.CREDIT);
        Transaction credit = Transaction.create(
                draft(kindDetails(null, TransactionType.CREDIT, salary), SplitMode.EQUAL, self(), List.of()));
        Transaction plain = Transaction.create(draft(details("100.00"), SplitMode.EQUAL, self(), List.of()));

        assertThatThrownBy(() -> credit.assignKind(TransactionKind.REFUND))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        assertThatThrownBy(() -> plain.assignKind(TransactionKind.REFUND))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);

        assertThat(credit.getKind()).isNull();
        assertThat(credit.getCategory()).isSameAs(salary);
        assertThat(plain.getKind()).isNull();
    }

    @Test
    void aContactShareFitsOnlyAPlainExpense() {
        List<Share> toTheContact = List.of(Share.ofContact(mae, null));

        assertThat(Transaction.create(draft(details("100.00"), SplitMode.EQUAL, toTheContact, List.of()))
                        .getParticipants())
                .extracting(TransactionParticipant::getContact)
                .containsExactly(mae);
        assertThatThrownBy(() -> Transaction.create(draft(
                        kindDetails(null, TransactionType.CREDIT, null), SplitMode.EQUAL, toTheContact, List.of())))
                .isInstanceOf(TransactionExceptions.ContactShareNotAllowedException.class);
        for (TransactionKind kind : TransactionKind.values()) {
            // A neutral kind takes exactly one participant and would accept this one; the contact is what it refuses.
            assertThatThrownBy(() -> Transaction.create(draft(
                            kindDetails(kind, TransactionType.DEBIT, null), SplitMode.EQUAL, toTheContact, List.of())))
                    .isInstanceOf(TransactionExceptions.ContactShareNotAllowedException.class);
        }
    }

    @Test
    void aMemberAndAContactOfTheSameNumberAreTwoParties() {
        Transaction transaction = Transaction.create(draft(
                details("100.00"),
                SplitMode.EQUAL,
                List.of(new Share(userWithId(1L), null), Share.ofContact(contactWithId(1L), null)),
                List.of()));

        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("50.00"), new BigDecimal("50.00"));
    }

    @Test
    void editingKeepsTheRowOfAContactThatStaysInTheSplit() {
        Transaction transaction = Transaction.create(draft(
                details("100.00"),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), Share.ofContact(mae, null)),
                List.of()));
        TransactionParticipant contactRow = transaction.getParticipants().get(1);

        transaction.edit(
                details("80.00"),
                SplitMode.EXACT,
                List.of(share(owner, "30.00"), Share.ofContact(mae, new BigDecimal("50.00"))));

        assertThat(transaction.getParticipants()).hasSize(2).contains(contactRow);
        assertThat(contactRow.getShareAmount()).isEqualByComparingTo("50.00");
    }

    @Test
    void takingTheContactOutOfTheSplitRemovesItsRow() {
        Transaction transaction = Transaction.create(draft(
                details("100.00"),
                SplitMode.EQUAL,
                List.of(new Share(owner, null), Share.ofContact(mae, null)),
                List.of()));

        transaction.edit(details("100.00"), SplitMode.EQUAL, self());

        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getMember)
                .containsExactly(owner);
    }

    @Test
    void aNeutralKindOnARowOfOneContactTakesTheCreatorAsPayer() {
        Transaction transaction = Transaction.create(
                draft(details("100.00"), SplitMode.EQUAL, List.of(Share.ofContact(mae, null)), List.of()));

        transaction.assignKind(TransactionKind.TRANSFER);

        assertThat(transaction.getParticipants())
                .extracting(TransactionParticipant::getMember)
                .containsExactly(owner);
    }

    @Test
    void aRefundCannotBeAssignedToARowWithAContactShare() {
        Transaction transaction = Transaction.create(
                draft(details("100.00"), SplitMode.EQUAL, List.of(Share.ofContact(mae, null)), List.of()));

        assertThatThrownBy(() -> transaction.assignKind(TransactionKind.REFUND))
                .isInstanceOf(TransactionExceptions.ContactShareNotAllowedException.class);
    }

    @Test
    void confirmingRecomputesTheContactsShareToo() {
        List<Share> shares = List.of(share(owner, "40.00"), Share.ofContact(mae, new BigDecimal("60.00")));
        RecurrenceDefinition series = RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                null,
                TransactionType.DEBIT,
                new BigDecimal("100.00"),
                "Gym",
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                DAY,
                null,
                SplitMode.EXACT,
                shares,
                true));
        Transaction occurrence = Transaction.create(
                new TransactionDraft(plan, owner, details("100.00"), SplitMode.EXACT, shares, List.of(), null, series));

        occurrence.confirm(new BigDecimal("50.00"), DAY);

        assertThat(occurrence.getParticipants())
                .extracting(TransactionParticipant::getShareAmount)
                .containsExactly(new BigDecimal("20.00"), new BigDecimal("30.00"));
    }

    @Test
    void aRepaymentIsAMembersCreditFromOneContact() {
        Transaction repayment = Transaction.create(
                draft(repaymentDetails(TransactionType.CREDIT, mae, null), SplitMode.EQUAL, self(), List.of()));

        assertThat(repayment.getKind()).isEqualTo(TransactionKind.REPAYMENT);
        assertThat(repayment.getRepaymentContact()).isSameAs(mae);
        assertThat(repayment.getParticipants()).hasSize(1);
        assertThat(repayment.getParticipants().getFirst().getMember()).isSameAs(owner);
    }

    @Test
    void aRepaymentBreakingItsShapeIsRefused() {
        Category income = category(TransactionType.CREDIT);
        List<ItemDraft> items = List.of(item("10.00", null));
        List<Share> withContact = List.of(Share.ofContact(mae, null));

        assertThat(List.of(
                        shapeFails(repaymentDetails(TransactionType.DEBIT, mae, null), self(), List.of()),
                        shapeFails(repaymentDetails(TransactionType.CREDIT, null, null), self(), List.of()),
                        shapeFails(repaymentDetails(TransactionType.CREDIT, mae, income), self(), List.of()),
                        shapeFails(repaymentDetails(TransactionType.CREDIT, mae, null), self(), items),
                        shapeFails(
                                repaymentDetails(TransactionType.CREDIT, mae, null),
                                List.of(new Share(owner, null), new Share(partner, null)),
                                List.of())))
                .containsOnly(true);
        assertThatThrownBy(() -> Transaction.create(draft(
                        repaymentDetails(TransactionType.CREDIT, mae, null), SplitMode.EQUAL, withContact, List.of())))
                .isInstanceOf(TransactionExceptions.ContactShareNotAllowedException.class);
    }

    @Test
    void onlyARepaymentNamesTheContactItCameFrom() {
        TransactionDetails refund = new TransactionDetails(
                category(TransactionType.DEBIT),
                TransactionType.CREDIT,
                new BigDecimal("100.00"),
                "Back",
                DAY,
                null,
                null,
                TransactionKind.REFUND,
                mae);
        TransactionDetails plain = new TransactionDetails(
                null, TransactionType.CREDIT, new BigDecimal("100.00"), "Pix", DAY, null, null, null, mae);

        for (TransactionDetails details : List.of(refund, plain)) {
            assertThatThrownBy(() -> Transaction.create(draft(details, SplitMode.EQUAL, self(), List.of())))
                    .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        }
    }

    @Test
    void aRepaymentIsNeverMarkedOrUnmarkedAsAKind() {
        Transaction repayment = Transaction.create(
                draft(repaymentDetails(TransactionType.CREDIT, mae, null), SplitMode.EQUAL, self(), List.of()));
        Transaction income = Transaction.create(draft(
                new TransactionDetails(null, TransactionType.CREDIT, new BigDecimal("100.00"), "Pix", DAY, null, null),
                SplitMode.EQUAL,
                self(),
                List.of()));

        assertThatThrownBy(() -> income.assignKind(TransactionKind.REPAYMENT))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        assertThatThrownBy(() -> repayment.assignKind(TransactionKind.TRANSFER))
                .isInstanceOf(TransactionExceptions.NeutralKindInvalidException.class);
        assertThat(repayment.getRepaymentContact()).isSameAs(mae);
        assertThat(income.getKind()).isNull();
    }

    @Test
    void aRepaymentEditedIntoAPlainIncomeLetsGoOfItsContact() {
        Transaction repayment = Transaction.create(
                draft(repaymentDetails(TransactionType.CREDIT, mae, null), SplitMode.EQUAL, self(), List.of()));

        repayment.edit(
                new TransactionDetails(null, TransactionType.CREDIT, new BigDecimal("100.00"), "Pix", DAY, null, null),
                SplitMode.EQUAL,
                self(),
                List.of());

        assertThat(repayment.getKind()).isNull();
        assertThat(repayment.getRepaymentContact()).isNull();
    }

    private boolean shapeFails(TransactionDetails details, List<Share> shares, List<ItemDraft> items) {
        try {
            Transaction.create(draft(details, SplitMode.EQUAL, shares, items));
            return false;
        } catch (TransactionExceptions.NeutralKindInvalidException e) {
            return true;
        }
    }

    private static TransactionDetails repaymentDetails(TransactionType type, Contact contact, Category category) {
        return new TransactionDetails(
                category,
                type,
                new BigDecimal("100.00"),
                "Pix from Mãe",
                DAY,
                null,
                null,
                TransactionKind.REPAYMENT,
                contact);
    }

    private TransactionDetails kindDetails(TransactionKind kind, TransactionType type, Category category) {
        return new TransactionDetails(category, type, new BigDecimal("100.00"), "Movement", DAY, null, null, kind);
    }

    private static TransactionDetails detailsIn(Category category) {
        return new TransactionDetails(
                category, TransactionType.DEBIT, new BigDecimal("100.00"), "Groceries", DAY, null, null);
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

    private static Contact contactWithId(long id) {
        Contact contact = Contact.create(new Plan(), "Mãe", java.time.Instant.EPOCH);
        try {
            Field field = Contact.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(contact, id);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
        return contact;
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
