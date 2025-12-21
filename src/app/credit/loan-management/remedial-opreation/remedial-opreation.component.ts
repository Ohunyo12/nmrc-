import { Subscription ,  Subject } from 'rxjs';
import { AccreditedConsultantsService } from '../../../setup/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import { ConvertString, Operations, GlobalConfig, LMSOperationEnum } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { logging } from 'selenium-webdriver';
import { log } from 'util';

@Component({
    selector: 'app-remedial-opreation',
    templateUrl: './remedial-opreation.component.html',
})
export class RemedialOpreationComponent implements OnInit, OnDestroy {
    userInfo: any[];
    saleRecovery: boolean;
    displayLoanSales: boolean = false;
    approvedLoanReviewData: any[];
    principalAmount: number;
    displayScheduleModalForm: boolean;
    selectedId: number = null;
    displayAddModal: boolean = false;
    displayLoanReviewList: boolean = false;
    displaySearchModal: boolean = false;
    entityName: string = "Loan Prepayment";
    searchTerm$ = new Subject<any>();
    searchResults: any[];
    loanReferenceNumber: string;
    loanId: number;
    productTypeId: number;
    remedialOperationForm: FormGroup;
    prepayments: any[];
    recoveries: any[];
    casas: any[];
    agents: any[];
    loanPrepaymentData: any = {};
    maintainTenor: boolean;
    loanPrepayments: any[];
    displayData: boolean = false;
    displaySearch: boolean = false;
    displayMaturityDate: boolean = false;
    displayEffectiveDate: boolean = false;
    scheduleType: number;
    displayIrregularSchedule: boolean = false;
    displayRegularSchedule: boolean = false;
    emailResponse:any;
    data: any = {};
    principalValanceString: any;
    newPrincipalBalance: any;
    scatterdPayments: any[] = [];
    principalBalance: number;

    bodyObj: any = {};
    schedules: any[];
    scheduleHeader: any = {};
    maturityDate: any;
    generateData: any = {};
    operationTypes: any[];
    show: boolean = false; message: any; title: any; cssClass: any;

