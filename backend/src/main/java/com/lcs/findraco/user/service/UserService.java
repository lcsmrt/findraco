package com.lcs.findraco.user.service;

import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.error.MalformedRequestException;
import com.lcs.findraco.shared.ratelimit.RateLimit;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.lcs.findraco.shared.security.PasswordNormalizer;
import com.lcs.findraco.user.exception.UserExceptions;
import com.lcs.findraco.user.model.TimeZoneMode;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.repository.UserRepository;
import com.lcs.findraco.user.request.CreateUserRequest;
import com.lcs.findraco.user.request.UpdateTimeZoneRequest;
import com.lcs.findraco.user.request.UpdateUserRequest;
import com.lcs.findraco.user.response.UserResponse;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PlanService planService;
    private final RateLimiter rateLimiter;
    private final PasswordEncoder encoder;

    public UserService(
            UserRepository userRepository, PlanService planService, RateLimiter rateLimiter, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.planService = planService;
        this.rateLimiter = rateLimiter;
        this.encoder = encoder;
    }

    @Transactional
    public UserResponse create(CreateUserRequest dto, String ip) {
        rateLimiter.consume(RateLimit.REGISTER_IP, ip);

        Optional<User> existingUser = userRepository.findByEmail(dto.email());
        if (existingUser.isPresent()) {
            throw new UserExceptions.EmailAlreadyExistsException();
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(encoder.encode(PasswordNormalizer.normalize(dto.password())));

        User savedUser = userRepository.save(user);
        planService.provisionDefaultPlan(savedUser);
        return UserResponse.from(savedUser);
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

    @Transactional(readOnly = true)
    public UserResponse getById(long userId) {
        return UserResponse.from(load(userId));
    }

    /** The authenticated caller, loaded in full: the token proves the account exists. */
    private User load(long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user " + userId + " no longer exists."));
    }

    @Transactional
    public UserResponse update(UpdateUserRequest dto, long userId) {
        User user = load(userId);
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(encoder.encode(PasswordNormalizer.normalize(dto.password())));

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(User user, String rawPassword) {
        user.setPassword(encoder.encode(PasswordNormalizer.normalize(rawPassword)));
        userRepository.save(user);
    }

    /** Stores a hash the encoder already produced (the re-hash of an older hash after a successful login). */
    @Transactional
    public User replacePasswordHash(long userId, String encodedPassword) {
        User user = load(userId);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    /**
     * The user's choice of zone: {@code PINNED} keeps the given IANA id whatever the device says;
     * {@code AUTOMATIC} hands the zone back to the device header, which refreshes it on the next request.
     */
    @Transactional
    public UserResponse updateTimeZone(UpdateTimeZoneRequest dto, long userId) {
        User user = load(userId);
        if (dto.mode() == TimeZoneMode.PINNED) {
            if (!TimeZones.isIanaId(dto.zone())) {
                throw new MalformedRequestException("zone", "The zone must be an IANA time zone id.");
            }
            user.pinTimeZone(dto.zone());
        } else {
            user.followDeviceTimeZone();
        }
        return UserResponse.from(userRepository.save(user));
    }

    /**
     * Records the zone a device reported. A value that is not an IANA id is ignored, and so is any value
     * while the zone is pinned or already stored.
     */
    @Transactional
    public void adoptDeviceTimeZone(long userId, String zone) {
        if (!TimeZones.isIanaId(zone)) {
            return;
        }
        User user = load(userId);
        if (user.getTimeZoneMode() == TimeZoneMode.AUTOMATIC && !zone.equals(user.getTimeZone())) {
            user.useDeviceTimeZone(zone);
            userRepository.save(user);
        }
    }
}
