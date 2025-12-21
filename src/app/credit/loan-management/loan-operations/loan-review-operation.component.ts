import { Subscription ,  Subject } from 'rxjs';
import { ConvertString, GlobalConfig, LMSOperationEnum, ProductTypeEnum, JobSourceEnum, ApprovalStatus } from '../../../shared/constant/app.constant';
import { CustomerService } from "../../../customer/services/customer.service";
import { CasaService } from "../../../customer/services/casa.service";
import swal from "sweetalert2";
import { LoadingService } from "../../../shared/services/loading.service";
import { LoanService } from "../../services/loan.service";
import { DateUtilService } from "../../../shared/services/dateutils";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoanOperationService } from "../../services/loan-operations.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { LoanPrepaymentService } from 'app/credit/services/loan-prepayment.service';
import * as moment from 'moment';
import { LoanApplicationService, CreditAppraisalService, LoanReviewApplicationService } from 'app/credit/services';
import { StaffRoleService } from 'app/setup/services';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-loan-review-operation',
  templateUrl: './loan-review-operation.component.html',
  styles: [`.ui-datepicker {top: 20px !important;}`]

})
export class LoanReviewOperationsComponent implements OnInit, OnDestroy {
  loanSystemTypeId: number;
  currencyId: number;
  customerId: number;
  totalOutstanding: number;
  operationTypeId: number;
  pastDue: number;
  pastDuePrincipal: number;
  openingBalanceData: any = {};
  openingBalance: any;
  allScheduleTypes: any[];
  terminalAndRebook: boolean;
  displayInterestRate: boolean = false;
  displayRestructure: boolean = false;
  displayPrepayment: boolean = false;
  approvalWorkflowData: any[];
  displayRefered: boolean = false;
  effectiveDate: Date;
  displayTenorChange: boolean = false;
  displayInterestFrequencyChange: boolean = false;
  displayPrincipalFrequencyChange: boolean = false;
  displayPaymentDateChange: boolean = false;
  displayInterestPrincipalChange: boolean = false;
  currentDate: Date;
  selectedLoanReviewId: number;
  customerAccounts: any[] = [];
  otherCustomerAccounts: any[] = [];
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
  displayInterestRateNew: boolean
  scheduleHeader: any = {};
  maturityDate: any;
  scheduleParams: any = {};
  rebookPrincipalAmount: any;
  basis: any[];
  principalData: any = {};
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
  selectWorkoutDate: any;
  total: number = 0;
  creditAppraisalLoanApplicationId: number = 0;
  creditAppraisalOperationId: number = 0;
  balance: any;
  workoutAmount: any;
  takeFeeStatus: number;

  entityName: string;
  displayLoanReviewList: boolean = false;
  displayBackToList: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayLoanReviewOperationModal: boolean = false;
  termLoanId: number = null;
  approvedLoanReviewData: any[];
  approvedLoanOperationReviewData: any[];

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
  terminateAndRebookscatteredMethod: boolean = false;
  terminateAndRebookBallonMethod: boolean = false;
  terminateAndRebookBulletMethod: boolean = false;
  terminateAndRebookAnnuityMethod: boolean = false;
  systemCurrentDate: any;
  lmsApplicationDetailId: number = 0;
  displayLoanWorkout: boolean = false;
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  jobSourceId: number;


  loanPrepaymentData: any = {};
  appraisalApplicationId: any;
  appraisalOperationId: any;
  appraisalOperationName: any;
  synOperationId: any;



  displayCommentForm: boolean = false;
  commentTitle: string = null;
  commentForm: FormGroup;
  forwardAction: number = 0;
  receiverLevelId: number = null;
  receiverStaffId: number = null;
  testModal: boolean = false;

  trail: any[] = [];
  backtrail: any[] = [];
  trailCount: number = 0;
  trailLevels: any[] = [];
  trailRecent: any = null;

  isBoard: boolean = false;
  isAnalyst: boolean = false;
  isBusiness: boolean = false;
  isSubsequent: boolean = false;
  loanApplicationDetail: any;
  customerProposedAmount: number = 0;
  maximumAmount: number = 0;

  warningMessage: string = '';
  touchedLineItems: number[] = [];
  recommendedItems: any[] = [];
  selectedLineId: number;
  enebleFacilityChange: boolean = false;
  proposedItems: any[] = [];
  facilityCount: number = 0;

  errorMessage: string = '';
  loanReviewOperationsId: number;

  displayReferBackForm: boolean;

  searchString: string;
  searchForm: FormGroup;
  displaySearchForm: boolean = false;

