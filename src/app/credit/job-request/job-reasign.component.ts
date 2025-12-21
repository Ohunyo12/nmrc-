import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobService } from "../services/job.service";
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { CreditJobRequestComponent } from 'app/credit/job-request/credit-job-request.component';
import { RequestJobTypeService } from 'app/setup/services';

@Component({
    selector: 'job-reasign-template',
    templateUrl: 'job-reasign.component.html',
    styleUrls: ['job-request.component.scss']
})

export class ReasignRequestComponent   {
    searchDepartmentUnitId$: number = 0; 
    comment: any;
    feedback: string = null;
    departments: any[] = [];
    showLoadIcon: boolean = false; 
    jobRequests: any[] =[];
    displaySearchModal: boolean = false;
    searchResults: Object; 
    searchTerm$ = new Subject<any>();
    searchTerm2$ = new Subject<any>();
    userDepartmentId = 0;
    jobTypes: any[] = [];
    displayReassignForm: boolean = false;
    reassignForm: FormGroup; 
    lastSelectedDepartmentId?: number = null;
    staffList: any[] = [];
    query: string;
    fromSender: string;
    queryTwo: string;
    filteredList: any[] = [];
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    recieverStaffId: number;
    
    //..........Input variables 
    @Input() emittableJobRequestRecord: any;
    @Input() jobData: any;
    @Input() pageHeaderTitle: string;
    @Input() hideableClassValue: string ="";
    @Input() jobId: boolean;
    @Input() reasignedTo: boolean;
    //...........End of Input variables 

    //Output Event emmitter definition consumed during loan Booking
    @Output() notify: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOption: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOptionNoRefresh: EventEmitter<any> = new EventEmitter<string>();
    @Output() showAssignmentStatus: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(CreditJobRequestComponent, {static: false}) requestViewObj: CreditJobRequestComponent;
    
    private _dynamicJobRequestId = 0;
    selectedRequest: any;
    jobRequestId: any;
    jobHubs: any;
    jobHubStaff: any;
    assigned: boolean;
   

    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private jService: JobService,
        private jobTypeService: RequestJobTypeService,
        private fb: FormBuilder,
        private loadingSrv: LoadingService
    ) { }

    ngOnInit() {
        this.clearRequestControls();
    }

    

    @Input() 
    set dynamicJobRequestId(dynamicJobRequestId: number) {
        this._dynamicJobRequestId = dynamicJobRequestId;
        
        if(this.jobData != null){ 
            var d = this.jobData.filter(x=>x.jobRequestId ==dynamicJobRequestId);
            this.selectedRequest = d[0];
            this.comment = this.selectedRequest != null ? this.selectedRequest['senderComment'] : null;
            this.searchDepartmentUnitId$ = this.selectedRequest['departmentUnitId'];
            this.jobRequestId = this.selectedRequest['jobRequestId']; 
            this.getJobTypeHub(this.selectedRequest['jobTypeId']);
        }
    }

    get dynamicJobRequestId(): number { return this._dynamicJobRequestId; }

    getJobTypeHub(jobTypeId: any) {
        this.jobTypeService.getJobTypeHub(jobTypeId).subscribe((response: any) => {
            this.jobHubs = response.result;
        });
    }

    onHubSelectionChange(hubId){
        this.jobTypeService.getHubStaffByHubId(hubId).subscribe((response: any) => {
            this.jobHubStaff = response.result;
        });
    }

    searchText() { 
        this.searchResults = null;
        let searchText = this.reassignForm.value.staffName;
        if(searchText != null){
            this.loadingSrv.show();
            this.jService.searchForDepartmentStaff(searchText, this.searchDepartmentUnitId$ )
            .subscribe(results => {
                this.loadingSrv.hide();
                this.searchResults = results.result;
            });
        }
        this.loadingSrv.hide();
    }

    searchDB(searchString) { 
        this.searchResults = null;
        this.searchTerm$.next(searchString);
        this.jService.searchForStaff(this.searchTerm$, this.searchDepartmentUnitId$ )
            .subscribe(results => {
                this.searchResults = results.result;
            });
    }

    pickSearchedData(item) {
        this.reassignForm.controls['staffName'].setValue(item.fullname);
        this.recieverStaffId = item.staffId;
        this.displaySearchModal = false;
        this.searchResults = null;
    }

    clearRequestControls() {
        this.reassignForm = this.fb.group({
            //staffName: ['', Validators.required], 
            hubId: ['', Validators.required],
            staffId: ['', Validators.required],

        });
    }

    openSearchBox() { this.displaySearchModal = true; }
   
    reassignJobRequest(index) { 
        this.clearRequestControls();
        var row = this.jobRequests[index];
        this.displayReassignForm = true;
    }

    emitClose(){
        this.searchResults = null;
        this.displayOption.emit('Close');
        this.jobRequests = [];
    }

    emitCloseNoRefresh(){
        this.searchResults = null;
        this.displayOptionNoRefresh.emit('Close');
        this.jobRequests = [];
    }
    emitAssignmentStatus(id){
        var body = {
            assigned : this.assigned,
            id : id,
            staff: this.jobHubStaff
        }
        this.searchResults = null;
        this.showAssignmentStatus.emit(body,);
        this.jobRequests = [];
    }

    submitReassignForm(form) { 
        var text = 'Do you want to assign this job to the selected staff.';
        var assigneeId = this.selectedRequest.reassignedTo;
        if(assigneeId != null ){
            text =  'You are about to assign job request with code '+ this.selectedRequest.jobRequestCode +'. \n' + 'Do you want to continue?';
        }
        let body = {
            reassignedTo: form.value.staffId,
        };
        var jobRequestId = this.jobRequestId;
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: text,
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
            __this.camService.updateJobRequestReassign(body, jobRequestId).subscribe((res) => { 
                if (res.success == true) {
                    swal('Fintrak Credit 360', res.message, 'success');
                    __this.loadingService.hide();
                    __this.assigned = true;
                    __this.emitClose();
                    __this.emitAssignmentStatus(form.value.staffId);
                } else {
                    swal('Fintrak Credit 360', res.message, 'error');
                    __this.assigned = false;
                    __this.loadingService.hide();
                }
            }, (err: any) => {
                swal('Fintrak Credit 360', JSON.stringify(err), 'error');
                __this.loadingService.hide();
            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal('Fintrak Credit 360', 'Operation cancelled', 'error');
                __this.loadingService.hide();
            }
        });

        __this.emitClose();
    }

    submitReassignForm2(form) {
        this.loadingService.show();
        let body = {
            reassignedTo: this.recieverStaffId,
        };
        this.camService.updateJobRequestReassign(body, this.selectedRequest.jobRequestId).subscribe((res) => {
            if (res.success == true) {
                this.displayReassignForm = false;
                this.finishGood('Job Successfuly Reasigned');
            } else {
                this.finishBad(res.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

        this.emitClose();
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.showMessage(message, 'success', "FintrakBanking");
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
