import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../../admin/services/authentication.service';
import { ChartOfAccount } from '../../../models/chartofaccount';
import { LedgerService } from '../../../services';
import { ChartOfAccountService } from '../../../services';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../../services';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CompanyService } from '../../../services';
import { TabViewModule, SelectItem, ChipsModule } from 'primeng/primeng';
import { CurrencyService } from '../../../services/currency.service';
import { Currency } from '../../../models/general-setup';
import { ICurrency } from '../../../models/currency';
import { ValidationService } from '../../../../shared/services/validation.service';

@Component({
    templateUrl: 'chart-of-account.component.html'
})

export class ChartOfAccountComponent implements OnInit {
    display: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    companies: any[];
    branches: any[];
    chartFormGroup: FormGroup;
    charts: any[];
    chartClasses: any[];
    accounttypes: any[];
    finStatementCaptions: any[];
    selectedCurrencies: any;
    coaCurrencies: ICurrency[];
    mappedCurrencies: string[];
    tempCurrencies: any[] = [];
    index: number = 0;
    currencyModel: any;
    disableCurrencies = true;
    displayCurrencies = false;
    displaySelectedCurrencies = false;
    panelHeader = 'New Chart of Account';

    constructor(private coyService: CompanyService,
        private loadingService: LoadingService,
        private branchService: BranchService,
        private fb: FormBuilder,
        private chartOfAccountSrv: ChartOfAccountService,
        private ledgerService: LedgerService,
        private userService: AuthenticationService,
        private currencyService: CurrencyService) { }

    ngOnInit() {
        this.loadingService.show();

        this.initializeForm();
        this.getLedgers();
        this.getFinStatementCaption();
        this.getAllCurrencies();
        this.getMainAccounts();
        this.getAllChartOfAccountsClasses();
    }

    initializeForm() {
        this.chartFormGroup = this.fb.group({
            accountId: [''],
            accountCode: ['', Validators.required],
            accountName: ['', Validators.required],
            accountTypeId: ['', Validators.required],
            companyId: [''],
            branchId: [''],
            currencies: [''],
            systemUse: [''],
            accountStatusId: ['', Validators.required],
            branchSpecific: [false],
            oldAccountId: [''],
            fsCaptionId: ['', Validators.required],
            createdBy: [''],
            isSubAccount: [false],
            mainAccountId: [''],
            glClassId: ['', Validators.required]
        });
    }


    getMainAccounts() {
        this.chartOfAccountSrv.getAllChartOfAccounts().subscribe((response: any): any => {
            this.charts = response.result;
            this.loadingService.hide();
        }, (err) => {

        });
    }

    getLedgers() {
        this.ledgerService.get().subscribe((response: any) => {
            this.accounttypes = response.result;
        }, (err) => {
        });
    }

    getFinStatementCaption() {
        this.chartOfAccountSrv.getFinancialStatementCaption().subscribe((response: any) => {
            this.finStatementCaptions = response.result;
        }, (err) => {
        });
    }

    getAllCurrencies() {
        let currencies: Currency[];
        this.currencyService.getAllCurrencies().subscribe((data) => {
            this.coaCurrencies = [];
            currencies = data.result;
            currencies.forEach(element => {
                this.coaCurrencies.push({ currencyId: element.currencyId, currencyName: element.currencyCodeName });
            });
        });
    }

    getAllChartOfAccountsClasses() {
        this.chartOfAccountSrv.getAllChartOfAccountClasses().subscribe((response: any): any => {
            this.chartClasses = response.result;
        }, (err) => {

        });
    }

    onCurrencySelect(i) {

    }

    // onCompanyChanged() {
    //     this.getBranches(this.chartFormGroup.value.companyId);
    // }

