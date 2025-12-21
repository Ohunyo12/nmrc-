import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProductFeeEdit } from '../../models/productFeeEdit';
import { ProductFeeService } from '../../services';
import { CollateralService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { ProductService } from '../../services';
import { ProductCategoryService } from '../../services';
import { ProductTypeService } from '../../services';
import swal from 'sweetalert2';
import { ChartOfAccount } from '../../models/chartofaccount';
import { ChartOfAccountService } from '../../services';
import { CustomerService } from '../../../customer/services/customer.service';
import { ProductGroupService } from '../../services';
import { CompanyService } from '../../services';
import { CurrencyService } from '../../services';
import { DealClassificationService } from '../../services';
import { LoanService } from '../../services';
import { Currency } from '../../models/general-setup';
import { DealClassification } from '../../models/deal-classification';
import { LoanScheduleType } from '../../models/loan-schedule-type';
import * as _ from 'lodash';
import { ProductType } from '../../models/product-type';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'product.edit.component.html',
    styles: [
        `#details-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: auto;
        }
        #ledgerItems {
            margin-left: -15px !important;
            margin-right: -15px !important;
            width: auto;
        }
        .input-group-addon {
            font-size: 12px;
        }
        `
    ]
})

export class ProductEditComponent implements OnInit {
    riskRatings: any[];
    assetPenalChargeLedgerData: ChartOfAccount[];

    show: boolean = false;
    display: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    productTypes: any[] ;
    productCategories: any[];
    products: any[];
    productName: string;
    productTypeId: any = '';
    categoryId: any = '';
    productId: any;
    selectedProduct: any = {};
    feedMapped: any[];
    feesNotMapped: any[];
    securityMapped: any[] = [];
    securityNotMapped: any[] = [];
    feeEdit: FormGroup;
    selectedFee: any = {};
    selectedFeeIndex: number;
    prodCatNotSelected = true;
    requireAmtValFields: boolean;
    productLoaded: boolean = false;
    crmsProductTypes: any[];
    displayList: boolean = true;
    displayIsPaydayProduct: boolean = false;
    selectedGroup: string; selectedType: string;

    productFormGroup: FormGroup;

    productGroups: any[]; btnValue: any;

    activeIndex = 0; newProductId = 0; responseMessage: string;
    newProductCode: string; prodGrpRadBtnCannotClick = true; prodTypRadBtnCannotClick = true;
    displayPanel = false; btnDisabled = true; showGls: boolean; reqRateTenor: boolean;
    displayCurrencyModal = false; principalGlNotClicked = true; priceIndexRateValue = 0;
    spreadIndexValue = 0; productSpreadTotal = 0; displaySelectedCurrencies = false;

    productTypeData: any[]; productCompanyData: any[]; accountTypeData: any[];
    productCategoryData: any[]; productCurrencyData: any[]; assetLiabilityLedgerData: ChartOfAccount[];
    incomeExpenseLedgerData: any[]; treasuryProductTypeData: any[]; dealClassficationData: any[]; dayCountData: any[];
    loanScheduleTypeData: any[];
    selectedCurrencyId = 0; selectedDealClassData: any; productClassData: any[];
    productPriceIndexData: any[]; productCurrencies: any[]; mappedCurrencies: string[];

    reqLoanSchedule: boolean; selectedCurrencies: any; editProductDetails = false;
    productBehaviorData: any = []; requireGlObj: any;

    constructor(private productTypeSrv: ProductTypeService, private productCatSrv: ProductCategoryService,
        private productService: ProductService, private loadingService: LoadingService,
        private collateralService: CollateralService, private productFeeSrv: ProductFeeService,
        private fb: FormBuilder, private coaService: ChartOfAccountService, private custService: CustomerService,
        private pcatService: ProductCategoryService, private pgService: ProductGroupService,
        private companyService: CompanyService, private currencyService: CurrencyService,
        private dealService: DealClassificationService, private loanService: LoanService

    ) { }

    ngOnInit() {
        this.loadingService.show();

        this.getProductTypes();
        this.getProductCategories();
        this.initializeFeeForm();
        this.initializeProductForm();
        this.getAllRiskRatingType();

        this.prodCurrenyList(); this.dealClassificationList();
        this.dayCountList(); this.loanScheduleList();
        this.productClassList(); this.prodPriceIndexList(); this.productBehaviourList();
        this.  getAllRegulatoryType();
    }

