import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {OnboardingService} from '../../../service/onboarding.service';
import { NavController } from 'ionic-angular';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { GetProjectService } from '../../../service/getProjectService';
import { GetWBSListService } from '../../../service/getWBSListService';
import { EmployeeService} from '../../../service/employeeService';

@Component({
    selector: 'page-onboardingFilter-list',
    templateUrl: 'onboardingListFilter.html',
})
export class onboardingListFilter {

   // myForm: FormGroup;
   myForm: FormGroup;
    searchData;
    searchField;
    userFilterKey;
    manuallyChecked = 'designation';
    //totalData;
test;
    searchFieldBranchList;
    searchFieldProjectList;
    searchFieldWBSList;
    
    element;
    getBranchListKey;
    getProjectListKey;
    getWBSListKey;

    searchDataEmployeeName;
    searchDataEmployeeCode;

    @Input('popOverEvent') popoverEvent;
    constructor(public navCtrl: NavController, private _viewController: ViewController, private onBoardingService: OnboardingService, private getProjectService: GetProjectService, private getWBSListService: GetWBSListService, private employeeService: EmployeeService) { 
         onBoardingService.getBranchList().subscribe(res=>{
         this.searchFieldBranchList=res;
         });

        
           onBoardingService.getResults(this.element).subscribe(item=>{
             this.element=item;
             });

         

           onBoardingService.getProjectList().subscribe(res=>{
            this.searchFieldProjectList=res;
            });
            

            onBoardingService.getWBSList().subscribe(res=>{
                this.searchFieldWBSList=res;
                });

               

    }

 submitPopOver() {
        if (this.userFilterKey && this.searchData) {
        let obj = {};
            obj[this.userFilterKey] = this.searchData;
            this._viewController.dismiss(obj);
        }
     }
    

    // submitPopOver() {
    //     if (this.getBranchListKey && this.searchDataEmployeeName && this.searchDataEmployeeCode) {
    //         let obj = {};
    //         obj[this.getBranchListKey] = this.searchData;
    //         this._viewController.dismiss(obj);
    //     }
    //     else if(this.getProjectListKey && this.searchDataEmployeeName && this.searchDataEmployeeCode) {
    //         let obj = {};
    //         obj[this.getProjectListKey] = this.searchDataEmployeeName && this.searchDataEmployeeCode;
    //         this._viewController.dismiss(obj);
    //     }

    //     else if(this.getWBSListKey && this.searchDataEmployeeName && this.searchDataEmployeeCode) {
    //         let obj = {};
    //         obj[this.getWBSListKey] = this.searchDataEmployeeName && this.searchDataEmployeeCode;
    //         this._viewController.dismiss(obj);
    //     }
 
    // }
    closePopOver() {
        let obj = {};
        this._viewController.dismiss(obj);
    }
    userFilterKeyFn(key) {
        this.userFilterKey = key;
    }
    getResults(Keyword){
        this.getResults=Keyword;
    }

    
    getBranchList(key){
        this.getBranchListKey=key;
    }

    getProjectList(key){
        this.getProjectListKey=key;
    }

    getWBSList(key){
        this.getWBSListKey=key;
    }


     ngOnInit(): void {
         this.myForm = new FormGroup({
          country: new FormControl('', [
             Validators.required
          ])
        })
       }
    
       submit(): void {
         let country = this.myForm.value.country
       }
      

}