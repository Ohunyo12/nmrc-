import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CollateralService } from '../../../setup/services/collateral.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig, CollateralType } from '../../../shared/constant/app.constant';
import { saveAs } from 'file-saver';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeneralSetupService } from 'app/setup/services';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { MenuVisibiltyService } from 'app/shared/services/role-menu.service';
import { CreditAppraisalService } from 'app/credit/services';

@Component({
    selector: 'collateral-information-view',
    templateUrl: './collateral-information-view.component.html',
})
export class CollateralInformationViewComponent implements OnInit {
    [x: string]: any;
    id: string;
    myDocExtention: any;
    pdfFileName: any;
    row: any;
    pdfFile: any;
    insurancePolicies: any[];
    supportingDocuments: any[];
    binaryFile: string;
    imageData: any;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    collateralId: any;
    toSearchBtnText: string;
    customerCollateralSelection: any;
    customers: any;
    collateralItemPolicy: any;
    collateralItemDomicilliationContract: boolean = false;
    hasInsurance: any;
    collateralDeposit: any;
    collateralCasa: any;
    collateralPreciousMetal: any;
    collateralStock: any;
    collateralVehicle: any;
    collateralEquipment: any;
    customerName: any;
    customerId: any;
    customerGroupId: any;
    determinStatus = "FALSE";
    collateralGaurantee: boolean = false;
    showOtherIsuranceCompany: boolean = false;
    showUploadForm: boolean = false;
    collateralMarketableSecurity: boolean = false;
    collateralInsurancePolicy: boolean = false;
    collateralProperty: boolean = false;
    mainCollateralView: boolean = false;
    customerCollateral: any;
    searchResults: any[];
    searchTerm$ = new Subject<any>();
    searchStagingTerm$ = new Subject<any>();
    hideTable: boolean = true;
    hideGrid: boolean = false;
    mainCollateralDetail: any = {};
    isInsurancePolicy: any;
    isVisitation: any;
    personal = false;
    corporate = false;
    collateralVisitation: any[];
    insurancetrackingForm: boolean = false;
    insuranceForm: boolean = false;
    insuranceFormGroup: FormGroup;
    insuranceStatusId: any;
    insurancePolicyType: any[];
    insuranceTypes: any[];
    currentDate: Date;
    valuers: any[];
    insuranceStatuses: any[];
    collateralTypes: any[];
    collateralSubTypes: any[];
    insuranceStatus: any;
    insurancePolicTypes: any[];
    insuranceCompanies: any[];
    insuranceInformationDetails: any;
    collateralSubType: any = {};
    userIsAccountOfficer: boolean = false;
    userIsCreditAdmin: boolean = false;
    disableInput: boolean;
    valuationEndDate: any;
    staffRoleRecord: any;
    selectedId: number;
    readonly OPERATION_ID: number = 567;
    @Input() currentApprovalStatusId: number;
    confirmInsuranceInformation: boolean;
    displayMoreInsuranceInformationDetails: boolean = false;
    displayInsuranceReport: boolean = false;

    @Input() isHeaderInfoBased: boolean = true;
    @Input() showCollateralInformation = false;
    @Input() collateralCustomerId: number;
    @Input() useSearch: boolean = true;
    @Input() collateralTypeId: number;
    @Input('searchQuery') searchQuery = new Subject<string>();
    @Output() closeWindow = new EventEmitter<boolean>();
    @Output() insurancePolicyInformationDetail: EventEmitter<any> = new EventEmitter<any>();
    @Input() jobReply = false;
    @Input() loanApplicationDetailId: any;
    @Input() allowToAddInsurancePolicy: boolean = false;
    @Input() displayRecordAtThisPoint: boolean = true;

    valuationRequired: boolean = false;
    hideSelectPolicyType: boolean = false;
    hideSelectInsuranceCompany: boolean = false;
    hideSelectValuer: boolean = false;
    showSelectPolicyType: boolean = false;
    showSelectInsuranceCompany: boolean = false;
    showSelectValuer: boolean = false;


    @Output() selectedCaollateral: any;
    customerCollaterals: any[];
    comment: any;
    approvalStatusId: any;



