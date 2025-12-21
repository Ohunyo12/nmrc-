import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
    templateUrl: 'term-sheet.component.html',
    selector: 'term-sheet',
    providers: [CreditAppraisalService, LoadingService] 
})

   // ------------------- declarations -----------------
export class TermSheetComponent implements OnInit {

    

    @Input() panel: boolean = false;
    @Input() label: string = '';

    @Input() set reload(value: number) { if (value > 0) this.getTermSheets();
     }

    formState: string = 'New';
    selectedId: number = null;

    termSheets: any[] = [];
    termSheetForm: FormGroup;
    displayTermSheetForm: boolean = false;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private creditAppraisalService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getTermSheets();
    }

    // ------------------- api-calls --------------------
 
    saveTermSheet(form) {
        let body = {
            borrower: form.value.borrower,
            facilityAmount: form.value.facilityAmount,
            facilityType: form.value.facilityType,
            purpose: form.value.purpose,
            tenor: form.value.tenor,
            permittedAccount: form.value.permittedAccount,
            debtServiceReserveAccount: form.value.debtServiceReserveAccount,
            cancellation: form.value.cancellation,
            principalRepayment: form.value.principalRepayment,
            interestPayment: form.value.interestPayment,
            computationOfInterest: form.value.computationOfInterest,
            repaymentSource: form.value.repaymentSource,
            availability: form.value.availability,
            currencyOfDisbursement: form.value.currencyOfDisbursement,
            documentation: form.value.documentation,
            drawdown: form.value.drawdown,
            earlyRepaymentOfPrincipal: form.value.earlyRepaymentOfPrincipal,
            interestRate: form.value.interestRate,
            pricing: form.value.pricing,
            managementFees: form.value.managementFees,
            facilityFee: form.value.facilityFee,
            processingFee: form.value.processingFee,
            securityCondition: form.value.securityCondition,
            transactionDynamics: form.value.transactionDynamics,
            conditionsPrecedentToUtilisation: form.value.conditionsPrecedentToUtilisation,
            otherCondition: form.value.otherCondition,
            taxes: form.value.taxes,
            presentationsAndWarrantees: form.value.presentationsAndWarrantees,
            covenants: form.value.covenants,
            eventsOfDefault: form.value.eventsOfDefault,
            transferability: form.value.transferability,
            governingLawAndJurisdiction: form.value.governingLawAndJurisdiction,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.creditAppraisalService.saveTermSheet(body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.creditAppraisalService.updateTermSheet(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    getTermSheets() {
        this.creditAppraisalService.getTermSheets().subscribe((response: any) => {
            this.termSheets = response.result;
        });
    }

    getTermSheetsCorrection(termSheetCode) {
        this.creditAppraisalService.getTermSheetsCorrection(termSheetCode).subscribe((response: any) => {
            this.termSheets = response.result;
        });
    }

    deleteTermSheet(row) {
        this.creditAppraisalService.deleteTermSheet(row.termSheetId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.displayTermSheetForm = false;
        this.getTermSheets();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.termSheetForm = this.fb.group({
            borrower: ['', Validators.required],
            facilityAmount: ['', Validators.required],
            facilityType: ['', Validators.required],
            purpose: ['', Validators.required],
            tenor: ['', Validators.required],
            permittedAccount: ['', Validators.required],
            debtServiceReserveAccount: ['', Validators.required],
            cancellation: ['', Validators.required],
            principalRepayment: ['', Validators.required],
            interestPayment: ['', Validators.required],
            computationOfInterest: ['', Validators.required],
            repaymentSource: ['', Validators.required],
            availability: ['', Validators.required],
            currencyOfDisbursement: ['', Validators.required],
            documentation: ['', Validators.required],
            drawdown: ['', Validators.required],
            earlyRepaymentOfPrincipal: ['', Validators.required],
            interestRate: ['', Validators.required],
            pricing: ['', Validators.required],
            managementFees: ['', Validators.required],
            facilityFee: ['', Validators.required],
            processingFee: ['', Validators.required],
            securityCondition: ['', Validators.required],
            transactionDynamics: ['', Validators.required],
            conditionsPrecedentToUtilisation: ['', Validators.required],
            otherCondition: ['', Validators.required],
            taxes: ['', Validators.required],
            presentationsAndWarrantees: ['', Validators.required],
            covenants: ['', Validators.required],
            eventsOfDefault: ['', Validators.required],
            transferability: ['', Validators.required],
            governingLawAndJurisdiction: ['', Validators.required],
        });
    }

    editTermSheet(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.termSheetId;
        this.termSheetForm = this.fb.group({
            borrower: [row.borrower, Validators.required],
            facilityAmount: [row.facilityAmount, Validators.required],
            facilityType: [row.facilityType, Validators.required],
            purpose: [row.purpose, Validators.required],
            tenor: [row.tenor, Validators.required],
            permittedAccount: [row.permittedAccount, Validators.required],
            debtServiceReserveAccount: [row.debtServiceReserveAccount, Validators.required],
            cancellation: [row.cancellation, Validators.required],
            principalRepayment: [row.principalRepayment, Validators.required],
            interestPayment: [row.interestPayment, Validators.required],
            computationOfInterest: [row.computationOfInterest, Validators.required],
            repaymentSource: [row.repaymentSource, Validators.required],
            availability: [row.availability, Validators.required],
            currencyOfDisbursement: [row.currencyOfDisbursement, Validators.required],
            documentation: [row.documentation, Validators.required],
            drawdown: [row.drawdown, Validators.required],
            earlyRepaymentOfPrincipal: [row.earlyRepaymentOfPrincipal, Validators.required],
            interestRate: [row.interestRate, Validators.required],
            pricing: [row.pricing, Validators.required],
            managementFees: [row.managementFees, Validators.required],
            facilityFee: [row.facilityFee, Validators.required],
            processingFee: [row.processingFee, Validators.required],
            securityCondition: [row.securityCondition, Validators.required],
            transactionDynamics: [row.transactionDynamics, Validators.required],
            conditionsPrecedentToUtilisation: [row.conditionsPrecedentToUtilisation, Validators.required],
            otherCondition: [row.otherCondition, Validators.required],
            taxes: [row.taxes, Validators.required],
            presentationsAndWarrantees: [row.presentationsAndWarrantees, Validators.required],
            covenants: [row.covenants, Validators.required],
            eventsOfDefault: [row.eventsOfDefault, Validators.required],
            transferability: [row.transferability, Validators.required],
            governingLawAndJurisdiction: [row.governingLawAndJurisdiction, Validators.required],
        });
        this.displayTermSheetForm = true;
    }

    showTermSheetForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayTermSheetForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

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
