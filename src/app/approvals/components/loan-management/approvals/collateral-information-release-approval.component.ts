import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { CollateralService } from '../../../../setup/services/collateral.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus, JobSource, LMSOperationEnum, CollateralType, CollateralGuaranteeSubType } from '../../../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CountryStateService, LedgerService, CurrencyService } from 'app/setup/services';
import { CasaService } from 'app/customer/services/casa.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { saveAs } from 'file-saver';

@Component({
    templateUrl: 'collateral-information-release-approval.component.html'
})

export class CollateralInformationReleaseApprovalComponent implements OnInit {

    selected: any = null;
    pendingApprovals: any[] = [];
    displayApprovalModal: boolean = false;
    comment: string = null;
    approvalStatusId: number = null;
    show: boolean = false; message: any; title: any; cssClass: any;
    isLocationBased:boolean=false;
    collateralTypes: any[] = [];




    collateralTypeId: any; // --------------------- new?
    selectedRecord: any;
    collateralCode: any;
    tempCollateralId: any;
    accountBalance: any;
    releaseTypes: any[];
    lmsOperationId: any;


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
    loanApplicationCollaterals: any[] = [];
    displayModalForm: boolean = false;
    // showCollateralList: boolean = false;
    activeTabIndex: number = 0;
    selectedId: number = null;
    selectedCollateralTypeId: number = null;
    entityName: string = 'Collateral Information';
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
    jobSourceId: number;


    collateralReleaseData: any[];

    countries: any[];
    cities: any[];
    frequencyTypes: any[];
    valuers: any[];
    valueBaseTypes: any[];
    accountTypes: any[];



    constructor(
        private loadingService: LoadingService,
        private collateralService: CollateralService,

        private fb: FormBuilder,
        private locationService: CountryStateService,
        private ledgerService: LedgerService,
        private currencyService: CurrencyService,
        private casaSrv: CasaService,
        private router: Router,

    ) { }

    ngOnInit() {
        this.jobSourceId = JobSource.CollateralReleaseApproval;
        this.loadDropdowns();
        this.getPendingApprovals();
    }
    hideMessage(event){

    }



