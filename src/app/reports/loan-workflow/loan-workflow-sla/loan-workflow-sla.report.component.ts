import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from "../../../setup/services/approval.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';





@Component({
    templateUrl: './loan-workflow-sla.report.component.html'
})
/**
 * PAGEOPERATION
 */

export class LoanWorkflowReportComponent implements OnInit {
    PAGEOPERATION: number  = 6; displayObligorDetails: boolean = false; obligorInfoReady: boolean = false; obligor: any = {};
    workingLoanApplication: string = null; itemTotal: number = 0; applicationSelection: any;
    popoverYposition: string = '0px'; popoverSelectedId?: number = null; display: string = 'none';    
    operations: any[] = [];  operationName: string; operationId: string;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
    constructor(private approvalSer: ApprovalService,private loadingSer: LoadingService ,
         private loanApplicationSer: LoanApplicationService, private sanitizer: DomSanitizer,
         private reportServ: ReportService) { }

    ngOnInit(): void {
        this.getOperations();
        this.getLoanApplication();
        
    }
    displayTestReport: boolean;
    getLoanApplication(){
        this.loanApplicationSer.getLoanApplication() 
        .subscribe((response: any) => {
            this.loanApplication = response.result; 
                 
        });

    }
    
    popoverSeeMore(selectedId) {
        this.loadingSer.show();
        if (selectedId != null) {
            this.displayTestReport = false;
            this.displayReport = false;
            let path: string = '';
            let appl = this.loanApplication.find(x => x.loanApplicationId == selectedId);
            if (appl != null) {
                this.displayTestReport = true;
                this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
               
                this.reportServ.getLoanApplicationSLA(selectedId)
                    .subscribe((response: any) => {
                        path = response.result;
                        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    });
            }
            this.loadingSer.hide(10000);
            this.displayReport = true;
            return;
        }
        // load data ..
    }
    

    
    getOperations() {
        this.approvalSer.getAllOperations().subscribe((response: any) => {
            this.operations = response.result;
            this.operationName = this.operations.find(x => x.lookupId == this.PAGEOPERATION).lookupName;
            this.operationId = this.operations.find(x => x.lookupId == this.PAGEOPERATION).lookupId;
        });
    }

}