import { Pipe, PipeTransform } from '@angular/core';
/*
 * Capitalize the first letter of the string
 */
@Pipe({
    name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
    transform(value: string): string {
        if (value === null) {
            return '';
        } else {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    }
}
