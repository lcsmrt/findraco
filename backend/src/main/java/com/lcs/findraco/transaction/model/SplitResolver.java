package com.lcs.findraco.transaction.model;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Resolves a transaction's total amount into per-member shares for a given split mode.
 * Pure logic, no dependencies. The sum of the resolved shares always equals the amount exactly.
 */
public class SplitResolver {

    /**
     * The split of {@code amount} among the members and contacts of {@code shares}, each with its exact share. A
     * split needs at least one participant, each at most once.
     */
    public List<Share> split(BigDecimal amount, SplitMode mode, List<Share> shares) {
        if (shares.isEmpty()) {
            throw new TransactionExceptions.ParticipantsRequiredException();
        }
        Set<String> parties = new HashSet<>();
        List<ParticipantInput> inputs = new ArrayList<>();
        for (Share share : shares) {
            if (!parties.add(share.key())) {
                throw new TransactionExceptions.DuplicateParticipantException();
            }
            inputs.add(new ParticipantInput((long) inputs.size(), share.amount()));
        }
        List<ResolvedShare> resolved = resolve(amount, mode, inputs);
        List<Share> split = new ArrayList<>();
        for (int i = 0; i < shares.size(); i++) {
            split.add(shares.get(i).withAmount(resolved.get(i).shareAmount()));
        }
        return split;
    }

    /** {@code memberId} is whatever identifies the party in the caller's list; the result keeps the input's order. */
    public record ParticipantInput(Long memberId, BigDecimal shareAmount) {}

    public record ResolvedShare(Long memberId, BigDecimal shareAmount) {}

    public List<ResolvedShare> resolve(BigDecimal amount, SplitMode mode, List<ParticipantInput> inputs) {
        return switch (mode) {
            case EQUAL -> resolveEqual(amount, inputs);
            case EXACT -> resolveExact(amount, inputs);
        };
    }

    private List<ResolvedShare> resolveEqual(BigDecimal amount, List<ParticipantInput> inputs) {
        BigDecimal scaledAmount = amount.setScale(2, RoundingMode.HALF_UP);
        long totalCents = scaledAmount.unscaledValue().longValue();
        int n = inputs.size();
        long baseCents = totalCents / n;
        long remainderCents = totalCents % n;

        List<ResolvedShare> shares = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            long cents = baseCents + (i < remainderCents ? 1 : 0);
            shares.add(new ResolvedShare(inputs.get(i).memberId(), BigDecimal.valueOf(cents, 2)));
        }
        return shares;
    }

    private List<ResolvedShare> resolveExact(BigDecimal amount, List<ParticipantInput> inputs) {
        for (ParticipantInput input : inputs) {
            if (input.shareAmount() == null || input.shareAmount().signum() < 0) {
                throw new TransactionExceptions.ExactShareInvalidException();
            }
        }
        BigDecimal scaledAmount = amount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal sum = inputs.stream()
                .map(ParticipantInput::shareAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        if (sum.compareTo(scaledAmount) != 0) {
            throw new TransactionExceptions.ParticipantSharesMismatchException();
        }

        List<ResolvedShare> shares = new ArrayList<>();
        for (ParticipantInput input : inputs) {
            shares.add(new ResolvedShare(input.memberId(), input.shareAmount().setScale(2, RoundingMode.HALF_UP)));
        }
        return shares;
    }
}
