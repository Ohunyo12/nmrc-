import { Component, OnInit } from '@angular/core';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { AppConstant } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-refinance-loan-disbursement',
  templateUrl: './refinance-loan-disbursement.component.html',
  styleUrls: []
})
export class RefinanceLoanDisbursementComponent implements OnInit {
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

  loans: any;

  itemsPerPage: number = 5;
  totalPages: number = 0;
  loan: any;
  refinanceNumber : any;

  constructor(private underwritingService: UnifiedUnderwritingStandardService,private loadingService: LoadingService,) { }

  ngOnInit() {
   this.fetchDisbursedLoans() 
  }

  loadLoansLazy(event: any) {
    const page = event.first / event.rows + 1; 
    const rows = event.rows;
    this.fetchDisbursedLoans(page, rows);
  }



  fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
    this.loadingService.show();
    this.underwritingService.GetAppliedLoanForNmrcRefinance(page).subscribe(
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
    this.underwritingService.GetSubLoanForDisbursement(RefNo).subscribe(
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
  
  
  toggleLoanSelection(loan: any): void {
    const index = this.selectedLoans.indexOf(loan.refinanceNumber);
    if (index > -1) {
      // Remove from selected if already checked
      this.selectedLoans.splice(index, 1);
    } else {
      // Add to selected list if not checked
      this.selectedLoans.push(loan.refinanceNumber);
    this.refinanceNumber = loan.refinanceNumber;
      console.log( this.refinanceNumber);
    }
    console.log('Selected Loans:', this.selectedLoans);
  }
  
  // Select/Deselect All Loans when clicking the checkbox
  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedLoans = this.loans.map(loan => loan.refinanceNumber);
    } else {
      this.selectedLoans = [];
    }
    console.log('All Selected Loans:', this.selectedLoans);
  }
  
  // Select/Deselect All Loans when clicking the checkbox
 


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



  
  




  // approveSelectedLoans(RefNo:string) {
  //   console.log("Selected Loans:", this.selectedLoans);
  
  //   if (!Array.isArray(this.selectedLoans) || this.selectedLoans.length === 0) {
  //     swal("FinTrak Credit 360", "No loan selected to approve.", "error");
  //     return;
  //   }
  
  //   const body: string[] = this.selectedLoans.map(loan => this.loan.referenceNumber);
    
    
  
  
  //   swal({
  //     title: "Are you sure?",
  //     text: "Do you want to approve this loan(s)?",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes",
  //     cancelButtonText: "No, cancel!"
  //   }).then((confirmed) => {
  //     if (confirmed) {
  //       this.loadingService.show();
  
  //       this.underwritingService.DisburseApprovedRefinance(RefNo:string).subscribe({
  //         next: (response) => {
  //           this.loadingService.hide();
  
  //           console.log("API Response:", response);
  
  //           if (response.success) {
  //             swal("FinTrak Credit 360", "Refinancing Checklist Approved", "success").then(() => {
  //               this.selectedLoans = []; // Clear selected loans after approval
  //               this.fetchDisbursedLoans(1, 10); // Refresh table
  //             });
  //           } else {
  //             swal("FinTrak Credit 360", response.message || "An error occurred while approving refinancing checklis", "error");
  //           }
  //         },
  //         error: (error) => {
  //           this.loadingService.hide();
  //           console.error("API Error:", error);
  //           swal("FinTrak Credit 360", "An error occurred while approving refinancing checklist", "error");
  //         }
  //       });
  //     }
  //   });
  // }

  approveSelectedLoans(): void {
    if (this.selectedLoans.length === 0) {
      swal("Error", "Please select at least one loan to approve.", "error");
      return;
    }

      // let body = {

      //   refinanceNumber : this.selectedLoans
        
      // };
      // console.log(this.refinanceNumber)

      console.log( this.selectedLoans);
    swal({
      title: "Are you sure?",
      text: "You are about to tranch selected loan(s).",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Yes, approve!",
      cancelButtonText: "No, cancel"
    }).then((result) => {
      debugger
      if (result==true) {
        debugger
        this.loadingService.show();
  
        this.underwritingService.TranchLoan(this.selectedLoans)
          .subscribe({
            next: (response: any) => {
              this.loadingService.hide();
              if (response.success) {
                this.fetchDisbursedLoans(1, 10);
                this.selectedLoans = []; // Clear selected loans after approval
                this.loanDetails = [];


                this.loadingService.hide();
                swal("Fintrak360","Loan has been tranched and forward for loan restructuring", "success"); 

              } else {
                swal("Error", response.message || "An error occurred while approving loans.", "error");
              }
            },
            error: (error) => {
              this.loadingService.hide();
              console.error("API Error:", error);
              swal("Error", "Failed to approve loans.", "error");
            }
          });
      }
    });
  }








onSearchTabChange(event: any): void {
  this.activeSearchTabindex = event.index;
}

  



}
