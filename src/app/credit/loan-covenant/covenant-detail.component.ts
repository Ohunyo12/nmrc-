import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../shared/services/loading.service';
import { ValidationService } from '../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanCovenantService } from '../../setup/services/loan-covenant.service';
import { CustomerService } from '../../customer/services/customer.service';
import { LoanReviewApplicationService, LoanOperationService } from 'app/credit/services';

@Component({
    templateUrl: 'covenant-detail.component.html'
})
export class CovenantDetailComponent implements OnInit {

    loans: any[];
    covenantDetails: any[];
    covenantTypes: any[];
    frequencyTypes: any[];
    covenantDetailForm: FormGroup;
    loanSearchForm: FormGroup;
    selectedId?: number;
    selectedLoanId?: number = null;
    formState: string = null;
    displayCovenantDetailForm: boolean = false;
    displayLoanList: boolean = false;
    displayCovenantList: boolean = false;
    displaySearchForm: boolean = true;
    disableAmountField: boolean = true;
    disableFrequencyField: boolean = true;
    loanSelection: any;
    show: boolean = false; message: any; title: any; cssClass: any;

    loanApplicationDetailId: number = null; // new
    accountNumbers: any[] = [];
    loanSystemTypes: any[] = [
        { id:1, name:'Term/Disbursed Facility' },
        { id:2, name:'Overdraft Facility' },
        { id:3, name:'Contingent Liability' },
        { id:4, name:'Facility Line' },
    ];
    constructor(
        private fb: FormBuilder, 
        private loadingService: LoadingService, 
        private customerService: CustomerService,        
        private reviewService: LoanReviewApplicationService,
        
        private loanCovenantService: LoanCovenantService
    ) { }

