import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";
import {ObserveOnMessage} from "rxjs/operators/observeOn";

@Injectable()
export class FeedbackService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getAllFeedbackQuestions(search):Observable<any>{
        return this.http.get(this.config.Url+'api/feedbackQuestions').map(
            response=>{
                console.log("Feedback response");
                console.log(response);
                console.log(response.json())
                return response.json();
            }
        )
    }

    findFeedback(id):Observable<any>{
        console.log("Feedback id in service");
        console.log(id);
        return this.http.get(this.config.Url+'api/feedbackmapping/'+id).map(
            response=>{
                console.log("Feedback");
                console.log(response.json());
            }
        )
    }

    loadBlocks(projectId, siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/location/project/' + projectId +'/site/' + siteId +'/block').map(
            response=>{
                console.log("Blocks");
                console.log(response.json());
                return response.json();
            }
        )
    }

    loadFloors(projectId, siteId, block):Observable<any>{
        return this.http.get(this.config.Url+'api/location/project/' + projectId +'/site/' + siteId + '/block/' + block + '/floor').map(
            response=>{
                console.log("Floor");
                console.log(response.json());
                return response.json();
            }
        )
    }

    loadZones(projectId, siteId, block, floor): Observable<any>{
        return this.http.get(this.config.Url+'api/location/project/' + projectId +'/site/' + siteId + '/block/' + block + '/floor/' + floor + '/zone').map(
            response=>{
                console.log("Zones");
                console.log(response.json());
                return response.json();
            }
        )
    }

    loadLocations(search):Observable<any>{
        return this.http.post(this.config.Url+'api/location/search', search).map(
            response=>{
                console.log("Loading locations");
                console.log(response.json());
                return response.json();
            }
        )
    }

    searchFeedbackMappings(search):Observable<any>{
        return this.http.post(this.config.Url+'api/feedbackmapping/search', search).map(
            response=>{
                console.log("Getting feedbacks");
                console.log(response.json());
                return response.json();
            }
        )
    }

    saveFeedback(transactionData):Observable<any>{
        return this.http.post(this.config.Url+'api/feedback',transactionData).map(
            response=>{
                console.log("Feedback saved");
                console.log(response);
                return response;
            }
        )
    }

}