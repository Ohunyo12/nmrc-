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
    templateUrl: 'product-price-index.component.html',
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

export class ProductPriceIndexComponent implements OnInit {
    displayModalForm: boolean = false;
    createUpdateForm: FormGroup;
    selectedPriceIndexId?: number;
    currencies: any[];
    displayCurrencyModalForm: boolean = false;
    createUpdateCurrencyForm: FormGroup;
    selectedPriceIndexCurrencyId?: number;
    startDate:Date;
    endDate:Date;
    productPriceIndexHistory: any[];

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
        this.clearControls();
this.prodCurrenyList();
this.prodPriceIndexList(); 
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

    onPriceIndexSelect(priceIndex) {
        ////console.log('price index', priceIndex);
        // tslint:disable-next-line:radix
        let row = this.productPriceIndexData.find(x => x.productPriceIndexId === parseInt(priceIndex));
        ////console.log('price index', row);
        row != null ? this.priceIndexRateValue = row.priceIndexRate : this.priceIndexRateValue = 0;
        this.productSpreadTotal = this.priceIndexRateValue + this.spreadIndexValue;
    }

    prodCurrenyList(): void {
        let prodCurrency: Currency[];
        this.productCurrencyData = [];
        this.currencyService.getAllCurrencies().subscribe((data) => {
            this.currencies = data.result;
        });
    }

    getCurrency(index) {
        this.getAllIndexCurrency(index.productPriceIndexId);
        this.displayCurrencyModal = true;
    }
    
    getAllIndexCurrency(productPriceIndexId): void {    
        this.selectedPriceIndexId=productPriceIndexId;
      this.loadingService.show();
      this.productService.getProductPriceIndexCurrency(productPriceIndexId).subscribe((data) => {
        this.productCurrencies = data.result;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      });
    }


    getCurrencyName(id) {
        let model = this.currencies.find(x => x.currencyId == id);
        return (model == null) ? null : model.currencyName;
    }
    prodPriceIndexList() {
        this.productPriceIndexData = [];
        this.productService.getProductPriceIndex().subscribe((data) => {
            this.productPriceIndexData = data.result;
            this.loadingService.hide(0);
        });
    }
    editRow(index, evt) {
        evt.preventDefault();
        const row = index;
        this.selectedPriceIndexId = row.productPriceIndexId;
        this.createUpdateForm = this.fb.group({
            productPriceIndexId: [row.productPriceIndexId],
            priceIndexName: [row.priceIndexName, Validators.required],
            priceIndexRate: [row.priceIndexRate, Validators.required],
            priceIndexDescription: [row.priceIndexDescription, Validators.required],
            priceIndexDuration: [row.priceIndexDuration, Validators.required],
            allowAutomaticRepricing: [row.allowAutomaticRepricing],
            //currencyId: [row.priceIndexDescription, Validators.required],

        });
        ////console.log('editRow', this.selectedPriceIndexId);

        this.displayModalForm = true;
      }



