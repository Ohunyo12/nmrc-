import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobService } from "../services/job.service";
import { CasaService } from '../../customer/services/casa.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { JobRequestStatusEnum, GlobalConfig } from 'app/shared/constant/app.constant';
import { AuthorizationService } from 'app/admin/services/authorization.service';


@Component({
    templateUrl: 'legal-job-request-confirmation.component.html',
    styleUrls: ['job-request.component.scss'],
})

// tslint:disable-next-line:component-class-suffix
export class LegalJobRequestConfirmation implements OnInit {
    userSpecific: boolean;
    displayTwoFactorAuth2: boolean;
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    customerAccount: any;
    //jobForm: FormGroup;
    isRejection: boolean;
    legalConsultantJobs: any;
    customer: any;
    chargeType: any;
    jobRequestDetailId: any;
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    replyForm: FormGroup; 
    displayResponseModal: boolean = false;
    row: any;
    displayTwoFactorAuth: boolean;
    statusFeedbackList: any;
    jobApprovalStatus: any;
    constructor(
        private loadingService: LoadingService,
        private jService: JobService,
        private fb: FormBuilder,
        private casa: CasaService,
        private authorizationService: AuthorizationService
    ) { }

    ngOnInit() {
        this.clearControls();
        this.GetLegalCollateralJobsAwaitingConfirmation();
        this.getApprovalStatus();
    }

    GetLegalCollateralJobsAwaitingConfirmation() {
        this.jService.getLegalToConsultantJobsAwaitingconfirmation().subscribe((response: any) => {
            this.legalConsultantJobs = response.result;
        });
    }

    clearControls() {
        this.replyForm = this.fb.group({
            responseComment: ['',Validators.required],
            description: [''],
            jobSubTypeId: [''],
            disapprove: [''],
            fileInput: [''],
            statusId:[JobRequestStatusEnum.Approved],
            feedBackId:['']
        });
    }

    viewChargeDetails(rowData, $event)
    {
    }

    getCustomerAccount(id) {
        this.casa.getAllCustomerAccountByCustomerId(id).subscribe((response: any) => { 
            this.customerAccount = response.result; 
            },);
        }

