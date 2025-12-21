import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CreditApprovalService } from '../../../../credit/services/credit-approval.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoanService } from '../../../../credit/services/loan.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ProductTypeEnum, ProductClassEnum } from '../../../../shared/constant/app.constant';
import { CustomerInformationDetailComponent } from '../../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { saveAs } from 'file-saver';
import { AuthorizationService } from '../../../../admin/services';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { CasaService } from 'app/customer/services/casa.service';
import { log } from 'util';

import { logWarnings } from 'protractor/built/driverProviders';

@Component({
    templateUrl: 'contingent-booking-approval.component.html'
})

export class ContingentBookingApprovalComponent implements OnInit {
    userActivities: any;
    isCRMSstaff: any;
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    pdfFile: any;
    pdfFileName: string;
    myDocExtention: string;
    isLms: boolean = false;

    isContigent: boolean = false;
    sendButtonText: string;
    approvers: any[] = [];
    approversCount: any;
    loanApplId: any;
    loanSystemTypeId: any;
    pageText: string = 'Disbursement Initiation';
    loanApprovalData: any[] = [];
    contingentLoanApprovalData: any[] = [];
    revolvingLoanApprovalData: any[] = [];
    displayLoanToApproveModal = false;
    loanSelectedData: any = {};
    loanSelection: any;
    revolvingSelection: any;
    contingentSelection: any;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;
    displayLoanToApproveModal2: any[];
    ContingentLoanApprovalData: any[] = [];

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    // file upload
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    displayOperationRouteCommentForm: boolean;

