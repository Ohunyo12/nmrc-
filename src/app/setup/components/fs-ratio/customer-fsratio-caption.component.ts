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
    templateUrl: './customer-fsratio-caption.component.html',
})

export class CustomerFSRatioCaptionComponent implements OnInit {

    createEditForm: FormGroup;

    fsRatioCaptionData: any[];
    fsRatioCaptionTableCols: any[];
    companyData: any[];
    multiple?: number;

    selectedRatioCaption: number;

    displayCreateEditModal = false;



    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private custFSCaptionService: CustomerFSCaptionService, private companyService: CompanyService) { }

    ngOnInit() {
        this.loadingService.show();

        this.fsRatioCaptionTableCols = [
            { field: 'ratioCaptionName', header: 'FS Ratio Caption' },
            { field: 'companyName', header: 'Company' },
            { field: 'annualised', header: 'Annualised' },
            { field: 'position', header: 'Position' },
        ];

        this.loadAllForms(); this.loadAllFSRatioCaptions(); this.loadAllCompanies();
        //  this.loadRatioValue(13);
        this.loadingService.hide();
    }

    loadAllForms() {
        this.createEditForm = this.fb.group({
            ratioCaptionId: [''],
            ratioCaptionName: ['', Validators.required],
            // companyId: ['', Validators.required],
            annualised: [false],
            position: ['', Validators.required]
        });
    }


    loadAllFSRatioCaptions() {
        this.custFSCaptionService.getAllFSRatioCaptions().subscribe((data) => {
            this.fsRatioCaptionData = data.result;
        }, (err) => {
        });
    }

    loadAllCompanies() {
        this.companyService.getAllCompanies().subscribe((data) => {
            this.companyData = data.result;
        }, (err) => {
        });
    }

    showModalForm() {
        this.loadAllForms();
        this.displayCreateEditModal = true;
    }

    editFSRatioCaption(index) {
        this.displayCreateEditModal = true;

        let row = this.fsRatioCaptionData[index];
        this.createEditForm = this.fb.group({
            ratioCaptionId: [row.ratioCaptionId],
            ratioCaptionName: [row.ratioCaptionName],
            // companyId: ['', Validators.required],
            annualised: [row.annualised],
            position: [row.position]
        });
    }

    submitFSRatioCaptionForm(form) {
        this.loadingService.show();

        let bodyObj = {
            // ratioCaptionId: form.value.ratioCaptionId,
            ratioCaptionName: form.value.ratioCaptionName,
            annualised: form.value.annualised,
            position: form.value.position
        };

        let selectedId = form.value.ratioCaptionId;
        if (selectedId === '') { // creating a new group
            this.custFSCaptionService.addFSRatioCaption(bodyObj).subscribe((res) => {
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllFSRatioCaptions();
                this.displayCreateEditModal = false;
                this.loadingService.hide();
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        } else {
            this.custFSCaptionService.updateFSRatioCaption(bodyObj, selectedId).subscribe((res) => {
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
                this.loadAllFSRatioCaptions();
                this.displayCreateEditModal = false;
                this.loadingService.hide();
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
            this.loadAllForms();
        }
    }

}