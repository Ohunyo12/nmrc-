import { CountryStateService } from '../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    selector: 'app-state',
    templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {
    
    states: any[];
    statesForm: FormGroup;
    selectedId: number = null;
    displayStateChargeModal: boolean = false;
    show: boolean = false; message: any; title: any; cssClass: any;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private countryStateSrv: CountryStateService) { }

    ngOnInit() {
        this.clearControls();
        this.getStates();
    }

    showAddModal() {
        this.clearControls();
        this.displayStateChargeModal = true;
    }

    getStates() {
        this.countryStateSrv.getStatesByCompanyId()
            .subscribe((response: any) => {
                this.states = response.result;
            });
    }

    editState(index, evt) {
        evt.preventDefault();

        let row = index;
        this.selectedId = row.stateId;

        this.statesForm = this.fb.group({
            stateId: [row.stateId],
            countryId: [row.countryId],
            stateName: [row.stateName],
            countryName: [row.countryName],
            collateralSearchChargeAmount: [row.collateralSearchChargeAmount, Validators.required],
            chartingAmount: [row.chartingAmount, Validators.required],
            verificationAmount: [row.verificationAmount, Validators.required],
        });
        this.displayStateChargeModal = true;
    }

    submitForm(formObj) {
        this.loadingService.show();
        const bodyObj = formObj.value;
        if (this.selectedId > 0) {
            this.countryStateSrv.updateStates(this.selectedId, bodyObj).subscribe((res) => {
                if (res.success === true) {
                    this.selectedId = null;
                    this.finishGood(res.message);
                    this.getStates();
                    this.displayStateChargeModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    clearControls() {
        this.selectedId = null;
        this.statesForm = this.fb.group({
            stateId: [''],
            countryId: [''],
            stateName: [''],
            countryName: [''],
            collateralSearchChargeAmount: [''],
            chartingAmount: [''],
            verificationAmount: ['']
        });
    }

    finishBad(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'success');
    }

    hideMessage(event) {
        this.show = false;
    }
}