    salesAgents: any[];
    paymentModeLabel: string = "Account Number";
    accountNameLabel: string = "Account Name";
    accountName: string;
    paymentMode: any[];
    systemCurrentDate: any;
    lmsApplicationDetailId: number = 0;
    private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanPrepaymentService: LoanPrepaymentService,
        private loanOperationService: LoanOperationService,
        private dateUtilService: DateUtilService,
        private accreditedConsultantsService: AccreditedConsultantsService
    ) {

    }

    ngOnInit() {
        this.displaySearch = true;
        this.clearControls();
        
        this.getApprovedLoanReviewRemedial();
      
        this.GetAllSalesAgent();
    }
    showAddModal() {
        this.clearControls();
        this.entityName = "Loan Prepayment";
        this.displayAddModal = true;
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    searchDB(searchString) {
        this.searchTerm$.next(searchString);
    }

    GetOperationType() {
        this.subscriptions.add(
        this.loanOperationService.getRemedialOperationType()
            .subscribe((results) => {
                this.operationTypes = results.result;
                // if(this.approvedLoanReviewData[0].userActivity=="loan-sale-user")     
                // {
                //     this.operationTypes = this.operationTypes
                //     .filter
                //     (x =>
                //       x.operationTypeId == 58
                //     );
                //     this.saleRecovery = true;
                // } else{
                    this.operationTypes = this.operationTypes
                    .filter
                    (x =>
                      x.operationTypeId == LMSOperationEnum.LoanRecovery
                    );
                //     this.saleRecovery = false;
                // }
            }));
    }
    GetAllSalesAgent() {
        this.subscriptions.add(
        this.accreditedConsultantsService.getSolicitors(4)//Recovery Agent
            .subscribe((results) => {
                this.salesAgents = results.result;
                
            }));
    }

    getApprovedLoanReviewRemedial() {
        this.loadingService.show();
        this.subscriptions.add(
        this.loanOperationService.getApprovedLoanReviewRemedial()
            .subscribe(results => {
                this.approvedLoanReviewData = results.result;
                this.GetOperationType();
                this.loadingService.hide();
            }));
    }
    getPaymentMode() {
        let modes = [{ "id": 1, "name": "Acoount Number" },
        { "id": 2, "name": "General Ledger" }
        ]
        return modes;
    }
    getRunningLoan(refNo) {
        this.loadingService.show();
        this.subscriptions.add(
        this.loanPrepaymentService.getWriteOffLoan(refNo)
        .subscribe((response: any) => {
            this.loadingService.hide()
            if (response.success== true){
                this.loanPrepaymentData = response.result;
                
                if (this.loanPrepaymentData != null) {
                    const row = this.loanPrepaymentData;
                    this.generateData = row;
                    this.systemCurrentDate = row.systemCurrentDate;
                    this.remedialOperationForm = this.fb.group({
                        loanReferenceNumber: [row.loanReferenceNumber],
                        writtenOffAccruedAmount: [ConvertString.ToNumberFormate(row.writtenOffAccruedAmount)],
                        writtenOffAmount: [ConvertString.ToNumberFormate(row.writtenOffAmount)],
                        outstandingPrincipal: [ConvertString.ToNumberFormate(row.outstandingPrincipal)],
                        interestRate: [row.interestRate],
                        equityContribution: [row.equityContribution],
                        //effectiveDate: [new Date(row.effectiveDate)],
                        maintainTenor: true,
                        maturityDate: [new Date(row.maturityDate)],
                        //accrualedAmount: [ConvertString.ToNumberFormate(row.accrualedAmount)],
                        //scheduleTypeId: [row.scheduleTypeId],
                        scheduleTypeId: 5,
                        //newtenor: [row.newtenor],
                        //teno: [row.teno],
                        scheduleTypeCategoryId: [row.scheduleTypeCategoryId],
                        totalAmount: [ConvertString.ToNumberFormate(row.totalAmount)],
                        //previousEffectiveDate: [new Date(row.previousEffectiveDate)],
                        //pastDueTotal: [ConvertString.ToNumberFormate(row.pastDueTotal)],
                        currency: [row.currency],
                        operationTypeId: [0, Validators.required],
                        accountNumber: [''],
                        cASA_AccountId: [''],
                        paymentModeId: [''],
                        salesAgentId: [''],
                       
                    });
                    this.remedialOperationForm.controls['previousEffectiveDate'].disable();
                    this.principalValanceString = row.totalAmount;
                    this.calculateTenor();
                    this.paymentMode = this.getPaymentMode();
                }
            } else {
                this.showMessage(response.message, "error", "FintrakBanking");
            }
        }));
    }
    //this.lmsApplicationDetailId = this.loanSelection.lmsApplicationDetailId;
    onSelectedLoanChange(event) {
        this.displayData = true;
        const item = event.data
        this.loanReferenceNumber = item.loanReferenceNumber;
        this.lmsApplicationDetailId = item.lmsApplicationDetailId;
        this.loanId = item.loanId;
        this.productTypeId = item.productTypeId;
        this.displaySearch = false;
        this.displaySearchModal = false;
        this.displayIrregularSchedule = false;
        this.displayRegularSchedule = false;
        this.scatterdPayments = [];
        this.getRunningLoan(item.loanReferenceNumber);
    }


    submitForm(formObj) {
        // if (new Date(this.remedialOperationForm.get('effectiveDate').value) < new Date(this.remedialOperationForm.get('previousEffectiveDate').value)) {
        //     swal('FinTrak Credit 360', "New Effective Date cannot be less than Previous Effective date", "error");
        //     return;
        // }
        this.loadingService.show();
        let bodyObj = {
            loanReviewOperationsId: null,
            loanId: this.loanId,
            lmsApplicationDetailId: this.lmsApplicationDetailId,
            productTypeId: this.productTypeId,
            operationTypeId: formObj.value.operationTypeId,
            reviewDetails: "Remedial Operation",
            //proposedEffectiveDate: formObj.value.effectiveDate,
            proposedEffectiveDate: this.systemCurrentDate,
            interateRate: formObj.value.interestRate,
            prepayment: formObj.value.equityContribution,
            //maturityDate: formObj.value.maturityDate,
            maturityDate: null,
            //principalFrequencyTypeId: formObj.value.salesAgentId,
            principalFrequencyTypeId: null,
            interestFrequencyTypeId: null,
            principalFirstPaymentDate: null,
            interestFirstPaymentDate: null,
            //tenor: formObj.value.newtenor,
            tenor: null,
            //overDraftTopup: this.newPrincipalBalance,
            overDraftTopup: this.newPrincipalBalance,
            accountNumber: formObj.value.accountNumber,
            cASA_AccountId: formObj.value.paymentModeId,
            reviewIrregularSchedule: this.scatterdPayments
        }
        ////console.log('Pass', bodyObj);
        if (this.selectedId === null) {
            this.subscriptions.add(
            this.loanPrepaymentService.save(bodyObj).subscribe((res) => {
                if (res.success == true) {
                    this.scatterdPayments = [];
                    this.finishGood(res.message);
                    this.displayMaturityDate = false;
                    this.displayEffectiveDate = true;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            }));
        }
    }


    keepTenor(evt) {
        let body = {
            maintainTenor: evt,

        };
        if (evt === true) {
            this.displayMaturityDate = false;
            this.displayEffectiveDate = true;
        }
        else {
            this.displayMaturityDate = true;
            this.displayEffectiveDate = true;
        }

    }
    clearControls() {
        this.selectedId = null;
        try {
            this.remedialOperationForm.controls['loanReferenceNumber'].setValue(null);
        } catch (error) {
            ////console.log('The system resolved a form-control error');
        }
        this.remedialOperationForm = this.fb.group({
            writtenOffAccruedAmount:['', Validators.required],
            //approvedAmount: ['', Validators.required],
            loanReferenceNumber: ['', Validators.required],
            outstandingPrincipal: ['', Validators.required],
            interestRate: ['', Validators.required],
            equityContribution: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            accrualedAmount: ['', Validators.required],
            scheduleTypeId: ['', Validators.required],
            teno: [''],
            newtenor: ['', Validators.required],
            scheduleTypeCategoryId: [0],
            totalAmount: [0],
            previousEffectiveDate: [''],
            maintainTenor: [true],
            currency: [''],
            pastDueTotal: [0],
            operationTypeId: ['', Validators.required],
            accountNumber: [''],
            cASA_AccountId: [''],
            paymentModeId: [''],
            salesAgentId: [''],
            writtenOffAmount:['']
        });
    }

    calculateMaturityDate() {
        this.remedialOperationForm.controls['maturityDate'].setValue(null);
        let newTenor = this.remedialOperationForm.get('newtenor').value;
        if (newTenor <= 0) {
            this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
        }
        let effectiveDate = this.remedialOperationForm.get('effectiveDate').value;
        let ret = new Date(effectiveDate);
        var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
        this.remedialOperationForm.controls['maturityDate'].setValue(maturityDate);
    }
    calculateTenor() {
        this.remedialOperationForm.controls['newtenor'].setValue(null);
        let effectiveDate = this.remedialOperationForm.get('effectiveDate').value;
        let maturityDate = this.remedialOperationForm.get('maturityDate').value;
        if (new Date(effectiveDate) > new Date(maturityDate)) {
            this.showMessage("Effective Date cannot be greater than Maturity Date.", "error", "FintrakBanking");
            return;
        }
        var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
        this.remedialOperationForm.controls['newtenor'].setValue(tenor);
    }
    calculateBalance(event) {
        ////console.log("e no dey fire", event);

        // let totalAmount = this.generateData.totalAmount//this.remedialOperationForm.get('totalAmount').value;
        // this.newPrincipalBalance = (Number(totalAmount) - Number(event.replace(/[,]+/g, "").trim()));
        // this.principalAmount = parseFloat(Number(this.newPrincipalBalance).toFixed(2));
        // this.principalValanceString = parseFloat(Number(this.newPrincipalBalance).toFixed(2)); //this.toDec(this.newPrincipalBalance, 2); //this.newPrincipalBalance;
        

        let totalAmount = this.generateData.totalAmount//this.remedialOperationForm.get('totalAmount').value;
        this.newPrincipalBalance = (Number(totalAmount) - Number(event.replace(/[,]+/g, "").trim()));
        //this.principalAmount = parseFloat(Number(this.newPrincipalBalance).toFixed(2));
        this.principalAmount = parseFloat(Number(event.replace(/[,]+/g, "").trim()).toFixed(2));
        //this.principalValanceString = parseFloat(Number(this.newPrincipalBalance).toFixed(2)); //thi
        this.principalValanceString = parseFloat(Number(event.replace(/[,]+/g, "").trim()).toFixed(2)); //thi

        if (Number(this.remedialOperationForm.controls['equityContribution'].value) > Number(this.remedialOperationForm.controls['totalAmount'].value)) {
            this.showMessage("Amount to recover cannot be greater than Total Amount", "error", "FintrakBanking");
            this.remedialOperationForm.controls['equityContribution'].setValue(0);
            return;
        }

        if (Number(this.principalValanceString) < 0) {
            this.showMessage("Payment Amount cannot be greater than Total Amount", "error", "FintrakBanking");
            this.remedialOperationForm.controls['equityContribution'].setValue(0);
            return;
        }
        //this.remedialOperationForm.controls['equityContribution'].setValue(ConvertString.ToNumberFormate(event));
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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
    backToSearch() {
        this.displaySearch = true;
        this.displayData = false;
    }

    addToList() {

        // //console.log(this.data.scateredDate);
        // //console.log(this.data.amount);
        // //console.log("Clicked!");

        if ((Number(this.principalValanceString) - Number(this.data.amount)) < 0) {
            swal('FinTrak Credit 360', "Payment amount cannot be greater than outstanding balance", "error");
            return;
        }
        // if (new Date(this.data.scateredDate) < new Date(this.remedialOperationForm.get('effectiveDate').value)) {
        //     swal('FinTrak Credit 360', "Payment date cannot be less than effective date", "error");
        //     return;
        // }

        var pmts = {
            paymentDate: new Date(this.data.scateredDate),//this.dateUtilService.formatJsonDate(this.data.scateredDate),
            paymentAmount: this.data.amount
        };
        // this.irregularReviewCollection.push(pmts);
        this.scatterdPayments.push(pmts);
        // this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount));
        // this.principalValanceString = parseFloat(Number(this.principalBalance).toFixed(2));;
        this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount));
        this.principalValanceString = parseFloat(Number(this.principalBalance).toFixed(2));
        this.data.scateredDate = null;
        this.data.amount = null


    }

    removeItem(evt, indx) {
        evt.preventDefault();
        let currRecord = this.scatterdPayments[indx];
        this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount));
        this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
        this.scatterdPayments.splice(indx, 1);
    }
    OnOperationTypeChange(event) {

        switch (Number(event)) {
            case 31: {
                this.displayIrregularSchedule = false;
                this.displayLoanSales = false;
                break;
            }
            case 58: {
                this.displayLoanSales = true;
                this.displayIrregularSchedule = false;
                break;
            }
            case 64: {
                this.newPrincipalBalance = this.generateData.totalAmount;
                this.displayIrregularSchedule = true;
                this.displayLoanSales = false;
                break;
            }
        }
    }
    generateIrregularSchedule() {
        this.loadingService.show();
        var payments = [];
        this.scatterdPayments.forEach((v) => {
            payments.push({
                paymentDate: v.paymentDate,
                paymentAmount: v.paymentAmount
            });
        })

        if (Number(this.principalValanceString) > 0 || Number(this.principalValanceString) < 0) {
            this.showMessage("Payment amount must be equal to principal amount", "error", "FintrakBanking");
            return;
        }
        this.bodyObj = {
            scheduleMethodId: 5,//this.generateData.scheduleTypeId,
            //principalAmount: this.newPrincipalBalance,
            principalAmount: this.principalAmount,
            //effectiveDate: this.remedialOperationForm.get('effectiveDate').value,
            effectiveDate: this.systemCurrentDate,
            //interestRate: this.generateData.interestRate,
            interestRate: 0,
            accrualBasis: this.generateData.accrualBasis,
            //integralFeeAmount: this.generateData.integralFeeAmount,
            integralFeeAmount: 0,
            irregularPaymentSchedule: payments
        };

        ////console.log('this.data', this.bodyObj);
        this.subscriptions.add(
        this.loanPrepaymentService.generatePeriodicSchedule(this.bodyObj)
            .subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {

                    if (res.result.length) {
                        var details = {
                            principalAmount: this.principalAmount,
                            //interestRate: this.generateData.interestRate,
                            interestRate: 0,
                            //effectiveDate: this.remedialOperationForm.get('effectiveDate').value,
                            effectiveDate: this.systemCurrentDate,
                            maturityDate: '',
                            effectiveInterestRate: 0,
                            schedules: res.result
                        }

                        this.schedules = details.schedules;
                        this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
                        details.maturityDate = this.maturityDate;
                        details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
                        this.scheduleHeader = details;

                        this.displayScheduleModalForm = true;

                        this.loadingService.hide();
                    }
                } else {
                    this.showMessage(res.message, "error", "FintrakBanking");
                }

            }, (err) => {
                this.showMessage(err || "An unknown error has occured", "error", "FintrakBanking");
            }));
    }
    OnPaymentModeChange(indx) {
        if (indx == 1) {
            this.paymentModeLabel = "Account Number";
            this.accountNameLabel = "Account Name";
        } else {
            this.paymentModeLabel = "GL Number";
            this.accountNameLabel = "GL Name";
        }
    }
    searchForAccount() {
        this.loadingService.show();
        this.accountName = null;
        let accountNo = this.remedialOperationForm.get('accountNumber').value;
        let paymentMode = this.remedialOperationForm.get('paymentModeId').value;

       // console.log('paymentMode',paymentMode)
        if (paymentMode == 1) {
            this.subscriptions.add(
            this.loanPrepaymentService.getAccountOwner(accountNo)
                .subscribe(results => {
                    this.accountName = results.result;
                    this.remedialOperationForm.get('cASA_AccountId').setValue(this.accountName)
                }));
        } else if (paymentMode == 2) {
            this.subscriptions.add(
            this.loanPrepaymentService.getGLNameByGLCode(accountNo)
                .subscribe(results => {
                    this.accountName = results.result;
                    this.remedialOperationForm.get('cASA_AccountId').setValue(this.accountName)
                }));
        }

        this.loadingService.hide();
    }
    sendEmail(consultantId){

            let __this=this;

        swal({
            title: 'Are you sure?',
            text: 'Are you sure you want to send an email for recovery to the selected consultant?',
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
            this.subscriptions.add(
            __this.loanOperationService.SendEmailForRecovery(consultantId)
            .subscribe(results => {
                __this.emailResponse = results.result;

                if(__this.emailResponse==true)
                {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Email Sent Successfully', 'success');
                }else{
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Email Sending has failed', 'error');
                }
            }));
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

        
    }
}
