import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { LoadingService } from 'app/shared/services/loading.service';
//import flatpickr from 'flatpickr';

import swal from 'sweetalert2';

export enum Options {
  Yes = 1,
  No, 
  Waived ,
  Defer,
}

@Component({
  selector: 'app-underwriting-obligor',
  templateUrl: './underwriting-obligor.component.html',
  styleUrls: []
})
export class UnderwritingObligorComponent implements OnInit {
  activeSearchTabindex = 0;
  displayLoanSearch = false;
  reloadGrid = 0;
  activeTabindex = 0;
  disableSupportingDocumentsTab = true;
  disableApplicationInformationTab = true;
  collectionId = 0;
  applicationCollection: any[] = [];
  loans: any[] = [];
  expandedRows: any;
  selectedFiles: { [loanId: number]: File[] } = {};
  showDeferredDate = false;
  isUWSModalVisible = false;
  uwsComment = '';
  selectedLoan: any;
  uwsList: any[] = [];
  nhfNumber: any;
  pmbId: any;
 itemTotal: any;
 loanDetails: any[] = [];
 isPmbApprovalDisabled: boolean = true;
 selectedLoans: any;
  noLoanMessage: string;

  //selectedLoanId: string;
  selectedLoanId: string | null = null;  
  selectedLoanDetail: any;
  today: any;
 
  constructor(
    private underwritingService: UnifiedUnderwritingStandardService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchDisbursedLoans();
    // this.fetchDisbursedObligors();
    this.fetchDisbursedObligors(this.nhfNumber);
    const now = new Date();
  this.today = now.toISOString().split('T')[0];
  }

  openLoanSearch() {
    this.refreshData();
    this.displayLoanSearch = true;
    this.activeSearchTabindex = 0;
  }

  refreshData() {
    this.reloadGrid++;
    this.activeTabindex = 0;
    this.disableSupportingDocumentsTab = true;
    this.disableApplicationInformationTab = true;
    this.collectionId = 0;
    this.applicationCollection = [];
  }

  onSearchTabChange(event: any) {
    this.activeSearchTabindex = event.index;
  }

