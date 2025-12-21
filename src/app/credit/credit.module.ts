import { CrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/crms-regulatory.component';
import { LoanReviewOperationsComponent } from './loan-management/loan-operations/loan-review-operation.component';
import { FeeConcessionService } from './services/fee-concession.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthHttp } from '../admin/services/token.service';
import { CreditRoutingModule } from './credit.routing';
import { BankingSharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    ButtonModule, DataTableModule, SharedModule, DialogModule, AccordionModule, ListboxModule,
    PanelModule, DropdownModule, CheckboxModule, TabViewModule, CalendarModule, EditorModule,
    SpinnerModule, InputMaskModule, PickListModule, FieldsetModule, AutoCompleteModule, GrowlModule, GMapModule,
} from 'primeng/primeng';
//import { CustomerInformationDetailComponent } from '../customer/components/index';
//import { CustomerInformationComponent } from '../customer/components/index';
import { ChecklistService } from '../setup/services/checklist.service';
// import { LoanBookingApprovalComponent } from './loans/approvals/loan-booking-approval.component';
import { LoanOperationService } from './services/loan-operations.service';
import { DepartmentService } from '../setup/services/department.service';
import { SlaMonitoringComponent } from './sla/sla-monitoring.component';
import { SecretariatComponent } from './loans/secretariat/secretariat.component';
import { DateUtilService } from '../shared/services/dateutils';
import { LoanService } from './services/loan.service';
import { JobService } from './services/job.service';
import { BulkRateService } from './services/bulkrate.service';
import { CurrencyService } from '../setup/services/currency.service';
import { BranchService } from '../setup/services/branch.service';
import { CurrencyMaskDirective } from '../shared/directives/formatmoney.directive';
import { CustomerRealTimeSearchService } from './services/customer-realtime-search.service';
import { CasaService } from '../customer/services/casa.service';
import { CustomerService } from '../customer/services/customer.service';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { AuthenticationService } from '../admin/services/authentication.service';
import { LoadingService } from '../shared/services/loading.service';
import { ExchangeRateService } from '../admin/services/exchange-rate.service';
// import { CollateralInformationViewComponent, CollateralInformationComponent } from './collateral';
import { CollateralAssignmentComponent, CollateralSwapComponent } from './collateral';
import { CollateralService } from '../setup/services/collateral.service';
import { LoanCovenantService } from '../setup/services/loan-covenant.service';
import { ValidationService } from '../shared/services/validation.service';
import { RiskIndexService } from '../setup/services/risk-index.service';
import { ProductService } from '../setup/services/product.service';
import { CountryStateService } from '../setup/services/state-country.service';
import { LedgerService } from '../setup/services/ledger.service';
import { DocumentService } from '../setup/services/document.service';

import { CreditAppraisalService } from './services/credit-appraisal.service';
import { RequestJobTypeService } from '../setup/services/request-job-type.service';
import { GeneralSetupService } from '../setup/services/general-setup.service';
import {
    CreditJobRequestComponent, ReplyRequestComponent,
    LegalJobRequestConfirmation, JobRequestViewComponent, FacilityJobRequestComponent
} from './job-request';
import {
    CustomerProductFeeComponent, MaturityInstructionComponent,
    CPRolloverComponent, CPTenorExtensionComponent,
    CPInterestRateReviewComponent, CPRepaymentComponent,
    CPPrepaymentComponent, CPSubAllocationComponent
} from './loan-management';
import { ProductFeeService } from '../setup/services/product-fee.service';
import { ConditionPrecedentService, AccreditedConsultantsService, StaffRoleService, MisInfoService, JobTitleService } from '../setup/services';
import { ReasignRequestComponent } from './job-request';
import { ExistingFacilitiesComponent } from './shared/existing-facility/existing-facilities.component';
import { LoanApplicationCovenantComponent } from './shared/covenant/loan-application-covenant.component';
import { CallMemoService } from '../setup/services/call-memo.service';
import { CustomerGroupService } from '../customer/services/customer-group.service';
import { CreditApprovalService } from './services/credit-approval.service';

//import { EndofdayComponent } from './loan-management/loan-operations/end-of-day.component';
// import { PreliminaryEvaluationApprovalComponent } from './loans/approvals/pen-approval.component';
// import { LoanRestructuringApprovalComponent } from './loans/approvals/loan-restructuring-approval.component';
import { ApprovalService } from '../setup/services/approval.service';

// import { CollateralAssignmentApprovalComponent } from './loan-management/approvals/collateral-assignment-approval.component';
// import { CollateralReleaseApprovalComponent } from './loan-management/approvals/collateral-release-approval.component';
import { ReportService } from '../reports/service/report.service';
import { CompanyService } from '../setup/services/company.service';
import { StaffRealTimeSearchService } from '../setup/services/staff-realtime-search.service';
import { CollateralCreationComponent,  EndofdayComponent, LoanApplicationCollateralInformationComponent } from './components';
import { LoanApplicationService } from './services';
import { PrintService } from '../shared/services/print.service';

//import { LoanApplicationDetailsViewComponent } from './loans/loan-application-details-view/loan-application-details-view.component';
import { CreditAppraisalComponent } from './credit-appraisal/credit-appraisal.component';
//import {LoanRecoveryRepaymentApprovalComponent} from './loan-management/loan-recovery-repayment-approval/loan-recovery-repayment-approval.component';
import { CollateralAssignmentApprovalComponent } from './loan-management/approvals/collateral-assignment-approval.component';
import { CollateralReleaseApprovalComponent } from './loan-management/approvals/collateral-release-approval.component';
import { CustomFieldTestComponent } from '../setup/customfield.component';
import { ProductFeeComponent } from '../setup/components';
import { OverrideService } from './services/override.service';
import { ProjectSiteReportComponent } from '../credit/project-site-report/project-site-report.component';
import { ConditionChecklistComponent } from './loans/loan-checklist/condition-checklist.component';
import { DefferalManagementComponent } from './loans/defferal-management/defferal-management.component';
import { LoanRecoveryPaymentPlanService } from './services/loan-recovery-paymentplan.service';
import { LoanRecoveryPaymentPlanComponent } from './loan-management/loanrecovery-paymentplan/loanrecoverypaymentplan.component';
import { TermSheetComponent } from './term-sheet/term-sheet.component';

import {
    LoanReviewApplicationService
} from './services'

import {
    LoanRestructuringComponent,
    // LoanApplicationReviewComponent,
    OverrideComponent,
    ProductFeeConcessionComponent,
    CreditBureauSearchComponent,
    ScheduleViewComponent,
    LoanApplicationSearchComponent,
    //SheduleComponent,
    LoanBookingComponent,
    InitiateLoanBookingComponent,
    RiskAssessmentComponent,
    CollateralReleaseComponent,
    CovenantDetailComponent,
    StartLoanApplicationComponent,
    PreliminaryEvaluationComponent,
    OfferLetterGenerationComponent,
    PreliminaryEvaluationViewComponent,
    LoanAvailmentComponent,
    BondsAndGuaranteeComponent,
    OfferLetterGenererationReviewComponent,
    CallMemoComponent,
    LoanOperationsComponent,
    BulkRateReviewComponent,
    LoanChecklistComponent,
    FacilityDetailsComponent,
    LoanApplicationsListComponent,
    LoanEligibilityRequirementsComponent,
    ConvenantMaintenanceComponent,
    GuarantorMaintenanceComponent,
    CreditDocumentUploadComponent,
    CollateralMappingComponent,
    RejectedApplicationComponent,
    LoanReviewApplicationComponent,
    LoanReviewAppraisalComponent,
    LoanReviewOfferLetterComponent,
    LoanReviewAvailmentComponent,
    ReviewApplicationListComponent,
} from './components';
import { LoanApplicationDetailsComponent } from './loans/application/loan-application-details.component';
import { LimitExposureComponent } from './loans/application/limits/limit-exposure.component';
import { FirstTraderComponent } from './loans/application/facility-details/extentions/first-trader.component';
import { EducationLoanComponent } from './loans/application/facility-details/extentions/education-loan.component';
import { BondGurantyComponent } from './loans/application/facility-details/extentions/bond-guranty.component';
import { CreditBureauService } from './services/credit-bureau.service';
import { DisbursedLoanDetailsComponent } from './loan-management/disbursed-loan-details/disbursed-loan-details.component';
import { LoanFeeConcessionComponent } from './loans/loan-fee-concession/loan-fee-concession.component';
import { LoanPrepaymentComponent } from './loan-management/loan-prepayment/loanprepayment.component';
//import { LoanPrepaymentService } from 'app/credit/services/loan-prepayment.service';

import { OverdraftOperationsComponent } from './loan-management/overdraft-operations/overdraft-operations.component';
import { ContingentUsageListComponent } from './loans/contingent-usage/contingent-usage-list.component';
import { ContingentLoanService } from './loans/contingent-usage/contingentloan.service';
import { ContingentUsageComponent } from './loans/contingent-usage/contingent-usage.component';
import { ReassignAccountComponent } from './loan-management/reassignaccount/reassignaccount.component';
import { ProductFeesComponent } from './loans/application/facility-details/productfees.component';
import { RemedialOpreationComponent } from './loan-management/remedial-opreation/remedial-opreation.component';
import { ContingentOpreationComponent } from './loan-management/contingent-operations/contingent-operations.component';
import { LoanPerformanceComponent } from './loan-management/loan-performance/loan-performance.component';
import { LoanPerformanceService } from './services/loan-performance.service';
import { LoanPrepaymentService } from './services/loan-prepayment.service';
import { LoanFeeAdjustmentComponent } from './loan-management/loan-fee-adjustment/loan-fee-adjustment.component';
//import { LoanDisbursementComponent } from './loans/loan-disbursement/loan-disbursement.component';
import { LoanCamsolComponent } from './loan-management/loan-camsol/loan-camsol.component';
import { ChildSectorLimitComponent } from './loans/application/limits/sector-limit.component';
import { MapComponent } from './map/map.component';
import { FacilityDetailSummaryComponent } from './loans/facility-detail-summary/facility-detail-summary.component';
import { AuthorizationService, StaffService } from '../admin/services';
import { FXRevolvingLoanPaymentComponent } from './loan-management/fx-loan-payment/fx-revolving-loan-payment.component';
import { CommercialLoanReviewOperationsComponent } from './loan-management/commercial-loan-operations/commercial-loan-operations.component';
import { DisbursedCommercialLoanDetailsComponent } from './loan-management/disbursed-loan-details/disbursed-cp-and-fx-loan-details.component';
import { FXRevolvingLoanReviewOperationsComponent } from './loan-management/fx-revolving-loan-operations/fx-revolving-loan-operation.component';
import { TrancheFacilityUtilizationComponent } from 'app/credit/loans/facility-details/tranche-facility-utilization.component';
import { FacilityLineReviewOperationsComponent } from 'app/credit/loan-management/facility-line-operations/line-operation.component';
import { LoanReviewApplicationSearchComponent } from './loan-management/loan-review-application-search/loan-review-application-search.component';
import { ExistingCamsolComponent } from 'app/credit/shared/existing-camsol/existing-camsol.component';
import { ChecklistItemSimulationComponent } from './loans/checklist-item-simulation/checklist-item-simulation.component';
import { CompletedLoanConfirmationComponent } from './loans/completed-loan-confirmation/completed-loan-confirmation.component';
import { LMSCrmsRegulatoryComponent } from './loans/crms-regulatory/lms-crms-regulatory.component';
import { TakeFeeComponent } from './loan-management/take-fee/take-fee.component';
import { GlobalInterestRateChangeComponent } from './loan-management/global-interest-rate-change/global-interest-rate-change.component';
import { ContingentLiabilityTreminateRebookComponent } from './loan-management/contingent-liability-terminate-rebook/contingent-liability-terminate-rebook.component';
import { CancelContingentLiabilityComponent } from './loan-management/cancel-contingent-liability/cancel-contingent-liability.component';
import { UnDisbursedLoanDetailsComponent } from './loan-management/disbursed-loan-details/undisbursed-loan-details.component';
import { ContingentTerminationComponent } from './loan-management/contingent-termination/contingent-termination.component';
import { LoanCrmsUpdateComponent } from './loans/booking/loan-crms-update.component';
import { ContingentFacilityReleaseComponent } from './loans/booking/contingent-release.component';
import { LoanDisbursement2Component } from 'app/credit/loans/loan-disbursement/loan-disbursement2.component';
import { AvailmentRouteComponent } from 'app/credit/routes/availment-route.component';
import { CollateralInformationReleaseComponent } from './collateral/information/collateral-information-release.component';
import { CollateralReleaseAwaitingJobRequestComponent } from './collateral/information/collateral-release-awaiting-job-request.component';
import { CollateralReleaseListComponent } from './collateral/information/collateral-release-list.component';
import { FullAndFinalStatusChangeComponent } from './loan-management/full-and-final-status-change/full-and-final-status-change.component';
import { DisbursedLoansComponent } from './loans/disbursed-loans/disbursed-loans.component';
//import { LoanFeeScheduleComponent } from './loan-management/loan-fee-schedule/loan-fee-schedule.component';
import { OriginalDocumentSubmissionComponent } from './original-document-submission/original-document-submission.component';
import { DeferredLoanFeeComponent } from './loans/booking/deferred-loan-fee/deferred-loan-fee.component';
// import { LetterOfCreditDetailsViewComponent } from './letter-of-credit/letter-of-credit-details-view/letter-of-credit-details-view.component';
// import { StartLetterOfCreditComponent } from './letter-of-credit/start-letter-of-credit/start-letter-of-credit.component';
import { LcIssuanceComponent } from './letter-of-credit/lc-issuance/lc-issuance.component';
import { LcDocumentsComponent } from './letter-of-credit/lc-documents/lc-documents.component';
import { LcShippingComponent } from './letter-of-credit/lc-shipping/lc-shipping.component';
import { LcConditionComponent } from './letter-of-credit/lc-condition/lc-condition.component';
import { LetterOfCreditService } from './services/letter-of-credit.service';
import { AtcLodgmentComponent } from './atc-lodgment/atc-lodgment.component';
import { AtcReleaseComponent } from './atc-release/atc-release.component';
import { ReleaseOfShippingDocumentsComponent } from './letter-of-credit/release-of-shipping-documents/release-of-shipping-documents.component';
import { ProjectSiteReportService } from './services/project-site-report.service';
import { ReleaseOfShippingDocumentsApprovalComponent } from './letter-of-credit/release-of-shipping-documents-approval/release-of-shipping-documents-approval.component';
import { LcIssuanceApprovalComponent } from './letter-of-credit/lc-issuance-approval/lc-issuance-approval.component';
import { LcSearchComponent } from './letter-of-credit/lc-search/lc-search.component';
import { LcUssanceComponent } from './letter-of-credit/lc-ussance/lc-ussance.component';
import { LcUssanceApprovalComponent } from './letter-of-credit/lc-ussance-approval/lc-ussance-approval.component';
import { LetterGenerationRequestComponent } from './letter-generation-request/letter-generation-request.component';
import { LetterGenerationRequestService } from './services/letter-generation-request.service';
import { CollateralValuationComponent } from './collateral/collateral-valuation/collateral-valuation.component';
import { PsrCkeditorComponent } from './project-site-report/psr-ckeditor/psr-ckeditor.component';
import { SecurityReleaseComponent } from './security-release/security-release.component';
import { CollateralInsuranceRequestComponent } from './collateral/collateral-insurance-request/collateral-insurance-request.component';
import { DisbursementUploadComponent } from './loans/booking/disbursement-upload.component';
import { CreditLetterGenerationCompletedComponent } from './credit-letter-generation-completed/credit-letter-generation-completed.component';
import { CollateralInsuranceSearchComponent } from './collateral/collateral-insurance-search/collateral-insurance-search.component';
import { LoanRecoveryPaymentComponent } from './loan-management/loan-recovery-payment/loan-recovery-payment.component';
import { LoanTerminationComponent } from './loan-management/loan-termination/loantermination.component';
import { OperationRouteComponent } from './routes/operation-route.component';
import { LienOnInvestmentComponent } from './collateral/lien-on-investment/lien-on-investment.component';
import { ModifyFacilityComponent } from './modify-facility/modify-facility.component';
//import { BulkLoanPrepaymentReversalComponent } from './loan-management/loan-prepayment-reversal/bulk-loanprepaymentreversal.component';
//import { BulkPrepaymentLoanComponent } from './loan-management/loan-prepayment-reversal/bulk-prepayment-loan.component';
import { LoanPrepaymentReversalComponent } from './loan-management/loan-prepayment-reversals/loanprepaymentreversal.component';
import { BulkLoanPrepaymentReversalComponent } from './loan-management/bulk-loanprepaymentreversal/bulk-loanprepaymentreversal.component';
import { BulkPrepaymentLoanComponent } from './loan-management/bulk-prepayment-loan/bulk-prepayment-loan.component';
import { LoanReviewApplicationRejectedComponent } from './loan-management/loan-review-application-rejected/loan-review-application-rejected.component';

import { LcIssuanceCancelationApprovalComponent } from './letter-of-credit/lc-issuance-cancelation-approval/lc-issuance-cancelation-approval.component';
import { DrawDownApplicationStatusComponent } from './draw-down-application-status/draw-down-application-status.component';
import { LcEnhancementComponent } from './letter-of-credit/lc-enhancement/lc-enhancement.component';
import { LcEnhancementApprovalComponent } from './letter-of-credit/lc-enhancement-approval/lc-enhancement-approval.component';
import { ModifyFacilityDetailsComponent } from './modify-facility/modify-facility-details/modify-facility-details.component';
import { AppraisalPoolComponent } from './credit-appraisal/appraisal-pool.component';
import { CreditDocumentationComponent } from './loans/credit-documentation/credit-documentation.component';
import { AssignLoanToAgentComponent } from './loan-management/assign-loan-to-agent/assign-loan-to-agent.component';
import { CaptureLiquidationReceiptComponent } from './loan-management/capture-liquidation-receipt/capture-liquidation-receipt.component';
import { NplExternalDebtCollectionComponent } from './loan-management/npl-external-debt-collection/npl-external-debt-collection.component';
import { AccreditedConsultantListComponent } from './loan-management/accredited-consultant-list/accredited-consultant-list.component';
import { WriteOffLoansComponent } from './loan-management/write-off-loans/write-off-loans.component';
import { UnfreezeOverdraftLienComponent } from './loan-management/unfreeze-overdraft-lien/unfreeze-overdraft-lien.component';
import { LienCustomerAccountComponent } from './loans/lien-customer-account/lien-customer-account.component';
import { ProjectSiteReportAccountOfficerComponent } from './project-site-report-account-officer/project-site-report-account-officer.component';
import { CreditDocumentationLosComponent } from './loans/credit-documentation-los/credit-documentation-los.component';
import { ModifyLmsApplicationComponent } from './loans/modify-lms-application/modify-lms-application.component';
import { LmsCrmsUpdateComponent } from './loan-management/loan-operations/lms-crms-update/lms-crms-update.component';
import { LcCancelationComponent } from './letter-of-credit/lc-cancelation/lc-cancelation.component';
import { LcSearchLmsComponent } from './letter-of-credit/lc-search-lms/lc-search-lms.component';
import { RecoveryReportingComponent } from './loan-management/recovery-reporting/recovery-reporting.component';
import { RecoveryCommissionComponent } from './loan-management/recovery-commission/recovery-commission.component';
import { LoanCrmsUpdateLmsComponent } from './loans/booking/loan-crms-update-lms/loan-crms-update-lms.component';
import { ConsumerProtectionComponent } from './consumer-protection/consumer-protection.component';
import { RelatedEmployerComponent } from 'app/setup/components/related-employer/related-employer.component';
import { AssignLoanToAgentRetailComponent } from './loan-management/assign-loan-to-agent-retail/assign-loan-to-agent-retail.component';
import { ListOfAssignedRetailLoansComponent } from './loan-management/list-of-assigned-retail-loans/list-of-assigned-retail-loans.component';
import { RecoveryReportingRetailComponent } from './loan-management/recovery-reporting-retail/recovery-reporting-retail.component';
import { RecoveryCommissionRetailComponent } from './loan-management/recovery-commission-retail/recovery-commission-retail.component';
import { LcExtensionComponent } from './letter-of-credit/lc-extension/lc-extension.component';
import { LcExtensionApprovalComponent } from './letter-of-credit/lc-extension-approval/lc-extension-approval.component';
import { LcCashBuildupPlanComponent } from './letter-of-credit/lc-cash-buildup-plan/lc-cash-buildup-plan.component';
import { LcUssanceExtensionComponent } from './letter-of-credit/lc-ussance-extension/lc-ussance-extension.component';
import { LcUssanceExtensionApprovalComponent } from './letter-of-credit/lc-ussance-extension-approval/lc-ussance-extension-approval.component';
import { LoanReviewDrawdownComponent } from './loan-management/loan-operations/loan-review-drawdown.component';
import { DrawdownComponent } from './loans/booking/drawdown.component';
import { ListOfAssignedRemedialLoansComponent } from './loan-management/list-of-assigned-remedial-loans/list-of-assigned-remedial-loans.component';
import { CollateralValuationSearchComponent } from './collateral/collateral-valuation-search/collateral-valuation-search.component';
import { RecoveryReportCollectionComponent } from './loan-management/recovery-report-collection/recovery-report-collection.component';
import { RecoveryCommissionInternalComponent } from './loan-management/recovery-commission-internal/recovery-commission-internal.component';
import { RecoveryAssignmentListInternalAgentsComponent } from './loan-management/recovery-assignment-list-internal-agents/recovery-assignment-list-internal-agents.component';
import { ExternalLinkDirectiveComponent } from './loan-management/external-link-directive/external-link-directive.component';
import { SecurityReleaseSearchComponent } from './security-release-search/security-release-search.component';
import { OriginalDocumentSubmissionSearchComponent } from './original-document-submission-search/original-document-submission-search.component';
import { CollateralSwapSearchComponent } from './collateral/swap/collateral-swap-search/collateral-swap-search.component';
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
import { SubsidiaryLmsApplicationListComponent } from './subsidiary-lms-application-list/subsidiary-lms-application-list.component';
import { LoanRefinancingComponent } from './loans/loan-refinancing/loan-refinancing.component';
import { UnderwritingObligorComponent } from './loan-management/underwriting-obligor/underwriting-obligor.component';
import { PmbRefinancedLoanApprovalComponent } from './loan-management/pmb-refinanced-loan-approval/pmb-refinanced-loan-approval.component';
import { RefinancingLoanReviewComponent } from './loan-management/refinancing-loan-review/refinancing-loan-review.component';
import { LenderRiskAssessmentComponent } from './loan-management/lender-risk-assessment/lender-risk-assessment.component';
import { PendingRefinancingComponent } from './loan-management/pending-refinancing/pending-refinancing.component';
import { RefinanceLoanDisbursementComponent } from './loan-management/refinance-loan-disbursement/refinance-loan-disbursement.component';
import { NmrcLoanBookingComponent } from './loan-management/nmrc-loan-booking/nmrc-loan-booking.component';
import { NmrcLoanDisbursementComponent } from './loan-management/nmrc-loan-disbursement/nmrc-loan-disbursement.component';
import { NmrcLoanRestructuringComponent } from './loan-management/nmrc-loan-restructuring/nmrc-loan-restructuring.component';
import { LoanRefinancing2Component } from './loan-management/loan-refinancing2/loan-refinancing2.component';

// import { CollateralFacilitiesComponent } from './collateral/collateral-facilities/collateral-facilities.component';

@NgModule({
    imports: [
        CreditRoutingModule, CommonModule, FormsModule,
        BankingSharedModule, ListboxModule,
        ButtonModule, FieldsetModule, GMapModule,
        DataTableModule, SharedModule, DialogModule, CheckboxModule, TabViewModule, SpinnerModule, InputMaskModule,
        CalendarModule, ReactiveFormsModule, PanelModule, EditorModule, AccordionModule, PickListModule, AutoCompleteModule, GrowlModule,],
    exports: [
        // CollateralInformationViewComponent, 
        PsrCkeditorComponent, LienOnInvestmentComponent, 
        LoanChecklistComponent,
        CreditDocumentationComponent,
        AssignLoanToAgentComponent,
        CaptureLiquidationReceiptComponent,
        NplExternalDebtCollectionComponent,
        ProductFeesComponent,
        AccreditedConsultantListComponent,
        LoanReviewDrawdownComponent,
        ExistingFacilitiesComponent,
        // CollateralInformationComponent,
        ReviewApplicationListComponent],

    declarations: [
        CovenantDetailComponent, CurrencyMaskDirective,//LoanRecoveryRepaymentApprovalComponent,
        RiskAssessmentComponent,
        CreditAppraisalComponent, ScheduleViewComponent, ContingentOpreationComponent,
        ContingentLiabilityTreminateRebookComponent,CollateralReleaseAwaitingJobRequestComponent,
        RiskAssessmentComponent,
        CreditAppraisalComponent, ScheduleViewComponent, ContingentTerminationComponent,
        ContingentOpreationComponent, ContingentLiabilityTreminateRebookComponent,
        ReplyRequestComponent, BulkRateReviewComponent, 
        FacilityDetailsComponent, ConvenantMaintenanceComponent,
        StartLoanApplicationComponent, PreliminaryEvaluationComponent,
        LoanBookingComponent, OfferLetterGenerationComponent,
        PreliminaryEvaluationViewComponent, ContingentFacilityReleaseComponent,
        CreditJobRequestComponent,
        JobRequestViewComponent, LegalJobRequestConfirmation,
        LoanAvailmentComponent, OfferLetterGenererationReviewComponent,
        ReasignRequestComponent, CollateralReleaseComponent,
        CollateralAssignmentComponent, CallMemoComponent,
        LoanApplicationCovenantComponent, ExistingFacilitiesComponent,
        ExistingCamsolComponent,
        LoanEligibilityRequirementsComponent,CollateralReleaseListComponent, LoanRestructuringComponent,
        LoanChecklistComponent, LoanOperationsComponent, LoanRestructuringComponent,
        LoanChecklistComponent, LoanApplicationSearchComponent,
        RejectedApplicationComponent, BondsAndGuaranteeComponent,
        // CollateralInformationViewComponent, 
        // CollateralInformationComponent, 
        ConvenantMaintenanceComponent,
        GuarantorMaintenanceComponent, LoanApplicationsListComponent,
        CreditDocumentUploadComponent, SecretariatComponent,
        CollateralCreationComponent, InitiateLoanBookingComponent,
        CollateralSwapComponent, EndofdayComponent,
        SecretariatComponent, LoanApplicationCollateralInformationComponent,
        CreditDocumentUploadComponent, SlaMonitoringComponent,
        CollateralMappingComponent,
        SecretariatComponent,CollateralInformationReleaseComponent,
        CollateralAssignmentApprovalComponent,
        CreditBureauSearchComponent,
        CollateralReleaseApprovalComponent, CustomFieldTestComponent,
        ConditionChecklistComponent, DefferalManagementComponent,
        CustomerProductFeeComponent, OverrideComponent, //CustomerInformationComponent,
        ProjectSiteReportComponent,
        ProductFeeConcessionComponent, LoanRecoveryPaymentPlanComponent,
        LoanReviewApplicationComponent,
        TakeFeeComponent,
        LoanReviewAppraisalComponent,
        LoanReviewOfferLetterComponent,
        LoanReviewAvailmentComponent,
        ReviewApplicationListComponent,
        LoanApplicationDetailsComponent,
        LimitExposureComponent, FirstTraderComponent,
        EducationLoanComponent, BondGurantyComponent,
        DisbursedLoanDetailsComponent, UnDisbursedLoanDetailsComponent,
        LoanFeeConcessionComponent,
        ContingentUsageListComponent, ContingentUsageComponent,
        LoanPrepaymentComponent, OverdraftOperationsComponent, LoanReviewOperationsComponent,
        TrancheFacilityUtilizationComponent,
        ReassignAccountComponent,
        LoanEligibilityRequirementsComponent, CollateralReleaseListComponent, ProductFeesComponent, RemedialOpreationComponent, LoanPerformanceComponent,
        MaturityInstructionComponent, LoanFeeAdjustmentComponent, CPRolloverComponent,
        CPTenorExtensionComponent, CPInterestRateReviewComponent, CPPrepaymentComponent,
        CPRepaymentComponent, CPSubAllocationComponent,  LoanCamsolComponent,
        ChildSectorLimitComponent, MapComponent, FacilityDetailSummaryComponent,
        FXRevolvingLoanPaymentComponent, CommercialLoanReviewOperationsComponent,
        DisbursedCommercialLoanDetailsComponent, FXRevolvingLoanReviewOperationsComponent,
        FacilityLineReviewOperationsComponent, CrmsRegulatoryComponent, LMSCrmsRegulatoryComponent,
        LoanReviewApplicationSearchComponent,
        BulkLoanPrepaymentReversalComponent,
        BulkPrepaymentLoanComponent,
        LoanPrepaymentReversalComponent,
        ChecklistItemSimulationComponent, GlobalInterestRateChangeComponent,
        CompletedLoanConfirmationComponent, CancelContingentLiabilityComponent, FacilityJobRequestComponent,
        LoanDisbursement2Component,LoanCrmsUpdateComponent ,AvailmentRouteComponent, FullAndFinalStatusChangeComponent,
        TermSheetComponent, DisbursedLoansComponent, OriginalDocumentSubmissionComponent//EditLoanApplicationComponent
        , LcIssuanceComponent, LcDocumentsComponent, LcShippingComponent, LcConditionComponent//EditLoanApplicationComponent
        ,DeferredLoanFeeComponent,AtcLodgmentComponent, LoanRefinancingComponent, AtcReleaseComponent, ReleaseOfShippingDocumentsComponent, ReleaseOfShippingDocumentsApprovalComponent, LcIssuanceApprovalComponent, LcSearchComponent, LcUssanceComponent, LcUssanceApprovalComponent, CollateralValuationComponent,
        LetterGenerationRequestComponent,
        PsrCkeditorComponent,
        SecurityReleaseComponent,
        CollateralInsuranceRequestComponent,
        DisbursementUploadComponent,
        CreditLetterGenerationCompletedComponent,
        CollateralInsuranceSearchComponent,
        LoanRecoveryPaymentComponent,
        LoanTerminationComponent,
        OperationRouteComponent,
        LienOnInvestmentComponent,
        ModifyFacilityComponent,
        LoanReviewApplicationRejectedComponent,
        LcIssuanceCancelationApprovalComponent,
        DrawDownApplicationStatusComponent,
        LcEnhancementComponent,
        LcEnhancementApprovalComponent,
        ModifyFacilityDetailsComponent,
        AppraisalPoolComponent,
        CreditDocumentationComponent,
        AssignLoanToAgentComponent,
        CaptureLiquidationReceiptComponent,
        NplExternalDebtCollectionComponent,
        AccreditedConsultantListComponent,
        WriteOffLoansComponent,
        UnfreezeOverdraftLienComponent,
        FsCaptionUploadComponent,
        LienCustomerAccountComponent,
        LienSearchComponent,
        ProjectSiteReportAccountOfficerComponent,
        CreditDocumentationLosComponent,
        LmsCompletedCreditDocumentationComponent,
        LosCompletedCreditDocumentationComponent,
        InsuranceUploadComponent,
        RejectedInsuranceUploadComponent,
        ModifyLmsApplicationComponent,
        LmsCrmsUpdateComponent,
        LcCancelationComponent,
        LcSearchLmsComponent,
        RecoveryReportingComponent,
        RecoveryCommissionComponent,
        LoanCrmsUpdateLmsComponent,
        ConsumerProtectionComponent,
        RelatedEmployerComponent,
        AssignLoanToAgentRetailComponent,
        ListOfAssignedRetailLoansComponent,
        RecoveryReportingRetailComponent,
        RecoveryCommissionRetailComponent,
        LoanReviewDrawdownComponent,
        DrawdownComponent,
        LcExtensionComponent,
        LcExtensionApprovalComponent,
        LcCashBuildupPlanComponent,
        LcUssanceExtensionComponent,
        LcUssanceExtensionApprovalComponent,
        RecoveryReportCollectionComponent,
        RecoveryCommissionInternalComponent,
        RecoveryAssignmentListInternalAgentsComponent,
        ListOfAssignedRemedialLoansComponent,
        CollateralValuationSearchComponent,
        ExternalLinkDirectiveComponent,
        CollateralSwapSearchComponent,
        SecurityReleaseSearchComponent,
        OriginalDocumentSubmissionSearchComponent,
        OperationEndDocumentationComponent,
        LoanReviewContingentApplicationSearchComponent,
        CashSecurityReleaseComponent,
        CashSecurityReleaseSearchComponent,
        StampDutyClosureComponent,
        ContinuousDocumentationComponent,
        SubsidiaryLmsApplicationListComponent,
        UnderwritingObligorComponent,
        PmbRefinancedLoanApprovalComponent,
        RefinancingLoanReviewComponent,
        LenderRiskAssessmentComponent,
        PendingRefinancingComponent,
       
        RefinanceLoanDisbursementComponent,
       
        NmrcLoanBookingComponent,
       
        NmrcLoanDisbursementComponent,
       
        NmrcLoanRestructuringComponent,
       
        LoanRefinancing2Component,
        
        // CollateralFacilitiesComponent,
    ],

    providers: [
        LoadingService, AuthenticationService, AuthHttp, ValidationService, RiskIndexService, CollateralService,
        LoanCovenantService, CustomerService, CasaService, CountryStateService, ConditionPrecedentService,
        CustomerRealTimeSearchService, CurrencyService, LoanService, DateUtilService, CreditAppraisalService,
        RiskAssessmentService, ProductService, BranchService, LedgerService, DocumentService, RequestJobTypeService,
        GeneralSetupService, DepartmentService, JobService, CallMemoService, LoanOperationService,
        CreditApprovalService, ApprovalService, CustomerGroupService, ExchangeRateService, ChecklistService,
        ReportService, BulkRateService, CompanyService, StaffRealTimeSearchService, LoanReviewApplicationService,
        LoanApplicationService, PrintService, ProductFeeService, OverrideService, LoanRecoveryPaymentPlanService,
        CreditBureauService, FeeConcessionService, LoanPrepaymentService, ContingentLoanService,
        LoanPerformanceService, AccreditedConsultantsService, AuthorizationService, StaffRoleService
        ,LetterOfCreditService, LetterGenerationRequestService,
        ProjectSiteReportService, StaffService, MisInfoService, JobTitleService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})



export class CreditModule { }