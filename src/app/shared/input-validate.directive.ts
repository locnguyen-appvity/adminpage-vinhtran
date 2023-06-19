import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[matInput][se-pure-words]'
})
export class PureWordsMaskDirective {
    //TODO: Do not accept inputs which special characters. Only accept number or alphabet
    constructor(public ngControl: NgControl) {}

    @HostListener('ngModelChange', ['$event'])
    onModelChange(event: any) {
        this.onInputChange(event);
    }

    @HostListener('keydown.backspace', ['$event'])
    keydownBackspace(event: any) {
        this.onInputChange(event.target.value);
    }

    onInputChange(event: any) {
        let newVal = '';
        if (event && event !== '' && event !== undefined) {
            // Do not contain special characters: & * ( ) { } [ ] | < > ? / ' ` ! % ^ : ;
            const validatePattern = /[\&\*\(\)\{\}\[\]\|\<\>\?\/\\\'\`\!\%\^\:\,\.\;]/g;
            newVal = event.replace(validatePattern, '');
        }
        this.ngControl.valueAccessor.writeValue(newVal);
    }
}
