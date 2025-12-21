import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerService } from '../../../services/customer.service';
import { BranchService } from '../../../../setup/services/branch.service';
// import { AppConstant } from './../../shared/constant/app.constant';

@Component({
    selector: 'customer-search',
    styles: ['.panel-body { padding: 5px 7px; }'],
    templateUrl: 'customer-search.component.html',
    
})
export class CustomerSearchComponent implements OnInit {

    branches: any[];
    customerTypes: any[];
    customerSearchForm: FormGroup;
    customers: any[];
    displayCustomerDetails: boolean = false;
    displayCustomerList: boolean = false;
    model: any[];
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    customerSelection: any;
    customerTypesLoaded: boolean = false;
    branchesLoaded: boolean = false;
    collapseForm: boolean = true;
    @Input() showPhoneNumberSearch: boolean = true;
    
    // @Output() notify: EventEmitter<number> = new EventEmitter<number>();
    @Output() customer: EventEmitter<number> = new EventEmitter<number>();

    constructor(
            private loadingService: LoadingService, 
            private validationService: ValidationService,
            private fb: FormBuilder, 
            private customerService: CustomerService,
            private branchService: BranchService,
        ) { }

    ngOnInit() {
        this.clearCustomerSearchForm();
        this.loadCustomerDropdowns();
    }

    collapseSearchForm(flag: boolean) {
        this.collapseForm = flag;
    }

    loadCustomerDropdowns() {
        this.branchService.get().subscribe((response: any) => {
            this.branches = response.result;
            this.branchesLoaded = true;
        });
        this.customerService.getAllCustomerTypes().subscribe((response: any) => {
            this.customerTypes = response.result;
            this.customerTypesLoaded = true;
        });
    }

    clearCustomerSearchForm() {
        this.customerSearchForm = this.fb.group({
            customerName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            phoneNumber: ['', Validators.compose([ValidationService.isNumber, Validators.minLength(8)])],
            customerTypeId: [''],
            branchId: [''],
        });
    }

    submitCustomerSearchForm(form) { 
        this.customerSelection = null;
        if (this.customerSearchForm.invalid) {
            return;
        }
        this.loadingService.show();
        let body = {
            customerName: form.value.customerName,
            phoneNumber: form.value.phoneNumber,
            customerTypeId: form.value.customerTypeId,
            branchId: form.value.branchId,
        };
        this.customerService.search(body).subscribe((response: any) => {
            if (response.success == true) {
                this.customers = response.result;
                this.displayCustomerList = true;
                this.loadingService.hide();
                this.collapseSearchForm(true);
            } else {
                this.displayCustomerList = false;
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
                this.displayCustomerList = false;
                this.loadingService.hide(1000);
                this.finishBad(JSON.stringify(err));
        });
    }

    onSelectedCustomerChange(): void {
        
        this.customer.emit(this.customerSelection);
    }

    // feedback message

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