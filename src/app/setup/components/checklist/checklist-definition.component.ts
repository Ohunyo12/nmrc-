import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChecklistService } from '../../services';
import { ApprovalService } from '../../services';
import { ProductService } from '../../services';
import { ApprovalLevel } from '../../models/approval-level';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: './checklist-definition.component.html'
})

export class ChecklistDefinitionComponent implements OnInit { 
    groupId: number;
    displayChecklistTypeMapping: boolean = false;
    responseType: any[];
    checklistTypeMappings: any[];
    displayChecklistForm = false;
    displayChecklistDefForm = false;
    showChecklistItemTable = false;
    displayChecklistItemForm = false;
    displayChecklistItemMappingForm = false;
    displayMultipleMappingForm = false;

    checklistDefForm: FormGroup;
    checklistItemForm: FormGroup;
    checklistItemMappingForm: FormGroup;
    mutlipleItemMappingForm: FormGroup;
    checklistTypeMappingForm: FormGroup;
    checklistDefData: any[];
    checklistDefTableCols: any[];
    checklistItemData: any[];
    checklistItemTableCols: any[];
    operationData: any[];
    selectedOperationId: number;
    selectedOperation: any;
    approvalLevelData: any[];
    tempApprovalLevelData: ApprovalLevel[];
    productData: any[];
    chkItemSelection: any[];
    checklistTypeList: any[];
    filteredOperations: any[];
    operationTypes: any[];
    unmappedChecklistItems: any[] = [];
    mappedChecklistItems: any[] = [];
    multipleMappingData: any[] = [];

    defPanelHeader = 'New Checklist Definition';
    itemPanelHeader = 'Create Checklist Item';

    checklistItemModel: any;
    btnDisabled = true;

