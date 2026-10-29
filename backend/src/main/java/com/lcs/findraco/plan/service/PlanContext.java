package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.model.PlanRole;

/**
 * The active plan of a plan-scoped request, the acting user and their role in it, as values. The
 * resolver in {@code plan.controller} builds it from the {@code {planId}} path variable after checking
 * membership; services reload what they need inside their own transaction.
 */
public record PlanContext(long planId, long userId, PlanRole role) {}
