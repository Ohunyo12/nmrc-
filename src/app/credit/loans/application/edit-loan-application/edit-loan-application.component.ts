// import { FormGroup } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-edit-loan-application',
//   templateUrl: './edit-loan-application.component.html',
// })
// export class EditLoanApplicationComponent implements OnInit {
//   editFacilityDetailsForm: FormGroup;
//   [x: string]: any;
//   readonly CASH_BACKED = 5; readonly INVOICE_DISCOUNTING = 6; readonly FIRST_EDUCATION = 7; readonly FIRST_TRADERS = 8; readonly IMPORT_FINANCE = 9; readonly BOND_AND_GUARANTEES = 10;
//   readonly TEAM_LOAN = 1; readonly COMMERIAL_LOAN = 2; readonly RETAIL_LOAN = 3; readonly INDIVIDUAL_LOAN = 4;
//   isInvoiceBased: boolean = false; displayCashBacked: boolean = false; displayInvoiceDiscounting: boolean = false; displayFirstEdu: boolean = false; displayFirstTraders: boolean = false; displayImportFinance: boolean = false; displayBondAndGuarantees: boolean = false; displayTeamloan: boolean = false;
//   displayLiveEdit: boolean = false;
//   cashBackedForm: FormGroup;
//   facilityTradderDetailsForm: FormGroup
//   disableControl: boolean = false
//   tenorMode: number;
//   allowedCurrencies: any[] = [];
//   invoiceTable: any[] = [];
//   collectFeesLebel: string; invoiceInfo: FormGroup;
//   programmType: string;
//   marketLocations: any[] = [];
//   es: any; bondDetails: any; startdate: Date; enddate: Date;
//   traderLoan: ITraderLoan; educationLoan: IEducationLoan; customerLimitMoney: number;
//   projectName: string = "Total Project Amount (NGN)"
//   newCustomerinfo: any; resetFirstTraders: boolean = false; requireCollateral: boolean = true; facilityAmount: number;
//   currencyId: number; proposedProductId: number; principal: any[]; parcentage: string; showParcentage: boolean = false;
//   displayFacilityDetails: boolean = false; loanDetails: ILoanApplicationDetail[] = []; resetBondAndGuarantees: boolean = false;
//   facilityDetailsForm: FormGroup; loanApplicationDetails: any[] = []; TotalAmount: number = 0; MaximumTenor: number = 0; selectedCustomer: string; currencies: any[]; filteredProducts: any[]; groupMembers: any[]; loanApplicationReferance: number = 0; getFilteredProducts: any[]; facilityTypes: any[];
//   filteredSubsector: any[]; products: any[]; sector: any[]; subsector: any[]; selectedSectorId: number = -1; accountOwner: any[] = []; productClasses: any[]; selectedProductClassId: number = -1; exchange: any = {}; //displayFacilityDetails: boolean = false;
//   customerNameOrGroup: string; customers: any; proposedAmount: string; IsBaseCurrency: boolean; exchangeValue: number; exchangeRate: string; customerAccount: any; documentTitle: string; displayInvoiceDetails: boolean = false;
//   disableUpload: boolean = false; invoiceNumber: string; purchaseOrderNumber: string; contractNumber: string; invoiceDocDate: string; invoiceAmount: string; maximumRate: number = 100; minimumRate: number = 0; maximumTenor: number; minimumTenor: number = 0;
//   displayBGUpload: boolean = false; refenceNoBG: string; feesCollected: any; pAmount: any; requireCasaAccount: boolean;
//   extensionData: any[]; invoiceStatus: boolean = true; dayInterval: number; customerType: string; requireEquityContribution: boolean = false;
//   isProductProgram: boolean = false;
//   @Input() customerGroupId: number;
//   @Input() loanTypeId: number;
//   @Input() customerId: number;
//   @Input() productClassId: number;
//   @Input() customerName: string;
//   @Input() newLoanApplicationId: number;
//   @Input() ApplicationRef: number;
//   @Input() maximumAmount: number;
//   @Input() utilizedAmount: number;
//   @Input() loanApplication: ILoanApplication;
//   @Output() facilityDetailsData = new EventEmitter<any[]>();
//   @Output() closeWindow = new EventEmitter<boolean>();
//   loanApplicate: ILoanApplication;
//   displayInvoice: boolean = false;
//   invoiceEditMode: boolean = false;
//   editInvoiceData: any;
//   constructor() { }

//   ngOnInit() {
//   }

// }


// import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
// import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, Attribute, NgZone, ElementRef } from '@angular/core';
// import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, Validator } from '@angular/forms';
// import { CasaService } from '../../../../customer/services/casa.service';
// import { LoanApplicationService } from '../../../services/loan-application.service';
// import { ProductService } from '../../../../setup/services/product.service';
// import { LoanService } from '../../../services/loan.service';
// import { CurrencyService } from '../../../../setup/services/currency.service';
// import { LoadingService } from '../../../../shared/services/loading.service';
// import { CustomerGroupService } from '../../../../customer/services/customer-group.service';
// import { CustomerService } from '../../../../customer/services/customer.service';
// import { IApplicationInfo, ILoanApplication, IProductFees, IInvoiceDetails, ILoanApplicationDetail, ITraderLoan, IEducationLoan } from '../loanApplicationInfo.interface'
// import { GlobalConfig, ConvertString, TenorType } from '../../../../shared/constant/app.constant';
// import swal from 'sweetalert2';
// import { log } from 'util';
// import { FormArray } from '@angular/forms/src/model';
// import { fail } from 'assert';
// import { FirstTraderComponent } from './extentions/first-trader.component';
// import { convertToParamMap } from '@angular/router/src/shared';
// import { ChildSectorLimitComponent } from '../limits/sector-limit.component';

// function ValidateGreaterThanZero(c: AbstractControl): { [key: string]: boolean } | null {

//   if (c.value == undefined && isNaN(c.value) || c.value <= 0) {
//     return { zero: true }
//   }
//   return null;
// }



//   //@ViewChild() sectorialLimit: ChildSectorLimitComponent;

//   constructor(private fb: FormBuilder, private casaService: CasaService, private loanAppService: LoanApplicationService,
//     private productService: ProductService, private loanService: LoanService, private currencyService: CurrencyService,
//     private loadingSrv: LoadingService, private CustomerGroupSer: CustomerGroupService, private customerService: CustomerService,
//     private camService: CreditAppraisalService, private zone: NgZone
//   ) { }

//   ngOnInit() {
//     this.InitfacilityDetailsForm();
//     this.switchForms();
//     this.loadDropdowns();
//     this.getAllPrincipal();
//     this.getAllCurrencies();
//     this.collectFeesLebel = 'Previous Term School Fees'
//     this.facilityDetails();
//     this.initInvioce();
//     this.facilityDetailsForm.controls["customerId"].setValue(this.customerId);