    selectedProduct = 0; selectedApprovalLevel = 0;
    approvalGroupData: any[];
    filteredApprovalLevel: any[];
    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private validationService: ValidationService, private checklistService: ChecklistService,
        private approvalService: ApprovalService, private productService: ProductService) { }

    ngOnInit() {
        this.loadingService.show();

        this.checklistDefTableCols = [
            { field: 'productName', header: 'Product' },
            { field: 'checkListItemName', header: 'Checklist Item' },
            { field: 'itemDescription', header: 'Description' },
            { field: 'approvalLevelName', header: 'Approval Level' },
            // { field: 'isActive', header: 'is Active' },
            // { field: 'isRequired', header: 'is Required' },
        ];

        this.checklistItemTableCols = [
            { field: 'checkListItemName', header: 'Checklist Item Name' },
            // { field: 'dateTimeCreated', header: 'Date Created' },
        ];

        this.loadChecklistDefForm(); this.loadChecklistItemForm();
        this.loadChecklistItemMappingForm(); this.loadMultipleMappingForm();
        this.loadAllChecklistDefinitions();
        this.loadApprovalLevels();
        this.loadApprovalGroups();
        this.loadAllProducts();
        this.LoadChecklistType();
        this.loadOperationTypes();
        this.loadResponseType();
        this.loadOperations();
        this.loadAllChecklistItems();
        this.loadChecklistTypeMappingForm();
        this.getAllChecklistTypeMapping();
    }

    loadChecklistDefForm() {
        this.checklistDefForm = this.fb.group({
            checkListDefinitionId: [''],
            productId: ['', Validators.required],
            operationId: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            checkListTypeId: ['', Validators.required],
            operationTypeId: ['', Validators.required],
            checkListItemId: [''],
            itemDescription: [''],
            isRequired: [false],
            isActive: [false],
        });
    }

    loadChecklistItemForm() {
        this.checklistItemForm = this.fb.group({
            checkListItemId: [''],
            responseTypeId: ['', Validators.required],
            checkListTypeId: ['', Validators.required],
            checkListItemName: ['', Validators.required],
            requireUpload: [false, Validators.required]

        });
    }

    loadChecklistItemMappingForm() {
        this.checklistItemMappingForm = this.fb.group({
            checkListDefinitionId: [''],
            productId: ['', Validators.required],
            operationId: ['', Validators.required],
            operationTypeId: ['', Validators.required],
            checkListTypeId: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            checkListItemId: [''],
            itemDescription: [''],
            isRequired: [false],
            isActive: [false],
        });
    }

    loadMultipleMappingForm() {
        this.mutlipleItemMappingForm = this.fb.group({
            checkListDefinitionId: [''],
            operationId: ['', Validators.required],
            productId: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            checkListItems: ['']
        });

    }
    loadChecklistTypeMappingForm() {
        this.checklistTypeMappingForm = this.fb.group({
            checklistTypeMappingId: [0, Validators.required],
            checkListTypeId: ['', Validators.required],
            approvalLevelId: ['', Validators.required],
            approvalGroupId: [0],
            validateChecklist: [false]
        });
    }

    getAllChecklistTypeMapping() {
        this.checklistService.getAllChecklistTypeMapping().subscribe((data) => {
            this.checklistTypeMappings = data.result;           
        });
    }

    loadAllChecklistDefinitions() {
        this.checklistService.getAllChecklistDefinition().subscribe((data) => {
            this.checklistDefData = data.result;
            // this.mappedChecklistItems = this.checklistDefData;
            
        });
    }

    loadAllProducts() {
        this.productData = [];
        this.productService.getAllProducts().subscribe((data) => {
            this.productData = data.result;
        });
    }

    loadOperations() {
        this.operationData = [];
        this.approvalService.getAllOperations().subscribe((data) => {
            this.operationData = data.result;
        });
    }
    loadOperationTypes() {
        this.approvalService.getOperationtypes().subscribe((response: any) => {
            this.operationTypes = response.result;
        });
    }
    onOperationTypeChange(id) {
        this.filteredOperations = this.operationData.filter(x => x.lookupTypeId == id);
    }
    onOperationSelect(id) {
        this.selectedOperationId = id;
        this.loadAllApprovalLevels(id);
    }

    onProductSelect(id) {
        this.selectedProduct = id;
        this.onApprovalLevelSelect(this.selectedApprovalLevel);
    }

    loadApprovalLevels() {
        this.approvalService.getApprovalLevel().subscribe((data) => {
            this.approvalLevelData = data.result;
        });
    }
    loadApprovalGroups() {
        this.approvalService.getApprovalGroups().subscribe((data) => {
            this.approvalGroupData = data.result;
        });
    }
    loadResponseType() {
        this.checklistService.getAllChecklistResponseType().subscribe((data) => {
            this.responseType = data.result;
        });
    }

    LoadChecklistType() {
        this.checklistService.getChecklistType().subscribe((data) => {
            this.checklistTypeList = data.result;
        });
    }
    loadAllApprovalLevels(operationId) {
        this.approvalLevelData = [];
        this.approvalService.getApprovalLevelByOperation(operationId).subscribe((data) => {
            this.approvalLevelData = data.result;
        });
    }

    onApprovalLevelSelect(apprLevelId) {
        this.selectedApprovalLevel = apprLevelId;
        this.loadingService.show();
        ////console.log('productId', this.selectedProduct);
        this.loadChecklistDefinitionsByApprovalLevel(this.selectedApprovalLevel, this.selectedProduct);
        // this.mappedChecklistItems = this.checklistDefData.filter(x => x.approvalLevelId === parseInt(apprLevelId));
        ////console.log('mapped checklist iems', this.mappedChecklistItems);
        this.showChecklistItemTable = true;
    }

    loadChecklistDefinitionsByApprovalLevel(apprLevelId, productId) {
        this.loadingService.show();
        this.checklistService.getMappedChecklistDefinitionByApprovalLevelAndProduct(apprLevelId, productId).subscribe((res) => {
            this.mappedChecklistItems = res.result;
        }, (err) => {
            this.loadingService.hide();
            ////console.log('error', err);
        });

        this.checklistService.getUnMappedChecklistDefinitionByApprovalLevelAndProduct(apprLevelId, productId).subscribe((data) => {
            this.unmappedChecklistItems = data.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
        this.selectedApprovalLevel = null;
    }

    loadAllChecklistItems() {
        this.checklistItemData = [];
        this.checklistService.getAllChecklistItem().subscribe((data) => {
            this.checklistItemData = data.result;
            
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    showChecklistDefinitionForm() {
        this.loadChecklistDefForm();
        this.defPanelHeader = 'New Checklist Definition';
        this.displayChecklistForm = true;
        this.showChecklistItemTable = false;
    }

    showChecklistItemForm() {
        this.itemPanelHeader = 'Create Checklist Item';
        this.loadChecklistItemForm();
        this.displayChecklistItemForm = true;
    }

    selectChecklistItem() {
        this.chkItemSelection.push(this.checklistItemModel);
    }

    editChecklistDefinition(index, evt) {
        evt.preventDefault();
        this.defPanelHeader = 'Checklist Definition Details';
        this.displayChecklistForm = true;

        let row = index;
        ////console.log('selected definition', row);
        let selectedApprovalLevel = this.approvalLevelData.find(x => x.approvalLevelId === row.approvalLevelId);
        this.selectedOperation = selectedApprovalLevel;
        ////console.log('selected operation', selectedApprovalLevel);
        this.onApprovalLevelSelect(row.approvalLevelId);
        this.checklistDefForm = this.fb.group({
            checkListDefinitionId: [row.checkListDefinitionId],
            productId: [row.productId],
            operationId: [selectedApprovalLevel.operationId],
            approvalLevelId: [selectedApprovalLevel.approvalLevelId],
            operationTypeId: [''],
            checkListTypeId: [row.checkListTypeId],
            checkListItemId: [''],
            itemDescription: [''],
            isRequired: [''],
            isActive: [''],
        });

        this.showChecklistItemTable = true;

    }

    editChecklistItemMapping(index, evt) {
        evt.preventDefault();
        this.defPanelHeader = 'Edit Checklist Definition';
        this.displayChecklistItemMappingForm = true;

        let row = index;
        ////console.log('selected item', row);
        let selectedApprovalLevel = this.approvalLevelData.find(x => x.approvalLevelId === row.approvalLevelId);
        ////console.log('selected approvalLevel', selectedApprovalLevel);
        this.onApprovalLevelSelect(row.approvalLevelId);
        this.checklistItemMappingForm = this.fb.group({
            checkListDefinitionId: [row.checkListDefinitionId],
            productId: [row.productId],
            operationId: [selectedApprovalLevel.operationId],
            approvalLevelId: [row.approvalLevelId],
            operationTypeId: [''],
            checkListTypeId: [row.checkListTypeId],
            checkListItemId: [row.checkListItemId],
            itemDescription: [row.itemDescription],
            isRequired: [row.isRequired],
            isActive: [row.isActive],
        });

    }

    mapChecklistDefinition(index, evt) {
        evt.preventDefault();
        this.loadChecklistItemMappingForm();
        this.displayChecklistDefForm = true;
        let row = index;
        this.checklistDefForm.controls['checkListItemId'].setValue(row.checkListItemId);
    }

    editChecklistItem(index, evt) {
        evt.preventDefault();
        this.itemPanelHeader = 'Edit Checklist Item';
        this.displayChecklistItemForm = true;

        let row = index;

     //   //console.log('row',row);
        
        this.checklistItemForm = this.fb.group({
            checkListItemId: [row.checkListItemId],
            responseTypeId: [row.responseTypeId,RequiredValidator],
            checkListTypeId: [row.checkListTypeId, RequiredValidator],
            checkListItemName: [row.checkListItemName,RequiredValidator],
            requireUpload: [row.requireUpload]
        });
    }

    submitChecklistDefForm(form) {
        this.loadingService.show();
        let selectedId = form.value.checkListDefinitionId;
        ////console.log('selected checklistId', typeof (selectedId));
        let bodyObj = {
            // checkListDefinitionId: form.value.checklistDefinitionId,
            operationId: form.value.operationId,
            productId: form.value.productId,
            approvalLevelId: form.value.approvalLevelId,
            checkListItemId: form.value.checkListItemId,
            checkListTypeId: form.value.checkListTypeId,
            itemDescription: form.value.itemDescription,
            isRequired: form.value.isRequired,
            isActive: form.value.isActive
        };

        ////console.log('checklistModel', this.checklistItemModel);

        ////console.log('form obj', bodyObj);

        // let selectedId = form.value.checkListDefinitionId;
        ////console.log('selected checklistId', typeof (selectedId));
        if (selectedId === null || typeof (selectedId) === 'string') {
            this.checklistService.addChecklistDefinition(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                this.showChecklistItemTable = false;
                if (res.success === true) {
                    this.displayMultipleMappingForm = false;
                    this.checklistItemModel = [];
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadChecklistDefForm();
                    this.loadAllChecklistDefinitions();
                    this.onApprovalLevelSelect(bodyObj.approvalLevelId);
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                this.showChecklistItemTable = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });
        } else {
            this.checklistService.updateChecklistDefinition(bodyObj, selectedId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadAllChecklistDefinitions();
                    this.onApprovalLevelSelect(bodyObj.approvalLevelId);
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();

                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
            });
        }
    }

    submitChecklistItemForm(form) {
        this.loadingService.show();

        let bodyObj = {
            responseTypeId: form.value.responseTypeId,
            requireUpload: form.value.requireUpload,
            checkListTypeId: form.value.checkListTypeId,
            checkListItemName: form.value.checkListItemName
        };

        let selectedId = form.value.checkListItemId;
        ////console.log('selected checklistId', typeof (selectedId));

        if (selectedId === null || typeof (selectedId) === 'string') {
            this.checklistService.addChecklistItem(bodyObj).subscribe((response: any) => {
                this.loadingService.hide();
                this.displayChecklistItemForm = false;
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.loadAllChecklistItems();
                    this.displayChecklistItemForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.checklistService.updateChecklistItem(bodyObj, selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.loadAllChecklistItems();
                    this.displayChecklistItemForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }
    }

    addMultipleChecklistItems() {
        this.defPanelHeader = 'Create Multiple Definitions';
        // this.mutlipleItemMappingForm = this.fb.group({
        //     checkListDefinitionId: [''],
        //     operationId: [this.selectedOperation.operationId],
        //     productId: [''],
        //     approvalLevelId: [this.selectedOperation.approvalLevelId],
        //     checkListItems: ['']
        // });
        // this.loadMultipleMappingForm();
        this.multipleMappingData = this.checklistItemModel;
        ////console.log('multiple checklists', this.multipleMappingData);
        this.displayMultipleMappingForm = true;
    }

    submitMultipleChecklistDefForm(form) {
        this.loadingService.show();

        let bodyObj = {
            productId: form.value.productId,
            approvalLevelId: form.value.approvalLevelId,
            checkListTypeId: form.value.checkListTypeId,
            operationId: form.value.operationId,
            // checkListItemId: form.value.checkListItemId,
            // itemDescription: form.value.itemDescription,
            // isRequired: form.value.isRequired,
            // isActive: form.value.isActive,
            checkListItems: this.multipleMappingData
        };

        // this.multipleMappingData.forEach(el => {
        //     bodyObj.checkListItems.push(el);
        // });

        ////console.log('form obj', bodyObj);

        this.checklistService.addChecklistDefinitionWithMultipleItems(bodyObj).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.displayMultipleMappingForm = false;
                this.checklistItemModel = [];
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loadAllChecklistDefinitions();
                this.onApprovalLevelSelect(bodyObj.approvalLevelId);
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });

    }
    getApprovalLevelWithGroupId(groupId) {
        if (Number(groupId) > 0 && this.approvalLevelData != undefined) {
            this.filteredApprovalLevel = this.approvalLevelData.filter(x => x.groupId == groupId);
        }
    }
    getApprovalGroupIdWithLevelId(levelId) {
        if (Number(levelId) > 0 && this.approvalLevelData != undefined) {
            let levelGroup = this.approvalLevelData.find(x => x.approvalLevelId == levelId).groupId;
            this.groupId = levelGroup;
            this.getApprovalLevelWithGroupId(this.groupId);
        }
    }
    showChecklistTypeMappingForm() {
        this.loadChecklistTypeMappingForm();
        this.displayChecklistTypeMapping = true;
    }
    editChecklistTypeMapping(index, evt) {
        evt.preventDefault();
        const row = index;
        this.getApprovalGroupIdWithLevelId(row.approvalLevelId);
        ////console.log('testing', row)
        this.checklistTypeMappingForm = this.fb.group({
            checklistTypeMappingId: [row.checklistTypeMappingId, Validators.required],
            checkListTypeId: [row.checkListTypeId, Validators.required],
            approvalLevelId: [row.approvalLevelId, Validators.required],
            approvalGroupId: [this.groupId, Validators.required],
            validateChecklist: [row.validateChecklist]
        });
        this.displayChecklistTypeMapping = true;
    }
    deleteChecklistTypeMapping(index) {
        const row = index;
        this.loadingService.show();
        this.checklistService.deleteChecklistTypeMapping(row.checklistTypeMappingId).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.getAllChecklistTypeMapping();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    submitChecklistTypeMappingForm(formObj) {
        this.loadingService.show();
        let objBody = {
            checklistTypeMappingId: formObj.value.checklistTypeMappingId,
            checkListTypeId: formObj.value.checkListTypeId,
            approvalLevelId: formObj.value.approvalLevelId,
            validateChecklist: formObj.value.validateChecklist
        }
        ////console.log(objBody);
        this.checklistService.addChecklistTypeMapping(objBody).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.displayChecklistTypeMapping = false;
                this.getAllChecklistTypeMapping();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayChecklistTypeMapping = true;
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    changeProductValidation(value) {
       // console.log(value);
        if (value == 3) {
            this.checklistDefForm.controls['productId'].setValidators(null);
            this.checklistDefForm.controls['productId'].updateValueAndValidity();
        } else {
            this.checklistDefForm.controls['productId'].setValidators(Validators.required);
            this.checklistDefForm.controls['productId'].updateValueAndValidity();
        }
    }
}