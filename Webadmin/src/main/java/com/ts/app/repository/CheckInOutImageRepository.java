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


    @Query("select c from CheckInOut c where c.employee.id= :empId order by c.checkInDateTime desc" )
    List<CheckInOutImage> findByEmployeeIdOrderByCheckInDateTime(@Param("empId") long empId);

}
