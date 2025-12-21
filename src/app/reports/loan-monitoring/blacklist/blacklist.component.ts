import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { LoadingService } from '../../../shared/services/loading.service';
// import { sha256, sha224 } from 'js-sha256';


@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
//  styleUrls: ['./blacklist.component.scss']
})
export class BlacklistComponent implements OnInit {

  branchSearched: any;
  displaySearchModal: boolean;
  searchResults: any;

  PAGEOPERATION = 6;   displayTestReport: boolean; startDate?: Date; endDate?: Date;
  loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;branchId?:any;
  loanRefNo?:any;BranchList:any[];productClassId?:any;productClassList:any[];
  customerCode: any;
    encryptedLink: any;

  constructor(
       private sanitizer: DomSanitizer,private loadingService: LoadingService,
       private reportServ: ReportService) {


        }


  ngOnInit(): void {
        this.startDate = new Date();
       this.endDate = new Date();

  }

  popoverSeeMore() {
      this.loadingService.show();
      if (this.startDate != null && this.endDate != null) {
         this.displayTestReport = false;
          this.displayReport = false;
          let path = '';

           const  data = {

                 startDate: this.startDate,
                 endDate: this.endDate,
                 customerCode:this.customerCode,
             }
         
          
         
          this.reportServ.getBlacklistReport(data)
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
}