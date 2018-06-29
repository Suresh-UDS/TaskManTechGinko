package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.AssetAMCSchedule;
import com.ts.app.domain.AssetDocument;
import com.ts.app.domain.AssetGroup;
import com.ts.app.domain.AssetPPMSchedule;
import com.ts.app.domain.AssetParameterConfig;
import com.ts.app.domain.AssetParameterReading;
import com.ts.app.domain.AssetParameterReadingRule;
import com.ts.app.domain.AssetReadingRule;
import com.ts.app.domain.AssetType;
import com.ts.app.domain.Checklist;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Frequency;
import com.ts.app.domain.FrequencyPrefix;
import com.ts.app.domain.Job;
import com.ts.app.domain.MaintenanceType;
import com.ts.app.domain.Manufacturer;
import com.ts.app.domain.ParameterConfig;
import com.ts.app.domain.Project;
import com.ts.app.domain.Setting;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.Vendor;
import com.ts.app.domain.WarrantyType;
import com.ts.app.domain.util.StringUtil;
import com.ts.app.repository.AssetAMCRepository;
import com.ts.app.repository.AssetDocumentRepository;
import com.ts.app.repository.AssetGroupRepository;
import com.ts.app.repository.AssetParamReadingRepository;
import com.ts.app.repository.AssetParamRuleRepository;
import com.ts.app.repository.AssetParameterConfigRepository;
import com.ts.app.repository.AssetPpmScheduleRepository;
import com.ts.app.repository.AssetReadingRuleRepository;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AssetSpecification;
import com.ts.app.repository.AssetTypeRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.ChecklistRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.ParameterConfigRepository;
import com.ts.app.repository.PricingRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SettingsRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.VendorRepository;
import com.ts.app.repository.WarrantyTypeRepository;
import com.ts.app.service.util.CommonUtil;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AssetAMCScheduleDTO;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetDocumentDTO;
import com.ts.app.web.rest.dto.AssetPPMScheduleEventDTO;
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;
import com.ts.app.web.rest.dto.AssetParameterReadingDTO;
import com.ts.app.web.rest.dto.AssetPpmScheduleDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.SearchCriteria;
import com.ts.app.web.rest.dto.SearchResult;
import com.ts.app.web.rest.errors.TimesheetException;

/**
 * Service class for managing Asset information.
 */
@Service
@Transactional
public class AssetManagementService extends AbstractService {

	private final Logger log = LoggerFactory.getLogger(AssetManagementService.class);

	@Inject
	private JobRepository jobRepository;

	@Inject
	private CheckInOutRepository checkInOutRepository;

	@Inject
	private AssetRepository assetRepository;

	@Inject
	private AssetAMCRepository assetAMCRepository;

	@Inject
	private TicketRepository ticketRepository;

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private LocationRepository locationRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;

	@Inject
	private SiteRepository siteRepository;

	@Inject
	private UserRepository userRepository;

	@Inject
	private NotificationRepository notificationRepository;

	@Inject
	private SchedulerService schedulerService;

	@Inject
	private ExportUtil exportUtil;

	@Inject
	private MailService mailService;

	@Inject
	private ReportService reportService;

	@Inject
	private Environment env;

	@Inject
	private FileUploadHelper fileUploadHelper;

	@Inject
	private ImportUtil importUtil;

	@Inject
	private ReportUtil reportUtil;

	@Inject
	private PricingRepository priceRepository;

	@Inject
	private CheckInOutImageRepository checkInOutImageRepository;

	@Inject
	private TicketManagementService ticketManagementService;

	@Inject
	private AssetGroupRepository assetGroupRepository;

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private ManufacturerRepository manufacturerRepository;

	@Inject
	private VendorRepository vendorRepository;

	@Inject
	private AssetTypeRepository assetTypeRepository;

	@Inject
	private AssetParameterConfigRepository assetParamConfigRepository;

	@Inject
	private AssetDocumentRepository assetDocumentRepository;

	@Inject
	private AssetPpmScheduleRepository assetPpmScheduleRepository;

	@Inject
	private ChecklistRepository checklistRepository;

	@Inject
	private AssetParamReadingRepository assetParamReadingRepository;
	
	@Inject
	private ParameterConfigRepository parameterConfigRepository;

	@Inject
	private JobManagementService jobManagementService;
	
	@Inject
	private AssetReadingRuleRepository assetReadingRuleRepository;
	
	@Inject
	private SettingsRepository settingRepository;
	
	@Inject
	private AssetParamRuleRepository assetParamRuleRepository;
	
	@Inject
	private WarrantyTypeRepository warrantyTypeRepository;
	
	public static final String EMAIL_NOTIFICATION_READING = "email.notification.reading";
	
	public static final String EMAIL_NOTIFICATION_READING_EMAILS = "email.notification.reading.emails";

	// Asset
	public AssetDTO saveAsset(AssetDTO assetDTO) {
		log.debug("assets service with assettype " + assetDTO.getAssetType());

		Asset asset = mapperUtil.toEntity(assetDTO, Asset.class);
		Site site = getSite(assetDTO.getSiteId());
		asset.setSite(site);

		Manufacturer manufacturer = getManufacturer(assetDTO.getManufacturerId());
		asset.setManufacturer(manufacturer);

		Vendor vendor = getVendor(assetDTO.getVendorId());
		asset.setAmcVendor(vendor);

		asset.setActive(Asset.ACTIVE_YES);

		asset = assetRepository.save(asset);
		
		//generate QR code if qr code is not already generated.
		if(asset != null && asset.getId() > 0 && !StringUtils.isEmpty(asset.getCode()) && StringUtils.isEmpty(asset.getQrCodeImage())) {
			generateAssetQRCode(asset.getId(), asset.getCode());
		}
		
		//create asset type if does not exist
		if(!StringUtils.isEmpty(asset.getAssetType())) {
			AssetType assetType = assetTypeRepository.findByName(asset.getAssetType());
			if(assetType == null) {
				assetType = new AssetType();
				assetType.setName(asset.getAssetType());
				assetType.setActive("Y");
				assetTypeRepository.save(assetType);
			}
		}

		//create asset group if does not exist
		if(!StringUtils.isEmpty(asset.getAssetGroup())) {
			AssetGroup assetGroup = assetGroupRepository.findByName(asset.getAssetGroup());
			if(assetGroup == null) {
				assetGroup = new AssetGroup();
				assetGroup.setAssetgroup(asset.getAssetGroup());
				assetGroup.setActive("Y");
				assetGroupRepository.save(assetGroup);
			}
		}
		
		//create asset type if does not exist
		if(!StringUtils.isEmpty(asset.getWarrantyType())) {
			WarrantyType warrantyType = warrantyTypeRepository.findByName(asset.getWarrantyType());
			if(warrantyType == null) {
				warrantyType = new WarrantyType();
				warrantyType.setName(asset.getWarrantyType());
				warrantyType.setActive("Y");
				warrantyTypeRepository.save(warrantyType);
			}
		}
				
		List<ParameterConfig> parameterConfigs = parameterConfigRepository.findAllByAssetType(assetDTO.getAssetType());
		if(CollectionUtils.isNotEmpty(parameterConfigs)) {
			List<AssetParameterConfig> assetParamConfigs = new ArrayList<AssetParameterConfig>();
			for(ParameterConfig parameterConfig : parameterConfigs) {
				AssetParameterConfig assetParamConfig = new AssetParameterConfig();
				assetParamConfig.setActive("Y");
				assetParamConfig.setAsset(asset);
				assetParamConfig.setAssetType(assetDTO.getAssetType());
				assetParamConfig.setConsumptionMonitoringRequired(parameterConfig.isConsumptionMonitoringRequired());
				assetParamConfig.setName(parameterConfig.getName());
				assetParamConfig.setUom(parameterConfig.getUom());
				assetParamConfigs.add(assetParamConfig);
			}
			assetParamConfigRepository.save(assetParamConfigs);
		}
		return mapperUtil.toModel(asset, AssetDTO.class);

	}

	public boolean isDuplicate(AssetDTO assetDTO) {
	    log.debug("Asset Title "+assetDTO.getTitle());
		Asset asset = assetRepository.findByTitle(assetDTO.getTitle());
		if(asset != null) {
			return true;
		}
		return false;
	}
	
	public boolean isDuplicatePPMSchedule(AssetPpmScheduleDTO assetPpmScheduleDTO) {
	    log.debug("Asset Title "+assetPpmScheduleDTO.getTitle());
		List<AssetPPMSchedule> assetPPMSchedule = assetPpmScheduleRepository.findAssetPPMScheduleByTitle(assetPpmScheduleDTO.getTitle());
		if(assetPPMSchedule != null) {
			return true;
		}
		return false;
	}
	
