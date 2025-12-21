import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CasaService } from '../../services/casa.service';
import { CustomerService } from '../../services/customer.service';

@Component({
    styles: ['.panel-body { padding: 5px 7px; }'],
    templateUrl: 'casa.component.html',
})
export class CasaComponent implements OnInit {

    branches: any[];
    casaTypes: any[];
    casaSearchForm: FormGroup;
    casas: any[];
    displayCasaDetails: boolean = false;
    displayCasaList: boolean = false;
    model: any[];
    show: boolean = false; message: any; title: any; cssClass: any; // message box

    constructor(
            private loadingService: LoadingService, 
            private validationService: ValidationService,
            private fb: FormBuilder, 
            private casaService: CasaService,
            private customerService: CustomerService,
        ) { }

    ngOnInit() {
        this.clearSearchForm();
    }

    submitForm(form) { 
        if (this.casaSearchForm.invalid) {
            return;
        }
        this.loadingService.show();
        let searchString = form.value.accountNumberOrName;
        this.casaService.search(searchString).subscribe((response: any) => {
            if (response.success == true) {
                this.casas = response.result;
                this.displayCasaList = true;
                this.loadingService.hide();
            } else {
                this.displayCasaList = false;
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
                this.displayCasaList = false;
                this.loadingService.hide(1000);
                this.finishBad(JSON.stringify(err));
        });
    }

    clearSearchForm() {
        this.casaSearchForm = this.fb.group({
            accountNumberOrName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        });
    }
    
    viewCasaDetails(index) {
        this.displayCasaDetails = true;
        this.model = this.casas[index];
    }

    getAccountStatus(id) {
        return this.casaService.getAccountStatus(id); 
    }

    getOperation(id) {
        return this.casaService.getOperation(id); 
    }

    getPostNoStatus(id) {
        return this.casaService.getPostNoStatus(id); 
    }

    getCustomerSensitivityLevel(id) {
        return this.customerService.getCustomerSensitivityLevel(id); 
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
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
