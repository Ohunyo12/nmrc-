
import { LoanService } from '../../services/loan.service';
import swal from 'sweetalert2';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig, ConvertString } from '../../../shared/constant/app.constant';
import { LoanApplicationService } from '../../services/loan-application.service';
import { IReassignAccount } from './reassignaccount.interface';
import { LoanReviewApplicationService } from '../../services/loan-review-application.service';

@Component({
  selector: 'reassign-account',
  templateUrl: 'reassignaccount.component.html'
})

export class ReassignAccountComponent implements OnInit {
  loanSearchForm: FormGroup;
  activeSearchTabindex: number;
  displayLoanSearch: boolean;
  principalAmount: number;
  displayScheduleModalForm: boolean;
  selectedId: number = null;
  displayAddModal: boolean = false;
  displaySearchModal: boolean = false;
  entityName: string = "Loan Prepayment";
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  productTypeId: number;
  runningLoansForm: FormGroup;
  prepayments: any[];
  recoveries: any[];
  casas: any[];
  agents: any[];
  loanPrepaymentData: any = {};
  maintainTenor: boolean;
  loanPrepayments: any[];
  displayData: boolean = false;
  displaysearch: boolean = false;
  displayMaturityDate: boolean = false;
  displayEffectiveDate: boolean = false;
  scheduleType: number;
  displayIrregularSchedule: boolean = false;
  displayRegularSchedule: boolean = false;
  accountTypeId: any;
  data: any = {};
  principalValanceString: any;
  newPrincipalBalance: any;
  scatterdPayments: any[] = [];
  principalBalance: number;
  currentRM: number;
  selectedLoanId: number;

