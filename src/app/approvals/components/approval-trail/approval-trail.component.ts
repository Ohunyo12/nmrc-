import { LoadingService } from '../../../shared/services/loading.service';
import { StaffService } from '../../../admin/services/staff.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ApprovalService } from '../../../setup/services/approval.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'approval-trail.component.html'
})

export class ApprovalTrailComponent implements OnInit {

    approvalWorkflowData: any[];
    selectedRecord: any = {};
    displayDetailsModal = false;

    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    currentLazyLoadEvent: LazyLoadEvent;

    constructor(private loadingService: LoadingService,
        private approvalService: ApprovalService
    ) { }

    ngOnInit() {
        this.loadingService.show();

    }

    loadData(event: LazyLoadEvent) {
        this.getApprovalTrailRecords(event.first, (event.first + event.rows));
        this.currentLazyLoadEvent = event;
    }

    getApprovalTrailRecords(page: number, itemsPerPage: number) {
        this.loadingService.show();
        // this.showLoadIcon = true;
        this.approvalService.GetAllRecordsOnApprovalTrail(page, itemsPerPage).subscribe((response: any) => {
            this.approvalWorkflowData = response.result;
            this.itemTotal = response.count;
            // this.showLoadIcon = false;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    viewApprovalTrailDetail(index, evt) {
        this.selectedRecord = index;

        this.displayDetailsModal = true;
    }


    
}