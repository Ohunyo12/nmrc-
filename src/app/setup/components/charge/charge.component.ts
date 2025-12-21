import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChargeService } from '../../services';
import { ProductService } from '../../services';
import { ApprovalService } from '../../services';
import { ProductFeeService } from '../../services';
import { AuthenticationService } from '../../../admin/services/authentication.service';
import { AppConstant, GlobalConfig } from '../../../shared/constant/app.constant';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ValidationService } from '../../../shared/services/validation.service';
import { FeeType } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'charge.component.html'
})
export class ChargeComponent implements OnInit {
    chargeFeeDetailsList: any[] = [];
    disableDetailRate: boolean = true;
    disableDetailAmount: boolean = true;
    showAmortizationGL: boolean = true;
    isBankFeeDetails: boolean = false;
    chargeFeeDetailClass: any[];
    chargeFeeDetailType: any[];
    feeTypes: any[];
    postingTypes: any[];
    charges: any[];
    ranges: any[] = [];
    taxes: any[] = [];
    productFeeTypes: any[];
    frequencies: any[];
    accounts: any[];
    products: any[];
    operations: any[];
    crmsFeeTypes: any[];

    displayForm: boolean = false;
    showChargeForm: boolean = true;
    disableAmount: boolean = false;
    isRecurring: boolean = false;
    disableRate: boolean = true;
    disableRange: boolean = true;
    entityName: string = 'Charge / Fee';
    chargeForm: FormGroup;
    chargeFeeDetailsForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    sourceId: number = null;
    displayRangeForm: boolean = false;
    rangeForm: FormGroup;
    accountCategories: any[];
    intervals: any[];

    displayFeeDetailsForm: boolean = false;
    entityNameDetails: any;


