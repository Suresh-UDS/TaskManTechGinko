package com.ts.app.service.util;

import org.springframework.stereotype.Component;

import java.text.DecimalFormat;

@Component
public class NumberUtil {

	private static final String ONE_DECIMAL_FORMAT = "#.0";
	
	public static String formatOneDecimal(float value) {
		DecimalFormat formatter = new DecimalFormat(ONE_DECIMAL_FORMAT);
		return formatter.format(value);
	}
}
