import { EditGroupCustomerInfoComponent } from '../../../customer/components/customer/edit-group-customer-info/edit-group-customer-info.component';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { CustomerRealTimeSearchService } from '../../services/customer-realtime-search.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../../customer/services/customer.service';
import { LoanService } from '../../services/loan.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { ProductService } from '../../../setup/services/product.service';
import { GeneralSetupService } from '../../../setup/services/general-setup.service';
import { Subject } from 'rxjs';
import { CustomerInformationComponent } from '../../../customer/components';
import swal from 'sweetalert2';
import { CasaService } from '../../../customer/services/casa.service';
import { CustomerGroupService } from '../../../customer/services/customer-group.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { CreditBureauSearchComponent } from '../credit-bureau-search/credit-bureau-search.component';


@Component({
    templateUrl: 'start-loan-application.component.html',
    styles: [`
    .remove-btn{
        color:#bbb;
        font-size:27px;
        position:absolute;
        top:0;
        right:0;
    }
    `]
})
export class StartLoanApplicationComponent implements OnInit {
    customerType = [
        {type: 'Individual', id: 1},
        {type: 'Corporate/SME', id: 2}
    ];
    enableCustomerButton: boolean;
    showCorporateCustomerSelect: boolean;
    customerSelect: number;
    corporateCustomerSelect: number;
    singleCustomerType: number;
    // @Output() emitCustomerType = new EventEmitter<number>();
    customerName: any;
    registrationNumber: any;
    taxIdentificationNumber: any;
    accountNumber: any;
    activeCustomer: any;
    enableOrDisableButton: boolean = true;
    displayCreditBureau: boolean;
    groupCustomerCode: number;
    groupCustomerId: number;

    displaySearchModal = false;
    displayCustSearchBtn: boolean;
    displayGrpSearchBtn: boolean;
    displayGroupSearchModal = false;
    displayCamsolMessage = false;
    displayBlacklistMessage = false;
    displayWatchlistMessage = false;
    disableBtn = false;
    subSectorSelected = true;

    customers: any[];
    productClasses: any[];
    customerSectors: any[];
    customerSubSectors: any[];
    subSectors: any[];
    sectors: any[];
    customerGroupMappings: any[];
    companyDirectors: any[];
    companyShareholders: any[];
    companyBvnInformation: any[];
    existingLoans: any[];
    loanTypes: any[];
    customerTopClients: any[];
    customerTopSuppliers: any[];
    productProcess: any[];
    selectedCustomer: any = {};
    selectedGroup: any = {};

    searchResults: Object;
    groupSearchResults: any[];
    searchTerm$ = new Subject<any>();
    custGrpSearchTerm$ = new Subject<any>();
    storageItem$ = new Subject<any>();
    loanApplForm: FormGroup;
    existingExposure = '0.00'; outstandingAmt = 0; existingApproved = '0.00'; totalApproved = 0;

    camsolWarningMessage: string;
    blacklistWarningMessage: string;
    watchlistWarningMessage: string;
    customer: any[] = [];
    customercode: any[] = [];

    fitForPenAppl = false; loanTypeId = 0; disablePenBtn = false;
    displayCustInfo: boolean = false; displayStartLoanAppl: boolean = false;
    searchString = new Subject<any>(); displayAdditionalModals: boolean; switchToCAM: boolean = false;
    customerId = 0; customerGroupId = 0; customerAccountDetails: any = {}; customerGroupMappingDetails: any = {};
    preLoanApplInfo: any = {}; productClassProcessId: number;
    userAmountLimit: boolean; maximumAmount: number;
    allowForLoanApplication = true;
    displaySingleCustomerInformation: boolean = false;
    startLoanTypeId: number;
    startCustomerName: string;
    startCustomerGroupName: string;
    displayStartNewLoan: boolean = true;
    displayStartNewGroupLoan: boolean = false;
applicationReferenceNumber:any;

