import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../../../reports/service/report.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { Component, OnInit, ViewChild, forwardRef, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConditionPrecedentService } from '../../../../setup/services';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../../../shared/constant/app.constant';
import { LoanReviewApplicationService } from '../../../services';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import swal from 'sweetalert2';
import { ConditionChecklistComponent } from '../../../loans/loan-checklist/condition-checklist.component';
import { Subscription } from 'rxjs';

@Component({
    //selector: 'loan-review-offer-letter',
    templateUrl: 'loan-review-offer-letter.component.html'
})
export class LoanReviewOfferLetterComponent implements OnInit, OnDestroy {
    ReportType: string;
    //loanReviewApplicationId: number;
    list: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Timeline';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    form3800bSrc: any = {};
    originalForm3800bSrc: any = {};
    applicationReferenceNumber: string = '';
    reportSrc: any ={};
    displayTestReport: boolean; displayReport: boolean;
    //reportSrcv: SafeResourceUrl;
    reload: number = 0;
    proposedItems: any;
    offerLetterAccepted:any;
    loadForm3800b:boolean=false;
   
    editOption: any;
    documentContent: any;
    serverResponse: any;
    enableOfferLetterContent: boolean;
    enableDocument: boolean = false;
    displayModalSectionForm: boolean = false;
    ckeditorChanges: any;
    isFinalOfferLetter: boolean;
    showEditOfferLetterButton: boolean=false;

    detail: any = {};
    loanSystemTypeId: number = 0;
   @ViewChild(forwardRef(() =>ConditionChecklistComponent), {static: false}) conditionChecklist: ConditionChecklistComponent;

