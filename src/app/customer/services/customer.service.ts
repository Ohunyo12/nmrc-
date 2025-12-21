
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Company } from '../../setup/models/company';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';
import { single } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class CustomerService {
  

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getCustomersByBranch() {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-by-branch`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerByCustomerId(id) {
    return this.http.get(`${AppConstant.API_BASE}customer/customerbyid?custormerId=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerById(id) {
    return this.http.get(`${AppConstant.API_BASE}customer/customerbyid/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllCustomerAccountByCustomerId(id: number) {
    return this.http.get(`${AppConstant.API_BASE}casa/customer-accounts/customer/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllKyc() {
    return this.http.get(`${AppConstant.API_BASE}customers/Kycitem`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  addKyc(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customers/Kycitem`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateKYCItem(body, kYCItemId: number) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}customers/Kycitem/${kYCItemId}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getBranchCustomers() {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-by-branch`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  search(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-search`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  eligibilitySearch(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/eligibility-search`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAndUpdateCustomerPhoneContact(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-phonecontact`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerAddress(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-address`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerBVN(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-bvn`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerEmploymentHistory(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-employmentHistory`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAndUpdateDirectorInformation(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-companydirectors`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  saveAndUpdateClientOrSupplier(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-clientsupplier`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerIdentification(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-identification`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerChildren(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-children`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerCompanyInfo(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-company-information`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveAndUpdateCustomerNextOfKin(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-nextofkin`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  UpdateCustomerCompanyInformation(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-company`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  saveCustomerRelationshipType(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customers/customer-relationship-type`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  save(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}customer`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  update(body, id: number) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}customer/${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateProspectToCustomer(body, id: number) {
    let bodyObj = JSON.stringify(body);
    return this.http.put(`${AppConstant.API_BASE}customer/prospect-customer?customerId=${id}`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getProducts() {
    return this.http.get(`${AppConstant.API_BASE}setups/product-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCRMSLegalStatuses() {
    return this.http.get(`${AppConstant.API_BASE}customer/crms-type-legal-status`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCRMSLegalStatusesByType(id) {
    return this.http.get(`${AppConstant.API_BASE}customer/crms-type-legal-status-by-customer-type?type=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCRMSRelationshipTypesByType(id) {
    return this.http.get(`${AppConstant.API_BASE}customer/crms-type-relationship-type-by-customer-type?type=${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCRMSCompanySizes() {
    return this.http.get(`${AppConstant.API_BASE}customer/crms-type-company-size`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCRMSRelationshipTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/crms-type-relationship-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCustomerAddressTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-address-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerRiskRating() {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-risk-rating`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllCustomerTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/customertype`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCorporateCustomerTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/corporate-customer-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllCustomerTypesWithHybrid() {
    return this.http.get(`${AppConstant.API_BASE}customer/customertype-with-hybrid`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllSupplierTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/suppliertype`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAllIdentificationModeTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/identificationMode`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getKYCDocumentType() {
    return this.http.get(`${AppConstant.API_BASE}customer/kyc-document-type`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getAlldirectorsTypes() {
    return this.http.get(`${AppConstant.API_BASE}customer/directorsType`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  searchCustomer(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer/?search=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  // Searching through Customer table
  searchForCustomer(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchCustomerRealtime(term)));
  }
  searchCustomerRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-information/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  searchForSingleCustomer(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchSingleCustomerRealtime(term)));
  }
  searchSingleCustomerRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customers-information/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  searchCustomerGroupMembers(term, groupId) {
    return this.http
      .get(`${AppConstant.API_BASE}customer/group-customer-members/${groupId}/?searchQuery=${term}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  searchForAllCustomer(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchAllCustomerRealtime(term)));
  }
  searchAllCustomerRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/customers-information/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  searchForSingleCorporateCustomer(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchForSingleCorporateCustomerRealtime(term)));
  }
  searchForSingleCorporateCustomerRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-corporate-customers-information/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  searchForGroupCustomer(terms: Observable<any>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchSingleCustomerRealtime(term)));
  }
  searchGroupCustomerRealtime(search) {
    return this.http.get(`${AppConstant.API_BASE}customer/group-customers-information/?searchQuery=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  searchForCustomerStaging(terms: Observable<any>, isProspectConversion: boolean) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(), switchMap(term => this.searchCustomerStagingRealtime(term, isProspectConversion)));
  }

  searchCustomerStagingRealtime(search, isProspectConversion: boolean) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-staging/isProspectConversion/${isProspectConversion}/?searchTerm=${search}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  searchCustomerStagingBycustomercode(customercode) {
    return this.http.post(`${AppConstant.API_BASE}customer/customer-staging/customercode`, customercode)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllProspectCustomer() {
    return this.http.get(`${AppConstant.API_BASE}customer/prospect-customer`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  mergeDuplicateCustomers(accounNumber, prospectiveCustomerCode) {
    return this.http.get(`${AppConstant.API_BASE}customer/merge-duplicate-customers/accounNumber/${accounNumber}/prospectiveCustomerCode/${prospectiveCustomerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerRelationshipTypes() {
    return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping/relationship-types`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerRatingAndLimit(id) {
    return this.http.get(`${AppConstant.API_BASE}customer/customerrating/${id}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  getCustomerSensitivityLevelList() {
    let list: any = [
      { 'customerSensitivityLevelId': '1', 'Level': '0', 'Description': 'Negligible' },
      { 'customerSensitivityLevelId': '2', 'Level': '1', 'Description': 'Very Low' },
      { 'customerSensitivityLevelId': '3', 'Level': '2', 'Description': 'Low' },
      { 'customerSensitivityLevelId': '4', 'Level': '3', 'Description': 'Medium' },
      { 'customerSensitivityLevelId': '5', 'Level': '4', 'Description': 'High' },
      { 'customerSensitivityLevelId': '6', 'Level': '5', 'Description': 'Very High' }
    ];

    return list;
  }
  getCustomerSensitivityLevel(id) {
    let list: any = [
      { 'customerSensitivityLevelId': '1', 'Level': '0', 'Description': 'Negligible' },
      { 'customerSensitivityLevelId': '2', 'Level': '1', 'Description': 'Very Low' },
      { 'customerSensitivityLevelId': '3', 'Level': '2', 'Description': 'Low' },
      { 'customerSensitivityLevelId': '4', 'Level': '3', 'Description': 'Medium' },
      { 'customerSensitivityLevelId': '5', 'Level': '4', 'Description': 'High' },
      { 'customerSensitivityLevelId': '6', 'Level': '5', 'Description': 'Very High' }
    ];
    let model = list.find(x => x.Level === id);
    return (model == null) ? 'n/a' : model.Description;
  }

  getMaritalStatusList() {
    let list: any = [
      { 'MaritalStatusId': '1', 'MaritalStatus': 'Single' },
      { 'MaritalStatusId': '2', 'MaritalStatus': 'Married' },
      { 'MaritalStatusId': '3', 'MaritalStatus': 'Divorced' },
      { 'MaritalStatusId': '4', 'MaritalStatus': 'Widowed' },
    ];
    return list;
  }

  getTitleList() {
    let title: any = [
      { 'TitleId': '1', 'TitleName': 'Mr.' },
      { 'TitleId': '2', 'TitleName': 'Mrs.' },
      { 'TitleId': '3', 'TitleName': 'Miss.' },
      { 'TitleId': '4', 'TitleName': 'Dr.' },
      { 'TitleId': '5', 'TitleName': 'Prof' },
      { 'TitleId': '6', 'TitleName': 'Chief' },
      { 'TitleId': '7', 'TitleName': 'Alhaji' },
      { 'TitleId': '7', 'TitleName': 'Alhaja' },
      { 'TitleId': '8', 'TitleName': 'HRM' },
      { 'TitleId': '9', 'TitleName': 'HRH' },
    ]
    return title;
  }
  getGenderList() {
    let gender: any = [
      { 'GenderId': '1', 'GenderName': 'Male' },
      { 'GenderId': '2', 'GenderName': 'Female' }
    ]
    return gender;
  }
  getMaritalStatus(id) {
    let list: any = [
      { 'MaritalStatusId': '1', 'MaritalStatus': 'Single' },
      { 'MaritalStatusId': '2', 'MaritalStatus': 'Married' },
      { 'MaritalStatusId': '3', 'MaritalStatus': 'Divorced' },
      { 'MaritalStatusId': '4', 'MaritalStatus': 'Widowed' },
    ];

    let model = list.find(x => x.MaritalStatusId == id);
    return (model == null) ? 'n/a' : model.MaritalStatus;
  }
  getKYCDocumentUploads(customerId) {
    return this.http.get(`${AppConstant.API_BASE}kyc/document-upload/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerGeneralInfoByLoanApplicationId(loanApplicationId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-by-loanapplication?loanApplicationId=${loanApplicationId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCustomerGeneralInfoByLMSLoanApplicationId(loanApplicationId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-by-lms-loanapplication?loanApplicationId=${loanApplicationId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  // Single Customer Information By CustomerID
  getSingleCustomerGeneralInfo(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-general-info?customerCode=${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerCompanyInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-company-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerAddressInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-address-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerPhoneContactInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-phonecontact-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerBVNInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-bvn-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerIdentificationInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-identification-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerEmploymentHistoryInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-employment-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerBoardInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-board-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerShareholderIndividual(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-shareholder-individual?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerShareholderCorporate(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-shareholder-corporate?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCustomerShareholderUltimateBenefical(companyDirectorId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-shareholder-beneficial?companyDirectorId=${companyDirectorId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerAccountSignatoryInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-accountsignatory-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerClientInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-client-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerSupplierInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-supplier-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleCustomerChildrenInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-children-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerCASAInformation(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-casa-information?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerCASAInformationByCode(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-casa-information/${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSingleCustomerNextOfKin(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-nextofkin-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  // Single Temporary Customer Information By CustomerID and TargetId
  getSingleTempCustomerGeneralInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-general-info-by-customerid?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerCompanyInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-company-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerAddressInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-address-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerPhoneContactInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-phonecontact-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSingleTempCustomerEmploymentHistoryInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-employment-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerBoardInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-board-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerShareholderIndividual(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-shareholder-individual?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerShareholderCorporate(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-shareholder-corporate?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCustomerTempShareholderUltimateBenefical(companyDirectorId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-shareholder-beneficial?companyDirectorId=${companyDirectorId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerAccountSignatoryInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-accountsignatory-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerClientInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-client-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerSupplierInfo(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-supplier-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getSingleTempCustomerChildrenInfo(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-children-info?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSingleTempCustomerNextOfKin(customerId, targetId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-nextofkin-info?customerId=${customerId}&&targetId=${targetId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  deleteChild(childId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/customer-children/${childId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteUltimateBeneficial(companyBeneficialId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/company-ultimate-beneficial/${companyBeneficialId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  ValidateCustomerEligibility(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/customer-eligibility/${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
 

  getCustomerEligibility(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}credit/limitvalidations/get-customer-eligibility/${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  ValidateNewCustomer(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}customer/validate-new-customer/${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  ValidateCustomerModification(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/validate-customer-modification/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateCustomerInformationCompletion(customerId: number) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-information-completed/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  GetAllCustomerInformationAwaitingApproval() {
    return this.http.get(`${AppConstant.API_BASE}customer/customer/approvals/temp`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  sendForApproval(bodyObj) {
    let body = JSON.stringify(bodyObj);
    return this.http.post(`${AppConstant.API_BASE}customer/approval`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getAllCustomerRelatedParty(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-related-party?custormerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  getCustomerIBLEligibility(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/customer-ibl-eligibility/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  updateIBLEligibility( id: number) {
    return this.http.put(`${AppConstant.API_BASE}customer/customer-ibl-eligibility-update`,id)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  addUpdateCustomerRelatedParty(bodyObj) {
    let body = JSON.stringify(bodyObj);
    return this.http.post(`${AppConstant.API_BASE}customer/customer-related-party`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSingleCustomerGeneralInfoByCustomerId(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-general-info-by-customerid?customerId=${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getDirectorRelatedCustomer(bvn) {
    return this.http.get(`${AppConstant.API_BASE}customer/director-related-customer?bvn=${bvn}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getCustomerAccountType(accountNumber) {
    return this.http.get(`${AppConstant.API_BASE}finance/customer-account-type?accountNumber=${accountNumber}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  uploadFile(file: File, body: any) {
    // let bodyObj = JSON.stringify(body);
    return new Promise((resolve, reject) => {

      let url = `${AppConstant.API_BASE}kyc/document-upload`;
      // let url = `${AppConstant.API_BASE}media/document-excel`;
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      let formData = new FormData();
      formData.append("file", file, file.name);

      for (var key in body) {
        formData.append(key, body[key]);
      }

      let token = this.http.getAuthorizationHeader();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  getPoliticalExposedStatus(customerCode) {
    return this.http.get(`${AppConstant.API_BASE}customer/politically-exposed-person/${customerCode}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  updateCustomerInformation(customerCode, accountNumber) {
    return this.http.get(`${AppConstant.API_BASE}customer/update-customer-information/customerCode/${customerCode}/accountNumber/${accountNumber}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  fetchAndAddCustomerAccounts(customerId) {
    return this.http.get(`${AppConstant.API_BASE}customer/refresh-customer-account/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteRelatedParty(relatedPartyId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/delete-related-party/${relatedPartyId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }


  deleteAddresses(addressId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/delete-address/${addressId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteContact(phoneContactId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/delete-contact/${phoneContactId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteEmploymentHistory(placeOfWorkId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/delete-employment-history/${placeOfWorkId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  deleteNextOfKin(nextOfKinId) {
    return this.http.delete(`${AppConstant.API_BASE}customer/delete-nextOfKin-history/${nextOfKinId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  getSingleCustomerRelatedEmployer(customerId: number) {
    return this.http.get(`${AppConstant.API_BASE}customer/single-customer-related-employer/${customerId}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  uploadBulkFsCaptionFile(file: File, body: any) {
    return new Promise((resolve, reject) => {

      let url = `${AppConstant.API_BASE}customer/pre-multiple-fs-caption`;
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      let formData = new FormData();
      formData.append("file", file, file.name);

      for (var key in body) {
        formData.append(key, body[key]);
      }

      let token = this.http.getAuthorizationHeader();
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.send(formData);
    });
  }

  saveMultipleFsCaptionRequests(formObj) {
    let bodyObj = JSON.stringify(formObj);
    return this.http.post(`${AppConstant.API_BASE}customer/bulk-fs-caption-entries`, bodyObj)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
}