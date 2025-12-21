import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    DropdownModule, CheckboxModule, SelectItem, TabViewModule, RadioButtonModule,
    SpinnerModule, ChipsModule
} from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';

import { ProductGroup } from '../../models/product-group';
import { ProductType } from '../../models/product-type';
import { ProductCategory } from '../../models/product-category';
import { ChartOfAccount } from '../../models/chartofaccount';
import { Company } from '../../models/company';
import { Currency } from '../../models/general-setup';
import { DealClassification } from '../../models/deal-classification';
import { ProductFeeEdit } from '../../models/productFeeEdit';
import { ProductClass } from '../../models/product-class';
import { LoanScheduleType } from '../../models/loan-schedule-type';

import { ProductCategoryService, ChargeService } from '../../services';
import { ProductGroupService } from '../../services';
import { CustomerType } from '../../../customer/models/customer';
import { CustomerService } from '../../../customer/services/customer.service';
import { ChartOfAccountService } from '../../services';
import { CompanyService } from '../../services';
import { ProductService } from '../../services';
import { CurrencyService } from '../../services';
import { DealClassificationService } from '../../services';
import { ProductFeeService } from '../../services';
import { CollateralService } from '../../services';
import { LoanService } from '../../services';

import { GlobalConfig } from '../../../shared/constant/app.constant';
import * as _ from 'lodash';
import swal from 'sweetalert2';

@Component({
    styleUrls: ['product-definition.style.scss'],
    templateUrl: 'product-definition.component.html'
})

export class ProductDefinitionComponent implements OnInit {
    crmsProductTypes: any[];
    riskRatings: any[];
    customerTypes: any[];
    selectedGroup: string; selectedType: string;
    productFormGroup: FormGroup;
    productGroups: any[]; productTypes: any[]; btnValue: any;

    activeIndex = 0; newProductId = 0; responseMessage: string;
    newProductCode: string; prodGrpRadBtnCannotClick = true; prodTypRadBtnCannotClick = true;
    displayPanel = false; btnDisabled = true; showGls: boolean; reqRateTenor: boolean;
    displayCurrencyModal = false; principalGlNotClicked = true; priceIndexRateValue = 0;
    spreadIndexValue = 0; productSpreadTotal = 0; displaySelectedCurrencies = false;

    productTypeData: any[]; productCompanyData: any[]; accountTypeData: any[];
    productCategoryData: any[]; productCurrencyData: any[];
    assetLiabilityLedgerData: ChartOfAccount[];
    assetPenalChargeLedgerData: ChartOfAccount[];

    incomeExpenseLedgerData: any[]; treasuryProductTypeData: any[]; dealClassficationData: any[]; dayCountData: any[];
    loanScheduleTypeData: any[];
    selectedCurrencyId = 0; selectedDealClassData: any; productClassData: any[];
    productPriceIndexData: any[]; productCurrencies: any[]; mappedCurrencies: string[];

    feedMapped: any[]; feesNotMapped: any[]; securityMapped: any[] = [];
    securityNotMapped: any[] = []; feeEdit: FormGroup; selectedFee: any = {};
    selectedFeeIndex: number; display = false; requireAmtValFields: boolean;
    reqLoanSchedule: boolean; selectedCurrencies: any;

    show = false; message: any; title: any; cssClass: any; // message box
    isFacilityLine:boolean = false;
    productBehaviorData: any = []; productBehaviourId = 0; requireGlObj: any;

    constructor(
        private router: Router, private loadingService: LoadingService, private fb: FormBuilder,
        private coaService: ChartOfAccountService, private custService: CustomerService,
        private pcatService: ProductCategoryService, private pgService: ProductGroupService,
        private companyService: CompanyService, private productService: ProductService,
        private currencyService: CurrencyService, private dealService: DealClassificationService,
        private productFeeSrv: ProductFeeService, private collateralService: CollateralService,
        private loanService: LoanService, private validationService: ValidationService,
        private chargeService: ChargeService
    ) {
        var feeStore: any = [];
    }