	public List<AssetDTO> findAllAssets() {
		log.debug(">>> get all assets");
		List<Asset> assets = assetRepository.findAll();
		List<AssetDTO> assetDto = new ArrayList<>();
		for (Asset loc : assets) {
			AssetDTO dto = new AssetDTO();
			Long siteId = loc.getSite().getId();
			Site site = getSite(siteId);
			dto.setId(loc.getId());
			dto.setTitle(loc.getTitle());
			dto.setSiteId(site.getId());
			dto.setSiteName(site.getName());
			dto.setStartTime(loc.getStartTime());
			dto.setEndTime(loc.getEndTime());
			dto.setUdsAsset(loc.isUdsAsset());
			dto.setCode(loc.getCode());
			dto.setDescription(loc.getDescription());
			assetDto.add(dto);
		}
		return assetDto;
	}

	public List<AssetDTO> getSiteAssets(Long AssetSiteId) {
		log.debug("get site assets");
		List<Asset> assets = assetRepository.findBySiteId(AssetSiteId);
		List<AssetDTO> assetDto = new ArrayList<>();
		for (Asset loc : assets) {
			AssetDTO dto = new AssetDTO();
			Long siteId = loc.getSite().getId();
			Site site = getSite(siteId);
			dto.setId(loc.getId());
			dto.setTitle(loc.getTitle());
			dto.setSiteId(site.getId());
			dto.setSiteName(site.getName());
			dto.setStartTime(loc.getStartTime());
			dto.setEndTime(loc.getEndTime());
			dto.setUdsAsset(loc.isUdsAsset());
			dto.setCode(loc.getCode());
			dto.setDescription(loc.getDescription());
			assetDto.add(dto);
		}
		return assetDto;
	}

	public Asset getAsset(long id) {
		Asset asset = assetRepository.findOne(id);
		if (asset == null)
			throw new TimesheetException("Asset not found : " + id);
		return asset;
	}

	public Checklist getCheckList(long id) {
		Checklist checklist = checklistRepository.findOne(id);
		if (checklist == null)
			throw new TimesheetException("Checklist not found : " + id);
		return checklist;
	}

	public AssetDTO getAssetDTO(long id) {
		log.debug(">>> Get asset by Id ... "+id);
		Asset asset = assetRepository.findOne(id);
		log.debug(">>> Get asset Id after fectching ... "+asset.getId());
		log.debug(">>> asset Type " + asset.getAssetType());
		log.debug(">>> Asset Group " + asset.getAssetGroup());
		AssetDTO assetDTO = mapperUtil.toModel(asset, AssetDTO.class);
		
		return assetDTO;
	}

	public AssetDTO getAssetByCode(String code) {
		Asset asset = assetRepository.findByCode(code);
		AssetDTO assetDTO = mapperUtil.toModel(asset, AssetDTO.class);
		Site site = getSite(assetDTO.getSiteId());
		assetDTO.setActive(asset.getActive());
		assetDTO.setSiteId(assetDTO.getSiteId());
		assetDTO.setSiteName(assetDTO.getSiteName());
		assetDTO.setTitle(asset.getTitle());
		assetDTO.setCode(asset.getCode());
		assetDTO.setDescription(asset.getDescription());
		assetDTO.setUdsAsset(asset.isUdsAsset());
		assetDTO.setStartTime(asset.getStartTime());
		assetDTO.setEndTime(asset.getEndTime());
		return assetDTO;
	}

	private void mapToEntityAssets(AssetDTO assetDTO, Asset asset) {
		asset.setTitle(assetDTO.getTitle());
		asset.setAssetType(assetDTO.getAssetType());
		asset.setWarrantyType(assetDTO.getWarrantyType());
		asset.setAssetGroup(assetDTO.getAssetGroup());
		asset.setDescription(assetDTO.getDescription());
		if (assetDTO.getSiteId() != asset.getSite().getId()) {
			Site site = getSite(assetDTO.getSiteId());
			asset.setSite(site);
		}
		if (assetDTO.getManufacturerId() != asset.getManufacturer().getId()) {
			Manufacturer manufacturer = getManufacturer(assetDTO.getManufacturerId());
			asset.setManufacturer(manufacturer);
		}
		if (assetDTO.getVendorId() != asset.getAmcVendor().getId()) {
			Vendor vendor = getVendor(assetDTO.getVendorId());
			asset.setAmcVendor(vendor);
		}
		asset.setBlock(assetDTO.getBlock());
		asset.setFloor(assetDTO.getFloor());
		asset.setZone(assetDTO.getZone());
		asset.setModelNumber(assetDTO.getModelNumber());
		asset.setSerialNumber(assetDTO.getSerialNumber());
		if (!StringUtils.isEmpty(assetDTO.getAcquiredDate())) {
		asset.setAcquiredDate(DateUtil.convertToSQLDate(assetDTO.getAcquiredDate()));
		}
		if (!StringUtils.isEmpty(assetDTO.getWarrantyFromDate()) && !StringUtils.isEmpty(assetDTO.getWarrantyToDate())) {
		asset.setWarrantyFromDate(DateUtil.convertToSQLDate(assetDTO.getWarrantyFromDate()));
		asset.setWarrantyToDate(DateUtil.convertToSQLDate(assetDTO.getWarrantyToDate()));
		}
		asset.setPurchasePrice(assetDTO.getPurchasePrice());
		asset.setCurrentPrice(assetDTO.getCurrentPrice());
		asset.setEstimatedDisposePrice(assetDTO.getEstimatedDisposePrice());
//		asset.setCode(assetDTO.getCode());
		if (!StringUtils.isEmpty(assetDTO.getEndTime())) {
			asset.setEndTime(DateUtil.convertToSQLDate(assetDTO.getEndTime()));
		}
		if (!StringUtils.isEmpty(assetDTO.getStartTime())) {
			asset.setStartTime(DateUtil.convertToSQLDate(assetDTO.getStartTime()));
		}
		asset.setUdsAsset(assetDTO.isUdsAsset());
	}

	public AssetDTO updateAsset(AssetDTO assetDTO) {
		Asset asset = assetRepository.findOne(assetDTO.getId());
		mapToEntityAssets(assetDTO, asset);
		asset = assetRepository.save(asset);

		return mapperUtil.toModel(asset, AssetDTO.class);
	}

	public void deleteAsset(Long id) {
		log.debug(">>> Inside Asset Delete Service");
		Asset asset = assetRepository.findOne(id);
		asset.setActive(Asset.ACTIVE_NO);
		assetRepository.save(asset);
	}
	
	public String generateAssetQRCode(long assetId, String assetCode) {
		Asset asset = assetRepository.findOne(assetId);
		long siteId = asset.getSite().getId();
		String code = String.valueOf(siteId)+"_"+assetCode;
		asset.setCode(code);
		assetRepository.save(asset);
		byte[] qrCodeImage = null;
		String qrCodeBase64 = null;
		if (asset != null) {
			String codeName = String.valueOf(asset.getCode());
				codeName = asset.getSite().getId()+"_"+codeName;
			qrCodeImage = QRCodeUtil.generateQRCode(codeName);
			String qrCodePath = env.getProperty("qrcode.file.path");
			String imageFileName = null;
			if (org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
				imageFileName = fileUploadHelper.uploadQrCodeFile(code, qrCodeImage);
				asset.setQrCodeImage(imageFileName);
				assetRepository.save(asset);
			}
			if (qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
				qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
			}
	}
		log.debug("*****************"+asset.getId());
		return getQRCode(asset.getId());
	}

	public String getQRCode(long assetId) {
		log.debug(">>> get QR Code <<<");
		Asset asset = assetRepository.findOne(assetId);
		String qrCodeBase64 = null;
		String imageFileName = null;
		String assetcode = asset.getCode();
		if (asset != null) {
			imageFileName = asset.getQrCodeImage();
			if (org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
				qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
			}
		}
		qrCodeBase64 = qrCodeBase64 + "." + assetcode;
		return qrCodeBase64;
		}

	public ExportResult generateReport(List<AssetDTO> transactions, SearchCriteria criteria) {
		return reportUtil.generateAssetReports(transactions, null, null, criteria);
	}

