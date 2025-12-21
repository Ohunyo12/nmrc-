import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../setup/services';
import { LoanApplicationService } from '../../credit/services';
import { ReportService } from '../service/report.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../shared/constant/app.constant';

@Component({
  selector: 'app-analyst-report',
  templateUrl: './analyst-report.component.html'
})
export class AnalystReportComponent implements OnInit {
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  username?: any; BranchList: any[];
  searchResults: any;
  searchTerm$ = new Subject<any>();
  displaySearchModal: boolean = false;
  AuditTypeSearched: any;
  auditTypeId: any;
  stagingSearch: any;
  constructor(private approvalSer: ApprovalService, private loadingService: LoadingService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService) {

    this.reportServ.AuditTypeSearchObservable(this.searchTerm$)
      .subscribe((results: any) => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      });

  }


  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  popoverSeeMore() {
    this.loadingService.show();
    if (this.startDate != null && this.endDate != null) {
      //console.log('more..', startDate, endDate);
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';

      let data = null;

      if (this.auditTypeId != null) {
        data = {
          startDate: this.startDate,
          endDate: this.endDate,
          username: this.username,
          auditTypeId: this.AuditTypeSearched[0].auditTypeId
        }
      } else {
        data = {
          startDate: this.startDate,
          endDate: this.endDate,
          username: this.username,
        }
      }


      //console.log('>>>>>>>>>>',data);203056491
     // console.log('>>>>>>>>>>');
      this.reportServ.GetAnalystReport(data).subscribe((response: any) => {
        path = response.result;
       // console.log(path);
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
        //console.log(path);
      });
      this.loadingService.hide(10000);
      this.displayReport = true;
      return;
    }
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }
  searchForAuditTypName(auditTypeName) {
    this.loadingService.show();
    this.reportServ.SearchForAuditType(auditTypeName).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {
        //this.customerAccountNumber = auditTypeName;
        this.searchResults = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
    });
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  pickSearchedData(item) {
    this.auditTypeId = '';
    this.AuditTypeSearched = this.searchResults.filter(x => x.auditTypeId == item.auditTypeId);
    this.auditTypeId = this.AuditTypeSearched[0].auditType;
    this.displaySearchModal = false;
  }

  // showReport(){
  //   let x = window.open("https://www.google.com", "_blank");
  // }
  clearInput() {
    this.auditTypeId = "";
  }
}
