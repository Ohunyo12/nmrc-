import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService } from '../../../services';

import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
    templateUrl: './approval-rule.component.html'
})

export class BusinessRuleComponent implements OnInit {

    businessRuleForm: FormGroup;
    multiple: any;
    displayModalForm = false;
    displayDynamicModalForm = false;
    activeIndex: any;
    activeTabIndex: any;
    businessRuleTableData: any[];
    businessRuleTableCols: any[];
    selectedId: number = null;
    panelHeader = 'New Business Rule';
    displayAddModal: boolean = false;
    //selectedId: number;
    addForm: FormGroup;
    entityName: string = 'Dynamic Workflow Set-up';
    show: boolean = false; message: any; title: any; cssClass: any;
    context: any;
    dataItems: any;
    filteredItems: any;
    selectedContextId: any;
    workflowExpressions: any[] = [];
    allOperators: any;
    moreDynamics = false;
    selectedItemId: any;
    filteredValue: any;
    keyValues: any;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private validationService: ValidationService,
        private approvalService: ApprovalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getAllDynamicWorkflowContext();
        this.getAllOperators();
        this.getAllDynamicWorkflowDataItem();
        this.getAllDynamicWorkflows();
        this.loadingService.show();

        this.businessRuleTableCols = [
            { field: 'description', header: 'Description' },
            { field: 'minimumAmount', header: 'Minimum Amount' },
            { field: 'maximumAmount', header: 'Maximum Amount' },
            { field: 'pep', header: 'PEP' },
        ];

        this.loadAllForms();
        this.loadAllBusinessRules();

