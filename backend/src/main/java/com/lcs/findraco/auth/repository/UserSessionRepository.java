package com.lcs.findraco.auth.repository;

import com.lcs.findraco.auth.model.UserSession;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    // Locked PESSIMISTIC_WRITE so two concurrent renewals of the same token serialize on the row:
    // the second one sees the replacedAt the first one wrote (grace rule) instead of racing it.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM UserSession s WHERE s.tokenHash = :tokenHash")
    Optional<UserSession> findByTokenHashForUpdate(@Param("tokenHash") String tokenHash);

    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.familyId = :familyId")
    void deleteAllByFamilyId(@Param("familyId") UUID familyId);

    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.user = :user")
    void deleteAllByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.user = :user AND s.expiresAt <= :now")
    void deleteExpiredByUser(@Param("user") User user, @Param("now") LocalDateTime now);
}
