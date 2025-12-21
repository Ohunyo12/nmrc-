import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalStatus, RequestStatus, GlobalConfig, ApplicationStatus, LoanApplicationStatus} from '../../../shared/constant/app.constant';
import { ProductService } from '../../../setup/services/product.service';
import { LoanService } from '../../services/loan.service';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import swal from 'sweetalert2';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { ReportService } from 'app/reports/service/report.service';
import { log } from 'util';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { fromEvent } from 'rxjs';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
//import * as jsPDF from 'jspdf'; 

@Component({
    templateUrl: 'loan-application-search.component.html'
})

export class LoanApplicationSearchComponent implements OnInit {
    @ViewChild('pdfTable', { static: false } as any) pdfTable: ElementRef;
    products: any[];
    applications: any[];
    displaySearchForm: boolean = false;
    searchForm: FormGroup;
    commentForm: FormGroup;
    drawdownHtml: any;
    activeTabindex: any;
    hideCancelPanel: boolean;
    hideGeneralInfoPanel: boolean;
    cancellationReason: any;
    loanApplicationId: any;
    loanApplicationDetail: any;
    showCancelButton: boolean = true;
    activeSearchTabindex: any;
    displaySearchTable: boolean = true;
    reload: number = 0;
    duplications: any;
    proposedItems: any;
    facilityCount: any;
    dynamicsList: any;
    conditionList: any;
    visible: boolean = false;
    supportingDocuments: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
    fileDocument: any;
    changeLog: any;
    facilities: any[] = [];
    applicationReferenceNumber: any;
    displayReport: boolean;
    isOfferLetterAvailable: any;
    applicationStatusId: any;
    searchString: any;
    readonly OPERATION_ID: number = 6;
    fees: any[] = [];
    trail: any[] = [];
    dislpayDrawDownComments = false;
    dislpayDrawDownMemo = false;

    readonly CREDITAPPRIASALDOC: string ="CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string ="DRAWDOWN DOCUMENTS";
    displayDocumentation: boolean = false;
    documentations: any[] = [];
    ready: boolean = false;
    isApplicationCancelled: boolean;
    staffRoleId: any;
    bookinApprovalRecords: any[] = [];
    count: any;
    reportSrc: SafeResourceUrl;
    apiRequestId: any;
    loanSource: string;
    proposedProductId: number;
    productDropDown: string;
    loanApplicationDetails: any;
    loanApplicationDetailId: number;
    loanApplicationDetailIdDrawdown: number;
    customerId: any;
    approvalTrailId = 0;
    nextLevelId = 0;
    displayApproverSearchForm = false;
    displayOwnerSearchForm = false;
    @ViewChild('staffInPut', {static: false}) staffInPut: ElementRef;
    availableApprovers: any[] = [];
    currentStaffActivities: string[] = [];
    currentApprovalLevelId = 0;
    facilityStampDuty: any[] = [];
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    isAppraisal = false;
    // (rerouted)="resetGrid($event)"

    constructor(
        private loadingService: LoadingService,
        private productService: ProductService,
        private loanService: LoanService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private loanAppService: LoanApplicationService,
        private camService: CreditAppraisalService,
        private documentpUloadService: DocumentpUloadService,
        private realSearchSrv: StaffRealTimeSearchService,
        private reportServ: ReportService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.hideCancelPanel = false;
        this.hideGeneralInfoPanel = true;

        const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.staffRoleId = userInfo.staffRoleId;
        this.currentStaffActivities = JSON.parse(sessionStorage.getItem('userActivities'));
    }

    clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });
    }

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    // public downloadAsPDF() {
    //     const doc = new jsPDF();
    
    //     const specialElementHandlers = {
    //       '#editor': function (element, renderer) {
    //         return true;
    //       }
    //     };
    
    //     const pdfTable = this.pdfTable.nativeElement;
    
    //     doc.fromHTML(pdfTable.innerHTML, 15, 15, {
    //       width: 190,
    //       'elementHandlers': specialElementHandlers
    //     });
    
    //     doc.save('FACILITY_APPROVAL_MEMO.pdf');
    //   }

    previewDocumentation(print = false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.OPERATION_ID, this.application.loanApplicationId).subscribe((response) => {
            this.documentations = response.result;
            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    print(): void {
        //this.getAllStaffSignatures();
        this.previewDocumentation(true);
        // if (this.signatures.length > 0) {
        let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.application.applicationReferenceNumber;
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
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
        // }
    }

    getFacilityStampDuty(detailId){
        this.camService.getFacilityStampDuty(detailId).subscribe((response) => {
        
          this.facilityStampDuty = response.result;
         
        });
      }


    getTransacDynamics(loanApplicationId): void {
        this.reload = 0;
        this.loadingService.show();
        this.camService.getTransacDynamics(loanApplicationId).subscribe((response) => {
            this.dynamicsList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    getAllUploadedDocument(value) {
        let data = {
            loanApplicationNumber: value.applicationReferenceNumber,
            databaseTable: 8
        }
        this.loadingService.show();
        this.documentpUloadService.getAllUploadedDocument(data).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    getConditionPrecident(loanApplicationId): void {
        this.reload = 0;
        this.loadingService.show();
        this.camService.getLoanConditionPrecidents(loanApplicationId).subscribe((response) => {
            this.conditionList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    showSearchForm() { this.displaySearchForm = true; }

    onTabChange(obj) { }

    submitForm(form) {
        
        this.searchString = form.value.searchString;
        let body = {
            searchString: form.value.searchString
        };

            this.loadingService.show();
            this.loanService.loanApplicationSearch(body).subscribe((response) => { 
            this.loadingService.hide();
            this.applications = response.result;
            this.displaySearchForm = false;
            this.displaySearchTable = true;
            this.facilities = [];
            this.bookinApprovalRecords = [];
            this.displayApplicationDetail = false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
        // this.loadingService.hide();
    }

    getFacilityDrawDownDetails(loanApplicationDetailId: number){
        if(!(loanApplicationDetailId > 0)){
            return;
        }
        this.bookinApprovalRecords = [];
        this.loanApplicationDetailIdDrawdown = loanApplicationDetailId
        this.loadingService.show();
        this.loanService.loanApplicationSearchBookedLoans(loanApplicationDetailId).subscribe((response) => {
        this.loadingService.hide();
        if(response.success)
        {
            this.bookinApprovalRecords = response.result;
            this.count = response.count;
        }        
        }, (err: any) => {
            this.loadingService.hide(2000);
        });
    }

    displayApplicationDetail: boolean = false;
    application: any = {};

    view(row) {
        this.application = row;
        this.updateWorkflowTarget(row);
        this.customerId = row.customerId;
        this.apiRequestId = row.apiRequestId;
        this.isOfferLetterAvailable = !row.isOfferLetterAvailable;
        this.currentApprovalLevelId = row.currentApprovalLevelId;
        this.getFacilityByApplicationId(this.application.loanApplicationId);
        
        if (row.applicationStatusId == 22) { 
            this.isApplicationCancelled = true;
        }
        else {
            this.isApplicationCancelled = false;
        }
         
        this.applicationStatusId = row.applicationStatusId
        this.displayApplicationDetail = true;
        this.displaySearchTable = false;
        this.getFacilityStampDuty(row.loanApplicationId)
        this.applicationReferenceNumber = row.applicationReferenceNumber;
        this.getLoanApplicationById(row.loanApplicationId);
        this.getLoanApplicationFees(row.loanApplicationId);
        this.getTransacDynamics(row.loanApplicationId);
        this.getConditionPrecident(row.loanApplicationId);
        // this.getAllUploadedDocument(row);
        this.getLoanDetailChangeLog(row);
        
        this.reload++; 

        if (this.apiRequestId == null) {
            this.loanSource = "Credit360 Portal";
        }
        else {
            this.loanSource = "Cashflow Portal";
        }
    }

    forwardRequest(form) { 
        let body = {
            comment: form.value.comment,
            applicationId: this.application.loanApplicationId,
            applicationStatusId: this.application.applicationStatusId
        };
        this.loadingService.show();
        this.loanService.forwardReviewRequest(body).subscribe((response) => {
            
            this.loadingService.hide();
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/>' + response.result, 'success');
                this.displayApplicationDetail = false; 
                this.displaySearchTable = true;
                //this.getRejectedApplications();
                //this.displayApplicationDetail=false;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    

    approvalStatus = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Processing' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Disapproved' },
        { id: 4, name: 'Authorised' },
        { id: 5, name: 'Referred' },
    ];

    getApprovalStatus(id) {
        let item = this.approvalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">DISAPPROVED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }
    // message

    getApplicationStatusMain(submitted, approvalStatus) {
        if (submitted == true) {
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return 'FAM PROCESS';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return 'FAM PROCESS';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return 'FAM PROCESS';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return 'APPROVED';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return 'DISAPPROVED';
        }
        return 'NEW APPLICATION';
    }

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }

    cancelLoan() {
        // let body = {
        //     cancellationReason: this.cancellationReason,
        //     loanApplicationId:this.application.loanApplicationId,
        //     applicationStatusId : this.applicationStatusId
        // };

        // this.loanService.loanApplicationCancellationRequest(body).subscribe((response) => {

        //     if(response.success==true){
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
        //     }else{
        //         if(response.warning==true){
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
        //         }else{
        //             swal(`${GlobalConfig.APPLICATION_NAME}`, "Saving failed an error", 'error');
        //         }
        //     }

        // },(err: any) => {
        //     this.loadingService.hide();
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'success');
        //     ////console.log('err',  err);
        // });

        this.hideCancelPanel = true;
        this.hideGeneralInfoPanel = false;
    }
    
    saveLoanApplicationCancellation() {

        var __this = this;

        swal({
            title: 'Are you sure?',
            text: 'This action will go for approvals if It has been Treated by Someone Else Asides You. Are you sure you want to proceed?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,

        }).then(function () {

            __this.loadingService.show();

            let body = {
                cancellationReason: __this.cancellationReason,
                loanApplicationId: __this.application.loanApplicationId,
                applicationStatusId: __this.applicationStatusId
            };
            
            __this.loanService.loanApplicationCancellationRequest(body).subscribe((response) => {
                __this.applications = response.result;
                __this.loadingService.hide();
                if (response.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    if (response.warning == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                    } else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    }
                }
                __this.displayApplicationDetail = false;
            }, (err: any) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'success');
                
            });

            __this.hideCancelPanel = false;
            __this.hideGeneralInfoPanel = true;

            __this.loadingService.hide();

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
        this.submitForm(this.searchString)
        this.displayApplicationDetail = false; this.displaySearchTable = true;
    }

    deleteDocument(row): void {

        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();

            __this.documentpUloadService.deleteUploadedDocument(row).subscribe((response: any) => {
                __this.binaryFile = response.result.fileData;
                __this.loadingService.hide();

                __this.getAllUploadedDocument(row);

            }, (err: any) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
                __this.loadingService.hide();
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    viewDocument(row) {
        this.loadingService.show();
        this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
            this.binaryFile = response.result.fileData;
            this.selectedDocument = response.result.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
            ////console.log("error", error);
        });
    }

    cancelAction() {
        this.hideCancelPanel = false;
        this.hideGeneralInfoPanel = true;
    }

    getLoanApplicationById(id): void {
        this.loadingService.show();
        this.loanAppService.getLoanApplicationById(id).subscribe((response) => {
            this.loanApplicationDetail = response.result;
            //console.log('Details>>>>>>>', JSON.stringify(this.loanApplicationDetail));
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    DownloadDocument(id: number) {
        this.fileDocument = null;
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response) => {
            this.fileDocument = response.result;
            // let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
                let myDocExtention = this.fileDocument.fileExtension;
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

    getLoanDetailChangeLog(row): void { // PLEASE LAZY LOAD THIS!!!
        this.camService.getLoanDetailChangeLog(row.loanApplicationId).subscribe((response) => {
            this.changeLog = response.result;
        }, (err) => {
        });
    }

    popoverSeeMore() { 
        this.ready=false;
        this.loadingService.show();
        let path = '';
        const data = {
            applicationRefNumber: this.applicationReferenceNumber,
        }
       
        this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response) => {
            path = response.result;
            this.displayReport = true;
         
            this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);

            this.ready=true;
        });
        this.loadingService.hide(5000);
        return;

    }

    applicationOwner: boolean = false;

    isCreator() {
        if (this.application == null) return false;
        const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
        return this.application.createdBy == user.staffId;
    }

    getFacilityByApplicationId(loanApplicationId) {
        this.proposedProductId = 0;
        this.productDropDown =""
        this.loadingService.show();
        this.camService.GetFacilityByApplicationId(loanApplicationId).subscribe((data) => {
            this.loadingService.hide();
            this.facilities = data.result;
            this.loanApplicationDetails = data.result;
        }, err => { 
            this.loadingService.hide(1000);
        });
    }

    getRac(id) {       
        let list = this.facilities.filter(x => x.productId == id); 
        this.loanApplicationDetailId = list[0].loanApplicationDetailId;
        this.proposedProductId = id
    }
    
    // getApplicationOwner(row): void {
    //     this.camService.getApplicationOwner(row.loanApplicationId).subscribe((response) => {
    //         this.applicationOwner = response.result;
    //     });
    // }

    getLoanApplicationFees(loanApplicationId: number): void {
        this.loadingService.show();
        this.camService.getLoanApplicationFees(loanApplicationId).subscribe((response) => {
            this.fees = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewDrawDownData(row){
        this.trail = row.comments;
        this.dislpayDrawDownComments = true;
    }

    viewDrawDownMemo(row){
        this.getDrawdownMemoHtml(row.loanBookingRequestId);
    }

    getDrawdownMemoHtml(bookingRequestId) {
        if(!(bookingRequestId > 0)){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Initiate Draw Down First!', 'error');
            return;
        }
        this.loadingService.show();
        this.camService.getDrawdownMemoHtml(bookingRequestId).subscribe((response) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
            this.loadingService.hide();
            this.dislpayDrawDownMemo = true;
    }, (err) => {
            this.loadingService.hide(1000);
            //
        });
      }
      
      printMemo(): void {
        let printTitle = 'DRAWDOWN MEMO';
        let printContents, popupWin;
        printContents = document.getElementById('print-drawdown-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
              <head>
              <title>${printTitle}</title>
              <style>s
              </style>
              </head>
              <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
      }

    selectapprover(row, isAppraisal = false){
        this.isAppraisal = isAppraisal;
        this.approvalTrailId = row.approvalTrailId;
        this.nextLevelId = row.currentApprovalLevelId;
        this.displayApproverSearchForm = true;
    }

    selectOwner(row){
        this.loanApplicationId = row.loanApplicationId;
        this.displayOwnerSearchForm = true;
    }

    refresh(){
		this.availableApprovers = [];
        this.approvalTrailId = null;
        this.nextLevelId = null;
        this.loanApplicationId = null;
        this.currentApprovalLevelId = null;
    }

    displayApproverSearchModal(event: boolean){
        this.displayApproverSearchForm = event;
        if(!event){
            this.refresh();
            if (this.isAppraisal){
                this.reloadSearch();
            }else if(!this.isAppraisal){
                this.getFacilityDrawDownDetails(this.loanApplicationDetailIdDrawdown);
            }
        }
    }

    pickSearchedApprover(row){
        const selectedApprover = row.staffCode + ' -- ' + row.firstName + ' ' + row.lastName;
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign Ownership of this application to ' + selectedApprover + '?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.camService.changeApplicationOwner(__this.loanApplicationId, row.staffId).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.refresh();
                    __this.displayOwnerSearchForm = false;
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }
    
    reloadSearch(){
        let body = {
            searchString: this.searchString
        };
        this.loadingService.show();
            this.loanService.loanApplicationSearch(body).subscribe((response) => { 
            this.loadingService.hide();
            this.applications = response.result;
            console.log(response.result)
            this.displaySearchForm = false;
            this.displaySearchTable = true;
            this.facilities = [];
            this.bookinApprovalRecords = [];
            this.displayApplicationDetail = false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    // reloadSearch() {
    //     let body = {
    //         searchString: this.searchString
    //     };
    
    //     this.loadingService.show();
    //     this.loanService.loanApplicationSearch(body).subscribe((response) => {
    //         this.loadingService.hide();
    
    //         // Extract only the loanApplicationId from each item
    //         this.applications = response.result.map((item: any) => item.relationshipOfficerId);
    
    //         this.displaySearchForm = false;
    //         this.displaySearchTable = true;
    //         this.facilities = [];
    //         this.bookinApprovalRecords = [];
    //         this.displayApplicationDetail = false;
    
    //         console.log("Loan Application IDs:", this.applications);
    //     }, (err: any) => {
    //         this.loadingService.hide(1000);
    //     });
    // }
    
	
	ngAfterViewInit(): void {
		fromEvent(this.staffInPut.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
			this.realSearchSrv.searchEntries(this.staffInPut.nativeElement.value)
			.subscribe(results => {
				if (results != null) {
					this.availableApprovers = results.result;
				}
			});
		});
    }
    
    searchApprover(searchString) {
    }

    isAmongActivities(activity: string): boolean {
        if (this.currentStaffActivities == undefined) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
    }

    updateWorkflowTarget(applicationSelection: any) { ////console.log('availment loan selection',this.selectedRecord);
        this.workflowTarget.targetId = applicationSelection.loanApplicationId;
        this.workflowTarget.operationId = applicationSelection.operationId;
        this.workflowTarget.productClassId = applicationSelection.productClassId;
        this.workflowTarget.productId = applicationSelection.productId;
        this.workflowTarget.toStaffId = applicationSelection.toStaffId; // optional
        this.workflowTarget.responsiblePerson = applicationSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.currentApprovalLevel = applicationSelection.currentApprovalLevel; // required if toStaffId is given
        // this.workflowTarget.finalApprovalLevelId = null; //this.applicationSelection.finalApprovalLevelId;
        //this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }

}
