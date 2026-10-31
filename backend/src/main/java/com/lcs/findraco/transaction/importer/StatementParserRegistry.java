package com.lcs.findraco.transaction.importer;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.io.IOException;
import java.io.StringReader;
import java.io.UncheckedIOException;
import java.util.List;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

/** Reads a file with the parser that recognises its header, so the import service holds no parsing. */
@Component
public class StatementParserRegistry {

    private final List<StatementParser> parsers;
    private final CardBillDetector cardBills;

    public StatementParserRegistry(List<StatementParser> parsers, CardBillDetector cardBills) {
        this.parsers = parsers;
        this.cardBills = cardBills;
    }

    /**
     * Reads {@code content} with the parser that recognises its header.
     *
     * @throws TransactionExceptions.ImportEncodingInvalidException the file is not UTF-8.
     * @throws TransactionExceptions.CsvUnknownFormatException no parser recognises the header.
     * @throws TransactionExceptions.CsvFormatNotSupportedException the format is known but not imported yet.
     */
    public ParseResult parse(byte[] content, ImportLimits limits) {
        String text = StrictUtf8.decode(content);
        List<String> header = header(text);
        for (StatementParser parser : parsers) {
            if (parser.supports(header)) {
                return parser.parse(new StringReader(text), limits);
            }
        }
        if (cardBills.recognises(header)) {
            throw new TransactionExceptions.CsvFormatNotSupportedException();
        }
        throw new TransactionExceptions.CsvUnknownFormatException();
    }

    private static List<String> header(String text) {
        try (CSVParser parser =
                CSVFormat.RFC4180.builder().setIgnoreEmptyLines(true).get().parse(new StringReader(text))) {
            CSVRecord first = parser.stream().findFirst().orElse(null);
            return first == null ? List.of() : first.toList();
        } catch (UncheckedIOException e) {
            return List.of();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
