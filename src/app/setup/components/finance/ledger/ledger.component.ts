import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../shared/services/validation.service';

import { Ledger } from '../../../models/ledger';
import { LedgerService } from '../../../services';
import { AppConstant } from '../../../../shared/constant/app.constant';

@Component({
    templateUrl: 'ledger.component.html'
})
export class LedgerComponent implements OnInit {
    
    ledgers: Ledger[];
    displayAddModal: boolean = false;
    entityName: string = 'Ledger';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    categories: any[];// = AppConstant.accountCategories();

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private ledgerService: LedgerService
    ) { }

    ngOnInit() {
        this.getAllLedgers();
        this.clearControls();
        this.getAllAccountCategories()
    }

    getAllAccountCategories() {
        this.ledgerService.getAllAccountCategories().subscribe((response: any) => {
            this.categories = response.result;
        });
    }

    onCategoryChange() {
        return;
    }

    getAllLedgers(): void {
        this.loadingService.show();
        this.ledgerService.get().subscribe((response: any) => {
            this.ledgers = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }
    
    showAddModal() {
        this.displayAddModal= true;
    }

    clearControls() {
        this.addForm = this.fb.group({
            accountTypeName: ['', ValidationService.isRequired],
            accountTypeCode: ['', Validators.compose([Validators.required, ValidationService.isNumber])],
            accountCategoryId: ['', Validators.required],
        });
    }

    submitAddForm(form) { 
        this.loadingService.show();
        let body = {
            accountTypeName: form.value.accountTypeName,
            accountTypeCode: form.value.accountTypeCode,
            accountCategoryId: form.value.accountCategoryId,
        };
        this.ledgerService.save(body).subscribe((res) => {
            if (res.success == true) {
                this.finishGood(res.message);
                this.getAllLedgers();
            } else {
                this.finishBad(res.message);
            }
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
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