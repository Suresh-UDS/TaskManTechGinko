import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { onboardingExistEmployee } from '../onboardingList/onboardingList';
import { OnboardingService } from '../../service/onboarding.service';
import { componentService } from '../../service/componentService';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-onboardingLocation-new',
    templateUrl: 'onboardingLocation.html',
})
export class onboardingLocation implements OnInit {


    selectedClient;
    selectedSite;
    sites: any;
    clients: any;
    msg: any;
    selectClientSiteForm: FormGroup;

    constructor(private storage: Storage, private navCtrl: NavController, public onboardingService: OnboardingService, public component: componentService) {
        this.getProjects();
        this.setStorage();
    }

    ngOnInit() {
        this.selectClientSiteForm = new FormGroup({
            selectClient: new FormControl('', [Validators.required]),
            selectSite: new FormControl('', [Validators.required])
        });
    }

    getProjects() {
        this.component.showLoader("Please wait....");
        this.onboardingService.AllProjects().subscribe(res => {
            //alert('res data');
            this.clients = res;
            //this.sites = res.transactions;
            this.component.closeLoader();
        }, error => {
            this.component.closeLoader();

            this.msg = 'Server Unreachable'

            this.component.showToastMessage(this.msg, 'bottom');
        });
    }
    //get userform() { return this.selectClientSiteForm.controls; }

    getClientSites(object) {
        console.log(object);
        this.component.showLoader("Please wait....");
        this.onboardingService.allSites(object['projectId']).subscribe(res => {
            console.log(res);
            this.sites = res;
            this.clearStorage();
            this.component.closeLoader();
        }, err => {
            this.component.closeLoader();
            this.msg = 'Server Unreachable'
            this.component.showToastMessage(this.msg, 'bottom');
        })
    }
    onboardingList(object) {
        this.storage.set('onboardingProjectSiteIds', { prijectID: object['projectId'], SiteId: object['wbsId'] });
        this.navCtrl.push(onboardingExistEmployee);
    }
    clearStorage() {
        this.storage.set('OnBoardingData', { actionRequired: [], completed: [] });
    }
    setStorage() {
        this.storage.get('OnBoardingData').then((data) => {
            if (!data) {
                this.storage.set('OnBoardingData', { actionRequired: [], completed: [] });
            }
        })
    }
}