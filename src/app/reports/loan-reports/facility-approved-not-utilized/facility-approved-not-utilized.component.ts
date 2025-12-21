import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-facility-approved-not-utilized',
  templateUrl: './facility-approved-not-utilized.component.html',
})
export class FacilityApprovedNotUtilizedComponent implements OnInit {
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  branchCode?:any;BranchList:any[];

  constructor(
   private sanitizer: DomSanitizer,private loadingService: LoadingService,
    private reportServ: ReportService) { }

  ngOnInit() {

    this.startDate = new Date();
         this.endDate= new Date();
  }
  popoverSeeMore() {
    this.loadingService.show();
    this.displayTestReport = false;
     this.displayReport = false;
     let path = '';
    const data = {
         startDate: this.startDate,
         endDate: this.endDate,
         branchCode:this.branchCode
     }

     this.reportServ.GetFacilityApprovedNotUtilized(data)
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
