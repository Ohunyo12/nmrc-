
import { throwError as observableThrowError, Observable } from 'rxjs';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';






import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class LoanOperationService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    // Searching through Loan Application table
    searchForLoan(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForLoanByCallLimit(term)));
    }

    searchForLoanByCallLimit(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-search?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForInactiveLoanContingent(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchLoanForInactiveContingent(term)));
    }

    searchLoanForInactiveContingent(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-search-inactive-contingent?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }



    searchForLoanPrepaymentReversal(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchLoanForPrepaymentReversal(term)));
    }

    searchLoanForPrepaymentReversal(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-search-prepayment-reversal?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));

    }



    fullAndFinalLoanSearch(searchQuery) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-search/full-and-final/${searchQuery}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));

    }

    // cancelFullAndFinal(loanId) {
    //     return this.http.get(`${AppConstant.API_BASE}creditoperations/cancel-full-and-final/${loanId}`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));

    // }

    cancelFullAndFinal(loanId, statusId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/cancel-full-and-final/${loanId}/status/${statusId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));

    }

    getApprovedOverDraftRouteAndReviewApplication() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-overdraft-route-and-review-application`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForLoanContingent(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchLoanForContingent(term)));
    }

    searchLoanForContingent(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-search-contingent?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForLoanPrepayment(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchLoanForPrepayment(term)));
    }

    getLoanApplicationsInputer() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-approval-prepayment`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchLoanForPrepayment(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-search-prepayment?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForFXRevolvingLoan(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForFXRevolvingLoanByFilter(term)));
    }

    searchForFXRevolvingLoanByFilter(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/fx-revolving-loan-search?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForRunningCommercialAndFxLoans(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForRunningCommercialAndFxLoanByQuery(term)));
    }

    searchForRunningCommercialAndFxLoanByQuery(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/running-commercial-and-fx-loan-search?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    searchForOD(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForODByCallLimit(term)));
    }

    searchForODByCallLimit(term) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/overdraft-search?searchQuery=${term}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedContingentTerminationApplication() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/contingent-for-termination-application`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedContingentApplication() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-contingent-application`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedOverDraftReviewApplication() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-overdraft-review-application`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getContingentByLoanId(revolvingLoanId: number) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/contingent-detail?revolvingLoanId=${revolvingLoanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    runRefressFinacleBulkPosting(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}admin/end-of-day-RepaymentFromStagin`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    // runRefressFinacleBulkPosting(revolvingLoanId: number) {
    //     return this.http
    //         .get(`${AppConstant.API_BASE}admin/end-of-day-RepaymentFromStagin?revolvingLoanId=${revolvingLoanId}`)
    //         .map((res: Response) => res.json());
    // }

    getOverDraftDetailsByLoanId(revolvingLoanId: number) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/overdraft-detail?revolvingLoanId=${revolvingLoanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLoanReview() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-loan-review`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedNonTermLoansForReviewAwaitingApproval() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-non-term-loan-review-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedNonTermLoansForReview() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-non-term-loan-review`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLineReviewData() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-line-review`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getProcessReviewLoanData(searchString) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/process-review-loan-data/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApplicationLineTenorChangeAwaitingApproval() {
        return this.http
            .get(`${AppConstant.API_BASE}operations/line-operation-awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCommercialLoanByApplicationDetailId(loanApplicationDetailId) {
        return this.http
            .get(`${AppConstant.API_BASE}loan/commercial-loans/application-detail/${loanApplicationDetailId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedFXRevolvingLoanReview() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-fx-revolving-loan-review`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLoanReviewRemedial() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-loan-review-remedial`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getDisbursedLoanDetailsById(loanId, loanType) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/disbursed-loan-details?loanId=${loanId}&loanType=${loanType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getUnDisbursedLoanDetailsById(loanId, loanType) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/undisbursed-loan-details?loanId=${loanId}&loanType=${loanType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getDisbursedCommercialLoanTrancheDetailsById(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/disbursed-loan-tranche-details/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getGroupCustomerLoanByLoanId(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/group-customer-loan-details?loanId=${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getOperationType(isFinalOperation) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-operationtype/isFinalOperation/${isFinalOperation}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getReviewApprovalOperations() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-operationtype`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    getOperationTypeByOD() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-operationtypebyoverdraft`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getOperationTypeByContingent() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-operationtypebycontingent`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getRemedialOperationType() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-remedial-operationtype`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getOperationTypeByScheduleId(proId, schId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-operationtype?productTypeId=${proId}&scheduleTypeId=${schId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    // getLoanGuarantors(loanId) {
    //     return this.http
    //         .get(`${AppConstant.API_BASE}creditoperations/loan-guarantor?loanId=${loanId}`)
    //         .map((res: Response) => res.json());
    // }

    getLoanConvenant(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-convenant?loanId=${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanChargeFee(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-chargefee?loanId=${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCollateralOD(loanId, loanType) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-collateral-od?loanId=${loanId}&loanType=${loanType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCollateral(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}facilitydetailsummary/loan-collateral?loanId=${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCollateralByLoan(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}facilitydetailsummary/loan-collateral-loan/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCollateralByProductType(loanId, productTypeId) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/customer-collateral/loan/${loanId}/productTypeId/${productTypeId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCollateralByCustomerId(customerId) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/customer-collateral/active/${customerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLoanReviewAwaitingOperation() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-loan-review-awaiting-operation`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanConvenantOD(loanId, loanType) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-convenant-od?loanId=${loanId}&loanType=${loanType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanChargeFeeOD(loanId, loanType) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-chargefee-od?loanId=${loanId}&loanType=${loanType}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanScheduleByLoanId(loanId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/loan-schedule-details?loanId=${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoanOperationAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoanOperationByLoanReferenceAwaitingApproval(loanReference) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/by-loanreference-awaiting-approval/${loanReference}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLLienRemovalAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/lien-removal-operation/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    lienSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/lien-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLLienRemovalDocuments(lienRemovalId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/lien-removal-operation/documents/${lienRemovalId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkRecoveryToAgentAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-assignment-to-agent/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkRetailRecoveryToAgentAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-retail-recovery-assignment-to-agent/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkUnassignmentRecoveryFromAgentAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-unassignment-from-agent/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkUnassignmentRetailRecoveryFromAgentAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-retail-recovery-unassignment-from-agent/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkRecoveryToAgentAwaitingApprovalList(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-assignment-to-agent/awaiting-approval-list/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    BulkRecoveryToAgentAwaitingApprovalList(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-assignment-to-agent/application-list/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansOperationForDocumentation() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansOperationForDocumentationSearch(searchString) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/awaiting-documentation-search/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLmsCompletedLoansOperationForDocumentation(body) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/loan-operation/lms-completed-documentation`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansOperationRecoveryAnalysis() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-analysis`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansOperationWriteOffAnalysis() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-write-off-analysis`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansOperationRecoveryAnalysisByAgent(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-analysis-agents/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllMonthlyLoansOperationRecoveryAnalysisByAgent(source, start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-analysis-agents/${source}/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllRecoveryComputationVariables() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-computation-variables`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllUnassignedRecoveryOperationByAgent(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/unassignment-loan-operation/recovery-operation-agents/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    getAllRecoveryCommissonByAgents(start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-commission-agents-retail/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansRecoveredByAgent() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-report-all-agents`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansRecoveredByAgents() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovered-report-all-agents`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllBulkLoansRecoveredByAgent(accreditedConsultantId, referenceId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-recovery-approval/${accreditedConsultantId}/${referenceId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllBulkUnassignLoansRecoveredByAgent(accreditedConsultantId, referenceId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-unassign-recovery-approval/${accreditedConsultantId}/${referenceId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllBulkLoansRecoveredByAgentRemedial(accreditedConsultantId, referenceId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-recovery-approval-remedial/${accreditedConsultantId}/${referenceId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanReviewOperationIrregularSchedule(id) {
        return this.http.get(`${AppConstant.API_BASE}operations/loan-review-irregular-schedule/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllApprovedLoanReview() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/approved-loan-review`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanApprovalDetails(loanId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/approval-detail?loanId=${loanId}&operationId=${operationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    addLoanContingent(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}creditoperations/add-loan-contingent`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    // addLoanContingentWithAttachment(file: File, body: any) {
    //     let bodyObj = JSON.stringify(formObj);
    //     return this.http.post(`${AppConstant.API_BASE}creditoperations/add-loan-contingent`, bodyObj)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    addLoanContingentWithAttachment(file: File, body: any) {
        let bodyObj = JSON.stringify(body);

        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}creditoperations/add-loan-contingent-with-attachment`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
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


    addLoanReviewOperation(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}creditoperations/add-loan-review`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendLoanOperationForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/operation-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendLienRemovalOperationForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/lien-removal-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkRecoveryOperationForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/assign-nplloans-to-agent-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkUnassignmentRecoveryOperationForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/unassign-nplloans-from-agent-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    sendLoanOperationRephrasement(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/operation-loan-rephrasement`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getMaturedCommercialLoansParent() {
        return this.http.get(`${AppConstant.API_BASE}operations/commercial-loans-lines`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getdueCommercialLoansByApplicationDetailId(loanApplicationDetailId) {
        return this.http.get(`${AppConstant.API_BASE}operations/due-commercial-loans/detail/${loanApplicationDetailId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getdueCommercialLoans() {
        return this.http.get(`${AppConstant.API_BASE}operations/due-commercial-loans`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getRunningCommercialLoanLines() {
        return this.http.get(`${AppConstant.API_BASE}operations/running-commercial-loans/detail`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
        // .catch((error: any) => Observable
        //     .throw(error.json().error || 'Server error'));
    }

    getMaturedInstructionType() {
        return this.http.get(`${AppConstant.API_BASE}operations/maturity-instruction-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getMaturedLoanInstructions() {
        return this.http.get(`${AppConstant.API_BASE}operations/loan-maturity-instructions`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    addLoanMaturityInstruction(formObj) {
        let bodyObj = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}operations/approve-commercial-loan-maturity-instruction`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanChargeFeeByLoanId(loanId) {
        return this.http.get(`${AppConstant.API_BASE}operations/loan-charge-fee-byloanid/loanId/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    sendCommercialLoanRolloverInstruction(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/approve-commercial-loan-roll-over`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    addTenor(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/non-term-loan-tenor-extension`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    loanOperationGoForApproval(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/application-go-for-approval`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    LineGoForApproval(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/application-line-operation-go-for-approval`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    addTenorToLine(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/application-line-tenor-extension`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    changeLineFacilityAmount(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/application-line-facility-amount-change`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    saveSubAllocations(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/commercial-loan-sub-allocation`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    addCommercialLoanPayment(data, loanReferenceNumber) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/commercial-loan-prepayment/${loanReferenceNumber}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    changeNonTermLoanInterestRate(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/non-term-loan-interest-rate-change`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    changeApplicationLineInterestRate(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/application-line-interest-rate-change`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    runInterestRateChange(data) {
        let bodyObj = JSON.stringify(data);
        return this.http.post(`${AppConstant.API_BASE}operations/commercial-loan-interest-rate-change`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    //CAMSOL
    getAllCamsol() {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getAllCamsolByCamsolTypeId(id) {
        return this.http.get(`${AppConstant.API_BASE}camsol/view-loan-camsol-type/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    CamsolByCamsolAwaitingApprovalById(id) {
        return this.http.get(`${AppConstant.API_BASE}camsol/camsol-approval-type/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getAllCamsolByCamsolAwaitngApproval() {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getAllSearchCamsol(searchValue) {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol-search/${searchValue}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanCamsolType() {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLoanCamsolTypeId(id) {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol-type-id/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanCamsolByCostomerCode(customercode) {
        return this.http.get(`${AppConstant.API_BASE}camsol/loan-camsol-customer-code/${customercode}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    goForCamsolApproval(data) {
        return this.http.post(`${AppConstant.API_BASE}camsol/go-for-camsol-approval/`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    approveLoan(data) {
        return this.http.post(`${AppConstant.API_BASE}camsol/approve-loan-camsol`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    getProductType() {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/product-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-schedule/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/facilty-details/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getThirdPartyFacility(loanReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/third-party-facilty-details/${loanReferenceNumber}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getContingentFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/contingent-facilty-details/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getOverdraftFacilityDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/overdraft-facilty-details/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanChargeFees(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-chargefee/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanConvenantDetail(loanId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-convenant/${loanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getCollateral(loanId, loanSystemTypeId) {
        return this.http.get(`${AppConstant.API_BASE}facilitydetailsummary/loan-collateral/${loanId}/loanSystemType${loanSystemTypeId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getLoanSearch(data) {
        return this.http.post(`${AppConstant.API_BASE}facilitydetailsummary/loan-search`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    uploadCamsolFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}camsol/multiple-camsol-data`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
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
    approveBulkCamsol(formObj) {
        let body = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}camsol/bulk-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    SendEmailForRecovery(accreditedConsultantId) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/sent-email-for-recovery/${accreditedConsultantId}`,)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    GetfullAndFinalLoanStatus() {
        return this.http.get(`${AppConstant.API_BASE}loan/full-and-final-status`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));

    }

    GetContingAmountUsed(contingentLoanId) {
        return this.http
            .get(`${AppConstant.API_BASE}credit/contingent-used-amount/${contingentLoanId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLoanReviewRouteAndOperation() {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-loan-review-route`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    BulkRecoveryReportingApplicationList() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-reporting/application-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    sendBulkPolicyForBulkApproval(formObj,approvalStatusId,comment) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/multiple-bulk-insurance-upload-approval/${approvalStatusId}/${comment}`, formObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

    getAllLoanRecoveryReportingDocuments(referenceId) {
        return this.http.get(`${AppConstant.API_BASE}document/recovery-reporting-documents/${referenceId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    sendBulkInsuranceUploadForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/bulk-insurance-upload-approval`, formObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkRecoveryReportingAwaitingApprovalList() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-reporting/awaiting-approval-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansRecoveryReportingByReference(reference) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-recovery-reporting-approval/${reference}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkRecoveryReportingForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/loan-recovery-reporting-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    GetBulkRecoveryReportingAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-reporting/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    //=================================================recovery commission
    getAllPaymentRecoveredCommissionByAgent() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-commission-by-agents`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    BulkRecoveryCommissionApplicationList() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-commission/application-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBulkRecoveryCommissionAwaitingApprovalList() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-commission/awaiting-approval-list`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansRecoveryCommissionByReference(reference) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/bulk-recovery-commission-approval/${reference}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    GetBulkRecoveryCommissionAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/bulk-recovery-commission/awaiting-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkRecoveryCommissionForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/loan-recovery-commission-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendDocumentationFillingForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/documentation-filling-approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkRecoveryForBulkApproval(formObj, approvalStatusId, comment) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/assign-bulk-nplloans-to-agent-approval/${approvalStatusId}/${comment}`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendBulkUnassignRecoveryForBulkApproval(formObj, approvalStatusId, comment) {
        return this.http.post(`${AppConstant.API_BASE}creditoperations/unassign-bulk-nplloans-from-agent-approval/${approvalStatusId}/${comment}`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    generateMailToAgents(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/generate-recovery-mail-to-agents/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllPendingEmailAlert(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/pending-recovery-mail-to-agents/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllRecoveryReportCollectionByAgents() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-report-collection-agents-retail`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllMonthlyRecoveryReportCollectionByAgents(start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-report-collection-agents-retail/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    GetAllInternalRecoveryAgents(start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/recovery-internal-agents-list/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllInternalRecoveryCommissonByAgents() {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-commission-agents-internal`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllMonthlyInternalRecoveryCommissonByAgents(start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-commission-agents-internal/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansForRecoveryAnalysisByAgent(source, start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-report-collection-analysis-agents/${source}/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansForExternalRecoveryAnalysisByAgent(source, start) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-commission-external-analysis-agents/${source}/${start}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllLoansForRecoveryAnalysisBySingleAgent(source) {
        return this.http.get(`${AppConstant.API_BASE}creditoperations/loan-operation/recovery-assignment-by-single-agents/${source}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLineReviewDataSearch(serachString) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-line-review-search/${serachString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedOverDraftReviewApplicationSearch(searhString) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-overdraft-review-application-search/${searhString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedLoanReviewSearch(searhString) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-loan-review-search/${searhString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getApprovedContingentApplicationSearch(searhString) {
        return this.http
            .get(`${AppConstant.API_BASE}creditoperations/approved-contingent-application-search/${searhString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

}