package com.lcs.findraco.user.service;

import com.lcs.findraco.services.PlanService;
import com.lcs.findraco.user.exception.UserExceptions;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import com.lcs.findraco.user.request.UserRequestDto;
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
    public User create(UserRequestDto dto) {
        Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());
        if (existingUser.isPresent()) {
            throw new UserExceptions.EmailAlreadyExistsException(dto.getEmail());
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        String encryptedPassword = encoder.encode(dto.getPassword());
        user.setPassword(encryptedPassword);

        User savedUser = userRepository.save(user);
        planService.provisionDefaultPlan(savedUser);
        return savedUser;
    }

    @Transactional
    public User update(User user, UserRequestDto dto) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        String encryptedPassword = encoder.encode(dto.getPassword());
        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(User user, String rawPassword) {
        user.setPassword(encoder.encode(rawPassword));
        userRepository.save(user);
    }
}
