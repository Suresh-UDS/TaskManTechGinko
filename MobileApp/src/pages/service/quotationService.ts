import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class QuotationService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getRateCardTypes():Observable<any>{
        return this.http.get(this.config.QuotationServiceUrl+'api/rateCardTypes').map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getRateTypes(): Observable<any>{
        return this.http.get(this.config.QuotationServiceUrl+'api/rateCard/types').map(
            response=>{
                console.log(response);
                return response;
            }
        )
    }

    getUOMTypes(): Observable<any>{
        return this.http.get(this.config.QuotationServiceUrl+'api/rateCard/uom').map(
            response=>{
                console.log(response);
                return response;
            }
        )
    }

    createRateCard(rateCard):Observable<any>{
        return this.http.post(this.config.QuotationServiceUrl+'api/rateCard/create',rateCard).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getRateCards(): Observable<any>{
        return this.http.get(this.config.QuotationServiceUrl+'api/rateCard').map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }



    getQuotations(id): Observable<any>{
        return this.http.get(this.config.QuotationServiceUrl+'api/quotation/'+id).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    createQuotation(quotation): Observable<any>{
        return this.http.post(this.config.QuotationServiceUrl+'api/quotation/create',quotation).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    editQuotation(quotation): Observable<any>{
        return this.http.post(this.config.QuotationServiceUrl+'api/quotation/edit',quotation).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    sendQuotation(quotation): Observable<any>{
        return this.http.post(this.config.QuotationServiceUrl+'api/quotation/send',quotation).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    approveQuotation(quotation): Observable<any>{
        return this.http.post(this.config.QuotationServiceUrl+'api/quotation/approve',quotation).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    getAllRateCards():Observable<any>{
        return this.http.get(this.config.Url+'api/rateCard').map(
            response=>{
                console.log(response);
                console.log(response.json());
                return response.json();

            }
        )
    }

}