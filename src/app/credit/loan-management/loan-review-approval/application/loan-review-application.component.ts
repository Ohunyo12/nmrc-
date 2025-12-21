import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { LoanReviewApplicationService, LoanOperationService } from '../../../services';
import swal from 'sweetalert2';
import { GlobalConfig, ProductTypeEnum, LMSOperationEnum, LoanSystemTypeEnum, GeneralLoanReviewWorkflowEnum, FacilityReviewWorkflowEnum } from 'app/shared/constant/app.constant';
import { Subscription } from 'rxjs';



@Component({
    templateUrl: 'loan-review-application.component.html'
})
export class LoanReviewApplicationComponent implements OnInit, OnDestroy {

    loanSystemTypes: any[] = [ 
        { id: 1, name: 'Term/Disbursed Facility' },
        { id: 2, name: 'Overdraft Facility' },
        { id: 3, name: 'Contingent Liability' },
        { id: 4, name: 'Facility Line' },
        { id: 5, name: 'External Facility' },
    ];

    loanStatusTypes: any[] = [
        { id: 1, name: 'NPL And Performing Loans'},
        { id: 7, name: 'Written-Off Loans'}
    ];

    list: any = {
        casaAccounts: [],
        loanSystemTypes: [],
        operationTypes: [],
        interestFrequencyTypes: [],
        principalFrequencyTypes: [],
    };

    selectedId: number = null;
    regionForm: FormGroup;
    applicationForm: FormGroup;
    displayAddModal: boolean = false;
    entityName: string = 'Loan Review Application';
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    reload: number = 0;
    selectedCustomerId: number = null;
    selectedBranchId: number = null;
    applicationCollection: any[] = [];
    regions: any[] = [];
    operationTypes: any[] = [];
    selectedLoanDetailId: number;
    selectedLoanSystemTypeId: number;
    operationTypeIds: any[] = [];
    enableTab: boolean;
    contingentAmountUsed: any;
    contingentDetail: any;
    usedAmount: number;
    customerProposedAmount: number;
    proposedTenor: number;
    proposedInterest: number;
    contingentAmount: number;
    operationId: any;
    loanApplicationDetailId: any;
    displayExternalLoansGrid: boolean;
    externalLoans: any[] = [];
    showDuration: boolean = false;