//     this.facilityDetailsForm.get("proposedAmount").valueChanges
//       .subscribe(value => {
//         let curId = +this.facilityDetailsForm.get("currencyId").value;
//         this.getExchangeRate(curId);
//       });
//     this.facilityDetailsForm.get("invoiceValue").valueChanges
//       .subscribe(value => {
//         let rate = this.facilityDetailsForm.get("fcyRate").value;
//         let amount = (rate * +ConvertString.TO_NUMBER(value)) * (this.productLimit * 0.01);
//         this.facilityDetailsForm.controls["lcyInvoiceValue"].setValue(rate * +ConvertString.TO_NUMBER(value));
//         this.productAmount = 0; this.productAmount = amount;
//         //this.facilityDetailsForm.controls["proposedAmount"].setValue(amount);
//       });

//     this.facilityDetailsForm.get("lcyInvoiceValue").valueChanges
//       .subscribe(value => {
//         let amount = +ConvertString.TO_NUMBER(value) * (this.productLimit * 0.01);
//         // this.facilityDetailsForm.controls["proposedAmount"].setValue(amount);
//         this.productAmount = 0; this.productAmount = amount;
//       });

//     this.facilityDetailsForm.get("proposedAmount").valueChanges
//       .subscribe(value => {
//         let FXrate = this.facilityDetailsForm.get("loanfcyRate").value;
//         ////console.log("FXrate", FXrate);

//         let amount = +ConvertString.TO_NUMBER(value) / FXrate;
//         ////console.log("amount", amount);
//         this.facilityDetailsForm.controls["exchangeAmount"].setValue(amount);
//         // this.calculateEquityRatio()
//       });
//   }
//   showInvoiceData() {
//     this.displayInvoice = true;
//   }
//   lsectorLimit: number;
//   osectorLimit: number;
//   getSectorLimit(sectorId) {
//     this.loanAppService.getSectorLimit(sectorId)
//       .subscribe((res) => {
//         ////console.log(res.result);
//         this.sectorLimitData = res.result;
//         this.osectorLimit = res.result.outstandingBalance;
//         this.lsectorLimit = res.result.limit;

//       }, (err) => {
//         ////console.log(err);
//       });
//   }


//   editInvoice(data) {
//     this.invoiceEditMode = true;
//     this.invoiceInfo.patchValue({
//       invoiceAmount: data.invoiceValue,
//       contractNumber: data.contractNo,
//       invoiceNumber: data.invoiceNo,
//       purchaseOrderNumber: data.purchaseOrderNumber,
//       invoiceDocDate: data.invoiceDate,
//       invoiceDocument: data.invoiceDocument,
//       certificateNumber: data.certificateNumber
//     });
//     this.editInvoiceData = data;
//     this.invoiceInfo.controls["invoiceDocument"].setValue(data.invoiceDocument)
//     // this.fileInput.nativeElement.value = data.invoiceDocument;
//     this.displayInvoiceDetails = true;
//   }
//   removeInvoiceDetails(evt, indx) {

//     evt.preventDefault();
//     const currRecord = this.invoiceTable[indx];
//     const d = ConvertString.TO_NUMBER(currRecord.invoiceValue);
//     var invValue = 0;
//     invValue = ConvertString.TO_NUMBER(this.facilityDetailsForm.get("invoiceValue").value);

//     let bal = +ConvertString.TO_NUMBER(invValue) - +ConvertString.TO_NUMBER(d);

//     this.facilityDetailsForm.controls["invoiceValue"].setValue(bal);
//     this.invoiceTable.splice(indx, 1);
//     //  this.deleteUpload(currRecord.invoiceNo, this.ApplicationRef);
//     if (this.invoiceTable.length == 0) this.displayInvoice = false

//   }

//   calculateEquityRatio() {

//     let doCalc: boolean = true;
//     let totalAmountRequired = (+ConvertString.TO_NUMBER(this.facilityDetailsForm.get("totalAmountRequired").value));
//     let equityAmount = (+ConvertString.TO_NUMBER(this.facilityDetailsForm.get("equityAmount").value));

//     if (isNaN(totalAmountRequired) || equityAmount == undefined)
//       doCalc = false
//     if (isNaN(equityAmount) || equityAmount == undefined)
//       doCalc = false

//     if (doCalc && equityAmount > 0 && totalAmountRequired > 0) {

//       if (+ConvertString.TO_NUMBER(totalAmountRequired) < +ConvertString.TO_NUMBER(equityAmount)) {
//         let control = this.facilityDetailsForm.patchValue({
//           equityAmount: 0,
//           proposedAmount: 0
//         });
//         this.showParcentage = false;
//         this.parcentage = "";
//         swal(`${GlobalConfig.APPLICATION_NAME}`, "Equity Contribution is more than Total Amount", 'warning');
//         return;
//       }

//       const result = +(+ConvertString.TO_NUMBER(equityAmount) / (+ConvertString.TO_NUMBER(totalAmountRequired)) * 100).toFixed(2);
//       this.parcentage = result.toString();
//       this.showParcentage = true;
//       if (result >= this.requiredEquity) {
//         const bankContribution = ((100 - result) * 0.01) * totalAmountRequired
//         if ((100 - result) >= 50) this.requireCollateral = false;
//         this.facilityAmount = (+ConvertString.TO_NUMBER(totalAmountRequired)) - +ConvertString.TO_NUMBER(equityAmount);
//         if (!isNaN(this.customerLimitMoney) && this.customerLimitMoney != undefined &&
//           this.customerLimitMoney != null && this.customerLimitMoney >= bankContribution) {
//           let control = this.facilityDetailsForm.patchValue({
//             proposedAmount: (+ConvertString.TO_NUMBER(totalAmountRequired)) - +ConvertString.TO_NUMBER(equityAmount), // bankContribution.toFixed(2),
//           });
//         } else {
//           this.showParcentage = false;
//           this.parcentage = "";
//           const str = `Maximum product limit of ${this.customerLimitMoney} is exceeded.`
//           swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
//         }

//       } else {
//         let control = this.facilityDetailsForm.patchValue({
//           equityAmount: 0,
//           proposedAmount: 0,
//         });

//         const str = `Minimum equity contribution of ${this.requiredEquity}% is not met`
//         swal(`${GlobalConfig.APPLICATION_NAME}`, str, 'warning');
//         this.loadingSrv.hide();
//       }
//     }
//   }

//   getFirstTraders(data: FormGroup) {
//     this.traderLoan = {
//       marketId: data.value.marketId,
//       averageMonthlyTurnover: data.value.averageMonthlyTurnover,
//       soldItems: data.value.soldItems
//     }
//   }

