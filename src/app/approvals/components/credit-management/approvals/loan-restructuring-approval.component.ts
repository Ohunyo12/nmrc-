import { AdminService } from '../../../../admin/services/admin.service';
import { LoanOperationService } from '../../../../credit/services/loan-operations.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoanService } from '../../../../credit/services/loan.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus, ApprovalStatusEnum, LoanSystemTypeEnum, JobSource } from '../../../../shared/constant/app.constant';
import { AuthorizationService } from '../../../../admin/services';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ReportService } from 'app/reports/service/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LMSOperationEnum } from 'app/shared/constant/app.constant';
import { CreditAppraisalService, LoanReviewApplicationService } from 'app/credit/services';
import { saveAs } from 'file-saver';

import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { Subscription } from 'rxjs';
import { StaffRoleService } from 'app/setup/services';
@Component({
    templateUrl: 'loan-restructuring-approval.component.html'
})

export class LoanRestructuringApprovalComponent implements OnInit {
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    reload: number = 0;
    readonly CREDITAPPRIASALDOC: string ="APPRAISAL DOCUMENTS";
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    displayRestructuringApprovalModal: boolean = false;
    displayRestructuringApprovalModalMain: boolean = true;
    loanOperationApprovalData: any[] = [];

    displaySearchForm: boolean = false;
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
    OverdraftRenewal: boolean = false;
    OverdraftInterestRateReview: boolean = false;
    ContingentLiabilityTermination: boolean = false;
    ContingentLiabilityTenorExtension: boolean = false;
    ContingentLiabilityAmountReduction: boolean = false;
    ContingentLiabilityAmountAddition: boolean = false;
    ContingentLiabilityRenewal: boolean = false;
    ContingentLiabilityRebook: boolean = false;
    CancelContingentLiability: boolean = false;

    OPERATION_ID: number = 46;
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

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    fileDocument: any;
    pdfFile: any;
    pdfFileName: string;
    displayPdf: boolean = false;
    myDocExtention: string;
    pdfData: any;
    fileUrl: string;
    scatterdPayments: any[] = [];
    loanOperationApprovalFees: any[];
    convenatDetails: any[];

    collateralDetails: any[]; // LoanCovenantModel[] = [];;
    guarantorDetails: any[]; // GuarantorAppModel[] = [];
    chargeFeeDetails: any[];
    loanScheduleDetails: any[];
    displayCustomerODDetails: boolean = false;


    displayCommentForm: boolean = false;
    displayReferBackForm = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    searchForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    testModal: boolean = false;
    private subscriptions = new Subscription();
    trail: any[] = [];
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

    warningMessage: string = '';
    touchedLineItems: number[] = [];
    recommendedItems: any[] = [];
    selectedLineId: number;
    enebleFacilityChange: boolean = false;
    proposedItems: any[] = [];
    facilityCount: number = 0;

