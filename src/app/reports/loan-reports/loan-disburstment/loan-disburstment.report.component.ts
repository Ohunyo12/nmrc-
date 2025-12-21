import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from "../../../setup/services/approval.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { BranchService, ProductService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';





@Component({
    templateUrl: './loan-disburstment.report.component.html'
})
/**
 * PAGEOPERATION
 */

export class LoanDisburstmentReportComponent implements OnInit {
    branchSearched: any;
    displaySearchModal: boolean;
    searchResults: any;
    auditTypeId: any;
    searchTerm$ = new Subject<any>();
    PAGEOPERATION = 6; displayTestReport: boolean; startDate?: Date; endDate?: Date;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl; branchId?: any;
    loanRefNo?: any; BranchList: any[]; productClassId?: any; productClassList: any[];

    constructor(private approvalSer: ApprovalService, private productService: ProductService,
        private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer, private loadingService: LoadingService,
        private reportServ: ReportService, private branchService: BranchService) {

        this.reportServ.BranchSearchObservable(this.searchTerm$)
            .subscribe(results => {
                this.searchResults = results.result;
            });
    }

    ngOnInit(): void {
        this.startDate = new Date();
        this.endDate = new Date();
        this.getAllBranched();
        this.getAllProductClass();
    }

    popoverSeeMore() {
        this.loadingService.show();
        if (this.startDate != null && this.endDate != null) {
            ////console.log('more..', startDate, endDate);
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            let data = null;
            if (this.branchId != null) {
                data = {
                    branchId: this.branchSearched[0].branchId,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    loanRefNo: this.loanRefNo,
                    productClassId: this.productClassId

                }
            } else {
                data = {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    branchId: this.branchId,
                    loanRefNo: this.loanRefNo,
                    productClassId: this.productClassId

                }
            }


            ////console.log(data);

            this.reportServ.getDisburstLoanReport(data)
                .subscribe((response: any) => {
                    path = response.result;
                    ////console.log("PATH = "+path);
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    this.displayTestReport = true;
                    ////console.log(path);
                });
            this.loadingService.hide(10000);
            this.displayReport = true;
            return;
        }
    }
    getAllBranched() {
        this.branchService.getBranches().subscribe((response: any) => {
            this.BranchList = response.result;
            ////console.log(this.BranchList);
        });
    }
    getAllProductClass() {
        this.productService.getAllProductClasses().subscribe((response: any) => {
            this.productClassList = response.result;
            ////console.log(this.productClassList);
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

    clearInput() {
        this.branchId = "";
    }
}