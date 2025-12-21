import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ReportService } from 'app/reports/service/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LMSOperationEnum, JobSource, LoanSystemTypeEnum, ApprovalStatusEnum, GlobalConfig, ApprovalStatus } from 'app/shared/constant/app.constant';
import { CreditAppraisalService, LoanReviewApplicationService, LoanOperationService, LoanService } from 'app/credit/services';
import { saveAs } from 'file-saver';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService, ChecklistService, CollateralService, GeneralSetupService } from 'app/setup/services';
import { AuthorizationService } from 'app/admin/services';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { ProjectSiteReportService } from 'app/credit/services/project-site-report.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-credit-documentation-filling-approval',
  templateUrl: './credit-documentation-filling-approval.component.html'
})
export class CreditDocumentationFillingApprovalComponent implements OnInit {

    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    reload: number = 0;
    readonly CREDITAPPRIASALDOC: string ="APPRAISAL DOCUMENTS";
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    displayRestructuringApprovalModal: boolean = false;
    loanOperationApprovalData: any[] = [];
    loanSelectedData: any = {};
    loanSelection: any;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;
    loanSystemTypeId: any;
    loanId: any;
    isLms: boolean = true;
    isCRMSstaff: any;
    jobSourceId: number;
    supportingDocumentsLms: any[] = [];
    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;
    originalForm3800bSrc: any;
    lmsLoanReferenceNumber: any;
    displayTestReport: boolean;
    displayReport: boolean;
    reportSrc: SafeResourceUrl;
    activeTabindex: number;
    RegulatoryInterestRateChange: boolean = false;
    displaySearchForm: boolean = false;
    SubAllocationOverdraft: boolean = false;
    PrepaymentChange: boolean = false;
    PrincipalFrequencyChange: boolean = false;
    InterestFrequencyChange: boolean = false;
    InterestandPrincipalFrequencyChange: boolean = false;
    PaymentDateChange: boolean = false;
    TenorChange: boolean = false;
    CASAAccountChange: boolean = false;
    Overdrafttopup: boolean = false;
    FeechargeChange: boolean = false;
    TerminateandRebook: boolean = false;
    CompleteWriteOff: boolean = false;
    CancelUndisbursedLoan: boolean = false;
    Restucture: boolean = false;
    LoanRecapitalization: boolean = false;
    OverdraftTenorExtension: boolean = false;
    OverdraftSubAllocation: boolean = false;
    
    OPERATION_ID: number = 264;
    documentations: any[] = [];
    displayDocumentation: boolean = false;
    selectedloanReviewApplicationId: number;
    isOverDraft: boolean = false;
    contingentFacility: boolean = false;
    Others: boolean = false;
    type: any;
    reportSource: SafeResourceUrl;