    onSubmit({ value, valid }: { value: ChartOfAccount, valid: boolean }) {
        this.loadingService.show();
        let loggedInUser = this.userService.getLoggedInUser();
        let body = {
            // accountId: value.accountId,
            accountCode: value.accountCode,
            accountName: value.accountName,
            accountTypeId: value.accountTypeId,
            currencies: this.selectedCurrencies,
            systemUse: true,
            branchSpecific: value.branchSpecific,
            fsCaptionId: value.fsCaptionId,
            accountStatusId: value.accountStatusId,
            glClassId: value.glClassId
        };


        let accountId = value.accountId;

        if (accountId === null || typeof (accountId) === 'string') {
            this.chartOfAccountSrv.saveChartOfAccount(body).subscribe((response: any) => {
                if (response.success === true) {
                    this.initializeForm();
                    this.loadingService.hide();
                    this.showMessage(response.message, 'success', 'FintrakBanking');
                    this.getMainAccounts();
                    this.selectedCurrencies = [];
                    this.handleChange(0);
                    this.mappedCurrencies = [];
                    this.display = false;
                } else {
                    this.loadingService.hide();
                    this.showMessage(response.message, 'error', 'FintrakBanking');
                }
            }, (err) => {
                this.loadingService.hide();
                this.showMessage(JSON.stringify(err), 'error', 'FintrakBanking');
            });
        } else {
            this.chartOfAccountSrv.updateChartOfAccount(accountId, body).subscribe((response: any) => {
                if (response.success === true) {
                    this.loadingService.hide();
                    this.showMessage(response.message, 'success', 'FintrakBanking');
                    this.getMainAccounts();
                    this.handleChange(0);
                    this.mappedCurrencies = [];
                    this.display = false;
                } else {
                    this.loadingService.hide();
                    this.showMessage(response.message, 'error', 'FintrakBanking');
                }
            }, (err) => {
                this.loadingService.hide();
                this.showMessage('Network error', 'error', 'FintrakBanking');
            });
        }

    }
    editChartOfAccount(charts) {
        let row = charts;
        this.panelHeader = 'Edit Chart of Account';
        this.display = true;
        this.chartFormGroup = this.fb.group({
            accountId: [row.accountId],
            accountCode: [row.accountCode],
            accountName: [row.accountName],
            accountTypeId: [row.accountTypeId],
            // companyId: [row.accountId],
            // branchId: [row.accountId],
            currencies: [row.currencies],
            systemUse: [row.systemUse],
            accountStatusId: [row.accountStatusId],
            branchSpecific: [row.branchSpecific],
            oldAccountId: [row.oldAccountId],
            fsCaptionId: [row.fsCaptionId],
            createdBy: [row.createdBy],
            isSubAccount: [row.isSubAccount],
            mainAccountId: [row.mainAccountId],
            glClassId: [row.glClassId]
        });
        this.selectedCurrencies = row.currencies;
        let tempData = this.selectedCurrencies;
        this.mappedCurrencies = [];
        tempData.forEach(el => { this.mappedCurrencies.push(el.currencyName); });

        this.disableCurrencies = false;
          
    }
    editChart(index, evt) {
        evt.preventDefault();
        this.panelHeader = 'Edit Chart of Account';
        this.display = true;

        let row = this.charts[index];
        this.chartFormGroup = this.fb.group({
            accountId: [row.accountId],
            accountCode: [row.accountCode],
            accountName: [row.accountName],
            accountTypeId: [row.accountTypeId],
            // companyId: [row.accountId],
            // branchId: [row.accountId],
            currencies: [row.currencies],
            systemUse: [row.systemUse],
            accountStatusId: [row.accountStatusId],
            branchSpecific: [row.branchSpecific],
            oldAccountId: [row.oldAccountId],
            fsCaptionId: [row.fsCaptionId],
            createdBy: [row.createdBy],
            isSubAccount: [row.isSubAccount],
            mainAccountId: [row.mainAccountId],
            glClassId: [row.glClassId]
        });

        this.selectedCurrencies = row.currencies;
        let tempData = this.selectedCurrencies;
        this.mappedCurrencies = [];
        tempData.forEach(el => { this.mappedCurrencies.push(el.currencyName); });

        this.disableCurrencies = false;
    }

    handleChange(e) {
        this.index = e.index;
    }

    showDialog() {
        this.panelHeader = 'New Chart of Account';
        this.initializeForm();
        this.displaySelectedCurrencies = false;
        this.display = true;
    }

    hideDialog() {
        this.selectedCurrencies = [];
        this.displaySelectedCurrencies = false;
        this.display = false;
    }

    hideCurrencyDialog() {
        this.displayCurrencies = false;
        let tempData = this.selectedCurrencies;
        this.mappedCurrencies = [];
        tempData.forEach(el => { this.mappedCurrencies.push(el.currencyName); });
        this.displaySelectedCurrencies = true;
    }

    removeCurrency(deletedCurr) {
        let curr = this.selectedCurrencies.find(x => x.currencyName === deletedCurr);
        let index = this.selectedCurrencies.indexOf(curr);
        this.selectedCurrencies.splice(index, 1);
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