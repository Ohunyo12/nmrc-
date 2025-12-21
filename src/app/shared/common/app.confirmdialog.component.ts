import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-fintrakbanking-dialog',
    template: `<p-dialog [(visible)]="show" [responsive]="true" id="confirmDialog" modal="modal" showEffect="fade" [width]="width">
                    <div style="margin-bottom:0" class="panel panel-default">
                        <div class="panel-heading">
                            <h2 class="panel-title">
                                {{title}}
                            </h2>
                            <div *ngIf="topClose" class="pull-right">
                            <a class="close" (click)="closeEvent.emit({cancel:'cancelled'})">&times;</a>
                            </div>
                        </div>

                        <div class="panel-body">
                            <span><i class="glyphicon glyphicon-question-sign"></i> {{message}}</span>
                        </div>

                        <div class="panel-footer">
                            <div class="row">
                                <div class="col-md-12">
                                    <button type="button" (click)="approveEvent.emit({continue: 'submitted'})" 
                                    class="btn btn-success pull-right"> {{ok}} </button>
                                    <button *ngIf="regularDialog" (click)="closeEvent.emit({cancel:'cancelled'})" type="button" 
                                    class="btn {{btnNullProperty}} pull-right" style="margin-right:5px"> {{cancel}} </button>
                                    <button *ngIf="!regularDialog" (click)="cordonEvent.emit({continue: 'submitted'})" type="button" 
                                    class="btn {{btnNullProperty}} pull-right" style="margin-right:5px"> {{cancel}} </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </p-dialog>
            `,
    styles: [`
        #confirmDialog {

            position: relative;

            .panel-body {
                font-size: 16px;
            }
        }
    `]
})

export class ConfirmDialogComponent implements OnInit {
    //..........................
    //Customizable Input Properties
    //............................
    @Input('topClose') topClose: boolean = false;
    @Input('regularDialog') regularDialog: boolean = true;
    @Input('ok') ok: string = 'Yes';
    @Input('cancel') cancel: string = 'No'; 
    @Input('btnNullProperty') btnNullProperty: string = 'btn-danger'; 
    //...........................................................

    @Input('show') show: boolean;
    @Input('message') message: string;
    @Input('title') title: string;
    @Input('width') width: string;
    
    @Output()
    approveEvent = new EventEmitter();
    @Output()
    closeEvent = new EventEmitter(); 
    @Output()
    cordonEvent = new EventEmitter();

    constructor() { }

    ngOnInit() { }
}