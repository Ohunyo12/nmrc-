import { Router } from '@angular/router';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanService } from '../../services/loan.service';
import { LoanSchedule } from '../../models/schedule';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { ConvertString, LoanRepricingModeEnum, ProductTypeEnum, DayCountConventionEnum } from '../../../shared/constant/app.constant';
import { AuthenticationService } from '../../../admin/services';
import { saveAs } from 'file-saver';
import { ProductService } from 'app/setup/services/product.service';
@Component({
    selector: 'schedule-template',
    templateUrl: 'schedule.component.html',
    styles: [`
        .ui-datepicker {
    top: 100px !important;
}
    `]
})

export class SheduleComponent implements OnInit {
    shouldDisburse: boolean; checked: boolean;
    hideDisbursementCheck: string = 'hide'; display: boolean = false;
    displayScheduleModalForm: boolean = false;
    show: boolean = false; message: any; title: any; cssClass: any; data: any = {};
    scheduleGroupForm: FormGroup; scheduleTypes: any[];
    schedules: any[]; scheduleHeader: any = {}; scheduleParams: any = {};
    maturityDate: any; basis: any[]; frequencies: any[];
    scatteredMethod: boolean = false; bulletMethod: boolean = false; ballonMethod: boolean = false;
    scatterdPayments: any[] = [];
    irregularSchedules: any[]; irreSchedules: boolean = false;
    principalBalance: any = 0; principalValanceString: any;
    callendarPixel: string;
    exportParameters: any = {};
    tenormonths: any;
    tempDate: any;
    LoanSchedule: LoanSchedule;
    pmts: any;
    temprec: any;
    IsMonthlyQuaterly: boolean = false;
    IsPrincipalInterest: boolean = true;
    multipleData: any = {};
    cols: any[];
    multipleAmountData: any;
    payTypeName: any;
    intAmount: any;

    //Output Event emmitter definition consumed during loan Booking
    @Output() notify: EventEmitter<any> = new EventEmitter<string>();

    //Input variables modified during loan Booking
    @Input() interestRate: number;
    @Input() approvedInterestRate: number;
    @Input() integralFeeAmount: number;
    @Input() tenor: number;
    @Input() tenorInMonths: string;
    @Input() viewStatus: boolean = false;
    @Input() viewOnly: any = null;
    @Input() isDisbursement: boolean;
    @Input() interestFrequencyTypeId: number;
    @Input() principalFrequencyTypeId:  number;
    @Input() firstPrincipalPaymentDate: Date = new Date(); 
    @Input() firstInterestPaymentDate: Date = new Date(); 
    @Input() scheduleTitle: string = 'Repayment Schedule Simulation';
    @Input() callendarPixelInput: number = 290;
    @Input() productTypeId: number;

    @Input() scheduleTypeId: number;
    @Input() dayCountConventionId: number;
    @Input() loanApprovedAmountText: string = 'Loan Amount';
    @Input() isSimulation: boolean = true;
    @Input() systemDate: Date = new Date();
    @Input() repaymentTerms: string;
    @Input() repaymentSchedule: string;
    @Input() productPriceIndexId: number;
    @Input() loanApplicationDetailId: number;
    @Input() currencyId: number;
    repricingMode: any;
    productCurrencyPriceIndex: any;
    //end of input variables

    constructor(private fb: FormBuilder,
        private loanSrv: LoanService, private loadingSrv: LoadingService,
        private dateUtilService: DateUtilService,
        private authService: AuthenticationService,
        private productService: ProductService,
        private router: Router) { }

    ngOnInit() {
        const userInfo = this.authService.getUserInfo();
        this.systemDate = this.systemDate ? this.systemDate : userInfo.applicationDate;
        this.callendarPixel = String(this.callendarPixelInput) + "px";
        this.initializeForm();
        this.getLoanScheduleTypes(this.productTypeId);
        this.getDayCount();
        this.getFrequencyTypes();
        this.getLoanRepricingModes();
        this.multipleAmountData = [];
        this.data.duration = "";
        this.data.type = "1";
        this.setFormElementsWithIncomingChildValues();
        this.setDefaultSystemDate(this.systemDate);
    }

