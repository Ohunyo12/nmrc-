import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService } from 'app/setup/services';
import { CollateralService } from 'app/setup/services/collateral.service';
import { ApplicationStatus, GlobalConfig, CollateralType, ApprovalStatus, ProductClassProcessEnum } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { CreditAppraisalService } from '../services';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-original-document-submission',
    templateUrl: './original-document-submission.component.html',
    // styleUrls: ['./original-document-submission.component.scss']
})
export class OriginalDocumentSubmissionComponent implements OnInit {


    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    parameter: any;
    applications: any;
    loanSelection: any;
    originalDocumentApprovalId: any;
    originalDocumentApproval: any[];
    originalFacilityDocuments: any[];
    showdocumentInformationForm: boolean = false;
    approvedOriginalFacilityDocument: boolean = false;
    applicationReferenceNumber: any;
    customerId: any;
    customerCode: any;
    operationId = 134;
    activeTabindex: number = 0;
    displaySubmissionByFacility: boolean = false;
    displaySubmissionByCollateral: boolean = true;
    newOriginalDocument: boolean = false;
    approvedOriginalDocument: boolean = false;
    displayStartOperation: boolean = true;
    documentUploads: any;
    approvedOriginalDocumentList: any;
    documentOperation: number;
    showBackButton: boolean = false;
    showDocumentUpload: boolean = true;
    selection: any;
    ShowFacilityDetail: boolean = false;
    fileDocument: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
    searchCustomerId: any;
    showCusotmerSearch: boolean;
    showFacilitySearch: boolean;
    collateralList: any[];
    applicationCustomerName: any;
    selectedCollateralId: any;
    selectedRow: any;
    mainCollateralDetail: any;
    customerCollateral: any;
    isInsurancePolicy: any;
    collateralId: any;
    isVisitation: any;
    customerName: any;
    useSearch: boolean;
    hideGrid: boolean;
    supportingDocuments: any;
    collateralValuations: any;
    collateralProperty: boolean;
    collateralMarketableSecurity: boolean;
    collateralGaurantee: boolean;
    collateralEquipment: boolean;
    mainCollateralView: boolean;
    collateralVehicle: boolean;
    collateralStock: boolean;
    collateralPreciousMetal: boolean;
    collateralCasa: boolean;
    collateralDeposit: boolean;
    collateralItemPolicy: boolean;
    collateralPromissory: boolean;
    indemnity: boolean;
    collateralIspo: boolean;
    domiciliationContract: boolean;
    domiciliationSalary: boolean;
    targetId: any;
    loanApplicationId:any;
    showDocumentsSearchForm: boolean = false;
    showDocumentsFacilitySearchForm: boolean = false;
    originalDocuments: any;
    showUploadeddocument: boolean = false;searchResultSelection: any;
    documentUploadList: any;
    uploadLength = 0;
    editdocumentUploads: any;
    editSelection: any;
    approvalStatusId: number;
    comment: any = 'Request For Original Document Submission';
    editOriginalDocument: boolean;
    buttonState: string = 'Add';
    description: any;
    collateralCode: any;
    rowToEdit: any;
    reload: number = 1;
    selectedFacilityId: any;
    selectedFacility: any;

    //@Input() set reload(value: number) { if (value > 0) this.getOriginalDocumentApprovals(); }

