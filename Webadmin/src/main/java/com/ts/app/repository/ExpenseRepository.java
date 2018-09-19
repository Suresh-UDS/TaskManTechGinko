package com.ts.app.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.CategoryWiseExpense;
import com.ts.app.domain.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>,JpaSpecificationExecutor<Expense>
{
    @Query("SELECT e FROM Expense e WHERE e.site.id = :siteId order by e.createdDate" )
    List<Expense> findLatestEntryBySite(@Param("siteId") long siteId);

    @Query("SELECT new com.ts.app.domain.CategoryWiseExpense(e.expenseCategory, sum(e.debitAmount)) FROM Expense e WHERE e.site.id = :siteId group by expenseCategory" )
    List<CategoryWiseExpense> getCategoryWiseExpenseBySite(@Param("siteId") long siteId);

    @Query("SELECT new com.ts.app.domain.CategoryWiseExpense(e.expenseCategory, sum(e.debitAmount)) FROM Expense e WHERE e.site.id = :siteId and e.expenseDate between :fromDate and :toDate group by expenseCategory" )
    List<CategoryWiseExpense> getCategoryWiseExpenseBySite(@Param("siteId") long siteId,@Param("fromDate") Timestamp fromDate, @Param("toDate") Timestamp toDate);

    @Query("SELECT e FROM Expense e WHERE e.site.id = :siteId and e.expenseCategory = :category" )
    List<Expense> getCategoryExpenseBySite(@Param("siteId") long siteId, @Param("category") String category);

    @Query("SELECT e FROM Expense e WHERE e.site.id = :siteId and e.expenseCategory = :category and e.expenseDate between :fromDate and :toDate" )
    List<Expense> getCategoryExpenseBySite(@Param("siteId") long siteId, @Param("category") String category, @Param("fromDate") Timestamp fromDate, @Param("toDate") Timestamp toDate);
}
