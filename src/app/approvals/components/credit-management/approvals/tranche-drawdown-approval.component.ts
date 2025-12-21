import {Component, ViewChild} from '@angular/core';
import { stubFalse } from 'lodash';
import { LoanReviewDrawdownApprovalComponent } from './loan-review-drawdown-approval.component';



@Component({
  selector: 'tab-group-custom-label-example',
  templateUrl: 'tranche-drawdown-approval.component.html'
})
export class TrancheDrawdownApprovalComponent {

   @ViewChild(LoanReviewDrawdownApprovalComponent, {static: false}) loanReviewDrawdown: LoanReviewDrawdownApprovalComponent;
  //@ViewChild(LoanReviewDrawdownComponent) loanReviewDrawdown: LoanReviewDrawdownComponent;

    constructor(

       
    ) { }

    ngOnInit() {

        
    }

    displayDrawdownList:boolean = false;
    showLoanReviewDrawdown(){
      this.displayDrawdownList = true;
      this.loanReviewDrawdown.customInitialize();
    }
}


