package com.ts.app.repository;

/**
 * Created by karth on 6/2/2017.
 */

import com.ts.app.domain.CheckInOutImage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckInOutImageRepository extends PagingAndSortingRepository<CheckInOutImage, Long> {


    @Query("select c from CheckInOutImage c where c.employee.id= :empId order by c.checkInOut.checkInDateTime desc" )
    List<CheckInOutImage> findByEmployeeIdOrderByCheckInDateTime(@Param("empId") long empId);
    
    @Query("select c from CheckInOutImage c where c.job.id = :jobId")
    List<CheckInOutImage> findAll(@Param("jobId") long jobId);

}
