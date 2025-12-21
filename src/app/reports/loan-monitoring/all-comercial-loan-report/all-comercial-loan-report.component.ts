import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-all-comercial-loan-report',
  templateUrl: './all-comercial-loan-report.component.html'
 // styleUrls: ['./all-comercial-loan-report.component.scss']
})
export class AllComercialLoanReportComponent implements OnInit {

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

        this.reportServ.getAllCommercialLoanReport(data).subscribe((response: any) => {
            this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);
            this.loadingService.hide();
            this.displayReport = true;            
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        });
    }
}