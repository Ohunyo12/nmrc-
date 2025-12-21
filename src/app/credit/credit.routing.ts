import { CrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/crms-regulatory.component';
import { LoanReviewOperationsComponent } from './loan-management/loan-operations/loan-review-operation.component';
import { LoanFeeConcessionComponent } from './loans/loan-fee-concession/loan-fee-concession.component';
import { DefferalManagementComponent } from './loans/defferal-management/defferal-management.component';
import { ConditionChecklistComponent } from './loans/loan-checklist/condition-checklist.component';
import { SlaMonitoringComponent } from './sla/sla-monitoring.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../admin/guard/authentication.guard';
import {
    GuarantorMaintenanceComponent,
    // LoanApplicationReviewComponent,
    RejectedApplicationComponent,
    OverrideComponent,
    ProductFeeConcessionComponent,
    CreditBureauSearchComponent,
    ConvenantMaintenanceComponent,
    LoanChecklistComponent,
    LoanOperationsComponent,
    CallMemoComponent,
    ScheduleViewComponent,
    CreditAppraisalComponent,
    SheduleComponent,
    CovenantDetailComponent,
    RiskAssessmentComponent,
    CollateralReleaseComponent,
    CollateralAssignmentComponent,
    StartLoanApplicationComponent,
    PreliminaryEvaluationComponent,
    LoanBookingComponent,
    InitiateLoanBookingComponent,
    OfferLetterGenerationComponent,
    PreliminaryEvaluationViewComponent,
    JobRequestComponent,
    JobRequestViewComponent,
    CreditJobRequestComponent,
    LoanAvailmentComponent,
    BondsAndGuaranteeComponent,
    BulkRateReviewComponent,
    LoanRestructuringComponent,
    LoanApplicationSearchComponent,
    LoanReviewApplicationComponent,
    LoanReviewAppraisalComponent,
    LoanReviewOfferLetterComponent,
    LoanReviewAvailmentComponent,
    LegalJobRequestConfirmation,
    ExistingFacilitiesComponent,
    FacilityJobRequestComponent, DrawdownComponent
} from './components';

import {ProjectSiteReportComponent} from './project-site-report/project-site-report.component';
import { OfferLetterGenererationReviewComponent } from './components';
import { CollateralInformationViewComponent, CollateralSwapComponent ,CollateralInformationComponent} from './collateral';
import { CustomerProductFeeComponent, CPTenorExtensionComponent, CPInterestRateReviewComponent, CPRepaymentComponent, CPSubAllocationComponent, CPPrepaymentComponent } from './loan-management';
import { FacilityDetailsComponent } from './components';
import { LoanApplicationsListComponent } from './components';
import { LoanEligibilityRequirementsComponent } from './components';
import { LoanApplicationCollateralInformationComponent } from './components';
import { SecretariatComponent } from './loans/secretariat/secretariat.component';
import { CollateralMappingComponent, CollateralCreationComponent } from './components';
import { LoanRecoveryPaymentPlanComponent } from './loan-management/loanrecovery-paymentplan/loanrecoverypaymentplan.component';
import { LoanApplicationDetailsComponent } from './loans/application/loan-application-details.component';
import { LimitExposureComponent } from './loans/application/limits/limit-exposure.component';
import { FirstTraderComponent } from './loans/application/facility-details/extentions/first-trader.component';
import { EducationLoanComponent } from './loans/application/facility-details/extentions/education-loan.component';
import { BondGurantyComponent } from './loans/application/facility-details/extentions/bond-guranty.component';
import { LoanPrepaymentComponent } from './loan-management/loan-prepayment/loanprepayment.component';
import { OverdraftOperationsComponent } from './loan-management/overdraft-operations/overdraft-operations.component';
import { ContingentUsageListComponent } from './loans/contingent-usage/contingent-usage-list.component';
import { ContingentUsageComponent } from './loans/contingent-usage/contingent-usage.component';
import { ReassignAccountComponent } from './loan-management/reassignaccount/reassignaccount.component';
import { MaturityInstructionComponent } from './loan-management/commercial-loans/maturity-instruction.component';
import { CPRolloverComponent } from './loan-management/commercial-loans/cp-rollover.component';
import { ProductFeesComponent } from './loans/application/facility-details/productfees.component';
import { RemedialOpreationComponent } from './loan-management/remedial-opreation/remedial-opreation.component';
import { ContingentOpreationComponent } from './loan-management/contingent-operations/contingent-operations.component';
import { LoanPerformanceComponent } from './loan-management/loan-performance/loan-performance.component';
import { LoanFeeAdjustmentComponent } from './loan-management/loan-fee-adjustment/loan-fee-adjustment.component';
import { LoanCamsolComponent } from './loan-management/loan-camsol/loan-camsol.component';
import { ChildSectorLimitComponent } from './loans/application/limits/sector-limit.component';
import { MapComponent } from './map/map.component';
import { FacilityDetailSummaryComponent } from './loans/facility-detail-summary/facility-detail-summary.component';
import { FXRevolvingLoanPaymentComponent } from './loan-management/fx-loan-payment/fx-revolving-loan-payment.component';
import { CommercialLoanReviewOperationsComponent } from './loan-management/commercial-loan-operations/commercial-loan-operations.component';
import { FXRevolvingLoanReviewOperationsComponent } from './loan-management/fx-revolving-loan-operations/fx-revolving-loan-operation.component';
import { LoanReviewApplicationSearchComponent } from 'app/credit/loan-management/loan-review-application-search/loan-review-application-search.component';
//import { CrmsRegulatoryComponent } from './loans/crms-regulatory/crms-regulatory.component';
import { LMSCrmsRegulatoryComponent } from './loans/crms-regulatory/lms-crms-regulatory.component';

import { TrancheFacilityUtilizationComponent } from './loans/facility-details/tranche-facility-utilization.component';
import { FacilityLineReviewOperationsComponent } from './loan-management/facility-line-operations/line-operation.component';
import { ExistingCamsolComponent } from './shared/existing-camsol/existing-camsol.component';
import {ChecklistItemSimulationComponent} from './loans/checklist-item-simulation/checklist-item-simulation.component'
import { CompletedLoanConfirmationComponent } from './loans/completed-loan-confirmation/completed-loan-confirmation.component';
import { TakeFeeComponent } from './loan-management/take-fee/take-fee.component';
import { GlobalInterestRateChangeComponent } from './loan-management/global-interest-rate-change/global-interest-rate-change.component';
import { ContingentLiabilityTreminateRebookComponent } from './loan-management/contingent-liability-terminate-rebook/contingent-liability-terminate-rebook.component';
import { CancelContingentLiabilityComponent } from './loan-management/cancel-contingent-liability/cancel-contingent-liability.component';
import { ContingentTerminationComponent } from './loan-management/contingent-termination/contingent-termination.component';
import { LoanCrmsUpdateComponent } from './loans/booking/loan-crms-update.component';
import { ContingentFacilityReleaseComponent } from './loans/booking/contingent-release.component';
//import { AvailmentRouteComponent } from 'app/credit/routes/availment-route.component';
import { CollateralInformationReleaseComponent } from './collateral/information/collateral-information-release.component';
import { CollateralReleaseAwaitingJobRequestComponent } from './collateral/information/collateral-release-awaiting-job-request.component';
import { CollateralReleaseListComponent } from './collateral/information/collateral-release-list.component';
import { FullAndFinalStatusChangeComponent } from './loan-management/full-and-final-status-change/full-and-final-status-change.component';
import { TermSheetComponent } from './term-sheet/term-sheet.component';
import { DocumentUsageComponent } from 'app/shared/components/document-upload/document-usage.component';
import { DisbursedLoansComponent } from './loans/disbursed-loans/disbursed-loans.component';
//import { LoanFeeScheduleComponent } from './loan-management/loan-fee-schedule/loan-fee-schedule.component';
import { OriginalDocumentSubmissionComponent } from './original-document-submission/original-document-submission.component';
import { LcIssuanceComponent } from './letter-of-credit/lc-issuance/lc-issuance.component';
import { AtcLodgmentComponent } from './atc-lodgment/atc-lodgment.component';
import { AtcReleaseComponent } from './atc-release/atc-release.component';
import { ReleaseOfShippingDocumentsComponent } from './letter-of-credit/release-of-shipping-documents/release-of-shipping-documents.component';
import { LcIssuanceApprovalComponent } from './letter-of-credit/lc-issuance-approval/lc-issuance-approval.component';
import { ReleaseOfShippingDocumentsApprovalComponent } from './letter-of-credit/release-of-shipping-documents-approval/release-of-shipping-documents-approval.component';
import { LcSearchComponent } from './letter-of-credit/lc-search/lc-search.component';
import { LcUssanceApprovalComponent } from './letter-of-credit/lc-ussance-approval/lc-ussance-approval.component';
import { LcUssanceComponent } from './letter-of-credit/lc-ussance/lc-ussance.component';
import { LetterGenerationRequestComponent } from './letter-generation-request/letter-generation-request.component';
import { CollateralValuationComponent } from './collateral/collateral-valuation/collateral-valuation.component';
import {CollateralInsuranceRequestComponent} from './collateral/collateral-insurance-request/collateral-insurance-request.component';
import { SecurityReleaseComponent } from './security-release/security-release.component';
import { DisbursementUploadComponent } from './loans/booking/disbursement-upload.component';
import { CreditLetterGenerationCompletedComponent } from './credit-letter-generation-completed/credit-letter-generation-completed.component';
import { CollateralInsuranceSearchComponent } from './collateral/collateral-insurance-search/collateral-insurance-search.component';
import { LoanRecoveryPaymentComponent } from './loan-management/loan-recovery-payment/loan-recovery-payment.component';
import { LoanTerminationComponent } from './loan-management/loan-termination/loantermination.component';
import { OperationRouteComponent } from './routes/operation-route.component';
//import { BulkLoanPrepaymentReversalComponent } from './loan-management/loan-prepayment-reversal/bulk-loanprepaymentreversal.component';
//import { BulkPrepaymentLoanComponent } from './loan-management/loan-prepayment-reversal/bulk-prepayment-loan.component';
import { LoanPrepaymentReversalComponent } from './loan-management/loan-prepayment-reversals/loanprepaymentreversal.component';
import { BulkLoanPrepaymentReversalComponent } from './loan-management/bulk-loanprepaymentreversal/bulk-loanprepaymentreversal.component';
import { BulkPrepaymentLoanComponent } from './loan-management/bulk-prepayment-loan/bulk-prepayment-loan.component';
import { LoanReviewApplicationRejectedComponent } from './loan-management/loan-review-application-rejected/loan-review-application-rejected.component';
import { LcIssuanceCancelationApprovalComponent } from './letter-of-credit/lc-issuance-cancelation-approval/lc-issuance-cancelation-approval.component';
import { DrawDownApplicationStatusComponent } from './draw-down-application-status/draw-down-application-status.component';
import { LcEnhancementApprovalComponent } from './letter-of-credit/lc-enhancement-approval/lc-enhancement-approval.component';
import { LcEnhancementComponent } from './letter-of-credit/lc-enhancement/lc-enhancement.component';
import { CreditDocumentationComponent } from './loans/credit-documentation/credit-documentation.component';
import { ModifyFacilityComponent } from './modify-facility/modify-facility.component';
import { AppraisalPoolComponent } from './credit-appraisal/appraisal-pool.component';
import { AccreditedConsultantListComponent } from './loan-management/accredited-consultant-list/accredited-consultant-list.component';
import { AssignLoanToAgentComponent } from './loan-management/assign-loan-to-agent/assign-loan-to-agent.component';
import { CaptureLiquidationReceiptComponent } from './loan-management/capture-liquidation-receipt/capture-liquidation-receipt.component';
import { WriteOffLoansComponent } from './loan-management/write-off-loans/write-off-loans.component';
import { UnfreezeOverdraftLienComponent } from './loan-management/unfreeze-overdraft-lien/unfreeze-overdraft-lien.component';
import { LienCustomerAccountComponent } from './loans/lien-customer-account/lien-customer-account.component';
import { ProjectSiteReportAccountOfficerComponent } from './project-site-report-account-officer/project-site-report-account-officer.component';
import { CreditDocumentationLosComponent } from './loans/credit-documentation-los/credit-documentation-los.component';
import { LcCancelationComponent } from './letter-of-credit/lc-cancelation/lc-cancelation.component';
import { LcSearchLmsComponent } from './letter-of-credit/lc-search-lms/lc-search-lms.component';
import { ModifyLmsApplicationComponent } from './loans/modify-lms-application/modify-lms-application.component';
import { RecoveryReportingComponent } from './loan-management/recovery-reporting/recovery-reporting.component';
import { RecoveryCommissionComponent } from './loan-management/recovery-commission/recovery-commission.component';
import { LoanCrmsUpdateLmsComponent } from './loans/booking/loan-crms-update-lms/loan-crms-update-lms.component';
import { ConsumerProtectionComponent } from './consumer-protection/consumer-protection.component';
import { RelatedEmployerComponent } from 'app/setup/components/related-employer/related-employer.component';
import { AssignLoanToAgentRetailComponent } from './loan-management/assign-loan-to-agent-retail/assign-loan-to-agent-retail.component';
import { ListOfAssignedRetailLoansComponent } from './loan-management/list-of-assigned-retail-loans/list-of-assigned-retail-loans.component';
import { RecoveryReportingRetailComponent } from './loan-management/recovery-reporting-retail/recovery-reporting-retail.component';
import { RecoveryCommissionRetailComponent } from './loan-management/recovery-commission-retail/recovery-commission-retail.component';
import { LcExtensionApprovalComponent } from './letter-of-credit/lc-extension-approval/lc-extension-approval.component';
import { LcExtensionComponent } from './letter-of-credit/lc-extension/lc-extension.component';
import { LcUssanceExtensionComponent } from './letter-of-credit/lc-ussance-extension/lc-ussance-extension.component';
import { LcUssanceExtensionApprovalComponent } from './letter-of-credit/lc-ussance-extension-approval/lc-ussance-extension-approval.component';
import { ListOfAssignedRemedialLoansComponent } from './loan-management/list-of-assigned-remedial-loans/list-of-assigned-remedial-loans.component';
import { CollateralValuationSearchComponent } from './collateral/collateral-valuation-search/collateral-valuation-search.component';
import { RecoveryReportCollectionComponent } from './loan-management/recovery-report-collection/recovery-report-collection.component';
import { RecoveryCommissionInternalComponent } from './loan-management/recovery-commission-internal/recovery-commission-internal.component';
import { RecoveryAssignmentListInternalAgentsComponent } from './loan-management/recovery-assignment-list-internal-agents/recovery-assignment-list-internal-agents.component';
import { ExternalUrlComponent } from 'app/admin/components/external-url/external-url.component';
import { ExternalLinkDirectiveComponent } from './loan-management/external-link-directive/external-link-directive.component';
import { CollateralSwapSearchComponent } from './collateral/swap/collateral-swap-search/collateral-swap-search.component';
import { SecurityReleaseSearchComponent } from './security-release-search/security-release-search.component';
import { OriginalDocumentSubmissionSearchComponent } from './original-document-submission-search/original-document-submission-search.component';
import { LoanReviewContingentApplicationSearchComponent } from './loan-management/loan-review-contingent-application-search/loan-review-contingent-application-search.component';
import { CashSecurityReleaseComponent } from './cash-security-release/cash-security-release.component';
import { CashSecurityReleaseSearchComponent } from './cash-security-release-search/cash-security-release-search.component';
import { LmsCompletedCreditDocumentationComponent } from './loans/lms-completed-credit-documentation/lms-completed-credit-documentation.component';
import { LosCompletedCreditDocumentationComponent } from './loans/los-completed-credit-documentation/los-completed-credit-documentation.component';
import { LienSearchComponent } from './loans/lien-search/lien-search.component';
import { InsuranceUploadComponent } from './insurance-upload/insurance-upload.component';
import { RejectedInsuranceUploadComponent } from './rejected-insurance-upload/rejected-insurance-upload.component';
import { FsCaptionUploadComponent } from './loans/application/fs-caption-upload/fs-caption-upload.component';
import { OperationEndDocumentationComponent } from './loans/application/operation-end-documentation/operation-end-documentation.component';
import { StampDutyClosureComponent } from './stamp-duty-closure/stamp-duty-closure.component';
import { ContinuousDocumentationComponent } from './loans/application/continuous-documentation/continuous-documentation.component';
import { LoanRefinancingComponent } from './loans/loan-refinancing/loan-refinancing.component';
import { UnderwritingObligorComponent } from 'app/credit/loan-management/underwriting-obligor/underwriting-obligor.component';
import { PmbRefinancedLoanApprovalComponent } from 'app/credit/loan-management/pmb-refinanced-loan-approval/pmb-refinanced-loan-approval.component';
import { RefinancingLoanReviewComponent } from 'app/credit/loan-management/refinancing-loan-review/refinancing-loan-review.component';
import { LenderRiskAssessmentComponent } from 'app/credit/loan-management/lender-risk-assessment/lender-risk-assessment.component';
import { PendingRefinancingComponent } from 'app/credit/loan-management/pending-refinancing/pending-refinancing.component';
import { RefinanceLoanDisbursementComponent } from './loan-management/refinance-loan-disbursement/refinance-loan-disbursement.component';
import { NmrcLoanBookingComponent } from './loan-management/nmrc-loan-booking/nmrc-loan-booking.component';
import { NmrcLoanDisbursementComponent } from './loan-management/nmrc-loan-disbursement/nmrc-loan-disbursement.component';
import { NmrcLoanRestructuringComponent } from './loan-management/nmrc-loan-restructuring/nmrc-loan-restructuring.component';
import { LoanRefinancing2Component } from './loan-management/loan-refinancing2/loan-refinancing2.component';
// import { AdhocApprovalComponent } from './adhoc-approval/adhoc-approval.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { 
                path: 'loan-covenant/covenant-detail', component: CovenantDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['covenant maintenance'] }
            },
            {
                path: 'collateral/collateral-information', component: CollateralInformationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            },
            {
                path: 'collateral/collateral-swap', component: CollateralSwapComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral swap'] } 
            },
            {
                path: 'collateral/collateral-swap-search', component: CollateralSwapSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral swap', 'collateral swap approval'] } 
            },
            {
                path: 'collateral/collateral-information-release', component: CollateralInformationReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            }, 
            {
                path: 'collateral/collateral-release-awaiting-job-request', component: CollateralReleaseAwaitingJobRequestComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            },   
            {
                path: 'collateral/collateral-release-list/:collateralId', component: CollateralReleaseListComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            },                    
            {
                path: 'collateral/information/collateral-information-view', component: CollateralInformationViewComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'collateral/collateral-release', component: CollateralReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            { // duplicate url
                path: 'collateral/collateral-assignment', component: CollateralAssignmentComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral assignment'] }
            },
            { // duplicate url
                path: 'collateral/collateral-assignment', component: CollateralMappingComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral assignment'] }
            },
            {
                path: 'loan/secretariat', component: SecretariatComponent, canActivate: [AuthGuard],
                data: { activities: ['committee secretariat'] }
            },
            {
                path: 'loan/application-search', component: LoanApplicationSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/continuous-documentation', component: ContinuousDocumentationComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/drawdown-search',  component: DrawDownApplicationStatusComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/rejected-application', component: RejectedApplicationComponent, canActivate: [AuthGuard],
                data: { activities: ['rejected applications'] }
            },
            {
                path: 'loan/full-and-final-status-change', component: FullAndFinalStatusChangeComponent, canActivate: [AuthGuard],
                data: { activities: ['full and final writeoff'] }
            },
            {
                path: 'loan-management/loan-review-operation', component: LoanReviewOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['loan operations'] }
            },
            {
                path: 'loan-management/loan-fee-adjustment', component: LoanFeeAdjustmentComponent, canActivate: [AuthGuard],
                data: { activities: ['loan operations'] }
            },
            
            {
                path: 'loan-management/loan-performance', component: LoanPerformanceComponent, canActivate: [AuthGuard],
                data: { activities: ['loan operations'] }
            }, 

            {
                path: 'loan-management/loan-refinancing2', component: LoanRefinancing2Component, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            }, 
            {
                path: 'loan-management/nmrc-loan-restructuring', component: NmrcLoanRestructuringComponent, canActivate: [AuthGuard],
                data: { activities: ['nmrc Restructuring'] }
            }, 

            {
                path: 'loan-management/nmrc-loan-booking', component: NmrcLoanBookingComponent, canActivate: [AuthGuard],
                data: { activities: ['nmrc loan booking'] }
            }, 
            {
                path: 'loan-management/nmrc-loan-disbursement', component: NmrcLoanDisbursementComponent, canActivate: [AuthGuard],
                data: { activities: ['nmrc loan booking'] }
            },
            {
                path: 'loan-management/loan-operations', component: LoanOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-management/commercial-loan-operations', component: CommercialLoanReviewOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan operations'] }
            },
            {
                path: 'loan-management/facility-line-operations', component: FacilityLineReviewOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['facility-line-operations'] }
            },
            {
                path: 'loan-management/bulk-loanprepaymentreversal', component: BulkLoanPrepaymentReversalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk liquidation'] }
            },
            {
                path: 'loan-management/bulk-prepayment-loan', component: BulkPrepaymentLoanComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk liquidation'] }
            },
            {
                path: 'loan-management/loan-prepayment-reversals', component: LoanPrepaymentReversalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk liquidation'] }
            },
            {
                path: 'loan-management/fx-revolving-loan-operations', component: FXRevolvingLoanReviewOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['fx revolving loan operations'] }
            },
            {
                path: 'loan-management/loan-operations/bulk-rate-review', component: BulkRateReviewComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-management/customer-fee-concession/customer-product-fee', component: CustomerProductFeeComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-management/LoanRecoveryPaymentPlan', component: LoanRecoveryPaymentPlanComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery payment plan'] }
            },
            {
                path: 'loan-management/loan-prepayment', component: LoanPrepaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['prepayment'] }
            },
            {
                path: 'loan-management/loan-termination', component: LoanTerminationComponent, canActivate: [AuthGuard],
                data: { activities: ['termination'] }
            },
            {
                path: 'loan-management/fx-loan-payment', component: FXRevolvingLoanPaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['fx loan payment'] }
            },
            {
                path: 'loan-management/overdraft-operations', component: OverdraftOperationsComponent, canActivate: [AuthGuard],
                data: { activities: ['overdraft operations'] }
            },
            {
                path: 'loan-management/remedial-opreation', component: RemedialOpreationComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations'] }
            },
            {
                path: 'loan-management/app-loan-recovery-payment', component: LoanRecoveryPaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations'] }
            },

            // ================================================== here =======================
            {
                path: 'loan-management/accredited-consultant-list', component: AccreditedConsultantListComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations'] }
            },

            {
                path: 'loan-management/assign-loan-to-agent', component: AssignLoanToAgentComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },
            {
                path: 'loan-management/list-of-assigned-remedial-loans', component: ListOfAssignedRemedialLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },
            
            {
                path: 'loan-management/capture-liquidation-receipt', component: CaptureLiquidationReceiptComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },
            {
                path: 'loan-management/recovery-reporting', component: RecoveryReportingComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },
            {
                path: 'loan-management/recovery-commission', component: RecoveryCommissionComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },
            {
                path: 'loan-management/write-off-loans', component: WriteOffLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations remedial'] } 
            },

            //==========================================retail collection ====================

            {
                path: 'loan-management/assign-loan-to-agent-retail', component: AssignLoanToAgentRetailComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/list-of-assigned-retail-loans', component: ListOfAssignedRetailLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/recovery-reporting-retail', component: RecoveryReportingRetailComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/recovery-commission-retail', component: RecoveryCommissionRetailComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/recovery-report-collection', component: RecoveryReportCollectionComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/recovery-commission-internal', component: RecoveryCommissionInternalComponent, canActivate: [AuthGuard],
                data: { activities: ['recovery operations retail'] } 
            },
            {
                path: 'loan-management/recovery-assignment-list-internal-agents', component: RecoveryAssignmentListInternalAgentsComponent, canActivate: [AuthGuard],
                data: { activities: ['internal assigned recoveries'] } 
            },

            //==========================================

            {
                path: 'loan-management/external-link-directive', component: ExternalLinkDirectiveComponent, canActivate: [AuthGuard],
                data: { activities: ['external link'] } 
            },

            {
                path: 'loan-management/contingent-operations', component: ContingentOpreationComponent, canActivate: [AuthGuard],
                data: { activities: ['contingent operations'] }
            },
            {
                path: 'loan-management/contingent-termination', component: ContingentTerminationComponent, canActivate: [AuthGuard],
                data: { activities: ['contingent operations'] }
            },           
            {
                path: 'loan-management/contingent-liability-terminate-rebook', component: ContingentLiabilityTreminateRebookComponent, canActivate: [AuthGuard],
                data: { activities: ['contingent operations'] }
            },
            {
                path: 'loan-management/cancel-contingent-liability', component: CancelContingentLiabilityComponent, canActivate: [AuthGuard],
                data: { activities: ['contingent operations'] }
            },
            {
                path: 'loan-management/loan-operations/loan-restructuring', component: LoanRestructuringComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'risk/loan-camsol', component: LoanCamsolComponent, canActivate: [AuthGuard],
                data: { activities: ['risk assessment'] }
            },
            {
                path: 'newloan/application', component: LoanApplicationDetailsComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
             {
                path: 'newloan/crms', component: CrmsRegulatoryComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
             {
                path: 'newloan/lms-crms', component: LMSCrmsRegulatoryComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'newloan/application/:applicationId', component: LoanApplicationDetailsComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/facility-details', component: FacilityDetailsComponent,
                canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/document-Search', component: DocumentUsageComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/disbursed-loans', component: DisbursedLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['loan disbursment'] }
            },
            {
                path: 'loan/modify-facility', component: ModifyFacilityComponent, canActivate: [AuthGuard],
                data: { activities: ['Modify Facility','Reassign Loan'] }
            },
            // {
            //     path: 'loan/deferred-loan-fee', component: DeferredLoanFeeComponent, canActivate: [AuthGuard],
            //     data: { activities: 
            //           [
            //             'start credit application',
            //             'credit applications',
            //             'credit appraisal',
            //             'booking request',
            //             'booking',
            //             'schedule simulation',
            //             'loan disbursment',
            //           ] }
            // },
            {
                path: 'loan/schedule', component: SheduleComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
             {
                path: 'loan/checklist-simulation', component: ChecklistItemSimulationComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
            {
                path: 'loan/facility-detail-summary', component: FacilityDetailSummaryComponent, canActivate: [AuthGuard],
                data: { activities: ['facility detail summary'] }
            },
            {
                path: 'loan/facility-detail-summary/:loanId/:productTypeId', component: FacilityDetailSummaryComponent, canActivate: [AuthGuard],
                data: { activities: ['facility detail summary'] }
            },
            {
                path: 'loan/underwriting-obligor', component: UnderwritingObligorComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/pmb-refinanced-loan-approval', component: PmbRefinancedLoanApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/pending-refinancing', component: PendingRefinancingComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },

            {
                path: 'loan/lender-risk-assessment', component: LenderRiskAssessmentComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/refinancing-loan-review', component: RefinancingLoanReviewComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/loan-review-application-search', component: LoanReviewApplicationSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] }
            },
            {
                path: 'loan/loan-review-contingent-application-search', component: LoanReviewContingentApplicationSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['contingent application search'] }
            },
            {
                path: 'loan/loan-review-application-rejected', component: LoanReviewApplicationRejectedComponent, canActivate: [AuthGuard],
                data: { activities: ['credit application status'] } 
            },
            {
                path: 'loan/schedule/view', component: ScheduleViewComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'risk/risk-assessment', component: RiskAssessmentComponent, canActivate: [AuthGuard],
                data: { activities: ['risk assessment'] }
            },
            {
                path: 'appraisal/credit-appraisal', component: CreditAppraisalComponent, canActivate: [AuthGuard],
                data: { activities: ['credit appraisal'] }
            },
            {
                path: 'appraisal/appraisal-pool', component: AppraisalPoolComponent, canActivate: [AuthGuard],
                data: { activities: ['credit appraisal'] }
            },
            {
                path: 'appraisal/operation-route', component: OperationRouteComponent, canActivate: [AuthGuard],
                data: { activities: ['operation route'] }
            },
            {
                path: 'appraisal/sla-monitoring', component: SlaMonitoringComponent, canActivate: [AuthGuard],
                data: { activities: ['application route'] }
            },
            {
                path: 'term-sheet', component: TermSheetComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/customer/credit-bureau-report', component: CreditBureauSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/application/start', component: StartLoanApplicationComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/application/start/:customerId', component: StartLoanApplicationComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'lc/search', component: LcSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Issuance', 'Release Of Shipping Documents','Lc Ussance',
                                    'Lc Issuance Approval',
                                    'Release Of Shipping Documents Approval',
                                    'Lc Ussance Approval',
                                    'security release'
                                        ] }
            },
            {
                path: 'lc/issuance', component: LcIssuanceComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Issuance'] }
            },
            {
                path: 'lc/release-shipping-documents', component: ReleaseOfShippingDocumentsComponent, canActivate: [AuthGuard],
                data: { activities: ['Release Of Shipping Documents'] }
            },
            {
                path: 'lc/ussance', component: LcUssanceComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Ussance'] }
            },
            {
                path: 'lc/cancelation', component: LcCancelationComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Cancellation'] }
            },
            {
                path: 'lc/search/lms', component: LcSearchLmsComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Cancellation',
                                    'Lc Enhancement',
                                    'Lc Enhancement Approval',
                                    'Lc Extension',
                                    'Lc Extension Approval',
                                    'Lc Cancellation Approval',
                                    'Lc Ussance Extension',
                                    'Lc Ussance Extension Approval'
                                    ] }
            },
            {
                path: 'lc/enhancement', component: LcEnhancementComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Enhancement'] }
            },
            { 
                path: 'lc/enhancement-approval', component: LcEnhancementApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Enhancement Approval'] }
            },
            {
                path: 'lc/extension', component: LcExtensionComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Extension'] }
            },
            { 
                path: 'lc/extension-approval', component: LcExtensionApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Extension Approval'] }
            },
            { 
                path: 'lc/ussance-extension', component: LcUssanceExtensionComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Ussance Extension'] }
            },
            { 
                path: 'lc/ussance-extension-approval', component: LcUssanceExtensionApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Ussance Extension Approval'] }
            },
            { 
                path: 'lc/issuance-approval', component: LcIssuanceApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Issuance Approval'] }
            },
            {
                path: 'lc/release-approval', component: ReleaseOfShippingDocumentsApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Release Of Shipping Documents Approval'] } 
            },
            {
                path: 'lc/ussance-approval', component: LcUssanceApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Ussance Approval'] }
            },
            {
                path: 'lc/cancelation-approval', component: LcIssuanceCancelationApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Lc Cancellation Approval'] }
            },
            {
                path: 'letter-generation-request', component: LetterGenerationRequestComponent, canActivate: [AuthGuard],
                data: { activities: ['Letter Generation Request'] }
            },
            {
                path: 'letter-generation-completed', component: CreditLetterGenerationCompletedComponent, canActivate: [AuthGuard],
                data: { activities: ['Letter Generation Printing', 'Letter Generation Request',
                                     'Letter Generation Request Approval'] }
            },
            {
                path: 'loan/application/condition-checklist', component: ConditionChecklistComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/application/fee-concession', component: LoanFeeConcessionComponent, canActivate: [AuthGuard],
                data: { activities: ['loan fee concessions'] }
            },
            {
                path: 'loan/application/deferral-management', component: DefferalManagementComponent, canActivate: [AuthGuard],
                data: { activities: ['deferral management'] }
            },
            {
                path: 'loan/application/consumer-protection', component: ConsumerProtectionComponent, canActivate: [AuthGuard],
                data: { activities: ['consumer protection'] }
            },
            {
                path: 'loan/application/related-employer', component: RelatedEmployerComponent, canActivate: [AuthGuard],
                data: { activities: ['related employer'] }
            },
            {
                path: 'loan/application/lien-customer-account', component: LienCustomerAccountComponent, canActivate: [AuthGuard],
                data: { activities: ['lien management'] }
            },
            {
                path: 'loan/application/lien-search', component: LienSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['lien management'] }
            },
            {
                path: 'loan-management/unfreeze-overdraft-lien', component: UnfreezeOverdraftLienComponent, canActivate: [AuthGuard],
                data: { activities: ['lien management'] }
            },

            {
                path: 'loan-management/refinance-loan-disbursement', component: RefinanceLoanDisbursementComponent, canActivate: [AuthGuard],
                data: { activities: ['nmrc Restructuring'] }
            },

            {
                path: 'loan/application/fs-caption-upload', component: FsCaptionUploadComponent, canActivate: [AuthGuard],
                data: { activities: ['fs caption upload'] }
            },
            {
                path: 'loan/application/credit-documentation', component: CreditDocumentationComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation lms'] }
            },
            {
                path: 'loan/application/lms-completed-credit-documentation', component: LmsCompletedCreditDocumentationComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation lms'] }
            },
            {
                path: 'loan/application/related-documentation', component: OperationEndDocumentationComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation'] }
            },
            {
                path: 'loan/application/credit-documentation-los', component: CreditDocumentationLosComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation los'] }
            },
            {
                path: 'loan/application/los-completed-credit-documentation', component: LosCompletedCreditDocumentationComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation los'] }
            },
            {
                path: 'loan/application/modify-lms-application', component: ModifyLmsApplicationComponent, canActivate: [AuthGuard],
                data: { activities: ['modify lms application'] }
            },
            
            // {
            //     path: 'loan/preliminary-evaluation', component: PreliminaryEvaluationComponent, canActivate: [AuthGuard],
            //     data: { activities: ['preliminary evaluation notes'] }
            // },
            // {
            //     path: 'loan/booking/initiate-booking', component: InitiateLoanBookingComponent, canActivate: [AuthGuard],
            //     data: { activities: ['booking request'] }
            // },
            {
                path: 'loan/booking/initiate-booking', component: DrawdownComponent, canActivate: [AuthGuard],
                data: { activities: ['booking request'] }
            },
            {
                path: 'loan/booking/multiple-disbursement', component: DisbursementUploadComponent, canActivate: [AuthGuard],
                data: { activities: ['booking request'] }
            },
            {
                path: 'insurance-upload', component: InsuranceUploadComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk insurance upload'] }
            },
            {
                path: 'rejected-insurance-upload', component: RejectedInsuranceUploadComponent, canActivate: [AuthGuard],
                data: { activities: ['rejected bulk insurance upload'] }
            },
            {
                path: 'loan/booking', component: LoanBookingComponent, canActivate: [AuthGuard],
                data: { activities: ['booking'] }
            },             {
                path: 'loan/loan-crms-update', component: LoanCrmsUpdateComponent, canActivate: [AuthGuard],
                data: { activities: ['crms-user'] }
            }, 
            {
                path: 'loan/contingent', component: ContingentFacilityReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['bonds and guarantee'] }
            },
            {
                path: 'loan/loan-maintenance/convenant-maintenance', component: ConvenantMaintenanceComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/loan-maintenance/guarantor-maintenance', component: GuarantorMaintenanceComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/call-memo', component: CallMemoComponent, canActivate: [AuthGuard],
                data: { activities: ['call memo'] }
            },
            {
                path: 'loan/offer-letter', component: OfferLetterGenerationComponent, canActivate: [AuthGuard],
                data: { activities: ['generate offer letter'] }
            },
            // {
            //     path: 'loan/preliminary-evaluation/view', component: PreliminaryEvaluationViewComponent, canActivate: [AuthGuard],
            //     data: { activities: ['preliminary evaluation notes'] }
            // },
            {
                path: 'job-request-view', component: JobRequestViewComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit-job-request', component: CreditJobRequestComponent, canActivate: [AuthGuard],
                data: { activities: ['job request status'] }
            },
            {
                path: 'legal-job-request-confirmation', component: LegalJobRequestConfirmation, canActivate: [AuthGuard],
                data: { activities: ['confirm collateral search'] }
            },
            {
                path: 'facility-job-request', component: FacilityJobRequestComponent, canActivate: [AuthGuard],
                data: { activities: ['confirm collateral search'] }
            },
            {
                path: 'loan/availment', component: LoanAvailmentComponent, canActivate: [AuthGuard],
                data: { activities: ['availment'] }
            },
            {
                path: 'loan/bonds-and-guarantee', component: BondsAndGuaranteeComponent, canActivate: [AuthGuard],
                data: { activities: ['bonds and guarantee'] }
            },
            {
                path: 'loan/offer-letter-review', component: OfferLetterGenererationReviewComponent, canActivate: [AuthGuard],
                data: { activities: ['review offer letter'] }
            },
            {
                path: 'loan/loan-application-list', component: LoanApplicationsListComponent, canActivate: [AuthGuard],
                data: { activities: ['credit applications'] }
            },
            {
                path: 'loan/loan-eligibility-requirement/:applicationId', component: LoanEligibilityRequirementsComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/loan-eligibility-requirement/:applicationId/:customerId', component: LoanEligibilityRequirementsComponent, canActivate: [AuthGuard],
                data: { activities: ['start credit application'] }
            },
            {
                path: 'loan/loan-collateral-infomation/:customerId', component: LoanApplicationCollateralInformationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            },
            {
                path: 'loan/loan-collateral-infomation/:customerId/:applicationId', component: LoanApplicationCollateralInformationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral information'] }
            },
            {
                path: 'loan/collateral-application-mapping', component: CollateralMappingComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/override', component: OverrideComponent, canActivate: [AuthGuard],
                data: { activities: ['override request'] }
            },
            {
                path: 'project-site-report', component: ProjectSiteReportComponent, canActivate: [AuthGuard],
                data: { activities: ['Project Site Report'] }
            },
            {
                path: 'project-site-report-account-officer', component: ProjectSiteReportAccountOfficerComponent, canActivate: [AuthGuard],
                data: { activities: ['approved project site report'] }
            },
            {
                path: 'loan/fees-concession', component: ProductFeeConcessionComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-review-approval/application', component: LoanReviewApplicationComponent, canActivate: [AuthGuard],
                data: { activities: ['lms application'] }
            },
                        {
                path: 'loan-management/take-fee', component: TakeFeeComponent, canActivate: [AuthGuard],
                data: { activities: ['manual fee'] }
            },
            {
                path: 'loan-review-approval/appraisal', component: LoanReviewAppraisalComponent, canActivate: [AuthGuard],
                data: { activities: ['lms appraisal'] }
            },
            
            {
                path: 'loan-review-approval/offer-letter', component: LoanReviewOfferLetterComponent, canActivate: [AuthGuard],
                data: { activities: ['lms generate offer letter'] }
            },
            {
                path: 'loan-review-approval/availment', component: LoanReviewAvailmentComponent, canActivate: [AuthGuard],
                data: { activities: ['lms availment'] }
            },
            {
                path: 'loan-review-approval/lms-crms-update', component: LoanCrmsUpdateLmsComponent, canActivate: [AuthGuard],
                data: { activities: ['lms availment'] }
            },
            {
                path: 'loan/contingent-usage-list', component: ContingentUsageListComponent, canActivate: [AuthGuard],
                data: { activities: ['aps request'] }
            },
            // {
            //     path: 'maps', loadChildren: './map/map.module#MapModule',
            //     data: { activities: ['NOT_IMPLEMENTED'] }
            // }, 
            {
                path: 'loan/map', component: MapComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
            {
                path: 'loan/map/:lat/:log', component: MapComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
            {
                path: 'loan/reassign-account', component: ReassignAccountComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-management/commercial-loans/maturity-instruction', component: MaturityInstructionComponent, canActivate: [AuthGuard],
                data: { activities: ['maturity instruction'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-rollover', component: CPRolloverComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan rollover'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-tenor-extension', component: CPTenorExtensionComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan tenor extension'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-interest-rate-review', component: CPInterestRateReviewComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan rate review'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-sub-allocation', component: CPSubAllocationComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan sub-allocation'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-prepayment', component: CPPrepaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['commercial loan prepayment'] }
            },
            {
                path: 'loan-management/commercial-loans/cp-repayment', component: CPRepaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['credit classification'] }
            },
            {
                path: '#', component: MaturityInstructionComponent, canActivate: [AuthGuard],
                data: { activities: ['fee charge change'] }
            }, 
            {
                path: 'loan/facility-details/tranche-facility-utilization', component: TrancheFacilityUtilizationComponent, canActivate: [AuthGuard],
                data: { activities: ['booking request'] }
            },
            {
                path: 'loan/completed-loan-confirmation', component: CompletedLoanConfirmationComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
            {
                path: 'loan/completed-loan-confirmation', component: CompletedLoanConfirmationComponent, canActivate: [AuthGuard],
                data: { activities: ['schedule simulation'] }
            },
            {
                path: 'loan-management/global-interest-rate-change', component: GlobalInterestRateChangeComponent, canActivate: [AuthGuard],
                data: { activities: ['global interest rate change'] }
            },
            // {
            //     path: 'loan-management/bulk-loanprepaymentreversal', component: BulkLoanPrepaymentReversalComponent, canActivate: [AuthGuard],
            //     data: { activities: ['bulk liquidation'] }
            // },
            {
                path: 'loan/original-document-submission', component: OriginalDocumentSubmissionComponent, canActivate: [AuthGuard],
                data: { activities: ['Original Document'] }
            },
            {
                path: 'original-document-submission-search', component: OriginalDocumentSubmissionSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['original document search'] }
            },
            {
                path: 'loan/atc-lodgment', component: AtcLodgmentComponent, canActivate: [AuthGuard],
                data: { activities: ['ATC Lodgement'] }
            },
            {
                path: 'loan/loan-refinancing', component: LoanRefinancingComponent, canActivate: [AuthGuard],
                data: { activities: ['ATC Lodgement'] }
            },
            {
                path: 'loan/atc-release', component: AtcReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['ATC Release'] }
            },
            {
                path: 'loan/stamp-duty-closure', component: StampDutyClosureComponent, canActivate: [AuthGuard],
                data: { activities: ['stamp duty closure'] }
            },
            {
                path: 'loan/collateral-valuation', component: CollateralValuationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral valuation'] }
            },
            {
                path: 'loan/collateral-valuation-search', component: CollateralValuationSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral valuation search'] }
            },
            {
                path: 'loan/collateral-insurance-request', component: CollateralInsuranceRequestComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral insurance request'] }
            },
            {
                path: 'loan/security-release', component: SecurityReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['security release'] }
            },
            {
                path: 'loan/cash-security-release', component: CashSecurityReleaseComponent, canActivate: [AuthGuard],
                data: { activities: ['security release'] }
            },
            {
                path: 'security-release-search', component: SecurityReleaseSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['security release search'] }
            },
            {
                path: 'cash-security-release-search', component: CashSecurityReleaseSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['security release search'] }
            },
            {
                path: 'loan/collateral-insurance-search', component: CollateralInsuranceSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral insurance request',
                                    'collateral policy approval'] }
            }
            // {
            //     path: 'loan/map', component: MapComponent, canActivate: [AuthGuard]
            // }
            // {
            //     path: 'existingfacilities', component: ExistingFacilitiesComponent, canActivate: [AuthGuard],
            //     data: { activities: ['users', 'admin', 'loan origination'] }
            // },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreditRoutingModule { }

