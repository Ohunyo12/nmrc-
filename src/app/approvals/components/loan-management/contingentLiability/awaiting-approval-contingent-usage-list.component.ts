import { Component, OnInit } from '@angular/core';
import { ContingentLoanService } from '../../../../credit/loans/contingent-usage/contingentloan.service';
import { IContingentLoan } from '../../../../credit/loans/contingent-usage/contingentloan.interface';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CurrencyService } from '../../../../setup/services';
import { ConvertString, GlobalConfig } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';


@Component({
    selector: 'contingent-usage-approval',
    templateUrl: 'awaiting-approval-contingent-usage-list.component.html'
})

export class ContingentUsageAwaitingApprovalComponent implements OnInit {
    loanSystemTypeId: number;


    contingentData: any[] = [];
    selectedContingentData: any;
    disableApprovalTab: boolean = false;
    activeTabindex: number = 0;
    errorMessage: string = '';
    loanId: number;
    reload: number = 0;
    showUploadForm: boolean = false;
    deleteLink: boolean = false;
    loanApplicationNumber: string;

    constructor(
        private loadingService: LoadingService,
        private service: ContingentLoanService,
        private currencyService: CurrencyService,
        private loadingSrv: LoadingService,
    ) { }

    ngOnInit() {
        this.loadList();

    }

    loadList() {

        this.service.getApprovalsContingentLoan().subscribe((response: any) => {
            this.contingentData = response.result;


            this.loadingSrv.hide();

        });
    }

    onRowSelect(row) {
       this.disableApprovalTab = true;
       this.selectedContingentData = row.data;
       this.loanId = this.selectedContingentData.contingentLoanId;
       this.loanSystemTypeId = this.selectedContingentData.loanSystemTypeId;
       this.reload++;
       this.loanApplicationNumber = this.selectedContingentData.loanApplicationNumber;
        this.activeTabindex = 1
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onTabChange(e) {
      
        this.activeTabindex = e.index;
        if (e.index == 0) {
            this.comment = '';
            this.disableApprovalTab = false;
        }
    }
    closeForm() {
        this.disableApprovalTab = false
        this.loadList();
    }

    // -------------------------- new -----------------------

    comment: string = '';
    allowedCurrencies: any[] = [];

    onSubmit(approvalStatusId) {
        this.loadingSrv.show();

        
        const cd = this.selectedContingentData;
        const body = {
            comment: this.comment,
            targetId: cd.contingentLoanUsageId,
            amountRequested: cd.amountRequested, //cd.exchangeAmount,
            loanReferenceNumber: cd.loanReferenceNumber,
            productName: cd.productName,
            productId: cd.productId,
            approvalStatusId: approvalStatusId
        };
        this.service.getApproveContingentLoanUsage(body).subscribe((response: any) => {
            if (response.success == false) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.loadingSrv.hide()
            } else {
                this.closeForm();
                this.loadingSrv.hide()
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Successs', 'success');
            }
        }, (err: any) => {
            
        });
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.allowedCurrencies = res.result;
        });
    }

    setCurrency(exchangeRate: string, exchangeAmount: number, IsBaseCurrency: boolean): void {

    }


}