    @ViewChild(CreditBureauSearchComponent, {static: false}) creditBureauObj: CreditBureauSearchComponent;
    @ViewChild(EditGroupCustomerInfoComponent, {static: false}) groupCustomerInfo: EditGroupCustomerInfoComponent;
    @ViewChild(CustomerInformationComponent, {static: false}) singleCustomerInfo: CustomerInformationComponent;
    switchToFAM: boolean;
    iblInfo: any;

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private customerService: CustomerService, private realSearchSrv: CustomerRealTimeSearchService,
        private loanService: LoanService, private casaService: CasaService,
        private loanApplService: LoanApplicationService,
        private productService: ProductService, private validationService: ValidationService,
        private genSetupService: GeneralSetupService, private customerGroupService: CustomerGroupService,
        private router: Router) {

        this.realSearchSrv.searchForCustomer(this.searchTerm$)
            .subscribe(results => {
                this.searchResults = results.result;
            });

        this.realSearchSrv.searchForCustomerGroup(this.custGrpSearchTerm$)
            .subscribe(results => {
                this.groupSearchResults = results.result;
            });

        // this.loanApplService.storeCustomerData(this.storageItem$);
        const tempNum = 0;
        this.existingExposure = tempNum.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }

    ngOnInit() {
        this.initializeForm();
        this.getProductProcess();
        this.getAllLoanTypes();
        this.customerGroupMappings = [];

        //this.activeCustomer = JSON.parse(sessionStorage.getItem('customer-loan-details'));

        // if(this.activeCustomer!=null){
        //     if (this.activeCustomer.source == 'PEN') {
        //         this.customerId = this.activeCustomer.customerId;
        //         this.customer.push(+this.customerId)
        //         this.customercode.push(+this.activeCustomer.customerCode)

        //         this.getCustomerAccountDetails(this.activeCustomer.customerId);
        //     }
        // }
        this.enableOrDisableButton = true;
    }

    searchDB(searchString) {
        this.searchTerm$.next('?searchQuery=' + searchString + '&loanTypeId=' + this.loanTypeId);
    }
    getProductProcess() {
        this.productService.getAllProductProcess().subscribe((response: any) => {
            this.productProcess = response.result;
            ////console.log(this.productProcess);
        })
    }

    onCustomerTypeChange(event) {      
        if (event == 1) {
            // console.log(event);
            this.startLoanTypeId = 1;
            this.singleCustomerType = 1;
            this.enableCustomerButton = true;
            this.showCorporateCustomerSelect = false;
            this.corporateCustomerSelect = null;
        } else if (event == 2) {
            // console.log(event);
            this.startLoanTypeId = 2;
            this.enableCustomerButton = false;
            this.showCorporateCustomerSelect = true;
        } else {
            this.showCorporateCustomerSelect = false;
            this.enableCustomerButton = false;
        }
    }

    onCorporateCustomerTypeChange(event) {
        // console.log(event);
        if (event == 1) {
            this.startLoanTypeId = 1;
            this.singleCustomerType = 2;
            this.enableCustomerButton = true;
        } else if (event == 2) {
            this.enableCustomerButton = true;
        } else {
            this.enableCustomerButton = false;
        }
    }

    checkApplicationProgram(amt) {
        ////console.log('loan amount', amt, typeof (amt));
        let amount = amt.replace(/[^0-9-.]/g, '')
        const parsedAmt = parseInt(amount, 10);

        if (parsedAmt > this.maximumAmount && this.userAmountLimit == true) {
            this.userAmountLimit = false;
            this.loanApplForm.controls['loanAmount'].setValue('');
            this.loanApplForm.controls['productClassProcessId'].setValue('');
            swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/>Proposed target loan amount is more than the approved limit for ' + this.productClassProscessName, 'warning');
            return;
        }

        // if (parsedAmt >= 100000000) {
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'This application has to proceed for Preliminary Evaluation (P.E.N)', 'info');
        //     this.allowForLoanApplication = false;
        // } else { this.allowForLoanApplication = true; }

    }

    productClassProscessName: string;
    onProductProcessSelect() {
        let process: any = {};
        let prodClassProcessId = this.loanApplForm.get('productClassProcessId').value;
        if (prodClassProcessId > 0) {
            this.enableOrDisableButton = false;
        } else {
            this.enableOrDisableButton = true;
        }
        process = this.productProcess.find(x => x.productClassProcessId === +this.processid);
        ////console.log("process", process);
        this.userAmountLimit = process.useAmountLimit;
        this.maximumAmount = process.maximumAmount;
        this.productClassProcessId = process.productClassProcessId;
        this.productClassProscessName = process.productClassProscessName;
        const laf = this.loanApplForm.value;

        if (laf.loanAmount.length > 0) {
            let amount = laf.loanAmount.replace(/[^0-9-.]/g, '')
            const parsedAmt = parseInt(amount, 10);
            if (parsedAmt > this.maximumAmount && this.userAmountLimit == true) {
                this.userAmountLimit = false;
                this.loanApplForm.controls['loanAmount'].setValue('');
                this.loanApplForm.controls['productClassProcessId'].setValue('');
                swal(`${GlobalConfig.APPLICATION_NAME}`, '<br/>Proposed target loan amount is more than the approved limit for ' + this.productClassProscessName, 'warning');
                return;
            } else {
                this.switchToFAM = false;
            }
        }
        // this.getProductClass();
    }

    searchForCustomerGroup(searchString) {
        this.custGrpSearchTerm$.next(searchString);
    }

    storeItem(data) {
        this.loanApplService.storeCustomerData(data);
    }

 

    goBack(ax) {
        this.loadingService.show();
        this.displayStartLoanAppl = false;
        
        // this.resetviews()
        if (this.startLoanTypeId == 1) { ////console.log('going back one step I')
        ////console.log('the cjustomer id is: ', this.customerId);
            this.displayCustInfo = true;
            this.singleCustomerInfo.display = true;
            this.singleCustomerInfo.displayCustomerDetails = true;
            this.customer = [];
            this.singleCustomerInfo.closeModal();
        }
        else {
            ////console.log('group back')
            this.groupCustomerInfo.displayEditInfo = false;
            this.displayStartNewGroupLoan = true;
            // this.displaySingleCustomerInformation = true;
        }
        //sessionStorage.removeItem('pre-startLoanApplication');
        //this.searchString.next('');
        this.loadingService.hide();
    }
    goToStartLoanApplication() {
        this.displayStartNewLoan = true;
        this.displayStartNewGroupLoan = false;
    }
    closeCustomerInfoModal() {
        this.singleCustomerInfo.displayCustomerDetails = false;
        //   this.displayAdditionalModals = false;
    }

    initializeForm() {
        this.loanApplForm = this.fb.group({
            customerId: [''],
            customerName: ['', Validators.required],
            // customerSectorId: ['', Validators.required],
            // customerSectorName: [''],
            // subSectorId: ['', Validators.required],
            // subSectorName: [''],
            productClassId: ['', Validators.required],
            loanAmount: ['', Validators.required],
            branchName: [''],
            relationshipOfficerId: [''],
            relationshipManagerId: [''],
            customerBvnInformation: [''],
            customerCompanyDirectors: [''],
            customerCompanyShareholders: [''],
            customerTypeId: [''],
            customerGroupId: [''],
            customerGroupName: ['', Validators.required],
            accountNumber: [''],
            loanTypeId: ['', Validators.required],
            productClassProcessId: ['', Validators.required],
            existingExposure: [''],
            taxIdentificationNumber: [' '],
            registrationNumber: [' '],
            customerTopClients: [''],
            customerTopSuppliers: ['']
        });
    }

    getCustomers() {
        this.customerService.getBranchCustomers().subscribe((response: any) => {
            this.customers = response.result;
        })
    }

    getCustomerLoans(customerId) {
        this.loanService.getLoanDedubeCheck(customerId).subscribe((response: any) => {
            this.existingLoans = []; this.outstandingAmt = 0; this.totalApproved = 0;
            this.existingLoans = response.result;

            if (this.existingLoans.length > 0) {
                this.existingLoans.forEach(el => {
                    this.outstandingAmt += el.outstandingPrincipal;
                    this.totalApproved += el.approvedAmount;
                });
                this.existingExposure = this.outstandingAmt.toLocaleString('en-US', { minimumFractionDigits: 2 });
                this.existingApproved = this.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
            this.loanApplForm.controls['existingExposure'].setValue(`${this.existingExposure}`);
        });
    }

    getCustomerGroupLoans(customerGroupId) {
        this.loanService.getCustomerGroupLoans(customerGroupId).subscribe((response: any) => {
            this.existingLoans = []; this.outstandingAmt = 0; this.totalApproved = 0;
            this.existingLoans = response.result;

            if (this.existingLoans.length > 0) {
                this.existingLoans.forEach(el => {
                    this.outstandingAmt += el.outstandingPrincipal;
                    this.totalApproved += el.approvedAmount;
                });
                this.existingExposure = this.outstandingAmt.toLocaleString('en-US', { minimumFractionDigits: 2 });
                this.existingApproved = this.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
            this.loanApplForm.controls['existingExposure'].setValue(`${this.existingExposure}`);
        });
    }
    processid: any;
    getProductClass() {
        this.productService.getAllProductClassByProcessidAndcustomertypeid(+this.customerTypeId, +this.processid).subscribe((res) => {

            this.productClasses = res.result;
        }, (err) => {
            ////console.log(err);
        });
    }

    getAllLoanTypes() {
        this.loadingService.show();
        this.loanService.getLoanTypes().subscribe((res) => {
            let tempData = [];
            tempData = res.result;
            this.loanTypes = tempData;
            this.loadingService.hide();
        }, (err: any) => {
            ////console.log(err);
            this.loadingService.hide(1000);
        });
    }
    customerTypeId: any;
    pickSearchedData(item) {
        ////console.log('search item', item);
        this.selectedCustomer = item;
        this.loanApplForm.controls['customerId'].setValue(item.customerId);
        this.loanApplForm.controls['customerName'].setValue(item.accountHolder);
        this.loanApplForm.controls['customerTypeId'].setValue(item.customerTypeId);
        this.loanApplForm.controls['customerGroupName'].setValue(item.customerGroupName);
        this.customerTypeId = item.customerTypeId;
        this.customerGroupId = item.customerGroupId;
        ////console.log('customer group id', this.customerGroupId);
        // this.loanApplForm.controls['productClassId'].setValue(item.productClassId);
        // this.loanApplForm.controls['subSectorId'].setValue(item.subSectorId);

        // this.getSectorBySubSector(item.subSectorId);
        // this.loanApplForm.controls['customerSectorId'].setValue(item.customerSectorId);

        this.loanApplForm.controls['accountNumber'].setValue(item.productAccountNumber);
        this.loanApplForm.controls['taxIdentificationNumber'].setValue(item.taxIdentificationNumber);
        this.loanApplForm.controls['registrationNumber'].setValue(item.registrationNumber);

        if (item.isBlacklist === true) {
            this.displayBlacklistMessage = true;
            this.disableBtn = true;
        }
        if (item.isOnWatchList === true) {
            // this.displayWatchlistMessage = true;
            // this.disableBtn = true;
        }
        if (item.isCamsol === true) {
            // this.displayCamsolMessage = true;
            // this.disableBtn = true;
        }

        this.existingExposure = '0.00'; this.existingApproved = '0.00';
        this.getCustomerLoans(item.customerId);

        this.companyDirectors = item.customerCompanyDirectors;
        this.companyShareholders = item.customerCompanyShareholders;
        this.companyBvnInformation = item.customerBvnInformation;
        this.customerTopSuppliers = item.customerSuppliers;
        this.customerTopClients = item.customerClients;
        this.displaySearchModal = false;
    }

    pickSearchedGroupData(item) {
        ////console.log('search item', item);
        this.selectedGroup = item;
        this.loanApplForm.controls['customerGroupId'].setValue(item.customerGroupId);
        this.loanApplForm.controls['customerGroupName'].setValue(item.customerGroupName);
        this.loanApplForm.controls['customerTypeId'].setValue(2);
        this.startCustomerGroupName = item.customerGroupName;
        this.customerGroupId = item.customerGroupId;
        this.customerTypeId = 2;

        this.getCustomerGroupMappingDetails(this.customerGroupId);
        this.existingExposure = '0.00'; this.existingApproved = '0.00';
        this.getCustomerGroupLoans(item.customerGroupId);
        this.displayGroupSearchModal = false;
    }

    onloanTypeSelect(loanTypeId) {
        this.loanTypeId = loanTypeId;
        this.customerTypeId = this.preLoanApplInfo.customerTypeId;
        ////console.log(this.customerTypeId);

        ////console.log('loan type', loanTypeId);
        // tslint:disable-next-line:radix
        switch (parseInt(loanTypeId)) {
            case 1:
                this.displayCustSearchBtn = true;
                this.getCustomerAccountDetails(this.customerId);
                this.displayGrpSearchBtn = false;
                break;
            case 2:
                this.displayCustSearchBtn = true;
                this.getCustomerAccountDetails(this.customerId);
                this.displayGrpSearchBtn = false;
                break;
            case 3:
                this.displayCustSearchBtn = false;
                if (this.customerGroupId > 0) {
                    this.getCustomerGroupMappingDetails(this.customerGroupId);
                }
                this.displayGrpSearchBtn = true;
                break;
            case 4:
                this.displayCustSearchBtn = false;
                this.displayGrpSearchBtn = true;
                break;
            default:
                break;
        }
    }

    onLoanAmountChange(amt) {
        ////console.log('loan amount', amt, typeof (amt));
        let amount = amt.replace(/[^0-9-.]/g, '');
        const parsedAmt = parseInt(amt, 10);
        if (parsedAmt >= 100000000) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'This application has to proceed for Preliminary Evaluation (P.E.N)', 'info');
            this.allowForLoanApplication = false;
        }
    }

    // onSubSectorSelect(subSectId) {
    //     const row = parseInt(subSectId);
    //     const selectedSubSector = this.customerSubSectors[row];
    //     this.loanApplForm.controls['subSectorName'].setValue(selectedSubSector.sectorName);
    // }

    // onSectorSelect(sectId) {
    //     const row = parseInt(sectId);
    //     const selectedSector = this.customerSubSectors[row];
    //     this.loanApplForm.controls['customerSectorName'].setValue(selectedSector.sectorName);
    // }

    // onProductClassSelect(prodClassId) {
    //     let row = parseInt(prodClassId);
    //     let selectedClass = this.productClasses[row];
    //     this.loanApplForm.controls['customerGroupName'].setValue(item.customerGroupName);
    // }

    // ReloadFromPen(activeCustomer){
    //     if(this.activeCustomer.source == 'PEN'){ 
    //         this.startLoanTypeId = this.activeCustomer.startLoanTypeId;
    //         this.preLoanApplInfo.customerId = this.activeCustomer.customerId;
    //         this.selectedCustomer.customerCode = this.activeCustomer.customerCode
    //         this.productClassProcessId = this.activeCustomer.productClassProcessId;
    //         this.selectedCustomer.relationshipManagerId = this.activeCustomer.relationshipManagerId;
    //         this.selectedCustomer.relationshipOfficerId = this.activeCustomer.relationshipOfficerId;
    //         this.companyDirectors = this.activeCustomer.companyDirectors,
    //         this.companyShareholders = this.activeCustomer.companyShareholders,
    //         this.companyBvnInformation =  this.activeCustomer.companyBvnInformation,
    //         this.customerGroupId =   this.activeCustomer.customerGroupId,
    //         this.selectedGroup.customerGroupName =  this.activeCustomer.customerGroupName,
    //         this.selectedGroup.customerGroupCode = this.activeCustomer.customerGroupCode,
    //         this.customerTopClients = this.activeCustomer.customerTopClients,
    //         this.customerTopSuppliers = this.activeCustomer.customerTopSuppliers,
    //         this.customerGroupMappings =  this.activeCustomer.customerGroupMappings,
    //         this.customerTypeId =  this.activeCustomer.customerTypeId,
    //         this.accountNumber =this.activeCustomer.accountNumber,
    //         this.taxIdentificationNumber = this.activeCustomer.taxIdentificationNumber,
    //         this.registrationNumber = this.activeCustomer.registrationNumber,
    //         this.existingExposure = this.activeCustomer.existingExposure,
    //         this.customerName = this.activeCustomer.customerName
    //         this.proceedToLoanAppl();
    //     } 
    // }

    goForLoanApplication(form, evt) {
        evt.preventDefault(); //console.log('local storage trace - form',form)
        const formObj = {
            customerId: this.customerId,
            customerName: form.value.customerName,
            customerCode: this.selectedCustomer.customerCode,
            // subSectorId: form.value.subSectorId,
            // customerSectorId: form.value.customerSectorId,
            productClassProcessId: form.value.productClassProcessId,
            //productClassId: form.value.productClassId,
            loanAmount: form.value.loanAmount,
            //  loanTypeId: form.value.loanTypeId,
            loanTypeId: this.startLoanTypeId,
            relationshipManagerId: this.selectedCustomer.relationshipManagerId,
            relationshipOfficerId: this.selectedCustomer.relationshipOfficerId,
            companyDirectors: this.companyDirectors,
            companyShareholders: this.companyShareholders,
            companyBvnInformation: this.companyBvnInformation,
            penCode: '',
            penId: '',
            customerGroupId: this.customerGroupId,
            customerGroupName: this.selectedGroup.customerGroupName,
            customerGroupCode: this.selectedGroup.customerGroupCode,
            customerTypeId: form.value.customerTypeId,
            accountNumber: form.value.accountNumber,
            taxIdentificationNumber: form.value.taxIdentificationNumber,
            registrationNumber: form.value.registrationNumber,
            existingExposure: form.value.existingExposure,
            customerTopClients: this.customerTopClients,
            customerTopSuppliers: this.customerTopSuppliers,
            customerGroupMappings: this.customerGroupMappings,
            // iblMaximumAmount: this.iblInfo.maximumAmount,
            // iblMinimumAmount: this.iblInfo.minimumAmount,
            // iblIsEligible: this.iblInfo.isEligible,
            // isIblRequest: this.iblInfo.isIblRequest
        };
        this.loadingService.show();
        
        this.loanApplService.getRefferneceNumber().subscribe((response: any) => {
            this.applicationReferenceNumber = response.result;
            sessionStorage.setItem('applicationreferencenumber', this.applicationReferenceNumber);

            sessionStorage.removeItem('customer-loan-details');
            sessionStorage.setItem('customer-loan-details', JSON.stringify(formObj));
            this.loadingService.hide();
            
            this.router.navigate(['/credit/newloan/application']);
            
        }, (err: any) => {
            this.loadingService.hide(1000);
            
        });
    }

    // goForPenApplication(form, evt) {
    //     ////console.log('App FORM for PEN ', form)
    //     evt.preventDefault();
    //     const formObj = {
    //         customerId: form.value.customerId,
    //         customerName: form.value.customerName,
    //         customerCode: this.selectedCustomer.customerCode,
    //         // subSectorId: form.value.subSectorId,
    //         // customerSectorId: form.value.customerSectorId,    
    //         productClassProcessId: form.value.productClassProcessId,
    //         productClassId: form.value.productClassId,
    //         loanAmount: form.value.loanAmount,
    //         loanTypeId: form.value.loanTypeId,
    //         relationshipManagerId: this.selectedCustomer.relationshipManagerId,
    //         relationshipOfficerId: this.selectedCustomer.relationshipOfficerId,
    //         companyDirectors: this.companyDirectors,
    //         companyShareholders: this.companyShareholders,
    //         companyBvnInformation: this.companyBvnInformation,
    //         customerTopClients: this.customerTopClients,
    //         customerTopSuppliers: this.customerTopSuppliers,
    //         penCode: '',
    //         penId: '',
    //         customerGroupId: this.selectedGroup.customerGroupId,
    //         customerGroupName: this.selectedGroup.customerGroupName,
    //         customerGroupCode: this.selectedGroup.customerGroupCode,
    //         customerTypeId: form.value.customerTypeId,
    //         accountNumber: form.value.accountNumber,
    //         taxIdentificationNumber: form.value.taxIdentificationNumber,
    //         registrationNumber: form.value.registrationNumber,
    //         existingExposure: form.value.existingExposure,
    //         customerGroupMappings: this.customerGroupMappings
    //     };

    //     // let store = JSON.parse(sessionStorage.getItem('customer-loan-details'));
    //     ////console.log('check store variable', store);

    //     // if (store == null) {
    //     //     store = [];
    //     //     sessionStorage.setItem('customer-loan-details', JSON.stringify(store));
    //     //     ////console.log('new store variable', store);
    //     // }

    //     // store.push(formObj);
    //     // // const store = [];
    //     ////console.log('pen customer', store[store.length - 1]);
    //     sessionStorage.setItem('customer-loan-details', JSON.stringify(formObj));
    //     this.router.navigate(['/credit/loan/preliminary-evaluation']);
    // }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    openGroupSearchBox(): void {
        this.displayGroupSearchModal = true;
    }

    closeSearchBox(evt) {
        evt.preventDefault();
        this.displaySearchModal = false;
        this.displayGroupSearchModal = false;
    }

    get Diagnostics() {
        return JSON.stringify(this.loanApplForm.value);
    }

    getCustomerAccountDetails(customerId) {
        this.loadingService.show();
        this.casaService.getCustomerDetailedAccountByCustomerId(customerId).subscribe((res) => {
            this.customerAccountDetails = res.result;
            this.pickSearchedData(this.customerAccountDetails);
            this.loadingService.hide();
        }, (err: any) => {
            this.loadingService.hide(1000);
            ////console.log('casa search error', err);
        });
    }

    getCustomerGroupMappingDetails(customerGroupId) {
        this.loadingService.show();
        this.customerGroupService.getCustomerGroupDetailedMappingByGroupId(customerGroupId).subscribe((res) => {
            this.loadingService.hide();
            this.customerGroupMappingDetails = res.result;
            if (this.customerGroupMappingDetails != null) {
                this.customerGroupMappings = this.customerGroupMappingDetails.customerGroupMappings;
            }
            // this.pickSearchedGroupData(this.customerGroupMappingDetails);
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('group search error', err);
        });
    }

    editSingleCustomerInfometion(index) {
        this.displaySingleCustomerInformation = true;
        this.displayStartNewGroupLoan = false;
        this.groupCustomerId = index.customerId;
        this.groupCustomerCode = index.customerCode;
        this.groupCustomerInfo.displayEditInfo = true;
        this.groupCustomerInfo.getSingleCustomerGeneralInfo(index.customerCode);
    }
    startLoanTypeSelectChanged(index) {
        // tslint:disable-next-line: radix
        switch (parseInt(index)) {
            case 1:
                this.displayCustSearchBtn = true;
                this.getCustomerAccountDetails(this.customerId);
                this.displayGrpSearchBtn = false;
                this.displayCustInfo = true;
                break;
            case 3:
                this.displayCustSearchBtn = false;
                this.displayCustInfo = false;
                if (this.customerGroupId > 0) {
                    this.getCustomerGroupMappingDetails(this.customerGroupId);
                }
                this.displayGrpSearchBtn = true;
                break;
            default:
                break;
        }
    }
    resetviews() {
        this.displayStartNewLoan = false;
        this.displayCustInfo = false;
        this.displayStartNewGroupLoan = false;
        this.displayCreditBureau = false;
        this.displayAdditionalModals = false;
        this.displayStartLoanAppl = false;
    }
    homePage: number = 1

    proceedToNext() {
        if (this.corporateCustomerSelect) {
            this.startLoanTypeId = this.corporateCustomerSelect;
        }
        this.loanApplForm.controls['loanTypeId'].setValue(this.startLoanTypeId);
        if (this.startLoanTypeId == 1) {
            this.resetviews();
            // this.emitCustomerType.emit(this.singleCustomerType);
            this.displayCustInfo = true;

        } else {
            this.resetviews();
            this.displayStartNewGroupLoan = true;
        }
    }

    proceedToGroupLoan() {
        this.customer = this.customerGroupMappings.map(x => {return x.customerId});

        //if(this.preLoanApplInfo.customerTypeId == 2 && this.customer.find(y=>y.completedInformation == false))
        if(this.preLoanApplInfo.customerTypeId == 2 && (this.preLoanApplInfo.completedInformation == false || this.preLoanApplInfo.accountCreationComplete == false))
        {
         swal(`${GlobalConfig.APPLICATION_NAME}`, "Customer profile not complete, Kindly Proceed to update customer information before proceeding", 'error');
         return;
         }

        this.displayStartLoanAppl = true;
        // this.getCustomerAccountDetails(this.customerGroupId);
        // this.proceedToLoanAppl();
        this.displayStartNewGroupLoan = false;
        // if (this.customerGroupId > 0) {
        //     this.getCustomerGroupMappingDetails(this.customerGroupId);
        // }
    }

    creditCheck: number = 3
    proceedToCreditCheck(e) {
        this.loanApplForm.controls['loanTypeId'].setValue(this.startLoanTypeId);
        ////console.log('this.startLoanTypeId', this.startLoanTypeId);
        if(this.preLoanApplInfo.customerTypeId == 2 && (this.preLoanApplInfo.completedInformation == false || this.preLoanApplInfo.accountCreationComplete == false))
        {
         swal(`${GlobalConfig.APPLICATION_NAME}`, "Customer profile not complete, Kindly Proceed to update customer information before proceeding", 'error');
         return;
         }
         
        if (this.startLoanTypeId == 1) {
            this.resetviews()
            this.displayCustInfo = false;
            this.creditBureauObj.display = true;
            this.creditBureauObj.showProceedToApplication = true;    
            this.creditBureauObj.getCreditBureauCustomer(e.customerId, 0, false);
            this.displayCreditBureau = true;
        } else {
            this.displayStartNewLoan = false;
            this.displayStartNewGroupLoan = false;
            this.displayCustInfo = false;
            this.resetviews()
            this.creditBureauObj.display = true;
            this.creditBureauObj.showProceedToApplication = false;
            this.creditBureauObj.getCreditBureauCustomer(e.customerId, 0, false);
            this.displayCreditBureau = true;
        }
    }

    proceedToLoanAppl() {
       
        this.resetviews();
        this.displayStartLoanAppl = true;
        this.loanApplForm.controls['loanTypeId'].setValue(this.startLoanTypeId);
        this.closeCustomerInfoModal();
        this.preLoanApplInfo = JSON.parse(sessionStorage.getItem('pre-startLoanApplication'));
        //this.iblInfo = JSON.parse(sessionStorage.getItem('ibl-eligibility'));
        this.customerId = this.preLoanApplInfo.customerId;
        this.customer.push(+this.customerId)
        this.customercode.push(+this.preLoanApplInfo.customerCode)
        

        this.getCustomerAccountDetails(this.customerId);
        this.getAllLoanTypes();
    }

    closeModal() {
        if (this.customerGroupId > 0) {
            this.getCustomerGroupMappingDetails(this.customerGroupId);
        }
        this.displaySingleCustomerInformation = true;
        this.groupCustomerInfo.displayEditInfo = false;
        this.displayStartNewGroupLoan = true;
    }
}