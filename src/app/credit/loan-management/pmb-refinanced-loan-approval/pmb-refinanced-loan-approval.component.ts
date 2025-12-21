import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { UnifiedUnderwritingStandardService } from '../../services/underwriting-obligor.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pmb-refinanced-loan-approval',
  templateUrl: './pmb-refinanced-loan-approval.component.html',
  styles: []
})
export class PmbRefinancedLoanApprovalComponent implements OnInit {

  loans: any[] = [];
  itemTotal: any;
  activeSearchTabindex: any;
  uwsList: any;
  nhfNumber:any
  isUWSModalVisible: boolean = false;
  isPreviewModalVisible: boolean = false;
  selectedDocumentUrl: SafeResourceUrl | null = null;
  selectedLoans: any;
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
  loanDetails: any[] = [];

  itemsPerPage: number = 5;
  totalPages: number = 0;
  currentPage = 1;
  noLoanMessage: string;
  selectedLoan: any = null;
  selectedLoanId: string | null = null;  
  selectedLoanDetail: any = null;
  radioSelectedLoan: any = null;
  checklistLoan: any;
  
  // Checklist summary properties for selected individual loan
  checklistSummary: {
    total: number;
    yes: number;
    no: number;
    waived: number;
    deferred: number;
    yesPercent: number;
    noPercent: number;
    waivedPercent: number;
    deferredPercent: number;
  } = {
    total: 0,
    yes: 0,
    no: 0,
    waived: 0,
    deferred: 0,
    yesPercent: 0,
    noPercent: 0,
    waivedPercent: 0,
    deferredPercent: 0
  };
  isLoadingChecklistSummary: boolean = false;


  constructor(
    private underwritingService: UnifiedUnderwritingStandardService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fetchDisbursedLoans();
    this.fetchCustomerUusItems
    this.viewDocument
  }

  fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
    this.loadingService.show();
    this.underwritingService.getPmbsChecklistedLoanSummary(page).subscribe(
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



  // viewLoanDetails(RefinanceNumber: any, event: Event) {
  //   const clickedRadio = event.target as HTMLInputElement;
  
  //   if (this.selectedLoanId === RefinanceNumber) {
  //     this.selectedLoanId = null;
  //     this.loanDetails = [];
  //     clickedRadio.checked = false;
  //   } else {
  //     this.selectedLoanId = RefinanceNumber;
  //     this.loanDetails = [];
  //     this.noLoanMessage = "";
  //     this.loadingService.show();
  
  //     this.underwritingService.getPmbsChecklistedLoan(RefinanceNumber).subscribe(
  //       response => {
  //         if (response.success && Array.isArray(response.result) && response.result.length > 0) {
  //           this.loanDetails = response.result;
  //         } else {
  //           this.loanDetails = [];
  //           this.noLoanMessage = response.message || "No loan record found.";
  //         }
  //       },
  //       error => {
  //         this.loanDetails = [];
  //         this.noLoanMessage = "Error fetching loan details.";
  //       },
  //       () => {
  //         this.loadingService.hide();
  //       }
  //     );
  //   }
  
  //   this.onSelectionChange(); 
  // }

  viewLoanDetails(loan: any) {
    if (this.selectedLoan && this.selectedLoan.refinanceNumber === loan.refinanceNumber) {
      return; // already selected, do nothing
    }
  
    this.selectedLoan = loan;
    this.selectedLoanId = loan.refinanceNumber;
    this.loanDetails = [];
    this.noLoanMessage = "";
    this.checklistSummary = {
      total: 0,
      yes: 0,
      no: 0,
      waived: 0,
      deferred: 0,
      yesPercent: 0,
      noPercent: 0,
      waivedPercent: 0,
      deferredPercent: 0
    };
    this.loadingService.show();
  
    this.underwritingService.getPmbsChecklistedLoan(loan.refinanceNumber).subscribe(
      response => {
        if (response.success && Array.isArray(response.result) && response.result.length > 0) {
          this.loanDetails = response.result;
          // Reset selected loan detail and summary
          this.selectedLoanDetail = null;
          this.checklistSummary = {
            total: 0,
            yes: 0,
            no: 0,
            waived: 0,
            deferred: 0,
            yesPercent: 0,
            noPercent: 0,
            waivedPercent: 0,
            deferredPercent: 0
          };
        } else {
          this.loanDetails = [];
          this.noLoanMessage = response.message || "No loan record found.";
        }
      },
      error => {
        this.loanDetails = [];
        this.noLoanMessage = "Error fetching loan details.";
      },
      () => {
        this.loadingService.hide();
      }
    );
  
    this.onSelectionChange();
  }
  
  selectLoanDetail(loanDetail: any): void {
    // Toggle selection - if same loan is clicked, deselect it
    if (this.selectedLoanDetail && this.selectedLoanDetail.nhfnumber === loanDetail.nhfnumber) {
      this.selectedLoanDetail = null;
      this.checklistSummary = {
        total: 0,
        yes: 0,
        no: 0,
        waived: 0,
        deferred: 0,
        yesPercent: 0,
        noPercent: 0,
        waivedPercent: 0,
        deferredPercent: 0
      };
      return;
    }

    this.selectedLoanDetail = loanDetail;
    this.fetchChecklistSummaryForLoan(loanDetail.nhfnumber);
  }

  fetchChecklistSummaryForLoan(nhfNumber: string): void {
    if (!nhfNumber) {
      return;
    }

    this.isLoadingChecklistSummary = true;
    this.checklistSummary = {
      total: 0,
      yes: 0,
      no: 0,
      waived: 0,
      deferred: 0,
      yesPercent: 0,
      noPercent: 0,
      waivedPercent: 0,
      deferredPercent: 0
    };

    this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
      response => {
        if (response && response.success && Array.isArray(response.result)) {
          this.calculateChecklistSummary(response.result);
        }
        this.isLoadingChecklistSummary = false;
      },
      error => {
        console.error(`Error fetching checklist for ${nhfNumber}:`, error);
        this.isLoadingChecklistSummary = false;
      }
    );
  }

