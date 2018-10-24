package com.ts.app.web.rest.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.ts.app.domain.ExportContent;

public class ClientgroupDTO extends BaseDTO implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private long id;
    private String clientgroup;
    
    private String summary;
    
    Map<String, List<ExportContent>> contents;

    

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getClientgroup() {
		return clientgroup;
	}

	public void setClientgroup(String clientgroup) {
		this.clientgroup = clientgroup;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public Map<String, List<ExportContent>> getContents() {
		return contents;
	}

	public void setContents(Map<String, List<ExportContent>> contents) {
		this.contents = contents;
	}
	
	

}
