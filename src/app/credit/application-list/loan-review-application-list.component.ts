import { Component, OnInit, Input, Output , EventEmitter, ViewChild } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { LoadingService } from '../../shared/services/loading.service';
import {  ApprovalStatusEnum, ProductClassProcessEnum } from '../../shared/constant/app.constant';
import { ApprovalStatus } from '../../shared/constant/app.constant';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { LazyLoadEvent } from 'primeng/primeng'; // lazyloading
import { AuthenticationService } from 'app/admin/services/authentication.service';

@Component({
    selector: 'loan-review-application-list',
    templateUrl: 'loan-review-application-list.component.html'
})
export class ReviewApplicationListComponent implements OnInit {
 
    @Input() operationId: number; 
    @Input() isCRMS = false; 
    @Input() selectable: boolean = true;
    @Output() selectedApplication: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedApplicationDetails: EventEmitter<any> = new EventEmitter<any>();

    // Input('value')
    // set value(val: string) {
    //   this._value = val;
    // }

    private _reload: number;
    disableLoadTemplateForPMU: boolean = false;
    @Input() set reload(value: number) {
        this._reload = value;
        if (value > 0) this.getLoanApplications(0, this.currentLazyLoadEvent.rows);
    }
    @Input('availment') availment: boolean = false;
    @Input('loanReviewApplicationId') loanReviewApplicationId: number;
    @Input('isDrawdown') isDrawdown: boolean;
    
    filteredProductClassId: number = null;
    productPrograms: any[] = [];
    errorMessage: string = '';
    searchString: string = '';
    searching: boolean = false;
    userInfo: any;

    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    submittedForAppraisal: boolean = true;
    applicationSelection: any = {}; // selection
    applications: any[] = [];
    username: string;
    systemDate: Date;
    referredId: number;
    productProgramClassProcessId: number = ProductClassProcessEnum.CreditProgram;

    constructor( 
        private fb: FormBuilder, 
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private authService: AuthenticationService,

    ) { }

    ngOnInit() { 
        //this.loadDropdowns();
        this.userInfo = this.authService.getUserInfo();
        this.systemDate = this.userInfo.applicationDate;
        this.username = this.userInfo.userName;
        this.referredId = ApprovalStatusEnum.Referred;
        //this.loadProductPrograms();

    }

    currentLazyLoadEvent: LazyLoadEvent;

    loadData(event: LazyLoadEvent) {
        this.getLoanApplications(event.first, event.rows);
        this.currentLazyLoadEvent = event;
    }
    
    loadDropdowns() {
        if (this.operationId == 6) this.loadProductPrograms();
    }

    loadProductPrograms() {
        this.camService.getProductPrograms().subscribe((response: any) => { // make refreshable
            this.productPrograms = response.result;
        }); 
    }
 
