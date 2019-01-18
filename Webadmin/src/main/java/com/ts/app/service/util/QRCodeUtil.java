package com.ts.app.service.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.EnumMap;
import java.util.Map;

public class QRCodeUtil {

	private static final Logger log = LoggerFactory.getLogger(QRCodeUtil.class);

	public static byte[] generateQRCode(String data) {
		int size = 100;
		try {
			Map<EncodeHintType, Object> hintMap = new EnumMap<EncodeHintType, Object>(
					EncodeHintType.class);
			hintMap.put(EncodeHintType.CHARACTER_SET, "UTF-8");
			hintMap.put(EncodeHintType.MARGIN, 1);
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);

			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix byteMatrix = qrCodeWriter.encode(data,
					BarcodeFormat.QR_CODE, size, size, hintMap);
			int width = byteMatrix.getWidth();
			BufferedImage image = new BufferedImage(width,width, BufferedImage.TYPE_INT_RGB);
			image.createGraphics();

			Graphics2D graphics = (Graphics2D) image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, width, width);
			graphics.setColor(Color.BLACK);

			for (int i = 0; i < width; i++) {
				for (int j = 0; j < width; j++) {
					if (byteMatrix.get(i, j)) {
						graphics.fillRect(i, j, 1, 1);
					}
				}
			}
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			ImageIO.write(image, "png", stream);
			return stream.toByteArray();
		} catch (WriterException e) {
			log.error("Error while creating QR code image for data -" + data ,e );
		} catch (IOException e) {
			log.error("Error while creating QR code image for data -" + data ,e );
		}
		return null;
	}
}