    StartConfirmation(row) { 
        //console.debug('row', row);
        this.row = row;
        this.getSupportingDocuments(row.jobRequestCode);
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to confirm this search.',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'No! Cancel',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
                    if (res.result == true) {
                        if(res.userSpecific) { 
                            __this.userSpecific = true;
                        }
                        else {
                            __this.userSpecific = false;
                        }
                        __this.displayTwoFactorAuth = true;
                        __this.loadingService.hide();
                    } else {
                        __this.displayResponse();
                    }

                }, (err) => {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    __this.loadingService.hide();
                });
                __this.loadingService.hide(30000);
            
           // __this.promptToGoForApproval(__this.row);
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                //__this.endConfirmation(__this.row);
                __this.displayResponseModal = false;
            }
        });
    }

    displayResponse(){
        this.displayResponseModal = true;
    }

    endConfirmation(row) { 
        this.getSupportingDocuments(row.jobRequestCode);
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'Do you want to reverse search.',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Reverse entries',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
                    if (res.result == true) {
                        if(res.userSpecific) { 
                            __this.userSpecific = true;
                        }
                        else {
                            __this.userSpecific = false;
                        }
                        __this.displayTwoFactorAuth = true;
                        __this.loadingService.hide();
                    } else {
                        __this.promptToGoForReversal(row);
                    }

                }, (err) => {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    __this.loadingService.hide();
                });
                __this.loadingService.hide(30000);
            
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                __this.displayResponseModal = false;
            }
        });
    }

    promptToGoForReversal(row) {this.row = row; this.displayTwoFactorAuth2 = true; }

    promptToGoForApproval(row) {this.row = row; this.displayTwoFactorAuth = true; }

    confirmCollateralSearch() { 
        //console.log('row',this.row);
        const body = {
            jobRequestDetailId: this.row.jobRequestDetailId,
            jobRequestId : this.row.jobRequestId,
            isInitiation: false,
            jobSubTypeId:this.row.jobSubTypeId,
            responseMessage: this.replyForm.value.responseComment,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        }; 
        this.loadingService.show();
        this.jService.DebitAccountWithLegalFees(body).subscribe((res) => {
            if (res.success === true) {
                swal('', res.message, 'success');
                this.hideDialogs();
                this.GetLegalCollateralJobsAwaitingConfirmation();
                this.loadingService.hide(1000);             
            } else {
                this.loadingService.hide(1000);
                swal('', res.message, 'error'); 
            }
        }, (err: any) => {
            swal('', JSON.stringify(err), 'warning');
            this.loadingService.hide(1000);
        });
    }

    hideDialogs(){
        this.displayTwoFactorAuth = false;
        this.displayTwoFactorAuth2 = false;
        this.displayResponseModal = false;
    }
    reverseCollateralSearch(){
        const body = {
            jobRequestDetailId: this.row.jobRequestDetailId,
            jobRequestId : this.row.jobRequestId,
            jobSubTypeId: this.row.jobSubTypeId,
            isInitiation: false,
            responseMessage: this.replyForm.value.responseComment,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        }; 
        this.loadingService.show();
        this.jService.CreditAccountWithLegalFees(body).subscribe((res) => {
            if (res.success === true) {
                swal('', res.message, 'success');
                
                this.hideDialogs();
                this.displayTwoFactorAuth2 = false;
                this.GetLegalCollateralJobsAwaitingConfirmation();
                this.loadingService.hide(1000);             
            } else {
                this.loadingService.hide(1000);
                swal('', res.message, 'error'); 
            }
        }, (err: any) => {
            swal('', JSON.stringify(err), 'warning');
            this.loadingService.hide(1000);
        });
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
        const docDescription = this.replyForm.get('description');
        docDescription.setValidators(Validators.required); 
    }

    getSupportingDocuments(jobRequestCode: any) {
        this.jService.getSupportingDocumentByJobRequestCode(jobRequestCode).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            if(this.supportingDocuments.length > 0){
                //this.showDocumentGrid = true; 
            }
            let doctype = this.supportingDocuments.values;
        });
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    validateUpload(){ 
        if (this.file != undefined && this.uploadFileTitle != null) {
            let uploadArray = {
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name)
            }
            swal('Upload Request',uploadArray.fileName + uploadArray.fileExtension + ' loaded', 'info');
        } else {
            swal('Upload Request','File Upload failed', 'info');
        }
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    viewDocument(row) {
        const doc = row;
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
            if ( this.binaryFile  != null) {
                this.binaryFile = this.binaryFile;
                this.selectedDocument = doc.documentTitle;
                this.displayDocument = true;
            }
        });
    }

    DownloadDocument(row) {
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

    getDocumentDataByDocumentId(documentId): any{
        this.jService.getSupportingDocumentById(documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
        });
    }

    
    getJobStatusFeedback(statusId): any {
        this.jService.getJobStatusFeedback(statusId,this.row.jobTypeId).subscribe((response: any) => {
            this.statusFeedbackList = response.result;    
        });
    }

    getApprovalStatus() {
        this.jService.getJobRequestApprovalStatus().subscribe((response: any) => { 
            let statuses = response.result;
            this.jobApprovalStatus = statuses.filter(x=>x.approvalStatusId != JobRequestStatusEnum.Pending
                && x.approvalStatusId != JobRequestStatusEnum.Processing);
            },);
    }

    onApprovalStatusChange(inval){
        if(inval == JobRequestStatusEnum.Disapproved || inval == JobRequestStatusEnum.Cancel ){
            this.getJobStatusFeedback(inval);
            this.isRejection  = true;
        } 
        else if(inval == JobRequestStatusEnum.Approved ){
            this.isRejection  = false;
        }     
    }
        
    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.showMessage(message, 'success', "FintrakBanking");
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
}
