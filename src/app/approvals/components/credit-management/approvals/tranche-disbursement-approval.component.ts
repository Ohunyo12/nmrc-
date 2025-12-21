import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccordionModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CreditApprovalService } from '../../../../credit/services/credit-approval.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoanService } from '../../../../credit/services/loan.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ProductTypeEnum, ApprovalStatus } from '../../../../shared/constant/app.constant';
import { CustomerInformationDetailComponent } from '../../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { saveAs } from 'file-saver';
import { CollateralInformationViewComponent } from 'app/credit/collateral/information/collateral-information-view.component';
import { CreditAppraisalService } from 'app/credit/services';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { ConditionChecklistComponent } from 'app/credit/loans/loan-checklist/condition-checklist.component';
import { CollateralService } from 'app/setup/services/collateral.service';
import { StaffRoleService } from 'app/setup/services';
import { ProductService } from 'app/setup/services/product.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { isNullOrUndefined } from 'util';
import { LoanApplicationDetailsViewComponent } from 'app/credit/loans/loan-application-details-view/loan-application-details-view.component';
enum JobAllocationStatusEnum {
    RoundRobin = 1,
    SBUROUTING = 2,
    POOL = 3
}


@Component({
    selector: 'tranche-disbursement-approval',
    templateUrl: 'tranche-disbursement-approval.component.html'
})

export class TrancheDisbursementApprovalComponent implements OnInit {
    workflowTargets: WorkflowTarget[] = [];
    workflowTarget: WorkflowTarget = new WorkflowTarget();

    isPoolRequest: boolean;
    isSBURouting: boolean;
    isRounRobin: boolean;

    id: any;
    projectRiskRatingComputation: any[] = [];
    isContigent: boolean = false;
    sendButtonText: string;
    approvers: any[] = [];
    approversCount: any;
    loanApplId: any;
    loanApprovalData: any[] = [];
    assignedApplications: any[] = [];
    contingentLoanApprovalData: any[] = [];
    revolvingLoanApprovalData: any[] = [];
    loanApplicationDetailId: any;
    displayLoanToApproveModal: boolean = false;
    loanSelectedData: any = {};
    loanSelection: any;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    insurancePolicies: any[];
    activeIndex = 0;
    readonly OPERATION_ID: number = 6;
    readonly creditAppraisalComment: string = "CREDIT APPROVAL COMMENTS";
    readonly drawdownComment: string = "DRAWDOWN COMMENTS";
    readonly CREDITAPPRIASALDOC: string = "CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string = "DRAWDOWN DOCUMENTS";

    displayLoanToApproveModal2: boolean = true;
    ContingentLoanApprovalData: any[] = [];
    operationIds = [39, 98, 141];
    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;
    displayTestReport: boolean = false;
    displayReport: boolean = false;
    requiredDocumentsUploadSatisfied: boolean = false;
    // file upload
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    documentations: any[] = [];
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;
    isCRMSstaff: any;
    appraisalOperationId: any;
    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;

    @ViewChild(CollateralInformationViewComponent, {static: false}) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(LoanApplicationDetailsViewComponent, {static: false}) loanInfo: LoanApplicationDetailsViewComponent;
    showCollateralInformation: boolean = false;
    collateralCustomerId: any;
    reload: number = 0;
    displayDocumentation: boolean;
    isMultipleDrawdown: boolean;
    drawdownFacilitiesInformation: any[] = [];
    referBackForm: FormGroup;
    approvalForm: FormGroup;
    generalInputForm: FormGroup;
    displayReferBackForm: boolean = false;
    displayApprovalForm: boolean = false;
    drawdownHtml: any;
    cashBackMemoHtml: any;
    drawdownDeferralHtml: any;

    documentProvided: boolean = null;
    isLienPlacementForLoan: boolean = false;
    allAreLiensPLaced = false;
    loanData: any;
    uploadCount: number;


