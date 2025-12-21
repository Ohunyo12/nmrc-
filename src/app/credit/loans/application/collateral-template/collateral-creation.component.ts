import { Component, OnInit, ViewChild, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../../shared/services/validation.service';
import { ApprovalStatus } from '../../../../shared/constant/app.constant';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CollateralService, CurrencyService, DocumentService } from '../../../../setup/services';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { LedgerService } from '../../../../setup/services/ledger.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-collateral-creation',
    templateUrl: './collateral-creation.component.html',
    //styleUrls: ['./collateral-creation.component.scss']
})
export class CollateralCreationComponent implements OnInit {

    readonly TEST_DATE = new Date('2017-10-08');
    
    readonly MARKETABLE_SECURITIES = 1;
    readonly IMMOVABLE_PROPERTY = 2;
    readonly PLANT_AND_EQUIPMENT = 3;
    readonly POLICY = 4;
    readonly VEHICLE = 5;
    readonly PRECIOUS_METAL = 6;
    readonly FIXED_DEPOSIT = 7;
    readonly CASA = 8;
    readonly GUARANTEE = 9;
    readonly STOCK = 14;
    readonly MISCELLANEOUS = 17;
    
    collateralType:any;
    customerCollaterals: any[];
    collateralTypes: any[] = [];
    displayModalForm: boolean = false; 
    activeTabIndex: number = 0;
    selectedId: number = null;
    selectedCollateralTypeId: number = null;
    entityName: string = 'Collateral Information';
    show: boolean = false; message: any; title: any; cssClass: any; // message box

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
    showInsuranceForm: boolean = false;
    showCustomerCollaterals: boolean = false;

    payload: any = {};
    defaultSubTabName: string = 'Collateral Type Details';
    selectedCollateralTypeName: string = this.defaultSubTabName;
    disableSubFormTab: boolean = true;
    enableInsuranceFormTab: boolean = false;
    subTypes: any[];
    currencies: any[] = [];
    applicationId: number;
    selectedCustomerId: number;

    @Input() collateral: any[];
    @Input() customerId: number;
    @Output() hideForm: EventEmitter<any> = new EventEmitter<string>();
    
    constructor( 
        private fb: FormBuilder, 
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private locationService: CountryStateService,
        private ledgerService: LedgerService,
        private currencyService: CurrencyService,
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private router: Router,
    
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        // if(this.collateralId > 0){
        //     this.editCustomerCollateral()
        // }
        // if(this.collateral.length > 0){
        //     alert(this.collateral.values );
        //     this.getCustomerCollateral(this.customerId);           
        //     this.editCustomerCollateral(this.collateral) 
        // }
      this.selectedCustomerId = this.customerId;
    }
    ngOnInit() {

        this.clearControls();
        this.loadDropdowns();
        this.development(); // ------------------------------------dev mode
       // let customerId  =  +this.route.snapshot.params['customerId'];   
  ////console.log(customerId);
    //   this.applicationId =  +this.route.snapshot.params['applicationId'];  
    this.selectedCustomerId = this.customerId;
    ////console.log( this.customerId);
    
    
    }
    gotoLoanEligibility(){
        this.router.navigate(['/credit/loan/loan-eligibility-requirement',this.applicationId]);
        
    }

    development() {
        // this.getCustomerCollateral(2);
        // this.onCollateralTypeChange(this.GUARANTEE);
        //let body = {"customerId":2,"collateralTypeId":"7","collateralSubTypeId":"11","collateralCode":"CD8D5DD63D","camRefNumber":"248SSSSSSGGHH","allowSharing":false,"isLocationBased":false,"valuationCycle":"30","haircut":"59","dealReferenceNumber":"erererer","accountType":"1","accountNumber":"434rdf4343df433","existingLienAmount":false,"lienAmount":"434,344,343.00","availableBalance":"434,343.00","securityValue":"43,434.00","maturityDate":"2017-09-19T23:00:00.000Z","maturityAmount":"434,344,343,443.00","remark":"dfdd"};
        //this.collateralService.saveCustomerCollateral(body);
        // this.selectedId = 120;
        // this.getSupportingDocuments();
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
        this.hideForm.emit(false);
    }

