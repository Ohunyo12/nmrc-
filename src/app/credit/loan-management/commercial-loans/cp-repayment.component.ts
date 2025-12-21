import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import swal from 'sweetalert2';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './cp-repayment.component.html',
})
export class CPRepaymentComponent implements OnInit {
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
  autoRolloverForm: FormGroup;
  
  displayData: boolean = false;
  displaySearch: boolean = false;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
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
    //this.getRunningCommercialLoanLines();
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  pipe = new DatePipe('en-US');
  pickSearchedData(item) {
    var selectedLoanRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
    this.loanReferenceNumber = selectedLoanRecord[0].loanReferenceNumber;
    this.loanId = selectedLoanRecord[0].loanId;
    this.displaySearchModal = false;
    this.displayLoanSearch = true;
    this.isParent = false;

    const effectiveDate = this.pipe.transform(item.effectiveDate, 'short');
    const maturityDate = this.pipe.transform(item.maturityDate, 'short');
    const outstandingPrincipal = this.autoRolloverForm.controls['outstandingPrincipal'];
    const outstandingInterest = this.autoRolloverForm.controls['outstandingInterest'];

    this.autoRolloverForm.controls['principalAmount'].setValue(item.principalAmount);
    this.autoRolloverForm.controls['outstandingPrincipal'].setValue(item.outstandingPrincipal);
    this.autoRolloverForm.controls['outstandingInterest'].setValue(item.outstandingInterest);
    this.autoRolloverForm.controls['loanReferenceNumber'].setValue(item.loanReferenceNumber);
    this.autoRolloverForm.controls['effectiveDate'].setValue(effectiveDate);
    this.autoRolloverForm.controls['maturityDate'].setValue(maturityDate);

    outstandingPrincipal.setValidators(Validators.required);
    outstandingInterest.setValidators(Validators.required);
    this.hasNewMaturityDate = false;
  }

  onSelectedLoanChange(event){
    let data = event.data;
    this.appRef = data.applicationReferenceNumber;
    this.lineId = data.loanApplicationDetailId;
    this.isParent = true;

    const effectiveDate = this.pipe.transform(data.effectiveDate, 'short');
    const maturityDate = this.pipe.transform(data.maturityDate, 'short');

    this.autoRolloverForm.controls['principalAmount'].setValue(data.approvedAmount);
    const outstandingPrincipal = this.autoRolloverForm.controls['outstandingPrincipal'];
    const outstandingInterest = this.autoRolloverForm.controls['outstandingInterest'];
    this.autoRolloverForm.controls['loanReferenceNumber'].setValue(data.applicationReferenceNumber);
    this.autoRolloverForm.controls['effectiveDate'].setValue(effectiveDate);
    this.autoRolloverForm.controls['maturityDate'].setValue(maturityDate);

    outstandingPrincipal.clearValidators();
    outstandingInterest.clearValidators();
    this.hasNewMaturityDate = false;
  }

  getRunningCommercialLoanLines() {
    this.loadingService.show()
    this.loanOperationService.getRunningCommercialLoanLines().subscribe((response: any) => {
      this.loadingService.hide();
      this.runningLoans = response.result;
    });
  }

 mdate: Date;
  calculateNewTenor() {
    let newTenor = this.autoRolloverForm.value['newTenor'];
    if(newTenor <= 0){
      swal('','Tenor must be greater than zero.','warning');
      return;
    } 
    const mdate = new Date(this.autoRolloverForm.value['maturityDate']);
    mdate.setDate(mdate.getDate() + Number(newTenor));
    this.autoRolloverForm.controls['newMaturity'].setValue(this.pipe.transform(mdate, 'short'));
    this.hasNewMaturityDate = true;
  }

  clearControls() {
    this.autoRolloverForm = this.fb.group({
      principalAmount: ['', Validators.required],
      loanReferenceNumber: ['', Validators.required],
      outstandingPrincipal: ['', Validators.required],
      outstandingInterest: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      maturityDate: ['', Validators.required],
      newTenor: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      newMaturity: [''],
    });

    this.hasNewMaturityDate =false;
  }

  addTenor(formObj) {
    this.loadingService.show();
    let bodyObj = {
      loanRef: this.loanReferenceNumber,
      newTenor: formObj.value.newTenor,
      isParent: this.isParent,
      appRef: this.appRef,
      id : this.lineId,
    }
    this.loanOperationService.addTenor(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.clearControls();
        } else {
          this.finishBad(res.message);
        }
        this.loadingService.hide();
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
        this.loadingService.hide();
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
