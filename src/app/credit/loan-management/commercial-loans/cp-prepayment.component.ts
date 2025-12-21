import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService, LoanService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';
import { ProductTypeEnum } from '../../../shared/constant/app.constant';
import { userInfo } from 'os';
import { AuthorizationService } from 'app/admin/services/authorization.service';

@Component({
  templateUrl: './cp-prepayment.component.html',
})
export class CPPrepaymentComponent implements OnInit {
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
  show: boolean = false; message: any; title: any = 'Commercial/Fx Revolving Loan - Prepayment'; cssClass: any;
  effectiveDate: string;
  maturityDate: string;
  tenorLeft: any;
  existingTenor: any;
  maturityAmount: any;
  interestAmount: any;
  interestRate: any;
  principalAmount: any;
  customerName: any;
  currencyCode: any;
  selectedLoanRecord: any;
  isCommercialLoan: boolean;
  twoFactorAuthEnabled: any;
  displayTwoFactorAuth: boolean;
  twoFactorAuthStaffCode: string = null;
  twoFactorAuthPassCode: string = null;
  loanData: any;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private authorizationService: AuthorizationService,
    private loanService: LoanService
  ) {
   this.loanOperationService.searchForRunningCommercialAndFxLoans(this.searchTerm$)
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

    if(item.productTypeId == ProductTypeEnum.CommercialLoans)
    {
      this.title = "Commercial Prepayment - (Principal Reduction)";
      this.isCommercialLoan = true;
    }
    if(item.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility)
    {
      this.title = "FX Revolving Loan Prepayment";
      this.isCommercialLoan = false;
    }
    this.loanReferenceNumber = this.selectedLoanRecord[0].loanReferenceNumber;
    this.loanId = this.selectedLoanRecord[0].loanId;
    this.displaySearchModal = false;
    this.displayLoanSearch = true;
    this.isParent = false;
    const effectiveDate = this.pipe.transform(item.effectiveDate, 'short');
    const maturityDate = this.pipe.transform(item.maturityDate, 'short');

    this.interestAmount = item.outstandingInterest;
    this.maturityAmount = item.outstandingInterest + item.outstandingInterest;
    this.existingTenor = item.tenor;
    this.tenorLeft = item.tenor - item.tenorUsed;
    this.effectiveDate = effectiveDate;
    this.maturityDate = maturityDate;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.interestRate = item.interestRate;
    this.principalAmount = item.principalAmount;
    this.currencyCode = item.currencyCode;
    this.customerName = item.customerName;

    //this.prepaymentForm.controls['effectiveDate'].setValue(userInfo);
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
  
  promptCommercialLoanPayment(formObj, isPreSubmit : boolean) {
    this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
      this.twoFactorAuthEnabled = res.result;
      if (this.twoFactorAuthEnabled == true) {
        this.displayTwoFactorAuth = true;
      } else {
        this.addCommercialLoanPayment(formObj, isPreSubmit)
      }
    });
  }

  GetLoanById(id){
     this.loanService.getLoansById(id).subscribe((res) => {
         if (res.success == true) {
          this.searchResults = res.result
          this.pickSearchedData(res.result);
         } 
       }, (err: any) => {
     });
  }

  addCommercialLoanPayment(formObj, isPreSubmit : boolean){
    this.displayTwoFactorAuth = false;
     this.loadingService.show();
     let bodyObj = {
       loanReferenceNumber: this.loanReferenceNumber,
       amount: formObj.value.amountToPay,
       effectiveDate: formObj.value.effectiveDate,
       isPrincipalReduction: formObj.value.reducePrincipal,
       isPreSubmission: isPreSubmit,
       userName: this.twoFactorAuthStaffCode,
       passCode: this.twoFactorAuthPassCode
     } ;
     this.loanOperationService.addCommercialLoanPayment(bodyObj,this.loanReferenceNumber).subscribe((res) => {
         if (res.success == true) {
           this.finishGood(res.message);
           this.displayLoanSearch = false; 
           this.GetLoanById(this.searchDB[0].loanId);
           if(!isPreSubmit) {
             this.clearControls();
           }
           else { 
             this.prepaymentForm.controls['interestToDate'].setValue(res.result.interestToDate.toLocaleString('en-US', { minimumFractionDigits: 2 }));
             this.prepaymentForm.controls['principalBalance'].setValue(res.result.newPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 }));
             this.prepaymentForm.controls['interestAtMaturity'].setValue(res.result.interestAtMaturity.toLocaleString('en-US', { minimumFractionDigits: 2 }));
             this.prepaymentForm.controls['principalBalance'].setValue(res.result.newMaturityAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
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

  addPayment(formObj, isPreSubmit : boolean) { 
    // if(this.selectedLoanRecord[0].productTypeId === ProductTypeEnum.CommercialLoans)
    // {
      this.addCommercialLoanPayment(formObj, isPreSubmit)
    //}
    // if(this.selectedLoanRecord[0].productTypeId === ProductTypeEnum.ForeignExchangeRevolvingFacility)
    // {
    //   this.addCommercialLoanPayment()
    // }
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
