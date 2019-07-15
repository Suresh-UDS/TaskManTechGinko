package com.ts.app.service.util;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DateUtil {

	private final static Logger log = LoggerFactory.getLogger(DateUtil.class);

	public static Date convertUTCToIST(Timestamp utcDate) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(utcDate.getTime());
		return convertUTCToIST(cal);
	}
	
	public static Date addDaysInDate(Date date,int days) {
		
		Calendar calender = Calendar.getInstance();
		
		calender.setTime(date);
		
		calender.add(Calendar.DATE,days);
		
		return calender.getTime();
		
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

	public static String formatToDateString(Date date,String format) {
		if(date != null) {
	        DateFormat dtFormat = new SimpleDateFormat(format);
	        String strDate = dtFormat.format(date);
	        return strDate;
		}
		return StringUtils.EMPTY;
	}
	
	public static String formatToDateString(Date date) {
		if(date != null) {
	        DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy");
	        String strDate = dtFormat.format(date);
	        return strDate;
		}
		return StringUtils.EMPTY;
	}

	public static String formatToDateTimeString(Date date) {
		if(date != null) {
	        DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy hh:mm a");
	        String strDate = dtFormat.format(date);
	        return strDate;
		}
		return StringUtils.EMPTY;
	}

	public static String formatToZonedDateTimeString(ZonedDateTime zonedDateTime) {
		if(zonedDateTime != null) {
		    try{
                DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy hh:mm a");
//                String strDate = dtFormat.format(zonedDateTime);
                DateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", new Locale("en","IN"));

                String inputText = "2012-11-17T00:00:00.000-05:00";
                Date date = inputFormat.parse(zonedDateTime.toString());
                String outputText = dtFormat.format(date);
                return outputText;

            }catch (Exception e){
		        log.debug("Error in converting - "+e);
		        return StringUtils.EMPTY;
            }

		}
		return StringUtils.EMPTY;
	}

	public static ZonedDateTime convertToZDT(Date date) {
		ZonedDateTime zdt = ZonedDateTime.ofInstant(date.toInstant(), ZoneId.of("Asia/Kolkata"));
		return zdt;
	}

	public static String formatTo24HourDateTimeString(Date date) {
		if(date != null) {
	        DateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
	        String strDate = dtFormat.format(date);
	        return strDate;
		}
		return StringUtils.EMPTY;
	}

	public static Date parseToDateTime(String time) {
		if(org.apache.commons.lang3.StringUtils.isNotEmpty(time)) {
	        DateFormat dtFormat = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy");
	        Date date = null;
			try {
				date = dtFormat.parse(time);
			} catch (ParseException e) {
				log.error("Error while parsing the time", e);
			}
	        return date;
		}
		return null;
	}

	public static long getDiff(Calendar startDate, Calendar endDate) {
		long millisecs = endDate.getTimeInMillis() - startDate.getTimeInMillis();
		long secs = millisecs / 1000;
		long mins = (secs / 60);
		return mins;
	}

	public static void main(String arg[]) {
		String dateValue = "Thu Jul 19 09:25:00 IST 2018";
		Date d = parseToDateTime(dateValue);
		Calendar now = Calendar.getInstance();
		now.set(Calendar.SECOND,  0);
		now.set(Calendar.MILLISECOND, 0);
		Calendar alertTimeCal = Calendar.getInstance();
		alertTimeCal.setTime(d);
		alertTimeCal.set(Calendar.DAY_OF_MONTH, now.get(Calendar.DAY_OF_MONTH));
		alertTimeCal.set(Calendar.MONTH, now.get(Calendar.MONTH));
		alertTimeCal.set(Calendar.YEAR, now.get(Calendar.YEAR));
		alertTimeCal.set(Calendar.SECOND, 0);
		alertTimeCal.set(Calendar.MILLISECOND, 0);
		System.out.println(alertTimeCal.getTime());
		System.out.println(" date match - " + alertTimeCal.equals(now));
	}
}
