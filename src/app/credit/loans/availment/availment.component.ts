import { saveAs } from 'file-saver';
import { LoanApplicationDetailsViewComponent } from '../loan-application-details-view/loan-application-details-view.component';
import { CustomerInformationDetailComponent } from '../../../customer/components';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanService, CreditApprovalService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../services';
import { CreditAppraisalService } from '../../services';
import { GuarantorAppModel } from '../../models/loan-guarantor';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { GlobalConfig, LoanApplicationStatus, ApprovalStatus, ProductProcessEnum, AvailmentApprovalLevel, JobSource, ProductTypeEnum } from '../../../shared/constant/app.constant';
import { ReportService } from '../../../reports/service/report.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { GeneralSetupService } from '../../../setup/services/general-setup.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { LoanCollateralModel } from '../../models/loan-collateral';
import { CollateralInformationViewComponent } from '../../collateral';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { StaffRoleService } from 'app/setup/services';
import { IAppraisal } from "app/shared/models/appraisal.model";
import { IAppraisalSub } from "app/shared/models/appraisal.model";
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';

enum JobAllocationStatusEnum {
    RoundRobin = 1,
    SBUROUTING = 2,
    POOL = 3
}

@Component({
    styles: [`
        .btn-move {
            margin-right: 5px;
        }
        .removeConditions_OL {
            display: none;
        }
        .conditionsTable_OL {
            width: 100%; overflow-x:auto;
        }
        @media screen 
        {
            #print-section {display: none;}
        }
        
        @media print 
        {
            #print-section {display: block; margin-top: 0px;}
        }
    `],
    templateUrl: 'availment.component.html'
})

export class LoanAvailmentComponent implements OnInit {
    workflowTargets: WorkflowTarget[] = [];
    //workflowTarget: WorkflowTarget = new WorkflowTarget();

    isPoolRequest: boolean;
    isSBURouting: boolean;
    isRounRobin: boolean;
    isUserCreditAmin: boolean = false;
    assignedApplications: any[] = [];

    loanApprovalData: any[] = [];
    LoancrmsModal: boolean = false;
    crmsLoanTypeForm: FormGroup;
    selectedLoanRecord: any = null;
    allCrmsCollateralTypes: any[];
    crmsCollateralTypes: any[];
    securedByCollateral: boolean = false;
    crmsCollateralTypeId: any = null;
    crmsRepaymentTypeId: any = null;
    moratoriumPeriod: any = null;
    insurancepolicyRecord: any;
    isSpecialised: boolean = false;
    showCollateralInformation: boolean;
    show: boolean;
    cssClass: string;
    title: string;
    message: string;
    canStopProcess: boolean;
    requestOperationsId: number;
    collateralDataList: any;
    productTypeId: any;
    OLApplicationReferenceNumber: any;
    facilityList: any;
    totalExposureLimit: any;
    jobSourceId: number;
    reportSource: SafeResourceUrl;
    selectedId: number = null;
    OPERATION_ID: number;
    OPERATION_IDs: number[];
    drawdownHtml: any;
    operationId: any;
    targetId: any;
    rowSelected: boolean = false;
    isUserLegal: boolean = false;

    applicationDetailId(): any {
        throw new Error("Method not implemented.");
    }
    loanSelection: any;
    displayLoanCollateral: any;
    isCovenantDisabled: boolean;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    displaySearchModal: boolean;
    collateralTypes: any;
    applicableCollaterals: any;
    collateralForm: any;
    displayCollateralForm: boolean;
    displayApplicableCollateral1: boolean = true;
    displayApplicableCollateral2: boolean = false;
    applicationSelection: any;
    displayTestReport: boolean;
    displayReport: boolean;
    displayGeneratedLetter: boolean;
    isFinalOfferLetter: any;
    disableApprovalBtn: boolean;
    approvedApplicationDetails: any[];
    proposedApplicationDetails: any[];
    customerId: any;
    loanApplicationDetailId: any;
    selectedCollateral: any[] = [];
    totalCollateralAmount: number = 0;

    camApprovedLoans: any[] = []; camDocuments: any = []; creditAnalystDocument: any = {};
    selectedRecord: any = {}; rmCamDocument: any = {};
    displayOfferLetter = false;
    displayLoanDetails = false; isCAMBased: boolean;
    fetchingAvailmentUtilizationTicket: boolean = false;
    getAvailmentUtilizationTicketData: any;

    collateralTypeId: any;
    collateralCustomerId: any;
    displayCollateralDetails = false;

    approvalObj: any = {};

    reportSrc: SafeResourceUrl;
    form3800bSrc: any = {};
    proposedLabel: string;
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', { static: false }) fileInput: any;
    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;

    activeIndex = 0;
    readonly CREDITAPPRIASALDOC: string = "CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string = "DRAWDOWN DOCUMENTS";
    finalApprovalLevel = false; displayApprovalModal = false; firstApprovalLevel = false;
    middleApprovalLevel = false;

    approvalStatusData: any[] = []; printDocument: any;

    approvalStatusId: number;
    crmComment: string;
    hasCreditAdminConfirmedPolicy: boolean = false;
    doesInsurancePolicyExist: boolean = false;

    selectedproductTypeId: any;
    allGaurantors: any;
    selectedApplicationReferenceNumber: any;
    isGaurantor1: boolean = true; isGaurantor2: boolean = false;
    dynamicGaurantorNameLabel: string;
    isCorporateGaurantor: boolean;
    guarantorForm: any;
    displayGuarantorsForm = false;
    guarantorCollection: GuarantorAppModel[] = [];
    collateralCollection: LoanCollateralModel[] = [];
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    gaurantorTypeSelected: boolean;
    showAvailmentChecklist: boolean = true;
    showCAMChecklist = false;
    // loanApplOperationId = 38;
    loanApplOperationId = 0;
    loanApplDetailId = 0;
    loanApplId = 0;
    commentAvailment: any;
    reload: number = 0;
    readonly appraisalComments: string = "APPRAISAL COMMENTS"
    readonly availmentComments: string = "DRAWDOWN COMMENTS"
    displayJobrequest = false;
    productClassProcessId: number = 0;
    loanInfoIndex = 0;
    productId: number = 0;
    officers: any;
    companyId: number;

    groupLimit: any = {}; rMLimit: any = {};
    nPLLimit: any = {}; customerLimit: any = {}; segmentLimit: any = {}; sectorLimit: any = {}; branchLimit: any = {};
    lgroupLimit: any; lrMLimit: any; lnPLLimit: any; lcustomerLimit: any;
    lsegmentLimit: any; lsectorLimit: any; lbranchLimit: any; ogroupLimit: any; orMLimit: any;
    onPLLimit: any; ocustomerLimit: any; osegmentLimit: any; osectorLimit: any; obranchLimit: any;
    selectedApplication: any = {}; displayRunningLoans = false; existingLoans: any[]; runningLoans: any[];
    loanApplicationDetail: any = {};

    collateralStampToCoverValues: any = [];
    allAreLiensPLaced = false;

    userisAnalyst: boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    staffRoleRecord: any;
    cashBackHtml: any;

    // Obligor Checklist
    uwsList: any[] = [];
    isPreviewModalVisible: boolean = false;
    selectedDocumentUrl: SafeResourceUrl | null = null;
    fileType: string = '';
    zoomLevel: number = 1;
    dragging: boolean = false;
    startX: number = 0;
    startY: number = 0;
    imageList: string[] = [];
    currentImageIndex: number = 0;
    maxZoom: number = 3;
    minZoom: number = 1;
    selectedLoan: IAppraisal | null = null;

