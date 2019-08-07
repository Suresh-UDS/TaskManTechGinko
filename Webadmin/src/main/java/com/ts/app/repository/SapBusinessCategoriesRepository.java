package com.ts.app.repository;

import com.ts.app.domain.SapBusinessCategories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SapBusinessCategoriesRepository extends JpaRepository<SapBusinessCategories, Long> {

}
