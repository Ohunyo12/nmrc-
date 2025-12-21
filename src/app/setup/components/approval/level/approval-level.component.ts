import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalService } from '../../../services';
import { ProductService } from '../../../services';
import { GlobalConfig } from '../../../../shared/constant/app.constant';
import { StaffRoleService } from '../../../services/staff-role.service';

import { StaffRealTimeSearchService } from '../../../services';
import { CheckboxModule, EditorModule } from 'primeng/primeng';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'approval-level.component.html'
})

export class ApprovalLevelComponent implements OnInit {

    show: boolean = false; message: any; title: any; cssClass: any;
    groups: any[];
    selectedGroupName: string = '';
    selectedLevelName: string = '';
    formState: string = null;
    selectedId = null;
    disableLevelTab: boolean = true;
    disableStaffTab: boolean = true;
    activeTabindex: number = 0;
    approvalGroupSelection: any;

    approvalLevels: any[];
    displayApprovalLevelModal = false;
    approvalLevelForm: FormGroup;
    approvalLevelSelection: any;

    levelStaff: any[];
    displayLevelStaffModal = false;
    levelStaffForm: FormGroup;

    searchResults: Object;
    searchTerm$ = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;

    selectedLevelApprovals: number = 1;

    positions: any[];
    products: any[];
    filteredProducts: any[];
    globalID: any;

    levelTypes = [ // level behaviour
        { 'id': '2', 'name': 'Pool Routing', },
        { 'id': '3', 'name': 'Operation Switch', },
        { 'id': '4', 'name': 'Credit Committee', },
        { 'id': '5', 'name': 'Validation Checks', },
        // { 'id': '5', 'name': 'Skip Level by Amount Limit', },
    ];

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

    roles: any[] = [];
    businessRules: any[] = [];

    constructor(
        private fb: FormBuilder,
        private roleService: StaffRoleService,
        private productService: ProductService,
        private loadingService: LoadingService,
        private approvalService: ApprovalService,
        private validationService: ValidationService,
        private realSearchSrv: StaffRealTimeSearchService,

    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.loadDropdowns();
        this.getApprovalGroups();
        this.clearApprovalLevelForm();
        this.clearLevelStaffForm();
        this.getAllRoles();
    }

    loadDropdowns() {
        this.approvalService.getApprovalGroups().subscribe((response) => {
            this.groups = response.result;
        });
        this.roleService.getStaffRoles().subscribe((response) => {
            this.roles = response.result;
        });
        this.approvalService.getBusinessRules().subscribe((response) => {
            this.businessRules = response.result;
        });
    }

