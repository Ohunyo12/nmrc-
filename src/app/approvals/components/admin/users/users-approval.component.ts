import { LoadingService } from '../../../../shared/services/loading.service';
import { ChartOfAccountService } from '../../../../setup/services/chartofaccount.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AdminService } from '../../../../admin/services/admin.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'users-approval.component.html',
})

export class UsersApprovalComponent implements OnInit {

    usersFormGroup: FormGroup;
    displayUsersModal = false;
    usersApprovalData: any[] = [];
    selectedUserData: any = {};
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private approvalService: ApprovalService, private adminService: AdminService,
        private genSetupService: GeneralSetupService) { }

    ngOnInit(): void {
        this.loadingService.show();

        this.getAllUsersAwaitingApproval(); this.getAllApprovalStatus();

    }

    getAllUsersAwaitingApproval(): void {
        this.adminService.getAllUsersAwaitingApproval().subscribe((response: any) => {
            this.usersApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    viewUserDetails(index, evt) {
        evt.preventDefault();
        this.selectedUserData = {};
        this.selectedUserData = this.usersApprovalData[index];

    

        const dataObj = this.selectedUserData;
        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.user_id).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });

        this.displayUsersModal = true;

    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(formObj, event) {
        let loading = this.loadingService;
        let srv = this.adminService;

        let bodyObj = {
            targetId: formObj.user_id,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };

        this.displayUsersModal = false;

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
            __this.adminService.sendForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllUsersAwaitingApproval();
                } else {
                    __this.displayUsersModal = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.displayUsersModal = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    cancelApproval(event) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayUsersModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayUsersModal = false;
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

}
