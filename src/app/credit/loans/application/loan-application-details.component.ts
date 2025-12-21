// import { CasaService } from '../../../customer/services/casa.service';
// import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import swal from 'sweetalert2';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CustomerService } from '../../../customer/services/customer.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConfig, ConvertString } from '../../../shared/constant/app.constant';
import { IApplicationInfo, ILoanApplication } from './loanApplicationInfo.interface';
import { ISelectedCustomer } from './limits/customer.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService, LoanService } from '../../services';
import { ProductService, GeneralSetupService } from '../../../setup/services';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-name',
    templateUrl: './loan-application-details.component.html',
    styleUrls: ['./loan-application-details.component.css']
})
export class LoanApplicationDetailsComponent implements OnInit {
 
    reload: number = 0;
    totalExposureLimit: any;
    MaximumTenor: any;
    TotalAmount: any;
    accountNumber: any; 
    applicationId: number = 0;
    // applicationReferenceNumber: any;
    customerAccount: any;
    customerId: any;
    customerNameTitle: any;
    customerRate_Limit = {};
    customerRating: string;
    customerTypes: any[] = [
        { name: 'Internal', value: 1 },
        { name: 'External', value: 2 },
        { name: 'Others', value: 3 },
    ];
    requireCollateralTypes = [ 
        { 'id': '1', 'name': 'Immovable Property Collateral Required' },
        { 'id': '2', 'name': 'Other Collateral Required' },
        { 'id': '3', 'name': 'No Collateral Required' },
    ];
    displayFacilityDetailForm: boolean;
    editMode: boolean = false;
    exchangeAmount: number;
    facility: any;
    facilityDetails: IApplicationInfo;
    facilityTypes: any[];
    globalCustomerId: number;
    investmentGrade: boolean;
    loanAmount: any;
    loanApplicationForm: FormGroup;
    loanApplicationDetails: any[] = [];
    loanApplicationReferance: any;
    loanFacilityDetails: any = {};
    loanTypeId: any;
    officers: any;
    outstanding: any;
    // penCodeList: any[];
    termSheetCodeList: any[];
    productClassId: any;
    productClassProcessId: any;
    productClasses: any[];
    proposedAmount: any;
    proposedTenor: number;
    regionId: number = 0;
    regions: any[] = [];
    relationshipOfficer: string;
    // selectedCustomer: any;
    selectedCustomerLimit: ISelectedCustomer;
    selectedFacilityDetail: any; // not used remove from component
    selectedLoanApplication: any = {};
    selectedProductClassId: number;
    subSectorId: number; 

    storedApplicationInfo: any;
    storedReferenceNumber: any;
    customerLabelName: string;
    customerTypeId: number;
    customerGroupId: number;
    userInfo: any;
    loanApplicationId: number;
    showAdhocUpload = false;
    showAdhocUploadLink = false;
    facilities: any[] = [];
    disableApprovedLineSelect = false;
    ckEditorContent: any;
    isAdhoc = false;
    isAdHocApplication: boolean;
    relatedEmployers: any[] = [];
    termSheetCodeListCorrection: any[];
    iblEligibility: any;
    isIBLEligible: boolean;
    iblAmount: any;
    iblMinimumAmount: any;
    isIblRequest: boolean;

    constructor(
        // private CustomerGroupSer: CustomerGroupService,
        // private casaService: CasaService,
        private customerService: CustomerService,
        private fb: FormBuilder,
        private loadingSrv: LoadingService,
        private loanAppService: LoanApplicationService,
        private loanService: LoanService,
        private productService: ProductService,
        private genSetupServ: GeneralSetupService,
        // private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.reset();
        this.loadStorageData();
    }

    contentChange(updates) {
        this.ckEditorContent = updates;
    }
    
    reset() {
        this.editMode = false;
        this.facilityDetails = null;
        this.loanApplicationDetails = [];
        this.loanApplicationReferance = null;
        this.storedApplicationInfo = null;
        this.storedReferenceNumber = null;
        this.userInfo = null;
        this.loanApplicationId = null;
        this.reload++;
    }

