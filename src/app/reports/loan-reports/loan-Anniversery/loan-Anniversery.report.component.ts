import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../../setup/services/approval.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';





@Component({
    templateUrl: './loan-Anniversery.report.component.html'
})
/**
 * PAGEOPERATION
 */

export class LoanAnniverseryReportComponent implements OnInit {
    PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
    queryOption:string;queryValue:string;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;

    constructor(private approvalSer: ApprovalService,private loadingService: LoadingService,
         private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
         private reportServ: ReportService) { }

    ngOnInit(): void {
          this.startDate = new Date();
         this.endDate = new Date();
        this.queryOption='';
        this.queryValue='';

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
            }

            this.reportServ.GetLoanAnniverseryReport(data)
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