import { Component, OnInit,Output, Input, EventEmitter } from '@angular/core'; 
import {   FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CurrencyService } from '../../../../setup/services';
import { LoanApplicationService } from '../../../../credit/services';
import { ConvertString, GlobalConfig } from '../../../../shared/constant/app.constant';
import { LoadingService } from '../../../../shared/services/loading.service'; 
import { ContingentLoanService } from '../../../../credit/loans/contingent-usage/contingentloan.service';
import swal from 'sweetalert2';
import { IContingentLoan } from '../../../../credit/loans/contingent-usage/contingentloan.interface';
@Component({
    selector: 'contingent-approval',
    templateUrl: 'awaiting-approval-contingent-usage.component.html'
})

export class ContingentUsageApprovalComponent implements OnInit {
    allowedCurrencies: any[] = [];
    formData: FormGroup;
    exchangeValue: number;
    exchange: any = {};
    IsBaseCurrency: boolean;
    exchangeRate: any;
    comment: string = '';

   @Input() selectedContingentData: IContingentLoan;
   @Output() closeWindow = new EventEmitter<boolean>();
   
    constructor(private service: ContingentLoanService, private fb: FormBuilder, 
        private loadingSrv: LoadingService,
        private currencyService: CurrencyService, private loanAppService: LoanApplicationService) { }

    ngOnInit() { 
        this.InitForm();
        this.getAllCurrencies() ;
    }

    onSubmit(approvalStatusId) {
        this.loadingSrv.show();
        const cd = this.formData.value;
        const body = {
            comment: this.comment,
            targetId: this.selectedContingentData.contingentLoanUsageId,
            amountRequested: cd.exchangeAmount,
            loanReferenceNumber: cd.loanReferenceNumber,
            productName: cd.productName,
            productId: cd.productId,
            approvalStatusId: approvalStatusId
        };

        this.closeDataForm();

        this.service.getApproveContingentLoanUsage(body).subscribe((response: any) => {
            if (response.result) {
                this.closeDataForm();
                this.loadingSrv.hide(200)
            }
        });
    }

    isFacilityUsedUp(): boolean {
        const newAmount: number = ConvertString.TO_NUMBER(this.formData.value.amountRequuested);
        const totalUsage: number = ConvertString.TO_NUMBER (this.selectedContingentData.requestedAmount) +  newAmount ;
        if (totalUsage > ConvertString.TO_NUMBER (this.selectedContingentData.facilityAmount))
            return true
        return false
    }

    closeDataForm(){
        this.closeWindow.emit(true);
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.allowedCurrencies = res.result;
        });
    }

    getExchangeRate( ) {
        if(this.isFacilityUsedUp()){
            this.formData.get('amountRequuested').setValue(0);
            this.exchangeValue =0;
            this.setCurrency('', 0, this.IsBaseCurrency)
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approved Amount Exceeded', 'warning');
        return;
        }
        const id = this.selectedContingentData.currencyId
        if(id != undefined || id != null)
        this.exchangeValue = 0;
        
        this.loanAppService.getExchangeRate(+id)
            .subscribe((res) => {
                this.exchange = res.result;
                if (this.exchange !== undefined && this.exchange.sellingRate!== undefined ) {
                    const principalAmount: number = ConvertString.TO_NUMBER(this.formData.value.amountRequuested);

                    this.exchangeValue = +principalAmount *  this.exchange.sellingRate;
                    this.IsBaseCurrency = this.exchange.isBaseCurrency;
                    this.setCurrency(this.exchange.sellingRate, this.exchangeValue, this.IsBaseCurrency)
                    if (this.IsBaseCurrency) {
                        this.exchangeRate = "N/A";
                    }
                }

            }, (err) => {
                this.loadingSrv.hide();
            });
    }
    setCurrency(exchangeRate: string, exchangeAmount: number, IsBaseCurrency: boolean): void {
        this.formData.patchValue({
            exchangeRate: exchangeRate,
            exchangeAmount: exchangeAmount
        });
    }
    InitForm(){
        const cd: IContingentLoan = this.selectedContingentData;
        this.formData = this.fb.group({            
            contingentLoanId:[cd.contingentLoanId, Validators.required],            
            amountRequested:[cd.requestedAmount, Validators.required],    
            loanReferenceNumber:[cd.loanReferenceNumber, Validators.required],   
            productName:[cd.productName, Validators.required],
            currencyId:[cd.currencyId, Validators.required],
            exchangeRate: [0, Validators.required],
            exchangeAmount: [0, Validators.required],
            productId: [cd.productId]
        })
    }


}