import { Component, Input, OnInit } from '@angular/core';
// import { Component, OnInit, Inputt } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { LoanCovenantService } from '../../../setup/services/loan-covenant.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
    selector: 'app-loan-covenant',
    templateUrl: 'loan-application-covenant.component.html'
})
export class LoanApplicationCovenantComponent implements OnInit {
    [x: string]: any;

    covenantDetailForm: FormGroup;
    @Input() callerId: number = 1;
    @Input() applicationId: number = 0;
    @Input() isAnalyst: boolean = false;

    covenants: any[] = [];
    covenantDetails: any[];
    frequencyTypes: any[];
    covenantTypes: any[];
    covenantTypesFiltered: any[];
    accountNumbers: any[] = [];
    AmountRateLabel: string = 'Amount';
    covenantClasses = [
        { name: 'Non-financial', isFinancial: 0 },
        { name: 'Financial', isFinancial: 1 }
    ];

    @Input() proposedItems: any[] = [];

    @Input() set reload(value: number) { if (value > 0) this.getLoanApplicationCovenant(); }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private loanCovenantService: LoanCovenantService,
        private customerService: CustomerService,

    ) { }

    ngOnInit() {
        this.getLoanCovenantTypes();
        this.getFrequencyTypes();
        this.resetCovenantForm();
    }

    getLoanApplicationCovenant() {
        if (this.applicationId == null) { this.covenants = []; return; }
        this.loanCovenantService.getLoanApplicationCovenant(this.callerId, this.applicationId).subscribe((response: any) => {
            this.covenants = response.result;
        });
    }

    getAccountNumbers(id: number) {
        this.loadingService.show();
        this.customerService.getAllCustomerAccountByCustomerId(id).subscribe((response: any) => {
            this.accountNumbers = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.handleError(err);
        });
    }

    onFacilityChange(id) {
        var facility = this.proposedItems.find(x => x.loanApplicationDetailId == id);
        this.getAccountNumbers(facility.customerId);
    }

    onIsFinancialChange(id) {
        if (id == 0) {
            this.covenantTypesFiltered = this.covenantTypes.filter(c => c.isFinancial == false);
        } else if (id == 1) {
            this.covenantTypesFiltered = this.covenantTypes.filter(c => c.isFinancial == true);
        }
    }

    // onFrequencyTypeChange(id) {
    //     var row = this.frequencyTypes.filter(x => x.frequencyTypeId == id);
    //     this.covenantDetailForm.controls['frequencyTypeName'].setValue(row[0].mode);
    // }

    requireCasaAccount: boolean = false;
    disableAmountField: boolean = true;
    disableFrequencyField: boolean = true;

    covenantTextareaControlStatus: string = 'hide';
    covenantTextControlStatus: string = 'hide';

    onCovenantTypeChange(event) {
        var row = this.covenantTypes.find(x => x.covenantTypeId == event);
        this.requireCasaAccount = row.requireCasaAccount;
        this.disableAmountField = row.requireAmount == true ? false : true;
        this.disableFrequencyField = row.requireFrequency == true ? false : true;

        let casa = this.covenantDetailForm.get('casaAccountId');

        if (this.requireCasaAccount) {
            casa.setValidators(Validators.required);
        } else {
            casa.clearValidators();
        }
        casa.updateValueAndValidity();

        if (this.disableAmountField) {
            this.covenantDetailForm.controls['covenantAmount'].setValue('');
        }

        if (this.disableFrequencyField) {
            this.covenantDetailForm.controls['frequencyTypeId'].setValue('');
        }

        let amountControl = this.covenantDetailForm.get('covenantAmount');
        if (this.disableAmountField) {
            amountControl.clearValidators();
            amountControl.disable();
        } else {
            amountControl.setValidators([Validators.compose([ValidationService.isNumber, Validators.required])]);
            amountControl.enable();
        }
        amountControl.updateValueAndValidity();

        let frequencyControl = this.covenantDetailForm.get('frequencyTypeId');
        if (this.disableFrequencyField) {
            frequencyControl.clearValidators();
        } else {
            frequencyControl.setValidators([Validators.required]);
            frequencyControl.enable();
        }
        frequencyControl.updateValueAndValidity();
    }

    displayCovenantDetailForm: boolean;
    formState: string = null;
    selectedId?: number;

    getLoanCovenantTypes(): void {
        this.loanCovenantService.getAllLoanCovenantType().subscribe((response: any) => {
            this.covenantTypes = response.result;
        });
    }

    getFrequencyTypes(): void {
        this.loanCovenantService.getFrequencyTypes().subscribe((response: any) => {
            this.frequencyTypes = response.result;
        });
    }

    showCovenantDetailForm() {
        this.getLoanCovenantTypes();
        this.getFrequencyTypes();
        this.displayCovenantDetailForm = true;
    }

    resetCovenantForm() {
        this.covenantDetailForm = this.fb.group({
            casaAccountId: [''],
            covenantAmount: [''],
            covenantDate: ['', Validators.required],
            covenantDetail: ['', Validators.required],
            isFinancial: ['', Validators.required],
            covenantTypeId: ['', Validators.required],
            // covenantTypeName: [''],
            frequencyTypeId: [''],
            // frequencyTypeName: [''],
            isPercentage: [''],
            loanApplicationDetailId: ['', Validators.required],
        });
    }

    addCovenant(form) {
        let body = {
            casaAccountId: form.value.casaAccountId,
            covenantAmount: form.value.covenantAmount,
            covenantDate: form.value.covenantDate,
            covenantDetail: form.value.covenantDetail,
            covenantTypeId: form.value.covenantTypeId,
            // covenantTypeName: form.value.covenantTypeName,
            frequencyTypeId: form.value.frequencyTypeId,
            // frequencyTypeName: form.value.frequencyTypeName,
            isPercentage: form.value.isPercentage,
            loanApplicationDetailId: form.value.loanApplicationDetailId,
            loanCovenantDetailId: this.selectedId
            // loanApplicationId: this.applicationId,
        };
        this.loadingService.show();
        this.loanCovenantService.saveLoanApplicationCovenant(this.callerId, body).subscribe((response: any) => {
            if (response.success == true) {
                this.loadingService.hide();
                this.getLoanApplicationCovenant();
                this.displayCovenantDetailForm = false;
            } else {
                this.handleError(response.error);
            }
        }, (err: any) => {
            this.handleError(err);
        });
    }

    deleteSelectedCovenantItem(row) {
       let __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.loanCovenantService.deleteLoanApplicationCovenant(__this.callerId, row.loanCovenantDetailId).subscribe((response: any) => {
                if (response.success == true) {
                    __this.loadingService.hide();
                    __this.getLoanApplicationCovenant();
                } else {
                    __this.handleError(response.error);
                }
            }, (err: any) => {
                __this.handleError(err);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    editConvenantDetail(row) {
        this.formState = 'Edit';
        var mode = this.frequencyTypes.find(x => x.lookupId == row.frequencyTypeId).lookupName;
        this.selectedId = row.loanCovenantDetailId;
        this.covenantDetailForm = this.fb.group({
            loanId: [''],
            covenantDetail: [row.covenantDetail, Validators.required],
            covenantTypeId: [row.covenantTypeId, Validators.required],
            isFinancial: [row.isFinancial, Validators.required],
            frequencyTypeId: [row.lookupId],
            mode: [mode],
            covenantAmount: [row.covenantAmount],
            //covenantAmount: [(row.covenantAmount).toString()],
            covenantDate: [new Date(row.covenantDate), Validators.required],
            isPercentage: [''],
            casaAccountId: [''],
            loanApplicationDetailId: [row.loanApplicationDetailId, Validators.required],
        });
        this.displayCovenantDetailForm = true;
        this.onCovenantTypeChange(row.covenantTypeId);
    }

    changeCovenantAmountRateLabel(value) {
        this.AmountRateLabel = value ? 'Rate' : 'Amount'
    }
    onFrequencyTypeChange(x) { }

    handleError(message) {
        this.loadingService.hide();
    }

    getCovenantDetails(): void {
        this.loadingSrv.show();
        this.loanCovenantService.getLoanCovenantDetail(this.loanApplicationDetailId).subscribe((response: any) => {
            this.covenantDetails = response.result;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }
}


