
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { LoadingService } from '../../../shared/services/loading.service';

import swal from 'sweetalert2';
import * as _ from 'lodash';
import { GlobalConfig, ApprovalStatus } from '../../../shared/constant/app.constant';
import { ProductService,  CurrencyService, StaffRoleService } from 'app/setup/services';
import { Subscription } from 'rxjs';
import { CreditAppraisalService } from 'app/credit/services';

@Component({
    templateUrl: 'global-interest-rate-change.component.html',
})

export class GlobalInterestRateChangeComponent implements OnInit, OnDestroy {
    displayModalForm: boolean = false;
    createUpdateForm: FormGroup;
    productPriceIndexGlobalId?: number;
    currencies: any[];
    displayCurrencyModalForm: boolean = false;
    displayApprovalComment: boolean = false;
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
    approvalStatusId: number = 0;
    selectedGroup: string; selectedType: string;
    readonly OPERATION_ID: number = 100;
    productFormGroup: FormGroup;
    selectedData: any = {};
    productGroups: any[]; btnValue: any;
    trail: any[] = [];
    activeIndex = 0; newProductId = 0; responseMessage: string;
    newProductCode: string; prodGrpRadBtnCannotClick = true; prodTypRadBtnCannotClick = true;
    displayPanel = false; btnDisabled = true; showGls: boolean; reqRateTenor: boolean;
    displayCurrencyModal = false; principalGlNotClicked = true; priceIndexRateValue = 0;
    spreadIndexValue = 0; productSpreadTotal = 0; displaySelectedCurrencies = false;

    productTypeData: any[]; productCompanyData: any[]; accountTypeData: any[];
    productCategoryData: any[]; productCurrencyData: any[]; 
    incomeExpenseLedgerData: any[]; treasuryProductTypeData: any[]; dealClassficationData: any[]; dayCountData: any[];
    loanScheduleTypeData: any[];
    selectedCurrencyId = 0; selectedDealClassData: any; productClassData: any[];
    productPriceIndexGlobalData: any[]; productCurrencies: any[]; mappedCurrencies: string[];

    reqLoanSchedule: boolean; selectedCurrencies: any; editProductDetails = false;
    productBehaviorData: any = []; requireGlObj: any;
    private subscriptions = new Subscription();
    ngOnDestroy(): void {
          this.subscriptions.unsubscribe();
      }
  
    constructor(
        private productService: ProductService, private loadingService: LoadingService,
        private fb: FormBuilder, private currencyService: CurrencyService,
        private staffRole: StaffRoleService,private camService: CreditAppraisalService,


    ) { }

