import { Component, OnInit, SimpleChanges, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../../setup/services';
import { LoanApplicationService } from '../../../services';

import { GlobalConfig } from '../../../../shared/constant/app.constant';
import swal, { SweetAlertType } from 'sweetalert2';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
    selector: 'fee-concession',
    templateUrl: 'product-fee-concession.component.html'
})

export class ProductFeeConcessionComponent implements OnInit {
    @Input() loanDetailId;
    feesDetails: any[];
    feesDetailForm: FormGroup
    allowForEdit: boolean = true;
    enableEdit: any;
    showFees: boolean = true;
    @Output() closeTab = new  EventEmitter<boolean>();
    constructor(private loanAppServ: LoanApplicationService,
        private fb: FormBuilder,
        private loadServ: LoadingService) { }

    ngOnInit() {
        this.InitfeesDetailForm();
       // this.getLoanApplicationFees();
    }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        this.getLoanApplicationFees(this.loanDetailId);
    }

    ClickDone() {
        this.closeTab.emit(true);       
    }
    getLoanApplicationFees(loanDetailId) {
        if (loanDetailId !== undefined) {
            this.loadServ.show();
            this.loanAppServ.getLoanApplicationFees(loanDetailId)
                .subscribe((res) => {
                    this.feesDetails = res.result;
                    this.loadServ.hide(2000);
                });
        }

    }

    updateFeeRate(item) {
        this.allowForEdit = false;

        this.updatefeesDetail(item);
    }

    updatefeesDetail(item) {
        this.enableEdit = true;
        this.feesDetailForm.patchValue({
            defaultfeeRateValue: item.defaultfeeRateValue,
            rate: item.rate,
            loanApplicationDetailId: item.loanApplicationDetailId,
            feeName: item.feeName,
            customerName: item.customerName,
            productName: item.productName,
            feeId: item.feeId
        });

    }
    saveRate() {
        this.enableEdit = true;
    }
    editRate() {
        this.enableEdit = false;
    }
    closeUpdate() {
        this.allowForEdit = true;
    }
    saveUpdate() {
        this.loadServ.show();
        this.loanAppServ.updateLoanApplicationFees(this.feesDetailForm.value)
            .subscribe((res) => {
                if (res.result) {
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.loadServ.hide(2000);
                    this.allowForEdit = true;
                } else {
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }

            }, (err) => {
                this.loadServ.hide(2000);
                this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'success');
            });
    }
    showMessage(title: string, message: string, messageType: SweetAlertType) {
        swal(title, message, messageType);
    }
    InitfeesDetailForm() {
        this.feesDetailForm = this.fb.group({
            defaultfeeRateValue: [],
            rate: [0, Validators.required],
            feeName: [],
            customerName: [],
            productName: [],
            feeId: [],
            loanApplicationDetailId: [],
            consessionReason: ['', Validators.required]
        })
    }
}