package com.lcs.findraco.user.model;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class UserTodayTest {

    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-11-05T01:00:00Z"), ZoneOffset.UTC);

    @Test
    void todayFollowsTheUsersZone() {
        User saoPaulo = new User();
        saoPaulo.pinTimeZone("America/Sao_Paulo");
        User lisbon = new User();
        lisbon.pinTimeZone("Europe/Lisbon");

        assertThat(saoPaulo.today(CLOCK)).isEqualTo(LocalDate.of(2026, 11, 4));
        assertThat(lisbon.today(CLOCK)).isEqualTo(LocalDate.of(2026, 11, 5));
    }
}