        this.loadingService.hide();
    }

    loadAllForms() {
        this.businessRuleForm = this.fb.group({
            description: ['', Validators.required],
            minimumAmount: [''],
            maximumAmount: [''],
            pepAmount: [''],
            pep: [false],
            projectRelated: [false],
            insiderRelated: [false],
            onLending: [false],
            interventionFunds: [false],
            orrBasedApproval: [false],
            withoutInstruction: [false],
            domiciliationNotInPlace: [false],
            esrm: [false],
            exemptContingentFacility: [false],
            isForContingentFacility: [false],
            tenor: [''],
            excludeLevel: [false],
            isAgricRelated: '',
            isForRenewal: '',
            exemptRenewal: '',
            isSyndicated: ''
        });
        let control = this.businessRuleForm.get('pepAmount');
        control.disable();
    }

    loadAllBusinessRules() {
        this.approvalService.getBusinessRules().subscribe((data) => {
            this.businessRuleTableData = data.result;
        });
    }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }

    showModalForm() {
        if(this.activeTabIndex==1){this.activeIndex==1}
        this.loadAllForms();
        this.panelHeader = 'New Business Rule';
        this.displayModalForm = true;
        this.selectedId = null;
    }

    editBusinessRule(row) {
        this.selectedId = row.levelBusinessRuleId;
        this.panelHeader = 'Edit Business Rule';
        this.displayModalForm = true;
        this.activeIndex == 0;
        this.businessRuleForm = this.fb.group({
            description: row.description,
            minimumAmount: row.minimumAmount,
            maximumAmount: row.maximumAmount,
            pepAmount: row.pepAmount,
            pep: row.pep,
            projectRelated: row.projectRelated,
            insiderRelated: row.insiderRelated,
            onLending: row.onLending,
            interventionFunds: row.interventionFunds,
            orrBasedApproval: row.orrBasedApproval,
            withoutInstruction: row.withoutInstruction,
            domiciliationNotInPlace: row.domiciliationNotInPlace,
            esrm: row.esrm,
            exemptContingentFacility: row.exemptContingentFacility,
            isForContingentFacility: row.isForContingentFacility,
            tenor: row.tenor,
            excludeLevel: row.excludeLevel,
            isAgricRelated: row.isAgricRelated,
            isForRenewal: row.isForRenewal,
            exemptRenewal: row.exemptRenewal,
            isSyndicated: row.isSyndicated
        });
    }

    deleteBusinessRule(row) {
        let __this = this;
        swal({
            title: 'Delete Business Rule',
            text: 'Do you want to proceed?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.approvalService.deleteBusinessRule(row.levelBusinessRuleId).subscribe((response: any) => {//
                if (response.success == true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                __this.loadAllBusinessRules();
                __this.loadingService.hide();
            }, (err) => {
                __this.loadingService.hide(1000);
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }


    deleteDynamicBusinessRule(row) {
        let __this = this;
        swal({
            title: 'Delete Business Rule',
            text: 'Do you want to proceed?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            __this.loadingService.show();
            __this.approvalService.deleteDynamicBusinessRule(row.expressionId).subscribe((response: any) => {//
                if (response.success == true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                __this.loadAllBusinessRules();
                __this.loadingService.hide();
            }, (err) => {
                __this.loadingService.hide(1000);
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    submitGroupForm(form) {
        let bodyObj = {
            description: form.value.description,
            minimumAmount: form.value.minimumAmount,
            maximumAmount: form.value.maximumAmount,
            pepAmount: form.value.pepAmount,
            pep: form.value.pep,
            projectRelated: form.value.projectRelated,
            insiderRelated: form.value.insiderRelated,
            onLending: form.value.onLending,
            interventionFunds: form.value.interventionFunds,
            orrBasedApproval: form.value.orrBasedApproval,
            withoutInstruction: form.value.withoutInstruction,
            domiciliationNotInPlace: form.value.domiciliationNotInPlace,
            esrm: form.value.esrm,
            exemptContingentFacility: form.value.exemptContingentFacility,
            isForContingentFacility: form.value.isForContingentFacility,
            tenor: form.value.tenor,
            excludeLevel: form.value.excludeLevel,
            isAgricRelated: form.value.isAgricRelated,
            isForRenewal: form.value.isForRenewal,
            exemptRenewal: form.value.exemptRenewal,
            isSyndicated: form.value.isSyndicated
        };

        this.loadingService.show();
        if (this.selectedId === null) {
            this.approvalService.addBusinessRule(bodyObj).subscribe((response: any) => {//
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.loadAllBusinessRules();
                this.loadingService.hide();
                this.loadAllForms();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        } else {
            this.approvalService.updateBusinessRule(this.selectedId, bodyObj).subscribe((response: any) => {//
                if (response.success === true) {
                    swal('Fintrak Banking', response.message, 'success');
                } else {
                    swal('Fintrak Banking', response.message, 'error');
                }
                this.displayModalForm = false;
                this.loadAllBusinessRules();
                this.loadingService.hide();
                this.loadAllForms();
            }, (err) => {
                swal('Fintrak Banking', JSON.stringify(err), 'error');
            });
        }
    }

    isPoliticallyExposedPersonChange(checked) {
        let control = this.businessRuleForm.get('pepAmount');
        if (checked) control.enable();
        else control.disable();
        control.updateValueAndValidity();
    }

    showAddModal() {
        this.clearControls();
        this.displayDynamicModalForm = true;
    }

    clearControls() {
        this.selectedId = null;
        this.addForm = this.fb.group({
            contextId: ["", Validators.required],
            dataItemId: ["", Validators.required],
            comparisonId: ["", Validators.required],
            textValue: [""],
            boolValue: [false],
            approvalBusinessRuleId: [""],
            combineId: [""],
            idValue: []
        });
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
        this.displayDynamicModalForm = false;
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    editWorkflow(row) {
        this.loadingService.show();
        if (this.filteredItems == undefined) {
            this.approvalService.getDynamicWorkflowDataItemByContextId(row.contextId).subscribe((response: any) => {
                this.filteredItems = response.result;
                this.filteredItems.splice;
            }, (err: any) => {
            });
        }
        this.approvalService.getValueTypeByItemId(row.dataItemId).subscribe((response: any) => {
            this.filteredValue = response.result; this.filteredValue.splice;
        }, (err: any) => { });

        this.approvalService.getDynamicBusinessRuleItemValueListByItemId(row.dataItemId).subscribe((response: any) => {
            this.keyValues = response.result; this.keyValues.splice;
            this.loadingService.hide();
        }, (err: any) => { });

        if (row.valueTypeId == 1) { this.addForm.controls['textValue'].setValue(row.value); }

        this.displayDynamicModalForm = true;
        this.activeIndex = 1;

        this.activeIndex == 1;
        this.selectedId = row.expressionId;
        this.addForm = this.fb.group({
            contextId: [row.contextId, Validators.required],
            dataItemId: [row.dataItemId, Validators.required],
            comparisonId: [row.comparisonId, Validators.required],
            idValue: [row.idValue,],
            textValue: [row.textValue],
            boolValue: [row.boolValue],
            combineId: [row.combineId],
            approvalBusinessRuleId: [row.approvalBusinessRuleId]
        });
       
    }

    // getAllDynamicWorkflows(){
    //   this.approvalService.getDynamicWorkflow();
    // }

    getAllDynamicWorkflowContext() {
        this.approvalService.getDynamicWorkflowContext().subscribe((response: any) => {
            this.context = response.result;

        }, (err: any) => {
        });
    }

    getAllOperators() {
        this.approvalService.getAllOperators().subscribe((response: any) => {
            this.allOperators = response.result;

        }, (err: any) => {
        });
    }

    getAllDynamicWorkflowDataItem() {
        this.approvalService.getDynamicWorkflowDataItem().subscribe((response: any) => {
            this.dataItems = response.result;

        }, (err: any) => {
        });
    }

    getAllDynamicWorkflows() {
        this.loadingService.show();
        this.approvalService.getDynamicWorkflowExpression().subscribe((response: any) => {
            this.workflowExpressions = response.result;
            this.loadingService.hide();

        }, (err: any) => {
        });
    }

    onContextChange(contextId) {
        this.selectedContextId = contextId;
        this.approvalService.getDynamicWorkflowDataItemByContextId(contextId).subscribe((response: any) => {
            this.filteredItems = response.result;

        }, (err: any) => {
        });

    }

    onItemChange(dataItemId) {
        this.selectedItemId = dataItemId;
        this.approvalService.getValueTypeByItemId(dataItemId).subscribe((response: any) => {
            this.filteredValue = response.result;
        }, (err: any) => {
        });
        this.approvalService.getDynamicBusinessRuleItemValueListByItemId(dataItemId).subscribe((response: any) => {
            this.keyValues = response.result;
            console.log("e be things ", response.result)
            //
        }, (err: any) => {
        });
    }

    onMoreChange(event) {
        this.moreDynamics = true;
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            contextId: form.value.contextId,
            dataItemId: form.value.dataItemId,
            comparisonId: form.value.comparisonId,
            idValue: form.value.idValue,
            textValue: form.value.textValue,
            boolValue: form.value.boolValue,
            combineId: form.value.combineId,
            approvalBusinessRuleId: form.value.approvalBusinessRuleId
        };
        if (this.selectedId === null) {
            this.approvalService.saveDynamicWorkflow(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllDynamicWorkflows();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.approvalService.updateDynamicWorkflow(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllDynamicWorkflows();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    hideMessage() {
        this.show = false;
    }

}

