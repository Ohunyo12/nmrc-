import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    DataTableModule, SharedModule, TabViewModule,
} from 'primeng/primeng';

import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { CustomerFSCaptionService } from '../../services';
import { CompanyService } from '../../services';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './customer-fscaption-group.component.html'
})

export class CustomerFSCaptionGroupComponent implements OnInit {

    multiple:any;
    fsCaptionGroupData: any[];
    fsCaptionGroupTableCols: any[];
    companyData: any[];

    selectedFSCaptionGroup: number;
    selectedCompany: any[];

    displayCreateEditModal = false;

    createEditForm: FormGroup;

    constructor(
        private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService, private companyService: CompanyService) { }

    ngOnInit() {

        this.loadingService.show();

        this.fsCaptionGroupTableCols = [
            //{ field: 'companyName', header: 'Company' },
            // { field: 'fsCaptionGroupId', header: 'FS Caption Group ID' },
            { field: 'fsCaptionGroupName', header: 'FS Caption Group Name' },
            { field: 'position', header: 'Position' },
        ];

        this.loadForms(); this.loadAllFSCaptionGroups(); this.loadAllCompanies();

    }

    loadForms() {
        this.createEditForm = this.fb.group({
            fsCaptionGroupId: [''],
            fsCaptionGroupName: ['', Validators.required],
            position: ['', Validators.required]
        });
    }

    loadAllFSCaptionGroups() {
        this.custFSCaptionService.getAllCustomerFSCaptionGroup().subscribe((data) => {
            this.fsCaptionGroupData = data.result;
        }, (err) => {
        });
    }

    loadAllCompanies() {
        this.companyService.getAllCompanies().subscribe((data) => {
            this.companyData = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    showModalForm() {
        this.loadForms();
        this.displayCreateEditModal = true;
    }

    editFSCaptionGroup(index) {
        this.displayCreateEditModal = true;

        let row = index;
        this.createEditForm = this.fb.group({
            fsCaptionGroupId: [row.fsCaptionGroupId, Validators.required],
            fsCaptionGroupName: [row.fsCaptionGroupName, Validators.required],
            position: [row.position, Validators.required]
        });

        this.selectedCompany = this.companyData.filter(x => x.CompanyId === row.CompanyId);
    }

    deleteFSCaptionGroup(rowData) {
        let row = rowData;
        this.selectedCompany = this.companyData.filter(x => x.CompanyId === row.CompanyId);

        this.custFSCaptionService.deleteCustomerFSCaptionGroup(row.fsCaptionGroupId).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadAllFSCaptionGroups();
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }

    submitFSCaptionForm(form) {
        this.loadingService.show();

        let bodyObj = {
            fsCaptionGroupName: form.value.fsCaptionGroupName,
            position: form.value.position
        };

        let selectedId = form.value.fsCaptionGroupId;
        if (selectedId === '') { // creating a new group
            this.custFSCaptionService.addFSCustomerCaptionGroup(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                this.displayCreateEditModal = false;
                this.loadAllFSCaptionGroups();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.displayCreateEditModal = false;
                this.loadingService.hide();
            });
        } else {
            this.custFSCaptionService.updateCustomerFSCaptionGroup(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                this.displayCreateEditModal = false;
                this.loadAllFSCaptionGroups();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.displayCreateEditModal = false;
                this.loadingService.hide();
            });
        }
        this.loadForms();
    }
}