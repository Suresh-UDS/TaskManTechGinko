/**
 * Created by admin on 12/26/2017.
 */
import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";

@Injectable()
export class authService
{
    isUserLoggedIn
    private kairosResponse ={
        status :String,
        headers:String,
        responseText: String
    };
    loader:any;
    constructor(private http: HttpClient, private https:Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig)
    {
    }

    // Kairos Api Calls
    enrollFace(employeeName, base64Image):Observable<any>{
        return this.http.kairosPost('https://api.kairos.com/enroll',{image:base64Image, subject_id:employeeName, gallery_name:'Employee'}).map(
            (response)=>{
                console.log(response);
                return response.json();
            }
        )
    }

    verifyUser(employeeName, base64Image):Observable<any>{
        return this.http.kairosPost('https://api.kairos.com/verify',{image:base64Image, subject_id:employeeName, gallery_name:'Employee'}).map(
            (response)=>{
                console.log(response);
                return response.json();
            }
        )
    }

    detectFace(employeeName, base64Image):Observable<any>{
        return this.http.kairosPost('https://api.kairos.com/detect',{image:base64Image, selector:'ROLL'}).map(
            (response)=>{
                console.log(response);
                return response.json();
            },(error)=>{
                console.log(error);
            }
        )
    }

    login(username,password):Observable<any>{
        return this.https.post(this.config.Url+'api/auth/'+username+'/'+password,{username:username,password:password}).map(
            (response)=>
            {
                this.isUserLoggedIn = true;

                return response.json();
            });
    }

    getClientDetails(id):Observable<any>{
        return this.http.get(this.config.Url+'api/project/'+id).map(
            response=>{
                console.log(response);
                return response.json();
            }
        )
    }

    userRolePermissions(searchCriteria):Observable<any>{
        return this.http.post(this.config.Url+'api/userRolePermission/search',searchCriteria).map(
            response=>{
                console.log(response.json());
                return response.json();
            }
        )
    }

    pushSubscription(userDetails):Observable<any>{
        return this.http.post(this.config.Url+'api/push/subscribe',userDetails).map(
            response=>{
                return response;
            })
    }

    resetPassword(changePassword):Observable<any>{
        return this.http.post(this.config.Url+'api/user/change_password',changePassword).map(
            response=>{
                console.log("Reset password response");
                console.log(response);
                return response.json();
            },err=>{
                console.log(err);
                return err
            }
        )
    }

    getCurrentVersion(applicationType):Observable<any>{
        console.log("Application type version control");
        console.log(applicationType);
        return this.http.get(this.config.Url+'api/version/application').map(
            response=>{
                console.log("application version response");
                console.log(response);
                return response.json();
            },err=>{
                console.log(err);
                return err;
            }
        )
    }

}