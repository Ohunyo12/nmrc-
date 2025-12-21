import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from "../../../setup/services/approval.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';





@Component({
    templateUrl: './posted-transactions.component.html'
})
/**
 * PAGEOPERATION
 */

export class PostedTransactionsReportComponent implements OnInit {

    branchSearched: any;
    displaySearchModal: boolean;
    searchResults: any;
    searchTerm$ = new Subject<any>();
    searchTermGL$ = new Subject<any>();
   displaySearchGL:boolean;
   GLSearchResults:any;
    
    PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;branchId:any;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;BranchList:any[];
    staffPosting: any[]; staffId = 0;
    GLSearched: any;
    glAccountId: any;
    GLAccountId: any;
    branchSearchText: any;
    gLSearchText: any;
    relationshipOfficerId: any;
    GL: any;
    constructor(private approvalSer: ApprovalService,private loadingService: LoadingService,
        private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
        private reportServ: ReportService,private branchService: BranchService) { 

            this.reportServ.GLSearchObservable(this.searchTermGL$)
            .subscribe(results => {
              ////console.log('GLL item', results.result);
              this.GLSearchResults = results.result;
            
            });

            this.reportServ.BranchSearchObservable(this.searchTerm$)
            .subscribe(results => {
              this.searchResults = results.result;
              ////console.log('search item', this.searchResults);
            });
        }

    ngOnInit(): void {
        this.startDate = new Date();
        this.endDate = new Date();
      //  this.branchId=0;
        this.getStaffPosting() ;
       // this.getAllBranched();
    }

    getStaffPosting() {
        if (this.startDate.toString().length > 0 && this.endDate.toString().length > 0) {
            const data = {
                startDate: this.startDate,
                endDate: this.endDate,
            }
            this.reportServ.getStaffPosting(data).subscribe((respone) => {
                this.staffPosting = respone.result;
                ////console.log(this.staffPosting);
            })
        }
    }
getAllBranched()
{
    this.branchService.getBranches().subscribe((response: any) => {
        this.BranchList = response.result;
    });
}
    popoverSeeMore() { 
        this.loadingService.show();

        if (this.startDate != null && this.endDate != null) {
            ////console.log('more..', startDate, endDate);
            let data =null;
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';

            if(this.branchId!=null && this.glAccountId!=null){
                data = {
                    staffId: this.staffId,
                startDate: this.startDate,
                endDate: this.endDate,
                branchId : this.branchSearched[0].branchId,
                glAccountId : this.branchSearched[0].glAccountId,
                PostedByStaffId:this.relationshipOfficerId,
               }
           }else if(this.branchId!=null){
            data = {
                staffId: this.staffId,
            startDate: this.startDate,
            endDate: this.endDate,
            branchId : this.branchSearched[0].branchId,
            PostedByStaffId:this.relationshipOfficerId,
           }
       }else if( this.glAccountId!=null){
        data = {
            staffId: this.staffId,
        startDate: this.startDate,
        endDate: this.endDate,
        glAccountId : this.GL[0].glAccountId,
        PostedByStaffId:this.relationshipOfficerId,
       }
       ////console.log('data',data);
       
   }else{
                data = {
                    staffId: this.staffId,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    PostedByStaffId:this.relationshipOfficerId,
               }
           }
           
            ////console.log(data);

            this.reportServ.getfinancePostedTransactions(data)
                .subscribe((response: any) => {
                    path = response.result;
                    ////console.log(path);
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    this.displayTestReport = true;
                    ////console.log(path);
                });
                this.loadingService.hide(10000);
            this.displayReport = true;
            return;
        }
    }
    clearInput(){
        this.branchId="";
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






      openGLSearchBoxGL(): void {
        this.displaySearchGL = true;
      }
      searchGL(searchStringVal) {

        this.searchTermGL$.next(searchStringVal);
      }

      pickSearchedGLData(item) {
        this.GLSearched = this.GLSearchResults.filter(x => x.GLAccountId == item.GLAccountId);
        this.GLAccountId = this.GLSearched[0].GLAccount;
        this.displaySearchGL = false;
      }
        //SearchForBranch
      BranchSearch(){
        this.reportServ.SearchForBranch(this.branchSearchText).subscribe((respone) => {
            this.searchResults = respone.result;
        })
      }
      AccountGLSearch(){
        this.reportServ.SearchForGLList(this.gLSearchText).subscribe((respone) => {
            this.GLSearchResults = respone.result;
            ////console.log(' this.GLSearchResults', this.GLSearchResults);
            
        })
      }

      pickSearchedDatas(item) {
        this.GL = this.GLSearchResults.filter(x => x.glAccountId == item.glAccountId);
        ////console.log('GL',this.GL);
        
        this.glAccountId = this.GL[0].glAccount;
        this.displaySearchGL = false;
      }
      clearGL(){
          this.glAccountId="";
      }
}