
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class LoanService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    search(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}casa/customer/search/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // Searching through Customer table
    searchForCustomer(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForCustomerAccount(term)));
    }

    searchForCustomerAccount(term) {
        return this.http
            .get(`${AppConstant.API_BASE}casa/customer-account/?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchApplication(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchApplicationEntries(term)));
    }

    searchApplicationEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/loan-application-search/search/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchScheme(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchSchemeEntries(term)));
    }

    searchSchemeEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/scheme-setup-search/search/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generateSchedule(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/schedule`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanTypes() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanDetails() {
        return this.http.get(`${AppConstant.API_BASE}loan/detail`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanDetailsWithParam(data) {
        return this.http.post(`${AppConstant.API_BASE}loan/loan-schedule`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generatePeriodicSchedule(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/periodic-schedule`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generatePeriodicPrepaymentSchedule(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/periodic-prepayment-schedule`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generatePeriodicScheduleArchive(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/archive-periodic-loan-schedule`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generateDailySchedule(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/daily-schedule`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    exportToExcel(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/schedule/export`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAllLoanScheduleTypes() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-types`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        //.catch((error: any) => Observable
        //.throw(error.json().error || 'Server error')
        // );
    }

    getLoanScheduleTypes(productTypeId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-types/${productTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanDayCount() {
        return this.http.get(`${AppConstant.API_BASE}setups/day-count`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCommercialLoans() {
        return this.http.get(`${AppConstant.API_BASE}loan/commercial-loans`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getCRMSRepaymentAgreementType() {
        return this.http.get(`${AppConstant.API_BASE}credit/crms-repayment-agreement/type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    getFrequencyTypes() {
        return this.http.get(`${AppConstant.API_BASE}setups/frequency-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanDedubeCheck(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-dedube-check/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExistingLoans(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}loan/existing-loans/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLoans(customerId) {
        return this.http.get(`${AppConstant.API_BASE}loan/customer/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApprovers(operationId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/approvers/${operationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getDrawdownMemoPdf(referenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}report/get-drawdown-memo-pdf/${referenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExchangeRate(fromCurrencyCode, toCurrencyCode, rateCode) {
        return this.http.get(`${AppConstant.API_BASE}loan/exchange-rate/${fromCurrencyCode}/${toCurrencyCode}/${rateCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerAccountBalanceByCasaAccountId(casaAccountId: string) {
        return this.http.get(`${AppConstant.API_BASE}loan/customer-accounts/balance/${casaAccountId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    verifyLegalContingentCode(legalContingentCode: string, loanApplicationDetailId: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/legal-contingent-code-validation/${legalContingentCode}/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanTransactionDynamics(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-transaction-dynamics/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupLoans(customerGroupId) {
        return this.http.get(`${AppConstant.API_BASE}loan/customer-group/${customerGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanCustomerAccounts(loanApplicationDetailId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-customer-accounts/${customerId}/application-detail/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanCustomerCompanyInfo(loanApplicationDetailId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-customer-company/${customerId}/application-detail/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanMonitoringTriggerByID(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/monitoring-trigger/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailedLoanApplications() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application/availment-completed`) 
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGlobalApprovedEmployerApplications(searchString: string) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application/global-completed/${searchString}`) 
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationCollateral(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-collateral/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanFacilitiesAwaitingApprovalByParam(searchString) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-facility-awaiting-booking/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    // getApplicationsToBeAdhocApproved() {
    //     return this.http.get(`${AppConstant.API_BASE}loan/loan-application/adhoc-approval`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getApplicationsForTrancheFacilityUilization(searchValue) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-application/availment-completed/${searchValue}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   
    getAvailedMultipleApplicationsForBooking() {
        return this.http.get(`${AppConstant.API_BASE}loan/availed-loan-applications/booking-ready`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailedApplicationsForDocumentation() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation-los`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailedApplicationsForDocumentationSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation-los-search/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllLosCompletedApplicationsForDocumentation(body) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/loan-operation/completed-documentation-los`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getBulkInsuranceUploadAwaitingApproval() {
      return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-insurance-upload-awaiting-approval`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getBulkInsuranceUploadRejectedApproval() {
    return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-insurance-upload-rejected-approval`)
    .pipe(
      map((res: any) => res),
    catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanOperationDocumentationLosApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation-los-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailedMultipleApplicationsForCRMSCODE() {
        return this.http.get(`${AppConstant.API_BASE}loan/availed-loan-applications/crms-code-ready`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAvailedContingentFacilityForRelease() {
        return this.http.get(`${AppConstant.API_BASE}loan/availed-contingent-facility-for-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getLoanFacilityDetal(applicationdetilId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-detail/${applicationdetilId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanApplicationReadyForForBookingById(applicationDetailId, loanBookingRequestId) {
        return this.http.get(`${AppConstant.API_BASE}loan/requested-loan-booking/${loanBookingRequestId}/application-detail/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    initiateBooking(body, applicationId: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-application/request-booking/${applicationId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getNextLevelForInitiateBooking(body, applicationId: number) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-application/request-booking/next/${applicationId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCashbackTemplate(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/cashback/`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralTypes() {
        return this.http.get(`${AppConstant.API_BASE}credit/collateral-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getMonitoringTriggers() {
        return this.http.get(`${AppConstant.API_BASE}loan/monitoring-trigger`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerLoanBookingOverride(customerCode) {
        return this.http.get(`${AppConstant.API_BASE}loan/customer-loan-booking-override/${customerCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetailCovenantById(applicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application-detail-covenant/${applicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationCollaterals(customerId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application/collateral/customer/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerApplicableCollaterals(collateralTypeId, customerId, thirdpartyCustomerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/customer-collateral/customer/${customerId}/collateral-type/${collateralTypeId}/thirdparty/${thirdpartyCustomerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductFees(productId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-product-fees/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanProductCharges(chargeFeeId, productId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-application/charge-fee/${chargeFeeId}/product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAppraisalMemorandumPropertyCollateralInfo(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}loan/application-collateral-valuation/details/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAppraisalMemorandumLoanDetailsUpdate(appraisalMemorandumId) {
        return this.http.get(`${AppConstant.API_BASE}loan/appraisal-loan-details-updates/${appraisalMemorandumId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupCustomersByGroupId(grpId) {
        return this.http.get(`${AppConstant.API_BASE}customer/customers-in-group/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getForiegnLoanNarations(loanId) {
        return this.http.get(`${AppConstant.API_BASE}loan/foreign-loan-naration/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanMonitoringTriggers(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-monitoring-triggers/${loanId}/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanCollaterals(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-collaterals/${loanId}/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // getLoanProductFees(loanApplicationDetailId) {
    //     return this.http.get(`${AppConstant.API_BASE}credit/loan-application-product-fees/${loanApplicationDetailId}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }
    getLoanProductFees(loanBookingRequestId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-product-fees/booking-request/${loanBookingRequestId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveLoans(dataCollection) {
        let bodyObj = JSON.stringify(dataCollection);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-booking`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    maintainFacilityLine(dataCollection) {
        let bodyObj = JSON.stringify(dataCollection);
        return this.http.post(`${AppConstant.API_BASE}loan/maintain-facility-line`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

   

    saveLoanGaurantor(dataCollection, productTypeId, applicationReferenceNumber) {
        let bodyObj = JSON.stringify(dataCollection);
        return this.http.post(`${AppConstant.API_BASE}loan/gaurantor/product-type/${productTypeId}/application/${applicationReferenceNumber}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanInterestRateAmount(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-interest-rate-amount`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRunningLoan(id: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/running-loan/customer/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getInitiatedLoansAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/request/approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }
    getTermLoansAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/term/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getBookedLoanApplicationsForVerificationAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/verification/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getBookedLoanApplicationsForVerificationAwaitingApprovalParam(searchString) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/verification/awaiting-approval-param/${searchString}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getFacilityLinesAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/facility-line-maintenance-awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getdisbursedLoansApplicationDetails() {
        return this.http.get(`${AppConstant.API_BASE}loan/loans-disbursed`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }
    

    getDeferredTermLoansFeesAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/term/deffered-fees/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getBookingsRequestAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking-request/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getDeferredRevolvingLoansFeesAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/revolving/deffered-fees/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getDeferredContingentLoansFeesAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/contingent/deffered-fees/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    getRevolvingLoansAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/revolving/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getContingentLoansAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-booking/contingent/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCurrentCustomerExposure(customer: any[], loanTypeId: number = 1) {
        return this.http.post(`${AppConstant.API_BASE}loan/current-exposure/customer/${loanTypeId}`, customer)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCurrentCamsolByCustomer(customer: any[], loanTypeId: number = 1) {
        return this.http.post(`${AppConstant.API_BASE}loan/current-camsol/customer/${loanTypeId}`, customer)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getFacilitySummary(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}loan/facility-summary/application/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCommiteeCreditApplications(applicationType) {
        return this.http.get(`${AppConstant.API_BASE}credit/committee-credit-application/${applicationType}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoansByApplicationDetailId(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-tranches/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoansById(id) {
        return this.http.get(`${AppConstant.API_BASE}loan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanTrancheHistory(loanReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-tranche-history/${loanReferenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanRequestHistory(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-request/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    loanApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    drawDownApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/drawdown-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationSearchBookedLoans(loanApplicationDetailId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/search-booked-loans/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    loanApplicationDetailSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-details/search`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approvedLoanApplicationDetailSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/approved-loan-application-details/search`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanReviewApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    exceptionalLoanApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/exceptional-loan-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    loanReviewContingentApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-review-contingent-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    loanLienApplicationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-lien-application-detail-search`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    LienApplications() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-lien-applications`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationCancellationRequest(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/loan-cancellation`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationLmsCancellationRequest(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/lms-loan-cancellation`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GoForLoanApplcationCancellationApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-cancellation-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GoForLmsLoanApplcationCancellationApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/lms-loan-application-cancellation-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    loanApplicationcancellation() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application/cancellation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    lmsLoanApplicationcancellation() {
        return this.http.get(`${AppConstant.API_BASE}credit/lms-loan-application/cancellation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    viewLoanApplicationcancellation(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application-cancellation`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    viewLmsLoanApplicationcancellation(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/lms-loan-application-cancellation`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    forwardReviewRequest(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}credit/loan-application/review-request`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    getRejectedApplications() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-and-offer/rejected`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    
    getRejectedApplicationsArchive() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-application-and-offer/rejected/arch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRejectedReviewApplicationsArchive() {
        return this.http.get(`${AppConstant.API_BASE}credit/loan-review-application-and-offer/rejected`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getApprovalTrailByOperation(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}loan/work-flow-tracker/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalTrailByOperation22(operationId, targetId) {
      return this.http.get(`${AppConstant.API_BASE}setups/generic-lms-approval-trail/${targetId}/${operationId}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getApprovalTrailByProjectSiteId(targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/operation-site-report/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalTrailByOperationBooking(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}loan/work-flow-tracker-booking/operation/${operationId}/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getScheduleInExcelFormat(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/schedule/export`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    twoFactorAuthEnabledCheckOverride(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/two-factor-auth-enabled-fee-override`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanCustomerCompanyInformation(customerId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-customer-company-information/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanRepricingMode() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-repricing-mode`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getLoanDisbursement(loanId) {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-disbursement?loanId=${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addUpdateLoanDisbursement(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/loan-disbursement`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    //FILE DOWNLOAD SERVICE
    downloadExcel(data): Observable<Object[]> {



        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `${AppConstant.API_BASE}loan/schedule/export`, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.responseType = 'blob';

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        var blob = new Blob([xhr.response], { type: contentType });
                        observer.next(blob);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            }
            //xhr.send(JSON.stringify({ email: "hello@user.com", response: { name: "Tester" } }));
            xhr.send(data);

        });
    }





    getLoanSystemType() {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/product-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationDetail(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/appraisal-memorandum/loan-detail/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-schedule/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getTransactionDetail(loanRefNo) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/transaction-detail/${loanRefNo}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanDetailForRanche(searchValue) {
        return this.http.get(`${AppConstant.API_BASE}credit/tranche-facility/${searchValue}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getContingentUtilization(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/contingent-utilization/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getGetDailyInterestAccrual(data) {
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/daily-interest-accrual`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLmsFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/lms-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getRelatedFacilityDetail(relatedloanReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/related-facilty-details/${relatedloanReferenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getFacilityDetailArchive(archiveId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/facilty-details-archive/${archiveId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getOverdraftFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/overdraft-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getRelatedOverdraftFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/related-overdraft-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getOverdraftFacilityDetailArchive(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/overdraft-facilty-details-archive/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllOverdraftFacilityDetailArchive(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/all-overdraft-facilty-details-archive/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getContingentFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/contingent-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getContingentLmsFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/contingent-lms-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getRelatedContingentFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/related-contingent-facilty-details/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAchiveAllFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/all-facilty-details-archive/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getRelatedLoanFacility(data) {
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/related-loan`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanChargeFee(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-chargefee/${loanId}/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getFacilityApplicationChargeFee(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-product-fees/application/${loanApplicationDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanConvenantDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-convenant/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLmsLoanConvenantDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-convenant/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOtherInformations(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/otherInformation/${loanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateral(loanId,loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-collateral/${loanId}/loanSystemTypeId/${loanSystemTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanSearch(data) {
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/loan-search`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLMSLoanSearch(data) {
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/lms-loan-search`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ReferBackBooking(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/loan-booking-modification/refer-back`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRefferedBookedFacilityDetail(body) {
        return this.http.post(`${AppConstant.API_BASE}loan/referred-booked-facility-record`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    //CRMS
    getCRMSData(data){
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/fetch-crms-code`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    resetCrmsCode(data){
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/reset-crms-code`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addCRMScode(data) {
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/crms-code`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllLoanWithCRMSLoan(data) {
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/all-loan-with-crms-code`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    exportCRMSReportToExcel(data) {
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/export`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    exportCRMSReportToExcelByLoanAppID(data) {
        return this.http.post(`${AppConstant.API_BASE}crms/regulatory/export-by-loan-application-id`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCompltedLoans() {
        return this.http.get(`${AppConstant.API_BASE}loan/completed-loan`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCompltedLoan(value) {

        return this.http.get(`${AppConstant.API_BASE}loan/completed-loan/search/${value}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    changeLoanStatusToComplete(loanid) {
        return this.http.post(`${AppConstant.API_BASE}loan/completed-loan-status`, loanid)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getFireTest() {
        return this.http.get(`${AppConstant.API_BASE}operations/loan-schedule-test/`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
   

    getLaonBalances(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}loan/loan-balance/${loanId}`,)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveAtcLodgment(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-lodgment`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveAtcLodgmentForApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-lodgment-save-for-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateAtcLodgment(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/atc-lodgment/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteAtcLodgment(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/atc-lodgment/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    editAtcLodgment(id,data) {
        return this.http.put(`${AppConstant.API_BASE}credit/atc-lodgment/${id}`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcLodgments() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcLodgmentForRelease() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-for-release`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcLodgementReleaseApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-release-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcByCustomerId(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-release/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcSumByCustomerId(customerId) {
      return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-release-sum/${customerId}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    getAtcLodgementApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveAtcLodgmentDetail(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-lodgment-detail`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-release-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitReferredAtcForApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-referred-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    

    saveEditedAtc(id, body) {
        return this.http.put(`${AppConstant.API_BASE}credit/save-edited-atc-release/${id}`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitLodgementApproval(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-lodgement-final-approval`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateAtcLodgmentDetail(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/atc-lodgment-detail/${id}`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteAtcLodgmentDetail(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/atc-lodgment-detail/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcLodgmentDetails() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-detail`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAtcLodgmentDetail(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-detail/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAtcRelease(id) {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-release/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    editAtcLodgmentDetail(id,data) {
        return this.http.put(`${AppConstant.API_BASE}credit/atc-lodgment-detail/${id}`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcType() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllBranches() {
        return this.http.get(`${AppConstant.API_BASE}setups/branch/company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllBranch() {
        return this.http.get(`${AppConstant.API_BASE}setups/branch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    saveAtcRelease(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-release`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteAtcType(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/atc-type/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addAtcType(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/atc-type`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAtcReleaseList() {
        return this.http.get(`${AppConstant.API_BASE}credit/atc-lodgment-for-releaseList`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // service for bulk disbursement package scheme by Benjamin
    // scheme
    addBulkDisbursementPackageScheme(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/add-disbursement-scheme`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllBulkDisbursementPackageScheme() {
        return this.http.get(`${AppConstant.API_BASE}credit/disbursement-package-schemes`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getBulkDisbursementPackageSchemeById(disburseSchemeId) {
        return this.http.get(`${AppConstant.API_BASE}credit/disbursement-package-scheme-id/${disburseSchemeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBulkDisbursementPackageSchemeByProduct(productId) {
        return this.http.get(`${AppConstant.API_BASE}credit/disbursement-package-scheme-product/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBulkDisbursementPackageSchemeByRefNumber(applicationReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}credit/disbursement-package-scheme-reference-number/${applicationReferenceNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    editBulkDisbursementPackageScheme(disbursementSchemeId,data) {
        return this.http.put(`${AppConstant.API_BASE}credit/update-disbursement-package-scheme/${disbursementSchemeId}`,data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    deleteBulkDisbursementPackageScheme(disbursementSchemeId) {
        return this.http.delete(`${AppConstant.API_BASE}credit/delete-disbursement-package-scheme/${disbursementSchemeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
 
    getAllFacilities() {
        return this.http.get(`${AppConstant.API_BASE}setups/product`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    }

    getAllProductPriceIndexByFacility(productId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-productId/${productId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllProductPriceIndexById(productPriceIndexId) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-price-index-by-id/${productPriceIndexId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllPeriodicSchedule() {
        return this.http.get(`${AppConstant.API_BASE}loan/loan-schedule-types`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    letterGenerationSearch(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/letter-generation-search`, JSON.stringify(body))
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanIregularInput(loanReviewOperationId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-ireg/${loanReviewOperationId}`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    logApproval(body: any) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}loan/log-approval/workflow`, bodyObj)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanOperationDocumentationLosApprovalSearch(searchString) {
      return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation-los-approval-search/${searchString}`)
      .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
}
}