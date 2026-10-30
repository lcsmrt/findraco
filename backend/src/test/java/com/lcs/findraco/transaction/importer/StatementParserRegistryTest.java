package com.lcs.findraco.transaction.importer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

/** The statement parser as the import service uses it: bytes in, rows and line errors out. */
class StatementParserRegistryTest {

    private static final String HEADER = "date,amount,id,description\n";

    private final StatementParserRegistry registry =
            new StatementParserRegistry(List.of(new NubankAccountStatementParser()), new CardBillDetector());
    private final ImportLimits limits = new ImportLimits(5000, 50);

    private ParseResult parse(String text) {
        return registry.parse(text.getBytes(StandardCharsets.UTF_8), limits);
    }

    @Test
    void validFileGivesEveryRowWithTheBanksText() {
        ParseResult result = parse(HEADER + "15/07/2026,-50.00,nu-1,Uber trip\n16/07/2026,1200.00,nu-2,Salary\n");

        assertThat(result.errors()).isEmpty();
        assertThat(result.rows()).hasSize(2);
        ImportedRow first = result.rows().get(0);
        assertThat(first.date()).isEqualTo(LocalDate.of(2026, 7, 15));
        assertThat(first.amount()).isEqualByComparingTo(new BigDecimal("-50.00"));
        assertThat(first.sourceText()).isEqualTo("Uber trip");
        assertThat(first.sourceRef()).isEqualTo("nu-1");
        assertThat(first.format()).isEqualTo(StatementFormat.NUBANK_ACCOUNT);
    }

    @Test
    void badDateIsListedWithItsLine() {
        ParseResult result = parse(HEADER + "15/07/2026,-50.00,a,ok\n31/02/2026,-5.00,b,bad\n");

        assertThat(result.errors()).containsExactly(new ImportError(3, "date", "date-invalid"));
        assertThat(result.rows()).hasSize(1);
    }

    @Test
    void badAmountIsListedWithItsLine() {
        ParseResult result = parse(HEADER + "15/07/2026,abc,a,bad\n16/07/2026,0.00,b,zero\n");

        assertThat(result.errors())
                .containsExactly(
                        new ImportError(2, "amount", "amount-invalid"), new ImportError(3, "amount", "amount-zero"));
    }

    @Test
    void missingColumnIsListed() {
        ParseResult result = parse(HEADER + "15/07/2026,-50.00,a\n");

        assertThat(result.errors()).containsExactly(new ImportError(2, "row", "column-count"));
    }

    @Test
    void everyBadLineIsListedAndGoodLinesStillRead() {
        ParseResult result = parse(HEADER + "x,-1.00,a,one\n15/07/2026,-2.00,b,two\n15/07/2026,y,c,three\n");

        assertThat(result.errors()).extracting(ImportError::line).containsExactly(2, 4);
        assertThat(result.rows()).hasSize(1);
    }

    @Test
    void emptyFileHasNoRecognisableFormat() {
        assertThatThrownBy(() -> parse("")).isInstanceOf(TransactionExceptions.CsvUnknownFormatException.class);
    }

    @Test
    void headerOnlyFileGivesNoRowsAndNoErrors() {
        ParseResult result = parse(HEADER);

        assertThat(result.rows()).isEmpty();
        assertThat(result.errors()).isEmpty();
    }

    @Test
    void commaInsideQuotesStaysInTheDescription() {
        ParseResult result = parse(HEADER + "17/07/2026,-89.90,nu-3,\"Restaurant, dinner\"\n");

        assertThat(result.rows().get(0).sourceText()).isEqualTo("Restaurant, dinner");
    }

    @Test
    void quotesAreKeptOutOfValues() {
        ParseResult result = parse(HEADER + "17/07/2026,\"-89.90\",\"nu-3\",\"Bar \"\"Ze\"\"\"\n");

        ImportedRow row = result.rows().get(0);
        assertThat(row.sourceRef()).isEqualTo("nu-3");
        assertThat(row.amount()).isEqualByComparingTo(new BigDecimal("-89.90"));
        assertThat(row.sourceText()).isEqualTo("Bar \"Ze\"");
    }

    @Test
    void byteOrderMarkIsNotPartOfTheHeader() {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        bytes.writeBytes(new byte[] {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
        bytes.writeBytes((HEADER + "15/07/2026,-50.00,a,Uber\n").getBytes(StandardCharsets.UTF_8));

        ParseResult result = registry.parse(bytes.toByteArray(), limits);

        assertThat(result.rows()).hasSize(1);
    }

    @Test
    void unknownHeaderIsRefused() {
        assertThatThrownBy(() -> parse("foo,bar\n1,2\n"))
                .isInstanceOf(TransactionExceptions.CsvUnknownFormatException.class);
    }

    @Test
    void cardBillHeaderIsKnownButNotSupported() {
        assertThatThrownBy(() -> parse("date,category,title,amount\n2026-07-15,food,Pizza,30.00\n"))
                .isInstanceOf(TransactionExceptions.CsvFormatNotSupportedException.class);
    }

    @Test
    void blankLinesAreSkippedAndLineNumbersStayTrue() {
        ParseResult result = parse(HEADER + "\n15/07/2026,-50.00,a,ok\n\n\nx,-1.00,b,bad\n");

        assertThat(result.rows()).hasSize(1);
        assertThat(result.errors()).containsExactly(new ImportError(6, "date", "date-invalid"));
    }

    @Test
    void invalidUtf8NamesTheLine() {
        byte[] bad = (HEADER + "15/07/2026,-50.00,a,ok\n15/07/2026,-5.00,b,caf").getBytes(StandardCharsets.UTF_8);
        byte[] withBadByte = new byte[bad.length + 1];
        System.arraycopy(bad, 0, withBadByte, 0, bad.length);
        withBadByte[bad.length] = (byte) 0xE9;

        assertThatThrownBy(() -> registry.parse(withBadByte, limits))
                .isInstanceOf(TransactionExceptions.ImportEncodingInvalidException.class)
                .hasMessageContaining("line 3");
    }

    @Test
    void moreRowsThanTheBoundFail() {
        String rows = "15/07/2026,-1.00,a,x\n".repeat(4);

        assertThatThrownBy(
                        () -> registry.parse((HEADER + rows).getBytes(StandardCharsets.UTF_8), new ImportLimits(3, 50)))
                .isInstanceOf(TransactionExceptions.ImportTooManyRowsException.class);
    }

    @Test
    void errorsStopAtTheCapPlusOneSoTheCallerCanTellItWasCut() {
        String rows = "x,-1.00,a,bad\n".repeat(10);

        ParseResult result =
                registry.parse((HEADER + rows).getBytes(StandardCharsets.UTF_8), new ImportLimits(5000, 3));

        assertThat(result.errors()).hasSize(4);
    }
}
