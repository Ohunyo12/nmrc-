import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerService } from '../../services/customer.service';
import { BranchService } from '../../../setup/services/branch.service';
// import { AppConstant } from './../../shared/constant/app.constant';

@Component({
    styles: ['.panel-body { padding: 5px 7px; }'],
    templateUrl: 'customer.component.html',
})
export class CustomerComponent implements OnInit {

    branches: any[];
    customerTypes: any[];
    customerSearchForm: FormGroup;
    customers: any[];
    displayCustomerDetails: boolean = false;
    displayCustomerList: boolean = false;
    model: any[];
    show: boolean = false; message: any; title: any; cssClass: any; // message box

    constructor(
        private loadingService: LoadingService,
        private validationService: ValidationService,
        private fb: FormBuilder,
        private customerService: CustomerService,
        private branchService: BranchService,
    ) { }

    ngOnInit() {
        this.clearSearchForm();
        this.loadDropdowns();
    }

    loadDropdowns() {
        this.branchService.get().subscribe((response: any) => {
            this.branches = response.result;
        });
        this.customerService.getAllCustomerTypes().subscribe((response: any) => {
            this.customerTypes = response.result;
        });
    }

    submitForm(form) {
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

    clearSearchForm() {
        this.customerSearchForm = this.fb.group({
            customerName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            phoneNumber: ['', Validators.compose([ValidationService.isNumber, Validators.minLength(8)])],
            customerTypeId: [''],
            branchId: [''],
        });
    }

    viewCustomerDetails(index) {
        this.displayCustomerDetails = true;
        this.model = this.customers[index];
    }

    getCustomerType(id) {
        let item = this.customerTypes.find(x => x.customerTypeId == id);
        if (item != undefined) { return item.name; }
        return 'n/a';
    }

    getBranch(id) {
        let item = this.branches.find(x => x.branchId == id);
        if (item != undefined) { return item.branchName; }
        return 'n/a';
    }

    getCompany(id) {
        return 'n/a';
    }

    getApprovalStatus(id) {
        return 'n/a';
    }

    getCustomerSensitivityLevel(id) {
        return this.customerService.getCustomerSensitivityLevel(id);
    }

    getMaritalStatus(id) {
        return this.customerService.getMaritalStatus(id);
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

/**
"customerAddresses": []
"customerBvn": []
"customerCompanyInfomation": []
"customerEditHistory": []
"customerEmploymentHistory": []
"customerIdentification": []
"customerPhoneContact": [],  */