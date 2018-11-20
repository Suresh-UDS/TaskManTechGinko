package com.ts.app.repository;


import com.ts.app.domain.RateCard;
import com.ts.app.domain.RateType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RateCardRepository extends JpaRepository<RateCard, Long> {


    @Query("SELECT rc from RateCard rc where rc.active = 'Y'")
    List<RateCard> findAllActive();

    @Query("SELECT rc from RateCard rc where rc.active = 'Y' and rc.type = :type")
    List<RateCard> findByRateType(@Param("type") RateType type);

    @Query("SELECT rc from RateCard rc where rc.active = 'Y' and rc.site.id = :siteId")
    List<RateCard> findBySiteId(@Param("siteId") long siteId);

    @Query("SELECT rc from RateCard rc where rc.active = 'Y'")
    Page<RateCard> findAllActive(Pageable pageRequest);

    @Query("SELECT rc from RateCard rc where rc.active = 'Y' and rc.type = :type")
    Page<RateCard> findByRateType(@Param("type") RateType type, Pageable pageRequest);

    @Query("SELECT rc from RateCard rc where rc.active = 'Y' and rc.site.id = :siteId")
    Page<RateCard> findBySiteId(@Param("siteId") long siteId, Pageable pageRequest);
}
