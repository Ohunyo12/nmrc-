import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-collateral-perfection',
  templateUrl: './collateral-perfection.component.html',

})
export class CollateralPerfectionComponent implements OnInit {

 
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
           ////console.log('more..', startDate, endDate);
           this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
           const data = {
                startDate: this.startDate,
                endDate: this.endDate,
                approvalStatus:this.approvalStatus
                
            }
            ////console.log(data);
            
            this.reportServ.getCollateralPerfection(data)
                .subscribe((response: any) => {
                    path = response.result;
                    ////console.log("PATH = "+path);
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    this.displayTestReport = true;
                    ////console.log(path);
                });
                this.loadingService.hide(10000);
            this.displayReport = true;
            return;
        }
    }

}