    ngOnInit() {
        this.loadingService.show();

        this.productFormGroup = this.fb.group({
            productTypeId: [''],
            customerTypeId: ['', Validators.required],
            productCategoryId: ['', Validators.required],
            productName: ['', Validators.required],
            productCode: ['', Validators.required],
            productDescription: ['', Validators.required],
            currencies: [''],
            principalBalanceGl: [''],
            principalBalanceGl2: [''],
            interestIncomeExpenseGl: [''],
            interestReceivablePayableGl: [''],
            dormantGl: [''],
            premiumDiscountGl: [''],
            overdrawnGl: [''],
            dealTypeId: [''],
            dealClassificationId: [''],
            dayCountId: ['', Validators.required],
            productClassId: ['', Validators.required],
            minimumTenor: ['0'],
            maximumTenor: ['0'],
            maximumRate: ['0'],
            minimumRate: ['0'],
            minimumBalance: [''],
            openingBalance: [''],
            collateralFcyLimit: [''],
            collateralLcyLimit: [''],
            customerLimit: [''],
            productLimit: [''],
            isInvoiceBased: [''],
            productBehaviour: [''],
            allowTenor: [true],
            allowRate: [true],
            allowOverdrawn: [false],
            scheduleTypeId: [''],
            productPriceIndexId: ['', Validators.required],
            productPriceIndexSpread: ['', Validators.required],
            allowCustomerAccountForceDebit: [false],
            allowMoratorium: [false],
            allowScheduleTypeOverride: [false],
            allowFundUsage: [false],
            isTemporaryOverDraft: [false],
            defaultGracePeriod: ['0',],
            cleanupPeriod: ['0',],
            equityContribution: [0,],
            expiryPeriod: ['0',],
            fees: [''],
            collaterals: [''],
            productBehaviourId: [''],
            crmsRegulatoryId:[''],
            riskRatingId:[''],
            penalChargeGl: [''],
            penalChargeRate: [''],
            usedByLos: [''],
            excludeFromLitigation: [''],
            isPaydayProduct: [''],

        });

        this.feeEdit = this.fb.group({
            feeName: [''],
            accountCategoryName: [''],
            feeIntervalName: [''],
            amortizationTypeName: [''],
            feeTargetName: [''],
            feeId: [''],
            productId: [''],
            productFeeId: [''],
            rateValue: ['0',],
            dependentAmount: ['0']
        });

        this.prodGroupList();
        this.productCompanyList(); this.productCategoryList();
        this.prodCurrencyList(); this.dealClassificationList();
        this.dayCountList(); this.loanScheduleList();
        this.productClassList(); this.prodPriceIndexList();
        this.getAllChartOfAccounts();
        this.getAllRegulatoryType();
        this.getAllRiskRatingType();

        // this.productBehaviourList();
        // this.getAllProductCurrencies();
        this.loadAllData();
        this.loadingService.hide();
    }

    getAllRegulatoryType() {
        this.productService.getCRMSTypes().subscribe((response: any) => {
            this.crmsProductTypes = response.result;
        });
      }
      getAllRiskRatingType() {
        this.productService.getRiskRatingTypes().subscribe((response: any) => {
            this.riskRatings = response.result;
        });
      }
    isSelectedGroup(name: string): boolean {
        return (this.selectedGroup === name);
    }

    isSelectedType(name: string): boolean {
        return (this.selectedType === name);
    }

    isOverdrawn(name: boolean): boolean {
        return (this.productFormGroup.controls['allowOverdrawn'].value === name);
    }

    requireGl(): boolean { // TO DISPLAY GL DROPDOWNS
        return this.showGls;
    }

    requireRateTenor(): boolean {
        return this.reqRateTenor;
    }

    requireLoanSchedule(): boolean {
        return this.reqLoanSchedule;
    }

    onProdGroupSelect(event) {
        this.productTypeBtns(event.id);
        ////console.log(event.id);
    }

