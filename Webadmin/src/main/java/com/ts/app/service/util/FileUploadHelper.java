package com.ts.app.service.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUploadHelper {

	private static final Logger log = LoggerFactory.getLogger(FileUploadHelper.class);

	private static final String NEW_IMPORT_FOLDER = "/opt/imports/new";

	@Inject
	private Environment env;

	public String uploadQrCodeFile(String code, byte[] qrCodeImage) {
		String name = code + ".png";
		String filePath = env.getProperty("qrcode.file.path");
		FileSystem fileSystem = FileSystems.getDefault();
		Path path = fileSystem.getPath(filePath);

		if (!Files.exists(path)) {
			Path newEmpPath = Paths.get(filePath);
			try {
				Files.createDirectory(newEmpPath);
			} catch (IOException e) {
				log.error("Error while creating qrcode path " + newEmpPath);
			}
		}
		filePath += "/" + name;
		try {
			BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
			stream.write(qrCodeImage);
			stream.close();
			log.debug("File uploaded successfully - " + filePath);
		} catch (Exception e) {
			log.error("File uploaded failed - " + filePath, e);
		}
		return name;

	}

	public String uploadFile(String empId, String action, MultipartFile file, long dateTime) {
		String name = empId + "_" + action + "_" + dateTime + ".jpg";
		log.debug("file =" + file + ",  name=" + name);
		if (!file.isEmpty()) {
			// check and create emp directory
			String filePath = env.getProperty("upload.file.path");
			FileSystem fileSystem = FileSystems.getDefault();
			filePath += "/" + empId;
			Path path = fileSystem.getPath(filePath);
			// path = path.resolve(String.valueOf(empId));
			if (!Files.exists(path)) {
				Path newEmpPath = Paths.get(filePath);
				try {
					Files.createDirectory(newEmpPath);
				} catch (IOException e) {
					log.error("Error while creating path " + newEmpPath);
				}
			}
			try {
				filePath += "/" + name;
				byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
				stream.write(bytes);
				stream.close();
				log.debug("File uploaded successfully - " + name);
			} catch (Exception e) {
				log.error("File uploaded failed - " + name, e);
			}
		} else {
			log.error("Empty file, upload failed - " + name);
		}
		return name;
	}

	public String uploadFile(String empId, String action, String file, long dateTime) {
		String name = empId + "_" + action + "_" + dateTime + ".jpg";
		log.debug("file =" + file + ",  name=" + name);
		if (!file.isEmpty()) {
			// check and create emp directory
			String filePath = env.getProperty("upload.file.path");
			FileSystem fileSystem = FileSystems.getDefault();
			filePath += "/" + empId;
			Path path = fileSystem.getPath(filePath);
			// path = path.resolve(String.valueOf(empId));
			if (!Files.exists(path)) {
				Path newEmpPath = Paths.get(filePath);
				try {
					Files.createDirectory(newEmpPath);
				} catch (IOException e) {
					log.error("Error while creating path " + newEmpPath);
				}
			}
			try {
				filePath += "/" + name;
				byte[] bytes = Base64.getDecoder().decode(file.getBytes());
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
				stream.write(bytes);
				stream.close();
				log.debug("File uploaded successfully - " + name);
			} catch (Exception e) {
				log.error("File uploaded failed - " + name, e);
			}
		} else {
			log.error("Empty file, upload failed - " + name);
		}
		return name;
	}

	public String readImageFile(String empId, String imageFileName) {
		String filePath = env.getProperty("upload.file.path");
		filePath += "/" + empId;
		filePath += "/" + imageFileName +".jpg";
		File file = new File(filePath);
		String imageDataString = "data:image/jpg;base64,";
		try {
			FileInputStream imageFile = new FileInputStream(file);
	        byte imageData[] = new byte[(int) file.length()];
	        imageFile.read(imageData);

	        // Converting Image byte array into Base64 String
	        imageDataString += Base64.getEncoder().encodeToString(imageData);
			imageFile.close();

		}catch(IOException io) {
			log.error("Error while reading the image file ,"+ imageFileName , io);
		}
		return imageDataString;
	}
	
	public String readDocument(String imageFileName) {
		String filePath = env.getProperty("upload.file.path");
		//filePath += "/" + empId;
		//filePath += "/" + imageFileName +".jpg";
		File file = new File(imageFileName);
		String imageDataString = "data:image/jpg;base64,";
		try {
			FileInputStream imageFile = new FileInputStream(file);
	        byte imageData[] = new byte[(int) file.length()];
	        imageFile.read(imageData);

	        // Converting Image byte array into Base64 String
	        imageDataString += Base64.getEncoder().encodeToString(imageData);
			imageFile.close();

		}catch(IOException io) {
			log.error("Error while reading the image file ,"+ imageFileName , io);
		}
		return imageDataString;
	}

	public String readQuestionImageFile(long feedbackQuestionsId, String imageFileName) {
		String filePath = env.getProperty("upload.file.path");
		filePath += "/" + feedbackQuestionsId;
		filePath += "/" + imageFileName +".png";
		File file = new File(filePath);
		String imageDataString = "data:image/png;base64,";
		try {
			FileInputStream imageFile = new FileInputStream(file);
	        byte imageData[] = new byte[(int) file.length()];
	        imageFile.read(imageData);

	        // Converting Image byte array into Base64 String
	        imageDataString += Base64.getEncoder().encodeToString(imageData);
			imageFile.close();

		}catch(IOException io) {
			log.error("Error while reading the image file ,"+ imageFileName , io);
		}
		return imageDataString;
	}

	public String readQrCodeFile(String imageFileName) {
		String filePath = env.getProperty("qrcode.file.path");
		filePath += "/" + imageFileName;
		File file = new File(filePath);
		String imageDataString = "data:image/png;base64,";
		try {
			FileInputStream imageFile = new FileInputStream(file);
	        byte imageData[] = new byte[(int) file.length()];
	        imageFile.read(imageData);

	        // Converting Image byte array into Base64 String
	        imageDataString += Base64.getEncoder().encodeToString(imageData);
			imageFile.close();

		}catch(IOException io) {
			log.error("Error while reading the qrcode image file ,"+ imageFileName , io);
		}
		return imageDataString;
	}

	public List<String> deleteImages(String empId, List<String> imageIds) {
		log.debug("Emp Id -" + empId +", imageIds - " + imageIds);
		List<String> imagesDeleted = new ArrayList<String>();
		for(String imageId : imageIds) {
			String imageDeleted = deleteImageFile(empId, imageId);
			if(imageDeleted != null) {
				imagesDeleted.add(imageDeleted);
			}
		}
		return imagesDeleted;
	}

	public String deleteImageFile(String empId, String imageFileName) {
		String filePath = env.getProperty("upload.file.path");
		filePath += "/" + empId;
		filePath += "/" + imageFileName;
		log.debug("Emp Id -" + empId +", imageFilePath - " + filePath);
		File file = new File(filePath);
		if(file.exists()) {
			if(file.delete()) {
				log.debug("Deleted imageFile - " + imageFileName);
				return imageFileName;
			}
		}
		return null;
	}

    public String uploadAttendanceFile(String empId, String action, MultipartFile file, long dateTime) {
        String name = empId + "_" + action + "_" + dateTime + ".jpg";
        log.debug("file =" + file + ",  name=" + name);
        if (!file.isEmpty()) {
            // check and create emp directory
            String filePath = env.getProperty("attendance.file.path");
            FileSystem fileSystem = FileSystems.getDefault();
            filePath += "/" + empId;
            Path path = fileSystem.getPath(filePath);
            // path = path.resolve(String.valueOf(empId));
            if (!Files.exists(path)) {
                Path newEmpPath = Paths.get(filePath);
                try {
                    Files.createDirectory(newEmpPath);
                } catch (IOException e) {
                    log.error("Error while creating path for attendance " + newEmpPath);
                }
            }
            try {
                filePath += "/" + name;
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
                stream.write(bytes);
                stream.close();
                log.debug("File uploaded successfully to attendance folder - " + name);
            } catch (Exception e) {
                log.error("File uploaded failed for attendance - " + name, e);
            }
        } else {
            log.error("Empty file, upload failed for attendance- " + name);
        }
        return name;
    }

    public String readAttendanceImage(Long id, String empId, String imageFileName) {
        String filePath = env.getProperty("attendance.file.path");
        filePath += "/" + empId;
        filePath += "/" + imageFileName;
        File file = new File(filePath);
        String imageDataString = "";
        try {
            FileInputStream imageFile = new FileInputStream(file);
            byte imageData[] = new byte[(int) file.length()];
            imageFile.read(imageData);

            // Converting Image byte array into Base64 String
            imageDataString += Base64.getEncoder().encodeToString(imageData);
            imageFile.close();

        }catch(IOException io) {
            log.error("Error while reading the image file ,"+ imageFileName , io);
        }
        return imageDataString;
    }
    
    public String uploadImportFile(MultipartFile file, String filePath , String fileName) {
        log.debug("file =" + file + ",  name=" + fileName);
        if (!file.isEmpty()) {
            // check and create emp directory
            FileSystem fileSystem = FileSystems.getDefault();
            //filePath += "/" + fileName;
            Path path = fileSystem.getPath(filePath);
            // path = path.resolve(String.valueOf(empId));
            if (!Files.exists(path)) {
                Path newEmpPath = Paths.get(filePath);
                try {
                    Files.createDirectory(newEmpPath);
                } catch (IOException e) {
                    log.error("Error while creating path for import file " + newEmpPath);
                }
            }
            try {
                filePath += "/" + fileName;
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
                stream.write(bytes);
                stream.close();
                log.debug("File uploaded successfully to import folder - " + fileName);
            } catch (Exception e) {
                log.error("File uploaded failed for import - " + fileName, e);
            }
        } else {
            log.error("Empty file, upload failed for import - " + fileName);
        }
        return fileName;
    }
    
    public String uploadAssetDcmFile(String assetCode, Long siteId, MultipartFile file, long dateTime) {
    	log.debug("Site id" + siteId);
    	String extension = FilenameUtils.getExtension(file.getOriginalFilename());
    	log.debug(extension);
		String name =  assetCode + "_" + "document" + "_" + dateTime +"."+ extension;
		log.debug("file =" + file + ",  name=" + name);
		if (!file.isEmpty()) {
			// check and create emp directory
			String filePath = env.getProperty("asset.file.path");
			FileSystem fileSystem = FileSystems.getDefault();
			filePath += "/"+ siteId; 
			filePath += "/"+ assetCode;
			Path path = fileSystem.getPath(filePath);
			// path = path.resolve(String.valueOf(empId));
			if (!Files.exists(path)) {
				Path newAssetPath = Paths.get(filePath);
				try {
					Files.createDirectories(newAssetPath);
				} catch (IOException e) {
					log.error("Error" +e);
					log.error("Error while creating asset path " + newAssetPath);
				}
			}
			try {
				filePath += "/" + name;
				byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filePath)));
				stream.write(bytes);
				stream.close();
				log.debug("Asset File uploaded successfully - " + name);
			} catch (Exception e) {
				log.error("Asset File uploaded failed - " + name, e);
			}
		} else {
			log.error("Empty file, upload failed - " + name);
		}
		return name;
	}
    
    public MediaType getMediaTypeForFileName(ServletContext servletContext, String fileName) {
        // application/pdf
        // application/xml
        // image/gif, ...
        String mineType = servletContext.getMimeType(fileName);
        try {
            MediaType mediaType = MediaType.parseMediaType(mineType);
            return mediaType;
        } catch (Exception e) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
    
    public String deleteAssetFile(String assetCode, long siteId, String imageFileName) {
		String filePath = env.getProperty("asset.file.path");
		filePath += "/" + siteId;
		filePath += "/" + assetCode;
		filePath += "/" + imageFileName;
		log.debug("Site Id -" + siteId +", imageFilePath - " + filePath);
		try {
			File file = new File(filePath);
			log.debug("imageFilePath - " + file);
			if(file.exists()) {
				if(file.delete()) {
					log.debug("Deleted imageFile - " + imageFileName);
					return imageFileName;
				}else {
					log.debug("Failed to Delete a imageFile - " + imageFileName);
				}
			}
		} catch(Exception e) { 
			log.info("Error while deleting a file -" +e);
		}
		
		return null;
	}
    
    
    
    
}
