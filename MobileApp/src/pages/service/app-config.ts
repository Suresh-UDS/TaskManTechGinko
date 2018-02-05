

import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;
    NodeUrl:String;
    StagingUrl:String;
    StagingNodeUrl:String;
}

export const AppConfig: ApplicationConfig={
    Url: "http://192.168.1.4:8088/",
    NodeUrl: "http://192.168.1.4:8088/",
    StagingUrl: "http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8088/",
    StagingNodeUrl: "http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/"
};

export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

