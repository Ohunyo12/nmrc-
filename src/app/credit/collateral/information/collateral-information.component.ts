import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
// import { AuthenticationService } from '../../../admin/services/authentication.service';
import { GlobalConfig, CollateralGuaranteeSubType, CollateralType } from '../../../shared/constant/app.constant';
// import { DataTableModule, SharedModule, TabViewModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';
import { ApprovalStatus } from '../../../shared/constant/app.constant';
// import { CustomerSearchComponent } from '../../../customer/components';
import { CountryStateService } from '../../../setup/services/state-country.service';
import { LedgerService } from '../../../setup/services/ledger.service';
import { CurrencyService } from '../../../setup/services/currency.service';
import { DocumentService } from '../../../setup/services/document.service';
// import { flatten } from '@angular/compiler';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { CasaService } from 'app/customer/services/casa.service';
import { isNullOrUndefined, log } from 'util';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { StaffRoleService } from 'app/setup/services';
import { MenuVisibiltyService } from 'app/shared/services/role-menu.service';
//import { jsonpFactory } from '@angular/http';
// import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
// import { log } from 'util';

@Component({
    selector: 'collateral-information',
    templateUrl: 'collateral-information.component.html'
})
export class CollateralInformationComponent implements OnInit, OnChanges {
    accountName: any;
    referenceNumberLabel: string;
    myDocExtention: any;
    pdfFileName: any;
    pdfFile: any;
    customerCode: any;
    selectedCaollateral: any = {};
    showPersonalCollateralGuaranteeTableColumn: boolean;
    showAllowedForCollateral: boolean = false;
    displayModalForm2: boolean = false;
    garanteeList: any[];
    haircut: any;
    CollateralPerfectionList: any;
    collateralSubType: any = {};
    collateralHistory: any[] = [];
    collateralUsage: any = {};
    allowedForCollateral: any;
    insurancePolicies: any[];
    transactionTypeId: any;
    disableVisitationPanel: boolean = true;
    disableDocumentPanel: boolean = true;
    enableInsuranceFormTab: boolean = true;
    enabledJoinCollaterGuarantee: boolean = false;
    personal: boolean = true;
    corporate: boolean = true;
    enabledAddGuarateeButton: boolean = true;
    isCollateralCodeVisible: boolean;
    imageData: any;
    stockPriceList: any[];
    displayFileUpload: boolean = false;
    joinGuaranteeCollateralId: any;
    lienAmount: any;
    showPhoneNumberSearch: boolean = false;
    readonly TEST_DATE = new Date('2017-10-08');

    collateralType: any;
    selectedCustomerName: string = '';
    customerCollaterals: any[];
    collateralTypes: any[] = [];
    loanApplicationCollaterals: any[] = [];
    displayModalForm: boolean = false;
    // showCollateralList: boolean = false;
    activeTabIndex: number = 0;
    selectedId: number = null;
    selectedCollateralTypeId: number = null;
    entityName: string = 'Collateral Information';
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    visitationDetail: any[];
    differInsurancePolicy: boolean = false;

    mainForm: FormGroup;
    subForm: FormGroup;

    depositForm: FormGroup;
    casaForm: FormGroup;
    stockForm: FormGroup;
    guaranteeForm: FormGroup;
    policyForm: FormGroup;
    equipmentForm: FormGroup;
    securityForm: FormGroup;
    preciousMetalForm: FormGroup;
    propertyForm: FormGroup;
    vehicleForm: FormGroup;
    miscellaneousForm: FormGroup;
    insuranceForm: FormGroup; //
    CollateralPrimaryDocumentForm: FormGroup;
    promissoryForm: FormGroup;
    ispoForm: FormGroup;
    indemnityFrom: FormGroup;
    domiciliationContract: FormGroup;
    domiciliationSalary: FormGroup;
    showDepositForm: boolean = false;
    showCasaForm: boolean = false;
    showStockForm: boolean = false;
    showGuaranteeForm: boolean = false;
    showPolicyForm: boolean = false;
    showEquipmentForm: boolean = false;
    showSecurityForm: boolean = false;
    showPreciousMetalForm: boolean = false;
    showPropertyForm: boolean = false;
    showVehicleForm: boolean = false;
    showMiscellaneousForm: boolean = false;
    showPromissoryForm: boolean = false;
    showIndemnityFrom: boolean = false;
    showDomiciliationContract: boolean = false;
    showDomiciliationSalary: boolean = false;
    showIspoForm: boolean = false;
    showInsuranceForm: boolean = false;
    @Input() showCustomerCollaterals: boolean = false;
    @Input() collateralAtAppraisal: boolean = false;
    @Input() isRegistrationDoneViaLoanApplication: number;
    @Input() isAvailment = false;
    @Input() isForSwap = false;
    @Input() hideProposeButton = false;
    @Input() selectedModule: number = 0;
    latitude: any;
    longitude: any;
    currentDate: Date;
    productDropDown: any;
    collateralCoverage: any;
    module: any;

    payload: any = {};
    defaultSubTabName: string = 'Collateral Type';
    selectedCollateralTypeName: string = this.defaultSubTabName.trim();
    disableSubFormTab: boolean = true;
    subTypes: any[];
    currencies: any[] = [];
    selectedRecord: any;
    showLocationMap: boolean = false;
    requireVisitation: boolean = false;
    requireInsurancePolicy: boolean = false;
    applicationReferenceNumber: any;

    @Input() autoMapNew: boolean = false;
    @Input() loanApplicationId: number = null;
    @Input() subBasicId: number = null;
    @Input() countryCode: string;
    @Input() applicationId: number = null;
    @Input() applicationCustomerId: number = null;
    @Input() applicationCustomerName: string;
    @Input() hideCreateButton: boolean = false;
    @Input() currencyId: any;
    @Input() canEditExternally = true;
    @Input() loadResourceByDefault = true;

    @Output() emitCollateral: EventEmitter<any> = new EventEmitter<any>();
    @Output() figures: EventEmitter<any> = new EventEmitter<any>();
    @Output() sum: EventEmitter<number> = new EventEmitter<number>();
    @Output() emitProposedCollateralDetail: EventEmitter<number> = new EventEmitter();

    collateralCode: any;
    tempCollateralId: any;
    accountBalance: any;
    states: any;
    localGovt: any;
    showInsuranceDiferCheckbox: boolean = false;
    relatedCollateralCode: any;
    enableTrusteeName: boolean = false;
    enableThirdPartyName: boolean = false;
    visitationForm: FormGroup;
    proposedCollaterals: any;
    CollateralUsageStatusEnum: any;
    collateralUsageStatus: any;
    staffRoleId: any;
    insuranceType: any;
    insuranceCompany: any;
    disableInput: boolean;
    showUploadForm: boolean = true;
    operationId: any;
    deleteLink: any;
    showNewInsuranceButton: boolean;
    InsuranceSaveButton: boolean = false;
    status: any;
    faciliies: any;
    displayPropose: boolean;
    collateralSubTypeId: any;
    collateralValue: any;
    //currencyId: any;
    customerId: any;
    @Input() loanApplicationDetailId: any;
    selectedProduct: any;
    proposedCollateral: any;
    proposedCollateralLms: any;
    hideCollateralMapLink: boolean = false;

    showValuerInfo: boolean = false;
    disableThirdPartyName: boolean = true;
    disableTrusteeName: boolean = true;

    counter: number = 0;
    valuerId: any;
    nextValuationDate: any;
    nextVisitationDate: Date;
    formState = 'New';
    @Output() proceedEvent = new EventEmitter();
    insuranceData: any;
    fetchedCollateral: any;
    showSearchCustomerDialog = false;
    collateral: any;
    displayCollateralDetails: boolean;
    currentStaffActivities: string[] = [];
    currentLoanApplicationDetailId: number;

    @Input() set reload(value: number) {
        
        if (value > 0) {
            this.loanApplicationId = value;
            this.loadCustomerCollaterals(this.applicationCustomerId);
            this.counter++;
            // console.log("API Call: " + this.counter);
        } else {
            this.refresh();
        }
    }

