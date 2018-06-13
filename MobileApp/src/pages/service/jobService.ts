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

    getJobs(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/jobs/search',searchCriteria).map(
            response=>{
                var allJobs = response.json();
                return allJobs;
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
                return response.json();
            }
        )
    }

    updateJobImages(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/jobUpdate',job).map(
            response=>{
                return response.json();
            }
        )
    }


    saveJob(job):Observable<any>{
        return this.http.post(this.config.Url+'api/job/save',job).map(
            response=>{
                return response.json();
            }
        )
    }

    loadCheckLists(): Observable<any>{
        return this.http.get(this.config.Url+'api/checklist').map(
            response=>{
                return response.json();
            }
        )
    }
    getJobDetails(jobId):Observable<any>{
        return this.http.get(this.config.Url+'api/job/'+jobId).map(
            response=>{
                return response.json();
            }
        )
    }

    getCompletedImage(employeeId,imageId):Observable<any>{
        return this.http.get(this.config.Url+'api/employee/'+employeeId+'/checkInOut/'+imageId).map(
            response=>{
                return response;
            }
        )
    }

    //Tickets
    searchTickets(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/tickets/search',searchCriteria).map(
            response=>{
                return response.json();
            }
        )
    }

    createTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket',ticket).map(
            response=>{
                return response.json();
            }
        )
    }

    updateTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket/update',ticket).map(
            response=>{
                return response.json();
            }
        )
    }

    getTicketDetails(id):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/details/'+id).map(
            response=>{
                return response.json();
            }
        )
    }

    getTicketImages(ticketId,imageId):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/image/'+ticketId+'/'+imageId).map(
            response=>{
                return response;
            }
        )
    }

}