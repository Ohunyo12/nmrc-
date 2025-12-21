import { AuthenticationService } from './../../services/authentication.service';
import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import swal from 'sweetalert2';
import { CountryStateService } from './../../../setup/services/state-country.service';
import { GeneralSetupService, CurrencyService } from './../../../setup/services';
import { CompanyService } from './../../../setup/services/company.service';
import { Subject } from 'rxjs';
import { BranchService } from './../../../setup/services/branch.service';
import { CustomerService } from './../../../customer/services/customer.service';
import { ValidationService } from './../../../shared/services/validation.service';
import { LoadingService } from './../../../shared/services/loading.service';
import { LoanService } from './../../../credit/services/loan.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    // selector: 'app-customer-information',
    templateUrl: './bulk-disbursement.component.html',
    providers: [ValidationService, CustomerService, LoanService, LoanApplicationService, LoadingService, AuthenticationService,CurrencyService]
})
export class BulkDisbursementComponent implements OnInit {

    periodicSchedule: any[] = [];
    disbursementScheme: any[] = [];
    facilities: any[] = [];
    disbursementSchemeData: any[] = [];
    bulkDisbursementSchemeForm: FormGroup;
    bulkDisburseSchemeSearchForm: FormGroup;
    displayBulkDisbursementSchemeUpdate: boolean = false; 
    displayBulkDisbursementSchemeData: boolean = false; 
    displayBulkDisbursementScheme: boolean = false;  
    displaySearchSchemeModal: boolean = false; 
    disburseSchemeId: any; 
    priceIndex: string;
    priceIndexName: string;
    schemeSelection: any;
    disbursementSchemeSingle: any;
    basis: any;
    loanApplication: any;
    loans: any[] = [];
    frequency: any[] = [];
    proposedItems: any[] = [];
    duplications: any[] = [];
    reload: number = 0;
    facilityCount: number = 0;
    interestRates: number = 0;
    searchTerm$ = new Subject<any>();
    searchTerm$2 = new Subject<any>();
    searchedName: any;
    displayschemeModal: boolean = false;
    loanApplicationReferenceNumber: any;
    applicationDetail: any;
    interestRate: any;
    
   
    event = {
        facilityName: "--- Select Facility ---",
        schedule: "--- Select Schedule ---",
        productPriceIndex: "--- Select Product Price Index ---"
    }

    packageText: string = 'Bulk Disbursement SCHEME Form';
    packageHeader: string = ' Bulk Disbursement SCHEME SETUP';
    message: any;
    cssClass: any;
    title: any;
    show: any;
    disbursementSchemeId: any;
    searchString: string = '';
    searchedData: any;
    searchResults: any[] = [];
    schemeResults: any[] = [];
    displaySearchModal = false;
    currencyList: any[] = [];
   
    constructor(private loadingService: LoadingService,
        private validationService: ValidationService,
        private fb: FormBuilder,
        private authservice: AuthenticationService,
        private customerService: CustomerService,
        private loanAppService: LoanApplicationService,
        private currencyService: CurrencyService,
        private companyService: CompanyService,
        private branchService: BranchService,
        private countryStateSrv: CountryStateService,
        private genSetupServ: GeneralSetupService,
        private loanService: LoanService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private loadingSrv: LoadingService) {
            this.loanService.searchApplication(this.searchTerm$).subscribe(results => {
                if (results != null) {
                    this.searchResults = results.result; 
                    this.enableAllFileds();
                }
            });

            this.loanService.searchScheme(this.searchTerm$2).subscribe(results => {
                if (results != null) {
                    this.schemeResults = results.result; 
                    
                }
            });
    }
    

    ngOnInit() {
        
        this.bulkDisbursementSchemeForm = this.fb.group({
            productPriceIndex: ['', Validators.required],
            interestRate: ['', Validators.compose([ValidationService.isNumber])],
            schedule: ['', Validators.required],
            tenor: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
            schemeName: ['', Validators.required],
            facilityName: ['', Validators.required],
            applicationDetail: [''],
            accrualBasis: ['', Validators.required],
            interestFreq: [''],
            principalFreq: ['', Validators.required],
            searchString: [''],
            searchedName: [''],
            loanApplicationReferenceNumber: [''],
            currencyId: [''],
            approvedAmount: ['']         
        });

                
        this.bulkDisburseSchemeSearchForm = this.fb.group({
            searchString2: ['', Validators.required]
                  
        });

        this.disableAllFields();
        this.getAllFacilities();
        this.getPeriodicSchedule();
        this. getBulkDisbursementScheme();
        this.getDayCount();
        this.getFrequencyType();
        this.getAvailedLoanApplications();
        this.getAllCurrency();
    }



    getFrequencyType() {
        this.loanService.getFrequencyTypes()
            .subscribe((res) => {
                this.frequency = this.loans = res.result;
               
            }, (err) => {
                
            });
    }

    getApplicationDetailsByApplicationRef(){
        this.enableAllFileds();
        let body = {
            searchString: this.searchString
        }
        this.loanService.loanApplicationDetailSearch(body)
            .subscribe((res) => {
                this.proposedItems = res.result;
               
            }, (err) => {
                
            });
    }