    isLegal: boolean;
    constructor(
        private collateralService: CollateralService,
        private loadingService: LoadingService,
        private customerService: CustomerService,
        private camService: CreditAppraisalService,
        private fb: FormBuilder,
        private generalSetupService: GeneralSetupService,
        private staffRoleService: StaffRoleService,
        public menuGuardSrv: MenuVisibiltyService
    ) { }

    ngOnInit() {
        // console.log("my current state" +this.currentApprovalStatusId );
        this.getTempCustomerCollateral();
        this.intializeForms();
        this.getUserRole();
       
        this.getInsuranceTypes();
        this.getInsurancePolicyTypes();
        this.getValuer();
        this.getInsuranceCompanies();
        this.getInsuranceStatus();
        this.getCollateralTypes();

    }

    @Input() set reload(value: number) {

        ////console.log("value", value);
        if (value != NaN || value != undefined || value != null)
            if (value > 0) this.getTempCustomerCollateral();
    }

    insurancepolicyRecord: any;
    insurancePolicyInformation(trackingId) {
        this.loadingService.show();
        this.camService.getInsurancePolicyConfirmationStatus(trackingId).subscribe((res) => {
            this.loadingService.hide();
            this.insurancepolicyRecord = res.result;
            this.insurancePolicyInformationDetail.emit(this.insurancepolicyRecord);
        });
    }

    showModalForm() {
        this.mainCollateralView = false;
        this.insuranceForm = true;
    }

    getUserRole() {
        this.staffRoleService.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
                this.allowToAddInsurancePolicy = true;

            }
            if (this.staffRoleRecord.staffRoleCode == 'CREDIT ADMIN') {
                this.userIsCreditAdmin = true;
            }

