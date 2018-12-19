package com.ts.app.web.rest.errors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Controller advice to translate the server side exceptions to client-friendly json structures.
 */
@ControllerAdvice(basePackages = {"com.ts.app"} )
public class ExceptionTranslator {
	
	private static final Logger log = LoggerFactory.getLogger(ExceptionTranslator.class);

    @ExceptionHandler(ConcurrencyFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ErrorDTO processConcurencyError(ConcurrencyFailureException ex) {
        return new ErrorDTO(ErrorConstants.ERR_CONCURRENCY_FAILURE);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDTO processValidationError(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();

        return processFieldErrors(fieldErrors);
    }

    @ExceptionHandler(CustomParameterizedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ParameterizedErrorDTO processParameterizedValidationError(CustomParameterizedException ex) {
        return ex.getErrorDTO();
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorDTO processAccessDeniedExcpetion(AccessDeniedException e) {
        return new ErrorDTO(ErrorConstants.ERR_ACCESS_DENIED, e.getMessage());
    }

    private ErrorDTO processFieldErrors(List<FieldError> fieldErrors) {
        ErrorDTO dto = new ErrorDTO(ErrorConstants.ERR_VALIDATION);

        for (FieldError fieldError : fieldErrors) {
            dto.add(fieldError.getObjectName(), fieldError.getField(), fieldError.getCode());
        }

        return dto;
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorDTO processMethodNotSupportedException(HttpRequestMethodNotSupportedException exception) {
        return new ErrorDTO(ErrorConstants.ERR_METHOD_NOT_SUPPORTED, exception.getMessage());
    }
    
	@ExceptionHandler(SQLException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ErrorDTO databaseError(SQLException exception) {
		log.error("databaseError Database Exception " + exception.getMessage());
		return new ErrorDTO(ErrorConstants.ERR_DATABASE, "An unexpected technical error occurred, please try again or contact administrator");
	}
	
	@ExceptionHandler({ TimesheetException.class})
	public ResponseEntity<ErrorDTO> duplicateRecordError(TimesheetException exception) {
		if(exception.getException() != null) {
			exception.getException().printStackTrace();
		}
		log.error("Timesheet Exception " + exception.getErrorMessage());
		if(exception.getException().getMessage().contains("ConstraintViolationException")) {
			String msgPrefix = StringUtils.EMPTY;
			Throwable ex = exception.getException();
			while(ex.getCause() != null) {
				ex = ex.getCause();
				log.error("Cause - "+ ex.getMessage());
			}

			Pattern p = Pattern.compile("(Duplicate entry) '[A-Za-z0-9]*'");
	        Matcher m = p.matcher(ex.getMessage());
	        if(m.find()) {
	            msgPrefix = m.group();
	        }
//			}else if(exception.getData() instanceof SiteDTO) {
//				msgPrefix = "Site";
//				Pattern p = Pattern.compile("(Duplicate entry) '[A-Za-z0-9]*'");
//		        Matcher m = p.matcher(ex.getMessage());
//		        if(m.find()) {
//		            msgPrefix = m.group();
//		        }
//			}else if(exception.getData() instanceof EmployeeDTO) {
//				//msgPrefix = "Employee";
//				//StringBuffer msgBuff = new StringBuffer(exception.getException().getMessage());
//				log.error("Timesheet Exception message = " + ex.getMessage());
//				Pattern p = Pattern.compile("(Duplicate entry) '[A-Za-z0-9]*'");
//		        Matcher m = p.matcher(ex.getMessage());
//		        if(m.find()) {
//		            msgPrefix = m.group();
//		        }
//				//int startInd = msgBuff.indexOf("(Duplicate entry) '[A-Za-z0-9]*'");
//				//int endInd = msgBuff.indexOf("for key") - 1;
//				//msgPrefix = msgBuff.substring(startInd, endInd);
//			}else if(exception.getData() instanceof UserDTO) {
//				msgPrefix = "User";
//				Pattern p = Pattern.compile("(Duplicate entry) '[A-Za-z0-9]*'");
//		        Matcher m = p.matcher(ex.getMessage());
//		        if(m.find()) {
//		            msgPrefix = m.group();
//		        }
//			}else if(exception.getData() instanceof UserGroupDTO) {
//				msgPrefix = "User Group";
//				Pattern p = Pattern.compile("(Duplicate entry) '[A-Za-z0-9]*'");
//		        Matcher m = p.matcher(ex.getMessage());
//		        if(m.find()) {
//		            msgPrefix = m.group();
//		        }
//			}
			return new ResponseEntity<ErrorDTO>(new ErrorDTO(ErrorConstants.ERR_DUPLICATE_RECORD, msgPrefix + " already exists!"), HttpStatus.BAD_REQUEST);
		}else if(exception.getException() instanceof IllegalArgumentException) {
			return new ResponseEntity<ErrorDTO>(new ErrorDTO(ErrorConstants.ERR_VALIDATION, exception.getException().getMessage()), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<ErrorDTO>(new ErrorDTO(ErrorConstants.ERR_UNEXPECTED, "An unexpected technical error occurred, please try again or contact administrator"), HttpStatus.BAD_REQUEST);
	}
}
