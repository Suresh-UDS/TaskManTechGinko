package com.ts.app.repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.User;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(ZonedDateTime dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByLogin(String login);

    @Override
    void delete(User t);

	@Query("SELECT u FROM User u WHERE u.id = :userId")
	Page<User> findUsersById(@Param("userId") long userId, Pageable pageRequest);

	@Query("SELECT u FROM User u WHERE u.id <> :userId and u.login <> 'admin' order by last_modified_date desc")
	Page<User> findUsers(@Param("userId") long loggedInUserId, Pageable pageRequest);

	@Query("SELECT u FROM User u WHERE u.emailSubscribed = 1")
	List<User> findByEmailSubscribed();

	List<User> findUsersById(Long id);

    @Query("SELECT u FROM User u WHERE u.emailSubscribed=1 and u.id=:id")
	User findByEmailSubscribedById(@Param("id") Long id);
    
	@Query("SELECT u FROM User u WHERE u.login like '%' || :userLogin || '%' order by u.id")
	Page<User> findByLogin(@Param("userLogin") String userLogin, Pageable pageRequest);

	@Query("SELECT u FROM User u WHERE u.login like '%' || :userLogin || '%' or u.firstName like '%' || :userFirstName || '%' or u.lastName like '%' || :userLastName || '%' or u.email like '%' || :userEmail || '%' or u.userRole.id = :userRoleId order by u.id")
	Page<User> findByLoginOrFirsNameOrLastNameOrRole(@Param("userLogin") String userLogin,@Param("userFirstName") String userFirstName,@Param("userLastName") String userLastName,@Param("userEmail") String email,@Param("userRoleId") long userRoleId, Pageable pageRequest);

}
