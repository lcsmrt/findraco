package com.lcs.findraco.transaction.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recurrence_definition_participants")
public class RecurrenceDefinitionParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recurrence_definition_id")
    private RecurrenceDefinition definition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_user_id")
    private User member;

    @Column(name = "share_amount")
    private BigDecimal shareAmount;

    protected RecurrenceDefinitionParticipant() {}

    RecurrenceDefinitionParticipant(RecurrenceDefinition definition, User member, BigDecimal shareAmount) {
        this.definition = definition;
        this.member = member;
        this.shareAmount = shareAmount;
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

    public User getMember() {
        return member;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }
}
