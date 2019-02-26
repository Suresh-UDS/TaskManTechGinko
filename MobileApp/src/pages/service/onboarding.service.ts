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

@Injectable()
export class OnboardingService {
    leaddetails: any;

    BASE_URL = 'http://13.127.251.152:8088';

    constructor(private transfer: FileTransfer, private http: HttpClient, private https: Http, public loadingCtrl: LoadingController, @Inject(MY_CONFIG_TOKEN)
    private config: ApplicationConfig) {
    }

    AllProjects(): Observable<any> {
        return this.http.get(this.BASE_URL + '/api/onboard/getProjectList').map(
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
        return this.http.get(this.BASE_URL + '/api/onboard/getWBSListByProjectIds/[' + id + ']').map(
            response => {
                console.log(response.json());
                return response.json();
            }).catch(error => {
                console.log(error);
                return Observable.throw(error.json());
            })
    }
    getEmployeeListByWbs(wbsId): Observable<any> {
        //  let url = 'http://172.16.1.57:8090/api/onboard/getEmployeeListByWbs/UDS200008570001';
        let url = this.BASE_URL + '/api/onboard/getEmployeeListByWbs/' + wbsId;
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
        object['isSync'] = false;
        //cg change to true
        return this.http.post(this.BASE_URL + '/api/onboard/employees', object).map(
            response => {
                return response.json();
            }).catch(error => {
                console.log(error);
                return Observable.throw(error.json());
            })
    }

    getAllOnboardingUser(): Observable<any> {
        return this.http.get('assets/data/emp_old.json').map(
            response => {
                return JSON.parse(response['_body']);
            }).catch(error => {
                return Observable.throw(error.json());
            })
    }

    initGetEmployeeListByWbs(): Observable<any> {
        //  let url = 'http://172.16.1.45:8080/api/getWbsDetailsByEmpIds/['+ empId+']';
        //  let url =  'http://172.16.1.57:8090/api/onboard/getWbsDetailsByEmpIds/[3892]';
        let url = this.BASE_URL + '/api/onboard/getWbsDetailsByEmpIds/[' + window.localStorage.getItem('empUserId') + ']';
        return this.http.get(url).map(response => {
            console.log('employee id =======');
            this.leaddetails = response.json();
            for (var i = 0; i < this.leaddetails.length; i++) {
                console.log('res init2' + this.leaddetails[i].wbsId); //here you'll get sendernewcall value for all entry
            }
            console.log('resp_init ' + this.leaddetails[0]);
            return this.leaddetails[0].wbsId;
        }).catch(error => {
            console.log(error);
            return Observable.throw(error.json);
        })
    }
    imageUpLoad(filename, key, id) {
        let type = null;
        if (key.match("fingerPrintRight")) {
            key = 'impressen';
            type = 'right';
        } else if (key.match("fingerPrintLeft")) {
            key = 'impressen';
            type = 'left';
        }


        console.log('imageupload id- ' + id + ' + ' + key);

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

            fileTransfer.upload(filename, this.BASE_URL + '/api/onboard/' + key, options)
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