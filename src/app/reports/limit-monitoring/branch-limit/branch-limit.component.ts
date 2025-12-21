import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({

    templateUrl: 'branch-limit.component.html'

})
export class BranchLimitComponent implements OnInit {
    [x: string]: any;
    displayTestReport: boolean;
    displaySearchModal: boolean;
    branchSearched: any;
    branchId: any;
    displayReport: boolean = false; reportSrc: SafeResourceUrl;showButton: boolean= false;
    constructor(private reportServ: ReportService, private sanitizer: DomSanitizer,
        private loadingService: LoadingService) { }

    ngOnInit() { }
    showPopup() {
        this.displayReport = true;
    }
    
    popoverSeeMore() {
       if (this.startDate != null && this.endDate != null) {
      this.loadingService.show();
      this.displayTestReport = false;
      this.displayReport = false;
      let path = '';
      let data = null;


      if (this.branchId != null) {
        data = {
          branchId: this.branchSearched[0].branchId,
          startDate: this.startDate,
          endDate: this.endDate,
          searchParameter: this.searchParameter,

        }
      } else {
        data = {
          startDate: this.startDate,
          endDate: this.endDate,
          searchParameter: this.searchParameter,

        }
      }
        this.reportServ.getBranchLimit()
            .subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.loadingService.hide(10000);
                this.showButton = true;
                this.displayReport = true;
            }); return;
    }

    }
    // load data ..
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

}