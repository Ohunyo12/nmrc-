import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CollateralService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-original-document-submission-search',
  templateUrl: './original-document-submission-search.component.html'
})
export class OriginalDocumentSubmissionSearchComponent implements OnInit {

  displaySearchForm: boolean = false;
  searchString: any;
  originalDocumentSearch: any[] = [];
  displaySearchTable: boolean;
  reload: any;
  selectedValuation: any;
  searchForm: FormGroup;
  operationId = 0;
  customerId = 0;
  originalDocumentApprovalId = 0;
  applicationReferenceNumber = "";
  displayDetail = false;

  constructor(private collateralService: CollateralService,
              private loadingService: LoadingService,
              private fb: FormBuilder,) { }

  ngOnInit() {
    this.clearControls();
  }

  showSearchForm() { this.displaySearchForm = true; }

  submitForm(form) {
    this.searchString = form.value.searchString;

    this.loadingService.show();
    this.collateralService.getOriginalDocumentSearch(this.searchString).subscribe((response: any) => {
      this.originalDocumentSearch = response.result;
      this.loadingService.hide();
      this.displaySearchForm = false;
      this.displaySearchTable = true;
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }


  viewDetail(row) {
    ++this.reload;
    this.selectedValuation = row;
      // this.uploadLength = null;
      this.operationId = row.operationId;
      this.customerId = row.customerId;
      this.originalDocumentApprovalId = row.originalDocumentApprovalId;
      this.applicationReferenceNumber = row.referenceNumber;
      this.displayDetail = true;
  }

  clearControls() {
    this.searchForm = this.fb.group({
      searchString: ['', Validators.required],
    });
  }

  closeModal(){
    this.reset();
    this.displayDetail = false;
  }

  reset(){
      this.operationId = null;
      this.customerId = null;
      this.originalDocumentApprovalId = null;
      this.applicationReferenceNumber = null;
  }

  show: boolean = false; message: any; title: any; cssClass: any;

	finishGood(message) {
		this.showMessage(message, 'success', "FintrakBanking");
		this.loadingService.hide();
	}

	hideMessage(event) { this.show = false; }

	finishBad(message) {
		this.showMessage(message, 'error', "FintrakBanking");
		this.loadingService.hide();
	}

	showMessage(message: string, cssClass: string, title: string) {
		this.message = message;
		this.title = title;
		this.cssClass = cssClass;
		this.show = true;
	}


}


