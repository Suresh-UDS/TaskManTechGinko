import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";
import {ObserveOnMessage} from "rxjs/operators/observeOn";

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

    searchEmployees(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/search',searchCriteria).map(
            response=>{
                return response.json();
            }
        )
    }

    getAllDesignations():Observable<any>{
        return this.http.get(this.config.Url+'api/designation').map(
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

    createEmployee(employee):Observable<any>{
        return this.http.post(this.config.Url+'api/employee',employee).map(
            response=>{
                console.log(response);
                return response;
            }
        )
    }

    getUserRole(employeeId):Observable<any>{
        return this.http.get(this.config.Url+'api/userRole/'+employeeId).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    getUser(employeeId):Observable<any>{
        return this.http.get(this.config.Url+'api/users/'+employeeId).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    getUserRolePermissions(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/userRolePermission/search',searchCriteria).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }


}