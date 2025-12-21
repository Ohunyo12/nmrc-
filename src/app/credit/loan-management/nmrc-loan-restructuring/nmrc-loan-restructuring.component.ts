import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UnifiedUnderwritingStandardService } from 'app/credit/services/underwriting-obligor.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanSchedule } from '../../models/schedule';
import { ConvertString, DayCountConventionEnum, ProductTypeEnum } from 'app/shared/constant/app.constant';
import { LoanService } from 'app/credit/services';
import { ProductService } from 'app/setup/services';
import { DateUtilService } from 'app/shared/services/dateutils';
import swal from 'sweetalert2';
//import flatpickr from 'flatpickr';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-nmrc-loan-restructuring',
  templateUrl: './nmrc-loan-restructuring.component.html',
  styles: []
})

export class NmrcLoanRestructuringComponent implements OnInit {

  activeSearchTabindex = 0;
  loans: any[] = [];
  selectedLoan: any;
  itemTotal: any;
  isExpanded: boolean = false;
  displayRestructureModal: boolean = false;  // New variable to control PrimeNG modal visibility
  //loanRestructureForm: FormGroup;

  shouldDisburse: boolean; checked: boolean;
  hideDisbursementCheck: string = 'hide'; display: boolean = false;
  displayScheduleModalForm: boolean = false;
  show: boolean = false; message: any; title: any; cssClass: any; data: any = {};
  loanRestructureForm: FormGroup; 
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
  totalAmount: any;
  repricingMode: any;
  productCurrencyPriceIndex: any;
  // selectedScheduleMethod: number;
    scheduleTypes: any[];

// Visibility flags for different fields
  showPrincipalFrequency: boolean = true;
  showPrincipalFirstPmtDate: boolean = true;
  showInterestFrequency: boolean = true;
  showInterestFirstPmtDate: boolean = true;
  showTenorInDays: boolean = true;
  showBasis: boolean = true;
  showTenorInMonths: boolean = true;
  showMaturityDate: boolean = true;
  showAmount: boolean = true;
  showEffectiveDate: boolean = true;
  showRate: boolean = true;

@Output() notify: EventEmitter<any> = new EventEmitter<string>();
  //Input variables modified during loan Booking
  @Input() viewOnly: any = null;
  @Input() viewStatus: boolean = false;
  @Input() productTypeId: number;
  @Input() interestFrequencyTypeId: number;
  @Input() principalFrequencyTypeId:  number;
  @Input() isSimulation: boolean = true;
  @Input() systemDate: Date = new Date();
  @Input() approvedInterestRate: number;
  @Input() firstPrincipalPaymentDate: Date = new Date(); 
  @Input() firstInterestPaymentDate: Date = new Date(); 
  @Input() interestRate: number;
  @Input() tenor: number;
  @Input() tenorInMonths: string;
  @Input() scheduleTypeId: number;
  @Input() dayCountConventionId: number;
  loanId: any;

      
          
          
  constructor(
     private fb: FormBuilder,
     private underwritingService: UnifiedUnderwritingStandardService,
     private loadingService: LoadingService,
     private sanitizer: DomSanitizer,
     private loanSrv: LoanService, 
    private productService: ProductService,
    private dateUtilService: DateUtilService,
    private cdr: ChangeDetectorRef,
  ) { 
    // this.loanRestructureForm = this.fb.group({
    //   scheduleMethod: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   amount: ['', [Validators.required, Validators.min(0)]],
    //   tenor: ['', [Validators.required, Validators.min(1)]],
    //   rate: ['', [Validators.required, Validators.min(0)]],
    //   selectedLoan: [null] // Initialize selectedLoan
    // });

    
  }

