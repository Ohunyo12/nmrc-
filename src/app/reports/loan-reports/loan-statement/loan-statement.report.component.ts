import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit, Input } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    moduleId: module.id,
    templateUrl: 'loan-statement.report.component.html',
})
export class LoanStatementReportComponent implements OnInit {
    param?: any;

    branchSearched?: any;
    displaySearchModal: boolean;
    searchTerm$(arg0: any): any {
        throw new Error("Method not implemented.");
    }
    searchResults: any;
    searchTerms$ = new Subject<any>();
    workingLoanApplication: string; loanSelection: any[]; customerName?: any;

    @Input() branchId?: any;

    BranchList: any[];

    loanDetail: any[]; displayTestReport: boolean; reportSrc: SafeResourceUrl; displayReport: boolean = false;

    //  displayReport: boolean = false;

    constructor(private loanSer: LoanService, private sanitizer: DomSanitizer,
        private reportServ: ReportService, private branchService: BranchService, private loadingSer: LoadingService) {

        this.reportServ.BranchSearchObservable(this.searchTerms$)
            .subscribe(results => {
                this.searchResults = results.result;
                ////console.log('search item', this.searchResults);
            });
    }

    ngOnInit() {

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        //this.getLoanDetails();
        this.getAllBranched();

    }
    clearInput() {
        this.branchId = "";
    }

    getAllBranched() {
        this.branchService.getBranches().subscribe((response: any) => {
            this.BranchList = response.result;
            ////console.log(this.BranchList);
        });
    }
    getLoanDetails() {
        let data = null;

        // if(this.branchId!=null || this.param!=null){

        if (this.branchId != null) {
            data = {
                branchId: this.branchSearched[0].branchId,
                param: this.param,


            }
        } else {
            data = {
                branchId: this.branchId,
                param: this.param

            }
        }



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
    //PopUp report Viewer
    popoverSeeMore(e, selectedId) {
        this.loadingSer.show();
        if (selectedId != null) {
            //console.log('more..', selectedId,this.loanDetail); 
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = '';
            let appl = this.loanDetail.find(x => x.loanId == selectedId);
            if (appl != null) {

                this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
                this.displayReport = true;
                this.reportServ.getLoanStatement(selectedId)
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
        this.searchTerms$.next(searchString);
    }
    pickSearchedData(item) {
        this.branchSearched = this.searchResults.filter(x => x.branchId == item.branchId);
        ////console.log('this.branchSearched',this.branchSearched);

        this.branchId = this.branchSearched[0].branchName;
        this.displaySearchModal = false;
    }
}