import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanOperationService, LoanService, LoanApplicationService, CreditAppraisalService } from '../../services';
import { FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { CasaService } from 'app/customer/services/casa.service';
import { ApprovalCommentsComponent } from 'app/shared/components/approval-comments/approval-comments.component';
import { LoadingService } from 'app/shared/services/loading.service';
//import { ChargeFeeAppModel } from 'app/credit/models';

@Component({
  selector: 'app-facility-detail-summary',
  templateUrl: './facility-detail-summary.component.html', 
  providers: [LoanService]
})
export class FacilityDetailSummaryComponent implements OnInit {
//   loanApplicationId: any;
    isLoanPerforming: boolean;
    isLoanWrittenOff: boolean;
    trailRecent: any;
    trailCount: any;
    trail: any;
    lmsOoperations: any[];
    maturityInstruction:any;
    disbursementAccount: string;
    repaymentAccount: string;
    startDate?: Date; endDate?: Date;
    principalValanceString: any;
    principalBalance: any = 0;
    irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
    scatterdPayments: any[] = [];
    data: any = {};
    otherInformations: any;
    loanScheduleDetails: any[];
    customerLoansData: any[];
    operationTypes: any[];
    filteredProducts: any[];
    convenatDetails: any[];// LoanCovenantModel[] = [];;
    guarantorDetails: any[];// GuarantorAppModel[] = [];
    chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
    frequencies: any[];
    displaySearchModal: boolean = false;
    displayReviewModal: boolean = false;
    displayCustomerLoanDetails: boolean = false;
    displayCASASearchModal: boolean = false;
    displayPaymentPlan: boolean = false;
    displayLoanSearch: boolean = true;
    displatBackToSearch: boolean = false;
    displayCasaDetails: boolean = false;
    selectedTypeId: number = null;
    loanSelection: any;
    activeSearchTabindex: any;
    applicationId:any;
    operationId:any;
    model: any;
    entityName: string = "";
    showLoanFacilityArchive: boolean = false;
    showOverdraftArchive: boolean = false;
    showArchivedSchedule: boolean = false;
    loanSystemTypeName: any;
    displayPaymentPlanButton: boolean = false;
    checkBoxApplicable: boolean = false;
    @Input('displayDetails') displayDetails: boolean = false;
    displayCustomerODDetails: boolean = false;
    @Input('termLoanId') selectedLoanId: number = 0;
    @ViewChild(ApprovalCommentsComponent, {static: false}) approvalComments: ApprovalCommentsComponent;
    private _loadLoanDetails: number;
    loanProductList: any;
    loanSearchForm: any;
    response: any;
    loans: any;
    collateralDetails: any;
    OverdraftLoanSelection: any;
    contingentLoanSelection: any;
    OverdraftLoanSelectionArchive: any;
    loanSelectionArchive: any;
    AllAchiveFacility: any;
    PriodicloanSchedule: any;
    showCASAAccountBanlancePopup: boolean = false;
    accountNumber: number;
    allRelatedLaonFacilities: any;
    showContingenDetail: boolean;
    RelatedContingentLoan: any;
    LoanRpaymentDetail: any;
    contingentUtilizationDetail: any;
    loanReferenceNumber: any;
    dialyInterestAccruals: any;
    principalAmountArc: any;
    interestRateArc: any;
    effectiveInterestRate: any;
    effectiveDate: any;
    maturityDate: any;
    scheduleTypeName: any;
    accountBalance: any;
    accountNumberText: any;
    lastRestructureDate: any;
    loansTest: any;

    loanIdParam: number = null;
    productTypeIdParam: number = null;
    showLMSOperationTrail:boolean=false;
    loanSystemTypeId: number;
    facilityChargeFeeDetails: any;
    //chargeCollection: ChargeFeeAppModel[] = [];
    valueBase: string;
  spread: number;

  constructor(private route: ActivatedRoute, private router: Router,private camService: CreditAppraisalService,
    private loanService: LoanService, private fb: FormBuilder, private casaSrv: CasaService, 
    private loanAppService: LoanApplicationService, private loadService: LoadingService) { }

  ngOnInit() {
    this.GetLoanSystemType();
    this.loanSearchForms();
    this.startDate = new Date();
    this.endDate = new Date();

    this.loanIdParam = +this.route.snapshot.queryParams['loanId'];
    this.productTypeIdParam = +this.route.snapshot.queryParams['productTypeId'];
   // this.onSelectedLoanChange();

  }
  closeAccountBalanceWindow(event) {
    if (event)
      this.showCASAAccountBanlancePopup = false;
  }
  getOtherInformations(data) {
    this.otherInformations = null;
    this.loanService.getOtherInformations(data).subscribe(response => {
      this.otherInformations = response.result;
    });
  }

    // isLoanPerforming(selectedLoan: any): string {
    //     if (selectedLoan.isPerforming) {
    //         return 'Yes';
    //     } return 'No';
    // }

    // isLoanWrittenOff(selectedLoan: any): string {
    //     if (selectedLoan.writtenOff == true) {
    //         return 'Yes';
    //     } return 'No';
    // }

    loadLoanDetails(loanId) {
        this.loanSelection = {};
        this.getLoanDetails(loanId);
        this.GetCollateral(loanId,this.loanSystemTypeId);
        this.GetLaonConvenant(loanId);
        this.GetLaonChargeFee(loanId);
        this.GetLaonScheduleByLoanId(loanId);
        //this.getLoanDetailsArchive(loanId);
        this.getAllAchiveFacilityDetail(loanId);
    }

    loadOverdraftLoanDetails(loanId) {
        this.loanSelection = {};
        this.getOverdraftLoanDetails(loanId);
        this.GetCollateral(loanId,this.loanSystemTypeId);
        this.GetLaonConvenant(loanId);
        this.GetLaonChargeFee(loanId);
        this.GetLaonScheduleByLoanId(loanId);
        // this.getOverdraftLoanDetailsArchive(loanId);
        this.getAllOverdraftFacilityDetailArchive(loanId);
    }

    loadContigentLoanDetails(loanId) {
        this.loanSelection = {};
        this.getContingentLoanDetails(loanId);
        this.GetCollateral(loanId,this.loanSystemTypeId);
        this.GetLaonConvenant(loanId);
        this.GetLaonChargeFee(loanId);
        this.GetLaonScheduleByLoanId(loanId);
        this.GetContingentUtilization(loanId);
    }

  loanSearchForms() {  //
    this.loanSearchForm = this.fb.group({
      productTypeId: ['', Validators.required],
      searchString: ['', Validators.required]
    });

  }
  getLoanDetails(loanId) {
    this.loadService.show();
    this.loanService.getFacilityDetail(loanId).subscribe(response => {
      this.loadService.hide();
      // this.loanService.getLmsFacilityDetail(loanId).subscribe(response => {
      this.loanSelection = response.result;
      if (this.loanSelection != null) {
        this.accountNumber = this.loanSelection.casaAccountNumber;
        this.GetTransactionDetail(this.loanSelection.loanReferenceNumber);
        this.getRelatedTermLoanFacility(this.loanSelection)
        this.loanReferenceNumber = this.loanSelection.loanReferenceNumber;
        this.accountNumberText = this.loanSelection.casaAccountNumber;
        this.spread = +(this.loanSelection.interestRate - this.loanSelection.productPriceIndexRate);
        if(this.loanSelection.casaAccountNumber2!=null){
          this.repaymentAccount="CASA Account Number (Repayment):",
          this.disbursementAccount="CASA Account Number (Disbursement):"
        }else{
          this.repaymentAccount="CASA Account Number 2:",
          this.disbursementAccount="CASA Account Number 1:"
        }
      }
    });


  }
  getRelatedLoanDetails(loanId) {
    this.loanService.getRelatedFacilityDetail(loanId).subscribe(response => {
      this.loanSelectionArchive = response.result;
    });


  }
  getLoanDetailsArchive(archiveId) {
    this.loanService.getFacilityDetailArchive(archiveId).subscribe(response => {
      this.loanSelectionArchive = response.result;
      this.lastRestructureDate = this.loanSelectionArchive.lastRestructureDate

    });
  }
  getOverdraftLoanDetails(loanId) {
    this.loadService.show();
    this.loanService.getOverdraftFacilityDetail(loanId).subscribe(response => {
      this.loadService.hide();
      this.OverdraftLoanSelection = response.result;
      this.getRelatedTermLoanFacility(this.OverdraftLoanSelection)
      this.loanReferenceNumber = this.OverdraftLoanSelection.loanReferenceNumber;
      this.accountNumberText = this.OverdraftLoanSelection.casaAccountNumber;
    });
  }
  getRelatedOverdraftLoanDetails(loanId) {
    this.loanService.getRelatedOverdraftFacilityDetail(loanId).subscribe(response => {
      this.OverdraftLoanSelectionArchive = response.result;

    });
  }
  getOverdraftLoanDetailsArchive(loanId) {
    this.loanService.getOverdraftFacilityDetailArchive(loanId).subscribe(response => {
      this.OverdraftLoanSelectionArchive = response.result;

    });
  }
  getContingentLoanDetails(loanId) {
    this.AllAchiveFacility = null;
    this.loadService.show();
    this.loanService.getContingentFacilityDetail(loanId).subscribe(response => {
      this.loadService.hide();
      this.contingentLoanSelection = response.result;
      this.accountNumber = this.contingentLoanSelection.OverdraftLoanSelection;
      this.getRelatedTermLoanFacility(this.contingentLoanSelection);
      this.accountNumberText = this.contingentLoanSelection.casaAccountNumber;
      this.loanReferenceNumber = this.contingentLoanSelection.loanReferenceNumber;
    });


  }
  getRelatedContingentLoanDetails(loanId) {
    this.AllAchiveFacility = null;
    this.loanService.getRelatedContingentFacilityDetail(loanId).subscribe(response => {
      this.RelatedContingentLoan = response.result;

    });


  }
  getAllAchiveFacilityDetail(loanId) {
    this.AllAchiveFacility = null;
    this.loanService.getAchiveAllFacilityDetail(loanId).subscribe(response => {
      this.AllAchiveFacility = response.result;


    });
  }
  getRelatedTermLoanFacility(data) {
    this.allRelatedLaonFacilities = null;
    this.loanService.getRelatedLoanFacility(data).subscribe(response => {
      this.allRelatedLaonFacilities = response.result;
    });
  }
  getAllOverdraftFacilityDetailArchive(loanId) {
    this.AllAchiveFacility = null;
    this.loanService.getAllOverdraftFacilityDetailArchive(loanId).subscribe(response => {
      this.AllAchiveFacility = response.result;

    });
  }
  GetLaonConvenant(loanId) {
    this.loanService.getLoanConvenantDetail(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      });
  }
  GetLaonChargeFee(loanId) {
    this.loanService.getLoanChargeFee(loanId,this.loanSystemTypeId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
      });

  }

  getFacilityApplicationChargeFee(loanApplicationDeatilId) { //console.debug('loanApplicationDeatilId',loanApplicationDeatilId);
    this.valueBase = 'Rate(%)';
    this.loanService.getFacilityApplicationChargeFee(loanApplicationDeatilId)
      .subscribe(results => {
        this.facilityChargeFeeDetails = results.result;
      });
  }

  GetLaonScheduleByLoanId(loanId) {
    this.loanService.getLoanDetail(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;

      });

  }
  GetLoanSystemType() {
    this.loanService.getLoanSystemType()
      .subscribe(results => {
        this.loanProductList = results.result;
       
      });

  }
  generatePeriodicScheduleArchive(a) {
    let data = {
      archiveCode: a.archiveCode,
      loanId: a.loanId

    }


    this.loanService.generatePeriodicScheduleArchive(data)
      .subscribe(results => {
        this.PriodicloanSchedule = results.result;

        this.principalAmountArc = this.PriodicloanSchedule[0].principalAmount;
        this.interestRateArc = this.PriodicloanSchedule[0].interestRateArc;
        this.effectiveInterestRate = this.PriodicloanSchedule[0].effectiveInterestRate;
        this.effectiveDate = this.PriodicloanSchedule[0].effectiveDate;
        this.maturityDate = this.PriodicloanSchedule[0].maturityDate;
        this.scheduleTypeName = this.PriodicloanSchedule[0].scheduleTypeName;

      });
    this.showArchivedSchedule = true;
  }
  GetCollateral(loanId,loanSystemTypeId) {
    this.loanService.getCollateral(loanId,loanSystemTypeId)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });

  }
  onSearchTabChange($event) {
    this.activeSearchTabindex = $event.index;
  }

  selectedProductType: number = 0;
    submitLoanSearchForm() {
      this.selectedProductType = this.loanSearchForm.value.productTypeId;
        let data = {
        productTypeId: this.loanSearchForm.value.productTypeId,
        searchString: this.loanSearchForm.value.searchString

        }
        
          this.loadService.show();
          this.loanService.getLoanSearch(data).subscribe(results => {
            this.loadService.hide();
            this.loans = results.result;
        });
    }

    onSelectedLoanChange() {
      
        this.spread = null;

        if (this.loanSelection != null) {
        this.isLoanPerforming = this.loanSelection.isPerforming;
        this.isLoanWrittenOff = this.loanSelection.writtenOff;
        }
        let loanId = 0;
        let productTypeId = 0;

        if (this.loanIdParam > 0) {
        loanId = this.loanIdParam;
        productTypeId = this.productTypeIdParam;
        this.loanSystemTypeId = this.productTypeIdParam
        }

        if (this.loanSelection != null) {
        loanId = this.loanSelection.loanId;
        productTypeId = this.loanSearchForm.value.productTypeId;
        this.loanSystemTypeId =this.loanSearchForm.value.productTypeId;
        }
        //console.debug('loanSelection',this.loanSelection);
        if(this.loanSelection != null && this.loanSelection != undefined){
        this.getFacilityApplicationChargeFee(this.loanSelection.loanApplicationDetailId);
        }
        
        if (loanId == 0) return;

        if (productTypeId == 1) {

        this.activeSearchTabindex = 0;

        this.selectedLoanId= loanId;
        this.loadLoanDetails(loanId);
        this.OverdraftLoanSelection = null;
        this.contingentLoanSelection = null;
        this.OverdraftLoanSelectionArchive = null;
        this.dialyInterestAccruals = null;

        } else if (productTypeId == 2) {
        this.activeSearchTabindex = 0;

        this.selectedLoanId = loanId;
        this.loadOverdraftLoanDetails(loanId);
        this.loanSelection = null;
        this.contingentLoanSelection = null;
        this.loanSelectionArchive = null;
        this.dialyInterestAccruals = null;
        } else if (productTypeId == 3) {
        this.activeSearchTabindex = 0;

        this.selectedLoanId = loanId;
        this.loadContigentLoanDetails(loanId);
        this.loanSelection = null;
        this.OverdraftLoanSelection = null;
        this.OverdraftLoanSelectionArchive = null;
        this.loanSelectionArchive = null;
        this.dialyInterestAccruals = null;
        }
        this.viewLMSOperation(loanId,productTypeId);
        this.viewMaturityInstruction(loanId,productTypeId);
        this.activeSearchTabindex = 1;
        this.getOtherInformations(loanId)


    }

  getSelectedAchive(id) {

  }
  viewArchiveDetail(id) {
    if (id.isTermLoam == true) {
      let archiveId = id.loadArchiveId
      this.getLoanDetailsArchive(archiveId);
      this.showLoanFacilityArchive = true;
      this.showOverdraftArchive = false;
    }
    if (id.isOD) {
      let archiveId = id.loadArchiveId
      this.getOverdraftLoanDetailsArchive(archiveId);
      this.showLoanFacilityArchive = false;
      this.showOverdraftArchive = true;
    }
  }

  viewRelatedLoan(d) {
    // let referencenumber = null ;
    // if(this.loanReferenceNumber == d.relatedloanReferenceNumber){
    //   referencenumber = d.loanReferenceNumber;
    // }else{
    //   referencenumber = d.relatedloanReferenceNumber;
      
    // }
    if (d.loanSystemTypeId == 1) {
      this.getRelatedLoanDetails(d.loanId);
      this.showLoanFacilityArchive = true;
      this.showOverdraftArchive = false;
      this.showContingenDetail = false;
    } else if (d.loanSystemTypeId == 2) {
      this.getRelatedOverdraftLoanDetails(d.loanId);
      this.showLoanFacilityArchive = false;
      this.showOverdraftArchive = true;
      this.showContingenDetail = false;
    } else if (d.loanSystemTypeId == 3) {
      this.getRelatedContingentLoanDetails(d.loanId);
      this.showLoanFacilityArchive = false;
      this.showOverdraftArchive = false;
      this.showContingenDetail = true;
    }
  }
  GetTransactionDetail(loanRefNo) {
    this.loanService.getTransactionDetail(loanRefNo)
      .subscribe(results => {
        this.LoanRpaymentDetail = results.result;
      });

  }
  GetContingentUtilization(loanId) {
    this.loanService.getContingentUtilization(loanId)
      .subscribe(results => {
        this.contingentUtilizationDetail = results.result;
      });

  }
  GetDailyInterestAccrual() {
    let data = {
      loanReferenceNumber: this.loanReferenceNumber,
      startDate: this.startDate,
      endDate: this.endDate
    }
    this.loanService.getGetDailyInterestAccrual(data)
      .subscribe(results => {
        this.dialyInterestAccruals = results.result;
        if (this.dialyInterestAccruals.length == 0)
          swal('Fintrak Credit 360', "No Record Found!", 'warning');

      });
  }

  GetAccountBalance() {

    this.casaSrv.getCustomerAccountBalance(this.accountNumberText).subscribe((data) => {
      if (data.result != undefined) {
        this.accountBalance = data.result;
        if (this.accountBalance.hasBalance == false) {
          this.accountBalance = "";
          swal('Fintrak Credit 360', "User unauthorised", 'error');
        }
      }
      if (!data.success) {
        swal('Fintrak Credit 360', data.message, 'error');
      }

    }, err => { });
  }

  showBalance() {
    this.showCASAAccountBanlancePopup = true;
    this.GetAccountBalance();
  }

  back() {
    this.router.navigate(['/credit/appraisal/credit-appraisal']);
  }


  

  viewMaturityInstruction(loanid,loanSystemTypeId){
    this.loanAppService.getMaturityInstruction(loanid,loanSystemTypeId).subscribe((response: any) => {
        this.maturityInstruction = response.result;

      // this.isUsed=  this.maturityInstruction[0].isUsed
      // this.tenor =  this.maturityInstruction[0].tenor
      // this.approvalStatus=  this.maturityInstruction[0].approvalStatus
      // this.instructionType =  this.maturityInstruction[0].instructionType
      // this.actionBy=  this.maturityInstruction[0].actionBy

      
       
     //   this.loadingService.hide();
    }, (err) => {
      //  this.loadingService.hide(1000);
    });
  }
  
  viewLMSOperation(loanid,loanSystemTypeId){
    this.loanAppService.getLmsOperation(loanid,loanSystemTypeId).subscribe((response: any) => {
      this.lmsOoperations = response.result;
      // console.log("this.lmsOoperations: ", this.lmsOoperations);
    
    if (this.lmsOoperations[0] != undefined) {
      this.operationId =  this.lmsOoperations[0].operationId
      // this.loanApplicationId=  this.lmsOoperations[0].loanApplicationId
    }      
     //   this.loadingService.hide();
    }, (err) => {
      //  this.loadingService.hide(1000);
    });
  }

    selectedCompleteOperation: any;
    selectedOperations: any[];
    selectedIds: any[];
  
    viewOperation(row) {
      this.selectedCompleteOperation = row; 
      this.showLMSOperationTrail = true;    
    }

    FireTest(){
      this.loanService.getFireTest()
      .subscribe(results => {
        this.loansTest = results.result;
      });
    }

}

