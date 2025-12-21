import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService, DocumentService } from '../../../services';
import { ProductService } from '../../../services';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

import { StaffRealTimeSearchService } from '../../../services';
import { CheckboxModule, EditorModule } from 'primeng/primeng';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { Console } from 'console';
import { isNullOrUndefined } from 'util';

@Component({
    templateUrl: 'approval-workflow.component.html'
})

export class ApprovalWorkflowComponent implements OnInit {

    show: boolean = false; message: any; title: any; cssClass: any;
    productClasses: any[];
    operations: any[];
    filteredOperations: any[];
    operationTypes: any[];
    groups: any[];
    operationSelectForm: FormGroup;
    displayTabs: boolean = false;
    selectedOperationName: string = null;
    selectedProductClassName: string = null;
    selectedOperationId: number = 0;
    selectedProductClassId?: number = null;
    selectedProductId?: number = null;
    formState: string = null;
    selectedId = null;
    disableLevelTab: boolean = true;
    disableStaffTab: boolean = true;
    // checkedOperationGroup: number = null;
    activeTabindex: number = 0;
    disableProductSelect: string;
    operationGroups: any[];
    displayOperationGroupModal = false;
    displayNotificationsModal = false;
    operationGroupForm: FormGroup;
    operationGroupSelection: any;
    // disableProductSelect: boolean = false; // ?

    approvalLevels: any[] = [];
    displayApprovalLevelModal = false;
    approvalLevelForm: FormGroup;
    notificationsForm: FormGroup;
    approvalLevelSelection: any = {};

    levelStaff: any[];
    displayLevelStaffModal = false;
    levelStaffForm: FormGroup;

    searchResults: Object;
    searchTerm$ = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;

    positions: any[];
    products: any[];
    filteredProducts: any[];
    globalID: any;
    alerts = [];

    selectedOperationPlaceholder: string = 'Loading...';

    allPositions = [
        { 'id': '1', 'name': 'Position 1', },
        { 'id': '2', 'name': 'Position 2', },
        { 'id': '3', 'name': 'Position 3', },
        { 'id': '4', 'name': 'Position 4', },
        { 'id': '5', 'name': 'Position 5', },
        { 'id': '6', 'name': 'Position 6', },
        { 'id': '7', 'name': 'Position 7', },
        { 'id': '8', 'name': 'Position 8', },
        { 'id': '9', 'name': 'Position 9', },
    ];

    tenorModes = [
        { 'tenorModeId': '1', 'tenorModeName': 'Days', },
        { 'tenorModeId': '2', 'tenorModeName': 'Months', },
        { 'tenorModeId': '3', 'tenorModeName': 'Years', },
    ];

    constructor(
        private loadingService: LoadingService, private validationService: ValidationService,
        private fb: FormBuilder, private approvalService: ApprovalService,
        private productService: ProductService,
        // private realSearchSrv: StaffRealTimeSearchService,
        private documentService: DocumentService

    ) {

    }

    ngOnInit() {
        // this.showStaffLevelForm(); // for testing
        this.selectedProductClassId = null;
        this.selectedProductId = null;
        this.clearOperationSelectForm();
        this.clearOperationGroupForm();
        this.clearNotificationsForm();
        this.loadDropdowns();
        this.getAllAlerts();
    }

    clearNotificationsForm(initialize = true) {
        if (initialize == true) {
            this.notificationsForm = this.fb.group({
                workflowNotificationId: '',
                groupOperationMappingId: '',
                approvalLevelId: '',
                notifyOfProceedingWorkflowActions: false,
                proceedingActionsAlertTitleId: '',
                includePoolInNotification: false,
                poolAlertTitleId: '',
                notifyOnwer: false,
                ownerAlertTitleId: '',
                notifyOfPendingApprovals: false,
                pendingApprovalAlertTitleId: ''
            });
        } else {
            this.notificationsForm = this.fb.group({
                workflowNotificationId: '',
                groupOperationMappingId: this.operationGroupSelection.groupOperationMappingId,
                approvalLevelId: this.approvalLevelSelection.approvalLevelId,
                notifyOfProceedingWorkflowActions: false,
                proceedingActionsAlertTitleId: '',
                includePoolInNotification: false,
                poolAlertTitleId: '',
                notifyOnwer: false,
                ownerAlertTitleId: '',
                notifyOfPendingApprovals: false,
                pendingApprovalAlertTitleId: ''
            });
        }
    }

