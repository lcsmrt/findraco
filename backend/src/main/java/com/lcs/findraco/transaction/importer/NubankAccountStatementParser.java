package com.lcs.findraco.transaction.importer;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.io.IOException;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

/**
 * The Nubank account statement: {@code date,amount,id,description}, dates as {@code dd/MM/yyyy}, amounts
 * signed with a dot. The description may hold commas only inside quotes.
 */
@Component
public class NubankAccountStatementParser implements StatementParser {

    private static final List<List<String>> HEADERS = List.of(
            List.of("date", "amount", "id", "description"), List.of("data", "valor", "identificador", "descricao"));

    private static final int COLUMNS = 4;
    private static final int MAX_REF_LENGTH = 255;
    /** What the bank's text column holds; the transaction's own description keeps the first 255. */
    public static final int MAX_TEXT_LENGTH = 512;

    private static final DateTimeFormatter DATE =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);
    private static final Pattern AMOUNT = Pattern.compile("-?\\d{1,13}(\\.\\d{1,2})?");
    private static final CSVFormat FORMAT =
            CSVFormat.RFC4180.builder().setIgnoreEmptyLines(true).get();

    @Override
    public boolean supports(List<String> header) {
        return HEADERS.contains(header.stream().map(HeaderNames::normalize).toList());
    }

    @Override
    public ParseResult parse(Reader reader, ImportLimits limits) {
        List<ImportedRow> rows = new ArrayList<>();
        List<ImportError> errors = new ArrayList<>();
        try (CSVParser parser = FORMAT.parse(reader)) {
            Iterator<CSVRecord> records = parser.iterator();
            if (records.hasNext()) {
                records.next();
            }
            int count = 0;
            while (errors.size() <= limits.maxErrors() && records.hasNext()) {
                CSVRecord record = records.next();
                if (++count > limits.maxRows()) {
                    throw new TransactionExceptions.ImportTooManyRowsException(limits.maxRows());
                }
                readRow(record, (int) parser.getCurrentLineNumber(), rows, errors);
            }
        } catch (UncheckedIOException e) {
            // Bad quoting: the reader cannot find the next record, so nothing after this line can be read.
            errors.add(new ImportError(lineOf(e), "row", "malformed"));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
        return new ParseResult(rows, errors);
    }

    private static int lineOf(UncheckedIOException e) {
        String message = e.getCause() == null ? "" : String.valueOf(e.getCause().getMessage());
        Matcher matcher = Pattern.compile("line:?\\s*(\\d+)").matcher(message);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : 0;
    }

    private static void readRow(CSVRecord record, int line, List<ImportedRow> rows, List<ImportError> errors) {
        if (record.size() != COLUMNS) {
            errors.add(new ImportError(line, "row", "column-count"));
            return;
        }
        int before = errors.size();
        LocalDate date = date(record.get(0), line, errors);
        BigDecimal amount = amount(record.get(1), line, errors);
        String ref = record.get(2).strip();
        if (ref.length() > MAX_REF_LENGTH) {
            errors.add(new ImportError(line, "id", "too-long"));
        }
        String text = record.get(3).strip();
        if (text.isEmpty()) {
            errors.add(new ImportError(line, "description", "blank"));
        } else if (text.length() > MAX_TEXT_LENGTH) {
            errors.add(new ImportError(line, "description", "too-long"));
        }
        if (errors.size() == before && date != null && amount != null) {
            // A blank reference means the bank gave none: the row cannot be told apart, so it is always new.
            rows.add(new ImportedRow(date, amount, text, ref.isEmpty() ? null : ref, StatementFormat.NUBANK_ACCOUNT));
        }
    }

    private static @Nullable LocalDate date(String cell, int line, List<ImportError> errors) {
        try {
            return LocalDate.parse(cell.strip(), DATE);
        } catch (DateTimeParseException e) {
            errors.add(new ImportError(line, "date", "date-invalid"));
            return null;
        }
    }

    private static @Nullable BigDecimal amount(String cell, int line, List<ImportError> errors) {
        String text = cell.strip();
        if (!AMOUNT.matcher(text).matches()) {
            errors.add(new ImportError(line, "amount", "amount-invalid"));
            return null;
        }
        BigDecimal amount = new BigDecimal(text);
        if (amount.signum() == 0) {
            errors.add(new ImportError(line, "amount", "amount-zero"));
            return null;
        }
        return amount;
    }
}
