import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({ selector: '[wait-button]',inputs:['Busy','OriginalText'] })
export class ButtonWaitDirective {
    
    @Input("Busy") Busy: boolean;
    @Input("OriginalText") OriginalText: string;
    private busy: boolean
    private _waitText: string = "Please wait..";
    constructor(private _elRef: ElementRef) { }

    @HostListener('click', ['$event'])
    onButtonClicked($event: any) {
        if (this.Busy) {
            this._elRef.nativeElement.innerText = this._waitText;
        } else {
            this._elRef.nativeElement.innerText = this.OriginalText;
        }
    }


}