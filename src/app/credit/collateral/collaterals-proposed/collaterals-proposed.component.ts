import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CollateralService } from 'app/setup/services/collateral.service';
import { LoanService } from 'app/credit/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-collaterals-proposed',
  templateUrl: './collaterals-proposed.component.html',
})
export class CollateralsProposedComponent implements OnInit {

    proposedCollateral:any[] = [];
	@Input() loanApplicationDetailId: any;
	@Input() currentApprovalStatusId: number;
	@Input() loanApplicationId = 0;
	@Input() currencyId = 0;
	@Input() isForSwap = false;
	@Output() figures: EventEmitter<any> = new EventEmitter<any>();
    @Output() sum: EventEmitter<number> = new EventEmitter<number>();
	@Output() emitProposedCollateralDetail: EventEmitter<number> = new EventEmitter();
	@Output() displayInitialModal: EventEmitter<any> = new EventEmitter<any>();
	@Output() isInsurancePolicyConfirmedByCreditAdmin: EventEmitter<any> = new EventEmitter<any>();
	collateral: any;
	displayCollateralDetails: boolean;
	@Input() allowToAddInsurancePolicy: boolean = false
	displayCollateralHistory = false;
	showSearchCollateralForSwap = false;
    @Output() emitCollateral: EventEmitter<any> = new EventEmitter<any>();
	@Input() set reload(value: number) {
        if (value > 0) {
			this.displayInitialModal.emit(true); 
		this.getProposedCollateral(this.loanApplicationId, this.currencyId);
        } else {
            this.refresh();
        }
    }
	
	constructor(
		private collateralService: CollateralService,
        private loanService: LoanService,
		// private creditAppraisalService: CreditAppraisalService,
		private loadingService:LoadingService,
	) { }

	ngOnInit() {
		// this.getProposedCollateral(this.loanApplicationId, this.currencyId);
	}

	getProposedCollateral(loanApplId, currencyId): void {
        this.loadingService.show();
        this.collateralService.getProposedCustomerCollateral(loanApplId, currencyId).subscribe((response: any) => {
            this.loadingService.hide();
            this.proposedCollateral = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
		});
	}
	// getProposedCustomerCollateralByCustomerId(loanApplicationId): void {
	// 	this.collateralService.getProposedCustomerCollateralByCustomerId(this.selectedCustomerId, true).subscribe((response) => {
	// 		this.proposedCollateral = response.result;
	// 		this.emitProposedCollateralDetail.emit(this.proposedCollateral);
	// 	});

	// }
	
	viewCollateralDetail(row) {
		//console.log("test: ", row);
		
        this.collateral = row;
        this.displayCollateralDetails = true;
		this.displayInitialModal.emit(false); 
	}

	viewCollateralHistory(row) {
        this.collateral = row;
        this.displayCollateralHistory = true;
	}
	
	showSearchCollateral(row) {
        this.collateral = row;
		this.showSearchCollateralForSwap = true;
	}

	emitCollateralDetail(event) {
		event.oldCollateral = this.collateral;
		this.emitCollateral.emit(event);
		this.showSearchCollateralForSwap = false;
    }

	refresh() {
        
    }

	getInsurancePolicyInformationConfirmation(detail) {
        this.isInsurancePolicyConfirmedByCreditAdmin.emit(detail);
    }
}
