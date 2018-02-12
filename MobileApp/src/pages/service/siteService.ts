import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class SiteService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    searchSite():Observable<any>{
        return this.http.get(this.config.Url+'api/site').map(
            (response)=>{
                return response;
            }
        )
    }

    searchSiteEmployee(siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/employee/site/'+siteId).map(
            response=>{
                return response;
            }
        )
    }

    getSites(employeeId) : Observable<any>{
        return this.http.get(this.config.Url+'api/site/employee/'+employeeId).map(
            response=>{
                console.log(response);
                return response
            }
        )
    }

    createSite(site): Observable<any>{
        return this.http.post(this.config.Url+'api/site',site).map(
            response=>{
                console.log(response);
                return response
            }
        )
    }

}