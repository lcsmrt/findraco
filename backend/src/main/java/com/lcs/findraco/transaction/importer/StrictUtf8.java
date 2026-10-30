package com.lcs.findraco.transaction.importer;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CoderResult;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

/** Decodes a file as UTF-8 and refuses a byte that is not, naming its line instead of substituting it. */
final class StrictUtf8 {

    private static final char BYTE_ORDER_MARK = '﻿';

    private StrictUtf8() {}

    static String decode(byte[] content) {
        CharsetDecoder decoder = StandardCharsets.UTF_8
                .newDecoder()
                .onMalformedInput(CodingErrorAction.REPORT)
                .onUnmappableCharacter(CodingErrorAction.REPORT);
        ByteBuffer in = ByteBuffer.wrap(content);
        CharBuffer out = CharBuffer.allocate(content.length);
        CoderResult result = decoder.decode(in, out, true);
        if (result.isError()) {
            throw new TransactionExceptions.ImportEncodingInvalidException(lineAt(content, in.position()));
        }
        out.flip();
        // A BOM is the encoding's signature, not part of the first header cell.
        if (out.hasRemaining() && out.get(0) == BYTE_ORDER_MARK) {
            out.position(1);
        }
        return out.toString();
    }

    private static int lineAt(byte[] content, int position) {
        int line = 1;
        for (int i = 0; i < position; i++) {
            if (content[i] == '\n') {
                line++;
            }
        }
        return line;
    }
}
