import { Component, OnInit } from '@angular/core';
import { ProductFeeEdit } from '../../models/productFeeEdit';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductFeeService } from '../../services';
import { CollateralService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { ProductService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-product-definition-edit',
    templateUrl: 'product.definition.edit.component.html'
})

export class ProductDefinitionEditComponent implements OnInit {
    show: boolean = false;
    display: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    productTypes: any[];
    productCategories: any[];
    products: any[];
    productName: string;
    productTypeId: any = "";
    categoryId: any = "";
    productId: number = 0;
    selectedProduct: any = {};
    feedMapped: any[];
    feesNotMapped: any[];
    securityMapped: any[] = [];
    securityNotMapped: any[] = [];
    feeEdit: FormGroup;
    selectedFee: any = {};
    selectedFeeIndex: number;
    
    constructor(private productService: ProductService,
        private loaddingService: LoadingService,
        private colateralService: CollateralService,
        private productFeeSrv: ProductFeeService,
        private fb: FormBuilder,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.initializeForm();
        this.productId = this.route.snapshot.params["productId"];
        if (this.productId > 0) {
            this.loadAllData();
        }
    }

    loadAllData() {
        this.getUnMappedColateral(this.productId);
        this.getMappedColateral(this.productId);
        this.getUnmappedFees(this.productId);
        this.getMappedFees(this.productId);
    }

    getUnmappedFees(productId) {
        this.productFeeSrv.getUmappedFees(productId)
            .subscribe((response: any) => {
                this.feesNotMapped = response.result;

            }, (err) => {
                this.loaddingService.hide();
            });
    }

    getMappedFees(productId) {
        this.productFeeSrv.getMappedFees(productId)
            .subscribe((response: any) => {
                this.feedMapped = response.result;
                this.loaddingService.hide();


            }, (err) => {
                this.loaddingService.hide();
            });
    }


    getUnMappedColateral(productId) {
        this.loaddingService.show();
        this.colateralService.getUnmappedCollateralToProduct(productId)
            .subscribe((response: any) => {
                this.securityNotMapped = response.result;

            }, (err) => {
                this.loaddingService.hide();
            })
    }

    getMappedColateral(productId) {
        this.colateralService.getMappedCollateralToProduct(productId)
            .subscribe((response: any) => {
                this.securityMapped = response.result;

            }, (err) => {
                this.loaddingService.hide();
            })
    }

    removeSecurity(index, evt) {
        evt.preventDefault();
        this.loaddingService.show();
        let SelectedSecurity = this.securityMapped[index];
        let selectedId = SelectedSecurity.productCollateralId;
        this.colateralService.removeColateralFromProduct(selectedId)
            .subscribe((response: any) => {
                this.loaddingService.hide();
                if (response.success == true) {

                    this.securityNotMapped.push(SelectedSecurity);
                    this.securityMapped.splice(index, 1);

                } else {
                    this.showMessage(response.message, "error", "FintrakBanking");
                }

            }, (err) => {
                this.loaddingService.hide();
                this.showMessage("An unknown error has occured, please contact your administrator", "error", "FintrakBanking");
            });
    }

    mapSecurity(index, evt) {

        evt.preventDefault();
        this.loaddingService.show()
        let currSecurity = this.securityNotMapped[index];
        let postBody = {
            "collateralTypeId": currSecurity.collateralTypeId,
            "companyId": 0,
            "productId": this.productId
        }

        this.colateralService.mapColateralToProduct(postBody)
            .subscribe((response: any) => {
                if (response.success == true) {
                    if (this.securityMapped == undefined) {
                        this.securityMapped = [];
                    }
                    this.securityMapped.push(currSecurity);
                    this.securityNotMapped.splice(index, 1);
                    this.loaddingService.hide()
                } else {
                    this.loaddingService.hide()
                    this.showMessage(response.message, "error", "FintrakBanking");
                }
            }, (err) => {
                this.loaddingService.hide()
            });
    }

    mapFee(index, evt) {
        evt.preventDefault();
        this.selectedFeeIndex = index;
        this.selectedFee = this.feesNotMapped[index];
        this.feeEdit = this.fb.group({
            productId: [this.productId],
            feeId: [this.selectedFee.feeId],
            feeName: [this.selectedFee.feeName],
            feeTargetName: [this.selectedFee.feeTargetName],
            feeIntervalName: [this.selectedFee.feeIntervalName],
            feeTypeName: [this.selectedFee.feeTypeName],
            glAccountCode: [''],
            glAccountName: [this.selectedFee.accountCategoryName],
            rateValue: [0],
            dependentAmount: [0],
            accountCategoryName: [this.selectedFee.accountCategoryName]
        });
        this.display = true;
    }

    onFormSubmitted({ value, valid }: { value: ProductFeeEdit, valid: boolean }) {
        this.loaddingService.show();
        this.productFeeSrv.mapFeeToProduct(value)
            .subscribe((response: any) => {
                this.loaddingService.hide();
                if (response.success == true) {
                    this.feesNotMapped.splice(this.selectedFeeIndex, 1);
                    this.getMappedFees(this.productId);
                    this.display = false;
                } else {
                    this.showMessage(response.message, "error", "FintrakBanking");
                }

            }, (err) => {
                this.loaddingService.hide();
            })
    }

    removeFee(idx, evt) {
        evt.preventDefault();
        this.loaddingService.show();
        let targetFee = this.feedMapped[idx];
        let pFeeId = targetFee.productFeeId;
        this.productFeeSrv.removeFeeFromProduct(pFeeId)
            .subscribe((response: any) => {
                this.loaddingService.hide();
                if (response.success == true) {
                    this.feedMapped.splice(idx, 1);
                } else {
                    this.showMessage(response.message, "error", "FintrakBanking");
                }
            }, (err) => {
                this.loaddingService.hide();
                this.showMessage("There was an unknown eror please contact your administrator", "error", "FintrakBanking")
            });

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

    initializeForm() {
        this.feeEdit = this.fb.group({
            productId: ['', Validators.required],
            feeId: ['', Validators.required],
            feeName: [''],
            feeTargetName: ['',],
            feeIntervalName: [''],
            feeTypeName: [''],
            glAccountCode: ['', Validators.required],
            glAccountName: [''],
            rateValue: [0, Validators.required],
            dependentAmount: [0, Validators.required],
            accountCategoryName: ['']
        });
    }
}