    getApprovalGroups() {
        this.loadingService.show();
        this.approvalService.getApprovalGroups().subscribe((response) => {
            this.groups = response.result;
            this.loadingService.hide(1000);
            ////console.log('groups..', JSON.stringify(this.groups));
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('Server error', JSON.stringify(err));
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

    staffPositions: any[] = [];

    filterStaffPositions(list: any[], filter: boolean = true) {
        this.staffPositions = this.allPositions;
        if (filter) {
            list.forEach(element => {
                this.staffPositions = this.staffPositions.filter(x => x.id != element.position)
            });
        }
    }

    onSelectedGroupChange() {
        this.getApprovalLevels();
        this.approvalLevelSelection = null;
        this.levelStaff = [];
        this.disableLevelTab = false;
        this.disableStaffTab = true;
        this.getSelectedGroupName();
    }

    getSelectedGroupName() {
        this.selectedGroupName = this.groups.find(x => x.groupId == this.approvalGroupSelection.groupId).groupName;
    }

    getSelectedLevelName() {
        const level = this.approvalLevels.find(x => x.approvalLevelId == this.approvalLevelSelection.approvalLevelId);
        this.selectedLevelName = level.levelName;
        this.selectedLevelApprovals = level.numberOfApprovals;
    }

    // OPERATION GROUP end

    // APPROVAL LEVELS

    getApprovalLevels(groupId = null) {
        if (groupId == null) {
            groupId = this.approvalGroupSelection.groupId;
        }
        this.approvalService.getApprovalLevels(groupId).subscribe((response) => {
            if (response.success == true) {
                this.approvalLevels = response.result;
                ////console.log('get levels <== : ', JSON.stringify(response.result));
                this.loadingService.hide();
            } else {
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    showApprovalLevelForm() {
        if (this.approvalGroupSelection == null) {
            swal('', 'Please select an Operation Group!', 'error');
            return;
        }
        this.selectedId = null;
        this.clearApprovalLevelForm();
        this.displayApprovalLevelModal = true;
        this.formState = 'New';
        this.filterPositions(this.approvalLevels);
    }

    clearApprovalLevelForm() {
        this.approvalLevelForm = this.fb.group({
            groupId: [''],
            // operationId: [this.selectedOperationId],
            levelName: ['', Validators.required],
            position: ['', Validators.required],
            maximumAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            investmentGradeAmount: [''],
            standardGradeAmount: ['', Validators.compose([ValidationService.isNumber])],
            renewalLimit: ['', Validators.compose([ValidationService.isNumber])],
            numberOfUsers: ['', Validators.compose([ValidationService.isNumber, Validators.maxLength(2), Validators.required])],
            numberOfApprovals: ['', Validators.compose([ValidationService.isNumber, Validators.maxLength(2), Validators.required])],
            slaInterval: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            tenor: ['', ValidationService.isNumber],
            tenorModeId: [''],
            slaNotificationInterval: ['', ValidationService.isNumber],
            roleId: [''],
            levelTypeId: [''],
            levelBusinessRuleId: [''],
            isPoliticallyExposed: [false],
            canEscalate: [false],
            canApproveUntenored: [false],
            canResolveDispute: [false],
            isActive: [false],

            canViewDocument: [false],
            canEdit: [false],
            canViewUploadedFile: [false],
            canUploadFile: [false],
            canViewApproval: [false],
            canApprove: [false],
            isPostApprovalReviewer: [false],
            ignoreIfApprovalLevelStaff: [false],
            // canDoRiskAssessment: [false],
            // canRecieveAdjustment: [false],
            canRecieveEmail: [false],
            canRecieveSms: [false],
            // hasChecklist: [false],
            // canPerformFinancialAnalysis: [false],
            // requireAuthorisation: [false],
            // canOverideAuthorisation: [false],
            routeViaStaffOrganogram: [false],
            routeInitiatorRoleId: [''],
        });
    }



    editApprovalLevel(id) {
        this.formState = "Edit";
        this.clearApprovalLevelForm();
        const row = this.approvalLevels.find(x => x.approvalLevelId == id);
        this.approvalLevelSelection = row;
        this.selectedId = row.approvalLevelId;
        this.approvalLevelForm = this.fb.group({
            groupId: [row.groupId, Validators.required],
            levelName: [row.levelName, Validators.required],
            position: [row.position, Validators.required],
            investmentGradeAmount: [row.investmentGradeAmount, Validators.compose([ValidationService.isNumber])],
            standardGradeAmount: [row.standardGradeAmount, Validators.compose([ValidationService.isNumber])],
            renewalLimit: [row.renewalLimit, Validators.compose([ValidationService.isNumber])],
            maximumAmount: [row.maximumAmount, Validators.compose([ValidationService.isNumber, Validators.required])],
            numberOfUsers: [row.numberOfUsers, Validators.compose([ValidationService.isNumber, Validators.maxLength(2), Validators.required])],
            numberOfApprovals: [row.numberOfApprovals, Validators.compose([ValidationService.isNumber, Validators.maxLength(2), Validators.required])],
            slaInterval: [row.slaInterval, Validators.compose([ValidationService.isNumber, Validators.required])],
            slaNotificationInterval: [row.slaNotificationInterval, Validators.compose([ValidationService.isNumber, Validators.required])],
            tenor: [row.tenor, ValidationService.isNumber],
            tenorModeId: [row.tenorModeId],
            roleId: [row.roleId],
            levelTypeId: [row.levelTypeId],
            levelBusinessRuleId: [row.levelBusinessRuleId],
            isPoliticallyExposed: [row.isPoliticallyExposed],
            canEscalate: [row.canEscalate],
            canApproveUntenored: [row.canApproveUntenored],
            canResolveDispute: [row.canResolveDispute],
            isActive: [row.isActive],

            canEdit: [row.canEdit],
            canViewDocument: [row.canViewDocument],
            canViewUploadedFile: [row.canViewUploadedFile],
            canUploadFile: [row.canUploadFile],
            canViewApproval: [row.canViewApproval],
            canApprove: [row.canApprove],
            isPostApprovalReviewer: [row.isPostApprovalReviewer],
            ignoreIfApprovalLevelStaff: [row.ignoreIfApprovalLevelStaff],
            // canDoRiskAssessment: [row.canDoRiskAssessment],
            // canRecieveAdjustment: [row.canRecieveAdjustment],
            canRecieveEmail: [row.canRecieveEmail],
            canRecieveSms: [row.canRecieveSms],
            // hasChecklist: [row.hasChecklist],
            // canPerformFinancialAnalysis: [row.canPerformFinancialAnalysis],
            // requireAuthorisation: [row.requireAuthorisation],
            // canOverideAuthorisation: [row.canOverideAuthorisation],
            routeViaStaffOrganogram: [row.routeViaStaffOrganogram],
            routeInitiatorRoleId: [row.roleIdToRoute]
        });
        this.displayApprovalLevelModal = true;
        this.filterPositions(this.approvalLevels, false);
    }
    submitApprovalLevelForm(form) {
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
                groupId: __this.approvalGroupSelection.groupId,
                // operationId: this.selectedOperationId,
                levelName: form.value.levelName,
                position: form.value.position,
                maximumAmount: form.value.maximumAmount,
                investmentGradeAmount: form.value.investmentGradeAmount,
                standardGradeAmount: form.value.standardGradeAmount,
                renewalLimit: form.value.renewalLimit,
                numberOfUsers: form.value.numberOfUsers,
                numberOfApprovals: form.value.numberOfApprovals,
                slaInterval: form.value.slaInterval,
                slaNotificationInterval: form.value.slaNotificationInterval,
                tenor: form.value.tenor,
                levelTypeId: form.value.levelTypeId,
                levelBusinessRuleId: form.value.levelBusinessRuleId,
                roleId: form.value.roleId,
                isPoliticallyExposed: form.value.isPoliticallyExposed,
                canEscalate: form.value.canEscalate,
                canApproveUntenored: form.value.canApproveUntenored,
                canResolveDispute: form.value.canResolveDispute,
                isActive: form.value.isActive,

                canViewDocument: form.value.canViewDocument,
                canEdit: form.value.canEdit,
                canViewUploadedFile: form.value.canViewUploadedFile,
                canUploadFile: form.value.canUploadFile,
                canViewApproval: form.value.canViewApproval,
                canApprove: form.value.canApprove,
                isPostApprovalReviewer: form.value.isPostApprovalReviewer,
                ignoreIfApprovalLevelStaff: form.value.ignoreIfApprovalLevelStaff,

                // canDoRiskAssessment: form.value.canDoRiskAssessment,
                // canRecieveAdjustment: form.value.canRecieveAdjustment,
                canRecieveEmail: form.value.canRecieveEmail,
                canRecieveSms: form.value.canRecieveSms,
                // hasChecklist: form.value.hasChecklist,
                // canPerformFinancialAnalysis: form.value.canPerformFinancialAnalysis,
                // requireAuthorisation: form.value.requireAuthorisation,
                // canOverideAuthorisation: form.value.canOverideAuthorisation,
                routeViaStaffOrganogram: form.value.routeViaStaffOrganogram,
                roleIdToRoute: form.value.routeInitiatorRoleId,

            };
            // console.table('save levels ==> ', body);        
            ////console.log('save levels ==> ', JSON.stringify(body));        
            if (__this.selectedId === null) {
                __this.approvalService.saveApprovalLevel(body).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getApprovalLevels();
                        __this.filterPositions(__this.approvalLevels);
                        __this.displayApprovalLevelModal = false;
                        __this.loadingService.hide();
                        __this.show = false;
                    } else {
                        __this.finishBad(res.message);
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });
            } else {
                __this.approvalService.updateApprovalLevel(body, __this.selectedId).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getApprovalLevels();
                        __this.filterPositions(__this.approvalLevels);
                        __this.displayApprovalLevelModal = false;
                        __this.clearApprovalLevelForm();
                        __this.loadDropdowns();
                        __this.getApprovalGroups();
                        __this.clearLevelStaffForm();
                        __this.getAllRoles();
                        __this.loadingService.hide();
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
    // submitApprovalLevelForm(form) {
    //     this.loadingService.show();
    //     let body = {
    //         groupId: this.approvalGroupSelection.groupId,
    //         // operationId: this.selectedOperationId,
    //         levelName: form.value.levelName,
    //         position: form.value.position,
    //         maximumAmount: form.value.maximumAmount,
    //         investmentGradeAmount: form.value.investmentGradeAmount,
    //         numberOfUsers: form.value.numberOfUsers,
    //         numberOfApprovals: form.value.numberOfApprovals,
    //         slaInterval: form.value.slaInterval,
    //         slaNotificationInterval: form.value.slaNotificationInterval,
    //         tenor: form.value.tenor,
    //         // tenorModeId: form.value.tenorModeId,
    //         roleId: form.value.roleId,
    //         isPoliticallyExposed: form.value.isPoliticallyExposed,
    //         canEscalate: form.value.canEscalate,
    //         canApproveUntenored: form.value.canApproveUntenored,
    //         canResolveDispute: form.value.canResolveDispute,
    //         isActive: form.value.isActive,

    //         canViewDocument: form.value.canViewDocument,
    //         canEdit: form.value.canEdit,
    //         canViewUploadedFile: form.value.canViewUploadedFile,
    //         canUploadFile: form.value.canUploadFile,
    //         canViewApproval: form.value.canViewApproval,
    //         canApprove: form.value.canApprove,

    //         // canDoRiskAssessment: form.value.canDoRiskAssessment,
    //         // canRecieveAdjustment: form.value.canRecieveAdjustment,
    //         canRecieveEmail: form.value.canRecieveEmail,
    //         canRecieveSms: form.value.canRecieveSms,
    //         // hasChecklist: form.value.hasChecklist,
    //         // canPerformFinancialAnalysis: form.value.canPerformFinancialAnalysis,
    //         // requireAuthorisation: form.value.requireAuthorisation,
    //         // canOverideAuthorisation: form.value.canOverideAuthorisation,
    //         routeViaStaffOrganogram: form.value.routeViaStaffOrganogram,
    //     };
    //     // console.table('save levels ==> ', body);        
    //     ////console.log('save levels ==> ', JSON.stringify(body));        
    //     if (this.selectedId === null) {
    //         this.approvalService.saveApprovalLevel(body).subscribe((res) => {
    //             if (res.success == true) {
    //                 this.finishGood(res.message);
    //                 this.getApprovalLevels();
    //                 this.filterPositions(this.approvalLevels);
    //                 this.displayApprovalLevelModal = false;
    //                 this.show = false;
    //             } else {
    //                 this.finishBad(res.message);
    //             }
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });
    //     } else {
    //         this.approvalService.updateApprovalLevel(body, this.selectedId).subscribe((res) => {
    //             if (res.success == true) {
    //                 this.finishGood(res.message);
    //                 this.getApprovalLevels();
    //                 this.filterPositions(this.approvalLevels);
    //                 this.displayApprovalLevelModal = false;
    //             } else {
    //                 this.finishBad(res.message);
    //             }
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });
    //     }
    // }

    onSelectedApprovalLevelChange() {
        this.getLevelStaff();
        this.disableStaffTab = false;
        this.getSelectedLevelName();
    }

    // APPROVAL LEVELS end

    // LEVEL STAFF

    getLevelStaff(id = null) {
        ////console.log('CALL!', this.approvalLevelSelection.approvalLevelId);
        id = (id == null) ? this.approvalLevelSelection.approvalLevelId : id;

        this.approvalService.getLevelStaff(id).subscribe((response) => {
            if (response.success == true) {
                this.levelStaff = response.result;
                this.loadingService.hide();
            } else {
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    allRoles: any;
    getAllRoles() {
        this.roleService.get().subscribe((response) => {
            if (response.success == true) {
                this.allRoles = response.result;
                this.loadingService.hide();
            } else {
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    showLevelStaffForm() {
        if (this.approvalLevelSelection == null) {
            swal('', 'Please select an Approval Level!', 'error');
            return;
        }
        this.selectedId === null
        this.clearLevelStaffForm();
        this.displayLevelStaffModal = true;
        this.formState = "New";
        this.filterStaffPositions(this.levelStaff);
    }

    clearLevelStaffForm() {
        this.selectedId = null;
        this.levelStaffForm = this.fb.group({
            approvalLevelId: [''],
            searchedName: ['', Validators.required],
            staffId: ['', Validators.required],
            position: [1],
            maximumAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            investmentGradeAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            standardGradeAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            renewalLimit: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            baseMinimumAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            processViewScope: [1, Validators.required], // @level
            canViewDocument: [false],
            canViewUploadedFile: [false],
            canViewApproval: [false],
            canApprove: [false],
            canUploadFile: [false],
            canSendRequest: [false],
            canEdit: [false],
            vetoPower: [false],
        });
    }

    editLevelStaff(id) {
        this.formState = "Edit";
        this.clearLevelStaffForm();
        var row = this.levelStaff.find(x => x.staffLevelId == id);
        this.selectedId = row.staffLevelId;
        this.levelStaffForm = this.fb.group({
            approvalLevelId: [row.approvalLevelId, Validators.required],
            searchedName: [row.staffLevelName, Validators.required],
            staffId: [row.staffId, Validators.required],
            position: [row.position],
            maximumAmount: [row.maximumAmount, Validators.compose([ValidationService.isNumber, Validators.required])],
            investmentGradeAmount: [row.investmentGradeAmount, Validators.compose([ValidationService.isNumber])],
            standardGradeAmount: [row.standardGradeAmount, Validators.compose([ValidationService.isNumber])],
            renewalLimit: [row.renewalLimit, Validators.compose([ValidationService.isNumber])],
            baseMinimumAmount: [row.baseMinimumAmount, Validators.compose([ValidationService.isNumber])],
            processViewScope: [row.processViewScope, Validators.required],
            canViewDocument: [row.canViewDocument, Validators.required],
            canViewUploadedFile: [row.canViewUploadedFile, Validators.required],
            canViewApproval: [row.canViewApproval, Validators.required],
            canApprove: [row.canApprove, Validators.required],
            canUploadFile: [row.canUploadFile, Validators.required],
            canSendRequest: [row.canSendRequest, Validators.required],
            canEdit: [row.canEdit, Validators.required],
            vetoPower: [row.vetoPower, Validators.required],
        });
        this.displayLevelStaffModal = true;
        this.filterStaffPositions(this.levelStaff, false);
        ////console.log(JSON.stringify(row));
    }

    submitLevelStaffForm(form) {
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
                approvalLevelId: __this.approvalLevelSelection.approvalLevelId,
                staffId: form.value.staffId,
                maximumAmount: form.value.maximumAmount,
                investmentGradeAmount: form.value.investmentGradeAmount,
                standardGradeAmount: form.value.standardGradeAmount,
                renewalLimit: form.value.renewalLimit,
                baseMinimumAmount: form.value.baseMinimumAmount,
                processViewScope: form.value.processViewScope,
                canViewDocument: form.value.canViewDocument,
                canViewUploadedFile: form.value.canViewUploadedFile,
                canViewApproval: form.value.canViewApproval,
                canApprove: form.value.canApprove,
                canUploadFile: form.value.canUploadFile,
                canSendRequest: form.value.canSendRequest,
                canEdit: form.value.canEdit,
                vetoPower: form.value.vetoPower,
                position: form.value.position || 1,
            };
            if (__this.selectedId === null) {
                __this.approvalService.saveLevelStaff(body).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getLevelStaff();
                        __this.displayLevelStaffModal = false;
                        __this.show = false;
                        __this.filterStaffPositions(__this.levelStaff);
                        __this.loadingService.hide();
                    } else {
                        __this.finishBad(res.message);
                        __this.loadingService.hide();
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });
            } else {
                ////console.log('UPD', this.selectedId);
                __this.approvalService.updateLevelStaff(body, __this.selectedId).subscribe((res) => {
                    if (res.success == true) {
                        __this.finishGood(res.message);
                        __this.getLevelStaff();
                        __this.filterStaffPositions(__this.levelStaff);
                        __this.loadingService.hide();
                    } else {
                        __this.finishBad(res.message);
                        __this.loadingService.hide();
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

    // tab changes

    activateLevelTab(id) {
        const item = this.groups.find(x => x.groupId == id);
        this.approvalLevels = [];
        this.approvalGroupSelection = item;
        this.getApprovalLevels(item.groupId);
        this.disableLevelTab = false;
        this.activeTabindex = 1;
        this.getSelectedGroupName();
    }

    activateStaffTab(id) {
        const item = this.approvalLevels.find(x => x.approvalLevelId == id);
        this.levelStaff = [];
        this.approvalLevelSelection = item;
        this.getLevelStaff(item.approvalLevelId);
        this.disableStaffTab = false;
        this.activeTabindex = 2;
        this.getSelectedLevelName();
    }

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


    // DELETE


    deleteLevel(id) {
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

            __this.approvalService.deleteApprovalLevel(id).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Delete successful.', 'success');
                    __this.getApprovalLevels();
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

    deleteStaff(id) {
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

            __this.approvalService.removeStaff(id).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Delete successful.', 'success');
                    __this.getLevelStaff();
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


    // MESSAGE

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
        this.displayLevelStaffModal = false;
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
}

// disable tabs
// test & commit other API