  calculateChecklistSummary(checklistItems: any[]): void {
    const total = checklistItems.length;
    
    if (total === 0) {
      this.checklistSummary = {
        total: 0,
        yes: 0,
        no: 0,
        waived: 0,
        deferred: 0,
        yesPercent: 0,
        noPercent: 0,
        waivedPercent: 0,
        deferredPercent: 0
      };
      return;
    }

    // Count items by option
    const yes = checklistItems.filter(item => {
      const option = item.option;
      return option === 1 || option === 'Yes' || option === '1';
    }).length;
    
    const no = checklistItems.filter(item => {
      const option = item.option;
      return option === 2 || option === 'No' || option === '2';
    }).length;
    
    const waived = checklistItems.filter(item => {
      const option = item.option;
      return option === 3 || option === 'Waiver' || option === 'Waived' || option === '3';
    }).length;
    
    const deferred = checklistItems.filter(item => {
      const option = item.option;
      return option === 4 || option === 'Deferred' || option === 'Defer' || option === '4';
    }).length;

    this.checklistSummary = {
      total,
      yes,
      no,
      waived,
      deferred,
      yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
      noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
      waivedPercent: total > 0 ? Math.round((waived / total) * 100) : 0,
      deferredPercent: total > 0 ? Math.round((deferred / total) * 100) : 0
    };
  }
  
  

  

