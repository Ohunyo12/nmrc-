import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LoanReviewApplicationService, LoanOperationService, LoanPrepaymentService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig, ConvertString } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { Row } from 'primeng/primeng';
import { log } from 'util';

@Component({
  selector: 'app-loan-fee-adjustment',
  templateUrl: './loan-fee-adjustment.component.html',
})
export class LoanFeeAdjustmentComponent implements OnInit {
  loanSystemTypeId: any;
  chargeFeeId: number;
  referenceNo: string;
  loanChargeFeeList: any[];
  displaySearch: boolean = true;
  displayLoanSearch: boolean = false;
  productTypes: any[];
  loanSearchForm: FormGroup;
  searchResult: any[];
  loanSelection: any = {};
  feeChargeSelection: any = {};
  displayFeeChargeForm: boolean = false;
  feeChargeForm: FormGroup;
  loanId: number;
  productTypeId: number;
  loanChargeFeeId: number;
  principalAmount: number;
  lmsApplicationDetailId: number;

  constructor(private reviewService: LoanReviewApplicationService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private loanOperationService: LoanOperationService,
    private loanPrepaymentService: LoanPrepaymentService) { }

  ngOnInit() {
    this.initializeForm()
    this.displaySearch = true;
    this.productTypes = this.reviewService.getProductTypeList();
  }
  initializeForm() {
    this.feeChargeForm = this.fb.group({
      newFeeAmount: ['', Validators.required],
      newFeeRateValue: [''],
      feeRateValue: [''],
      feeAmount: [''],
      chargeFeeName: [''],
      principalAmount: ['']
    });

    this.loanSearchForm = this.fb.group({
      productTypeId: ['', Validators.required],
      searchString: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    });
  }
  openSearchBox() {
    this.displayLoanSearch = true;
  }
  closeLoanSearch() {
    this.displayLoanSearch = false;
  }
  onSelectedLoanChange() {
    this.referenceNo = this.loanSelection.loanReferenceNumber;
    this.loanId = this.loanSelection.loanId;
    this.productTypeId = this.loanSelection.productTypeId;
    this.principalAmount = this.loanSelection.principalAmount;
    this.lmsApplicationDetailId = this.loanSelection.lmsApplicationDetailId;
    this.getLoanChargeFeeByLoanId(this.loanSelection.loanId);
    this.closeLoanSearch();
  }

  onSelectedFeeChargeChange() {
   // console.log("fee: ", this.feeChargeSelection);
    this.loanChargeFeeId = this.feeChargeSelection.loanFeeId;
    this.chargeFeeId = this.feeChargeSelection.chargeFeeId;
    this.feeChargeForm = this.fb.group({
      newFeeAmount: ['', Validators.required],
      newFeeRateValue: [''],
      feeRateValue: [this.feeChargeSelection.feeRateValue],
      feeAmount: [ConvertString.ToNumberFormate(this.feeChargeSelection.feeAmount)],
      chargeFeeName: [this.feeChargeSelection.chargeFeeName],
      principalAmount: [ConvertString.ToNumberFormate(this.principalAmount)]
    });

    this.displayFeeChargeForm = true;
  }

  getLoanChargeFeeByLoanId(loanId) {
    this.loadingService.show()
    this.loanOperationService.getLoanChargeFeeByLoanId(loanId).subscribe((response: any) => {
      this.loanChargeFeeList = response.result;
      this.displaySearch = false;
      this.loadingService.hide()
    })
  }
  return()
  {
    this.displaySearch = true;
    this.loanChargeFeeList =[];
  }
  submitLoanSearchForm(form) {
    if (form.invalid) return;
    this.loadingService.show();
    let body = {
      productTypeId: form.value.productTypeId,
      loanSystemTypeId: this.loanSystemTypeId =form.value.productTypeId,
      searchString: form.value.searchString,
    };
    this.reviewService.loanSearchFeeCharge(body).subscribe((response: any) => {
      if (response.success == true) {
        this.searchResult = response.result;
        this.loadingService.hide();
      } else {
        this.loadingService.hide();
      }
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }

  submitLoanFeeCharge(formObj) {
    this.loadingService.show();

    let bodyObj = {
      loanReviewOperationsId: null,
      loanId: this.loanId,
      productTypeId: this.productTypeId,
      operationTypeId: 29,
      reviewDetails: "Fee/Charge Change Operation",
      proposedEffectiveDate: new Date(),
      interateRate: formObj.value.newFeeRateValue,
      prepayment: formObj.value.newFeeAmount,
      maturityDate: null,
      principalFrequencyTypeId: this.loanChargeFeeId,
      interestFrequencyTypeId: this.chargeFeeId,
      principalFirstPaymentDate: null,
      interestFirstPaymentDate: null,
      tenor: null,
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
      loanSystemTypeId: this.loanSystemTypeId,
      reviewIrregularSchedule: [],
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      // feeTypeId: this.chargeFeeId
    }

    this.loanPrepaymentService.save(bodyObj).subscribe((res) => {
      this.loadingService.hide();
      if (res.success == true) {
        this.loanId = null;
        this.productTypeId = null;
        this.loanChargeFeeId = null;
        this.chargeFeeId = null;
        this.principalAmount = null;
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.displayFeeChargeForm = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }
  calculateRateValue(value) {

    let newAmount = Number(value.replace(/[,]+/g, "").trim());
    let principal = parseFloat(Number(this.principalAmount).toFixed(2));
    let newRate = parseFloat((newAmount / principal * 100).toFixed(2));
    this.feeChargeForm.get('newFeeRateValue').setValue(newRate);
  }
}

