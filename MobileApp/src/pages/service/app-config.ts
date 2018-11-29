import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;

}

export const AppConfig: ApplicationConfig={
    Url: "http://52.221.57.9:8088/",
    // Url: "https://taskmanadmin.uds.in/",
    // Url: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/", // - Dev Server
    // Url: "http://52.221.57.9.ap-southeast-1.compute.amazonaws.com:8088/", // - Dev Server - release 2.0
    // Url: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8088/",
    // Url: "http://ec2-35-154-182-53.ap-south-1.compute.amazonaws.com:8088/",
    // Url: "http://ec2-52-221-240-148.ap-southeast-1.compute.amazonaws.com:8088/", // - Demo server
};
export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');
