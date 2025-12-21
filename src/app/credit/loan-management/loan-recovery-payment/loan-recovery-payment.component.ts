import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoanRecoveryPaymentPlanService } from 'app/credit/services/loan-recovery-paymentplan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanPrepaymentService } from 'app/credit/services/loan-prepayment.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-recovery-payment',
  templateUrl: './loan-recovery-payment.component.html',
  // styleUrls: ['./loan-recovery-payment.component.scss']
})
export class LoanRecoveryPaymentComponent implements OnInit, OnDestroy {

  searchValue: any;
  loans: any;
  repaymentSchedule: any;
  displaySchedule: boolean = false;
  showRepaymentInfo: boolean = true;
  showRepaymentInput: boolean = false;
  repaymentForm: FormGroup;
  referenceNumber: any;
  whitenOfDetail: any;
  totalScheduleAmount: any;
  loanReviewOperationId: any;
  totalAmountPaid: number;
  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  constructor(private LoanRecoveryService: LoanRecoveryPaymentPlanService,
    private loadingSrv: LoadingService,
    private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService) { }

  ngOnInit() {
    this.getLoans();
    this.initailizeForm();
  }

  getLoans() {
    this.loadingSrv.show();
    this.subscriptions.add(
    this.LoanRecoveryService.getLoanRecoverySearch(this.searchValue).subscribe((response: any) => {
      this.loans = response.result
     


      this.loadingSrv.hide();
    }, (error) => {
      this.loadingSrv.hide();
      ////console.log("error", error);
    }));
  }

  onTabChange(e){

  }

  onSelectedLoan(row) {
    this.loadingSrv.show();
    this.loanReviewOperationId = row.data.loanReviewOperationId;
    this.referenceNumber = row.data.loanReferenceNumber;
    this.subscriptions.add(
    this.LoanRecoveryService.getLoanRecoverySchedule(this.loanReviewOperationId).subscribe((response: any) => {
      this.repaymentSchedule = response.result

     
      let amount = 0;
      if(this.repaymentSchedule!=null){
      this.repaymentSchedule.forEach(x => amount += x.paymentAmount);
      }

      this.totalAmountPaid = amount;
      
      this.getRecoveryAmountPaid();

      this.displaySchedule = true;

      this.loadingSrv.hide();
    }, (error) => {
      this.loadingSrv.hide();
    }));
  }


  initailizeForm() {
    this.repaymentForm = this.fb.group({
      paymentDate: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      writtenOffAmount: [''],
      totalAmountPaid:['']
    });

  }

  submitForm() {
    this.repaymentForm.controls['writtenOffAmount'].setValue(this.totalScheduleAmount);
    this.repaymentForm.controls['totalAmountPaid'].setValue(this.totalAmountPaid);

    this.showRepaymentInfo = false;
    this.showRepaymentInput = true;
    this.displaySchedule = false;

  }

 
  getRecoveryAmountPaid(){
    this.subscriptions.add(this.LoanRecoveryService.getAmountPaid(this.loanReviewOperationId).subscribe((response: any) => {
      this.totalScheduleAmount = response.result.paymentAmount;
      this.loadingSrv.hide();
    }, (error) => {
      this.loadingSrv.hide();
    }));
  }

  SaveRecovery(form) {

    let amountpaid = +this.totalAmountPaid + (+form.value.paymentAmount);
   // console.log('amountpaid',amountpaid);
    
    let writenoffAmount = +form.value.writtenOffAmount;
   // console.log('writenoffAmount',writenoffAmount);
    

    if(amountpaid > writenoffAmount){
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Amount paid is greater than writenoff amount', 'error');
    }

    let __this=this;

    swal({
      title: 'Are you sure?',
      text: 'This action cannot be revert. Are you sure you want to proceed?',
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

    __this.loadingSrv.show();

    let data = {
      paymentAmount: form.value.paymentAmount,
      paymentDate:form.value.paymentDate,
      loanReviewOperationId:__this.loanReviewOperationId
    }
    this.subscriptions.add(
    __this.LoanRecoveryService.addLaonRecoveryPayment(data).subscribe((response: any) => {
      if(response.success==true){
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully', 'success');
        this.this.activeSearchTabindex =0;
      }else{
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        this.this.activeSearchTabindex =0;
      }
      __this.loadingSrv.hide();
    }, (error) => {
      __this.loadingSrv.hide();
      ////console.log("error", error);
    }));
      //   __this.displayModalForm = true;
  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });

    
  }
}
