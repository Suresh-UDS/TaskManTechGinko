import {Injectable, InjectionToken} from "@angular/core";


export interface ApplicationConfig
{
    Url:String;

}

export const AppConfig: ApplicationConfig={
    // Url: "http://52.66.23.150:8088/",
    Url: "http://54.169.54.254:8088/",
    // Url: "http://13.232.248.92:8088/",
    // Url: "https://taskmanadmin.uds.in/"
    // Url: "https://beta.taskman.uds.in/"
    // Url: "http://10.0.0.21:8088/",
    // Url: "https://taskmanadmin.uds.in/",
    // Url: "http://13.234.55.99:8088/", // - Dev Server
};
export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');
