import { Component, OnInit, Input } from '@angular/core';
import { ContingentLoanService } from 'app/credit/loans/contingent-usage/contingentloan.service';

@Component({
  selector: 'app-all-contingent-used',
  templateUrl: './all-contingent-used.component.html',
 // styleUrls: ['./all-contingent-used.component.scss']
})
export class AllContingentUsedComponent implements OnInit {

  @Input() loanId:any;
  UsedContingent: any;
  
  constructor(private contingentLoanService:ContingentLoanService) { }

  ngOnInit() {
    this.getAllContingentUsage(this.loanId);
  }

  getAllContingentUsage(loanId) {
    
    this.contingentLoanService.getContingentUsage(loanId)
      .subscribe((results: any) => {
        this.UsedContingent = results.result;
      });

  }
}
