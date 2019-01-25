package com.ts.app.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.List;


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

    @Value("${AWS.s3-expenseDocument-path}")
    private String expenseDocumentPath;

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

    @Value("${AWS.s3-checkin-path}")
    private String checkInPath;

    @Value("${AWS.s3-checkout-path}")
    private String checkOutPath;

    @Value("${AWS.s3-checkinout-path}")
    private String checkInOutPath;

    @Value("${AWS.s3-checklist-path}")
    private String checkListPath;

    @Value("${AWS.s3-locationqr-path}")
    private String locationQrCodePath;

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

    public String uploadExpenseFileTos3bucket(String fileName, File file) {
        log.debug("upload Expense document to S3 bucket");
        String prefixUrl = "";
        try {

            String folder = bucketEnv + expenseDocumentPath + fileName;
            String ext = FilenameUtils.getExtension(fileName);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("application/"+ ext);
            metadata.setContentDisposition("attachment;filename="+ fileName +"");

            PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, file)
                .withMetadata(metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));
            URL url = s3client.getUrl(bucketName, folder);
            log.debug("S3 uploaded url" +url);
            prefixUrl = cloudFrontUrl + folder;
            log.debug("Result from S3 -" +result);

        }catch(AmazonS3Exception e) {
            log.debug("Error while upload expense document to S3 bucket " + e.getMessage());
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

	public String uploadCheckOutImageToS3(String filename, String imageDataString) {
		// TODO Auto-generated method stub
		String key = bucketEnv + checkOutPath + filename;
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
			log.info("Error while upload a attendance CheckOut image -" + e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public String uploadCheckInImageToS3(String filename, String imageDataString) {
		// TODO Auto-generated method stub
		String key = bucketEnv + checkInPath + filename;
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
			log.info("Error while upload a attendance CheckIn image -" + e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public String uploadEmployeeFileToS3bucket(String fileName, byte[] file) {
		log.debug("upload employee checkInOut image to S3 bucket");
    	String prefixUrl = "";
    	try {


    		String key = bucketEnv + checkInOutPath + fileName;
    		String ext = FilenameUtils.getExtension(fileName);

            InputStream fis = new ByteArrayInputStream(file);

    		ObjectMetadata metadata = new ObjectMetadata();
    		metadata.setContentType("application/"+ ext);

//    		PutObjectResult result = s3client.putObject(new PutObjectRequest(bucketName, folder, multipartFile)
//    				.withMetadata(metadata)
//                    .withCannedAcl(CannedAccessControlList.PublicRead));
//    		log.info("===================== Upload File - Done! =====================");
//    		URL url = s3client.getUrl(bucketName, folder);
//    		log.debug("S3 uploaded url" +url);
//    		prefixUrl = cloudFrontUrl + folder;
//    		log.debug("Result from S3 -" +result);

            PutObjectResult result = s3client.putObject(bucketName, key, fis, metadata);
            s3client.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);
            log.debug("result of object request -" + result);
            prefixUrl = cloudFrontUrl + key;

    	}catch(AmazonS3Exception e) {
    		log.debug("Error while upload employee checkInOut to S3 bucket " + e.getMessage());
    		log.debug("Error Status code " + e.getErrorCode());
    		e.printStackTrace();
    	}

    	return prefixUrl;
	}

	public String uploadCheckListImageToS3(String filename, String checkListImg) {
		String key = bucketEnv + checkListPath + filename;
		String prefixUrl = "";
		try {

			log.debug(checkListImg);
			byte[] bI = org.apache.commons.codec.binary.Base64.decodeBase64((checkListImg.substring(checkListImg.indexOf(",")+1)).getBytes());
			log.debug("Image Strings -" +bI);

			InputStream fis = new ByteArrayInputStream(bI);

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentLength(bI.length);
			metadata.setContentType("image/png");
			metadata.setCacheControl("public, max-age=31536000");

			PutObjectResult result = s3client.putObject(bucketName, key, fis, metadata);
			s3client.setObjectAcl(bucketName, key, CannedAccessControlList.PublicRead);
			log.debug("result of CheckListImage object request -" + result);
			prefixUrl = cloudFrontUrl + key;

		} catch(AmazonS3Exception e) {
			log.info("Error while upload a CheckListImage image -" + e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public String uploadLocationQrToS3bucket(String filename, String qrCodeImage) {
		// TODO Auto-generated method stub
		String key = bucketEnv + locationQrCodePath + filename;
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
			log.info("Error while upload a Location QRcode -" +e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public void uploadExistingCheckin() {
		log.debug("Calling AWS S3 for Checklist Images upload");
		String key = "prod/checkListImages/";
		String destinationKey = "prod/checkListImages/";
		try {
			List<S3ObjectSummary> fileList = s3client.listObjects(bucketName, key).getObjectSummaries();
			for(S3ObjectSummary file : fileList) {
				String filename = file.getKey();
				log.debug("Checklist Images before renamed file:" +  filename);
				    String subString[] = filename.split("/", 2);
				    System.out.println("Checklist Images Sub String file:" +  subString[0]);
				    System.out.println("Last String of File :" + subString[1]);
				    String last[] = subString[1].split("/", 2);
				    System.out.println("Last String of File :" + last[0]);
//				if(filename.contains("/")) {
//					String replacedFile = filename.replace("/", "-");
//					log.debug("After Slash removed file:" +  replacedFile);

//					CopyObjectRequest copyObjRequest = new CopyObjectRequest(bucketName, filename, bucketName, destinationKey + replacedFile)
//							.withCannedAccessControlList(CannedAccessControlList.PublicReadWrite);
//					s3client.copyObject(copyObjRequest);

					log.info("===================== Upload File - Done! =====================");
//				}

			}
		} catch(Exception e) {
			e.printStackTrace();
		}

	}


	public String uploadExistingTicketToS3(String fileName, String image) {
		String key = bucketEnv + ticketPath + fileName;
		String prefixUrl = "";
		try {

			byte[] bI = org.apache.commons.codec.binary.Base64.decodeBase64((image.substring(image.indexOf(",")+1)).getBytes());
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
			log.info("Error while upload a Ticket File -" + e);
			e.printStackTrace();
		}
		 return prefixUrl;
	}

	public void getAllFiles() {
		log.debug("===================== Calling a AWS S3 for get files =====================");
		try {
			String key = "prod/checkListImages/";
//			String checkListKey = "prod/checkListImages/";
			List<S3ObjectSummary> fileList = s3client.listObjects(bucketName, key).getObjectSummaries();
			log.debug("===================== Checklist File length =====================" + fileList.size());
//			List<S3ObjectSummary> checkLists = s3client.listObjects(bucketName, checkListKey).getObjectSummaries();
//			log.debug("===================== Checklist File length =====================" + checkLists.size());
			int i = 1;
			for (S3ObjectSummary file : fileList) {
				log.debug("===================== Get Files - Done! =====================" + file.getKey());
				String filename = file.getKey();
				if(filename.contains("${AWS.s3-checklist-path")) {
					log.debug("===================== Before Rename File =====================" + filename);
					String sourceKey = filename;
					String renamedFile = filename.substring(filename.indexOf("}")+1);
					log.debug("===================== After Rename File =====================" + renamedFile);
					log.debug("===================== File length =====================" + i);
//					if(renamedFile.contains("/")) {
//						String slashFile = renamedFile.replace("/", "-");
//						log.debug("===================== After Slash Removed File =====================" + slashFile);
//						CopyObjectRequest copyObjRequest = new CopyObjectRequest(bucketName, sourceKey, bucketName, key + checkListPath + slashFile)
//																	.withCannedAccessControlList(CannedAccessControlList.PublicReadWrite);
//						s3client.copyObject(copyObjRequest);
//					}else {

//					for(S3ObjectSummary checkList : checkLists) {
//						String checkListFile = checkList.getKey();
//						String subString[] = checkListFile.split("/", 3);
//					    log.debug("Checklist Images Sub String file:" +  subString[0]);
//					    log.debug("Checklist Images Sub String file:" +  subString[2]);
//					    String checkListRenamed = subString[2];
//						if(!checkListRenamed.equalsIgnoreCase(renamedFile)) {
//							log.debug("===================== File length =====================" + i);
//							log.debug("===================== Non duplicate images =====================" + i);
//						}
//					}
//
						log.debug("=====================Source Key  =====================" + sourceKey);
						CopyObjectRequest copyObjRequest = new CopyObjectRequest(bucketName, sourceKey, bucketName, key + renamedFile)
																	.withCannedAccessControlList(CannedAccessControlList.PublicReadWrite);
		                s3client.copyObject(copyObjRequest);
//					}

				}
				i++;

			}



        } catch(AmazonServiceException e) {
            e.printStackTrace();
        }
	}



}
