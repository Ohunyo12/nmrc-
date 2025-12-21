import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { ApplicationStatus, GlobalConfig, CollateralType } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { CreditAppraisalService } from '../services';
import { saveAs } from 'file-saver';
import { data } from 'jquery';
import { LoadingService } from '../../shared/services/loading.service';
import { CollateralService } from '../../setup/services/collateral.service';
import { ApplicationStatus, GlobalConfig, CollateralType } from '../../shared/constant/app.constant';
import { ApprovalService } from 'app/setup/services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cash-security-release',
    templateUrl: './cash-security-release.component.html'
})
export class CashSecurityReleaseComponent implements OnInit {


    // ------------------- declarations -----------------
    @Input() applicationCustomerId: number = null;
    @Input() applicationCustomerName: string;

    @Input() panel: boolean = false;
    @Input() label: string = '';
    parameter: any;
    applications: any;
    loanSelection: any;
    originalDocumentApprovalId: any;
    originalDocumentApproval: any[];
    showdocumentInformationForm: boolean = false;
    applicationReferenceNumber: any;
    customerId: any;
    operationId: any;
    activeTabindex: number = 0;
    newOriginalDocument: boolean = true;
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
    showUploadeddocument: boolean = false;
    documentUploadList: any;
    ReleaseRecords: any[] = [];
    searchCustomerId: any;
    customerCode: any;
    showCusotmerSearch: boolean;
    //private collateralService: CollateralService;
    collateralList: any[];
    collateralListApplications: any[];
    selectedCollateralId: any;
    mainCollateralDetail: any;
    customerCollateral: any;
    isInsurancePolicy: any;
    isVisitation: any;
    customerName: any;
    collateralProperty: boolean;
    mainCollateralView: boolean;
    collateralMarketableSecurity: boolean;
    collateralGaurantee: boolean;
    collateralEquipment: boolean;
    collateralVehicle: boolean;
    collateralStock: boolean;
    collateralPreciousMetal: boolean;
    collateralCasa: boolean;
    collateralDeposit: boolean;
    collateralItemPolicy: boolean;
    indemnity: boolean;
    collateralPromissory: boolean;
    collateralIspo: boolean;
    domiciliationContract: boolean;
    domiciliationSalary: boolean;
    useSearch: boolean;
    hideGrid: boolean;
    supportingDocuments: any;
    collateralValuations: any;
    collateralId: any;
    loanApplicationId: any;
    response: string;
    approvalReleases: any[];
    editSecurityRelease: boolean;
    //applicationCustomerId: number;
    //applicationCustomerName: string;

    @Input() set reload(value: number) { if (value > 0) this.getOriginalDocumentApprovals(); }

    formState: string = 'New';
    selectedId: number = null;
    loanDetail: boolean = false;
    facilityDetail: boolean = false;
    documentTab: boolean = false;
    originalDocumentApprovals: any[] = [];
    originalDocumentApprovalForm: FormGroup;
    initiationGuaranteeForm: FormGroup;
    displayOriginalDocumentApprovalForm: boolean = false;
    deleteLink: boolean = true;
    showUploadForm: boolean = true;
    documentUploadForm: boolean = false;
    documentUploadComponent: boolean = false;
    documentInformationForm: any;
    buttonLabel: string = 'Search For Approved Documents';
    selectedRows: any[] = [];
    selectedRow: any;
    accordionIndex: any;