//   getBondGuranty(data: FormGroup) {

//     const bond = data.value;
//     this.bondDetails = {
//       casaAccountId: bond.casaAccountId,
//       principalId: bond.principalId,
//       bondAmount: bond.bondAmount,
//       bondCurrencyId: bond.bondCurrencyId,
//       contractStartDate: bond.contractStartDate,
//       contractEndDate: bond.contractEndDate,
//       isTenored: bond.isTenored,
//       isBankFormat: bond.isBankFormat,
//       bondfcyRate: bond.bondfcyRate,
//       bondfcyAmount: bond.bondfcyAmount
//     }
//     ////console.log("bondDetails",data.value);        
//   }


//   getEducationLoan(data: FormGroup) {
//     this.educationLoan = {
//       averageSchoolFees: data.value.averageSchoolFees,
//       numberOfStudent: data.value.numberOfStudent,
//       schoolFeesCollected: data.value.schoolFeesCollected
//     }
//   }

//   onTenorModeChange(tenorModeId) {
//     this.tenorMode = tenorModeId;
//     ////console.log("tenorMode", this.tenorMode);

//     this.facilityDetailsForm.patchValue({
//       'tenorModeId': tenorModeId
//     });
//   }

//   validateAmount: boolean;
//   amountValidation: string;
//   checkInvoiceAmount() {
//     let amount = ConvertString.TO_NUMBER(this.proposedAmount);
//     let documentAmounts = this.facilityDetailsForm.get("lcyInvoiceValue").value;
//     if (+(ConvertString.TO_NUMBER(documentAmounts)) >= +(ConvertString.TO_NUMBER(amount))) {
//       this.validateAmount = false;
//     }
//     else {
//       this.validateAmount = true;
//       let rate = this.facilityDetailsForm.get("fcyRate").value;
//       let amount = + ConvertString.TO_NUMBER(this.validateLoanAmountOnLimit(documentAmounts, rate));
//       this.facilityDetailsForm.get("proposedAmount").setValue(amount);
//       this.amountValidation = `Loan amount can not more than ${this.productLimit}% of the invoice value`
//     }
//   }

//   validateLoanAmountOnLimit(loanAmount, rate?): number {
//     rate = (rate == null || rate == "") ? 1 : rate
//     let amount = (rate * +ConvertString.TO_NUMBER(loanAmount)) * (this.productLimit * 0.01);
//     return amount
//   }


//   closeFacilityDetails() {
//     ////console.log(this.displayFacilityDetails);
//     this.closeWindow.emit(this.displayFacilityDetails);
//   }




//   initInvioce() {
//     this.invoiceInfo = this.fb.group({
//       // contractNumber: ['', Validators.required],
//       contractNumber: [''],
//       invoiceNumber: ['', Validators.required],
//       invoiceDocDate: ['', Validators.required],
//       invoiceAmount: ['', Validators.required],
//       invoiceDocument: ['', Validators.required],
//       purchaseOrderNumber: ['', Validators.required],
//       certificateNumber: ['', Validators.required],
//     });
//   }



//   onAdd() {
//     let newinvoices = this.facilityDetailsForm.get('addinvoices').value;
//     const ivi = this.invoiceInfo.value;
//     let duplicate: boolean;
//     if (this.invoiceTable.length > 0) {
//       if (this.invoiceEditMode == false) {
//         if (this.invoiceTable.find(x => x.contractNo == ivi.contractNumber) != null) {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Contract Number already exist.', 'error');
//           return;
//         } else if (this.invoiceTable.find(x => x.invoiceNo == ivi.invoiceNumber) != null) {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Invoice Number already exist.', 'error');
//           return;
//         } else if (this.invoiceTable.find(x => x.purchaseOrderNumber == ivi.purchaseOrderNumber) != null) {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Purchase Order Number already exist.', 'error');
//           return;
//         } else if (this.invoiceTable.find(x => x.certificateNumber == ivi.certificateNumber) != null) {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, 'This Certificate Number already exist.', 'error');
//           return;
//         }
//       }
//     }

//     let data = {
//       customerId: this.customerId,
//       productId: this.proposedProductId,
//       principalId: this.principalId,
//       documentNo: ivi.invoiceNumber,
//       purchaseOrderNumber: ivi.purchaseOrderNumber,
//       contractNumber: ivi.contractNumber,
//       certificateNumber: ivi.certificateNumber
//     };
//     this.loanAppService.validateInvoiceDetail(data).subscribe((res) => {
//       if (res.result == false) {
//         let invoiceObj = {
//           contractNo: ivi.contractNumber,
//           invoiceNo: ivi.invoiceNumber,
//           invoiceDate: ivi.invoiceDocDate,
//           invoiceValue: ivi.invoiceAmount,
//           purchaseOrderNumber: ivi.purchaseOrderNumber,
//           invoiceDocument: ivi.file,
//           certificateNumber: ivi.certificateNumber
//         }
//         if (this.invoiceEditMode == false) {
//           this.invoiceTable.push(invoiceObj);
//         } else {
//           var index = this.invoiceTable.indexOf(this.editInvoiceData);
//           if (index !== -1) {
//             this.invoiceTable[index] = invoiceObj;
//           }
//         }
//         this.documentTitle = 'Invoice document with Invoice No: ' + this.invoiceNumber;
//         this.uploadFile();
//         this.fileInput.nativeElement.value = "";
//         this.calculateInvoiceTotal();
//         this.invoiceEditMode = false;
//         this.editInvoiceData = null;
//         this.displayInvoiceDetails = false;
//         this.invoiceInfo.reset();
//       } else {
//         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Invoice/Contract Number/Certificate Number/Purchase Order Number already exist.', 'error');
//         //  this.invoiceInfo.reset();
//         return;
//       }
//     });
//   }


//   totalInvoiceValue: number;
//   productAmount: number;

//   closeInvoiceDetail() {
//     if (this.editmode) {
//       this.displayInvoiceDetails = false;
//       this.displayInvoice = true;
//     } else
//       this.displayInvoiceDetails = false;
//   }


//   calculateInvoiceTotal(): void {
//     //const invoice: IInvoiceDetails[] = this.addinvoices.value;invoiceValue
//     let sum: number = 0;

//     this.facilityDetailsForm.controls["invoiceValue"].setValue(0);
//     //this.invoiceInfo.controls["invoiceAmount"].setValue(0); 
//     for (let i = 0; this.invoiceTable.length > i; i++) {
//       sum = +sum + +(ConvertString.TO_NUMBER(this.invoiceTable[i].invoiceValue));
//     }
//     this.facilityDetailsForm.controls["invoiceValue"].setValue(sum);
//     // this.invoiceInfo.controls["invoiceAmount"].setValue(sum);
//     let id = this.facilityDetailsForm.value.invoiceCurrencyId
//     this.getExchangeRateInvoice(id);
//   }

