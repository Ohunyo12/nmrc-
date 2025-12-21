import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule, TabViewModule, DialogModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerService } from '../../../customer/services/customer.service';
import { CustomerFSCaptionService } from '../../services';
import { CompanyService } from '../../services';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './customer-fsratio-detail.component.html',
})

export class CustomerFSRatioDetailComponent implements OnInit {

    createEditForm: FormGroup;

    fsRatioDetailData: any[]; tempRatioDetailData: any[] = [];
    fsRatioDetailTableCols: any[];
    fsRatioCaptionData: any[];
    fsCaptionGroupData: any[];
    fsCaptionData: any[];
    divisorTypeData: any[];
    valueTypeData: any[];
    multiple?:number;
    
    selectedRatioDetail: number;
    selectedFSCaptionGroup: any;
    selectedFSRatioCaption: any;
    fsCaptionGroupId: number;
    ratioCaptionId: number;

    displayCreateEditModal = false;
    disableRCaptionBtn = true;
    fsRatioCaptionForGroupData: any;

    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService) { }

    ngOnInit() {
        this.loadingService.show();

        this.fsRatioDetailTableCols = [
            { field: 'ratioCaptionName', header: 'FS Derived Caption' },
            { field: 'fsCaptionName', header: 'FS Caption Name' },
            { field: 'divisorTypeName', header: 'Divisor Type' },
            { field: 'valueTypeName', header: 'Value Type' },
            { field: 'multiplier', header: 'Multiplier' },
        ];

        this.loadAllForms();
        this.loadAllFSCaptionGroups();
        this.loadAllFSRatioCaptions();
        this.loadAllDivisorTypes();
        this.loadAllValueTypes();

        this.loadingService.hide();
    }

    loadAllForms() {
        this.createEditForm = this.fb.group({
            ratioDetailId: [''],
            ratioCaptionId: ['', Validators.required],
            fsCaptionGroupId: ['', Validators.required],
            divisorTypeId: ['', Validators.required],
            valueTypeId: ['', Validators.required],
            multiplier: ['', Validators.required],
            fscaptionId: ['', Validators.required],
        });
    }

    showModalForm() {
        this.createEditForm = this.fb.group({
            ratioDetailId: [''],
            ratioCaptionId: [this.ratioCaptionId, Validators.required],
            fsCaptionGroupId: [this.fsCaptionGroupId, Validators.required],
            divisorTypeId: ['', Validators.required],
            valueTypeId: ['', Validators.required],
            multiplier: ['', Validators.required],
            fscaptionId: ['', Validators.required],
        });
        this.displayCreateEditModal = true;
    }

    loadAllFSRatioDetails(ratioCaptionId, fsCaptionGroupId) {
        this.custFSCaptionService.getAllFSRatioDetails(ratioCaptionId, fsCaptionGroupId).subscribe((data) => {
            this.fsRatioDetailData = data.result;
            // this.tempRatioDetailData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllFSRatioCaptions() {
        this.custFSCaptionService.getAllFSRatioCaptions().subscribe((data) => {
            this.fsRatioCaptionData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadFSRatioCaptionsByFSCaptionGroupId(fSCaptionGroupId) {
        this.custFSCaptionService.getFSRatioCaptionsByFSCaptionGroupId(fSCaptionGroupId).subscribe((data) => {
            this.fsRatioCaptionForGroupData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllFSCaptionGroups() {
        this.custFSCaptionService.getAllCustomerFSCaptionGroup().subscribe((data) => {
            this.fsCaptionGroupData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    onFsCaptionGroupSelect(fsGroupId) {
        this.loadAllFSCaptions();
        this.loadFSRatioCaptionsByFSCaptionGroupId(fsGroupId);
        this.fsCaptionGroupId = fsGroupId;
        this.disableRCaptionBtn = false;
        if (this.ratioCaptionId > 0) {
            this.loadAllFSRatioDetails(this.ratioCaptionId, fsGroupId);
        }
    }

    onFSRatioCaptionSelect(rCaptionId) {
        this.loadAllFSRatioDetails(rCaptionId, this.fsCaptionGroupId);
        this.ratioCaptionId = rCaptionId;
    }

    loadAllFSCaptions() {
        this.custFSCaptionService.getAllCustomerFSCaptions().subscribe((data) => {
            this.fsCaptionData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllDivisorTypes() {
        this.custFSCaptionService.getAllFSRatioDivisorTypes().subscribe((data) => {
            this.divisorTypeData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    loadAllValueTypes() {
        this.custFSCaptionService.getAllFSRatioValueTypes().subscribe((data) => {
            this.valueTypeData = data.result;
        }, (err) => {
            ////console.log('Error', err);
        });
    }

    editFSRatioDetail(index) {
        this.displayCreateEditModal = true;
        let row = this.fsRatioDetailData[index];
        // this.loadAllFSCaptions(this.createEditForm.value.fsCaptionGroupId);
        let selectedCaptionGrp = this.fsCaptionData.find(x => x.fsCaptionId === row.fscaptionId);
        let selectedCaption = '';
        this.createEditForm = this.fb.group({
            ratioDetailId: [row.ratioDetailId],
            ratioCaptionId: [row.ratioCaptionId],
            fsCaptionGroupId: [selectedCaptionGrp.fsCaptionGroupId],
            divisorTypeId: [row.divisorTypeId],
            valueTypeId: [row.valueTypeId],
            multiplier: [row.multiplier],
            fscaptionId: [row.fscaptionId],
        });
        ////console.log('row object', row);fsRatioCaption
        ////console.log('form obj', this.createEditForm.value);
    }

    deleteFSRatioDetail(index) {
        let row = this.fsRatioDetailData[index];

        this.custFSCaptionService.deleteFSRatioDetail(row.ratioDetailId).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
            this.loadAllFSRatioDetails(row.ratioCaptionId, row.fsCaptionGroupId);
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }


    submitFSRatioDetailForm(form) {
        this.loadingService.show();

        let bodyObj = {
            // ratioDetailId: form.value.ratioDetailId,
            ratioCaptionId: form.value.ratioCaptionId,
            divisorTypeId: form.value.divisorTypeId,
            valueTypeId: form.value.valueTypeId,
            multiplier: form.value.multiplier,
            fscaptionId: form.value.fscaptionId,
        };

        let selectedId = form.value.ratioDetailId;
        if (selectedId === '') { // creating a new group
            this.custFSCaptionService.addFSRatioDetail(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.displayCreateEditModal = false;
                this.loadAllFSRatioDetails(this.ratioCaptionId, this.fsCaptionGroupId);
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        } else {
            this.custFSCaptionService.updateFSRatioDetail(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.displayCreateEditModal = false;
                this.loadAllFSRatioDetails(this.ratioCaptionId, this.fsCaptionGroupId);
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        }
    }
}