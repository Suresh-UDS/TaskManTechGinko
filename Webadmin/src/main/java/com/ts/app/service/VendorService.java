package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Vendor;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.VendorRepository;
import com.ts.app.repository.VendorSpecification;
import com.ts.app.service.util.*;
import com.ts.app.web.rest.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class for managing Vendor information.
 */
@Service
@Transactional
public class VendorService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(VendorService.class);

	@Inject
	private VendorRepository vendorRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private ImportUtil importUtil;
	
	@Inject
	private ReportUtil reportUtil;
	
	@Inject
	private ExportUtil exportUtil;

	public VendorDTO createVendorInformation(VendorDTO vendorDto) {
		// log.info("The admin Flag value is " +adminFlag);
		Vendor vendor = mapperUtil.toEntity(vendorDto, Vendor.class);
        vendor.setActive(Vendor.ACTIVE_YES);
		vendor = vendorRepository.save(vendor);
		log.debug("Created Information for Vendor: {}", vendor);
		vendorDto = mapperUtil.toModel(vendor, VendorDTO.class);
		return vendorDto;
	}

	public void updateVendor(VendorDTO vendor) {
		log.debug("Inside Update");
		Vendor vendorUpdate = vendorRepository.findOne(vendor.getId());
		mapToEntity(vendor,vendorUpdate);
		vendorRepository.saveAndFlush(vendorUpdate);
	}

	private void mapToEntity(VendorDTO vendorDTO, Vendor vendor) {
		vendor.setName(vendorDTO.getName());
		vendor.setContactFirstName(vendorDTO.getContactFirstName());
		vendor.setContactLastName(vendorDTO.getContactLastName());
		vendor.setPhone(vendorDTO.getPhone());
		vendor.setEmail(vendorDTO.getEmail());
		vendor.setAddressLine1(vendorDTO.getAddressLine1());
		vendor.setAddressLine2(vendorDTO.getAddressLine2());
		vendor.setCountry(vendorDTO.getCountry());
		vendor.setState(vendorDTO.getState());
		vendor.setCity(vendorDTO.getCity());
		vendor.setPincode(vendorDTO.getPincode());
	}

	private VendorDTO mapToModel(Vendor vendor, boolean includeShifts) {
		VendorDTO vendorDTO = new VendorDTO();
		vendorDTO.setId(vendor.getId());
		vendorDTO.setName(vendor.getName());
		vendorDTO.setContactFirstName(vendor.getContactFirstName());
		vendorDTO.setContactLastName(vendor.getContactLastName());
		vendorDTO.setPhone(vendor.getPhone());
		vendorDTO.setEmail(vendor.getEmail());
		vendorDTO.setAddressLine1(vendor.getAddressLine1());
		vendorDTO.setAddressLine2(vendor.getAddressLine2());
		vendorDTO.setCountry(vendor.getCountry());
		vendorDTO.setState(vendor.getState());
		vendorDTO.setCity(vendor.getCity());
		vendorDTO.setPincode(vendor.getPincode());
		return vendorDTO;
	}


	public void deleteVendor(Long id) {
		log.debug("Inside Delete");
		Vendor vendorUpdate = vendorRepository.findOne(id);
        vendorUpdate.setActive(Vendor.ACTIVE_NO);
		vendorRepository.save(vendorUpdate);
	}

	public List<VendorDTO> findAll() {
		List<Vendor> entities = vendorRepository.findAll();
		return mapperUtil.toModelList(entities, VendorDTO.class);
	}

	public VendorDTO findOne(Long id) {
		Vendor entity = vendorRepository.findOne(id);
		return mapperUtil.toModel(entity, VendorDTO.class);
	}
	
	public ExportResult generateReport(List<VendorDTO> transactions, SearchCriteria criteria) {
		// TODO Auto-generated method stub
			return reportUtil.generateVendorReports(transactions, null, null, criteria);
	}

	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();

		fileId += ".xlsx";
		// log.debug("FILE ID INSIDE OF getExportStatus CALL ***********"+fileId);

		if (!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		// return exportUtil.readExportFile(fileName);
		return exportUtil.readExportFile(fileName);
	}

	public SearchResult<VendorDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

        //-------
		SearchResult<VendorDTO> result = new SearchResult<VendorDTO>();
		if(searchCriteria != null) {
            Pageable pageRequest = null;
            if(!StringUtils.isEmpty(searchCriteria.getColumnName())){
                Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
                log.debug("Sorting object" +sort);
                pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
                if (searchCriteria.isReport()) {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
				} else {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
				}
            }else{
            		if(searchCriteria.isList()) {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
            		}else {
            			pageRequest = createPageRequest(searchCriteria.getCurrPage());
            		}
            }
            Page<Vendor> page = null;
			List<Vendor> allVendorList = new ArrayList<Vendor>();
			List<VendorDTO> transactions = null;
			log.debug("Vendor  name = "+ searchCriteria.getVendorName() );
			/*if(!searchCriteria.isFindAll()) {
				if(StringUtils.isEmpty(searchCriteria.getVendorName())) {
					page = vendorRepository.findAllByName(searchCriteria.getVendorName(), pageRequest);
				}
			}else {
				page = vendorRepository.findAll(pageRequest);
			}*/
			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = vendorRepository.findAll(new VendorSpecification(searchCriteria,true),pageRequest);
    			allVendorList.addAll(page.getContent());
    		}
			/*if(page != null) {
				if(transactions == null) {
					transactions = new ArrayList<VendorDTO>();
				}
				List<Vendor> vendorList =  page.getContent();
				if(CollectionUtils.isNotEmpty(vendorList)) {
					for(Vendor vendor : vendorList) {
						transactions.add(mapToModel(vendor, false));
					}
				}
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}*/
			if(CollectionUtils.isNotEmpty(allVendorList)) {
				if(transactions == null) {
					transactions = new ArrayList<VendorDTO>();
				}
	        		for(Vendor vendor : allVendorList) {
	        			transactions.add(mapperUtil.toModel(vendor, VendorDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Vendor> page, List<VendorDTO> transactions, SearchResult<VendorDTO> result) {
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
