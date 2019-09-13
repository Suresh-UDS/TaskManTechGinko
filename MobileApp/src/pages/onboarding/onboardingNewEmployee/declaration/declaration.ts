import { Component, OnInit } from '@angular/core';
import{ Declarationform} from './declarationform';
import {OnboardingService} from '../../../service/onboarding.service';
import {ActionSheetController, AlertController, Events, Item, ItemSliding, LoadingController, ModalController,NavController, NavParams, Platform} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {onBoardingDataService} from "../onboarding.messageData.service";
import {LocationProvider} from "../../../../providers/location-provider";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Storage } from '@ionic/storage';
import {
  NativeGeocoder,
  NativeGeocoderOptions, NativeGeocoderReverseResult
} from '@ionic-native/native-geocoder';
import { componentService } from '../../../service/componentService';
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
  gross:any;
  storedIndex:any;
  thumbImpression:any;
  employeeName:any;

constructor(public navCtrl: NavController, private onBoardingService: OnboardingService, public navParams: NavParams, public fb: FormBuilder, private messageService: onBoardingDataService,
             private nativeGeocoder: NativeGeocoder,private locationProvider: LocationProvider, private backgroundGeolocation: BackgroundGeolocation, private storage: Storage, private cs:componentService) {
      this.currentDate = new Date();
      // this.getAddress();
      this.location = "Chennai";

      this.storage.get('onboardingCurrentIndex').then(data => {
        this.storedIndex = data['index'];
      });
      this.storage.get('OnBoardingData').then(localStoragedData => {
          this.gross = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'] : localStoragedData['actionRequired'][this.storedIndex]['gross'];
          this.employeeName = localStoragedData['actionRequired'][this.storedIndex]['employeeName'];
          this.thumbImpression = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenLeft'];
      })
    }


  ngOnInit() {
  console.log("Getting declaration");
    this.onBoardingService.getDeclarationList().subscribe(res=>{
      console.log("response");
      console.log(res);
      this.getLocation();
      this.searchFieldBranchList=res;

    });

    this.declarationForm = this.fb.group(
        {
          agreeTermsAndConditions: [false,[Validators.required]],
            onboardedPlace:['']
        }
    );

    this.declarationSubscription = this.declarationForm.statusChanges.subscribe(status=>{
      if(status === 'VALID' && this.declarationForm.value.agreeTermsAndConditions){
        let formStatusValues ={
          status: true,
          data: this.declarationForm.value
        };
        
          this.storage.get('OnBoardingData').then(localStoragedData => {
            if(localStoragedData && localStoragedData['actionRequired'] && localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex]['declaration']){
              localStoragedData['actionRequired'][this.storedIndex]['declaration']['agreeTermsAndConditions'] = formStatusValues['data']['agreeTermsAndConditions'];
              localStoragedData['actionRequired'][this.storedIndex]['declaration']['onboardedPlace'] = formStatusValues['data']['onboardedPlace'] ;
              this.storage.set('OnBoardingData',localStoragedData);
            }
              
          });
        this.messageService.formDataMessage(formStatusValues);
      }
    })
  }

  ionViewDidLoad(){
    console.log("declaration form did load");
    
  }

  getDeclarationList(declarationContent){

    let text='_______________';
    declarationContent = declarationContent.replace(text, parseFloat(this.gross).toFixed(2) );
    this.declationText=declarationContent;

 }

  getLocation(){
    this.declarationForm.controls['onboardedPlace']
    .setValue(this.location);
    this.cs.showLoader("Getting Location");
    this.locationProvider.startTracking();
    let TIME_IN_MS = 2000;
    setTimeout( () => {
         this.cs.closeAll();
    }, TIME_IN_MS);
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 100,
      distanceFilter: 10,
      debug: false,
      // interval: 2000,
      stopOnTerminate:true
    };

    this.backgroundGeolocation.configure(config).subscribe((response) => {
      console.log("Location provider response");
      console.log(response);
      this.cs.closeLoader();
      this.cs.showLoader("Getting City");
      this.nativeGeocoder.reverseGeocode(response.latitude, response.longitude)
          .then((result: NativeGeocoderReverseResult[])=>{
//...       
            this.cs.closeLoader();
            console.log("Native geocoder response");
            console.log(result);
            this.location = result[0].locality;

            this.declarationForm.controls['onboardedPlace']
            .setValue(this.location);

              this.locationProvider.stopTracking();

          }).catch((error: any) => {
            this.cs.closeLoader();
          this.locationProvider.stopTracking();
          console.log(error)});

    });
  }
  

}
