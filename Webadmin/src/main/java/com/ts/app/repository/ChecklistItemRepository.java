package com.ts.app.repository;

import com.ts.app.domain.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Checklist Item entity.
 */
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

	@Query("SELECT ch FROM ChecklistItem ch WHERE ch.checklist.id = :checklistId order by id asc")
	List<ChecklistItem> findByChecklistId(@Param("checklistId") long checklistId);
}
