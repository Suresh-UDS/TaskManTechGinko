package com.ts.app.service.util;

import java.text.DecimalFormat;

import org.springframework.stereotype.Component;

@Component
public class NumberUtil {

	private static final String ONE_DECIMAL_FORMAT = "#.0";
	
	public static String formatOneDecimal(float value) {
		DecimalFormat formatter = new DecimalFormat(ONE_DECIMAL_FORMAT);
		return formatter.format(value);
	}
}