  ngOnInit() {
    this.fetchTranchedLoans();
    //this.fetchLoansForRestructuring();
    this.getLoanScheduleTypes(this.productTypeId);
    this.initializeForm();
    this.getFrequencyTypes();
    this.getDayCount();
    this.setDefaultSystemDate(this.systemDate);
    this.setFormElementsWithIncomingChildValues();
    this.loanRestructureForm.get('scheduleMethod').valueChanges.subscribe(value => {
      this.selectedScheduleMethod = Number(value);
      this.data.duration = "";
        this.data.type = "1";
    });
  }



initializeForm() {
  this.loanRestructureForm = this.fb.group({
    scheduleMethod: ['', Validators.required],
    effectiveDate: [''],
    principalAmount: [''],
    tenor: [''],
    interestRate: [''],
    interestFrequency: [''],
    principalFrequency: [''],
    intrestFirstDate: [''],
    principalFirstDate: [''],
    maturityDate: [''],
    accrualBasis: [''],
    tenormonths: [''],
    integralFeeAmount: [''],
    interestChargeType: ['0'],
    selectedLoan: [null]
  });

  // Set initial validators for schedule method 3
  this.updateValidatorsForScheduleMethod(3);
}
  onSearchTabChange(event: any) {
    this.activeSearchTabindex = event.index;
  }

  // fetchLoansForRestructuring(page: number = 1, rows: number = 5): void {
  //   this.loadingService.show();
  //   this.underwritingService.getAppliedLoanForNmrcRefinance(page).subscribe(
  //     response => {
  //       console.log('Fetched Reviewed Loans:', response);
  //       //this.loans = response.result || [];
  //       this.loans = (response.result || []).map(loan => ({
  //         ...loan,
  //         applicationDate: loan.applicationDate ? new Date(loan.applicationDate).toISOString().split('T')[0] : null,
  //         totalAmount: loan.totalAmount,
  //       }));
  //       this.itemTotal = response.totalCount || 0; 
  //       console.log("Processed date:", this.loans);
  //     },
  //     error => {
  //       console.error('Error fetching loans:', error);
  //     },
  //     () => {
  //       this.loadingService.hide();
  //     }
  //   );
  // }

