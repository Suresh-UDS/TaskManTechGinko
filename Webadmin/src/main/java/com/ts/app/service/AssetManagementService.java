package com.ts.app.service;

import com.ts.app.domain.*;
import com.ts.app.repository.*;
import com.ts.app.service.util.*;
import com.ts.app.web.rest.dto.*;
import com.ts.app.web.rest.errors.TimesheetException;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FilenameUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.print.attribute.standard.PrinterState;

import java.io.Console;
import java.util.*;

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
	private NotificationRepository notificationRepository ;

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
	private ImportService importService;

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
	private AssetAMCRepository assetAmcScheduleRepository;

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
	private AmazonS3Utils s3ServiceUtils;

	@Inject
	private WarrantyTypeRepository warrantyTypeRepository;

	@Inject
	private AssetStatusHistoryRepository assetStatusHistoryRepository;

	@Inject
	private SchedulerConfigRepository schedulerConfigRepository;

	@Inject
	private ChecklistItemRepository checklistRespository;

	@Inject
	private AssetSiteHistoryRepository assetSiteHistoryRepository;

	@Inject
	private TicketManagementService ticketMgmtservice;

	public static final String EMAIL_NOTIFICATION_READING = "email.notification.reading";

	public static final String EMAIL_NOTIFICATION_READING_EMAILS = "email.notification.reading.emails";

	public static final String EMAIL_NOTIFICATION_ASSET = "email.notification.asset";

	public static final String EMAIL_NOTIFICATION_ASSET_EMAILS = "email.notification.asset.emails";

	@Value("${AWS.s3-cloudfront-url}")
	private String cloudFrontUrl;

	@Value("${AWS.s3-bucketEnv}")
	private String bucketEnv;

	@Value("${AWS.s3-asset-path}")
	private String assetFilePath;

	@Value("${AWS.s3-qrcode-path}")
	private String qrcodePath;

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

		//create status history
		if(!StringUtils.isEmpty(AssetStatus.valueOf(assetDTO.getStatus()).getStatus())) {
			AssetStatusHistory assetStatusHistory = new AssetStatusHistory();
			assetStatusHistory.setStatus(AssetStatus.valueOf(assetDTO.getStatus()).getStatus());
			assetStatusHistory.setActive("Y");
			assetStatusHistory.setAsset(asset);
			List<AssetStatusHistory> assetStatusHistoryList = new ArrayList<AssetStatusHistory>();
			assetStatusHistoryList.add(assetStatusHistory);
			asset.setAssetStatusHistory(assetStatusHistoryList);
		}

		asset.setActive(Asset.ACTIVE_YES);

		/*Calendar checkInDateFrom = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
        checkInDateFrom.setTime(assetDTO.getAcquiredDate());

        asset.setAcquiredDate(DateUtil.convertToSQLDate(DateUtil.convertUTCToIST(checkInDateFrom)));*/

		/*asset.setAcquiredDate(DateUtil.convertToSQLDate(assetDTO.getAcquiredDate()));*/
		asset = assetRepository.save(asset);

		//AssetStatusHistory assetStatusHistory = assetStatusHistoryRepository.findOne(asset.getAssetStatusHistory().getId());
		//assetStatusHistory.setAsset(asset);
		//assetStatusHistoryRepository.save(assetStatusHistory);

		//generate QR code if qr code is not already generated.
		if(asset != null && asset.getId() > 0 && !StringUtils.isEmpty(asset.getCode()) && StringUtils.isEmpty(asset.getQrCodeImage())) {
			generateAssetQRCode(asset.getId(), asset.getCode());
		}

		//create asset type if does not exist
//		if(!StringUtils.isEmpty(asset.getAssetType())) {
//			AssetType assetType = assetTypeRepository.findByName(asset.getAssetType());
//			if(assetType == null) {
//				assetType = new AssetType();
//				assetType.setName(asset.getAssetType());
//				assetType.setActive("Y");
//				assetType.setSite(asset.getSite());
//				assetTypeRepository.save(assetType);
//			}
//		}

		//create asset group if does not exist
