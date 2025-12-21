import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CollateralService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-security-release-search',
  templateUrl: './security-release-search.component.html'
})
export class SecurityReleaseSearchComponent implements OnInit {

  displaySearchForm: boolean = false;
  searchString: any;
  securityRelease: any[] = [];
  displaySearchTable: boolean;
  reload: any;
  selectedValuation: any;
  searchForm: FormGroup;
  OPERATION_ID: number = 147;
  CUSTOMER_ID: number;
  // GROUP_CUSTOMER_ID: number = -1;
  REFERENCE_NUMBER: string;
  TARGET_ID: number;
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
    this.collateralService.getSecurityReleaseSearch(this.searchString).subscribe((response: any) => {
      this.securityRelease = response.result;
      this.loadingService.hide();
      this.displaySearchForm = false;
      this.displaySearchTable = true;
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }

  targetId = 0;
  viewDocuments(row) {
    ++this.reload;
    this.selectedValuation = row;
    this.TARGET_ID = row.originalDocumentReleaseId;
    this.targetId = row.originalDocumentApprovalId;
    this.OPERATION_ID = row.operationId;
    this.CUSTOMER_ID = row.customerId;
    this.REFERENCE_NUMBER = row.documentReferenceNumber;
    this.displayDetail = true;
  }

  clearControls() {
    this.searchForm = this.fb.group({
      searchString: ['', Validators.required],
    });
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

