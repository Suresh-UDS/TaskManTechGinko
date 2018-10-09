import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";
import {ObserveOnSubscriber} from "rxjs/operators/observeOn";

@Injectable()
export class JobService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getJobs(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/jobs/search',searchCriteria).map(
            response=>{
                console.log(response.status);
                var allJobs = response.json();
                return allJobs;
            }
        )
    }

    createJob(job): Observable<any> {
        return this.http.post(this.config.Url + 'api/job', job).map(
            response => {
                console.log("create job");
                return response.json();
            })
    }

    checkOutJob(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/out',job).map(
            response=>{
                console.log("Checkout Job");
                return response.json();
            }
        )
    }

    updateJobImages(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/jobUpdate',job).map(
            response=>{
                console.log("update job images");
                return response.json();
            }
        )
    }


    saveJob(job):Observable<any>{
        return this.http.post(this.config.Url+'api/job/save',job).map(
            response=>{
                console.log("Save Job Success Response");
                return response.json();

            }).catch(error=>{
                console.log("Error in Save job");
                console.log(error);
                return Observable.throw(error.json()) ;
            }
        )
    }

    loadCheckLists(): Observable<any>{
        return this.http.get(this.config.Url+'api/checklist').map(
            response=>{
                console.log("Load Checklist");
                return response.json();
            }
        )
    }
    getJobDetails(jobId):Observable<any>{
        return this.http.get(this.config.Url+'api/job/'+jobId).map(
            response=>{
                console.log("Get JOb Details");
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
                console.log("Search Tickets");
                return response.json();
            }
        )
    }

    createTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket',ticket).map(
            response=>{
                console.log("Create Ticket");
                return response.json();
            }
        )
    }

    updateTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket/update',ticket).map(
            response=>{
                console.log("Update ticket");
                return response.json();
            }
        )
    }

    getTicketDetails(id):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/details/'+id).map(
            response=>{
                console.log("Getting Ticket Details");
                return response.json();
            }
        )
    }

    getTicketImages(ticketId,imageId):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/image/'+ticketId+'/'+imageId).map(
            response=>{
                console.log("Getting ticket Images");
                return response;
            }
        )
    }

    getLocationId(block,floor,zone,siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/location/block/'+block+'/floor/'+floor+'/zone/'+zone+'/siteId/'+siteId).map(
            response=>{
                console.log("Getting Location Id");
                return response.json();
            }
        )
    }

}