    setFormElementsWithIncomingChildValues(){ 
        if (this.loanAmount > 0) {
            this.data.principalAmount = ConvertString.ToNumberFormate(this.loanAmount);
            this.scheduleGroupForm.controls['principalAmount'].setValue(ConvertString.ToNumberFormate(this.loanAmount));
        }
        if (this.interestRate >= 0) {
            this.data.interestRate = this.interestRate;
            this.scheduleGroupForm.controls['interestRate'].setValue(this.interestRate);
        }
        if (this.integralFeeAmount > 0) {
            this.data.integralFeeAmount = this.integralFeeAmount;
            this.scheduleGroupForm.controls['integralFeeAmount'].setValue(this.interestRate);
        }
        if (this.tenor > 0) {
            this.data.tenor = this.tenor;
            this.scheduleGroupForm.controls['tenor'].setValue(this.tenor);
        }
        if (this.tenorInMonths != null) {
            this.tenormonths = this.tenorInMonths;
        }
        if(this.currencyId > 0){
            this.getLoanCurrenyPriceIndex(this.currencyId)
        }

        if(this.scheduleTypeId  > 0){
            this.data.scheduleMethod = this.scheduleTypeId;
            this.scheduleGroupForm.controls['scheduleMethod'].setValue(this.scheduleTypeId);
            this.onscheduleMethodChangedOne();
        } 
        if(this.dayCountConventionId > 0 ){
            this.data.accrualBasis = this.dayCountConventionId
            this.scheduleGroupForm.controls['accrualBasis'].setValue(this.dayCountConventionId);
        }   
        if(this.interestFrequencyTypeId > 0){ 
            this.scheduleGroupForm.controls['interestFrequency'].setValue(this.interestFrequencyTypeId);
        }   
        if(this.principalFrequencyTypeId > 0){
            this.scheduleGroupForm.controls['principalfrequency'].setValue(this.principalFrequencyTypeId);
        }
        if(this.firstInterestPaymentDate != null){
            this.scheduleGroupForm.controls['intrestFirstDate'].setValue(new Date (this.firstInterestPaymentDate));
        } 
        if(this.firstPrincipalPaymentDate != null){
            this.scheduleGroupForm.controls['principalFirstDate'].setValue(new Date(this.firstPrincipalPaymentDate));
        } 
    }

    showRepricingModeDuration: boolean;
    onRepricingModeChange(data){
        if(data.value == LoanRepricingModeEnum.FixedToMaturityWithRepricing){
            this.showRepricingModeDuration = true;
        } else this.showRepricingModeDuration = false;
    }

    public setDefaultSystemDate(loanDate) {
        this.data.loanDate = new Date(loanDate);
        this.calculateMaturityDate(null);
    }

    public _loanAmount = 0;
    @Input() set loanAmount(loanAmount: Number) {
        // tslint:disable-next-line:radix
        this._loanAmount = Number(parseInt(loanAmount.toString().replace(/[,]+/g, "").trim()));
        if (loanAmount > 0) {
            // tslint:disable-next-line:radix
            this.data.principalAmount = Number(parseInt(this._loanAmount.toString().replace(/[,]+/g, "").trim()));
            this.principalBalance = this.data.principalAmount;
        }
    }

    onscheduleMethodChanged(sValue) {
        this.bulletMethod = true;
        this.ballonMethod = true;
        if (sValue === 5) {
            this.scatteredMethod = true;
            this.data.principalAmount = this.scheduleGroupForm.value.principalAmount;
            this.data.interestRate = this.scheduleGroupForm.value.interestRate;
            this.data.loanDate = this.scheduleGroupForm.value.loanDate;
            this.data.scheduleMethod = this.scheduleGroupForm.value.scheduleMethod;
            this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        } else if (sValue === 3) {
            this.bulletMethod = false;
            this.ballonMethod = false;
        }
        else if (sValue === 7) {
            this.ballonMethod = true;
            this.bulletMethod = false;
        }
        else {
            this.scatteredMethod = false;
            this.ballonMethod = false;
        }
    }

    onscheduleMethodChangedOne() {
        // tslint:disable-next-line:no-console
        let sValue: number = Number(this.data.scheduleMethod); console.debug('this.data.principalAmount',this.data.principalAmount);
        if (sValue === 5) {
            this.scatteredMethod = true;
            if(!this.viewOnly){
                if( this.data.principalAmount != null)this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            }
            else {if( this.data.principalAmount != null)this.principalBalance = Number(this.data.principalAmount)}
        }
        else {
            this.scatteredMethod = false;
            this.onscheduleMethodChanged(sValue)
        }
    }

