import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReportService } from 'app/reports/service/report.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { saveAs } from 'file-saver';

@Component({
    templateUrl: 'approval-comments.component.html',
    selector: 'app-approval-comments', 
    providers: [CreditAppraisalService],
})
export class ApprovalCommentsComponent {

    trail: any[] = [];
    appraisalTrail: any[] = [];
    offerLetterTrail: any[] = [];
    availmentTrail: any[] = [];
    DrawdownTrail: any[] = []; 
    bookingTrail: any[] = [];

    trailRecent: any = null;
    @Input() detailed: boolean = true;
    @Input() isForPrint = false;

    @Input() isDrawdown: boolean = false;
    @Input() loanBookingRequestId: any;
    @Input() loanId: any;
    @Input() requireAll: boolean = true;
    @Input() isBooking: boolean;

    @Input() all: boolean = false;
    @Input() operationId: number = 0;
    @Input() operationIds: any[] = [];
    @Input() tableLabel: string = 'Comments';
    @Output() trailCount: EventEmitter<any> = new EventEmitter<any>();

    @Input() set applicationId(value: number) { 
        //this.detailed = this.all;
        if (value > 0) this.getTrail(value); 
    }

    @Input() set reviewApplicationId(value: number) { 
        
        if (value > 0) this.getApprovalLmsTrail(value); 
    }

    @Input() set targetId(value: number) { 
        //this.detailed = this.all;
        if (value > 0) this.getTrail(value); 
    }

    // @Input() set targetId(value: number) { 
    //     this.detailed = this.all;
    //     if (value > 0) this.getApprovalTrail(value); 
    // }

    constructor(private camService: CreditAppraisalService, 
                private loadingService: LoadingService,
                private reportServ: ReportService) { }
    
    getTrail(applicationId) { 
       
        this.loadingService.show();
        this.camService.getTrail(applicationId, this.operationId,this.all).subscribe((response: any) => {
            this.loadingService.hide();
            this.trail = response.result;
            if (this.trail == null || this.trail == undefined) {
                return;
            }
            
            this.appraisalTrail = this.trail.filter(x=>x.commentStage == 'Credit Appaisal');
            this.offerLetterTrail = this.trail.filter(x=>x.commentStage == 'Offer Letter');
            this.availmentTrail = this.trail.filter(x=>x.commentStage == 'Availment');
            if(this.isDrawdown){
                this.DrawdownTrail = this.trail.filter(x=>x.commentStage == 'Drawdown' && x.targetId == this.loanBookingRequestId);
            }
            if(this.isBooking){
                this.DrawdownTrail = this.trail.filter(x=>x.commentStage == 'Drawdown' && x.targetId == this.loanBookingRequestId);
                this.bookingTrail = this.trail.filter(x=>x.commentStage == 'Booking' && x.targetId == this.loanId);
            }
            if(this.requireAll){
                this.DrawdownTrail = this.trail.filter(x=>x.commentStage == 'Drawdown' );
                this.bookingTrail = this.trail.filter(x=>x.commentStage == 'Booking');
            }
            
            
            this.trailCount.emit(this.trail.length);
            this.trailRecent = response.result[0];
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    
    getApprovalTrail(targetId) {
        const body = {
            all:this.all,
            targetId:targetId,
            operationId:this.operationId,
            operationIds:this.operationIds,
        }
        this.camService.getApprovalTrail(body).subscribe((response: any) => {
            this.trail = response.result;
           
            this.trailCount.emit(this.trail.length);
            this.trailRecent = response.result[0];
        });
    }

    getApprovalLmsTrail(targetId) {
        this.loadingService.show();
        this.camService.getApprovalLMSTrail(targetId,this.operationId).subscribe((response: any) => {
            this.trail = response.result;
            this.trailCount.emit(this.trail.length);
            this.trailRecent = response.result[0];
            this.loadingService.hide();
        });
    }

    printDocumentByElemntId(printTitle: string, elementId: string): void {
        let printContents, popupWin;

        printContents = document.getElementById(elementId).innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title style="font face: arial; size:12px">${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

    exportToExcel(){
        this.loadingService.show();
        this.reportServ.exportApprovalComments(this.trail, this.requireAll).subscribe((response: any) => {
            let doc = response.result;
            if (doc.length != 0) {
                let excel = doc
                // doc.forEach(excel => {
                
                var byteString = atob(excel.reportData);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
            
                try {
                    var file = new File([bb], excel.templateTypeName, {type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var textFileAsBlob = new Blob([bb], {type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName+'.xlsx');
                }
                // });
                
            }  
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }0
}