    targets: any[] = [
        { id: 3, name: 'Balance' },
        { id: 6, name: 'Credit' },
        { id: 5, name: 'Debit' },
        { id: 7, name: 'Outstanding Principal' },
        { id: 4, name: 'Principal' },
        { id: 2, name: 'Transaction(Debit and Credit)' },
        { id: 1, name: 'Turnover' },
    ];
    filteredGLAccounts: any[];
    amortisationTypes: any[];
    disableCutOffDay: boolean = true;
    selectedAccountCategoryId: number;
    disableFeeGlSelect: boolean = true;
    editMode: boolean = false;
    sources: any[] = [
        { id: FeeType.RATE, name: 'Rate' },
        { id: FeeType.AMOUNT, name: 'Amount' },
        { id: FeeType.RANGE, name: 'Range' },
    ];

    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private chargeService: ChargeService,
        private productService: ProductService,
        private productFeeService: ProductFeeService,
        private approvalService: ApprovalService,
    ) { }

    ngOnInit() {
        this.getAllCharge();
        this.clearRangeForm();
        this.clearControls();
        this.loadDropdowns();
        this.initializeDetailControl();
        // this.showForm(); // <--- FOR TEST ONLY!!!
    }

    clearRangeForm() {
        this.rangeForm = this.fb.group({
            minimum: ['', Validators.required],
            maximum: ['', Validators.required],
            rate: ['', Validators.required],
        });
    }

    showRangeForm() {
        this.clearRangeForm();
        this.displayRangeForm = true;
    }

    addRange(form) {
        let body = {
            minimum: form.value.minimum,
            maximum: form.value.maximum,
            rate: form.value.rate,
        };
        this.ranges.push({ minimum: body.minimum, maximum: body.maximum, rate: body.rate, chargeRangeId: null, minimumAndAbove: false, maximumAndBelow: false, amount: '0' });
        this.displayRangeForm = false;
    }

    removeRange(index) {
        this.ranges.splice(index, 1);
    }

    getFeeTypeById(id) {
        let item = this.feeTypes != null ? this.feeTypes.find(x => x.lookupId == id) : [];
        if (item != undefined) { return item.lookupName; }
        return 'n/a';
    }
    getFeeDetailTypeById(id) {
        let item = this.chargeFeeDetailType != null ? this.chargeFeeDetailType.find(x => x.lookupId == id) : [];
        if (item != undefined) { return item.lookupName; }
        return 'n/a';
    }
    getPostingTypeById(id) {
        let item = this.postingTypes != null ? this.postingTypes.find(x => x.lookupId == id) : [];
        if (item != undefined) { return item.lookupName; }
        return 'n/a';
    }

    loadDropdowns() {
        this.approvalService.getAllOperations().subscribe((response: any) => {
            this.operations = response.result;
        });
        this.productService.getAllProductTypes().subscribe((response: any) => {
            this.products = response.result;
        });
         this.chargeService.getCRMSFeeTypes().subscribe((response: any) => {
            this.crmsFeeTypes = response.result;
        });
        this.chargeService.getFrequencyTypes().subscribe((response: any) => {
            this.frequencies = response.result;
        });
        this.productFeeService.getAllChartOfAccounts().subscribe((response: any) => {
            this.accounts = response.result;
        });
        this.chargeService.getTaxes().subscribe((response: any) => {
            this.taxes = response.result;
        });
        this.productFeeService.getAccountCategories().subscribe((response: any) => {
            this.accountCategories = response.result;
        });

        this.productFeeService.getAmortisationTypes().subscribe((response: any) => {
            this.amortisationTypes = response.result;
        });

        this.chargeService.getChargeFeeDetailClass().subscribe((response: any) => {
            this.chargeFeeDetailClass = response.result;
        });
        this.chargeService.getChargeFeeDetailType().subscribe((response: any) => {
            this.chargeFeeDetailType = response.result;
        });
        this.chargeService.getFeeTypes().subscribe((response: any) => {
            this.feeTypes = response.result;
        });
        this.chargeService.getPostingTypes().subscribe((response: any) => {
            this.postingTypes = response.result;
        });
    }

    onChangeIncludeCutOffDay() {
        if (this.chargeForm.value.includeCutOffDay == true) {
            this.disableCutOffDay = false;
        } else {
            this.disableCutOffDay = true;
        }
    }

    onAccountCategoryChange(id) {
        this.selectedAccountCategoryId = id;
        this.filteredGLAccounts = this.accounts.filter(x => x.accountCategoryId == id);
        if (this.filteredGLAccounts.length == 0)
            this.disableFeeGlSelect = true;
        else
            this.disableFeeGlSelect = false;
    }

    onRecurringChange(checked: boolean) {
        this.isRecurring = checked;
        this.chargeForm.controls['frequencyTypeId'].setValue('1');
    }

    onSourceChange(id, editing = false) {
        this.disableAmount = true;
        this.disableRate = true;
        this.disableRange = true;

        let amountControl = this.chargeForm.controls['amount'];
        let rateControl = this.chargeForm.controls['rate'];
        if (editing) {
            if (+id != FeeType.AMOUNT) { amountControl.setValue(null); }
            if (+id != FeeType.RATE) { rateControl.setValue(null); }
            // this.ranges = [];
        }
        amountControl.setValidators(null);
        rateControl.setValidators(null);
        ////console.log(id);

        switch (+id) {
            case FeeType.AMOUNT:
                this.disableAmount = false;
                amountControl.setValidators([Validators.required]);
                break;
            case FeeType.RATE:
                this.disableRate = false;
                rateControl.setValidators([Validators.required]);
                break;
            case FeeType.RANGE:
                this.disableRange = false;
                break;

            default:
                break;
        }
        amountControl.updateValueAndValidity();
        rateControl.updateValueAndValidity();
    }


    getAllCharge(): void {
        // this.charges=[ {"chargeName":"jhhjhjh","productId":"6","operationId":"1","amount":"20000","rate":"","valueSource":"3","ledgerAccountId":"19","recurring":false,"frequencyTypeId":"","primaryTaxId":"","secondaryTaxId":"","accountCategoryId":"4","intervalId":"3","targetId":"3","amortisationTypeId":"2","cutOffDay":"2","isIntegral":false,"ranges":[{"minimum":"87878","maximum":"878878","rate":"7.7"},{"minimum":"87878","maximum":"878878","rate":"7.7"},{"minimum":"87878","maximum":"878878","rate":"7.7"},{"minimum":"87878","maximum":"878878","rate":"7.7"},{"minimum":"87878","maximum":"878878","rate":"7.7"},{"minimum":"87878","maximum":"878878","rate":"7.7"}]}];
        this.loadingService.show();
        this.chargeService.getCharges().subscribe((response: any) => {
            this.charges = response.result;
            if (response.result != undefined) {
                this.charges = response.result;
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showForm() {
        this.clearControls();
        this.chargeFeeDetailsList=[];
        this.editMode = false;
        this.displayForm = true;
    }
    addToList(formObj) {
        let obj = formObj.value
        this.chargeFeeDetailsList.push(obj);

        this.initializeDetailControl();
        this.displayFeeDetailsForm = false;
    }
    clearControls() {
        this.ranges = [];
        this.clearRangeForm();
        this.selectedId = null;
        this.chargeForm = this.fb.group({
            chargeName: ['', Validators.required],
            productId: ['', Validators.required],
            operationId: [''],
            amount: ['', Validators.required],
            rate: [''],
            crmsRegulatoryId:[''],
            valueSource: [FeeType.AMOUNT, Validators.required],
            recurring: [false],
            frequencyTypeId: ['1'],
            primaryTaxId: [''],
            secondaryTaxId: [''],
            targetId: ['', Validators.required],
            amortisationTypeId: [''],
            includeCutOffDay: [false],
            cutOffDay: ['', Validators.compose([ValidationService.monthDate, ValidationService.isNumber])],
            isIntegral: [false],
        });
    }
    initializeDetailControl() {
        this.chargeFeeDetailsForm = this.fb.group({
            accountCategoryId: [''],
            chargeFeeDetailId: [''],
            description: ['', Validators.required],
            chargeFeeId: [''],
            glAccountId1: [''],
            glAccountId2: [''],
            detailTypeId: ['', Validators.required],
            postingTypeId: ['', Validators.required],
            rate: ['', Validators.required],
            feeTypeId: ['', Validators.required],
            requireAmortization: [false],
            postingGroup: ['', Validators.required]
        });
    }
    editCharge(row) {
        this.selectedId = row.chargeFeeId;
        this.chargeFeeDetailsList = row.chargeFeeDetails;
        this.chargeForm = this.fb.group({
            chargeName: [row.chargeName, Validators.required],
            productId: [row.productTypeId, Validators.required],
            operationId: [row.operationId || ''],
            amount: [row.amount],// || '', (row.amount == '') ? null : Validators.required],
            rate: [row.rate, row.rate == '' ? null : Validators.required],
            valueSource: [row.feeTypeId, Validators.required],
            ledgerAccountId: [row.ledgerAccountId, Validators.required],
            recurring: [row.recurring, Validators.required],
            frequencyTypeId: [row.frequencyTypeId, Validators.required],
            primaryTaxId: [row.primaryTaxId || ''],
            secondaryTaxId: [row.secondaryTaxId || ''],
            accountCategoryId: [row.accountCategoryId, Validators.required],
            // intervalId: [row.intervalId, Validators.required],
            targetId: [row.targetId, Validators.required],
            amortisationTypeId: [row.amortisationTypeId || ''],
            includeCutOffDay: [row.includeCutOffDaylse],
            cutOffDay: [row.cutOffDay],//, Validators.compose([ValidationService.monthDate, ValidationService.isNumber])],
            isIntegral: [row.isIntegral],
            crmsRegulatoryId: [row.crmsRegulatoryId],

        });
        this.displayForm = true;
        this.ranges = row.ranges
        this.editMode = true;
        this.onSourceChange(row.feeTypeId, true);
        this.onAccountCategoryChange(row.accountCategoryId);
        ////console.log('EDIT: ',(row));
    }

    submitForm(form) {
        if (this.chargeFeeDetailsList.length == 0) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please enter Fee Details to Continue', 'info');
            return;
        }

        let detailsList = []
        this.chargeFeeDetailsList.forEach(detail => {
            detailsList.push({
                accountCategoryId: detail.accountCategoryId ,
            chargeFeeDetailId: detail.chargeFeeDetailId,
            description: detail.description,
            chargeFeeId: detail.chargeFeeId,
            glAccountId1: detail.glAccountId1 == 0 ? null :detail.glAccountId1 ,
            glAccountId2:  detail.glAccountId2 == 0 ? null :detail.glAccountId2,
            detailTypeId: detail.detailTypeId,
            postingTypeId: detail.postingTypeId,
            rate: detail.rate,
            feeTypeId: detail.feeTypeId,
            requireAmortization:detail.requireAmortization,
            postingGroup:detail.postingGroup
            });
        });
            ////console.log("OGAAAAAA ISAHHHHHH",detailsList );
        let body = {
            chargeName: form.value.chargeName,
            productTypeId: form.value.productId,
            operationId: form.value.operationId,
            amount: form.value.amount,
            rate: form.value.rate,
            feeTypeId: form.value.valueSource,
            recurring: form.value.recurring,
            frequencyTypeId: form.value.frequencyTypeId,
            accountCategoryId: form.value.accountCategoryId,
            targetId: form.value.targetId,
            amortisationTypeId: form.value.amortisationTypeId,
            includeCutOffDay: form.value.includeCutOffDaylse,
            cutOffDay: form.value.cutOffDay,
            isIntegral: form.value.isIntegral,
            ranges: this.ranges,
            chargeFeeDetails: detailsList,
            crmsRegulatoryId: form.value.crmsRegulatoryId,
        };

        ////console.log('BODY: ', (body));

        this.loadingService.show();
         if (this.selectedId === null) {
        this.chargeService.saveCharge(body).subscribe((res) => {
            ////console.log('SAVE!');
            if (res.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                this.clearControls();
                this.loadingService.hide();
                //this.finishGood(res.message);
                this.getAllCharge();
                this.displayForm = false;
                ////console.log('GOOD!', JSON.stringify(res.message));
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                this.loadingService.hide();
                
                //this.finishBad(res.message);
                ////console.log('BAD!', JSON.stringify(res.error));
            }
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`,JSON.stringify(err), 'error');
            this.loadingService.hide();
            //this.finishBad(JSON.stringify(err));
        });
         } else {
             this.chargeService.updateCharge(body, this.selectedId).subscribe((res) => {
                 ////console.log('RESULTS...', res);

                 if (res.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                    this.clearControls();
                    this.loadingService.hide();
                   // this.finishGood(res.message);
                     this.getAllCharge();
                     this.displayForm = false;
                 } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    this.loadingService.hide();
                    // this.finishBad(res.message);
                 }
             }, (err: any) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`,JSON.stringify(err), 'error');
                this.loadingService.hide();
                // this.finishBad(JSON.stringify(err));
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

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }
    showChargeFeeDetailForm() {
        this.chargeFeeDetailsList;
        this.initializeDetailControl();
        this.entityNameDetails = 'New Charge Fee Detail'
        this.displayFeeDetailsForm = true;
    }
    removeChargeFeeDetail(event, index) {
        event.preventDefault();
        this.chargeFeeDetailsList.splice(index, 1);
    }
    editChargeFeeDetail(event, index) {
        event.preventDefault();

        const row = index
        this.entityNameDetails = 'Edit Charge Fee Detail'
        this.chargeFeeDetailsForm = this.fb.group({
            accountCategoryId: [row.accountCategoryId],
            chargeFeeDetailId: [row.chargeFeeDetailId],
            description: [row.description, Validators.required],
            chargeFeeId: [row.chargeFeeId],
            glAccountId1: [row.glAccountId1],
            glAccountId2: [row.glAccountId2],
            detailTypeId: [row.detailTypeId, Validators.required],
            postingTypeId: [row.postingTypeId, Validators.required],
            rate: [row.rate, Validators.required],
            feeTypeId: [row.feeTypeId, Validators.required],
            requireAmortization: [row.requireAmortization],
            postingGroup: [row.postingGroup, Validators.required]
        });
        if (row.feeTypeId == 1) {
            this.isBankFeeDetails = false;
        } else {
            this.isBankFeeDetails = true;
            this.chargeFeeDetailsForm.get('accountCategoryId').setValue(row.accountCategoryId)
            // this.chargeFeeDetailsForm.get('').setValue()
        }
        this.chargeFeeDetailsList.splice(index, 1);
        this.displayFeeDetailsForm = true;
    }
    onRequireAmortizationChanged() {
        if (this.chargeFeeDetailsForm.value.requireAmortization == true) {
            this.showAmortizationGL = false;
        } else {
            this.showAmortizationGL = true;
        }
    }
    onFeeDetailTypeChanged(indx) {
        if (indx == 1) {
            this.isBankFeeDetails = false;
        } else {
            this.isBankFeeDetails = true;
        }
    }
    OnFeeTypeChanged(evt) {
        this.disableAmount = true;
        this.disableRate = true;
        this.disableRange = true;

        let amountControl = this.chargeFeeDetailsForm.controls['amount'];
        let rateControl = this.chargeFeeDetailsForm.controls['rate'];
        // if (editing) {
        //     if (+id != FeeType.AMOUNT) { amountControl.setValue(null); }
        //     if (+id != FeeType.RATE) { rateControl.setValue(null); }
        //     // this.ranges = [];
        // }
        amountControl.setValidators(null);
        rateControl.setValidators(null);

        switch (+evt) {
            case FeeType.AMOUNT:
                this.disableDetailAmount = false;
                amountControl.setValidators([Validators.required]);
                break;
            case FeeType.RATE:
                this.disableDetailRate = false;
                rateControl.setValidators([Validators.required]);
                break;

            default:
                break;
        }
        amountControl.updateValueAndValidity();
        rateControl.updateValueAndValidity();

    }
    submitChargeFeeForm(formObj) {

    }
}