package com.lcs.findraco.transaction.model;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

@Entity
@Table(name = "recurrence_definition_participants")
public class RecurrenceDefinitionParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recurrence_definition_id")
    private RecurrenceDefinition definition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_user_id")
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Column(name = "share_amount")
    private BigDecimal shareAmount;

    protected RecurrenceDefinitionParticipant() {}

    RecurrenceDefinitionParticipant(RecurrenceDefinition definition, Share share) {
        this.definition = definition;
        this.member = share.member();
        this.contact = share.contact();
        this.shareAmount = share.amount();
    }

    void changeShare(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public Long getId() {
        return id;
    }

    public RecurrenceDefinition getDefinition() {
        return definition;
    }

    /** The member the share goes to; null when it goes to a contact. */
    public @Nullable User getMember() {
        return member;
    }

    /** The contact the share goes to; null when it goes to a member. */
    public @Nullable Contact getContact() {
        return contact;
    }

    public Share toShare() {
        return new Share(member, contact, shareAmount);
    }

    public String key() {
        return toShare().key();
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }
}
