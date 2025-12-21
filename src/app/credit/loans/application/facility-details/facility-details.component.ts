import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, Attribute, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, Validator } from '@angular/forms';
import { CasaService } from '../../../../customer/services/casa.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { ProductService } from '../../../../setup/services/product.service';
import { LoanService } from '../../../services/loan.service';
import { CurrencyService } from '../../../../setup/services/currency.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CustomerGroupService } from '../../../../customer/services/customer-group.service';
import { CustomerService } from '../../../../customer/services/customer.service';
import { IApplicationInfo, ILoanApplication, IProductFees, IInvoiceDetails, ILoanApplicationDetail, ITraderLoan, IEducationLoan, ISyndicatedLoan } from '../loanApplicationInfo.interface'
import { GlobalConfig, ConvertString, TenorType, CustomerTypeEnum, ProductClassProcessEnum, ProductClassEnum, CreditcardTypeEnum, RacSearchBaseEnum, ProductTypeEnum, FlowChangeEnum } from '../../../../shared/constant/app.constant';

import { ValidationService } from '../../../../shared/services/validation.service';
import { BondGurantyComponent } from './extentions/bond-guranty.component'
import { EducationLoanComponent } from './extentions/education-loan.component';
import { FirstTraderComponent } from './extentions/first-trader.component';

import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
// import { log } from 'util';
// import { FormArray } from '@angular/forms/src/model';
// import { fail } from 'assert';
// import { FirstTraderComponent } from './extentions/first-trader.component';
// import { convertToParamMap } from '@angular/router/src/shared';
// import { ChildSectorLimitComponent } from '../limits/sector-limit.component';
import { DateUtilService } from 'app/shared/services/dateutils';
import { race } from 'rxjs';
import { ExchangeRateService, StaffService } from 'app/admin/services';
import { DetailedPeerCertificate } from 'tls';
import values from 'assets/config/values';
import { GeneralSetupService } from 'app/setup/services/general-setup.service';
import { isNullOrUndefined } from 'util';
import { FinancialStatementComponent } from 'app/setup/components';

function ValidateGreaterThanZero(c: AbstractControl): { [key: string]: boolean } | null {

    if (c.value == undefined && isNaN(c.value) || c.value <= 0) {
        return { zero: true }
    }
    return null;
}

@Component({
    selector: 'facility-details',
    templateUrl: `./facility-details.component.html`,
    providers: [StaffService]
})

export class FacilityDetailsComponent implements OnInit {

    @ViewChild(BondGurantyComponent, { static: false }) bgcomponent: BondGurantyComponent;
    @ViewChild(EducationLoanComponent, { static: false }) educomponent: EducationLoanComponent;
    @ViewChild(FirstTraderComponent, { static: false }) firstcomponent: FirstTraderComponent;
    customer: any;
    sectorLimitData: any;
    pdfFile: any;
    pdfFileName: any;
    myDocExtention: any;
    selectedProductId: any;
    message: string;
    title: string;
    cssClass: string;
    show: boolean;
    loanApp: any;
    allExchangeRates: any;
    categoryTeirs: any;
    racCategoryTypeId: any;
    ProductId: any;
    productId: any;
    showCategoryTypeInput: boolean = false;
    repaymentPatterns: any[];
    isContingent: boolean;
    buttonText: string;
    displayADAuth: boolean = false;
    bulkUPload: boolean = false;
    adAuthPassCode: string = null;
    uploadedData: any;
    failedUpload: any;
    proposedTenor: any;
    approvedCycles: any[] = [];
    racFails: boolean = false;
    bankPendingExposure: any;
    isLineFacility: boolean = false;
    private _bankExposure: any;
    get bankExposure() {
        return this._bankExposure;
    }
    set bankExposure(value) {
        this._bankExposure = +(value);
    }
    loanReviewTypes: any[] = [];
    propertyTypes: any[] = [];

    records: any;
    bankLimit: any;
    loanApplicationId: number;
    showRacResult: boolean;

    [x: string]: any;
    readonly CASH_BACKED = 5;
    readonly INVOICE_DISCOUNTING = 6;
    readonly FIRST_EDUCATION = 7;
    readonly FIRST_TRADERS = 8;
    readonly IMPORT_FINANCE = 9;
    readonly BOND_AND_GUARANTEES = 10;
    readonly TEAM_LOAN = 1;
    readonly COMMERIAL_LOAN = 2;
    readonly RETAIL_LOAN = 3;
    readonly INDIVIDUAL_LOAN = 4;
    isAgricRelatedRac: any;
    testObject: any = null;

    isInvoiceBased: boolean = false;
    isRenewal: boolean = false;
    displayCashBacked: boolean = false;
    displayInvoiceDiscounting: boolean = false;
    displayFirstEdu: boolean = false;
    displayFirstTraders: boolean = false;
    displayImportFinance: boolean = false;
    displayBondAndGuarantees: boolean = false;
    displayTeamloan: boolean = false;
    displayLiveEdit: boolean = false;
    cashBackedForm: FormGroup;
    facilityTradderDetailsForm: FormGroup;
    disableControl: boolean = false;
    tenorMode: number;
    selectedDetailId: number;
    allowedCurrencies: any[] = [];
    invoiceTable: any[] = [];
    collectFeesLebel: string; invoiceInfo: FormGroup;
    syndicationFormDetail: FormGroup;
    programmType: string;
    racCurrencyId: number;
    marketLocations: any[] = [];
    racApplicationSpecialProcessFlow: any[] = [];
    es: any;
    bondDetails: any;
    startdate: Date;
    enddate: Date;
    traderLoan: ITraderLoan;
    educationLoan: IEducationLoan;
    customerLimitMoney: number;
    projectName: string = "Total Project Amount (NGN)"
    newCustomerinfo: any; resetFirstTraders: boolean = false; requireCollateral: boolean = true; facilityAmount: number;
    currencyId: number; proposedProductId: any; principal: any[]; parcentage: string; showParcentage: boolean = false;
    displayFacilityDetails: boolean = false; loanDetails: ILoanApplicationDetail[] = []; resetBondAndGuarantees: boolean = false;
    facilityDetailsForm: FormGroup; loanApplicationDetails: any[] = []; TotalAmount: number = 0; MaximumTenor: number = 0; selectedCustomer: string; currencies: any[]; filteredProducts: any[]; groupMembers: any[]; loanApplicationReferance: number = 0; facilityTypes: any[];
    filteredSubsector: any[]; products: any[]; sector: any[]; subsector: any[] = []; selectedSectorId: number = -1; accountOwner: any[] = []; productClasses: any[]; selectedProductClassId: number = -1; exchange: any = {}; //displayFacilityDetails: boolean = false;
    customerNameOrGroup: string; customers: any; proposedAmount: string; IsBaseCurrency: boolean; exchangeValue: number; exchangeRate: string; customerAccount: any; documentTitle: string; displayInvoiceDetails: boolean = false;
    disableUpload: boolean = false; invoiceNumber: string; purchaseOrderNumber: string; contractNumber: string; invoiceDocDate: string; invoiceAmount: string; maximumRate: number = 100; minimumRate: number = 0; maximumTenor: number; minimumTenor: number = 0;
    displayBGUpload: boolean = false; refenceNoBG: string; feesCollected: any; pAmount: any; requireCasaAccount: boolean;
    extensionData: any[]; invoiceStatus: boolean = true; dayInterval: number; customerType: string; requireEquityContribution: boolean = false;
    isProductProgram: boolean = false;
    addFacilityLabel: string = ' Add Facility';
    addBulkInvoice: string = ' Add Bulk';
    isFeeEditable: boolean;
    displayInvoiceDetails2: boolean = false;
    private CAMORFAM;

    @Input() editMode: boolean = false;
    @Input() customerGroupId: number;
    @Input() loanTypeId: number;
    @Input() customerId: number;
    @Input() customerTypeId1: number;
    @Input() productClassProcessId: number;
    @Input() productClassId: number;
    @Input() customerName: string;
    @Input() newLoanApplicationId: number;
    @Input() ApplicationRef: number;
    @Input() maximumAmount: number;
    @Input() utilizedAmount: number;
    @Input() facilityDetail: any = {};
    @Input() loanApplication: ILoanApplication;
    @Input() isIblRequest: boolean;
    @Input() isIBLEligible: boolean;
    @Input() iblAmount: number;
    @Input() iblMinimumAmount: number;

    // @Input() mainForm: any;

    // @Input() set selectedFacilityDetail(value: any) {
    //     if (value != null) this.editFacilityDetails(value);
    // }
    @Input() set applicationDetailId(value: any) {
        if (value > 0) {
            //this.switchForms();
            this.getApplicationDetail(value);
            if (this.editMode) this.addFacilityLabel = 'Update Facility';
        }
    }

    @Output() facilityDetailsData = new EventEmitter<any[]>();
    // @Output() closeWindow = new EventEmitter<boolean>();
    @Output() refreshDetailsGrid = new EventEmitter<number>();

    loanApplicate: ILoanApplication;
    displayInvoice: boolean = false;
    invoiceEditMode: boolean = false;
    editInvoiceData: any;
    binaryFile: any;
    displayUpload: boolean = false;
    selectedDocument: any;
    crsmFundingSource: any[];
    crsmRepaymentSource: any[];
    productPriceIndexes: any[];
    facilityApplicationSpecialProcessFlow: any[] = [];
    cashCollaterizedProcessFlow: any;
    displaySyndicatedLoan: boolean = false;
    displayAddSyndicationDetails: boolean = false;
    syndicationDetailList: ISyndicatedLoan[] = [];
    syndicationAmountContribution: number = 0;
    syndicatedamountContributed: number = 0;
    syndicationTypes: any[];
    //@ViewChild() sectorialLimit: ChildSectorLimitComponent;
    activeBondForm: boolean = true;
    racProductClassId: any;
    adActive: boolean = false;
    isCreditcard: boolean = false;
    productTenor: number = 0;
    isCashedBacked: boolean = false;
    isTod: boolean = false;
    @Input() isAdhoc = false;
    invoiceLimit = 0;
    requestOldReference: boolean = false;

    constructor(private fb: FormBuilder, private casaService: CasaService, private loanAppService: LoanApplicationService,
        private productService: ProductService, private loanService: LoanService, private currencyService: CurrencyService,
        private loadingSrv: LoadingService, private CustomerGroupSer: CustomerGroupService, private customerService: CustomerService,
        private camService: CreditAppraisalService, private zone: NgZone, private dateUtilService: DateUtilService,
        private exchangeServ: ExchangeRateService,
        private genSetupServ: GeneralSetupService,
        private staffService: StaffService
    ) {
        this.CAMORFAM = values.CAMORFAM;
    }


    ngOnInit() {
        this.GetTotalBankExposure();
        if (this.productClassId != ProductClassEnum.CREDITCARD) {
            this.searchBasePlaceholder = "PRODUCTCLASS";
            this.racProductClassId = this.productClassId;
            this.isCreditcard = false;
        }
        if (this.productClassId == ProductClassEnum.CREDITCARD) {
            this.searchBasePlaceholder = "CREDITCARD";
            this.isCreditcard = true;
        }
        this.InitfacilityDetailsForm();
        this.switchForms();
        this.loadDropdowns();
        this.getAllPrincipal();
        this.getAllCurrencies();
        this.getAllRepaymentSchedules();
        this.collectFeesLebel = 'Previous Term School Fees'
        this.facilityDetails();
        this.initInvioce();
        this.initialiseSyndicationDetails();

        this.getCustomerDetails(this.customerId);

        // this.initSyndicationFormDetail();
        this.facilityDetailsForm.controls["customerId"].setValue(this.customerId);
        this.facilityDetailsForm.get("proposedTenor").valueChanges.subscribe(value => {
        });

        this.racCustomerId = this.customerId;
        // console.log('this.racCustomerId & loan.customerId', this.racCustomerId , this.customerId)

        this.loanAppService.getCashCollaterizedProcessFlowBy().subscribe((res) => {
            if (res.success) {
                this.cashCollaterizedProcessFlow = res.result;
            }
        });

        this.facilityDetailsForm.get("proposedAmount").valueChanges
            .subscribe(value => {
                let curId = +this.facilityDetailsForm.get("currencyId").value;
                this.getExchangeRate(curId);
            });
        this.facilityDetailsForm.get("invoiceAmount").valueChanges
            .subscribe(value => {
                let rate = this.facilityDetailsForm.get("fcyRate").value;
                let amount = (rate * +ConvertString.TO_NUMBER(value)) * (this.invoiceLimit * 0.01);
                this.facilityDetailsForm.controls["lcyInvoiceValue"].setValue(rate * +ConvertString.TO_NUMBER(value));
                this.productAmount = 0;
                this.productAmount = amount;
                //this.facilityDetailsForm.controls["proposedAmount"].setValue(amount);
            });

        this.facilityDetailsForm.get("lcyInvoiceValue").valueChanges
            .subscribe(value => {
                let amount = +ConvertString.TO_NUMBER(value) * (this.invoiceLimit * 0.01);
                // this.facilityDetailsForm.controls["proposedAmount"].setValue(amount);
                this.productAmount = 0; this.productAmount = amount;
            });

        this.facilityDetailsForm.get("proposedAmount").valueChanges
            .subscribe(value => {
                let FXrate = this.facilityDetailsForm.get("loanfcyRate").value;

                let amount = +ConvertString.TO_NUMBER(value) / FXrate;
                this.facilityDetailsForm.controls["exchangeAmount"].setValue(amount);
                // this.calculateEquityRatio()
            });

    }

