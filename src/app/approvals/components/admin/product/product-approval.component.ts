import { LoadingService } from '../../../../shared/services/loading.service';
import { ProductService } from '../../../../setup/services/product.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'product-approval.component.html',
})

export class ProductApprovalComponent implements OnInit {
    riskRatings: any[];
    productFormGroup: FormGroup;
    displayProductModal = false;
    productApprovalData: any[] = [];
    selectedProductData: any = {};
    approvalStatusData: any[];
    selectedProductCurrencies: string;
    selectedProductFees: any;
    selectedProductCollateral: any;

    approvalWorkflowData: any[];
    activeIndex = 0;

    displayConfirmDialog: boolean;
    width: string;
    message: string;
    title: string;

    constructor(private productService: ProductService, private fb: FormBuilder,
        private loadingService: LoadingService,
        private approvalService: ApprovalService, private genSetupService: GeneralSetupService
    ) { }

    ngOnInit(): void {
        this.loadingService.show();

        this.getAllProductsAwaitingApproval(); this.getAllApprovalStatus();
    }

    getAllProductsAwaitingApproval(): void {
        this.productService.getAllProductsAwaitingApproval().subscribe((response: any) => {
            this.productApprovalData = response.result;

            this.loadingService.hide();
        });
    }
    getAllRiskRatingType() {
        this.productService.getRiskRatingTypes().subscribe((response: any) => {
            this.riskRatings = response.result;
        });
      }
      getRiskRatingName(id) {
        let item = this.riskRatings.find(x => x.lookupId == id);
        if (item != undefined) { return item.lookupName; }
        return 'n/a';
      }
    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            let tempData = response.result;
            this.approvalStatusData = tempData.slice(2, 4);

            this.loadingService.hide();
        });
    }

    viewProductDetails(index, evt) {
        evt.preventDefault();
        this.selectedProductData = {};
        this.selectedProductData = index;

        this.selectedProductCurrencies = '';
       if(this.selectedProductData.currencies != null){
            this.selectedProductData.currencies.forEach(element => {
                this.selectedProductCurrencies += element.currencyName + ' ';
            });
        }



        // this.selectedProductData.fees.forEach(element => {
        //     this.selectedProductCurrencies += element + ' ';
        // });

        // this.selectedProductData.collateral.forEach(element => {

        // });

        let dataObj = this.selectedProductData;
        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.productId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });
        this.displayProductModal = true;
    }

    showConfirmDialog() {
        this.title = 'Go For Approval';
        this.message = 'Are you sure you want to perform this action ?';
        this.width = '400';
        this.displayConfirmDialog = true;
    }

    goForApproval(formObj) {
        let loading = this.loadingService;
        let srv = this.productService;
        let getProducts = this.getAllProductsAwaitingApproval;

        let bodyObj = {
            targetId: formObj.productId,
            approvalStatusId: formObj.approvalStatusId,
            comment: formObj.comment
        };

        this.displayProductModal = false;

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
            __this.productService.approveProduct(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllProductsAwaitingApproval();
                } else {
                    __this.displayProductModal = true;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                __this.loadingService.hide();
                __this.displayProductModal = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                __this.displayProductModal = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    cancelApproval() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
        this.displayConfirmDialog = false;
        this.displayProductModal = false;
    }

    hideModal() {
        this.handleChange(0);
        this.activeIndex = 0;
        this.displayProductModal = false;
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