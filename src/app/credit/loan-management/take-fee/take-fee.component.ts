import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import swal from 'sweetalert2';
import { GlobalConfig, ProductTypeEnum, LMSOperationEnum, LoanSystemTypeEnum, ApprovalStatusEnum, ConvertString } from 'app/shared/constant/app.constant';
import { LoanTypeEnum } from 'app/credit/loans';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanReviewApplicationService, LoanOperationService } from 'app/credit/services';
import { CasaService } from 'app/customer/services/casa.service';
import { Subscription } from 'rxjs';
//import { OtherLoansReviewOperationEnum } from '../../facility-line-operations/line-operation.component';


@Component({
    templateUrl: 'take-fee.component.html'
})
export class TakeFeeComponent implements OnInit, OnDestroy {

    loanSystemTypes: any[] = [
        { id:1, name:'Term/Disbursed Facility' },
        { id:2, name:'Overdraft Facility' },
        { id:3, name:'Contingent Liability' },
        { id:4, name:'Facility Line' },
    ];

    list: any = {
        casaAccounts: [],
        loanSystemTypes: [],
        operationTypes: [],
        interestFrequencyTypes: [],
        principalFrequencyTypes: [],
        feeCharges: [],
    };

    selectedId: number = null;
    regionForm: FormGroup;
    applicationForm: FormGroup;
    displayAddModal: boolean = false;
    entityName: string = 'Loan Review Application';
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    reload: number = 0;
    selectedCustomerId: number = null;
    selectedCurrencyId: number = null;

