package com.lcs.findraco.shared;

import static org.assertj.core.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.support.AbstractIntegrationTest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.json.JsonMapper;

/**
 * The generated API docs are the contract, committed as {@code backend/openapi.json}. A change to them
 * fails here with the diff until the snapshot is regenerated on purpose:
 * {@code ./mvnw verify -Dit.test=OpenApiSnapshotIT -Dopenapi.update=true}.
 */
class OpenApiSnapshotIT extends AbstractIntegrationTest {

    private static final Path SNAPSHOT = Path.of("openapi.json");
    private static final String UPDATE = "openapi.update";
    private static final int CONTEXT = 3;

    private static final ObjectMapper PRETTY =
            JsonMapper.builder().enable(SerializationFeature.INDENT_OUTPUT).build();

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void theGeneratedDocsMatchTheCommittedSnapshot() throws Exception {
        String generated = normalise(objectMapper.readTree(mockMvc.perform(get("/v3/api-docs"))
                .andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8)));

        if (Boolean.getBoolean(UPDATE)) {
            Files.writeString(SNAPSHOT, generated, StandardCharsets.UTF_8);
            return;
        }
        String committed = Files.exists(SNAPSHOT) ? Files.readString(SNAPSHOT, StandardCharsets.UTF_8) : "";
        if (!committed.equals(generated)) {
            fail("The API contract changed. If intended, regenerate backend/openapi.json with "
                    + "-Dopenapi.update=true and commit it.\n" + diff(committed, generated));
        }
    }

    /**
     * Sorted keys, no server URL (it depends on the host that asks) and no app version (it changes with
     * every release, not with the contract).
     */
    private static String normalise(JsonNode docs) throws IOException {
        Object tree = sorted(docs);
        if (tree instanceof Map<?, ?> root) {
            root.remove("servers");
            if (root.get("info") instanceof Map<?, ?> info) {
                info.remove("version");
            }
        }
        return PRETTY.writeValueAsString(tree) + "\n";
    }

    private static Object sorted(JsonNode node) {
        if (node.isObject()) {
            Map<String, Object> map = new TreeMap<>();
            node.properties().forEach(entry -> map.put(entry.getKey(), sorted(entry.getValue())));
            return map;
        }
        if (node.isArray()) {
            List<Object> list = new ArrayList<>();
            node.forEach(element -> list.add(sorted(element)));
            return list;
        }
        return node;
    }

    /** The changed lines with a few lines of context around them, marked - (committed) and + (generated). */
    private static String diff(String committed, String generated) {
        List<String> before = committed.lines().toList();
        List<String> after = generated.lines().toList();
        int prefix = 0;
        while (prefix < before.size()
                && prefix < after.size()
                && before.get(prefix).equals(after.get(prefix))) {
            prefix++;
        }
        int suffix = 0;
        while (suffix < before.size() - prefix
                && suffix < after.size() - prefix
                && before.get(before.size() - 1 - suffix).equals(after.get(after.size() - 1 - suffix))) {
            suffix++;
        }
        StringBuilder out = new StringBuilder("--- backend/openapi.json\n+++ /v3/api-docs\n");
        out.append("@@ line ").append(prefix + 1).append(" @@\n");
        for (int i = Math.max(0, prefix - CONTEXT); i < prefix; i++) {
            out.append("  ").append(before.get(i)).append('\n');
        }
        for (int i = prefix; i < before.size() - suffix; i++) {
            out.append("- ").append(before.get(i)).append('\n');
        }
        for (int i = prefix; i < after.size() - suffix; i++) {
            out.append("+ ").append(after.get(i)).append('\n');
        }
        for (int i = after.size() - suffix; i < Math.min(after.size(), after.size() - suffix + CONTEXT); i++) {
            out.append("  ").append(after.get(i)).append('\n');
        }
        return out.toString();
    }
}
