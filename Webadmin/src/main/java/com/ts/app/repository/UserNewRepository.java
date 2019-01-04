package com.ts.app.repository;

import com.ts.app.domain.UserNew;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserNewRepository {//extends JpaRepository<UserNew, Long> {

 

    //@Override
    void delete(UserNew t);

}
