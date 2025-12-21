import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from 'app/shared/services/loading.service';
import { ReportService } from 'app/reports/service/report.service';

@Component({
  selector: 'app-loan-booking-report',
  templateUrl: './loan-booking-report.component.html',
 // styleUrls: ['./loan-booking-report.component.scss']
})
export class LoanBookingReportComponent implements OnInit {

  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
 
  displaySearchModal: boolean = false;
  AuditTypeSearched: any;
  auditTypeId: any;
  stagingSearch: any;
  searchInfo: any;

  constructor( private loadingService: LoadingService,
     private sanitizer: DomSanitizer,
    private reportServ: ReportService) {

    
  }


  ngOnInit() {

    this.startDate = new Date();
    this.endDate = new Date();
  }

  popoverSeeMore() {
    this.loadingService.show();
    if (this.startDate != null && this.endDate != null) {
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';

      let data = null;

      data = {
        startDate: this.startDate,
        endDate: this.endDate,
        searchInfo: this.searchInfo,
      }


      this.reportServ.LoanBookingReport(data).subscribe((response: any) => {
        path = response.result;
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
      });
      this.loadingService.hide(10000);
      this.displayReport = true;
      return;
    }
  }

  
}
