import { LoanDisburstmentReportComponent } from './loan-reports/loan-disburstment/loan-disburstment.report.component';
import { LoanScheduleReportComponent } from './loan-reports/loan-schedule/loan-schedule.report.component';
import { AuthGuard } from '../admin/guard/authentication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanWorkflowReportComponent } from './loan-workflow/loan-workflow-sla/loan-workflow-sla.report.component';
import { EarnedUnearnedInterestReportComponent } from './loan-reports/earned-unearned-interest/earned-unearned-interest.report.component';
import { LoanCommercialReportComponent } from './loan-reports/loan-commercial-loan/loan-commercial-loan.report.component';
import { TeamloansRevolvingFacilityReportComponent } from './loan-reports/teamloans-revolving-facility/teamloans-revolving-facility.report.component';
import { PostedTransactionsReportComponent } from './Finance-reports/posted-transaction/posted-transactions.component';
import { BranchLimitComponent } from './limit-monitoring/branch-limit/branch-limit.component';
import { SectorLimitComponent } from './limit-monitoring/secto-limit/sector-limit.component';
import { WorkflowDefinitionComponent } from './loan-workflow/workflow-definition/workflow-definition.component';
import {
    CollateralPropertyRevaluationComponent,
    LoanCovenantsApproachingDueDateComponent, NonPerformingLoansComponent, ExpiredOverdraftLoansComponent, ExpiredSelfLiquidatingLoansComponent
} from './loan-monitoring';
import { LoanStatementReportComponent } from './loan-reports/loan-statement/loan-statement.report.component';
import { LoanAnniverseryReportComponent } from './loan-reports/loan-Anniversery/loan-Anniversery.report.component';
import { LoanwaiverReportComponent } from './loan-reports/loan-waiver/loan-waiver.report.component';
import { CollateralEstimatedReportComponent } from './collateral-reports/collateral-estimated/collateral-estimated.report.component';
import { fcyscheuledReportComponent } from './loan-reports/loan-fcyscheuled/loan-fcyscheuled.report.component';
import { StakeholdersOnExpirationOfFtpComponent } from './loan-reports/stakeholders-on-expiration-of-ftp/stakeholders-on-expiration-of-ftp.component';
import { LoanDeferralComponent } from './loan-reports/loan-deferral/loan-deferral.component';
import { AuditTrailReportComponent } from './audit-trail-report/audit-trail-report.component';
import { LoanDeferralMccComponent } from './loan-reports/loan-deferral-mcc/loan-deferral-mcc.component';
import { FacilityApprovedNotUtilizedComponent } from './loan-reports/facility-approved-not-utilized/facility-approved-not-utilized.component';
import { LoanInterestReceivablePayableComponent } from './loan-reports/loan-interest-receivable-payable/loan-interest-receivable-payable.component';
import { RuningLoansComponent } from './loan-reports/commercial-loans/runing-loans.component';
import { BondAndGuaranteeComponent } from './loan-monitoring/bond-and-guarantee/bond-and-guarantee.component';
import { CollateralVisitationComponent } from './loan-monitoring/collateral-visitation/collateral-visitation.component';
import { InsuranceExpirationComponent } from './loan-monitoring/insurance-expiration/insurance-expiration.component';
import { TurnoverCovenantComponent } from './loan-monitoring/turnover-covenant/turnover-covenant.component';
import { SlaMonitoringComponent } from './loan-monitoring/sla-monitoring/sla-monitoring.component';
import { BlacklistComponent } from './loan-monitoring/blacklist/blacklist.component';
import { DailyAccrualComponent } from './Finance-reports/daily-accrual/daily-accrual.component';
import { CustomFacilityRepaymentComponent } from './Finance-reports/custom-facility-repayment/custom-facility-repayment.component';
import { RepaymentComponent } from './Finance-reports/repayment/repayment.component';
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
import { OriginalDocumentSubmissionReportComponent } from './original-document-submission/original-document-submission-report.component';
import { RiskAssetsReportComponent } from './risk-assets-report/risk-assets-report.component';
import { ContigentReportComponent } from './contigent-report/contigent-report.component';
import { ExpiredFacilityReportComponent } from './expired-facility-report/expired-facility-report.component';
import { LargeExposureReportComponent } from './large-exposure-report/large-exposure-report.component';
import { OverlineReportComponent } from './overline-report/overline-report.component';
import { ExtensionComponent } from './extension/extension.component';
import { MaturityReportComponent } from './maturity-report/maturity-report.component';
import { UnpaidObligationReportComponent } from './unpaid-obligation-report/unpaid-obligation-report.component';
import { RiskAssetTeamReportComponent } from './risk-asset-team-report/risk-asset-team-report.component';
import { RiskAssetMainReportComponent } from './risk-asset-main-report/risk-asset-main-report.component';
import { RiskAssetByVarianceReportComponent } from './risk-asset-by-variance-report/risk-asset-by-variance-report.component';
import { RiskAssetDistributionBySectorReportComponent } from './risk-asset-distribution-by-sector-report/risk-asset-distribution-by-sector-report.component';
import { RiskAssetByIfrsClassificationComponent } from './risk-asset-by-ifrs-classification/risk-asset-by-ifrs-classification.component';
import { IfrsclassificationTeamComponent } from './ifrsclassification-team/ifrsclassification-team.component';
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
import { EmployerRelatedLoansReportComponent } from './employer-related-loans-report/employer-related-loans-report.component';
import { BondAndGuaranteeReportComponent } from './loan-monitoring/bond-and-guarantee-report/bond-and-guarantee-report.component';
import { ContingentsReoprtComponent } from './loan-monitoring/contingents-reoprt/contingents-reoprt.component';
import { DisbursedFacilityCollateralComponent } from './collateral-reports/disbursed-facility-collateral/disbursed-facility-collateral.component';
import { SubmissionOfOriginalDocumentsReportComponent } from './submission-of-original-documents-reports/submission-of-original-documents-report.component';
import { SecurityRelaeseReportComponent } from './security-release-report/security-release-report.component';
import { CorporateCustomerCreationComponent } from './corporate-customer-creation/corporate-customer-creation.component';
import { InsurancePolicyReportComponent } from './collateral-reports/insurance-policy-report/insurance-policy-report.component';
import { InsuranceSpoolReportComponent } from './insurance-spool-report/insurance-spool-report.component';
import { CollateralAdequacyComponent } from './collateral-reports/collateral-adequacy/collateral-adequacy.component';
import { AllDelinquentAccountsComponent } from './all-delinquent-accounts/all-delinquent-accounts.component';
import { AllDelinquentDigitalAccountsComponent } from './all-delinquent-digital-accounts/all-delinquent-digital-accounts.component';
import { StampDutyReportComponent } from './stamp-duty-report/stamp-duty-report.component';

