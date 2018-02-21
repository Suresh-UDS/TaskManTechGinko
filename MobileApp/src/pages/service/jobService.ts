import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class JobService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getTodayJobs(): Observable<any>{
        return this.http.post(this.config.Url+'api/jobs/date/search',{checkInDateTimeFrom:new Date()}).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getJobs(searchCriteria): Observable<any>{
        console.log(searchCriteria);
        return this.http.post(this.config.Url+'api/jobs/search',{searchCriteria}).map(
            response=>{
                console.log(response);
                var allJobs = response.json();
                return allJobs.transactions;
            }
        )
    }

    createJob(job): Observable<any> {
        return this.http.post(this.config.Url + 'api/job', job).map(
            response => {
                return response;
            })
    }

    checkOutJob(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/out',job).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    loadCheckLists(): Observable<any>{
        return this.http.get(this.config.Url+'api/checklist').map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

}