package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Project;
import com.ts.app.domain.RateCard;
import com.ts.app.domain.Site;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.RateCardRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.RateCardDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;

/**
 * Service class for exposing rate card related operations.
 */
@Service
@Transactional
public class RateCardService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(RateCardService.class);

	@Inject
	private RateCardRepository rateCardRepository;

	@Inject
	private ProjectRepository projectRepository;
	
	@Inject
	private UserRepository userRepository;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public RateCardDTO createRateCardInformation(RateCardDTO rateCardDto) {
		// log.info("The admin Flag value is " +adminFlag);
		RateCard rateCard = mapperUtil.toEntity(rateCardDto, RateCard.class);
		Project proj = projectRepository.findOne(rateCardDto.getProjectId());
		rateCard.setProject(proj);
		if(rateCardDto.getSiteId() > 0) {
			Site site = siteRepository.findOne(rateCardDto.getSiteId());
			rateCard.setSite(site);
		}else {
			rateCard.setSite(null);
		}
		rateCard.setActive(rateCard.ACTIVE_YES);

		rateCard = rateCardRepository.save(rateCard);
		log.debug("Created Information for RateCard: {}", rateCard);
		rateCardDto = mapperUtil.toModel(rateCard, RateCardDTO.class);
		return rateCardDto;
	}

	public void updateRateCard(RateCardDTO rateCard) {
		log.debug("Inside Update");
		RateCard rateCardUpdate = rateCardRepository.findOne(rateCard.getId());
		mapToEntity(rateCard, rateCardUpdate);
		rateCardRepository.saveAndFlush(rateCardUpdate);

	}

	private void mapToEntity(RateCardDTO rateCardDTO, RateCard rateCard) {
		rateCard.setName(rateCardDTO.getName());
		rateCard.setType(rateCardDTO.getType());
		rateCard.setUom(rateCardDTO.getUom());
		rateCard.setAmount(rateCardDTO.getAmount());
	}

	public void deleteRateCard(Long id) {
		log.debug("Inside Delete");

		RateCard rateCardUpdate = rateCardRepository.findOne(id);
		rateCardUpdate.setActive(RateCard.ACTIVE_NO);
		rateCardUpdate.setDeleted(true);
		rateCardRepository.save(rateCardUpdate);
	}

	public List<RateCardDTO> findAll() {
		List<RateCard> entities = new ArrayList<RateCard>();
		entities = rateCardRepository.findAll();
		return mapperUtil.toModelList(entities, RateCardDTO.class);
	}

	public RateCardDTO findOne(Long id) {
		RateCard entity = rateCardRepository.findOne(id);
		return mapperUtil.toModel(entity, RateCardDTO.class);
	}

    public SearchResult<RateCardDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
    	log.debug("search Criteria",searchCriteria);
        SearchResult<RateCardDTO> result = new SearchResult<RateCardDTO>();
        if(searchCriteria != null) {
            Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
            Page<RateCard> page = null;
            List<RateCardDTO> transactions = null;
            if(!searchCriteria.isFindAll()) {
                if(searchCriteria.getSiteId() != 0) {
                    page = rateCardRepository.findBySiteId(searchCriteria.getSiteId(),pageRequest);
                }
            }else {
        		page = rateCardRepository.findAllActive(pageRequest);
            }
            if(page != null) {
                transactions = mapperUtil.toModelList(page.getContent(), RateCardDTO.class);
                if(CollectionUtils.isNotEmpty(transactions)) {
                    buildSearchResult(searchCriteria, page, transactions,result);
                }
            }
        }
        return result;
    }

    private void buildSearchResult(SearchCriteria searchCriteria, Page<RateCard> page, List<RateCardDTO> transactions, SearchResult<RateCardDTO> result) {
        if(page != null) {
            result.setTotalPages(page.getTotalPages());
        }
        result.setCurrPage(page.getNumber() + 1);
        result.setTotalCount(page.getTotalElements());
        result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
        result.setEndInd((result.getTotalCount() > 10  ? (result.getCurrPage()) * 10 : result.getTotalCount()));

        result.setTransactions(transactions);
        return;
    }



}