    // checklist dashboard
    // Checklist summary properties for selected individual loan
    checklistSummary: {
        total: number;
        yes: number;
        no: number;
        waived: number;
        deferred: number;
        yesPercent: number;
        noPercent: number;
        waivedPercent: number;
        deferredPercent: number;
    } = {
            total: 0,
            yes: 0,
            no: 0,
            waived: 0,
            deferred: 0,
            yesPercent: 0,
            noPercent: 0,
            waivedPercent: 0,
            deferredPercent: 0
        };
    isLoadingChecklistSummary: boolean = false;


    //     { collateralCode: "12345", collateralTypeName: 'name 1', stampToCover: '2345678909876'},
    //     { collateralCode: "123245", collateralTypeName: 'name 123', stampToCover: '2345678909876'},
    // ];

    @ViewChild(CollateralInformationViewComponent, { static: false }) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(CustomerInformationDetailComponent, { static: false }) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(LoanApplicationDetailsViewComponent, { static: false }) loanInfo: LoanApplicationDetailsViewComponent;
    // @ViewChild(LoanChecklistComponent) loanCheckList: LoanChecklistComponent;

    constructor(
        private _loadingService: LoadingService,
        private _fb: FormBuilder,
        private _loanApplServ: LoanApplicationService,
        private _creditApprServ: CreditAppraisalService,
        private _genSetupService: GeneralSetupService,
        private _loanServ: LoanService,
        private _customerService: CustomerService,
        private loanBookingService: LoanService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
        private creditApprovalService: CreditApprovalService,
        private loadingService: LoadingService,
        //private camService: CreditAppraisalService,
        private staffRole: StaffRoleService,
        private underwritingService: UnifiedUnderwritingStandardService
    ) {

        this.loanBookingService.searchForCustomer(this.searchTerm$)
            .subscribe(results => {
                this.searchResults = results.result;
                ////console.log('collateral search result 1 ', this.searchResults);
            });

    }

    ngOnInit() {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        // this.getApprovedLoanApplicationsDueForAvailment();
        this.getInitiatedLoansAwaitingApproval();
        this.getCRMSRepaymentType();

        this.getAllApprovalStatus();

        this.resetCollateralForm();
        this._loanApplServ.getOfficers().subscribe((res) => { console.log(res); this.companyId = res.result[0].companyId; });


        //this.getCollateralTypes();
        //this.clearControls();
        this.resetGuarantorForm();
        this.showCommentForm(true);
        this.getUserRole();

    }

