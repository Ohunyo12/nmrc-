import { LoadingService } from '../../../shared/services/loading.service';
import { LoanService } from '../../services/loan.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../customer/services/customer.service';
import { CasaService } from '../../../customer/services/casa.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { ExchangeRateService } from '../../../admin/services/exchange-rate.service';
import { Subject } from 'rxjs';
import { LoanSchedule } from '../../models/schedule';
import { LoanModel, FXLoanBeneficiaryModel } from '../../models/loan-booking';
import { contingentLoanInputModel } from '../../models/loan-booking';
import { revolvingLoanInputModel } from '../../models/loan-booking';
import { monitoringTriggersModel } from '../../models/loan-booking';
import { ChargeFeeAppModel } from '../../models/loan-charge-fee';
import { LoanCovenantModel } from '../../models/loan-covenant';
import { LoanCollateralModel } from '../../models/loan-collateral';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { ConvertString, ProductClassEnum, ProductTypeEnum, ApprovalStatusEnum, DayCountConventionEnum, GlobalConfig, JobSourceEnum } from '../../../shared/constant/app.constant';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { CustomerInformationDetailComponent } from '../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { CollateralInformationViewComponent } from '../../collateral';
import { JobRequestViewComponent } from '../../job-request';
import { AuthenticationService } from '../../../admin/services';
import { ProductService } from '../../../setup/services';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { PrintModel } from 'app/shared/models/print-model';
import { PrintService } from 'app/shared/services/print.service';
import { ReportService } from 'app/reports/service/report.service';
import { DomSanitizer, SafeResourceUrl } from '../../../../../node_modules/@angular/platform-browser';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'loan-booking',
    templateUrl: 'loan-booking.component.html',
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

export class LoanBookingComponent implements OnInit {
    productCurrencyPriceIndex: any;
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    reload: number = 0;
    showCollateralInformation: boolean = false;
    customerAccounts: any;
    revolvingTypeId: number = 0;
    revolvingTypes: any;
    requireCasaAccount: boolean = false;
    tabClicked: any;
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
    casaAccountId: number;
    covenantRateText = 'Covenant Amount';
    casaAccountSelected: boolean = false;
    covenantCollection: LoanCovenantModel[] = [];
    chargeCollection: ChargeFeeAppModel[] = [];
    covenantDetails: any[];
    customerCollaterals: any[];

    canBook: boolean = false;
    readonly creditAppraisalComment: string = "CREDIT APPROVAL COMMENTS";
    readonly drawdownComment: string = "DRAWDOWN COMMENTS";

    readonly CREDITAPPRIASALDOC: string ="CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string ="DRAWDOWN DOCUMENTS";
    baseCurrencyData: any;
    baseCurrencyId: number;
    baseCurrencyCode: string;
    binaryFile: any;
    displayDocument: boolean;
    display: boolean = false;
    displayLoanList: boolean = true;
    displayBookedLoans: boolean = false;
    showEditLoan: boolean = false;
    displayCollateralList: boolean = true;
    displayCovenantList: boolean = true;
    displayBeneficiaryForm: boolean = false;
    disableAmountField: boolean = true;
    disableFrequencyField: boolean = true;
    displayGoBack: boolean = false;
    displayRecurringPaymentDay: string = 'hide';
    displayLoanCollateral: boolean = true;
    displayJobrequest = false;
    displaySearchModal: boolean = false;

    isCollateralDisabled: boolean = true;
    isChargesDisabled: boolean = true;
    isCovenantDisabled: boolean = true;
    isLoanInfoDisabled: boolean = true;
    isScheduleDisabled: boolean = true;
    isGroup: boolean = false;
    isContingentLoan: boolean = false;
    isRevolvingLoan: boolean = false;
    isCommercialLoan: boolean = false;
    isForeignExchangeLoan: boolean = false;
    isIDF: boolean = false;
    isScheduledLoan: boolean = false;
    //isGroupGenerate: boolean = false;
  
    jobSourceId: number ;
    selectedLoanApplicationId?: number = null;
    selectedLoanId?: number = null;
    selectedLoanCustomerId?: number = null;
    shouldDisburse: any;
    secondaryInfocaption: string;
    selectedItem: any = {};
    showCustomerCollaterals: boolean = false;
    scheduleTitle: string; // = 'Generate Schedule';
    selectedId?: number;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    selectedDocument: any;
    supportingDocuments: any[] = [];
    selectedLoanProductId?: number = null;
    selectedCovenantId?: number = null;
    scheduleCollection: LoanSchedule[] = [];
    loanBookingForm: FormGroup;
    operationForm: FormGroup;
    covenantDetailForm: FormGroup;
    beneficiaryForm: FormGroup;
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

    //hideableIntgralFeeValue: string = 'hide';
    //hideableRecuringFeeValue: string = 'hide';
    myDocExtention: string;
    show: boolean = false; width: string; message: any; title: any; cssClass: any;
    applicableCollaterals: any[] = [];
    additionalPropertyCollateralValues: any[] = [];
    //productClasses: any[];
    //productCharges: any[];
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

    isInterestCheckboxTitle = 'In Interest Based';
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
    uploadFileTitle: string = null;
    productFeeData: any[] = [];
    selectedCustomerAccount: any;
    selectedAccountBalance: any;
    commercialLoans: any;
    currencies: any[] = [];
    rateCodes: any;
    beneficiaryCurrencyCode: any;
    beneficiaryRateCodeId: any;
    nostroAccounts: any;
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
    enableRoute: boolean;
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    workflowTargets: WorkflowTarget[] = [];
    destinationCurrencyAmount: number = 0;
    destinationCurrencyCode: any;
    userInfo: any;
    isInEditMode: boolean;
    referredId: number;
    interestRateAmount: number;
    isDicounted: boolean;
    repricingMode: any;
    basisCommercial: any;
    bookedLoanData: any;
    currencyId: number;
    multipLoanData:any;
    drawdownHtml: any;
    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(CollateralInformationViewComponent, {static: false}) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(JobRequestViewComponent, {static: false}) jobRequestViewObj: JobRequestViewComponent;

