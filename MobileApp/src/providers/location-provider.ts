import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import {Observable} from "rxjs/Observable";

@Injectable()
export class LocationProvider {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;

    public location:any;

    constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, public geolocation: Geolocation) {

    }

    getLocation(): Observable <any>{
        let config = {
            desiredAccuracy: 20,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: true,
            interval: 2000
        };

        this.backgroundGeolocation.configure(config).subscribe((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
            });

            this.location = {
                lat: this.lat,
                lng: this.lng
            };

        }, (err) => {

            console.log(err);
            this.location = null;

        });

        return this.location;

    }

    startTracking():Observable<any> {

        // Background Tracking

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: false,
            // interval: 2000
            stopOnTerminate:true
        };

        this.backgroundGeolocation.configure(config).subscribe((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
            });

        }, (err) => {

            console.log(err);

        });

        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start();


        // Foreground Tracking

        let options = {
            // frequency: 3000,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

            console.log(position);

            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                window.localStorage.setItem('lat',JSON.stringify(position.coords.latitude));
                window.localStorage.setItem('lng',JSON.stringify(position.coords.longitude));

            });


        });

        this.location={
            lat:this.lat,
            lng:this.lng
        };

        return this.location;

    }

    stopTracking() {

        console.log('stopTracking');

        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
        this.backgroundGeolocation.stop();
    }

}