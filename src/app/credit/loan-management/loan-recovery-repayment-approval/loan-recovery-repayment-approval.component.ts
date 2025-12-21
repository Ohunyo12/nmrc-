import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoanRecoveryPaymentPlanService } from 'app/credit/services/loan-recovery-paymentplan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { AuthorizationService } from 'app/admin/services/authorization.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-recovery-repayment-approval',
  templateUrl: './loan-recovery-repayment-approval.component.html',
 // styleUrls: ['./loan-recovery-repayment-approval.component.scss']
})
export class LoanRecoveryRepaymentApprovalComponent implements OnInit, OnDestroy {
  repaymentData: any;
  selectedContingentData: any;
  activeSearchTabindex: number=0;
  displayTwoFactorAuth: boolean;
  twoFactorAuthStaffCode: string = null;
  twoFactorAuthPassCode: string = null;
  approvalStatusId: any;
  comment: any;
  userSpecific: boolean;
  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
  constructor(private LoanRecoveryService: LoanRecoveryPaymentPlanService,
    private loadingSrv: LoadingService,
    private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.getRepaymentList();
  }


  getRepaymentList(){
    this.loadingSrv.show();
    this.subscriptions.add(
    this.LoanRecoveryService.getLoanRecoveryList().subscribe((response: any) => {
      this.repaymentData = response.result
      this.loadingSrv.hide();
    }, (error) => {
      this.loadingSrv.hide();
    }));
  }

  selectRecordSelection(row){
    this.selectedContingentData = row;
    this.activeSearchTabindex = 1;
  }

  onTabChange(e) {
    this.activeSearchTabindex = e.index;
     
 }


 onSubmit(approvalStatusId) {


  const __this = this;
  swal({
      title: 'Are you sure?',
      text: 'You want to peform this action',
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

   // console.log('__this.selectedContingentData.operationId',__this.selectedContingentData);
    
      __this.loadingSrv.show();
      this.subscriptions.add(
      __this.authorizationService.enable2FAForLastApproval(__this.selectedContingentData.operationId,null,null,0).subscribe((res) => {
              if (res.result == true) {
                if(res.userSpecific) { 
                  __this.userSpecific = true;
              }
              else {
                  __this.userSpecific = false;
              }
                  __this.displayTwoFactorAuth = true;
                  __this.loadingSrv.hide();
              } else {
                  __this.goForApproval(approvalStatusId);
                  //__this.loadingService.hide();
              }
             // __this.loadingService.hide(1000);

          }, (err) => {
              swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
              __this.loadingSrv.hide();
          }));
          __this.loadingSrv.hide(30000);
  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });



  
}
  goForApproval(approvalStatusId: any): any {

    let data ={
      loanRecoveryPaymentId :this.selectedContingentData.loanRecoveryPaymentId,
      loanReviewOperationId :this.selectedContingentData.loanReviewOperationId,
      loanId :this.selectedContingentData.loanId,
      approvalStatusId : approvalStatusId,
      comment:this.comment,
      userName:this.twoFactorAuthStaffCode,
      passCode:this.twoFactorAuthPassCode

    }
    this.subscriptions.add(
    this.LoanRecoveryService.recoveryPaymentGoForApproval(data).subscribe((response: any) => {
      if(response.result) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approved Successfully', 'success');
        this.displayTwoFactorAuth=false;
        this.activeSearchTabindex = 0
      }else{
        this.displayTwoFactorAuth=false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval Failed', 'error');
        this.activeSearchTabindex = 0
      }
      this.loadingSrv.hide();
    }, (error) => {
      this.loadingSrv.hide();
    }));

  }
}
