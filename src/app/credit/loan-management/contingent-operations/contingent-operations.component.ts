import { OnDestroy } from '@angular/core';
import { GlobalConfig, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { DateUtilService } from '../../../shared/services/dateutils';
import { CustomerService } from '../../../customer/services/customer.service';
import { CasaService } from '../../../customer/services/casa.service';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject ,  Subscription } from 'rxjs';
import { ProductService } from '../../../setup/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { HelperService } from 'app/shared/services/helpers.service';

@Component({
  selector: 'app-contingent-operations',
  templateUrl: './contingent-operations.component.html',
  styles: [`.ui-datepicker {top: -20px !important;}`]
})
export class ContingentOpreationComponent implements OnInit, OnDestroy {
  accountNumber: any;
  loanSystemTypeId: number;
  effectiveDate: Date;
  oldEffectiveDate: Date;
  termLoanId: number;
  principalValanceString: any;
  principalBalance: any = 0;
  irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
  scatterdPayments: any[] = [];
  data: any = {};
  loanScheduleDetails: any[];
  customerLoansData: any[];
  operationTypes: any[];
  filteredProducts: any[];
  convenatDetails: any[];// LoanCovenantModel[] = [];;
  guarantorDetails: any[];// GuarantorAppModel[] = [];
  chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
  frequencies: any[];
  searchTerm$ = new Subject<any>();
  searchAccountTerm$ = new Subject<any>();
  displaySearchModal: boolean = false;
  displayReviewModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayCASASearchModal: boolean = false;
  displayPaymentPlan: boolean = false;
  displayLoanSearch: boolean = true;
  displatBackToSearch: boolean = false;
  displayCasaDetails: boolean = false;
  searchResults: any[];
  casaSearchResults: any[];
  selectedTypeId: number = null;
  selectedLoanId: number = null;
  loanSelection: any;
  model: any;
  LoanReviewForm: FormGroup;
  entityName: string = "";
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  RegulatoryInterestRateChange: boolean = false;
  SubAllocationOverdraft: boolean = false;
  PrepaymentChange: boolean = false;
  PrincipalFrequencyChange: boolean = false;
  InterestFrequencyChange: boolean = false;
  InterestandPrincipalFrequencyChange: boolean = false;
  PaymentDateChange: boolean = false;
  TenorChange: boolean = false;
  Tenor: boolean = true;
  CASAAccountChange: boolean = false;
  Overdrafttopup: boolean = false;
  FeechargeChange: boolean = false;
  TerminateandRebook: boolean = false;
  CompleteWriteOff: boolean = false;
  CancelUndisbursedLoan: boolean = false;
  OverdraftTenorExtension: boolean = false;
  OverdraftRenewal: boolean = false;
  ContingentFlag: boolean = false;
  ContingentFlagRenewal: boolean = true;
  ContingentFlagTermination: boolean = false;
  ContingentFlagTenorExtension: boolean = false;
  ContingentFlagAmountReduction: boolean = false;
  ContingentFlagExt: boolean = false;
  maturityDate: Date;
  oldMaturityDate: Date;
  principalAmount: number = null;
  overDraft: number = null;
  interestRate: number = null;
  overDraftLoanData: any[];
  selectedOperationId: any;
  systemCurrentDate: any;
  customerId: number;
  accountSearch: any;
  lmsApplicationDetailId: number = 0;
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  approvedLoanOperationReviewData: any[];
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  bgTermination: boolean = false;
  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  //@ViewChild(DisbursedLoanDetailsComponent) disbursedLoanDetails: DisbursedLoanDetailsComponent;
  constructor(private fb: FormBuilder, private loadingService: LoadingService, private loanSrv: LoanService,
    private productService: ProductService, private loanOperationService: LoanOperationService,
    private router: Router, private casaService: CasaService, private customerService: CustomerService,
    private dateUtilService: DateUtilService,
    private helperService: HelperService ) {
    
this.subscriptions.add(this.loanOperationService.searchForOD(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      }));
  }

  ngOnInit() {
    this.getFrequencyTypes();
    this.GetAllProductTypes();
    this.GetOperationType();
    this.clearControl();
    this.getApprovedContingentApplication();
    const dateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
    //dateControl.valueChanges.debounceTime(1000).subscribe(value =>
    this.subscriptions.add(dateControl.valueChanges.subscribe(value =>
          this.compareDate()));

      }

  searchForGroupAccount(searchTerm) {
    this.subscriptions.add(this.casaService.searchGroupCASA(searchTerm, this.customerId)
      .subscribe(results => {
        this.casaSearchResults = results.result;
        ////console.log('search item', this.casaSearchResults);
      }));
  }

  calculateMaturityDate() {
    this.LoanReviewForm.controls["maturityDate"].setValue(null);
    let effectiveDateVal = this.LoanReviewForm.get("proposedEffectiveDate").value;
    if (effectiveDateVal == "") {
      swal(
        "FinTrak Credit 360",
        "System cannot calculate maturity date with empty effective date.",
        "error"
      );
    }
    let tenor = this.LoanReviewForm.get("tenor").value;
    if (tenor <= 0) {
      swal(
        "FinTrak Credit 360",
        "System cannot calculate maturity date with zero tenor.",
        "error"
      );
    }
    let effectiveDate = this.LoanReviewForm.get("proposedEffectiveDate").value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + tenor * 86400 * 1000);
    this.LoanReviewForm.controls["maturityDate"].setValue(maturityDate);
  }


  calculateTenor() {
    this.LoanReviewForm.controls["tenor"].setValue(null);
    let effectiveDate = this.LoanReviewForm.get(
      "proposedEffectiveDate"
    ).value;
    let maturityDate = this.LoanReviewForm.get("maturityDate").value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.LoanReviewForm.controls["maturityDate"].setValue(new Date(effectiveDate));
      //this.LoanReviewOperationForm.controls["maturityDate"].setValue(null);
      swal(
        "FinTrak Credit 360",
        "Effective date cannot be greater than expiry date.",
        "error"
      );
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.LoanReviewForm.controls["tenor"].setValue(tenor);
  }


  getApprovedContingentApplication() {
   this.subscriptions.add(this.loanOperationService.getApprovedContingentApplication()
      .subscribe(results => {
        this.overDraftLoanData = results.result;
        console.log('search item', this.searchResults);
      }));
  }

  getFrequencyTypes() {
    this.subscriptions.add(this.loanSrv.getFrequencyTypes()
      .subscribe((res) => {
        this.frequencies = res.result;
      }));
  }
  GetAllProductTypes() {
    
    this.subscriptions.add(this.productService.getAllProductTypes().subscribe((response: any) => {
      this.filteredProducts = response.result;
      ////console.log("Product Type", this.filteredProducts)
    }));
  }

  GetOperationType() {
    this.subscriptions.add(
    this.loanOperationService.getOperationTypeByContingent()
      .subscribe((results) => {
        this.operationTypes = results.result;
        this.operationTypes = this.operationTypes
        .filter
        (x =>
          x.operationTypeId != LMSOperationEnum.ContingentLiabilityRebook &&
          x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination //&&
         // x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
          //x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountAddition 
        );
      }));
  }

  GetOperationTypeByScheduleId(productTypeId, scheduleTypeId) {

    this.subscriptions.add(
    this.loanOperationService.getOperationTypeByScheduleId(productTypeId, scheduleTypeId)
      .subscribe((results) => {
        this.operationTypes = results.result;
      }));
  }
  GetLaonGuarantors(loanId) {
    // this.loanOperationService.getLoanGuarantors(loanId)
    //   .subscribe((results) => {
    //     this.guarantorDetails = results.result;
    //   });
  }
  GetLaonConvenant(loanId) {
    
  this.subscriptions.add(
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      }));
  }
  GetLaonChargeFee(loanId) {
    
    this.subscriptions.add(
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
      }));
  }
  GetLaonScheduleByLoanId(loanId) {
    this.subscriptions.add(
    this.loanOperationService.getLoanScheduleByLoanId(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;
      }));
  }
  getAccountStatus(id) {
    return this.casaService.getAccountStatus(id);
  }

  getOperation(id) {
    return this.casaService.getOperation(id);
  }

  getPostNoStatus(id) {
    return this.casaService.getPostNoStatus(id);
  }
  getCustomerSensitivityLevel(id) {
    return this.customerService.getCustomerSensitivityLevel(id);
  }
  hideAllControl() {
    this.RegulatoryInterestRateChange = false;
    this.SubAllocationOverdraft = false;
    this.PrepaymentChange = false;
    this.PrincipalFrequencyChange = false;
    this.InterestFrequencyChange = false;
    this.InterestandPrincipalFrequencyChange = false;
    this.PaymentDateChange = false;
    this.TenorChange = false;
    this.Tenor = false;
    this.CASAAccountChange = false;
    this.Overdrafttopup = false;
    this.FeechargeChange = false;
    this.TerminateandRebook = false;
    this.CompleteWriteOff = false;
    this.CancelUndisbursedLoan = false;
    this.checkBoxApplicable = false;
    this.OverdraftTenorExtension = false;
    this.OverdraftRenewal = false;
    this.ContingentFlag = false;
  }
  validateForm() {

    const approvalStatusIdControl = this.LoanReviewForm.get('validateDrawnLimit');
    approvalStatusIdControl.clearValidators();
    approvalStatusIdControl.updateValueAndValidity();
    const isManagementRateControl = this.LoanReviewForm.get('isManagementRate');
    isManagementRateControl.clearValidators();
    isManagementRateControl.updateValueAndValidity();
    const principalIdControl = this.LoanReviewForm.get('approvalStatusId');
    principalIdControl.clearValidators();
    principalIdControl.updateValueAndValidity();
    const cancelUndisbursedLoanControl = this.LoanReviewForm.get('cancelUndisbursedLoan');
    cancelUndisbursedLoanControl.clearValidators();
    cancelUndisbursedLoanControl.updateValueAndValidity();
    const completeWriteOffControl = this.LoanReviewForm.get('completeWriteOff');
    completeWriteOffControl.clearValidators();
    completeWriteOffControl.updateValueAndValidity();
    const terminationAndReBookControl = this.LoanReviewForm.get('terminationAndReBook');
    terminationAndReBookControl.clearValidators();
    terminationAndReBookControl.updateValueAndValidity();
    const fee_ChargesControl = this.LoanReviewForm.get('fee_Charges');
    fee_ChargesControl.clearValidators();
    fee_ChargesControl.updateValueAndValidity();
    const overDraftTopupControl = this.LoanReviewForm.get('overDraftTopup');
    overDraftTopupControl.clearValidators();
    overDraftTopupControl.updateValueAndValidity();
    const accountNumberControl = this.LoanReviewForm.get('accountNumber');
    accountNumberControl.clearValidators();
    accountNumberControl.updateValueAndValidity();
    const cASA_AccountIdControl = this.LoanReviewForm.get('cASA_AccountId');
    cASA_AccountIdControl.clearValidators();
    cASA_AccountIdControl.updateValueAndValidity();
    const tenorControl = this.LoanReviewForm.get('tenor');
    tenorControl.clearValidators();
    tenorControl.updateValueAndValidity();
    const interestFirstPaymentDateControl = this.LoanReviewForm.get('interestFirstPaymentDate');
    interestFirstPaymentDateControl.clearValidators();
    interestFirstPaymentDateControl.updateValueAndValidity();
    const principalFirstPaymentDateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
    principalFirstPaymentDateControl.clearValidators();
    principalFirstPaymentDateControl.updateValueAndValidity();
    const interestFrequencyTypeIdControl = this.LoanReviewForm.get('interestFrequencyTypeId');
    interestFrequencyTypeIdControl.clearValidators();
    interestFrequencyTypeIdControl.updateValueAndValidity();
    const principalFrequencyTypeIdControl = this.LoanReviewForm.get('principalFrequencyTypeId');
    principalFrequencyTypeIdControl.clearValidators();
    principalFrequencyTypeIdControl.updateValueAndValidity();
    const maturityDateControl = this.LoanReviewForm.get('maturityDate');
    maturityDateControl.clearValidators();
    maturityDateControl.updateValueAndValidity();
    const prepaymentControl = this.LoanReviewForm.get('prepayment');
    prepaymentControl.clearValidators();
    prepaymentControl.updateValueAndValidity();
    const interateRateControl = this.LoanReviewForm.get('interateRate');
    interateRateControl.clearValidators();
    interateRateControl.updateValueAndValidity();
    const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
    proposedEffectiveDateControl.clearValidators();
    proposedEffectiveDateControl.updateValueAndValidity();
    const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
    reviewDetailsControl.clearValidators();
    reviewDetailsControl.updateValueAndValidity();
    const operationTypeIdControl = this.LoanReviewForm.get('operationTypeId');
    operationTypeIdControl.clearValidators();
    operationTypeIdControl.updateValueAndValidity();
    const productTypeIdControl = this.LoanReviewForm.get('productTypeId');
    productTypeIdControl.clearValidators();
    productTypeIdControl.updateValueAndValidity();
    const loanIdControl = this.LoanReviewForm.get('loanId');
    loanIdControl.clearValidators();
    loanIdControl.updateValueAndValidity();
    const loanReviewOperationsIdControl = this.LoanReviewForm.get('loanReviewOperationsId');
    loanReviewOperationsIdControl.clearValidators();
    loanReviewOperationsIdControl.updateValueAndValidity();
    const legalContingentCodeControl = this.LoanReviewForm.get('legalContingentCode');
    legalContingentCodeControl.clearValidators();
    legalContingentCodeControl.updateValueAndValidity();

    ////console.log("isInvoiceBased",isInvoiceBased);
    // if (isInvoiceBased === true) {
    //     contractDateControl.setValidators(Validators.required);
    //     contractExpiryDateControl.setValidators(Validators.required);
    //     //principalIdControl.setValidators(Validators.required);
    //     invoiceCurrencyIdControl.setValidators(Validators.required);
    // } else {

    // }



  }
  OnOperationTypeChange(event) {
    ////console.log('operationTypeId',event);

    this.hideAllControl();
    this.clearControl();
    let operationTypeId = Number(event);
    this.bgTermination= false;
    //console.log(operationTypeId)

    // this.LoanReviewForm.controls['proposedEffectiveDate'].enable();
    this.LoanReviewForm.controls['operationTypeId'].setValue(operationTypeId);
    // this.LoanReviewForm.controls['loanId'].setValue(this.loanSelection.loanId);
    // this.LoanReviewForm.controls['productTypeId'].setValue(this.loanSelection.productTypeId);
    // this.LoanReviewForm.controls['interateRate'].setValue(this.interestRate);
    // this.LoanReviewForm.controls['maturityDate'].setValue(new Date(this.maturityDate));
    // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.systemCurrentDate));
    switch (operationTypeId) {

      case 20: {
        this.validateForm();
        this.SubAllocationOverdraft = true;
        this.displayCASASearchModal = true;
        const overDraftTopupControl = this.LoanReviewForm.get('overDraftTopup');
        overDraftTopupControl.setValidators(Validators.required);
        overDraftTopupControl.updateValueAndValidity();
        const accountNumberControl = this.LoanReviewForm.get('accountNumber');
        accountNumberControl.setValidators(Validators.required);
        accountNumberControl.updateValueAndValidity();
        const cASA_AccountIdControl = this.LoanReviewForm.get('cASA_AccountId');
        cASA_AccountIdControl.setValidators(Validators.required);
        cASA_AccountIdControl.updateValueAndValidity();
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        break;
      }

      case 28: {
        this.validateForm();
        this.Overdrafttopup = true;
        const overDraftTopupControl = this.LoanReviewForm.get('overDraftTopup');
        overDraftTopupControl.setValidators(Validators.required);
        overDraftTopupControl.updateValueAndValidity();
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        break;
      }
      case 52: {
        this.validateForm();
        this.OverdraftTenorExtension = true;
        const overDraftTopupControl = this.LoanReviewForm.get('overDraftTopup');
        overDraftTopupControl.setValidators(Validators.required);
        overDraftTopupControl.updateValueAndValidity();
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        //this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.systemCurrentDate));
        break;
      }
      case 53: {
        this.validateForm();
        let expireDate = new Date(this.maturityDate);
        var date = new Date(expireDate.getTime() + 1 * 86400 * 1000);
        this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(date);
        this.OverdraftRenewal = true;
        const overDraftTopupControl = this.LoanReviewForm.get('overDraftTopup');
        overDraftTopupControl.setValidators(Validators.required);
        overDraftTopupControl.updateValueAndValidity();
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        break;
      }
      case LMSOperationEnum.ContingentLiabilityRenewal: {
        this.validateForm();
        // let expireDate = new Date(this.maturityDate);
        // var date = new Date(expireDate.getTime() + 1 * 86400 * 1000);
        // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(date);
        this.ContingentFlagRenewal = true;
        this.ContingentFlagTermination = false;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = false;
        this.Tenor = true;

        const maturityDateControl = this.LoanReviewForm.get('maturityDate');
        maturityDateControl.setValidators(Validators.required);
        maturityDateControl.updateValueAndValidity();
        const tenorControl = this.LoanReviewForm.get('tenor');
        tenorControl.setValidators(Validators.required);
        tenorControl.updateValueAndValidity();
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        const legalContingentCodeControl = this.LoanReviewForm.get('legalContingentCode');
        legalContingentCodeControl.setValidators(Validators.required);
        legalContingentCodeControl.updateValueAndValidity();
        break;
      }
      case LMSOperationEnum.ContingentLiabilityTermination: {
        this.validateForm();
        // let expireDate = new Date(this.maturityDate);
        // var date = new Date(expireDate.getTime() + 1 * 86400 * 1000);
        // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(date);
        this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
          new Date(this.systemCurrentDate)
        );
        this.bgTermination= true;
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = true;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = false;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();

        break;
      }
      case LMSOperationEnum.ContingentLiabilityTenorExtension: {
        this.validateForm();
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = false;
        this.ContingentFlagTenorExtension = true;
        this.ContingentFlagAmountReduction = false;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const maturityDateControl = this.LoanReviewForm.get('maturityDate');
        maturityDateControl.setValidators(Validators.required);
        maturityDateControl.updateValueAndValidity();
        break;
      }
      case LMSOperationEnum.ContingentLiabilityAmountReduction: {
        this.validateForm();
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = false;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = true;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const prepaymentControl = this.LoanReviewForm.get('prepayment');
        prepaymentControl.setValidators(Validators.required);
        prepaymentControl.updateValueAndValidity();

        break;
      }
      case LMSOperationEnum.ContingentLiabilityAmountAddition: {
        this.validateForm();
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = false;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = true;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const prepaymentControl = this.LoanReviewForm.get('prepayment');
        prepaymentControl.setValidators(Validators.required);
        prepaymentControl.updateValueAndValidity();

        break;
      }
      default: {
        break;
      }
    }
  }
  getContingentByLoanId(revolvingLoanId) {
    this.loadingService.show();
    this.subscriptions.add(
    this.loanOperationService.getContingentByLoanId(revolvingLoanId)
      .subscribe(results => {
        this.loadingService.hide()
        this.loanSelection = results.result;
        if (this.loanSelection != undefined) {
          this.entityName = "Perform Contingent Review Operation For: " + this.loanSelection.customerName;
          this.termLoanId = this.loanSelection.loanId;
          this.maturityDate = this.loanSelection.maturityDate;
          this.effectiveDate = this.loanSelection.effectiveDate;
          this.principalAmount = this.loanSelection.principalAmount;
          this.overDraft = this.loanSelection.overDraft;
          this.interestRate = this.loanSelection.interestRate;
          this.customerId = this.loanSelection.customerId;

        }
      }));
  }
  takeFeeStatus: number;

  currencyId: number;
  applicationCollection: any[] = [];
  takeFees(event) { 
    this.applicationCollection = event; 
  //console.log("applicationCollection",this.applicationCollection);
  }



  onSelectedLoanChange(event): void {
    const row = event.data;
    this.loanSystemTypeId = row.loanSystemTypeId;
    this.termLoanId = row.loanId;
    this.customerId = row.customerId;
    this.currencyId = row.currencyId;
    this.oldEffectiveDate = row.effectiveDate;
    this.oldMaturityDate = row.maturityDate;
    ////console.log(' this.termLoanId value',  this.termLoanId);
    this.selectedOperationId = row.operationId;
    this.systemCurrentDate = row.systemCurrentDate;
    this.lmsApplicationDetailId = row.lmsApplicationDetailId;
    this.principalAmount = row.principalAmount;
    //this.getContingentByLoanId(row.loanId);
    this.getContingentLoanDetails(row.loanId)
    this.displayLoanSearch = false;
    this.displayCustomerLoanDetails = true;
    this.displatBackToSearch = true;
    this.selectedApplicationRefNumber = row.lmsApplicationReferenceNumber;
    this.selectedloanReviewApplicationId = row.loanReviewApplicationId;
    this.approvedLoanOperationReviewData = row.operationReview;
    if (this.approvedLoanOperationReviewData != null) {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
      this.displayRefered = true;
    }
    else {
      //this.loaddataForm(this.selectedLoanReview);
      this.displayRefered = false;

    }
  }
  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;

      this.data.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;
      this.subscriptions.add(
      this.loanSrv.getApprovalTrailByOperation(row.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
        this.approvalWorkflowData = res.result;
      }));
      this.OnOperationTypeChange(row.operationTypeId);
      this.operationTypes
        .filter
        (x =>
          x.operationTypeId == row.operationTypeId
        )

      this.LoanReviewForm.controls["operationTypeId"].setValue(
        row.operationTypeId
      );
      this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
        new Date(row.newEffectiveDate)

      );
      this.LoanReviewForm.controls["interestRate"].setValue(
        row.newInterateRate
      );
      this.LoanReviewForm.controls["maturityDate"].setValue(
        new Date(row.newMaturityDate)
      );
      this.LoanReviewForm.controls["accountNumber"].setValue(
        row.accountNumber
      );
      this.LoanReviewForm.controls["overDraftTopup"].setValue(
        row.overDraftTopup
      );
      this.LoanReviewForm.controls["reviewDetails"].setValue(
        row.reviewDetails
      );
      this.LoanReviewForm.controls["validateDrawnLimit"].setValue(
        false
      );
    }
  }
  clearControl() {
    this.LoanReviewForm = this.fb.group({
      loanReviewOperationsId: [0],
      loanId: [''],
      productTypeId: [''],
      operationTypeId: ['', Validators.required],
      reviewDetails: ['', Validators.required],
      proposedEffectiveDate: ['', Validators.required],
      interateRate: ['', Validators.required],
      prepayment: [0],
      maturityDate: ['', Validators.required],
      principalFrequencyTypeId: [''],
      interestFrequencyTypeId: [''],
      principalFirstPaymentDate: [''],
      interestFirstPaymentDate: [''],
      tenor: [''],
      cASA_AccountId: [''],
      accountNumber: [''],
      overDraftTopup: ['', Validators.required],
      fee_Charges: [''],
      terminationAndReBook: [''],
      completeWriteOff: [''],
      cancelUndisbursedLoan: [''],
      approvalStatusId: [''],
      isManagementRate: [''],
      validateDrawnLimit: [false],
      legalContingentCode:[''],
    });
    this.PrimaryDocumentForm = this.fb.group({
      primaryDocumentTitle: ['', Validators.required],
      primaryDocument: [''],
      isPrimaryDocument: [false, Validators.required],

});
  }

  backToLoanSearch() {
    // this.customerLoansData = [];
    this.loanSelection = [];
    this.displayLoanSearch = true;
    this.displatBackToSearch = false;
    this.displayCustomerLoanDetails = false;
  }
  showReviewForm(): void {
    this.clearControl();
    this.hideAllControl();
    if (this.loanSelection != undefined) {
      ////console.log('Operations', this.loanSelection);
      this.OnOperationTypeChange(this.selectedOperationId);
      // this.LoanReviewForm.controls['operationTypeId'].setValue(this.selectedOperationId);
      // this.LoanReviewForm.controls['loanId'].setValue(this.loanSelection.loanId);
      // this.LoanReviewForm.controls['productTypeId'].setValue(this.loanSelection.productTypeId);
      // this.LoanReviewForm.controls['interateRate'].setValue(this.interestRate);
      // this.LoanReviewForm.controls['maturityDate'].setValue(new Date(this.maturityDate));
      // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.effectiveDate));
    }
    this.displayReviewModal = true;
    this.isPrimaryLabel='Required';

  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }
  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  searchCASA(searchString) {
    this.searchAccountTerm$.next(searchString);
  }
  pickSearchedData(item) {
    this.customerLoansData = this.searchResults.filter(x => x.customerId == item.customerId);
    ////console.log('search item picked', item);
    this.displaySearchModal = false;
  }
  viewCasaDetails(index) {
    this.displayCasaDetails = true;
    this.model = this.casaSearchResults[index];
  }
  pickCASASearchedData(item) {
    this.LoanReviewForm.controls['accountNumber'].setValue(item.productAccountNumber);
    this.LoanReviewForm.controls['cASA_AccountId'].setValue(item.casaAccountId);
    ////console.log("CASA Account Id", item.casaAccountId)
    this.displayCASASearchModal = false;
  }
  documentTypeId:number;
  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  supportingDocuments: any[] = [];
  @ViewChild('fileInput', {static: false}) fileInput: any;

  submitLoanReviewForm(formObj) {
    // SubAllocationOverdraft 20
    // Overdrafttopup 28
    // OverdraftTenorExtension 52
    // OverdraftRenewal 53
    //console.log('uploadFileTitle', this.uploadFileTitle)

    // if (formObj.value.operationTypeId == 85) {

    //   if (new Date(formObj.value.proposedEffectiveDate) >= new Date(this.oldMaturityDate)) {
    //     swal('FinTrak Credit 360', 'Proposed Effective Date cannot be More than Approved Maturity Date', 'info');
    //     return
    //   }

    // }

    if (formObj.value.operationTypeId == 20) {
      if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount)) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility limit.', 'info');
        return
      }
      if (new Date(formObj.value.maturityDate) > new Date(this.maturityDate)) {
        swal('FinTrak Credit 360', 'Sub-Allocation expire date must not exceed the line limit expire date.', 'info');
        return
      }
      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }
    }
    if (formObj.value.operationTypeId == 28) {
      if (new Date(formObj.value.maturityDate) > new Date(this.maturityDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up expire date must not exceed the line limit expiry date.', 'info');
        return
      }
      if (new Date(this.maturityDate) < new Date(this.systemCurrentDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up operation cannot be performed on expired facility.', 'info');
        return
      }
      if (new Date(formObj.value.proposedEffectiveDate) < new Date(this.systemCurrentDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up operation start date cannot be back dated.', 'info');
        return
      }

      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }
    }
    if (formObj.value.operationTypeId == 52) {
      if (formObj.value.validateDrawnLimit == true) {
        if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount - this.overDraft)) {
          swal('FinTrak Credit 360', 'Overdraft tenor extension limit cannot be greater than drawn limit.', 'info');
          return
        }
      }

      if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount)) {
        swal('FinTrak Credit 360', 'Overdraft tenor extension limit cannot be greater than original limit.', 'info');
        return
      }

      if ((new Date(formObj.value.proposedEffectiveDate) < new Date(this.systemCurrentDate)) && (new Date(this.maturityDate) > new Date(this.systemCurrentDate))) {
        swal('FinTrak Credit 360', 'Overdraft tenor extention operation cannot be back dated on running facility.', 'info');
        return
      }

      if ((new Date(this.maturityDate) < new Date(this.systemCurrentDate)) && (this.convertDateDayToDays(this.maturityDate, 1) == (this.convertDateToDays(formObj.value.proposedEffectiveDate)))) {
        swal('FinTrak Credit 360', 'Overdraft tenor extention operation start date must be expired limit date plus one day.', 'info');
        return
      }

      if (formObj.value.overDraftTopup > this.principalAmount) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility Limit.', 'info');
        return
      }
      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }

    }
    if (formObj.value.operationTypeId == 53) {

      if (formObj.value.overDraftTopup > this.principalAmount) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility Limit.', 'info');
        return
      }
      ////console.log('Testing Testing 1', this.convertDateDayToDays(this.maturityDate, 1));
      ////console.log('Testing Testing 2', this.convertDateToDays(formObj.value.proposedEffectiveDate));
      if ((Number(this.convertDateDayToDays(this.maturityDate, 1)) != Number(this.convertDateToDays(formObj.value.proposedEffectiveDate)))) {
        swal('FinTrak Credit 360', 'Overdraft renewal operation start date must be expiring date plus one day.', 'info');
        return
      }
      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }

    }
    if (new Date(formObj.value.proposedEffectiveDate) > new Date(formObj.value.maturityDate)) {
      swal('FinTrak Credit 360', 'Effective date must not be greater than Maturity date.', 'info');
      return
    }
    if (formObj.value.operationTypeId == LMSOperationEnum.ContingentLiabilityTermination) {

      if (this.isPrimaryLabel=='Required') {
        swal('FinTrak Credit 360', 'Kindly Select a File to Upload', 'info');
        return
      }     
    }


    // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
    //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
    //   return
    // }
    //this.loadingService.show();
    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else{
      this.applicationCollection = [];
    }
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }

    let bodyObj = {
      loanReviewOperationsId: reviewId,
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      loanId: this.termLoanId,
      loanSystemTypeId: this.loanSystemTypeId,
      //loanId: formObj.value.loanId,
      productTypeId: formObj.value.productTypeId,
      operationTypeId: formObj.value.operationTypeId,
      reviewDetails: formObj.value.reviewDetails,
      proposedEffectiveDate:formObj.value.proposedEffectiveDate,// new Date(formObj.value.proposedEffectiveDate).toLocaleDateString(),
      interateRate: formObj.value.interateRate,
      prepayment: formObj.value.prepayment,
      maturityDate: formObj.value.maturityDate,//new Date(formObj.value.maturityDate).toLocaleDateString(),
      principalFrequencyTypeId: formObj.value.principalFrequencyTypeId,
      interestFrequencyTypeId: formObj.value.interestFrequencyTypeId,
      principalFirstPaymentDate: formObj.value.principalFirstPaymentDate,
      interestFirstPaymentDate: formObj.value.interestFirstPaymentDate,
      tenor: formObj.value.tenor,
      cASA_AccountId: formObj.value.cASA_AccountId,
      accountNumber: formObj.value.accountNumber,
      overDraftTopup: formObj.value.overDraftTopup,
      fee_Charges: formObj.value.fee_Charges,
      terminationAndReBook: formObj.value.terminationAndReBook,
      completeWriteOff: formObj.value.completeWriteOff,
      cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
      approvalStatusId: formObj.value.approvalStatusId,
      isManagementRate: formObj.value.isManagementRate,
      reviewIrregularSchedule: this.scatterdPayments,
      fees: this.applicationCollection,
      legalContingentCode: formObj.value.legalContingentCode,

      documentTitle: this.file ==undefined ? null: this.docTitle,
      fileName: this.file ==undefined ? undefined : this.file.name,
      fileExtension: this.file ==undefined ? null :this.helperService.fileExtention(this.file.name),
      file: this.file ==undefined ? undefined: this.file,
      isPrimaryDocument: this.file ==undefined ? null:true,
    }

    if (this.file != undefined) {
      let body = {
          formData: JSON.stringify(bodyObj),
          fileName: this.file.name,
          fileExtension: this.helperService.fileExtention(this.file.name),
      };
      //console.log(this.file);
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
        __this.subscriptions.add(
        __this.loanOperationService.addLoanContingent(bodyObj).subscribe((res) => {
          if (res.success == true) {
            //console.log("done1");

            __this.loanOperationService.addLoanContingentWithAttachment(__this.file, body).then((res: any) => {
              if (res.success == true) {
               // console.log("image pushed");
                __this.loadingService.hide();

                swal('FinTrak Credit 360', res.message, 'success');
                __this.displayReviewModal = false;

              }
            });
            __this.loadingService.hide();
           
          } else {
            swal('FinTrak Credit 360', res.message, 'error');
            __this.loadingService.hide();
          }
        }, (err: any) => {
          swal('FinTrak Credit 360', JSON.stringify(err), 'error');
          __this.loadingService.hide();
        }));
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
      });


    }else{
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
        __this.subscriptions.add(
        __this.loanOperationService.addLoanContingent(bodyObj).subscribe((res) => {
          if (res.success == true) {
            __this.loadingService.hide();
            swal('FinTrak Credit 360', res.message, 'success');
            __this.displayReviewModal = false;
          } else {
            swal('FinTrak Credit 360', res.message, 'error');
            __this.loadingService.hide();
          }
        }, (err: any) => {
          swal('FinTrak Credit 360', JSON.stringify(err), 'error');
          __this.loadingService.hide();
        }));
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
      });
    }


  }
  addToList() {
    if (Number(this.principalValanceString) - Number(this.data.amount.replace(/[,]+/g, "").trim()) < 0) {
      swal('FinTrak Credit 360', "Payment amount cannot be greater than principal amount", "error");
      return;
    }
    if (new Date(this.data.scateredDate) < new Date(this.loanSelection.effectiveDate)) {
      swal('FinTrak Credit 360', "Payment date cannot be less than effective date", "error");
      // this.data.scateredDate = null;
      return;
    }
    var pmts = {
      paymentDate: new Date(this.data.scateredDate),//this.dateUtilService.formatJsonDate(this.data.scateredDate),
      paymentAmount: this.data.amount
    };
    // this.irregularReviewCollection.push(pmts);
    this.scatterdPayments.push(pmts);
    this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount.replace(/[,]+/g, "").trim()));
    this.principalValanceString = this.principalBalance;
    this.data.scateredDate = "";
    this.data.amount = ""


  }
 