	/**
	 * Creates the asset AMC schedule information.
	 * 
	 * @param assetAMCScheduleDTO
	 * @return
	 */
	public AssetAMCScheduleDTO createAssetAMCSchedule(AssetAMCScheduleDTO assetAMCScheduleDTO) {
		log.debug("Create assets AMC schedule");

		AssetAMCSchedule assetAMC = mapperUtil.toEntity(assetAMCScheduleDTO, AssetAMCSchedule.class);
		assetAMC.setMaintenanceType(MaintenanceType.AMC.getValue());
		
		if(assetAMCScheduleDTO.getChecklistId() > 0) {
			Checklist checklist = checklistRepository.findOne(assetAMCScheduleDTO.getChecklistId());
			assetAMC.setChecklist(checklist);
		}else {
			assetAMC.setChecklist(null);
		}
		Asset asset = assetRepository.findOne(assetAMCScheduleDTO.getAssetId());
		assetAMC.setAsset(asset);
		assetAMC.setActive(AssetAMCSchedule.ACTIVE_YES);

		List<AssetAMCSchedule> existingSchedules = assetRepository.findAssetAMCScheduleByTitle(assetAMCScheduleDTO.getTitle());
		log.debug("Existing schedule -" + existingSchedules);
		if (CollectionUtils.isEmpty(existingSchedules)) {
			assetAMC = assetAMCRepository.save(assetAMC);
			assetAMCScheduleDTO = mapperUtil.toModel(assetAMC, AssetAMCScheduleDTO.class);
			if(assetAMC.getId() > 0) { 
				jobManagementService.createAMCJobs(assetAMCScheduleDTO);
			}
		}

		return assetAMCScheduleDTO;

	}

	/**
	 * Updates the asset AMC schedule information.
	 * 
	 * @param assetAMCScheduleDTO
	 * @return
	 */
	public AssetAMCScheduleDTO updateAssetAMCSchedule(AssetAMCScheduleDTO assetAMCScheduleDTO) {
		log.debug("Update assets AMC schedule");
		AssetAMCSchedule assetAMC = null;
		if (assetAMCScheduleDTO.getId() > 0) {
			assetAMC = assetAMCRepository.findOne(assetAMCScheduleDTO.getId());
			assetAMC.setActive(assetAMCScheduleDTO.getActive());
			if (assetAMC.getChecklist().getId() != assetAMCScheduleDTO.getChecklistId()) {
				Checklist checklist = checklistRepository.findOne(assetAMCScheduleDTO.getChecklistId());
				assetAMC.setChecklist(checklist);
			}
			assetAMC.setFrequency(assetAMCScheduleDTO.getFrequency());
			assetAMC.setFrequencyDuration(assetAMCScheduleDTO.getFrequencyDuration());
			assetAMC.setFrequencyPrefix(assetAMCScheduleDTO.getFrequencyPrefix());
			assetAMC.setEndDate(DateUtil.convertToSQLDate(assetAMCScheduleDTO.getEndDate()));
			assetAMC.setStartDate(DateUtil.convertToSQLDate(assetAMCScheduleDTO.getStartDate()));
			assetAMC.setTitle(assetAMCScheduleDTO.getTitle());
			assetAMCRepository.save(assetAMC);
		}
		return mapperUtil.toModel(assetAMC, AssetAMCScheduleDTO.class);

	}

	/**
	 * Returns a list of asset AMC schedule information for the given asset Id.
	 * 
	 * @param assetId
	 * @return
	 */
	public List<AssetAMCScheduleDTO> getAssetAMCSchedules(long assetId) {
		List<AssetAMCScheduleDTO> assetAMCScheduleDTOs = null;
		String type = MaintenanceType.valueOf("AMC").getValue();
		List<AssetAMCSchedule> assetAMCSchedules = assetAMCRepository.findAssetAMCScheduleByAssetId(assetId, type);
		if (CollectionUtils.isNotEmpty(assetAMCSchedules)) {
			assetAMCScheduleDTOs = mapperUtil.toModelList(assetAMCSchedules, AssetAMCScheduleDTO.class);
		}
		return assetAMCScheduleDTOs;
	}

	/**
	 * Returns a list of asset PPM schedule information for the given asset Id.
	 * 
	 * @param assetId
	 * @return
	 */
	public List<AssetPpmScheduleDTO> getAssetPPMSchedules(long assetId) {
		List<AssetPpmScheduleDTO> assetPpmScheduleDTOs = null;
		String type = MaintenanceType.valueOf("PPM").getValue();
		List<AssetPPMSchedule> assetPpmSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByAssetId(assetId, type);
		if (CollectionUtils.isNotEmpty(assetPpmSchedules)) {
			assetPpmScheduleDTOs = mapperUtil.toModelList(assetPpmSchedules, AssetPpmScheduleDTO.class);
		}
		return assetPpmScheduleDTOs;
	}
	
	/**
	 * Get the 52 week schedule for the current year in operation for a given asset or all the assets in a site.
	 * @param siteId
	 * @param assetId
	 */
	public ExportResult generate52WeekSchedule(long siteId, long assetId) {
		ExportResult result = new ExportResult();
		
		List<Asset> assets = new ArrayList<Asset>();
		Site site = null;
		if(assetId > 0) {
			assets.add(assetRepository.findOne(assetId));
		}
		if(assetId <= 0 && siteId > 0) {
			assets = assetRepository.findBySiteId(siteId);
			site = siteRepository.findOne(siteId);
		}
		if(CollectionUtils.isNotEmpty(assets)) {
			List<AssetPPMScheduleEventDTO> eventDTOs = new ArrayList<AssetPPMScheduleEventDTO>();
			Calendar startCal = Calendar.getInstance();
			startCal.set(Calendar.MONTH, 0);
			startCal.set(Calendar.DAY_OF_MONTH, 1);
			startCal.set(Calendar.HOUR_OF_DAY, 0);
			startCal.set(Calendar.MINUTE, 0);
			Calendar endCal = Calendar.getInstance();
			endCal.set(Calendar.MONTH, 11);
			endCal.set(Calendar.DAY_OF_YEAR, endCal.getActualMaximum(Calendar.DAY_OF_YEAR));
			endCal.set(Calendar.HOUR_OF_DAY, 23);
			endCal.set(Calendar.MINUTE, 59);
			for(Asset asset : assets) {
				if(site == null) site = asset.getSite();
				List<AssetPPMScheduleEventDTO> assetSchedules = getAssetPPMScheduleCalendar(asset.getId(), startCal.getTime(), endCal.getTime());
				if(CollectionUtils.isNotEmpty(assetSchedules)) {
					eventDTOs.addAll(assetSchedules);
				}
			}
			exportUtil.write52WeekScheduleToFile(site.getName(), eventDTOs, result);
		}
		return result;
	}
	
	/**
	 * Returns a list of asset PPM schedule events for the given asset Id and date range.
	 * 
	 * @param assetId
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<AssetPPMScheduleEventDTO> getAssetPPMScheduleCalendar(long assetId, Date startDate, Date endDate) {
		List<AssetPPMScheduleEventDTO> assetPPMScheduleEventDTOs = null;
		String type = MaintenanceType.valueOf("PPM").getValue();
		List<AssetPPMSchedule> assetPpmSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByAssetId(assetId, type);
		if (CollectionUtils.isNotEmpty(assetPpmSchedules)) {
			assetPPMScheduleEventDTOs = new ArrayList<AssetPPMScheduleEventDTO>();
			Calendar currCal = Calendar.getInstance();
			currCal.setTime(startDate);
			currCal.set(Calendar.HOUR_OF_DAY, 0);
			currCal.set(Calendar.MINUTE, 0);
			Calendar lastDate = Calendar.getInstance();
			if(endDate == null) {
				lastDate.add(Calendar.DAY_OF_MONTH,  lastDate.getActualMaximum(Calendar.DAY_OF_MONTH));
			}else {
				lastDate.setTime(endDate);
			}
			lastDate.set(Calendar.HOUR_OF_DAY, 23);
			lastDate.set(Calendar.MINUTE, 59);
			
			for(AssetPPMSchedule ppmSchedule : assetPpmSchedules) {
				Date schStartDate = ppmSchedule.getStartDate();
				Date schEndDate = ppmSchedule.getEndDate();
				Calendar schStartCal = Calendar.getInstance();
				schStartCal.setTime(schStartDate);
				Calendar schEndCal = Calendar.getInstance();
				schEndCal.setTime(schEndDate);
				while((currCal.before(schStartCal) || schStartCal.equals(currCal)) && !currCal.after(lastDate)) { //if ppm schedule starts before current date and not after the last date of the month.
					AssetPPMScheduleEventDTO assetPPMScheduleEvent = new AssetPPMScheduleEventDTO();
					assetPPMScheduleEvent.setId(ppmSchedule.getId());
					assetPPMScheduleEvent.setTitle(ppmSchedule.getTitle());
					Asset asset = ppmSchedule.getAsset();
					assetPPMScheduleEvent.setAssetId(asset.getId());
					assetPPMScheduleEvent.setAssetTitle(asset.getTitle());
					assetPPMScheduleEvent.setAssetCode(asset.getCode());
					assetPPMScheduleEvent.setFrequency(ppmSchedule.getFrequency());
					assetPPMScheduleEvent.setFrequencyDuration(ppmSchedule.getFrequencyDuration());
					assetPPMScheduleEvent.setFrequencyPrefix(ppmSchedule.getFrequencyPrefix());
					assetPPMScheduleEvent.setStart(currCal.getTime());
					assetPPMScheduleEvent.setAllDay(true);
					assetPPMScheduleEvent.setWeek(currCal.get(Calendar.WEEK_OF_YEAR));
					assetPPMScheduleEventDTOs.add(assetPPMScheduleEvent);
					addDays(currCal, ppmSchedule.getFrequency(), ppmSchedule.getFrequencyDuration());
				}
			}
		}
		return assetPPMScheduleEventDTOs;
	}
	
	private void addDays(Calendar dateTime , String scheduleType, int duration) {
		Frequency frequency = Frequency.valueOf(scheduleType);
		
		switch(frequency) {
			case HOUR :
				dateTime.add(Calendar.HOUR_OF_DAY, 1 * duration);
				break;
			case DAY :
				dateTime.add(Calendar.DAY_OF_YEAR, 1 * duration);
				break;
			case WEEK :
				dateTime.add(Calendar.WEEK_OF_YEAR, 1 * duration);
				break;	
			case FORTNIGHT :
				dateTime.add(Calendar.DAY_OF_YEAR, 14 * duration);
				break;
			case MONTH :
				dateTime.add(Calendar.MONTH, 1 * duration);
				break;
			case YEAR :
				dateTime.add(Calendar.YEAR, 1 * duration);
				break;
			case HALFYEAR :
				dateTime.add(Calendar.MONTH, 6 * duration);
				break;
			case QUARTER :
				dateTime.add(Calendar.MONTH, 3 * duration);
				break;
			default:
			
		}
	}
	
	
	public SearchResult<AssetPpmScheduleDTO> findPPMSearchCriteria(SearchCriteria searchCriteria) {

		log.debug(">>> search ppm schedule 2 <<<");

		// -------
		SearchResult<AssetPpmScheduleDTO> result = new SearchResult<AssetPpmScheduleDTO>();
		/*User user = userRepository.findOne(searchCriteria.getUserId());
		Employee employee = user.getEmployee();
		List<EmployeeProjectSite> sites = employee.getProjectSites();
		List<Long> siteIds = new ArrayList<Long>();
		for (EmployeeProjectSite site : sites) {
			siteIds.add(site.getSite().getId());
		}*/

