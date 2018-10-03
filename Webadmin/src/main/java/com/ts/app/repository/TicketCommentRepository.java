package com.ts.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ts.app.domain.TicketComment;

public interface TicketCommentRepository extends JpaRepository<TicketComment,Long>, JpaSpecificationExecutor<TicketComment> {

    @Query("SELECT t FROM TicketComment t where t.ticket.id = :ticketId")
    Page<TicketComment> findAll(@Param("ticketId") long ticketId,Pageable pageRequest);

    @Query("SELECT t FROM TicketComment t where t.ticket.id = :ticketId order by t.createdDate desc")
    List<TicketComment> findAll(@Param("ticketId") long ticketId);
    
}
