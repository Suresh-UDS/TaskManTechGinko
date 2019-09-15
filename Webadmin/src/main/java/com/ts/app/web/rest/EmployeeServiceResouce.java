package com.ts.app.web.rest;

import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;

import org.apache.commons.collections.CollectionUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.ts.app.domain.AbstractAuditingEntity;
import com.ts.app.domain.Employee;
import com.ts.app.domain.EmployeeDocuments;
import com.ts.app.domain.FeedbackMapping;
import com.ts.app.domain.GeneralSettings;
import com.ts.app.domain.SapBusinessCategories;
import com.ts.app.repository.EmployeeDocumentRepository;
import com.ts.app.repository.GeneralSettingsRepository;
import com.ts.app.repository.SapBusinessCategoriesRepository;
import com.ts.app.service.EmployeeService;
import com.ts.app.service.OnboardingDeclarationService;
import com.ts.app.service.OtaskmanService;
import com.ts.app.service.util.DateUtil;
import com.ts.app.service.util.MapperUtil;
import com.ts.app.web.rest.dto.BaseDTO;
import com.ts.app.web.rest.dto.EmpDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.EmployeeDocumentsDTO;
import com.ts.app.web.rest.dto.EmployeeListDTO;
import com.ts.app.web.rest.dto.ExpenseDocumentDTO;
import com.ts.app.web.rest.dto.PersonalAreaDTO;
import com.ts.app.web.rest.dto.PositionDTO;
import com.ts.app.web.rest.dto.ProjectListDTO;
import com.ts.app.web.rest.dto.SapBusinessCategoriesDTO;
import com.ts.app.web.rest.dto.SiteListDTO;
import com.ts.app.web.rest.dto.WbsByEmpDTO;
import com.ts.app.web.rest.errors.TimesheetException;


@RequestMapping("/api/onboard")
@RestController
public class EmployeeServiceResouce {

	@Autowired
	RestTemplate restTemplete;

	@Autowired
	EmployeeService employeeService;
	
	@Autowired 
	EmployeeDocumentRepository employeeDocumentService;
	
	@Autowired
	OnboardingDeclarationService onboardingDeclarationService;
	
	@Autowired
	GeneralSettingsRepository generalSettingsRepository; 

    @Value("${onBoarding.empServe}")
    private String URL_EMPSERVICE;

    @Value("${onBoarding.empRetrieve}")
    private String URL_ORACLE;
    
    @Autowired
    private OtaskmanService oTaskmanService;
    
    @Autowired
    private SapBusinessCategoriesRepository SAPbuisinessCategoriesRepository;

	@Inject
	private MapperUtil<AbstractAuditingEntity, BaseDTO> mapperUtil;
	
