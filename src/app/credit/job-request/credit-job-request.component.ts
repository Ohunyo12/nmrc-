import { Component, OnInit, ViewChild, Compiler, Input } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { RequestJobTypeService } from '../../setup/services/request-job-type.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalStatus, JobTypeEnum, JobSourceEnum, JobRequestStatusEnum } from '../../shared/constant/app.constant';
import { JobService } from "../services/job.service";
import swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/primeng';



@Component({
    templateUrl: 'credit-job-request.component.html',
    styleUrls: ['job-request.component.scss'],
})

export class CreditJobRequestComponent implements OnInit {
    visible: boolean = true;
    //viewHeigth: number;
    toBranch: any;
    to: any;
    responseComment: any;
    branch: any;
    fromSender: any;
    senderComment: any;
    selectedJobData: any;
    displayJobViewForm: boolean = false;

    applications: any[];
    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    workingLoanApplication: string = null;
    disableAppraisalMemorandumTab: boolean = true;
    disableSupportingDocumentsTab: boolean = true;
    disableApprovalsAndCommentsTab: boolean = true;
    displayRequestGrid: boolean = true;
    isRequestReassigned: boolean;
    isRequestAcknowledged: boolean;
    requestTargetId: number;
    requestOperationsId: number;
    requestStatusId: number;
    requestPageHeaderTitle: string;
    operationTitle: string;
    jobRequests: any[];
    jobTypes: any[] = [];
    displayRequestForm: boolean = false; 
    displayReasignForm: boolean = false;
    displayResponseForm: boolean = false;
    displayJobReasignForm: boolean = false;
    displayReplyForm: boolean = false;
    displayReassignForm: boolean = false;
    jobRequestForm: FormGroup;
    replyForm: FormGroup;
    reassignForm: FormGroup;
    jobData: any;
    dynamicJobRequestId: number;
    viewOnly: boolean;
    jobReasignmentStaff: any;
    jobSubTypes: any;
    jobCount: any;
    searchString: string = '';
    jobSourceId: number;
    jobRequestsDefault: any[];
    jobRequestsMoreData: any;
    pendingCount: number;
    inProgresCount: number;
    cancelledCount: number;
    finishedCount: number;
    allCount: number;
    displaySourceBranch: any;
    assigned: boolean;


    showAssignmentStatus(array){
        if(array != null && array != undefined){
            if(array.assigned == true){ 
                var assignee = array.staff.filter(x=>x.hubStaffId == array.id)[0].hubStaffName;
                this.jobRequests.filter(x=>x.jobRequestId == this.dynamicJobRequestId)[0].assignee = assignee;
                this.jobRequests.slice;
            }
        }
        
    }

    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private jService: JobService,
        private jobTypeService: RequestJobTypeService,
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.clearRequestControls();
        this.loadDropdowns();
        this.getAllJobRequest();
        //this.getJobRequestCount();

