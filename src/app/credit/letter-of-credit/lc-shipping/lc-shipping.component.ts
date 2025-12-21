import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
    templateUrl: 'lc-shipping.component.html',
    selector: 'lc-shipping',
})
export class LcShippingComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() lcIssuanceId: number;
    @Output() count: EventEmitter<number> = new EventEmitter<number>(); // todo
    @Input() showButtons = true;

    @Input() set reload(value: number) { if (value > 0) this.getLcShippings(this.lcIssuanceId); }

    formState: string = 'New';
    selectedId: number = null;

    lcShippings: any[] = [];
    lcShippingForm: FormGroup;
    displayLcShippingForm: boolean = false;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
		private lcService: LetterOfCreditService,
		) { }

    ngOnInit() {
        this.clearControls();
        this.getLcShippings(this.lcIssuanceId);
    }

    // ------------------- api-calls --------------------
 
    saveLcShipping(form) {
        let body = {
            lcIssuanceId: form.value.lcIssuanceId,
            partyName: form.value.partyName,
            partyAddress: form.value.partyAddress,
            portOfDischarge: form.value.portOfDischarge,
            portOfShipment: form.value.portOfShipment,
            latestShipmentDate: form.value.latestShipmentDate,
            isPartShipmentAllowed: form.value.isPartShipmentAllowed,
            isTransShipmentAllowed: form.value.isTransShipmentAllowed,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.lcService.saveLcShipping(body).subscribe((response: any) => {
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
            this.lcService.updateLcShipping(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    getLcShippings(lcIssuanceId) {
        this.lcShippings = [];
        this.lcService.getLcShippingsByLcIssuanceId(lcIssuanceId).subscribe((response: any) => {
            this.lcShippings = response.result;
            this.count.emit(response.result.length);
        });
    }

    deleteLcShipping(row) {
        this.lcService.deleteLcShipping(row.lcShippingId).subscribe((response: any) => {
            if (response.result == true) this.reloadGrid();
        });
    }

    reloadGrid() {
        this.displayLcShippingForm = false;
        this.getLcShippings(this.lcIssuanceId);
        this.clearControls();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.lcShippingForm = this.fb.group({
            lcIssuanceId: [this.lcIssuanceId, Validators.required],
            partyName: ['', Validators.required],
            partyAddress: ['', Validators.required],
            portOfDischarge: ['', Validators.required],
            portOfShipment: ['', Validators.required],
            latestShipmentDate: ['', Validators.required],
            isPartShipmentAllowed: false,
            isTransShipmentAllowed: false,
        });
    }

    editLcShipping(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.lcShippingId;
        this.lcShippingForm = this.fb.group({
            lcIssuanceId: [row.lcIssuanceId, Validators.required],
            partyName: [row.partyName, Validators.required],
            partyAddress: [row.partyAddress, Validators.required],
            portOfDischarge: [row.portOfDischarge, Validators.required],
            portOfShipment: [row.portOfShipment, Validators.required],
            isPartShipmentAllowed: [row.isPartShipmentAllowed],
            isTransShipmentAllowed: [row.isTransShipmentAllowed],
            latestShipmentDate: ['', Validators.required]
            
        });
        this.displayLcShippingForm = true;
    }

    showLcShippingForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayLcShippingForm = true;
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
