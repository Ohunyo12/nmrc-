import { GlobalConfig } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import {
    ICustomerCompanyDirectors} from '../../../../customer/models/CustomerInfo';
import { Subject } from 'rxjs';

import { CustomerService } from '../../../../customer/services/customer.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ProductFeeService } from '../../../../setup/services';
import { ProductService } from '../../../../setup/services';

@Component({
    selector: 'app-customer-product-fee',
    templateUrl: './customer-product-fee.component.html',
})
export class CustomerProductFeeComponent implements OnInit {
    customerProductFees: any;
    ShowSaveButton: boolean;
    customerFullName: any;
    customerCompanyInfomation: any;
    customerCodetitle: any;
    customerId: any;
    productFees: any;
    products: any;
    
    searchResults: any[];
    customerSelection: any; // selection
    customerSensitivityLevelList: any[];
    genderList: any[];
    titleList: any[];
    branches: any[];
    customerTypes: any[];
    customers: any[] = [];
    searchTerm$ = new Subject<any>();
    searchStagingTerm$ = new Subject<any>();
    AddCustomerForm: FormGroup;
    customerSearchForm: FormGroup;
    companyInfomationForm: FormGroup;

    filteredSubsector: any[];
    uploadDocumentType: any[];
    selectedcustomerTypeId: number;
    kycDocumentUploadList: any[] = [];
    selectedCustomer: any = {};
    listOfDirectors: ICustomerCompanyDirectors = new ICustomerCompanyDirectors;
    customerProductFeeForm: FormGroup;
    displayMandatesUpload: boolean = false;
    displayEditCustomer: boolean = false;
    displayCustomerList: boolean = false;
    isProspectConversion: boolean = false;
    @Input('showCustomerInfo') displayCustomerDetails: boolean = false;

    corporateShareholderName: string;
    data: any = {};
    show: boolean = false; message: any; title: any; cssClass: any;

    @Input('display') display: boolean = true;
    // tslint:disable-next-line:no-output-rename
    @Output('hideCustomerInfo') hideCustomerInfo = new EventEmitter();

    @Input('searchQuery') searchQuery = new Subject<string>();
    @Output() proceedEvent = new EventEmitter();
    @Output() lookupEvent = new EventEmitter();
    @Output() customerModel = new EventEmitter();
    //displaySearchModal: boolean = false;
    constructor(private loadingService: LoadingService,
        private validationService: ValidationService,
        private fb: FormBuilder,
        private customerService: CustomerService,
        private prodService: ProductService,
        private productFeeService: ProductFeeService ) {
        this.customerService.searchForCustomer(this.searchTerm$).subscribe(results => {
            this.customers = results.result;
            ////console.log('search item', this.customers);
        });
        this.customerService.searchForCustomerStaging(this.searchStagingTerm$, this.isProspectConversion).subscribe(results => {
            this.searchResults = results.result;
            ////console.log('Customer search item', this.searchResults);
        });
    }

    ngOnInit() {
        this.loadCustomerDropdowns();
        this.loadCustomerInformationForm();
        this.getProducts(); 
    }

    getProducts(): any {
        this.prodService.getAllLoanProducts().subscribe((response: any) => {
            this.products = response.result;
        });
    }

    getCustomerProductFees(customerId): any {
        this.prodService.getCustomerProductFees(customerId).subscribe((response: any) => {
            this.customerProductFees = response.result;
            ////console.log('this.customerProductFees',)
        });
    }

    closeModal() {
        this.displayCustomerDetails = false;
        this.display = true;
        this.hideCustomerInfo.emit("closed");
    }

    getProductFees(selectedProductId): any {
        this.productFeeService.getAllMappedFeesByProduct(selectedProductId).subscribe((response: any) => {
            this.productFees = response.result;
            ////console.log('productFees',  this.productFees );
        });

    }

    searchDB(searchString) {
        this.searchTerm$.next(searchString);
    }

    searchStagingDB(searchString) {
        this.searchStagingTerm$.next(searchString);
    }

