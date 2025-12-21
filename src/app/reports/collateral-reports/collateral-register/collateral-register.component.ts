import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../../credit/services';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-collateral-register',
  templateUrl: './collateral-register.component.html',

})
export class CollateralRegisterComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchParameter: any;
  searchResults: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  branchId?: any; BranchList: any[];
  waivedOrDeferred?: any;
  loanDocumentList: any[];



  constructor(private approvalSer: ApprovalService, private loadingSer: LoadingService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService) {

    this.reportServ.BranchSearchObservable(this.searchTerm$)
      .subscribe((results: any) => {
        this.searchResults = results.result;
        ////console.log('search item', this.searchResults);
      });
  }

  ngOnInit(): void {
    this.startDate = new Date();
    this.endDate = new Date();
    //this.loanDocumentList = ["", "", "Waiver", "", "Deferred"];
    this.getAllBranched();
  }

  getAllBranched() {
    this.branchService.getBranches().subscribe((response: any) => {
      this.BranchList = response.result;
      ////console.log(this.BranchList);
    });
  }
  clearInput() {
    this.branchId = "";
  }

  onOptionSelected(event) {
  }

  popoverSeeMore() {
    if (this.startDate != null && this.endDate != null) {
      this.loadingSer.show();
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';
      let data = null;


      if (this.branchId != null) {
        data = {
          branchId: this.branchSearched[0].branchId,
          startDate: this.startDate,
          endDate: this.endDate,
          searchParameter: this.searchParameter,

        }
      } else {
        data = {
          startDate: this.startDate,
          endDate: this.endDate,
          searchParameter: this.searchParameter,

        }
      }

     // console.log('input', data);

      this.reportServ.getCollateralRegister(data)
        .subscribe((response: any) => {
          path = response.result;
          ////console.log(path);
          this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
          this.displayTestReport = true;
          ////console.log(path);
        });
      this.loadingSer.hide(10000);
      this.displayReport = true;
      return;
    }
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