//   checkDuplicateInvoice(invoiceNo): boolean {
//     //const invoice: IInvoiceDetails[] = this.addinvoices.value;
//     let sum: number = 0;

//     for (let i = 0; this.invoiceTable.length > i; i++) {
//       if (this.invoiceTable[i].invoiceNo === invoiceNo) {
//         return true;
//       } else {
//         return false
//       }
//     }
//   }
//   setIDValidation() {
//     this.facilityDetailsForm.get('invoiceValue').setValidators(Validators.required);
//     this.facilityDetailsForm.get('lcyInvoiceValue').setValidators(Validators.required);
//     this.facilityDetailsForm.get('contractExpiryDate').setValidators(Validators.required);
//     this.facilityDetailsForm.get('contractDate').setValidators(Validators.required);
//   }
//   switchForms() {
//     this.isProductProgram = false;
//     this.resetFacilityTypes()
//     switch (+this.productClassId) {

//       case this.INVOICE_DISCOUNTING:
//         this.setIDValidation();
//         this.isProductProgram = true;
//         this.facilityDetailsForm.get('tenorModeId').setValue(2);
//         this.displayInvoiceDiscounting = true; break;
//       case this.FIRST_EDUCATION:
//         this.isProductProgram = true;
//         this.displayFirstEdu = true; break;
//       case this.FIRST_TRADERS:
//         this.isProductProgram = true;
//         this.displayFirstTraders = true; break;
//       case this.BOND_AND_GUARANTEES:
//         this.isProductProgram = true;
//         this.displayBondAndGuarantees = true; break;
//       case this.IMPORT_FINANCE:
//         this.isProductProgram = true;
//         this.projectName = "Total Invoice Amount (NGN)"
//         this.displayImportFinance = true; break;
//     }
//   }

//   resetFacilityTypes() {

//     this.displayInvoiceDiscounting = false;
//     this.displayFirstEdu = false;
//     this.displayFirstTraders = false;
//     this.displayBondAndGuarantees = false;
//   }

//   tenorType: any[] = []
//   loadDropdowns() {
//     this.getAccountOwner();
//     this.GetFilteredSubsector();
//     this.getAllCustomerAccount(this.customerId)
//     this.getAllPrincipal();
//     this.getfacilityTypes();
//     this.GetFilteredProducts();
//     this.tenorType = TenorType.list;
//     this.loanAppService.getSector().subscribe((response: any) => {
//       this.sector = response.result;
//     });
//     this.loanAppService.getSubSector().subscribe((response: any) => {
//       this.subsector = response.result;
//     });
//   }

//   getAllPrincipal() {
//     this.loanAppService.getLoanPrincipals()
//       .subscribe((response: any) => {
//         this.principal = response.result;
//         ////console.log('loanPrincipal ', this.loanPrincipal);
//       }, (err) => {
//         ////console.log('server error', err);
//       });
//   }

//   ClickDone() {
//     this.facilityDetailsData.emit(this.loanApplicationDetails);
//     this.loanApplicationDetails = [];
//   }

//   feesCollection: IProductFees[];
//   feesData(event: IProductFees[]) {
//     this.feesCollection = [];
//     ////console.log('fees', event);

//     for (let i = 0; event.length > i; i++) {
//       let body = {
//         feeId: event[i].feeId,
//         feeName: event[i].feeName,
//         rate: event[i].rate,
//       }
//       this.feesCollection.push(body);
//     }
//   }

//   facilityDetails() {

//     if (this.loanTypeId.toString() !== "undefined" || this.loanTypeId > 0) {
//       this.groupMembers = [];

//       let newCustomerinfo: any = {}
//       this.newCustomerinfo

//       if (+this.loanTypeId == 2) {
//         this.customerNameOrGroup = "Group Members";
//         this.CustomerGroupSer.getGroupsMembers(this.customerGroupId)
//           .subscribe((response: any) => {
//             this.groupMembers = response.result;
//             ////console.log("group Members", this.groupMembers);
//           });
//       }

//       if (+this.loanTypeId === 1) {
//         this.customerNameOrGroup = "Customer Name";
//         this.customerService.getCustomerById(this.customerId).subscribe((response: any) => {
//           this.groupMembers = response.result;
//           ////console.log("groupMembers", this.groupMembers);

//         }, (err: any) => {
//           ////console.log(err);
//         });
//       }
//     }
//   }
//   onSectorClassChange(id) {
//     if (id == '' || id == null) {
//       id = -1;
//       this.filteredSubsector = [];
//     }

//     this.selectedProductClassId = id;
//     this.filteredSubsector = this.subsector.filter(x => x.sectorId == +id);
//     this.getSectorLimit(id);
//   }

//   getAccountOwner() {
//     this.accountOwner.push({ name: 'Owner Account', value: 1 });
//     this.accountOwner.push({ name: 'Third Party Account', value: 2 });
//   }

//   setCurrency(exchangeRate: string, exchangeAmount: number, IsBaseCurrency: boolean): void {
//     this.facilityDetailsForm.patchValue({
//       exchangeRate: exchangeRate,
//       exchangeAmount: exchangeAmount
//     });
//   }

//   getExchangeRate(id: number) {
//     if (id != undefined || id != null)
//       this.exchangeValue = 0;
//     this.loanAppService.getExchangeRate(id)
//       .subscribe((res) => {
//         this.exchange = res.result;
//         if (this.exchange !== undefined && this.exchange.sellingRate !== undefined) {
//           const principalAmount: number = ConvertString.TO_NUMBER(this.proposedAmount);
//           this.exchangeValue = +principalAmount * this.exchange.sellingRate;
//           this.IsBaseCurrency = this.exchange.isBaseCurrency;
//           this.setCurrency(this.exchange.sellingRate, this.exchangeValue, this.IsBaseCurrency)
//           this.exchangeRate = this.exchange.sellingRate;
//           if (this.sellingRate == 1) this.IsBaseCurrency = true;
//           if (this.IsBaseCurrency)
//             this.exchangeRate = "N/A";
//         }

//       }, (err) => {
//         this.loadingSrv.hide();
//       });
//   }
//   dayCount: number; invoicefuturedate: boolean = false;
//   checkDocumentValidity() {
//     const inv = this.invoiceInfo.value;
//     let data = {
//       productId: this.proposedProductId,
//       date: inv.invoiceDocDate
//     }
//     this.loanAppService.documentDateValidation(data)
//       .subscribe((response: any) => {
//         this.invoicefuturedate = false
//         this.invoiceStatus = true;
//         let data = response.result;
//         if (data.dayCount < 0) this.invoicefuturedate = true;
//         if (!data.invoiceStatus > data.dayInterval) this.invoiceStatus = false;
//         this.dayInterval = data.dayInterval;
//       });
//   }