    errorMessage: string = '';
    loanReviewOperationsId: number;
    show: boolean = false;
    cssClass: any;
    synOperationId: any;
    creditAppraisalLoanApplicationId: number = 0;
    creditAppraisalOperationId: number = 0;
    loanReviewApplicationId: number = 0;
    appraisalOperationId: number = 0;

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private loanApplService: LoanApplicationService,
        private loanOperationService: LoanOperationService, private loanService: LoanService, private genSetupService: GeneralSetupService,
        private approvalService: ApprovalService, private router: Router, private documentpUloadService: DocumentpUloadService,
        private authorizationService: AuthorizationService, private camService: CreditAppraisalService,
        private reportServ: ReportService, private sanitizer: DomSanitizer, private reviewService: LoanReviewApplicationService, private staffRole: StaffRoleService, ) {
    }

    ngOnInit() {
        this.jobSourceId = JobSource.LMSOperationAndApproval;
        this.getAllLoansOperationForApproval();
        this.getAllApprovalStatus();
        this.displayReport = false;
        this.clearControls();
    }
    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    getAllUploadedDocumentLms(operationId, targetId) {
        this.loadingService.show();
        this.documentpUloadService.getAllUploadedDocumentLms(operationId, targetId).subscribe((response: any) => {
            this.supportingDocumentsLms = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    previewDocumentation(print = false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
            this.documentations = response.result;
            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
            else setTimeout(() => this.print(), 1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    previewDocumentationLos(print = false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId).subscribe((response: any) => {
            this.documentations = response.result;
            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    print(): void {
        let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.lmsLoanReferenceNumber;
        let printContents, popupWin;
        let content = '<div class="row">';
        this.documentations.forEach(x => {
          content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
        });
        content = content + '</div>';
      
        printContents = content;// document.getElementById('print-section').innerHTML;
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

    getStaffActivity(activity) {
        this.camService.getStaffActivity(activity).subscribe((response: any) => {
            this.isCRMSstaff = response.result;
        });
    }
    hideAllControl() {
        this.RegulatoryInterestRateChange = false;
        this.SubAllocationOverdraft = false;
        this.PrepaymentChange = false;
        this.PrincipalFrequencyChange = false;
        this.InterestFrequencyChange = false;
        this.InterestandPrincipalFrequencyChange = false;
        this.PaymentDateChange = false;
        this.TenorChange = false;
        this.CASAAccountChange = false;
        this.Overdrafttopup = false;
        this.FeechargeChange = false;
        this.TerminateandRebook = false;
        this.CompleteWriteOff = false;
        this.CancelUndisbursedLoan = false;
        this.Restucture = false;
        this.LoanRecapitalization = false;
        this.isOverDraft = false;


        this.ContingentLiabilityTermination = false;
        this.ContingentLiabilityTenorExtension = false;
        this.ContingentLiabilityAmountReduction = false;
        this.ContingentLiabilityAmountAddition = false;
        this.ContingentLiabilityRenewal = false;
        this.ContingentLiabilityRebook = false;
        this.CancelContingentLiability = false;
    }

    getAllLoansOperationForApproval() {
        this.loadingService.show();
        this.loanOperationService.getAllLoanOperationAwaitingApproval().subscribe((response: any) => {
            this.loanOperationApprovalData = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.finishBad(err);
            this.loadingService.hide(1000);
        });
    }

    searchString: any;
    getAllLoansOperationByLoanReferenceForApproval(form) {
        this.loanOperationApprovalData = [];
        this.searchString = form.value.searchString;
        this.loadingService.show();
        this.loanOperationService.getAllLoanOperationByLoanReferenceAwaitingApproval(this.searchString).subscribe((response: any) => {
            this.loanOperationApprovalData = response.result;
            this.loadingService.hide();
            this.displaySearchForm = false;
        }, (err) => {
            this.finishBad(err);
            this.loadingService.hide(1000);
        });
    }

    getLoanDetail(creditAppraisalLoanApplicationId): void {
        this.reload = 0;
        this.loadingService.show();
        this.camService.getLoanDetail(creditAppraisalLoanApplicationId).subscribe((response: any) => {
            this.proposedItems = response.result.facilities;
            this.facilityCount = response.result.facilities.length;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }



    GetLaonConvenant(loanId) {
        this.loanOperationService.getLoanConvenant(loanId)
            .subscribe(results => {
                this.convenatDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLoanCollateral(loanId) {
        this.loanOperationService.getLoanCollateralByLoan(loanId)
            .subscribe(results => {
                this.collateralDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLaonChargeFee(loanId) {
        this.loanOperationService.getLoanChargeFee(loanId)
            .subscribe(results => {
                this.chargeFeeDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLaonConvenantOD(loanId, loanType) {
        this.loanOperationService.getLoanConvenantOD(loanId, loanType)
            .subscribe(results => {
                this.convenatDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLoanCollateralOD(loanId, loanType) {
        this.loanOperationService.getLoanCollateralOD(loanId, loanType)
            .subscribe(results => {
                this.collateralDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLaonChargeFeeOD(loanId, loanType) {
        this.loanOperationService.getLoanChargeFeeOD(loanId, loanType)
            .subscribe(results => {
                this.chargeFeeDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    GetLaonScheduleByLoanId(loanId) {
        this.loanOperationService.getLoanScheduleByLoanId(loanId)
            .subscribe(results => {
                this.loanScheduleDetails = results.result;
            });
        this.check(this.loanSelectedData.productTypeId);
    }
    check(productTypeId) {
        if (productTypeId == 6 || productTypeId == 9) {
            this.displayCustomerODDetails = true;

        }
        else {
            this.displayCustomerODDetails = false;

        }
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }
    hasFees: boolean = false;
    terminateRebook: boolean = false;
    showAttachedDocument: boolean = false;
    ammendedAmount: number = 0;


    displayJobrequest = false;

    lmsOperationId: number;
    CallRequestClose() { this.displayJobrequest = false; }
    loanApplDetailId = 0;
    initiateRequest() {
        this.displayJobrequest = true;
    }

    showSearchForm() { this.displaySearchForm = true; }

    viewLoanDetails(row, evt) {
        //this.displayRestructuringApprovalModalMain = false;
        evt.preventDefault();
        this.hideAllControl();
        this.loanSelectedData = {};
        this.loanSelectedData = row;
        this.getLoanDetail(row.creditAppraisalLoanApplicationId);
        // this.proposedItems = this.proposedItems.find(x => x.loanApplDetailId == this.loanSelectedData.loanApplDetailId);
        this.creditAppraisalLoanApplicationId = this.loanSelectedData.creditAppraisalLoanApplicationId;
        this.creditAppraisalOperationId = this.loanSelectedData.creditAppraisalOperationId;
        this.loanSelectedData.approvalStatusId = "";
        // this.synOperationId = this.loanSelectedData.synOperationId;
        this.loanReviewOperationsId = this.loanSelectedData.loanReviewOperationsId;
       // this.getAllUploadedDocumentLms(row.lmsOperationId, row.lmsLoanApplicationId)
        let dataObj = this.loanSelectedData;
        this.loanApplDetailId = dataObj.lmsLoanApplicationId;
        this.synOperationId = dataObj.lmsOperationId;
        this.getTrail();
        // this.approvalService.getApprovalTrailByOperation(this.loanSelectedData.lmsOperationId, this.loanSelectedData.lmsLoanApplicationId).subscribe((res) => {
        //     this.approvalWorkflowData = res.result;
        // });

        this.lmsLoanReferenceNumber = this.loanSelectedData.lmsLoanReferenceNumber;


        //this.loadOriginalForm3800BTemplate(this.lmsLoanReferenceNumber)
        // this.form3800b(this.lmsLoanReferenceNumber)
        // this.loadOriginalForm3800BTemplate(this.lmsLoanReferenceNumber)

        this.selectedloanReviewApplicationId = this.loanSelectedData.loanReviewApplicationId;
        this.loanApplDetailId = this.loanSelectedData.loanReviewApplicationId;


        let facilityType = this.loanSelectedData.loanSystemTypeId;
        this.loanSystemTypeId = facilityType;
        this.loanId = dataObj.loanId;
        this.isLms = true;
        this.loanOperationApprovalFees = this.loanSelectedData.fees;
        this.showAttachedDocument = false;
        //console.log(this.loanSelectedData.fees.length);
        if (this.loanSelectedData.fees.length > 0) {
            this.hasFees = true;
        } else {
            this.hasFees = false;
        }


        //let loantype = 0;
        if (facilityType == LoanSystemTypeEnum.ContingentFacility) {
            this.contingentFacility = true;
            this.GetLaonConvenantOD(this.loanId, facilityType);
            this.GetLoanCollateralOD(this.loanId, facilityType);
            this.GetLaonChargeFeeOD(this.loanId, facilityType);
            this.GetLaonScheduleByLoanId(this.loanId);
        }
        else {
            this.contingentFacility = false;
            if (facilityType == LoanSystemTypeEnum.TermDisbursedFacility) {
                this.GetLaonConvenant(this.loanId);
                this.GetLoanCollateral(this.loanId);
                this.GetLaonChargeFee(this.loanId);
                this.GetLaonScheduleByLoanId(this.loanId);
            }
            else if (facilityType == LoanSystemTypeEnum.OverdraftFacility) {

            }
        }

        //console.log('this.loanSelectedData.operationTypeId', this.loanSelectedData.operationTypeId);
        let event = this.loanSelectedData.operationTypeId;
        this.lmsOperationId = this.loanSelectedData.operationTypeId;

        let type = this.loanSelectedData.scheduleDayInterestTypeId;
        if (type = 0) {
            this.type = "First Day Interest";
        }
        else {
            this.type = "Second Day Interest";
        }
        if (event == LMSOperationEnum.ContingentLiabilityRebook || event == LMSOperationEnum.CancelContingentLiability) {
            this.terminateRebook = true;
        }
        else {
            this.terminateRebook = false;
        }
        if (event == LMSOperationEnum.InterestRateChange) {
            this.RegulatoryInterestRateChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 19', event);
        }
        else if (event == LMSOperationEnum.Prepayment) {
            this.PrepaymentChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 21', event);
        }
        // else if (event == LMSOperationEnum.PrincipalFrequencyChange)
        // {
        //     this.PrincipalFrequencyChange = true;
        //     ////console.log('this.event 22', event);
        // }
        else if (event == LMSOperationEnum.InterestFrequencyChange) {
            this.InterestFrequencyChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 23', event);
        }
        else if (event == LMSOperationEnum.InterestAndPrincipalFrequencyChange) {
            this.InterestandPrincipalFrequencyChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 24', event);
        }
        else if (event == LMSOperationEnum.PaymentDateChange) {
            this.PaymentDateChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 25', event);
        }
        else if (event == LMSOperationEnum.TenorExtension) {
            this.TenorChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 26', event);
        }
        else if (event == LMSOperationEnum.ChangeRepaymentAccount) {
            this.CASAAccountChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 27', event);
        }
        else if (event == LMSOperationEnum.OverdraftTopup) {
            this.Overdrafttopup = true;
            this.isOverDraft = true;
            ////console.log('this.event 28', event);
        }
        else if (event == LMSOperationEnum.FeeChargeChange) {
            this.FeechargeChange = true;
            this.isOverDraft = false;

            ////console.log('this.event 29', event);
        }
        else if (event == LMSOperationEnum.Restructure) {
            this.Restucture = true;
            this.isOverDraft = false;

            ////console.log('this.event 51', event);
        }
        else if (event == LMSOperationEnum.LoanRecapitilization) {
            this.LoanRecapitalization = true;
            this.isOverDraft = false;

            ////console.log('this.event 59', event);
        }
        else if (event == LMSOperationEnum.OverdraftTenorExtension) {
            this.OverdraftTenorExtension = true;
            this.isOverDraft = true;

        }
        else if (event == LMSOperationEnum.OverdraftSubAllocation) {
            this.OverdraftSubAllocation = true;
            this.isOverDraft = true;

        }
        else if (event == LMSOperationEnum.OverdraftRenewal) {
            this.OverdraftRenewal = true;
            this.isOverDraft = true;

        }
        else if (event == LMSOperationEnum.OverdraftInterestRateReview) {
            this.OverdraftInterestRateReview = true;
            this.isOverDraft = true;

        }
        else if (event == LMSOperationEnum.LoanWorkOut) {
            this.getLoanReviewOperationIrregularSchedule(row.loanReviewOperationsId); // TODO
            this.Others = true;
            this.isOverDraft = false;
        }
        else if (event == LMSOperationEnum.ContingentLiabilityRenewal) {
            this.ContingentLiabilityRenewal = true;
            this.isOverDraft = false;
            this.showAttachedDocument = true;
            this.getAllUploadedOperationDocument();

        }
        else if (event == LMSOperationEnum.ContingentLiabilityRebook) {
            this.ContingentLiabilityRebook = true;
            this.isOverDraft = false;
            this.showAttachedDocument = true;
            this.getAllUploadedOperationDocument();


        }
        else if (event == LMSOperationEnum.CancelContingentLiability) {
            this.CancelContingentLiability = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.ContingentLiabilityTermination) {

            this.ContingentLiabilityTermination = true;
            this.isOverDraft = false;
            this.showAttachedDocument = true;
            this.getAllUploadedOperationDocument();


        }
        else if (event == LMSOperationEnum.ContingentLiabilityTenorExtension) {
            this.ContingentLiabilityTenorExtension = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.ContingentLiabilityAmountReduction) {
            this.ammendedAmount = 0;
            this.ammendedAmount = this.loanSelectedData.principalAmount - this.loanSelectedData.prepayment;

            this.ContingentLiabilityAmountReduction = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.ContingentLiabilityAmountAddition) {
            this.ammendedAmount = 0;

            this.ammendedAmount = this.loanSelectedData.principalAmount + this.loanSelectedData.prepayment;

            this.ContingentLiabilityAmountAddition = true;
            this.isOverDraft = false;

        }
        else
        //(event == LMSOperationEnum.LoanRecapitilization)
        {
            this.Others = true;
            this.isOverDraft = false;

        }
        this.getAllUploadedDocument();
        this.getStaffActivity('crms-user')

        this.displayRestructuringApprovalModal = true;


    }

    
    userIsCOA: boolean = false;
    currentUserCode: any;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
          this.staffRoleRecord = res.result;
            this.currentUserCode = this.staffRoleRecord.staffRoleCode;
        //   if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
        //     this.userIsAccountOfficer = true;
        //   }
        //   if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
        //     this.userIsRelationshipManager = true;
        //   } if (this.staffRoleRecord.staffRoleCode == 'VAL CR DOC OFF') {
        //     this.valuationOfficer = true;
        //   }
        });
      }

    promptToGoForApproval(formObj) {
        if (formObj.approvalStatusId == ApprovalStatusEnum.Referred) {
            this.goForApproval(formObj);
        }
        else {
            this.authorizationService.enable2FAForLastApproval(formObj.operationTypeId
                , null, formObj.productId, 0).subscribe((res) => {
                    if (res.result == true) {
                        this.displayTwoFactorAuth = true;
                    } else {
                        this.goForApproval(formObj);
                    }
                })
        }
    }

    setTrailCount(count) { this.trailCount = count; }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.loanService;
        this.displayRestructuringApprovalModal = false;
        // let selectedLoanReviewOperationId = this.loanSelectedData.loanReviewOperationsId;
        let bodyObj = {
            operationId: this.loanSelectedData.operationTypeId,
            targetId: this.loanSelectedData.loanReviewOperationsId,
            approvalLevelId: this.loanSelectedData.currentApprovalLevelId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode,
            currentUserCode: this.currentUserCode,
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
            __this.loanOperationService.sendLoanOperationForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                __this.twoFactorAuthPassCode = null;
                __this.twoFactorAuthStaffCode = null;
                if (response.success === true) {
                    __this.twoFactorAuthPassCode = null;
                    __this.twoFactorAuthStaffCode = null;
                    __this.getAllLoansOperationForApproval();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.displayRestructuringApprovalModal = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    __this.displayRestructuringApprovalModal = true;
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
        this.displayRestructuringApprovalModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayRestructuringApprovalModal = false;
        this.displayRestructuringApprovalModalMain = true;
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

    loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
        this.loadingService.show();
        this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                if (tempSrc != null) {
                    this.originalForm3800bSrc = tempSrc;
                }
                else this.originalForm3800bSrc = {};
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                ////console.log('error', err);
            });
    }

    popoverSeeMore() {
        if (this.lmsLoanReferenceNumber != null) {
            ////console.log('more..', startDate, endDate);
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            const data = {
                applicationRefNumber: this.lmsLoanReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.getGeneratedOfferLetterLMS(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                ////console.log(path);
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                ////console.log(path);
            });
            this.displayReport = true;
            this.activeTabindex = 0;
            this.loadingService.show();
            this.loadingService.hide(1000);
            return;
        }
    }
    form3800b(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.printLMSForm3800B(data.applicationRefNumber).subscribe((response: any) => {
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


    getAllUploadedDocument() {
        this.loadingService.show();
        let body = {
            loanApplicationId: this.loanSelectedData.loanReviewApplicationId,
            loanApplicationNumber: this.lmsLoanReferenceNumber,
            loanReferenceNumber: this.loanSelectedData.loanReferenceNumber,
            databaseTable: 8,

        }


        this.documentpUloadService.getAllUploadedDocument(body).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    getAllUploadedOperationDocument() {
        this.loadingService.show();
        let body = {
            loanApplicationId: this.loanSelectedData.loanReviewApplicationId,
            loanApplicationNumber: this.lmsLoanReferenceNumber,
            loanReferenceNumber: this.loanSelectedData.loanReferenceNumber,
            databaseTable: 8,
            operationReviewId: this.loanSelectedData.appraisalOperationId,
        }


        this.documentpUloadService.getAllUploadedOperationsDocument(body).subscribe((response: any) => {
            this.attachmentDocuments = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }


    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;

    viewDocument(row) {
        row.databaseTable = 8;
        this.loadingService.show();
        this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
            this.binaryFile = response.result.fileData;
            this.selectedDocument = response.result.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }
    viewPdfDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.displayPdf = true;
            this.fileUrl = 'https://cdn.rawgit.com/DenisVuyka/pdf-test-01/4b729e21/sample.pdf';
        };
    }

    viewExcelDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);
            var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
            // saveAs(file)
        }
    }


    DownloadDocument(id: number) {
        this.fileDocument = null;
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            this.fileDocument = response.result;
            // let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
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

    getLoanReviewOperationIrregularSchedule(id) {
        this.loanOperationService.getLoanReviewOperationIrregularSchedule(id).subscribe((response: any) => {
            this.scatterdPayments = response.result;
        });
    }

    //====================================================================================

    refer() {
        // this.forwardAction = ApprovalStatus.REFERRED;
        // this.displayCommentForm = true;
        this.displayReferBackForm = true;
        // this.commentTitle = 'Refer Back';
        // this.getTrail();
        // let control = this.commentForm.controls['trailId'];
        // control.setValidators([Validators.required]);
        // control.updateValueAndValidity();
        // this.commentForm.controls['vote'].setValue(5);
    }

    getTrail() {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getTrailLms(this.loanApplDetailId, this.synOperationId).subscribe((response: any) => {
                this.trail = response.result;
                this.trailCount = this.trail.length;
                this.trailRecent = response.result[0];
                this.referBackTrails();
                response.result.forEach((trail) => {
                    if (this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
                        this.trailLevels.push(trail);
                    }
                });

                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            }));
    }


    // referBackTrail(): any {
    //     this.trail.forEach(x => {
    //         if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId
    //             && t.requestStaffId == x.requestStaffId) == null && x.fromApprovalLevelId != null) {
    //             this.backtrail.push({
    //                 approvalTrailId: x.approvalTrailId,
    //                 fromApprovalLevelId: x.fromApprovalLevelId,
    //                 fromApprovalLevelName: x.fromApprovalLevelName,
    //                 requestStaffId: x.requestStaffId,
    //                 staffName: x.staffName,
    //             });
    //         }
    //     });
    // }

    referBackTrails(): any {
        this.backtrail = []; 
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.loanSelectedData.loanReviewOperationsId, this.loanSelectedData.operationTypeId, this.loanSelectedData.currentApprovalLevelId,true).subscribe((response: any) => {
            this.loadingService.hide();
            this.backtrail = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
      
      
    }

    canSupport() {
        return this.privilege.canApprove && this.forwardAction != 3 && this.facilityCount > 1;
    }

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        groupRoleId: 1, // bu,ca,md,comm,bd
    };

    onLineItemChange(input, value, id = null) {
        if (value.toString().trim() == '') return;
        this.selectedLineId = id == null ? this.selectedLineId : +id;
        let item = this.recommendedItems.find(x => x.detailId == this.selectedLineId);
        if (item == null) {
            let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
            let newRecommendation = {
                detailId: o.loanApplicationDetailId,
                statusId: o.statusId,
                amount: o.approvedAmount,
                interestRate: o.approvedRate,
                tenor: o.approvedTenor,
                convertedAmount: o.convertedApprovedAmount
            };
            this.recommendedItems.push(newRecommendation);
            item = newRecommendation;
        }
        if (input == 1) { value = this.formatMCleanup(value); } // resolve the null=0 bug
        switch (input) {
            case 1: item.amount = value; /*item.convertedAmount = value * item.exchangeRate;*/ break;
            case 2: item.interestRate = value; break;
            case 3: item.tenor = value * 30; break;
            case 5: item.statusId = value; this.commentForm.controls['statusId'].setValue(value); this.setProductApprovalStatus(value); break;
        }
        this.touchedLineItems.push(this.selectedLineId); // mark change made here *
    }

    formatMCleanup(value) {
        var numberPart = value.substr(0, value.length - 1);
        var readablePart: string = value.substr(-1);
        numberPart = parseFloat(numberPart.replace(/,/g, '')).toString();
        if (readablePart === 'M' || readablePart == 'm') {
            return Number(numberPart) * 1000000;
        } else if (readablePart === 'T' || readablePart == 't' || readablePart === 'K' || readablePart === 'k') {
            return Number(numberPart) * 1000;
        } else if (readablePart === 'b' || readablePart === 'B') {
            return Number(numberPart) * 1000000000;
        } else {
            return Number(numberPart);
        }
    }


    setProductApprovalStatus(value) {
        let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
        o.statusId = value;
    }

    onTargetStaffLevelChange(trailId) {
        let selected = this.backtrail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    forwardCam(form) {
        var promptMessage;
        const __this = this;
        let body = {
            forwardAction: __this.forwardAction,
            applicationId: __this.loanApplDetailId,
            operationId: __this.synOperationId,
            receiverLevelId: __this.receiverLevelId,
            receiverStaffId: __this.receiverStaffId,
            comment: form.value.comment,
            vote: +form.value.vote,
            isBusiness: __this.isBusiness,
            recommendedChanges: __this.recommendedItems,
            reviewStageId: 1,
            isFlowTest: true
        };

        if (__this.forwardAction == 5) { body.isFlowTest = false }
        __this.errorMessage = '';

        __this.loadingService.show();
        __this.reviewService.forwardApplication(body).subscribe((response: any) => {
            __this.loadingService.hide();
            if (response.success == true) {
                if (__this.forwardAction == 5) {

                    __this.reset();
                    __this.displayCommentForm = false;
                    __this.loadingService.hide();

                }

                if (response.stateId == 3) {
                    if (this.synOperationId == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will been <strong>${response.statusName} and sent to operations.</strong> `, 'success'); }

                    if (this.synOperationId != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName} and sent to availment</strong> `, 'success'); }

                    else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application will be <strong>${response.statusName}</strong>`, 'success'); }
                }

                else {
                    promptMessage = 'Application Status: ' + response.result.statusName + '. \n Next Approver: ' + response.result.nextLevelName + '-' + response.result.nextPersonName;
                }
                swal({
                    title: 'Workflow Destination Route',
                    text: promptMessage + '\n Do you want to proceed?',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    confirmButtonClass: 'btn btn-success btn-move',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: true,
                }).then(function () {
                    body.isFlowTest = false;
                    __this.loadingService.show();
                    __this.subscriptions.add(__this.reviewService.forwardApplication(body).subscribe((response: any) => {
                        if (response.success == true) {
                            __this.reset();
                            __this.displayCommentForm = false;
                            // __this.clearControls();
                            __this.loadingService.hide();
                            __this.displayApplicationStatusMessage(response.result);
                        } else {
                            __this.finishBad(response.message);
                            __this.errorMessage = response.message;
                        }
                    }, (err: any) => {
                        __this.finishBad(JSON.stringify(err));
                        __this.errorMessage = err;
                    }));
                }, function (dismiss) {
                    if (dismiss === 'cancel') {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                    }
                });

            } else {
                __this.finishBad(response.message);
                __this.errorMessage = response.message;
            }
        }, (err: any) => {
            __this.finishBad(JSON.stringify(err));
        });

    }

    reset() {
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity();

    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3) {
            if (this.synOperationId == 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `<strong>${response.responseMessage}.</strong> Sent to operations.`, 'success'); }

            // if (this.synOperationId != 48) { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}.</strong>`, 'success'); }

            // else { swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong>${response.statusName}</strong>`, 'success'); }
        }
        else
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.responseMessage}</strong>`, 'success');
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
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

    onLineRowSelect(row) {
        this.enebleFacilityChange = this.enableChanges();
        this.selectedLineId = row.loanApplDetailId; // tobe used @ onLineItemChange()
        this.clearRecommendationForm(this.selectedLineId);
        let item = this.recommendedItems.find(x => x.detailId == row.loanApplDetailId);
        if (item == null) { return; }
        this.commentForm.controls['principal'].setValue(item.amount);
        this.commentForm.controls['rate'].setValue(item.interestRate);
        this.commentForm.controls['tenor'].setValue(item.tenor);
        this.commentForm.controls['statusId'].setValue(item.statusId);
    }


    enableChanges() {
        return (this.isAnalyst == true && this.privilege.canMakeChanges == true)
            || (this.privilege.canApprove == true && this.privilege.canMakeChanges == true);
    }


    clearRecommendationForm(id = null) {
        this.commentForm.controls['principal'].setValue('');
        this.commentForm.controls['rate'].setValue('');
        this.commentForm.controls['tenor'].setValue('');
        this.commentForm.controls['statusId'].setValue(this.getProductApprovalStatus());
    }

    getProductApprovalStatus() {
        let o = this.proposedItems.find(x => x.loanApplDetailId == this.selectedLineId);
        return o.statusId;
    }

    disapprove() {
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Disapprove';
        this.commentForm.controls['vote'].setValue(1);
    }

    clearControls() {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required], // debug_test, flow_test
            vote: [2, Validators.required],
            principal: [''],
            rate: [''],
            tenor: [''],
            productId: [''],
            trailId: [''],
            statusId: [''],
            exchangeRate: [''],
            initialExposure: [''],
            totalExposure: [''],
            newExposure: [''],
        });

        
            this.searchForm = this.fb.group({
              searchString: ['', Validators.required],
            });
          
    }

    displayStatus(event) {
        this.displayReferBackForm = false;
    }

    referBackResultControl(event) {
        this.getAllLoansOperationForApproval();
        this.displayRestructuringApprovalModal = false;
        this.displayReferBackForm = false;
    }

}
