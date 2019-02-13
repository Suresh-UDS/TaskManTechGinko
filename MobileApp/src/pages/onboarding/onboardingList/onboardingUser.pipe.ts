import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter'
})
export class onboardingUserFilterPipe implements PipeTransform {
    transform(items: any[], filter): any {
        filter = filter ? filter : {};
        console.log(filter);
        if (!items['length'] || !Object.keys(filter)['length']) {
            return items;
        } else if (items['length'] > 0 && Object.keys(filter)['length'] > 0) {
            let key = Object.keys(filter);
            console.log(key);
            console.log(items);
            return items.filter(item => item[key[0]].indexOf(filter[key[0]]) !== -1);
        }
    }
}