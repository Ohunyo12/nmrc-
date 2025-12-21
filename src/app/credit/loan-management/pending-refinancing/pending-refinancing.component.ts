// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-pending-refinancing',
//   templateUrl: './pending-refinancing.component.html',
//   styles: []
// })
// export class PendingRefinancingComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-pending-refinancing',
  templateUrl: './pending-refinancing.component.html',
  styles: []
})
export class PendingRefinancingComponent implements OnInit {
  //loans: any[] = [];
  selectedLoans: any[] = [];
  selectedRefNo: string | null = null;
  itemTotal: number = 0;
  activeSearchTabindex: number = 0;
  selectedLoan: string; 
  selectedSubLoans: any[] = []; 
  uwsList: any;
  isUWSModalVisible: boolean;
  approvedComment: any;
  id: any;

  loanDetails: any[] = []; //

  loanForm = new FormGroup({
    selectedLoan: new FormControl(null)  // Define form control
  });
  loans: any;

  itemsPerPage: number = 5;
  totalPages: number = 0;


  constructor(
    private underwritingService: UnifiedUnderwritingStandardService, 
    private loadingService: LoadingService,  
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit() {
  this.fetchDisbursedLoans();


  }


  loadLoansLazy(event: any) {
    const page = event.first / event.rows + 1; 
    const rows = event.rows;
    this.fetchDisbursedLoans(page, rows);
  }



  fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
    this.loadingService.show();
    this.underwritingService.getAppliedLoanForNmrcRefinance(page).subscribe(
      response => {
        console.log('Fetched Loans:', response);
  
       
        this.loans = response.result || [];
        this.itemTotal = response.totalCount || 0; 
        this.updatePagination()
      },
      error => {
        console.error('Error fetching loans:', error);
      },
      () => {
        this.loadingService.hide();
      }
    );
  }


  


  
 

  viewLoanDetails(RefNo: any, event: Event) {
    const clickedRadio = event.target as HTMLInputElement;

    // Toggle selection: If clicking the same radio button, deselect it
    if (this.selectedLoan === RefNo) {
      this.selectedLoan = null;
      this.loanDetails = [];
      clickedRadio.checked = false; // Uncheck radio button manually
      return;
    }
  

    this.selectedLoan = RefNo;
    this.loanDetails = []; // Clear previous data while loading new one
  

  
    console.log("Fetching details for:", RefNo);

   this.loadingService.show();
    this.underwritingService.getLoanDetailsNew(RefNo).subscribe(
      response => {
        console.log('Loan Details API Response:', response);

  
        if (response && response.success && response.result && Array.isArray(response.result) && response.result.length > 0) {
          this.selectedLoan = RefNo;
          this.loanDetails = response.result;
          this.loadingService.hide();
        } else {
          this.loanDetails = [];
        }
      },
      error => {
        console.error('Error fetching loan details:', error);
      }
 
    );
  }
  
  

  currentPage = 1;
  //itemsPerPage = 3;

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.itemTotal / this.itemsPerPage));  
  }  
  get displayedLoans() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.loans.slice(start, start + this.itemsPerPage);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

onSearchTabChange(event: any): void {
  this.activeSearchTabindex = event.index;
}

  }