    initializeProductForm() {
        this.productFormGroup = this.fb.group({
            productId: [''],
            productCode: [''],
            productTypeId: [''],
            productCategoryId: ['', Validators.required],
            productName: ['', Validators.required],
            productDescription: ['', Validators.required],
            currencies: [''],
            principalBalanceGl: ['', Validators.required],
            principalBalanceGl2: [''],
            interestIncomeExpenseGl: [''],
            interestReceivablePayableGl: [''],
            dormantGl: [''],
            premiumDiscountGl: [''],
            overdrawnGl: [''],
            dealTypeId: [''],
            dealClassificationId: [''],
            dayCountId: ['', Validators.required],
            productClassId: [''],
            minimumTenor: [''],
            maximumTenor: [''],
            maximumRate: [''],
            minimumRate: [''],
            minimumBalance: [''],
            openingBalance: ['0'],
            collateralFcyLimit: [''],
            collateralLcyLimit: [''],
            customerLimit: [''],
            productLimit: [''],
            invoiceLimit: [''],
            isInvoiceBased: [''], 
            allowFundUsage: [''], 
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
            defaultGracePeriod: [''],
            cleanupPeriod: [''],
            equityContribution: [''],
            expiryPeriod: [''],
            fees: [''],
            collaterals: [''],
            productBehaviourId: [''],
            isTemporaryOverDraft: [false],
            crmsRegulatoryId:[''],
            riskRatingId:[''],
            penalChargeGl: [''],
            penalChargeRate: [''],
            usedByLos: [''],
            excludeFromLitigation: [false],
        });
    }

    initializeFeeForm() {
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
    }
    getAllRiskRatingType() {
        this.productService.getRiskRatingTypes().subscribe((response: any) => {
            this.riskRatings = response.result;
        });
      }
    getProductTypes() {
        let prodTypes: ProductType[];
        this.productTypes = [];
        this.productTypeSrv.get().subscribe((response: any) => {
            // this.productTypes = response.result;
            prodTypes = response.result;
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
        }, (err) => {
            ////console.log('product type error', err);
        });
        ////console.log(' this.productTypes',  this.productTypes);
    }
    getAllRegulatoryType() {
        this.productService.getCRMSTypes().subscribe((response: any) => {
            this.crmsProductTypes = response.result;
        });
      }
    getProductCategories() {
        this.productCatSrv.getAllCategories().subscribe((response: any) => {
            this.productCategories = response.result;
        }, (err) => {
            ////console.log('product cat error', err);
        });
    }

    getProductByTypeAndCat(typeId, catId) {
        this.loadingService.show();
        this.productLoaded = false;
        this.productService.getProductByTypeAndCategory(typeId, catId).subscribe((response: any) => {
            this.loadingService.hide();
            this.products = response.result;
            //console.log('this.products',this.products)
            if (this.products != null) {
                this.productLoaded = true;
            } else { }////console.log('get product got empty record')
        }, (err) => {
            this.loadingService.hide();
            ////console.log('get product error', err);
        });
    }

    onProdTypeChanged(target) {
        if (this.categoryId !== '') {
            this.getProductByTypeAndCat(this.productTypeId, this.categoryId);
        }
        ////console.log('prod type', target);
        // tslint:disable-next-line:radix
        let targetType = this.productTypes.find(x => x.id === parseInt(target));
        this.onProdTypeSelect(targetType);
    }

    onCategoryChanged(categoryId) {
        if (this.productTypeId !== '') {
            this.getProductByTypeAndCat(this.productTypeId, this.categoryId);
            this.productName = this.categoryId.productCategoryName;
        }

        this.prodCatNotSelected = false;
        this.onProdCategorySelect(categoryId);
    }

    onProductChanged() {
        this.productId = this.selectedProduct.productId;
        this.productName = this.selectedProduct.productName;
        let targetProduct = this.selectedProduct;
        this.selectedCurrencies = targetProduct.currencies;
        this.onProductSelect(targetProduct);

        this.getUnMappedColateral(this.productId);
        this.getMappedCollateral(this.productId);
        this.getUnmappedFees(this.productId);
        this.getMappedFees(this.productId);

        this.editProductDetails = true;
    }

