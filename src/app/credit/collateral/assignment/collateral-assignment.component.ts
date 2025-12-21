import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
import { LoanService } from '../../services/loan.service';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule, TabViewModule } from 'primeng/primeng';
import { ApprovalStatus, GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
    templateUrl: 'collateral-assignment.component.html',
})
export class CollateralAssignmentComponent implements OnInit {

    displayModal: boolean = false;
    selectedCustomerName: string = '';
    selectedCustomerId: number;
    collateralTypes: any[] = [];
    loans: any[] = [];

    searchResults: Object;
    term = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;

    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private collateralService: CollateralService,
        private loanService: LoanService,
    ) {
        this.collateralService.search(this.term).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.loadDropdowns();
    }

    loadDropdowns() {
        this.collateralService.getCollateralTypes().subscribe((response: any) => {
            this.collateralTypes = response.result;
        });
    }

    getRunningLoans(customer): void {
        this.selectedCustomerId = customer.customerId;
        this.loadingService.show();
        this.loanService.getRunningLoan(this.selectedCustomerId).subscribe((response: any) => {
            if (response.count > 0) {
                this.loans = response.result;
                this.selectedCustomerName = customer.customerName;
                this.displayModal = true;
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }

    activeTabindex: number = 0;
    disableCollateralTab: boolean = true;
    collaterals: any[] = [];

    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 0) { this.disableCollateralTab = true; }
    }

    selectedLoanId: number = 0;
    selectedProductTypeId: number = 0;
    selectedApplicationId: number = 0;

    viewCollaterals(loan = null) {
        if (loan) {
            this.selectedLoanId = loan.loanId;
            this.selectedProductTypeId = loan.productTypeId;
        }
        this.loadingService.show();
        this.collateralService.getActiveLoanCollateral(
            this.selectedLoanId,
            this.selectedProductTypeId
        ).subscribe((response: any) => {
            this.collaterals = response.result;
            this.loadingService.hide();
            this.disableCollateralTab = false;
            this.activeTabindex = 1;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // --------------- REALTIME SEARCH ----------------------

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        const body = {
            loanId: this.selectedLoanId,
            productTypeId: this.selectedProductTypeId,
            collateralCustomerId: data.collateralId
        }
        this.loadingService.show();
        this.collateralService.assignCustomerCollateral(body).subscribe((response: any) => {
            // this.collaterals = response.result;
            this.loadingService.hide();
            this.displaySearchModal = false;
            this.viewCollaterals();
        }, (err) => {
            this.loadingService.hide(1000);
            // this.fin
        });
    }

    search(searchString) {
        searchString.preventDefault;
        this.term.next(searchString);
    }

    // dev

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
                    __this.viewCollaterals();
                    swal(GlobalConfig.APPLICATION_NAME, 'Release successful but subject to approval.', 'success');
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
