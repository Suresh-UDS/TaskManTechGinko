package com.ts.app.repository;

import com.ts.app.domain.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory,Long> {


}