    onReviewTypeChange(value) {
        let selectedReviewType = this.loanReviewTypes.find(x => x.loanDetailReviewTypeId == value);
        if (selectedReviewType.loanDetailReviewTypeName == "RENEWAL") {
            this.requestOldReference = true;
           
        } else {
            this.requestOldReference = false;
            //this.isRenewal = false;

        }
    }

    oldReferenceValidation: any;
    onReviewTypeChangeRef(value) {
        this.camService.getAllOldApplicationReference(value).subscribe((res) => {
            this.oldReferenceValidation = res.result;
            if (this.oldReferenceValidation == null) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Old Application Reference Number does not exist', 'warning');
                this.facilityDetailsForm.controls['oldApplicationRefForRenewal'].setValue("");
            }
        });
    }

    getAllRepaymentSchedules() {
        this.camService.getAllRepaymentSchedules().subscribe((res) => {
            this.repaymentPatterns = res.result;
        });
    }

    showInvoiceData() {
        this.displayInvoice = true;
    }

    lsectorLimit: number;
    osectorLimit: number;
    sectorLimit: number;
    exposure: number;

    getSectorLimit(sectorId) {
        this.loanAppService.getFacilitySectorLimit(sectorId)
            .subscribe((res) => {
                this.sectorLimitData = res.result;
                this.osectorLimit = res.result.outstandingBalance;
                this.lsectorLimit = res.result.limit;
                this.sectorLimit = (res.result.sectorLimit) * 100;
                this.exposure = (res.result.exposureLimit) * 100;

            }, (err) => {
            });
    }


    editInvoice(data) {

        this.invoiceEditMode = true;
        this.invoiceInfo.patchValue({
            invoiceAmount: data.invoiceAmount,
            contractNumber: data.contractNo,
            invoiceNumber: data.invoiceNo,
            purchaseOrderNumber: data.purchaseOrderNumber,
            invoiceDocDate: new Date(data.invoiceDate),
            invoiceDocument: data.invoiceDocument,
            certificateNumber: data.certificateNumber,
            reValidated: data.reValidated,
            entrySheetNumber: data.entrySheetNumber,
        });
        this.editInvoiceData = data;
        this.invoiceInfo.controls["invoiceDocument"].setValue(data.invoiceDocument)
        // this.fileInput.nativeElement.value = data.invoiceDocument;
        this.displayInvoiceDetails = true;
    }

    removeInvoiceDetails(evt, indx) {

        evt.preventDefault();
        const currRecord = this.invoiceTable[indx];
        const d = ConvertString.TO_NUMBER(currRecord.invoiceAmount);
        var invValue = 0;
        invValue = ConvertString.TO_NUMBER(this.facilityDetailsForm.get("invoiceAmount").value);

        let bal = +ConvertString.TO_NUMBER(invValue) - +ConvertString.TO_NUMBER(d);

        this.facilityDetailsForm.controls["invoiceAmount"].setValue(bal);
        this.productAmount = bal * (this.invoiceLimit / 100)
        this.invoiceTable.splice(indx, 1);
        //  this.deleteUpload(currRecord.invoiceNo, this.ApplicationRef);
        if (this.invoiceTable.length == 0) this.displayInvoice = false

    }

    calculateEquityRatio() {
        let doCalc: boolean = true;
        let totalAmountRequired = (+ConvertString.TO_NUMBER(this.facilityDetailsForm.get("totalAmountRequired").value));
        let equityAmount = (+ConvertString.TO_NUMBER(this.facilityDetailsForm.get("equityAmount").value));

        if (totalAmountRequired > this.productLimit && this.productLimit > 0) {
            const str = `Maximum product limit of ${this.productLimit} is exceeded.`
            swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
        }

        // this.productService.getProductsBehaviourByProductId(this.proposedProductId).subscribe((resp) => {
        //         if (resp.result != null) {
        //             this.productLimit2 = resp.result.productLimit;

        //              if(totalAmountRequired>this.productLimit2){
        //              const str = `Maximum product limit of ${this.productLimit} is exceeded.`
        //             swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
        //             }

        //             //this.isInvoiceBased = resp.result.isInvoiceBased;
        //             //this.requireCasaAccount = resp.result.requireCasaAccount;
        //             //this.customerLimitMoney = resp.result.customerLimit;
        //         }

        //     });

        if (isNaN(totalAmountRequired) || equityAmount == undefined)
            doCalc = false
        if (isNaN(equityAmount) || equityAmount == undefined)
            doCalc = false

        if (doCalc && equityAmount > 0 && totalAmountRequired > 0) {

            if (+ConvertString.TO_NUMBER(totalAmountRequired) < +ConvertString.TO_NUMBER(equityAmount)) {
                let control = this.facilityDetailsForm.patchValue({
                    equityAmount: 0,
                    proposedAmount: 0
                });
                this.showParcentage = false;
                this.parcentage = "";
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Equity Contribution is more than Total Amount", 'warning');
                return;
            }

            const result = +(+ConvertString.TO_NUMBER(equityAmount) / (+ConvertString.TO_NUMBER(totalAmountRequired)) * 100).toFixed(2);
            this.parcentage = result.toString();
            this.showParcentage = true;
            if (result >= this.requiredEquity) {
                const bankContribution = ((100 - result) * 0.01) * totalAmountRequired
                if ((100 - result) >= 50) this.requireCollateral = false;
                this.facilityAmount = (+ConvertString.TO_NUMBER(totalAmountRequired)) - +ConvertString.TO_NUMBER(equityAmount);
                if (!isNaN(this.customerLimitMoney) && this.customerLimitMoney != undefined &&
                    this.customerLimitMoney != null && this.customerLimitMoney >= bankContribution) {
                    let control = this.facilityDetailsForm.patchValue({
                        proposedAmount: (+ConvertString.TO_NUMBER(totalAmountRequired)) - +ConvertString.TO_NUMBER(equityAmount), // bankContribution.toFixed(2),
                    });
                } else {
                    if (this.customerLimitMoney > 0) {
                        this.showParcentage = false;
                        this.parcentage = "";
                        const str = `Maximum product customer limit of ${this.customerLimitMoney} is exceeded.`
                        swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
                    }
                }

            } else {
                let control = this.facilityDetailsForm.patchValue({
                    equityAmount: 0,
                    proposedAmount: 0,
                });

                const str = `Minimum equity contribution of ${this.requiredEquity}% is not met`
                swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
                this.loadingSrv.hide();
            }
        }
    }

    // lsectorLimit: number;
    // osectorLimit: number;
    // getSectorLimit(subSectorId) {
    //     this.loanAppService.getSectorLimit(subSectorId)
    //         .subscribe((res) => {
    //             this.sectorLimitData = res.result;
    //             this.osectorLimit = res.result.outstandingBalance;
    //             this.lsectorLimit = res.result.limit;

    //         }, (err) => {
    //         });
    // }

    async getExtendedFormItems() {
        if (this.productClassId == 7) await this.getEducationLoan(this.educomponent.educationLoanForm);
        if (this.productClassId == 8) await this.getFirstTraders(this.firstcomponent.traderLoan);
        if (this.productClassId == 10) await this.getBondGuranty(this.bgcomponent.bondDetailForm);
    }

    getFirstTraders(data: FormGroup) {
        this.traderLoan = {
            marketId: data.value.marketId,
            averageMonthlyTurnover: data.value.averageMonthlyTurnover,
            soldItems: data.value.soldItems
        }
    }

    getBondGuranty(data: FormGroup) {

        const bond = data.value;
        this.bondDetails = {
            casaAccountId: bond.casaAccountId,
            principalId: bond.principalId,
            bondAmount: bond.bondAmount,
            bondCurrencyId: bond.bondCurrencyId,
            contractStartDate: bond.contractStartDate,
            contractEndDate: bond.contractEndDate,
            isTenored: bond.isTenored == 1,
            isBankFormat: bond.isBankFormat == 1,
            bondfcyRate: bond.bondfcyRate,
            bondfcyAmount: bond.bondfcyAmount,
            principalName: bond.principalName,
        }
        if (this.displayBondAndGuarantees) {
            // if (data.valid == true) {
            this.activeBondForm = true;
            // }
            // else {
            // this.activeBondForm = false;
            // }
        }
    }

    getEducationLoan(data: FormGroup) {
        this.educationLoan = {
            averageSchoolFees: data.value.averageSchoolFees,
            numberOfStudent: data.value.numberOfStudent,
            schoolFeesCollected: data.value.schoolFeesCollected
        }
    }

    onTenorModeChange(tenorModeId) {
        this.validateTenor2(tenorModeId);
        this.tenorMode = tenorModeId;

        this.facilityDetailsForm.patchValue({
            'tenorModeId': tenorModeId
        });
    }

    validateAmount: boolean;
    amountValidation: string;

    checkInvoiceAmount() {
        let amount = ConvertString.TO_NUMBER(this.proposedAmount);
        let documentAmounts = this.facilityDetailsForm.get("lcyInvoiceValue").value;
        if (+(ConvertString.TO_NUMBER(documentAmounts)) >= +(ConvertString.TO_NUMBER(amount))) {
            this.validateAmount = false;
        }
        else {
            this.validateAmount = true;
            let rate = this.facilityDetailsForm.get("fcyRate").value;
            let amount = + ConvertString.TO_NUMBER(this.validateLoanAmountOnLimit(documentAmounts, rate));
            this.facilityDetailsForm.get("proposedAmount").setValue(amount);
            this.amountValidation = `Loan amount can not more than ${this.invoiceLimit}% of the invoice value`
        }
    }

    validateLoanAmountOnLimit(loanAmount, rate?): number {
        rate = (rate == null || rate == "") ? 1 : rate
        let amount = (rate * +ConvertString.TO_NUMBER(loanAmount)) * (this.invoiceLimit * 0.01);
        return amount
    }


    closeFacilityDetails() {
        this.activeBondForm = false;
        // this.closeWindow.emit(this.displayFacilityDetails);
        this.InitfacilityDetailsForm();
        this.refreshDetailsGrid.emit(1);
    }

    initInvioce() {
        this.invoiceInfo = this.fb.group({
            // contractNumber: ['', Validators.required],
            contractNumber: [''],
            invoiceNumber: ['', Validators.required],
            invoiceDocDate: ['', Validators.required],
            invoiceAmount: ['', Validators.required],
            invoiceDocument: ['', Validators.required],
            purchaseOrderNumber: ['', Validators.required],
            certificateNumber: ['', Validators.required],
            entrySheetNumber: [''],
            reValidated: [false],
        });
    }

    onAdd() {
        let newinvoices = this.facilityDetailsForm.get('addinvoices').value;
        var curr = this.facilityDetailsForm.get('currencyId').value;
        const ivi = this.invoiceInfo.value;
        let duplicate: boolean;
        if (this.invoiceTable.length > 0) {
            if (this.invoiceEditMode == false) {
                if (this.invoiceTable.find(x => x.contractNo == ivi.contractNumber) != null) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Contract Number already exist.', 'error');
                    return;
                } else if (this.invoiceTable.find(x => x.invoiceNo == ivi.invoiceNumber) != null) {
                    if (ivi.reValidated == false) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Invoice Number already exist.', 'error');
                        return;
                    }
                } else if (this.invoiceTable.find(x => x.purchaseOrderNumber == ivi.purchaseOrderNumber) != null) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Purchase Order Number already exist.', 'error');
                    return;
                } else if (this.invoiceTable.find(x => x.certificateNumber == ivi.certificateNumber) != null) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Certificate Number already exist.', 'error');
                    return;
                }
            }
        }
        let data = {
            customerId: this.customerId,
            productId: this.proposedProductId,
            principalId: this.principalId,
            documentNo: ivi.invoiceNumber,
            purchaseOrderNumber: ivi.purchaseOrderNumber,
            contractNumber: ivi.contractNumber,
            certificateNumber: ivi.certificateNumber,
            reValidated: ivi.reValidated,
        };
        this.loanAppService.validateInvoiceDetail(data).subscribe((res) => {
            if (res.result == true) {
                let invoiceObj = {
                    contractNo: ivi.contractNumber,
                    invoiceNo: ivi.invoiceNumber,
                    invoiceDate: ivi.invoiceDocDate,
                    invoiceAmount: ivi.invoiceAmount,
                    purchaseOrderNumber: ivi.purchaseOrderNumber,
                    invoiceDocument: this.selectedDocument,
                    certificateNumber: ivi.certificateNumber,
                    reValidated: ivi.reValidated,
                    entrySheetNumber: ivi.entrySheetNumber,
                }
                if (this.invoiceEditMode == false) {
                    this.invoiceTable.push(invoiceObj);
                } else {
                    var index = this.invoiceTable.indexOf(this.editInvoiceData);
                    if (index !== -1) {
                        this.invoiceTable[index] = invoiceObj;
                    }
                }
                this.documentTitle = ' Invoice document with Invoice No: ' + invoiceObj.invoiceNo;
                this.uploadFile();
                this.fileInput.nativeElement.value = "";
                this.calculateInvoiceTotal();
                this.invoiceEditMode = false;
                this.editInvoiceData = null;
                this.displayInvoiceDetails = false;
                this.selectedDocument = null;
                if (this.editMode == false) this.invoiceInfo.reset();
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Invoice Number ' + ivi.invoiceNumber + ' already used For This Customer', 'error');

                // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Invoice/Contract Number/Certificate Number/Purchase Order Number already exist.', 'error');
                //  this.invoiceInfo.reset();
                return;
            }
        });
        if (this.displayInvoiceDiscounting == true) {
            const principalIdControl = this.facilityDetailsForm.get('currencyId');
            principalIdControl.setValidators(Validators.required);
            //principalIdControl.clearValidators();
            principalIdControl.updateValueAndValidity();
            this.facilityDetailsForm.get('currencyId').setValue('');
        }

    }


    totalInvoiceValue: number;
    productAmount: number;

    closeInvoiceDetail() {
        if (this.editmode) {
            this.displayInvoiceDetails = false;
            this.displayInvoice = true;
        } else
            this.displayInvoiceDetails = false;
    }

    calculateInvoiceTotal(): void {
        //const invoice: IInvoiceDetails[] = this.addinvoices.value;invoiceAmount
        let sum: number = 0;

        this.facilityDetailsForm.controls["invoiceAmount"].setValue(0);
        //this.invoiceInfo.controls["invoiceAmount"].setValue(0);
        for (let i = 0; this.invoiceTable.length > i; i++) {
            sum = +sum + +(ConvertString.TO_NUMBER(this.invoiceTable[i].invoiceAmount));
        }
        this.facilityDetailsForm.controls["invoiceAmount"].setValue(sum);
        this.totalInvoiceValue = sum;
        // this.invoiceInfo.controls["invoiceAmount"].setValue(sum);
        this.productAmount = sum * (this.invoiceLimit / 100);
        let id = this.facilityDetailsForm.value.invoiceCurrencyId;
        this.getExchangeRateInvoice(id);
    }

    checkDuplicateInvoice(invoiceNo): boolean {
        //const invoice: IInvoiceDetails[] = this.addinvoices.value;
        let sum: number = 0;

        for (let i = 0; this.invoiceTable.length > i; i++) {
            if (this.invoiceTable[i].invoiceNo === invoiceNo) {
                return true;
            } else {
                return false
            }
        }
    }

    setIDValidation() {
        this.facilityDetailsForm.get('invoiceAmount').setValidators(Validators.required);

        this.facilityDetailsForm.get('lcyInvoiceValue').setValidators(Validators.required);
        this.facilityDetailsForm.get('contractExpiryDate').setValidators(Validators.required);
        this.facilityDetailsForm.get('contractDate').setValidators(Validators.required);
    }

    switchForms() {
        this.isProductProgram = false;
        this.resetFacilityTypes()
        switch (+this.productClassId) {

            case this.INVOICE_DISCOUNTING:
                // this.InitfacilityDetailsForm();
                this.setIDValidation();
                this.isProductProgram = true;
                this.facilityDetailsForm.get('tenorModeId').setValue(2);
                this.displayInvoiceDiscounting = true; break;
            case this.FIRST_EDUCATION:
                // this.InitfacilityDetailsForm();
                this.isProductProgram = true;
                this.displayFirstEdu = true; break;
            case this.FIRST_TRADERS:
                this.isProductProgram = true;
                this.displayFirstTraders = true; break;
            case this.BOND_AND_GUARANTEES:
                this.isProductProgram = true;
                this.displayBondAndGuarantees = true; break;
            case this.IMPORT_FINANCE:
                // this.InitfacilityDetailsForm();
                this.isProductProgram = true;
                this.projectName = "Total Invoice Amount (NGN)"
                this.displayImportFinance = true; break;

        }
    }

    resetFacilityTypes() {

        this.displayInvoiceDiscounting = false;
        this.displayFirstEdu = false;
        this.displayFirstTraders = false;
        this.displayBondAndGuarantees = false;
    }

    tenorType: any[] = []

    loadDropdowns() {
        this.getAccountOwner();
        this.GetFilteredSubsector();
        this.getAllCustomerAccount(this.customerId)
        this.getAllPrincipal();
        this.getfacilityTypes();
        this.GetFilteredProducts();
        this.getAllLoanDetailReviewTypes();
        this.getAllApprovedCycles();
        this.getAllPropertyTypes();
        this.tenorType = TenorType.list;
        this.loanAppService.getSector().subscribe((response) => {
            this.sector = response.result;
        });
        this.loanAppService.getSubSector().subscribe((response) => {
            this.subsector = response.result;
        });

        this.loanAppService.getAllCRMSFundingSource().subscribe((response) => {
            this.crsmFundingSource = response.result;
        });
        this.loanAppService.getAllCRMSRepaymentSource().subscribe((response) => {
            this.crsmRepaymentSource = response.result;
        });
        this.loanAppService.getAllSyndicationType().subscribe((response) => {
            this.syndicationTypes = response.result;
        });
        this.productService.getProductPriceIndex().subscribe((res) => {
            this.productPriceIndexes = res.result;
        });


    }

    getAllLoanDetailReviewTypes() {
        this.loadingSrv.show();
        this.loanReviewTypes = [];
        this.loanAppService.getAllLoanDetailReviewTypes().subscribe((response) => {
            this.loadingSrv.hide();
            this.loanReviewTypes = response.result;
        }, (err: HttpErrorResponse) => {

        });
    }

    getAllApprovedCycles() {
        this.loadingSrv.show();
        this.approvedCycles = [];
        this.loanAppService.getAllApprovedCycles().subscribe((response) => {
            this.loadingSrv.hide();
            this.approvedCycles = response.result;
        }, (err: HttpErrorResponse) => {

        });
    }

    getAllPrincipal() {
        this.loanAppService.getLoanPrincipals()
            .subscribe((response) => {
                this.principal = response.result;

            }, (err) => {

            });
    }

    ClickDone() {
        this.activeBondForm = false;
        this.facilityDetailsData.emit(this.loanApplicationDetails);
        this.loanApplicationDetails = [];
    }

    feesCollection: IProductFees[];

    feesData(event: IProductFees[]) {
        this.feesCollection = [];

        for (let i = 0; event.length > i; i++) {
            let body = {
                feeId: event[i].feeId,
                feeName: event[i].feeName,
                rate: event[i].rate,
            }
            this.feesCollection.push(body);
            // console.log('feesCollection', this.feesCollection);
        }

    }

    facilityDetails() {

        if (this.loanTypeId.toString() !== "undefined" || this.loanTypeId > 0) {
            this.groupMembers = [];

            let newCustomerinfo: any = {}
            this.newCustomerinfo

            if (+this.loanTypeId == 2) {
                this.customerNameOrGroup = "Group Members";
                this.CustomerGroupSer.getGroupsMembers(this.customerGroupId)
                    .subscribe((response) => {
                        this.groupMembers = response.result;

                    });
            }

            if (+this.loanTypeId === 1) {
                this.customerNameOrGroup = "Customer Name";
                this.customerService.getCustomerById(this.customerId).subscribe((response) => {
                    this.groupMembers = response.result;

                }, (err: any) => {
                });
            }
        }
    }

    onSectorClassChange(id) {

        if (id == '' || id == null) {
            id = -1;
            this.filteredSubsector = [];
        }

        this.selectedProductClassId = id;
        if (this.subsector == null || this.subsector == undefined) {
            return;
        }
        this.filteredSubsector = this.subsector.length > 0 ? this.subsector.filter(x => x.sectorId == +id) : [];
        this.getSectorLimit(id);
    }

    getAccountOwner() {
        this.accountOwner.push({ name: 'Owner Account', value: 1 });
        this.accountOwner.push({ name: 'Third Party Account', value: 2 });
    }

    setCurrency(exchangeRate: string, exchangeAmount: number, IsBaseCurrency: boolean): void {
        this.facilityDetailsForm.patchValue({
            exchangeRate: exchangeRate,
            exchangeAmount: exchangeAmount
        });
    }

    onProductPriceIndexChanged(id: number) {
        const row = this.productPriceIndexes.find(x => x.productPriceIndexId == id);
        const productPriceIndexRate = row.priceIndexRate != undefined ? +ConvertString.ToNumberFormate(row.priceIndexRate) : null;
        const productPriceIndexSpread = +this.facilityDetailsForm.get('productPriceIndexSpread').value;
        this.facilityDetailsForm.get('productPriceIndexRate').setValue(productPriceIndexRate);
        const interestRate = productPriceIndexRate + productPriceIndexSpread;
        this.facilityDetailsForm.get('proposedInterestRate').setValue(interestRate);

    }

    racOperationId: number;
    selectedflow: any;
    racSearchBaseId: any;
    searchBasePlaceholder: any;
    onFlowChange(id) {
        if (id != null && id != 0) {
            // this.racSearchBaseId = RacSearchBaseEnum.CREDITCARD;
            //this.searchBasePlaceholder = "CREDITCARD";
        }


        this.selectedflow = this.facilityApplicationSpecialProcessFlow.filter(x => x.flowchangeId == id)[0];
        this.racOperationId = this.selectedflow != null ? this.selectedflow.operationId : null;
        // if(this.selectedflow != null && id != CreditcardTypeEnum.CLEANCARD)  { 
        //    this.UpdateCardTypeAndCurrency(id); 
        // }

        // if(id == CreditcardTypeEnum.CLEANCARD && this.selectedflow != null) { 
        //     this.racOperationId = this.selectedflow.operationId; 
        //    this.racCurrencyId = null;
        //    this.UpdateCardTypeAndCurrency(this.racCurrencyId);
        // }
    }

    // UpdateCardTypeAndCurrency(currencyId) {
    //     if (this.selectedflow == null || this.selectedflow == undefined) {
    //         return;
    //     }
    //     // if(this.selectedflow.flowchangeId !== CreditcardTypeEnum.CLEANCARD) {
    //     //     this.racCurrencyId = currencyId;
    //     // } 
    //     // else this.racCurrencyId = null;

    //     this.racOperationId = this.selectedflow != null ? this.selectedflow.operationId : null;
    // }

    currencyValidation: boolean;
    onCurrencyChanged(id: number) {
        // alert("selected currency Id is " + id);

        // if(id > 0) { 
        // if(this.selectedflow.flowchangeId == CreditcardTypeEnum.CLEANCARD){ 
        //     //this.currencyValidation = true;
        //    // this.UpdateCardTypeAndCurrency(id);
        //     this.racCurrencyId = null;
        // } 
        // else this.racCurrencyId =  this.currencyId ;

        // }
        this.currencyId = this.racCurrencyId = id;
        // this.UpdateCardTypeAndCurrency(id);

        if (this.displayInvoiceDiscounting == false) {
            const principalIdControl = this.facilityDetailsForm.get('principalId');
            // principalIdControl.setValidators(Validators.required);
            principalIdControl.clearValidators();
            principalIdControl.updateValueAndValidity();
        }

        this.proposedAmount = this.facilityDetailsForm.get('proposedAmount').value;
        this.getExchangeRate(id);

        //     if (proposedamount!=null)
        //     {
        //         this.getExchangeRate(id);
        //         this.getProductPriceIndexes(id);
        //         this.selectedCurrencyId = id;
        //     }
        //     else{
        // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Kindly Enter Amount Before Selecting Currency', 'warning');
        // this.facilityDetailsForm.get('currencyId').setValue('');            }
    }

    getProductPriceIndexes(id: number) {
        if (id == undefined || id == null) {
            this.productPriceIndexes = [];
        } else {
            this.productService.getProductPriceIndexByProductId(id)
                .subscribe((res) => {
                    this.productPriceIndexes = res.result;
                });
        }
    }

    getExchangeRate(id: number) {
        if (id != undefined || id != null)
            this.exchangeValue = 0;
        if (id == undefined || id == null || isNaN(id)) {
            return;
        }
        this.loanAppService.getExchangeRate(id)
            .subscribe((res) => {
                this.exchange = res.result;

                if (this.exchange != undefined && this.exchange.sellingRate != undefined) {
                    const principalAmount: number = ConvertString.TO_NUMBER(this.proposedAmount);
                    this.exchangeValue = +principalAmount * this.exchange.sellingRate;
                    this.IsBaseCurrency = this.exchange.isBaseCurrency;
                    this.setCurrency(this.exchange.sellingRate, this.exchangeValue, this.IsBaseCurrency)
                    this.exchangeRate = this.exchange.sellingRate;
                    if (this.sellingRate == 1) this.IsBaseCurrency = true;
                    if (this.IsBaseCurrency)
                        this.exchangeRate = "1";
                }

            }, (err) => {
                this.loadingSrv.hide();
            });
    }

    dayCount: number;
    invoicefuturedate: boolean = false;

    checkDocumentValidity() {
        const inv = this.invoiceInfo.value;
        let invoiceDate = new Date(inv.invoiceDocDate);
        let todayDate = new Date();
        var daysCount = this.dateUtilService.dateDiff(invoiceDate, todayDate);
        if (daysCount > 60) {
            this.invoiceInfo.reset();
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Invoice issuance date bridged invoice validity.', 'error');
        } else if (daysCount < 0) {
            this.invoiceInfo.reset();
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Invoice issuance date cannot be a future date.', 'error');
        }
        // const inv = this.invoiceInfo.value;
        // let data = {
        //     productId: this.proposedProductId,
        //     date: inv.invoiceDocDate
        // }
        // this.loanAppService.documentDateValidation(data)
        //     .subscribe((response) => {
        //         this.invoicefuturedate = false
        //         this.invoiceStatus = true;
        //         let data = response.result;
        //         if (data.dayCount < 0) this.invoicefuturedate = true;
        //         if (!data.invoiceStatus > data.dayInterval) this.invoiceStatus = false;
        //         this.dayInterval = data.dayInterval;
        //     });
    }

    getCurrenciesbyProduct(id) {
        this.currencyService.getAllCurrenciesbyProduct(id).subscribe((res) => {
            this.currencies = res.result;
            this.facilityDetailsForm.controls["currencyId"].setValue(this.currencyId);
            this.onCurrencyChanged(this.currencyId);
        }, (err) => {
        });
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.allowedCurrencies = res.result;
        }, (err) => {
        });
    }

    getAllExchangeRates() {
        this.loadingSrv.show();
        this.exchangeServ.get().subscribe((res) => {
            this.loadingSrv.hide();
            this.allExchangeRates = res.results;
        }, (err: HttpErrorResponse) => {
            this.showMessage(err.message, 'error', 'FintrakBanking');
        })
    }

    GetFilteredProducts() {
        this.filteredProducts = [];
        this.loadingSrv.show();
        this.productService.getAllProductsByProductClassAndCustomerType(this.productClassId, this.customerTypeId1).subscribe((response) => {
            //this.productService.getAllProductsByProductClassAndCustomerType(this.productClassId, 2).subscribe((response) => {
            this.loadingSrv.hide();
            this.filteredProducts = response.result;

            if (this.filteredProducts != null) {
                this.filteredProducts = this.filteredProducts.filter(x => x.usedByLos == true).sort();
            }
            //this.onProductChange(this.selectedProductId)
        });
    }

    GetFilteredSubsector() {
        this.filteredSubsector = [];
        this.loanAppService.getSubSector().subscribe((response) => {
            this.filteredSubsector = response.result;
        });
    }

    getfacilityTypes() {
        this.facilityTypes = [];
        this.loanService.getLoanTypes().subscribe((response) => {
            this.facilityTypes = response.result;
        });
    }

    getAllCustomerAccount(customerId: number) {
        this.casaService.getAllCustomerAccountByCustomerId(customerId)
            .subscribe((response) => {
                this.customerAccount = response.result;
                if (this.customerAccount.length <= 0) {
                    const operatingAccountId = this.facilityDetailsForm.controls['operatingCasaAccountId'];
                    operatingAccountId.clearValidators();
                    operatingAccountId.updateValueAndValidity();
                }

            });
    }

    getCustomerDetails(customerId: number) {
        const operatingAccountId = this.facilityDetailsForm.controls['operatingCasaAccountId'];
        this.customerService.getCustomerById(customerId)
            .subscribe((response) => {
                if (response.success) {
                    this.customer = response.result;
                    //console.log("this.customer:", this.customer);

                    if (this.customer.isprospect == true) {
                        operatingAccountId.clearValidators();
                        operatingAccountId.updateValueAndValidity();
                    }
                }
            });
    }

    customerTypeId: number;
    customerTypeName: string;
    selectedCustomerId: number;

    OnGroupCustomerChange(customerId) {
        let customer: any = {};
        this.selectedCustomerId = customerId
        this.getAllCustomerAccount(customerId);
        // this.getAllCustomerAccount(parseInt(customerId));
        // tslint:disable-next-line:radix
        customer = this.groupMembers.find(x => x.customerId === parseInt(customerId));

        this.selectedCustomer = customer.customerName;
        this.customerTypeId = customer.customerTypeId;
        this.customerTypeName = customer.customerType + ` Customer`;


    }

    productLimit: number;
    expiryPeriod: number;
    specifyAccountNumber: boolean = false;
    requiredEquity: number;

    setEquityValidators() {
        let control = this.facilityDetailsForm.controls['equityAmount'];
        control.setValidators([Validators.required, ValidateGreaterThanZero]);
        let control3 = this.facilityDetailsForm.controls['totalAmountRequired'];
        control3.setValidators([Validators.required]);
    }

    isProductContingent(id): boolean {
        if (isNullOrUndefined(this.filteredProducts) || this.filteredProducts.length == 0) {
            return;
        }
        return (this.filteredProducts.find(p => p.productId == id).productTypeId == ProductTypeEnum.ContingentLiability);
    }

    onProductChange(id) {
        
        if (id == undefined || id == null || id == 0) return;
        this.isContingent = false;
        this.facilityDetailsForm.get('proposedInterestRate').setValidators(Validators.required);
        this.facilityDetailsForm.get('repaymentScheduleId').setValidators(Validators.required);
        this.facilityDetailsForm.get('interestRepaymentId').setValidators(Validators.required);

        this.facilityDetailsForm.get('proposedInterestRate').updateValueAndValidity();
        this.facilityDetailsForm.get('repaymentScheduleId').updateValueAndValidity();
        this.facilityDetailsForm.get('interestRepaymentId').updateValueAndValidity();

        if (this.isProductContingent(id)) {
            this.isContingent = true;
            this.facilityDetailsForm.get('proposedInterestRate').setValidators(null);
            this.facilityDetailsForm.get('repaymentScheduleId').setValidators(null);
            this.facilityDetailsForm.get('interestRepaymentId').setValidators(null);

            this.facilityDetailsForm.get('proposedInterestRate').updateValueAndValidity();
            this.facilityDetailsForm.get('repaymentScheduleId').updateValueAndValidity();
            this.facilityDetailsForm.get('interestRepaymentId').updateValueAndValidity();
        }

        if (this.productClassId == ProductClassEnum.CREDITCARD) {
            this.racSearchBaseId = RacSearchBaseEnum.CREDITCARD;

        }
        if (this.productClassId != ProductClassEnum.CREDITCARD) {

            this.racSearchBaseId = RacSearchBaseEnum.PRODUCT;
            //racProductClassId
            //this.searchBasePlaceholder = "PRODUCTCLASS";
        }
       

        //this.getRacCategoryTeirs(id); // GET RAC CATEGORY TEIRS
        this.proposedProductId = id;
        let productAttributes: any = {};
        this.displaySyndicatedLoan = false;
        this.syndicationDetailList = [];
        this.syndicationAmountContribution = 0;
        this.selectedCustomerId = this.customerId
        if (id != '') {
            this.getCurrenciesbyProduct(id);
            this.disableControl = true;
            this.isInvoiceBased = false;
            this.disableControl = true;
            productAttributes = this.filteredProducts.find(x => x.productId == +id);

            if (productAttributes != null) {
                this.expiryPeriod = productAttributes.expiryPeriod
                this.requireEquityContribution = productAttributes.equityContribution;
                this.isLineFacility = productAttributes.isFacilityLine;
                this.facilityDetailsForm.controls["isLineFacility"].setValue(this.isLineFacility);
                this.facilityDetailsForm.get("productPriceIndexSpread").setValue(productAttributes.productPriceIndexSpread);
                if (productAttributes.equityContribution > 0) {
                    this.setEquityValidators();
                    this.requiredEquity = productAttributes.equityContribution
                }
                if (!productAttributes.allowRate) {
                    this.maximumRate = productAttributes.maximumRate !== null ? productAttributes.maximumRate : 0;
                    // this.minimumRate = productAttributes.minimumRate !== null ? productAttributes.minimumRate : this.minimumRate;
                }
                this.productTenor = productAttributes.maximumTenor;
                if (this.editMode == false) {
                    this.facilityDetailsForm.patchValue({
                        proposedTenor: productAttributes.maximumTenor,
                        proposedInterestRate: productAttributes.maximumRate
                    });
                }

                if (productAttributes.productPriceIndexSpread != null) {
                    this.facilityDetailsForm.get("productPriceIndexSpread").setValue(productAttributes.productPriceIndexSpread);
                }

                this.validateSpecialWorkflowDetailControl();
                this.isFeeEditable == true;
                // if(productAttributes.productClassProcessId == ProductClassProcessEnum.FAM) //this.feesCollection.length
                // {this.isFeeEditable == false;}
                this.loadingSrv.show();
                this.loanAppService.getRevisedProcessFlowByProductClassId(productAttributes.productClassId, productAttributes.productId, productAttributes.productTypeId).subscribe((res) => {
                    if (res.success) {
                        this.facilityApplicationSpecialProcessFlow = res.result;
                    }
                    this.loadingSrv.hide();
                }, (err) => {
                    this.loadingSrv.hide(1000);
                });

            }


            if (id == 184) {
                this.displaySyndicatedLoan = true;
            }

            this.loadingSrv.show();
            this.productService.getProductPriceIndexByProductId(id).subscribe((res) => {
                if (res.result != undefined) {
                    const data = res.result
                    let indexRate = data.priceIndexRate != undefined ? ConvertString.ToNumberFormate(data.priceIndexRate) : null;
                    this.facilityDetailsForm.patchValue({
                        productPriceIndexId: data.productPriceIndexId,
                        productPriceIndexRate: indexRate
                    });
                }
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide(1000);
            });

            this.getProductBehaviourByProductId(id);

            this.validateIsInvoiceBasedProduct(this.isInvoiceBased);
            this.validateSyndicationDetailControl(this.displaySyndicatedLoan);
        }

        // const operatingAccountId = this.facilityDetailsForm.controls['operatingCasaAccountId'];
        // if (this.customer.isprospect == true) {
        //     operatingAccountId.clearValidators();
        //     operatingAccountId.updateValueAndValidity();
        // }

        if (this.displayInvoiceDiscounting == true) {
            const principalIdControl = this.facilityDetailsForm.get('currencyId');
            principalIdControl.setValidators(Validators.required);
            //principalIdControl.clearValidators();
            principalIdControl.updateValueAndValidity();
            this.facilityDetailsForm.get('currencyId').setValue('');
        }
    }



    validateSyndicationDetailControl(isSyndicationLoan) {
        const syndicationRefNoControl = this.facilityDetailsForm.get('field1');
        const syndicationNameControl = this.facilityDetailsForm.get('field2');
        const syndicationAmountControl = this.facilityDetailsForm.get('field3');

        if (isSyndicationLoan === true) {
            syndicationRefNoControl.setValidators(Validators.required);
            syndicationNameControl.setValidators(Validators.required);
            syndicationAmountControl.setValidators(Validators.required);
        } else {
            syndicationRefNoControl.clearValidators();
            syndicationNameControl.clearValidators();
            syndicationAmountControl.clearValidators();
        }
        syndicationRefNoControl.updateValueAndValidity();
        syndicationNameControl.updateValueAndValidity();
        syndicationAmountControl.updateValueAndValidity();

    }

    validateIsInvoiceBasedProduct(isInvoiceBased) {
        const contractDateControl = this.facilityDetailsForm.get('contractDate');
        const contractExpiryDateControl = this.facilityDetailsForm.get('contractExpiryDate');
        const principalIdControl = this.facilityDetailsForm.get('principalId');
        const invoiceCurrencyIdControl = this.facilityDetailsForm.get('invoiceCurrencyId');
        if (isInvoiceBased === true) {
            contractDateControl.setValidators(Validators.required);
            contractExpiryDateControl.setValidators(Validators.required);
            //principalIdControl.setValidators(Validators.required);
            invoiceCurrencyIdControl.setValidators(Validators.required);
        } else {
            contractDateControl.clearValidators();
            contractExpiryDateControl.clearValidators();
            //principalIdControl.clearValidators();
            invoiceCurrencyIdControl.clearValidators();
        }
        contractDateControl.updateValueAndValidity();
        contractExpiryDateControl.updateValueAndValidity();
        // principalIdControl.updateValueAndValidity();
        invoiceCurrencyIdControl.updateValueAndValidity();

    }

    getFlowId(isChecked) {
        this.refreshFlowChanges();

        // var initialValue = this.facilityDetailsForm.value.flowchangeId;
        this.facilityDetailsForm.controls['flowchangeId'].setValue(null); //in case but it's redundant

        if (isChecked) {
            var id = this.facilityApplicationSpecialProcessFlow[0].flowchangeId;
            this.facilityDetailsForm.controls['flowchangeId'].setValue(id);
        }
        else {
            // this.facilityDetailsForm.controls['flowchangeId'].setValue(initialValue == 'undefined' ? null : initialValue); 
            this.facilityDetailsForm.controls['flowchangeId'].setValue(null);
        }
    }

    isOperationbased: boolean = false;
    getCashedBackedCollateralFlowId(isChecked) {
        this.refreshFlowChanges();

        this.facilityDetailsForm.controls['flowchangeId'].setValue(null);
        // console.log('operation rac check here',this.cashCollaterizedProcessFlow);


        if (isChecked == true) {
            var id = this.cashCollaterizedProcessFlow.flowchangeId;
            this.facilityDetailsForm.controls['flowchangeId'].setValue(id);
            this.racOperationId = this.cashCollaterizedProcessFlow.operationId;
            if (this.cashCollaterizedProcessFlow.hasOperationBasedRac) { //console.log('has operation based rac', true);
                this.isOperationbased = true;
            }
        }
        else {
            if (this.productClassProcessId == ProductClassProcessEnum.FAM) {
                this.isOperationbased = false;
                this.racOperationId = null;
            }
            this.facilityDetailsForm.controls['flowchangeId'].setValue(null);

        }
        // console.log('flowchangeId', this.facilityDetailsForm.controls['flowchangeId'].value);
    }

    isAgricRac: boolean = false;
    getRacType(isChecked) {
        if (isChecked == true) {
            this.isAgricRac = true;
        }
        else {
            this.isAgricRac = false;
        }
    }

    isIBLRequest: boolean = false;
    getIBL(isChecked) {
        
        if (isChecked == true) {
            this.isIBLRequest = true;
            this.facilityDetailsForm.controls["iblRequest"].setValue(this.isIBLRequest);
           
        }
        else {
            this.isIBLRequest = false;
            this.facilityDetailsForm.controls["iblRequest"].setValue(this.isIBLRequest);
          
        }
    }

    validateSpecialWorkflowDetailControl() {
        const flowchangeId = this.facilityDetailsForm.get('flowchangeId');
        if (this.facilityApplicationSpecialProcessFlow.length > 1) {
            flowchangeId.setValidators(Validators.required);

        } else {
            flowchangeId.clearValidators();
        }
        flowchangeId.updateValueAndValidity();
    }

    racCustomerId: number;
    isInvoiceFormValide(): boolean {
        let inv: any = {}
        inv = this.invoiceDiscountingForm.get("addinvoices").value
        return (inv.invoiceNo == "" || inv.invoiceDate == null || inv.invoiceAmount == "" || !this.invoiceStatus || this.documentNoStatus);
    }


    async submitLoan(rac) {

        await this.getExtendedFormItems();
        const loan = this.loanApplication;
        if (this.displayInvoiceDiscounting == true) {
            if (this.productAmount < this.loanApplicationDetail.proposedAmount) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than 70% Invoice amount', 'error');
                return;
            }
        }


        if (this.newLoanApplicationId > 0) this.loanApplicationId = this.newLoanApplicationId;
        let loanDetail: any[] = [];
        loanDetail.push(this.loanApplicationDetail);
        var exclusiveRecord = loanDetail.find(x => x.flowchangeId > 0);
        this.loanApp = {
            loanApplicationDetailId: this.selectedDetailId,
            loanApplicationId: this.loanApplicationId,
            applicationReferenceNumber: this.ApplicationRef,
            //casaAccountId: loan.casaAccountId,
            customerAccount: loan.customerAccount,
            customerGroupId: loan.customerGroupId,
            customerId: loan.customerId,
            customerName: loan.customerName,
            customerTypeId: loan.customerTypeId,
            isInvestmentGrade: loan.isInvestmentGrade,
            // loanPreliminaryEvaluationId: loan.loanPreliminaryEvaluationId,
            loanInformation: loan.loanInformation,
            loanApplicationDetail: loanDetail,
            loanTypeId: loan.loanTypeId,
            requireCollateral: this.requireCollateral != true ? this.requireCollateral : loan.requireCollateral,
            relationshipManagerId: loan.relationshipManagerId,
            relationshipOfficerId: loan.relationshipOfficerId,
            productClassId: loan.productClassId,
            proposedAmount: loan.proposedAmount,
            proposedTenor: loan.proposedTenor,
            tenorMode: loan.tenorMode,
            regionId: loan.regionId,
            requireCollateralTypeId: loan.requireCollateralTypeId,
            isNewApplication: true,
            isFirstTime: false,
            editMode: this.editMode,
            loantermSheetId: loan.loantermSheetId,
            rac: rac,
            flowchangeId: (exclusiveRecord != null && exclusiveRecord != undefined && exclusiveRecord.flowchangeId != 0) ? exclusiveRecord.flowchangeId : null,
            iblRequest: this.isIBLRequest
        }

        this.loadingSrv.show();
        this.loanAppService.saveApplication(this.loanApp).subscribe((response) => {
            this.loadingSrv.hide();
            if (response.success == true) {
                if (this.editMode) {
                    this.updateSuccessful('updated'); return;
                }
                else {

                    var __this = this;

                    if (response.result.failedRacStartCam == true) {
                        // this.showRacResult = true;
                        swal({
                            title: 'Customer did not meet RAC!',
                            // text: `Do you want to write a ${this.CAMORFAM} for this application?`,
                            text: `Kindly re-initiate and choose FAM instead`,
                            // type: 'question',
                            type: 'error',
                            showCancelButton: false,
                            // showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            // confirmButtonText: 'Yes',
                            confirmButtonText: 'OK',
                            cancelButtonText: 'No, cancel!',
                            confirmButtonClass: 'btn btn-success btn-move',
                            cancelButtonClass: 'btn btn-danger',
                            buttonsStyling: true,

                        }).then(function () {

                            // __this.GetRacResult();
                            // __this.showRacResult = true;
                            // __this.loanApplicationFlowChange(response.result.loanApplicationId);
                            __this.DeleteLoanApplicationThatFailedRAC(response.result.loanApplicationDetailId)

                        }, function (dismiss) {
                            if (dismiss === 'cancel') {
                                __this.DeleteLoanApplicationThatFailedRAC(response.result.loanApplicationDetailId)

                            }
                        });
                        __this.GetRacResult();
                        __this.showRacResult = true;
                    } else {
                        __this.showRacResult = false;
                        __this.updateSuccessful('added'); return;
                    }

                }
                /*let loanApp = response.result.loanApplicationDetail;
                this.loanApplicationId = loanApp.loanApplicationId;

                this.loanApplicationDetails = []; 
                this.syndicationDetailList = [];
                for (let i = 0; loanApp.length > i; i++) {
                    this.loanApplicationId = loanApp[i].loanApplicationId;
                    this.newLoanApplicationId = loanApp[i].loanApplicationId;
                    this.ApplicationRef == loanApp[i].applicationReferenceNumber;
        

            
                    this.loanApplicationDetails.push(loanApp[i]);
                }
                this.resetForm()
                swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/> Loan Application Added<b>', 'success');
                this.loadingSrv.hide();*/
            }
            else {
                if (response.message.includes('Exceptional Workflow')) {
                    this.loanApp = null;
                    this.closeFacilityDetails();
                }

                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(response.message), 'error');
                //this.loadingSrv.hide();
            }
        }, (response) => {
            this.showMessage(response.message, 'error', 'FintrakBanking');
        });
        //   this.loanDetails = [];

    }

    GetRacResult() {
        this.loadingSrv.show();
        this.loanAppService.getRacDetails(this.selectedDetailId).subscribe((res) => {
            this.loadingSrv.hide();
            if (res.success == true) {
                this.racApplicationSpecialProcessFlow = res.result;
            }
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
        this.showRacResult = true;
    }

    updateSuccessful(action) {
        this.resetForm()
        this.activeBondForm = false;
        this.loadingSrv.hide();
        this.loanApplicationDetails = [];
        this.refreshDetailsGrid.emit(1);
        swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/> Loan Application ' + action + '<b>', 'success');
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    addFacilityDetails() {
        this.addDefaultFacilityDetails();
        //this.submitLoan();
        this.submitEvent++;
    }

    // checkTargetAmount(usedAmount: number): number {
    //     if (usedAmount > this.maximumAmount) {
    //         this.facilityDetailsForm.patchValue({
    //             exchangeRate: 0,
    //             exchangeAmount: 0,
    //             currencyId: this.currencyId,
    //             customerId: this.customerId

    //         });

    //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Maximum Amount Exceeded', 'info');
    //         return 0;
    //     }
    //     else {
    //         this.utilizedAmount += +this.pAmount;
    //         return this.utilizedAmount;
    //     }
    // }

    getInvoiceTable(data): any {
        const fd = this.facilityDetailsForm.value;
        let invoiceData: IInvoiceDetails[] = [];

        for (let i = 0; this.invoiceTable.length > i; i++) {
            let invoice: IInvoiceDetails = {
                contractNo: this.invoiceTable[i].contractNo,
                principalId: fd.principalId,
                invoiceNo: this.invoiceTable[i].invoiceNo,
                invoiceDate: this.invoiceTable[i].invoiceDate,
                invoiceAmount: this.invoiceTable[i].invoiceAmount,
                invoiceCurrencyId: fd.invoiceCurrencyId,
                contractEndDate: fd.contractExpiryDate,
                contractStartDate: fd.contractDate,
                invoiceDocument: '',
                purchaseOrderNumber: this.invoiceTable[i].purchaseOrderNumber, //fd.purchaseOrderNumber,
                certificateNumber: this.invoiceTable[i].certificateNumber,
                reValidated: this.invoiceTable[i].reValidated,
                entrySheetNumber: this.invoiceTable[i].entrySheetNumber,
            }
            invoiceData.push(invoice);
        }
        return invoiceData;
    }

    loanApplicationDetail: ILoanApplicationDetail;

    addDefaultFacilityDetails() {
     
        const fd = this.facilityDetailsForm.value;
        let custId: number = +fd.customerId
        let iblResquest = this.isIBLRequest;
        let custname = this.groupMembers.find(x => x.customerId == custId);
        const currencyCode = this.allowedCurrencies.find(d => d.currencyId === +fd.currencyId).currencyCodeName;
        const productName = this.filteredProducts.find(x => x.productId === +fd.proposedProductId).productName;
        const pAmount: number = +ConvertString.TO_NUMBER(fd.proposedAmount);
        const usedAmount: number = +this.utilizedAmount + (+pAmount);
        const invoiceDetails: IInvoiceDetails[] = this.getInvoiceTable(fd)

        if (this.displayInvoiceDiscounting == true) {
            if (fd.principalId = null || fd.principalId <= 0) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please select principal to continue', 'error');
                return;
            }
        }

        this.loanApplicationDetail = {
            loanApplicationDetailId: 0,
            customerId: fd.customerId,
            customerName: custname.customerName,
            proposedProductId: fd.proposedProductId,
            proposedProductName: productName,
            proposedTenor: fd.proposedTenor,
            tenorModeId: fd.tenorModeId,
            proposedInterestRate: fd.proposedInterestRate,
            proposedAmount: ConvertString.TO_NUMBER(fd.proposedAmount),
            currencyId: fd.currencyId,
            currencyName: currencyCode,
            exchangeRate: fd.exchangeRate,
            exchangeAmount: fd.exchangeAmount,
            subSectorId: fd.subSectorId,
            sectorId: fd.sectorId,
            productClassId: this.productClassId,
            loanPurpose: fd.loanPurpose,
            repaymentTerm: fd.repaymentTerm,
            repaymentScheduleId: fd.repaymentScheduleId,

            interestRepaymentId: fd.interestRepaymentId,
            interestRepayment: fd.interestRepayment,
            isMoratorium: fd.isMoratorium,
            moratorium: fd.moratorium,

            isTakeOverApplication: fd.isTakeOverApplication,
            isLineFacility: fd.isLineFacility,
            approvedLineLimit: fd.approvedLineLimit,
            loanDetailReviewTypeId: fd.loanDetailReviewTypeId,
            approvedTradeCycleId: fd.approvedTradeCycleId,
            operatingCasaAccountId: fd.operatingCasaAccountId,
            fieldOne: fd.field1,
            fieldTwo: fd.field2,
            fieldThree: fd.field3,
            productPriceIndexId: fd.productPriceIndexId,
            productPriceIndexRate: fd.productPriceIndexRate,
            productPriceIndexSpread: fd.productPriceIndexSpread,
            crmsFundingSourceId: fd.crmsFundingSourceId,
            crmsPaymentSourceId: fd.crmsPaymentSourceId,
            invoiceDetails: invoiceDetails,
            productFees: this.feesCollection,
            traderLoan: this.traderLoan,
            educationLoan: this.educationLoan,
            bondDetails: this.bondDetails,
            syndicatedLoan: this.syndicationDetailList,
            casaAccountId: fd.casaAccountId,
            flowchangeId: fd.flowchangeId,
            oldApplicationRefForRenewal: fd.oldApplicationRefForRenewal,
            iblRequest: this.isIBLRequest,
            propertyTypeId: fd.propertyTypeId,
            propertyTitle: fd.propertyTitle,
            propertyPrice: fd.propertyPrice,
            downPayment: fd.downPayment

        }

        this.loanDetails.push(this.loanApplicationDetail);
        // this.loanApplicationDetails.push(loanApplicationDetail);

        if (this.displayBondAndGuarantees) this.resetBondAndGuarantees = true;

        this.IsBaseCurrency = false;
        if (this.displayFirstTraders) this.resetFirstTraders = true
        this.exchangeValue = 0;
    }

    resetForm(): void {
        this.facilityDetailsForm.reset();

        this.facilityDetailsForm.patchValue({
            exchangeRate: 0,
            exchangeAmount: 0,
            productClassId: this.productClassId,
            currencyId: this.currencyId,
            customerId: this.customerId,
            tenorModeId: 1
        });
    }
    // currencyId: [this.currencyId, Validators.required],
    // customerId: [this.customerId, Validators.required],

    removeApplicatiionDetailsItem(evt, indx) {
        evt.preventDefault();

        const currRecord = this.loanApplicationDetails[indx];
        this.loadingSrv.show();
        this.loanAppService.deleteApplication(currRecord.loanApplicationDetailId).subscribe((x) => {
            this.loadingSrv.hide();
            if (x.result) {

                this.TotalAmount -= currRecord.exchangeAmount;
                this.utilizedAmount -= currRecord.exchangeAmount;
                this.facilityDetailsForm.get('invoiceAmount').setValue(this.TotalAmount);
                // if (currRecord.proposedTenor === this.MaximumTenor) {
                //     //    this.MaximumTenor = loanApplicationDetails.proposedTenor;
                // }
                this.loanApplicationDetails.splice(indx, 1);
            }
        })

    }

    InitfacilityDetailsForm() {
        this.loanApplicationId = this.loanApplication.loanApplicationId;
        this.facilityDetailsForm = this.fb.group({
            proposedAmount: ['', Validators.required],
            proposedInterestRate: ['', Validators.required],
            proposedTenor: ['', Validators.compose([Validators.required, ValidationService.positiveValue])],
            proposedProductId: ['', Validators.required],
            flowchangeId: ['', Validators.required],
            sectorId: ['', Validators.required],
            subSectorId: ['', Validators.required],
            currencyId: ['1', Validators.required],
            customerId: [this.loanApplication.customerId, Validators.required],
            productClassId: [this.productClassId, Validators.required],
            exchangeRate: [0, Validators.required],
            exchangeAmount: [0, Validators.required],
            loanPurpose: ['', Validators.required],
            repaymentTerm: [''],
            repaymentScheduleId: ['', Validators.required],

            interestRepayment: [''],
            interestRepaymentId: ['', Validators.required],
            isMoratorium: [false],
            moratorium: [''],

            isTakeOverApplication: [false],
            isLineFacility: [false],
            approvedLineLimit: '',
            loanDetailReviewTypeId: ['', Validators.required],
            approvedTradeCycleId: ['', Validators.required],
            operatingCasaAccountId: [''],
            field1: [''],
            field2: [''],
            field3: [''],
            productPriceIndexId: [''],
            productPriceIndexRate: [''],
            productPriceIndexSpread: [''],
            crmsFundingSourceId: ['', Validators.required],
            crmsPaymentSourceId: '',
            tenorModeId: [1],
            proposedProductName: [''],
            currencyName: [''],

            subSectorName: [''],
            productLimit: [0],
            invoiceCurrencyId: ['1'],
            fcyRate: ['1'],
            loanfcyRate: ['1'],
            customerName: [''],

            addinvoices: [],
            traderLoan: [],
            educationLoan: [],
            bondDetails: [],
            casaAccountId: [''],
            principalId: [''],
            // principalId: ['', Validators.required],
            principalName: [''],

            //this.invoiceFormDefaultFacility(),
            invoiceCurrencyName: [''],
            invoiceAmount: [''],
            lcyInvoiceValue: [''],
            contractExpiryDate: [''],
            contractDate: [''],
            loanNairaEquivalent: [''],
            productFees: [],
            purchaseOrderNumber: [],
            equityAmount: [''],
            equityCasaAccountId: [''],
            totalAmountRequired: [''],
            certificateNumber: [''],
            racCategoryTypeId: [''],
            oldApplicationRefForRenewal: [''],
            iblRequest: [''],
            propertyTypeId: [''],
            propertyTitle: [''],
            propertyPrice: [''],
            downPayment: [''],
        });
    }



    addInvoice(): void {
        this.invoices.push(this.invoiceForm());
    }

    removeInvoice(evt, indx): void {
        evt.preventDefault();
        const currRecord = this.invoiceTable[indx];
        const d = ConvertString.TO_NUMBER(currRecord.invoiceAmount);
        var invValue = 0;
        if (this.productClassId === this.INVOICE_DISCOUNTING) {
            invValue = this.facilityDetailsForm.get("invoiceAmount").value;
        }
        let bal = +ConvertString.TO_NUMBER(invValue) - +d;

        this.facilityDetailsForm.controls["invoiceAmount"].setValue(bal);
        this.invoiceTable.splice(indx, 1);
        this.deleteUpload(currRecord.invoiceNo, currRecord.invoiceAmount);
    }

    onInvoiceValueBlur() {
        const invoice: any[] = this.invoices.value;
        let sum: number = 0;
        this.invoiceDiscountingForm.controls["invoiceAmount"].setValue(0);
        for (let i = 0; invoice.length > i; i++) {
            sum = sum + (ConvertString.TO_NUMBER(invoice[i].invoiceAmount));
        }
        this.invoiceDiscountingForm.controls["invoiceAmount"].setValue(sum);
    }

    principalId: number;
    checkMultipleInvoice(invoiceNo, contractNo) {
        const invoice: IInvoiceDetails[] = this.invoices.value;
        let sum: number = 0;

        for (let i = 0; invoice.length > i; i++) {
            if (invoice[i].invoiceNo == this.invoiceNo
                && invoice[i].contractNo == this.contractNumber
                && invoice[i].purchaseOrderNumber == this.purchaseOrderNumber) {
                this.invoiceDiscountingForm.controls["invoiceNo"].setValue('');
            }
        }
    }

    documentNoStatus: boolean = false; invoiceNo: string;

    CheckDocumentNoDuplication() { // TODO

        const dnd = this.invoiceInfo.value;

        if (dnd.invoiceNumber && dnd.purchaseOrderNumber && dnd.contractNumber) {
            let data = {
                productId: this.proposedProductId,
                principalId: this.principalId,
                documentNo: dnd.invoiceNumber,
                purchaseOrderNumber: dnd.purchaseOrderNumber,
                contractNumber: dnd.contractNumber,
            };

            this.loanAppService.documentNoValidation(data).subscribe((response) => {
                this.documentNoStatus = response.result.documentNoStatus;
                this.invoiceNo = response.result.documentNo;
                this.dayInterval = response.result.dayInterval;
            });
        }
    }

    getExchangeRateInvoice(id) {
        let lcyValue: number = 0;

        let amountValues: string = this.facilityDetailsForm.value.invoiceAmount;//.replace(/[^0-9-.]/g, '');
        this.loanAppService.getExchangeRate(id)
            .subscribe((res) => {
                this.exchange = res.result;



                lcyValue = +amountValues * this.exchange.sellingRate;

                this.facilityDetailsForm.controls["lcyInvoiceValue"].setValue(ConvertString.ToNumberFormate(lcyValue));
                this.facilityDetailsForm.controls["fcyRate"].setValue(this.exchange.sellingRate);
                this.facilityDetailsForm.controls["currencyId"].setValue(id);
                this.onCurrencyChanged(id);

            });
    }
    validateContratDate() {
        if (this.enddate === undefined) {
            this.facilityDetailsForm.controls["contractExpiryDate"].setValue("");
        }
        if (this.startdate === undefined) {
            this.facilityDetailsForm.controls["contractDate"].setValue("");
        }
        if (this.startdate >= new Date()) {
            this.facilityDetailsForm.controls["contractDate"].setValue("");
            swal(`${GlobalConfig.APPLICATION_NAME}`,
                'Contract start date can not be in future', 'info');
            this.startdate == null;
            return
        }
        if (this.startdate.toString() !== "" && this.enddate.toString() != "") {

            if (this.startdate < this.enddate && this.startdate != this.enddate) {
            } else {
                this.facilityDetailsForm.controls["contractExpiryDate"].setValue("");
                this.facilityDetailsForm.controls["contractDate"].setValue("");
                this.startdate = null; this.enddate = null;
                swal(`${GlobalConfig.APPLICATION_NAME}`,
                    'Contract start date must not be earlier than contract expiry date', 'info');
            }
        }
    }

    getExchangeRateInvoice2(id) {
        let lcyValue: number = 0;
        let amountValues: string = this.facilityDetailsForm.value.proposedAmount;//.replace(/[^0-9-.]/g, '');
        if (amountValues === 'NaN' || amountValues == 'undefined') {
            amountValues = '0';
        }
        this.loanAppService.getExchangeRate(id)
            .subscribe((res) => {
                this.exchange = res.result;



                lcyValue = + ConvertString.TO_NUMBER(amountValues) / this.exchange.sellingRate;

                this.facilityDetailsForm.controls["loanNairaEquivalent"].setValue(lcyValue.toFixed(2));
                this.facilityDetailsForm.controls["loanfcyRate"].setValue(this.exchange.sellingRate);

            });

    }


    // fees
    // productFeesFormTemp() {
    //     return this.fb.group({
    //         invoiceNo: [''],
    //         invoiceDate: [this.invoiceDate],
    //         invoiceAmount: [''],
    //     })
    // }

    // file upload

    uploadFileTitle: string = null;
    physicalFileNumber: string = 'n/a';
    physicalLocation: string = 'n/a';
    files: FileList;
    file: File;
    @ViewChild('fileInput', { static: false }) fileInput: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
        this.invoiceInfo.controls["invoiceDocument"].setValue(this.files[0])
        this.selectedDocument = this.files[0];

    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        const invoice = this.invoiceInfo.value;
        const loan = this.loanApplication;
        if (invoice) {
            let body = {
                //loanApplicationNumber: invoice.invoiceAmount,
                loanApplicationNumber: this.ApplicationRef,
                loanReferenceNumber: invoice.invoiceNumber,
                documentTitle: this.documentTitle,
                fileName: invoice.invoiceDocument.name,
                //fileExtension: invoice.invoiceDocument.type,
                fileExtension: this.fileExtention(invoice.invoiceDocument.name),
                physicalFileNumber: invoice.physicalFileNumber,
                physicalLocation: invoice.physicalLocation,
                documentTypeId: '1', // TODO: redundant with fileExtension known
            };


            this.loadingSrv.show();
            this.camService.uploadFile(this.file, body).then((val: any) => {
                this.documentTitle = null;
                this.physicalFileNumber = null;
                this.physicalLocation = null;
                this.fileInput.nativeElement.value = "";
                this.loadingSrv.hide();
                this.disableUpload = true;
                this.displayInvoiceDetails = false;
                this.displayBGUpload = false;
            }, (error) => {
                this.loadingSrv.hide(1000);
            });
        }
    }
    deleteUpload(invoiceNo, applicationNumber) {
        this.camService.deleteLoanDocument(invoiceNo, applicationNumber).subscribe((response) => {
            if (response.success === true) {
                this.loadingSrv.hide();
            }
        });
    }

    uploadFileBandG() {
        let body = {
            loanApplicationNumber: this.ApplicationRef,
            loanReferenceNumber: this.ApplicationRef,
            documentTitle: this.documentTitle,
            fileName: this.file.name,
            fileExtension: this.fileExtention(this.file.name),
            physicalFileNumber: this.physicalFileNumber,
            physicalLocation: this.physicalLocation,
            documentTypeId: '1', // TODO: redundant with fileExtension known
        };
        this.loadingSrv.show();
        this.camService.uploadFile(this.file, body).then((val: any) => {
            this.documentTitle = null;
            this.physicalFileNumber = null;
            this.physicalLocation = null;
            this.fileInput.nativeElement.value = "";
            this.loadingSrv.hide();
            this.disableUpload = true;
            this.displayInvoiceDetails = false;
            this.displayBGUpload = false;
        }, (error) => {
            this.loadingSrv.hide(1000);
        });
    }

    showInvoiceDetails() {
        this.displayInvoiceDetails = true;
        this.initInvioce();
    }

    showMultipleInvoiceDetails() {
        this.displayInvoiceDetails2 = true;
        this.initInvioce();
    }

    uploadBonsAndGuaranteeDocuments(data) {
        this.invoiceNumber = null;
        this.refenceNoBG = null;
        this.loanAppService.getLoanApplicationReferanceNumber()
            .subscribe((response) => {
                this.refenceNoBG = response.result;
                this.invoiceNumber = this.refenceNoBG;
            });
        this.displayBGUpload = true;
    }

    validateDiscountAmount(amount) {
        this.updateBankExposure(amount);
        if (this.displayInvoiceDiscounting == true) {
            var value = this.facilityDetailsForm.get("invoiceAmount").value;
            this.productAmount = value * (this.invoiceLimit / 100)
            let amt = this.facilityDetailsForm.get('proposedAmount').value;
            if (this.productAmount < ConvertString.TO_NUMBER(amt)) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than ' + this.invoiceLimit + '% Invoice amount', 'error');
                return;
            }

        }
        // else {
        //         let proposLimit = ConvertString.TO_NUMBER(this.lsectorLimit);
        //         let productAmount = ConvertString.TO_NUMBER(this.proposedAmount);
        //         if (productAmount > proposLimit) { 
        //         // swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than the proposed limit ' + proposLimit , 'error');
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Sector Limit exceeded!', 'error');
        //         this.proposedAmount = null;
        //         return;
        //     }
        // }
        //this.facilityDetailsForm.get('currencyId').setValue('');
        this.onCurrencyChanged(this.racCurrencyId);
       // this.validateIBLAmount(amount);

    }

    formatMoney(a) {
       let maxDecLength = 3;
        var nums = a.split(/[,\.]/);
        var ret = [nums.slice(0, nums.length - 1).join("")];
        if (nums.length < 2) return +nums[0];
        ret.push(nums[nums.length - 1]);
        return +(ret.join(nums[nums.length - 1].length < maxDecLength ? "." : ""));
    }

    validateIBLAmount(amount){
        
        if(this.isIblRequest == true){
           
            let amt = this.formatMoney(amount);
            if(amt > this.iblAmount){
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than IBL Maximum Amoumt '+ this.iblAmount, 'error');
                this.facilityDetailsForm.controls["proposedAmount"].setValue(null);
                return
            }
            else if(amt < this.iblMinimumAmount){
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be less than IBL Manimum Amoumt '+ this.iblMinimumAmount, 'error');
                this.facilityDetailsForm.controls["proposedAmount"].setValue(null);
                return
            }
        }
    }

    viewDocument(row) {
        let doc = row.invoiceDocument;
        if (doc != null) {
            var reader = new FileReader();
            reader.readAsDataURL(doc);
            reader.onload = () => {
                this.binaryFile = reader.result.toString().split(',')[1];
            };


            this.displayUpload = true;
        }
    }

    DownloadDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);

        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' }); 
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                try {
                    var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
                }
            }

        }

    }

    // editFacilityDetails(row) {
    //     this.InitfacilityDetailsForm();
    //     const detail = row;
    //     this.facilityDetailsForm = this.fb.group({
    //         proposedAmount: [detail.proposedAmount, Validators.required],
    //         proposedInterestRate: [detail.proposedInterestRate, Validators.required],
    //         proposedTenor: [detail.proposedTenor, Validators.required],
    //         proposedProductId: [detail.proposedProductId, Validators.required],
    //         sectorId: [detail.sectorId, Validators.required],
    //         subSectorId: [detail.subSectorId, Validators.required],
    //         currencyId: [detail.currencyId, Validators.required],
    //         customerId: [detail.customerId, Validators.required],
    //         productClassId: [detail.productClassId, Validators.required],
    //         exchangeRate: [detail.exchangeRate, Validators.required],
    //         exchangeAmount: [detail.exchangeAmount, Validators.required],
    //         loanPurpose: [detail.loanPurpose, Validators.required],
    //    isTakeOverApplication: [detail.isTakeOverApplication],
    //    loanDetailReviewTypeId: [detail.loanDetailReviewTypeId],
    //         repaymentTerm: [detail.repaymentTerm, Validators.required],
    //    repaymentScheduleId: ['', Validators.required],
    //         tenorModeId: [1],
    //         proposedProductName: [''],
    //         currencyName: [''],

    //         subSectorName: [''],
    //         productLimit: [0],
    //         invoiceCurrencyId: ['1'],
    //         fcyRate: ['1'],
    //         loanfcyRate: ['1'],
    //         customerName: [''],

    //         addinvoices: [],
    //         traderLoan: [],
    //         educationLoan: [],
    //         bondDetails: [],
    //         casaAccountId: [''],
    //         principalId: [''],
    //         principalName: [''],

    //         //this.invoiceFormDefaultFacility(),
    //         invoiceCurrencyName: [''],
    //         invoiceAmount: [''],
    //         lcyInvoiceValue: [''],
    //         contractExpiryDate: [''],
    //         contractDate: [''],
    //         loanNairaEquivalent: [''],
    //         productFees: [],
    //         purchaseOrderNumber: [],
    //         equityAmount: [''],
    //         equityCasaAccountId: [''],
    //         totalAmountRequired: [''],
    //         certificateNumber: ['']
    //     });
    //     this.onProductChange(detail.proposedProductId);
    // }

    showAddSyndicationDetails() {
        this.initialiseSyndicationDetails();
        this.displayAddSyndicationDetails = true;
    }

    initialiseSyndicationDetails() {
        this.syndicationFormDetail = this.fb.group({
            syndicationId: [0],
            bankName: ['', Validators.required],
            bankCode: ['', Validators.required],
            typeId: ['', Validators.required],
            amountContributed: ['', Validators.required]
        });
    }

    addSyndicationDetails(formObj) {
        const body = formObj.value;
        let bankNameExist = this.syndicationDetailList.find(x => x.bankName == body.bankName);
        let bankCodeExist = this.syndicationDetailList.find(x => x.bankCode == body.bankCode);

        if (bankNameExist != undefined) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, `${bankNameExist.bankName} already exist`, 'warning');
            return;
        }
        if (bankCodeExist != undefined) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, `Bank with code ${bankCodeExist.bankCode} already exist`, 'warning');
            return;
        }
        let syndicatedLoan: ISyndicatedLoan[] = [];

        let data: ISyndicatedLoan = {
            syndicationId: body.syndicationId,
            bankName: body.bankName,
            bankCode: body.bankCode,
            amountContributed: body.amountContributed,
            typeId: body.typeId
        }
        this.syndicationDetailList.push(data);
        this.calculateTotalSyndicationContribution();
        this.syndicationFormDetail.reset();
    }

    editSyndicationDetail(data, indx) {

        this.syndicationFormDetail = this.fb.group({
            syndicationId: [data.syndicationId],
            bankName: [data.bankName, Validators.required],
            bankCode: [data.bankCode, Validators.required],
            typeId: [data.typeId, Validators.required],
            amountContributed: [data.amountContributed, Validators.required]
        });
        this.syndicationDetailList.splice(indx, 1);
        this.calculateTotalSyndicationContribution();
    }

    removeSyndicationDetail(evt, indx) {
        evt.preventDefault();
        this.syndicationDetailList.splice(indx, 1);
        this.calculateTotalSyndicationContribution();
    }

    calculateTotalSyndicationContribution() {
        this.syndicationAmountContribution = 0;
        if (this.syndicationDetailList.length > 0) {
            this.syndicationDetailList.forEach(item => {
                let amountContributed = item.amountContributed.replace(/[,]+/g, "").trim();
                this.syndicationAmountContribution = this.syndicationAmountContribution + Number(amountContributed);
            })
        }
        this.facilityDetailsForm.get('field3').setValue(ConvertString.ToNumberFormate(this.syndicationAmountContribution));
    }

    extendedFormDefaultBody: any;

    refreshFlowChanges() {
        this.isCashedBacked = false;
        this.isTod = false;
    }

    setFlowChangeDisplay(flowChangeId: number) {
        this.refreshFlowChanges();
        if (flowChangeId == FlowChangeEnum.CASHCOLLATERIZED) {
            this.isCashedBacked = true;
        } else if (flowChangeId == FlowChangeEnum.TEMPORARYOVERDRAFT) {
            this.isTod = true;
        }
    }

    getApplicationDetail(id) {
        let extension: any = {};
        this.loadingSrv.show();
        this.loanAppService.getApplicationDetailFields(id).subscribe((response) => {
            this.loadingSrv.hide();
            this.testObject = response.result;

            this.selectedDetailId = id;
            this.selectedProductId = response.result.proposedProductId;
            this.currencyId = response.result.currencyId;
            this.productId = response.result.proposedProductId;
            this.exchangeRate = response.result.exchangeRate;
            this.exchangeValue = +response.result.proposedAmount * response.result.exchangeRate;


            if (this.productClassId == 6) extension = response.result.invoiceDetails[0];
            if (this.productClassId == 7) extension = response.result.educationLoan;
            if (this.productClassId == 8) extension = response.result.traderLoan;
            if (this.productClassId == 10) extension = response.result.bondDetails;

            this.racCustomerId = response.result.customerId;
            this.getCurrenciesbyProduct(this.productId);
            this.validateSpecialWorkflowDetailControl();

            if (this.productTypeIsContingent(response.result.productTypeId)) {
                this.isContingent = true;
                this.facilityDetailsForm.get('proposedInterestRate').setValidators(null);
                this.facilityDetailsForm.get('repaymentScheduleId').setValidators(null);
                this.facilityDetailsForm.get('interestRepaymentId').setValidators(null);

                this.facilityDetailsForm.get('proposedInterestRate').updateValueAndValidity();
                this.facilityDetailsForm.get('repaymentScheduleId').updateValueAndValidity();
                this.facilityDetailsForm.get('interestRepaymentId').updateValueAndValidity();
            }

            this.getProductBehaviourByProductId(this.productId);

            // console.log('r this.racCustomerId & loan.customerId', this.racCustomerId , this.customerId)
            // this.facilityDetailsForm.controls["FIELD"].setValue(response.result.FIELD);
            this.facilityDetailsForm.controls["flowchangeId"].setValue(response.result.flowChangeId);
            this.setFlowChangeDisplay(response.result.flowChangeId);
            this.facilityDetailsForm.controls["proposedProductId"].setValue(response.result.proposedProductId);

            this.facilityDetailsForm.controls["proposedInterestRate"].setValue(response.result.proposedInterestRate);
            //this.facilityDetailsForm.controls["totalAmountRequired"].setValue(response.result.proposedProductId);
            this.facilityDetailsForm.controls["equityAmount"].setValue(response.result.equityAmount);

            // this.facilityDetailsForm.controls["proposedTenor"].setValue(666);
            this.facilityDetailsForm.controls["proposedTenor"].setValue(response.result.proposedTenor);
            this.facilityDetailsForm.controls["tenorModeId"].setValue(response.result.tenorModeId);
            // this.facilityDetailsForm.controls["proposedTenor"].setValue(response.result.proposedTenorConverted);      
            // this.facilityDetailsForm.controls["tenorModeId"].setValue(response.result.tenorFrequencyTypeId);


            this.facilityDetailsForm.controls["sectorId"].setValue(response.result.sectorId);
            this.facilityDetailsForm.controls["subSectorId"].setValue(response.result.subSectorId);

            this.facilityDetailsForm.controls["proposedAmount"].setValue(response.result.proposedAmount);
            this.facilityDetailsForm.controls["productPriceIndexId"].setValue(response.result.productPriceIndexId);
            this.facilityDetailsForm.controls["productPriceIndexRate"].setValue(response.result.productPriceIndexRate);
            this.facilityDetailsForm.controls["productPriceIndexSpread"].setValue(response.result.productPriceIndexSpread);
            this.facilityDetailsForm.controls["crmsFundingSourceId"].setValue(response.result.crmsFundingSourceId);
            this.facilityDetailsForm.controls["crmsPaymentSourceId"].setValue(response.result.crmsPaymentSourceId);
            this.facilityDetailsForm.controls["loanPurpose"].setValue(response.result.loanPurpose);
            this.facilityDetailsForm.controls["iblRequest"].setValue(response.result.iblRequest);
            this.facilityDetailsForm.controls["repaymentTerm"].setValue(response.result.repaymentTerm);
            this.facilityDetailsForm.controls["repaymentScheduleId"].setValue(+response.result.repaymentScheduleId);
            this.facilityDetailsForm.controls["isTakeOverApplication"].setValue(response.result.isTakeOverApplication);
            this.facilityDetailsForm.controls["isLineFacility"].setValue(response.result.isLineFacility);
            this.facilityDetailsForm.controls["approvedLineLimit"].setValue(response.result.approvedLineLimit);
            this.facilityDetailsForm.controls["loanDetailReviewTypeId"].setValue(response.result.loanDetailReviewTypeId);
            this.facilityDetailsForm.controls["approvedTradeCycleId"].setValue(response.result.approvedTradeCycleId);
            this.facilityDetailsForm.controls["operatingCasaAccountId"].setValue(response.result.operatingCasaAccountId);

            this.facilityDetailsForm.controls["interestRepayment"].setValue(response.result.interestRepayment);
            this.facilityDetailsForm.controls["interestRepaymentId"].setValue(response.result.interestRepaymentId);
            this.facilityDetailsForm.controls["isMoratorium"].setValue(response.result.isMoratorium);
            this.facilityDetailsForm.controls["moratorium"].setValue(response.result.moratorium);
            this.facilityDetailsForm.controls["oldApplicationRefForRenewal"].setValue(response.result.oldApplicationRefForRenewal);
            this.facilityDetailsForm.controls["propertyTypeId"].setValue(response.result.propertyTypeId);
            this.facilityDetailsForm.controls["propertyTitle"].setValue(response.result.propertyTitle);
            this.facilityDetailsForm.controls["propertyPrice"].setValue(response.result.propertyPrice);
            this.facilityDetailsForm.controls["downPayment"].setValue(response.result.downPayment);

            // all
            this.facilityDetailsForm.controls["casaAccountId"].setValue(response.result.casaAccountId);

            // invoice
            this.facilityDetailsForm.controls["principalId"].setValue(extension.principalId);
            this.facilityDetailsForm.controls["invoiceCurrencyId"].setValue(extension.invoiceCurrencyId);
            this.facilityDetailsForm.controls["invoiceAmount"].setValue(extension.invoiceAmount);
            this.facilityDetailsForm.controls["contractDate"].setValue(new Date(extension.contractStartDate));
            this.facilityDetailsForm.controls["contractExpiryDate"].setValue(new Date(extension.contractEndDate));

            this.invoiceInfo.controls["contractNumber"].setValue(extension.contractNo);
            this.invoiceInfo.controls["purchaseOrderNumber"].setValue(extension.purchaseOrderNumber);
            this.invoiceInfo.controls["certificateNumber"].setValue(extension.certificateNumber);
            this.invoiceInfo.controls["invoiceNumber"].setValue(extension.invoiceNo);
            this.invoiceInfo.controls["invoiceDocDate"].setValue(new Date(extension.invoiceDate));
            this.invoiceInfo.controls["invoiceAmount"].setValue(extension.invoiceAmount);
            this.invoiceInfo.controls["reValidated"].setValue(extension.reValidated);
            this.invoiceInfo.controls["entrySheetNumber"].setValue(extension.entrySheetNumber);

            // b&g
            // this.customerId = response.result.customerId;
            this.selectedCustomerId = this.customerId;
            this.requireCasaAccount = true;
            //this.resetBondAndGuarantees = true;

            // extended forms
            this.extendedFormDefaultBody = {
                principalId: extension.principalId,
                isTenored: extension.isTenored,
                principalName: extension.principalName,
                casaAccountId: extension.casaAccountId,
                contractStartDate: extension.contractStartDate,
                contractEndDate: extension.contractEndDate,
                isBankFormat: extension.isBankFormat,
                bondAmount: extension.bondAmount,
                bondCurrencyId: extension.bondCurrencyId,
                bondfcyRate: extension.bondfcyRate,
                bondfcyAmount: extension.bondfcyAmount,

                numberOfStudent: extension.numberOfStudent,
                averageSchoolFees: extension.averageSchoolFees,
                schoolFeesCollected: extension.schoolFeesCollected,

                marketId: extension.marketId,
                averageMonthlyTurnover: extension.averageMonthlyTurnover,
                soldItems: extension.soldItems,
            };
            // last
            //this.facilityDetailsForm.controls["currencyId"].setValue(response.result.currencyId);
            // this.onCurrencyChanged(response.result.currencyId);
            this.isIBLRequest = response.result.iblRequest;

        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    getProductBehaviourByProductId(productId: number) {
        if (productId <= 0) {
            return;
        }
        this.loadingSrv.show();
        this.productService.getProductsBehaviourByProductId(productId).subscribe((resp) => {
            if (resp.result != null) {
                this.productLimit = resp.result.productLimit;
                this.isInvoiceBased = resp.result.isInvoiceBased;
                this.requireCasaAccount = resp.result.requireCasaAccount;
                this.customerLimitMoney = resp.result.customerLimit;
                this.invoiceLimit = resp.result.invoiceLimit;
            }
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    productTypeIsContingent(productTypeId: number) {
        if (isNullOrUndefined(productTypeId)) {
            return false;
        }
        return (productTypeId == ProductTypeEnum.ContingentLiability);
    }

    submitEvent: number = 0;
    submitEventReadOnly: number = 0;
    setRacValues(rac) {
        this.submitLoan(rac);
    }

    setRacValuesreadOnly(rac) {
        //this.submitLoan(rac);
    }

    getRacCategoryTeirs(productId) {

        this.ProductId = productId;

        this.productService.GetRacCategoryTeirs(productId).subscribe((res) => {
            this.categoryTeirs = res.result;


            
           if (this.categoryTeirs.length == 0) {
                this.proposedProductId = productId;
                this.facilityDetailsForm.controls['racCategoryTypeId'].clearValidators()
                this.facilityDetailsForm.controls['racCategoryTypeId'].updateValueAndValidity()
            } else {
                this.showCategoryTypeInput = true;

                this.facilityDetailsForm.controls['racCategoryTypeId'].setValidators([Validators.required])
                this.facilityDetailsForm.controls['racCategoryTypeId'].updateValueAndValidity()
            }
           

        }, (err) => {
        });
    }

    getRacForRacCategoryType(id) {

        this.productService.RacCategoryTypeExist(this.ProductId, id).subscribe((res) => {
            let exit = res.result;
            this.proposedProductId = ""


            if (exit == true) {
                this.proposedProductId = this.ProductId;
                this.racCategoryTypeId = id;

                this.facilityDetailsForm.controls['racCategoryTypeId'].clearValidators()
                this.facilityDetailsForm.controls['racCategoryTypeId'].updateValueAndValidity()

                

            } else {
                // this.proposedProductId = 1223100;
            }


        }, (err) => {
        });



    }

    onProductSpreadSelect(value: number) {
        const productPriceIndexRate = +this.facilityDetailsForm.get('productPriceIndexRate').value;
        const interestRate = productPriceIndexRate + +value;
        this.facilityDetailsForm.get('productPriceIndexSpread').setValue(value);
        this.facilityDetailsForm.get('proposedInterestRate').setValue(interestRate);
    }

    loanApplicationFlowChange(loanApplicationId) {
        this.loanAppService.loanApplicationFlowChange(loanApplicationId).subscribe((response) => {
            if (response.success === true) {
                this.resetForm()
                this.activeBondForm = false;
                this.loadingSrv.hide();
                this.loanApplicationDetails = [];
                this.refreshDetailsGrid.emit(1);
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
            }
        });
    }

    DeleteLoanApplicationThatFailedRAC(loanApplicationDetailId) {
        this.loadingSrv.show();
        this.loanAppService.deleteLoanApplicationThatFailedRAC(loanApplicationDetailId).subscribe((response) => {
            this.resetForm();
            this.activeBondForm = false;
            this.loadingSrv.hide();
            this.loanApplicationDetails = [];
            // this.refreshDetailsGrid.emit(1);
            swal(`${GlobalConfig.APPLICATION_NAME}`, ' Application successfully cancelled', 'success');
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    showValue($event) {
        this.facilityDetailsForm.updateValueAndValidity();
    }

    isMoratorium($event) {
        this.facilityDetailsForm.updateValueAndValidity();
        let value = this.facilityDetailsForm.get('isMoratorium').value;
        //console.log("value: ", value);
        //console.log("$event: ", $event);

        if (value != true) {
            this.facilityDetailsForm.get('moratorium').setValidators(Validators.required);
        }
        else {
            this.facilityDetailsForm.get('moratorium').clearValidators();
            // this.facilityDetailsForm.get('moratorium').setValue('');
        }

        this.facilityDetailsForm.get('moratorium').updateValueAndValidity();
    }

    onFileChange2(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    requestPasswordBulk2() {
        if (this.adActive) {

            this.buttonText = "Uploads invoice";
            this.displayADAuth = true;
            this.bulkUPload = true;
        }
        else {
            this.adAuthPassCode = "";
            this.uploadInvoiceRecords();
        }
    }
    closeModal() {
        this.displayInvoiceDetails2 = false;
    }

    uploadInvoiceRecords() {
        this.loadingSrv.showFile();
        if (this.file != undefined || this.file != null) {
            let adAuthPassCode = btoa(this.adAuthPassCode);

            let body = {
                loanReferenceNumber: '',
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                loginStaffPassCode: adAuthPassCode,
            };
            this.loanAppService.uploadInvoiceRecords(this.file, body).then((res: any) => {
                if (res.success == true) {
                    if (res.result != undefined || res.result != null) {
                        this.uploadedData = res.result;
                        for (var a of res.result) {
                            this.invoiceTable.push(a);
                        }
                        this.calculateInvoiceTotal();

                        // res.result == undefined ? this.failedUpload = []
                        //     : this.failedUpload = res.result;

                        this.loadingSrv.hide();
                        // if (res.result.commitedRows.length <= 0 && res.result.discardedRows.length > 0) {
                        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Staff upload failed' + '\n' + 'See log for more info', 'warning');
                        // }
                        // else if ((res.result.commitedRows.length > 0) && (res.result.discardedRows.length > 0)) {
                        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Upload was successful but some records failed to upload', 'info');
                        // }
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'info');
                    }
                } else {
                    // if (res.result == null || res.result == undefined) {
                    //     this.uploadedData = res.result.commitedRows;
                    //     this.failedUpload = res.result.discardedRows;
                    // }

                    this.loadingSrv.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (error) => {
                this.loadingSrv.hide();
                swal('Bulk Invoice Upload', JSON.stringify(error) ? JSON.stringify(error) : 'uploading bulk invoice generated error', 'error')
            });
        } {

        }
        this.displayADAuth = false;
    }

    GetTotalBankExposure() {
        this.loanAppService.GetTotalBankExposureAndLimit().subscribe((response) => {
            if (response.success == true) {
                this.records = response.result;
                this.bankExposure = this.bankPendingExposure = this.records.totalBankExposure;
                this.bankLimit = this.records.companyLimit;
            }
        });
    }

    updateBankExposure(amount) {

        let facilityAmount = ConvertString.TO_NUMBER(amount);

        this.bankExposure = this.bankPendingExposure;
        this.bankExposure = (+this.bankExposure) + (+facilityAmount);
        if (this.bankExposure > this.bankLimit) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Bank Limit has been Exceeded with this Facility', 'warning');
        }
    }

    validateTenor(proposedTenor) {
        if (this.tenorMode == undefined) {
            this.tenorMode = 2;
        }
        let amt = ConvertString.TO_NUMBER(proposedTenor);

        let proposedProductTenor = 0;


        if (this.tenorMode == 1 && amt == 12) {
            proposedProductTenor = (amt * 30) + 5;
        }
        if (this.tenorMode == 1 && amt != 12) {
            proposedProductTenor = amt * 30;
        }
        if (this.tenorMode == 2) {
            proposedProductTenor = amt;
        }
        if (this.tenorMode == 3) {
            proposedProductTenor = amt * 365;
        }

        if ((this.productTenor < proposedProductTenor) && (this.productTenor > 0)) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Tenor limit exceeded', 'error');
            this.facilityDetailsForm.get('proposedTenor').setValue("");
            return;
        }
    }

    isSetupFacilityLine(): boolean {
        return (this.isLineFacility);
    }

    isSelectedFacilityLine(): boolean {
        let value = this.facilityDetailsForm.get('isLineFacility').value;
        return (this.isLineFacility || value == true);
    }


    validateTenor2(tenorMode) {
        if (tenorMode == undefined || tenorMode == "") {
            this.tenorMode = 2;
        }
        let amt = ConvertString.TO_NUMBER(this.proposedTenor);
        let proposedProductTenor = 0;
        if (this.tenorMode == 1 && amt == 12) {
            proposedProductTenor = (amt * 30) + 5;
        }
        if (this.tenorMode == 1 && amt != 12) {
            proposedProductTenor = amt * 30;
        }
        if (tenorMode == 2) {
            proposedProductTenor = amt;
        }
        if (tenorMode == 3) {
            proposedProductTenor = amt * 365;
        }

        if (this.productTenor < proposedProductTenor) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Tenor limit exceeded', 'error');
            this.facilityDetailsForm.get('proposedTenor').setValue("");
            return;
        }
    }

    getAllPropertyTypes() {
        this.loadingSrv.show();
        this.propertyTypes = [];
        this.loanAppService.getAllPropertyTypes().subscribe((response) => {
            this.loadingSrv.hide();
            this.propertyTypes = response.result;
        }, (err: HttpErrorResponse) => {

        });
    }
}

