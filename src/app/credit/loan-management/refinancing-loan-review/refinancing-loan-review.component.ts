import { LoadingService } from 'app/shared/services/loading.service';
import { UnifiedUnderwritingStandardService } from '../../services/underwriting-obligor.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

export enum Options {
  Yes = 1,
  No,
  Waived,
  Defer,
}

@Component({
  selector: 'app-refinancing-loan-review',
  templateUrl: './refinancing-loan-review.component.html',
  styles: []
})

export class RefinancingLoanReviewComponent implements OnInit {

  loans: any[] = [];
  activeSearchTabindex: any;
  uwsList: any[] = [];
  nhfNumber: string = "";
  isUWSModalVisible: boolean = false;
  selectedLoan: any;
  isPreviewModalVisible: boolean = false;
  selectedDocumentUrl: SafeResourceUrl | null = null;
  selectedLoans: any;
  employeeNumber: any;
  itemId: any;
  id: any;
  fileType: any;
  isPmbApprovalDisabled: boolean = true;
  approvedComment: string = '';
  zoomLevel: number = 1;
  dragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  imageList: string[] = [];
  currentImageIndex: number = 0;
  maxZoom: number = 3;
  minZoom: number = 1;
  loanDetails: any[] = [];

  itemsPerPage: number = 5;
  totalPages: number = 1;
  currentPage = 1;
  itemTotal = 0;
  noLoanMessage: string;
  selectedLoanId: string | null = null;
  selectedLoanDetail: any = null;
  selectedChildLoan: any[] = [];

