package com.ts.app.domain;

import java.util.List;

public class ExportContent {

	private long id;
	
	private long siteId;
	
	private String siteName;
	
	private String email;
	
	private String summary;
	
	private String jobFile;
	
	private String ticketFile;
	
	private String quotationFile;
	
	private String attendanceFile;
	
	private List<String> file;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public List<String> getFile() {
		return file;
	}

	public void setFile(List<String> file) {
		this.file = file;
	}

	public String getJobFile() {
		return jobFile;
	}

	public void setJobFile(String jobFile) {
		this.jobFile = jobFile;
	}

	public String getTicketFile() {
		return ticketFile;
	}

	public void setTicketFile(String ticketFile) {
		this.ticketFile = ticketFile;
	}

	public String getQuotationFile() {
		return quotationFile;
	}

	public void setQuotationFile(String quotationFile) {
		this.quotationFile = quotationFile;
	}

	public String getAttendanceFile() {
		return attendanceFile;
	}

	public void setAttendanceFile(String attendanceFile) {
		this.attendanceFile = attendanceFile;
	}

	
}
