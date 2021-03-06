package com.ts.app.web.rest.errors;

import com.ts.app.web.rest.dto.BaseDTO;

public class TimesheetException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Throwable exception;
	
	private BaseDTO data;
	
	private String errorMessage;

	public TimesheetException(Throwable exception) {
		this.exception = exception;
		this.errorMessage = exception.getMessage();
	}
	
	public TimesheetException(Throwable exception, BaseDTO data) {
		this.exception = exception;
		this.data = data;
		this.errorMessage = exception.getMessage();
	}
	
	public TimesheetException(Throwable exception, String message) {
		this.exception = exception;
		this.errorMessage = message;
	}
	
	public TimesheetException(String message) {
		this.errorMessage = message;
	}
	

	public Throwable getException() {
		return exception;
	}

	public void setException(Throwable exception) {
		this.exception = exception;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}


	public BaseDTO getData() {
		return data;
	}


	public void setData(BaseDTO data) {
		this.data = data;
	}
	
	

	
}
