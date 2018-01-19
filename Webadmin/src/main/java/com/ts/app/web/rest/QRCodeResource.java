package com.ts.app.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ts.app.service.util.QRCodeUtil;

/**
 * REST controller for Generating QR Code.
 */
@RestController
@CrossOrigin
@RequestMapping("/api")
public class QRCodeResource {

	private final Logger log = LoggerFactory.getLogger(QRCodeResource.class);
	
	@RequestMapping(value = "/qr/generate", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
	public byte[] generateQR(@RequestParam(name = "data", required = true) String data) {
		byte[] qrCodeImage = QRCodeUtil.generateQRCode(data);
		return qrCodeImage;
	}
	
}
