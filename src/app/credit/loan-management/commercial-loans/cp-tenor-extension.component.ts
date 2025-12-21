import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanOperationService } from '../../services';
import swal from 'sweetalert2';
import { ValidationService } from '../../../shared/services/validation.service';
import { DatePipe } from '@angular/common';
import { ProductTypeEnum, LoanSystemTypeEnum, GlobalConfig } from 'app/shared/constant/app.constant';
import { LoanService } from "../../services/loan.service";

@Component({
  selector: 'app-cp-tenor-change',
  templateUrl: './cp-tenor-extension.component.html',
})
export class CPTenorExtensionComponent implements OnInit {
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
  amountTitle: string = 'Principal Amount';
  isLine: boolean;
  isLoan: boolean;
  displayTranche: boolean;
  isLineView: boolean;
  principalAmount: any;
  interestAmount: any;
  existingTenor: number;
  tenorLeft: number;
  customerName: any;
  interestRate: any;
  maturityAmount: string;
  effectiveDate: string;
  tempDate: Date = new Date();
  maturityDate: string;
  approvedAmount: any;
  approvedInterestRate: any;
  approvedTenor: number;
  expiryDate: string;
  totalTenor: number;
  newTenorLeft: number;

  loanViewSelection: any;
  approvedLoanOperationReviewData: any[];
  selectedLoanReviewId: number;
  operationTypeId: number;
  approvalWorkflowData: any[];
  displayRefered: boolean = false;
  displayTenorChangeModal: boolean;
  takeFeeStatus: number;
  @Output() displayOption: EventEmitter<any> = new EventEmitter<any>();

