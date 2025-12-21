import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2'; 

@Component({
  selector: 'app-nmrc-loan-booking',
  templateUrl: './nmrc-loan-booking.component.html',
  styles: []
})
export class NmrcLoanBookingComponent implements OnInit {
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
  loanBookings: any;
  loan: any;
  displayRestructureModal: boolean = false;
  selectedSchedule: any = {};
  errorMessage: string = '';
  displayScheduleModal = false;
  loanSchedule: any[] = [];
  scheduleView: any[] = [];
  displayScheduleModalForm = false;
  schedules: any[];
  isModalOpen = false; // Track modal state


  constructor(private underwritingService: UnifiedUnderwritingStandardService,
      private cdr: ChangeDetectorRef,
      private loadingService: LoadingService,) { }

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




  // fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
  //   this.loadingService.show();
  //   this.underwritingService.GetScheduledLoanForBooking(page).subscribe(
  //     response => {
  //       console.log('Fetched Loans:', response);
   
       
  //       this.loanBookings = response.result || [];
  //       this.itemTotal = response.totalCount || 0; 
  //       console.log('Fetch Schedule booking Loans:', this.loanBookings);
  //     },
  //     error => {
  //       console.error('Error fetching loans:', error);
  //     },
  //     () => {
  //       this.loadingService.hide();
  //     }
  //   );
  // }

  fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
    this.loadingService.show();
  
    this.underwritingService.GetScheduledLoanForBooking(page).subscribe(
      response => {
        console.log('Fetched Loans:', response);
        
        this.loanBookings = response.result || [];
        this.itemTotal = response.totalCount || 0; 
        
        console.log('Fetch Schedule booking Loans:', this.loanBookings);
      },
      error => {
        console.error('Error fetching loans:', error);
      },
      () => {
        this.loadingService.hide(); // Ensure this runs in all cases
      }
    );
  }
  



  onSelectedLoanChange(event: any): void {
    console.log('Row Selected:', event);
    if (!event || !event.data) {
      console.error('Invalid row selection:', event);
      return;
    }
  
    this.selectedLoanBooking = event.data;
    console.log('Updated selectedLoanBooking:', this.selectedLoanBooking);
  }
  
  openUWSModal(loanBookings: any) {
    this.isModalOpen = true; // Disable "Book Loan" button
    this.loadingService.show();

  
    setTimeout(() => {

  
      this.selectedLoanBooking = loanBookings;
      this.displayScheduleModalForm = true;

  
      console.log('Selected Loan Booking:', this.selectedLoanBooking);
      
      this.fetchViewSchedule(); // Pass valid data
      this.loadingService.hide();
    }, 50);
  }
  

  // Bookloan(loan: any): void {
  //   if (!loan || !loan.id) {
  //     swal("Error", "Invalid loan selected.", "error");
  //     return;
  //   }
  
  //   this.isModalOpen = true; // Disable "Book Loan" button while modal is open
  //   this.selectedLoanBooking = loan;
    
  //   console.log("Booking Loan with Payload:", this.selectedLoanBooking);
    
  //   swal({
  //     title: "Are you sure?",
  //     text: `You are about to book Loan.`,
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, book it!",
  //     cancelButtonText: "No, cancel"
  //   }).then((result) => {
  //     if (result === true) {  
  //       this.loadingService.show();
  
  //       this.underwritingService.BookLoanNMRC(this.selectedLoanBooking.id) // Send single LoanId
  //         .subscribe({
  //           next: (response: any) => {
  //             this.loadingService.hide();
  
  //             if (response.success) {
  //               swal("Fintrak360", response.result, "success").then(() => {
  //                 this.closeModal(); // Close modal & enable button after closing
  //               });
  
  //             } else {
  //               swal("Error", response.message || "An error occurred while booking the loan.", "error");
  //             }
  //           },
  //           error: (error) => {
  //             this.loadingService.hide();
  //             console.error("API Error:", error);
  //             swal("Error", "Failed to book loan.", "error");
  //           }
  //         });
  //     } else {
  //       this.isModalOpen = false; // Re-enable button if user cancels
  //     }
  //   });
  // }
  Bookloan(loan: any): void {
    this.isModalOpen = false; // Disable "Book Loan" button
    if (!loan || !loan.id) {
      swal("Error", "Invalid loan selected.", "error");
      return;
     } //rewrite this enable after view schedule modal is closed 

  
    console.log("Booking Loan with Payload:", this.selectedLoanBooking);
    swal({
      title: "Are you sure?",
      text: "You are about to book Loan.",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, book it!",
      cancelButtonText: "No, cancel"
    }).then((result) => {
      debugger
      if (result==true) {  
        this.loadingService.show();
      debugger
        this.underwritingService.BookLoanNMRC(this.selectedLoanBooking.id) // Send single LoanId
          .subscribe({
            next: (response: any) => {
              this.loadingService.hide();
              if (response.success) {
                this.fetchDisbursedLoans(1, 10);
                this.selectedLoanBooking = []; // Clear selected loan after booking

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



  fetchViewSchedule(): void {
    this.loadingService.show();
    if (!this.selectedLoanBooking || this.selectedLoanBooking.length === 0) {
      console.error("No loan selected");
      return;
    }
  
    // const loanId = this.selectedLoanBooking[0].id;
    const loanId = this.selectedLoanBooking.map(item => item.id);

    this.underwritingService.getLoanSchedule(loanId).subscribe(
      response => {
        if (response && response.result) {
          this.scheduleView = response.result; // Store the entire response object
          this.schedules = [response.result]; // If multiple records, assign the array
          this.loadingService.hide();
        } else {
          console.warn("No schedule data found");
          //this.scheduleView = {};
          this.schedules = [];
        
        }
        console.log('Fetched scheduleView:', this.scheduleView);
        console.log('Fetched scheduleView:', this.scheduleView);

      },
      error => {
        console.error('Error fetching loan schedule:', error);
        //this.scheduleView = {};
        this.schedules = [];
      }
    );
  }
  


  closeModal() {
    this.displayScheduleModalForm = false;
    this.scheduleView = []; // Clear previous data
    this.isModalOpen = false; // Enable "Book Loan" button
  
    this.loadingService.show(); // Show loading before fetching new data
  
    setTimeout(() => {
      this.loadingService.hide(); // Hide loading immediately
      
    }, 500); // Small delay for UI smoothness
  }
  


}
