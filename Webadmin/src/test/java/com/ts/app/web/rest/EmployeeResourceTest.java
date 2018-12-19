package com.ts.app.web.rest;

import com.ts.app.Application;
import com.ts.app.service.EmployeeService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import java.io.FileInputStream;
import java.util.Base64;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//@ContextConfiguration(classes = WebConfigurer.class)
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(Application.class)
@WebIntegrationTest(randomPort = true)
@ActiveProfiles("dev")
public class EmployeeResourceTest {

	@Autowired
	private WebApplicationContext webApplicationContext;

	private MockMvc mockMvc;

	@Mock
	private EmployeeService mockService;

	@Before
	public void setUp() {
		// mockMvc = MockMvcBuilders.standaloneSetup(new
		// EmployeeResource(mockService))
		// .setViewResolvers(viewResolver())
		// .build();
	}

	private ViewResolver viewResolver() {
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();

		viewResolver.setViewClass(JstlView.class);
		viewResolver.setPrefix("/WEB-INF/jsp/");
		viewResolver.setSuffix(".jsp");

		return viewResolver;
	}

	@Test
	public void testCheckIn() throws Exception {

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(
				MockMvcRequestBuilders.post("/api/employee/in").contentType(MediaType.APPLICATION_JSON_VALUE).content(
						"{ \"employeeId\" : 10, \"employeeEmpId\" : 1001, \"projectId\" : 1, \"siteId\" : 7, \"deviceInUniqueId\": \"D1001\" , \"latitudeIn\": 12.9622293, \"longitudeIn\": 80.1897346 } "))
				.andExpect(status().is(200)).andExpect(content().string(containsString("success")));
	}

	@Test
	public void testInImageUpload() throws Exception {

		MockMultipartFile photoInFile = new MockMultipartFile("photoInFile", "filename.txt", "text/plain",
				"some xml".getBytes());

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.fileUpload("/api/employee/image/upload").file(photoInFile)
				.param("employeeEmpId", "1001").param("employeeId", "10").param("action", "IN"))
				.andExpect(status().is(200)).andExpect(content().string(containsString("success")));
	}

	@Test
	public void testInImageUploadUsingBase64Image() throws Exception {
		byte[] content = new byte[50000];
		FileInputStream fis = new FileInputStream("src/main/webapp/dist/assets/images/0f3a89cf.timesheet.png");
		fis.read(content);
		String base64 = Base64.getEncoder().encodeToString(content);
		
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/image/uploadnew").param("photoInFile",base64)
				.param("employeeEmpId", "1001").param("employeeId", "10").param("action", "IN"))
				.andExpect(status().is(200)).andExpect(content().string(containsString("success")));
	}

	@Test
	public void testCheckOut() throws Exception {

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/out").contentType(MediaType.APPLICATION_JSON_VALUE)
				.content("{ \"employeeId\" : 10, \"employeeEmpId\" : 1001, \"projectId\" : 2, \"siteId\" : 7, \"deviceOutUniqueId\": \"D1001\", \"latitudeOut\": 12.9622293, \"longitudeOut\": 80.1897346 }"))
				.andExpect(status().is(200)).andExpect(content().string(containsString("success")));
	}

	@Test
	public void testOutImageUpload() throws Exception {

		MockMultipartFile photoInFile = new MockMultipartFile("photoInFile", "filename.txt", "text/plain",
				"some xml".getBytes());

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.fileUpload("/api/employee/image/upload").file(photoInFile)
				.param("employeeEmpId", "1001").param("employeeId", "10").param("action", "OUT"))
				.andExpect(status().is(200)).andExpect(content().string(containsString("success")));
	}

	// @Test
	public void testValidate() throws Exception {

		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.get("/api/employee/validate/1001")).andExpect(

		status().is(200)).andExpect(content().string(containsString("\"code\":1001")));
	}

	@Test
	public void testGetCheckInOutUsingDateRange() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/checkInOut/search")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content("{  \"checkInDateTimeFrom\" : \"2016-01-12\", \"checkInDateTimeTo\" : \"2016-01-20\" }"))
				.andExpect(status().isOk());

	}

	@Test
	public void testGetTransactionsUsingDateEmpId() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/checkInOut/search")
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(
						"{ \"employeeId\" : 1, \"employeeEmpId\" : \"1001\", \"checkInDateTimeFrom\" : \"2016-01-12\", \"checkInDateTimeTo\" : \"2016-01-20\" }"))
				.andExpect(status().isOk());

	}

	@Test
	public void testGetTransactionsUsingDateProjectId() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/checkInOut/search")
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(
						"{ \"projectId\" : 1, \"checkInDateTimeFrom\" : \"2016-01-12\", \"checkInDateTimeTo\" : \"2016-01-20\" }"))
				.andExpect(status().isOk());

	}

	@Test
	public void testGetTransactionsUsingDateSiteId() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.post("/api/employee/checkInOut/search")
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(
						"{ \"siteId\" : 1, \"checkInDateTimeFrom\" : \"2016-01-12\", \"checkInDateTimeTo\" : \"2016-01-20\" }"))
				.andExpect(status().isOk());

	}
	
	@Test
	public void testGetTransactionsUsingEmployeeId() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.get("/api/employee/3/checkInOut?findAll=false&currPage=1")
				.contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk());

	}
	
	@Test
	public void testDeleteImages() throws Exception {
		// Get all the checkinout transaction for the date
		MockMvc mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
		mockMvc.perform(MockMvcRequestBuilders.delete("/api/employee/1001/checkInOut/image")
				.contentType(MediaType.APPLICATION_JSON_VALUE).content("[\"1001_IN_1453228200000\"]"))
				.andExpect(status().isOk());

	}

}
