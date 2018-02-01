package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.ChecklistItem;

/**
 * Spring Data JPA repository for the Checklist Item entity.
 */
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {



}
