package com.ts.app.repository;

import java.util.List;

import com.ts.app.domain.ExpenseDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ExpenseDocumentRepository extends JpaRepository<ExpenseDocument, Long>{

    @Query("SELECT et FROM ExpenseDocument et WHERE et.active='Y' order by et.file")
    List<ExpenseDocument> findAll();

    @Query("SELECT ed FROM ExpenseDocument ed WHERE ed.expense.id=:expenseId")
    List<ExpenseDocument> findByExpenseId(@Param("expenseId") long expenseId);

    @Query("SELECT ed FROM ExpenseDocument ed WHERE ed.expense.id = :expenseId and ed.type = :type and ed.active='Y' order by ed.title")
    List<ExpenseDocument> findAllByType(@Param("type") String type, @Param("expenseId") Long expenseId);


}