//		if(!StringUtils.isEmpty(asset.getAssetGroup())) {
//			AssetGroup assetGroup = assetGroupRepository.findByName(asset.getAssetGroup());
//			if(assetGroup == null) {
//				assetGroup = new AssetGroup();
//				assetGroup.setAssetgroup(asset.getAssetGroup());
//				assetGroup.setActive("Y");
//				assetGroupRepository.save(assetGroup);
//			}
//		}

		//create asset warranty type if does not exist
		if(!StringUtils.isEmpty(asset.getWarrantyType())) {
			WarrantyType warrantyType = warrantyTypeRepository.findByName(asset.getWarrantyType());
			if(warrantyType == null) {
				warrantyType = new WarrantyType();
				warrantyType.setName(asset.getWarrantyType());
				warrantyType.setActive("Y");
				warrantyTypeRepository.save(warrantyType);
			}
		}

		//create site history
		if(assetDTO.getSiteId() > 0) {
			AssetSiteHistory assetSiteHistory = new AssetSiteHistory();
			assetSiteHistory.setSite(site);
			assetSiteHistory.setActive("Y");
			assetSiteHistory.setAsset(asset);
			List<AssetSiteHistory> assetSiteHistoryList = new ArrayList<AssetSiteHistory>();
			assetSiteHistoryList.add(assetSiteHistory);
			asset.setAssetSiteHistory(assetSiteHistoryList);
		}
		
		List<AssetTicketConfig> ticketConfigList = new ArrayList<AssetTicketConfig> ();
		
		for(int i=0; i < assetDTO.getCriticalStatusList().size(); i++) {
			
			assetDTO.getCriticalStatusList().get(i).setAsset(asset);
			AssetTicketConfig ticketConfig = mapperUtil.toEntity(assetDTO.getCriticalStatusList().get(i), AssetTicketConfig.class);
			ticketConfigList.add(ticketConfig);
			
		}
		
		asset.setAssetTicketConfigList(ticketConfigList);
		
		List<ParameterConfig> parameterConfigs = parameterConfigRepository.findAllByAssetType(assetDTO.getAssetType());
		if(CollectionUtils.isNotEmpty(parameterConfigs)) {
			List<AssetParameterConfig> assetParamConfigs = new ArrayList<AssetParameterConfig>();
			for(ParameterConfig parameterConfig : parameterConfigs) {
				AssetParameterConfig assetParamConfig = new AssetParameterConfig();
				assetParamConfig.setActive("Y");
				assetParamConfig.setAsset(asset);
				assetParamConfig.setAssetType(assetDTO.getAssetType());
				assetParamConfig.setAlertRequired(parameterConfig.isAlertRequired());
				assetParamConfig.setRule(parameterConfig.getRule());
				assetParamConfig.setThreshold(parameterConfig.getThreshold());
				assetParamConfig.setConsumptionMonitoringRequired(parameterConfig.isConsumptionMonitoringRequired());
				assetParamConfig.setName(parameterConfig.getName());
				assetParamConfig.setUom(parameterConfig.getUom());
				assetParamConfigs.add(assetParamConfig);
			}
			assetParamConfigRepository.save(assetParamConfigs);
		}
		
		assetDTO.setId(asset.getId());
		return assetDTO;

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
	    java.sql.Date startDate = DateUtil.convertToSQLDate(assetPpmScheduleDTO.getStartDate());
		List<AssetPPMSchedule> assetPPMSchedule = assetPpmScheduleRepository.findAssetPPMScheduleByTitle(assetPpmScheduleDTO.getAssetId(),
																assetPpmScheduleDTO.getTitle(), MaintenanceType.PPM.getValue(), startDate,
																assetPpmScheduleDTO.getJobStartTime(), assetPpmScheduleDTO.getJobStartTime());
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
	
	private void arrangeAssetHierarichy(List<Asset> assetList) {
		
		if(assetList != null) {
		
			for(int i=0;i<assetList.size();i++) {
				
				//if(assetList.get(i).getParentAsset()!=null) assetList.get(i).setParentAsset(null);
				
				arrangeAssetHierarichy(assetList.get(i).getAssets());
				
			}
			
		}
		
	}
	
	private void arrangeAssetGroupHierarichy(List<AssetGroup> assetGroupList) {
		
		if(assetGroupList != null) {
		
			for(int i=0;i<assetGroupList.size();i++) {
				
				arrangeAssetGroupHierarichy(assetGroupList.get(i).getAssetGroup());
				
			}
			
		}
		
	}


	public List<AssetGroup> getSiteAssetGroupHierarchy(long siteId){
		
		List<AssetGroup> assetGroupList = assetGroupRepository.findBySiteIdAndActiveAndParentGroup(siteId,"Y",null); 
		
		arrangeAssetGroupHierarichy(assetGroupList);
		
		return assetGroupList;
		
	}
	
	public List<Asset> getSiteAssetHierarchy(long siteId,long typeId){
		
		AssetType assetType = assetTypeRepository.findById(typeId);
		
		if(assetType == null) {
			
			return null;
			
		}
		
		List<Asset> assetList= assetRepository.findBySiteIdAndAssetTypeAndActiveAndParentAsset(siteId, assetType.getName(), "Y", null);
		
		arrangeAssetHierarichy(assetList);
		
		return assetList;
		
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

		//update status history
		if(!StringUtils.isEmpty(assetDTO.getStatus())
				&& !assetDTO.getStatus().equalsIgnoreCase(asset.getStatus())) {
			AssetStatusHistory assetStatusHistory = new AssetStatusHistory();
			assetStatusHistory.setStatus(AssetStatus.valueOf(assetDTO.getStatus()).getStatus());
			assetStatusHistory.setActive("Y");
			assetStatusHistory.setAsset(asset);
			List<AssetStatusHistory> assetStatusHistoryList = asset.getAssetStatusHistory();
			if(CollectionUtils.isEmpty(assetStatusHistoryList)) {
				assetStatusHistoryList = new ArrayList<AssetStatusHistory>();
				assetStatusHistoryList.add(assetStatusHistory);
				asset.setAssetStatusHistory(assetStatusHistoryList);
			}else {
				assetStatusHistoryList.add(assetStatusHistory);
			}

		}

		asset.setAssetGroup(assetDTO.getAssetGroup());
		asset.setDescription(assetDTO.getDescription());
		//update site history
		Hibernate.initialize(asset.getSite());
		Site currSite = asset.getSite();
		if (assetDTO.getSiteId() != currSite.getId()) {
			Site site = getSite(assetDTO.getSiteId());
			asset.setSite(site);
			AssetSiteHistory assetSiteHistory = new AssetSiteHistory();
			assetSiteHistory.setSite(site);
			assetSiteHistory.setActive("Y");
			assetSiteHistory.setAsset(asset);
			List<AssetSiteHistory> assetSiteHistoryList = asset.getAssetSiteHistory();
			if(CollectionUtils.isEmpty(assetSiteHistoryList)) {
				assetSiteHistoryList = new ArrayList<AssetSiteHistory>();
				assetSiteHistoryList.add(assetSiteHistory);
				asset.setAssetSiteHistory(assetSiteHistoryList);
			}else {
				assetSiteHistoryList.add(assetSiteHistory);
			}

			//update asset scheduler config with new site info
			List<SchedulerConfig> schedules = schedulerConfigRepository.findAssetSchedule(assetDTO.getId());
			if(CollectionUtils.isNotEmpty(schedules)) {
				for(SchedulerConfig config : schedules) {
					String configData = config.getData();
					String siteIdParam = "&siteId=";
					String siteIdConfig = siteIdParam + currSite.getId();
					int startInd = configData.indexOf(siteIdConfig);
					StringBuilder sb = new StringBuilder(configData);
					sb = sb.replace(startInd, startInd + siteIdConfig.length(), siteIdParam + site.getId());
					config.setData(sb.toString());
				}
				schedulerConfigRepository.save(schedules);
			}

			//update asset jobs
			Calendar currDate = Calendar.getInstance();
			List<Job> jobList = jobRepository.findByAssetAndStartDate(assetDTO.getId(), DateUtil.convertToSQLDate(currDate.getTime()));
			if(CollectionUtils.isNotEmpty(jobList)) {
				for(Job job : jobList) {
					job.setSite(site);
					if(job.getParentJob() != null) {
						job.getParentJob().setSite(site);
					}
				}
				jobRepository.save(jobList);
			}


		}
		if (assetDTO.getManufacturerId() > 0) {
			Manufacturer manufacturer = getManufacturer(assetDTO.getManufacturerId());
			asset.setManufacturer(manufacturer);
		}
		if (assetDTO.getVendorId() > 0) {
			Vendor vendor = getVendor(assetDTO.getVendorId());
			asset.setAmcVendor(vendor);
		}
		asset.setStatus(AssetStatus.valueOf(assetDTO.getStatus()).getStatus());
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

		if(assetDTO.getStatus().equalsIgnoreCase(AssetStatus.BREAKDOWN.getStatus())) {

			Date date = new Date();

			Asset assetEntity = assetRepository.findOne(assetDTO.getId());
			String assetCode = assetEntity.getCode();
			Site site = siteRepository.findOne(assetEntity.getSite().getId());

			String siteName = site.getName();

			User user = userRepository.findOne(assetDTO.getUserId());
			log.debug(">>> user <<<"+ user.getFirstName() +" and "+user.getId());
//			Employee employee = user.getEmployee();

			TicketDTO ticketDto = new TicketDTO();
			ticketDto.setAssetId(assetEntity.getId());
			ticketDto.setActive(Ticket.ACTIVE_YES);
			ticketDto.setTitle("ASSET -" + assetDTO.getStatus() + " - "+ assetCode);
			ticketDto.setSiteId(site.getId());
			ticketDto.setUserId(user.getId());
			ticketDto.setSeverity("High");
			ticketDto.setCategory("MAINTENANCE");
			ticketDto.setDescription("ASSET -" +assetDTO.getStatus() + " by " + user.getFirstName());
			ticketMgmtservice.saveTicket(ticketDto);

			List<Setting> settingList = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_ASSET, site.getId());

			log.debug("Setting Email list -" + settingList.size());

			if(CollectionUtils.isNotEmpty(settingList)) {

				for(Setting setting : settingList) {

					if(setting.getSettingValue().equalsIgnoreCase("true") ) {

						List<Setting> settingEntities = settingRepository.findSettingByKeyAndSiteId(EMAIL_NOTIFICATION_ASSET_EMAILS, site.getId());

						if(CollectionUtils.isNotEmpty(settingEntities)) {

							for(Setting settingEntity : settingEntities) {

								List<String> emailLists = CommonUtil.convertToList(settingEntity.getSettingValue(), ",");

								for(String email : emailLists) {
									mailService.sendAssetBreakdownAlert(email, assetEntity.getTitle(), siteName, assetCode, user.getFirstName(), date);
								}
							}

						} else {

							log.info("There is no email ids registered");
						}
					}
				}
			}
		}
	}

	public AssetDTO updateAsset(AssetDTO assetDTO) {
		Asset asset = assetRepository.findOne(assetDTO.getId());
		mapToEntityAssets(assetDTO, asset);
		asset = assetRepository.save(asset);
		
		if(asset.getAssetTicketConfigList()!=null) {
			
			for(AssetTicketConfig tConfig : asset.getAssetTicketConfigList()) {
				
				asset.getAssetTicketConfigList().remove(tConfig);
				
			}
			
		}
		
		List<AssetTicketConfig> ticketConfigList = new ArrayList<AssetTicketConfig> ();
		
		for(int i=0; i < assetDTO.getCriticalStatusList().size(); i++) {
			
			assetDTO.getCriticalStatusList().get(i).setAsset(asset);
			AssetTicketConfig ticketConfig = mapperUtil.toEntity(assetDTO.getCriticalStatusList().get(i), AssetTicketConfig.class);
			ticketConfigList.add(ticketConfig);
			
		}
		
		asset.setAssetTicketConfigList(ticketConfigList);

		return mapperUtil.toModel(asset, AssetDTO.class);
		
	}

	public void deleteAsset(Long id) {
		log.debug(">>> Inside Asset Delete Service");	
		Asset asset = assetRepository.findOne(id);
		asset.setActive(Asset.ACTIVE_NO);
		assetRepository.save(asset);
	}

	public Map<String, Object> generateAssetQRCode(long assetId, String assetCode) {
		Asset asset = assetRepository.findOne(assetId);
		long siteId = asset.getSite().getId();
		String code = String.valueOf(siteId)+"_"+assetCode;
		asset.setCode(code);
		assetRepository.save(asset);
		byte[] qrCodeImage = null;
		Map<String, Object> qrCodeObject = new HashMap<>();
//		String qrCodeBase64 = null;
		AssetDTO assetDTO = new AssetDTO();
		if (asset != null) {
			String codeName = String.valueOf(asset.getCode());
			qrCodeImage = QRCodeUtil.generateQRCode(codeName);
			String qrCodePath = env.getProperty("AWS.s3-qrcode-path");
			if (org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
				assetDTO = s3ServiceUtils.uploadQrCodeFile(code, qrCodeImage, assetDTO);
				qrCodeObject.put("code", code);
				qrCodeObject.put("url", assetDTO.getUrl());
				qrCodeObject.put("imageName", assetDTO.getQrCodeImage());
				asset.setQrCodeImage(assetDTO.getQrCodeImage());
				assetRepository.save(asset);
			}
//			if (qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
//				qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
//			}
	}
		log.debug("*****************"+ asset.getId());
		return qrCodeObject;
	}

	public Map<String, Object> getQRCode(long assetId) {
		log.debug(">>> get QR Code <<<");
//		AssetDTO assetDTO = new AssetDTO();
		Map<String, Object> hm = new HashMap<>();
		Asset asset = assetRepository.findOne(assetId);
//		String qrCodeBase64 = null;
		String imageFileUrl = "" ;
		String assetcode = asset.getCode();
		if (asset != null) {
			imageFileUrl = cloudFrontUrl + bucketEnv + qrcodePath + asset.getQrCodeImage();
			if (org.apache.commons.lang3.StringUtils.isNotBlank(imageFileUrl)) {
				hm.put("code", assetcode);
				hm.put("url", imageFileUrl);
			}
		}
//		qrCodeBase64 = qrCodeBase64 + "." + assetcode;
		return hm;
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
		//assetAMC.setMaintenanceType(MaintenanceType.AMC.getValue());

		if(assetAMCScheduleDTO.getChecklistId() > 0) {
			Checklist checklist = checklistRepository.findOne(assetAMCScheduleDTO.getChecklistId());
			assetAMC.setChecklist(checklist);
		}else {
			assetAMC.setChecklist(null);
		}

		if(assetAMCScheduleDTO.getEmpId() > 0) {
			Employee employee = employeeRepository.findOne(assetAMCScheduleDTO.getEmpId());
			assetAMCScheduleDTO.setEmployeeName(employee.getName());
		}
		Asset asset = assetRepository.findOne(assetAMCScheduleDTO.getAssetId());
		assetAMC.setAsset(asset);
		assetAMC.setActive(AssetAMCSchedule.ACTIVE_YES);

		List<AssetAMCSchedule> existingSchedules = assetRepository.findAssetAMCScheduleByTitle(asset.getId(), assetAMCScheduleDTO.getTitle());
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
		List<AssetAMCSchedule> assetAMCSchedules = assetAMCRepository.findAssetAMCScheduleByAssetId(assetId);
		if (CollectionUtils.isNotEmpty(assetAMCSchedules)) {
			assetAMCScheduleDTOs = mapperUtil.toModelList(assetAMCSchedules, AssetAMCScheduleDTO.class);
			for(AssetAMCScheduleDTO assetAMC : assetAMCScheduleDTOs) {
				Employee employee = employeeRepository.findOne(assetAMC.getEmpId());
				assetAMC.setEmployeeName(employee.getName());
				if(assetAMC.getChecklistId() > 0) {
					List<ChecklistItem> checkList = checklistRespository.findByChecklistId(assetAMC.getChecklistId());
					List<ChecklistItemDTO> cheklistItemDTO = mapperUtil.toModelList(checkList, ChecklistItemDTO.class);
					assetAMC.setCheckListItems(cheklistItemDTO);
				}
			}
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
			for(AssetPpmScheduleDTO assetPPM : assetPpmScheduleDTOs) {
				Employee employee = employeeRepository.findOne(assetPPM.getEmpId());
				assetPPM.setEmployeeName(employee.getName());
				if(assetPPM.getChecklistId() > 0) {
					List<ChecklistItem> checkList = checklistRespository.findByChecklistId(assetPPM.getChecklistId());
					List<ChecklistItemDTO> cheklistItemDTO = mapperUtil.toModelList(checkList, ChecklistItemDTO.class);
					assetPPM.setCheckListItems(cheklistItemDTO);
				}
			}
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
			List<AssetScheduleEventDTO> eventDTOs = new ArrayList<AssetScheduleEventDTO>();
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
				List<AssetScheduleEventDTO> assetPPMSchedules = getAssetPPMScheduleCalendar(asset.getId(), startCal.getTime(), endCal.getTime());
				if(CollectionUtils.isNotEmpty(assetPPMSchedules)) {
					eventDTOs.addAll(assetPPMSchedules);
				}
				List<AssetScheduleEventDTO> assetAMCSchedules = getAssetAMCScheduleCalendar(asset.getId(), startCal.getTime(), endCal.getTime());
				if(CollectionUtils.isNotEmpty(assetAMCSchedules)) {
					eventDTOs.addAll(assetAMCSchedules);
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
	public List<AssetScheduleEventDTO> getAssetPPMScheduleCalendar(long assetId, Date startDate, Date endDate) {

		List<AssetScheduleEventDTO> assetPPMScheduleEventDTOs = null;
		String type = MaintenanceType.valueOf("PPM").getValue();
		List<AssetPPMSchedule> assetPpmSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByAssetId(assetId, type);
		if (CollectionUtils.isNotEmpty(assetPpmSchedules)) {
			assetPPMScheduleEventDTOs = new ArrayList<AssetScheduleEventDTO>();

			Calendar lastDate = Calendar.getInstance();
			if(endDate == null) {
				lastDate.add(Calendar.DAY_OF_MONTH,  lastDate.getMaximum(Calendar.DAY_OF_MONTH));
			}else {
				lastDate.setTime(endDate);
			}
			lastDate.set(Calendar.HOUR_OF_DAY, 23);
			lastDate.set(Calendar.MINUTE, 59);

			for(AssetPPMSchedule ppmSchedule : assetPpmSchedules) {
				Calendar currCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
				currCal.setTime(startDate);
				currCal.set(Calendar.HOUR_OF_DAY, 0);
				currCal.set(Calendar.MINUTE, 0);
				Date schStartDate = ppmSchedule.getStartDate();
				Date schEndDate = ppmSchedule.getEndDate();
				Calendar schStartCal = Calendar.getInstance();
				schStartCal.setTime(schStartDate);
				Calendar schEndCal = Calendar.getInstance();
				schEndCal.setTime(schEndDate);
				if(schStartCal.after(currCal)) {
					currCal.setTime(schStartCal.getTime());
				}
				
				int i=0;
				
				while(((currCal.after(schStartCal) || schStartCal.equals(currCal)) || !schStartCal.after(lastDate)) && !currCal.after(schEndCal) && !currCal.after(lastDate)) { //if ppm schedule starts before current date and not after the last date of the month.
									
					AssetScheduleEventDTO assetPPMScheduleEvent = new AssetScheduleEventDTO();
					assetPPMScheduleEvent.setId(ppmSchedule.getId());
					assetPPMScheduleEvent.setTitle(ppmSchedule.getTitle());
					Asset asset = ppmSchedule.getAsset();
					assetPPMScheduleEvent.setAssetId(asset.getId());
					assetPPMScheduleEvent.setAssetTitle(asset.getTitle());
					assetPPMScheduleEvent.setAssetCode(asset.getCode());
					assetPPMScheduleEvent.setFrequency(ppmSchedule.getFrequency());
					assetPPMScheduleEvent.setFrequencyDuration(ppmSchedule.getFrequencyDuration());
					assetPPMScheduleEvent.setFrequencyPrefix(ppmSchedule.getFrequencyPrefix());
//					currCal.add(Calendar.MILLISECOND, TimeZone.getTimeZone("Asia/Kolkata").getRawOffset());
					assetPPMScheduleEvent.setStart(currCal.getTime());
					assetPPMScheduleEvent.setAllDay(true);
					if(currCal.get(Calendar.WEEK_OF_YEAR)>i) {						
						if(currCal.get(Calendar.WEEK_OF_YEAR)>53)
							break;						
					    assetPPMScheduleEvent.setWeek(currCal.get(Calendar.WEEK_OF_YEAR));
					    i=currCal.get(Calendar.WEEK_OF_YEAR);
					}
					else {
						if((currCal.get(Calendar.WEEK_OF_YEAR)+i)>53)
							break;
						assetPPMScheduleEvent.setWeek(currCal.get(Calendar.WEEK_OF_YEAR)+i);	
						}
					
					assetPPMScheduleEvent.setMaintenanceType(MaintenanceType.PPM.name());
					assetPPMScheduleEventDTOs.add(assetPPMScheduleEvent);
					addDays(currCal, ppmSchedule.getFrequency(), ppmSchedule.getFrequencyDuration());
				}
			}
		}
		return assetPPMScheduleEventDTOs;
	}

	/**
	 * Returns a list of asset AMC schedule events for the given asset Id and date range.
	 *
	 * @param assetId
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<AssetScheduleEventDTO> getAssetAMCScheduleCalendar(long assetId, Date startDate, Date endDate) {
		List<AssetScheduleEventDTO> assetScheduleEventDTOs = null;
		List<AssetAMCSchedule> assetAMCSchedules = assetAmcScheduleRepository.findAssetAMCScheduleByAssetId(assetId);
		if (CollectionUtils.isNotEmpty(assetAMCSchedules)) {
			assetScheduleEventDTOs = new ArrayList<AssetScheduleEventDTO>();

			Calendar lastDate = Calendar.getInstance();
			if(endDate == null) {
				lastDate.add(Calendar.DAY_OF_MONTH,  lastDate.getMaximum(Calendar.DAY_OF_MONTH));
			}else {
				lastDate.setTime(endDate);
			}
			lastDate.set(Calendar.HOUR_OF_DAY, 23);
			lastDate.set(Calendar.MINUTE, 59);

			for(AssetAMCSchedule amcSchedule : assetAMCSchedules) {
				Calendar currCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
				currCal.setTime(startDate);
				currCal.set(Calendar.HOUR_OF_DAY, 0);
				currCal.set(Calendar.MINUTE, 0);
				Date schStartDate = amcSchedule.getStartDate();
				Date schEndDate = amcSchedule.getEndDate();
				Calendar schStartCal = Calendar.getInstance();
				schStartCal.setTime(schStartDate);
				Calendar schEndCal = Calendar.getInstance();
				schEndCal.setTime(schEndDate);
				if(schStartCal.after(currCal)) {
					currCal.setTime(schStartCal.getTime());
				}
				while(((currCal.after(schStartCal) || schStartCal.equals(currCal)) || !schStartCal.after(lastDate)) && !currCal.after(schEndCal) && !currCal.after(lastDate)) { //if AMC schedule starts before current date and not after the last date of the month.
					AssetScheduleEventDTO assetAMCScheduleEvent = new AssetScheduleEventDTO();
					assetAMCScheduleEvent.setId(amcSchedule.getId());
					assetAMCScheduleEvent.setTitle(amcSchedule.getTitle());
					Asset asset = amcSchedule.getAsset();
					assetAMCScheduleEvent.setAssetId(asset.getId());
					assetAMCScheduleEvent.setAssetTitle(asset.getTitle());
					assetAMCScheduleEvent.setAssetCode(asset.getCode());
					assetAMCScheduleEvent.setFrequency(amcSchedule.getFrequency());
					assetAMCScheduleEvent.setFrequencyDuration(amcSchedule.getFrequencyDuration());
					assetAMCScheduleEvent.setFrequencyPrefix(amcSchedule.getFrequencyPrefix());
					currCal.add(Calendar.MILLISECOND, TimeZone.getTimeZone("Asia/Kolkata").getRawOffset());
					assetAMCScheduleEvent.setStart(currCal.getTime());
					assetAMCScheduleEvent.setAllDay(true);
					assetAMCScheduleEvent.setWeek(currCal.get(Calendar.WEEK_OF_YEAR));
					assetAMCScheduleEvent.setMaintenanceType(MaintenanceType.AMC.name());
					assetScheduleEventDTOs.add(assetAMCScheduleEvent);
					addDays(currCal, amcSchedule.getFrequency(), amcSchedule.getFrequencyDuration());
				}
			}
		}
		return assetScheduleEventDTOs;
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
	
	public List<AssetDTO> getAssetHierarichy(SearchCriteria searchCriteria){
		
		List<AssetDTO> assetList = null;
		
		return assetList;
		
	}

	public SearchResult<AssetDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

		// -------
		SearchResult<AssetDTO> result = new SearchResult<AssetDTO>();
		User user = userRepository.findOne(searchCriteria.getUserId());
		log.debug(">>> user <<<"+ user.getFirstName() +" and "+user.getId());
		Employee employee = user.getEmployee();
		log.debug(">>> user <<<"+ employee.getFullName() +" and "+employee.getId());
		List<EmployeeProjectSite> sites = employee.getProjectSites();

		if (searchCriteria != null) {

			List<Long> siteIds = new ArrayList<Long>();
			if(employee != null && !user.isAdmin()) {
				for (EmployeeProjectSite site : sites) {
					siteIds.add(site.getSite().getId());
					searchCriteria.setSiteIds(siteIds);
				}
			}else if(user.isAdmin()){
				searchCriteria.setAdmin(true);
			}

			Pageable pageRequest = null;
			if (!StringUtils.isEmpty(searchCriteria.getColumnName())) {
				Sort sort = new Sort(searchCriteria.isSortByAsc() ? Sort.Direction.ASC : Sort.Direction.DESC, searchCriteria.getColumnName());
				log.debug("Sorting object" + sort);
				pageRequest = createPageSort(searchCriteria.getCurrPage(), searchCriteria.getSort(), sort);
				if (searchCriteria.isReport()) {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), Integer.MAX_VALUE, sort);
				} else {
					pageRequest = createPageSort(searchCriteria.getCurrPage(), PagingUtil.PAGE_SIZE, sort);
				}
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

			if(!searchCriteria.isConsolidated()) {
				log.debug(">>> inside search consolidate <<<");
    			page = assetRepository.findAll(new AssetSpecification(searchCriteria,true),pageRequest);
    			allAssetsList.addAll(page.getContent());
    		}

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
		return importService.importAssetData(file, dateTime, false, false);
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = null;
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
		}
		return er;
	}

	public ImportResult importPPMFile(MultipartFile file, long dateTime) {
		return importService.importAssetData(file, dateTime,true, false);
	}

	public ImportResult getImportPPMStatus(String fileId) {
		ImportResult er = null;
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
		}
		return er;
	}

	public ImportResult importAMCFile(MultipartFile file, long dateTime) {
		return importService.importAssetData(file, dateTime, false, true);
	}

	public ImportResult getImportAMCStatus(String fileId) {
		ImportResult er = null;
		// fileId += ".csv";
		if (!StringUtils.isEmpty(fileId)) {
			er = importUtil.getImportResult(fileId);
			//er.setFile(fileId);
			//er.setStatus(status);
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
		AssetGroup existingGroup = assetGroupRepository.findByName(assetGroupDTO.getAssetgroup());
		if(existingGroup == null) {
			assetgroup.setActive(AssetGroup.ACTIVE_YES);
			assetgroup.setAssetGroupCode(assetGroupDTO.getAssetGroupCode());
			assetgroup.setParentGroup(assetGroupDTO.getParentGeroup());
			assetGroupRepository.save(assetgroup);
			assetGroupDTO = mapperUtil.toModel(assetgroup, AssetgroupDTO.class);
		}else {
			assetGroupDTO.setErrorMessage("Already same asset group exists.");
			assetGroupDTO.setStatus("400");
			assetGroupDTO.setErrorStatus(true);
		}
		return assetGroupDTO;

	}

	public List<AssetgroupDTO> findAllAssetGroups() {
		List<AssetGroup> assetgroup = assetGroupRepository.findAll();
		return mapperUtil.toModelList(assetgroup, AssetgroupDTO.class);
	}

//	Asset status
	public AssetStatus[] getAssetStatus(){
		log.info("Assetstatus service");
		AssetStatus[] status = AssetStatus.values();
		return status;
	}
//

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
		log.debug("asset ppm schedule checklist Id - "+assetPpmScheduleDTO.getChecklistId());
		if(assetPpmScheduleDTO.getChecklistId() > 0) {
			Checklist checklist = checklistRepository.findOne(assetPpmScheduleDTO.getChecklistId());
			assetPPMSchedule.setChecklist(checklist);
		}else {
			assetPPMSchedule.setChecklist(null);
		}
		if(assetPpmScheduleDTO.getEmpId() > 0) {
			Employee employee = employeeRepository.findOne(assetPpmScheduleDTO.getEmpId());
			assetPPMSchedule.setEmployeeName(employee.getName());
		}
		Asset asset = assetRepository.findOne(assetPpmScheduleDTO.getAssetId());
		assetPPMSchedule.setAsset(asset);
		assetPPMSchedule.setActive(AssetPPMSchedule.ACTIVE_YES);

		List<AssetPPMSchedule> assetPPMSchedules = assetPpmScheduleRepository.findAssetPPMScheduleByTitle(asset.getId(), assetPpmScheduleDTO.getTitle(),
										MaintenanceType.PPM.getValue(), assetPPMSchedule.getStartDate(), assetPPMSchedule.getJobStartTime(), assetPPMSchedule.getJobStartTime());
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
		Asset assetEntity = assetRepository.findOne(assetDocumentDTO.getAssetId());
		String assetCode = assetEntity.getCode();
		assetDocumentDTO = s3ServiceUtils.uploadAssetFile(assetCode, file, assetDocumentDTO);
		assetDocumentDTO.setFile(assetDocumentDTO.getFile());
		assetDocumentDTO.setUploadedDate(uploadDate);
		assetDocumentDTO.setTitle(assetDocumentDTO.getTitle());
		AssetDocument assetDocument = mapperUtil.toEntity(assetDocumentDTO, AssetDocument.class);
		assetDocument.setActive(AssetDocument.ACTIVE_YES);
		assetDocument = assetDocumentRepository.save(assetDocument);
//		assetDocumentDTO = mapperUtil.toModel(assetDocument, AssetDocumentDTO.class);
		assetDocumentDTO.setUrl(assetDocumentDTO.getUrl());
		return assetDocumentDTO;
	}

	public List<AssetDocumentDTO> findAllDocuments(String type, Long assetId) {
		// TODO Auto-generated method stub
		List<AssetDocument> assetDocument = assetDocumentRepository.findAllByType(type, assetId);
		List<AssetDocumentDTO> assetDocumentDTO = mapperUtil.toModelList(assetDocument, AssetDocumentDTO.class);
		for(AssetDocumentDTO assetDoc : assetDocumentDTO) {
			String extension = FilenameUtils.getExtension(assetDoc.getFile());
			assetDoc.setUrl(cloudFrontUrl + bucketEnv + assetFilePath + assetDoc.getFile());
			assetDoc.setExtension(extension);
		}
		return assetDocumentDTO;
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

	public SearchResult<AssetParameterReadingDTO> viewAssetReadings(SearchCriteria searchCriteria) {
		SearchResult<AssetParameterReadingDTO> result = new SearchResult<AssetParameterReadingDTO>();

		Pageable pageRequest = null;
		if(searchCriteria != null) {
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

			Page<AssetParameterReading> page = null;
			List<AssetParameterReading> allAssetsList = new ArrayList<AssetParameterReading>();
			List<AssetParameterReadingDTO> transactions = null;

			if(searchCriteria.getReadingFromDate() != null && searchCriteria.getReadingToDate() != null) {
				page = assetRepository.findAssetReadingByDate(searchCriteria.getAssetId(), searchCriteria.getReadingFromDate(), searchCriteria.getReadingToDate(), pageRequest);
			}else if(searchCriteria.getParamName() != null && searchCriteria.getAssetId() > 0){
				page = assetRepository.findReadingByName(searchCriteria.getParamName(), searchCriteria.getAssetId(), pageRequest);
			}else {
				page = assetRepository.findByAssetReading(searchCriteria.getAssetId(), pageRequest);
			}

			allAssetsList.addAll(page.getContent());

			if(CollectionUtils.isNotEmpty(allAssetsList)) {
				if(transactions == null) {
					transactions = new ArrayList<AssetParameterReadingDTO>();
				}
	        		for(AssetParameterReading assetReading : allAssetsList) {
	        			transactions.add(mapperUtil.toModel(assetReading, AssetParameterReadingDTO.class));
	        		}
				buildSearchResultReading(searchCriteria, page, transactions,result);
			}
		}

		return result;
	}

	private void buildSearchResultReading(SearchCriteria searchCriteria, Page<AssetParameterReading> page,
                                          List<AssetParameterReadingDTO> transactions, SearchResult<AssetParameterReadingDTO> result) {
		// TODO Auto-generated method stub
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

	public AssetParameterReadingDTO getLatestParamReading(long assetId, long assetParamId) {
		List<AssetParameterReading> assetParamReadings = assetRepository.findAssetReadingById(assetId, assetParamId);
		AssetParameterReading assetLatestParamReading = null;
		if(CollectionUtils.isNotEmpty(assetParamReadings)) {
			assetLatestParamReading = assetParamReadings.get(0);
		}
		return mapperUtil.toModel(assetLatestParamReading, AssetParameterReadingDTO.class);
	}

	@Transactional
    public String deleteImages(long id) {
		AssetDocument assetDocumentEntity = assetDocumentRepository.findOne(id);
		String file = assetDocumentEntity.getFile();
		String keyObject = bucketEnv + assetFilePath;
		String fileName = s3ServiceUtils.deleteAssetFile(keyObject, file);
		log.info("The " + fileName + " was deleted successfully.");
		assetDocumentRepository.delete(id);
		return "The " + fileName + " was deleted successfully.";
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

	public List<Object> findAllAssetQrcode(long[] qrCodeObj) {
		List<Object> collect = new ArrayList<>();
		for(long assetId :  qrCodeObj) {
			Map<String, Object> qrCodeList = new HashMap<>();
			Asset assetEntity = assetRepository.findOne(assetId);
			AssetDTO assetModel = mapperUtil.toModel(assetEntity, AssetDTO.class);
			qrCodeList.put("code", assetModel.getCode());
			qrCodeList.put("type", assetModel.getAssetType());
			qrCodeList.put("url", cloudFrontUrl + bucketEnv + qrcodePath + assetModel.getQrCodeImage());
			qrCodeList.put("group", assetModel.getAssetGroup());
			qrCodeList.put("title", assetModel.getTitle());
			qrCodeList.put("status", assetModel.getStatus());
			qrCodeList.put("acquireDate", assetModel.getAcquiredDate());
			qrCodeList.put("siteName", assetModel.getSiteName());
			qrCodeList.put("manufacturerName", assetModel.getManufacturerName());
			qrCodeList.put("vendorName", assetModel.getAmcVendorName());
			collect.add(qrCodeList);
		}
		return collect;
	}

	public List<Object> findAllQrcodes(long siteId) {
		// TODO Auto-generated method stub
		List<Object> collect = new ArrayList<>();
		List<Asset> assetEntities = assetRepository.findAssetBySiteId(siteId);
		List<AssetDTO> assetModel = mapperUtil.toModelList(assetEntities, AssetDTO.class);
		for(AssetDTO assetEntity : assetModel) {
			Map<String, Object> qrCodeLists = new HashMap<>();
			qrCodeLists.put("code", assetEntity.getCode());
			qrCodeLists.put("type", assetEntity.getAssetType());
			qrCodeLists.put("url", cloudFrontUrl + bucketEnv + qrcodePath + assetEntity.getQrCodeImage());
			qrCodeLists.put("group", assetEntity.getAssetGroup());
			qrCodeLists.put("title", assetEntity.getTitle());
			qrCodeLists.put("status", assetEntity.getStatus());
			qrCodeLists.put("acquireDate", assetEntity.getAcquiredDate());
			qrCodeLists.put("siteName", assetEntity.getSiteName());
			qrCodeLists.put("manufacturerName", assetEntity.getManufacturerName());
			qrCodeLists.put("vendorName", assetEntity.getAmcVendorName());
			collect.add(qrCodeLists);
		}
		return collect;
	}

	public SearchResult<AssetStatusHistoryDTO> viewAssetStatusHistory(SearchCriteria searchCriteria) {
		// TODO Auto-generated method stub

		SearchResult<AssetStatusHistoryDTO> result = new SearchResult<AssetStatusHistoryDTO>();

		Pageable pageRequest = null;
		if(searchCriteria != null) {

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

			Page<AssetStatusHistory> page = null;
			List<AssetStatusHistory> allStatusList = new ArrayList<AssetStatusHistory>();
			List<AssetStatusHistoryDTO> transactions = null;

			if(searchCriteria.getAssetId() > 0) {
				page = assetStatusHistoryRepository.findByAssetId(searchCriteria.getAssetId(), pageRequest);
			}

			allStatusList.addAll(page.getContent());

			if(CollectionUtils.isNotEmpty(allStatusList)) {
				if(transactions == null) {
					transactions = new ArrayList<AssetStatusHistoryDTO>();
				}
	        		for(AssetStatusHistory assetStatus : allStatusList) {
	        			transactions.add(mapperUtil.toModel(assetStatus, AssetStatusHistoryDTO.class));
	        		}
				buildSearchResultStatus(searchCriteria, page, transactions,result);
			}
		}

		return result;

	}

	private void buildSearchResultStatus(SearchCriteria searchCriteria, Page<AssetStatusHistory> page,
                                         List<AssetStatusHistoryDTO> transactions, SearchResult<AssetStatusHistoryDTO> result) {
		// TODO Auto-generated method stub
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

	public SearchResult<AssetSiteHistoryDTO> viewAssetSiteHistory(SearchCriteria searchCriteria) {
		// TODO Auto-generated method stub
		SearchResult<AssetSiteHistoryDTO> result = new SearchResult<AssetSiteHistoryDTO>();

		Pageable pageRequest = null;
		if(searchCriteria != null) {

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

			Page<AssetSiteHistory> page = null;
			List<AssetSiteHistory> allSitesList = new ArrayList<AssetSiteHistory>();
			List<AssetSiteHistoryDTO> transactions = null;

			if(searchCriteria.getAssetId() > 0 && searchCriteria.getSiteId() > 0) {
				page = assetSiteHistoryRepository.findBySiteId(searchCriteria.getSiteId(), searchCriteria.getAssetId(), pageRequest);
			}else {
				page = assetSiteHistoryRepository.findByAssetId(searchCriteria.getAssetId(), pageRequest);
			}

			allSitesList.addAll(page.getContent());

			if(CollectionUtils.isNotEmpty(allSitesList)) {
				if(transactions == null) {
					transactions = new ArrayList<AssetSiteHistoryDTO>();
				}
	        		for(AssetSiteHistory assetSites : allSitesList) {
	        			transactions.add(mapperUtil.toModel(assetSites, AssetSiteHistoryDTO.class));
	        		}
				buildResultAssetSite(searchCriteria, page, transactions,result);
			}
		}

		return result;
	}

	private void buildResultAssetSite(SearchCriteria searchCriteria, Page<AssetSiteHistory> page,
                                      List<AssetSiteHistoryDTO> transactions, SearchResult<AssetSiteHistoryDTO> result) {
		// TODO Auto-generated method stub
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


    public SearchResult<TicketDTO> getAssetTickets(SearchCriteria searchCriteria) {
        // TODO Auto-generated method stub
        SearchResult<TicketDTO> result = new SearchResult<TicketDTO>();

        Pageable pageRequest = null;
        if(searchCriteria != null) {

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

            Page<Ticket> page = null;
            List<Ticket> allTicketsList = new ArrayList<Ticket>();
            List<TicketDTO> transactions = null;

            if(searchCriteria.getAssetId() > 0 && searchCriteria.getSiteId() > 0) {
                page = ticketRepository.findTicketsBySiteId(searchCriteria.getSiteId(), searchCriteria.getAssetId(), pageRequest);
            }else {
                page = ticketRepository.findTicketsByAssetId(searchCriteria.getAssetId(), pageRequest);
            }

            allTicketsList.addAll(page.getContent());

            if(CollectionUtils.isNotEmpty(allTicketsList)) {
                if(transactions == null) {
                    transactions = new ArrayList<TicketDTO>();
                }
                for(Ticket assetTicket : allTicketsList) {
                    transactions.add(mapperUtil.toModel(assetTicket, TicketDTO.class));
                }
                buildResultAssetTickets(searchCriteria, page, transactions,result);
            }
        }

        return result;
    }

    private void buildResultAssetTickets(SearchCriteria searchCriteria, Page<Ticket> page, List<TicketDTO> transactions, SearchResult<TicketDTO> result) {
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

	public List<JobDTO> getAssetMaterials(SearchCriteria searchCriteria) {
       List<Job> allJobsList = new ArrayList<Job>();
       List<JobDTO> transactions = null;
       if(searchCriteria.getAssetId() > 0 && searchCriteria.getSiteId() > 0) {
    	   if(transactions == null) {
               transactions = new ArrayList<JobDTO>();
           }
       		allJobsList = jobRepository.findMaterialsByAssetId(searchCriteria.getSiteId(), searchCriteria.getAssetId());
       		if(CollectionUtils.isNotEmpty(allJobsList)) {
       			for(Job allJob : allJobsList) {
           			if(allJob.getJobMaterials().size() > 0) {
           				transactions.add(mapperUtil.toModel(allJob, JobDTO.class));
           			}
           		}
       		}

       }

       return transactions;

	}


}
