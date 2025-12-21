import { Component, OnInit } from '@angular/core';
// import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { AppConstant } from '../../../shared/constant/app.constant';
import { ValidationService } from '../../../shared/services/validation.service';
import swal from 'sweetalert2';
@Component({
    templateUrl: 'exchange-rate.component.html'
})
export class ExchangeRateComponent implements OnInit {

    exchangeRateList: any;
    exchangeRates: any[];
    currencies: any[];
    baseCurrency: any;
    displayExchangeRateForm: boolean = false;
    entityName: string = 'Exchange Rate';
    exchangeRateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any;
    selectedId: number = null;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private exchangeRateService: ExchangeRateService
    ) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
        this.getAllCurrencies();
        this.getBaseCurrency();
        this.getAllCurrencyRateCode();
    }

    getAll(): void {
        this.loadingService.show();
        this.exchangeRateService.get().subscribe((response: any) => {
            this.exchangeRates = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showExchangeRateForm() {
        this.clearControls();
        this.exchangeRateForm.controls['baseCurrency'].setValue(this.baseCurrency.currencyName);
        this.exchangeRateForm.controls['baseCurrencyId'].setValue(this.baseCurrency.currencyId);
        this.displayExchangeRateForm = true;
    }

    getAllCurrencies() {
        this.exchangeRateService.getAllCurrencies().subscribe((response: any) => {
            this.currencies = response.result;
        });
    }

    getAllCurrencyRateCode() {
        this.exchangeRateService.getAllCurrencyRateCode().subscribe((response: any) => {
            this.exchangeRateList = response.result;
        });
    }

    getBaseCurrency() {
        this.exchangeRateService.getBaseCurrency().subscribe((response: any) => {
            this.baseCurrency = response.result;

        });
    }
    clearControls() {
        this.selectedId = null;
        this.exchangeRateForm = this.fb.group({
            baseCurrencyId: ['', Validators.required],
            date: ['', Validators.required],
            baseCurrency: [''],
            currencyId: ['', Validators.required],
            rateCodeId: ['', Validators.required],
            exchangeRate: ['', Validators.required],
        });
    }


    submitForm(form) {
        this.loadingService.show();
        let body = {
            baseCurrencyId: form.value.baseCurrencyId,
            date: form.value.date,
            currencyId: form.value.currencyId,
            exchangeRate: form.value.exchangeRate,
            rateCodeId: form.value.rateCodeId,
        };


        if (this.selectedId === null) {
            this.exchangeRateService.save(body).subscribe((res) => {
                if (res.success == true) {
                    this.displayExchangeRateForm = false;
                    this.clearControls();
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', res.message, 'success');
                    this.getAll();
                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', res.message, 'error');
                }
            }, (err: any) => {
                this.loadingService.hide();
                swal('FinTrak Credit 360', JSON.stringify(err), 'error');
            });
        } else {
            this.exchangeRateService.update(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.displayExchangeRateForm = false;
                    this.clearControls();
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', res.message, 'success');
                    this.getAll();
                } else {
                    this.loadingService.hide();
                    swal('FinTrak Credit 360', res.message, 'error');
                }
            }, (err: any) => {
                this.loadingService.hide();
                swal('FinTrak Credit 360', JSON.stringify(err), 'error');
            });

        }
    }

    editExchangeRate(evt, index) {
        evt.preventDefault;
        this.clearControls();
        var row = this.exchangeRates[index];
        this.selectedId = row.currencyRateId;
        this.exchangeRateForm = this.fb.group({
            baseCurrencyId: [row.baseCurrencyId, Validators.required],
            baseCurrency: [row.baseCurrency],
            currencyId: [row.currencyId, Validators.required],
            rateCodeId: [(row.rateCodeId), Validators.required],
            exchangeRate: [(row.exchangeRate).toString(), Validators.compose([Validators.required,ValidationService.isNumber])],
            date: [new Date(row.date), Validators.required],
        });
        this.displayExchangeRateForm = true;
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayExchangeRateForm = false;
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
        this.getAll();
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

// TODO: update fail to load default date!