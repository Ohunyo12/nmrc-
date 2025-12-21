import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { JobService } from "../services/job.service";
import {LoanApplicationService} from "../services/loan-application.service";
import { RequestJobTypeService } from '../../setup/services';
import { saveAs } from 'file-saver';

@Component({
    selector:'job-request-view',
    templateUrl: 'job-request-view.component.html'
})

export class JobRequestViewComponent implements OnInit {
    specificJobEntry: any;
    bondsAndGaurantees: any;
    showRequest: boolean;
    firstEduDetail: any;
    invoiceDiscountDetail: any;
    firstTraderDetail: any;
    jobDataText: string;
    jobCollateral: any;
    hasCollateral: boolean;
    loanData: any;
    applicationRecord: any;
    baseLineData: any;
    baseLineJobRequests: any;
    isApplicationDetailRequest: boolean;
    isApplicationDetailRequestInfo: boolean = false;
    isApplicationLineRequest: boolean;
    jobTypes: any[] = [];

    @Output() notify: EventEmitter<any> = new EventEmitter<string>();
    //Input variables
    @Input() loanApplicationId: number;
    @Input() loanApplicationDetailId: number;
    @Input() showTitle: boolean = true;
    @Input() operationId: number;
    @Input() jobSourceId: number;
    //end of input variables
       
    constructor(
        private loadingService: LoadingService,
        private jService: JobService,
        private loanAppServ: LoanApplicationService,
        private jobTypeService: RequestJobTypeService,
    ) { }

    ngOnInit() {
        //this.getLoanApplicationLine();
        //this.getApplicationDetailRequest();
        this.getJobTypes();
    
     }

    getLineData(){
        this.isApplicationLineRequest = true;
        this.isApplicationDetailRequest = false;
        this.isApplicationDetailRequestInfo = false;
        this.showRequest = false;
        this.getLoanApplicationLine();
    }

    getDetailData(){
        this.isApplicationLineRequest = false;
        this.isApplicationDetailRequest = true;
        this.isApplicationDetailRequestInfo = false;
        this.getApplicationDetailRequest(this.loanApplicationDetailId,this.operationId,this.jobSourceId);
    }
    
    getApplicationDetailRequest(loanApplicationDetailId,operationId,jobSourceId){
        this.loadingService.show();
        this.jService.getApplicationDetailJobRequest(loanApplicationDetailId,operationId,jobSourceId).subscribe((response: any) => {
            this.baseLineJobRequests = response.result;
           // console.log('baseLineJobRequests',this.baseLineJobRequests);

            if(this.baseLineJobRequests != null ){
                this.isApplicationDetailRequest = true;
                this.isApplicationLineRequest = false;
            } else {
                this.isApplicationDetailRequest = false;
            }
            
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getLoanApplicationLine(){
        this.loanData = null;
        this.loadingService.show();
        this.jService.getLoanApplicationJobsById(this.loanApplicationId).subscribe((response: any) => {
            this.baseLineData = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getJobRequest(id) {
        let item = this.jobTypes.find(x => x.jobTypeId == id);
        return item == null ? 'n/a' : item.jobTypeName;
    }

    getJobRequestDetail(data) {
        this.isApplicationLineRequest = false;
        this.isApplicationDetailRequest = false;
        this.isApplicationDetailRequestInfo = true;
        this.specificJobEntry = data;
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    viewJobDocument(row) {
        const doc = row;
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
            if ( this.binaryFile  != null) {
                this.binaryFile = this.binaryFile;
                this.selectedDocument = doc.documentTitle;
                //this.displayDocument = true;
            }
        });
    }

    DownloadJobDocument(row) {
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
            if (this.binaryFile!= null) {
                this.selectedDocument = row.documentTitle;
                let myDocExtention = row.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
    
                    try {
                        var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                    }
                }
            }
        });
    }

    getRequestedJob(jobRequestRecord): any {
        this.loanAppServ.getLoanApplicationDetailById(jobRequestRecord['targetId']).subscribe((response: any) => {
        this.applicationRecord = response.result;
        this.loanData = this.applicationRecord[0];
        
            (this.hasCollateral && this.loanData['loanCollateral']) ? this.jobCollateral = this.loanData['loanCollateral'] : this.jobCollateral =[];
            if(this.loanData.productClassName === 'First Trader'){
                this.jobDataText = 'First Trader Info';
                this.firstTraderDetail = this.loanData['firstTradderDetail'];
            } 
    
            if(this.loanData.productClassName === 'Invoice Discounting'){
                this.jobDataText = 'Invoice Discounting Info';
                this.invoiceDiscountDetail = this.loanData['invoiceDiscountDetail'];
            } 
    
            if(this.loanData.productClassName.toLowerCase() == 'First Edu'){
                this.jobDataText = 'First Edu Info';
                this.firstEduDetail = this.loanData['firstEducationtDetail'];
            } 

            if(this.loanData.productClassName === 'Bonds and guarantees'){
                this.jobDataText = 'Bonds and Gaurantees';
                this.bondsAndGaurantees = this.loanData['bondsAndGaurantees'];
            }
            
            this.showRequest = true;
        });
    }

    getJobTypes(){
        this.jobTypeService.getJobTypes().subscribe((response: any) => {
            this.jobTypes = response.result;
        });
    }

    statuses = [
        { id: 1, label: 'Pending', style: 'default' },
        { id: 2, label: 'In Progress', style: 'info' },
        { id: 3, label: 'Completed', style: 'success' },
        { id: 4, label: 'Disapproved', style: 'default' },
        { id: 5, label: 'Cancelled', style: 'default' },
    ];

    getStatus(id) {
        let status = this.statuses.find(x => x.id == +id);
        if (status == null) {
            return '<span class="label label-default">Unknown</span>';
        }
        return `<span class="label label-${status.style}">${status.label}</span>`;
    }

    
    
    popoverYposition: string = '0px';
    popoverSelectedId?: number = null;
    display: string = 'none';

    popoverSeeMore(e, selectedId) {
        if (this.popoverSelectedId == selectedId) {
            this.display = 'none';
            this.popoverSelectedId = null;
            return;
        }
        this.display = 'block';
        this.popoverSelectedId = selectedId;
        this.popoverYposition = (e.y - 125) + 'px'; 
    }

    popoverStyle() {
        return { 'width': '900px', 'top': this.popoverYposition, 'left': '240px', 'display': this.display };
    }
}