    getLoanApplications( 
            page: number, 
            itemsPerPage: number, 
            classId: number = this.filteredProductClassId, 
            search: boolean = false
        ) {
        if (search == false) { this.searchString = ''; this.searching = false; } else { this.searching = true; }
        this.loadingService.show();
        this.showLoadIcon = true; 
        if(this.isDrawdown === true && this.searchString != null && this.searchString != undefined){
            this.camService.getReviewDrawdown(page, itemsPerPage, this.operationId, classId, this.searchString).subscribe((response: any) => {
                this.itemTotal = response.count;
               
                this.applications = response.result; 
                this.showLoadIcon = false;
                this.applicationSelection = [];
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000); 
            });
        }
        else if(this.operationId == 48 && this.searchString != null && this.searchString != undefined){
            if(this.isCRMS ){
                this.camService.getReviewAvailmentForCRMS(page, itemsPerPage, this.operationId, classId, this.searchString).subscribe((response: any) => {
                    this.itemTotal = response.count; 
                    this.applications = response.result; 
                   // console.log("I am here "+JSON.stringify( this.applications ));
                    this.showLoadIcon = false;
                    this.applicationSelection = [];
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000); 
                });
            }
            else{
                this.camService.getReviewAvailment(page, itemsPerPage, this.operationId, classId, this.searchString).subscribe((response: any) => {
                    this.itemTotal = response.count; 
                    this.applications = response.result; 
                   // console.log("I am here "+JSON.stringify( this.applications ));
                    this.showLoadIcon = false;
                    this.applicationSelection = [];
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000); 
                });
            }
        }
        else if(this.operationId != 48 && this.searchString != null && this.searchString != undefined){
                this.camService.getReviewApplications(page, itemsPerPage, this.operationId, classId, this.searchString).subscribe((response: any) => {
                    this.itemTotal = response.count; 
                    this.applications = response.result; 
                   //console.log("I am here "+JSON.stringify( this.applications ));
                    this.showLoadIcon = false;
                    this.applicationSelection = [];
                    this.loadingService.hide();
                }, (err) => {
                    this.loadingService.hide(1000); 
                });
            
        }
        
    }

    mappedApplicationDetails:any;
    onSelectedApplicationChangeMapping()
    { //console.log('applicationSelection',this.applicationSelection);
    //     if(this.isDrawdown === true){
    //         this.camService.getReviewDrawdown().subscribe((response: any) => {
    //             this.applicationSelection = response.result; 
    //             this.loadingService.hide();
    //             this.mapOnChange()
    //         }, (err) => {
    //             this.loadingService.hide(1000); 
    //         });
    //     }
    //     else if(this.operationId == 48){
    //         if(this.isCRMS){
    //             this.camService.getReviewAvailmentForCRMS().subscribe((response: any) => {
    //                 this.applicationSelection = response.result; 
    //                 this.loadingService.hide();
    //                 this.mapOnChange()
    //             }, (err) => {
    //                 this.loadingService.hide(1000); 
    //             });
    //         }
    //         else{
    //             this.camService.getReviewAvailment().subscribe((response: any) => {
    //                 this.applicationSelection = response.result; 
    //                 this.loadingService.hide();
    //                 this.mapOnChange()
    //             }, (err) => {
    //                 this.loadingService.hide(1000); 
    //             });
    //         }
    //     }
    //    else 
        if(this.operationId != 48){
                this.camService.getReviewApplicationsByID(this.applicationSelection.lmsApplicationId).subscribe((response: any) => {
                    if(response.success){
                        this.applicationSelection.applicationDetails = response.result; 
                        //console.log('applicationDetails after',this.applicationSelection.applicationDetails);
                        let mappedDetails = this.applicationSelection.applicationDetails.map(x => { return {
                            loanApplicationDetailId: x.detailId,
                            approvedProductName: x.loanSystemTypeName, // looan id needed!
                            obligorName: x.obligorName + ' - ' + x.operationName,
                            loanId: x.loanId,
                            customerId: x.customerId,
                            currencyId: x.currencyId,
                            proposedTenor: x.proposedTenor,
                            proposedRate: x.proposedRate,
                            proposedAmount: x.proposedAmount,
                            approvedTenor: x.approvedTenor,
                            approvedRate: x.approvedRate,
                            approvedAmount: x.approvedAmount,
                            proposedTenorString: x.proposedTenorString,
                            loanSystemTypeId: x.loanSystemTypeId,
                            customerProposedAmount: x.customerProposedAmount,
                            statusId: x.statusId,
                            terms: x.terms,
                            schedule: x.schedule,
                            loanApplicationId: x.loanApplicationId,
                            operationName: this.applicationSelection.operationTypeName,
                            reviewDetails: x.reviewDetails,
                            accountName: x.accountName,
                            accountNumber: x.accountNumber,
                            creditAppraisalLoanApplicationId: x.creditAppraisalLoanApplicationId,
                            creditAppraisalOperationId: x.creditAppraisalOperationId,
                            lmsApplicationId: x.lmsApplicationId,
                            lmsOperationId: x.lmsOperationId,
                        }}); //console.log('mappedDetails',mappedDetails);
                        this.applicationSelection.applicationDetails = mappedDetails;
                        this.selectedApplication.emit(this.applicationSelection);
                        this.selectedApplicationDetails.emit(mappedDetails);
                    }
                    
                    this.loadingService.hide();
                    //this.mapOnChange()
                }, (err) => {
                    this.loadingService.hide(1000); 
                });
            
         }
    }

    
    enablecomponentDataLoad: boolean;
    //mapOnChange(): void {    
    onSelectedApplicationChange  (): void {   
        if( this.applicationSelection.applicationDetails == null) {
        this.onSelectedApplicationChangeMapping();
        }
        else{
            let mappedDetails = this.applicationSelection.applicationDetails.map(x => { return {
                loanApplicationDetailId: x.detailId,
                approvedProductName: x.loanSystemTypeName, // looan id needed!
                obligorName: x.obligorName + ' - ' + x.operationName,
                loanId: x.loanId,
                customerId: x.customerId,
                currencyId: x.currencyId,
                proposedTenor: x.proposedTenor,
                proposedRate: x.proposedRate,
                proposedAmount: x.proposedAmount,
                approvedTenor: x.approvedTenor,
                approvedRate: x.approvedRate,
                approvedAmount: x.approvedAmount,
                proposedTenorString: x.proposedTenorString,
                loanSystemTypeId: x.loanSystemTypeId,
                customerProposedAmount: x.customerProposedAmount,
                statusId: x.statusId,
                terms: x.terms,
                schedule: x.schedule,
                loanApplicationId: x.loanApplicationId,
                operationName: this.applicationSelection.operationTypeName,
                reviewDetails: x.reviewDetails,
                accountName: x.accountName,
                accountNumber: x.accountNumber,
                creditAppraisalLoanApplicationId: x.creditAppraisalLoanApplicationId,
                creditAppraisalOperationId: x.creditAppraisalOperationId,
                lmsApplicationId: x.lmsApplicationId,
                lmsOperationId: x.lmsOperationId,
            }}); //console.log('mappedDetails',mappedDetails);
            this.applicationSelection.applicationDetails = mappedDetails;
            this.selectedApplication.emit(this.applicationSelection);
            this.selectedApplicationDetails.emit(mappedDetails);
        }

        this.enablecomponentDataLoad =true;
    }
