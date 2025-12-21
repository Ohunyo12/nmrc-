import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import { ApprovalStatus, GlobalConfig } from '../../../../shared/constant/app.constant';
import { LazyLoadEvent } from 'primeng/primeng';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
    selector: 'app-name',
    templateUrl: './loan-applications.list.component.html',
    // styleUrls: ['./name.component.scss']
})
export class LoanApplicationsListComponent implements OnInit {

    applications: any[]; 
    showLoadIcon: boolean = false;
    itemTotal: number = 0; 
    application: any[];
    applicationReferenceNumber:any;
    
    constructor(
        private router: Router,
        private loadingService: LoadingService, 
        private loanApplService: LoanApplicationService,
        private loanApplicationService: LoanApplicationService
    ) { }

    ngOnInit() {
        this.getLoanApplicationsList();
    }

    getLoanApplicationsList() {
        this.loadingService.show();
        this.loanApplicationService.getLoanApplicationList().subscribe((response: any) => {
            this.applications = response.result;
            this.loadingService.hide();
        }, (err) => {
        });
    }

    onRowSelect(event) {
        this.router.navigate(['/credit/loan/loan-eligibility-requirement', event.data.loanApplicationId]);
    }

    // getLoanApplicationsList(page: number, itemsPerPage: number) {
    //     this.loadingService.show();
    //     this.showLoadIcon = true;
    //     this.loanApplicationService.getLoanApplicationList(page, itemsPerPage).subscribe((response: any) => {
    //         this.itemTotal = response.count;
    //         this.applications = response.result;
    //         this.showLoadIcon = false;
    //         this.loadingService.hide();
    //         ////console.log('applications..', response);
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //         ////console.log("error", err);
    //     });
    // }

    // currentLazyLoadEvent: LazyLoadEvent;

    //     loadData(event: LazyLoadEvent) {
    //         this.getLoanApplicationsList(event.first, event.rows);
    //         this.currentLazyLoadEvent = event;
    //     }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">Documentation</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">DIS</span>';
        }
        return '<span class="label label-warning">NEW</span>';
    }

    deleteLoanApplication(row){
        const __this = this;

        swal({
            title: 'Sure?',
            text: 'This PERMANENTLY deletes this Loan and You WON\'T be able to revert this!',
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

            __this.loanApplService.deleteLoanApplication(row.loanApplicationId).subscribe((res) => {
                if (res.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, res.message, 'success');
                    __this.getLoanApplicationsList();
                    ; // refresh
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

    editLoanApplication(row) {
        // console.log("test: ", row);
       const formObj = {
            loanApplicationId: row.loanApplicationId,
            customerId: row.customerId,
            customerName: row.customerName,
            customerCode: row.customerCode,
            productClassProcessId: row.productClassProcessId,
            productClassId: row.productClassId,
            loanAmount: row.applicationAmount,// row.loanAmount,
            loanTypeId: row.loanTypeId,
            relationshipManagerId: row.relationshipManagerId,
            relationshipOfficerId: row.relationshipOfficerId,
            // companyDirectors: this.companyDirectors,
            // companyShareholders: this.companyShareholders,
            // companyBvnInformation: this.companyBvnInformation,
            penCode: '',
            penId: row.preliminaryEvaluationId,
            customerGroupId: row.customerGroupId,
            customerGroupName: row.customerGroupName,
            // customerGroupCode: this.selectedGroup.customerGroupCode,
            customerTypeId: row.customerTypeId,
            regionId: row.regionId,
            requireCollateralTypeId: row.requireCollateralTypeId,
            collateralDetail: row.collateralDetail,
            loanInformation: row.loanInformation,
            loantermSheetId: row.loantermSheetId,
            ownershipStructure: row.ownershipStructure,
            loansWithOthers: row.loansWithOthers,
            isAdHocApplication: row.isAdHocApplication,
            approvedLimitId: row.approvedLimitId,
            isEmployerRelated: row.isEmployerRelated,
            relatedEmployerId: row.relatedEmployerId
            // accountNumber: form.value.accountNumber,
            // taxIdentificationNumber: form.value.taxIdentificationNumber,
            // registrationNumber: form.value.registrationNumber,
            // existingExposure: form.value.existingExposure,
            // customerTopClients: this.customerTopClients,
            // customerTopSuppliers: this.customerTopSuppliers,
            // customerGroupMappings: this.customerGroupMappings,
            // editMode: true,
        };
      
        // let store = JSON.parse(sessionStorage.getItem('customer-loan-details'));
        ////console.log('check store variable', store);

        // if (store == null) {
        //     store = [];
        //     sessionStorage.setItem('customer-loan-details', JSON.stringify(store));
        //     ////console.log('new store variable', store);
        // }

        // store.push(formObj);
        // // const store = [];
        ////console.log('customer-loan-details b4 save', formObj);
        sessionStorage.setItem('applicationreferencenumber', row.applicationReferenceNumber);
        sessionStorage.setItem('customer-loan-details', JSON.stringify(formObj));

        this.router.navigate(['/credit/newloan/application']);
        
        // this.router.navigate(['/credit/newloan/application', row.loanApplicationId]);
    }

}