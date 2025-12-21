import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';

@Component({
    templateUrl: 'lc-condition.component.html',
    selector: 'lc-condition',
})
export class LcConditionComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() lcIssuanceId: number;
    @Input() showButtons = true;

    @Input() set reload(value: number) { if (value > 0) this.getLcConditions(this.lcIssuanceId); }

    formState: string = 'New';
    selectedId: number = null;

    lcConditions: any[] = [];
    lcConditionForm: FormGroup;
    displayLcConditionForm: boolean = false;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private lcService: LetterOfCreditService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getLcConditions(this.lcIssuanceId);
    }

    // ------------------- api-calls --------------------
 
    saveLcCondition(form) {
        let body = {
            lcIssuanceId: form.value.lcIssuanceId,
            condition: form.value.condition,
            isSatisfied: form.value.isSatisfied,
            isTransactionDynamics: form.value.isTransactionDynamics,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.lcService.saveLcCondition(body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) {
                    this.finishGood(response.message);
                    this.reloadGrid();
                }
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.lcService.updateLcCondition(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    getLcConditions(lcIssuanceId) {
        this.lcConditions = [];
        this.lcService.getLcConditionsByLcIssuanceId(lcIssuanceId).subscribe((response: any) => {
            this.lcConditions = response.result;
        });
    }

    deleteLcCondition(row) {
        this.lcService.deleteLcCondition(row.lcConditionId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.displayLcConditionForm = false;
        this.getLcConditions(this.lcIssuanceId);
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.lcConditionForm = this.fb.group({
            lcIssuanceId: [this.lcIssuanceId, Validators.required],
            condition: ['', Validators.required],
            isSatisfied: [''],
            isTransactionDynamics: false,
        });
    }

    editLcCondition(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.lcConditionId;
        this.lcConditionForm = this.fb.group({
            lcIssuanceId: [row.lcIssuanceId, Validators.required],
            condition: [row.condition, Validators.required],
            isSatisfied: row.isSatisfied,
            isTransactionDynamics: row.isTransactionDynamics,
        });
        this.displayLcConditionForm = true;
    }

    showLcConditionForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayLcConditionForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood(message) {
        this.showMessage(message, 'success', "FintrakBanking");
        // this.loadingService.hide();
    }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
}
