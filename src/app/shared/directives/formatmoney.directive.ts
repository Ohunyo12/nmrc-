import { Directive, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: ' [currency]',
    host: {
        '(ngModelChange)': 'onInputChange($event)',
        '(keydown.backspace)': 'onInputChange($event.target.value, true)'
    }
})

export class CurrencyMaskDirective {
    constructor(public model: NgControl) { }

    @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();

    onInputChange(event: any, backspace: any) {
        var newVal = (parseInt(event.replace(/[^0-9]/g, '')) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
        var rawValue = newVal;

        if (backspace) {
            newVal = newVal.substring(0, newVal.length - 1);
        }

        if (newVal.length == 0) {
            newVal = '';
        }
        else {
            newVal = newVal;
        }
        // set the new value
        this.model.valueAccessor.writeValue(newVal);
        this.rawChange.emit(rawValue)
    }

}