    onProdTypeSelect(event) {
        ////console.log('event', event);
        this.selectedType = event.display;
        this.productFormGroup.controls['productTypeId'].patchValue(event.id);
        if(event.id == 101){
            this.isFacilityLine =true;
        }
        ////console.log('pTypeId', event.id);
        this.requireGlObj = event;
        this.showGls = (event.rPrinGl || event.rPrinGl2 || event.rInIncomeGl || event.rInReGl || event.rPrDisGl
            || event.rDorGl || event.rOvGl);

        this.reqRateTenor = (event.rTenor || event.rRate);
        this.reqLoanSchedule = event.rScheduleType;
        this.prodTypRadBtnCannotClick = false;
        this.selectedDealClassData = this.dealClassficationData.filter(x => x.value === event.dClassId);
        ////console.log('selectedDeal', this.selectedDealClassData);
        this.productFormGroup.controls['dealClassificationId'].patchValue(this.selectedDealClassData[0].value);
        let row = this.productPriceIndexData.find(x => x.productPriceIndexId === 1);
        this.productFormGroup.controls['productPriceIndexId'].patchValue(1);
        this.onPriceIndexSelect(1);
        if (event.rPrinGl || event.rPrinGl2) { // ENABLE VALIDATION ONLY WHEN PRINBALGL IS REQUIRED
            this.productFormGroup.controls['principalBalanceGl'].setValidators(Validators.required);
            this.principalGlNotClicked = true;
        } else {
            this.productFormGroup.controls['principalBalanceGl'].clearValidators();
            this.principalGlNotClicked = false;
        }


    }

    onDayCountSelect(dayCountId) {
        this.productFormGroup.controls['dayCountId'].patchValue(parseInt(dayCountId, 32));
        ////console.log('dayCountId', dayCountId);
    }

    onPriceIndexSelect(priceIndex) {
        ////console.log('price index', priceIndex);
        // tslint:disable-next-line:radix
        let row = this.productPriceIndexData.find(x => x.productPriceIndexId === parseInt(priceIndex));
        ////console.log('price inde', row);
        row != null ? this.priceIndexRateValue = row.priceIndexRate : this.priceIndexRateValue = 0;
        this.productSpreadTotal = this.priceIndexRateValue + this.spreadIndexValue;
    }

    onProductSpreadSelect(spreadIndex) {
        // let row = this.productPriceIndexData[parseInt(priceIndex)];
        // tslint:disable-next-line:radix
        this.spreadIndexValue = parseInt(spreadIndex);
        this.productSpreadTotal = this.priceIndexRateValue + this.spreadIndexValue;
    }

    prodGroupList(): void {
        let prodGroups: ProductGroup[];
        this.productGroups = [];
        this.pgService.getProductGroups().subscribe((data) => {
            prodGroups = data.result;
            prodGroups.forEach(element => {
                this.productGroups.push({
                    value: element.productGroupCode, display: element.productGroupName,
                    id: element.productGroupId
                });
            });
            this.loadingService.hide();
            if (!this.productGroups.length) {
                this.btnDisabled = true;
            } else {
                this.btnDisabled = false;
            }
        });
    }

    productTypeBtns(pGroupId: number): void {
        // this.loadingService.show();
        let prodTypes: ProductType[];
        this.productTypes = [];
        this.pgService.getProductTypeByGroupId(pGroupId).subscribe((data) => {
            prodTypes = data.result;
            prodTypes.forEach(element => {
                this.productTypes.push({
                    value: element.productTypeId, display: element.productTypeName, id: element.productTypeId,
                    rPrinGl: element.requirePrincipalGl, rPrinGl2: element.requirePrincipalGl2, rInIncomeGl: element.requireInterestIncomeExpenseGl,
                    rInReGl: element.requireInterestReceivablePayableGl, rPrDisGl: element.requirePremiumDiscountGl,
                    rDorGl: element.requireDormantGl, rOvGl: element.requireOverdrawnGL,
                    dClassId: element.dealClassificationId, rTenor: element.requireTenor, rRate: element.requireRate,
                    rScheduleType: element.requireScheduleType
                });
            });
            ////console.log('prodTypeLength', this.productTypes.length);
            if (!this.productTypes.length) {
                this.prodGrpRadBtnCannotClick = true;
            } else {
                this.prodGrpRadBtnCannotClick = false;
            }
            // this.loadingService.hide(4000);
        });
    }

