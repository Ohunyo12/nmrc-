
import { saveAs } from 'file-saver';
import { Component, OnInit, ViewChild, Output } from '@angular/core';

import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { JobSource, GlobalConfig, LMSOperationEnum, CollateralType, CollateralGuaranteeSubType } from 'app/shared/constant/app.constant';
import { CustomerFinancialStatementComponent } from 'app/shared/components/customer-financial-statement/customer-financial-statement.component';
import { LoadingService } from 'app/shared/services/loading.service';
import { CountryStateService, CurrencyService, ChecklistService, CollateralService, LedgerService } from 'app/setup/services';
import { CreditAppraisalService, LoanApplicationService } from 'app/credit/services';
import { CasaService } from 'app/customer/services/casa.service';
@Component({
    selector: 'app-collateral-release-list',
    templateUrl: 'collateral-release-list.component.html',
    // styleUrls: ['./name.component.scss']
})
export class CollateralReleaseListComponent implements OnInit {
    show: boolean;
    cssClass: string;
    customerApplicationBureauList: any[];
    btnNullProperty: string;
    cancel: string;
    ok: string;
    width: string;
    message: string;
    applicationReferenceNumber: string; autoMapNew = true;
    collateralReleaseLists: any[];
    collateralReleaseDetails: any[];
    @Output() selectedRowRecord:any={};




    loanApplicationLists: any[]; loanApplicationReferance = 0; requestStatusId: number = 1;
    loanApplicationDetails: any[]; displayRequestForm: boolean = false; requestPageHeaderTitle: string;
    isRequestReassigned: boolean; isRequestAcknowledged: boolean; requestComment: string;
    checklistModel: any[] = []; loanApplicationId: number;
    checklistDetailData: any[]; displayCheckList: boolean = false; checklistStatusData: any[];
    cities: any[]; filterState: any[]; state: any[]; country: any[]; customerId: number;
    creditBureauForm: FormGroup; selectedCustomer: any = {};
    requestOperationsId: number = 2;
    bureauSearchTitle: string;

    applicationCustomerId: number;
    productId: number = 0;
    productClassProcessId: number = 0;
    loanApplicationDetailId: number = 0;
    collateralId: number;
    requirementItems: boolean = false;
    selectedCustomerId: number;

    displayCollateral: boolean = false;
    selectedChecklist: any;
    displayCheckListDetails: boolean = false;
    checkListStatusId: number;
    operationId: number = 2;
    deferedDate: string;
    checklistDeffered: boolean = false;
    checklistNotProvided: boolean = false;
    checklistItem: string;
    checkListDetailList: any[];
    filteredChecklistDefinition: any[];
    fileDocument: any;
    collateralValue: number;
    allowForEdit: boolean = false;
    title: string;
    loanApplicationAmount: number;
    requairedCollateralValue: number;
    securityValue: number;
    loanCurrency: string;
    checkListIndex: number = 0;
    selectedCustomerCode: string;
    @Output() selectedCustomerDetail:any={};



    displayRMSuggestions: boolean = false;
    loanInitiatorSuggestionForm: FormGroup;
    @ViewChild(CustomerFinancialStatementComponent, {static: false}) customerFinancials: CustomerFinancialStatementComponent;
    selectedApplicationDetail: any = {};
    constructor(private route: ActivatedRoute, private loadingService: LoadingService, private checklistService: ChecklistService,
        private countryService: CountryStateService, private fb: FormBuilder, private router: Router, private locationService: CountryStateService,
        private loanAppService: LoanApplicationService,
        private camService: CreditAppraisalService, private loanApplicationService: LoanApplicationService,
        private currencyService: CurrencyService,         private collateralService: CollateralService,
        private casaSrv: CasaService,
        private ledgerService: LedgerService,
    ) { }