    disableAllFields(){
        this.bulkDisbursementSchemeForm.get('productPriceIndex').disable();
        this.bulkDisbursementSchemeForm.get('interestRate').disable();
        this.bulkDisbursementSchemeForm.get('schedule').disable();
        this.bulkDisbursementSchemeForm.get('tenor').disable();
        this.bulkDisbursementSchemeForm.get('schemeName').disable();
        this.bulkDisbursementSchemeForm.get('applicationDetail').disable();
        this.bulkDisbursementSchemeForm.get('accrualBasis').disable();
        this.bulkDisbursementSchemeForm.get('interestFreq').disable(); 
        this.bulkDisbursementSchemeForm.get('principalFreq').disable();
        this.bulkDisbursementSchemeForm.get('facilityName').disable();
        this.bulkDisbursementSchemeForm.get('currencyId').disable();
        this.bulkDisbursementSchemeForm.get('approvedAmount').disable();
    }

    enableAllFileds() {
        this.bulkDisbursementSchemeForm.get('productPriceIndex').enable();
        this.bulkDisbursementSchemeForm.get('interestRate').enable();
        this.bulkDisbursementSchemeForm.get('schedule').enable();
        this.bulkDisbursementSchemeForm.get('tenor').enable();
        this.bulkDisbursementSchemeForm.get('schemeName').enable();
        this.bulkDisbursementSchemeForm.get('applicationDetail').enable();
        this.bulkDisbursementSchemeForm.get('accrualBasis').enable();
        this.bulkDisbursementSchemeForm.get('interestFreq').enable();
        this.bulkDisbursementSchemeForm.get('principalFreq').enable();
        this.bulkDisbursementSchemeForm.get('facilityName').enable(); 
        this.bulkDisbursementSchemeForm.get('currencyId').enable();
    }

    getAvailedLoanApplications() {
        this.loanService.getAvailedLoanApplications()
            .subscribe((res) => {
                this.loans = res.result;
            }, (err) => {
                
            });
    }

    getBulkDisbursementScheme() {
        this.loanService.getAllBulkDisbursementPackageScheme().subscribe(results => {
            if (results.success == true) {
                this.disbursementSchemeData = results.result;
            } else {

            }
        });
    }

    getBulkDisbursementPackageSchemeByRefNumber(applicationReferenceNumber) {
        this.loanService.getBulkDisbursementPackageSchemeByRefNumber(applicationReferenceNumber).subscribe(results => {
            if (results.success == true) {
                this.disbursementScheme = results.result;
            } else {

            }
        });
    }

    getBulkDisbursementPackageSchemeById(disburseSchemeId) {
        this.loanService.getBulkDisbursementPackageSchemeById(disburseSchemeId).subscribe(results => {
            if (results.success == true) {
                this.disbursementSchemeSingle = results.result;
            } else {

            }
        });
    }

    getAllCurrency() {
        this.currencyService.getAllCurrencies().subscribe(results => {
            if (results.success == true) {
                this.currencyList = results.result;
            } else {

            }
        });
    }

    getAllFacilities() {
        this.loanService.getAllFacilities().subscribe(results => {
            if (results.success == true) {
                this.facilities = results.result;
            } else {

            }
        });
    }

    onChangeFacility(productId) {
        if (productId) {
            this.loanService.getAllProductPriceIndexByFacility(productId).subscribe((response: any) => {
                if (response.success == true) {
                    this.priceIndex = response.result.productPriceIndexId;
                    this.priceIndexName = response.result.priceIndexName;
                } else {

                }
            });
        }
    }

    onChangePriceIndex(productPriceIndexId) {
        if (productPriceIndexId) {
            this.loanService.getAllProductPriceIndexById(productPriceIndexId).subscribe((response: any) => {
                if (response.success == true) {
                    this.interestRates = response.result.priceIndexRate;
                    this.bulkDisbursementSchemeForm.controls['interestRate'].setValue(this.interestRates);
                } else {

                }
            });
        }
    }

  
    getPeriodicSchedule() {
        this.loanService.getAllPeriodicSchedule().subscribe((response: any) => {
            if (response.success == true) {
                this.periodicSchedule = response.result;
            } else {

            }
        });
    }


    onSelectedDisburseScheme() {
        this.displayBulkDisbursementSchemeData = true;
        this.displayBulkDisbursementScheme = true;
    }

    disbursePackageChanged(data) {
        this.bulkDisbursementSchemeForm.setValue({
            productPriceIndex: data.productPriceIndexId,
            tenor: data.tenor,
            interestRate: data.interestRate,
            schedule: data.scheduleMethodId,
            schemeName: data.schemeName,
            facilityName: data.productId,
            applicationDetail: data.loanApplicationDetailId,
            accrualBasis: data.scheduleDayCountConventionId,
            interestFreq: data.interestFrequencyTypeId,
            principalFreq: data.principalFrequencyTypeId,
            searchString: this.searchString,
            searchedName: data.customerName, 
            loanApplicationReferenceNumber: data.applicationReferenceNumber,
            currencyId: data.currencyId, 
            approvedAmount: data.approvedAmount
      });
      this.displayBulkDisbursementSchemeUpdate = true;
      this.enableAllFileds();
      this.searchLoanAppDB(data.applicationReferenceNumber);
      this.onChangeFacility(data.productId);
      this.disbursementSchemeId = data.disburseSchemeId;
      this.priceIndex = data.productPriceIndexId;
      this.priceIndexName = data.priceIndexName;
      this.displayBulkDisbursementScheme = false;
      this.displaySearchSchemeModal = false;
      
      
    }

