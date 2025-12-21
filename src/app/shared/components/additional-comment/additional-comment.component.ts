import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService } from '../../../setup/services';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'additional-comment.component.html',
    selector: 'app-additional-comment',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class AdditionalCommentComponent implements OnInit {

    // @Input() panel: boolean = false;
    // @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() applicationId: number;
    // @Input() proposedItems: any[] = [];
    // @Input() isAnalyst: boolean = false;

    @Input() set reload(value: number) { if (value > 0) this.getAdditionalComments(); }

    // @Output() approvalStatusId: EventEmitter<any> = new EventEmitter<any>();
    formState: string = 'New';

    selectedId: number = null;
    displayAdditionalCommentForm: boolean = false;
    additionalComments: any[] = [];
    additionalCommentForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        //this.getAdditionalComments();
        this.clearControls();
    }

    clearControls() {
        this.formState = 'New';
        this.additionalCommentForm = this.fb.group({
            additionalComment: ['', Validators.required],
        });
    }

    editAdditionalComment(row) {
        this.formState = 'Edit';
        this.selectedId = row.id;
        this.additionalCommentForm.setValue({additionalComment: row.additionalComment});
        // this.additionalCommentForm = this.fb.group({
        //     additionalComment: [row.additionalComment, Validators.required],
        // });
        this.displayAdditionalCommentForm = true;
    }

    showAdditionalCommentForm() { 
        this.formState = 'New';
        this.additionalCommentForm.reset();
        this.selectedId = null;
        this.displayAdditionalCommentForm = true;
    }

    getAdditionalComments() {
        if(!(this.applicationId > 0) || !(this.callerId > 0)){
            return;
        }
        this.camService.getAdditionalComment(this.applicationId,this.callerId).subscribe((response: any) => {
            this.additionalComments = response.result;
        }, (err) => {
        });
    }

    saveAdditionalComment(form) {
        let body = {
            additionalComment: form.value.additionalComment,
            applicationId: this.applicationId,
            callerId: this.callerId, // 1/2
            selectedId: this.selectedId
        };

        if (this.selectedId == null) {
            this.camService.saveAdditionalComment(body).subscribe((response: any) => {
                if (response.result == true) this.reloadGrid();
                this.selectedId == null;
            }, (err) => {
            });
        } else {
            this.camService.editAdditionalComment(body, this.selectedId).subscribe((response: any) => {
                if (response.result == true) this.reloadGrid();
                this.selectedId == null;
            }, (err) => {
            });
        }        
    }

    deleteAdditionalComment(row) { 
        this.camService.deleteAdditionalComment(row.id).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
            this.selectedId == null;
        }, (err) => {
        });
    }

    reloadGrid() {
        this.displayAdditionalCommentForm = false;
        this.getAdditionalComments();
        this.selectedId == null;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {;
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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
}