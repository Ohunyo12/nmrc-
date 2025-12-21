import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { CustomerFSCaptionService } from '../../../services'; 
//import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'financial-statement',
    templateUrl: 'financial-statement-ratio.component.html'
})

export class FinancialStatementComponent implements OnInit, OnChanges {
    fsRatioValueData: any[];
    multiple: any;
    fsRatioValueTableCols: any[];
    @Input()  customerId: number
    constructor( private custFSCaptionService: CustomerFSCaptionService,) { }

    ngOnInit() { }

ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this. loadRatioValue(this.customerId)
}
    
  loadRatioValue(customerId) {
    this.fsRatioValueData = [];
     
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
}