import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanOperationService } from '../../services';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';
import { ProductTypeEnum, LoanSystemTypeEnum, GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cp-interest-rate-change',
  templateUrl: './cp-interest-rate-review.component.html',
})
export class CPInterestRateReviewComponent implements OnInit {
  lineId: any;
  displaySearchModal: boolean;
  displayMaturedLoans: boolean;
  loanApplicationDetailId: any;
  runningLoans: any;
  selectedId: number = null;
  loanReferenceNumber: string;
  loanId: number;
  rateChangeForm: FormGroup;
  
  displayData: boolean = false;
  displaySearch: boolean = false;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;
  loanViewSelection: any;
  pageTitle: string;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanOperationService: LoanOperationService,
  ) { }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
    //this.getRunningCommercialLoanLines();

  }

  private _loadLoanDetails: number;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails);
  }

  loadDistursedLoanDetails(loanId) {
    this.loanViewSelection = {};
    this.getApprovedLoanDetails(loanId);
  }

  getApprovedLoanDetails(loanId) {
    this.loanOperationService.getDisbursedLoanDetailsById(loanId,LoanSystemTypeEnum.TermDisbursedFacility).subscribe(response => {
      this.loanViewSelection = response.result;
      if(this.loanViewSelection.productTypeId == ProductTypeEnum.CommercialLoans)
      {
        this.pageTitle = "Commercial Loans - Interest Rate Change";
      }

      if(this.loanViewSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility)
      {
        this.pageTitle = "FX Revolving Loan - Interest Rate Change";
      }
    });
  }

  pipe = new DatePipe('en-US');
  clearControls() {
    this.rateChangeForm = this.fb.group({
      // principalAmount: ['', Validators.required],
      // loanReferenceNumber: ['', Validators.required],
      // effectiveDate: ['', Validators.required],
      // maturityDate: ['', Validators.required],
      valueDate: ['', Validators.required],
      newInterestRate: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      //interestRate: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
    });
  }

  changeInterestRate(formObj) {
    this.loadingService.show();
    let bodyObj = 
    {
      newRate: formObj.value.newInterestRate,
      loanId:this.loanViewSelection.loanId,
      aplicationDetailId : this.loanViewSelection.loanApplicationDetailId,
      valueDate : formObj.value.valueDate
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
      __this.loanOperationService.changeNonTermLoanInterestRate(bodyObj).subscribe((res) => {
      if (res.success == true) 
      { 
        swal(
          'Fintrak Credit Credit 360',
          res.message,
          'success'
        )
        __this.loadDistursedLoanDetails(__this._loadLoanDetails);
        __this.clearControls();
      } 
      else { 
      swal(
        'Fintrak Credit Credit 360',
        res.message,
        'error'
        )
      }
      __this.loadingService.hide();
    }, (err: any) => {
      swal(
        'Fintrak Credit Credit 360',
        JSON.stringify(err),
        'error'
      )
      __this.loadingService.hide();
    });
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
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


// onSelectedLoanChange(event){
//   let data = event.data;
//   this.lineId = data.loanApplicationDetailId;

//   const effectiveDate = this.pipe.transform(data.effectiveDate, 'dd/MMM/yyyy');
//   const maturityDate = this.pipe.transform(data.maturityDate, 'dd/MMM/yyyy');

//   this.rateChangeForm.controls['principalAmount'].setValue(ConvertString.ToNumberFormate(data.approvedAmount));
//   const interestRate = this.rateChangeForm.controls['interestRate'];
//   this.rateChangeForm.controls['loanReferenceNumber'].setValue(data.applicationReferenceNumber);
//   this.rateChangeForm.controls['effectiveDate'].setValue(effectiveDate);
//   this.rateChangeForm.controls['maturityDate'].setValue(maturityDate);
//   this.rateChangeForm.controls['interestRate'].setValue(ConvertString.ToNumberFormate(data.approvedInterestRate));

//   interestRate.clearValidators();
// }

// getRunningCommercialLoanLines() {
//   this.loadingService.show()
//   this.loanOperationService.getRunningCommercialLoanLines().subscribe((response: any) => {
//     this.loadingService.hide();
//     this.runningLoans = response.result;

//   });
// }