    ngOnInit() {
        this.loadingService.show();
        this.clearControls();
        this.prodCurrenyList();
        this.prodPriceIndexes();
        this.prodPriceIndexGlobalList(); 
        this.getUserRole();
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO' || this.staffRoleRecord.staffRoleCode == 'CP') { 
                    this.userIsAccountOfficer = true; 
                }
                if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager = true; 
                }
            });
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

    productPriceIndexData: any[];
    prodPriceIndexes() {
        this.productPriceIndexData = [];
        this.subscriptions.add(
        this.productService.getProductPriceIndex().subscribe((data) => {
            this.productPriceIndexData = data.result;
        }));
    }
    onPriceIndexSelect(priceIndex) {
        this.priceIndexRateValue = 0; 
        if(priceIndex != ""){
            // tslint:disable-next-line:radix
            let row = this.productPriceIndexData.find(x => x.productPriceIndexId === parseInt(priceIndex));
           // console.log(priceIndex);
    
            this.priceIndexRateValue = row.priceIndexRate ;
        }
              
       // console.log(this.productPriceIndexData);
    }

    prodCurrenyList(): void {
        this.productCurrencyData = [];
        this.subscriptions.add(
        this.currencyService.getAllCurrencies().subscribe((data) => {
            this.currencies = data.result;
        }));
    }

    getCurrency(index) {
        this.getAllIndexCurrency(index.productPriceIndexId);
        this.displayCurrencyModal = true;
    }
    
    getAllIndexCurrency(productPriceIndexId): void {    
        this.productPriceIndexGlobalId=productPriceIndexId;
      this.loadingService.show();
      this.subscriptions.add(
      this.productService.getProductPriceIndexCurrency(productPriceIndexId).subscribe((data) => {
        this.productCurrencies = data.result;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
    }

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            let processLabel = 'PROCESSING';
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    getCurrencyName(id) {
        let model = this.currencies.find(x => x.currencyId == id);
        return (model == null) ? null : model.currencyName;
    }

    prodPriceIndexGlobalList() {
        this.productPriceIndexGlobalData = [];
        this.subscriptions.add(
        this.productService.getProductPriceIndexGlobal().subscribe((data) => {
            this.productPriceIndexGlobalData = data.result;
            this.loadingService.hide(0);
        }));
    }
    productPriceIndexId: any;
    oldRate: any;
    newRate: any;
    effectiveDate: any;


    editRow(row, evt) {
        evt.preventDefault();
        const selectedRec = row;
        this.productPriceIndexGlobalId = selectedRec.productPriceIndexGlobalId;
           
        this.approvalStatusId = selectedRec.approvalStatusId;
        this.createUpdateForm = this.fb.group({
            productPriceIndexGlobalId: [row.productPriceIndexGlobalId],
            productPriceIndexId: [row.productPriceIndexId, Validators.required],
            oldRate: [row.oldRate],
            newRate: [row.newRate, Validators.required],
            effectiveDate: [new Date(row.effectiveDate), Validators.required],
            isMarketInduced: [row.isMarketInduced],
            comment: [''],
        });
        //  this.createUpdateForm.controls["effectiveDate"].setValue(
        //     new Date(row.effectiveDate)
        //    );

        this.displayModalForm = true;
      }   

      viewComments(row, evt) {
        evt.preventDefault();
        this.selectedData = {};
        this.selectedData = row;
       // console.log("my data "+JSON.stringify(row));
        this.getGlobalInterestRateChangeTrail(this.selectedData.productPriceIndexGlobalId,this.OPERATION_ID);
        this.displayApprovalComment = true;
    }

    getGlobalInterestRateChangeTrail(applicationId, operationId) { 
        this.loadingService.show();
        this.camService.getGlobalInterestRateChangeTrail(applicationId, operationId).subscribe((response: any) => {
            this.trail = response.result;
            this.loadingService.hide();
        });
    }

    clearControls() {
        this.productPriceIndexGlobalId = null;
        this.createUpdateForm = this.fb.group({
            productPriceIndexGlobalId: [0],
            productPriceIndexId: ['', Validators.required],
            oldRate: [0],
            newRate: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            isMarketInduced: [false],
            comment: [''],
           
        });
       
    }
   
    showAddAddPricingIndexModal() {
        this.clearControls();
        this.displayModalForm = true;
    }
   
    submitPriceIndexForm(form) {
        this.loadingService.show();
        let body = {
            productPriceIndexGlobalId: form.value.productPriceIndexGlobalId,
            productPriceIndexId: form.value.productPriceIndexId,
            oldRate: form.value.oldRate,
            newRate: form.value.newRate,
            effectiveDate: form.value.effectiveDate,
            hasBeenApplied: form.value.hasBeenApplied,
            isMarketInduced: form.value.isMarketInduced,
        };
        
        if (body.productPriceIndexGlobalId < 1) {
            this.subscriptions.add(
            this.productService.addProductPriceIndexGlobal(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.prodPriceIndexGlobalList();
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
               }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            }));
        } else {

            this.productService.updateProductPriceIndexGlobal( body.productPriceIndexGlobalId, body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.prodPriceIndexGlobalList();
                    this.displayModalForm = false;
                } else {
                   this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
        this.loadingService.hide();

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
            __this.subscriptions.add(
            __this.productService.deleteProductPriceIndex(row.productPriceIndexId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.prodPriceIndexGlobalList();
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            }));
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
}
