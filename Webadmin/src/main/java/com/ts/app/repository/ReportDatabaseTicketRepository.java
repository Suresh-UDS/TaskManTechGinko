package com.ts.app.repository;

import com.ts.app.domain.Ticket;
import com.ts.app.domain.TicketStatusReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ReportDatabaseTicketRepository extends JpaRepository<Ticket, Long> {

    @Query("select new com.ts.app.domain.TicketStatusReport(t.id, t.createdDate , t.site.id, t.category, t.status, " +
        "t.assignedOn, t.closedOn, s.project.id, s.region, s.branch, count(t.id) as statusCount) " +
        "from Ticket t join t.site s where s.id = t.site.id group by t.id, t.createdDate, t.category, t.status, " +
        "t.site.id, t.assignedOn, t.closedOn ")
    List<TicketStatusReport> findAllTicketStatus();

    @Query("select new com.ts.app.domain.TicketStatusReport(t.id, t.createdDate , t.site.id, t.category, t.status, " +
        "t.assignedOn, t.closedOn, s.project.id, s.region, s.branch, count(t.id) as statusCount) " +
        "from Ticket t join t.site s where s.id = t.site.id and t.lastModifiedDate > :lastModifiedDate group by t.id, t.createdDate, t.category, t.status, " +
        "t.site.id, t.assignedOn, t.closedOn ")
    List<TicketStatusReport> findAllTicketsByDate(@Param("lastModifiedDate") ZonedDateTime lastModifiedDate);
}
