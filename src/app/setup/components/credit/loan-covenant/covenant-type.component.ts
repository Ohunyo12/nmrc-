
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { ProductFee } from '../models/product-fee';
import { LoanCovenantService } from '../../../services';

@Component({
    templateUrl: 'covenant-type.component.html'
})
export class CovenantTypeComponent implements OnInit {
    
    covenantTypes: any[];
    show: boolean = false; message: any; title: any; cssClass: any;
    selectedCovenantTypeId?: number;
    displayCovenantTypeForm: boolean;
    covenantTypeForm: FormGroup;
    selectedId?: number;
    formState?:number;

    constructor(private loadingService: LoadingService,
        private fb: FormBuilder, private loanCovenantService: LoanCovenantService) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
    }

    getAll(): void {
        this.loadingService.show();
        this.loanCovenantService.getAllLoanCovenantType().subscribe((response: any) => {
            this.covenantTypes = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }
    
    showCovenantTypeForm() {
        this.clearControls();
        this.displayCovenantTypeForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.covenantTypeForm = this.fb.group({
            isFinancial: ['', Validators.required],
            covenantTypeName: ['', Validators.required],
            requireAmount: [false],
            requireFrequency: [false],
            isCleanupCycle: [false],
        });
    }

    editConvenantType(index) {
        var row = this.covenantTypes[index];
        this.selectedId = row.covenantTypeId;       
        this.covenantTypeForm = this.fb.group({
            isFinancial: [row.isFinancial, Validators.required],
            covenantTypeName: [row.covenantTypeName, Validators.required],
            requireAmount: [row.requireAmount],
            requireFrequency: [row.requireFrequency],
            isCleanupCycle: [row.isCleanupCycle],
        });
        this.displayCovenantTypeForm = true;
    }

    submitForm(form) { 
        this.loadingService.show();
        let body = {
            isFinancial: form.value.isFinancial,
            covenantTypeName: form.value.covenantTypeName,
            requireFrequency: form.value.requireFrequency,
            isCleanupCycle: form.value.isCleanupCycle,
            requireAmount: form.value.requireAmount,
        };

        if (this.selectedId === null) { 
            this.loanCovenantService.saveCovenantType(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        } else { // update selected
            this.loanCovenantService.updateCovenantType(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);            
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
                
            });

        }
    }

    onCleanupCycleChange(id) {
        if (id == 2) this.covenantTypeForm.controls['isCleanupCycle'].setValue(false);
        if (id == 1) this.covenantTypeForm.controls['requireAmount'].setValue(false);
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.displayCovenantTypeForm = false;
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