import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "../Interceptor/HttpClient"

import { map } from "rxjs/operator/map";
import { Inject, Injectable } from "@angular/core";
import { LoadingController, ToastController } from "ionic-angular";
import { AppConfig, ApplicationConfig, MY_CONFIG_TOKEN } from "./app-config";
import { ObserveOnSubscriber } from "rxjs/operators/observeOn";
import { windowTime } from '../../../node_modules/rxjs/operators';

@Injectable()
export class OnboardingService {
    leaddetails : any;

    BASE_URL = 'http://13.127.251.152:8088';

    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) 
    private config: ApplicationConfig) {
    }

    AllProjects(): Observable<any> {
        return this.http.get('http://13.127.251.152:8080/api/onboard/getProjectList').map(
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
        return this.http.get('http://172.16.1.45:8080/api/onboard/getWBSListByProjectIds/[' + id + ']').map(
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
      //  let url = 'http://172.16.1.57:8090/api/onboard/getEmployeeListByWbs/UDS200008570001';
       let url = this.BASE_URL+'/api/onboard/getEmployeeListByWbs/' + wbsId;
        return this.http.get(url).map(
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
        return this.http.post( this.BASE_URL+'/api/employees', object).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log("error in find site");
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    getAllOnboardingUser(): Observable<any> {
        return this.http.get('assets/data/emp_old.json').map(
            response => {
                return JSON.parse(response['_body']);
            }).catch(error => {
                return Observable.throw(error.json());
            })
    }

     initGetEmployeeListByWbs(): Observable<any>{
       //  let url = 'http://172.16.1.45:8080/api/getWbsDetailsByEmpIds/['+ empId+']';
      //  let url =  'http://172.16.1.57:8090/api/onboard/getWbsDetailsByEmpIds/[3892]';
         let url =  this.BASE_URL+'/api/onboard/getWbsDetailsByEmpIds/['+window.localStorage.getItem('empUserId')+']';
         console.log(url);
         return this.http.get(url).map(response => {
            this.leaddetails = response.json();
            for(var i = 0; i < this.leaddetails.length; i++){
                  console.log('res init2' + this.leaddetails[i].wbsId); //here you'll get sendernewcall value for all entry
            }
                 console.log('resp_init ' + this.leaddetails[0].wbsId);
                 return this.leaddetails[0].wbsId;
         }).catch(error => {
             console.log(error);
             return Observable.throw(error.json);
         })
     }
}