	@RequestMapping(value = "/getBranchList", method = RequestMethod.GET)
	public List<PersonalAreaDTO> getBranchList() {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<PersonalAreaDTO>> response = restTemplete.exchange(URL_ORACLE + "getBranchList",
				HttpMethod.GET, null, new ParameterizedTypeReference<List<PersonalAreaDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/getProjectListByProjectDesc/{projectDesc}", method = RequestMethod.GET)
	public List<ProjectListDTO> getProjectListByProjectDesc(@PathVariable("projectDesc") String projectDesc) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<ProjectListDTO>> response = restTemplete.exchange(
				URL_ORACLE + "getProjectListByProjectDesc/" + projectDesc, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<ProjectListDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping("/getProjectList")
	public List<ProjectListDTO> getProjectList() {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<ProjectListDTO>> response = restTemplete.exchange(URL_ORACLE + "getProjectList",
				HttpMethod.GET, null, new ParameterizedTypeReference<List<ProjectListDTO>>() {
				});

		return response.getBody();
	}

	@RequestMapping(value = "/getProjectListByIds/{projectId}", method = RequestMethod.GET)
	public List<ProjectListDTO> getProjectListByIds(@PathVariable("projectId") String projectIds) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<ProjectListDTO>> response = restTemplete.exchange(
				URL_ORACLE + "getProjectListByIds/" + projectIds, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<ProjectListDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping("/getWBSList")
	public List<SiteListDTO> getWBSList() {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<SiteListDTO>> response = restTemplete.exchange(URL_ORACLE + "getWBSList", HttpMethod.GET,
				null, new ParameterizedTypeReference<List<SiteListDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/getWBSListByProjectIds/{projectId}", method = RequestMethod.GET)
	public List<SiteListDTO> getWBSListByProjectIds(@PathVariable("projectId") String projectIds) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<SiteListDTO>> response = restTemplete.exchange(
				URL_ORACLE + "getWBSListByProjectIds/" + projectIds, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<SiteListDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/getWbsDetailsByEmpIds/{empIds}", method = RequestMethod.GET)
	public List<WbsByEmpDTO> getWbsDetailsByEmpIds(@PathVariable("empIds") String empIds) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<WbsByEmpDTO>> response = restTemplete.exchange(
				URL_ORACLE+"getWbsDetailsByEmpIds/" + empIds, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<WbsByEmpDTO>>() {
				});
		return response.getBody();
	}


	@RequestMapping(value = "/getEmployeeListByWbs/{wbs}", method = RequestMethod.GET)
	public List<EmployeeDTO> getEmployeeListByWbs(@PathVariable("wbs") String wbs) {

		List<EmployeeDTO> employeeListDto =  employeeService.findActionRequired(true, false, "Y", wbs);
		
		if(CollectionUtils.isEmpty(employeeListDto)) {
			
			HttpHeaders headers = new HttpHeaders();
			headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

			HttpEntity<String> entity = new HttpEntity<String>(headers);

			ResponseEntity<List<EmployeeDTO>> response = restTemplete.exchange(
					URL_ORACLE+"getEmployeeListByWbs/" + wbs, HttpMethod.GET, null,
					new ParameterizedTypeReference<List<EmployeeDTO>>() {
					});
			
			List<EmployeeDTO> oracleList = response.getBody();
			
			GeneralSettings generalSetting = generalSettingsRepository.findBySettingName("LoadSapWithTaskman");
			
			if(generalSetting.isSwitchedOn()) {
			
				if(CollectionUtils.isNotEmpty(oracleList)) {
					
					for(int i=0;i<oracleList.size();i++) {
						
						List<EmployeeDocumentsDTO> documents = employeeService.findEmployeeDocumentsByEmpId(oracleList.get(i).getEmpId());
						
						EmployeeDTO dtoFromLocal =  employeeService.getPrestoredEmployee();
						
						if(dtoFromLocal!=null) {
							
							oracleList.set(i, dtoFromLocal);
							
						}
						
						if(documents!=null) {
							
							oracleList.get(i).setDocuments(documents);;
							
						}
						
						
					}
					
				}
				
			}
			
			return oracleList;
		}
		else {
			
			return employeeListDto;
		}
 
	}
 
	@RequestMapping(value = "/downloadDeclaration/{empId}/{langauge}", method = RequestMethod.GET)
	public HttpEntity<byte[]> downloadDeclarationPdf(@PathVariable("empId") String empId,@PathVariable("langauge") String language){
		
		VelocityEngine vm = new VelocityEngine();
		
		vm.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		vm.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		vm.init();
		
		Template t = vm.getTemplate("pdf/declarationForm.vm","UTF-8");
		
		VelocityContext context = new VelocityContext();
		 
		String decalrarionContent = onboardingDeclarationService.getListByLangauge(language).getDeclarationText();
		 
		EmployeeDTO employee = employeeService.findByEmpId(empId);
		
		
		
		if(employee !=null) {
			
			String[] declarationContentPart = (decalrarionContent.replace("_______________", (String.format("%,.2f",employee.getGross()))+"/-")).split("\\r?\\n");
			 
			context.put("paras", declarationContentPart); 
			context.put("employee", employee); 
			context.put("date", DateUtil.formatToDateString(Date.from(employee.getCreatedDate().toInstant()), "dd-MM-yyyy hh:mm a"));
			EmployeeDocuments documents = employeeDocumentService.findByEmployeeIdAndDocumentType(employee.getId(), "thumbImpressenRight");
			context.put("employeeDocuments", documents.getDocUrl());
			
		}
		 
		
		/* now render the template into a StringWriter */
		StringWriter writer = new StringWriter();
		t.merge(context, writer);
		/* show the World */
		System.out.println(writer.toString());
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		baos = generatePdf(writer.toString());

		HttpHeaders header = new HttpHeaders();
	    header.setContentType(MediaType.parseMediaType("application/pdf"));
	    header.set(HttpHeaders.CONTENT_DISPOSITION,
	                   "attachment; filename="+employee.getName().replace(" ", "_")+".pdf" );
	    header.setContentLength(baos.toByteArray().length);

	    return new HttpEntity<byte[]>(baos.toByteArray(), header);
		
	}
	
	public ByteArrayOutputStream generatePdf(String html) {

		String pdfFilePath = "";
		PdfWriter pdfWriter = null;

		// create a new document
		Document document = new Document();
		try {

			document = new Document();
			// document header attributes
			document.addAuthor("Kiran Dhongade");
			document.addCreationDate();
			document.addProducer();
			document.addCreator("kinns123.github.io");
			document.addTitle("HTML to PDF using itext");
			document.setPageSize(PageSize.LETTER);

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			PdfWriter.getInstance(document, baos);

			// open document
			document.open();

			XMLWorkerHelper xmlWorkerHelper = XMLWorkerHelper.getInstance();
			xmlWorkerHelper.getDefaultCssResolver(true);
			xmlWorkerHelper.parseXHtml(pdfWriter, document, new StringReader(
					html));
			// close the document
			document.close();
			System.out.println("PDF generated successfully");

			return baos;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	@RequestMapping(value = "/getEmployeeListByProjectId/{projectId}", method = RequestMethod.GET)
	public List<EmpDTO> getEmployeeListByProjectId(@PathVariable("projectId") String projectId) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<EmpDTO>> response = restTemplete.exchange(
				URL_EMPSERVICE+"api/getEmployeeListByProjectId/" + projectId, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<EmpDTO>>() {
				});
		return response.getBody();
	}




	@RequestMapping(value = "/employees", method = RequestMethod.GET)
	public List<EmpDTO> getAllEmp() {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<EmpDTO>> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees",
				HttpMethod.GET, null, new ParameterizedTypeReference<List<EmpDTO>>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/employees/{id}", method = RequestMethod.GET)
	public EmpDTO getEmp(@PathVariable(value = "id") String id) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<EmpDTO> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/" + id,
				HttpMethod.GET, null, new ParameterizedTypeReference<EmpDTO>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/employees", method = RequestMethod.POST)
	public EmpDTO saveEmp(@Valid @RequestBody EmpDTO empDTO) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<EmpDTO> entity = new HttpEntity<EmpDTO>(empDTO, headers);

		ResponseEntity<EmpDTO> response;

		if (empDTO.getId()==null || empDTO.getId().equals("")) {
			response = restTemplete.postForEntity(URL_EMPSERVICE+"api/employees", entity, EmpDTO.class);
		} else {
			response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/", HttpMethod.PUT, entity,
					new ParameterizedTypeReference<EmpDTO>() {
					});
		}
		return response.getBody();
	}

	@RequestMapping(value = "/employees", method = RequestMethod.PUT)
	public EmpDTO updateEmp(@Valid @RequestBody EmpDTO empDTO) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<EmpDTO> entity = new HttpEntity<EmpDTO>(empDTO, headers);

		ResponseEntity<EmpDTO> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/",
				HttpMethod.PUT, entity, new ParameterizedTypeReference<EmpDTO>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/employees/{id}", method = RequestMethod.DELETE)
	public EmpDTO deleteEmp(@PathVariable(value = "id") String id) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<EmpDTO> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/" + id,
				HttpMethod.DELETE, null, new ParameterizedTypeReference<EmpDTO>() {
				});
		return response.getBody();
	}

	@RequestMapping(value = "/aadharPhotoCopy", method = RequestMethod.POST)
	public EmpDTO aadharPhotoCopy(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"aadharPhotoCopy");

	}

	@RequestMapping(value = "/addressProof", method = RequestMethod.POST)
	public EmpDTO addressProof(@RequestParam("file") MultipartFile file, @RequestParam("id") String id
			) {

		return employeeUpdate(file,id,"addressProof");
	}

	@RequestMapping(value = "/profilePicture", method = RequestMethod.POST)
	public EmpDTO profilePicture(@RequestParam("file") MultipartFile file, @RequestParam("id") String id
			) {

		return employeeUpdate(file,id,"profilePicture");

	}


	@RequestMapping(value = "/employeeSignature", method = RequestMethod.POST)
	public EmpDTO employeeSignature(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"employeeSignature");

	}

	@RequestMapping(value = "/employeeVoiceSample", method = RequestMethod.POST)
	public EmpDTO employeeVoiceSample(@RequestParam("file") MultipartFile file, @RequestParam("id") String id
			) {

		return employeeUpdate(file,id,"employeeVoiceSample");

	}

	@RequestMapping(value = "/prePrintedStatement", method = RequestMethod.POST)
	public EmpDTO prePrintedStatement(@RequestParam("file") MultipartFile file, @RequestParam("id") String id
			) {

		return employeeUpdate(file,id,"prePrintedStatement");

	}

	@RequestMapping(value = "/thumbImpressenRight", method = RequestMethod.POST)
	public EmpDTO impressenLeft(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"thumbImpressenRight");
	}


	@RequestMapping(value = "/thumbImpressenLeft", method = RequestMethod.POST)
	public EmpDTO impressenRight(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"thumbImpressenLeft");

	}

