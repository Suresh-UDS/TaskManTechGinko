package com.ts.app.service;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Device;
import com.ts.app.repository.DeviceRepository;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.DeviceDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

/**
 * Service class for managing Device information.
 */
@Service
@Transactional
public class DeviceService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(DeviceService.class);

	@Inject
	private DeviceRepository deviceRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	public DeviceDTO createDeviceInformation(DeviceDTO deviceDto) {
		Device device = deviceRepository.findByUniqueId(deviceDto.getUniqueId());
		if(device == null) {
			log.debug("DEvice Details"+device);
			device = mapperUtil.toEntity(deviceDto, Device.class);
			device.setActive(Device.ACTIVE_YES);
			device = deviceRepository.save(device);
			log.debug("Created Information for Device: {}", device);
		}
		deviceDto = mapperUtil.toModel(device, DeviceDTO.class);
		return deviceDto;
	}

	public void updateDevice(DeviceDTO device) {
		log.debug("Updating device: " + device);
		Device deviceUpdate = deviceRepository.findByUniqueId(device.getUniqueId());
//		deviceUpdate.setActive(device.getActive());
		deviceUpdate.setImei(device.getImei());
		deviceUpdate.setUniqueId(device.getUniqueId());
		deviceRepository.saveAndFlush(deviceUpdate);
	}

	public void deleteDevice(Long id) {
		log.debug("Inside Delete");
		Device deviceUpdate = deviceRepository.findOne(id);
		deviceUpdate.setActive(Device.ACTIVE_NO);
		deviceRepository.save(deviceUpdate);
	}

	public List<DeviceDTO> findAll() {
		List<Device> entities = deviceRepository.findAll();
		return mapperUtil.toModelList(entities, DeviceDTO.class);
	}

	public DeviceDTO findDevice(Long id) {
		Device entity = deviceRepository.findActiveDevice(id);
		return mapperUtil.toModel(entity, DeviceDTO.class);
	}

	public DeviceDTO findDevice(String uniqueId) {
		Device entity = deviceRepository.findByUniqueId(uniqueId);
		return mapperUtil.toModel(entity, DeviceDTO.class);
	}


	public SearchResult<DeviceDTO> findBySearchCrieria(SearchCriteria searchCriteria) {
		SearchResult<DeviceDTO> result = new SearchResult<DeviceDTO>();
		if(searchCriteria != null) {
			Pageable pageRequest = createPageRequest(searchCriteria.getCurrPage());
			Page<Device> page = null;
			List<DeviceDTO> transactions = null;
			if(!searchCriteria.isFindAll()) {
				if(searchCriteria.getDeviceId() != 0 && searchCriteria.getProjectId() != 0) {
					page = deviceRepository.findDevicesById(searchCriteria.getDeviceId(), pageRequest);
				}else {
					page = deviceRepository.findDevicesById(searchCriteria.getDeviceId(), pageRequest);
				}
			}else {
				page = deviceRepository.findDevices(pageRequest);
			}
			if(page != null) {
				transactions = mapperUtil.toModelList(page.getContent(), DeviceDTO.class);
				if(CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions,result);
				}
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Device> page, List<DeviceDTO> transactions, SearchResult<DeviceDTO> result) {
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
