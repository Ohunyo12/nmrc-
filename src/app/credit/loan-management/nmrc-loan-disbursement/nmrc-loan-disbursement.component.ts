import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-nmrc-loan-disbursement',
  templateUrl: './nmrc-loan-disbursement.component.html',
  styles: []
})
export class NmrcLoanDisbursementComponent implements OnInit {
  loans: any;
  itemTotal: any;
  activeSearchTabindex: any;
  uwsList: any;
  nhfNumber:any
  isUWSModalVisible: boolean = false;
  selectedLoan: any = null;
  isPreviewModalVisible: boolean = false;
  selectedLoanBooking: any;
  selectedLoanDisbursed: any;
  employeeNumber: any;
  itemId: any;
   id: any;
  fileType: any;
  isPmbApprovalDisabled: boolean = true;
  zoomLevel: number = 1;
  dragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  imageList: string[] = []; 
  currentImageIndex: number = 0;
  maxZoom: number = 3; 
  minZoom: number = 1; 
  loanDisbursements: any;
  constructor(private underwritingService: UnifiedUnderwritingStandardService,
        private cdr: ChangeDetectorRef,   private loadingService: LoadingService,) { }

  ngOnInit() {
    this.fetchDisbursedLoans()
  }

  loadLoansLazy(event: any) {
    const page = event.first / event.rows + 1; 
    const rows = event.rows;
    this.fetchDisbursedLoans()

  }

  onSearchTabChange(event: any) {
    this.activeSearchTabindex = event.index;
  }

    // Dummy data for Loan Disbursed
    // loanDisbursements = [
    //   { loanId: 'LD2001', applicationReferenceNumber: 'APP1001', customerName: 'John Doe', amountDisbursed: 4500000, customerAvailableAmount: 500000, currencyCode: 'USD' },
    //   { loanId: 'LD2002', applicationReferenceNumber: 'APP1002', customerName: 'Jane Smith', amountDisbursed: 7000000, customerAvailableAmount: 500000, currencyCode: 'USD' },
    //   { loanId: 'LD2003', applicationReferenceNumber: 'APP1003', customerName: 'Alice Johnson', amountDisbursed: 2900000, customerAvailableAmount: 100000, currencyCode: 'USD' }
    // ];
  
    fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
      this.loadingService.show();
      this.underwritingService.GetScheduledLoanForDisbursement(page).subscribe(
        response => {
          console.log('Fetched Loans:', response);
    
         
          this.loanDisbursements = response.result || [];
          this.itemTotal = response.totalCount || 0; 
        },
        error => {
          console.error('Error fetching loans:', error);
        },
        () => {
          this.loadingService.hide();
        }
      );
    }
  

    onSelectedLoanChange(event: any) {
      this.selectedLoanDisbursed = event.data;
    }
  
    onSelectedDisbursementChange(event: any) {
      this.selectedLoanDisbursed = event.data;
    }
    loanDisbursment(loan: any): void {
    if (!loan || !loan.id) {
      swal("Error", "Invalid loan selected.", "error");
      return;
    }
    console.log("Booking Loan with Payload:", this.selectedLoanDisbursed);
    swal({
      title: "Are you sure?",
      text: `You are about to Disburse a Loan.`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, book it!",
      cancelButtonText: "No, cancel"
    }).then((result) => {
      debugger
      if (result==true) {  
        this.loadingService.show();
      debugger
        this.underwritingService.NmrcLoanDisbursment(this.selectedLoanDisbursed.id) // Send single LoanId
          .subscribe({
            next: (response: any) => {
              this.loadingService.hide();
              if (response.success) {
                this.fetchDisbursedLoans(1, 10);
                this.selectedLoanDisbursed = []; // Clear selected loan after booking

                this.loadingService.hide();
                swal("Fintrak360",response.result, "success");

              
              } else {
                swal("Error", response.message || "An error occurred while booking the loan.", "error");
              }
            },
            error: (error) => {
              this.loadingService.hide();
              console.error("API Error:", error);
              swal("Error", "Failed to book loan.", "error");
            }
          });
      }
    });
  }

}
