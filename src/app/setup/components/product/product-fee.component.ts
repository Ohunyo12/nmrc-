import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

//import { ProductFee } from 'app/setup/models/product-fee';
import { ProductFeeService } from '../../services';

@Component({
    templateUrl: 'product-fee.component.html',
})
export class ProductFeeComponent implements OnInit {
    
    productFees: any[];
    displayModalForm: boolean = false;
    entityName: string = 'Fee';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    accountCategories: any[];
    productFeeTypes: any[];
    productFeeIntervals: any[];
    productTypes: any[];
    productFeeTargets: any[];
    chartOfAccounts: any[];
    filteredGLAccounts: any[];
    amortisationTypes: any[];
    disableCutOffDay: boolean = true;
    selectedAccountCategoryId: number;
    selectedId?: number;
    disableFeeGlSelect: boolean = true;

    constructor(private loadingService: LoadingService,
        private fb: FormBuilder, private productFeeService: ProductFeeService) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
        this.loadDropdowns();
    }

    paginate(obj){

    }
    loadDropdowns() {
        this.productFeeService.getAccountCategories().subscribe((response: any) => {
            this.accountCategories = response.result;
        });
        this.productFeeService.getProductFeeTypes().subscribe((response: any) => {
            this.productFeeTypes = response.result;
        });
        this.productFeeService.getProductFeeIntervals().subscribe((response: any) => {
            this.productFeeIntervals = response.result;
        });
        this.productFeeService.getProductTypes().subscribe((response: any) => {
            this.productTypes = response.result;
        });
        this.productFeeService.getProductFeeTargets().subscribe((response: any) => {
            this.productFeeTargets = response.result;
        });
        this.productFeeService.getAllChartOfAccounts().subscribe((response: any) => {
            this.chartOfAccounts = response.result;
            
        });
        this.productFeeService.getAmortisationTypes().subscribe((response: any) => {
            this.amortisationTypes = response.result;
        });
    }

    onChangeIncludeCutOffDay() {
        if (this.createUpdateForm.value.includeCutOffDay == true) {
            this.disableCutOffDay = false;
        } else {
            this.disableCutOffDay = true;
        }
    }

    onAccountCategoryChange(id) {
        this.selectedAccountCategoryId = id;
        this.filteredGLAccounts = this.chartOfAccounts.filter(x => x.accountCategoryId == id);
        // this.createUpdateForm.controls['glAccountId'].setValue("");
        if (this.filteredGLAccounts.length == 0)
            this.disableFeeGlSelect = true;
        else
            this.disableFeeGlSelect = false;
    }

    getAll(): void {
        this.loadingService.show();
        this.productFeeService.get().subscribe((response: any) => {
            this.productFees = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }
    
    showModalForm() {
        this.clearControls();
        this.displayModalForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.createUpdateForm = this.fb.group({
            productFeeId: [''],
            feeName: ['', Validators.required],
            accountCategoryId: ['', Validators.required],
            feeTypeId: ['', Validators.required],
            feeIntervalId: ['', Validators.required],
            productTypeId: ['', Validators.required],
            feeTargetId: ['', Validators.required],
            glAccountId: ['', Validators.required],
            feeAmortisationTypeId: ['', Validators.required],
            includeCutOffDay: [false],
            cutOffDay: ['', Validators.compose([ValidationService.monthDate, ValidationService.isNumber])],
            isIntegral: ['']
            // feeDate: ['', Validators.required],
        });
    }

    submitForm(form) { 
        this.loadingService.show();
        let body = {
            // productFeeId: form.value.productFeeId,
            feeName: form.value.feeName,
            accountCategoryId: form.value.accountCategoryId,
            feeTypeId: form.value.feeTypeId,
            feeIntervalId: form.value.feeIntervalId,
            productTypeId: form.value.productTypeId,
            feeTargetId: form.value.feeTargetId,
            glAccountId: form.value.glAccountId,
            feeAmortisationTypeId: form.value.feeAmortisationTypeId,
            includeCutOffDay: (form.value.includeCutOffDay != null) ? form.value.includeCutOffDay : false,
            cutOffDay: (form.value.cutOffDay != '') ? form.value.cutOffDay : 0,
            // feeDate: form.value.feeDate,
            companyid: 1, // throws exception without this,
            isIntegral: form.value.isIntegral
        };

        if (this.selectedId === null) {
            this.productFeeService.save(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        } else { // update selected
            this.productFeeService.update(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        }
    }

    editProductFee(index) {
        var row = this.productFees[index];
        this.selectedId = row.feeId;       
        this.disableFeeGlSelect = false;
        this.createUpdateForm = this.fb.group({
            productFeeId: [row.productFeeId],
            feeName: [row.feeName, Validators.required],
            accountCategoryId: [row.accountCategoryId, Validators.required],
            feeTypeId: [row.feeTypeId, Validators.required],
            feeIntervalId: [row.feeIntervalId, Validators.required],
            productTypeId: [row.productTypeId, Validators.required],
            feeTargetId: [row.feeTargetId, Validators.required],
            glAccountId: [row.glAccountId, Validators.required],
            feeAmortisationTypeId: [row.feeAmortisationTypeId, Validators.required],
            includeCutOffDay: [row.includeCutOffDay],
            cutOffDay: [row.cutOffDay],
            isIntegral: [row.isIntegral]
            // feeDate: [new Date(row.feeDate), Validators.required],
        });
        this.onAccountCategoryChange(row.accountCategoryId);
        this.displayModalForm = true;
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayModalForm = false;
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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