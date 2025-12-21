import { Component, OnInit, Input } from '@angular/core';
import { ReviewIrregularScheduleModel } from '../../../credit/models/loan-operation-review';
import { LoanOperationService, LoanApplicationService, LoanService } from '../../../credit/services';
import { LoanSystemTypeEnum } from 'app/shared/constant/app.constant';
import { StaffRoleService } from 'app/setup/services';

@Component({
  selector: 'app-disbursed-facility-detail',
  templateUrl: './disbursed-facility-detail.component.html',
  providers: [LoanOperationService]
})
export class DisbursedFacilityDetailComponent implements OnInit {
  disbursementAccount: string;
  repaymentAccount: string;
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
  writtenOffAccrualAmount: any;
  model: any;
  collateralDetails: any[];
  maturityInstruction: any[];
  entityName: string = "";
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  @Input('displayDetails') displayDetails: boolean = false;
  displayCustomerODDetails: boolean = false;
  @Input('termLoanId') selectedLoanId: number = 0;
  @Input('loanSystemTypeId') loanSystemTypeId: number = 0;
  @Input('customerId') customerId: number = 0; //currently unused
  @Input('loanReferenceNumber') loanReferenceNumber: string;

  private _loadLoanDetails: number;
  loanProductList: any;
  totalLoanBalance: any; 

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails, this.loanSystemTypeId);
  }

  constructor(
    private loanOperationService: LoanOperationService, private loanAppService: LoanApplicationService,
    private loanService:LoanService,
    ) { }

  ngOnInit() {
    this.loanSelection = [];
    this.check(this.loanSelection.productTypeId);
    if(this.selectedLoanId > 0 && this.loanSystemTypeId >0) {
      this.loadDistursedLoanDetails(this.selectedLoanId, this.loanSystemTypeId);
    }
    //  this.loadDistursedLoanDetails(this.selectedLoanId);
  }

  loadDistursedLoanDetails(loanId,loanSystemTypeId) {
    this.loanSelection = {};
    this.GetLoanCollateral(loanId);
    this.GetLaonConvenant(loanId);
    this.GetLaonChargeFee(loanId);
    this.GetLaonScheduleByLoanId(loanId);
    this.viewMaturityInstruction(loanId,loanSystemTypeId);
    this.getWrittenOffAccrualAmount(loanId,loanSystemTypeId);

    if (loanSystemTypeId == LoanSystemTypeEnum.TermDisbursedFacility) {
      this.getApprovedLoanDetails(loanId);
    }
    else if(loanSystemTypeId==LoanSystemTypeEnum.OverdraftFacility)
    {
      this.getOverdraftLoanDetails(loanId);
    }
    else if(loanSystemTypeId==LoanSystemTypeEnum.ContingentFacility)
    {
      this.getContingentLoanDetails(loanId);
    }
    if (loanSystemTypeId == LoanSystemTypeEnum.ThirdPartyLoans) { 
      this.getThirdPartyLoanDetails(this.loanReferenceNumber);
    }
    else if(loanSystemTypeId==LoanSystemTypeEnum.LineFacility)
    {
      return; // this.getContingentLoanDetails(loanId);
    }
    
    
  }

  check(productTypeId){
    if(productTypeId == 6){
      this.displayCustomerODDetails = true;
    }
    else
    {
      this.displayCustomerODDetails = false;
    }
  }

  GetLoanCollateral(loanid) {
    this.loanOperationService.getLoanCollateralByProductType(loanid,0)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  getApprovedLoanDetails(loanId) { 
    this.loanOperationService.getFacilityDetail(loanId).subscribe(response => {

      this.loanSelection = response.result;
      
      this.check(this.loanSelection.productTypeId);
      this.getLoanBalances(loanId);
      if(this.loanSelection.casaAccountNumber2!=null){
        this.repaymentAccount="CASA Account Number (Repayment):",
        this.disbursementAccount="CASA Account Number (Disbursement):"
      }else{
        this.repaymentAccount="CASA Account Number 2:",
        this.disbursementAccount="CASA Account Number 1:"
      }
      
    });
  }
  getThirdPartyLoanDetails(loanReferenceNumber){
    this.loanOperationService.getThirdPartyFacility(loanReferenceNumber).subscribe(response => {

      this.loanSelection = response.result;
      
      this.check(this.loanSelection.productTypeId);
     // this.getLoanBalances(loanId);
      if(this.loanSelection.casaAccountNumber2!=null){
        this.repaymentAccount="CASA Account Number (Repayment):",
        this.disbursementAccount="CASA Account Number (Disbursement):"
      }else{
        this.repaymentAccount="CASA Account Number 2:",
        this.disbursementAccount="CASA Account Number 1:"
      }
      
    });

  }

  getOverdraftLoanDetails(loanId) {
    this.loanOperationService.getOverdraftFacilityDetail(loanId).subscribe(response => {
      this.loanSelection = response.result;
      this.check(this.loanSelection.productTypeId);
    });
  }
  getContingentLoanDetails(loanId) {
   // console.log("loanId: ", loanId);
    this.loanOperationService.getContingentFacilityDetail(loanId).subscribe(response => {
      this.loanSelection = response.result; 

      if (this.loanSelection !== undefined) {
        this.check(this.loanSelection.productTypeId);
      }
      
    });
  }
  
  GetLaonConvenant(loanId) {
    this.loanOperationService.getLoanConvenantDetail(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
        this.check(this.loanSelection.productTypeId);
      });

  }
  GetLaonChargeFee(loanId) {
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
        this.check(this.loanSelection.productTypeId);
      });
    
  }
  GetLaonScheduleByLoanId(loanId) {
    this.loanOperationService.getLoanDetail(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;
        this.check(this.loanSelection.productTypeId);
      });

  }

  GetCollateral(loanId) {
    this.loanOperationService.getCollateral(loanId,this.loanSelection.productTypeId)
      .subscribe(results => {
        
        this.loanProductList = results.result;
        this.check(this.loanSelection.productTypeId);
      });
     
  }
  viewMaturityInstruction(loanid,loanSystemTypeId){
    this.loanAppService.getMaturityInstruction(loanid,loanSystemTypeId).subscribe((response) => {
        this.maturityInstruction = response.result;
    });
  }
  getWrittenOffAccrualAmount(loanid,loanSystemTypeId){
    this.loanAppService.getWrittenOffAccrualAmount(loanid,loanSystemTypeId).subscribe((response) => {
        this.writtenOffAccrualAmount = response.result == null ? 'N/A' : response.result;
    });
  }
  getLoanBalances(loanId) {
    this.loanService.getLaonBalances(loanId).subscribe(response => {
      this.totalLoanBalance = response.result.totalOutstandingBalance; 

      
    });
  }
}

