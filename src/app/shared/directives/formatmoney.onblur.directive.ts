import { NgControl } from '@angular/forms';
import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[formControlName][formatM]'
})

export class FormatMoneyDirective {

    typed: number[] = [];
    allowedKeys: number[] = [77, 66, 75, 84]; // M77 B66 K75 T84
    allowedCharacters: string[] = ['T', 't', 'K', 'k', 'M', 'm', 'B', 'b'];
    allowed: number = 0;
    
    constructor(public model: NgControl) { }

    @HostListener('keydown', ['$event']) onKeyDown(event) {
        
        let e = <KeyboardEvent> event;

        // allow Tt, Kk, Mm, Bb
        if ([77, 66, 75, 84].indexOf(e.keyCode) !== -1 && this.allowed == 0) {
            this.allowed++;
            return;
        }

        // if (this.OnlyNumber) {
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {

            this.allowed = 0;
                
            // let it happen, don't do anything
            return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    @HostListener('blur') onblur() {
        
        this.allowed = 0;
        let value = this.model.value + "";

        // check if empty
        if (value == '') return;

        // check NaN
        if (value === 'NaN') {
            this.model.control.setValue('');
            return; 
        }
        
        // split and get parts
        var numberPart = value.substr(0, value.length - 1);
        var readablePart: string = value.substr(-1);
        var noReadable: boolean = this.allowedCharacters.indexOf(readablePart) === -1;
        
        // check only a single readable
        if (value.length == 1 && !noReadable) { 
            this.model.control.setValue('');
            return; 
        }

        // as is
        if (value.length <= 3 && value.indexOf('.') === -1 && noReadable) {
            return;
        }
    
        // if populated with multiple letters
        if (/[a-z]/i.test(numberPart) == true) { // /^\d+$/.test(numberPart);
            this.model.control.setValue('');
            return;
        }

        // no human readable k,m,b
        if (noReadable) {
            let cleanValue = parseFloat(value.replace(/,/g, '')).toString();
            this.model.control.setValue(Number(cleanValue).toLocaleString('en-US', { minimumFractionDigits: 2 }));
            return;
        }

        // strip all commas
        numberPart = parseFloat(numberPart.replace(/,/g, '')).toString();

        if (readablePart === 'M' || readablePart == 'm') {
            let result: Number = Number(numberPart) * 1000000;
            this.model.control.setValue(result.toLocaleString('en-US', { minimumFractionDigits: 2 }));

        } else if (readablePart === 'T' || readablePart == 't' || readablePart === 'K' || readablePart === 'k') {
            let result: Number = Number(numberPart) * 1000;
            this.model.control.setValue(result.toLocaleString('en-US', { minimumFractionDigits: 2 }));

        } else if (readablePart === 'b' || readablePart === 'B') {
            let result: Number = Number(numberPart) * 1000000000;
            this.model.control.setValue(result.toLocaleString('en-US', { minimumFractionDigits: 2 }));

        } else {
            let result: Number = Number(numberPart);
            this.model.control.setValue(result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }

    }

}