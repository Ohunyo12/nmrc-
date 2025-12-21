import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService, LoanService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import { ConvertString, LoanSystemTypeEnum, GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maturity-instruction',
  templateUrl: './maturity-instruction.component.html',
})
export class MaturityInstructionComponent implements OnInit {
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
  maturedLoans: any;
  selectedId: number = null;
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  autoRolloverForm: FormGroup;
  
  displayData: boolean = false;
  displaySearch: boolean = false;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;
  principalAmount: any;
  tenorLeft: number;
  existingTenor: any;
  interestAmount: any;
  customerName: any;
  interestRate: any;
  maturityAmount: string;
  effectiveDate: string;
  maturityDate: string;
  displayTranche: boolean;
  loanViewSelection: any;
  approvedLoanOperationReviewData: any[];
  selectedLoanReviewId: number;
  operationTypeId: number;
  approvalWorkflowData: any[];
  displayRefered: boolean = false;
  takeFeeStatus: number;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService, private loanSrv: LoanService,
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
    this.getMaturedInstructionType();
    this.showManualRollover = true;

    this.maturityCommandText = "Add Automatic Rollover";
    this.getmaturedLoanInstruction();
    this.displayTranche = true;
  }

  private _loadLoanDetails: number;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = this.loanId = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails);
  }

  loadDistursedLoanDetails(loanId) {
    this.loanViewSelection = {};
    this.getApprovedLoanDetails(loanId);
  }

  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;
      
      this.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;

      this.loanSrv.getApprovalTrailByOperation(this.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
        this.approvalWorkflowData = res.result;

    });

      this.autoRolloverForm.controls["newTenor"].setValue(row.newTenor);
      this.autoRolloverForm.controls["instructionType"].setValue(row.maturityInstructionTypeId);

    }
  }
  
  loanSystemTypeId: number;
  currencyId: number;
  customerId: number;
  getApprovedLoanDetails(loanId) {
    this.loanOperationService.getDisbursedLoanDetailsById(loanId,LoanSystemTypeEnum.TermDisbursedFacility).subscribe(response => {
    this.loanViewSelection = response.result;
    this.approvedLoanOperationReviewData = this.loanViewSelection.operationReview;
    this.loanSystemTypeId = this.loanViewSelection.loanSystemTypeId;
    this.currencyId = this.loanViewSelection.currencyId;
    this.customerId = this.loanViewSelection.customerId;


      if (this.approvedLoanOperationReviewData != null)
      {
        this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
        this.displayRefered = true;
      }
      else
      {
        this.clearControls();
        this.displayRefered = false;
      }
    });
  }
  applicationCollection: any[] = [];

  takeFees(event) { 
    this.applicationCollection = event; 
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
    this.displaySearchModal = true;
  }

  pipe = new DatePipe('en-US');
  pickSearchedData(item) {
   // this.displaySearchModal = true;
    this.displayTranche = true;
    var selectedLoanRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
    this.loanReferenceNumber = selectedLoanRecord[0].loanReferenceNumber;
    this.loanId = selectedLoanRecord[0].loanId;
    this.displaySearchModal = false;
    this.displayLoanSearch = true;
    const effectiveDate = this.pipe.transform(item.effectiveDate, 'dd/MMM/yyyy');
    const maturityDate = this.pipe.transform(item.maturityDate, 'dd/MMM/yyyy');

    const tenorLeft = item.tenor - item.tenorUsed;
    this.principalAmount = item.outstandingInterest;
    this.interestAmount = item.outstandingInterest;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.existingTenor = item.tenor;
    this.tenorLeft = tenorLeft;
    this.customerName = item.customerName;
    this.interestRate = item.interestRate;
    this.maturityAmount = ConvertString.ToNumberFormate(item.outstandingPrincipal + item.outstandingInterest);
    this.effectiveDate = effectiveDate;
    this.maturityDate = maturityDate;
    this.displaySearchModal = false;
  }

  getDueCommercialLoans(id) {
    this.loadingService.show()
    this.loanOperationService.getdueCommercialLoansByApplicationDetailId(id).subscribe((response: any) => {
      this.loadingService.hide();
      this.maturedLoans = response.result;
    });
  }

  getMaturedInstructionType() {
    this.loadingService.show()
    this.loanOperationService.getMaturedInstructionType().subscribe((response: any) => {
      this.loadingService.hide();
      this.maturedLoansInstructionType = response.result;
    });
  }  

  getmaturedLoanInstruction() {
    this.loadingService.show()
    this.loanOperationService.getMaturedLoanInstructions().subscribe((response: any) => {
      this.loadingService.hide();
      this.maturedLoanInstruction = response.result;
    });
  } 

  showPreviousInstructionsOrAddNew(){
    if(this.displayPreviousInstructions){
      this.maturityCommandText = "View Loan Maturity Instructions"
      this.displayPreviousInstructions = false;
    }
    else {
      this.maturityCommandText = "Add Automatic Rollover";
      this.getmaturedLoanInstruction();
      this.displayPreviousInstructions = true;
    }
  }

  onFileChange(event) {
      this.files = event.target.files;
      this.file = this.files[0];
  }
  
  fileExtention(name: string) {
      var regex = /(?:\.([^.]+))?$/;
      return regex.exec(name)[1];
  }
  
  clearControls() {
    this.autoRolloverForm = this.fb.group({
      instructionType: ['', Validators.required],
      newTenor: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      fileInput: [''],
    });
  }

  saveMaturityInstruction(formObj) {
    //this.loadingService.show();
    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else{
      this.applicationCollection = [];
    }

    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null)
    {
       reviewId = this.selectedLoanReviewId;
    }
    let bodyObj = {
      loanId: this.loanId,
      maturityInstructionId: formObj.value.instructionType,
      newTenor: formObj.value.newTenor,
      loanReviewOperationsId: reviewId,
      operationId: this.operationTypeId,
      fees: this.applicationCollection,

    }; 
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
      __this.loanOperationService.addLoanMaturityInstruction(bodyObj).subscribe((res) => {
        if (res.success == true) {
          swal('Fintrak Credit 360',res.message, 'success');
          __this.loadingService.hide();
        } else {
          swal('Fintrak Credit 360',res.message, 'error');
          __this.loadingService.hide();
        }
      }, (err: any) => {
        swal('Fintrak Credit 360',JSON.stringify(err), 'error');
        __this.loadingService.hide();
    });
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
  });
  }

  restrictNumber(e) { 
  var x = e.target.value;
    if(x > 365 || x < 0){
      this.autoRolloverForm.controls['newTenor'].setValue(0);
    }
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
