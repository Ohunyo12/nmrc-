import { DepartmentService } from '../../../setup/services/department.service';
import { ProductService } from '../../../setup/services/product.service';
import { BranchService } from '../../../setup/services/branch.service';
import { BulkRateService } from '../../services/bulkrate.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoanOperationService } from '../../services/loan-operations.service';
import { CasaService } from '../../../customer/services/casa.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'bulk-rate-review',
  templateUrl: './bulk-rate-review.component.html',
})
export class BulkRateReviewComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  rateReviewForm: FormGroup;
  productIndex: any[];
  excemptions: any[];
  newInterestRateReview: any[];
  searchTerm$ = new Subject<any>();
  searchAccountTerm$ = new Subject<any>();
  searchResults: any[];
  displaySearchModal: boolean = false;
  displayAddInterestReviewModal: boolean = false;
  width: string;
  displayConfirmDialog: boolean = false;
  selectedRateData: any;
  loanReferenceNumber: string;
  loanId: number;
  show: boolean = false; message: any; title: any; cssClass: any;
  newExcemption: any = {
      loanId: null,
      loanReferenceNumber: '',
    };

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private prodService: ProductService, private bulkService: BulkRateService, 
    private loanOperationService: LoanOperationService,
    private departmentService: DepartmentService) 
    {
      this.loanOperationService.searchForLoan(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;
      });
    // this.casaService.searchForAccount(this.searchAccountTerm$)
    //   .subscribe(results => {
    //     this.casaSearchResults = results.result;
    //   });
     } 

  ngOnInit() {
    this.getProductIndex();
    this.getLoanRateExcemptions();
    this.getNewInterestRateReviews();
    this.clearControls();
  }


  getProductIndex() {
    this.prodService.getProductPriceIndex().subscribe((response: any) => {
      this.productIndex = response.result;
    });
  }

  getLoanRateExcemptions() {
    this.bulkService.getExcemptions().subscribe((response: any) => {
      this.excemptions = response.result;
    });
  }

  getNewInterestRateReviews() {
    this.bulkService.getNewInterestRateReviews().subscribe((response: any) => {
      this.newInterestRateReview = response.result;
    });
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  pickSearchedData(item) {
    var selectedExcemptionRecord = this.searchResults.filter(x => x.loanReferenceNumber == item.loanReferenceNumber);
    this.loanReferenceNumber = selectedExcemptionRecord[0].loanReferenceNumber;
    this.loanId = selectedExcemptionRecord[0].loanId;
    this.displaySearchModal = false;
    this.addLoanRateExemption(this.loanId, this.loanReferenceNumber);
  }

  onIndexChange(index): void{
    var selectedIndex = this.productIndex.filter(x=>x.productPriceIndexId == index);
    this.rateReviewForm.controls['indexOldrate'].setValue(selectedIndex[0].priceIndexRate);
  }

  onSelectedRateIndex(index) {
    this.selectedRateData = index.data;
    this.showConfirmDialog();
  }

  showConfirmDialog() {
    this.title = 'Interest Review Application';
    this.message = 'Are you sure you want to perform this action ?\n If you click yes, the new rate will be applied to all non excempted loans.';
    this.width = '500';
    this.displayConfirmDialog = true;
    }

    hideConfirmDialog() {
      this.displayConfirmDialog = false;
      }
  
  addLoanRateExemption(loanId, loanReferenceNumber ){
    var body = {
      loanId: loanId,
      loanReferenceNumber: loanReferenceNumber,
    };
    this.bulkService.addLoanBulkRateExcemptions(body).subscribe((res) => {
      if (res.success == true) {
        this.finishGood(res.message);
        this.getLoanRateExcemptions();
      } else {
        this.finishBad(res.message);
      }
    }, (err: any) => {
      this.finishBad(JSON.stringify(err));
    });
  }

  submitForm(formObj) {
    this.displayConfirmDialog = false;
    this.loadingService.show();
    const bodyObj = {
      EffectiveDate : formObj.value.rateEffectiveDate,
      ProductPriceIndexId : formObj.value.rateIndexId,
      OldInterestRate : formObj.value.indexOldrate,
      NewInterestRate : formObj.value.indexNewrate,
    };
      this.bulkService.addNewInterestRate(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getNewInterestRateReviews();
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
  }

  //priceindexId,  newRate, DateTime applicationDate, int staffId
  applyNewBulkRate(formObj) {
    this.loadingService.show();
    const bodyObj = {
      productPriceIndexId : this.selectedRateData.productPriceIndexId,
      effectiveDate :  this.selectedRateData.effectiveDate,
      newInterestRate : this.selectedRateData.newInterestRate,
    };
      this.bulkService.applyBulkInterestRate(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.getNewInterestRateReviews();
          this.finishGood(res.message);
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
  }
  

  showRateReviewForm():void{
    this.displayAddInterestReviewModal = true;
  }

  clearControls() {
    this.selectedId = null;
    this.rateReviewForm = this.fb.group({
      rateIndexId: ['', Validators.required],
      rateEffectiveDate: ['', Validators.required],
      indexNewrate: ['', Validators.required],
      indexOldrate: ['', Validators.required],
    });
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
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
}
