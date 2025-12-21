import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule, TabViewModule } from 'primeng/primeng';
import { ApprovalStatus, GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'collateral-release.component.html',
})
export class CollateralReleaseComponent implements OnInit {

    showCustomerCollaterals: boolean = false;

    selectedCustomerId: number;
    collateralTypes: any[] = [];
    customerCollaterals: any[] = [];

    // @Output() hide: EventEmitter<any> = new EventEmitter<string>();
    
    constructor(
        private loadingService: LoadingService, 
        private fb: FormBuilder, 
        private collateralService: CollateralService,
    ) { }

    ngOnInit() { 
        this.loadDropdowns();
       
    }

    loadDropdowns() {
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
           this.collateralTypes = response.result;
        });
    }

    getCustomerCollateral(id): void {
        this.selectedCustomerId = id;
        this.loadingService.show();
        this.collateralService.getActiveCustomerCollateral(id).subscribe((response: any) => {
            this.customerCollaterals = response.result;
            this.showCustomerCollaterals = true;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }
    
    releaseConfirm(id) {
        const __this = this;
        swal({
            title: 'Release Collateral?',
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
            // let body = { loanCollateralMappingId: id }
            __this.collateralService.releaseCustomerCollateral(id).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Release successful but subject to approval.', 'success');
                    __this.getCustomerCollateral(__this.selectedCustomerId);
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
}
