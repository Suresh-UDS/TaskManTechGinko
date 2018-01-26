/**
 * Created by admin on 12/26/2017.
 */
import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";

@Injectable()
export class componentService
{

    loader:any;
    constructor(public loadingCtrl: LoadingController, private toastCtrl: ToastController)
    {
    }


    // Loader
    showLoader(msg){
        this.loader = this.loadingCtrl.create({
            content:msg
        });
        this.loader.present();
    }

    closeLoader(){
        this.loader.dismiss();
    }
}
