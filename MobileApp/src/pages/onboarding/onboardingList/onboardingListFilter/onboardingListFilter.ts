import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'page-onboardingFilter-list',
    templateUrl: 'onboardingListFilter.html',
})
export class onboardingListFilter {
    searchData;
    searchField;
    userFilterKey;
    manuallyChecked = 'designation';

    @Input('popOverEvent') popoverEvent;
    constructor(private _viewController: ViewController) { }

    submitPopOver() {
        if (this.userFilterKey && this.searchData) {
            let obj = {};
            obj[this.userFilterKey] = this.searchData;
            this._viewController.dismiss(obj);
        }
    }
    closePopOver() {
        let obj = {};
        this._viewController.dismiss(obj);
    }
    userFilterKeyFn(key) {
        this.userFilterKey = key;
    }
}