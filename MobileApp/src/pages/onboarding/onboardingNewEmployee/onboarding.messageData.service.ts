import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class onBoardingDataService {

    private messageSource = new BehaviorSubject('');
    private clearMessage = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();
    clearMessageSource = this.clearMessage.asObservable();

    constructor() { }

    formDataMessage(data: any) {
        this.messageSource.next(data)
    }
    formClearMessage(data: string) {
        this.clearMessage.next(data)
    }

}