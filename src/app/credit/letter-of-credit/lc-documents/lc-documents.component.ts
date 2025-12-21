import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';

@Component({
    templateUrl: 'lc-documents.component.html',
    selector: 'lc-document',
})
export class LcDocumentsComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() lcIssuanceId: number;
    @Output() count: EventEmitter<number> = new EventEmitter<number>(); // todo
    @Input() showButtons = true;
    
    @Input() set reload(value: number) { if (value > 0) this.getLcDocuments(this.lcIssuanceId); }

    formState: string = 'New';
    selectedId: number = null;

    lcDocuments: any[] = [];
    lcDocumentForm: FormGroup;
    displayLcDocumentForm: boolean = false;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private lcService: LetterOfCreditService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getLcDocuments(this.lcIssuanceId);
    }

    // ------------------- api-calls --------------------
 
    saveLcDocument(form) {
        let body = {
            lcIssuanceId: form.value.lcIssuanceId,
            documentTitle: form.value.documentTitle,
            isSentToIssuingBank: form.value.isSentToIssuingBank,
            numberOfCopies: form.value.numberOfCopies,
            isSentToApplicant: form.value.isSentToApplicant,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.lcService.saveLcDocument(body).subscribe((response: any) => {
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
            this.lcService.updateLcDocument(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    getLcDocuments(lcIssuanceId) {
        this.lcDocuments = [];
        this.lcService.getLcDocumentsByLcIssuanceId(lcIssuanceId).subscribe((response: any) => {
            this.lcDocuments = response.result;
            this.count.emit(response.result.length);
        });
    }

    deleteLcDocument(row) {
        this.lcService.deleteLcDocument(row.lcDocumentId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.displayLcDocumentForm = false;
        this.getLcDocuments(this.lcIssuanceId);
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.lcDocumentForm = this.fb.group({
            lcIssuanceId: [this.lcIssuanceId, Validators.required],
            documentTitle: ['', Validators.required],
            isSentToIssuingBank: [''],
            numberOfCopies: ['', Validators.required],
            isSentToApplicant: [''],
        });
    }

    editLcDocument(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.lcDocumentId;
        this.lcDocumentForm = this.fb.group({
            lcIssuanceId: [row.lcIssuanceId, Validators.required],
            documentTitle: [row.documentTitle, Validators.required],
            isSentToIssuingBank: [row.isSentToIssuingBank],
            numberOfCopies: [row.numberOfCopies, Validators.required],
            isSentToApplicant: [row.isSentToApplicant],
        });
        this.displayLcDocumentForm = true;
    }

    showLcDocumentForm() {
        this.clearControls();
        // this.selectedId = null;
        this.displayLcDocumentForm = true;
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
        // this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
}
