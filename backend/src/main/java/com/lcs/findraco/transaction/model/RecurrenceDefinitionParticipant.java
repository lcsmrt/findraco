package com.lcs.findraco.transaction.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
        name = "recurrence_definition_participants",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uk_recdef_participants_def_member",
                        columnNames = {"recurrence_definition_id", "member_user_id"}))
public class RecurrenceDefinitionParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "recurrence_definition_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_recdef_participants_definition"))
    private RecurrenceDefinition definition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "member_user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_recdef_participants_member"))
    private User member;

    @Column(name = "share_amount", nullable = false)
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
