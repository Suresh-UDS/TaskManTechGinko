package com.ts.app.service.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.ts.app.service.AmazonS3Service;
import com.ts.app.web.rest.dto.AssetDTO;
import com.ts.app.web.rest.dto.AssetDocumentDTO;
import com.ts.app.web.rest.dto.AttendanceDTO;
import com.ts.app.web.rest.dto.EmployeeDTO;
import com.ts.app.web.rest.dto.QuotationDTO;
import com.ts.app.web.rest.dto.TicketDTO;

@Component
public class AmazonS3Utils {

	private final Logger log = LoggerFactory.getLogger(AmazonS3Utils.class);
	
	@Inject
	private AmazonS3Service amazonS3Service;
	
	private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
    
    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }
    
    /* Upload Asset document and Photos to S3 bucket */
    public AssetDocumentDTO uploadAssetFile(String assetCode, MultipartFile multipartFile, AssetDocumentDTO assetDocumentDTO) {

    	String fileUrl = "";
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            String nameOfFile = assetCode + "_" + "document" + "_" + fileName;
            fileUrl = amazonS3Service.uploadAssetFileTos3bucket(nameOfFile, file);
            assetDocumentDTO.setFile(nameOfFile);
            assetDocumentDTO.setUrl(fileUrl);
            file.delete();
        } catch (Exception e) {
           e.printStackTrace();
        }
        return assetDocumentDTO;
    }
    
    
    public AssetDTO uploadQrCodeFile(String code, byte[] qrCodeImage, AssetDTO assetDTO) { 
    	String filename = code +".png";
    	String fileUrl = "";
    	String imageDataString = "data:image/png;base64,";
    	try {
	        // Converting Image byte array into Base64 String
	        imageDataString += Base64.getEncoder().encodeToString(qrCodeImage);
	        log.debug("base64 string" +imageDataString);
	        fileUrl = amazonS3Service.uploadQrToS3bucket(filename, imageDataString);
	        assetDTO.setQrCodeImage(filename);
	        assetDTO.setUrl(fileUrl);
    	} catch(Exception e) { 
    		e.printStackTrace();
    	}
    	
		return assetDTO;
    }
    
    public String uploadAttendanceFile(String empId, String action, MultipartFile multipartFile, long dateTime) {
    	String nameOfFile = empId + "_" + action + "_" + dateTime + ".jpg";
    	try{
    		File file = convertMultiPartToFile(multipartFile);
            String fileName = nameOfFile;
            amazonS3Service.uploadAttdFileToS3bucket(fileName, file);
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    	
		return nameOfFile;
    	
    }
    
    public QuotationDTO uploadQuotationFile(String quotationId, MultipartFile multipartfile, long dateTime, QuotationDTO quotationDTO) { 
    	String fileUrl = "";
    	String quotationFileName = quotationId + "_" + dateTime + ".jpg";
    	try {
    		File file = convertMultiPartToFile(multipartfile);
    		fileUrl = amazonS3Service.uploadQuotationToS3(quotationFileName, file);
    		quotationDTO.setQuotationFileName(quotationFileName);
    		quotationDTO.setUrl(fileUrl);
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
    	
		return quotationDTO;
    } 
    
    public TicketDTO uploadTicketFile(long ticketId, MultipartFile mulitipartfile, long dateTime, TicketDTO ticketDTO) {
    	String fileUrl = "";
        String name = ticketId + "_" + dateTime + ".jpg";
        try { 
        	File file = convertMultiPartToFile(mulitipartfile);
        	String fileName = name;
        	fileUrl = amazonS3Service.uploadTicketFileToS3(fileName, file);
        	ticketDTO.setImage(fileName);
        	ticketDTO.setUrl(fileUrl);
        } catch(Exception e) { 
        	e.printStackTrace();
        }
        return ticketDTO;
    }

	public String deleteAssetFile(String key, String file) {
		// TODO Auto-generated method stub
		String fileName = file;
		try { 
			amazonS3Service.deleteFileFromS3Bucket(key , fileName);
		} catch(Exception e) { 
			e.printStackTrace();
		}
		
		return fileName;
	}    
	
	public EmployeeDTO uploadEnrollImage(String qrCodeImage, EmployeeDTO employeeDTO) { 
    	String filename = "enrollImage.png";
    	String fileUrl = "";
    	String imageDataString = "data:image/png;base64,";
    	try {
	        // Converting Image byte array into Base64 String
	        imageDataString += qrCodeImage;
	        log.debug("base64 string" +imageDataString);
	        fileUrl = amazonS3Service.uploadEnrollImageToS3(filename, imageDataString);
	        employeeDTO.setEnrolled_face(filename);
	        employeeDTO.setUrl(fileUrl);
    	} catch(Exception e) { 
    		e.printStackTrace();
    	}
    	
		return employeeDTO;
    }

	public AttendanceDTO uploadCheckoutImage(String checkOutImage, AttendanceDTO attnDto) {
		// TODO Auto-generated method stub
		String filename = "checkOutImage.png";
    	String fileUrl = "";
    	String imageDataString = "data:image/png;base64,";
    	try {
	        // Converting Image byte array into Base64 String
	        imageDataString += checkOutImage;
	        log.debug("base64 string" + imageDataString);
	        fileUrl = amazonS3Service.uploadCheckOutImageToS3(filename, imageDataString);
	        attnDto.setCheckOutImage(filename);
	        attnDto.setUrl(fileUrl);
    	} catch(Exception e) { 
    		e.printStackTrace();
    	}
    	
		return attnDto;
	}
	
	public AttendanceDTO uploadCheckInImage(String checkInImage, AttendanceDTO attnDto) {
		// TODO Auto-generated method stub
		String filename = "checkInImage.png";
    	String fileUrl = "";
    	String imageDataString = "data:image/png;base64,";
    	try {
	        // Converting Image byte array into Base64 String
	        imageDataString += checkInImage;
	        log.debug("base64 string" + imageDataString);
	        fileUrl = amazonS3Service.uploadCheckInImageToS3(filename, imageDataString);
	        attnDto.setCheckInImage(filename);
	        attnDto.setUrl(fileUrl);
    	} catch(Exception e) { 
    		e.printStackTrace();
    	}
    	
		return attnDto;
	}
    
  
    
      
   
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
