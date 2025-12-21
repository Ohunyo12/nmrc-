import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChecklistService } from '../../services';
import { ApprovalService } from '../../services';
import { ProductService } from '../../services';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './checklist-item.component.html'
})

export class ChecklistItemComponent implements OnInit {

    checklistItemForm: FormGroup;

    checklistItemData: any[];
    checklistItemTableCols: any[];

    displayChecklistItemForm = false;

    itemPanelHeader = 'Create Checklist Item';

    constructor(private fb: FormBuilder, private validationService: ValidationService,
        private loadingService: LoadingService, private checklistService: ChecklistService) { }

    ngOnInit() {
        this.loadingService.show();

        this.checklistItemTableCols = [
            { field: 'checkListItemName', header: 'Checklist Item Name' },
            // { field: 'dateTimeCreated', header: 'Date Created' },
        ];

        this.loadingService.hide();
    }

    loadChecklistItemForm() {
        this.checklistItemForm = this.fb.group({
            checkListItemId: [''],
            checkListItemName: ['', Validators.required]
        });
    }

    loadChecklistItem() {
        this.checklistItemData = [];
        this.checklistService.getAllChecklistItem().subscribe((data) => {
            this.checklistItemData = data.result;
        });
    }

    showChecklistForm() {
        this.itemPanelHeader = 'Create Checklist Item';
        this.loadChecklistItemForm();
        this.displayChecklistItemForm = true;
    }
    editChecklistItem(index, evt) {
        evt.preventDefault();
        this.itemPanelHeader = 'Edit Checklist Item';
        this.displayChecklistItemForm = true;

        let row = this.checklistItemData[index];
        this.checklistItemForm = this.fb.group({
            checkListItemId: [row.checkListItemId],
            checkListItemName: [row.checkListItemName]
        });
    }

    submitChecklistItemForm(form) {
        this.loadingService.show();

        let bodyObj = {
            // checkListItemId: form.value.checkListItemId,
            checkListItemName: form.value.checkListItemName
        };

        let selectedId = form.value.checkListItemId;

        if (selectedId === '') {
            this.checklistService.addChecklistItem(bodyObj).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.loadChecklistItem();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.checklistService.updateChecklistItem(bodyObj, selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.loadChecklistItem();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }
    }
}