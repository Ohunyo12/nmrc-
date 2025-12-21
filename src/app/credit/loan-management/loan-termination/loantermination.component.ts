import { LoanService } from '../../services/loan.service';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject ,  Subscription } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { ConvertString } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-loantermination',
  templateUrl: './loantermination.component.html',
})

export class LoanTerminationComponent implements OnInit, OnDestroy {
  totalAmount: any;
  prepaymentMethod: number;
  principalAmount: number;
  displayScheduleModalForm: boolean;
  selectedId: number = null;
  displayAddModal: boolean = false;
  displaySearchModal: boolean = false;
  entityName: string = "Loan Termination";
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
  validationDate: any;
  generateData: any = {};
  displayLoanDetailsModal: boolean;
  termLoanId: number = 0;

  show: boolean = false; message: any; title: any; cssClass: any;

  prepaymentMothods: any[] = [
    { id:1, name:'Maintain Tenor' },
    { id:2, name:'Use Existing Repayment' },
];
private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loanService: LoanService) {
    this.subscriptions.add(
    this.loanOperationService.searchForLoanPrepayment(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;

      }));
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();

  }

  selectOption(id: number) {
    //console.log("Victor",id);
    this.prepaymentMethod = id;
  }

  showAddModal() {
    this.clearControls();
    this.entityName = "Loan Termination";
    this.displayAddModal = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  getRunningLoan(refNo) {
   // console.log('ref', refNo);
    this.loadingService.show();
    this.subscriptions.add(
    this.loanPrepaymentService.getRunningLoan(refNo).subscribe((response: any) => {
      this.loadingService.hide()
      if (response.success == true) {
        this.loanPrepaymentData = response.result;
        if (this.loanPrepaymentData != null) {
          const row = this.loanPrepaymentData;
          this.validationDate = row.previousEffectiveDate;
          this.totalAmount = ConvertString.ToNumberFormate(row.outstandingPrincipal + row.pastDueInterest + row.pastDuePrincipal + row.accrualedAmount + row.interestOnPastDuePrincipal + row.interesrtOnPastDueInterest);
          this.generateData = row;
          this.loanPrepaymentForm = this.fb.group({
            loanReferenceNumber: [row.loanReferenceNumber],
            approvedAmount: [ConvertString.ToNumberFormate(row.approvedAmount)],
            outstandingPrincipal: [ConvertString.ToNumberFormate(row.outstandingPrincipal)],
            interestRate: [row.interestRate],
            interestOnPastDuePrincipal: [row.interestOnPastDuePrincipal],
            interesrtOnPastDueInterest: [row.interesrtOnPastDueInterest],
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
            pastDueInterest: [ConvertString.ToNumberFormate(row.pastDueInterest)],
            currency: [row.currency],
            loanId: [row.loanId],

            

          });
          //  ////console.log("")
          //this.loanPrepaymentForm.controls['previousEffectiveDate'].disable();
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

  loanDetails() {
    this.termLoanId = this.loanPrepaymentData.loanId;
    this.loanSystemTypeId = this.loanPrepaymentData.loanSystemTypeId;
    this.displayLoanDetailsModal = true;
    // console.log("loanPrepaymentData => ", this.loanPrepaymentData);
  }

  pickSearchedData(item) {
   console.log("selected ---- ", item);
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
    this.getRunningLoan(this.loanReferenceNumber);

  }

  submitForm(formObj) {
    this.loadingService.show();
    //const bodyObj = formObj.value;
    //console.log("lmsApplicationDetailId", this.lmsApplicationDetailId);
    let bodyObj = {
      loanReviewOperationsId: null,
      loanId: this.loanId,
      productTypeId: this.productTypeId,
      loanSystemTypeId: 1,
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      operationTypeId: 34,
      reviewDetails: "Loan Termination Operation",
      proposedEffectiveDate: this.loanPrepaymentForm.get('previousEffectiveDate').value,
      interesrtOnPastDueInterest: this.loanPrepaymentForm.get('interesrtOnPastDueInterest').value,
      interestOnPastDuePrincipal: this.loanPrepaymentForm.get('interestOnPastDuePrincipal').value,
      interateRate: formObj.value.interestRate,
      prepayment: formObj.value.equityContribution,
      maturityDate: formObj.value.maturityDate,
      principalFrequencyTypeId: null,
      interestFrequencyTypeId: null,
      principalFirstPaymentDate: null,
      interestFirstPaymentDate: null,
      tenor: formObj.value.newtenor,
      cASA_AccountId: null,
      accountNumber: null,
      overDraftTopup: null,
      fee_Charges: null,
      terminationAndReBook: null,
      completeWriteOff: null,
      cancelUndisbursedLoan: null,
      approvalStatusId: 0,
      isManagementRate: false,
      operationCompleted: 0,
      reviewIrregularSchedule: this.scatterdPayments,
      prepaymentMethodId : this.prepaymentMethod,
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
          this.backToSearch();
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
      this.loanPrepaymentForm.controls['loanReferenceNumber'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.loanPrepaymentForm = this.fb.group({
      approvedAmount: ['', Validators.required],
      loanReferenceNumber: ['', Validators.required],
      outstandingPrincipal: ['', Validators.required],
      interestRate: ['', Validators.required],
      equityContribution: ['', Validators.required],
      effectiveDate: [''],//, Validators.required],
      maturityDate: ['', Validators.required],
      accrualedAmount: ['', Validators.required],
      interestOnPastDuePrincipal: ['', Validators.required],
      interesrtOnPastDueInterest: ['', Validators.required],
      pastDueInterest: [0],
      scheduleTypeId: ['', Validators.required],
      teno: [''],
      newtenor: ['', Validators.required],
      scheduleTypeCategoryId: [0],
      totalAmount: [0],
      previousEffectiveDate: [''],
      maintainTenor: [true],
      currency: [''],
      pastDueTotal: [0],
      pastDuePrincipal: [0],
      prepaymentMethod: ['', Validators.required],

    });
  }

  validateEffectiveDate(){
   
    let previousEffectiveDate = new Date(this.loanPrepaymentForm.get('previousEffectiveDate').value);

    if (previousEffectiveDate  < new Date(this.validationDate)) {
      this.showMessage("Effective Date Cannot Be Backdated.", "error", "FintrakBanking");
      this.loanPrepaymentForm.get('previousEffectiveDate').setValue( new Date(this.validationDate));
    }
  }

  calculateMaturityDate() {
    this.loanPrepaymentForm.controls['maturityDate'].setValue(null);
    let newTenor = this.loanPrepaymentForm.get('newtenor').value;
    if (newTenor <= 0) {
      this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
    }
    let effectiveDate = this.loanPrepaymentForm.get('effectiveDate').value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    this.loanPrepaymentForm.controls['maturityDate'].setValue(maturityDate);
  }
  calculateTenor() {
    this.loanPrepaymentForm.controls['newtenor'].setValue(null);
    let effectiveDate = this.loanPrepaymentForm.get('effectiveDate').value;
    let maturityDate = this.loanPrepaymentForm.get('maturityDate').value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.showMessage("Effective Date cannot be greater than Maturity Date.", "error", "FintrakBanking");
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.loanPrepaymentForm.controls['newtenor'].setValue(tenor);
  }
 
  calculateBalance(event) {
    let totalAmount = this.totalAmount.replace(/[,]+/g, "").trim();  // this.generateData.totalAmount//this.loanPrepaymentForm.get('totalAmount').value;
    this.newPrincipalBalance = (Number(totalAmount) - Number(event.replace(/[,]+/g, "").trim()));
    this.principalAmount = parseFloat(Number(this.newPrincipalBalance).toFixed(2));
    this.principalValanceString = parseFloat(Number(this.newPrincipalBalance).toFixed(2)); //this.toDec(this.newPrincipalBalance, 2); //this.newPrincipalBalance;
    if (Number(this.principalValanceString) < 0) {
      this.showMessage("Payment Amount cannot be greater than Total Amount", "error", "FintrakBanking");
      this.principalValanceString = Number(0);
      this.newPrincipalBalance= Number(0);
      this.loanPrepaymentForm.controls['equityContribution'].setValue(0);
      return;
    }
    //this.loanPrepaymentForm.controls['equityContribution'].setValue(ConvertString.ToNumberFormate(event));
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
