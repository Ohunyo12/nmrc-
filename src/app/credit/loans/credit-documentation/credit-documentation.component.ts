import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus, ApprovalStatusEnum, LoanSystemTypeEnum, JobSource, LMSOperationEnum } from 'app/shared/constant/app.constant';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ReportService } from 'app/reports/service/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreditAppraisalService, LoanReviewApplicationService, LoanOperationService, LoanService } from 'app/credit/services';
import { saveAs } from 'file-saver';

import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'app/shared/services/loading.service';
import { AuthorizationService } from 'app/admin/services';
import { ApprovalService, ChecklistService, CollateralService, GeneralSetupService } from 'app/setup/services';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { ProjectSiteReportService } from 'app/credit/services/project-site-report.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-credit-documentation',
  templateUrl: './credit-documentation.component.html'
})

export class CreditDocumentationComponent implements OnInit {
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
    //documentSectionForm: FormGroup;
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
    preDocumentations: any[] = [];
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

    collateralDetails: any[];
    guarantorDetails: any[]; 
    chargeFeeDetails: any[];
    loanScheduleDetails: any[];
    displayCustomerODDetails: boolean = false;


    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
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

    sectionContent: any;
    sectionDescription: any = '';
    documentationSections: any[] = [];
    editMode: boolean = false;
    selectedSectionId: number = null;
    selectedSectionIdIndex: number = null;
    readonly APPRAISAL_OPERATION_ID: number =46;
    ckeditorChanges: any;

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private loanApplService: LoanApplicationService,
        private loanOperationService: LoanOperationService, private loanService: LoanService, private genSetupService: GeneralSetupService,
        private approvalService: ApprovalService, private router: Router, private documentpUloadService: DocumentpUloadService,
        private authorizationService: AuthorizationService, private camService: CreditAppraisalService,
        private reportServ: ReportService, private sanitizer: DomSanitizer, private reviewService: LoanReviewApplicationService, 
        private LetterGenServ: LetterGenerationRequestService, private collateralService: CollateralService,
        private checklistService: ChecklistService, private psrService: ProjectSiteReportService,
        ) {
    }

    ngOnInit() {
        this.getAllLoansOperationForDocumentation();
        this.displayReport = false;
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
        // this.getChecklistAwaitingApproval();
        // this.getOriginalDocumentApprovals();
        // this.getApprovalSecurityRelease();
        // this.getLetterGenerationRequests();
        // this.getValuationRequestWaitingForApproval();
        // this.getCollateralSwapRequestsForApproval();
        // this.getInsurancePoliciesWaitingForApproval();
        // this.getProjectSiteReportApproval();
    }


  //   clearControls() { 
  //     this.documentSectionForm = this.fb.group({
  //    sectionId: ['', Validators.required],
  //   });
  //  }   


    searchString: string;
    searchForm: FormGroup;
    displaySearchForm: boolean = false;
    showSearchForm() { this.displaySearchForm = true; } 

    submitForm(form) { 
        this.searchString = form.value.searchString;
          this.loadingService.show();
          this.subscriptions.add(
            this.loanOperationService.getAllLoansOperationForDocumentationSearch(form.value.searchString).subscribe((response: any) => {
            this.loanOperationApprovalData = response.result;
              this.loadingService.hide();
              this.displaySearchForm = false;
          }, (err: HttpErrorResponse) => {
              swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
              this.loadingService.hide(1000);
          }));
      }


    onDocumentSectionChange(sectionId) {
      this.loadingService.show();
      this.subscriptions.add(
      this.camService.getDocumentSection(this.OPERATION_ID, this.selectedloanReviewApplicationId, sectionId).subscribe((response: any) => {
          if (response.result == null) return;
          this.editMode = response.result.editable;
          this.sectionContent = response.result.templateDocument;
          this.sectionDescription = response.result.description;
          this.selectedSectionId = sectionId;
          this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      }));
  }

  contentChange(updates) { this.ckeditorChanges = updates; }  

  print(): void {
    this.previewDocumentation(true);
        let printTitle = 'APPROVAL MEMO - ' + this.lmsLoanReferenceNumber;
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
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

  printComment(): void {
        let printTitle = 'APPROVAL COMMENTS - ' + this.lmsLoanReferenceNumber;
        let printContents, popupWin;
        printContents = document.getElementById('print-section-comment').innerHTML;
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

  printSupportDocuments(): void {
    let printTitle = 'SUPPORTING DOCUMENTS - ' + this.lmsLoanReferenceNumber;
    let printContents, popupWin;
    printContents = document.getElementById('print-section-support-document').innerHTML;
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

printSchedule(): void {
  let printTitle = 'LOAN SCHEDULE - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-schedule').innerHTML;
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

printCollateral(): void {
  let printTitle = 'COLLATERAL DETAILS - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-collateral').innerHTML;
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

printFees(): void {
  let printTitle = 'FEES DETAILS - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-fees').innerHTML;
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

printConvenant(): void {
  let printTitle = 'CONVENANT DETAILS - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-convenant').innerHTML;
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

printManualFee(): void {
  let printTitle = 'MANUAL FEE DETAILS - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-manual-fee').innerHTML;
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

printApprovalInformation(): void {
  let printTitle = 'APPROVAL INFORMATION - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-approval-information').innerHTML;
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

printContingentInformation(): void {
  let printTitle = 'CONTINGENT DETAILS - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-contingent').innerHTML;
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

printBasicInformation(): void {
  let printTitle = 'BASIC INFORMATION  - ' + this.lmsLoanReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section-basic-information').innerHTML;
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

flagPrinted(form) {
  
  var promptMessage;
  const __this = this;
  let body = {
      loanId: form.loanId,
      requestId: form.loanReviewOperationsId,
      loanReferenceNumber: form.loanReferenceNumber,
  };
//console.log("helloooooo "+ JSON.stringify(body));
  promptMessage = 'Credit with Reference number: ' + form.applicationReferenceNumber + 'is flaged for filling.';
          swal({
              title: 'Confirmation of Credit Documentation',
              text: promptMessage + '\n Do you want to proceed? Note, you can not reverse this action',
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
              __this.loadingService.show();
              __this.subscriptions.add(__this.camService.flagPrinted(body).subscribe((response: any) => {
                  if (response.success == true) {
                    __this.loadingService.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                      __this.displayCommentForm = false;
                       __this.getAllLoansOperationForDocumentation();
                  } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    __this.loadingService.hide();
                      __this.errorMessage = response.message;
                  }
              }, (err: any) => {
                  __this.finishBad(JSON.stringify(err));
                  __this.loadingService.hide();
                  __this.errorMessage = err;
              }));
          }, function (dismiss) {
              if (dismiss === 'cancel') {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
              }
          });
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

    preloadDocumentation() {
      this.loadingService.show();
      this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
          this.preDocumentations = response.result;
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      });
  }

    previewDocumentation(print = false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
            this.documentations = response.result;
            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
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

    getAllLoansOperationForDocumentation() {
      this.loadingService.show();
        this.loanOperationService.getAllLoansOperationForDocumentation().subscribe((response: any) => {
            this.loanOperationApprovalData = response.result;
            this.loadingService.hide();
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

    // getAllApprovalStatus(): void {
    //     this.genSetupService.getApprovalStatus().subscribe((response: any) => {
    //         let tempData = response.result;
    //         this.approvalStatusData = tempData.slice(2, 4);
    //     });
    // }

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


    viewLoanDetails(row, evt) {
        evt.preventDefault();
        this.hideAllControl();
        this.loanSelectedData = {};
        this.loanSelectedData = row;
        
        this.getLoanDetail(row.creditAppraisalLoanApplicationId);
        this.proposedItems = this.proposedItems.find(x => x.loanApplDetailId == this.loanSelectedData.loanApplDetailId);
        this.creditAppraisalLoanApplicationId = this.loanSelectedData.creditAppraisalLoanApplicationId;
        this.creditAppraisalOperationId = this.loanSelectedData.creditAppraisalOperationId;
        this.loanSelectedData.approvalStatusId = "";
        this.synOperationId = this.loanSelectedData.synOperationId;
        this.loanReviewOperationsId = this.loanSelectedData.loanReviewOperationsId;
        let dataObj = this.loanSelectedData;
        this.loanApplDetailId = dataObj.lmsLoanApplicationId;
        this.synOperationId = dataObj.lmsOperationId;
        this.getTrail();
        this.lmsLoanReferenceNumber = this.loanSelectedData.lmsLoanReferenceNumber;
        this.selectedloanReviewApplicationId = this.loanSelectedData.loanReviewApplicationId;
        this.loanApplDetailId = this.loanSelectedData.loanReviewApplicationId;
        let facilityType = this.loanSelectedData.loanSystemTypeId;
        this.loanSystemTypeId = facilityType;
        this.loanId = dataObj.loanId;
        this.isLms = true;
        this.loanOperationApprovalFees = this.loanSelectedData.fees;
        this.showAttachedDocument = false;
        this.preloadDocumentation();
        if (this.loanSelectedData.fees.length > 0) {
            this.hasFees = true;
        } else {
            this.hasFees = false;
        }


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

        }
        else if (event == LMSOperationEnum.Prepayment) {
            this.PrepaymentChange = true;
            this.isOverDraft = false;

        }
        
        else if (event == LMSOperationEnum.InterestFrequencyChange) {
            this.InterestFrequencyChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.InterestAndPrincipalFrequencyChange) {
            this.InterestandPrincipalFrequencyChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.PaymentDateChange) {
            this.PaymentDateChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.TenorExtension) {
            this.TenorChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.ChangeRepaymentAccount) {
            this.CASAAccountChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.OverdraftTopup) {
            this.Overdrafttopup = true;
            this.isOverDraft = true;
        }
        else if (event == LMSOperationEnum.FeeChargeChange) {
            this.FeechargeChange = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.Restructure) {
            this.Restucture = true;
            this.isOverDraft = false;

        }
        else if (event == LMSOperationEnum.LoanRecapitilization) {
            this.LoanRecapitalization = true;
            this.isOverDraft = false;

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
            this.getLoanReviewOperationIrregularSchedule(row.loanReviewOperationsId); 
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
        {
            this.Others = true;
            this.isOverDraft = false;

        }
        this.getAllUploadedDocument();
        this.getStaffActivity('crms-user')

        this.displayRestructuringApprovalModal = true;


    }

    setTrailCount(count) { this.trailCount = count; }

    hideModal(int: number = 0) {
        if(int == 0){
            this.handleChange(0);
            this.activeIndex = 0;
            this.documentations = [];
            this.displayRestructuringApprovalModal = false;
        // }else if(int == 1){
        //     this.activeTabindex1 = 0;
        //     this.targetId1 = 0;
        //     this.operationId1 = 0;
        // }else if(int == 2){
        //     this.activeTabindex2 = 0;
        //     this.targetId2 = 0;
        //     this.operationId2 = 0;
        // }else if(int == 3){
        //     this.activeTabindex3 = 0;
        //     this.targetId3 = 0;
        //     this.operationId3 = 0;
        // }else if(int == 4){
        //     this.activeTabindex4 = 0;
        //     this.targetId4 = 0;
        //     this.operationId4 = 0;
        // }else if(int == 5){
        //     this.activeTabindex5 = 0;
        //     this.targetId5 = 0;
        //     this.operationId5 = 0;
        }
        
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
            });
    }

    popoverSeeMore() {
        if (this.lmsLoanReferenceNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            const data = {
                applicationRefNumber: this.lmsLoanReferenceNumber,

            }

            this.reportServ.getGeneratedOfferLetterLMS(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
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
            this.reportServ.printLMSForm3800B(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
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
            
        }
    }


    DownloadDocument(id: number) {
        this.fileDocument = null;
        this.loadingService.show();
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
            this.fileDocument = response.result;
            this.loadingService.hide();
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
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    getLoanReviewOperationIrregularSchedule(id) {
        this.loanOperationService.getLoanReviewOperationIrregularSchedule(id).subscribe((response: any) => {
            this.scatterdPayments = response.result;
        });
    }

    //====================================================================================

    refer() {
        this.forwardAction = ApprovalStatus.REFERRED;
        this.displayCommentForm = true;
        this.commentTitle = 'Refer Back';
        this.getTrail();
        let control = this.commentForm.controls['trailId'];
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
        this.commentForm.controls['vote'].setValue(5);
    }

    getTrail() {
        this.loadingService.show();
        this.subscriptions.add(
            this.camService.getTrailLms(this.loanApplDetailId, this.synOperationId).subscribe((response: any) => {
                this.trail = response.result;
                this.trailCount = this.trail.length;
                this.trailRecent = response.result[0];
                this.referBackTrail();
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


    referBackTrail(): any {
        this.trail.forEach(x => {
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

    referBackTrails(): any {
        this.backtrail = []; 
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.loanReviewApplicationId, this.appraisalOperationId, this.loanSelectedData.currentApprovalLevelId).subscribe((response: any) => {
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
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    reset() {
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity();

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


    // //#region properties
    // selectedChecklist: any;
    // checklistAwaitingApproval = [];
    // operationId1 = 0; // deferral/waiver
    // operationId2 = 0; //security release
    // operationId3 = 0; //original doc sub
    // operationId4 = 0; //lettergen
    // operationId5 = 0; //projectSite
    // operationId6 = 0; //collateralvaluation
    // operationId7 = 0; //swap
    // operationId8 = 0; //insurance
    // targetId1 = 0; // deferral/waiver
    // targetId2 = 0; //security release
    // targetId3 = 0; //original doc sub
    // targetId4 = 0; //letter gen
    // targetId5 = 0; //projectSite
    // targetId6 = 0; //collateralvaluation
    // targetId7 = 0; //swap
    // targetId8 = 0; //insurance
    // selectedChecklistData: any;
    // itemSelected = false;
    // ckEditorContent: any;
    // loanSystemTypeId1 = 0;
    // loanApplicationDetailId = 0;
    // reloadLoanDetails = 0;
    // approvalReleases = [];
    // activeTabindex1: number; //deferral/waiver
    // activeTabindex2: number; //security release
    // activeTabindex3: number; //original doc sub
    // activeTabindex4: number; //letter gen
    // activeTabindex5: number; //projectSite
    // activeTabindex6: number; //collateralvaluation
    // activeTabindex7: number; //swap
    // activeTabindex8: number; //insurance
    // TARGET_ID = 0;
    // CUSTOMER_ID = 0;
    // REFERENCE_NUMBER: string;
    // rowSelected = false;
    // documentUploadsForSecurityRelease = [];
    // documentUploadsOriginalDocSub = [];
    // letterGenerationRequests = [];
    // showUploadeddocumentForSecurityRelease = false;
    // originalDocumentApprovals = [];
    // originalDocumentApprovalId = 0;
    // facilityDetailForOriginalDocSub = false;
    // requestTypes = [
    //     {name: 'Letter Of Indebtedness', id: 1},
    //     {name: 'Letter Of Non-indebtness', id: 2},
    //     {name: 'Auditor\'s enquiry', id: 3}
    // ];
    // displayLetterGenerationRequestForm = false;
    // displayCollateralValuationRequestForm = false;
    // camsolLoanDocHtml: any;
    // valuationPrerequisites = [];
    // valuationCustomerId = 0;
    // valuationReferenceNumber = '';
    // displayCollateralSwapForm = false;
    // collateralSwapRequests = [];
    // itemPolicy = [];
    // displayCollateralInsuranceForm = false;
    // ProjectSiteReports = [];
    // displayProjectSiteReport = false;
    // showProjectSiteDetail = false;
    // projectReportSrc: SafeResourceUrl;
    // psrReportTypeId = 0;
    // showInput = false;
    // performanceAnalysisReport = [];
    // showAnalysisDetail = false;
    // analysisDetail:any = {};
    // commentReport = [];
    // observationReport = [];
    // recommendationReport = [];
    // taskReport = [];
    // performanceEvaluationsReport = [];
    // evaluationDetail:any = {};
    // performanceAnalysisReportCount = 0;
    // OrignalDocLoanSelection: any = {};
    // // this.getChecklistAwaitingApproval();
    // // this.getOriginalDocumentApprovals();
    // // this.getApprovalSecurityRelease();
    // // this.getLetterGenerationRequests();
    // // this.getValuationRequestWaitingForApproval();
    // // this.getCollateralSwapRequestsForApproval();
    // // this.getInsurancePoliciesWaitingForApproval();
    // // this.getProjectSiteReportApproval();
    // //#endregion

    // //#region forward
    // forward(targetId: number = 0, operationId: number = 0){
    //     if(targetId <= 0 || operationId <= 0){
    //         return;
    //     }
    //     let body = {
    //         targetId,
    //         operationId,
    //     }
        
    //     this.loadingService.showKeyApiCall();
    //     this.loanService.logApproval(body).subscribe((response: any) => {
    //         if(response.success == true){
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
    //         }
    //         this.loadingService.hideKeyApiCall();
    //     }, (err) => {
    //         this.loadingService.hideKeyApiCall(1000);
    //     });
    // }
    // //#endregion

    // //#region deferral
    // getChecklistAwaitingApproval() {
    //     this.loadingService.show();
    //     this.checklistService.getChecklistAwaitingApproval().subscribe((data) => {
    //       this.checklistAwaitingApproval = data.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    //     this.activeTabindex1 = 0;
    // }

    // onTabChange1(e) {
    //     this.activeTabindex1 = e.index;
    //     if (e.index == 0) { 
    //         this.refresh1(); 
    //     }
    // }

    // refresh1() {
    //     this.reload = 0;
    //     this.selectedChecklistData = {};
    //     this.itemSelected = false;
    // }

    // viewChecklistDetails(row) {
    //     this.getDrawdownDeferralMemo(row.operationId,row.loanApplicationDetailId)
    //     if(row.isLms == false) {
    //         this.operationId1 = row.operationId;
    //         this.targetId1 = row.conditionId;
    //         this.loanApplicationDetailId = row.loanApplicationDetailId;
    //     } else {
    //         this.loanSystemTypeId1 = row.loanSystemTypeId;
    //         this.reloadLoanDetails = row.loanId;
    //     }
    //     this.selectedChecklistData = row;
    //     this.selectedChecklistData.conditionId = row.conditionId;
    //     this.itemSelected = true;
    //     this.activeTabindex1 = 1;
    // }

    // getDrawdownDeferralMemo(operationId,targetId) {
    //     this.loadingService.show();
    //     this.checklistService.getDrawdownDeferralMemo(operationId, targetId).subscribe((response: any) => {
    //         if (response.result == null) {
    //             return;
    //         }
    //         this.loadingService.hide();
    //         this.ckEditorContent = response.result;
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }
     
    // printDocumentByElemntId(printTitle: string, elementId: string): void {
    //     let printContents, popupWin;

    //     printContents = document.getElementById(elementId).innerHTML;
    //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //     popupWin.document.open();
    //     popupWin.document.write(`
    //         <html>
    //             <head>
    //             <title style="font face: arial; size:12px">${printTitle}</title>
    //             <style>
    //             //........Customized style.......
    //             </style>
    //             </head>
    //             <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
    //         </html>`
    //     );
    //     popupWin.document.close();
    // }

    // // getDeferralWaiverPdf() {
    // //     let path = '';
    // //     this.checklistService.getDeferralWaiverPdf(this.operationId1, this.targetId1, this.loanApplicationDetailId).subscribe((response: any) => {
    // //         if (response.result == null) {
    // //             return;
    // //         }
    // //         path = response.result;
    // //         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    // //         this.displayTestReport = true;
    // //         this.displayReport = true;
    // //     }, (err) => {
        
    // //     });
    // // }
    // //#endregion
    
    // //#region security Release
    // viewDocumentsForSecurityRelease(row) {
    //     this.loadingService.show();
    //     this.operationId2 = row.operationId;
    //     this.targetId2 = row.originalDocumentApprovalId;
    //     this.getDocumentsByTargetForSecurityRelease(row.docSubmissionOperationId, row.originalDocumentApprovalId);
    //     this.TARGET_ID = row.collateralId;
    //     this.CUSTOMER_ID = row.customerId;
    //     this.rowSelected = true;
    //     this.loadingService.hide();
    // }

    // getDocumentsByTargetForSecurityRelease(docSubmissionOperationId, targetId) {
    //     this.loadingService.show();
    //     this.camService.getDocumentsReleasedDocuments(docSubmissionOperationId, targetId).subscribe((response: any) => {
    //         this.documentUploadsForSecurityRelease = response.result;
    //         this.showUploadeddocumentForSecurityRelease = true;
    //         this.loadingService.hide();
    //     });
    // }

    // downloadDocument(d, view = false) {
    //     this.fileDocument = null;
    //     this.loadingService.show();
    //     this.camService.downloadDocument(d.documentUploadId).subscribe((response: any) => {
    //         this.fileDocument = response.result;
    //         if (this.fileDocument != null) {
    //             this.loadingService.hide();
    //             const downloadedFileName = this.fileDocument.fileName;
    //             this.binaryFile = this.fileDocument.fileData;
    //             this.selectedDocument = this.fileDocument.documentTitle;

    //             if (view) {
    //                 this.displayDocument = true;
    //                 return;
    //             }

    //             let myDocExtention = this.fileDocument.fileExtension;
    //             var byteString = atob(this.binaryFile);
    //             var ab = new ArrayBuffer(byteString.length);
    //             var ia = new Uint8Array(ab);
    //             for (var i = 0; i < byteString.length; i++) {
    //                 ia[i] = byteString.charCodeAt(i);
    //             }
    //             var bb = new Blob([ab]);

    //             if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
    //                 try {
    //                     var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
    //                     saveAs(file);
    //                 } catch (err) {
    //                     var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
    //                     window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
    //                 }
    //             }
    //             if (myDocExtention == 'png' || myDocExtention == 'png') {
    //                 try {
    //                     var file = new File([bb], downloadedFileName, { type: 'image/png' });
    //                     saveAs(file);
    //                 } catch (err) {
    //                     var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
    //                     window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
    //                 }
    //             }
    //             if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
    //                 try {
    //                     var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
    //                     saveAs(file);
    //                 } catch (err) {
    //                     var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
    //                     window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
    //                 }
    //             }
    //             if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
    //                 try {
    //                     var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
    //                     saveAs(file);
    //                 } catch (err) {
    //                     var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
    //                     window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
    //                 }
    //             }
    //             if (myDocExtention == 'doc' || myDocExtention == 'docx') {
    //                 try {
    //                     var file = new File([bb], downloadedFileName, { type: 'application/msword' });
    //                     saveAs(file);
    //                 } catch (err) {
    //                     var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
    //                     window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
    //                 }
    //             }
    //         }

    //     }, (error) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getApprovalSecurityRelease() {
    //     this.loadingService.show();
    //     this.camService.approveRelease().subscribe((response: any) => {
    //         this.approvalReleases = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }
    // //#endregion

    // //#region OrigDocSub
    // getOriginalDocumentApprovals() {
    //     this.loadingService.show();
    //     this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
    //         this.originalDocumentApprovals = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // viewOriginalDocDetail(row) {
    //     this.OrignalDocLoanSelection = row;
    //     console.log('row', row);
    //     console.log('this.loanSelection', this.loanSelection);
    //     this.operationId3 = row.operationId;
    //     this.facilityDetailForOriginalDocSub = true;
    //     this.originalDocumentApprovalId = row.originalDocumentApprovalId;
    //     this.targetId3 = row.originalDocumentApprovalId;
    //     this.getDocumentsByTargetForOriginalDocSub();
    //     this.activeTabindex3 = 1;
    // }

    // getDocumentsByTargetForOriginalDocSub() {
    //     this.loadingService.show();
    //     this.camService.getDocumentsByTarget(this.operationId3, this.originalDocumentApprovalId, true).subscribe((response: any) => {
    //         this.documentUploadsOriginalDocSub = response.result;
    //         this.loadingService.hide();
    //     });
    // }
    // //#endregion

    // //#region letterGen
    // getLetterGenerationRequests() {
    //     this.loadingService.show();
    //     this.LetterGenServ.getLetterGenerationRequestsForApproval().subscribe((response: any) => {
    //         this.letterGenerationRequests = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getRequestTypeName(id): string {
    //     return this.requestTypes.find(t => t.id == id).name;
    // }

    // editLetterGenerationRequest(row) {
    //     console.log("row: ", row);
    //     this.targetId4 = row.requestId;
    //     this.operationId4 = row.operationId;
    //     this.displayLetterGenerationRequestForm = true;
    //     this.getCamsolLoanDocument(row.requestType, row);
    //     // this.getCamsolLoansByCustomerCode(row.customerName, row.customerCode);
    // }

    // getCamsolLoanDocument(typeId: Number, data: any) {
    //     console.log("data: ", data);
    //     var body = {
    //         customerId: data.customerId,
    //         customerCode: data.customerCode,
    //         customerName: data.customerName,
    //         accountNumber: data.accountNumber,
    //         asAtDate: data.asAtDate,
    //         requestRef: data.requestRef,
    //         loanBalance: data.loanBalance
    //     }

    //     this.loadingService.show();
    //     this.LetterGenServ.getCamsolLoanDocument(typeId, body).subscribe((response: any) => {
    //         this.camsolLoanDocHtml = response.result;
    //         this.loadingService.hide();
    //     });
    // }

    // printCamsolLoanDocument() {
    //     var print_div = document.getElementById("camsolLoanDocument");
    //     var print_area = window.open();
    //     print_area.document.write(print_div.innerHTML);
    //     print_area.document.close();
    //     print_area.focus();
    //     print_area.print();
    //     print_area.close();
    // }
    // //#endregion

    // //#region valuation
    // getValuationRequestWaitingForApproval() {
    //     this.loadingService.show();
    //     this.collateralService.getAllValuationRequestWaitingForApproval().subscribe((response: any) => {
    //         this.valuationPrerequisites = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // viewValuationDetail(d) {
    //     this.targetId6 = d.valuationPrerequisiteId;
    //     this.valuationCustomerId = d.customerId;
    //     this.valuationReferenceNumber = d.referenceNumber;
    //     this.operationId6 = d.operationId;
    //     this.displayCollateralValuationRequestForm = true;
    // }
    // //#endregion

    // //#region swap
    // getCollateralSwapRequestsForApproval() {
	// 	this.loadingService.show();
	// 	this.collateralService.getCollateralSwapRequestsForApproval().subscribe((response: any) => {
	// 		this.collateralSwapRequests = response.result;
	// 		this.loadingService.hide();
	// 	}, (err: any) => {
	// 		this.finishBad(JSON.stringify(err));
	// 		this.loadingService.hide(1000);
	// 	});
    // }
    
    // viewSwapInfo(row) {
	// 	this.loadingService.show();
	// 	this.targetId7 = row.collateralSwapId;
	// 	this.operationId7 = row.operationId;
    //     this.displayCollateralSwapForm = true;
    //     this.loadingService.hide();
    // }
    // //#endregion

    // //#region insurance
    // getInsurancePoliciesWaitingForApproval(): void {
    //     this.loadingService.show();
    //     this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response: any) => {
    //       this.itemPolicy = response.result;
    //       this.loadingService.hide();
    //     }, (err) => {
    //       this.loadingService.hide(1000);
    //     });
    // }

    // public getPolicyInformation(policy) {
    //     this.targetId8 = policy.insuranceRequestId;
    //     this.operationId8 = policy.operationId;
    //     this.displayCollateralInsuranceForm = true;
    // }
    // //#endregion

    // //#region projectSite
    // getProjectSiteReportApproval() {
    //     this.loadingService.show();
    //     this.psrService.getProjectSiteReportApproval().subscribe((response: any) => {
    //     this.ProjectSiteReports = response.result;
    //     this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // showPsrReport(d) {
    //     this.loadingService.show();
    //     let data = {
    //         projectSiteReportId: d.projectSiteReportId,
    //         psrReportTypeId: d.psrReportTypeId
    //     }
    //     this.psrService.psrReport(data).subscribe((response: any) => {
    //         let path = response.result;
    //         this.projectReportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    //     });
    //     this.loadingService.hide(1000);
    //     this.displayProjectSiteReport = true;
    // }

    // showPsrDetail(d) {
    //     this.targetId5 = d.projectSiteReportId;
    //     this.psrReportTypeId = d.psrReportTypeId;
    //     this.activeTabindex5 = 1;
    //     this.operationId5 = d.operationId;
    //     this.showProjectSiteDetail = true;
    //     this.refreshGrid(this.targetId5);
    // }

    // myAnalysisDetail(d) {
    //     this.analysisDetail = d;
    //     this.showAnalysisDetail = true;
    //     this.showInput = false;
    // }

    // refreshGrid(targetid: number) {
    //     if(targetid <= 0){
    //         return;
    //     }
    //     this.getCommentReport(targetid);
    //     this.getObservationReport(targetid);
    //     this.getRecommendationReport(targetid);
    //     this.getTaskReport(targetid);
    //     this.getPsrPerformanceEvaluation(targetid);
    //     this.getPsrPerformanceAnalysis(targetid);
    // }
    
    // getCommentReport(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrComments(projectSiteReportId).subscribe((response: any) => {
    //         this.commentReport = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getObservationReport(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrObservations(projectSiteReportId).subscribe((response: any) => {
    //         this.observationReport = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getRecommendationReport(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrRecommendations(projectSiteReportId).subscribe((response: any) => {
    //         this.recommendationReport = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getTaskReport(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrNextInspectionTasks(projectSiteReportId).subscribe((response: any) => {
    //         this.taskReport = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getPsrPerformanceEvaluation(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrPerformanceEvaluations(projectSiteReportId).subscribe((response: any) => {
    //         this.performanceEvaluationsReport = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // getPsrPerformanceAnalysis(projectSiteReportId) {
    //     this.loadingService.show();
    //     this.psrService.getPsrPerformanceAnalysis(projectSiteReportId).subscribe((response: any) => {
    //         this.performanceAnalysisReport = response.result;
    //         this.performanceAnalysisReportCount = this.performanceAnalysisReport.length;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    // viewPerformanceEvaluationsDetail(d) {
    //     this.evaluationDetail = d;
    // }
    // //#endregion


}

