import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanPerformanceService } from '../../services/loan-performance.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-loan-performance',
  templateUrl: './loan-performance.component.html',
})
export class LoanPerformanceComponent implements OnInit {
  loanData: any[];
  itemTotal: number;
  prudentialGuildlineStatus: any[];
  multiSortMeta: any = [];
  filters: any = [];
  searchBox: any = '';
  loanSystemTypeId: number ;
  selectedApplicationRefNumber: string;
  selectedloanReviewApplicationId: number;
  gb: any;
  searchTerm$ = new Subject<any>();
  displayDetailsModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  termLoanId: number = null;
  searchString: string;

  constructor(private loadingService: LoadingService,
    private loanPerformanceService: LoanPerformanceService) {
    this.loanPerformanceService.searchLoanPerformance(this.searchTerm$)
      .subscribe(results => {
        ////console.log('filtered items', results);
        this.loanData = results.result;
        this.itemTotal = results.count;
      });
  }

  ngOnInit() {
   // //console.log('filtered items', "Initialize");
    this.getAllPrudentialGuildlineStatus();
  }

  searchDataBase() {
    //this.searchTerm$.next(searchString);
 this.loanPerformanceService.searchPerformingLoans(this.searchString)
      .subscribe(results => {
          this.loanData = results.result;
          this.itemTotal = results.count;

        ////console.log('search item', this.loanData);
      });
  }

  getAllPrudentialGuildlineStatus() {
    this.loanPerformanceService.getAllPrudentialGuildlineStatus().subscribe((response: any) => {
      this.prudentialGuildlineStatus = response.result;
    });
  }
  getAllLoans(page: number, itemsPerPage: number) {
    this.loadingService.show();
    this.loanPerformanceService.getAllLoans(page, itemsPerPage)
      .subscribe((response: any) => {
        this.loanData = response.result;
        this.itemTotal = response.count;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      });
  }
  loanDataLazy(event: LazyLoadEvent) {
    this.loadingService.show();
    this.loanPerformanceService.getAllLoans(event.first, event.rows)
      .subscribe((response: any) => {
        this.loanData = response.result;
        this.itemTotal = response.count;

        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
        ////console.log('audit trail error', err);
      });

    if (event.globalFilter) {
      this.searchDB(event.first, event.globalFilter);
    }
  }
  searchDB(page, searchString) {
    this.searchTerm$.next('?page=' + page + '&searchQuery=' + searchString);
  }
  onEditInit(event) {

  }
  onEdit(event) {

  }
  onEditComplete(event) {

  }
  onEditCancel(event) {

  }
  onPerformanceStatusChanged(data, value) {
    const row = data;
    ////console.log("Loan Data", row);
    ////console.log("Loan Status", value);

    let bodyObj = {
      prudentialGuidelineStatusId: value,
      loanId: row.loanId,
      prudentialGuidelineTypeId: 0,
      productTypeId: row.productTypeId,
      loanSystemTypeId : row.loanSystemTypeId
    }
    const __this = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to change the performance status!',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success btn-move',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    }).then(function () {
      __this.loadingService.show();
      __this.loanPerformanceService.loanPerformanceStatusChange(bodyObj).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'info');
      }
    });
  }
  viewLoanDetails(index) {
    const row = index;
    this.displayDetailsModal = true;
    this.displayCustomerLoanDetails = true;
    this.termLoanId = row.loanId;
    this.loanSystemTypeId = row.loanSystemTypeId;
  }

}
