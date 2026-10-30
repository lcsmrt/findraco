package com.lcs.findraco.transaction.importer;

import java.io.Reader;
import java.util.List;

/**
 * Reads one bank file format. A parser touches no database and keeps no state; the registry picks the
 * parser from the header, so a new bank is a new parser and nothing else changes.
 */
public interface StatementParser {

    /** Whether {@code header}, the first record of the file, is this parser's format. */
    boolean supports(List<String> header);

    /** Reads the whole file, header included, and reports every row it cannot use. */
    ParseResult parse(Reader reader, ImportLimits limits);
}
