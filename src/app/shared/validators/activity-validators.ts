import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ActivityType } from "src/app/models/activity-type";

const validTypes: ActivityType[] = [
    { name: 'Timed', value: 1 },
    { name: 'Repetitions', value: 2 }
]

const ValidImgs = [
    '.png',
    '.jpg',
    '.jpeg',
    '.bmp'
]

export class ActivityValidators {
    static validType(): ValidatorFn {
        let isValid = false;
        return (control: AbstractControl): ValidationErrors | null => {
            validTypes.forEach(type => {
                if (type.value === control.value) {
                    isValid = true;
                    return;
                }
            });
            return isValid ? null : { validType: { value: `Value: ${control.value} is not a valid activity type.` } };
        }
    }

    static validImg(): ValidatorFn {
        let isValid = false;
        let supportedTypes: string = '';
        ValidImgs.forEach(img => {
            supportedTypes = supportedTypes + img + ' '
        });
        supportedTypes = supportedTypes.substring(supportedTypes.length - 1);
        return (control: AbstractControl): ValidationErrors | null => {
            ValidImgs.forEach(img => {
                if (String(control.value).toLowerCase().endsWith(img)) {
                    isValid = true;
                    return;
                }
            });
            return isValid ? null : { validImg: { value: `${control.value} is not a supported image type. SupportedTypes are: ${supportedTypes}`}}
        }
    }
}