  @Input() isRouteMode: boolean = false;
  //@Input() isFinalOperation : boolean = false;
  applicationDate: Date = new Date();
  loanApplDetailId = 0;
  private subscriptions = new Subscription();
  scheduleObj: any;
  paymentsObj: any[];
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private loanSrv: LoanService,
    private loanOperationService: LoanOperationService,
    private _loanApplServ: LoanApplicationService,
    private dateUtilService: DateUtilService,
    private loadingService: LoadingService,
    private casaService: CasaService,
    private customerService: CustomerService,
    private loanPrepaymentService: LoanPrepaymentService,
    private camService: CreditAppraisalService,
    private reviewService: LoanReviewApplicationService,
    private staffRole: StaffRoleService,
  ) {
    this.subscriptions.add(
      this.casaService
        .searchForAccount(this.searchAccountTerm$)
        .subscribe(results => {
          this.casaSearchResults = results.result;
          ////console.log("search item", this.casaSearchResults);
        }));
  }
  ngOnInit() {
    this.jobSourceId = JobSourceEnum.LMSOperationAndApproval;
    // this.loadingService.show();
    this.displayLoanReviewList = true;
    this.CASAAccountChange = false;
    this.getApprovedLoanReview();
    ///this.getApprovedLoanReviewOld();
    this.displayOrHideControl = true;
    this.getDayCount();
    this.initializeForm();
    this.getFrequencyTypes();
    this.GetOperationType();
    this.getAllLoanScheduleTypes();
    this.getApplicationDate();
    this.currentDate = new Date();
    this.clearControls();
    this.getUserRole();

  }

  userisAnalyst: boolean = false;
  userIsRelationshipManager = false;
  userIsAccountOfficer = false;
  userIsUserAuthorizer = false;
  staffRoleRecord: any;

  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
      this.staffRoleRecord = res.result;
      if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
        this.userIsAccountOfficer = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'COA') {
        this.userIsUserAuthorizer = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
        this.userIsRelationshipManager = true;
      }

    });
  }


  getDayCount() {
    this.subscriptions.add(
      this.loanSrv.getLoanDayCount().subscribe(res => {
        this.basis = res.result;
      }));
  }
  getCustomerAccounts(customerId) {
    this.casaService
      .getAllCustomerAccountByCustomerId(customerId)
      .subscribe(response => {
        this.customerAccounts = response.result;
      });
  }
  getFrequencyTypes() {
    this.subscriptions.add(
      this.loanSrv.getFrequencyTypes().subscribe(res => {
        this.frequencies = res.result;
      }));
  }
  getLoanScheduleTypes(productTypeId: number) {
    this.loanSrv.getLoanScheduleTypes(productTypeId).subscribe(res => {
      this.scheduleTypes = res.result;
      ////console.log(" this.scheduleTypes ", this.scheduleTypes );
    });
  }
  getAllLoanScheduleTypes() {
    this.subscriptions.add(
      this.loanSrv.getAllLoanScheduleTypes().subscribe(res => {
        this.allScheduleTypes = res.result;
      }));
  }
  applicationCollection: any[] = [];

  takeFees(event) {
    this.applicationCollection = event;
    //console.log("applicationCollection",this.applicationCollection);
  }

  getApprovedLoanReview() {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanOperationService.getApprovedLoanReview()
        .subscribe(results => {
          this.loadingService.hide();
          this.approvedLoanReviewData = results.result;
        }, (err) => {
            this.loadingService.hide(1000);
        }));
  }
  // getApprovedLoanReview() {
  //   this.subscriptions.add(
  //   this.loanOperationService.getApprovedLoanReviewAwaitingOperation().subscribe(results => {
  //     this.loadingService.hide();
  //     this.approvedLoanReviewData = results.result;
  //   }));
  // }

  GetOperationType() {
    this.subscriptions.add(
      this.loanOperationService.getOperationType(true).subscribe(results => {
        this.operationTypes = results.result;
        this.operationTypes = this.operationTypes
          .filter
          (x =>
            x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
            x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension &&
            x.operationTypeId != LMSOperationEnum.FacilityLineAmountChange &&
            x.operationTypeId != LMSOperationEnum.InterestRepricing &&
            x.operationTypeId != LMSOperationEnum.InterestOnPastDuePrincipal &&
            x.operationTypeId != LMSOperationEnum.InterestOnPastDueInterest &&
            //x.operationTypeId != LMSOperationEnum.InterestRateChange &&
            //x.operationTypeId != LMSOperationEnum.TenorChange &&
            //x.operationTypeId != LMSOperationEnum.Prepayment &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityRebook &&
            //x.operationTypeId != LMSOperationEnum.ManualFeeCharge &&
            //x.operationTypeId != LMSOperationEnum.GlobalInterestRateChange &&
            x.operationTypeId != LMSOperationEnum.CancelContingentLiability &&
            x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountAddition &&
            x.operationTypeId != LMSOperationEnum.APS_RelaseChecklist &&
            x.operationTypeId != LMSOperationEnum.APS_ReleaseCAP &&
            x.operationTypeId != LMSOperationEnum.APS_ReleasePrincipaRequest &&
            //x.operationTypeId != LMSOperationEnum.Restructure && 
            x.operationTypeId != LMSOperationEnum.FinalCollateralRelease &&
            x.operationTypeId != LMSOperationEnum.TemporalCollateralRelease &&
            x.operationTypeId != LMSOperationEnum.LmsOperations &&
            x.operationTypeId != LMSOperationEnum.FullAndFinalCompleteWriteOff &&
            x.operationTypeId != LMSOperationEnum.DailyWriteoffInterestAccural &&
            x.operationTypeId != LMSOperationEnum.SecurityRelease &&
            //x.operationTypeId != LMSOperationEnum.TenorExtension &&
            //x.operationTypeId != LMSOperationEnum.LoanTermination &&
            x.operationTypeId != LMSOperationEnum.AtcReleaseApproval &&
            x.operationTypeId != LMSOperationEnum.AtcLodgementApproval &&
            x.operationTypeId != LMSOperationEnum.OriginalDocumentApproval &&
            x.operationTypeId != LMSOperationEnum.CrmsApproval &&
            x.operationTypeId != LMSOperationEnum.LoanRecoveryCompletion &&
            x.operationTypeId != LMSOperationEnum.LoanRecoveryPayment &&
            x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
            x.operationTypeId != LMSOperationEnum.CollateralRelease &&
            x.operationTypeId != LMSOperationEnum.CollateralValuationRequest &&

            //x.operationTypeId != LMSOperationEnum.CompleteWriteOff &&  
            x.operationTypeId != LMSOperationEnum.GlobalInterestRateChange
          );
        //console.log(this.selectedLoanReview.productTypeId ); //41
        if (this.selectedLoanReview.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility) {
          this.operationTypes = this.operationTypes
            .filter
            (x =>
              x.operationTypeId != LMSOperationEnum.PaymentDateChange &&
              x.operationTypeId != LMSOperationEnum.ChangeRepaymentAccount &&
              x.operationTypeId != LMSOperationEnum.CompleteWriteOff &&
              x.operationTypeId != LMSOperationEnum.LoanTermination &&
              x.operationTypeId != LMSOperationEnum.GlobalInterestRateChange

            );
        }
      }));
  }
  CallRequestClose() { this.displayJobrequest = false; }
  displayJobrequest = false;
  facilityList: any;

  lmsOperationId: number;
  onSelectedLoanReviewChange(data) {
    this.GetOperationType();
    this.selectedLoanReview = data;

    this.appraisalApplicationId = this.selectedLoanReview.appraisalLoanApplicationId;
    this.appraisalOperationId = this.selectedLoanReview.appraisalOperationId;
    this.appraisalOperationName = this.selectedLoanReview.operationName;
    this.loanApplDetailId = this.selectedLoanReview.loanReviewApplicationId;
    this.synOperationId = this.selectedLoanReview.synOperationId;

    this.creditAppraisalLoanApplicationId = this.selectedLoanReview.creditAppraisalLoanApplicationId;
    this.creditAppraisalOperationId = this.selectedLoanReview.creditAppraisalOperationId;

    if (this.selectedLoanReview.operationReview != null) {
      this.proposedItems = this.selectedLoanReview.operationReview;
      this.facilityCount = this.selectedLoanReview.operationReview.length;
    }

    this.approvedLoanOperationReviewData = this.selectedLoanReview.operationReview;
    this.currentDate = new Date(this.selectedLoanReview.systemCurrentDate);
    this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
    this.entityName = "Perform Loan Review Operation For: " + this.selectedLoanReview.customerName;
    this.termLoanId = this.selectedLoanReview.loanId;
    this.loanSystemTypeId = this.selectedLoanReview.loanSystemTypeId
    this.getLoanScheduleTypes(this.selectedLoanReview.productTypeId);
    this.currencyId = this.selectedLoanReview.currencyId;
    this.customerId = this.selectedLoanReview.customerId;
    this.data.principalFirstDate = new Date(this.selectedLoanReview.firstPrincipalPaymentDate);
    this.data.intrestFirstDate = new Date(this.selectedLoanReview.firstInterestPaymentDate);
    this.data.scheduleMethod = this.selectedLoanReview.scheduleTypeId;
    this.data.principalAmount = this.selectedLoanReview.outstandingPrincipal;
    this.data.interestRate = this.selectedLoanReview.interestRate;
    this.data.loanDate = new Date(this.selectedLoanReview.effectiveDate);
    this.data.basis = this.selectedLoanReview.basis;
    this.data.integralFeeAmount = this.selectedLoanReview.accurialBasis;
    this.data.operationTypeId = '';//this.selectedLoanReview.loanReviewOperationTypeId;
    this.refNo = this.selectedLoanReview.loanReferenceNumber;
    this.lmsApplicationDetailId = this.selectedLoanReview.lmsApplicationDetailId;
    this.pastDuePrincipal = this.selectedLoanReview.pastDuePrincipal;
    this.selectedApplicationRefNumber = this.selectedLoanReview.lmsApplicationReferenceNumber;
    this.selectedloanReviewApplicationId = this.selectedLoanReview.loanReviewApplicationId;
    this.pastDue =
      +this.selectedLoanReview.pastDueInterest +
      +this.selectedLoanReview.interesrtOnPastDueInterest +
      +this.selectedLoanReview.interestOnPastDuePrincipal; // past due int

    this.totalOutstanding =
      +this.pastDue +
      +this.selectedLoanReview.pastDuePrincipal +
      +this.selectedLoanReview.outstandingPrincipal +
      +this.selectedLoanReview.accrualedAmount +
      +this.selectedLoanReview.interestOnPastDuePrincipal +
      +this.selectedLoanReview.interesrtOnPastDueInterest;

    this.data.proposedEffectiveDate = new Date(this.systemCurrentDate);


    this.operationTypeId = this.selectedLoanReview.operationId;

    // if(this.selectedLoanReview.productTypeId != ProductTypeEnum.ForeignExchangeRevolvingFacility){
    //   this.operationTypes = this.operationTypes
    //   .filter
    //   (x =>
    //     x.operationTypeId != LMSOperationEnum.TenorChange &&
    //     x.operationTypeId != LMSOperationEnum.InterestRateChange 
    //   );
    // }

    this.onscheduleMethodChangedOne();

    this.enableDisableControl(this.selectedLoanReview.loanReviewOperationTypeId);
    if (this.approvedLoanOperationReviewData != null) {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
      this.displayRefered = true;
    }
    else {
      this.loaddataForm(this.selectedLoanReview);
      this.displayRefered = false;

    }
    this.getCustomerAccounts(this.selectedLoanReview.customerId);
    this.displayLoanReviewList = false;
    this.displayCustomerLoanDetails = true;
    this.displayBackToList = true;
    //this.getRunningLoan(this.selectedLoanReview.loanReferenceNumber);
    this.lmsOperationId = this.selectedLoanReview.operationId;

  }

  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;
      this.enableDisableControl(row.operationTypeId);

      this.data.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;
      this.subscriptions.add(
        this.loanSrv.getApprovalTrailByOperation(this.data.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
          this.approvalWorkflowData = res.result;
        }));

      this.LoanReviewOperationForm.controls["proposedEffectiveDate"].setValue(
        new Date(row.newEffectiveDate)

      );

      this.LoanReviewOperationForm.controls["rebookEffectiveDate"].setValue(
        new Date(row.newEffectiveDate)
      );
      this.LoanReviewOperationForm.controls["principalAmount"].setValue(
        row.prepayment
      );
      this.LoanReviewOperationForm.controls["interestRate"].setValue(
        row.newInterateRate
      );
      this.LoanReviewOperationForm.controls["loanDate"].setValue(
        new Date(row.newEffectiveDate)
      );
      this.LoanReviewOperationForm.controls["scheduleMethod"].setValue(
        row.scheduledPrepaymentFrequencyTypeId
      );
      this.LoanReviewOperationForm.controls["interestFrequency"].setValue(
        row.newInterestFrequencyTypeId
      );
      this.LoanReviewOperationForm.controls["principalfrequency"].setValue(
        row.newPrincipalFrequencyTypeId
      );
      this.LoanReviewOperationForm.controls["tenor"].setValue(row.newTenor);
      this.LoanReviewOperationForm.controls["newtenor"].setValue(row.newTenor);

      this.LoanReviewOperationForm.controls["principalFirstDate"].setValue(
        new Date(row.newPrincipalFirstPaymentDate)
      );
      this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(
        new Date(row.newInterestFirstPaymentDate)
      );
      this.LoanReviewOperationForm.controls["previousMaturityDate"].setValue(
        new Date(row.newMaturityDate)
      );
      this.LoanReviewOperationForm.controls["maturityDate"].setValue(
        new Date(row.newMaturityDate)
      );
      this.LoanReviewOperationForm.controls["numberOfPayments"].setValue(
        row.scheduleDayCountConventionId
      );
      this.LoanReviewOperationForm.controls["basis"].setValue(
        row.accurialBasis
      );
      this.LoanReviewOperationForm.controls["newInterateRate"].setValue(
        row.newInterateRate
      );


      //this.calculateTenor();
    }
  }

  setFirstPrincipalPaymentDate(dateVal) { //console.debug('dateVal xl',dateVal);
    this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(
      new Date(dateVal)
    );
    //this.intrestFirstDate=new Date(dateVal);
  }

  showLoanReviewForm() {
    if (this.approvedLoanOperationReviewData != null) {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
    }
    else {
      this.loaddataForm(this.selectedLoanReview);
    }
    this.displayLoanReviewOperationModal = true;
  }

  initializeForm() {
    this.LoanReviewOperationForm = this.fb.group({
      principalAmount: [""],
      interestRate: [0],
      prepayment: [0],
      loanDate: [""],
      scheduleMethod: [""],
      interestFrequency: [""],
      principalfrequency: [""],
      tenor: [""],
      principalFirstDate: [""],
      intrestFirstDate: [""],
      previousMaturityDate: [""],
      maturityDate: [""],
      numberOfPayments: [""],
      basis: [""],
      integralFeeAmount: [""],
      interestChargeType: ["0"],
      withoutDisburment: [false],
      accountNumber: [""],
      cASA_AccountId: [""],
      productName: [""],
      proposedEffectiveDate: [""],
      newtenor: [""],
      newInterateRate: [""],

      rebookBasis: [""],
      rebookEffectiveDate: [""],
      rebookMaturityDate: [""],
      rebookTenor: [""],
      rebookScheduleMethodId: [""],
      rebookIntegralFeeAmount: [""],
      rebookInterestRate: [""],
      rebookPrincipalAmount: [""],
      rebookInterestChargeType: [""],
      rebookPrincipalFrequencyId: [""],
      rebookInterestFrequencyId: [""],
      rebookInterestFirstPmtDate: [""],
      rebookPrincipalFirstPmtDate: [""],
    });
  }
  loaddataForm(data) {
    if (data != undefined) {
      const row = data;
      this.LoanReviewOperationForm.controls["proposedEffectiveDate"].setValue(
        new Date(row.effectiveDate)
      );
      this.LoanReviewOperationForm.controls["rebookEffectiveDate"].setValue(
        new Date(row.effectiveDate)
      );
      this.LoanReviewOperationForm.controls["principalAmount"].setValue(
        row.outstandingPrincipal
      );
      this.LoanReviewOperationForm.controls["interestRate"].setValue(
        row.interestRate
      );
      this.LoanReviewOperationForm.controls["loanDate"].setValue(
        new Date(row.effectiveDate)
      );
      this.LoanReviewOperationForm.controls["scheduleMethod"].setValue(
        row.scheduleTypeId
      );
      this.LoanReviewOperationForm.controls["interestFrequency"].setValue(
        row.interestFrequencyTypeId
      );
      this.LoanReviewOperationForm.controls["principalfrequency"].setValue(
        row.principalFrequencyTypeId
      );
      this.LoanReviewOperationForm.controls["tenor"].setValue(row.tenor);

      this.LoanReviewOperationForm.controls["principalFirstDate"].setValue(
        new Date(row.firstPrincipalPaymentDate)
      );
      this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(
        new Date(row.firstInterestPaymentDate)
      );
      this.LoanReviewOperationForm.controls["previousMaturityDate"].setValue(
        new Date(row.maturityDate)
      );
      this.LoanReviewOperationForm.controls["maturityDate"].setValue(
        new Date(row.maturityDate)
      );
      this.LoanReviewOperationForm.controls["numberOfPayments"].setValue(
        row.principalNumberOfInstallment
      );
      this.LoanReviewOperationForm.controls["basis"].setValue(
        row.accurialBasis
      );
      this.LoanReviewOperationForm.controls["newInterateRate"].setValue(
        row.interestRate
      );

      this.LoanReviewOperationForm.controls["integralFeeAmount"].setValue(0);
      this.LoanReviewOperationForm.controls["interestChargeType"].setValue(0);
      this.LoanReviewOperationForm.controls["withoutDisburment"].setValue(
        false
      );
      this.LoanReviewOperationForm.controls["productName"].setValue(
        row.productName
      );

      this.calculateTenor();
    }
  }

  enableDisableControl(reviewTypeId) {
    this.displayLoanWorkout = false;
    this.displayPrepayment = false;
    this.terminateAndRebookscatteredMethod = false;
    ////console.log('This is workout', reviewTypeId);
    switch (reviewTypeId) {
      case LMSOperationEnum.InterestRateChange: {

        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = true;
        this.displayRestructure = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case LMSOperationEnum.Restructure: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayRestructure = true;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date(this.data.principalFirstDate));
        this.LoanReviewOperationForm.controls['intrestFirstDate'].setValue(new Date(this.data.intrestFirstDate));
        break;
      }
      case LMSOperationEnum.Prepayment: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        this.displayPrepayment = true;
        break;
      }
      case LMSOperationEnum.PrincipalFrequencyChange: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayPrincipalFrequencyChange = true;
        this.displayInterestFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case LMSOperationEnum.InterestFrequencyChange: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = true;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case LMSOperationEnum.InterestAndPrincipalFrequencyChange: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = true;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.get("proposedEffectiveDate").setValue(new Date(this.systemCurrentDate));
        //this.LoanReviewOperationForm.controls['proposedEffectiveDate'].disable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case LMSOperationEnum.PaymentDateChange: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = true;
        this.displayRestructure = false;
        //this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.get("proposedEffectiveDate").setValue(new Date(this.systemCurrentDate));
        this.LoanReviewOperationForm.get("intrestFirstDate").setValue(new Date(this.systemCurrentDate));
        this.setPrincipalAndInterestDate(this.LoanReviewOperationForm.get("intrestFirstDate").value);
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].enable();
        //this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date());
        //this.LoanReviewOperationForm.controls['intrestFirstDate'].setValue(new Date());
        break;
      }
      case LMSOperationEnum.TenorExtension: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = true;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.get("proposedEffectiveDate").setValue(new Date(this.systemCurrentDate));
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].enable();
        break;
      }
      case LMSOperationEnum.ChangeRepaymentAccount: {
        if (this.selectedLoanReview.scheduleTypeId == 5) {
          this.displayOrHideControl = true;
        }
        this.terminalAndRebook = false;
        this.displayOrHideControl = false;
        this.CASAAccountChange = true;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        this.LoanReviewOperationForm.get("proposedEffectiveDate").setValue(new Date(this.systemCurrentDate));
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case LMSOperationEnum.OverdraftTopup: {
        this.terminalAndRebook = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        // this.Overdrafttopup = true;
        break;
      }
      case LMSOperationEnum.FeeChargeChange: {
        this.terminalAndRebook = false;
        this.displayInterestRate = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.displayRestructure = false;
        // this.FeechargeChange = true;
        break;
      }
      case LMSOperationEnum.TerminateAndRebook: {
        this.displayOrHideControl = false;
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = true;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        //this.displayLoanRebookModal = true;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable()
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date());
        this.LoanReviewOperationForm.controls['intrestFirstDate'].setValue(new Date());
        this.terminateAndRebookBulletMethod = true;
        this.terminateAndRebookAnnuityMethod = true;
        this.LoanReviewOperationForm.get('rebookPrincipalAmount').setValue(this.totalOutstanding);
        this.calculateRebookTenor();
        break;
      }
      case LMSOperationEnum.CompleteWriteOff: {
        // this.terminalAndRebook = false;
        // this.displayRestructure = false;
        // this.displayInterestFrequencyChange = false;
        // this.displayPrincipalFrequencyChange = false;
        // this.displayTenorChange = false;
        // this.displayInterestPrincipalChange = false;
        // this.displayPaymentDateChange = false;
        //this.CompleteWriteOff = true;
        this.displayOrHideControl = false;
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        break;
      }
      case LMSOperationEnum.CancelUndisbursedLoan: {
        this.terminalAndRebook = false;
        this.displayRestructure = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        // this.CancelUndisbursedLoan = true;
        break;
      }
      case LMSOperationEnum.LoanTermination: {

        this.displayOrHideControl = false;
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        break;
      }
      case LMSOperationEnum.LoanReversal: {

        this.displayOrHideControl = false;
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        break;
      }
      case LMSOperationEnum.LoanRecapitilization: {
        this.displayOrHideControl = false;
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = true;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        if (this.selectedLoanReview.scheduleTypeId == 5) {
          this.terminateAndRebookscatteredMethod = true;
          this.balance = this.totalOutstanding;
          this.displayOrHideControl = true;
          this.displayInterestRateNew = true;
          // console.log("Balance",this.balance);
        }
        this.terminateAndRebookBulletMethod = true;
        this.terminateAndRebookAnnuityMethod = true;
        this.LoanReviewOperationForm.controls['proposedEffectiveDate'].enable();
        this.LoanReviewOperationForm.get('rebookPrincipalAmount').setValue(this.totalOutstanding);
        this.LoanReviewOperationForm.get("rebookEffectiveDate").setValue(new Date());;
        this.LoanReviewOperationForm.get("rebookMaturityDate").setValue(new Date());;
        this.calculateRebookTenor();
        break;
      }
      case LMSOperationEnum.LoanWorkOut: {
        this.displayLoanWorkout = true;
        //this.terminateAndRebookscatteredMethod = true;
        this.displayOrHideControl = false;
        // if (this.selectedLoanReview.scheduleTypeId == 5)
        // {
        //   //this.terminateAndRebookscatteredMethod = true;
        //   this.displayOrHideControl = true;
        // }
        this.CASAAccountChange = false;
        this.displayRestructure = false;
        this.displayInterestRate = false;
        this.terminalAndRebook = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        break;
      }
      default: {
        break;
      }
      
    }
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

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  validateEffectiveDate() {

    let previousEffectiveDate = new Date(this.LoanReviewOperationForm.get('proposedEffectiveDate').value);

    if (previousEffectiveDate < new Date(this.systemCurrentDate)) {
      swal('FinTrak Credit 360', "Effective Date Cannot Be Backdated", "error");
      this.LoanReviewOperationForm.get('proposedEffectiveDate').setValue(new Date(this.systemCurrentDate));
    }
  }

  // validateInterestPaymentDate(){

  //   let intrestFirstDate = new Date(this.LoanReviewOperationForm.get('intrestFirstDate').value);

  //   if (intrestFirstDate  < new Date(this.systemCurrentDate)) {
  //     swal('FinTrak Credit 360', "Change Interest Pmt Date Cannot Be Backdated", "error");
  //     this.LoanReviewOperationForm.get('intrestFirstDate').setValue( new Date(this.systemCurrentDate));
  //   }
  // }



  backToLoanReviewList() {
    this.displayLoanReviewList = true;
    this.displayCustomerLoanDetails = false;
    this.displayBackToList = false;
  }
  onscheduleMethodChangedTerminateAndRebook(index) {
    this.scatterdPayments = [];
    let sValue = Number(index);
    if (sValue === 5) {
      this.terminateAndRebookscatteredMethod = true;
      this.terminateAndRebookBallonMethod = false;
      this.terminateAndRebookBulletMethod = false;
      this.terminateAndRebookAnnuityMethod = false;
      this.principalBalance = this.totalOutstanding;
      this.principalValanceString = this.principalBalance; //ConvertString.ToNumberFormate(this.principalBalance);  
    }
    else if (sValue === 3) {
      this.terminateAndRebookscatteredMethod = false;
      this.terminateAndRebookBallonMethod = false;
      this.terminateAndRebookBulletMethod = true;
      this.terminateAndRebookAnnuityMethod = false;
    }
    else if (sValue === 7) {
      this.terminateAndRebookscatteredMethod = false;
      this.terminateAndRebookBallonMethod = false;
      this.terminateAndRebookBulletMethod = false;
      this.terminateAndRebookAnnuityMethod = false;
    }
    else {
      this.terminateAndRebookscatteredMethod = false;
      this.terminateAndRebookBallonMethod = true;
      this.terminateAndRebookBulletMethod = true;
      this.terminateAndRebookAnnuityMethod = true;
    }
  }
  onscheduleMethodChanged(sValue) {
    this.bulletMethod = true;
    this.ballonMethod = true;
    if (sValue === 5) {
      this.scatteredMethod = true;
      this.data.principalAmount = this.selectedLoanReview.principalAmount;
      this.data.interestRate = this.selectedLoanReview.interestRate;
      this.data.loanDate = this.selectedLoanReview.dateTimeCreated;
      // this.data.scheduleMethod = this.scheduleGroupForm.value.scheduleMethod;
      ////console.log(
      //"form driven method id val:",
      // this.scheduleGroupForm.value.scheduleMethod
      // );
      ////console.log("The Principal Amount is:", this.data.principalAmount);
      this.principalBalance = Number(
        this.data.principalAmount.replace(/[,]+/g, "").trim()
      );
      this.principalValanceString = this.principalBalance.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2 }
      );
      // //console.log(
      //   "ggggg",
      //   Number(this.data.principalAmount.replace(/[,]+/g, "").trim())
      // );
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


  convertToNumber(pamount) {

    if (typeof (pamount) == "string") {
      return pamount = pamount.replace(/[^0-9-.]/g, '');
    } else if (typeof (pamount) == "number") {
      return pamount = pamount;
    }

  }



  addToList() {
    this.workoutAmount = this.convertToNumber(this.LoanReviewOperationForm.get("prepayment").value);
    this.total = 0;

    let checkedBalance = 0;

    if (this.selectedLoanReview.scheduleTypeId == 5) {
      let tranch = this.convertToNumber(this.data.amount);
      this.scatterdPayments.forEach(x => this.total += x.paymentAmount);
      this.total = this.total + (+tranch)
      this.balance = this.totalOutstanding - this.total
      checkedBalance = this.balance;
    }
    else {
      let tranch = this.convertToNumber(this.data.amount);
      this.scatterdPayments.forEach(x => this.total += x.paymentAmount);
      this.total = this.total + (+tranch)
      this.balance = this.workoutAmount - this.total
      checkedBalance = this.balance;
    }



    if (checkedBalance < 0) {
      swal('FinTrak Credit 360', "Payment amount cannot be greater than outstanding balance", "error");
      checkedBalance = 0;
      return;
    }
    if (new Date(this.data.scateredDate) < this.applicationDate) {
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
    this.balance = Number(this.balance) + Number(currRecord.paymentAmount);
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

    if (this.data.operationTypeId == 59 || this.data.operationTypeId == 30) {
      if (new Date(formObj.value.rebookInterestFirstPmtDate) > new Date(formObj.value.rebookPrincipalFirstPmtDate)) {
        swal('FinTrak Credit 360', 'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
        return
      }

    }
    if (this.data.operationTypeId == 25) {
      if (new Date(formObj.value.intrestFirstDate) > new Date(formObj.value.principalFirstDate)) {
        swal('FinTrak Credit 360', 'Interest First Payment Date must be less than Principal First Payment Date .', 'info');
        return
      }

    }

    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else {
      this.applicationCollection = [];
    }
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }
    if (this.data.operationTypeId == 51) {
      this.objBody = {
        loanReviewOperationsId: reviewId,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.data.operationTypeId,
        reviewDetails: this.selectedLoanReview.reviewDetails,
        //proposedEffectiveDate: formObj.value.proposedEffectiveDate,
        proposedEffectiveDate: this.LoanReviewOperationForm.controls['proposedEffectiveDate'].value, //formObj.proposedEffectiveDate,
        interateRate: formObj.value.newInterateRate,
        prepayment: formObj.value.prepayment,
        maturityDate: formObj.value.maturityDate,
        principalFrequencyTypeId: formObj.value.principalfrequency,
        interestFrequencyTypeId: formObj.value.interestFrequency,
        //principalFirstPaymentDate: formObj.value.principalFirstDate,
        principalFirstPaymentDate: this.LoanReviewOperationForm.controls['principalFirstDate'].value, //formObj.principalFirstDate,
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
        reviewIrregularSchedule: this.scatterdPayments,
        fees: this.applicationCollection,
        feeSourceModule: "LMS",

      };
    } else if (this.data.operationTypeId == 30 || this.data.operationTypeId == 59) {
      this.objBody = {
        loanReviewOperationsId: reviewId,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.data.operationTypeId,
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
        reviewIrregularSchedule: this.scatterdPayments,
        fees: this.applicationCollection,
        feeSourceModule: "LMS",

      };
    } else {
      this.objBody = {
        loanReviewOperationsId: reviewId,
        loanId: this.selectedLoanReview.loanId,
        lmsApplicationDetailId: this.selectedLoanReview.lmsApplicationDetailId,
        productTypeId: this.selectedLoanReview.productTypeId,
        operationTypeId: this.data.operationTypeId,
        reviewDetails: this.selectedLoanReview.reviewDetails,
        //proposedEffectiveDate: formObj.value.proposedEffectiveDate,
        proposedEffectiveDate: this.LoanReviewOperationForm.controls['proposedEffectiveDate'].value,   //formObj.proposedEffectiveDate,
        interateRate: formObj.value.interestRate,
        prepayment: formObj.value.prepayment,
        maturityDate: formObj.value.maturityDate,
        principalFrequencyTypeId: formObj.value.principalfrequency,
        interestFrequencyTypeId: formObj.value.interestFrequency,
        //principalFirstPaymentDate: formObj.value.principalFirstDate,
        principalFirstPaymentDate: this.LoanReviewOperationForm.controls['principalFirstDate'].value,//formObj.principalFirstDate,
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
        reviewIrregularSchedule: this.scatterdPayments,
        fees: this.applicationCollection,
        feeSourceModule: "LMS",
      };

      if (this.data.operationTypeId == 21) {

      }
    }
    // console.log("REVIEW BODY>>>>>", this.objBody);
    // if (this.selectedLoanReview.loanId != null) return;
    if (this.selectedLoanReview.loanId != null && this.objBody != null) {
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
          __this.loanOperationService.addLoanReviewOperation(__this.objBody).subscribe(res => {
            __this.loadingService.hide();
            if (res.success == true) {
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, "success");
              __this.displayLoanReviewOperationModal = false;

              __this.getApprovedLoanReview();
              __this.backToLoanReviewList();
            } else {
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, "error");
            }
          }, (err) => {
            __this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
          }));
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
      });
    }
  }
  searchCASA(searchString) {
    this.searchAccountTerm$.next(searchString);
  }
  // pickCASASearchedData(item) {
  //     this.LoanReviewOperationForm.controls['accountNumber'].setValue(item.productAccountNumber);
  //     this.LoanReviewOperationForm.controls['cASA_AccountId'].setValue(item.casaAccountId);
  //     //console.log("CASA Account Id", item.casaAccountId)
  //     this.displayCASASearchModal = false;
  // }
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

  setPrincipalAndInterestDate(dateVal) {

    let firstinterestdate = this.LoanReviewOperationForm.get("intrestFirstDate").value;

    this.LoanReviewOperationForm.controls["proposedEffectiveDate"].setValue(new Date(firstinterestdate));

    let refNo = this.selectedLoanReview.loanReferenceNumber;

    this.effectiveDate = new Date(this.LoanReviewOperationForm.get('proposedEffectiveDate').value);
    this.subscriptions.add(
      this.loanPrepaymentService.getPrincipalAndInterestDate(refNo, moment(this.effectiveDate).format('DD-MMM-YYYY')).subscribe((response: any) => {

        if (response.success == true) {
          this.principalData = response.result;
          if (this.principalData != null) {
            //console.log("Me",this.principalData);
            this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date(this.principalData.firstPrincipalPaymentDate));
          }
        }
      }));

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

  validateprincipalFirstDate(dateVal) {
    this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(new Date(dateVal));
    let effectiveDate = this.LoanReviewOperationForm.get("proposedEffectiveDate").value;
    let maturityDate = this.LoanReviewOperationForm.get("maturityDate").value;
    let firstinterestdate = this.LoanReviewOperationForm.get("intrestFirstDate").value;
    let firstprincipaldate = this.LoanReviewOperationForm.get("principalFirstDate").value;

    if (new Date(firstprincipaldate) < new Date(effectiveDate)) {
      this.LoanReviewOperationForm.controls["principalFirstDate"].setValue(new Date(effectiveDate));

      swal(
        "FinTrak Credit 360",
        "First Principal Date cannot be less than Effective Date.",
        "error"
      );
      return;
    }
  }


  validateinterestFirstDate(dateVal) {

    let effectiveDate = this.LoanReviewOperationForm.get("proposedEffectiveDate").value;
    let maturityDate = this.LoanReviewOperationForm.get("maturityDate").value;
    let firstinterestdate = this.LoanReviewOperationForm.get("intrestFirstDate").value;
    let firstprincipaldate = this.LoanReviewOperationForm.get("principalFirstDate").value;

    // if (firstinterestdate  < new Date(this.systemCurrentDate)) {
    swal('FinTrak Credit 360', "Change Interest Pmt Date Cannot Be Backdated", "error");
    //   this.LoanReviewOperationForm.get('intrestFirstDate').setValue( new Date(this.systemCurrentDate));
    // }

    if (new Date(firstinterestdate) < new Date(effectiveDate)) {
      //this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(new Date(effectiveDate));
      this.LoanReviewOperationForm.controls["intrestFirstDate"].setValue(new Date(effectiveDate));

      swal(
        "FinTrak Credit 360",
        "First Interest Date cannot be less than Effective Date.",
        "error"
      );
      return;
    }
  }

  calculateTenor() {
    this.LoanReviewOperationForm.controls["newtenor"].setValue(null);
    let effectiveDate = this.LoanReviewOperationForm.get(
      "proposedEffectiveDate"
    ).value;
    let maturityDate = this.LoanReviewOperationForm.get("maturityDate").value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.LoanReviewOperationForm.controls["maturityDate"].setValue(new Date(effectiveDate));
      //this.LoanReviewOperationForm.controls["maturityDate"].setValue(null);
      swal(
        "FinTrak Credit 360",
        "Effective Date cannot be greater than Maturity Date.",
        "error"
      );
      return;
    }
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
  validateRebookprincipalFirstDate() {
    let effectiveDate = this.LoanReviewOperationForm.get("rebookEffectiveDate").value;
    let maturityDate = this.LoanReviewOperationForm.get("rebookMaturityDate").value;
    let firstinterestdate = this.LoanReviewOperationForm.get("intrestFirstDate").value;
    let firstprincipaldate = this.LoanReviewOperationForm.get("rebookPrincipalFirstPmtDate").value;
    this.setFirstPrincipalPaymentDate(firstprincipaldate);
    this.LoanReviewOperationForm.controls["rebookInterestFirstPmtDate"].setValue(
      new Date(firstprincipaldate)
    );
    if (new Date(firstprincipaldate) < new Date(effectiveDate)) {
      this.LoanReviewOperationForm.controls["rebookPrincipalFirstPmtDate"].setValue(new Date(effectiveDate));

      swal(
        "FinTrak Credit 360",
        "First Principal Date cannot be less than Effective Date.",
        "error"
      );
      return;
    }
  }
  validateRebookinterestFirstDate() {
    let effectiveDate = this.LoanReviewOperationForm.get("rebookEffectiveDate").value;
    let maturityDate = this.LoanReviewOperationForm.get("rebookMaturityDate").value;
    let firstinterestdate = this.LoanReviewOperationForm.get("rebookInterestFirstPmtDate").value;
    let firstprincipaldate = this.LoanReviewOperationForm.get("rebookPrincipalFirstPmtDate").value;
    if (new Date(firstinterestdate) < new Date(effectiveDate)) {
      this.LoanReviewOperationForm.controls["rebookInterestFirstPmtDate"].setValue(new Date(effectiveDate));

      swal(
        "FinTrak Credit 360",
        "First Interest Date cannot be less than Effective Date.",
        "error"
      );
      return;
    }
  }

  getRunningLoanOpeningBalance(payments = null) {

    if (this.operationTypeId == 24 || this.operationTypeId == 25) {
      this.validateEffectiveDate();
    }

    let refNo = this.selectedLoanReview.loanReferenceNumber;
    this.effectiveDate = new Date(this.LoanReviewOperationForm.get('proposedEffectiveDate').value); //this.LoanReviewOperationForm.get('proposedEffectiveDate').value;

    if (this.operationTypeId == LMSOperationEnum.Restructure) {
      this.subscriptions.add(
        this.loanPrepaymentService.getRunningLoanOpeningBalance(refNo, moment(this.effectiveDate).format('DD-MMM-YYYY')).subscribe((response: any) => {

          if (response.success == true) {
            this.openingBalanceData = response.result;
            if (this.openingBalanceData != null) {
              this.openingBalance = ConvertString.ToNumberFormate(this.openingBalanceData.principalAmount);
              this.rebookPrincipalAmount = this.openingBalance;

            }

            // CALL
            if (payments != null) this.generatePeriodicSchedule(this.getScheduleFormData(payments));
          }
        }));
    }
    else if (this.operationTypeId == LMSOperationEnum.InterestAndPrincipalFrequencyChange
      || this.operationTypeId == LMSOperationEnum.InterestRateChange ||
      this.operationTypeId == LMSOperationEnum.TenorExtension || this.operationTypeId == LMSOperationEnum.PaymentDateChange) {
        this.scheduleObj = this.getScheduleFormData(payments);
        //console.log("this.scheduleObj: ", this.scheduleObj);
        if (payments != null) this.generatePeriodicSchedule(this.scheduleObj);
    }


  }
  calculateRebookTenor() {
    this.LoanReviewOperationForm.controls["rebookTenor"].setValue(null);
    let effectiveDate = this.LoanReviewOperationForm.get("rebookEffectiveDate").value;
    let maturityDate = this.LoanReviewOperationForm.get("rebookMaturityDate").value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.LoanReviewOperationForm.controls["rebookMaturityDate"].setValue(new Date(effectiveDate));
      swal(
        "FinTrak Credit 360",
        "Effective Date cannot be greater than Maturity Date.",
        "error"
      );
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.LoanReviewOperationForm.controls["rebookTenor"].setValue(tenor);
  }

  onOperationTypeChange(id) {
    this.operationTypeId = id;

    if (id == 27) { 
      this.otherCustomerAccounts = this.customerAccounts.filter(x => x.casaAccountId != this.selectedLoanReview.casaAccountId);
      if (this.otherCustomerAccounts.length == 0) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'No other CASA account available for change!', 'error');
        return;
      }
    }
    let x = Number(id);
    if (id != undefined) {
      this.selectedLoanReview.loanReviewOperationTypeId = id;
    }
    this.enableDisableControl(x);
    this.LoanReviewOperationForm.get('rebookScheduleMethodId').setValue('');
  }


  totalAmount: any;
  principalAmount: number;
  generateData: any = {};
  displayLoanDetailsModal: boolean;
  displayIrregularSchedule: boolean = false;
  displayRegularSchedule: boolean = false;
  displayMaturityDate: boolean = false;
  displayEffectiveDate: boolean = false;
  bodyObj: any = {};

  generateIrregularScheduleRebooks() {

    this.loadingService.show();
    var payments = [];
    this.scatterdPayments.forEach((v) => {
      payments.push({
        paymentDate: v.paymentDate,
        paymentAmount: v.paymentAmount
      });
    })


    if (this.selectedLoanReview.scheduleTypeId == 5) {
      this.bodyObj = {
        // scheduleMethodId:this.selectedLoanReview.scheduleTypeId,
        // principalAmount: this.LoanReviewOperationForm.get('rebookPrincipalAmount').value,
        // effectiveDate: this.LoanReviewOperationForm.get('rebookEffectiveDate').value,
        // interestRate: this.LoanReviewOperationForm.get('rebookInterestRate').value,
        // principalFrequency: this.LoanReviewOperationForm.get('rebookPrincipalFrequencyId').value,
        // interestFrequency: this.LoanReviewOperationForm.get('rebookInterestFrequencyId').value,
        // tenor: this.LoanReviewOperationForm.get('rebookTenor').value,
        // principalFirstpaymentDate: this.LoanReviewOperationForm.get('rebookPrincipalFirstPmtDate').value,
        // interestFirstpaymentDate: this.LoanReviewOperationForm.get('rebookInterestFirstPmtDate').value,
        // maturityDate: this.LoanReviewOperationForm.get('rebookMaturityDate').value,
        // accrualBasis: this.LoanReviewOperationForm.get('rebookBasis').value,
        // prepaymentMethodId: this.operationTypeId,
        // //integralFeeAmount: this.LoanReviewOperationForm.get('intrestFirstDate').value,
        // firstDayType: this.LoanReviewOperationForm.get('rebookInterestChargeType').value,
        // irregularPaymentSchedule: payments,

        scheduleMethodId: this.selectedLoanReview.scheduleTypeId,
        //principalAmount: this.rebookPrincipalAmount,
        operationTypeId: this.operationTypeId,
        // principalAmount: this.selectedLoanReview.outstandingPrincipal,
        principalAmount: this.totalOutstanding,
        effectiveDate: moment(this.LoanReviewOperationForm.get('proposedEffectiveDate').value).format('DD-MMM-YYYY'),
        interestRate: this.LoanReviewOperationForm.get('interestRate').value,
        principalFrequency: this.LoanReviewOperationForm.get('principalfrequency').value,
        interestFrequency: this.LoanReviewOperationForm.get('interestFrequency').value,
        tenor: this.LoanReviewOperationForm.get('newtenor').value == true ? this.generateData.teno : this.LoanReviewOperationForm.get('newtenor').value,
        principalFirstpaymentDate: moment(this.LoanReviewOperationForm.get('principalFirstDate').value).format('DD-MMM-YYYY'),
        interestFirstpaymentDate: moment(this.LoanReviewOperationForm.get('intrestFirstDate').value).format('DD-MMM-YYYY'),
        // principalFirstpaymentDate: new Date('2018-10-29'),
        // interestFirstpaymentDate: new Date('2018-10-29'),
        maturityDate: moment(this.LoanReviewOperationForm.get('maturityDate').value).format('DD-MMM-YYYY'),
        irregularPaymentSchedule: payments,
        isExistingFacility: true,
        principalFrequencyTypeId: this.LoanReviewOperationForm.get('principalfrequency').value,
        interestFrequencyTypeId: this.LoanReviewOperationForm.get('interestFrequency').value,
        loanId: this.selectedLoanReview.loanId,

      };
    }
    else {
      this.bodyObj = {
        scheduleMethodId: this.LoanReviewOperationForm.get('rebookScheduleMethodId').value,
        //scheduleMethodId:this.selectedLoanReview.scheduleTypeId,
        principalAmount: this.LoanReviewOperationForm.get('rebookPrincipalAmount').value,
        effectiveDate: this.LoanReviewOperationForm.get('rebookEffectiveDate').value,
        interestRate: this.LoanReviewOperationForm.get('rebookInterestRate').value,
        principalFrequency: this.LoanReviewOperationForm.get('rebookPrincipalFrequencyId').value,
        principalFrequencyTypeId: this.LoanReviewOperationForm.get('rebookPrincipalFrequencyId').value,
        interestFrequency: this.LoanReviewOperationForm.get('rebookInterestFrequencyId').value,
        interestFrequencyTypeId: this.LoanReviewOperationForm.get('rebookInterestFrequencyId').value,
        tenor: this.LoanReviewOperationForm.get('rebookTenor').value,
        principalFirstpaymentDate: this.LoanReviewOperationForm.get('rebookPrincipalFirstPmtDate').value,
        interestFirstpaymentDate: this.LoanReviewOperationForm.get('rebookInterestFirstPmtDate').value,
        maturityDate: this.LoanReviewOperationForm.get('rebookMaturityDate').value,
        accrualBasis: this.LoanReviewOperationForm.get('rebookBasis').value,
        prepaymentMethodId: this.operationTypeId,
        operationTypeId: this.operationTypeId,
        isExistingFacility: true,
        //integralFeeAmount: this.LoanReviewOperationForm.get('intrestFirstDate').value,
        firstDayType: this.LoanReviewOperationForm.get('rebookInterestChargeType').value,
        irregularPaymentSchedule: payments,
      };
    }


    ////console.log("this.bodyObj2",this.bodyObj);
    this.subscriptions.add(
      this.loanSrv.generatePeriodicSchedule(this.bodyObj)
        .subscribe((res) => {
          this.loadingService.hide();
          if (res.success == true) {

            if (res.result.length) {
              var details = {
                principalAmount: this.principalAmount,
                interestRate: this.LoanReviewOperationForm.get('rebookInterestRate').value,
                effectiveDate: this.LoanReviewOperationForm.get('rebookEffectiveDate').value,
                maturityDate: '',
                effectiveInterestRate: 0,
                schedules: res.result
              }

              this.schedules = details.schedules;
              this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
              details.maturityDate = this.maturityDate;
              details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
              this.scheduleHeader = details;

              //console.log("schedules",this.scheduleHeader);

              this.displayScheduleModalForm = true;

              this.loadingService.hide();
            }
          } else {
            swal('FinTrak Credit 360', res.message, "error");
          }

        }, (err) => {
          swal('FinTrak Credit 360', err || "An unknown error has occured", "error");
        }));
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

    this.paymentsObj = payments;

    if (this.operationTypeId == LMSOperationEnum.Restructure) {
      this.getRunningLoanOpeningBalance(payments);
      // setTimeout(()=>{
      //   this.getRunningLoanOpeningBalance()
      // },4000);
    } else if (this.operationTypeId == LMSOperationEnum.InterestAndPrincipalFrequencyChange) {
      this.getRunningLoanOpeningBalance(payments);

    } else if (this.operationTypeId == LMSOperationEnum.TenorExtension) {
      this.getRunningLoanOpeningBalance(payments);

    } else if (this.operationTypeId == LMSOperationEnum.InterestRateChange) {
      this.getRunningLoanOpeningBalance(payments);
    }
    else if (this.operationTypeId == LMSOperationEnum.PaymentDateChange) {

      this.getRunningLoanOpeningBalance(payments);
      // if(this.operationTypeId == LMSOperationEnum.PaymentDateChange){
      //   console.log("Me To You");
      //  }

    }
    else {
      this.rebookPrincipalAmount = this.LoanReviewOperationForm.get('rebookPrincipalAmount').value;
    }


  }

  getScheduleFormData(payments) {


    if (this.generateData.scheduleTypeCategoryId === 2) {

      if (Number(this.principalValanceString) > 0 || Number(this.principalValanceString) < 0) {
        swal('FinTrak Credit 360', "Payment amount must be equal to principal amount", "error");
        return;
      }

      if (this.operationTypeId == LMSOperationEnum.Restructure ||
        this.operationTypeId == LMSOperationEnum.InterestAndPrincipalFrequencyChange ||
        this.operationTypeId == LMSOperationEnum.InterestRateChange ||
        this.operationTypeId == LMSOperationEnum.TenorExtension || this.operationTypeId == LMSOperationEnum.PaymentDateChange
      ) {
        this.getRunningLoanOpeningBalance();
      } else {
        this.rebookPrincipalAmount = this.LoanReviewOperationForm.get('rebookPrincipalAmount').value;
      }

      this.bodyObj = {
        scheduleMethodId: this.selectedLoanReview.scheduleTypeId,
        principalAmount: this.rebookPrincipalAmount,
        operationTypeId: this.operationTypeId,
        //principalAmount: this.selectedLoanReview.outstandingPrincipal,
        // principalAmount: this.totalOutstanding,
        effectiveDate: this.LoanReviewOperationForm.get('proposedEffectiveDate').value,
        interestRate: this.generateData.interestRate,
        accrualBasis: this.generateData.accrualBasis,
        integralFeeAmount: this.generateData.integralFeeAmount,
        irregularPaymentSchedule: payments
      };
    }
    else {
      this.bodyObj = {
        scheduleMethodId: this.selectedLoanReview.scheduleTypeId,
        principalAmount: this.rebookPrincipalAmount,
        operationTypeId: this.operationTypeId,
        // principalAmount: this.selectedLoanReview.outstandingPrincipal,
        // principalAmount: this.totalOutstanding,
        effectiveDate: moment(this.LoanReviewOperationForm.get('proposedEffectiveDate').value).format('DD-MMM-YYYY'),
        interestRate: this.LoanReviewOperationForm.get('newInterateRate').value,
        principalFrequency: this.LoanReviewOperationForm.get('principalfrequency').value,
        interestFrequency: this.LoanReviewOperationForm.get('interestFrequency').value,
        tenor: this.LoanReviewOperationForm.get('newtenor').value == true ? this.generateData.teno : this.LoanReviewOperationForm.get('newtenor').value,
        principalFirstpaymentDate: moment(this.LoanReviewOperationForm.get('principalFirstDate').value).format('DD-MMM-YYYY'),
        interestFirstpaymentDate: moment(this.LoanReviewOperationForm.get('intrestFirstDate').value).format('DD-MMM-YYYY'),
        // principalFirstpaymentDate: new Date('2018-10-29'),
        // interestFirstpaymentDate: new Date('2018-10-29'),
        maturityDate: moment(this.LoanReviewOperationForm.get('maturityDate').value).format('DD-MMM-YYYY'),
        irregularPaymentSchedule: [],


        principalFrequencyTypeId: this.LoanReviewOperationForm.get('principalfrequency').value,
        interestFrequencyTypeId: this.LoanReviewOperationForm.get('interestFrequency').value,
        loanId: this.selectedLoanReview.loanId,
      };

      this.rebookPrincipalAmount = null; // <------------------------------------?????

      if (this.operationTypeId == LMSOperationEnum.Restructure && this.bodyObj.principalAmount < 1) this.bodyObj.principalAmount = this.selectedLoanReview.outstandingPrincipal;
      if (this.operationTypeId == LMSOperationEnum.InterestAndPrincipalFrequencyChange) {

        this.bodyObj.loanId = this.selectedLoanReview.loanId;
        this.bodyObj.scheduleMethodId = this.selectedLoanReview.scheduleTypeId,
        this.bodyObj.interestRate = this.selectedLoanReview.interestRate;
        this.bodyObj.isExistingFacility = true;
        this.bodyObj.maturityDate = moment(this.selectedLoanReview.maturityDate).format('DD-MMM-YYYY');
        this.bodyObj.principalAmount = this.selectedLoanReview.outstandingPrincipal;
      }
      if (this.operationTypeId == LMSOperationEnum.InterestRateChange) {

        this.bodyObj.loanId = this.selectedLoanReview.loanId;
        this.bodyObj.scheduleMethodId = this.selectedLoanReview.scheduleTypeId,
          this.bodyObj.principalFrequencyTypeId = this.selectedLoanReview.principalFrequencyTypeId;
        this.bodyObj.isExistingFacility = true; //interestRate
        this.bodyObj.maturityDate = moment(this.selectedLoanReview.maturityDate).format('DD-MMM-YYYY');
        this.bodyObj.interestFrequencyTypeId = this.selectedLoanReview.interestFrequencyTypeId;
        this.bodyObj.principalAmount = this.selectedLoanReview.outstandingPrincipal;
        this.bodyObj.interestRate = this.LoanReviewOperationForm.get('interestRate').value;

      }
      if (this.operationTypeId == LMSOperationEnum.TenorExtension) {
        this.bodyObj.loanId = this.selectedLoanReview.loanId;
        this.bodyObj.scheduleMethodId = this.selectedLoanReview.scheduleTypeId,
        this.bodyObj.principalFrequencyTypeId = this.selectedLoanReview.principalFrequencyTypeId;
        this.bodyObj.isExistingFacility = true;
        this.bodyObj.interestRate = this.selectedLoanReview.interestRate;
        this.bodyObj.interestFrequencyTypeId = this.selectedLoanReview.interestFrequencyTypeId;
        this.bodyObj.principalAmount = this.selectedLoanReview.outstandingPrincipal;
      }
      if (this.operationTypeId == LMSOperationEnum.PaymentDateChange) {
        //console.log("Test 1");
        this.bodyObj.loanId = this.selectedLoanReview.loanId;
        this.bodyObj.scheduleMethodId = this.selectedLoanReview.scheduleTypeId,
        this.bodyObj.principalFrequencyTypeId = this.selectedLoanReview.principalFrequencyTypeId;
        this.bodyObj.isExistingFacility = true;
        this.bodyObj.interestRate = this.selectedLoanReview.interestRate;
        this.bodyObj.interestFrequencyTypeId = this.selectedLoanReview.interestFrequencyTypeId;
        this.bodyObj.principalAmount = this.selectedLoanReview.outstandingPrincipal;
      }

    }

    return this.bodyObj;
  }

  generatePeriodicSchedule(formData) {

    //console.log("Test 2");
    this.subscriptions.add(
      this.loanSrv.generatePeriodicSchedule(this.bodyObj)
        .subscribe((res) => {

          this.loadingService.hide();

          if (res.success == true) {

            if (res.result.length) {


              var details = {
                principalAmount: this.totalOutstanding,
                interestRate: this.bodyObj.interestRate,
                effectiveDate: this.LoanReviewOperationForm.get('proposedEffectiveDate').value, // '',
                maturityDate: '',
                effectiveInterestRate: 0,
                schedules: res.result
              }

              this.schedules = details.schedules;
              this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
              details.maturityDate = this.maturityDate;
              // this.effectiveDate = this.bodyObj.effectiveDate;
              // details.effectiveDate = this.bodyObj.effectiveDate;
              //// details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
              this.scheduleHeader = details;


              // var details = {
              //    principalAmount: this.totalOutstanding,
              //    interestRate: this.bodyObj.interestRate,// this.LoanReviewOperationForm.get('newInterateRate').value,
              //    effectiveDate: this.bodyObj.effectiveDate, //this.LoanReviewOperationForm.get('proposedEffectiveDate').value,
              //    maturityDate: '',
              //   effectiveInterestRate: 0,
              //   schedules: res.result
              // }

              // this.schedules = details.schedules;
              // this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
              // details.maturityDate = this.maturityDate;
              // //details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
              //  //this.scheduleHeader = details;

              //console.log("Object Header",this.bodyObj);

              this.displayScheduleModalForm = true;
              this.loadingService.hide();
            }
            this.loadingService.hide();

          } else {
            this.loadingService.hide();

            swal('FinTrak Credit 360', res.message, "error");
          }

        }, (err) => {
          this.loadingService.hide();

          swal('FinTrak Credit 360', err || "An unknown error has occured", "error");
        }));
  }


  getRunningLoan(refNo) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanPrepaymentService.getRunningLoan(refNo).subscribe((response: any) => {
        this.loadingService.hide()
        if (response.success == true) {
          this.loanPrepaymentData = response.result;
          if (this.loanPrepaymentData != null) {
            const row = this.loanPrepaymentData;
            this.totalAmount = ConvertString.ToNumberFormate(row.outstandingPrincipal + row.pastDueTotal);
            this.generateData = row;

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
          swal('FinTrak Credit 360', response.message, "error");

        }

      }));
  }

  calculateBalance(event) {
    ////console.log("e no dey fire", event);

    let totalAmount = this.totalOutstanding;
    let newPrincipalBalance = (Number(totalAmount) - Number(event.replace(/[,]+/g, "").trim()));
    this.principalValanceString = parseFloat(Number(newPrincipalBalance).toFixed(2));
    if (Number(this.principalValanceString) < 0) {
      swal('FinTrak Credit 360', "Payment Amount cannot be greater than Total Amount", "error");
      this.LoanReviewOperationForm.controls['prepayment'].setValue(0);
      return;
    }
  }

  getApplicationDate() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.applicationDate = userInfo.applicationDate;
  }


  //====================================================================================

  refer() {
    // this.forwardAction = ApprovalStatus.REFERRED;
    // this.displayCommentForm = true;
    // this.commentTitle = 'Refer Back';
    // this.getTrail();
    // let control = this.commentForm.controls['trailId'];
    // control.setValidators([Validators.required]);
    // control.updateValueAndValidity();
    // this.commentForm.controls['vote'].setValue(5);
    this.displayReferBackForm = true;
  }

  getTrail() {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getTrailLms(this.loanApplDetailId, this.synOperationId).subscribe((response: any) => {
        this.trail = response.result;
        this.trailCount = this.trail.length;
        this.trailRecent = response.result[0];
        this.referBackTrail();
        response.result.forEach((trail) => {
          if (this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
            this.trailLevels.push(trail);
          }
        });

        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }


  referBackTrail(): any {
    this.trail.forEach(x => {
      if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId
        && t.requestStaffId == x.requestStaffId) == null && x.fromApprovalLevelId != null) {
        this.backtrail.push({
          approvalTrailId: x.approvalTrailId,
          fromApprovalLevelId: x.fromApprovalLevelId,
          fromApprovalLevelName: x.fromApprovalLevelName,
          requestStaffId: x.requestStaffId,
          staffName: x.staffName,
        });
      }
    });
  }

  canSupport() {
    return this.privilege.canApprove && this.forwardAction != 3 && this.facilityCount > 1;
  }

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
    groupRoleId: 1, // bu,ca,md,comm,bd
  };

  onLineItemChange(input, value, id = null) {
    if (value.toString().trim() == '') return;
    this.selectedLineId = id == null ? this.selectedLineId : +id;
    let item = this.recommendedItems.find(x => x.detailId == this.selectedLineId);
    if (item == null) {
      let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
      let newRecommendation = {
        detailId: o.loanApplicationDetailId,
        statusId: o.statusId,
        amount: o.approvedAmount,
        interestRate: o.approvedRate,
        tenor: o.approvedTenor,
        convertedAmount: o.convertedApprovedAmount
      };
      this.recommendedItems.push(newRecommendation);
      item = newRecommendation;
    }
    if (input == 1) { value = this.formatMCleanup(value); } // resolve the null=0 bug
    switch (input) {
      case 1: item.amount = value; /*item.convertedAmount = value * item.exchangeRate;*/ break;
      case 2: item.interestRate = value; break;
      case 3: item.tenor = value * 30; break;
      case 5: item.statusId = value; this.commentForm.controls['statusId'].setValue(value); this.setProductApprovalStatus(value); break;
    }
    this.touchedLineItems.push(this.selectedLineId); // mark change made here *
  }

  formatMCleanup(value) {
    var numberPart = value.substr(0, value.length - 1);
    var readablePart: string = value.substr(-1);
    numberPart = parseFloat(numberPart.replace(/,/g, '')).toString();
    if (readablePart === 'M' || readablePart == 'm') {
      return Number(numberPart) * 1000000;
    } else if (readablePart === 'T' || readablePart == 't' || readablePart === 'K' || readablePart === 'k') {
      return Number(numberPart) * 1000;
    } else if (readablePart === 'b' || readablePart === 'B') {
      return Number(numberPart) * 1000000000;
    } else {
      return Number(numberPart);
    }
  }


  setProductApprovalStatus(value) {
    let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
    o.statusId = value;
  }

  onTargetStaffLevelChange(trailId) {
    let selected = this.trail.find(x => x.approvalTrailId == trailId);
    if (selected != null) {
      this.receiverStaffId = selected.requestStaffId;
      this.receiverLevelId = selected.fromApprovalLevelId;
    }
  }

  forwardCam(form) {
    var promptMessage;
    const __this = this;
    let body = {
      forwardAction: __this.forwardAction,
      applicationId: __this.loanApplDetailId,
      operationId: __this.synOperationId,
      receiverLevelId: __this.receiverLevelId,
      receiverStaffId: __this.receiverStaffId,
      comment: form.value.comment,
      vote: +form.value.vote,
      isBusiness: __this.isBusiness,
      recommendedChanges: __this.recommendedItems,
      reviewStageId: 1,
      isFlowTest: true
    };

    if (__this.forwardAction == 5) { body.isFlowTest = false }
    __this.errorMessage = '';

    __this.loadingService.show();
    __this.reviewService.forwardApplication(body).subscribe((response: any) => {
      __this.loadingService.hide();
      if (response.success == true) {
        if (__this.forwardAction == 5) {

          __this.reset();
          __this.displayCommentForm = false;
          __this.loadingService.hide();

        }

        if (response.stateId == 3) {
          if (this.synOperationId == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will been <strong>${response.statusName} and sent to operations.</strong> `, 'success'); }

          if (this.synOperationId != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName} and sent to availment</strong> `, 'success'); }

          else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName}</strong>`, 'success'); }
        }

        else {
          promptMessage = 'Application Status: ' + response.result.statusName + '. \n Next Approver: ' + response.result.nextLevelName + '-' + response.result.nextPersonName;
        }
        swal({
          title: 'Workflow Destination Route',
          text: promptMessage + '\n Do you want to proceed?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          confirmButtonClass: 'btn btn-success btn-move',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: true,
        }).then(function () {
          body.isFlowTest = false;
          __this.loadingService.show();
          __this.subscriptions.add(__this.reviewService.forwardApplication(body).subscribe((response: any) => {
            if (response.success == true) {
              __this.reset();
              __this.displayCommentForm = false;
              // __this.clearControls();
              __this.loadingService.hide();
              __this.displayApplicationStatusMessage(response.result);
            } else {
              __this.finishBad(response.message);
              __this.errorMessage = response.message;
            }
          }, (err: any) => {
            __this.finishBad(JSON.stringify(err));
            __this.errorMessage = err;
          }));
        }, function (dismiss) {
          if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
        });

      } else {
        __this.finishBad(response.message);
        __this.errorMessage = response.message;
      }
    }, (err: any) => {
      __this.finishBad(JSON.stringify(err));
    });

  }

  reset() {
    let control = this.commentForm.controls['trailId'];
    control.setValidators(null);
    control.updateValueAndValidity();

  }

  displayApplicationStatusMessage(response) {
    if (response.stateId == 3) {
      if (this.synOperationId == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}.</strong> Sent to operations.`, 'success'); }

      if (this.synOperationId != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}.</strong>`, 'success'); }

      else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}</strong>`, 'success'); }
    }
    else
      swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message = 'ok') {
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }


  cancelForm() {
    this.displayCommentForm = false;
    this.errorMessage = '';
    this.receiverLevelId = null;
    this.receiverStaffId = null;
  }

  onLineRowSelect(row) {
    this.enebleFacilityChange = this.enableChanges();
    this.selectedLineId = row.loanApplDetailId; // tobe used @ onLineItemChange()
    this.clearRecommendationForm(this.selectedLineId);
    let item = this.recommendedItems.find(x => x.detailId == row.loanApplDetailId);
    if (item == null) { return; }
    this.commentForm.controls['principal'].setValue(item.amount);
    this.commentForm.controls['rate'].setValue(item.interestRate);
    this.commentForm.controls['tenor'].setValue(item.tenor);
    this.commentForm.controls['statusId'].setValue(item.statusId);
  }


  enableChanges() {
    return (this.isAnalyst == true && this.privilege.canMakeChanges == true)
      || (this.privilege.canApprove == true && this.privilege.canMakeChanges == true);
  }


  clearRecommendationForm(id = null) {
    this.commentForm.controls['principal'].setValue('');
    this.commentForm.controls['rate'].setValue('');
    this.commentForm.controls['tenor'].setValue('');
    this.commentForm.controls['statusId'].setValue(this.getProductApprovalStatus());
  }

  getProductApprovalStatus() {
    let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
    return o.statusId;
  }

  disapprove() {
    this.forwardAction = ApprovalStatus.DISAPPROVED;
    this.displayCommentForm = true;
    this.commentTitle = 'Disapprove';
    this.commentForm.controls['vote'].setValue(1);
  }

  clearControls() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required], // debug_test, flow_test
      vote: [2, Validators.required],
      principal: [''],
      rate: [''],
      tenor: [''],
      productId: [''],
      trailId: [''],
      statusId: [''],
      exchangeRate: [''],
      initialExposure: [''],
      totalExposure: [''],
      newExposure: [''],
    });

    this.searchForm = this.fb.group({
      searchString: ['', Validators.required]
    });
  }

  DownloadSchedule(scheduleObj) {
    this.loadingService.show();   
    // var payments = [];

    // payments.push({
    //   paymentDate: new Date(),
    //   paymentAmount: 500
    // });

    let body = {
      scheduleMethodId: scheduleObj.scheduleMethodId,
      principalAmount: scheduleObj.principalAmount,
      effectiveDate: scheduleObj.effectiveDate,
      interestRate: scheduleObj.interestRate,
      principalFrequency: scheduleObj.principalFrequency,
      interestFrequency: scheduleObj.interestFrequency,
      tenor: scheduleObj.tenor,
      // principalFirstpaymentDate: scheduleObj.principalFirstpaymentDate,
      // interestFirstpaymentDate: scheduleObj.interestFirstpaymentDate,

      principalFirstpaymentDate: scheduleObj.effectiveDate,
      interestFirstpaymentDate: scheduleObj.effectiveDate,
      maturityDate: scheduleObj.maturityDate,

      accrualBasis: scheduleObj.accrualBasis,
      integralFeeAmount: scheduleObj.integralFeeAmount,

      firstDayType: scheduleObj.interestFrequencyTypeId,
      irregularPaymentSchedule: this.paymentsObj,
      //formData: this.scheduleGroupForm.value,
    };

    this.loanSrv.getScheduleInExcelFormat(body).subscribe((response: any) => {
      this.loadingService.hide();
      let scheduleData = response.result;

      if (scheduleData != undefined) {
        var byteString = atob(scheduleData);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        var bb = new Blob([ab]);
        // var file = new File([bb], 'Schedule.xlsx', { type: 'application/vnd.ms-excel' });
        //saveAs(file)

        try {
          var file = new File([bb], 'LmsSchedule.xlsx', { type: 'application/vnd.ms-excel' });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
          window.navigator.msSaveBlob(textFileAsBlob, 'LmsSchedule.xlsx');
        }
      }
    });
  }

  displayStatus(event) {
    if(event == true) {
        this.displayReferBackForm = false;
        // this.getApprovedLoanReview();
        // this.backToLoanReviewList();
    }
}

  afterReferBackSuccess(event) {
    // swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
    this.displayReferBackForm = false;
    this.getApprovedLoanReview();
    this.backToLoanReviewList();
    //this.displayCommentForm = false;
  }

  showSearchForm() { this.displaySearchForm = true; }

  submitForm(formObj) {
    this.loadingService.show();
      this.loanOperationService.getApprovedLoanReviewSearch(formObj.value.searchString).subscribe((res) => {
        if (res.success == true) {
          this.approvedLoanReviewData = res.result;
          this.displaySearchForm=false;
          this.clearControl();
        } 
        this.loadingService.hide();
      }, (err: any) => {
        this.loadingService.hide(1000);
      });
  }


}
