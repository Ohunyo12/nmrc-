import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../../setup/services';
import { LoanApplicationService } from '../../../credit/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-sla-monitoring',
  templateUrl: './sla-monitoring.component.html',
})
export class SlaMonitoringComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
 
  
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;branchId:any;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;BranchList:any[];
  staffPosting: any[]; staffId = 0;
  approvalStatus: any;
  ApprovalStatusList:any[];
  operationId: any;
  ApprovalOperationList: any[];
  constructor(private approvalSer: ApprovalService,private loadingService: LoadingService,
      private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
      private reportServ: ReportService,) { 

         
      }

  ngOnInit(): void {
      this.startDate = new Date();
      this.endDate = new Date();
      this.getApprovalStatus();
      this.getApprovalOperations();

  }

  getApprovalStatus() {
    this.reportServ.GetAllApprovalStatus().subscribe((respone) => {
      this.ApprovalStatusList = respone.result;
  })
  }

  getApprovalOperations() {
    this.reportServ.GetAllApprovalOperations().subscribe((respone) => {
      this.ApprovalOperationList = respone.result;
      
  })
  }
  

  popoverSeeMore() {
    this.loadingService.show();
      if (this.startDate != null && this.endDate != null) {
          let data =null;
          this.displayTestReport = false;
          this.displayReport = false;
          let path = '';

          data = {
            approvalStatus: this.approvalStatus,
            operationId: this.operationId,
        startDate: this.startDate,
        endDate: this.endDate,
       }
         

          this.reportServ.GetLAReport(data)
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

  openSearchBox(): void {
      this.displaySearchModal = true;
    }
   
}