    private subscriptions = new Subscription();
    ngOnDestroy(): void {
          this.subscriptions.unsubscribe();
      }
  
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private reviewService: LoanReviewApplicationService,
        private loanOperationService: LoanOperationService,

    ) { }

    ngOnInit() {
        //this.getAllSelectList();
        this.initializeForms();

        this.regionForm = this.fb.group({
             regionId: [''],
         });
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

    onApplicationSelected(selected) { console.log('app select')
        this.application = selected;
        this.reloadLoanDetails = selected.loanId;
        this.disableApplicationInformationTab = false;
        this.disableSupportingDocumentsTab = false;
        this.activeTabindex = 1;
        this.reload++;
        this.loanSelection = selected;
        
        this.getRegions();
    }

    newApplication() {
        this.initializeForms();
        this.getRegions();
        this.showApplicationForm = true;
        this.activeSearchTabindex = 0;
    }

    getRegions() {
        let regionTypeId = 1;
        
        if (this.loanSelection != undefined) {
            // if (this.loanSelection.isPerforming == false) regionTypeId = 3;
            // if (this.loanSelection.writtenOff == true) regionTypeId = 2;
            if (this.selectedLoanSystemTypeId != 1) regionTypeId = 1;
            this.subscriptions.add(
            this.reviewService.getRegions(regionTypeId).subscribe((response: any) => {
                this.regions = response.result;
            }));
        }
       
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

    getAllSelectList(operationTypeId): void {
        this.loadingService.show();
        this.subscriptions.add(
        this.reviewService.GetAllLMSApprovalOperationListByProductTypeId(this.loanSelection.productTypeId).subscribe((response: any) => {
            this.list = response.result; 
            this.operationTypes = this.list.operationTypes.filter(x =>x.typeId == operationTypeId);
            this.filterOperations();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }

    initializeForms() {
        this.selectedId = null;
        this.clearApplicationForm();
        this.loanSearchForm = this.fb.group({
            //loanSystemTypeId: ['', Validators.required],
            // performanceTypeId: ['', Validators.required], // OUT
            statusId: ['', Validators.required],
            searchString: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });
    }

    clearApplicationForm() {
        this.applicationForm = this.fb.group({
            operationTypeId: ['', Validators.required],
            reviewDetails: ['', Validators.required],
            //customerProposedAmount: [''],
            //proposedInterest:[''],
            //proposedTenor:[''],
            duration: [''],
            // duration: ['', Validators.compose([Validators.required, Validators.max(90), Validators.min(1)])],
        });
    }

    edit(row) {
        this.selectedId = row.timelineId;
        this.applicationForm = this.fb.group({
            operationTypeId: [row.operationTypeId, Validators.required],
            reviewDetails: [row.reviewDetails, Validators.required],
            //proposedInterest: [row.proposedInterest, Validators.required],
            //proposedTenor: [row.proposedTenor, Validators.required],
            duration: [row.duration, Validators.required],
        });
        this.showApplicationForm = true;
    }

    onChangeFacilityType(id) {
        this.selectedLoanSystemTypeId = id;
    }

    filterOperations() {
        let id = this.selectedLoanSystemTypeId;
        let operationIds = [];
        let typeIds = [5, 8, 9, 11]; // operation type ids
        this.operationTypes = [];
        
        if (id == 1) { // loan
            if (this.selectedPerformanceTypeId == 1) typeIds = [5]; // pl
            if (this.selectedPerformanceTypeId == 2) typeIds = [5, 9]; // npl
        }
       // if (id == 2) typeIds = [8]; // overdraft
        this.operationTypes = this.list.operationTypes; //.filter(x => typeIds.indexOf(x.typeId) > -1);
        

        if (this.selectedPerformanceTypeId == 3) {
           // this.operationTypes = this.list.operationTypes.filter(x => x.id == 64); 
            
        }

        if (id == LoanSystemTypeEnum.TermDisbursedFacility || (id == 5 && this.loanSelection.productTypeId != 6  && this.loanSelection.productTypeId != 9)) {
            this.operationTypes = this.list.operationTypes.filter(x => x.productTypeId == ProductTypeEnum.TermLoan || x.productTypeId == null); 
            
        }
        if (id == LoanSystemTypeEnum.OverdraftFacility || (id == 5 && this.loanSelection.productTypeId ==6)) {
            this.operationTypes = this.list.operationTypes.filter(x => x.productTypeId == ProductTypeEnum.Revolving || x.productTypeId == null); 
            
        }
        if (id == LoanSystemTypeEnum.ContingentFacility || (id == 5 && this.loanSelection.productTypeId ==9)) {
            this.operationTypes = this.list.operationTypes.filter(x => x.productTypeId == ProductTypeEnum.ContingentLiability || x.productTypeId == null); 
            
        }
       
        this.operationTypeIds = this.operationTypes;
        // if (id == LoanSystemTypeEnum.LineFacility) {
        //     //this.operationTypes = this.list.operationTypes.filter(x => x.productTypeId == ProductTypeEnum.l); 
            
        // }
        // if (id == 3) {
        //     operationIds = [
        //         LMSOperationEnum.ContingentLiabilityRenewal,
        //         LMSOperationEnum.ContingentLiabilityTenorExtension,
        //         LMSOperationEnum.APS_RelaseChecklist,
        //         LMSOperationEnum.APS_ReleaseCAP,
        //         LMSOperationEnum.APS_ReleasePrincipaRequest];
        //     this.operationTypes = this.list.operationTypes.filter(x => operationIds.indexOf(x.id) > -1);
        // }
        // if (id == 4) { // line
        //     operationIds = [19, 26, 74, 87];
        //     this.operationTypes = this.list.operationTypes.filter(x => operationIds.indexOf(x.id) > -1);
        // }
        
    }

    onChangePerformanceType(id) { // CALL ME ON SELECTION
        this.selectedPerformanceTypeId = id;
        this.applicationCollection = [];
        this.applicationCollection = this.applicationCollection.slice();
        this.loanSearchForm.get("loanSystemTypeId").setValue("");
    }


    convertToNumber(pamount) {

        if (typeof (pamount) == "string") {
            return pamount = pamount.replace(/[^0-9-.]/g, '');
        } else if (typeof (pamount) == "number") {
            return pamount = pamount;
        }

    }

    GetContingAmountUsed(contingentLoanId): boolean {
        this.subscriptions.add(
        this.loanOperationService.GetContingAmountUsed(contingentLoanId).subscribe((response: any) => {
            this.contingentDetail = response.result;
            if (response.result != null) {
                this.usedAmount = +this.contingentDetail.usedAmount
                this.customerProposedAmount = +this.convertToNumber(this.applicationCollection[0].customerProposedAmount)
                this.contingentAmount = +this.contingentDetail.facilityAmount;


                let total = this.usedAmount + this.customerProposedAmount
                //console.log("total",total);
                //console.log("this.contingentAmount",this.contingentAmount);

                if (total > this.contingentAmount) {
                  //  console.log("at return of false");
                    return false;
                }
            }

        }, (err) => {
            this.loadingService.hide(1000);
            return false;
        }));
       // console.log("at retun of true");
        return true;
    }

    submitForm(form) {
     
        if (this.operationId == LMSOperationEnum.APS_ReleasePrincipaRequest || this.operationId == LMSOperationEnum.APS_RelaseChecklist || this.operationId == LMSOperationEnum.APS_ReleaseCAP) {
            this.subscriptions.add(
            this.loanOperationService.GetContingAmountUsed(this.loanSelection.loanId).subscribe((response: any) => {
                this.contingentDetail = response.result;
                if (response.result != null) {
                    this.usedAmount = +this.contingentDetail.usedAmount
                    this.customerProposedAmount = +this.convertToNumber(this.applicationCollection[0].customerProposedAmount)
                    this.contingentAmount = +this.contingentDetail.facilityAmount;
    
                    let total = this.usedAmount + this.customerProposedAmount
    
                    if (total > this.contingentAmount) {
                        swal('Fintrak Credit 360', 'Total requested amount is greater than the contingent amount', 'error');
                    }else{
                        this.SaveNewApplication(form);
                    }
                }
    
            }, (err) => {
                this.loadingService.hide(1000);
                return false;
            }));
           
        }else{

            this.SaveNewApplication(form);
        };

    }

    closeForm() {
        this.applicationCollection = [];
        this.showApplicationForm = false;
    }
 
    SaveNewApplication(form){
        let body = {
            customerId: this.selectedCustomerId,
            performanceTypeId: this.selectedPerformanceTypeId,
            applicationDetails: this.applicationCollection,
            branchId: this.selectedBranchId,
            regionId: form.value.regionId,
            operationId: this.operationId,
            productClassId: this.loanSelection.productClassId,
            productId: this.loanSelection.productId,
            productClassProcessId: this.loanSelection.productClassProcessId,
            loanApplicationTypeId: this.loanSelection.loanApplicationTypeId,
            approvedAmount: this.loanSelection.principalAmount,
            currencyId: this.loanSelection.currencyId,
            loanSystemTypeId : this.loanSystemTypeId,
            loanReferenceNumber : this.loanSelection.loanReferenceNumber,
           // proposedTenor: this.proposedTenor,
            //proposedInterest: this.proposedInterest,
           // customerProposedAmount: this.customerProposedAmount,
            
        };
        if (this.selectedLoanId != null) {
            this.loadingService.show();
            this.subscriptions.add(
            this.reviewService.submitApplication(body).subscribe((response: any) => {
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
        const operation = this.list.operationTypes.find(x => x.id == form.value.operationTypeId);
        
        this.applicationCollection.push({
            id: this.collectionId++,
            loanId: this.selectedLoanId,
            loanSystemTypeId: this.loanSystemTypeId,
            productId: this.selectedLoanProductId,
            operationId: form.value.operationTypeId, // change
            operationType: operation == null ? 'n/a' : operation.name,
            reviewDetails: form.value.reviewDetails,
            // customerProposedAmount: form.value.customerProposedAmount,
            detailId: this.selectedLoanDetailId,
            performanceTypeId: this.selectedPerformanceTypeId,
            // proposedInterest: form.value.proposedInterest,
            // proposedTenor: form.value.proposedTenor,
            duration: form.value.duration,
        });
        if(this.applicationCollection.length>1){
            swal(GlobalConfig.APPLICATION_NAME, 'Sorry, you can not submit  multiple operations at a time.', 'error');
            this.applicationCollection.splice(operation, 1);
            this.applicationCollection = this.applicationCollection.slice();
         }
        this.applicationCollection = this.applicationCollection.slice();
        this.collectionId = null;
        this.clearApplicationForm();
      
    }

    validateSubAllocationTranche(form) { //THIS SHOULD HAPPEN AT THE API

        ////console.log("Selected Loan Detail ID is: " + this.selectedLoanDetailId);
        if (form.value.operationTypeId == LMSOperationEnum.CommercialLoanSubAllocation || form.value.operationTypeId == 20) {
            if (this.selectedLoanDetailId != null || this.selectedLoanDetailId != 0) {
                const customerId = this.loanSelection.customerId;
                if (customerId == null) {
                    customerId == 0;
                }
                this.subscriptions.add(
                this.reviewService.validateSubAllocation(this.selectedLoanDetailId, customerId, this.selectedLoanSystemTypeId).subscribe((response: any) => {
                    if (response.result == true) {
                        this.addApplicationCollection(form);
                    } else {
                        swal(GlobalConfig.APPLICATION_NAME, 'Customer Must Have More Than One Tranch to Proceed With Sub Allocation.', 'error');
                    }
                }));
            }
        } else {
            this.addApplicationCollection(form);
        }

        this.showDuration = false;
        this.applicationForm.get('duration').clearValidators();
        this.applicationForm.updateValueAndValidity();
    }

    editApplication(row) {
        
        const index = this.applicationCollection.findIndex(x => x.operationTypeId == row.operationTypeId);
        this.applicationCollection.splice(index, 1);
        this.applicationCollection = this.applicationCollection.slice();

        this.applicationForm.controls['operationTypeId'].setValue(row.operationId);
        this.applicationForm.controls['customerProposedAmount'].setValue(row.customerProposedAmount);
        this.applicationForm.controls['proposedTenor'].setValue(row.proposedTenor);
        this.applicationForm.controls['proposedInterest'].setValue(row.proposedInterest);
        this.applicationForm.controls['reviewDetails'].setValue(row.reviewDetails);
        this.showDuration = false;

        if (row.duration != "") {
            this.applicationForm.controls['duration'].setValue(row.duration);
            this.showDuration = true;
        }

    }

    removeApplicationCollection(row) {
        const index = this.applicationCollection.findIndex(x => x.operationTypeId == row.operationTypeId);
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

    onChangeSelectedOperationType(item) {
        this.operationId = item
        
        if (item == 120 || item == 223) { // Tenor Extension Or Overdraft Tenor Extension
            this.showDuration = true;
            this.applicationForm.controls["duration"].setValidators(Validators.compose([Validators.required]));
            // this.applicationForm.controls["duration"].setValidators(Validators.compose([Validators.required, Validators.max(90), Validators.min(1)]));
        }
        else {
            this.applicationForm.get('duration').clearValidators();
            this.showDuration = false;
        }
        //this.applicationForm.controls["duration"].clearAsyncValidators;
        this.applicationForm.updateValueAndValidity();
    }

    onChangeSelectedCasaAccount(item) { }
    onChangeSelectedPrincipalFrequencyType(item) { }
    onChangeSelectedProductType(item) { }
    onChangeSelectedInterestFrequencyType(item) { }

    onChangeSelectedDuration() {}

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

    getLoanSystemType(id) { 
        let item = this.loanSystemTypes.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

   

    submitLoanSearchForm(form) {
       
        if (form.invalid) return;
        this.loadingService.show();
        let body = {
            // loanSystemTypeId: form.value.loanSystemTypeId,
            // performanceTypeId: form.value.performanceTypeId, // OUT ????
            searchString: form.value.searchString,
            statusId: form.value.statusId,
        };
        this.subscriptions.add(
        this.reviewService.loanSearch(body).subscribe((response: any) => {
            if (response.success == true) {
                this.loans = response.result;
                this.externalLoans = this.loans.filter(x=>x.isExternalFacility == true);
                this.loans = this.loans.filter(x=>x.isExternalFacility == false);
                if(this.externalLoans.length > 0){
                    this.displayExternalLoansGrid = true;
                }

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

    operationTypeId: any;
    onSelectedLoanChange() {
        this.loanSystemTypeId = this.loanSelection.loanSystemTypeId;
        this.operationTypeId = this.loanSelection.operationTypeId;
        this.selectedLoanSystemTypeId = this.loanSelection.loanSystemTypeId;
        this.reloadLoanDetails = this.loanSelection.loanId;
        this.loanApplicationDetailId = this.loanSelection.loanApplicationDetailId;
        this.getAllSelectList(this.operationTypeId);

        if (this.selectedLoanSystemTypeId == 3 || this.selectedLoanSystemTypeId == 4) {
            this.selectedPerformanceTypeId = 1; // new
        } else {
            this.selectedPerformanceTypeId = this.loanSelection.performanceTypeId;
        }
        this.operationTypeIds = [];
        this.activeSearchTabindex = 1;
        this.selectedLoanId = this.loanSelection.loanId;
        this.selectedLoanProductId = this.loanSelection.productId;
        this.selectedCustomerId = this.loanSelection.customerId;
        this.selectedBranchId = this.loanSelection.branchId;
        //this.GetOperationType(); 

       
       this.filterOperations();
        if (this.loanSelection.loanApplicationDetailId != null)
            this.selectedLoanDetailId = this.loanSelection.loanApplicationDetailId;
            this.operationTypeIds = this.operationTypes;
        
            this.operationTypeIds = this.operationTypeIds.filter(x =>
                x.id != LMSOperationEnum.LoanReviewApprovalAppraisal && 
                (x.synchOperationId == null  && x.synchOperationId == undefined) &&
                x.id != 48 &&
                x.id != 264 && 
                x.id != 240 
                );

          //use this letter to address the operation picked based facility type
           // console.log('loans needed -->', this.operationTypeIds);
            // if (this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility)
            //     this.operationTypeIds = this.operationTypeIds.filter(
            //         x => 
            //         // x.id in FacilityReviewWorkflowEnum 
            //         // || x.id in GeneralLoanReviewWorkflowEnum 
            //         LMSOperationEnum.CommercialLoanSubAllocation
            //     )
           
        if (this.selectedLoanSystemTypeId == LoanSystemTypeEnum.OverdraftFacility){
            this.operationTypeIds = this.operationTypeIds.filter(x =>
                x.id != 121 && 
                x.id != 264 && 
                x.id != 42 && 
                x.id != 129 && 
                x.id != 49 &&
                x.id != 240 
                
            );
        }
            
        //     if (this.loanSelection.productTypeId != ProductTypeEnum.CommercialLoans) {
        //         this.operationTypeIds = this.operationTypeIds.filter(x =>
        //             // x => x.id in OverdraftReviewWorkflowEnum 
        //             // || x.id in GeneralLoanReviewWorkflowEnum
        //             x.id != LMSOperationEnum.CommercialLoanSubAllocation &&
        //             x.id != LMSOperationEnum.CommercialLoanRollOver &&
        //             x.id != LMSOperationEnum.CommercialLoanMaturityInstruction &&
        //             x.id != LMSOperationEnum.APS_RelaseChecklist &&
        //             x.id != LMSOperationEnum.APS_ReleaseCAP &&
        //             x.id != LMSOperationEnum.APS_ReleasePrincipaRequest
        //             )
                   
        //     }

        if (this.loanSelection.productTypeId != ProductTypeEnum.ContingentLiability) {
            this.operationTypeIds = this.operationTypeIds.filter(x =>
                x.id != LMSOperationEnum.GlobalInterestRateChange &&
                x.id != 240 &&
                x.id != 129 && //LMSOperationEnum.fee &&
                x.id != 123 &&
                x.id != LMSOperationEnum.LoanRecapitilization &&
                x.id != 132 &&
                x.id != 264 && 
                x.id != 47 &&
                x.id != LMSOperationEnum.LoanTermination &&
                x.id != 128 &&
                x.id != LMSOperationEnum.WriteOffLoanReviewApprovalAppraisal 
               
                //x.id != 221
            )
        }

        if ((this.loanSelection.productTypeId == ProductTypeEnum.TermLoan ||
            this.loanSelection.productTypeId == ProductTypeEnum.SelfLiquidating ||
            this.loanSelection.productTypeId == ProductTypeEnum.SyndicatedLoan)
            && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility
            ) {
            this.operationTypeIds = this.operationTypes
                .filter
                (x =>
                    // x => x.id in TermLoanReviewWorkflowEnum 
                    // || x.id in GeneralLoanReviewWorkflowEnum
                     x.id != 121 &&
                     x.id != 42 &&
                     x.id != 129 &&
                     x.id != 49 &&
                     x.id != 217 &&
                     x.id != 240 &&
                     x.id != 264
                     //x.id != 221
                    // x.id != LMSOperationEnum.CommercialLoanSubAllocation &&
                    // x.id != LMSOperationEnum.CommercialLoanMaturityInstruction &&
                    // x.id != LMSOperationEnum.ContingentLiabilityUsage &&
                    // x.id != LMSOperationEnum.ContingentLiabilityTermination &&
                    // x.id != LMSOperationEnum.ContingentLiabilityRenewal &&
                    // x.id != LMSOperationEnum.FacilityLineAmountChange &&
                    // x.id != LMSOperationEnum.InterestRepricing &&
                    // x.id != LMSOperationEnum.ContingentLiabilityAmountReduction &&
                    // x.id != LMSOperationEnum.ContingentLiabilityTenorExtension &&
                    // x.id != LMSOperationEnum.InterestOnPastDuePrincipal &&
                    // x.id != LMSOperationEnum.InterestOnPastDueInterest &&
                    //x.id != LMSOperationEnum.InterestRateChange &&
                    //x.id != LMSOperationEnum.InterestRateChange &&
                    //x.id != LMSOperationEnum.TenorChange &&
                    // x.id != LMSOperationEnum.Prepayment &&
                    // x.id != 64 &&
                    // x.id != 58 &&
                    // x.id != LMSOperationEnum.ContingentLiabilityRebook &&
                    // x.id != LMSOperationEnum.ManualFeeCharge &&
                    // x.id != LMSOperationEnum.GlobalInterestRateChange &&
                    // x.id != LMSOperationEnum.CancelContingentLiability &&
                    // x.id != LMSOperationEnum.ContingentLiabilityAmountAddition &&
                    // x.id != LMSOperationEnum.APS_RelaseChecklist &&
                    // x.id != LMSOperationEnum.APS_ReleaseCAP &&
                    // x.id != LMSOperationEnum.APS_ReleasePrincipaRequest &&
                    // x.id != LMSOperationEnum.Restructure &&
                    // x.id != LMSOperationEnum.FinalCollateralRelease &&
                    // x.id != LMSOperationEnum.TemporalCollateralRelease &&
                    //x.id != LMSOperationEnum.LmsOperations &&
                    // x.id != LMSOperationEnum.FullAndFinalCompleteWriteOff && 
                    // x.id != LMSOperationEnum.DailyWriteoffInterestAccural &&
                    // x.id != LMSOperationEnum.LoanRecoveryCompletion &&
                    // x.id != LMSOperationEnum.LoanRecoveryPayment &&
                    // x.id != LMSOperationEnum.AtcLodgementApproval &&
                    // x.id != LMSOperationEnum.AtcReleaseApproval &&
                    // x.id != LMSOperationEnum.CrmsApproval &&
                    // x.id != LMSOperationEnum.OriginalDocumentApproval &&
                    // x.id != LMSOperationEnum.CollateralRelease &&
                    //x.id != LMSOperationEnum.LoanRecapitilization &&
                    // x.id != LMSOperationEnum.LoanTermination &&
                    // x.id != LMSOperationEnum.TenorExtension &&
                    // x.id != LMSOperationEnum.CollateralValuationRequest &&
                    // x.id != LMSOperationEnum.SecurityRelease

                );
                
       }
        // if (this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility) {
        //     this.operationTypeIds = this.operationTypes
        //         .filter
        //         (x =>
        //             // x => x.id in TermLoanReviewWorkflowEnum 
        //             // || x.id in GeneralLoanReviewWorkflowEnum
        //             x.id != LMSOperationEnum.CommercialLoanRollOver &&
        //             x.id != LMSOperationEnum.CommercialLoanSubAllocation &&
        //             x.id != LMSOperationEnum.CommercialLoanMaturityInstruction &&
        //             x.id != LMSOperationEnum.ContingentLiabilityUsage &&
        //             x.id != LMSOperationEnum.ContingentLiabilityTermination &&
        //             x.id != LMSOperationEnum.ContingentLiabilityRenewal &&
        //             x.id != LMSOperationEnum.FacilityLineAmountChange &&
        //             x.id != LMSOperationEnum.InterestRepricing &&
        //             x.id != LMSOperationEnum.ContingentLiabilityAmountReduction &&
        //             x.id != LMSOperationEnum.ContingentLiabilityTenorExtension &&
        //             x.id != LMSOperationEnum.InterestOnPastDuePrincipal &&
        //             x.id != LMSOperationEnum.InterestOnPastDueInterest &&
        //             // x.id != LMSOperationEnum.InterestRateChange &&
        //             // x.id != LMSOperationEnum.InterestRateChange &&
        //             x.id != LMSOperationEnum.TenorExtension &&
        //             x.id != LMSOperationEnum.Prepayment &&
        //             x.id != LMSOperationEnum.PaymentDateChange &&
        //             x.id != LMSOperationEnum.ChangeRepaymentAccount &&
        //             x.id != LMSOperationEnum.CompleteWriteOff &&
        //             x.id != LMSOperationEnum.LoanTermination &&
        //             x.id != LMSOperationEnum.APS_RelaseChecklist &&
        //             x.id != LMSOperationEnum.APS_ReleaseCAP &&
        //             x.id != LMSOperationEnum.APS_ReleasePrincipaRequest

        //         );
        // }

        // if (this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility) {
        //     this.operationTypeIds = this.operationTypeIds.filter(x =>
        //         x.id == LMSOperationEnum.CommercialLoanRollOver ||
        //         x.id == LMSOperationEnum.TenorExtension)
        // }

        // if (this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility) {
        //     this.operationTypeIds = this.operationTypeIds.filter(x =>
        //         x.id == LMSOperationEnum.TenorExtension ||
        //         x.id == LMSOperationEnum.InterestRateChange ||
        //         x.id == LMSOperationEnum.FacilityLineAmountChange)
        // }

        // if (this.loanSelection.writtenOff == true) {
        //     this.operationTypeIds = this.operationTypes;

        // }
        // if(this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility){
        //     this.operationTypeIds = this.operationTypeIds.filter( x=>
        //       x.id == LMSOperationEnum.TenorChange )
        // }
        
        this.operationTypes = this.operationTypeIds;
        
    }


    // GetOperationType() { //getOperationTypeByScheduleId getReviewApprovalOperations
    //     this.subscriptions.add(this.loanOperationService.getReviewApprovalOperations().subscribe(results => {
    //         if(results.success){
    //            // this.operationTypes = results.result;
    //             console.log('operation Types',results.result);
    //            // this.filterOperations();
    //         }
           
    //     //     if (this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility)
    //     //         this.operationTypes = this.operationTypes.filter(x => x.id != LMSOperationEnum.FacilityLineAmountChange)

    //     //     if (this.loanSelection.productTypeId != ProductTypeEnum.CommercialLoans) {
    //     //         this.operationTypes = this.operationTypes.filter(x =>
    //     //             x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
    //     //             x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
    //     //             x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction)
    //     //     }

    //     //     if (this.loanSelection.productTypeId != ProductTypeEnum.ContingentLiability) {
    //     //         this.operationTypes = this.operationTypes.filter(x =>
    //     //             x.id in FacilityReviewWorkflowEnum 
    //     //             || x.id in GeneralLoanReviewWorkflowEnum 
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
    //     //             // x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension
    //     //             )
    //     //     }
            
    //     //     if ((this.loanSelection.productTypeId == ProductTypeEnum.TermLoan ||
    //     //         this.loanSelection.productTypeId == ProductTypeEnum.SelfLiquidating ||
    //     //         this.loanSelection.productTypeId == ProductTypeEnum.SyndicatedLoan)
    //     //         && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility) {
    //     //         this.operationTypes = this.operationTypes
    //     //             // .filter
    //     //             // (x =>
    //     //             //     x.id in TermLoanReviewWorkflowEnum ||
    //     //             //     x.id in GeneralLoanReviewWorkflowEnum
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.BulkLiquidationApproval
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.FullAndFinalApproval
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.GlobalInterestRateChangeApproval
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.LoanRecapitalizationApproval
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.LoanRecoveryApproval
    //     //                 // || x.id == GeneralLoanReviewWorkflowEnum.LoanTerminationApproval
                        
    //     //                 // x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
    //     //                 // x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
    //     //                 // x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction &&
    //     //                 // x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
    //     //                 // x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
    //     //                 // x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
    //     //                 // x.operationTypeId != LMSOperationEnum.FacilityLineAmountChange &&
    //     //                 // x.operationTypeId != LMSOperationEnum.InterestRepricing &&
    //     //                 // x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
    //     //                 // x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension &&
    //     //                 // x.operationTypeId != LMSOperationEnum.InterestOnPastDuePrincipal &&
    //     //                 // x.operationTypeId != LMSOperationEnum.InterestOnPastDueInterest &&
    //     //                 // x.operationTypeId != LMSOperationEnum.InterestRateChange &&
    //     //                 // x.operationTypeId != LMSOperationEnum.InterestRateChange &&
    //     //                 // x.operationTypeId != LMSOperationEnum.TenorExtension &&
    //     //                 // x.operationTypeId != LMSOperationEnum.Prepayment
    //     //            // );
    //     //     }

    //     //     if (this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId != LoanSystemTypeEnum.LineFacility) {
    //     //         this.operationTypes = this.operationTypes.filter(x =>
    //     //             x.operationTypeId == LMSOperationEnum.CommercialLoanSubAllocation ||
    //     //             x.operationTypeId == LMSOperationEnum.CommercialLoanRollOver ||
    //     //             x.operationTypeId == LMSOperationEnum.TenorExtension)
    //     //     }

    //     //     if (this.loanSelection.productTypeId == ProductTypeEnum.CommercialLoans && this.selectedLoanSystemTypeId == LoanSystemTypeEnum.LineFacility) {
    //     //         this.operationTypes = this.operationTypes.filter(x =>
    //     //             x.operationTypeId == LMSOperationEnum.TenorExtension ||
    //     //             x.operationTypeId == LMSOperationEnum.InterestRateChange ||
    //     //             x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange)
    //     //     }


    //     //     if (this.loanSelection.productTypeId == ProductTypeEnum.ForeignExchangeRevolvingFacility) {
    //     //         this.operationTypes = this.operationTypes
    //     //             .filter
    //     //             (x =>
    //     //                 x.operationTypeId != LMSOperationEnum.CommercialLoanRollOver &&
    //     //                 x.operationTypeId != LMSOperationEnum.CommercialLoanSubAllocation &&
    //     //                 x.operationTypeId != LMSOperationEnum.CommercialLoanMaturityInstruction &&
    //     //                 x.operationTypeId != LMSOperationEnum.ContingentLiabilityUsage &&
    //     //                 x.operationTypeId != LMSOperationEnum.ContingentLiabilityTermination &&
    //     //                 x.operationTypeId != LMSOperationEnum.ContingentLiabilityRenewal &&
    //     //                 x.operationTypeId != LMSOperationEnum.FacilityLineAmountChange &&
    //     //                 x.operationTypeId != LMSOperationEnum.InterestRepricing &&
    //     //                 x.operationTypeId != LMSOperationEnum.ContingentLiabilityAmountReduction &&
    //     //                 x.operationTypeId != LMSOperationEnum.ContingentLiabilityTenorExtension &&
    //     //                 x.operationTypeId != LMSOperationEnum.InterestOnPastDuePrincipal &&
    //     //                 x.operationTypeId != LMSOperationEnum.InterestOnPastDueInterest &&
    //     //                 x.operationTypeId != LMSOperationEnum.InterestRateChange &&
    //     //                 x.operationTypeId != LMSOperationEnum.InterestRateChange &&
    //     //                 x.operationTypeId != LMSOperationEnum.TenorExtension &&
    //     //                 x.operationTypeId != LMSOperationEnum.Prepayment &&
    //     //                 x.operationTypeId != LMSOperationEnum.PaymentDateChange &&
    //     //                 x.operationTypeId != LMSOperationEnum.ChangeRepaymentAccount &&
    //     //                 x.operationTypeId != LMSOperationEnum.CompleteWriteOff &&
    //     //                 x.operationTypeId != LMSOperationEnum.LoanTermination

    //     //             );
    //     //    }
    //     }));
    // }
    numericOnly(event): boolean {    
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }
    
    ImportExternalFacility(row){ 
        this.loadingService.show();
        this.reviewService.ImportFacility(row).subscribe((response: any) => {
            if (response.success == true) {
                this.displayExternalLoansGrid = false;
                swal('Fintrak Credit360',response.message,'success');
                this.loanSelection = row;
                this.onSelectedLoanChange();
                // this.externalLoans = this.externalLoans.filter(x=>x.loanId != row.loanId);
                // this.externalLoans.slice;
                this.loadingService.hide();
            } else {
                this.finishBad(response.message);
                this.loadingService.hide();
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide();
        });
    }

    AddToGrid(d){ 
        this.loans.push(d);
        this.onSelectedLoanChange();
        this.loans.slice;
        this.displayExternalLoansGrid = false;
    }

    onSearchTabChange(e) {
        this.activeSearchTabindex = e.index;
    }
}

// loanApplicationId