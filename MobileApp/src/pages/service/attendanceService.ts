import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class AttendanceService
{
    constructor(private http: HttpClient, private https:Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig){

    }

    getSiteAttendances(siteId): Observable<any>{
        return this.http.get(this.config.Url+'api/attendance/site/'+siteId).map(
            (response)=>{
                return response;
            }
        )
    }

    markAttendanceCheckIn(siteId,empId,lat,long,imageData):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance',{siteId:siteId,employeeEmpId:empId,latitudeIn:lat,longitudeIn:long,checkInImage:imageData}).map(
            (response)=>{
                console.log(response);
                return response;
            },(error)=>{
                console.log(error);
                return error;
            }
        )
    }

    markAttendanceCheckOut(siteId,empId,lat,long,imageData,attendanceId):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/save',{siteId:siteId,employeeEmpId:empId,latitudeOut:lat,longitudeOut:long,checkOutImage:imageData,id:attendanceId}).map(
            (response)=>{
                console.log(response);
                return response;
            },(error)=>{
                console.log(error);
                return error;
            }
        )
    }

    getAttendances(employeeId,siteId) : Observable <any>{
        return this.http.post(this.config.Url+'api/attendance/site/'+siteId+'/employee/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log(response);
                return response.json();
            })
        )
    }

    getEmployeeAttendances(employeeId) : Observable <any>{
        return this.http.post(this.config.Url+'api/attendance/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log(response);
                return response;
            })
        )
    }

    getAllAttendances():Observable<any>{
        return this.http.get(this.config.Url+'api/attendance/').map(
            (response=>{
                console.log(response);
                return response.json();
            })
        )
    }

    searchAttendances(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/search',searchCriteria).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    checkSiteProximity(siteId,lat,lng):Observable<any>{
        var siteDetails = {
            siteId:siteId,
            lat:lat,
            lng:lng
        };
        return this.http.post(this.config.Url+'api/proximityCheck',siteDetails ).map(
            (response)=>{
                console.log(response)
                return response
            },error=>{
                return error
            }
        )
    }

    searchEmpAttendances(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/empAttendance/site/',searchCriteria)
            .map(
                (response)=>{
                    return response.json();
                },error=>{
                    return error
                }
            )
    }

    addRemarks(attendanceId,remarks): Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/'+attendanceId+'/addRemarks',remarks)
            .map(
                response=>{
                    return response.json();
                }
            )
    }

}