    @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfo: CustomerInformationDetailComponent;
    loanId: any;
    operationForm: FormGroup;
    approvalLevels: any;
    operationIds: any;
    errorMessage: string = '';
    displayCommentForm: boolean;
    allStaff: any;
    displaySearchModal: boolean;
    displayRouteCommentForm: boolean;
    selectedLineId: any;
    customerAccounts: any;
    isContingentLoan: boolean;
    isRevolvingLoan: boolean;
    isScheduledLoan: boolean;
    isCommercialLoan: boolean;
    isForeignExchangeLoan: boolean;
    casaAccountText: string ='Customer Account';
    isIDF: boolean;
    casaAccount2Text: string;
    productAccountNumber1: any;
    productAccountNumber2: any;
    selectedLoan: any;
    showFacilityTranches: boolean =false;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private camService: CreditAppraisalService,
        private _loanApplServ: LoanApplicationService,
        private loanService: LoanService, private genSetupService: GeneralSetupService,
        private creditApprovalService: CreditApprovalService, private router: Router,
        private approvalService: ApprovalService, private authorizationService: AuthorizationService,
        private casaSrv: CasaService,
    ) {
    }

    ngOnInit() {
        this.loadingService.show();
        this.initializeForm();
        this.loadData();
        this.getAllApprovalStatus();

    }


    initializeForm(){
        this.operationForm = this.fb.group({
            operationId: [''],
            approvalLevelId: [''],
            comment: [''],
            approvalStatusId : [''],
            // casaAccountId: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            // casaAccountId2: ['', Validators.compose([ValidationService.isNumber])],
        });
    }

    loadData() {
        // this.getTermLoansForApproval();
        // this.getRevolvingLoansForApproval();
        this.getContingentLoansForApproval();
    }

    onOperationChange(operationId) {
        this.loadingService.show();
        this.camService.getOperationApprovalLevels(operationId).subscribe((response: any) => {
            this.approvalLevels = response.result;
            this.loadingService.hide(1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getLoanCustomerAccounts( customerId:number) {
        this.casaSrv.getAllCustomerAccountByCustomerId(customerId).subscribe((data) => {
            if(data.success){
                this.customerAccounts = data.result;
                var accountfilter1 = this.customerAccounts.filter(x=>x.casaAccountId == this.loanSelectedData.casaAccountId)[0];
                accountfilter1 ? this.productAccountNumber1 = accountfilter1.productAccountNumber : null;

                var accountfilter2 = this.customerAccounts.filter(x=>x.casaAccountId == this.loanSelectedData.casaAccountId2)[0];
                accountfilter2 ? this.productAccountNumber2 = accountfilter2.productAccountNumber : null;
            }
        }, err => { });
    }

    setLoanByProductTypes(){ 
        if (this.loanSelection.productTypeId === ProductTypeEnum.Revolving) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = true;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.TermLoan) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = true;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
            if(this.loanSelection.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY)
            {
                this.isIDF=true;
                this.casaAccountText = 'Collection Account';
            }
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.CommercialLoans) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = true;
            this.isForeignExchangeLoan = false;
            this.casaAccountText = 'Receiving Account';
            this.casaAccount2Text = 'Paying Account';
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.ForeignExchangeRevolvingFacility) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = true;
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.ContingentLiability) {
            this.isContingentLoan = true;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
    }

    showRerouteForm() {
        this.errorMessage = '';
        this.displayCommentForm = true;
        if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    getTermLoansForApproval() {
        this.loanService.getTermLoansAwaitingApproval().subscribe((response: any) => {
            this.loanApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getSupportingDocuments(applicationNumber: any) {
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        });
    }


    getRevolvingLoansForApproval() {
        this.loanService.getRevolvingLoansAwaitingApproval().subscribe((response: any) => {
            this.revolvingLoanApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getContingentLoansForApproval() {
        this.loanService.getContingentLoansAwaitingApproval().subscribe((response: any) => {
            this.contingentLoanApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getStaffActivity(activity) {
        this.camService.getStaffActivity(activity).subscribe((response: any) => {
            this.isCRMSstaff = response.result;
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            this.approvalStatusData = response.result;
            this.approvalStatusData = this.approvalStatusData.filter(x => x.approvalStatusId == 2);
            //this.approvalStatusData = tempData.slice(3, 4);
        });
    }

    resetButton(value) {
        let indx = this.approvers.findIndex(x => x.staffId == this.loanSelectedData.staffId)
        switch (indx) {
            case 0:
                if (value == 2) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Initiate Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Initiate Overdraft";
                    }
                    else {
                        this.sendButtonText = "Initiate Disbursement";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
            case 1:
                if (value == 2) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Approve Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Approve Overdraft";
                    }
                    else {
                        this.sendButtonText = "Approve Disbursement";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
            case 2:
                if (value == 2) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Commit Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Submit Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disburse Loan";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
        }
    }

    reload: number = 1;
    viewLoanDetails(): any {
        this.loanSelectedData = {};
        this.loanSelectedData = this.loanSelection;
        this.getLoanCustomerAccounts(this.loanSelectedData.customerId);
        this.setLoanByProductTypes();
        this.loanId = this.loanSelectedData.loanId;
        this.loanSystemTypeId = this.loanSelectedData.loanSystemTypeId;
        this.isLms = false;

        this.customerInfo.viewSingleCustomerDetails(this.loanSelectedData.customerId);
        this.loanService.getApprovalTrailByOperation(this.loanSelectedData.operationId, this.loanSelectedData.loanBookingRequestId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        //this.getSupportingDocuments(this.loanSelectedData.applicationReferenceNumber);
        this.reload + 1;
        this.onOperationChange(this.loanSelectedData.operationId);
        this.sendButtonText = "Submit";
        this.loanService.getLoanApprovers(this.loanSelectedData.operationId).subscribe((response: any) => {
            this.approvers = response.result;
            this.approversCount = this.approvers.length;
            let indx = this.approvers.findIndex(x => x.staffId == this.loanSelectedData.staffId);

            if (indx == 0) {
                if (this.loanSelectedData.isBidbond) {
                    this.pageText = "Bond and Gaurantee Contract Initiation";
                }
                else if (this.loanSelectedData.isOverdraft) {
                    this.pageText = "Overdraft Facility Grant Initiation";
                }
                else {
                    this.pageText = "Loan Disbursement Initiation";
                    this.sendButtonText = "Initiation Disbursement";
                }

                if (this.approvalStatusData[0].approvalStatusName == 'Approved') {
                    if (this.loanSelectedData.isBidbond) {
                        this.approvalStatusData[0].approvalStatusName = 'Initiate Contract';
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.approvalStatusData[0].approvalStatusName = 'Initiate Overdraft';
                    }
                    else {
                        this.approvalStatusData[0].approvalStatusName = 'Initiate Disbursement';
                    }
                }
                //else this.sendButtonText = "Disapprove Disbursement";
            }
            else if (indx == 1) {

                if (this.loanSelectedData.isBidbond) {
                    this.pageText = "Bond and Gaurantee Contract Completion";
                }
                else if (this.loanSelectedData.isOverdraft) {
                    this.pageText = "Overdraft Facility Grant Completion";
                }
                else this.pageText = "Loan Disbursement Completion";

                if (this.approvalStatusData[0].approvalStatusName == 'Approved') {
                    if (this.loanSelectedData.isBidbond) {
                        this.approvalStatusData[0].approvalStatusName = 'Approve Contract'
                        this.sendButtonText = "Submit Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.approvalStatusData[0].approvalStatusName = 'Approve Overdraft'
                        this.sendButtonText = "Submit Overdraft";
                    }
                    else {
                        this.approvalStatusData[0].approvalStatusName = 'Approve Disbursement';
                        this.sendButtonText = "Disburse Loan";
                    }
                }
            }
            else if (indx == 3) {

                if (this.loanSelectedData.isBidbond) {
                    this.pageText = "Bond and Gaurantee Contract Verification & Approval";
                }
                else if (this.loanSelectedData.isOverdraft) {
                    this.pageText = "Overdraft Facility Grant Verification & Approval";
                }
                else this.pageText = "Loan Disbursement Verification & Approval";

                if (this.approvalStatusData[0].approvalStatusName == 'Approved') {
                    if (this.loanSelectedData.isBidbond) {
                        this.approvalStatusData[0].approvalStatusName = 'Approve Contract';
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.approvalStatusData[0].approvalStatusName = 'Approve Overdraft Grant';
                    }
                    else this.approvalStatusData[0].approvalStatusName = 'Approve For Disbursement';
                }
            }
        });
        
        this.viewTranch(this.loanSelectedData.loanApplicationDetailId)
        this.displayLoanToApproveModal = true;
        this.getStaffActivity('crms-user')

    }

    viewRevolvingLoanDetails(index, evt) {
        evt.preventDefault();
        this.loanSelectedData = {};
        this.loanSelectedData = this.revolvingLoanApprovalData[index];
        this.displayLoanToApproveModal = true;
        this.getLoanCustomerAccounts(this.loanSelectedData.customerId);
        this.setLoanByProductTypes();
        this.customerInfo.viewSingleCustomerDetails(this.loanSelectedData.customerId);
        this.loanService.getApprovalTrailByOperation(this.loanSelectedData.operationId, this.loanSelectedData.loanId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        // this.loanService.getLoanApprovers(this.loanSelectedData.operationId).subscribe((response: any) => {
        //     this.approvers = response.result;
        //     this.approversCount = this.approvers.length;
        //     let indx = this.approvers.findIndex(x=>x.staffId == this.loanSelectedData.staffId);
        // });
    }

    viewContigentLoanDetails(index, evt) {
        evt.preventDefault();
        this.loanSelectedData = {};
        this.loanSelectedData = this.contingentLoanApprovalData[index];
        this.displayLoanToApproveModal = true;
        this.getLoanCustomerAccounts(this.loanSelectedData.customerId);
        this.setLoanByProductTypes();
        this.customerInfo.viewSingleCustomerDetails(this.loanSelectedData.customerId);
        this.loanService.getApprovalTrailByOperation(this.loanSelectedData.operationId, this.loanSelectedData.loanId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        // this.loanService.getLoanApprovers(this.loanSelectedData.operationId).subscribe((response: any) => {
        //     this.approvers = response.result;
        //     this.approversCount = this.approvers.length;
        //     let indx = this.approvers.findIndex(x=>x.staffId == this.loanSelectedData.staffId);
        // });
    }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {

                try {
                    var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                }
            }
        }
    }
    
    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    promptToGoForApproval(formObj, isManual: boolean = false) {
        const __this = this;
        
        swal({
            title: 'Are you sure?',
            text: 'You want to proceed disbursing this loan.',
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
            __this.authorizationService.enable2FAForLastApproval(__this.loanSelectedData.operationId,null,null,0).subscribe((res) => {
              
                if (res.result === true) {
                        __this.displayTwoFactorAuth = true;
                        __this.loadingService.hide();
                    } else {
                        __this.goForApproval(formObj, isManual);
                        //__this.loadingService.hide();
                    }
                   // __this.loadingService.hide(1000);

            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                __this.loadingService.hide();
            });
                __this.loadingService.hide(30000);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    goForApproval(type,isManual) {
        let bodyObj = {
            targetId: this.loanSelectedData.loanId,
            approvalStatusId: this.loanSelectedData.loanApprovalStatusId,
            comment: this.loanSelectedData.comment,
            operationId: this.loanSelectedData.operationId,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };
        this.loadingService.show();
        this.creditApprovalService.approveLoan(bodyObj, this.loanSelectedData.loanBookingRequestId, isManual).subscribe((response: any) => {
            this.twoFactorAuthPassCode = null;
            this.twoFactorAuthStaffCode = null;
            this.displayTwoFactorAuth = false;
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loadingService.hide(1000);
                this.getTermLoansForApproval();
                this.getRevolvingLoansForApproval();
                this.getContingentLoansForApproval();
                this.displayLoanToApproveModal = false;
            } else {
                this.loadingService.hide(3000);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                this.displayLoanToApproveModal = true;
            }
        }, (err) => {
            this.loadingService.hide(1000);
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    cancelForm() {
        this.displayCommentForm = false;
        this.displayRouteCommentForm = false;
        this.displayOperationRouteCommentForm = false;
        this.errorMessage = '';
        this.loanSelection = null;
        this.selectedLineId = null;
        this.isContingentLoan = false;
        this.isRevolvingLoan = false;
        this.isScheduledLoan = false;
        this.isCommercialLoan = false;
        this.isForeignExchangeLoan = false;
        this.isIDF=false;
        this.casaAccount2Text = '';
        this.casaAccountText = 'Customer Account';
    }

    returnBackToModifier() {
        const __this = this;
        const target = {
            operationId: this.loanSelection.operationId,
            targetId: this.loanSelection.loanBookingRequestId,
            comment: this.operationForm.value.comment,
            approvalLevelId: this.operationForm.value.approvalLevelId
        };


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
            __this.loanService.ReferBackBooking(target).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadData();
                    // __this.resetPage();
                } else {
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

    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanApplId);
        this.displayShowCustInfo = true;
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayLoanToApproveModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayLoanToApproveModal = false;
    }


    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 3) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    ReferToRM() {
        this.displayOperationRouteCommentForm = true;
    }

    CallRequestClose() {  }

    viewTranch(loanApplicationDetailId){
        this.loanService.getLoanFacilityDetal(loanApplicationDetailId).subscribe(response => {
            this.selectedLoan = response.result;
            this.showFacilityTranches = true;
            
    }); 
}

}