        this.jobSourceId = JobSourceEnum.Floating;
        this.isRequestReassigned = false;
        this.isRequestAcknowledged = false;
        this.requestTargetId = 1;
        this.requestOperationsId = 6;
        this.requestStatusId = 1;
        this.requestPageHeaderTitle = 'Central Job Request';
        this.operationTitle='';
    }

    loadDropdowns() {
        this.jobTypeService.getJobTypes().subscribe((response: any) => {
            this.jobTypes = response.result;
        });
    }

    getJobSUbTypes(id){
        this.jobTypeService.getJobSubTypes(id).subscribe((response: any) => {
            this.jobSubTypes = response.result;
        });
    }

    getJobRequestsByQueryString(){
         if(this.searchString != null) {
             this.getJobRequestByQueryString(this.searchString);
         }
     }

     getJobRequestByQueryString(queryString): void {
        this.loadingService.show();
        this.jobRequests = [];
        this.jService.getJobRequestByQueryString(queryString).subscribe((response: any) => {
            if(response.success){
                this.jobRequests = response.result;
                this.itemTotal = response.count;
                this.jobRequests.slice;
                this.updateVisibility();
                this.loadingService.hide();
            } else { this.loadingService.hide(1000); }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    //  if(response.success){
    //     this.jobRequests = [];
    //     this.jobRequests = response.result;
    //     this.itemTotal = response.count;
    //     //this.jobRequests.slice;
    //     this.updateVisibility();
    //     this.loadingService.hide();
    // } else { this.loadingService.hide(1000); }

    privilege: any = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
    };

    toggleRequestGrid(){
        if(this.displayRequestGrid) this.displayRequestGrid = false;
        else this.displayRequestGrid = true;
    }

    showSourceBranch(){
        if(this.displaySourceBranch){
            this.displaySourceBranch = false;
        } else this.displaySourceBranch = true;
    }

    CallRequestClose(event) {
        
        this.displayRequestForm = false;
        this.displayReasignForm = false;
        this.displayResponseForm = false;

        this.viewOnly = false;
        this.jService.getJobRequestByStaffId().subscribe((response: any) => {
            
            if(response.success){
                this.jobRequests = [];
                this.jobRequests = response.result;
                if (event != 'final') { this.updateVisibility(); this.CallRequestClose('final'); }
                this.getJobRequestCount();
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // scroll() {
    //     let el = document.getElementById('jobreply');
    //     el ? el.scrollIntoView() : null;
    // }

    getResponse(event: any) {
        let res = event
        if (res == true){
            this.getAllJobRequest();
        }
    }

    loadData(event: LazyLoadEvent){
        //console.debug('event',event);
    }

    CallRequestCloseNoRefresh(event) { 
        this.displayRequestForm = false;
        this.displayReasignForm = false;
        this.displayResponseForm = false;
        this.viewOnly = false;
        this.getAllJobRequest();
        this.getJobRequestCount();
    }

    getRequestData(event: any) {
        if (event) {
            this.getAllJobRequest();
            this.displayRequestForm = false;
        }
        else{ this.finishBad("Failed to return an array value"); }
    }

    clearControls() {
        this.reassignForm = this.fb.group({
            reassignedTo: ['', Validators.required],
            staffName: ['', Validators.required], 
            senderComment: ['', Validators.required],
        });
    }

    numberFormat(number): string {
        return number.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;
    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    reply: any = {
        id: null,
        senderComment: '',
        fromSender: '',
        reassignedTo: '',
    };

     updateVisibility(): void {
        this.visible = false;
        setTimeout(() => this.visible = true, 0);
        //this.jobRequests.slice;
        //console.log('it got here');
      }
      
      getJobRequestCount() {
       this.jService.getJobRequestCount().subscribe((response: any) => {
            if(response.success){
                this.jobCount = response.result;
            } 
        });
      }

    getAllJobRequest(): void {
        this.loadingService.show();
        this.jService.getJobRequestByStaffId().subscribe((response: any) => {
            if(response.success){
                this.jobRequests = [];
                this.jobRequests = response.result;
                this.itemTotal = response.count;
                this.jobRequestsDefault = this.jobRequests;
                this.ResolveJobCount(this.jobRequests);
                //this.jobRequests.slice;
                this.updateVisibility();
                this.loadingService.hide();
            } else { this.loadingService.hide(1000); }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    ResolveJobCount(jobRequests: any){
        this.pendingCount = jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Pending).length;
        this.inProgresCount = jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Processing).length;
        this.cancelledCount = jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Cancel).length;
        this.finishedCount = jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Approved).length;
        this.allCount = jobRequests.length;
    }

    GetJobRequestByStatus(value): void {
        if(value == 'all'){ this.getAllJobRequest();}
        this.loadingService.show();
        var startNumber= null; //this.getMaxY();
        this.jService.getJobRequestByStatus(value,startNumber).subscribe((response: any) => {
            if(response.success){
                this.jobRequests = response.result;
                // this.jobRequests = this.jobRequests.concat(response.result);
                this.jobRequestsDefault = this.getUnique(this.jobRequests, 'jobRequestCode');
                this.jobRequests = this.jobRequestsDefault
                // this.jobRequests.slice;
                this.ResolveJobCount(this.jobRequests);
                this.viewfilteredJobRequest(value);
                this.displayRequestGrid = true;
                this.visible = true;
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }



     getUnique(arr, comp) {

        const unique = arr
             .map(e => e[comp])

           // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)
      
          // eliminate the dead keys & store unique objects
          .filter(e => arr[e]).map(e => arr[e]);
      
         return unique;
      }
    
    // getMaxY() : any{
    //     const max = this.jobRequests.reduce((jobRequestId) => Math.max(jobRequestId));
    //     console.log('max',max);
    //     const max2 = this.jobRequests.reduce((jobRequestId) => Math.max(jobRequestId));
    //     console.log('max',max2);

    //     return this.max();
    // }
    // max(): number {
    //     console.log('mx',Math.max(...this.jobRequests)) ;
    //     return Math.max(...this.jobRequests);
    // }

    viewfilteredJobRequest(value): void {
        if(value == 'all'){
            this.jobRequests = this.jobRequestsDefault;
            this.jobRequests.splice;
        }
        if(value == 'pending'){
            this.jobRequests = this.jobRequestsDefault;
            this.jobRequests = this.jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Pending)
            this.jobRequests.splice;
        }
        if(value == 'completed'){
            this.jobRequests = this.jobRequestsDefault;
            this.jobRequests = this.jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Approved)
            this.jobRequests.splice;
        }
        if(value == 'in-progress'){
            this.jobRequests = this.jobRequestsDefault;
            this.jobRequests = this.jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Processing)
            this.jobRequests.splice;
        }
        if(value == 'cancelled'){
            this.jobRequests = this.jobRequestsDefault;
            this.jobRequests = this.jobRequests.filter(x=>x.requestStatusId == JobRequestStatusEnum.Cancel)
            this.jobRequests.splice;
        }
    }

    clearRequestControls() {
        this.jobRequestForm = this.fb.group({
            jobTypeId: ['', Validators.required],
            receiverStaffId: [''],
            staffApprovalGroupId: [''],
            receiverStaffName: ['', this.validateSelectedStaff()],
            senderComment: [''],
        });
        this.replyForm = this.fb.group({
            responseComment: ['', Validators.required],
        });
        
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
            staffName: ['']
        });

        this.reassignForm = this.fb.group({
            reassignedTo: ['', Validators.required],
            staffName: ['', Validators.required],
        });
    }

    closeDialog(){
        this.displayJobReasignForm = false;
        this.displayJobViewForm = false;
        this.viewOnly = false;
    }
    startJobRequest(row){
        this.viewOnly = false;
        this.replyJobRequest(row);
    }

    replyJobRequest(row) { console.log('job row:',row);
        let index = this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0].jobRequestId;
        var x =  this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0];
        
        if(!x.isReassigned && x.responseComment == null && !this.viewOnly){
            swal('Fintrak Credit 360','Job must be assigned before processing.', 'info');
            return;
        }
        
        if(!this.viewOnly && (x.loggedInStaffId != x.reassignedTo && x.loggedInStaffId != x.senderStaffId) 
        || (x.receiverStaffId != null  && x.senderStaffId == null && x.loggedInStaffId != x.receiverStaffId)) {
            swal(
                'Fintrak Credit 360',
                'You cannot attend to this job because you are not mapped to this job.', 
                'info'
                );
            return;
        }
        //this.getJobRequestCount();
        this.dynamicJobRequestId = index;
        this.displayResponseForm = true;
        //if(this.displayResponseForm)this.scroll();
    }

    ViewJobRequest(row) {
        this.viewOnly =  true;
        this.replyJobRequest(row)
    }

    reassignRequest(index) {
        this.clearRequestControls();
        var row = this.jobRequests[index]; 
        
        this.viewOnly = true;
        this.reply = {
            fromSender: row.fromSender,
            senderComment: row.senderComment,
        };
        this.reply.id = row.jobRequestId;
        this.displayJobReasignForm = true;
    }

    submitRequestForm(form) {
        this.loadingService.show();
        let body = {
            jobTypeId: form.value.jobTypeId,
            receiverStaffId: form.value.receiverStaffId,
            staffApprovalGroupId: form.value.staffApprovalGroupId,
            senderComment: form.value.senderComment,
            
        };
        this.camService.saveJobRequest(body).subscribe((res) => {
            if (res.success == true) {
                this.getAllJobRequest();
                //this.getJobRequestCount();
                this.displayRequestForm = false;

            } else {
                this.finishBad(res.message);

            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    submitReplyForm(form) {
        this.loadingService.show();
        let body = {
            responseComment: form.value.responseComment,
        };
        this.camService.updateJobRequestReply(body, this.reply.id).subscribe((res) => {
            if (res.success == true) {
                this.getAllJobRequest();
                //this.getJobRequestCount();
                this.displayReplyForm = false;
            } else {
                this.finishBad(res.message);

            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    submitReassignForm(form) {
        this.loadingService.show();
        let body = {
            reassignedTo: form.value.reassignedTo,
        };
        this.camService.updateJobRequestReassign(body, this.reply.id).subscribe((res) => {
            if (res.success == true) {
                this.getAllJobRequest();
                //this.getJobRequestCount();
                this.displayJobReasignForm = false;
            } else {
                this.finishBad(res.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    // search staff

    staffList: any[] = [];
    CamOperationId: number = 6; // this is CAM operationId and should should be same at API and DB 
    query: string;
    queryTwo: string;
    filteredList: any[] = [];
    index: number;

    showRequestForm() {
        this.clearRequestControls();
        this.displayRequestForm = true;
    }

    getJobReasignmentStaff(staffId) {
        this.jobTypeService.getJobReasignmentStaff(staffId).subscribe((response: any) => {
            this.jobReasignmentStaff = response.result;
        });
    }

    backToList(){
        this.displayResponseForm = false;
        this.viewOnly = false;
    }

    reasignJobRequest(row) {
        //console.log('s vs l', row.loggedInStaffId);
        if(row.senderStaffId == row.loggedInStaffId){
            swal(
                'Fintrak Crediit 360',
                'Job sender cannot reasign.',
                'info'
            );
            return;
        }
        var jobType = this.jobTypes.filter(x=>x.jobTypeId == row.jobTypeId)[0];
        if(jobType.canBeReasigned) {
            this.jobTypeService.getJobReasignmentStaff(row.loggedInStaffId).subscribe((response: any) => {
                if(response.success){
                    this.jobReasignmentStaff = response.result; 
                    if(this.jobReasignmentStaff != undefined && this.jobReasignmentStaff != null 
                        && this.jobReasignmentStaff.length > 0){
                        let index = this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0].jobRequestId;
                        this.dynamicJobRequestId = index;
                        this.displayReasignForm = true;
                    }
                    else { swal('Fintrak Credit 360','You are not authorized to assign this job type.','info');}
                }
            });
        }
        else{
            let index = this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0].jobRequestId;
            this.dynamicJobRequestId = index;
            this.displayReasignForm = true;
            }
    }

    // filter(form: number = 1) {
    //     let search = (form == 1) ? this.query : this.queryTwo;
    //     if (search !== "") {
    //         this.filteredList = this.staffList.filter(function (e) {
    //             return e.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    //         }.bind(this));
    //     } else {
    //         this.filteredList = [];
    //     }
    // }

    // select(id, name, groupId) {
    //     this.filteredList = [];
    //     this.jobRequestForm.controls['receiverStaffId'].setValue(id);
    //     this.jobRequestForm.controls['receiverStaffName'].setValue(name);
    //     this.jobRequestForm.controls['staffApprovalGroupId'].setValue(groupId);
    // }

    // assign(id, name) {
    //     this.filteredList = [];
    //     this.reassignForm.controls['staffName'].setValue(name);
    //     this.reassignForm.controls['reassignedTo'].setValue(id);
    // }

    validateSelectedStaff() {
        return (control: FormControl) => {
            if (this.staffList.find(x => x.name == control.value) == null) {
                return { error: true };
            }
            return null;
        }
    }

    // request list table
    statuses = [
        { id: 1, label: 'Pending', style: 'warning' },
        { id: 2, label: 'In Progress', style: 'info' },
        { id: 3, label: 'Completed', style: 'success' },
        { id: 4, label: 'Disapproved', style: 'default' },
        { id: 5, label: 'Cancelled', style: 'default' },
    ];

    getJobRequest(id) {
        var jobTypeName = 'n/a';

        let jobItem = this.jobTypes.filter(x => x.jobTypeId == id)[0]; 

        if(jobItem.jobTypeId != undefined && jobItem.jobTypeId === JobTypeEnum.MiddleOfficeVarification){
            jobTypeName = 'MO Verification';
        } else jobTypeName = jobItem.jobTypeName

        return jobTypeName ;
    }


    getStatus(id) {
        let status = this.statuses.find(x => x.id == +id);
        if (status == null) {
            return '<span class="label label-default">Unknown</span>';
        }
        return `<span class="label label-${status.style}">${status.label}</span>`;
    }

    // forward / approve / refer back

    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiver: number = 0;


    forward() {
        this.clearRequestControls();
        this.forwardAction = ApprovalStatus.PROCESSING;
        this.displayCommentForm = true;
        this.commentTitle = 'Forward Document';
    }

    approve() {
        this.clearRequestControls();
        this.forwardAction = ApprovalStatus.APPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Approve Document';
    }

    disapprove() {
        this.clearRequestControls();
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Disapprove Document';
    }

    trail: any[] = [];
    trailCount: number = 0;

    queryReferBack: string;
    filteredTrail: any[] = [];

    filterReferBack() {
        if (this.queryReferBack !== "") {
            this.filteredTrail = this.trail.filter(function (e) {
                return e.staffName.toLowerCase().indexOf(this.queryReferBack.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredTrail = [];
        }
    }

    selectReferBackLevel(id, name) {
        this.filteredTrail = [];
        this.commentForm.controls['staffName'].setValue(name);
        this.receiver = id;
    }

    show: boolean = false; message: any; title: any; cssClass: any; // message box

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
