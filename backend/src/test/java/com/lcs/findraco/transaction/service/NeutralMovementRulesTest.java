package com.lcs.findraco.transaction.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.transaction.model.TransactionKind;
import java.util.List;
import org.junit.jupiter.api.Test;

class NeutralMovementRulesTest {

    private static final List<String> MEMBERS = List.of("Lucas Martins", "Marina Lima");

    @Test
    void aCardBillStartsTheTextWhateverItsCaseOrSurroundingSpace() {
        assertThat(NeutralMovementRules.isCardBillPayment("Pagamento de fatura"))
                .isTrue();
        assertThat(NeutralMovementRules.isCardBillPayment("  PAGAMENTO DE FATURA - Nubank "))
                .isTrue();
        assertThat(NeutralMovementRules.isCardBillPayment("Estorno: Pagamento de fatura"))
                .isFalse();
    }

    @Test
    void aPixToAMemberIsATransferIgnoringAccentsAndCase() {
        assertThat(propose("Transferência enviada pelo Pix - MARINA SOUZA LIMA - ••.123.456-•• - NU"))
                .isEqualTo(TransactionKind.TRANSFER);
        assertThat(propose("Transferência recebida pelo Pix - Marína Lima - ••.123.456-•• - NU"))
                .isEqualTo(TransactionKind.TRANSFER);
    }

    @Test
    void aPixToSomeoneElseOrWithoutACounterpartProposesNothing() {
        assertThat(propose("Transferência enviada pelo Pix - MARINA COSTA - ••.987.654-•• - NU"))
                .isNull();
        assertThat(propose("Transferência enviada pelo Pix - LIMA - ••.987.654-•• - NU"))
                .isNull();
        assertThat(propose("Transferência enviada pelo Pix")).isNull();
        // The name counts in the counterpart segment only, not further along the text.
        assertThat(propose("Transferência enviada pelo Pix - JOAO SILVA - Marina Lima Ltda"))
                .isNull();
        assertThat(propose("Compra no débito - Mercado Marina Lima")).isNull();
    }

    @Test
    void aOneWordNameMatchesOnlyTheWholeCounterpartName() {
        List<String> members = List.of("Lucas");

        assertThat(NeutralMovementRules.propose("Transferência enviada pelo Pix - LUCAS - ••.1 - NU", members))
                .isEqualTo(TransactionKind.TRANSFER);
        assertThat(NeutralMovementRules.propose("Transferência enviada pelo Pix - LUCAS FERREIRA - ••.1 - NU", members))
                .isNull();
    }

    @Test
    void aCardBillWinsOverAPixText() {
        assertThat(propose("Pagamento de fatura pelo Pix - Marina Lima - x"))
                .isEqualTo(TransactionKind.CARD_BILL_PAYMENT);
    }

    private static TransactionKind propose(String text) {
        return NeutralMovementRules.propose(text, MEMBERS);
    }
}
