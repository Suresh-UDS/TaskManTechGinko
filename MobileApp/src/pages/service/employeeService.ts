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
                console.log("Getting Employees");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in getting Employees");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    searchEmployees(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/search',searchCriteria).map(
            response=>{
                console.log("Searching Employees");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in searching employees");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getAllDesignations():Observable<any>{
        return this.http.get(this.config.Url+'api/designation').map(
            response=>{
                console.log("Getting All Designation");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Getting All Designation");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    markEnrolled(employee):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/enroll',{id:employee.id,enrolled_face:employee.imageData}).map(
            (response)=>{
                console.log("Mark Enrolled");
                console.log(response);
                return response.json();
            },(error)=>{
                console.log(error);
                return error;
            }).catch(error=>{
                console.log("Error in Mark Enrolled");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    createEmployee(employee):Observable<any>{
        return this.http.post(this.config.Url+'api/employee',employee).map(
            response=>{
                console.log('Creating Employees');
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Creating Employees");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getUserRole(employeeId):Observable<any>{
        return this.http.get(this.config.Url+'api/userRole/'+employeeId).map(
            response=>{
                console.log("Getting User role");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error In Getting User Role");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getUser(employeeId):Observable<any>{
        return this.http.get(this.config.Url+'api/users/'+employeeId).map(
            response=>{
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error in getting user");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getUserRolePermissions(searchCriteria): Observable<any>{
        return this.http.post(this.config.Url+'api/userRolePermission/search',searchCriteria).map(
            response=>{
                console.log("Getting User Role Permission");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error in Getting User role Permission");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    enrollFace(employee):Observable<any>{
        return this.http.post(this.config.Url+'api/employee/enroll',employee).map(
            response=>{
                console.log("Enrolling Face");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Enrolling Face");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    enrollAllFaces():Observable<any>{
        return this.http.get(this.config.Url+'api/all/enroll').map(
            response=>{
                console.log("Enroll All Face");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error in Enroll");
                console.log(error);
                return Observable.throw(error.json());
        })
    }


}