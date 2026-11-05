package com.lcs.findraco.user.model;

import jakarta.persistence.*;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;

@Entity
@Table(name = "users")
public class User {
    public static final String DEFAULT_TIME_ZONE = "America/Sao_Paulo";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String timeZone = DEFAULT_TIME_ZONE;

    @Enumerated(EnumType.STRING)
    private TimeZoneMode timeZoneMode = TimeZoneMode.AUTOMATIC;

    private String language;

    public User() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public TimeZoneMode getTimeZoneMode() {
        return timeZoneMode;
    }

    /** The calendar day it is for this user: the instant of {@code clock} read in their saved time zone. */
    public LocalDate today(Clock clock) {
        return LocalDate.now(clock.withZone(ZoneId.of(timeZone)));
    }

    public String getLanguage() {
        return language;
    }

    public void chooseLanguage(Language language) {
        this.language = language.tag();
    }

    public void useDeviceTimeZone(String zone) {
        this.timeZone = zone;
    }

    public void followDeviceTimeZone() {
        this.timeZoneMode = TimeZoneMode.AUTOMATIC;
    }

    public void pinTimeZone(String zone) {
        this.timeZone = zone;
        this.timeZoneMode = TimeZoneMode.PINNED;
    }
}
