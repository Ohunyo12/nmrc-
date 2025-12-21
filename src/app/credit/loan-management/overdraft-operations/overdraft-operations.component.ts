import { ConvertString, GlobalConfig, LoanStatusEnum, JobSourceEnum, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { DisbursedLoanDetailsComponent } from '../disbursed-loan-details/disbursed-loan-details.component';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { DateUtilService } from '../../../shared/services/dateutils';
import { CustomerService } from '../../../customer/services/customer.service';
import { CasaService } from '../../../customer/services/casa.service';
import { LoanSchedule } from '../../models/schedule';
import { ProductType } from '../../../setup/models/product-type';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { Branch } from '../../../setup/models/branch';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChargeFeeAppModel } from '../../models/loan-charge-fee';
import { EditorModule } from 'primeng/primeng';
import { LoanCovenantModel } from '../../models/loan-covenant';
import { GuarantorAppModel } from '../../models/loan-guarantor';
import { FormGroup, FormBuilder, Validators, AbstractControl, Validator } from '@angular/forms';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject ,  Subscription } from 'rxjs';
import { ProductService } from '../../../setup/services/product.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { StaffRoleService } from 'app/setup/services';

@Component({
  selector: 'app-overdraft-operations',
  templateUrl: './overdraft-operations.component.html',
  styles: [`.ui-datepicker {top: -20px !important;}`]
})
export class OverdraftOperationsComponent implements OnInit, OnDestroy {
  loanSystemTypeId: number;
  effectiveDate: any;
  termLoanId: number;
  principalValanceString: any;
  principalBalance: any = 0;
  irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
  scatterdPayments: any[] = [];
  data: any = {};
  loanScheduleDetails: any[];
  customerLoansData: any[];
  operationTypes: any[];
  filteredProducts: any[];
  convenatDetails: any[];// LoanCovenantModel[] = [];;
  guarantorDetails: any[];// GuarantorAppModel[] = [];
  chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
  frequencies: any[];
  searchTerm$ = new Subject<any>();
  searchAccountTerm$ = new Subject<any>();
  displaySearchModal: boolean = false;
  displayReviewModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayCASASearchModal: boolean = false;
  displayPaymentPlan: boolean = false;
  displayLoanSearch: boolean = true;
  displatBackToSearch: boolean = false;
  displayCasaDetails: boolean = false;
  searchResults: any[];
  casaSearchResults: any[];
  selectedTypeId: number = null;
  selectedLoanId: number = null;
  loanSelection: any;
  model: any;
  LoanReviewForm: FormGroup;
  entityName: string = "";
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  RegulatoryInterestRateChange: boolean = false;
  SubAllocationOverdraft: boolean = false;
  PrepaymentChange: boolean = false;
  PrincipalFrequencyChange: boolean = false;
  InterestFrequencyChange: boolean = false;
  InterestandPrincipalFrequencyChange: boolean = false;
  PaymentDateChange: boolean = false;
  TenorChange: boolean = false;
  CASAAccountChange: boolean = false;
  Overdrafttopup: boolean = false;
  FeechargeChange: boolean = false;
  TerminateandRebook: boolean = false;
  CompleteWriteOff: boolean = false;
  CancelUndisbursedLoan: boolean = false;
  OverdraftTenorExtension: boolean = false;
  OverdraftRenewal: boolean = false;
  maturityDate: Date;
  principalAmount: number = null;
  overDraft: number = null;
  interestRate: number = null;
  overDraftLoanData: any[];
  selectedOperationId: any;
  systemCurrentDate: any;
  customerId: number;
  accountSearch: any;
  lmsApplicationDetailId: number = 0;
  TenorExtention: boolean = false;
  overdraftUndrawnAmount: number = null;
  overdraftDrawnAmount: number = null;
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  approvedLoanOperationReviewData: any[];
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  startYear: number = 2000;
  hideEffectiveDate: boolean = true;
  hideExpiryDate: boolean = true;
  jobSourceId: number;

  creditAppraisalLoanApplicationId: any;
  creditAppraisalOperationId: any;
  appraisalOperationName: any;
  appraisalApplicationId: any;
  appraisalOperationId: any;

