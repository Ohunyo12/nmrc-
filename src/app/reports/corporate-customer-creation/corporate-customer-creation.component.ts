import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../service/report.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-corporate-customer-creation',
  templateUrl: './corporate-customer-creation.component.html',
  //styleUrls: ['./original-document-submission.component.scss']
})
export class CorporateCustomerCreationComponent implements OnInit {

  PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  username?: any; BranchList: any[];
  searchResults: any;
  displaySearchModal: boolean = false;
  AuditTypeSearched: any;
  referenceNumber: any;
  stagingSearch: any;

  constructor( private loadingService: LoadingService,
   private sanitizer: DomSanitizer,
    private reportServ: ReportService) {

  }

  ngOnInit() {

    this.startDate = new Date();
    this.endDate = new Date();
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
        referenceNumber: this.referenceNumber,
      }


      this.reportServ.getCorporateCustomerCreation(data).subscribe((response: any) => {
        path = response.result;
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
      });
      this.loadingService.hide(10000);
      this.displayReport = true;
      return;
    }
  }


  
}