	@RequestMapping(value = "/drivingLicense", method = RequestMethod.POST)
	public EmpDTO drivingLicense(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"drivingLicense");

	}

	@RequestMapping(value = "/pancardCopy", method = RequestMethod.POST)
	public EmpDTO pancardCopy(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"pancardCopy");

	}

	@RequestMapping(value = "/voterId", method = RequestMethod.POST)
	public EmpDTO voterId(@RequestParam("file") MultipartFile file, @RequestParam("id") String id) {

		return employeeUpdate(file,id,"voterId");

	}



	private EmpDTO getEmployee(String id) {
		ResponseEntity<EmpDTO> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/" + id,
				HttpMethod.GET, null, new ParameterizedTypeReference<EmpDTO>() {
				});
		return response.getBody();

	}



	private  EmpDTO employeeUpdate(MultipartFile file,String id,String image) {

		synchronized (EmployeeServiceResouce.class) {
		EmpDTO empDTO = getEmployee(id);
		String fileName=null;
		ExpenseDocumentDTO empDocDTO =null;
		switch(image) {

		case  "thumbImpressenLeft":
			 fileName = empDTO.getAadharNumber() + "_thumbImpressenLeft";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setThumbImpressenLeft(empDocDTO.getFile());

		break;

		case  "thumbImpressenRight":
			 fileName = empDTO.getAadharNumber() + "_thumbImpressenRight";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setThumbImpressenRight(empDocDTO.getFile());

		break;

		case  "prePrintedStatement":
			 fileName = empDTO.getAadharNumber() + "_prePrintedStatement";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setPrePrintedStatement(empDocDTO.getFile());

		break;

		case "employeeVoiceSample":
			 fileName = empDTO.getAadharNumber() + "_employeeVoiceSample";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setEmployeeVoiceSample(empDocDTO.getFile());

		break;


		case  "employeeSignature":
			 fileName = empDTO.getAadharNumber() + "_employeeSignature";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setEmployeeSignature(empDocDTO.getFile());

		break;

		case  "profilePicture":
			 fileName = empDTO.getAadharNumber() + "_profilePicture";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setProfilePicture(empDocDTO.getFile());

		break;

		case  "addressProof":
			 fileName = empDTO.getAadharNumber() + "_addressProof";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setAddressProof(empDocDTO.getFile());

		break;

		case  "aadharPhotoCopy":
			 fileName = empDTO.getAadharNumber() + "_aadharPhotoCopy";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setAadharPhotoCopy(empDocDTO.getFile());

		break;

		case  "drivingLicense":
			 fileName = empDTO.getAadharNumber() + "_drivingLicense";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setDrivingLicense(empDocDTO.getFile());

		break;

		case  "pancardCopy":
			 fileName = empDTO.getAadharNumber() + "_pancardCopy";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setPancardCopy(empDocDTO.getFile());

		break;

		case  "voterId":
			 fileName = empDTO.getAadharNumber() + "_voterId";
			 empDocDTO = employeeService.uploadFile(file, fileName);
			empDTO.setVoterId(empDocDTO.getFile());

		break;

		}

		return employeeUpdate(empDTO);
		}

	}

	private EmpDTO employeeUpdate(EmpDTO empDTO) {
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<EmpDTO> entity = new HttpEntity<EmpDTO>(empDTO, headers);

		ResponseEntity<EmpDTO> response = restTemplete.exchange(URL_EMPSERVICE+"api/employees/",
				HttpMethod.PUT, entity, new ParameterizedTypeReference<EmpDTO>() {
				});
		return response.getBody();
	}



    @RequestMapping(value="/updateSAPBuisinessCategories", method = RequestMethod.POST)
	public ResponseEntity<?> updateSAPBuisinessCategoeies(){
		
		String categories = oTaskmanService.getBranchProjectWbs();
		
		SapBusinessCategoriesDTO buisinessCategiresModel = new SapBusinessCategoriesDTO();
		
		buisinessCategiresModel.setElementsJson(categories);
 
		SapBusinessCategories sapBusinessCategories = mapperUtil.toEntity(buisinessCategiresModel, SapBusinessCategories.class);
		
		SAPbuisinessCategoriesRepository.save(sapBusinessCategories);
		
        return new ResponseEntity<>(HttpStatus.OK);
        
	}
    
    @RequestMapping(value = "/getPositionsWithGrossByWBSID/{wbsId}", method = RequestMethod.GET)
    public ResponseEntity<List<PositionDTO>> getPositionsWithGrossByWBSID(@PathVariable("wbsId") String wbsId) {
    	try {
    		return new ResponseEntity<List<PositionDTO>>( oTaskmanService.getPositionsWithGrossByWBSID(wbsId), HttpStatus.OK);
    	}
    	catch(Exception ex) {
    		
    		throw new TimesheetException(ex, ex.getMessage());
    	}
    	
    }

}
