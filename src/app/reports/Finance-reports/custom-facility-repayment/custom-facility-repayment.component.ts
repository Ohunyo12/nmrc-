import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { BranchService } from '../../../setup/services/branch.service';

@Component({
    selector: 'app-custom-facility-repayment',
    templateUrl: './custom-facility-repayment.component.html',


})
export class CustomFacilityRepaymentComponent implements OnInit {
    PAGEOPERATION = 6; displayTestReport: boolean; startDate?: Date; endDate?: Date;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl; branchId?: any;
    BranchList: any[]; transactionTypeId?: any; TransactionTypeList: any[]; categoryId?: any; CategoryList: any[];
    FlowTypeList: any[];
    valueCode: any;

    constructor(
        private sanitizer: DomSanitizer, private loadingService: LoadingService,
        private reportServ: ReportService, private branchService: BranchService) {


    }

    ngOnInit(): void {
        this.startDate = new Date();
        this.endDate = new Date();
        this.getFlowType();
    }

    popoverSeeMore() {
        this.loadingService.show();
        if (this.startDate != null && this.endDate != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            let data = null;

            data = {
                startDate: this.startDate,
                endDate: this.endDate,
                valueCode: this.valueCode

            }


            this.reportServ.GetCustomFacilityRepaymentReport(data)
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
    getFlowType() {
        this.reportServ.GetFlowType().subscribe((response: any) => {
            this.FlowTypeList = response.result;
        });
    }
}