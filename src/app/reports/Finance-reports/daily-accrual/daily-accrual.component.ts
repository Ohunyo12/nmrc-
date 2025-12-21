import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ApprovalService, BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-daily-accrual',
  templateUrl: './daily-accrual.component.html',
})
export class DailyAccrualComponent implements OnInit {
  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  searchTerm$ = new Subject<any>();
  PAGEOPERATION = 6;   displayTestReport: boolean; startDate?: Date; endDate?: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;branchId?:any;
 BranchList:any[];transactionTypeId?:any;TransactionTypeList:any[];categoryId?:any;CategoryList:any[];
 searchParamemter:any;
 
 constructor(private approvalSer: ApprovalService,
   private sanitizer: DomSanitizer,private loadingService: LoadingService,
  private reportServ: ReportService,private branchService: BranchService) {

     this.reportServ.BranchSearchObservable(this.searchTerm$)
     .subscribe(results => {
       this.searchResults = results.result;
       ////console.log('search item', this.searchResults);
     });
   }

ngOnInit(): void {
   this.startDate = new Date();
  this.endDate = new Date();
 this.getAllDailyAccrualCategories();
 this.getAllLoanTransactionType();
}

popoverSeeMore() {
 this.loadingService.show();
 if (this.startDate != null && this.endDate != null) {
    ////console.log('more..', startDate, endDate);
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

  
     ////console.log(data);
     
     this.reportServ.GetAllDailyAccrualReport(data)
         .subscribe((response: any) => {
             path = response.result;
             this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
             this.displayTestReport = true;
         });
         this.loadingService.hide(20000);
     this.displayReport = true;
     return;
 }
}
getAllBranched()
{
 this.branchService.getBranches().subscribe((response: any) => {
     this.BranchList = response.result;
     ////console.log(this.BranchList);
 });
}
getAllDailyAccrualCategories()
{
 this.reportServ.GetAllDailyAccrualCategories().subscribe((response: any) => {
     this.CategoryList = response.result;
     ////console.log(this.BranchList);
 });
}
getAllLoanTransactionType()
{
 this.reportServ.GetAllLoanTransactionType().subscribe((response: any) => {
     this.TransactionTypeList = response.result;
     ////console.log(this.BranchList);
 });
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