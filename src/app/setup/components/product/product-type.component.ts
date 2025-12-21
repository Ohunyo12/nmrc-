import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductType } from '../../models/product-type';
import { ProductTypeService } from '../../services';
import { ProductGroupService } from '../../services';
import { DealClassificationService } from '../../services';
import { AppConstant } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'product-type.component.html'
})

export class ProductTypeComponent implements OnInit {
    row:any;
    productTypes: any[];
    displayModalForm: boolean = false;
    entityName: string = 'Product Type';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    productGroups: any[];
    selectedId: number = 0;
    classifications: any[];

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private productTypeService: ProductTypeService, private productGroupService: ProductGroupService,
        private classificationService: DealClassificationService
    ) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
        this.getAllProductGroups();
        this.getAllDealClassifications();
    }

    getAll(): void {
        this.loadingService.show();
        this.productTypeService.get().subscribe((response: any) => {
            this.productTypes = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showModalForm() {
        this.clearControls();
        this.selectedId = 0;
        this.displayModalForm = true;
    }

    getAllProductGroups() {
        this.productGroupService.getProductGroups().subscribe((response: any) => {
            this.productGroups = response.result;
        });
    }

    getAllDealClassifications() {
        this.classificationService.getAllDealClassifications().subscribe((response: any) => {
            this.classifications = response.result;
            JSON.stringify(this.classifications);
        });
    }

    clearControls() {
        this.createUpdateForm = this.fb.group({
            productTypeName: ['', Validators.required],
            productGroupId: ['', Validators.required],
            dealClassificationId: ['', Validators.required],
            requirePrincipalGl: [false],
            requirePrincipalGl2: [false],
            requireInterestIncomeExpenseGl: [false],
            requireInterestReceivablePayableGl: [false],
            requireDormantGl: [false],
            requirePremiumDiscountGl: [false],
            requireOverdrawnGL: [false],
            requireRate: [false],
            requireTenor: [false],
        });
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            // productTypeId: form.value.productTypeId,
            productTypeName: form.value.productTypeName,
            productGroupId: form.value.productGroupId,
            dealClassificationId: form.value.dealClassificationId,
            requirePrincipalGl: form.value.requirePrincipalGl,
            requirePrincipalGl2: form.value.requirePrincipalGl2,
            requireInterestIncomeExpenseGl: form.value.requireInterestIncomeExpenseGl,
            requireInterestReceivablePayableGl: form.value.requireInterestReceivablePayableGl,
            requireDormantGl: form.value.requireDormantGl,
            requirePremiumDiscountGl: form.value.requirePremiumDiscountGl,
            requireOverdrawnGL: form.value.requireOverdrawnGL,
            requireRate: form.value.requireRate,
            requireTenor: form.value.requireTenor,
        };

        if (this.selectedId === 0) { // create new
            this.productTypeService.save(body).subscribe((res) => {
                if (res.success === true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        } else { // update selected
            this.productTypeService.update(body, this.selectedId).subscribe((res) => {
                if (res.success === true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        }
    }

    editProductType(index) {
        let row = index;

        this.selectedId = row.productTypeId;
        this.createUpdateForm = this.fb.group({
            productTypeName: [row.productTypeName, Validators.required],
            productGroupId: [row.productGroupId, Validators.required],
            dealClassificationId: [row.dealClassificationId, Validators.required],
            requirePrincipalGl: [row.requirePrincipalGl],
            requirePrincipalGl2: [row.requirePrincipalGl2],
            requireInterestIncomeExpenseGl: [row.requireInterestIncomeExpenseGl],
            requireInterestReceivablePayableGl: [row.requireInterestReceivablePayableGl],
            requireDormantGl: [row.requireDormantGl],
            requirePremiumDiscountGl: [row.requirePremiumDiscountGl],
            requireOverdrawnGL: [row.requireOverdrawnGL],
            requireRate: [row.requireRate],
            requireTenor: [row.requireTenor],
        });
        this.displayModalForm = true;
    }

    deleteProductType(index, evt) {
        evt.preventDefault();
        let row = index;

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
            __this.productTypeService.delete(row.productTypeId).subscribe((res) => {
                __this.loadingService.hide();
                __this.displayModalForm = false;
                if (res.success === true) {
                    __this.clearControls();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success')
                    __this.getAll();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error')
                }
            }, (err: any) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
                __this.loadingService.hide();
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    finishBad(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error')
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayModalForm = false;
        this.clearControls();
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'success')
        this.getAll();
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

}