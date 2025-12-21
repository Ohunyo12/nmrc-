
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class ReportService {


    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    getLoanApplicationSLA(applicationId: number) {
        return this.http.get(`${AppConstant.API_BASE}report/workflowsla/loanapplication/${applicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanRepaymentSchedule(teamLoanId: number) {
        return this.http.get(`${AppConstant.API_BASE}report/loans/loanschedule/${teamLoanId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSectorLimit() {
        return this.http.get(`${AppConstant.API_BASE}report/limitmonitoring/sector`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBranchLimit() {
        return this.http.get(`${AppConstant.API_BASE}report/limitmonitoring/branch`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getWorkflowDefinition(id: number) {
        return this.http.get(`${AppConstant.API_BASE}report/workflow-definition/operation/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAnalystReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/analyst-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    InsiderRelatedLoansReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/insider-related-loans`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanStatusReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/loan-status-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCreditBureauReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/credit-bureau`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCollateralPerfection(data) {
        return this.http.post(`${AppConstant.API_BASE}report/Collateral-Perfection`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDisbursedFacilityCollateralReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/disbursed-facility-collateral-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCollateralRegister(data) {
        return this.http.post(`${AppConstant.API_BASE}report/Collateral-Register`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralAdequacy(data) {
        return this.http.post(`${AppConstant.API_BASE}report/collateral-adequacy`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getDisburstLoanReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-disbursedloans`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRunningFacilitiesReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/running-facilities`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getBlacklistReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/camsol/blacklist`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanCommercialReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-commercial`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getTeamandRevolving(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-team-revolving`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getEarnedUnearnedInterest(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-earned-unearned-interest`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getfinancePostedTransactions(data) {
        return this.http.post(`${AppConstant.API_BASE}report/posted-finance-transactions`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    CorporateLoansReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/corporate-loans-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffPosting(data) {
        return this.http.post(`${AppConstant.API_BASE}report/posted-transactions-staff/date`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //#region Offer-Letter Generation & Loan-Monitoring Reports offer-letter-cfl

    getGeneratedOfferLetterCFL(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/offer-letter-cfl/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGeneratedOfferLetter(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/offer-letter/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getGeneratedOfferLetterLMS(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/offer-letter-lms/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getCollateralPropertyRevaluationReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/collateral-property-revaluation`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getStalledPerfectioneport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/stalled-perfection`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralPerfectionYetToCommenceReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/collateral-perfection-yettocommence`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCashBacked(data) {
        return this.http.post(`${AppConstant.API_BASE}report/cashbacked-Report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCommercialLoanReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/all-comercial-loan-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUnearnedInterest(data) {
        return this.http.post(`${AppConstant.API_BASE}report/unearned-interest-Report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getReceivedInterest(data) {
        return this.http.post(`${AppConstant.API_BASE}report/receivable-interest-Report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getCashBackedBondGuarantee(data) {
        return this.http.post(`${AppConstant.API_BASE}report/cashbacked-bond-guarantee`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getweeklyrecoveryReportforFINCON(data) {
        return this.http.post(`${AppConstant.API_BASE}report/weeklyrecovery-Reportfor-FINCON`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCashCollaterizedCredits(data) {

        return this.http.post(`${AppConstant.API_BASE}report/cash-collaterized-credits`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }


    getCovenantsApproachingDueDateReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/almost-due-covenants`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getNonPerformingLoansReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/non-performing-loans`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBondAndGuaranteeReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/bond-and-guarantee`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getContingentsReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/contingents-report`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBondsAndGuaranteeReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/bond-and-guarantee-report`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCollateralVisitationReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/property-due-for-vistation`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getInsuranceExpiraionReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/insurance-expiration`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getTurnoverCovenantReport(form) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/turnover-covenant`, form)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExpiredSelfLiquidatingLoansReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/expired-self-liquidating-loans`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getExpiredOverdraftLoansReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/monitoring/overdraft-loans`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanStatement(id: number) {
        return this.http.get(`${AppConstant.API_BASE}report/loanstatement/loan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLoanAnniverseryReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-LoanAnniversery`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLoanDocumentWaived(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/document-waived`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLoanDocumentDeferred(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/document-deferred`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLoanClassification(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-classification-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAgeAnalysisReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/age-analysis-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetDisbursalCreditTurnoverReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/disbursal-credit-turnover`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    // GetImpairedWatchListReport(data) {
    //     return this.http.post(`${AppConstant.API_BASE}report/impaired-watch-list-report`, data)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    //}


    GetImpairedWatchListReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/impaired-watch-list-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetInsuranceReport() {
        return this.http.get(`${AppConstant.API_BASE}report/insurance-report`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetExpiredReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/expired-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetRuniningLoanReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/runining-loan-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetExcessReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/excess-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    GetUnutilizedFacilityReport() {
        return this.http.get(`${AppConstant.API_BASE}report/unutilized-facility-report`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetSanctionLimitReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/sanction-limit-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLoanDocumentDefferals(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/document-deferrals`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLoanDocumentDefferalsMCC(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/document-deferrals-mcc`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetFacilityApprovedNotUtilized(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/facility-approved-not-utilized`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetRuningLoansByLaonType(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/runing-loans-by-loantype`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLoanInterestReceivableAndPayable(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan/loan-interest-receivable-and-payable`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getCollateralEstimated(collateralCode: string) {
        return this.http.get(`${AppConstant.API_BASE}report/collateralestimated/loan/${collateralCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetFCYScheuledLoan(id: number) {
        return this.http.get(`${AppConstant.API_BASE}report/fcyscheuledloan/loan/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getLoanAccountWithLein(data) {
        return this.http.post(`${AppConstant.API_BASE}report/account-with-lien`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetStakeholderWithExpiredFTP(data) {
        return this.http.post(`${AppConstant.API_BASE}report/stakeholders-on-experation-ftp`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAuditTrail(data) {
        return this.http.post(`${AppConstant.API_BASE}report/audit-trail`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetJobRequestReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/job-request-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLoggingStatus(data) {
        return this.http.post(`${AppConstant.API_BASE}report/login-status`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLAReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/workflow/sla-monitoring`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAllApprovalStatus() {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-status`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAllApprovalOperations() {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-operation`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAllDailyAccrualCategories() {
        return this.http.get(`${AppConstant.API_BASE}report/daily-accrual/categories`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAllDailyAccrualReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/daily-accrual`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetLoanRepaymentReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/repayment`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetCustomFacilityRepaymentReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/custom-facility-repayment`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetAllLoanTransactionType() {
        return this.http.get(`${AppConstant.API_BASE}report/loan-transaction/type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    SearchForBranch(term) {
        return this.http
            .get(`${AppConstant.API_BASE}setups/branch-search?searchQuery=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    BranchSearchObservable(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.SearchForBranch(term)));
    }
    SearchForAuditType(term) {
        return this.http
            .get(`${AppConstant.API_BASE}report/audit-search?searchQuery=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    AuditTypeSearchObservable(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.SearchForAuditType(term)));
    }
    GetOperations() {
        return this.http.get(`${AppConstant.API_BASE}report/operations`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetFlowType() {
        return this.http.get(`${AppConstant.API_BASE}report/flow-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    GLSearchObservable(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.SearchForGL(term)));
    }
    SearchForGL(searchQuery) {
        return this.http
            .get(`${AppConstant.API_BASE}report/gl-search/${searchQuery}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    SearchForGLList(searchQuery) {
        return this.http
            .get(`${AppConstant.API_BASE}report/accountcode-search?searchQuery=${searchQuery}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getPrintLetter(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/form3800b-los/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    printLMSForm3800B(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/form3800b-lms/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    printLMSForm3800BLMS(applicationRefNumber: string) {
        return this.http.get(`${AppConstant.API_BASE}report/form3800b-lmsr/?applicationRefNumber=${applicationRefNumber}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    Getproductclass() {

        return this.http
            .get(`${AppConstant.API_BASE}report/dropdown-product-class`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }
    GetStaffPrivilegeChange(data) {
        return this.http.post(`${AppConstant.API_BASE}report/staff-priviledge-change-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    GetUserGroupChangeReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/user-group-change-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetProfileActivityReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/profile-activity-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetStaffRoleProfileGroupReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/staff-role-profile-group-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetStaffRoleProfileActivityReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/staff-role-profile-activity-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetInActiveContigentLiabilityReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/inactive-contigent-liability-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllLoanStatus() {
        return this.http.get(`${AppConstant.API_BASE}report/dropdown-loan-status`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    GetMiddleOfficeReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/middle-office-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetCollateralValuationReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/collateral-valuation-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCreditScheduleReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/credit-schedule-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetOfferLetterTitle(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/offer-letter/get/title/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetOfferLetterSalutation(customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/offer-letter/get/salutation/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetOfferLetterClause(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/offer-letter/get/clauses/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    GetOfferLetterAcceptance(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}credit/offer-letter/get/acceptance/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdateOfferLetterClause(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/edit/clause`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdateOfferLetterAcceptance(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/edit/acceptance`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdateOfferLetterTitle(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/edit/title`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    UpdateOfferLetterSalutation(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/edit/salutation`, JSON.stringify(data))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    LoanBookingReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/loan-booking-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    Fom3800bReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/form3800b-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    generateOoutPutDocument(loanApplicationId) {
        return this.http.get(`${AppConstant.API_BASE}report/output-document/loanApplicationId/${loanApplicationId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOriginalDocument(data) {
        return this.http.post(`${AppConstant.API_BASE}report/original-document-submission`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSubmissionOfOriginalDocuments(data) {
        return this.http.post(`${AppConstant.API_BASE}report/submission-of-original-documents`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCorporateCustomerCreation(data) {
        return this.http.post(`${AppConstant.API_BASE}report/corporate-customer-creation`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getInsuranceSpoolReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/insurance-spool-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getSecurityReleaseReport(data) {
        return this.http.post(`${AppConstant.API_BASE}report/security-release-report`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetExpiredFacilityReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/expired-facility-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetContigentReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/contigent-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    // benjamin
    GetRiskAssetsReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-assets-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getInterestIncomeReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/interest-income-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFixedDepositCollaterals(customerCode: string) {
        return this.http.get(`${AppConstant.API_BASE}report/get-fixed-deposit-collateral-report/customerCode/${customerCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getValidCollateralsReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/get-valid-collaterals-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetcbnNplTeamReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/cbn-npl-team-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    GetRiskAssetByCbnNplClassificationReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-by-cbn-classification`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetContigentLiabilityReportMain(body) {
        return this.http.post(`${AppConstant.API_BASE}report/contigent-liability-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    GetContigentLiabilityReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/contigent-liability`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetContigentLiabilityReportMain1(body) {
        return this.http.post(`${AppConstant.API_BASE}report/contigent-liability-main`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCopyOfRiskAssetMain(body) {
        return this.http.post(`${AppConstant.API_BASE}report/copy-of-risk-asset-main`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetCalcCombine(body) {
        return this.http.post(`${AppConstant.API_BASE}report/calc-combine`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetCalcCombineReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-calc-combine`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    GetCopyOfRiskAssetByIfrsClassifications(body) {
        return this.http.post(`${AppConstant.API_BASE}report/copy-of-risk-ifrs`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getOverlineReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/overline-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLargeExposureReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/large-exposure-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetExtensionReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/extension-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetMaturityReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/maturity-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetIfrsClassificationTeamReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/ifrs-classification-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetByVarianceReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-variance-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetCombinedReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-combined-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetContigentReportMain(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-contigent-main`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCopyOfRiskAssetByIfrsClassification(body) {
        return this.http.post(`${AppConstant.API_BASE}report/copy-ifrs-classification`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetMainReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-main-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetMain1Report(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-main1-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetDistributionBySectorReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-distribution-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetTeamReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/risk-asset-team-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetUnpaidObligationReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/unpaid-obligation-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRiskAssetByIFRSClassificationReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/rest-classification-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    isOfferLetterGenerated(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/is-offer-letter-generated`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ApplyTemplateToOfferLetter(data) {
        return this.http.post(`${AppConstant.API_BASE}credit/offer-letter/apply-template`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetApprovalMointoring(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-monitoring`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetTurnAroundMointoring(data) {
      return this.http.post(`${AppConstant.API_BASE}setups/work-flow-tracker/turn-around-monitoring`, data).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetEmployerRelatedData(data) {
        return this.http.post(`${AppConstant.API_BASE}loan/employer-related-loan-data`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetBookingMointoring(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-booking-monitoring`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetBookingTATMointoring(data) {
      return this.http.post(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-booking-tat-monitoring`, data).pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    GetContractReviewMointoring(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/work-flow-tracker/approval-review-monitoring`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalTrailByTargetId(targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBookingApprovalTrailByTargetId(targetId) {
        return this.http.get(`${AppConstant.API_BASE}setups/work-flow-tracker/booking/target/${targetId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    exportApprovalMonitoringExportToExcel(data) {
        return this.http.post(`${AppConstant.API_BASE}setups/approval-monitoring/export`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    exportApprovalComments(data, requireAll = false) {
        return this.http.post(`${AppConstant.API_BASE}setups/approval-comments/export/${requireAll}`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetGLAccountName() {
        return this.http.get(`${AppConstant.API_BASE}finance/gl-account-name`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getTrialBalanceSummary(data) {
        return this.http.post(`${AppConstant.API_BASE}finance/trial-balance-summary`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    /*  getTrialBalance(glAccountId: number) {
         return this.http.get(`${AppConstant.API_BASE}report/trial-balance/${glAccountId}`)
             .map(res => res)
             .catch((error: any) => Observable
                 .throw(error || 'Server error'));
     } */

    getTrialBalance(glAccountId: number, currencyCode: number) {
        return this.http.get(`${AppConstant.API_BASE}report/trial-balance/${glAccountId}/currency/${currencyCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    exportTrialBalanceToExcel(data) {
        return this.http.post(`${AppConstant.API_BASE}finance/trial-balance/export`, data)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // exportTrialBalanceToExcel(data) {
    //     return this.http.post(`${AppConstant.API_BASE}finance/trial-balance/export`, data).pipe(
    //         map(res => res),
    //         catchError((error: any) => observableThrowError(error || 'Server error')));
    // }
    // GetGLAccountName() {
    //     return this.http.get(`${AppConstant.API_BASE}finance/gl-account-name`).pipe(
    //         map(res => res),
    //         catchError((error: any) => observableThrowError(error || 'Server error')));


    // }
    // getTrialBalanceSummary(data) {
    //     return this.http.post(`${AppConstant.API_BASE}finance/trial-balance-summary`, data).pipe(
    //         map(res => res),
    //         catchError((error: any) => observableThrowError(error || 'Server error')));
    // }
    /*  getTrialBalance(glAccountId: number) {
         return this.http.get(`${AppConstant.API_BASE}report/trial-balance/${glAccountId}`)
             .map(res => res)
             .catch((error: any) => Observable
                 .throw(error || 'Server error'));
     } */

    // getTrialBalance(glAccountId: number, currencyCode: number) {
    //     return this.http.get(`${AppConstant.API_BASE}report/trial-balance/${glAccountId}/currency/${currencyCode}`).pipe(
    //         map(res => res),
    //         catchError((error: any) => observableThrowError(error || 'Server error')));
    // }

    //=========================== remedial assets reports ===============================

    GetOutOfCourtSettlementReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/out-of-court-settlement-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetCollateralSalesReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/collateral-sales-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRecoveryAgentUpdateReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/recovery-agent-update-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRecoveryCommissionReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/recovery-commission-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRecoveryAgentPerformanceReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/recovery-agent-performance-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetLitigationRecoveriesReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/litigation-recoveries-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRevalidationOfFullAndFinalSettlementReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/revalidation-of-full-and-final-settlement-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetIdleAssetsSalesReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/idle-assets-sales-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetFullAndFinalSettlementAndWaiversReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/full-and-final-settlement-and-waivers-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRetailRecoveryReport(startDate, endDate, accreditedConsultantId, customerId) {
        return this.http.get(`${AppConstant.API_BASE}credit/retail-recovery-report/${startDate}/${endDate}/${accreditedConsultantId}/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRecoveryDelinquentAccountsReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/recovery-delinquent-accounts-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetPaydayLoanRecoveryCollectionReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/payday-loan-recovery-collection-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetComputationForExternalAgentsReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/computation-for-external-agents-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetRecoveryCollectionReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/recovery-collection-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetComputationForInternalAgentsReport(body) {
        return this.http.post(`${AppConstant.API_BASE}report/computation-for-internal-agents-report`, JSON.stringify(body))
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllRecoveryAgents() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/recovery-agents-list`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    GetAllRecoveryCustomersAssignedToAgent(recoveryAgent) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/recovery-agents-customers-list/${recoveryAgent}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

     getAvailmentUtilizationTicketReport(loanApplicationDetailId) {
      return this.http.get(`${AppConstant.API_BASE}report/availment-utilization-ticket?customerId=${loanApplicationDetailId}`)
          .pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

}

