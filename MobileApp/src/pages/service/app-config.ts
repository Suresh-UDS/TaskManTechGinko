import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;
    //QuotationServiceUrl:String;
    //LocationServiceUrl:String;


}

export const AppConfig: ApplicationConfig={
    // Url: "http://192.168.1.4:8088/",
    // Url: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/",
    Url: "https://taskmanapi.uds.in/",
};

export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