export const routedComponents = [
    CovenantDetailComponent, CollateralInformationComponent, ExistingFacilitiesComponent,
    ExistingCamsolComponent,CollateralInformationReleaseComponent,
    SheduleComponent, RiskAssessmentComponent, CollateralReleaseComponent,
    CollateralAssignmentComponent, CreditAppraisalComponent, ScheduleViewComponent, PreliminaryEvaluationComponent,
    LoanBookingComponent, OfferLetterGenerationComponent, PreliminaryEvaluationViewComponent, RejectedApplicationComponent,
    JobRequestComponent, JobRequestViewComponent, CreditJobRequestComponent, LoanAvailmentComponent, LoanApplicationSearchComponent,
    OfferLetterGenererationReviewComponent, LoanOperationsComponent, BulkRateReviewComponent, SecretariatComponent,
    CollateralCreationComponent, InitiateLoanBookingComponent, SlaMonitoringComponent, BondsAndGuaranteeComponent,
    CustomerProductFeeComponent, OverrideComponent, ProductFeeConcessionComponent,
    LoanReviewApplicationComponent,
    TakeFeeComponent,
    LoanReviewAppraisalComponent,
    LoanReviewOfferLetterComponent,
    LoanReviewAvailmentComponent,
    LoanApplicationDetailsComponent,
    LimitExposureComponent, FirstTraderComponent,
    EducationLoanComponent,
    BondGurantyComponent, ContingentUsageListComponent, ContingentUsageComponent,

    ReassignAccountComponent, ProductFeesComponent, MapComponent

];

/**
            {
                path: '#', component: MaturityInstructionComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
 */