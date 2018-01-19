package com.ts.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.EmployeeHistory;

public interface EmployeeHistoryRepository extends JpaRepository<EmployeeHistory, Long> {

	@Override
	void delete(EmployeeHistory t);

	List<EmployeeHistory> findByEmployeeId(long id);

}
