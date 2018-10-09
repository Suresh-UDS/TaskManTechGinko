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
                console.log("Getting Jobs");
                console.log(response.status);
                var allJobs = response.json();
                return allJobs;
            }).catch(error=>{
                console.log("Error in Getting Jobs");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createJob(job): Observable<any> {
        return this.http.post(this.config.Url + 'api/job', job).map(
            response => {
                console.log("create job");
                return response.json();
            }).catch(error=>{
                console.log("Error in create Job");
                console.log(error);
                return Observable.throw(error.json());

        })
    }

    checkOutJob(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/out',job).map(
            response=>{
                console.log("Checkout Job");
                return response.json();
            }).catch(error=>{
                console.log("Error In Checkout");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    updateJobImages(job):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/jobUpdate',job).map(
            response=>{
                console.log("update job images");
                return response.json();
            }).catch(error=>{
                console.log("Error in updating images");
                console.log(error);
                return Observable.throw(error.json());
        })
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
            }).catch(error=>{
                console.log("Error in loading checklist");
                console.log(error);
                return Observable.throw(error.json());
        })
    }
    getJobDetails(jobId):Observable<any>{
        return this.http.get(this.config.Url+'api/job/'+jobId).map(
            response=>{
                console.log("Get JOb Details");
                return response.json();
            }).catch(error=>{
                console.log("Error in getting job details");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getCompletedImage(employeeId,imageId):Observable<any>{
        return this.http.get(this.config.Url+'api/employee/'+employeeId+'/checkInOut/'+imageId).map(
            response=>{
                console.log("Getting Complete Job Image");
                return response;
            }).catch(error=>{
                console.log("Error in getting Complete Job Image");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    //Tickets
    searchTickets(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/tickets/search',searchCriteria).map(
            response=>{
                console.log("Search Tickets");
                return response.json();
            }).catch(error=>{
                console.log("Error in Search Tickets");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket',ticket).map(
            response=>{
                console.log("Create Ticket");
                return response.json();
            }).catch(error=>{
                console.log("Error in creating Ticket");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    updateTicket(ticket):Observable<any>{
        return this.http.post(this.config.Url+'api/ticket/update',ticket).map(
            response=>{
                console.log("Update ticket");
                return response.json();
            }).catch(error=>{
                console.log("Error in Updating Ticket");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getTicketDetails(id):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/details/'+id).map(
            response=>{
                console.log("Getting Ticket Details");
                return response.json();
            }).catch(error=>{
                console.log("Error in Getting Ticket Details");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getTicketImages(ticketId,imageId):Observable<any>{
        return this.http.get(this.config.Url+'api/ticket/image/'+ticketId+'/'+imageId).map(
            response=>{
                console.log("Getting ticket Images");
                return response;
            }).catch(error=>{
                console.log("Error in Getting Ticket Images");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getLocationId(block,floor,zone,siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/location/block/'+block+'/floor/'+floor+'/zone/'+zone+'/siteId/'+siteId).map(
            response=>{
                console.log("Getting Location Id");
                return response.json();
            }).catch(error=>{
                console.log("Error In Getting Location Id");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

}