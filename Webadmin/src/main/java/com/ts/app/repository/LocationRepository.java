package com.ts.app.repository;

import com.ts.app.domain.EmployeeLocation;
import com.ts.app.domain.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by karth on 6/14/2017.
 */
public interface LocationRepository extends JpaRepository<Location, Long>  {

	public Location findByName(String name);

	@Query("SELECT loc FROM Location loc WHERE loc.project.id = :projectId")
	Page<Location> findByProject(@Param("projectId") long projectId, Pageable pageRequest);

	@Query("SELECT loc FROM Location loc WHERE loc.site.id = :siteId")
	Page<Location> findBySite(@Param("siteId") long siteId, Pageable pageRequest);

	@Query("SELECT loc FROM Location loc WHERE loc.site.id = :siteId")
	List<Location> findBySite(@Param("siteId") long siteId);

	@Query("SELECT loc FROM Location loc WHERE loc.site.id in (:siteIds)")
	Page<Location> findBySites(@Param("siteIds") List<Long> siteIds, Pageable pageRequest);

	@Query("SELECT loc FROM EmployeeLocation loc WHERE loc.siteId = :siteId and loc.employee.id = :employeeId")
	List<EmployeeLocation> findBySiteAndEmployee(@Param("siteId") long siteId, @Param("employeeId") long employeeId);

	@Query("SELECT loc FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId and loc.block = :block and loc.active='Y'")
	Page<Location> findByBlock(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("block") String block,Pageable pageRequest);

    @Query("SELECT loc FROM Location loc WHERE loc.site.id = :siteId and loc.block = :block and loc.floor = :floor and loc.zone = :zone")
    List<Location> findByAll(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone);

	@Query("SELECT loc FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId and loc.block = :block and loc.floor = :floor and loc.active='Y'")
	Page<Location> findByFloor(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, Pageable pageRequest);

	@Query("SELECT loc FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId and loc.block = :block and loc.floor = :floor and loc.zone = :zone and loc.active='Y'")
	Page<Location> findByZone(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor, @Param("zone") String zone, Pageable pageRequest);

	@Query("SELECT distinct loc.block FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId")
	List<String> findBlocks(@Param("projectId") long projectId, @Param("siteId") long siteId);

	@Query("SELECT distinct loc.block FROM Location loc WHERE loc.site.id = :siteId")
	List<String> findBlocks(@Param("siteId") long siteId);

	@Query("SELECT distinct loc.floor FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId and loc.block = :block")
	List<String> findFloors(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("block") String block);

	@Query("SELECT distinct loc.floor FROM Location loc WHERE loc.site.id = :siteId and loc.block = :block")
	List<String> findFloors(@Param("siteId") long siteId, @Param("block") String block);

	@Query("SELECT distinct loc.zone FROM Location loc WHERE loc.project.id = :projectId and loc.site.id = :siteId and loc.block = :block and loc.floor = :floor")
	List<String> findZones(@Param("projectId") long projectId, @Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor);

	@Query("SELECT distinct loc.zone FROM Location loc WHERE loc.site.id = :siteId and loc.block = :block and loc.floor = :floor")
	List<String> findZones(@Param("siteId") long siteId, @Param("block") String block, @Param("floor") String floor);
}