    ngOnInit(): void {
        //console.log(this.route.snapshot.params);
        this.jobSourceId = JobSource.CollateralReleaseApproval;
        this.collateralId = +this.route.snapshot.params['collateralId'];
        //console.log(this.collateralId);
        this.collateralRecordList(this.collateralId);
        this.loadDropdowns();
    }
    collateralRecordList(id){
        this.loadingService.show();
        this.collateralReleaseLists = [];
        this.collateralService.getCollateralReleaseById(id).subscribe((data) => {
            this.collateralReleaseLists = data.result;
                this.collateralReleaseLists.forEach(element => {
                    this.collateralReleaseDetails = element;
                });
            //console.log('this.collateralReleaseDetails', this.collateralReleaseDetails);

            this.viewRecord(this.collateralReleaseDetails );
            this.loadingService.hide();
        }, (err) => {
            ////console.log('Error', err);
        });
    }

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
    collateralTypes: any[] = [];
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



    onRowSelect2(event) {
        this.disabledInputs();
        this.selectedRowRecord =  event.data;
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
            //.log('row',this.selectedRecord);
            this.selectedId = this.selectedRecord.collateralId;
            this.collateralId = this.selectedRecord.collateralId
            this.getReleaseSupportingDocumentsUploads(this.selectedRowRecord.collateralReleaseId);

            this.onCollateralTypeChange(this.selectedRecord.collateralTypeId);
            this.onSubTypeChange(this.selectedRecord.collateralSubTypeId);
            this.getSubFormItems(this.selectedRecord.collateralId, this.selectedRecord.collateralTypeId);
            // this.enableInsuranceFormTab = true;
           // console.log('collateralId @ edit...', this.selectedRecord.collateralId);

            //console.log('collateralTypeId @ edit...', this.selectedRecord.collateralTypeId);
            this.getVisitationDetail(this.selectedId)
            this.getCollateralVisitationStatus(this.selectedRecord.collateralTypeId)
            //this.getSupportingDocuments(this.selectedRowRecord.collateralId);

            this.collateralService.getCollateralReleasedDocument(this.selectedRecord.collateralId).subscribe((response: any) => {
                this.supportingDocuments = response.result;
            });
            this.collateralCode = this.selectedRecord.collateralCode;

  });
  //this.disableDocumentPanel = false;
  this.disableVisitationPanel = !this.requireVisitation;
        this.requirementItems = true;
    }


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
   // console.log('row',this.selectedRecord);
            this.selectedId = this.selectedRecord.collateralId;
            this.collateralId = this.selectedRecord.collateralId

            this.onCollateralTypeChange(this.selectedRecord.collateralTypeId);
            this.onSubTypeChange(this.selectedRecord.collateralSubTypeId);
            this.getSubFormItems(this.selectedRecord.collateralId, this.selectedRecord.collateralTypeId);
            // this.enableInsuranceFormTab = true;
           //console.log('collateralId @ edit...', this.selectedRecord.collateralId);

            //console.log('collateralTypeId @ edit...', this.selectedRecord.collateralTypeId);
            this.getVisitationDetail(this.selectedId)
            this.getCollateralVisitationStatus(this.selectedRecord.collateralTypeId)
            //this.getSupportingDocuments(this.selectedRowRecord.collateralId);
            this.getReleaseSupportingDocumentsUploads(this.selectedRowRecord.collateralReleaseId);

            this.collateralService.getCollateralReleasedDocument(this.selectedRecord.collateralId).subscribe((response: any) => {
                this.supportingDocuments = response.result;
            });
            this.collateralCode = this.selectedRecord.collateralCode;

  });
  //this.disableDocumentPanel = false;
  this.disableVisitationPanel = !this.requireVisitation;
        this.requirementItems = true;

}


viewCollateralInformation() {
    this.displayModalForm = true;

}

