import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { CurrencyService } from '../../../../../setup/services';
import { LoanApplicationService } from '../../../../services';
import { ConvertString, GlobalConfig } from '../../../../../shared/constant/app.constant';
//import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
//import {  ConvertString } from 'app/shared/constant/app.constant';

import swal from 'sweetalert2';
import { CasaService } from '../../../../../customer/services/casa.service';
@Component({
    selector: 'bond-guranty',
    templateUrl: './bond-guranty.component.html',
    // styleUrls: ['./name.component.scss']
})
export class BondGurantyComponent implements OnInit, OnChanges {
    customerAccount: any;
    showCustomerCasa: boolean = false;
    bondDetailForm: FormGroup; allowedCurrencies: any[] = [];
    showUploadBGInvoice: boolean = false; endDate: any;
    showOtherPrincipal:boolean=false;
    startDate: any; exchange: any = {}; principal: any[] = [];

    @Input() requireCasaAccount: boolean = false;
    @Input() resetForm: boolean = false;
    @Input() customerId: number;

    @Input() set extendedFormDefaultBody(value: any) {
        if (value != null) { this.setDefaultFormValues(value); }
    }

    @Output() bondDetails: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
    @Output() disableUpload: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder, private casaService: CasaService, private currencyService: CurrencyService,
        private loanAppService: LoanApplicationService, ) { }

    ngOnInit() {
        this.bondInfoTemp();
        this.getAllPrincipal();
        this.getAllCurrencies();
    }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.requireCasaAccount) {
            this.showCustomerCasa = true;
            let control = this.bondDetailForm.controls['casaAccountId'];
            control.setValidators([Validators.required]);
            this.getAllCustomerAccount(this.customerId)
        }
        if (this.resetForm) this.bondDetailForm.reset();
    }

    getAllPrincipal() {
        this.loanAppService.getLoanPrincipals().subscribe((response: any) => {
                this.principal = response.result;
            }, (err) => {

            });
    }

    getAllCustomerAccount(customerId: number) {
        this.casaService.getAllCustomerAccountByCustomerId(customerId)
            .subscribe((response: any) => {
                this.customerAccount = response.result;
            });
    }
    getAllCurrencies() {
        this.currencyService.getAllCurrencies()
            .subscribe((res) => {
                this.allowedCurrencies = res.result;
                ////console.log("currencies", this.allowedCurrencies);
            }, (err) => {
                ////console.log(err);
            });
    }

    CheckFormValidity() {
        if (this.bondDetailForm.valid) {
            this.bondDetails.emit(this.bondDetailForm);
            ////console.log("this.bondDetails", this.bondDetailForm);
        }
        else{
            this.bondDetails.emit(this.bondDetailForm);
            ////console.log("this.bondDetailFormInval", this.bondDetailForm);
        }
    }

    onSelectPrincipal(id) {
        // this.showOtherPrincipal = true;
        
        const principalNameControl = this.bondDetailForm.get('principalName');
        ////console.log("id",id);
        if (id == Number(-1)) {
            ////console.log("Validate","Validate");
            principalNameControl.setValidators(Validators.required);
            this.showOtherPrincipal = true;
        } else {
            ////console.log("Clear","Clear");
            principalNameControl.clearValidators();
            this.showOtherPrincipal = false;
        }
        
        principalNameControl.updateValueAndValidity();
        this.CheckFormValidity();
    }

    bondInfoTemp() {
        this.bondDetailForm = this.fb.group({
            casaAccountId: [''],
            principalId: ['', Validators.required],
            bondAmount: ['', Validators.required],
            bondCurrencyId: ['', Validators.required],
            contractStartDate: ['', Validators.required],
            contractEndDate: ['', Validators.required],
            isTenored: ['', Validators.required],
            isBankFormat: ['', Validators.required],
            bondfcyRate: ['', Validators.required],
            bondfcyAmount: ['', Validators.required],
            principalName: ['', Validators.required],
        });
    }

    getExchangeRateBond(id) {
        let lcyValue: number = 0;
        let amountValues = this.bondDetailForm.value;//.replace(/[^0-9-.]/g, '');
        this.loanAppService.getExchangeRate(id)
            .subscribe((res) => {
                this.exchange = res.result;
                lcyValue = +ConvertString.TO_NUMBER(amountValues.bondAmount) * this.exchange.sellingRate;
                this.bondDetailForm.controls["bondfcyAmount"].setValue(ConvertString.ToNumberFormate(lcyValue));
                this.bondDetailForm.controls["bondfcyRate"].setValue(this.exchange.sellingRate);
            });
        this.CheckFormValidity()
    }

    uploadBonsAndGuaranteeDocuments() {
        this.disableUpload.emit(true);
        this.CheckFormValidity()

    }

    onIsBankFormatChanged(evt) {
        if (Number(evt) === 0) {
            this.showUploadBGInvoice = true;
        }
        if (Number(evt) === 1) {
            this.showUploadBGInvoice = false;
        }
        this.CheckFormValidity()

    }

    validateContratDate2() {
        if (this.endDate === undefined) {
            this.bondDetailForm.controls["contractEndDate"].setValue("");
        }
        if (this.startDate === undefined) {
            this.bondDetailForm.controls["contractStartDate"].setValue("");
        }
        if (this.startDate !== "" && this.endDate !== "") {
            if (this.startDate < this.endDate && this.startDate != this.endDate) {
                this.CheckFormValidity()
            } else {
                this.bondDetailForm.controls["contractEndDate"].setValue("");
                this.bondDetailForm.controls["contractStartDate"].setValue("");

                swal(`${GlobalConfig.APPLICATION_NAME}`,
                    'Contract start date must be earlier than contract expiry date', 'info');
            }
        }
    }

    setDefaultFormValues(body:any) {
        // //console.log('body = ',body);
        this.bondDetailForm.controls["principalId"].setValue(body.principalId);
        this.bondDetailForm.controls["isTenored"].setValue(body.isTenored == true? 1 : 0);
        this.bondDetailForm.controls["principalName"].setValue(body.principalName);
        this.bondDetailForm.controls["casaAccountId"].setValue(body.casaAccountId);
        this.bondDetailForm.controls["contractStartDate"].setValue(new Date(body.contractStartDate));
        this.bondDetailForm.controls["contractEndDate"].setValue(new Date(body.contractEndDate));
        this.bondDetailForm.controls["isBankFormat"].setValue(body.isBankFormat == true ? 1 : 0);
        this.bondDetailForm.controls["bondAmount"].setValue(body.bondAmount);
        this.bondDetailForm.controls["bondCurrencyId"].setValue(body.bondCurrencyId);
        this.bondDetailForm.controls["bondfcyRate"].setValue(body.bondfcyRate);
        this.bondDetailForm.controls["bondfcyAmount"].setValue(body.bondfcyAmount);
        this.getExchangeRateBond(body.bondCurrencyId);
    }

}