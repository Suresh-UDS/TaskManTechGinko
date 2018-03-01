package com.ts.app.service.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CommonUtil {
	
	public static String convertToString(List<String> stringList) {
		return String.join(",", stringList);
	}
	
	public static List<String> convertToList(String values, String delimiter) {
		if(StringUtils.isEmpty(delimiter)) {
			delimiter = ",";
		}
		return new ArrayList<String>(Arrays.asList(values.split(delimiter)));
	}
}
