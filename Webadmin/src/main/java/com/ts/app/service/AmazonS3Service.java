package com.ts.app.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.file.Files;
import java.util.List;
import java.util.zip.GZIPInputStream;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.ResponseHeaderOverrides;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.util.IOUtils;


@Service
public class AmazonS3Service {

	private final Logger log = LoggerFactory.getLogger(AmazonS3Service.class);
	
	private AmazonS3 s3client;
	
	@Value("${AWS.s3-url}")
    private String endpointUrl;
	
    @Value("${AWS.s3-bucketName}")
    private String bucketName;
    
    @Value("${AWS.s3-accessKey}")
    private String accessKey;
    
    @Value("${AWS.s3-secretKey}")
    private String secretKey;
    
    @Value("${AWS.s3-cloudfront-url}")
    private String cloudFrontUrl;
    
    @Value("${AWS.s3-bucketEnv}")
    private String bucketEnv;
    
    @Value("${AWS.s3-asset-path}")
    private String assetFilePath;
    
    @Value("${AWS.s3-qrcode-path}")
    private String qrCodePath;
    
    @Value("${AWS.s3-attendance-path}")
    private String attendancePath;
    
    @Value("${AWS.s3-ticket-path}")
    private String ticketPath;
    
    @Value("${AWS.s3-quotation-path}")
    private String quotationPath;
    
    @Value("${AWS.s3-enroll-path}")
    private String enrollImagePath;
    
