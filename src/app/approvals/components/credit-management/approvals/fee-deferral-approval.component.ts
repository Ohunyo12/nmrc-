import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingService } from '../../../../shared/services/loading.service';
import { CreditApprovalService } from '../../../../credit/services/credit-approval.service';
import { LoanService } from '../../../../credit/services/loan.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'fee-deferral-approval.component.html'
})

export class FeeDeferralApprovalComponent implements OnInit { 

    termLoanFeeApprovalData: any[];
    revolvingLoanFeeApprovalData: any[];
    contingentLoanFeeApprovalData: any[];
    displayLoanFeeToApproveModal = false;
    loanSelectedData: any = {};
    loanFeeSelection: any;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;
    loanSelection:any[];
    displayLoanToApproveModal:any[];
    loanApprovalData:any[];
    
    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    // file upload
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private loanService: LoanService, private genSetupService: GeneralSetupService,
        private approvalService: CreditApprovalService, private router: Router) {
    }

    ngOnInit() {
        this.loadingService.show();
        this.getTermLoansFeesForApproval();
        this.getRevolvingLoansFeesForApproval();
        this.getContingentLoansFeesForApproval();
        this.getAllApprovalStatus();
    }

    getTermLoansFeesForApproval() {
        this.loanService.getDeferredTermLoansFeesAwaitingApproval().subscribe((response: any) => {
            this.termLoanFeeApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getRevolvingLoansFeesForApproval() {
        this.loanService.getDeferredRevolvingLoansFeesAwaitingApproval().subscribe((response: any) => {
            this.revolvingLoanFeeApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getContingentLoansFeesForApproval() {
        this.loanService.getDeferredContingentLoansFeesAwaitingApproval().subscribe((response: any) => {
            this.contingentLoanFeeApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    viewLoanDetails(index, evt) {
        evt.preventDefault();
        this.loanSelectedData = {};
        this.loanSelectedData = this.termLoanFeeApprovalData[index];
        this.displayLoanFeeToApproveModal = true;
    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(type) {
        let loading = this.loadingService;
        let srv = this.loanService;

        let bodyObj = {
            targetId: this.loanSelectedData.loanId,
            approvalStatusId: this.loanSelectedData.approvalStatusId,
            comment: this.loanSelectedData.comment,
            operationId: this.loanSelectedData.operationId
        };


        loading.show();
        this.approvalService.approveLoanFeeOverride(bodyObj).subscribe((response: any) => {
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.getTermLoansFeesForApproval();
                this.getRevolvingLoansFeesForApproval();
                this.getContingentLoansFeesForApproval();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');

            }
            loading.hide();
            this.displayLoanFeeToApproveModal = false;
            this.displayConfirmDialog = false;
        }, (err) => {
            loading.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayLoanFeeToApproveModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayLoanFeeToApproveModal = false;
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

}
