import { DisbursedLoanDetailsComponent } from '../disbursed-loan-details/disbursed-loan-details.component';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { DateUtilService } from '../../../shared/services/dateutils';
import { CustomerService } from '../../../customer/services/customer.service';
import { CasaService } from '../../../customer/services/casa.service';
import { LoanSchedule } from '../../models/schedule';
import { ProductType } from '../../../setup/models/product-type';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Branch } from '../../../setup/models/branch';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChargeFeeAppModel } from '../../models/loan-charge-fee';
import { EditorModule } from 'primeng/primeng';
import { LoanCovenantModel } from '../../models/loan-covenant';
import { GuarantorAppModel } from '../../models/loan-guarantor';
import { FormGroup, FormBuilder, Validators, AbstractControl, Validator } from '@angular/forms';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject } from 'rxjs';
import { ProductService } from '../../../setup/services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { LMSOperationEnum } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-loan-operations',
  templateUrl: './loan-operations.component.html',
  styles: [`.ui-datepicker {top: -20px !important;}`]
})
export class LoanOperationsComponent implements OnInit {
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
  CASAAccountChange: boolean = false;
  Overdrafttopup: boolean = false;
  FeechargeChange: boolean = false;
  TerminateandRebook: boolean = false;
  CompleteWriteOff: boolean = false;
  CancelUndisbursedLoan: boolean = false;
  loanSystemTypeId: number ;
  // @ViewChild(DisbursedLoanDetailsComponent) disbursedLoanDetails: DisbursedLoanDetailsComponent;
  constructor(private fb: FormBuilder, private loadingService: LoadingService, private loanSrv: LoanService,
    private productService: ProductService, private loanOperationService: LoanOperationService,
    private router: Router, private casaService: CasaService, private customerService: CustomerService,
    private dateUtilService: DateUtilService, ) {
    this.loanOperationService.searchForLoan(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      });
    this.casaService.searchForAccount(this.searchAccountTerm$)
      .subscribe(results => {
        this.casaSearchResults = results.result;
        ////console.log('search item', this.casaSearchResults);
      });
  }

  ngOnInit() {
    this.getFrequencyTypes();
    this.GetAllProductTypes();
    this.GetOperationType();
    this.clearControl();

    const dateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
    //dateControl.valueChanges.debounceTime(1000).subscribe(value =>
    dateControl.valueChanges.subscribe(value =>
      this.compareDate());

  }

  getFrequencyTypes() {
    this.loanSrv.getFrequencyTypes()
      .subscribe((res) => {
        this.frequencies = res.result;
      });
  }
  GetAllProductTypes() {
    this.productService.getAllProductTypes().subscribe((response: any) => {
      this.filteredProducts = response.result;
      ////console.log("Product Type", this.filteredProducts)
    });
  }
  GetOperationType() {
    this.loanOperationService.getOperationType(true)
      .subscribe((results) => {
        this.operationTypes = results.result;
        this.operationTypes = this.operationTypes
        .filter
        ( x=>
          x.operationTypeId != LMSOperationEnum.TenorExtension &&
          x.operationTypeId != LMSOperationEnum.InterestRateChange &&
          x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
          x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
          x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
          x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
          x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal 
        );
      });
  }
  GetOperationTypeByScheduleId(productTypeId, scheduleTypeId) {
    this.loanOperationService.getOperationTypeByScheduleId(productTypeId, scheduleTypeId)
      .subscribe((results) => {
        this.operationTypes = results.result;
      });
  }
  // GetLaonGuarantors(loanId) {
  //   this.loanOperationService.getLoanGuarantors(loanId)
  //     .subscribe((results) => {
  //       this.guarantorDetails = results.result;
  //     });
  // }
  GetLaonConvenant(loanId) {
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      });
  }
  GetLaonChargeFee(loanId) {
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
      });
  }
  GetLaonScheduleByLoanId(loanId) {
    this.loanOperationService.getLoanScheduleByLoanId(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;
      });
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
    this.CASAAccountChange = false;
    this.Overdrafttopup = false;
    this.FeechargeChange = false;
    this.TerminateandRebook = false;
    this.CompleteWriteOff = false;
    this.CancelUndisbursedLoan = false;
    this.checkBoxApplicable = false;
  }
  OnOperationTypeChange(event) {
    this.hideAllControl();
    this.clearControl();
    this.LoanReviewForm.controls['operationTypeId'].setValue(event);
    this.LoanReviewForm.controls['loanId'].setValue(this.loanSelection.loanId);
    this.LoanReviewForm.controls['productTypeId'].setValue(this.loanSelection.productTypeId);
    switch (event) {
      case '19': {
        this.RegulatoryInterestRateChange = true;
        this.checkBoxApplicable = true;
        // this.PaymentDateChange = true;
        break;
      }
      case '20': {
        this.SubAllocationOverdraft = true;
        this.displayCASASearchModal = true;
        break;
      }
      case '21': {
        this.PrepaymentChange = true;
        this.checkBoxApplicable = true;
        // this.PaymentDateChange = true;
        break;
      }
      case '22': {
        this.PrincipalFrequencyChange = true;
        break;
      }
      case '23': {
        this.InterestFrequencyChange = true;
        break;
      }
      case '24': {
        this.InterestandPrincipalFrequencyChange = true;
        break;
      }
      case '25': {
        this.PaymentDateChange = true;
        break;
      }
      case '26': {
        this.TenorChange = true;
        break;
      }
      case '27': {
        this.CASAAccountChange = true;
        this.displayCASASearchModal = true;
        break;
      }
      case '28': {
        this.Overdrafttopup = true;
        break;
      }
      case '29': {
        this.FeechargeChange = true;
        break;
      }
      case '30': {
        this.TerminateandRebook = true;
        break;
      }
      case '31': {
        this.CompleteWriteOff = true;
        break;
      }
      case '32': {
        this.CancelUndisbursedLoan = true;
        break;
      }
      default: {
        break;
      }
    }
  }
  onSelectedLoanChange(event): void {
    this.loanSelection = event.data;
    this.entityName = "Perform Loan Review Operation For: " + this.loanSelection.customerName;
    this.termLoanId = this.loanSelection.loanId;
this.loanSystemTypeId = this.loanSelection.loanSystemTypeId;
    //this.disbursedLoanDetails.loadDistursedLoanDetails(this.termLoanId);

    // this.GetOperationTypeByScheduleId(this.loanSelection.productTypeId, this.loanSelection.scheduleTypeId);
    // this.GetLaonGuarantors(this.loanSelection.loanId);
    //  this.GetLaonConvenant(this.loanSelection.loanId);
    // this.GetLaonChargeFee(this.loanSelection.loanId);
    // this.GetLaonScheduleByLoanId(this.loanSelection.loanId);
    this.displayLoanSearch = false;
    this.displayCustomerLoanDetails = true;
    this.displatBackToSearch = true;
  }
  clearControl() {
    this.LoanReviewForm = this.fb.group({
      loanReviewOperationsId: [0],
      loanId: [''],
      productTypeId: [''],
      operationTypeId: ['', Validators.required],
      reviewDetails: ['', Validators.required],
      proposedEffectiveDate: ['', Validators.required],
      interateRate: [0],
      prepayment: [0],
      maturityDate: [''],
      principalFrequencyTypeId: [''],
      interestFrequencyTypeId: [''],
      principalFirstPaymentDate: [''],
      interestFirstPaymentDate: [''],
      tenor: [''],
      cASA_AccountId: [''],
      accountNumber: [''],
      overDraftTopup: [''],
      fee_Charges: [''],
      terminationAndReBook: [''],
      completeWriteOff: [''],
      cancelUndisbursedLoan: [''],
      approvalStatusId: [''],
      isManagementRate: ['']
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
    if (this.loanSelection.scheduleTypeName == 'Irregular Schedule') {
      this.displayPaymentPlanButton = true;
      swal({
        title: 'Irregular Schedule!', text: 'Please dont forget to enter payment plan.',
        timer: 1000, onOpen: function () { swal.showLoading() }
      }).then(function () { }, function (dismiss) { if (dismiss === 'timer') { } })
    }

    this.displayReviewModal = true;
  }
  showPaymentDetial() {
    this.principalValanceString = null;
    const prepaymentAmount = this.LoanReviewForm.get('prepayment').value;
    if (Number(prepaymentAmount) > 0) {
      this.principalValanceString = (Number(this.loanSelection.outstandingPrincipal) - Number(prepaymentAmount));
    } else {
      this.principalValanceString = this.loanSelection.outstandingPrincipal;
    }

    this.scatterdPayments = [];
    this.displayPaymentPlan = true;
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
  submitLoanReviewForm(formObj) {
    this.loadingService.show();
    let bodyObj = {
      loanReviewOperationsId: formObj.value.loanReviewOperationsId,
      loanId: formObj.value.loanId,
      productTypeId: formObj.value.productTypeId,
      operationTypeId: formObj.value.operationTypeId,
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
      reviewIrregularSchedule: this.scatterdPayments
    }


    if (this.selectedLoanId === null) {
      this.loanOperationService.addLoanReviewOperation(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.loadingService.hide();
          swal('FinTrak Credit 360', res.message, 'success');
          // this.router.navigate(['/credit/loan/preliminary-evaluation/view']);
          //this.clearControl();
          this.displayReviewModal = false;
        } else {
          swal('FinTrak Credit 360', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('FinTrak Credit 360', JSON.stringify(err), 'error');
        this.loadingService.hide();
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
}
