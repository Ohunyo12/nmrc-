import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanOperationService } from '../../services';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';
import { ProductTypeEnum, LoanSystemTypeEnum } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-cp-rollover',
  templateUrl: './cp-rollover.component.html',
})
export class CPRolloverComponent implements OnInit {
  loanReferenceNumber: any;
  displaySearch: boolean;
  maturityCommandText: string;
  showManualRollover: boolean;
  displayLoanSearch: boolean;
  maturedLoansInstructionType: any;
  displayManualForm: boolean;
  displayMaturedLoans: boolean;
  loanApplicationDetailId: any;
  dueLoans: any;
  maturedCommercialLoansParent: any[];
  displaySearchModal: boolean = false;
  loanId: number;
  manualRolloverForm: FormGroup;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;
  selectedId: number = null;
  tenorLeft: number;
  existingTenor: any;
  interestAmount: any;
  principalAmount: any;
  customerName: any;
  interestRate: string;
  maturityAmount: string;
  effectiveDate: string;
  maturityDate: string;
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  showButton: boolean;
  showDataGrid: boolean;
  loanViewSelection: any;
  pageTitle: string;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanOperationService: LoanOperationService,

  ) { 
    this.loanOperationService.searchForRunningCommercialAndFxLoans(this.searchTerm$)
    .subscribe(results => {
      this.searchResults = results.result;

    });
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
    //this.getMaturedCommercialLoansParent();
    this.getMaturedInstructionType();
    //this.getMaturedCommercialLoans(0);
    this.showGrid();
    this.showManualRollover = true;
    this.maturityCommandText ='Auto Rollover';
  }

  private _loadLoanDetails: number;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails); this.loanId = value;
  }

  loadDistursedLoanDetails(loanId) {
    this.loanViewSelection = {};
    this.getApprovedLoanDetails(loanId);
  }

  getApprovedLoanDetails(loanId) {
    this.loanOperationService.getDisbursedLoanDetailsById(loanId,LoanSystemTypeEnum.TermDisbursedFacility).subscribe(response => {
      this.loanViewSelection = response.result;
    });
  }

  pipe = new DatePipe('en-US');
  getMaturedInstructionType() {
    this.loadingService.show()
    this.loanOperationService.getMaturedInstructionType().subscribe((response: any) => {
      this.loadingService.hide();
      this.maturedLoansInstructionType = response.result;
    });
  }

   showGrid(){
    this.showDataGrid = true;
    this.showButton = false;
    this.displayManualForm = false;
   }

   hideGrid(){
    this.showDataGrid = false;
    this.showButton = true;
   }


  rolloverLoan(formObj) {
    // if (new Date(this.manualRolloverForm.get('effectiveDate').value) < new Date(this.manualRolloverForm.get('previousEffectiveDate').value)) {
    //   swal('FinTrak Credit 360', "New Effective Date cannot be less than Previous Effective date", "error");
    //   return;
    // }
    this.loadingService.show();
    let bodyObj = {
      maturityInstructionId: formObj.value.instructionType,
      newTenor: formObj.value.newTenor,
      loanId: this.loanId,
    }
    this.loanOperationService.sendCommercialLoanRolloverInstruction(bodyObj).subscribe((res) => {
      if (res.success == true) {
          this.finishGood(res.message);
          this.clearControls();
          //this.getMaturedCommercialLoansParent();
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
  }

  clearControls() {
    this.manualRolloverForm = this.fb.group({
      instructionType: ['', Validators.required],
      newTenor: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      fileInput: [''],
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
}

// searchDB(searchString) {
//   this.searchTerm$.next(searchString);
//   this.displaySearchModal = true;
// }

// onSelectedParentLoanChange(event) {
//   const item = event.data
//   this.loanReferenceNumber = item.loanReferenceNumber;
//   this.loanApplicationDetailId = item.loanApplicationDetailId;
//   this.getMaturedCommercialLoans(this.loanApplicationDetailId);
//   this.displayMaturedLoans = true;
// }
// onSelectedLoanChange(event) {
//   this.displayManualForm = true;
//   this.hideGrid();
//   const item = event.data;
//   this.loanId = item.loanId;
//   var tenorLeft = item.tenor - item.tenorUsed;
//   const effectiveDate = this.pipe.transform(item.effectiveDate, 'dd/MMM/yyyy');
//   const maturityDate = this.pipe.transform(item.maturityDate, 'dd/MMM/yyyy');

//   this.principalAmount = ConvertString.ToNumberFormate(item.principalAmount);
//   this.interestAmount = ConvertString.ToNumberFormate(item.interestAmount);
//   this.loanReferenceNumber = item.loanReferenceNumber;
//   this.existingTenor = item.tenor;
//   this.tenorLeft = tenorLeft;
//   this.customerName = item.customerName;
//   this.interestRate = item.interestRate;
//   this.maturityAmount = ConvertString.ToNumberFormate(item.interestAmount); // ConvertString.ToNumberFormate(item.outstandingPrincipal + item.outstandingInterest);
//   this.effectiveDate = effectiveDate;
//   this.maturityDate = maturityDate;
// }

// getMaturedCommercialLoansParent() {
//   this.loadingService.show();
//   this.loanOperationService.getMaturedCommercialLoansParent()
//     .subscribe(response => {
//       this.maturedCommercialLoansParent = response.result;

//       this.loadingService.hide();
//     });
// }

// getMaturedCommercialLoans(id) {
//   this.loadingService.show()
//   this.loanOperationService.getdueCommercialLoans().subscribe((response: any) => {
//     this.loadingService.hide();
//     this.dueLoans = response.result;

//   });
// }

// pickSearchedData(item) {
//   var selectedLoanRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
//   this.loanReferenceNumber = selectedLoanRecord[0].loanReferenceNumber;
//   this.loanId = selectedLoanRecord[0].loanId;
//   this.displaySearchModal = false;
//   const effectiveDate = this.pipe.transform(item.effectiveDate, 'dd/MMM/yyyy');
//   const maturityDate = this.pipe.transform(item.maturityDate, 'dd/MMM/yyyy');

//   const tenorLeft = item.tenor - item.tenorUsed;
//   this.principalAmount = item.outstandingInterest;
//   this.interestAmount = item.outstandingInterest;
//   this.loanReferenceNumber = item.loanReferenceNumber;
//   this.existingTenor = item.tenor;
//   this.tenorLeft = tenorLeft;
//   this.customerName = item.customerName;
//   this.interestRate = item.interestRate;
//   this.maturityAmount = ConvertString.ToNumberFormate(item.outstandingPrincipal + item.outstandingInterest);
//   this.effectiveDate = effectiveDate;
//   this.maturityDate = maturityDate;
//   this.searchResults= null;
// }
