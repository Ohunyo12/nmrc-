import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { ProductService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-loan-interest-receivable-payable',
  templateUrl: './loan-interest-receivable-payable.component.html',
})
export class LoanInterestReceivablePayableComponent implements OnInit {
  productClassList: any[];
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  searchParamemter?:any;BranchList:any[];
  productClassId?: any;



  constructor(private sanitizer: DomSanitizer, private loadingSer: LoadingService,
    private reportServ: ReportService,private productService:ProductService) { }

  ngOnInit() {
    
    this.startDate = new Date();
    this.endDate= new Date();
    this.getAllProductClass();    
  }
  popoverSeeMore() {
    this.loadingSer.show();
    this.displayTestReport = false;
     this.displayReport = false;
     let path = '';
    const data = {
         startDate: this.startDate,
         endDate: this.endDate,
         searchParamemter:this.searchParamemter,
         productClassId:this.productClassId
     }

     this.reportServ.GetLoanInterestReceivableAndPayable(data)
         .subscribe((response: any) => {
             path = response.result;
            
             this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
             this.loadingSer.hide(10000);
             this.displayTestReport = true;
            
         });
     this.displayReport = true;
     return;
 
}

getAllProductClass()
{
    this.productService.getAllProductClasses().subscribe((response: any) => {
        this.productClassList = response.result;
    });
}
}
