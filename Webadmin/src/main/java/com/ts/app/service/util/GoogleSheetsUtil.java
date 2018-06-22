package com.ts.app.service.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.batch.BatchRequest;
import com.google.api.client.googleapis.batch.json.JsonBatchCallback;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.googleapis.services.AbstractGoogleClientRequest;
import com.google.api.client.googleapis.services.GoogleClientRequestInitializer;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.Drive.Files.Create;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.File.Capabilities;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;

public class GoogleSheetsUtil {
	
	private static final Logger log = LoggerFactory.getLogger(GoogleSheetsUtil.class);
	
	private static final String APPLICATION_NAME = "TaskMan_Google_Sheets_API";
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	private static final String CREDENTIALS_FOLDER = "credentials"; // Directory to store user credentials.

	/**
	 * Global instance of the scopes required by this quickstart. If modifying these
	 * scopes, delete your previously saved credentials/ folder.
	 */
	private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
	private static final String CLIENT_SECRET_DIR = "client_secret_872397104992-ilhar6nqjp1l4cdat5n82i25ncn82s87.apps.googleusercontent.com.json";

	/**
	 * Creates an authorized Credential object.
	 * 
	 * @param HTTP_TRANSPORT
	 *            The network HTTP Transport.
	 * @return An authorized Credential object.
	 * @throws IOException
	 *             If there is no client_secret.
	 */
	private static Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
		// Load client secrets.
		//InputStream in = GoogleSheetsUtil.class.getResourceAsStream("src/main/resources/" + CLIENT_SECRET_DIR);
		InputStream in = new FileInputStream(CLIENT_SECRET_DIR);
		GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

		// Build flow and trigger user authorization request.
		GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY,
				clientSecrets, SCOPES)
						.setDataStoreFactory(new FileDataStoreFactory(new java.io.File(CREDENTIALS_FOLDER)))
						.setAccessType("offline").build();
		return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
	}

	public static String upload(String name, String fileName)  {
		String webFileLink = null;
        // Build a new authorized API client service.
		try {
	        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
	        Drive service = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
	                .setApplicationName(APPLICATION_NAME)
	                .setGoogleClientRequestInitializer(new GoogleClientRequestInitializer() {
	                    @Override
	                    public void initialize(AbstractGoogleClientRequest<?> abstractGoogleClientRequest) throws IOException {
	                        abstractGoogleClientRequest.setDisableGZipContent(true);
	                    }
	                })
	                .build();
	        
	     // File's metadata.
	        String mimeType = "application/vnd.google-apps.spreadsheet";
	        File body = new File();
	        body.setName(name);
	        body.setMimeType(mimeType);
//	        Capabilities cap = new Capabilities();
//	        cap.setCanAddChildren(true);
//	        body.setCapabilities(cap);
	
	        // File's content.
	        FileInputStream fis = new FileInputStream(fileName);
	        byte[] content = IOUtils.toByteArray(fis);
	        ByteArrayContent mediaContent = new ByteArrayContent(mimeType, content);
	        try {
	        		Drive.Files.Create create = service.files().create(body, mediaContent);
	        		create.setFields("id, name, webViewLink");
		        service.getGoogleClientRequestInitializer().initialize(create);
		        
		        File file = create.execute();
		        
		        
//		        //set file permissions.
//		        BatchRequest batch = service.batch();
//		        Permission userPermission = new Permission()
//		            .setType("user")
//		            .setRole("writer")
//		            .setEmailAddress("gnanaprakash@techginko.com");
//		        service.permissions().create(file.getId(), userPermission)
//		            .setFields("id")
//		            .queue(batch, new JsonBatchCallback<Permission>() {
//		            	  @Override
//		            	  public void onFailure(GoogleJsonError e,
//		            	                        HttpHeaders responseHeaders)
//		            	      throws IOException {
//		            	    // Handle error
//		            	    log.error(e.getMessage());
//		            	  }
//
//		            	  @Override
//		            	  public void onSuccess(Permission permission,
//		            	                        HttpHeaders responseHeaders)
//		            	      throws IOException {
//		            	    log.debug("Permission ID: " + permission.getId());
//		            	  }
//		            	});
//
//		        Permission domainPermission = new Permission()
//		            .setType("anyone")
//		            .setRole("reader");
//		            
//		        service.permissions().create(file.getId(), domainPermission)
//		            .setFields("id")
//		            .queue(batch, new JsonBatchCallback<Permission>() {
//		            	  @Override
//		            	  public void onFailure(GoogleJsonError e,
//		            	                        HttpHeaders responseHeaders)
//		            	      throws IOException {
//		            	    // Handle error
//		            	    log.error(e.getMessage());
//		            	  }
//
//		            	  @Override
//		            	  public void onSuccess(Permission permission,
//		            	                        HttpHeaders responseHeaders)
//		            	      throws IOException {
//		            	    log.debug("Permission ID: " + permission.getId());
//		            	  }
//		            	});
//
//		        batch.execute();		        
		        webFileLink = file.getWebViewLink();

		        // Print the names and IDs for up to 10 files.
		        FileList result = service.files().list()
		                .setPageSize(10)
		                .setFields("nextPageToken, files(id, name)")
		                .execute();
		        List<File> files = result.getFiles();
		        if (files == null || files.isEmpty()) {
		            log.debug("No files found.");
		        } else {
		        		log.debug("Files:");
		            for (File fileObj : files) {
		            		log.debug("%s (%s)\n", fileObj.getName(), fileObj.getId());
		            }
		        }
	        }catch(Exception e) {
	        		log.error("Error while creating file in google drive",e);
	        }
		}catch(Exception e ) {
			log.error("Error while uploading file to google drive",e);
		}
		return webFileLink;
	}
}