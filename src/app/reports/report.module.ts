import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report.routing';
import { LoanWorkflowReportComponent } from './loan-workflow/loan-workflow-sla/loan-workflow-sla.report.component';
import { ApprovalService } from '../setup/services/approval.service';
import { LoanApplicationService } from '../credit/services/loan-application.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
    ButtonModule,PanelModule,InputMaskModule,
    SpinnerModule, PickListModule, FieldsetModule, AutoCompleteModule, GrowlModule, GMapModule,
    DataTableModule, SharedModule, DialogModule, AccordionModule,
    DropdownModule, CheckboxModule, TabViewModule, CalendarModule, EditorModule, ProgressBarModule
} from 'primeng/primeng';
import { ReportService } from './service/report.service';
import { LoanService } from '../credit/services/loan.service';
import { LoadingService } from '../shared/services/loading.service';
import { BranchLimitComponent } from './limit-monitoring/branch-limit/branch-limit.component';
import { SectorLimitComponent } from './limit-monitoring/secto-limit/sector-limit.component';
import { WorkflowDefinitionComponent } from './loan-workflow/workflow-definition/workflow-definition.component';
import { LoanCommercialReportComponent } from './loan-reports/loan-commercial-loan/loan-commercial-loan.report.component';
import { EarnedUnearnedInterestReportComponent } from './loan-reports/earned-unearned-interest/earned-unearned-interest.report.component';
import { LoanScheduleReportComponent } from './loan-reports/loan-schedule/loan-schedule.report.component';
import { LoanDisburstmentReportComponent } from './loan-reports/loan-disburstment/loan-disburstment.report.component';
import { TeamloansRevolvingFacilityReportComponent } from './loan-reports/teamloans-revolving-facility/teamloans-revolving-facility.report.component';
import { PostedTransactionsReportComponent } from './Finance-reports/posted-transaction/posted-transactions.component';
import {
    CollateralPropertyRevaluationComponent, ExpiredSelfLiquidatingLoansComponent,
    LoanCovenantsApproachingDueDateComponent, NonPerformingLoansComponent, ExpiredOverdraftLoansComponent
} from './loan-monitoring';
import { LoanStatementReportComponent } from './loan-reports/loan-statement/loan-statement.report.component';
import { LoanAnniverseryReportComponent } from './loan-reports/loan-Anniversery/loan-Anniversery.report.component';
import { LoanwaiverReportComponent } from './loan-reports/loan-waiver/loan-waiver.report.component';
import { CollateralEstimatedReportComponent } from './collateral-reports/collateral-estimated/collateral-estimated.report.component';
import { CollateralService, BranchService, ProductService, GeneralSetupService } from '../setup/services';
import { fcyscheuledReportComponent } from './loan-reports/loan-fcyscheuled/loan-fcyscheuled.report.component';
import { StakeholdersOnExpirationOfFtpComponent } from './loan-reports/stakeholders-on-expiration-of-ftp/stakeholders-on-expiration-of-ftp.component';
import { LoanDeferralComponent } from './loan-reports/loan-deferral/loan-deferral.component';
import { AuditTrailReportComponent } from './audit-trail-report/audit-trail-report.component';
import { LoanDeferralMccComponent } from './loan-reports/loan-deferral-mcc/loan-deferral-mcc.component';
import { FacilityApprovedNotUtilizedComponent } from './loan-reports/facility-approved-not-utilized/facility-approved-not-utilized.component';

