package com.ts.app.repository;

import java.time.ZonedDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ts.app.domain.User;
import com.ts.app.domain.UserNew;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserNewRepository {//extends JpaRepository<UserNew, Long> {

 

    //@Override
    void delete(UserNew t);

}
