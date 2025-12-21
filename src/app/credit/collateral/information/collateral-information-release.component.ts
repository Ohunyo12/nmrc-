import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { log } from 'util';
//import { jsonpFactory } from '@angular/http';
// import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
// import { log } from 'util';

@Component({
    selector: 'collateral-information-release',
    templateUrl: 'collateral-information-release.component.html'
})
export class CollateralInformationReleaseComponent implements OnInit {
    accountName: any;
    referenceNumberLabel: string;
    myDocExtention: any;
    pdfFileName: any;
    pdfFile: any;
    selectedCaollateral: any = {};
    showPersonalCollateralGuaranteeTableColumn: boolean;
    showAllowedForCollateral: boolean = false;
    garanteeList: any[];
    haircut: any;
    CollateralPerfectionList: any;
    collateralSubType: any = {};
    collateralHistory: any[];
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
    visitationForm: FormGroup;
    CollateralPrimaryDocumentForm: FormGroup;
    promissoryForm: FormGroup;

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

    showInsuranceForm: boolean = false;
    showCustomerCollaterals: boolean = false;
    latitude: any;
    longitude: any;
    currentDate: Date;

    payload: any = {};
    defaultSubTabName: string = 'Collateral Type Details';
    selectedCollateralTypeName: string = this.defaultSubTabName;
    disableSubFormTab: boolean = true;
    subTypes: any[];
    currencies: any[] = [];

    showLocationMap: boolean = false;
    requireVisitation: boolean = false;
    requireInsurancePolicy: boolean = false;
    releaseType: any;
    comment: any;


    @Input() autoMapNew: boolean = false;
    @Input() loanApplicationId: number = null;
    @Input() applicationCustomerId: number = null;
    @Input() applicationCustomerName: string;
    @Input() hideCreateButton: boolean = false;