    productCompanyList(): void {
        let prodCompanies: Company[];
        this.productCompanyData = [];
        this.companyService.getAllCompanies().subscribe((data) => {
            prodCompanies = data.result;
            prodCompanies.forEach(element => {
                this.productCompanyData.push({ label: element.companyName, value: element.companyId });
            });
        });
    }

    productCategoryList(): void {
        let pAccCategories: ProductCategory[];
        this.productCategoryData = [];
        this.pcatService.getAllCategories().subscribe((data) => {
            pAccCategories = data.result;
            pAccCategories.forEach(element => {
                this.productCategoryData.push(
                    { label: element.productCategoryName, value: element.productCategoryId }
                );
            });
        });
    }

    productClassList(): void {
        this.productClassData = [];
        this.productService.getAllProductClasses().subscribe((data) => {
            this.productClassData = data.result;
        });
    }

    dayCountList() {
        this.dayCountData = [];
        this.productService.getAllDayCount().subscribe((data) => {
            this.dayCountData = data.result;
        }, (err) => {
            ////console.log('error', err);
        });
    }

    onProdCategorySelect(prodCatId) {
        // prodCatId = parseInt(prodCatId);
        // let usedCategoryId = 0;
        // if (prodCatId === 1) { // asset
        //     this.populateAllAssetLiabilityLedgers(prodCatId);
        //     usedCategoryId = 4; // income
        //     this.populateAllIncomeExpenseLedgers(usedCategoryId);
        // } else if (prodCatId === 2) {// liability
        //     this.populateAllAssetLiabilityLedgers(prodCatId);
        //     usedCategoryId = 5;  // expense
        //     this.populateAllIncomeExpenseLedgers(usedCategoryId);
        // }
        ////console.log('product category id', prodCatId);
    }

    // populateAllAssetLiabilityLedgers(catId: number): void {
    //     this.assetLiabilityLedgerData = [];
    //     this.coaService.getAccountsByCategory(catId).subscribe((data) => {
    //         this.assetLiabilityLedgerData = data.result;
    //         ////console.log('account data', data.result);
    //     }, (err) => {
    //         ////console.log('server error', err);
    //     });
    // }

    //getAllChartOfAccounts
    // populateAllIncomeExpenseLedgers(catId: number): void {
    //     this.incomeExpenseLedgerData = [];
    //     this.coaService.getAccountsByCategory(catId).subscribe((data) => {
    //         this.incomeExpenseLedgerData = data.result;
    //         ////console.log('account data', data.result);
    //     }, (err) => {
    //         ////console.log('server error', err);
    //     });
    // }

    getAllChartOfAccounts(): void {
        this.assetLiabilityLedgerData = [];
        this.coaService.getAllChartOfAccounts().subscribe((data) => {
            this.incomeExpenseLedgerData = this.assetLiabilityLedgerData = data.result;
            this.assetPenalChargeLedgerData = data.result;
            ////console.log('account data', data.result);
        }, (err) => {
            ////console.log('server error', err);
        });
    }

    populateAllAssetLiabilityLedgers(catId: number): void {
        this.assetLiabilityLedgerData = [];
        this.coaService.getAllChartOfAccounts().subscribe((data) => {
            this.assetLiabilityLedgerData = data.result;
            ////console.log('account data', data.result);
        }, (err) => {
            ////console.log('server error', err);
        });
    }
    populateAllIncomeExpenseLedgers(catId: number): void {
        this.incomeExpenseLedgerData = [];
        this.coaService.getAllChartOfAccounts().subscribe((data) => {
            this.incomeExpenseLedgerData = data.result;
            ////console.log('account data', data.result);
        }, (err) => {
            ////console.log('server error', err);
        });
    }

