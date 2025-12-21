import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-insurance-report',
  templateUrl: './insurance-report.component.html',

})
export class InsuranceReportComponent implements OnInit {

  [x: string]: any;
  displayReport: boolean = false; reportSrc: SafeResourceUrl; showButton: boolean = false;
  constructor(private reportServ: ReportService, private sanitizer: DomSanitizer,
    private loadingService: LoadingService) { }

  ngOnInit() { }
  showPopup() {
    this.displayReport = true;
  }
  popoverSeeMore() {
    this.loadingService.show();
    // this.displayReport = false;
    let path: string = '';
    this.reportServ.GetInsuranceReport()
      .subscribe((response: any) => {
        path = response.result;
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.loadingService.hide(10000);
        this.showButton = true;
        this.displayReport = true;
      }); return;
  }


  // load data ..


}