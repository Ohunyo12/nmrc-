import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    moduleId: module.id,
  templateUrl: 'loan-commercial-loan.report.component.html',
})
export class LoanCommercialReportComponent implements OnInit{
    workingLoanApplication: string; loanSelection: any[]; startDate: Date; endDate: Date;
    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl; displayReport: boolean = false;
  //  displayReport: boolean = false;
    constructor(private loanSer: LoanService , private sanitizer: DomSanitizer,private loadingService: LoadingService,
        private reportServ: ReportService ){}
    ngOnInit() {
        this.getLoanDetails();
        this.startDate = new Date();
        this.endDate = new Date(); 
    }
    getLoanDetails(){
        this.loanSer.getLoanDetails().subscribe((response: any) => {
            this.loanDetail = response.result;
            ////console.log(this.loanDetail);
        });
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
            }
            ////console.log(data);
            
            this.reportServ.getLoanCommercialReport(data)
                .subscribe((response: any) => {
                    path = response.result;
                    ////console.log(path);
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