package com.lcs.findraco.user.service;

import java.time.ZoneId;
import java.util.Set;

/** What counts as a time zone for a user: an IANA id, never a bare offset or a free-form string. */
final class TimeZones {

    private static final Set<String> IANA_IDS = ZoneId.getAvailableZoneIds();

    private TimeZones() {}

    static boolean isIanaId(String value) {
        return value != null && IANA_IDS.contains(value);
    }
}
