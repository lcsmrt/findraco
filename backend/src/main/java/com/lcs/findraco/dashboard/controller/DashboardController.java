package com.lcs.findraco.dashboard.controller;

import com.lcs.findraco.dashboard.request.DashboardFilterDto;
import com.lcs.findraco.dashboard.response.DashboardSummaryResponseDto;
import com.lcs.findraco.dashboard.response.MonthlyTrendDto;
import com.lcs.findraco.dashboard.service.DashboardService;
import com.lcs.findraco.plan.service.PlanContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Dashboard")
@RestController
@RequestMapping(DashboardRoutes.DASHBOARD)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Operation(summary = "Returns the financial summary for the plan")
    @GetMapping
    public ResponseEntity<DashboardSummaryResponseDto> getSummary(
            @ParameterObject @ModelAttribute @Valid DashboardFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(dashboardService.getSummary(filter, ctx));
    }

    @Operation(summary = "Returns income and expenses per month for the plan")
    @GetMapping("/trend")
    public ResponseEntity<List<MonthlyTrendDto>> getTrend(
            @ParameterObject @ModelAttribute @Valid DashboardFilterDto filter, PlanContext ctx) {
        return ResponseEntity.ok(dashboardService.getTrend(filter, ctx));
    }
}
