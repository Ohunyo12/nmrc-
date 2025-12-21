import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { ApprovalStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import swal from 'sweetalert2';

// COMPONENT TO BE USED ONLY FOR LMS APPROVAL!

@Component({
    templateUrl: 'approval-actions.component.html',
    selector: 'app-approval-actions',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class ApprovalActionsComponent implements OnInit {

    @Input() operationId: number = 0;
    @Input() applicationId: number = 0;
    @Output() approvalStatusId: EventEmitter<any> = new EventEmitter<any>();
    @Output() cancelReferBack: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() referBackSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() set levelId(value: number) { this.getUserPrivileges(value); }
    @Input() isDrawdown = false;
    @Input() enableForwardButton = true;
    @Input() enableDeclineButton = true;
    @Input() enableReferBackButton = true;
    @Input() isAccountOfficerDrawdown: boolean;
    
    @Input() displayReferBackForm = false;
    @Input() forbidExternalNotification = false;
    @Input() isClassified = false;
    @Input() currentLevelId = 0;
    @Input() isLMSCrossWorkflow = false;
    @Input() referBackOperationId = this.operationId;
    @Input() referBackTargetId = this.applicationId;

    list: any[];
    isAvailment: boolean = false;
    isAvailmentPage: boolean = false;
    displayAddModal: boolean = false;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    commentLabel: string = 'Comment';

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private reviewService: LoanReviewApplicationService,
    ) { }

    ngOnInit() {
        this.clearControls();
    }

    selectedApplicationLoanId: number = 0;
    reloadLoanDetails: number = 0;

    // ----------- approval ----------

    errorMessage: string = '';

    isBoard: boolean = false;
    isAnalyst: boolean = false;
   
    isBusiness: boolean = false;
    isSubsequent: boolean = false;

    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;

    // readonly REVIEW_OFFERLETTER_OPERATION_ID: number = 47;

    // resolve privileges

    privilege: any = {
        viewCamDocument: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        viewUploadedFiles: false,
        canUploadFile: false,
        viewApproval: false,
        canApprove: false,
        approvalLimit: 0,
        approvalLevelId: 0,
        groupRoleId: 0,
        canEscalate: false,
        owner: false,
    };

    getUserPrivileges(levelId: number = null) {
        let body = {
            levelId: levelId,
            operationId: this.operationId,
            targetId: this.applicationId,
            productClassId: null, // @input
            productId: null,
        }
        this.camService.getPrivilege(body).subscribe((response: any) => {
            this.privilege = response.result;
           // console.log('privilege',this.privilege);
        });
    }

    clearControls(): void {
        this.commentForm = this.fb.group({
            comment: ['', Validators.required], // debug_test, flow_test
            vote: [''],
            trailId: [''],
            statusId: [''],
        });
    }

    cancelForm() {
        this.displayCommentForm = false;
        this.errorMessage = '';
        this.receiverLevelId = null;
        this.receiverStaffId = null;
    }

    forwardApplication(form) {
        let body = {
            forwardAction: this.forwardAction,
            applicationId: this.applicationId,
            operationId: this.operationId,
            receiverLevelId: this.receiverLevelId, // refer back
            receiverStaffId: this.receiverStaffId, // refer back
            comment: form.value.comment,
            isBusiness: this.isBusiness,
            isAvailment: this.isAvailment,
        };
        this.errorMessage = '';
        this.loadingService.show();
        this.reviewService.forwardApplication(body).subscribe((response: any) => {
            if (response.success == true) {
                this.approvalStatusId.emit(response.result);
                this.reset();
                this.displayCommentForm = false;
                this.clearControls();
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.result.responseMessage, 'success');
            // this.displayApplicationStatusMessage(response.result);
            } else {
                this.finishBad(response.message);
                this.errorMessage = response.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.errorMessage = err;
        });
    }

    displayApplicationStatusMessage(statusId: number) {
        const operationName = this.getOperationName();
        if (statusId == ApprovalStatus.APPROVED)
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'The ' + operationName + ' has been <strong>approved</strong>!', 'success');
        
        if (statusId == ApprovalStatus.DISAPPROVED)
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'The ' + operationName + ' has been <strong>rejected</strong>!', 'error');
    }

    getOperationName() {
        switch (this.operationId) {
            case 47: return 'offer letter';
            case 48: return 'availment';
            default: return 'operation';
        }
    }

    reset() {
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity(); // emit
    }

    // trail & comment

    trail: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

    getTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.applicationId, this.operationId).subscribe((response: any) => {
            this.trail = response.result;
            this.trailCount = this.trail.length;
            this.trailRecent = response.result[0];
            response.result.forEach((trail) => {
                if (this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
                    this.trailLevels.push(trail);
                }
            });
            this.referBackTrail();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    referBackTrail(): any {
        this.trail.forEach(x => {
            if (this.backtrail.find(t =>
                t.fromApprovalLevelId == x.fromApprovalLevelId
                && t.requestStaffId == x.requestStaffId
            ) == null && x.fromApprovalLevelId != null
            ) {
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

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    // ------------ actions ------------
    forward() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.PROCESSING;
        this.displayCommentForm = true;
        this.commentTitle = 'Forward';
        this.isAvailment = false;
    }

    approve() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.APPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Approve';
        if (this.isBusiness) { }
        if (this.isAvailmentPage == true)
        {
            this.isAvailment = true;
        }
    }

    disapprove() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Reject';
    }

    refer() {
        // this.clearControls();
        // this.forwardAction = ApprovalStatus.REFERRED;
        // this.displayCommentForm = true;
        // this.commentTitle = 'Refer Back';
        // this.getTrail();
        // let control = this.commentForm.controls['trailId'];
        // control.setValidators([Validators.required]);
        // control.updateValueAndValidity();
        // this.commentForm.controls['vote'].setValue(3);
        this.displayReferBackForm = true;
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

    displayStatus(event) {
        this.cancelReferBack.emit(true);
        this.displayReferBackForm = false;
    }

    referBackResultControl(event) {
        this.referBackSuccess.emit(true);
        this.displayReferBackForm = false;
    }


}