    editCurrency(index) {
        let row = index;
        this.selectedPriceIndexCurrencyId = row.priceIndexCurrencyId;
        this.createUpdateCurrencyForm = this.fb.group({
            productPriceIndexId: [row.productPriceIndexId],
            priceIndexCurrencyId: [row.priceIndexCurrencyId],
            currencyId: [row.currencyId, Validators.required],            
        });
        this.displayCurrencyModalForm = true;
        ////console.log('this.index..', index);

    }
    clearControls() {
        this.selectedPriceIndexId = null;
        this.createUpdateForm = this.fb.group({
            productPriceIndexId: [0],
            priceIndexName: ['', Validators.required],
            priceIndexRate: ['', Validators.required],
            priceIndexDescription: ['', Validators.required],
            priceIndexDuration: ['', Validators.required],
            allowAutomaticRepricing: [false],
            //currencyId: ['', Validators.required],

        });
        this.createUpdateCurrencyForm = this.fb.group({
            productPriceIndexId: [''],
            priceIndexCurrencyId: [0],
            currencyId: ['', Validators.required],           
        });
    }
    clearCurrencyControls() {
        this.selectedPriceIndexCurrencyId = null;
        this.createUpdateCurrencyForm = this.fb.group({
            productPriceIndexId: [this.selectedPriceIndexId],
            priceIndexCurrencyId: [0],
            currencyId: ['', Validators.required],           
        });
    }
    showAddAddPricingIndexModal() {
        this.clearControls();
        this.displayModalForm = true;
    }
    showAddPriceIndexCurrencyModal() {
        this.clearCurrencyControls();
        ////console.log('showAddPriceIndexCurrencyModal', this.selectedPriceIndexId);

        this.displayCurrencyModalForm = true;
    }
    submitPriceIndexForm(form) {
        this.loadingService.show();
        let body = {
            productPriceIndexId: form.value.productPriceIndexId,
            priceIndexName: form.value.priceIndexName,
            priceIndexRate: form.value.priceIndexRate,
            priceIndexDescription: form.value.priceIndexDescription,
            priceIndexDuration: form.value.priceIndexDuration,
            allowAutomaticRepricing: form.value.allowAutomaticRepricing,
        };
        ////console.log('body.productPriceIndexId..', body.productPriceIndexId);
        if (body.productPriceIndexId < 1) {
            this.productService.addProductPriceIndex(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.prodPriceIndexList();
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            ////console.log('enter update', body.productPriceIndexId);

            this.productService.updateProductPriceIndex( body.productPriceIndexId, body).subscribe((res) => {
                if (res.success == true) {
                    ////console.log('enter update good', body.productPriceIndexId);

                    this.finishGood(res.message);
                    this.prodPriceIndexList();
                    this.displayModalForm = false;
                } else {
                    ////console.log('enter update bad', body.productPriceIndexId);
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                ////console.log('enter update bad bad', body.productPriceIndexId);
                this.finishBad(JSON.stringify(err));
            });
        }
    }
    submitPriceIndexCurrencyForm(formObj) {
        this.loadingService.show();
        let body = formObj.value;

         ////console.log('body..', body);
         ////console.log('this.selectedPriceIndexId..', this.selectedPriceIndexId);

        if (this.selectedPriceIndexCurrencyId === null) {
            this.productService.addProductPriceIndexCurrency(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllIndexCurrency(body.productPriceIndexId);
                    this.displayCurrencyModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.productService.updateProductPriceIndexCurrency(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllIndexCurrency(body.productPriceIndexId);
                    this.displayCurrencyModalForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }
    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }
    deleteProductCurrency(row) {
        const __this = this; 
         swal({
             title: 'Are you sure?',
             text: 'You want to delete this record!',
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
             __this.productService.deleteProductPriceIndexCurrency(row.priceIndexCurrencyId).subscribe((response: any) => {
                __this.loadingService.hide();
                 if (response.success === true) {
                     swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                     __this.getAllIndexCurrency(row.productPriceIndexId);
                    } else {
                     swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                 }
             }, (err) => {
                 __this.loadingService.hide();
                 swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
             });
         }, function (dismiss) {
             if (dismiss === 'cancel') {
                 swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
             }
         });
     }


    deleteProductIndex(row) {
       const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record!',
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
            __this.productService.deleteProductPriceIndex(row.productPriceIndexId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.prodPriceIndexList();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
    GetFilterRecord(){
        this.getProductPriceIndexHistory(this.startDate,this.endDate);
    }
    getProductPriceIndexHistory(startDate, endDate){
        let data ={
            startDate : startDate,
            endDate : endDate
        }
        ////console.log('data Dtate>>',data);
        this.loadingService.show();
        this.productService.getProductPriceIndexHistory(data).subscribe(results => {
            this.productPriceIndexHistory = results.result;
            ////console.log('this.productPriceIndexHistory>>',this.productPriceIndexHistory);

            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }
}
