import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

import { Subject } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { ApprovalService } from 'app/setup/services';
import { ValidationService } from 'app/shared/services/validation.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { AuthenticationService } from 'app/admin/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
    templateUrl: './staff-relief.component.html'
})

export class StaffReliefComponent implements OnInit {

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
        private auth: AuthenticationService,
    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe((results: any) => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }
    userInfo: any;
    ngOnInit() {
        this.userInfo= this.auth.getUserInfo();

        this.clearControls();
        this.getStaffReliefs();
    }

    clearControls(): void{
        this.primaryForm = this.fb.group({
            staffId: [this.userInfo.staffId, Validators.required],
            reliefStaffId: ['', Validators.required],
            reliefReason: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            // startDate: [new Date(), Validators.required],
            // endDate: [new Date(), Validators.required],
            isActive: [false],
            staffName:[this.userInfo.userName ,Validators.required], // for search only
            reliefStaffName:['',Validators.required], // for search only
        });
    }

    getStaffReliefs() {
        this.loadingService.show();
        this.approvalService.getStaffReliefs(this.userInfo.staffId).subscribe((response: any) => {
            this.reliefs = response.result;
            ////console.log('..', response);
            this.loadingService.hide();
        }, (err) => {
            ////console.log('Server error', JSON.stringify(err));
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
        this.selectedId = row.reliefId;
        this.panelHeader = 'Edit Approval Relief';
        this.displayModalForm = true;
        this.primaryForm = this.fb.group({
            staffId: [row.staffId, Validators.required],
            reliefStaffId: [row.reliefStaffId, Validators.required],
            reliefReason: [row.reliefReason, Validators.required],
            startDate: [new Date(row.startDate), Validators.required],
            endDate: [new Date(row.endDate), Validators.required],
            isActive: [row.isActive],
            staffName: [row.staffName, Validators.required], // for search only
            reliefStaffName: [row.reliefStaffName, Validators.required], // for search only
        });
    }
    submitPrimaryForm(form){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: 'This action will be saved and can not be changed, Are you sure you want to proceed?',
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
            let body = {
                relievedStaffId: form.value.staffId,
                reliefStaffId: form.value.reliefStaffId,
                reliefReason: form.value.reliefReason,
                startDate: form.value.startDate,
                endDate: form.value.endDate,
                isActive: form.value.isActive,
            };
            // console.table('save levels ==> ', body);        
            ////console.log('save levels ==> ', JSON.stringify(body));        
            if (__this.selectedId === null) {
                __this.approvalService.addStaffRelief(body).subscribe((res) => {
                    if (res.success == true) {
                        swal('Fintrak Banking', res.message, 'success');

                    } else {
                        swal('Fintrak Banking', res.message, 'error');
                    }
                    __this.displayModalForm = false;
                    __this.getStaffReliefs();
                    __this.loadingService.hide();
                });
            } else {
                __this.approvalService.updateApprovalRelief(body, __this.selectedId).subscribe((res) => {
                    if (res.success === true) {
                        swal('Fintrak Banking', res.message, 'success');
                    } else {
                        swal('Fintrak Banking', res.message, 'error');
                    }
                    __this.displayModalForm = false;
                    __this.getStaffReliefs();
                    __this.loadingService.hide();
                });
            }

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    
    
    
        
      }
    submitPrimaryFormOld(form) {
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
            this.approvalService.addStaffRelief(body).subscribe((response: any) => {
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.getStaffReliefs();
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
                this.getStaffReliefs();
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