    autoZIndex: boolean = true;
    panel: boolean = false;
    label: string = '';
    deleteLink: boolean = true;
    documentDates: boolean = false;
    panelTitle: string = "Document Uploads";
    showUploadForm: boolean = true;
    showUploadGrid: boolean = true;

    customerId: number;
    customerGroupId: number;
    targetReferenceNumber: string = ''; // OR code
    showRequiredDocumentTypes = false;

    productIds: number[] = [];
    productClassIds: number[] = [];
    sectorIds: number[] = [];
    subSectorIds: number[] = [];
    documentCategories: any[] = [];
    documentTypes: any[] = [];


    formState: string = 'New';
    selectedId: number = null;

    documentUploads: any[] = [];
    creditDocumentUploads: any[] = [];
    documentUploadForm: FormGroup;
    displayDocumentUploadForm: boolean = false;
    productDocumentMappingsData: any[] = [];
    requiredDocumentTypes: any[] = [];
    requiredDocumentTypes2: any[] = [];
    numberOfRequiredDocumentTypes = 0;
    documentDeleted: any[] = [];

    fileDocument: any;
    myPdfFile: any;
    apiRequestId: any;
    loanSource: string;
    isUserLegal: boolean = false;
    

    rating: number = 0;
    computation: number = 0;
    riskCategorisation: number = 0;
    projectLocation: string = "";
    projectDetails: string = "";
    customerTier: any;
    displayMoreInsuranceInformationDetails: boolean;
    insuranceinformation: any;
   

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanService: LoanService, private genSetupService: GeneralSetupService,
        private creditApprovalService: CreditApprovalService, private router: Router,
        private approvalService: ApprovalService, private camService: CreditAppraisalService,
        private collateralService: CollateralService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
        private loanBookingService: LoanService,
        private staffRole: StaffRoleService,
        private loanAppService: LoanApplicationService,
        private productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.loadUserInfo();
        this.getInitiatedLoansAwaitingApproval();
        this.getAllApprovalStatus();
        this.showConfirmReferDialog();
        this.showApprovalForm();
        this.clearControls();


    }

    loadUserInfo() {
        this.loadingService.show();
        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
            this.loadingService.hide();
            this.staffRoleRecord = res.result;
            
            if (this.staffRoleRecord.staffRoleShortCode == 'LEGAL') {
                this.documentProvided = false;
                this.isUserLegal = true;
            }
            else {
                this.isUserLegal = false;
            }

            if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
                this.userIsAccountOfficer = true;
            }
            if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
                this.userIsRelationshipManager = true;
            }

            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.SBUROUTING) { this.isSBURouting = true; }

            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.RoundRobin) { this.isRounRobin = true; }

            if (this.staffRoleRecord.allocationTypeId == JobAllocationStatusEnum.POOL) { this.isPoolRequest = true; }
        });

    }

    displayConfirmlog() {
        throw new Error("Method not implemented.");
    }

    printOfferLetter() {
  const iframe = document.getElementById('report') as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
     }
    }


    getInitiatedLoansAwaitingApproval() {
        this.loadingService.show();
        this.loanService.getInitiatedLoansAwaitingApproval().subscribe((response: any) => {
            this.loanApprovalData = response.result;
            if (this.isPoolRequest == true) {
                this.assignedApplications = this.loanApprovalData.filter(x => x.toStaffId != null);
                if (this.assignedApplications.length > 0) this.assignedApplications.slice;

                // COMMENT IF YOU NEED TO SHOW ASSIGNED JOBS ON GENERAL POOL
                this.loanApprovalData = this.loanApprovalData.filter(x => x.toStaffId == null);
            }

            if (this.isPoolRequest == false || this.isPoolRequest == null) {
                this.assignedApplications = this.loanApprovalData;
                if (this.assignedApplications.length > 0) { this.assignedApplications.slice; }
            }
            if (this.loanApprovalData.length > 0) this.loanApprovalData.slice;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.loadingService.show();
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            this.loadingService.hide();
            const tempData = response.result;
            if (tempData != null && tempData != undefined) {
                this.approvalStatusData = tempData.slice(2, 4);
            }
        });
    }

    hidePreviousModal() {
        this.displayLoanToApproveModal = false;
    }

    getAllProjectRiskRatingComputation(loanApplicationId, loanApplicationDetailId, loanBookingRequestId): void {
        this.loadingService.show();
        this.camService.getAllProjectRiskRatingComputation(loanApplicationId, loanApplicationDetailId).subscribe((response: any) => {
            this.loadingService.hide();
            this.projectRiskRatingComputation = response.result;
            if (!isNullOrUndefined(this.projectRiskRatingComputation) && this.projectRiskRatingComputation.length > 0) {
                this.computation = this.projectRiskRatingComputation[0].computation;
                this.customerTier = this.projectRiskRatingComputation[0].customerTier;
                this.riskCategorisation = this.projectRiskRatingComputation[0].riskCategorisation;
                this.projectLocation = this.projectRiskRatingComputation[0].projectLocation;
                this.projectDetails = this.projectRiskRatingComputation[0].projectDetails;
                if (this.customerTier >= 80) {
                    this.rating = 25;
                } else if (this.customerTier >= 60 && this.customerTier <= 79) {
                    this.rating = 20;
                } else {
                    this.rating = 10;
                }
            }

        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    pushSelectedLoans(row) {
        if (row.data.customerAvailableAmount == 0) {
            swal('', 'Available amount is zero. Loan may have been booked and currently undergoing approval', 'info');
            return;
        }
        if (row.data.expiryDate != null && (row.data.expiryDate <= row.data.systemCurrentDate)
            && row.data.productTypeId == ProductTypeEnum.CommercialLoans) {
            swal('', 'The selected Commercial Loan tenor has expired', 'info');
            return;
        }
        this.drawdownFacilitiesInformation.push(row.data);
        this.loanSelection = this.drawdownFacilitiesInformation;

    }

    popSelectedLoans(row) {
        var record = row.data;
        var index = this.drawdownFacilitiesInformation.findIndex(x => x.loanApplicationDetailId == record.loanApplicationDetailId)
        this.drawdownFacilitiesInformation.splice(index, 1);
        if (this.drawdownFacilitiesInformation.length <= 0) {
            //this.showProceedButtton =false;
        }

    }

    getStaffActivity(activity) {
        this.camService.getStaffActivity(activity).subscribe((response: any) => {
            this.isCRMSstaff = response.result;
        });
    }
    timeAgo(time) {
        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }
        var time_formats = [
            [60, 'seconds', 1], // 60
            [120, '1 minute ago', '1 minute from now'], // 60*2
            [3600, 'minutes', 60], // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'], // 60*60*2
            [86400, 'hours', 3600], // 60*60*24, 60*60
            [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
            [604800, 'days', 86400], // 60*60*24*7, 60*60*24
            [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
            [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
            [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
            [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;
        if (seconds == 0) {
            return 'Just now'
        }
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }
        var i = 0, format;
        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    }

    resetButton(value) {
        let indx = this.approvers.findIndex(x => x.staffId == this.loanSelectedData.staffId)
        switch (indx) {
            case 0:
                if (value == 2) { ////console.log('approved @', indx)
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Initiate Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Initiate Overdraft";
                    }
                    else {
                        this.sendButtonText = "Initiate Disbursement";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
            case 1:
                if (value == 2) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Approve Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Approve Overdraft";
                    }
                    else {
                        this.sendButtonText = "Approve Disbursement";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
            case 2:
                if (value == 2) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Commit Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Submit Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disburse Loan";
                    }
                }
                else if (value == 3) {
                    if (this.loanSelectedData.isBidbond) {
                        this.sendButtonText = "Disapprove Contract";
                    }
                    else if (this.loanSelectedData.isOverdraft) {
                        this.sendButtonText = "Disapprove Overdraft";
                    }
                    else {
                        this.sendButtonText = "Disapprove Loan";
                    }
                }
                break;
        }
    }
    loanSystemTypeId: any;
    isLms: boolean = false;
    loanId: any;
    bookingOperationId: any;
    operationId: number;
    targetId: number;

    // setDisplayModalValues(value) {
    //     this.displayLoanToApproveModal = value;
    // }

    onSelectedLoanChange(rowData): any {
        this.displayLoanToApproveModal2 = false;
        this.displayLoanToApproveModal = true;
        this.setLienPlacementForLoan(rowData.data.loanCollateral);
        this.loanData = rowData.data;
        this.loanSelectedData = rowData.data;
        this.getAllProjectRiskRatingComputation(this.loanSelectedData.loanApplicationId, this.loanSelectedData.loanApplicationDetailId, this.loanSelectedData.loanBookingRequestId);
        this.loanSelectedData = this.loanSelection;
        this.loanApplicationDetailId = this.loanSelectedData.loanApplicationDetailId;
        this.appraisalOperationId = this.loanSelectedData.appraisalOperationId;
        this.getLoanMonitoringTriggerByID(this.loanSelectedData.loanApplicationDetailId);
        this.loanApplId = this.loanSelectedData.loanApplicationId;
        this.operationId = this.loanSelection.operationId,
            this.customerId = this.loanSelectedData.customerId,
            this.bookingOperationId = this.loanSelection.bookingOperationId,
            this.targetId = this.loanSelection.loanBookingRequestId,
            this.isLms = false;

        this.loanId = this.loanSelectedData.loanApplicationDetailId;
        this.apiRequestId = this.loanSelectedData.apiRequestId;

        this.getCreditDocumentsByTarget(this.appraisalOperationId, this.loanApplId);
        this.getLoanApplicationCollateral(this.loanSelectedData.loanApplicationId)

        this.loanService.getApprovalTrailByOperation(this.loanSelectedData.operationId, this.loanSelectedData.loanBookingRequestId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });

        this.previewDocumentation(false);
        this.popoverSeeMore();
        this.loanService.getLoanApprovers(this.loanSelectedData.operationId).subscribe((response: any) => {
            this.approvers = response.result;
            this.approversCount = this.approvers.length;
            let indx = this.approvers.findIndex(x => x.staffId == this.loanSelectedData.staffId);
        });

        this.getStaffActivity('crms-user');
        this.getReferBackTrail();
        this.getDrawdownMemoHtml(rowData.data.loanBookingRequestId);
        this.getCashBackMemoHtml(rowData.data.appraisalOperationId, rowData.data.loanApplicationDetailId);


        this.getDocumentCategories();
        this.getDocumentsByTarget();
        this.getProductIds();
        this.getDeletedDocumentsByTarget();
        

        if (this.apiRequestId == null) {
            this.loanSource = "Credit360 Portal";
        }
        else {
            this.loanSource = "Cashflow Portal";
        }
        this.customerInfo.viewSingleCustomerDetails(this.loanSelectedData.customerId);
    }


    captureScreen() {
        this.displayTestReport = true;
        this.displayReport = true;
        let path = '';
        this.loanService.getDrawdownMemoPdf(this.loanSelection.applicationReferenceNumber).subscribe((response: any) => {
            path = response.result;
            this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        });
        return;
    }

    setLienPlacementForLoan(loanCollaterals: any[]) {
        if (loanCollaterals != null) {
            if (loanCollaterals.length > 0) {
                loanCollaterals.forEach(item => {
                    if (item.collateralTypeName == "Fixed Deposit") {
                        this.isLienPlacementForLoan = true;
                    }
                });
            }
        }
    }


    displayStatus(e) {
        if (e == true) {
            this.displayReferBackForm = false;
        }
    }

    userIsAccountOfficer = false;
    staffRoleRecord: any;
    userIsRelationshipManager = false;


    referBackResultControl(event) {
        if (event == true) {
            this.getInitiatedLoansAwaitingApproval();
            this.displayReferBackForm = false;
            this.displayLoanToApproveModal = false;
        }
    }

    viewDocument(data, evt) {

    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanSelection.loanCollateral = data.result;
        }, err => { });
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }


    previewDocumentation(print = false) {
        this.loadingService.show();
        this.camService.getDocumentation(6, this.loanSelection.loanApplicationId).subscribe((response: any) => {
            this.documentations = response.result;

            if (this.documentations != undefined) {
                if (this.documentations.length > 0) { this.documentations.slice; }
            }

            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
            else setTimeout(() => this.print(), 5000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    printMemo(): void {
        let printTitle = 'DRAWDOWN MEMO';
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
        //empty your array
        this.drawdownHtml = null;
        this.loanData = null;
        this.loanSelectedData = {};
        this.displayLoanToApproveModal = false;
        this.displayLoanToApproveModal2 = true;
    }


    closeDrawdown() {
        this.empty();
    }
    reportSrc: SafeResourceUrl;
    popoverSeeMore() {
        if (this.loanSelection.applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: this.loanSelection.applicationReferenceNumber,

            }

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            });

            return;
        }
    }

    @ViewChild(forwardRef(() => ConditionChecklistComponent), {static: false}) conditionChecklist: ConditionChecklistComponent;
    offerLetterChecklist() {
        this.conditionChecklist.viewOfferLetterChecklist(this.loanSelection.loanApplicationId);

    }

    workingLoanApplication: string = null;
    print(): void {
        let printTitle = 'CREDIT APPRAISAL - ' + this.workingLoanApplication;
        let printContents, popupWin;

        let content = '<div class="row">';
        this.documentations.forEach(x => {
            content = content + `<div class="col-md-12"><p><strong>${x.title}</strong></p><p><span>${x.templateDocument}</span></p></div>`;
        });
        content = content + '</div>';

        printContents = content;// document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title>${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }

    DownloadDocument(d) {

    }
    //looking for
    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval() {
        
        let loading = this.loadingService;

        let bodyObj = {
            targetId: this.loanSelectedData.loanBookingRequestId,
            approvalStatusId: this.approvalForm.controls['approvalStatusId'].value,
            comment: this.approvalForm.controls['comment'].value,
            operationId: this.loanSelectedData.operationId,
            isFromPc: true,
            documentProvided: this.documentProvided
        };

        loading.showKeyApiCall();
        this.creditApprovalService.approveInitiatedLoanBookingRequest(bodyObj, this.loanSelectedData.loanBookingRequestId).subscribe((response: any) => {
            loading.hideKeyApiCall();
            if (response.success == true) {
                // this.displayApplicationStatusMessage(response.result);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.getInitiatedLoansAwaitingApproval();
                this.displayApprovalForm = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
            }
            this.displayLoanToApproveModal = false;
            this.displayLoanToApproveModal2 = true;
            this.displayConfirmDialog = false;
        }, (err) => {
            loading.hideKeyApiCall(1000);
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    setLegalDocumentStatusForLineFacility(evt) {
        evt = evt.target.checked;
        let loading = this.loadingService;
        let bodyObj = {
            targetId: this.loanSelectedData.loanBookingRequestId,
        };
        loading.show();
        this.creditApprovalService.setLegalDocumentStatusForLineFacility(this.loanSelectedData.loanBookingRequestId, evt, bodyObj).subscribe((response: any) => {
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loanSelection.documentProvided = evt;
                loading.hide();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                loading.hide();
            }
        }, (err) => {
            loading.hide(1000);
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });



    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}</strong>`, 'success');
        else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }



    displayShowCustInfo: boolean;
    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanApplId);
        this.displayShowCustInfo = true;
    }

    getLoanMonitoringTriggerByID(loanApplicationDetailId: number) {
        this.loanService.getLoanMonitoringTriggerByID(loanApplicationDetailId).subscribe((data) => {
            this.loanSelectedData.monitoringTriggers = data.result;
        }, err => { });
    }
    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayLoanToApproveModal = false;
        this.displayLoanToApproveModal2 = true;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayLoanToApproveModal = false;
        this.displayLoanToApproveModal2 = true;
    }


    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 3) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    showReferBackForm() {
        this.referBackForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],

        });
        this.displayReferBackForm = true;
    }


    showApprovalForm(init = true) {
        this.approvalForm = this.fb.group({
            comment: ['', Validators.required],
            approvalStatusId: ['', Validators.required],
            documentProvided: ['']

        });
        if (!init) {
            this.displayApprovalForm = true;
        }
    }



    showConfirmReferDialog(init = true) {
        this.referBackForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],

        });
        if (!init) {
            this.displayReferBackForm = true;
        }
    }

    trailApprovalLevels: any;
    getReferBackTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.loanSelectedData.loanBookingRequestId, this.loanSelectedData.operationId).subscribe((response: any) => {
            if (response.success) {
                this.trailApprovalLevels = response.result;
                this.loadingService.hide();
                //console.log(this.trailApprovalLevels);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    decideMovement() {
        if (this.displayApprovalForm == true) {
            this.goForApproval();
        } else if (this.displayReferBackForm == true) {
            this.returnBack();
        }
    }

    returnBack() {
        const target = {
            operationId: this.loanSelectedData.operationId,
            targetId: this.loanSelectedData.loanApplicationId,
            comment: this.referBackForm.value.comment,
            approvalLevelId: this.referBackForm.value.approvalLevelId
        };

        this.loadingService.show();

        this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                this.getInitiatedLoansAwaitingApproval();
                this.displayReferBackForm = false;
                this.displayConfirmDialog = false;
                this.displayLoanToApproveModal = false;
                this.displayLoanToApproveModal2 = true;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    getDrawdownMemoHtml(targetId) {
        this.camService.getDrawdownMemoHtml(targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.drawdownHtml = response.result;
        }, (err) => {

        });
    }

    getCashBackMemoHtml(operationId, targetId) {
        this.camService.getCashBackMemoHtml(operationId, targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.cashBackMemoHtml = response.result;
        }, (err) => {

        });
    }

    getDrawdownMemo(operationId, targetId) {
        this.camService.getDrawdownMemo(operationId, targetId).subscribe((response: any) => {
            if (response.result == null) return;
            this.drawdownDeferralHtml = response.result;
        }, (err) => {

        });
    }

    lienIsSatisfied(event) {
        // console.log('lien event', event);
        this.allAreLiensPLaced = event;
    }


    // ===============================================================================================


    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }


    getDocumentTypesByCategory(id) {
        // console.log(id);
        this.camService.getDocumentTypesByCategory(id).subscribe((response: any) => {
            // console.log(response);

            this.documentTypes = response.result;
        });
    }

    getDocumentCategories() {
        this.camService.getDocumentCategories().subscribe((response: any) => {
            this.documentCategories = response.result;
            // console.log(this.documentCategories);
        });
    }

    getProductIds() {
        this.loanAppService.loanApplicationDetailsByReference(this.loanSelectedData.applicationReferenceNumber).subscribe((response: any) => {

            this.productIds = [];
            this.productClassIds = [];
            this.sectorIds = [];
            this.subSectorIds = [];
            if (response.count > 0) {
                for (var detail of response.result) {
                    this.productClassIds.push(detail.productClassId);
                    this.productIds.push(detail.approvedProductId);
                    this.sectorIds.push(detail.sectorId);
                    this.subSectorIds.push(detail.subSectorId);

                }
                this.getAllProductDocumentMappings();
            }
        });
    }

    getAllProductDocumentMappings() {

        this.showRequiredDocumentTypes = false;
        this.loadingService.show();
        this.productService.getAllProductDocumentMappings().subscribe((response: any) => {
            this.loadingService.hide();
            this.productDocumentMappingsData = response.result;
            this.validateRequiredUpload();
            // if (this.requiredDocumentTypes.length > 0) {
            this.showRequiredDocumentTypes = true;
            //}

        });
    }

    validateRequiredUpload() {
        this.productIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m => m.mapToProduct == true && m.productId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m => m.mapToProduct == true && m.productId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.productClassIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m => m.mapToProductClass == true && m.productClassId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m => m.mapToProductClass == true && m.productClassId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.sectorIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m => m.mapToSector == true && m.sectorId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m => m.mapToSector == true && m.sectorId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.subSectorIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m => m.mapToSubSector == true && m.subSectorId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m => m.mapToSubSector == true && m.subSectorId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });


    }


    documentIsUploaded(documentTypeId): string {

        if (this.documentUploads == undefined || this.documentUploads == null || this.documentUploads.length <= 0) {
            return '<span class="label label-info">No</span>';
        }
        return (this.documentUploads.findIndex(d => d.documentTypeId == documentTypeId) == -1) ? '<span class="label label-info">No</span>' : '<span class="label label-success">Yes</span>';
    }


    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    // ------------------- api-calls --------------------

    saveDocumentUpload(form, overwrite = false) {

        let body = {
            fileName: this.file.name,
            fileExtension: this.fileExtention(this.file.name),
            fileSize: this.file.size,
            issueDate: form.value.issueDate,
            expiryDate: form.value.expiryDate,
            documentTypeId: form.value.documentTypeId,
            fileSizeUnit: 'kilobyte',

            operationId: this.operationId,
            customerGroupId: this.customerGroupId == null ? 0 : this.customerGroupId,
            customerId: this.customerId == null ? 0 : this.customerId,
            targetId: this.loanSelectedData.loanApplicationDetailId,
            targetReferenceNumber: this.loanSelectedData.applicationReferenceNumber, // or targetCode: this.targetCode,

            // documentCode: form.value.documentCode,
            // documentTitle: form.value.documentTitle,
            overwrite: overwrite
        };


        this.loadingService.show();
        if (this.selectedId === null) {
            this.camService.uploadDocument(this.file, body).then((response: any) => {
                this.loadingService.hide();
                if (response.result == 3) {
                    this.confirmOverwrite();
                } else {
                    if (response.success == true) this.reloadGrid();
                    else this.finishBad(response.message);
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.camService.updateDocument(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) {


                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.reloadGrid();
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    confirmOverwrite(): void {
        const __this = this;
        swal({
            title: 'File already exist!',
            text: 'Are you sure you want to OVERWRITE it?',
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
            __this.saveDocumentUpload(__this.documentUploadForm, true);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    getCreditDocumentsByTarget(appraisalOperationId, loanApplId) {
        this.camService.getDocumentsByTarget(appraisalOperationId, loanApplId, false).subscribe((response: any) => {
            this.creditDocumentUploads = response.result;
            this.uploadCount = response.result.length;

        });
    }

    getDocumentsByTarget() {
        if (this.operationId == undefined || this.loanId == undefined) {
            return;
        }

        this.camService.getDocumentsByTarget(this.loanSelectedData.appraisalOperationId, this.loanApplId, false).subscribe((response: any) => {
            this.documentUploads = response.result;
            this.uploadCount = response.result.length;
        });
    }

    getDeletedDocumentsByTarget() {
        this.camService.getDeletedDocumentsByTarget(this.operationId, this.loanId).subscribe((response: any) => {
            this.documentDeleted = response.result;
            this.uploadCount = response.result.length;

        });
    }


    deleteDocumentUpload(row) {
        const __this = this;
        swal({
            title: 'File DELETE operation!',
            text: 'Are you sure you want to DELETE the file ' + row.fileName + '?',
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
            __this.camService.deleteDocument(row.documentUploadId, row.documentTypeName).subscribe((response: any) => {
                __this.reloadGrid();
                __this.loadingService.hide();
            }, (err: any) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
                __this.loadingService.hide();
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }



    reloadGrid() {
        this.clearControls();
        this.getDocumentsByTarget();
        this.getDeletedDocumentsByTarget();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.documentUploadForm = this.fb.group({
            fileName: [''],
            fileExtension: [''],
            fileSize: [''],
            fileSizeUnit: [''],
            fileData: ['', Validators.required],
            issueDate: [''],
            expiryDate: [''],
            physicalFilenumber: [''],
            physicalLocation: [''],
            documentTypeId: ['', Validators.required],
            documentCategoryId: ['', Validators.required]
            // requiredDocumentId:['', Validators.required]
        });

        this.generalInputForm = this.fb.group({
            documentProvided: ['']

        });
    }


    showDocumentUploadForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayDocumentUploadForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; any; cssClass: any;

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

    // getDocumentType() {
    //     this.creditAppraisalService.getDocumentType().subscribe((response: any) => {
    //         this.documentType = response.result;
    //     });
    // }



    downloadDocument(row, view = false) {

        this.fileDocument = null;
        this.loadingService.show();
        this.camService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;

            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.fileName;

                if (view) {
                    //this.displayLoanToApproveModal = false;
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

    downloadDocumentCreditBereau(row, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.camService.downloadDocumentCreditBereau(row.documentUploadId).subscribe((response: any) => {
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

    checkIfRequiredDocumentsAreUploaded() {
        let numberRequiredDocsNotuploaded = 0;
        if (this.requiredDocumentTypes == undefined || this.requiredDocumentTypes == null || this.requiredDocumentTypes.length <= 0) {
            this.requiredDocumentsUploadSatisfied = true;
            // console.log('undefined/null/length<=0');
            return;
        }
        this.requiredDocumentTypes.forEach((m) => {
            if (this.documentUploads == null || this.documentUploads == undefined) {
                return;
            }
            if (m.required == true && this.documentUploads.findIndex(d => d.documentTypeId == m.documentTypeId) == -1) {
                //required document is not uploaded
                ++numberRequiredDocsNotuploaded;
            }
        });
        this.requiredDocumentsUploadSatisfied = numberRequiredDocsNotuploaded == 0;
        return;
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
    approvalStatusId: any;
    pushSelectedPendingLoanRequests(row) {
        this.approvalStatusId = record.approvalStatusId;
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
        this.approvalStatusId = record.approvalStatusId;
        var index = this.workflowTargets.findIndex(x => x.targetId == record.loanApplicationDetailId);
        // console.log('workflowTargets',this.workflowTargets);
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


        this.assignedApplications.push(assignedList[0]);
        this.assignedApplications = this.assignedApplications;
        this.loanApprovalData = this.loanApprovalData.filter(x => x.toStaffId == null);

        if (this.assignedApplications.length > 0) { this.assignedApplications.slice; }
        if (this.loanApprovalData.length > 0) { this.loanApprovalData.slice; }
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
            __this.camService.assignRequestToSelf(__this.workflowTargets).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.updatePendingData();
                    //__this.displayApproverSearchForm = false;
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


    onReturnToPool(data) {

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
            __this.camService.ReturnTransactionToPool(__this.workflowTargets, data.approvalTrailId).subscribe((result) => {
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

    showLoanInformation() {
        if (this.loanInfo != undefined) {
            this.loanInfo.isRecommendedInfo = true;
            this.loanInfo.loanApplicationDetail = this.loanData;
            this.loanInfo.getLoanDetail(this.loanApplId);
        }
    }

    getCollaterTempItemPolicies(id) {
        this.collateralService.getItemPolicyList(id).subscribe((response: any) => {
            this.insurancePolicies = response.result;
        });
    }
    viewTermSheetDetails(row) {
        this.insuranceinformation = row;
        this.displayMoreInsuranceInformationDetails = true;
    }

}