  searchString: string;
  searchForm: FormGroup;
  displaySearchForm: boolean = false;

  private subscriptions = new Subscription();
  
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  //@ViewChild(DisbursedLoanDetailsComponent) disbursedLoanDetails: DisbursedLoanDetailsComponent;
  constructor(private fb: FormBuilder, private loadingService: LoadingService, private loanSrv: LoanService,
    private productService: ProductService, private loanOperationService: LoanOperationService,
    private router: Router, private casaService: CasaService, private customerService: CustomerService,
    private dateUtilService: DateUtilService,private staffRole: StaffRoleService, ) {
      
  this.subscriptions.add(
    this.loanOperationService.searchForOD(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
        this.searchResults = this.searchResults.filter(x=>x.loanStatusId == LoanStatusEnum.Active);
        ////console.log('search item', this.searchResults);
      }));
  }

  ngOnInit() {
    this.jobSourceId = JobSourceEnum.LMSOperationAndApproval;
    this.getFrequencyTypes();
    this.GetAllProductTypes();
    this.GetOperationType();
    this.clearControl();
    this.getApprovedOverDraftReviewApplication();
    const dateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
    //dateControl.valueChanges.debounceTime(1000).subscribe(value =>

this.getUserRole();

this.subscriptions.add(
    dateControl.valueChanges.subscribe(value =>
      this.compareDate()));

  }

  userisAnalyst:boolean = false;
  userIsRelationshipManager = false;
  userIsAccountOfficer = false;
  staffRoleRecord: any;
  selectedId: number = null;

  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
        this.staffRoleRecord = res.result;
            if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') { 
                this.userIsAccountOfficer = true; 
            }
            if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                this.userIsRelationshipManager = true; 
            }
        });

        // this.selectedId = null;
        // this.documentSectionForm = this.fb.group({
        //     sectionId: ['', Validators.required],
        // });
}
  searchForGroupAccount(searchTerm) {
    
this.subscriptions.add(
    this.casaService.searchOverdraftCASA(searchTerm, this.customerId)
      .subscribe(results => {
        this.casaSearchResults = results.result;
        ////console.log('search item', this.casaSearchResults);
      }));
  }

  getApprovedOverDraftReviewApplication() {
    this.loanOperationService.getApprovedOverDraftReviewApplication()
      .subscribe(results => {
        this.overDraftLoanData = results.result;
        ////console.log('search item', this.searchResults);
      });
  }

  // getApprovedOverDraftReviewApplication() {
    
  // this.subscriptions.add(
  //   this.loanOperationService.getApprovedOverDraftRouteAndReviewApplication()
  //     .subscribe(results => {
  //       this.overDraftLoanData = results.result;
  //       ////console.log('search item', this.searchResults);
  //     }));
  // }

  getFrequencyTypes() {
    
    this.subscriptions.add(
    this.loanSrv.getFrequencyTypes()
      .subscribe((res) => {
        this.frequencies = res.result;
      }));
  }
  GetAllProductTypes() {
    
    this.subscriptions.add(
    this.productService.getAllProductTypes().subscribe((response: any) => {
      this.filteredProducts = response.result;
      ////console.log("Product Type", this.filteredProducts)
    }));
  }
  GetOperationType() {
    this.loanOperationService.getOperationTypeByOD()
      .subscribe((results) => {
        this.operationTypes = results.result;
      });
  }
  GetOperationTypeByScheduleId(productTypeId, scheduleTypeId) {
    
    this.subscriptions.add(
    this.loanOperationService.getOperationTypeByScheduleId(productTypeId, scheduleTypeId)
      .subscribe((results) => {
        this.operationTypes = results.result;
      }));
  }
  GetLaonGuarantors(loanId) {
    // this.loanOperationService.getLoanGuarantors(loanId)
    //   .subscribe((results) => {
    //     this.guarantorDetails = results.result;
    //   });
  }
  GetLaonConvenant(loanId) {
    
    this.subscriptions.add(
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      }));
  }
  GetLaonChargeFee(loanId) {
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
      });
  }
  GetLaonScheduleByLoanId(loanId) {
    
    this.subscriptions.add(
    this.loanOperationService.getLoanScheduleByLoanId(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;
      }));
  }
  getAccountStatus(id) {
    return this.casaService.getAccountStatus(id);
  }

  getOperation(id) {
    return this.casaService.getOperation(id);
  }

  getPostNoStatus(id) {
    return this.casaService.getPostNoStatus(id);
  }
  getCustomerSensitivityLevel(id) {
    return this.customerService.getCustomerSensitivityLevel(id);
  }
  hideAllControl() {
    this.RegulatoryInterestRateChange = false;
    this.SubAllocationOverdraft = false;
    this.PrepaymentChange = false;
    this.PrincipalFrequencyChange = false;
    this.InterestFrequencyChange = false;
    this.InterestandPrincipalFrequencyChange = false;
    this.PaymentDateChange = false;
    this.TenorChange = false;
    this.CASAAccountChange = false;
    this.Overdrafttopup = false;
    this.FeechargeChange = false;
    this.TerminateandRebook = false;
    this.CompleteWriteOff = false;
    this.CancelUndisbursedLoan = false;
    this.checkBoxApplicable = false;
    this.OverdraftTenorExtension = false;
    this.OverdraftRenewal = false;
  }
  OnOperationTypeChange(event) {
    this.hideAllControl();
    this.clearControl();
    let operationTypeId = Number(event);
 
    this.LoanReviewForm.controls['proposedEffectiveDate'].enable();
    this.LoanReviewForm.controls['operationTypeId'].setValue(operationTypeId);
    this.LoanReviewForm.controls['loanId'].setValue(this.loanSelection.loanId);
    this.LoanReviewForm.controls['productTypeId'].setValue(this.loanSelection.productTypeId);
    this.LoanReviewForm.controls['interateRate'].setValue(this.interestRate);
    this.LoanReviewForm.controls['maturityDate'].setValue(new Date(this.maturityDate));
    this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.systemCurrentDate));

    switch (operationTypeId) {

      case 20: {
        this.SubAllocationOverdraft = true;
        //this.displayCASASearchModal = true;
        this.displaySearchModal = true;
        this.TenorExtention =false;
        this.hideExpiryDate = true;
        this.hideEffectiveDate = true;
        break;
      }

      case 28: {
        this.Overdrafttopup = true;
        this.TenorExtention =false;
        this.hideExpiryDate = true;
        this.hideEffectiveDate = true;
        break;
      }
      case 52: {
        this.OverdraftTenorExtension = true;
        this.TenorExtention =true;
        this.hideExpiryDate = false;
        this.hideEffectiveDate = true;

        //this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.systemCurrentDate));
        break;
      }
      case 53: {
        let expireDate = new Date(this.maturityDate);
        var date = new Date(expireDate.getTime() + 1 * 86400 * 1000);
        this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(date);
        this.OverdraftRenewal = true;
        this.TenorExtention =false;

        this.hideExpiryDate = false;
        this.hideEffectiveDate = false;
        break;
      }
      case 75: {
        const overDraftRenewalControl = this.LoanReviewForm.get('overDraftTopup');
        overDraftRenewalControl.clearValidators();
        overDraftRenewalControl.updateValueAndValidity();
        this.TenorExtention =false;
        this.hideExpiryDate = true;
        this.hideEffectiveDate = true;

        break;
      }
      default: {
        break;
      }
    }
  }
  getOverDraftDetailByLoanId(revolvingLoanId) {
    this.loadingService.show();
    
    this.subscriptions.add(
    this.loanOperationService.getOverDraftDetailsByLoanId(revolvingLoanId)
      .subscribe(results => {
        this.loadingService.hide()
        this.loanSelection = results.result;
        if (this.loanSelection != undefined) {
          this.entityName = "Perform Overdraft Review Operation For: " + this.loanSelection.customerName;
          // this.termLoanId = this.loanSelection.loanId;
          this.maturityDate = this.loanSelection.maturityDate;
          this.effectiveDate = this.loanSelection.effectiveDate;
          this.principalAmount = this.loanSelection.principalAmount;
          this.overdraftUndrawnAmount = this.loanSelection.overdraftUndrawnAmount;
          this.overdraftDrawnAmount = this.loanSelection.overdraftDrawnAmount;
          this.interestRate = this.loanSelection.interestRate;
          this.customerId = this.loanSelection.customerId;
          this.currencyId = this.loanSelection.currencyId;

        }
      }));
  }
  takeFeeStatus: number;

  currencyId: number;
  applicationCollection: any[] = [];
  takeFees(event) { 
    this.applicationCollection = event; 
  console.log("applicationCollection",this.applicationCollection);
  }

  onSelectedLoanChange(event): void {
    const row = event.data;
    
    this.selectedOperationId = row.operationId;
    this.systemCurrentDate = row.systemCurrentDate;
    this.lmsApplicationDetailId = row.lmsApplicationDetailId;
    this.loanSystemTypeId = row.loanSystemTypeId;
    this.lmsOperationId = row.lmsOperationId;
    this.getOverDraftDetailByLoanId(row.loanId);
    this.termLoanId = row.loanId;
    this.loanSystemTypeId = row.loanSystemTypeId;
    this.displayLoanSearch = false;
    this.displayCustomerLoanDetails = true;
    this.displatBackToSearch = true;
    this.selectedApplicationRefNumber = row.lmsApplicationReferenceNumber;
    this.selectedloanReviewApplicationId = row.loanReviewApplicationId;
    this.approvedLoanOperationReviewData = row.operationReview;

    this.creditAppraisalLoanApplicationId = row.creditAppraisalLoanApplicationId;
    this.creditAppraisalOperationId = row.creditAppraisalOperationId;
    this.appraisalOperationName = row.appraisalOperationName;
    this.appraisalApplicationId = row.creditAppraisalLoanApplicationId;
    this.appraisalOperationId = row.creditAppraisalOperationId;


    if (this.approvedLoanOperationReviewData != null)
    {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
      this.displayRefered = true;
    }
    else
    {
      //this.loaddataForm(this.selectedLoanReview);
      this.displayRefered = false;

    }
  }
  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;

      this.data.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;
      
      this.subscriptions.add(
      this.loanSrv.getApprovalTrailByOperation(row.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
        this.approvalWorkflowData = res.result;
    }));

    this.OnOperationTypeChange(row.operationTypeId);
    this.operationTypes
    .filter
    ( x=>
      x.operationTypeId == row.operationTypeId 
    )

      this.LoanReviewForm.controls["operationTypeId"].setValue(
        row.operationTypeId        
      );
      this.LoanReviewForm.controls["proposedEffectiveDate"].setValue(
        new Date(row.newEffectiveDate)
        
      );
      this.LoanReviewForm.controls["interestRate"].setValue(
        row.newInterateRate
      );
      this.LoanReviewForm.controls["maturityDate"].setValue(
        new Date(row.newMaturityDate)
      );
      this.LoanReviewForm.controls["accountNumber"].setValue(
        row.accountNumber
      );
 this.LoanReviewForm.controls["overDraftTopup"].setValue(
        row.overDraftTopup
      );
      this.LoanReviewForm.controls["reviewDetails"].setValue(
        row.reviewDetails
      );
    }
  }



  clearControl() {
    this.LoanReviewForm = this.fb.group({
      loanReviewOperationsId: [0],
      loanId: [''],
      productTypeId: [''],
      operationTypeId: ['', Validators.required],
      reviewDetails: ['', Validators.required],
      proposedEffectiveDate: [''],
      interateRate: ['', Validators.required],
      prepayment: [0],
      maturityDate: [''],
      principalFrequencyTypeId: [''],
      interestFrequencyTypeId: [''],
      principalFirstPaymentDate: [''],
      interestFirstPaymentDate: [''],
      tenor: [''],
      cASA_AccountId: [''],
      accountNumber: [''],
      overDraftTopup: [''],
      fee_Charges: [''],
      terminationAndReBook: [''],
      completeWriteOff: [''],
      cancelUndisbursedLoan: [''],
      approvalStatusId: [''],
      isManagementRate: [''],
      validateDrawnLimit: [false],
      takeFeeStatus: [''],

    });

    this.searchForm = this.fb.group({
      searchString: ['', Validators.required]
    });
  }

  backToLoanSearch() {
    // this.customerLoansData = [];
    this.loanSelection = [];
    this.displayLoanSearch = true;
    this.displatBackToSearch = false;
    this.displayCustomerLoanDetails = false;
  }
  showReviewForm(): void {
    this.clearControl();
    this.hideAllControl();
    if (this.loanSelection != undefined) {
      ////console.log('Operations', this.loanSelection);
      this.OnOperationTypeChange(this.selectedOperationId);
      // this.LoanReviewForm.controls['operationTypeId'].setValue(this.selectedOperationId);
      // this.LoanReviewForm.controls['loanId'].setValue(this.loanSelection.loanId);
      // this.LoanReviewForm.controls['productTypeId'].setValue(this.loanSelection.productTypeId);
      // this.LoanReviewForm.controls['interateRate'].setValue(this.interestRate);
      // this.LoanReviewForm.controls['maturityDate'].setValue(new Date(this.maturityDate));
      // this.LoanReviewForm.controls['proposedEffectiveDate'].setValue(new Date(this.effectiveDate));
    }
    this.displayReviewModal = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }
  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  searchCASA(searchString) {
    this.searchAccountTerm$.next(searchString);
  }

  pickSearchedData(item) {
    this.customerLoansData = this.searchResults.filter(x => x.customerId == item.customerId);
    ////console.log('search item picked', item);
    this.displaySearchModal = false;
  }
  viewCasaDetails(index) {
    this.displayCasaDetails = true;
    this.model = this.casaSearchResults[index];
  }
  pickCASASearchedData(item) {
    this.LoanReviewForm.controls['accountNumber'].setValue(item.productAccountNumber);
    this.LoanReviewForm.controls['cASA_AccountId'].setValue(item.casaAccountId);
    ////console.log("CASA Account Id", item.casaAccountId)
    this.displayCASASearchModal = false;
  }
  submitLoanReviewForm(formObj) {
    
    // SubAllocationOverdraft 20
    // Overdrafttopup 28
    // OverdraftTenorExtension 52
    // OverdraftRenewal 53
    ////console.log('Testing 1234', formObj.value.operationTypeId)
    if (formObj.value.operationTypeId == 20) {
      if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount)) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility limit.', 'info');
        return
      }
      if (new Date(formObj.value.maturityDate) > new Date(this.maturityDate)) {
        swal('FinTrak Credit 360', 'Sub-Allocation expire date must not exceed the line limit expire date.', 'info');
        return
      }
      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }
    }
    if (formObj.value.operationTypeId == 28) {
      if (new Date(formObj.value.maturityDate) > new Date(this.maturityDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up expire date must not exceed the line limit expiry date.', 'info');
        return
      }
      if (new Date(this.maturityDate) < new Date(this.systemCurrentDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up operation cannot be performed on expired facility.', 'info');
        return
      }
      if (new Date(formObj.value.proposedEffectiveDate) < new Date(this.systemCurrentDate)) {
        swal('FinTrak Credit 360', 'Overdraft Top-up operation start date cannot be back dated.', 'info');
        return
      }

      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }
    }
    if (formObj.value.operationTypeId == 52) {
      if (formObj.value.validateDrawnLimit == true) {
        if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount - this.overdraftUndrawnAmount)) {
          swal('FinTrak Credit 360', 'Overdraft tenor extension limit cannot be greater than drawn limit.', 'info');
          return
        }
      }

      if (Number(formObj.value.overDraftTopup.replace(/[,]+/g, "").trim()) > Number(this.principalAmount)) {
        swal('FinTrak Credit 360', 'Overdraft tenor extension limit cannot be greater than original limit.', 'info');
        return
      }

      if ((new Date(formObj.value.proposedEffectiveDate) < new Date(this.systemCurrentDate)) && (new Date(this.maturityDate) > new Date(this.systemCurrentDate))) {
        swal('FinTrak Credit 360', 'Overdraft tenor extention operation cannot be back dated on running facility.', 'info');
        return
      }

      if ((new Date(this.maturityDate) < new Date(this.systemCurrentDate)) && (this.convertDateDayToDays(this.maturityDate, 1) == (this.convertDateToDays(formObj.value.proposedEffectiveDate)))) {
        swal('FinTrak Credit 360', 'Overdraft tenor extention operation start date must be expired limit date plus one day.', 'info');
        return
      }

      if (formObj.value.overDraftTopup > this.principalAmount) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility Limit.', 'info');
        return
      }
      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }

    }
    if (formObj.value.operationTypeId == LMSOperationEnum.OverdraftRenewal) {

      if (formObj.value.overDraftTopup > this.principalAmount) {
        swal('FinTrak Credit 360', 'Sub-Allocation Limit must not be greater than facility Limit.', 'info');
        return
      }
      ////console.log('Testing Testing 1', this.convertDateDayToDays(this.maturityDate, 1));
      ////console.log('Testing Testing 2', this.convertDateToDays(formObj.value.proposedEffectiveDate));
      if ((Number(this.convertDateDayToDays(this.maturityDate, 1)) < Number(this.convertDateToDays(formObj.value.proposedEffectiveDate)))) {
        swal('FinTrak Credit 360', 'Overdraft renewal operation start date must be later than expiring date plus one day.', 'info');
        return
      }


      // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
      //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
      //   return
      // }

    }
    if (new Date(formObj.value.proposedEffectiveDate) > new Date(formObj.value.maturityDate)) {
      swal('FinTrak Credit 360', 'Start date must not be greater than expiring date.', 'info');
      return
    }
    // if (new Date(formObj.value.proposedEffectiveDate) > new Date(this.systemCurrentDate)) {
    //   swal('FinTrak Credit 360', 'Start date cannot be post-dated.', 'info');
    //   return
    // }

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
      loanReviewOperationsId: reviewId,
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      loanSystemTypeId: 2,
      loanId: formObj.value.loanId,
      productTypeId: formObj.value.productTypeId,
      operationTypeId: formObj.value.operationTypeId,
      reviewDetails: formObj.value.reviewDetails,
      proposedEffectiveDate: formObj.value.proposedEffectiveDate,
      interateRate: formObj.value.interateRate,
      prepayment: formObj.value.prepayment,
      maturityDate: formObj.value.maturityDate,
      principalFrequencyTypeId: formObj.value.principalFrequencyTypeId,
      interestFrequencyTypeId: formObj.value.interestFrequencyTypeId,
      principalFirstPaymentDate: formObj.value.principalFirstPaymentDate,
      interestFirstPaymentDate: formObj.value.interestFirstPaymentDate,
      tenor: formObj.value.tenor,
      cASA_AccountId: formObj.value.cASA_AccountId,
      accountNumber: formObj.value.accountNumber,
      overDraftTopup: formObj.value.overDraftTopup,
      fee_Charges: formObj.value.fee_Charges,
      terminationAndReBook: formObj.value.terminationAndReBook,
      completeWriteOff: formObj.value.completeWriteOff,
      cancelUndisbursedLoan: formObj.value.cancelUndisbursedLoan,
      approvalStatusId: formObj.value.approvalStatusId,
      isManagementRate: formObj.value.isManagementRate,
      reviewIrregularSchedule: this.scatterdPayments,
      fees: this.applicationCollection,

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
      
      __this.subscriptions.add(
      __this.loanOperationService.addLoanReviewOperation(bodyObj).subscribe((res) => {
      if (res.success == true) {
        __this.loadingService.hide();
        __this.displayReviewModal = false;
        __this.getApprovedOverDraftReviewApplication();
        __this.backToLoanSearch();
        swal('FinTrak Credit 360', 'This Operation has been forwarded for Approval', 'success');
      } else {
        swal('FinTrak Credit 360', res.message, 'error');
        __this.loadingService.hide();
      }
    }, (err: any) => {
      swal('FinTrak Credit 360', JSON.stringify(err), 'error');
      __this.loadingService.hide();
    }));
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
  });
  }
  addToList() {
    if (Number(this.principalValanceString) - Number(this.data.amount.replace(/[,]+/g, "").trim()) < 0) {
      swal('FinTrak Credit 360', "Payment amount cannot be greater than principal amount", "error");
      return;
    }
    if (new Date(this.data.scateredDate) < new Date(this.loanSelection.effectiveDate)) {
      swal('FinTrak Credit 360', "Payment date cannot be less than effective date", "error");
      // this.data.scateredDate = null;
      return;
    }
    var pmts = {
      paymentDate: new Date(this.data.scateredDate),//this.dateUtilService.formatJsonDate(this.data.scateredDate),
      paymentAmount: this.data.amount
    };
    // this.irregularReviewCollection.push(pmts);
    this.scatterdPayments.push(pmts);
    this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount.replace(/[,]+/g, "").trim()));
    this.principalValanceString = this.principalBalance;
    this.data.scateredDate = "";
    this.data.amount = ""


  }

  validateExpiryDate(expDate){
    if(this.LoanReviewForm.value.operationTypeId == LMSOperationEnum.OverdraftTenorExtension){
      if(new Date(expDate) < new Date(this.maturityDate)){
        swal('Fintrak Credit 360','Expiry date can only be extended. Choose a future date.','warning');
        this.LoanReviewForm.controls['maturityDate'].setValue(new Date(this.maturityDate));
      }
    }
    
  }

  restrictNumber(e) {
    var x = e.target.value;

      if(Number(x.replace(/[,]+/g, "").trim()) > Number(this.principalAmount)){
        this.LoanReviewForm.controls['overDraftTopup'].setValue("");
      }
    }
  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount.replace(/[,]+/g, "").trim()));
    this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.scatterdPayments.splice(indx, 1);

  }
  compareDate(): void {
    if (this.loanSelection.scheduleTypeId == 1) {
      const principalDateControl = this.LoanReviewForm.get('principalFirstPaymentDate');
      const interestDateControl = this.LoanReviewForm.get('interestFirstPaymentDate');
      if (principalDateControl.pristine || interestDateControl.pristine) {
        ////console.log('It is working');
        return;
      }
      if (Number(principalDateControl.value) != Number(interestDateControl.value)) {
        ////console.log('It is working', Number(principalDateControl));
        ////console.log('It is working', Number(interestDateControl));
        swal('FinTrak Credit 360', 'Please ensure that First Principal date and First Interest Date are equal', 'error');
        return;
      }
    }
  }
  formatValue() {
    if (this.data.amount == '') return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === 'M' || currVal == 'm') {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else if (currVal === 'b' || currVal === 'B') {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    } else {
      let result: Number = Number(realChar);
      this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
  }
  convertDateToDays(date) {
    let expireDate = new Date(date);
    var days = Math.floor((expireDate.getTime()) / 86400 * 1000);
    return days;
  }
  convertDateDayToDays(date, day) {
    let expireDate = new Date(date);
    let expireDateDay = expireDate.getTime() + day * 86400 * 1000;
    var days = Math.floor(expireDateDay / 86400 * 1000);
    return days;
  }
  CallRequestClose() { this.displayJobrequest = false; }
  displayJobrequest = false;
  facilityList: any;

  lmsOperationId: number;

  displayReferBackForm: boolean;
  displayStatus(event) {
    if(event == true) {
        this.displayReferBackForm = false;
        this.backToLoanSearch();
        this.getApprovedOverDraftReviewApplication();
    }
  }

  afterReferBackSuccess(event) {
    // swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
    this.displayReferBackForm = false;
    this.backToLoanSearch();
    this.getApprovedOverDraftReviewApplication();
    //this.displayCommentForm = false;
  }

  showSearchForm() { this.displaySearchForm = true; }

  submitForm(formObj) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanOperationService.getApprovedOverDraftReviewApplicationSearch(formObj.searchString).subscribe((res) => {
        if (res.success == true) {
          this.overDraftLoanData = res.result;
          this.displaySearchForm=false;
          this.clearControl();
        } else {
          this.displaySearchForm=false;
        }
        this.loadingService.hide(1000);
      }, (err: any) => {
        this.loadingService.hide(1000);
      }));
  }

}
