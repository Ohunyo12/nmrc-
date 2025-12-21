import { Component, OnInit, Input } from '@angular/core';
import { LoanService } from 'app/credit/services/loan.service';

@Component({
  selector: 'app-mapped-loan-collateral',
  templateUrl: './mapped-loan-collateral.component.html',
 // styleUrls: ['./mapped-loan-collateral.component.scss']
})
export class MappedLoanCollateralComponent implements OnInit {
  collateralDetails: any;
  @Input() loanId: any;
  @Input() loanSystemTypeId : any;

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.GetCollateral(this.loanId,this.loanSystemTypeId);
  }

  GetCollateral(loanId,loanSystemTypeId) {
    
    this.loanService.getCollateral(loanId,loanSystemTypeId)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });

  }
}
