import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';

@Component({
    moduleId: module.id,
  templateUrl: 'earned-unearned-interest.report.component.html',
})
export class EarnedUnearnedInterestReportComponent implements OnInit{ 
    workingLoanApplication: string; loanSelection: any[];startDate: Date; endDate: Date;
    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl; displayReport: boolean = false;
  //  displayReport: boolean = false;
    constructor(private loanSer: LoanService ,private sanitizer: DomSanitizer,
        private reportServ: ReportService ){}
    
    ngOnInit() {
        
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getLoanDetails();
        this.startDate = new Date();
         this.endDate = new Date();
    }
    getLoanDetails(){
        this.loanSer.getLoanDetails().subscribe((response: any) => {
            this.loanDetail = response.result;
        });
    }

      
    popoverSeeMore() {
        // if (selectedId != null) {
        //     this.displayTestReport = false;
        //     this.displayReport = false;
        //     let path: string = '';
        //     let appl = this.loanDetail.find(x => x.loanId == selectedId);
        //     if (appl != null) {
             
        //         this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
        //         this.displayReport = true;
        //         this.reportServ.getEarnedUnearnedInterest(selectedId)
        //             .subscribe((response: any) => {
        //                 path = response.result;
        //                 this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                       
        //                 this.displayTestReport = true;
        //             });
        //     }
        //     return;
        // }
        // load data ..
    }
    
}


