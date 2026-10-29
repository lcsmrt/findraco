package com.lcs.findraco.user.service;

import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.user.exception.UserExceptions;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import com.lcs.findraco.user.request.CreateUserRequest;
import com.lcs.findraco.user.request.UpdateUserRequest;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PlanService planService;

    public UserService(UserRepository userRepository, PlanService planService) {
        this.userRepository = userRepository;
        this.planService = planService;
    }

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Transactional
    public User create(CreateUserRequest dto) {
        Optional<User> existingUser = userRepository.findByEmail(dto.email());
        if (existingUser.isPresent()) {
            throw new UserExceptions.EmailAlreadyExistsException(dto.email());
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        String encryptedPassword = encoder.encode(dto.password());
        user.setPassword(encryptedPassword);

        User savedUser = userRepository.save(user);
        planService.provisionDefaultPlan(savedUser);
        return savedUser;
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(long userId) {
        return userRepository.findById(userId);
    }

    @Transactional(readOnly = true)
    public List<User> findAllById(Collection<Long> userIds) {
        return userRepository.findAllById(userIds);
    }

    /** The authenticated caller, loaded in full: the token proves the account exists. */
    @Transactional(readOnly = true)
    public User getById(long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user " + userId + " no longer exists."));
    }

    @Transactional
    public User update(UpdateUserRequest dto, long userId) {
        User user = getById(userId);
        user.setName(dto.name());
        user.setEmail(dto.email());
        String encryptedPassword = encoder.encode(dto.password());
        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(User user, String rawPassword) {
        user.setPassword(encoder.encode(rawPassword));
        userRepository.save(user);
    }
}
