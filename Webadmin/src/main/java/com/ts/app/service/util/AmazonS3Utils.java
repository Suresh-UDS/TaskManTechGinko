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
    
    public String uploadQuotationFile(String quotationId, MultipartFile multipartfile, long dateTime) { 
    	String name = quotationId + "_" + dateTime + ".jpg";
    	try {
    		File file = convertMultiPartToFile(multipartfile);
    		String fileName = name;
    		amazonS3Service.uploadQuotationToS3(fileName, file);
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
    	
		return name;
    } 
    
    public String uploadTicketFile(long ticketId, MultipartFile mulitipartfile, long dateTime) {
        String name = ticketId + "_" + dateTime + ".jpg";
        try { 
        	File file = convertMultiPartToFile(mulitipartfile);
        	String fileName = name;
        	amazonS3Service.uploadTicketFileToS3(fileName, file);
        } catch(Exception e) { 
        	e.printStackTrace();
        }
        return name;
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
    
  
    
      
   
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
