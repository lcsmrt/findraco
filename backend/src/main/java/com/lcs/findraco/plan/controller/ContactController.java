package com.lcs.findraco.plan.controller;

import com.lcs.findraco.plan.request.ContactFilter;
import com.lcs.findraco.plan.request.CreateContactRequest;
import com.lcs.findraco.plan.request.UpdateContactRequest;
import com.lcs.findraco.plan.response.ContactResponse;
import com.lcs.findraco.plan.response.ContactStatementResponse;
import com.lcs.findraco.plan.service.ContactService;
import com.lcs.findraco.plan.service.ContactStatementService;
import com.lcs.findraco.plan.service.PlanContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Contacts")
@RestController
@RequestMapping(ContactRoutes.CONTACT)
public class ContactController {

    private final ContactService contactService;
    private final ContactStatementService statementService;

    public ContactController(ContactService contactService, ContactStatementService statementService) {
        this.contactService = contactService;
        this.statementService = statementService;
    }

    @Operation(summary = "Lists the plan's contacts by name, each with what it owes or its credit")
    @GetMapping
    public ResponseEntity<List<ContactResponse>> getContacts(
            @ParameterObject @ModelAttribute @Valid ContactFilter filter, PlanContext ctx) {
        return ResponseEntity.ok(contactService.findAll(filter, ctx));
    }

    @Operation(summary = "A contact's statement: its shares and payments by month, each share with its status")
    @GetMapping("/{id}/statement")
    public ResponseEntity<ContactStatementResponse> getStatement(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(statementService.statement(id, ctx));
    }

    @Operation(summary = "Creates a contact of the plan")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @RequestBody @Valid CreateContactRequest dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.create(dto, ctx));
    }

    @Operation(summary = "Renames a contact")
    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id, @RequestBody @Valid UpdateContactRequest dto, PlanContext ctx) {
        return ResponseEntity.ok(contactService.update(id, dto, ctx));
    }

    @Operation(summary = "Archives a contact whose balance is zero")
    @PostMapping("/{id}/archive")
    public ResponseEntity<ContactResponse> archiveContact(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(contactService.archive(id, ctx));
    }

    @Operation(summary = "Returns an archived contact to the active ones")
    @PostMapping("/{id}/unarchive")
    public ResponseEntity<ContactResponse> unarchiveContact(@PathVariable Long id, PlanContext ctx) {
        return ResponseEntity.ok(contactService.unarchive(id, ctx));
    }

    @Operation(summary = "Deletes a contact that nothing refers to")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id, PlanContext ctx) {
        contactService.delete(id, ctx);
        return ResponseEntity.noContent().build();
    }
}
