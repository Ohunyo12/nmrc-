import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { Subject } from 'rxjs';
import { ApprovalStatus } from 'app/shared/constant/app.constant';
import { WorkflowTarget } from 'app/shared/models/workflow-target';

@Component({
    templateUrl: 'workflow-routing.component.html',
    selector: 'app-workflow-routing',
    providers: [CreditAppraisalService, StaffRealTimeSearchService],
})
export class WorkflowRoutingComponent implements OnInit {

    @Input() currentSelection: WorkflowTarget = new WorkflowTarget();
    
    @Input() operationIds: number[] = [];
    @Input() moduleId: number = 1;
    @Input() panelLabel: string = 'Workflow Re-route';
    @Input() referenceNumber: string = '';
    @Input() enableReroute: boolean = false;
    @Input() enableRoute: boolean = false;
    @Input() enableRoutePreset: boolean = false;
    @Input() enableRouteOperation: boolean = false;

    @Output() rerouted: EventEmitter<boolean> = new EventEmitter<boolean>();

    selectedId: number = null;
    feedback: string = null;
    commentLabel: string = 'Recommendation';
    errorMessage: string = '';
    searchString: string = '';
    searching: boolean = false;
    // applications: any[];
    products: any[] = [];
    departments: any[] = [];
    conditions: any[] = [];
    routeableOperations: any[] = [];
    approvalLevels: any[] = [];
    // itemTotal: number = 0; // lazyloading
    // showLoadIcon: boolean = false; // lazyloading
    // applicationSelection: any; // selection
    lineSelection: any;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    displaySearchModal: boolean = false;
    selectedSearchedId: number = null;

    allStaff: any[] = [];

    displayPresetForm: boolean = false;
    presetCollection: any = {
        approvalLevels: [],
        applicationStatus: [],
    };

    // append document

    presetForm: FormGroup;
    appendForm: FormGroup;
    rerouteForm: FormGroup;
    operationForm: FormGroup;

