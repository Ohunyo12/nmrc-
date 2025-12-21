import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ApprovalService, CollateralService, GeneralSetupService } from '../../../setup/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { RacService } from 'app/setup/services/rac.service';

@Component({
  selector: 'app-disbursed-facility-collateral',
  templateUrl: './disbursed-facility-collateral.component.html',

})
export class DisbursedFacilityCollateralComponent implements OnInit {
    displaySearchModal: boolean;
    searchResults: any;
    searchTerm$ = new Subject<any>();
    PAGEOPERATION = 6; displayTestReport: boolean; startDate: Date; endDate: Date;
    loanApplication: any[]; displayReport: boolean; reportSrc: SafeResourceUrl;
  
    classification?: any;
    productId?: any;
    loanDocumentList: any[];
    productNames: any[];
    collateralTypes: any[];
  
  
  
    constructor(private approvalSer: ApprovalService, private loadingSer: LoadingService,
      private generalSetupService: GeneralSetupService,
      private sanitizer: DomSanitizer,
      private reportServ: ReportService,
      private racSer: RacService, private cs: CollateralService) {
  
  
    }
  
    ngOnInit(): void {
      this.getProductNames();
      this.getAllCollateralType();
    }
  
  
    getProductNames() {
      this.loadingSer.show();
      this.racSer.getProducts()
          .subscribe((response: any) => {
              this.productNames = response.result;
              this.loadingSer.hide();
          }, (err) => {
              this.loadingSer.hide(1000);
              
          });
  }

  getAllCollateralType(): void {
    this.loadingSer.show();
    this.cs.getCollateralTypes().subscribe((response: any) => {
        this.collateralTypes = response.result;
        this.loadingSer.hide();
    }, (err) => {
        this.loadingSer.hide(1000);
    });        
}
  
    onOptionSelected(event) {
    }
  
    popoverSeeMore() {
      if (this.classification != null) {
        this.loadingSer.show();
        this.displayTestReport = false;
        this.displayReport = false;
        let path = '';
        let data = null;
  
  
  
  
        data = {
  
          classification: this.classification,
          productId: this.productId
        }
  
  
  
        this.reportServ.getDisbursedFacilityCollateralReport(data)
                .subscribe((response: any) => {
                    path = response.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    this.displayTestReport = true;
                });
                this.loadingSer.hide(10000);
            this.displayReport = true;
            return;
      }
    }
    openSearchBox(): void {
      this.displaySearchModal = true;
    }
    searchDB(searchString) {
      this.searchTerm$.next(searchString);
    }
  
  
//   displayTestReport: boolean;
//     startDate?: Date; endDate?: Date;approvalStatus:any;
//     displayReport = false; reportSrc: SafeResourceUrl;

// productNames? : any;

//     constructor(private loadingService: LoadingService, private reportServ: ReportService,
//         private sanitizer: DomSanitizer
//     ) {
//         let tempSrc = '/';
//         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
//     }

//     ngOnInit() {
//         this.endDate = new Date();
//         this.startDate = new Date();
//     }

//     onOptionSelected(event) {
//     }

//     popoverSeeMore() {
//         this.loadingService.show();

//         if (this.startDate != null && this.endDate != null) {
//            ////console.log('more..', startDate, endDate);
//            this.displayTestReport = false;
//             this.displayReport = false;
//             let path = '';
//            const data = {
//                 startDate: this.startDate,
//                 endDate: this.endDate,
//                 approvalStatus:this.approvalStatus
                
//             }
//             ////console.log(data);
            
//             this.reportServ.getDisbursedFacilityCollateralReport(data)
//                 .subscribe((response: any) => {
//                     path = response.result;
//                     ////console.log("PATH = "+path);
//                     this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
//                     this.displayTestReport = true;
//                     ////console.log(path);
//                 });
//                 this.loadingService.hide(10000);
//             this.displayReport = true;
//             return;
//         }
//     }

}
