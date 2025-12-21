import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../credit/services/loan.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
// import { ReportService } from '../../service/report.service';
import { CollateralService } from '../../../setup/services';
//import { Response } from '@angular/http/src/static_response';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from 'app/reports/service/report.service';

@Component({
  selector: 'app-fixed-deposit-collateral',
  templateUrl: './fixed-deposit-collateral.component.html'
})
export class FixedDepositCollateralComponent implements OnInit {
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
  selectedCollateralCode: any;
  selectedCustomerCode: any;

  constructor(private loanSer: LoanService,
    private sanitizer: DomSanitizer,
    private loadingService: LoadingService,
    private reportServ: ReportService,
    private collateralServ: CollateralService) { }

  ngOnInit() {
  }

  getCollateralEstimatedDetails(searchParam) {
    this.loadingService.show();
    this.collateralServ.getCustomerFixedDepositCollateral(searchParam).subscribe((response: any) => {
      this.collateralDetail = response.result;
      this.loadingService.hide();
    })
  }

  getCollateralDetails() {
    this.getCollateralEstimatedDetails(this.searchParam); //customerCode
  }

  popoverSeeMore(event, row) {
    this.loadingService.show();
    event.preventDefault();
    this.selectedCollateralCode = row.collateralCode;
    this.selectedCustomerCode = row.customerCode;

    if (this.selectedCollateralCode != null) {
      this.displayTestReport = false;
      this.displayReport = false;
      let path: string = '';
      let appl = this.collateralDetail.find(x => x.collateralCode == this.selectedCollateralCode);

      if (appl != null) {
        this.workingLoanApplication = appl.applicationReferenceNumber + ' ' + appl.applicantName;
        this.displayReport = true;
        this.reportServ.getFixedDepositCollaterals(this.selectedCustomerCode)
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