import { LoanInterestReceivablePayableComponent } from './loan-reports/loan-interest-receivable-payable/loan-interest-receivable-payable.component';
import { RuningLoansComponent } from './loan-reports/commercial-loans/runing-loans.component';
import { TurnoverCovenantComponent } from './loan-monitoring/turnover-covenant/turnover-covenant.component';
import { BondAndGuaranteeComponent } from './loan-monitoring/bond-and-guarantee/bond-and-guarantee.component';
import { InsuranceExpirationComponent } from './loan-monitoring/insurance-expiration/insurance-expiration.component';
import { CollateralVisitationComponent } from './loan-monitoring/collateral-visitation/collateral-visitation.component';
import { SlaMonitoringComponent } from './loan-monitoring/sla-monitoring/sla-monitoring.component';
import { BlacklistComponent } from './loan-monitoring/blacklist/blacklist.component';
import { DailyAccrualComponent } from './Finance-reports/daily-accrual/daily-accrual.component';
import { RepaymentComponent } from './Finance-reports/repayment/repayment.component';
import { CustomFacilityRepaymentComponent } from './Finance-reports/custom-facility-repayment/custom-facility-repayment.component';
import { LienComponent } from './loan-reports/lien/lien.component';
import { StalledPerfectionComponent } from './loan-monitoring/stalled-perfection/stalled-perfection.component';
import { CollateralPerfectionYettocommenceComponent } from './loan-monitoring/collateral-perfection-yettocommence/collateral-perfection-yettocommence.component';
import { AllComercialLoanReportComponent } from './loan-monitoring/all-comercial-loan-report/all-comercial-loan-report.component';
import { CashbackedComponent } from './loan-monitoring/cashbacked/cashbacked.component';
import { UnearnedInterestComponent } from './loan-monitoring/unearned-interest/unearned-interest.component';
import { ReceivableInterestComponent } from './loan-monitoring/receivable-interest/receivable-interest.component';
import { CashbackedBondGuaranteeComponent } from './loan-monitoring/cashbacked-bond-guarantee/cashbacked-bond-guarantee.component';
import { WeeklyRecoveryReportFinconComponent } from './loan-monitoring/weekly-recovery-report-fincon/weekly-recovery-report-fincon.component';
import { CashCollaterizedCreditsComponent } from './loan-monitoring/cash-collaterized-credits/cash-collaterized-credits.component';
import { StaffPrivilegeChangeComponent } from './staff-information/staff-privilege-change/staff-privilege-change.component';
import { LoggingStatusComponent } from './logging-status/logging-status.component';
import { UserGroupChangeReportComponent } from './staff-information/user-group-change-report/user-group-change-report.component';
import { ProfileActivityReportComponent } from './staff-information/profile-activity-report/profile-activity-report.component';
import { RunningFacilitiesComponent } from './loan-reports/running-facilities/running-facilities.component';
import { StaffRoleProfileGroupReportComponent } from './staff-information/staff-role-profile-group-report/staff-role-profile-group-report.component';
import { StaffRoleProfileActivityReportComponent } from './staff-information/staff-role-profile-activity-report/staff-role-profile-activity-report.component';
import { InActiveContigentLiabilityReportComponent } from './loan-reports/in-active-contigent-liability-report/in-active-contigent-liability-report.component';
import { MiddleOfficeReportComponent } from './loan-reports/middle-office-report/middle-office-report.component';
import { CollateralValuationComponent } from './loan-reports/collateral-valuation/collateral-valuation.component';
import { LoanClassificationReportComponent } from './loan-reports/loan-classification-report/loan-classification-report.component';
import { AgeAnalysisReportComponent } from './loan-reports/age-analysis-report/age-analysis-report.component';
import { CreditScheduleReportComponent } from './loan-reports/credit-schedule-report/credit-schedule-report.component';
import { SanctionLimitReportComponent } from './loan-reports/sanction-limit-report/sanction-limit-report.component';
import { ImpairedWatchListReportComponent } from './loan-reports/impaired-watch-list-report/impaired-watch-list-report.component';
import { InsuranceReportComponent } from './loan-reports/insurance-report/insurance-report.component';
import { ExcessReportComponent } from './loan-reports/excess-report/excess-report.component';
import { ExpiredReportComponent } from './loan-reports/expired-report/expired-report.component';
import { LoanDocumentWaivedComponent } from './loan-reports/loan-document-waived/loan-document-waived.component';
import { LoanDocumentDeferredComponent } from './loan-reports/loan-document-deferred/loan-document-deferred.component';
import { RuniningLoanReportComponent } from './loan-reports/runining-loan-report/runining-loan-report.component';
import { DisbursalCreditTurnoverComponent } from './loan-reports/disbursal-credit-turnover/disbursal-credit-turnover.component';
import { LoanBookingReportComponent } from './loan-monitoring/loan-booking-report/loan-booking-report.component';
import { Form300bFacilityReportComponent } from './loan-reports/form300b-facility-report/form300b-facility-report.component';
import { UnutilizedFacilityReportComponent } from './loan-reports/unutilized-facility-report/unutilized-facility-report.component';
import {  OriginalDocumentSubmissionReportComponent } from './original-document-submission/original-document-submission-report.component';
import { RiskAssetsReportComponent } from './risk-assets-report/risk-assets-report.component';
import { ContigentReportComponent } from './contigent-report/contigent-report.component';
import { ExpiredFacilityReportComponent } from './expired-facility-report/expired-facility-report.component';
import { OverlineReportComponent } from './overline-report/overline-report.component';
import { LargeExposureReportComponent } from './large-exposure-report/large-exposure-report.component';
import { ExtensionComponent } from './extension/extension.component';
import { MaturityReportComponent } from './maturity-report/maturity-report.component';
import { IfrsclassificationTeamComponent } from './ifrsclassification-team/ifrsclassification-team.component';
import { RiskAssetByVarianceReportComponent } from './risk-asset-by-variance-report/risk-asset-by-variance-report.component';
import { RiskAssetMainReportComponent } from './risk-asset-main-report/risk-asset-main-report.component';
import { RiskAssetDistributionBySectorReportComponent } from './risk-asset-distribution-by-sector-report/risk-asset-distribution-by-sector-report.component';
import { RiskAssetByIfrsClassificationComponent } from './risk-asset-by-ifrs-classification/risk-asset-by-ifrs-classification.component';
import { RiskAssetTeamReportComponent } from './risk-asset-team-report/risk-asset-team-report.component';
import { UnpaidObligationReportComponent } from './unpaid-obligation-report/unpaid-obligation-report.component';
import { RiskAssetMain1Component } from './risk-asset-main-1/risk-asset-main-1.component';
import { CbnNplTeamReportComponent } from './cbn-npl-team-report/cbn-npl-team-report.component';
import { RiskAssetByCbnNplClassificationReportComponent } from './risk-asset-by-cbn-npl-classification-report/risk-asset-by-cbn-npl-classification-report.component';
import { ContigentLiabilityReportMainReportComponent } from './contigent-liability-report-main-report/contigent-liability-report-main-report.component';
import { ContigentLiabilityReportComponent } from './contigent-liability-report/contigent-liability-report.component';
import { ContingentLiabilityReportMain1ReportComponent } from './contingent-liability-report-main-1-report/contingent-liability-report-main-1-report.component';
import { RiskAssetCombinedReportComponent } from './risk-asset-combined-report/risk-asset-combined-report.component';
import { CopyOfRiskAssetMainReportComponent } from './copy-of-risk-asset-main-report/copy-of-risk-asset-main-report.component';
import { RiskAssetCalcCombinedReportTeamComponent } from './risk-asset-calc-combined-report-team/risk-asset-calc-combined-report-team.component';
import { RiskAssetCalcCombinedReportComponent } from './risk-asset-calc-combined-report/risk-asset-calc-combined-report.component';
import { RiskAssetContigentReportMainComponent } from './risk-asset-contigent-report-main/risk-asset-contigent-report-main.component';
import { CopyOfRiskAssetByIfrsClassificationComponent } from './copy-of-risk-asset-by-ifrs-classification/copy-of-risk-asset-by-ifrs-classification.component';
import { ApprovalMonitoringComponent } from './approval-monitoring/approval-monitoring.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { InterestIncomeComponent } from './interest-income/interest-income.component';
import { OutOfCourtSettlementComponent } from './out-of-court-settlement/out-of-court-settlement.component';
import { CollateralSalesComponent } from './collateral-sales/collateral-sales.component';
import { RecoveryAgentUpdateComponent } from './recovery-agent-update/recovery-agent-update.component';
import { RecoveryCommissionComponent } from './recovery-commission/recovery-commission.component';
import { RecoveryAgentPerformanceComponent } from './recovery-agent-performance/recovery-agent-performance.component';
import { LitigationRecoveriesComponent } from './litigation-recoveries/litigation-recoveries.component';
import { RevalidationOfFullAndFinalSettlementComponent } from './revalidation-of-full-and-final-settlement/revalidation-of-full-and-final-settlement.component';
import { IdleAssetsSalesComponent } from './idle-assets-sales/idle-assets-sales.component';
import { FullAndFinalSettlementAndWaiversComponent } from './full-and-final-settlement-and-waivers/full-and-final-settlement-and-waivers.component';
import { AnalystReportComponent } from './analyst-report/analyst-report.component';
import { InsiderRelatedLoansComponent } from './loan-monitoring/insider-related-loans/insider-related-loans.component';
import { LoanStatusReportComponent } from './loan-monitoring/loan-status-report/loan-status-report.component';
import { CreditBureauComponent } from './loan-monitoring/credit-bureau/credit-bureau.component';
import { CollateralPerfectionComponent } from './collateral-reports/collateral-perfection/collateral-perfection.component';
import { CollateralRegisterComponent } from './collateral-reports/collateral-register/collateral-register.component';
import { FixedDepositCollateralComponent } from './collateral-reports/fixed-deposit-collateral/fixed-deposit-collateral.component';
import { ValidCollateralComponent } from './collateral-reports/valid-collateral/valid-collateral.component';
import { RecoveryDelinquentAccountsComponent } from './recovery-delinquent-accounts/recovery-delinquent-accounts.component';
import { PaydayLoanAllocationComponent } from './payday-loan-allocation/payday-loan-allocation.component';
import { ComputationForExternalAgentsComponent } from './computation-for-external-agents/computation-for-external-agents.component';
import { ComputationForInternalAgentsComponent } from './computation-for-internal-agents/computation-for-internal-agents.component';
import { RecoveryCollectionsReportComponent } from './recovery-collections-report/recovery-collections-report.component';
import { CorporateLoansReportComponent } from './loan-reports/corporate-loans-report/corporate-loans-report.component';
import { JobRequestReportComponent } from './loan-monitoring/job-request-report/job-request-report.component';
import { BondAndGuaranteeReportComponent } from './loan-monitoring/bond-and-guarantee-report/bond-and-guarantee-report.component';
import { EmployerRelatedLoansReportComponent } from './employer-related-loans-report/employer-related-loans-report.component';
import { ContingentsReoprtComponent } from './loan-monitoring/contingents-reoprt/contingents-reoprt.component';
import { DisbursedFacilityCollateralComponent } from './collateral-reports/disbursed-facility-collateral/disbursed-facility-collateral.component';
import { RacService } from 'app/setup/services/rac.service';
import { SubmissionOfOriginalDocumentsReportComponent } from './submission-of-original-documents-reports/submission-of-original-documents-report.component';
import { SecurityRelaeseReportComponent } from './security-release-report/security-release-report.component';
import { CorporateCustomerCreationComponent } from './corporate-customer-creation/corporate-customer-creation.component';
import { InsurancePolicyReportComponent } from './collateral-reports/insurance-policy-report/insurance-policy-report.component';
import { InsuranceSpoolReportComponent } from './insurance-spool-report/insurance-spool-report.component';
import { CollateralAdequacyComponent } from './collateral-reports/collateral-adequacy/collateral-adequacy.component';
import { AllDelinquentAccountsComponent } from './all-delinquent-accounts/all-delinquent-accounts.component';
import { AllDelinquentDigitalAccountsComponent } from './all-delinquent-digital-accounts/all-delinquent-digital-accounts.component';
import { StampDutyReportComponent } from './stamp-duty-report/stamp-duty-report.component';
//import { AvailmentUtilizationTicketComponent } from './availment-utilization-ticket/availment-utilization-ticket.component';



