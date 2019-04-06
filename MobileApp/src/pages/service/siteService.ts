import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "../Interceptor/HttpClient"
import { map } from "rxjs/operator/map";
import { Inject, Injectable } from "@angular/core";
import { LoadingController, ToastController } from "ionic-angular";
import { AppConfig, ApplicationConfig, MY_CONFIG_TOKEN } from "./app-config";

@Injectable()
export class SiteService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    searchSite(): Observable<any> {
        return this.http.get(this.config.Url + 'api/site').map(
            (response) => {
                return response.json();
            }).catch(error => {
                console.log("Error in Search Site");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    searchSites(searchCriteria): Observable<any> {
        return this.http.post(this.config.Url + 'api/site/search', searchCriteria).map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("Error in searching sites");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    findSitesByProject(projectId): Observable<any> {
        return this.http.get(this.config.Url + 'api/project/' + projectId + '/sites').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in find site by project");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    searchProjects(searchCriteria): Observable<any> {
        return this.http.post(this.config.Url + 'api/project/search', searchCriteria).map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in ser=arching projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    getAllProjects(): Observable<any> {
        return this.http.get(this.config.Url + 'api/project/').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    findSites(projectId): Observable<any> {
        return this.http.get(this.config.Url + 'api/project/' + projectId + '/sites').map(
            response => {
                return response.json();
            }).catch(error => {
                console.log("error in find site");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    findBlock(siteId): Observable<any> {
        return this.http.get(this.config.Url + 'api/block/' + siteId).map(
            response => {
                return response;
            }).catch(error => {
                console.log("error in find block");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    findZone(blockId): Observable<any> {
        return this.http.get(this.config.Url + 'api/zone/' + blockId).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log("error in finding zone");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    searchSiteEmployee(siteId): Observable<any> {
        return this.http.get(this.config.Url + 'api/empAttendance/site/' + siteId).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log("error in Search site employee");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    getSites(employeeId): Observable<any> {
        return this.http.get(this.config.Url + 'api/site/employee/' + employeeId).map(
            response => {
                console.log(response);
                return response.json();
            }).catch(error => {
                console.log("error in getting sites");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    createSite(site): Observable<any> {
        return this.http.post(this.config.Url + 'api/site', site).map(
            response => {
                console.log(response);
                return response.json();
            }).catch(error => {
                console.log("error in create sites");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

}