    RELOAD: number = 1;
    OPERATION_ID: number = 282;
    CUSTOMER_ID: number;
    GROUP_CUSTOMER_ID: number = -1;
    REFERENCE_NUMBER: string;
    TARGET_ID: number;
    reloadDocsOnly: number = 0;
    comment: any;

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
        this.getRejectedAndReferredSecurityRelease();
        this.documentOperation = 0;
    }

    private subscriptions = new Subscription();
    trail: any[] = [];
    trail23: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;
    getTrail23(targetId, operationId) {
        this.loadingService.show();
        this.subscriptions.add(
                this.creditAppraisalService.getTrailLms(targetId, operationId).subscribe((response: any) => {
                this.trail23 = response.result;
                this.trailCount = this.trail.length;
                this.trailRecent = response.result[0];
                this.referBackTrail23();
                response.result.forEach((trail23) => {
                    if (this.trailLevels.find(x => x.requestStaffId === trail23.requestStaffId) === undefined) {
                        this.trailLevels.push(trail23);
                    }
                });

                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }

    referBackTrail23(): any {
        this.trail23.forEach(x => {
            if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId
                && t.requestStaffId == x.requestStaffId) == null && x.fromApprovalLevelId != null) {
                this.backtrail.push({
                    approvalTrailId: x.approvalTrailId,
                    fromApprovalLevelId: x.fromApprovalLevelId,
                    fromApprovalLevelName: x.fromApprovalLevelName,
                    requestStaffId: x.requestStaffId,
                    staffName: x.staffName,
                });
            }
        });
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    InitializeForm() {
        this.documentInformationForm = this.fb.group({

            loanApplicationId: [''],
            description: ['', Validators.required],
            applicationReferenceNumber: ['', Validators.required],
            isTheDocumentOrigianl: [false, Validators.required]
        });
    }

    // ------------------------------- Newly Added Methods ------------------------------------- //
    getCustomerDetail(event, name = null): void {
        this.searchCustomerId = event.customerId;
        this.getCustomerCashCollateral(this.searchCustomerId);
        this.showCusotmerSearch = false;
    }


    getCustomerCashCollateral(id, name = null): void {
        this.loadingService.show();
        this.collateralService.getCustomerCashCollateral(id, null).subscribe((response: any) => {
            this.collateralList = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCustomerCashCollateralApplications(id): void {
        this.loadingService.show();
        this.collateralService.getCustomerCashCollateralApplications(id).subscribe((response: any) => {
            this.collateralListApplications = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadCustomerCollaterals(customerId) {
        if (customerId != null) this.getCustomerCashCollateral(this.applicationCustomerId, this.applicationCustomerName);
    }

    viewValuationDetail(row) {
        this.editSecurityRelease = false;
        this.selectedCollateralId = row.collateralId;
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.customerCode = row.customerCode;
        this.RELOAD++;
        this.getCollateralInformation(row.collateralId);
        this.selectedRow = row;
        this.getCustomerCashCollateralApplications(row.collateralId);
    }

    public getCollateralInformation(collateralCustomerId: number): any {
        this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
            .subscribe((res) => {
                this.mainCollateralDetail = res.result[0];
                this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
                    .subscribe((res) => {
                        this.customerCollateral = res.result;
                        if (this.customerCollateral == null || this.customerCollateral == undefined) {
                            this.customerCollateral = {};
                            swal(GlobalConfig.APPLICATION_NAME, 'Collateral Details have not been captured!', 'warning');
                        }

                        this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                        this.isVisitation = this.mainCollateralDetail.requireVisitation;
                        this.collateralId = this.mainCollateralDetail.collateralId;
                        this.customerName = this.mainCollateralDetail.customerName;
                        this.customerId = this.mainCollateralDetail.customerId;
                        this.customerCode = this.mainCollateralDetail.customerCode;
                        this.customerCode = this.customerCode;


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

                    });

                this.activeTabindex = 1;
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }

    getSupportingDocuments(id) {
        this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
            this.supportingDocuments = response.result;
        });
    }



    getOriginalDocumentApprovals() {
        this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
            this.originalDocumentApprovals = response.result;
        });
    }


    getRejectedAndReferredSecurityRelease() {
        this.creditAppraisalService.getRejectedAndReferredCashSecurityRelease().subscribe((response: any) => {
            this.approvalReleases = response.result;
        });
    }

    edit(row) {
        this.accordionIndex = 0;
        this.reloadDocsOnly = 1;
        this.selectionLoan = row;
        this.activeTabindex = 3;
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.customerCode = row.customerCode;
        this.RELOAD++;
    }

    deleteOriginalDocumentApproval(row) {
        this.approvalService.deleteOriginalDocumentApproval(row.originalDocumentApprovalId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.getOriginalDocumentApprovals();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.originalDocumentApprovalForm = this.fb.group({
            loanApplicationId: ['', Validators.required],
            description: [''],
            approvalStatusId: ['', Validators.required],
        });

        this.initiationGuaranteeForm = this.fb.group({
            isGuarantee: [''],
            comment: ['', Validators.required]
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

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    hideMessage(event) {
        this.show = false;
    }

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



    getOriginalDocumentByCollateralCustomerId(id) {
        this.approvalService.getOriginalDocumentByCollateralCustomerId(id).subscribe((response: any) => {
            this.originalDocumentApproval = response.result;
        });
    }

    selectDocumentToUpload(row) {

        this.documentUploadComponent = true;
    }


    isChecked: boolean = false;
    changed = (evt) => {
        this.isChecked = evt.target.checked;
    }

    SubmitForApproval() {
        if (this.isChecked == false) {
            let __this = this;
            swal({
                title: 'Are you sure?',
                text: "This transaction will go through approval. Are you sure you want to proceed?",
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
                    selectionLoan: __this.selectionLoan,
                    comment: __this.comment
                }
                __this.goForApproval(data);

            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });

        } else {
            let __this = this;
            swal({
                title: 'Are you sure?',
                text: "This transaction will go through guarantee cash security release approval. Are you sure you want to proceed?",
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

                let data = __this.selectionLoan;
                data.comment = __this.comment;
                __this.goForGuaranteeApproval(data);

            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });

        }

    }


    goForApproval(data) {
        this.approvalService.securityReleaseApproval(data).subscribe((response: any) => {
            this.loadingService.show();
            if (response.success == true) {
                this.getRejectedAndReferredSecurityRelease();
                this.clearReleaseList();
                this.loadingService.hide();
                this.activeTabindex = 0;
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Transaction has been Successfully Sent for Approval", 'success');
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            };
        });
    }


    displayCusotmerSearchModal() {
        this.showCusotmerSearch = true;
        this.activeTabindex = 0;
    }

    goForGuaranteeApproval(data) {
        this.loadingService.show();
        this.approvalService.guaranteeReleaseApproval(data).subscribe((response: any) => {
            if (response.success == true) {
                this.getRejectedAndReferredSecurityRelease();
                this.clearReleaseList();
                this.loadingService.hide();
                this.activeTabindex = 0;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            };
            this.loadingService.hide();
        });
    }

    selectionLoan: any;
    viewDocuments(row) {
        this.reloadDocsOnly = 1;
        this.selectionLoan = row;
        this.activeTabindex = 3;
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.customerCode = row.customerCode;
        this.RELOAD++;
    }

    showAllUploadedDocument: boolean = false;
    uploadedDocuments(row) {
        this.reloadDocsOnly = 1;
        this.selectionLoan = row;
        this.activeTabindex = 3;
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.customerCode = row.customerCode;
        this.RELOAD++;
        this.showAllUploadedDocument = true;
    }

    showComments: boolean = false;
    applicationId: any;
    viewComments(row) {
        this.applicationId = row.cashSecurityReleaseIseId;
        this.operationId = row.operationId;
        this.getTrail23(this.applicationId, this.operationId);
        this.showComments = true;
    }

    getDocumentsByTarget(operationId: Number, originalDocumentApprovalId: Number) {
        this.creditAppraisalService.getAvailableCollateralDocuments(operationId, originalDocumentApprovalId).subscribe((response: any) => {
            this.documentUploads = response.result;
            this.showUploadeddocument = true;
        });
    }


    onSelectChange(target) {
        this.parameter = '';
        this.displayStartOperation = false;
        this.showBackButton = true;
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

    closeUploadedDocument() {
        this.showUploadeddocument = false;
    }

    clearReleaseList() {
        this.documentUploadList = [];
        this.selectedRows = [];
        this.ReleaseRecords = [];
        this.editSecurityRelease = false;
    }

    addToReleaseList() {
        if (this.editSecurityRelease == true) {
            for (let data of this.selectedRows) {

                let index = this.ReleaseRecords.findIndex(obj => obj.documentUploadId == data.documentUploadId);
                if (index < 0 || index == null || index == undefined) {
                    this.ReleaseRecords.push({
                        documentUploadId: data.documentUploadId,
                        documentTypeName: data.documentTypeName,
                        documentCategoryName: data.documentCategoryName,
                        fileName: data.fileName,
                        fileSize: data.fileSize,
                        fileSizeString: data.fileSizeString,
                        fileExtension: data.fileExtension,
                        originalDocumentApprovalId: this.selection.originalDocumentApprovalId,
                        originalDocumentReleaseId: this.selection.originalDocumentReleaseId,
                        approvalStatusId: 5,
                        companyId: this.selection.companyId,
                    });
                }
            }
        }
        else {
            for (let data of this.selectedRows) {
                let index = this.ReleaseRecords.findIndex(obj => obj.documentUploadId == data.documentUploadId);
                if (index < 0 || index == null || index == undefined) {
                    this.ReleaseRecords.push({
                        documentUploadId: data.documentUploadId,
                        documentTypeName: data.documentTypeName,
                        documentCategoryName: data.documentCategoryName,
                        fileName: data.fileName,
                        fileSize: data.fileSize,
                        fileSizeString: data.fileSizeString,
                        fileExtension: data.fileExtension,
                        originalDocumentApprovalId: this.selection.originalDocumentApprovalId,
                        originalDocumentReleaseId: this.selection.originalDocumentReleaseId,
                        approvalStatusId: 0,
                        companyId: this.selection.companyId,
                    });
                }
            }
        }

        this.documentUploadList = this.ReleaseRecords;
        this.activeTabindex = 3;
        this.showUploadeddocument = false;

    }

    reinitiateSecurityRelease(originalDocumentReleaseId) {
        this.approvalService.changeStatusOfRejectedMailAndGoForApproval(originalDocumentReleaseId).subscribe((response: any) => {
            this.loadingService.show();
            if (response.result == true) {
                this.getRejectedAndReferredSecurityRelease();
                this.clearReleaseList();
                this.loadingService.hide();
                this.activeTabindex = 0;
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Transaction has been Successfully Reinitiated and Sent for Approval", 'success');
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            };
        });
    }

    reinitiate(row) {

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This transaction will go through approval. Are you sure you want to proceed?",
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

            __this.reinitiateSecurityRelease(row.originalDocumentReleaseId);

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }



}

