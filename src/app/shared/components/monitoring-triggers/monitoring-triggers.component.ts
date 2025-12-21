import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { monitoringTriggersModel } from '../../../credit/models/loan-booking';

@Component({
    templateUrl: 'monitoring-triggers.component.html',
    selector: 'app-monitoring-triggers',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class MonitoringTriggerComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;

    @Input() applicationId: number = 0;
    
    @Input() set reload(value: number) { 
        if (value > 0) {
            this.getMonitoringTriggers(); // for analyst only!!
            this.getApplicationMonitoringTriggers();
        } 
    }
    
    // @Output() approvalStatusId: EventEmitter<any> = new EventEmitter<any>();
    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;

    complianceTimelines: any[] = [];

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() { this.resetMonitoringTriggerForm(); }

    // ---------------------- monitoring triggers -----------------

    customTriggers: any[] = [];
    selectedTriggers: any[] = [];
    displayMonitoringTriggerDialog: boolean = false;
    unsavedTriggers: boolean = false;
    monitoringTriggerForm: FormGroup;
    monitoringTriggerCollection: monitoringTriggersModel[] = [];

    getMonitoringTriggers(): void {
       // if (this.isAnalyst == false) return;
        this.camService.getMonitoringTriggers().subscribe((response: any) => {
            this.customTriggers = response.result;
        });
    }

    onSelectedTrigger(o) {
        this.addMonitoringTrigger(o.monitoringTriggerSetupName, o.monitoringTriggerId);
    }

    removeTrigger(o) {
        this.monitoringTriggerCollection.splice(this.getMonitoringTriggerCollectionIndex(o), 1);
        this.refreshDataTable();
        this.unsavedTriggers = true;
    }

    getMonitoringTriggerCollectionIndex(o) {
        return this.monitoringTriggerCollection.findIndex(x =>
            x.monitoringTriggerId == o.monitoringTriggerId && x.applicationDetailId == o.applicationDetailId
        );
    }

    addMonitoringTrigger(monitoringTriggerSetupName: null, monitoringTriggerId: null) {
        const trigger = monitoringTriggerId == null ? this.monitoringTriggerForm.value.monitoringTrigger : monitoringTriggerSetupName;
        const facilityId = this.monitoringTriggerForm.value.loanApplicationDetailId;
        const facility = this.proposedItems.find(x => x.loanApplicationDetailId == this.monitoringTriggerForm.value.loanApplicationDetailId);
        this.monitoringTriggerCollection.push({
            monitoringTrigger: trigger,
            monitoringTriggerId: monitoringTriggerId,
            applicationDetailId: facilityId,
            productCustomerName: facility.approvedProductName + ' -- ' + facility.obligorName,
        });
        this.refreshDataTable();
        this.resetMonitoringTriggerForm(facilityId);
        this.unsavedTriggers = true;
    }

    refreshDataTable() {
        this.monitoringTriggerCollection = this.monitoringTriggerCollection.slice(); //Triggers data refresh
    }

    resetMonitoringTriggerForm(facId = null) {
        this.monitoringTriggerForm = this.fb.group({
            monitoringTriggerId: [''],
            monitoringTrigger: ['', Validators.required],
            loanApplicationDetailId: [(facId == null ? '' : facId), Validators.required],
        });
    }

    showMonitoringtriggerList() {
        this.displayMonitoringTriggerDialog = true;
    }

    getApplicationMonitoringTriggers() {
        //if (this.isAnalyst == false) return;
        this.camService.getApplicationMonitoringTriggers(this.callerId,this.applicationId)
            .subscribe((response: any) => {
                this.monitoringTriggerCollection = response.result;

                
                this.refreshDataTable();
            }, (err) => {
            });
    }

    saveApplicationMonitoringTriggers(body = this.monitoringTriggerCollection) {
        this.loadingService.show();
        this.camService.saveApplicationMonitoringTriggers(this.callerId,this.applicationId, body).subscribe((response: any) => {
            if (response.success == true) {
                this.getApplicationMonitoringTriggers();
            }
            this.unsavedTriggers = false;
            // this.monitoringTriggerCollection = response.result;
            // this.monitoringTriggerCollection = this.monitoringTriggerCollection.slice(); //Triggers data refresh
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    onChangeTriggersFacility(facilityId) {
        this.selectedTriggers = [];
        if (facilityId < 1) return;
        const ids = this.monitoringTriggerCollection
            .filter(x => x.applicationDetailId == facilityId)
            .map(x => x.monitoringTriggerId);
        this.selectedTriggers = this.customTriggers.filter(x => ids.indexOf(x.monitoringTriggerId) != -1);
    }


    // ---------------------- message ----------------------

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


}