import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoanRecoveryPaymentPlanService } from '../../services/loan-recovery-paymentplan.service';

@Component({
  selector: 'app-loanrecoverypaymentplan',
  templateUrl: './loanrecoverypaymentplan.component.html',
})
export class LoanRecoveryPaymentPlanComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New LoanRecoveryPaymentPlan";
  loanRecoveryPaymentPlanForm: FormGroup;
  recoveries: any[];
  casas: any[];
  agents: any[];
  loanRecoveryPaymentPlans: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private LoanRecoveryPaymentPlanService: LoanRecoveryPaymentPlanService) { }

  ngOnInit() {
    this.getDistinctLoanRecoveryPaymentPlan();
    this.GetAllloanRecoveryPaymentPlan();
    this.clearControls();
   
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New LoanRecoveryPaymentPlan";
    this.displayAddModal = true;
  }

  getDistinctLoanRecoveryPaymentPlan(): void {
    this.loadingService.show();
    this.LoanRecoveryPaymentPlanService.getDistinctLoanRecoveryPaymentPlan().subscribe((response: any) => {
      this.recoveries = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  GetAllloanRecoveryPaymentPlan(): void {
    this.loadingService.show();
    this.LoanRecoveryPaymentPlanService.GetAllloanRecoveryPaymentPlan().subscribe((response: any) => {
      this.loanRecoveryPaymentPlans = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }



  getLoanRecoveryPamyentPlans(id): void {
    this.loadingService.show();
    this.LoanRecoveryPaymentPlanService.getLoanRecoveryPamyentPlans(id).subscribe((response: any) => {
      this.loanRecoveryPaymentPlans = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editLoanRecoveryPaymentPlan(index) {
    this.entityName = "Edit LoanRecoveryPaymentPlan";
    var row = this.loanRecoveryPaymentPlans[index];
    try {
      this.loanRecoveryPaymentPlanForm.controls['recoveryPaymentPlanId'].setValue(null);
    } catch (error) {
    }
    this.selectedId = row.recoveryPaymentPlanId;
    this.loanRecoveryPaymentPlanForm = this.fb.group({
      recoveryPlanId: [row.recoveryPlanId],
      paymentDate: [row.paymentDate],
      paymentAmount: [row.paymentAmount],
      recoveryPaymentPlanId: [row.recoveryPaymentPlanId],
      loanId: [row.loanId],
      
    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.LoanRecoveryPaymentPlanService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.GetAllloanRecoveryPaymentPlan();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.LoanRecoveryPaymentPlanService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.GetAllloanRecoveryPaymentPlan();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  clearControls() {
    this.selectedId = null;
    try {
      this.loanRecoveryPaymentPlanForm.controls['recoveryPaymentPlanId'].setValue(null);
    } catch (error) {
    }
    this.loanRecoveryPaymentPlanForm = this.fb.group({
      //recoveryPaymentPlanId: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      paymentDate: ['', Validators.required],
      recoveryPlanId: ['', Validators.required],
    });
  }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
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
