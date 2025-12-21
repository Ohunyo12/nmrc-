import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { LoanOperationService } from '../../services';
import { DateUtilService } from '../../../shared/services/dateutils';
import { ConvertString} from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { commercialPaperSubAllocationSource } from '../../models/commercial-paper';

@Component({
  selector: 'app-cp-sub-allocation',
  templateUrl: './cp-sub-allocation.component.html',
})
export class CPSubAllocationComponent implements OnInit {
  gridEditted: boolean;
  selectedReferenceNumber: any;
  subAllocationPrincipalAmount: number = 0;
  allSelectedPrincipalAmount: number = 0;
  showFirstGrid: any;
  displayDestinationSearchModal: boolean;
  displaySourceSearchModal: boolean;
  lineId: any;
  isParent: boolean = false;
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
  subAllocationForm: FormGroup;
  loanGridRecordSelected : boolean;
  displayData: boolean = false;
  displaySearch: boolean = false;
  bodyObj: any = {};
  show: boolean = false; message: any; title: any; cssClass: any;

  pipe = new DatePipe('en-US');
  sourceValues :commercialPaperSubAllocationSource []=[];
  changedValues :commercialPaperSubAllocationSource []=[];
  subAllocatedRecord :commercialPaperSubAllocationSource []=[];

  isGroup: boolean;
  loanTrancheSelection:  any[] = [];

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
  ) {}

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
  }

  private _loadLoanDetails: number;

  @Input() set termLoanId(value: number) { 
    this._loadLoanDetails = value;
    if (value > 0){
      this.loadDistursedLoanDetails(this._loadLoanDetails); 
    } 
  }

  loadDistursedLoanDetails(loanId : number) { 
    this.getApprovedLoanDetails(loanId);
  }

  orignalReferenceNumber : string;
  orignalLoanRecord: any;
  otherTrancheRecord: any;
  getApprovedLoanDetails(loanId : number) {
    this.loanOperationService.getDisbursedCommercialLoanTrancheDetailsById(loanId).subscribe(response => {
    this.loanTrancheSelection = response.result;
      this.orignalLoanRecord = this.loanTrancheSelection.filter(x=>x.loanId == loanId)[0];
      this.otherTrancheRecord = this.loanTrancheSelection.filter(x=>x.loanId != loanId)[0];
      this.orignalReferenceNumber = this.orignalLoanRecord.loanReferenceNumber
      this.sourceValues = [];
      this.loanTrancheSelection.forEach(i => {
        let selectedSource = { loanReferenceNumber : null , principalAmount : null, customerId : null , newPrincipalAmount : null, currencyCode : null}
        selectedSource.customerId= i.customerId;
        selectedSource.loanReferenceNumber = i.loanReferenceNumber;
        selectedSource.principalAmount = i.principalAmount;
        selectedSource.newPrincipalAmount= i.principalAmount;
        selectedSource.currencyCode= i.currencyCode;
        this.sourceValues.push(selectedSource);
        this.changedValues =  this.sourceValues;
        this.toggleGrid();
      });
    });
  }

  getCommercialLoanDetailsByLoanId(loanId){
    this.loanOperationService.getDisbursedCommercialLoanTrancheDetailsById(loanId).subscribe(response => {
      this.loanTrancheSelection = response.result;
      });
  }

  // getLoanPrincipal(loanId) {
  //   var record = this.loanTrancheSelection.filter(x=>x.loanId == loanId)[0];
  //   if(record != null && record != undefined){
  //     return record.principalAmount;
  //   } else {}
  // }

  toggleGrid() {
    if(this.showFirstGrid){ this.showFirstGrid =false; } 
    else { this.showFirstGrid =true; } 
  }

  compareWithSourceTranche(id){
    if(id == this.orignalLoanRecord.loanId) {
      swal('Fintrak Credit 360','You cannot sub-allocate to source loan tranche');
      this.subAllocationForm.controls['toTranche'].setValue(null);
      return;
    }
  }

  sumPrincipals() {
    let pAmount = this.allSelectedPrincipalAmount;
    this.allSelectedPrincipalAmount = 0;
    this.sourceValues.forEach(obj =>{ this.allSelectedPrincipalAmount = pAmount + obj.principalAmount; })
  }

  sumNewPrincipals() {
    var newPAmount = 0;
    this.sourceValues.forEach(obj =>{ newPAmount = newPAmount + obj.newPrincipalAmount; })
    this.subAllocationPrincipalAmount = newPAmount;
  }

  onSelectedLoanChange(event) {    
    if(this.sourceValues.length > 1) {
      this.loanGridRecordSelected = true;
      this.selectedReferenceNumber = event.data.loanReferenceNumber;
      this.subAllocationForm.controls['sourcePrincipal'].setValue(ConvertString.ToNumberFormate(event.data.principalAmount));
    } 
    else swal('Fintrak Credit 360', 'Add more loan tranches to allocate principal.', 'info');
  }

  subAllocate(form) {
    let newPrincipal = Number(parseInt(form.value.sourcePrincipal.toString().replace(/[,]+/g, "").trim())) ;
    this.sourceValues.find(x=>x.loanReferenceNumber == this.selectedReferenceNumber).newPrincipalAmount = newPrincipal;

    this.sumNewPrincipals();
    this.toggleGrid();
    this.gridEditted = true;
  }

  clearControls() {
    this.subAllocationForm = this.fb.group({
      amountDifference: ['',Validators.required], 
      toTranche: ['',Validators.required]
    });
    
    //this.sourceValues = [];
    this.subAllocationPrincipalAmount = 0;
    this.allSelectedPrincipalAmount = 0;
  }
  
  saveSubAllocations(formObj) {
    if(formObj.toTranche == this.orignalLoanRecord.loanId) {
      swal('Fintrak Credit 360','You cannot sub-allocate to source loan tranche');
      return;
    }
    this.loadingService.show();
    var body = {
      toLoanId : formObj.value.toTranche,
      amountDifference : formObj.value.amountDifference,
      fromLoanId : this.orignalLoanRecord.loanId
    };
    this.loanOperationService.saveSubAllocations(body).subscribe((res) => {
        if (res.success == true) {
          this.getCommercialLoanDetailsByLoanId(this.orignalLoanRecord.loanId);
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
