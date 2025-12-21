import { LoadingService } from '../../../../shared/services/loading.service';
import { ChartOfAccountService } from '../../../../setup/services/chartofaccount.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'chartofaccount-approval.component.html',
})

export class ChartOfAccountApprovalComponent implements OnInit {

    coaFormGroup: FormGroup;
    displayCoaModal = false;
    coaApprovalData: any[] = [];
    selectedCoaData: any = {};
    selectedCoaCurrencies: string;
    approvalStatusData: any[];
    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private coaService: ChartOfAccountService,
        private approvalService: ApprovalService, private genSetupService: GeneralSetupService) { }

    ngOnInit(): void {
        this.loadingService.show();

        this.getAllAccountsAwaitingApproval(); this.getAllApprovalStatus();

    }

    getAllAccountsAwaitingApproval(): void {
        this.coaService.getAllAccountsAwaitingApproval().subscribe((response: any) => {
            this.coaApprovalData = response.result;
            this.loadingService.hide();
        });
    }

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);
        });
    }

    viewCoaDetails(index, evt) {
        evt.preventDefault();
        this.selectedCoaData = {};
        this.selectedCoaData = this.coaApprovalData[index];

        this.selectedCoaCurrencies = '';
        this.selectedCoaData.currencies.forEach(element => {
            this.selectedCoaCurrencies += element.currencyName + ' ';
        });

    

        const dataObj = this.selectedCoaData;
        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.accountId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        this.displayCoaModal = true;
    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(formObj) {

        let bodyObj = {
            targetId: formObj.accountId,
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
            __this.coaService.sendForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllAccountsAwaitingApproval();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
                __this.displayCoaModal = false;
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                __this.displayCoaModal = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayCoaModal = false;
    }

    // showMessage(message: string, cssClass: string, title: string) {
    //     this.message = message;
    //     this.title = title;
    //     this.cssClass = cssClass;
    //     this.show = true;
    // }

    // hideMessage(event) {
    //     this.show = false;
    // }

    handleChange(e) {
        this.activeIndex = e.index;
    }

}