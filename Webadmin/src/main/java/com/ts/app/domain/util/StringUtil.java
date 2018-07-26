package com.ts.app.domain.util;

public class StringUtil {
	
	public static final String SPACE = " ";
	public static final String NEW_LINE = "\n";

	public static String formatShiftTime(String shiftTime) {
		String[] shiftTimeArr = shiftTime.split(":");
		String startTime = shiftTimeArr[0];
		String endTime = shiftTimeArr[1];
		if(startTime.length() == 1) {
			startTime = "0" + startTime;
		}
		if(endTime.length() == 1) {
			endTime = "0" + endTime;
		}
		return startTime + ":" + endTime;
	}
}
