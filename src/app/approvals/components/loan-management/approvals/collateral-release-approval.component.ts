import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { CollateralService } from '../../../../setup/services/collateral.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'collateral-release-approval.component.html'
})

export class CollateralReleaseApprovalComponent implements OnInit {

    selected: any = null;
    pendingApprovals: any[] = [];
    displayApprovalModal: boolean = false;
    comment: string = null;
    approvalStatusId: number = null;
    show: boolean = false; message: any; title: any; cssClass: any;
    isLocationBased:boolean=false;
    collateralTypes: any[] = [];

    constructor(
        private loadingService: LoadingService,
        private collateralService: CollateralService,
    ) { }

    ngOnInit() {
        this.loadDropdowns();
        this.getPendingApprovals();
    }
    hideMessage(event){

    }
    getPendingApprovals() {
        this.loadingService.show();
        this.collateralService.getPendingCollateralRelease().subscribe((response: any) => {
            this.pendingApprovals = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    view(item) {
        this.selected = item;
        this.displayApprovalModal = true;
        this.approvalStatusId =null;
        this.comment = null;
    }

    refresh() {
        this.getPendingApprovals();
        this.displayApprovalModal = false;
        this.approvalStatusId = null;
        this.comment = null;
    }

    forward() {
        const __this = this;
        const status = +this.approvalStatusId == 2 ? 'Approve' : 'Disapprove';

        swal({
            title: status + ' Collateral Realease?',
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

            const body = {
                targetId: __this.selected.loanCollateralMappingId,
                approvalStatusId: __this.approvalStatusId,
                comment: __this.comment,
            }

            __this.collateralService.approveCustomerCollateralRelease(body).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
                    __this.refresh(); // refresh
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                }
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    // -- custom ---

    loadDropdowns() {
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
            this.collateralTypes = response.result;
        });
    }

    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }

}
 