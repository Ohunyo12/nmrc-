import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from "../../../setup/services/approval.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from 'app/setup/services';





@Component({
    templateUrl: './insurance-policy-report.component.html'
})


export class InsurancePolicyReportComponent implements OnInit {

    displaySearchModal: boolean;
    searchResults: any;
    insurancePolicies: any[];
    displayTestReport: boolean; startDate: Date; endDate: Date;branchId:any;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
    staffPosting: any[]; staffId = 0;
    valueCode: string = "All";
    businessUnit: any;
    businessUnitId: number;
    
    constructor(private collateralService: CollateralService,private loadingService: LoadingService,
         private sanitizer: DomSanitizer,
        private reportServ: ReportService) { 
        }

        ngOnInit(): void {
          this.startDate = new Date();
            this.endDate = new Date();
            this.getProfileBusinessUnits();
    }
    getProfileBusinessUnits() {
        this.collateralService.getProfileBusinessUnits().subscribe((response) => {
            this.businessUnit = response.result;
        });
    }
  
      popoverSeeMore() {
          this.loadingService.show();
          if (this.startDate != null && this.endDate != null) {
              this.displayReport = false;
             let  data = {
                  startDate: this.startDate,
                  expiryDate: this.endDate,
                  valueCode: this.valueCode,
                  businessUnitId: this.businessUnitId
              }
   
              this.collateralService.getCollateralInsurancePolicyList(data).subscribe((response) => {
                    this.insurancePolicies = response.result;
                    this.displayReport = true;
                  });
              this.loadingService.hide(60000);
          }
      }
     
  }