    loadDropdowns() {
        const control = this.operationSelectForm.controls['operationTypeId'];
        control.reset({ value: '', disabled: true });
        this.approvalService.getOperationtypes().subscribe((response: any) => {
            this.operationTypes = response.result;
            control.reset({ value: '', disabled: false });
            this.selectedOperationPlaceholder = '-- Select Type --';
        });
        this.approvalService.getAllOperations().subscribe((response: any) => {
            this.operations = response.result;
        });
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
            ////console.log('DEBUGGER', JSON.stringify(response.result));
        });
        this.productService.getAllProductClasses().subscribe((response: any) => {
            this.productClasses = response.result;
        });
        this.approvalService.getApprovalGroups().subscribe((response: any) => {
            this.groups = response.result;
        });
    }

    filterPositions(list: any[], filter: boolean = true) {
        this.positions = this.allPositions;
        if (filter) {
            list.forEach(element => {
                this.positions = this.positions.filter(x => x.id != element.position)
            });
        }
    }

    clearOperationSelectForm() {
        this.operationSelectForm = this.fb.group({
            operationTypeId: ['', Validators.required],
            operationId: ['', Validators.required],
            productClassId: [''],
            productId: [''],
        });
    }

    onOperationTypeChange(id) {
        this.clearOperationSelectForm();
        this.operationSelectForm.controls['operationTypeId'].setValue(id);
        this.approvalService.getAllOperationsByOperationTypeId(id).subscribe((response: any) => {
            this.filteredOperations = response.result;
        });
        //this.filteredOperations = this.operations.filter(x => x.lookupTypeId == id);
        //(this.operations.length > 0) ? this.operations.filter(x => x.operationTypeId == id) : null;
    } //getAllOperationsByOperationTypeId

    onOperationChange(id) {
        this.selectedOperationId = id;
        this.getOperationGroups();
        this.disableLevelTab = true;
        this.disableStaffTab = true;
        //
    }

    onProductClassChange(id) {
        this.selectedProductId = null;
        this.selectedProductClassId = null;
        if (+id === 0) { 
            this.filteredProducts = []; 
        } else {
            this.selectedProductClassId = +id;
            this.filteredProducts = this.products.filter(x => x.productClassId == +id && x.productId != 1);
        }        
        this.getOperationGroups();
    }

    onProductChange(id) {
        this.selectedProductId = id;
        if (+id === 0) { 
            this.selectedProductId = null;
        }
        this.getOperationGroups();
    }

    // getOperationGroups() {
    //     let form = this.operationSelectForm;
    //     if (form.invalid) {
    //         this.displayTabs = false;
    //         return;
    //     }
    //     this.selectedOperationName = this.operations.find(x => x.lookupId == this.selectedOperationId).lookupName;
    //     if (this.selectedProductClassId != null) {
    //         const o = this.productClasses.find(x => x.lookupId == this.selectedProductClassId);
    //         this.selectedProductClassName = o == null ? 'n/a' : o.lookupName;
    //     }
    //     this.getOperationGroups();
    //     this.operationGroupSelection = null;
    //     this.approvalLevelSelection = null;
    // }

    // OPERATION GROUPS

    getOperationGroups() {
        this.selectedOperationName = this.operations.find(x => x.lookupId == this.selectedOperationId).lookupName;
        if (this.selectedProductClassId != null) {
            const o = this.productClasses.find(x => x.lookupId == this.selectedProductClassId);
            this.selectedProductClassName = o == null ? 'n/a' : o.lookupName;
        }
        this.loadingService.show();
        this.approvalService.getOperationGroups(
                    this.selectedOperationId, 
                    this.selectedProductClassId, 
                    this.selectedProductId).subscribe((response: any) => {
            if (response.success == true) {
                this.operationGroups = response.result;
                this.displayTabs = true;
                this.loadingService.hide();
                this.show = false; // ---------------------------------------------- close message
                ////console.log('OPS_GRPS: ', JSON.stringify(response.result));
            } else {
                this.displayTabs = false;
                this.loadingService.hide();
                ////console.log('FIN_BAD: ', response.message);
            }
        }, (err: any) => {
            this.displayTabs = false;
            this.loadingService.hide(1000);
            ////console.log(JSON.stringify(err));
        });
    }

    showOperationGroupForm() {
        this.clearOperationGroupForm();
        this.displayOperationGroupModal = true;
        this.filterPositions(this.operationGroups);
    }

    clearOperationGroupForm() {
        this.formState = "New";
        this.selectedId = null;
        this.operationGroupForm = this.fb.group({
            operationId: [this.selectedOperationId, Validators.required],
            productClassId: [this.selectedProductClassId],
            productId: [this.selectedProductId],
            groupId: ['', Validators.required],
            multipleinitiatorStatus: [''],
            position: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
        });
    }

    editOperationGroup(id) {
        this.formState = "Edit";
        this.clearOperationGroupForm();
        var row = this.operationGroups.find(x => x.groupOperationMappingId == id);
        ////console.log('DEBUGGER: ', JSON.stringify(row));
        this.selectedId = row.groupOperationMappingId;
        this.operationGroupForm = this.fb.group({
            operationId: [this.selectedOperationId, Validators.required],
            productClassId: [this.selectedProductClassId],
            productId: [this.selectedProductId],
            groupId: [row.groupId, Validators.required],
            multipleinitiatorStatus: [''],
            position: [row.position, Validators.required],//Validators.compose([ValidationService.isNumber, Validators.required])],
        });
        this.displayOperationGroupModal = true;
        this.filterPositions(this.operationGroups, false);
    }

    // submitOperationGroupForm(form) {
    //     this.loadingService.show();
    //     let body = {
    //         operationId: form.value.operationId,
    //         productClassId: form.value.productClassId,
    //         productId: form.value.productId,
    //         groupId: form.value.groupId,
    //         position: form.value.position,
    //     };
    //     ////console.log('DEBUGGER: ', JSON.stringify(body));
    //     if (this.selectedId === null) {
    //         this.approvalService.saveOperationGroup(body).subscribe((res) => {
    //             if (res.success == true) {
    //                 this.finishGood(res.message);
    //                 this.getOperationGroups();
    //                 this.filterPositions(this.operationGroups);
    //                 this.displayOperationGroupModal = false;
    //             } else {
    //                 this.finishBad(res.message);
    //             }
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });
    //     } else {
    //         this.approvalService.updateOperationGroup(body, this.selectedId).subscribe((res) => {
    //             if (res.success == true) {
    //                 this.finishGood(res.message);
    //                 this.getOperationGroups();
    //                 this.filterPositions(this.operationGroups);
    //                 this.displayOperationGroupModal = false;
    //             } else {
    //                 this.finishBad(res.message);
    //             }
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });
    //     }
    // }


    submitOperationGroupForm(form){
        
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: 'This action will go for approval. Are you sure you want to proceed?',
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
                operationId: form.value.operationId,
                productClassId: form.value.productClassId,
                productId: form.value.productId,
                groupId: form.value.groupId,
                position: form.value.position,
                allowMultipleInitiator : form.value.multipleinitiatorStatus
            };
            ////console.log('DEBUGGER: ', JSON.stringify(body));
            if (__this.selectedId === null) {
                __this.approvalService.saveOperationGroup(body).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getOperationGroups();
                        __this.filterPositions(__this.operationGroups);
                        __this.displayOperationGroupModal = false;
                        __this.loadingService.hide();
                        swal(GlobalConfig.APPLICATION_NAME, 'Operation was successful.', 'success');

                    } else {
                        __this.finishBad(res.message);
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });
            } else {
                __this.approvalService.updateOperationGroup(body, __this.selectedId).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getOperationGroups();
                        __this.filterPositions(__this.operationGroups);
                        __this.displayOperationGroupModal = false;
                        __this.loadingService.hide();
                        swal(GlobalConfig.APPLICATION_NAME, 'Operation was successful.', 'success');
                    } else {
                        __this.finishBad(res.message);
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });
            }
      
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
     
      }


    onSelectedOperationGroupChange(event: any) {
       // console.log(event);
        this.getApprovalLevels(event.data.groupId);
        
    }

    onSelectedApprovalLevelChange(){}

    getApprovalLevels(groupId: number) {
        this.loadingService.show();
        this.approvalService.getApprovalLevels(groupId).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.approvalLevels = response.result;
                this.approvalLevels = this.approvalLevels.filter(x => x.isActive == true);
            } else {
                this.finishBad2(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad2(JSON.stringify(err));
        });
    }

    deleteMapping(id) {
        const __this = this;
        swal({
            title: 'This action will go for approval. Are you sure you want to proceed?',
            text: 'You won\'t be able to revert this!',
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

            __this.approvalService.deleteOperationGroup(id).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Delete successful.', 'success');
                    __this.getOperationGroups();
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                }
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }
    // OPERATION GROUP end

    // tab changes

    onTabChange(e) {
        if (e.index == 0) {
            this.disableLevelTab = true;
            this.disableStaffTab = true;
        }
        if (e.index == 1) {
            this.disableStaffTab = true;
        }
        this.activeTabindex = e.index;
    }

    // USER LEVELS end

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    finishBad2(message) {
        this.showMessage(message, 'error', "FintrakBanking");
    }

    finishGood2(message) {
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }

    // --------------- REALTIME SEARCH ----------------------

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        ////console.log("SELECTED_DATA: ", data);
        this.levelStaffForm.controls['searchedName'].setValue(data.fullName);
        this.levelStaffForm.controls['staffId'].setValue(data.staffId);
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    setMultiInitiatorStatus(selection){
        if(selection){ console.log('selection', selection);
            this.operationGroupForm.controls['multipleinitiatorStatus'].setValue(true);
        }
        else{this.operationGroupForm.controls['multipleinitiatorStatus'].setValue(false); console.log('selection', selection);}
    }

    showNotificationsForm(data) {
        this.approvalLevelSelection = data;
        this.clearNotificationsForm(false);
        this.approvalLevelSelection.groupOperationMappingId = this.operationGroupSelection.groupOperationMappingId;
        this.loadingService.show();
        this.approvalService.getWorkflowMappingNotification(this.operationGroupSelection.groupOperationMappingId).subscribe((res) => {
            this.loadingService.hide();
            let groupNotifications: any[] = res.result;
            let levelNotification = groupNotifications.find(x => x.approvalLevelId == data.approvalLevelId);
            if (!isNullOrUndefined(levelNotification)) {
                this.notificationsForm = this.fb.group({
                    workflowNotificationId: levelNotification.workflowNotificationId,
                    groupOperationMappingId: this.operationGroupSelection.groupOperationMappingId,
                    approvalLevelId: levelNotification.approvalLevelId,
                    notifyOfProceedingWorkflowActions: levelNotification.notifyOfProceedingWorkflowActions,
                    proceedingActionsAlertTitleId: levelNotification.proceedingActionsAlertTitleId,
                    includePoolInNotification: levelNotification.includePoolInNotification,
                    poolAlertTitleId: levelNotification.poolAlertTitleId,
                    notifyOnwer: levelNotification.notifyOnwer,
                    ownerAlertTitleId: levelNotification.ownerAlertTitleId,
                    notifyOfPendingApprovals: levelNotification.notifyOfPendingApprovals,
                    pendingApprovalAlertTitleId: levelNotification.pendingApprovalAlertTitleId
                });
            }
            this.displayNotificationsModal = true;
        }, (err) => {
            this.displayNotificationsModal = true;
            this.loadingService.hide(1000);
        });
    }

    submitNotificationsForm(form) {
        let body = {
            groupOperationMappingId: form.value.groupOperationMappingId,
            approvalLevelId: form.value.approvalLevelId,
            notifyOfProceedingWorkflowActions: form.value.notifyOfProceedingWorkflowActions,
            proceedingActionsAlertTitleId: form.value.proceedingActionsAlertTitleId,
            includePoolInNotification: form.value.includePoolInNotification,
            poolAlertTitleId: form.value.poolAlertTitleId,
            notifyOnwer: form.value.notifyOnwer,
            ownerAlertTitleId: form.value.ownerAlertTitleId,
            notifyOfPendingApprovals: form.value.notifyOfPendingApprovals,
            pendingApprovalAlertTitleId: form.value.pendingApprovalAlertTitleId
        };
        ////console.log('save levels ==> ', JSON.stringify(body));        
        if (form.value.workflowNotificationId > 0) {
            this.loadingService.show();
            this.approvalService.updateWorkflowLevelNotification(body, form.value.workflowNotificationId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {
                    this.finishGood2(res.message);
                    this.displayNotificationsModal = false;
                } else {
                    this.finishBad2(res.message);
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad2(JSON.stringify(err));
            });
        } else {
            this.loadingService.show();
            this.approvalService.saveWorkflowLevelNotification(body).subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {
                    this.finishGood2(res.message);
                    this.displayNotificationsModal = false;
                } else {
                    this.finishBad2(res.message);
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad2(JSON.stringify(err));
            });
        }
    }

    toggleNotifyOfProceedingWorkflowActions(event) {
        let value = event.target.checked;
        let control = this.notificationsForm.get('proceedingActionsAlertTitleId');
        if (value == true) {
            control.setValidators(Validators.required);
        } else {
            control.setValue(null);
            control.setValidators(null);
        }
        control.updateValueAndValidity();
    }

    isNotifyOfProceedingWorkflowActionsToggled(): boolean {
        let value = this.notificationsForm.get('notifyOfProceedingWorkflowActions').value;
        return (value == true);
    }

    toggleIncludePoolInNotification(event) {
        let value = event.target.checked;
        let control = this.notificationsForm.get('poolAlertTitleId');
        if (value == true) {
            control.setValidators(Validators.required);
        } else {
            control.setValue(null);
            control.setValidators(null);
        }
        control.updateValueAndValidity();
    }

    isIncludePoolInNotificationToggled(): boolean {
        let value = this.notificationsForm.get('includePoolInNotification').value;
        return (value == true);
    }

    toggleNotifyOfPendingApprovals(event) {
        let value = event.target.checked;
        let control = this.notificationsForm.get('pendingApprovalAlertTitleId');
        if (value == true) {
            control.setValidators(Validators.required);
        } else {
            control.setValue(null);
            control.setValidators(null);
        }
        control.updateValueAndValidity();
    }

    isNotifyOfPendingApprovalsToggled(): boolean {
        let value = this.notificationsForm.get('notifyOfPendingApprovals').value;
        return (value == true);
    }

    // toggleNotifyOnwer(event) {
    //might be included if necessary
    //     let value = event.target.checked;
    //     let control = this.notificationsForm.get('ownerAlertTitleId');
    //     if (value == true) {
    //         control.setValidators(Validators.required);
    //     } else {
    //         control.setValue(null);
    //         control.setValidators(null);
    //     }
    //     control.updateValueAndValidity();
    // }

    // isNotifyOnwerToggled(): boolean {
    //     let value = this.notificationsForm.get('notifyOnwer').value;
    //     return (value == true);
    // }

    getAllAlerts(): void {
        this.loadingService.show();
        this.documentService.getAllAlertTemplate().subscribe((response: any) => {
            this.alerts = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
}

// disable tabs
// test & commit other API