import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { ReportService } from '../service/report.service';
import { ApprovalService } from 'app/setup/services/approval.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',

})
export class TrialBalanceComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;

  loanSelection:any;
  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;branchId:any;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;BranchList:any[];
  staffPosting: any[]; staffId = 0;
  approvalStatus: any;
  glAccountId:any[];
  customChartOfAccountId:any[];
  ApprovalStatusList:any[];
  operationId: any;
  ApprovalOperationList: any[];
  param?: any;
    loanDetail: any[];

    totalDebitBalance: number = 0;
    totalCreditBalance: number = 0;
    totalDebitBalanceInBaseCurrency: number = 0;
    totalCreditBalanceInBaseCurrency: number = 0;


  constructor(private approvalSer: ApprovalService,private loadingService: LoadingService,
      private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
      private reportServ: ReportService,) {


      }

  ngOnInit(): void {
      this.startDate = null;// new Date();
      this.endDate = new Date();
      this.getApprovalStatus();
     // this.getApprovalOperations();

  }

  getApprovalStatus() {
    this.reportServ.GetGLAccountName().subscribe((respone: any) => {
      this.ApprovalStatusList = respone.result;
      console.log(this.customChartOfAccountId);
  })
  }

  getApprovalOperations() {
    this.reportServ.GetAllApprovalOperations().subscribe((respone: any) => {
      this.ApprovalOperationList = respone.result;
      ////console.log('this.ApprovalOperationList',this.ApprovalOperationList);

  })
  }

  getTrialBalanceDetails() {
    //let data = null;
    //// if(this.branchId!=null || this.param!=null){

   /*  if (this.branchId != null) {
        data = {
            branchId: this.branchSearched[0].branchId,
            param: this.param
        }
    } else {
        data = {
            param: this.param,
            branchId: this.branchId
        }
    } */
    ////console.log('data',data);



    ////console.log(data);
    this.loadingService.show();
   //if (this.startDate != null && this.endDate != null) {
    if (this.endDate != null) {
        ////console.log('more..', startDate, endDate);
        let data =null;
        this.displayTestReport = false;
        this.displayReport = false;
        let path = '';

        data = {
            approvalStatus: this.approvalStatus,
            glAccountId: this.glAccountId,
            customChartOfAccountId: this.customChartOfAccountId,
            startDate: this.startDate,
            endDate: this.endDate
        };



        this.reportServ.getTrialBalanceSummary(data).subscribe((response: any) => {
            this.loanDetail = response.result;

            this.totalDebitBalance = this.loanDetail.reduce((sum, item) => sum + item.debitBalance, 0);
            this.totalCreditBalance = this.loanDetail.reduce((sum, item) => sum + item.creditBalance, 0);

            this.totalDebitBalanceInBaseCurrency = this.loanDetail.reduce((sum, item) => sum + item.debitBalanceInBaseCurrency, 0);
            this.totalCreditBalanceInBaseCurrency = this.loanDetail.reduce((sum, item) => sum + item.creditBalanceInBaseCurrency, 0);


            this.loadingService.hide();
        });
    }

}
 ExportToExcel(){

    this.loadingService.show();
    let data ={
      approvalStatus: this.approvalStatus,
          glAccountId: this.glAccountId,
          customChartOfAccountId: this.customChartOfAccountId,
      startDate: this.startDate,
      endDate: this.endDate,
    }

    this.reportServ.exportTrialBalanceToExcel(data).subscribe((response: any) => {
      let doc = response.result;


       if (doc.length != 0) {
         let excel = doc
        // doc.forEach(excel => {

          var byteString = atob(excel.reportData);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);

          try {
              var file = new File([bb], excel.templateTypeName, {type: 'application/vnd.ms-excel' });
              saveAs(file);
          } catch (err) {
              var textFileAsBlob = new Blob([bb], {type: 'application/vnd.ms-excel' });
              window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName+'.xlsx');
          }
        // });

      }
     this.loadingService.hide();
    });
    this.loadingService.hide();

  }

popoverSeeMore(selectedId, currencyCode) {
    this.loadingService.hide(10000);
    if (selectedId != null) {
        ////console.log('more..', selectedId);
        this.displayTestReport = false;
        this.displayReport = false;
        let path: string = '';
        let appl = this.loanDetail.find(x => x.glAccountId == selectedId);
        //console.log('data', appl);
       // let appl = this.loanDetail.find(x => x.customChartOfAccountId == selectedId);
        if (appl != null) {


         //   this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
            this.displayReport = true;
            this.reportServ.getTrialBalance(selectedId,currencyCode)
                .subscribe((response: any) => {
                    path = response.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    ////console.log(path);
                    this.loadingService.hide(10000);
                    this.displayTestReport = true;
                });
        }
        return;
    }
    // load data ..
}

openSearchBox(): void {
    this.displaySearchModal = true;
}
/* searchDB(searchString) {
    this.searchTerm$.next(searchString);
} */
pickSearchedData(item) {
    this.branchSearched = this.searchResults.filter(x => x.branchId == item.branchId);
    this.branchId = this.branchSearched[0].branchName;
    this.displaySearchModal = false;
}


  /* popoverSeeMore() {
    this.loadingService.show();
      if (this.startDate != null && this.endDate != null) {
          ////console.log('more..', startDate, endDate);
          let data =null;
          this.displayTestReport = false;
          this.displayReport = false;
          let path = '';

          data = {
            approvalStatus: this.approvalStatus,
            glAccountId: this.glAccountId,
            operationId: this.operationId,
        startDate: this.startDate,
        endDate: this.endDate,
       }

          ////console.log(data);

          this.reportServ.GetLAReport(data)
              .subscribe((response: any) => {
                  path = response.result;
                  ////console.log(path);
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

 */
}
