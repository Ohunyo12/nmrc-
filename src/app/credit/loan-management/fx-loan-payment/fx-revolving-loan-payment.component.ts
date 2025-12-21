import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import { ConvertString } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './fx-revolving-loan-payment.component.html',
})
export class FXRevolvingLoanPaymentComponent implements OnInit {
  lineId: any;
  isParent = false;
  appRef: string;
  hasNewMaturityDate: boolean;
  maturedLoanInstruction: any;
  displayPreviousInstructions: any;
  displaySearchModal: boolean;
  files: FileList;
  file: File;
  maturityCommandText: string;
  showManualRollover: boolean;
  displayLoanSearch: boolean;
  maturedLoansInstructionType: any;
  displayManualForm: boolean;
  displayMaturedLoans: boolean;
  loanApplicationDetailId: any;
  runningLoans: any;
  selectedId: number = null;
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  manualRolloverForm: FormGroup;
  prepaymentForm: FormGroup;
  
  displayData: boolean = false;
  displaySearch: boolean = false;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;
  effectiveDate: string;
  maturityDate: string;
  tenorLeft: any;
  existingTenor: any;
  maturityAmount: any;
  interestAmount: any;
  interestRate: any;
  principalAmount: any;
  customerName: any;
  selectedLoanRecord: any;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
  ) {
   this.loanOperationService.searchForFXRevolvingLoan(this.searchTerm$)
    .subscribe(results => {
      this.searchResults = results.result;

    });
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
    this.showManualRollover = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  pipe = new DatePipe('en-US');
  pickSearchedData(item) {
    this.selectedLoanRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
    this.loanReferenceNumber = this.selectedLoanRecord[0].loanReferenceNumber;
    this.loanId = this.selectedLoanRecord[0].loanId;
    this.displaySearchModal = false;
    this.displayLoanSearch = true;
    this.isParent = false;
    const effectiveDate = this.pipe.transform(item.effectiveDate, 'short');
    const maturityDate = this.pipe.transform(item.maturityDate, 'short');

    this.interestAmount = item.outstandingInterest;
    this.maturityAmount = item.principalAmount;
    this.existingTenor = 
    this.tenorLeft = item.tenorLeft
    this.effectiveDate = effectiveDate;
    this.maturityDate = maturityDate;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.interestRate = item.outstandingInterest;
    this.principalAmount = item.principalAmount;
    this.customerName = item.customerName;
    //item.outstandingPrincipal
  }

 mdate: Date;
  calculateNewPrincipalBal() { 
    // let amountToPay = this.prepaymentForm.value['amountToPay'];
    // if(amountToPay <= 0){
    //   swal('','Tenor must be greater than zero.','warning');
    //   return;
    // } 
    // const mdate = new Date(this.prepaymentForm.value['maturityDate']);
    // mdate.setDate(mdate.getDate() + Number(amountToPay));
    // this.prepaymentForm.controls['principalBalance'].setValue(this.pipe.transform(mdate, 'short'));
    // this.hasNewMaturityDate = true;
  }

  clearControls() {
    this.prepaymentForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      amountToPay: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      principalBalance: [''],
      reducePrincipal: [''],
      interestToDate: [''],
      interestAtMaturity: [''],
      NewMaturityAmount: [''],
    });

    this.hasNewMaturityDate =false;
  }

  addPayment(formObj, isPreSubmit : boolean) {
    this.loadingService.show();
    let bodyObj = {
      loanReferenceNumber: this.loanReferenceNumber,
      amountToPay: formObj.value.amountToPay,
      effectiveDate: formObj.value.effectiveDate,
      isPrincipalReduction: formObj.value.reducePrincipal,
      isPreSubmission: isPreSubmit
    }
    this.loanOperationService.addCommercialLoanPayment(bodyObj,this.loanReferenceNumber).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          if(!isPreSubmit) {
            this.clearControls();
          }
          else{
            this.prepaymentForm.controls['interestToDate'] = res.data.interestToDate;
            this.prepaymentForm.controls['principalBalance'] = res.data.newPrincipal;
            this.prepaymentForm.controls['interestAtMaturity'] = res.data.InterestAtMaturity;
            this.prepaymentForm.controls['principalBalance'] = res.data.NewMaturityAmount;
          }
        } else {
          this.finishBad(res.message);
        }
        this.loadingService.hide();
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
        this.loadingService.hide();
    });
    this.loadingService.hide();
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
