import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../../admin/services/authentication.service';
import { ChartOfAccount } from '../../../models/chartofaccount';
import { LedgerService } from '../../../services';
import { ChartOfAccountService } from '../../../services';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../../services';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CompanyService } from '../../../services';
import { TabViewModule, SelectItem, ChipsModule } from 'primeng/primeng';
import { CurrencyService } from '../../../services/currency.service';
import { Currency } from '../../../models/general-setup';
import { ICurrency } from '../../../models/currency';
import { ValidationService } from '../../../../shared/services/validation.service';

@Component({
    templateUrl: 'custom-chartofaccount.component.html'
})

export class CustomChartOfAccountComponent implements OnInit {
   
    chartOfAccounts: any[]; // <----?
    displayForm: boolean = false;
    // showchartOfAccountForm: boolean = true;
    entityName: string = 'Custom Chart Of Account';
    chartOfAccountForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService, 
        private  chartOfAccountService: ChartOfAccountService,
    ) { }

    ngOnInit() {
        this.getAllChartOfAccount();
        this.clearControls();
        // this.showForm(); // <--- FOR TEST ONLY!!!
    }

    getAllChartOfAccount(): void {
        this.loadingService.show();
        this.chartOfAccountService.getCustomChartOfAccounts().subscribe((response: any) => { // <----?
            this.chartOfAccounts = response.result; // <----?
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    showForm() {
        this.clearControls();
        this.displayForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.chartOfAccountForm = this.fb.group({
            accountId: ['', Validators.required],
            accountName: ['', Validators.required],
            currencyCode: ['', Validators.required],
            placeholderId: ['', Validators.required],
            isNostroAccount: [''],
        });
    }

    editChartOfAccount(row) {
        this.selectedId = row.customAccountId; // <----?
        this.chartOfAccountForm = this.fb.group({
            accountId: [row.accountId, Validators.required],
            accountName: [row.accountName, Validators.required],
            currencyCode: [row.currencyCode, Validators.required],
            placeholderId: [row.placeholderId, Validators.required],
            isNostroAccount:[row.isNostroAccount],
        });
        this.displayForm = true;
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            accountId: form.value.accountId,
            accountName: form.value.accountName,
            currencyCode: form.value.currencyCode,
            placeholderId: form.value.placeholderId,
            isNostroAccount: form.value.isNostroAccount,
        };
        if (this.selectedId === null) {
            this.chartOfAccountService.saveCustomChartOfAccount(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllChartOfAccount();
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.chartOfAccountService.updateCustomChartOfAccount(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllChartOfAccount();
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