  @Input('loanSelection') loanSelection: any;
  @Input('termLoanId') selectedLoanId: number = 0;
  pageTitle: string;

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanOperationService: LoanOperationService, private loanSrv: LoanService,

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
    //this.autoRolloverForm.controls['actionType'].setValue('lines');
    //this.isLine = true;
    //this.isLineView = true;

  }

  private _loadLoanDetails: number;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails);
  }
  applicationCollection: any[] = [];

  takeFees(event) { 
    this.applicationCollection = event; 
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

     this.calculateNewTenor();
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
      if(this.loanViewSelection.productTypeId == ProductTypeEnum.CommercialLoans)
      {
        this.pageTitle = "Commercial Loan - Tenor Extension";
      }

      if(this.loanViewSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility)
      {
        this.pageTitle = "FX Revolving Loan - Tenor Extension";
      }

    });
  }

  pipe = new DatePipe('en-US');
  mdate: Date;
  calculateNewTenor() {
    let newTenor = this.autoRolloverForm.value['newTenor'];

    if(newTenor <= 0){
      swal(
        'Fintrak Credit 360',
        'Tenor must be greater than zero.',
        'warning'
      );
      return;
    } 
    let maturitydate = this.loanViewSelection.maturityDate;
    var EXdate = new Date(maturitydate);
    EXdate.setDate(EXdate.getDate() + Number(newTenor));
  
    this.totalTenor = 0;
    this.newTenorLeft = 0;

    this.tenorLeft = this.loanViewSelection.tenor - this.loanViewSelection.tenorUsed;
    this.totalTenor = Number(this.loanViewSelection.tenor) + Number(newTenor);
    this.newTenorLeft = Number(this.tenorLeft) + Number(newTenor);

    this.autoRolloverForm.controls['newMaturity'].setValue(this.pipe.transform(EXdate,'dd/MMM/yyyy' ));
    this.hasNewMaturityDate = true;
  }

  clearControls() {
    this.autoRolloverForm = this.fb.group({
      newTenor: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
      newMaturity: [''],
      actionType: ['',Validators.required],
      searchInput: [''],
      takeFeeStatus: ['',Validators.required],
    });
    this.hasNewMaturityDate =false;
  }

  addTenor(formObj) {
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
      loanRef: this.loanViewSelection.loanReferenceNumber,
      newTenor: formObj.value.newTenor,
      isParent: this.isParent,
      appRef: this.appRef,
      loanId : this.loanViewSelection.loanId,
      loanReviewOperationsId: reviewId,
      operationId: this.operationTypeId,
      fees: this.applicationCollection,
      feeSourceModule: "LMS",

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
      __this.loanOperationService.addTenor(bodyObj).subscribe((res) => {
      if (res.success == true) { 
          swal('Fintrak Credit Credit 360',res.message,'success');
          __this.loadDistursedLoanDetails(__this._loadLoanDetails);
          __this.displayTenorChangeModal = false;
          __this.loadingService.hide();
          this.displayOption.emit(__this.displayTenorChangeModal);  

          __this.clearControls();
        } 
        else { 
          __this.displayTenorChangeModal = true;
          __this.loadingService.hide();


          swal('Fintrak Credit Credit 360',res.message,'error');
          __this.clearControls();
          __this.totalTenor = 0;
          __this.newTenorLeft = 0;
          this.displayOption.emit(__this.displayTenorChangeModal);  

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

  // getRunningCommercialLoanLines() {
  //   this.loadingService.show();
  //   this.loanOperationService.getRunningCommercialLoanLines().subscribe((response: any) => {
  //     this.loadingService.hide();
  //     this.runningLoans = response.result;

  //   });
  // }

    // pickSearchedData(item) {
  //   this.displayTranche = true;
  //   this.displaySearchModal = false;
  //   var selectedLoanRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
  //   this.loanReferenceNumber = selectedLoanRecord[0].loanReferenceNumber;
  //   this.loanId = selectedLoanRecord[0].loanId;
  //   this.displayLoanSearch = true;
  //   this.isParent = false;
  //   this.amountTitle = 'Limit';
  //   const effectiveDate = this.pipe.transform(item.effectiveDate, 'dd/MMM/yyyy');
  //   const maturityDate = this.pipe.transform(item.maturityDate,'dd/MMM/yyyy');
  //   //const outstandingPrincipal = this.autoRolloverForm.controls['outstandingPrincipal'];
  //   //const outstandingInterest = this.autoRolloverForm.controls['outstandingInterest'];
  //   var tenorLeft = item.tenor - item.tenorUsed;

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

  //   //outstandingPrincipal.setValidators(Validators.required);
  //   //outstandingInterest.setValidators(Validators.required);
  //   this.hasNewMaturityDate = false;
  //   this.autoRolloverForm.controls['searchInput'].setValue(null);
  //   this.displaySearchModal = false;
  // }

  // setActionScreen(e) { 
  //   var x = e.target.value;
  //   if(x == 'lines'){
  //     if(!this.isLine){
  //       this.displayTranche = false;
  //       this.clearControls();
  //       this.autoRolloverForm.controls['actionType'].setValue(x);
  //       this.existingTenor = 0;
  //       this.tenorLeft = 0;
  //     } 
  //   }

  //   if( x == 'loans') {
  //     if(!this.isLoan){
  //       this.displayTranche = false;
  //       this.clearControls();
  //       this.autoRolloverForm.controls['actionType'].setValue(x);
  //       this.existingTenor = 0;
  //       this.tenorLeft = 0;
  //     } 
  //     this.isLine = false;
  //     this.isLineView = false;
  //     this.isLoan = true;
  //   }
  // }

  // onSelectedLoanChange(event){

  //   let data = event.data;
  //   this.appRef = data.applicationReferenceNumber;
  //   this.lineId = data.loanApplicationDetailId;
  //   this.isParent = true;
  //   this.isLineView = false;
  //   this.displayTranche = true;

  //   const effectiveDate = this.pipe.transform(data.effectiveDate, 'dd/MMM/yyyy');
  //   const maturityDate = this.pipe.transform(data.expiryDate, 'dd/MMM/yyyy');
    
  //   this.approvedAmount = data.approvedInterestRate;
  //   this.loanReferenceNumber = data.applicationReferenceNumber;
  //   this.approvedTenor = this.existingTenor = data.approvedTenor;
  //   this.tenorLeft = data.tenorLeft;
  //   this.customerName = data.customerName;
  //   this.approvedInterestRate = data.approvedInterestRate;
  //   this.effectiveDate = effectiveDate;
  //   this.expiryDate = maturityDate;
  //   this.hasNewMaturityDate = false;
  // }

    // openSearchBox(): void {
  //   this.displaySearchModal = true;
  // }

  // searchDB(searchString) {
  //   this.searchTerm$.next(searchString);
  //   //this.displayTranche = false;
  //   this.displaySearchModal = true;
  // }
