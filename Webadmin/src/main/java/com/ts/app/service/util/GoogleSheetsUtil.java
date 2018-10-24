package com.ts.app.service.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
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
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;

@Component
public class GoogleSheetsUtil {

	private static final Logger log = LoggerFactory.getLogger(GoogleSheetsUtil.class);

	private static final String APPLICATION_NAME = "TaskManProd";
	/** E-mail address of the service account. */
	private static final String SERVICE_ACCOUNT_EMAIL = "udsfmshelpdesk@gmail.com";

	/** Bucket to list. */
	private static final String BUCKET_NAME = "AssetSchedule";

	private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	private static final String CREDENTIALS_FOLDER = "credentials"; // Directory to store user credentials.

	/**
	 * Global instance of the scopes required by this quickstart. If modifying these
	 * scopes, delete your previously saved credentials/ folder.
	 */
	private static final List<String> SCOPES = Collections.singletonList(DriveScopes.DRIVE_FILE);
	private static final String CLIENT_SECRET_DIR = "client_secret_7634333701-h17hql7aoqgsf1pq08sqjdrdb8q7tavi.apps.googleusercontent.com.json";

	private static final String SERVICE_ACCCOUNT_FILE = "TaskManProd-ec5b5c1e44b0.json";

	@Inject
	private Environment env;

	/**
	 * Creates an authorized Credential object.
	 * 
	 * @param HTTP_TRANSPORT
	 *            The network HTTP Transport.
	 * @return An authorized Credential object.
	 * @throws IOException
	 *             If there is no client_secret.
	 */
	private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
		// Load client secrets.
		// InputStream in =
		// GoogleSheetsUtil.class.getResourceAsStream("src/main/resources/" +
		// CLIENT_SECRET_DIR);
		InputStream in = new FileInputStream(CLIENT_SECRET_DIR);
		GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

		// Build flow and trigger user authorization request.
		GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY,
				clientSecrets, SCOPES)
						.setDataStoreFactory(new FileDataStoreFactory(new java.io.File(CREDENTIALS_FOLDER))).build();
		String host = env.getProperty("google.drive.api.callback.host");
		// int port =
		// Integer.parseInt(env.getProperty("google.drive.api.callback.port"));
		LocalServerReceiver localReceiver = new LocalServerReceiver.Builder().setHost(host).build();

		return new AuthorizationCodeInstalledApp(flow, localReceiver).authorize("user");
	}

	/**
	 * Creates an authorized Credential object.
	 * 
	 * @param HTTP_TRANSPORT
	 *            The network HTTP Transport.
	 * @return An authorized Credential object.
	 * @throws IOException
	 *             If there is no client_secret.
	 */
	private Credential getServiceAccountCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // Build a service account credential.
		InputStream in = new FileInputStream(SERVICE_ACCCOUNT_FILE);
		GoogleCredential credential = GoogleCredential.fromStream(in);
		credential = credential.createScoped(SCOPES);
		/*
        GoogleCredential credential = new GoogleCredential.Builder().setTransport(HTTP_TRANSPORT)
            .setJsonFactory(JSON_FACTORY)
            .setServiceAccountId(SERVICE_ACCOUNT_EMAIL)
            .setServiceAccountScopes(SCOPES)
            //.setServiceAccount
            //.setServiceAccountPrivateKeyFromP12File(new File("key.p12"))
            .build();
        */    
		return credential;
        
	}

	public String[] upload(String name, String fileName) {
		String webFileLink = null;
		String webContentLink = null;
		// Build a new authorized API client service.
		try {
			final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
			Drive service = new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, getServiceAccountCredentials(HTTP_TRANSPORT))
					.setApplicationName(APPLICATION_NAME)
					.setGoogleClientRequestInitializer(new GoogleClientRequestInitializer() {
						@Override
						public void initialize(AbstractGoogleClientRequest<?> abstractGoogleClientRequest)
								throws IOException {
							abstractGoogleClientRequest.setDisableGZipContent(true);
						}
					}).build();

			// File's metadata.
			String mimeType = "application/vnd.google-apps.spreadsheet";
			File body = new File();
			body.setName(name);
			body.setMimeType(mimeType);
			// Capabilities cap = new Capabilities();
			// cap.setCanAddChildren(true);
			// body.setCapabilities(cap);

			// File's content.
			FileInputStream fis = new FileInputStream(fileName);
			byte[] content = IOUtils.toByteArray(fis);
			ByteArrayContent mediaContent = new ByteArrayContent(mimeType, content);
			try {
				Drive.Files.Create create = service.files().create(body, mediaContent);
				create.setFields("id, name, webViewLink, webContentLink");
				service.getGoogleClientRequestInitializer().initialize(create);

				File file = create.execute();

				// set file permissions.
				BatchRequest batch = service.batch();
				Permission userPermission = new Permission().setType("user").setRole("writer")
						.setEmailAddress("udsfmshelpdesk@gmail.com");
				service.permissions().create(file.getId(), userPermission).setFields("id").queue(batch,
						new JsonBatchCallback<Permission>() {
							@Override
							public void onFailure(GoogleJsonError e, HttpHeaders responseHeaders) throws IOException {
								// Handle error
								log.error(e.getMessage());
							}

							@Override
							public void onSuccess(Permission permission, HttpHeaders responseHeaders)
									throws IOException {
								log.debug("Permission ID: " + permission.getId());
							}
						});

				Permission domainPermission = new Permission().setType("anyone").setRole("reader");

				service.permissions().create(file.getId(), domainPermission).setFields("id").queue(batch,
						new JsonBatchCallback<Permission>() {
							@Override
							public void onFailure(GoogleJsonError e, HttpHeaders responseHeaders) throws IOException {
								// Handle error
								log.error(e.getMessage());
							}

							@Override
							public void onSuccess(Permission permission, HttpHeaders responseHeaders)
									throws IOException {
								log.debug("Permission ID: " + permission.getId());
							}
						});

				batch.execute();
				webFileLink = file.getWebViewLink();
				// webContentLink = file.getWebContentLink();
				// form downloadable url
				int replaceIndex = webFileLink.indexOf("edit");
				StringBuffer sbf = new StringBuffer(webFileLink);
				sbf.replace(replaceIndex, webFileLink.length(), "export?format=xlsx");
				webContentLink = sbf.toString();
				// Print the names and IDs for up to 10 files.
				FileList result = service.files().list().setPageSize(10)
						.setFields("nextPageToken, files(id, name, webViewLink, webContentLink)").execute();
				List<File> files = result.getFiles();
				if (files == null || files.isEmpty()) {
					log.debug("No files found.");
				} else {
					log.debug("Files:");
					for (File fileObj : files) {
						log.debug("%s (%s)\n", fileObj.getName(), fileObj.getId());
					}
				}
			} catch (Exception e) {
				log.error("Error while creating file in google drive", e);
			}
		} catch (Exception e) {
			log.error("Error while uploading file to google drive", e);
		}
		String[] response = new String[2];
		response[0] = webFileLink;
		response[1] = webContentLink;
		return response;
	}
}