    submitCustomerProductFee(form) {
        if (this.customerProductFeeForm.invalid) {
            return;
        }
        
        this.loadingService.show();
        let body = {
            productFeeId: form.value.productFeeId,
            customerId: this.customerId,
            dependentAmount: form.value.dependentAmount,
            rateValue: form.value.rateValue,
            productId: form.value.productId
        };
        ////console.log('form body', body);
        this.prodService.addCustomerProductFee(body).subscribe((response: any) => {
            if (response.success == true) {
                this.getCustomerProductFees(this.customerId);
                this.clearSearchForm();
                this.displayCustomerList = true;
                this.loadingService.hide();
                this.finishGood(response.message);
                //this.showHideSearch = false;
            } else {
                this.displayCustomerList = false;
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.displayCustomerList = false;
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    clearSearchForm() {
        this.customerSearchForm = this.fb.group({
            customerName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            phoneNumber: ['', Validators.compose([ValidationService.isNumber, Validators.minLength(8)])],
            customerTypeId: [''],
            branchId: [''],
        });
    }

    backToSearch() {
        this.customers = [];
    }

    loadCustomerInformationForm() {
        this.customerProductFeeForm = this.fb.group({
            productId: [],
            productFeeId: ['', Validators.required],
            rateValue: ['', Validators.required],
            dependentAmount: ['', Validators.required],
        });
    }
    showHideCustomerForm(id) {
        ////console.log("this is just ofr testing", id);
        if (id == 4) {

        }

    }
    loadCustomerDropdowns() {
        this.customerService.getAllCustomerTypes().subscribe((response: any) => {
            this.customerTypes = response.result;
        });

    }


    getSingleCustomerGeneralInfo(customerCode) {
        this.loadingService.show();
        this.customerCompanyInfomation = null;
        this.customerService.getSingleCustomerGeneralInfo(customerCode).subscribe((response: any) => {
            this.customerSelection = response.result;
            ////console.log("General Info", this.customerSelection);
            this.companyInfomationForm.get('companyName').setValue(this.customerSelection.customerName);
            this.companyInfomationForm.get('customerId').setValue(this.customerSelection.customerId);
            this.customerId = this.customerSelection.customerId;
            this.customerCodetitle = this.customerSelection.customerCode;
            this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
            this.customerFullName = this.customerSelection.customerName;
            if (this.customerSelection != null) {
                this.ShowSaveButton = true;

                this.display = false;
                this.displayCustomerDetails = true;
            }
        });
        this.loadingService.hide();
    }
    getSingleCustomerCompanyInfo(customerId) {
        this.customerService.getSingleCustomerCompanyInfo(customerId).subscribe((response: any) => {
            this.customerCompanyInfomation = response.result;
        });
    }

    loadSingleCustomerInformation(customerId: Number) {
        this.loadingService.show();
        this.getSingleCustomerCompanyInfo(customerId);
        this.loadingService.hide();
    }



    getApprovalStatus(id) {
        return 'n/a';
    }




    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/
    onSelectedCustomerDetailsChanged() {
        //  this.loadCustomerInformationForm();
        this.customerId = this.customerSelection.customerId;
        //this.loadSingleCustomerInformation(this.customerId);
       // this.customerCodetitle = this.customerSelection.customerCode;
        //this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
        this.customerFullName = this.customerSelection.customerName;
        this.getCustomerProductFees(this.customerId);
        this.ShowSaveButton = true;

        this.display = false;
        this.displayCustomerDetails = true;
       
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }
    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
    }


    hideMessage(event) {
        this.show = false;
    }

   
    submitNewCustomerDetails(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        if (this.customerId === null) {
            this.customerService.save(bodyObj).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    this.customerSelection = null;
                    this.getSingleCustomerGeneralInfo(formObj.value.customerCode);
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.displayCustomerDetails = false
            });
        } else {
            this.customerService.update(bodyObj, this.customerId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.display = true
            });
        }
    }
}