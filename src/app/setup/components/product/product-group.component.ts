import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductGroup } from '../../models/product-group';
import { ProductGroupService } from '../../services';
import { AppConstant } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'product-group.component.html'
})
export class ProductGroupComponent implements OnInit {

    productGroups: any[]; // ProductGroup[] failing in editProductGroup() method ?
    displayModalForm: boolean = false;
    entityName: string = 'Product Group';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    panelHeader = 'Add Product Group';
    isUpdate:boolean;
    constructor(private loadingService: LoadingService, private fb: FormBuilder, private productGroupService: ProductGroupService) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
    }

    getAll(): void {
        this.loadingService.show();
        this.productGroupService.getProductGroups().subscribe((response: any) => {
            this.productGroups = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showModalForm() {
        this.panelHeader = 'Add Product Group';

        this.clearControls();

        this.displayModalForm = true;
    }

    clearControls() {

        this.createUpdateForm = this.fb.group({
            productGroupId: [''],
            productGroupCode: ['', Validators.required],
            productGroupName: ['', Validators.required],
        });
    }

    submitForm(form) {
        let body = {
            productGroupCode: form.value.productGroupCode,
            productGroupName: form.value.productGroupName,
        };

        let objectId: any = form.value.productGroupId;
        if (objectId === '') { // create new
            this.productGroupService.save(body).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    this.clearControls();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success')
                    this.displayModalForm = false;
                    this.getAll();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error')
                }

            }, (err: any) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
            });

        } else { // update selected
            this.productGroupService.update(body, objectId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    this.clearControls();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.displayModalForm = false;
                    this.getAll();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }

            }, (err: any) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });

        }
    }

    editRow(index) {
        var row = index;

        this.panelHeader = `Edit Product Group - ${row.productGroupCode}`;

        this.createUpdateForm = this.fb.group({
            productGroupId: [row.productGroupId, Validators.required],
            productGroupCode: [row.productGroupCode, Validators.required],
            productGroupName: [row.productGroupName, Validators.required],
        });

        this.displayModalForm = true;
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

    deleteProductGroup(index, evt) {
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
            __this.productGroupService.delete(row.productGroupId).subscribe((res) => {
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
}