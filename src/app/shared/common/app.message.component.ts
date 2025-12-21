import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'fintrakbanking-message',
    template: `<div [ngClass]="cssClass" class="banking-message" [hidden]="show == false">
                <div class="banking-message-backdrop"></div>
                    <div class="message-box">
                        <div class="message-title">
                            <h2>{{title}}</h2>                                
                        </div>
                       <div class="message-body">
                            <div class="icon"></div>
                            <p>{{message}}</p>
                       </div>  
                       <div class="message-button">
                       
                       <div style="padding:0" class="col-md-2 col-md-offset-10">
                       <a (click)="closeEvent.emit({test:'myname'})" style="margin-bottom:5px;float:right" class="btn btn-default">Close</a>
                       </div>
                       </div>                     
                    </div>                   
               </div>`
})

export class MessageComponent implements OnInit {
    @Input('message') message;
    @Input('title') title;
    @Input('show') show;
    @Input('cssClass') cssClass;
    @Output()
    closeEvent = new EventEmitter();
    constructor() { }

    ngOnInit() { }

    
}