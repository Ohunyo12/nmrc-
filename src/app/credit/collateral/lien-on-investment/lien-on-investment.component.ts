import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CollateralService } from 'app/setup/services/collateral.service';
import { CollateralType, GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { CasaService } from 'app/customer/services/casa.service';

@Component({
  selector: 'app-lien-on-investment',
  templateUrl: './lien-on-investment.component.html'
})
export class LienOnInvestmentComponent implements OnInit {

	@Input() loanApplicationId = 0;
	@Input() applicationDetailId = 0;
	@Input() currencyId = 0;
	@Input() isUserLegal: boolean;
    @Output() allLiensArePlaced: EventEmitter<boolean> = new EventEmitter<boolean>();
	proposedCollateral: any[] = [];
	collateralDetails: any[] = [];
	displayCollateralDetails: boolean;
	liensForFacility: any[] = [];
	accountBalance: number;
	accountName: string;
	collateralId: number;
	@Input() set reload(value: number) {
		
        this.liensForFacility = [];
		this.collateralDetails = [];
		this.proposedCollateral = [];
	if (value > 0) {
		this.refresh();
        }
    }

	constructor(
		private collateralService: CollateralService,
        private casaSrv: CasaService,
        private loadingService: LoadingService,
	) { }

	ngOnInit() {
	}

	refresh() {
		this.getLienByApplicationDetailId(this.applicationDetailId);
		this.getProposedCollateral();
	}

	getLienByApplicationDetailId(applicationDetailId) {
        this.loadingService.show();
		this.collateralService.getLienByApplicationDetailId(applicationDetailId).subscribe((response: any) => {
			this.loadingService.hide();
			if (response.success == true) {
				this.liensForFacility = response.result;
			}else{
				this.loadingService.hide();
			}
		}, (err: any) => {
			this.loadingService.hide(1000);
		});
	}

	isLienAlreadyPlaced(collateralId): string {
		if (this.liensForFacility == null || this.liensForFacility == undefined || this.liensForFacility.length <= 0) {
			return '<span class="label label-info">No</span>';
		}
			return (this.liensForFacility.findIndex(d => d.collateralId == collateralId) == -1) ? '<span class="label label-info">No</span>' : '<span class="label label-success">Yes</span>';
	}

	isLienPlaced(collateralId): boolean {
		if (this.liensForFacility == null || this.liensForFacility == undefined || this.liensForFacility.length <= 0) {
			return false;
		}
			return (this.liensForFacility.findIndex(d => d.collateralId == collateralId) == -1) ? false : true;
	}

	checkIfAllLiensArePlaced() {
        let numberLiensNotPlaced = 0;
        if (this.proposedCollateral == undefined || this.proposedCollateral == null || this.proposedCollateral.length <= 0) {
            this.allLiensArePlaced.emit(true);
            return;
        }
        this.proposedCollateral.forEach((m) => {
            if (this.liensForFacility == null || this.liensForFacility == undefined) {
                return;
            }
            if (this.liensForFacility.findIndex(d => d.collateralId == m.collateralId) == -1) {
                //required lien is not placed
			++numberLiensNotPlaced;
            }
        });
		this.allLiensArePlaced.emit(numberLiensNotPlaced == 0);
		// console.log('numberLiensNotPlaced', numberLiensNotPlaced);
        return;
    }

	getProposedCollateral(): void {
        this.loadingService.show();
		this.collateralService.getProposedCustomerCollateral(this.loanApplicationId, this.currencyId).subscribe((response: any) => {
			if (response.success == true) {
				this.loadingService.hide();
				let collaterals: any[] = response.result;
				if (collaterals != null && collaterals != undefined && collaterals.length > 0) {
					this.proposedCollateral = collaterals.filter(c => c.collateralTypeId == CollateralType.CASA || c.collateralTypeId == CollateralType.FIXED_DEPOSIT)
				}
			}else{
				this.loadingService.hide();
			}
		}, (err: any) => {
			this.loadingService.hide(1000);
		});
	}

	viewDetail(collateralId: number, collateralTypeId: number) {
		this.collateralId = collateralId;
        // this.loadingService.show();
		// this.collateralService.getCollateralInformationByCollateralType(collateralId, collateralTypeId).subscribe((res) => {
		// 	this.loadingService.hide();
		// 	if (res.success == true && res.result != null) {
		// 		this.collateralDetails = [];
		// 		this.collateralDetails.push(res.result);
				this.displayCollateralDetails = true;
		// 	}
		// }, (err: any) => {
		// 	this.loadingService.hide(1000);
		// });
	}

	placeLien(row) {
		this.loadingService.show();
		let body = {
			applicationDetailId: this.applicationDetailId,
			amount: row.availableCollateralValue,
			accountNo: row.accountNumber,
			collateralId: row.collateralId
		};
		this.collateralService.placeLienOnInvestment(body).subscribe((response: any) => {
		this.loadingService.hide();
		if (response.success == true) {
			this.refresh();
			this.finishGood(response.message);
			} else {
				this.finishBad(response.message);
			}
		},(err: any) => {
			this.loadingService.hide();
			this.finishBad(err);
		});
	}

	removeLien(row) {
		let lien = this.liensForFacility.find(d => d.collateralId == row.collateralId);
		if (lien != null && lien != undefined) {
			let applicationDetailLienId = lien.applicationDetailLienId;
			this.collateralService.deleteLienOnInvestment(applicationDetailLienId).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
					this.refresh();
					this.finishGood(response.message);
					} else {
						this.finishBad(response.message);
					}
			},(err: any) => {
				this.loadingService.hide();
				this.finishBad(err);
			});
		} else {
			this.finishBad('This Lien doesn\'t exist!');
		}
		
	}

	getAccountBalance(acctNumber) {
        this.casaSrv.getCustomerAccountBalance(acctNumber).subscribe((response: any) => {
            if (response.result != undefined) {

                if (response.success == false) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                } else {
                    this.accountBalance = response.result.availableBalance;
                    this.accountName = response.result.accountName;
                }
            }
        });
    }


	// ---------------------- message ----------------------

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