//   getCurrenciesbyProduct(id) {
//     this.currencyService.getAllCurrenciesbyProduct(id)
//       .subscribe((res) => {
//         this.currencies = res.result;
//         ////console.log(this.currencies);
//       }, (err) => {
//         ////console.log(err);
//       });
//   }

//   getAllCurrencies() {
//     this.currencyService.getAllCurrencies()
//       .subscribe((res) => {
//         this.allowedCurrencies = res.result;
//         ////console.log("currencies", this.allowedCurrencies);
//       }, (err) => {
//         ////console.log(err);
//       });
//   }

//   GetFilteredProducts() {
//     this.filteredProducts = [];
//     ////console.log("productClassId", this.productClassId);

//     this.productService.getAllProductsByProductClass(this.productClassId, this.loanApplication.customerTypeId)
//       .subscribe((response: any) => {
//         this.filteredProducts = response.result;
//         ////console.log("filteredProducts", response.result);
//       });
//   }
//   GetFilteredSubsector() {
//     this.filteredSubsector = [];
//     this.loanAppService.getSubSector().subscribe((response: any) => {
//       this.filteredSubsector = response.result;
//       ////console.log('filteredSubsector', this.filteredSubsector);
//     });
//   }
//   getfacilityTypes() {
//     this.facilityTypes = [];
//     this.loanService.getLoanTypes()
//       .subscribe((response: any) => {
//         this.facilityTypes = response.result;
//       });

//   }
//   getAllCustomerAccount(customerId: number) {
//     // let laon = this.loanApplication.value;
//     // tslint:disable-next-line:radix
//     this.casaService.getAllCustomerAccountByCustomerId(customerId)
//       .subscribe((response: any) => {
//         this.customerAccount = response.result;
//         ////console.log('customerAccount', this.customerAccount);
//       });
//   }

//   customerTypeId: number;
//   customerTypeName: string;
//   selectedCustomerId: number;

//   OnGroupCustomerChange(customerId) {
//     let customer: any = {};
//     this.selectedCustomerId = customerId
//     // this.getAllCustomerAccount(parseInt(customerId));
//     ////console.log("customerId", customerId);
//     customer = this.groupMembers.find(x => x.customerId === parseInt(customerId));

//     this.selectedCustomer = customer.customerName;
//     this.customerTypeId = customer.customerTypeId;
//     this.customerTypeName = customer.customerType + ` Customer`;
//     ////console.log(customer);

//   }
//   productLimit: number;
//   expiryPeriod: number;
//   specifyAccountNumber: boolean = false;
//   requiredEquity: number;

//   setEquityValidators() {
//     let control = this.facilityDetailsForm.controls['equityAmount'];
//     control.setValidators([Validators.required, ValidateGreaterThanZero]);
//     let control3 = this.facilityDetailsForm.controls['totalAmountRequired'];
//     control3.setValidators([Validators.required]);
//   }



//   onProductChange(id) {
//     this.proposedProductId = id;
//     let productAttributes: any = {};
//     this.selectedCustomerId = this.customerId
//     if (id !== '') {
//       this.getCurrenciesbyProduct(id);
//       this.disableControl = true;
//       this.isInvoiceBased = false;
//       this.disableControl = true;
//       productAttributes = this.filteredProducts.find(x => x.productId == +id);
//       ////console.log("productAttributes", productAttributes);

//       this.expiryPeriod = productAttributes.expiryPeriod
//       this.requireEquityContribution = productAttributes.equityContribution;

//       if (productAttributes.equityContribution > 0) {
//         this.setEquityValidators();
//         this.requiredEquity = productAttributes.equityContribution
//       }
//       if (!productAttributes.allowRate) {
//         this.maximumRate = productAttributes.maximumRate !== null ? productAttributes.maximumRate : 0;
//         // this.minimumRate = productAttributes.minimumRate !== null ? productAttributes.minimumRate : this.minimumRate;
//       }
//       this.facilityDetailsForm.patchValue({
//         proposedTenor: productAttributes.maximumTenor,
//         proposedInterestRate: productAttributes.maximumRate
//       });

//       this.productService.getProductsBehaviourByProductId(id).subscribe((resp) => {
//         ////console.log(resp.result);

//         if (resp.result !== null) {
//           this.productLimit = resp.result.productLimit;
//           this.isInvoiceBased = resp.result.isInvoiceBased;
//           this.requireCasaAccount = resp.result.requireCasaAccount;
//           this.customerLimitMoney = resp.result.customerLimit;
//         }

//       });
//       this.validateIsInvoiceBasedProduct(this.isInvoiceBased);
//     }
//   }


//   validateIsInvoiceBasedProduct(isInvoiceBased) {
//     const contractDateControl = this.facilityDetailsForm.get('contractDate');
//     const contractExpiryDateControl = this.facilityDetailsForm.get('contractExpiryDate');
//     const principalIdControl = this.facilityDetailsForm.get('principalId');
//     const invoiceCurrencyIdControl = this.facilityDetailsForm.get('invoiceCurrencyId');

//     if (isInvoiceBased === true) {
//       contractDateControl.setValidators(Validators.required);
//       contractExpiryDateControl.setValidators(Validators.required);
//       principalIdControl.setValidators(Validators.required);
//       invoiceCurrencyIdControl.setValidators(Validators.required);
//     } else {
//       contractDateControl.clearValidators();
//       contractExpiryDateControl.clearValidators();
//       principalIdControl.clearValidators();
//       invoiceCurrencyIdControl.clearValidators();
//     }
//     contractDateControl.updateValueAndValidity();
//     contractExpiryDateControl.updateValueAndValidity();
//     principalIdControl.updateValueAndValidity();
//     invoiceCurrencyIdControl.updateValueAndValidity();

//   }

//   isInvoiceFormValide(): boolean {
//     let inv: any = {}
//     inv = this.invoiceDiscountingForm.get("addinvoices").value
//     return (inv.invoiceNo == "" || inv.invoiceDate == null || inv.invoiceValue == "" || !this.invoiceStatus || this.documentNoStatus);
//   }
//   loanApplicationId: number;
//   submitLoan() {
//     const loan = this.loanApplication

//     if (this.displayInvoiceDiscounting == true) {
//       if (this.productAmount < this.loanApplicationDetail.proposedAmount) {
//         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than 70% Invoice amount', 'error');
//         return;
//       }
//     }

//     if (this.newLoanApplicationId > 0)
//       this.loanApplicationId = this.newLoanApplicationId;

