package com.ts.app.web.rest.dto;

import java.util.ArrayList;
import java.util.List;

public class ExportResponse {

	private List<ExportResult> results = new ArrayList<ExportResult>();
	
	public void addResult(ExportResult result) {
		results.add(result);
	}
	
	public List<ExportResult> getResults() {
		return results;
	}
}
