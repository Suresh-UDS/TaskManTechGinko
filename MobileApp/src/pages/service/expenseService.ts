import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";
import {ObserveOnMessage} from "rxjs/operators/observeOn";
import {getResponseURL} from "@angular/http/src/http_utils";


@Injectable()
export class ExpenseService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getExpenseCategories():Observable<any>{
        return this.http.get(this.config.Url+'api/expenseCategories').map(
            response=>{
                return response.json();
            }
        )
    }

    searchExpenses(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/expenses',searchCriteria).map(
            response =>{
                return response.json();
            }
        )
    }

    saveExpenses(expenseDetails):Observable<any>{
        return this.http.post(this.config.Url+'api/expense',expenseDetails).map(
            response=>{
                return response.json();
            }
        )
    }

    getLatestRecordBySite(siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/expenses/latest/'+siteId).map(
            response=>{
                return response.json();
            }
        )
    }

    getCategoriesBySite(searchCriteria):Observable<any>{
      return this.http.post(this.config.Url+'api/expenses/site/category',searchCriteria).map(
        response=>{
          return response.json();
        }
      )
    }

    getOverallData(siteId):Observable<any>{
        return this.http.get(this.config.Url+'api/expenses/getData/'+siteId).map(
            response=>{
                return response.json();
            }
        )
    }

    getCategoryWiseTransactions(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/expenses/category',searchCriteria).map(
            response=>{
                return response.json();
            }
        )
    }

    getCreditTransactions(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/expenses/credit',searchCriteria).map(
            response=>{
                return response.json();
            }
        )
    }
}