//     let loanDetail: any[] = [];
//     loanDetail.push(this.loanApplicationDetail);
//     this.loanApp = {
//       loanApplicationId: this.loanApplicationId,
//       applicationReferenceNumber: loan.applicationReferenceNumber,
//       //casaAccountId: loan.casaAccountId,
//       customerAccount: loan.customerAccount,
//       customerGroupId: loan.customerGroupId,
//       customerId: loan.customerId,
//       customerName: loan.customerName,
//       customerTypeId: loan.customerTypeId,
//       isInvestmentGrade: loan.isInvestmentGrade,
//       loanPreliminaryEvaluationId: loan.loanPreliminaryEvaluationId,
//       loanInformation: loan.loanInformation,
//       loanApplicationDetail: loanDetail,
//       loanTypeId: loan.loanTypeId,
//       requireCollateral: this.requireCollateral != true ? this.requireCollateral : loan.requireCollateral,
//       relationshipManagerId: loan.relationshipManagerId,
//       relationshipOfficerId: loan.relationshipOfficerId,
//       productClassId: loan.productClassId,
//       proposedAmount: loan.proposedAmount,
//       proposedTenor: loan.proposedTenor,
//       tenorMode: loan.tenorMode,
//       isNewApplication: true,
//       isFirstTime: false
//     }
//     ////console.log("loanApplication",this.loanApp);
//     ////console.log(this.loanApplicationDetail);

//     this.loanAppService.saveApplication(this.loanApp).subscribe((response: any) => {
//       if (response.success === true) {
//         ////console.log(this.loanApplicationDetail);                
//         ////console.log("loanApplication",response.result);
//         let loanApp = response.result.loanApplicationDetail;
//         ////console.log("loanApplicationDetails", loanApp);
//         this.loanApplicationId = loanApp.loanApplicationId;
//         ////console.log("loanApplicationId", this.loanApplicationId);

//         this.loanApplicationDetails = []
//         for (let i = 0; loanApp.length > i; i++) {
//           this.loanApplicationId = loanApp[i].loanApplicationId;
//           this.newLoanApplicationId = loanApp[i].loanApplicationId;
//           this.ApplicationRef == loanApp[i].applicationRefNo;
//           ////console.log("loanApplicationId", this.loanApplicationId, loanApp[i].loanApplicationId);
//           this.loanApplicationDetails.push(loanApp[i]);
//         }
//         this.resetForm()
//         swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/> Loan Application Added<b>', 'success');
//         this.loadingSrv.hide();
//       }
//       else {

//         //this.showMessage(response.message, 'error', 'FintrakBanking');
//         swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(response.message), 'error');
//         //this.loadingSrv.hide();
//         ////console.log("gbenga", response.message);
//       }
//     }, (response) => {
//       //swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(response), 'error');
//       this.showMessage(response.message, 'error', 'FintrakBanking');
//       ////console.log("gbenga", response.message);
//     });
//     //   this.loanDetails = [];

//   }

//   showMessage(message: string, cssClass: string, title: string) {
//     this.message = message;
//     this.title = title;
//     this.cssClass = cssClass;
//     this.show = true;
//   }

//   addFacilityDetails() {
//     this.addDefaultFacilityDetails();
//     this.submitLoan();

//   }

//   // checkTargetAmount(usedAmount: number): number {
//   //     if (usedAmount > this.maximumAmount) {
//   //         this.facilityDetailsForm.patchValue({
//   //             exchangeRate: 0,
//   //             exchangeAmount: 0,
//   //             currencyId: this.currencyId,
//   //             customerId: this.customerId

//   //         });

//   //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Maximum Amount Exceeded', 'info');
//   //         return 0;
//   //     }
//   //     else {
//   //         this.utilizedAmount += +this.pAmount;
//   //         return this.utilizedAmount;
//   //     }
//   // }

//   getInvoiceTable(data): any {
//     const fd = this.facilityDetailsForm.value;
//     let invoiceData: IInvoiceDetails[] = [];

//     for (let i = 0; this.invoiceTable.length > i; i++) {
//       let invoice: IInvoiceDetails = {
//         contractNo: this.invoiceTable[i].contractNo,
//         principalId: fd.principalId,
//         invoiceNo: this.invoiceTable[i].invoiceNo,
//         invoiceDate: this.invoiceTable[i].invoiceDate,
//         invoiceAmount: this.invoiceTable[i].invoiceValue,
//         invoiceCurrencyId: fd.invoiceCurrencyId,
//         contractEndDate: fd.contractExpiryDate,
//         contractStartDate: fd.contractDate,
//         invoiceDocument: '',
//         purchaseOrderNumber: fd.purchaseOrderNumber,
//         certificateNumber: this.invoiceTable[i].certificateNumber
//       }
//       invoiceData.push(invoice);
//     }
//     return invoiceData;
//   }

//   loanApplicationDetail: ILoanApplicationDetail;
//   addDefaultFacilityDetails() {

//     ////console.log("group Members", this.groupMembers);

//     const fd = this.facilityDetailsForm.value;
//     let custId: number = +fd.customerId
//     let custname = this.groupMembers.find(x => x.customerId == custId);

//     ////console.log("cust name", custname);

//     const currencyCode = this.allowedCurrencies.find(d => d.currencyId === +fd.currencyId).currencyCodeName;
//     const productName = this.filteredProducts.find(x => x.productId === +fd.proposedProductId).productName;
//     const pAmount: number = +ConvertString.TO_NUMBER(fd.proposedAmount);
//     const usedAmount: number = +this.utilizedAmount + (+pAmount);
//     const invoiceDetails: IInvoiceDetails[] = this.getInvoiceTable(fd)

//     // if (this.displayInvoiceDiscounting == true) {
//     //     if (this.productAmount < pAmount) {
//     //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than 70% Invoice amount', 'error');
//     //         return;
//     //     }
//     // }
//     // if (this.checkTargetAmount(usedAmount) == 0) return
//     // this.TotalAmount += fd.exchangeAmount;
//     // if (fd.proposedTenor > this.MaximumTenor) {
//     //     this.MaximumTenor = fd.proposedTenor;
//     // }
//     this.loanApplicationDetail = {
//       loanApplicationDetailId: 0,
//       customerId: fd.customerId,
//       customerName: custname.customerName,
//       proposedProductId: fd.proposedProductId,
//       proposedProductName: productName,
//       proposedTenor: fd.proposedTenor,
//       tenorModeId: fd.tenorModeId,
//       proposedInterestRate: fd.proposedInterestRate,
//       proposedAmount: ConvertString.TO_NUMBER(fd.proposedAmount),
//       currencyId: fd.currencyId,
//       currencyName: currencyCode,
//       exchangeRate: fd.exchangeRate,
//       exchangeAmount: fd.exchangeAmount,
//       subSectorId: fd.subSectorId,
//       sectorId: fd.sectorId,
//       productClassId: this.productClassId,
//       loanPurpose: fd.loanPurpose,
//       invoiceDetails: invoiceDetails,
//       productFees: this.feesCollection,
//       traderLoan: this.traderLoan,
//       educationLoan: this.educationLoan,
//       bondDetails: this.bondDetails,
//       casaAccountId: fd.casaAccountId
//     }
//     ////console.log("loanApplicationDetail", loanApplicationDetail);


