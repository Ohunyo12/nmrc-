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
    templateUrl: './checklist-details.component.html'
})

export class ChecklistDetailComponent implements OnInit {

    displayChecklistForm = false;

    checklistDetailForm: FormGroup;
    checklistDetailData: any[];
    checklistDetailTableCols: any[];

    checklistDefData: any[];
    targetTypeData: any[];
    checklistStatusData: any[];

    panelHeader = 'New Checklist Detail';

    selectedDate: Date = new Date();

    disableProductBtn = true; productData: any[] = []; selectedTargetType: any;
    selectedProduct: any;

    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private validationService: ValidationService, private checklistService: ChecklistService,
        private productService: ProductService) { }

    ngOnInit() {
        this.loadingService.show();

        this.checklistDetailTableCols = [
            { field: 'checkListDefinitionItemName', header: 'Checklist Defition Item' },
            // { field: 'targetId', header: 'Target' },
            { field: 'targetTypeName', header: 'Target Type' },
            { field: 'checkListStatusName', header: 'Checklist Status' },
            { field: 'remark', header: 'Remark' },
            // { field: 'deferedDate', header: 'Defered Date'},
        ];

        this.loadAllChecklistDetailForm(); 
        this.loadAllChecklistDetail();
        this.loadAllChecklistDefinitions(); this.loadAllChecklistStatus();
        this.loadAllChecklistTargetType(); this.loadAllProducts();

    }

    loadAllChecklistDetailForm() {
        this.checklistDetailForm = this.fb.group({
            checkListId: ['0'],
            checkListDefinitionId: [''],
            targetTypeId: [''],
            targetId: [''],
            checkListStatusId: [''],
            deferedDate: [''],
            remark: [''],
        });
    }

    loadAllChecklistDetail() {
        this.checklistService.getAllChecklistDetail().subscribe((data) => {
            this.checklistDetailData = data.result;
        });
    }

    loadAllChecklistDefinitions() {
        this.checklistService.getAllChecklistDefinition().subscribe((data) => {
            this.checklistDefData = data.result;
        });
    }

    loadAllChecklistTargetType() {
        this.checklistService.getAllChecklistTargetTypes().subscribe((data) => {
            this.targetTypeData = data.result;
        }, (err) => {
            this.loadingService.hide();
        });
    }

    loadAllChecklistStatus() {
        this.checklistService.getAllChecklistStatus().subscribe((data) => {
            this.checklistStatusData = data.result;
        });
    }

    loadAllProducts() {
        this.productService.getAllProducts().subscribe((data) => {
            this.productData = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    onTargetTypeSelect(targetTypeId) {
        if (this.productData.length > 0) {
            this.disableProductBtn = false;
        }
        if (this.selectedProduct > 0) {
            this.loadChecklistDetailByProductAndTargetType(this.selectedProduct, targetTypeId);
        }
        this.selectedTargetType = targetTypeId;
    }

    onProductSelect(productId) {
        this.selectedProduct = productId;
        this.loadChecklistDetailByProductAndTargetType(productId, this.selectedTargetType);
    }

    loadChecklistDetailByProductAndTargetType(productId, targetTypeId) {
        this.loadingService.show();
        this.checklistService.getAllChecklistDetailByProductAndTargetId(targetTypeId, productId).subscribe((res) => {
            this.checklistDetailData = res.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    showChecklistDetailForm() {
        this.loadAllChecklistDetailForm();
        this.panelHeader = 'New Checklist Detail';
        this.displayChecklistForm = true;
    }

    editChecklistDetail(index, evt) {
        evt.preventDefault();
        this.panelHeader = 'Edit Checklist Detail';
        this.displayChecklistForm = true;
        let row = index;
        row.deferedDate != null ? this.selectedDate = new Date(row.deferedDate) : new Date();
        this.checklistDetailForm = this.fb.group({
            checkListId: [row.checklistId],
            checkListDefinitionId: [row.checkListDefinitionId],
            targetTypeId: [row.targetTypeId],
            targetId: [row.targetId],
            checkListStatusId: [row.checkListStatusId],
            deferedDate: [this.selectedDate],
            remark: [row.remark],
        });
    }

    onFormSubmit(form) {
        this.loadingService.show();

        let bodyObj = {
            checkListDefinitionId: form.value.checkListDefinitionId,
            targetTypeId: form.value.targetTypeId,
            targetId: form.value.targetId,
            checkListStatusId: form.value.checkListStatusId,
            deferedDate: this.selectedDate.toLocaleDateString(),
            remark: form.value.remark,
        };

        let selectedId = form.value.checklistId;

        if (selectedId === '0') {
            this.checklistService.addChecklistDetail(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    this.displayChecklistForm = false;
                    this.loadAllChecklistDetailForm();
                    this.loadAllChecklistDetail();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.checklistService.updateChecklistDetail(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    this.displayChecklistForm = false;
                    this.loadAllChecklistDetailForm();
                    this.loadAllChecklistDetail();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }

    }
}