  constructor(
    private underwritingService: UnifiedUnderwritingStandardService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {
    this.selectedChildLoan = [];
  }

  ngOnInit() {
    this.fetchLoansForReview();
    this.fetchObligorUUS();
    this.viewDocument
  }

  onSearchTabChange(event: any) {
    this.activeSearchTabindex = event.index;
  }

  fetchLoansForReview(rows: number = 5): void {
    this.loadingService.show();
    this.underwritingService.getAppliedLoanForNmrcReviewal().subscribe(
      response => {
        console.log('Fetched Loans:', response);


        // this.loans = response.result || [];
        // this.itemTotal = this.loans.length; 
        // this.updatePagination();

        if (response.success && Array.isArray(response.result) && response.result.length > 0) {
          this.loans = response.result;
        } else {
          this.loans = []; // Clear table
          this.noLoanMessage = response.message || "No loan record found."; // Show backend message
        }
        this.itemTotal = this.loans.length || 0;
        this.updatePagination();

      },
      error => {
        console.error('Error fetching loans:', error);
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  // viewLoanDetails(RefinanceNumbr: any, event: Event) {
  //   const clickedRadio = event.target as HTMLInputElement;

  //   if (this.selectedLoan === RefinanceNumbr) {
  //     this.selectedLoan = null;
  //     this.loanDetails = [];
  //     clickedRadio.checked = false;
  //     return;
  //   }

  //   this.selectedLoan = RefinanceNumbr;
  //   this.loanDetails = []; // Clear previous data while loading new one
  //   this.noLoanMessage = ""; // Reset message
  //   this.loadingService.show(); // Show loading indicator

  //   console.log("Fetching details for:", RefinanceNumbr);

  //   this.underwritingService.getSubLoanForNmrcReview(RefinanceNumbr).subscribe(
  //     response => {
  //       console.log('Loan Details API Response:', response);

  //       if (response.success && Array.isArray(response.result) && response.result.length > 0) {
  //         this.loanDetails = response.result;
  //       } else {
  //         this.loanDetails = []; // Clear table
  //         this.noLoanMessage = response.message || "No loan record found."; // Show backend message
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching loan details:', error);
  //       this.loanDetails = [];
  //       this.noLoanMessage = "Error fetching loan details. Please try again.";
  //     },
  //     () => {
  //       this.loadingService.hide(); // Hide loading indicator
  //     }
  //   );
  //   this.onSelectionChange();
  // }

  viewLoanDetails(refinanceNumber: string) {
    // If the same loan is selected, deselect it
    if (this.selectedLoan === refinanceNumber) {
      this.selectedLoan = null;
      this.loanDetails = [];
      this.noLoanMessage = '';
    } else {
      // Select a new loan
      this.selectedLoan = refinanceNumber;
      this.selectedLoanId = refinanceNumber;
      this.loanDetails = [];
      this.noLoanMessage = '';
      this.loadingService.show();

      this.underwritingService.getSubLoanForNmrcReview(refinanceNumber).subscribe(
        (response) => {
          console.log('Loan Details API Response:', response);
          if (response.success && Array.isArray(response.result) && response.result.length > 0) {
            this.loanDetails = response.result;
          } else {
            this.loanDetails = [];
            this.noLoanMessage = response.message || 'No loan record found.';
          }
        },
        (error) => {
          console.error('Error fetching loan details:', error);
          this.loanDetails = [];
          this.noLoanMessage = 'Error fetching loan details. Please try again.';
        },
        () => {
          this.loadingService.hide();
        }
      );
    }
    this.onSelectionChange();
  }

  fetchObligorUUS(): void {
    this.loadingService.show();
    this.underwritingService.getCustomerUusItems(this.nhfNumber).subscribe(
      response => {
        this.uwsList = (response.result || []).map(uws => ({
          ...uws,
          option: this.mapOptionToEnum(uws.option),
          deferredDate: uws.deferDate ? new Date(uws.deferDate).toISOString().split('T')[0] : null
        }));

        console.log("Processed UUS List:", this.uwsList);
      },
      error => console.error("Error fetching UUS list:", error),
      () => this.loadingService.hide()
    );
  }


  mapOptionToEnum(option: number): string {
    const mapping: { [key: number]: string } = {
      1: 'Yes',
      2: 'No',
      3: 'Waiver',
      4: 'Deferred'
    };
    return mapping[option] || 'No';
  }

  onOptionChange(uws: any) {
    if (uws.option !== 'Deferred') {
      uws.deferredDate = null;
    }
  }

  onDeferredDateChange(uws: any) {
    console.log(`Deferred Date for ${uws.item}:`, uws.deferredDate);
  }


  openUWSModal(detail: any) {
    this.loadingService.show();

    if (!detail || !detail.nhfnumber) {
      console.error("NHF Number is missing for the selected loan:", detail);
      swal("FinTrak Credit 360", "NHF Number is missing for this loan.", "error");
      this.loadingService.hide();
      return;
    }

    this.selectedLoanDetail = detail;
    this.nhfNumber = detail.nhfnumber;
    console.log("Selected NHF Number:", this.nhfNumber);
    this.isUWSModalVisible = true;

    this.fetchObligorUUS();

    setTimeout(() => {
      this.loadingService.hide();
    }, 100);
  }

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


  // onSelectionChange() {
  //   this.isPmbApprovalDisabled = this.selectedLoans.length === 0;
  // }

  onSelectionChange(): void {
    this.isPmbApprovalDisabled = !this.selectedLoan;
  }

  // onLoanSelectionChange(detail: any) {
  //   if (detail.selected) {
  //     // Add the loan to selectedChildLoan if checked
  //     this.selectedChildLoan.push(detail);
  //   } else {
  //     // Remove the loan from selectedChildLoan if unchecked
  //     this.selectedChildLoan = this.selectedChildLoan.filter((loan) => loan !== detail);
  //   }
  //   console.log('Selected Child Loans:', this.selectedChildLoan); 
  // }

  onLoanSelectionChange(detail: any) {
    if (this.selectedLoanDetail === detail) {
      // If already selected and clicked again, deselect it
      this.selectedLoanDetail = null;
    } else {
      // Otherwise, select the clicked detail
      this.selectedLoanDetail = detail;
    }
    console.log('Selected Child Loan Detail:', this.selectedLoanDetail);
  }


  closeUWSModal() {
    this.clearForm();
    this.isUWSModalVisible = false;
    // this.isPmbApprovalDisabled = true;
  }

  clearForm() {
    if (!this.uwsList || this.uwsList.length === 0) {
      console.warn("UUS List is empty or undefined. Skipping clearForm.");
      return;
    }

    this.uwsList.forEach(uws => {
      uws.option = '';
      uws.deferredDate = '';
      uws.reviewalComment = '';
    });

    this.approvedComment = '';
  }

  // onOptionChange(uws: any) {
  //   if (uws.option !== 'Deferred') {
  //     uws.deferredDate = null;
  //   }
  // }

  // ===================== View Document =================================

  viewDocument(uws: any): void {
    console.log("Selected UWS:", uws);

    if (!uws.employeeNhfNumber) {
      swal("Error", "No Employee NHF Number found!", "error");
      return;
    }
    if (!uws.itemId) {
      swal("Error", "No Item Found!", "error");
      return;
    }

    console.log("Fetching document for:", uws.employeeNhfNumber, uws.itemId); // Debugging
    this.fetchAndPreviewDocument(uws.employeeNhfNumber, uws.itemId);
  }



  private fetchAndPreviewDocument(employeeNumber: string, itemId: number): void {
    console.log("Calling API with:", employeeNumber, itemId);

    this.loadingService.show();
    this.underwritingService.getCustomerUusItemDoc(employeeNumber, itemId).subscribe({
      next: (response) => {
        console.log("API Response:", response);

        if (!response.success || !response.result) {
          console.error("Invalid document data received");
          swal("Error", "Invalid document data received.", "error");
          this.loadingService.hide();
          return;
        }

        // Extract base64 content from API response
        const base64Data = response.result.split(",")[1];
        const fileTypeMatch = response.result.match(/data:(.*?);base64/);

        if (!base64Data || !fileTypeMatch) {
          console.error("Invalid Base64 format");
          swal("Error", "Invalid document format.", "error");
          this.loadingService.hide();
          return;
        }

        const fileType = fileTypeMatch[1];
        console.log("Detected file type:", fileType);

        // Convert Base64 to Blob
        const blob = this.base64ToBlob(base64Data, fileType);
        const url = URL.createObjectURL(blob);
        console.log("Generated Blob URL:", url);

        // Handle different file types
        if (fileType.includes("image")) {
          // Display images in the modal
          this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.fileType = fileType;
          this.isPreviewModalVisible = true;
        } else if (fileType === "application/pdf") {
          //  Show PDF inside the modal
          this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.fileType = fileType;
          this.isPreviewModalVisible = true;
        } else if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileType === "application/msword"
        ) {
          // Show DOCX inside the modal
          this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.fileType = fileType;
          this.isPreviewModalVisible = true;
        }
        else {
          swal("Error", "Unsupported file type.", "error");
        }

        this.loadingService.hide();
      },
      error: (error) => {
        console.error("Error fetching document:", error);
        swal("Error", "Error fetching document.", "error");
        this.loadingService.hide();
      }
    });
  }

  // Helper function to convert Base64 to Blob
  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }


  // ============================== Document Preview Modal Display ==============================


  getModalStyle() {
    if (this.fileType === 'application/pdf' || this.fileType === 'application/msword' ||
      this.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return { width: '70%', height: '75vh' };
    } else {
      return { width: '55%', height: '70vh' };
    }
  }


  zoomIn() {
    this.zoomLevel += 0.2;
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) this.zoomLevel -= 0.2;
  }

  onScrollZoom(event: WheelEvent) {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
    this.zoomLevel = Math.max(0.5, this.zoomLevel + zoomFactor);
  }

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.dragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  onDrag = (event: MouseEvent) => {
    if (!this.dragging) return;

    const dragSpeed = 2;
    const deltaX = (event.clientX - this.startX) * dragSpeed;
    const deltaY = (event.clientY - this.startY) * dragSpeed;

    const imageElement = document.querySelector('img') as HTMLElement;
    if (imageElement) {
      imageElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${this.zoomLevel})`;
    }
  };


  toggleZoom() {
    if (this.zoomLevel >= this.maxZoom) {
      this.zoomLevel = this.minZoom; // Reset to min zoom if max reached
    } else {
      this.zoomLevel += 0.5; // Increment zoom
    }
  }


  stopDrag = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  };



  private createBlobUrl(blobData: Blob, fileType: string): string {
    const blob = new Blob([blobData], { type: fileType });
    return URL.createObjectURL(blob);
  }

  // Example function to determine file type (modify as needed)
  private getFileTypeFromItemId(itemId: string): string {
    if (itemId.endsWith(".pdf")) return "application/pdf";
    if (itemId.endsWith(".png") || itemId.endsWith(".jpg") || itemId.endsWith(".jpeg")) return "image/jpeg";
    if (itemId.endsWith(".doc") || itemId.endsWith(".docx")) return "application/msword";
    return "application/octet-stream";
  }

  closePreviewModal() {
    this.isPreviewModalVisible = false;
    this.selectedDocumentUrl = null;
    this.isPreviewModalVisible = false;
    this.zoomLevel = 1;
  }

  // ============================= Submit Checklist ============================

  disabledLoans = new Set<string>(); // Stores loan IDs with submitted checklists


  getRowColor(option: string): string {
    if (!option) return 'transparent'; // Default background
    return option === 'Yes' ? '#d4edda' : option === 'No' ? '#f8d7da' : 'transparent';
  }


  saveUUSDetails() {
    if (!this.approvedComment) {
      swal("FinTrak Credit 360", "Approval Comment is required to proceed with Unified Underwriting.", "warning");
      return;
    }
    if (!this.selectedLoanDetail) {
      swal("FinTrak Credit 360", "Please complete at least one loan item before submitting the UUS checklist.", "warning");
      return;
    }

    const filteredUwsList = this.uwsList.filter(uws => uws.option);

    if (filteredUwsList.length === 0) {
      swal("FinTrak Credit 360", "At least one UUS checklist item is required before submission.", "warning");
      return;
    }

    console.log("selected loan Id", this.selectedLoanDetail.loanId);

    const body = filteredUwsList.map(uws => ({
      loanId: this.selectedLoanDetail.loanId,
      nhfNumber: this.selectedLoanDetail.nhfnumber,
      item: uws.item,
      id: uws.id,
      description: uws.description,
      pmbId: 1,
      deferDate: uws.option === "Deferred" ? uws.deferredDate : null,
      option: this.mapOptionToEnum(uws.option),
      reviewalComment: uws.reviewalComment,
      approvalComment: this.approvedComment
    }));

    swal({
      title: "Confirm Unified Underwriting Submission",
      text: "Are you sure you want to submit the UUS checklist for this loan?",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!"
    }).then((isConfirm) => {
      if (isConfirm) {
        this.loadingService.show();

        this.underwritingService.reviewCustomersUUSItems(body).subscribe(
          response => {
            this.loadingService.hide();

            if (response && response.success) {
              swal("Success!", "UUS checklist has been successfully submitted for the loan!", "success")
                .then(() => {
                  this.closeUWSModal();
                  //this.isPmbApprovalDisabled = true;

                  // Disable the button for the submitted loan
                  this.disabledLoans.add(this.selectedLoanDetail.loanId);
                });
            } else {
              console.error("Backend error:", response);
              swal("Error!", "An error occurred while submitting the UUS checklist. Please try again.", "error");
            }
          },
          error => {
            this.loadingService.hide();
            console.error("API Error:", error);
            swal("Error!", error.message || "Something went wrong while saving the underwriting details. Please try again.", "error");
          }
        );
      }
    }).catch((reason) => {
      if (reason === 'cancel') {
        console.log("User cancelled the UUS submission");
        swal("FinTrak Credit 360", "Operation cancelled", "info");
      }
    });
  }


  // ======================= NMRC Refinancing UUS Checklist Approve and Disapprove ==================================

  approveReviewLoans() {
    if (!this.selectedLoanDetail) {
      swal("FinTrak Credit 360", "Please select a loan to approve.", "error");
      return;
    }

    console.log("Approving Loan:", this.selectedLoanDetail);

    const loanId = this.selectedLoanDetail.id;

    swal({
      title: "Confirm Loan Approval",
      text: "Are you sure you want to approve this review loan?",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel"
    }).then((confirmed) => {
      if (confirmed) {
        this.loadingService.show();

        this.underwritingService.approveReviewLoan([loanId]).subscribe({
          next: (response) => {
            this.loadingService.hide();
            console.log("API Response:", response);

            if (response.success) {
              swal("FinTrak Credit Risk 360", "Loan successfully reviewed and goes for final approval!", "success").then(() => {
                this.fetchLoansForReview();
                this.selectedLoanDetail = null;
              });
            } else {
              swal("FinTrak Credit Risk 360", response.message || "An error occurred while approving the loan. Please try again.", "error");
            }
          },
          error: (error) => {
            this.loadingService.hide();
            console.error("API Error:", error);
            swal("FinTrak Credit 360", "Failed to approve the loan due to a system error. Please refresh and try again.", "error");
          }
        });
      }
    }).catch((reason) => {
      if (reason === 'cancel') {
        console.log("User cancelled the final loan approval");
        swal("FinTrak Credit 360", "Loan approval cancelled.", "info");
      }
    });
  }


  disApproveReviewLoans() {
    if (!this.selectedLoanDetail) {
      swal("FinTrak Credit 360", "Please select a loan to disapprove.", "error");
      return;
    }

    const loanId = this.selectedLoanDetail.id;

    swal({
      title: "Confirm Loan Disapproval",
      text: "Are you sure you want to disapprove this review loan?",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Disapprove",
      cancelButtonText: "Cancel"
    }).then((confirmed) => {
      if (confirmed) {
        this.loadingService.show();

        this.underwritingService.disapproveReviewLoan([loanId]).subscribe({
          next: (response) => {
            this.loadingService.hide();
            console.log("API Response:", response);

            if (response.success) {
              swal("FinTrak Credit Risk 360", "Loan successfully reviewed and disapproved!", "success").then(() => {
                this.fetchLoansForReview();
                this.selectedLoanDetail = null; // Reset selection
              });
            } else {
              swal("FinTrak Credit Risk 360", response.message || "An error occurred while disapproving the loan. Please try again.", "error");
            }
          },
          error: (error) => {
            this.loadingService.hide();
            console.error("API Error:", error);
            swal("FinTrak Credit 360", "Failed to disapprove the loan due to a system error. Please refresh and try again.", "error");
          }
        });
      }
    }).catch((reason) => {
      if (reason === 'cancel') {
        console.log("User cancelled the loan approval");
        swal("FinTrak Credit 360", "Loan disapproval cancelled.", "info");
      }
    });
  }


  sendForApproval() {
    // Find the selected loan using the selectedLoanId from the radio button
    const selectedLoan = this.loanDetails.find(loan => loan.refinanceNumber === this.selectedLoanId);
    this.selectedLoanDetail = null;
    if (!selectedLoan) {
      swal("FinTrak Credit 360", "Please select a loan to approve.", "error");
      return;
    }

    const refinanceNumber = selectedLoan.refinanceNumber;
    console.log("Refinance Number Sent for Approval", refinanceNumber);
    // Confirmation dialog
    swal({
      title: "Confirm Loan Approval",
      text: "Are you sure you want to send the Batch loan for Final Approval",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel"
     
    }).then((confirmed) => {
      if (confirmed) {
        this.loadingService.show();

        this.underwritingService.sendReviewForFinalApproval(refinanceNumber).subscribe({
          next: (response) => {
            this.loadingService.hide();
            console.log("API Response:", response);

            if (response.success) {
              swal("FinTrak Credit Risk 360", "Batch Loan successfully reviewed and sent for final approval!", "success").then(() => {
                // Clear approved loan
                this.loanDetails = [];
                this.selectedLoanId = null;
                this.fetchLoansForReview();
                this.isPmbApprovalDisabled = true;
              });
            } else {
              swal("FinTrak Credit Risk 360", response.message || "An error occurred while approving the loan. Please try again.", "error");
            }
          },
          error: (error) => {
            this.loadingService.hide();
            console.error("API Error:", error);
            swal("FinTrak Credit 360", "Approval process failed due to a system error. Please refresh and try again.", "error");
          }
        });
      }
    }).catch((reason) => {
      if (reason === 'cancel') {
        console.log("User cancelled the loan approval");
        swal("FinTrak Credit 360", "Operation cancelled.", "info");
      }
    });
  }
}