    reportSource: SafeResourceUrl;
    displayDocument: boolean;
    loanReviewApplicationId: any;
    userInfo: any;
    private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private conditionService: ConditionPrecedentService,
        private reviewService: LoanReviewApplicationService,
        private loanApplService: LoanApplicationService,
        private reportServ: ReportService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.loadForm3800b=false;
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.hideEditOfferButton();
    }

    disableApplicationInformationTab = true;
    disableLoanInformationTab = true;
    disableSupportingDocumentsTab = true;
    activeTabindex: number = 0;
    application: any = {};
    selectedLoanId: number = null;
    reloadGrid: number = 0;
    currentApprovalLevelId: number = null;
    selectedDetailId: any;
    selectedApplicationLoanId: number = 0;
    reloadLoanDetails: number = 0;
    sectionName:any;

    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 2) { }
        if (e.index == 3) { this.loadForm3800b=true }
    }

    //-------------------------Form 3800 Generate---------------------


    popoverSeeMore() {
        if (this.applicationReferenceNumber != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            this.ReportType ='Offer Letter'
            let path = '';
            const data = {
                applicationRefNumber: this.applicationReferenceNumber,

            }
        
            this.subscriptions.add(
            this.reportServ.getGeneratedOfferLetterLMS(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            }));
            this.displayReport = true;
            return;
        }
    }

    onApplicationSelected(selected) {
        this.refresh();
        this.application = selected;
        this.reloadLoanDetails = selected.loanId;
        this.disableApplicationInformationTab = false;
        this.disableSupportingDocumentsTab = false;
        this.proposedItems = selected.applicationDetails;
        this.loanReviewApplicationId = this.application.loanReviewApplicationId;
        this.activeTabindex = 1;
        this.currentApprovalLevelId = selected.currentApprovalLevelId;
        this.applicationReferenceNumber = selected.referenceNumber;//'1524044566';

       this.loanGenerateFinalOfferLetter(this.loanReviewApplicationId)

        this.reload++;
    }

    // ----------- approval ----------

    errorMessage: string = '';

    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    isSubsequent: boolean = false;


    readonly OPERATION_ID: number = 47;

    //approvalStatus(evt) { this.reset(); } // triggers reset of anything after submition

    reset() {
        this.activeTabindex = 0;
        this.application = null;
        this.currentApprovalLevelId = null;
        this.disableApplicationInformationTab = true;
        this.disableSupportingDocumentsTab = true;
        this.reloadGrid++;
        this.displayBackToCAPModal = false;
    }

    clearControls() { }

    
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
        if (x == null) { return; }
        this.loanSystemTypeId = x.loanSystemTypeId;
        this.reloadLoanDetails = x.loanId;
        this.getLoanApplicationDetail(x.loanId, x.loanSystemTypeId);
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

     showOfferLetterChecklist() {
         this.conditionChecklist.viewOfferLetterChecklist(this.application.loanReviewApplicationId);
     }

    appraisalTrail: any[] = [];
    displayBackToCAPModal: boolean = false;

    referBack() {
        this.loadingService.show();
        this.subscriptions.add(
        this.camService.getTrail(this.application.loanReviewApplicationId, this.application.operationId).subscribe((response: any) => {
            this.appraisalTrail = response.result;
            this.displayBackToCAPModal = true;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
    }
    
    trailId: number = 0;
    rmComment: string;
    
    referBackForAppraisalReview() {
        this.loadingService.show();
        const body = {
            comment: this.rmComment,
            productId: null,
            productClassId: null,
            applicationId: this.application.loanReviewApplicationId,
            operationId: this.application.operationId,
            trailId: this.trailId,
        };
        this.subscriptions.add(
        this.loanApplService.referBackForAppraisalReview(body).subscribe((res) => {
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application has been sent for further review', 'success');
                this.reset();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        }));
    }

    onTargetStaffLevelChange(trailId) { this.trailId = trailId; }

    refresh() {
        this.loanSystemTypeId = 0;
    }

    getOfferLeterTitle(data) {
        this.subscriptions.add(
        this.reportServ.GetOfferLetterTitle(data).subscribe((response: any) => {
            this.documentContent = response.result.offerLetterTitle;
            this.enableDocument = true;

        }, (err) => {
        }));
    }

    getOfferLeterSalutation(data) {
        this.reportServ.GetOfferLetterSalutation(data).subscribe((response: any) => {
            this.documentContent = response.result.offerLetterSalutation;
            this.enableDocument = true;
        }, (err) => {
        });
    }
    getOfferLeterClause(data) {
        this.subscriptions.add(
        this.reportServ.GetOfferLetterClause(data).subscribe((response: any) => {
            if(response.result!=null){this.documentContent = response.result.offerLetterClauses;}
            
            this.enableDocument = true;

        }, (err) => {
        }));
    }

    getOfferLeterAcceptance(data) {
        this.reportServ.GetOfferLetterAcceptance(data).subscribe((response: any) => {
            if(response.result!=null){this.documentContent = response.result.offerLetteracceptance;}
            this.enableDocument = true;
        }, (err) => {
        });
    }

    updateOfferLeterAcceptance(data) {
        this.subscriptions.add(
        this.reportServ.UpdateOfferLetterAcceptance(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        }));
    }


    updateOfferLeterTitle(data) {
        this.subscriptions.add(
        this.reportServ.UpdateOfferLetterTitle(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        }));
    }

    updateOfferLeterSalutation(data) {
        this.subscriptions.add(
        this.reportServ.UpdateOfferLetterSalutation(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');

        }));
    }
    updateOfferLeterClause(data) {
        this.subscriptions.add(
        this.reportServ.UpdateOfferLetterClause(data).subscribe((response: any) => {
            this.serverResponse = response.success;
            if (this.serverResponse == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfully", 'success');
                this.enableOfferLetterContent = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Record Saving failed", 'error');
                this.enableOfferLetterContent = true;
            }

        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Error has occured", 'error');
        }));
    }




    contentChange(updates) { this.ckeditorChanges = updates; }

    saveDocument() {
        if (this.ckeditorChanges != null) {
            if (this.editOption == 1) { //title
                let model = {
                    offerLetterTitle: this.ckeditorChanges,
                    customerId: this.application.customerId,
                    isLMS:true
                }
                this.updateOfferLeterTitle(model);

            } else if (this.editOption == 2) {
                let model = {
                    offerLetterSalutation: this.ckeditorChanges,
                    customerId: this.application.customerId,
                    isLMS:true
                }
                this.updateOfferLeterSalutation(model);

            } else if (this.editOption == 3) {
                let model = {
                    offerLetterClauses: this.ckeditorChanges,
                    loanApplicationId: this.application.loanReviewApplicationId,
                    isLMS:true
                }

                this.updateOfferLeterClause(model);

            } else if (this.editOption == 4) {
                let model = {
                    offerLetteracceptance: this.ckeditorChanges,
                    loanApplicationId: this.application.loanReviewApplicationId,
                    isLMS:true
                }
                this.updateOfferLeterAcceptance(model);
            } else if (this.editOption == -1) {

            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "please select an option", 'warning');
            }
        } else {

            swal(`${GlobalConfig.APPLICATION_NAME}`, "No change has been made to the content", 'warning');
            this.displayDocument = false;
        }
    }

    loadDocument() {
        if (this.editOption == 1) { //title
            this.getOfferLeterTitle(this.application.customerId);
        } else if (this.editOption == 2) {
            this.getOfferLeterSalutation(this.application.customerId);
        } else if (this.editOption == 3) {
            this.getOfferLeterClause(this.application.loanReviewApplicationId);
        } else if (this.editOption == 4) {
            this.getOfferLeterAcceptance(this.application.loanReviewApplicationId);
        } else if (this.editOption == -1) {
        } else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "please select an option", 'warning');
        }
    }


    generateFinalOfferLetter(evt) {
        console.log('this.reportSrc',this.reportSrc);
        
        let ref = this.applicationReferenceNumber;
        let body = {
            isFinal: evt,
            documentId: this.reportSrc.documentId,
            comments: '',
            documentTemplate: this.form3800bSrc.documentTemplate,
            applicationReferenceNumber: ref,
            productClassId: this.reportSrc.productClassId,
            productId: '',
            isAccepted: false,
            approvalStatusId: ApprovalStatus.PROCESSING
        }
        this.subscriptions.add(
        this.camService.update(body, this.loanReviewApplicationId).subscribe((res) => {
        }));

    }
    loanGenerateFinalOfferLetter(applicationReferenceNumber) {
        this.loanApplService.getFinalOfferLetterByLoanAppId(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.isFinalOfferLetter = tempSrc.isFinal
            });
    }
    hideEditOfferButton(){
        if(this.userInfo.staffRole=='CREDIT CONTROL'){
            this.showEditOfferLetterButton = true;
        }else{
            this.showEditOfferLetterButton = false;
        }
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

}