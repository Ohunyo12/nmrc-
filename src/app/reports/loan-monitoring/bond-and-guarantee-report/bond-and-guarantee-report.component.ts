import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-bond-and-guarantee-report',
  templateUrl: './bond-and-guarantee-report.component.html'
})
export class BondAndGuaranteeReportComponent implements OnInit {

  displayTestReport: boolean;
    startDate?: Date; endDate?: Date;approvalStatus:any;
    displayReport = false; reportSrc: SafeResourceUrl;

    constructor(private loadingService: LoadingService, private reportServ: ReportService,
        private sanitizer: DomSanitizer
    ) {
        let tempSrc = '/';
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
    }

    ngOnInit() {
        this.endDate = new Date();
        this.startDate = new Date();
    }

    
    popoverSeeMore() {
        this.loadingService.show();

        if (this.startDate != null && this.endDate != null) {
           this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
           const data = {
                startDate: this.startDate,
                endDate: this.endDate,
                approvalStatus:this.approvalStatus
                
            }
            
            this.reportServ.getBondsAndGuaranteeReport(data)
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
}

