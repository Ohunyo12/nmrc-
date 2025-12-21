import { Component, OnInit } from '@angular/core';
import { LoanService } from 'app/credit/services/loan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-completed-loan-confirmation',
  templateUrl: './completed-loan-confirmation.component.html',
})
export class CompletedLoanConfirmationComponent implements OnInit {
  loans: any;
  searchValue: any;
  showLoan: boolean;
  selectedLoans: any;
  selectedLoan: any;
  termLoanId: any;
  loanDetails: any;

  constructor(
    private loanService: LoanService,private loadingService: LoadingService,) { }


  ngOnInit() {
    this.getCompletedLoans();
  }
  getCompletedLoans() {

    this.loanService.getCompltedLoans().subscribe(response => {
      this.loanDetails = response.result;
      
    });
  }

  getCompletedLoan() {
   
    this.loanService.getCompltedLoan(this.searchValue).subscribe(response => {
      this.loanDetails = response.result;
      
    });
  }

  viewLoan(d){
    this.termLoanId =d.loanId
    this.selectedLoan = d;
    this.showLoan=true;
  }

  ChangeLoanStatus() {
    const __this = this;
    swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to make this loan as completed',
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
        __this.loanService.changeLoanStatusToComplete(__this.termLoanId).subscribe(response => {
          __this.loans = response.result;
            if (response.success === true) {
                __this.showLoan=false;
                __this.getCompletedLoans();
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Saved Successfull", 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Failed: Could not Save", 'success');
                __this.showLoan=true;
            }
            __this.showLoan = false;
        }, (err) => {
            __this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
}
}