    @Input() set reloadCustomerCollateral(value: number) {
        if (value > 0) {
            this.loadCustomerCollaterals(this.applicationCustomerId);
            this.counter++;
            // console.log("API Call: " + this.counter);
        } else {
            this.refresh();
        }
    }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private locationService: CountryStateService,
        private ledgerService: LedgerService,
        private currencyService: CurrencyService,
        private casaSrv: CasaService,
        private camService: CreditAppraisalService,
        private staffRole: StaffRoleService,
        public menuGuardSrv: MenuVisibiltyService
    ) { }

    ngOnInit() {
        this.getUserRole();
        this.clearControls();
        this.getCurrentStaffActivities();
        

        if (this.loadResourceByDefault) {
            this.loadDropdowns();
            this.geStockPrice();
            this.disableCollateralCreationButton();
        }
        this.currentLoanApplicationDetailId = this.loanApplicationDetailId;
        this.referenceNumberLabel = "Reg/Ref Number";
        this.currentDate = new Date();
    }

    loadResourceInfo() {
        this.loadDropdowns();
        this.geStockPrice();
        this.disableCollateralCreationButton();
    }

    userisAnalyst: boolean = false;
    userIsRelationshipManager: boolean = false;
    userIsAccountOfficer: boolean = false;
    userIsUserAdmin: boolean = false;
    staffRoleRecord: any;
    userIsCreditAdmin: boolean = false;

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
            }
            if (this.staffRoleRecord.staffRoleCode == 'USER ADMIN') {
                this.userIsUserAdmin = true;
            }
            if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
                this.userIsRelationshipManager = true;
            }
            if (this.staffRoleRecord.staffRoleCode == 'CREDIT ADMIN') {
                this.userIsCreditAdmin = true;
            }

        });
    }

    getCurrentStaffActivities() {
        const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.currentStaffActivities = userInfo.activities;
    }

    isAmongActivities(activity: string): boolean {
        // activity = activity.toLowerCase();
        if (isNullOrUndefined(this.currentStaffActivities)) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
    }

    ngOnChanges() {
        if (this.subItems.isOwnerOccupied) {
            this.subItems.isResidential = false;
        }

        if (this.subItems.isResidential) {
            this.subItems.isOwnerOccupied = false;
        }
    }

    countries: any[];
    cities: any[];
    frequencyTypes: any[];
    valuers: any[];
    valueBaseTypes: any[];
    accountTypes: any[];

    closeForm() {
        this.displayModalForm = false;
        this.entityName = 'Collateral Information';
        this.selectedId = null;
        this.activeTabIndex = 0;
        this.selectedCollateralTypeId = null;
        this.defaultSubTabName = 'Collateral Type Details';
        this.selectedCollateralTypeName = this.defaultSubTabName.trim();
        this.disableSubFormTab = true;
        this.enableInsuranceFormTab = false;
        this.showInsuranceForm = false;
        this.currentHaircut = null;
        this.clearControls();
        this.hideAllSubForms();

        this.disableVisitationPanel = true;
    }

    loadDropdowns() {
        // this.locationService.getAllCities().subscribe((response) => {
        //     this.cities = response.result;
        // });
        this.getStates();

        this.locationService.getAllCountries().subscribe((response) => {
            this.countries = response.result;
        });
        this.collateralService.getCollateralSubTypes().subscribe((response) => {
            this.subTypes = response.result;
        });
        this.collateralService.getFrequencyTypes().subscribe((response) => {
            this.frequencyTypes = response.result;
        });
        this.currencyService.getAllCurrencies().subscribe((response) => {
            this.currencies = response.result;
        });
        this.collateralService.getValuers().subscribe((response) => {
            this.valuers = response.result;
        });
        this.ledgerService.get().subscribe((response) => {
            this.accountTypes = response.result;
        });
        this.collateralService.getCollateralTypeByApplication(this.loanApplicationId).subscribe((response) => {
            this.collateralTypes = response.result;

        });
        this.collateralService.getCollateralPerfectionStatus().subscribe((response) => {
            this.CollateralPerfectionList = response.result;
        });
        this.collateralService.getCollateralUSageStatus().subscribe((response) => {
            this.collateralUsageStatus = response.result;
        });
        this.collateralService.getInsuranceType().subscribe((response) => {
            this.insuranceType = response.result;
        });

        this.collateralService.getInsuranceCompany().subscribe((response) => {
            this.insuranceCompany = response.result;
        });
    }

    disableCollateralCreationButton() {
        //this.getUserRole();
        //const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        //this.staffRoleId = userInfo.staffRoleId;
        if (this.userIsAccountOfficer == false) {
            //if (this.staffRoleId != 6) {
            this.hideCreateButton = true;
        }
        if (this.userIsCreditAdmin == false) {
            // if (this.staffRoleId != 341) {
            this.hideCollateralMapLink = true;
        }
    }


    ViewMap() {
        let latitude = this.propertyForm.get('latitude').value;
        let longitude = this.propertyForm.get('longitude').value;

        //    let latitude = this.propertyForm.value.latitude;
        //    let longitude = this.propertyForm.value.longitude;
        this.transactionTypeId = null
        window.open(`#/credit/loan/map/${latitude}/${longitude}`, '_blank');
    }

    editInsurancePolicy(id) {
        var val = this.insurancePolicies.find(x => x.referenceNumber == id)
        if (val != null) {

            this.insuranceForm = this.fb.group({
                referenceNumber: [val.referenceNumber, Validators.required],
                sumInsured: [(val.sumInsured), Validators.compose([ValidationService.isNumber, Validators.required])],
                //            insuranceCompany: [val.insuranceCompany, Validators.required],
                startDate: [new Date(val.startDate), Validators.required],
                expiryDate: [new Date(val.expiryDate), Validators.required],
                // insuranceType: [val.insuranceType, Validators.required],
                inSurPremiumAmount: [val.inSurPremiumAmount, Validators.required],
                description: [val.description, Validators.required],
                premiumPercent: ['', val.premiumPercent],
                policyState: ['', Validators.required],
                previousInsurance: [val.previousInsurance, Validators.required],
                companyAddress: [val.companyAddress],
                insuranceTypeId: ['', Validators.required],
                insuranceCompanyId: [val.insuranceCompanyId, Validators.required],
                prevoiusInsuranceId: ['']
            });

        }
    }

    AddInsurancePolicy(form) {
        form.value.collateraalId = this.selectedId;

        // var val=  this.insurancePolicies.find(x=>x.referenceNumber==this.insuranceForm.value.referenceNumber).referenceNumber
        // var hasExpired =  this.insurancePolicies.find(x=>x.referenceNumber==this.insuranceForm.value.referenceNumber).hasExpired

        // if  (val==null){
        //     if(hasExpired==true){
        //     this.insuranceForm.value.collateraalId = this.selectedId;

        var __this = this;

        swal({
            title: 'Are you sure?',
            text: 'This Insurance Policy will go through approval. Are you sure you want to proceed?',
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
            __this.collateralService.addNewPolicy(form).subscribe((res) => {
                __this.loadingService.hide();

                const success = res.success;


                if (res.success == true) {
                    swal('FinTrak Credit 360', "Insurance Policy captured and await approval", 'success');
                    this.displayModalForm = false;
                } else {
                    swal('FinTrak Credit 360', "New item policy failed with : " + res.message, 'error');
                }
            }, (err) => {
                swal('FinTrak Credit 360', "New item policy failed with : " + err.message, 'error');
            })

            // this.displayModalForm = false;
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

        //     }else
        //     {
        //         this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, "Policy with this reference number exist", 'error');
        //     }
        // }else{

        //     this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, "Policy not yet expired", 'error');
        // }

    }


    hideViewMap() {
        this.showLocationMap = false;
    }

    populateValueBaseType(collateralType) {
        this.collateralService.getValueBaseTypes(collateralType).subscribe((response) => {
            this.valueBaseTypes = response.result;
        });
    }

    selectedCustomerId: number;

    getCustomerCollateral(id = 0, name = null): void {
        if (id > 0) {
            this.selectedCustomerId = id;
        }
        this.loadDropdowns();
        this.selectedCustomerName = name;
        this.loadingService.show();

        this.applicationId = this.applicationId == null ? this.loanApplicationId : this.applicationId;

        this.collateralService.getCustomerCollateral(this.selectedCustomerId, this.applicationId).subscribe((response) => {
            if ((isNullOrUndefined(this.selectedCustomerName) || this.selectedCustomerName == '') && !isNullOrUndefined(response.result) && response.result.length > 0) {
                this.selectedCustomerName = response.result[0].customerName;
            }
            this.customerCollaterals = response.result;
            this.showCustomerCollaterals = true;
            this.loadingService.hide();
            this.getProposedCustomerCollateralByCustomerId(this.selectedCustomerId);
            this.getProposedCustomerCollateralByCustomerIdLMS(this.selectedCustomerId);
            this.getMappedCollateral();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadCustomerCollaterals(customerId) {
        if (customerId != null) { this.getCustomerCollateral(this.applicationCustomerId, this.loanApplicationId); }
    }

    getProposedCustomerCollateralByCustomerId(loanApplicationId): void {
        this.collateralService.getProposedCustomerCollateralByCustomerId(this.selectedCustomerId, true).subscribe((response) => {
            this.proposedCollateral = response.result;
            this.emitProposedCollateralDetail.emit(this.proposedCollateral);
        });

    }

    getProposedCustomerCollateralByCustomerIdLMS(loanApplicationId): void {
        this.collateralService.getProposedCustomerCollateralByCustomerIdLMS(this.selectedCustomerId, true).subscribe((response) => {
            this.proposedCollateralLms = response.result;
            this.emitProposedCollateralDetail.emit(this.proposedCollateralLms);
        });

    }


    getMappedCollateral() {
        this.loanApplicationCollaterals = [];
        if (this.loanApplicationId != null) {
            this.collateralService.getLoanApplicationCollateral(this.loanApplicationId).subscribe((response) => {
                this.loanApplicationCollaterals = response.result;
                this.getMappedSum();
                this.getMappedFigures();
            });
        }
    }

    getMappedSum() {
        var x = this.loanApplicationCollaterals != null && this.loanApplicationCollaterals != undefined ? true : false;
        const total: number = x ? this.loanApplicationCollaterals.map(x => x.securityValue).reduce((a, b) => +a + +b, 0) : 0;
        this.sum.emit(total);
    }

    getMappedFigures() { // still developing
        if (this.loanApplicationCollaterals != null && this.loanApplicationCollaterals != undefined) {
            const obj: any = this.loanApplicationCollaterals.map(x => { return { amount: x.securityValue, currency: x.currencyCode } });
            this.figures.emit(obj);
        }
    }

    resetActiveTab() {
        this.activeTabIndex = 0;
        this.activeTabIndex = 0;
        this.activeTabIndex = 0;
    }

    titleCollateral: any;
    showModalForm() {
        this.titleCollateral = "Add New Collateral";
        this.InsuranceSaveButton = false;
        this.showValuerInfo = false;
        this.resetActiveTab();
        if (this.selectedCustomerId > 0) {
            this.clearControls();
            this.displayModalForm = true;
            // this.disableVisitationPanel = true;
            // this.enableInsuranceFormTab = true;

            this.IsInsurancePolicyInEditMood = false;
            this.insurancePolicies = [];

            this.enabledInputs();
            this.enableInputText();
        }
        if (this.collateralAtAppraisal) {

            this.clearControls();
            this.displayModalForm = true;

            // this.disableDocumentPanel = true;
            // this.enableInsuranceFormTab = true;

            this.IsInsurancePolicyInEditMood = false;
            this.insurancePolicies = [];

            this.enabledInputs();
        }
    }

    collateralId: any;
    collateralTypeId: any;


    editCustomerCollateral(row) {
        this.selectedRecord = row;
        this.titleCollateral = "Edit Collateral";
        this.formState = 'Edit';
        this.resetActiveTab();
        this.collateralCode = row.collateralCode;
        if (row.collateralTypeId == CollateralType.FIXED_DEPOSIT) {
            this.enabledInputs();
            this.relatedCollateralCode = row.collateralCode;
        } else {
            this.disabledInputs();
        }
        if (row.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY || row.collateralTypeId == CollateralType.VEHICLE || row.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) {
            this.disableVisitationPanel = false;
        } else {
            this.disableVisitationPanel = true;
        }
        this.selectedId = row.collateralId;
        this.mainForm = this.fb.group({
            collateralTypeId: [this.selectedRecord.collateralTypeId, Validators.required],
            collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
            collateralCode: [row.collateralCode],
            collateralValue: [row.collateralValue, Validators.required],
            isPrimaryDocument: true,
            valuationCycle: [row.valuationCycle, Validators.required],
            currencyId: [row.currencyId, Validators.required],
            haircut: [row.haircut, this.validateHaircut()],
            relatedCollateralCode: [],
            collateralSummary: [row.collateralSummary],
            validTill: [new Date(row.validTill)]
        });

        this.filteredSubTypes = this.subTypes.filter(x => x.collateralTypeId == row.collateralTypeId);
        this.getSubFormItems(row.collateralId, row.collateralTypeId);
        this.getInsurancePolicies(this.selectedId);
        // this.enableInsuranceFormTab = true;
        this.onSubTypeChange(row.collateralSubTypeId);
        this.onCollateralTypeChange(row.collateralTypeId)
        this.disableSubFormTab = false;
        this.getVisitationDetail(this.selectedId);
        this.getCollateralVisitationStatus(row.collateralTypeId);

        this.disableDocumentPanel = false;
        this.displayModalForm = true;
    }

    viewCollateralDetail(row) {
        this.currentLoanApplicationDetailId = this.loanApplicationDetailId;
        this.collateral = row;
        this.displayCollateralDetails = true;
    }

    emitCollateralDetail(row) {
        this.collateral = row;
        this.collateral.customerName = this.selectedCustomerName;
        this.emitCollateral.emit(this.collateral);
    }

    getCollateralVisitationStatus(id) {
        if (this.collateralTypes != null) {
            this.requireVisitation = this.collateralTypes.find(x => x.collateralTypeId == id).requireVisitation;
            this.requireInsurancePolicy = this.collateralTypes.find(x => x.collateralTypeId == id).requireInsurancePolicy;
        }
    }

    mapCollateral(collateralId, loanApplicationDetailId) {

        const body = {
            collateralId: collateralId,
            applicationId: this.loanApplicationId,
            loanApplicationDetailId: loanApplicationDetailId
        };
        this.loadingService.show();
        this.collateralService.mapCollateral(body).subscribe((response) => {
            this.loanApplicationCollaterals = response.result;
            this.getMappedSum();
            this.getMappedFigures();
            this.getCustomerCollateral();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    unmapCollateral(collateralId, loanApplicationDetailId) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This action cannot be reverted. Are you sure you want to unmap this collateral?",
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

            if (__this.loanApplicationId == null) { return; }
            const body = {
                collateralId: collateralId,
                applicationId: __this.loanApplicationId,
                loanApplicationDetailId: loanApplicationDetailId
            };
            __this.loadingService.show();
            __this.collateralService.unmapCollateral(body).subscribe((response) => {

                __this.getCustomerCollateral();
                __this.getMappedCollateral();
                __this.loadingService.hide();
            }, (err) => {
                __this.loadingService.hide(1000);
            });

        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    deleteProposedCollateral(loanAppCollateralId, loanApplicationDetailId) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This action cannot be reverted. Are you sure you want to delete this proposal?",
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

            const body = {
                loanApplicationDetailId: loanApplicationDetailId,
                loanAppCollateralId: loanAppCollateralId
            };
            __this.loadingService.show();
            __this.collateralService.deleteProposedCollateral(body).subscribe((response) => {
                if (response.success == true) {
                    __this.proceedEvent.emit();
                    __this.getCustomerCollateral();
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }

            }, (err) => {
                __this.loadingService.hide(1000);
                swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            });

        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });



    }


    deleteDuplicatedCollateral(collateralId) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This action cannot be reverted. Are you sure you want to delete this collateral?",
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

            const body = {
                collateralCustomerId: collateralId
            };
            __this.loadingService.show();
            __this.collateralService.deleteDuplicatedCollateral(body).subscribe((response) => {
                if (response.success == true) {
                    __this.proceedEvent.emit();
                    __this.getCustomerCollateral();
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }

            }, (err) => {
                __this.loadingService.hide(1000);
                swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            });

        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });



    }
    /*
      isMapped(collateralId: number): boolean {
    
            let data = {
                collateralId: collateralId,
                applicationId: this.applicationId
            }
            this.collateralService.isMappedCollateral(data).subscribe((response) => {
                if (response.result == true) return true;
    
                return false;
    
            }, (err) => {
                this.loadingService.hide(1000);
            });
            return false;
    
        }*/

    isMapped(collateralId: number): boolean {
        let myStatus = false;
        let data = {
            collateralId: collateralId,
            applicationId: this.applicationId
        }
        this.collateralService.isMappedCollateral(data).subscribe((response) => {
            myStatus = response.result
        }, (err) => {
            this.loadingService.hide(1000);
        });
        return myStatus;
    }


    subItems: any = {};
    data: any;
    getSubFormItems(collateralId, typeId): void {
        this.loadingService.show();
        this.collateralService.GetCollateralDetailsByCollateral(collateralId, typeId).subscribe((response) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.subItems = response.result;
                this.data = response.result;
                // this.insuranceData = response.result.insurancePolicy;
                // this.supportingDocuments = response.FileData;

                if (typeId == CollateralType.IMMOVABLE_PROPERTY) {
                    this.valuerId = response.result.valuerId;
                }
                this.editSubForm(typeId);
                this.onCollateralTypeChange(typeId);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    editSubForm(id: number): void {

        switch (+id) {
            case CollateralType.MARKETABLE_SECURITIES: this.editMarketableSecurity(); break;
            case CollateralType.IMMOVABLE_PROPERTY: this.editImmovableProperty(); break;
            case CollateralType.PLANT_AND_EQUIPMENT: this.editEquipment(); break;
            case CollateralType.POLICY: this.editPolicy(); break;
            case CollateralType.VEHICLE: this.editVehicle(); break;
            case CollateralType.PRECIOUS_METAL: this.editPreciousMetal(); break;
            case CollateralType.FIXED_DEPOSIT: this.editDeposit(); break;
            case CollateralType.CASA: this.editCasa(); break;
            case CollateralType.STOCK: this.editStock(); break;
            case CollateralType.GUARANTEE: this.editGuarantee(); break;
            case CollateralType.MISCELLANEOUS: this.editMiscellaneous(); break;
            case CollateralType.PROMISSORY: this.editPromissory(); break;
            case CollateralType.ISPO: this.editIspo(); break;
            case CollateralType.DOMICILIATIONCONTACT: this.editDomiciliationContract(); break;
            case CollateralType.DOMICILIATIONSALARY: this.editDomiciliationSalary(); break;
            case CollateralType.INDEMNITY: this.editIndemnity(); break;

            default: return;
        }
        // this.editInsurance();
        this.getSupportingDocuments();
    }


    editInsurance(row) {
        this.insuranceData = row;
        this.insuranceForm.setValue({
            referenceNumber: this.insuranceData.referenceNumber,
            sumInsured: this.insuranceData.sumInsured,
            //  insuranceCompany: [this.subItems.insuranceCompany, Validators.required],
            startDate: new Date(this.insuranceData.startDate),
            expiryDate: new Date(this.insuranceData.expiryDate),
            inSurPremiumAmount: this.insuranceData.inSurPremiumAmount,
            policyState: 0,
            insuranceCompanyId: this.insuranceData.insuranceCompanyId,
            premiumPercent: this.insuranceData.premiumPercent,
            // previousInsurance: [''],
            prevoiusInsuranceId: this.insuranceData.insuranceCompanyId,
            description: this.insuranceData.description,
            companyAddress: this.insuranceData.companyAddress,
            insuranceTypeId: this.insuranceData.insuranceTypeId,
            differInsurancePolicy: this.insuranceData.differInsurancePolicy,

        });
        // this.getInsurancePolicies(this.selectedId);
    }

    editVehicle() {
        this.vehicleForm.setValue({
            vehicleType: this.subItems.vehicleType,
            vehicleStatus: this.subItems.vehicleStatus,
            vehicleMake: this.subItems.vehicleMake,
            modelName: this.subItems.modelName,
            dateOfManufacture: new Date(this.subItems.dateOfManufacture),
            registrationNumber: this.subItems.registrationNumber,
            serialNumber: this.subItems.serialNumber,
            chasisNumber: this.subItems.chasisNumber,
            engineNumber: this.subItems.engineNumber,
            nameOfOwner: this.subItems.nameOfOwner,
            registrationCompany: this.subItems.registrationCompany,
            resaleValue: this.subItems.resaleValue,
            valuationDate: new Date(this.subItems.valuationDate),
            lastValuationAmount: this.subItems.lastValuationAmount,
            invoiceValue: this.subItems.invoiceValue,
            remark: this.subItems.remark,
            differInsurancePolicy: false
        });
        this.subForm = this.vehicleForm;
        this.showVehicleForm = true;
    }

    editPreciousMetal() {
        this.preciousMetalForm.setValue({
            metalType: this.subItems.metalType,
            preciousMetalName: this.subItems.preciousMetalName,
            weightInGrammes: this.subItems.weightInGrammes,
            metalValuationAmount: this.subItems.metalValuationAmount,
            metalUnitRate: this.subItems.metalUnitRate,
            preciousMetalFrm: this.subItems.preciousMetalFrm,
            remark: this.subItems.remark,
            differInsurancePolicy: false
        });
        this.subForm = this.preciousMetalForm;
        this.showPreciousMetalForm = true;
    }


    editMarketableSecurity() {
        this.securityForm.setValue({
            securityType: this.subItems.securityType,
            effectiveDate: new Date(this.subItems.effectiveDate),
            maturityDate: new Date(this.subItems.maturityDate),
            dealAmount: this.subItems.dealAmount,
            securityValue: this.subItems.securityValue,
            lienUsableAmount: this.subItems.lienUsableAmount,
            issuerName: this.subItems.issuerName,
            issuerReferenceNumber: this.subItems.issuerReferenceNumber,
            unitValue: this.subItems.unitValue,
            numberOfUnits: this.subItems.numberOfUnits,
            rating: this.subItems.rating,
            interestPaymentFrequency: this.subItems.interestPaymentFrequency,
            fundName: this.subItems.fundName,
            remark: this.subItems.remark,
            bank: this.subItems.bank,
            differInsurancePolicy: false
        });
        this.subForm = this.securityForm;
        this.showSecurityForm = true;
    }

    editPolicy() {
        this.policyForm.setValue({
            insurancePolicyNumber: this.subItems.insurancePolicyNumber,
            premiumAmount: this.subItems.premiumAmount,
            policyAmount: this.subItems.policyAmount,
            insuranceCompanyName: this.subItems.insuranceCompanyName,
            insurerAddress: this.subItems.insurerAddress,
            policyStartDate: new Date(this.subItems.policyStartDate),
            assignDate: new Date(this.subItems.assignDate),
            renewalFrequencyTypeId: this.subItems.renewalFrequencyTypeId,
            insurerDetails: this.subItems.insurerDetails,
            policyRenewalDate: new Date(this.subItems.policyRenewalDate),
            policyinsuranceType: this.subItems.policyinsuranceType,
            remark: this.subItems.remark
        });
        this.subForm = this.policyForm;
        this.showPolicyForm = true;
    }

    editImmovableProperty() {
        this.getCityByLocalGovt(this.subItems.localGovernmentId);
        // this.getCityByLocalGovt(this.subItems.localGovernmentId);
        this.getLocalGovtById(this.subItems.stateId);
        this.propertyForm.setValue({
            propertyName: this.subItems.propertyName,
            cityId: this.subItems.cityId,
            countryId: this.subItems.countryId,
            constructionDate: new Date(this.subItems.constructionDate),
            propertyAddress: this.subItems.propertyAddress,
            dateOfAcquisition: new Date(this.subItems.dateOfAcquisition),
            lastValuationDate: new Date(this.subItems.lastValuationDate),
            nextValuationDate: new Date(),
            valuerId: this.subItems.valuerId,
            valuerReferenceNumber: this.subItems.valuerReferenceNumber,
            propertyValueBaseTypeId: this.subItems.propertyValueBaseTypeId,
            openMarketValue: this.subItems.openMarketValue,
            forcedSaleValue: this.subItems.forcedSaleValue,
            stampToCover: this.subItems.stampToCover,
            valuationAmount: this.subItems.valuationAmount,
            securityValue: this.subItems.securityValue,
            //    securityValue: [this.subItems.securityValue, Validators.compose([ValidationService.isNumber])],
            estimatedValue: this.subItems.estimatedValue,
            isOwnerOccupied: this.subItems.isOwnerOccupied,
            isResidential: this.subItems.isResidential,
            perfectionStatusId: this.subItems.perfectionStatusId,
            perfectionStatusReason: this.subItems.perfectionStatusReason,
            latitude: this.subItems.latitude,
            longitude: this.subItems.longitude,
            remark: this.subItems.remark,
            isAssetPledgedByThirdParty: this.subItems.isAssetPledgedByThirdParty,
            thirdPartyName: this.subItems.thirdPartyName,
            // isAssetManagedByTrustee: [this.subItems.isAssetManagedByTrustee],
            isAssetManagedByTrustee: this.subItems.isAssetManagedByTrustee,
            trusteeName: this.subItems.trusteeName,
            stateId: this.subItems.stateId,
            localGovernmentId: this.subItems.localGovernmentId,
            bankShareOfCollateral: this.subItems.bankShareOfCollateral,
            differInsurancePolicy: false,

            //description: this.subItems.description,
            //valuationDate: this.subItems.valuationDate,
            //lastValuationAmount: this.subItems.lastValuationAmount,
            //referenceNumber: this.subItems.referenceNumber,
            //marketPrice: this.subItems.marketPrice,

            valuerName: this.subItems.valuerName,
            valuerAccountNumber: this.subItems.valuerAccountNumber,
        });
        this.subForm = this.propertyForm;
        this.showPropertyForm = true;
        var test = this.subItems.valuerId;
        //this.onSelectValuerChange(this.propertyForm.controls['valuerId'].value);
        this.onSelectValuerChange(this.subItems.valuerId);
        this.calculateLastValuationDate(this.subItems.lastValuationDate);
        this.calculateLastVisitationDate(this.lastVisitaionDate);
        //console.log("ValuerID1: ", test);
    }

    onSelectValuerChange(value) {
        // console.log("ValuerID: ", value);

        if (value == 72) {
            this.showValuerInfo = true;
        }
        else {
            this.showValuerInfo = false;
        }
    }

    // editImmovableProperty2() {

    //     // console.log('this.subItems', this.subItems);

    //     this.propertyForm.setValue({
    //         propertyName: this.subItems.propertyName,
    //         cityId: this.subItems.cityId,
    //         countryId: this.subItems.countryId,
    //         constructionDate: new Date(this.subItems.constructionDate),
    //         propertyAddress: this.subItems.propertyAddress,
    //         dateOfAcquisition: new Date(this.subItems.dateOfAcquisition),
    //         lastValuationDate: new Date(this.subItems.lastValuationDate),
    //         nextValuationDate: new Date(),
    //         valuerId: this.subItems.valuerId,
    //         valuerReferenceNumber: this.subItems.valuerReferenceNumber,
    //         propertyValueBaseTypeId: this.subItems.propertyValueBaseTypeId,
    //         openMarketValue: this.subItems.openMarketValue,
    //         forcedSaleValue: this.subItems.forcedSaleValue,
    //         //    openMarketValue: [(this.subItems.openMarketValue), Validators.compose([ValidationService.isNumber])],
    //         //    forcedSaleValue: [(this.subItems.forcedSaleValue), Validators.compose([ValidationService.isNumber])],
    //         stampToCover: this.subItems.stampToCover,
    //         valuationAmount: this.subItems.valuationAmount,
    //         securityValue: this.subItems.securityValue,
    //         //    securityValue: [this.subItems.securityValue, Validators.compose([ValidationService.isNumber])],
    //         estimatedValue: this.subItems.estimatedValue,
    //         isOwnerOccupied: this.subItems.isOwnerOccupied,
    //         isResidential: this.subItems.isResidential,
    //         perfectionStatusId: this.subItems.perfectionStatusId,
    //         perfectionStatusReason: this.subItems.perfectionStatusReason,
    //         latitude: this.subItems.latitude,
    //         longitude: this.subItems.longitude,
    //         remark: this.subItems.remark,
    //         isAssetPledgedByThirdParty: this.subItems.isAssetPledgedByThirdParty,
    //         thirdPartyName: this.subItems.thirdPartyName,
    //         isAssetManagedByTrustee: this.subItems.isAssetManagedByTrustee,
    //         trusteeName: this.subItems.trusteeName,
    //         stateId: this.subItems.stateId,
    //         localGovernmentId: this.subItems.localGovernmentId,
    //         bankShareOfCollateral: this.subItems.bankShareOfCollateral,
    //         differInsurancePolicy: true,

    //         //description: this.subItems.description,
    //         //valuationDate: this.subItems.valuationDate,
    //         //lastValuationAmount: this.subItems.lastValuationAmount,
    //         //referenceNumber: this.subItems.referenceNumber,
    //         //marketPrice: this.subItems.marketPrice,

    //         valuerName: this.subItems.valuerName,
    //         valuerAccountNumber: this.subItems.valuerAccountNumber,
    //     });
    //     this.subForm = this.propertyForm;
    //     this.onSelectValuerChange(this.subItems.valuerId);
    // }

    closeMapview(evt) {
        if (evt)
            this.showLocationMap = false;
        this.showPropertyForm = true;
    }

    editCasa() {  //
        this.casaForm.setValue({
            accountNumber: this.subItems.accountNumber,
            availableBalance: this.subItems.availableBalance,
            accountName: this.subItems.accountName,
            lienAmount: this.subItems.lienAmount,
            securityValue: this.subItems.securityValue,
            remark: this.subItems.remark,
            differInsurancePolicy: false
        });
        this.subForm = this.casaForm;
        this.showCasaForm = true;


    }

    editStock() {
        this.stockForm.setValue({
            companyName: this.subItems.companyName,
            shareQuantity: this.subItems.shareQuantity,
            marketPrice: this.subItems.marketPrice,
            amount: this.subItems.amount,
            sharesSecurityValue: this.subItems.sharesSecurityValue,
            shareValueAmountToUse: this.subItems.shareValueAmountToUse,
            stockId: this.subItems.shareValueAmountToUse,
            differInsurancePolicy: false

        });
        this.subForm = this.stockForm;
        this.showStockForm = true;
    }

    editIspo() {
        this.ispoForm.setValue({
            description: this.subItems.description,
            accountNameToDebit: this.subItems.accountNameToDebit,
            accountNumberToDebit: this.subItems.accountNumberToDebit,
            renewalFrequencyTypeId: this.subItems.renewalFrequencyTypeId,
            // securityValue:['', Validators.required],
            regularPaymentAmount: this.subItems.regularPaymentAmount,
            payer: this.subItems.payer,
            remark: this.subItems.remark,
            differInsurancePolicy: false
        });
        this.subForm = this.ispoForm;
        this.showIspoForm = true;
    }

    editDomiciliationContract() {
        this.domiciliationContract.setValue({
            description: this.subItems.description,
            contractDetail: this.subItems.contractDetail,
            contractEmployer: this.subItems.contractEmployer,
            contractValue: this.subItems.contractValue,
            outstandingInvoiceAmount: this.subItems.outstandingInvoiceAmount,
            accountNameToDebit: this.subItems.accountNameToDebit,
            payer: this.subItems.payer,
            accountNumberToDebit: this.subItems.accountNumberToDebit,
            regularPaymentAmount: this.subItems.regularPaymentAmount,
            renewalFrequencyTypeId: this.subItems.renewalFrequencyTypeId,
            // securityValue:['', Validators.required],
            remark: this.subItems.remark,
            invoiceNumber: this.subItems.invoiceNumber,
            invoiceDate: new Date(this.subItems.invoiceDate),
            differInsurancePolicy: false
        });
        this.subForm = this.domiciliationContract;
        this.showDomiciliationContract = true;
    }

    editDomiciliationSalary() {
        this.domiciliationSalary.setValue({
            description: this.subItems.description,

            monthlySalary: this.subItems.monthlySalary,
            annualAllowances: this.subItems.annualAllowances,
            annualEmolument: this.subItems.annualEmolument,
            accountNumber: this.subItems.accountNumber,
            annualSalary: this.subItems.annualSalary,
            contractEmployer: this.subItems.contractEmployer,
            remark: this.subItems.remark,
            differInsurancePolicy: false
        });
        this.subForm = this.domiciliationSalary;
        this.showDomiciliationSalary = true;
    }


    editIndemnity() {
        this.indemnityFrom.setValue({
            description: this.subItems.description,
            securityValue: this.subItems.securityValue,
            remark: this.subItems.remark,
            address: this.subItems.address,
            bvn: this.subItems.bvn,
            emailAddress: this.subItems.emailAddress,
            endDate: new Date(this.subItems.endDate),
            cStartDate: new Date(this.subItems.cStartDate),
            firstName: this.subItems.firstName,
            middleName: this.subItems.middleName,
            lastName: this.subItems.lastName,
            phoneNumber1: this.subItems.phoneNumber1,
            phoneNumber2: this.subItems.phoneNumber2,
            relationshipDuration: this.subItems.relationshipDuration,
            relationship: this.subItems.relationship,
            taxNumber: this.subItems.taxNumber,
            differInsurancePolicy: false
        });
        this.subForm = this.indemnityFrom;
        this.showIndemnityFrom = true;
    }


    editDeposit() {
        this.depositForm.setValue({
            lienAmount: this.subItems.lienAmount,
            availableBalance: this.subItems.availableBalance,
            securityValue: this.subItems.securityValue,
            maturityDate: new Date(this.subItems.maturityDate),
            effectiveDate: new Date(this.subItems.effectiveDate),
            bank: this.subItems.bank,
            remark: this.subItems.remark,
            accountName: this.subItems.accountName,
            accountNumber: this.subItems.accountNumber,
            differInsurancePolicy: false
        });
        this.subForm = this.depositForm;
        this.showDepositForm = true;


    }

    editEquipment() {
        this.equipmentForm.setValue({
            machineName: this.subItems.machineName,
            //  machineType: [this.subItems.machineType, Validators.required],
            machineType: this.subItems.machineType,
            remark: this.subItems.remark,
            machineNumber: this.subItems.machineNumber,
            manufacturerName: this.subItems.manufacturerName,
            yearOfManufacture: this.subItems.yearOfManufacture,
            yearOfPurchase: this.subItems.yearOfPurchase,
            valueBaseTypeId: this.subItems.valueBaseTypeId,
            machineCondition: this.subItems.machineCondition,
            machineryLocation: this.subItems.machineryLocation,
            replacementValue: this.subItems.replacementValue,
            equipmentSize: this.subItems.equipmentSize,
            intendedUse: this.subItems.intendedUse,
            description: this.subItems.description,
            differInsurancePolicy: false
        });
        this.subForm = this.equipmentForm;
        this.showEquipmentForm = true;
    }

    editGuarantee() {

        this.guaranteeForm.setValue({
            //collateralSubTypeId: this.subItems.collateralSubTypeId,
            institutionName: this.subItems.institutionName,
            guarantorAddress: this.subItems.guarantorAddress,
            guaranteeValue: this.subItems.guaranteeValue,
            endDate: new Date(this.subItems.endDate),
            remark: this.subItems.remark,
            firstName: this.subItems.firstName,
            middleName: this.subItems.middleName,
            lastName: this.subItems.lastName,
            taxNumber: this.subItems.taxNumber,
            bvn: this.subItems.bvn,
            rcNumber: this.subItems.rcNumber,
            phoneNumber1: this.subItems.phoneNumber1,
            phoneNumber2: this.subItems.phoneNumber2,
            emailAddress: this.subItems.emailAddress,
            relationship: this.subItems.relationship,
            relationshipDuration: this.subItems.relationshipDuration,
            cStartDate: new Date(this.subItems.cStartDate),
            differInsurancePolicy: false,
            age: this.subItems.age,
        });
        this.subForm = this.guaranteeForm;
        this.showGuaranteeForm = true;
    }

    editPromissory() {

        this.promissoryForm.setValue({
            promissoryEffectiveDate: new Date(this.subItems.promissoryEffectiveDate),
            promissoryMaturityDate: new Date(this.subItems.promissoryMaturityDate),
            promissoryNoteRefferenceNumber: this.subItems.promissoryNoteRefferenceNumber,
            differInsurancePolicy: true
        });
        this.subForm = this.promissoryForm;
        this.showPromissoryForm = true;
    }

    editMiscellaneous() {
        this.miscellaneousForm.setValue({
            securityName: this.subItems.securityName,
            securityValue: this.subItems.securityValue,
            note: this.subItems.note,
            notes: this.fb.array([])
        });
        this.subForm = this.miscellaneousForm;
        this.showMiscellaneousForm = true;
        this.addNoteFields(this.subItems.notes);
    }


    accountNumberControl() {
        this.mainForm = this.fb.group({
            collateralCode: ['', Validators.required]
        });
    }

    clearControls() {
        this.selectedId = null;
        this.createNewFieldLabelForm();
        this.mainForm = this.fb.group({
            collateralTypeId: ['', Validators.required],
            collateralSubTypeId: ['', Validators.required],
            collateralCode: [''],
            //collateralCode: ['', Validators.required],
            collateralValue: ['', Validators.required],
            valuationCycle: '',
            currencyId: ['1', Validators.required],
            haircut: '',
            relatedCollateralCode: [],
            collateralSummary: ['', Validators.required],
            validTill: ['']

        });
        // subforms
        this.subForm = this.fb.group({});
        this.insuranceForm = this.fb.group({});

        this.securityForm = this.fb.group({
            securityType: ['', Validators.required],
            rating: ['', Validators.required],
            //dealReferenceNumber: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            dealAmount: ['', Validators.required],
            securityValue: ['', Validators.required],
            lienUsableAmount: ['', Validators.required],
            issuerName: ['', Validators.required],
            issuerReferenceNumber: ['', Validators.required],
            unitValue: ['', Validators.required],
            numberOfUnits: ['', Validators.required],
            //  percentageInterest: ['', Validators.required],
            interestPaymentFrequency: ['', Validators.required],
            fundName: ['', Validators.required],
            remark: [''],
            bank: ['', Validators.required],
            differInsurancePolicy: false
        });
        this.depositForm = this.fb.group({
            //dealReferenceNumber: [''],
            accountNumber: ['', Validators.required],
            accountName: [''],
            lienAmount: ['', Validators.required],
            availableBalance: [''],
            securityValue: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            bank: ['', Validators.required],
            remark: [''],
            differInsurancePolicy: false
        });
        this.casaForm = this.fb.group({
            //accountNumber: [''],
            accountNumber: ['', Validators.required],
            // isOwnedByCustomer: [false],
            // cashTypeId: ['', Validators.required],
            availableBalance: [''],
            accountName: [''],
            lienAmount: ['', Validators.required],
            securityValue: ['', Validators.required],
            remark: ['', Validators.required],
            differInsurancePolicy: false
        });

        this.visitationForm = this.fb.group({
            lastVisitaionDate: [''],
            //   collateralCustomerId: [''],
            visitationRemark: [''],
            visitationDocument: [''],
            nextVisitationDate: ['']
        });

        this.stockForm = this.fb.group({
            //  companyName: ['', Validators.required],
            shareQuantity: ['', Validators.required],
            marketPrice: ['', Validators.required],
            amount: ['', Validators.required],
            sharesSecurityValue: ['', Validators.required],
            shareValueAmountToUse: ['', Validators.required],
            stockId: ['', Validators.required],
            differInsurancePolicy: false
        });
        this.guaranteeForm = this.fb.group({
            institutionName: ['', Validators.required],
            guarantorAddress: ['', Validators.required],
            //   guarantorReferenceNumber: [''],
            guaranteeValue: ['', Validators.required],
            //  startDate: ['',Validators.required],
            endDate: ['', Validators.required],
            // isOwnedByCustomer: [false],
            remark: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            taxNumber: ['', Validators.required],
            bvn: ['', Validators.required],
            rcNumber: ['', Validators.required],
            phoneNumber1: ['', Validators.required],
            phoneNumber2: ['', Validators.required],
            emailAddress: ['', Validators.email],
            relationship: ['', Validators.required],
            relationshipDuration: ['', Validators.required],
            cStartDate: ['', Validators.required],
            differInsurancePolicy: false,
            age: ['', Validators.required],
        });
        this.policyForm = this.fb.group({
            //  isOwnedByCustomer: [''],
            insurancePolicyNumber: ['', Validators.required],
            premiumAmount: ['', Validators.required],
            policyAmount: ['', Validators.required],
            insuranceCompanyName: ['', Validators.required],
            insurerAddress: ['', Validators.required],
            policyStartDate: ['', Validators.required],
            assignDate: ['', Validators.required],
            renewalFrequencyTypeId: ['', Validators.required],
            insurerDetails: ['', Validators.required],
            policyRenewalDate: ['', Validators.required],
            remark: [''],
            policyinsuranceType: ['', Validators.required],
            differInsurancePolicy: false,


        });
        this.promissoryForm = this.fb.group({
            //  isOwnedByCustomer: [''],
            promissoryEffectiveDate: ['', Validators.required],
            promissoryMaturityDate: ['', Validators.required],
            // promissoryValue: ['', Validators.required],
            promissoryNoteRefferenceNumber: ['', Validators.required],
            differInsurancePolicy: false
        });

        this.equipmentForm = this.fb.group({
            machineName: ['', Validators.required],
            machineType: [''],
            remark: [''],
            machineNumber: ['', Validators.required],
            manufacturerName: ['', Validators.required],
            yearOfManufacture: ['', Validators.required],
            yearOfPurchase: ['', Validators.required],
            valueBaseTypeId: ['', Validators.required],
            machineCondition: ['', Validators.required],
            machineryLocation: ['', Validators.required],
            replacementValue: ['', Validators.required],
            equipmentSize: ['', Validators.required],
            intendedUse: ['', Validators.required],
            description: [''],
            differInsurancePolicy: false
        });
        this.preciousMetalForm = this.fb.group({
            //   isOwnedByCustomer: ['', Validators.required],
            metalType: ['', Validators.required],
            preciousMetalName: ['', Validators.required],
            weightInGrammes: ['', Validators.required],
            metalValuationAmount: ['', Validators.required],
            metalUnitRate: ['', Validators.required],
            preciousMetalFrm: ['', Validators.required],
            remark: [''],
            differInsurancePolicy: false
        });
        this.propertyForm = this.fb.group({ // COUNTRY--STATE--CITY
            propertyName: ['', Validators.required],
            cityId: ['1', Validators.required],
            countryId: ['1', Validators.required],
            constructionDate: ['', Validators.required],
            propertyAddress: ['', Validators.required],
            dateOfAcquisition: ['', Validators.required],
            lastValuationDate: ['', Validators.required],
            nextValuationDate: [''],
            valuerId: ['0', Validators.required],
            valuerReferenceNumber: ['', Validators.required],
            propertyValueBaseTypeId: ['', Validators.required],
            openMarketValue: ['', Validators.required],
            valuationAmount: ['', Validators.required],
            // collateralValue: ['', Validators.required], // OUT
            forcedSaleValue: ['', Validators.required],
            stampToCover: ['', Validators.required],
            // valuationSource: ['', Validators.required],
            isOwnerOccupied: [false],
            isResidential: [false],
            securityValue: ['', Validators.required],
            perfectionStatusId: ['', Validators.required],
            perfectionStatusReason: [''],
            latitude: [''],
            longitude: [''],
            remark: [''],
            isAssetPledgedByThirdParty: [false],
            thirdPartyName: [''],
            isAssetManagedByTrustee: [false],
            trusteeName: [''],
            stateId: [''],
            localGovernmentId: [''],
            bankShareOfCollateral: [''],
            differInsurancePolicy: false,
            estimatedValue: ['', Validators.required],

            valuerName: [''],
            valuerAccountNumber: ['']
            // remark: ['OK'],
        });
        this.vehicleForm = this.fb.group({
            vehicleType: ['', Validators.required],
            vehicleStatus: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            modelName: ['', Validators.required],
            dateOfManufacture: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            serialNumber: ['', Validators.required],
            chasisNumber: ['', Validators.required],
            engineNumber: ['', Validators.required],
            nameOfOwner: ['', Validators.required],
            registrationCompany: ['', Validators.required],
            resaleValue: ['', Validators.required],
            valuationDate: ['', Validators.required],
            lastValuationAmount: ['', Validators.required],
            invoiceValue: ['', Validators.required],
            remark: [''],
            differInsurancePolicy: false
        });
        this.miscellaneousForm = this.fb.group({
            securityName: ['', Validators.required],
            securityValue: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            note: ['', Validators.required],
            notes: this.fb.array([]),
        });
        this.insuranceForm = this.fb.group({
            referenceNumber: [''],
            sumInsured: ['', Validators.compose([ValidationService.isNumber])],
            startDate: [''],
            expiryDate: [''],
            // insuranceType: ['', Validators.required],
            differInsurancePolicy: false,
            inSurPremiumAmount: [''],
            description: [''],
            premiumPercent: [''],
            policyState: [''],
            companyAddress: [''],
            insuranceTypeId: [''],
            insuranceCompanyId: [''],
            prevoiusInsuranceId: [[0]]
        });


        this.CollateralPrimaryDocumentForm = this.fb.group({
            collateralPrimaryDocumentTitle: ['', Validators.required],
            documentTypeId: ['', Validators.required],
            collateralPrimaryDocument: [''],
            isPrimaryDocument: [false, Validators.required],

        });

        this.indemnityFrom = this.fb.group({
            description: ['', Validators.required],
            // collateralId: [],
            // collateralIndemnityId: [],
            securityValue: ['', Validators.required],
            remark: ['', Validators.required],
            address: ['', Validators.required],
            bvn: ['', Validators.required],
            emailAddress: ['', Validators.required],
            endDate: ['', Validators.required],
            cStartDate: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: [],
            lastName: ['', Validators.required],
            phoneNumber1: ['', Validators.required],
            phoneNumber2: [],
            relationshipDuration: ['', Validators.required],
            relationship: ['', Validators.required],
            taxNumber: ['', Validators.required],
            differInsurancePolicy: false
        });

        this.domiciliationContract = this.fb.group({
            // collateralId: [],
            // collateralDomiciliationId: [],
            description: ['', Validators.required],
            contractDetail: ['', Validators.required],
            contractEmployer: ['', Validators.required],
            contractValue: ['', Validators.required],
            outstandingInvoiceAmount: ['', Validators.required],
            accountNameToDebit: ['', Validators.required],
            accountNumberToDebit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(10)]],
            payer: ['', Validators.required],
            regularPaymentAmount: ['', Validators.required],
            renewalFrequencyTypeId: ['', Validators.required],
            invoiceNumber: ['', Validators.required],
            //securityValue:['', Validators.required],
            remark: ['', Validators.required],
            invoiceDate: ['', Validators.required],
            differInsurancePolicy: false
        });

        this.domiciliationSalary = this.fb.group({
            // collateralId: [],
            // collateralDomiciliationId: [],
            description: ['', Validators.required],

            monthlySalary: ['', Validators.required],
            annualAllowances: ['', Validators.required],
            annualEmolument: ['', Validators.required],
            accountNumber: ['', Validators.required],
            annualSalary: ['', Validators.required],
            contractEmployer: ['', Validators.required],
            remark: ['', Validators.required],
            differInsurancePolicy: false
        });

        this.ispoForm = this.fb.group({
            // collateralISPOId: [],
            // collateralId: [],
            description: ['', Validators.required],
            accountNameToDebit: ['', Validators.required],
            accountNumberToDebit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(10), Validators.maxLength(10)]],
            renewalFrequencyTypeId: ['', Validators.required],
            // securityValue:['', Validators.required],
            regularPaymentAmount: ['', Validators.required],
            payer: ['', Validators.required],
            remark: ['', Validators.required],
            differInsurancePolicy: true
        });


    }
    /*
    ADD ERRORS
        immovable properties -- check constraint
        guarantee ------------- institution name requred
    
    */

    convertToNumber(pamount) {

        if (typeof (pamount) == "string") {
            return pamount = pamount.replace(/[^0-9-.]/g, '');
        } else if (typeof (pamount) == "number") {
            return pamount = pamount;
        }

    }

    currentHaircut?: number = null;

    onSubTypeChange(id) {
        this.enabledJoinCollaterGuarantee = false;
        this.collateralService.getCollateralSubTypesById(id).subscribe((response) => {
            this.collateralSubType = response.result;

            this.haircut = this.collateralSubType.haircut;
            this.mainForm.patchValue({
                'haircut': this.collateralSubType.haircut,
                'valuationCycle': this.collateralSubType.revaluationDuration,
                // 'isLocationBased':this.collateralSubType.isLocationBased,
                // 'allowSharing':this.collateralSubType.allowSharing
            });
            if (id == CollateralGuaranteeSubType.PERSONAL_GUARANTEE) {
                this.personal = false;
                this.corporate = true;
                this.guaranteeForm.controls['institutionName'].setValue("nil");
                this.guaranteeForm.controls['rcNumber'].setValue("nil");
                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = false;
                this.garanteeList = [];

            } else if (id == CollateralGuaranteeSubType.JOIN_GUARANTEE_PERSONAL) {
                this.personal = false;
                this.corporate = true;
                this.guaranteeForm.controls['institutionName'].setValue("nil");
                this.guaranteeForm.controls['rcNumber'].setValue("nil");
                this.enabledAddGuarateeButton = false;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = true;
            } else if (id == CollateralGuaranteeSubType.CORPORATE_GUARANTEE) {
                this.personal = true;
                this.guaranteeForm.controls['age'].setValue(0);
                this.guaranteeForm.controls['firstName'].setValue("nil");
                this.guaranteeForm.controls['middleName'].setValue("nil");;
                this.guaranteeForm.controls['lastName'].setValue("nil");
                this.guaranteeForm.controls['bvn'].setValue("nil");

                this.corporate = false;
                this.guaranteeForm.controls['institutionName'].setValue("");
                this.guaranteeForm.controls['rcNumber'].setValue("");

                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = false;
                this.garanteeList = [];
            } else if (id == CollateralGuaranteeSubType.CROSS_GUARANTEE) {
                this.personal = true;
                this.guaranteeForm.controls['age'].setValue(0);
                this.guaranteeForm.controls['firstName'].setValue("nil");
                this.guaranteeForm.controls['middleName'].setValue("nil");;
                this.guaranteeForm.controls['lastName'].setValue("nil");
                this.guaranteeForm.controls['bvn'].setValue("nil");
                this.corporate = false;
                this.guaranteeForm.controls['institutionName'].setValue("");
                this.guaranteeForm.controls['rcNumber'].setValue("");
                this.enabledAddGuarateeButton = false;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = false;
            } else if (id == CollateralGuaranteeSubType.JOIN_GUARANTEE_CORPORATE) {
                this.personal = true;
                this.guaranteeForm.controls['age'].setValue(0);
                this.guaranteeForm.controls['firstName'].setValue("nil");
                this.guaranteeForm.controls['middleName'].setValue("nil");;
                this.guaranteeForm.controls['lastName'].setValue("nil");
                this.guaranteeForm.controls['bvn'].setValue("nil");
                this.corporate = false;
                this.guaranteeForm.controls['institutionName'].setValue("");
                this.guaranteeForm.controls['rcNumber'].setValue("");
                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = false;
            }

            this.getOutstandingBalanceForFixedDepositOrCASA();

        }, (err) => {

        });

    }

    isResidentialChanged($event) {
        this.propertyForm.patchValue({ isOwnerOccupied: false })
    }

    isOwnerOccupiedChanged($event) {
        this.propertyForm.patchValue({ isResidential: false })
    }

    calculateStockPrice() {
        let marketPrice = this.stockForm.get('marketPrice').value;
        let shareQuantity = this.stockForm.get('shareQuantity').value;

        if (marketPrice != null || shareQuantity != null) {
            let totalAmount = marketPrice * shareQuantity;
            this.stockForm.controls['amount'].setValue(totalAmount);
        }
    }

    //-------  CALL getLientAmountForFD OR getLientAmountForCASA
    getOutstandingBalanceForFixedDepositOrCASA() {
        let collateralValue = this.mainForm.get('collateralValue').value;
        let haircut = this.convertToNumber(this.haircut);
        let collateralVal = this.convertToNumber(collateralValue);

        let collateraalId = this.mainForm.get('collateralTypeId').value;

        if (haircut !== null && collateralVal !== null) {
            let secVal = (+collateralVal - ((+haircut / 100) * +collateralVal));

            switch (+collateraalId) {
                case CollateralType.MARKETABLE_SECURITIES:
                    this.securityForm.controls['securityValue'].setValue(secVal);
                    break;
                case CollateralType.IMMOVABLE_PROPERTY:
                    this.propertyForm.controls['securityValue'].setValue(secVal);
                    break;
                case CollateralType.PLANT_AND_EQUIPMENT:
                    break;
                case CollateralType.POLICY:
                    this.policyForm.controls['policyAmount'].setValue(secVal);
                    break;
                case CollateralType.VEHICLE:
                    break;
                case CollateralType.PRECIOUS_METAL:
                    break;
                case CollateralType.FIXED_DEPOSIT:
                    this.depositForm.controls['securityValue'].setValue(secVal);
                    break;
                case CollateralType.CASA:
                    this.casaForm.controls['securityValue'].setValue(secVal);
                    break;
                case CollateralType.STOCK:
                    this.stockForm.controls['sharesSecurityValue'].setValue(secVal);
                    this.stockForm.controls['marketPrice'].setValue(0);
                    this.stockForm.controls['shareQuantity'].setValue(0);
                    break;
                case CollateralType.GUARANTEE:
                    this.guaranteeForm.controls['guaranteeValue'].setValue(secVal);
                    break;
                case CollateralType.MISCELLANEOUS:
                    this.miscellaneousForm.controls['securityValue'].setValue(secVal);
                    break;
                default:
                    return;
            }

        }
        let accountNo = this.mainForm.get('collateralCode').value;

        if (accountNo == null || accountNo == "") return;

        let collateralTypeID = this.mainForm.get('collateralTypeId').value

        if (collateralTypeID == CollateralType.FIXED_DEPOSIT) {
            // this.depositForm.get('securityValue').clearValidators();
            this.getLientAmountForFD(accountNo);
        } else if (collateralTypeID == CollateralType.CASA) {
            this.casaForm.controls['accountNumber'].setValue(accountNo);
            this.casaForm.get('accountNumber').clearValidators();
            this.getLientAmountForCASA(accountNo);
        }


    }



    //-----------------------------  GET LIENT AMOUNT AND OUTSTANDING BALANCE FOR FIXED DEPOSIT
    getLientAmountForFD(accountNo) {

        this.collateralService.getLienAmountForFD(accountNo).subscribe((response) => {

            // let lien = response.result;
            let securityVa = this.depositForm.get('securityValue').value;
            let securityValue = this.convertToNumber(securityVa);
            if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }

            this.depositForm.controls['lienAmount'].setValue(this.lienAmount);
            this.depositForm.get('securityValue').clearValidators();

            this.getCasaAccountBalance(accountNo);

            if (this.lienAmount != null) {

                this.depositForm.controls['lienAmount'].setValue(this.lienAmount);
                this.depositForm.controls['availableBalance'].setValue(this.accountBalance);
            } else {
                this.depositForm.controls['lienAmount'].setValue(0);
                this.depositForm.controls['availableBalance'].setValue(securityValue);
            }

        }, (err) => {

        });
    }

    //-----------------------------  GET LIENT AMOUNT AND OUTSTANDING BALANCE FOR CASA
    getLientAmountForCASA(accountNo) {

        this.collateralService.getLienAmountForCASA(accountNo).subscribe((response) => {

            //let lien = response.result;
            let securityVa = this.depositForm.get('securityValue').value;
            let securityValue = this.convertToNumber(securityVa);
            if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
            this.casaForm.controls['lienAmount'].setValue(this.lienAmount);

            this.getCasaAccountBalance(accountNo);

            if (this.lienAmount != null) {

                this.casaForm.controls['lienAmount'].setValue(this.lienAmount);
                this.casaForm.controls['accountName'].setValue(this.accountName);
                this.casaForm.controls['availableBalance'].setValue(this.accountBalance);
            } else {
                this.casaForm.controls['lienAmount'].setValue(0);
                this.casaForm.controls['accountName'].setValue(this.accountName);
                this.casaForm.controls['availableBalance'].setValue(this.accountBalance);
                // this.casaForm.controls['availableBalance'].setValue(securityValue);
            }

        }, (err) => {

        });
    }

    validateHaircut() {
        return (control: FormControl) => {
            if (
                +control.value < this.currentHaircut
                || isNaN(control.value)
            ) {
                return { error: true };
            }
            return null;
        }
    }



    // ------------------------dynamic fields----------------------

    inputRows: any[];
    newFieldLabelForm: FormGroup;
    displayNewFieldLabelForm: boolean = false;
    displayCollateralHistory: boolean = false;

    createNewFieldLabelForm() { // form definition
        this.newFieldLabelForm = this.fb.group({
            labelName: [''],
        });
    }

    createNoteField(e) { // show modal form

        e.preventDefault();
        this.createNewFieldLabelForm();
        this.displayNewFieldLabelForm = true;

        this.enabledInputs();

    }

    newControl(name, value) { // method to create form control
        return this.fb.group({
            labelName: [name],
            labelValue: [value],
            controlName: [name.replace(/\s/g, '')]
        });
    }

    addNoteField() {
        this.displayNewFieldLabelForm = false;
        let x = <FormArray>this.miscellaneousForm.controls['notes']; // existing controls
        x.push(this.newControl(this.newFieldLabelForm.value.labelName, ''));
        this.getNoteFields(x);
    }

    addNoteFields(list: any[]) {
        this.displayNewFieldLabelForm = false;
        let x = <FormArray>this.miscellaneousForm.controls['notes']; // existing controls
        list.forEach(e => {
            x.push(this.newControl(e.labelName, e.labelValue));
        });
        this.getNoteFields(x);
    }

    getNoteFields(controls) {
        this.inputRows = Array.from(Array(Math.ceil(controls.length / 2)).keys());
    }

    // ------------------------end dynamic fields----------------------


    submitForm(form) {

        let body = this.getBody(form);
        // console.log('this.isRegistrationDoneViaLoanApplication this.isRegistrationDoneViaLoanApplicationy', this.isRegistrationDoneViaLoanApplication);


        let text = 'Collateral will go through approval. Are you sure you want to proceed?';
        if (this.isRegistrationDoneViaLoanApplication > 0) { text = 'This cannot be reversed, Are you sure you want to proceed?' }

        this.collateralCode = this.mainForm.get('collateralCode').value;

        let __this = this;

        if (form.value.collateralSubTypeId == CollateralGuaranteeSubType.JOIN_GUARANTEE_PERSONAL || form.value.collateralSubTypeId == CollateralGuaranteeSubType.JOIN_GUARANTEE_CORPORATE || form.value.collateralSubTypeId == CollateralGuaranteeSubType.CROSS_GUARANTEE) {
            let body = this.getBody(form);
            body.collateralId = this.joinGuaranteeCollateralId;
            body.note = this.miscellaneousForm.value.note;

            if (this.selectedId == null) {

                swal({
                    title: 'Are you sure?',
                    text: text,
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

                    __this.postJoinCollateralInformationWithImage(body);
                    __this.guaranteeForm.reset();
                    // __this.getOutstandingBalanceForFixedDepositOrCASA();
                    __this.displayModalForm = false;
                }, function (dismiss) {
                    if (dismiss == 'cancel') {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });
            } else {
                swal({
                    title: 'Are you sure?',
                    text: text,
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

                    __this.updateCollateralInformation(body);

                    __this.displayModalForm = false;
                }, function (dismiss) {
                    if (dismiss == 'cancel') {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });
            }
        } else {

            if (this.selectedId == null) {

                swal({
                    title: 'Are you sure?',
                    text: text,
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

                    __this.postJoinCollateralInformationWithImage(body);
                    __this.garanteeList = [];


                    __this.displayModalForm = false;
                }, function (dismiss) {
                    if (dismiss == 'cancel') {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });


            } else {

                swal({
                    title: 'Update?',
                    text: text,
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

                    __this.updateCollateralInformation(body);

                    __this.displayModalForm = false;
                }, function (dismiss) {
                    if (dismiss == 'cancel') {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });
            }

        }
        this.isPrimaryLabel = 'Required';
        this.disableDocumentPanel = false;
        this.activeTabIndex = 0;

        // console.log("customerId: ", this.selectedCustomerId);
        //this.getCustomerCollateral(this.selectedCustomerId);
        //this.getCustomerCollateral(this.applicationCustomerId,this.loanApplicationId);

    }



    hideAllSubForms() {
        this.disableSubFormTab = true;
        this.showDepositForm = false;
        this.showGuaranteeForm = false;
        this.showPolicyForm = false;
        this.showEquipmentForm = false;
        this.showSecurityForm = false;
        this.showPreciousMetalForm = false;
        this.showPropertyForm = false;
        this.showVehicleForm = false;
        this.showStockForm = false;
        this.showCasaForm = false;
        this.showMiscellaneousForm = false;
        this.showPromissoryForm = false;
        this.showIndemnityFrom = false;
        this.showDomiciliationContract = false;
        this.showDomiciliationSalary = false;
        this.showIspoForm = false;
    }

    filteredSubTypes: any[] = [];

    collateralDocumentTypes: any[];
    getAllDocumentsByColateralTypeId(id): void {
        this.loadingService.show();
        this.collateralService.getCollateralDocumentTypes(id).subscribe((response) => {
            this.collateralDocumentTypes = response.result;

            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    onCollateralTypeChange(id) {
        this.getAllDocumentsByColateralTypeId(id);
        if (id == CollateralType.IMMOVABLE_PROPERTY || id == CollateralType.VEHICLE || id == CollateralType.PLANT_AND_EQUIPMENT) {
            this.disableVisitationPanel = false;
        } else {
            this.disableVisitationPanel = true;
        }
        this.referenceNumberLabel = "Reg/Ref Number";
        this.filteredSubTypes = this.subTypes.filter(x => x.collateralTypeId == id);
        this.hideAllSubForms();
        // this.selectedCollateralTypeId = id;
        // this.mainForm.controls['collateralTypeId'].setValue(id);
        let selected = this.collateralTypes.find(x => x.collateralTypeId == id);
        //  this.requireInsurancePolicy = selected.requireInsurancePolicy;



        // const upLoadControl = this.CollateralPrimaryDocumentForm.get('documentTypeId');
        // upLoadControl.setValidators(Validators.required);
        // upLoadControl.updateValueAndValidity();

        if (selected != undefined || selected != "" || selected != null) {

            this.selectedCollateralTypeName = selected.collateralTypeName;
            this.selectedCollateralTypeName.trim();
            this.disableSubFormTab = false;
            this.enableInsuranceFormTab = selected.requireInsurancePolicy;
            this.showInsuranceDiferCheckbox = selected.requireInsurancePolicy;
        } else { // no selection

            this.selectedCollateralTypeName = null;
            this.disableSubFormTab = true;
            this.enableInsuranceFormTab = false;
            this.requireInsurancePolicy = true;
            return;
        }

        switch (+id) {

            case CollateralType.MARKETABLE_SECURITIES:
                this.subForm = this.securityForm;
                this.showSecurityForm = true;
                break;
            case CollateralType.IMMOVABLE_PROPERTY:
                this.populateValueBaseType(+id);
                this.subForm = this.propertyForm;
                this.showPropertyForm = true;
                break;
            case CollateralType.PLANT_AND_EQUIPMENT:
                this.populateValueBaseType(+id);
                this.subForm = this.equipmentForm;
                this.showEquipmentForm = true;
                break;
            case CollateralType.POLICY:
                this.subForm = this.policyForm;
                this.showPolicyForm = true;
                break;
            case CollateralType.VEHICLE:
                this.subForm = this.vehicleForm;
                this.showVehicleForm = true;
                break;
            case CollateralType.PRECIOUS_METAL:
                this.subForm = this.preciousMetalForm;
                this.showPreciousMetalForm = true;
                break;
            case CollateralType.FIXED_DEPOSIT:
                this.subForm = this.depositForm;
                this.showDepositForm = true;
                //this.accountNumberControl();
                this.referenceNumberLabel = "Account Number";
                break;
            case CollateralType.CASA:
                this.subForm = this.casaForm;
                this.showCasaForm = true;
                //this.accountNumberControl();
                this.referenceNumberLabel = "Account Number";
                break;
            case CollateralType.STOCK:
                this.subForm = this.stockForm;
                this.showStockForm = true;
                break;
            case CollateralType.GUARANTEE:
                this.subForm = this.guaranteeForm;
                this.showGuaranteeForm = true;
                break;
            case CollateralType.MISCELLANEOUS:
                this.subForm = this.miscellaneousForm;
                this.showMiscellaneousForm = true;
                break;
            case CollateralType.PROMISSORY:
                this.subForm = this.promissoryForm;
                this.referenceNumberLabel = "Promissory Note Ref Number";
                const upLoadControl = this.CollateralPrimaryDocumentForm.get('documentTypeId');
                upLoadControl.clearValidators();
                upLoadControl.updateValueAndValidity();

                this.showPromissoryForm = true;
                break;
            case CollateralType.ISPO:
                this.subForm = this.ispoForm;
                this.showIspoForm = true;
                break;
            case CollateralType.DOMICILIATIONCONTACT:
                this.subForm = this.domiciliationContract;
                this.showDomiciliationContract = true;
                break;
            case CollateralType.DOMICILIATIONSALARY:
                this.subForm = this.domiciliationSalary;
                this.showDomiciliationSalary = true;
                break;
            case CollateralType.INDEMNITY:
                this.subForm = this.indemnityFrom;
                this.showIndemnityFrom = true;
                break;
            default:
                this.selectedCollateralTypeName = this.defaultSubTabName;
                this.disableSubFormTab = true;
                return;
        }

        this.visitationDetail = null;
        this.supportingDocuments = null;
        this.collateralCode = null;
        this.tempCollateralId = null;
        this.disableDocumentPanel = true;

    }

    onRefChange() {
        if (this.showPromissoryForm) {
            const mainFormControl = this.mainForm.get('collateralCode').value;
            //const promissoryFormControl = this.promissoryForm.get('promissoryNoteRefferenceNumber').value;
            //let userStaffName = lastNameControl + " " + firstNameControl + " " + middleNameControl
            this.promissoryForm.get('promissoryNoteRefferenceNumber').setValue(mainFormControl);
        }
    }

    getBody(form) {

        let sub = this.subForm;
        let insurance = this.insuranceForm;
        let miscel = this.miscellaneousForm;
        return {
            // main
            collateralId: this.selectedId,// || 0,
            customerId: this.selectedCustomerId == 0 ? this.applicationCustomerId : this.selectedCustomerId,
            hasInsurance: !this.enableInsuranceFormTab,
            collateralTypeId: form.value.collateralTypeId,
            collateralSubTypeId: form.value.collateralSubTypeId,
            collateralCode: form.value.collateralCode,
            collateralValue: form.value.collateralValue,
            relatedCollateralCode: this.relatedCollateralCode,
            collateralSummary: form.value.collateralSummary,
            validTill: new Date(form.value.validTill),
            // allowSharing: form.value.allowSharing,
            // isLocationBased: form.value.isLocationBased,
            valuationCycle: form.value.valuationCycle,
            haircut: form.value.haircut,
            currencyId: form.value.currencyId,


            // // deposit
            dealReferenceNumber: sub.value.dealReferenceNumber,
            accountNumber: sub.value.accountNumber,
            bank: sub.value.bank,

            //  existingLienAmount: sub.value.existingLienAmount,
            lienAmount: sub.value.lienAmount,
            availableBalance: sub.value.availableBalance,
            securityValue: sub.value.securityValue,
            maturityDate: sub.value.maturityDate,
            maturityAmount: sub.value.maturityAmount,
            remark: sub.value.remark,

            // equipment
            machineName: sub.value.machineName,
            description: sub.value.description,
            machineNumber: sub.value.machineNumber,
            manufacturerName: sub.value.manufacturerName,
            yearOfManufacture: sub.value.yearOfManufacture,
            yearOfPurchase: sub.value.yearOfPurchase,
            valueBaseTypeId: sub.value.valueBaseTypeId,
            machineCondition: sub.value.machineCondition,
            machineryLocation: sub.value.machineryLocation,
            replacementValue: sub.value.replacementValue,
            equipmentSize: sub.value.equipmentSize,
            intendedUse: sub.value.intendedUse,

            // miscellaneous
            securityName: sub.value.securityName,
            notes: this.miscellaneousForm.value.notes,
            note: sub.value.note,

            // insurance
            referenceNumber: insurance.value.referenceNumber,
            sumInsured: insurance.value.sumInsured,
            insuranceCompany: insurance.value.insuranceCompany,
            startDate: insurance.value.startDate,
            expiryDate: insurance.value.expiryDate,
            insuranceType: insurance.value.insuranceType,
            inSurPremiumAmount: insurance.value.inSurPremiumAmount,
            premiumPercent: form.value.premiumPercent,
            policyState: form.value.policyState,
            previousInsurance: form.value.previousInsurance,
            companyAddress: form.value.companyAddress,
            insuranceTypeId: form.value.insuranceTypeId,
            insuranceCompanyId: form.value.insuranceCompanyId,
            prevoiusInsuranceId: form.value.prevoiusInsuranceId,

            // guarantee
            collateralGauranteeId: sub.value.collateralGauranteeId,
            collateralCustomerId: sub.value.collateralCustomerId,
            //   isOwnedByCustomer: sub.value.isOwnedByCustomer,
            institutionName: sub.value.institutionName,
            guarantorAddress: sub.value.guarantorAddress,
            //   guarantorReferenceNumber: sub.value.guarantorReferenceNumber,
            guaranteeValue: sub.value.guaranteeValue,
            endDate: sub.value.endDate,
            firstName: sub.value.firstName,
            middleName: sub.value.middleName,
            lastName: sub.value.lastName,
            taxNumber: sub.value.taxNumber,
            bvn: sub.value.bvn,
            rcNumber: sub.value.rcNumber,
            phoneNumber1: sub.value.phoneNumber1,
            phoneNumber2: sub.value.phoneNumber2,
            emailAddress: sub.value.emailAddress,
            relationship: sub.value.relationship,
            relationshipDuration: sub.value.relationshipDuration,
            cStartDate: sub.value.cStartDate,

            //cross and several
            // crossGarantee:this.garanteeList,

            // casa
            collateralCasaId: sub.value.collateralCasaId,

            // immovableProperty
            collateralPropertyId: sub.value.collateralPropertyId,
            propertyName: sub.value.propertyName,
            cityId: sub.value.cityId,
            countryId: sub.value.countryId,
            constructionDate: sub.value.constructionDate,
            propertyAddress: sub.value.propertyAddress,
            dateOfAcquisition: sub.value.dateOfAcquisition,
            lastValuationDate: sub.value.lastValuationDate,
            //nextValuationDate: sub.value.nextValuationDate,
            valuerId: sub.value.valuerId,
            valuerReferenceNumber: sub.value.valuerReferenceNumber,
            propertyValueBaseTypeId: sub.value.propertyValueBaseTypeId,
            openMarketValue: sub.value.openMarketValue,
            forcedSaleValue: sub.value.forcedSaleValue,
            stampToCover: sub.value.stampToCover,
            valuationSource: sub.value.valuationSource,
            originalValue: sub.value.originalValue,
            availableValue: sub.value.availableValue,
            collateralUsableAmount: sub.value.collateralUsableAmount,
            nearestLandMark: sub.value.nearestLandMark,
            nearestBusStop: sub.value.nearestBusStop,
            longitude: sub.value.longitude,
            latitude: sub.value.latitude,
            perfectionStatusId: sub.value.perfectionStatusId,
            perfectionStatusReason: sub.value.perfectionStatusReason,

            valuerName: sub.value.valuerName,
            valuerAccountNumber: sub.value.valuerAccountNumber,

            // marketableSecurities
            collateralMarketableSecurityId: sub.value.collateralMarketableSecurityId,
            securityType: sub.value.securityType,
            effectiveDate: sub.value.effectiveDate,
            dealAmount: sub.value.dealAmount,
            lienUsableAmount: sub.value.lienUsableAmount,
            issuerName: sub.value.issuerName,
            issuerReferenceNumber: sub.value.issuerReferenceNumber,
            unitValue: sub.value.unitValue,
            numberOfUnits: sub.value.numberOfUnits,
            rating: sub.value.rating,
            percentageInterest: sub.value.percentageInterest,
            interestPaymentFrequency: sub.value.interestPaymentFrequency,
            fundName: sub.value.fundName,
            isOwnerOccupied: sub.value.isOwnerOccupied,
            isResidential: sub.value.isResidential,
            isAssetPledgedByThirdParty: sub.value.isAssetPledgedByThirdParty,
            thirdPartyName: sub.value.thirdPartyName,
            isAssetManagedByTrustee: sub.value.isAssetManagedByTrustee,
            bankShareOfCollateral: sub.value.bankShareOfCollateral,
            stateId: sub.value.stateId,
            localGovernmentId: sub.value.localGovernmentId,
            trusteeName: sub.value.trusteeName,
            estimatedValue: sub.value.estimatedValue,
            // policy
            collateralInsurancePolicyId: sub.value.collateralInsurancePolicyId,
            insurancePolicyNumber: sub.value.insurancePolicyNumber,
            premiumAmount: sub.value.premiumAmount,
            policyAmount: sub.value.policyAmount,
            insuranceCompanyName: sub.value.insuranceCompanyName,
            insurerAddress: sub.value.insurerAddress,
            policyStartDate: sub.value.policyStartDate,
            assignDate: sub.value.assignDate,
            renewalFrequencyTypeId: sub.value.renewalFrequencyTypeId,
            insurerDetails: sub.value.insurerDetails,
            policyRenewalDate: sub.value.policyRenewalDate,
            policyinsuranceType: sub.value.policyinsuranceType,

            // preciousMetal
            collateralPreciousMetalId: sub.value.collateralPreciousMetalId,
            preciousMetalName: sub.value.preciousMetalName,
            weightInGrammes: sub.value.weightInGrammes,
            valuationAmount: sub.value.valuationAmount,
            metalValuationAmount: sub.value.metalValuationAmount,
            metalUnitRate: sub.value.metalUnitRate,
            preciousMetalFrm: sub.value.preciousMetalFrm,
            metalType: sub.value.metalType,

            // stock
            collateralStockId: sub.value.collateralStockId,
            companyName: sub.value.stockId,
            shareQuantity: sub.value.shareQuantity,
            marketPrice: sub.value.marketPrice,
            amount: sub.value.amount,
            sharesSecurityValue: sub.value.sharesSecurityValue,
            shareValueAmountToUse: sub.value.shareValueAmountToUse,

            // vehicle
            collateralVehicleId: sub.value.collateralVehicleId,
            vehicleType: sub.value.vehicleType,
            vehicleStatus: sub.value.vehicleStatus,
            vehicleMake: sub.value.vehicleMake,
            modelName: sub.value.modelName,
            dateOfManufacture: sub.value.dateOfManufacture,
            registrationNumber: sub.value.registrationNumber,
            serialNumber: sub.value.serialNumber,
            chasisNumber: sub.value.chasisNumber,
            engineNumber: sub.value.engineNumber,
            nameOfOwner: sub.value.nameOfOwner,
            registrationCompany: sub.value.registrationCompany,
            resaleValue: sub.value.resaleValue,
            valuationDate: sub.value.valuationDate,
            lastValuationAmount: sub.value.lastValuationAmount,
            invoiceValue: sub.value.invoiceValue,


            // promissory
            promissoryEffectiveDate: sub.value.promissoryEffectiveDate,
            promissoryMaturityDate: sub.value.promissoryMaturityDate,
            //promissoryValue: sub.value.promissoryValue,
            promissoryNoteRefferenceNumber: sub.value.promissoryNoteRefferenceNumber,

            accountNameToDebit: sub.value.accountNameToDebit,
            accountNumberToDebit: sub.value.accountNumberToDebit,
            regularPaymentAmount: sub.value.regularPaymentAmount,
            payer: sub.value.payer,

            contractDetail: sub.value.contractDetail,
            contractEmployer: sub.value.contractEmployer,
            contractValue: sub.value.contractValue,
            outstandingInvoiceAmount: sub.value.outstandingInvoiceAmount,
            invoiceNumber: sub.value.invoiceNumber,
            invoiceDate: sub.value.invoiceDate,


            monthlySalary: sub.value.contracmonthlySalarytEmployer,
            annualAllowances: sub.value.annualAllowances,
            annualEmolument: sub.value.annualEmolument,
            annualSalary: sub.value.annualSalary,

            address: sub.value.address,

            // documentTitle: this.docTitle,
            // documentTypeId: this.docType,
            // fileName: this.file.name,
            // fileExtension: this.fileExtention(this.file.name),
            // file: this.file,
            // isPrimaryDocument: true,

            isRegistrationDoneViaLoanApplication: this.isRegistrationDoneViaLoanApplication > 0 ? 1 : 0,
            applicationCustomerId: this.applicationCustomerId == null ? 0 : this.applicationCustomerId,
            loanApplicationId: this.applicationId == null ? 0 : this.applicationId
        };
    }

    payloadDiognostic(form) {
        // this.body = form.value.indexFields;
        this.payload = form.value;
    }

    getApprovalStatus(id) {
        let item = ApprovalStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }

    getCollateralSubTypeName(id) {
        if (this.subTypes == null) return;
        let item = this.subTypes.find(x => x.collateralSubTypeId == id);
        return item == null ? 'n/a' : item.collateralSubTypeName;
    }

    getCollateralUsageStatus(id) {
        if (this.subTypes == null) return;
        if (id == null) return;
        let item = this.collateralUsageStatus.find(x => x.collateralStatusId == id);
        return item == null ? 'n/a' : item.collateralStatusName;
    }

    refresh() {
        this.customerCollaterals = [];
        this.collateralTypes = [];
        this.loanApplicationCollaterals = [];
    }

    // file upload
    documentTypeId: number;
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput',{static: false}) fileInput: any;

    //visitation detail
    lastVisitation: string = null;
    visitationRemark: string = null;
    lastVisitaionDate: Date;
    collateralCustomerId: any;
    visitationDocument: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];

    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                collateralId: this.selectedId,
                documentTitle: this.uploadFileTitle, // document code
                documentTypeId: this.documentTypeId,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                //targetId: this.loanApplicationId
            };


            if (this.file != undefined || this.uploadFileTitle != null) {

                this.loadingService.show();

                if (this.selectedId != null && this.selectedId != undefined && this.selectedId != 0) {

                    let body = {
                        collateralId: this.selectedId,
                        documentTitle: this.uploadFileTitle, // document code
                        fileName: this.file.name,
                        fileExtension: this.fileExtention(this.file.name),
                        collateralCode: this.collateralCode,
                        //targetId: this.loanApplicationId
                    };

                    this.collateralService.uploadFile(this.file, body).then((val: any) => {
                        this.getSupportingDocuments();
                        this.loadingService.hide();
                    }, (error) => {
                        this.loadingService.hide(1000);

                    });
                } else {

                    if (this.tempCollateralId != undefined && this.tempCollateralId != null && this.tempCollateralId != '') {

                        let body = {
                            collateralId: this.tempCollateralId,
                            documentTitle: this.uploadFileTitle, // document code
                            fileName: this.file.name,
                            fileExtension: this.fileExtention(this.file.name),
                            collateralCode: this.collateralCode,
                            //targetId: this.loanApplicationId
                        };

                        this.collateralService.uploadTempFile(this.file, body).then((val: any) => {

                            this.getSupportingDocumentByTempCollateralId();

                            this.loadingService.hide();
                        }, (error) => {
                            this.loadingService.hide(1000);
                        });
                    } else {
                        swal('FinTrak Credit 360', "Kindly save the collateral Information before document upload", 'error')

                    }

                }
                this.loadingService.hide();
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";

            }

        }
    }

    postCollateralInformationWithImage(form) {

        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                formData: JSON.stringify(form),
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };

            this.loadingService.show();
            this.collateralService.postCollateralInformation(this.file, body).then((val: any) => {

                const success = val.success;
                this.tempCollateralId = val.result;


                if (success == true) {

                    this.closeForm();
                    this.getCustomerCollateral();
                    //    if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }
                    this.loadingService.hide();

                    swal('FinTrak Credit 360', "Collateral has been successfully saved!", 'success');
                    this.displayModalForm = false;
                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
                    this.displayModalForm = false;
                }

            }, (error) => {
                this.loadingService.hide(1000);

                swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
                //this.displayModalForm = false;
            });
        }
    }

    updateCollateralInformation(form) {
        // if (this.file != undefined || this.uploadFileTitle != null) {
        let body = JSON.stringify(form);
        // fileName: this.file.name,
        // fileExtension: this.fileExtention(this.file.name),
        // };

        this.loadingService.show();
        // this.collateralService.postCollateralInformation(this.file, body).then((val: any) => {

        this.collateralService.updateCustomerCollateral(body, form.collateralId).subscribe((res) => {
            const success = res.success;

            if (success == true) {

                this.closeForm();
                this.getCustomerCollateral(this.applicationCustomerId);
                // if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }
                this.loadingService.hide();
                swal('FinTrak Credit 360', "Collateral has been successfully edited!", 'success');
                this.displayModalForm = false;
            } else {
                this.loadingService.hide();
                swal('FinTrak Credit 360', "Saving Failed with error :" + res.message, 'error');
            }

        }, (error) => {
            this.loadingService.hide(1000);
            swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
        });
        // }
    }

    postJoinCollateralInformationWithImage(form) {
        // if (this.file != undefined || this.uploadFileTitle != null) {
        // let body = {
        //     formData: JSON.stringify(form),
        //     // fileName: this.file.name,
        //     // fileExtension: this.fileExtention(this.file.name),
        // };

        this.loadingService.show();

        // this.collateralService.postJoinCollateralInformation(this.file, body).then((val: any) => {
        this.collateralService.saveCustomerCollateral(form).subscribe((res) => {
            // this.garanteeList = [];
            // this.garanteeList = res.result;
            // this.joinGuaranteeCollateralId = res.result[0].collateralId;

            const success = res.success;
            if (success == true) {

                this.getCustomerCollateral(this.applicationCustomerId);
                this.loadingService.hide();
                this.closeForm();
                swal('FinTrak Credit 360', res.message, 'success');
            } else {
                this.loadingService.hide();
                swal('FinTrak Credit 360', "Saving Failed with error :" + res.message, 'error');
            }

        }, (error) => {
            this.loadingService.hide(1000);
            swal('FinTrak Credit 360', "Saving Failed with error :" + error, 'error');
        });
        // }
    }


    uploadVisitationFile(frm) {
        this.loadingService.show();

        if (this.selectedId != null && this.selectedId != undefined && this.selectedId != 0) {

            let body = {
                lastVisitaionDate: this.lastVisitaionDate,
                nextVisitationDate: this.nextVisitationDate,
                visitationRemark: this.visitationRemark, // document code
                fileName: this.file.name,
                collateralCustomerId: this.selectedId,//this.collateralCustomerId,
                fileExtension: this.fileExtention(this.file.name),
            };

            this.collateralService.AddVisitationloadFile(this.file, body).then((val: any) => {
                this.getVisitationDetail(this.selectedId);
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);

            });
        } else {
            if (this.tempCollateralId != undefined && this.tempCollateralId != null && this.tempCollateralId != '') {

                let body = {
                    lastVisitaionDate: this.lastVisitaionDate,
                    visitationRemark: this.visitationRemark, // document code
                    fileName: this.file.name,
                    collateralCustomerId: this.tempCollateralId,//this.collateralCustomerId,
                    fileExtension: this.fileExtention(this.file.name),
                };

                this.collateralService.AddTempVisitationloadFile(this.file, body).then((val: any) => {
                    this.getTempCollateralVisitationDetail(this.tempCollateralId);
                    this.loadingService.hide();
                }, (error) => {
                    this.loadingService.hide(1000);

                });
            } else {
                swal('FinTrak Credit 360', "Kindly save the collateral Information before document upload", 'error');

            }

        }
        this.uploadFileTitle = null;
        this.fileInput.nativeElement.value = "";
        this.visitationRemark = '';
        this.fileInput.nativeElement.value = "";

    }

    getVisitationDetail(CollateralId) {
        //loan-visitation/{collateralVisitationId}
        this.collateralService.getCollateralVisitationDetail(CollateralId).subscribe((response) => {
            this.visitationDetail = response.result;
        });
    }


    getTempCollateralVisitationDetail(tempCollateralId) {
        //loan-visitation/{collateralVisitationId}
        this.collateralService.getTempCollateralVisitationDetail(tempCollateralId).subscribe((response) => {
            this.visitationDetail = response.result;
        });
    }

    IsInsurancePolicyInEditMood: boolean = false;

    getInsurancePolicies(collateralCustomerId) {
        collateralCustomerId = this.selectedId;

        //loan-visitation/{collateralVisitationId}
        this.collateralService.getInsurancePolicies(collateralCustomerId).subscribe((response) => {
            this.insurancePolicies = response.result;
            this.IsInsurancePolicyInEditMood = true;
        });
    }

    geStockPrice() {
        this.collateralService.getStockPrice().subscribe((response) => {
            this.stockPriceList = response.result;
        });
    }


    getSupportingDocuments() {
        this.collateralService.getCollateralDocument(this.selectedId).subscribe((response) => {
            this.supportingDocuments = response.result;
        });
    }

    getSupportingDocumentByTempCollateralId() {
        this.collateralService.getTempCollateralDocument(this.tempCollateralId).subscribe((response) => {
            this.supportingDocuments = response.result;
        });
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;

    // viewDocument(id: number) {

    //     let doc = this.supportingDocuments.find(x => x.documentId == id);
    //     if (doc != null) {
    //         this.binaryFile = doc.fileData;
    //         this.selectedDocument = doc.documentTitle;
    //         this.displayDocument = true;
    //     }

    // }

    viewDocument(id: number) {
        this.loadingService.show();
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }

    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
                }
            }

        }

    }

    viewVisitationDocument(id) {

        this.collateralService.getCollateralVisitationFile(id).subscribe((response) => {
            let doc = response.result;


            if (doc != null) {
                this.pdfFile = doc.fileData;
                this.pdfFileName = doc.documentTitle;
                this.myDocExtention = doc.fileExtension;
                var byteString = atob(this.pdfFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
                    }
                }
                if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
                    }
                }
                if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                    }
                }
                if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
                    }
                }
                if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
                    }
                }

            }
        });


    }

    viewVisitationImage(id: number) {
        this.loadingService.show();

        let doc = this.visitationDetail.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }

    }

    downloadAttachment(id) {
        const downloadWindow = window.open('about:blank');
        this.collateralService.getCollateralVisitationFile(id).subscribe(downloadUrl => {
            downloadWindow.location.href = downloadUrl;
        });
    }

    ViewCollateralGuaranteeDocument(id) {
        this.loadingService.show();
        this.collateralService.getCollateralGuaranteeFile(id).subscribe((response) => {
            this.imageData = response.result;

            let doc = this.imageData.find(x => x.targetId == id);
            if (doc != null) {

                this.binaryFile = doc.fileData;
                this.selectedDocument = doc.documentTitle;
                this.displayDocument = true;

                this.loadingService.hide();
            }
        });

    }
    // feedback message

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

    ValidateInputAmount() {
        let securityvalue = this.stockForm.get("sharesSecurityValue").value;
        let amount = this.stockForm.get("shareValueAmountToUse").value;

        if (amount > securityvalue) return this.finishBad("Amount to be used cannot be greater than the securirty vlaue");
    }

    getCollateralHistory(row) {
        this.fetchedCollateral = row;
        this.collateralService.getCollateralHistoryUsage(row.collateralId).subscribe((response) => {
            this.collateralHistory = response.result.usage;
            this.collateralUsage = response.result;
            this.displayCollateralHistory = true;
        });
    }

    onAllowedCollateral(id) {
        let str: string;
        if (this.cities.find(x => x.cityId == +id) != null) {
            if (!this.cities.find(x => x.cityId == +id).allowedForCollateral) {
                this.showAllowedForCollateral = true;
                //str = 'Not an Acceptable Location';
                //this.allowedForCollateral = "Collateral Location Status : " + str;
            } else {
                this.showAllowedForCollateral = false;
            }

        }
    }

    getStockValue(id) {
        let item = this.stockPriceList.find(x => x.stockId == id);
        this.stockForm.controls['marketPrice'].setValue(item.stockPrice);
    }

    AddStockValue() {
        let amount = this.stockForm.get('amount').value;
        let total = this.stockForm.get('shareValueAmountToUse').value;
        let grantTotal = (+total) + (+amount);
        this.stockForm.controls['shareValueAmountToUse'].setValue(grantTotal);

        /*this.stockForm.controls['shareQuantity'].setValue(0);
        this.stockForm.controls['marketPrice'].setValue(0);
        this.stockForm.controls['amount'].setValue(0);*/
        //  this.stockForm.controls['sharesSecurityValue'].setValue(0);
    }

    GetPrimaryDocument() {
        this.displayFileUpload = true;
    }

    closePrimaryDocUpload() {
        this.displayFileUpload = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document upload has failed', 'error');
    }

    docTitle: any;
    isPrimary: boolean;
    isPrimaryLabel: string = 'Required';
    Uploaded: boolean = false;
    docType: any;

    AcceptImage() {
        this.docTitle = this.CollateralPrimaryDocumentForm.get('collateralPrimaryDocumentTitle').value;
        this.isPrimary = this.CollateralPrimaryDocumentForm.get('isPrimaryDocument').value;
        this.docType = this.CollateralPrimaryDocumentForm.get('documentTypeId').value;

        this.isPrimaryLabel = this.docTitle;
        this.Uploaded = true;
        this.displayFileUpload = false;

        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document uploaded successfully', 'success');
    }

    savePropose() {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "Are you sure you want to proceed?",
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
            var selectedProduct = __this.collateralCoverage[0];

            let data = {
                collateralId: selectedProduct.collateralId,
                customerId: __this.applicationCustomerId,
                loanApplicationDetailId: selectedProduct.loanApplicationDetailId,
                loanApplicationId: selectedProduct.loanApplicationId,
                actualCollateralCoverage: selectedProduct.actualCollateralCoverage,
                availableCollateralValue: selectedProduct.availableCollateralValue

            }

            __this.collateralService.proposeCollateral(data).subscribe((response) => {

                if (response.success == true) {
                    swal('FinTrak Credit 360', "Proposed Successfully!", 'success');
                    __this.proceedEvent.emit();
                    __this.productDropDown = 0;
                    __this.collateralCoverage = [];
                    __this.displayPropose = false;
                    __this.getCustomerCollateral();
                    __this.collateralCoverage = [];

                } else {
                    swal('FinTrak Credit 360', "Couldn't propose this collateral: " + response.result, 'error');
                }

            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    saveProposeLMS() {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "Are you sure you want to proceed?",
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
            var selectedProduct = __this.collateralCoverage[0];

            let data = {
                collateralId: selectedProduct.collateralId,
                customerId: __this.applicationCustomerId,
                loanApplicationDetailId: selectedProduct.loanApplicationDetailId,
                loanApplicationId: selectedProduct.loanApplicationId,
                actualCollateralCoverage: selectedProduct.actualCollateralCoverage,
                availableCollateralValue: selectedProduct.availableCollateralValue

            }

            __this.collateralService.proposeCollateralLMS(data).subscribe((response) => {

                if (response.success == true) {
                    swal('FinTrak Credit 360', "Proposed Successfully!", 'success');
                    __this.proceedEvent.emit();
                    __this.productDropDown = 0;
                    __this.collateralCoverage = [];
                    __this.displayPropose = false;
                    __this.getCustomerCollateral();
                    __this.collateralCoverage = [];

                } else {
                    swal('FinTrak Credit 360', "Couldn't propose this collateral: " + response.result, 'error');
                }

            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    AddGuarantee(frm) {

    }

    clearControlsForGuarantee() {
        //  this.selectedId = null;
        //this.createNewFieldLabelForm();
        // subforms
        //  this.subForm = this.fb.group({});
        //   this.insuranceForm = this.fb.group({});

        this.guaranteeForm = this.fb.group({
            institutionName: [''],
            guarantorAddress: [''],
            //   guarantorReferenceNumber: [''],
            //   guaranteeValue: [''],
            startDate: [''],
            endDate: [''],
            // isOwnedByCustomer: [false],
            remark: [''],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            taxNumber: [''],
            bvn: [''],
            rcNumber: [''],
            phoneNumber1: [''],
            phoneNumber2: [''],
            emailAddress: [''],
            relationship: [''],
            relationshipDuration: [''],
            cStartDate: [''],
            age: [''],
        });

    }

    disabledInputs() {
        this.isCollateralCodeVisible = true;
    }

    enabledInputs() {
        this.isCollateralCodeVisible = null;
        this.disableInput = null;
    }

    clearInsurance() {
        this.insuranceForm = this.fb.group({
            referenceNumber: ['', Validators.required],
            sumInsured: ['0', Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: ['', Validators.required],
            startDate: ['', Validators.required],
            expiryDate: ['', Validators.required],
            insuranceType: ['', Validators.required],
            inSurPremiumAmount: ['', Validators.required],
            description: ['', Validators.required],
            premiumPercent: [''],
            policyState: [0, Validators.required],
            previousInsurance: ['', Validators.required],
            companyAddress: ['', Validators.required],
            insuranceTypeId: ['', Validators.required],
            insuranceCompanyId: ['', Validators.required],
            prevoiusInsuranceId: [0]

        });
    }

    getCasaAccountBalance(acctNumber) {
        this.loadingService.show();
        this.casaSrv.getCustomerAccountBalance(acctNumber).subscribe((response) => {
            if (response.success == false) {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            } else {
                this.loadingService.hide();
                this.accountBalance = response.result.availableBalance;
                this.accountName = response.result.accountName;
            }
        }, (err: any) => {
            this.loadingService.hide(10000);
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        });
    }

    // getFixedDepositAccountBalance(acctNumber) {
    //     this.collateralService.getFixedDepositAccountDetail(acctNumber).subscribe((response) => {
    //         if (response.result != undefined && response.result != null) {
    //             this.accountBalance = response.result.balance;
    //             this.accountName = response.result.accountName;
    //         }
    //     });
    // }

    getStates() {
        this.locationService.getStates().subscribe((response) => {
            this.states = response.result;
        });
    }

    getLocalGovtById(vrb): void {
        this.locationService.getAllLocalGovtById(vrb).subscribe((response) => {
            this.localGovt = response.result;
        }, (err) => {
        });


    }

    getCityByLocalGovt(localId): void {
        this.locationService.getCityClass(localId).subscribe((response) => {
            this.cities = response.result;

        }, (err) => {
        });

    }

    toggleInsurancePolicy(event) {
        if (event == true) {
            this.enableInsuranceFormTab = false;
        } else {
            this.enableInsuranceFormTab = true;
        }
    }

    onSelectOfAssetManageByTrustee(event) {
        let trusteeNameControl = this.propertyForm.get("trusteeName");

        if (event) {
            this.disableTrusteeName = false;
            trusteeNameControl.setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
            trusteeNameControl.clearValidators();
            trusteeNameControl.setValue('');
            this.disableTrusteeName = true;
        }

        trusteeNameControl.updateValueAndValidity();
    }

    onSelectOfAssetPledged(event) {
        let thirdPartyNameControl = this.propertyForm.get('thirdPartyName');

        if (event) {
            this.disableThirdPartyName = false;
            thirdPartyNameControl.setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
            thirdPartyNameControl.clearValidators();
            thirdPartyNameControl.setValue('');
            this.disableThirdPartyName = true;

            //thirdPartyNameControl.setValidators(null);
            //thirdPartyNameControl.setErrors(null);
        }

        thirdPartyNameControl.updateValueAndValidity();
    }

    getCountry(id) {
        if (id != 1)//Nigeria == 1
        {
            this.states = null;
        } else {
            this.getStates();
        }
    }

    moduleValue1: any = "LOS";
    moduleValue2: any = "LMS";
    proposeCollateral(row) {
        if (this.selectedModule < 1) {
            this.module = "LOS";
        } else {
            this.module = "LMS";
        }
        //.log("my application id = "+row.loanApplicationId);
        this.GetFacilityByApplicationId(row.loanApplicationId);
        this.productDropDown = "";
        this.collateralCoverage = [];
        this.displayPropose = true;
        this.collateralId = row.collateralId;
        this.collateralTypeId = row.collateralTypeId;
        this.collateralSubTypeId = row.collateralSubTypeId;
        this.collateralValue = row.collateralValue;
        this.currencyId = row.currencyId;
        this.customerId = row.customerId;

        // let data = {
        //     collateralCustomerId: row.collateralId,
        //     loanApplicationId: this.applicationId,
        //     status: this.status
        // }



        // this.collateralService.proposeCollateral(data).subscribe((response) => {


        //     if (response.success == true) {
        //         swal('FinTrak Credit 360', response.result, 'success')
        //     } else {
        //         swal('FinTrak Credit 360', response.result.Message, 'error')
        //     }

        // });
    }

    rejectCollateral(item) {
        this.collateralService.rejectCollateral(item).subscribe((response) => {
            let reject = response.result;
            if (reject == true) {
                swal('FinTrak Credit 360', "Rejected Successfull", 'success');
                this.getCustomerCollateral();
            } else { swal('FinTrak Credit 360', "Cannot be Rejected", 'error'); }
        });
    }

    getInsurerAddress(d) {
        let record = this.insuranceCompany.filter(x => x.insuranceCompanyId == d);
        this.insuranceForm.controls["companyAddress"].setValue(record[0].address + ", " + record[0].phoneNumber + ", " + record[0].email);
    }

    SaveInsurance(form) {

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This will cannot be reversed. Are you sure you want to proceed?",
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

            let data = {
                collateraalId: __this.selectedId,
                referenceNumber: form.value.referenceNumber,
                sumInsured: form.value.sumInsured,
                insuranceCompany: form.value.insuranceCompany,
                startDate: form.value.startDate,
                expiryDate: form.value.expiryDate,
                insuranceType: form.value.insuranceType,
                inSurPremiumAmount: form.value.inSurPremiumAmount,
                description: form.value.description,
                premiumPercent: form.value.premiumPercent,
                policyState: form.value.policyState,
                previousInsurance: form.value.previousInsurance,
                companyAddress: form.value.companyAddress,
                insuranceTypeId: form.value.insuranceTypeId,
                insuranceCompanyId: form.value.insuranceCompanyId,
                prevoiusInsuranceId: form.value.prevoiusInsuranceId,
            }
            __this.collateralService.addInsurancePolicy(data).subscribe((response) => {

                if (response.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
                    __this.displayModalForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }

            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    enableInputText() {
        this.disableInput = null;
    }

    disableInputText() {
        this.disableInput = true;
    }

    GetInsuranceDetail(id) {
        if (id == 2) {

            // this.selectInsurance(this.selectedId);
        } else {
            this.insuranceForm.controls['referenceNumber'].setValue("");
            this.insuranceForm.controls['sumInsured'].setValue("");
            this.insuranceForm.controls['startDate'].setValue("");
            this.insuranceForm.controls['expiryDate'].setValue("");
            this.insuranceForm.controls['inSurPremiumAmount'].setValue("");
            this.insuranceForm.controls['description'].setValue("");
            this.insuranceForm.controls['premiumPercent'].setValue("");
            //  this.insuranceForm.controls['policyState'].setValue("");
            this.insuranceForm.controls['companyAddress'].setValue("");
        }
    }

    selectInsurance(row) {

        this.selectedId = row.collateralId;
        this.getInsurancePolicies(this.selectedId);
        this.mainForm = this.fb.group({
            collateralTypeId: [row.collateralTypeId, Validators.required],
            collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
            collateralCode: [row.collateralCode],
            // collateralCode: [row.collateralCode, Validators.required],
            collateralValue: [row.collateralValue, Validators.required],
            isPrimaryDocument: true,
            valuationCycle: [row.valuationCycle, Validators.required],
            currencyId: [row.currencyId, Validators.required],
            haircut: [row.haircut, this.validateHaircut()],
            relatedCollateralCode: [],
            collateralSummary: [row.collateralSummary],
            validTill: [new Date(row.validTill)]
        });

        this.displayModalForm = true;
        this.onCollateralTypeChange(row.collateralTypeId);
        this.onSubTypeChange(row.collateralSubTypeId);
        this.getSubFormItems(row.collateralId, row.collateralTypeId);
        // this.enableInsuranceFormTab = true;
        this.getVisitationDetail(this.selectedId);
        this.getCollateralVisitationStatus(row.collateralTypeId);

        this.disableDocumentPanel = false;

        this.disableInputText();
        this.InsuranceSaveButton = true;
        this.activeTabIndex = 2;
    }

    GetFacilityByApplicationId(loanApplicationId) {
        this.camService.GetFacilityByApplicationId(loanApplicationId).subscribe((data) => {
            this.faciliies = data.result;
        }, err => { });
    }

    facility: any;
    getProposeCollateralCoverage(d) {
        this.camService.GetFacilityByApplicationDetailIdLos(d).subscribe((resp) => {
            this.facility = resp.result;

            /*this.selectedProduct = this.faciliies.filter(o => o.productId == d);
            this.loanApplicationDetailId = this.selectedProduct[0].loanApplicationDetailId;
            this.loanApplicationId = this.selectedProduct[0].loanApplicationId;
            let facilityAmount = this.selectedProduct[0].facilityAmount;
            */
            
            this.loanApplicationDetailId = this.facility.loanApplicationDetailId;
            this.loanApplicationId = this.facility.loanApplicationId;
            let facilityAmount = this.facility.facilityAmount;

            let data = {
                collateralId: this.collateralId,
                collateralTypeId: this.collateralTypeId,
                collateralSubTypeId: this.collateralSubTypeId,
                collateralValue: this.collateralValue,
                currencyId: this.currencyId,
                customerId: this.customerId,
                facilityAmount: facilityAmount,
                loanApplicationDetailId: this.facility.loanApplicationDetailId,
                loanApplicationId: this.facility.loanApplicationId

            }
            

            this.collateralService.calculateCoverateOfCollateral(data).subscribe((response) => {
                if (response.success == true) {
                    this.collateralCoverage = response.result;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
                /// this.collateralUsage = response.result;
            });

        }, err => { });

    }

    getProposeCollateralCoverageLms(d) {
        this.camService.GetFacilityByApplicationDetailIdLms(d).subscribe((resp) => {
            this.facility = resp.result;
            // this.selectedProduct = this.faciliies.filter(o => o.productId == d);
            // this.loanApplicationDetailId = this.selectedProduct[0].loanApplicationDetailId;
            // this.loanApplicationId = this.selectedProduct[0].loanApplicationId;
            // let facilityAmount = this.selectedProduct[0].facilityAmount;

            
            this.loanApplicationDetailId = this.facility.loanApplicationDetailId;
            this.loanApplicationId = this.facility.loanApplicationId;
            let facilityAmount = this.facility.facilityAmount;

            let data = {
                collateralId: this.collateralId,
                collateralTypeId: this.collateralTypeId,
                collateralSubTypeId: this.collateralSubTypeId,
                collateralValue: this.collateralValue,
                currencyId: this.currencyId,
                customerId: this.customerId,
                facilityAmount: facilityAmount,
                loanApplicationDetailId: this.selectedProduct[0].loanApplicationDetailId,
                loanApplicationId: this.selectedProduct[0].loanApplicationId
            }
            

            this.collateralService.calculateCoverateOfCollateralLms(data).subscribe((response) => {
                if (response.success == true) {
                    this.collateralCoverage = response.result;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
                /// this.collateralUsage = response.result;
            });
        }, err => { });

    }

    calculateLastValuationDate(date: Date) {
        var valuationDate = new Date(date);
        var valuationCycle = this.collateralSubType.revaluationDuration == null ? 0 : this.collateralSubType.revaluationDuration;

        valuationDate.setDate(valuationDate.getDate() + valuationCycle);
        this.nextValuationDate = valuationDate;
    }

    calculateLastVisitationDate(date: Date) {
        var visitationDate = new Date(date);
        var visitationCycle = this.collateralSubType.visitationCycle == null ? 0 : this.collateralSubType.visitationCycle;

        visitationDate.setDate(visitationDate.getDate() + visitationCycle);
        this.nextVisitationDate = visitationDate;
    }


    // getCollateralSubTypesById(collateralTypeId): void {
    //     this.collateralService.getCollateralSubTypesById(collateralTypeId).subscribe((response) => {
    //         if (response.success == true) {
    //             this.collateralSubType = response.result;
    //         } else {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
    //         }
    //     });        
    // }

    DeleteCollateralCoverage(d) {

    }

    onTabChange(event) {
        let acctNumber = 0;
        if (event.index == 1) {
            if (this.mainForm.controls['collateralTypeId'].value == CollateralType.CASA) {
                acctNumber = this.mainForm.controls['collateralCode'].value;
                if (acctNumber <= 0) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please enter a valid account Number', 'error');
                }
                this.getCasaAccountBalance(acctNumber);
                this.casaForm.controls['accountName'].setValue(this.accountName);
                this.casaForm.controls['availableBalance'].setValue(this.accountBalance);
            } else if (this.mainForm.controls['collateralTypeId'].value == CollateralType.FIXED_DEPOSIT) {
                acctNumber = this.mainForm.controls['collateralCode'].value;
                if (acctNumber <= 0) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please enter a valid account Number', 'error');
                }
                this.getCasaAccountBalance(acctNumber);
                this.depositForm.controls['accountName'].setValue(this.accountName);
                this.depositForm.controls['accountNumber'].setValue(acctNumber);
                this.depositForm.controls['availableBalance'].setValue(this.accountBalance);
            }
            this.getOutstandingBalanceForFixedDepositOrCASA();
        }
    }
}



/*
    --- COLLATERAL COMPONENT USAGE ---

   <collateral-information
        [autoMapNew]="true"
        [loanApplicationId]="142"
        [applicationCustomerId]="49"
        [applicationCustomerName]="customerName"
        (sum)="totalMapped"
        (figures)="mappedFigures"
    ></collateral-information>
 */
