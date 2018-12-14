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

    getAllGroups():Observable<any>{
        return this.http.get(this.config.Url+'api/materialItemgroup').map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getMaterialsByGroup(groupId): Observable<any>{
        return this.http.get(this.config.Url+'api/material/itemgroup/'+groupId).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getMaterials(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/inventory/search',searchCriteria).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    inventoryTransactionList(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/inventoryTrans/search',searchCriteria).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    saveInventoryTransaction(transactionDetails):Observable<any>{
        return this.http.post(this.config.Url+'api/saveInventory/transaction',transactionDetails).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    inventorySearch(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/inventory/search',searchCriteria).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )

    }






}