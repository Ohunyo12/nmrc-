import { LoanService } from '../../../credit/services/loan.service';
import { Component, OnInit } from '@angular/core';



import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { CollateralService } from '../../../setup/services';
//import { Response } from '@angular/http/src/static_response';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    moduleId: module.id,
    templateUrl: 'collateral-estimated.report.component.html',
})
export class CollateralEstimatedReportComponent implements OnInit {
    param: any;
    customerId: any;
    applicationId: any;
    workingLoanApplication: string;
    loanSelection: any[];
    collateralDetail: any[];
    displayTestReport: boolean;
    reportSrc: SafeResourceUrl;
    displayReport: boolean = false;
    searchParam: any;
    
    constructor(private loanSer: LoanService, 
                private sanitizer: DomSanitizer, 
                private loadingService: LoadingService,
                private reportServ: ReportService, 
                private collateralServ: CollateralService) { }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        //this.getCollateralDetails();
    }

    getCollateralEstimatedDetails(searchParam) {
        this.loadingService.show();
        this.collateralServ.getCustomerCollateralReport(searchParam).subscribe((response: any) => {
            this.collateralDetail = response.result;
            this.loadingService.hide();
        })
    }

    getCollateralDetails() {
        this.getCollateralEstimatedDetails(this.searchParam);
    }

    popoverSeeMore(event, selectedId) {
        this.loadingService.show();
        event.preventDefault()

        if (selectedId != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = '';
            let appl = this.collateralDetail.find(x => x.collateralCode == selectedId);

            if (appl != null) {
                this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
                this.displayReport = true;
                this.reportServ.getCollateralEstimated(selectedId)
                    .subscribe((response: any) => {
                        path = response.result;
                        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                        this.loadingService.hide();
                        this.displayTestReport = true;
                    });
            }

            this.loadingService.hide();
            return;
        }
        
        this.loadingService.hide();
    }

}