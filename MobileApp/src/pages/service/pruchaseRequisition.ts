import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class InventoryService {

    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    saveMaterialIndent(indent):Observable<any>{
        return this.http.post(this.config.Url+'api/save/materialIndent',indent).map(
            response=>{
                console.log(response);
                return response.json();
            },err=>{
                console.log(err);
                return err;
            }
        )
    }

    searchMaterialIndents(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/materialIndent/search',searchCriteria).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    updateMaterialIndent():Observable<any>{
        return this.http.p
    }

}