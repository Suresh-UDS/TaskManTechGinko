import { Component, OnInit } from '@angular/core';
import{ Declarationform} from './declarationform';
import {OnboardingService} from '../../../service/onboarding.service';
import {ActionSheetController, AlertController, Events, Item, ItemSliding, LoadingController, ModalController,NavController, NavParams, Platform} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {onBoardingDataService} from "../onboarding.messageData.service";
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {LocationProvider} from "../../../../providers/location-provider";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-declaration',
  templateUrl: 'declaration.html',
})

export class declaration  {
  searchFieldBranchList;
  declationText:string;
  currentDate:any;
  location:any;
  declarationForm: FormGroup;
  declarationSubscription;
  grossSal:any;
  storedIndex:any;
  thumbImpression:any;
  employeeName:any;

constructor(public navCtrl: NavController, private onBoardingService: OnboardingService, public navParams: NavParams, public fb: FormBuilder, private messageService: onBoardingDataService,
            private nativeGeoCoder: NativeGeocoder, private locationProvider: LocationProvider, private backgroundGeolocation: BackgroundGeolocation, private storage: Storage) {
      this.currentDate = new Date();
      // this.getLocation();
      this.storage.get('onboardingCurrentIndex').then(data => {
        this.storedIndex = data['index'];
      });
      this.storage.get('OnBoardingData').then(localStoragedData => {
      this.grossSal = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['grossSal'];
      this.thumbImpression = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['thumbImpressenLeft'];
      this.employeeName = localStoragedData['actionRequired'][this.storedIndex]['employeeName'];
      })
    }

  getLocation(){
    this.locationProvider.startTracking();

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: false,
      // interval: 2000,
      stopOnTerminate:true
    };

    this.backgroundGeolocation.configure(config).subscribe((response) => {
      console.log("Location provider response");
      console.log(response);
      this.nativeGeoCoder.reverseGeocode(response.latitude,response.longitude).then((result:NativeGeocoderResult[])=>{
        console.log("response ");
        console.log(result[0]);
        this.location = result[0];
      });
      this.locationProvider.stopTracking();

    });
  }

  ngOnInit() {
  console.log("Getting declaration");

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.onBoardingService.getDeclarationList().subscribe(res=>{
      console.log("response");
      console.log(res);
      this.searchFieldBranchList=res;

    });

    this.declarationForm = this.fb.group(
        {
          agreeTermsAndConditions: [false,[Validators.required]]
        }
    );

    this.declarationSubscription = this.declarationForm.statusChanges.subscribe(status=>{
      if(status === 'VALID'){
        let formStatusValues ={
          status: true,
          data: this.declarationForm.value
        };
        this.messageService.formDataMessage(formStatusValues);
      }
    })
  }
  getDeclarationList(declarationContent){

    let text='_______________';
    declarationContent = declarationContent.replace(text, parseFloat(this.grossSal).toFixed(2) );
    this.declationText=declarationContent;

 }
  

}
