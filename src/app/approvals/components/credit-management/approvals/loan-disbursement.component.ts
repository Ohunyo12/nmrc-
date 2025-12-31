import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { PrintModel } from 'app/shared/models/print-model';
import { PrintService } from 'app/shared/services/print.service';
import { ReportService } from 'app/reports/service/report.service';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { DatePipe } from '@angular/common';
import { LoanCovenantModel, ChargeFeeAppModel, LoanModel, LoanCollateralModel, monitoringTriggersModel, contingentLoanInputModel, revolvingLoanInputModel, FXLoanBeneficiaryModel, LoanSchedule } from 'app/credit/models';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CustomerInformationDetailComponent } from 'app/customer/components';
import { CollateralInformationViewComponent } from 'app/credit/collateral';
import { CustomerService } from 'app/customer/services/customer.service';
import { ProductService, GeneralSetupService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { AuthenticationService, ExchangeRateService, AuthorizationService } from 'app/admin/services';
import { CreditAppraisalService, LoanService, CreditApprovalService } from 'app/credit/services';
import { CasaService } from 'app/customer/services/casa.service';
import { ApprovalStatusEnum, DayCountConventionEnum, ProductClassEnum, ProductTypeEnum, ConvertString, GlobalConfig, JobSource } from 'app/shared/constant/app.constant';
import { JobRequestViewComponent } from 'app/credit/job-request/job-request-view.component';
import { SheduleComponent } from 'app/credit/loans/schedule/schedule.component';
import { debug } from 'util';
import { Router } from '@angular/router';
import { IAppraisal } from 'app/shared/models/appraisal.model';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';

@Component({
    selector: 'loan-disbursement',
    templateUrl: 'loan-disbursement.component.html',
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

export class LoanDisbursementComponent implements OnInit {
    productCurrencyPriceIndex: any;
    twoFactorAuthStaffCode: string = null;
    coreBankingRef: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    displayCoreBankingDialog: boolean = false;
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    reload: number = 0;
    showCollateralInformation: boolean;
    customerAccounts: any;
    revolvingTypeId: number = 0;
    revolvingTypes: any;
    pagetitle: string = "Facility Disbursement";
    basis: any;
    isLoanRowAboveLimit: boolean;
    systemDate: Date;
    valueBase: string;
    collateralCustomerId: any;
    casaBalance: any;
    customerSelection: any;
    chargeSelection: any[];
    customerCode: string;
    customerName: string;
    collapseForm: boolean = true;
    casaAccountId: number;
    covenantRateText = 'Covenant Amount';
    covenantCollection: LoanCovenantModel[] = [];
    chargeCollection: ChargeFeeAppModel[] = [];
    covenantDetails: any[];
    customerCollaterals: any[];
    baseCurrencyData: any;
    baseCurrencyId: number;
    baseCurrencyCode: string;
    binaryFile: any;
    displayDocument: boolean;
    display: boolean = false;
    displayLoanList: boolean = true;
    displayBookedLoans: boolean = false;
    displayCollateralList: boolean = true;
    disableAmountField: boolean = true;
    disableFrequencyField: boolean = true;
    displayGoBack: boolean = false;
    displayLoanCollateral: boolean = true;
    displayJobrequest = false;
    headerText: string = 'Staff List';
    adAuthPassCode: string = null;

    isGroup: boolean = false;
    isContingentLoan: boolean = false;
    isRevolvingLoan: boolean = false;
    isCommercialLoan: boolean = false;
    isForeignExchangeLoan: boolean = false;
    isIDF: boolean = false;
    isScheduledLoan: boolean = false;

    selectedLoanApplicationId?: number = null;
    selectedLoanId?: number = null;
    selectedLoanCustomerId?: number = null;
    shouldDisburse: any;
    secondaryInfocaption: string;
    showCustomerCollaterals: boolean = false;
    scheduleTitle: string;
    selectedDocument: any;
    supportingDocuments: any[] = [];
    selectedLoanProductId?: number = null;
    selectedCovenantId?: number = null;
    scheduleCollection: LoanSchedule[] = [];
    loanBookingForm: FormGroup;
    operationForm: FormGroup;
    covenantDetailForm: FormGroup;
    chargeForm: FormGroup;
    operationsId: number = 1;
    loanApplicationDetailId: number;
    loanApplication: any[];
    loanProductFees: any[];
    loanCharges: any[] = [];
    loanAmount: number;
    loanDate: Date;
    loanApplId: any;
    loans: any[] = [];
    loanSelection: any;
    loanInfoUpdate: any;
    feeAmountTotal: number;
    feeTypeText: string;
    feeInterval: number;
    finishedSchedule: boolean = false;
    feeOverride: boolean = false;

    myDocExtention: string;
    show: boolean = false; width: string; message: any; title: any; cssClass: any;
    applicableCollaterals: any[] = [];
    additionalPropertyCollateralValues: any[] = [];
    pdfFile: any;
    pdfFileName: string;
    loanCollection: LoanModel;
    loanSelectedData: any[];
    loanProductTypeTitle: string;
    loanInterestRate: number;
    loanApprovedAmountText: string = 'Approved Amount';

    collateralCollection: LoanCollateralModel[] = [];
    monitoringTriggerCollection: monitoringTriggersModel[] = [];
    contingentLoanInputCollection: contingentLoanInputModel;
    revolvingLoanInputCollection: revolvingLoanInputModel;

    groupMembers: any;
    applicantName: string;
    viewStatus: boolean = false;
    visibleSubmit: string = 'hide';
    overrideVisible: string = 'hide';
    integralFeeAmount: number;
    beneficiaryCurrencyId: any;
    beneficiaryAmount: number;
    beneficiaryReason: string;
    beneficiaryRateCode: string;
    beneficiaryRateAmount: number;
    beneficiaryList: FXLoanBeneficiaryModel[] = [];
    exchangeRate: number;
    tranchAmount: number;
    buttonTitle: string = 'Book Loan';
    selectedAccountBalance: any;
    commercialLoans: any;
    currencies: any[] = [];
    rateCodes: any;
    beneficiaryCurrencyCode: any;
    beneficiaryRateCodeId: any;
    nostroAccount: any;
    newExchangeRate: any;
    nostroCurrencyCode: string;
    interestCapCurrencyCode: string;
    sellingRate: any;
    totalAddedBeneficiaryAmount: number = 0;
    reportSrc: SafeResourceUrl;
    form3800bSrc: any = {};
    OLApplicationReferenceNumber: any;
    displayTestReport: boolean;
    displayReport: boolean;
    enableReroute: boolean;
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    destinationCurrencyAmount: number = 0;
    destinationCurrencyCode: any;
    userInfo: any;
    referredId: number;
    interestRateAmount: number;
    isDicounted: boolean;
    repricingMode: any;
    basisCommercial: any;
    bookedFacilityData: any;
    currencyId: number;
    scheduleData: LoanSchedule;
    override: any;
    interestCapAccount: any;
    displayOperationRouteCommentForm: boolean;
    approvalLevels: any;
    errorMessage: string = '';
    displayCommentForm: boolean;
    allStaff: any;
    reportSource: SafeResourceUrl;
    applicationReferenceNumber: any;
    benficiaries: any;
    bookingApprovalStatusId: number;
    approvalcomment: string;
    displayDocumentUpload: boolean = false;
    displayADAuth: boolean = false;

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    adActive: boolean = false;
    bulkUPload: boolean = false;
    buttonText: any;
    failedUpload: any;
    uploadedData: any;
    isFinal: boolean = false;
    excelData: any[] = [];
    bulkDisbursement: FormGroup;
    disburseSelection: any;
    periodicSchedule: any[] = [];
    schedules: any[] = [];
    scheduleHeader: any = {};
    maturityDate: any;
    displayScheduleModalForm: boolean = false;
    drawdownHtml: any;

    @ViewChild(CustomerInformationDetailComponent, { static: false }) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(CollateralInformationViewComponent, { static: false }) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(JobRequestViewComponent, { static: false }) jobRequestViewObj: JobRequestViewComponent;
    @ViewChild(SheduleComponent, { static: false }) scheduleObj: SheduleComponent;
    approvalStatusData: any;
    RevolvingFacilityData: any;
    formData: any;
    approvalWorkflowData: any;
    jobSourceId: number;

    // Obligor Checklist
    uwsList: any[] = [];
    isPreviewModalVisible: boolean = false;
    selectedDocumentUrl: SafeResourceUrl | null = null;
    fileType: string = '';
    zoomLevel: number = 1;
    dragging: boolean = false;
    startX: number = 0;
    startY: number = 0;
    imageList: string[] = [];
    currentImageIndex: number = 0;
    maxZoom: number = 3;
    minZoom: number = 1;
    selectedLoan: IAppraisal | null = null;

    // checklist dashboard
    // Checklist summary properties for selected individual loan
    checklistSummary: {
        total: number;
        yes: number;
        no: number;
        waived: number;
        deferred: number;
        yesPercent: number;
        noPercent: number;
        waivedPercent: number;
        deferredPercent: number;
    } = {
            total: 0,
            yes: 0,
            no: 0,
            waived: 0,
            deferred: 0,
            yesPercent: 0,
            noPercent: 0,
            waivedPercent: 0,
            deferredPercent: 0
        };
    isLoadingChecklistSummary: boolean = false;

    constructor(private customerService: CustomerService,
        private fb: FormBuilder,
        private loanBookingService: LoanService,
        private loadingSrv: LoadingService,
        private exchangeRateService: ExchangeRateService,
        private productService: ProductService,
        private camService: CreditAppraisalService,
        private casaSrv: CasaService,
        private authService: AuthenticationService,
        private loanApplServ: LoanApplicationService,
        private _printService: PrintService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
        private genSetupService: GeneralSetupService,
        private creditApprovalService: CreditApprovalService,
        private authorizationService: AuthorizationService,
        private router: Router,
        private loadingService: LoadingService,
        private underwritingService: UnifiedUnderwritingStandardService
    ) { }

    ngOnInit() {
        this.jobSourceId = JobSource.LoanBookingAndApproval;
        this.initializeControls();
        this.getAvailedMultipleApplicationsForBooking();
        this.getFacilityLineForApproval();
        this.getCRMSRepaymentType();
        this.getBaseCurrency();
        this.getAllCurrencies();
        this.getAllApprovalStatus();

        this.userInfo = this.authService.getUserInfo();
        this.systemDate = this.userInfo.applicationDate;
        this.username = this.userInfo.userName;
        this.referredId = ApprovalStatusEnum.Referred;
    }

    loadData() {
        this.getAvailedMultipleApplicationsForBooking();
        this.BackToLoanBookingGridList();
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response) => {
            this.approvalStatusData = response.result;
            this.approvalStatusData = this.approvalStatusData.filter(x => x.approvalStatusId == 2);
        });
    }

    printMemo(): void {
        let printTitle = 'DRAWDOWN MEMO';
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
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

    getDrawdownMemoHtml(targetId) {
        this.camService.getDrawdownMemoHtml(targetId).subscribe((response) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
        }, (err) => {

        });
    }

    getGroupCustomers(groupId: number) {
        this.loanBookingService.getGroupCustomersByGroupId(groupId).subscribe((data) => {
            this.groupMembers = data.result;
        }, err => { });
    }

    getForiegnLoanNarrations(loanId: number) {
        this.loanBookingService.getForiegnLoanNarations(loanId).subscribe((data) => {
            this.bookedFacilityData.loanBeneficiary = data.result;
            this.getBeneficiaries();
        }, err => { });
    }

    getLoanMonitoringTriggers(loanId: number, loanSystemTypeId: number) {
        this.loanBookingService.getLoanMonitoringTriggers(loanId, loanSystemTypeId).subscribe((data) => {
            this.bookedFacilityData.monitoringTriggers = data.result;
        }, err => { });
    }

    getLoanCollaterals(loanId: number, loanSystemTypeId: number) {
        this.loanBookingService.getLoanMonitoringTriggers(loanId, loanSystemTypeId).subscribe((data) => {
            this.bookedFacilityData.loanCollateral = data.result;
        }, err => { });
    }

    getSchedule(event: any) {
        if (event) {
            this.scheduleCollection.pop();
            this.scheduleCollection.push(event);
            this.finishGood('Schedule generated successfully');

        } else this.finishBad('Opps! The schedule generation failed.');
    }


    rateCodeName: any;
    getRateCode() {
        this.exchangeRateService.getRateCode().subscribe((response) => {
            this.rateCodes = response.result;
            if (this.loanSelection.bookedFacilityData != undefined && this.loanSelection.bookedFacilityData.nostroRateCodeId != null) {
                var x = this.rateCodes.filter(x => x.lookupId == this.loanSelection.bookedFacilityData.nostroRateCodeId)[0];
                this.rateCodeName = x ? x.lookupName : 'n/a';
            }
        }, (err) => {
        });
    }

    getAllCurrencies() {
        this.exchangeRateService.getAllCurrencies().subscribe((response) => {
            this.currencies = response.result;
        });
    }

    getAccountBalance() {
        var account = this.loanSelection.customerAccounts.filter(x => x.casaAccountId == this.loanBookingForm.value.casaAccountId);
        this.loanBookingService.getCustomerAccountBalanceByCasaAccountId(account[0].casaAccountId).subscribe((data) => {
            if (data.result != undefined) {
                this.selectedAccountBalance = data.result.availableBalance;
            }
            if (!data.success) {
                swal('Fintrak Credit 360', data.message, 'error');
            }
        }, err => { });
    }

    getNostroCurrencyValue(): any {
        var nostroId = '';
        var selectedNostro = this.nostroAccount.filter(x => x.customAccountId == nostroId)
        this.nostroCurrencyCode = selectedNostro[0].currencyCode;

        var insterestCapId = this.loanBookingForm.value.casaAccountId;
        var selectedInterestCap = this.customerAccounts.filter(x => x.casaAccountId == insterestCapId)
        this.interestCapCurrencyCode = selectedInterestCap[0].currencyCode;

        this.loanBookingService.getExchangeRate(selectedInterestCap[0].currencyCode, selectedNostro[0].currencyCode, 'TTB').subscribe((data) => {
            this.newExchangeRate = data.result;
        }, err => { });

        return this.newExchangeRate
    }

    nostroRateCodeId: number;
    getExchangeRate(): any {
        this.nostroRateCodeId = this.loanBookingForm.value.nostroRateCodeId;

        this.sellingRate = null;
        var nostroId = this.loanBookingForm.value.casaAccountId2;
        var selectedNostro = this.nostroAccount.filter(x => x.customAccountId == nostroId);
        this.destinationCurrencyCode = selectedNostro[0].currencyCode;
        this.nostroCurrencyCode = selectedNostro[0].currencyCode;
        var insterestCapId = this.loanBookingForm.value.casaAccountId;
        var selectedInterestCap = this.customerAccounts.filter(x => x.casaAccountId == insterestCapId);

        this.interestCapCurrencyCode = selectedInterestCap[0].currencyCode;
        var nostroRateCodeId = this.loanBookingForm.value.nostroRateCodeId;
        var selectednostroRateCode = this.rateCodes.filter(x => x.lookupId == nostroRateCodeId)

        if (this.nostroCurrencyCode == this.interestCapCurrencyCode) {
            this.sellingRate = 1.00;
            this.destinationCurrencyAmount = Number(this.loanSelection.bookingAmountRequested.toFixed(2));
            return;
        }

        this.loadingSrv.show();
        this.loanBookingService.getExchangeRate(selectedInterestCap[0].currencyCode, selectedNostro[0].currencyCode, selectednostroRateCode[0].lookupName).subscribe((data) => {
            this.newExchangeRate = data.result;
            this.sellingRate = this.newExchangeRate.sellingRate;
            var b = Number(this.loanSelection.bookingAmountRequested) * Number(this.sellingRate)
            this.destinationCurrencyAmount = Number(b.toFixed(2));
            this.loadingSrv.hide();
        }, err => { });

        return this.newExchangeRate
    }

    getLoanCustomerAccounts(loanApplicationDetailId: number, customerId: number) {
        this.casaSrv.getAllCustomerAccountByCustomerId(customerId).subscribe((data) => {
            this.customerAccounts = data.result;
            this.loanSelection.customerAccounts = data.result;
            this.interestCapAccount = this.customerAccounts.filter(x => x.productAccountName.includes('Interest CAP') || x.productAccountName == 'FX Revolving Interest CAP Account');
            this.writeCustomerCasaAccount();

        }, err => { });
    }

    writeCustomerCasaAccount() {
        if (this.loanSelection.customerAccounts != null || this.loanSelection.customerAccounts != undefined) {
            var account = this.loanSelection.customerAccounts ? this.loanSelection.customerAccounts.filter(x => x.casaAccountId == this.bookedFacilityData.casaAccountId) : null;
            this.bookedFacilityData.casaAccountNumber = account ? account[0].productAccountNumber : '';

            var account2 = this.loanSelection.customerAccounts ? this.loanSelection.customerAccounts.filter(x => x.casaAccountId == this.bookedFacilityData.casaAccountId2) : null;
            var account2 = this.loanSelection.customerAccounts ? this.loanSelection.customerAccounts.filter(x => x.casaAccountId == this.bookedFacilityData.casaAccountId2) : null;
            account2[0] ? this.bookedFacilityData.casaAccountNumber2 = account2[0].productAccountNumber : '';
        }
    }

    getAllCompanyChartOfAccounts() {
        this.casaSrv.getAllCompanyChartOfAccounts().subscribe((data) => {
            var nostroAccounts = data.result;
            var x = nostroAccounts
                .filter(x => x.accountId == this.loanSelection.bookedFacilityData.nostroAccountId)[0];
            this.nostroAccount = x ? x.detail : 'n/a';
        }, err => { });
    }

    getLoanMonitoringTriggerByID(loanApplicationDetailId: number) {
        this.loanBookingService.getLoanMonitoringTriggerByID(loanApplicationDetailId).subscribe((data) => {
            this.loanSelection.loanMonitoringTrigger = data.result;
        }, err => { });
    }

    getCustomerCompanyInformation(customerId: number) {
        this.loanBookingService.getLoanCustomerCompanyInformation(customerId).subscribe((data) => {
            this.loanSelection.companyInformation = data.result;
        }, err => { });
    }

    getLoanRepricingModes() {
        this.loanBookingService.getLoanRepricingMode().subscribe((data) => {
            this.repricingMode = data.result;
        }, err => { });
    }

    getLoanInterestRateAmount(principal, interestRate, startDate, endDate, productId) {
        var body = {
            principalAmount: principal,
            interestRate: interestRate,
            effectiveDate: startDate,
            maturityDate: endDate,
            productId: productId,
            scheduleDayCountConventionId: DayCountConventionEnum.Actual_Actual
        }
        this.loanBookingService.getLoanInterestRateAmount(body).subscribe((data) => {
            this.interestRateAmount = data.result;
            this.isDicounted = data.isDicounted;
        }, err => { });
    }

    getLoanTransactionDynamics(loanApplicationDetailId) {
        this.loanBookingService.getLoanTransactionDynamics(loanApplicationDetailId).subscribe((response) => {
            this.loanSelection.loanTransationDynamics = response.result;
            this.loadingSrv.hide();
        });
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanBookingService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, err => { });
    }

    getLoanProductFees(loanBookingRequestId: number) {
        this.valueBase = 'Rate(%)';
        this.loanBookingService.getLoanProductFees(loanBookingRequestId).subscribe((data) => {
            this.loanProductFees = data.result;
            // console.log("first call: ", this.loanProductFees);
            this.totalFeeAmount(this.loanProductFees);

            if (this.loanProductFees != null || this.loanProductFees != undefined) {

                this.loanProductFees.forEach(feeItem => {
                    var chargeFees = {
                        chargeFeeId: feeItem.chargeFeeId,
                        chargeFeeName: feeItem.chargeFeeName,
                        feeRateValue: feeItem.recommededFeeRateValue,
                        feeDependentAmount: feeItem.feeDependentAmount,
                        feeAmount: feeItem.feeAmount,
                        feeIntervalName: feeItem.feeIntervalName,
                        isIntegralFee: feeItem.isIntegralFee,
                        isRequired: feeItem.required,
                        isPosted: false,
                        valueBase: 'Rate(%)',
                        dealTypeId: feeItem.dealTypeId,
                    }
                    this.chargeCollection.push(chargeFees);
                })
            }
        }, err => { });

    }

    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanApplId);
        this.displayShowCustInfo = false;
    }

    displayLoanCharges1: boolean = true;
    displayLoanCharges2: boolean;
    toggleLoanCharges() {
        if (this.displayLoanCharges1) {
            this.displayLoanCharges1 = false;
            this.displayLoanCharges2 = true;
        } else {
            this.displayLoanCharges1 = true;
            this.displayLoanCharges2 = false;
        }
    }

    totalFeeAmount(loanProductFees) {
        this.feeAmountTotal = 0;

        if (loanProductFees !== undefined) {
            loanProductFees.forEach(item => {
                this.feeAmountTotal = this.feeAmountTotal + item.feeAmount;
            });
        }
        //  console.log("this.feeAmountTotal: ", this.feeAmountTotal);
    }

    getSupportingDocuments(applicationNumber: any) {
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response) => {
            this.supportingDocuments = response.result;
            this.loadingSrv.hide();
        });
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


    searchString: any;
    searching: Boolean = false;
    getLoanApplications() {
        this.loadingSrv.show();
        this.loanBookingService.getBookedLoanApplicationsForVerificationAwaitingApprovalParam(this.searchString).subscribe((response) => {
            this.loanApplication = this.loans = response.result;
            this.loans.slice;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    getBaseCurrency() {
        this.exchangeRateService.getBaseCurrency().subscribe((response) => {
            this.baseCurrencyData = response.result;
            this.baseCurrencyId = this.baseCurrencyData.currencyId;
            this.baseCurrencyCode = this.baseCurrencyData.currencyCode;
        });
    }

    getCurrencyExchangeRate(currencyId): any {
        this.exchangeRateService.getCurrencyExchangeRate(currencyId).subscribe((response) => {
            this.exchangeRate = response.result;
            this.exchangeRate == 0 ? this.exchangeRate = 1 : null;
        });
    }

    getCustomerByCustomerId(id: number) {
        this.customerService.getCustomerByCustomerId(id)
    }

    assignRevolvingTypeId() {
        this.revolvingTypeId = this.loanBookingForm.value.revolvingTypeId;
    }

    onNostroAccountChange(id): void {
        this.beneficiaryList = [];
        let account = this.nostroAccount.filter(x => x.customAccountId == id);
        this.loanBookingForm.controls['accountToCredit'].setValue(account[0].detail);
    }

    validateTenor(x) {
        var value = Number(x);
        if (value == 0) {
            swal('Fintrak Credit 360', 'Zero tenor is not allowed', 'warning');
            this.loanBookingForm.controls['commercialTenor'].setValue(this.loanSelection.approvedTenor);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(this.loanSelection.approvedTenor));
            return;
        }
        if (value > this.loanSelection.approvedTenor) {
            swal('Fintrak Credit 360', 'tranche tenor cannot be greater than the line approved tenor.', 'warning');
            this.loanBookingForm.controls['commercialTenor'].setValue(this.loanSelection.approvedTenor);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(this.loanSelection.approvedTenor));
            return;
        }
        let commercialEffectiveDate = this.loanBookingForm.value.commercialEffectiveDate;
        let fxEffectiveDate = this.loanBookingForm.value.fxEffectiveDate;

        if (commercialEffectiveDate != null) {
            let date = this.loanBookingForm.value.commercialEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + value);
            this.loanBookingForm.controls['commercialMaturityDate'].setValue(new Date(maturityDate));
        }

        if (fxEffectiveDate != null) {
            let date = this.loanBookingForm.value.fxEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + value);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(maturityDate));
        }
    }

    calculateMaturityDate() {
        let revolvingEffectiveDate = this.loanBookingForm.value.revolvingEffectiveDate;
        let contigentEffectiveDate = this.loanBookingForm.value.contigentEffectiveDate;
        let fxEffectiveDate = this.loanBookingForm.value.fxEffectiveDate;
        let commercialEffectiveDate = this.loanBookingForm.value.commercialEffectiveDate

        var tenor = this.loanSelection.approvedTenor;

        if (revolvingEffectiveDate != null) {
            let date = this.loanBookingForm.value.revolvingEffectiveDate;
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['revolvingMaturityDate'].setValue(new Date(maturityDate));
        }
        if (contigentEffectiveDate != null) {
            let date = this.loanBookingForm.value.contigentEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['contingentMaturityDate'].setValue(new Date(maturityDate));
        }
        if (fxEffectiveDate != null) {
            let date = this.loanBookingForm.value.fxEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(maturityDate));
        }
        if (commercialEffectiveDate != null) {
            let date = this.loanBookingForm.value.commercialEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['commercialMaturityDate'].setValue(new Date(maturityDate));
        }
    }

    calculateIntegralFeeAmount() {
        this.chargeCollection.forEach(eachObj => {
            if (eachObj.isRequired) {
                this.integralFeeAmount = this.integralFeeAmount + eachObj.feeAmount;
            }
        });
    }

    getAvailedMultipleApplicationsForBooking() {
        this.loadingSrv.show();
        this.loanBookingService.getBookedLoanApplicationsForVerificationAwaitingApproval().subscribe((res) => {
            this.loanApplication = this.loans = res.result;
            if (this.loans != null) this.isLoanRowAboveLimit = this.loans.length > 10;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    linesToMaintain: any;
    getFacilityLineForApproval() {
        this.loadingSrv.show();
        this.loanBookingService.getFacilityLinesAwaitingApproval().subscribe((res) => {
            this.linesToMaintain = res.result;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide();
        });
    }

    onSelectedLoanChange(event) {
        this.applicationReferenceNumber = event.applicationReferenceNumber;
        this.loadCustomerApplicationDetails(event);

    }

    loadCustomerApplicationDetails(data) {
        if (data === null || data === undefined) {
            this.finishBad('Application failed to load customer loan details');
            return;
        }

        this.loanSelection = data.data;
        this.selectedLoan = this.loanSelection;
        this.getLoanCustomerAccounts(this.loanSelection.loanApplicationDetailId, this.loanSelection.customerId);
        if (this.loanSelection.productTypeId == ProductTypeEnum.Revolving) {
            this.bookedFacilityData = this.loanSelection.bookedRevolvingFacilityData;
            this.loanBookingForm.controls['revolvingInterestRate'].setValue(this.bookedFacilityData.interestRate);
            this.loanBookingForm.controls['revolvingOverdraftLimit'].setValue(this.bookedFacilityData.overdraftLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })); //
            this.loanBookingForm.controls['revolvingEffectiveDate'].setValue(new Date(this.bookedFacilityData.effectiveDate));
            this.loanBookingForm.controls['revolvingMaturityDate'].setValue(new Date(this.bookedFacilityData.maturityDate));
            this.loanBookingForm.controls['accrualBasis'].setValue(this.bookedFacilityData.scheduleDayCountConventionId);
        }
        else if (this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility
            || ProductTypeEnum.SyndicatedLoan || ProductTypeEnum.TermLoan || ProductTypeEnum.CommercialLoans) {

            this.bookedFacilityData = this.loanSelection.bookedLoanData;
            if (this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility) {
                this.getAllCompanyChartOfAccounts();
            }
            this.getCurrencyExchangeRate(this.loanSelection.currencyId);
            this.getLoanCurrenyPriceIndex(this.loanSelection.currencyId);
        }
        else { return; }

        this.loanSelection.casaBalance = 0;
        this.loanSelection.customerAccounts = null
        const revolvingTypeId = this.loanBookingForm.controls['revolvingTypeId'];
        const comment = this.loanBookingForm.controls['comment'];

        this.getForiegnLoanNarrations(this.bookedFacilityData.loanId);
        this.getLoanMonitoringTriggers(this.bookedFacilityData.loanId, this.bookedFacilityData.loanSystemTypeId)
        this.getLoanCollaterals(this.bookedFacilityData.loanId, this.bookedFacilityData.loanSystemTypeId)

        this.loanBookingService.getApprovalTrailByOperation(this.bookedFacilityData.operationId, this.bookedFacilityData.loanBookingRequestId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });

        if (this.loanSelection.customerType != null && this.loanSelection.customerType.toLowerCase() === 'corporate') {
            this.secondaryInfocaption = 'Company Executives';
        } else {
            this.secondaryInfocaption = 'Other Information'
        }

        this.currencyId = this.loanSelection.currencyId;
        this.selectedLoanProductId = this.loanSelection.productId;
        this.selectedLoanApplicationId = this.loanSelection.loanApplicationId;

        this.OLApplicationReferenceNumber = this.loanSelection.applicationReferenceNumber;
        this.loanInterestRate = Number(this.loanSelection.interestRate);
        this.loanAmount = Number(this.loanSelection.principalAmount);
        this.loanApplId = this.loanSelection.loanApplicationId;
        this.loanApplicationDetailId = this.loanSelection.loanApplicationDetailId;
        this.operationsId = this.loanSelection.operationsId;
        this.loanDate = this.loanSelection.newApplicationDate;
        this.scheduleTitle = this.loanSelection.isBidbond ? 'Bond Contract' : (!this.loanSelection.isBidbond && this.loanSelection.isOverdraft) ? 'Overdraft Grant' : 'Schedule';

        if (!this.loanSelection.customerGroupId === null || this.loanSelection.customerGroupId != 0) {
            this.isGroup = true;
        }

        if (this.loanSelection.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY) {
            this.isIDF = true;
        }


        this.getLoanApplicationCovenant(this.loanSelection.loanApplicationDetailId);
        this.getTrailForReferBack();
        this.onOperationChange(this.loanSelection.operationId);

        this.loanApplServ.getFinalOfferLetterByLoanAppId(this.loanSelection.applicationReferenceNumber)
            .subscribe((response) => {
                let tempSrc = response.result;
                this.form3800bSrc = tempSrc;
            }, (err) => {
            });

        this.updateWorkflowTarget();
        this.getDayCount();

        this.getLoanTransactionDynamics(this.loanSelection.loanApplicationDetailId);
        this.getLoanMonitoringTriggerByID(this.loanSelection.loanApplicationDetailId);
        this.getLoanApplicationCollateral(this.loanSelection.loanApplicationId);
        this.getSupportingDocuments(this.loanSelection.applicationReferenceNumber);
        this.getLoanRepricingModes();
        this.getTranchAmount();
        this.getDrawdownMemoHtml(this.loanSelection.loanBookingRequestId);
        this.getLoanProductFees(this.loanSelection.loanBookingRequestId);

        if (this.loanSelection.loanMonitoringTrigger != null && this.loanSelection.loanMonitoringTrigger != undefined) {
            this.loanSelection.loanMonitoringTrigger.forEach(triggerItem => {
                this.monitoringTriggerCollection.push(triggerItem);
            });
        }

        this.displayGoBack = true;
        this.selectedLoanCustomerId = this.loanSelection.customerId;
        this.applicantName = this.loanSelection.applicantName;
        this.customerCode = this.loanSelection.customerCode;
        this.displayLoanList = false;
        this.displayBookedLoans = true;

        const commercialInterestProductId = this.loanBookingForm.controls['commercialInterestProductId'];
        const fxTenor = this.loanBookingForm.controls['fxTenor'];
        this.updateLoanInformationControls();
        if (this.loanSelection.productTypeId === ProductTypeEnum.Revolving) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = true;
            this.isScheduledLoan = false;
            this.isCommercialLoan = false;
            this.isForeignExchangeLoan = false;
            this.loanProductTypeTitle = 'revolving';
            this.scheduleTitle = 'Revolving Loan Summary';

            this.getTemporaryOverdraftRevolvingTypes();

            if (this.loanSelection.isTemporaryOverdraft) {
                revolvingTypeId.setValidators(Validators.required);
            }
        }
        else if (this.loanSelection.productTypeId === ProductTypeEnum.CommercialLoans) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isCommercialLoan = true;
            this.isScheduledLoan = false;
            this.loanProductTypeTitle = 'commercial';
            this.scheduleTitle = 'Commercial Loan Summary';
            this.getCommercialLoans();
            commercialInterestProductId.setValidators(Validators.required);
            comment.setValidators(Validators.required);
        }
        else if (this.loanSelection.productTypeId === ProductTypeEnum.ForeignExchangeRevolvingFacility) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isCommercialLoan = false;
            this.isScheduledLoan = false;
            this.isForeignExchangeLoan = true;
            this.loanProductTypeTitle = 'FX-Loan';
            this.scheduleTitle = 'Foreign Exchange Loan Summary';
            this.getRateCode();
            this.getBeneficiaries();
            fxTenor.setValidators(Validators.required);

        } else if (this.loanSelection.productTypeId === ProductTypeEnum.ContingentLiability) {
            this.isContingentLoan = true;
            this.isRevolvingLoan = false;
            this.isCommercialLoan = false;
            this.isScheduledLoan = false;
            this.loanProductTypeTitle = 'contingent';
            this.scheduleTitle = 'Contingent Loan Summary';

        } else if (this.loanSelection.productTypeId == ProductTypeEnum.TermLoan
            || this.loanSelection.productTypeId == ProductTypeEnum.SelfLiquidating
            || this.loanSelection.productTypeId == ProductTypeEnum.SyndicatedLoan) {
            this.isContingentLoan = false;
            this.isRevolvingLoan = false;
            this.isCommercialLoan = false;
            this.isScheduledLoan = true;
            this.loanProductTypeTitle = 'scheduled';
            this.currencyId = this.loanSelection.currencyId;

            if (!this.loanSelection.isLocalCurrrency && !this.isIDF) {
                this.isForeignExchangeLoan = true;
                this.loanProductTypeTitle = 'FX-Loan';
                this.scheduleTitle = 'Foreign Exchange Loan Summary';
                this.getRateCode();
                this.getBeneficiaries();
                fxTenor.setValidators(Validators.required);
            }
            this.updateLoanInformationControls();
        }

        // Fetch UUS checklist for the selected loan's reference number
        if (this.loanSelection.applicationReferenceNumber) {
            this.fetchCustomerUusItems(this.loanSelection.applicationReferenceNumber);
        }

        this.fetchChecklistSummaryForLoan(this.loanSelection.applicationReferenceNumber);
    }


    // =========================== Fetch Obligor's Items ===============================

    getRowStyle(rowData: any): any {
        if (rowData.option === 'Yes') {
            return { 'background-color': '#28a745', 'color': '#fff' }; // Deep green
        } else if (rowData.option === 'No') {
            return { 'background-color': '#dc3545', 'color': '#fff' }; // Deep red
        } else {
            return {};
        }
    }

    fetchCustomerUusItems(nhfNumber: string): void {
        console.error('nhf number:', nhfNumber);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
            response => {
                this.uwsList = (response.result || []).map(uws => ({
                    ...uws,
                    option: this.mapOptionToEnum(uws.finalOption),
                    deferredDate: uws.deferDate ? new Date(uws.deferDate).toISOString().split('T')[0] : null
                }));
                console.log('Processed UUS List:', this.uwsList);
                //this.cdr.detectChanges();
            },
            error => {
                console.error('Error fetching UWS list:', error);
                this.uwsList = [];
                this.loadingService.hide();
            },
            () => this.loadingService.hide()
        );
    }

    mapOptionToEnum(option: number): string {
        const mapping: { [key: number]: string } = {
            1: 'Yes',
            2: 'No',
            3: 'Waiver',
            4: 'Deferred'
        };
        return mapping[option] || 'No';
    }

    viewDocuments(uws: any): void {
        console.log('Selected UWS:', uws);
        if (!uws.employeeNhfNumber) {
            swal('Error', 'No Employee NHF Number found!', 'error');
            return;
        }
        if (!uws.itemId) {
            swal('Error', 'No Item Found!', 'error');
            return;
        }
        console.log('Fetching document for:', uws.employeeNhfNumber, uws.checklistId);
        this.fetchAndPreviewDocument(uws.employeeNhfNumber, uws.checklistId);
    }

    private fetchAndPreviewDocument(employeeNumber: string, itemId: number): void {
        console.log('Calling API with:', employeeNumber, itemId);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItemDoc(employeeNumber, itemId).subscribe({
            next: (response) => {
                console.log('API Response:', response);
                if (!response.success || !response.result) {
                    console.error('Invalid document data received');
                    swal('Error', 'Invalid document data received.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const base64Data = response.result.split(',')[1];
                const fileTypeMatch = response.result.match(/data:(.*?);base64/);
                if (!base64Data || !fileTypeMatch) {
                    console.error('Invalid Base64 format');
                    swal('Error', 'Invalid document format.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const fileType = fileTypeMatch[1];
                console.log('Detected file type:', fileType);
                const blob = this.base64ToBlob(base64Data, fileType);
                const url = URL.createObjectURL(blob);
                console.log('Generated Blob URL:', url);
                if (fileType.includes('image') || fileType === 'application/pdf' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.w ordprocessingml.document' ||
                    fileType === 'application/msword') {
                    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    this.fileType = fileType;
                    this.isPreviewModalVisible = true;
                } else {
                    swal('Error', 'Unsupported file type.', 'error');
                }
                this.loadingService.hide();
            },
            error: (error) => {
                console.error('Error fetching document:', error);
                swal('Error', 'Error fetching document.', 'error');
                this.loadingService.hide();
            }
        });
    }

    private base64ToBlob(base64: string, contentType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, { type: contentType });
    }

    getModalStyle() {
        if (this.fileType === 'application/pdf' || this.fileType === 'application/msword' ||
            this.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return { width: '70%', height: '75vh' };
        } else {
            return { width: '55%', height: '70vh' };
        }
    }

    zoomIn() {
        this.zoomLevel += 0.2;
    }

    zoomOut() {
        if (this.zoomLevel > 0.5) this.zoomLevel -= 0.2;
    }

    onScrollZoom(event: WheelEvent) {
        event.preventDefault();
        const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
        this.zoomLevel = Math.max(0.5, this.zoomLevel + zoomFactor);
    }

    startDrag(event: MouseEvent) {
        event.preventDefault();
        this.dragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    onDrag = (event: MouseEvent) => {
        if (!this.dragging) return;
        const dragSpeed = 2;
        const deltaX = (event.clientX - this.startX) * dragSpeed;
        const deltaY = (event.clientY - this.startY) * dragSpeed;
        const imageElement = document.querySelector('img') as HTMLElement;
        if (imageElement) {
            imageElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${this.zoomLevel})`;
        }
    };

    toggleZoom() {
        if (this.zoomLevel >= this.maxZoom) {
            this.zoomLevel = this.minZoom;
        } else {
            this.zoomLevel += 0.5;
        }
    }

    stopDrag = () => {
        this.dragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    };

    closePreviewModal() {
        this.isPreviewModalVisible = false;
        this.selectedDocumentUrl = null;
        this.zoomLevel = 1;
    }
    // =========================== END ==============================================

    // ============================ Checklist Dashboard ===============================

    fetchChecklistSummaryForLoan(nhfNumber: string): void {
        if (!nhfNumber) {
            return;
        }

        this.isLoadingChecklistSummary = true;
        this.checklistSummary = {
            total: 0,
            yes: 0,
            no: 0,
            waived: 0,
            deferred: 0,
            yesPercent: 0,
            noPercent: 0,
            waivedPercent: 0,
            deferredPercent: 0
        };

        this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
            response => {
                if (response && response.success && Array.isArray(response.result)) {
                    this.calculateChecklistSummary(response.result);
                }
                this.isLoadingChecklistSummary = false;
            },
            error => {
                console.error(`Error fetching checklist for ${nhfNumber}:`, error);
                this.isLoadingChecklistSummary = false;
            }
        );
    }

    calculateChecklistSummary(checklistItems: any[]): void {
        const total = checklistItems.length;

        if (total === 0) {
            this.checklistSummary = {
                total: 0,
                yes: 0,
                no: 0,
                waived: 0,
                deferred: 0,
                yesPercent: 0,
                noPercent: 0,
                waivedPercent: 0,
                deferredPercent: 0
            };
            return;
        }

        // Count items by option
        const yes = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 1 || option === 'Yes' || option === '1';
        }).length;

        const no = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 2 || option === 'No' || option === '2';
        }).length;

        const waived = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 3 || option === 'Waiver' || option === 'Waived' || option === '3';
        }).length;

        const deferred = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 4 || option === 'Deferred' || option === 'Defer' || option === '4';
        }).length;

        this.checklistSummary = {
            total,
            yes,
            no,
            waived,
            deferred,
            yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
            noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
            waivedPercent: total > 0 ? Math.round((waived / total) * 100) : 0,
            deferredPercent: total > 0 ? Math.round((deferred / total) * 100) : 0
        };
    }
    //============================ END CHECKLIST STATISTICS ===============================================



    getBeneficiaries() {
        var x = this.bookedFacilityData.loanBeneficiary; //console.debug('x',x);
        this.benficiaries = x ? x.loanBeneficiary : null;
        if (this.bookedFacilityData.loanBeneficiary != null) {
            this.bookedFacilityData.loanBeneficiary.forEach(item => {
                var c = new FXLoanBeneficiaryModel(
                    this.beneficiaryCurrencyId,
                    this.beneficiaryCurrencyCode,
                    item.amountDisbursed,
                    item.beneficiaryReason,
                    this.beneficiaryRateCode,
                    this.beneficiaryRateCodeId,
                    this.beneficiaryRateAmount,
                    0,
                );
                this.totalAddedBeneficiaryAmount = Number(this.totalAddedBeneficiaryAmount) + Number(item.amountDisbursed);
                if (Number(this.totalAddedBeneficiaryAmount) <= Number(this.destinationCurrencyAmount)) {
                    this.beneficiaryList.push(c);
                }
            });
        }
    }

    print(content): void {
        const printObj: PrintModel = {
            htmlDocument: content,
            htmlStyles: `
            .removeConditions_OL {
                display: none;
            }`
        }
        this._printService.printDocument(printObj);
    }

    ValidateAvailableAmount(data) {
        if (data.customerAvailableAmount <= 0) {
            this.finishBad('Available amount is zero. Loan may have been booked and currently undergoing approval');
            this.BackToLoanBookingGridList();
            return;
        }
    }

    ValidateZerodTenor(data) {
        if (data.approvedTenor <= 0) {
            this.finishBad('Could not proceed because loan tenor is zero');
            this.BackToLoanBookingGridList();
            return;
        }
    }

    getTemporaryOverdraftRevolvingTypes() {
        this.productService.getTemporaryOverdraftRevolvingTypes().subscribe((response) => {
            this.revolvingTypes = response.result;
            this.loadingSrv.hide();
        });
    }

    reMapProduct($event) {
        var x = $event.target.value;
        if (x != null && x != 0) {
            this.loanSelection.productId = x;
        }
        if (this.loanBookingForm.value.commercialEffectiveDate > this.loanBookingForm.value.commercialMaturityDate) {
            this.loanBookingForm.controls['commercialInterestProductId'].setValue('');
            swal('Fintrak Credit 360', 'Maturity cannot be less than effective date', 'warning');
            return;
        }
        this.getLoanInterestRateAmount(this.loanAmount, this.loanSelection.interestRate, new Date(this.loanBookingForm.value.commercialEffectiveDate), new Date(this.loanBookingForm.value.commercialMaturityDate), this.loanSelection.productId);
    }

    getTranchAmount(): void {
        var disAmoount = this.loanSelection.bookingAmountRequested;
        this.tranchAmount = Number(disAmoount.toString().replace(/[,]+/g, "").trim());
    }

    onProductPriceIndexChange(target) {
        if (Number(target.value) <= 0 || target.value == null || target.value == '') {
            this.getLoanInterestRateAmount(this.loanAmount, this.loanSelection.approvedInterestRate, new Date(this.loanBookingForm.value.commercialEffectiveDate), new Date(this.loanBookingForm.value.commercialMaturityDate), this.loanSelection.productId);
            if (this.isCommercialLoan) {
                this.loanBookingForm.controls['commercialInterestRate'].setValue(this.loanSelection.approvedInterestRate);
            }
            if (this.isForeignExchangeLoan) {
                this.loanBookingForm.controls['fxInterestRate'].setValue(this.loanSelection.approvedInterestRate);
            }
            return;
        }

        var priceIndex = this.productCurrencyPriceIndex.filter(x => x.productPriceIndexId == target.value)[0];
        if (priceIndex != null || priceIndex != undefined) {
            var interestRate = this.loanSelection.approvedInterestRate + priceIndex.priceIndexRate;
            this.getLoanInterestRateAmount(this.loanAmount, interestRate, new Date(this.loanBookingForm.value.commercialEffectiveDate), new Date(this.loanBookingForm.value.commercialMaturityDate), this.loanSelection.productId);
            if (this.isCommercialLoan) {
                this.loanBookingForm.controls['commercialInterestRate'].setValue(interestRate);
            }
            if (this.isForeignExchangeLoan) {
                this.loanBookingForm.controls['fxInterestRate'].setValue(interestRate);
            }
        }
    }

    getLoanCurrenyPriceIndex(currencyId) {
        this.productService.getProductPriceIndexByCurrencyId(currencyId).subscribe((data) => {
            if (data.success) {
                this.productCurrencyPriceIndex = data.result;
                var priceIndexId = Number(this.bookedFacilityData.productPriceIndexId);
                var priceIndex = this.productCurrencyPriceIndex.filter(x => x.productPriceIndexId === priceIndexId);
                if (this.bookedFacilityData.productPriceIndexId > 0) {
                    if (priceIndex != null) {
                        this.loanBookingForm.controls['priceIndexId'].setValue(this.bookedFacilityData.productPriceIndexId);
                    }
                }
            }
        }, err => { });
    }


    getDayCount() {
        this.loanBookingService.getLoanDayCount()
            .subscribe((res) => {
                this.basis = res.result;
                this.basisCommercial = this.basis.filter(x => x.lookupId == DayCountConventionEnum.Actual_Actual);
                if (this.loanSelection.productDayCountConventionId > 0) {
                    this.loanBookingForm.controls['accrualBasis'].setValue(this.bookedFacilityData.scheduleDayCountConventionId);
                }
            });
    }

    getCommercialLoans(): void {
        this.loadingSrv.show();
        this.loanBookingService.getCommercialLoans().subscribe((response) => {
            this.commercialLoans = response.result;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });

        if (this.commercialLoans != null) {
            var x = this.commercialLoans.filter(c => c.productName.toLowerCase() == 'commercial loan' || c.productName.toLowerCase() == 'commercial loans').productId;
            if (x != null) {
                this.loanBookingForm.controls['commercialInterestProductId'].setValue(x);
            }
        }
    }

    setEffectiveDate() {
        if (this.isRevolvingLoan) this.loanBookingForm.controls['revolvingEffectiveDate'].setValue(new Date(this.systemDate));
        if (this.isContingentLoan) this.loanBookingForm.controls['contigentEffectiveDate'].setValue(new Date(this.systemDate));
        if (this.isCommercialLoan) this.loanBookingForm.controls['commercialEffectiveDate'].setValue(new Date(this.systemDate));
        if (this.isForeignExchangeLoan) this.loanBookingForm.controls['fxEffectiveDate'].setValue(new Date(this.systemDate));
        this.calculateMaturityDate();
    }

    onSelectedCustomerChange(event) {
        this.customerSelection = event.data;
        this.selectedLoanCustomerId = this.customerSelection.customerId;
        this.customerCode = this.customerSelection.customerCode;
        this.applicantName = ' : ' + ' Customer - ' + this.loanSelection.customerGroupName + ' / (' + this.customerSelection.fullName + ')';
        this.customerName = this.customerSelection.fullName;

        this.displayBookedLoans = true;
        this.displayLoanList = false;
        this.isGroup = false;
    }

    pipe = new DatePipe('en-US');
    GetAppraisalMemorandumCollateralChanges(loanApplicationId): void {
        this.loanBookingService.GetAppraisalMemorandumPropertyCollateralInfo(loanApplicationId).subscribe((response) => {
            this.additionalPropertyCollateralValues = response.result;
        });
    }

    GetAppraisalMemorandumLoanDetailsUpdate(appraisalMemorandumId): void {
        this.loanBookingService.GetAppraisalMemorandumLoanDetailsUpdate(appraisalMemorandumId).subscribe((response) => {
            this.loanInfoUpdate = response.result;

            if (!this.loanInfoUpdate === null) {
                this.loanSelection.interestRate = this.loanInfoUpdate.interestRate;
                this.loanSelection.principalAmount = Number(this.loanInfoUpdate.principalAmount);
                this.loanSelection.tenor = this.loanInfoUpdate.tenor;
            }
        });
    }

    crmsRepaymentAgreementType: any;
    crmPaymentAgreementTypeName: any;
    getCRMSRepaymentType(): void {
        this.loanBookingService.getCRMSRepaymentAgreementType().subscribe((response) => {
            if (response.success) {
                this.crmsRepaymentAgreementType = response.result;
            }
        });
    }

    getLoanApplicationCovenant(applicationDetailId): void {
        this.loanBookingService.getLoanApplicationDetailCovenantById(applicationDetailId).subscribe((response) => {
            this.covenantDetails = response.result;
            if (this.covenantDetails != null) {
                this.covenantDetails.forEach(item => {
                    this.covenantCollection.push(item);
                });
            }
        });
    }

    showDialog() {
        this.initializeControls();
        this.display = true;
    }

    initializeControls() {
        this.loanBookingForm = this.fb.group({
            priceIndexId: [''],
            comment: ['', Validators.required],
            approvalStatusId: ['', Validators.required],
            tenorInMonths: [''],
            accrualBasis: [''],
            //...........REVOLVING LOAN CONTROLS..........//
            revolvingInterestRate: [''],
            revolvingEffectiveDate: [''],
            revolvingMaturityDate: [''],
            revolvingOverdraftLimit: [''],
            revolvingTypeId: [''],
            //.........END OF REVOLVING LOAN CONTROL.......//

            //...........CONTINGENT LOAN CONTROLS..........//
            contigentAmount: [''],
            contigentEffectiveDate: [''],
            contingentMaturityDate: [''],
            //.........END OF CONTINGENT LOAN CONTROLS.....//

            //...........COMMERCIAL LOAN CONTROLS..........//
            commercialInterestRate: [''],
            commercialEffectiveDate: [''],
            commercialMaturityDate: [''],
            commercialPrincipal: [''],
            commercialInterestProductId: [''],
            commercialTenor: [''],
            //.........END OF COMMERCIAL LOAN CONTROL.......//

            //...........FX LOAN CONTROLS..........//
            fxInterestRate: [''],
            fxEffectiveDate: [new Date, Validators.required],
            fxMaturityDate: [new Date, Validators.required],
            fxPrincipal: [''],
            nostroRateCodeId: [''],
            nostroRateAmount: [''],
            fxTenor: [''],
            //.........END OF FX LOAN CONTROLS.......//
        });

        this.operationForm = this.fb.group({
            operationId: [''],
            approvalLevelId: [''],
            comment: [''],
            approvalStatusId: [''],
        });
    }

    updateLoanInformationControls() {
        this.loanBookingForm.controls['tenorInMonths'].setValue(this.bookedFacilityData.approvedTenorString);
        this.loanBookingForm.controls['commercialPrincipal'].setValue(this.loanSelection.bookingAmountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['commercialInterestRate'].setValue(this.bookedFacilityData.interestRate.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['commercialTenor'].setValue(this.bookedFacilityData.tenor);
        this.loanBookingForm.controls['commercialInterestProductId'].setValue(this.loanSelection.productId);
        this.loanBookingForm.controls['commercialEffectiveDate'].setValue(new Date(this.bookedFacilityData.effectiveDate));
        this.loanBookingForm.controls['commercialMaturityDate'].setValue(new Date(this.bookedFacilityData.maturityDate));
        this.loanBookingForm.controls['fxPrincipal'].setValue(this.bookedFacilityData.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['fxInterestRate'].setValue(this.bookedFacilityData.interestRate.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['fxEffectiveDate'].setValue(new Date(this.bookedFacilityData.effectiveDate));
        this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(this.bookedFacilityData.maturityDate));
        this.loanBookingForm.controls['fxTenor'].setValue(this.bookedFacilityData.tenor);
    }

    formArray: any;
    promptToGoForNoPostingApproval(formObj, isManual: boolean = false) {
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'This will save transaction only. No entries will be passed to core-banking.',
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
            __this.formArray = formObj;
            __this.displayCoreBankingDialog = true;

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }


    promptToGoForApproval(formObj, isManual: boolean = false) {
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to perform this action',
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
            __this.loadingSrv.show();
            __this.authorizationService.enable2FAForLastApproval(__this.loanSelection.operationId, null, null, 0).subscribe((res) => {
                if (res.result == true) {
                    __this.formData = formObj;
                    __this.displayTwoFactorAuth = true;
                    __this.loadingSrv.hide();
                } else {
                    __this.goForApproval(formObj, isManual);
                    //__this.loadingService.hide();
                }
                // __this.loadingService.hide(1000);

            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                __this.loadingSrv.hide();
            });
            __this.loadingSrv.hide(30000);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    goForApproval(form, isManual = false) {
        let bodyObj = {
            targetId: this.bookedFacilityData.loanId,
            approvalStatusId: form.value.approvalStatusId,
            comment: form.value.comment,
            operationId: this.loanSelection.operationId,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode,
            coreBankingRef: this.coreBankingRef
        };

        this.valiadteCoreBankingRef(this.coreBankingRef);
        /*this.coreBankingResponseCode = this.valiadteCoreBankingRef(this.coreBankingRef);
        console.log("response code2 = " + this.coreBankingResponseCode);
        if(this.coreBankingResponseCode != "00"){
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Wrong Flexcube Reference Number, error code: ', this.coreBankingResponseCode);
                this.coreBankingRef = null;
                return null;  
        }*/

        this.loadingSrv.showKeyApiCall();
        this.creditApprovalService.approveLoan(bodyObj, this.loanSelection.loanBookingRequestId, isManual).subscribe((response) => {
            //this.loadingService.hide(1000);
            this.twoFactorAuthPassCode = null;
            this.twoFactorAuthStaffCode = null;
            this.displayTwoFactorAuth = false;
            this.coreBankingRef = null;
            this.displayCoreBankingDialog = false;

            if (response.success === true) {
                this.getAvailedMultipleApplicationsForBooking();
                this.BackToLoanBookingGridList();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

            }
            this.loadingSrv.hideKeyApiCall();
        }, (err) => {
            this.loadingSrv.hideKeyApiCall(1000);
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    maintainLine() {
        const __this = this;
        var collections = {
            approvedLineStatusId: 1,
            loanApplicationDetailId: __this.loanSelection.loanApplicationDetailId,
            loanBookingRequestId: __this.loanSelection.loanBookingRequestId,
            operationId: __this.loanSelection.operationId
        }

        swal({
            title: 'Are you sure?',
            text: 'You want to maintain this line facility?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingSrv.showKeyApiCall();
            __this.loanBookingService.maintainFacilityLine(collections)
                .subscribe((res) => {
                    if (res.success === true) {
                        __this.showMessage(res.message, 'success', 'FintrakBanking');
                        __this.BackToLoanBookingGridList();
                        __this.initializeControls();
                        __this.getAvailedMultipleApplicationsForBooking();
                        __this.displayTwoFactorAuth = false;
                    } else {
                        __this.showMessage(res.message, 'error', 'FintrakBanking');
                    }
                    __this.loadingSrv.hideKeyApiCall();
                }, (err) => {
                    __this.loadingSrv.hideKeyApiCall(1000);
                    __this.showMessage(err.message, 'error', 'FintrakBanking');
                });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }


    BackToLoanBookingGridList() {
        // Unloading/resetting data collections................
        this.visibleSubmit = 'hide';
        this.loanSelection = null;
        this.selectedAccountBalance = null;
        this.collateralCollection = [];
        this.chargeCollection = [];
        this.applicableCollaterals = [];
        this.monitoringTriggerCollection = [];
        this.covenantCollection = [];
        this.collateralCollection = [];
        this.initializeControls();

        // Hiding page forms...........................
        this.displayBookedLoans = false;
        this.displayLoanList = true;
        this.displayJobrequest = false;
        this.isCommercialLoan = false;
        this.feeOverride = false;
        this.finishedSchedule = false;
        this.isIDF = false;
        this.displayOperationRouteCommentForm = false;

        this.isForeignExchangeLoan = false;
        this.isContingentLoan = false;
        this.exchangeRate = null;
        this.sellingRate = null;
        this.totalAddedBeneficiaryAmount = 0;

        this.interestRateAmount = 0;
        this.isDicounted = false;
    }

    data: any = {};

    hideMessage(event) {
        this.show = false;
    }

    finishBad(message) {
        this.showMessage(message, 'error', 'FintrakBanking');
        this.loadingSrv.hide();
    }

    finishGood(message) {
        this.loadingSrv.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }

    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }

    popoverSeeMore() {
        if (this.OLApplicationReferenceNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            const data = {
                applicationRefNumber: this.OLApplicationReferenceNumber,
            }

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            this.displayReport = true;
            return;
        }
    }

    resetGrid(yes) {
        if (yes) {
            swal('Fintrak Credit 360', 'You have successfully routed to a modifier', 'success');
            this.getAvailedMultipleApplicationsForBooking();
            this.BackToLoanBookingGridList();
        }
        else swal('Fintrak Credit 360', 'Routing to modifier failed', 'error');
    }

    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.loanSelection.loanBookingRequestId;
        this.workflowTarget.operationId = this.loanSelection.operationId;
        this.enableReroute = true;
    }

    ReferToRM() { this.displayOperationRouteCommentForm = true; }
    CallRequestClose() { this.displayJobrequest = false; }

    onOperationChange(operationId) {
        this.loadingSrv.show();
        this.camService.getOperationApprovalLevels(operationId).subscribe((response) => {
            this.approvalLevels = response.result;
            this.loadingSrv.hide(1000);
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    trailApprovalLevels: any;
    getTrailForReferBack() {
        this.loadingSrv.show();
        this.camService.getTrailForReferBack(this.bookedFacilityData.loanBookingRequestId, this.bookedFacilityData.operationId, this.loanSelection.currentApprovalLevelId).subscribe((response) => {
            if (response.success) {
                this.trailApprovalLevels = response.result;
                this.loadingSrv.hide();
                this.trailApprovalLevels = this.trailApprovalLevels.filter(x => x.fromApprovalLevelId != 69 && x.fromApprovalLevelName != 'Booking - Initiation');
            }
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    getFilteredApprovalLevelArray() {
        // if(this.approvalLevels != undefined && this.trailApprovalLevels != undefined ) {
        //     var b  = this.approvalLevels.filter(function(approvalLev) {
        //             return this.trailApprovalLevels.filter(function(trailApprovalLev) {
        //                 return trailApprovalLev.fromApprovalLevelId == approvalLev.approvalLevelId;
        //             }); //.length == 0
        //         });
        //         console.debug('approvalLevels2',b);
        // }
    }

    returnBackToRM() {
        const __this = this;
        const target = {
            operationId: this.loanSelection.operationId,
            targetId: this.bookedFacilityData.loanBookingRequestId,
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
            __this.loadingSrv.show();

            __this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
                __this.loadingSrv.hide();
                if (res.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    __this.loadData();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingSrv.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    form3800b(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = { applicationRefNumber: applicationReferenceNumber, }

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response) => {
                path = response.result;
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            return;
        }
    }

    // benjamin
    collapseSearchForm(flag: boolean) {
        this.collapseForm = flag;
        if (flag == true) {
            this.displayLoanList = true;
            this.headerText = 'Disbursement List';
        }
        else {
            this.headerText = 'Disbursement Bulk Upload';
            this.displayLoanList = false;
        }
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    requestPasswordBulk() {
        if (this.adActive) {
            this.buttonText = "Uploads Bulk Disbursement";
            this.displayADAuth = true;
            this.bulkUPload = true;
        }
        else {
            this.adAuthPassCode = "";
            this.uploadBulkCustomerLoanFileForDisbursment();
        }

    }

    uploadBulkCustomerLoanFileForDisbursment() {
        this.loadingSrv.show();
        if (this.file != undefined || this.file != null) {
            let adAuthPassCode = btoa(this.adAuthPassCode);

            let body = {
                loanReferenceNumber: '',
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                loginStaffPassCode: adAuthPassCode,
                isFinal: this.isFinal,
            };

            this.creditApprovalService.uploadBulkCustomerLoanFileForDisbursment(this.file, body).then((res: any) => {
                if (res.success == true) {
                    this.collapseForm = false;
                    this.loadingSrv.hide();
                    this.uploadedData = res.result;

                    // if(this.isFinal == false) {
                    // }

                    // if(this.isFinal == true){
                    //     if (res.result != undefined || res.result != null) {
                    //         res.result.commitedRows == undefined ? this.uploadedData = []
                    //             : this.uploadedData = res.result.commitedRows;

                    //         res.result.discardedRows == undefined ? this.failedUpload = []
                    //             : this.failedUpload = res.result.discardedRows;

                    //         this.loadingSrv.hide();
                    //         if (res.result.commitedRows.length <= 0 && res.result.discardedRows.length > 0) {
                    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Bulk Disbursement upload failed' + '\n' + 'See log for more info', 'warning');
                    //         }
                    //         else if ((res.result.commitedRows.length > 0) && (res.result.discardedRows.length > 0)) {
                    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Upload was successful but some records failed to upload', 'info');
                    //         }
                    //         else {
                    //             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
                    //         }
                    //     }
                    // }

                    //this.isFinal = true;
                }
                else {
                    swal('Fintrak Credit360', res.message, 'error');

                    this.loadingSrv.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (error) => {
                this.loadingSrv.hide();
                swal('Bulk Disbursement Upload', JSON.stringify(error) ? JSON.stringify(error) : 'uploading multiple bulk disbursement generated error', 'error')
            });
        } {

        }
        this.displayADAuth = false;
    }



    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    disburseChanged() {
        /*this.loadingSrv.show(); 
          this.disburseSelection.forEach(item => {
              item.shouldDisburse = true;
          });
  
          this.creditApprovalService.diburseMultipleLoanRequests(this.disburseSelection).subscribe((response) => {
              if (response.success === true) {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                  this.loadingSrv.hide(1000);
              } else {
                  this.loadingSrv.hide();
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
              }
          }, (err) => {
              this.loadingSrv.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
          }); */
    }


    getSchedules(data) {
        if (data.length > 0) {
            var details = {
                principalAmount: data.principalAmount,
                interestRate: new Date, //body.interestRate,
                effectiveDate: new Date, //body.effectiveDate,
                maturityDate: '',
                effectiveInterestRate: 0,
                schedules: data.periodicSchedule
            }

            this.schedules = details.schedules;
            this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
            details.maturityDate = this.maturityDate;
            details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
            this.scheduleHeader = details;
            this.displayScheduleModalForm = true;
        }
    }

    //coreBankingResponseCode: any;
    valiadteCoreBankingRef(coreBankingRef) {
        let bodyObj = {
            loan_accountno: coreBankingRef
        };

        this.loadingSrv.show();
        this.creditApprovalService.validateCoreBankingRef(bodyObj).subscribe((response) => {
            this.loadingSrv.hide(1000);
            if (response.success == true) {
                console.log("core banking validation details: " + JSON.stringify(response.result));
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Flexcune Reference Number exist kindly proceed', 'success');
            }
        }, (err) => {
            this.loadingSrv.hideKeyApiCall(1000);
            console.log("core banking validation error:: " + JSON.stringify(err));
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });

    }


    /*valiadteCoreBankingRef(coreBankingRef): string {
        let bodyObj = {
            loan_accountno: coreBankingRef
        };
        
        let resp = "";
        this.loadingSrv.show();
        this.creditApprovalService.validateCoreBankingRef(bodyObj).subscribe((response) => {
            this.loadingSrv.hide();
            if(response.success == true){
                let data = response.result;
                resp = response.result.response_code;
                console.log("response code = " + resp);
            }else{
                resp = response.message;
                console.log("response code = " + resp);  
            }
            
        }, (err) => {
            this.loadingSrv.hide();
            resp = JSON.stringify(err);
        });
        return resp;
    }*/


}