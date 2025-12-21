import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { RequestJobTypeService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';


@Component({
    templateUrl: 'request-job-type.component.html'
})
export class RequestJobTypeComponent implements OnInit {

    jobTypes: any[]; // <----?
    displayForm: boolean = false;
    showJobTypeForm: boolean = true;
    entityName: string = 'Job Type';
    jobTypeForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
				
    constructor(
        private loadingService: LoadingService, private fb: FormBuilder, 
        private jobTypeService: RequestJobTypeService,
    ) { }
				
    ngOnInit() {
        this.getAllJobType();
        this.clearControls();
    }

    getAllJobType(): void {
        this.loadingService.show();
        this.jobTypeService.getJobTypes().subscribe((response: any) => { // <----?
            this.jobTypes = response.result; // <----?
            this.loadingService.hide();
        }, (err) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide(1000);
        });        
    }

    showForm() {
        this.clearControls();
        this.displayForm = true;
    }
    
    clearControls() {
        this.selectedId = null;
        this.jobTypeForm = this.fb.group({
            jobTypeName: ['', Validators.required],
        });
    }
    
	editJobType(index) {
        var row = this.jobTypes[index];
        this.selectedId = row.jobTypeId; // <----?
        this.jobTypeForm = this.fb.group({
            jobTypeName: [row.jobTypeName, Validators.required],
        });
        this.displayForm = true;
    }
    
    submitForm(form) { 
        this.loadingService.show();
        let body = {
            jobTypeName: form.value.jobTypeName,
        };
        if (this.selectedId === null) { 
            this.jobTypeService.saveJobType(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllJobType();
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else { 
            this.jobTypeService.updateJobType(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllJobType();
                    this.displayForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
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