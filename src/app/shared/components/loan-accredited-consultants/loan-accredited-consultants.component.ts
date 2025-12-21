import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';

@Component({
    templateUrl: 'loan-accredited-consultants.component.html',
    selector: 'loan-accredited-consultants',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class LoanAccreditedConsultantsComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() applicationId: number;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;

    @Input() set reload(value: number) { if (value > 0) this.getLoanConsultants(); }

    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;
    displayConsultantForm:boolean=false;
    accreditedConsultants: any[] = [];
    consultantForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getAccreditedConsultants();
    }

    clearControls() {
        this.formState = 'New';
        this.consultantForm = this.fb.group({
            id: [null],
            loanApplicationDetailId: ['', Validators.required],
            accreditedConsultantId: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    // ---------------------- recommended collaterals -------------

    consultants: any[] = [];
    displayLoanConsultantForm: boolean = false;

    saveLoanConsultant(form) {
        let body = {
            id: form.value.id,
            loanApplicationDetailId: form.value.loanApplicationDetailId,
            accreditedConsultantId: form.value.accreditedConsultantId,
            description: form.value.description,
            applicationId: this.applicationId,
        };
        if (form.value.id == null) {
            this.camService.saveLoanConsultant(body).subscribe((response: any) => {
                this.displayLoanConsultantForm = false;
                this.getLoanConsultants();
            }, (err) => {
            });
        } else {
            this.camService.updateLoanConsultant(body, form.value.id).subscribe((response: any) => {
                this.displayLoanConsultantForm = false;;
                this.getLoanConsultants();
            }, (err) => {
            });

        }
    }

    getLoanConsultants() {
        if(!(this.applicationId > 0)){
            return;
        }
        this.camService.getLoanConsultants(this.applicationId).subscribe((response: any) => {
            this.consultants = response.result;
                this.consultants = this.consultants.slice();
        });
    }

    getAccreditedConsultants() {
        this.camService.getAccreditedConsultants().subscribe((response: any) => {
            this.accreditedConsultants = response.result;
        });
    }

    editLoanConsultant(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.consultantForm.controls['id'].setValue(row.id);
        this.consultantForm.controls['accreditedConsultantId'].setValue(row.accreditedConsultantId);
        this.consultantForm.controls['loanApplicationDetailId'].setValue(row.loanApplicationDetailId);
        this.consultantForm.controls['description'].setValue(row.description);
        this.displayLoanConsultantForm = true;
    }

    removeLoanConsultant(row) {
        this.camService.deleteLoanConsultant(row.id).subscribe((response: any) => {
            this.getLoanConsultants();
        });
    }

    showLoanConsultantForm() {
        this.clearControls();
        this.displayLoanConsultantForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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