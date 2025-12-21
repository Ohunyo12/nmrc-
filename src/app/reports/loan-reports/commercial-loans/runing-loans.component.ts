import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { ProductService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-runing-loans',
  templateUrl: './runing-loans.component.html',
})
export class RuningLoansComponent implements OnInit {
  productClassList: any[];
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  searchParamemter?:any;BranchList:any[];
  productClassId?: any;


  constructor(private sanitizer: DomSanitizer,private loadingService: LoadingService,
    private reportServ: ReportService,private productService:ProductService) { }

  ngOnInit() {
      this.startDate = new Date();
      this.endDate= new Date();
      this.getAllProductClass();
  }
  popoverSeeMore() {
    this.loadingService.show();
    ////console.log('more..', startDate, endDate);
    this.displayTestReport = false;
     this.displayReport = false;
     let path = '';
    const data = {
         startDate: this.startDate,
         endDate: this.endDate,
         searchParamemter:this.searchParamemter,
         productClassId:this.productClassId
     }
     ////console.log(data);

     this.reportServ.GetRuningLoansByLaonType(data)
         .subscribe((response: any) => {
             path = response.result;
             ////console.log(path);
             this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
             this.displayTestReport = true;
             ////console.log(path);
         });
         this.loadingService.hide(10000);
     this.displayReport = true;
     return;
 
}

getAllProductClass()
{
    this.productService.getAllProductClasses().subscribe((response: any) => {
        this.productClassList = response.result;
        ////console.log(this.productClassList);
    });
}

}
