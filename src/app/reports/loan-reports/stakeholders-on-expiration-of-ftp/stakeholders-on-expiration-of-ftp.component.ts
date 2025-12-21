import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoanApplicationService } from '../../../credit/services';
import { ReportService } from '../../service/report.service';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-stakeholders-on-expiration-of-ftp',
  templateUrl: './stakeholders-on-expiration-of-ftp.component.html',

})
export class StakeholdersOnExpirationOfFtpComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date; branchId: any;
  loanApplication: any[]; displayReport: boolean; BranchList: any[]; reportSrc: SafeResourceUrl;
  staffPosting: any[]; staffId = 0; customerName: any;

  constructor(private approvalSer: ApprovalService, private loadingSer: LoadingService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService) {

    this.reportServ.BranchSearchObservable(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      });

  }

  ngOnInit() {
    this.startDate = new Date();
    this.getAllBranched();
    this.popoverSeeMore()
  }


  getAllBranched() {
    this.branchService.getBranches().subscribe((response: any) => {
      this.BranchList = response.result;
      ////console.log(this.BranchList);
    });
  }

  popoverSeeMore() {
    this.loadingSer.show();
    this.displayTestReport = false;
    this.displayReport = false;
    let path = '';
    let data = null;
    if (this.branchId != null) {
      data = {
        startDate: this.startDate,
        customerName: this.customerName,
        branchId: this.branchSearched[0].branchId,



      }
    } else {
      data = {
        startDate: this.startDate,
        customerName: this.customerName,
        branchId: this.branchId,

      }
    }
    //console.log(data);

    this.reportServ.GetStakeholderWithExpiredFTP(data)
      .subscribe((response: any) => {
        path = response.result;
        ////console.log(path);
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.loadingSer.hide(10000);
        this.displayTestReport = true;

      });
    this.displayReport = true;

  }

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

}
