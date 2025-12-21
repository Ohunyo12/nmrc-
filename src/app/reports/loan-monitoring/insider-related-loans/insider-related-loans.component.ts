import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-insider-related-loans',
  templateUrl: './insider-related-loans.component.html',
  styleUrls: ['./insider-related-loans.component.css']
})
export class InsiderRelatedLoansComponent implements OnInit {
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
 
  displaySearchModal: boolean = false;
  AuditTypeSearched: any;
  auditTypeId: any;
  stagingSearch: any;
  searchInfo: any;
  constructor(private loadingService: LoadingService, private reportServ: ReportService,
    private sanitizer: DomSanitizer) {
      let tempSrc = '/';
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
     }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
  }
  popoverSeeMore() {
    this.loadingService.show();
    if (this.startDate != null && this.endDate != null) {
      //console.log('more..', startDate, endDate);
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';

      let data = null;

      data = {
        startDate: this.startDate,
        endDate: this.endDate,
        searchInfo: this.searchInfo,
      }


      this.reportServ.InsiderRelatedLoansReport(data).subscribe((response: any) => {
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
