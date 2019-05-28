import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;
    s3Bucket:String;

}

export const AppConfig: ApplicationConfig={
    //Url: "http://52.221.57.9:8088/",
    //  Url: "http://192.168.9.126:8088/",
      // Url: "http://18.138.150.146:8088/ ", // -- CLSS DEV box
    Url: "https://taskmanadmin.uds.in/",
    // Url: "http://13.232.248.92:8088/", // - UDS UAT box
    // Url: "http://52.66.186.185:8088/", // - UDS Dev box
    s3Bucket : "http://d1l2i6capbtjhi.cloudfront.net/prod/expenseDocuments/"


};
export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');
