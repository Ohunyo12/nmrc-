import { Component, OnInit } from '@angular/core';

import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from 'app/credit/services/loan.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApprovalStatus, ApplicationStatus, GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-loan-application-cancellation',
  templateUrl: './loan-application-cancellation.component.html',
 // styleUrls: ['./loan-application-cancellation.component.scss']
})
export class LoanApplicationCancellationComponent implements OnInit {
  application: any;
  displayApplicationDetail: boolean;
  applications: any;
  applicationReferenceNumber: any;
  comment:any;
  approvalStatusId:any;
  tempApplicationCancellationId: any;
  loanApplicationId: any;
  activeTabindex: number = 0;
  constructor(
    private loadingService: LoadingService,
  //  private productService: ProductService,
    private loanService: LoanService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.getAllLoans();
  }
  view(row) {
    this.application = row;
    this.displayApplicationDetail = true;
    
}


approvalStatus = [
  { id: 0, name: 'Pending' },
  { id: 1, name: 'Processing' },
  { id: 2, name: 'Approved' },
  { id: 3, name: 'Disapproved' },
  { id: 4, name: 'Authorised' },
  { id: 5, name: 'Referred' },
];

getAllLoans() {   
  this.loadingService.show();
  this.loanService.loanApplicationcancellation().subscribe((response: any) => {
      this.applications = response.result;
      this.loadingService.hide();
    //  this.displaySearchForm = false;
  }, (err: any) => {
      this.loadingService.hide(1000);
  });
}


viewLoanDetail(row) {   
this.tempApplicationCancellationId=row.tempApplicationCancellationId;
this.loanApplicationId = row.loanApplicationId;

let data = {
  applicationReferenceNumber : row.applicationReferenceNumber,
  operationId : row.operationId
}
 this.loanService.viewLoanApplicationcancellation(data).subscribe((response: any) => {
     this.application = response.result;
     

      this.displayApplicationDetail = true;
      this.loadingService.hide();
    //  this.displaySearchForm = false;
  }, (err: any) => {
      this.loadingService.hide(1000);
  });
}

getApprovalStatus(id) {
  let item = this.approvalStatus.find(x => x.id == id);
  return item == null ? 'n/a' : item.name;
}

getLoanApplicationStatus(id) {
  let item = ApplicationStatus.list.find(x => x.id == id);
  return item == null ? 'n/a' : item.name;
}

getApplicationStatus(submitted, approvalStatus) {
  if (submitted == true) {
      if (approvalStatus == ApprovalStatus.PROCESSING)
          return '<span class="label label-info">FAM PROCESS</span>';
      if (approvalStatus == ApprovalStatus.AUTHORISED)
          return '<span class="label label-info">FAM PROCESS</span>';
      if (approvalStatus == ApprovalStatus.REFERRED)
          return '<span class="label label-info">FAM PROCESS</span>';
      if (approvalStatus == ApprovalStatus.APPROVED)
          return '<span class="label label-success">APPROVED</span>';
      if (approvalStatus == ApprovalStatus.DISAPPROVED)
          return '<span class="label label-danger">DISAPPROVED</span>';
  }
  return '<span class="label label-warning">NEW APPLICATION</span>';
}

forward(){

  let __this = this;
  swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to proceed with this action?',
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
      __this.loadingService.show();

      let data ={
        comment:__this.comment,
        approvalStatusId:__this.approvalStatusId,
        tempApplicationCancellationId :__this.tempApplicationCancellationId,
        loanApplicationId:__this.loanApplicationId
      }

      
      __this.loanService.GoForLoanApplcationCancellationApproval(data).subscribe((response: any) => {
        if(response.success==true){
          swal('FinTrak Credit 360', "Saved Successfully", 'success');
        }else{
          swal('FinTrak Credit 360', "There Is Error Saving Approval", 'error');
        }
        __this.getAllLoans();
          __this.loadingService.hide();
         
         __this.displayApplicationDetail = false;
      }, (err: any) => {
          __this.loadingService.hide(1000);
          swal('FinTrak Credit 360', err.message, 'error');
      });

  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });

}
onTabChange(evt){
  
}
}
