import { Component, OnInit } from '@angular/core';
import{ Declarationform} from './declarationform';
import {OnboardingService} from '../../../service/onboarding.service';

import {
  ActionSheetController, AlertController, Events, Item, ItemSliding, LoadingController, ModalController,
  NavController, NavParams, Platform
} from 'ionic-angular';


@Component({
  selector: 'page-declaration',
  templateUrl: 'declaration.html',
})

export class declaration  {
  searchFieldBranchList;
  declationText:string;
   
  

constructor(public navCtrl: NavController, private onBoardingService: OnboardingService, public navParams: NavParams) {
    console.log(navParams.get('val'));

    onBoardingService.getDeclarationList().subscribe(res=>{ 
      this.searchFieldBranchList=res;
      
      });

      
  }
  getDeclarationList(branch){

    var text='Rs';
//var strreplace="I certified that <br><br>the information given above is true to my knowledge.I further certify that I have not been terminated from earlier services for any unlawful acticities nor there are any discipilinary/criminal cases pending against me.I further state that I have not been convicted for any unlawful activities. I understand  that one and half month notice is required in case I intend to leave the job or I have to pay notice period pay in lie u. I also understand that any willful suppression of facts misrepresentation would lead to termination of my services. <BR><BR>   I here accept Rs _______________ as my monthly gross salary or much amount that may be fixed in case of transfer. Company has rights to transfer me as per its requirements.Agree to company to company form time to time ";
//var newstringg=strreplace.replace(text,"suresh Deva");
//console.log(newstringg);
//this.declationText=newstringg;
  
console.log(branch);
 // this.declationText= branch;

var strinReplace= branch;
var newReplace = strinReplace.replace(text, "Rs. 10000 \n \n \r \r\n \n \r \r");
this.declationText=newReplace;
  // this.declationText= 'I certified that <br><br>the information given above is true to my knowledge.I further certify that I have not been terminated from earlier services for any unlawful acticities nor there are any discipilinary/criminal cases pending against me.I further state that I have not been convicted for any unlawful activities. I understand  that one and half month notice is required in case I intend to leave the job or I have to pay notice period pay in lie u. I also understand that any willful suppression of facts misrepresentation would lead to termination of my services. <BR><BR>   I here accept Rs _______________ as my monthly gross salary or much amount that may be fixed in case of transfer. Company has rights to transfer me as per its requirements.Agree to company to company form time to time <BR><Br>';

 }
  

}