    @PostConstruct
    private void initializeAmazon() {
       log.info("Amazon S3 credentials accessKey -" + this.accessKey + ", secretKey -" + this.secretKey);
       AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
       s3client = AmazonS3ClientBuilder.standard()
               		.withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.AP_SOUTH_1)
               		.build();
    }
    
    /**
	 * This method first delete the file in given folder 
	 */
    public void deleteFileFromS3Bucket(String key, String fileName) {
    	log.debug("File / Folder Name" + key);
    	try { 
    		s3client.deleteObject(new DeleteObjectRequest(bucketName, key + fileName));
    		log.info("===================== Delete File - Done! =====================");
    	} catch(AmazonS3Exception e) {
    		log.debug("Error while delete asset document to S3 bucket " + e.getMessage());
    		log.debug("Error Status code " + e.getErrorCode());
    		e.printStackTrace();
    	}
        
    }
    
    /**
	 * This method first deletes all the files in given folder and than the
	 * folder itself
	 */
	public void deleteFolder(String folderName) {
		try {
			
			List<S3ObjectSummary> fileList = s3client.listObjects(bucketName, folderName).getObjectSummaries();
			
			for (S3ObjectSummary file : fileList) {
				s3client.deleteObject(bucketName, file.getKey());
			}
			
			s3client.deleteObject(bucketName, folderName);
			log.info("===================== Delete Folders - Done! =====================");
           
        } catch(AmazonServiceException e) {
            // The call was transmitted successfully, but Amazon S3 couldn't process 
            e.printStackTrace();
        }
		
	}
	
	public String uploadAssetFileTos3bucket(String fileName, File file) {
    	log.debug("upload asset document to S3 bucket");
    	String prefixUrl = "";
    	try {
    		
    		String folder = bucketEnv + assetFilePath + fileName;
    		String ext = FilenameUtils.getExtension(fileName);
    		
    		ObjectMetadata metadata = new ObjectMetadata();
    		metadata.setContentType("application/"+ ext);
    		metadata.setContentDisposition("attachment;filename="+ fileName +"");
    		
    		PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, file)
    				.withMetadata(metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
    		log.info("===================== Upload File - Done! =====================");
    		URL url = s3client.getUrl(bucketName, folder);
    		log.debug("S3 uploaded url" +url);
    		prefixUrl = cloudFrontUrl + folder;
    		log.debug("Result from S3 -" +result);
    		
    	}catch(AmazonS3Exception e) {
    		log.debug("Error while upload asset document to S3 bucket " + e.getMessage());
    		log.debug("Error Status code " + e.getErrorCode());
    		e.printStackTrace();
    	}
    	
    	return prefixUrl;
    	
    }

	public String uploadQrToS3bucket(String filename, String qrCodeImage) {
		// TODO Auto-generated method stub
		String key = bucketEnv + qrCodePath + filename;
		String prefixUrl = "";
		try {
			
			byte[] bI = org.apache.commons.codec.binary.Base64.decodeBase64((qrCodeImage.substring(qrCodeImage.indexOf(",")+1)).getBytes());
			log.debug("Image Strings -" +bI);
			InputStream fis = new ByteArrayInputStream(bI);
			
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(bI.length);
			metadata.setContentType("image/png");
			metadata.setCacheControl("public, max-age=31536000");
		
			PutObjectResult result = s3client.putObject(bucketName, key, fis, metadata);
			s3client.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);
			log.debug("result of object request -" + result);
			prefixUrl = cloudFrontUrl + key;
			
		} catch(AmazonS3Exception e) {
			log.info("Error while upload a QRcode -" +e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public void uploadAttdFileToS3bucket(String fileName, File file) {
		// TODO Auto-generated method stub
		log.debug("Upload attendance file to S3 bucket" +fileName);
		try { 
			
			String folder = bucketEnv + attendancePath + fileName;
			String ext = FilenameUtils.getExtension(fileName);
			
			ObjectMetadata metadata = new ObjectMetadata();
    		metadata.setContentType("application/"+ ext);
    		metadata.setContentDisposition("attachment;filename"+ fileName +"");
    		
			PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, file)
					.withMetadata(metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
    		log.info("===================== Upload File - Done! =====================");
    		log.debug("Result from S3 -" +result);
			
		} catch(AmazonS3Exception e) { 
			e.printStackTrace();
		}
		
	}

	public String uploadQuotationToS3(String fileName, File file) {
		// TODO Auto-generated method stub
		log.debug("Upload Quotation file to S3 bucket -" +fileName);
		String prefixUrl = "";
		try { 
			String folder = bucketEnv + quotationPath + fileName;
			String ext = FilenameUtils.getExtension(fileName);
			
			ObjectMetadata metadata = new ObjectMetadata();
    		metadata.setContentType("application/"+ ext);
    		metadata.setContentDisposition("attachment;filename"+ fileName +"");
    		
			PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, file)
											 	.withMetadata(metadata)
											 	.withCannedAcl(CannedAccessControlList.PublicRead));
			log.info("------ Quotation Upload File done ------");
			log.debug("Result from S3 -" +result);
			prefixUrl = cloudFrontUrl + folder;								 
		} catch(AmazonS3Exception e) { 
			e.printStackTrace();
		}
		
		return prefixUrl;
		
	}

	public String uploadTicketFileToS3(String fileName, File file) {
		// TODO Auto-generated method stub
		log.debug("Upload Ticket File to S3 bucket" +fileName);
		String prefixUrl = "";
		try {
			String folder = bucketEnv + ticketPath + fileName;
			String ext = FilenameUtils.getExtension(fileName);
			
			ObjectMetadata metadata = new ObjectMetadata();
    		metadata.setContentType("application/"+ ext);
    		metadata.setContentDisposition("attachment;filename"+ fileName +"");
    		
			PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, file)
												.withMetadata(metadata)
												.withCannedAcl(CannedAccessControlList.PublicRead));
			log.info("-------- Ticket File Uplaod Done -------");
			log.debug("Result from S3 - " + result);
			prefixUrl = cloudFrontUrl + folder;
			
		}catch(AmazonS3Exception e){ 
			e.printStackTrace();
		}
		
		return prefixUrl;
		
	}

	public String uploadEnrollImageToS3(String filename, String imageDataString) {
		// TODO Auto-generated method stub
		String key = bucketEnv + enrollImagePath + filename;
		String prefixUrl = "";
		try {
			
			byte[] bI = org.apache.commons.codec.binary.Base64.decodeBase64((imageDataString.substring(imageDataString.indexOf(",")+1)).getBytes());
			log.debug("Image Strings -" +bI);
			InputStream fis = new ByteArrayInputStream(bI);
			
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(bI.length);
			metadata.setContentType("image/png");
			metadata.setCacheControl("public, max-age=31536000");
		
			PutObjectResult result = s3client.putObject(bucketName, key, fis, metadata);
			s3client.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);
			log.debug("result of object request -" + result);
			prefixUrl = cloudFrontUrl + key;
			
		} catch(AmazonS3Exception e) {
			log.info("Error while upload a Enroll image -" +e);
			e.printStackTrace();
		}
		 return prefixUrl;
		
	}
    

    
	
	
}
