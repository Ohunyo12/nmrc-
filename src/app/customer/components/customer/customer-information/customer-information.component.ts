import { AuthenticationService } from './../../../../admin/services/authentication.service';
import { saveAs } from 'file-saver';
import { CustomerInformationDetailComponent } from '../customer-information-detail/customer-information-detail.component';
import { LoanApplicationService } from '../../../../credit/services/loan-application.service';
import { GlobalConfig, CustomerTypeEnum, IntegratedCustomerTypeEnum, ConvertString } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { GeneralSetupService } from '../../../../setup/services';
import { CompanyService } from '../../../../setup/services/company.service';
import { 
    ICustomerCompanyDirectors, ICustomerInfo
} from '../../../models/CustomerInfo';
import { Subject } from 'rxjs';
import { BranchService } from '../../../../setup/services/branch.service';
import { CustomerService } from '../../../services/customer.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';

import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CasaService } from 'app/customer/services/casa.service';
import { TreeError } from '@angular/compiler';

@Component({
    selector: 'app-customer-information',
    templateUrl: './customer-information.component.html',
})
export class CustomerInformationComponent implements OnInit {
    crmsRelationshipTypes: any[];
    crmsCompanySizes: any[];
    crmsLegalStatuses: any[];

    selfEmployed: boolean;
    customerRelatedParties: any[];
    displayRelatedPartyForm: boolean = false;
    customerRelatedPartyForm: FormGroup;
    relatedPartyHeader: string;
    companyDirectors: any[];
    today = new Date(); 
    displayCustomerInfoDetails: boolean = false;
    phoneNumber: string = "Phone Number"
    MobileNumber: string = "Mobile Number"
    searchResults: any[];
    customerSelection: any; // selection
    customerSensitivityLevelList: any[];
    genderList: any[];
    titleList: any[];
    branches: any[];
    isIBLEligible: boolean = false;
    iblEligibility: any;
    customerTypes: any[];
    corporateCustomerType: any[];
    customers: any[] = [];
    searchTerm$ = new Subject<any>();
    searchTerm2$ = new Subject<any>();
    searchTerm3$ = new Subject<any>();
    searchStagingTerm$ = new Subject<any>();
    AddCustomerForm: FormGroup;
    customerSearchForm: FormGroup;
    companyInfomationForm: FormGroup;
    cities: any[];
    lgas: any[];
    countries: any[];
    states: any[];
    officers: any[];
    filteredSubsector: any[];
    uploadDocumentType: any[];
    selectedcustomerTypeId: number;
    kycDocumentUploadList: any[] = [];
    selectedCustomer: any = {};
    listOfDirectors: ICustomerCompanyDirectors = new ICustomerCompanyDirectors;
    editCustomerForm: FormGroup;
    displayMandatesUpload: boolean = false;
    displayEditCustomer: boolean = false;
    displayCustomerList: boolean = false;
    @Input('modifyCustomerInfo') canModified: boolean = false;
    @Input('showCustomerInfo') displayCustomerDetails: boolean = false;
    @Input('editCustomerInfoByDefault') editCustomerInfoByDefault: boolean = true;
    isCorperateCustomer: boolean = false;
    isIndividualCustomer: boolean = false;
    isOtherCustomer: boolean = false;
    isMarriedOrSingle: boolean = false;
    isMaleOrFemale: boolean = false;
    customerCodetitle: any;
    companies: any[];
    activeIndex = 0;
    model: any[];
    customersInfo: ICustomerInfo;
    customerId: number = null;
    identificationModeTypes: any[];
    clientSuplierTypes: any[];
    directorsTypes: any[];
    maritalStatusList: any[];
    riskRatings: any[];
    customerClientOrSupplierForm: FormGroup;
    PanelHeader: string;
    customerFullName: string;
    displaySupplier: boolean = false;

    ultimateBeneficiaryForm: FormGroup;
    eligibilitySearchForm: FormGroup;
    ultimateBeneficialList: any[] = [];
    customerNextOfKin: any[];
    customerValidation: any[];

    customerAddressesForm: FormGroup;
    displayAddresses: boolean = false;
    displayAddCustomer: boolean = false;
    customerPhoneContactForm: FormGroup;
    displayPhoneContact: boolean = false;

    customerNextOfKinForm: FormGroup;
    displayNextOfKin: boolean = false;


    customerIdentificationForm: FormGroup;
    displayIdentification: boolean = false;

    customerBvnForm: FormGroup;
    displayBVN: boolean = false;

    displayViewUltimateBeneficial: boolean = false;
    displayAccountBalance: boolean = false;
    corporateShareholderName: string;

    customerEmploymentHistoryForm: FormGroup;
    displayEmploymentHistory: boolean = false;
    customerCompanyDirectorsForm: FormGroup;
    customerCompanyShareholderForm: FormGroup;
    displayCompanyDirectors: boolean = false;
    displayCompanyShareholder: boolean = false;
    firstNameLabel: string = "First Name";
    dateOfBirthLabel: string = "Date of Birth";
    occupationLabel: string = "Occupation";
    binaryFile: any;
    selectedDocument: string;
    displayUpload: boolean = false;
    sectors: any[];
    subSectors: any[] =[];
    customerCompanyInfomation: any;
    customerAddresses: any[] =[];
    customerPhoneContact: any[] = [];
    customerClient: any[];
    customerSupplier: any[];
    customerAddressType: any[];
    customerIdentification: any[];
    customerBvn: any[];
    customerEmploymentHistory: any[]
    customerCompanyDirectors: any[];
    // customerCompanyShareholder: any[];
    customerCompanyShareholderIndividual: any[];
    customerCompanyShareholderCorporate: any[];
    customerCompanyUltimateBeneficial: any[];
    customerCompanyAccountSignatory: any[];
    customerAddedChildren: any[];

    corporateClientSupplier: boolean = false;
    individualClientSupplier: boolean = false;
    ultimateBeneficiary: boolean = false;
    displayAddUltimateBeneficiary: boolean = false;
   
   
    contactTabDisabled: boolean = false;
    shareholderTabDisabled: boolean = false;
    // identificationTabDisabled: boolean = true;
    nextOfKinTabDisabled: boolean = false;
    employmentTabDisabled: boolean = false;
    directorTabDisabled: boolean = false;
    supplierTabDisabled: boolean = false;
    relatedPartyTabDisabled: boolean = false;



    uploadTabDisabled: boolean = false;
    ShowNextButton: boolean = false;
    ShowSaveButton: boolean = false;
    ShowSaveCompanyButton: boolean = false;
    showHideSearch: boolean = true;
    individualShareholder: boolean = false;
    corporateShareholder: boolean = false;

    clientSupplierType: string;
    childrenCount: string;
    customerChildren: any[] = [];
    customerNewChildren: any[] = [];
    displayAddChildren: boolean = false;
    hasChildren: boolean = true;
    data: any = {};
    show: boolean = false; message: any; title: any; cssClass: any;

    @Input('display') display: boolean = true;
    // tslint:disable-next-line:no-output-rename
    @Output('hideCustomerInfo') hideCustomerInfo = new EventEmitter();
    @Input('showProceedButton') showProceedButton: boolean = false;
    @Input() fromForwardPage: boolean = false;
    @Input('searchQuery') searchQuery = new Subject<string>();
    @Input('canCreateCustomer') canCreateCustomer: boolean = false;
    @Output() proceedEvent = new EventEmitter();
    @Output() lookupEvent = new EventEmitter();
    @Output() customerModel = new EventEmitter(); 
    @Input() singleCustomerType: number;
    displaySearchModal: boolean = false;

    filteredEmployer: any[] = [];
    employerList: any[];
    stagingSearch: string;
    customerIdExist: boolean = true;
    staffId: number = 0;
    entityTitle: string = 'Edit Customer Details For:';
    isProspect: boolean = false;
    otherEmployer: boolean = true;
    directorBVN: string;
    showDirectorRelatedCustomer: boolean = false;
    customerAccountNumber: string;
    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfoDetails: CustomerInformationDetailComponent;
    accountBalances: any;
    accountBalancesForm: FormGroup;
    businessUnit: any;
    selected: any;
    pipe: DatePipe;
    customerCode: any;
    canDelete: boolean= false;
    showNextTabs: boolean= false;
    flexcube: any;
    flexcubeBVN: any;
    flexcubeMiddleName: any;
    flexcubeAddress: any;
    flexcubeTelephone: any;
    flexcubePhoneNumber: any;
    employerName: any;
    selfEmployedCheck: boolean;
    editShareholder: any;
    flexcubeTIN: any;
    canRefreshAccount: boolean;
    flexcubeEmailAddress: any;
    isProspectConversion: boolean = false;
    approvedEmployers: any;
    disableControls: any = null;
    disableEmployerControl: any = 1;
    isEmploymentHistoryEdit: boolean = false;
    selectedEmploymentHistoryIndex: any;
    displayEligibilityModal: boolean;
    customerAccount: any;
    customerPhone: any;
    iblAmount: any;
    iblMinimumAmount: any;
    iblEligibilityId: any;

    constructor(private loadingService: LoadingService,
        private validationService: ValidationService,
        private fb: FormBuilder,
        private casaService: CasaService,
        private authservice: AuthenticationService,
        private customerService: CustomerService,
        private loanAppService: LoanApplicationService,
        private companyService: CompanyService,
        private branchService: BranchService,
        private countryStateSrv: CountryStateService,
        private genSetupServ: GeneralSetupService,
        private router: Router) {
        this.customerService.searchForSingleCustomer(this.searchTerm$).subscribe(results => {
            this.customers = results.result;
            ////console.log('this.customers',this.customers);
            
        });
        this.customerService.searchForSingleCorporateCustomer(this.searchTerm2$).subscribe(results => {
            this.customers = results.result;
        });
        this.customerService.searchForAllCustomer(this.searchTerm3$).subscribe(results => {
            this.customers = results.result;
        });
        
        this.customerService.searchForCustomerStaging(this.searchStagingTerm$, this.isProspectConversion).subscribe(results => {
            this.searchResults = results.result;
            this.loadingService.hide();
        });

    }

    ngOnInit() {
        const userInfo = this.authservice.getUserInfo();
        this.staffId = userInfo.staffId;
        this.loadCustomerRelatedParty();
        this.loadCompanyInformation();
        this.loadCustomerDropdowns();
        this.loadCustomerInformationForm();
        this.LoadClientOrSupplierForm();
        this.LoadIdentificationForm();
        this.LoadBVNForm();
        this.LoadEmploymentHistoryForm();
        this.LoadCompanyDirectorsForm();
        this.LoadCompanyShareholderForm();
        this.LoadUltimateBeneficiaryForm();
        this.LoadEligibilitySearchForm()
        this.LoadAddressesForm();
        this.LoadPhoneContactForm();
        this.loadNextOfKin();
        this.getStates();
        this.getCountries();
        this.getListOfMaritalStatus();
        this.getListOfGender();
        this.getListOfTitle();
        this.getListOfCustomerSensitivityLevel();
        this.getAllOfficers();
        this.getFilteredSubsector();
        this.getSectors();
        this.getKYCDocumentType();
        this.clearSearchForm();
        this.loadDropdowns();
        this.getAllLoginCompany();
        this.loadEmployer();
        this.getProfileBusinessUnits();
        this.getApprovedEmployers();
    }
    setSingleCustomerType(event) {
       // console.log('singleCustomerType'+ event); 
        // this.singleCustomerType = event;
     }

    loadDropdowns() {
        this.branchService.get().subscribe((response) => {
            this.branches = response.result;
        });
        this.customerService.getAllCustomerTypes().subscribe((response) => {
            this.customerTypes = response.result;

        });
        this.customerService.getCorporateCustomerTypes().subscribe((response) => {
            this.corporateCustomerType = response.result;

        });
        this.customerService.getCustomerAddressTypes().subscribe((response) => {
            this.customerAddressType = response.result;
        });
        this.customerService.getCustomerRiskRating().subscribe((response) => {
            this.riskRatings = response.result;
        });
        this.companyService.getCompanyDirectorsByCompanyId().subscribe((response) => {
            this.companyDirectors = response.result;
            //console.log('DIRECTORS',this.companyDirectors );
        });
    }

    loggedInCompany:any;
    loginCountryId: any;
    getAllLoginCompany() {
        this.companyService.getAllLoginCompany().subscribe(response => {
                this.loggedInCompany = response.result;  
                this.loginCountryId =   this.loggedInCompany.countryId        
        });
    }

    
    searchDB(searchString) { 
        //console.log(this.singleCustomerType);
        if (this.singleCustomerType == 1) {
            this.searchTerm$.next(searchString);
        } else if (this.singleCustomerType == 2) {
            this.searchTerm2$.next(searchString);
        } 
        else {
            this.searchTerm3$.next(searchString);
            this.searchTerm$.next(searchString);
        }
    }

    getApprovedEmployers() {
        this.genSetupServ.getApprovedEmployers().subscribe((employers) => {
            this.approvedEmployers = employers.result;
        });
    }