const routes: Routes = [
    {
        path: '', children: [
            {
                path: 'loan-workflow/application-sla', component: LoanWorkflowReportComponent, canActivate: [AuthGuard],
                data: { activities: ['workflow sla report'] }
            },
            {
                path: 'loan-workflow/sla-monitoring', component: SlaMonitoringComponent, canActivate: [AuthGuard],
                data: { activities: ['workflow sla report'] }
            },
            {
                path: 'loan-details/loan-disburstment', component: LoanDisburstmentReportComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursement'] }
            },

            {
                path: 'loan-details/running-facilities', component: RunningFacilitiesComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursement'] }
            },
            {
                path: 'loan-details/middle-office-report', component: MiddleOfficeReportComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursement'] }
            },
            {
                path: 'loan-details/collateral-valuation-report', component: CollateralValuationComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursement'] }
            },

            {
                path: 'loan-details/in-active-contigent-liability-report', component: InActiveContigentLiabilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursement'] }
            },
            {
                path: 'loan-details/credit-schedule-report',
                component: CreditScheduleReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/earned-unearned-interest', component: LoanWorkflowReportComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/term-revolving-loans', component: TeamloansRevolvingFacilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/loan-commercial-loan', component: LoanCommercialReportComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan-details/loan-schedule', component: LoanScheduleReportComponent, canActivate: [AuthGuard],
                data: { activities: ['repayment schedule'] }
            },
            {
                path: 'loan-Limit-monitoring/sectorial-limit', component: SectorLimitComponent, canActivate: [AuthGuard],
                data: { activities: ['sectorial limit report'] }
            },
            {
                path: 'loan-Limit-monitoring/branch-limit', component: BranchLimitComponent, canActivate: [AuthGuard],
                data: { activities: ['branch npl limit report'] }
            },
            {
                path: 'Workflow/definition', component: WorkflowDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['workflow definition report'] }
            },
            {
                path: 'finance/posted-transaction', component: PostedTransactionsReportComponent, canActivate: [AuthGuard],
                data: { activities: ['posted transaction report'] }
            },
            {
                path: 'finance/daily-interest-accrual', component: DailyAccrualComponent, canActivate: [AuthGuard],
                data: { activities: ['posted transaction report'] }
            },
            {
                path: 'finance/custom-factility-repayment', component: CustomFacilityRepaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['posted transaction report'] }
            },
            {
                path: 'collateral-reports/insurance-policy-report', component: InsurancePolicyReportComponent, canActivate: [AuthGuard],
                data: { activities: ['insurance policy report'] }
            },
            {
                path: 'finance/loan-repayment', component: RepaymentComponent, canActivate: [AuthGuard],
                data: { activities: ['posted transaction report'] }
            },
            {
                path: 'loan-monitoring/collateral-property-revaluation',
                component: CollateralPropertyRevaluationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral revaluation report'] }
            },
            {
                path: 'analyst-report',
                component: AnalystReportComponent, canActivate: [AuthGuard],
                data: { activities: ['analyst report'] }
            },
            {
                path: 'loan-monitoring/almost-due-covenants',
                component: LoanCovenantsApproachingDueDateComponent, canActivate: [AuthGuard],
                data: { activities: ['covenant report'] }
            },
            {
                path: 'loan-monitoring/non-performing-loans', component: NonPerformingLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['npl report'] }
            },
            {
                path: 'loan-monitoring/expired-overdraft-loans',
                component: ExpiredOverdraftLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['expired overdraft report'] }
            },
            {
                path: 'loan-monitoring/insider-related-loans',
                component: InsiderRelatedLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['insider related loans']}
            },
            {
                path: 'loan/loan-statement',
                component: LoanStatementReportComponent, canActivate: [AuthGuard],
                data: { activities: ['statement'] }
            },
            {
                path: 'loan-status-report',
                component: LoanStatusReportComponent, canActivate: [AuthGuard],
                data: { activities: ['loan status report']}
            },
            {
                path: 'loan/loan-LoanAnniversery', component: LoanAnniverseryReportComponent, canActivate: [AuthGuard],
                data: { activities: ['anniversary'] }
            },
            {
                path: 'loan/loan-waiver', component: LoanwaiverReportComponent, canActivate: [AuthGuard],
                data: { activities: ['waivers'] }
            },
            {
                path: 'loan/loan-document-waived', component: LoanDocumentWaivedComponent, canActivate: [AuthGuard],
                data: { activities: ['waived'] }
            },
            {
                path: 'loan/loan-document-deferred', component: LoanDocumentDeferredComponent, canActivate: [AuthGuard],
                data: { activities: ['deferred'] }
            },
            {
                path: 'loan/loan-deferral', component: LoanDeferralComponent, canActivate: [AuthGuard],
                data: { activities: ['deferrals'] }
            },
            {
                path: 'loan/loan-deferral-mcc', component: LoanDeferralMccComponent, canActivate: [AuthGuard],
                data: { activities: ['deferrals for mcc'] }
            },
            {
                path: 'loan/facility-approved-not-utilized', component: FacilityApprovedNotUtilizedComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/runing-loans', component: RuningLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/loan-interest-receivable', component: LoanInterestReceivablePayableComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'loan/collateral-estimated',
                component: CollateralEstimatedReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'loan/fixed-deposit-collateral',
                component: FixedDepositCollateralComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'loan/valid-collateral',
                component: ValidCollateralComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'loan/loan-fcyscheuled',
                component: fcyscheuledReportComponent, canActivate: [AuthGuard],
                data: { activities: ['scheduled fcy credit'] }
            },
            {
                path: 'loan/lien',
                component: LienComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }

            },
            {
                path: 'loan/expired-stakeholder-with-pnd',
                component: StakeholdersOnExpirationOfFtpComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan-monitoring/credit-bureau',
                component: CreditBureauComponent, canActivate: [AuthGuard],
                data: { activities: ['Credit Bureau report'] }
            },
            {
                path: 'loan/collateral-perfection',
                component: CollateralPerfectionComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral perfection report'] }
            },
            {
                path: 'loan/disbursed-facility-collateral-report',
                component: DisbursedFacilityCollateralComponent, canActivate: [AuthGuard],
                data: { activities: ['disbursed facility collateral report'] }
            },
            {
                path: 'loan/collateral-register',
                component: CollateralRegisterComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral register report'] }
            },
            {
                path: 'loan/collateral-adequacy',
                component: CollateralAdequacyComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral adequacy report'] }
            },
            {
                path: 'loan/bond-and-guarantee',
                component: BondAndGuaranteeComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/bond-and-guarantee-report',
                component: BondAndGuaranteeReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/contingents-report',
                component: ContingentsReoprtComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/collateral-visitation',
                component: CollateralVisitationComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/insurance-expiration',
                component: InsuranceExpirationComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/turnover-covenant',
                component: TurnoverCovenantComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'job-request-report',
                component: JobRequestReportComponent, canActivate: [AuthGuard],
                data: { activities: ['job request report'] }
            },
            {
                path: 'loan/expired-self-liquidating-loans',
                component: ExpiredSelfLiquidatingLoansComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/blacklist',
                component: BlacklistComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'admin/audit-trail-report',
                component: AuditTrailReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'admin/logging-status',
                component: LoggingStatusComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/stalled-perfection-report',
                component: StalledPerfectionComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'loan/collateral-perfection-yettocommence',
                component: CollateralPerfectionYettocommenceComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'loan/all-comercial-loan-report',
                component: AllComercialLoanReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },

            {
                path: 'loan/loan-classification-report',
                component: LoanClassificationReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },

            {
                path: 'loan/trial-balance-report',
                component: TrialBalanceComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },

            {
                path: 'loan/interest-income',
                component: InterestIncomeComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
            path: 'security-release-report',
            component: SecurityRelaeseReportComponent, canActivate: [AuthGuard],
            data: { activities: ['security release report'] }
            },

            //======================================================

            {
                path: 'out-of-court-settlement/out-of-court-settlement',
                component: OutOfCourtSettlementComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'collateral-sales/collateral-sales',
                component: CollateralSalesComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'recovery-agent-update/recovery-agent-update',
                component: RecoveryAgentUpdateComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'recovery-commission/recovery-commission',
                component: RecoveryCommissionComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'recovery-agent-performance/recovery-agent-performance',
                component: RecoveryAgentPerformanceComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'litigation-recoveries/litigation-recoveries',
                component: LitigationRecoveriesComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'revalidation-of-full-and-final-settlement/revalidation-of-full-and-final-settlement',
                component: RevalidationOfFullAndFinalSettlementComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'idle-assets-sales/idle-assets-sales',
                component: IdleAssetsSalesComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'full-and-final-settlement-and-waivers/full-and-final-settlement-and-waivers',
                component: FullAndFinalSettlementAndWaiversComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            //=====================================================

            //======================================================

            {
                path: 'recovery-delinquent-accounts/recovery-delinquent-accounts',
                component: RecoveryDelinquentAccountsComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'all-delinquent-accounts/all-delinquent-accounts',
                component: AllDelinquentAccountsComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'payday-loan-allocation/payday-loan-allocation',
                component: PaydayLoanAllocationComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'all-delinquent-digital-accounts/all-delinquent-digital-accounts',
                component: AllDelinquentDigitalAccountsComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'computation-for-external-agents/computation-for-external-agents',
                component: ComputationForExternalAgentsComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'computation-for-internal-agents/computation-for-internal-agents',
                component: ComputationForInternalAgentsComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'recovery-collections-report/recovery-collections-report',
                component: RecoveryCollectionsReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            
            //=====================================================

            {
                path: 'loan/age-analysis-report',
                component: AgeAnalysisReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'loan/runining-loan-report',
                component: RuniningLoanReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/disbursal-credit-turnover',
                component: DisbursalCreditTurnoverComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/impaired-watch-list-report',
                component: ImpairedWatchListReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/excess-report',
                component: ExcessReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/unutilized-facility-report',
                component: UnutilizedFacilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'loan/expired-report',
                component: ExpiredReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },

            {
                path: 'loan/insurance-report',
                component: InsuranceReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/sanction-limit-report',
                component: SanctionLimitReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },

            {
                path: 'loan/cashbacked-Report',
                component: CashbackedComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/unearned-interest-Report',
                component: UnearnedInterestComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/receivable-interest-Report',
                component: ReceivableInterestComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/cashbacked-bond-guarantee',
                component: CashbackedBondGuaranteeComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/weeklyrecovery-Reportfor-FINCON',
                component: WeeklyRecoveryReportFinconComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/cash-collaterized-credits',
                component: CashCollaterizedCreditsComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/dbn-data-report',
                component: CorporateCustomerCreationComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'loan/insurance-spool-report',
                component: InsuranceSpoolReportComponent, canActivate: [AuthGuard],
                data: { activities: ['reports'] }
            },
            {
                path: 'staff/staff-privilege-change',
                component: StaffPrivilegeChangeComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'staff/user-group-change-report',
                component: UserGroupChangeReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'staff/profile-activity-report',
                component: ProfileActivityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'staff/staff-role-profile-group-report',
                component: StaffRoleProfileGroupReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'staff/staff-role-profile-activity-report',
                component: StaffRoleProfileActivityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },

            {
                path: 'loan/loan-booking-report',
                component: LoanBookingReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/form300b-facility-report',
                component: Form300bFacilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/original-document-submission',
                component: OriginalDocumentSubmissionReportComponent, canActivate: [AuthGuard],
                data: { activities: ['audit trail report'] }
            },
            {
                path: 'loan/submission-of-original-documents-report',
                component:  SubmissionOfOriginalDocumentsReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-assets-report/risk-assets-report',
                component: RiskAssetsReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'contigent-report/contigent-report',
                component: ContigentReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'expired-Facility-report/expired-Facility-report',
                component: ExpiredFacilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'large-exposure-report/large-exposure-report',
                component: LargeExposureReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'overline-report/overline-report',
                component: OverlineReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'extension-report/extension-report',
                component: ExtensionComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'corporate-loans-report',
                component: CorporateLoansReportComponent, canActivate: [AuthGuard],
                data: { activities: ['corporate loans report'] }
            },
            {
                path: 'maturity-report/maturity-report',
                component: MaturityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'unpaid-obligation-report/unpaid-obligation-report',
                component: UnpaidObligationReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-asset-team-report/risk-asset-team-report',
                component: RiskAssetTeamReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-asset-main-report/risk-asset-main-report',
                component: RiskAssetMainReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'risk-asset-contigent-report-main/risk-asset-contigent-report-main',
                component: RiskAssetContigentReportMainComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'risk-asset-main1-report/risk-asset-main1-report',
                component: RiskAssetMainReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'cbn-npl-team-report/cbn-npl-team-report',
                component: CbnNplTeamReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'risk-asset-by-cbn-classification-report/risk-asset-by-cbn-classification-report',
                component: RiskAssetByCbnNplClassificationReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'contigent-liabilty-report-main-report/contigent-liabilty-report-main-report',
                component: ContigentLiabilityReportMainReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'contigent-liabilty-report-main1/contigent-liabilty-report-main1',
                component: ContingentLiabilityReportMain1ReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'copy-of-risk-asset-main-report/copy-of-risk-asset-main-report',
                component:CopyOfRiskAssetMainReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'copy-of-risk-asset-by-ifrs-classification/copy-of-risk-asset-by-ifrs-classification',
                component:CopyOfRiskAssetByIfrsClassificationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'contigent-liabilty/contigent-liabilty',
                component: ContigentLiabilityReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'risk-asset-by-variance-report/risk-asset-by-variance-report',
                component: RiskAssetByVarianceReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-asset-distribution-by-sector-report/risk-asset-distribution-by-sector-report',
                component: RiskAssetDistributionBySectorReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-asset-by-ifrs-classification-report/risk-asset-by-ifrs-classification-report',
                component: RiskAssetByIfrsClassificationComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },

            {
                path: 'ifrs-classification-team-report/ifrs-classification-team-report',
                component: IfrsclassificationTeamComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
              // 11-2-2019 available and very fine.
            {
                path: 'risk-asset-combined-report/risk-asset-combined-report',
                component:RiskAssetCombinedReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'calc-combine/calc-combine',
                component:RiskAssetCalcCombinedReportTeamComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'risk-calc-combine/risk-calc-combine',
                component:RiskAssetCalcCombinedReportComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral report'] }
            },
            {
                path: 'approval-monitoring',
                component:ApprovalMonitoringComponent, canActivate: [AuthGuard],
                data: { activities: ['workflow sla report'] }
            },
            {
                path: 'employer-related',
                component:EmployerRelatedLoansReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
            {
                path: 'stamp-duty',
                component:StampDutyReportComponent, canActivate: [AuthGuard],
                data: { activities: ['report'] }
            },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReportRoutingModule { }


export const routedComponents = [
    LoanWorkflowReportComponent, CollateralPropertyRevaluationComponent, ExpiredSelfLiquidatingLoansComponent,
    LoanCovenantsApproachingDueDateComponent, NonPerformingLoansComponent, ExpiredOverdraftLoansComponent
]
