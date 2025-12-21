import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';
import { StaffRoleService, GeneralSetupService, CurrencyService } from 'app/setup/services';
import { CreditAppraisalService } from 'app/credit/services';
import { GlobalConfig, ApprovalStatus } from 'app/shared/constant/app.constant';
import { DatePipe } from '@angular/common';
import { CasaService } from 'app/customer/services/casa.service';
import { List } from 'lodash';
import { ExchangeRateService } from 'app/admin/services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'lc-issuance',
  templateUrl: './lc-issuance.component.html',
})

export class LcIssuanceComponent implements OnInit {

  // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = 'For Issuance';
    // reload: number = 0;
    @Input() isForReleaseOfShippingDocuments = false;
    @Input() isForLCUssance = false;
    @Input() isForLCUssanceExtension = false;
    @Input() isLCSearch = false;
    @Input() isForLMSSearch = false;
    @Input() isLCEnhancement = false;
    @Input() isLCExtension = false;
    @Input() OPERATION_ID = 135;
    @Input() lcIssuanceId = 0;
    @Input() tempLcIssuanceId = 0;
    @Input() showButtons = true;
    @Input() releaseAmount = 0;
    @Input() lcReleaseAmountId = 0;
    @Input() lcUssanceId = 0;
    @Input() totalUsanceAmount: 0;//amount available for usance
    @Input() lcReleases: any[] = [];
    @Input() lcUsances: any[] = [];
    @Input() commentHeading = 'LC Issuance';
    @Input() isLcCancelation = false;

    LCAmountCurrencyCode: string;
    targetId = 0;

    @Input() set reload(value: number) { if (value > 0 && (this.isLCSearch == true)) this.getLcIssuances(); }
    @Input() set resetTabs(value: number) {
        if (value > 0) {
            this.customerId = null;
            this.selectedId = null;
            this.resetActiveTabIndex();
            this.initializeControls();
        }
        
    }

    formState: string = 'New';
    selectedId: number = null;
    activeTabindex: number = 0;
    IsOnLcIssuanceListTab: boolean;
    lcForwardTitle = 'LC Issuance';
    forwardAction: number;
    lcSelection: any;
    lcIssuances: any[] = [];
    lcUsanceExtensions: any[] = [];

    lcUssance: any;
    customerAccount: any[];
    lines: any[];
    selectedApplicationId: number;
    applicationReferenceNumber = '';
    displayFAM = false;
    lcIssuanceForm: FormGroup;
    lcUssanceForm: FormGroup;
    lcForwardForm: FormGroup;
    displayLcIssuanceForm: boolean = false;
    customer: any;
    customerName: string;
    customerId: number;
    lcReferenceNumber: number;
    showSearchCustomerDialog = false;
    showLMSDialogForEnhancement = false;
    staffRoleRecord: any;
    proposedItems: any;
    addCashBuildUpDetails = false;