    selectedBranchId: number = null;
    applicationCollection: any[] = [];
    regions: any[] = [];
    operationTypes: any[] = [];
    selectedLoanDetailId: number;
    selectedLoanSystemTypeId: number;
    operationTypeIds: any[] = [];
feeCharges: any[]=[];
casaAccounts: any[]=[];
private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private reviewService: LoanReviewApplicationService,
        private loanOperationService: LoanOperationService,
        private casaSrv: CasaService,

    ) { }

    ngOnInit() {
        this.getAllSelectList();
        this.initializeForms();
        
      
    }

    // ---------------------

    showApplicationForm = false;
    displayLoanSearch = false;
    disableApplicationInformationTab = true;
    disableLoanInformationTab = true;
    disableSupportingDocumentsTab = true;
    activeTabindex: number = 0;
    application: any = {};
    selectedLoanId: number = null;
    selectedLoanProductId: number = null;
    reloadGrid: number = 0;

    selectedApplicationLoanId: number = 0;
    reloadLoanDetails: number = 0;

    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 2) { }
    }

    onApplicationSelected(selected) {
        this.application = selected;
        this.reloadLoanDetails = selected.loanId;
        this.disableApplicationInformationTab = false;
        this.disableSupportingDocumentsTab = false;
        this.activeTabindex = 1;
        this.reload++;
        ////console.log(this.application)
    }

    newApplication() {
        this.initializeForms();
        this.getRegions();
        this.showApplicationForm = true;
        this.activeSearchTabindex = 0;
    }

    getRegions() {
        let regionTypeId = 1;
        if (this.loanSelection.writtenOff == true) regionTypeId = 2;
        if (this.loanSelection.isPerforming == false) regionTypeId = 3;
        this.subscriptions.add(
        this.reviewService.getRegions(regionTypeId).subscribe((response: any) => {
            this.regions = response.result;
        }));
    }

    loanSearch() {
        this.refresh();
        this.displayLoanSearch = true;
        this.activeSearchTabindex = 0;
    }

    closeLoanSearch() {
        this.displayLoanSearch = false;
    }

    // ---------------------

    getAllSelectList(): void {
        this.loadingService.show();
        this.subscriptions.add(
        this.reviewService.getAllSelectList().subscribe((response: any) => {
            this.list = response.result;
            ////console.log('list--',this.list);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }


    getLoanCustomerAccounts( customerId:number, currencyId: number) {
        this.subscriptions.add(
        this.casaSrv.getAllCustomerAccountByCustomerIdandCurrency(customerId,currencyId).subscribe((data) => {
            this.casaAccounts = data.result;
            ////console.log('customerAccounts',this.customerAccounts)
        }, err => { }));
    }

    
    initializeForms() {
        this.selectedId = null;
        this.clearApplicationForm();
        this.loanSearchForm = this.fb.group({
            loanSystemTypeId: ['', Validators.required],
            // performanceTypeId: ['', Validators.required], // OUT
            searchString: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });
    }

    clearApplicationForm() {
        this.applicationForm = this.fb.group({
            chargeFee: ['', Validators.required],
            description: ['', Validators.required],
            casaAccount: ['', Validators.required],
            feeAmount: ['', Validators.required],

        });
    }

    edit(row) {
        this.selectedId = row.timelineId;
        this.applicationForm = this.fb.group({
            chargeFee: [row.chargeFee, Validators.required],
            description: [row.description, Validators.required],
            feeAmount:[row.feeAmount, Validators.required],
            casaAccount:[row.casaAccount, Validators.required],

        });
        this.showApplicationForm = true;
    }

    onChangeFacilityType(id) {
        this.selectedLoanSystemTypeId = id;       
    }
filterOperations(){
    let id = this.selectedLoanSystemTypeId;
    let operationIds = [];
    let typeIds = [5,8,9]; // operation type ids
    this.operationTypes = [];
    this.feeCharges = this.list.feeCharges;
    ////console.log("list",this.list);
   //console.log("selectedPerformanceTypeId",this.selectedPerformanceTypeId);
    //console.log("id",id);

    if (id == 1) { // loan
        if (this.selectedPerformanceTypeId == 1) typeIds = [5]; // pl
        if (this.selectedPerformanceTypeId == 2) typeIds = [5,9]; // npl
    }
    if (id == 2) typeIds = [8]; // overdraft
    this.operationTypes = this.list.operationTypes.filter(x => typeIds.indexOf(x.typeId) > -1);
    if (this.selectedPerformanceTypeId == 3) {
        this.operationTypes = this.list.operationTypes.filter(x => x.id == 64); // 64	Loan Recovery -- 9
        //this.operationTypeIds = this.list.operationTypes.filter(x => x.id == 64);
    }
    if (id == 3) {
        operationIds = [85, 86, 97, 96];
        this.operationTypes = this.list.operationTypes.filter(x => operationIds.indexOf(x.id) > -1);
    } 
    if (id == 4) { // line
        operationIds = [19,26,74,87];
        this.operationTypes = this.list.operationTypes.filter(x => operationIds.indexOf(x.id) > -1);
    }

}
    onChangePerformanceType(id) { // CALL ME ON SELECTION
        this.selectedPerformanceTypeId = id;
        this.applicationCollection = [];
        this.applicationCollection = this.applicationCollection.slice();
        this.loanSearchForm.get("loanSystemTypeId").setValue("");
    }

    submitForm(form) {
        let body = {
            customerId: this.selectedCustomerId,
            performanceTypeId: this.selectedPerformanceTypeId, 
            feeDetails: this.applicationCollection,
            branchId: this.selectedBranchId,
            regionId: form.value.regionId,
        };
        ////console.log(JSON.stringify(body));
        if (this.selectedLoanId != null) {
            this.loadingService.show();
            this.subscriptions.add(
            this.reviewService.submitTakeFee(body).subscribe((response: any) => {
                if (response.success == true) {
                    this.finishGood(response.result);
                    this.refresh();
                    this.showApplicationForm = false;
                    this.displayLoanSearch = false;
                } else {
                    this.finishBad(response.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            }));
        }
    }

    collectionId: number = 0;

    addApplicationCollection(form) {
        //const operation = this.list.operationTypes.find(x => x.id == form.value.operationTypeId);
        const feeName = this.list.feeCharges.find(x=>x.id == form.value.chargeFee)
        const casaAccount = this.casaAccounts.find(x=>x.casaAccountId == form.value.casaAccount)
        const feeAmount = this.isRate == true ? (this.loanSelection.principalAmount * form.value.feeAmount)/100 : Number(
            form.value.feeAmount.replace(/[,]+/g, "").trim()
          );
        //console.log(feeAmount);
       // console.log(this.isRate);
       // console.log(form.value.feeAmount);
        // this.principalBalance = Number(
        //     form.value.feeAmount.replace(/[,]+/g, "").trim()
        //   );
        this.applicationCollection.push({
            id: this.collectionId++,
            loanId: this.selectedLoanId,
            loanSystemTypeId: this.loanSystemTypeId,
            casaAccount: form.value.casaAccount,
            productId: this.selectedLoanProductId,
            chargeFeeId: form.value.chargeFee, // change
            casaAccountName: casaAccount == null ? 'n/a' : casaAccount.productAccountNumber,
            chargeFee: feeName == null ? 'n/a' : feeName.name,
            description: form.value.description,
            feeAmount: this.isRate == false ? Number(
                form.value.feeAmount.replace(/[,]+/g, "").trim()
              ) : feeAmount,
            feeRate: this.isRate == true ? form.value.feeAmount : 0,

            detailId: this.selectedLoanDetailId,
            performanceTypeId: this.selectedPerformanceTypeId,
        });
        this.applicationCollection = this.applicationCollection.slice();
        console.log(this.applicationCollection);
        
        this.clearApplicationForm();
    }

    validateSubAllocationTranche(form) { //THIS SHOULD HAPPEN AT THE API
        
            this.addApplicationCollection(form);
    }

    removeApplicationCollection(row) {
        const index = this.applicationCollection.findIndex(x => x.chargeFeeId == row.chargeFeeId);
        this.applicationCollection.splice(index, 1);
        this.applicationCollection = this.applicationCollection.slice();
    }

    refresh() {
        this.reloadGrid++;
        this.activeTabindex = 0;
        this.disableSupportingDocumentsTab = true;
        this.disableApplicationInformationTab = true;
        this.collectionId = 0;
        this.applicationCollection = [];
    }

    // ------------ message ------------

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.initializeForms();
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


    onChangeSelectedOperationType(item) { }
    onChangeSelectedCasaAccount(item) { }
    onChangeSelectedPrincipalFrequencyType(item) { }
    onChangeSelectedProductType(item) { }
    onChangeSelectedInterestFrequencyType(item) { }

    // --------------------- loan search -------------------

    loans: any[] = [];
    loanSelection: any;
    loanSearchForm: FormGroup;
    activeSearchTabindex: number = 0;
    loanSystemTypeId: number = null;
    selectedPerformanceTypeId: number = null;
    
    // performanceTypes: any[] = [
    //     { id: 1, name: 'Performing' },
    //     { id: 2, name: 'Non Performing' },
    //     { id: 3, name: 'Written Off' }
    // ];

    submitLoanSearchForm(form) {
        this.loanSystemTypeId = form.value.loanSystemTypeId;
        // this.selectedPerformanceTypeId = form.value.performanceTypeId; // OUT

        if (form.invalid) return;
        this.loadingService.show();
        let body = {
            loanSystemTypeId: form.value.loanSystemTypeId,
            // performanceTypeId: form.value.performanceTypeId, // OUT ????
            searchString: form.value.searchString,
        };
        this.subscriptions.add(
        this.reviewService.loanSearch(body).subscribe((response: any) => {
            if (response.success == true) {
                this.loans = response.result;
                ////console.log('loans -->', response.result);
                this.loadingService.hide();
            } else {
                // this.displayCustomerList = false;
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            // this.displayCustomerList = false;
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        }));
    }

    onSelectedLoanChange() {
        this.selectedLoanSystemTypeId = this.loanSelection.loanSystemTypeId;

        if (this.selectedLoanSystemTypeId == 3 || this.selectedLoanSystemTypeId == 4)
        {
            this.selectedPerformanceTypeId = 1; // new
        }else
        {
            this.selectedPerformanceTypeId = this.loanSelection.performanceTypeId;
        }
        this.operationTypeIds = [];
        //this.selectedPerformanceTypeId = this.loanSelection.performanceTypeId; // new
        this.activeSearchTabindex = 1;
        this.selectedLoanId = this.loanSelection.loanId;
        this.selectedLoanProductId = this.loanSelection.productId;
        this.selectedCustomerId = this.loanSelection.customerId;
        this.selectedCurrencyId = this.loanSelection.currencyId;

        this.selectedBranchId = this.loanSelection.branchId;
        this.getLoanCustomerAccounts(this.selectedCustomerId,this.selectedCurrencyId);
        this.reloadLoanDetails = this.loanSelection.loanId;
        this.filterOperations();


        if (this.loanSelection.loanApplicationDetailId!= null)
        this.selectedLoanDetailId = this.loanSelection.loanApplicationDetailId;
        this.operationTypeIds = this.operationTypes;
       
        if(this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility)
            this.operationTypeIds = this.operationTypeIds.filter( 
                x=> x.id != LMSOperationEnum.CommercialLoanSubAllocation
                )
                if(this.selectedLoanSystemTypeId == LoanSystemTypeEnum.OverdraftFacility)
                //this.operationTypeIds = this.operationTypeIds;

        if(this.loanSelection.productTypeId != ProductTypeEnum.CommercialLoans){
            this.operationTypeIds = this.operationTypeIds.filter( x=> 
                x.id != LMSOperationEnum.CommercialLoanSubAllocation && 
                x.id != LMSOperationEnum.CommercialLoanRollOver &&
                x.id != LMSOperationEnum.CommercialLoanMaturityInstruction )
        }

        if(this.loanSelection.productTypeId != ProductTypeEnum.ContingentLiability){
            this.operationTypeIds = this.operationTypeIds.filter( x=>
              x.id != LMSOperationEnum.ContingentLiabilityRenewal &&
              x.id != LMSOperationEnum.ContingentLiabilityTermination &&
              x.id != LMSOperationEnum.ContingentLiabilityUsage &&
              x.id != LMSOperationEnum.ContingentLiabilityUsage &&
              x.id != LMSOperationEnum.ContingentLiabilityAmountReduction &&
              x.id != LMSOperationEnum.ContingentLiabilityTenorExtension )
        }

        if((this.loanSelection.productTypeId == ProductTypeEnum.TermLoan ||
            this.loanSelection.productTypeId == ProductTypeEnum.SelfLiquidating ||
            this.loanSelection.productTypeId == ProductTypeEnum.SyndicatedLoan) 
            && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
                this.operationTypeIds = this.operationTypes
                .filter
                (x =>
                  x.id != LMSOperationEnum.CommercialLoanRollOver &&
                  x.id != LMSOperationEnum.CommercialLoanSubAllocation &&
                  x.id != LMSOperationEnum.CommercialLoanMaturityInstruction &&
                  x.id != LMSOperationEnum.ContingentLiabilityUsage &&
                  x.id != LMSOperationEnum.ContingentLiabilityTermination &&
                  x.id != LMSOperationEnum.ContingentLiabilityRenewal &&
                  x.id != LMSOperationEnum.FacilityLineAmountChange &&
                  x.id != LMSOperationEnum.InterestRepricing &&
                  x.id != LMSOperationEnum.ContingentLiabilityAmountReduction &&
                  x.id != LMSOperationEnum.ContingentLiabilityTenorExtension &&
                  x.id != LMSOperationEnum.InterestOnPastDuePrincipal	&&
                  x.id != LMSOperationEnum.InterestOnPastDueInterest &&
                  x.id != LMSOperationEnum.InterestRateChange &&
                  x.id != LMSOperationEnum.InterestRateChange &&
                  x.id != LMSOperationEnum.TenorExtension &&
                  x.id != LMSOperationEnum.Prepayment &&
                  x.id != 64 &&
                  x.id != 58 

                );
        }
        if(this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility)
        {
            this.operationTypeIds = this.operationTypes
            .filter
          (x =>
            x.id != LMSOperationEnum.CommercialLoanRollOver &&
            x.id != LMSOperationEnum.CommercialLoanSubAllocation &&
            x.id != LMSOperationEnum.CommercialLoanMaturityInstruction &&
            x.id != LMSOperationEnum.ContingentLiabilityUsage &&
            x.id != LMSOperationEnum.ContingentLiabilityTermination &&
            x.id != LMSOperationEnum.ContingentLiabilityRenewal &&
            x.id != LMSOperationEnum.FacilityLineAmountChange &&
            x.id != LMSOperationEnum.InterestRepricing &&
            x.id != LMSOperationEnum.ContingentLiabilityAmountReduction &&
            x.id != LMSOperationEnum.ContingentLiabilityTenorExtension &&
            x.id != LMSOperationEnum.InterestOnPastDuePrincipal	&&
            x.id != LMSOperationEnum.InterestOnPastDueInterest &&
            x.id != LMSOperationEnum.InterestRateChange &&
            x.id != LMSOperationEnum.InterestRateChange &&
            x.id != LMSOperationEnum.TenorExtension &&
            x.id != LMSOperationEnum.Prepayment &&
            x.id != LMSOperationEnum.PaymentDateChange &&
            x.id != LMSOperationEnum.ChangeRepaymentAccount &&
            x.id != LMSOperationEnum.CompleteWriteOff &&
            x.id != LMSOperationEnum.LoanTermination
  
          );
        }

        if(this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
            this.operationTypeIds = this.operationTypeIds.filter( x=>
              x.id == LMSOperationEnum.CommercialLoanSubAllocation ||
              x.id == LMSOperationEnum.CommercialLoanRollOver ||
              x.id == LMSOperationEnum.TenorExtension )
        }

        if(this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility){
            this.operationTypeIds = this.operationTypeIds.filter( x=>
              x.id == LMSOperationEnum.TenorExtension ||
              x.id == LMSOperationEnum.InterestRateChange ||
              x.id == LMSOperationEnum.FacilityLineAmountChange)
        }

        if (this.loanSelection.writtenOff == true)
        {
            this.operationTypeIds = this.operationTypes;

        }
        // if(this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
        //     this.operationTypeIds = this.operationTypeIds.filter( x=>
        //       x.id == LMSOperationEnum.TenorChange )
        // }
        this.operationTypes = this.operationTypeIds;
    }

	
    GetOperationType() {
        this.subscriptions.add(
        this.loanOperationService.getOperationType(true).subscribe(results => {
          this.operationTypes = results.result; 

          if(this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility)
            this.operationTypes = this.operationTypes.filter( x=> x.id != LMSOperationEnum.FacilityLineAmountChange )
        
        if(this.loanSelection.productTypeId != ProductTypeEnum.CommercialLoans){
            this.operationTypes = this.operationTypes.filter( x=> 
                x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation && 
                x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
                x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction )
        }

        if(this.loanSelection.productTypeId != ProductTypeEnum.ContingentLiability){
            this.operationTypes = this.operationTypes.filter( x=>
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
              x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension )
        }

        if((this.loanSelection.productTypeId == ProductTypeEnum.TermLoan ||
            this.loanSelection.productTypeId == ProductTypeEnum.SelfLiquidating ||
            this.loanSelection.productTypeId == ProductTypeEnum.SyndicatedLoan) 
            && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
                this.operationTypes = this.operationTypes
                .filter
                (x =>
                  x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
                  x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
                  x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction &&
                  x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
                  x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
                  x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
                  x.operationTypeId != LMSOperationEnum.FacilityLineAmountChange &&
                  x.operationTypeId != LMSOperationEnum.InterestRepricing &&
                  x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
                  x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension &&
                  x.operationTypeId != LMSOperationEnum.InterestOnPastDuePrincipal	&&
                  x.operationTypeId != LMSOperationEnum.InterestOnPastDueInterest &&
                  x.operationTypeId != LMSOperationEnum.InterestRateChange &&
                  x.operationTypeId != LMSOperationEnum.InterestRateChange &&
                  x.operationTypeId != LMSOperationEnum.TenorExtension &&
                  x.operationTypeId != LMSOperationEnum.Prepayment
                );
        }

        if(this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
            this.operationTypes = this.operationTypes.filter( x=>
              x.operationTypeId == LMSOperationEnum.CommercialLoanSubAllocation ||
              x.operationTypeId == LMSOperationEnum.CommercialLoanRollOver ||
              x.operationTypeId == LMSOperationEnum.TenorExtension )
        }

        if(this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility){
            this.operationTypes = this.operationTypes.filter( x=>
              x.operationTypeId == LMSOperationEnum.TenorExtension ||
              x.operationTypeId == LMSOperationEnum.InterestRateChange ||
              x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange)
        }


          if(this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility)
          {
            this.operationTypes = this.operationTypes
            .filter
            (x =>
                x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
                x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
                x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction &&
                x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
                x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
                x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
                x.operationTypeId != LMSOperationEnum.FacilityLineAmountChange &&
                x.operationTypeId != LMSOperationEnum.InterestRepricing &&
                x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
                x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension &&
                x.operationTypeId != LMSOperationEnum.InterestOnPastDuePrincipal	&&
                x.operationTypeId != LMSOperationEnum.InterestOnPastDueInterest &&
                x.operationTypeId != LMSOperationEnum.InterestRateChange &&
                x.operationTypeId != LMSOperationEnum.InterestRateChange &&
                x.operationTypeId != LMSOperationEnum.TenorExtension &&
                x.operationTypeId != LMSOperationEnum.Prepayment &&
              x.operationTypeId != LMSOperationEnum.PaymentDateChange &&
              x.operationTypeId != LMSOperationEnum.ChangeRepaymentAccount &&
              x.operationTypeId != LMSOperationEnum.CompleteWriteOff &&
              x.operationTypeId != LMSOperationEnum.LoanTermination
    
            );
          }
        }));
      }


    onSearchTabChange(e) {
        this.activeSearchTabindex = e.index;
    }
    restrictNumber(e) { 
        var x = e.target.value;
          if(x > 100 || x < 0){
            this.applicationForm.controls['feeAmount'].setValue(null);
            const applicationFormControl = this.applicationForm.get('feeAmount');
            applicationFormControl.setValidators(Validators.required);
            applicationFormControl.updateValueAndValidity();          
        }
        }
        isRate: boolean =false;
        record: any;
        onChargeFeeChange(event){
            let chargeFeeId = event;
            this.subscriptions.add(
            this.reviewService.getChargeFeeDetails(chargeFeeId).subscribe((response: any) => {
            this.record = response.result;
            //console.log(this.record );
            if (this.record.feeTypeId == 1 || this.record.feeTypeId == 5){
                this.isRate =true;
                this.applicationForm.controls['feeAmount'].setValue(this.record.rate);

            }else{
                this.isRate =false;
                this.applicationForm.controls['feeAmount'].setValue(this.record.amount);

            }
           // console.log(this.isRate );

            }, (err) => {
            }));
        }
}

// loanApplicationId