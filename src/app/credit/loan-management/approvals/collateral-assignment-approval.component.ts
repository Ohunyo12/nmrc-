import { LoanOperationService } from '../../services/loan-operations.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ApprovalService } from '../../../setup/services/approval.service';
import { LoanService } from '../../services/loan.service';
import { GeneralSetupService } from '../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'collateral-assignment-approval.component.html'
})

export class CollateralAssignmentApprovalComponent implements OnInit {

    displayRestructuringApprovalModal: boolean = false;
    loanOperationApprovalData: any[];
    loanSelectedData: any = {};
    loanSelection: any;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;


    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private loanOperationService: LoanOperationService,
        private loanService: LoanService,
        private genSetupService: GeneralSetupService,
        private approvalService: ApprovalService,
        private router: Router
    ) { }

    ngOnInit() {
        // this.loadingService.show();
        // this.getAllLoansOperationForApproval();
        // this.getAllApprovalStatus();
    }
    /*
        getAllLoansOperationForApproval() {
            this.loanOperationService.getAllLoanOperationAwaitingApproval().subscribe((response: any) => {
                this.loanOperationApprovalData = response.result;
                this.loadingService.hide();
            });
        }
    
        getAllApprovalStatus(): void {
            this.genSetupService.getApprovalStatus().subscribe((response: any) => {
                let tempData = response.result;
                this.approvalStatusData = tempData.slice(2, 4);
            });
        }
    
        viewLoanDetails(index, evt) {
            evt.preventDefault();
            this.loanSelectedData = {};
            this.loanSelectedData = this.loanOperationApprovalData[index];

    
            let dataObj = this.loanSelectedData;
            this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.loanId).subscribe((res) => {
                this.approvalWorkflowData = res.result;
            });
            //this.getSupportingDocumentsByRefNum(dataObj.preliminaryEvaluationCode);
            this.displayRestructuringApprovalModal = true;
        }
        goForApproval(formObj) {
            let loading = this.loadingService;
            let srv = this.loanService;
            this.displayRestructuringApprovalModal = false;
            let bodyObj = {
                operationId: formObj.operationTypeId,
                targetId: formObj.loanId,
                approvalStatusId: formObj.approvalStatusId,
                comment: formObj.comment
            };
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
                    if (response.success === true) {
                        __this.getAllLoansOperationForApproval();
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    } else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                        __this.displayRestructuringApprovalModal = true;
                    }
                    __this.displayRestructuringApprovalModal = false;
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
    */
}