    getPendingApprovals() {
        this.loadingService.show();
        this.collateralService.getCollateralReleaseAwaitingApproval().subscribe((response: any) => {
            this.pendingApprovals = response.result;
            this.loadingService.hide();

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    view(item) {
        this.selected = item;
        this.displayApprovalModal = true;
        this.approvalStatusId =null;
        this.comment = null;
    }

    refresh() {
        this.getPendingApprovals();
        this.displayApprovalModal = false;
        this.approvalStatusId = null;
        this.comment = null;
    }

    forward() {
        const __this = this;
        const status = +this.approvalStatusId == 2 ? 'Approve' : 'Disapprove';

        swal({
            title: status + ' Collateral Realease?',
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

            const body = {
                targetId: __this.selected.collateralId,
                approvalStatusId: __this.approvalStatusId,
                comment: __this.comment,
            }

            __this.collateralService.approveCustomerCollateralRelease(body).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
                    __this.refresh(); // refresh
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                }
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    // -- custom ---

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
        this.collateralService.getCollateralTypeByApplication(null).subscribe((response: any) => {
            this.collateralTypes = response.result;

        });
        this.collateralService.getCollateralPerfectionStatus().subscribe((response: any) => {
            this.CollateralPerfectionList = response.result;
        });
    }
    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }



    collateralId: any; // --------------------- new?
  selectedRowRecord: any;
  supportingDocuments2: any[];
    disabledInputs() {
        this.isCollateralCodeVisible = true;
    }
    enabledInputs() {
        this.isCollateralCodeVisible = null;
    }
    viewRecord(row){

        this.disabledInputs();
        this.selectedRowRecord = row;

        if (this.selectedRowRecord.collateralReleaseTypeId == 1)
        {
            this.lmsOperationId = LMSOperationEnum.FinalCollateralRelease;
        }
        else
        {
            this.lmsOperationId = LMSOperationEnum.TemporalCollateralRelease;
        }
        this.collateralService.getCollateralInformation(this.selectedRowRecord.collateralCustomerId).subscribe((response: any) => {
            this.selectedRecord = response.result;
            this.selectedId = this.selectedRecord.collateralId;
            this.collateralId = this.selectedRecord.collateralId

            this.onCollateralTypeChange(this.selectedRecord.collateralTypeId);
            this.onSubTypeChange(this.selectedRecord.collateralSubTypeId);
            this.getSubFormItems(this.selectedRecord.collateralId, this.selectedRecord.collateralTypeId);
            // this.enableInsuranceFormTab = true;
    
            this.getVisitationDetail(this.selectedId)
            this.getCollateralVisitationStatus(this.selectedRecord.collateralTypeId)
            // this.getSupportingDocuments(this.selectedRecord.collateralId);
             this.collateralService.getCollateralDocument(this.selectedRecord.collateralId).subscribe((response: any) => {
                 this.supportingDocuments2 = response.result;

             });
            this.collateralCode = this.selectedRecord.collateralCode;
            this.getReleaseSupportingDocumentsUploads(this.selectedRowRecord.collateralReleaseId);

  });
        this.disableDocumentPanel = false;
        this.disableVisitationPanel = !this.requireVisitation;
        this.displayModalForm = true;

    }
    showAddNewUpload() {
        this.displayDocumentUpload = true;
    }
    displayDocumentUpload: boolean = false;
    binaryFile: string;
    selectedDocument: string;


    uploadFileTitle: string = null;
    physicalFileNumber: string = null;
    physicalLocation: string = null;
    documentTypeId: number = null;
    files: FileList;
    file: File;
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
        if (this.file != undefined  ) {
            let body = {
                collateralCode: this.collateralCode,
                collateralReleaseId: this.selectedRowRecord.collateralReleaseId,
                collateralCustomerId: this.collateralId,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                documentTypeId: 1, // TODO: redundant with fileExtension known
            };
            this.loadingService.show();
            this.collateralService.uploadAdditionalFile(this.file, body).then((val: any) => {
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";
                this.loadingService.hide();
                this.getReleaseSupportingDocumentsUploads(this.selectedRowRecord.collateralReleaseId);
                this.displayDocumentUpload = false;
            }, (error) => {
                this.loadingService.hide(1000);
            });
        }
    }
    getCollateralVisitationStatus(id) {
        if (this.collateralTypes != null) {
            this.requireVisitation = this.collateralTypes.find(x => x.collateralTypeId == id).requireVisitation;
            this.requireInsurancePolicy = this.collateralTypes.find(x => x.collateralTypeId == id).requireInsurancePolicy;
        }
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

            this.loadingService.hide();
            this.editSubForm(typeId);
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

            default: return;
        }
        this.editInsurance();
        this.getSupportingDocuments(this.selectedRecord.collateralCustomerId);
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
    getInsurancePolicies(collateralCustomerId) {
        collateralCustomerId = this.selectedId

        //loan-visitation/{collateralVisitationId}
        this.collateralService.getInsurancePolicies(collateralCustomerId).subscribe((response: any) => {
            this.insurancePolicies = response.result;

        });
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
            remark:[this.subItems.remark],
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
    }

    closeForm() {
        this.displayModalForm = false;
        this.entityName = 'Collateral Information';
        this.selectedId = null;
        this.activeTabIndex = 0;
        this.selectedCollateralTypeId = null;
        this.defaultSubTabName = 'Collateral Type Details';
        this.selectedCollateralTypeName = this.defaultSubTabName;
        // this.disableSubFormTab = true;
        // this.enableInsuranceFormTab = false;
        this.showInsuranceForm = false;
        this.currentHaircut = null;
        this.hideAllSubForms();
    
        this.disableVisitationPanel = true;
    }

    
        getVisitationDetail(CollateralId) {
    
            //loan-visitation/{collateralVisitationId}
            this.collateralService.getCollateralVisitationDetail(CollateralId).subscribe((response: any) => {
                this.visitationDetail = response.result;
    

            });
        }
        getSupportingDocuments(collateralId) {

    
            this.collateralService.getCollateralDocument(collateralId).subscribe((response: any) => {
                this.supportingDocuments = response.result;
            });
        }
        
    
        
        onSubTypeChange(id) {

    
            this.enabledJoinCollaterGuarantee = false;
    
            this.collateralService.getCollateralSubTypesById(id).subscribe((response: any) => {
                this.collateralSubType = response.result;
    
    
    
                this.haircut = this.collateralSubType.haircut;
                // this.mainForm.patchValue({
                //     'haircut': this.collateralSubType.haircut,
                //     'valuationCycle': this.collateralSubType.revaluationDuration,
                //     // 'isLocationBased':this.collateralSubType.isLocationBased,
                //     // 'allowSharing':this.collateralSubType.allowSharing
                // });
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
        getOutstandingBalanceForFixedDepositOrCASA() {
            let collateralValue = this.selectedRecord.collateralValue;
            let haircut = this.convertToNumber(this.haircut);
            let collateralVal = this.convertToNumber(collateralValue);
    
    
            let collateraalId = this.selectedRecord.collateralTypeId;
    
    
            if (haircut !== null && collateralVal !== null) {
                let secVal = (+collateralVal - ((+haircut / 100) * +collateralVal));
    
                switch (+collateraalId) {
                    case CollateralType.MARKETABLE_SECURITIES:
                        this.subItems.securityValue=secVal;
                        break;
                    case CollateralType.IMMOVABLE_PROPERTY:
                    this.subItems.securityValue=secVal;
                    break;
                    case CollateralType.PLANT_AND_EQUIPMENT:
    
                        break;
                    case CollateralType.POLICY:
                    this.subItems.policyAmount=secVal;
    
    
                        break;
                    case CollateralType.VEHICLE:
    
                        break;
                    case CollateralType.PRECIOUS_METAL:
    
                        break;
                    case CollateralType.FIXED_DEPOSIT:
                    this.subItems.securityValue=secVal;
                        break;
                    case CollateralType.CASA:
                    this.subItems.securityValue=secVal;
    
                        break;
                    case CollateralType.STOCK:
                    this.subItems.sharesSecurityValue=secVal;
                    this.subItems.marketPrice=0;
                    this.subItems.shareQuantity=0;
    
    
                        break;
                    case CollateralType.GUARANTEE:
                    this.subItems.guaranteeValue=secVal;
                        break;
                    case CollateralType.MISCELLANEOUS:
                    this.subItems.securityValue=secVal;
                        break;
                    default:
                        return;
                }
    
            }
            let accountNo = this.selectedRecord.collateralCode;
    
            if (accountNo === null) return;
    
            let collateralTypeID = this.selectedRecord.collateralTypeId;
    
            if (collateralTypeID == CollateralType.FIXED_DEPOSIT) {
                this.getLientAmountForFD(accountNo);
            } else if (collateralTypeID == CollateralType.CASA) {
                this.subItems.accountNumber=accountNo;
                this.getLientAmountForCASA(accountNo);
            }
    
    
        }
            //-----------------------------  GET LIENT AMOUNT AND OUTSTANDING BALANCE FOR FIXED DEPOSIT
            getLientAmountForFD(accountNo) {
        
                this.collateralService.getLienAmountForFD(accountNo).subscribe((response: any) => {
        
                    // let lien = response.result;
                    let securityVa = this.subItems.securityValue;
                    let securityValue = this.convertToNumber(securityVa);

                    if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
        
                    this.subItems.lienAmount = this.lienAmount;
                     this.getFixedDepositAccountBalance(accountNo)
 
        
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
            getFixedDepositAccountBalance(acctNumber) {
    
                this.collateralService.getFixedDepositAccountDetail(acctNumber).subscribe((response: any) => {
                    if (response.result != undefined) {
                        this.accountBalance = response.result.balance;
                        this.accountName = response.result.accountName;
                      }
                });
            }
            //-----------------------------  GET LIENT AMOUNT AND OUTSTANDING BALANCE FOR CASA
            
            
        convertToNumber(pamount) {
    
            if (typeof (pamount) == "string") {
                return pamount = pamount.replace(/[^0-9-.]/g, '');
            } else if (typeof (pamount) == "number") {
                return pamount = pamount;
            }
    
        }
        currentHaircut?: number = null;
    getLientAmountForCASA(accountNo) {
        
                this.collateralService.getLienAmountForCASA(accountNo).subscribe((response: any) => {
        
                    //let lien = response.result;
                    let securityVa = this.subItems.securityValue;
                    let securityValue = this.convertToNumber(securityVa);
                    if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
                    this.subItems.lienAmount = this.lienAmount;
        
                    this.getCasaAccountBalance(accountNo);
        
                    if (this.lienAmount != null) {
        
                        this.subItems.lienAmount=this.lienAmount;
                        this.subItems.accountName=this.accountName;
                        this.subItems.availableBalance=this.accountBalance;
                    } else {
                        this.subItems.lienAmount=0;
                        this.subItems.availableBalance=securityValue;
                    }
        
                }, (err) => {
        
                });
            }
            getCasaAccountBalance(acctNumber) {
                this.casaSrv.getCustomerAccountBalance(acctNumber).subscribe((response: any) => {
                    if (response.result != undefined) {
        
                        if(response.success==false){
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                        }else{
                        
                        this.accountBalance = response.result.availableBalance;
                        this.accountName = response.result.accountName;
                        }
                      }
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
            filteredSubTypes: any[] = [];
       
            collateralDocumentTypes:any[];
            getAllDocumentsByColateralTypeId(id):void{
                this.loadingService.show();
                this.collateralService.getCollateralDocumentTypes(id).subscribe((response: any) => {
                    this.collateralDocumentTypes = response.result;
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000);
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

        populateValueBaseType(collateralType) {
    
            this.collateralService.getValueBaseTypes(collateralType).subscribe((response: any) => {
                this.valueBaseTypes = response.result;
            });
        }

        onCollateralTypeChange(id) {
            this.getAllDocumentsByColateralTypeId(id);
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
    
            if (selected !== undefined) {

    
                this.selectedCollateralTypeName = selected.collateralTypeName;
                this.disableSubFormTab = false;
    
                this.disableVisitationPanel = !selected.requireVisitation;
                this.enableInsuranceFormTab = !selected.requireInsurancePolicy;
            } else { // no selection
    
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
    
        }
        getBody() {
            let sub = this.subForm;
            let insurance = this.insuranceForm;
            let miscel = this.miscellaneousForm;
            return {
                // main
                collateralId: this.selectedRecord.collateralId,// || 0,
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
    
    
                collateralReleaseId: this.selectedRowRecord.collateralReleaseId,
                approvalStatusId : this.approvalStatusId,
                comment: this.comment,
            };
        }
        submitForm() {
            //let body = this.getBody();
            //this.collateralCode = this.mainForm.get('collateralCode').value;
    
            let __this = this;
    
                let body = this.getBody();
    
                    swal({
                        title: 'Are you sure?',
                        text: 'Are you sure you want to proceed?',
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
    
                        __this.approveReleaseCollateral(body);
    
                        //  __this.displayModalForm = false;
                    }, function (dismiss) {
                        if (dismiss === 'cancel') {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                        }
                    });
    
            this.disableDocumentPanel = false;
        }
    
        approveReleaseCollateral(form) {
                //let body = form;
                const body = {
                    targetId: this.selectedRowRecord.collateralReleaseId,
                    approvalStatusId: this.approvalStatusId,
                    comment: this.comment,
                }
              
    
                this.loadingService.show();
                this.collateralService.sendtoCollateralReleaseForApproval(body).subscribe((val: any) => {
    
                    const success = val.success;
    
                    if (success === true) {
    
                        this.getPendingApprovals();
                        this.closeForm();

                       this.loadingService.hide();
                        swal('FinTrak Credit 360', "Success: " + val.message , 'success');
    
                    } else {
                        this.loadingService.hide();
                        swal('FinTrak Credit 360', "Saving Failed with error :" + val.message, 'error');
                    }
    
                }, (error) => {
                    this.loadingService.hide(1000);
                    swal('FinTrak Credit 360', "Update Failed with error :" + error, 'error');
                });
        }
        loanDocumentUploadList: any[] = [];

        getReleaseSupportingDocumentsUploads(releaseId: any) {
            this.loadingService.show();
            this.collateralService.getSupportingDocumentByRelease(releaseId).subscribe((response: any) => {
                this.loanDocumentUploadList = response.result;
                this.loadingService.hide();
            });
        }
    
        // file upload

        supportingDocuments: any[] = [];
    
        //visitation detail
        lastVisitation: string = null;
        visitationRemark: string = null;
        lastVisitaionDate: Date;
        collateralCustomerId: any;
        visitationDocument: any;
        displayUpload: boolean = false;
        displayUploadOtherDocument: boolean = false;
        displayDocument: boolean = false;



        viewSupportingDocument(id: number) {
            this.loadingService.show();
            let doc = this.supportingDocuments.find(x => x.documentId == id);
            if (doc != null) {
                this.binaryFile = doc.fileData;
                this.selectedDocument = doc.documentTitle;
                this.displayDocument = true;
                this.loadingService.hide();
            }
        }
    
        DownloadSupportingDocument(id: number) {
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
        fileDocument: any;

        viewDocument(id: number) {
            this.fileDocument = null;
            //  let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
            this.collateralService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
                this.fileDocument = response.result;
                if (this.fileDocument != null) {
                    this.binaryFile = this.fileDocument.file;
                    this.selectedDocument = this.fileDocument.collateralCode;
                    this.displayUpload = true;
                }
            });
    
        }
    
        DownloadDocument(id: number) {
            this.fileDocument = null;
            this.collateralService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => { // TODO
                this.fileDocument = response.result;
                // let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
                if (this.fileDocument != null) {
                    this.binaryFile = this.fileDocument.file;
                    this.selectedDocument = this.fileDocument.collateralCode;
                    let myDocExtention = this.fileDocument.fileExtension;
                    var byteString = atob(this.binaryFile);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    var bb = new Blob([ab]);
    
                    if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                        try {
                            var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                            saveAs(file);
                        } catch (err) {
                            var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                            window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                        }
                    }
                    if (myDocExtention == 'png' || myDocExtention == 'png') {
                        try {
                            var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                            saveAs(file);
                        } catch (err) {
                            var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                            window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                        }
                    }
                    if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                        try {
                            var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                            saveAs(file);
                        } catch (err) {
                            var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                            window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                        }
                    }
                    if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                        try {
                            var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                            saveAs(file);
                        } catch (err) {
                            var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                            window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                        }
                    }
                    if (myDocExtention == 'doc' || myDocExtention == 'docx') {
    
                        try {
                            var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                            saveAs(file);
                        } catch (err) {
                            var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                            window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                        }
                    }
                }
            });
        }
}
 