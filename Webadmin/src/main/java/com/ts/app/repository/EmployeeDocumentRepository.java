package com.ts.app.repository;

import com.ts.app.domain.EmployeeDocuments;
import com.ts.app.domain.ExpenseDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeDocumentRepository extends JpaRepository<EmployeeDocuments, Long> {

    @Query("SELECT ed FROM EmployeeDocuments ed WHERE ed.employee.id=:employeeId and ed.docType =:docType and ed.active = 'Y'")
    EmployeeDocuments findByEmployeeIdAndDocumentType(@Param("employeeId") long employeeId, @Param("docType") String docType);

    @Query("SELECT ed FROM EmployeeDocuments ed WHERE ed.employee.id=:employeeId and ed.active = 'Y'")
    List<EmployeeDocuments> findByEmployeeId(@Param("employeeId") long employeeId);
}
