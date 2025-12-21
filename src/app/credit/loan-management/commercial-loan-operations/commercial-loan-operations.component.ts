import { LMSOperationEnum, ProductTypeEnum } from '../../../shared/constant/app.constant';
import { CustomerService } from "../../../customer/services/customer.service";
import { CasaService } from "../../../customer/services/casa.service";
import { Subject ,  Subscription } from "rxjs";
import swal from "sweetalert2";
import { LoadingService } from "../../../shared/services/loading.service";
import { LoanService } from "../../services/loan.service";
import { DateUtilService } from "../../../shared/services/dateutils";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoanOperationService } from "../../services/loan-operations.service";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { AuthenticationService } from 'app/admin/services/authentication.service';
import { CPSubAllocationComponent } from 'app/credit/components';

@Component({
  selector: 'app-commercial-loan-operations.component',
  templateUrl: './commercial-loan-operations.component.html',
  styles: [`.ui-datepicker {top: 20px !important;}`]

})
export class CommercialLoanReviewOperationsComponent implements OnInit, OnDestroy {
  totalOutstanding: number;
  pastDue: number;
  allScheduleTypes: any[];
  terminalAndRebook: boolean;
  displayInterestRate: boolean = false;
  displayRestructure: boolean = false;

  displayTenorChange: boolean = false;
  displayInterestFrequencyChange: boolean = false;
  displayPrincipalFrequencyChange: boolean = false;
  displayPaymentDateChange: boolean = false;
  displayInterestPrincipalChange: boolean = false;

  customerAccounts: any[] = [];
  operationTypes: any[];
  shouldDisburse: boolean;
  checked: boolean;
  hideDisbursementCheck: string = "hide";
  display: boolean = false;
  displayScheduleModalForm: boolean = false;
  show: boolean = false;
  message: any;
  title: any;
  cssClass: any;
  scheduleGroupForm: FormGroup;
  scheduleTypes: any[];
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  scheduleParams: any = {};
  basis: any[];
  frequencies: any[];
  scatteredMethod: boolean = false;
  bulletMethod: boolean = false;
  ballonMethod: boolean = false;
  scatterdPayments: any[] = [];
  irregularSchedules: any[];
  data: any = {};
  irreSchedules: boolean = false;
  principalBalance: any = 0;
  principalValanceString: any;
  callendarPixel: string;

  entityName: string;
  displayLoanReviewList: boolean = false;
  displayBackToList: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayLoanReviewOperationModal: boolean = false;
  termLoanId: number = null;
  approvedLoanReviewData: any[];
  selectedLoanReview: any = {};
  LoanReviewOperationForm: FormGroup;

  displayCasaDetails: boolean = false;
  model: any;
  searchAccountTerm$ = new Subject<any>();
  displayCASASearchModal: boolean = false;
  CASAAccountChange: boolean = false;
  displayOrHideControl: boolean = false;
  casaSearchResults: any[];
  objBody: any = {};
  refNo: any;
  displayLoanRebookModal: boolean = false;
  loanInfo: any = {};
  AnnuityMethod: boolean = false;
  systemCurrentDate: any;
  lmsApplicationDetailId: number = 0;
  displayRolloverModal: boolean;
  displayInterestChangeModal: boolean;
  displayTenorChangeModal: boolean;
  displaySubAllocationChangeModal: boolean;
  systemDate: Date;
  displayAutomaticRolloverModal: boolean;
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  approvedLoanOperationReviewData: any[];
  //@ViewChild(DisbursedCommercialLoanDetailsComponent) disbursedCommercialLoans: DisbursedCommercialLoanDetailsComponent;
  @ViewChild(CPSubAllocationComponent, {static: false}) cpSubAllocation: CPSubAllocationComponent;
  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
  constructor(
    private fb: FormBuilder,
    private loanSrv: LoanService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loadingService: LoadingService,
    private casaService: CasaService,
    private customerService: CustomerService,
    private authService: AuthenticationService,
  ) {
    this.subscriptions.add(this.casaService
      .searchForAccount(this.searchAccountTerm$)
      .subscribe(results => {
        this.casaSearchResults = results.result;
      }));
  }
  ngOnInit() {
    this.loadingService.show();
    this.displayLoanReviewList = true;
    this.CASAAccountChange = false;
    this.getApprovedNonTermLoansForReview();
    this.displayOrHideControl = true;
    this.getDayCount();
    this.getFrequencyTypes();
    this.getAllLoanScheduleTypes();

    const userInfo = this.authService.getUserInfo();
        this.systemDate = userInfo.applicationDate;
  }

