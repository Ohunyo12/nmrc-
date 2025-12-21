import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service'; // TODO: modify path!
import { LoadingService } from 'app/shared/services/loading.service';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';
import { CurrencyService } from 'app/setup/services/currency.service';
import { CasaService } from 'app/customer/services/casa.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-lc-cash-buildup-plan',
  templateUrl: './lc-cash-buildup-plan.component.html'
})
export class LcCashBuildupPlanComponent implements OnInit {
// ------------------- declarations ----------------- 

@Input() panel: boolean = false;
@Input() label: string = '';
@Input() lcIssuanceId: number;
@Input() showButtons = true;
@Input() customerId = 0;

@Input() set reload(value: number) { 
		if (value > 0) {
		this.getLcCashBuildUpPlans(this.lcIssuanceId);
		this.getAllCustomerAccount(this.customerId);
		}
	}

formState: string = 'New';
selectedId: number = null;

lcCashBuildUpPlans: any[] = [];
cashBuildUpReferenceTypes: any[] = [];
lcCashBuildUpPlanForm: FormGroup;
displayLcCashBuildUpPlanForm: boolean = false;
currencies: any[] = [];
customerAccount: any[] = [];


// ---------------------- init ----------------------

	constructor(
		private fb: FormBuilder,
		private loadingService: LoadingService,
		private camService: CreditAppraisalService,
		private currencyService: CurrencyService,
        private casaService: CasaService,
		private lcService: LetterOfCreditService,
	) { }

	ngOnInit() {
		this.clearControls();
        this.getAllCurrencies();
		this.getLcCashBuildUpReferenceTypes();
	}

	// ------------------- api-calls --------------------

	saveLcCashBuildUpPlan(form) {
		let body = {
			lcIssuanceId: form.value.lcIssuanceId,
			amount: form.value.amount,
			currencyId: form.value.currencyId,
			cashBuildUpReferenceTypeId: form.value.cashBuildUpReferenceTypeId,
			collectionCasaAccountId: form.value.collectionCasaAccountId,
			daysInterval: form.value.daysInterval,
			planDate: form.value.planDate,
			lcCashBuildUpPlanId: this.selectedId
		};
		this.loadingService.show();
		if (!(this.selectedId > 0)) {
			this.lcService.saveLcCashBuildUpPlan(body).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
					this.finishGood(response.message);
					this.reloadGrid();
				}
				else {
					this.finishBad(response.message);
				}
			}, (err: any) => {
				this.loadingService.hide(1000);
				this.finishBad(JSON.stringify(err));
			});
		} else {
			this.lcService.updateLcCashBuildUpPlan(body, this.selectedId).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
					this.finishGood(response.message);
					this.reloadGrid();
				}
				else {
					this.finishBad(response.message);
				}
			}, (err: any) => {
				this.loadingService.hide(1000);
				this.finishBad(JSON.stringify(err));
			});
		}
	}

	getLcCashBuildUpPlans(lcIssuanceId: number) {
		if (isNullOrUndefined(lcIssuanceId) || lcIssuanceId == 0){
			return;
		}
		this.loadingService.show();
		this.lcService.getLcCashBuildUpPlans(lcIssuanceId).subscribe((response: any) => {
			this.loadingService.hide();
			this.lcCashBuildUpPlans = response.result;
		}, (err: any) => {
			this.loadingService.hide(1000);
			this.finishBad(JSON.stringify(err));
		});
	}

	getLcCashBuildUpReferenceTypes() {
		this.loadingService.show();
		this.lcService.getLcCashBuildUpReferenceTypes().subscribe((response: any) => {
			this.loadingService.hide();
			this.cashBuildUpReferenceTypes = response.result;
		}, (err: any) => {
			this.loadingService.hide(1000);
			this.finishBad(JSON.stringify(err));
		});
	}

	deleteLcCashBuildUpPlan(row) {
		const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to delete',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success btn-move',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: true,
            }).then(function () {
				__this.loadingService.show();
				__this.lcService.deleteLcCashBuildUpPlan(row.lcCashBuildUpPlanId).subscribe((response: any) => {
					__this.loadingService.hide();
			if (response.result == true) {
				__this.finishGood(response.message);
				__this.reloadGrid();
			}
		}, (err: any) => {
			__this.loadingService.hide(1000);
			__this.finishBad(JSON.stringify(err));
		});
	}, function (dismiss) {
		if (dismiss === 'cancel') {
			swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
		}
	});
	}

	reloadGrid() {
		this.displayLcCashBuildUpPlanForm = false;
		this.getLcCashBuildUpPlans(this.lcIssuanceId);
	}

	getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
            // console.log("currencies", this.currencies);
        }, (err) => {
            ////console.log(err);
        });
    }

    getAllCustomerAccount(customerId: number) {
		if ((customerId == undefined) || (customerId == null) || (customerId == 0)){
			return;
		}
        this.loadingService.show();
        this.casaService.getAllCustomerAccountByCustomerId(customerId)
        .subscribe((response: any) => {
            this.loadingService.hide();
            this.customerAccount = response.result;
        }, () => {
            this.loadingService.hide(1000);
        });
    }

	getCurrencyCode(value): string {
        if ((value == undefined) || (value == null)) {
          //  console.log('value =>' + value);
            return '';
        }
        if ((this.currencies == undefined) || (this.currencies == null)) {return;}
        let currency = this.currencies.find(c => c.currencyId == value);
        if ((currency == undefined) || (currency == null)) {return;}
        return currency.currencyCode;
    }

	// ---------------------- form ----------------------

	clearControls() {
		this.formState = 'New';
		this.selectedId = null;
		this.lcCashBuildUpPlanForm = this.fb.group({
            lcIssuanceId: [this.lcIssuanceId, Validators.required],
			amount: ['', Validators.required],
			currencyId: ['', Validators.required],
			cashBuildUpReferenceTypeId: ['', Validators.required],
			collectionCasaAccountId: ['', Validators.required],
			daysInterval: ['', Validators.required],
			planDate: '',
		});
	}

	editLcCashBuildUpPlan(row) {
		this.loadingService.show();
		this.clearControls();
		this.formState = 'Edit';
		this.selectedId = row.lcCashBuildUpPlanId;
		this.lcCashBuildUpPlanForm = this.fb.group({
			lcIssuanceId: [row.lcIssuanceId, Validators.required],
			amount: [row.amount, Validators.required],
			currencyId: [row.currencyId, Validators.required],
			cashBuildUpReferenceTypeId: [row.cashBuildUpReferenceTypeId, Validators.required],
			collectionCasaAccountId: [row.collectionCasaAccountId, Validators.required],
			daysInterval: [row.daysInterval, Validators.required],
			planDate: row.planDate,
		});
		this.displayLcCashBuildUpPlanForm = true;
		this.loadingService.hide();
	}

	showLcCashBuildUpPlanForm() {
		this.clearControls();
		this.selectedId = null;
		this.displayLcCashBuildUpPlanForm = true;
	}

	// ---------------------- message ----------------------

	show: boolean = false; message: any; title: any; cssClass: any;

	finishGood(message) { 
		this.showMessage(message, 'success', "FintrakBanking");
	}

	hideMessage(event) { this.show = false; }

	finishBad(message) {
		this.showMessage(message, 'error', "FintrakBanking");
	}

	showMessage(message: string, cssClass: string, title: string) {
		this.message = message;
		this.title = title;
		this.cssClass = cssClass;
		this.show = true;
	}
}
