import { ICustomerSupplier, ICustomerCompanyShareholder } from '../../../models/CustomerInfo';
import { CompanyService } from '../../../../setup/services/company.service';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import {
  ICustomerInfo, ICustomerCompanyInfomation, ICustomerAddresses, ICustomerPhoneContact,
  ICustomerCompanyDirectors, ICustomerClientOrSupplier, ICustomerIdentification, ICustomerBvn, ICustomerEmploymentHistory
} from '../../../models/CustomerInfo';
import swal from 'sweetalert2';
import { BranchService } from '../../../../setup/services/branch.service';
import { CustomerService } from '../../../services/customer.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styles: [`
            .ui-datepicker {
            top: 100px !important;  
            }
    `]
})
export class CustomerEditComponent implements OnInit {
  cities: any[];
  countries: any[];
  states: any[];
  selectedcustomerTypeId: number;
  selectedCustomer: any = {};
  customerSearchForm: FormGroup;
  listOfDirectors: ICustomerCompanyDirectors = new ICustomerCompanyDirectors;
  editCustomerForm: FormGroup;
  displayEditCustomer: boolean = false;
  displayCustomerList: boolean = false;
  displayCustomerDetails: boolean = false;
  branches: any[];
  companies: any[];
  activeIndex = 0;
  model: any[];
  customers: any[];
  customersInfo: ICustomerInfo;
  customerId: number;
  customerTypes: any[];
  identificationModeTypes: any[];
  clientSuplierTypes: any[];
  directorsTypes: any[];
  maritalStatusList: any[];
  selectedIndex: any;
  customerClientOrSupplierForm: FormGroup;
  PanelHeader: string;
  customerFullName: string;
  displaySupplier: boolean = false;

  customerAddressesForm: FormGroup;
  displayAddresses: boolean = false;

  customerPhoneContactForm: FormGroup;
  displayPhoneContact: boolean = false;

  customerIdentificationForm: FormGroup;
  displayIdentification: boolean = false;

  customerBvnForm: FormGroup;
  displayBVN: boolean = false;

  customerEmploymentHistoryForm: FormGroup;
  displayEmploymentHistory: boolean = false;

  customerCompanyDirectorsForm: FormGroup;
  displayCompanyDirectors: boolean = false;
  show: boolean = false; message: any; title: any; cssClass: any;
  get addresses(): FormArray {
    return <FormArray>this.editCustomerForm.get('customerAddresses');
  }
  constructor(private loadingService: LoadingService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private countryStateSrv: CountryStateService, ) { }

  ngOnInit() {
    this.clearSearchForm();
    this.loadCustomerDropdowns();
    this.loadCustomerInformationForm();
    this.LoadClientOrSupplierForm();
    this.LoadIdentificationForm();
    this.LoadBVNForm();
    this.LoadEmploymentHistoryForm();
    this.LoadCompanyDirectorsForm();
    this.LoadAddressesForm();
    this.LoadPhoneContactForm();
    this.getStates();
    this.getCountries();
    this.getListOfMaritalStatus();
  }

  loadCustomerInformationForm() {
    this.editCustomerForm = this.fb.group({
      customerId: ['', Validators.required],
      customerCode: ['', Validators.required],
      branchId: ['', Validators.required],
      companyMainId: [''],
      branchName: [''],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      customerTypeName: [''],
      customerName: [''],
      searchItem: [''],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [''],
      placeOfBirth: [''],
      nationality: [''],
      maritalStatus: [''],
      emailAddress: ['', Validators.required],
      maidenName: [''],
      spouse: [''],
      firstChildName: [''],
      childDateOfBirth: [''],
      occupation: [''],
      customerTypeId: [''],
      relationshipOfficerId: [''],
      politicallyExposedPerson: [''],
      misCode: [''],
      misStaff: [''],
      approvalStatus: [''],
      dateActedOn: [''],
      actedOnBy: [''],
      accountCreationComplete: [''],
      creationMailSent: [''],
      customerSensitivityLevelId: [''],
      subSectorId: [''],
      subSectorName: [''],
      sectorId: [''],
      sectorName: [''],
      taxNumber: ['', Validators.required],
      customerAddresses: this.fb.group(
        {
          addressId: [''],
          customerId: [''],
          address: [''],
          stateId: [''],
          cityId: [''],
          homeTown: [''],
          nearestLandmark: [''],
          electricMeterNumber: [''],
          pobox: [''],
          addressTypeId: [''],
          active: [''],
        }),
      customerBvn: this.fb.group(
        {
          customerBvnid: [''],
          customerId: [''],
          surname: [''],
          firstname: [''],
          bankVerificationNumber: [''],
          isValidBvn: [''],
          isPoliticallyExposed: [''],
        }),
      customerCompanyInfomation: this.fb.group(
        {
          companyInfomationId: [''],
          customerId: [''],
          registrationNumber: [''],
          companyWebsite: [''],
          companyEmail: [''],
          registeredOffice: [''],
          annualTurnOver: [''],
          corporateBusinessCategory: [''],
          creditRating: [''],
          previousCreditRating: [''],
          paidUpCapital: [''],
          authorizedCapital: [''],
          companyName: [''],
        }),
      customerEditHistory: this.fb.group(
        {
          customerEditHistoryId: [''],
          customerId: [''],
        }
      ),
      customerEmploymentHistory: this.fb.group(
        {
          placeOfWorkId: [''],
          employerName: [''],
          employerAddress: [''],
          employerStateId: [''],
          employerCountryId: [''],
          officePhone: [''],
          employDate: [''],
          previousEmployer: [''],
          customerId: [''],
          active: [''],
        }
      ),
      customerIdentification: this.fb.group(
        {
          identificationId: [''],
          customerId: [''],
          identificationNo: [''],
          identificationModeId: [''],
          identificationMode: [''],
          issuePlace: [''],
          issueAuthority: [''],
        }),
      customerPhoneContact: this.fb.group(
        {
          phoneContactId: [''],
          phone: [''],
          phoneNumber: [''],
          customerId: [''],
          active: [''],
        }),
      customerCompanyDirectors: this.fb.group(
        {
          companyDirectorId: "",
          customerId: "",
          customerName: "",
          surname: "",
          firstname: "",
          bankVerificationNumber: "",
          companyDirectorTypeId: "",
          companyDirectorTypeName: "",
          numberOfShares: "",
          isPoliticallyExposed: "",
          address: "",
          phoneNumber: "",
          email: "",
        }),
      customerCompanyShareholder: this.fb.group(
        {
          companyDirectorId: "",
          customerId: "",
          customerName: "",
          surname: "",
          firstname: "",
          bankVerificationNumber: "",
          companyDirectorTypeId: "",
          companyDirectorTypeName: "",
          numberOfShares: "",
          isPoliticallyExposed: "",
          address: "",
          phoneNumber: "",
          email: "",
        }),
      customerClientOrSupplier: this.fb.group(
        {
          client_SupplierId: [''],
          customerId: [''],
          customerTypeId: [''],
          clientOrSupplierName: [''],
          firstName: [''],
          middleName: [''],
          lastName: [''],
          client_SupplierAddress: [''],
          client_SupplierPhoneNumber: [''],
          client_SupplierEmail: [''],
          client_SupplierTypeId: [''],
          client_SupplierTypeName: [''],
        }),
      customerSupplier: this.fb.group(
        {
          client_SupplierId: [''],
          customerId: [''],
          customerTypeId: [''],
          clientOrSupplierName: [''],
          firstName: [''],
          middleName: [''],
          lastName: [''],
          client_SupplierAddress: [''],
          client_SupplierPhoneNumber: [''],
          client_SupplierEmail: [''],
          client_SupplierTypeId: [''],
          client_SupplierTypeName: [''],
        })
    });
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
  getListOfMaritalStatus() {
    this.maritalStatusList = this.customerService.getMaritalStatusList()
  }
  getBranch(id) {
    let item = this.branches.find(x => x.branchId == id);
    if (item != undefined) { return item.branchName; }
    return 'n/a';
  }
  getStateCities(id): void {
    this.countryStateSrv.getCityByState(id).subscribe((response: any) => {
      this.cities = response.result;
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
  viewCustomerDetails(index) {
    this.selectedIndex = index;
    this.customersInfo = this.customers[index];
    // Update the data on the form
    this.customerId = this.customersInfo.customerId;
    this.selectedcustomerTypeId = this.customersInfo.customerTypeId;
    this.customerFullName = this.customersInfo.customerName;
    this.editCustomerForm.patchValue({
      customerId: this.customersInfo.customerId,
      customerCode: this.customersInfo.customerCode,
      branchId: this.customersInfo.branchId,
      companyMainId: this.customersInfo.companyMainId,
      branchName: this.customersInfo.branchName,
      title: this.customersInfo.title,
      firstName: this.customersInfo.firstName,
      middleName: this.customersInfo.middleName,
      customerTypeName: this.customersInfo.customerTypeName,
      customerName: this.customersInfo.customerName,
      searchItem: this.customersInfo.searchItem,
      lastName: this.customersInfo.lastName,
      gender: this.customersInfo.gender,
      dateOfBirth: new Date(this.customersInfo.dateOfBirth),
      placeOfBirth: this.customersInfo.placeOfBirth,
      nationality: this.customersInfo.nationality,
      maritalStatus: this.customersInfo.maritalStatus,
      emailAddress: this.customersInfo.emailAddress,
      maidenName: this.customersInfo.maidenName,
      spouse: this.customersInfo.spouse,
      firstChildName: this.customersInfo.firstChildName,
      childDateOfBirth: new Date(this.customersInfo.childDateOfBirth),
      occupation: this.customersInfo.occupation,
      customerTypeId: this.customersInfo.customerTypeId,
      relationshipOfficerId: this.customersInfo.relationshipOfficerId,
      politicallyExposedPerson: this.customersInfo.politicallyExposedPerson,
      misCode: this.customersInfo.misCode,
      misStaff: this.customersInfo.misStaff,
      approvalStatus: this.customersInfo.approvalStatus,
      dateActedOn: this.customersInfo.dateActedOn,
      actedOnBy: this.customersInfo.actedOnBy,
      accountCreationComplete: this.customersInfo.accountCreationComplete,
      creationMailSent: this.customersInfo.creationMailSent,
      customerSensitivityLevelId: this.customersInfo.customerSensitivityLevelId,
      subSectorId: this.customersInfo.subSectorId,
      subSectorName: this.customersInfo.subSectorName,
      sectorId: this.customersInfo.sectorId,
      sectorName: this.customersInfo.sectorName,
      taxNumber: this.customersInfo.taxNumber,
      customerCompanyInfomation: this.customersInfo.customerCompanyInfomation[0] || new ICustomerCompanyInfomation,
      customerAddresses: this.customersInfo.customerAddresses[0] || new ICustomerAddresses,
      customerPhoneContact: this.customersInfo.customerPhoneContact[0] || new ICustomerPhoneContact,
      customerClientOrSupplier: this.customersInfo.customerClientOrSupplier[0] || new ICustomerClientOrSupplier,
      customerSupplier: this.customersInfo.customerSupplier[0] || new ICustomerSupplier,
      customerIdentification: this.customersInfo.customerIdentification[0] || new ICustomerIdentification,
      customerBvn: this.customersInfo.customerBvn[0] || new ICustomerBvn,
      customerEmploymentHistory: this.customersInfo.customerEmploymentHistory[0] || new ICustomerEmploymentHistory,
      customerCompanyDirectors: this.customersInfo.customerCompanyDirectors[0] || new ICustomerCompanyDirectors,
      customerCompanyShareholder: this.customersInfo.customerCompanyShareholder[0] || new ICustomerCompanyShareholder
    });
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
  handleChange(e) {
    this.activeIndex = e.index;
  }
  hideMessage(event) {
    this.show = false;
  }
  next() {
    this.activeIndex = (this.activeIndex === 3) ? 0 : this.activeIndex + 1;
  }

  prev() {
    this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
  }


  showAddNewClientSupplier() {
    this.PanelHeader = 'Add Supplier/Client Information';
    this.LoadClientOrSupplierForm();
    this.displaySupplier = true;
  }
  LoadClientOrSupplierForm() {
    this.customerClientOrSupplierForm = this.fb.group({
      client_SupplierId: [0],
      customerId: [this.customerId],
      customerTypeId: [this.selectedcustomerTypeId],
      clientOrSupplierName: [''],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      client_SupplierAddress: ['', Validators.required],
      client_SupplierPhoneNumber: [''],
      client_SupplierEmail: [''],
      client_SupplierTypeId: ['', Validators.required],
      client_SupplierTypeName: [''],
    });
  }
  editClient(index) {
    this.PanelHeader = 'Edit Supplier/Client Information';
    this.LoadClientOrSupplierForm();
    const clisup = this.customersInfo.customerClientOrSupplier[index];
    this.customerClientOrSupplierForm = this.fb.group({
      client_SupplierId: [clisup.client_SupplierId],
      customerId: [this.customerId],
      customerTypeId: [clisup.customerTypeId],
      clientOrSupplierName: [],
      firstName: [clisup.firstName],
      middleName: [clisup.middleName],
      lastName: [clisup.lastName],
      client_SupplierAddress: [clisup.client_SupplierAddress],
      client_SupplierPhoneNumber: [clisup.client_SupplierPhoneNumber],
      client_SupplierEmail: [clisup.client_SupplierEmail],
      client_SupplierTypeId: [clisup.client_SupplierTypeId],
      client_SupplierTypeName: [''],
    });
    this.displaySupplier = true;
  }
  editSupplier(index) {
    this.PanelHeader = 'Edit Supplier/Client Information';
    this.LoadClientOrSupplierForm();
    const clisup = this.customersInfo.customerSupplier[index];
    this.customerClientOrSupplierForm = this.fb.group({
      client_SupplierId: [clisup.client_SupplierId],
      customerId: [this.customerId],
      customerTypeId: [clisup.customerTypeId],
      clientOrSupplierName: [],
      firstName: [clisup.firstName],
      middleName: [clisup.middleName],
      lastName: [clisup.lastName],
      client_SupplierAddress: [clisup.client_SupplierAddress],
      client_SupplierPhoneNumber: [clisup.client_SupplierPhoneNumber],
      client_SupplierEmail: [clisup.client_SupplierEmail],
      client_SupplierTypeId: [clisup.client_SupplierTypeId],
      client_SupplierTypeName: [''],
    });
    this.displaySupplier = true;
  }
  submitClientOrSupplier(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateClientOrSupplier(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displaySupplier = false
      } else {
        this.finishBad(response.message)
        this.displaySupplier = false
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
  }
  editIdentification(index) {
    this.PanelHeader = 'Edit Identification Information';
    this.LoadIdentificationForm();
    const identity = this.customersInfo.customerIdentification[index];
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
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displayIdentification = false
      } else {
        this.finishBad(response.message)
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
      officePhone: [''],
      employDate: [''],
      previousEmployer: [''],
      customerId: [this.customerId],
      active: [''],
    });
  }
  editEmploymentHistory(index) {
    this.PanelHeader = 'Edit Employment History';
    this.LoadEmploymentHistoryForm();
    const empHis = this.customersInfo.customerEmploymentHistory[index];
    this.customerEmploymentHistoryForm = this.fb.group({
      placeOfWorkId: [empHis.placeOfWorkId],
      employerName: [empHis.employerName],
      employerAddress: [empHis.employerAddress],
      employerStateId: [empHis.employerStateId],
      employerCountryId: [empHis.employerCountryId],
      officePhone: [empHis.officePhone],
      employDate: [new Date(empHis.employDate), Validators.required],
      previousEmployer: [empHis.previousEmployer],
      customerId: [this.customerId],
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
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displayEmploymentHistory = false
      } else {
        this.finishBad(response.message)
        this.displayEmploymentHistory = false
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.displayEmploymentHistory = false
    });
  }
  showAddNewCompanyDirectors() {
    this.PanelHeader = 'Add Company Directors Information';
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
      bankVerificationNumber: ['', [Validators.required, Validators.minLength(11)]],
      companyDirectorTypeId: ['', Validators.required],
      companyDirectorTypeName: [''],
      numberOfShares: [''],
      isPoliticallyExposed: [''],
      address: [''],
      phoneNumber: [''],
      email: [''],
    });
  }
  editDirectorInformation(index) {
    this.PanelHeader = 'Edit Directors Information';
    this.LoadEmploymentHistoryForm();
    const directors = this.customersInfo.customerCompanyDirectors[index];
    this.customerCompanyDirectorsForm = this.fb.group({
      companyDirectorId: [directors.companyDirectorId],
      customerId: [this.customerId],
      customerName: [directors.customerName],
      surname: [directors.surname],
      firstname: [directors.firstname],
      bankVerificationNumber: [directors.bankVerificationNumber],
      companyDirectorTypeId: [directors.companyDirectorTypeId],
      companyDirectorTypeName: [directors.companyDirectorTypeName],
      numberOfShares: [directors.numberOfShares],
      isPoliticallyExposed: [directors.isPoliticallyExposed],
      address: [directors.address],
      phoneNumber: [directors.phoneNumber],
      email: [directors.email],
    });
    this.displayCompanyDirectors = true;
  }
  editShareholderInformation(index) {
    this.PanelHeader = 'Edit Shareholder Information';
    this.LoadEmploymentHistoryForm();
    const directors = this.customersInfo.customerCompanyShareholder[index];
    this.customerCompanyDirectorsForm = this.fb.group({
      companyDirectorId: [directors.companyDirectorId],
      customerId: [this.customerId],
      customerName: [directors.customerName],
      surname: [directors.surname],
      firstname: [directors.firstname],
      bankVerificationNumber: [directors.bankVerificationNumber],
      companyDirectorTypeId: [directors.companyDirectorTypeId],
      companyDirectorTypeName: [directors.companyDirectorTypeName],
      numberOfShares: [directors.numberOfShares],
      isPoliticallyExposed: [directors.isPoliticallyExposed],
      address: [directors.address],
      phoneNumber: [directors.phoneNumber],
      email: [directors.email],
    });
    this.displayCompanyDirectors = true;
  }
  submitDirectorInformation(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.saveAndUpdateDirectorInformation(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displayCompanyDirectors = false
      } else {
        this.finishBad(response.message)
        this.displayCompanyDirectors = false
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.displayCompanyDirectors = false
    });
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
    const bvn = this.customersInfo.customerBvn[index];
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
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displayBVN = false
      } else {
        this.finishBad(response.message)
        this.displayBVN = false
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
      addressTypeId: ['', Validators.required],
      active: [''],
    });
  }
  editAddresses(index) {
    this.PanelHeader = 'Edit Customer Address';
    this.LoadAddressesForm();
    const address = this.customersInfo.customerAddresses[index];
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
        this.submitForm(this.customerSearchForm);
        this.viewCustomerDetails(this.selectedIndex)
        this.finishGood(response.message);
        this.displayAddresses = false
      } else {
        this.finishBad(response.message)
        this.displayAddresses = false
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
      phone: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      customerId: [this.customerId, Validators.required],
      active: [''],
    });
  }
  editPhoneContact(index) {
    this.PanelHeader = 'Edit Customer Phone Contact';
    this.LoadPhoneContactForm();
    const phone = this.customersInfo.customerPhoneContact[index];
    this.customerPhoneContactForm = this.fb.group({
      phoneContactId: [phone.phoneContactId, Validators.required],
      phone: [phone.phone, [Validators.required, Validators.minLength(10)]],
      phoneNumber: [phone.phoneNumber, Validators.required],
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
        this.submitForm(this.customerSearchForm);
        this.finishGood(response.message);
        this.displayPhoneContact = false
      } else {
        this.finishBad(response.message)
        this.displayPhoneContact = false
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.displayPhoneContact = false
    });
  }
  submitCustomerCompanyInformation(formObj) {
    const bodyObj = formObj.value;
    this.loadingService.show();
    this.customerService.update(bodyObj, this.customerId).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.submitForm(this.customerSearchForm);
        this.finishGood(response.message);
        this.displayCustomerDetails = false;
      } else {
        this.finishBad(response.message)
        this.displayCustomerDetails = false
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.displayCustomerDetails = false
    });
  }

}
