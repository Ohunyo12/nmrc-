import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService, StaffRoleService } from '../../../setup/services';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'transaction-dynamics.component.html',
    selector: 'app-transaction-dynamics',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class TranxDynamicsComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() applicationId: number;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;
    @Input() isBusiness: boolean = false;
    @Input() operation: number = null;
    @Input() displayedOnly = false;
    // @Output() approvalStatusId: EventEmitter<any> = new EventEmitter<any>();
    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;
    suggestedConditions: any[] = [];
    selectedSuggestions: any[];
    isTransaction = true;

    complianceTimelines: any[] = [];
    apsTriggers: any;
    dataResponse: any;
    @Input() set reload(value: number) { if (value == 0) this.reset(); }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private reviewService: LoanReviewApplicationService,
        private conditionService: ConditionPrecedentService,
        private staffRole: StaffRoleService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
       (this.isAnalyst == true || this.isBusiness == true) ? this.isAnalyst = true : this.isAnalyst = false ;
       
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsAccountOfficer2 = false;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO'
                || this.staffRoleRecord.staffRoleCode == 'PMU'
                || this.staffRoleRecord.staffRoleCode == 'RMO'
                || this.staffRoleRecord.staffRoleCode == 'CP'
                || this.staffRoleRecord.staffRoleCode == 'RO'
                || this.staffRoleRecord.staffRoleCode == 'BM') { 
                    this.userIsAccountOfficer = true; 
                }
            });
    }
    getAllSuggestedConditions(detailId) {
        this.loadingService.show();
        this.conditionService.getLoanSuggestedConditions(detailId).subscribe((response: any) => {
            this.suggestedConditions = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    addSuggestedCondition(selectedRow) {
        // console.log(selectedRow);
        this.clearControls();
        this.formState = 'New';
        this.selectedId = null;
        this.dynamicsForm.controls['loanApplicationDetailId'].setValue(selectedRow.loanApplicationDetailId);
        this.dynamicsForm.controls['dynamics'].setValue(selectedRow.description);
        this.displayDynamicsForm = true;
    }

    // onSelectedSuggestion(event) {

    // }

    // onSelectedAllSuggestions(event) {

    // }

    // removeSelectedSuggestion(event) {

    // }

    loadDropdowns() {
        this.conditionService.getAllComplianceTimeline().subscribe((response: any) => {
            this.complianceTimelines = response.result;
        });
    }

    clearControls() {
        this.formState = 'New';
        this.dynamicsForm = this.fb.group({
            loanApplicationDetailId: [this.selectedDetailId],
            dynamics: ['', Validators.required],
            position: ['', Validators.required],
            isExternal: [false],


        });
    }

    // transaction dynamics 
    selectedDetailId: number = null;

    dynamicsForm: FormGroup;
    displayDynamicsForm: boolean = false;
    dynamics: any[] = [];

    defaultDynamics: any[] = [];

    onDynamicsFacilityChange(detailId) {
        // console.log('detailId',detailId);
        
        this.selectedDetailId = detailId;
        this.getTransactionDynamics(detailId);
        
    }

    // getTransactionDynamics(): void {
    getTransactionDynamics(detailId = this.selectedDetailId): void {
        
        if (detailId == null) return;
        this.loadingService.show();

        if(this.operation !=null){
                this.getDefaultTransactionDynamicsByOperation(detailId);
        }else{
            this.getDefaultTransactionDynamics(detailId);
        }
        
       
    }

    getDefaultTransactionDynamicsByOperation(detailId){
        this.camService.getDefaultTransactionDynamicsByOperation(this.callerId,detailId,this.operation).subscribe((response: any) => {
            this.defaultDynamics = response.result;
            this.loadingService.hide();
            this.getLoanDynamics(detailId);

            if(this.defaultDynamics[0]==null) return;
            if(this.defaultDynamics[0].isCheckListSpecific==true){
                this.saveAPSDynamicsChanges();

                this.camService.getApplicationMonitoringTriggersByOperationId(this.operation,detailId).subscribe((response: any) =>{
                        this.apsTriggers = response.result;

                        this.saveAPsMonitoringTriggers(this.callerId,detailId,this.apsTriggers);
                });
            }
            ////console.log('dynamcx.. ', response);
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }
    getDefaultTransactionDynamics(detailId){
        this.camService.getDefaultTransactionDynamics(this.callerId,detailId).subscribe((response: any) => {
            this.defaultDynamics = response.result;
            this.loadingService.hide();
            this.getLoanDynamics(detailId);
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }

    saveAPsMonitoringTriggers(callerId,detailId,triggers){

    let data = {

    }

    this.camService.saveApplicationMonitoringTriggers(callerId,detailId,triggers).subscribe((response: any) =>{
        this.dataResponse = response.result;
    });
    }

    getLoanDynamics(detailId = this.selectedDetailId) {
        this.loadingService.show();
        this.camService.getTransactionDynamics(this.callerId, detailId).subscribe((response: any) => {
            this.dynamics = response.result;
            //this.dynamics = this.dynamics;
            this.loadingService.hide();
            this.preSelectDynamics();
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }

    preSelectDynamics() {
        this.selectedDynamics = [];
        const ids = this.dynamics
            .filter(x => x.dynamicsId != null)
            .map(x => x.dynamicsId);
        this.selectedDynamics = this.defaultDynamics.filter(x => ids.indexOf(x.dynamicsId) != -1);
    }

    // new

    selectedDynamics: any[];
    unsavedDynamics = false;

    onSelectedDynamics(e) {
        this.unsavedDynamics = true;
    }

    removeSelectedDynamics(e) {
        this.unsavedDynamics = true;
    }

    onSelectedAllDynamics(e) {
        this.unsavedDynamics = true;
    }

    saveAPSDynamicsChanges() {
        let body = {
            id: this.applicationId,
            selectedIds: this.defaultDynamics.map(x => x.dynamicsId),
            detailId: this.selectedDetailId,
        };
        this.loadingService.show();
        this.camService.saveSelectDynamicsChanges(this.callerId, body).subscribe((response: any) => {
            if (response.success == true) {
                this.dynamics = response.result; // get only loancd
            } else {
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

    }

    saveSelectDynamicsChanges() {
        let body = {
            id: this.applicationId,
            selectedIds: this.selectedDynamics.map(x => x.dynamicsId),
            detailId: this.selectedDetailId,
        };
        this.loadingService.show();
        this.camService.saveSelectDynamicsChanges(this.callerId, body).subscribe((response: any) => {
            if (response.success == true) {
                this.unsavedDynamics = false;
                this.loadingService.hide();
                this.dynamics = response.result; // get only loancd
                ////console.log('GOOD!', JSON.stringify(response.message));
            } else {
                this.finishBad(response.message);
                ////console.log('BAD!', JSON.stringify(response.error));
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

    }

    showDynamicsForm() {
        this.clearControls();
        this.formState = 'New';
        this.displayDynamicsForm = true;
        this.selectedId = null;
    }
    
    saveDynamics(form) {
        let body = {
            dynamics: form.value.dynamics,
            loanApplicationDetailId: form.value.loanApplicationDetailId,
            loanApplicationId: this.applicationId,
            position: form.value.position,
            isExternal: form.value.isExternal,

        };
        this.loadingService.show();
        if (this.selectedId === null) {

            this.camService.saveTransactionDynamics(this.callerId, body).subscribe((response: any) => {
                if (response.success == true) {
                    this.displayDynamicsForm = false;
                    this.loadingService.hide();
                    this.getTransactionDynamics();
                } else {
                    this.finishBad(response.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {

            this.camService.editTransactionDynamics(this.callerId, body, this.selectedId).subscribe((response: any) => {
                if (response.success == true) {
                    this.displayDynamicsForm = false;
                    this.loadingService.hide();
                    this.getTransactionDynamics();
                } else {
                    this.finishBad(response.message);
                   
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }
    editDynamics(row, addedit = false) {
        if (addedit == true) {
            this.formState = 'Edit & Add';
            this.selectedId = null;
            this.dynamicsForm = this.fb.group({
                loanApplicationDetailId: [this.selectedDetailId, Validators.required],
                // loanApplicationDetailId: [row.loanApplicationDetailId, Validators.required],
                dynamics: [row.dynamics, Validators.required],
                position: [row.position, Validators.required],
                isExternal: [row.isExternal],
    
            });
            this.displayDynamicsForm = true;
            return;
        }
        this.formState = 'Edit';
        this.selectedId = row.loanDynamicsId;
        this.dynamicsForm = this.fb.group({
            loanApplicationDetailId: [this.selectedDetailId, Validators.required],
            // loanApplicationDetailId: [row.loanApplicationDetailId, Validators.required],
            dynamics: [row.dynamics, Validators.required],
            position: [row.position, Validators.required],
            isExternal: [row.isExternal],

        });
        this.displayDynamicsForm = true;
    }
    // editDynamics(row) {
    //     this.formState = 'Edit';
    //     this.selectedId = row.dynamicsId;
    //     console.log("edit rec",this.selectedId);
    //     this.dynamicsForm = this.fb.group({
    //         loanApplicationDetailId: [this.selectedDetailId, Validators.required],
    //         // loanApplicationDetailId: [row.loanApplicationDetailId, Validators.required],
    //         dynamics: [row.dynamics, Validators.required],
    //         position: [row.position, Validators.required],
    //         isExternal: [row.isExternal],

    //     });
    //     this.displayDynamicsForm = true;
    // }

    removeDynamics(id) {
        const __this = this;
        swal({
            title: 'Remove Dynamics ' + id + '?',
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

            __this.camService.removeTransactionDynamics(__this.callerId, id).subscribe((response: any) => {
                if (response.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Dynamics Removed.', 'success');
                    __this.displayDynamicsForm = false;
                    __this.loadingService.hide();
                    __this.getTransactionDynamics();
                    __this.finishGood();
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, response.message, 'error');
                }
            }, (err: any) => {
                __this.finishBad(JSON.stringify(err));
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    reset() {
        this.selectedDynamics = [];
        this.unsavedDynamics = false;
        this.selectedDetailId = null;
        this.displayDynamicsForm = false;
        this.defaultDynamics = [];
        this.conditions = [];
        this.dynamics = [];
        this.selectedId = null;
        this.isSubsequent = false;
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