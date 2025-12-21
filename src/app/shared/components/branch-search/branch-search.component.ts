import { Component, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ReportService } from '../../../reports/service/report.service';
import { BranchService } from '../../../setup/services';

@Component({
  selector: 'branch-search',
  templateUrl: './branch-search.component.html',
})
export class BranchSearchComponent implements OnInit {
  @Output() branchId: any;
  branchSearched: any;
  searchResults: any;
  searchTerms$ = new Subject<any>();
  displaySearchModal: boolean;
  constructor(private reportServ: ReportService,private branchService: BranchService) {

    this.reportServ.BranchSearchObservable(this.searchTerms$)
            .subscribe(results => {
              this.searchResults = results.result;
            });
            
   }

  ngOnInit() {
  }


  openSearchBox(): void {
    this.displaySearchModal = true;
  }
  searchDB(searchString) {
    this.searchTerms$.next(searchString);
  }
  pickSearchedData(item) {
    this.branchSearched = this.searchResults.filter(x => x.branchId == item.branchId);
    
    this.branchId = this.branchSearched[0].branchName;
    this.displaySearchModal = false;
  }
  
}
