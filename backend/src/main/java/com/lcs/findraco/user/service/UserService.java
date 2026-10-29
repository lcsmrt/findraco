package com.lcs.findraco.user.service;

import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.user.exception.UserExceptions;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import com.lcs.findraco.user.request.CreateUserRequest;
import com.lcs.findraco.user.request.UpdateUserRequest;
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

    @Transactional
    public User update(User user, UpdateUserRequest dto) {
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
