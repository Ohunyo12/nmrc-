import { LoadingService } from '../../../shared/services/loading.service';
import { EditorModule } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LoanOperationService } from '../../services/loan-operations.service';
import swal from 'sweetalert2';

@Component({
  selector: 'end-of-day',
  templateUrl: './end-of-day.component.html',
})

export class EndofdayComponent implements OnInit {
  eodForm: FormGroup;
  displayCustomerLoanDetails:boolean;
  constructor(private fb: FormBuilder, private loadingService: LoadingService, 
     private loanOperationService: LoanOperationService) {
  }

  ngOnInit() {
    this.clearControl();
  }
 
  clearControl() {
    this.eodForm = this.fb.group({
        eodDate: ['', Validators.required],

    });
  }

  showReviewForm(): void {
    this.clearControl();
  }

  runEod(formObj){

  }

  //runRefressFinacleBulkPosting
  runRefressFinacleBulkPosting(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;

      this.loanOperationService.runRefressFinacleBulkPosting(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.loadingService.hide();
          swal('FinTrak Credit 360', res.message, 'success');
        } else {
          swal('FinTrak Credit 360', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('FinTrak Credit 360', JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    
  }
  
  // runEod(formObj) {
  //   this.loadingService.show();
  //   const bodyObj = formObj.value;
  //     this.loanOperationService.runEodOperation(bodyObj).subscribe((res) => {
  //       if (res.success == true) {
  //         this.loadingService.hide();
  //         swal('FinTrak Credit 360', res.message, 'success');
  //       } else {
  //         swal('FinTrak Credit 360', res.message, 'error');
  //         this.loadingService.hide();
  //       }
  //     }, (err: any) => {
  //       swal('FinTrak Credit 360', JSON.stringify(err), 'error');
  //       this.loadingService.hide();
  //     });
    
  // }
}
