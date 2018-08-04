package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.ChecklistItem;

/**
 * Spring Data JPA repository for the Checklist Item entity.
 */
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {

	@Query("SELECT ch FROM ChecklistItem ch WHERE ch.checklist.id = :checklistId")
	List<ChecklistItem> findByChecklistId(@Param("checklistId") long checklistId);



}
