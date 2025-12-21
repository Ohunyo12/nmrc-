import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalStatus, RequestStatus, GlobalConfig, ApplicationStatus } from '../../../shared/constant/app.constant';
import { ProductService } from '../../../setup/services/product.service';
import { LoanService } from '../../services/loan.service';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';

import swal from 'sweetalert2';

@Component({
    templateUrl: 'rejected-application.component.html'
})

export class RejectedApplicationComponent implements OnInit {

    products: any[];
    applications: any[];
    displaySearchForm:boolean=false;
    searchForm: FormGroup;
    activeTabindex:any;
    
    constructor(
        private loadingService: LoadingService,
        private productService: ProductService,
        private loanService: LoanService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) { }
    
    ngOnInit() {
        this.clearControls();
        this.getRejectedApplications();
    }

    getRejectedApplications(): any { 
        this.loadingService.show();
        this.loanService.getRejectedApplicationsArchive().subscribe((response: any) => {
           // this.loanService.getRejectedApplications().subscribe((response: any) => {
            this.applications = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    commentForm: FormGroup;
    
    clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });
    }

    LoadDropdowns() {
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
    }

    forwardRequest(form) { 
        let body = {
            comment: form.value.comment,
            applicationId: this.application.loanApplicationId,
            applicationStatusId: this.application.applicationStatusId
        };
        this.loadingService.show();
        this.loanService.forwardReviewRequest(body).subscribe((response: any) => {
            
            this.loadingService.hide();
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/>' + response.result, 'success');
                this.getRejectedApplications();
                this.displayApplicationDetail=false;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    showSearchForm() { this.displaySearchForm = true; }

    onTabChange(obj){

    }

    submitForm(form) { 
        let body = {
            searchString: form.value.searchString
        };
        this.loadingService.show();
        this.loanService.loanApplicationSearch(body).subscribe((response: any) => {
            this.applications = response.result;
            this.loadingService.hide();
            this.displaySearchForm = false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    displayApplicationDetail: boolean = false;
    application: any = {};

    view(row) {
        this.clearControls();
        this.application = row;
        //console.log("i am here now "+JSON.stringify(this.application));
        this.displayApplicationDetail = true;
    }

    approvalStatus = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Processing' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Disapproved' },
        { id: 4, name: 'Authorised' },
        { id: 5, name: 'Referred' },
    ];
    
    getApprovalStatus(id) {
        let item = this.approvalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-info">FAM PROCESS</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">DISAPPROVED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
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
}