    getDayCount() {
        this.loanSrv.getLoanDayCount().subscribe((res) => {
            this.basis = res.result;
            if(this.productTypeId != null && this.productTypeId == ProductTypeEnum.SyndicatedLoan){
                this.basis = this.basis.filter(x=>x.lookupId != DayCountConventionEnum.Actual_Actual);
                this.basis.slice;
                this.scheduleGroupForm.controls['accrualBasis'].setValue(DayCountConventionEnum.Actual_360);
            }
        });
    }

    calculateMaturityDate(stringDt = null) {
        if (!this.isSimulation) {
            if (this.data.tenor <= 0) {
                this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
                return;
            }
            else {
                let ldate = stringDt == 'frontEnd' ? this.scheduleGroupForm.value.loanDate : this.data.loanDate;
                var ret = new Date(ldate);
                var maturityDate = ret.setDate(ret.getDate() + this.data.tenor);

                if (ldate > maturityDate) {
                    this.showMessage("The effective date cannot be greater than maturity date.", "error", "FintrakBanking");
                    return;
                }
                this.scheduleGroupForm.controls['maturityDate'].setValue(new Date(maturityDate));
                this.validateOnBackdate();
            }

        } else return;

    }

    getFrequencyTypes() {
        this.loanSrv.getFrequencyTypes()
            .subscribe((res) => {
                if(res.success){
                    this.frequencies = res.result;
                    if(this.interestFrequencyTypeId > 0){ 
                        this.scheduleGroupForm.controls['interestFrequency'].setValue(this.interestFrequencyTypeId);
                    }
                    if(this.principalFrequencyTypeId > 0){
                        this.scheduleGroupForm.controls['principalfrequency'].setValue(this.principalFrequencyTypeId);
                    }
                }
            });
    }

    getLoanRepricingModes() {
        this.loanSrv.getLoanRepricingMode().subscribe((data) => {
            this.repricingMode = data.result;
        }, err => { });
    }

    getLoanCurrenyPriceIndex(currencyId) {
        this.productService.getProductPriceIndexByCurrencyId(currencyId).subscribe((data) => {
            if(data.success){
                this.productCurrencyPriceIndex = data.result;
                
                if(this.productPriceIndexId > 0){
                    this.data.priceIndexId = this.productPriceIndexId;
                this.scheduleGroupForm.controls['priceIndexId'].setValue(this.productPriceIndexId);
                }
            }
        }, err => { });
    }

    onProductPriceIndexChange(target) { 
        if(Number(target.value) <= 0 || target.value == null || target.value == ''){
            this.data.interestRate = this.approvedInterestRate ;
            this.scheduleGroupForm.controls['interestRate'].setValue(this.approvedInterestRate );
            return;
        }
        
        var priceIndex = this.productCurrencyPriceIndex.filter(x=>x.productPriceIndexId == target.value)[0];
        if(priceIndex != null || priceIndex != undefined){ 
            this.data.interestRate = this.approvedInterestRate + priceIndex.priceIndexRate;
            this.scheduleGroupForm.controls['interestRate'].setValue(this.approvedInterestRate + priceIndex.priceIndexRate);
        }
    }

    validateOnBackdate() {
        var today = new Date();
        var startDate = this.scheduleGroupForm.value.loanDate
        if (!this.isSimulation) {
                this.checked = false;
                this.hideDisbursementCheck = 'hide';
                this.shouldDisburse = false;
        } else return;

    }

    onFrequesncyChanged() {
        let duration: number = Number(this.data.duration);
        if (duration === 1 || duration === null) {
            this.IsMonthlyQuaterly = false;
        }
        else {
            this.IsMonthlyQuaterly = true;
        }
    }

    onTypeChanged() {
        let type: number = Number(this.data.type);
        if (type === 3) {
            this.IsPrincipalInterest = false;
        }
        else {
            this.IsPrincipalInterest = true;
        }
    }
    
