import { CustomerService } from '../../../../customer/services/customer.service';
import { Subject } from 'rxjs';
import { CustomerFSCaptionService } from '../../../services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-financial-statement',
  templateUrl: './view-financial-statement.component.html'
})
export class ViewFinancialStatementComponent implements OnInit {
  fsRatioValueData: any[];
  fsRatioValueTableCols: any[];
  // multiple?: number;
  customers: any[];
  customerId: number; 
  searchTerm$ = new Subject<any>();
  constructor(private customerService: CustomerService, private custFSCaptionService: CustomerFSCaptionService, ) {
    this.customerService.searchForCustomer(this.searchTerm$).subscribe(results => {
      this.customers = results.result;
    });
  }

  ngOnInit() {
    // this.loadRatioValue(13);
  }
  searchStagingDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  loadRatioValue(customerId) {
    this.custFSCaptionService.getCustomerFSRatioValue(customerId).subscribe((data) => {
      this.fsRatioValueData = data.result;
      if (this.fsRatioValueData != null) {
        let fsDate1 = new Date(this.fsRatioValueData[0].fsDate1).toLocaleDateString("en-GB");
        let fsDate2 = new Date(this.fsRatioValueData[0].fsDate2).toLocaleDateString("en-GB");
        let fsDate3 = new Date(this.fsRatioValueData[0].fsDate3).toLocaleDateString("en-GB");
        let fsDate4 = new Date(this.fsRatioValueData[0].fsDate4).toLocaleDateString("en-GB");

        this.fsRatioValueTableCols = [
          { field: 'ratioCaptionName', header: 'Caption' },
          { field: 'ratioValue1', header: fsDate1 },
          { field: 'ratioValue2', header: fsDate2 },
          { field: 'ratioValue3', header: fsDate3 },
          { field: 'ratioValue4', header: fsDate4 },
        ];
      }
    }, (err) => {
    });
  }
  selectedSearchCustomer(selected) {
    this.fsRatioValueData = [];
    this.customers = [];
    this.customerId = selected.customerId;
    this.loadRatioValue(selected.customerId);
  }
}