    getCashBackMemoHtml(operationId, targetId) {
        this._creditApprServ.getCashBackMemoHtml(operationId, targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.cashBackHtml = response.result;
        }, () => {

        });
    }

    ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.staffRoleRecord = res.result;
            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
            }
            if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
                this.userIsRelationshipManager = true;
            }

            if (this.staffRoleRecord.staffRoleShortCode == 'LEGAL') {
                this.isUserLegal = true;
            }
            else {
                this.isUserLegal = false;
            }
            if (this.staffRoleRecord.staffRoleShortCode == 'CREDIT ADMIN') {
                this.isUserCreditAmin = true;
            }
            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.SBUROUTING) { this.isSBURouting = true; }

            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.RoundRobin) { this.isRounRobin = true; }

            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.POOL) { this.isPoolRequest = true; }

        });

    }


    validateInsurancePolicy(insurancepolicyRecord) {
        // if (insurancepolicyRecord != null && insurancepolicyRecord != undefined && insurancepolicyRecord.isPolicyInformationConfirmed == true) {
        //     this.hasCreditAdminConfirmedPolicy = true;
        //     this.doesInsurancePolicyExist = true;
        // }
        // if (insurancepolicyRecord == null) {
        //     this.hasCreditAdminConfirmedPolicy = false;
        //     this.doesInsurancePolicyExist = false;
        // }
        // if (insurancepolicyRecord != null && insurancepolicyRecord != undefined && insurancepolicyRecord.isPolicyInformationConfirmed == false) {
        //     this.hasCreditAdminConfirmedPolicy = false;
        //     this.doesInsurancePolicyExist = true;
        // }
    }

    printMemo(): void {
        let printTitle = 'DRAWDOWN MEMO';
        let printContents, popupWin;
        printContents = document.getElementById('print-drawdown-section').innerHTML;
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

    getInitiatedLoansAwaitingApproval() {
        this._loadingService.show();
        this._loanServ.getInitiatedLoansAwaitingApproval().subscribe((response: any) => {
            this.loanApprovalData = response.result;
            if (this.isPoolRequest == true) {
                this.assignedApplications = this.loanApprovalData.filter(x => x.toStaffId != null);
                if (this.assignedApplications != null && this.assignedApplications != undefined) this.assignedApplications.slice;

                // COMMENT IF YOU NEED TO SHOW ASSIGNED JOBS ON GENERAL POOL
                this.loanApprovalData = this.loanApprovalData.filter(x => x.toStaffId == null);
            }

            if (this.isPoolRequest == false || this.isPoolRequest == null) {
                this.assignedApplications = this.loanApprovalData;
                this.assignedApplications.slice;
            }
            this.loanApprovalData.slice;
            this._loadingService.hide();
        }, () => {
            ////console.log('error', err);
            this._loadingService.hide();
        });
    }

    onTabChange(obj) {

    }
    crmsRepaymentAgreementType: any;

    getCRMSRepaymentType(): void {
        this.loanBookingService.getCRMSRepaymentAgreementType().subscribe((response: any) => {
            this.crmsRepaymentAgreementType = response.result;
        });
    }

    getRegulatoryRepaymentTypeName(id) {
        let model = this.crmsRepaymentAgreementType.find(x => x.lookupId == id);
        return (model == null) ? null : model.lookupName;
    }

    getApprovedLoanApplicationsDueForAvailment() {
        this._loadingService.show();
        this._creditApprServ.getApplicationsDueForAvailment().subscribe((response: any) => {
            this.camApprovedLoans = response.result;
            this._loadingService.hide();
        }, () => {
            ////console.log('error', err);
            this._loadingService.hide();
        });
    }

    // getLoanGaurantors(applicationDetailId) {
    //     this._loanServ.getLoanGaurantors(applicationDetailId).subscribe((response: any) => {
    //         this.allGaurantors = response.result;
    //     }, (err) => {
    //         ////console.log('error', err);
    //         this._loadingService.hide();
    //     });
    // }
    // getLoanDetail(id): void {
    //     this._loadingService.show();
    //     this._creditApprServ.getLoanDetail(id).subscribe((response: any) => {
    //         this.proposedApplicationDetails = response.result.facilities;
    //         this.approvedApplicationDetails = this.proposedApplicationDetails.filter(x => x.statusId == ApprovalStatus.APPROVED);
    //         this.loanApplicationDetail = response.result.application;
    //         ////console.log("this.proposedApplicationDetails",this.proposedApplicationDetails);
    //         this._loadingService.hide();
    //     }, (err) => {
    //         this._loadingService.hide(1000);
    //     });
    // }


    getTrancheDetail(id): void {
        this._loadingService.show();
        this._creditApprServ.getTrancheDetail(id).subscribe((response: any) => {
            this.proposedApplicationDetails = response.result.facilities;
            this.approvedApplicationDetails = this.proposedApplicationDetails.filter(x => x.statusId == ApprovalStatus.APPROVED);
            this._loadingService.hide();
        }, () => {
            this._loadingService.hide(1000);
        });
    }

    resetCollateralForm() {
        this.collateralForm = this._fb.group({
            customerId: ['', Validators.required],
            customerName: ['', Validators.required],
            customerTypeId: [''],
            collateralTypeId: [''],

        });
    }

    onCollateralTypeChange(event) {
        this.loanBookingService.getCustomerApplicableCollaterals(event, this.selectedRecord.customerId, 0).subscribe((response: any) => {
            this.applicableCollaterals = response.result;
        });
    }

    getCollateralTypes(): void {
        this.loanBookingService.getCollateralTypes().subscribe((response: any) => {
            this.collateralTypes = response.result;
        });
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanBookingService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, () => { });
    }

    openSearchBox(): void {
        if (this.collateralForm.value['collateralTypeId'] === null
            || this.collateralForm.value['collateralTypeId'] === '') {
            swal('', 'Please enter collateral Type first', 'info');
        } else { this.displaySearchModal = true; };
    }


    searchDB(searchString) {
        this.searchTerm$.next(searchString);
    }

    pickSearchedData(item) {
        ////console.log('search item picked', item);
        this._loadingService.show();
        this.loanBookingService.getCustomerApplicableCollaterals(
            this.collateralForm.value['collateralTypeId'],
            this.selectedRecord.customerId, item.customerId).subscribe((response: any) => {
                this.applicableCollaterals = response.result;
                this._loadingService.hide();
            });
        this.applicableCollaterals = item.CustomerCollateral;
        ////console.log('picked collateral item record ', this.applicableCollaterals);
        //this.selectedCustomer = item;

        this.displaySearchModal = false;
    }

    onSelectedCollateralChange(id) {
        this.selectedCollateral = this.applicableCollaterals.filter(x => x.collateralId == id.data.collateralId);
        let collateralAmount = 0;
        if (this.selectedCollateral[0].collateralValue == null) {
            swal('', 'The selected collateral has no value', 'info')
        } else {
            let haircut = this.selectedCollateral[0].haircut
            let hairbalance = 100 - haircut;
            let collateralbalance = (this.selectedCollateral[0].collateralValue * hairbalance) / 100

            collateralbalance == 0
                ? swal('', 'The selected collateral has  zero value', 'info')
                : collateralAmount = collateralbalance;

            if (collateralAmount > 0) {
                if (!this.collateralCollection.some(a => a == this.selectedCollateral[0])) {
                    this.totalCollateralAmount = this.totalCollateralAmount + collateralAmount;
                    this.collateralCollection.push(this.selectedCollateral[0]);
                    this.displayCollateralForm = false;
                } else { swal('This record is already selected'); }
            }

            if (this.totalCollateralAmount >= (this.selectedRecord.approvedAmount)) {
                this.isCovenantDisabled = false;
            } else {
                this.isCovenantDisabled = true;
                swal('', 'The total collateral value is less than the loan amount.\n Please add more collaterals');
            }
        }
    }


    deleteSelectedCollateralItem(index) {
        if (index !== -1) {
            this.collateralCollection.splice(index, 1);
        }
    }

    toggleCollateralDisplay() {
        if (this.displayLoanCollateral) {
            this.displayLoanCollateral = false;
            this.displayApplicableCollateral2 = true;
        } else {
            this.displayLoanCollateral = true;
            this.displayApplicableCollateral2 = false;
        }
    }

    getAllApprovalStatus(): void {
        this._genSetupService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
            ////console.log('this.approvalStatusData', this.approvalStatusData);
        });
    }

    resetGuarantorForm() {
        this.guarantorForm = this._fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            middlename: [''],
            taxNumber: ['', Validators.required],
            rcNumber: ['', Validators.required],
            gaurantorType: [''],
            phoneNumber1: ['', Validators.compose([ValidationService.isNumber, Validators.required, Validators.length[11]])],
            phoneNumber2: ['', Validators.compose([ValidationService.isNumber, Validators.length[11]])],
            relationship: ['', Validators.required],
            relationshipDuration: ['', Validators.compose([ValidationService.isNumber, Validators.required, Validators.maxLength[3], Validators.minLength[1]])],
            emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            address: [''],
            docDescription: [''],
            bvn: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
        });
    }
    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanApplId);
        this.displayShowCustInfo = false;
    }

    showLoanInformation() {
        if (this.loanInfo != undefined) {
            this.loanInfo.isRecommendedInfo = true;
            this.loanInfo.loanApplicationDetail = this.selectedRecord;
            this.loanInfo.getLoanDetail(this.loanApplId);
        }
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }
    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }
    stopAvailmentProcess() {
        this.canStopProcess = true;
        swal('Timed Out', 'Sorry! IDF application has reach the maximum availment time (72hrs) allowed.', 'warning');
    }

    viewApplicationDetails(rowData, evt) {
        evt.preventDefault();
        this.reload++;
        this.applicationSelection = rowData;
        this.getTrancheDetail(this.applicationSelection.loanBookingRequestId);
        this.customerId = rowData.customerId;
        this.getCollateralStampToCoverValues();
        this.getTotalExposureLimit(rowData);
        this.loanApplicationDetailId = rowData.loanApplicationDetailId;

        this.getDrawdownMemoHtml(rowData.loanBookingRequestId);
        this.getCashBackMemoHtml(this.applicationSelection.operationId, this.applicationSelection.loanApplicationDetailId);
        this.OLApplicationReferenceNumber = rowData.applicationReferenceNumber

        // Log the entire applicationSelection object to check for nhfNumber
        console.log('Selected Application Data:', this.applicationSelection);

        // Specifically check for nhfNumber or employeeNhfNumber
        console.log('nhfNumber:', this.applicationSelection.nhfNumber);
        console.log('employeeNhfNumber:', this.applicationSelection.applicationReferenceNumber);

        if (!rowData.approvalDate == null) {
            let approvalDate = new Date(rowData.approvalDate);
            let todayDate = new Date();
            var diff = Math.abs(todayDate.getTime() - approvalDate.getTime()) / 3600000;
            if (diff >= 72 && rowData.productClassName.toLowerCase() == 'invoice discounting') { this.stopAvailmentProcess(); return; }
        }

        this.getAllCRMSCollateralType();
        this.selectedRecord = rowData;


        this.updateWorkflowTarget();
        this.collateralDataList = this.selectedRecord.loanApplicationCollateral;
        this.productId = this.selectedRecord.productId;
        const target = rowData;
        this._loadingService.show();
        this.displayShowCustInfo = true;

        //this.referBack();
        this._loanApplServ.getLoanApplicationDetailsByApplicationId(this.selectedRecord.loanApplicationId)
            .subscribe((response: any) => {
                this.facilityList = response.result;
                ////console.log('facilityList', this.facilityList);
            }, () => {
                this._loadingService.hide();
            });

        this._loanApplServ.getLoanApplicationDetails(this.selectedRecord.loanApplicationDetailId)
            .subscribe((response: any) => {
                let tempDet = response.result;
                this.loanSelection = tempDet;
                //console.log(' this.loanSelection', this.loanSelection);
            }, () => {
                this._loadingService.hide();
                // swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                //  ////console.log('error', err);
            });

        //this._loanApplServ.getFinalOfferLetterByApplRefNumber(target.applicationReferenceNumber)
        this._loanApplServ.getFinalOfferLetterByLoanAppId(this.selectedRecord.loanApplicationId)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                ////console.log('response.result  >>> ',response.result)
                this.form3800bSrc = tempSrc;
            }, () => {
                this._loadingService.hide();
                // swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                ////console.log('error', err);
            });

        this._loanApplServ.getCommentOnLoanAvailment(target.applicationReferenceNumber).subscribe((response: any) => {
            this.commentAvailment = response.result;
        }, () => {
            this._loadingService.hide();
            ////console.log('error', err);
        });

        if (target.camDocuments != null) {
            target.camDocuments.map(element => {
                this.camDocuments.push(element);
            });
        }

        if (target.productClassProcessId == ProductProcessEnum.CAMBased) {
            this.isCAMBased = true;
        } else {
            this.isCAMBased = false;
        }

        this.productClassProcessId = target.productClassProcessId != null ? target.productClassProcessId : ProductProcessEnum.CAMBased;
        ////console.log('Commercial Loan',  this.productClassProcessId);

        if (this.camDocuments.length > 2) {
            const docLength = this.camDocuments.length;
            ////console.log('cap doc', this.camDocuments[docLength - 1]);
            this.creditAnalystDocument = this.camDocuments[docLength - 1];
            this.rmCamDocument = this.camDocuments[docLength - 2];
        }

        ////console.log('analyst document', this.creditAnalystDocument);


        // this._creditApprServ.updateApplicationStatus(target.applicationReferenceNumber,
        //     LoanApplicationStatus.AvailmentInProgress, target).subscribe((res) => {
        //         if (res.success === true) {
        //             this._loadingService.hide(10000);
        //             this.displayLoanDetails = true;
        //         }
        //     }, (err) => {
        //         this._loadingService.hide();
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        //         ////console.log('error', err);
        //     });
        this.displayLoanDetails = true;

        this.selectedApplicationReferenceNumber = target.applicationReferenceNumber;
        this.selectedproductTypeId = target.productTypeId;

        this.getSupportingDocuments(target.applicationReferenceNumber);
        //this.getLoanGaurantors(target.loanApplicationId);
        if (target.approvalLevelId != null) { // FOR WHEN ITS NOT THE FIRSTLEVEL
            ////console.log('current approvalLevel', target.approvalLevelId)
            this.checkForFinalApproval(target.approvalLevelId);
        }

        this.productTypeId = target.productTypeId;
        this.loanApplId = target.loanApplicationId;
        this.loanApplDetailId = target.loanApplicationId;

        this.loanApplOperationId = target.operationId;
        this.requestOperationsId = target.operationId;
        this.showAvailmentChecklist = true;
        this.showCAMChecklist = false;

        this.operationId = target.operationId;
        //this.targetId = target.loanApplicationId;
        this.targetId = target.loanBookingRequestId;
        this.rowSelected = true;
        //this.getApprovalTrail();

        // this.getLoanGaurantors(this.loanApplDetailId);
        this.getBankLimit(target.branchId, target.customerGroupId);
        this.getRmLimit(target);
        this.GetcustomerLimitAndRating(target.customerId);
        this.getSegmentLimit(target);
        this.getSectorLimit(target);
        this.getBranchLimit(target.branchId);
        this.showLoanInformation();
        this.getAllCRMSCollateralType();
        //this.form3800b(this.selectedApplicationReferenceNumber);

        // close spinner

        // Fetch UUS checklist for the selected loan's reference number
        if (this.applicationSelection.applicationReferenceNumber) {
            this.fetchCustomerUusItems(this.applicationSelection.applicationReferenceNumber);
        }

        this.fetchChecklistSummaryForLoan(this.applicationSelection.applicationReferenceNumber);
    }


    // =========================== Fetch Obligor's Items ===============================

    getRowStyle(rowData: any): any {
        if (rowData.option === 'Yes') {
            return { 'background-color': '#28a745', 'color': '#fff' }; // Deep green
        } else if (rowData.option === 'No') {
            return { 'background-color': '#dc3545', 'color': '#fff' }; // Deep red
        } else {
            return {};
        }
    }

    fetchCustomerUusItems(nhfNumber: string): void {
        console.error('nhf number:', nhfNumber);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
            response => {
                this.uwsList = (response.result || []).map(uws => ({
                    ...uws,
                    option: this.mapOptionToEnum(uws.finalOption),
                    deferredDate: uws.deferDate ? new Date(uws.deferDate).toISOString().split('T')[0] : null
                }));
                console.log('Processed UUS List:', this.uwsList);
                //this.cdr.detectChanges();
            },
            error => {
                console.error('Error fetching UWS list:', error);
                this.uwsList = [];
                this.loadingService.hide();
            },
            () => this.loadingService.hide()
        );
    }

    mapOptionToEnum(option: number): string {
        const mapping: { [key: number]: string } = {
            1: 'Yes',
            2: 'No',
            3: 'Waiver',
            4: 'Deferred'
        };
        return mapping[option] || 'No';
    }

    viewDocuments(uws: any): void {
        console.log('Selected UWS:', uws);
        if (!uws.employeeNhfNumber) {
            swal('Error', 'No Employee NHF Number found!', 'error');
            return;
        }
        if (!uws.itemId) {
            swal('Error', 'No Item Found!', 'error');
            return;
        }
        console.log('Fetching document for:', uws.employeeNhfNumber, uws.checklistId);
        this.fetchAndPreviewDocument(uws.employeeNhfNumber, uws.checklistId);
    }

    private fetchAndPreviewDocument(employeeNumber: string, itemId: number): void {
        console.log('Calling API with:', employeeNumber, itemId);
        this.loadingService.show();
        this.underwritingService.getCustomerUusItemDoc(employeeNumber, itemId).subscribe({
            next: (response) => {
                console.log('API Response:', response);
                if (!response.success || !response.result) {
                    console.error('Invalid document data received');
                    swal('Error', 'Invalid document data received.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const base64Data = response.result.split(',')[1];
                const fileTypeMatch = response.result.match(/data:(.*?);base64/);
                if (!base64Data || !fileTypeMatch) {
                    console.error('Invalid Base64 format');
                    swal('Error', 'Invalid document format.', 'error');
                    this.loadingService.hide();
                    return;
                }
                const fileType = fileTypeMatch[1];
                console.log('Detected file type:', fileType);
                const blob = this.base64ToBlob(base64Data, fileType);
                const url = URL.createObjectURL(blob);
                console.log('Generated Blob URL:', url);
                if (fileType.includes('image') || fileType === 'application/pdf' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.w ordprocessingml.document' ||
                    fileType === 'application/msword') {
                    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    this.fileType = fileType;
                    this.isPreviewModalVisible = true;
                } else {
                    swal('Error', 'Unsupported file type.', 'error');
                }
                this.loadingService.hide();
            },
            error: (error) => {
                console.error('Error fetching document:', error);
                swal('Error', 'Error fetching document.', 'error');
                this.loadingService.hide();
            }
        });
    }

    private base64ToBlob(base64: string, contentType: string): Blob {
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, { type: contentType });
    }

    getModalStyle() {
        if (this.fileType === 'application/pdf' || this.fileType === 'application/msword' ||
            this.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return { width: '70%', height: '75vh' };
        } else {
            return { width: '55%', height: '70vh' };
        }
    }

    zoomIn() {
        this.zoomLevel += 0.2;
    }

    zoomOut() {
        if (this.zoomLevel > 0.5) this.zoomLevel -= 0.2;
    }

    onScrollZoom(event: WheelEvent) {
        event.preventDefault();
        const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
        this.zoomLevel = Math.max(0.5, this.zoomLevel + zoomFactor);
    }

    startDrag(event: MouseEvent) {
        event.preventDefault();
        this.dragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    onDrag = (event: MouseEvent) => {
        if (!this.dragging) return;
        const dragSpeed = 2;
        const deltaX = (event.clientX - this.startX) * dragSpeed;
        const deltaY = (event.clientY - this.startY) * dragSpeed;
        const imageElement = document.querySelector('img') as HTMLElement;
        if (imageElement) {
            imageElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${this.zoomLevel})`;
        }
    };

    toggleZoom() {
        if (this.zoomLevel >= this.maxZoom) {
            this.zoomLevel = this.minZoom;
        } else {
            this.zoomLevel += 0.5;
        }
    }

    stopDrag = () => {
        this.dragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    };

    closePreviewModal() {
        this.isPreviewModalVisible = false;
        this.selectedDocumentUrl = null;
        this.zoomLevel = 1;
    }
    // =========================== END ==============================================

    // ============================ Checklist Dashboard ===============================

    fetchChecklistSummaryForLoan(nhfNumber: string): void {
        if (!nhfNumber) {
            return;
        }

        this.isLoadingChecklistSummary = true;
        this.checklistSummary = {
            total: 0,
            yes: 0,
            no: 0,
            waived: 0,
            deferred: 0,
            yesPercent: 0,
            noPercent: 0,
            waivedPercent: 0,
            deferredPercent: 0
        };

        this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
            response => {
                if (response && response.success && Array.isArray(response.result)) {
                    this.calculateChecklistSummary(response.result);
                }
                this.isLoadingChecklistSummary = false;
            },
            error => {
                console.error(`Error fetching checklist for ${nhfNumber}:`, error);
                this.isLoadingChecklistSummary = false;
            }
        );
    }

    calculateChecklistSummary(checklistItems: any[]): void {
        const total = checklistItems.length;

        if (total === 0) {
            this.checklistSummary = {
                total: 0,
                yes: 0,
                no: 0,
                waived: 0,
                deferred: 0,
                yesPercent: 0,
                noPercent: 0,
                waivedPercent: 0,
                deferredPercent: 0
            };
            return;
        }

        // Count items by option
        const yes = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 1 || option === 'Yes' || option === '1';
        }).length;

        const no = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 2 || option === 'No' || option === '2';
        }).length;

        const waived = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 3 || option === 'Waiver' || option === 'Waived' || option === '3';
        }).length;

        const deferred = checklistItems.filter(item => {
            const option = item.finalOption;
            return option === 4 || option === 'Deferred' || option === 'Defer' || option === '4';
        }).length;

        this.checklistSummary = {
            total,
            yes,
            no,
            waived,
            deferred,
            yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
            noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
            waivedPercent: total > 0 ? Math.round((waived / total) * 100) : 0,
            deferredPercent: total > 0 ? Math.round((deferred / total) * 100) : 0
        };
    }
    //============================ END CHECKLIST STATISTICS ===============================================




    insurancePolicyInformation(appDetailId) {
        this.loadingService.show();
        this._creditApprServ.getInsurancePolicyConfirmationStatusByAppDetailId(appDetailId).subscribe((res) => {
            this.insurancepolicyRecord = res.result;
            if (this.insurancepolicyRecord != null && this.insurancepolicyRecord.isPolicyInformationConfirmed == true) {
                this.hasCreditAdminConfirmedPolicy = true;
                this.doesInsurancePolicyExist = true;
            }
            if (this.insurancepolicyRecord == null) {
                this.hasCreditAdminConfirmedPolicy = false;
                this.doesInsurancePolicyExist = false;
            }
            if (this.insurancepolicyRecord != null && this.insurancepolicyRecord.isPolicyInformationConfirmed == false) {
                this.hasCreditAdminConfirmedPolicy = false;
                this.doesInsurancePolicyExist = true;
            }
        });
        this.loadingService.hide();
    }

    checkForFinalApproval(approvalLevelId: number) {

        if (approvalLevelId == AvailmentApprovalLevel.availmentFirstApprLvl) {
            this.firstApprovalLevel = true;
        } else if (approvalLevelId == AvailmentApprovalLevel.availmentFinalApprLvl) {
            this.finalApprovalLevel = true;
        } else if (approvalLevelId > AvailmentApprovalLevel.availmentFirstApprLvl
            && approvalLevelId < AvailmentApprovalLevel.availmentFinalApprLvl) {
            this.middleApprovalLevel = true;
        } else {
            ////console.log('first level', this.firstApprovalLevel);
            this.firstApprovalLevel = true;

        }
    }

    showCollateral() {
        this.displayCollateralForm = true;
    }

    closeDetailsPanel(evt) {
        evt.preventDefault();
        this.resetPage();
    }

    resetPage() {
        this.selectedRecord = '';
        this.activeIndex = 0;
        this.displayLoanDetails = false;
        this.displayCollateralDetails = false;
        this.displayLoanDetails = false;
        this.displayApprovalModal = false;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }



    uploadFile() {

        if (this.file !== undefined || this.uploadFileTitle != null) {
            const body = {
                loanApplicationId: this.selectedRecord.loanApplicationId,
                loanApplicationNumber: this.selectedRecord.applicationReferenceNumber,
                loanReferenceNumber: '',
                documentTitle: this.uploadFileTitle,
                documentTypeId: '1', // TODO
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
            };
            this._loadingService.show();
            this._creditApprServ.uploadFile(this.file, body).then(() => {
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = '';
                this.getSupportingDocuments(this.selectedRecord.applicationReferenceNumber);
                this._loadingService.hide();
            }, () => {
                this._loadingService.hide(1000);
            });
        }
    }

    getSupportingDocuments(applicationNumber: any) { //getDocumentsByTarget
        this._loadingService.show();
        // this._creditApprServ.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
        this._creditApprServ.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this._loadingService.hide();
        }, () => {
            this._loadingService.hide();
        });
    }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId === id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }

    DownloadDocument(id: number) {
        const fileDocument = this.supportingDocuments.find(x => x.documentId === id);

        if (fileDocument != null) {
            this.binaryFile = fileDocument.fileData;
            this.selectedDocument = fileDocument.documentTitle;
            let myDocExtention = fileDocument.fileExtension;
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
    }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 6) ? 0 : this.activeIndex + 1;

    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    submitApprovalDecision() {

        this._loadingService.show();

        if (this.firstApprovalLevel) { this.approvalStatusId = ApprovalStatus.PENDING };

        this.approvalObj = {
            targetId: this.selectedRecord.loanApplicationId,
            approvalStatusId: this.approvalStatusId,
            comment: this.crmComment,
            applicationReferenceNumber: this.selectedRecord.applicationReferenceNumber,
            applicationStatusId: LoanApplicationStatus.AvailmentCompleted,
            amount: this.selectedRecord.approvedAmount
        };

        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Decision recorded successfully!', 'success');

        this._loadingService.hide();

        this.displayApprovalModal = false;

    }

    showApprovalModal() {
        // this.approvedApplicationDetails = null;

        if (this.loanInfo != undefined) {
            this.loanInfo.isRecommendedInfo = true;
            this.loanInfo.loanApplicationDetail = this.selectedRecord;
            this.loanInfo.getLoanDetail(this.loanApplId);
        }

        this.insurancePolicyInformation(this.selectedRecord.loanApplicationDetailId);
        // this.getTrancheDetail(this.applicationSelection.loanBookingRequestId);
        ////console.log("approvedApplicationDetails", this.approvedApplicationDetails);
        this.displayApprovalModal = true;
    }

    hideApprovalModal() {
        this.crmComment = '';
        this.approvalStatusId = 0;
        this.displayApprovalModal = false;

    }


    testdata: any;

    // returnBackToBusiness() {
    //     const __this = this;
    //     const target = {
    //         operationId: 38,
    //         targetId: this.selectedRecord.loanApplicationId,
    //     };

    //     this.testdata = target;

    //     swal({
    //         title: 'Are you sure?',
    //         text: 'You want to send this back to business?',
    //         type: 'question',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes',
    //         cancelButtonText: 'No, cancel!',
    //         confirmButtonClass: 'btn btn-success btn-move',
    //         cancelButtonClass: 'btn btn-danger',
    //         buttonsStyling: true,
    //     }).then(function () {
    //         __this._loadingService.show();

    //         __this._loanApplServ.returnBackToBusinessAvailment(target).subscribe((res) => {
    //             __this._loadingService.hide();
    //             if (res.success === true) {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 __this.getApprovedLoanApplicationsDueForAvailment();
    //                 __this.resetPage();
    //             } else {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //             }
    //         }, (err) => {
    //             __this._loadingService.hide();
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //         });
    //     }, function (dismiss) {
    //         if (dismiss === 'cancel') {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    //         }
    //     });
    // }

    displayStatus(event) {
        if (event == true) {
            this.displayCommentForm = false;
        }
    }

    afterReferBackSuccess() {
        //this.loadData();
        // swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
        this.displayCommentForm = false;
        this.getInitiatedLoansAwaitingApproval();
        //this.getApprovedLoanApplicationsDueForAvailment();
        this.resetPage();
    }


    // returnBackToPrevious(form) {
    //     const __this = this;
    //     const target = {
    //         operationId: 38,
    //         targetId: this.selectedRecord.loanApplicationId,
    //         comment: form.value.comment
    //     };

    //     this.testdata = target;


    //         __this._loadingService.show();

    //         __this._loanApplServ.returnBackToPrevious(target).subscribe((res) => {
    //             __this._loadingService.hide();
    //             if (res.success === true) {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 __this.getApprovedLoanApplicationsDueForAvailment();
    //                 __this.resetPage();
    //             } else {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //             }
    //         }, (err) => {
    //             __this._loadingService.hide();
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //         });

    // }

    // looking for
    isForceApproval: boolean;
    goForApproval(evt) {
        evt.preventDefault();
        if (this.isUserCreditAmin == true && this.doesInsurancePolicyExist == true && this.hasCreditAdminConfirmedPolicy == false) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please confirm that Insurance Policy detail for the collateral is complete', 'warning');
            return null;
        }

        this._loadingService.showKeyApiCall();
        let bodyObj = {
            targetId: this.selectedRecord.loanBookingRequestId,
            // approvalStatusId: this.selectedRecord.approvalStatusId,
            approvalStatusId: 2,
            comment: this.crmComment,
            operationId: this.selectedRecord.operationId,
            trailId: this.selectedRecord.trailId
        };

        // if(this.selectedRecord.productTypeId == ProductTypeEnum.ContingentLiability){ this.selectedRecord.isForceApproval == true; }


        this.creditApprovalService.approveInitiatedLoanBookingRequest(bodyObj, this.selectedRecord.loanBookingRequestId).subscribe((response: any) => {
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayLoanDetails = false;
                this.displayApprovalModal = false;
                this.getInitiatedLoansAwaitingApproval();
                this.updatePendingData();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayApprovalModal = true;
            }
            this._loadingService.hideKeyApiCall();
        }, (err) => {
            this.displayApprovalModal = true;
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this._loadingService.hideKeyApiCall(1000);
        });
    }

    // sendForBooking(evt) {
    //     evt.preventDefault();
    //     // console.log(evt);
    //     //this._loadingService.show();
    //     const target = {
    //         targetId: this.selectedRecord.loanApplicationId,
    //         approvalStatusId: this.approvalStatusId,
    //         comment: this.crmComment,
    //         applicationReferenceNumber: this.selectedRecord.applicationReferenceNumber,
    //         applicationStatusId: LoanApplicationStatus.AvailmentCompleted,
    //         amount: this.selectedRecord.approvedAmount
    //     };

    //     this._loanApplServ.logAvailmentDecisionForApproval(target).subscribe((res) => {
    //         this._loadingService.hide();
    //         if (res.success === true) {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //             this.getApprovedLoanApplicationsDueForAvailment();
    //             this.displayLoanDetails = false;
    //             this.displayApprovalModal = false;
    //         } else {
    //             this.displayApprovalModal = true;

    //             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //         }
    //     }, (err) => {
    //         this._loadingService.hide();
    //         this.displayApprovalModal = true;
    //         swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //     });

    //     // this._loanApplServ.availmentChecklistValidation(this.selectedRecord.loanApplicationId)
    //     //     .subscribe((res) => {

    //     //         if (res.success == true) {
    //     //             if (res.result != null) {
    //     //                 let checkListIndex = res.result.checkListIndex;
    //     //                 if (checkListIndex == 2 || checkListIndex == 3) {
    //     //                     swal(`${GlobalConfig.APPLICATION_NAME}`, res.result.messageStr, 'error');
    //     //                     return
    //     //                 } else {
    //     //                     const __this = this;
    //     //                     swal({
    //     //                         title: 'Are you sure?',
    //     //                         text: 'You won\'t be able to revert this!',
    //     //                         type: 'question',
    //     //                         showCancelButton: true,
    //     //                         confirmButtonColor: '#3085d6',
    //     //                         cancelButtonColor: '#d33',
    //     //                         confirmButtonText: 'Yes',
    //     //                         cancelButtonText: 'No, cancel!',
    //     //                         confirmButtonClass: 'btn btn-success btn-move',
    //     //                         cancelButtonClass: 'btn btn-danger',
    //     //                         buttonsStyling: true,
    //     //                     }).then(function () {
    //     //                         __this._loanApplServ.logAvailmentDecisionForApproval(target).subscribe((res) => {
    //     //                             __this._loadingService.hide();
    //     //                             if (res.success === true) {
    //     //                                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //     //                                 __this.getApprovedLoanApplicationsDueForAvailment();
    //     //                                 __this.displayLoanDetails = false;
    //     //                                 __this.displayApprovalModal = false;
    //     //                             } else {
    //     //                                 __this.displayApprovalModal = true;

    //     //                                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //     //                             }
    //     //                         }, (err) => {
    //     //                             __this._loadingService.hide();
    //     //                             __this.displayApprovalModal = true;
    //     //                             swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //     //                         });
    //     //                     }, function (dismiss) {
    //     //                         if (dismiss === 'cancel') {
    //     //                             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    //     //                         }
    //     //                     });
    //     //                 }
    //     //             }
    //     //         }
    //     //     })

    // }

    // logForApproval(dataObj, evt) {
    //     evt.preventDefault();

    //     const __this = this;

    //     const target = {
    //         applicationReferenceNumber: dataObj.applicationReferenceNumber,
    //         amount: dataObj.approvedAmount,
    //         comment: this.crmComment
    //     };


    //     swal({
    //         title: 'Are you sure?',
    //         text: 'You won\'t be able to revert this!',
    //         type: 'question',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes',
    //         cancelButtonText: 'No, cancel!',
    //         confirmButtonClass: 'btn btn-success btn-move',
    //         cancelButtonClass: 'btn btn-danger',
    //         buttonsStyling: true,
    //     }).then(function () {
    //         __this._loadingService.show();

    //         __this._loanApplServ.logApplicationForApproval(target).subscribe((res) => {
    //             __this._loadingService.hide();
    //             if (res.success === true) {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 __this.getApprovedLoanApplicationsDueForAvailment();
    //                 __this.displayLoanDetails = false;
    //             } else {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //             }
    //         }, (err) => {
    //             __this._loadingService.hide();
    //             __this.displayLoanDetails = false;
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //         });
    //     }, function (dismiss) {
    //         if (dismiss === 'cancel') {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    //         }
    //     });
    // }

    addGuarantor(guarantorForm) {
        let body = {
            customerType: guarantorForm.value.gaurantorType,
            productTypeId: this.productTypeId,
            bvn: guarantorForm.value.bvn,
            firstname: guarantorForm.value.firstname,
            middlename: guarantorForm.value.middlename,
            lastname: guarantorForm.value.lastname,
            relationship: guarantorForm.value.relationship,
            relationshipduration: guarantorForm.value.relationshipDuration,
            phoneNumber1: guarantorForm.value.phoneNumber1,
            phoneNumber2: guarantorForm.value.phoneNumber2,
            emailAddress: guarantorForm.value.emailAddress,
            address: guarantorForm.value.address,
            registration_number: guarantorForm.value.rcNumber,
            tax_number: guarantorForm.value.taxNumber
        }
        this._loadingService.show();
        this._loanServ.saveLoanGaurantor(body, this.productTypeId, this.loanApplId)
            .subscribe((res) => {
                if (res.success === true) {
                    //this.getLoanGaurantors(this.loanApplId);
                    if (this.file != undefined || this.uploadFileTitle != null) this.uploadFile();
                    this._loadingService.hide();
                    swal('', 'Loan gaurantor details saved', 'success');
                } else {
                    this._loadingService.hide();
                    swal('', 'Failed to save loan gaurantor', 'error');
                }
            }, () => {

            })
        this._loadingService.hide();
        this.resetGuarantorForm();
    }


    deleteSelectedGuarantorItem(index) {
        if (index !== -1) {
            this.guarantorCollection.splice(index, 1);
        }
    }

    onGaurantorTypeChange() {
        var type = this.guarantorForm.value.gaurantorType;
        if (type != null || type != '') {
            this.gaurantorTypeSelected = true;
            this.guarantorForm.controls['docDescription'].setValue('Loan Gaurantor Form');
        }
        else { this.gaurantorTypeSelected = false; }

        if (type.toLowerCase() === 'corporate') {
            this.guarantorForm.controls['middlename'].setValue(null);
            this.guarantorForm.controls['lastname'].setValue(null);
            this.isCorporateGaurantor = true;
            this.dynamicGaurantorNameLabel = 'Company Name';
            this.guarantorForm.controls['lastname'].setValue(" ");
        }
        else {
            this.guarantorForm.controls['rcNumber'].setValue(null);
            this.isCorporateGaurantor = false;
            this.dynamicGaurantorNameLabel = 'Firstname';
        }
    }

    showGuarantorsForm() {
        this.displayGuarantorsForm = true;
    }

    handleLoanInfoTabChange(evt) {
        this.loanInfoIndex = evt.index;
    }

    nextAccordionTab() {
        this.loanInfoIndex = (this.loanInfoIndex === 3) ? 0 : this.loanInfoIndex + 1;

    }

    prevAccordionTab() {
        this.loanInfoIndex = (this.loanInfoIndex === 0) ? 2 : this.loanInfoIndex - 1;
    }

    refreshCollateral() {
        this.getLoanApplicationCollateral(this.loanApplId);
        this.collateralDataList.splice();
    }

    //#region Limits 
    customerRate_Limit = {};
    customerRating: string; investmentGrade: boolean;
    GetcustomerLimitAndRating(customerId) {
        this.customerRate_Limit = {};
        this._customerService.getCustomerRatingAndLimit(customerId)
            .subscribe((res) => {
                // console.log("res: ", res);

                if (res.result != undefined) {
                    this.lcustomerLimit = res.result.limit;
                    this.customerRating = res.result.rating;
                    this.investmentGrade = res.result.isInvestment;
                }

                // this.loanApplication.controls["isInvestmentGrade"].setValue(this.investmentGrade);
            }, () => {
            });
    }


    getBankLimit(branchId: number, groupId: number) {
        this.getBranchLimit(branchId);

        this._loanApplServ.getGroupLimit(groupId)
            .subscribe((res) => {
                this.groupLimit = res.result;
                this.lgroupLimit = this.groupLimit.limit;
                this.ogroupLimit = this.groupLimit.outstandingBalance;
            }, () => {
                this._loadingService.hide();
            });
    }

    getRmLimit(appl) {
        const cust = appl;
        this._loanApplServ.getRMLimit(cust.relationshipManagerId)
            .subscribe((res) => {
                this.rMLimit = res.result;
                this.orMLimit = this.rMLimit.outstandingBalance;
                this.lrMLimit = this.rMLimit.limit;

            }, () => {
                this._loadingService.hide();
            });
    }

    getSegmentLimit(appl) {
        const cust = appl;
        this._loanApplServ.getSegmentLimit(cust.productClassId)
            .subscribe((res) => {
                this.segmentLimit = res.result;
                this.osegmentLimit = this.segmentLimit.outstandingBalance;
                this.lsegmentLimit = this.segmentLimit.limit;
            }, () => {
                this._loadingService.hide();
            });
    }

    getSectorLimit(appl) {
        const cust = appl;
        this._loanApplServ.getSectorLimit(cust.subSectorId)
            .subscribe((res) => {
                if (res != null) {
                    this.sectorLimit = res.result;
                } else {
                    this.sectorLimit = {};
                }
                this.osectorLimit = this.sectorLimit.outstandingBalance;
                this.lsectorLimit = this.sectorLimit.limit;

            }, () => {
                this._loadingService.hide();

            });
    }
    getBranchLimit(branchId: number) {
        this._loanApplServ.getValidateNPLByBranch(branchId).subscribe((res) => {
            this.nPLLimit = res.result;
            this.lnPLLimit = this.nPLLimit.limit;
            this.onPLLimit = this.nPLLimit.outstandingBalance;
            this._loadingService.hide(10000);

        }, () => {
            this._loadingService.hide();

        });
    }

    getRunningLoan(id: number) {
        this._loanServ.getRunningLoan(id)
            .subscribe((res) => {
                this.runningLoans = res.result;
            }, () => {
                this._loadingService.hide();

            });
    }
    //#endregion Limits




    CallRequestClose() { this.displayJobrequest = false; }

    finishBad(message) {
        this.showMessage(message, 'error', 'FintrakBanking');
        this._loadingService.hide();
    }

    finishGood(message) {
        this._loadingService.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    popoverSeeMore() {
        if (this.OLApplicationReferenceNumber != null) {
            ////console.log('this.OLApplicationReferenceNumber ', this.OLApplicationReferenceNumber );
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            const data = {
                applicationRefNumber: this.OLApplicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                ////console.log(path);
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                ////console.log(path);
            });
            this.displayReport = true;
            return;
        }
    }

    addCRMS(item) {
        this.securedByCollateralChanged(item.securedByCollateral);
        // this.getCRMSUnsecuredCollateralType();
        this.selectedLoanRecord = item;
        this.crmsCollateralTypeId = item.crmsCollateralTypeId;
        this.crmsRepaymentTypeId = item.crmsRepaymentTypeId,
            this.securedByCollateral = item.securedByCollateral;
        this.isSpecialised = item.isSpecialised;
        this.moratoriumPeriod = item.moratoriumPeriod;

        ////console.log("item.isSpecialised", item.isSpecialised);

        // this.crmsLoanTypeForm = this._fb.group({
        //     securedByCollateral: [item.chargeName, Validators.required],
        //     crmsCollateralTypeId: [item.productTypeId, Validators.required],
        // });
        ////console.log("selectedLoanRecord", this.selectedLoanRecord);
        this.LoancrmsModal = true;
    }
    securedByCollateralChanged(value) {
        ////console.log("value", value);
        if (value == true) {
            this.getCRMSSecuredCollateralType();
            this.crmsCollateralTypeId = "";
        }
        else {
            this.getCRMSUnsecuredCollateralType();
            this.crmsCollateralTypeId = "";
        }
    }
    getCRMSSecuredCollateralType() {
        this._loanApplServ.getCRMSSecuredCollateralTypes().subscribe((response: any) => {
            this.crmsCollateralTypes = response.result;
        });
    }
    getCRMSUnsecuredCollateralType() {
        this._loanApplServ.getCRMSUnsecuredCollateralTypes().subscribe((response: any) => {
            this.crmsCollateralTypes = response.result;
        });
    }
    getAllCRMSCollateralType() {
        this._loanApplServ.getAllCRMSCollateralTypes().subscribe((response: any) => {
            this.allCrmsCollateralTypes = response.result;
        });
    }
    clearControls() {
        this.selectedLoanRecord = null;
        this.crmsLoanTypeForm = this._fb.group({
            securedByCollateral: ['', Validators.required],
            crmsCollateralTypeId: ['', Validators.required],
            crmsRepaymentTypeId: ['', Validators.required],
            moratoriumPeriod: ['', Validators.required],

        });
    }
    addCrms() {
        const __this = this;

        swal({
            title: 'Add CRMS?',
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
            // if (__this.isSpecialised==2)
            // {
            //     __this.isSpecialised==0;
            // }
            ////console.log("__this.isSpecialised", __this.isSpecialised);

            const body = {
                loanApplicationDetailId: __this.applicationSelection.loanBookingRequestId,
                // loanBookingRequestId: __this.loanBookingRequestId,
                crmsCollateralTypeId: __this.crmsCollateralTypeId,
                securedByCollateral: __this.securedByCollateral,
                isSpecialised: __this.isSpecialised,
                crmsRepaymentTypeId: __this.crmsRepaymentTypeId,
                moratoriumPeriod: __this.moratoriumPeriod,

            }
            ////console.log("body", body);
            __this._loadingService.show();
            __this._loanApplServ.SaveCollateralType(body).subscribe((res) => {
                if (res.success === true) {
                    __this.getTrancheDetail(__this.applicationSelection.loanBookingRequestId);
                    // __this.getLoanDetail(__this.loanApplId);
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
                    __this.refresh(); // refresh
                    __this._loadingService.hide();
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                    __this._loadingService.hide(1000);
                }

            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }
    getRegulatoryTypeName(id) {
        if (this.allCrmsCollateralTypes == null && this.allCrmsCollateralTypes == undefined) {
            return;
        }
        let model = this.allCrmsCollateralTypes.find(x => x.lookupId == id);
        return (model == null) ? null : model.lookupName;
    }
    refresh() {
        this.LoancrmsModal = false;
        this.securedByCollateral = false;
        this.crmsCollateralTypeId = null;
        this.crmsRepaymentTypeId = null;
        this.isSpecialised = null;
        this.moratoriumPeriod = null;

    }

    updateWorkflowTarget() { ////console.log('availment loan selection',this.selectedRecord);
        this.workflowTarget.targetId = this.selectedRecord.loanApplicationId;
        this.workflowTarget.operationId = 38; //this.loanApplOperationId; //this.loanSelection.operationId;
        //this.workflowTarget.productClassId = this.selectedRecord.productClassId;
        //this.workflowTarget.productId = this.selectedRecord.productId;
        // this.workflowTarget.toStaffId = null; //this.applicationSelection.toStaffId; // optional
        // this.workflowTarget.responsiblePerson = null; //this.applicationSelection.responsiblePerson; // required if toStaffId is given
        // this.workflowTarget.currentApprovalLevel = null; //this.applicationSelection.currentApprovalLevel; // required if toStaffId is given
        // this.workflowTarget.finalApprovalLevelId = null; //this.applicationSelection.finalApprovalLevelId;
        //this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }
    resetGrid(yes) {
        //if (yes) this.hideLoanBooking();
    }
    form3800b(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                ////console.log(path);
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                ////console.log(path);
            });
            //this.displayReport = true;
            return;
        }

    }

    getCollateralStampToCoverValues(): void {
        this._creditApprServ.getCollateralStampToCoverValues(this.customerId).subscribe((response: any) => {
            this.collateralStampToCoverValues = response.result;
        });
    }

    getTotalExposureLimit(row): void {
        this._creditApprServ.getTotalExposureLimit({
            // branchId: row.branchId,
            // sectorId: row.sectorId,
            // staffId: row.staffId,
            // customerId: row.customerId,
            applicationId: row.loanApplicationId,
        }).subscribe((response: any) => {
            this.totalExposureLimit = response.result;
        });
    }

    commentForm: FormGroup;
    displayCommentForm: boolean = false;



    showCommentForm(init = false) {
        this.commentForm = this._fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],

        });
        if (init == false) this.displayCommentForm = true;
    }

    saveComment(form) {
        // todo
    }

    getDrawdownMemoHtml(targetId) {
        this._creditApprServ.getDrawdownMemoHtml(targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
        }, () => {
            //
        });
    }

    lienIsSatisfied(event) {
        this.allAreLiensPLaced = event;
    }

    getApplicationStatus(approvalStatus) {
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

    enableReroute: boolean;
    pushSelectedPendingLoanRequests(row) {
        this.workflowTarget = new WorkflowTarget;
        var record = row.data;
        this.workflowTarget.targetId = record.loanApplicationDetailId;
        this.workflowTarget.operationId = record.operationId;
        this.workflowTarget.trailId = record.approvalTrailId;
        this.enableReroute = true;
        this.workflowTargets.push(this.workflowTarget);
        this.loanSelection = null;
    }

    popSelectedPendingLoanRequests(row) {
        var record = row.data;
        var index = this.workflowTargets.findIndex(x => x.targetId == record.loanApplicationDetailId);
        this.workflowTargets.splice(index, 1);

    }


    updatePendingData() {
        this.loanApprovalData.forEach((item) => {
            var assignedItem = this.workflowTargets.filter(x => x.targetId == item.loanApplicationDetailId);
            if (assignedItem.length > 0) {
                item.toStaffId = this.staffRoleRecord.staffId;
            }
        });
        var assignedList = this.loanApprovalData.filter(x => x.toStaffId > 0);

        var x = this.assignedApplications;
        x.push(assignedList);
        this.assignedApplications = x;
        this.assignedApplications.slice;

        this.loanApprovalData = this.loanApprovalData.filter(x => x.toStaffId == null);
        this.loanApprovalData.slice;
    }


    AddToMyDesk() {
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign the application(s) requests to yourself?',
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
            __this._creditApprServ.assignRequestToSelf(__this.workflowTargets).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.getInitiatedLoansAwaitingApproval();
                    __this.updatePendingData();
                    //__this.displayApproverSearchForm = false;
                    __this.workflowTargets = [];
                }
            }, () => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    onReturnToPool(data) {

        ///console.log('data',data); 
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to return this application requests to pool?',
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
            __this._creditApprServ.ReturnTransactionToPool(__this.workflowTargets, data.approvalTrailId).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.getInitiatedLoansAwaitingApproval();
                    __this.updatePendingData();
                    __this.workflowTargets = [];
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

}
