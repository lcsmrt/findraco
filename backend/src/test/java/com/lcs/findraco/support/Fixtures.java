package com.lcs.findraco.support;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.repository.CategoryRepository;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@TestComponent
public class Fixtures {

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder(4);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanMembershipRepository planMembershipRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public User aUser() {
        return aUser("user-" + UUID.randomUUID() + "@test.com");
    }

    public User aUser(String email) {
        User user = new User();
        user.setName("Test User");
        user.setEmail(email);
        user.setPassword(ENCODER.encode("password"));
        return userRepository.save(user);
    }

    /** Mirrors PlanService.createPlanInternal: creates the plan and auto-adds the owner as an OWNER member. */
    public Plan aPlan(User owner) {
        Plan plan = new Plan();
        plan.setName("Test Plan " + UUID.randomUUID());
        plan.setCreatedBy(owner);
        plan.setDefault(false);
        Plan savedPlan = planRepository.save(plan);
        addMember(savedPlan, owner, PlanRole.OWNER);
        return savedPlan;
    }

    public PlanMembership addMember(Plan plan, User user, PlanRole role) {
        PlanMembership membership = new PlanMembership();
        membership.setPlan(plan);
        membership.setUser(user);
        membership.setRole(role);
        return planMembershipRepository.save(membership);
    }

    public Transaction aTransaction(Plan plan, User createdBy, BigDecimal amount, TransactionType type) {
        return aTransaction(plan, createdBy, amount, type, null);
    }

    /** A single-participant (createdBy at 100%) transaction dated today in the given category. */
    public Transaction aTransaction(
            Plan plan, User createdBy, BigDecimal amount, TransactionType type, Category category) {
        TransactionDetails details =
                new TransactionDetails(category, type, amount, "Test transaction", LocalDate.now(), null, null);
        return aTransaction(new TransactionDraft(
                plan, createdBy, details, SplitMode.EQUAL, List.of(new Share(createdBy, null)), List.of(), null, null));
    }

    public Transaction aTransaction(TransactionDraft draft) {
        return transactionRepository.save(Transaction.create(draft));
    }

    public Category aCategory(Plan plan, TransactionType type, String description) {
        return aCategory(plan, type, description, null);
    }

    public Category aCategory(Plan plan, TransactionType type, String description, Category parent) {
        return categoryRepository.save(Category.create(plan, type, description, parent));
    }
}
