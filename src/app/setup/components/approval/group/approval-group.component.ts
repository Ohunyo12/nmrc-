import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService } from '../../../services';
import { ProductService } from '../../../services';
import { ApprovalGroupRole } from '../../../../shared/constant/app.constant';

import swal from 'sweetalert2';

@Component({
    templateUrl: './approval-group.component.html'
})

export class ApprovalGroupComponent implements OnInit {

    createEditForm: FormGroup;
    multiple:any;
    displayModalForm = false;
    activeIndex:any;
    approvalGroupTableData: any[];
    approvalGroupTableCols: any[];
    roles: any[] = ApprovalGroupRole.list;
    selectedId:number = null;
    panelHeader = 'New Workflow Group';

    constructor(
        private fb: FormBuilder, 
        private loadingService: LoadingService,
        private validationService: ValidationService, 
        private approvalService: ApprovalService,
    ) { }

    ngOnInit() {
        this.loadingService.show();

        this.approvalGroupTableCols = [
            { field: 'groupName', header: 'Group Name' },
            { field: 'companyName', header: 'Company Name' }
        ];

        this.loadAllForms(); 
        this.loadAllApprovalGroups();

        this.loadingService.hide();
    }

    loadAllForms() {
        this.createEditForm = this.fb.group({
            // groupId: [''],
            groupName: ['', Validators.required],
            roleId: ['', Validators.required],
            // branchFilter: ['', Validators.required],
        });
    }

    loadAllApprovalGroups() {
        this.approvalService.getApprovalGroups().subscribe((data) => {
            this.approvalGroupTableData = data.result;
            
        }, (err) => {
        });
    }

    showModalForm() {
        this.loadAllForms();
        this.panelHeader = 'New Workflow Group';
        this.displayModalForm = true;
        this.selectedId = null;
    }

    editApprovalGroup(row) {
        // evt.preventDefault();
        this.selectedId = row.groupId;
        this.panelHeader = 'Edit Workflow Group';
        this.displayModalForm = true;


        // let row = this.approvalGroupTableData[index];
        this.createEditForm = this.fb.group({
            // groupId: row.groupId,
            groupName: row.groupName,
            roleId: row.roleId,
            // branchFilter: row.branchFilter,
        });
    }

    submitGroupForm(form) {
        this.loadingService.show();
        let bodyObj = {
            groupName: form.value.groupName,
            roleId: form.value.roleId,
            // branchFilter: form.value.branchFilter,
        };

        // let selectedId = form.value.groupId;
        if (this.selectedId === null) {
            this.approvalService.addApprovalGroup(bodyObj).subscribe((response: any) => {
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.loadAllApprovalGroups();
                this.loadingService.hide();
                this.loadAllForms();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        } else {
            this.approvalService.updateApprovalGroup(this.selectedId, bodyObj).subscribe((response: any) => {
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.loadAllApprovalGroups();
                this.loadingService.hide();
                this.loadAllForms();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        }
    }
}