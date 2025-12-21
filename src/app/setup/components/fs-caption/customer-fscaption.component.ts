import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { CustomerFSCaptionService } from '../../services';
import { CompanyService } from '../../services';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './customer-fscaption.component.html'
})

export class CustomerFSCaptionComponent implements OnInit {

    selectedGroupId: number;
    createEditFormGroup: FormGroup;

    fsCaptionGroupData: any[];
    fsCaptionData: any[];
    fsCaptionTableCols: any[];
    companyData: any[];
    accountCategories: any[];
    fsTypes: any[];
    multiple?: number;

    selectedFSCaptionGroup: number = 0;
    selectedGroup: any; captionGroupName: any;

    displayCreateEditModal = false;

    color: string = '#2889e9';

    constructor(
        private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService, private companyService: CompanyService
    ) { }

    ngOnInit() {
        this.loadingService.show();

        this.fsCaptionTableCols = [
            //{ field: 'fsCaptionCode', header: 'FS Caption Code' },
            { field: 'fsCaptionName', header: 'FS Caption Name' },
            { field: 'fsCaptionGroupName', header: 'FS Caption Group' },
            //{ field: 'parentIdFSCaptionName', header: 'Parent FS Caption' },
            //{ field: 'accountCategoryName', header: 'Account Category' },
            // { field: 'fsTypeName', header: 'FS Type' },
            { field: 'position', header: 'Position' },
        ];

        this.fsTypes = [
            { id: 1, value: 'BS', name: 'Balance Sheet' },
            { id: 2, value: 'PL', name: 'Income Statement' }
        ];

        this.loadAllFSCaptionGroups(); this.loadForms(); this.loadAccountCategories();

        this.loadingService.hide();
    }

    showModalForm() {
        this.loadForms();
        this.displayCreateEditModal = true;
    }

    loadAllFSCaptionGroups() {
        this.custFSCaptionService.getAllCustomerFSCaptionGroup().subscribe((data) => {
            this.fsCaptionGroupData = data.result;
        }, (err) => {
        });
    }

    onFSCaptionGroupSelect(eventId) {
        this.captionGroupName = null;
        this.loadAllFSCaptions(eventId);
        this.selectedGroup = this.fsCaptionGroupData.find(x => x.fsCaptionGroupId == Number(eventId)).fsCaptionGroupName;
        //this.createEditFormGroup.get('fsCaptionGroupId').setValue(Number(eventId));
        this.selectedGroupId = Number(eventId);
        this.captionGroupName = this.selectedGroup;
    }

    loadAllFSCaptions(fsCaptionGroupId) {
        this.custFSCaptionService.getAllCustomerFSCaption(fsCaptionGroupId).subscribe((data) => {
            this.fsCaptionData = data.result;
        }, (err) => {
        });
    }

    loadForms() {
        this.createEditFormGroup = this.fb.group({
            fsCaptionId: [''],
            fsCaptionCode: [''],
            fsCaptionName: ['', Validators.required],
            fsCaptionGroupId: [''],
            parentIdFSCaptionId: [''],
            accountCategoryId: [''],
            //fsTypeId: ['', Validators.required],
            position: ['', Validators.compose([Validators.required, ValidationService.isNumber])],
            isRatio: [false, Validators.required],
            //refNote: ['', Validators.required],
            //reportColour: [this.color, Validators.required],
            //multiplier: ['', Validators.compose([Validators.required, ValidationService.isNumber])]
        });
    }

    loadAllCompanies() {
        this.companyService.getAllCompanies().subscribe((data) => { this.companyData = data.result; });
    }

    loadAccountCategories() {
        this.custFSCaptionService.getAccountCategories().subscribe((data) => { this.accountCategories = data.result; });
    }

    editFSCaptionGroup(index) {
        this.displayCreateEditModal = true;

        let row = this.fsCaptionData[index];
        this.createEditFormGroup = this.fb.group({
            fsCaptionId: [row.fsCaptionId],
            fsCaptionCode: [row.fsCaptionCode],
            fsCaptionName: [row.fsCaptionName],
            fsCaptionGroupId: [row.fsCaptionGroupId],
            parentIdFSCaptionId: [row.parentIdFSCaptionId],
            accountCategoryId: [row.accountCategoryId],
            fsTypeId: [row.fsTypeId],
            position: [row.position],
            isTotalLine: [row.isTotalLine],
            isRatio: [row.isRatio],
            refNote: [row.refNote],
            reportColour: [row.reportColour],
            multiplier: [row.multiplier]
        });
    }

    deleteFSCaptionGroup(index) {
        let row = this.fsCaptionData[index];

        this.custFSCaptionService.deleteCustomerFSCaption(row.fsCaptionId).subscribe((res) => {
            this.loadingService.hide();
            this.displayCreateEditModal = false;
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadAllFSCaptionGroups();
            this.loadAllFSCaptions(this.selectedGroupId);
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }


    submitFSCaptionForm(form) {
        this.loadingService.show();
        // this.createEditFormGroup.controls['fsCaptionGroupId'].setValue(this.selectedGroup.fsCaptionGroupId);
        // this.createEditFormGroup.controls['reportColour'].setValue(this.color);

        let bodyObj = {
            fsCaptionCode: form.value.fsCaptionCode,
            fsCaptionName: form.value.fsCaptionName,
            fsCaptionGroupId: this.selectedGroupId,
            parentIdFSCaptionId: form.value.parentIdFSCaptionId,
            accountCategoryId: form.value.accountCategoryId,
            fsTypeId: form.value.fsTypeId,
            position: form.value.position,
            isTotalLine: form.value.isTotalLine,
            isRatio: form.value.isRatio,
            refNote: form.value.refNote,
            reportColour: form.value.reportColour,
            multiplier: form.value.multiplier
        };

        let selectedId = form.value.fsCaptionId;
        if (selectedId === '') { // creating a new group
            this.custFSCaptionService.addCustomerFSCaption(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.displayCreateEditModal = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllFSCaptionGroups();
                this.loadAllFSCaptions(this.selectedGroupId);
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        } else { // updating an existing group
            this.custFSCaptionService.updateCustomerFSCaption(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                this.displayCreateEditModal = false;
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllFSCaptionGroups();
                this.loadAllFSCaptions(this.selectedGroupId);
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        }
        this.loadForms();
        // this.displayCreateEditModal = false;
    }
}