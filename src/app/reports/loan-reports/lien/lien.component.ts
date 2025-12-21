import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoanApplicationService } from '../../../credit/services';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-lien',
  templateUrl: './lien.component.html',

})
export class LienComponent implements OnInit {

  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;branchId?:any;
  loanApplication: any[]; displayReport: boolean ;BranchList:any[];reportSrc: SafeResourceUrl;
  staffPosting: any[]; staffId = 0;customerName?:any;
    searchParamemter: any;

  constructor(private approvalSer: ApprovalService,private loadingService: LoadingService,
      private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
      private reportServ: ReportService,private branchService: BranchService) { }




  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
  }

  popoverSeeMore() {
    this.loadingService.show();
        this.displayTestReport = false;
        this.displayReport = false;
        let path = '';
        let data =null;

        data = {
         startDate: this.startDate,
         endDate: this.endDate,
         searchParamemter:this.searchParamemter,
        // transactionTypeId:this.transactionTypeId
   }

        this.reportServ.getLoanAccountWithLein(data)
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


