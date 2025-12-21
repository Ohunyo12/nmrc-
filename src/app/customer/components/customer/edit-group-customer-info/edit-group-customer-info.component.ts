import { saveAs } from 'file-saver';
import { CustomerInformationDetailComponent } from '../customer-information-detail/customer-information-detail.component';
import { LoanApplicationService } from '../../../../credit/services/loan-application.service';
import { GlobalConfig, CustomerTypeEnum, IntegratedCustomerTypeEnum } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { GeneralSetupService } from '../../../../setup/services';
import { CompanyService } from '../../../../setup/services/company.service';
import {
  ICustomerCompanyDirectors, ICustomerInfo} from '../../../models/CustomerInfo';
import { Subject } from 'rxjs';
import { BranchService } from '../../../../setup/services/branch.service';
import { CustomerService } from '../../../services/customer.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-edit-group-customer-info',
  templateUrl: './edit-group-customer-info.component.html',
})
export class EditGroupCustomerInfoComponent implements OnInit {
  customerRelatedParties: any[];
  displayRelatedPartyForm: boolean = false;
  customerRelatedPartyForm: FormGroup;
  relatedPartyHeader: string;
  companyDirectors: any[];

  displayCustomerInfoDetails: boolean = false;
  phoneNumber: string = "Phone Number"
  MobileNumber: string = "Mobile Number"
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
  cities: any[];
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
  subSectors: any[];
  customerCompanyInfomation: any;
  customerAddresses: any[];
  customerPhoneContact: any[];
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
  contactTabDisabled: boolean = true;
  shareholderTabDisabled: boolean = true;
  // identificationTabDisabled: boolean = true;
  nextOfKinTabDisabled: boolean = true;
  employmentTabDisabled: boolean = true;
  directorTabDisabled: boolean = true;
  supplierTabDisabled: boolean = true;
  uploadTabDisabled: boolean = true;
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
  @Input() displayEditInfo: boolean = false;
  @Input('searchQuery') searchQuery = new Subject<string>();
  @Output() proceedEvent = new EventEmitter();
  @Output() lookupEvent = new EventEmitter();
  @Output() customerModel = new EventEmitter();
  displaySearchModal: boolean = false;

  filteredEmployer: any[] = [];
  employerList: any[];
  stagingSearch: string;
  customerIdExist: boolean = true;
  customerCode: string;
  isProspectConversion: boolean = false;
  
  @ViewChild(CustomerInformationDetailComponent , {static: false}) customerInfoDetails: CustomerInformationDetailComponent;
  constructor(private loadingService: LoadingService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private loanAppService: LoanApplicationService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private countryStateSrv: CountryStateService,
    private genSetupServ: GeneralSetupService) {
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
    this.loadEmployer();
  }

