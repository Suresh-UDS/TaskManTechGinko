import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "../Interceptor/HttpClient"

import { map } from "rxjs/operator/map";
import { Inject, Injectable } from "@angular/core";
import { LoadingController, ToastController } from "ionic-angular";
import { AppConfig, ApplicationConfig, MY_CONFIG_TOKEN } from "./app-config";
import { ObserveOnSubscriber } from "rxjs/operators/observeOn";
import { windowTime } from '../../../node_modules/rxjs/operators';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {AutoCompleteService} from 'ionic2-auto-complete';
import 'rxjs/add/operator/map';

@Injectable()
export class OnboardingService implements AutoCompleteService {
    leaddetails: any;
    labelAttribute = "element";
   
    formValueAttribute = "numericCode";
    element: any;

    BASE_URL = 'http://13.127.251.152:8088';

    constructor(private transfer: FileTransfer,  private http: Http, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN)
    private config: ApplicationConfig) { 
    } 

    AllProjects(): Observable<any> {
        return this.http.get(this.config.Url + 'api/onboard/getProjectList').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
             })
    }
    allSites(id): Observable<any> {
        console.log(id);
        return this.http.get(this.config.Url + 'api/onboard/getWBSListByProjectIds/[' + id + ']').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    getEmployeeListByProjectId(projectId): Observable<any> {
      //  return this.getAllOnboardingUser();
        // //  let url = 'http://172.16.1.57:8090/api/onboard/getEmployeeListByWbs/UDS200008570001';
        let url = this.config.Url + 'api/onboard/getEmployeeListByProjectId/' + projectId;
        return this.http.get(url).map(
            response => {
                console.log('project Id res::' + response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })

    }
    getEmployeeListByWbs(wbsId): Observable<any> {
        //  let url = 'http://172.16.1.57:8090/api/onboard/getEmployeeListByWbs/UDS200008570001';
        let url = this.config.Url + 'api/onboard/getEmployeeListByWbs/' + wbsId;
        return this.http.get(url).map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log("error in getting all projects");
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    saveOnboardingUser(object) {
        //object = JSON.stringify(object);
        object['isSync'] = true;
        //cg change to true
        return this.http.post(this.config.Url + 'api/onboard/employees', object).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log(error);
                return Observable.throw(error.json());
            })
    }

   

    getAllOnboardingUser(): Observable<any> {
        return this.http.get(this.config.Url+'assets/data/project.json').map(
            response => {
                return JSON.parse(response['_body']);
            }).catch(error => {
                return Observable.throw(error.json());
            })
    }

    // getBranchList: function(userId){
    //     return $http.get('api/getBranchId'+userId).then(function(response){
    //         return response.data;
    //     })
    // }

    // getProjectList: function(branchId){
    //     return $http.get('api/getProjectListByBranchId'+branchId).then(function(response){
    //         return response.data;
    //     })
    // }

    // getWBSList: function(projectId){
    //     return $http.get('api/getWBSListByProjectId/'+projectId).then(function(response){
    //         return response.data;
    //     })
    // }


    getProjectList(): Observable<any>{
       // return this.http.get(this.config.Url+'api/getProjectListByBranchId').map(response=> {
        let url = 'http://localhost:8088/api/getProjectListByBranchId';
        return this.http.get(url).map(response=> {   
            console.log(response.json()); 
       return response.json();
         }).catch(error=>{
            alert("Error in getting ProjectList");
            console.log(error);
           return Observable.throw(error.json());
      
              });
     }

     getBranchList(): Observable<any>{
      // return this.http.get(this.config.Url+'api/getBranchList/').map(response=> {
        let url = 'http://localhost:8088/api/getBranchList';
        return this.http.get(url).map(response=> {
            console.log(response.json());
            return response.json();
          
        }).catch(error=>{
      alert("Error in getting BranchList");
      console.log(error);
     return Observable.throw(error.json());

        });
    }

    getWBSList(): Observable<any>{
             let url = 'http://localhost:8088/api/getWBSListByProjectId';
        //http://localhost:8088/api/getWBSListByProjectId
        return this.http.get(url).map(response=> {
            console.log(response.json());
             return response.json();
         }).catch(error=>{
            alert("Error in getting WBSList");
            console.log(error);
           return Observable.throw(error.json());
      
              });
     }
 

     getResults(keyword:string): Observable<any> {
         
         return this.http.get('http://localhost:8088/api/getBranchList')
          //return this.http.get('https://restcountries.eu/rest/v1/name/'+keyword)
          .map(
            result =>
            {
              return result.json()
                .filter(item => item.element.toLowerCase() )
            });
 }


 getDeclarationList(): Observable<any>
{
    //let url = 'http://localhost:8088/api/getWBSListByProjectId';
    let url = 'http://localhost:8088/api/getDeclarationForm';
   // return this.http.get('http://localhost:8088/api/getDeclarationForm')
   return this.http.get(url).map(response=> {
    console.log(response.json());
     return response.json();
 }).catch(error=>{
    alert("Error in getting WBSList");
    console.log(error);
   return Observable.throw(error.json());

      });
}


//    getBranchList(userId): Observable<any>{
//     let url = this.config.Url + 'api/getBranchList/' + userId;
//    return this.http.get(url).map(response=> {
         
//     console.log('employee id =======');
//     this.leaddetails = response.json();
//     for (var i = 0; i < this.leaddetails.length; i++) {
//         console.log('res init2' + this.leaddetails[i].userId); //here you'll get sendernewcall value for all entry
//          window.localStorage.setItem('wbsId', this.leaddetails[i].wbsId);
//     }
//     console.log('resp_init ' + this.leaddetails[0].userId);
//     return this.leaddetails[0].userId;
// }).catch(error => {
//     console.log(error);
//     return Observable.throw(error.json);
// })
       
// }

    initGetEmployeeListByWbs(): Observable<any> {
        //  let url = 'http://172.16.1.45:8080/api/getWbsDetailsByEmpIds/['+ empId+']';
        //  let url =  'http://172.16.1.57:8090/api/onboard/getWbsDetailsByEmpIds/[3892]';
        let url = this.config.Url + 'api/onboard/getWbsDetailsByEmpIds/[' + window.localStorage.getItem('empUserId') + ']';
        return this.http.get(url).map(response => {
            console.log('employee id =======');
            this.leaddetails = response.json();
            for (var i = 0; i < this.leaddetails.length; i++) {
                console.log('res init2' + this.leaddetails[i].projectId); //here you'll get sendernewcall value for all entry
                 window.localStorage.setItem('wbsId', this.leaddetails[i].wbsId);
            }
            console.log('resp_init ' + this.leaddetails[0].projectId);
            return this.leaddetails[0].projectId;
        }).catch(error => {
            console.log(error);
            return Observable.throw(error.json);
        })
    }
    
    imageUpLoad(filename, key, id) {
        let type = '';
        // if (key.match("fingerPrintRight")) {
        //     key = 'impressen';
        //     type = 'right';
        // } else if (key.match("fingerPrintLeft")) {
        //     key = 'impressen';
        //     type = 'left';
        // }


        // console.log('imageupload id- ' + id + ' + ' + key);

        let promise = new Promise((resolve, reject) => {
            //let name = filename.substring(filename.lastIndexOf('/') + 1);
            //let path = filename.substring(0, filename.lastIndexOf('/') + 1);

            const fileTransfer: FileTransferObject = this.transfer.create();
            //  console.log('file name == ' + name);
            console.log("file path == " + filename);
            var options: FileUploadOptions = {
                fileKey: "file",
                fileName: key,
                httpMethod: 'POST',
                params: {
                    id: id,
                    type: type
                }
            }

            console.log("image upload => " + this.config.Url + 'api/onboard/' + key)

            fileTransfer.upload(filename, this.config.Url + 'api/onboard/' + key, options)
                .then((data) => {
                    //alert('success')
                    console.log('image response - ' + JSON.stringify(data));
                    resolve(data);
                }, (err) => {
                    //            alert('error');
                    console.error('image err-' + err);
                    reject(err);
                });
        });
        return promise;
    }
}