            if (this.staffRoleRecord.staffRoleCode == 'AO') {
                this.showUploadForm = true;
            }

        });

    }

    resultResponse: any;
    submitInsuranceForm(form) {

        if(form.value.valuer == "others" && form.value.otherValuer.length == 0){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Valuer field must not be empty', 'error');
            return null;
        }
        if(form.value.insurancePolicyTypeId == "others" && form.value.otherInsurancePolicyType.length == 0){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Insurance Policy Type field must not be empty', 'error');
            return null;
        }
        var body = {
            insuranceCompanyId: form.value.insuranceCompany == "others" ? 0 : form.value.insuranceCompany,
            companyAddress: form.value.companyAddress,
            referenceNumber: form.value.referenceNumber,
            description: form.value.description,
            startDate: form.value.startDate,
            expiryDate: form.value.expiryDate,
            sumInsured: form.value.sumInsured,
            inSurPremiumAmount: form.value.inSurPremiumAmount,
            insuranceStatus: form.value.insuranceStatusId == null ? this.insuranceStatusId : form.value.insuranceStatusId,
            collateralCustomerId: this.collateralCustomerId,
            loanApplicationDetailId: this.loanApplicationDetailId,
            // collateralInsuranceDetails: this.collateralInsuranceDetails,
            valuationStartDate: form.value.valuationStartDate,
            valuationEndDate: form.value.valuationEndDate,
            openMarketValue: form.value.omv,
            forcedSaleValue: form.value.fsv,
            valuerId: form.value.valuer == "others" ? 0 : form.value.valuer,
            collateralDetails: form.value.collateralDetails,
            insurancePolicyTypeId: form.value.insurancePolicyTypeId == "others" ? 0 : form.value.insurancePolicyTypeId,
            otherInsurancePolicyType: form.value.otherInsurancePolicyType,
            otherInsuranceCompany: form.value.otherInsuranceCompany,
            otherValuer: form.value.otherValuer,
            collateralTypeId: form.value.collateralTypeId,
            collateralSubTypeId: form.value.collateralSubTypeId,
            gpsCoordinates: form.value.gpsCoordinates,
            firstLossPayee: form.value.firstLossPayee,
            insurableValue: form.value.insurableValue,
            comment: form.value.comment,
        }
        
        this.loadingService.show();
        if (this.selectedId == null) {
                this.collateralService.postInsuranceTracking(body).subscribe((response) => {
                this.resultResponse = response.result;
                this.closeCollateralDetails();
                if(response.success == true){
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Record Saved Successfully', 'success');
                }else{
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.result, 'error');
                }
                this.loadingService.hide();
            });
        }
        else {
                this.collateralService.updateInsuranceTracking(this.selectedId, body).subscribe((response) => {
                this.resultResponse = response.result;
                this.closeCollateralDetails();
                if(response.success == true){
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Record Updated Successfully', 'success');
                }else{
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.result, 'error');  
                }
                this.loadingService.hide();
                this.selectedId = null;
            });

        } (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Error saving record', 'error');
            this.loadingService.hide(1000);
        };
    }

    getInsuranceTypes() {
        this.generalSetupService.getAllInsuranceTypes().subscribe((response) => {
            this.insuranceTypes = response.result;
        });
    }

    getCollateralTypes() {
        this.generalSetupService.getAllCollateralTypes().subscribe((response) => {
            this.collateralTypes = response.result;
        });
    }

    showCollateralSubType: boolean = false;
    collateralTypeChange(value) {
        //this.collateralSubTypesByCollateralType = this.collateralSubTypes.filter(x=>x.collateralTypeId = value);
        this.getCollateralSubTypes(value);
        this.showCollateralSubType = true;
    }

    showGpsCoordinates: boolean = false;
    isGpsCoordinatesCollateralType: boolean = false;
    collateralSubTypeChange(value) {
        var collateralSubType = this.collateralSubTypes.find(x => x.collateralSubTypeId == value);
        this.isGpsCoordinatesCollateralType = collateralSubType.isGpsCoordinatesCollateralType;
        this.showGpsCoordinates = true;
    }

    getCollateralSubTypes(collateralTypeId) {
        this.generalSetupService.getAllCollateralSubTypes(collateralTypeId).subscribe((response) => {
            this.collateralSubTypes = response.result;
        });
    }

    getInsurancePolicyTypes() {
        this.generalSetupService.getAllInsurancePolicyTypes().subscribe((response) => {
            this.insurancePolicTypes = response.result;
        });
    }

    getInsuranceCompanies() {
        this.generalSetupService.getAllInsuranceCompanies().subscribe((response) => {
            this.insuranceCompanies = response.result;
        });
    }

    getValuer() {
        this.collateralService.getValuers().subscribe((response) => {
            this.valuers = response.result;
        });
    }

    getInsuranceStatus() {
        this.generalSetupService.getAllInsuranceStatus().subscribe((response) => {
            this.insuranceStatuses = response.result;
        });
    }

    getTempCustomerCollateral(): void {
        this.loadingService.show();
        ////console.log('this.collateralCustomerId',this.collateralCustomerId);
        this.collateralService.getCustomerCollateralByCollaterId(this.collateralCustomerId).subscribe((response) => {
            this.customerCollaterals = response.result;
            this.loadingService.hide();

        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getTempCollateralByType(collateralId, typeId): void {
        this.loadingService.show();
        this.collateralService.getTempCollateralInformationByCollateralType(collateralId, typeId).subscribe((response) => {
            this.selectedCaollateral = response.result;

            ////console.log('sub items...', response);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    closeCollateralDetails() {
        this.closeWindow.emit(true);
        this.empty();
    }

    public getCollateralInformation(collateralCustomerId: number, collateralTypeId: number): any {
        this.loadingService.show();
        this.collateralService.getCollateralInformationByCollateralType(collateralCustomerId, collateralTypeId)
            .subscribe((res) => {
                // if (res.result == null) {
                //     swal(GlobalConfig.APPLICATION_NAME, 'The details for this collateral have not been captured', 'warning');
                //     return;
                // }
                this.useSearch = false;
                this.mainCollateralView = true;
                this.insuranceInformationDetails = {};

                this.customerCollateral = res.result;

                if (this.customerCollaterals != null) { 
                    this.mainCollateralDetail = this.customerCollaterals.find(x => x.collateralId == collateralCustomerId) 
                }


                this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                this.isVisitation = this.mainCollateralDetail.requireVisitation;
                this.collateralId = this.mainCollateralDetail.collateralId;
                this.customerName = this.mainCollateralDetail.customerName;
                this.customerId = this.mainCollateralCustomerId;

                if (this.mainCollateralDetail.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY) { this.collateralProperty = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.MARKETABLE_SECURITIES) { this.collateralMarketableSecurity = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.GUARANTEE) { this.collateralGaurantee = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) { this.collateralEquipment = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.VEHICLE) { this.collateralVehicle = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.STOCK) { this.collateralStock = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.PRECIOUS_METAL) { this.collateralPreciousMetal = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.CASA) { this.collateralCasa = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.FIXED_DEPOSIT) { this.collateralDeposit = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.POLICY) { this.collateralItemPolicy = true; this.mainCollateralView = true; }
                if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.collateralItemDomicilliationContract = true; this.mainCollateralView = true; }

                this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

                this.getVisitationDetail(collateralCustomerId);
                this.getSupportingDocuments(collateralCustomerId);
                if (this.isInsurancePolicy) {
                    this.getCollaterTempItemPolicies(collateralCustomerId);
                }
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }

    onSlectedCustomerChange() {
        this.collateralCustomerId = this.customerCollateralSelection.collateralId;
        this.collateralTypeId = this.customerCollateralSelection.collateralTypeId;

        this.getCollateralInformation(this.collateralCustomerId, this.collateralTypeId);
    }

    turnOnSearch() {
        this.useSearch = true;
        this.customerCollateral = false;
        this.collateralDeposit = false;
        this.collateralCasa = false;
        this.collateralPreciousMetal = false;
        this.collateralStock = false;
        this.collateralVehicle = false;
        this.collateralEquipment = false;
        this.customerName = false;
        this.collateralGaurantee = false;
        this.collateralMarketableSecurity = false;
        this.collateralInsurancePolicy = false;
        this.collateralProperty = false;
        this.mainCollateralView = false,
        this.collateralItemDomicilliationContract = false,

            this.hideTable = true;



    }


    getVisitationDetail(CollateralId) {
        this.collateralService.getCollateralVisitationDetail(CollateralId).subscribe((response) => {
            this.collateralVisitation = response.result;
        });
    }


    viewVisitationDocument(id: number) {
        this.collateralService.getCollateralVisitationFile(id).subscribe((response) => {
            this.imageData = response.result;

            ////console.log('documents..',  this.imageData);
        });

        let doc = this.imageData;
        // let doc = this.imageData.find(x => x.targetId == id);
        if (doc != null) {

            ////console.log('doc.fileData..',  doc.fileData);

            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }

    viewCollateralDocument() {
        this.collateralService.getCollateralDocument(this.collateralId).subscribe((response) => {
            this.imageData = response.result[0];
            ////console.log('documents..',  this.imageData);
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        });

        let doc = this.imageData;
        // let doc = this.imageData.find(x => x.targetId == id);
        if (doc != null) {

            ////console.log('doc.fileData..',  doc.fileData);

            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }


    viewDocument(id: number) {
        //this.loadingService.show();

        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {


            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
        //this.loadingService.hide(1000);

    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.fileName;
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

    supportingDocumentsSpecific: any[];
    getSupportingDocuments(id) {

        this.collateralService.getCollateralDocument(id).subscribe((response) => {
            this.supportingDocuments = response.result;
            this.supportingDocumentsSpecific = response.result;
        });
    }

    getCollaterTempItemPolicies(id) {
        this.collateralService.getItemPolicyList(id).subscribe((response) => {
            this.insurancePolicies = response.result;
        });
    }

    calculateLastValuationDate(date: Date) {
        if(this.customerCollateral != null){
        var valuationDate = new Date(date);
        var valuationCycle = this.customerCollateral.revaluationDuration == null ? 0 : this.customerCollateral.revaluationDuration;
        valuationDate.setDate(valuationDate.getDate() + valuationCycle);
        this.valuationEndDate = valuationDate;
        this.insuranceFormGroup.controls['valuationEndDate'].setValue(this.valuationEndDate);
        }else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer collateral details not complete. Valuation expiry date will not be populated', 'warning'); 
        }
    }

    calculatePolicyStatus(date: Date) {
        var currentDate = new Date().getDate();
        var policyExpiryDate = new Date(date).getDate();
        if (policyExpiryDate > currentDate) {
            this.insuranceFormGroup.controls['insuranceStatusId'].setValue(1);
        } else {
            this.insuranceFormGroup.controls['insuranceStatusId'].setValue(2);
        }
    }


    intializeForms() {
        this.insuranceFormGroup = this.fb.group({
            insuranceStatusId: ['', Validators.required],
            insuranceCompany: ['', Validators.required],
            companyAddress: ['', Validators.required],
            referenceNumber: ['', Validators.required],
            insurancePolicyTypeId: ['', Validators.required],
            startDate: ['', Validators.required],
            expiryDate: ['', Validators.required],
            sumInsured: ['', Validators.required],
            inSurPremiumAmount: ['', Validators.required],
            valuationStartDate: [''],
            valuationEndDate: [''],
            omv: [''],
            fsv: [''],
            valuer: [''],
            collateralDetails: ['', Validators.required],
            otherInsurancePolicyType: [''],
            otherInsuranceCompany: [''],
            otherValuer: [''],
            collateralTypeId: ['', Validators.required],
            collateralSubTypeId: ['', Validators.required],
            gpsCoordinates: [''],
            firstLossPayee: ['', Validators.required],
            insurableValue: ['', Validators.required],
            comment: ['', Validators.required],
            insuranceCompanyEmail: [''],
            companyPhone: [''],
        });

    }

    viewInsuranceInformationDetails(row) {
        this.insuranceInformationDetails = row;
        this.selectedId = row.collateralInsuranceTrackingId;
        this.insurancePolicyInformation(row.collateralInsuranceTrackingId);
        this.mainCollateralView = false;
        this.insuranceForm = false;
        this.displayMoreInsuranceInformationDetails = true;
    }

    displayInsuranceInformationDocument: boolean = false;
    viewInsuranceInformationDocument(row) {
        this.insuranceInformationDetails = row;
        this.mainCollateralView = false;
        this.insuranceForm = false;
        this.displayMoreInsuranceInformationDetails = false;
        this.displayInsuranceInformationDocument = true;
    }

    allRequiredDocumentsAreUploaded = true;
    setrequiredUploadValue(value: boolean) {
        this.allRequiredDocumentsAreUploaded = value;
    }

    insurancePolicyRecord: any
    currentStatus: any;
    populateInsuranceForm(row) {
        this.insurancePolicyRecord = row;
        console.log("helllllll "+ JSON.stringify(row));
        this.mainCollateralView = false;
        this.displayMoreInsuranceInformationDetails = false;
        this.insuranceForm = true;
        this.selectedId = row.collateralInsuranceTrackingId;
        this.insuranceStatusId = row.insuranceStatusId;
        
        this.calculateLastValuationDate(new Date(row.valuationStartDate));

        if (row.valuerId == null || row.valuerId == 0) {
            this.hideSelectValuer = false;
            this.showSelectValuer = true;
        }

        if (row.otherInsuranceCompany != null) {
            this.hideSelectInsuranceCompany = false;
            this.showSelectInsuranceCompany = true;
        }

        if (row.otherInsurancePolicyType != null) {
            this.hideSelectPolicyType = false;
            this.showSelectPolicyType = true;
        }

        if (row.collateralTypeId > 0) {
            this.collateralTypeChange(row.collateralTypeId);
            this.showCollateralSubType = true;
        }

        if (row.collateralSubTypeId > 0 && row.isGpsCoordinatesCollateralType) {
            this.showGpsCoordinates = true;
        }

        if (row.insuranceCompanyId > 0) {
            this.showOtherIsuranceCompany = true;
            this.companyProfile = this.insuranceCompanies.find(x => x.insuranceCompanyId == row.insuranceCompanyId);
        } else {
            this.companyProfile.contactEmail = "";
            this.companyProfile.companyPhone = "";
        }

        this.insuranceFormGroup = this.fb.group({
            insuranceStatusId: [row.insuranceStatusId, Validators.required],
            insuranceCompany: [row.insuranceCompanyId, Validators.required],
            companyAddress: [row.companyAddress, Validators.required],
            referenceNumber: [row.referenceNumber, Validators.required],
            insurancePolicyTypeId: [row.insurancePolicyTypeId, Validators.required],
            startDate: [new Date(row.startDate), Validators.required],
            expiryDate: [new Date(row.expiryDate), Validators.required],
            sumInsured: [row.sumInsured, Validators.required],
            inSurPremiumAmount: [row.inSurPremiumAmount, Validators.required],
            valuationStartDate: [new Date(row.valuationStartDate)],
            valuationEndDate: [new Date(row.valuationEndDate)],
            omv: [row.omv],
            fsv: [row.fsv],
            valuer: [row.valuerId],
            collateralDetails: [row.collateralDetails, Validators.required],
            otherInsurancePolicyType: [row.otherInsurancePolicyType],
            otherInsuranceCompany: [row.otherInsuranceCompany],
            otherValuer: [row.valuer],
            collateralTypeId: [row.collateralTypeId, Validators.required],
            collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
            gpsCoordinates: [row.gpsCoordinates],
            firstLossPayee: [row.firstLossPayee, Validators.required],
            insurableValue: [row.insurableValue, Validators.required],
            comment: [row.requestComment, Validators.required],
            insuranceCompanyEmail: [this.companyProfile.contactEmail],
            companyPhone: [this.companyProfile.phoneNumber],
        });

        //if (row.valuationStartDate != null) {
            this.valuationRequired = true;
        //}
    }

   

    validateValuation(policyTypeId) {
        if (policyTypeId == "others") {
            this.hideSelectPolicyType = false;
            this.showSelectPolicyType = true;
            this.valuationRequired = true;
        } else {
            this.hideSelectPolicyType = false;
            this.showSelectPolicyType = false;
            var insurancePolicType = this.insurancePolicTypes.find(x => x.policyTypeId == policyTypeId);
            this.valuationRequired = insurancePolicType.valuationRequired;
        }
    }

    companyProfile: any;
    validateInsuranceCompany(otherInsuranceCompany) {
        if (otherInsuranceCompany == "others") {
            this.hideSelectInsuranceCompany = false;
            this.showSelectInsuranceCompany = true;
        } else {
            this.hideSelectInsuranceCompany = false;
            this.showSelectInsuranceCompany = false;
            this.showOtherIsuranceCompany = true;
            this.companyProfile = this.insuranceCompanies.find(x => x.insuranceCompanyId == otherInsuranceCompany);
            this.insuranceFormGroup.controls['companyAddress'].setValue(this.companyProfile.address);
            this.insuranceFormGroup.controls['insuranceCompanyEmail'].setValue(this.companyProfile.contactEmail);
            this.insuranceFormGroup.controls['companyPhone'].setValue(this.companyProfile.phoneNumber);
        }
    }

    validateValuer(otherValuer) {
        if (otherValuer == "others") {
            this.hideSelectValuer = false;
            this.showSelectValuer = true;
        } else {
            this.hideSelectValuer = false;
            this.showSelectValuer = false;
        }
    }

    confirmInsuranceDetails(value) {
        if (value == "on") {
            const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'This cannot be reverted',
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
                __this.collateralService.confirmCompleteInformation(__this.selectedId).subscribe((response) => {
                    __this.resultResponse = response.result;
                    __this.insurancePolicyInformation(__this.selectedId)
                    __this.closeCollateralDetails();
                    if(response.success == true){
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Record Confirmation Successfully', 'success');
                    }else{
                        swal(GlobalConfig.APPLICATION_NAME, response.result, 'error');
                    }
                    __this.loadingService.hide();
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
                }
            });
        }
    }

    deleteInsuranceForm(data) {
        if (data.collateralInsuranceTrackingId > 0) {
            const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'This cannot be reverted',
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
                __this.collateralService.deleteInsuranceInformation(data.collateralInsuranceTrackingId).subscribe((response) => {
                    __this.resultResponse = response.result;
                    __this.closeCollateralDetails();
                    if(response.success == true){
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Record Deleted Successfully', 'success');
                }else{
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.result, 'error');  
                }
                    __this.loadingService.hide();
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
                }
            });
        }
    }

    insuranceReportHtml: any;
    insurancePolicyReport(data) {
        this.collateralService.getInsurancePolicyReport(data.collateralInsuranceTrackingId).subscribe((response) => {
            if (response.result == null) return;
            this.insuranceReportHtml = response.result;

            this.mainCollateralView = false;
            this.insuranceForm = false;
            this.displayMoreInsuranceInformationDetails = false;
            this.displayInsuranceReport = true;

        }, (err) => {

        });
    }

    printMemo(): void {
        let printTitle = 'INSURANCE POLICY REPORT';
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
              <head>
              <title>${printTitle}</title>
              <style>s
              </style>
              </head>
              <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }

    empty() {
        this.insuranceReportHtml = null;
    }

}