    loadStorageData() {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.storedApplicationInfo = JSON.parse(sessionStorage.getItem('customer-loan-details'));
        this.storedReferenceNumber = sessionStorage.getItem('applicationreferencenumber');
        this.customerGroupId = this.storedApplicationInfo.customerGroupId;
        this.customerTypeId = this.storedApplicationInfo.customerTypeId;
        this.productClassId = this.storedApplicationInfo.productClassId;
        this.productClassProcessId = this.storedApplicationInfo.productClassProcessId;
        this.loanTypeId = this.storedApplicationInfo.loanTypeId;
        this.isAdHocApplication = this.storedApplicationInfo.isAdHocApplication;
        this.getAllRelatedEmployers();

        // if (this.storedApplicationInfo.editMode == true)  {
        //     this.editMode = true;
        // console.log("storedApplicationInfo: ", this.storedApplicationInfo);
            this.getApplicationFacilities(this.storedReferenceNumber); // CALL ONLY ON EDIT
            
        // }

        if (this.storedReferenceNumber != null) {
            this.loanApplicationReferance = this.storedReferenceNumber;
        }

        this.selectedProductClassId = -1;
        this.loanAmount = +ConvertString.TO_NUMBER(this.storedApplicationInfo.loanAmount);
        this.outstanding = this.loanAmount;

        this.selectedCustomerLimit = {
            customerId: this.storedApplicationInfo.customerId,
            loanTypeId: this.storedApplicationInfo.loanTypeId,
            branchId: this.storedApplicationInfo.branchId,
            relationshipManagerId: this.userInfo.staffId,// this.storedApplicationInfo.relationshipOfficerId,
            genaralview: true,
            subSectorId: null,
        }

        this.loadDropdowns();  // taken from oninit
        this.initializeControls(); // taken from oninit
    }

    loadDropdowns() {
        this.loanAppService.getRegions(1).subscribe((response: any) => {
            this.regions = response.result;
        });

        this.facilityTypes = [];
        this.loanService.getLoanTypes().subscribe((response: any) => {
            this.facilityTypes = response.result;
        });

        this.productService.getAllProductClassesByProductProcessid(+this.productClassProcessId).subscribe((res) => {
            this.productClasses = res.result;
        });

        // this.penCodeList = [];
        // this.loanAppService.getCustomerLoanPreliminaryEvaluations(this.storedApplicationInfo.customerId, this.storedApplicationInfo.loanTypeId, this.storedApplicationInfo.customerGroupId).subscribe((response: any) => {
        //     this.penCodeList = response.result;
        // });

        this.termSheetCodeList = [];
        this.loanAppService.getCustomerLoantermSheets(this.storedApplicationInfo.customerId).subscribe((response: any) => {
            this.termSheetCodeList = response.result;
        });

        this.termSheetCodeListCorrection = [];
        this.loanAppService.getCustomerLoantermSheetsCorrection().subscribe((response: any) => {
            this.termSheetCodeListCorrection = response.result;
        });

        // this.loanAppService.getCustomerLines(this.storedApplicationInfo.customerId).subscribe((response: any) => {
        //     this.facilities = response.result;
        // })
    }

