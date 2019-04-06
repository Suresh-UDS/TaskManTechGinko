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
        return this.http.get(this.config.Url+'api/rateCard/types').map(
            response=>{
                console.log("Get Rate Card Types");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error In Getting Rate card Types");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getRateTypes(): Observable<any>{
        return this.http.get(this.config.Url+'api/rateCard/types').map(
            response=>{
                console.log("Rate Card Type");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in rate card types");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getUOMTypes(): Observable<any>{
        return this.http.get(this.config.Url+'api/rateCard/uom').map(
            response=>{
                console.log("Get UOM Type");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in getting UOM type");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createRateCard(rateCard):Observable<any>{
        return this.http.post(this.config.Url+'api/rateCard/create',rateCard).map(
            response=>{
                console.log("Create rate Card");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("error in create Rate Card");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getRateCards(): Observable<any>{
        return this.http.get(this.config.Url+'api/rateCard').map(
            response=>{
                console.log("Get Rate Cards");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("error in getting rate cards");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    searchQuotations(search):Observable<any>{
        return this.http.post(this.config.Url+'api/rateCard/quotation/search',search).map(
            response=>{
                console.log("Search Quotation");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("error in search quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getQuotations(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/rateCard/quotation/search',searchCriteria).map(
            response=>{
                console.log("Get Quotation");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("error in getting quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createQuotation(quotation): Observable<any>{
        return this.http.post(this.config.Url+'api/rateCard/quotation',quotation).map(
            response=>{
                console.log('Create Quotation');
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("error in creating quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    editQuotation(quotation): Observable<any>{
        return this.http.post(this.config.Url+'api/quotation/edit',quotation).map(
            response=>{
                console.log("edit Quotation");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("error in edit quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    sendQuotation(quotation): Observable<any>{
        return this.http.post(this.config.Url+'api/quotation/send',quotation).map(
            response=>{
                console.log("Send Quotation");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error in send quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    approveQuotation(quotation): Observable<any>{
        return this.http.post(this.config.Url+'api/rateCard/quotation/approve',quotation).map(
            response=>{
                console.log("Approve quotation");
                console.log(response);
                return response;
            }).catch(error=>{
                console.log("Error in approve quotation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createPDF():Observable<any>{
        return this.http.get(this.config.Url+'api/pdf/create').map(
            response=>{
                console.log("Create PDF");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Create PDF");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    uploadImage():Observable<any>{
        return this.http.get(this.config.Url+'api/quotation/image/upload').map(
            response=>{
                console.log("Image upload response");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Image Upload");
                console.log(error);
                return Observable.throw(error.json());
        })
    }


st
}
