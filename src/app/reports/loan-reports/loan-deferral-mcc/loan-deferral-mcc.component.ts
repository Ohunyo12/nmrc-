import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoanApplicationService } from '../../../credit/services';
import { ReportService } from '../../service/report.service';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-loan-deferral-mcc',
  templateUrl: './loan-deferral-mcc.component.html',
})
export class LoanDeferralMccComponent implements OnInit {


  branchId: any;
  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  branchCode?: any; BranchList: any[];

  constructor(private approvalSer: ApprovalService,
    private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,private loadingService: LoadingService,
    private reportServ: ReportService, private branchService: BranchService) {

      this.reportServ.BranchSearchObservable(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
      });

     }

  ngOnInit() {
    this.startDate = new Date();
  }


  popoverSeeMore() {
    this.loadingService.show();
       this.displayTestReport = false;
        this.displayReport = false;
        let path = '';
       let data = null;
        if(this.branchId!=null){
          data = {
             branchId : this.branchSearched[0].branchId,
             startDate: this.startDate,
         }
     }else{
          data = {
              startDate: this.startDate,
         }
     }

        this.reportServ.GetLoanDocumentDefferalsMCC(data)
            .subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
            });
            this.loadingService.hide(10000);
        this.displayReport = true;
        return;

}


openSearchBox(): void {
  this.displaySearchModal = true;
}
searchDB(searchString) {
  this.searchTerm$.next(searchString);
}
pickSearchedData(item) {
  this.branchSearched = this.searchResults.filter(x => x.branchId === item.branchId);
  this.branchId = this.branchSearched[0].branchName;
  this.displaySearchModal = false;
}

}
