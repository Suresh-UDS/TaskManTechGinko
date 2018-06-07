package com.ts.app.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import com.ts.app.domain.AssetType;
import com.ts.app.domain.Checklist;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Manufacturer;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.User;
import com.ts.app.domain.Vendor;
import com.ts.app.repository.AssetAMCRepository;
import com.ts.app.repository.AssetDocumentRepository;
import com.ts.app.repository.AssetGroupRepository;
import com.ts.app.repository.AssetParamReadingRepository;
import com.ts.app.repository.AssetParameterConfigRepository;
import com.ts.app.repository.AssetPpmScheduleRepository;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AssetTypeRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.ChecklistRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.ManufacturerRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.PricingRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.repository.VendorRepository;
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
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;
import com.ts.app.web.rest.dto.AssetParameterReadingDTO;
import com.ts.app.web.rest.dto.AssetPpmScheduleDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobDTO;
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
	private ProjectRepository projectRepositoy;

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

	// Asset
	public AssetDTO saveAsset(AssetDTO assetDTO) {
		log.debug("assets service with assettype "+assetDTO.getAssetType());

		Asset asset = mapperUtil.toEntity(assetDTO, Asset.class);
		Site site = getSite(assetDTO.getSiteId());
		asset.setSite(site);

		Manufacturer manufacturer = getManufacturer(assetDTO.getManufacturerId());
		asset.setManufacturer(manufacturer);

		Vendor vendor = getVendor(assetDTO.getVendorId());
		asset.setAmcVendor(vendor);

		asset.setActive(Asset.ACTIVE_YES);

		List<Asset> existingAssets = assetRepository.findAssetByTitle(assetDTO.getTitle());
		log.debug("Existing asset size -" + existingAssets.size());
		if (CollectionUtils.isEmpty(existingAssets)) {
			asset = assetRepository.save(asset);
		}

		return mapperUtil.toModel(asset, AssetDTO.class);

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
		Asset asset = assetRepository.findOne(id);
		log.debug("Get asset by Id service");
		log.debug("asset Type " + asset.getAssetType());
		log.debug("Asset Group " + asset.getAssetGroup());
		AssetDTO assetDTO = mapperUtil.toModel(asset, AssetDTO.class);
		log.debug("asset Type after mapping... " + assetDTO.getAssetType() +" Manufacture "+assetDTO.getManufacturerName() + " Vendor " + assetDTO.getAmcVendorName());
		log.debug("Asset Group after mapping...  " + assetDTO.getAssetGroup());
		AssetType assetType = assetTypeRepository.findOne(Long.valueOf(assetDTO.getAssetType()));
		assetDTO.setAssetTypeName(assetType.getName());
		log.debug("Asset Type Name  " + assetDTO.getAssetTypeName());

		AssetGroup assetGroup = assetGroupRepository.findOne(Long.valueOf(assetDTO.getAssetGroup()));
		assetDTO.setAssetGroupName(assetGroup.getAssetgroup());
		log.debug("Asset Group Name  " + assetDTO.getAssetGroupName());
		
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

	private void mapToEntityAssets(AssetDTO assetDTO, Asset asset) {asset.setTitle(assetDTO.getTitle());
	asset.setAssetType(assetDTO.getAssetType());
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
	asset.setAcquiredDate(DateUtil.convertToSQLDate(assetDTO.getAcquiredDate()));
	asset.setPurchasePrice(assetDTO.getPurchasePrice());
	asset.setCurrentPrice(assetDTO.getCurrentPrice());
	asset.setEstimatedDisposePrice(assetDTO.getEstimatedDisposePrice());
	asset.setCode(assetDTO.getCode());
	if (!StringUtils.isEmpty(assetDTO.getEndTime())) {
		asset.setEndTime(DateUtil.convertToSQLDate(assetDTO.getEndTime()));
	}
	if (!StringUtils.isEmpty(assetDTO.getStartTime())) {
		asset.setStartTime(DateUtil.convertToSQLDate(assetDTO.getStartTime()));
	}
	asset.setUdsAsset(assetDTO.isUdsAsset());}

	public AssetDTO updateAsset(AssetDTO assetDTO) {
		Asset asset = assetRepository.findOne(assetDTO.getId());
		mapToEntityAssets(assetDTO, asset);
		asset = assetRepository.save(asset);

		return mapperUtil.toModel(asset, AssetDTO.class);
	}

	public String generateAssetQRCode(long assetId, String assetCode) {
		Asset asset = assetRepository.findOne(assetId);
		asset.setCode(assetCode);
		assetRepository.save(asset);
		byte[] qrCodeImage = null;
		String qrCodeBase64 = null;
		if (asset != null) {
			String code = String.valueOf(asset.getCode());
			qrCodeImage = QRCodeUtil.generateQRCode(code);
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
		return qrCodeBase64;
	}

	public String getQRCode(long assetId) {
		Asset asset = assetRepository.findOne(assetId);
		String qrCodeBase64 = null;
		String imageFileName = null;
		if (asset != null) {
			imageFileName = asset.getQrCodeImage();
			if (org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
				qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
			}
		}
		return qrCodeBase64;
	}

	public ExportResult generateReport(List<JobDTO> transactions, SearchCriteria criteria) {
		return reportUtil.generateJobReports(transactions, null, null, criteria);
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

		assetAMC.setActive(Asset.ACTIVE_YES);

		List<AssetAMCSchedule> existingSchedules = assetRepository
				.findAssetAMCScheduleByTitle(assetAMCScheduleDTO.getTitle());
		log.debug("Existing schedule -" + existingSchedules);
		if (CollectionUtils.isEmpty(existingSchedules)) {
			assetAMC = assetAMCRepository.save(assetAMC);
		}

		return mapperUtil.toModel(assetAMC, AssetAMCScheduleDTO.class);

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
			if (assetAMCScheduleDTO.getChecklistDto() != null
					&& assetAMC.getChecklist().getId() != assetAMCScheduleDTO.getChecklistDto().getId()) {
				Checklist checklist = checklistRepository.findOne(assetAMCScheduleDTO.getChecklistDto().getId());
				assetAMC.setChecklist(checklist);
			}
			assetAMC.setFrequency(assetAMCScheduleDTO.getFrequency());
			assetAMC.setFrequencyDuration(assetAMCScheduleDTO.getFrequencyDuration());
			assetAMC.setFrequencyPrefix(assetAMCScheduleDTO.getFrequencyPrefix());
			assetAMC.setEndDate(assetAMCScheduleDTO.getEndDate());
			assetAMC.setStartDate(assetAMCScheduleDTO.getStartDate());
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
		List<AssetAMCSchedule> assetAMCSchedules = assetAMCRepository.findAssetAMCScheduleByAssetId(assetId);
		if (CollectionUtils.isNotEmpty(assetAMCSchedules)) {
			assetAMCScheduleDTOs = mapperUtil.toModelList(assetAMCSchedules, AssetAMCScheduleDTO.class);
		}
		return assetAMCScheduleDTOs;
	}

	public SearchResult<AssetDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

		// -------
		SearchResult<AssetDTO> result = new SearchResult<AssetDTO>();
		User user = userRepository.findOne(searchCriteria.getUserId());
		Employee employee = user.getEmployee();
		List<EmployeeProjectSite> sites = employee.getProjectSites();
		List<Long> siteIds = new ArrayList<Long>();
		for (EmployeeProjectSite site : sites) {
			siteIds.add(site.getSite().getId());
		}

		if (searchCriteria != null) {
			Pageable pageRequest = null;
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
						searchCriteria.getColumnName());
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
			List<AssetDTO> transactions = null;
			log.debug(
					"name =" + searchCriteria.getAssetName() + " ,  assetType = " + searchCriteria.getAssetTypeName());
			if (!searchCriteria.isFindAll()) {
				if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName())
						&& !StringUtils.isEmpty(searchCriteria.getAssetName()) && searchCriteria.getProjectId() > 0
						&& searchCriteria.getSiteId() > 0) {
					page = assetRepository.findByAllCriteria(searchCriteria.getAssetTypeName(),
							searchCriteria.getAssetName(), searchCriteria.getProjectId(), searchCriteria.getSiteId(),
							pageRequest);
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
				if (CollectionUtils.isNotEmpty(siteIds)) {
					page = assetRepository.findAll(siteIds, pageRequest);
				} else {
					page = assetRepository.findAll(pageRequest);
				}
			}
			if (page != null) {
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
			}

		}
		return result;
	}

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Asset> page, List<AssetDTO> transactions,
			SearchResult<AssetDTO> result) {
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
		assetDTO.setSiteId(asset.getSite().getId());
		assetDTO.setSiteName(asset.getSite().getName());
		assetDTO.setAssetType(asset.getAssetType());
		assetDTO.setAssetGroup(asset.getAssetGroup());
		
		log.debug(">>> Asset Type " + assetDTO.getAssetType() +" Manufacture "+assetDTO.getManufacturerName() + " Vendor " + assetDTO.getAmcVendorName());
		log.debug("Asset Group ...  " + assetDTO.getAssetGroup());
		
		AssetType assetType = assetTypeRepository.findOne(Long.valueOf(assetDTO.getAssetType()));
		assetDTO.setAssetTypeName(assetType.getName());
		
		log.debug("Asset Type Name  " + assetDTO.getAssetTypeName());

		AssetGroup assetGroup = assetGroupRepository.findOne(Long.valueOf(assetDTO.getAssetGroup()));
		assetDTO.setAssetGroupName(assetGroup.getAssetgroup());
		
		log.debug("Asset Group Name  " + assetDTO.getAssetGroupName());

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
		return importUtil.importJobData(file, dateTime);
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
		Project project = projectRepositoy.findOne(projectId);
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
		return assetParamConfigDTO;
	}

	public AssetPpmScheduleDTO createAssetPpmSchedule(AssetPpmScheduleDTO assetPpmScheduleDTO) {
		// TODO Auto-generated method stub
		log.debug(">> create ppm schedule <<<");
		AssetPPMSchedule assetPPMSchedule = mapperUtil.toEntity(assetPpmScheduleDTO, AssetPPMSchedule.class);
		assetPPMSchedule.setActive(AssetPPMSchedule.ACTIVE_YES);

		Checklist checklist = getCheckList(assetPpmScheduleDTO.getChecklistId());
		assetPPMSchedule.setChecklist(checklist);

		Asset asset = getAsset(assetPpmScheduleDTO.getAssetId());
		assetPPMSchedule.setAsset(asset);

		assetPPMSchedule = assetPpmScheduleRepository.save(assetPPMSchedule);
		assetPpmScheduleDTO = mapperUtil.toModel(assetPPMSchedule, AssetPpmScheduleDTO.class);
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
			if (assetPpmScheduleDTO.getChecklistId() != null
					&& assetPPMSchedule.getChecklist().getId() != assetPpmScheduleDTO.getChecklistId()) {
				Checklist checklist = checklistRepository.findOne(assetPpmScheduleDTO.getChecklistId());
				assetPPMSchedule.setChecklist(checklist);
			}
			if (assetPpmScheduleDTO.getAssetId() != null
					&& assetPPMSchedule.getAsset().getId() != assetPpmScheduleDTO.getAssetId()) {
				Asset asset = assetRepository.findOne(assetPpmScheduleDTO.getAssetId());
				assetPPMSchedule.setAsset(asset);
			}
			assetPPMSchedule.setFrequency(assetPpmScheduleDTO.getFrequency());
			assetPPMSchedule.setFrequencyDuration(assetPpmScheduleDTO.getFrequencyDuration());
			assetPPMSchedule.setFrequencyPrefix(assetPpmScheduleDTO.getFrequencyPrefix());
			assetPPMSchedule.setEndDate(assetPpmScheduleDTO.getEndDate());
			assetPPMSchedule.setStartDate(assetPpmScheduleDTO.getStartDate());
			assetPPMSchedule.setTitle(assetPpmScheduleDTO.getTitle());
			assetPpmScheduleRepository.save(assetPPMSchedule);
		}
		return mapperUtil.toModel(assetPPMSchedule, AssetPpmScheduleDTO.class);

	}

	/**
	 * Returns a list of asset AMC schedule information for the given asset Id.
	 * 
	 * @param assetId
	 * @return
	 */
	public List<AssetPpmScheduleDTO> getAssetPPMSchedule(Long assetId) {
		List<AssetPpmScheduleDTO> assetPpmScheduleDTOs = null;
		List<AssetPPMSchedule> assetPPMSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByAssetId(assetId);
		if (CollectionUtils.isNotEmpty(assetPPMSchedules)) {
			assetPpmScheduleDTOs = mapperUtil.toModelList(assetPPMSchedules, AssetPpmScheduleDTO.class);
		}
		return assetPpmScheduleDTOs;
	}
	
	@Transactional
	public AssetDocumentDTO uploadFile(AssetDocumentDTO assetDocumentDTO, MultipartFile file) {
		// TODO Auto-generated method stub
		Date uploadDate = new Date();
		Calendar cal = Calendar.getInstance();
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
		assetParameterReading.setActive(AssetParameterReading.ACTIVE_YES);
		Asset asset = assetRepository.findOne(assetParamReadingDTO.getAssetId());
		assetParameterReading.setAsset(asset);
		assetParameterReading = assetParamReadingRepository.save(assetParameterReading);
		assetParamReadingDTO = mapperUtil.toModel(assetParameterReading, AssetParameterReadingDTO.class);
		return assetParamReadingDTO;
	}

	public AssetParameterReadingDTO viewReadings(long id) {
		AssetParameterReading paramReading = assetParamReadingRepository.findOne(id);
		return mapperUtil.toModel(paramReading, AssetParameterReadingDTO.class);
	}

}
