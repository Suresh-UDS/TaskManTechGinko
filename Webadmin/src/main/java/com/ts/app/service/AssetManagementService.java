package com.ts.app.service;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Asset;
import com.ts.app.domain.AssetGroup;
import com.ts.app.domain.Designation;
import com.ts.app.domain.Project;
import com.ts.app.domain.Site;
import com.ts.app.domain.Ticket;
import com.ts.app.repository.AssetGroupRepository;
import com.ts.app.repository.AssetRepository;
import com.ts.app.repository.CheckInOutImageRepository;
import com.ts.app.repository.CheckInOutRepository;
import com.ts.app.repository.DesignationRepository;
import com.ts.app.repository.EmployeeRepository;
import com.ts.app.repository.JobRepository;
import com.ts.app.repository.LocationRepository;
import com.ts.app.repository.NotificationRepository;
import com.ts.app.repository.PricingRepository;
import com.ts.app.repository.ProjectRepository;
import com.ts.app.repository.SiteRepository;
import com.ts.app.repository.TicketRepository;
import com.ts.app.repository.UserRepository;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.ExportUtil;
import com.ts.app.service.util.FileUploadHelper;
import com.ts.app.service.util.ImportUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.service.util.QRCodeUtil;
import com.ts.app.service.util.ReportUtil;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetgroupDTO;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.DesignationDTO;
import com.ts.app.web.rest.dto.ExportResult;
import com.ts.app.web.rest.dto.ImportResult;
import com.ts.app.web.rest.dto.JobDTO;
import com.ts.app.web.rest.dto.SearchCriteria;
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
    
    //Asset
    public AssetDTO saveAsset(AssetDTO assetDTO) {
        log.debug("assets service in job services");
        Asset asset = new Asset();
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

    public String generateAssetQRCode(long assetId) {
        Asset asset= assetRepository.findOne(assetId);
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

    
    public ExportResult generateReport(List<JobDTO> transactions, SearchCriteria criteria) {
        return reportUtil.generateJobReports(transactions, null, null, criteria);
    }


	public ExportResult getExportStatus(String fileId) {
		ExportResult er = new ExportResult();

		fileId += ".xlsx";
        //log.debug("FILE ID INSIDE OF getExportStatus CALL ***********"+fileId);

		if(!StringUtils.isEmpty(fileId)) {
			String status = exportUtil.getExportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}

	public byte[] getExportFile(String fileName) {
		//return exportUtil.readExportFile(fileName);
		return exportUtil.readJobExportFile(fileName);
	}

	public ImportResult importFile(MultipartFile file, long dateTime) {
		return importUtil.importJobData(file, dateTime);
	}

	public ImportResult getImportStatus(String fileId) {
		ImportResult er = new ImportResult();
		//fileId += ".csv";
		if(!StringUtils.isEmpty(fileId)) {
			String status = importUtil.getImportStatus(fileId);
			er.setFile(fileId);
			er.setStatus(status);
		}
		return er;
	}
	
	private Site getSite(Long siteId) {
		Site site = siteRepository.findOne(siteId);
		if(site == null) throw new TimesheetException("Site not found : "+siteId);
		return site;
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
}