    @Output() figures: EventEmitter<any> = new EventEmitter<any>();
    @Output() sum: EventEmitter<number> = new EventEmitter<number>();
    collateralCode: any;
    tempCollateralId: any;
    accountBalance: any;
    releaseTypes: any[];
    @Input() set reload(value: number) {
        if (value > 0) {
            this.loanApplicationId = value;
            this.loadCustomerCollaterals(this.applicationCustomerId);
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
        private router: Router,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
        this.loadCustomerCollaterals(this.applicationCustomerId);
        this.geStockPrice();

        this.referenceNumberLabel = "Reg/Ref Number";

        this.currentDate = new Date();
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
        this.selectedCollateralTypeName = this.defaultSubTabName;
        this.disableSubFormTab = true;
        this.enableInsuranceFormTab = false;
        this.showInsuranceForm = false;
        this.currentHaircut = null;
        this.clearControls();
        this.hideAllSubForms();

        this.disableVisitationPanel = true;
    }

    loadDropdowns() {
        this.locationService.getAllCities().subscribe((response: any) => {
            this.cities = response.result;
        });
        this.locationService.getAllCountries().subscribe((response: any) => {
            this.countries = response.result;
        });
        this.collateralService.getCollateralSubTypes().subscribe((response: any) => {
            this.subTypes = response.result;
        });
        this.collateralService.getFrequencyTypes().subscribe((response: any) => {
            this.frequencyTypes = response.result;
        });
        this.currencyService.getAllCurrencies().subscribe((response: any) => {
            this.currencies = response.result;
        });
        this.collateralService.getValuers().subscribe((response: any) => {
            this.valuers = response.result;
        });
        this.ledgerService.get().subscribe((response: any) => {
            this.accountTypes = response.result;
        });
        this.collateralService.getCollateralTypeByApplication(this.loanApplicationId).subscribe((response: any) => {
            this.collateralTypes = response.result;

        });
        this.collateralService.getCollateralPerfectionStatus().subscribe((response: any) => {
            this.CollateralPerfectionList = response.result;
        });
    }

    ViewMap() {
        let latitude = this.subItems.latitude;
        let longitude = this.subItems.longitude;

        //    let latitude = this.propertyForm.value.latitude;
        //    let longitude = this.propertyForm.value.longitude;
        this.transactionTypeId = null
        window.open(`#/credit/loan/map/${latitude}/${longitude}`, '_blank');
        ;

    }

    editInsurancePolicy(id) {
        var val = this.insurancePolicies.find(x => x.referenceNumber == id)
        if (val != null) {

            this.insuranceForm = this.fb.group({
                referenceNumber: [val.referenceNumber, Validators.required],
                sumInsured: [(val.sumInsured), Validators.compose([ValidationService.isNumber, Validators.required])],
                insuranceCompany: [val.insuranceCompany, Validators.required],
                startDate: [new Date(val.startDate), Validators.required],
                expiryDate: [new Date(val.expiryDate), Validators.required],
                insuranceType: [val.insuranceType, Validators.required],

            });

        }
    }

    AddInsurancePolicy(form) {
        form.value.collateraalId = this.selectedId;

        // var val=  this.insurancePolicies.find(x=>x.referenceNumber==this.insuranceForm.value.referenceNumber).referenceNumber
        // var hasExpired =  this.insurancePolicies.find(x=>x.referenceNumber==this.insuranceForm.value.referenceNumber).hasExpired
        // ////console.log('val',val);

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

            ////console.log('insuranceForm >>',form);
            __this.loadingService.show();
            __this.collateralService.addNewPolicy(form).subscribe((res) => {
                __this.loadingService.hide();

                const success = res.success;

                ////console.log('success',success);

                if (res.success === true) {
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
            if (dismiss === 'cancel') {
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

        this.collateralService.getValueBaseTypes(collateralType).subscribe((response: any) => {
            this.valueBaseTypes = response.result;
            ////console.log('response >>',response);
        });
    }

    selectedCustomerId: number;

    getCustomerCollateral(id, name = null): void {
        this.selectedCustomerId = id;
        this.selectedCustomerName = name;
        // ////console.log('emmitting customer...', customer);
        ////console.log('emmitting customer id...', this.selectedCustomerId);
        this.loadingService.show();
        this.collateralService.getCustomerCollateral(this.selectedCustomerId, this.loanApplicationId).subscribe((response: any) => {
            this.customerCollaterals = response.result;
            this.showCustomerCollaterals = true;
            //console.log('getting collaterals...', response);
            this.loadingService.hide();
            this.getMappedCollateral();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadCustomerCollaterals(customerId) {
        if (customerId != null) this.getCustomerCollateral(this.applicationCustomerId, this.applicationCustomerName);
    }

    getMappedCollateral() {
        this.loanApplicationCollaterals = [];
        if (this.loanApplicationId != null) {
            this.collateralService.getLoanApplicationCollateral(this.loanApplicationId).subscribe((response: any) => {
                this.loanApplicationCollaterals = response.result;
                ////console.log('mapped', response.result);
                this.getMappedSum();
                this.getMappedFigures();
            });
        }
    }

    getMappedSum() {
        const total: number = this.loanApplicationCollaterals.map(x => x.securityValue).reduce((a, b) => +a + +b, 0);
        this.sum.emit(total);
    }

    getMappedFigures() { // still developing
        const obj: any = this.loanApplicationCollaterals.map(x => { return { amount: x.securityValue, currency: x.currencyCode } });
        this.figures.emit(obj);
    }

    showModalForm() {
        if (this.selectedCustomerId > 0) {
            this.clearControls();
            this.displayModalForm = true;

            this.disableDocumentPanel = true;
            this.disableVisitationPanel = true;
            this.enableInsuranceFormTab = true;

            this.IsInsurancePolicyInEditMood = false;
            this.insurancePolicies = [];

            this.enabledInputs();
        }
    }



    collateralId: any; // --------------------- new?
    collateralTypeId: any; // --------------------- new?
    selectedRecord: any;
    editCustomerCollateral(row) {


        this.disabledInputs();

        this.selectedRecord = row;
        this.collateralCode = row.collateralCode;
        this.selectedId = row.collateralId;
        // console.log('row',this.selectedRecord);
        this.mainForm = this.fb.group({
            collateralTypeId: [row.collateralTypeId, Validators.required],
            collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
            collateralCode: [row.collateralCode, Validators.required],
            collateralValue: [row.collateralValue, Validators.required],
            isPrimaryDocument: true,
            //isLocationBased: [row.isLocationBased],
            valuationCycle: [row.valuationCycle, Validators.required],
            currencyId: [row.currencyId, Validators.required],
            haircut: [row.haircut, this.validateHaircut()],
        });

        this.displayModalForm = true;
        this.onCollateralTypeChange(row.collateralTypeId);
        this.onSubTypeChange(row.collateralSubTypeId);
        this.getSubFormItems(row.collateralId, row.collateralTypeId);
        // this.enableInsuranceFormTab = true;
        // ////console.log('subtype @ edit...', row.collateralSubTypeId);
        this.getVisitationDetail(this.selectedId)
        this.getCollateralVisitationStatus(row.collateralTypeId)

        this.collateralService.getCollateralDocument(this.selectedRecord.collateralId).subscribe((response: any) => {
            this.supportingDocuments = response.result;
        });
        this.disableDocumentPanel = false;
        this.disableVisitationPanel = !this.requireVisitation;

    }

    getCollateralVisitationStatus(id) {
        if (this.collateralTypes != null) {
            this.requireVisitation = this.collateralTypes.find(x => x.collateralTypeId == id).requireVisitation;
            this.requireInsurancePolicy = this.collateralTypes.find(x => x.collateralTypeId == id).requireInsurancePolicy;
        }
    }

    mapCollateral(collateralId, collateralCode = null) {
        if (this.loanApplicationId == null) { return; }
        const body = {
            collateralId: collateralId,
            collateralCode: collateralCode,
            applicationId: this.loanApplicationId
        };
        this.loadingService.show();
        this.collateralService.mapCollateral(body).subscribe((response: any) => {
            this.loanApplicationCollaterals = response.result;
            this.getMappedSum();
            this.getMappedFigures();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    unmapCollateral(collateralId) {
        if (this.loanApplicationId == null) { return; }
        const body = {
            collateralId: collateralId,
            applicationId: this.loanApplicationId
        };
        this.loadingService.show();
        this.collateralService.unmapCollateral(body).subscribe((response: any) => {
            this.loanApplicationCollaterals = response.result;
            this.getMappedSum();
            this.getMappedFigures();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    isMapped(collateralId: number): boolean {
        return this.loanApplicationCollaterals.some(x => x.collateralCustomerId == collateralId);
    }

    subItems: any = {};

    getSubFormItems(collateralId, typeId): void {
        this.loadingService.show();
        this.collateralService.GetCollateralDetailsByCollateral(collateralId, typeId).subscribe((response: any) => {
            this.subItems = response.result;
            this.supportingDocuments = response.FileData;
            ////console.log('sub items...', response);

            this.loadingService.hide();
            this.editSubForm(typeId);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    editSubForm(id: number): void {

        ////console.log('Edit Id',id);

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

            default: return;
        }
        this.editInsurance();
        this.getSupportingDocuments();
    }

    // edit methods

    editInsurance() {
        this.insuranceForm = this.fb.group({
            referenceNumber: [this.subItems.referenceNumber, Validators.required],
            sumInsured: [(this.subItems.sumInsured), Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: [this.subItems.insuranceCompany, Validators.required],
            startDate: [new Date(this.subItems.startDate), Validators.required],
            expiryDate: [new Date(this.subItems.expiryDate), Validators.required],
            insuranceType: [this.subItems.insuranceType, Validators.required],

        });
        this.getInsurancePolicies(this.selectedId)
    }

    editVehicle() {
        this.vehicleForm = this.fb.group({
            vehicleType: [this.subItems.vehicleType, Validators.required],
            vehicleStatus: [this.subItems.vehicleStatus, Validators.required],
            vehicleMake: [this.subItems.vehicleMake, Validators.required],
            modelName: [this.subItems.modelName, Validators.required],
            dateOfManufacture: [new Date(this.subItems.dateOfManufacture), Validators.required],
            registrationNumber: [this.subItems.registrationNumber, Validators.required],
            serialNumber: [this.subItems.serialNumber, Validators.required],
            chasisNumber: [this.subItems.chasisNumber, Validators.required],
            engineNumber: [this.subItems.engineNumber, Validators.required],
            nameOfOwner: [this.subItems.nameOfOwner, Validators.required],
            registrationCompany: [this.subItems.registrationCompany, Validators.required],
            resaleValue: [(this.subItems.resaleValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            valuationDate: [new Date(this.subItems.valuationDate), Validators.required],
            lastValuationAmount: [(this.subItems.lastValuationAmount), Validators.compose([ValidationService.isNumber, Validators.required])],
            invoiceValue: [(this.subItems.invoiceValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            remark: [this.subItems.remark],
        });
        this.subForm = this.vehicleForm;
    }

    editPreciousMetal() {  // doing
        this.preciousMetalForm = this.fb.group({
            //   isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            metalType: [this.subItems.metalType, , Validators.required],
            preciousMetalName: [this.subItems.preciousMetalName, Validators.required],
            weightInGrammes: [this.subItems.weightInGrammes, Validators.required],
            metalValuationAmount: [(this.subItems.metalValuationAmount), Validators.compose([ValidationService.isNumber]), Validators.required],
            metalUnitRate: [this.subItems.metalUnitRate, Validators.required, Validators.required],
            preciousMetalFrm: [this.subItems.preciousMetalFrm],
            remark: [this.subItems.remark],
        });
        this.subForm = this.preciousMetalForm;
    }


    editMarketableSecurity() {
        this.securityForm = this.fb.group({
            securityType: [this.subItems.securityType],
            //  dealReferenceNumber: [this.subItems.dealReferenceNumber],
            effectiveDate: [new Date(this.subItems.effectiveDate)],
            maturityDate: [new Date(this.subItems.maturityDate)],
            dealAmount: [(this.subItems.dealAmount), Validators.compose([ValidationService.isNumber])],
            securityValue: [(this.subItems.securityValue), Validators.compose([ValidationService.isNumber])],
            lienUsableAmount: [(this.subItems.lienUsableAmount), Validators.compose([ValidationService.isNumber])],
            issuerName: [this.subItems.issuerName],
            issuerReferenceNumber: [this.subItems.issuerReferenceNumber],
            unitValue: [(this.subItems.unitValue), Validators.compose([ValidationService.isNumber])],
            numberOfUnits: [this.subItems.numberOfUnits],
            rating: [this.subItems.rating],
            //  percentageInterest: [this.subItems.percentageInterest],
            interestPaymentFrequency: [this.subItems.interestPaymentFrequency],
            fundName: [this.subItems.fundName],
            remark: [this.subItems.remark],
            bank: [this.subItems.bank],
        });
        this.subForm = this.securityForm;
    }

    editPolicy() {  //
        this.policyForm = this.fb.group({
            //   isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            insurancePolicyNumber: [this.subItems.insurancePolicyNumber, Validators.required],
            premiumAmount: [(this.subItems.premiumAmount), Validators.compose([ValidationService.isNumber])],
            policyAmount: [(this.subItems.policyAmount), Validators.compose([ValidationService.isNumber])],
            insuranceCompanyName: [this.subItems.insuranceCompanyName],
            insurerAddress: [this.subItems.insurerAddress],
            policyStartDate: [new Date(this.subItems.policyStartDate)],
            assignDate: [new Date(this.subItems.assignDate)],
            renewalFrequencyTypeId: [this.subItems.renewalFrequencyTypeId],
            insurerDetails: [this.subItems.insurerDetails],
            policyRenewalDate: [new Date(this.subItems.policyRenewalDate)],
            policyinsuranceType: [new Date(this.subItems.policyinsuranceType)],
            remark: [this.subItems.remark],
        });
        this.subForm = this.policyForm;
    }

    editImmovableProperty() {  //
        this.propertyForm = this.fb.group({
            propertyName: [this.subItems.propertyName, Validators.required],
            cityId: [this.subItems.cityId],
            countryId: [this.subItems.countryId],
            constructionDate: [new Date(this.subItems.constructionDate), Validators.required],
            propertyAddress: [this.subItems.propertyAddress, Validators.required],
            dateOfAcquisition: [new Date(this.subItems.dateOfAcquisition), Validators.required],
            lastValuationDate: [new Date(this.subItems.lastValuationDate), Validators.required],
            valuerId: [this.subItems.valuerId],
            valuerReferenceNumber: [this.subItems.valuerReferenceNumber, Validators.required],
            propertyValueBaseTypeId: [this.subItems.propertyValueBaseTypeId, Validators.required],
            openMarketValue: [(this.subItems.openMarketValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            //  collateralValue: [(this.subItems.collateralValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            forcedSaleValue: [(this.subItems.forcedSaleValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            stampToCover: [this.subItems.stampToCover, Validators.required],
            valuationAmount: [this.subItems.valuationAmount, Validators.required],
            //  collateralLocationStatus: [''],
            //   originalValue: [(this.subItems.originalValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            // availableValue: [(this.subItems.availableValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            securityValue: [(this.subItems.securityValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            //  collateralUsableAmount: [(this.subItems.collateralUsableAmount), Validators.compose([ValidationService.isNumber, Validators.required])],
            //   remark: [this.subItems.remark],
            //  nearestLandMark: [this.subItems.nearestLandMark, Validators.required],
            //   nearestBusStop: [this.subItems.nearestBusStop, Validators.required],
            isOwnerOccupied: [(this.subItems.isOwnerOccupied), this.subItems.isOwnerOccupied],
            isResidential: [(this.subItems.isResidential), this.subItems.isResidential],
            perfectionStatusId: [(this.subItems.perfectionStatusId), Validators.required],
            perfectionStatusReason: [(this.subItems.perfectionStatusReason), Validators.required],
            latitude: [this.subItems.latitude],
            longitude: [this.subItems.longitude],
            remark: [this.subItems.remark],
        });
        this.subForm = this.propertyForm;
    }

    closeMapview(evt) {
        if (evt)
            this.showLocationMap = false;
        this.showPropertyForm = true;
    }
    editCasa() {  //
        this.casaForm = this.fb.group({
            accountNumber: [this.subItems.accountNumber],
            //  isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            availableBalance: [(this.subItems.availableBalance)],
            accountName: [this.subItems.accountName],
            lienAmount: [(this.subItems.lienAmount), Validators.compose([ValidationService.isNumber])],
            securityValue: [(this.subItems.securityValue), Validators.compose([ValidationService.isNumber])],
            remark: [this.subItems.remark],
        });
        this.subForm = this.casaForm;
        ////console.log('this.casaForm ',this.casaForm );

    }

    editStock() {  //
        this.stockForm = this.fb.group({
            companyName: [this.subItems.companyName, Validators.required],
            shareQuantity: [this.subItems.shareQuantity, Validators.required],
            marketPrice: [(this.subItems.marketPrice), Validators.compose([ValidationService.isNumber, Validators.required])],
            amount: [(this.subItems.amount), Validators.compose([ValidationService.isNumber, Validators.required])],
            sharesSecurityValue: [(this.subItems.sharesSecurityValue), Validators.compose([ValidationService.isNumber, Validators.required])],
            shareValueAmountToUse: [(this.subItems.shareValueAmountToUse), Validators.compose([ValidationService.isNumber, Validators.required])],
            stockId: [(this.subItems.shareValueAmountToUse), Validators.required],

        });
        this.subForm = this.stockForm;
    }

    editDeposit() {
        this.depositForm = this.fb.group({
            // dealReferenceNumber: [this.subItems.dealReferenceNumber, Validators.required],
            //  accountNumber: [this.subItems.accountNumber, Validators.compose([ValidationService.isNumber, Validators.required])],
            //  existingLienAmount: [this.subItems.existingLienAmount],
            lienAmount: [this.subItems.lienAmount],
            availableBalance: [this.subItems.availableBalance],
            securityValue: [this.subItems.securityValue, Validators.required],
            maturityDate: [new Date(this.subItems.maturityDate), Validators.required],
            effectiveDate: [new Date(this.subItems.effectiveDate), Validators.required],
            bank: [this.subItems.bank],
            remark: [this.subItems.remark, Validators.required],
            accountName: [this.subItems.accountName],
        });
        this.subForm = this.depositForm;
        ////console.log('this.depositForm',this.depositForm);

    }

    editEquipment() {
        this.equipmentForm = this.fb.group({
            machineName: [this.subItems.machineName, Validators.required],
            //  machineType: [this.subItems.machineType, Validators.required],
            remark: [this.subItems.remark],
            machineNumber: [this.subItems.machineNumber, Validators.required],
            manufacturerName: [this.subItems.manufacturerName, Validators.required],
            yearOfManufacture: [this.subItems.yearOfManufacture, Validators.required],
            yearOfPurchase: [this.subItems.yearOfPurchase, Validators.required],
            valueBaseTypeId: [this.subItems.valueBaseTypeId, Validators.required],
            machineCondition: [this.subItems.machineCondition, Validators.required],
            machineryLocation: [this.subItems.machineryLocation, Validators.required],
            replacementValue: [this.subItems.replacementValue, Validators.required],
            equipmentSize: [this.subItems.equipmentSize, Validators.required],
            intendedUse: [this.subItems.intendedUse, Validators.required],
            description: [this.subItems.description],
        });
        this.subForm = this.equipmentForm;
    }

    editGuarantee() {

        ////console.log("Ganrantee" ,this.subItems);



        this.guaranteeForm = this.fb.group({
            collateralSubTypeId: [this.subItems.collateralSubTypeId],
            //  isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            institutionName: [this.subItems.institutionName],
            guarantorAddress: [this.subItems.guarantorAddress],
            //  guarantorReferenceNumber: [this.subItems.guarantorReferenceNumber, Validators.required],
            guaranteeValue: [this.subItems.guaranteeValue],
            //startDate: [new Date(this.subItems.startDate)],
            endDate: [new Date(this.subItems.endDate)],
            remark: [this.subItems.remark],
            firstName: [this.subItems.firstName],
            middleName: [this.subItems.middleName],
            lastName: [this.subItems.lastName],
            taxNumber: [this.subItems.taxNumber],
            bvn: [this.subItems.bvn],
            rcNumber: [this.subItems.rcNumber],
            phoneNumber1: [this.subItems.phoneNumber1],
            phoneNumber2: [this.subItems.phoneNumber2],
            emailAddress: [this.subItems.emailAddress],
            relationship: [this.subItems.relationship],
            relationshipDuration: [this.subItems.relationshipDuration],
            cStartDate: [new Date(this.subItems.cStartDate)]
        });
        this.subForm = this.guaranteeForm;
    }
    editPromissory() {


        this.promissoryForm = this.fb.group({
            promissoryEffectiveDate: [new Date(this.subItems.promissoryEffectiveDate)],
            promissoryMaturityDate: [new Date(this.subItems.promissoryMaturityDate)],
            // promissoryValue: [this.subItems.promissoryValue],
            promissoryNoteRefferenceNumber: [this.subItems.promissoryNoteRefferenceNumber],
        });
        this.subForm = this.promissoryForm;
    }
    editMiscellaneous() {
        this.miscellaneousForm = this.fb.group({
            securityName: [this.subItems.securityName, Validators.required],
            securityValue: [this.subItems.securityValue, Validators.required],
            note: [this.subItems.note, Validators.required],
            notes: this.fb.array([])
        });
        this.subForm = this.miscellaneousForm;
        this.addNoteFields(this.subItems.notes);
    }

    // endof edit methods

    clearControls() {
        this.selectedId = null;
        this.createNewFieldLabelForm();
        this.mainForm = this.fb.group({
            collateralTypeId: ['', Validators.required],
            collateralSubTypeId: ['', Validators.required],
            collateralCode: ['', Validators.required],
            collateralValue: ['', Validators.required],
            // camRefNumber: ['', Validators.required],
            // allowSharing: [false],
            // isLocationBased: [false],
            valuationCycle: [''],
            currencyId: ['1', Validators.required],
            haircut: [''] //, this.validateHaircut()],

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
        });
        this.depositForm = this.fb.group({
            //dealReferenceNumber: [''],
            // accountNumber: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            accountName: [''],
            lienAmount: ['', Validators.required],
            availableBalance: [''],
            securityValue: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            bank: ['', Validators.required],
            remark: [''],
        });
        this.casaForm = this.fb.group({
            accountNumber: ['', Validators.required],
            // isOwnedByCustomer: [false],
            // cashTypeId: ['', Validators.required],
            availableBalance: [''],
            accountName: [''],
            lienAmount: ['', Validators.required],
            securityValue: ['', Validators.required],
            remark: ['', Validators.required],
        });

        this.visitationForm = this.fb.group({
            lastVisitaionDate: [''],
            //   collateralCustomerId: [''],
            visitationRemark: [''],
            visitationDocument: ['']
        });

        this.stockForm = this.fb.group({
            //  companyName: ['', Validators.required],
            shareQuantity: ['', Validators.required],
            marketPrice: ['', Validators.required],
            amount: ['', Validators.required],
            sharesSecurityValue: ['', Validators.required],
            shareValueAmountToUse: ['', Validators.required],
            stockId: ['', Validators.required],
        });
        this.guaranteeForm = this.fb.group({
            institutionName: [''],
            guarantorAddress: ['', Validators.required],
            //   guarantorReferenceNumber: [''],
            guaranteeValue: ['', Validators.required],
            //  startDate: ['',Validators.required],
            endDate: ['', Validators.required],
            // isOwnedByCustomer: [false],
            remark: ['', Validators.required],
            firstName: [''],
            middleName: [''],
            lastName: [''],
            taxNumber: ['', Validators.required],
            bvn: [''],
            rcNumber: [''],
            phoneNumber1: ['', Validators.required],
            phoneNumber2: ['', Validators.required],
            emailAddress: ['', Validators.required],
            relationship: ['', Validators.required],
            relationshipDuration: ['', Validators.required],
            cStartDate: ['', Validators.required],
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
            policyinsuranceType: ['', Validators.required]
        });
        this.promissoryForm = this.fb.group({
            //  isOwnedByCustomer: [''],
            promissoryEffectiveDate: ['', Validators.required],
            promissoryMaturityDate: ['', Validators.required],
            // promissoryValue: ['', Validators.required],
            promissoryNoteRefferenceNumber: ['', Validators.required],

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
        });
        this.propertyForm = this.fb.group({ // COUNTRY--STATE--CITY
            propertyName: ['', Validators.required],
            cityId: ['1', Validators.required],
            countryId: ['1', Validators.required],
            constructionDate: ['', Validators.required],
            propertyAddress: ['', Validators.required],
            dateOfAcquisition: ['', Validators.required],
            lastValuationDate: ['', Validators.required],
            valuerId: ['1', Validators.required],
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
            remark: ['']
            // collateralUsableAmount: ['50000000', Validators.required],
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
        });
        this.miscellaneousForm = this.fb.group({
            securityName: ['', Validators.required],
            securityValue: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            note: ['', Validators.required],
            notes: this.fb.array([]),
        });
        this.insuranceForm = this.fb.group({
            referenceNumber: ['', Validators.required],
            sumInsured: ['0', Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: ['', Validators.required],
            startDate: ['', Validators.required],
            expiryDate: ['', Validators.required],
            insuranceType: ['', Validators.required],

        });


        this.CollateralPrimaryDocumentForm = this.fb.group({
            collateralPrimaryDocumentTitle: ['', Validators.required],
            documentTypeId: ['', Validators.required],
            collateralPrimaryDocument: [''],
            isPrimaryDocument: [false, Validators.required],

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
        ////console.log('id',id);

        this.enabledJoinCollaterGuarantee = false;

        this.collateralService.getCollateralSubTypesById(id).subscribe((response: any) => {
            this.collateralSubType = response.result;

            ////console.log(' this.collateralSubType', this.collateralSubType);


            this.haircut = this.collateralSubType.haircut;
            ////console.log('LIST >>>',  this.collateralSubType)
            this.mainForm.patchValue({
                'haircut': this.collateralSubType.haircut,
                'valuationCycle': this.collateralSubType.revaluationDuration,
                // 'isLocationBased':this.collateralSubType.isLocationBased,
                // 'allowSharing':this.collateralSubType.allowSharing
            });
            if (id == CollateralGuaranteeSubType.PERSONAL_GUARANTEE) {
                this.personal = false;
                this.corporate = true;
                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = false;
                this.garanteeList = [];

            } else if (id == CollateralGuaranteeSubType.JOIN_GUARANTEE_PERSONAL) {
                this.personal = false;
                this.corporate = true;
                this.enabledAddGuarateeButton = false;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = true;
            } else if (id == CollateralGuaranteeSubType.CORPORATE_GUARANTEE) {
                this.personal = true;
                this.corporate = false;
                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = false;
                this.garanteeList = [];
            } else if (id == CollateralGuaranteeSubType.CROSS_GUARANTEE) {
                this.personal = true;
                this.corporate = false;
                this.enabledAddGuarateeButton = false;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = false;
            } else if (id == CollateralGuaranteeSubType.JOIN_GUARANTEE_CORPORATE) {
                this.personal = true;
                this.corporate = false;
                this.enabledAddGuarateeButton = true;
                this.enabledJoinCollaterGuarantee = true;
                this.garanteeList = [];
                this.showPersonalCollateralGuaranteeTableColumn = false;
            }

            this.getOutstandingBalanceForFixedDepositOrCASA();

        }, (err) => {

        });

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
                    this.guaranteeForm.controls['guaranteeValue'].setValue(secVal)
                    break;
                case CollateralType.MISCELLANEOUS:
                    this.miscellaneousForm.controls['securityValue'].setValue(secVal);
                    break;
                default:
                    return;
            }

        }
        let accountNo = this.mainForm.get('collateralCode').value;

        if (accountNo === null) return;

        let collateralTypeID = this.mainForm.get('collateralTypeId').value

        if (collateralTypeID == CollateralType.FIXED_DEPOSIT) {
            this.getLientAmountForFD(accountNo);
        } else if (collateralTypeID == CollateralType.CASA) {
            this.casaForm.controls['accountNumber'].setValue(accountNo);
            this.getLientAmountForCASA(accountNo);
        }


    }



    //-----------------------------  GET LIENT AMOUNT AND OUTSTANDING BALANCE FOR FIXED DEPOSIT
    getLientAmountForFD(accountNo) {
        ////console.log('ACCOUNT NUMBER : ',accountNo);

        this.collateralService.getLienAmountForFD(accountNo).subscribe((response: any) => {

            // let lien = response.result;
            let securityVa = this.depositForm.get('securityValue').value;
            let securityValue = this.convertToNumber(securityVa);
            ////console.log('response.data.lienAmount : ',response.data);
            if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }

            this.depositForm.controls['lienAmount'].setValue(this.lienAmount);
            ////console.log('this.lienAmount',this.lienAmount);
            this.getFixedDepositAccountBalance(accountNo)
            ////console.log('securityValue',securityValue);

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
        ////console.log('ACCOUNT NUMBER : ',accountNo);

        this.collateralService.getLienAmountForCASA(accountNo).subscribe((response: any) => {

            //let lien = response.result;
            let securityVa = this.depositForm.get('securityValue').value;
            let securityValue = this.convertToNumber(securityVa);
            ////console.log('response.data.lienAmount : ',response.data);
            if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
            this.casaForm.controls['lienAmount'].setValue(this.lienAmount);
            ////console.log('securityVa',securityVa);

            this.getCasaAccountBalance(accountNo);

            if (this.lienAmount != null) {

                this.casaForm.controls['lienAmount'].setValue(this.lienAmount);
                this.casaForm.controls['accountName'].setValue(this.accountName);
                this.casaForm.controls['availableBalance'].setValue(this.accountBalance);
            } else {
                this.casaForm.controls['lienAmount'].setValue(0);
                this.casaForm.controls['availableBalance'].setValue(securityValue);
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

    showCollateralHistory() {
        this.displayCollateralHistory = true;
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


    submitForm() {
        //let body = this.getBody();
        ////console.log("body >>> " ,body );
        //this.collateralCode = this.mainForm.get('collateralCode').value;

        let __this = this;

        let body = this.getBody();

        if (this.selectedReleaseType == 2) {
            if (this.multipleCollaterals.length <= 0) {
                swal('FinTrak Credit 360', 'Kindly Select Collateral Document(s) To Release.', 'info');
                return
            }
        }
        swal({
            title: 'Are you sure?',
            text: 'Editing Collateral will go through approval. Are you sure you want to proceed?',
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

            __this.releaseCollateral(body);

            //  __this.displayModalForm = false;
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

        this.disableDocumentPanel = false;
        this.disableDocumentPanel = false;
    }

    releaseCollateral(form) {
        let body = form;
        this.loadingService.show();
        this.collateralService.customerCollateralRelease(body).subscribe((val: any) => {

            const success = val.success;
            if (success === true) {
                this.getCustomerCollateral(this.selectedCustomerId, this.applicationCustomerName);
                if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }
                this.disableVisitationPanel = true;
                this.loadingService.hide();
                this.router.navigate(['/credit/collateral/collateral-release-list', this.selectedId]);
                this.clearControls();
            } else {
                this.loadingService.hide();
                swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
            }

        }, (error) => {
            this.loadingService.hide(1000);
            swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
        });
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

    }

    filteredSubTypes: any[] = [];

    collateralDocumentTypes: any[];
    getAllDocumentsByColateralTypeId(id): void {
        this.loadingService.show();
        this.collateralService.getCollateralDocumentTypes(id).subscribe((response: any) => {
            this.collateralDocumentTypes = response.result;
            ////console.log('list: ',response.result);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    onCollateralTypeChange(id) {
        this.getAllDocumentsByColateralTypeId(id);
        //// console.log('--------------------o',id);
        this.referenceNumberLabel = "Reg/Ref Number";
        this.filteredSubTypes = this.subTypes.filter(x => x.collateralTypeId == id);
        this.hideAllSubForms();
        // this.selectedCollateralTypeId = id;
        // this.mainForm.controls['collateralTypeId'].setValue(id);
        // ////console.log(JSON.stringify(this.depositForm.value));
        let selected = this.collateralTypes.find(x => x.collateralTypeId == id);
        //  this.requireInsurancePolicy = selected.requireInsurancePolicy;
        //console.log('--------------------o',selected);

        const upLoadControl = this.CollateralPrimaryDocumentForm.get('documentTypeId');
        upLoadControl.setValidators(Validators.required);
        upLoadControl.updateValueAndValidity();

        if (selected !== undefined) {
            //console.log('ent1',selected);

            this.selectedCollateralTypeName = selected.collateralTypeName;
            this.disableSubFormTab = false;

            this.disableVisitationPanel = !selected.requireVisitation;
            this.enableInsuranceFormTab = !selected.requireInsurancePolicy;
        } else { // no selection
            //console.log('ento',selected);

            this.selectedCollateralTypeName = null;
            this.disableSubFormTab = true;
            this.enableInsuranceFormTab = false;
            //    this.disableVisitationPanel=true;
            this.requireInsurancePolicy = false;
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
                this.referenceNumberLabel = "Account Number";
                break;
            case CollateralType.CASA:
                this.subForm = this.casaForm;
                this.showCasaForm = true;
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

    getBody() {
        let sub = this.subForm;
        let insurance = this.insuranceForm;
        let miscel = this.miscellaneousForm;
        return {
            // main
            collateralId: this.selectedId,// || 0,
            customerId: this.selectedCustomerId,
            hasInsurance: !this.enableInsuranceFormTab,
            collateralTypeId: this.selectedRecord.collateralTypeId,
            collateralSubTypeId: this.selectedRecord.collateralSubTypeId,
            collateralCode: this.selectedRecord.collateralCode,
            collateralValue: this.selectedRecord.collateralValue,
            // camRefNumber: this.selectedRecord.camRefNumber,
            // allowSharing: this.selectedRecord.allowSharing,
            // isLocationBased: this.selectedRecord.isLocationBased,
            valuationCycle: this.selectedRecord.valuationCycle,
            haircut: this.selectedRecord.haircut,
            currencyId: this.selectedRecord.currencyId,

            // // deposit
            dealReferenceNumber: this.selectedRecord.dealReferenceNumber,
            accountNumber: this.selectedRecord.accountNumber,
            bank: this.selectedRecord.bank,

            //  existingLienAmount: this.selectedRecord.existingLienAmount,
            lienAmount: this.selectedRecord.lienAmount,
            availableBalance: this.selectedRecord.availableBalance,
            securityValue: this.selectedRecord.securityValue,
            maturityDate: this.selectedRecord.maturityDate,
            maturityAmount: this.selectedRecord.maturityAmount,
            remark: this.selectedRecord.remark,

            // equipment
            machineName: this.selectedRecord.machineName,
            description: this.selectedRecord.description,
            machineNumber: this.selectedRecord.machineNumber,
            manufacturerName: this.selectedRecord.manufacturerName,
            yearOfManufacture: this.selectedRecord.yearOfManufacture,
            yearOfPurchase: this.selectedRecord.yearOfPurchase,
            valueBaseTypeId: this.selectedRecord.valueBaseTypeId,
            machineCondition: this.selectedRecord.machineCondition,
            machineryLocation: this.selectedRecord.machineryLocation,
            replacementValue: this.selectedRecord.replacementValue,
            equipmentSize: this.selectedRecord.equipmentSize,
            intendedUse: this.selectedRecord.intendedUse,

            // miscellaneous
            securityName: this.selectedRecord.securityName,
            notes: this.selectedRecord.notes,
            note: this.selectedRecord.note,

            // insurance
            referenceNumber: this.selectedRecord.referenceNumber,
            sumInsured: this.selectedRecord.sumInsured,
            insuranceCompany: this.selectedRecord.insuranceCompany,
            startDate: this.selectedRecord.startDate,
            expiryDate: this.selectedRecord.expiryDate,
            insuranceType: this.selectedRecord.insuranceType,

            // guarantee
            collateralGauranteeId: this.selectedRecord.collateralGauranteeId,
            collateralCustomerId: this.selectedRecord.collateralCustomerId,
            //   isOwnedByCustomer: this.selectedRecord.isOwnedByCustomer,
            institutionName: this.selectedRecord.institutionName,
            guarantorAddress: this.selectedRecord.guarantorAddress,
            //   guarantorReferenceNumber: this.selectedRecord.guarantorReferenceNumber,
            guaranteeValue: this.selectedRecord.guaranteeValue,
            endDate: this.selectedRecord.endDate,
            firstName: this.selectedRecord.firstName,
            middleName: this.selectedRecord.middleName,
            lastName: this.selectedRecord.lastName,
            taxNumber: this.selectedRecord.taxNumber,
            bvn: this.selectedRecord.bvn,
            rcNumber: this.selectedRecord.rcNumber,
            phoneNumber1: this.selectedRecord.phoneNumber1,
            phoneNumber2: this.selectedRecord.phoneNumber2,
            emailAddress: this.selectedRecord.emailAddress,
            relationship: this.selectedRecord.relationship,
            relationshipDuration: this.selectedRecord.relationshipDuration,
            cStartDate: this.selectedRecord.cStartDate,

            //cross and several
            // crossGarantee:this.garanteeList,

            // casa
            collateralCasaId: this.selectedRecord.collateralCasaId,

            // immovableProperty
            collateralPropertyId: this.selectedRecord.collateralPropertyId,
            propertyName: this.selectedRecord.propertyName,
            cityId: this.selectedRecord.cityId,
            countryId: this.selectedRecord.countryId,
            constructionDate: this.selectedRecord.constructionDate,
            propertyAddress: this.selectedRecord.propertyAddress,
            dateOfAcquisition: this.selectedRecord.dateOfAcquisition,
            lastValuationDate: this.selectedRecord.lastValuationDate,
            valuerId: this.selectedRecord.valuerId,
            valuerReferenceNumber: this.selectedRecord.valuerReferenceNumber,
            propertyValueBaseTypeId: this.selectedRecord.propertyValueBaseTypeId,
            openMarketValue: this.selectedRecord.openMarketValue,
            forcedSaleValue: this.selectedRecord.forcedSaleValue,
            stampToCover: this.selectedRecord.stampToCover,
            valuationSource: this.selectedRecord.valuationSource,
            originalValue: this.selectedRecord.originalValue,
            availableValue: this.selectedRecord.availableValue,
            collateralUsableAmount: this.selectedRecord.collateralUsableAmount,
            nearestLandMark: this.selectedRecord.nearestLandMark,
            nearestBusStop: this.selectedRecord.nearestBusStop,
            longitude: this.selectedRecord.longitude,
            latitude: this.selectedRecord.latitude,
            perfectionStatusId: this.selectedRecord.perfectionStatusId,
            perfectionStatusReason: this.selectedRecord.perfectionStatusReason,
            // marketableSecurities
            collateralMarketableSecurityId: this.selectedRecord.collateralMarketableSecurityId,
            securityType: this.selectedRecord.securityType,
            effectiveDate: this.selectedRecord.effectiveDate,
            dealAmount: this.selectedRecord.dealAmount,
            lienUsableAmount: this.selectedRecord.lienUsableAmount,
            issuerName: this.selectedRecord.issuerName,
            issuerReferenceNumber: this.selectedRecord.issuerReferenceNumber,
            unitValue: this.selectedRecord.unitValue,
            numberOfUnits: this.selectedRecord.numberOfUnits,
            rating: this.selectedRecord.rating,
            percentageInterest: this.selectedRecord.percentageInterest,
            interestPaymentFrequency: this.selectedRecord.interestPaymentFrequency,
            isOwnerOccupied: this.selectedRecord.isOwnerOccupied,
            isResidential: this.selectedRecord.isResidential,

            // policy
            collateralInsurancePolicyId: this.selectedRecord.collateralInsurancePolicyId,
            insurancePolicyNumber: this.selectedRecord.insurancePolicyNumber,
            premiumAmount: this.selectedRecord.premiumAmount,
            policyAmount: this.selectedRecord.policyAmount,
            insuranceCompanyName: this.selectedRecord.insuranceCompanyName,
            insurerAddress: this.selectedRecord.insurerAddress,
            policyStartDate: this.selectedRecord.policyStartDate,
            assignDate: this.selectedRecord.assignDate,
            renewalFrequencyTypeId: this.selectedRecord.renewalFrequencyTypeId,
            insurerDetails: this.selectedRecord.insurerDetails,
            policyRenewalDate: this.selectedRecord.policyRenewalDate,
            policyinsuranceType: this.selectedRecord.policyinsuranceType,

            // preciousMetal
            collateralPreciousMetalId: this.selectedRecord.collateralPreciousMetalId,
            preciousMetalName: this.selectedRecord.preciousMetalName,
            weightInGrammes: this.selectedRecord.weightInGrammes,
            valuationAmount: this.selectedRecord.valuationAmount,
            metalValuationAmount: this.selectedRecord.metalValuationAmount,
            metalUnitRate: this.selectedRecord.metalUnitRate,
            preciousMetalFrm: this.selectedRecord.preciousMetalFrm,
            metalType: this.selectedRecord.metalType,

            // stock
            collateralStockId: this.selectedRecord.collateralStockId,
            companyName: this.selectedRecord.stockId,
            shareQuantity: this.selectedRecord.shareQuantity,
            marketPrice: this.selectedRecord.marketPrice,
            amount: this.selectedRecord.amount,
            sharesSecurityValue: this.selectedRecord.sharesSecurityValue,
            shareValueAmountToUse: this.selectedRecord.shareValueAmountToUse,

            // vehicle
            collateralVehicleId: this.selectedRecord.collateralVehicleId,
            vehicleType: this.selectedRecord.vehicleType,
            vehicleStatus: this.selectedRecord.vehicleStatus,
            vehicleMake: this.selectedRecord.vehicleMake,
            modelName: this.selectedRecord.modelName,
            dateOfManufacture: this.selectedRecord.dateOfManufacture,
            registrationNumber: this.selectedRecord.registrationNumber,
            serialNumber: this.selectedRecord.serialNumber,
            chasisNumber: this.selectedRecord.chasisNumber,
            engineNumber: this.selectedRecord.engineNumber,
            nameOfOwner: this.selectedRecord.nameOfOwner,
            registrationCompany: this.selectedRecord.registrationCompany,
            resaleValue: this.selectedRecord.resaleValue,
            valuationDate: this.selectedRecord.valuationDate,
            lastValuationAmount: this.selectedRecord.lastValuationAmount,
            invoiceValue: this.selectedRecord.invoiceValue,


            // promissory
            promissoryEffectiveDate: this.selectedRecord.promissoryEffectiveDate,
            promissoryMaturityDate: this.selectedRecord.promissoryMaturityDate,
            //promissoryValue: this.selectedRecord.promissoryValue,
            promissoryNoteRefferenceNumber: this.selectedRecord.promissoryNoteRefferenceNumber,
            releaseType: this.releaseType,
            comment: this.comment,

            documents: this.selectedReleaseType == 1 ? null : this.multipleCollaterals,

        };
    }

    payloadDiognostic(form) {
        // this.body = this.selectedRecord.indexFields;
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
    @ViewChild('fileInput', {static: false}) fileInput: any;

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
            };


            if (this.file != undefined || this.uploadFileTitle != null) {
                // console.log('this.tempCollateralId ', this.tempCollateralId);

                this.loadingService.show();

                if (this.selectedId != null && this.selectedId != undefined && this.selectedId != 0) {

                    let body = {
                        collateralId: this.selectedId,
                        documentTitle: this.uploadFileTitle, // document code
                        fileName: this.file.name,
                        fileExtension: this.fileExtention(this.file.name),
                        collateralCode: this.collateralCode
                    };

                    this.collateralService.uploadFile(this.file, body).then((val: any) => {
                        this.getSupportingDocuments();
                        this.loadingService.hide();
                    }, (error) => {
                        this.loadingService.hide(1000);
                        ////console.log("error", error);
                    });
                } else {

                    if (this.tempCollateralId != undefined && this.tempCollateralId != null && this.tempCollateralId != '') {

                        let body = {
                            collateralId: this.tempCollateralId,
                            documentTitle: this.uploadFileTitle, // document code
                            fileName: this.file.name,
                            fileExtension: this.fileExtention(this.file.name),
                            collateralCode: this.collateralCode
                        };

                        this.collateralService.uploadTempFile(this.file, body).then((val: any) => {

                            this.getSupportingDocumentByTempCollateralId();

                            this.loadingService.hide();
                        }, (error) => {
                            this.loadingService.hide(1000);
                            ////console.log("error", error);
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

            ////console.log('body >>>> ',body);

            this.loadingService.show();
            this.collateralService.postCollateralInformation(this.file, body).then((val: any) => {

                const success = val.success;
                this.tempCollateralId = val.result;

                //console.log('this.tempCollateralId', this.tempCollateralId);

                if (success === true) {

                    this.clearControls();
                    this.getCustomerCollateral(this.selectedCustomerId, this.applicationCustomerName);
                    if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }

                    this.disableVisitationPanel = true;

                    this.loadingService.hide();

                    swal('FinTrak Credit 360', "Collateral captured and await approval", 'success');

                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
                }

            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
                swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
            });
        }
    }

    updateCollateralInformation(form) {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                formData: JSON.stringify(form),
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };

            ////console.log('body >>>> ',body);

            this.loadingService.show();
            this.collateralService.postCollateralInformation(this.file, body).then((val: any) => {

                const success = val.success;
                ////console.log('success',success);

                if (success === true) {

                    this.clearControls();
                    this.getCustomerCollateral(this.selectedCustomerId, this.applicationCustomerName);
                    if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }
                    this.disableVisitationPanel = true;
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', "Collateral edited and await approval", 'success');

                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
                }

            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
                swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
            });
        }
    }

    postJoinCollateralInformationWithImage(form) {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                formData: JSON.stringify(form),
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };

            this.loadingService.show();

            this.collateralService.postJoinCollateralInformation(this.file, body).then((val: any) => {
                this.garanteeList = [];
                this.garanteeList = val.result;
                this.joinGuaranteeCollateralId = val.result[0].collateralId;

                const success = val.success;

                ////console.log('success',success);


                if (success === true) {

                    this.getCustomerCollateral(this.selectedCustomerId, this.applicationCustomerName);

                    if (this.autoMapNew == true) { this.mapCollateral(null, form.collateralCode); }

                    this.disableVisitationPanel = true;

                    this.loadingService.hide();

                    swal('FinTrak Credit 360', val.message, 'success');
                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
                }

            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
                swal('FinTrak Credit 360', "Saving Failed with error :" + error, 'error');
            });
        }
    }


    uploadVisitationFile(frm) {

        //  console.log('this.selectedId >><<<>>', this.selectedId);

        this.loadingService.show();

        if (this.selectedId != null && this.selectedId != undefined && this.selectedId != 0) {

            let body = {
                lastVisitaionDate: this.lastVisitaionDate,
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
                ////console.log("error", error);
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
                    ////console.log("error", error);
                });
            } else {
                swal('FinTrak Credit 360', "Kindly save the collateral Information before document upload", 'error')

            }

        }
        this.uploadFileTitle = null;
        this.fileInput.nativeElement.value = "";
        this.visitationRemark = '';
        this.fileInput.nativeElement.value = ""

    }

    getVisitationDetail(CollateralId) {

        //loan-visitation/{collateralVisitationId}
        this.collateralService.getCollateralVisitationDetail(CollateralId).subscribe((response: any) => {
            this.visitationDetail = response.result;

            ////console.log('Visitation documents..',  this.visitationDetail);
        });
    }



    getTempCollateralVisitationDetail(tempCollateralId) {

        //loan-visitation/{collateralVisitationId}
        this.collateralService.getTempCollateralVisitationDetail(tempCollateralId).subscribe((response: any) => {
            this.visitationDetail = response.result;

            ////console.log('Visitation documents..',  this.visitationDetail);
        });
    }
    IsInsurancePolicyInEditMood: boolean = false;
    getInsurancePolicies(collateralCustomerId) {
        collateralCustomerId = this.selectedId

        //loan-visitation/{collateralVisitationId}
        this.collateralService.getInsurancePolicies(collateralCustomerId).subscribe((response: any) => {
            this.insurancePolicies = response.result;
            ////console.log('insurancePolicies..',  this.insurancePolicies);

            this.IsInsurancePolicyInEditMood = true;
        });
    }

    geStockPrice() {
        this.collateralService.getStockPrice().subscribe((response: any) => {
            this.stockPriceList = response.result;

            ////console.log('stockPrice >>>>',  this.stockPriceList);
        });
    }


    getSupportingDocuments() {

        this.collateralService.getCollateralDocument(this.selectedId).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        });
    }

    getSupportingDocumentByTempCollateralId() {

        this.collateralService.getTempCollateralDocument(this.tempCollateralId).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
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
    //     // ////console.log("binary file..", this.binaryFile);
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
        // ////console.log("binary file..", this.binaryFile);
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
        ////console.log('documentId',id);

        this.collateralService.getCollateralVisitationFile(id).subscribe((response: any) => {
            let doc = response.result;
            ////console.log('doc',doc);

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
        ////console.log('id',id);

        let doc = this.visitationDetail.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }
        // ////console.log("binary file..", this.binaryFile);
    }
    downloadAttachment(id) {
        const downloadWindow = window.open('about:blank');
        this.collateralService.getCollateralVisitationFile(id).subscribe(downloadUrl => {
            downloadWindow.location.href = downloadUrl;
        });
    }

    ViewCollateralGuaranteeDocument(id) {
        this.loadingService.show();
        this.collateralService.getCollateralGuaranteeFile(id).subscribe((response: any) => {
            this.imageData = response.result;

            ////console.log('documents..',  this.imageData);


            let doc = this.imageData.find(x => x.targetId == id);
            if (doc != null) {

                ////console.log('doc.fileData..',  doc.fileData);

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

    getCollateralHistory(collateralId) {
        this.collateralService.getCollateralHistory(collateralId).subscribe((response: any) => {
            this.collateralHistory = response.result.usage;
            this.collateralUsage = response.result;
            // ////console.log('collateralHistory.', response.result);
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
        ////console.log('stockPriceList ...>>>', this.stockPriceList);
        let item = this.stockPriceList.find(x => x.stockId == id);

        ////console.log('item ...>>>', item);

        this.stockForm.controls['marketPrice'].setValue(item.stockPrice);
    }
    AddStockValue() {
        let amount = this.stockForm.get('amount').value;
        let total = this.stockForm.get('shareValueAmountToUse').value;
        let grantTotal = (+total) + (+amount)
        this.stockForm.controls['shareValueAmountToUse'].setValue(grantTotal);


        this.stockForm.controls['shareQuantity'].setValue(0);
        this.stockForm.controls['marketPrice'].setValue(0);
        this.stockForm.controls['amount'].setValue(0);
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
    isPrimaryLabel: string = 'Required'
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
        });

    }
    disabledInputs() {
        this.isCollateralCodeVisible = true;
    }
    enabledInputs() {
        this.isCollateralCodeVisible = null;
    }
    clearInsurance() {
        this.insuranceForm = this.fb.group({
            referenceNumber: ['', Validators.required],
            sumInsured: ['0', Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: ['', Validators.required],
            startDate: ['', Validators.required],
            expiryDate: ['', Validators.required],
            insuranceType: ['', Validators.required],

        });
    }
    getCasaAccountBalance(acctNumber) {
        this.casaSrv.getCustomerAccountBalance(acctNumber).subscribe((response: any) => {
            if (response.result != undefined) {

                if (response.success == false) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                } else {
                    console.log('response.result', response.result);

                    this.accountBalance = response.result.availableBalance;
                    this.accountName = response.result.accountName;
                }
            }
        });
    }
    getFixedDepositAccountBalance(acctNumber) {

        this.collateralService.getFixedDepositAccountDetail(acctNumber).subscribe((response: any) => {
            if (response.result != undefined) {
                this.accountBalance = response.result.balance;
                this.accountName = response.result.accountName;
            }
        });
    }
    multipleCollaterals: any[] = [];
    temporaryRelease: boolean = false;
    selectedReleaseType: number;
    onReleaseTypeChange(id) {
        this.selectedReleaseType = id;
        if (id == 1) { // Final Release
            this.multipleCollaterals = [];
            this.temporaryRelease = false;
        } else if (id == 2) {
            this.multipleCollaterals = [];
            this.temporaryRelease = true;
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