  getDayCount() {
    this.subscriptions.add(this.loanSrv.getLoanDayCount().subscribe(res => {
      this.basis = res.result;
    }));
  }

  getCustomerAccounts(customerId) {
    this.subscriptions.add(this.casaService
      .getAllCustomerAccountByCustomerId(customerId)
      .subscribe(response => {
        this.customerAccounts = response.result;
      }));
  }

  getFrequencyTypes() {
    this.subscriptions.add(this.loanSrv.getFrequencyTypes().subscribe(res => {
      this.frequencies = res.result;
    }));
  }

  getLoanScheduleTypes(productTypeId: number) {
    this.subscriptions.add(this.loanSrv.getLoanScheduleTypes(productTypeId).subscribe(res => {
      this.scheduleTypes = res.result;
    }));
  }

  getAllLoanScheduleTypes() {
    this.subscriptions.add(this.loanSrv.getAllLoanScheduleTypes().subscribe(res => {
      this.allScheduleTypes = res.result;
    }));
  }

  getApprovedNonTermLoansForReview() {
    this.subscriptions.add(this.loanOperationService.getApprovedNonTermLoansForReview().subscribe(results => {
      this.loadingService.hide();
      this.approvedLoanReviewData = results.result;
    }));
  }

  GetOperationType() {
    this.subscriptions.add(this.loanOperationService.getOperationType(true).subscribe(results => {
      this.operationTypes = results.result;
      if(this.selectedLoanReview.productTypeId == ProductTypeEnum.CommercialLoans){
        this.operationTypes = this.operationTypes
        .filter
        ( x=>
          x.operationTypeId == LMSOperationEnum.TenorExtension ||
          x.operationTypeId == LMSOperationEnum.CommercialLoanRollOver 
        )
      }
      else{
        this.operationTypes = this.operationTypes
        .filter
        ( x=>
          x.operationTypeId == LMSOperationEnum.TenorExtension ||
          x.operationTypeId == LMSOperationEnum.InterestRateChange
        )
      }
    }));
  }

  onSelectedLoanReviewChange(event) {
    this.selectedLoanReview = event.data;
    this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
    this.entityName = "Perform Loan Review Operation For: " + this.selectedLoanReview.customerName;
    this.GetOperationType();
    this.termLoanId = this.selectedLoanReview.loanId;

    this.getLoanScheduleTypes(this.selectedLoanReview.productTypeId);
    this.data.scheduleMethod = this.selectedLoanReview.scheduleTypeId;
    if(this.selectedLoanReview.appraisalOperationId == 257 || this.selectedLoanReview.appraisalOperationId == 123){
      this.data.scheduleMethod = 5;
    } 
    this.data.principalAmount = this.selectedLoanReview.outstandingPrincipal;
    this.data.interestRate = this.selectedLoanReview.interestRate;
    this.data.loanDate = new Date(this.selectedLoanReview.effectiveDate);
    this.data.basis = this.selectedLoanReview.basis;
    this.data.integralFeeAmount = this.selectedLoanReview.accurialBasis;
    this.selectedApplicationRefNumber = this.selectedLoanReview.lmsApplicationReferenceNumber;
    this.selectedloanReviewApplicationId = this.selectedLoanReview.loanReviewApplicationId;

    this.refNo = this.selectedLoanReview.loanReferenceNumber;
    this.lmsApplicationDetailId = this.selectedLoanReview.lmsApplicationDetailId;
    this.pastDue =
      +this.selectedLoanReview.pastDueInterest +
      +this.selectedLoanReview.interesrtOnPastDueInterest +
      +this.selectedLoanReview.interestOnPastDuePrincipal;
    this.totalOutstanding =
      +this.pastDue +
      +this.selectedLoanReview.outstandingPrincipal +
      +this.selectedLoanReview.accrualedAmount;
    this.data.proposedEffectiveDate = new Date(this.systemCurrentDate);
    this.onscheduleMethodChangedOne();
    this.getCustomerAccounts(this.selectedLoanReview.customerId);
    this.approvedLoanOperationReviewData = this.selectedLoanReview.operationReview;
    if (this.approvedLoanOperationReviewData != null)
    {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
      this.displayRefered = true;
    }
    else
    {
      //this.loaddataForm(this.selectedLoanReview);
      this.displayRefered = false;

    }
    this.displayLoanReviewList = false;
    this.displayCustomerLoanDetails = true;
    this.displayBackToList = true;
  }

  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;

