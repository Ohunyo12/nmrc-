import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    moduleId: module.id,
    templateUrl: 'loan-schedule.report.component.html',
})
export class LoanScheduleReportComponent implements OnInit {
    branchSearched: any[];
    searchResults: any[];
    displaySearchModal: boolean = false;
    workingLoanApplication: string; loanSelection: any[];
    branchId?: any; BranchList: any[]; param?: any;
    searchTerm$ = new Subject<any>();
    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl; displayReport: boolean = false;
    //  displayReport: boolean = false;
    constructor(private loanSer: LoanService, private sanitizer: DomSanitizer,
        private reportServ: ReportService, private branchService: BranchService, private loadingSer: LoadingService, ) {

        this.reportServ.BranchSearchObservable(this.searchTerm$)
            .subscribe(results => {
                this.searchResults = results.result;
                ////console.log('search item', this.searchResults);
            });
    }

    ngOnInit() {

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        //
        // this.getLoanDetails();
        //   this.getAllBranched();
    }
    getLoanDetails() {
        let data = null;
        //// if(this.branchId!=null || this.param!=null){

        if (this.branchId != null) {
            data = {
                branchId: this.branchSearched[0].branchId,
                param: this.param
            }
        } else {
            data = {
                param: this.param,
                branchId: this.branchId
            }
        }
        ////console.log('data',data);



        ////console.log(data);
        this.loadingSer.show();
        this.loanSer.getLoanDetailsWithParam(data).subscribe((response: any) => {
            this.loanDetail = response.result;
            ////console.log(this.loanDetail);
            this.loadingSer.hide();
        });

        // }else{
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please provide search parameter', 'error');
        // }

    }
    getAllBranched() {
        this.branchService.getBranches().subscribe((response: any) => {
            this.BranchList = response.result;
            ////console.log(this.BranchList);
        });
    }

    popoverSeeMore(selectedId) {
        this.loadingSer.hide(10000);
        if (selectedId != null) {
            ////console.log('more..', selectedId); 
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = '';
            let appl = this.loanDetail.find(x => x.loanId == selectedId);
            if (appl != null) {

                this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
                this.displayReport = true;
                this.reportServ.getLoanRepaymentSchedule(selectedId)
                    .subscribe((response: any) => {
                        path = response.result;
                        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                        ////console.log(path);
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