    onPrincipalGLSelect(glAccountId) {
        // tslint:disable-next-line:radix
        let row = parseInt(glAccountId);
        let data = this.assetLiabilityLedgerData.find(x => x.accountId === row);
        this.productCurrencies = data.currencies;
        this.selectedCurrencies = this.productCurrencies;
        
        if(this.productCurrencies.length < 1){
        this.getProductCurrencies();
        }
        
        this.displayCurrencyModal = true;
        this.principalGlNotClicked = false;
        this.mappedCurrencies = [];
        
    }

    hideCurrencyModal() {
        let tempData = this.selectedCurrencies;
        this.mappedCurrencies = [];
        tempData.forEach(el => { this.mappedCurrencies.push(el.currencyName); });
        this.displayCurrencyModal = false;
        this.displaySelectedCurrencies = true;
    }

    removeCurrency(deletedCurrency) {
        let curr = this.selectedCurrencies.find(x => x.currencyName === deletedCurrency);
        const index = this.selectedCurrencies.indexOf(curr);
        this.selectedCurrencies.splice(index, 1);
    }

    prodCurrencyList(): void {
        let prodCurrency: Currency[];
        this.productCurrencyData = [];
        this.currencyService.getAllCurrencies().subscribe((data) => {
            prodCurrency = data.result;
            prodCurrency.forEach(element => {
                this.productCurrencyData.push({ label: element.lookupName, value: element.lookupId });
            });
        });
    }

    getAllProductCurrencies(glAccountId): void {
        let currencies: Currency[];
        this.currencyService.getAllCurrencies().subscribe((data) => {
            this.productCurrencies = [];
            currencies = data.result;
            currencies.forEach(element => {
                this.productCurrencies.push({ currencyId: element.lookupId, currencyName: element.lookupName });
            });
            this.productCurrencies = this.productCurrencies.filter(x => x.lookupId === glAccountId);
        });
    }

    getProductCurrencies(): void {
        let currencies: Currency[];
        this.currencyService.getAllCurrencies().subscribe((data) => {
            this.productCurrencies = [];
            currencies = data.result;
            currencies.forEach(element => {
                this.productCurrencies.push({ currencyId: element.lookupId, currencyName: element.lookupName });
            });
            this.productCurrencies = this.productCurrencies;
           // this.selectedCurrencies = this.productCurrencies;
        });
    }

    onCurrencyChange(id): void {
        // this.assetLiabilityLedgerData = _.filter(this.filteredData, ['currencyId', parseInt(id, 32)]);
        ////console.log(this.assetLiabilityLedgerData);
    }

    dealClassificationList(): void {
        let dealClass: DealClassification[];
        this.dealClassficationData = [];
        this.dealService.getAllDealClassifications().subscribe((data) => {
            dealClass = data.result;
            dealClass.forEach(element => {
                this.dealClassficationData.push({ label: element.lookupName, value: element.lookupId });
            });
            ////console.log('dealClassData', this.dealClassficationData);
        });
    }

    loanScheduleList(): void {
        let loanSchedule: LoanScheduleType[];
        this.loanScheduleTypeData = [];
        this.loanService.getAllLoanScheduleType().subscribe((data) => {
            loanSchedule = data.result;
            loanSchedule.forEach(element => {
                this.loanScheduleTypeData.push({
                    label: element.lookupName + ' - ' + element.lookupTypeName, value: element.lookupId
                });
            });
        });
    }

    prodPriceIndexList() {
        this.productPriceIndexData = [];
        this.productService.getProductPriceIndex().subscribe((data) => {
            this.productPriceIndexData = data.result;
        });
    }

    // productBehaviourList() {
    //     this.productBehaviorData = [];
    //     this.productService.getProductBehaviorTypes().subscribe((data) => {
    //         this.productBehaviorData = data.result;
    //     });
    // }


    /**
     * Mapping to ProductFee and Product Collateral
     */

    mapToFeeAndCollateral() {
        this.loadingService.show();
        this.router.navigate(['/setup/product/product/feeSecurity', this.newProductId]);
    }

