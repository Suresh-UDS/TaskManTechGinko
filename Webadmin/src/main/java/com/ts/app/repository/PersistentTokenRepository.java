package com.ts.app.repository;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.PersistentToken;
import com.ts.app.domain.User;

import java.util.List;

/**
 * Spring Data JPA repository for the PersistentToken entity.
 */
public interface PersistentTokenRepository extends JpaRepository<PersistentToken, String> {

    List<PersistentToken> findByUser(User user);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);

}