    getUnmappedFees(productId) {
        this.productFeeSrv.getUmappedFees(productId).subscribe((response: any) => {
            this.feesNotMapped = response.result;
        }, (err) => {
            ////console.log('get unmapped fee error', err);
        });
    }

    getMappedFees(productId) {
        this.productFeeSrv.getAllMappedFeesByProduct(productId).subscribe((response: any) => {
            this.feedMapped = response.result;
            this.loadingService.hide();
        }, (err) => {
            ////console.log('get mapped fee error', err);
        });
    }

    getUnMappedColateral(productId) {
        this.loadingService.show();
        this.collateralService.getUnmappedCollateralToProduct(productId)
            .subscribe((response: any) => {
                this.securityNotMapped = response.result;
            }, (err) => {
                ////console.log('get unmapped coll error', err);
            });
    }

    requireAmount(obj) {
        this.requireAmtValFields = obj.byAmountRequired;
    }

    getMappedCollateral(productId) {
        this.collateralService.getMappedCollateralToProduct(productId)
            .subscribe((response: any) => {
                this.securityMapped = response.result;
            }, (err) => {
                ////console.log('get mapped coll error', err);
            });
    }

    removeSecurity(index, evt) {
        evt.preventDefault();
        this.loadingService.show();
        let SelectedSecurity = this.securityMapped[index];
        let selectedId = SelectedSecurity.productCollateralId;
        this.securityNotMapped.push(SelectedSecurity);
        this.securityMapped.splice(index, 1);
        this.loadingService.hide();
        // this.collateralService.removeColateralFromProduct(selectedId)
        //     .subscribe((response: any) => {
        //         this.loadingService.hide();
        //         if (response.success === true) {

        //             this.securityNotMapped.push(SelectedSecurity);
        //             this.securityMapped.splice(index, 1);

        //         } else {
        //             this.showMessage(response.message, 'error', 'FintrakBanking');
        //         }

        //     }, (err) => {
        //         this.loadingService.hide();
        //         this.showMessage('An unknown error has occured, please contact your administrator', 'error', 'FintrakBanking');
        //     });
    }

    mapSecurity(index, evt) {

        evt.preventDefault();
        this.loadingService.show();
        let currSecurity = this.securityNotMapped[index];
        // let postBody = {
        //     'collateralTypeId': currSecurity.collateralTypeId,
        //     'companyId': 0,
        //     'productId': 0
        // };

        if (this.securityMapped === undefined) {
            this.securityMapped = [];
        }
        this.securityMapped.push(currSecurity);
        this.securityNotMapped.splice(index, 1);
        ////console.log('mapped security', this.securityMapped);

        this.loadingService.hide();
        // this.collateralService.mapColateralToProduct(postBody)
        //     .subscribe((response: any) => {
        //         if (response.success === true) {
        //             if (this.securityMapped === undefined) {
        //                 this.securityMapped = [];
        //             }
        //             this.securityMapped.push(currSecurity);
        //             this.securityNotMapped.splice(index, 1);
        //             this.loadingService.hide();
        //         } else {
        //             this.loadingService.hide();
        //             this.showMessage(response.message, 'error', 'FintrakBanking');
        //         }
        //     }, (err) => {
        //         this.loadingService.hide();
        //     });
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

        // this.securityNotMapped.forEach(el => {
        //     bodyObj = {
        //         'applicationUrl': null,
        //         'collateralTypeId': el.collateralTypeId,
        //         'collateralTypeName': el.collateralTypeName,
        //         'productCollateralId': el.productCollateralId,
        //         'productId': el.productId,
        //     };
        //     this.securityMapped.push(bodyObj);
        // });

        // this.securityNotMapped = [];

        // //console.log('mapped security', this.securityMapped);

        // this.loadingService.hide();

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
        // this.productFeeSrv.mapFeeToProduct(value)
        //     .subscribe((response: any) => {
        //         this.loadingService.hide();
        //         if (response.success === true) {
        //             this.feesNotMapped.splice(this.selectedFeeIndex, 1);
        //             this.getMappedFees(this.newProductId);
        //             this.display = false;
        //         } else {
        //             this.showMessage(response.message, 'error', 'FintrakBanking');
        //         }

        //     }, (err) => {
        //         this.loadingService.hide();
        //     });
    }

