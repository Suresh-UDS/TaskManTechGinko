package com.ts.app.service.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DateUtil {
	
	private final static Logger log = LoggerFactory.getLogger(DateUtil.class);
	
	public static Date convertUTCToIST(Timestamp utcDate) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(utcDate.getTime());
		return convertUTCToIST(cal);
	}

	public static Date convertUTCToIST(Calendar utcDate) {
        String strdate = null;
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        strdate = formatter.format(utcDate.getTime());
        TimeZone obj = TimeZone.getTimeZone("Asia/Kolkata");
        formatter.setTimeZone(obj);
        strdate = formatter.format(utcDate.getTime());
        Date result = null;
        try {
			result = formatter.parse(strdate);
		} catch (ParseException e) {
			log.error("Error while parsing date from UTC to IST - " + e);
		}
        return result;
	}
	
	public static String formatUTCToIST(Calendar utcDate) {
        String strdate = null;
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        strdate = formatter.format(utcDate.getTime());
        TimeZone obj = TimeZone.getTimeZone("Asia/Kolkata");
        formatter.setTimeZone(obj);
        strdate = formatter.format(utcDate.getTime());
        return strdate;
	}
	
	public static java.sql.Date convertToSQLDate(Date utilDate) {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		cal.setTime(utilDate);
		java.sql.Date sqlDate = new java.sql.Date(cal.getTimeInMillis());
		return sqlDate;
	}
	
	
	public static Date convertToDateTime(String date, String time) {
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date dateTime = null;
		try {
			dateTime = formatter.parse(date + " " + time);
		} catch (ParseException e) {
			log.error("Error while parsing date and time - date -"+ date +", time -"+time,e);
		}
        
        return dateTime;

	}
	
	public static Date convertToDateTime(String date) {
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date dateTime = null;
		try {
			dateTime = formatter.parse(date);
		} catch (ParseException e) {
			log.error("Error while parsing date and time - date -"+ date ,e);
		}
        
        return dateTime;

	}
	
	public static Timestamp convertToTimestamp(Date date) {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Kolkata"));
		cal.setTime(date);
        Timestamp ts = new Timestamp(cal.getTimeInMillis());
        		
        return ts;

	}

	
	public static Date convertToDateTime(Date date, Date time) {
        DateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd");
        DateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
        String strDate = dtFormat.format(date);
        String strtime = timeFormat.format(time);
        
        return convertToDateTime(strDate, strtime);

	}
	
	public static String formatToDateString(Date date) {
        DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy");
        String strDate = dtFormat.format(date);
        return strDate;

	}
	
	public static String formatToDateTimeString(Date date) {
        DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy hh:mm a");
        String strDate = dtFormat.format(date);
        return strDate;

	}
}
