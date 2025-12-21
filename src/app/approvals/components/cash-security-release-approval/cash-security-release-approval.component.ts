import { Component, OnInit } from '@angular/core';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { saveAs } from 'file-saver';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { CollateralType, GlobalConfig } from 'app/shared/constant/app.constant';
import { LoanApplicationService, LoanService } from 'app/credit/services';
import { CollateralService } from '../../../setup/services/collateral.service';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { AuthorizationService, AuthenticationService } from '../../../admin/services';

@Component({
  selector: 'app-cash-security-release-approval',
  templateUrl: './cash-security-release-approval.component.html'
})
export class CashSecurityReleaseApprovalComponent implements OnInit {

    
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
   

    approvalReleases: any[]=[];
    showApprovalBottun = false;
    showUploadeddocument: boolean = false;
    documentUploads: any[];
    selectedRows: any[] = [];
    selection: any;
    activeTabindex: number = 0;
    operationId: number;
    targetId: number;
    fileDocument: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
    displayUploadedDocumentTable: boolean = false;
    comment: any;
    approvalStatusId: any;
    displayCommentForm: any;
    commentForm: FormGroup;
    ShowFacilityDetail: any;
    myGroup: FormGroup;
    originalDocumentApprovalId: any;
    loanSelection: any;
    loanApplicationId: any;
    docSubmissionOperationId: any;
    selectedId: number = null;
    trailApprovalLevels: any;
    rowSelected: boolean = false;
    confirmNumberOfTimesApprove: number = 0;
    approvalLevelId: any;

    perfectionForm: FormGroup;
    perfectionList: any;
    showPerfectionStatus: boolean = false;
    showLitigationStatus: boolean = false;
    showIsOnAmconList: boolean = false;
    staffRoleRecord: any;
    reloadDocsOnly: number = 0;
    RELOAD: number = 1;
    OPERATION_ID: number = 282;
    CUSTOMER_ID: number;
    GROUP_CUSTOMER_ID: number = -1;
    REFERENCE_NUMBER: string;
    TARGET_ID: number;
    isOnAmconList: any;
    litigationStatus: any;
    perfectionStatus: any;
    isFinalApproval: boolean = false;
    userInfo: any;

    constructor(private creditAppraisalService: CreditAppraisalService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private loanApplService: LoanApplicationService,
        private loanBookingService: LoanService,
        private camService: CreditAppraisalService,
        private collateralService: CollateralService,
        private staffRole: StaffRoleService,
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
        this.userInfo = this.authService.getUserInfo();
        this.approveCashSecurityRelease();
        this.showCommentForm(true);
        this.clearControls();
        this.getUserRole();
        this.approvalStatusId = 0;
    }

    approveCashSecurityRelease() {
        this.creditAppraisalService.approveCashSecurityRelease().subscribe((response: any) => {
            this.approvalReleases = response.result;
        });

    }

    isOnAmconListChanged(event) {

    }

    clearControls() {
        this.perfectionForm = this.fb.group({
            perfectionStatusId: ['', Validators.required],
            litigationStatusId: ['', Validators.required],
            isOnAmconList: ['', Validators.required],
        });
    }

    loadDropDowns() {
        this.collateralService.getCollateralPerfectionStatus().subscribe((response: any) => {
            this.perfectionList = response.result;
        });
    }

    getUserRole() {

        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
        });
    }

    selectedRecordForActions: any;
    viewDocuments(row) {
        this.selectedRecordForActions = row;
        this.reloadDocsOnly = 1;
        this.operationId = row.operationId;
        this.targetId = row.cashSecurityReleaseIseId;
        this.approvalLevelId = row.currentApprovalLevelId,
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.getCollateralInformation(row.collateralId);
        this.RELOAD++;
        this.showUploadeddocument = true;
        this.rowSelected = true;
    }


    downloadDocument(d, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(d.documentUploadId).subscribe((response: any) => {
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
    
    showCommentForm(init = false) {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required]
        });
        if (init == false) this.displayCommentForm = true;
    }

    submitForApproval() {
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
                targetId: __this.targetId,
                operationId: __this.operationId,
                approvalStatusId: __this.approvalStatusId,
                approvalLevelId: __this.approvalLevelId,
                comment: __this.comment,
            }

            __this.goForApproval(data);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                this.showUploadeddocument = false;
            }
        });
    }

    goForApproval(data) {
        this.loadingService.show();
        this.creditAppraisalService.CashSecurityReleaseGoForApproval(data).subscribe((response: any) => {
            if (response.success == true) {
                this.loadingService.hide();
                this.displayApplicationStatusMessage(response.result);
                this.showUploadeddocument = false;
                this.refreshApprovalCommentAndStatus();
            }
            else { swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error'); }
            this.approveCashSecurityRelease();
            this.loadingService.hide();
        });
    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Transaction has been Successfully <strong>${response.statusName}</strong>`, 'success');
        else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    refreshApprovalCommentAndStatus() {
        this.approvalStatusId = 0;
        this.comment = "";
    }

    onTabChange($event) {
        this.activeTabindex = $event.index;
    }

    modalControl(event) {
        if (event == true) {
            this.displayCommentForm = false;
        }
    }

    referBackResultControl(event) {
        if (event == true) {
            this.approveCashSecurityRelease();
            this.displayCommentForm = false;
            this.showUploadeddocument = false;;
        }
    }

    customerId: any;
    customerCode: any;
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

                this.activeTabindex = 0;
            });
        this.hideGrid = true;
        return this.customerCollateral;
    }

    getSupportingDocuments(id) {
        this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
            this.supportingDocuments = response.result;
        });
    }

}

