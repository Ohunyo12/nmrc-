import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';

@Component({
    templateUrl: 'customer-relationship-type.component.html'
})
export class CustomerRelationshipTypeComponent implements OnInit {

    customerRelationshipTypes: any[];
    displayModalForm: boolean = false;
    entityName: string = 'New Customer Relationship Type';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = 0;

    constructor(private loadingService: LoadingService, private fb: FormBuilder, private customerService: CustomerService) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
    }

    getAll(): void {
        this.loadingService.show();
        this.customerService.getCustomerRelationshipTypes().subscribe((response: any) => {
            this.customerRelationshipTypes = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showModalForm() {
        this.entityName = 'New Customer Relationship Type';
        this.clearControls();
        this.selectedId = 0;
        this.displayModalForm = true;
    }

    clearControls() {
        this.createUpdateForm = this.fb.group({
            lookupId: [0, Validators.required],
            lookupName: ['', Validators.required]
        });
    }

    submitCustomerRelationship(form) {
        this.loadingService.show();
        const body = form.value;
        this.customerService.saveCustomerRelationshipType(body).subscribe((res) => {
            if (res.success == true) {
                this.getAll();
                this.finishGood(res.message);
                this.displayModalForm = false;
            } else {
                this.finishBad(res.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    editCustomerRelationshipType(index) {
        this.entityName = 'Edit Customer Relationship Type'
        var row = this.customerRelationshipTypes[index];
        JSON.stringify(row);
        this.selectedId = row.lookupId;
        this.createUpdateForm = this.fb.group({
            lookupId: [row.lookupId, Validators.required],
            lookupName: [row.lookupName, Validators.required],
        });
        this.displayModalForm = true;
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayModalForm = false;
        // this.clearControls();
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