//     this.loanDetails.push(this.loanApplicationDetail);
//     // this.loanApplicationDetails.push(loanApplicationDetail);

//     if (this.displayBondAndGuarantees) this.resetBondAndGuarantees = true;

//     this.IsBaseCurrency = false;
//     if (this.displayFirstTraders) this.resetFirstTraders = true
//     this.exchangeValue = 0;
//   }

//   resetForm(): void {
//     this.facilityDetailsForm.reset();

//     this.facilityDetailsForm.patchValue({
//       exchangeRate: 0,
//       exchangeAmount: 0,
//       productClassId: this.productClassId,
//       currencyId: this.currencyId,
//       customerId: this.customerId,
//       tenorModeId: 1
//     });
//   }
//   // currencyId: [this.currencyId, Validators.required],
//   // customerId: [this.customerId, Validators.required],

//   removeApplicatiionDetailsItem(evt, indx) {
//     evt.preventDefault();

//     const currRecord = this.loanApplicationDetails[indx];

//     this.loanAppService.deleteApplication(currRecord.loanApplicationDetailId).subscribe((x) => {
//       if (x.result) {
//         ////console.log("currRecord", currRecord);
//         this.TotalAmount -= currRecord.exchangeAmount;
//         this.utilizedAmount -= currRecord.exchangeAmount;
//         this.facilityDetailsForm.get('invoiceValue').setValue(this.TotalAmount);
//         // if (currRecord.proposedTenor === this.MaximumTenor) {
//         //     //    this.MaximumTenor = loanApplicationDetails.proposedTenor;
//         // }
//         this.loanApplicationDetails.splice(indx, 1);
//       }
//     })

//   }

//   InitfacilityDetailsForm() {
//     this.loanApplicationId = this.loanApplication.loanApplicationId;
//     this.facilityDetailsForm = this.fb.group({
//       proposedAmount: ['', Validators.required],
//       proposedInterestRate: ['', Validators.required],
//       proposedTenor: ['', Validators.required],
//       proposedProductId: ['', Validators.required],
//       sectorId: ['', Validators.required],
//       subSectorId: ['', Validators.required],
//       currencyId: [1, Validators.required],
//       customerId: [this.loanApplication.customerId, Validators.required],
//       productClassId: [this.productClassId, Validators.required],
//       exchangeRate: [0, Validators.required],
//       exchangeAmount: [0, Validators.required],
//       loanPurpose: ['', Validators.required],

//       tenorModeId: [1],
//       proposedProductName: [''],
//       currencyName: [''],

//       subSectorName: [''],
//       productLimit: [0],
//       invoiceCurrencyId: ['1'],
//       fcyRate: ['1'],
//       loanfcyRate: ['1'],
//       customerName: [''],

//       addinvoices: [],
//       traderLoan: [],
//       educationLoan: [],
//       bondDetails: [],
//       casaAccountId: [''],
//       principalId: [''],

//       //this.invoiceFormDefaultFacility(),
//       invoiceCurrencyName: [''],
//       invoiceValue: [''],
//       lcyInvoiceValue: [''],
//       contractExpiryDate: [''],
//       contractDate: [''],
//       loanNairaEquivalent: [''],
//       productFees: [],
//       purchaseOrderNumber: [],
//       equityAmount: [''],
//       equityCasaAccountId: [''],
//       totalAmountRequired: [''],
//       certificateNumber: ['']
//     });
//   }



//   addInvoice(): void {
//     this.invoices.push(this.invoiceForm());
//   }

//   removeInvoice(evt, indx): void {
//     evt.preventDefault();
//     const currRecord = this.invoiceTable[indx];
//     const d = ConvertString.TO_NUMBER(currRecord.invoiceValue);
//     var invValue = 0;
//     if (this.productClassId === this.INVOICE_DISCOUNTING) {
//       invValue = this.facilityDetailsForm.get("invoiceValue").value;
//     }
//     let bal = +ConvertString.TO_NUMBER(invValue) - +d;

//     this.facilityDetailsForm.controls["invoiceValue"].setValue(bal);
//     this.invoiceTable.splice(indx, 1);
//     this.deleteUpload(currRecord.invoiceNo, this.ApplicationRef);
//   }

//   onInvoiceValueBlur() {
//     const invoice: any[] = this.invoices.value;
//     let sum: number = 0;
//     this.invoiceDiscountingForm.controls["invoiceValue"].setValue(0);
//     for (let i = 0; invoice.length > i; i++) {
//       sum = sum + (ConvertString.TO_NUMBER(invoice[i].invoiceValue));
//     }
//     this.invoiceDiscountingForm.controls["invoiceValue"].setValue(sum);
//   }

//   principalId: number;
//   checkMultipleInvoice(invoiceNo, contractNo) {
//     const invoice: IInvoiceDetails[] = this.invoices.value;
//     let sum: number = 0;

//     for (let i = 0; invoice.length > i; i++) {
//       if (invoice[i].invoiceNo == this.invoiceNo
//         && invoice[i].contractNo == this.contractNumber
//         && invoice[i].purchaseOrderNumber == this.purchaseOrderNumber) {
//         this.invoiceDiscountingForm.controls["invoiceNo"].setValue('');
//       }
//     }
//   }

//   documentNoStatus: boolean = false; invoiceNo: string;

//   CheckDocumentNoDuplication() {

//     const dnd = this.invoiceInfo.value;

//     if (dnd.invoiceNumber && dnd.purchaseOrderNumber && dnd.contractNumber) {
//       let data = {
//         productId: this.proposedProductId,
//         principalId: this.principalId,
//         documentNo: dnd.invoiceNumber,
//         purchaseOrderNumber: dnd.purchaseOrderNumber,
//         contractNumber: dnd.contractNumber
//       };

//       this.loanAppService.documentNoValidation(data)
//         .subscribe((response: any) => {
//           this.documentNoStatus = response.result.documentNoStatus;
//           this.invoiceNo = response.result.documentNo;
//           this.dayInterval = response.result.dayInterval;
//         });
//     }
//   }

//   getExchangeRateInvoice(id) {
//     let lcyValue: number = 0;

//     let amountValues: string = this.facilityDetailsForm.value.invoiceValue;//.replace(/[^0-9-.]/g, '');
//     this.loanAppService.getExchangeRate(id)
//       .subscribe((res) => {
//         this.exchange = res.result;