  loadDropdowns() {
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
    this.customerService.getAllCustomerTypes().subscribe((response: any) => {
      this.customerTypes = response.result;
    });
    this.customerService.getCustomerAddressTypes().subscribe((response: any) => {
      this.customerAddressType = response.result;
    });
    this.customerService.getCustomerRiskRating().subscribe((response: any) => {
      this.riskRatings = response.result;
    });
    this.companyService.getCompanyDirectorsByCompanyId().subscribe((response: any) => {
      this.companyDirectors = response.result;
    });
  }
  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }
  searchStagingDB(searchString) {
    this.loadingService.show();
    this.searchStagingTerm$.next(searchString);
    this.loadingService.hide(400);
  }
  selectedSearchCustomer(selected) {
    this.validateCustomerEligibility(selected.customerCode);
    this.editCustomerForm.get('firstName').setValue(selected.firstName);
    this.editCustomerForm.get('middleName').setValue(selected.middleName);
    this.editCustomerForm.get('lastName').setValue(selected.lastName);
    this.editCustomerForm.get('customerCode').setValue(selected.customerCode);
    this.editCustomerForm.get('customerTypeId').setValue(selected.customerTypeId);
    if (selected.customerTypeId == IntegratedCustomerTypeEnum.CORPORATE) {
      this.customerTypeChanged(CustomerTypeEnum.CORPORATE);
    } else {
      this.customerTypeChanged(CustomerTypeEnum.INDIVIDUAL);
    }
    let kk = this.searchResults.filter(x => x.customerCode == selected.customerCode);
    ////console.log('search item picked', kk);
    this.displaySearchModal = false;
  }

  showAddNewMandate() {
    this.displayMandatesUpload = true;
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
    this.customerService.deleteChild(childId).subscribe((response: any) => {
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
    const middleNameControl = this.editCustomerForm.get('middleName');
    const lastNameControl = this.editCustomerForm.get('lastName');
    const genderControl = this.editCustomerForm.get('gender');
    const placeOfBirthControl = this.editCustomerForm.get('placeOfBirth');
    const nationalityControl = this.editCustomerForm.get('nationality');
    const maritalStatusControl = this.editCustomerForm.get('maritalStatus');
    const occupationControl = this.editCustomerForm.get('occupation');
    const subSectorIdControl = this.editCustomerForm.get('subSectorId');
    const sectorIdControl = this.editCustomerForm.get('sectorId');
    const taxNumberControl = this.editCustomerForm.get('taxNumber');
    if (type == CustomerTypeEnum.CORPORATE) {
      this.isCorperateCustomer = true;
      this.contactTabDisabled = true;
      this.ShowSaveButton = true;
      this.ShowSaveCompanyButton = false;
      this.firstNameLabel = "Corporate Name";
      this.dateOfBirthLabel = "Date of Incorporation";
      this.occupationLabel = "Line of Business";
      this.phoneNumber = "Office Land Number"
      this.MobileNumber = "Office Mobile Number"
      customerBVNControl.clearValidators();
      titleControl.clearValidators();
      middleNameControl.clearValidators();
      lastNameControl.clearValidators();
      genderControl.clearValidators();
      placeOfBirthControl.clearValidators();
      nationalityControl.clearValidators();
      maritalStatusControl.clearValidators();
      occupationControl.clearValidators();
      subSectorIdControl.setValidators(Validators.required);
      sectorIdControl.setValidators(Validators.required);
      taxNumberControl.setValidators(Validators.required);

    } else {
      this.isCorperateCustomer = false;
      this.isOtherCustomer = true;
      this.ShowSaveButton = true;
      this.ShowSaveCompanyButton = false;
      this.contactTabDisabled = false;
      this.firstNameLabel = "First Name";
      this.dateOfBirthLabel = "Date of Birth"
      this.occupationLabel = "Occupation"
      this.phoneNumber = "Home Phone Number"
      this.MobileNumber = "Mobile Number"
      customerBVNControl.setValidators([Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
      titleControl.setValidators(Validators.required);
      middleNameControl.setValidators(Validators.required);
      lastNameControl.setValidators(Validators.required);
      genderControl.setValidators(Validators.required);
      placeOfBirthControl.setValidators(Validators.required);
      nationalityControl.setValidators(Validators.required);
      maritalStatusControl.setValidators(Validators.required);
      occupationControl.setValidators(Validators.required);
      taxNumberControl.clearValidators();
    }
    customerBVNControl.updateValueAndValidity();
    titleControl.updateValueAndValidity();
    middleNameControl.updateValueAndValidity();
    lastNameControl.updateValueAndValidity();
    genderControl.updateValueAndValidity();
    placeOfBirthControl.updateValueAndValidity();
    nationalityControl.updateValueAndValidity();
    maritalStatusControl.updateValueAndValidity();
    occupationControl.updateValueAndValidity();
    subSectorIdControl.updateValueAndValidity();
    sectorIdControl.updateValueAndValidity();
    taxNumberControl.updateValueAndValidity();
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
    this.customerService.search(body).subscribe((response: any) => {
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
      phoneNumber: ['', Validators.compose([ValidationService.isNumber, Validators.minLength(8)])],
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
      customerCode: ['', Validators.required],
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
      nationality: [''],
      maritalStatus: [''],
      emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
      maidenName: [''],
      spouse: [''],
      firstChildName: [''],
      childDateOfBirth: [''],
      occupation: [''],
      customerTypeId: [''],
      relationshipOfficerId: ['', Validators.required],
      isPoliticallyExposed: [''],
      misCode: [''],
      misStaff: [''],
      approvalStatus: [''],
      dateActedOn: [''],
      actedOnBy: [''],
      accountCreationComplete: [''],
      creationMailSent: [''],
      customerSensitivityLevelId: [0],
      subSectorId: [''],
      subSectorName: [''],
      sectorId: [''],
      sectorName: [''],
      taxNumber: [''],
      customerBVN: ['',],// [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      riskRatingId: [''],
      canModified: [this.canModified]
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
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
    this.companyService.getAllCompanies().subscribe((response: any) => {
      this.companies = response.result;
    })
    this.customerService.getAllIdentificationModeTypes().subscribe((response: any) => {
      this.identificationModeTypes = response.result;
    });
    this.customerService.getAllSupplierTypes().subscribe((response: any) => {
      this.clientSuplierTypes = response.result;
    });
    this.customerService.getAlldirectorsTypes().subscribe((response: any) => {
      this.directorsTypes = response.result;
    });
    this.customerService.getCustomerAddressTypes().subscribe((response: any) => {
      this.customerAddressType = response.result;
    });
    this.customerService.getCustomerRiskRating().subscribe((response: any) => {
      this.riskRatings = response.result;
    });
  }


  getSingleCustomerGeneralInfo(customerCode) {
    this.loadingService.show();
    this.customerCompanyInfomation = null;
    this.customerService.getSingleCustomerGeneralInfo(customerCode).subscribe((response: any) => {
      this.customerSelection = response.result;
      ////console.log("General Info >>>>>>>>>HMMN", this.customerSelection);
      if (this.customerSelection != null || this.customerSelection != undefined && this.customerSelection.accountCreationComplete == true) {
        this.customerInfoDetails.getSingleCustomerGeneralInfo(this.customerSelection.customerCode);
        this.customerInfoDetails.showProceedBackButton = true;
        this.customerInfoDetails.showCreditBureauButton = false;
        this.customerInfoDetails.displayCustomerInfoDetails = true;
        this.customerId = this.customerSelection.customerId;
        this.displayCustomerInfoDetails = true;
        this.displayEditInfo = false;
      }
      else {
        this.companyInfomationForm.get('companyName').setValue(this.customerSelection.customerName);
        this.companyInfomationForm.get('customerId').setValue(this.customerSelection.customerId);
        this.customerId = this.customerSelection.customerId;
        this.customerCodetitle = this.customerSelection.customerCode;
        this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
        this.customerFullName = this.customerSelection.customerName;
        if (this.customerSelection != undefined) {
          this.ShowSaveButton = true;
          this.onEditDetailsLoading();
          if (this.selectedcustomerTypeId === CustomerTypeEnum.CORPORATE) {
            this.isCorperateCustomer = true;
            this.isOtherCustomer = false;
            this.contactTabDisabled = true;
            this.firstNameLabel = "Corporate Name";
            this.dateOfBirthLabel = "Date Established"
          } else {
            this.isOtherCustomer = true;
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
          if (this.customerSelection.gender === 'Male') {
            this.isMaleOrFemale = false;
          } else {
            this.isMaleOrFemale = true;
          }
        }
        this.displayEditInfo = true;
        sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
        ////console.log('pre-startLoanApplication', JSON.stringify(this.customerSelection));
      }
    });
    this.loadingService.hide();
  }

  getSingleCustomerCompanyInfo(customerId) {
    this.customerService.getSingleCustomerCompanyInfo(customerId).subscribe((response: any) => {
      this.customerCompanyInfomation = response.result;
      this.editCompanyInformation();
    });
  }
  getSingleCustomerAddressInfo(customerId) {
    this.customerService.getSingleCustomerAddressInfo(customerId).subscribe((response: any) => {
      this.customerAddresses = response.result;
    });
  }
  getSingleCustomerPhoneContactInfo(customerId) {
    this.customerService.getSingleCustomerPhoneContactInfo(customerId).subscribe((response: any) => {
      this.customerPhoneContact = response.result;
    });
  }
  getSingleCustomerBVNInfo(customerId) {
    this.customerService.getSingleCustomerBVNInfo(customerId).subscribe((response: any) => {
      this.customerBvn = response.result;
    });
  }
  getSingleCustomerIdentificationInfo(customerId) {
    this.customerService.getSingleCustomerIdentificationInfo(customerId).subscribe((response: any) => {
      this.customerIdentification = response.result;
    });
  }
  getSingleCustomerEmploymentHistoryInfo(customerId) {
    this.customerService.getSingleCustomerEmploymentHistoryInfo(customerId).subscribe((response: any) => {
      this.customerEmploymentHistory = response.result;
    });
  }
  getSingleCustomerBoardInfo(customerId) {
    this.customerService.getSingleCustomerBoardInfo(customerId).subscribe((response: any) => {
      this.customerCompanyDirectors = response.result;
    });
  }
  getSingleCustomerShareholderIndividual(customerId) {
    this.customerService.getSingleCustomerShareholderIndividual(customerId).subscribe((response: any) => {
      this.customerCompanyShareholderIndividual = response.result;
    });
  }
  getSingleCustomerShareholderCorporate(customerId) {
    this.customerService.getSingleCustomerShareholderCorporate(customerId).subscribe((response: any) => {
      this.customerCompanyShareholderCorporate = response.result;
    });
  }
  getCustomerShareholderUltimateBenefical(companyDirectorId) {
    this.customerService.getCustomerShareholderUltimateBenefical(companyDirectorId).subscribe((response: any) => {
      this.customerCompanyUltimateBeneficial = response.result;
    });
  }
  getSingleCustomerAccountSignatoryInfo(customerId) {
    this.customerService.getSingleCustomerAccountSignatoryInfo(customerId).subscribe((response: any) => {
      this.customerCompanyAccountSignatory = response.result;
    });
  }
  getSingleCustomerClientInfo(customerId) {
    this.customerService.getSingleCustomerClientInfo(customerId).subscribe((response: any) => {
      this.customerClient = response.result;
    });
  }
  getSingleCustomerSupplierInfo(customerId) {
    this.customerService.getSingleCustomerSupplierInfo(customerId).subscribe((response: any) => {
      this.customerSupplier = response.result;
      ////console.log("supplier", this.customerSupplier)
    });
  }
  getSingleCustomerChildrenInfo(customerId) {
    this.customerService.getSingleCustomerChildrenInfo(customerId).subscribe((response: any) => {
      this.customerAddedChildren = response.result;
    });
  }

  getSingleCustomerNextOfKin(customerId) {
    this.customerService.getSingleCustomerNextOfKin(customerId).subscribe((response: any) => {
      this.customerNextOfKin = response.result;
    });
  }

  getCustomerRelatedParty(customerId) {
    this.customerService.getAllCustomerRelatedParty(customerId).subscribe((response: any) => {
      this.customerRelatedParties = response.result;
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
    this.customerService.getKYCDocumentType().subscribe((response: any) => {
      this.uploadDocumentType = response.result;
    });
  }
  getSectors() {
    this.loanAppService.getSector().subscribe((response: any) => {
      this.sectors = response.result;
      ////console.log("My Sector", this.sectors);
    });
  }
  getSubSectorBySector(sectId) {
    this.filteredSubsector = this.subSectors.filter(x => x.sectorId == sectId);

  }
  getFilteredSubsector() {
    this.loanAppService.getSubSector().subscribe((response: any) => {
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
  getStateCities(id): void {
    this.countryStateSrv.getCityByState(id).subscribe((response: any) => {
      this.cities = response.result;
      ////console.log('CITIES', response.result);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getStates() {
    this.countryStateSrv.getStates()
      .subscribe((response: any) => {
        this.states = response.result;
      });
  }
  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response: any) => {
        this.countries = response.result;
      });
  }
  onChangeSelectedState(id) {
    this.getStateCities(id);
  }
  onEditDetailsLoading() {
    this.activeIndex = 0;
    this.resetTabs();
    //this.customerId = this.customerId;
    this.validateCustomerEligibility(this.customerCode);
    this.loadSingleCustomerInformation(this.customerId);
    this.customerCodetitle = this.customerSelection.customerCode;
    this.selectedcustomerTypeId = this.customerSelection.customerTypeId;
    this.customerFullName = this.customerSelection.customerName;
    this.editCustomerForm = this.fb.group({
      customerId: [this.customerSelection.customerId, Validators.required],
      customerCode: [this.customerSelection.customerCode, Validators.required],
      branchId: [this.customerSelection.branchId, Validators.required],
      companyMainId: this.customerSelection.companyMainId,
      branchName: this.customerSelection.branchName,
      title: this.customerSelection.title,
      firstName: [this.customerSelection.firstName, Validators.required],
      middleName: this.customerSelection.middleName,
      customerTypeName: this.customerSelection.customerTypeName,
      customerName: this.customerSelection.customerName,
      searchItem: this.customerSelection.searchItem,
      lastName: this.customerSelection.lastName,
      gender: this.customerSelection.gender,
      dateOfBirth: [new Date(this.customerSelection.dateOfBirth), Validators.required],
      placeOfBirth: this.customerSelection.placeOfBirth,
      nationality: this.customerSelection.nationality,
      maritalStatus: this.customerSelection.maritalStatus,
      emailAddress: [this.customerSelection.emailAddress, Validators.compose([Validators.required, ValidationService.isEmail])],
      maidenName: this.customerSelection.maidenName,
      spouse: this.customerSelection.spouse,
      occupation: this.customerSelection.occupation,
      customerTypeId: [this.customerSelection.customerTypeId, Validators.required],
      relationshipOfficerId: [this.customerSelection.relationshipOfficerId, Validators.required],
      isPoliticallyExposed: this.customerSelection.isPoliticallyExposed,
      misCode: this.customerSelection.misCode,
      misStaff: this.customerSelection.misStaff,
      approvalStatus: this.customerSelection.approvalStatus,
      dateActedOn: this.customerSelection.dateActedOn,
      actedOnBy: this.customerSelection.actedOnBy,
      accountCreationComplete: this.customerSelection.accountCreationComplete,
      creationMailSent: this.customerSelection.creationMailSent,
      customerSensitivityLevelId: [this.customerSelection.customerSensitivityLevelId, Validators.required],
      subSectorId: [this.customerSelection.subSectorId, Validators.required],
      subSectorName: this.customerSelection.subSectorName,
      sectorId: this.customerSelection.sectorId,
      sectorName: this.customerSelection.sectorName,
      taxNumber: [this.customerSelection.taxNumber, Validators.required],
      customerBVN: [this.customerSelection.customerBVN],
      riskRatingId: [this.customerSelection.riskRatingId]
    });

    this.ShowSaveButton = true;
    this.customerTypeChanged(this.selectedcustomerTypeId)

    if (Number(this.customerSelection.maritalStatus) === 1) {
      this.isMarriedOrSingle = false;
    } else {
      this.isMarriedOrSingle = true;
    }
    if (this.customerSelection.gender === 'Male') {
      this.isMaleOrFemale = false;
    } else {
      this.isMaleOrFemale = true;
    }
    this.getKYCDocumentUploads(this.customerId)
    this.editCompanyInformation();

    sessionStorage.setItem('pre-startLoanApplication', JSON.stringify(this.customerSelection));
    ////console.log('pre-startLoanApplication', JSON.stringify(this.customerSelection));
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
    this.ShowNextButton = false;
  }
  handleChange(e) {
    this.activeIndex = e.index;
    this.ShowSaveButton = false;
    this.ShowNextButton = false;
    this.ShowSaveCompanyButton = false;
    if (this.activeIndex === 0) {
      this.ShowSaveButton = true;
    }
    // Individual Customer
    if (this.activeIndex === 1 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
      this.ShowSaveButton = false;
      if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
        this.employmentTabDisabled = false;
      }
    }
    if (this.activeIndex === 2 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
      this.ShowSaveButton = false;
      if (this.customerAddresses.length > 0 && this.customerPhoneContact.length > 0) {
        this.nextOfKinTabDisabled = false;
      }
    }

    if (this.activeIndex === 3 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
      this.ShowSaveButton = false;
      //if (this.customerEmploymentHistory.length > 0) {
      this.uploadTabDisabled = false;
      // }
    }
    if (this.activeIndex === 4 && this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
      if (this.kycDocumentUploadList.length > 0) {
        this.ShowNextButton = true;
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
      }
    }
    if (this.activeIndex === 3 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
      if (this.customerCompanyDirectors != undefined) {
        if (this.customerCompanyDirectors.length > 0) {
          this.supplierTabDisabled = false;
        }
      }
    }
    if (this.activeIndex === 4 && this.customerSelection.customerTypeId === CustomerTypeEnum.CORPORATE) {
      if (this.customerSupplier != undefined) {
        if (this.customerSupplier.length > 0) {
          this.shareholderTabDisabled = false;
        }
      }
    }
    if (this.activeIndex === 5 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
      if (this.customerCompanyShareholderIndividual != undefined || this.customerCompanyShareholderCorporate != undefined) {
        if (this.customerCompanyShareholderIndividual.length > 0 || this.customerCompanyShareholderCorporate.length > 0) {
          this.uploadTabDisabled = false;
        }
      }
    }
    if (this.activeIndex === 6 && this.customerSelection.customerTypeId == CustomerTypeEnum.CORPORATE) {
      if (this.kycDocumentUploadList.length > 0) {
        this.ShowNextButton = true;
      }
    }
  }
  hideMessage(event) {
    this.show = false;
  }

  next() {
    this.activeIndex = (this.activeIndex === 7) ? 0 : this.activeIndex + 1;
  }

  prev() {
    this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
  }

  clientSupplierTypeId: number = 0;
  showAddNewSupplier() {
    this.PanelHeader = 'Add Cusotmer Supplier Information';
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
    const lastNameControl = this.customerClientOrSupplierForm.get('lastName');
    const rcNumberControl = this.customerClientOrSupplierForm.get('rcNumber');
    const contactPersonControl = this.customerClientOrSupplierForm.get('contactPerson');
    if (Number(typeId) === 1) {
      this.individualClientSupplier = true;
      this.corporateClientSupplier = false;
      lastNameControl.setValidators(Validators.required);
      rcNumberControl.clearValidators();
      contactPersonControl.clearValidators();
    } else {
      this.individualClientSupplier = false;
      this.corporateClientSupplier = true;
      lastNameControl.clearValidators();
      rcNumberControl.setValidators(Validators.required);
      contactPersonControl.setValidators(Validators.required);
    }
    lastNameControl.updateValueAndValidity();
    contactPersonControl.updateValueAndValidity();
    rcNumberControl.updateValueAndValidity();
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
      hasCASAAccount: [''],
      casaAccountNumber: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      natureOfBusiness: [''],
      client_SupplierAddress: ['', Validators.required],
      client_SupplierPhoneNumber: ['', [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
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
      casaAccountNumber: [clisup.casaAccountNumber],
      firstName: [clisup.firstName],
      lastName: [clisup.lastName],
      natureOfBusiness: [clisup.natureOfBusiness],
      client_SupplierAddress: [clisup.client_SupplierAddress],
      client_SupplierPhoneNumber: [clisup.client_SupplierPhoneNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
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
      casaAccountNumber: [clisup.casaAccountNumber],
      firstName: [clisup.firstName],
      lastName: [clisup.lastName],
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
    this.customerService.saveAndUpdateClientOrSupplier(bodyObj).subscribe((response: any) => {
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
    this.customerService.saveAndUpdateCustomerIdentification(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getSingleCustomerIdentificationInfo(this.customerId);
        this.employmentTabDisabled = false;
        if (this.customerSelection.customerTypeId == 4) {
          this.uploadTabDisabled = false;
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
  showAddNewEmploymentHistory() {
    this.PanelHeader = 'Add Employment History Information';
    this.LoadEmploymentHistoryForm();
    this.displayEmploymentHistory = true;
  }
  LoadEmploymentHistoryForm() {
    this.customerEmploymentHistoryForm = this.fb.group({
      placeOfWorkId: [0],
      employerName: ['', Validators.required],
      employerAddress: ['', Validators.required],
      employerStateId: ['', Validators.required],
      employerCountryId: ['', Validators.required],
      officePhone: ['', Validators.required],
      employDate: ['', Validators.required],
      previousEmployer: ['', Validators.required],
      customerId: [this.customerId, Validators.required],
      active: [''],
    });
  }
  editEmploymentHistory(index) {
    this.PanelHeader = 'Edit Employment History';
    this.LoadEmploymentHistoryForm();
    const empHis = this.customerEmploymentHistory[index];
    this.customerEmploymentHistoryForm = this.fb.group({
      placeOfWorkId: [empHis.placeOfWorkId, Validators.required],
      employerName: [empHis.employerName, Validators.required],
      employerAddress: [empHis.employerAddress, Validators.required],
      employerStateId: [empHis.employerStateId, Validators.required],
      employerCountryId: [empHis.employerCountryId, Validators.required],
      officePhone: [empHis.officePhone, Validators.required],
      employDate: [new Date(empHis.employDate), Validators.required],
      previousEmployer: [empHis.previousEmployer, Validators.required],
      customerId: [this.customerId, Validators.required],
      active: [empHis.active],
    });
    this.displayEmploymentHistory = true;
  }
  submitCustomerEmploymentHistory(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerEmploymentHistory(bodyObj).subscribe((response: any) => {
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
    this.PanelHeader = 'New Customer Next of Kin';
    this.displayNextOfKin = true;
  }
  loadNextOfKin() {
    this.customerNextOfKinForm = this.fb.group({
      nextOfKinId: [0],
      customerId: [this.customerId, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      relationship: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
      address: ['', Validators.required],
      nearestLandmark: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      active: [false],
    });
  }
  editNextOfKin(index) {
    this.PanelHeader = 'Edit Customer Next of Kin';
    const row = index; //this.customerNextOfKin[index];
    ////console.log('ROW >>>>>>>>>>>>>>>>', row);
    this.customerNextOfKinForm = this.fb.group({
      nextOfKinId: [row.nextOfKinId, Validators.required],
      customerId: [row.customerId, Validators.required],
      firstName: [row.firstName, Validators.required],
      lastName: [row.lastName, Validators.required],
      phoneNumber: [row.phoneNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      dateOfBirth: [new Date(row.dateOfBirth), Validators.required],
      gender: [row.gender, Validators.required],
      relationship: [row.relationship, Validators.required],
      email: [row.email, Validators.compose([Validators.required, ValidationService.isEmail])],
      address: [row.address, Validators.required],
      nearestLandmark: [row.nearestLandmark, Validators.required],
      stateId: [row.stateId, Validators.required],
      cityId: [row.cityId, Validators.required],
      active: [row.active],
    });
    this.displayNextOfKin = true;
  }
  submitCustomerNextOfKin(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerNextOfKin(bodyObj).subscribe((response: any) => {
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
      bankVerificationNumber: ['', [Validators.required, Validators.pattern(/^[1-9]+$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [this.companyDirectorType, Validators.required],
      companyDirectorTypeName: [''],
      numberOfShares: [0],
      isPoliticallyExposed: [false],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
    });
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
      bankVerificationNumber: [directors.bankVerificationNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [directors.companyDirectorTypeId],
      companyDirectorTypeName: [directors.companyDirectorTypeName],
      numberOfShares: [0],
      isPoliticallyExposed: [directors.isPoliticallyExposed],
      address: [directors.address, Validators.required],
      phoneNumber: [directors.phoneNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      email: [directors.email, Validators.compose([Validators.required, ValidationService.isEmail])],
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
      bankVerificationNumber: [directors.bankVerificationNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [directors.companyDirectorTypeId],
      companyDirectorTypeName: [directors.companyDirectorTypeName],
      numberOfShares: [directors.numberOfShares],
      isPoliticallyExposed: [directors.isPoliticallyExposed],
      address: [directors.address],
      phoneNumber: [directors.phoneNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      email: [directors.email, Validators.compose([Validators.required, ValidationService.isEmail])],
    });
    this.displayCompanyDirectors = true;
  }
  submitDirectorInformation(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateDirectorInformation(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getSingleCustomerBoardInfo(this.customerId);
        this.getSingleCustomerAccountSignatoryInfo(this.customerId);
        this.supplierTabDisabled = false;
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
    if (Number(typeId) === 1) {
      this.ultimateBeneficiary = false;
      this.individualShareholder = true;
      this.corporateShareholder = false;
      surnameControl.setValidators(Validators.required);
      bvnControl.setValidators([Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]);
      rcNumberControl.clearValidators()
    } else {
      this.ultimateBeneficiary = true;
      this.individualShareholder = false;
      this.corporateShareholder = true;
      rcNumberControl.setValidators(Validators.required);
      surnameControl.clearValidators();
      bvnControl.clearValidators();
    }
    surnameControl.updateValueAndValidity();
    bvnControl.updateValueAndValidity();
    rcNumberControl.updateValueAndValidity();
  }
  showAddNewCompanyShareholder() {
    this.PanelHeader = 'Add Company Shareholder Information';
    this.LoadCompanyShareholderForm();
    this.companyDirectorType = 2;
    this.individualShareholder = true;
    this.ultimateBeneficiary = false;
    this.corporateShareholder = false;
    this.displayCompanyShareholder = true;
  }
  LoadCompanyShareholderForm() {
    this.customerCompanyShareholderForm = this.fb.group({
      customerTypeId: ['', Validators.required],
      companyDirectorId: [0],
      customerId: [this.customerId, Validators.required],
      customerName: [''],
      rcNumber: [''],
      taxNumber: [''],
      surname: [''],
      firstname: ['', Validators.required],
      bankVerificationNumber: [''],// [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [2],
      companyDirectorTypeName: [''],
      numberOfShares: ['', [Validators.required, Validators.pattern(/^0|[1-9]\d*$/)]],
      isPoliticallyExposed: [false],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(9)]],
      email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],

    });
  }
  editShareholderInformation(index) {
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
      bankVerificationNumber: [shareholder.bankVerificationNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [shareholder.companyDirectorTypeId],
      companyDirectorTypeName: [shareholder.companyDirectorTypeName],
      numberOfShares: [shareholder.numberOfShares],
      isPoliticallyExposed: [shareholder.isPoliticallyExposed],
      address: [shareholder.address, Validators.required],
      phoneNumber: [shareholder.phoneNumber, [Validators.required, Validators.minLength(9)]],
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
      bankVerificationNumber: [shareholder.bankVerificationNumber, [Validators.required, Validators.pattern(/^0|[1-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      companyDirectorTypeId: [shareholder.companyDirectorTypeId],
      companyDirectorTypeName: [shareholder.companyDirectorTypeName],
      numberOfShares: [shareholder.numberOfShares],
      isPoliticallyExposed: [shareholder.isPoliticallyExposed],
      address: [shareholder.address, Validators.required],
      phoneNumber: [shareholder.phoneNumber, [Validators.required, Validators.minLength(9)]],
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
      bankVerificationNumber: ['', Validators.compose([Validators.required, ValidationService.isNumber, Validators.minLength(11), Validators.maxLength(11)])],
      numberOfShares: ['', Validators.required],
      isPoliticallyExposed: [false],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), ValidationService.isNumber]],
      email: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
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
      rcNumber: formObj.value.rcNumber,
      taxNumber: formObj.value.taxNumber,
      surname: formObj.value.surname,
      firstname: formObj.value.firstname,
      bankVerificationNumber: formObj.value.bankVerificationNumber,
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
    this.customerService.saveAndUpdateDirectorInformation(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getSingleCustomerShareholderIndividual(this.customerId);
        this.getSingleCustomerShareholderCorporate(this.customerId);
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
      bankVerificationNumber: ['', [Validators.required, Validators.maxLength(12)]],
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
      bankVerificationNumber: [bvn.bankVerificationNumber, Validators.maxLength(12)],
      isValidBvn: [bvn.isValidBvn],
      isPoliticallyExposed: [bvn.isPoliticallyExposed],
    });
    this.displayBVN = true;
  }
  submitCustomerBVN(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerBVN(bodyObj).subscribe((response: any) => {
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
    this.LoadAddressesForm();
    this.displayAddresses = true;
    const addressTypeControl = this.customerAddressesForm.get('addressTypeId');
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
      homeTown: ['', Validators.required],
      nearestLandmark: ['', Validators.required],
      electricMeterNumber: ['', Validators.required],
      pobox: ['', Validators.required],
      addressTypeId: [''],
      active: [false],
    });
  }
  editAddresses(index) {
    this.PanelHeader = 'Edit Customer Address';
    this.LoadAddressesForm();
    const address = this.customerAddresses[index];
    this.customerAddressesForm = this.fb.group({
      addressId: [address.addressId],
      customerId: [this.customerId],
      address: [address.address],
      stateId: [address.stateId],
      cityId: [address.cityId],
      homeTown: [address.homeTown],
      nearestLandmark: [address.nearestLandmark],
      electricMeterNumber: [address.electricMeterNumber],
      pobox: [address.pobox],
      addressTypeId: [address.addressTypeId],
      active: [address.active],
    });
    this.displayAddresses = true;
  }
  submitCustomerAddresses(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerAddress(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getSingleCustomerAddressInfo(this.customerId);
        this.directorTabDisabled = false;
        if (this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
          this.employmentTabDisabled = false;
        }
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
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
    this.displayPhoneContact = true;
  }
  LoadPhoneContactForm() {
    this.customerPhoneContactForm = this.fb.group({
      phoneContactId: [0, Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^0|[1-9]\d*$/)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^0|[1-9]\d*$/)]],
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
      phone: [phone.phone, [Validators.required, Validators.minLength(9), Validators.pattern(/^0|[1-9]\d*$/)]],
      phoneNumber: [phone.phoneNumber, [Validators.required, Validators.minLength(9), Validators.pattern(/^0|[1-9]\d*$/)]],
      customerId: [this.customerId, Validators.required],
      active: [phone.active],
    });
    this.displayPhoneContact = true;
  }
  submitCustomerPhoneContact(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerPhoneContact(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getSingleCustomerPhoneContactInfo(this.customerId);
        this.directorTabDisabled = false;
        if (this.customerSelection.customerTypeId != CustomerTypeEnum.CORPORATE) {
          this.employmentTabDisabled = false;
        }
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
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
    this.customerService.saveAndUpdateCustomerChildren(bodyObj).subscribe((response: any) => {
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
            companyWebsite: ['', Validators.required],
            companyEmail: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
            registeredOffice: ['', Validators.required],
            annualTurnOver: ['', Validators.required],
            corporateBusinessCategory: [''],
            paidUpCapital: ['', Validators.required],
            authorizedCapital: ['', Validators.required],
            shareholderFund: ['', Validators.required],
            companyName: ['', Validators.required],
            canModified: [this.canModified]
        });
}
editCompanyInformation() {
    this.companyInfomationForm.get('companyName').setValue(this.customerSelection.customerName);
    const custCompany = this.customerCompanyInfomation != undefined ? this.customerCompanyInfomation : []; 
    this.companyInfomationForm = this.fb.group(
        {

            companyInfomationId: [custCompany.companyInfomationId],
            customerId: [this.customerId, Validators.required],
            registrationNumber: [custCompany.registrationNumber, Validators.required],
            companyWebsite: [custCompany.companyWebsite, Validators.required],
            companyEmail: [custCompany.companyEmail, Validators.compose([Validators.required, ValidationService.isEmail])],
            registeredOffice: [custCompany.registeredOffice, Validators.required],
            annualTurnOver: [custCompany.annualTurnOver, Validators.required],
            corporateBusinessCategory: [custCompany.corporateBusinessCategory],
            paidUpCapital: [custCompany.paidUpCapital, Validators.required],
            authorizedCapital: [custCompany.authorizedCapital, Validators.required],
            shareholderFund: [custCompany.shareholderFund, Validators.required],
            companyName: [this.customerFullName, Validators.required],
            canModified: [this.canModified]
        });
}
submitCustomerCompanyInformation(formObj) {
    let bodyObj = formObj.value;

    ////console.log(bodyObj);
    this.loadingService.show();
    this.customerService.saveAndUpdateCustomerCompanyInfo(bodyObj).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.success === true) {
            this.getSingleCustomerCompanyInfo(this.customerId);
            this.contactTabDisabled = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
    }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
}

  submitNewCustomerDetails(formObj) {
    const bodyObj = formObj.value;
    ////console.log("This is just a simple testing", bodyObj.customerCode)
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
      });
    } else {
      this.customerService.update(bodyObj, this.customerId).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.success === true) {
          // this.getSingleCustomerGeneralInfo(this.customerId);
          this.contactTabDisabled = false
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }
  }


  getKYCDocumentUploads(customerId) {
    this.loadingService.show();
    this.customerService.getKYCDocumentUploads(customerId).subscribe((response: any) => {
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

  uploadFileTitle: string = null;
  physicalFileNumber: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
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
        this.uploadFileTitle = null;
        this.documentTypeId = null;
        this.fileInput.nativeElement.value = "";
        this.loadingService.hide();
        this.getKYCDocumentUploads(this.customerId);
        if (this.showProceedButton == true) {
          this.ShowNextButton = true;
      }
        this.loadingService.hide();
        this.displayMandatesUpload = false;
      }, (error) => {
        this.loadingService.hide(1000);
        ////console.log("error", error);
      });
    }
  }

  updateCustomerInformationCompletion(customerId) {
    const __this = this;
    swal({
        title: 'Are you sure you want to proceed to Application?',
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
        __this.customerService.updateCustomerInformationCompletion(customerId).subscribe((response: any) => {
            __this.loadingService.hide();
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
      this.customerService.ValidateCustomerEligibility(customerCode).subscribe((response: any) => {
        this.customerValidation = response.result;
        if (this.customerValidation.length > 0) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, `You Cannot Continue with this process, Customer with code ${customerCode} is in blacklist`, 'error');

        }
        this.loadingService.hide();
      });
    }
  }
  employerlist: any[];
  loadEmployer() {
    this.genSetupServ.getEmployersList().subscribe((employers) => {
      this.employerlist = employers.result;
      ////console.log('I AM YOUR EMPLOYER', this.employerlist);
    });
  }
  closeModal() {
    this.hideCustomerInfo.emit("closed");
  }

  proceedToApplication(evt) {
    if (this.customerSelection.accountCreationComplete != true) {
      this.updateCustomerInformationCompletion(this.customerId);
  }
    this.displayEditInfo = false;
    this.proceedEvent.emit({ continue: 'true', customerId: this.customerId });
  }

  loadCustomerRelatedParty() {
    this.customerRelatedPartyForm = this.fb.group({
      relatedPartyId: [0],
      companyDirectorId: ['', Validators.required],
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
  submitcustomerRelatedParty(formObj) {
    let bodyObj = formObj.value;

    let body = {
      relatedPartyId: bodyObj.relatedPartyId,
      companyDirectorId: bodyObj.companyDirectorId,
      customerId: this.customerId,
      relationshipType: bodyObj.relationshipType
    }
    this.loadingService.show();
    this.customerService.addUpdateCustomerRelatedParty(body).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getCustomerRelatedParty(this.customerId);
        this.displayRelatedPartyForm = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }
}
