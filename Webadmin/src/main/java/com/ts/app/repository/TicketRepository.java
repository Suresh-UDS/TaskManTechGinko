package com.ts.app.repository;

import com.ts.app.domain.Employee;
import com.ts.app.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long>, JpaSpecificationExecutor<Ticket> {

    @Query("SELECT t FROM Ticket t where t.createdBy.id = :userId ")
    List<Ticket> findByUserId(@Param("userId") Long userId);
}
