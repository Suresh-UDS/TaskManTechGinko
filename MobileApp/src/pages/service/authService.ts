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
export class authService
{
  private Url_local = 'http://localhost:8000/';
  private mobile_url = "http://192.168.1.8:8088/";
  private aws_url = '';
  private Url = this.mobile_url;
  private kairosResponse ={
    status :String,
    headers:String,
    responseText: String
  };

  constructor(private http: HttpClient, private https:Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController)
  {
  }

  login(username,password):Observable<any>{
    return this.https.post(this.Url+'api/auth/'+username+'/'+password,{username:username,password:password}).map(
      (response)=>
      {
          return response;
      });
  }

  searchSite():Observable<any>{
    return this.http.get(this.Url+'api/site').map(
      (response)=>{
        return response;
      }
    )
  }

  searchSiteEmployee(siteId):Observable<any>{
    return this.http.get(this.Url+'api/employee/site/'+siteId).map(
      response=>{
        return response;
      }
    )
  }

  getSiteAttendances(siteId): Observable<any>{
    return this.http.get(this.Url+'api/attendance/site/'+siteId).map(
      (response)=>{
        return response;
      }
    )
  }

  enrollFace(employeeName, base64Image):Observable<any>{
    return this.http.kairosPost('https://api.kairos.com/enroll',{image:base64Image, subject_id:employeeName, gallery_name:'Employee'}).map(
      (response)=>{
        console.log(response);
        return response
      }
    )
  }

  verifyUser(employeeName, base64Image):Observable<any>{
    return this.http.kairosPost('https://api.kairos.com/verify',{image:base64Image, subject_id:employeeName, gallery_name:'Employee'}).map(
      (response)=>{
        console.log(response);
        return response
      }
    )
  }

  detectFace(employeeName, base64Image):Observable<any>{
    return this.http.kairosPost('https://api.kairos.com/detect',{image:base64Image, selector:'ROLL'}).map(
      (response)=>{
        console.log(response);
        return response
      },(error)=>{
        console.log(error);
      }
    )
  }

  markAttendanceCheckIn(siteId,empId,lat,long,imageData):Observable<any>{
    return this.http.post(this.Url+'api/attendance',{siteId:siteId,employeeEmpId:empId,latitudeIn:lat,longitudeIn:long,checkInImage:imageData}).map(
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
    return this.http.post(this.Url+'api/attendance/save',{siteId:siteId,employeeEmpId:empId,latitudeOut:lat,longitudeOut:long,checkOutImage:imageData,id:attendanceId}).map(
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
    return this.http.post(this.Url+'api/attendance/'+employeeId,{employeeId:employeeId}).map(
      (response=>{
        console.log(response);
        return response;
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
