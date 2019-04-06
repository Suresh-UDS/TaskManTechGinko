import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;
    s3Bucket:String;

}

export const AppConfig: ApplicationConfig={
    //Url: "http://52.221.57.9:8088/",
    //UAT Url: "http://13.127.251.152:8088/",
    // Url: "http://13.234.119.73:8088/",
    Url: "https://taskmanadmin.uds.in/",
    s3Bucket : "https://s3.ap-south-1.amazonaws.com/prod/expenseDocuments/"
    // Url: "http://10.0.0.7:8088/",
    // Url: "https://taskmanadmin.uds.in/",
    // Url: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/", // - Dev Server
    // Url: "http://ec2-52.221.57.9.ap-southeast-1.compute.amazonaws.com:8088/", // - Dev Server - release 2.0
    // Url: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8088/",
    // Url: "http://ec2-52-221-240-148.ap-southeast-1.compute.amazonaws.com:8088/", // - Demo server
      
};
export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');
