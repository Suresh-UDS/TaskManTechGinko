import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "../Interceptor/HttpClient"

import { map } from "rxjs/operator/map";
import { Inject, Injectable } from "@angular/core";
import { LoadingController, ToastController } from "ionic-angular";
import { AppConfig, ApplicationConfig, MY_CONFIG_TOKEN } from "./app-config";
import { ObserveOnSubscriber } from "rxjs/operators/observeOn";
import { windowTime } from '../../../node_modules/rxjs/operators';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {AutoCompleteService} from 'ionic2-auto-complete';
import 'rxjs/add/operator/map';

@Injectable()
export class GetWBSListService implements AutoCompleteService {
    leaddetails: any;
    labelAttribute = "element";
   
    formValueAttribute = "numericCode";
    element: any;

    BASE_URL = 'http://13.127.251.152:8088';

    constructor(private transfer: FileTransfer,  private http: Http, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN)
    private config: ApplicationConfig) { 
    } 

    
     getResults(keyword:string): Observable<any> {
         return this.http.get('http://localhost:8088/api/getWBSListByProjectId')
          //return this.http.get('https://restcountries.eu/rest/v1/name/'+keyword)
          .map(
            result =>
            {
              return result.json()
                .filter(item => item.element.toLowerCase() )
            });
 }


 
}