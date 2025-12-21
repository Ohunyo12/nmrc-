import {Component, ViewChild} from '@angular/core';
import { LoanReviewDrawdownComponent } from 'app/credit/loan-management/loan-operations/loan-review-drawdown.component';

@Component({
  selector: 'drawdown',
  templateUrl: 'drawdown.component.html',
  styleUrls: ['drawdown.css'],
})



export class DrawdownComponent {
  @ViewChild(LoanReviewDrawdownComponent, {static: false}) loanReviewDrawdown: LoanReviewDrawdownComponent;

    constructor(

       
    ) { }

    ngOnInit() {
       // this.reviewDrawdown.ngOnInit();
        
    }

    displayDrawdownList:boolean = false;
    showLoanReviewDrawdown(){
      this.displayDrawdownList = true;
      //this.loanReviewDrawdown.customInitialize();
      
    }
}