    delarr: any[] = [];
    delarrevent: any[] = [];
    checkbox(evt, indx) {
        if (this.delarr.find(x => x == indx)) {
            this.delarr.splice(this.delarr.indexOf(indx), 1)
        }
        else {
            this.delarr.push(indx);
        }
        if (this.delarrevent.find(x => x == evt)) {
            this.delarrevent.splice(this.delarrevent.indexOf(evt), 1)
        }
        else {
            this.delarrevent.push(evt);
        }
    }
    i: number = 0;
    removeSelectedItem() {
        let amount = [...this.scatterdPayments];
        this.multipleAmountData.forEach(element => {
            let index = amount.indexOf(element);
            element = amount.filter((val, i) => i != index);
            let currRecord = amount[index];
            if(currRecord.payTypeId == 3)
            {

            }
            else{
            this.principalBalance = (Number(this.principalBalance) + Number(currRecord.payAmount.replace(/[,]+/g, "").trim()));
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
            amount.splice(index, 1);

        });
        this.scatterdPayments = amount;
        this.multipleAmountData = null;

    }

    addToList() {

        var duration = this.data.duration;
        var payType = this.data.type;

        if (payType == 1) {
            this.payTypeName = "Principal and Interest";
            this.intAmount = this.data.amount;
        }
        if (payType == 2) {
            this.payTypeName = "Principal Only";
            this.intAmount = this.data.amount;
        }
        if (payType == 3) {
            this.payTypeName = "Interest Only";
            this.data.amount = 0.00;
            this.intAmount = "-";
        }
        let scatterdPayments = [...this.scatterdPayments];


        if (duration == 1) {
            if (this.data.type != 3) {
                if (Number(this.principalBalance) - Number(this.data.amount.replace(/[,]+/g, "").trim()) < 0) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;

                    this.showMessage("Payment amount cannot be greater than principal amount", "error", "FintrakBanking");
                    return;
                }
                if (this.data.scateredDate == null || this.data.amount == "") {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment date required", "error", "FintrakBanking");
                    return;
                }

                if (this.data.amount == null || this.data.amount == 0) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment amount required", "error", "FintrakBanking");
                    return;
                }
            }
            if (this.principalBalance == 0) {
                this.data.scateredDate = null;
                this.data.amount = null;
                this.data.duration = "";
                this.data.type = "1";
                this.data.count = null;
                this.IsMonthlyQuaterly = false;
                this.IsPrincipalInterest = true;
                this.showMessage("Payment balance is zero", "error", "FintrakBanking");
                return;
            }

            if (new Date(this.data.scateredDate) < new Date(this.data.loanDate)) {
                this.data.scateredDate = null;
                this.data.amount = null;
                this.data.duration = "";
                this.data.type = "1";
                this.data.count = null;
                this.IsMonthlyQuaterly = false;
                this.IsPrincipalInterest = true;
                this.showMessage("Payment date cannot be less than effective date", "error", "FintrakBanking");
                this.data.scateredDate = null;
                return;
            }
            this.pmts = {
                payDate: this.dateUtilService.formatJsonDate(this.data.scateredDate),
                realDate: this.data.scateredDate,
                payAmount: this.data.amount,
                payType: this.payTypeName,
                interestAmount: this.intAmount,
                payTypeId: this.data.type,
            };

            scatterdPayments.push(this.pmts);
            if (this.data.type != 3) {
                this.principalBalance = (Number(this.principalBalance) - Number(this.pmts.payAmount.replace(/[,]+/g, "").trim()));
                this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
        }
        else if (duration == 2) {
            var value = this.data.count;
            var count = 0;
            var increment = 0;
            while (count < value) {
                if (this.data.type != 3) {
                    if (Number(this.principalBalance) - Number(this.data.amount.replace(/[,]+/g, "").trim()) < 0) {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment amount cannot be greater than principal amount", "error", "FintrakBanking");
                        return;
                    }
                    if (this.data.scateredDate == null || this.data.amount == "") {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment date required", "error", "FintrakBanking");
                        return;
                    }

                    if (this.data.amount == null || this.data.amount == 0) {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment amount required", "error", "FintrakBanking");
                        return;
                    }
                }
                if (this.principalBalance == 0) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment balance is zero", "error", "FintrakBanking");
                    return;
                }

                if (new Date(this.data.scateredDate) < new Date(this.data.loanDate)) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment date cannot be less than effective date", "error", "FintrakBanking");
                    this.data.scateredDate = null;
                    return;
                }
                this.pmts = {
                    payDate: this.data.scateredDate,
                    realDate: new Date(this.data.scateredDate),
                    payAmount: this.data.amount,
                    payType: this.payTypeName,
                    interestAmount: this.intAmount,
                    payTypeId: this.data.type,
                };
                var newdate = new Date(this.pmts.payDate);
                var d = newdate.setMonth(newdate.getMonth() + increment);
                this.data.scateredDate = d;
                var date = this.dateUtilService.formatJsonDate(d)
                this.pmts.payDate = date;
                this.pmts.realDate = new Date(this.data.scateredDate);
                this.temprec = {
                    payDate: this.pmts.payDate,
                    realDate: this.pmts.realDate,
                    payAmount: this.data.amount,
                    payType: this.payTypeName,
                    interestAmount: this.intAmount,
                    payTypeId: this.data.type,
                };
                scatterdPayments.push(this.temprec);
                if (this.data.type != 3) {
                    this.principalBalance = (Number(this.principalBalance) - Number(this.temprec.payAmount.replace(/[,]+/g, "").trim()));
                    this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
                }
                count++;
                if (increment == 0) {
                    increment = 1;
                }
            }


        }
        else if (duration == 3) {
            var value = this.data.count;
            var count = 0;
            var increment = 0;
            while (count < value) {
                if (this.data.type != 3) {
                    if (Number(this.principalBalance) - Number(this.data.amount.replace(/[,]+/g, "").trim()) < 0) {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment amount cannot be greater than principal amount", "error", "FintrakBanking");
                        return;
                    }
                    if (this.data.scateredDate == null || this.data.amount == "") {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment date required", "error", "FintrakBanking");
                        return;
                    }

                    if (this.data.amount == null || this.data.amount == 0) {
                        this.data.scateredDate = null;
                        this.data.amount = null;
                        this.data.duration = "";
                        this.data.type = "1";
                        this.data.count = null;
                        this.IsMonthlyQuaterly = false;
                        this.IsPrincipalInterest = true;
                        this.showMessage("Payment amount required", "error", "FintrakBanking");
                        return;
                    }
                }
                if (this.principalBalance == 0) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment balance is zero", "error", "FintrakBanking");
                    return;
                }

                if (new Date(this.data.scateredDate) < new Date(this.data.loanDate)) {
                    this.data.scateredDate = null;
                    this.data.amount = null;
                    this.data.duration = "";
                    this.data.type = "1";
                    this.data.count = null;
                    this.IsMonthlyQuaterly = false;
                    this.IsPrincipalInterest = true;
                    this.showMessage("Payment date cannot be less than effective date", "error", "FintrakBanking");
                    this.data.scateredDate = null;
                    return;
                }
                this.pmts = {
                    payDate: this.data.scateredDate,
                    realDate: new Date(this.data.scateredDate),
                    payAmount: this.data.amount,
                    payType: this.payTypeName,
                    interestAmount: this.intAmount,
                    payTypeId: this.data.type,
                };
                var newdate = new Date(this.pmts.payDate);
                var d = newdate.setMonth(newdate.getMonth() + increment);
                this.data.scateredDate = d;
                var date = this.dateUtilService.formatJsonDate(d)
                this.pmts.payDate = date;
                this.pmts.realDate = new Date(this.data.scateredDate);
                this.temprec = {
                    payDate: this.pmts.payDate,
                    realDate: this.pmts.realDate,
                    payAmount: this.data.amount,
                    payType: this.payTypeName,
                    interestAmount: this.intAmount,
                    payTypeId: this.data.type,
                };
                scatterdPayments.push(this.temprec);
                if (this.data.type != 3) {
                    this.principalBalance = (Number(this.principalBalance) - Number(this.temprec.payAmount.replace(/[,]+/g, "").trim()));
                    this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
                }
                count++;
                if (increment == 0) {
                    increment = 3;
                }
            }


        }

        this.scatterdPayments = scatterdPayments;
        this.data.scateredDate = null;
        this.data.amount = null;
        this.data.duration = "";
        this.data.type = "1";
        this.data.count = null;
        this.IsMonthlyQuaterly = false;
        this.IsPrincipalInterest = true;
    }

    onPrincipalblur() {
        if (this.data.principalAmount == '') return;
        var realChar: string = this.data.principalAmount;
        var currVal: string = this.data.principalAmount.substr(-1)
        realChar = realChar.substr(0, realChar.length - 1).replace(/[,]+/g, "").trim();
        currVal = currVal.substr(-1)

        if (currVal === 'M' || currVal == 'm') {
            let result: Number = Number(realChar) * 1000000;
            this.data.principalAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
            this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
            let result: Number = Number(realChar) * 1000;
            this.data.principalAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
            this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        } else if (currVal === 'b' || currVal === 'B') {
            let result: Number = Number(realChar) * 1000000000;
            this.data.principalAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
            this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        } else {
            let result: Number = Number(realChar);
            this.data.principalAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
            this.principalBalance = Number(this.data.principalAmount.replace(/[,]+/g, "").trim());
            this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        }
    }


    formatValue() {
        if (this.data.amount == '') return;
        var realChar: string = this.data.amount;
        var currVal: string = this.data.amount.substr(-1);
        realChar = realChar.substr(0, realChar.length - 1).replace(/[,]+/g, "").trim();
        currVal = currVal.substr(-1);

        if (currVal === 'M' || currVal == 'm') {
            let result: Number = Number(realChar) * 1000000;
            this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
            let result: Number = Number(realChar) * 1000;
            this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'b' || currVal === 'B') {
            let result: Number = Number(realChar) * 1000000000;
            this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else {
            let result: Number = Number(realChar);
            this.data.amount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }
    }

    formatFeeValue() {
        if (this.data.integralFeeAmount == '') return;
        var realChar: string = this.data.integralFeeAmount;
        var currVal: string = this.data.integralFeeAmount.substr(-1);
        realChar = realChar.substr(0, realChar.length - 1);
        currVal = currVal.substr(-1);

        if (currVal === 'M' || currVal == 'm') {
            let result: Number = Number(realChar) * 1000000;
            this.data.integralFeeAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'T' || currVal == 't' || currVal === 'K' || currVal === 'k') {
            let result: Number = Number(realChar) * 1000;
            this.data.integralFeeAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else if (currVal === 'b' || currVal === 'B') {
            let result: Number = Number(realChar) * 1000000000;
            this.data.integralFeeAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        } else {
            let result: Number = Number(realChar);
            this.data.integralFeeAmount = (result.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        }
    }

    generateIrregularSchedule() {
        if (Number(this.principalBalance) > 0 || Number(this.principalBalance) < 0) {
            this.showMessage("Payment amount must be equal to principal amount", "error", "FintrakBanking");
            return;
        }
        this.loadingSrv.show();
        var payments = [];
        this.scatterdPayments.forEach((v) => {
            payments.push({
                paymentDate: v.realDate,
                paymentAmount: v.payAmount,
                paymentTypeId: v.payTypeId,
            });
        })

        let body = {
            scheduleMethodId: this.data.scheduleMethod,
            principalAmount: this.data.principalAmount,
            effectiveDate: this.data.loanDate,
            interestRate: this.data.interestRate,
            accrualBasis: this.data.accrualBasis,
            integralFeeAmount: this.data.integralFeeAmount,
            irregularPaymentSchedule: payments,

        };

        this.exportParameters = body;
        this.loanSrv.generatePeriodicSchedule(body)
            .subscribe((res) => {
                this.loadingSrv.hide();
                if (res.success == true) {
                    

                    if (res.result.length) {
                        var details = {
                            principalAmount: body.principalAmount,
                            interestRate: body.interestRate,
                            effectiveDate: body.effectiveDate,
                            maturityDate: '',
                            effectiveInterestRate: 0,
                            schedules: res.result
                        }

                        this.schedules = details.schedules;
                        this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
                        details.maturityDate = this.maturityDate;
                        details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
                        this.scheduleHeader = details;

                        //SCHEDULE EVENT EMITTER : REQUIRED AT LOAN BOOKING
                        //THIS BLOCK EMITS THE EVENT PARATERS TO LOAN BOOKING
                        if (this.data.principalFirstDate > body.effectiveDate) {
                            this.showMessage("First principal payment date cannot be greater than effective date", "error", "FintrakBanking");
                            return;
                        }

                        if (this.data.intrestFirstDate > body.effectiveDate) {
                            this.showMessage("First interest payment date cannot be greater than effective date", "error", "FintrakBanking");
                            return;
                        }

                        let scheduleDetailsForLoanBooking = {
                            scheduleMethodId: body.scheduleMethodId,
                            principalAmount: body.principalAmount,
                            effectiveDate: body.effectiveDate,
                            interestRate: body.interestRate,
                            principalFrequency: this.data.principalfrequency,
                            interestFrequency: this.data.interestFrequency,
                            tenor: this.data.tenor,
                            principalFirstpaymentDate: this.data.principalFirstDate,
                            interestFirstpaymentDate: this.data.intrestFirstDate,
                            maturityDate: this.maturityDate,
                            accrualBasis: body.accrualBasis,
                            integralFeeAmount: body.integralFeeAmount,
                            firstDayType: this.data.interestChargeType,
                            irregularPaymentSchedule: body.irregularPaymentSchedule,
                            effectiveInterestRate: details.effectiveInterestRate,
                            schedules: details.schedules,
                            shouldDisburse: this.shouldDisburse,
                            formData: this.scheduleGroupForm.value,

                        };
                        this.notify.emit(scheduleDetailsForLoanBooking);
                        //END OF EVENT EMITTER

                        this.displayScheduleModalForm = true;
                        this.loadingSrv.hide();
                    }
                }
                else {
                    this.showMessage(res.message, "error", "FintrakBanking");
                }
            }, (err) => {
                this.showMessage(err || "An unknown error has occured", "error", "FintrakBanking");
            })
    }

    onSubmit({ value, valid }: { value: LoanSchedule, valid: boolean }): void {
        this.loadingSrv.show();
        var payments = [];
        payments.push({
            paymentDate: new Date(),
            paymentAmount: 500

        });

        let body = {
            scheduleMethodId: this.data.scheduleMethod,
            principalAmount: this.data.principalAmount,
            effectiveDate: value.loanDate,
            interestRate: value.interestRate,
            principalFrequency: value.principalfrequency,
            interestFrequency: value.interestFrequency,
            tenor: value.tenor,
            principalFirstpaymentDate: value.principalFirstDate,
            interestFirstpaymentDate: value.intrestFirstDate,
            maturityDate: value.maturityDate,
            accrualBasis: value.accrualBasis,
            integralFeeAmount: value.integralFeeAmount,
            firstDayType: value.interestChargeType,
            irregularPaymentSchedule: payments,
            formData: this.scheduleGroupForm.value,
        };
        

        this.loanSrv.generatePeriodicSchedule(body)
            .subscribe((res) => {
                this.loadingSrv.hide();
                if (res.success == true) {
                    

                    if (res.result.length) {
                        var details = {
                            principalAmount: value.principalAmount,
                            interestRate: value.interestRate,
                            effectiveDate: value.loanDate,
                            maturityDate: value.maturityDate,
                            effectiveInterestRate: 0,
                            schedules: res.result
                        };

                        this.schedules = details.schedules;
                        this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
                        details.maturityDate = this.maturityDate;
                        details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
                        this.scheduleHeader = details;

                        //SCHEDULE EVENT EMITTER : REQUIRED AT LOAN BOOKING
                        //THIS BLOCK EMITS THE EVENT PARATERS TO LOAN BOOKING
                        let scheduleDetailsForLoanBooking = {
                            scheduleMethodId: body.scheduleMethodId,
                            principalAmount: body.principalAmount,
                            effectiveDate: body.effectiveDate,
                            interestRate: body.interestRate,
                            principalFrequency: body.principalFrequency,
                            interestFrequency: body.interestFrequency,
                            tenor: body.tenor,
                            principalFirstpaymentDate: body.principalFirstpaymentDate,
                            interestFirstpaymentDate: body.interestFirstpaymentDate,
                            maturityDate: body.maturityDate,
                            accrualBasis: body.accrualBasis,
                            integralFeeAmount: body.integralFeeAmount,
                            firstDayType: body.firstDayType,
                            irregularPaymentSchedule: body.irregularPaymentSchedule,
                            effectiveInterestRate: details.effectiveInterestRate,
                            schedules: details.schedules,
                            shouldDisburse: this.shouldDisburse,
                            formData: this.scheduleGroupForm.value,
                        };
                        this.notify.emit(scheduleDetailsForLoanBooking);
                        //END OF EVENT EMITTER

                        this.displayScheduleModalForm = true;
                        this.loadingSrv.hide();
                    }
                }
                else {
                    this.showMessage(res.message, "error", "FintrakBanking");
                }
            }, (err) => {
                this.loadingSrv.hide();
            });
    }

    initializeForm() {
        this.scheduleGroupForm = this.fb.group({
            principalAmount: ['', Validators.required],
            interestRate: ['', Validators.required],
            loanDate: ['', Validators.required],
            scheduleMethod: ['', Validators.required],
            interestFrequency: ['', Validators.required],
            principalfrequency: ['', Validators.required],
            tenor: ['', Validators.required],
            principalFirstDate: ['', Validators.required],
            intrestFirstDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            numberOfPayments: ['', Validators.required],
            accrualBasis: ['', Validators.required], 
            priceIndexId: [''],
            repricingModeId: ['', Validators.required],
            repricingDuration : ['', Validators.compose([ValidationService.isNumber])],
            integralFeeAmount: [''],
            interestChargeType: ['0'],
            tenormonths: [''],
            withoutDisburment: [false],
        });
    }

    getLoanScheduleTypes(productTypeId) {
        this.loanSrv.getLoanScheduleTypes(productTypeId).subscribe((res) => {
            this.scheduleTypes = res.result;
        });
    }

    setFirstPrincipalPaymentDate(dateVal){ 
        this.scheduleGroupForm.controls['principalFirstDate'].setValue(new Date(dateVal));
    }

    removeItem(evt, indx) {
        evt.preventDefault();
        let amount = [...this.scatterdPayments];
        let index = amount.indexOf(indx);

        let currRecord = amount[index];

        this.principalBalance = (Number(this.principalBalance) + Number(currRecord.payAmount.replace(/[,]+/g, "").trim()));
        this.principalValanceString = this.principalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
        amount.splice(indx, 1);
        this.scatterdPayments = amount;
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

    calculateTenor() {
        var numDays = this.dateUtilService.dateDiff(this.scheduleGroupForm.value.loanDate, this.scheduleGroupForm.value.maturityDate);
        this.scheduleGroupForm.controls['tenor'].setValue((numDays));

        this.calculateTenorMonths();
    }

    calculateTenorMonths() {
        var numDays = this.dateUtilService.dateDiff(this.scheduleGroupForm.value.loanDate, this.scheduleGroupForm.value.maturityDate);
        this.scheduleGroupForm.controls['tenormonths'].setValue(((numDays) / 30.41666667).toFixed(0)+" month(s)");
    }

    calculateMaturity() {
        this.scheduleGroupForm.controls["maturityDate"].setValue(null);
        let newTenor = this.scheduleGroupForm.get("tenor").value;
        if (newTenor <= 0) {
            swal(
                "FinTrak Credit 360",
                "System cannot calculate maturity date with zero tenor.",
                "error"
            );
        }
        let effectiveDate = this.scheduleGroupForm.get(
            "loanDate"
        ).value;
        let ret = new Date(effectiveDate);
        var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
        this.scheduleGroupForm.controls["maturityDate"].setValue(
            maturityDate
        );

        this.calculateTenorMonths();
    }


    calculateMaturityMonth() {
        this.scheduleGroupForm.controls["maturityDate"].setValue(null);
        let newTenor = this.scheduleGroupForm.get("tenormonths").value;
        if (newTenor <= 0) {
            swal(
                "FinTrak Credit 360",
                "System cannot calculate maturity date with zero tenormonths.",
                "error"
            );
        }
        let effectiveDate = this.scheduleGroupForm.get(
            "loanDate"
        ).value;
        let ret = new Date(effectiveDate);
        var maturityDate = new Date(ret.getTime() + ((newTenor * 30.41666667) - 1) * 86400 * 1000);
        this.scheduleGroupForm.controls["maturityDate"].setValue(
            maturityDate
        );
        this.calculateTenor()

    }

    DownloadSchedule(formObj) {
        this.loadingSrv.show();
        var payments = [];
        payments.push({
            paymentDate: new Date(),
            paymentAmount: 500
        });

        let body = {
            scheduleMethodId: this.data.scheduleMethod,
            principalAmount: this.data.principalAmount,
            effectiveDate: formObj.value.loanDate,
            interestRate: formObj.value.interestRate,
            principalFrequency: formObj.value.principalfrequency,
            interestFrequency: formObj.value.interestFrequency,
            tenor: formObj.value.tenor,
            principalFirstpaymentDate: formObj.value.principalFirstDate,
            interestFirstpaymentDate: formObj.value.intrestFirstDate,
            maturityDate: formObj.value.maturityDate,
            accrualBasis: formObj.value.accrualBasis,
            integralFeeAmount: formObj.value.integralFeeAmount,
            firstDayType: formObj.value.interestChargeType,
            irregularPaymentSchedule: payments,
            formData: this.scheduleGroupForm.value,
        };
        this.loanSrv.getScheduleInExcelFormat(body).subscribe((response: any) => {
            this.loadingSrv.hide();
            let scheduleData = response.result;
            if (scheduleData != undefined) {

                var byteString = atob(scheduleData);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                // var file = new File([bb], 'Schedule.xlsx', { type: 'application/vnd.ms-excel' });

                //saveAs(file)

                try {
                    var file = new File([bb], 'Schedule.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var textFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(textFileAsBlob, 'Schedule.xlsx');
                }
            }
        });
    }
}