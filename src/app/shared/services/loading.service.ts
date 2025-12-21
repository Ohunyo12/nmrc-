import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
    private _selector: string = 'page-preloader';
    private _element: HTMLElement;
    private activeSpinCount = 0;
    private activeKeyApiCallCount = 0;
    loading: boolean = false; // spinner

    constructor() {
        this._element = document.getElementById(this._selector);
    }

    public show(): void {        
        this._element.style.display = 'block';
        this.activeSpinCount += 1;
    }

    public showKeyApiCall(): void {    
        //pls use only when approving requests!!!!!!!!!    
        this._element.style.display = 'block';
        this.activeKeyApiCallCount += 1;
    }

    public hideKeyApiCall(delay: number = 0): void {
        //pls use only when approving requests!!!!!!!!!    
        this.activeKeyApiCallCount -= 1;
        if (this.activeSpinCount >= 1 || this.activeKeyApiCallCount >= 1) return;
        if(delay>0){
            setTimeout(() => {
                this._element.style.display = 'none';
            }, delay);
        }else{
            this._element.style.display = 'none';
        }
    }

    reset(){
        this._element.style.display = 'none';
        this.activeSpinCount = 0;
    }

    public hide(delay: number = 0): void {
        this.activeSpinCount -= 1;
        if (this.activeSpinCount >= 1 || this.activeKeyApiCallCount >= 1) return;
        if(delay>0){
            setTimeout(() => {
                this._element.style.display = 'none';
            }, delay);
        }else{
            this._element.style.display = 'none';
        }
    }

    public showFile(): void {        
        this._element.style.display = 'block';
    }
}