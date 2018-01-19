package com.ts.app.repository;

import com.ts.app.domain.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeviceRepository extends JpaRepository<Device, Long> {

	public Device findByUniqueId(String uniqueId);


	@Query("SELECT d FROM Device d WHERE d.active='Y' order by last_modified_date desc")
	Page<Device> findDevices(Pageable pageRequest);

	@Query("SELECT d FROM Device d WHERE d.id = :id order by last_modified_date desc")
	Page<Device> findDevicesById(@Param("id") long id, Pageable pageRequest);

    @Query("SELECT d FROM Device d WHERE d.id = :id AND d.active='Y'")
    Device findActiveDevice(@Param("id") long id);

    @Query("SELECT d from Device d WHERE d.imei = :imei AND d.active = 'Y'")
    Page<Device> findDevicesByIMEI(@Param("imei") String imei, Pageable pageRequest);
}