getRequestData(e){

}











    allowFinancialShow: boolean = false;
    loanApplications = {};
    customerName: string;

    onSubmitForCAM() {
        // this.router.navigate(['/credit/appraisal/credit-appraisal']);
        if (this.collateralId > 0) {
            this.loanAppService.UpdateloanApplication(this.collateralId)
                .subscribe((res) => {
                    if (res.success == true) {
                        if (res.result != null) {
                            this.checkListIndex = res.result.checkListIndex;

                            if (this.checkListIndex == 1) {
                                this.router.navigate(['/credit/appraisal/credit-appraisal']);
                            }
                            if (this.checkListIndex == 2) {
                                swal(`${GlobalConfig.APPLICATION_NAME}`, res.result.messageStr, 'error');
                                return
                            }
                            if (this.checkListIndex == 3) {
                                const __this = this;
                                swal({
                                    title: 'Loan Checklist Requirement',
                                    text: res.result.messageStr + '\n' + 'This application will require that you raise CAM. Do you want to continue ',
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
                                    ////console.log(this.applicationId);

                                    const body = {
                                        applicationId: __this.collateralId,
                                        checkListIndex: res.result.checkListIndex
                                    }

                                    ////console.log("Some Body", body);

                                    // let body = { loanCollateralMappingId: id }
                                    __this.loanAppService.UpdateloanApplicationForCAM(body).subscribe((res) => {
                                        if (res.success === true) {
                                            //  swal(GlobalConfig.APPLICATION_NAME, 'Release successful but subject to approval.', 'success');
                                            //  __this.getCustomerCollateral(__this.selectedCustomerId);
                                            __this.router.navigate(['/credit/appraisal/credit-appraisal']);
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
                        }
                    } else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                });
        }
    }
    returnToStart() {
        this.router.navigate(['/credit/collateral/collateral-release-awaiting-job-request']);
    }
    CallRequestClose() {
        this.displayRequestForm = false;

    }


    applicationDetail: FormGroup

    colCurrencyId: number;
    colCurrencyCode: string;
    totalSecurity: number;

    closeCollateral() {
        this.displayCollateral = false;
    }


    requireCollateral: boolean;
    productClassId: number;
 

    showRequestForm() {
        this.displayRequestForm = true;
    }


    displayDocument: boolean = false;

    row = {}
    viewSupportingDocument(id: number) {
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


    // file upload
    displayDocumentUpload: boolean = false;
    displayUpload: boolean = false;
    displayUploadOtherDocument: boolean = false;
    loanDocumentUploadList: any[] = [];
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
        if (this.file != undefined || this.uploadFileTitle != null) {
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
                ////console.log("error", error);
            });
        }
    }
    getReleaseSupportingDocumentsUploads(releaseId: any) {
        ////console.log("AppNo:>>>>>>",applicationNumber);
        this.loadingService.show();
        this.collateralService.getSupportingDocumentByRelease(releaseId).subscribe((response: any) => {
            this.loanDocumentUploadList = response.result;
            this.loadingService.hide();
        });
    }

    allowFeeConcessionForEdit: boolean;
    loanDetailId: number;




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
        getCollateralVisitationStatus(id) {
            if (this.collateralTypes != null) {
                this.requireVisitation = this.collateralTypes.find(x => x.collateralTypeId == id).requireVisitation;
                this.requireInsurancePolicy = this.collateralTypes.find(x => x.collateralTypeId == id).requireInsurancePolicy;
            }
        }
    
        getVisitationDetail(CollateralId) {
    
            //loan-visitation/{collateralVisitationId}
            this.collateralService.getCollateralVisitationDetail(CollateralId).subscribe((response: any) => {
                this.visitationDetail = response.result;
    
                ////console.log('Visitation documents..',  this.visitationDetail);
            });
        }
        subItems: any = {};
        getSupportingDocuments(collateralId) {
           // console.log('collateralId..', collateralId);
    
            this.collateralService.getCollateralDocument(collateralId).subscribe((response: any) => {
                this.supportingDocuments = response.result;
            });
        }
    
        getSubFormItems(collateralId, typeId): void {
            this.loadingService.show();
            this.collateralService.GetCollateralDetailsByCollateral(collateralId, typeId).subscribe((response: any) => {
                this.subItems = response.result;
                //this.supportingDocuments = response.FileData;
                //console.log('sub items...', response);
    
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });
        }
        
    
        
        onSubTypeChange(id) {
            ////console.log('id',id);
    
            this.enabledJoinCollaterGuarantee = false;
    
            this.collateralService.getCollateralSubTypesById(id).subscribe((response: any) => {
                this.collateralSubType = response.result;
    
                ////console.log(' this.collateralSubType', this.collateralSubType);
    
    
                this.haircut = this.collateralSubType.haircut;
                ////console.log('LIST >>>',  this.collateralSubType)
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
                ////console.log('ACCOUNT NUMBER : ',accountNo);
        
                this.collateralService.getLienAmountForFD(accountNo).subscribe((response: any) => {
        
                    // let lien = response.result;
                    let securityVa = this.subItems.securityValue;
                    let securityValue = this.convertToNumber(securityVa);
                    ////console.log('response.data.lienAmount : ',response.data);
                    if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
        
                    this.subItems.lienAmount = this.lienAmount;
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
                ////console.log('ACCOUNT NUMBER : ',accountNo);
        
                this.collateralService.getLienAmountForCASA(accountNo).subscribe((response: any) => {
        
                    //let lien = response.result;
                    let securityVa = this.subItems.securityValue;
                    let securityValue = this.convertToNumber(securityVa);
                    ////console.log('response.data.lienAmount : ',response.data);
                    if (response.data != null) { this.lienAmount = response.data.lienAmount; } else { this.lienAmount = 0; }
                    this.subItems.lienAmount = this.lienAmount;
                    ////console.log('securityVa',securityVa);
        
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
                       // console.log('response.result',response.result);
                        
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
                    ////console.log('list: ',response.result);
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
        countries: any[];
        frequencyTypes: any[];
        valuers: any[];
        valueBaseTypes: any[];
        accountTypes: any[];
        populateValueBaseType(collateralType) {
    
            this.collateralService.getValueBaseTypes(collateralType).subscribe((response: any) => {
                this.valueBaseTypes = response.result;
                ////console.log('response >>',response);
            });
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
            this.collateralService.getCollateralTypeByApplication(null).subscribe((response: any) => {
                this.collateralTypes = response.result;
    
            });
            this.collateralService.getCollateralPerfectionStatus().subscribe((response: any) => {
                this.CollateralPerfectionList = response.result;
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
    
            // const upLoadControl = this.CollateralPrimaryDocumentForm.get('documentTypeId');
            // upLoadControl.setValidators(Validators.required);
            // upLoadControl.updateValueAndValidity();
    
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
                    // const upLoadControl = this.CollateralPrimaryDocumentForm.get('documentTypeId');
                    // upLoadControl.clearValidators();
                    // upLoadControl.updateValueAndValidity();
    
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
    
            };
        }

        showAddNewUpload() {
            this.displayDocumentUpload = true;
        }
        submitForm() {
            //let body = this.getBody();
            ////console.log("body >>> " ,body );
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
                this.collateralService.sendtoApprovalCollateralRelease(body).subscribe((val: any) => {
    
                    const success = val.success;
                    ////console.log('success',success);
    
                    if (success === true) {
    
                        //this.getReleaseRecord();
                        this.closeForm();

                       this.loadingService.hide();
                       this.router.navigate(['/credit/collateral/collateral-release-awaiting-job-request']);
                        swal('FinTrak Credit 360', "Collateral Release Sent For Approval", 'success');
    
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
    
    
        // file upload

        supportingDocuments: any[] = [];
    
        //visitation detail
        lastVisitation: string = null;
        visitationRemark: string = null;
        lastVisitaionDate: Date;
        collateralCustomerId: any;
        visitationDocument: any;
    
}