    documentTemplates: any[] = [];
    displayAppendModal: boolean = false;
    displayCommentForm: boolean = false;
    displayRouteCommentForm: boolean = false;
    displayOperationRouteCommentForm: boolean = false;

    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private realSearchSrv: StaffRealTimeSearchService,
        private fb: FormBuilder,
    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.clearControls();
    }

    clearControls() {
        this.rerouteForm = this.fb.group({
            staffId: ['', Validators.required],
            comment: [''],
        });
        this.presetForm = this.fb.group({
            finalApprovalLevelId: [''],
            nextApplicationStatusId: [''],
        });
        this.operationForm = this.fb.group({
            operationId: [''],
            approvalLevelId: [''],
            comment: [''],
        });
    }

    // SHOW MODALS

    showRerouteForm() {
        this.errorMessage = '';
        this.displayCommentForm = true;
        if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    showRouteForm() {
        this.errorMessage = '';
        this.displayRouteCommentForm = true;
        if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    showPresetRouteForm() {
        this.errorMessage = '';
        this.displayPresetForm = true;
        this.getPresetCollection();
        if (this.presetForm.dirty == false) {
            const level = this.presetForm.controls['finalApprovalLevelId'];
            const next = this.presetForm.controls['nextApplicationStatusId']
            level.setValue(this.currentSelection.finalApprovalLevelId); // REMOVE HARDCODE 5
            next.setValue(this.currentSelection.nextApplicationStatusId);
            level.updateValueAndValidity();
            next.updateValueAndValidity();
        }
    }

    showOperationRouteForm() {
        this.errorMessage = '';
        this.displayOperationRouteCommentForm = true;
        this.getRoutableOperations();
    }

    getRoutableOperations() {
        if (this.operationIds.length == 0) return;
        this.loadingService.show();
        this.camService.getRoutableOperations(this.operationIds).subscribe((response: any) => {
            this.routeableOperations = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide(1000);
        });
    }

    getPresetCollection() {
        if (this.currentSelection == null) return;
        this.loadingService.show();
        this.camService.getPresetCollection(this.currentSelection.operationId, this.currentSelection.productClassId).subscribe((response: any) => {
            this.presetCollection = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide(1000);
        });
    }

    selectedLineId: number; // MAY BE REDUNDANT!!

    cancelForm() {
        this.displayCommentForm = false;
        this.displayRouteCommentForm = false;
        this.displayOperationRouteCommentForm = false;
        this.errorMessage = '';
        this.lineSelection = null;
        // this.receiverLevelId = null;
        // this.receiverStaffId = null;
        this.selectedLineId = null; // MAY BE REDUNDANT!!
    }

// forms

    reroute(form) {
        if (this.currentSelection == null) return;
        let body = {
            forwardAction: ApprovalStatus.REROUTE,
            applicationId: this.currentSelection.targetId,
            operationId: this.currentSelection.operationId,
            productClassId: this.currentSelection.productClassId,
            productId: this.currentSelection.productId,
            receiverLevelId: null,//this.receiverLevelId, // refer back
            receiverStaffId: form.value.staffId, // refer back
            comment: form.value.comment,
            vote: 2, // yes
            // recommendedChanges: this.recommendedItems, // line item changes
        };

        this.loadingService.show();
        this.camService.reroute(body).subscribe((res) => { //
            if (res.success == true) {
                this.reset(); // emit 
                this.displayCommentForm = false;
                this.clearControls();
                this.loadingService.hide();
            } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    route(form) {
        if (this.currentSelection == null) return;
        let body = {
            applicationId: this.currentSelection.targetId,
            operationId: this.currentSelection.operationId,
            receiverStaffId: form.value.staffId, 
            amount : this.currentSelection.amount,
            comment: form.value.comment,
        };
        this.loadingService.show();
        this.camService.route(body).subscribe((res) => { 
            if (res.success == true) {
                this.reset(); 
                this.displayRouteCommentForm = false;
                this.clearControls();
                this.loadingService.hide();
            } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    presetRoute(form) {
        if (form.value.finalApprovalLevelId.length == 0
            && form.value.nextApplicationStatusId.length == 0
        ) {
            this.errorMessage = 'All fields cannot be empty!';
        }
        let body = {
            moduleId: this.moduleId,
            applicationId: this.currentSelection.targetId,
            finalApprovalLevelId: form.value.finalApprovalLevelId,
            nextApplicationStatusId: form.value.nextApplicationStatusId,
        };
        this.loadingService.show();
        this.camService.savePresetRoute(body).subscribe((res) => { //
            if (res.success == true) {
                this.reset(); 
                this.displayPresetForm = false;
                this.loadingService.hide();
            } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide(1000);
      });
    }

    rerouteOperation(form) {
        let body = {
            forwardAction: ApprovalStatus.REROUTE,
            targetId: this.currentSelection.targetId,
            operationId: this.currentSelection.operationId,
            nextOperationId: form.value.operationId,
            nextApprovalLevelId: form.value.approvalLevelId,
            
        };
        this.loadingService.show();
        this.camService.rerouteOperation(body).subscribe((res) => {
            if (res.success == true) {
                this.reset(); 
                this.displayOperationRouteCommentForm = false;
                this.loadingService.hide();
            } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
            this.loadingService.hide(1000);
        });
    }

    reset() {
        this.rerouted.emit(true);
        // cleanup ...
    }

    onOperationChange(operationId) {
        this.loadingService.show();
        this.camService.getOperationApprovalLevels(operationId).subscribe((response: any) => {
            this.approvalLevels = response.result;
            this.loadingService.hide(1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // ------------------real-time search------------------

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.allStaff.push({ staffId: data.staffId, staffName: data.fullName });
        let control = this.rerouteForm.get('staffId');
        control.setValue(data.staffId);
        control.updateValueAndValidity();
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }


    // message

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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

    // ----------------- test --------------------

    test() {
        // this.enableRoutePreset = true;
        //this.enableReroute = true;
    }
}
/*
usage
-----
import { WorkflowTarget } from 'app/shared/models/workflow-target';
...

    workflowTarget: WorkflowTarget = new WorkflowTarget();

    updateWorkflowTarget() {
        this.workflowTarget.targetId = this.applicationSelection.loanApplicationId;
        this.workflowTarget.operationId = this.OPERATION_ID;
        this.workflowTarget.productClassId = this.applicationSelection.productClassId;
        this.workflowTarget.productId = this.applicationSelection.productId;
        this.workflowTarget.toStaffId = this.applicationSelection.toStaffId; // optional
        this.workflowTarget.responsiblePerson = this.applicationSelection.responsiblePerson; // required if toStaffId is given
        this.workflowTarget.currentApprovalLevel = this.applicationSelection.currentApprovalLevel; // required if toStaffId is given
        this.workflowTarget.finalApprovalLevelId = this.applicationSelection.finalApprovalLevelId;
        this.workflowTarget.nextApplicationStatusId = 5; // offer letter
    }

<app-workflow-routing
    [currentSelection]="workflowTarget"
    [enableRoutePreset]="true"
    [enableReroute]="true"
    [panelLabel]="Label Test"
    [referenceNumber]=""
    (rerouted)="reset($event)"
></app-workflow-routing>

*/