package com.ts.app.repository;


import com.ts.app.domain.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PricingRepository extends JpaRepository<Price, Long> {


    @Query("SELECT p from Price p where p.name = :name")
    List<Price> findPriceByTitle(@Param("name") String name);

    @Query("SELECT p from Price p where p.name = :name")
    String findPriceByTitleAndAmount(@Param("name") String name);

    List<Price> findBySiteId(long siteId);

}