  itemsPerPage: number = 5;
  totalPages: number = 0;
  currentPage = 1;

//   fetchDisbursedLoans(): void {
//     this.loadingService.show();
//     this.underwritingService.GetLoanForRefinance(1).subscribe(
//       response => {
//         console.log('Fetched Loans:', response);
//         this.loans = response.result || [];
//       },
//       error => {
//         console.error('Error fetching loans:', error);
//       },
//       () => {
//         this.loadingService.hide();
//       }
//     );
// }

clearForm() {
  if (!this.uwsList || this.uwsList.length === 0) {
    console.warn("uwsList is empty or undefined. Skipping clearForm.");
    return; 
  }
  this.uwsList.forEach(uws => {
    uws.option = '';
    uws.deferredDate = '';
    uws.files = [];

    const fileInput = document.getElementById(`fileInput-${uws.id}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }

    const fileNameDisplay = document.getElementById(`fileNameDisplay-${uws.id}`);
    if (fileNameDisplay) {
      fileNameDisplay.textContent = 'No file selected';
    }
  });
}


closeUWSModal() {
  this.clearForm();
  this.isUWSModalVisible = false;
}


fetchDisbursedLoans(page: number = 1, rows: number = 5): void {
  this.loadingService.show();
  this.underwritingService.getLoanSummary(page).subscribe(
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

viewLoanDetails(RefinanceNumber: any, event: Event) {
  const clickedRadio = event.target as HTMLInputElement;

  if (this.selectedLoanId === RefinanceNumber) {
    this.selectedLoanId = null;
    this.loanDetails = [];
    clickedRadio.checked = false;
  } else {
    this.selectedLoanId = RefinanceNumber;
    this.loanDetails = [];
    this.noLoanMessage = "";
    this.loadingService.show();

    this.underwritingService.getSummaryLoanDetails(RefinanceNumber).subscribe(
      response => {
        if (response.success && Array.isArray(response.result) && response.result.length > 0) {
          this.loanDetails = response.result;
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
  }

  this.onSelectionChange(); 
}



// onSelectionChange() {
//   this.isPmbApprovalDisabled = this.selectedLoan.length === 0;
// }

onSelectionChange(): void {
  this.isPmbApprovalDisabled = !this.selectedLoanId;
}


// fetchDisbursedLoans(page: number = 1, rows: number = 10): void {
//   this.loadingService.show();
//   this.underwritingService.getLoanForRefinance(page).subscribe(
//     response => {
//       console.log('Fetched Loans:', response);
   
//       this.loans = response.result || [];
//       this.itemTotal = response.totalCount || 0; 

//     },
//     error => {
//       console.error('Error fetching loans:', error);
//     },
//     () => {
//       this.loadingService.hide();
//     }
//   );
// }


loadLoansLazy(event: any) {
  const page = event.first / event.rows + 1; 
  const rows = event.rows;
  this.fetchDisbursedLoans(page, rows);
}



  // fetchDisbursedObligors(): void {
  //   this.underwritingService.getDisbursedObligorUus().subscribe(
  //     response => {
  //       this.uwsList = response.result || [];
  //       console.log('Fetched UUS List:', response);
  //     },
  //     error => console.error('Error fetching UUS list:', error)
  //   );
  // }

  fetchDisbursedObligors(nhfNumber: string | number) {
    this.loadingService.show();

    if (nhfNumber === null || nhfNumber === undefined) {
        console.warn('NHF Number is missing. API call aborted.');
        this.loadingService.hide();
        return;
    }

    console.log('Fetching UUS List for NHF Number:', nhfNumber);

    this.underwritingService
        .getDisbursedObligorUus(nhfNumber.toString())
        .subscribe(
            (response) => {
                this.loadingService.hide();

                this.uwsList = (response.result || []).map((uws: any) => {
                    // Determine ID without using ?? (for older Angular versions)
                    let resolvedId = null;
                    if (uws.ChecklistId !== undefined && uws.ChecklistId !== null) {
                        resolvedId = uws.ChecklistId;
                    } else if (uws.checklistId !== undefined && uws.checklistId !== null) {
                        resolvedId = uws.checklistId;
                    } else if (uws.id !== undefined && uws.id !== null) {
                        resolvedId = uws.id;
                    }

                    return {
                        ...uws,
                        id: resolvedId, // normalized ID
                        // Convert backend checkTypes to number to match radio values
                        option: uws.checkTypes !== null && uws.checkTypes !== undefined
                            ? Number(uws.checkTypes)
                            : null,
                        // Keep deferredDate only if option is Deferred (3)
                        deferredDate: Number(uws.checkTypes) === 3
                            ? uws.deferredDate
                            : null,
                        files: [] // initialize empty files array
                    };
                });

                console.log('Fetched UUS List:', this.uwsList);
            },
            (error) => {
                this.loadingService.hide();
                console.error('Error fetching UUS list:', error);
            }
        );
}

  onOptionChange(uws: any) {
    if (uws.option !== 'Deferred') {
      uws.deferredDate = null;
    }
  }

  openUWSModal(detail: any) {
    this.loadingService.show();
    setTimeout(() => {
      this.selectedLoanDetail = detail;
      this.isUWSModalVisible = true;
      this.loadingService.hide();
    },50 );
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

// onSearchTabChange(event: any): void {
//   this.activeSearchTabindex = event.index;
// }



// saveUWSDetails() {
//   if (!this.selectedLoan) {
//     swal("FinTrak Credit 360", "Please select a loan before submitting.", "warning");
//     return;
//   }

//   // Filter only selected items (where an option is chosen)
//   const filteredUwsList = this.uwsList.filter(uws => uws.option);

//   if (filteredUwsList.length === 0) {
//     swal("FinTrak Credit 360", "Please select at least one option before submitting.", "warning");
//     return;
//   }

//   // Allowed options that should have files
//   const optionsWithFiles = ["Yes", "No", "Waiver"];

//   const body = filteredUwsList.map(uws => {
//     const shouldIncludeFiles = optionsWithFiles.some(opt => opt === (uws.option as string)) 
//     && uws.files && uws.files.length > 0;
//     return {
//       loanId: this.selectedLoan.loanId,
//       nhfNumber: this.selectedLoan.nhfnumber,
//       item: uws.item,
//       description: uws.description,
//       pmbId: 1,
//       deferDate: uws.option === "Deferred" ? uws.deferredDate : null,
//       option: this.mapOptionToEnum(uws.option),
//       files: shouldIncludeFiles
//         ? uws.files.map(fileObj => ({
//             fileName: fileObj.fileName || "Unknown Name",
//             fileType: fileObj.fileType || "Unknown Type",
//             fileContentBase64: this.convertFileToBase64(fileObj.file)
//         }))
//         : []

//     };
//   });

//   // ✅ Correct SweetAlert1 Usage
//   swal({
//     title: "Are you sure?",
//     text: "Do you want to do unified underwriting for this loan?",
//     type: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes",
//     cancelButtonText: "No, cancel!"
//   }).then((isConfirm) => {
//     if (isConfirm) {
//       this.loadingService.show(); // ✅ Show loading overlay

//       this.underwritingService.PostCustomerUus(body).subscribe(
//         response => {
//           swal("Success!", "Customer UWS details saved successfully!", "success");
//           this.loadingService.hide();
//           this.closeUWSModal();
//         },
//         error => {
//           swal("Error!", "An error occurred while saving UWS details.", "error");
//         }
//       );
//     }
//   });
// }

async saveUWSDetails() {
  if (!this.selectedLoanDetail) {
    swal("FinTrak Credit 360", "Please select a loan before submitting the UUS checklist.", "warning");
    return;
  }

  const filteredUwsList = this.uwsList.filter(uws => uws.option);
  if (filteredUwsList.length === 0) {
    swal("FinTrak Credit 360", "At least one UUS checklist item is required before submission.", "warning");
    return;
  }

  for (let uws of filteredUwsList) {
    if (uws.files && uws.files.length > 0) {
      for (let fileObj of uws.files) {
        fileObj.fileContentBase64 = await this.convertFileToBase64(fileObj.file);
      }
    }
  }

  const body = filteredUwsList.map(uws => {
    const firstFile = uws.files && uws.files.length > 0 ? uws.files[0] : null;
  
    return {
      loanId: this.selectedLoanDetail.loanId,
      nhfNumber: this.selectedLoanDetail.nhfnumber,
      item: uws.item,
      itemId: uws.id,
      description: uws.description,
      pmbId: 1,
      deferDate: uws.option === "Deferred" ? uws.deferredDate : null,
      option: this.mapOptionToEnum(uws.option),
      fileName: firstFile ? firstFile.fileName : null,
      fileType: firstFile ? firstFile.fileType : null,
      fileContentBase64: firstFile ? firstFile.fileContentBase64 : null
    };
  });

  swal({
    title: "Confirm Unified Underwriting Submission",
    text: "Are you sure you want to submit the UUS checklist for this loan?",
    type: "warning", 
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "No, cancel!"
  }).then((isConfirm) => {
    if (isConfirm) {
      this.loadingService.show();

      this.underwritingService.postCustomerUus(body).subscribe(
        response => {
          this.loadingService.hide();

          if (response && response.success) {
            swal("Success!", "UUS checklist has been successfully submitted for the loan!", "success")
            .then(() => {  
              this.closeUWSModal();
              this.selectedLoanId = null;
              this.loanDetails = [];
              this.fetchDisbursedLoans(1, 5);
            });
          } else {
            console.error("Backend error:", response);
            swal("Error!", response.message || "An error occurred while submitting the UUS checklist. Please try again.", "error");
          }
        },
        error => {
          this.loadingService.hide();
          console.error("API Error:", error);
          swal("Error!", error.message || "Something went wrong while saving the underwriting details. Please try again.", "error");
        }
      );
    }
  });
}


// approveChecklistLoans() {
//         console.log("Selected Loans:", this.selectedLoan);
      
//         if (!Array.isArray(this.selectedLoan) || this.selectedLoan.length === 0) {
//           swal("FinTrak Credit 360", "Please select at least one loan to approve.", "error");
//           return;
//         }
      
//         // Extract loan IDs as an array
//         const body: number[] = this.selectedLoan.map(loan => {
//           if (!loan || !loan.id) {
//             console.log("Missing loanId in:", loan);
//             throw new Error("Invalid loan data. loanId is missing.");
//           }
//           return loan.id;
//         });
      
//         console.log("Request Payload (Loan IDs Array):", body);
      
//         swal({
//           title: "Confirm Loan Approval",
//           text: "Are you sure you want to approve the selected loan(s) for refinancing?",
//           type: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#3085d6",
//           cancelButtonColor: "#d33",
//           confirmButtonText: "Yes, Approve",
//           cancelButtonText: "cancel!"
//         }).then((confirmed) => {
//           if (confirmed) {
//             this.loadingService.show();
      
//             this.underwritingService.approveReviewLoan(body).subscribe({
//               next: (response) => {
//                 this.loadingService.hide();
      
//                 console.log("API Response:", response);
      
//                 if (response.success) {
//                   swal("FinTrak Credit 360", "Loan(s) successfully approved for refinancing!", "success").then(() => {
//                     this.selectedLoan = []; 
//                     this.fetchDisbursedLoans(10); 
//                   });
//                 } else {
//                   swal("FinTrak Credit 360", response.message || "An error occurred while approving the refinancing checklist. Please try again.", "error");
//                 }
//               },
//               error: (error) => {
//                 this.loadingService.hide();
//                 console.error("API Error:", error);
//                 swal("FinTrak Credit 360", "Approval process failed due to a system error. Please refresh and try again.", "error");
//               }
//             });
//           }
//         });
//       }

approveChecklistLoans() {
  console.log("Selected Loan:", this.selectedLoanId);

  if (!this.selectedLoanId) {  
    swal("FinTrak Credit 360", "Please select at least one loan to approve.", "error");
    return;
  }

  // Proceed with extracting loan ID
  const RefinanceNumber = this.selectedLoanId;

  console.log("Request Payload (Loan ID):", RefinanceNumber);

  swal({
    title: "Confirm Loan Approval",
    text: "Are you sure you want to approve the selected loan for refinancing?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "cancel!"
  }).then((confirmed) => {
    if (confirmed) {
      this.loadingService.show();

      this.underwritingService.approveChecklistLoan(RefinanceNumber).subscribe({
        next: (response) => {
          this.loadingService.hide();

          console.log("API Response:", response);

          if (response.success) {
            swal("FinTrak Credit 360", "Loan successfully approved for refinancing!", "success").then(() => {
              this.selectedLoanId = null; // Reset selection after approval
              this.loanDetails = [];
              this.fetchDisbursedLoans(); // Refetch loans
              this.onSelectionChange();
              
            });
          } else {
            swal("FinTrak Credit 360", response.message || "An error occurred while approving the refinancing checklist. Please try again.", "error");
          }
        },
        error: (error) => {
          this.loadingService.hide();
          console.error("API Error:", error);
          swal("FinTrak Credit 360", "Approval process failed due to a system error. Please refresh and try again.", "error");
        }
      });
    }
  });
}




  mapOptionToEnum(option: string): Options {
    const mapping: { [key: string]: Options } = {
      'Yes': Options.Yes,
      'No': Options.No,
      'Waiver': Options.Waived,
      'Deferred': Options.Defer
    };
    return mapping[option] !== undefined ? mapping[option] : Options.Defer;
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) {
            reject(new Error('Invalid file: Not a Blob'));
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]); // Extract Base64
        reader.onerror = () => reject(new Error('Error reading file'));
    });
}


  onDeferChange(uws: any) {
    if (!uws.isDeferred) {
      uws.deferredDate = '';
    }
  }
  
  
  onFileSelect(event: any, uwsId: number) {
    const files = event.target.files;
    if (!files || files.length === 0) return; 

    const uwsIndex = this.uwsList.findIndex(uws => uws.id === uwsId);
    if (uwsIndex !== -1) {
        if (!this.uwsList[uwsIndex].files) {
            this.uwsList[uwsIndex].files = [];
        }

        this.uwsList[uwsIndex].files = []; 

        Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];

                this.uwsList[uwsIndex].files.push({
                    file: file,
                    fileName: file.name,
                    fileType: file.type,
                    fileContentBase64: base64String
                });

                const fileNameDisplay = document.getElementById(`fileNameDisplay-${uwsId}`);
                if (fileNameDisplay) {
                    fileNameDisplay.innerText = this.uwsList[uwsIndex].files.map(f => f.fileName).join(', ') || "No file selected";
                }
            };
            reader.readAsDataURL(file);
        });
    }
}
}