/*  {
    "operationTypeId": 0,
    "reviewDetails": "gsdjjfd",
    "loanId": 6989,
    "customerId": 142,
    "detailId": 194,
    "loanSystemTypeId": 1,
    "operationId": 19,
    "loanSystemTypeName": "Term/Disbursed Facility",
    "operationName": "Contractual Interest Rate Change",
    "productId": 55,
    "obligorName": "DOKO  OTONYE",

    "proposedTenor": 107,
    "proposedRate": 40,
    "proposedAmount": 10000000,

    "approvedTenor": 107,
    "approvedRate": 40,
    "approvedAmount": 10000000
  }
] */
    // ---------------------- product papers ----------------------

    filteredProductClass: string = null;
    isProductProgram: boolean = false;

    filterByProductClass(classId, className) {
        this.filteredProductClass = className;
        this.filteredProductClassId = classId;
        this.getLoanApplications(0, this.currentLazyLoadEvent.rows, classId);
    }


    reset() {
        this.filteredProductClass = null;
        this.filteredProductClassId = null; // MUST RUN BEFORE getLoanApplications()
        this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list
        this.loadProductPrograms();
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            let processLabel = 'PROCESSING';
            if (approvalStatus == ApprovalStatus.PENDING)
                return '<span class="label label-info"> PENDING </span>';
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    getApplicationStatus2(approvalStatus) {
        if (approvalStatus != "") {
            let processLabel = 'PROCESSING';
            if (approvalStatus == "Pending")
                return '<span class="label label-warning"> PENDING </span>';
            if (approvalStatus == "Processing")
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == "Authorised")
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == "Referred")
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == "Approved")
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == "Disapproved")
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

}