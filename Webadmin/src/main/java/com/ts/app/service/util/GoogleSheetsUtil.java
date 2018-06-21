package com.ts.app.service.util;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
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
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.services.AbstractGoogleClientRequest;
import com.google.api.client.googleapis.services.GoogleClientRequestInitializer;
import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.Drive.Files.Create;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

public class GoogleSheetsUtil {
	
	private static final Logger log = LoggerFactory.getLogger(GoogleSheetsUtil.class);
	
	private static final String APPLICATION_NAME = "TaskMan_Google_Sheets_API";
	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	private static final String CREDENTIALS_FOLDER = "credentials"; // Directory to store user credentials.

	/**
	 * Global instance of the scopes required by this quickstart. If modifying these
	 * scopes, delete your previously saved credentials/ folder.
	 */
	private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_METADATA_READONLY);
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
		InputStream in = GoogleSheetsUtil.class.getResourceAsStream(CLIENT_SECRET_DIR);
		GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

		// Build flow and trigger user authorization request.
		GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY,
				clientSecrets, SCOPES)
						.setDataStoreFactory(new FileDataStoreFactory(new java.io.File(CREDENTIALS_FOLDER)))
						.setAccessType("offline").build();
		return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
	}

	public static void upload(String name, String fileName)  {
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
	
	        // File's content.
	        FileInputStream fis = new FileInputStream(fileName);
	        byte[] content = IOUtils.toByteArray(fis);
	        ByteArrayContent mediaContent = new ByteArrayContent(mimeType, content);
	        try {
	          File file = service.files().create(body, mediaContent).execute();
	        
		        Create request = service.files().create(file);
		        
		        service.getGoogleClientRequestInitializer().initialize(request);
		        
		        request.execute();
		        
		        // Print the names and IDs for up to 10 files.
		        FileList result = service.files().list()
		                .setPageSize(10)
		                .setFields("nextPageToken, files(id, name)")
		                .execute();
		        List<File> files = result.getFiles();
		        if (files == null || files.isEmpty()) {
		            System.out.println("No files found.");
		        } else {
		            System.out.println("Files:");
		            for (File fileObj : files) {
		                System.out.printf("%s (%s)\n", fileObj.getName(), fileObj.getId());
		            }
		        }
	        }catch(Exception e) {
	        		
	        }
		}catch(Exception e ) {
			
		}
	}
}