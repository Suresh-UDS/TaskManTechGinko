import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter'
})
export class onboardingUserFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || JSON.stringify(filter) == '{}') {
            return items;
        } else if (items['length'] > 0 && (JSON.stringify(filter) !== '{}')) {
            let key = Object.keys(filter);
            console.log(key);
            console.log(items);
            return items.filter(item => item['personalDetails'][key[0]].indexOf(filter[key[0]]) !== -1);
        }
    }
}