  fetchCustomerUusItems(nhfNumber:string): void {
    this.loadingService.show();
    this.underwritingService.getCustomerUusItems(nhfNumber).subscribe(
      response => {
        this.uwsList = (response.result || []).map(uws => ({
          ...uws,
          option: this.mapOptionToEnum(uws.option), 
          deferredDate: uws.deferDate ? new Date(uws.deferDate).toISOString().split('T')[0] : null 
        }));
  
        console.log("Processed UUS List:", this.uwsList);
      },
      error => console.error('Error fetching UWS list:', error),
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


  loadLoansLazy(event: any) {
    const page = event.first / event.rows + 1; 
    const rows = event.rows;
    this.fetchDisbursedLoans(page, rows);
  }

  onSearchTabChange(event: any) {
    this.activeSearchTabindex = event.index;
  }

  openUWSModal(loan: any) {
    console.log('Opening UWS Modal for loan:', loan);
    this.checklistLoan = loan; // Use separate property
    this.isUWSModalVisible = true;

    if (loan.nhfnumber) {
      console.log('Fetching UWS items for NHF Number:', loan.nhfnumber);
      this.fetchCustomerUusItems(loan.nhfnumber);
    } else {
      console.error('No NHF Number found for this loan');
    }
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


  closeUWSModal() {
    this.isUWSModalVisible = false; // Hide modal
    //this.isPmbApprovalDisabled = true;
}

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

// ============================= Loan Approval for Refinancing ================================

// createNewApproval() {
//   console.log("Selected Loans:", this.selectedLoan);

//   if (!Array.isArray(this.selectedLoan) || this.selectedLoan.length === 0) {
//     swal("FinTrak Credit 360", "Please select at least one loan to approve.", "error");
//     return;
//   }

//   // Extract loan IDs as an array
//   const body: number[] = this.selectedLoan.map(loan => {
//     if (!loan || !loan.id) {
//       console.log("Missing loanId in:", loan);
//       throw new Error("Invalid loan data. loanId is missing.");
//     }
//     return loan.id;
//   });

//   console.log("Request Payload (Loan IDs Array):", body);

//   swal({
//     title: "Confirm Loan Approval",
//     text: "Are you sure you want to approve the selected loan(s) for refinancing?",
//     type: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, Approve",
//     cancelButtonText: "cancel!"
//   }).then((confirmed) => {
//     if (confirmed) {
//       this.loadingService.show();

//       this.underwritingService.approvePmbRefinancing(body).subscribe({
//         next: (response) => {
//           this.loadingService.hide();

//           console.log("API Response:", response);

//           if (response.success) {
//             swal("FinTrak Credit Risk 360", "Loan(s) successfully approved for refinancing!", "success").then(() => {
//               this.selectedLoans = []; 
//               this.fetchDisbursedLoans(1, 10); 
//               this.isPmbApprovalDisabled = true;
//             });
//           } else {
//             swal("FinTrak Credit Risk 360", response.message || "An error occurred while approving the refinancing checklist. Please try again.", "error");
//           }
//         },
//         error: (error) => {
//           this.loadingService.hide();
//           console.error("API Error:", error);
//           swal("FinTrak Credit 360", "Approval process failed due to a system error. Please refresh and try again.", "error");
//         }
//       });
//     }
//   });
// }

// createNewApproval() {
//   console.log("Selected Loans:", this.selectedLoan);
//   if (!this.selectedLoan || !this.selectedLoan.id) {
//     swal("FinTrak Credit 360", "Please select at least one loan to approve.", "error");
//     return;
//   }

//   const body: number[] = [this.selectedLoan.id];

//   swal({
//     title: "Confirm Loan Approval",
//     text: "Are you sure you want to approve the selected loan for refinancing?",
//     type: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, Approve",
//     cancelButtonText: "Cancel"
//   }).then((confirmed) => {
//     if (confirmed) {
//       this.loadingService.show();

//       this.underwritingService.approvePmbRefinancing(body).subscribe({
//         next: (response) => {
//           this.loadingService.hide();
//           if (response.success) {
//             swal("FinTrak Credit Risk 360", "Loan successfully approved!", "success").then(() => {
//               this.selectedLoan = null;
//               this.fetchDisbursedLoans(1, 10);
//               this.isPmbApprovalDisabled = true;
//             });
//           } else {
//             swal("FinTrak Credit Risk 360", response.message || "Approval failed.", "error");
//           }
//         },
//         error: (error) => {
//           this.loadingService.hide();
//           swal("FinTrak Credit 360", "System error. Please refresh and try again.", "error");
//         }
//       });
//     }
//   });
// }


createNewApproval() {
  console.log("Selected Loans:", this.selectedLoan);
  if (!this.selectedLoan || !this.selectedLoan.id) {
    swal("FinTrak Credit 360", "Please select at least one loan to approve.", "error");
    return;
  }

  const body: number = this.selectedLoan.id;

  swal({
    title: "Confirm Loan Approval",
    text: "Are you sure you want to approve the selected loan for refinancing?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "Cancel"
  }).then(
    (confirmed) => {
      if (confirmed) {
        this.loadingService.show();

        this.underwritingService.approvePmbRefinancing(body).subscribe({
          next: (response) => {
            this.loadingService.hide();
            if (response.success) {
              swal("FinTrak Credit Risk 360", "Loan successfully approved!", "success").then(() => {
                this.selectedLoan = null;
                this.loanDetails = [];
                this.fetchDisbursedLoans();
                this.isPmbApprovalDisabled = true;
              });
            } else {
              swal("FinTrak Credit Risk 360", response.message || "Approval failed.", "error");
            }
          },
          error: (error) => {
            this.loadingService.hide();
            swal("FinTrak Credit 360", "System error. Please refresh and try again.", "error");
          }
        });
      }
    },
    (dismiss) => {
      if (dismiss === 'cancel') {
        console.log('Approval cancelled by user');
      }
    }
  );
}


}