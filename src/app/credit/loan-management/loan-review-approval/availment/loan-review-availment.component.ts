import { LoanApplicationService } from '../../../services/loan-application.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConditionPrecedentService } from '../../../../setup/services';
import { GlobalConfig, JobSourceEnum, LMSOperationEnum } from '../../../../shared/constant/app.constant';
import { LoanReviewApplicationService } from '../../../services';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import swal from 'sweetalert2';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { Subscription } from 'rxjs';
import { ApprovalActionsComponent } from 'app/shared/components/approval-actions/approval-actions.component';

@Component({
    templateUrl: 'loan-review-availment.component.html'
})
export class LoanReviewAvailmentComponent implements OnInit, OnDestroy {
    loanReviewApplicationId: number;
    list: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Timeline';
    addForm: FormGroup;
    documentSectionForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    form3800bSrc: any = {};
    originalForm3800bSrc: any = {};
    applicationReferenceNumber: string = '';
    reload: number = 0;
    proposedItems: any;
    reportSource: any;
    detail: any = {};
    loanSystemTypeId: number = 0;
    loanOriginationApplicationId: number = 0;
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    reportSrc: SafeResourceUrl;
    activeIndex: any;
    jobSourceId : number;
    readonly OPERATION_ID: number = 48;
    readonly APPRAISAL_OPERATION_ID: number = 46;
    cantingentUsedTab: boolean;
    private subscriptions = new Subscription();
    readonly CREDITAPPRIASALDOC: string ="CREDIT APPRAISAL DOCUMENTS";
    operationId: any;

    // ckeditor
    ckeditorChanges: any;
    sectionContent: any;
    sectionDescription: any = '';
    documentationSections: any[] = [];
    editMode: boolean = false;
    selectedSectionId: number = null;
    selectedSectionIdIndex: number = null;
    displayDocumentation: boolean = false;
    documentations: any[] = [];
    updateFromEditor: number = 0;
    TEMPLATE_OPERATION_ID: number = 6;
    LMS_TEMPLATE_OPERATION_ID: number = 46;
    creditAppraisalLoanApplicationId: number = 0;
    creditAppraisalOperationId: number = 0;
    documentTemplates: any[] = [];
    displayAppendModal: boolean = false;
    displayReferBackForm: boolean;
    referBackForm: FormGroup;

  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    // @ViewChild(ConditionChecklistComponent) conditionChecklist: ConditionChecklistComponent;
    @ViewChild(ApprovalActionsComponent, {static: false}) approvalActionsComponent: ApprovalActionsComponent;
    constructor(
        private fb: FormBuilder,
        private camService: CreditAppraisalService,
        private loadingService: LoadingService,
        private reviewService: LoanReviewApplicationService,
        private loanApplService: LoanApplicationService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
    ) { }

    ngOnInit() {
        this.jobSourceId  = JobSourceEnum.LMSApplication;
        this.clearControls();
        this.showCommentForm(true);
        this.approvalActionsComponent.isAvailmentPage = true;
    }

    // ---------------------

