import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomFieldService } from '../../services';
import { AppConstant } from '../../../shared/constant/app.constant';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
    templateUrl: 'custom-field.component.html'
})
export class CustomFieldComponent implements OnInit {
    row:any;
    customFields: any[];
    displayModalForm: boolean = false;
    entityName: string = 'Custom Fields';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    selectedHostPageId: number = null;
    displayFilteredList: boolean = false;
    filterForm: FormGroup;
    formState: string = 'New';
    hostPages = [
        { 'hostPageId': '1', 'hostPage': 'Collateral', },
        { 'hostPageId': '2', 'hostPage': 'Custom Fields', },
        { 'hostPageId': '3', 'hostPage': 'Customer', },
        { 'hostPageId': '4', 'hostPage': 'KYC', },
        { 'hostPageId': '5', 'hostPage': 'Personal Information', },
        { 'hostPageId': '6', 'hostPage': 'Work Information', },
    ];
    controlTypes = [
        { 'controlTypeId': 'TextBox', 'controlTypeName': 'Text Box', },
        { 'controlTypeId': 'Select', 'controlTypeName': 'Dropdown Select', },
        { 'controlTypeId': 'CheckBox', 'controlTypeName': 'Check Box', },
    ];
    
    clearSearchForm() {
        this.filterForm = this.fb.group({
            hostPageId: ['', Validators.required],
        });
    }

    onHostPageChange(id) {
        this.selectedHostPageId = id;
        this.getCustomFieldsByHostPage(this.selectedHostPageId);
    }
    constructor(private loadingService: LoadingService, private fb: FormBuilder, 
        private customFieldService: CustomFieldService, 
        ) { }

    ngOnInit() {
        this.clearSearchForm();
        this.clearControls();
    }

    getCustomFieldsByHostPage(id): void {
        this.loadingService.show();
        this.customFieldService.getCustomFieldsByHostPage(id).subscribe((response: any) => {
            this.customFields = response.result;
            this.loadingService.hide();
            this.displayFilteredList = true;
            this.selectedHostPageId = id;
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }
    
    showModalForm() {
        this.clearControls();
        this.displayModalForm = true;
    }

    // getAllProductGroups() {
    //     this.productGroupService.get().subscribe((response: any) => {
    //         this.productGroups = response.result;
    //     }); 
    // }

    // getAllDealClassifications() {
    //     this.classificationService.getAllDealClassifications().subscribe((response: any) => {
    //         this.classifications = response.result;
    //         JSON.stringify(this.classifications);
    //     }); 
    // }

    clearControls() {
        this.selectedId = null;
        this.createUpdateForm = this.fb.group({
            hostPageId: [this.selectedHostPageId, Validators.required],
            labelName: ['', Validators.required],
            controlType: ['', Validators.required],
            required: [false],
            itemOrder: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
        });
    }

    submitForm(form) { 
        this.loadingService.show();
        let body = {
            hostPageId: form.value.hostPageId,
            labelName: form.value.labelName,
            controlType: form.value.controlType,
            required: form.value.required,
            itemOrder: form.value.itemOrder,
        };

        if (this.selectedId === null) { 
            this.customFieldService.save(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCustomFieldsByHostPage(this.selectedHostPageId);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        } else { 
            this.customFieldService.update(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCustomFieldsByHostPage(this.selectedHostPageId);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        }
    }

    editCustomField(index) {
        var row = this.customFields[index];
        // JSON.stringify(row);
        this.selectedId = row.customFieldId;
        this.createUpdateForm = this.fb.group({
            hostPageId: [row.hostPageId, Validators.required],
            labelName: [row.labelName, Validators.required],
            controlType: [row.controlType, Validators.required],
            required: [row.required],
            itemOrder: [row.itemOrder, Validators.compose([ValidationService.isNumber, Validators.required])],
        });
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
        // this.getAll();
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