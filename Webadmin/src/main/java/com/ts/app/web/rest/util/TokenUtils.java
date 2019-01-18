package com.ts.app.web.rest.util;

import com.ts.app.web.rest.dto.EmployeeDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.codec.Hex;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TokenUtils {
	public static final String MAGIC_KEY = "obfuscate";

	//stores employee objects against the app access token
	private static final Map<String, EmployeeDTO> tokenCache = new ConcurrentHashMap<String, EmployeeDTO>();

	public static String createToken(UserDetails userDetails)
	{
		/* Expires in one day */
		long expires = System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30;

		StringBuilder tokenBuilder = new StringBuilder();
		tokenBuilder.append(userDetails.getUsername());
		tokenBuilder.append(":");
		tokenBuilder.append(expires);
		tokenBuilder.append(":");
		tokenBuilder.append(TokenUtils.computeSignature(userDetails, expires));

		return tokenBuilder.toString();
	}


	public static String computeSignature(UserDetails userDetails, long expires)
	{
		StringBuilder signatureBuilder = new StringBuilder();
		signatureBuilder.append(userDetails.getUsername());
		signatureBuilder.append(":");
		signatureBuilder.append(expires);
		signatureBuilder.append(":");
		signatureBuilder.append(userDetails.getPassword());
		signatureBuilder.append(":");
		signatureBuilder.append(TokenUtils.MAGIC_KEY);

		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("No MD5 algorithm available!");
		}

		return new String(Hex.encode(digest.digest(signatureBuilder.toString().getBytes())));
	}


	public static String getUserNameFromToken(String authToken)
	{
		if (null == authToken) {
			return null;
		}

		String[] parts = authToken.split(":");
		return parts[0];
	}


	public static boolean validateToken(String authToken, UserDetails userDetails)
	{
		String[] parts = authToken.split(":");
		long expires = Long.parseLong(parts[1]);
		String signature = parts[2];

		if (expires < System.currentTimeMillis()) {
			return false;
		}

		return signature.equals(TokenUtils.computeSignature(userDetails, expires));
	}
	
	public static EmployeeDTO getObject(String token) {
		EmployeeDTO emp = null;
		if(StringUtils.isNotEmpty(token)) {
			emp = tokenCache.get(token);
		}
		return emp;
	}
	
	public static void setObject(String token, EmployeeDTO value) {
		if(StringUtils.isNotEmpty(token) && value != null) {
			tokenCache.put(token, value);
		}
	}
}