    initializeControls() { // LOADS MAIN FORM
        const cust = this.storedApplicationInfo;
        const user = this.userInfo;
        // console.log('storedApplicationInfo',this.storedApplicationInfo);
        // tslint:disable-next-line:radix
        if (parseInt(cust.loanTypeId) === 1) {
            this.customerLabelName = "Customer Name";
            this.customerNameTitle = cust.customerName;
            this.accountNumber = cust.accountNumber;
            this.customerId = cust.customerId;
            this.customerTypeId = cust.customerTypeId;
            //this.getAllCustomerAccount(cust.customerId, cust.loanTypeId);
            this.getcustomerLimitAndRating(this.customerId);
            this.getCustomerIBLEligibility(this.customerId);
        }
        // tslint:disable-next-line:radix
        if (parseInt(cust.loanTypeId) === 2) {
            this.customerLabelName = "Group Name";
            this.getcustomerLimitAndRating(this.globalCustomerId)
            // this.getAllCustomerAccount(cust.customerGroupId, cust.loanTypeId)
            this.customerTypeId = cust.customerTypeId;
            this.customerNameTitle = cust.customerGroupName;
            this.accountNumber = 'N/A';
            this.customerId = cust.customerGroupId;
        }
    
        this.loanApplicationForm = this.fb.group({
            loanApplicationId: [0],
            applicationReferenceNumber: [this.loanApplicationReferance],
            customerTypeId: [cust.customerTypeId],
            // tslint:disable-next-line:radix
            loanTypeId: [parseInt(cust.loanTypeId), Validators.required],
            proposedAmount: [0],
            proposedTenor: [0],
            tenorMode: [0],
            regionId: 1,// REGION SET TO 1
            requireCollateralTypeId: [cust.requireCollateralTypeId, Validators.required],
            loantermSheetId: [''],
            relationshipOfficerId: [user.staffId, Validators.required],
            relationshipManagerId: [cust.relationshipManagerId],
            // loanInformation: ['<p></p>', Validators.required],
            loanInformation: [(cust.loanInformation) == null ? '<p></p>' : cust.loanInformation, Validators.required],
            ownershipStructure: [cust.ownershipStructure, Validators.maxLength(100)],
            loansWithOthers: [cust.loansWithOthers, Validators.required],
            collateralDetail: [''],
            customerName: [this.customerNameTitle],
            customerAccount: [this.accountNumber],
            customerId: [cust.customerId],
            isInvestmentGrade: [this.investmentGrade],
            loanApplicationCollateral: [''],
            requireCollateral: [true],
            loanApplicationDetail: [''],
            customerGroupId: [cust.customerGroupId],
            productClassId: [cust.productClassId, Validators.required],
            isAdHocApplication: [this.isAdHocApplication],
            approvedLimitId: [0, Validators.required],
            isEmployerRelated: cust.isEmployerRelated,
            relatedEmployerId: cust.relatedEmployerId
        });
    }

    // facilityDetailsData(event) { // emitted event call af Done is clicked
    //     this.loanApplicationForm.patchValue({ loanApplicationDetail: this.loanApplicationDetails = [] })
    //     for (let i = 0; event.length > i; i++) {
    //         this.loanApplicationReferance = event[i].applicationRefNo;
    //         this.loanApplicationId = event[i].loanApplicationId;
    //         this.loanApplicationDetails.push(event[i]);
    //     }
    //     if (this.loanApplicationForm.value.applicationReferenceNumber === 0) {
    //         this.loanApplicationForm.controls['applicationReferenceNumber'].setValue(this.loanApplicationReferance);
    //     }
    //     this.recalculateOutstanding();
    //     this.loanApplicationForm.controls['proposedAmount'].setValue(this.proposedAmount);
    //     this.loanApplicationForm.controls['proposedTenor'].setValue(this.proposedTenor);
    //     this.displayFacilityDetailForm = false;
    //     this.loanApplicationForm.patchValue({ loanApplicationDetail: this.loanApplicationDetails })
    // }

    setShowAdhocUploadLink(event) {
        this.loanApplicationForm.controls['approvedLimitId'].reset(0);
        if (event.target.checked == true) {
            this.showAdhocUploadLink = true
            this.isAdhoc = true;
            this.loanApplicationForm.controls['approvedLimitId'].disable();
            // this.disableApprovedLineSelect = true;
        } else{
            this.isAdhoc = false;
            this.loanApplicationForm.controls['approvedLimitId'].enable();
            // this.disableApprovedLineSelect = false;
            this.showAdhocUploadLink = false;
        }
    }

