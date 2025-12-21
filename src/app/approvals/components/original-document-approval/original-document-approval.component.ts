import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService } from 'app/setup/services/approval.service';
import { ApplicationStatus, GlobalConfig } from 'app/shared/constant/app.constant';
import { CreditAppraisalService, LoanApplicationService, LoanService } from 'app/credit/services';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services';


@Component({
    templateUrl: 'original-document-approval.component.html',
    selector: 'original-document-approval',
   // providers: [_SERVICE_IMPORT_, LoadingService] 
})
export class OriginalDocumentApprovalComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    parameter: any;
    applications: any;
    loanSelection: any;
    originalDocumentApprovalId: any;
    originalDocumentApproval: any[];
    showdocumentInformationForm:boolean=false;
    applicationReferenceNumber: any;
    customerId: any;
    operationId: any;
    activeTabindex: number =0;
    documentUploads: any;
    fileDocument: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
    comment:any;
    approvalStatusId:any;
    commentForm: FormGroup;
    displayCommentForm: boolean;
    targetId: any;
    trailApprovalLevels: any;
    displaySearchModal: boolean;
    searchTerm$ = new Subject<any>();
    searchResults: any;


    @Input() set reload(value: number) { if (value > 0) this.getOriginalDocumentApprovals(); }

    formState: string = 'New';
    selectedId: number = null;
    loanDetail:boolean=true;
    facilityDetail:boolean=false;
    documentTab:boolean=false;
    originalDocumentApprovals: any[] = [];
    originalDocumentApprovalForm: FormGroup;
    displayOriginalDocumentApprovalForm: boolean = false;
    deleteLink:boolean=true;
    showUploadForm:boolean=true;
    documentUploadForm: boolean=false;
    documentUploadComponent:boolean=false;
    documentInformationForm: any;
    searchedNameId: any;
    targetStaffStaffId: any;
    reassignedTo: any;
    isReassigned: boolean;
    private _loopIn: boolean = false;
    get loopIn(): boolean {
        return this._loopIn;
    }
    set loopIn(value: boolean) {
        this._loopIn = value;
    }

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalService: ApprovalService,
        private creditAppraisalService: CreditAppraisalService,
        private loanApplService: LoanApplicationService,
        private loanBookingService: LoanService,
        private camService: CreditAppraisalService,
        private realSearchSrv: StaffRealTimeSearchService,

    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result; 
            }
        });
     }

    ngOnInit() {

        this.getOriginalDocumentApprovals();
        this.approvalStatusId=0;
        this.showCommentForm(true);
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
      }


    // ------------------- api-calls --------------------
    backToList() {
        this.activeTabindex = 0;
    }


    getOriginalDocumentApprovals() {
        this.loadingService.show();
        this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
            this.originalDocumentApprovals = response.result;
            this.loadingService.hide();
            
        });
    }

    showCommentForm(init = false) {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            searchedNameId: ['', Validators.required],
        });
        if (init == false) this.displayCommentForm = true;
    }

    returnBack(form) {
        const __this = this;
        const target = {
            targetId: this.loanSelection.originalDocumentApprovalId,
            comment: form.value.comment,
            operationId: this.loanSelection.operationId,
            approvalLevelId: form.value.approvalLevelId
        };
        //console.log('target', target);

        swal({
            title: 'Are you sure?',
            text: 'You want to refer back?',
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

            __this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    __this.displayCommentForm = false;
                    __this.getOriginalDocumentApprovals();
                    __this.activeTabindex = 0;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    __this.displayCommentForm = false;
                    __this.getOriginalDocumentApprovals();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    getApprovalTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.originalDocumentApprovalId, this.operationId).subscribe((response: any) => {
            if(response.success){
                this.trailApprovalLevels = response.result;
                this.loadingService.hide();
                //console.log('this.trailApprovalLevels', this.trailApprovalLevels);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    
    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }


    viewDetail(row) {
        
        this.loanSelection = row;
        // console.log('row', row);
        // console.log('this.loanSelection', this.loanSelection);
        this.operationId = row.operationId;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.customerId = row.customerId;
        this.applicationReferenceNumber = row.applicationReferenceNumber;
        this.facilityDetail = true;
        this.getDocumentsByTarget();
        //this.getApprovalTrail();
        this.activeTabindex = 1;

    }

    getDocumentsByTarget() {
        this.creditAppraisalService.getDocumentsByTarget(this.loanSelection.operationId, this.loanSelection.originalDocumentApprovalId, true).subscribe((response: any) => {
            this.documentUploads = response.result;
        });
    }

    downloadDocument(row, view=false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;

                if (view) {
                    this.displayDocument = true;
                    return;
                }

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
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    goForApproval(data){
            this.loadingService.show();
            this.approvalService.goForApproval(data).subscribe((response: any) => {
            // console.log("response: ", response.result);
            if (response.success == true) { 
                //console.log("response: ", response.result);
                this.refreshApprovalCommentAndStatus();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                // this.displayApplicationStatusMessage(response.result);
                //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approved Successfully!', 'success'); 
            }
            else { 
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            this.loadingService.hide();

            this.getOriginalDocumentApprovals();
            this.getDocumentsByTarget();
            this.facilityDetail = false;
            this.activeTabindex =0;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    
    submitForApproval(){

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
            
            let data = {
                originalDocumentApprovalId :__this.originalDocumentApprovalId,
                approvalStatusId:__this.approvalStatusId,
                comment:__this.comment
            }

            //console.log('data',data)
            __this.goForApproval(data);
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    
    }
   
    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The Original Document(s) has been Successfully <strong>${response.statusName}</strong>`, 'success');
        else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    loopStaff(checked) {

        //console.log('checked',checked);
        this.loopIn = checked;

        const approvalTrailControl = this.commentForm.get('approvalLevelId');
        const loopedStaffIdControl = this.commentForm.get('searchedNameId');
        if(!checked){
            
            approvalTrailControl.setValidators(Validators.required);
            loopedStaffIdControl.clearValidators();
            
        } else {
            approvalTrailControl.clearValidators();
            loopedStaffIdControl.setValidators(Validators.required);
         }
        approvalTrailControl.updateValueAndValidity();
        loopedStaffIdControl.updateValueAndValidity();
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }
    
    pickSearchedData(data) {
        this.searchedNameId = data.fullName;
        this.commentForm.controls['searchedNameId'].setValue(data.staffId);
        this.targetStaffStaffId = data.staffId;
        this.reassignedTo = data.staffId;
        this.isReassigned = true;
        this.displaySearchModal = false;
    }
    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    modalControl(event) {
        if(event == true) {
            this.displayCommentForm = false;
        }
    }

    referBackResultControl(event) {
        if(event == true) {
            this.displayCommentForm = false;
            this.facilityDetail = false;
            this.getOriginalDocumentApprovals();
            this.activeTabindex = 0;
        }
    }

    refreshApprovalCommentAndStatus() {
        this.approvalStatusId = 0;
        this.comment = "";
    }
}

/*
 
*/
