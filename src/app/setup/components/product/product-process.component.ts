import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ProductService } from '../../services';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'product-process.component.html'
})

export class ProductProcessComponent implements OnInit {

    productProcessData: any[] = [];
    productProcessForm: FormGroup;
    displayAddUpdateModal: boolean = false;
    panelHeader: string;
    displayModalForm:boolean;
    constructor(private _fb: FormBuilder, private _loadingService: LoadingService, private _productService: ProductService) {

    }

    ngOnInit() {
        this._loadingService.show();

        this.initializeForm();

        this.getAllProductProcesses();
    }

    initializeForm() {
        this.productProcessForm = this._fb.group({
            productClassProcessId: [''],
            productClassProcessName: ['', Validators.required],
            maximumAmount: ['', Validators.required],
            useAmountLimit: ['']
        });
    }

    getAllProductProcesses() {
        this._productService.getAllProductProcess().subscribe((res) => {
            this.productProcessData = res.result;
            this._loadingService.hide();
        }, (err) => {
        });
    }

    showModalForm() {
        this.initializeForm();
        this.panelHeader = 'Add Product Process';
        this.displayAddUpdateModal = true;
    }

    hideModalForm() {
        this.displayAddUpdateModal = false;
        this.initializeForm();
    }

    editProductProcess(index, evt) {
        evt.preventDefault();
        this._loadingService.show();

        this.panelHeader = 'Edit Product Process';

        const row = index;

        this.productProcessForm = this._fb.group({
            productClassProcessId: [row.productClassProcessId],
            productClassProcessName: [row.productClassProcessName],
            maximumAmount: [row.maximumAmount],
            useAmountLimit: [row.useAmountLimit]
        });

        this._loadingService.hide();

        this.displayAddUpdateModal = true;
    }

    submitForm(formObj) {

        const obj = formObj.value;


        this._loadingService.show();

        if (obj.productClassProcessId < 0) {
            this._productService.addProductProcess(obj).subscribe((res) => {
                this._loadingService.hide();
                if (res.success === true) {
                    this.showSuccess(res.message);
                    this.getAllProductProcesses();
                } else {
                    this.showError(res.message);
                }
            }, (err) => {
                this._loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });
        } else {
            this._productService.updateProductProcess(obj.productClassProcessId, obj).subscribe((res) => {
                this._loadingService.hide();
                if (res.success === true) {
                    this.showSuccess(res.message);
                    this.getAllProductProcesses();
                } else {
                    this.showError(res.message);
                }
            }, (err) => {
                this._loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });
        }
       
    }

    showSuccess(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'success');
        this.initializeForm();
        this.displayAddUpdateModal = false;
    }

    showError(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
    }
}