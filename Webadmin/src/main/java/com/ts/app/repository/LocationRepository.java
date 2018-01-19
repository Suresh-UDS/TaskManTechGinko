package com.ts.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ts.app.domain.Location;

/**
 * Created by karth on 6/14/2017.
 */
public interface LocationRepository extends JpaRepository<Location, Long>  {

	public Location findByName(String name);
}