      this.data.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;     
      this.onOperationTypeChange(row.operationTypeId);
      this.operationTypes
        .filter
        ( x=>
          x.operationTypeId == row.operationTypeId 
        )     
    }
  }

  showLoanReviewForm() {
    this.displayLoanReviewOperationModal = true;
  }

  clearControl() {
    this.LoanReviewOperationForm = this.fb.group({
      loanReviewOperationsId: [0],
      loanId: [""],
      productTypeId: [""],
      operationTypeId: ["", Validators.required],
      reviewDetails: ["", Validators.required],
      proposedEffectiveDate: ["", Validators.required],
      interateRate: [0],
      prepayment: [0],
      maturityDate: [""],
      principalFrequencyTypeId: [""],
      interestFrequencyTypeId: [""],
      principalFirstPaymentDate: [""],
      interestFirstPaymentDate: [""],
      tenor: [""],
      cASA_AccountId: [""],
      accountNumber: [""],
      overDraftTopup: [""],
      fee_Charges: [""],
      terminationAndReBook: [""],
      completeWriteOff: [""],
      cancelUndisbursedLoan: [""],
      approvalStatusId: [""],
      isManagementRate: [""]
    });
  }

  backToLoanReviewList() {
    this.displayLoanReviewList = true;
    this.displayCustomerLoanDetails = false;
    this.displayBackToList = false;
  }

  onscheduleMethodChanged(sValue) {
    this.bulletMethod = true;
    this.ballonMethod = true;
    if (sValue === 5) {
      this.scatteredMethod = true;
      this.data.principalAmount = this.selectedLoanReview.principalAmount;
      this.data.interestRate = this.selectedLoanReview.interestRate;
      this.data.loanDate = this.selectedLoanReview.dateTimeCreated;

      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );

    } else if (sValue === 3) {
      this.bulletMethod = true;
      this.ballonMethod = false;
      this.AnnuityMethod = false;
    }
    else if (sValue === 7) {
      this.ballonMethod = true;
      this.bulletMethod = false;
      this.AnnuityMethod = false;
    }
    else {
      this.scatteredMethod = false;
      this.ballonMethod = false;
      this.AnnuityMethod = true;
    }
  }
  onscheduleMethodChangedOne() {
    let sValue: number = Number(this.data.scheduleMethod);
    if (sValue === 5) {
      this.scatteredMethod = true;

    } else {
      this.scatteredMethod = false;
      this.onscheduleMethodChanged(sValue);
    }
  }

  addToList() {
    if ((Number(this.principalValanceString) - Number(this.data.amount)) < 0) {
      swal('FinTrak Credit 360', "Payment amount cannot be greater than outstanding balance", "error");
      return;
    }
    if (new Date(this.data.scateredDate) < new Date()) {
      swal('FinTrak Credit 360', "Payment date cannot be less than today's date", "error");
      return;
    }

    var pmts = {
      paymentDate: new Date(this.data.scateredDate),//this.dateUtilService.formatJsonDate(this.data.scateredDate),
      paymentAmount: this.data.amount
    };

    this.scatterdPayments.push(pmts);
    this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount));
    this.principalValanceString = parseFloat(Number(this.principalBalance).toFixed(2));;
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

  formatValue() {
    if (this.data.amount == "") return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }

  formatFeeValue() {
    if (this.data.integralFeeAmount == "") return;
    var realChar: string = this.data.integralFeeAmount;
    var currVal: string = this.data.integralFeeAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }

  submitLoanReviewOperationForm(formObj) {
    if (this.data.operationTypeId == LMSOperationEnum.LoanRecapitilization || this.data.operationTypeId == LMSOperationEnum.TerminateAndRebook) {
            if (new Date(formObj.value.rebookInterestFirstPmtDate) > new Date(formObj.value.rebookPrincipalFirstPmtDate)) {
              swal('FinTrak Credit 360', 'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
              return
            }
      
          }
          if (this.data.operationTypeId == LMSOperationEnum.PaymentDateChange) {
            if (new Date(formObj.value.intrestFirstDate) > new Date(formObj.value.principalFirstDate)) {
              swal('FinTrak Credit 360', 'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
              return
            }
          }

    this.loadingService.show();
    if (this.data.operationTypeId == LMSOperationEnum.Restructure ) {
      this.objBody = {
        loanReviewOperationsId: 0,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.selectedLoanReview.loanReviewOperationTypeId,
        reviewDetails: this.selectedLoanReview.reviewDetails,
        proposedEffectiveDate: formObj.value.proposedEffectiveDate,
        interateRate: formObj.value.newInterateRate,
        prepayment: formObj.value.prepayment,
        maturityDate: formObj.value.maturityDate,
        principalFrequencyTypeId: formObj.value.principalfrequency,
        interestFrequencyTypeId: formObj.value.interestFrequency,
        principalFirstPaymentDate: formObj.value.principalFirstDate,
        interestFirstPaymentDate: formObj.value.intrestFirstDate,
        tenor: formObj.value.newtenor,
        cASA_AccountId: formObj.value.cASA_AccountId,
        accountNumber: formObj.value.accountNumber,
        overDraftTopup: formObj.value.overDraftTopup,
        fee_Charges: formObj.value.fee_Charges,
        terminationAndReBook: formObj.value.terminationAndReBook,
        completeWriteOff: formObj.value.completeWriteOff,
        cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
        approvalStatusId: formObj.value.approvalStatusId,
        isManagementRate: formObj.value.isManagementRate,
        reviewIrregularSchedule: this.scatterdPayments
      };
    } else if (this.data.operationTypeId == LMSOperationEnum.TerminateAndRebook || this.data.operationTypeId == LMSOperationEnum.LoanRecapitilization) {
      this.objBody = {
        loanReviewOperationsId: 0,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.selectedLoanReview.loanReviewOperationTypeId,
        reviewDetails: this.selectedLoanReview.reviewDetails,
        proposedEffectiveDate: formObj.value.rebookEffectiveDate,
        interateRate: formObj.value.rebookInterestRate,
        prepayment: formObj.value.rebookPrincipalAmount,
        maturityDate: formObj.value.rebookMaturityDate,
        principalFrequencyTypeId: formObj.value.rebookPrincipalFrequencyId,
        interestFrequencyTypeId: formObj.value.rebookInterestFrequencyId,
        principalFirstPaymentDate: formObj.value.rebookPrincipalFirstPmtDate,
        interestFirstPaymentDate: formObj.value.rebookInterestFirstPmtDate,
        tenor: formObj.value.rebookTenor,
        scheduleTypeId: formObj.value.rebookScheduleMethodId,
        scheduleDayCountId: formObj.value.rebookBasis,
        interestTypeId: formObj.value.rebookInterestChargeType,
        reviewIrregularSchedule: this.scatterdPayments
      };
    } else {
      this.objBody = {
        loanReviewOperationsId: 0,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.selectedLoanReview.loanReviewOperationTypeId,
        reviewDetails: this.selectedLoanReview.reviewDetails,
        proposedEffectiveDate: formObj.value.proposedEffectiveDate,
        interateRate: formObj.value.interestRate,
        prepayment: formObj.value.prepayment,
        maturityDate: formObj.value.maturityDate,
        principalFrequencyTypeId: formObj.value.principalfrequency,
        interestFrequencyTypeId: formObj.value.interestFrequency,
        principalFirstPaymentDate: formObj.value.principalFirstDate,
        interestFirstPaymentDate: formObj.value.intrestFirstDate,
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
        reviewIrregularSchedule: this.scatterdPayments
      };
    }

    // return;
    if (this.selectedLoanReview.loanId != null && this.objBody != null) {
      this.subscriptions.add(this.loanOperationService.addLoanReviewOperation(this.objBody).subscribe(
        res => {
          if (res.success == true) {
            this.loadingService.hide();
            swal("FinTrak Credit 360", res.message, "success");

            this.displayLoanReviewOperationModal = false;
          } else {
            swal("FinTrak Credit 360", res.message, "error");
            this.loadingService.hide();
          }
        },
        (err: any) => {
          swal("FinTrak Credit 360", JSON.stringify(err), "error");
          this.loadingService.hide();
        }
      ));
    }
  }
  searchCASA(searchString) {
    this.searchAccountTerm$.next(searchString);
  }

  viewCasaDetails(index) {
    this.displayCasaDetails = true;
    this.model = this.casaSearchResults[index];
  }

  getPostNoStatus(id) {
    return this.casaService.getPostNoStatus(id);
  }

  getCustomerSensitivityLevel(id) {
    return this.customerService.getCustomerSensitivityLevel(id);
  }

  getOperation(id) {
    return this.casaService.getOperation(id);
  }

  getAccountStatus(id) {
    return this.casaService.getAccountStatus(id);
  }

  showSearchAccountNumber() {
    this.displayCASASearchModal = true;
  }

  CallClose(event){
    //console.log(event);
    this.displayTenorChangeModal = event;
  }

  calculateMaturityDate() {
    this.LoanReviewOperationForm.controls["maturityDate"].setValue(null);
    let newTenor = this.LoanReviewOperationForm.get("newtenor").value;
    if (newTenor <= 0) {
      swal(
        "FinTrak Credit 360",
        "System cannot calculate maturity date with zero tenor.",
        "error"
      );
    }
    let effectiveDate = this.LoanReviewOperationForm.get(
      "proposedEffectiveDate"
    ).value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    this.LoanReviewOperationForm.controls["maturityDate"].setValue(
      maturityDate
    );
  }
  calculateTenor() {
    this.LoanReviewOperationForm.controls["newtenor"].setValue(null);
    let effectiveDate = this.LoanReviewOperationForm.get(
      "proposedEffectiveDate"
    ).value;

    
    let maturityDate = this.LoanReviewOperationForm.get("maturityDate").value;

    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.LoanReviewOperationForm.controls["newtenor"].setValue(tenor);
  }

  calculateRebookMaturityDate() {
    this.LoanReviewOperationForm.controls["rebookMaturityDate"].setValue(null);
    let newTenor = this.LoanReviewOperationForm.get("rebookTenor").value;
    if (newTenor <= 0) {
      swal(
        "FinTrak Credit 360",
        "System cannot calculate maturity date with zero tenor.",
        "error"
      );
    }
    let effectiveDate = this.LoanReviewOperationForm.get("rebookEffectiveDate")
      .value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    this.LoanReviewOperationForm.controls["rebookMaturityDate"].setValue(
      maturityDate
    );
  }

  calculateRebookTenor() {
    this.LoanReviewOperationForm.controls["rebookTenor"].setValue(null);
    let effectiveDate = this.LoanReviewOperationForm.get("rebookEffectiveDate")
      .value;
    let maturityDate = this.LoanReviewOperationForm.get("rebookMaturityDate")
      .value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      swal(
        "FinTrak Credit 360",
        "Effective Date cannot be greater than Maturity Date.",
        "error"
      );
      return;
    }
  }

  onOperationTypeChange(event) {
    if (event != undefined) {
      this.selectedLoanReview.loanReviewOperationTypeId = event;
    }

    //this.disbursedCommercialLoans.showOperationScreen = true;
    this.cpSubAllocation.termLoanId = this.termLoanId;
    
    if(event == LMSOperationEnum.CommercialLoanRollOver){
      if(this.selectedLoanReview.maturityDate > this.systemDate){
        this.displayAutomaticRolloverModal = true;
        this.displayRolloverModal = false;
      }
      else 
      {
        this.displayRolloverModal = true;
        this.displayAutomaticRolloverModal = false;
      }
    }

    if(event == LMSOperationEnum.InterestRateChange){
      this.displayInterestChangeModal = true
    }
    
    if(event == LMSOperationEnum.TenorExtension){
      this.displayTenorChangeModal = true
    }

    if(event == LMSOperationEnum.CommercialLoanSubAllocation){
      this.displaySubAllocationChangeModal = true
    }
  }
}
