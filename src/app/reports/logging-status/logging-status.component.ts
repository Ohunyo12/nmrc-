import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../shared/services/loading.service';
import { ReportService } from '../service/report.service';
import { BranchService } from '../../setup/services/branch.service';
import { Subject } from 'rxjs';
import { LocalGovtComponent } from '../../setup/components/local-govt/local-govt.component';

@Component({
  selector: 'app-logging-status',
  templateUrl: './logging-status.component.html',
})
export class LoggingStatusComponent implements OnInit {
  loginStatus: boolean;
  logingStatus: any;
  branchCode: any;
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  username?:any;BranchList:any[];
  searchResults: any;
  displaySearchModal:boolean=false;
  AuditTypeSearched: any;
  loggingStatus: any;
  searchTerm$ = new Subject<any>();
  constructor(private loadingService: LoadingService,
   private sanitizer: DomSanitizer,
    private reportServ: ReportService,private branchService: BranchService) {

      
     }
    

  ngOnInit() {

    this.startDate = new Date();
    this.endDate = new Date();
    this.loginStatus = true;
  }

  searchDB(i){

  }

  popoverSeeMore() {
    this.loadingService.show();
    if (this.startDate != null && this.endDate != null) {

       let   data = {
            startDate: this.startDate,
          endDate: this.endDate,
          loginStatus:this.loginStatus,
          branchCode : this.branchCode
     }

     
        this.reportServ.GetLoggingStatus(data).subscribe((response: any) => {
            let    path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            this.loadingService.hide(10000);
        this.displayReport = true;
        return;
    }
}

}