    loadAllData() {
        this.loadingService.show();
        this.getUnMappedCollateral();
        // this.getMappedCollateral(this.newProductId);
        this.getUnmappedFees();
        // this.getMappedFees(this.newProductId);

        this.custService.getAllCustomerTypesWithHybrid().subscribe((response: any) => {
            this.customerTypes = response.result;
        });
    }

    requireAmount(obj) {
        this.requireAmtValFields = obj.byAmountRequired;
    }

    getUnmappedFees() {
        this.productFeeSrv.getAllFees()
            .subscribe((response: any) => {
                this.feesNotMapped = response.result;
            }, (err) => {
                ////console.log('get fee error', err);
                this.loadingService.hide();
            });
    }

    getMappedFees(productId) {
        this.productFeeSrv.getAllMappedFeesByProduct(productId)
            .subscribe((response: any) => {
                this.feedMapped = response.result;
                this.loadingService.hide();
            }, (err) => {
                ////console.log('get mapped product fee error', err);
                this.loadingService.hide();
            });
    }

    getUnMappedCollateral() {
        this.collateralService.getCollateralTypes()
            .subscribe((response: any) => {
                this.securityNotMapped = response.result;
            }, (err) => {
                ////console.log('get unmapped collateral error', err);
            });
    }

    getMappedCollateral(productId) {
        this.collateralService.getAllMappedCollateralToProduct(productId)
            .subscribe((response: any) => {
                this.securityMapped = response.result;
                this.loadingService.hide();
            }, (err) => {
                ////console.log('get mapped product collateral error', err);
                this.loadingService.hide();
            });
    }

    removeSecurity(index, evt) {
        evt.preventDefault();
        this.loadingService.show();
        const SelectedSecurity = this.securityMapped[index];
        const selectedId = SelectedSecurity.productCollateralId;
        this.securityNotMapped.push(SelectedSecurity);
        this.securityMapped.splice(index, 1);
        this.loadingService.hide();
    }

    mapSecurity(index, evt) {

        evt.preventDefault();
        this.loadingService.show();
        const currSecurity = this.securityNotMapped[index];
        const postBody = {
            'collateralTypeId': currSecurity.collateralTypeId,
            'companyId': 0,
            'productId': 0
        };

        if (this.securityMapped === undefined) {
            this.securityMapped = [];
        }
        this.securityMapped.push(currSecurity);
        this.securityNotMapped.splice(index, 1);
        ////console.log('mapped security', this.securityMapped);

        this.loadingService.hide();
    }

    mapMultipleSecurity(evt) {
        evt.preventDefault();
        //this.loadingService.show();

        let bodyObj = {};

        if (this.securityMapped === undefined) {
            this.securityMapped = [];
        }

        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
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
            __this.securityNotMapped.forEach(el => {
                bodyObj = {
                    'applicationUrl': null,
                    'collateralTypeId': el.collateralTypeId,
                    'collateralTypeName': el.collateralTypeName,
                    'productCollateralId': el.productCollateralId,
                    'productId': el.productId,
                };
                __this.securityMapped.push(bodyObj);
            });
            __this.securityNotMapped = [];
            __this.loadingService.hide();

            ////console.log('mapped security', this.securityMapped);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    mapFee(index, evt) {
        evt.preventDefault();
        this.selectedFeeIndex = index;
        this.selectedFee = this.feesNotMapped[index];
        this.requireAmount(this.selectedFee);
        this.feeEdit = this.fb.group({
            feeId: [this.selectedFee.chargeFeeId],
            productId: [0],
            feeName: [this.selectedFee.chargeName],
            feeIntervalName: [this.selectedFee.frequencyTypeName],
            amortizationTypeName: [this.selectedFee.amortizationTypeName],
            feeTargetName: [this.selectedFee.targetName],
            rateValue: [0],
            dependentAmount: [0],
            accountCategoryName: [this.selectedFee.accountCategoryName],
        });
        ////console.log('fee before submission', this.feeEdit.value);
        this.display = true;
    }

