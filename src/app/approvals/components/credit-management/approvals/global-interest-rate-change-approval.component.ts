import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import * as _ from 'lodash';
import { ProductService,  CurrencyService, StaffRoleService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { GlobalConfig, ApprovalStatus } from 'app/shared/constant/app.constant';
import { CreditAppraisalService } from 'app/credit/services';

@Component({
    templateUrl: 'global-interest-rate-change-approval.component.html',
   
})

export class GlobalInterestRateChangeApprovalComponent implements OnInit {
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

    selectedGroup: string; selectedType: string;

    productFormGroup: FormGroup;

    productGroups: any[]; btnValue: any;

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

    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    nextLevelId: number = 0;

    trail: any[] = [];
    trails: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;
    readonly OPERATION_ID: number = 100;
    errorMessage: string = '';
    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    warningMessage: string = '';


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
        this. getUserRole();
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
        this.productService.getProductPriceIndex().subscribe((data) => {
            this.productPriceIndexData = data.result;
        });
    }
    selectedData: any = {};
    approvalStatusId: any;
    comment: any;

    viewDetails(row, evt) {
        evt.preventDefault();
        this.selectedData = {};
        this.selectedData = row;
        this.displayModalForm = true;
    }

    viewComments(row, evt) {
        evt.preventDefault();
        this.selectedData = {};
        this.selectedData = row;
        this.getGlobalInterestRateChangeTrail(row.productPriceIndexGlobalId,this.OPERATION_ID);
        this.displayApprovalComment = true;
    }

    getGlobalInterestRateChangeTrail(applicationId,operationId) { 
        this.loadingService.show();
        this.camService.getGlobalInterestRateChangeTrail(applicationId, operationId).subscribe((response: any) => {
            this.trails = response.result;
            this.loadingService.hide();
        });
    }

    onPriceIndexSelect(priceIndex) {
        this.priceIndexRateValue = 0; 
        if(priceIndex != ""){
            // tslint:disable-next-line:radix
            let row = this.productPriceIndexData.find(x => x.productPriceIndexId === parseInt(priceIndex));
    
            this.priceIndexRateValue = row.priceIndexRate ;
        }
              
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') { 
                    this.userIsAccountOfficer = true; 
                    
                }
                if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager = true; 
                }
            });
    }

    refer() {
        this.clearControls();
        this.forwardAction = ApprovalStatus.REFERRED;
        this.displayCommentForm = true;
        this.commentTitle = 'Refer Back';
        this.referBackTrail();
        let control = this.commentForm.controls['trailId'];
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
        this.commentForm.controls['vote'].setValue(5);
    }

    referBackTrail(): any {
        this.backtrail = []; 
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.selectedData.productPriceIndexGlobalId, this.selectedData.operationId, this.selectedData.currentApprovalLevelId, false).subscribe((response: any) => {
            this.loadingService.hide();
            this.backtrail = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
       
    }

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    forwardCam(form) {
        const __this =this;
        let body = {
            forwardAction: __this.forwardAction,
            targetId: this.selectedData.productPriceIndexGlobalId,
            approvalStatusId: form.vote,
            comment: form.comment,
            isFlowTest : true,
        };
            if(__this.forwardAction == 5)    { body.isFlowTest = false}

        __this.errorMessage = '';
        __this.loadingService.show();
        __this.camService.forwardCam(body).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success == true) {
            if(__this.forwardAction == 5) {
                 
                __this.reset();
                __this.displayCommentForm = false;
                __this.clearControls();
                __this.loadingService.hide();
              
                if(response.result.isFinal == true)
                {
                   
                 __this.displayApplicationStatusMessage(response.result);
                        
                }
                else{
                    __this.displayApplicationStatusMessage(response.result);
                }
                return;
            }
                var promptMessage;
                if (response.stateId == 3)
                  promptMessage = 'The Global Interest rate change has been '+response.result.statusName;
                else{

                promptMessage = 'Global Interest rate change Status: '+ response.result.statusName +'. \n Next Approver: '+response.result.nextLevelName  +'-'+response.result.nextPersonName ;
            }
            swal({
                title: 'Workflow Destination Route',
                text: promptMessage + '\n Do you want to proceed?',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No, I want to select another approver',
                confirmButtonClass: 'btn btn-success btn-move',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: true,
            }).then(function () {
                __this.loadingService.show();
                body.isFlowTest = false;
                __this.camService.forwardCam(body).subscribe((response: any) => {
                    if (response.success == true) {
                        __this.reset();
                        __this.displayCommentForm = false;
                        __this.clearControls();
                        __this.loadingService.hide();
                        if(response.result.isFinal == true)
                        {
                         __this.displayApplicationStatusMessage(response.result);
                        }
                        else{
                            __this.displayApplicationStatusMessage(response.result);
                        }
                    } else {
                        __this.finishBad(response.message);
                        __this.errorMessage = response.message;
                    }
                }, (err: any) => {
                    __this.finishBad(JSON.stringify(err));
                });

            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    __this.nextLevelId = response.result.nextLevelId;
                   
                }
            });
                
            } else {
                __this.finishBad(response.message);
                __this.errorMessage = response.message;
            }
        }, (err: any) => {
            __this.finishBad(JSON.stringify(err));
        });
    }

    reset() {
        this.cancelForm();
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity();
    }

    cancelForm() {
        this.displayCommentForm = false;
        this.errorMessage = '';
        this.receiverLevelId = null;
        this.receiverStaffId = null;
        this.forwardAction = 0;
    }

    displayApplicationStatusMessage(response) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The Global Interest rate change has been <strong>${response.statusName}</strong>`, 'success');
        else{

            swal(`${GlobalConfig.APPLICATION_NAME}`, `Global Interest rate change Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    prodCurrenyList(): void {
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
        this.productPriceIndexGlobalId=productPriceIndexId;
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
    
    prodPriceIndexGlobalList() {
        this.productPriceIndexGlobalData = [];
        this.productService.getProductPriceIndexGlobalAwaitingApproval().subscribe((data) => {
            this.productPriceIndexGlobalData = data.result;
            this.loadingService.hide(0);
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
            hasBeenApplied: [false],
           
        });

        
            this.commentForm = this.fb.group({
                comment: ['', Validators.required], // debug_test, flow_test
                vote: ['', Validators.required],
                trailId: [''],
            });
    
            this.isBusiness == true ? 'Comment' : 'Recommendation';
        
       
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
        };
        if (body.productPriceIndexGlobalId < 1) {
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
            });
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

    promptToGoForApproval() {
            this.goForApproval();       
    }
    goForApproval() {
        let loading = this.loadingService;
        let bodyObj = {
            targetId: this.selectedData.productPriceIndexGlobalId,
            approvalStatusId: this.approvalStatusId,
            comment: this.comment,
        };
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
            __this.productService.sendForApproval(bodyObj).subscribe((response: any) => {
                __this.loadingService.hide();
               if (response.success === true) {
                    __this.prodPriceIndexGlobalList();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.displayModalForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    __this.displayModalForm = true;
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

}
