import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';


@Component({
  selector: 'app-expired-report',
  templateUrl: './expired-report.component.html',

})
export class ExpiredReportComponent implements OnInit {

  displayReport = false; reportSrc: SafeResourceUrl; value: any;
  startDate: Date; endDate: Date;

  constructor(private reportServ: ReportService,
    private sanitizer: DomSanitizer, private loadingService: LoadingService,
  ) {
    let tempSrc = '/';
    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
  }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  displayGeneratedReport() {
    this.loadingService.show();
    const data = {
      startDate: this.startDate,
      endDate: this.endDate,
    }

    this.reportServ.GetExpiredReport(data).subscribe((response: any) => {
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);

      this.loadingService.hide();
      this.displayReport = true;
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
}