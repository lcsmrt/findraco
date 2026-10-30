package com.lcs.findraco.transaction.service;

import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.config.SeriesProperties;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

/**
 * Makes sure a plan's open-ended series reach the end of a period a read asks for. A period inside the
 * plan's {@code seriesGeneratedUntil} mark costs one comparison and writes nothing; a period past it
 * extends the series in a short transaction of its own. Call it before the read's transaction starts,
 * never inside it, so a read never writes and never holds a second connection.
 */
@Component
public class SeriesHorizon {

    /** A period further ahead than this is generated only this far, so one request cannot ask for unbounded rows. */
    private static final int MAX_YEARS_AHEAD = 9;

    private final PlanService planService;
    private final OpenEndedSeriesTopUpService topUpService;
    private final SeriesProperties properties;
    private final Clock clock;

    public SeriesHorizon(
            PlanService planService,
            OpenEndedSeriesTopUpService topUpService,
            SeriesProperties properties,
            Clock clock) {
        this.planService = planService;
        this.topUpService = topUpService;
        this.properties = properties;
        this.clock = clock;
    }

    public void ensureCovered(long planId, LocalDate end) {
        LocalDate today = LocalDate.now(clock);
        LocalDate wanted = end.isAfter(today.plusYears(MAX_YEARS_AHEAD)) ? today.plusYears(MAX_YEARS_AHEAD) : end;
        LocalDate through = wanted.isAfter(properties.horizonFrom(today)) ? wanted : properties.horizonFrom(today);

        LocalDate coveredUntil = planService.seriesGeneratedUntil(planId);
        if (coveredUntil != null && !wanted.isAfter(coveredUntil)) {
            return;
        }
        topUpService.extendTo(planId, through);
    }
}
