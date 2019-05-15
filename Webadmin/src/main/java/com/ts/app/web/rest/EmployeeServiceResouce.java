package com.ts.app.web.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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

import com.ts.app.service.EmployeeService;
import com.ts.app.web.rest.dto.EmpDTO;
import com.ts.app.web.rest.dto.EmployeeListDTO;
import com.ts.app.web.rest.dto.ExpenseDocumentDTO;
import com.ts.app.web.rest.dto.PersonalAreaDTO;
import com.ts.app.web.rest.dto.ProjectListDTO;
import com.ts.app.web.rest.dto.SiteListDTO;
import com.ts.app.web.rest.dto.WbsByEmpDTO;


@RequestMapping("/api/onboard")
@RestController
public class EmployeeServiceResouce {

	@Autowired
	RestTemplate restTemplete;

	@Autowired
	EmployeeService employeeService;

    @Value("${onBoarding.empServe}")
    private String URL_EMPSERVICE;

    @Value("${onBoarding.empRetrieve}")
    private String URL_ORACLE;

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
	public List<EmpDTO> getEmployeeListByWbs(@PathVariable("wbs") String wbs) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		ResponseEntity<List<EmpDTO>> response = restTemplete.exchange(
				URL_EMPSERVICE+"api/employeesByWbs/" + wbs, HttpMethod.GET, null,
				new ParameterizedTypeReference<List<EmpDTO>>() {
				});
		return response.getBody();
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

}
