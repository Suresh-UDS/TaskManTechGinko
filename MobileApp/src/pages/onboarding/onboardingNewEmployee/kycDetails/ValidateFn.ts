import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
    let value = control.value.toString();

    console.log('kyc_validate_err' + value)

    if (value.charAt(4) !== '0') {
        console.log('kyc_err');
        return { validUrl: true };
        //control.setErrors({ shouldMinLength: true });
    }
    console.log('kyc_err22');
    return null;

    //control.setErrors(null);
}