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
    private mobile_url = "http://192.168.1.11:8088/";
    private aws_url = 'http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8088/';
    private staging_url = 'http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8088/';
    private node_url='http://192.168.1.11:8000/';
    private Node_url= this.node_url;
    private Url = this.mobile_url;
    private kairosResponse ={
        status :String,
        headers:String,
        responseText: String
    };
    loader:any;
    constructor(private http: HttpClient, private https:Http, public loadingCtrl: LoadingController, private toastCtrl: ToastController)
    {
    }

    // Kairos Api Calls
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

    getAllEmployees():Observable<any>{
        return this.http.get(this.Url+'api/employee').map(
            response=>{
                return response.json();
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

    markEnrolled(employee):Observable<any>{
        return this.http.post(this.Url+'api/employee/enroll',{id:employee.id,enrolled_face:employee.imageData}).map(
            (response)=>{
                console.log(response);
                return response;
            },(error)=>{
                console.log(error);
                return error;
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

    getEmployeeAttendances(employeeId) : Observable <any>{
        return this.http.post(this.Url+'api/attendance/'+employeeId,{employeeId:employeeId}).map(
            (response=>{
                console.log(response);
                return response;
            })
        )
    }

    getAllAttendances():Observable<any>{
        return this.http.get(this.Url+'api/attendance/').map(
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

    getSites(employeeId) : Observable<any>{
        return this.http.get(this.Url+'api/site/employee/'+employeeId).map(
            response=>{
                console.log(response);
                return response
            }
        )
    }

    createSite(site): Observable<any>{
        return this.http.post(this.Url+'api/site',site).map(
            response=>{
                console.log(response);
                return response
            }
        )
    }

    getTodayJobs(): Observable<any>{
        return this.http.post(this.Url+'api/jobs/date/search',{checkInDateTimeFrom:new Date()}).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getJobs(searchCriteria): Observable<any>{
        return this.http.post(this.Url+'api/jobs/date/search',{searchCriteria}).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getRateCardTypes():Observable<any>{
        return this.http.get(this.Node_url+'api/rateCardTypes').map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    createRateCard(rateCard):Observable<any>{
        return this.http.post(this.Node_url+'api/rateCard/create',rateCard).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    getRateCards(): Observable<any>{
        return this.http.get(this.Node_url+'api/rateCard').map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    createJob(job): Observable<any> {
        return this.http.post(this.Url + 'api/job', job).map(
            response => {
                return response;
            })
    }

    getQuotations(): Observable<any>{
        return this.http.get(this.Node_url+'api/quotation').map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    createQuotation(quotation): Observable<any>{
        return this.http.post(this.Node_url+'api/quotation/create',quotation).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    checkOutJob(job):Observable<any>{
        return this.http.post(this.Url+'api/employee/out',job).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    getClientDetails(id):Observable<any>{
        return this.http.get(this.Url+'api/project/'+id).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
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