  fetchTranchedLoans( rows: number = 10): void {
    this.loadingService.show();
    this.underwritingService.getTranchedLoans().subscribe(
      response => {
        console.log('Fetched Loans:', response);
        this.loans = (response.result || []).map(loan => ({
          ...loan,
          applicationDate: loan.applicationDate ? new Date(loan.applicationDate).toISOString().split('T')[0] : null,
          principalAmount: loan.totalAmount,
          loanId: loan.id
        }));
        console.log("Processed date:", this.loans);
      },
      error => {
        console.error('Error fetching loans:', error);
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  // ============================ Schedule Method ===========================



getLoanScheduleTypes(productTypeId) {
  this.loanSrv.getLoanScheduleTypes(productTypeId).subscribe((res) => {
      this.scheduleTypes = res.result;
      console.log('Schedule Types:', this.scheduleTypes)
  });
}

getFrequencyTypes() {
  this.loanSrv.getFrequencyTypes()
      .subscribe((res) => {
          if(res.success){
              this.frequencies = res.result;
              console.log('frequencies', this.frequencies)
              if(this.interestFrequencyTypeId > 0){ 
                  this.loanRestructureForm.controls['interestFrequency'].setValue(this.interestFrequencyTypeId);
              }
              if(this.principalFrequencyTypeId > 0){
                  this.loanRestructureForm.controls['principalFrequency'].setValue(this.principalFrequencyTypeId);
              }
          }
      });
}

setFirstPrincipalPaymentDate(dateVal){ 
  this.loanRestructureForm.controls['principalFirstDate'].setValue(new Date(dateVal));
}

calculateTenor() {
  var numDays = this.dateUtilService.dateDiff(this.loanRestructureForm.value.effectiveDate, this.loanRestructureForm.value.maturityDate);
  this.loanRestructureForm.controls['tenor'].setValue((numDays));

  this.calculateTenorMonths();
}

calculateTenorMonths() {
  var numDays = this.dateUtilService.dateDiff(this.loanRestructureForm.value.effectiveDate, this.loanRestructureForm.value.maturityDate);
  this.loanRestructureForm.controls['tenormonths'].setValue(((numDays) / 30.41666667).toFixed(0)+" month(s)");
}

getDayCount() {
        this.loanSrv.getLoanDayCount().subscribe((res) => {
            this.basis = res.result;
            if(this.productTypeId != null && this.productTypeId == ProductTypeEnum.SyndicatedLoan){
                this.basis = this.basis.filter(x=>x.lookupId != DayCountConventionEnum.Actual_Actual);
                this.basis.slice;
                this.loanRestructureForm.controls['accrualBasis'].setValue(DayCountConventionEnum.Actual_360);
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

  public setDefaultSystemDate(effectiveDate) {
    this.data.effectiveDate = new Date(effectiveDate);
    this.calculateMaturityDate(null);
}

calculateMaturityDate(stringDt = null) {
  if (!this.isSimulation) {
      if (this.data.tenor <= 0) {
          this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
          return;
      }
      else {
          let ldate = stringDt == 'frontEnd' ? this.loanRestructureForm.value.effectiveDate : this.data.effectiveDate;
          var ret = new Date(ldate);
          var maturityDate = ret.setDate(ret.getDate() + this.data.tenor);

          if (ldate > maturityDate) {
              this.showMessage("The effective date cannot be greater than maturity date.", "error", "FintrakBanking");
              return;
          }
          this.loanRestructureForm.controls['maturityDate'].setValue(new Date(maturityDate));
          this.validateOnBackdate();
      }

  } else return;

}

  validateOnBackdate () {
    var today = new Date();
    var startDate = this.loanRestructureForm.value.effectiveDate
    if (!this.isSimulation) {
            this.checked = false;
            this.hideDisbursementCheck = 'hide';
            this.shouldDisburse = false;
    } else return;

}

   calculateMaturity() {
          this.loanRestructureForm.controls["maturityDate"].setValue(null);
          let newTenor = this.loanRestructureForm.get("tenor").value;
          if (newTenor <= 0) {
              swal(
                  "FinTrak Credit 360",
                  "System cannot calculate maturity date with zero tenor.",
                  "error"
              );
          }
          let effectiveDate = this.loanRestructureForm.get(
              "effectiveDate"
          ).value;
          let ret = new Date(effectiveDate);
          var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
          this.loanRestructureForm.controls["maturityDate"].setValue(
              maturityDate
          );
  
          this.calculateTenorMonths();
      }
  
  
      calculateMaturityMonth() {
          this.loanRestructureForm.controls["maturityDate"].setValue(null);
          let newTenor = this.loanRestructureForm.get("tenormonths").value;
          if (newTenor <= 0) {
              swal(
                  "FinTrak Credit 360",
                  "System cannot calculate maturity date with zero tenormonths.",
                  "error"
              );
          }
          let effectiveDate = this.loanRestructureForm.get(
              "effectiveDate"
          ).value;
          let ret = new Date(effectiveDate);
          var maturityDate = new Date(ret.getTime() + ((newTenor * 30.41666667) - 1) * 86400 * 1000);
          this.loanRestructureForm.controls["maturityDate"].setValue(
              maturityDate
          );
          this.calculateTenor()
  
      }

      onProductPriceIndexChange(target) { 
        if(Number(target.value) <= 0 || target.value == null || target.value == ''){
            this.data.interestRate = this.approvedInterestRate ;
            this.loanRestructureForm.controls['interestRate'].setValue(this.approvedInterestRate );
            return;
        }
        
        var priceIndex = this.productCurrencyPriceIndex.filter(x=>x.productPriceIndexId == target.value)[0];
        if(priceIndex != null || priceIndex != undefined){ 
            this.data.interestRate = this.approvedInterestRate + priceIndex.priceIndexRate;
            this.loanRestructureForm.controls['interestRate'].setValue(this.approvedInterestRate + priceIndex.priceIndexRate);
        }
    }

    public _loanAmount = 0;
    @Input() set loanAmount(loanAmount: Number) {
        // tslint:disable-next-line:radix
        this._loanAmount = Number(parseInt(loanAmount.toString().replace(/[,]+/g, "").trim()));
        // if (loanAmount > 0) {
        //     // tslint:disable-next-line:radix
        //     this.data.principalAmount = Number(parseInt(this._loanAmount.toString().replace(/[,]+/g, "").trim()));
        //     this.principalBalance = this.data.principalAmount;
        // }
    }

    setFormElementsWithIncomingChildValues(){ 
      // if (this.loanAmount > 0) {
      //     this.data.principalAmount = ConvertString.ToNumberFormate(this.loanAmount);
      //     this.loanRestructureForm.controls['principalAmount'].setValue(ConvertString.ToNumberFormate(this.loanAmount));
      // }
      if (this.interestRate >= 0) {
          this.data.interestRate = this.interestRate;
          this.loanRestructureForm.controls['interestRate'].setValue(this.interestRate);
      }
      // if (this.integralFeeAmount > 0) {
      //     this.data.integralFeeAmount = this.integralFeeAmount;
      //     this.loanRestructureForm.controls['integralFeeAmount'].setValue(this.interestRate);
      // }
      if (this.tenor > 0) {
          this.data.tenor = this.tenor;
          this.loanRestructureForm.controls['tenor'].setValue(this.tenor);
      }
      if (this.tenorInMonths != null) {
          this.tenormonths = this.tenorInMonths;
      }
      // if(this.currencyId > 0){
      //     this.getLoanCurrenyPriceIndex(this.currencyId)
      // }

      if(this.scheduleTypeId  > 0){
          this.data.scheduleMethod = this.scheduleTypeId;
          this.loanRestructureForm.controls['scheduleMethod'].setValue(this.scheduleTypeId);
         // this.onscheduleMethodChangedOne();
      } 
      if(this.dayCountConventionId > 0 ){
          this.data.accrualBasis = this.dayCountConventionId
          this.loanRestructureForm.controls['accrualBasis'].setValue(this.dayCountConventionId);
      }   
      if(this.interestFrequencyTypeId > 0){ 
          this.loanRestructureForm.controls['interestFrequency'].setValue(this.interestFrequencyTypeId);
      }   
      if(this.principalFrequencyTypeId > 0){
          this.loanRestructureForm.controls['principalFrequency'].setValue(this.principalFrequencyTypeId);
      }
      if(this.firstInterestPaymentDate != null){
          this.loanRestructureForm.controls['intrestFirstDate'].setValue(new Date (this.firstInterestPaymentDate));
      } 
      if(this.firstPrincipalPaymentDate != null){
          this.loanRestructureForm.controls['principalFirstDate'].setValue(new Date(this.firstPrincipalPaymentDate));
      } 
  }


// ======================= open modal ========================================

openUWSModal(loan: any) {
  this.selectedLoan = loan;
  this.loanRestructureForm.patchValue({
    // effectiveDate: loan.applicationDate || '',
    principalAmount: loan.totalAmount || '',
    tenor: loan.tenor || '',
    interestRate: loan.rate || ''
  });
  this.displayRestructureModal = true; // Show the modal
  this.selectedScheduleMethod = 3;
}

clearForm() {
  // Replicate openUWSModal's default state
  this.loanRestructureForm.reset({
    scheduleMethod: '',
    effectiveDate: '',
    principalAmount: this.selectedLoan ? this.selectedLoan.totalAmount : '',
    tenor: this.selectedLoan ? this.selectedLoan.tenor : '',
    interestRate: this.selectedLoan ? this.selectedLoan.rate : '',
    interestFrequency: '',
    principalFrequency: '',
    principalFirstDate: '',
    intrestFirstDate: '',
    maturityDate: '',
    tenormonths: '',
    accrualBasis: '',
    integralFeeAmount: '',
    interestChargeType: '0',
    selectedLoan: this.selectedLoan
  });
  this.selectedScheduleMethod = 3;
  this.updateValidatorsForScheduleMethod(this.selectedScheduleMethod);
}

closeRestructureModal() {
  // Reset to default state and hide modal
  this.loanRestructureForm.reset({
    scheduleMethod: '',
    effectiveDate: '',
    principalAmount: this.selectedLoan ? this.selectedLoan.totalAmount : '',
    tenor: this.selectedLoan ? this.selectedLoan.tenor : '',
    interestRate: this.selectedLoan ? this.selectedLoan.rate : '',
    interestFrequency: '',
    principalFrequency: '',
    principalFirstDate: '',
    intrestFirstDate: '',
    maturityDate: '',
    tenormonths: '',
    accrualBasis: '',
    integralFeeAmount: '',
    interestChargeType: '0',
    selectedLoan: this.selectedLoan
  });
  this.selectedScheduleMethod = 3;
  this.updateValidatorsForScheduleMethod(this.selectedScheduleMethod);
  this.displayRestructureModal = false;
}

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0]; 
  }



// ================== Hide input fields based on the selected schedule type =======================

// scheduleTypes = [
//   { lookupId: 1, lookupName: 'Annuity' },
//   { lookupId: 2, lookupName: 'Reducing Balance' },
//   { lookupId: 3, lookupName: 'Bullet Payment' },
//   { lookupId: 4, lookupName: 'Annuity With Scheduled Repayment' },
//   { lookupId: 5, lookupName: 'Irregular Schedule' },
//   { lookupId: 6, lookupName: 'Constant Principal and Interest' },
//   { lookupId: 7, lookupName: 'Balloon Payment' }
// ];

selectedScheduleMethod: number | null = null;

onScheduleMethodChange(event: any) {
  this.selectedScheduleMethod = Number(event.target.value);
  const scheduleMethodControl = this.loanRestructureForm.get('scheduleMethod');
  if (scheduleMethodControl) {
    scheduleMethodControl.setValue(this.selectedScheduleMethod);
  }
  this.updateValidatorsForScheduleMethod(this.selectedScheduleMethod);
}

updateValidatorsForScheduleMethod(method: number | null) {
  if (!method) return;

  const controls = this.loanRestructureForm.controls;

  // Clear all validators first
  Object.keys(controls).forEach(key => {
    controls[key].clearValidators();
    controls[key].updateValueAndValidity({ emitEvent: false });
  });

  // Always required fields
  controls['scheduleMethod'].setValidators(Validators.required);
  controls['principalAmount'].setValidators([Validators.required, Validators.min(0)]);
  controls['effectiveDate'].setValidators(Validators.required);
  controls['interestRate'].setValidators([Validators.required, Validators.min(0)]);
  controls['maturityDate'].setValidators(Validators.required);
  controls['accrualBasis'].setValidators(Validators.required);
  controls['tenormonths'].setValidators(Validators.required);
  controls['tenor'].setValidators([Validators.required, Validators.min(1)]);

  // Conditional fields for methods 1, 2, 4, 6
  if ([1, 2, 4, 6].indexOf(method) !== -1) {
    controls['interestFrequency'].setValidators(Validators.required);
    controls['principalFrequency'].setValidators(Validators.required);
    controls['intrestFirstDate'].setValidators(Validators.required);
    controls['principalFirstDate'].setValidators(Validators.required);
  }
  // Conditional fields for method 7 (interestFrequency and intrestFirstDate only)
  else if (method === 7) {
    controls['interestFrequency'].setValidators(Validators.required);
    controls['intrestFirstDate'].setValidators(Validators.required);
  }

  // Update validity for all controls
  Object.keys(controls).forEach(key => {
    controls[key].updateValueAndValidity({ emitEvent: false });
  });

  // Force UI validation display for conditional fields if invalid
  const conditionalFields = ['interestFrequency', 'principalFrequency', 'intrestFirstDate', 'principalFirstDate', 'accrualBasis', 'scheduleMethod', 'principalAmount', 'effectiveDate', 'interestRate', 'maturityDate', 'tenor'];
  conditionalFields.forEach(field => {
    const control = controls[field];
    if (control.invalid) {
      control.markAsTouched();
      control.markAsDirty();
    }
  });
}

 isFieldVisible(fieldName: string): boolean {
    if (!this.selectedScheduleMethod) return false;

    const showAll = [1, 2, 4, 6].indexOf(this.selectedScheduleMethod) !== -1;
    const showDefault = this.selectedScheduleMethod === 3;
    const showWithoutPrincipalFields = this.selectedScheduleMethod === 7;

    const defaultFields = ['scheduleMethod', 'principalAmount', 'effectiveDate', 'interestRate', 'maturityDate', 'tenor', 'accrualBasis', 'tenormonths'];

    if (showAll) return true;
    if (showDefault) return defaultFields.indexOf(fieldName) !== -1;
    if (showWithoutPrincipalFields) return fieldName !== 'principalFrequency' && fieldName !== 'principalFirstDate';

    return defaultFields.indexOf(fieldName) !== -1;
  }


  // ====================== Downloand and Generate Schedule ==========================================

   DownloadSchedule(formObj) {
          this.loadingService.show();
          var payments = [];
          payments.push({
              paymentDate: new Date(),
              paymentAmount: 500
          });
  
          let body = {
              scheduleMethodId: this.data.scheduleMethod,
              principalAmount: this.data.principalAmount,
              effectiveDate: formObj.value.effectiveDate,
              interestRate: formObj.value.interestRate,
              principalFrequency: formObj.value.principalFrequency,
              interestFrequency: formObj.value.interestFrequency,
              tenor: formObj.value.tenor,
              principalFirstpaymentDate: formObj.value.principalFirstDate,
              interestFirstpaymentDate: formObj.value.intrestFirstDate,
              maturityDate: formObj.value.maturityDate,
              accrualBasis: formObj.value.accrualBasis,
              integralFeeAmount: formObj.value.integralFeeAmount,
              firstDayType: formObj.value.interestChargeType,
              irregularPaymentSchedule: payments,
              formData: this.loanRestructureForm.value,
          };
          this.loanSrv.getScheduleInExcelFormat(body).subscribe((response: any) => {
              this.loadingService.hide();
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
                     // window.navigator.msSaveBlob(textFileAsBlob, 'Schedule.xlsx');
                  }
              }
          });
      }


  closeModal() {
    this.displayScheduleModalForm = false;
    //this.fetchTranchedLoans(10);
  }
  
  onSubmit({ value, valid }: { value: LoanSchedule, valid: boolean }): void {
    if (!valid) {
        swal("FinTrak Credit 360", "Please fill all required fields correctly.", "error");
        return;
    }

    this.loadingService.show();

    var payments = [];
    payments.push({
        paymentDate: new Date(),
        paymentAmount: 500
    });

    let body = {
        loanId: this.selectedLoan.id,
        scheduleMethodId: value.scheduleMethod,
        principalAmount: value.principalAmount,
        effectiveDate: value.effectiveDate,
        interestRate: value.interestRate,
        principalFrequency: value.principalFrequency,
        interestFrequency: value.interestFrequency,
        tenor: value.tenor,
        principalFirstpaymentDate: value.principalFirstDate,
        interestFirstpaymentDate: value.intrestFirstDate,
        maturityDate: value.maturityDate,
        accrualBasis: value.accrualBasis,
        integralFeeAmount: value.integralFeeAmount,
        firstDayType: value.interestChargeType,
        irregularPaymentSchedule: payments,
        formData: this.loanRestructureForm.value,
    };

    this.underwritingService.generatePeriodicLoanScheduleNMRC(body)
        .subscribe(
            (res) => {
                this.loadingService.hide();
                if (res.success) {
                   swal("Success!", "Loan successfully generated!", "success")
                   .then(() => {

                });
                    if (res.result.length) {
                        var details = {
                            principalAmount: value.principalAmount,
                            interestRate: value.interestRate,
                            effectiveDate: value.effectiveDate,
                            maturityDate: value.maturityDate,
                            effectiveInterestRate: 0,
                            schedules: res.result
                        };

                        this.schedules = details.schedules;
                        this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
                        details.maturityDate = this.maturityDate;
                        details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
                        this.scheduleHeader = details;

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
                            formData: this.loanRestructureForm.value,
                        };

                        this.notify.emit(scheduleDetailsForLoanBooking);
                        this.displayScheduleModalForm = true;
                        // Show success message and update modal states after confirmation
                        // swal("Success!", "Loan successfully scheduled", "success")
                        //  .then(() => {
                        //     this.displayRestructureModal = false;
                        //     this.displayScheduleModalForm = true;
                        // });

                        // this.clearForm();
                        // this.fetchTranchedLoans(10);
                    }
                } else {
                    swal("FinTrak Credit 360", res.message || "An unexpected error occurred.", "error");
                }
            },
            (err) => {
                this.loadingService.hide();
                let errorMessage = "An error occurred while processing your request.";
                if (err.error && err.error.message) {
                    errorMessage = err.error.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                swal("FinTrak Credit 360", errorMessage, "error");
            }
        );
    }

    // onSubmitLoanTerm({ value, valid }: { value: LoanSchedule, valid: boolean }): void {
    //   if (!valid) {
    //       swal("FinTrak Credit 360", "Please fill all required fields correctly.", "error");
    //       return;
    //   }
  
    //   this.loadingService.show();
  
    //   var payments = [];
    //   payments.push({
    //       repaymentDate: new Date(),
    //       paymentAmount: 500
    //   });
  
    //   let body = {
    //       loanId: this.selectedLoan.id,
    //       scheduleMethodId: value.scheduleMethod,
    //       proposedAmount: value.principalAmount,
    //       requestedAmount: value.principalAmount,
    //       effectiveDate: value.effectiveDate,
    //       proposedRate: value.interestRate,
    //       principalFrequency: value.principalFrequency,
    //       interestFrequency: value.interestFrequency,
    //       proposedTenor: value.tenor,
    //       principalFirstpaymentDate: value.principalFirstDate,
    //       interestFirstpaymentDate: value.intrestFirstDate,
    //       maturityDate: value.maturityDate,
    //       accrualBasis: value.accrualBasis,
    //       // integralFeeAmount: value.integralFeeAmount,
    //       // firstDayType: value.interestChargeType,
    //       // irregularPaymentSchedule: payments,
    //       // formData: this.loanRestructureForm.value,
    //   };
  
    //   this.underwritingService.postLoanTerms(body)
    //       .subscribe(
    //           (res) => {
    //               this.loadingService.hide();
    //               if (res.success) {
    //                  swal("Success!", "Loan successfully scheduled!", "success")
    //                  .then(() => {
    //                   this.displayRestructureModal = false;
    //                   this.clearForm();
    //                   this.fetchTranchedLoans(10);
    //               });
    //               } else {
    //                   swal("FinTrak Credit 360", res.message || "An unexpected error occurred.", "error");
    //               }
    //           },
    //           (err) => {
    //               this.loadingService.hide();
    //               let errorMessage = "An error occurred while processing your request.";
    //               if (err.error && err.error.message) {
    //                   errorMessage = err.error.message;
    //               } else if (err.message) {
    //                   errorMessage = err.message;
    //               }
    //               swal("FinTrak Credit 360", errorMessage, "error");
    //           }
    //       );
    //   }

    onSubmitLoanTerm({ value, valid }: { value: LoanSchedule, valid: boolean }): void {
      if (!valid) {
          swal("FinTrak Credit 360", "Please fill all required fields correctly.", "error");
          return;
      }
  
      swal({
          title: "Confirm Loan Schedule",
          text: "Are you sure you want to schedule the loan?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, schedule it!",
          cancelButtonText: "Cancel"
      }).then((confirmed) => {
          if (confirmed) { 
              this.loadingService.show();
  
              if (!this.selectedLoan || !this.selectedLoan.id) {
                  this.loadingService.hide();
                  swal("FinTrak Credit 360", "Loan selection is required.", "error");
                  return;
              }
  
              let body = {
                  loanId: this.selectedLoan.id,
                  loanApplicationDetail: {
                    proposedAmount: value.principalAmount,
                    requestedAmount: value.principalAmount,
                    proposedRate: value.interestRate,
                    proposedTenor: value.tenor,
                    loanPurpose: 'non-mortgage',
                  }

              };
  
              this.underwritingService.postLoanTerms(body)
                  .subscribe(
                      (res) => {
                          this.loadingService.hide();
                          if (res.success) {
                            swal("Success!", "Loan successfully submitted!", "success")
                              .then(() => {
                                  this.displayRestructureModal = false;
                                  this.clearForm();
                                  this.fetchTranchedLoans(10);
                              });
                          } else {
                            swal("FinTrak Credit 360", res.message || "An unexpected error occurred.", "error");
                          }
                      },
                      (err) => {
                          this.loadingService.hide();
                          let errorMessage = "An error occurred while processing your request.";
                          if (err.error && err.error.message) {
                              errorMessage = err.error.message;
                          } else if (err.message) {
                              errorMessage = err.message;
                          }
                          swal("FinTrak Credit 360", errorMessage, "error");
                      }
                  );
          }
      });
  }
  

}


