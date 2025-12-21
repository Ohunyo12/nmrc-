import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService } from '../../../services';
import swal from 'sweetalert2';

import { StaffRealTimeSearchService } from '../../../services/staff-realtime-search.service';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './approval-relief.component.html'
})

export class ApprovalReliefComponent implements OnInit {

    primaryForm: FormGroup;
    displayModalForm = false;
    selectedId: number = null;
    panelHeader = '';

    reliefs: any[] = [];

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private validationService: ValidationService,
        private approvalService: ApprovalService,
        private realSearchSrv: StaffRealTimeSearchService,
    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.clearControls();
        this.getApprovalReliefs();
    }

    clearControls(): void{
        this.primaryForm = this.fb.group({
            staffId: ['', Validators.required],
            reliefStaffId: ['', Validators.required],
            reliefReason: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            // startDate: [new Date(), Validators.required],
            // endDate: [new Date(), Validators.required],
            isActive: [false],
            staffName:['',Validators.required], // for search only
            reliefStaffName:['',Validators.required], // for search only
        });
    }

    getApprovalReliefs() {
        this.loadingService.show();
        this.approvalService.getApprovalReliefs().subscribe((response: any) => {
            this.reliefs = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
       });
    }

    showModalForm() {
        this.clearControls();
        this.panelHeader = 'New Approval Relief'; 
        this.displayModalForm = true;
        this.selectedId = null;
    }

    edit(row) {
        // console.log("row: ", row);
        this.selectedId = row.reliefId;
        this.panelHeader = 'Edit Approval Relief';
        this.displayModalForm = true;
        this.primaryForm = this.fb.group({
            staffId: [row.relievedStaffId, Validators.required],
            reliefStaffId: [row.reliefStaffId, Validators.required],
            reliefReason: [row.reliefReason, Validators.required],
            startDate: [new Date(row.startDate), Validators.required],
            endDate: [new Date(row.endDate), Validators.required],
            isActive: [row.isActive],
            staffName: [row.staffName, Validators.required], // for search only
            reliefStaffName: [row.reliefStaffName, Validators.required], // for search only
        });
    }

    submitPrimaryForm(form) {
        let body = {
            relievedStaffId: form.value.staffId,
            reliefStaffId: form.value.reliefStaffId,
            reliefReason: form.value.reliefReason,
            startDate: form.value.startDate,
            endDate: form.value.endDate,
            isActive: form.value.isActive,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.approvalService.addApprovalRelief(body).subscribe((response: any) => {
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.getApprovalReliefs();
                this.loadingService.hide();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        } else {
            this.approvalService.updateApprovalRelief(this.selectedId, body).subscribe((response: any) => {
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.getApprovalReliefs();
                this.loadingService.hide();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        }
    }

    // --------------- REALTIME SEARCH ----------------------

    searchResults: Object;
    searchTerm$ = new Subject<any>();
//    selectedSearchedId: number = null;
    selectedInput: number = 1;

    displaySearchModal: boolean = false;

    openSearchBox(input=1): void {
        this.displaySearchModal = true;
        this.selectedInput = input;
    }

    pickSearchedData(data) {
        if (this.selectedInput == 1) {
            const s = this.primaryForm.get('staffId');
            s.setValue(data.staffId);
            s.updateValueAndValidity();
            const n = this.primaryForm.get('staffName');
            n.setValue(data.fullName);
            n.updateValueAndValidity();
        }
        if (this.selectedInput == 2) {
            const s = this.primaryForm.get('reliefStaffId');
            s.setValue(data.staffId);
            s.updateValueAndValidity();
            const n = this.primaryForm.get('reliefStaffName');
            n.setValue(data.fullName);
            n.updateValueAndValidity();
        }
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }
}