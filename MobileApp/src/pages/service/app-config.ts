import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;
    //QuotationServiceUrl:String;
    //LocationServiceUrl:String;


}

export const AppConfig: ApplicationConfig={
    // Url: "http://192.168.1.4:8088/",
    // NodeUrl: "http://192.168.1.4:8000/",
    Url: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/",
    // QuotationServiceUrl: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8001/",
    // LocationServiceUrl: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8000/"
    //Url: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8088/",
    //QuotationServiceUrl: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8001/",
    //LocationServiceUrl: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8000/"
    //Url: "http://ec2-13-250-35-18.ap-southeast-1.compute.amazonaws.com:8088/",
    //QuotationServiceUrl: "http://ec2-13-250-35-18.ap-southeast-1.compute.amazonaws.com:8001/",
    //LocationServiceUrl: "http://ec2-13-250-35-18.ap-southeast-1.compute.amazonaws.com:8000/"
};

export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

