import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, BranchService, GeneralSetupService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../../credit/services';
import { ReportService } from '../../service/report.service';
import { data } from 'jquery';

@Component({
  selector: 'app-loan-classification-report',
  templateUrl: './loan-classification-report.component.html',

})
export class LoanClassificationReportComponent implements OnInit {


  displaySearchModal: boolean;
  searchResults: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;

  classification?: any;
  loanDocumentList: any[];
  prudentialGuidelines: any[];



  constructor(private approvalSer: ApprovalService, private loadingSer: LoadingService,
    private generalSetupService: GeneralSetupService,
    private sanitizer: DomSanitizer,
    private reportServ: ReportService, private branchService: BranchService) {


  }

  ngOnInit(): void {
    //this.startDate = new Date();
    //this.endDate = new Date();
    //this.loanDocumentList = ["", "", "Waiver", "", "Deferred"];
    this.getAllPrudentialGuides();

  }


  getAllPrudentialGuides() {
    this.loadingSer.show();
    this.generalSetupService.getPrudentialGuidelineList()
        .subscribe((response: any) => {
            this.prudentialGuidelines = response.result;
            this.loadingSer.hide();
        }, (err) => {
            this.loadingSer.hide(1000);
            
        });
}

  onOptionSelected(event) {
  }

  popoverSeeMore() {
    if (this.classification != null) {
      this.loadingSer.show();
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';
      let data = null;




      data = {

        classification: this.classification,
      }



      this.reportServ.GetLoanClassification(data)
        .subscribe((response: any) => {
          path = response.result;
          this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
          this.displayTestReport = true;
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

}
