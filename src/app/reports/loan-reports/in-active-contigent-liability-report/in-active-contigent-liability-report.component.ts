import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-in-active-contigent-liability-report',
  templateUrl: './in-active-contigent-liability-report.component.html',

})
export class InActiveContigentLiabilityReportComponent implements OnInit {

  loanStatusId?: any;
  loanStatusList: any[];
  displayTestReport: boolean;
  displayReport: boolean; reportSrc: SafeResourceUrl; value: any;
  //startDate: Date; endDate: Date;

  constructor(private reportServ: ReportService,
    private sanitizer: DomSanitizer, private loadingService: LoadingService,
  ) {
    let tempSrc = '/';
    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
  }



  ngOnInit() {

    //this.startDate = new Date();
    //this.endDate = new Date();

    this.getAllLoanStatusId();
  }

  displayGeneratedReport() {
    this.loadingService.show();
    const data = {
      //startDate: this.startDate,
      //endDate: this.endDate,
      loanStatusId: this.loanStatusId,
    }

    this.reportServ.GetInActiveContigentLiabilityReport(data).subscribe((response: any) => {
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);
      this.loadingService.hide();
      this.displayReport = true;
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }


  getAllLoanStatusId() {
    this.reportServ.GetAllLoanStatus().subscribe((response: any) => {
      this.loanStatusList = response.result;
    });
  }
}