    removeFee(idx, evt) {
        evt.preventDefault();
        this.loadingService.show();
        let targetFee = this.feedMapped[idx];
        let pFeeId = targetFee.feeId;
        let position = this.selectedFeeIndex;
        let postObj = {
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

        // this.productFeeSrv.removeFeeFromProduct(pFeeId)
        //     .subscribe((response: any) => {
        //         this.loadingService.hide();
        //         if (response.success === true) {
        //             this.feedMapped.splice(idx, 1);
        //         } else {
        //             this.showMessage(response.message, 'error', 'FintrakBanking');
        //         }
        //     }, (err) => {
        //         this.loadingService.hide();
        //         this.showMessage('There was an unknown eror please contact your administrator', 'error', 'FintrakBanking');
        //     });


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

    isSelectedGroup(name: string): boolean {
        return (this.selectedGroup === name);
    }

    isSelectedType(name: string): boolean {
        return (this.selectedType === name);
    }

    requireGl(): boolean {
        return this.showGls;
    }

    requireRateTenor(): boolean {
        return this.reqRateTenor;
    }

    requireLoanSchedule(): boolean {
        return this.reqLoanSchedule;
    }

    onProductSelect(targetProduct) {
        this.productFormGroup.controls['productId'].setValue(this.productId);
        this.productFormGroup.controls['productCode'].setValue(targetProduct.productCode);
        this.productFormGroup.controls['productCategoryId'].setValue(targetProduct.productCategoryId);
        this.productFormGroup.controls['productName'].setValue(targetProduct.productName);
        this.productFormGroup.controls['productDescription'].setValue(targetProduct.productDescription);
        this.productFormGroup.controls['currencies'].setValue(targetProduct.currencies);
        this.productFormGroup.controls['principalBalanceGl'].setValue(targetProduct.principalBalanceGl);
        this.productFormGroup.controls['principalBalanceGl2'].setValue(targetProduct.principalBalanceGl2);
        this.productFormGroup.controls['interestIncomeExpenseGl'].setValue(targetProduct.interestIncomeExpenseGl);
        this.productFormGroup.controls['interestReceivablePayableGl'].setValue(targetProduct.interestReceivablePayableGl);
        this.productFormGroup.controls['dormantGl'].setValue(targetProduct.dormantGl);
        this.productFormGroup.controls['premiumDiscountGl'].setValue(targetProduct.premiumDiscountGl);
        this.productFormGroup.controls['penalChargeGl'].setValue(targetProduct.penalChargeGl);
        this.productFormGroup.controls['penalChargeRate'].setValue(targetProduct.penalChargeRate);
        this.productFormGroup.controls['usedByLos'].setValue(targetProduct.usedByLos);

        this.productFormGroup.controls['overdrawnGl'].setValue(targetProduct.overdrawnGl);
        this.productFormGroup.controls['dealTypeId'].setValue(targetProduct.dealTypeId);
        this.productFormGroup.controls['dayCountId'].setValue(targetProduct.dayCountId);
        this.productFormGroup.controls['productClassId'].setValue(targetProduct.productClassId);
        this.productFormGroup.controls['minimumTenor'].setValue(targetProduct.minimumTenor);
        this.productFormGroup.controls['maximumTenor'].setValue(targetProduct.maximumTenor);
        this.productFormGroup.controls['maximumRate'].setValue(targetProduct.maximumRate);
        this.productFormGroup.controls['minimumRate'].setValue(targetProduct.minimumRate);
        this.productFormGroup.controls['minimumBalance'].setValue(targetProduct.minimumBalance);
        this.productFormGroup.controls['openingBalance'].setValue(targetProduct.openingBalance);
        this.productFormGroup.controls['allowTenor'].setValue(targetProduct.allowTenor);
        this.productFormGroup.controls['allowRate'].setValue(targetProduct.allowRate);
        this.productFormGroup.controls['allowOverdrawn'].setValue(targetProduct.allowOverdrawn);
        this.productFormGroup.controls['scheduleTypeId'].setValue(targetProduct.scheduleTypeId);
        this.productFormGroup.controls['productPriceIndexId'].setValue(targetProduct.productPriceIndexId);
        this.productFormGroup.controls['productPriceIndexSpread'].setValue(targetProduct.productPriceIndexSpread);
        this.productFormGroup.controls['allowCustomerAccountForceDebit'].setValue(targetProduct.allowCustomerAccountForceDebit);
        this.productFormGroup.controls['allowMoratorium'].setValue(targetProduct.allowMoratorium);
        this.productFormGroup.controls['allowScheduleTypeOverride'].setValue(targetProduct.allowScheduleTypeOverride);
        this.productFormGroup.controls['defaultGracePeriod'].setValue(targetProduct.defaultGracePeriod);
        this.productFormGroup.controls['cleanupPeriod'].setValue(targetProduct.cleanupPeriod);
        this.productFormGroup.controls['equityContribution'].setValue(targetProduct.equityContribution);
        this.productFormGroup.controls['expiryPeriod'].setValue(targetProduct.expiryPeriod);
        this.productFormGroup.controls['productBehaviourId'].setValue(targetProduct.productBehaviourId);
        this.productFormGroup.controls['excludeFromLitigation'].setValue(targetProduct.excludeFromLitigation);
        //this.productFormGroup.controls['customerLimit'].setValue(targetProduct.productBehaviour.customerLimit);
        // this.productFormGroup.controls['collateralLcyLimit'].setValue(targetProduct.productBehaviour.collateralLcyLimit);
        // this.productFormGroup.controls['collateralFcyLimit'].setValue(targetProduct.productBehaviour.collateralFcyLimit);
        // this.productFormGroup.controls['productLimit'].setValue(targetProduct.productBehaviour.productLimit);
        //this.productFormGroup.controls['isInvoiceBased'].setValue(targetProduct.productBehaviour.isInvoiceBased);
        // this.productFormGroup.controls['allowFundUsage'].setValue(targetProduct.productBehaviour.allowFundUsage);
        // this.productFormGroup.controls['isTemporaryOverDraft'].setValue(targetProduct.productBehaviour.isTemporaryOverDraft);
        // this.productFormGroup.controls['crmsRegulatoryId'].setValue(targetProduct.productBehaviour.crmsRegulatoryId);
////console.log("crmsRegulatoryId", targetProduct);
        if(targetProduct.productBehaviour !=null){
         this.productFormGroup.controls['collateralFcyLimit'].setValue(targetProduct.productBehaviour.collateralFcyLimit);
        this.productFormGroup.controls['collateralLcyLimit'].setValue(targetProduct.productBehaviour.collateralLcyLimit);
         this.productFormGroup.controls['customerLimit'].setValue(targetProduct.productBehaviour.customerLimit);
        this.productFormGroup.controls['productLimit'].setValue(targetProduct.productBehaviour.productLimit);
        this.productFormGroup.controls['invoiceLimit'].setValue(targetProduct.productBehaviour.invoiceLimit);
        this.productFormGroup.controls['isInvoiceBased'].setValue(targetProduct.productBehaviour.isInvoiceBased);
        this.productFormGroup.controls['allowFundUsage'].setValue(targetProduct.productBehaviour.allowFundUsage);
        this.productFormGroup.controls['isTemporaryOverDraft'].setValue(targetProduct.productBehaviour.isTemporaryOverDraft);
        this.productFormGroup.controls['crmsRegulatoryId'].setValue(targetProduct.productBehaviour.crmsRegulatoryId);
        }
        
        this.onPriceIndexSelect(targetProduct.productPriceIndexId);
        this.onProductSpreadSelect(targetProduct.productPriceIndexSpread);
        ////console.log('principal balance', typeof (targetProduct.principalBalanceGl));
        if (typeof (targetProduct.principalBalanceGl) !== 'object') {
            this.onPrincipalGLSelect(targetProduct.principalBalanceGl);
        }
        if (typeof (targetProduct.principalBalanceGl2) !== 'object') {
            this.onPrincipalGLSelect(targetProduct.principalBalanceGl2);
        }
        this.hideCurrencyModal();
    }

    onProdTypeSelect(event) {
        this.selectedType = event.display;
        this.productFormGroup.controls['productTypeId'].patchValue(event.id);
        ////console.log('pTypeId', event.id);
        this.requireGlObj = event;
        this.showGls = (event.rPrinGl || event.rPrinGl2 || event.rInIncomeGl || event.rInReGl || event.rPrDisGl
            || event.rDorGl || event.rOvGl);
        this.reqRateTenor = (event.rTenor || event.rRate);
        this.reqLoanSchedule = event.rScheduleType;
        this.prodTypRadBtnCannotClick = false;
        this.selectedDealClassData = this.dealClassficationData.filter(x => x.lookupId === event.dClassId);
        ////console.log('selectedDeal', this.selectedDealClassData);
        this.productFormGroup.controls['dealClassificationId'].patchValue(this.selectedDealClassData[0].lookupId);
        // let row = this.productPriceIndexData.find(x => x.productPriceIndexId === 1);
        // this.productFormGroup.controls['productPriceIndexId'].patchValue(1);
        // this.onPriceIndexSelect(1);
    }

    onDayCountSelect(dayCountId) {
        this.productFormGroup.controls['dayCountId'].patchValue(parseInt(dayCountId, 32));
        ////console.log('dayCountId', dayCountId);
    }

    onPriceIndexSelect(priceIndex) {
        ////console.log('price index', priceIndex);
        // tslint:disable-next-line:radix
        let row = this.productPriceIndexData.find(x => x.productPriceIndexId === parseInt(priceIndex));
        ////console.log('price index', row);
        row != null ? this.priceIndexRateValue = row.priceIndexRate : this.priceIndexRateValue = 0;
        this.productSpreadTotal = this.priceIndexRateValue + this.spreadIndexValue;
        this.productFormGroup.controls['minimumRate'].setValue(this.productSpreadTotal);
        this.productFormGroup.controls['maximumRate'].setValue(this.productSpreadTotal);
    }

    onProductSpreadSelect(spreadIndex) {
        // let row = this.productPriceIndexData[parseInt(priceIndex)];
        // tslint:disable-next-line:radix
        this.spreadIndexValue = parseInt(spreadIndex);
        ////console.log('product spread', spreadIndex);
        this.productSpreadTotal = this.priceIndexRateValue + this.spreadIndexValue;
        this.productFormGroup.controls['minimumRate'].setValue(this.productSpreadTotal);
        this.productFormGroup.controls['maximumRate'].setValue(this.productSpreadTotal);
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
        let usedCategoryId = 0;
        if (prodCatId === 1) { // asset
            this.populateAllAssetLiabilityLedgers(prodCatId);
            usedCategoryId = 4; // income
            this.populateAllIncomeExpenseLedgers(usedCategoryId);
        } else if (prodCatId === 2) {// liability
            this.populateAllAssetLiabilityLedgers(prodCatId);
            usedCategoryId = 5;  // expense
            this.populateAllIncomeExpenseLedgers(usedCategoryId);
        }
        ////console.log(prodCatId);
    }

    populateAllAssetLiabilityLedgers(catId: number): void {
        this.assetLiabilityLedgerData = [];
        this.coaService.getAccountsByCategory(catId).subscribe((data) => {
            this.assetLiabilityLedgerData = data.result;
            this.assetPenalChargeLedgerData = data.result;

            ////console.log('assetLiabilityLedgerData', data.result);
        }, (err) => {
            ////console.log('server error', err);
        });
    }

    populateAllIncomeExpenseLedgers(catId: number): void {
        this.incomeExpenseLedgerData = [];
        this.coaService.getAccountsByCategory(catId).subscribe((data) => {
            this.incomeExpenseLedgerData = data.result;
            ////console.log('incomeExpenseLedgerData', data.result);
        }, (err) => {
            ////console.log('server error', err);
        });
    }

    onPrincipalGLSelect(glAccountId) {
        // tslint:disable-next-line:radix
        let row = parseInt(glAccountId);
        let data = this.assetLiabilityLedgerData.find(x => x.accountId === row);

        if (data != undefined) {
            this.productCurrencies = data.currencies;
        }

        this.selectedCurrencies = this.productCurrencies;
        this.displayCurrencyModal = true;
        this.principalGlNotClicked = false;
        this.mappedCurrencies = [];
        this.getAllProductCurrencies(glAccountId);
    }

    hideCurrencyModal() {
        let tempData = this.selectedCurrencies;
        this.mappedCurrencies = [];
        if (tempData !== undefined) {
            tempData.forEach(el => { this.mappedCurrencies.push(el.currencyName); });
            this.displayCurrencyModal = false;
            this.displaySelectedCurrencies = true;
        }
    }

    removeCurrency(deletedCurrency) {
        ////console.log('deleted currency', deletedCurrency);
        let curr = this.selectedCurrencies.find(x => x.currencyName === deletedCurrency);
        let index = this.selectedCurrencies.indexOf(curr);
        this.selectedCurrencies.splice(index, 1);
    }

    prodCurrenyList(): void {
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
        this.displayCurrencyModal = true;
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

    dealClassificationList(): void {
        this.dealClassficationData = [];
        this.dealService.getAllDealClassifications().subscribe((data) => {
            this.dealClassficationData = data.result;
            ////console.log('dealClassData', this.dealClassficationData);
        });
    }

    loanScheduleList(): void {
        this.loanScheduleTypeData = [];
        this.loanService.getAllLoanScheduleType().subscribe((data) => {
            this.loanScheduleTypeData = data.result;
        });
    }

    prodPriceIndexList() {
        this.productPriceIndexData = [];
        this.productService.getProductPriceIndex().subscribe((data) => {
            this.productPriceIndexData = data.result;
            this.loadingService.hide(0);
        });
    }

    productBehaviourList() {
        this.productBehaviorData = [];
        this.productService.getProductBehaviorTypes().subscribe((data) => {
            this.productBehaviorData = data.result;
        });
    }

    submitProductForm() {
        this.loadingService.show();
        this.productFormGroup.controls['currencies'].setValue(this.selectedCurrencies);
        this.productFormGroup.controls['fees'].setValue(this.feedMapped);
        this.productFormGroup.controls['collaterals'].setValue(this.securityMapped);
        let productBehaviour = {
            collateralFcyLimit : this.productFormGroup.value.collateralFcyLimit,
            collateralLcyLimit : this.productFormGroup.value.collateralLcyLimit,
            customerLimit : this.productFormGroup.value.customerLimit,
            productLimit : this.productFormGroup.value.productLimit,
            invoiceLimit : this.productFormGroup.value.invoiceLimit,
            isInvoiceBased : this.productFormGroup.value.isInvoiceBased,
            allowFundUsage : this.productFormGroup.value.allowFundUsage,
            crmsRegulatoryId: this.productFormGroup.value.crmsRegulatoryId,
            isTemporaryOverDraft: this.productFormGroup.value.isTemporaryOverDraft,
        }
        this.productFormGroup.controls['productBehaviour'].setValue(productBehaviour)
        let prodObj = this.productFormGroup.value;
        let dataObj: any;
        //console.log('product def', prodObj);

        this.productService.updateProduct(this.productId, prodObj).subscribe((data) => {
            // if the product update is unsuccessful return the error and go back
            this.loadingService.hide();
            if (data.success === false) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, data.message, 'error');
                // this.previous();
                this.activeIndex = 0;
                this.selectedProduct = '';
                this.editProductDetails = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, data.message, 'success');
                this.activeIndex = 0;
                this.selectedProduct = '';
                this.editProductDetails = false;
            }
        }, error => {
            this.loadingService.hide();
            this.selectedProduct = '';
            this.editProductDetails = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(error), 'error');
        });
    }

    handleChange(e) {
        this.activeIndex = e.index;
    }

    next() {
        this.activeIndex = (this.activeIndex === 2) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 1 : this.activeIndex - 1;
    }

    
    getSelectedProductClass(productClass) {
        if(productClass == 3){
          this.displayIsPaydayProduct = true;
        }else{this.displayIsPaydayProduct = false;}
    }
}