    disableApplicationInformationTab = true;
    disableLoanInformationTab = true;
    disableSupportingDocumentsTab = true;
    activeTabindex: number = 0;
    application: any = {};
    selectedLoanId: number = null;
    currentApprovalLevelId: number = null;
    reloadGrid: number = 0;
    selectedDetailId: any;
    selectedApplicationLoanId: number = 0;
    reloadLoanDetails: number = 0;
    enableReroute: boolean;
    enableViewForm3800B:boolean=false;
    operationTypeNames: any;
    

    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 2) { }
        if (e.index == 3) {this.getDocumentationSections(true); }
    }

    contentChange(updates) { this.ckeditorChanges = updates; }  

    getDocumentationSections(showLoadDocumentModal: boolean) {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getDocumentSections(this.APPRAISAL_OPERATION_ID, this.application.loanReviewApplicationId).subscribe((response: any) => {
            this.documentationSections = response.result;
            this.loadingService.hide();
           
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }

    onDocumentSectionChange(sectionId) {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getDocumentSection(this.APPRAISAL_OPERATION_ID, this.application.loanReviewApplicationId, sectionId).subscribe((response: any) => {
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

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }
    
      previewDocumentation(print=false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.APPRAISAL_OPERATION_ID, this.application.loanReviewApplicationId).subscribe((response: any) => {
            this.documentations = response.result;
            this.loadingService.hide();
            if (print == false) this.displayDocumentation = true;
          else setTimeout(() => this.print(), 1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    
    previewDocumentationLOS(print=false) {
      this.loadingService.show();
      this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId).subscribe((response: any) => {
          this.documentations = response.result;
          this.loadingService.hide();
          if (print == false) this.displayDocumentation = true;
          else setTimeout(() => this.print(), 1000);
      }, (err) => {
          this.loadingService.hide(1000);
      });
    }

    
      print(): void {

        let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.application.referenceNumber;
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

    loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
        this.loadingService.show();
        this.subscriptions.add(
        this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                if (tempSrc != null) {
                    this.originalForm3800bSrc = tempSrc;
                }
                else {
                    this.originalForm3800bSrc = {};
                }
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
                ////console.log('error', err);
            }));
    }

    isCreator() {
        if (this.application == null) return false;
        const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
        return this.application.createdBy == user.staffId;
    }

    resetGrid(yes) {
        if (yes) {
            swal('Fintrak Credit 360', 'You have successfully routed to a modifier', 'success');
            this.activeTabindex = 0;
        }
        else swal('Fintrak Credit 360', 'Routing to modifier failed', 'error');
    }

    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.application.loanReviewApplicationId;
        this.workflowTarget.operationId = this.OPERATION_ID;
        this.enableReroute = true;
    }

    onApplicationSelected(selected) {        
    
        this.refresh();
        this.application = selected; 
        this.reloadLoanDetails = selected.loanId;
        this.disableApplicationInformationTab = false;
        this.proposedItems = selected.applicationDetails;
        this.disableSupportingDocumentsTab = false;
        this.activeTabindex = 1;
        this.currentApprovalLevelId = selected.currentApprovalLevelId;
        this.applicationReferenceNumber = selected.referenceNumber;
        //this.form3800b(this.applicationReferenceNumber);
        this.loanReviewApplicationId = this.application.loanReviewApplicationId;
        this.operationId = this.application.operationId;
        this.operationTypeNames = selected.applicationDetails[0].reviewDetails;
        this.creditAppraisalLoanApplicationId =selected.applicationDetails[0].creditAppraisalLoanApplicationId;
        this.creditAppraisalOperationId= selected.applicationDetails[0].creditAppraisalOperationId;
        this.updateWorkflowTarget();
        this.getMaximumApplicationOutstandingBalance(this.application.loanReviewApplicationId);
        this.reload++;
    }
    handleChange(evt) {
        this.activeIndex = evt.index;
    }

    // ----------- approval ----------

    errorMessage: string = '';

    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    isSubsequent: boolean = false;
    offerLetterAccepted: any;
    approvalTrail: any;

    //approvalStatus(evt) { this.reset(); } // triggers reset of anything after submition

    reset() {
        this.activeTabindex = 0;
        this.currentApprovalLevelId = null;
        this.disableApplicationInformationTab = true;
        this.disableSupportingDocumentsTab = true;
        this.reloadGrid++;
        this.displayBackToCAPModal = false;
        this.application = null;
    }

    clearControls() { 
             //this.selectedId = null;
             this.documentSectionForm = this.fb.group({
            sectionId: ['', Validators.required],
        });
    }

    // ------------ message ------------

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }

    onFacilityChange(id) {
        const x = this.application.applicationDetails.find(x => x.loanApplicationDetailId == id);
       // console.log('x',x);
        
        if (x == null) { return; }
        this.loanSystemTypeId = x.loanSystemTypeId;
        this.reloadLoanDetails = x.loanId;

        this.getLoanApplicationDetail(x.loanId, x.loanSystemTypeId);
         if( x.operationId==LMSOperationEnum.APS_RelaseChecklist || x.operationId==LMSOperationEnum.APS_ReleaseCAP || x.operationId==LMSOperationEnum.APS_ReleasePrincipaRequest){ //ASP Operations
            this.cantingentUsedTab = true;
         }else{
            this.cantingentUsedTab = false;
         }
    }

    getLoanApplicationDetail(loanId, loanTypeId) {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getLoanApplicationDetail(loanId, loanTypeId).subscribe((response: any) => {
            this.detail = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }



    // refer back to appraisal

    trail: any[] = [];
    rmComment: string;
    trailId: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    appraisalTrail: any[] = [];
    displayBackToCAPModal: boolean = false;
    

    referBackToCAP() {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getTrail(this.loanReviewApplicationId, this.operationId).subscribe((response: any) => {
            this.appraisalTrail = response.result;
            this.displayBackToCAPModal = true;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }

    sendApplicationForReview() {
        this.loadingService.show();
        let body = {
            trailId: this.trailId,
            comment: this.rmComment,
            operationId: this.application.operationId,
            applicationId: this.application.loanReviewApplicationId,
            productClassId: null,
            productId: null,
            forwardAction: 5,
            receiverLevelId: this.receiverLevelId, // refer back
            receiverStaffId: this.receiverStaffId, // refer back
            isFromPc: true
        };
        this.errorMessage = '';
        this.loadingService.show();
        this.subscriptions.add(
        this.reviewService.forwardApplication(body).subscribe((response: any) => {
            if (response.success == true) {
                this.reset();
                this.clearControls();
                this.loadingService.hide();
            } else {
                this.finishBad(response.message);
                this.errorMessage = response.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.errorMessage = err;
        }));
    }

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    // refer back ends

    // returnBackToBusiness() {
    //     const __this = this;
    //     const target = {
    //         operationId: 48,
    //         targetId: this.application.loanReviewApplicationId,
    //     };

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
    //         __this.loadingService.show();

    //         __this.loanApplService.returnBackToBusinessAvailment(target).subscribe((res) => {
    //             __this.loadingService.hide();
    //             if (res.success === true) {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
    //                 __this.reset();
    //             } else {
    //                 swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
    //             }
    //         }, (err) => {
    //             __this.loadingService.hide();
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    //         });
    //     }, function (dismiss) {
    //         if (dismiss === 'cancel') {
    //             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    //         }
    //     });
    // }
    // showOfferLetterChecklist(loanReviewApplicationId) {
    //  this.conditionChecklist.viewOfferLetterChecklist(loanReviewApplicationId);
    // }

    refresh() {
        this.loanSystemTypeId = 0;
    }


    form3800b(applicationReferenceNumber): void {
        
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }
            ////console.log(data);
            this.subscriptions.add(
            this.reportServ.printLMSForm3800B(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            }));
            //this.displayReport = true;
            return;
        }

    }
    
      //HANDLING CLASSIFIED REFER-BACK
    //==============================================================================
    showReferBackForm() {
        this.referBackForm = this.fb.group({
            comment: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            
        });
         this.displayReferBackForm = true;
    }

    referBackResultControl(event) {
        if(event == true) {
            // this.clearControls();
            this.displayReferBackForm = false;
           // this.displayLoanToApproveModal = false;
            this.reset();
        }
      }

    returnBackToPrevious(form) {
        const __this = this;
        const target = {
            
            operationId: this.application.operationId,
            targetId: this.application.loanReviewApplicationId,
            comment: form.value.comment
        };

        // swal({
        //     title: 'Are you sure?',
        //     text: 'You want to send this back?',
        //     type: 'question',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes',
        //     cancelButtonText: 'No, cancel!',
        //     confirmButtonClass: 'btn btn-success btn-move',
        //     cancelButtonClass: 'btn btn-danger',
        //     buttonsStyling: true,
        // }).then(function () {
            __this.loadingService.show();
            __this.subscriptions.add(
            __this.loanApplService.returnBackToPrevious(target).subscribe((res) => {
                __this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    __this.reset();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            }));
        // }, function (dismiss) {
        //     if (dismiss === 'cancel') {
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        //     }
        // });
    }


    commentForm: FormGroup;
    displayCommentForm: boolean = false;

    showCommentForm(init = false) {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });
        if (init == false) this.displayCommentForm = true;
    }

    getMaximumApplicationOutstandingBalance(applicationId) {
        this.subscriptions.add(
        this.camService.getMaximumApplicationOutstandingBalance(applicationId).subscribe((response: any) => { 
            this.maximumAmount = response.result;
            // this.forwardCamStatus();
        }));
    }

    maximumAmount: number = 0;
    
    // withinApprovalLimits() {
    //     if (this.application == null) return;
    //     if (this.privilege.approvalLimit >= this.maximumAmount) {
    //         return true;
    //     }
    //     return false;
    // }

    approveActionLabel: string = 'Approve';
    // authorizeActionLabel: string = 'Authorize';

    // getApproveButtonLabel() {
    //     if (this.withinApprovalLimits() == true) {
    //         return this.approveActionLabel;
    //     }
    //     return 'Submit'; // this.authorizeActionLabel;
    // }

    forwardCamStatus() {
        let body = {
            forwardAction: 2,
            applicationId: this.application.loanReviewApplicationId,
            totalExposureAmount: this.maximumAmount,
            applicationTenor: this.application.tenor,
            operationId: this.OPERATION_ID,
            comment: '',
            isBusiness: this.isBusiness,
        };
        this.subscriptions.add(
        this.camService.forwardCamStatusLms(body).subscribe((response: any) => {
            if (response.success == true) {
                if (response.result.statusId != 2) this.approveActionLabel = 'Submit';
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        }));
    }  
    
    getOperationName() {
        switch (this.OPERATION_ID) {
            case 47: return 'offer letter';
            case 48: return 'availment';
            default: return 'operation';
        }
    }

    approvalStatus(evt) { 
        this.reset();
        this.displayApplicationStatusMessage(evt); 
    }


    displayApplicationStatusMessage(response) {
        const operationName = this.getOperationName();

        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The ` + operationName + ` has been Successfully <strong>${response.statusName}</strong>`, 'success');
        else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    displayStatus(event) {
        if(event == true) {
            this.displayCommentForm = false;
            this.displayReferBackForm = false;
        }
    }

    afterReferBackSuccess() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
        this.displayCommentForm = false;
        this.reloadGrid++;
    }
    
}