onFileChange(event) {
  this.files = event.target.files;
  this.file = this.files[0];

}

  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount.replace(/[,]+/g, "").trim()));
    this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.scatterdPayments.splice(indx, 1);

  }
  compareDate(): void {
    if (this.loanSelection.scheduleTypeId == 1) {
      const principalDateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
      const interestDateControl = this.LoanReviewForm.get('interestFirstPaymentDate');
      if (principalDateControl.pristine || interestDateControl.pristine) {
        ////console.log('It is working');
        return;
      }
      if (Number(principalDateControl.value) != Number(interestDateControl.value)) {
        ////console.log('It is working', Number(principalDateControl));
        ////console.log('It is working', Number(interestDateControl));
        swal('FinTrak Credit 360', 'Please ensure that First Principal date and First Interest Date are equal', 'error');
        return;
      }
    }
  }
  formatValue() {
    if (this.data.amount == '') return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'b' || currVal === 'B') {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else {
      let result: Number = Number(realChar);
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
  }
  convertDateToDays(date) {
    let expireDate = new Date(date);
    var days = Math.floor((expireDate.getTime()) / 86400 * 1000);
    return days;
  }
  convertDateDayToDays(date, day) {
    let expireDate = new Date(date);
    let expireDateDay = expireDate.getTime() + day * 86400 * 1000;
    var days = Math.floor(expireDateDay / 86400 * 1000);
    return days;
  }

  getContingentLoanDetails(loanId) {
    this.subscriptions.add(
    this.loanSrv.getContingentFacilityDetail(loanId).subscribe(response => {
      this.model = response.result;
      ////console.log('Model', this.model);

    }));

  }
  displayFileUpload: boolean = false;
  PrimaryDocumentForm: FormGroup;
  GetPrimaryDocument() {
    this.displayFileUpload = true;

}
docTitle:any;
isPrimary:boolean;
isPrimaryLabel:string='Required'
Uploaded:boolean=false;




AcceptImage()
{
    this.docTitle = this.PrimaryDocumentForm.get('primaryDocumentTitle').value;
    this.isPrimary = this.PrimaryDocumentForm.get('isPrimaryDocument').value;

    this.isPrimaryLabel = this.docTitle;
    this.Uploaded = true;
    this.displayFileUpload = false;

    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document uploaded successfully', 'success');
}
closePrimaryDocUpload() {
  this.displayFileUpload = false;
  swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document upload has failed', 'error');
}



}
