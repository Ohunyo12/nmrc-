import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../../setup/services/branch.service';

@Component({
  selector: 'app-repayment',
  templateUrl: './repayment.component.html',
  //styleUrls: ['./repayment.component.scss']
})
export class RepaymentComponent implements OnInit {
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate?: Date; endDate?: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;branchId?:any;
 BranchList:any[];transactionTypeId?:any;TransactionTypeList:any[];operationTypeId:number;CategoryList:any[];
    OperationList: any;

 constructor(
  private sanitizer: DomSanitizer,private loadingService: LoadingService,
 private reportServ: ReportService) {
   
  }

ngOnInit(): void {
  this.startDate = new Date();
 this.endDate = new Date();
this.getOperations();
}

popoverSeeMore() {
this.loadingService.show();
if (this.startDate != null && this.endDate != null) {
   this.displayTestReport = false;
    this.displayReport = false;
    let path = '';
let data =null;
    
        data = {
         startDate: this.startDate,
         endDate: this.endDate,
         operationId:this.operationTypeId,
        //  transactionTypeId:this.transactionTypeId
       
   }
    
    this.reportServ.GetLoanRepaymentReport(data)
        .subscribe((response: any) => {
            path = response.result;
            this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            this.displayTestReport = true;
        });
        this.loadingService.hide(10000);
    this.displayReport = true;
    return;
}
}
getOperations() {

    this.reportServ.GetOperations().subscribe((response: any) => {
        this.OperationList = response.result;
    });
}
}