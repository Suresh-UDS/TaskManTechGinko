import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class AssetService {


    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    findAllAssets(): Observable<any>{
        var search={};
        return this.http.post(this.config.Url+'api/assets/search',search).map(
            (response)=>{
                console.log("Asset details service");
                console.log(response);
                return response.json();
            }
        )
    }

    searchAssets(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/asset/search',searchCriteria).map(
            response=>{
                console.log("Asset search");
                console.log(response);
                return response.json();
            }
        )
    }

    getAssetByCode(code): Observable<any>{
        return this.http.get(this.config.Url+'api/asset/code/'+code).map(
            response=>{
                console.log("Get asset by code service");
                console.log(response);
                return response.json();
            }
        )
    }

    getAssetConfig(assetType,assetId):Observable<any>{
        var data={assetType: assetType, assetId: assetId};
        return this.http.post(this.config.Url+'api/assets/config',data).map(
            response=>{
                console.log("Get asset config");
                console.log(response);
                return response.json();
            }
        )
    }

    getAssetById(assetId):Observable<any>{
        return this.http.get(this.config.Url+'api/asset/'+assetId).map(
            response=>{
                // console.log("Get asset by Id");
                // console.log(response);
                return response.json();
            }
        )
    }

    getAssetPPMSchedule(assetId):Observable<any>{
        return this.http.get(this.config.Url+'api/assets/'+assetId+'/ppmschedulelist').map(
            response=>{
                console.log("Get asset PPM Schedule by Id");
                console.log(response);
                return response.json();
            },error=>{
               console.log(error)
            })
    }
    getAssetAMCSchedule(assetId):Observable<any>{
        return this.http.get(this.config.Url+'api/assets/'+assetId+'/amcschedule').map(
            response=>{
                console.log("Get asset AMC Schedule by Id");
                console.log(response);
                return response.json();
            })
    }
    saveReading(assetReadings):Observable<any>{
        return this.http.post(this.config.Url+'api/assets/saveReadings',assetReadings).map(
            response=>{
                console.log("Save Reading");
                console.log(response);
                return response.json();
            }
        )
    }

    viewReading(searchCriteria):Observable<any>{
        // var searchCriteria={assetId : assetId};
        return this.http.post(this.config.Url+'api/assets/viewAssetReadings',searchCriteria).map(
            response=>{
                console.log("View Reading");
                console.log(response.json());
                return response.json();
            }
        )
    }

    getAssetType():Observable<any>{
        return this.http.get(this.config.Url+'api/assetType').map(
            response=>{
                console.log("Get Asset Type");
                return response.json();
            }
        )
    }

    getAssetGroup():Observable<any>{
        return this.http.get(this.config.Url+'api/assetgroup').map(
            response=>{
                console.log("Get Asset Group");
                return response.json();
            }
        )
    }

    getAssetPreviousReadings(assetId,assetParamId):Observable<any>{
        return this.http.get(this.config.Url+'api/assets/'+assetId+'/getLatestReading/'+assetParamId).map(
            response=>{
                console.log('Get Previous Reading');
                return response.json();
            }
        )
    }

    getPPMScheduleCalendar(assetId,searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/assets/'+assetId+'/ppmschedule/calendar',searchCriteria).map(
            response=>{
                console.log("Response for ppm schedule calendar");
                if(response.json()){
                    return response.json();
                }else{
                    var msg='No Data Found';
                    return msg;
                }
            }
        )
    }

    markBreakDown(asset):Observable<any>{
        return this.http.post(this.config.Url+'api/asset/breakDown',asset).map(
            response=>{
                console.log(response);
                return response
            }
        )
    }

    siteHistory(assetId):Observable<any>{
        return this.http.post(this.config.Url+'api/assets/siteHistory',assetId).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    statusHistory(search):Observable<any>{
        return this.http.post(this.config.Url+'api/assets/statusHistory',search).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    assetTicket(search):Observable<any>{
        return this.http.post(this.config.Url+'api/assets/tickets',search).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }


}