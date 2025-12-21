import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-age-analysis-report',
  templateUrl: './age-analysis-report.component.html',

})
export class AgeAnalysisReportComponent implements OnInit {

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

    this.reportServ.GetAgeAnalysisReport(data).subscribe((response: any) => {
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);

      this.loadingService.hide();
      this.displayReport = true;
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
}