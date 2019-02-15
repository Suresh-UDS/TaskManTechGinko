import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "../Interceptor/HttpClient"

import { map } from "rxjs/operator/map";
import { Inject, Injectable } from "@angular/core";
import { LoadingController, ToastController } from "ionic-angular";
import { AppConfig, ApplicationConfig, MY_CONFIG_TOKEN } from "./app-config";
import { ObserveOnSubscriber } from "rxjs/operators/observeOn";

@Injectable()
export class OnboardingService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    AllProjects(): Observable<any> {
        return this.http.get('http://172.16.1.45:8080/getProjectList').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    allSites(id): Observable<any> {
        console.log(id);
        return this.http.get('http://172.16.1.45:8080/getWBSListByProjectIds/[' + id + ']').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    getEmployeeListByWbs(wbsId): Observable<any> {
        return this.http.get('http://172.16.1.97:8088/api/getEmployeeListByWbs/[' + wbsId + ']').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    saveOnboardingUser(object, index) {
        object['isSync'] = true;
        return this.http.post(this.config.Url + 'api/project', object).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log("error in find site");
                console.log(error);
                return Observable.throw(error.json());
            })
    }
}