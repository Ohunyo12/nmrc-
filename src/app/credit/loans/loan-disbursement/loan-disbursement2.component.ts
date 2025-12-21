import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-loan-disbursement2',
  templateUrl: './loan-disbursement2.component.html',
})
export class LoanDisbursement2Component implements OnInit {
  loanDisbursementForm: FormGroup;
  disbursedLoanList: any[] = [];
  displayLoanDisbursementForm: boolean = false;
  @Input('termLoanId') termLoanId: number;
  entityName: string;
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private loanService: LoanService) { }

  ngOnInit() {
    this.initializeControl();
    this.getAllLoanDisbursement(this.termLoanId);
  }
  getAllLoanDisbursement(loanId) {
    this.loanService.getLoanDisbursement(loanId).subscribe((response: any) => {
      this.disbursedLoanList = response.result;
    });
  }
  initializeControl() {
    this.loanDisbursementForm = this.fb.group({
      loanDisbursementId: [''],
      termLoanId: [''],
      accountNumber: [''],
      amountDisbursed: [''],
    });
  }
  showLoanDisbursementForm() {
    this.initializeControl();
    this.displayLoanDisbursementForm = true;
    this.entityName = "Add New Loan Disbursement";
  }
  submitLoanDisbursement(formObj) {
    let body = formObj.value;
    this.loadingService.show();
    this.loanService.addUpdateLoanDisbursement(body).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        this.displayLoanDisbursementForm = false;
        this.getAllLoanDisbursement(this.termLoanId);
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }
}
