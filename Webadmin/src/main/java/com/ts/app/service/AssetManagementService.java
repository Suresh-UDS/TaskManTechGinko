package com.ts.app.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
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
import com.ts.app.domain.AssetDocument;
import com.ts.app.domain.AssetGroup;
import com.ts.app.domain.AssetParameterConfig;
import com.ts.app.domain.AssetType;
import com.ts.app.domain.Designation;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.repository.AssetDocumentRepository;
import com.ts.app.repository.AssetGroupRepository;
import com.ts.app.repository.AssetParameterConfigRepository;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeProjectSite;
import com.ts.app.domain.Manufacturer;
import com.ts.app.domain.ParameterConfig;
import com.ts.app.domain.User;
import com.ts.app.domain.Vendor;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.AssetTypeRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.DesignationRepository;
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
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetDocumentDTO;
import com.ts.app.web.rest.dto.AssetParameterConfigDTO;
import com.ts.app.web.rest.dto.AssetTypeDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.DesignationDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.ParameterConfigDTO;
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
    private AssetTypeRepository assetTypeRepository;
    
    @Inject
    private AssetParameterConfigRepository assetParamConfigRepository;
    
    @Inject
    private AssetDocumentRepository assetDocumentRepository;
    
    //Asset
    public AssetDTO saveAsset(AssetDTO assetDTO) {
        log.debug("assets service");

    	Asset asset = mapperUtil.toEntity(assetDTO, Asset.class);
    	Site site = getSite(assetDTO.getSiteId());
        asset.setSite(site);
        
        Manufacturer manufacturer = getManufacturer(assetDTO.getManufacturerId());
        asset.setManufacturer(manufacturer);

        Vendor vendor = getVendor(assetDTO.getVendorId());
    	asset.setAmcVendor(vendor);

    	asset.setActive(Asset.ACTIVE_YES);
    	
    	List<Asset> existingAssets = assetRepository.findAssetByTitle(assetDTO.getTitle());
        log.debug("Existing asset -"+ existingAssets);
        if(CollectionUtils.isEmpty(existingAssets)) {
        	log.debug(">>> save! <<<");
            asset = assetRepository.save(asset);
        }

        return mapperUtil.toModel(asset, AssetDTO.class);

    	}

    public List<AssetDTO> findAllAssets(){
        log.debug("get all assets");
        List<Asset> assets = assetRepository.findAll();
        List<AssetDTO> assetDto = new ArrayList<>();
        for(Asset loc: assets){
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

//    public SearchResult<AssetDTO> getSiteAssets(Long siteId,int	 page) {
//        Pageable pageRequest = new PageRequest(page, PagingUtil.PAGE_SIZE, new Sort(Direction.DESC,"id"));
//
//        Page<Asset> assets= assetRepository.findBySiteId(siteId,pageRequest);
//        SearchResult<AssetDTO> paginatedAssets = new SearchResult<>();
//        paginatedAssets.setCurrPage(page);
//        paginatedAssets.setTransactions(mapperUtil.toModelList(assets.getContent(), AssetDTO.class));
//        paginatedAssets.setTotalCount(assets.getTotalElements());
//        paginatedAssets.setTotalPages(assets.getTotalPages());
//        return paginatedAssets;
//    }

    public List<AssetDTO> getSiteAssets(Long AssetSiteId){
        log.debug("get site assets");
        List<Asset> assets = assetRepository.findBySiteId(AssetSiteId);
        List<AssetDTO> assetDto = new ArrayList<>();
        for(Asset loc: assets){
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

    public Asset getAsset(long id){
        Asset asset = assetRepository.findOne(id);
        return asset;
    }

    public AssetDTO getAssetDTO(long id){
        Asset asset = assetRepository.findOne(id);
        AssetDTO assetDTO = mapperUtil.toModel(asset,AssetDTO.class);
        /*Site site = getSite(assetDTO.getSiteId());
        assetDTO.setActive(asset.getActive());
        assetDTO.setSiteId(assetDTO.getSiteId());
        assetDTO.setSiteName(assetDTO.getSiteName());
        assetDTO.setTitle(asset.getTitle());
        assetDTO.setCode(asset.getCode());
        assetDTO.setDescription(asset.getDescription());
        assetDTO.setUdsAsset(asset.isUdsAsset());
        assetDTO.setStartTime(asset.getStartTime());
        assetDTO.setEndTime(asset.getEndTime());*/
        
        assetDTO.setTitle(assetDTO.getTitle());
        assetDTO.setAssetGroup(assetDTO.getAssetGroup());
        assetDTO.setProjectId(assetDTO.getProjectId());
        assetDTO.setSiteId(assetDTO.getSiteId());
        assetDTO.setBlock(assetDTO.getBlock());
        assetDTO.setFloor(assetDTO.getFloor());
        assetDTO.setZone(assetDTO.getZone());
        assetDTO.setModelNumber(assetDTO.getModelNumber());
        assetDTO.setSerialNumber(assetDTO.getSerialNumber());
        assetDTO.setPurchasePrice(assetDTO.getPurchasePrice());
        assetDTO.setCurrentPrice(assetDTO.getCurrentPrice());
        assetDTO.setEstimatedDisposePrice(assetDTO.getEstimatedDisposePrice());
        assetDTO.setCode(assetDTO.getCode());
        assetDTO.setUdsAsset(assetDTO.isUdsAsset());
        
        return assetDTO;
    }
    
    public AssetDTO getAssetByCode(String code){
        Asset asset = assetRepository.findByCode(code);
        AssetDTO assetDTO = mapperUtil.toModel(asset,AssetDTO.class);
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
        /*Site site = getSite(assetDTO.getSiteId());

        asset.setTitle(assetDTO.getTitle());
        asset.setDescription(assetDTO.getDescription());
        asset.setCode(assetDTO.getCode());
        asset.setStartTime(DateUtil.convertToSQLDate(assetDTO.getStartTime()));
        asset.setEndTime(DateUtil.convertToSQLDate(assetDTO.getEndTime()));
        asset.setUdsAsset(assetDTO.isUdsAsset());
        asset.setSite(site);
*/
        asset.setTitle(assetDTO.getTitle());
        asset.setAssetGroup(assetDTO.getAssetGroup());
        asset.setDescription(assetDTO.getDescription());
        Site site = getSite(assetDTO.getSiteId());
        asset.setSite(site);
        asset.setBlock(assetDTO.getBlock());
    	asset.setFloor(assetDTO.getFloor());
    	asset.setZone(assetDTO.getZone());
    	asset.setModelNumber(assetDTO.getModelNumber());
    	asset.setSerialNumber(assetDTO.getSerialNumber());
    	asset.setPurchasePrice(assetDTO.getPurchasePrice());
    	asset.setCurrentPrice(assetDTO.getCurrentPrice());
    	asset.setEstimatedDisposePrice(assetDTO.getEstimatedDisposePrice());
        asset.setCode(assetDTO.getCode());
        //asset.setEndTime(DateUtil.convertToSQLDate(assetDTO.getEndTime()));
        //asset.setStartTime(DateUtil.convertToSQLDate(assetDTO.getStartTime()));
        asset.setUdsAsset(assetDTO.isUdsAsset());
    }

    public AssetDTO updateAsset(AssetDTO assetDTO) {
        Asset asset = assetRepository.findOne(assetDTO.getId());
        mapToEntityAssets(assetDTO, asset);
        asset = assetRepository.save(asset);

        return mapperUtil.toModel(asset, AssetDTO.class);
    }

    public String generateAssetQRCode(long assetId,String assetCode) {
        Asset asset= assetRepository.findOne(assetId);
        	asset.setCode(assetCode);
        	assetRepository.save(asset);
        byte[] qrCodeImage = null;
        String qrCodeBase64 = null;
        if(asset != null) {
            String code = String.valueOf(asset.getCode());
            qrCodeImage = QRCodeUtil.generateQRCode(code);
            String qrCodePath = env.getProperty("qrcode.file.path");
            String imageFileName = null;
            if(org.apache.commons.lang3.StringUtils.isNotEmpty(qrCodePath)) {
                imageFileName = fileUploadHelper.uploadQrCodeFile(code, qrCodeImage);
                asset.setQrCodeImage(imageFileName);
                assetRepository.save(asset);
            }
            if(qrCodeImage != null && org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)) {
                qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
            }
        }
        return qrCodeBase64;
    }

    public String getQRCode(long assetId){
    	Asset asset= assetRepository.findOne(assetId);
    	String qrCodeBase64 = null;
    	String imageFileName = null;
    	if(asset !=null) {
    		imageFileName = asset.getQrCodeImage();
    		if(org.apache.commons.lang3.StringUtils.isNotBlank(imageFileName)){
    			qrCodeBase64 = fileUploadHelper.readQrCodeFile(imageFileName);
    		}
    	}
    	return qrCodeBase64;
    }
        
    public ExportResult generateReport(List<JobDTO> transactions, SearchCriteria criteria) {
        return reportUtil.generateJobReports(transactions, null, null, criteria);
    }


	// public SearchResult<AssetDTO> getSiteAssets(Long siteId,int page) {
	// Pageable pageRequest = new PageRequest(page, PagingUtil.PAGE_SIZE, new
	// Sort(Direction.DESC,"id"));
	//
	// Page<Asset> assets= assetRepository.findBySiteId(siteId,pageRequest);
	// SearchResult<AssetDTO> paginatedAssets = new SearchResult<>();
	// paginatedAssets.setCurrPage(page);
	// paginatedAssets.setTransactions(mapperUtil.toModelList(assets.getContent(),
	// AssetDTO.class));
	// paginatedAssets.setTotalCount(assets.getTotalElements());
	// paginatedAssets.setTotalPages(assets.getTotalPages());
	// return paginatedAssets;
	// }

	public SearchResult<AssetDTO> findBySearchCrieria(SearchCriteria searchCriteria) {

		// -------
		SearchResult<AssetDTO> result = new SearchResult<AssetDTO>();
		User user = userRepository.findOne(searchCriteria.getUserId());
		Employee employee = user.getEmployee();
		List<EmployeeProjectSite> sites = employee.getProjectSites();
		List<Long> siteIds = new ArrayList<Long>();
    		for(EmployeeProjectSite site : sites) {
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
			log.debug( "name =" + searchCriteria.getAssetName() + " ,  assetType = " + searchCriteria.getAssetTypeName());
			if (!searchCriteria.isFindAll()) {
				if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName())
						&& !StringUtils.isEmpty(searchCriteria.getAssetName()) && searchCriteria.getProjectId() > 0 && searchCriteria.getSiteId() > 0) {
					page = assetRepository.findByAllCriteria(searchCriteria.getAssetTypeName(), searchCriteria.getAssetName(), searchCriteria.getProjectId(), searchCriteria.getSiteId(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetName())) {
					page = assetRepository.findByName(siteIds, searchCriteria.getAssetName(), pageRequest);
				} else if (!StringUtils.isEmpty(searchCriteria.getAssetTypeName())) {
					page = assetRepository.findByAssetType(siteIds,searchCriteria.getAssetTypeName(),pageRequest);
				} else if (searchCriteria.getSiteId() > 0) {
					page = assetRepository.findBySiteId(searchCriteria.getSiteId(),pageRequest);
				} else if (searchCriteria.getProjectId() > 0) {
					page = assetRepository.findByProjectId(searchCriteria.getProjectId(),pageRequest);
				} 
			} else {
				if(CollectionUtils.isNotEmpty(siteIds)) {
					page = assetRepository.findAll(siteIds,pageRequest);
				}else {
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

	private void buildSearchResult(SearchCriteria searchCriteria, Page<Asset> page,
			List<AssetDTO> transactions, SearchResult<AssetDTO> result) {
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

	private Site getSite(Long siteId) {
		Site site = siteRepository.findOne(siteId);
		if (site == null)
			throw new TimesheetException("Site not found : " + siteId);
		return site;
	}
	
	private Manufacturer getManufacturer(Long manufacturerId) {
		Manufacturer manufacturer = manufacturerRepository.findOne(manufacturerId);
		if (manufacturer == null)
			throw new TimesheetException("Manufacturer not found : " + manufacturerId);
		return manufacturer;
	}
	
	private Vendor getVendor(Long vendorId) {
		Vendor vendor = vendorRepository.findOne(vendorId);
		if (vendor == null)
			throw new TimesheetException("Manufacturer not found : " + vendorId);
		return vendor;
	}
	
	private Project getProject(Long projectId) {
		Project project = projectRepositoy.findOne(projectId);
		if(project == null) throw new TimesheetException("Project not found : "+projectId);
		return project;
	}

	public AssetgroupDTO createAssetGroup(AssetgroupDTO assetGroupDTO) {
		AssetGroup assetgroup= mapperUtil.toEntity(assetGroupDTO, AssetGroup.class);
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
		assetParamConfig = assetParamConfigRepository.save(assetParamConfig);
		assetParamConfigDTO = mapperUtil.toModel(assetParamConfig, AssetParameterConfigDTO.class);
		return assetParamConfigDTO;
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

	
}
