import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { onboardingExistEmployee } from '../onboardingList/onboardingList';
import { SiteService } from '../../service/siteService';
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

    constructor(private storage: Storage, private navCtrl: NavController, private siteService: SiteService, public component: componentService) {
        this.setStorage();
    }

    ngOnInit() {
        this.selectClientSiteForm = new FormGroup({
            selectClient: new FormControl('', [Validators.required]),
            selectSite: new FormControl('', [Validators.required])
        });

        this.siteService.getAllProjects().subscribe(res => {
            this.clients = res;
            //this.sites = res.transactions;
            this.component.closeLoader();
        }, error => {
            if (error.type == 3) {
                this.msg = 'Server Unreachable'
            }
            this.component.showToastMessage(this.msg, 'bottom');
        });
    }

    //get userform() { return this.selectClientSiteForm.controls; }

    getClientSites(clientObj) {
        this.siteService.findSites(clientObj['id']).subscribe(res => {
            console.log("res = ");
            console.log(res);
            this.sites = res;
        }, err => {
            this.msg = 'Server Unreachable'
            this.component.showToastMessage(this.msg, 'bottom');
        })
    }
    onboardingList() {
        this.navCtrl.push(onboardingExistEmployee);
    }
    setStorage() {
        this.storage.get('OnBoardingData').then((data) => {
            if (!data) {
                this.storage.set('OnBoardingData', { actionRequired: [], completed: [] });
            }
        })
    }
}