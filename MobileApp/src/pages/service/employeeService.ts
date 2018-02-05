import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class EmployeeService {
    constructor(private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig) {

    }

    getAllEmployees():Observable<any>{
        return this.http.get(this.config.Url+'api/employee').map(
            response=>{
                return response.json();
            }
        )
    }

    markEnrolled(employee):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/enroll',{id:employee.id,enrolled_face:employee.imageData}).map(
            (response)=>{
                console.log(response);
                return response;
            },(error)=>{
                console.log(error);
                return error;
            }
        )
    }


}