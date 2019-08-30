import { Component, OnInit } from '@angular/core';
import{ Declarationform} from './declarationform';
import {OnboardingService} from '../../../service/onboarding.service';
import {ActionSheetController, AlertController, Events, Item, ItemSliding, LoadingController, ModalController,NavController, NavParams, Platform} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {onBoardingDataService} from "../onboarding.messageData.service";


@Component({
  selector: 'page-declaration',
  templateUrl: 'declaration.html',
})

export class declaration  {
  searchFieldBranchList;
  declationText:string;

  declarationForm: FormGroup;
  declarationSubscription;


  

constructor(public navCtrl: NavController, private onBoardingService: OnboardingService, public navParams: NavParams, public fb: FormBuilder, private messageService: onBoardingDataService) {

  }

  ngOnInit() {
  console.log("Getting declaration");
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
  getDeclarationList(branch){

    var text='Rs';
    console.log(branch);
    var strinReplace= branch;
    var newReplace = strinReplace.replace(text, "Rs. 10000 \n \n \r \r\n \n \r \r");
    this.declationText=newReplace;

 }
  

}