    formState: string = 'New';
    selectedId: number = null;
    loanDetail: boolean = true;
    facilityDetail: boolean = false;
    documentTab: boolean = false;
    originalDocumentApprovals: any[] = [];
    originalDocumentApprovalForm: FormGroup;
    displayOriginalDocumentApprovalForm: boolean = false;
    deleteLink: boolean = true;
    showUploadForm: boolean = true;
    documentUploadForm: boolean = false;
    documentUploadComponent: boolean = false;
    documentInformationForm: any;
    buttonLabel: string = 'Search For Approved Documents';
    // ---------------------- init ----------------------

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalService: ApprovalService,
        private collateralService: CollateralService,
        private creditAppraisalService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.InitializeForm();
        this.documentOperation = 0;
        this.getDocumentUploadList();
    }


    displaySubmissionByFacilityForm(){
        this.selectedFacility = {};
        this.displaySubmissionByCollateral = false;
        this.displaySubmissionByFacility = true;
        this.showFacilitySearch = true;
    }

    displaySubmissionByCollateralForm(){
        this.selectedFacility = {};
        this.displaySubmissionByCollateral = true;
        this.displaySubmissionByFacility = false;
        this.showCusotmerSearch = true;
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
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
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    InitializeForm() {
        this.documentInformationForm = this.fb.group({
            loanApplicationId: [''],
            description: ['', Validators.required],
            applicationReferenceNumber: ['', Validators.required],
            isOriginalTitleDocument: [false, Validators.required],
            originalDocumentApprovalId: [''],
        });
        // isTheDocumentOrigianl //for reference!!!!
    }

    // ------------------------------- Newly Added Methods ------------------------------------- //

    getCustomerDetail(id, name = null): void {
        this.searchCustomerId = id;
        this.getCustomerCollateral(this.searchCustomerId);
        this.showCusotmerSearch = false;
    }

    getFacilityDetail(id, name = null): void {
        this.searchCustomerId = id;
        this.getCustomerFacility(this.searchCustomerId);
        this.showFacilitySearch = false;
    }


    getCustomerCollateral(id, name = null): void {
        this.loadingService.show();
        this.collateralService.getCustomerCollateral(id, null).subscribe((response: any) => {
            this.collateralList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    facilityList: any[] = [];
    getCustomerFacility(id, name = null): void {
        this.loadingService.show();
        this.collateralService.getCustomerFacility(id, null).subscribe((response: any) => {
            this.facilityList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadCustomerCollaterals(customerId) {
        if (customerId != null) this.getCustomerCollateral(this.applicationCustomerId, this.applicationCustomerName);
    }

    applicationCustomerId(applicationCustomerId: any, applicationCustomerName: any) {
        throw new Error("Method not implemented.");
    }

    viewCollateralDetail(row) {
        this.buttonState = 'Add';
        this.selectedCollateralId = row.collateralId;
        this.collateralCode = row.collateralCode;
        this.approvalStatusId = row.approvalStatusId;
        var collateralDetail = this.getCollateralInformation(row.collateralId);
        this.selectedRow = row;
        //console.log('checkRow', row);
        //console.log("collateralDetail:", collateralDetail);
        //this.loadUploadDetails(row);
    }

    
    viewFacilityDetail(row) {
        this.buttonState = 'Add';
        this.selectedFacility = row;
        this.selectedFacilityId = row.loanApplicationDetailId;
        this.approvalStatusId = row.approvalStatusId;
        this.customerId = row.customerId;
        this.activeTabindex = 1;
    }


    edit(row) {
        this.rowToEdit = row;
        //console.log('ROOOOOOWWWWWW', row);
        this.description = row.description;
        this.collateralCode = row.collateralCode;
        this.approvalStatusId = row.approvalStatusId;
        this.operationId = row.operationId;
        this.customerId = row.customerId;
        this.customerCode = row.customerCode;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.buttonState = 'Edit';
        this.getCollateralInformation(row.collateralCustomerId);
        this.selectedCollateralId = row.collateralCustomerId;
        this.displayStartOperation = false;
        this.editOriginalDocument = true;
    }

    reset(){
        this.clearControls();
        this.originalDocumentApprovalId = 0;
        this.customerId = 0;
        this.activeTabindex=0;
    }

    public getCollateralInformation(collateralCustomerId: number): any {
        this.loadingService.show();
        this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
            .subscribe((res) => {
                this.loadingService.hide();
                this.mainCollateralDetail = res.result[0];

                this.loadingService.show();
                this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
                    .subscribe((res) => {
                    this.loadingService.hide();
                        this.customerCollateral = res.result;
                        if (this.customerCollateral == null) {
                            this.customerCollateral = {};
                            swal(GlobalConfig.APPLICATION_NAME, 'Collateral Details have not been captured!', 'warning');
                        }

                        this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                        this.isVisitation = this.mainCollateralDetail.requireVisitation;
                        this.collateralId = this.mainCollateralDetail.collateralId;
                        this.customerName = this.mainCollateralDetail.customerName;
                        this.customerId = this.mainCollateralDetail.customerId;
                        this.customerCode = this.mainCollateralDetail.customerCode;
                        this.customerCode = this.customerCode

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
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.PROMISSORY) { this.collateralPromissory = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.INDEMNITY) { this.indemnity = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.ISPO) { this.collateralIspo = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.domiciliationContract = true; this.mainCollateralView = true; }
                        if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONSALARY) { this.domiciliationSalary = true; this.mainCollateralView = true; }

                        this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

                        this.getSupportingDocuments(collateralCustomerId);
                        this.getCollateralValuations(collateralCustomerId);
                        // if (this.isInsurancePolicy) {
                        //   this.getCollaterTempItemPolicies(collateralCustomerId);
                        // }

                    }, (err) => {
                        this.loadingService.hide(1000);
                    });

                this.activeTabindex = 1;
            }, (err) => {
                this.loadingService.hide(1000);
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }

    getSupportingDocuments(id) {
        this.loadingService.show();
        this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
            ////console.log('documents..', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCollateralValuations(collateralId: number) {
        this.loadingService.show();
        this.collateralService.getCollateralValuations(collateralId).subscribe((response: any) => {
            this.collateralValuations = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // ------------------- api-calls --------------------

    getOriginalDocumentApprovals() {
        this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
            this.originalDocumentApprovals = response.result;
        });
    }

    getOriginalDocument(id) {
        this.approvalService.getOriginalDocument(id).subscribe((response: any) => {
            this.originalDocumentApproval = response.result;
            

        });
    }

    deleteOriginalDocumentApproval(row) {
        this.approvalService.deleteOriginalDocumentApproval(row.originalDocumentApprovalId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        // this.displayOriginalDocumentApprovalForm = false;
        this.getOriginalDocumentApprovals();
    }

    getDocumentUploadList() {
        this.loadingService.show();
        this.collateralService.getDocumentUploadList().subscribe((response: any) => {
            if (response.success == true) {
                this.documentUploadList = response.result;
                // console.log('this.documentUploadList', this.documentUploadList);
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);

        });
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.originalDocumentApprovalForm = this.fb.group({
            loanApplicationId: ['', Validators.required],
            description: [''],
            approvalStatusId: ['', Validators.required],
        });
    }

    editOriginalDocumentApproval(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.originalDocumentApprovalId;
        this.originalDocumentApprovalForm = this.fb.group({
            loanApplicationId: [row.loanApplicationId, Validators.required],
            description: [row.description],
            approvalStatusId: [row.approvalStatusId, Validators.required],
        });
        this.displayOriginalDocumentApprovalForm = true;
    }

    showOriginalDocumentApprovalForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayOriginalDocumentApprovalForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

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

    search() {

        if (this.newOriginalDocument == true) {
            this.buttonLabel = 'Search For Approved Documents';

            this.approvalService.search(this.parameter).subscribe((response: any) => {
                this.applications = response.result;

                this.displayOriginalDocumentApprovalForm = false;
            });

        } else if (this.approvedOriginalDocument == true) {
            this.buttonLabel = 'New Request';
            this.approvalService.searchApprovedOriginalDocument(this.parameter).subscribe((response: any) => {
                this.approvedOriginalDocumentList = response.result;

                this.displayOriginalDocumentApprovalForm = false;
            });
        }
    }

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    selectLoan(row) {
        this.loanSelection = row;
        this.applicationReferenceNumber = row.applicationReferenceNumber;
        this.customerId = row.customerId;
        this.operationId = row.operationId
        this.facilityDetail = true;
        this.loanDetail = false;
        this.getOriginalDocumentByCollateralCustomerId(row.loanApplicationId);
    }

    getOriginalDocumentByCollateralCustomerId(id) {
        this.approvalService.getOriginalDocumentByCollateralCustomerId(id).subscribe((response: any) => {
            this.originalDocumentApproval = response.result;
           

        });
    }

    UploadOriginalDocument() {

        if(this.buttonState == 'Edit') {

            this.documentInformationForm.controls['description'].setValue(this.description);
            this.documentInformationForm.controls['originalDocumentApprovalId'].setValue(this.rowToEdit.originalDocumentApprovalId);
            this.documentInformationForm.controls['isOriginalTitleDocument'].setValue(this.rowToEdit.isOriginalTitleDocument);
        }
        
        this.documentInformationForm.controls['applicationReferenceNumber'].setValue(this.selectedCollateralId);
        this.originalDocumentApproval = [];
        this.showdocumentInformationForm = true;

    }

    UploadFacilityOriginalDocument() {

        if(this.buttonState == 'Edit') {

            this.documentInformationForm.controls['description'].setValue(this.description);
            this.documentInformationForm.controls['originalDocumentApprovalId'].setValue(this.rowToEdit.originalDocumentApprovalId);
            this.documentInformationForm.controls['isOriginalTitleDocument'].setValue(this.rowToEdit.isOriginalTitleDocument);
        }
        
        this.documentInformationForm.controls['applicationReferenceNumber'].setValue(this.selectedFacilityId);
        this.originalDocumentApproval = [];
        this.showdocumentInformationForm = true;

    }

    registerNewDocument(form) {
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "Are you sure you want to proceed with document upload?",
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
                loanApplicationId : __this.selectedFacility.loanApplicationId,
                applicationReferenceNumber :__this.selectedFacility.applicationReferenceNumber,
                collateralCustomerId: form.value.applicationReferenceNumber,
                collateralCode: __this.collateralCode,
                approvalStatusId: __this.approvalStatusId,
                description: form.value.description,
                isOriginalTitleDocument: form.value.isOriginalTitleDocument,
                originalDocumentApprovalId: form.value.originalDocumentApprovalId
            }
            __this.loadingService.show();
            __this.approvalService.saveOriginalDocumentApproval(data).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success == true) {
                    __this.originalDocumentApprovalId = response.result
                  
                    __this.getDocumentUploadList();
                    __this.InitializeForm();
                    __this.getOriginalDocument(__this.originalDocumentApprovalId);
                    __this.activeTabindex = 2;
                    __this.documentTab = true;
                    //__this.editOriginalDocument = false;
                    __this.showdocumentInformationForm = false;
                };
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });


    }

    selectDocumentToUpload(row) {
        this.documentUploadComponent = true;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.loadUploadDetails(row);
    }


    SumitForApproval() {
        
        if (this.uploadLength == 0) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Upload atleast a document', 'error');
        } else {

            let __this = this;
            swal({
                title: 'Are you sure?',
                text: "This cannot be reversed. Are you sure you want to proceed?",
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
                    originalDocumentApprovalId: __this.originalDocumentApprovalId,
                    approvalStatusId: __this.approvalStatusId,
                }

                __this.originalDocumentGoForApproval(data);

            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
        }


    }

    Delete(row) {
        this.deleteOriginalDocumentApproval(row)
        this.getOriginalDocument(this.originalDocumentApprovalId);
        this.getOriginalDocumentApprovals();
        this.documentUploadComponent = false;
    }

    originalDocumentGoForApproval(data) {
        this.loadingService.showKeyApiCall();
        this.approvalService.originalDocumentApproval(data).subscribe((response: any) => {
            if (response.success == true) {
                this.getOriginalDocument(this.originalDocumentApprovalId);
                // this.getDocumentUploadList();
                //  this.getOriginalDocumentApprovals();
                this.uploadLength = 0;
                //this.documentUploadComponent = false;
                this.mainMenu();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            };
        this.loadingService.hideKeyApiCall();
    }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hideKeyApiCall(1000);
    });
    }


    viewDetail(row) {
       
        this.selection = row;
        this.ShowFacilityDetail = true;
        this.showDocumentUpload = false;
        this.activeTabindex = 1;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        //this.getDocumentsByTarget();
        //this.loadUploadDetails(row);
    }

    loadUploadDetails(row) {
        //this.customerId = this.searchCustomerId;
        this.targetId = row.originalDocumentApprovalId;
        this.operationId = row.operationId;
        this.applicationReferenceNumber = row.referenceNumber;
        this.showUploadForm = true;
    }

    // loadUploadDetailsFromList(row) {
    //     this.customerId = row.customerId;
    //     this.targetId = row.originalDocumentApprovalId;
    //     this.operationId = row.operationId;
    //     this.applicationReferenceNumber = row.applicationReferenceNumber;
    //     this.showUploadForm = true;
    // }

    // getDocumentsByTarget() {
    //     this.creditAppraisalService.getDocumentsByTarget(this.loanSelection.operationId, this.loanSelection.originalDocumentApprovalId).subscribe((response: any) => {
    //         this.documentUploads = response.result;
    //     });
    // }

    showDocumentsSearch(){
        this.showDocumentsFacilitySearchForm = false;
        this.showDocumentsSearchForm = true;
    }

    showDocumentsSearchFacility(){
        this.showDocumentsFacilitySearchForm = true;
        this.showDocumentsSearchForm = false;
    }

    onSelectChange(target) {
        this.parameter = '';
        this.displayStartOperation = false;
        this.showBackButton = true;
        this.mainCollateralDetail = null;
        if (target == 1) {
            this.newOriginalDocument = true;
            this.approvedOriginalDocument = false;
        } else {
            this.newOriginalDocument = false;
            this.approvedOriginalDocument = true;
            this.showDocumentUpload = true;
        }

    }
    
    backToDucumentList() {
        this.approvedOriginalDocument = true;
    }

    downloadDocument(row, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;

                if (view) {
                    this.displayDocument = true;
                    return;
                }

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
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    getCustomerDocuments(id) {
    this.creditAppraisalService.originalDocumentStatus(id).subscribe((response: any) => {
        this.originalDocuments = response.result;
        this.approvedOriginalDocument = true;
            this.approvedOriginalFacilityDocument = false;
    });
    this.showDocumentsSearchForm= false;
    }

    getCustomerFacilityDocuments(id) {
        this.creditAppraisalService.originalFacilityDocumentStatus(id).subscribe((response: any) => {
            this.originalFacilityDocuments = response.result;
            this.approvedOriginalDocument = false;
            this.approvedOriginalFacilityDocument = true;
        });
        this.showDocumentsFacilitySearchForm= false;
        }
    


    viewDocuments(row) {
        this.searchResultSelection = row;
        //this.activeTabindex =1;
        //this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        
        this.getDocumentsByTarget(this.searchResultSelection.operationId, this.searchResultSelection.originalDocumentApprovalId);
    }

    getDocumentsByTarget(operationId: Number, originalDocumentApprovalId: Number) {
       
        this.creditAppraisalService.getDocumentsByTarget(operationId, originalDocumentApprovalId,true).subscribe((response: any) => {
            this.documentUploads = response.result;
            this.showUploadeddocument = true;
        });
    }

    EditUpload(row) {
        // this.uploadLength = null;
        this.editSelection = row;
        this.getDocumentsByTargetForEdit(this.editSelection);
        this.operationId = row.operationId;
        this.customerId = row.customerId;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.applicationReferenceNumber = row.applicationReferenceNumber;
        this.activeTabindex = 2;
    }

    getDocumentsByTargetForEdit(row) {
        this.loadingService.show();
        this.creditAppraisalService.getDocumentsByTarget(row.operationId, row.originalDocumentApprovalId,true).subscribe((response: any) => {
            if(response.success){
                this.editdocumentUploads = response.result;
                this.loadingService.hide();
            }
        });
    }

    uploadCount(event) {
       
        this.uploadLength = event;
    }

    uploadCountForEdit(event)
    {
       
        this.uploadLength = event;
        this.getDocumentsByTargetForEdit(this.editSelection);
    }

    mainMenu() {
        this.InitializeForm();
        this.getDocumentUploadList();
        this.mainCollateralDetail = null;
        this.reset();
        this.uploadLength = 0;
        this.newOriginalDocument = false;
        this.documentUploadComponent = false;
        this.approvedOriginalDocument = false;
        this.showDocumentUpload = false;
        this.displayStartOperation = true;
        this.editOriginalDocument = false;
        this.activeTabindex = 0;
        
    }

    removeFromUploadList(row) {
        
        this.approvalService.deleteFromUploadList(row.originalDocumentApprovalId).subscribe((response: any) => {
            if(response.success){
                this.getDocumentUploadList();
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Removed Successfully', 'success');
            }
        });
    }

    cancelForEdit() {
        this.editSelection = null;
        this.activeTabindex = 0;
    }

}

