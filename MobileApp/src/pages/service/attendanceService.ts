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

    getAttendances(employeeId) : Observable <any>{
        return this.http.post(this.config.Url+'api/attendance/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log(response);
                return response;
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

    checkSiteProximity(siteId,lat,lng):Observable<any>{
        return this.http.get('http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/api/site/nearby?'+'siteId='+siteId+'&'+'lat='+lat+'&lng='+lng ).map(
            (response)=>{
                console.log(response)
                return response
            },error=>{
                return error
            }
        )
    }

}