  bodyObj: any = {};
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  generateData: any = {};
  officers: any;
  show: boolean = false; message: any; title: any; cssClass: any;
  productTypes: any[];
  reassignAccount: any;//IReassignAccount
  reasignedAccount: any[];
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private loanAppService: LoanApplicationService,
    private dateUtilService: DateUtilService, 
    private reviewService: LoanReviewApplicationService,
    private loanService: LoanService) {
    this.loanOperationService.searchForLoan(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      });
  }

  ngOnInit() {
    this.displaysearch = true;
    this.clearControls();
    this.iniSearch();
    this.productTypes = this.reviewService.getProductTypeList();
    this.loanAppService.getOfficers().subscribe((res) => { this.officers = res.result; });
    this.reviewService.getAllReasignedAccount().subscribe((res) => {
      this.reasignedAccount = res.result;
      ////console.log("result", res.result);
    })
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "Loan Prepayment";
    this.displayAddModal = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }


  getRunningLoan(refNo) {
    this.loadingService.show()
    this.loanPrepaymentService.getRunningLoan(refNo).subscribe((response: any) => {
      this.loadingService.hide();
      const row = response.result;
      ////console.log(response.result);
      if (row != null) {
        this.runningLoansForm.patchValue({
          loanReferenceNumber: row.loanReferenceNumber,
          approvedAmount: ConvertString.ToNumberFormate(row.approvedAmount),
          outstandingPrincipal: ConvertString.ToNumberFormate(row.outstandingPrincipal),
          interestRate: row.interestRate,
          equityContribution: row.equityContribution,
          effectiveDate: new Date(row.effectiveDate),
          maintainTenor: true,
          maturityDate: new Date(row.maturityDate),
          accrualedAmount: ConvertString.ToNumberFormate(row.accrualedAmount),
          scheduleTypeId: row.scheduleTypeId,
          newtenor: row.newtenor,
          teno: row.teno,
          scheduleTypeCategoryId: row.scheduleTypeCategoryId,
          totalAmount: ConvertString.ToNumberFormate(row.totalAmount),
          previousEffectiveDate: new Date(row.previousEffectiveDate),
          pastDueTotal: ConvertString.ToNumberFormate(row.pastDueTotal),
          currency: row.currency,
          relationshipManagerName: this.GetstaffName(row.relationshipManagerId),
          relationshipOfficerName: this.GetstaffName(row.relationshipOfficerId),
          productTypeId: row.productTypeId,
          loanId: row.loanId
        });
        //  ////console.log("")

        this.runningLoansForm.controls['previousEffectiveDate'].disable();
        this.principalValanceString = row.totalAmount;

        if (row.scheduleTypeCategoryId === 2) {
          this.displayIrregularSchedule = true;
        }
        else {
          this.displayIrregularSchedule = false;
        }

      }
      this.displayMaturityDate = false;
      this.displayEffectiveDate = true;
    });


  }

  GetstaffName(managerId): string {
    // tslint:disable-next-line:radix
    return this.officers.find(x => x.staffId === parseInt(managerId)).fullName;
  }

  pickSearchedData(item) {
    this.displayData = true;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.loanId = item.loanId;
    this.productTypeId = item.productTypeId;
    this.displaysearch = false;
    this.displaySearchModal = false;
    this.displayIrregularSchedule = false;
    this.displayRegularSchedule = false;
    this.scatterdPayments = [];
    this.getRunningLoan(this.loanReferenceNumber);

  }

  submitForm() {
    this.loadingService.show();
    const data = this.runningLoansForm.value;
    //const bodyObj = formObj.value;
    this.reassignAccount = {
      productTypeId: data.productTypeId,
      targetId: this.selectedLoanId,
      staffAccountHistoryId: 0,       
      currentRMStaffId: this.currentRM,
      startDate: data.startDate,
      endDate: data.effectFrom,
      effective: data.effectFrom,
      newRMStaffId: data.newRMStaffId,
      reasonForChange: data.reasonForChange,
      approvalStatusId: 0,
      accountTypeId: this.accountTypeId,
    }
    //console.log(this.reassignAccount);
    this.loanPrepaymentService.SaveReassignAccount(this.reassignAccount).subscribe((res) => {
      if (res.result) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.runningLoansForm.reset();
        this.loadingService.hide();
        this.displayData = false;
      }

    });
    this.loadingService.hide();
  }

  clearControls() {
    this.selectedId = null;
    try {
      this.runningLoansForm.controls['loanReferenceNumber'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.runningLoansForm = this.fb.group({
      approvedAmount: ['', Validators.required],
      loanReferenceNumber: ['', Validators.required],
      outstandingPrincipal: ['', Validators.required],
      interestRate: ['', Validators.required],
      //equityContribution: ['', Validators.required],
     //effectiveDate: ['', Validators.required],
      //maturityDate: ['', Validators.required],
      accrualedAmount: ['', Validators.required],
      //scheduleTypeId: ['', Validators.required],
      teno: [''],
      //newtenor: ['', Validators.required],
      scheduleTypeCategoryId: [0],
      totalAmount: [0],
      previousEffectiveDate: [''],
      maintainTenor: [true],
      currency: [''],
      pastDueTotal: [0],
      relationshipManagerName: ['', Validators.required],
      relationshipOfficerName: ['', Validators.required],
      newRMStaffId: ['', Validators.required],
      //currentRMStaffId: '',
      effectFrom: ['', Validators.required],
      reasonForChange: ['', Validators.required],
      //productTypeId: ['', Validators.required],
      //loanId: ['', Validators.required]

    });
  }

  backToSearch() {
    this.displaysearch = true;
    this.displayData = false
  }

  loanSearch() {
    this.refresh();
    this.displayLoanSearch = true;
    this.activeSearchTabindex = 0;
  }

  refresh() {
    // this.reloadGrid++;
    // this.activeTabindex = 0;
    // this.disableSupportingDocumentsTab = true;
    // this.disableApplicationInformationTab = true;
  }
  loans: any[]; loanSelection: any = {}; Selectedloan: any = {};
  iniSearch() {
    this.loanSearchForm = this.fb.group({
      productTypeId: ['', Validators.required],
      searchString: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    });
  }
  onSelectedLoanChange() {  
    this.displayLoanSearch  = false;
    this.displayData = true;
    let typeId = this.loanSearchForm.value.productTypeId;
    
    this.reviewService.getAllReasignedAccountByLoanIdAndProductType(this.Selectedloan.loanId, typeId)
      .subscribe((res) => {


        const row = res.result;
        ////console.log("testing >>> here i am",res.result);
        if (row != null) {
          this.currentRM = row.relationshipManagerId;
          this.selectedLoanId = row.loanId;
          this.runningLoansForm.patchValue({
            loanReferenceNumber: row.loanReferenceNumber,
            approvedAmount: ConvertString.ToNumberFormate(row.approvedAmount),
            outstandingPrincipal: ConvertString.ToNumberFormate(row.outstandingPrincipal),
            interestRate: row.interestRate,
            equityContribution: row.equityContribution,
            effectiveDate: new Date(row.effectiveDate),
            maintainTenor: true,
            maturityDate: new Date(row.maturityDate),
            accrualedAmount: ConvertString.ToNumberFormate(row.accrualedAmount),
            scheduleTypeId: row.scheduleTypeId,
            newtenor: row.newtenor,
            teno: row.teno,
            scheduleTypeCategoryId: row.scheduleTypeCategoryId,
            totalAmount: ConvertString.ToNumberFormate(row.totalAmount),
            previousEffectiveDate: new Date(row.previousEffectiveDate),
            pastDueTotal: ConvertString.ToNumberFormate(row.pastDueTotal),
            currency: row.currency,
            relationshipManagerName: this.GetstaffName(row.relationshipManagerId),
            relationshipOfficerName: this.GetstaffName(row.relationshipOfficerId),
            productTypeId: row.productTypeId,
            loanId: row.loanId,           
            currentRMStaffId: row.relationshipOfficerId,
          });
          //  ////console.log("")
  
          this.runningLoansForm.controls['previousEffectiveDate'].disable();
          this.principalValanceString = row.totalAmount;
  
          if (row.scheduleTypeCategoryId === 2) {
            this.displayIrregularSchedule = true;
          }
          else {
            this.displayIrregularSchedule = false;
          }
  
        }
      })
  }

  submitLoanSearchForm(form) {
    ////console.log("who you help", form.value)
    if (form.invalid) return;
    this.loadingService.show();
    let body = {
      productTypeId: form.value.productTypeId,
      loanSystemTypeId: form.value.productTypeId,
      searchString: form.value.searchString,
    };
    this.reviewService.loanSearch(body).subscribe((response: any) => {
      if (response.success == true) {
        this.loans = response.result;
        ////console.log('loans -->', response.result);
        this.loadingService.hide();
      }else {
        this.loadingService.hide();
      }
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }

  closeLoanSearch() {
    this.displayLoanSearch = false;
  }
  onSearchTabChange(e) {
    this.activeSearchTabindex = e.index;
  }


}
