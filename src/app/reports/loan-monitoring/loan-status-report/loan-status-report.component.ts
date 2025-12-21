import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from "../../../setup/services/approval.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { BranchService, ProductService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';

import { statusReportType, ReportTypeList } from '../../../shared/constant/app.constant';
@Component({
  selector: 'app-loan-status-report',
  templateUrl: './loan-status-report.component.html',
  styleUrls: ['./loan-status-report.component.css']
})
export class LoanStatusReportComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  auditTypeId: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6; displayTestReport: boolean; startDate?: Date; endDate?: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl; branchId?: any;
  loanRefNo?: any; BranchList: any[]; productClassId?: any; productClassList: any[];
  reports: ReportTypeList[] ;
  ReportType?: any;


  constructor(private loadingService: LoadingService, private reportServ: ReportService,
    private sanitizer: DomSanitizer) { 
      let tempSrc = '/';
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
    }

  ngOnInit() {
    this.startDate = new Date('01/01/2019');
        this.endDate = new Date();
        this.reports=statusReportType.reports;
  }
  popoverSeeMore() {
    this.loadingService.show();
    if (this.startDate != null && this.endDate != null) {
        ////console.log('more..', startDate, endDate);
        this.displayTestReport = false;
        this.displayReport = false;
        let path = '';
        let data = null;
        if (this.branchId != null) {
            data = {
                branchId: this.branchSearched[0].branchId,
                startDate: this.startDate,
                endDate: this.endDate,
                loanRefNo: this.loanRefNo,
                productClassId: this.productClassId

            }
        } else {
            data = {
                startDate: this.startDate,
                endDate: this.endDate,
                branchId: this.branchId,
                loanRefNo: this.loanRefNo,
                productClassId: this.productClassId,
                ReportType:this.ReportType

            }
        }


        ////console.log(data);

        this.reportServ.getLoanStatusReport(data)
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
/*   displayGeneratedReport() {
    this.loadingService.show();
    
    const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        ReportType:this.ReportType
    }

    this.reportServ.getLoanStatusReport(data).subscribe((response: any) => {
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(response.result);
        this.loadingService.hide(10000);
        this.displayReport = true;
    }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
} */
/* getAllBranched() {
  this.branchService.getBranches().subscribe((response: any) => {
      this.BranchList = response.result;
      ////console.log(this.BranchList);
  });
}
getAllProductClass() {
  this.productService.getAllProductClasses().subscribe((response: any) => {
      this.productClassList = response.result;
      ////console.log(this.productClassList);
  });
} */

openSearchBox(): void {
  this.displaySearchModal = true;
}
searchDB(searchString) {
  this.searchTerm$.next(searchString);
}
pickSearchedData(item) {

  this.branchSearched = this.searchResults.filter(x => x.branchId == item.branchId);
  this.branchId = this.branchSearched[0].branchName;
  this.displaySearchModal = false;
}

clearInput() {
  this.branchId = "";
}

}
