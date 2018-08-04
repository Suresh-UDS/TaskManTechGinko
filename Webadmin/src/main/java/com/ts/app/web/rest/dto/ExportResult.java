package com.ts.app.web.rest.dto;

public class ExportResult {

	private String empId;
	
	private String file;
	
	private String status;
	
	private String msg;
	
	private String url;
	
	private String webLink;
	
	private String webContentLink;
	
	

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getEmpId() {
		return empId;
	}

	public void setEmpId(String empId) {
		this.empId = empId;
	}

	public String getFile() {
		return file;
	}

	public void setFile(String file) {
		this.file = file;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getWebLink() {
		return webLink;
	}

	public void setWebLink(String webLink) {
		this.webLink = webLink;
	}

	public String getWebContentLink() {
		return webContentLink;
	}

	public void setWebContentLink(String webContentLink) {
		this.webContentLink = webContentLink;
	}
	
	
}
