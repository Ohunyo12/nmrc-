import { LoadingService } from '../../../../shared/services/loading.service';
import { CustomerGroupService } from '../../../../customer/services/customer-group.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'customergroupmapping-approval.component.html'
})

export class CustomerGroupMappingApprovalComponent implements OnInit {

    customergroupFormGroup: FormGroup;
    displayCustGrpModal = false;
    custGrpMappingApprovalData: any[] = [];
    selectedCustGrpData: any = {};
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private approvalService: ApprovalService, private custGrpService: CustomerGroupService,
        private genSetupService: GeneralSetupService) { }

    ngOnInit() {
        this.loadingService.show();

        this.getAllCustGrpMapAwaitingApproval(); this.getAllApprovalStatus();

    }

    getAllCustGrpMapAwaitingApproval(): void {
        this.custGrpService.getAllCustomerGroupMappingAwaitingApproval().subscribe((response: any) => {
            this.custGrpMappingApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    viewCustGrpDetails(index, row, evt) {
        evt.preventDefault();
        this.selectedCustGrpData = {};
        //this.selectedCustGrpData = this.custGrpMappingApprovalData[index];
        this.selectedCustGrpData = row;


        const dataObj = this.selectedCustGrpData;
        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.customerGroupId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });

        this.displayCustGrpModal = true;
    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.custGrpService;

        let bodyObj = {
            targetId: formObj.customerGroupMappingId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };

        this.displayCustGrpModal = false;

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
            __this.custGrpService.sendCustomerGroupMappingForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    //swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    if (__this.selectedCustGrpData.approvalStatusId == 2) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Group Mapping has been approved successfully!', 'success');
                    }
                    else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Group Mapping has been rejected successfully!', 'success');
                    }
                    __this.getAllCustGrpMapAwaitingApproval();
                } else {
                    __this.displayCustGrpModal = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.displayCustGrpModal = false;
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
        this.displayCustGrpModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayCustGrpModal = false;
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }
}