    addBulkDisbursementPackageScheme(form) {
        var body = {
            productPriceIndexId: form.value.productPriceIndex,
            tenor: form.value.tenor,
            interestRate: form.value.interestRate,
            scheduleMethodId: form.value.schedule,
            schemeName: form.value.schemeName,
            productId: form.value.facilityName,
            loanApplicationDetailId: form.value.applicationDetail,
            scheduleDayCountConventionId: form.value.accrualBasis,
            interestFrequencyTypeId: form.value.interestFreq,
            principalFrequencyTypeId: form.value.principalFreq,
            currencyId: form.value.currencyId

        }
        
       this.loanService.addBulkDisbursementPackageScheme(body).subscribe((response: any) => {
            if (response.success == true) {
                this.displayBulkDisbursementScheme=false;
                this.displayBulkDisbursementScheme = false; 
                this.displayBulkDisbursementSchemeData = false; 
                this. getBulkDisbursementScheme();
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');  
                
                    
            } else {
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

    }

    editBulkDisbursementPackageScheme(form) {
        var disburseSchemeId = this.disbursementSchemeId;
        var body = {
            productPriceIndexId: form.value.productPriceIndex,
            tenor: form.value.tenor,
            interestRate: form.value.interestRate,
            scheduleMethodId: form.value.schedule,
            schemeName: form.value.schemeName,
            productId: form.value.facilityName,
            loanApplicationDetailId: form.value.applicationDetail,
            currencyId: form.value.currencyId
           
        }

        this.loanService.editBulkDisbursementPackageScheme(disburseSchemeId,body).subscribe((response: any) => {
            if (response.success == true) {
                this.displayBulkDisbursementScheme=false;
                this. getBulkDisbursementScheme();
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');             
            } else {
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

    }

    
    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    finishBad(message) {
        this.showMessage(message, 'error', "Fintrak Banking");
        this.loadingService.hide();
    }
    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "Fintrak Banking");
    }


    closeModal() {
        this.displayBulkDisbursementSchemeData = false;
        this.displayBulkDisbursementSchemeUpdate = false; 
        this.displayBulkDisbursementScheme = false; 
        this.schemeSelection = null; 
    }

    createScheme(index_data) {
        this.displayBulkDisbursementScheme = true;
        this.disbursementSchemeId = index_data.disbursementPackageId;
    }

    getDayCount() {
        this.loanService.getLoanDayCount()
            .subscribe((res) => {
                this.basis = res.result;
            });
    }

    getLoanDetail(loanApplicationId): void {
        this.reload = 0;
        this.loadingService.show();
        this.loanService.getLoanApplicationDetail(loanApplicationId).subscribe((response: any) => {
            this.duplications = response.result.duplications;
            this.proposedItems = response.result.facilities;
            this.facilityCount = response.result.facilities.length;
            this.reload++;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    searchLoanAppDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    pickSearchedData(data) {
        this.searchedName = data.fullName;
        this.bulkDisbursementSchemeForm.controls['loanApplicationReferenceNumber'].setValue(data.applicationReferenceNumber);
        this.bulkDisbursementSchemeForm.controls['searchedName'].setValue(data.customerName);
        this.displaySearchModal = false;
    }


    searchSchemeDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$2.next(searchString);
        this.displayschemeModal = true;
    }

    pickSchemeData(data) {

        this.bulkDisbursementSchemeForm.setValue({
            productPriceIndex: data.productPriceIndexId,
            tenor: data.tenor,
            interestRate: data.interestRate,
            schedule: data.scheduleMethodId,
            schemeName: data.schemeName,
            facilityName: data.productId,
            applicationDetail: data.loanApplicationDetailId,
            accrualBasis: data.scheduleDayCountConventionId,
            interestFreq: data.interestFrequencyTypeId,
            principalFreq: data.principalFrequencyTypeId,
            searchString: this.searchString,
            searchedName: data.customerName, 
            loanApplicationReferenceNumber: data.applicationReferenceNumber,
            currencyId: data.currencyId,
            approvedAmount: 0
              
      });
      this.displaySearchSchemeModal = false;
      this.enableAllFileds();
      this.searchLoanAppDB(data.applicationReferenceNumber);
      this.onChangeFacility(data.productId);
      this.displayBulkDisbursementScheme = true;
      this.disbursementSchemeId = data.disburseSchemeId;
      this.priceIndex = data.productPriceIndexId;
      this.priceIndexName = data.priceIndexName;       
    }

    getExistingScheme(){
        this.displaySearchSchemeModal = true;

    }



}