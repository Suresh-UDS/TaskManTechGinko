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
        var data={assetType: assetType, assetId: assetId}
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
                console.log("Get asset by Id");
                console.log(response);
                return response.json();
            }
        )
    }

    getAssetPPMSchedule(assetId):Observable<any>{
        return this.http.get(this.config.Url+'api/assets/'+assetId+'/ppmschedule').map(
            response=>{
                console.log("Get asset AMC Schedule by Id");
                console.log(response);
                return response.json();
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
    saveReading():Observable<any>{
        return this.http.post(this.config.Url+'api/assets/saveReadings',"").map(
            response=>{
                console.log("Save Reading");
                console.log(response);
                return response.json();
            }
        )
    }

    viewReading(assetId):Observable<any>{
        return this.http.get(this.config.Url+' api/assets/+ api/assets/'+assetId+'/viewReadings' ).map(
            response=>{
                console.log("View Reading");
                console.log(response);
                return response.json();
            }
        )
    }

}