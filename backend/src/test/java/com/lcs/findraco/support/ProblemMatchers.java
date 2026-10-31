package com.lcs.findraco.support;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultMatcher;

/** Asserts an error answer: its status, the problem media type and the problem type slug. */
public final class ProblemMatchers {

    private ProblemMatchers() {}

    public static ResultMatcher problem(HttpStatus status, String slug) {
        return result -> {
            status().is(status.value()).match(result);
            content()
                    .contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
                    .match(result);
            jsonPath("$.type").value("urn:findraco:problem:" + slug).match(result);
        };
    }
}
