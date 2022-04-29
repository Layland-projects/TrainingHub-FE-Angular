import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Role } from "src/app/models/role";

const allowedTitles: string[] = [
    "Mr",
    "Miss",
    "Mrs",
    "Dr",
    "Mx"
];

const allowedRoles: Role[] = [
    { name: 'Admin', value: 0 },
    { name: 'Trainer', value: 1 },
    { name: 'Trainee', value: 2 }
];

export class UserValidators {

    static validTitle(): ValidatorFn {
        return (control: AbstractControl) : ValidationErrors | null => {
            let titlesErrorMsg : string = '';
            allowedTitles.forEach(title => titlesErrorMsg + `${title}, `);
            titlesErrorMsg = titlesErrorMsg.substring(titlesErrorMsg.length - 2);
            return allowedTitles.includes(control.value) ? null : { title: { value: `Title must be one one of the following values: ${titlesErrorMsg}` } };
        }
    }

    static validRole(): ValidatorFn {
        return (control: AbstractControl) : ValidationErrors | null => {
            let rolesErrorMsg: string = '';
            let validRole: boolean = false;
            allowedRoles.forEach(role => {
                if (role.value === Number(control.value)) {
                    validRole = true;
                    return;
                }
                rolesErrorMsg = rolesErrorMsg + `${role.name}, `;
            });
            rolesErrorMsg = rolesErrorMsg.substring(rolesErrorMsg.length - 2);
            return validRole ? null : { role: { value: `Valid roles are: ${rolesErrorMsg}.` } };
        }
    }
}