//         ////console.log("getExchangeRate", res.result);
//         ////console.log("param", amountValues, this.exchange.sellingRate);

//         lcyValue = +amountValues * this.exchange.sellingRate;

//         this.facilityDetailsForm.controls["lcyInvoiceValue"].setValue(ConvertString.ToNumberFormate(lcyValue));
//         this.facilityDetailsForm.controls["fcyRate"].setValue(this.exchange.sellingRate);
//         this.facilityDetailsForm.controls["currencyId"].setValue(id);
//       });
//   }
//   validateContratDate() {
//     if (this.enddate === undefined) {
//       this.facilityDetailsForm.controls["contractExpiryDate"].setValue("");
//     }
//     if (this.startdate === undefined) {
//       this.facilityDetailsForm.controls["contractDate"].setValue("");
//     }
//     if (this.startdate >= new Date()) {
//       this.facilityDetailsForm.controls["contractDate"].setValue("");
//       swal(`${GlobalConfig.APPLICATION_NAME}`,
//         'Contract start date can not be in future', 'info');
//       this.startdate == null;
//       return
//     }
//     if (this.startdate.toString() !== "" && this.enddate.toString() != "") {

//       if (this.startdate < this.enddate && this.startdate != this.enddate) {
//       } else {
//         this.facilityDetailsForm.controls["contractExpiryDate"].setValue("");
//         this.facilityDetailsForm.controls["contractDate"].setValue("");
//         this.startdate = null; this.enddate = null;
//         swal(`${GlobalConfig.APPLICATION_NAME}`,
//           'Contract start date must not be earlier than contract expiry date', 'info');
//       }
//     }
//   }

//   getExchangeRateInvoice2(id) {
//     let lcyValue: number = 0;
//     let amountValues: string = this.facilityDetailsForm.value.proposedAmount;//.replace(/[^0-9-.]/g, '');
//     if (amountValues === 'NaN' || amountValues == 'undefined') {
//       amountValues = '0';
//     }
//     this.loanAppService.getExchangeRate(id)
//       .subscribe((res) => {
//         this.exchange = res.result;
//         ////console.log(res.result);


//         lcyValue = + ConvertString.TO_NUMBER(amountValues) / this.exchange.sellingRate;

//         this.facilityDetailsForm.controls["loanNairaEquivalent"].setValue(lcyValue.toFixed(2));
//         this.facilityDetailsForm.controls["loanfcyRate"].setValue(this.exchange.sellingRate);

//       });

//   }


//   // fees
//   // productFeesFormTemp() {
//   //     return this.fb.group({
//   //         invoiceNo: [''],
//   //         invoiceDate: [this.invoiceDate],
//   //         invoiceValue: [''],
//   //     })
//   // }

//   // file upload

//   uploadFileTitle: string = null;
//   physicalFileNumber: string = 'n/a';
//   physicalLocation: string = 'n/a';
//   files: FileList;
//   file: File;
//   @ViewChild('fileInput', {static: false}) fileInput: any;

//   onFileChange(event) {
//     this.files = event.target.files;
//     this.file = this.files[0];
//     this.invoiceInfo.controls["invoiceDocument"].setValue(this.files[0])


//   }

//   fileExtention(name: string) {
//     var regex = /(?:\.([^.]+))?$/;
//     return regex.exec(name)[1];
//   }

//   uploadFile() {
//     const invoice = this.invoiceInfo.value;
//     if (invoice) {
//       let body = {
//         loanApplicationNumber: this.ApplicationRef,
//         loanReferenceNumber: invoice.invoiceNumber,
//         documentTitle: invoice.documentTitle,
//         fileName: invoice.invoiceDocument.name,
//         fileExtension: invoice.invoiceDocument.type, // invoice.fileExtention(this.file.name),
//         physicalFileNumber: invoice.physicalFileNumber,
//         physicalLocation: invoice.physicalLocation,
//         documentTypeId: '1', // TODO: redundant with fileExtension known
//       };
//       this.loadingSrv.show();
//       this.camService.uploadFile(this.file, body).then((val: any) => {
//         this.documentTitle = null;
//         this.physicalFileNumber = null;
//         this.physicalLocation = null;
//         this.fileInput.nativeElement.value = "";
//         this.loadingSrv.hide();
//         this.disableUpload = true;
//         this.displayInvoiceDetails = false;
//         this.displayBGUpload = false;
//       }, (error) => {
//         this.loadingSrv.hide(1000);
//         ////console.log("error", error);
//       });
//     }
//   }
//   deleteUpload(invoiceNo, applicationNumber) {
//     this.camService.deleteLoanDocument(invoiceNo, applicationNumber).subscribe((response: any) => {
//       if (response.success === true) {
//         this.loadingSrv.hide();
//         ////console.log("success >>>>>>>>>>>", response.success)
//       }
//     });
//   }

//   uploadFileBandG() {
//     let body = {
//       loanApplicationNumber: this.ApplicationRef,
//       loanReferenceNumber: this.ApplicationRef,
//       documentTitle: this.documentTitle,
//       fileName: this.file.name,
//       fileExtension: this.fileExtention(this.file.name),
//       physicalFileNumber: this.physicalFileNumber,
//       physicalLocation: this.physicalLocation,
//       documentTypeId: '1', // TODO: redundant with fileExtension known
//     };
//     this.loadingSrv.show();
//     this.camService.uploadFile(this.file, body).then((val: any) => {
//       this.documentTitle = null;
//       this.physicalFileNumber = null;
//       this.physicalLocation = null;
//       this.fileInput.nativeElement.value = "";
//       this.loadingSrv.hide();
//       this.disableUpload = true;
//       this.displayInvoiceDetails = false;
//       this.displayBGUpload = false;
//     }, (error) => {
//       this.loadingSrv.hide(1000);
//       ////console.log("error", error);
//     });
//   }

//   showInvoiceDetails() {
//     this.displayInvoiceDetails = true;
//   }

//   uploadBonsAndGuaranteeDocuments(data) {
//     this.invoiceNumber = null;
//     this.refenceNoBG = null;
//     this.loanAppService.getLoanApplicationReferanceNumber()
//       .subscribe((response: any) => {
//         this.refenceNoBG = response.result;
//         this.invoiceNumber = this.refenceNoBG;
//       });
//     this.displayBGUpload = true;
//   }
//   validateDiscountAmount(amount) {
//     if (this.displayInvoiceDiscounting == true) {
//       if (this.productAmount < ConvertString.TO_NUMBER(amount)) {
//         this.facilityDetailsForm.get('proposedAmount').setValue('');
//         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility amount cannot be greater than 70% Invoice amount', 'error');
//         return;
//       }
//     }
//   }
// }


