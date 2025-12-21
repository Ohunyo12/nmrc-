import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeeConcessionService } from '../../../../credit/services/fee-concession.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { ConvertString } from '../../../../shared/constant/app.constant';
import { LoanReviewApplicationService } from '../../../../credit/services/loan-review-application.service';
import { LoanApplicationService } from '../../../../credit/services/loan-application.service';


@Component({
    selector: 'reasign',
    templateUrl: 'approve-reasign.component.html'
})

export class ApproveReasignedAccountComponent implements OnInit {
    dataList: any[] = []; selectedData: any[] = []; runningLoansForm: FormGroup; displaydata: boolean = false;
    officers: any; displayEffectiveDate: Date; staffAccountHistoryId: number;   targetId: number;
    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private reviewService: LoanReviewApplicationService, private loanAppService: LoanApplicationService,
        private genSetupService: GeneralSetupService, private ApprovalService: ApprovalService) { }

    ngOnInit() {
        this.IniRunningLoans();
        this.getAllApprovalStatus();
        this.loanAppService.getOfficers().subscribe((res) => { this.officers = res.result; });
        this.ApprovalService.getReasignedAccount().subscribe((res) => {
            this.dataList = res.result;
        });
    }
    backToSearch() {
        this.displaydata = false;
    }
    selectedloanSystemTypeId:any;
    newRMStaffId:any;
    onRowSelect(event) {
        this.staffAccountHistoryId = event.staffAccountHistoryId;
        this.selectedloanSystemTypeId =  event.accountTypeId;
        this.targetId = event.targetId;
        this.newRMStaffId = event.newRMStaffId;
        const data = {
            targetId: event.targetId,
            staffAccountHistoryId: event.staffAccountHistoryId,
            loanSystemTypeId : event.accountTypeId,
          
        }
        this.reviewService.getSelectedReasignedAccount(data).subscribe((res) => {

            const row = res.result;
            if (row != null) {
                this.runningLoansForm.patchValue({
                    loanReferenceNumber: row.loanReferenceNumber,
                    approvedAmount: ConvertString.ToNumberFormate(row.approvedAmount),
                    outstandingPrincipal: ConvertString.ToNumberFormate(row.outstandingPrincipal),
                    interestRate: row.interestRate,
                    equityContribution: row.equityContribution,
                    effectiveDate: new Date(row.effectiveDate),
                    maintainTenor: true,
                    maturityDate: new Date(row.maturityDate),
                    accrualedAmount: ConvertString.ToNumberFormate(row.accrualedAmount),
                    scheduleTypeId: row.scheduleTypeId,
                    newtenor: row.newtenor,
                    teno: row.teno,
                    scheduleTypeCategoryId: row.scheduleTypeCategoryId,
                    totalAmount: ConvertString.ToNumberFormate(row.totalAmount),
                    previousEffectiveDate: new Date(row.previousEffectiveDate),
                    pastDueTotal: ConvertString.ToNumberFormate(row.pastDueTotal),
                    currency: row.currency,
                    relationshipManagerName: this.GetstaffName(row.relationshipManagerId),
                    relationshipOfficerName: this.GetstaffName(row.relationshipOfficerId),
                    //productTypeId: row.productTypeId,
                    loanId: row.loanId,
                    currentRMStaffId: row.relationshipOfficerId,
                    reasonForChange: row.reasonForChange,
                    newRMStaffName: row.newRMStaffName,
                    startDate: row.endDate,
                });
            }
        });


        this.displaydata = true;
    }
    selectItemWithButton(event) {
    }
    approvalStatus: any[];

    getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            const tempData = response.result;

            this.approvalStatus = tempData.slice(2, 4);
        });
    }


    IniRunningLoans() {
        this.runningLoansForm = this.fb.group({
            approvedAmount: [''],
            loanReferenceNumber: [''],
            outstandingPrincipal: [''],
            interestRate: [''],
            equityContribution: [''],
            effectiveDate: [''],
            maturityDate: [''],
            accrualedAmount: [''],
            scheduleTypeId: [''],
            teno: [''],
            newtenor: [''],
            scheduleTypeCategoryId: [0],
            totalAmount: [0],
            previousEffectiveDate: [''],
            maintainTenor: [true],
            currency: [''],
            pastDueTotal: [0],
            relationshipManagerName: ['', Validators.required],
            relationshipOfficerName: ['', Validators.required],
            newRMStaffId: '',
            currentRMStaffId: '',
            effectFrom: '',
            reasonForChange: [''],
            //productTypeId: ['', Validators.required],
            loanId: [''],
            newRMStaffName: [''],
            startDate: [''],


            approvalStatusId: ['', Validators.required],
            comment: ['', Validators.required],
        });
    }
    close() {
        this.displaydata = false;
    }

    submitForm() {
        this.loadingService.show();
        const data = this.runningLoansForm.value;
        const body = {
            targetId: this.targetId,
            staffAccountHistoryId: this.staffAccountHistoryId,
            loanSystemTypeId : this.selectedloanSystemTypeId,
            approvalStatusId: data.approvalStatusId,
            comment: data.comment,
            newRMStaffId:this.newRMStaffId,
        }
        
        this.reviewService.approveReasignAccount(data).subscribe((res)=> {
            if(res.result){
               this.loadingService.hide(200);
               //swal(`${GlobalConfig.APPLICATION_NAME}`,`Operation successful` , 'success');  
            }
        },(err)=> {
            this.loadingService.hide(200);
            
            //swal(`${GlobalConfig.APPLICATION_NAME}`,`Operation was unsuccessful` , 'error');
        })
    }

    GetstaffName(managerId): string {
        // tslint:disable-next-line:radix
        return this.officers.find(x => x.staffId === parseInt(managerId)).fullName;
    }
}