    toggleIBL(event){
        if (event == true) {
            this.iblRequest = true;
        } else {
            this.iblRequest = false;
            if(this.iblEligibilityId !=null || this.iblEligibilityId != undefined){
           this.updateIBLEligibility(this.iblEligibilityId);
            }
        }
    }
    updateIBLEligibility(iblEligibilityId){
        //iblEligibilityId = this.iblEligibilityId;
        this.loadingService.show;
        this.customerService.updateIBLEligibility(iblEligibilityId).subscribe((response) => {
         this.loadingService.hide(); 
         if (response.success === true) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
    }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
       
    });

     }

    isEmployerRelated(event) {
        // reset the form validators appropriately
        const approvedEmployerControl = this.customerEmploymentHistoryForm.get('approvedEmployerId');
        this.resetEmployerRelatedForm(event, approvedEmployerControl);

        // reset the form values appropriately
        if (event != true) {
            if (this.isEmploymentHistoryEdit != true) { 
                this.LoadEmploymentHistoryForm(); 
            }
            else {
                this.editEmploymentHistory(this.selectedEmploymentHistoryIndex, event);
            }
        }
      
    }

    resetEmployerRelatedForm(isEmployerRelated, approvedEmployerControl) {
        if (isEmployerRelated == true) {
            this.disableControls = 1;
            this.disableEmployerControl = null;
            this.activeCountry = true;
            approvedEmployerControl.setValidators(Validators.required);
        }
        else {
            this.disableControls = null;
            this.disableEmployerControl = 1;
            this.activeCountry = false;
            approvedEmployerControl.clearValidators();            
        }
        approvedEmployerControl.updateValueAndValidity();
    }

    onApprovedEmployerChange() {
        let approvedEmployerId = this.customerEmploymentHistoryForm.value.approvedEmployerId;
        let approvedEmployer = this.approvedEmployers.filter(O => O.employerId == approvedEmployerId)[0];
        console.log("approvedEmployer: ", approvedEmployer);

        if (approvedEmployer != undefined) {
            this.populateEmployerForm(approvedEmployerId, approvedEmployer);
        }
    }

    populateEmployerForm(approvedEmployerId, selectedEmployer) {
        this.LoadEmploymentHistoryForm();
       // console.log('selectedEmployer', selectedEmployer);
       
        this.customerEmploymentHistoryForm = this.fb.group({
            placeOfWorkId: [0, Validators.required],
            employerName: [selectedEmployer.employerName, Validators.required],
            employerAddress: [selectedEmployer.address, Validators.required],
            employerCountryId: [selectedEmployer.countryId, Validators.required],
            officePhone: [selectedEmployer.phoneNumber, [Validators.minLength(9),Validators.maxLength(20) ,Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            employDate: [new Date(selectedEmployer.establishmentDate), Validators.required],
            previousEmployer: ["None", Validators.required],
            customerId: [this.customerId, Validators.required],
            active: [selectedEmployer.active],
            //yearOfEmployment:[selectedEmployer.yearOfEmployment],
            //totalWorkingExperience:[selectedEmployer.totalWorkingExperience],
            //yearsOfCurrentEmployment:[selectedEmployer.yearsOfCurrentEmployment],
            //terminalBenefits:[selectedEmployer.terminalBenefits],
            //annualIncome:[selectedEmployer.annualIncome],
            //monthlyIncome:[selectedEmployer.monthlyIncome],
            //expenditure:[selectedEmployer.expenditure],
            employerState:[selectedEmployer.employerState, ],
            employerStateId: [selectedEmployer.stateId, ],
            approvedEmployerId: [approvedEmployerId],
            isEmployerRelated: [this.disableControls],
        });
    }

    searchStagingDB(searchString) {
        this.loadingService.show();
        this.searchStagingTerm$.next(searchString);
        this.loadingService.hide(400);
    }

    searchCustomerWithAccountNumber(accountNumber, isProspectConversion) {
        this.flexcube = 1;
        this.loadingService.show();
        this.customerService.searchCustomerStagingRealtime(accountNumber, isProspectConversion).subscribe(response => {
            this.loadingService.hide();
            if (response.success == true) {
                this.customerAccountNumber = accountNumber;
                this.searchResults = response.result;
               // console.log('searchResults',this.searchResults);
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
            }
        });
    }

    isPoliticallyExposed: boolean;
    selectedSearchCustomer(selected) { 
        this.flexcube = 1;
        //console.log("customer: ", selected);
        this.flexcubeBVN = selected.customerBVN;
        this.flexcubeMiddleName = selected.middleName;
        this.flexcubeAddress = selected.contactAddress;
        this.flexcubePhoneNumber = selected.phoneNumber;
        this.flexcubeTelephone = selected.telephone;
        this.flexcubeTIN = selected.businessTaxIdNumber;
        //this.flexcubeEmailAddress = selected.emailAddress;
        this.customerCode = selected.customerCode;
        this.ValidateNewCustomer(selected.customerCode);
        this.ValidateToRestrictSavingsAccount(this.customerAccountNumber);
        this.validateCustomerEligibility(selected.customerCode);
        this.selected = selected;

        this.isPoliticallyExposed = selected.isPoliticallyExposed;
        this.editCustomerForm.get('firstName').setValue(selected.firstName);
        this.editCustomerForm.get('middleName').setValue(selected.middleName);
        this.editCustomerForm.get('lastName').setValue(selected.lastName);
        this.editCustomerForm.get('customerCode').setValue(selected.customerCode);
        this.editCustomerForm.get('customerTypeId').setValue(selected.customerTypeId);
        this.editCustomerForm.get('occupation').setValue(selected.occupation);
        this.editCustomerForm.get('customerBVN').setValue(selected.customerBVN);
        this.editCustomerForm.get('title').setValue(selected.title);
        this.editCustomerForm.get('dateOfBirth').setValue(new Date(selected.dateOfBirth));
        this.editCustomerForm.get('placeOfBirth').setValue(selected.placeOfBirth);
        this.editCustomerForm.get('nationalityId').setValue(selected.nationalityId);
        this.editCustomerForm.get('emailAddress').setValue(selected.emailAddress);
        this.editCustomerForm.get('isPoliticallyExposed').setValue(selected.isPoliticallyExposed);

        this.editCustomerForm.get('nameOfSignatory').setValue(selected.nameofSignatories);
        this.editCustomerForm.get('addressOfSignatory').setValue(selected.addressofSignatories);
        this.editCustomerForm.get('phoneNumberOfSignatory').setValue(selected.phoneNumberofSignatories);
        this.editCustomerForm.get('emailOfSignatory').setValue(selected.emailofSignatories);
        this.editCustomerForm.get('bvnNumberOfSignatory').setValue(selected.bvnNumberofSignatories);


        if (selected.customerTypeId == IntegratedCustomerTypeEnum.CORPORATE) { 
            this.editCustomerForm.get('taxNumber').setValue(selected.businessTaxIdNumber);
            
            this.customerTypeChanged(CustomerTypeEnum.CORPORATE);
        } 
        else {
            if(selected.gender == "Male" || selected.gender == "M" ){ this.editCustomerForm.get('gender').setValue('Male'); }
            if(selected.gender == "Female"  || selected.gender == "F" ){ this.editCustomerForm.get('gender').setValue('Female'); }

            if(selected.maritalStatus == "S" ){ this.editCustomerForm.get('maritalStatus').setValue(1); }
            if(selected.maritalStatus == "M" ){ this.editCustomerForm.get('maritalStatus').setValue(2); }
            if(selected.maritalStatus == "D" ){ this.editCustomerForm.get('maritalStatus').setValue(3); }
            if(selected.maritalStatus == "W" ){ this.editCustomerForm.get('maritalStatus').setValue(4); }

            this.customerTypeChanged(CustomerTypeEnum.INDIVIDUAL);
        }
        let kk = this.searchResults.filter(x => x.customerCode == selected.customerCode);
        ////console.log('search item picked', kk);
        this.displaySearchModal = false;
    }

    showAddNew() {
        this.resetFlexCube();
        this.entityTitle = 'Add New Existing Customer';
        this.canRefreshAccount = false;
        this.isProspect = false;
        this.searchResults = [];
        this.customerId = null;
        this.displaySearchModal = true;
        this.loadCustomerInformationForm();
        this.isOtherCustomer = true;
        this.isCorperateCustomer = false;
        this.isIndividualCustomer = false;
        this.displayCustomerDetails = true;
        this.display = false;
        this.customersInfo = null;
        this.customerSelection = null;
        this.ShowNextButton = false;
        this.ShowSaveButton = true;
        this.customerAddresses = [];
        this.customerEmploymentHistory = [];
        this.kycDocumentUploadList = [];
        this.customerNewChildren = [];
        this.customerIdExist = false;
        this.editCustomerForm.get('customerTypeId').setValidators(Validators.required);
    }

    showAddNewProspectiveCustomer() {
        this.resetFlexCube();
        this.entityTitle = 'Add New Prospective Customer';
        this.canRefreshAccount = false;
        this.isProspect = true;
        this.customerId = null;
        this.loadCustomerInformationForm();
        this.isOtherCustomer = true;
        this.isCorperateCustomer = false;
        this.isIndividualCustomer = false;
        this.displayCustomerDetails = true;
        this.display = false;
        this.customersInfo = null;
        this.customerSelection = null;
        this.ShowNextButton = false;
        this.ShowSaveButton = true;
        this.customerAddresses = [];
        this.customerEmploymentHistory = [];
        this.kycDocumentUploadList = [];
        this.customerNewChildren = [];
        this.customerIdExist = false;
        // const middleNameControl = this.editCustomerForm.get('middleName');
        // middleNameControl.clearValidators();
        // middleNameControl.updateValueAndValidity();
    }

    showAddNewMandate() {
        this.displayMandatesUpload = true;
    }

    getYearsInEmployment(employDate) {
        //console.log("Original input "+employDate);
        var event = new Date(employDate);
        let date = JSON.stringify(event)
        date = date.slice(1,11)
        //console.log("i am trying to get getYearsInEmployment "+date);
        const bdate = new Date(date);
        const timeDiff = Math.abs(Date.now() - bdate.getTime() );
        let employmentYears = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

        this.customerEmploymentHistoryForm.controls['yearOfEmployment'].setValue(employmentYears);

    }
    
    addToList() {
        if (this.customerChildren === undefined) {
            this.customerChildren = [];
        }
        if (this.customerChildren.length >= 4) {
            swal('FinTrak Credit 360', "The maximum number of children exceeded ", "warning");
            this.data.childName = "";
            this.data.childBirthDate = "";
            return;
        }
        var child = {
            customerChildrenId: 0,
            childName: this.data.childName,
            childBirthDate: new Date(this.data.childBirthDate)
        };
        ////console.log(child);
        this.customerNewChildren.push(child);
        this.customerChildren.push(child);
        this.hasChildren = false;
        this.childrenCount = 'You have ' + (4 - this.customerChildren.length) + ' left';
        this.data.childName = "";
        this.data.childBirthDate = "";
    }

    goForPenApplication(evt) {
        ////console.log('App FORM for PEN ', )
        ////console.log('customerSelection', this.customerSelection);
        evt.preventDefault();
        const formObj = {
          customerId: this.customerSelection.customerId, //form.value.customerId,
          customerName: null, //form.value.customerName,
          customerCode: this.customerSelection.customerCode,
          productClassProcessId: null, //form.value.productClassProcessId,
          productClassId: null, //form.value.productClassId,
          loanAmount: null, //form.value.loanAmount,
          loanTypeId: null, //form.value.loanTypeId,
          relationshipManagerId: this.customerSelection.relationshipOfficerId, //this.customerSelection.relationshipManagerId,
          relationshipOfficerId: this.customerSelection.relationshipOfficerId,
          companyDirectors: null, //this.companyDirectors,
          companyShareholders: null, //this.companyShareholders,
          companyBvnInformation: null, //this.companyBvnInformation,
          customerTopClients: null, //this.customerTopClients,
          customerTopSuppliers: null, //this.customerTopSuppliers,
          penCode: '',
          penId: '',
          customerGroupId: null, //this.selectedGroup.customerGroupId,
          customerGroupName: null, // this.selectedGroup.customerGroupName,
          customerGroupCode: null, //this.selectedGroup.customerGroupCode,
          customerTypeId: this.customerSelection.customerTypeId,
          accountNumber: null, //form.value.accountNumber,
          taxIdentificationNumber: null, //form.value.taxIdentificationNumber,
          registrationNumber: null, //form.value.registrationNumber,
          existingExposure: null, //form.value.existingExposure,
          customerGroupMappings: null, //this.customerGroupMappings
        };
    
        sessionStorage.setItem('customer-loan-details', JSON.stringify(formObj));
        this.router.navigate(['/credit/loan/preliminary-evaluation']);
      }
    

    showAddChildren() {
        if (this.customerAddedChildren == undefined) {
            this.customerAddedChildren = [];
        } else {
            this.customerAddedChildren.forEach(child => {
                this.customerChildren.push({
                    customerChildrenId: child.customerChildrenId,
                    childName: child.childName,
                    childBirthDate: child.childDateOfBirth
                });
            });
        }
        this.displayAddChildren = true;
    }
    deleteChild(childId) {
        this.customerService.deleteChild(childId).subscribe((response) => {
            if (response.success == true) {
                ////console.log('deleted');
            }
        });
    }
    removeChild(evt, child) {
        evt.preventDefault();
        //  ////console.log("BEST CHILD", child);
        //  let currChild = this.customerChildren[index];
        if (child.customerChildrenId > 0) {
            this.deleteChild(child.customerChildrenId);
        }
        this.customerChildren.splice(child, 1);
        this.childrenCount = 'You have ' + (4 - this.customerChildren.length) + ' children left';
    }
    marritalStatusChanged(status) {
        this.isMarriedOrSingle = false;
        if (Number(status) === 1) {
            this.isMarriedOrSingle = false;
        } else {
            this.isMarriedOrSingle = true;
        }
    }
    genderChanged(gender) {
        this.isMaleOrFemale = false;
        if (gender === 'Male') {
            this.isMaleOrFemale = false;
        } else {
            this.isMaleOrFemale = true;
        }
    }

    customerTypeChanged(type) {
        const customerBVNControl = this.editCustomerForm.get('customerBVN');
        const titleControl = this.editCustomerForm.get('title');
        //const middleNameControl = this.editCustomerForm.get('middleName');
        const lastNameControl = this.editCustomerForm.get('lastName');
        const genderControl = this.editCustomerForm.get('gender');
        const placeOfBirthControl = this.editCustomerForm.get('placeOfBirth');
        const nationalityControl = this.editCustomerForm.get('nationalityId');
        const maritalStatusControl = this.editCustomerForm.get('maritalStatus');
        const occupationControl = this.editCustomerForm.get('occupation');
        const subSectorIdControl = this.editCustomerForm.get('subSectorId');
        const sectorIdControl = this.editCustomerForm.get('sectorId');
        const taxNumberControl = this.editCustomerForm.get('taxNumber');
        //const crmsCompanySizeControl = this.editCustomerForm.get('crmsCompanySizeId');

        if (type == CustomerTypeEnum.CORPORATE) {
            this.isCorperateCustomer = true;
            this.isIndividualCustomer = false;
            this.contactTabDisabled = true;
            this.ShowSaveButton = true;
            this.ShowSaveCompanyButton = false;
            this.firstNameLabel = "Corporate Name";
            this.dateOfBirthLabel = "Date of Incorporation";
            this.occupationLabel = "Line of Business";
            this.phoneNumber = "Office Land Number"
            this.MobileNumber = "Office Mobile Number"
            //customerBVNControl.clearValidators();
            customerBVNControl.setValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]);
            titleControl.clearValidators();
           // middleNameControl.clearValidators();
            lastNameControl.clearValidators();
            genderControl.clearValidators();
            placeOfBirthControl.clearValidators();
            nationalityControl.clearValidators();
            maritalStatusControl.clearValidators();
            occupationControl.clearValidators();
            subSectorIdControl.setValidators(Validators.required);
            sectorIdControl.setValidators(Validators.required);
            // taxNumberControl.setValidators(Validators.required);
            taxNumberControl.clearValidators();
            //crmsCompanySizeControl.setValidators(Validators.required);
        ////console.log("ent1", "Enter 1");

        } else {
            this.isCorperateCustomer = false;
            this.isIndividualCustomer = true;
            this.isOtherCustomer = true;
            this.ShowSaveButton = true;
            this.ShowSaveCompanyButton = false;
            this.contactTabDisabled = false;
            this.firstNameLabel = "First Name";
            this.dateOfBirthLabel = "Date of Birth"
            this.occupationLabel = "Occupation"
            this.phoneNumber = "Home Phone Number"
            this.MobileNumber = "Mobile Number"
            customerBVNControl.setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]);
            //customerBVNControl.setValidators([Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
            titleControl.setValidators(Validators.required);
            //if(this.isProspect == false){middleNameControl.setValidators(Validators.required);}
            lastNameControl.setValidators(Validators.required);
            genderControl.setValidators(Validators.required);
            placeOfBirthControl.setValidators(Validators.required);
            nationalityControl.setValidators(Validators.required);
            maritalStatusControl.setValidators(Validators.required);
            occupationControl.setValidators(Validators.required);
            subSectorIdControl.clearValidators();
            sectorIdControl.clearValidators();
            taxNumberControl.clearValidators();
            //crmsCompanySizeControl.clearValidators();
            ////console.log("ent2", "Enter 2");

        }

        customerBVNControl.updateValueAndValidity();
        titleControl.updateValueAndValidity();
        //middleNameControl.updateValueAndValidity();
        lastNameControl.updateValueAndValidity();
        genderControl.updateValueAndValidity();
        placeOfBirthControl.updateValueAndValidity();
        nationalityControl.updateValueAndValidity();
        maritalStatusControl.updateValueAndValidity();
        occupationControl.updateValueAndValidity();
        subSectorIdControl.updateValueAndValidity();
        sectorIdControl.updateValueAndValidity();
        taxNumberControl.updateValueAndValidity();
        //crmsCompanySizeControl.updateValueAndValidity();
        this.loadCustomerDropdownsByType(type);


    }

    loadCustomerDropdownsByType(id) {
        ////console.log("id", id);

        this.customerService.getCRMSLegalStatusesByType(id).subscribe((response) => {
            this.crmsLegalStatuses = response.result;
           // console.log('CRMS', this.crmsLegalStatuses);

        });

        //   this.customerService.getCRMSCompanySizes(id).subscribe((response) => {
        //     this.crmsCompanySizes = response.result;
        //     ////console.log("crmsCompanySizes",this.crmsCompanySizes );

        // });

        //   this.customerService.getCRMSRelationshipTypesByType(id).subscribe((response) => {
        //     this.crmsRelationshipTypes = response.result;

        // });
    }
    getRelationshipType(id) {
        ////console.log("getRelationshipType", id);
        var newval = this.crmsRelationshipTypes.find(x => x.lookupcustomerId == id);
        ////console.log("crmsRelationshipTypes", newval);


    }
    getLegalStatus(id) {
        ////console.log("getLegalStatus", id);
        this.crmsLegalStatuses = this.crmsLegalStatuses.find(x => x.lookupcustomerId == id);
        ////console.log("crmsLegalStatuses", this.crmsLegalStatuses);

    }

    submitForm(form) {
        if (this.customerSearchForm.invalid) {
            return;
        }
        this.loadingService.show();
        let body = {
            customerName: form.value.customerName,
            phoneNumber: form.value.phoneNumber,
            customerTypeId: form.value.customerTypeId,
            branchId: form.value.branchId,
        };
        this.customerService.search(body).subscribe((response) => {
            if (response.success == true) {
                this.customers = response.result;
                this.displayCustomerList = true;
                this.loadingService.hide();
                this.showHideSearch = false;
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
            phoneNumber: ['', Validators.compose([ValidationService.isNumber, Validators.minLength(8), Validators.maxLength(12)])],
            customerTypeId: [''],
            branchId: [''],
        });
    }

    backToSearch() {
        this.customers = [];
        this.showHideSearch = true;
    }

    loadCustomerInformationForm() {
        this.editCustomerForm = this.fb.group({
            customerId: [0],
            customerCode: [''],
            branchId: [''],
            companyMainId: [''],
            branchName: [''],
            title: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            customerTypeName: [''],
            customerName: [''],
            searchItem: [''],
            lastName: [''],
            gender: [''],
            dateOfBirth: ['', Validators.required],
            placeOfBirth: [''],
            nationalityId: [''],
            maritalStatus: [''],
            emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            maidenName: [''],
            spouse: [''],
            firstChildName: [''],
            childDateOfBirth: [''],
            occupation: [''],
            customerTypeId: ['', Validators.required],
            relationshipOfficerId: [this.staffId, Validators.required],
            isPoliticallyExposed: [''],
            misCode: [''],
            misStaff: [''],
            approvalStatus: [''],
            dateActedOn: [''],
            actedOnBy: [''],
            accountCreationComplete: [''],
            creationMailSent: [''],
            customerSensitivityLevelId: [1],
            subSectorId: [''],
            subSectorName: [''],
            sectorId: [''],
            sectorName: [''],
            taxNumber: [''],
            customerBVN: ['',[Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],// [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
            riskRatingId: [''],
            //crmsRelationshipTypeId: ['', Validators.required],
            crmsRelationshipTypeId: [''],
            //crmsCompanySizeId: ['', Validators.required],
            crmsCompanySizeId: [''],
            // crmsLegalStatusId: ['', Validators.required],
            crmsLegalStatusId: [''],
            canModified: [this.canModified],
            isProspect: [this.isProspect],
            countryOfResidentId:[''],
            numberOfDependents:[''],
            numberOfLoansTaken:[''],
            loanMonthlyRepaymentFromOtherBanks:[''],
            dateOfRelationshipWithBank:[],
            relationshipTypeId:[''],
            teamLDP:[''],
            teamNPL:[''],
            corr:[''],
            pastDueObligations:[''],
            businessUnitId:['', Validators.required],
            ownership:[''],
            nameOfSignatory:[''],
            addressOfSignatory:[''],
            phoneNumberOfSignatory:[''],
            emailOfSignatory:[''],
            bvnNumberOfSignatory:[''],
        });
    }
   
    
    showHideCustomerForm(id) {
        ////console.log("this is just ofr testing", id);
        if (id == 4) {

        }

    }

    loadCustomerDropdowns() {
        // this.customerService.getCRMSLegalStatuses().subscribe((response) => {
        //     this.crmsLegalStatuses = response.result;
        //     ////console.log("crmsLegalStatuses",this.crmsLegalStatuses );

        // });

        this.customerService.getCRMSCompanySizes().subscribe((response) => {
            this.crmsCompanySizes = response.result;
            ////console.log("crmsCompanySizes", this.crmsCompanySizes);

        });

        this.customerService.getCRMSRelationshipTypes().subscribe((response) => {
            this.crmsRelationshipTypes = response.result;
            ////console.log("crmsRelationshipTypes", this.crmsRelationshipTypes);

        });

        this.customerService.getAllCustomerTypes().subscribe((response) => {
            this.customerTypes = response.result;
        });
        this.customerService.getCorporateCustomerTypes().subscribe((response) => {
            this.corporateCustomerType = response.result;

        });
        this.branchService.get().subscribe((response) => {
            this.branches = response.result;
        });
        this.companyService.getAllCompanies().subscribe((response) => {
            this.companies = response.result;
        })
        this.customerService.getAllIdentificationModeTypes().subscribe((response) => {
            this.identificationModeTypes = response.result;
        });
        this.customerService.getAllSupplierTypes().subscribe((response) => {
            this.clientSuplierTypes = response.result;
        });
        this.customerService.getAlldirectorsTypes().subscribe((response) => {
            this.directorsTypes = response.result;
        });
        this.customerService.getCustomerAddressTypes().subscribe((response) => {
            this.customerAddressType = response.result;
        });
        this.customerService.getCustomerRiskRating().subscribe((response) => {
            this.riskRatings = response.result;
        });
    }


    getSingleCustomerGeneralInfo(customerCode) {
        this.loadingService.show();
        this.customerCompanyInfomation = null;
        this.customerService.getSingleCustomerGeneralInfo(customerCode).subscribe((response) => {
            this.customerSelection = response.result;
            this.companyInfomationForm.get('companyName').setValue(this.customerSelection.customerName);
            this.companyInfomationForm.get('customerId').setValue(this.customerSelection.customerId);
            this.customerId = this.customerSelection.customerId;
            // console.log('this.customerId = ',this.customerSelection.customerId);

            //console.log('this.customerSelection ',JSON.stringify(this.customerSelection));

            this.customerCodetitle = this.customerSelection.customerCode;
            this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
            this.customerFullName = this.customerSelection.customerName;

            this.getAccountBalance(this.customerId);

            if (this.customerSelection != null) {
                this.editCustomerGeneralInformation(this.customerSelection);
                this.ShowSaveButton = true;

                if (this.selectedcustomerTypeId === CustomerTypeEnum.CORPORATE) {
                    this.isCorperateCustomer = true;
                    this.isIndividualCustomer = false;
                    this.isOtherCustomer = false;
                    this.contactTabDisabled = true;
                    this.firstNameLabel = "Corporate Name";
                    this.dateOfBirthLabel = "Date Established"
                } else {
                    this.isOtherCustomer = true;
                    this.isIndividualCustomer = true;
                    this.isCorperateCustomer = false;
                    this.contactTabDisabled = false;
                    this.firstNameLabel = "First Name";
                    this.dateOfBirthLabel = "Date of Birth"
                }
                if (Number(this.customerSelection.maritalStatus) === 1) {
                    this.isMarriedOrSingle = false;
                } else {
                    this.isMarriedOrSingle = true;
                }
                if (this.customerSelection.gender === 'Male' || this.customerSelection.gender === 'M') {
                    this.isMaleOrFemale = false;
                } else {
                    this.isMaleOrFemale = true;
                }
                this.display = false;
                this.displayCustomerDetails = true;
                sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
                ////console.log('pre-startLoanApplication', JSON.stringify(this.customerSelection));
            }
        });
        this.loadingService.hide();
    }

    getSingleCustomerCompanyInfo(customerId) {
        ////console.log("customerId", customerId);
        this.customerService.getSingleCustomerCompanyInfo(customerId).subscribe((response) => {
            this.customerCompanyInfomation = response.result;
            this.customerId=customerId;
            this.editCompanyInformation();
        });
    }
    getSingleCustomerAddressInfo(customerId) {
        this.customerService.getSingleCustomerAddressInfo(customerId).subscribe((response) => {
            this.customerAddresses = response.result;
           // console.log('ADDRESS',this.customerAddresses );
        });
    }
    getSingleCustomerPhoneContactInfo(customerId) {
        this.customerService.getSingleCustomerPhoneContactInfo(customerId).subscribe((response) => {
            this.customerPhoneContact = response.result;
        });
    }
    getSingleCustomerBVNInfo(customerId) {
        this.customerService.getSingleCustomerBVNInfo(customerId).subscribe((response) => {
            this.customerBvn = response.result;
        });
    }
    getSingleCustomerIdentificationInfo(customerId) {
        this.customerService.getSingleCustomerIdentificationInfo(customerId).subscribe((response) => {
            this.customerIdentification = response.result;
        });
    }
    getSingleCustomerEmploymentHistoryInfo(customerId) {
        this.customerService.getSingleCustomerEmploymentHistoryInfo(customerId).subscribe((response) => {
            this.customerEmploymentHistory = response.result;
        });
    }
    getSingleCustomerBoardInfo(customerId) {
        this.customerService.getSingleCustomerBoardInfo(customerId).subscribe((response) => {
            this.customerCompanyDirectors = response.result;
        });
    }
    getSingleCustomerShareholderIndividual(customerId) {
        this.customerService.getSingleCustomerShareholderIndividual(customerId).subscribe((response) => {
            this.customerCompanyShareholderIndividual = response.result;
        });
    }
    getSingleCustomerShareholderCorporate(customerId) {
        this.customerService.getSingleCustomerShareholderCorporate(customerId).subscribe((response) => {
            this.customerCompanyShareholderCorporate = response.result;
        });
    }
    getCustomerShareholderUltimateBenefical(companyDirectorId) {
        this.customerService.getCustomerShareholderUltimateBenefical(companyDirectorId).subscribe((response) => {
            this.customerCompanyUltimateBeneficial = response.result;
        });
    }
    getSingleCustomerAccountSignatoryInfo(customerId) {
        this.customerService.getSingleCustomerAccountSignatoryInfo(customerId).subscribe((response) => {
            this.customerCompanyAccountSignatory = response.result;
        });
    }
    getSingleCustomerClientInfo(customerId) {
        this.customerService.getSingleCustomerClientInfo(customerId).subscribe((response) => {
            this.customerClient = response.result;
        });
    }
    getSingleCustomerSupplierInfo(customerId) {
        this.customerService.getSingleCustomerSupplierInfo(customerId).subscribe((response) => {
            this.customerSupplier = response.result;
            ////console.log("supplier", this.customerSupplier)
        });
    }
    getSingleCustomerChildrenInfo(customerId) {
        this.customerService.getSingleCustomerChildrenInfo(customerId).subscribe((response) => {
            this.customerAddedChildren = response.result;
        });
    }

    getSingleCustomerNextOfKin(customerId) {
        this.customerService.getSingleCustomerNextOfKin(customerId).subscribe((response) => {
            this.customerNextOfKin = response.result;
        });
    }
    
    getCustomerRelatedParty(customerId) {
       // console.log("customerId: ", customerId);
        this.customerService.getAllCustomerRelatedParty(customerId).subscribe((response) => {
            this.customerRelatedParties = response.result;
           // console.log("customerRelatedParties: ", this.customerRelatedParties);
        });
    }

   

    loadSingleCustomerInformation(customerId: Number) {
        this.loadingService.show();
        this.getSingleCustomerCompanyInfo(customerId);
        this.getSingleCustomerAddressInfo(customerId);
        this.getSingleCustomerPhoneContactInfo(customerId);
        this.getSingleCustomerBVNInfo(customerId);
        this.getSingleCustomerIdentificationInfo(customerId);
        this.getSingleCustomerEmploymentHistoryInfo(customerId);
        this.getSingleCustomerBoardInfo(customerId);
        this.getSingleCustomerShareholderIndividual(customerId);
        this.getSingleCustomerShareholderCorporate(customerId);
        this.getSingleCustomerAccountSignatoryInfo(customerId);
        this.getSingleCustomerClientInfo(customerId);
        this.getSingleCustomerSupplierInfo(customerId);
        this.getSingleCustomerChildrenInfo(customerId);
        this.getSingleCustomerNextOfKin(customerId);
        this.getCustomerRelatedParty(customerId);
     
        this.loadingService.hide();
    }
    getKYCDocumentType() {
        this.customerService.getKYCDocumentType().subscribe((response) => {
            this.uploadDocumentType = response.result;
        });
    }
    getSectors() {
        this.loanAppService.getSector().subscribe((response) => {
            this.sectors = response.result;
            ////console.log("My Sector", this.sectors);
        });
    }
    getSubSectorBySector(sectId) {
       if(this.subSectors != null && this.subSectors.length >0) this.filteredSubsector = this.subSectors.filter(x => x.sectorId == sectId);

    }
    getFilteredSubsector() {
        this.loanAppService.getSubSector().subscribe((response) => {
            this.subSectors = response.result;
        });
    }
    getAllOfficers() {
        this.loanAppService.getOfficers()
            .subscribe((res) => {
                this.officers = res.result;
            }, (err) => {
            })
    }
    getCompany(id) {
        let item = this.companies.find(x => x.CompanyId == id);
        if (item != undefined) { return item.Name; }
        return 'n/a';
    }

    getApprovalStatus(id) {
        return 'n/a';
    }

    getCustomerSensitivityLevel(id) {
        return this.customerService.getCustomerSensitivityLevel(id);
    }
    getCustomerType(id) {
        let item = this.customerTypes.find(x => x.customerTypeId == id);
        if (item != undefined) { return item.name; }
        return 'n/a';
    }
    getAllCustomerTypes(id) {
        let item = this.corporateCustomerType.find(x => x.corporateCustomerTypeId == id);
        if (item != undefined) { return item.corporateCustomerTypeName; }
        return 'n/a';
    }
    getListOfCustomerSensitivityLevel() {
        this.customerSensitivityLevelList = this.customerService.getCustomerSensitivityLevelList()
    }
    getListOfMaritalStatus() {
        this.maritalStatusList = this.customerService.getMaritalStatusList()
    }
    getListOfTitle() {
        this.titleList = this.customerService.getTitleList()
    }
    getListOfGender() {
        this.genderList = this.customerService.getGenderList()
    }
    getBranch(id) {
        let item = this.branches.find(x => x.branchId == id);
        if (item != undefined) { return item.branchName; }
        return 'n/a';
    }
    getStateLGAs(id): void {
        this.countryStateSrv.getLGAByState(id).subscribe((response) => {
            this.lgas = response.result;
            ////console.log('CITIES', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    getLGACities(id): void {
        this.countryStateSrv.getCityByLGA(id).subscribe((response) => {
            this.cities = response.result;
            ////console.log('CITIES', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    getCitieLgas(id): void {
        this.countryStateSrv.getCityByState(id).subscribe((response) => {
            this.cities = response.result;
            //console.log('CITIES', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
  
    getStates() {
        this.countryStateSrv.getStates()
            .subscribe((response) => {
                this.states = response.result;
            });
    }
    getCountries() {
        this.countryStateSrv.getAllCountries()
            .subscribe((response) => {
                this.countries = response.result;
            });
    }
    onChangeSelectedState(id) {
        this.getStateLGAs(id);
    }
    onChangeSelectedLGA(id) {
        this.getLGACities(id);
    }

    editCustomerGeneralInformation(customerSelection) {
        if (customerSelection != undefined) {
            const row = customerSelection;
            this.editCustomerForm = this.fb.group({
                customerId: [row.customerId, Validators.required],
                customerCode: [row.customerCode, Validators.required],
                branchId: [row.branchId, Validators.required],
                companyMainId: row.companyMainId,
                branchName: row.branchName,
                title: row.title,
                firstName: [row.firstName, Validators.required],
                middleName: row.middleName,
                customerTypeName: row.customerTypeName,
                customerName: row.customerName,
                searchItem: row.searchItem,
                lastName: row.lastName,
                gender: row.gender,
                dateOfBirth: [new Date(row.dateOfBirth), Validators.required],
                placeOfBirth: row.placeOfBirth,
                nationalityId: row.nationalityId,
                maritalStatus: row.maritalStatus,
                emailAddress: [row.emailAddress, Validators.compose([Validators.required, ValidationService.isEmail])],
                maidenName: row.maidenName,
                spouse: row.spouse,
                occupation: row.occupation,
                customerTypeId: [row.customerTypeId, Validators.required],
                relationshipOfficerId: [row.relationshipOfficerId, Validators.required],
                isPoliticallyExposed: row.isPoliticallyExposed,
                misCode: row.misCode,
                misStaff: row.misStaff,
                approvalStatus: row.approvalStatus,
                dateActedOn: row.dateActedOn,
                actedOnBy: row.actedOnBy,
                accountCreationComplete: row.accountCreationComplete,
                creationMailSent: row.creationMailSent,
                customerSensitivityLevelId: [row.customerSensitivityLevelId, Validators.required],
                subSectorId: [row.subSectorId, Validators.required],
                subSectorName: row.subSectorName,
                sectorId: row.sectorId,
                sectorName: row.sectorName,
                taxNumber: [row.taxNumber],
                customerBVN: [row.customerBVN],
                riskRatingId: [row.riskRatingId],
                crmsLegalStatusId: [row.crmsLegalStatusId],
                crmsCompanySizeId: [row.crmsCompanySizeId],
                crmsRelationshipTypeId: [row.crmsRelationshipTypeId],
                canModified: [this.canModified],
                countryOfResidentId:[row.countryOfResidentId],
                numberOfDependents:[row.numberOfDependents],
                numberOfLoansTaken:[row.numberOfLoansTaken],
                loanMonthlyRepaymentFromOtherBanks:[row.loanMonthlyRepaymentFromOtherBanks],
                dateOfRelationshipWithBank:[row.dateOfRelationshipWithBank],
                relationshipTypeId:[row.relationshipTypeId],
                teamLDP:[row.teamLDP],
                teamNPL:[row.teamNPL],
                corr:[row.corr],
                pastDueObligations:[row.pastDueObligations],
                businessUnitId:[row.businessUnitId == 0 ? "" : row.businessUnitId, Validators.required],
                ownership:[row.ownership],
                nameOfSignatory: [row.nameofSignatories],
                addressOfSignatory: [row.addressofSignatories],
                phoneNumberOfSignatory: [row.phoneNumberofSignatories],
                emailOfSignatory: [row.emailofSignatories],
                bvnNumberOfSignatory: [row.bvnNumberofSignatories],
            });
        }
    }

    onSelectedCustomerDetailsChanged() {
        //  this.loadCustomerInformationForm();
        if(this.iblRequest && (this.iblEligibility == null || this.iblEligibility == undefined)){
            swal(`${GlobalConfig.APPLICATION_NAME}`, "Cannot proceed with IBL request without eligibility check. Kindly conduct eligibility check before proceeding", 'warning');
            return;
        }
        if(this.customerSelection.customerTypeId == 2 && this.customerSelection.accountCreationComplete == false)
            {
             swal(`${GlobalConfig.APPLICATION_NAME}`, "Customer profile not complete, Kindly Proceed to update customer information before proceeding", 'warning');
             }
        this.resetFlexCube();

        if (this.canModified == false) {
            if(this.customerSelection.accountCreationComplete == false)
            {
             swal(`${GlobalConfig.APPLICATION_NAME}`, "You have not Completed Profiling this Customer, Kindly Proceed to Start Application to Complete On-Boarding", 'warning');
             return;
             }
         }

        if (this.fromForwardPage) {
            this.editCustomerInfoByDefault = true;
            this.customerSelection.accountCreationComplete == true;
        }
        this.activeIndex = 0;
        this.canRefreshAccount = true;
        this.customerIdExist = true;
        this.resetTabs();
        this.customerId = this.customerSelection.customerId;
        //console.log("this.customerId >>>>>>>",this.customerId );
        this.ValidateCustomerModification(this.customerId);
        this.validateCustomerEligibility(this.customerSelection.customerCode);
        this.loadSingleCustomerInformation(this.customerId);
        this.customerCodetitle = this.customerSelection.customerCode;
        this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
        this.customerFullName = this.customerSelection.customerName;

        this.getAccountBalance(this.customerId);

        if (this.editCustomerInfoByDefault == false && this.customerSelection.accountCreationComplete == true) {
            this.customerInfoDetails.getSingleCustomerGeneralInfo(this.customerSelection.customerCode);
            this.customerInfoDetails.showProceedBackButton = true;
            this.displayCustomerInfoDetails = true;
            this.display = false;
        }
        else {
            this.editCustomerGeneralInformation(this.customerSelection);
            this.getSubSectorBySector(this.customerSelection.sectorId);
            this.ShowSaveButton = true;
            this.customerTypeChanged(this.selectedcustomerTypeId)

            if (Number(this.customerSelection.maritalStatus) === 1) {
                this.isMarriedOrSingle = false;
            } else {
                this.isMarriedOrSingle = true;
            }
            if (this.customerSelection.gender === 'Male' || this.customerSelection.gender === 'M') {
                this.isMaleOrFemale = false;
            } else {
                this.isMaleOrFemale = true;
            }
            this.getKYCDocumentUploads(this.customerId)
            //this.editCompanyInformation();
            this.display = false;
            this.displayCustomerDetails = true;
        }
        sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
        ////console.log('pre-startLoanApplication', JSON.stringify(this.customerSelection));

    }
    private resetFlexCube() {
        this.flexcube = null;
        this.flexcubeBVN = null;
        this.flexcubeMiddleName = null;
        this.flexcubeAddress = null;
        this.flexcubePhoneNumber = null;
        this.flexcubeTelephone = null;
        this.flexcubeTIN = null;
        //this.flexcubeEmailAddress = null;
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
    resetTabs() {
        this.contactTabDisabled = true;
        this.shareholderTabDisabled = true;
        //this.identificationTabDisabled = true;
        this.nextOfKinTabDisabled = true;
        this.employmentTabDisabled = true;
        this.directorTabDisabled = true;
        this.supplierTabDisabled = true;
        this.uploadTabDisabled = true;
        this.relatedPartyTabDisabled = true;
        this.ShowNextButton = false;
    }

    ///@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Temporarily enable tabs  
    handleChange(e) { //console.log('e',e);
        this.activeIndex = e.index;
        this.ShowSaveButton = false;
        this.ShowNextButton = false;
        this.showNextTabs = false;
        this.ShowSaveCompanyButton = false;
        if (this.activeIndex === 0) {
            this.ShowSaveButton = true;
        }
        // Individual Customer
        if (this.activeIndex === 1 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.employmentTabDisabled = false;
                this.showNextTabs = true;
            }
        }
        if (this.activeIndex === 2 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.nextOfKinTabDisabled = false;
                this.showNextTabs = true;
            }
        }

        if (this.activeIndex === 3 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            //if (this.customerEmploymentHistory.length > 0) {
            this.relatedPartyTabDisabled = false;
            this.showNextTabs = true;
            // }
        }
        if (this.activeIndex === 4 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.uploadTabDisabled = false;
        }
        if (this.activeIndex === 5 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            if (this.kycDocumentUploadList.length > 0) {
                if (this.showProceedButton == true) {
                    this.ShowNextButton = true;
                }
            }
        }

        

        //Corporate Customer
        if (this.activeIndex === 1 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            this.ShowSaveCompanyButton = true;
            if (this.customerCompanyInfomation != null) {
                this.contactTabDisabled = false;
            }
        }

        if (this.activeIndex === 2 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.directorTabDisabled = false;
                this.showNextTabs = true;
            }
        }
        if (this.activeIndex === 3 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            if (this.customerCompanyDirectors != undefined) {
                if (this.customerCompanyDirectors.length > 0) {
                    this.supplierTabDisabled = false;
                    this.shareholderTabDisabled = false;
                    this.showNextTabs = true;
                }
            }
        }
        if (this.activeIndex === 4 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            if (this.customerSupplier != undefined) {
                if (this.customerSupplier.length > 0) {
                    this.shareholderTabDisabled = false;
                    this.showNextTabs = true;
                }
            }
        }
        if (this.activeIndex === 5 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            this.showNextTabs = true;
             if (this.customerCompanyShareholderCorporate != undefined) {
                 if (this.customerCompanyShareholderCorporate.length > 0) {
                     this.relatedPartyTabDisabled = false;
                 }
             }
             else if(this.customerCompanyShareholderIndividual != undefined) {
                if (this.customerCompanyShareholderIndividual.length > 0) {
                    this.relatedPartyTabDisabled = false;
                }
             }
        }
        if (this.activeIndex === 6 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            this.uploadTabDisabled = false;
        }
        if (this.activeIndex === 7 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            if (this.kycDocumentUploadList.length > 0) {
                if (this.showProceedButton == true) {
                    this.ShowNextButton = true;
                }
            }
        }
    }
    hideMessage(event) {
        this.show = false;
    }

    next() {
        this.ShowSaveButton = false;
        this.ShowNextButton = false;
        this.ShowSaveCompanyButton = false;
        this.activeIndex + 1;
        if (this.activeIndex === 0) {
            this.ShowSaveButton = true;
        }
        // Individual Customer
        if (this.activeIndex === 1 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.employmentTabDisabled = false;
                this.activeIndex + 1;
            }
        }
        if (this.activeIndex === 2 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.nextOfKinTabDisabled = false;
                this.activeIndex + 1;
            }
        }

        if (this.activeIndex === 3 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            //if (this.customerEmploymentHistory.length > 0) {
            this.relatedPartyTabDisabled = false;
            this.activeIndex + 1;
            // }
        }
        if (this.activeIndex === 4 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            this.uploadTabDisabled = false;
            this.activeIndex + 1;
        }
        if (this.activeIndex === 5 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
            if (this.kycDocumentUploadList.length > 0) {
                if (this.showProceedButton == true) {
                    this.ShowNextButton = true;
                }
            }
        }

        //Corporate Customer
        if (this.activeIndex === 1 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            this.ShowSaveCompanyButton = true;
            if (this.customerCompanyInfomation != null) {
                this.contactTabDisabled = false;
                this.activeIndex + 1;
            }
        }

        if (this.activeIndex === 2 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            this.ShowSaveButton = false;
            if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
                this.directorTabDisabled = false;
                this.activeIndex + 1;
            }
        }
        if (this.activeIndex === 3 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            if (this.customerCompanyDirectors != undefined) {
                if (this.customerCompanyDirectors.length > 0) {
                    this.supplierTabDisabled = false;
                    this.shareholderTabDisabled = false;
                    this.activeIndex + 1;
                }
            }
        }
        if (this.activeIndex === 4 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
            if (this.customerSupplier != undefined) {
                if (this.customerSupplier.length > 0) {
                    this.shareholderTabDisabled = false;
                    this.activeIndex + 1;
                }
            }
        }
        if (this.activeIndex === 5 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            if (this.customerCompanyShareholderIndividual != undefined || this.customerCompanyShareholderCorporate != undefined) {
                if (this.customerCompanyShareholderIndividual.length > 0 || this.customerCompanyShareholderCorporate.length > 0) {
                    this.relatedPartyTabDisabled = false;
                    this.activeIndex + 1;
                }
            }
        }
        if (this.activeIndex === 6 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            this.uploadTabDisabled = false;
            this.activeIndex + 1;
        }
        if (this.activeIndex === 7 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
            if (this.kycDocumentUploadList.length > 0) {
                if (this.showProceedButton == true) {
                    this.ShowNextButton = true;
                }
            }
        }
        // this.activeIndex = (this.activeIndex === 7) ? 0 : this.activeIndex + 1;
    }

    prev() {
        this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
    }

    clientSupplierTypeId: number = 0;
    showAddNewSupplier() {
        this.PanelHeader = 'Add Customer Supplier Information';
        this.clientSupplierType = 'Supplier Type';
        this.clientSupplierTypeId = 2;
        this.LoadClientOrSupplierForm();
        this.individualClientSupplier = true;
        this.displaySupplier = true;
    }

    showAddNewClient() {
        this.PanelHeader = 'Add Customer Client Information';
        this.clientSupplierType = 'Client Type';
        this.clientSupplierTypeId = 1;
        this.LoadClientOrSupplierForm();
        this.individualClientSupplier = true;
        this.displaySupplier = true;
    }

    onClientSupplierTypeChanged(typeId) {
        ////console.log("client type", typeId);
        //const middleNameControl = this.customerClientOrSupplierForm.get('middleName');
        const lastNameControl = this.customerClientOrSupplierForm.get('lastName');
        const rcNumberControl = this.customerClientOrSupplierForm.get('rcNumber');
        const contactPersonControl = this.customerClientOrSupplierForm.get('contactPerson');
        const bankNameControl = this.customerClientOrSupplierForm.get('bankName');
        const casaAccountNumberControl = this.customerClientOrSupplierForm.get('casaAccountNumber');
        const taxNumberControl = this.customerClientOrSupplierForm.get('taxNumber');
        if (Number(typeId) === CustomerTypeEnum.INDIVIDUAL) {
            this.individualClientSupplier = true;
            this.corporateClientSupplier = false;
            lastNameControl.setValidators(Validators.required);
            // middleNameControl.setValidators(Validators.required);
            rcNumberControl.clearValidators();
            contactPersonControl.clearValidators();
            bankNameControl.clearValidators();
            casaAccountNumberControl.clearValidators();
            taxNumberControl.clearValidators();
        } else {
            this.individualClientSupplier = false;
            this.corporateClientSupplier = true;
            lastNameControl.clearValidators();
            //middleNameControl.clearValidators();
            bankNameControl.setValidators(Validators.required);
            casaAccountNumberControl.setValidators(Validators.required);
            rcNumberControl.setValidators(Validators.required);
            contactPersonControl.setValidators(Validators.required);
            taxNumberControl.setValidators(Validators.required);
        }
        //middleNameControl.updateValueAndValidity();
        lastNameControl.updateValueAndValidity();
        contactPersonControl.updateValueAndValidity();
        rcNumberControl.updateValueAndValidity();
        bankNameControl.updateValueAndValidity();
        casaAccountNumberControl.updateValueAndValidity();
        taxNumberControl.updateValueAndValidity();
    }
    LoadClientOrSupplierForm() {
        this.customerClientOrSupplierForm = this.fb.group({
            client_SupplierId: [0],
            customerId: [this.customerId],
            customerTypeId: ['', Validators.required],
            clientOrSupplierName: [''],
            rcNumber: [''],
            taxNumber: [''],
            contactPerson: [''],
            hasCASAAccount: [false],
            bankName: [''],
            casaAccountNumber: [''],
            firstName: ['', Validators.required],
            lastName: [''],
            middleName: [''],
            natureOfBusiness: [''],
            client_SupplierAddress: ['', Validators.required],
            client_SupplierPhoneNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            client_SupplierEmail: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            client_SupplierTypeId: [this.clientSupplierTypeId, Validators.required],
            client_SupplierTypeName: [''],
        });
    }

    editClient(index) {
        this.PanelHeader = 'Edit Coustomer Top Client Information';
        this.LoadClientOrSupplierForm();
        const clisup = this.customerClient[index];
        this.customerClientOrSupplierForm = this.fb.group({
            client_SupplierId: [clisup.client_SupplierId],
            customerId: [this.customerId],
            customerTypeId: [clisup.customerTypeId],
            clientOrSupplierName: [clisup.clientOrSupplierName],
            rcNumber: [clisup.rcNumber],
            taxNumber: [clisup.taxNumber],
            contactPerson: [clisup.contactPerson],
            hasCASAAccount: [clisup.hasCASAAccount],
            bankName: [clisup.bankName],
            casaAccountNumber: [clisup.casaAccountNumber],
            firstName: [clisup.firstName],
            lastName: [clisup.lastName],
            middleName: [clisup.middleName],
            natureOfBusiness: [clisup.natureOfBusiness],
            client_SupplierAddress: [clisup.client_SupplierAddress],
            client_SupplierPhoneNumber: [clisup.client_SupplierPhoneNumber, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
            client_SupplierEmail: [clisup.client_SupplierEmail, Validators.compose([Validators.required, ValidationService.isEmail])],
            client_SupplierTypeId: [clisup.client_SupplierTypeId],
            client_SupplierTypeName: [''],
        });
        this.onClientSupplierTypeChanged(clisup.customerTypeId)
        /*if (Number(clisup.customerTypeId) === 1) {
            this.individualClientSupplier = true;
            this.corporateClientSupplier = false;
        } else {
            this.individualClientSupplier = false;
            this.corporateClientSupplier = true;
        } */
        this.displaySupplier = true;
    }

    editSupplier(index) {
        this.PanelHeader = 'Edit Customer Top Supplier Information';
        this.LoadClientOrSupplierForm();
        const clisup = this.customerSupplier[index];
        this.customerClientOrSupplierForm = this.fb.group({
            client_SupplierId: [clisup.client_SupplierId],
            customerId: [this.customerId],
            customerTypeId: [clisup.customerTypeId],
            clientOrSupplierName: [],
            rcNumber: [clisup.rcNumber],
            taxNumber: [clisup.taxNumber],
            contactPerson: [clisup.contactPerson],
            hasCASAAccount: [clisup.hasCASAAccount],
            bankName: [clisup.bankName],
            casaAccountNumber: [clisup.casaAccountNumber],
            firstName: [clisup.firstName],
            lastName: [clisup.lastName],
            middleName: [clisup.middleName],
            natureOfBusiness: [clisup.natureOfBusiness],
            client_SupplierAddress: [clisup.client_SupplierAddress],
            client_SupplierPhoneNumber: [clisup.client_SupplierPhoneNumber],
            client_SupplierEmail: [clisup.client_SupplierEmail],
            client_SupplierTypeId: [clisup.client_SupplierTypeId],
            client_SupplierTypeName: [''],
        });
        this.onClientSupplierTypeChanged(clisup.customerTypeId)
        /*if (Number(clisup.customerTypeId) === 1) {
            this.individualClientSupplier = true;
            this.corporateClientSupplier = false;
        } else {
            this.individualClientSupplier = false;
            this.corporateClientSupplier = true;
        } */
        this.displaySupplier = true;
    }

    submitClientOrSupplier(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateClientOrSupplier(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerSupplierInfo(this.customerId);
                this.getSingleCustomerClientInfo(this.customerId);
                this.shareholderTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displaySupplier = false
            } else {
                this.displaySupplier = false
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displaySupplier = true
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displaySupplier = false
        });
    }

    closeEligiblity(){
        this.displayEligibilityModal = false;
        this.LoadEligibilitySearchForm();
        this.iblEligibility = null;
        this.isIBLEligible = false;
    }

    showAddNewIdentification() {
        this.PanelHeader = 'Add Identification Information';
        this.LoadIdentificationForm();
        this.displayIdentification = true;
    }

    LoadIdentificationForm() {
        this.customerIdentificationForm = this.fb.group({
            identificationId: [0, Validators.required],
            customerId: [this.customerId, Validators.required],
            identificationNo: ['', Validators.required],
            identificationModeId: ['', Validators.required],
            identificationMode: [''],
            issuePlace: [''],
            issueAuthority: [''],
        });
        ////console.log('id 2', this.customerId)
    }

    editIdentification(index) {
        this.PanelHeader = 'Edit Identification Information';
        this.LoadIdentificationForm();
        const identity = this.customerIdentification[index];
        this.customerIdentificationForm = this.fb.group({
            identificationId: [identity.identificationId],
            customerId: [this.customerId],
            identificationNo: [identity.identificationNo],
            identificationModeId: [identity.identificationModeId],
            identificationMode: [identity.identificationMode],
            issuePlace: [identity.issuePlace],
            issueAuthority: [identity.issueAuthority],
        });
        this.displayIdentification = true;
    }

    submitCustomerIdentification(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerIdentification(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerIdentificationInfo(this.customerId);
                this.employmentTabDisabled = false;
                if (this.customerSelection.customerTypeId == 4) {
                    this.nextOfKinTabDisabled = false;
                }
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayIdentification = true
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayIdentification = false
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayIdentification = false
        });
    }

    activeCountry: boolean;
    onCountryChange() {
        const employeeStateIdControl = this.editCustomerForm.get('employerStateId');
        const employeeStateControl = this.editCustomerForm.get('employerState');

        let countryId = this.customerEmploymentHistoryForm.value.employerCountryId
        if (countryId == this.loginCountryId) {
            this.activeCountry=true;
            employeeStateIdControl.clearValidators();
            employeeStateControl.setValidators(Validators.required);

        }
        else{
            this.activeCountry=false;
            employeeStateControl.clearValidators();
            employeeStateIdControl.setValidators(Validators.required);
        }
        employeeStateControl.updateValueAndValidity();
        employeeStateIdControl.updateValueAndValidity();

    }

    onEmploymentCountryChange() {
        const employeeStateIdControl = this.customerEmploymentHistoryForm.get('employerStateId');
        const employeeStateControl = this.customerEmploymentHistoryForm.get('employerState');

        let countryId = this.customerEmploymentHistoryForm.value.employerCountryId
        if (countryId == this.loginCountryId) {
            this.activeCountry=true;
            employeeStateIdControl.setValidators(Validators.required);
            employeeStateControl.clearValidators();

        }
        else{
            this.activeCountry=false;
            employeeStateControl.setValidators(Validators.required);
            employeeStateIdControl.clearValidators();
        }
        employeeStateControl.updateValueAndValidity();
        employeeStateIdControl.updateValueAndValidity();
    }

    showAddNewEmploymentHistory() {
        this.PanelHeader = 'Add Employment History Information';
        this.employerName = null;
        this.LoadEmploymentHistoryForm();
        this.displayEmploymentHistory = true;
    }

    LoadEmploymentHistoryForm() {
        this.customerEmploymentHistoryForm = this.fb.group({
            placeOfWorkId: [0],
            employerName: ['', Validators.required],
            employerAddress: ['',Validators.required],
            employerStateId: ['', Validators.required],
            employerCountryId: ['', Validators.required],
            officePhone: ['', [ Validators.minLength(11), Validators.maxLength(20), Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            employDate: ['', Validators.required],
            previousEmployer: ['', Validators.required],
            customerId: [this.customerId, Validators.required],
            active: [''],
            employerState:['',],
            yearOfEmployment:[''],
            totalWorkingExperience:[''],
            yearsOfCurrentEmployment:[''],
            terminalBenefits:[''],
            annualIncome:[''],
            monthlyIncome:[''],
            expenditure:[''],
            approvedEmployerId: [''],
            isEmployerRelated: [''],
        });
    }

    editEmploymentHistory(index, isEmployerRelated = null) {
        this.PanelHeader = 'Edit Employment History';
        this.LoadEmploymentHistoryForm();
        const empHis = this.customerEmploymentHistory[index];
        this.employerName = empHis.employerName;

        this.isEmploymentHistoryEdit = true;
        this.selectedEmploymentHistoryIndex = index;
        
       console.log('empHis', empHis);
        this.customerEmploymentHistoryForm = this.fb.group({
            placeOfWorkId: [empHis.placeOfWorkId, Validators.required],
            employerName: [empHis.employerName, Validators.required],
            employerAddress: [empHis.employerAddress, Validators.required],
            employerCountryId: [empHis.employerCountryId, Validators.required],
            officePhone: [empHis.officePhone, [Validators.minLength(9),Validators.maxLength(20) ,Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            employDate: [new Date(empHis.employDate), Validators.required],
            previousEmployer: [empHis.previousEmployer, Validators.required],
            customerId: [this.customerId, Validators.required],
            active: [empHis.active],
            yearOfEmployment:[empHis.yearOfEmployment],
            totalWorkingExperience:[empHis.totalWorkingExperience],
            yearsOfCurrentEmployment:[empHis.yearsOfCurrentEmployment],
            terminalBenefits:[empHis.terminalBenefits],
            annualIncome:[empHis.annualIncome],
            monthlyIncome:[empHis.monthlyIncome],
            expenditure:[empHis.expenditure],
            employerState:[empHis.employerState, ],
            employerStateId: [empHis.employerStateId,],
            approvedEmployerId: [empHis.approvedEmployerId],
            isEmployerRelated: [''],
        });

        // reset isEmployerRelated appropriately
        //console.log("isEmployerRelated: ", isEmployerRelated);
        if (isEmployerRelated == null) {
            this.customerEmploymentHistoryForm.controls['isEmployerRelated'].setValue(empHis.isEmployerRelated);
        }
        else {
            this.customerEmploymentHistoryForm.controls['isEmployerRelated'].setValue(isEmployerRelated);
        }
        ////////////////////////////////////

        this.displayEmploymentHistory = true;

        if(this.employerName === 'Self Employed') {
            this.selfEmployedCheck = true;
            this.onSelfEmployedChecked(this.selfEmployedCheck);
        }
        else {
            this.selfEmployedCheck = false;
            this.onOtherEmployerChecked(true);
        }

        const employerStateControl = this.customerEmploymentHistoryForm.get('employerState');
        const employerStateIdControl = this.customerEmploymentHistoryForm.get('employerStateId');
        if(empHis.employerState != null || empHis.employerState != undefined)
        {
            employerStateControl.setValidators(Validators.required);
        }
        else if(empHis.employerStateId != null || empHis.employerStateId != undefined)
        {
            employerStateIdControl.setValidators(Validators.required);
        }

        employerStateControl.updateValueAndValidity();
        employerStateIdControl.updateValueAndValidity();
        
    }

    submitCustomerEmploymentHistory(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerEmploymentHistory(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerEmploymentHistoryInfo(this.customerId);
                this.uploadTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayEmploymentHistory = false
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayEmploymentHistory = true
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayEmploymentHistory = false
        });
    }

    showAddNewNextOfKin() {
        this.loadNextOfKin();
        this.cities =[];
        this.lgas=[];
        this.PanelHeader = 'New Customer Next of Kin';
        this.displayNextOfKin = true;
    }

    loadNextOfKin() {
        this.customerNextOfKinForm = this.fb.group({
            nextOfKinId: [0],
            customerId: [this.customerId, Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', [ Validators.minLength(11), Validators.maxLength(12), Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            dateOfBirth: ['', Validators.required],
            gender: ['', Validators.required],
            relationship: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            address: ['', Validators.required],
            nearestLandmark: ['', Validators.required],
            stateId: ['', Validators.required],
            localGovernmentId: ['', Validators.required],
            cityId: ['', Validators.required],
            active: [false],
        });
    }

    editNextOfKin(index) {
        this.PanelHeader = 'Edit Customer Next of Kin';
        const row = index; //this.customerNextOfKin[index];
        this.cities =[];
        this.lgas=[];
        this.onChangeSelectedState(row.stateId);
        this.countryStateSrv.getLgaCity(row.cityId).subscribe((response) => {
            this.lga = response.result;
            this.onChangeSelectedLGA(this.lga);
        ////console.log('ROW >>>>>>>>>>>>>>>>', row);
        this.customerNextOfKinForm = this.fb.group({
            nextOfKinId: [row.nextOfKinId, Validators.required],
            customerId: [row.customerId, Validators.required],
            firstName: [row.firstName, Validators.required],
            lastName: [row.lastName, Validators.required],
            phoneNumber: [row.phoneNumber, [Validators.minLength(9),Validators.maxLength(12) ,Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            dateOfBirth: [new Date(row.dateOfBirth), Validators.required],
            gender: [row.gender, Validators.required],
            relationship: [row.relationship, Validators.required],
            email: [row.email, Validators.compose([Validators.required, ValidationService.isEmail])],
            address: [row.address, Validators.required],
            nearestLandmark: [row.nearestLandmark, Validators.required],
            stateId: [row.stateId, Validators.required],
            localGovernmentId: [this.lga, Validators.required],
            cityId: [row.cityId, Validators.required],
            active: [row.active],
        });
    }, (err) => {
        this.loadingService.hide(1000);
    });      
        this.displayNextOfKin = true;
    }

    editAddresses2(index) {
        this.PanelHeader = 'Edit Customer Address';
        this.cities =[];
        this.lgas=[];
        this.LoadAddressesForm();
        const address = this.customerAddresses[index];
        this.onChangeSelectedState(address.stateId);

        //this.getCitieLgas(address.stateId);

        this.countryStateSrv.getLgaCity(address.cityId).subscribe((response) => {
            this.lga = response.result;
            this.onChangeSelectedLGA(this.lga);
            this.customerAddressesForm = this.fb.group({
                addressId: [address.addressId],
                customerId: [this.customerId],
                address: [address.address],
                stateId: [address.stateId],
                localGovernmentId: [this.lga],
                cityId: [address.cityId],
                homeTown: [address.homeTown],
                nearestLandmark: [address.nearestLandmark],
                electricMeterNumber: [address.electricMeterNumber],
                pobox: [address.pobox],
                addressTypeId: [address.addressTypeId],
                active: [address.active],
            });
        }, (err) => {
            this.loadingService.hide(1000);
        });        

        
       
        this.displayAddresses = true;
    }

    submitCustomerNextOfKin(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerNextOfKin(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerNextOfKin(this.customerId);
                this.uploadTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayNextOfKin = false
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayNextOfKin = true
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayNextOfKin = false
        });
    }
    companyDirectorType: number;
    showAddNewCompanyDirectors() {
        this.PanelHeader = 'Add Company Directors Information';
        this.companyDirectorType = 1;
        this.LoadCompanyDirectorsForm();
        this.displayCompanyDirectors = true;
    }

    showAddNewCompanyAccountSignatory() {
        this.PanelHeader = 'Add Company Account Signatory Information';
        this.companyDirectorType = 4;
        this.LoadCompanyDirectorsForm();
        this.displayCompanyDirectors = true;
    }

    LoadCompanyDirectorsForm() {
        this.customerCompanyDirectorsForm = this.fb.group({
            companyDirectorId: [0, Validators.required],
            customerId: [this.customerId, Validators.required],
            customerName: [''],
            surname: ['', Validators.required],
            firstname: ['', Validators.required],
            middlename: [''],
            bankVerificationNumber: ['', [ Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
           //customerNIN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
           customerNIN: ['', Validators.required],
            companyDirectorTypeId: [this.companyDirectorType, Validators.required],
            companyDirectorTypeName: [''],
            numberOfShares: [0],
            isPoliticallyExposed: [false],
            address: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9), Validators.maxLength(12)]],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            dateOfBirth:['',Validators.required],
            gender:['',Validators.required],
            // maritalStatus:['',Validators.required]
            isThePromoter: [false]
        });
    }

    viewDirectorRelatedCustomer(row) {
        this.directorBVN = row.bankVerificationNumber;
        this.showDirectorRelatedCustomer = true;
    }

    closeDirectorRelatedCustomer(evt) {
        ////console.log('E no dey fire', evt);
        this.directorBVN = evt;
        this.showDirectorRelatedCustomer = false;
    }

    editDirectorInformation(index) {
        this.PanelHeader = 'Edit Directors Information';
        this.LoadEmploymentHistoryForm();
        const directors = this.customerCompanyDirectors[index];
        this.customerCompanyDirectorsForm = this.fb.group({
            companyDirectorId: [directors.companyDirectorId],
            customerId: [this.customerId, Validators.required],
            customerName: [directors.customerName],
            surname: [directors.surname, Validators.required],
            firstname: [directors.firstname, Validators.required],
            middlename: [directors.middlename],
            bankVerificationNumber: [directors.bankVerificationNumber, [Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            //customerNIN: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            customerNIN: ['', Validators.required],
            companyDirectorTypeId: [directors.companyDirectorTypeId],
            companyDirectorTypeName: [directors.companyDirectorTypeName],
            numberOfShares: [0],
            isPoliticallyExposed: [directors.isPoliticallyExposed],
            address: [directors.address, Validators.required],
            phoneNumber: [directors.phoneNumber, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(9),Validators.maxLength(12)]],
            email: [directors.email, Validators.compose([Validators.required, ValidationService.isEmail])],
            dateOfBirth:[new Date(directors.dateOfBirth), Validators.required],
            gender:[directors.gender,Validators.required],
            //maritalStatus:[directors.dateOfBirth,Validators.required]
            isThePromoter: [directors.isThePromoter]
        });
        this.displayCompanyDirectors = true;
    }

    editAccountSignatoryInformation(index) {
        this.PanelHeader = 'Edit Account Signatory Information';
        this.LoadEmploymentHistoryForm();
        const directors = this.customerCompanyAccountSignatory[index];
        this.customerCompanyDirectorsForm = this.fb.group({
            companyDirectorId: [directors.companyDirectorId],
            customerId: [this.customerId],
            customerName: [directors.customerName],
            surname: [directors.surname, Validators.required],
            firstname: [directors.firstname, Validators.required],
            middlename: [directors.middlename],
            bankVerificationNumber: [directors.bankVerificationNumber, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            customerNIN: [directors.customerNIN, Validators.required],
            companyDirectorTypeId: [directors.companyDirectorTypeId],
            companyDirectorTypeName: [directors.companyDirectorTypeName],
            numberOfShares: [directors.numberOfShares],
            isPoliticallyExposed: [directors.isPoliticallyExposed],
            address: [directors.address],
            phoneNumber: [directors.phoneNumber, [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(9),Validators.maxLength(12)]],
            email: [directors.email, Validators.compose([Validators.required, ValidationService.isEmail])],
            dateOfBirth:[new Date(directors.dateOfBirth), Validators.required],
            gender:[directors.gender,Validators.required],
            //maritalStatus:[directors.dateOfBirth,Validators.required]
            isThePromoter: [directors.isThePromoter]
        });
        this.displayCompanyDirectors = true;
    }

    submitDirectorInformation(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateDirectorInformation(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerBoardInfo(this.customerId);
                this.getSingleCustomerAccountSignatoryInfo(this.customerId);
                this.supplierTabDisabled = false;
                this.shareholderTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayCompanyDirectors = false;
                //this.displayCompanyShareholder = true;
            } else {
                // this.displayCompanyDirectors = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayCompanyDirectors = true;
                //   this.displayCompanyShareholder = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayCompanyDirectors = false
        });
    }

    onShareholderTypeChanged(typeId) {
        const surnameControl = this.customerCompanyShareholderForm.get('surname');
        const rcNumberControl = this.customerCompanyShareholderForm.get('rcNumber');
        const bvnControl = this.customerCompanyShareholderForm.get('bankVerificationNumber');
        const NINControl = this.customerCompanyShareholderForm.get('customerNIN');

        //const middlenameControl = this.customerCompanyShareholderForm.get('middlename');
        const taxNumberControl = this.customerCompanyShareholderForm.get('taxNumber');
        if (Number(typeId) === 1) {
            this.ultimateBeneficiary = false;
            this.individualShareholder = true;
            this.corporateShareholder = false;
            surnameControl.setValidators(Validators.required);
            bvnControl.setValidators([Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
            // NINControl.setValidators([Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
           // middlenameControl.setValidators(Validators.required);
            rcNumberControl.clearValidators();
            taxNumberControl.clearValidators();
            surnameControl.updateValueAndValidity();
            rcNumberControl.updateValueAndValidity();
            taxNumberControl.updateValueAndValidity();
            bvnControl.updateValueAndValidity();
            //NINControl.updateValueAndValidity();
           // middlenameControl.updateValueAndValidity();
        } else {
            this.ultimateBeneficiary = true;
            this.individualShareholder = false;
            this.corporateShareholder = true;
            rcNumberControl.setValidators(Validators.required);
            surnameControl.clearValidators();
            //bvnControl.clearValidators();
            //NINControl.clearValidators();
            //middlenameControl.clearValidators();
            taxNumberControl.setValidators(Validators.required);
            surnameControl.updateValueAndValidity();
            rcNumberControl.updateValueAndValidity();
            taxNumberControl.updateValueAndValidity();
        }
        //surnameControl.updateValueAndValidity();
        // bvnControl.updateValueAndValidity();
        // NINControl.updateValueAndValidity();
        // middlenameControl.updateValueAndValidity();

       // rcNumberControl.updateValueAndValidity();

       // taxNumberControl.updateValueAndValidity();
    }

    showAddNewCompanyShareholder() {
        this.PanelHeader = 'Add Company Shareholder Information';
        this.LoadCompanyShareholderForm();
        this.companyDirectorType = 2;
        this.individualShareholder = true;
        this.ultimateBeneficiary = false;
        this.corporateShareholder = false;
        this.displayCompanyShareholder = true;
        this.editShareholder = null;
    }

    LoadCompanyShareholderForm() {
        this.customerCompanyShareholderForm = this.fb.group({
            customerTypeId: ['', Validators.required],
            companyDirectorId: [0],
            customerId: [this.customerId, Validators.required],
            customerName: [''],
            rcNumber: [''],
            taxNumber: [''],
            surname: ['', Validators.required],
            firstname: ['', Validators.required],
            middlename: [''],
            bankVerificationNumber: ['', [Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],// [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
            customerNIN: [''],
            companyDirectorTypeId: [2],
            companyDirectorTypeName: [''],
            numberOfShares: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
            isPoliticallyExposed: [false],
            address: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(9),Validators.maxLength(12)]],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],

        });
    }

    editShareholderInformation(index) {
        this.editShareholder = 1;
        this.PanelHeader = 'Edit Individual Shareholder Information';
        this.LoadEmploymentHistoryForm();
        const shareholder = this.customerCompanyShareholderIndividual[index];
        this.customerCompanyShareholderForm = this.fb.group({
            customerTypeId: [shareholder.customerTypeId],
            companyDirectorId: [shareholder.companyDirectorId],
            customerId: [this.customerId],
            customerName: [shareholder.customerName],
            rcNumber: [shareholder.rcNumber],
            taxNumber: [shareholder.taxNumber],
            surname: [shareholder.surname, Validators.required],
            firstname: [shareholder.firstname, Validators.required],
            middlename: [shareholder.middlename],
            bankVerificationNumber: [shareholder.bankVerificationNumber, [ Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            customerNIN: [shareholder.customerNIN],
            companyDirectorTypeId: [shareholder.companyDirectorTypeId],
            companyDirectorTypeName: [shareholder.companyDirectorTypeName],
            numberOfShares: [shareholder.numberOfShares],
            isPoliticallyExposed: [shareholder.isPoliticallyExposed],
            address: [shareholder.address, Validators.required],
            phoneNumber: [shareholder.phoneNumber, [Validators.required, Validators.minLength(9), Validators.maxLength(12)]],
            email: [shareholder.email, Validators.compose([Validators.required, ValidationService.isEmail])],
        });
        this.onShareholderTypeChanged(shareholder.customerTypeId);
        /*     if (Number(shareholder.customerTypeId) === 1) {
                 this.ultimateBeneficiary = false;
                 this.individualShareholder = true;
                 this.corporateShareholder = false;
             } else {
                 this.ultimateBeneficiary = true;
                 this.individualShareholder = false;
                 this.corporateShareholder = true;
             } */
        this.displayCompanyShareholder = true;

    }

    editShareholderCorporate(index) {
        this.editShareholder = 1;
        this.PanelHeader = 'Edit Corporate Shareholder Information';
        this.LoadEmploymentHistoryForm();
        const shareholder = this.customerCompanyShareholderCorporate[index];
        this.customerCompanyShareholderForm = this.fb.group({
            customerTypeId: [shareholder.customerTypeId],
            companyDirectorId: [shareholder.companyDirectorId],
            customerId: [this.customerId],
            customerName: [shareholder.customerName],
            rcNumber: [shareholder.rcNumber],
            taxNumber: [shareholder.taxNumber],
            surname: [shareholder.surname, Validators.required],
            firstname: [shareholder.firstname, Validators.required],
            bankVerificationNumber: [shareholder.bankVerificationNumber, [Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            companyDirectorTypeId: [shareholder.companyDirectorTypeId],
            companyDirectorTypeName: [shareholder.companyDirectorTypeName],
            numberOfShares: [shareholder.numberOfShares],
            isPoliticallyExposed: [shareholder.isPoliticallyExposed],
            address: [shareholder.address, Validators.required],
            phoneNumber: [shareholder.phoneNumber, [Validators.required, Validators.minLength(9),Validators.maxLength(12)]],
            email: [shareholder.email, Validators.compose([Validators.required, ValidationService.isEmail])],
        });
        this.getCustomerShareholderUltimateBenefical(shareholder.companyDirectorId);
        this.ultimateBeneficialList = this.customerCompanyUltimateBeneficial;
        this.onShareholderTypeChanged(shareholder.customerTypeId);
        /*     if (Number(shareholder.customerTypeId) === 1) {
                 this.ultimateBeneficiary = false;
                 this.individualShareholder = true;
                 this.corporateShareholder = false;
             } else {
                 this.ultimateBeneficiary = true;
                 this.individualShareholder = false;
                 this.corporateShareholder = true;
             } */
        this.displayCompanyShareholder = true;
    }

    showAddUltimateBeneficiary() {
         const bvnControl = this.ultimateBeneficiaryForm.get('bankVerificationNumber');
         const NINControl = this.ultimateBeneficiaryForm.get('customerNIN');
         bvnControl.setValidators([Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
         NINControl.setValidators([Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
         bvnControl.updateValueAndValidity();
         NINControl.updateValueAndValidity();

         this.displayAddUltimateBeneficiary = true;
    }

    viewShareholderUltimateBeneficial(index) {
        const row = this.customerCompanyShareholderCorporate[index];
        let corporateId = row.companyDirectorId;
        this.corporateShareholderName = row.firstname;
        this.getCustomerShareholderUltimateBenefical(corporateId);
        this.displayViewUltimateBeneficial = true;
    }

    LoadUltimateBeneficiaryForm() {
        this.ultimateBeneficiaryForm = this.fb.group({
            companyBeneficialId: [0],
            companyDirectorId: [0],
            surname: ['', Validators.required],
            firstname: ['', Validators.required],
            middlename: [''],
            customerNIN: ['', Validators.required],
            bankVerificationNumber: ['', Validators.compose([Validators.required, ValidationService.isNumber, Validators.minLength(11), Validators.maxLength(11)])],
            numberOfShares: ['', Validators.required],
            isPoliticallyExposed: [false],
            address: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(12),ValidationService.isNumber]],
            email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
        });
    }

    LoadEligibilitySearchForm(){
        this.eligibilitySearchForm = this.fb.group({
            //operatingCasaAccountId: ['', Validators.required],
            accountNumber: ['',[Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(10), Validators.maxLength(10)]],
            phoneNumber: ['',[Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]]
        });
    }

    eligibilitySearch(formObj){
        this.loadingService.show();
        this.isIBLEligible = false;
        let bodyObj = {
            accountNumber: formObj.value.accountNumber,
            phoneNumber: formObj.value.phoneNumber,
            customerId: this.customerId,
            isIblRequest: true
            
        }
        this.customerService.eligibilitySearch(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.getCustomerIBLEligibility(this.customerId);
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
           
        });
    }

    getCustomerIBLEligibility(customerId) {
        this.customerService.getCustomerIBLEligibility(customerId).subscribe((response) => {
            this.iblEligibility = response.result;
            
            if( this.iblEligibility[0].isEligible == true){
                this.isIBLEligible = true;
                this.iblAmount = this.iblEligibility[0].amount;
                this.iblMinimumAmount = this.iblEligibility[0].minimumAmount
                this.iblEligibilityId = this.iblEligibility[0].eliigibilityId
            }
        });
    }

   
    submitShareHolderInformation(formObj) {
        if (formObj.value.customerTypeId == CustomerTypeEnum.CORPORATE && this.ultimateBeneficialList.length == 0) {
            //  this.displayCompanyShareholder = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please Add Ultimate Beneficials to Continue', 'info');
            //  this.displayCompanyShareholder = true;
            return;
        }
        let bodyObj = {
            customerTypeId: formObj.value.customerTypeId,
            customerId: this.customerId,
            companyDirectorId: formObj.value.companyDirectorId,
            rcNumber: formObj.value.rcNumber,
            taxNumber: formObj.value.taxNumber,
            surname: formObj.value.surname,
            firstname: formObj.value.firstname,
            middlename: formObj.value.middlename,
            bankVerificationNumber: formObj.value.bankVerificationNumber,
            customerNIN: formObj.value.customerNIN,
            companyDirectorTypeId: formObj.value.companyDirectorTypeId,
            numberOfShares: formObj.value.numberOfShares,
            isPoliticallyExposed: formObj.value.isPoliticallyExposed,
            address: formObj.value.address,
            phoneNumber: formObj.value.phoneNumber,
            email: formObj.value.email,
            customerCompanyBeneficial: this.ultimateBeneficialList
        }
        ////console.log("Save thing", bodyObj);
        this.loadingService.show();
        this.customerService.saveAndUpdateDirectorInformation(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerShareholderIndividual(this.customerId);
                this.getSingleCustomerShareholderCorporate(this.customerId);
                this.relatedPartyTabDisabled = false;
                this.uploadTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayCompanyShareholder = false;
            } else {
                // this.displayCompanyShareholder = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayCompanyShareholder = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayCompanyShareholder = false
        });
    }

    removeBeneficalFromlist(evt, index) {
        evt.preventDefault();
        this.ultimateBeneficialList.splice(index, 1);
    }

    removeUltimateBeneficial(index) {
        let row = index;
        ////console.log('Raw Data', row);
        const rowId = row.companyBeneficiaryId
        const __this = this;
        swal({
            title: 'Are you sure you want to delete this record?',
            text: 'You won\'t be able revert removal!',
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
            __this.customerService.deleteUltimateBeneficial(rowId).subscribe((response) => {
                __this.loadingService.hide();
                if (response.success == true) {
                    // __this.displayViewUltimateBeneficial = false;
                    __this.getCustomerShareholderUltimateBenefical(row.companyDirectorId);
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                return;
            }
        });
    }

    addToUltimateBeneficiary(formObj) {
        let bodyObj = formObj.value;
        if (this.ultimateBeneficialList === undefined) {
            this.ultimateBeneficialList = [];
        }
        this.ultimateBeneficialList.push(bodyObj);
        this.LoadUltimateBeneficiaryForm();
        ////console.log("Ultimate Beneficials", this.ultimateBeneficialList)
    }

    showAddNewBVN() {
        this.PanelHeader = 'Add BVN Information';
        this.LoadBVNForm();
        this.displayBVN = true;
    }

    LoadBVNForm() {
        this.customerBvnForm = this.fb.group({
            customerBvnid: [0, Validators.required],
            customerId: [this.customerId, Validators.required],
            surname: ['', Validators.required],
            firstname: ['', Validators.required],
            bankVerificationNumber: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            isValidBvn: [''],
            isPoliticallyExposed: [''],
        });
    }

    editBVN(index) {
        this.PanelHeader = 'Edit BVN Information';
        this.LoadIdentificationForm();
        const bvn = this.customerBvn[index];
        this.customerBvnForm = this.fb.group({
            customerBvnid: [bvn.customerBvnid],
            customerId: [this.customerId],
            surname: [bvn.surname],
            firstname: [bvn.firstname],
            bankVerificationNumber: [bvn.bankVerificationNumber, [Validators.pattern(/^[0-9\s]*$/), Validators.minLength(11), Validators.maxLength(11)]],
            isValidBvn: [bvn.isValidBvn],
            isPoliticallyExposed: [bvn.isPoliticallyExposed],
        });
        this.displayBVN = true;
    }
    submitCustomerBVN(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerBVN(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerBVNInfo(this.customerId);
                //  this.identificationTabDisabled = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayBVN = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayBVN = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayBVN = false
        });
    }

    showAddNewAddresses() {
        this.PanelHeader = 'Add Customer Address';
        this.cities = [];
        this.lgas = [];
        this.LoadAddressesForm();
        this.displayAddresses = true;
        const addressTypeControl = this.customerAddressesForm.get('addressTypeId');
        if(this.flexcube != null) {
            //console.log('Flexcube_Address', this.flexcubeAddress);
            this.customerAddressesForm.get('address').setValue(this.flexcubeAddress);
        }
        if (this.customerSelection.customerTypeId == 1) {
            addressTypeControl.setValidators(Validators.required);
        } else {
            addressTypeControl.clearValidators();
        }
        addressTypeControl.updateValueAndValidity();
    }

    LoadAddressesForm() {
        this.customerAddressesForm = this.fb.group({
            addressId: [0, Validators.required],
            customerId: [this.customerId, Validators.required],
            address: ['', Validators.required],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            localGovernmentId: ['', Validators.required],
            homeTown: [''],
            nearestLandmark: ['', Validators.required],
            electricMeterNumber: ['', Validators.required],
            pobox: ['', Validators.required],
            addressTypeId: [''],
            active: [false],
        });
    }

    lga: number;
    editAddresses(index) {
        this.PanelHeader = 'Edit Customer Address';
        this.cities =[];
        this.lgas=[];
        this.LoadAddressesForm();
        const address = this.customerAddresses[index];
        this.onChangeSelectedState(address.stateId);

        //this.getCitieLgas(address.stateId);

        this.countryStateSrv.getLgaCity(address.cityId).subscribe((response) => {
            this.lga = response.result;
            this.onChangeSelectedLGA(this.lga);
            this.customerAddressesForm = this.fb.group({
                addressId: [address.addressId],
                customerId: [this.customerId],
                address: [address.address],
                stateId: [address.stateId],
                localGovernmentId: [this.lga],
                cityId: [address.cityId],
                homeTown: [address.homeTown],
                nearestLandmark: [address.nearestLandmark],
                electricMeterNumber: [address.electricMeterNumber],
                pobox: [address.pobox],
                addressTypeId: [address.addressTypeId],
                active: [address.active],
            });
        }, (err) => {
            this.loadingService.hide(1000);
        });        

        
       
        this.displayAddresses = true;
    }

    searchEligibility(row) {
        
        this.PanelHeader = 'Eligibility Search';
        this.displayEligibilityModal = true;
        this.customerId = row.customerId;
        this.customerSelection = row;
        this.customerSelection.accountCreationComplete = row.accountCreationComplete;
        this.getAllCustomerAccount(this.customerId);
        this.getAllCustomerPhone(this.customerId);
    }

    getAllCustomerAccount(customerId) {
        this.loadingService.show();
        this.casaService.getAllCustomerAccountByCustomerId(customerId)
            .subscribe((response) => {
                this.customerAccount = response.result;
                this.loadingService.hide();
                if (this.customerAccount.length <= 0) {
                    const operatingAccountId = this.eligibilitySearchForm.controls['operatingCasaAccountId'];
                    operatingAccountId.clearValidators();
                    operatingAccountId.updateValueAndValidity();
                }
            });
    }

    getAllCustomerPhone(customerId) {
        this.loadingService.show();
        this.customerService.getSingleCustomerPhoneContactInfo(customerId)
            .subscribe((response) => {
                this.customerPhone = response.result;
                this.loadingService.hide();
               
            });
    }


    submitCustomerAddresses(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerAddress(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerAddressInfo(this.customerId);
                this.directorTabDisabled = false;
                if (this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
                    this.employmentTabDisabled = false;
                }
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.flexcubeAddress = null;
                this.displayAddresses = false
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayAddresses = true;
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayAddresses = false
        });
    }

    showAddNewAPhoneContact() {
        this.PanelHeader = 'Add Customer Phone Contact';
        this.LoadPhoneContactForm();
        if(this.flexcube != null) {
            this.customerPhoneContactForm.get('phone').setValue(this.flexcubeTelephone);
            this.customerPhoneContactForm.get('phoneNumber').setValue(this.flexcubePhoneNumber);
        }
        this.displayPhoneContact = true;
    }

    LoadPhoneContactForm() {
        this.customerPhoneContactForm = this.fb.group({
            phoneContactId: [0, Validators.required],
            phone: ['', [Validators.minLength(11),Validators.maxLength(20) ,Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            phoneNumber: ['', [ Validators.minLength(11), Validators.maxLength(12), Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            customerId: [this.customerId, Validators.required],
            active: [''],
        });
    }

    editPhoneContact(index) {
        this.PanelHeader = 'Edit Customer Phone Contact';
        this.LoadPhoneContactForm();
        const phone = this.customerPhoneContact[index];
        this.customerPhoneContactForm = this.fb.group({
            phoneContactId: [phone.phoneContactId, Validators.required],
            phone: [phone.phone, [Validators.minLength(11),Validators.maxLength(20),Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            phoneNumber: [phone.phoneNumber, [Validators.minLength(11),Validators.maxLength(12),Validators.pattern(/^[0-9\s]*$/), Validators.required]],
            customerId: [this.customerId, Validators.required],
            active: [phone.active],
        });
        this.displayPhoneContact = true;
    }

    submitCustomerPhoneContact(formObj) {
        const bodyObj = formObj.value;
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerPhoneContact(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerPhoneContactInfo(this.customerId);
                this.directorTabDisabled = false;
                if (this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
                    this.employmentTabDisabled = false;
                }
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.flexcubeTelephone = null;
                this.flexcubePhoneNumber = null;
                this.displayPhoneContact = false
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                this.displayPhoneContact = true
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.displayPhoneContact = false
        });
    }

    submitCustomerChildren() {
        if (this.customerNewChildren.length == 0) {
            swal('FinTrak Credit 360', "Please Add Child(ren) to continue ", "warning");
            return;
        }
        let bodyObj = [];
        this.customerNewChildren.forEach(child => {
            bodyObj.push({
                customerId: this.customerId,
                customerChildrenId: child.customerChildrenId,
                childName: child.childName,
                childDateOfBirth: child.childBirthDate
            });
        });
        ////console.log(bodyObj);
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerChildren(bodyObj).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.hasChildren = true;
                this.customerChildren = [];
                this.customerNewChildren = [];
                this.getSingleCustomerChildrenInfo(this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.displayAddChildren = false;
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }
    loadCompanyInformation() {
        this.companyInfomationForm = this.fb.group(
            {
                companyInfomationId: [0],
                customerId: [this.customerId],
                registrationNumber: ['', Validators.required],
                companyWebsite: [''],
                companyEmail: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
                registeredOffice: ['', Validators.required],
                annualTurnOver: ['', Validators.required],
                corporateBusinessCategory: [''],
                paidUpCapital: ['', Validators.required],
                authorizedCapital: ['', Validators.required],
                shareholderFund: ['', Validators.required],
                companyName: ['', Validators.required],
                canModified: [this.canModified],
                companyStructure:[''],
                countryOfParentCompanyId:[''],
                numberOfEmployees:['', Validators.required],
                noOfFemaleEmployees:['', Validators.required],
                isStartUp:[false, Validators.required],
                isFirstTimeCredit:[false, Validators.required],
                totalAssets:['', Validators.required],
                corporateCustomerTypeId:['', Validators.required],
            });
    }


    
    validateValue(value) {
        if(value < 1){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Sorry minimum value allowed is 1', 'error');
            this.companyInfomationForm.get('numberOfEmployees').setValue("");
        }
    }

    validateValue2(value) {
        if(value < 1){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Sorry minimum value allowed is 1', 'error');
            this.companyInfomationForm.get('noOfFemaleEmployees').setValue("");
        }
    }

    editCompanyInformation() {
        // this.getSingleCustomerCompanyInfo(this.customerId);
        if (this.customerSelection != null) this.companyInfomationForm.get('companyName').setValue(this.customerSelection.customerName);
        //this.companyInfomationForm.get('companyId').setValue(this.customerSelection.companyId);
        //sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
        // this.selectedCustomer = JSON.parse(sessionStorage.getItem('pre-startLoanApplication'));
        // this.customerId = this.selectedCustomer.customerId;
        ////console.log("this.customerIdnnew", this.customerId);

        const custCompany = this.customerCompanyInfomation != undefined ? this.customerCompanyInfomation : []; //this.customerSelection.customerCompanyInfomation[0] || new ICustomerCompanyInfomation;
        ////console.log("this is scatter", custCompany);
        this.companyInfomationForm = this.fb.group(
            {
                companyInfomationId: [custCompany.companyInfomationId],
                customerId: [this.customerId, Validators.required],
                registrationNumber: [custCompany.registrationNumber, Validators.required],
                companyWebsite: [custCompany.companyWebsite,],
                companyEmail: [custCompany.companyEmail, Validators.compose([Validators.required, ValidationService.isEmail])],
                registeredOffice: [custCompany.registeredOffice, Validators.required],
                annualTurnOver: [custCompany.annualTurnOver, Validators.required],
                corporateBusinessCategory: [custCompany.corporateBusinessCategory],
                paidUpCapital: [ConvertString.ToNumberFormate(custCompany.paidUpCapital), Validators.required],
                authorizedCapital: [ConvertString.ToNumberFormate(custCompany.authorizedCapital), Validators.required],
                shareholderFund: [ConvertString.ToNumberFormate(custCompany.shareholderFund), Validators.required],
                companyName: [this.customerFullName, Validators.required],
                canModified: [this.canModified],
                companyStructure:[custCompany.companyStructure],
                countryOfParentCompanyId:[custCompany.countryOfParentCompanyId],
                numberOfEmployees:[custCompany.numberOfEmployees, Validators.required],
                noOfFemaleEmployees:[custCompany.noOfFemaleEmployees, Validators.required],
                isStartUp:[custCompany.isStartUp, Validators.required],
                isFirstTimeCredit:[custCompany.isFirstTimeCredit, Validators.required],
                totalAssets:[custCompany.totalAssets, Validators.required],
                corporateCustomerTypeId:[custCompany.corporateCustomerTypeId, Validators.required],
            });
            ////console.log("this.companyInfomationForm", JSON.stringify(this.companyInfomationForm));

    }
    submitCustomerCompanyInformation(formObj) {
        let bodyObj = formObj.value;
        this.companyInfomationForm.get('customerId').setValue(this.customerSelection.customerId);
        this.customerId = this.customerSelection.customerId;
let body = {
    annualTurnOver:bodyObj.annualTurnOver,
    authorizedCapital:bodyObj.authorizedCapital,
    canModified:bodyObj.canModified,
    companyEmail:bodyObj.companyEmail,
    companyInfomationId:bodyObj.companyInfomationId,
    companyName:bodyObj.companyName,
    companyWebsite:bodyObj.companyWebsite,
    corporateBusinessCategory:bodyObj.corporateBusinessCategory,
    customerId:this.customerId ,
    paidUpCapital:bodyObj.paidUpCapital,
    registeredOffice:bodyObj.registeredOffice,
    registrationNumber:bodyObj.registrationNumber,
    shareholderFund:bodyObj.shareholderFund,
    numberOfEmployees:bodyObj.numberOfEmployees,
    countryOfParentCompany:bodyObj.countryOfParentCompany,
    companyStructure:bodyObj.companyStructure,
    noOfFemaleEmployees:bodyObj.noOfFemaleEmployees,
    isStartUp:bodyObj.isStartUp,
    isFirstTimeCredit:bodyObj.isFirstTimeCredit,
    totalAssets:bodyObj.totalAssets,
    corporateCustomerTypeId:bodyObj.corporateCustomerTypeId
}
        ////console.log(body);
        this.loadingService.show();
        this.customerService.saveAndUpdateCustomerCompanyInfo(body).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getSingleCustomerCompanyInfo(this.customerId);
                this.contactTabDisabled = false;
                this.activeIndex + 1;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    showNextTab(){
       
        this.activeIndex = (this.activeIndex === 9) ? 0 : this.activeIndex + 1;
        this.handleChange(this.activeIndex);
            }

    submitNewCustomerDetails(formObj) {
        //console.log("new customer-detials", formObj);
        const bodyObj = formObj.value;
        //if(this.isPoliticallyExposed ==  true) { formObj.value.customerCode = true; }

        this.loadingService.show();
        if (this.customerId === null) {  
            this.customerService.save(bodyObj).subscribe((response) => {
                this.loadingService.hide();
                if (response.success === true) {
                    this.customerSelection = null;
                    this.customerIdExist = true;

                    //this.fetchAccountBalances(response.result);
                    //this.activeIndex  = this.activeIndex + 1;
                    if (this.isProspect == true) { 
                        this.getSingleCustomerGeneralInfo(response.result);
                    } else {
                        this.getSingleCustomerGeneralInfo(formObj.value.customerCode);
                    }
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                    // this.displayCustomerDetails = false
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                this.displayCustomerDetails = false
            });
        } else { 
            this.customerService.update(bodyObj, this.customerId).subscribe((response) => {
                this.loadingService.hide();
                if (response.success === true) { ; 
                    this.contactTabDisabled = false;
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


    getKYCDocumentUploads(customerId) {
        this.loadingService.show();
        this.customerService.getKYCDocumentUploads(customerId).subscribe((response) => {
            this.kycDocumentUploadList = response.result;
            this.loadingService.hide();
        });
    }

    viewDocument(id: number) {
        let doc = this.kycDocumentUploadList.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayUpload = true;
        }
        ////console.log("binary file..", this.binaryFile);
    }
    DownloadDocument(id: number) {
        const fileDocument = this.kycDocumentUploadList.find(x => x.documentId === id);

        if (fileDocument != null) {
            this.binaryFile = fileDocument.fileData;
            this.selectedDocument = fileDocument.documentTitle;
            let myDocExtention = fileDocument.fileExtension;
            var byteString = atob(this.binaryFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);

            if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                }
            }
            if (myDocExtention == 'png' || myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                }
            }
            if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                }
            }
            if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                }
            }
            if (myDocExtention == 'doc' || myDocExtention == 'docx') {

                try {
                    var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                }
            }
        }
    }



    // file upload

    uploadFileTitle: string = null;
    physicalFileNumber: string = null;
    physicalLocation: string = null;
    documentTypeId: number = null;
    iblRequest: boolean = false;
    files: FileList;
    file: File;
    @ViewChild('fileInput', {static: false}) fileInput: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                customerId: this.customerId,
                customerCode: this.customerCodetitle,
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: this.physicalFileNumber,
                physicalLocation: this.physicalLocation,
                documentTypeId: this.documentTypeId, // TODO: redundant with fileExtension known
            };
            this.loadingService.show();
            this.customerService.uploadFile(this.file, body).then((val: any) => {
                // this.updateCustomerInformationCompletion(this.customerId);
                this.uploadFileTitle = null;
                this.documentTypeId = null;
                this.fileInput.nativeElement.value = "";
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, "Upload complete", 'success');
                
                this.loadingService.hide();
                this.displayMandatesUpload = false;
              
                if (this.showProceedButton == true) {
                    this.ShowNextButton = true;
                }
                this.getKYCDocumentUploads(this.customerId);
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
            });
        }
    }
    updateCustomerInformationCompletion(customerId) {
        const __this = this;
        swal({
            title: 'Are you sure you want to proceed to Credit Bureau?',
            text: 'You won\'t be able to make changes on customer information!',
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
            __this.customerService.updateCustomerInformationCompletion(customerId).subscribe((response) => {
                __this.loadingService.hide();
                if (response.success == true) {
                    __this.getSingleCustomerGeneralInfo(__this.customerCodetitle);
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                return;
            }
        });
    }

    proceedToApplication(x) {
        this.displayEligibilityModal = false
        if (this.customerSelection.accountCreationComplete != true) {
            this.updateCustomerInformationCompletion(this.customerId);
        } else {
            this.displayCustomerDetails = false;
            this.proceedEvent.emit({ continue: 'true', customerId: this.customerId});
            //console.log(this.isIBLEligible, this.iblRequest, this.iblAmount, this.iblMinimumAmount);
        }
    }

    IBLproceedToApplication(x) {
        this.displayEligibilityModal = false
        sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
        //sessionStorage.setItem('ibl-eligibility',JSON.stringify(this.iblEligibility));
            this.displayCustomerDetails = false;
            this.proceedEvent.emit({ continue: 'true', customerId: this.customerId, isIBLEligible: this.isIBLEligible, isIblRequest: this.iblRequest, iblAmount: this.iblAmount, iblMinimumAmount: this.iblMinimumAmount});
            console.log(this.isIBLEligible, this.iblRequest, this.iblAmount, this.iblMinimumAmount);

    }

    closeSupplierModal() {
        this.corporateClientSupplier = false;
        this.displaySupplier = false;
    }
    closeShareholderModal() {
        this.corporateShareholder = false;
        this.displayCompanyShareholder = false;
    }
    closeAddChildrenModal() {
        this.customerChildren = [];
        this.displayAddChildren = false
    }
    closeModal() {
        this.displayCustomerInfoDetails = false;
        this.displayCustomerDetails = false;
        this.customerSelection = null;
        this.display = true;
        this.hideCustomerInfo.emit("closed");
    }
    select(item) {
        this.customerEmploymentHistoryForm.get('employerName').setValue(item); //= item;
        this.filteredEmployer = [];
    }
    filterEmployerSingle(event) {
        // let query = this.customerEmploymentHistoryForm.get('employerName').value;
        let query = event.query;
        this.genSetupServ.getEmployersList().subscribe((employers) => {
            this.filteredEmployer = this.filterEmployer(query, employers);
            // this.filteredEmployer = employers.filter(function (el) {
            //     return el.employerName.toLowerCase().indexOf(query.toLowerCase()) > -1;
            // }.bind(this));
        });
    }
    filterEmployer(query, employers: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < employers.length; i++) {
            let employer = employers[i];
            if (employer.employerName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(employer);
            }
        }
        return filtered;
    }

    validateCustomerEligibility(customerCode) {
        if (customerCode != null || customerCode != "") {
            this.loadingService.show();
            this.customerService.getCustomerEligibility(customerCode).subscribe((response) => {
                this.loadingService.hide();
                if (response.result.eligible == false) {
                    let message = `You cannot continue with this process, Customer with code ${customerCode} ${response.result.message}`
                    swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
                    this.displayCustomerDetails = false;
                    this.displayCustomerInfoDetails = false;
                    this.display = true;
                    this.customerSelection = null;
                    return;
                }
            });
        }
    }

    ValidateToRestrictSavingsAccount(accountNumber) {
        this.loadingService.show();
        this.customerService.getCustomerAccountType(accountNumber).subscribe((response) => {
            if (response.success == true) {
                this.customerAccountNumber = null;
                let data = response.result;
               // console.log('data',data);
                let productName = data.substr(0, 2)

                if (productName == "SA") {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, "You cannot create customer with savings account", 'warning');
                    this.displayCustomerDetails = false;
                    this.display = true;
                }
            }
            this.loadingService.hide();
        });
    }

    ValidateNewCustomer(customerCode) {
        this.loadingService.show();
        this.customerService.ValidateNewCustomer(customerCode).subscribe((response) => {
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                this.displayCustomerDetails = false;
                this.display = true;
            }
            this.loadingService.hide();
        });
    }
    ValidateCustomerModification(customerId) {
        this.loadingService.show();
        this.customerService.ValidateCustomerModification(customerId).subscribe((response) => {
            this.loadingService.hide();
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
                this.displayCustomerDetails = false;
                this.displayCustomerInfoDetails = false;
                this.customerSelection = null;
                this.display = true;
                return;
            }
        });
    }
    employerlist: any[];
    loadEmployer() {
        this.genSetupServ.getEmployersList().subscribe((employers) => {
            this.employerlist = employers.result;
        });
    }
    colseSearchModal() {
        this.displaySearchModal = false;
        this.display = true;
        this.displayCustomerDetails = false;
    }
    isBankCustomerChanged(event) {
        let defaultBank = 'Bank Customer';
        let bankNameControl = this.customerClientOrSupplierForm.get('bankName')
        if (event) {
            bankNameControl.clearValidators();
            bankNameControl.disable();
            bankNameControl.setValue(defaultBank);
        } else {
            bankNameControl.setValue("")
            bankNameControl.enable();
        }
        bankNameControl.updateValueAndValidity();
    }
    loadCustomerRelatedParty() {
        this.customerRelatedPartyForm = this.fb.group({
            relatedPartyId: [0],
            companyDirectorId: [''],
            customerId: [''],
            relationshipType: ['', Validators.required],
        });
    }
    showAddNewRelatedParty() {
        this.loadCustomerRelatedParty();
        this.relatedPartyHeader = "Add New Customer Related Party";
        this.displayRelatedPartyForm = true;
    }
    editRelatedParty(index) {
        this.loadCustomerRelatedParty()
        this.relatedPartyHeader = "Edit Customer Related Party";
        const row = index;
        this.customerRelatedPartyForm = this.fb.group({
            relatedPartyId: [row.relatedPartyId],
            companyDirectorId: [row.companyDirectorId, Validators.required],
            customerId: [row.customerId],
            relationshipType: [row.relationshipType, Validators.required],
        });
        this.displayRelatedPartyForm = true;

    }

    deleteRelatedParty(row){

        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
            
            
        __this.customerService.deleteRelatedParty(row.relatedPartyId).subscribe((response) => {
            if (response.success == true)
            {
                __this.getCustomerRelatedParty(__this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } 
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    deleteAddresses(row){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
            
            
        __this.customerService.deleteAddresses(row.addressId).subscribe((response) => {
            if (response.success == true)
            {
                __this.getSingleCustomerAddressInfo(__this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } 
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });


    }


    deleteContact(row){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
            
            
        __this.customerService.deleteContact(row.phoneContactId).subscribe((response) => {
            if (response.success == true)
            {
                __this.getSingleCustomerPhoneContactInfo(__this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } 
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });


    }

    deleteEmploymentHistory(row){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
                
        __this.customerService.deleteEmploymentHistory(row.placeOfWorkId).subscribe((response) => {
            if (response.success == true)
            {
                __this.getSingleCustomerEmploymentHistoryInfo(__this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } 
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });


    }
   
     

    submitcustomerRelatedParty(formObj) {
        let bodyObj = formObj.value;

        let body = {
            relatedPartyId: bodyObj.relatedPartyId,
            companyDirectorId: bodyObj.companyDirectorId,
            customerId: this.customerId,
            relationshipType: bodyObj.relationshipType
        }
        //console.log("=========================="+ JSON.stringify(body));
        this.loadingService.show();
        this.customerService.addUpdateCustomerRelatedParty(body).subscribe((response) => {
            this.loadingService.hide();
            if (response.success === true) {
                this.getCustomerRelatedParty(this.customerId);
                this.relatedPartyTabDisabled = false;
                this.displayRelatedPartyForm = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }
    onOtherEmployerChecked(event) {
        //const employerAddressControl = this.customerEmploymentHistoryForm.get('employerAddress');
        const employerNameControl = this.customerEmploymentHistoryForm.get('employerName');
        if (event == true) {
            if(this.employerName === 'Self Employed') {
                this.customerEmploymentHistoryForm.get('employerName').setValue('');
            }
            else {
                this.customerEmploymentHistoryForm.get('employerName').setValue(this.employerName);
            }
            this.otherEmployer = true;
            this.selfEmployed = false;
            //employerAddressControl.setValidators(Validators.required);
            employerNameControl.setValidators(Validators.required);
        } else {
            this.customerEmploymentHistoryForm.get('employerName').setValue('');
            this.otherEmployer = false;
        }
        //employerAddressControl.updateValueAndValidity();
        employerNameControl.updateValueAndValidity();
    }

    onSelfEmployedChecked(event) {

        //const employerAddressControl = this.customerEmploymentHistoryForm.get('employerAddress');
        const employerNameControl = this.customerEmploymentHistoryForm.get('employerName');
        if (event == true) {
            this.selfEmployed = true;
            this.otherEmployer = false;
            //employerAddressControl.clearValidators();
            employerNameControl.clearValidators();
            this.customerEmploymentHistoryForm.get('employerName').setValue('Self Employed');

        } else {
            this.customerEmploymentHistoryForm.get('employerName').setValue('');
            this.selfEmployed = false;
        }

        //employerAddressControl.updateValueAndValidity();
        employerNameControl.updateValueAndValidity();
    }

    fetchAccountBalances(customerCode) {  
        this.customerService.getCustomerCASAInformationByCode(customerCode).subscribe((response) => {
            // console.log('response.result',response.result);
            this.accountBalances = response.result;
        });
       this.displayAccountBalance = true;
    }



    fetchAndAddCustomerAccounts() {
        
        if(this.customerId == null)
        {
            const message: string = 'Error, Customer does not yet exist on the System';
            swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
            return;
        }
        this.loadingService.show();
        this.customerService.fetchAndAddCustomerAccounts(this.customerId).subscribe((response) => {
            if(response.success) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
            this.loadingService.hide();
        });
    }

    customerAccountBalances: any;
    getAccountBalance(customerId) {
        this.customerService.getCustomerCASAInformation(customerId).subscribe((response) => {
            this.accountBalances = response.result;
            //console.log('this.accountBalances 1',this.accountBalances )
        });
        // let list: any = [
        //     { 'AccountNumber': '34343434343', 'AccountBalance': '20000000' },
        //     { 'AccountNumber': '34343434222', 'AccountBalance': '45000000' },
        //     { 'AccountNumber': '34343112222', 'AccountBalance': '64555000' },
        //     { 'AccountNumber': '32223434222', 'AccountBalance': '39900000' },
        // ];
        // return list;
    }

    getProfileBusinessUnits(){
        this.genSetupServ.getProfileBusinessUnits().subscribe((response) => {
            this.businessUnit = response.result;
        });
    }

    revalidatePoliticalStatus(customerCode: string) {
        //console.log("customerCode: ", customerCode);
        this.customerService.getPoliticalExposedStatus(customerCode).subscribe((response) => {
            this.isPoliticallyExposed = response.result;
        });
    }

    getButtonLabel() {
        if (this.customerSelection.accountCreationComplete != true) {
            return 'Complete Customer Profiling';
        } 
        return 'Upload Credit Bureau Report'; // this.authorizeActionLabel;
    }

    deleteNextOfKin(row){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
                
        __this.customerService.deleteNextOfKin(row.nextOfKinId).subscribe((response) => {
            if (response.success == true)
            {
                __this.getSingleCustomerNextOfKin(__this.customerId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            } 
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });

    }

    updateCustomerInformation() {
        this.customerService.updateCustomerInformation(this.customerSelection.customerCode, this.customerSelection.customerAccountNo).subscribe((response) => {
            let result = response.result;

            if (response.success == true)
            {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

}