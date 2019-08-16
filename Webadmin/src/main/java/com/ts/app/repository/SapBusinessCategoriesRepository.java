package com.ts.app.repository;

import com.ts.app.domain.SapBusinessCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SapBusinessCategoriesRepository extends JpaRepository<SapBusinessCategories, Long> {

    @Query("SELECT s FROM SapBusinessCategories s order by s.createdDate")
    List<SapBusinessCategories> findLatest();
}
