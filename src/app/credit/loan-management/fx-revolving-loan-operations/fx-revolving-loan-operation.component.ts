import { ConvertString, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { CustomerService } from "../../../customer/services/customer.service";
import { CasaService } from "../../../customer/services/casa.service";
import { Subject } from "rxjs";
import swal from "sweetalert2";
import { LoadingService } from "../../../shared/services/loading.service";
import { LoanService } from "../../services/loan.service";
import { DateUtilService } from "../../../shared/services/dateutils";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoanOperationService } from "../../services/loan-operations.service";
import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from 'app/admin/services/authentication.service';

@Component({
  selector: 'app-fx-revolving-loan-operation.component',
  templateUrl: './fx-revolving-loan-operation.component.html',
  styles: [`.ui-datepicker {top: 20px !important;}`]

})
export class FXRevolvingLoanReviewOperationsComponent implements OnInit {
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
  terminateAndRebookscatteredMethod: boolean = false;
  terminateAndRebookBallonMethod: boolean = false;
  terminateAndRebookBulletMethod: boolean = false;
  terminateAndRebookAnnuityMethod: boolean = false;
  systemCurrentDate: any;
  lmsApplicationDetailId: number = 0;
  displayRolloverModal: boolean;
  displayInterestChangeModal: boolean;
  displayTenorChangeModal: boolean;
  displaySubAllocationChangeModal: boolean;
  systemDate: Date;
  displayAutomaticRolloverModal: boolean;

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
    this.casaService
      .searchForAccount(this.searchAccountTerm$)
      .subscribe(results => {
        this.casaSearchResults = results.result;
      });
  }
  ngOnInit() {
    this.loadingService.show();
    this.displayLoanReviewList = true;
    this.CASAAccountChange = false;
    this.getApprovedFXRevolvingLoanReview();
    this.displayOrHideControl = true;
    this.getDayCount();
    this.initializeForm();
    this.getFrequencyTypes();
    this.GetOperationType();
    this.getAllLoanScheduleTypes();

    const userInfo = this.authService.getUserInfo();
        this.systemDate = userInfo.applicationDate;
        //this.username = userInfo.userName;
  }
  getDayCount() {
    this.loanSrv.getLoanDayCount().subscribe(res => {
      this.basis = res.result;
    });
  }
  getCustomerAccounts(customerId) {
    this.casaService
      .getAllCustomerAccountByCustomerId(customerId)
      .subscribe(response => {
        this.customerAccounts = response.result;
      });
  }
  getFrequencyTypes() {
    this.loanSrv.getFrequencyTypes().subscribe(res => {
      this.frequencies = res.result;
    });
  }
  getLoanScheduleTypes(productTypeId: number) {
    this.loanSrv.getLoanScheduleTypes(productTypeId).subscribe(res => {
      this.scheduleTypes = res.result;
    });
  }
  getAllLoanScheduleTypes() {
    this.loanSrv.getAllLoanScheduleTypes().subscribe(res => {
      this.allScheduleTypes = res.result;
    });
  }
  getApprovedFXRevolvingLoanReview() {
    this.loanOperationService.getApprovedFXRevolvingLoanReview().subscribe(results => {
      this.loadingService.hide();
      this.approvedLoanReviewData = results.result;
    }); 
  }
  
  GetOperationType() {
    this.loanOperationService.getOperationType(true).subscribe(results => {
      this.operationTypes = results.result;
      this.operationTypes.forEach( (item, index) => { 
        if(Number(item.operationTypeId) != LMSOperationEnum.InterestRateChange  || Number(item.operationTypeId) != LMSOperationEnum.TenorExtension){
          //this.operationTypes.splice(index,1);
          item.required = true;
        } 
      });
      this.operationTypes = this.operationTypes.filter(x=>x.required == true);
    });
  }

  fxRevolvingOperations = {
    tenorChange : 1,
    interestRateChange : 2,
  }
  onSelectedLoanReviewChange(event) {
    this.selectedLoanReview = event.data;
    this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
    this.entityName = "Perform Loan Review Operation For: " + this.selectedLoanReview.customerName;
    this.termLoanId = this.selectedLoanReview.loanId;

    this.getLoanScheduleTypes(this.selectedLoanReview.productTypeId);
    this.data.scheduleMethod = this.selectedLoanReview.scheduleTypeId;
    this.data.principalAmount = this.selectedLoanReview.outstandingPrincipal;
    this.data.interestRate = this.selectedLoanReview.interestRate;
    this.data.loanDate = new Date(this.selectedLoanReview.effectiveDate);
    this.data.basis = this.selectedLoanReview.basis;
    this.data.integralFeeAmount = this.selectedLoanReview.accurialBasis;
    //this.data.operationTypeId = this.selectedLoanReview.loanReviewOperationTypeId;
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
    this.enableDisableControl(
      this.selectedLoanReview.loanReviewOperationTypeId
    );
    this.loaddataForm(this.selectedLoanReview);
    this.getCustomerAccounts(this.selectedLoanReview.customerId);
    this.displayLoanReviewList = false;
    this.displayCustomerLoanDetails = true;
    this.displayBackToList = true;
  }
  showLoanReviewForm() {
    this.loaddataForm(this.selectedLoanReview);
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
      rebookPrincipalFirstPmtDate: [""]
    });
  }
  loaddataForm(data) {
    if (data != undefined) {
      const row = data;
      this.LoanReviewOperationForm.controls["proposedEffectiveDate"].setValue(
        new Date(this.systemCurrentDate)
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
    switch (reviewTypeId) {
      case 19: {
        this.terminalAndRebook = false;
        this.displayOrHideControl = true;
        this.CASAAccountChange = false;
        this.displayInterestRate = true;
        this.displayRestructure = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 51: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date());
        this.LoanReviewOperationForm.controls['intrestFirstDate'].setValue(new Date());
        break;
      }
      case 21: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 22: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 23: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 24: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 25: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].enable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].enable();
        this.LoanReviewOperationForm.controls['principalFirstDate'].setValue(new Date());
        this.LoanReviewOperationForm.controls['intrestFirstDate'].setValue(new Date());
        break;
      }
      case 26: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 27: {
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
        this.LoanReviewOperationForm.controls['principalFirstDate'].disable();
        this.LoanReviewOperationForm.controls['intrestFirstDate'].disable();
        break;
      }
      case 28: {
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
      case 29: {
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
      case 30: {
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
      case 31: {
        this.terminalAndRebook = false;
        this.displayRestructure = false;
        this.displayInterestFrequencyChange = false;
        this.displayPrincipalFrequencyChange = false;
        this.displayTenorChange = false;
        this.displayInterestPrincipalChange = false;
        this.displayPaymentDateChange = false;
        //this.CompleteWriteOff = true;
        break;
      }
      case 32: {
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
      case 34: {

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
      case 17: {

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
      case 59: {
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

        this.terminateAndRebookBulletMethod = true;
        this.terminateAndRebookAnnuityMethod = true;
        this.LoanReviewOperationForm.get('rebookPrincipalAmount').setValue(this.totalOutstanding);
        this.calculateRebookTenor();
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

  backToLoanReviewList() {
    this.displayLoanReviewList = true;
    this.displayCustomerLoanDetails = false;
    this.displayBackToList = false;
  }
  onscheduleMethodChangedTerminateAndRebook(index) {
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
    this.loadingService.show();
    if (this.data.operationTypeId == 51) {
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
    } else if (this.data.operationTypeId == 30 || this.data.operationTypeId == 59) {
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
      this.loanOperationService.addLoanReviewOperation(this.objBody).subscribe(
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
      );
    }
  }
  searchCASA(searchString) {
    this.searchAccountTerm$.next(searchString);
  }
  // pickCASASearchedData(item) {
  //     this.LoanReviewOperationForm.controls['accountNumber'].setValue(item.productAccountNumber);
  //     this.LoanReviewOperationForm.controls['cASA_AccountId'].setValue(item.casaAccountId);

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
    if (new Date(effectiveDate) > new Date(maturityDate)) {
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
    let caose = Number(event);
    if (event != undefined) {
      this.selectedLoanReview.loanReviewOperationTypeId = event;
    }

    this.enableDisableControl(caose);

    if(event == CommecialLoanReviewOperationEnum.Rollover){

      if(this.selectedLoanReview.maturityDate < this.systemDate){
        this.displayAutomaticRolloverModal = true;
        this.displayRolloverModal = false;
      }
      else 
      {
        this.displayAutomaticRolloverModal = false;
        this.displayRolloverModal = true;
      }
    }

    if(event == CommecialLoanReviewOperationEnum.InterestRateChange){
      this.displayInterestChangeModal = true
    }
    
    if(event == CommecialLoanReviewOperationEnum.TenorChange){
      this.displayTenorChangeModal = true
    }

    if(event == CommecialLoanReviewOperationEnum.SubAllocation){
      this.displaySubAllocationChangeModal = true
    }

    
    // this.enableDisableControl(this.selectedLoanReview.loanReviewOperationTypeId);
  }
}

export enum CommecialLoanReviewOperationEnum {
  Rollover = 72,
  InterestRateChange = 19,
  TenorChange = 26,
  SubAllocation = 74,
}

// rebookEffectiveDate
// rebookMaturityDate
// rebookTenor
// rebookInterestRate
// rebookIntegralFeeAmount
// rebookPrincipalAmount

// rebookScheduleMethodId
// rebookBasis
// rebookInterestChargeType