    onFormSubmitted({ value, valid }: { value: ProductFeeEdit, valid: boolean }) {
        this.loadingService.show();
        if (this.feedMapped === undefined) {
            this.feedMapped = [];
        }
        this.feedMapped.push(value);
        ////console.log('fee submitted', value);
        this.feesNotMapped.splice(this.selectedFeeIndex, 1);
        // this.getMappedFees(this.newProductId);
        ////console.log('mapped fees', this.feedMapped);
        this.loadingService.hide();
        this.display = false;
    }

    removeFee(idx, evt) {
        evt.preventDefault();
        this.loadingService.show();
        const targetFee = this.feedMapped[idx];
        const pFeeId = targetFee.feeId;
        const position = this.selectedFeeIndex;
        const postObj = {
            chargeFeeId: targetFee.feeId,
            chargeName: targetFee.feeName,
            frequencyTypeName: targetFee.feeIntervalName,
            amortizationTypeName: targetFee.amortizationTypeName,
            targetName: targetFee.feeTargetName,
            rateValue: targetFee.rateValue,
            dependentAmount: targetFee.dependentAmount,
            accountCategoryName: targetFee.accountCategoryName
        };
        ////console.log('fee placed back', postObj);
        this.feedMapped.splice(idx, 1);
        this.feesNotMapped.splice(position, 0, postObj);
        this.loadingService.hide();

    }

    submitProductForm() {
        this.loadingService.show();
        this.productFormGroup.controls['currencies'].setValue(this.selectedCurrencies);
        this.productFormGroup.controls['fees'].setValue(this.feedMapped);
        this.productFormGroup.controls['collaterals'].setValue(this.securityMapped);
        let productBehaviour = {
            collateralFcyLimit: this.productFormGroup.value.collateralFcyLimit,
            collateralLcyLimit: this.productFormGroup.value.collateralLcyLimit,
            customerLimit: this.productFormGroup.value.customerLimit,
            productLimit: this.productFormGroup.value.productLimit,
            isInvoiceBased: this.productFormGroup.value.isInvoiceBased,
            allowFundUsage: this.productFormGroup.value.allowFundUsage,
            isTemporaryOverDraft: this.productFormGroup.value.isTemporaryOverDraft,
            crmsRegulatoryId: this.productFormGroup.value.crmsRegulatoryId,
           // riskRatingId: this.productFormGroup.value.riskRatingId,

        }
        this.productFormGroup.controls['productBehaviour'].setValue(productBehaviour)
        const prodObj = this.productFormGroup.value;
        prodObj.isFacilityLine = this.isFacilityLine;
        let dataObj: any;

        this.productService.addProduct(prodObj).subscribe((data) => {
            dataObj = data.result;
            this.loadingService.hide();
            if (data.success === false) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, data.message, 'error');
            } else {
                this.responseMessage = `${data.message} - (${dataObj.productCode})`;
                swal(`${GlobalConfig.APPLICATION_NAME}`, this.responseMessage, 'success');
                this.router.navigate(['/setup/load-product-definition']);
            }
        }, error => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(error), 'error');
        });
    }


    next() {
        const el1: HTMLElement = <HTMLElement>document.getElementById('panel' + this.activeIndex.toString());
        el1.hidden = true;

        this.activeIndex = this.activeIndex + 1;

        const el2: HTMLElement = <HTMLElement>document.getElementById('panel' + this.activeIndex.toString());
        el2.hidden = false;

    }

    previous() {
        const el1: HTMLElement = <HTMLElement>document.getElementById('panel' + this.activeIndex.toString());
        el1.hidden = true;

        this.activeIndex = this.activeIndex - 1;

        const el2: HTMLElement = <HTMLElement>document.getElementById('panel' + this.activeIndex.toString());
        el2.hidden = false;
    }

    get diagnostic() {
        return JSON.stringify(this.productFormGroup.value);
    }

    finishBad(message) {
        this.showMessage(message, 'error', 'FintrakBanking');
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
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

    displayIsPaydayProduct: boolean = false;
    getSelectedProductClass(productClass) {
        if(productClass == 3){
          this.displayIsPaydayProduct = true;
        }else{this.displayIsPaydayProduct = false;}
    }
}