    setShowAdhocUpload(event) {
        // console.log(event);
        //console.log("customerId: ", this.storedApplicationInfo.customerId);
        //console.log("loanApplicationId: ", this.loanApplicationId);
        //console.log("loanApplicationReferance: ", this.loanApplicationReferance);
        this.reload++;
        this.showAdhocUpload = true;
        //console.log("reload: ", this.reload);
        // console.log(this.loanApplicationForm.controls['isAdHocApplication'].value);
    }

    private recalculateOutstanding() {
        if (this.loanApplicationDetails.length > 0) {
            this.proposedTenor = 0;
            this.proposedAmount = 0;
            this.exchangeAmount = 0;
            for (let i = 0; this.loanApplicationDetails.length > i; i++) {
                this.facility = this.loanApplicationDetails[i];
                this.exchangeAmount = this.exchangeAmount + this.facility.exchangeAmount;
                let pamount: number = 0;
                pamount = +ConvertString.TO_NUMBER(this.facility.proposedAmount);
                let newAmount: number = pamount;
                this.proposedAmount = (+this.proposedAmount) + (+newAmount);
                this.outstanding = (+this.loanAmount) - (+newAmount);
                ////console.log('exisiting exposure', this.proposedAmount);
                if (this.facility.proposedTenor > this.proposedTenor) {
                    this.proposedTenor = this.facility.proposedTenor;
                }
            }
            this.facility = {};
        }
    }

    onSubmit(saveContinue) { // SAVE AND CONTINUE BUTTON
        
        this.loadingSrv.show();
        const loan = this.loanApplicationForm.value;
        const priceVal = loan.proposedAmount;
       
        const item = this.loanApplicationForm.value;
        this.loanApp = {
            loanApplicationId: this.loanApplicationId, // ZERO OR HAVE VALUE
            applicationReferenceNumber: loan.applicationReferenceNumber,
            customerAccount: loan.customerAccount,
            customerGroupId: loan.customerGroupId,
            customerId: loan.customerId,
            customerName: loan.customerName,
            customerTypeId: loan.customerTypeId,
            isInvestmentGrade: loan.isInvestmentGrade,
            loantermSheetId: loan.loantermSheetId,
            loanInformation: loan.loanInformation,
            ownershipStructure: loan.ownershipStructure,
            loansWithOthers: loan.loansWithOthers,
            loanApplicationDetail: [], // why???
            loanTypeId: loan.loanTypeId,
            requireCollateral: loan.requireCollateral,
            relationshipManagerId: loan.relationshipManagerId,
            relationshipOfficerId: loan.relationshipOfficerId,
            productClassId: loan.productClassId,
            regionId: loan.regionId,
            requireCollateralTypeId: loan.requireCollateralTypeId,
            proposedAmount: loan.proposedAmount,
            proposedTenor: loan.proposedTenor,
            tenorMode: loan.tenorModeId,
            isNewApplication: false,
            collateralDetail: loan.collateralDetail,
            isAdHocApplication: loan.isAdHocApplication,
            loanApprovedLimitId: loan.approvedLimitId,
            isEmployerRelated: loan.isEmployerRelated,
            relatedEmployerId: loan.relatedEmployerId,
            termSheetCode: loan.termSheetCode,
            iblRequest: this.isIblRequest

        }
        this.loanAppService.saveApplication(this.loanApp).subscribe((response: any) => {
            if (response.success === true) {
                    if (response.result.jumpedDestination) {
                       
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> Approved facility with Reference Number <b>' 
                        + response.result.applicationReferenceNumber + '</b>'
                        + ' has been moved to Drawdown', 'success');
                        this.loanApplicationForm.reset();
                        this.loadingSrv.hide();
                        this.router.navigate(['/credit/loan/booking/initiate-booking']);
                    }
                   else if (response.result.loanApprovedLimitId > 0) {

                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> Approved facility with Reference Number <b>' 
                        + response.result.applicationReferenceNumber + '</b>'
                        + ' has been moved to Drawdown', 'success');
                        this.loanApplicationForm.reset();
                        this.loadingSrv.hide();
                        
                        this.router.navigate(['/credit/loan/booking/initiate-booking']);
                    } 
                    else if (response.result.isadhocapplication == true && !(response.result.loanApprovedLimitId > 0)) {
                        
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> Adhoc Loan Application has been successfully initiated with Reference Number <b>' 
                        + response.result.applicationReferenceNumber + '</b>', 'success');
                        }
                     else {
                        // if(response.result.isSDApplicable && response.result.sdoCode != null){
                        //     swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/> New Loan Application has Reference Number <b>' 
                        // + response.result.applicationReferenceNumber + 
                        // '<br/> Stamp Duty Code <b>' + response.result.sdoCode +
                        // '</b> '  , 'success');
                        // }
                       
                        swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/> New Loan Application has Reference Number <b>' 
                        + response.result.applicationReferenceNumber + '</b>' , 'success');
                    }

