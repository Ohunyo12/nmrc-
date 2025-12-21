import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-staff-privilege-change',
  templateUrl: './staff-privilege-change.component.html',
})
export class StaffPrivilegeChangeComponent implements OnInit {

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

    this.reportServ.GetStaffPrivilegeChange(data).subscribe((response: any) => {
      this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);

      this.loadingService.hide();
      this.displayReport = true;
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
}