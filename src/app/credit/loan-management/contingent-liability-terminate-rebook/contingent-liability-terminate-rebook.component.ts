import { OnDestroy } from '@angular/core';
import { ConvertString, GlobalConfig, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { LoanPrepaymentService, LoanApplicationService, CreditAppraisalService } from 'app/credit/services';
import { HelperService } from 'app/shared/services/helpers.service';

@Component({
  selector: 'contingent-liability-terminate-rebook',
  templateUrl: './contingent-liability-terminate-rebook.component.html',
  styles: [`.ui-datepicker {top: -20px !important;}`]
})
export class ContingentLiabilityTreminateRebookComponent implements OnInit, OnDestroy {
  totalAmount: any;
  principalAmount: number;
  displayScheduleModalForm: boolean;
  selectedId: number = null;
  displayAddModal: boolean = false;
  displaySearchModal: boolean = false;
  entityName: string = "Contingent Liability Rebook";
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  productTypeId: number;
  lmsApplicationDetailId: number;
  loanPrepaymentForm: FormGroup;
  prepayments: any[];
  recoveries: any[];
  originalForm3800bSrc: any = {};
  casas: any[];
  agents: any[];
  lmsApplicationReferenceNumber: any;
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
  loanSystemTypeId: number;
  data: any = {};
  principalValanceString: any;
  newPrincipalBalance: any;
  scatterdPayments: any[] = [];
  principalBalance: number;

  loanReviewApplicationId: any;
  loanReviewOperationId: any;

  bodyObj: any = {};
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  generateData: any = {};
  displayLoanDetailsModal: boolean;
  termLoanId: number = 0;
  readonly OPERATION_ID: number = 46;
  show: boolean = false; message: any; title: any; cssClass: any;



  creditAppraisalOperationId: any;
  creditAppraisalLoanApplicationId: any;
  loanApplicationId: any;
  operationId: any;

  accountNumber: any;
  effectiveDate: Date;
  oldEffectiveDate: Date;

  irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
  loanScheduleDetails: any[];
  customerLoansData: any[];
  operationTypes: any[];
  filteredProducts: any[];
  convenatDetails: any[];// LoanCovenantModel[] = [];;
  guarantorDetails: any[];// GuarantorAppModel[] = [];
  chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
  frequencies: any[];
  searchAccountTerm$ = new Subject<any>();
  displayReviewModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayCASASearchModal: boolean = false;
  displayPaymentPlan: boolean = false;
  displayLoanSearch: boolean = true;
  displatBackToSearch: boolean = false;
  displayCasaDetails: boolean = false;
  casaSearchResults: any[];
  selectedTypeId: number = null;
  selectedLoanId: number = null;
  loanSelection: any;
  model: any;
  LoanReviewForm: FormGroup;
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
  ContingentIsFlagRebook: boolean = false;
  ContingentIsFlagAmountReduction: boolean = false;
  ContingentFlagTermination: boolean = false;
  ContingentFlagTenorExtension: boolean = false;
  ContingentFlagAmountReduction: boolean = false;
  ContingentFlagExt: boolean = false;
  oldMaturityDate: Date;
  overDraft: number = null;
  interestRate: number = null;
  overDraftLoanData: any[];
  selectedOperationId: any;
  systemCurrentDate: any;
  customerId: number;
  accountSearch: any;
  selectedLoanReview: any = {};
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  appraisalOperationName: any;
  approvedLoanOperationReviewData: any[];
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  bgTermination: boolean = false;
  contingentLoanData: any[];
  takeFeeStatus: number;

  currencyId: number;
  applicationCollection: any[] = [];

  displayDocumentation: boolean = false;
  documentations: any[] = [];

  searchString: string;
  searchForm: FormGroup;
  displaySearchForm: boolean = false;


  private subscriptions = new Subscription();
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loanService: LoanService,
    private loanApplService: LoanApplicationService,
    private camService: CreditAppraisalService,
    private helperService: HelperService) {
    this.subscriptions.add(this.loanOperationService.searchForLoanContingent(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;

      }));
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
    this.GetOperationType();
    this.getApprovedContingentApplication();

  }
  showAddModal() {
    this.clearControls();
    this.entityName = "Contingent Liability Rebook";
    this.displayAddModal = true;
  }

  getApprovedContingentApplication() {
    this.loadingService.show();
    this.subscriptions.add(this.loanOperationService.getApprovedContingentApplication()
      .subscribe(results => {
        this.contingentLoanData = results.result;
        this.loadingService.hide();
        //console.log('search item', this.searchResults);
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  GetOperationType() {
    this.subscriptions.add(this.loanOperationService.getOperationTypeByContingent()
      .subscribe((results) => {
        this.operationTypes = results.result;

        this.operationTypes = this.operationTypes
          .filter
          (x =>
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal //&&
            // x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension 
          );
      }));
  }
  GetOperationTypeByScheduleId(productTypeId, scheduleTypeId) {
    this.loanOperationService.getOperationTypeByScheduleId(productTypeId, scheduleTypeId)
      .subscribe((results) => {
        this.operationTypes = results.result;
      });
  }

  loaddataFormOperationReview2(loanReviewOperationId, loanReviewApplicationId) {
    this.subscriptions.add(this.loanService.getApprovalTrailByOperation(loanReviewOperationId, loanReviewApplicationId).subscribe((res) => {
      this.approvalWorkflowData = res.result;
    }));

  }

  loaddataFormOperationReview(data) {
    const row = data;
    this.data.operationTypeId = row.operationTypeId;
    this.selectedLoanReviewId = row.loanReviewOperationsId;
    this.OnOperationTypeChange(row.operationTypeId);
    this.operationTypes
      .filter
      (x =>
        x.operationTypeId == row.operationTypeId
      )
    // console.log(row);
    this.LoanReviewForm.controls["operationTypeId"].setValue(
      row.operationTypeId
    );
    this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
      new Date(row.newEffectiveDate != null ? row.newEffectiveDate : null)

    );
    // this.LoanReviewForm.controls["interestRate"].setValue(
    //   row.newInterateRate != null ? row.newInterateRate : null
    // );
    this.LoanReviewForm.controls["maturityDate"].setValue(
      new Date(row.newMaturityDate != null ? row.newMaturityDate : null)
    );
    this.LoanReviewForm.controls["accountNumber"].setValue(
      row.accountNumber != null ? row.accountNumber : null
    );
    this.LoanReviewForm.controls["overDraftTopup"].setValue(
      row.overDraftTopup != null ? row.overDraftTopup : null
    );
    this.LoanReviewForm.controls["reviewDetails"].setValue(
      row.reviewDetails != null ? row.reviewDetails : null
    );
    this.LoanReviewForm.controls["validateDrawnLimit"].setValue(
      false
    );
    //}
  }


  loanDetails() {
    this.termLoanId = this.loanPrepaymentData.loanId;
    this.loanSystemTypeId = this.loanPrepaymentData.loanSystemTypeId;
    this.displayLoanDetailsModal = true;
    // console.log("loanPrepaymentData => ", this.loanPrepaymentData);
  }
  getContingentByLoanId(revolvingLoanId) {
    this.loadingService.show()
    this.subscriptions.add(this.loanOperationService.getContingentByLoanId(revolvingLoanId)
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

  lmsLoanApplicationId: any
  lmsOperationId: any;
  onSelectedLoanChange(event): void {
    const row = event;
    this.loanSystemTypeId = row.loanSystemTypeId;
    this.termLoanId = row.loanId;
    this.customerId = row.customerId;
    this.currencyId = row.currencyId;
    this.selectedLoanReview = row;
    this.lmsApplicationReferenceNumber = row.lmsApplicationReferenceNumber;

    this.lmsLoanApplicationId = row.lmsLoanApplicationId;
    this.lmsOperationId = row.lmsOperationId;
    // this.oldEffectiveDate = row.effectiveDate;
    // this.oldMaturityDate = row.maturityDate;
    ////console.log(' this.termLoanId value',  this.termLoanId);
    this.selectedOperationId = row.operationId;
    this.systemCurrentDate = row.systemCurrentDate;
    this.lmsApplicationDetailId = row.lmsApplicationDetailId;
    //this.loaddataFormOperationReview2(row.loanReviewOperationId,row.loanReviewApplicationId);
    this.getContingentByLoanId(row.loanId);
    this.getContingentLoanDetails(row.loanId)

    this.displayLoanSearch = false;
    this.displayCustomerLoanDetails = true;
    this.displatBackToSearch = true;

    this.appraisalOperationName = row.appraisalOperationName;
    this.creditAppraisalOperationId = row.creditAppraisalOperationId;
    this.creditAppraisalLoanApplicationId = row.creditAppraisalLoanApplicationId;
    this.loanApplicationId = row.creditAppraisalLoanApplicationId;
    this.operationId = row.creditAppraisalOperationId;

    this.loanReviewApplicationId = row.loanReviewApplicationId;
    this.loanReviewOperationId = row.loanReviewOperationId;
    this.selectedApplicationRefNumber = row.lmsApplicationReferenceNumber;
    this.selectedloanReviewApplicationId = row.loanReviewApplicationId;
    this.approvedLoanOperationReviewData = row.operationReview;
    if (this.approvedLoanOperationReviewData != null) {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
    }
    this.displayData = true;
    this.displaySearch = false;
    this.displaySearchModal = false;
    this.displayIrregularSchedule = false;
    this.displayRegularSchedule = false;
  }

  // loaddataFormOperationReview(data) {
  //   if (data != undefined) {
  //     const row = data;

  //     this.data.operationTypeId = row.operationTypeId;
  //     this.selectedLoanReviewId = row.loanReviewOperationsId;
  //     this.loanService.getApprovalTrailByOperation(row.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
  //       this.approvalWorkflowData = res.result;
  //     });

  //     this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
  //       new Date(row.newEffectiveDate)

  //     );

  //     this.LoanReviewForm.controls["maturityDate"].setValue(
  //       new Date(row.newMaturityDate)
  //     );

  //     this.LoanReviewForm.controls["reviewDetails"].setValue(
  //       row.reviewDetails
  //     );

  //   }
  // }



  takeFees(event) {
    this.applicationCollection = event;
  }

  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
  }
  previewDocumentation(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
        this.documentations = response.result;
        ////console.log('getDocumentation -> ', response);
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  previewDocumentationLos(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId).subscribe((response: any) => {
        this.documentations = response.result;
        ////console.log('getDocumentation -> ', response);
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }
  pickSearchedData(item) {
    // //console.log("selected ---- ", item);
    this.displayData = true;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.loanId = item.loanId;
    this.productTypeId = item.productTypeId;
    this.lmsApplicationDetailId = item.lmsApplicationDetailId;
    this.displaySearch = false;
    this.displaySearchModal = false;
    this.displayIrregularSchedule = false;
    this.displayRegularSchedule = false;
    this.scatterdPayments = [];
    this.getContingentLoanDetails(this.loanId);

  }

  getContingentLoanDetails(loanId) {

    this.subscriptions.add(this.loanService.getContingentFacilityDetail(loanId).subscribe(response => {
      this.loanPrepaymentData = response.result;
      if (response.success == true) {
        this.loanPrepaymentData = response.result;
      } else {
        this.showMessage(response.message, "error", "FintrakBanking");
      }
    }));

  }
  showReviewForm(): void {
    this.clearControls();
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
    this.uploadFileTitle = null;
    this.isPrimaryLabel = 'Required';
    this.takeFeeStatus = 0;
    this.applicationCollection = [];

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
    const rebookAmountControl = this.LoanReviewForm.get('rebookAmount');
    rebookAmountControl.clearValidators();
    rebookAmountControl.updateValueAndValidity();

    ////console.log("isInvoiceBased",isInvoiceBased);
    // if (isInvoiceBased === true) {
    //     contractDateControl.setValidators(Validators.required);
    //     contractExpiryDateControl.setValidators(Validators.required);
    //     //principalIdControl.setValidators(Validators.required);
    //     invoiceCurrencyIdControl.setValidators(Validators.required);
    // } else {

    // }
    this.file = undefined;
    this.isPrimaryLabel = 'Required';

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
    this.ContingentIsFlagAmountReduction = false;
    this.ContingentIsFlagRebook = false;
  }
  OnOperationTypeChange(event) {
    ////console.log('operationTypeId',event);

    this.hideAllControl();
    this.clearControls();
    let operationTypeId = Number(event);
    this.bgTermination = false;
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
        this.ContingentIsFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
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
        this.ContingentIsFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
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
        this.ContingentIsFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
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
        this.ContingentIsFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
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
        this.ContingentIsFlagRebook = false;
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
        const rebookAmountControl = this.LoanReviewForm.get('rebookAmount');
        rebookAmountControl.clearValidators();
        rebookAmountControl.updateValueAndValidity();
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
        this.bgTermination = true;
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = true;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        // const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        // proposedEffectiveDateControl.setValidators(Validators.required);
        // proposedEffectiveDateControl.updateValueAndValidity();

        break;
      }
      case LMSOperationEnum.ContingentLiabilityTenorExtension: {
        this.validateForm();
        this.ContingentFlagRenewal = false;
        this.ContingentFlagTermination = false;
        this.ContingentFlagTenorExtension = true;
        this.ContingentFlagAmountReduction = false;
        this.ContingentIsFlagRebook = false;
        this.ContingentIsFlagAmountReduction = false;
        this.Tenor = false;
        this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.effectiveDate));
        const tenorControl = this.LoanReviewForm.get('tenor');
        tenorControl.setValidators(Validators.required);
        tenorControl.updateValueAndValidity();
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
        this.ContingentIsFlagAmountReduction = true;
        this.ContingentIsFlagRebook = false;
        this.Tenor = false;
        let outstandingPrincipal = (this.selectedLoanReview.contigentOutstandingPrincipal - this.selectedLoanReview.totalPrepayment);
        this.LoanReviewForm.controls["outstandingPrincipal"].setValue(outstandingPrincipal);
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
        this.ContingentIsFlagRebook = false;
        this.ContingentFlagAmountReduction = true;
        this.ContingentIsFlagAmountReduction = false;
        this.Tenor = false;
        let outstandingPrincipal = (this.selectedLoanReview.contigentOutstandingPrincipal - this.selectedLoanReview.totalPrepayment);
        this.LoanReviewForm.controls["outstandingPrincipal"].setValue(outstandingPrincipal);
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
        this.ContingentIsFlagRebook = false;
        this.ContingentIsFlagAmountReduction = false;
        this.Tenor = false;
        let outstandingPrincipal = (this.selectedLoanReview.contigentOutstandingPrincipal - this.selectedLoanReview.totalPrepayment);
        this.LoanReviewForm.controls["outstandingPrincipal"].setValue(outstandingPrincipal);
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const prepaymentControl = this.LoanReviewForm.get('prepayment');
        prepaymentControl.setValidators(Validators.required);
        prepaymentControl.updateValueAndValidity();

        break;
      }
      case LMSOperationEnum.ContingentLiabilityRebook: {
        this.validateForm();
        // let expireDate = new Date(this.maturityDate);
        // var date = new Date(expireDate.getTime() + 1 * 86400 * 1000);
        // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(date);
        this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
          new Date(this.systemCurrentDate)
        );

        let apgBalance = (this.selectedLoanReview.principalAmount - this.selectedLoanReview.contigentOutstandingPrincipal);
        this.LoanReviewForm.controls["apgBalance"].setValue(apgBalance);
        this.bgTermination = false;
        this.ContingentIsFlagRebook = true;
        this.ContingentFlagRenewal = true;
        this.ContingentFlagTermination = true;
        this.ContingentFlagTenorExtension = false;
        this.ContingentFlagAmountReduction = false;
        this.ContingentIsFlagAmountReduction = false;
        this.Tenor = false;
        const reviewDetailsControl = this.LoanReviewForm.get('reviewDetails');
        reviewDetailsControl.setValidators(Validators.required);
        reviewDetailsControl.updateValueAndValidity();
        const proposedEffectiveDateControl = this.LoanReviewForm.get('proposedEffectiveDate');
        proposedEffectiveDateControl.setValidators(Validators.required);
        proposedEffectiveDateControl.updateValueAndValidity();
        const maturityDateDateControl = this.LoanReviewForm.get('maturityDate');
        maturityDateDateControl.setValidators(Validators.required);
        maturityDateDateControl.updateValueAndValidity();
        const legalContingentCodeControl = this.LoanReviewForm.get('legalContingentCode');
        legalContingentCodeControl.setValidators(Validators.required);
        legalContingentCodeControl.updateValueAndValidity();
        const rebookAmountControl = this.LoanReviewForm.get('rebookAmount');
        rebookAmountControl.clearValidators();
        rebookAmountControl.updateValueAndValidity();
        break;
      }
      default: {
        break;
      }
    }
  }


  computeApgBalance() {
    const rebookAmount = this.LoanReviewForm.get('rebookAmount').value;
    const rebookAmountConvert: number = ConvertString.TO_NUMBER(rebookAmount);
    const apgBalance = this.LoanReviewForm.get('apgBalance').value;
    const apgBalanceConvert: number = ConvertString.TO_NUMBER(apgBalance);
    if (rebookAmountConvert < 1) {
      let apgBalance2 = (this.selectedLoanReview.principalAmount - this.selectedLoanReview.contigentOutstandingPrincipal);
      this.LoanReviewForm.controls["apgBalance"].setValue(apgBalance2);
      return;
    }
    if (rebookAmountConvert > apgBalanceConvert) {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Rebook amount can not be greater than the apg balance', 'error');
      this.LoanReviewForm.controls['rebookAmount'].setValue("");
      return;
    }
    const newApgBalance = apgBalanceConvert - rebookAmountConvert;
    this.LoanReviewForm.controls["apgBalance"].setValue(newApgBalance);
  }

  computeOutstandingPrincipal() {
    const amount = this.LoanReviewForm.get('prepayment').value;
    const amountConvert: number = ConvertString.TO_NUMBER(amount);
    const outstandingPrincipal = this.LoanReviewForm.get('outstandingPrincipal').value;
    const outstandingPrincipalConvert: number = ConvertString.TO_NUMBER(outstandingPrincipal);

    if (amountConvert < 1) {
      let outstandingPrincipal2 = (this.selectedLoanReview.contigentOutstandingPrincipal - this.selectedLoanReview.totalPrepayment);
      this.LoanReviewForm.controls["outstandingPrincipal"].setValue(outstandingPrincipal2);
      return;
    }

    if (amountConvert > outstandingPrincipalConvert) {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Amount can not be greater than the outstanding principal', 'error');
      this.LoanReviewForm.controls['prepayment'].setValue("");
      return;
    }

    const newOutstandingPrincipal = outstandingPrincipalConvert - amountConvert;
    this.LoanReviewForm.controls["outstandingPrincipal"].setValue(newOutstandingPrincipal);
  }

  getRunningLoan(refNo) {
    //console.log('ref', refNo);
    this.loadingService.show()
    this.subscriptions.add(this.loanPrepaymentService.getRunningLoan(refNo).subscribe((response: any) => {
      this.loadingService.hide()
      if (response.success == true) {
        this.loanPrepaymentData = response.result;
        if (this.loanPrepaymentData != null) {
          const row = this.loanPrepaymentData;
          this.totalAmount = ConvertString.ToNumberFormate(row.outstandingPrincipal + row.pastDueTotal + row.pastDuePrincipal + row.accrualedAmount);
          this.generateData = row;
          this.loanPrepaymentForm = this.fb.group({
            loanReferenceNumber: [row.loanReferenceNumber],
            approvedAmount: [ConvertString.ToNumberFormate(row.approvedAmount)],
            outstandingPrincipal: [ConvertString.ToNumberFormate(row.outstandingPrincipal)],
            interestRate: [row.interestRate],
            equityContribution: [row.equityContribution],
            effectiveDate: [new Date(row.effectiveDate)],
            maintainTenor: true,
            maturityDate: [new Date(row.maturityDate)],
            accrualedAmount: [ConvertString.ToNumberFormate(row.accrualedAmount)],
            // accrualedAmount: [0],// [ConvertString.ToNumberFormate(row.accrualedAmount)],
            scheduleTypeId: [row.scheduleTypeId],
            newtenor: [row.newtenor],
            teno: [row.teno],
            scheduleTypeCategoryId: [row.scheduleTypeCategoryId],
            totalAmount: [this.totalAmount],
            previousEffectiveDate: [new Date(row.previousEffectiveDate)],
            pastDueTotal: [ConvertString.ToNumberFormate(row.pastDueTotal)],
            pastDuePrincipal: [ConvertString.ToNumberFormate(row.pastDuePrincipal)],
            currency: [row.currency],
            loanId: [row.loanId],



          });
          //  ////console.log("")
          this.loanPrepaymentForm.controls['previousEffectiveDate'].disable();
          this.principalValanceString = this.totalAmount; //row.totalAmount;
          this.calculateTenor();
          if (row.scheduleTypeCategoryId === 2) {
            this.displayIrregularSchedule = true;
          }
          else {
            this.displayIrregularSchedule = false;
          }
        }
        this.displayMaturityDate = false;
        this.displayEffectiveDate = true;
      } else {
        this.showMessage(response.message, "error", "FintrakBanking");
      }

    }));
  }
  convertDateDayToDays(date, day) {
    let expireDate = new Date(date);
    let expireDateDay = expireDate.getTime() + day * 86400 * 1000;
    var days = Math.floor(expireDateDay / 86400 * 1000);
    return days;
  }
  convertDateToDays(date) {
    let expireDate = new Date(date);
    var days = Math.floor((expireDate.getTime()) / 86400 * 1000);
    return days;
  }
  submitLoanReviewForm(formObj) {

    if (new Date(formObj.value.proposedEffectiveDate) > new Date(formObj.value.maturityDate)) {
      swal('FinTrak Credit 360', 'Maturity Date must not be greater than Effective Date.', 'info');
      return
    }

    if (formObj.value.operationTypeId == LMSOperationEnum.ContingentLiabilityTermination
      || formObj.value.operationTypeId == LMSOperationEnum.ContingentLiabilityRebook
    ) {

      if (this.isPrimaryLabel == 'Required') {
        swal('FinTrak Credit 360', 'Kindly Select a File to Upload', 'info');
        return
      }
    }

    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection == null || this.applicationCollection == undefined || this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else {
      this.applicationCollection = null;
    }
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }

    const bodyObj = {
      loanReviewOperationsId: reviewId,
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      loanId: this.termLoanId,
      loanSystemTypeId: this.loanSystemTypeId,
      //loanId: formObj.value.loanId,
      productTypeId: formObj.value.productTypeId,
      operationTypeId: formObj.value.operationTypeId,// LMSOperationEnum.ContingentLiabilityRebook,
      reviewDetails: formObj.value.reviewDetails,
      proposedEffectiveDate: formObj.value.proposedEffectiveDate,//new Date(formObj.value.proposedEffectiveDate).toLocaleDateString(),
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
      rebookAmount: formObj.value.rebookAmount,


      documentTitle: this.file == undefined ? null : this.docTitle,
      fileName: this.file == undefined ? undefined : this.file.name,
      fileExtension: this.file == undefined ? null : this.helperService.fileExtention(this.file.name),
      file: this.file == undefined ? undefined : this.file,
      isPrimaryDocument: this.file == undefined ? null : true,
    }
    //console.log("bodyObj",formObj.value.proposedEffectiveDate);
    //console.log("bodyObj",formObj.value.maturityDate);


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

        //console.log("body",body);
        __this.subscriptions.add(__this.loanOperationService.addLoanContingent(bodyObj).subscribe((res) => {
          if (res.success == true) {
            // this.getApprovedContingentApplication();
            __this.loanOperationService.addLoanContingentWithAttachment(__this.file, body).then((res: any) => {
              if (res.success == true) {
                //console.log("image pushed");
                __this.loadingService.hide();

                swal('FinTrak Credit 360', res.message, 'success');
                __this.displayData == false;
                __this.displayReviewModal = false;

              }
            });

            this.backToSearch();
            this.getApprovedContingentApplication();
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




    } else {
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
        __this.subscriptions.add(__this.loanOperationService.addLoanContingent(bodyObj).subscribe((res) => {
          if (res.success == true) {
            __this.getApprovedContingentApplication();
            __this.loadingService.hide();
            swal('FinTrak Credit 360', res.message, 'success');
            __this.displayData = false;
            __this.displaySearch = false;
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
      this.loanPrepaymentForm.controls['loanReferenceNumber'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.LoanReviewForm = this.fb.group({
      proposedEffectiveDate: ['', Validators.required],
      maturityDate: ['', Validators.required],
      tenor: ['', Validators.required],
      reviewDetails: ['', Validators.required],
      legalContingentCode: ['', Validators.required],

      loanReviewOperationsId: [0],
      loanId: [''],
      productTypeId: [''],
      operationTypeId: ['', Validators.required],
      interateRate: ['', Validators.required],
      prepayment: [0],
      principalFrequencyTypeId: [''],
      interestFrequencyTypeId: [''],
      principalFirstPaymentDate: [''],
      interestFirstPaymentDate: [''],
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
      rebookAmount: [''],
      apgBalance: [''],
      outstandingPrincipal: [''],

    });
    this.PrimaryDocumentForm = this.fb.group({
      primaryDocumentTitle: ['', Validators.required],
      primaryDocument: [''],
      isPrimaryDocument: [false, Validators.required],

    });

    this.searchForm = this.fb.group({
      searchString: ['', Validators.required]
    });
  }

  calculateMaturityDate() {
    this.LoanReviewForm.controls['maturityDate'].setValue(null);
    let newTenor = this.LoanReviewForm.get('tenor').value;
    if (newTenor <= 0) {
      this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
    }
    let effectiveDate = this.LoanReviewForm.get('proposedEffectiveDate').value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    // console.log(maturityDate);
    this.LoanReviewForm.controls['maturityDate'].setValue(maturityDate);
  }
  calculateTenor() {
    this.LoanReviewForm.controls['tenor'].setValue(null);
    let effectiveDate = this.LoanReviewForm.get('proposedEffectiveDate').value;
    let maturityDate = this.LoanReviewForm.get('maturityDate').value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.showMessage("Effective Date cannot be greater than Maturity Date.", "error", "FintrakBanking");
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.LoanReviewForm.controls['tenor'].setValue(tenor);
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
    this.displayData = false
  }

  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount));
    this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.scatterdPayments.splice(indx, 1);
  }
  displayFileUpload: boolean = false;
  PrimaryDocumentForm: FormGroup;
  GetPrimaryDocument() {
    this.displayFileUpload = true;

  }
  docTitle: any;
  isPrimary: boolean;
  isPrimaryLabel: string = 'Required'
  Uploaded: boolean = false;
  documentTypeId: number;
  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  supportingDocuments: any[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: any;

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];

  }



  AcceptImage() {
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

  displayReferBackForm: boolean;
  displayStatus(event) {
    if (event == true) {
      this.displayReferBackForm = false;
    }
  }

  afterReferBackSuccess(event) {
    // swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
    this.getApprovedContingentApplication();
    this.displayReferBackForm = false;
    this.backToSearch();
    //this.displayCommentForm = false;
  }

  refer() {
    this.displayReferBackForm = true;
  }

  showSearchForm() { this.displaySearchForm = true; }

  submitForm(formObj) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanOperationService.getApprovedContingentApplicationSearch(formObj.searchString).subscribe((res) => {
        if (res.success == true) {
          this.contingentLoanData = res.result;
          this.displaySearchForm=false;
          this.clearControls();
        } else {
          this.displaySearchForm=false;
        }
        this.loadingService.hide(1000);
      }, (err: any) => {
        this.loadingService.hide(1000);
      }));
  }

}