                    this.loadingSrv.hide();
                    if (saveContinue && response.result.jumpedDestination == false) {
                        this.loanApplicationForm.reset();
                        this.router.navigate(['/credit/loan/loan-eligibility-requirement', response.result.loanApplicationId]);
                    } else {
                        this.loadingSrv.hide(2500);
                    }
                
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.loadingSrv.hide(2500);
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingSrv.hide(2500);
        });
    }

    hideModal() {
        this.router.navigate(['/credit/loan/application/start']);
    }


    loanApp: ILoanApplication;
    loanApplicationInfo(): ILoanApplication {
        const loan = this.loanApplicationForm.value;
        this.loanApp = {
            loanApplicationId: loan.loanApplicationId,
            applicationReferenceNumber: loan.applicationReferenceNumber,
            customerAccount: loan.customerAccount,
            customerGroupId: loan.customerGroupId,
            customerId: loan.customerId,
            customerName: loan.customerName,
            customerTypeId: loan.customerTypeId,
            isInvestmentGrade: loan.isInvestmentGrade,
            loantermSheetId: loan.loantermSheetId,
            loanInformation: loan.loanInformation,
            ownershipStructure: loan.ownershipStructure,
            loansWithOthers: loan.loansWithOthers,
            loanApplicationDetail: [],
            loanTypeId: loan.loanTypeId,
            requireCollateral: loan.requireCollateral,
            relationshipManagerId: loan.relationshipManagerId,
            relationshipOfficerId: loan.relationshipOfficerId,
            productClassId: loan.productClassId,
            regionId: loan.regionId,
            requireCollateralTypeId: loan.requireCollateralTypeId,
            proposedAmount: loan.proposedAmount,
            proposedTenor: loan.proposedTenor,
            tenorMode: loan.tenorMode,
            isNewApplication: true,
            collateralDetail: loan.collateralDetail,
            isAdHocApplication: loan.isAdHocApplication,
            loanApprovedLimitId: loan.approvedLimitId,
            isEmployerRelated: loan.isEmployerRelated,
            relatedEmployerId: loan.relatedEmployerId,
            termSheetCode: loan.termSheetCode,
            iblRequest: loan.iblRequest

        }; 
        return this.loanApp
    }

    AddFacilityDetails(): IApplicationInfo {
        this.applicationDetailId = null;
        this.displayFacilityDetailForm = true;
        const cust = this.storedApplicationInfo;
        if (cust.loanTypeId = 2) {
            cust.loanTypeId = 2
        }
        cust.loanTypeId = 1;
        this.loanApplicationForm.patchValue({ applicationReferenceNumber: this.loanApplicationReferance })
        this.loanApplicationInfo();
        this.facilityDetails = {
            customerGroupId: cust.customerGroupId,
            loanTypeId: cust.loanTypeId,
            customerId: cust.customerId,
            loanApplicationDetailId: 0,
            customerName: cust.customerName,
            ApplicationRef: this.loanApplicationReferance,
            loanApplicationId: this.loanApplicationId,
            iblRequest: this.isIblRequest
        };

        
        return this.facilityDetails;
    }

    removeApplicationDetailsItem(evt, indx) {
        evt.preventDefault();
        const currRecord = this.loanApplicationDetails[indx];
        this.loadingSrv.show();
        this.loanAppService.deleteApplication(currRecord.loanApplicationDetailId).subscribe((x) => {
        this.loadingSrv.hide();
            if (x.result) {
                this.TotalAmount -= currRecord.exchangeAmount;
                this.proposedAmount -= currRecord.exchangeAmount;
                this.outstanding += currRecord.exchangeAmount;
                this.loanApplicationDetails.splice(indx, 1);
            }
        });
    }

    getcustomerLimitAndRating(customerId) { // WHY IS RESPONSE COMMENTED?
        if (customerId == null || customerId == undefined){
            return;
        }
        this.customerRate_Limit = {};
        this.customerService.getCustomerRatingAndLimit(customerId).subscribe((res) => {
            // this.lcustomerLimit = res.result.limit;
            // this.customerRating = res.result.rating;
            // this.investmentGrade = res.result.isInvestment;
        });
    }

    // STAGED FOR DELETE!
    // ngOnChanges(changes: SimpleChanges): void {
    //     //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //     //Add '${implements OnChanges}' to the class.
    //     if (this.loanApplicationReferance == null) this.loanApplicationReferance
    // }

    // getfacilityTypes() {
    //     this.facilityTypes = [];
    //     this.loanService.getLoanTypes().subscribe((response: any) => {
    //         this.facilityTypes = response.result;
    //     });
    // }

    // removeApplicationDetailsItem(evt, row) {
    //     evt.preventDefault();

    //     const currRecord = this.loanApplicationDetails[row];

    //     this.TotalAmount -= currRecord.exchangeAmount;
    //     this.proposedAmount -= currRecord.exchangeAmount;
    //     this.outstanding += currRecord.exchangeAmount;
    //     this.loanApplicationDetails.splice(row, 1);
    // }


    // removeApplicationDetailsItem(evt, indx) {
    //     evt.preventDefault();
    //     const currRecord = this.loanApplicationDetails[indx];
    //     this.loanAppService.deleteApplication(currRecord.loanApplicationDetailId).subscribe((x) => {
    //         if (x.result) {
    //             //console.log("currRecord", currRecord);
    //             this.TotalAmount -= currRecord.exchangeAmount;
    //             this.proposedAmount -= currRecord.exchangeAmount;
    //             this.outstanding += currRecord.exchangeAmount;
    //             this.loanApplicationDetails.splice(indx, 1);
    //         }
    //     });       
    // }


    // EDIT CODE HERE

    // editFacilityDetails(row) {
    //     this.displayFacilityDetailForm = true;
    //     this.loanFacilityDetails = row;
    //     //console.log("My Fac Details", row);
    // }

    applicationDetailId: number = 0;

    getApplicationFacilities(reference) {
        this.editMode = false;
        this.displayFacilityDetailForm = false; //
        this.loanApplicationDetails = []; // clear
        this.loanAppService.loanApplicationDetailsByReference(reference).subscribe((response: any) => {
            //console.log(reference + ' ref application facilities: ', response.result);
            this.loanApplicationId = response.loanApplicationId;
            if (response.count > 0) {
                this.loanApplicationDetails = response.result;
            }
        });
    }

    editFacilityDetails(row) {
        // console.log("row: ", row);
        this.productClassId = row.productClassId;
        this.applicationDetailId = row.loanApplicationDetailId;
        this.customerId = row.customerId;
        this.customerTypeId = row.customerTypeId;
        this.editMode = true;
        this.displayFacilityDetailForm = true;
        const cust = this.storedApplicationInfo; 
        // this.isAdHocApplication = row.isAdHocApplication;

        if (cust.loanTypeId = 2) {
            cust.loanTypeId = 2;
        }
        cust.loanTypeId = 1;

        this.loanApplicationForm.patchValue({ applicationReferenceNumber: this.loanApplicationReferance,})
        this.loanApplicationInfo();
        this.facilityDetails = {
            customerGroupId: cust.customerGroupId,
            loanTypeId: cust.loanTypeId,
            customerId: row.customerId,
            loanApplicationDetailId: row.loanApplicationDetailId,
            customerName: cust.customerName,
            ApplicationRef: this.loanApplicationReferance,
            loanApplicationId: this.loanApplicationId,
            iblRequest: this.isIblRequest
        };

        return this.facilityDetails;
    }

    refreshDetailsGrid(event) {
        this.getApplicationFacilities(this.loanApplicationReferance);
    }


    getAllRelatedEmployers(){
        this.loadingSrv.show();
        this.genSetupServ.getEmployersList().subscribe((employers) => {
            this.loadingSrv.hide();
            this.relatedEmployers = employers.result;
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    getSingleCustomerRelatedEmployer(){
        let custId = this.loanApplicationForm.get('customerId').value;
        if (isNullOrUndefined(custId)){
            return;
        }
        this.loadingSrv.show();
        this.customerService.getSingleCustomerRelatedEmployer(this.customerId).subscribe((employers) => {
            this.loadingSrv.hide();
            if (employers.success == true){
                let employerId = employers.result.employerId;
                this.loanApplicationForm.get('relatedEmployerId').setValue(employerId);
                this.loanApplicationForm.get('relatedEmployerId').setValidators(Validators.required);
                this.loanApplicationForm.get('relatedEmployerId').updateValueAndValidity();
            }else{
                swal(`${GlobalConfig.APPLICATION_NAME}`, employers.message, 'error');
                this.loanApplicationForm.get('relatedEmployerId').setValue(null);
                this.loanApplicationForm.get('isEmployerRelated').setValue(null);
                this.loanApplicationForm.get('relatedEmployerId').setValidators(null);
                this.loanApplicationForm.get('isEmployerRelated').updateValueAndValidity();
                this.loanApplicationForm.get('relatedEmployerId').updateValueAndValidity();
            }
    }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }


    toggleIsEmployerRelated(event){
        let value = event.target.checked;
        if(value == true){
            let custId = this.loanApplicationForm.get('customerId').value;
            if (isNullOrUndefined(custId)){
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Select a customer!', 'error');
            }
            this.loanApplicationForm.get('relatedEmployerId').setValidators(Validators.required);
            this.loanApplicationForm.get('relatedEmployerId').updateValueAndValidity();
            // this.getSingleCustomerRelatedEmployer();
        }else{
            this.loanApplicationForm.get('relatedEmployerId').setValue(null);
            this.loanApplicationForm.get('relatedEmployerId').setValidators(null);
            this.loanApplicationForm.get('relatedEmployerId').updateValueAndValidity();
        }
    }

    isEmployerRelatedToggled(): boolean{
        let value = this.loanApplicationForm.get('isEmployerRelated').value;
        // console.log(value);
        return(value == true);
    }
                        
    // getTotalExposureLimit(ref): void {
    //     this.loanAppService.getTotalExposureLimitReference(ref).subscribe((response: any) => {
    //         this.totalExposureLimit = response.result;
    //     });
    // }

    getCustomerIBLEligibility(customerId) {
        this.customerService.getCustomerIBLEligibility(customerId).subscribe((response) => {
            this.iblEligibility = response.result;
            
            if( this.iblEligibility[0].isEligible == true){
                this.isIBLEligible = true;
                this.iblAmount = this.iblEligibility[0].amount;
                this.iblMinimumAmount = this.iblEligibility[0].minimumAmount;
                this.isIblRequest = this.iblEligibility[0].isIblRequest;
            }
           
        });
    }
}