    currentStaffActivities: string[];
    // isAccountOfficer = false;
    approvalStatusData: any[];
    showLcForward = false;
    vote: number;
    OPERATION_IDs: number[];
    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        canAppendTemplate: true,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        staffId: null,
        roleId: null,
        userBranchId: null,
        // investmentGradeApprovalLimit: 10000, // todo later
        // maximumTenor: 223, // todo later
        groupRoleId: 1, // bu,ca,md,comm,bd
    };
    currencies: any[];
    lcType = [
        {name: 'Confirmed', id: 1},
        {name: 'Unconfirmed', id: 2}
    ];

    lcFundSource = [
        {name: 'Cash', id: 1},
        {name: 'IFF Line', id: 2}
    ];
    outstandingUsanceAmount: number;
    tempLcUsanceId: number;
    oldUssanceTenor: number;
    oldLcMaturityDate: Date;
    allExchangeRates: any[];
    nairaEquivalent: number;
    nairaEquivalent2: number;
    lcAmtExchangeRate: number;
    numberOfLCRequiredDocuments = 0;
    numberOfShippingDocuments = 0;
    numberOfLCConditions = 0;
    numberOfShippings = 0;
    displaySearchForm = false;
    displaySearchTable: boolean = true;
    searchString: string;
    LCapplications: any[];
    searchForm: FormGroup;
    // ---------------------- init ----------------------

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private staffRole: StaffRoleService,
        private lcService: LetterOfCreditService,
        private genSetupService: GeneralSetupService,
        private camService: CreditAppraisalService,
        private currencyService: CurrencyService,
        private casaService: CasaService,
        private exchangeServ: ExchangeRateService,
        private router: Router,
    ) { }

	ngOnInit() {
        this.loadingService.reset();
        this.setOperationId();
        this.getCurrentStaffActivities();
		this.initializeControls();
        this.getAllApprovalStatus();
        this.getAllCurrencies();
        this.getLcIssuances();
        this.getAllExchangeRates();
        this.setLcForwardTitle();
    }

    setOperationId() {
        if (this.isForRelease()) {
            this.OPERATION_IDs = [135,138]
            this.OPERATION_ID = 138;
            this.commentHeading = 'LC Release';
            this.label = 'For Release Of Shipping Documents';
        } else if (this.isForUssanceExtension()) {
            this.OPERATION_IDs = [276];
            this.OPERATION_ID = 276;
            this.label = 'For Usance Extension';
            this.commentHeading = 'LC Usance Extension';
        } else if (this.isForUssance()) {
            this.OPERATION_IDs = [135,138,140];
            this.OPERATION_ID = 140;
            this.label = 'For Usance';
            this.commentHeading = 'LC Usance';
        } else if (this.isForLCCancelation()) {
            this.OPERATION_IDs = [239];
            this.OPERATION_ID = 239;
            this.label = 'For Cancelation';
            this.commentHeading = 'LC Cancelation';
        } else if (this.isForLCEnhancement()) {
            this.OPERATION_IDs = [238];
            this.OPERATION_ID = 238;
            this.label = 'For Enhancement';
            this.commentHeading = 'LC Enhancement';
        } else if (this.isForLCExtension()) {
            this.OPERATION_IDs = [274];
            this.OPERATION_ID = 274;
            this.label = 'For Issuance Tenor Extension';
            this.commentHeading = 'LC Issuance Tenor Extension';
        } else if (!this.isForRelease() && !this.isForUssance() && !this.isForLCCancelation() && !this.isForLCEnhancement() && !this.isForLCExtension()) {
            this.OPERATION_IDs = [135];
            this.OPERATION_ID = 135;
        }
    }

    setLcForwardTitle(){
        if (this.isLCEnhancement){
            this.lcForwardTitle = 'LC Enhancement';
        }else if(this.isLCExtension){
            this.lcForwardTitle = 'LC Issuance Extension';
        }else if(this.isForRelease()){
            this.lcForwardTitle = 'LC Release of Shipping Documents';
        }else if(this.isForUssanceExtension()){
            this.lcForwardTitle = 'LC Usance Extension';
        }else if(this.isForUssance()){
            this.lcForwardTitle = 'LC Usance';
        }else if(this.isForLCCancelation()){
            this.lcForwardTitle = 'LC Cancelation';
        }else{
            this.lcForwardTitle = 'LC Issuance';
        }
    }
    
    initializeControls() {
        this.resetActiveTabIndex();
        this.clearControls();
        this.clearSearchControls();
        this.initializeLCUssance();
        if (this.isForLCCancelation()){
            this.lcForwardForm = this.fb.group({
                forward: '',
                comment: ''
            });
        }else{
            this.lcForwardForm = this.fb.group({
                forward: [''],
                comment: ['', Validators.required]
            });
        }
     
    }

    getApprovalStatus(approvalStatus) {
            let processLabel = 'PROCESSING';
            // if (this.privilege.groupRoleId != ApprovalGroupRole.BU) { processLabel = 'FAM PROCESS'; }
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
            // console.log("currencies", this.currencies);
        }, (err) => {
            ////console.log(err);
        });
    }

    getAllCustomerAccount(customerId: number) {
        this.loadingService.show();
        this.casaService.getAllCustomerAccountByCustomerId(customerId)
        .subscribe((response: any) => {
            this.loadingService.hide();
            this.customerAccount = response.result;
        }, () => {
            this.loadingService.hide(1000);
        });
    }

    canEdit(): boolean { 
        return  this.privilege.canAppendTemplate;
    }

    canUpload(): boolean {
        return this.privilege.canUploadFile;
    }

    // extraInits() {
    //     this.lcSelection.currentApprovalLevelId = 0;// refer back
    //     this.lcSelection.toStaffId = 0;
    // }
    
    getIFFLinesForLc(customerId: number) {
        this.loadingService.show();
        this.lcService.getIFFLinesForLc(customerId).subscribe
        ((response) => {
            this.loadingService.hide();
            this.lines = response.result;
           // console.log(this.lines);
        }, () => {
            this.loadingService.hide(1000);
        });
    }

    isForRelease(): boolean {
        return this.isForReleaseOfShippingDocuments;
    }

    isForUssance(): boolean {
        return this.isForLCUssance;
    }

    isForUssanceExtension(): boolean {
        return (this.isForLCUssanceExtension && this.isForLCUssance);
    }

    isForLCSearch(): boolean {
        return this.isLCSearch;
    }

    isForLCCancelation(): boolean {
        // if (this.currentStaffActivities == null || this.currentStaffActivities == undefined){
        //     return false;
        // }
        // return this.isAmongActivities('Lc Cancellation') && this.isForLCSearch() && this.isLcCancelation;
        return this.isLcCancelation;
        // return this.isLcCancelation && this.isForLMSSearch == false;
    }

    isForLCEnhancement(): boolean {
        return (this.isLCEnhancement == true);
    }

    isForLCExtension(): boolean {
        return (this.isLCExtension == true);
    }
    
    isForReleaseOrUssanceOrSearchOrEnhancementOrExtension(): boolean {
        // console.log(this.isForReleaseOfShippingDocuments || this.isForLCUssance);
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLCSearch || this.isLCEnhancement || this.isLCExtension);
    }

    isForReleaseOrUssanceOrSearchOrCancelationOrEnhancementOrExtension(): boolean {
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLCSearch || this.isLcCancelation || this.isLCEnhancement || this.isLCExtension);
    }

    isForReleaseOrUssanceOrCancelationOrEnhancementOrExtension(): boolean {
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLcCancelation || this.isLCEnhancement || this.isLCExtension);
    }

    isForReleaseOrUssanceOrSearch(): boolean {
        // console.log(this.isForReleaseOfShippingDocuments || this.isForLCUssance);
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLCSearch);
    }

    isForReleaseOrUssanceOrSearchOrCancelationOrExtension(): boolean {
        // console.log(this.isForReleaseOfShippingDocuments || this.isForLCUssance);
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLCSearch || this.isLcCancelation || this.isLCExtension);
    }

    isForReleaseOrUssanceOrSearchOrCancelationOrEnhancement(): boolean {
        // console.log(this.isForReleaseOfShippingDocuments || this.isForLCUssance);
        return (this.isForReleaseOfShippingDocuments || this.isForLCUssance || this.isLCSearch || this.isLcCancelation || this.isLCEnhancement);
    }
    // isAnAccountOfficer():boolean {
    //     return this.isAccountOfficer;
    // }

    isOnIssuanceListTab(): boolean {
        return this.activeTabindex == 0;
    }

    

    isAmongActivities(activity: string): boolean {
        // activity = activity.toLowerCase();
        if (isNullOrUndefined(this.currentStaffActivities)) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
    }

    onTabChange(event) {
        this.activeTabindex = event.index;
    }

    showCustomerSearchForm() {
        this.showSearchCustomerDialog = true;
    }

    showLcSearch() {
        this.showLMSDialogForEnhancement = true;
        this.displaySearchForm = true;
    }

	onlcIssuanceChange(event) {
        //console.log(this.lcSelection);
        
        this.addCashBuildUpDetails = event.data.cashBuildUpAvailable;
        this.setExchangeRate(event.data.currencyId);
        this.selectedId = event.data.lcIssuanceId;
        this.targetId = this.selectedId;
        if (this.isForUssance()) {
            this.totalUsanceAmount = this.lcSelection.totalUsanceAmount;
            this.outstandingUsanceAmount = this.lcSelection.totalUsanceAmount;
            this.lcUssanceId = event.data.lcUssanceId;
            if(this.isForUssanceExtension()){
                this.getLcUssanceExtension(event.data.tempLcUsanceId);
                this.tempLcUsanceId = event.data.tempLcUsanceId;
                this.targetId = this.tempLcUsanceId;
            }else{
                this.getLcUssance(event.data.lcUssanceId);
                this.targetId = this.lcUssanceId;
            }
        }
        if(this.isForLCSearch()) {
            this.outstandingUsanceAmount = this.totalUsanceAmount;
            // this.getLcUssances(this.selectedId);
            // this.getLcUssance(this.lcUssanceId);
            this.LCAmountCurrencyCode = this.getCurrencyCode(event.data.currencyId);
        }
        this.getAllCustomerAccount(event.data.customerId);
        this.getIFFLinesForLc(event.data.customerId);
        this.lcReferenceNumber = event.data.lcReferenceNumber;
        this.customerId = event.data.customerId;
        this.reload = event.data.lcIssuanceId;
        // this.activeTabindex = 0;
        this.activeTabindex = 1;
        if (this.isForRelease()) {
            this.getUserPrivileges(this.lcSelection.currentApprovalLevelId);
            this.lcReleaseAmountId = event.data.lcReleaseAmountId;
            this.releaseAmount = event.data.releaseAmount;
            this.LCAmountCurrencyCode = this.getCurrencyCode(event.data.currencyId);
            this.targetId = this.lcReleaseAmountId;
        }
        if(this.isForLCEnhancement() || this.isForLCExtension()){
            this.tempLcIssuanceId = event.data.tempLcIssuanceId;
            this.targetId = this.tempLcIssuanceId;
        }
        this.editLcIssuance(this.lcSelection);
        if (event.data.fundSourceId == 2) {
            this.selectedApplicationId = this.lcIssuanceForm.controls['fundSourceDetails'].value;
            this.getLoanDetails(this.selectedApplicationId);
        }
    }
    
    setCustomerName(event) {
        this.customerName = event.customerName;
    }

    resetActiveTabIndex() {
        this.activeTabindex = 0;
        this.activeTabindex = 0;
        this.activeTabindex = 0;
        this.selectedApplicationId = null;
        this.applicationReferenceNumber = '';
        this.selectedId = null;
        this.customerId = null;
    }

    setCustomer(event) {
        this.initializeControls();
        this.customerId = event.customerId;
        this.getAllCustomerAccount(event.customerId);
        this.getIFFLinesForLc(event.customerId);
        this.lcIssuanceForm.controls['customerId'].setValue(event.customerId);
        this.activeTabindex = 1;
        this.selectedId = null;
        this.reload = event.customerId;
        this.showSearchCustomerDialog = false;
    }




    //lms

    clearSearchControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
    }

    submitForm(form) {
        this.searchString = form.value.searchString;
        
        this.loadingService.show();
        this.lcService.searchForLC(this.searchString).subscribe((response: any) => {
            this.LCapplications = response.result;
            this.loadingService.hide();
            this.displaySearchForm = false;
            this.displaySearchTable = true;
            // this.displayApplicationDetail = false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    showSearchForm() { this.displaySearchForm = true; }
    setLc(event) {
        this.initializeControls();
        this.customerId = event.customerId;
        this.getAllCustomerAccount(event.customerId);
        this.getIFFLinesForLc(event.customerId);
        this.lcIssuanceForm.controls['customerId'].setValue(event.customerId);
            
        this.addCashBuildUpDetails = event.cashBuildUpAvailable;
        this.setExchangeRate(event.currencyId);
        this.selectedId = event.lcIssuanceId;
        this.targetId = this.selectedId;
        
        // if(this.isForLCSearch()) {
        //     this.outstandingUsanceAmount = this.totalUsanceAmount;
        //     this.getLcUssance(this.lcUssanceId);
        //     this.LCAmountCurrencyCode = this.getCurrencyCode(event.data.currencyId);
        // }
        this.lcReferenceNumber = event.lcReferenceNumber;
        this.reload = event.lcIssuanceId;
        this.activeTabindex = 1;
        if (event.fundSourceId == 2) {
            this.selectedApplicationId = this.lcIssuanceForm.controls['fundSourceDetails'].value;
            this.getLoanDetails(this.selectedApplicationId);
        }

        this.loadingService.show();
        this.lcService.getLcIssuancesByLcIssuanceId(event.lcIssuanceId).subscribe((response: any) => {
            this.loadingService.hide();
            this.lcSelection = response.result[0];
            this.editLcIssuance(this.lcSelection);
            this.showLMSDialogForEnhancement = false;
        });
    }

    // setCashBuildUpDetails(event){
    //     this.addCashBuildUpDetails = event.target.checked;
    //     if (!(this.addCashBuildUpDetails)) {
    //     this.lcIssuanceForm.controls['cashBuildUpReferenceType'].reset;
    //     this.lcIssuanceForm.controls['cashBuildUpReferenceNumber'].reset;
    //     this.lcIssuanceForm.controls['percentageToCover'].reset;
    //     }
    // }

    isCashBuildUpAvailable(): boolean {
        return this.addCashBuildUpDetails;
    }

    // getUserRole() {
    //     this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
    //         this.staffRoleRecord = res.result;
    //         console.log(this.staffRoleRecord);
    //         if (this.staffRoleRecord.staffRoleCode == 'AO') {
    //             this.isAccountOfficer = true;
    //         } else {
    //             this.isAccountOfficer = false
    //         }
    //     this.getLcIssuances();
    //     });
    // }

    getCurrentStaffActivities() {
        const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.currentStaffActivities = userInfo.activities;
        // this.lcService.getCurrentStaffActivities().subscribe(
        //     (res) => {
        //     this.currentStaffActivities = res.result;
        //     // console.log(this.currentStaffActivities);
        // });
    }

    resetButton(value) {
        //console.log('On approval status change ' + value);
    }

    getCurrencyCode(value): string {
        if ((value == undefined) || (value == null)) {
          //  console.log('value =>' + value);
            return '';
        }
        if ((this.currencies == undefined) || (this.currencies == null)) {return;}
        let currency = this.currencies.find(c => c.currencyId == value);
        return currency.currencyCode;
    }

    resetAmounts() {
        this.lcIssuanceForm.controls['availableAmountCurrencyCode'].setValue("");
        this.lcIssuanceForm.controls['totalApprovedAmountCurrencyCode'].setValue("");
        this.lcIssuanceForm.controls['availableAmountCurrencyId'].setValue("");
        this.lcIssuanceForm.controls['totalApprovedAmountCurrencyId'].setValue("");
        this.lcIssuanceForm.controls['availableAmount'].setValue("");
        this.lcIssuanceForm.controls['totalApprovedAmount'].setValue("");
    }

    setAmounts(value) {
        this.resetAmounts();
        // console.log(this.customerAccount.find(a => a.casaAccountId == value).availableBalance);
        let bal = this.customerAccount.find(a => a.casaAccountId == value);
       // console.log(bal);
        this.lcIssuanceForm.controls['availableAmountCurrencyCode'].setValue(this.getCurrencyCode(bal.currencyId));
        this.lcIssuanceForm.controls['totalApprovedAmountCurrencyCode'].setValue(this.getCurrencyCode(bal.currencyId));
        this.lcIssuanceForm.controls['availableAmountCurrencyId'].setValue(bal.currencyId);
        this.lcIssuanceForm.controls['totalApprovedAmountCurrencyId'].setValue(bal.currencyId);
        this.lcIssuanceForm.controls['availableAmount'].setValue(bal.availableBalance);
        this.lcIssuanceForm.controls['totalApprovedAmount'].setValue(bal.availableBalance);
        }

    setIFFAmounts(applicationId) {
        if (applicationId > 0){
            this.resetAmounts();
            this.getLoanDetails(applicationId);
            let line = this.lines.find(l => l.loanApplicationId == applicationId);
           // console.log(line);
            // console.log(this.customerAccount.find(a => a.casaAccountId == value).availableBalance);
            this.lcIssuanceForm.controls['availableAmountCurrencyCode'].setValue(this.getCurrencyCode(line.currencyId));
            this.lcIssuanceForm.controls['totalApprovedAmountCurrencyCode'].setValue(this.getCurrencyCode(line.currencyId));
            this.lcIssuanceForm.controls['availableAmountCurrencyId'].setValue(line.currencyId);
            this.lcIssuanceForm.controls['totalApprovedAmountCurrencyId'].setValue(line.currencyId);
            this.lcIssuanceForm.controls['availableAmount'].setValue(line.customerAvailableAmount);
            this.lcIssuanceForm.controls['totalApprovedAmount'].setValue(line.approvedAmount);
        }
    }

    getLoanDetails(applicationId): void {
        this.loadingService.show();
        this.camService.getLoanDetail(applicationId).subscribe((response: any) => {
           // console.log(response.result.facilities);
            this.proposedItems = response.result.facilities;
            this.loadingService.hide();
            this.selectedApplicationId = applicationId;
            this.applicationReferenceNumber = response.result.application.applicationReferenceNumber;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    resetLCFundSource(value) {
      //  console.log('On fund source change ' + value);
        this.selectedApplicationId = null;
        this.applicationReferenceNumber = '';
        this.lcIssuanceForm.controls['fundSourceDetails'].setValue("");
        this.resetAmounts();
    }

    lcFundSourceId(): number {
        return this.lcIssuanceForm.controls['fundSourceId'].value;
    }

    closeDialog() {
        this.showLcForward = false;
    }

    forward() {
        this.showLcForward = true;
    }

    getUserPrivileges(levelId = null) {
        let body = {
            levelId: levelId,
            operationId: this.OPERATION_ID,
        }
        this.camService.getPrivilege(body).subscribe((response: any) => {
            this.privilege = response.result;
            // this.privilege.currentApprovalLevelId = this.obligor.currentApprovalLevelId;
            // this.privilege.currentApprovalLevel = this.loanSelection.currentApprovalLevel;
           
        });
    }

    fillUsanceMaturityDate(event) {
       // console.log(event.target.value);
        let time = new Date(this.lcUssanceForm.controls['lcEffectiveDate'].value).getTime();
       // console.log(time);
        let newTime = time + (event.target.value * 86400 * 1000);
       // console.log(new Date(newTime));
        this.lcUssanceForm.controls['lcMaturityDate'].setValue(new Date(newTime));

    }

    getExhangeRate(currencyId: number): number {
        if (currencyId > 0)
        currencyId = Number(currencyId);
        {return this.allExchangeRates.find(r => r.currencyId == currencyId).exchangeRate;}
    }

    setExchangeRate(currencyId: number) {
        if (this.allExchangeRates.length > 0)
        {
            this.lcIssuanceForm.controls['letterOfCreditAmount'].updateValueAndValidity();
            this.lcAmtExchangeRate = this.getExhangeRate(currencyId);
            this.lcIssuanceForm.controls['lcAmtExchangeRate'].setValue(this.lcAmtExchangeRate);
           // console.log('this.lcIssuanceForm.controls[\'letterOfCreditAmount\'].value', this.lcIssuanceForm.controls['letterOfCreditAmount'].value);
            let lcAmt = this.lcIssuanceForm.get('letterOfCreditAmount').value;
            this.nairaEquivalent = this.lcAmtExchangeRate * parseFloat(String(lcAmt).replace(/,/g,''));
            this.lcIssuanceForm.controls['nairaEquivalent'].setValue(this.nairaEquivalent);
            this.calculateToleranceAmount();
        }
    }   
    
    setExchangeRateForUssance(currencyId: number) {
        if (this.allExchangeRates.length > 0)
        {
            this.lcUssanceForm.controls['ussanceAmount'].updateValueAndValidity();
            let lcAmtExchangeRate = this.getExhangeRate(currencyId);
            let lcAmt = this.lcUssanceForm.get('ussanceAmount').value;
            let nairaEquivalent = lcAmtExchangeRate * parseFloat(String(lcAmt).replace(/,/g,''));
            this.outstandingUsanceAmount = this.totalUsanceAmount - nairaEquivalent;

        }
    }   
  // ------------------- api-calls --------------------

    goForApproval() {
        const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to submit',
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
                __this.loadingService.showKeyApiCall();
            // if (__this.lcForwardForm.controls['forward'].value == 2) {
            //     if (__this.privilege.canApprove == true) {
            //         __this.vote = __this.lcForwardForm.controls['forward'].value;
            //         __this.forwardAction = __this.lcForwardForm.controls['forward'].value;
            //     } else {
            //         __this.vote = __this.lcForwardForm.controls['forward'].value;
            //         __this.forwardAction = 0;
            //     }
            // } else {
            //     __this.vote = __this.lcForwardForm.controls['forward'].value;
            //     __this.forwardAction = __this.lcForwardForm.controls['forward'].value;
            // }
            __this.vote = 1;
            __this.forwardAction = 0;
                
            let body = {
                    forwardAction: __this.forwardAction,
                    comment: __this.lcForwardForm.controls['comment'].value,
                    lcIssuanceId: __this.selectedId,
                    lcUssanceId: __this.lcUssanceId,
                    amount: __this.lcIssuanceForm.controls['totalApprovedAmount'].value,
                    lcReleaseAmountId: __this.lcReleaseAmountId,
                    releaseAmount: __this.releaseAmount,
                    tempLcIssuanceId: __this.tempLcIssuanceId,
                    tempLcUsanceId: __this.tempLcUsanceId,
                    // d,receiverLevelId: this.lcSelection.currentApprovalLevelId, // refer back
                    // receiverStaffId: this.lcSelection.toStaffI // refer back
                    vote: __this.vote,
                    isInitiation: false
                    // isBusiness: this.isBusiness,
                };

            if (__this.isForRelease()) {
                __this.lcService.forwardLcRelease(body)
                        .subscribe((res) => {
                            __this.loadingService.hideKeyApiCall();
                            if (res.success === true) {
                                __this.customerId = null;
                                __this.selectedId = null;
                                __this.reload = 1;
                                __this.getLcIssuances();
                                __this.initializeControls();
                                __this.showLcForward = false;
                                    swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                    '<br/> ' + res.message , 'success');
                            } else {
                                __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                            }
                        }, (err) => {
                            __this.showLcForward = false;
                            __this.loadingService.hideKeyApiCall(1000);
                            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                        });
            } else if (__this.isForUssance()) {
                if(__this.isForUssanceExtension()){
                    __this.lcService.forwardLcUssanceExtension(body)
                        .subscribe((res) => {
                            __this.loadingService.hideKeyApiCall();
                            if (res.success === true) {
                                __this.customerId = null;
                                __this.selectedId = null;
                                __this.reload = 1;
                                __this.getLcIssuances();
                                __this.initializeControls();
                                __this.showLcForward = false;
                                    swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                    '<br/> ' + res.message , 'success');
                            } else {
                                __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                            }
                        }, (err) => {
                            __this.showLcForward = false;
                            __this.loadingService.hideKeyApiCall(1000);
                            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                        });
                }else{
                    __this.lcService.forwardLcUssance(body)
                        .subscribe((res) => {
                            __this.loadingService.hideKeyApiCall();
                            if (res.success === true) {
                                __this.customerId = null;
                                __this.selectedId = null;
                                __this.reload = 1;
                                __this.getLcIssuances();
                                __this.initializeControls();
                                __this.showLcForward = false;
                                    swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                    '<br/> ' + res.message , 'success');
                            } else {
                                __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                            }
                        }, (err) => {
                            __this.showLcForward = false;
                            __this.loadingService.hideKeyApiCall();
                            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                        });
                }
            } else if (__this.isForLCCancelation()) {
                body.isInitiation = true;
                __this.lcService.forwardLcCancelation(body)
                    .subscribe((res) => {
                        __this.loadingService.hideKeyApiCall();
                        if (res.success === true) {
                            __this.customerId = null;
                            __this.selectedId = null;
                            __this.reload = 1;
                            __this.getLcIssuances();
                            __this.initializeControls();
                            __this.showLcForward = false;
                            __this.router.navigate(['/credit/lc/cancelation-approval']);

                        } else {
                            __this.showLcForward = false;
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                        }
                    }, (err) => {
                        __this.showLcForward = false;
                        __this.loadingService.hideKeyApiCall(1000);
                        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    })
            } else if (__this.isForLCEnhancement()) {
                __this.lcService.forwardLcEnhancement(body)
                    .subscribe((res) => {
                        __this.loadingService.hideKeyApiCall();
                        if (res.success === true) {
                            __this.customerId = null;
                            __this.selectedId = null;
                            __this.tempLcIssuanceId = null;
                            __this.reload = 1;
                            __this.getLcIssuances();
                            __this.initializeControls();
                            __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                '<br/> ' + res.message , 'success');
                        } else {
                            __this.showLcForward = false;
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                        }
                    }, (err) => {
                        __this.showLcForward = false;
                        __this.loadingService.hideKeyApiCall(1000);
                        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    })
            } else if (__this.isForLCExtension()) {
                __this.lcService.forwardLcExtension(body)
                    .subscribe((res) => {
                        __this.loadingService.hideKeyApiCall();
                        if (res.success === true) {
                            __this.customerId = null;
                            __this.selectedId = null;
                            __this.tempLcIssuanceId = null;
                            __this.reload = 1;
                            __this.getLcIssuances();
                            __this.initializeControls();
                            __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                '<br/> ' + res.message , 'success');
                        } else {
                            __this.showLcForward = false;
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                        }
                    }, (err) => {
                        __this.showLcForward = false;
                        __this.loadingService.hideKeyApiCall(1000);
                        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    })
            } else if (!(__this.isForRelease() || __this.isForUssance() || __this.isForLCCancelation() || __this.isForLCEnhancement() || __this.isForLCExtension())) {
                __this.lcService.forwardLcIssuance(body)
                    .subscribe((res) => {
                        __this.loadingService.hideKeyApiCall();
                        if (res.success === true) {
                            __this.customerId = null;
                            __this.selectedId = null;
                            __this.reload = 1;
                            __this.getLcIssuances();
                            __this.initializeControls();
                            __this.showLcForward = false;
                                swal(`${GlobalConfig.APPLICATION_NAME}`, 
                                '<br/> ' + res.message , 'success');
                        } else {
                            __this.showLcForward = false;
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                        }
                    }, (err: any) => {
                        __this.showLcForward = false;
                        __this.loadingService.hideKeyApiCall(1000);
                        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                    })
                }
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
    }

    saveLcIssuance(form) {
        let body = {
            beneficiaryName: form.value.beneficiaryName,
            totalApprovedAmount: form.value.totalApprovedAmount,
            totalApprovedAmountCurrencyId: form.value.totalApprovedAmountCurrencyId,
            availableAmountCurrencyId: form.value.availableAmountCurrencyId,
            cashBuildUpAvailable: form.value.cashBuildUpAvailable,
            cashBuildUpReferenceType: form.value.cashBuildUpReferenceType,
            cashBuildUpReferenceNumber: form.value.cashBuildUpReferenceNumber,
            percentageToCover: form.value.percentageToCover,
            lcTolerancePercentage: form.value.lcTolerancePercentage,
            lcToleranceValue: form.value.lcToleranceValue,
            releaseAmount: form.value.releaseAmount,
            letterOfCreditTypeId: form.value.letterOfCreditTypeId,
            isDraftRequired: form.value.isDraftRequired,
            beneficiaryAddress: form.value.beneficiaryAddress,
            beneficiaryEmail: form.value.beneficiaryEmail,
            customerId: form.value.customerId,
            fundSourceId: form.value.fundSourceId,
            fundSourceDetails: form.value.fundSourceDetails,
            formMNumber: form.value.formMNumber,
            beneficiaryPhoneNumber: form.value.beneficiaryPhoneNumber,
            beneficiaryBank: form.value.beneficiaryBank,
            currencyId: form.value.currencyId,
            proformaInvoiceId: form.value.proformaInvoiceId,
            availableAmount: form.value.availableAmount,
            letterOfCreditAmount: form.value.letterOfCreditAmount,
            letterOfcreditExpirydate: form.value.letterOfcreditExpirydate,
            invoiceDate: form.value.invoiceDate,
            invoiceDueDate: form.value.invoiceDueDate,
            transactionCycle: form.value.transactionCycle,
            lcReferenceNumber: form.value.lcReferenceNumber,
            lcIssuanceId: this.selectedId
        };
        this.loadingService.show();
        if(this.isForLCEnhancement()){
            if (this.tempLcIssuanceId <= 0) {
                this.lcService.saveLcEnhancement(body).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> The record was created successfully<b>', 'success');
                        this.reloadGrid();
                        this.editLcIssuance(response.result);
                        this.tempLcIssuanceId = response.result.tempLcIssuanceId;
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                }); 
            } else {
                this.lcService.updateLcEnhancement(body, this.tempLcIssuanceId).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        this.finishGood(response.message);
                        this.reloadGrid();
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            }
        }else if(this.isForLCExtension()){
            if (this.tempLcIssuanceId <= 0) {
                this.lcService.saveLcExtension(body).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> The record was created successfully<b>', 'success');
                        this.reloadGrid();
                        this.editLcIssuance(response.result);
                        this.tempLcIssuanceId = response.result.tempLcIssuanceId;
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                }); 
            } else {
                this.lcService.updateLcExtension(body, this.tempLcIssuanceId).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        this.finishGood(response.message);
                        this.reloadGrid();
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            }
        }else{
            if (this.selectedId == null) {
                this.lcService.saveLcIssuance(body).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> The record was created successfully with Reference Number <b>' 
                        + response.result.lcReferenceNumber + '</b>', 'success');
                        this.reloadGrid();
                        this.editLcIssuance(response.result);
                        if (response.result.fundSourceId == 2) {
                            this.selectedApplicationId = response.result.fundSourceDetails;
                            this.getLoanDetails(this.selectedApplicationId);
                        }
                        this.selectedId = response.result.lcIssuanceId;
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            } else {
                this.lcService.updateLcIssuance(body, this.selectedId).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        this.finishGood(response.message);
                    this.reloadGrid();
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            }
        }
        
    }

    getLcIssuances() {
            this.lcIssuances = [];
            if (this.isForRelease()) {
                this.loadingService.show();
                this.lcService.getLcIssuancesForRelease().subscribe((response: any) => {
                        this.loadingService.hide();
                        this.lcIssuances = response.result;
                    },(err) => {
                        this.loadingService.hide(1000);
                    });
            } else if (this.isForUssance()) {
                if (this.isForUssanceExtension()){
                    this.loadingService.show();
                    this.lcService.getLcIssuancesForUssanceExtension().subscribe((response: any) => {
                        this.loadingService.hide();
                        this.lcIssuances = response.result;
                    },(err) => {
                        this.loadingService.hide(1000);
                    });
                }else{
                    this.loadingService.show();
                    this.lcService.getLcIssuancesForUssance().subscribe((response: any) => {
                        this.loadingService.hide();
                        this.lcIssuances = response.result;
                    },(err) => {
                        this.loadingService.hide(1000);
                    });
                }
            } else if (this.isForLCSearch()) {
                if(this.isForLMSSearch && (this.isLCEnhancement == true || this.isLCExtension == true)){
                    this.loadingService.show();
                    this.lcService.getLcEnhancementByLcEnhancementId(this.tempLcIssuanceId).subscribe((response: any) => {
                        this.loadingService.hide();
                        this.lcIssuances = response.result;
                    },(err) => {
                        this.loadingService.hide(1000);
                    });
                }
                // else if(this.isForLMSSearch && this.isLCExtension == true){
                //     this.lcService.getLcExtensionByLcEnhancementId(this.tempLcIssuanceId).subscribe((response: any) => {
                //         this.lcIssuances = response.result;
                //     });
                // }
                else{
                        this.loadingService.show();
                        this.lcService.getLcIssuancesByLcIssuanceId(this.lcIssuanceId).subscribe((response: any) => {
                        this.loadingService.hide();
                        this.lcIssuances = response.result;
                    },(err) => {
                        this.loadingService.hide(1000);
                    });
                }
                // this.getLcUssance(this.lcUssanceId);
            } else if (this.isForLCEnhancement()) {
                this.loadingService.show();
                this.lcService.getLcIssuancesForEnhancement().subscribe((response: any) => {
                    this.loadingService.hide();
                    this.lcIssuances = response.result;
                },(err) => {
                    this.loadingService.hide(1000);
                });
            } else if (this.isForLCExtension()) {
                this.loadingService.show();
                this.lcService.getLcIssuancesForLCExtension().subscribe((response: any) => {
                    this.loadingService.hide();
                    this.lcIssuances = response.result;
                },(err) => {
                    this.loadingService.hide(1000);
                });
            } else if ((!this.isForRelease()) && (!this.isForUssance()) && (!this.isForLCSearch()) && (!this.isForLCEnhancement()) && (!this.isForLCExtension())) {
                this.loadingService.show();
                this.lcService.getLcIssuances().subscribe((response: any) => {
                    this.loadingService.hide();
                    this.lcIssuances = response.result;
                },(err) => {
                    this.loadingService.hide(1000);
                });
            } 
    }

    deleteLcIssuance(row) {
        if(this.isForLCEnhancement()){
            this.lcService.deleteLcEnhancement(row.tempLcIssuanceId).subscribe((response: any) => {
                if (response.result == true) this.reloadGrid();
            });
        }else{
            this.lcService.deleteLcIssuance(row.lcIssuanceId).subscribe((response: any) => {
                if (response.result == true) this.reloadGrid();
            });
        }
    }

    reloadGrid() {
        this.displayLcIssuanceForm = false;
        this.getLcIssuances();
    }

    getAllExchangeRates() {
        this.exchangeServ.get().subscribe((res) => {
            this.allExchangeRates = res.result;
           // console.log('this.allExchangeRates', this.allExchangeRates);
        }, (err: HttpErrorResponse) => {
            this.showMessage(err.message, 'error', 'FintrakBanking');
        });
    }

  // ---------------------- form ----------------------

  clearControls() {
    this.selectedApplicationId = null;
    this.applicationReferenceNumber = '';
    this.formState = 'New';
      this.lcIssuanceForm = this.fb.group({
            beneficiaryName: ['', Validators.required],
            totalApprovedAmount: ['', Validators.required],
            totalApprovedAmountCurrencyId: [''],
            availableAmountCurrencyId: [''],
            availableAmountCurrencyCode: [''],
            totalApprovedAmountCurrencyCode: [''],
            lcAmtExchangeRate: [''],
            nairaEquivalent: [''],
            nairaEquivalent2: [''],
            cashBuildUpAvailable: [false],
            cashBuildUpReferenceType: [''],
            cashBuildUpReferenceNumber: [''],
            percentageToCover: [''],
            lcTolerancePercentage: [''],
            lcToleranceValue: [''],
            releaseAmount: [''],
            letterOfCreditTypeId: ['', Validators.required],
            isDraftRequired: [''],
            beneficiaryAddress: ['', Validators.required],
            beneficiaryEmail: ['', [Validators.required, Validators.email]],
            customerId: ['', Validators.required],
            fundSourceId: ['', Validators.required],
            fundSourceDetails: ['', Validators.required],
            formMNumber: ['', Validators.required],
            beneficiaryPhoneNumber: ['', Validators.required],
            beneficiaryBank: ['', Validators.required],
            currencyId: ['', Validators.required],
            proformaInvoiceId: ['', Validators.required],
            availableAmount: ['', Validators.required],
            letterOfCreditAmount: ['', Validators.required],
            letterOfcreditExpirydate: ['', Validators.required],
            invoiceDate: ['', Validators.required],
            invoiceDueDate: ['', Validators.required],
            transactionCycle: ['', Validators.required],
            lcReferenceNumber: [''],
      });
  }

  

    editLcIssuance(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.lcIssuanceId;
        this.lcIssuanceForm.setValue({
            beneficiaryName: row.beneficiaryName,
            totalApprovedAmount: row.totalApprovedAmount,
            totalApprovedAmountCurrencyId: row.totalApprovedAmountCurrencyId,
            availableAmountCurrencyId: row.availableAmountCurrencyId,
            availableAmountCurrencyCode: this.getCurrencyCode(row.availableAmountCurrencyId),
            totalApprovedAmountCurrencyCode: this.getCurrencyCode(row.totalApprovedAmountCurrencyId),
            lcAmtExchangeRate: this.getExhangeRate(row.currencyId),
            nairaEquivalent: this.getExhangeRate(row.currencyId) * row.letterOfCreditAmount,
            nairaEquivalent2: this.getExhangeRate(row.currencyId) * row.lcToleranceValue,
            cashBuildUpAvailable: row.cashBuildUpAvailable,
            cashBuildUpReferenceType: row.cashBuildUpReferenceType,
            cashBuildUpReferenceNumber: row.cashBuildUpReferenceNumber,
            percentageToCover: row.percentageToCover,
            lcTolerancePercentage: row.lcTolerancePercentage,
            lcToleranceValue: row.lcToleranceValue,
            releaseAmount: row.releaseAmount,
            letterOfCreditTypeId: row.letterOfCreditTypeId,
            isDraftRequired: row.isDraftRequired,
            beneficiaryAddress: row.beneficiaryAddress,
            beneficiaryEmail: row.beneficiaryEmail,
            customerId: row.customerId,
            fundSourceId: row.fundSourceId,
            fundSourceDetails: row.fundSourceDetails,
            formMNumber: row.formMNumber,
            beneficiaryPhoneNumber: row.beneficiaryPhoneNumber,
            beneficiaryBank: row.beneficiaryBank,
            currencyId: row.currencyId,
            proformaInvoiceId: row.proformaInvoiceId,
            availableAmount: row.availableAmount,
            letterOfCreditAmount: row.letterOfCreditAmount,
            letterOfcreditExpirydate: new Date(row.letterOfcreditExpirydate),
            invoiceDate: new Date(row.invoiceDate),
            invoiceDueDate: new Date(row.invoiceDueDate),
            transactionCycle: row.transactionCycle,
            lcReferenceNumber: row.lcReferenceNumber,
        });
        //   this.displayLcIssuanceForm = true;
    }

    showLcIssuanceForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayLcIssuanceForm = true;
    }

    initializeLCUssance() {
        if (this.isForUssance() || this.isForLCSearch()) {
            this.resetUssanceForm();
            this.tempLcUsanceId = null;
            this.oldUssanceTenor = null;
            this.oldLcMaturityDate = null;
        }
    }

    resetUssanceForm() {
        this.lcUssanceForm = this.fb.group({
            lcIssuanceId: [''],
            lcUssanceId: [''],
            ussanceAmount: ['', Validators.required],
            usanceAmountCurrencyId: ['', Validators.required],
            ussanceRate: ['', Validators.required],
            ussanceTenor: ['', Validators.required],
            lcEffectiveDate: ['', Validators.required],
            lcMaturityDate: ['', Validators.required],
        });
    }

    saveUssanceForm(form) {
        form.value.lcIssuanceId = this.selectedId;
        //console.log(form.value);
        this.loadingService.show();
        if (this.isForUssanceExtension()){
            if (!(this.tempLcUsanceId>0)) {
                //  console.log(form.value);
                    this.lcService.saveLcUssanceExtension(form.value).subscribe((response: any) => {
                        this.loadingService.hide();
                        if (response.success == true) {
                            this.finishGood(response.message);
                            this.resetUssanceForm();
                            this.getLcUssanceExtension(response.result.tempLcUsanceId);
                        }
                        else this.finishBad(response.message);
                    }, (err: any) => {
                        this.loadingService.hide();
                        this.finishBad(JSON.stringify(err));
                    });
                } else {
                    this.lcService.updateLcUssanceExtension(form.value, this.tempLcUsanceId).subscribe((response: any) => {
                        this.loadingService.hide();
                        if (response.success == true) {
                            this.finishGood(response.message);
                            this.resetUssanceForm();
                            this.getLcUssanceExtension(this.tempLcUsanceId);
                        }
                        else this.finishBad(response.message);
                    }, (err: any) => {
                        this.loadingService.hide();
                        this.finishBad(JSON.stringify(err));
                    });
                }
        }else{
            if (!(form.value.lcUssanceId>0)) {
            //  console.log(form.value);
                this.lcService.saveLcUssance(form.value).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 
                        '<br/> The LC Usance record was added successfully<b>' , 'success');
                        this.resetUssanceForm();
                        this.getLcUssance(response.result.lcUssanceId);
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            } else {
                this.lcService.updateLcUssance(form.value, form.value.lcUssanceId).subscribe((response: any) => {
                    this.loadingService.hide();
                    if (response.success == true) {
                        this.finishGood(response.message);
                    this.reloadGrid();
                    }
                    else this.finishBad(response.message);
                }, (err: any) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
            }
        }
    }

    getLcUssances(lcIssuanceId) {
        if (!(lcIssuanceId > 0)) return;
        this.loadingService.show();
        this.lcService.getLcUssancesByLcIssuanceId(lcIssuanceId).subscribe
        ((response) => {
            this.loadingService.hide();
            this.lcUsances = response.result;
                
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    onLcUsanceChange(lcUssanceId: number){
        if (lcUssanceId > 0 && this.lcUsances != null && this.lcUsances != undefined) {
            let us = this.lcUsances.find(u => u.lcUssanceId == lcUssanceId);
            this.lcUssanceId = lcUssanceId;
            this.tempLcUsanceId = 0;
            this.getLcUssanceExtensionsByLcUsanceId(lcUssanceId);
            this.editUssanceForm(us);
            // this.getLcUssance(lcUssanceId);
        }
    }

    onLcUsanceExtensionChange(tempLcUsanceId: number){
        if (tempLcUsanceId > 0 && this.lcUsances != null && this.lcUsances != undefined) {
            let us = this.lcUsanceExtensions.find(u => u.tempLcUsanceId == tempLcUsanceId);
            this.tempLcUsanceId = tempLcUsanceId;
            this.editUssanceForm(us);
            // this.getLcUssance(lcUssanceId);
        }
    }

    onReleaseChange(lcReleaseAmountId: number){
        if (lcReleaseAmountId > 0 && this.lcReleases != null && this.lcReleases != undefined) {
            let rel = this.lcReleases.find(r => r.lcReleaseAmountId == lcReleaseAmountId);
            this.lcReleaseAmountId = lcReleaseAmountId;
            this.releaseAmount = rel.releaseAmount;
        }
    }

    getLcUssance(lcUsanceId) {
        if (isNullOrUndefined(lcUsanceId) || lcUsanceId == 0) return;
        this.lcUssanceId = lcUsanceId;
        this.loadingService.show();
        this.lcService.getLcUssanceByLcUsanceId(lcUsanceId).subscribe
        ((response) => {
            this.loadingService.hide();
            this.lcUssance = response.result;
            if (this.lcUssance != null) {
                this.editUssanceForm(response.result);
            }
        if (response.result.ussanceAmount > 0 && (!this.isForUssanceExtension() && this.isForUssance())) {
            this.outstandingUsanceAmount = this.totalUsanceAmount - +response.result.ussanceAmount;
        }
        // console.log(response.result);
        // console.log('totalUsanceAmount', this.totalUsanceAmount);
        // console.log('lcSelection', this.lcSelection);
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    getLcUssanceExtension(tempLcUsanceId) {
        if (isNullOrUndefined(tempLcUsanceId) || tempLcUsanceId == 0) {
            this.getLcUssance(this.lcUssanceId);
            return;
        }
        this.tempLcUsanceId = tempLcUsanceId;
        this.loadingService.show();
        this.lcService.getLcUssanceExtensionByTempLcUsanceId(tempLcUsanceId).subscribe
        ((response) => {
            this.loadingService.hide();
            this.lcUssance = response.result;
            if (this.lcUssance != null) {
                this.editUssanceForm(response.result);
            }
        // if (response.result.ussanceAmount > 0 && !this.isForUssanceExtension()) {
        //     this.outstandingUsanceAmount = this.totalUsanceAmount - +response.result.ussanceAmount;
        // }
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    getLcUssanceExtensionsByLcUsanceId(lcUsanceId) {
        if (lcUsanceId == null || lcUsanceId == undefined || lcUsanceId == 0) return;
        this.loadingService.show();
        this.lcService.getLcUssanceExtensionsByLcUsanceId(lcUsanceId).subscribe
        ((response) => {
            this.loadingService.hide();
            this.lcUsanceExtensions = response.result;
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(err);
        });
    }

    editUssanceForm(row) {
        this.lcUssanceForm.setValue({
            lcIssuanceId: [''],
            lcUssanceId: row.lcUssanceId,
            ussanceAmount: row.ussanceAmount,
            usanceAmountCurrencyId: row.usanceAmountCurrencyId,
            ussanceRate: row.ussanceRate,
            ussanceTenor: row.ussanceTenor,
            lcEffectiveDate: new Date(row.lcEffectiveDate),
            lcMaturityDate: new Date(row.lcMaturityDate)
        });
        this.oldUssanceTenor = row.oldUssanceTenor;
        this.oldLcMaturityDate = new Date(row.oldLcMaturityDate);
    }
    
    calculateToleranceAmount(event = null) {
        let lcAmt = this.lcIssuanceForm.get('letterOfCreditAmount').value;
        // tslint:disable-next-line:radix
        lcAmt = parseInt(String(lcAmt).replace(/,/g,''));
        let percentage: number;
        if (event == null) {
            percentage = this.lcIssuanceForm.get('lcTolerancePercentage').value;
        } else {
            percentage = +event.target.value;
            //console.log(percentage);
        }
        let toleranceAmt = this.getPercentage(percentage, lcAmt) + lcAmt;
       // console.log(toleranceAmt);
        this.lcIssuanceForm.controls['lcToleranceValue'].setValue(toleranceAmt);
        this.lcAmtExchangeRate = this.lcIssuanceForm.controls['lcAmtExchangeRate'].value;
        this.nairaEquivalent2 = this.lcAmtExchangeRate * parseFloat(String(toleranceAmt).replace(/,/g,''));
        this.lcIssuanceForm.controls['nairaEquivalent2'].setValue(this.nairaEquivalent2);
    }

    getPercentage(percent: number, target: number): number {
        let percentageAmt = ((percent/100) * target);
       // console.log(percentageAmt);
        return percentageAmt;
    }

    setExchangeAmt(event) {
        let lcAmt = this.lcIssuanceForm.get('letterOfCreditAmount').value;
        lcAmt = parseFloat(String(lcAmt).replace(/,/g,''));
        this.lcAmtExchangeRate = this.lcIssuanceForm.controls['lcAmtExchangeRate'].value;
        this.nairaEquivalent = this.lcAmtExchangeRate * parseFloat(String(lcAmt).replace(/,/g,''));
        this.lcIssuanceForm.controls['nairaEquivalent'].setValue(this.nairaEquivalent);
        this.calculateToleranceAmount();
    }

    saveRelease() {
        let body = {
            lcReleaseAmountId: this.lcReleaseAmountId,
            lcIssuanceId:this.selectedId,
            releaseAmount: this.releaseAmount,
        };
        this.loadingService.show();
        if (!(this.lcReleaseAmountId > 0)) {
            this.lcService.saveReleaseAmount(body).subscribe
                ((res) => {
                    this.loadingService.hide();
                    if (res.success == true) {
                        this.finishGood(res.message);
                        this.lcReleaseAmountId = res.result.lcReleaseAmountId;
                        this.getLcIssuances();
                    } else {
                        this.finishBad(JSON.stringify(res.message));
                    }
                }, (err: HttpErrorResponse) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
        } else {
            this.lcService.UpdateReleaseAmount(body).subscribe
                ((res) => {
                    this.loadingService.hide();
                    if (res.success == true) {
                        this.finishGood(res.message);
                        this.lcReleaseAmountId = res.result.lcReleaseAmountId;
                        this.getLcIssuances();
                    } else {
                        this.finishBad(JSON.stringify(res.message));
                    }
                }, (err: HttpErrorResponse) => {
                    this.loadingService.hide();
                    this.finishBad(JSON.stringify(err));
                });
        }
    }

    setReleaseAmount() {
        this.releaseAmount = this.lcIssuanceForm.controls['releaseAmount'].value;
    }

    setoutstandingUsanceAmount(event) {
        this.lcUssanceForm.controls['ussanceAmount'].updateValueAndValidity();
        let usCurrId = this.lcUssanceForm.get('usanceAmountCurrencyId').value;
        let usAmt = 0;
        if (usCurrId > 0){
            let lcAmtExchangeRate = this.getExhangeRate(usCurrId);
            let lcAmt = this.lcUssanceForm.get('ussanceAmount').value;
            let nairaEquivalent = lcAmtExchangeRate * parseFloat(String(lcAmt).replace(/,/g,''));
            usAmt = nairaEquivalent;
        }else{
            usAmt = this.lcUssanceForm.get('ussanceAmount').value;
            usAmt = parseFloat(String(usAmt).replace(/,/g,''));
        }
        this.outstandingUsanceAmount = this.totalUsanceAmount - usAmt;
    }

    viewFAM(){
        this.displayFAM = true;
    }

    closeDocumentation() {
        this.displayFAM = false;
    }

  // ---------------------- message ----------------------

  show: boolean = false; message: any; title: any; cssClass: any;

  finishGood(message) { 
    this.showMessage(message, 'success', "FintrakBanking");
    this.loadingService.hide(); }

  hideMessage(event) { this.show = false; }

  finishBad(message) {
      this.showMessage(message, 'error', "FintrakBanking");
      this.loadingService.hide();
  }

  showMessage(message: string, cssClass: string, title: string) {
      this.message = message;
      this.title = title;
      this.cssClass = cssClass;
      this.show = true;
  }
}
