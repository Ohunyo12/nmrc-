import { Component, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'; 

@Component({
    selector: 'scroll-to-top-button',
    animations: [
        trigger('visibilityChanged', [
            state('shown', style({ opacity: 1 })),
            state('hidden', style({ opacity: 0 })),
            transition('shown => hidden', animate('600ms')),
            transition('hidden => shown', animate('300ms')),
        ])
    ],
    template: `
    <style>
        #return-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.3);
            width: 50px;
            height: 50px;
            display: block;
            text-decoration: none;
            -webkit-border-radius: 35px;
            -moz-border-radius: 35px;
            border-radius: 35px;
            //display: none;
            -webkit-transition: all 0.3s linear;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;
        }

        #return-to-top:hover {
            background: rgba(0, 0, 0, 0.5);
        }
    </style>
    
    <button  [@visibilityChanged]="visiblityState" (click)="scrollToTop()" type="button" id="return-to-top" class="pull-right" icon="fa-caret-up" pButton></button>`
})
export class ScrollToTopComponent {
    visiblityState = 'hidden'
    scrollToTop() { window.scrollTo(0, 0); }
    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        if (document.documentElement.scrollTop < 10) { this.visiblityState = 'hidden'; }
        if (document.documentElement.scrollTop > 100) { this.visiblityState = 'shown'; }
    }
}