    override: any;
    interestCapAccount: any;
    displayOperationRouteCommentForm: boolean;
    approvalLevels: any;
    errorMessage: string = '';
    displayCommentForm: boolean;
    allStaff: any;
    reportSource: SafeResourceUrl;
    applicationReferenceNumber: any;
    userSpecific: any;
    routableUser: any;
    routableMode: any;
    routeButtonText: string ='Display Route';
    approvalWorkflowData: any;
    referBackForm: FormGroup;
    displayReferBackForm: boolean;

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
    ) { }

    ngOnInit() {
        this.jobSourceId = JobSourceEnum.LoanApplicationDetail;
        this.initializeControls();
        this.getAvailedMultipleApplicationsForBooking();
        this.getRateCode();
        this.getCRMSRepaymentType();
        this.getBaseCurrency();
        this.getAllCurrencies();
        this.resetBeneficiaryForm();

        this.userInfo = this.authService.getUserInfo();
        this.systemDate = this.userInfo.applicationDate;
        this.username = this.userInfo.userName;
        this.referredId = ApprovalStatusEnum.Referred;
    }

    getGroupCustomers(groupId: number) {
        this.loanBookingService.getGroupCustomersByGroupId(groupId).subscribe((data) => {
            this.groupMembers = data.result;
        }, err => { });
    }

    getRateCode() {
        this.exchangeRateService.getRateCode().subscribe((response: any) => {
            this.rateCodes = response.result;
        }, (err) => {
        });
    }

    reset() {
        this.searchString = "";
        this.reload = 1;
    }

    searchString: any;
    searching: Boolean = false;
    getLoanApplications()
        {
            this.loadingSrv.show();
            this.loanBookingService.getLoanFacilitiesAwaitingApprovalByParam(this.searchString).subscribe((response: any) => {
                this.loanApplication = this.loans = response.result;
                if (this.loans != undefined) { this.loans.slice; }
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    getAllCurrencies() {
        this.exchangeRateService.getAllCurrencies().subscribe((response: any) => {
            this.currencies = response.result;
        });
    }

    empty() {
        
        this.drawdownHtml = null;
       
    }

    closeDrawdown(){
        this.empty();
       
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
        this.camService.getDrawdownMemoHtml(targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
        }, (err) => {
          
        });
    }

    getAccountBalance() {
        var account = this.loanSelection.customerAccounts.filter(x=>x.casaAccountId == this.loanBookingForm.value.casaAccountId);
        this.loanBookingService.getCustomerAccountBalanceByCasaAccountId(account[0].casaAccountId).subscribe((data) => {
            if (data.result != undefined) {
                this.selectedAccountBalance = data.result.availableBalance;
            }
            if (!data.success) {
                swal('Fintrak Credit 360', data.message, 'error');
            }
        }, err => { });
    }

    addToList(form){
        this.beneficiaryAmount = Number(parseFloat(this.data.beneficiaryAmount.toString().replace(/[,]+/g, "").trim()));
        var exchangeValue = this.beneficiaryAmount * Number(this.sellingRate);
        var c = new FXLoanBeneficiaryModel(
            this.beneficiaryCurrencyId,
            this.beneficiaryCurrencyCode,
            this.beneficiaryAmount,
            this.beneficiaryReason,
            this.beneficiaryRateCode,
            this.beneficiaryRateCodeId,
            this.beneficiaryRateAmount,
            exchangeValue,
        );
        this.beneficiaryRateAmount = form.value.nostroRateAmount;
        this.totalAddedBeneficiaryAmount = Number(this.totalAddedBeneficiaryAmount) + Number(this.beneficiaryAmount);
        if(Number(this.totalAddedBeneficiaryAmount) <= Number(this.destinationCurrencyAmount))
        {
            this.beneficiaryList.push(c);
        }
        else
        {
            this.totalAddedBeneficiaryAmount = Number(this.totalAddedBeneficiaryAmount) - Number(this.beneficiaryAmount);
            swal('Fintrak Credit 360','Beneficiary total amount cannot be greater than the loan amount');
        }
        this.displayBeneficiaryForm = false;
        this.resetBeneficiaryForm();
        this.LoanBeneficiaryAmountCheck();
    }

    getNostroCurrencyValue(): any {
        var nostroId = this.loanBookingForm.value.casaAccountId2;
        var selectedNostro = this.nostroAccounts.filter(x=>x.customAccountId == nostroId)
        this.nostroCurrencyCode = selectedNostro[0].currencyCode;

        var insterestCapId = this.loanBookingForm.value.casaAccountId;
        var selectedInterestCap= this.customerAccounts.filter(x=>x.casaAccountId == insterestCapId)
        this.interestCapCurrencyCode = selectedInterestCap[0].currencyCode;

        this.loanBookingService.getExchangeRate(selectedInterestCap[0].currencyCode,selectedNostro[0].currencyCode,'TTB').subscribe((data) => {
            this.newExchangeRate = data.result;
        }, err => { });

        return this.newExchangeRate
    }

    nostroRateCodeId:number;
    getExchangeRate(): any{
        this.nostroRateCodeId = this.loanBookingForm.value.nostroRateCodeId;
        if(this.loanBookingForm.value.casaAccountId2 == null)
        return;
        if(this.loanBookingForm.value.casaAccountId == null)
        return;
        if(this.loanBookingForm.value.nostroRateCodeId == null || this.loanBookingForm.value.nostroRateCodeId == 0 || this.loanBookingForm.value.nostroRateCodeId == undefined)
        return;

        this.sellingRate = null;
        var nostroId = this.loanBookingForm.value.casaAccountId2;
        var selectedNostro = this.nostroAccounts.filter(x=>x.customAccountId == nostroId);
        this.destinationCurrencyCode = selectedNostro[0].currencyCode;
        this.nostroCurrencyCode = selectedNostro[0].currencyCode;
        var insterestCapId = this.loanBookingForm.value.casaAccountId;
        var selectedInterestCap= this.customerAccounts.filter(x=>x.casaAccountId == insterestCapId);
        
        this.interestCapCurrencyCode = selectedInterestCap[0].currencyCode;
        var nostroRateCodeId = this.loanBookingForm.value.nostroRateCodeId;
        var selectednostroRateCode= this.rateCodes .filter(x=>x.lookupId == nostroRateCodeId)

        if(this.nostroCurrencyCode == this.interestCapCurrencyCode){
            this.sellingRate = 1.00;
            this.destinationCurrencyAmount = Number(this.loanSelection.bookingAmountRequested.toFixed(2)) ;
            return;
        }

        this.loadingSrv.show();
            this.loanBookingService.getExchangeRate(selectedInterestCap[0].currencyCode,selectedNostro[0].currencyCode,selectednostroRateCode[0].lookupName).subscribe((data) => {
                this.newExchangeRate = data.result;
                this.sellingRate = this.newExchangeRate.sellingRate;
                var b = Number(this.loanSelection.bookingAmountRequested) * Number(this.sellingRate)
                this.destinationCurrencyAmount = Number(b.toFixed(2));
                this.loadingSrv.hide();
            }, err => { });

        return this.newExchangeRate
    }

    getLoanCustomerAccounts(loanApplicationDetailId:number, customerId:number) {
        this.casaSrv.getAllCustomerAccountByCustomerId(customerId).subscribe((data) => {
            if(data.success) {
                this.customerAccounts = data.result;
            this.loanSelection.customerAccounts = data.result;
            this.interestCapAccount = this.customerAccounts.filter(x=>x.productAccountName.includes('Interest CAP') || x.productAccountName == 'FX Revolving Interest CAP Account');
                this.onCustomerAccountChange(this.loanSelection.casaAccountId);
            }
        }, err => { });
    }

    getAllCompanyChartOfAccounts() {
        this.casaSrv.getAllCompanyChartOfAccounts().subscribe((data) => {
            this.nostroAccounts = data.result;
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

    getLoanInterestRateAmount(principal,interestRate,startDate,endDate,productId) {
        var body ={
            principalAmount : principal,
            interestRate : interestRate,
            effectiveDate : startDate,
            maturityDate : endDate,
            productId : productId,
            scheduleDayCountConventionId : DayCountConventionEnum.Actual_Actual
        }
        this.loanBookingService.getLoanInterestRateAmount(body).subscribe((data) => {
            this.interestRateAmount = data.result;
            this.isDicounted = data.isDicounted;
        }, err => { });
    }

    getLoanTransactionDynamics(loanApplicationDetailId) {
        this.loanBookingService.getLoanTransactionDynamics(loanApplicationDetailId).subscribe((response: any) => {
            this.loanSelection.loanTransationDynamics = response.result;
            this.loadingSrv.hide();
        });
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanBookingService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, err => { });
    }

    showHidden: boolean = false;
    getLoanProductFees(loanBookingRequestId: number) {
        //this.valueBase = 'Rate(%)';
        this.loanBookingService.getLoanProductFees(loanBookingRequestId).subscribe((data) => {
            this.loanProductFees = data.result;
           // this.override = this.loanProductFees.filter(x=>x.hasConsession == true);
           if(this.loanProductFees != null || this.loanProductFees != undefined){
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
                    valueBase: feeItem.valueBase,
                    dealTypeId: feeItem.dealTypeId,
                    isDutiable: feeItem.isDutiable
                }
                //if(feeItem.isDutiable == true){this.showHidden = true}
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

    totalFeeAmount() {
        this.feeAmountTotal = 0;
        this.chargeCollection.forEach(item => {
            this.feeAmountTotal = this.feeAmountTotal + item.feeAmount;
           
        });
    }

    getSupportingDocuments(applicationNumber: any) {
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
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

    overrideFees(): void {
        this.loadingSrv.show();
        this.chargeCollection.forEach(eachObj => {
            eachObj.isPosted = false;
        });

        this.feeOverride = true;
        this.finishedSchedule = true;
        this.canBook = true;
        this.buttonTitle = 'Book Loan';
        this.loadingSrv.hide();
    }

    getBaseCurrency() {
        this.exchangeRateService.getBaseCurrency().subscribe((response: any) => {
            this.baseCurrencyData = response.result;
            this.baseCurrencyId = this.baseCurrencyData.currencyId;
            this.baseCurrencyCode = this.baseCurrencyData.currencyCode;
        });
    }

    getCurrencyExchangeRate(currencyId): any {
        this.exchangeRateService.getCurrencyExchangeRate(currencyId).subscribe((response: any) => {
            this.exchangeRate = response.result;
            this.exchangeRate == 0 ? this.exchangeRate = 1 : null;
        });
    }

    getCustomerByCustomerId(id: number) {
        this.customerService.getCustomerByCustomerId(id)
    }

    getCollections() {
        if (this.isRevolvingLoan) {
            this.revolvingLoanInputCollection = new revolvingLoanInputModel
                (
                this.loanSelection.customerId,
                this.loanSelection.productId,
                this.loanBookingForm.value.casaAccountId,
                this.loanSelection.branchId,
                this.loanSelection.currencyId,
                this.loanSelection.exchangeRate,
                this.loanSelection.loanApplicationId,
                this.loanBookingForm.value.revolvingInterestRate, // 'interest rate',
                this.loanBookingForm.value.revolvingEffectiveDate, // 'effective date',
                this.loanBookingForm.value.revolvingMaturityDate, // 'maturity date',
                this.loanBookingForm.value.revolvingOverdraftLimit, // 'overdraftlimit',
                this.loanSelection.loanAmount,
                this.loanSelection.loanStatusId,
                this.loanSelection.customerGroupId,
                this.loanSelection.loanTypeId,
                this.loanSelection.customerSensitivityLevelId,
                this.loanBookingForm.value.accrualBasis,
                this.revolvingTypeId
                );
        }
        if (this.isContingentLoan) {
            this.contingentLoanInputCollection = new contingentLoanInputModel
                (
                this.selectedLoanCustomerId,
                this.loanSelection.productId,
                this.loanBookingForm.value.casaAccountId,
                this.loanSelection.branchId,
                this.loanSelection.currencyId,
                this.loanSelection.exchangeRate,
                this.loanSelection.loanApplicationId,
                this.loanBookingForm.value.contigentEffectiveDate,
                this.loanBookingForm.value.contingentMaturityDate,
                this.loanBookingForm.value.contigentAmount,
                this.loanSelection.loanAmount,
                this.loanSelection.loanStatusId,
                this.loanSelection.customerGroupId,
                this.loanSelection.loanTypeId,
                ''
            )
        }
        var effectiveDate = null;
        var maturityDate = null;
        if(this.isCommercialLoan){
            effectiveDate = this.loanBookingForm.value.commercialEffectiveDate;
            maturityDate = this.loanBookingForm.value.commercialMaturityDate;
        }
        if(this.isContingentLoan){
            effectiveDate = this.loanBookingForm.value.contigentEffectiveDate;
            maturityDate = this.loanBookingForm.value.contingentMaturityDate;
        }
        if(this.isForeignExchangeLoan){
            effectiveDate = this.loanBookingForm.value.fxEffectiveDate;
            maturityDate = this.loanBookingForm.value.fxMaturityDate;
        }

        this.loanCollection = new LoanModel(
            this.selectedLoanCustomerId,                           //
            this.loanSelection.productId,                           // productId
            this.loanBookingForm.value.casaAccountId,               // casaAccountId
            this.loanBookingForm.value.casaAccountId2,               // casaAccountId
            this.loanSelection.currencyId,                          // currencyId
            this.loanSelection.branchId,                            // branchId
            this.loanSelection.exchangeRate,                        // exchangeRate
            this.loanSelection.loanApplicationId,                   // loanApplicationDetailId
            this.loanSelection.loanApplicationDetailId,             // loanApplicationDetailId
            this.loanSelection.loanStatusId,                        // loanStatusId
            this.loanSelection.customerGroupId,                     // customerGroupId
            this.loanSelection.loanTypeId,                          // loanTypeId
            this.isRevolvingLoan || this.isContingentLoan || this.isCommercialLoan || this.isForeignExchangeLoan ? this.loanBookingForm.value.priceIndexId : this.scheduleCollection[0].formData.priceIndexId,       // productPriceIndexId
            this.loanSelection.subSectorId,                         // subSectorId
            this.loanSelection.productTypeId,                       // productTypeId
            this.isRevolvingLoan || this.isContingentLoan || this.isCommercialLoan || this.isForeignExchangeLoan ? null : this.scheduleCollection[0].formData.scheduleMethod,
            this.loanSelection.interestRate,
            this.loanSelection.customerAvailableAmount,
            this.loanSelection.casaBalance,
            this.feeOverride = false,
            this.loanSelection.loanBookingRequestId,
            this.twoFactorAuthPassCode,
            this.twoFactorAuthStaffCode,
            this.isRevolvingLoan || this.isContingentLoan || this.isCommercialLoan ? null : this.scheduleCollection[0], //LoanScheduleInputs
            this.revolvingLoanInputCollection,                      // revolvingLoanInput
            this.contingentLoanInputCollection,                     // contingentLoanInput
            this.covenantCollection,                                // loanCovenant
            this.chargeCollection,                                  // loanChargeFee
            null,                                                   // loanGuarantor
            this.collateralCollection,                              // loanCollateral
            this.monitoringTriggerCollection,
            this.isCommercialLoan ? this.loanBookingForm.value.commercialPrincipal : this.isForeignExchangeLoan ? this.loanBookingForm.value.fxPrincipal : 0,
            this.beneficiaryList,
            this.nostroRateCodeId,
            effectiveDate,
            maturityDate,
            this.isInEditMode,
            this.bookedLoanData ? this.bookedLoanData.loanId : null,
            this.loanBookingForm.value.comment,
            ''
        );
        return this.loanCollection;
    }

    LoanBeneficiaryAmountCheck(){
        if(this.isForeignExchangeLoan){
            if(this.beneficiaryList.length < 0 
                || this.totalAddedBeneficiaryAmount != this.destinationCurrencyAmount)
                { this.canBook = false; }
            else
            {this.canBook = true;}
        }
    }

    validateLoanInputs() { 
        if (this.isRevolvingLoan || this.isContingentLoan || this.isCommercialLoan || this.isForeignExchangeLoan) 
        {
            if (this.casaAccountSelected) {
                this.visibleSubmit = null;
                this.canBook = true;
                this.finishedSchedule = true;
                if(this.isForeignExchangeLoan)this.LoanBeneficiaryAmountCheck();
            }
            else this.visibleSubmit = 'hide';
        }
        else if (this.scheduleCollection.length > 0) {
            if (!this.casaAccountSelected) { 
                this.finishBad("Warning! Customer Account must be selected.");
            }
            else {
                this.canBook = true;
                this.feeOverride = false;
                this.finishedSchedule = true;
                this.loanBookingForm.markAsDirty();
            }
        }
    }

    getSchedule(event: any) {
        if (event) { 
            
        

            this.scheduleCollection.pop();
            this.scheduleCollection.push(event);
            if (this.casaAccountSelected) 
            {
                this.finishGood('Schedule generated successfully');
                this.totalFeeAmount();
                this.finishedSchedule = true;
                this.visibleSubmit = null;
                this.canBook = true;
            } else this.validateLoanInputs();
        } else this.finishBad('Opps! The schedule generation failed.');
    }

    submitLoanDetails() {
        if (this.finishedSchedule) {
            const collections = this.getCollections();
             if (this.canBook) { this.bookLoans(collections); }
        }
    }

    submitLoanDetailsWith2FA() {
        if (this.finishedSchedule) {
            const collections = this.getCollections();
            // Start Loan Booking..................
            if (this.canBook) {
                this.bookLoans(collections)
            }
        }
    }

    maintainLine(){ 
        const __this = this;
        var collections = {
            approvedLineStatusId : 1,
            loanApplicationDetailId : __this.loanSelection.loanApplicationDetailId,
            loanBookingRequestId : __this.loanSelection.loanBookingRequestId,
            operationId :  __this.loanSelection.operationId
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
            
            console.log('collections',collections);
            //collections.approvedLineStatusId = 1;
            __this.loadingSrv.show();
            __this.loanBookingService.maintainFacilityLine(collections)
            .subscribe((res) => {
                if (res.success === true) {
                    __this.showMessage(res.message, 'success', 'FintrakBanking');
                    __this.BackToLoanBookingGridList();
                    __this.initializeControls();
                    __this.loadingSrv.hide();
                    __this.getAvailedMultipleApplicationsForBooking();
                    __this.displayTwoFactorAuth = false;
                } else {
                    __this.showMessage(res.message, 'error', 'FintrakBanking');
                    __this.loadingSrv.hide();
                }
            }, (err) => {
                __this.loadingSrv.hide();
                __this.showMessage(err.message, 'error', 'FintrakBanking');
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

        
    }

    bookLoans(dataCollection): void {
        this.canBook = false;
        this.loadingSrv.show();
        this.loanBookingService.saveLoans(dataCollection)
            .subscribe((res) => {
                if (res.success === true) {
                    this.showMessage(res.message, 'success', 'FintrakBanking');
                    this.BackToLoanBookingGridList();
                    this.initializeControls();
                    this.loadingSrv.hide();
                    this.getAvailedMultipleApplicationsForBooking();
                    this.twoFactorAuthPassCode = null;
                    this.twoFactorAuthStaffCode = null;
                    this.displayTwoFactorAuth = false;
                } else {
                    this.canBook = true;
                    this.showMessage(res.message, 'error', 'FintrakBanking');
                    this.loadingSrv.hide();
                }
            }, (err) => {
                this.loadingSrv.hide();
                this.canBook = true;
                this.showMessage(err.message, 'error', 'FintrakBanking');
            })
    }

    assignRevolvingTypeId() {
        this.revolvingTypeId = this.loanBookingForm.value.revolvingTypeId;
    }

    setTabViewStatus() {
        if (this.collateralCollection.length <= 0) {
            this.isCovenantDisabled = true;
        } else this.isCovenantDisabled = false;

        if (this.chargeCollection.length <= 0) {
            this.isLoanInfoDisabled = true;
        } else { this.isLoanInfoDisabled = false; }
    }

    onNostroAccountChange(id): void {
        this.beneficiaryList = []; 
        let account = this.nostroAccounts.filter(x => x.customAccountId == id);
        this.loanBookingForm.controls['accountToCredit'].setValue(account[0].detail);
        this.getExchangeRate();
    }

    onCustomerAccountChange(id): void { 
        if(this.customerAccounts != null) {
            let account = this.customerAccounts.filter(x => x.casaAccountId == id);
            this.selectedCustomerAccount = account;
            this.interestCapCurrencyCode = this.loanSelection.currencyCode;

            if(this.loanSelection != null && account[0] != null && this.loanSelection.currencyId != account[0].currencyId){
                this.finishBad('You need a ' + this.loanSelection.currencyCode + ' account for this transaction.');
                this.casaAccountSelected = false;
            }
            else if ((Number(id) > 0 && id != null)){
                this.isLoanInfoDisabled = false;
                this.casaAccountSelected = true; 
                this.loanBookingForm.controls['accountToCredit'].setValue(account[0].productAccountNumber);
            } 
        }
    }

    checkMandatoryProductFees(i = 0) {
        this.loanProductFees.forEach(eachObj => {
            if (eachObj.required) {
                if (!eachObj.some(a => a == this.chargeCollection[i])) {
                    this.finishBad('Fee : ' + eachObj.chargeFeeName + 'not added \n' + 'Some Mandatory Fees have not been mapped');
                    this.isLoanInfoDisabled = true;
                }
                else { }
            } i++;
        });
    }

    validateTenor(x){
        var value = Number(x);
        if(value == 0){
            swal('Fintrak Credit 360','Zero tenor is not allowed','warning');
            this.loanBookingForm.controls['commercialTenor'].setValue(this.loanSelection.approvedTenor);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(this.loanSelection.approvedTenor));
            return;
        }
        if(value > this.loanSelection.approvedTenor){
            swal('Fintrak Credit 360','tranche tenor cannot be greater than the line approved tenor.','warning');
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
            this.validateLoanInputs();
        }

        if (fxEffectiveDate != null) {
            let date = this.loanBookingForm.value.fxEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + value);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(maturityDate));
            this.validateLoanInputs();
        }
    }

    calculateMaturityDate() {
        let revolvingEffectiveDate = this.loanBookingForm.value.revolvingEffectiveDate;
        let contigentEffectiveDate = this.loanBookingForm.value.contigentEffectiveDate;
        let fxEffectiveDate = this.loanBookingForm.value.fxEffectiveDate;
        let commercialEffectiveDate = this.loanBookingForm.value.commercialEffectiveDate

        var tenor = this.loanSelection.approvedTenor;
        // if(this.loanBookingForm.value.fxTenor != this.loanSelection.approvedTenor){
        //     if(tenor > 365 && this.isCommercialLoan){
        //         swal('Fintrak Credit 360','You have exceeded loan tenor limit');
        //         tenor =this.loanSelection.approvedTenor;
        //         return;
        //     }
        //     tenor = Number(this.loanBookingForm.value.fxTenor);
        // }

        if (revolvingEffectiveDate != null) {
            let date = this.loanBookingForm.value.revolvingEffectiveDate;
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['revolvingMaturityDate'].setValue(new Date(maturityDate));
            this.validateLoanInputs();
        }
        if (contigentEffectiveDate != null) {
            let date = this.loanBookingForm.value.contigentEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['contingentMaturityDate'].setValue(new Date(maturityDate));
            this.validateLoanInputs();
        }
        if (fxEffectiveDate != null) {
            let date = this.loanBookingForm.value.fxEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(maturityDate));
            this.validateLoanInputs();
        }
        if (commercialEffectiveDate != null) {
            let date = this.loanBookingForm.value.commercialEffectiveDate
            var ret = new Date(date);
            var maturityDate = ret.setDate(ret.getDate() + tenor);
            this.loanBookingForm.controls['commercialMaturityDate'].setValue(new Date(maturityDate));
            this.validateLoanInputs();
        }
    }

    calculateIntegralFeeAmount() {
        this.chargeCollection.forEach(eachObj => {
            if (eachObj.isRequired) {
                this.integralFeeAmount = this.integralFeeAmount + eachObj.feeAmount;
            }
        });
    }

    pushSelectedLoans(row){
        //console.log("row: ", row);
        this.workflowTarget = new WorkflowTarget;
        var record = row.data;
        this.workflowTarget.targetId = record.loanBookingRequestId;
        this.workflowTarget.operationId = record.operationId;
        this.enableReroute = true;
        this.workflowTargets.push(this.workflowTarget);
    }

    popSelectedLoans(row) {
        //alert("Got here!");
        var record = row.data;
        var index = this.workflowTargets.findIndex(x=>x.targetId == record.loanBookingRequestId)
        this.workflowTargets.splice(index,1);
        if(this.workflowTargets.length <= 0){
            this.routableMode =false;
        }
    }
   
    setRouteMode(){
        if(this.routableMode){
            this.routableMode = false;
            this.routeButtonText ='Display Route';
        } else{
            this.routableMode = true
            this.routeButtonText ='Hide Route';
        }
    }
    
    getAvailedMultipleApplicationsForBooking() {
        this.loadingSrv.show();
        this.loanBookingService.getAvailedMultipleApplicationsForBooking().subscribe((res) => {
            this.loanApplication = this.loans = res.result;
            
            if(this.loans != null){
                this.routableUser = this.loans[0].canReRouteBooking;
            }

            if(this.routableUser){
                this.loanApplication = this.loans = this.loans.filter(x=>x.isBooked == false);
            }
            // if(!this.routableUser){
            //     this.loanApplication = this.loans = this.loans.filter(x=>x.isBooked == false || x.isInEditMode == true);
            // }

            if (this.loans != null) this.isLoanRowAboveLimit = this.loans.length > 10;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide();
        });
    }

    loadCustomerApplicationDetails(data) {
        if (data === null || data === undefined) {
            this.finishBad('Application failed to load customer loan details');
            return;
        }

        this.loanSelection = data;
        //console.log('loanSelection',this.loanSelection);
        this.loanSelection.casaBalance = 0;
        this.loanSelection.customerAccounts = null
        const revolvingTypeId = this.loanBookingForm.controls['revolvingTypeId'];
        const comment = this.loanBookingForm.controls['comment'];

        if (this.loanSelection.bookingAmountRequested > this.loanSelection.customerAvailableAmount && !this.isInEditMode) {
            this.finishBad('The Amount requested is greater than the line available balance');
            this.BackToLoanBookingGridList();
            return;
        } 
        else {
            this.getCurrencyExchangeRate(this.loanSelection.currencyId);
            if (this.loanSelection.customerType.toLowerCase() === 'corporate') {
                this.secondaryInfocaption = 'Company Executives';
            } else {
                this.secondaryInfocaption = 'Other Information'
            }

            this.routableMode = false;
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
            this.scheduleTitle = this.loanSelection.isBidbond ? 'Bond Contract' : (!this.loanSelection.isBidbond && this.loanSelection.isOverdraft) ? 'Overdraft Grant' : 'Generate Schedule';

            if (!this.loanSelection.customerGroupId === null || this.loanSelection.customerGroupId != 0) {
                this.isGroup = true;
            }

            if(this.loanSelection.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY){
                this.isIDF=true;
            }

            this.getLoanCurrenyPriceIndex(this.loanSelection.currencyId);
            this.getLoanApplicationCovenant(this.loanSelection.loanApplicationDetailId);
            this.onOperationChange(this.loanSelection.operationId);

            this.loanApplServ.getFinalOfferLetterByLoanAppId(this.loanSelection.applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.form3800bSrc = tempSrc;
            }, (err) => {
                // swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });

            this.updateWorkflowTarget();

            this.getLoanCustomerAccounts(this.loanSelection.loanApplicationDetailId, this.loanSelection.customerId);
            this.getAllCompanyChartOfAccounts();
            this.getLoanTransactionDynamics(this.loanSelection.loanApplicationDetailId);
            this.getLoanMonitoringTriggerByID(this.loanSelection.loanApplicationDetailId);
            this.getLoanApplicationCollateral(this.loanSelection.loanApplicationId);
            this.getLoanRepricingModes();

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
            const casaAccountId2 = this.loanBookingForm.controls['casaAccountId2'];
            const fxTenor = this.loanBookingForm.controls['fxTenor'];
            const nostroRateCodeId= this.loanBookingForm.controls['nostroRateCodeId'];

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

                casaAccountId2.setValidators(Validators.required);
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

                casaAccountId2.setValidators(Validators.required);
                fxTenor.setValidators(Validators.required);
                nostroRateCodeId.setValidators(Validators.required);

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

                if(!this.loanSelection.isLocalCurrrency && !this.isIDF) {
                    this.isForeignExchangeLoan = true;
                    this.loanProductTypeTitle = 'FX-Loan';
                    this.scheduleTitle = 'Foreign Exchange Loan Summary';
                }
                if(this.isIDF){casaAccountId2.setValidators(Validators.required);}
            }
        }

        if(!this.isForeignExchangeLoan || this.isIDF) {
            this.loanBookingForm.controls['casaAccountId'].setValue(this.loanSelection.casaAccountId);
            this.loanBookingForm.controls['casaAccountId2'].setValue(this.loanSelection.casaAccountId2);
        }
    }

    setNostroRateCode(id){ 
        const nostroRateCodeId= this.loanBookingForm.controls['nostroRateCodeId'];
        nostroRateCodeId.setValidators(Validators.required);
        nostroRateCodeId.updateValueAndValidity();
        if(id > 0) {
            nostroRateCodeId.clearValidators();
            nostroRateCodeId.updateValueAndValidity();
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

    approvalStatusId: any;
    onSelectedLoanChange(row) { 
        this.approvalStatusId = row.approvalStatusId;
        this.reload++;
        if(row.approvalStatusId == ApprovalStatusEnum.Referred)
        {
            this.applicationReferenceNumber =row.applicationReferenceNumber;
            this.isInEditMode = true;
            this.startLoanBookingProcess(row.loanApplicationDetailId, row.loanBookingRequestId);
            this.getReferredBookedFacilityDetail(row);
            this.getDrawdownMemoHtml(row.loanBookingRequestId);
        }
        // console.log("the loan selected details are "+JSON.stringify(row));
        if(row.approvalStatusId != ApprovalStatusEnum.Referred)
        {
            this.ValidateAvailableAmount(row);
            this.ValidateZerodTenor(row);
            this.startLoanBookingProcess(row.loanApplicationDetailId, row.loanBookingRequestId);
            this.getDrawdownMemoHtml(row.loanBookingRequestId);
        }
        
        this.getApprovalTrailByOperationBooking(row.operationId, row.loanApplicationId);
    }

    ValidateAvailableAmount(data) {
        if (data.customerAvailableAmount <= 0) {
            this.finishBad('Available amount is zero. Loan may have been booked and currently undergoing approval');
            this.BackToLoanBookingGridList();
            return;
        }
    }

    ValidateZerodTenor(data){
        if (data.approvedTenor <= 0) {
            this.finishBad('Could not proceed because loan tenor is zero');
            this.BackToLoanBookingGridList();
            return;
        }
    }

    startLoanBookingProcess(loanApplicationDetailId,loanBookingRequestId) {
        this.loadingSrv.show();
        this.loanBookingService.getLoanApplicationReadyForForBookingById(loanApplicationDetailId, loanBookingRequestId)
                .subscribe((res: any) => {
                    this.loadingSrv.hide();
                    if (res.result != undefined) this.loadCustomerApplicationDetails(res.result[0]);
                }, (err) => {
                    this.loadingSrv.hide();
                    return null;
                });
    }

    getReferredBookedFacilityDetail(facilityRquestData) {
        var body = {
            loanId : facilityRquestData.loanId,
            productTypeId : facilityRquestData.productTypeId
        };
        this.loanBookingService.GetRefferedBookedFacilityDetail(body).subscribe((response: any) => {
            this.bookedLoanData = response.result;

            this.bookedLoanData != null ? this.populateFormFieldsWithBookedFacilityData(this.bookedLoanData ) : null;
        });
    }

    getTemporaryOverdraftRevolvingTypes() {
        this.productService.getTemporaryOverdraftRevolvingTypes().subscribe((response: any) => {
            this.revolvingTypes = response.result;
            this.loadingSrv.hide();
        });
    }

    reMapProduct($event) {
        var x = $event.target.value;
        if (x != null && x != 0) {
            this.loanSelection.productId = x;
        }
        if(this.loanBookingForm.value.commercialEffectiveDate > this.loanBookingForm.value.commercialMaturityDate){
            this.loanBookingForm.controls['commercialInterestProductId'].setValue('');
            swal('Fintrak Credit 360', 'Maturity cannot be less than effective date', 'warning');
            return;
        }
        this.getLoanInterestRateAmount(this.loanAmount,this.loanSelection.interestRate,new Date(this.loanBookingForm.value.commercialEffectiveDate),new Date(this.loanBookingForm.value.commercialMaturityDate),this.loanSelection.productId);
    }

    getTranchAmount(): void {
        var disAmoount = this.loanSelection.bookingAmountRequested;
        this.tranchAmount = Number(disAmoount.toString().replace(/[,]+/g, "").trim());

        if (this.tranchAmount > this.loanSelection.customerAvailableAmount && !this.isInEditMode) {
            this.finishBad('The Amount requested is greater than the line available amount');
            this.BackToLoanBookingGridList();
            return;
        } else {
            this.loanAmount = this.tranchAmount;
            this.getLoanProductFees(this.loanSelection.loanBookingRequestId);
            this.calculateIntegralFeeAmount();
        }
    }

    onProductPriceIndexChange(target) { 
        if(Number(target.value) <= 0 || target.value == null || target.value == ''){
            this.getLoanInterestRateAmount(this.loanAmount,this.loanSelection.approvedInterestRate,new Date(this.loanBookingForm.value.commercialEffectiveDate),new Date(this.loanBookingForm.value.commercialMaturityDate),this.loanSelection.productId);
            if(this.isCommercialLoan){
                this.loanBookingForm.controls['commercialInterestRate'].setValue(this.loanSelection.approvedInterestRate);
            }
            if(this.isForeignExchangeLoan){
                this.loanBookingForm.controls['fxInterestRate'].setValue(this.loanSelection.approvedInterestRate);
            }
            return;
        }
        
        var priceIndex = this.productCurrencyPriceIndex.filter(x=>x.productPriceIndexId == target.value)[0];
        if(priceIndex != null || priceIndex != undefined){ 
            var interestRate = this.loanSelection.approvedInterestRate + priceIndex.priceIndexRate;
            this.getLoanInterestRateAmount(this.loanAmount,interestRate,new Date(this.loanBookingForm.value.commercialEffectiveDate),new Date(this.loanBookingForm.value.commercialMaturityDate),this.loanSelection.productId);
            if(this.isCommercialLoan){
                this.loanBookingForm.controls['commercialInterestRate'].setValue(interestRate);
            }
            if(this.isForeignExchangeLoan){
                this.loanBookingForm.controls['fxInterestRate'].setValue(interestRate);
            }
        }
    }

    getLoanCurrenyPriceIndex(currencyId) { 
        this.productService.getProductPriceIndexByCurrencyId(currencyId).subscribe((data) => {
            if(data.success){
                this.productCurrencyPriceIndex = data.result;
                var priceIndex = this.productCurrencyPriceIndex.filter(x=>x.productPriceIndexId == this.loanSelection.productPriceIndexId);
                if(this.loanSelection.productPriceIndexId > 0){
                    if(priceIndex != null){
                        this.loanBookingForm.controls['priceIndexId'].setValue(this.loanSelection.productPriceIndexId);
                    }
                }
            }
        }, err => { });
    }
    
    validateCustomerInformation(): void {
        if (this.casaAccountSelected) {
            this.isLoanInfoDisabled = false
            this.isCovenantDisabled = false;
        } else {
            this.isLoanInfoDisabled = true;
            this.isCovenantDisabled = true;
            this.isChargesDisabled = true;
            this.isScheduleDisabled = true
        }
    }

    validateLoanInformation(): void {
        if (this.loanBookingForm.value.disbursementAmount > 0) {
            this.isCovenantDisabled = false;
        } else {
            this.isChargesDisabled = true;
            this.isScheduleDisabled = true
        }
    }

    validateCovenant(): void {
        if (this.isCovenantDisabled == false) {
            this.isChargesDisabled = false;
        } else {
            this.isChargesDisabled = true;
        }
    }

    validateFees(tab): void {
        this.totalFeeAmount();
        if (this.isChargesDisabled == false ) {
            this.isScheduleDisabled = false;
            if (tab.index === 5) this.setEffectiveDate();
            if (tab.index === 5 && this.isCommercialLoan) this.validateLoanInputs();
            if (tab.index === 6 && this.isCommercialLoan) this.validateLoanInputs();
            if (tab.index === 7 && this.isCommercialLoan) this.validateLoanInputs();
        } else {
            this.isScheduleDisabled = false;
        }

        if (this.basis === null || this.basis === undefined) this.getDayCount();
    }

    getDayCount() {
        this.loanBookingService.getLoanDayCount()
            .subscribe((res) => {
                this.basis = res.result;
                this.basisCommercial = this.basis.filter(x=>x.lookupId == DayCountConventionEnum.Actual_Actual);
                if(this.loanSelection.productDayCountConventionId > 0 ) {
                    this.loanBookingForm.controls['accrualBasis'].setValue(this.loanSelection.productDayCountConventionId);
                 }
            });
    }

    getCommercialLoans(): void {
        this.loadingSrv.show();
        this.loanBookingService.getCommercialLoans().subscribe((response: any) => {
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

    onTabChange(tab) {
        if (!this.tabClicked) {
            this.getTranchAmount();
            this.getSupportingDocuments(this.loanSelection.applicationReferenceNumber);
            this.updateLoanInformationControls();
            this.tabClicked = true;
        }
        this.validateCustomerInformation();
        this.validateLoanInformation();
        this.validateCovenant();
        this.validateFees(tab);
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

    updateLoanInformationControls() {
        var priceIndextext =  this.loanSelection.productPriceIndex != null 
                                            || this.loanSelection.productPriceIndex != undefined 
                                            ? ' (' + this.loanSelection.productPriceIndex +')'
                                            : '';
        this.loanBookingForm.controls['loanTypeId'].setValue(this.loanSelection.loanTypeId);
        this.loanBookingForm.controls['productId'].setValue(this.loanSelection.productId);
        this.loanBookingForm.controls['relationshipOfficerId'].setValue(this.loanSelection.relationshipOfficerId);
        this.loanBookingForm.controls['relationshipManagerId'].setValue(this.loanSelection.relationshipManagerId);
        this.loanBookingForm.controls['approvedAmount'].setValue(this.loanSelection.approvedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['groupApprovedAmount'].setValue(this.loanSelection.groupApprovedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['availableAmount'].setValue(this.loanSelection.customerAvailableAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['interestRate'].setValue(this.loanSelection.interestRate + priceIndextext);
        this.loanBookingForm.controls['tenor'].setValue(this.loanSelection.approvedTenor);
        this.loanBookingForm.controls['tenorInMonths'].setValue(this.loanSelection.approvedTenorString);
        this.loanSelection.loanInformation != null ? this.loanBookingForm.controls['loanInformation'].setValue(this.loanSelection.loanInformation.innerHTML)
            : this.loanBookingForm.controls['loanInformation'].setValue('N/A');
        this.loanBookingForm.controls['customerName'].setValue(this.loanSelection.customerName);

        if (this.isGroup && this.loanSelection.customerName == null || this.loanSelection.customerName == undefined) {
            this.loanBookingForm.controls['customerName'].setValue(this.loanSelection.customerGroupName);
        }

        this.loanBookingForm.controls['customerId'].setValue(this.loanSelection.customerId);
        this.loanBookingForm.controls['currencyId'].setValue(this.loanSelection.currencyId);
        this.loanBookingForm.controls['currencyCode'].setValue(this.loanSelection.currencyCode);
        this.loanBookingForm.controls['loanTypeName'].setValue(this.loanSelection.loanTypeName);
        this.loanBookingForm.controls['applicationReferenceNumber'].setValue(this.loanSelection.applicationReferenceNumber);
        this.loanBookingForm.controls['relationshipOfficerName'].setValue(this.loanSelection.relationshipOfficerName);
        this.loanBookingForm.controls['relationshipManagerName'].setValue(this.loanSelection.relationshipManagerName);
        this.loanBookingForm.controls['productName'].setValue(this.loanSelection.productName);
        this.loanBookingForm.controls['exchangeRate'].setValue(this.loanSelection.exchangeRate);

        if (this.loanSelection.customerGroupName != null) { this.loanBookingForm.controls['customerGroupName'].setValue(this.loanSelection.customerGroupName);}
        else { this.loanBookingForm.controls['customerGroupName'].setValue('N/A');}

        this.loanBookingForm.controls['applicationDate'].setValue(this.loanSelection.applicationDate);

        this.loanBookingForm.controls['approvedEffectiveDate'].setValue(this.pipe.transform(this.loanSelection.effectiveDate, 'dd/MMM/yyyy'));

        if (this.loanSelection.misCode != null) { this.loanBookingForm.controls['misCode'].setValue(this.loanSelection.misCode); }
        else { this.loanBookingForm.controls['misCode'].setValue(this.loanSelection.misCode);}

        if (this.loanSelection.teamMisCode != null) { this.loanBookingForm.controls['teamMisCode'].setValue(this.loanSelection.teamMisCode);
        } else { this.loanBookingForm.controls['teamMisCode'].setValue('N/A'); }

        if (this.loanSelection.isRealatedParty != null) { this.loanBookingForm.controls['isRealatedParty'].setValue(this.loanSelection.isRealatedParty);}
        else { this.loanBookingForm.controls['isRealatedParty'].setValue(false); }

        if (this.loanSelection.isPoliticallyExposed != null) { this.loanBookingForm.controls['isPoliticallyExposed'].setValue(this.loanSelection.isPoliticallyExposed); }
        else { this.loanBookingForm.controls['isPoliticallyExposed'].setValue(false); }

        this.loanBookingForm.controls['productName'].setValue(this.loanSelection.productName);

        var effectiveDate = new Date(this.systemDate);
        var maturityDate = effectiveDate.setDate(effectiveDate.getDate() + Number(this.loanSelection.approvedTenor));

        // Setting the value of Non Schedule Related control
        this.loanBookingForm.controls['revolvingInterestRate'].setValue(this.loanSelection.interestRate);
        this.loanBookingForm.controls['revolvingOverdraftLimit'].setValue(this.loanSelection.bookingAmountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 })); //
        this.loanBookingForm.controls['contigentAmount'].setValue(this.loanSelection.bookingAmountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['docDescription'].setValue('Customer Request Document');
        this.loanBookingForm.controls['disbursementAmount'].setValue(ConvertString.ToNumberFormate(this.loanSelection.bookingAmountRequested));
        this.loanBookingForm.controls['commercialPrincipal'].setValue(this.loanSelection.bookingAmountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['commercialInterestRate'].setValue(this.loanSelection.interestRate.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['commercialTenor'].setValue(this.loanSelection.approvedTenor);

        // this.loanBookingForm.controls['commercialMaturityDate'].setValue(new Date(maturityDate));
        this.loanBookingForm.controls['fxPrincipal'].setValue(this.loanSelection.bookingAmountRequested.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['fxInterestRate'].setValue(this.loanSelection.interestRate.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        this.loanBookingForm.controls['fxEffectiveDate'].setValue(new Date(this.loanSelection.effectiveDate));
        this.loanBookingForm.controls['fxMaturityDate'].setValue(new Date(this.loanSelection.expiryDate));
        this.loanBookingForm.controls['fxTenor'].setValue(this.loanSelection.approvedTenor);

    }

    pipe = new DatePipe('en-US');
    populateFormFieldsWithBookedFacilityData(bookedLoanData ){
        this.loanBookingForm.controls['casaAccountId'].setValue(this.bookedLoanData.casaAccountId);
        this.loanBookingForm.controls['casaAccountId2'].setValue(this.bookedLoanData.casaAccountId2);

        switch(bookedLoanData.productTypeId){
            case ProductTypeEnum.CommercialLoans :

            break;

            case ProductTypeEnum.ForeignExchangeRevolvingFacility :
            this.loanBookingForm.controls['nostroRateCodeId'].setValue(this.bookedLoanData.nostroRateCodeId);
            this.loanBookingForm.controls['nostroRateAmount'].setValue(this.bookedLoanData.nostroRateAmount);

            break;

            case ProductTypeEnum.Revolving :

            break;

            case ProductTypeEnum.ContingentLiability :
            break;

            case ProductTypeEnum.TermLoan :

            break;
        }

        if (this.bookedLoanData.casaAccountId != null){
            this.isLoanInfoDisabled = false;
            this.casaAccountSelected = true;
            this.validateLoanInputs();
        }
    }

    removeBenficiaryItem(evt, indx) {
        evt.preventDefault();
        let currRecord = this.beneficiaryList[indx];
        this.totalAddedBeneficiaryAmount = this.totalAddedBeneficiaryAmount - currRecord.beneficiaryAmount;
        this.beneficiaryList.splice(indx, 1);
        this.LoanBeneficiaryAmountCheck();
    }

    GetAppraisalMemorandumCollateralChanges(loanApplicationId): void {
        this.loanBookingService.GetAppraisalMemorandumPropertyCollateralInfo(loanApplicationId).subscribe((response: any) => {
            this.additionalPropertyCollateralValues = response.result;
        });
    }

    GetAppraisalMemorandumLoanDetailsUpdate(appraisalMemorandumId): void {
        this.loanBookingService.GetAppraisalMemorandumLoanDetailsUpdate(appraisalMemorandumId).subscribe((response: any) => {
            this.loanInfoUpdate = response.result;

            if (!this.loanInfoUpdate === null) {
                this.loanSelection.interestRate = this.loanInfoUpdate.interestRate;
                this.loanSelection.principalAmount = Number(this.loanInfoUpdate.principalAmount);
                this.loanSelection.tenor = this.loanInfoUpdate.tenor;
            }
        });
    }

    crmsRepaymentAgreementType: any;
    getCRMSRepaymentType(): void {
        this.loanBookingService.getCRMSRepaymentAgreementType().subscribe((response: any) => {
            this.crmsRepaymentAgreementType = response.result;
        });
    }

    getLoanApplicationCovenant(applicationDetailId): void {
        this.loanBookingService.getLoanApplicationDetailCovenantById(applicationDetailId).subscribe((response: any) => {
            this.covenantDetails = response.result;
            if(this.covenantDetails != null){
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
            groupcustomerId: [''],
            loanTypeId: ['', Validators.required],
            productId: ['', Validators.required],
            relationshipOfficerId: ['', Validators.required],
            relationshipManagerId: ['', Validators.required],

            groupApprovedAmount: [''],
            approvedAmount: ['', Validators.required],
            availableAmount: ['', Validators.required],
            disbursementAmount: ['', Validators.required],

            interestRate: ['', Validators.required],
            tenor: ['', Validators.required],
            approvedEffectiveDate: [''],
            tenorInMonths: [''],
            loanInformation: [''],
            customerName: ['', Validators.required],
            customerId: ['', Validators.required],
            casaAccountId: ['', Validators.required],
            casaAccountId2: [''],

            accrualBasis: [''],
            currencyId: ['', Validators.required],
            currencyCode: ['', Validators.required],
            loanTypeName: ['', Validators.required],
            applicationReferenceNumber: ['', Validators.required],
            relationshipOfficerName: ['', Validators.required],

            relationshipManagerName: ['', Validators.required],
            productName: ['', Validators.required],
            exchangeRate: ['', Validators.required],
            customerGroupName: [''],

            applicationDate: ['', Validators.required],
            misCode: ['', Validators.required],
            teamMisCode: ['', Validators.required],
            isRealatedParty: ['', Validators.required],
            isPoliticallyExposed: ['', Validators.required],
            accountToCredit: [''],

            dateActedOn: [''],
            actedOnBy: [''],

            docDescription: ['Customer Request Document'],
            fileInput: [''],

            priceIndexId: [''],
            comment: [''],

            
            revolvingInterestRate: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            revolvingEffectiveDate: [new Date, Validators.required],
            revolvingMaturityDate: [new Date, Validators.required],
            revolvingOverdraftLimit: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            revolvingTypeId: [''],
            //.........END OF REVOLVING LOAN CONTROL.......//

            //...........CONTINGENT LOAN CONTROLS..........//
            contigentAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            contigentEffectiveDate: [new Date, Validators.required],
            contingentMaturityDate: [new Date, Validators.required],
            //.........END OF CONTINGENT LOAN CONTROLS.....//

             //...........COMMERCIAL LOAN CONTROLS..........//
             commercialInterestRate:['', Validators.compose([ValidationService.isNumber, Validators.required])],
             commercialEffectiveDate:[new Date, Validators.required],
             commercialMaturityDate:[new Date, Validators.required],
             commercialPrincipal:['', Validators.compose([ValidationService.isNumber, Validators.required])],
             commercialInterestProductId:[''],
             commercialTenor:[''],
             //.........END OF COMMERCIAL LOAN CONTROL.......//

             //...........FX LOAN CONTROLS..........//
             fxInterestRate:['', Validators.compose([ValidationService.isNumber, Validators.required])],
             fxEffectiveDate:[new Date, Validators.required],
             fxMaturityDate:[new Date, Validators.required],
             fxPrincipal:['', Validators.compose([ValidationService.isNumber, Validators.required])],
             nostroRateCodeId:['', Validators.compose([ValidationService.isNumber])],
             nostroRateAmount: ['', Validators.compose([ValidationService.isNumber])],
             fxTenor:['', Validators.compose([ValidationService.isNumber])],
             

             //.........END OF FX LOAN CONTROLS.......//
        });

        this.operationForm = this.fb.group({
            operationId: [''],
            approvalLevelId: [''],
            comment: [''],
            approvalStatusId : [''],
        });
    }

    resetBeneficiaryForm() {
        this.beneficiaryForm = this.fb.group({
            beneficiaryAmount:['',Validators.compose([ValidationService.isNumber,Validators.required])],
            beneficiaryReason: ['', Validators.required],
        });
    }

    BackToLoanBookingGridList() {
        // Unloading/resetting data collections................
        this.tabClicked = false;
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
        this.isCollateralDisabled = true;
        this.displayBookedLoans = false;
        this.displayLoanList = true;
        this.displayJobrequest = false;
        this.isCovenantDisabled = true;
        this.isChargesDisabled = true;
        this.isLoanInfoDisabled = true;
        this.isCommercialLoan = false;
        this.feeOverride = false;
        this.finishedSchedule = false;
        this.canBook = false;
        this.isIDF = false;
        this.isForeignExchangeLoan = false;
        this.isContingentLoan = false;
        this.exchangeRate = null;
        this.sellingRate = null;
        this.totalAddedBeneficiaryAmount = 0;
        this.isInEditMode = false;

        this.interestRateAmount = 0;
        this.isDicounted = false;
    }

    data: any = {};
    formatFeeValue() {
        this.data.beneficiaryAmount = this.beneficiaryForm.value.beneficiaryAmount;

        if (this.data.beneficiaryAmount == '') return;
        var realChar: string = this.data.beneficiaryAmount;
        var currVal: string = this.data.beneficiaryAmount.substr(-1);
        if(currVal === 'M' || currVal === 'm' || currVal === 't' || currVal === 'T' || currVal === 'k' || currVal === 'K' || currVal === 'b' || currVal === 'B'){
            realChar = realChar.substr(0, realChar.length - 1 );
        }
        else{
            realChar = realChar.substr(0, realChar.length );
        }
        currVal = currVal.substr(-1);

        if (currVal === 'M' || currVal == 'm') {
            let result: Number = Number(realChar) * 1000000;
            this.data.beneficiaryAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
            let result: Number = Number(realChar) * 1000;
            this.data.beneficiaryAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'b' || currVal === 'B') {
            let result: Number = Number(realChar) * 1000000000;
            this.data.beneficiaryAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else {
            let result: Number = Number(realChar);
            this.data.beneficiaryAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }
    }

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
                applicationRefNumber: this.OLApplicationReferenceNumber ,

            }

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            this.displayReport = true;
            return;
        }
    }

    resetGrid(yes) {
        if (yes){
            swal('Fintrak Credit 360','You have successfully routed to a modifier','success');
            this.getAvailedMultipleApplicationsForBooking();
            this.BackToLoanBookingGridList();
        }
        else swal('Fintrak Credit 360','Routing to modifier failed','error');
    }

    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.loanSelection.loanBookingRequestId;
        this.workflowTarget.operationId = this.loanSelection.operationId;
        this.enableReroute = true;
    }

    ReferToRM() { this.displayOperationRouteCommentForm = true;}
    openSearchBox(): void { this.displaySearchModal = true; }
    CallRequestClose() { this.displayJobrequest = false; }

    onOperationChange(operationId) {
        this.loadingSrv.show();
        this.camService.getOperationApprovalLevels(operationId).subscribe((response: any) => {
            this.approvalLevels = response.result;
            this.loadingSrv.hide(1000);
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    showRerouteForm() {
        this.errorMessage = '';
        this.displayCommentForm = true;
        if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    returnBackToRM() {
        const __this = this;
        const target = {
            operationId: this.loanSelection.operationId,
            targetId: this.loanSelection.loanApplicationDetailId,
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
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadData();
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

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            return;
        }
    }

    getApprovalTrailByOperationBooking(operationId, loanBookingRequestId) {
        this.loanBookingService.getApprovalTrailByOperationBooking(operationId, loanBookingRequestId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
            this.loadingSrv.hide();
        });
    }

    
    //HANDLING CLASSIFIED REFER-BACK
    //==============================================================================
    showReferBackForm() {
        this.referBackForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            
        });
         this.displayReferBackForm = true;
    }

    referBackResultControl(event) {
        if(event == true) {
            
            this.getAvailedMultipleApplicationsForBooking();
            this.displayReferBackForm = false;
            this.BackToLoanBookingGridList()
           // this.displayLoanToApproveModal = false;
        }
      }

    displayStatus(e) {
        if(e == true) {
            this.displayReferBackForm =false;
        }
    }

      //END OF CLASSIFIES REFER BACK
      //==============================================================================
      
}

