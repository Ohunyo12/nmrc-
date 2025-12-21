import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-unearned-interest',
  templateUrl: './unearned-interest.component.html',
  //styleUrls: ['./unearned-interest.component.scss']
})
export class UnearnedInterestComponent implements OnInit {

  displayReport = false; reportSrc: SafeResourceUrl;value:any;
  startDate?: Date; endDate?: Date;

  constructor(private loadingService: LoadingService, private reportServ: ReportService,
      private sanitizer: DomSanitizer,
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


      this.reportServ.getUnearnedInterest(data).subscribe((response: any) => {
          this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);
          this.loadingService.hide(10000);
          this.displayReport = true;            
      }, (err) => {
          swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
      });
  }
}