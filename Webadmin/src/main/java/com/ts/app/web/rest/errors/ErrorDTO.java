package com.ts.app.web.rest.errors;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for transfering error message with a list of field errors.
 */
@XmlRootElement
public class ErrorDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String message;
    private String description;

    private List<FieldErrorDTO> fieldErrors;

    public ErrorDTO() {
    	this(null,null);
    }
    
    public ErrorDTO(String message) {
        this(message, null);
    }

    public ErrorDTO(String message, String description) {
        this.message = message;
        this.description = description;
    }

    public ErrorDTO(String message, String description, List<FieldErrorDTO> fieldErrors) {
        this.message = message;
        this.description = description;
        this.fieldErrors = fieldErrors;
    }

    public void add(String objectName, String field, String message) {
        if (fieldErrors == null) {
            fieldErrors = new ArrayList<>();
        }
        fieldErrors.add(new FieldErrorDTO(objectName, field, message));
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }

    public List<FieldErrorDTO> getFieldErrors() {
        return fieldErrors;
    }

	public void setMessage(String message) {
		this.message = message;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setFieldErrors(List<FieldErrorDTO> fieldErrors) {
		this.fieldErrors = fieldErrors;
	}
    
    
    
}
