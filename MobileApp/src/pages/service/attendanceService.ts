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
                console.log("Get Site Attendance");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error In get site Attendance");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    markAttendanceCheckIn(siteId,empId,lat,long,imageData,checkInTime,offline):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance',{siteId:siteId,employeeEmpId:empId,latitudeIn:lat,longitudeIn:long,checkInImage:imageData,checkInTime:checkInTime,offline:offline}).map(
            (response)=>{
                console.log("Check in");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error In Check In");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    markAttendanceCheckOut(siteId,empId,lat,long,imageData,attendanceId,checkOutTime,offline):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/save',{siteId:siteId,employeeEmpId:empId,latitudeOut:lat,longitudeOut:long,checkOutImage:imageData,id:attendanceId,checkOutTime:checkOutTime,offline:offline}).map(
            (response)=>{
                console.log("Check out");
                console.log(response);
                return response.json();
            }).catch(error=>{
                console.log("Error in Check Out");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getAttendances(employeeId,siteId) : Observable <any>{
        return this.http.post(this.config.Url+'api/attendance/site/'+siteId+'/employee/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log("Getting Attendances");
                console.log(response);
                return response.json();
            })).catch(error=>{
                console.log("Error in getting attendances");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getEmployeeAttendances(employeeId) : Observable <any>{
        return this.http.post(this.config.Url+'api/attendance/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log("Getting Employee Attendances");
                console.log(response);
                return response.json();
            })).catch(error=>{
                console.log("Error in getting employee attendances");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    getAllAttendances():Observable<any>{
        return this.http.get(this.config.Url+'api/attendance/').map(
            (response=>{
                console.log("Getting All Attendances");
                console.log(response);
                return response.json();
            })).catch(error=>{
                console.log("Error in Getting All Attendances");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    searchAttendances(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/search',searchCriteria).map(
            response=>{
                console.log("Search Attendance");
                console.log(response.json());
                return response.json();
            }).catch(error=>{
                console.log("Error in Search Attendance");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    checkSiteProximity(siteId,lat,lng):Observable<any>{
        var siteDetails = {
            siteId:siteId,
            lat:lat,
            lng:lng
        };
        return this.http.post(this.config.Url+'api/proximityCheck',siteDetails ).map(
            (response)=>{
                console.log("check site proximity");
                console.log(response);
                return response;
            }).catch(error=>{
                console.log("Error in check site proximity");
                console.log(error);
                return Observable.throw(error.json());
        })
    }

    searchEmpAttendances(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/empAttendance/site/',searchCriteria)
            .map(
                (response)=>{
                    console.log("Search Employee Attendance");
                    console.log(response);
                    return response.json();
                }).catch(error=>{
                    console.log("Error in Search Employee Attendance");
                    console.log(error);
                    return Observable.throw(error.json());
            })
    }

    addRemarks(attendanceId,remarks): Observable<any>{
        return this.http.post(this.config.Url+'api/attendance/'+attendanceId+'/addRemarks',remarks)
            .map(
                response=>{
                    console.log("Add Remarks");
                    console.log(response);
                    return response.json();
                }).catch(error=>{
                    console.log("Error in Add Remarks");
                    console.log(error);
                    return Observable.throw(error.json());
            })
    }

}