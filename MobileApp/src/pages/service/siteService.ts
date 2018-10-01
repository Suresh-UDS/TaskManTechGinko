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
                return response.json();
            },err=>{
                return err
            }
        )
    }

    searchSites(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/site/search',searchCriteria).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    findSitesByProject(projectId):Observable<any>{
        return this.http.get(this.config.Url+'api/project/'+projectId+'/sites').map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    searchProjects(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/project/search',searchCriteria).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    getAllProjects():Observable<any>{
        return this.http.get(this.config.Url+'api/project/').map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    findSites(projectId): Observable<any>{
        return this.http.get(this.config.Url+'api/project/'+projectId+'/sites').map(
            response=>{
                return response.json();
            }
        )
    }

    findBlock(siteId): Observable<any>{
        return this.http.get(this.config.Url+'api/block/'+siteId).map(
            response=>{
                return response;
            }
        )
    }

    findZone(blockId): Observable<any>{
        return this.http.get(this.config.Url+'api/zone/'+blockId).map(
            response=>{
                return response.json();
            }
        )
    }

    searchSiteEmployee(siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/empAttendance/site/'+siteId).map(
            response=>{
                return response.json();
            }
        )
    }

    getSites(employeeId) : Observable<any>{
        return this.http.get(this.config.Url+'api/site/employee/'+employeeId).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    createSite(site): Observable<any>{
        return this.http.post(this.config.Url+'api/site',site).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }


}