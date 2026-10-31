package com.lcs.findraco.transaction.importer;

import java.util.List;

/** What a parser found: the valid rows and the invalid lines. Any error means the file is rejected. */
public record ParseResult(List<ImportedRow> rows, List<ImportError> errors) {}