		if (searchCriteria != null) {
			Pageable pageRequest = null;
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
				log.debug("Sorting object" + sort);
				pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
			} else {
				if (searchCriteria.isList()) {
					pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
				} else {
					pageRequest = createPageRequest(searchCriteria.getCurrPage());
				}
			}
			Page<AssetPPMSchedule> page = null;
			List<AssetPpmScheduleDTO> transactions = null;
			log.debug(">>> Asset id in find search 3 =" + searchCriteria.getAssetId());
			page = assetPpmScheduleRepository.findAllPPMSchedule(searchCriteria.getAssetId(), pageRequest);		
			log.debug(">>> PPM Schedule size for this asset "+page.getContent().size());
			List<AssetPPMSchedule> assetList = page.getContent();
			log.debug(">>> Inside collection 3 A page content size <<<"+assetList.size());
			if (page != null) {
				log.debug(">>> Inside collection 3 B <<<");

				if (transactions == null) {
					log.debug(">>> Inside collection 3 C <<<");

					transactions = new ArrayList<AssetPpmScheduleDTO>();
				}

				if (CollectionUtils.isNotEmpty(assetList)) {
					log.debug(">>> Inside collection 4 <<<");
					for (AssetPPMSchedule asset : assetList) {
						transactions.add(mapToPPMScheduleModel(asset));
					}
				}
				if (CollectionUtils.isNotEmpty(transactions)) {
					buildSearchPPMScheduleResult(searchCriteria, page, transactions, result);
				}
			}

		}
		return result;
	}
	
	public AssetDTO findByAssetCode(String assetCode) {
		AssetDTO assetDTO = null;
		Asset asset = assetRepository.findByCode(assetCode);
		if(asset != null) {
			assetDTO = mapperUtil.toModel(asset, AssetDTO.class);
		}
		return assetDTO;
	}

	public SearchResult<AssetDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

		// -------
		SearchResult<AssetDTO> result = new SearchResult<AssetDTO>();
		User user = userRepository.findOne(searchCriteria.getUserId());
		log.debug(">>> user <<<"+ user.getFirstName() +" and "+user.getId());
		Employee employee = user.getEmployee();
		log.debug(">>> user <<<"+ employee.getFullName() +" and "+employee.getId());
		List<EmployeeProjectSite> sites = employee.getProjectSites();
		List<Long> siteIds = new ArrayList<Long>();
		for (EmployeeProjectSite site : sites) {
			siteIds.add(site.getSite().getId());
		}
		
		if (searchCriteria != null) {
			Pageable pageRequest = null;
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
				log.debug("Sorting object" + sort);
				pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
			} else {
				if (searchCriteria.isList()) {
					pageRequest = createPageRequest(searchCriteria.getCurrPage(), true);
				} else {
					pageRequest = createPageRequest(searchCriteria.getCurrPage());
				}
			}
			Page<Asset> page = null;
			List<Asset> allAssetsList = new ArrayList<Asset>();
			List<AssetDTO> transactions = null;
			log.debug("name =" + searchCriteria.getAssetName() + " ,  assetType = " + searchCriteria.getAssetTypeName());
			
            log.debug("AssetSpecification toPredicate - searchCriteria get consolidated status -"+ searchCriteria.isConsolidated());

