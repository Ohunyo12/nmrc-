import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchService } from '../../../setup/services';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';

@Component({
    moduleId: module.id,
  templateUrl: 'loan-fcyscheuled.report.component.html',
})
// tslint:disable-next-line:class-name
export class fcyscheuledReportComponent implements OnInit{
    param: any;
    branchSearched: any;
    displaySearchModal: boolean;
    searchResults: any;
    searchTerm$ = new Subject<any>();
    workingLoanApplication: string; loanSelection: any[]; customerName?: any; branchId?: any; BranchList: any[];
    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl; displayReport = false;
  //  displayReport: boolean = false;
  constructor(private loanSer: LoanService , private sanitizer: DomSanitizer,
        
        private reportServ: ReportService, private branchService: BranchService, private loadingSer: LoadingService ){

            this.reportServ.BranchSearchObservable(this.searchTerm$)
            .subscribe(results => {
              this.searchResults = results.result;
              ////console.log('search item', this.searchResults);
            });

        }

    ngOnInit() {


     //   this.getAllBranched();
    }
    getAllBranched()
    // tslint:disable-next-line:one-line
    {
        this.branchService.getBranches().subscribe((response: any) => {
            this.BranchList = response.result;
            ////console.log(this.BranchList);
        });
    }
    // tslint:disable-next-line:one-line
    getLoanDetails(){
        
        let data = null;
        if(this.branchId!=null){
          data = {
             branchId : this.branchSearched[0].branchId,
             param : this.param,
         }
     }else{
          data = {
            param : this.param,
         }
     }
        this.loadingSer.show();
        this.loanSer.getLoanDetailsWithParam(data).subscribe((response: any) => {
            this.loanDetail = response.result;
            ////console.log(this.loanDetail);
            this.loadingSer.hide();
        });
}

    popoverSeeMore(e, selectedId) {
        ////console.log('more..', e);
        if (selectedId != null) {
            ////console.log('more..', selectedId,this.loanDetail); 
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = '';
            let appl = this.loanDetail.find(x => x.loanId == selectedId);
            if (appl != null) {

                this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
                this.displayReport = true;
                this.reportServ.GetFCYScheuledLoan(selectedId)
                    .subscribe((response: any) => {
                        path = response.result;
                        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                        this.loadingSer.hide(10000);
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
      searchDB(searchString) {
        this.searchTerm$.next(searchString);
      }
      pickSearchedData(item) {
        this.branchSearched = this.searchResults.filter(x => x.branchId == item.branchId);
        this.branchId = this.branchSearched[0].branchName;
        this.displaySearchModal = false;
      }
      
}