    supportingDocuments: any[] = [];
    attachmentDocuments: any[] = [];
    proposedItem:any[] = [];
    searchString: string;
    searchForm: FormGroup;
    displayCommentForm: boolean = false;
    displayApprovalModal: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    testModal: boolean = false;
    private subscriptions = new Subscription();
    trail: any[] = [];
    trail23: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    isSubsequent: boolean = false;
    loanApplicationDetail: any;
    customerProposedAmount: number = 0;
    maximumAmount: number = 0;
    multipLoanData: number[] = [];
    warningMessage: string = '';
    touchedLineItems: number[] = [];
    recommendedItems: any[] = [];
    lienRemovalData: any[] = [];
    loans: any[] = [];
    selectedLineId: number;
    enebleFacilityChange: boolean = false;
    proposedItems: any[] = [];
    facilityCount: number = 0;
    lienRemovalId: number = 0;
    lienRemovalOperationId: number = 0;
    errorMessage: string = '';
    loanReviewOperationsId: number;
    show: boolean = false;
    cssClass: any;
    synOperationId: any;
    creditAppraisalLoanApplicationId: number = 0;
    creditAppraisalOperationId: number = 0;
    loanReviewApplicationId: number = 0;
    appraisalOperationId: number = 0;
    uploadedDocumentData: any[] = [];
    schemeSelection: any;
    loanRecoveryApprovalData: any[] = [];

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private loanApplService: LoanApplicationService,
        private loanOperationService: LoanOperationService, private loanService: LoanService, private genSetupService: GeneralSetupService,
        private router: Router, private camService: CreditAppraisalService,
        private LetterGenServ: LetterGenerationRequestService, private collateralService: CollateralService,
        private checklistService: ChecklistService, private psrService: ProjectSiteReportService,
        private approvalService: ApprovalService, private sanitizer: DomSanitizer ) {
    }

    ngOnInit() {
        this.jobSourceId = JobSource.LMSOperationAndApproval;
        this.getDocumentationFillingAwaitingApproval();
        this.getAllApprovalStatus();
        this.displayReport = false;
        this.initializeForm()
        // this.getChecklistAwaitingApproval();
        // this.getOriginalDocumentApprovals();
        // this.getApprovalSecurityRelease();
        // this.getLetterGenerationRequests();
        // this.getValuationRequestWaitingForApproval();
        // this.getCollateralSwapRequestsForApproval();
        // this.getInsurancePoliciesWaitingForApproval();
        // this.getProjectSiteReportApproval();
    }

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    getStaffActivity(activity) {
        this.camService.getStaffActivity(activity).subscribe((response) => {
            this.isCRMSstaff = response.result;
        });
    }

    showSearchForm() {
        this.displaySearchForm = true;
        this.searchForm = this.fb.group({
            searchString: [""],
        });
    } 
    initializeForm() {
        //this.displaySearchForm = true;
        this.searchForm = this.fb.group({
            searchString: [""],
        });
    }

    getDocumentationFillingAwaitingApproval() {
        this.loadingService.show();
        this.loanService.getLoanOperationDocumentationLosApproval().subscribe((res) => {
        this.loans = res.result;
        this.loadingService.hide();
      });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }
    hasFees: boolean = false;
    terminateRebook: boolean = false;
    showAttachedDocument: boolean = false;
    ammendedAmount: number = 0;

    approval(row, evt) {
      evt.preventDefault();
      this.loanSelectedData = {};
      this.loanSelectedData = row;
      this.loanSelectedData.approvalStatusId = "";
      let dataObj = this.loanSelectedData;
      this.displayApprovalModal = true;
  }

    promptToGoForApproval(formObj) {
        
    this.goForApproval(formObj);
    }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.loanService;
        let bodyObj = {
            targetId: this.loanSelectedData.documentationFillingId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment,
        };
        this.displayTwoFactorAuth = false;
        const __this = this;
        swal({
            title: 'Are you sure?',
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
            __this.loadingService.show();
            __this.loanOperationService.sendDocumentationFillingForApproval(bodyObj).subscribe((response) => {
                __this.loadingService.hide();
                if (response.success === true) {
                  __this.loanSelectedData = {};
                    __this.loanSelectedData = {};
                    __this.getDocumentationFillingAwaitingApproval();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.displayApprovalModal = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    __this.displayApprovalModal = true;
                }

            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayApprovalModal = false;
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

    

    //====================================================================================

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
    }

    finishGood(message = 'ok') {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    cancelForm() {
        this.displayCommentForm = false;
        this.errorMessage = '';
        this.receiverLevelId = null;
        this.receiverStaffId = null;
    }

    
    disapprove() {
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Disapprove';
        this.commentForm.controls['vote'].setValue(1);
    }

    hideModal(int: number = 0) {
        if(int == 0){
            this.handleChange(0);
            this.activeIndex = 0;
            // this.documentations = [];
            this.displayRestructuringApprovalModal = false;
        }else if(int == 1){
            this.activeTabindex1 = 0;
            this.targetId1 = 0;
            this.operationId1 = 0;
        }else if(int == 2){
            this.activeTabindex2 = 0;
            this.targetId2 = 0;
            this.operationId2 = 0;
        }else if(int == 3){
            this.activeTabindex3 = 0;
            this.targetId3 = 0;
            this.operationId3 = 0;
        }else if(int == 4){
            this.activeTabindex4 = 0;
            this.targetId4 = 0;
            this.operationId4 = 0;
        }else if(int == 5){
            this.activeTabindex5 = 0;
            this.targetId5 = 0;
            this.operationId5 = 0;
        }
        
    }

    
    //#region properties
    fileDocument: any;
    selectedChecklist: any;
    checklistAwaitingApproval = [];
    operationId1 = 0; // deferral/waiver
    operationId2 = 0; //security release
    operationId3 = 0; //original doc sub
    operationId4 = 0; //lettergen
    operationId5 = 0; //projectSite
    operationId6 = 0; //collateralvaluation
    operationId7 = 0; //swap
    operationId8 = 0; //insurance
    targetId1 = 0; // deferral/waiver
    targetId2 = 0; //security release
    targetId3 = 0; //original doc sub
    targetId4 = 0; //letter gen
    targetId5 = 0; //projectSite
    targetId6 = 0; //collateralvaluation
    targetId7 = 0; //swap
    targetId8 = 0; //insurance
    selectedChecklistData: any;
    itemSelected = false;
    ckEditorContent: any;
    loanSystemTypeId1 = 0;
    loanApplicationDetailId = 0;
    reloadLoanDetails = 0;
    approvalReleases = [];
    activeTabindex1: number; //deferral/waiver
    activeTabindex2: number; //security release
    activeTabindex3: number; //original doc sub
    activeTabindex4: number; //letter gen
    activeTabindex5: number; //projectSite
    activeTabindex6: number; //collateralvaluation
    activeTabindex7: number; //swap
    activeTabindex8: number; //insurance
    TARGET_ID = 0;
    CUSTOMER_ID = 0;
    REFERENCE_NUMBER: string;
    rowSelected = false;
    documentUploadsForSecurityRelease = [];
    documentUploadsOriginalDocSub = [];
    letterGenerationRequests = [];
    showUploadeddocumentForSecurityRelease = false;
    originalDocumentApprovals = [];
    originalDocumentApprovalId = 0;
    facilityDetailForOriginalDocSub = false;
    requestTypes = [
        {name: 'Letter Of Indebtedness', id: 1},
        {name: 'Letter Of Non-indebtness', id: 2},
        {name: 'Auditor\'s enquiry', id: 3}
    ];
    displayLetterGenerationRequestForm = false;
    displayCollateralValuationRequestForm = false;
    camsolLoanDocHtml: any;
    valuationPrerequisites = [];
    valuationCustomerId = 0;
    valuationReferenceNumber = '';
    displayCollateralSwapForm = false;
    collateralSwapRequests = [];
    itemPolicy = [];
    displayCollateralInsuranceForm = false;
    ProjectSiteReports = [];
    displayProjectSiteReport = false;
    showProjectSiteDetail = false;
    projectReportSrc: SafeResourceUrl;
    psrReportTypeId = 0;
    showInput = false;
    performanceAnalysisReport = [];
    showAnalysisDetail = false;
    analysisDetail:any = {};
    commentReport = [];
    observationReport = [];
    recommendationReport = [];
    taskReport = [];
    performanceEvaluationsReport = [];
    evaluationDetail:any = {};
    performanceAnalysisReportCount = 0;
    OrignalDocLoanSelection: any = {};
    displayDocument = false;
    binaryFile: string;
    selectedDocument: string;
    // this.getChecklistAwaitingApproval();
    // this.getOriginalDocumentApprovals();
    // this.getApprovalSecurityRelease();
    // this.getLetterGenerationRequests();
    // this.getValuationRequestWaitingForApproval();
    // this.getCollateralSwapRequestsForApproval();
    // this.getInsurancePoliciesWaitingForApproval();
    // this.getProjectSiteReportApproval();
    //#endregion

    //#region forward
    forward(targetId: number = 0, operationId: number = 0){
        if(targetId <= 0 || operationId <= 0){
            return;
        }
        let body = {
            targetId,
            operationId,
        }
        
        this.loadingService.showKeyApiCall();
        this.loanService.logApproval(body).subscribe((response) => {
            if(response.success == true){
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            this.loadingService.hideKeyApiCall();
        }, (err) => {
            this.loadingService.hideKeyApiCall(1000);
        });
    }
    //#endregion

    //#region deferral
    getChecklistAwaitingApproval() {
        this.loadingService.show();
        this.checklistService.getChecklistAwaitingApproval().subscribe((data) => {
          this.checklistAwaitingApproval = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
        this.activeTabindex1 = 0;
    }

    onTabChange1(e) {
        this.activeTabindex1 = e.index;
        if (e.index == 0) { 
            this.refresh1(); 
        }
    }

    refresh1() {
        this.reload = 0;
        this.selectedChecklistData = {};
        this.itemSelected = false;
    }

    viewChecklistDetails(row) {
        this.getDrawdownDeferralMemo(row.operationId,row.loanApplicationDetailId)
        if(row.isLms == false) {
            this.operationId1 = row.operationId;
            this.targetId1 = row.conditionId;
            this.loanApplicationDetailId = row.loanApplicationDetailId;
        } else {
            this.loanSystemTypeId1 = row.loanSystemTypeId;
            this.reloadLoanDetails = row.loanId;
        }
        this.selectedChecklistData = row;
        this.selectedChecklistData.conditionId = row.conditionId;
        this.itemSelected = true;
        this.activeTabindex1 = 1;
    }

    getDrawdownDeferralMemo(operationId,targetId) {
        this.loadingService.show();
        this.checklistService.getDrawdownDeferralMemo(operationId, targetId).subscribe((response) => {
            if (response.result == null) {
                return;
            }
            this.loadingService.hide();
            this.ckEditorContent = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
     
    printDocumentByElemntId(printTitle: string, elementId: string): void {
        let printContents, popupWin;

        printContents = document.getElementById(elementId).innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title style="font face: arial; size:12px">${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

    // getDeferralWaiverPdf() {
    //     let path = '';
    //     this.checklistService.getDeferralWaiverPdf(this.operationId1, this.targetId1, this.loanApplicationDetailId).subscribe((response) => {
    //         if (response.result == null) {
    //             return;
    //         }
    //         path = response.result;
    //         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    //         this.displayTestReport = true;
    //         this.displayReport = true;
    //     }, (err) => {
        
    //     });
    // }
    //#endregion
    
    //#region security Release
    viewDocumentsForSecurityRelease(row) {
        this.loadingService.show();
        this.operationId2 = row.operationId;
        this.targetId2 = row.originalDocumentApprovalId;
        this.getDocumentsByTargetForSecurityRelease(row.docSubmissionOperationId, row.originalDocumentApprovalId);
        this.TARGET_ID = row.collateralId;
        this.CUSTOMER_ID = row.customerId;
        this.rowSelected = true;
        this.loadingService.hide();
    }

    getDocumentsByTargetForSecurityRelease(docSubmissionOperationId, targetId) {
        this.loadingService.show();
        this.camService.getDocumentsReleasedDocuments(docSubmissionOperationId, targetId).subscribe((response) => {
            this.documentUploadsForSecurityRelease = response.result;
            this.showUploadeddocumentForSecurityRelease = true;
            this.loadingService.hide();
        });
    }

    downloadDocument(d, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.camService.downloadDocument(d.documentUploadId).subscribe((response) => {
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

    getApprovalSecurityRelease() {
        this.loadingService.show();
        this.camService.approveRelease().subscribe((response) => {
            this.approvalReleases = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    //#endregion

    //#region OrigDocSub
    getOriginalDocumentApprovals() {
        this.loadingService.show();
        this.approvalService.getOriginalDocumentApprovals().subscribe((response) => {
            this.originalDocumentApprovals = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewOriginalDocDetail(row) {
        this.OrignalDocLoanSelection = row;
        //console.log('row', row);
       // console.log('this.loanSelection', this.loanSelection);
        this.operationId3 = row.operationId;
        this.facilityDetailForOriginalDocSub = true;
        this.originalDocumentApprovalId = row.originalDocumentApprovalId;
        this.targetId3 = row.originalDocumentApprovalId;
        this.getDocumentsByTargetForOriginalDocSub();
        this.activeTabindex3 = 1;
    }

    getDocumentsByTargetForOriginalDocSub() {
        this.loadingService.show();
        this.camService.getDocumentsByTarget(this.operationId3, this.originalDocumentApprovalId, true).subscribe((response) => {
            this.documentUploadsOriginalDocSub = response.result;
            this.loadingService.hide();
        });
    }
    //#endregion

    //#region letterGen
    getLetterGenerationRequests() {
        this.loadingService.show();
        this.LetterGenServ.getLetterGenerationRequestsForApproval().subscribe((response) => {
            this.letterGenerationRequests = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getRequestTypeName(id): string {
        return this.requestTypes.find(t => t.id == id).name;
    }

    editLetterGenerationRequest(row) {
        //console.log("row: ", row);
        this.targetId4 = row.requestId;
        this.operationId4 = row.operationId;
        this.displayLetterGenerationRequestForm = true;
        this.getCamsolLoanDocument(row.requestType, row);
        // this.getCamsolLoansByCustomerCode(row.customerName, row.customerCode);
    }

    getCamsolLoanDocument(typeId: Number, data: any) {
       // console.log("data: ", data);
        var body = {
            customerId: data.customerId,
            customerCode: data.customerCode,
            customerName: data.customerName,
            accountNumber: data.accountNumber,
            asAtDate: data.asAtDate,
            requestRef: data.requestRef,
            loanBalance: data.loanBalance
        }

        this.loadingService.show();
        this.LetterGenServ.getCamsolLoanDocument(typeId, body).subscribe((response) => {
            this.camsolLoanDocHtml = response.result;
            this.loadingService.hide();
        });
    }

    printCamsolLoanDocument() {
        var print_div = document.getElementById("camsolLoanDocument");
        var print_area = window.open();
        print_area.document.write(print_div.innerHTML);
        print_area.document.close();
        print_area.focus();
        print_area.print();
        print_area.close();
    }
    //#endregion

    //#region valuation
    getValuationRequestWaitingForApproval() {
        this.loadingService.show();
        this.collateralService.getAllValuationRequestWaitingForApproval().subscribe((response) => {
            this.valuationPrerequisites = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewValuationDetail(d) {
        this.targetId6 = d.valuationPrerequisiteId;
        this.valuationCustomerId = d.customerId;
        this.valuationReferenceNumber = d.referenceNumber;
        this.operationId6 = d.operationId;
        this.displayCollateralValuationRequestForm = true;
    }
    //#endregion

    //#region swap
    getCollateralSwapRequestsForApproval() {
		this.loadingService.show();
		this.collateralService.getCollateralSwapRequestsForApproval().subscribe((response) => {
			this.collateralSwapRequests = response.result;
			this.loadingService.hide();
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
			this.loadingService.hide(1000);
		});
    }
    
    viewSwapInfo(row) {
		this.loadingService.show();
		this.targetId7 = row.collateralSwapId;
		this.operationId7 = row.operationId;
        this.displayCollateralSwapForm = true;
        this.loadingService.hide();
    }
    //#endregion

    //#region insurance
    getInsurancePoliciesWaitingForApproval(): void {
        this.loadingService.show();
        this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response) => {
          this.itemPolicy = response.result;
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
    }

    public getPolicyInformation(policy) {
        this.targetId8 = policy.insuranceRequestId;
        this.operationId8 = policy.operationId;
        this.displayCollateralInsuranceForm = true;
    }
    //#endregion

    //#region projectSite
    getProjectSiteReportApproval() {
        this.loadingService.show();
        this.psrService.getProjectSiteReportApproval().subscribe((response) => {
        this.ProjectSiteReports = response.result;
        this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showPsrReport(d) {
        this.loadingService.show();
        let data = {
            projectSiteReportId: d.projectSiteReportId,
            psrReportTypeId: d.psrReportTypeId
        }
        this.psrService.psrReport(data).subscribe((response) => {
            let path = response.result;
            this.projectReportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        });
        this.loadingService.hide(1000);
        this.displayProjectSiteReport = true;
    }

    showPsrDetail(d) {
        this.targetId5 = d.projectSiteReportId;
        this.psrReportTypeId = d.psrReportTypeId;
        this.activeTabindex5 = 1;
        this.operationId5 = d.operationId;
        this.showProjectSiteDetail = true;
        this.refreshGrid(this.targetId5);
    }

    myAnalysisDetail(d) {
        this.analysisDetail = d;
        this.showAnalysisDetail = true;
        this.showInput = false;
    }

    refreshGrid(targetid: number) {
        if(targetid <= 0){
            return;
        }
        this.getCommentReport(targetid);
        this.getObservationReport(targetid);
        this.getRecommendationReport(targetid);
        this.getTaskReport(targetid);
        this.getPsrPerformanceEvaluation(targetid);
        this.getPsrPerformanceAnalysis(targetid);
    }
    
    getCommentReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrComments(projectSiteReportId).subscribe((response) => {
            this.commentReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getObservationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrObservations(projectSiteReportId).subscribe((response) => {
            this.observationReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getRecommendationReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrRecommendations(projectSiteReportId).subscribe((response) => {
            this.recommendationReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getTaskReport(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrNextInspectionTasks(projectSiteReportId).subscribe((response) => {
            this.taskReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getPsrPerformanceEvaluation(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceEvaluations(projectSiteReportId).subscribe((response) => {
            this.performanceEvaluationsReport = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getPsrPerformanceAnalysis(projectSiteReportId) {
        this.loadingService.show();
        this.psrService.getPsrPerformanceAnalysis(projectSiteReportId).subscribe((response) => {
            this.performanceAnalysisReport = response.result;
            this.performanceAnalysisReportCount = this.performanceAnalysisReport.length;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewPerformanceEvaluationsDetail(d) {
        this.evaluationDetail = d;
    }
    //#endregion

    

   

    submitForm(form) { 
        this.searchString = form.value.searchString;
          this.loadingService.show();
          this.subscriptions.add(
            this.loanService.getLoanOperationDocumentationLosApprovalSearch(this.searchString).subscribe((response) => {
            this.loanOperationApprovalData = response.result;
              this.loadingService.hide();
              this.displaySearchForm = false;
          }, (err: HttpErrorResponse) => {
              swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
              this.loadingService.hide(1000);
          }));
      }



}