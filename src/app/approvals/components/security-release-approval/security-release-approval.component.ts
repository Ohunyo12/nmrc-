import { Component, OnInit } from '@angular/core';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { saveAs } from 'file-saver';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoanApplicationService, LoanService } from 'app/credit/services';
import { CollateralService } from '../../../setup/services/collateral.service';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { AuthorizationService, AuthenticationService } from '../../../admin/services';

@Component({
    selector: 'app-security-release-approval',
    templateUrl: './security-release-approval.component.html'
})
export class SecurityReleaseApprovalComponent implements OnInit {

    approvalReleases: any[]=[];
    showApprovalBottun = false;
    showUploadeddocument: boolean = false;
    documentUploads: any[];
    selectedRows: any[] = [];
    selection: any;
    activeTabindex: number = 0;
    operationId: number;
    targetId: number;
    fileDocument: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
    displayUploadedDocumentTable: boolean = false;
    comment: any;
    approvalStatusId: any;
    displayCommentForm: any;
    commentForm: FormGroup;
    ShowFacilityDetail: any;
    myGroup: FormGroup;
    originalDocumentApprovalId: any;
    loanSelection: any;
    loanApplicationId: any;
    docSubmissionOperationId: any;
    selectedId: number = null;
    trailApprovalLevels: any;
    rowSelected: boolean = false;
    confirmNumberOfTimesApprove: number = 0;

    perfectionForm: FormGroup;
    perfectionList: any;
    showPerfectionStatus: boolean = false;
    showLitigationStatus: boolean = false;
    showIsOnAmconList: boolean = false;
    staffRoleRecord: any;

    RELOAD: number = 1;
    OPERATION_ID: number = 147;
    CUSTOMER_ID: number;
    GROUP_CUSTOMER_ID: number = -1;
    REFERENCE_NUMBER: string;
    TARGET_ID: number;
    isOnAmconList: any;
    litigationStatus: any;
    perfectionStatus: any;
    isFinalApproval: boolean = false;
    userInfo: any;

    constructor(private creditAppraisalService: CreditAppraisalService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private loanApplService: LoanApplicationService,
        private loanBookingService: LoanService,
        private camService: CreditAppraisalService,
        private collateralService: CollateralService,
        private staffRole: StaffRoleService,
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
        this.userInfo = this.authService.getUserInfo();
        // console.log("userInfo: ", this.userInfo);

        this.approveSecurityRelease();
        this.showCommentForm(true);
        this.clearControls();
        this.loadDropDowns();
        this.getUserRole();
        this.approvalStatusId = 0;
    }

    approveSecurityRelease() {
        this.creditAppraisalService.approveRelease().subscribe((response: any) => {
            this.approvalReleases = response.result;
        });

    }

    isOnAmconListChanged(event) {

    }

    clearControls() {
        this.perfectionForm = this.fb.group({
            perfectionStatusId: ['', Validators.required],
            litigationStatusId: ['', Validators.required],
            isOnAmconList: ['', Validators.required],
        });
    }

    loadDropDowns() {
        this.collateralService.getCollateralPerfectionStatus().subscribe((response: any) => {
            this.perfectionList = response.result;
        });
    }

    getUserRole() {
        const perfectionStatusControl = this.perfectionForm.get('perfectionStatusId');
        const litigationStatusControl = this.perfectionForm.get('litigationStatusId');
        const isOnAmconListControl = this.perfectionForm.get('isOnAmconList');

        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            
            if (this.userInfo.activities.indexOf('perfection approval') > -1) {
                this.showPerfectionStatus = true;
                litigationStatusControl.clearValidators();
                isOnAmconListControl.clearValidators();
            }
            else if (this.userInfo.activities.indexOf('litigation approval') > -1) {
                this.showLitigationStatus = true;
                perfectionStatusControl.clearValidators();
                isOnAmconListControl.clearValidators();
            }
            else if (this.staffRoleRecord.staffRoleCode == 'AMCON OFFICER') {
                this.showIsOnAmconList = true;
                perfectionStatusControl.clearValidators();
                litigationStatusControl.clearValidators();
            }
            else {
                perfectionStatusControl.clearValidators();
                litigationStatusControl.clearValidators();
                isOnAmconListControl.clearValidators();
            }

        });

        perfectionStatusControl.updateValueAndValidity();
        litigationStatusControl.updateValueAndValidity();
        isOnAmconListControl.updateValueAndValidity();
    }

    memoTargetId = 0;
    viewDocuments(row) {
        if(this.staffRoleRecord.staffRoleCode == "CRM VAULT OFFICER" && row.numberOfTimesApprove >= 1){
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Note! You are working on this transaction for the second time`, 'success');
        }
        this.loadingService.show();
        //this.selection = d;
        //this.activeTabindex = 1;
        this.operationId = row.operationId;
        this.docSubmissionOperationId = row.docSubmissionOperationId,
        this.targetId = row.originalDocumentApprovalId;
        this.getDocumentsByTarget();
        this.TARGET_ID = row.collateralId;
        this.memoTargetId = row.originalDocumentReleaseId;
        this.CUSTOMER_ID = row.customerId;
        this.REFERENCE_NUMBER = row.documentReferenceNumber;
        this.RELOAD++;
        this.perfectionStatus = row.perfectionStatusId;
        this.litigationStatus = row.litigationStatusId;
        this.isOnAmconList = row.isOnAmconList;
        this.rowSelected = true;
        this.loadingService.hide(1000);
    }


    getDocumentsByTarget() {

        this.creditAppraisalService.getDocumentsReleasedDocuments(this.docSubmissionOperationId, this.targetId).subscribe((response: any) => {
            this.documentUploads = response.result;
            this.showUploadeddocument = true;
        });

    }

    downloadDocument(d, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(d.documentUploadId).subscribe((response: any) => {
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
    
    showCommentForm(init = false) {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
        });
        if (init == false) this.displayCommentForm = true;
    }

    submitForApproval(perfectionForm) {
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
                originalDocumentApprovalId: __this.targetId,
                operationId: __this.operationId,
                docSubmissionOperationId:__this.docSubmissionOperationId,
                approvalStatusId: __this.approvalStatusId,
                comment: __this.comment,
                perfectionStatusId: perfectionForm.value.perfectionStatusId,
                litigationStatusId: perfectionForm.value.litigationStatusId,
                isOnAmconList: perfectionForm.value.isOnAmconList
            }

            __this.goForApproval(data);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                this.showUploadeddocument = false;
            }
        });
    }

    goForApproval(data) {
        this.loadingService.showKeyApiCall();
        this.creditAppraisalService.SecurityReleaseGoForApproval(data).subscribe((response: any) => {
            this.loadingService.hideKeyApiCall();
            if (response.success == true) {
                { swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success'); }
                this.showUploadeddocument = false;
                this.refreshApprovalCommentAndStatus();
            }
            else { swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error'); }
            this.approveSecurityRelease();
        }, (err) => {
            this.loadingService.hideKeyApiCall(1000);
        });
    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Transaction has been Successfully <strong>${response.statusName}</strong>`, 'success');
        else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    refreshApprovalCommentAndStatus() {
        this.approvalStatusId = 0;
        this.comment = "";
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    modalControl(event) {
        if (event == true) {
            this.displayCommentForm = false;
        }
    }

    referBackResultControl(event) {
        if (event == true) {
            this.approveSecurityRelease();
            this.displayCommentForm = false;
            this.showUploadeddocument = false;;
        }
    }

}
