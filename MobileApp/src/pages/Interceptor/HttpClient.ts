/**
 * Created by admin on 12/26/2017.
 */
import { Http , Headers , RequestOptions, Response } from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import {Injectable} from "@angular/core";

@Injectable()
export class HttpClient
{


  constructor(private http: Http , private storage: Storage)
  {

  }

  post(url,data):Observable<any>
  {
    console.log(url);
    let token_header=window.localStorage.getItem('session');
    console.log()

    let headers = new Headers({ 'X-Auth-Token': token_header });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });


    return this.http.post(url,data,options).map(
      (response : Response) =>
      {
        console.log('returning from interceptor');
        return response;
      }).catch(err=>{
        console.log('Returning from interceptor with error');
        console.log(err);
        return Observable.throw(err);
        });
  }

  get(url) : Observable<any>
  {
    let token_header = window.localStorage.getItem('session');

    console.log('from local storage');
    console.log(token_header);
    let headers = new Headers({ 'X-Auth-Token': token_header });

    let options = new RequestOptions({ headers: headers});
    console.log(url);

    return this.http.get(url,options).map(
      Response =>
      {
        console.log('returning from interceptor');
        return Response;
      }).catch(err=>{
        console.log('Returning from interceptor with error');
        console.log(err);
        return Observable.throw(err);
    });
  }

  put(url):Observable<any>
  {
    let token_header = window.localStorage.getItem('session');

    let headers = new Headers({'X-Auth-Token':token_header});

    let options = new RequestOptions({headers: headers});

    return this.http.put(url,options).map(
        response=>{
            console.log('returning from interceptor');
            return response;
        }
    )

  }

  kairosPost(url,data):Observable<any>
  {
    console.log(url);
    let token_header=window.localStorage.getItem('session');
    console.log()

    let headers = new Headers({ 'X-Auth-Token': token_header });
    headers.append('Content-Type', 'application/json');
    headers.append('app_id', '2f2877f2');
    headers.append('app_key', 'a6ae8363069107177e06c3ca3f76a66b');

    let options = new RequestOptions({ headers: headers });


    return this.http.post(url,data,options).map(
      (response : Response) =>
      {
        console.log('returning from interceptor');
        window.localStorage.setItem('responseImageDetails',JSON.stringify(response));
        return response;
      },(error)=>{
        window.localStorage.setItem('responseImageDetails',JSON.stringify(error));
        console.log(error);
      });
  }

}