/*			if (!searchCriteria.isFindAll()) {
				log.debug(">>> inside search findall <<<");
				
				if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && !StringUtils.isEmpty(searchCriteria.getAssetName()) && searchCriteria.getProjectId() > 0
						&& searchCriteria.getSiteId() > 0) {
					page = assetRepository.findByAllCriteria(searchCriteria.getAssetTypeName(), searchCriteria.getAssetName(), searchCriteria.getProjectId(),
							searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && !StringUtils.isEmpty(searchCriteria.getAssetCode())) {
					page = assetRepository.findAssetByTitleAndCode(searchCriteria.getAssetTitle(), searchCriteria.getAssetCode(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && !StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findAssetByTitleAndType(searchCriteria.getAssetTitle(), searchCriteria.getAssetTypeName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && !StringUtils.isEmpty(searchCriteria.getAssetGroupName())) {
					page = assetRepository.findAssetByTitleAndGroup(searchCriteria.getAssetTitle(), searchCriteria.getAssetGroupName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && searchCriteria.getSiteId() > 0) {
					page = assetRepository.findAssetByTitleAndSiteId(searchCriteria.getAssetTitle(), searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && searchCriteria.getProjectId() > 0) {
					page = assetRepository.findAssetByTitleAndProjectId(searchCriteria.getAssetTitle(), searchCriteria.getProjectId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle()) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByTitleAndAcquiredDate(searchCriteria.getAssetTitle(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				} 
				
				else if (!StringUtils.isEmpty(searchCriteria.getAssetCode()) && !StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findAssetByCodeAndType(searchCriteria.getAssetCode(), searchCriteria.getAssetTypeName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetCode()) && !StringUtils.isEmpty(searchCriteria.getAssetGroupName())) {
					page = assetRepository.findAssetByCodeAndGroup(searchCriteria.getAssetCode(), searchCriteria.getAssetGroupName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetCode()) && searchCriteria.getSiteId() > 0) {
					page = assetRepository.findAssetByCodeAndSiteId(searchCriteria.getAssetCode(), searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetCode()) && searchCriteria.getProjectId() > 0) {
					page = assetRepository.findAssetByCodeAndProjectId(searchCriteria.getAssetCode(), searchCriteria.getProjectId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetCode()) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByCodeAndAcquiredDate(searchCriteria.getAssetCode(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				}
				
				else if (!StringUtils.isEmpty(searchCriteria.getAssetGroupName()) && !StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findAssetByGroupAndType(searchCriteria.getAssetGroupName(), searchCriteria.getAssetTypeName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetGroupName()) && searchCriteria.getSiteId() > 0) {
					page = assetRepository.findAssetByGroupAndSiteId(searchCriteria.getAssetGroupName(), searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetGroupName()) && searchCriteria.getProjectId() > 0) {
					page = assetRepository.findAssetByGroupAndProjectId(searchCriteria.getAssetGroupName(), searchCriteria.getProjectId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetGroupName()) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByGroupAndAcquiredDate(searchCriteria.getAssetGroupName(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				}
				
				else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && searchCriteria.getSiteId() > 0) {
					page = assetRepository.findAssetByTypeAndSiteId(searchCriteria.getAssetTypeName(), searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && searchCriteria.getProjectId() > 0) {
					page = assetRepository.findAssetByTypeAndProjectId(searchCriteria.getAssetTypeName(), searchCriteria.getProjectId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName()) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByTypeAndAcquiredDate(searchCriteria.getAssetTypeName(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				}
				
				 else if (!StringUtils.isEmpty(searchCriteria.getSiteId() > 0) && searchCriteria.getProjectId() > 0) {
					page = assetRepository.findAssetBySiteAndProjectId(searchCriteria.getSiteId(), searchCriteria.getProjectId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getSiteId() > 0) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetBySiteAndAcquiredDate(searchCriteria.getSiteId(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				}
								
				else if (!StringUtils.isEmpty(searchCriteria.getProjectId() > 0) && !StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByProjectAndAcquiredDate(searchCriteria.getProjectId(), DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				}
				
				else if (!StringUtils.isEmpty(searchCriteria.getAssetCode())) {
					page = assetRepository.findByAssetCode(searchCriteria.getAssetCode(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTitle())) {
					page = assetRepository.findByAssetTitle(searchCriteria.getAssetTitle(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findAssetByTypeName(searchCriteria.getAssetTypeName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetGroupName())) {
					page = assetRepository.findAssetByGroupName(searchCriteria.getAssetGroupName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAcquiredDate())) {
					page = assetRepository.findAssetByAcquireDate(DateUtil.convertToSQLDate(searchCriteria.getAcquiredDate()), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetName())) {
					page = assetRepository.findByName(siteIds, searchCriteria.getAssetName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findByAssetType(siteIds, searchCriteria.getAssetTypeName(), pageRequest);
				} else if (searchCriteria.getSiteId() > 0) {
					page = assetRepository.findBySiteId(searchCriteria.getSiteId(), pageRequest);
				} else if (searchCriteria.getProjectId() > 0) {
					page = assetRepository.findByProjectId(searchCriteria.getProjectId(), pageRequest);
				}
			} else {
				log.debug(">>> inside search findall else part <<<");
				if (CollectionUtils.isNotEmpty(siteIds)) {
					page = assetRepository.findAll(siteIds, pageRequest);
				} else {
					page = assetRepository.findAllAsset(pageRequest);
				}
			}*/
			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = assetRepository.findAll(new AssetSpecification(searchCriteria,true),pageRequest);
    			allAssetsList.addAll(page.getContent());
    		}
			
			/*if (page != null) {
				if (transactions == null) {
					transactions = new ArrayList<AssetDTO>();
				}
				List<Asset> assetList = page.getContent();
				if (CollectionUtils.isNotEmpty(assetList)) {
					for (Asset asset : assetList) {
						transactions.add(mapToModel(asset, false));
					}
				}
				if (CollectionUtils.isNotEmpty(transactions)) {
					buildSearchResult(searchCriteria, page, transactions, result);
				}
			}*/
			if(CollectionUtils.isNotEmpty(allAssetsList)) {
				if(transactions == null) {
					transactions = new ArrayList<AssetDTO>();
				}
	        		for(Asset asset : allAssetsList) {
	        			transactions.add(mapperUtil.toModel(asset, AssetDTO.class));
	        		}
				buildSearchResult(searchCriteria, page, transactions,result);
			}
		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Asset> page, List<AssetDTO> transactions, SearchResult<AssetDTO> result) {
		if (page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
		result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
		result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}

	private void buildSearchPPMScheduleResult(SearchCriteria searchCriteria, Page<AssetPPMSchedule> page, List<AssetPpmScheduleDTO> transactions, SearchResult<AssetPpmScheduleDTO> result) {
		if (page != null) {
			result.setTotalPages(page.getTotalPages());
		}
		result.setCurrPage(page.getNumber() + 1);
		result.setTotalCount(page.getTotalElements());
		result.setStartInd((result.getCurrPage() - 1) * 10 + 1);
		result.setEndInd((result.getTotalCount() > 10 ? (result.getCurrPage()) * 10 : result.getTotalCount()));

		result.setTransactions(transactions);
		return;
	}
	
	private AssetDTO mapToModel(Asset asset, boolean includeShifts) {
		AssetDTO assetDTO = new AssetDTO();
		assetDTO.setId(asset.getId());
		assetDTO.setTitle(asset.getTitle());
		assetDTO.setCode(asset.getCode());
		Site site = asset.getSite();
		assetDTO.setSiteId(site.getId());
		assetDTO.setSiteName(site.getName());
		assetDTO.setProjectId(site.getProject().getId());
		assetDTO.setProjectName(site.getProject().getName());
		assetDTO.setAssetType(asset.getAssetType());
		assetDTO.setAssetGroup(asset.getAssetGroup());
		assetDTO.setQrCodeImage(asset.getQrCodeImage());
		return assetDTO;
	}

	private AssetPpmScheduleDTO mapToPPMScheduleModel(AssetPPMSchedule asset) {
		
		log.debug(">>> Inside collection 5 <<<");

		AssetPpmScheduleDTO assetDTO = new AssetPpmScheduleDTO();
		assetDTO.setAssetId(asset.getAsset().getId());
		assetDTO.setActive(asset.getActive());
		assetDTO.setId(asset.getId());
		assetDTO.setTitle(asset.getTitle());
		assetDTO.setChecklistId(asset.getChecklist().getId());
		assetDTO.setChecklistName(asset.getChecklist().getName());
		assetDTO.setStartDate(asset.getStartDate());
		assetDTO.setEndDate(asset.getEndDate());
		assetDTO.setFrequency(asset.getFrequency());
		assetDTO.setFrequencyDuration(asset.getFrequencyDuration());
		assetDTO.setFrequencyPrefix(asset.getFrequencyPrefix());
		log.debug(">>> Title <<< "+assetDTO.getTitle());
		log.debug(">>> Check list id <<< "+assetDTO.getChecklistId());
		log.debug(">>> Start Date <<< "+assetDTO.getStartDate());
		log.debug(">>> End Date <<< "+assetDTO.getEndDate());
		log.debug(">>> Frequency <<< "+assetDTO.getFrequency());
		log.debug(">>> Frequency Duration <<< "+assetDTO.getFrequencyDuration());
		log.debug(">>> Frequency Prefix <<< "+assetDTO.getFrequencyPrefix());

		return assetDTO;
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
		return exportUtil.readJobExportFile(fileName);
	}

	public ImportResult importFile(MultipartFile file, long dateTime) {
		return importUtil.importAssetData(file, dateTime, false, false);
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = new ImportResult();
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}
	
	public ImportResult importPPMFile(MultipartFile file, long dateTime) {
		return importUtil.importAssetData(file, dateTime,true, false);
	}

	public ImportResult getImportPPMStatus(String fileId) {
		ImportResult er = new ImportResult();
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}
	
	public ImportResult importAMCFile(MultipartFile file, long dateTime) {
		return importUtil.importAssetData(file, dateTime, false, true);
	}

	public ImportResult getImportAMCStatus(String fileId) {
		ImportResult er = new ImportResult();
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	private Site getSite(long siteId) {
		Site site = siteRepository.findOne(siteId);
		if (site == null)
			throw new TimesheetException("Site not found : " + siteId);
		return site;
	}

	private Manufacturer getManufacturer(long manufacturerId) {
		Manufacturer manufacturer = manufacturerRepository.findOne(manufacturerId);
		// if (manufacturer == null)
		// throw new TimesheetException("Manufacturer not found : " + manufacturerId);
		return manufacturer;
	}

	private Vendor getVendor(long vendorId) {
		Vendor vendor = vendorRepository.findOne(vendorId);
		// if (vendor == null)
		// throw new TimesheetException("Manufacturer not found : " + vendorId);
		return vendor;
	}

	private Project getProject(long projectId) {
		Project project = projectRepository.findOne(projectId);
		if (project == null)
			throw new TimesheetException("Project not found : " + projectId);
		return project;
	}

	public AssetgroupDTO createAssetGroup(AssetgroupDTO assetGroupDTO) {
		AssetGroup assetgroup = mapperUtil.toEntity(assetGroupDTO, AssetGroup.class);
		assetGroupRepository.save(assetgroup);
		return assetGroupDTO;
	}

	public List<AssetgroupDTO> findAllAssetGroups() {
		List<AssetGroup> assetgroup = assetGroupRepository.findAll();
		return mapperUtil.toModelList(assetgroup, AssetgroupDTO.class);
	}

	public List<AssetTypeDTO> findAllAssetType() {
		List<AssetType> assetType = assetTypeRepository.findAll();
		return mapperUtil.toModelList(assetType, AssetTypeDTO.class);
	}

	public List<AssetParameterConfigDTO> findByAssetConfig(String assertType, Long assetId) {
		// TODO Auto-generated method stub
		List<AssetParameterConfig> entities = assetParamConfigRepository.findByAssetConfig(assertType, assetId);
		return mapperUtil.toModelList(entities, AssetParameterConfigDTO.class);
	}

	public void deleteAssetConfig(Long id) {
		log.debug("Inside deleteAssetConfig");
		AssetParameterConfig assetConfigUpdate = assetParamConfigRepository.findOne(id);
		assetConfigUpdate.setActive(AssetParameterConfig.ACTIVE_NO);
		assetParamConfigRepository.save(assetConfigUpdate);
	}

	public AssetParameterConfigDTO createAssetParamConfig(AssetParameterConfigDTO assetParamConfigDTO) {
		// TODO Auto-generated method stub
		AssetParameterConfig assetParamConfig = mapperUtil.toEntity(assetParamConfigDTO, AssetParameterConfig.class);
		assetParamConfig.setActive(AssetParameterConfig.ACTIVE_YES);
		Asset asset = assetRepository.findOne(assetParamConfigDTO.getAssetId());
		assetParamConfig.setAsset(asset);
		assetParamConfig = assetParamConfigRepository.save(assetParamConfig);
		assetParamConfigDTO = mapperUtil.toModel(assetParamConfig, AssetParameterConfigDTO.class);
		if(assetParamConfigDTO.getId() > 0 && assetParamConfigDTO.getRule() != null) { 
			AssetParameterReadingRule ruleEntity = new AssetParameterReadingRule();
			ruleEntity.setAlertRequired(assetParamConfigDTO.isAlertRequired());
			ruleEntity.setRule(assetParamConfigDTO.getRule());
			ruleEntity.setValidationRequired(assetParamConfigDTO.isValidationRequired());
			ruleEntity.setAsset(asset);
			ruleEntity.setActive(AssetParameterReadingRule.ACTIVE_YES);
			AssetParameterConfig assetParameterConfig = assetParamConfigRepository.findOne(assetParamConfigDTO.getId());
			ruleEntity.setAssetParameterConfig(assetParameterConfig);
			assetParamRuleRepository.save(ruleEntity);
		}
		return assetParamConfigDTO;
	}

	/*public AssetPpmScheduleDTO createAssetPpmSchedule(AssetPpmScheduleDTO assetPpmScheduleDTO) {
		// TODO Auto-generated method stub
		log.debug(">> create ppm schedule and employee id <<< "+assetPpmScheduleDTO.getEmpId());
		AssetPPMSchedule assetPPMSchedule = mapperUtil.toEntity(assetPpmScheduleDTO, AssetPPMSchedule.class);
		assetPPMSchedule.setActive(AssetPPMSchedule.ACTIVE_YES);

		Checklist checklist = getCheckList(assetPpmScheduleDTO.getChecklistId());
		assetPPMSchedule.setChecklist(checklist);

		Asset asset = getAsset(assetPpmScheduleDTO.getAssetId());
		assetPPMSchedule.setAsset(asset);

		assetPPMSchedule = assetPpmScheduleRepository.save(assetPPMSchedule);
		assetPpmScheduleDTO.setId(assetPPMSchedule.getId());
		log.debug(">>> Employee Id 1 <<<: "+assetPpmScheduleDTO.getEmpId());
		if(assetPPMSchedule.getId() > 0) {
		log.debug(">>> Employee Id 2: <<< "+assetPpmScheduleDTO.getEmpId());
		jobManagementService.createJob(assetPpmScheduleDTO);
		log.debug(">> after create job for ppm schedule <<<");
		}
		
		return mapperUtil.toModel(assetPPMSchedule, AssetPpmScheduleDTO.class);
	}*/

	/**
	 * Creates the asset AMC schedule information.
	 * 
	 * @param assetAMCScheduleDTO
	 * @return
	 */
	public AssetPpmScheduleDTO createAssetPpmSchedule(AssetPpmScheduleDTO assetPpmScheduleDTO) {
		log.debug("Create assets PPM schedule");

		AssetPPMSchedule assetPPMSchedule = mapperUtil.toEntity(assetPpmScheduleDTO, AssetPPMSchedule.class);
		assetPPMSchedule.setMaintenanceType(MaintenanceType.PPM.getValue());
		if(assetPpmScheduleDTO.getChecklistId() > 0) {
			Checklist checklist = checklistRepository.findOne(assetPpmScheduleDTO.getChecklistId());
			assetPPMSchedule.setChecklist(checklist);
		}else {
			assetPPMSchedule.setChecklist(null);
		}
		Asset asset = assetRepository.findOne(assetPpmScheduleDTO.getAssetId());
		assetPPMSchedule.setAsset(asset);
		assetPPMSchedule.setActive(AssetPPMSchedule.ACTIVE_YES);

		List<AssetPPMSchedule> assetPPMSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByTitle(assetPpmScheduleDTO.getTitle());
		log.debug("Existing schedule -" + assetPPMSchedule);
		if (CollectionUtils.isEmpty(assetPPMSchedules)) {
			assetPPMSchedule = assetPpmScheduleRepository.save(assetPPMSchedule);
			assetPpmScheduleDTO = mapperUtil.toModel(assetPPMSchedule, AssetPpmScheduleDTO.class);
			if(assetPPMSchedule.getId() > 0) { 
				jobManagementService.createJob(assetPpmScheduleDTO);
			}
		}
		return assetPpmScheduleDTO;

	}
	
	/**
	 * Updates the asset PPM schedule information.
	 * 
	 * @param assetPPMScheduleDTO
	 * @return
	 */
	public AssetPpmScheduleDTO updateAssetPPMSchedule(AssetPpmScheduleDTO assetPpmScheduleDTO) {
		log.debug("Update assets PPM schedule");
		AssetPPMSchedule assetPPMSchedule = null;
		if (assetPpmScheduleDTO.getId() > 0) {
			assetPPMSchedule = assetPpmScheduleRepository.findOne(assetPpmScheduleDTO.getId());
			assetPPMSchedule.setActive(assetPpmScheduleDTO.getActive());
			if (assetPpmScheduleDTO.getChecklistId() > 0 && assetPPMSchedule.getChecklist().getId() != assetPpmScheduleDTO.getChecklistId()) {
				Checklist checklist = checklistRepository.findOne(assetPpmScheduleDTO.getChecklistId());
				assetPPMSchedule.setChecklist(checklist);
			}
			if (assetPpmScheduleDTO.getAssetId() > 0 && assetPPMSchedule.getAsset().getId() != assetPpmScheduleDTO.getAssetId()) {
				Asset asset = assetRepository.findOne(assetPpmScheduleDTO.getAssetId());
				assetPPMSchedule.setAsset(asset);
			}
			assetPPMSchedule.setFrequency(assetPpmScheduleDTO.getFrequency());
			assetPPMSchedule.setFrequencyDuration(assetPpmScheduleDTO.getFrequencyDuration());
			assetPPMSchedule.setFrequencyPrefix(assetPpmScheduleDTO.getFrequencyPrefix());
			assetPPMSchedule.setEndDate(DateUtil.convertToSQLDate(assetPpmScheduleDTO.getEndDate()));
			assetPPMSchedule.setStartDate(DateUtil.convertToSQLDate(assetPpmScheduleDTO.getStartDate()));
			assetPPMSchedule.setTitle(assetPpmScheduleDTO.getTitle());
			assetPpmScheduleRepository.save(assetPPMSchedule);
		}
		return mapperUtil.toModel(assetPPMSchedule, AssetPpmScheduleDTO.class);

	}

	@Transactional
	public AssetDocumentDTO uploadFile(AssetDocumentDTO assetDocumentDTO, MultipartFile file) {
		// TODO Auto-generated method stub
		Date uploadDate = new Date();
		Calendar cal = Calendar.getInstance();
		String extension = FilenameUtils.getExtension(file.getOriginalFilename());
		if(extension == "")
		{
		Asset assetEntity = assetRepository.findOne(assetDocumentDTO.getAssetId());
		String assetCode = assetEntity.getCode();
		Long siteId = assetEntity.getSite().getId();
		String fileName = fileUploadHelper.uploadAssetDcmFile(assetCode, siteId, file, cal.getTimeInMillis());
		assetDocumentDTO.setFile(fileName);
		assetDocumentDTO.setUploadedDate(uploadDate);
		assetDocumentDTO.setTitle(assetDocumentDTO.getTitle());
		AssetDocument assetDocument = mapperUtil.toEntity(assetDocumentDTO, AssetDocument.class);
		assetDocument.setActive(AssetDocument.ACTIVE_YES);
		assetDocument = assetDocumentRepository.save(assetDocument);
		assetDocumentDTO = mapperUtil.toModel(assetDocument, AssetDocumentDTO.class);
		return assetDocumentDTO;
		}
		else
		return null;
	}

	public List<AssetDocumentDTO> findAllDocuments(String type, Long assetId) {
		// TODO Auto-generated method stub
		List<AssetDocument> assetDocument = assetDocumentRepository.findAllByType(type, assetId);
		return mapperUtil.toModelList(assetDocument, AssetDocumentDTO.class);
	}

	public byte[] getUploadedFile(long documentId) {
		AssetDocument assetDocument = assetDocumentRepository.findOne(documentId);
		String fileName = assetDocument.getFile();
		Asset assetEntity = assetRepository.findOne(assetDocument.getAsset().getId());
		Long siteId = assetEntity.getSite().getId();
		String code = assetEntity.getCode();
		return exportUtil.readUploadedFile(siteId, fileName, code);

	}

	public AssetParameterReadingDTO saveAssetReadings(AssetParameterReadingDTO assetParamReadingDTO) {
		
		AssetParameterReading assetParameterReading = mapperUtil.toEntity(assetParamReadingDTO, AssetParameterReading.class);
		
		AssetParameterReadingDTO prevReading = getLatestParamReading(assetParamReadingDTO.getAssetId(), assetParamReadingDTO.getAssetParameterConfigId());
		
		List<AssetParameterReadingRule> readingRuleLists = assetReadingRuleRepository.findByAssetConfigId(assetParamReadingDTO.getAssetParameterConfigId());
		
		Asset asset = assetRepository.findOne(assetParamReadingDTO.getAssetId());
		
		String assetCode = asset.getCode();
		
		String assetName = asset.getTitle();
		
		Site site = siteRepository.findOne(asset.getSite().getId());
		
		String siteName = site.getName();
		
		Date date = new Date();
		
		boolean checkInvalidEntry = false;
		
		if(prevReading != null) { 
			
			for(AssetParameterReadingRule assetReadingRuleList : readingRuleLists) { 
				
				AssetReadingRule rule = AssetReadingRule.valueOf(assetReadingRuleList.getRule());
				
				switch(rule) { 
					
				case CURRENT_READING_GREATER_THAN_PREVIOUS_READING :
					
					if(!assetParameterReading.isConsumptionMonitoringRequired()) { 
						
						String type = "reading";
						
						if(assetParamReadingDTO.getValue() > prevReading.getValue()) { 
																
							Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING);
							
							if(setting.getSettingValue().equalsIgnoreCase("true") ) { 
								
								Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING_EMAILS);
								
								if(settingEntity.getSettingValue().length() > 0) {
									
									List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
									for(String email : emailLists) { 
										mailService.sendReadingAlert(email, siteName, assetCode, assetName, type, date);
									}
									
								} else {
									
									log.info("There is no email ids registered");
								}
							}
								
						}
					}
					
					
				case CURRENT_READING_LESS_THAN_PREVIOUS_READING :
					
					if(!assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
						
						if(assetParamReadingDTO.getValue() < prevReading.getValue()) { 
							
							if(assetReadingRuleList.isValidationRequired()) { 
								
								checkInvalidEntry = true;
																											
							}
						}
						
					}
					
				default:
				
				}
				
			}
		}

		
		if(checkInvalidEntry) {
			
			AssetParameterReadingDTO assetParamEntity = new AssetParameterReadingDTO();
			assetParamEntity.setErrorStatus(true);
			return assetParamEntity;
			
		} else { 
			
			assetParameterReading.setActive(AssetParameterReading.ACTIVE_YES);
			assetParamReadingDTO.setErrorStatus(false);
			Asset assetEntity = assetRepository.findOne(assetParamReadingDTO.getAssetId());
			assetParameterReading.setAsset(assetEntity);
			if(assetParamReadingDTO.getJobId() > 0) {
				Job jobEntity = jobRepository.findOne(assetParamReadingDTO.getJobId());
				assetParameterReading.setJob(jobEntity);
			}else{ 
				assetParameterReading.setJob(null);
			}
			
			Calendar now = Calendar.getInstance();
			
			if(assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
				if(assetParamReadingDTO.getFinalValue() > 0) {
					assetParameterReading.setFinalReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
				} 
				if(assetParamReadingDTO.getInitialValue() > 0) { 
					assetParameterReading.setInitialReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
				}
				
				
			} else {
				assetParameterReading.setInitialReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
			}
			
			AssetParameterConfig assetParameterConfig = assetParamConfigRepository.findOne(assetParamReadingDTO.getAssetParameterConfigId());
			assetParameterReading.setAssetParameterConfig(assetParameterConfig);
			assetParameterReading = assetParamReadingRepository.save(assetParameterReading);
			assetParamReadingDTO = mapperUtil.toModel(assetParameterReading, AssetParameterReadingDTO.class);
			return assetParamReadingDTO;
			
		}
		

	}

	public AssetParameterReadingDTO viewReadings(long id) {
		AssetParameterReading paramReading = assetParamReadingRepository.findOne(id);
		return mapperUtil.toModel(paramReading, AssetParameterReadingDTO.class);
	}
	
	public Frequency[] getAllType() { 
		Frequency[] types = Frequency.values();
		return types;
	}
	
	public FrequencyPrefix[] getAllPrefixs() { 
		FrequencyPrefix[] prefixs = FrequencyPrefix.values();
		return prefixs;
	}

	public List<AssetParameterReadingDTO> viewAssetReadings(long assetId) {
		List<AssetParameterReadingDTO> assetParameterReadingDTO = null;
		List<AssetParameterReading> assetParameterReading = assetRepository.findByAssetReading(assetId);
		if (CollectionUtils.isNotEmpty(assetParameterReading)) {
			assetParameterReadingDTO = mapperUtil.toModelList(assetParameterReading, AssetParameterReadingDTO.class);
		}
		return assetParameterReadingDTO;
	}

	public AssetParameterReadingDTO getLatestParamReading(long assetId, long assetParamId) {
		List<AssetParameterReading> assetParamReadings = assetRepository.findAssetReadingById(assetId, assetParamId);
		AssetParameterReading assetLatestParamReading = null;
		if(CollectionUtils.isNotEmpty(assetParamReadings)) { 
			assetLatestParamReading = assetParamReadings.get(0);
		}
		return mapperUtil.toModel(assetLatestParamReading, AssetParameterReadingDTO.class);
	}
	
	@Transactional
    public void deleteImages(long id) {
		AssetDocument assetDocumentEntity = assetDocumentRepository.findOne(id);
		Long assetId = assetDocumentEntity.getAsset().getId();
		String file = assetDocumentEntity.getFile(); 
		Asset asset = assetRepository.findOne(assetId);
		String assetCode = asset.getCode();
		Long siteId = asset.getSite().getId();
		String fileName = fileUploadHelper.deleteAssetFile(assetCode, siteId, file);
		log.info("The " + fileName + " was deleted successfully.");
		assetDocumentRepository.delete(id);
    }

	public AssetParameterReadingDTO updateAssetReadings(AssetParameterReadingDTO assetParamReadingDTO) {
		
			AssetParameterReadingDTO prevReading = getLatestParamReading(assetParamReadingDTO.getAssetId(), assetParamReadingDTO.getAssetParameterConfigId());

			AssetParameterReading assetParamReading = assetParamReadingRepository.findOne(assetParamReadingDTO.getId());
			
			boolean invalidEntry = false;
			
			if(assetParamReadingDTO.getAssetParameterConfigId() > 0 ) { 
				
				List<AssetParameterReadingRule> readingRuleLists = assetReadingRuleRepository.findByAssetConfigId(assetParamReadingDTO.getAssetParameterConfigId());
								
				AssetParameterConfig assetParamConfig = assetParamConfigRepository.findOne(assetParamReadingDTO.getId());
				
				Asset asset = assetRepository.findOne(assetParamReadingDTO.getAssetId());
				
				String assetCode = asset.getCode();
				
				String assetName = asset.getTitle();
				
				Site site = siteRepository.findOne(asset.getSite().getId());
				
				String siteName = site.getName();
				
				Date date = new Date();
				
				for(AssetParameterReadingRule assetReadingRuleList : readingRuleLists) {
							
					AssetReadingRule rule = AssetReadingRule.valueOf(assetReadingRuleList.getRule());
					
					switch(rule) {
					
						case CURRENT_CONSUMPTION_GREATER_THAN_PREVIOUS_CONSUMPTION :
							
							if(assetParamReadingDTO.getId() > 0 && assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
																
								if(assetParamReadingDTO.getConsumption() > prevReading.getConsumption()) {
									
									String type = "consumption";
									
									Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING);
									
									if(setting.getSettingValue().equalsIgnoreCase("true") ) { 
										Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING_EMAILS);
										if(settingEntity.getSettingValue().length() > 0) { 
											List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
											for(String email : emailLists) { 
												mailService.sendReadingAlert(email, siteName, assetCode, assetName, type, date);
											}
										}
									}
								}
							}
							
						break;
							
							
						case CURRENT_CONSUMPTION_GREATER_THAN_THRESHOLD_VALUE :
							
							if(assetParamReadingDTO.getId() > 0 && assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
								
								String type = "current consumption";
									
								double currentThreshold = assetParamReadingDTO.getConsumption() - prevReading.getConsumption();
								
								double threshold = assetParamConfig.getThreshold();
								
								if(currentThreshold > threshold) {
								
									Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING);
									
									if(setting.getSettingValue().equalsIgnoreCase("true") ) { 
										Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING_EMAILS);
										if(settingEntity.getSettingValue().length() > 0) { 
											List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
											for(String email : emailLists) { 
												mailService.sendReadingAlert(email, siteName, assetCode, assetName, type, date);
											}
										}
									}
								
								}
							}
							
						break;
							
							
						case CURRENT_READING_GREATER_THAN_PREVIOUS_READING :
							
							if(assetParamReadingDTO.getId() > 0 && !assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
								
								String type = "reading";
								
								if(assetParamReadingDTO.getValue() > prevReading.getValue()) { 
																		
									Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING);
									
									if(setting.getSettingValue().equalsIgnoreCase("true") ) { 
										
										Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING_EMAILS);
										
										if(settingEntity.getSettingValue().length() > 0) {
											
											List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
											for(String email : emailLists) { 
												mailService.sendReadingAlert(email, siteName, assetCode, assetName, type, date);
											}
											
										} else {
											
											log.info("There is no email ids registered");
										}
									}
										
								}
							}
							
						break;
							
						case CURRENT_READING_GREATER_THAN_THRESHOLD_VALUE : 
							
							String type = "current reading";
						
							double currentThreshold = prevReading.getValue() - assetParamReadingDTO.getValue();
							
							double threshold = assetParamConfig.getThreshold();
							
							if(currentThreshold > threshold) { 
								
								Setting setting = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING);
								
								if(setting.getSettingValue().equalsIgnoreCase("true") ) { 
									
									Setting settingEntity = settingRepository.findSettingByKey(EMAIL_NOTIFICATION_READING_EMAILS);
									
									if(settingEntity.getSettingValue().length() > 0) {
										
										List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");
										for(String email : emailLists) { 
											mailService.sendReadingAlert(email, siteName, assetCode, assetName, type, date);
										}
										
									} else {
										
										log.info("There is no email ids registered");
									}
								}
								
							}
							
						break;
						
						case CURRENT_READING_LESS_THAN_PREVIOUS_READING : 
							
							if(!assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
								
								if(assetParamReadingDTO.getValue() < prevReading.getValue()) { 
									
									if(assetReadingRuleList.isValidationRequired()) { 
										
										invalidEntry = true;
																													
									}
								}
								
							}
							
							
						break;
							
						case CURRENT_RUNHOUR_GREATER_THAN_PREVIOUS_RUNHOUR : 
							
							if(assetParamReadingDTO.getId() > 0 && assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
																	
								long milliseconds = assetParamReadingDTO.getFinalReadingTime().getTime() - assetParamReadingDTO.getInitialReadingTime().getTime();
								int seconds = (int) milliseconds / 1000;
								
								// calculate hours minutes and seconds
							    int hours = seconds / 3600;
							    int minutes = (seconds % 3600) / 60;
							    
							    assetParamReading.setRunHours(hours);
							    assetParamReading.setRunMinutues(minutes);
							    
							} else if(assetParamReadingDTO.getId() > 0 && !assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
								
								long milliseconds = assetParamReadingDTO.getInitialReadingTime().getTime() - prevReading.getInitialReadingTime().getTime();
								int seconds = (int) milliseconds / 1000;
								
								// calculate hours minutes and seconds
							    int hours = seconds / 3600;
							    int minutes = (seconds % 3600) / 60;
							    
							    assetParamReading.setRunHours(hours);
							    assetParamReading.setRunMinutues(minutes);
							}
							
						break;

						default:
						
					}
					
				}
			}
			
			if(assetParamReadingDTO.getAssetId() > 0){ 
				Asset asset = assetRepository.findOne(assetParamReadingDTO.getAssetId());
				assetParamReading.setAsset(asset);
			}
			if(assetParamReadingDTO.getAssetParameterConfigId() > 0){ 
				AssetParameterConfig assetParameterConfig = assetParamConfigRepository.findOne(assetParamReadingDTO.getAssetParameterConfigId());
				assetParamReading.setAssetParameterConfig(assetParameterConfig);
			}
			
			if(assetParamReadingDTO.getJobId() > 0){ 
				Job job = jobRepository.findOne(assetParamReadingDTO.getJobId());
				assetParamReading.setJob(job);
			} else {
				assetParamReading.setJob(null);
			}
			
			if(assetParamReadingDTO.getInitialValue() > 0 && assetParamReadingDTO.getFinalValue() > 0) {
				double consumption = assetParamReadingDTO.getFinalValue() - assetParamReadingDTO.getInitialValue();
				assetParamReading.setConsumption(consumption);
			}
			
			Calendar now = Calendar.getInstance();
			
			if(assetParamReadingDTO.isConsumptionMonitoringRequired()) { 
				if(assetParamReadingDTO.getFinalValue() > 0) {
					assetParamReading.setFinalReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
				} 
				if(assetParamReadingDTO.getInitialValue() > 0) { 
					assetParamReading.setInitialReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
				}
			} else {
				assetParamReading.setInitialReadingTime(new java.sql.Timestamp(now.getTimeInMillis()));
			}
			
			assetParamReading.setConsumptionMonitoringRequired(assetParamReadingDTO.isConsumptionMonitoringRequired());
			assetParamReading.setInitialValue(assetParamReadingDTO.getInitialValue());
			assetParamReading.setFinalValue(assetParamReadingDTO.getFinalValue());
			assetParamReading.setName(assetParamReadingDTO.getName());
			assetParamReading.setUom(assetParamReadingDTO.getUom());
			assetParamReading.setValue(assetParamReadingDTO.getValue());
			
			if(invalidEntry) {
				
				AssetParameterReadingDTO assetReadingDTO = new AssetParameterReadingDTO();
				assetReadingDTO.setErrorStatus(true);
				return assetReadingDTO;
				
			} else {
				
				assetParamReadingRepository.save(assetParamReading);
				assetParamReadingDTO = mapperUtil.toModel(assetParamReading, AssetParameterReadingDTO.class);
				assetParamReadingDTO.setErrorStatus(false);
				return assetParamReadingDTO;
				
			}
	}
	
	public AssetReadingRule[] getAllRules() { 
		AssetReadingRule[] types = AssetReadingRule.values();
		return types;
	}

	public void updateAssetConfig(AssetParameterConfigDTO assetParameterConfigDTO) {
		AssetParameterConfig assetParamConfig = assetParamConfigRepository.findOne(assetParameterConfigDTO.getId());
		mapToEntity(assetParamConfig, assetParameterConfigDTO);
		assetParamConfigRepository.saveAndFlush(assetParamConfig);
	}

	private void mapToEntity(AssetParameterConfig assetParamConfig, AssetParameterConfigDTO assetParameterConfigDTO) {
		assetParamConfig.setAlertRequired(assetParameterConfigDTO.isAlertRequired());
		assetParamConfig.setThreshold(assetParameterConfigDTO.getThreshold());
		assetParamConfig.setAssetType(assetParameterConfigDTO.getAssetType());
		assetParamConfig.setConsumptionMonitoringRequired(assetParameterConfigDTO.isConsumptionMonitoringRequired());
		assetParamConfig.setMax(assetParameterConfigDTO.getMax());
		assetParamConfig.setMin(assetParameterConfigDTO.getMin());
		assetParamConfig.setName(assetParameterConfigDTO.getName());
		assetParamConfig.setRule(assetParameterConfigDTO.getRule());
		assetParamConfig.setUom(assetParameterConfigDTO.getUom());
		assetParamConfig.setValidationRequired(assetParameterConfigDTO.isValidationRequired());
	}

	public AssetParameterConfigDTO getAssetConfig(long id) {
		// TODO Auto-generated method stub
		AssetParameterConfig assetConfigEntity = assetParamConfigRepository.findOne(id);
		return mapperUtil.toModel(assetConfigEntity, AssetParameterConfigDTO.class);
	}
	

}
