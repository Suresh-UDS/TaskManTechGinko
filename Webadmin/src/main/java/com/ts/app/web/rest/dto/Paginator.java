package com.ts.app.web.rest.dto;

public class Paginator<T> {

	private int currPage;
	
	private int totalPages;
	
	private long totalCount;
	
	private long startInd;
	
	private long endInd;
	

	public int getCurrPage() {
		return currPage;
	}

	public void setCurrPage(int currPage) {
		this.currPage = currPage;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}

	public long getStartInd() {
		return startInd;
	}

	public void setStartInd(long startInd) {
		this.startInd = startInd;
	}

	public long getEndInd() {
		return endInd;
	}

	public void setEndInd(long endInd) {
		this.endInd = endInd;
	}


	
	
	
}