    // initialization

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
        this.clearSearchForm();
    }

    loadDropdowns() {
        this.getLoanCovenantTypes();
        this.getFrequencyTypes();
    }

    // loan search

    clearSearchForm() {
        this.loanSearchForm = this.fb.group({
            loanSystemTypeId: ['', Validators.required],
            // performanceTypeId: ['', Validators.required], // OUT
            searchString: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });

    }

    isEmpty(str) {
        return !str.replace(/^\s+/g, '').length;
    }
    loanSystemTypeId: number = null;
    
    submitLoanSearchForm(form) {
        this.loanSystemTypeId = form.value.loanSystemTypeId;
        // this.selectedPerformanceTypeId = form.value.performanceTypeId; // OUT

        if (form.invalid) return;
        this.loadingService.show();
        let body = {
            loanSystemTypeId: form.value.loanSystemTypeId,
            // performanceTypeId: form.value.performanceTypeId, // OUT ????
            searchString: form.value.searchString,
        };
        this.reviewService.loanSearch(body).subscribe((response: any) => {
            if (response.success == true) {
                this.loans = response.result;
                this.displayLoanList = true;
                
                this.loadingService.hide();
            } else {
                // this.displayCustomerList = false;
                this.displayLoanList = true;
                
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            // this.displayCustomerList = false;
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }
    // submitSearchForm(form) {
    //     if (this.loanSearchForm.invalid
    //         || (this.isEmpty(form.value.customerName)
    //             && this.isEmpty(form.value.loanName)
    //             && this.isEmpty(form.value.loanReferenceNumber)
    //             && this.isEmpty(form.value.productAccountNumber)
    //         )) {
    //         return;
    //     }
    //     this.loadingService.show();
    //     let body = {
    //         customerName: (form.value.customerName).trim(),
    //         loanName: (form.value.loanName).trim(),
    //         loanReferenceNumber: (form.value.loanReferenceNumber).trim(),
    //         productAccountNumber: (form.value.productAccountNumber).trim(),
    //     };
    //     this.loanCovenantService.loanSearch(body).subscribe((response: any) => {
    //         if (response.success == true) {
    //             this.loans = response.result;

    //             this.displayLoanList = true;
    //             this.loadingService.hide();
    //         } else {
    //             this.displayLoanList = false;
    //             this.loadingService.hide();
    //             this.finishBad(response.message);
    //         }
    //     }, (err: any) => {
    //         this.displayLoanList = false;
    //         this.loadingService.hide(1000);
    //         this.finishBad(JSON.stringify(err));
    //     });
    // }

    onSelectedLoanChange() {
        
        
        this.getAccountNumbers(this.loanSelection.customerId);
        this.loanApplicationDetailId = this.loanSelection.loanApplicationDetailId;
        this.selectedLoanId = this.loanSelection.loanId;
        this.getCovenantDetails();
        this.displayCovenantList = true;
        this.displayLoanList = false;
        this.displaySearchForm = false;
    }


    getAccountNumbers(id: number) {
        this.loadingService.show();
        this.customerService.getAllCustomerAccountByCustomerId(id).subscribe((response: any) => {
            this.accountNumbers = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.handleError(err);
        });
    }

    showSearchForm() {
        this.selectedLoanId = null;
        this.displayCovenantList = false;
        this.displayLoanList = false;
        this.displaySearchForm = true;
    }

    // loan covenant

    getCovenantDetails(): void {
        this.loadingService.show();
        this.loanCovenantService.getLoanApplicationDetailCovenant(this.loanSelection.loanApplicationDetailId).subscribe((response: any) => {
            this.covenantDetails = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    closeAndRefreshList() {
        this.getCovenantDetails();
        this.displayCovenantDetailForm = false;
        this.clearControls();
    }

    // status message

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }

// ----------------------------------------------------------

    AmountRateLabel: string = 'Amount';
    
        
        requireCasaAccount: boolean = false;
        // disableAmountField: boolean = true;
        // disableFrequencyField: boolean = true;
    
        covenantTextareaControlStatus: string = 'hide';
        covenantTextControlStatus: string = 'hide';
    
        onCovenantTypeChange(event) {
            var row = this.covenantTypes.find(x => x.covenantTypeId == event);
            this.requireCasaAccount = row.requireCasaAccount;
            this.disableAmountField = row.requireAmount == true ? false : true;
            this.disableFrequencyField = row.requireFrequency == true ? false : true;
    
            let casa = this.covenantDetailForm.get('casaAccountId');
            
            if (this.requireCasaAccount) {
                casa.setValidators(Validators.required);
            } else {
                casa.clearValidators();
            }
            casa.updateValueAndValidity();
    
            if (this.disableAmountField) {
                this.covenantDetailForm.controls['covenantAmount'].setValue('');
            }
    
            if (this.disableFrequencyField) {
                this.covenantDetailForm.controls['frequencyTypeId'].setValue('');
            }
    
            let amountControl = this.covenantDetailForm.get('covenantAmount');
            if (this.disableAmountField) {
                amountControl.clearValidators();
                amountControl.disable();
            } else {
                amountControl.setValidators([Validators.compose([ValidationService.isNumber, Validators.required])]);
                amountControl.enable();
            }
            amountControl.updateValueAndValidity();
    
            let frequencyControl = this.covenantDetailForm.get('frequencyTypeId');
            if (this.disableFrequencyField) {
                frequencyControl.clearValidators();
            } else {
                frequencyControl.setValidators([Validators.required]);
                frequencyControl.enable();
            }
            frequencyControl.updateValueAndValidity();
        }
    
        // displayCovenantDetailForm: boolean;
        // formState: string = null;
        // selectedId?: number;
    
        getLoanCovenantTypes(): void {
            this.loanCovenantService.getAllLoanCovenantType().subscribe((response: any) => {
                this.covenantTypes = response.result;
            });
        }
    
        getFrequencyTypes(): void {
            this.loanCovenantService.getFrequencyTypes().subscribe((response: any) => {
                this.frequencyTypes = response.result;
            });
        }
    
        showCovenantDetailForm() {
            this.selectedId = null;
            this.covenantDetailForm.controls['loanApplicationDetailId'].setValue(this.loanApplicationDetailId);
            this.getLoanCovenantTypes();
            this.getFrequencyTypes();
            this.displayCovenantDetailForm = true;
        }
    
        clearControls() {
            this.covenantDetailForm = this.fb.group({
                casaAccountId: [''],
                covenantAmount: [''],
                covenantDate: [new Date(), Validators.required],
                covenantDetail: ['', Validators.required],
    
                covenantTypeId: ['', Validators.required],
                // covenantTypeName: [''],
                frequencyTypeId: [''],
                // frequencyTypeName: [''],
                isPercentage: [''],
                loanApplicationDetailId: ['', Validators.required],
            });
        }
    
        addCovenant(form) {
            const body = {
                casaAccountId: form.value.casaAccountId,
                covenantAmount: form.value.covenantAmount,
                covenantDate: form.value.covenantDate,
                covenantDetail: form.value.covenantDetail,
                covenantTypeId: form.value.covenantTypeId,
                // covenantTypeName: form.value.covenantTypeName,
                frequencyTypeId: form.value.frequencyTypeId,
                // frequencyTypeName: form.value.frequencyTypeName,
                isPercentage: form.value.isPercentage,
                loanApplicationDetailId: this.loanApplicationDetailId,
                // loanApplicationId: this.applicationId,
            };
            this.loadingService.show();

        if (this.selectedId === null) {
            this.loanCovenantService.saveCovenantDetailMaintenance(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.closeAndRefreshList()
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.loanCovenantService.updateCovenantDetailMaintenance(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.closeAndRefreshList()
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });

        }
        }
    
        // deleteSelectedCovenantItem(row) {
        //     this.loadingService.show();
        //     this.loanCovenantService.deleteLoanApplicationCovenant(this.callerId,row.loanCovenantDetailId).subscribe((response: any) => {
        //         if (response.success == true) {
        //             this.loadingService.hide();
        //             this.closeAndRefreshList()
        //         } else {
        //             this.handleError(response.error);
        //         }
        //     }, (err: any) => {
        //         this.handleError(err);
        //    });
        // }
    
        editConvenantDetail(row) {
            this.formState = 'Edit';
            //var mode = this.frequencyTypes.find(x => x.lookupId === row.frequencyTypeId).lookupName;
            this.selectedId = row.loanCovenantDetailId;
            this.covenantDetailForm = this.fb.group({
                casaAccountId: [row.casaAccountId],
                covenantAmount: [row.covenantAmount],
                covenantDate: [new Date(row.covenantDate), Validators.required],
                covenantDetail: [row.covenantDetail, Validators.required],
    
                covenantTypeId: [row.covenantTypeId, Validators.required],
                // covenantTypeName: [''],
                frequencyTypeId: [row.frequencyTypeId],
                // frequencyTypeName: [''],
                isPercentage: [row.isPercentage],
                loanApplicationDetailId: [this.loanApplicationDetailId, Validators.required],
            });
            this.displayCovenantDetailForm = true;
            this.onCovenantTypeChange(row.covenantTypeId);
        }
    
        changeCovenantAmountRateLabel(value) {
            this.AmountRateLabel = value ? 'Rate' : 'Amount'
        }
        onFrequencyTypeChange(x) { }
    
        handleError(message) {
            this.loadingService.hide();
        }
    
        deleteSelectedCovenantItem(row) {
            this.loadingService.show();
            this.loanCovenantService.deleteLoanApplicationCovenant(1,row.loanCovenantDetailId).subscribe((response: any) => {
                if (response.success == true) {
                    this.loadingService.hide();
                    this.closeAndRefreshList()
                } else {
                    this.handleError(response.error);
                }
            }, (err: any) => {
                this.handleError(err);
           });
        }
    


}