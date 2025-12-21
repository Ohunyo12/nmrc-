import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-collateral-swap-search',
  templateUrl: './collateral-swap-search.component.html'
})
export class CollateralSwapSearchComponent implements OnInit {

	collateralSwapId = 0;
	displaySwapDetails = false;
	displaySearchTable = false;
	collateralSwapRequests: any[] = [];
    searchForm: FormGroup;
    displaySearchForm: boolean = false;
	searchString = '';
	activeTabindex = 0;
	collateralSwapDetailSearch: any = {};
	constructor(
		private fb: FormBuilder,
		private collateralService: CollateralService,
		private loadingService: LoadingService
	) { }

	ngOnInit() {
		this.clearControls();
	}

    showSearchForm() { this.displaySearchForm = true; }

	clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
	}
	
	submitForm(form) {
        this.searchString = form.value.searchString;
		this.collateralSwapRequests = [];
		this.collateralSwapDetailSearch = {};
		this.displaySearchTable = false;
		this.displaySwapDetails = false;
        
		this.loadingService.show();
		this.collateralService.searchForCollateralSwap(this.searchString).subscribe((response: any) => {
			this.collateralSwapRequests = response.result;
			this.loadingService.hide();
			this.displaySearchForm = false;
			this.displaySearchTable = true;
			// this.displayApplicationDetail = false;
		}, (err: any) => {
			this.loadingService.hide(1000);
		});
		this.activeTabindex = 0;
	}

	view(row) {
		this.displaySwapDetails = false;
		this.collateralSwapDetailSearch = {};
		this.collateralSwapDetailSearch = row;
        this.collateralSwapId = row.collateralSwapId;
		this.displaySwapDetails = true;
		this.activeTabindex = 1;
	}
	
	onTabChange(event) {
		this.activeTabindex = event.index;
	}
}
