package com.lcs.findraco.transaction.controller;

import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.shared.web.PageResponse;
import com.lcs.findraco.transaction.request.TransactionTrashFilter;
import com.lcs.findraco.transaction.response.TransactionRestoredResponse;
import com.lcs.findraco.transaction.response.TransactionTrashEntryResponse;
import com.lcs.findraco.transaction.service.TransactionTrashService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Transaction trash")
@RestController
@RequestMapping(TransactionRoutes.TRASH)
public class TransactionTrashController {

    private final TransactionTrashService trashService;

    public TransactionTrashController(TransactionTrashService trashService) {
        this.trashService = trashService;
    }

    @Operation(summary = "Lists the plan's deletions the caller may restore, newest first")
    @GetMapping
    public ResponseEntity<PageResponse<TransactionTrashEntryResponse>> getTrash(
            @ParameterObject @ModelAttribute @Valid TransactionTrashFilter filter, PlanContext ctx) {
        return ResponseEntity.ok(PageResponse.from(trashService.list(filter, ctx)));
    }

    @Operation(summary = "Restores everything one deletion moved to the trash")
    @PostMapping("/{deletionId}/restore")
    public ResponseEntity<TransactionRestoredResponse> restore(@PathVariable Long deletionId, PlanContext ctx) {
        return ResponseEntity.ok(trashService.restore(deletionId, ctx));
    }
}
