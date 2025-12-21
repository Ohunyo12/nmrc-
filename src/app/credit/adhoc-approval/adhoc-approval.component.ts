// import { LoadingService } from '../../../shared/services/loading.service';
import { LoanService } from 'app/credit/services/loan.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { ConvertString, ProductTypeEnum, ProductClassEnum, GlobalConfig } from 'app/shared/constant/app.constant';
import { CustomerService } from 'app/customer/services/customer.service';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { CustomerInformationDetailComponent } from 'app/customer/components/customer/customer-information-detail/customer-information-detail.component';
import { CollateralInformationViewComponent } from 'app/credit/collateral';
import { JobRequestViewComponent } from 'app/credit/job-request';
import { CasaService } from 'app/customer/services/casa.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { GeneralSetupService } from 'app/setup/services';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { Router } from '@angular/router';
//import { JobRequestViewComponent } from 'app/credit/components';

@Component({
    selector: 'app-adhoc-approval',
    templateUrl: './adhoc-approval.component.html',
    styles: [`
    .remove-btn{
        color:#bbb;
        font-size:27px;
        position:absolute;
        top:0;
        right:0;
    }
    `]
})

export class AdhocApprovalComponent implements OnInit {
    activeTabindex = 0;
    readonly OPERATION_ID: number = 133;
    showCollateralInformation: boolean;
    loanTypeId: any;
    collateralCustomerId: any;
    collateralTypeId: any;
    displayCollateralDetails: boolean;
    disbursableAmount: any;
    loanApplicationId: any;
    loanApplDetailId: any;
    file: any;
    files: any;
    jobSourceId: number;
    secondaryInfocaption: string;
    loanInfoUpdate: any;
    isGroup: boolean;
    pdfFile: any;
    pdfFileName: string;
    myDocExtention: string;
    displayDocument: boolean;
    selectedDocument: any;
    binaryFile: any;
    display: boolean = false; show: boolean = false; width: string; message: any; title: any; cssClass: any;
    displayConfirmDialog = false;
    loanApplication: any[];
    initiationForm: FormGroup;
    approvalStatusData: any[];
    comment: any;
    forwardAction: number = 0;
    displayAdhocApprovalForm: boolean;
    userIsAccountOfficer = false;

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        isActive: false,
        // investmentGradeApprovalLimit: 10000, // todo later
        // maximumTenor: 223, // todo later
        groupRoleId: 1, // bu,ca,md,comm,bd
    };

    inputTitleText = 'Customer Request Document';
    loans: any[] = [];
    loanSelection: any;
    customerSelection: any;
    formState: string = null;
    customerName: string;
    customerCode: string;
    feeTypeText: string;
    uploadFileTitle: string = "Customer Request Document";

    supportingDocuments: any[] = [];

    applicantName: string;
    showCustomerCollaterals: boolean = false;
    customerCollaterals: any[];
    scheduleTitle: string = 'Generate Schedule';
    noDataDiv: string = 'no-data-div';
    casaAccountId: number;
    reload: number = 0;
    casaAccountText: string = 'Customer Account';
    casaAccount2Text: string;

    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(CollateralInformationViewComponent, {static: false}) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(JobRequestViewComponent, {static: false}) jobRequestViewObj: JobRequestViewComponent;
    casaAccountSelected: boolean;
    customerAccounts: any;
    isForeignExchangeLoan: boolean;
    isCommercialLoan: boolean;
    isScheduledLoan: boolean;
    isRevolvingLoan: boolean;
    isContingentLoan: boolean;
    isIDF: boolean;
    vote: number;
    showReferBackModal: boolean = false;
    TARGET_ID: any;
    staffRoleRecord: any;
    operationId: any;

    constructor(private customerService: CustomerService,
        private fb: FormBuilder,
        private loanBookingService: LoanService,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private casaSrv: CasaService,
        private genSetupService: GeneralSetupService,
        private staffRoleService: StaffRoleService,
        private loanApplicationService: LoanApplicationService,
        private router: Router,
    ) { }

    ngOnInit() {
        // this.jobSourceId = JobSource.LoanApplicationDetail;
        // this.initializeControls();
        this.getAdhocLoanApplications();
        this.getAllApprovalStatus();
        this.getUserRole();
        // this.getUserPrivileges();
    }


    getAdhocLoanApplications() {
        this.loadingService.show();
        this.camService.getAdhocApplications(this.OPERATION_ID)
            .subscribe((res) => {
                this.loanApplication = this.loans = res.result;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
            });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    getUserPrivileges(levelId = null) {
        let body = {
            levelId: levelId,
            operationId: this.OPERATION_ID,
            targetId: this.loanSelection.loanApplicationId,
            productClassId: this.loanSelection.productClassId,
            productId: null
        }
        this.camService.getPrivilege(body).subscribe((response: any) => {
            this.privilege = response.result;
            // this.privilege.currentApprovalLevelId = this.obligor.currentApprovalLevelId;
            this.privilege.currentApprovalLevel = this.loanSelection.currentApprovalLevel;

        });
    }

    getCustomerByCustomerId(id: number) {
        this.customerService.getCustomerByCustomerId(id)
    }

    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }

    reAssignResultToLoan(data) {
        this.loanSelection = data;
    }

    onSelectedLoanChange(event) {
        this.loanSelection = event.data;
        //console.log("this.loanSelection: ", this.loanSelection);
        this.getUserPrivileges(this.loanSelection.currentApprovalLevelId);

        if (this.loanSelection.customerType != null) {
            if (this.loanSelection.customerType.toLowerCase() === 'corporate') {
                this.secondaryInfocaption = 'Company Executives';
            } else {
                this.secondaryInfocaption = 'Other Information'
            }
        } else {
            this.secondaryInfocaption = 'Other Information'
        }

        if (!this.loanSelection.customerGroupId === null || this.loanSelection.customerGroupId != 0) {
            this.isGroup = true;
        }

        // this.setLoanByProductTypes();
        this.getLoanCustomerAccounts(this.loanSelection.customerId);

        if (this.customerInfo != undefined) {
            this.customerInfo.viewSingleCustomerDetails(this.loanSelection.customerId);
        }
        
        this.displayAdhocApprovalForm = true;
        this.displayCollateralDetails = false;
        this.applicantName = this.loanSelection.applicantName;
        this.customerName = this.loanSelection.customerName;
        this.customerCode = this.loanSelection.customerCode;
        this.loanTypeId = this.loanSelection.loanTypeId;
        this.loanApplicationId = this.loanSelection.loanApplicationId;
        this.loanApplDetailId = this.loanSelection.loanApplicationDetailId;
        this.operationId = this.loanSelection.operationId;
        this.TARGET_ID = this.loanSelection.loanApplicationId; //loanApplicationId

        if (this.initiationForm != undefined) {
            this.initiationForm.controls['approvedAmount'].setValue(ConvertString.ToNumberFormate(this.loanSelection.approvedAmount));
            this.initiationForm.controls['availableAmount'].setValue(ConvertString.ToNumberFormate(this.disbursableAmount));
        }

        this.disbursableAmount = this.loanSelection.approvedAmount - this.loanSelection.allRequestAmount;
        if (this.disbursableAmount < 0) this.disbursableAmount = 0;

        this.getLoanApplicationCollateral(this.loanSelection.loanApplicationId);
        // this.getSupportingDocuments(this.loanSelection.applicationReferenceNumber);
        // this.jobRequestViewObj.getApplicationDetailRequest(this.loanSelection.loanApplicationDetailId,this.loanSelection.operationId );
        this.activeTabindex = 0;
        this.reload++;
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanBookingService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, err => { });
    }

    getSupportingDocuments(applicationNumber: any) {
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        });
    }

    setLoanByProductTypes() {
        if (this.loanSelection.productTypeId === ProductTypeEnum.Revolving) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = true;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.TermLoan
            || this.loanSelection.productTypeId === ProductTypeEnum.SelfLiquidating
            || this.loanSelection.productTypeId === ProductTypeEnum.SyndicatedLoan) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = true;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
            if (this.loanSelection.isLocalCurrency && this.loanSelection.productClassId == !ProductClassEnum.INVOICEDISCOUNTINGFACILITY) {
                this.casaAccountText = 'Fee Account';
            }
            if (this.loanSelection.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY) {
                this.isIDF = true;
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
            this.casaAccountText = 'Fee Account';
        }
        if (this.loanSelection.productTypeId === ProductTypeEnum.ContingentLiability) {
            this.isContingentLoan = true;
            this.isRevolvingLoan = false;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
        }
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        // this.displayLoanToApproveModal = false;
    }

    resetButton(value) {

    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    // setResponse() {
    //     if () {

    //     }else if () {

    //     }
    // }

    forwardCam() {
        this.loadingService.show();
        if (this.privilege.canApprove == false) {
            this.vote = this.forwardAction;
            this.forwardAction = 0;
        } else {
            this.vote = this.forwardAction;
        }
        let body = {
            forwardAction: this.forwardAction,
            comment: this.comment,
            applicationId: this.loanSelection.loanApplicationId,
            // appraisalMemorandumId: this.selectedAppraisalMemorandumId,
            amount: this.loanSelection.applicationAmount,
            applicationTenor: this.loanSelection.applicationTenor,
            politicallyExposed: this.loanSelection.isPoliticallyExposed,
            productClassId: this.loanSelection.productClassId,
            productId: this.loanSelection.productId,
            investmentGrade: this.loanSelection.isInvestmentGrade,
            receiverLevelId: this.loanSelection.currentApprovalLevelId, // refer back
            receiverStaffId: this.loanSelection.toStaffId, // refer back
            vote: this.vote,
            // recommendedChanges: this.recommendedItems, // line item changes
            // isBusiness: this.isBusiness,
            // untenored: this.untenored,//untenored
            interestRateConcession: null, // TODO
            // feeRateConcession: this.getConcession(), // TODO
        };

        this.camService.forwardAdhoc(body)
            .subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    this.getAdhocLoanApplications();
                    // this.initializeControls();
                    this.displayAdhocApprovalForm = false;
                    this.displayConfirmDialog = false;

                    this.finishGood(res.message);
                } else {
                    this.displayConfirmDialog = false;
                    this.finishBad(res.message);
                    this.loadingService.hide();
                }
            }, (err) => {
                this.displayConfirmDialog = false;
                this.loadingService.hide();
                this.finishBad(err.message);
            })
    }

    //..........DOCUMENT UPLOAD AND MANAGEMENT SECTION...................
    @ViewChild('fileInput', {static: false}) fileInput: any;
    @Input() moduleId: number;
    @Input() moduleReferenceNumber: number;

    uploadFile(sourceId): boolean {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {

                loanApplicationId: this.loanSelection.loanApplicationId,
                loanApplicationNumber: this.loanSelection.applicationReferenceNumber,
                loanReferenceNumber: '',
                documentTitle: this.uploadFileTitle,
                sourceId: sourceId,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '5',
            };

            this.camService.uploadFile(this.file, body).then((val: any) => {
                if (val['success']) {
                    return true;

                } else {
                    return false;
                }

            }, (error) => {
                this.loadingService.hide(1000);
                swal('Customer Request', JSON.stringify(error), 'error')
                return false;
            });
            return true;
        }
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    getLoanCustomerAccounts(customerId: number) {
        this.casaSrv.getAllCustomerAccountByCustomerId(customerId).subscribe((data) => {
            this.customerAccounts = data.result;
        }, err => { });
    }

    onCustomerAccountChange(id): void {
        let account = this.customerAccounts.filter(x => x.casaAccountId == id);

        if (this.loanSelection.currencyId != account[0].currencyId) {
            swal('Fintrak Credit 360', 'You need a ' + this.loanSelection.currencyCode + ' account for this transaction.');
            this.initiationForm.controls['casaAccountId'].setValue("");
        }
        else if ((Number(id) > 0 && id != null)) {
            this.casaAccountSelected = true;
        }
        // else{
        //     this.casaAccountSelected = false;
        //     this.finishBad('Select the customer account');
        // }
    }

    showDialog() {
        // this.initializeControls();
        this.display = true;
    }

    closeDialog() {
        // this.initializeControls();
        this.displayAdhocApprovalForm = false
        this.isContingentLoan = false;
        this.isRevolvingLoan = false;
        this.isScheduledLoan = false;
        this.isCommercialLoan = false;
        this.isForeignExchangeLoan = false;
        this.isIDF = false;
        this.casaAccount2Text = '';
        this.casaAccountText = 'Customer Account';
    }

    // initializeControls() {
    //     this.initiationForm = this.fb.group({
    //         docDescription: ['Customer Request Form', Validators.required],
    //         approvedAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    //         availableAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    //         amountToBook: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    //         casaAccountId: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    //         casaAccountId2: ['', Validators.compose([ValidationService.isNumber])],
    //     });
    // }

    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanSelection.loanApplicationId);
        this.displayShowCustInfo = true;
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

    viewExcelDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);
            var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
            saveAs(file)
        }
    }

    timeAgo(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;
        if (seconds == 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0, format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    hideMessage(event) {
        this.show = false;
    }

    finishBad(message) {
        this.showMessage(message, 'error', 'FintrakBanking');
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    data: any = {};
    formatFeeValue() {
        this.data.bookingAmount = this.initiationForm.value.amountToBook;

        if (this.data.bookingAmount == '') return;
        var realChar: string = this.data.bookingAmount;
        var currVal: string = this.data.bookingAmount.substr(-1);
        if (currVal === 'M' || currVal === 'm' || currVal === 't' || currVal === 'T' || currVal === 'k' || currVal === 'K' || currVal === 'b' || currVal === 'B') {
            realChar = realChar.substr(0, realChar.length - 1);
        }
        else {
            realChar = realChar.substr(0, realChar.length);
        }

        currVal = currVal.substr(-1);

        if (currVal === 'M' || currVal == 'm') {
            let result: Number = Number(realChar) * 1000000;
            this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
            let result: Number = Number(realChar) * 1000;
            this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'b' || currVal === 'B') {
            let result: Number = Number(realChar) * 1000000000;
            this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else {
            let result: Number = Number(realChar);
            this.data.bookingAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }
    }

    modalControl(event) {
        if (event == true) {
            this.showReferBackModal = false;
        }
    }

    referBackResultControl(event) {
        if (event == true) {
            this.getAdhocLoanApplications();
            this.showReferBackModal = false;
        }
    }

    referBack() {
        this.displayAdhocApprovalForm = false;
        this.showReferBackModal = true;
    }

    getUserRole() {
        this.staffRoleService.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
            }
        });
    }

    sendLoanToApplications(){
        const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to modify Loan, this will nullify every approval already done on the loan?',
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
                __this.loanApplicationService.sendLoanToApplications(__this.loanApplicationId, __this.operationId).
                    subscribe((res) => {
                    __this.loadingService.hide();
                    if (res.success){
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        __this.returnToStart();
                    } else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                })
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
    }

    returnToStart() {
        this.router.navigate(['/credit/loan/loan-application-list']);
    }

}