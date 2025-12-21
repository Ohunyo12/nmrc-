import { LoadingService } from '../../../../shared/services/loading.service';
import { StaffService } from '../../../../admin/services/staff.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'staff-delete-approval.component.html',
    styleUrls: ['staff-approval.component.scss'],
})

export class StaffDeleteApprovalComponent implements OnInit {

    display: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    width: string;

    sensitivities: any[];
    data: any = {};
    companies: any[];
    branches: any[];
    staffFormGroup: FormGroup;
    branchLoaded: boolean = false;
    departments: any[];
    staffDataset: any[];
    approvalStatusData: any[];
    states: any[];
    cities: any[];
    totalRecords: number;
    cityLoaded: boolean = false;
    jobTitles: any[];
    misInfo: any[];
    ranks: any[];
    selectedStaff: any;
    approvalWorkflowData: any[];
    activeIndex = 0;
    multipleStaffData: any;
    displayConfirmDialog: boolean;
    displayMultipleModel: boolean = false;
    multipleData: any = {};
    constructor(private staffService: StaffService, private fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalService: ApprovalService
    ) { }

    ngOnInit() {
        this.loadingService.show();
        this.multipleStaffData = [];
        this.getAllStaffDeleteWaitingForApproval(); this.getAllApprovalStatus();
    }

    getAllStaffDeleteWaitingForApproval() {
        this.staffService.getStaffDeleteRequestAwaitingApprovals().subscribe((response: any) => {
            this.staffDataset = response.result;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus() {
        this.staffService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    viewDetails(evt, indx) {
        evt.preventDefault();
        this.data = {};
        this.data = this.staffDataset[indx];

        let dataObj = this.data;
        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.staffId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        this.display = true;
    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    viewUpdatedStaff(evt) {
        evt.preventDefault();
        // alert("updated Staff");
    }

    viewNewStaff(evt) {
        evt.preventDefault();
        // alert("New Staff");
    }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.staffService;
        let getStaff = this.getAllStaffDeleteWaitingForApproval;

        let bodyObj = {
            targetId: formObj.staffId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };

        this.display = false;

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
            __this.staffService.approveStaffDelete(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllStaffDeleteWaitingForApproval();
                } else {
                    __this.display = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.display = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
    goForBulkApproval() {
        let loading = this.loadingService;
        let srv = this.staffService;
        let getStaff = this.getAllStaffDeleteWaitingForApproval;
        let bodyObj = [];

        this.multipleStaffData.forEach(el => {
            let body = {
                targetId: el.staffId,
                approvalStatusId: this.multipleData.approvalStatusId,
                comment: this.multipleData.comment
            };
            bodyObj.push(body);
        });



        this.display = false;

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
            __this.staffService.approveBulkStaff(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    __this.multipleData = [];
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllStaffDeleteWaitingForApproval();
                    __this.displayMultipleModel = false;
                } else {
                    __this.displayMultipleModel = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.displayMultipleModel = false;
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
        this.display = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.display = false;
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

    handleChange(e) {
        this.activeIndex = e.index;
    }
    ShowApproveBulkStaff() {
        this.multipleData = [];
        this.displayMultipleModel = true;
    }
}