import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    moduleId: module.id,
  templateUrl: 'teamloans-revolving-facility.report.component.html',
})
export class TeamloansRevolvingFacilityReportComponent implements OnInit{ 
    workingLoanApplication: string; loanSelection: any[]; startDate: Date; endDate: Date;
    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl;
     displayReport: boolean = false;
     
  
    constructor(private loanSer: LoanService ,private sanitizer: DomSanitizer,private loadingSer: LoadingService ,
        private reportServ: ReportService ){}
    
    ngOnInit() {}
        
    
    popoverSeeMore() {
        if (this.startDate != null && this.endDate != null) {
            this.loadingSer.show();
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
           const data = {
                startDate: this.startDate,
                endDate: this.endDate,
            }
            
            this.reportServ.getTeamandRevolving(data)
                .subscribe((response: any) => {
                    path = response.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    
                });
                this.loadingSer.hide(10000);
            this.displayReport = true;
            return;
        }
    }
   
}