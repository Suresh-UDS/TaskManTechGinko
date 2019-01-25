package com.ts.app.repository;

import com.ts.app.domain.EmployeeHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeHistoryRepository extends JpaRepository<EmployeeHistory, Long> {

	@Override
	void delete(EmployeeHistory t);

	List<EmployeeHistory> findByEmployeeId(long id);

}
