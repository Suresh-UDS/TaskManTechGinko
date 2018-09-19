package com.ts.app.repository;

import com.ts.app.domain.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long>,JpaSpecificationExecutor<Expense>
{
    @Query("SELECT e FROM Expense e WHERE e.site.id = :siteId order by e.createdDate" )
    List<Expense> findLatestEntryBySite(@Param("siteId") long siteId);
}
