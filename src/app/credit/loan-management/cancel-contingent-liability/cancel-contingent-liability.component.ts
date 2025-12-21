import { GlobalConfig, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject ,  Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { LoanPrepaymentService } from 'app/credit/services';

@Component({
  selector: 'cancel-contingent-liability',
  templateUrl: './cancel-contingent-liability.component.html',
  styles: [`.ui-datepicker {top: -20px !important;}`]
})
export class CancelContingentLiabilityComponent implements OnInit, OnDestroy {
  totalAmount: any;
  principalAmount: number;
  displayScheduleModalForm: boolean;
  selectedId: number = null;
  displayAddModal: boolean = false;
  displaySearchModal: boolean = false;
  entityName: string = "Cancel Contingent Liability";
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  productTypeId: number;
  lmsApplicationDetailId: number;
  loanPrepaymentForm: FormGroup;
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
  loanSystemTypeId: number;
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
  displayLoanDetailsModal: boolean;
  termLoanId: number = 0;

  show: boolean = false; message: any; title: any; cssClass: any;




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
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  approvedLoanOperationReviewData: any[];
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  bgTermination: boolean = false;

  takeFeeStatus: number;

  currencyId: number;
  applicationCollection: any[] = [];

  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loanService: LoanService) {
      this.subscriptions.add(this.loanOperationService.searchForInactiveLoanContingent(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;

      }));
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();

  }
  showAddModal() {
    this.clearControls();
    this.entityName = "Contingent Liability Rebook";
    this.displayAddModal = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  searchVariable: any;
  search() {

    this.subscriptions.add(this.loanOperationService.searchLoanForInactiveContingent(this.searchVariable)
    .subscribe(results => {
      this.searchResults = results.result;

    }));  }

 


  onSelectedLoanChange(event): void {
    const row = event;
    this.loanSystemTypeId = row.loanSystemTypeId;
    this.termLoanId = row.loanId;
    this.customerId = row.customerId;
    this.currencyId = row.currencyId;

   // this.oldEffectiveDate = row.effectiveDate;
   // this.oldMaturityDate = row.maturityDate;
    ////console.log(' this.termLoanId value',  this.termLoanId);
    this.selectedOperationId = row.operationId;
    this.systemCurrentDate = row.systemCurrentDate;
    this.lmsApplicationDetailId = row.lmsApplicationDetailId;
    //this.getContingentByLoanId(row.loanId);
    this.displayLoanSearch = false;
    this.displayCustomerLoanDetails = true;
    this.displatBackToSearch = true;
    //this.selectedApplicationRefNumber = row.lmsApplicationReferenceNumber;
    //this.selectedloanReviewApplicationId = row.loanReviewApplicationId;
    this.approvedLoanOperationReviewData = row.operationReview;

    this.displayData = true;
    this.displaySearch = false;
    this.displaySearchModal = false;
    this.displayIrregularSchedule = false;
    this.displayRegularSchedule = false;
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

  }


  showReviewForm(): void {
    this.clearControls();
    this.displayReviewModal = true;
  }


  submitLoanReviewForm(formObj) {

   
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
      operationTypeId: LMSOperationEnum.CancelContingentLiability,
      reviewDetails: formObj.value.reviewDetails,
      proposedEffectiveDate: formObj.value.proposedEffectiveDate,
      interateRate: formObj.value.interateRate,
      prepayment: formObj.value.prepayment,
      maturityDate: formObj.value.maturityDate,
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
      //fees: this.applicationCollection,

    }
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
      __this.subscriptions.add(__this.loanOperationService.addLoanContingent(bodyObj)
      .subscribe((res) => {
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

  clearControls() {
    this.LoanReviewForm = this.fb.group({
      reviewDetails:['', Validators.required],
    });
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




}
