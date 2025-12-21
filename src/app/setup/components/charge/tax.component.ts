import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChargeService } from '../../services';
import { ProductFeeService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
    templateUrl: 'tax.component.html'
})
export class TaxComponent implements OnInit {

    taxes: any[]; // <----?
    accounts: any[];
    displayForm: boolean = false;
    useAmount: boolean = false;
    showTaxForm: boolean = true;
    entityName: string = 'Tax';
    taxForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    constructor(
        private loadingService: LoadingService, private fb: FormBuilder,
        private chargeService: ChargeService,
        private productFeeService: ProductFeeService,
    ) { }

    ngOnInit() {
        this.getAllTax();
        this.clearControls();
        this.loadDropdowns();
        // this.showForm(); // <--- FOR TEST ONLY!!!
    }

    getAllTax(): void {
        this.loadingService.show();
        this.chargeService.getTaxes().subscribe((response: any) => { // <----?
            this.taxes = response.result; // <----?
            ////console.log('list: ', response.result);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadDropdowns() {
        this.productFeeService.getAllChartOfAccounts().subscribe((response: any) => {
            this.accounts = response.result;
        });
    }

    onUseAmountChange(checked: boolean) {
        this.useAmount = checked;
        let amountControl = this.taxForm.controls['amount'];
        let rateControl = this.taxForm.controls['rate'];
        amountControl.setValidators(null);
        rateControl.setValidators(null);
        if (this.useAmount == true) {
            amountControl.setValidators([Validators.required]);
        }
        if (this.useAmount == false) {
            rateControl.setValidators([Validators.required]);
        }
        amountControl.updateValueAndValidity();
        rateControl.updateValueAndValidity();
    }

    showForm() {
        this.clearControls();
        this.displayForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.taxForm = this.fb.group({
            taxName: ['', Validators.required],
            rate: ['', Validators.required],
            amount: [''],
            ledgerAccountId: ['', Validators.required],
            useAmount: [false],
        });
    }

    editTax(index) {
        var row = this.taxes[index];
        this.selectedId = row.taxId; // <----?
        this.taxForm = this.fb.group({
            taxName: [row.taxName, Validators.required],
            rate: [row.rate, Validators.required],
            amount: [row.amount, Validators.required],
            ledgerAccountId: [row.gLAccountId, Validators.required],
            useAmount: [row.useAmount, Validators.required],
        });
        this.displayForm = true;
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            taxName: form.value.taxName,
            rate: form.value.rate,
            amount: form.value.amount,
            gLAccountId: form.value.ledgerAccountId, // <-----mind the names!
            useAmount: form.value.useAmount,
        };
        ////console.log(JSON.stringify(body));
        if (this.selectedId === null) {
            this.chargeService.saveTax(body).subscribe((res) => {
                ////console.log('SAVE!');
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllTax();
                    this.displayForm = false;
                    ////console.log('GOOD!', JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.chargeService.updateTax(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllTax();
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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