    loadDropdowns() {
        this.locationService.getAllCities().subscribe((response: any) => {
           this.cities = response.result;
        });
        this.locationService.getAllCountries().subscribe((response: any) => {
           this.countries = response.result;
        });
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
           this.collateralTypes = response.result;
           ////console.log('ct ==> ', response.result);
           
        });
        this.collateralService.getCollateralSubTypes().subscribe((response: any) => {
           this.subTypes = response.result;
           ////console.log('cst ==> ', response.result);
           
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
    }

    populateValueBaseType(collateralType)
    {
        
        this.collateralService.getValueBaseTypes(collateralType).subscribe((response: any) => {
            this.valueBaseTypes = response.result;
         });
    }

    getCustomerCollateral(id): void {
        ////console.log(id);
        
        if(+id  == 0){ 
            this.selectedCustomerId = id;
            this.showCustomerCollaterals = true;
        }
        
        if(+id  > 0){
        this.selectedCustomerId = id;
        ////console.log('emmitting customer id...', id);
        this.loadingService.show();
        this.collateralService.getCustomerCollateral(id).subscribe((response: any) => {
            this.customerCollaterals = response.result;
            this.showCustomerCollaterals = true;
            ////console.log('getting collaterals...', response);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }); 
     }      
    }

    showModalForm() {
        if (this.selectedCustomerId > 0) {
            this.clearControls();
            this.displayModalForm = true;
        }
    }

    editCustomerCollateral(index) {
        var row = index//  this.customerCollaterals.find(x=> x.collateralId === +index);
        ////console.log('edit collateral...', row);
        this.selectedId = row.collateralId;
        this.mainForm = this.fb.group({
            collateralTypeId: [row.collateralTypeId, Validators.required],
            collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
            collateralCode: [row.collateralCode, Validators.required],
            collateralValue: [row.collateralValue, Validators.required],
            camRefNumber: [row.camRefNumber, Validators.required],
            allowSharing: [row.allowSharing],
            isLocationBased: [row.isLocationBased],
            valuationCycle: [row.valuationCycle, Validators.required],
            currencyId: [row.currencyId, Validators.required],
            haircut: [row.haircut, this.validateHaircut()],
        });
        this.displayModalForm = true;
        this.onCollateralTypeChange(row.collateralTypeId);
        this.onSubTypeChange(row.collateralSubTypeId);
        this.getSubFormItems(row.collateralId,row.collateralTypeId);
        ////console.log('subtype @ edit...', row.collateralSubTypeId);
    }

    subItems: any = {};

    getSubFormItems(collateralId, typeId): void { 
        ////console.log('getting sub items...', collateralId);
        this.loadingService.show();
        this.collateralService.GetCollateralDetailsByCollateral(collateralId, typeId).subscribe((response: any) => {
            this.subItems = response.result;
            ////console.log('sub items...', response);
            this.loadingService.hide();
            this.editSubForm(typeId);
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    editSubForm(id: number): void {
        switch(+id) {
            case this.MARKETABLE_SECURITIES: this.editMarketableSecurity(); break;
            case this.IMMOVABLE_PROPERTY: this.editImmovableProperty(); break;
            case this.PLANT_AND_EQUIPMENT: this.editEquipment(); break;
            case this.POLICY: this.editPolicy(); break;
            case this.VEHICLE: this.editVehicle(); break;
            case this.PRECIOUS_METAL: this.editPreciousMetal(); break;
            case this.FIXED_DEPOSIT: this.editDeposit(); break;
            case this.CASA: this.editCasa(); break;
            case this.STOCK: this.editStock(); break;
            case this.GUARANTEE: this.editGuarantee(); break;
            case this.MISCELLANEOUS: this.editMiscellaneous(); break;
            default: return;
        }
        this.editInsurance();
        this.getSupportingDocuments();
    }

    // edit methods

    editInsurance() {  
        this.insuranceForm = this.fb.group({
            referenceNumber: [this.subItems.referenceNumber, Validators.required],
            sumInsured: [(this.subItems.sumInsured).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: [this.subItems.insuranceCompany, Validators.required],
            startDate: [new Date(this.subItems.startDate), Validators.required],
            expiryDate: [new Date(this.subItems.expiryDate), Validators.required],
        });    
    }

    editVehicle() { 
        this.vehicleForm = this.fb.group({
            vehicleType: [this.subItems.vehicleType, Validators.required],
            vehicleStatus: [this.subItems.vehicleStatus, Validators.required],
            vehicleMake: [this.subItems.vehicleMake, Validators.required],
            modelName: [this.subItems.modelName, Validators.required],
            manufacturedDate: [this.subItems.manufacturedDate, Validators.required],
            registrationNumber: [this.subItems.registrationNumber, Validators.required],
            serialNumber: [this.subItems.serialNumber, Validators.required],
            chasisNumber: [this.subItems.chasisNumber, Validators.required],
            engineNumber: [this.subItems.engineNumber, Validators.required],
            nameOfOwner: [this.subItems.nameOfOwner, Validators.required],
            registrationCompany: [this.subItems.registrationCompany, Validators.required],
            resaleValue: [(this.subItems.resaleValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            valuationDate: [new Date(this.subItems.valuationDate), Validators.required],
            lastValuationAmount: [(this.subItems.lastValuationAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            invoiceValue: [(this.subItems.invoiceValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.vehicleForm;
    }

    editPreciousMetal() {  // doing
        this.preciousMetalForm = this.fb.group({
            isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            preciousMetalName: [this.subItems.preciousMetalName, Validators.required],
            weightInGrammes: [this.subItems.weightInGrammes, Validators.required],
            valuationAmount: [(this.subItems.valuationAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            unitRate: [this.subItems.unitRate, Validators.required],
            preciousMetalForm: [this.subItems.preciousMetalForm, Validators.required],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.preciousMetalForm;
    }

    editMarketableSecurity() { 
        this.securityForm = this.fb.group({
            securityType: [this.subItems.securityType, Validators.required],
            dealReferenceNumber: [this.subItems.dealReferenceNumber, Validators.required],
            effectiveDate: [new Date(this.subItems.effectiveDate), Validators.required],
            maturityDate: [new Date(this.subItems.maturityDate), Validators.required],
            dealAmount: [(this.subItems.dealAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            securityValue: [(this.subItems.securityValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            lienUsableAmount: [(this.subItems.lienUsableAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            issuerName: [this.subItems.issuerName, Validators.required],
            issuerReferenceNumber: [this.subItems.issuerReferenceNumber, Validators.required],
            unitValue: [(this.subItems.unitValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            numberOfUnits: [this.subItems.numberOfUnits, Validators.required],
            rating: [this.subItems.rating, Validators.required],
            percentageInterest: [this.subItems.percentageInterest, Validators.required],
            interestPaymentFrequency: [this.subItems.interestPaymentFrequency, Validators.required],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.securityForm;
    }

    editPolicy() {  //
        this.policyForm = this.fb.group({
            isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            insurancePolicyNumber: [this.subItems.insurancePolicyNumber, Validators.required],
            premiumAmount: [(this.subItems.premiumAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            policyAmount: [(this.subItems.policyAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompanyName: [this.subItems.insuranceCompanyName, Validators.required],
            insurerAddress: [this.subItems.insurerAddress, Validators.required],
            policyStartDate: [new Date(this.subItems.policyStartDate), Validators.required],
            assignDate: [new Date(this.subItems.assignDate), Validators.required],
            renewalFrequencyTypeId: [this.subItems.renewalFrequencyTypeId, Validators.required],
            insurerDetails: [this.subItems.insurerDetails, Validators.required],
            policyRenewalDate: [new Date(this.subItems.policyRenewalDate), Validators.required],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.policyForm;
    }

    editImmovableProperty() {  //
        this.propertyForm = this.fb.group({
            propertyName: [this.subItems.propertyName, Validators.required],
            cityId: [this.subItems.cityId, Validators.required],
            countryId: [this.subItems.countryId, Validators.required],
            constructionDate: [new Date(this.subItems.constructionDate), Validators.required],
            propertyAddress: [this.subItems.propertyAddress, Validators.required],
            dateOfAcquisition: [new Date(this.subItems.dateOfAcquisition), Validators.required],
            lastValuationDate: [new Date(this.subItems.lastValuationDate), Validators.required],
            valuerId: [this.subItems.valuerId, Validators.required],
            valuerReferenceNumber: [this.subItems.valuerReferenceNumber, Validators.required],
            propertyValueBaseTypeId: [this.subItems.propertyValueBaseTypeId, Validators.required],
            openMarketValue: [(this.subItems.openMarketValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            collateralValue: [(this.subItems.collateralValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            forcedSaleValue: [(this.subItems.forcedSaleValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            stampToCover: [this.subItems.stampToCover, Validators.required],
            valuationSource: [this.subItems.valuationSource, Validators.required],
            originalValue: [(this.subItems.originalValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            availableValue: [(this.subItems.availableValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            securityValue: [(this.subItems.securityValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            collateralUsableAmount: [(this.subItems.collateralUsableAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            remark: [this.subItems.remark],
            nearestLandMark: [this.subItems.nearestLandMark, Validators.required],
            nearestBusStop: [this.subItems.nearestBusStop, Validators.required],
            longitude: [(this.subItems.longitude).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            latitude: [(this.subItems.latitude).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
        });    
        this.subForm = this.propertyForm;
    }

    editCasa() {  //
        this.casaForm = this.fb.group({
            accountNumber: [this.subItems.accountNumber, Validators.required],
            isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            availableBalance: [(this.subItems.availableBalance).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            existingLienAmount: [(this.subItems.existingLienAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            lienAmount: [(this.subItems.lienAmount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            securityValue: [(this.subItems.securityValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.casaForm;
    }
    
    editStock() {  //
        this.stockForm = this.fb.group({
            companyName: [this.subItems.companyName, Validators.required],
            shareQuantity: [this.subItems.shareQuantity, Validators.required],
            marketPrice: [(this.subItems.marketPrice).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            amount: [(this.subItems.amount).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            sharesSecurityValue: [(this.subItems.sharesSecurityValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            shareValueAmountToUse: [(this.subItems.shareValueAmountToUse).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
        });    
        this.subForm = this.stockForm;
    }

    editDeposit() {
        this.depositForm = this.fb.group({
            dealReferenceNumber: [this.subItems.dealReferenceNumber, Validators.required],
            accountNumber: [this.subItems.accountNumber, Validators.required],
            existingLienAmount: [this.subItems.existingLienAmount],
            lienAmount: [this.subItems.lienAmount, Validators.required],
            availableBalance: [this.subItems.availableBalance, Validators.required],
            securityValue: [this.subItems.securityValue, Validators.required],
            maturityDate: [new Date(this.subItems.maturityDate), Validators.required],
            maturityAmount: [this.subItems.maturityAmount, Validators.required],
            remark: [this.subItems.remark],
        });
        this.subForm = this.depositForm;
    }
    
    editEquipment() { 
        this.equipmentForm = this.fb.group({
            machineName: [this.subItems.machineName, Validators.required],
            description: [this.subItems.description, Validators.required],
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
        });
        this.subForm = this.equipmentForm;
    }

    editGuarantee() { 
        this.guaranteeForm = this.fb.group({
            collateralSubTypeId: [this.subItems.collateralSubTypeId, Validators.required],
            isOwnedByCustomer: [this.subItems.isOwnedByCustomer, Validators.required],
            institutionName: [this.subItems.institutionName, Validators.required],
            guarantorAddress: [this.subItems.guarantorAddress, Validators.required],
            guarantorReferenceNumber: [this.subItems.guarantorReferenceNumber, Validators.required],
            guaranteeValue: [(this.subItems.guaranteeValue).toString(), Validators.compose([ValidationService.isNumber, Validators.required])],
            startDate: [new Date(this.subItems.startDate), Validators.required],
            endDate: [new Date(this.subItems.endDate), Validators.required],
            remark: [this.subItems.remark],
        });    
        this.subForm = this.guaranteeForm;
    }

    editMiscellaneous() {
        this.miscellaneousForm = this.fb.group({
            securityName: [this.subItems.securityName, Validators.required],
            securityValue: [this.subItems.securityValue, Validators.required],
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
            camRefNumber: ['', Validators.required],
            allowSharing: [false],
            isLocationBased: [false],
            valuationCycle: ['', Validators.required],
            currencyId: ['', Validators.required],
            haircut: ['', this.validateHaircut()],
        });
        // subforms
        this.subForm = this.fb.group({});
        this.insuranceForm = this.fb.group({});

        this.securityForm = this.fb.group({
            securityType: ['', Validators.required],
            rating: ['', Validators.required],
            dealReferenceNumber: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            dealAmount: ['', Validators.required],
            securityValue: ['', Validators.required],
            lienUsableAmount: ['', Validators.required],
            issuerName: ['', Validators.required],
            issuerReferenceNumber: ['', Validators.required],
            unitValue: ['', Validators.required],
            numberOfUnits: ['', Validators.required],
            percentageInterest: ['', Validators.required],
            interestPaymentFrequency: ['', Validators.required],
            remark: [''],
        });
        this.depositForm = this.fb.group({
            dealReferenceNumber: ['', Validators.required],
            accountNumber: ['', Validators.required],
            existingLienAmount: [''],
            lienAmount: ['', Validators.required],
            availableBalance: ['', Validators.required],
            securityValue: ['', Validators.required],
            maturityDate: ['', Validators.required],
            maturityAmount: ['', Validators.required],
            remark: [''],
        });
        this.casaForm = this.fb.group({
            accountNumber: ['', Validators.required],
            isOwnedByCustomer: [false],
            cashTypeId: ['', Validators.required],
            availableBalance: ['', Validators.required],
            existingLienAmount: [''],
            lienAmount: [''],
            securityValue: [''],
            remark: [''],
        });
        this.stockForm = this.fb.group({
            companyName: ['', Validators.required],
            shareQuantity: ['', Validators.required],
            marketPrice: ['', Validators.required],
            amount: ['', Validators.required],
            sharesSecurityValue: ['', Validators.required],
            shareValueAmountToUse: ['', Validators.required],
        });
        this.guaranteeForm = this.fb.group({
            institutionName: [''],
            guarantorAddress: [''],
            guarantorReferenceNumber: [''],
            guaranteeValue: [''],
            startDate: [''],
            endDate: [''],
            isOwnedByCustomer: [false],
            remark: [''],
        });
        this.policyForm = this.fb.group({
            isOwnedByCustomer: [''],
            insurancePolicyNumber: [''],
            premiumAmount: [''],
            policyAmount: [''],
            insuranceCompanyName: [''],
            insurerAddress: [''],
            policyStartDate: [''],
            assignDate: [''],
            renewalFrequencyTypeId: [''],
            insurerDetails: [''],
            policyRenewalDate: [''],
            remark: [''],
        });
        this.equipmentForm = this.fb.group({
            machineName: ['', Validators.required],
            description: ['', Validators.required],
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
        });
        this.preciousMetalForm = this.fb.group({
            isOwnedByCustomer: ['', Validators.required],
            preciousMetalName: ['', Validators.required],
            weightInGrammes: ['', Validators.required],
            valuationAmount: ['', Validators.required],
            unitRate: ['', Validators.required],
            preciousMetalForm: ['', Validators.required],
            remark: [''],
        });
        this.propertyForm = this.fb.group({ // COUNTRY--STATE--CITY
            propertyName: ['', Validators.required],
            cityId: ['', Validators.required],
            countryId: ['', Validators.required],
            constructionDate: ["", Validators.required],
            propertyAddress: ['', Validators.required],
            dateOfAcquisition: ["", Validators.required],
            lastValuationDate: ["", Validators.required],
            valuerId: ['', Validators.required],
            valuerReferenceNumber: ['', Validators.required],
            propertyValueBaseTypeId: ['', Validators.required],
            openMarketValue: ['', Validators.required],
            collateralValue: ['', Validators.required], // OUT
            forcedSaleValue: ['', Validators.required],
            stampToCover: ['', Validators.required],
            valuationSource: ['', Validators.required],
            originalValue: ['', Validators.required],
            availableValue: ['', Validators.required],
            securityValue: ['', Validators.required],
            // collateralUsableAmount: ['', Validators.required],
            // remark: ['OK'],
        });
        this.vehicleForm = this.fb.group({
            vehicleType: ['', Validators.required],
            vehicleStatus: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            modelName: ['', Validators.required],
            manufacturedDate: ['', Validators.required],
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
            notes: this.fb.array([])
        });      
        this.insuranceForm = this.fb.group({
            referenceNumber: ['', Validators.required],
            sumInsured: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            insuranceCompany: ['', Validators.required],
            startDate: ["", Validators.required],
            expiryDate: ["", Validators.required],
        });    
    }
/*
ADD ERRORS
    immovable properties -- check constraint
    guarantee ------------- institution name requred

*/
    currentHaircut?: number = null;

    onSubTypeChange(id) {
        this.currentHaircut = this.subTypes.find(x => x.collateralSubTypeId == +id).haircut;//this.mainForm.value.haircut;
        ////console.log('sub type haircut...',this.currentHaircut);
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

    createNewFieldLabelForm() { // form definition
        this.newFieldLabelForm = this.fb.group({
            labelName: [''],
        });    
    }

    createNoteField(e){ // show modal form
        e.preventDefault();
        this.createNewFieldLabelForm();
        this.displayNewFieldLabelForm = true;
    }

    newControl(name, value) { // method to create form control
        return this.fb.group({
            labelName: [name],
            labelValue: [value],
            controlName: [name.replace(/\s/g,'')]
        });
    }
    
    addNoteField(){
        this.displayNewFieldLabelForm = false;
        let x = <FormArray>this.miscellaneousForm.controls['notes']; // existing controls
        x.push(this.newControl(this.newFieldLabelForm.value.labelName,''));
        this.getNoteFields(x);
    }
    
    addNoteFields(list: any[]){
        this.displayNewFieldLabelForm = false;
        let x = <FormArray>this.miscellaneousForm.controls['notes']; // existing controls
        list.forEach(e => { 
            x.push(this.newControl(e.labelName,e.labelValue));
        });
        this.getNoteFields(x);
    }

    getNoteFields(controls) {
        this.inputRows = Array.from(Array(Math.ceil(controls.length / 2)).keys());
    }

// ------------------------end dynamic fields----------------------


    submitForm(form) { 
        let body = this.getBody(form);
        // this.payloadDiognostic(form);
        ////console.log('SUBMIT ===> ', JSON.stringify(body,null,2));
        ////console.log(this.miscellaneousForm.value.notes);
        this.loadingService.show();
        if (this.selectedId === null) { 
            this.collateralService.saveCustomerCollateral(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCustomerCollateral(this.selectedCustomerId);
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD ===> ',JSON.stringify(res.message + ' -- ' + res.error));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
                this.loadingService.hide(1000);
            });
        } else { 
            ////console.log('updating...', this.selectedId);
            this.collateralService.updateCustomerCollateral(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCustomerCollateral(this.selectedCustomerId);
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!',JSON.stringify(res.error));
              }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
                this.loadingService.hide(1000);
            });
        }
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
    }

    filteredSubTypes: any[] = [];

    onCollateralTypeChange(id) { 
        ////console.log('--------------------o',id);
        
        this.filteredSubTypes = this.subTypes.filter(x => x.collateralTypeId == id);
        this.hideAllSubForms();
        // this.selectedCollateralTypeId = id;
        // this.mainForm.controls['collateralTypeId'].setValue(id);
        ////console.log(JSON.stringify(this.depositForm.value));
        let selected = this.collateralTypes.find(x => x.collateralTypeId == id);
        if (selected !== undefined) {
            this.selectedCollateralTypeName = selected.collateralTypeName;
            this.disableSubFormTab = false;
            this.enableInsuranceFormTab = selected.requireInsurancePolicy;   
            this.showInsuranceForm = selected.requireInsurancePolicy;
        } else { // no selection
            this.selectedCollateralTypeName = null;
            this.disableSubFormTab = true;
            this.enableInsuranceFormTab = false;   
            this.showInsuranceForm = false;
            return;
        }
        switch(+id) {
            case this.MARKETABLE_SECURITIES:
                this.subForm = this.securityForm;
                this.showSecurityForm = true;
                break;
            case this.IMMOVABLE_PROPERTY:
            this.collateralType = this.IMMOVABLE_PROPERTY;
                this.subForm = this.propertyForm;
                this.showPropertyForm = true;
                break;
            case this.PLANT_AND_EQUIPMENT:
            this.collateralType = this.PLANT_AND_EQUIPMENT;
                this.subForm = this.equipmentForm;
                this.showEquipmentForm = true;
                break;
            case this.POLICY:
                this.subForm = this.policyForm;
                this.showPolicyForm = true;
                break;
            case this.VEHICLE:
                this.subForm = this.vehicleForm;
                this.showVehicleForm = true;
                break;
            case this.PRECIOUS_METAL:
                this.subForm = this.preciousMetalForm;
                this.showPreciousMetalForm = true;
                break;
            case this.FIXED_DEPOSIT:
                this.subForm = this.depositForm;
                this.showDepositForm = true;
                break;
            case this.CASA:
                this.subForm = this.casaForm;
                this.showCasaForm = true;
                break;
            case this.STOCK:
                this.subForm = this.stockForm;
                this.showStockForm = true;
                break;
            case this.GUARANTEE:
                this.subForm = this.guaranteeForm;
                this.showGuaranteeForm = true;
                break;
            case this.MISCELLANEOUS:
                this.subForm = this.miscellaneousForm;
                this.showMiscellaneousForm = true;
                break;
            default:
                this.selectedCollateralTypeName = this.defaultSubTabName;
                this.disableSubFormTab = true;
                return;
        }
    }

    getBody(form) {
        let sub = this.subForm;
        let insurance = this.insuranceForm;
        return {
            // main
            collateralId: this.selectedId,// || 0,
            customerId: this.selectedCustomerId,
            hasInsurance: this.enableInsuranceFormTab,
            collateralTypeId: form.value.collateralTypeId,
            collateralSubTypeId: form.value.collateralSubTypeId,
            collateralCode: form.value.collateralCode,
            collateralValue: form.value.collateralValue,
            camRefNumber: form.value.camRefNumber,
            allowSharing: form.value.allowSharing,
            isLocationBased: form.value.isLocationBased,
            valuationCycle: form.value.valuationCycle,
            haircut: form.value.haircut,
            currencyId: form.value.currencyId,

            // // deposit
            dealReferenceNumber: sub.value.dealReferenceNumber,
            accountNumber: sub.value.accountNumber,
            existingLienAmount: sub.value.existingLienAmount,
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

            // insurance
            referenceNumber: insurance.value.referenceNumber,
            sumInsured: insurance.value.sumInsured,
            insuranceCompany: insurance.value.insuranceCompany,
            startDate: insurance.value.startDate,
            expiryDate: insurance.value.expiryDate,

            // guarantee
            collateralGauranteeId: sub.value.collateralGauranteeId,
            collateralCustomerId: sub.value.collateralCustomerId,
            isOwnedByCustomer: sub.value.isOwnedByCustomer,
            institutionName: sub.value.institutionName,
            guarantorAddress: sub.value.guarantorAddress,
            guarantorReferenceNumber: sub.value.guarantorReferenceNumber,
            guaranteeValue: sub.value.guaranteeValue,
            endDate: sub.value.endDate,
/*
collateralId,
entity.isOwnedByCustomer,
entity.institutionName,
entity.guarantorAddress,
entity.guarantorReferenceNumber,
entity.guaranteeValue,
(DateTime)entity.startDate,
entity.endDate,
entity.remark,
                */
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

            // preciousMetal
            collateralPreciousMetalId: sub.value.collateralPreciousMetalId,
            preciousMetalName: sub.value.preciousMetalName,
            weightInGrammes: sub.value.weightInGrammes,
            valuationAmount: sub.value.valuationAmount,
            unitRate: sub.value.unitRate,
            preciousMetalForm: sub.value.preciousMetalForm,

            // stock
            collateralStockId: sub.value.collateralStockId,
            companyName: sub.value.companyName,
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
            manufacturedDate: sub.value.manufacturedDate,
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
        let item = this.subTypes.find(x => x.collateralSubTypeId == id);
        return item == null ? 'n/a' : item.collateralSubTypeName;
    }


    // file upload

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        if(this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                collateralId: this.selectedId,
                documentTitle: this.uploadFileTitle, // document code
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };
            ////console.log(body);
            
            this.loadingService.show();
            this.collateralService.uploadFile(this.file, body).then((val: any) => {
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";
                this.getSupportingDocuments();
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
            });
        }
    }

    getSupportingDocuments() {
        this.collateralService.getCollateralDocument(this.selectedId).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////console.log('documents..', response.result);
        });
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
        ////console.log("binary file..", this.binaryFile);
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
}
