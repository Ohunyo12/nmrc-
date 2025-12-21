import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobService } from "../services/job.service";
import { CasaService } from '../../customer/services/casa.service';
import swal from 'sweetalert2';


@Component({
    templateUrl: 'facility-job-request.component.html',
    styleUrls: ['job-request.component.scss'],
})

export class FacilityJobRequestComponent implements OnInit {
    displayTwoFactorAuth2: boolean;
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    passCode: any;
    username: string;
    customerAccount: any;
    customer: any;
    row: any;
    viewOnly: boolean;
    jobRequests: any;
    itemTotal: any;
    facilityReferenceNumber: string ;
    displayJobViewForm: boolean;
    senderComment: any;
    responseComment: any;
    searchString: string = '';
    constructor(
        private loadingService: LoadingService,
        private jService: JobService,
        private fb: FormBuilder,
        private casa: CasaService,
    ) { }

    ngOnInit() {
        //this.clearControls();
        
    }

    getFacilityJobRequests(){
    //    console.debug('searchString',this.searchString);
        if(this.searchString != null) {
            this.getFacilityJobRequest(this.searchString);
        }
    }

    clearControls() {
        // this.replyForm = this.fb.group({
        //     responseComment: [''],
        //     description: [''],
        //     jobSubTypeId: [''],
        //     disapprove: [''],
        //     fileInput: ['']
        // });
    }

    statuses = [
        { id: 1, label: 'Pending', style: 'warning' },
        { id: 2, label: 'In Progress', style: 'info' },
        { id: 3, label: 'Completed', style: 'success' },
        { id: 4, label: 'Disapproved', style: 'default' },
        { id: 5, label: 'Cancelled', style: 'default' },
    ];

    getStatus(id) {
        let status = this.statuses.find(x => x.id == +id);
        if (status == null) {
            return '<span class="label label-default">Unknown</span>';
        }
        return `<span class="label label-${status.style}">${status.label}</span>`;
    }

    ViewJobRequest(row) {

        this.row = row;
        this.displayJobViewForm = true;
        this.senderComment = this.row['senderComment'];
        this.responseComment = this.row['responseComment'];
        
    }

    // replyJobRequest(row) { 
    //     let index = this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0].jobRequestId;
    //     var x =  this.jobRequests.filter(x=>x.jobRequestId == row.jobRequestId)[0];
    //     if(!x.isReassigned && x.responseComment == null && !this.viewOnly){
    //         swal('Fintrak Credit 360','Job must be assigned before processing.', 'info');
    //         return;
    //     }
    //      //this.getJobRequestCount();
    //     // this.dynamicJobRequestId = index;
    //      this.displayJobViewForm = true;
    //     // if(this.displayResponseForm)this.scroll();
    // }

    getFacilityJobRequest(facilityReferenceNumber): void {
        this.loadingService.show();
        this.jService.getFacilityJobRequestByFacilityReferenceNumber(facilityReferenceNumber).subscribe((response: any) => {
            if(response.success){
                this.jobRequests = [];
                this.jobRequests = response.result;
                this.itemTotal = response.count;
                this.jobRequests.slice;
                this.loadingService.hide();
            } else { this.loadingService.hide(1000); }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
     
    closeDialog() {
        this.displayJobViewForm = false;
    }

    getCustomerAccount(id) {
        this.casa.getAllCustomerAccountByCustomerId(id).subscribe((response: any) => { 
            this.customerAccount = response.result; 
            },);
    }
}