@NgModule({
    imports: [
        ButtonModule,PanelModule,InputMaskModule,
        SpinnerModule, PickListModule, FieldsetModule, AutoCompleteModule, GrowlModule, GMapModule,
        ReportRoutingModule, CommonModule, FormsModule,
        DataTableModule, SharedModule, DialogModule, CheckboxModule, TabViewModule,
        CalendarModule, ReactiveFormsModule, EditorModule, AccordionModule, ProgressBarModule,HttpClientModule
    ],
    declarations: [
        LoanWorkflowReportComponent, SectorLimitComponent, LoanDisburstmentReportComponent, CorporateLoansReportComponent,
        BranchLimitComponent, WorkflowDefinitionComponent, LoanScheduleReportComponent,
        CollateralPropertyRevaluationComponent, ExpiredSelfLiquidatingLoansComponent,
        LoanCovenantsApproachingDueDateComponent, NonPerformingLoansComponent, PostedTransactionsReportComponent,
        LoanCommercialReportComponent, EarnedUnearnedInterestReportComponent, TeamloansRevolvingFacilityReportComponent,
        ExpiredOverdraftLoansComponent, LoanStatementReportComponent, LoanAnniverseryReportComponent, LoanwaiverReportComponent,
        CollateralEstimatedReportComponent, fcyscheuledReportComponent, LienComponent, StakeholdersOnExpirationOfFtpComponent, LoanDeferralComponent, AuditTrailReportComponent, LoanDeferralMccComponent,
        FacilityApprovedNotUtilizedComponent, RuningLoansComponent, LoanInterestReceivablePayableComponent, CollateralVisitationComponent,
        TurnoverCovenantComponent, BondAndGuaranteeComponent, InsuranceExpirationComponent,
        SlaMonitoringComponent, BlacklistComponent, DailyAccrualComponent, JobRequestReportComponent,
        RepaymentComponent, CustomFacilityRepaymentComponent,InsurancePolicyReportComponent, StalledPerfectionComponent,
        CollateralPerfectionYettocommenceComponent, AllComercialLoanReportComponent,
        CashbackedComponent, UnearnedInterestComponent, ReceivableInterestComponent, 
        CashbackedBondGuaranteeComponent, WeeklyRecoveryReportFinconComponent, LoggingStatusComponent,
        CashCollaterizedCreditsComponent, StaffPrivilegeChangeComponent, UserGroupChangeReportComponent, ProfileActivityReportComponent, RunningFacilitiesComponent,
        StaffRoleProfileGroupReportComponent, StaffRoleProfileActivityReportComponent,
        InActiveContigentLiabilityReportComponent, MiddleOfficeReportComponent, CollateralValuationComponent, LoanClassificationReportComponent, AgeAnalysisReportComponent, CreditScheduleReportComponent,SanctionLimitReportComponent, ImpairedWatchListReportComponent, InsuranceReportComponent, ExcessReportComponent, ExpiredReportComponent, LoanDocumentWaivedComponent, LoanDocumentDeferredComponent, RuniningLoanReportComponent
        , MiddleOfficeReportComponent, CollateralValuationComponent, LoanClassificationReportComponent, AgeAnalysisReportComponent, CreditScheduleReportComponent,SanctionLimitReportComponent, ImpairedWatchListReportComponent, InsuranceReportComponent, ExcessReportComponent, ExpiredReportComponent, LoanDocumentWaivedComponent, LoanDocumentDeferredComponent, DisbursalCreditTurnoverComponent
        , MiddleOfficeReportComponent, CollateralValuationComponent, LoanClassificationReportComponent, AgeAnalysisReportComponent, CreditScheduleReportComponent, SanctionLimitReportComponent, ImpairedWatchListReportComponent, InsuranceReportComponent, ExcessReportComponent, ExpiredReportComponent, LoanDocumentWaivedComponent, LoanDocumentDeferredComponent, LoanBookingReportComponent, Form300bFacilityReportComponent,
        UnutilizedFacilityReportComponent, OriginalDocumentSubmissionReportComponent, RiskAssetsReportComponent, ContigentReportComponent, ExpiredFacilityReportComponent, OverlineReportComponent, LargeExposureReportComponent, ExtensionComponent, MaturityReportComponent, IfrsclassificationTeamComponent, RiskAssetByVarianceReportComponent, RiskAssetMainReportComponent, RiskAssetDistributionBySectorReportComponent, 
        RiskAssetByIfrsClassificationComponent, RiskAssetTeamReportComponent, UnpaidObligationReportComponent, RiskAssetMain1Component, CbnNplTeamReportComponent, RiskAssetByCbnNplClassificationReportComponent, ContigentLiabilityReportMainReportComponent, ContigentLiabilityReportComponent, ContingentLiabilityReportMain1ReportComponent, RiskAssetCombinedReportComponent, CopyOfRiskAssetMainReportComponent, 
        RiskAssetCalcCombinedReportTeamComponent, RiskAssetCalcCombinedReportComponent, RiskAssetContigentReportMainComponent, CopyOfRiskAssetByIfrsClassificationComponent, ApprovalMonitoringComponent, TrialBalanceComponent, InterestIncomeComponent, OutOfCourtSettlementComponent, CollateralSalesComponent, RecoveryAgentUpdateComponent, RecoveryCommissionComponent, RecoveryAgentPerformanceComponent, LitigationRecoveriesComponent, RevalidationOfFullAndFinalSettlementComponent, IdleAssetsSalesComponent, FullAndFinalSettlementAndWaiversComponent, AnalystReportComponent, InsiderRelatedLoansComponent, FixedDepositCollateralComponent, LoanStatusReportComponent,
        CreditBureauComponent, CollateralPerfectionComponent, CollateralRegisterComponent,CollateralAdequacyComponent, ValidCollateralComponent, RecoveryDelinquentAccountsComponent, PaydayLoanAllocationComponent, ComputationForExternalAgentsComponent, ComputationForInternalAgentsComponent, RecoveryCollectionsReportComponent, BondAndGuaranteeReportComponent, EmployerRelatedLoansReportComponent, ContingentsReoprtComponent,DisbursedFacilityCollateralComponent,
        SubmissionOfOriginalDocumentsReportComponent, SecurityRelaeseReportComponent,CorporateCustomerCreationComponent,InsuranceSpoolReportComponent, AllDelinquentAccountsComponent, AllDelinquentDigitalAccountsComponent, StampDutyReportComponent, 
    ], 
    exports: [],
    providers: [ApprovalService, LoanService, LoanApplicationService, ReportService, RacService,
        LoadingService, CollateralService, BranchService, ProductService,GeneralSetupService]

})

export class ReportModule { }
