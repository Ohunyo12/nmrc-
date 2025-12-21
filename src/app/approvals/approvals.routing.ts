import { FeeConcessionApprovalComponent } from './components/credit-management/approvals/fee-concession-approval.component';
import { CustomerApprovalComponent } from './components/admin/customer-approval/customer-approval.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../admin/guard/authentication.guard';
import {
    StaffApprovalComponent, ProductApprovalComponent, ChartOfAccountApprovalComponent,
    UsersApprovalComponent,  CustomerGroupApprovalComponent, ApprovalTrailComponent, PreliminaryEvaluationApprovalComponent,
    LoanRestructuringApprovalComponent, ContingentBookingApprovalComponent, FeeDeferralApprovalComponent,
    CollateralReleaseApprovalComponent, CollateralAssignmentApprovalComponent, ApproveOverrideComponent, LoanDisbursementComponent, TrancheDisbursementApprovalComponent,

} from './components';
import { ChecklistDeferralApprovalComponent } from './components/credit-management/approvals/checklist-deferral-approval.component';
import { ContingentUsageApprovalComponent } from './components/loan-management/contingentLiability/awaiting-approval-contingent-usage.component';
import { ContingentUsageAwaitingApprovalComponent } from './components/loan-management/contingentLiability/awaiting-approval-contingent-usage-list.component';
import { CollateralManagementComponent } from './components/loan-management/approvals/collateral-management/collateral-management.component';

import { StaffRoleApprovalComponent } from './components/admin/staff-role-approval/staff-role-approval.component';
import { ApproveReasignedAccountComponent } from './components/credit-management/approve-reassign-account/approve-reasign.component';
import { PolicyApprovalComponent } from './components/loan-management/approvals/collateral-management/policy-approval/policy-approval.component';
import { FeeChargeApprovalComponent } from './components/admin/fee-charge-approval/fee-charge-approval.component';
import { CamsolApprovalComponent } from './camsol-approval/camsol-approval.component';
import { ApprovalGroupModificationComponent } from 'app/approvals/components/admin/approval-group-modification/approval-group-modification.component';
import { ApprovalLevelModificationComponent } from 'app/approvals/components/admin/approval-level-modification/approval-level-modification.component';
import { ApprovalLevelStaffModificationComponent } from 'app/approvals/components/admin/approval-level-staff-modification/approval-level-staff-modification.component';
import { StaffReliefApprovalComponent } from 'app/approvals/components/staff-relief-approval/staff-relief-approval.component';
import { LoanApplicationCancellationComponent } from 'app/approvals/components/loan-application-cancellation/loan-application-cancellation.component';
import { AccreditedSolicitorsApprovalComponent } from 'app/approvals/components/accredited-solicitors-approval/accredited-solicitors-approval.component';
import { LineOperationApprovalComponent } from 'app/approvals/components/credit-management/approvals/line-operation-approval.component';
import { CommercialLoanReviewOperationsApprovalComponent } from 'app/approvals/components/credit-management/approvals/commercial-loan-operations-approval.component';
import { TakeFeeApprovalComponent } from './components/credit-management/approvals/take-fee-approval.component';
import { GlobalInterestRateChangeApprovalComponent } from './components/credit-management/approvals/global-interest-rate-change-approval.component';
import { CustomerGroupMappingApprovalComponent } from 'app/approvals/components/admin/customer-group-mapping/customergroupmapping-approval.component';
import { UserAccountStatusChangeApprovalComponent } from './components/admin/users/user-account-status-approval.component';
import { StaffDeleteApprovalComponent } from './components/admin/staff/staff-delete-approval.component';
import { LoanBookingVerificationComponent } from './components/credit-management/approvals/loan-booking-verification.component';
import {LoanRecoveryRepaymentApprovalComponent} from 'app/credit/loan-management/loan-recovery-repayment-approval/loan-recovery-repayment-approval.component'
import { CollateralInformationReleaseApprovalComponent } from './components/loan-management/approvals/collateral-information-release-approval.component';
import { OriginalDocumentApprovalComponent } from './components/original-document-approval/original-document-approval.component';
import { AdhocApprovalComponent } from 'app/credit/adhoc-approval/adhoc-approval.component';
import { AtcLodgementApprovalComponent } from './components/atc-lodgement-approval/atc-lodgement-approval.component';
import { AtcReleaseApprovalComponent } from './components/atc-release-approval/atc-release-approval.component';
import { ProjectSiteReportApprovalComponent } from './components/project-site-report-approval/project-site-report-approval.component';
import { LetterGenerationRequestApprovalComponent } from './components/letter-generation-request-approval/letter-generation-request-approval.component';
import { CollateralValuationApprovalComponent } from './components/collateral-valuation-approval/collateral-valuation-approval.component';

import { SecurityReleaseApprovalComponent } from './components/security-release-approval/security-release-approval.component';
import { CallMemoApprovalComponent } from './components/call-memo-approval/call-memo-approval.component';
import { BulkDisbursementApprovalComponent } from './components/credit-management/approvals/bulk-disbursement-approval.component';
import { DeferralDocumentApprovalComponent } from './components/deferral-document-approval/deferral-document-approval.component';
import { DeferralExtensionApprovalComponent } from './components/deferral-extension-approval/deferral-extension-approval.component';
import { BulkPrepaymentLoanApprovalComponent } from 'app/approvals/components/credit-management/approvals/bulk-prepayment-loan-approval/bulk-prepayment-loan-approval.component';
import { LienRemovalApprovalComponent } from './components/credit-management/approvals/lien-removal-approval/lien-removal-approval.component';
import { BulkRecoveryAssignmentToAgenApprovalComponent } from './components/credit-management/approvals/bulk-recovery-assignment-to-agen-approval/bulk-recovery-assignment-to-agen-approval.component';
import { CollateralSwapApprovalComponent } from './components/loan-management/approvals/collateral-swap/collateral-swap-approval.component';
import { ModifyFacilityApprovalComponent } from './components/modify-facility-approval/modify-facility-approval.component';
import { BulkRecoveryReportingApprovalComponent } from './components/credit-management/approvals/bulk-recovery-reporting-approval/bulk-recovery-reporting-approval.component';
import { BulkRecoveryCommissionApprovalComponent } from './components/credit-management/approvals/bulk-recovery-commission-approval/bulk-recovery-commission-approval.component';
import { ModifyLmsFacilityApprovalComponent } from './components/modify-lms-facility-approval/modify-lms-facility-approval.component';
import { CreditDocumentationFillingApprovalComponent } from './components/credit-documentation-filling-approval/credit-documentation-filling-approval.component';
import { RelatedEmployerApprovalComponent } from 'app/setup/components/related-employer-approval/related-employer-approval.component';
import { TrancheDrawdownApprovalComponent } from './components/credit-management/approvals/tranche-drawdown-approval.component';


import { ExceptionalLoanApprovalComponent } from './components/exceptional-loan-approval/exceptional-loan-approval.component';
import { BulkRecoveryUnassignmentFromAgentComponent } from './components/credit-management/approvals/bulk-recovery-unassignment-from-agent/bulk-recovery-unassignment-from-agent.component';
import { CashSecurityReleaseApprovalComponent } from './components/cash-security-release-approval/cash-security-release-approval.component';
import { BulkRetailRecoveryAssignmentToAgenApprovalComponent } from './components/credit-management/approvals/bulk-retail-recovery-assignment-to-agen-approval/bulk-retail-recovery-assignment-to-agen-approval.component';
import { BulkRetailRecoveryUnassignmentFromAgentComponent } from './components/credit-management/approvals/bulk-retail-recovery-unassignment-from-agent/bulk-retail-recovery-unassignment-from-agent.component';
import { ExceptionalLoanSearchComponent } from './components/exceptional-loan-search/exceptional-loan-search.component';
import { LmsLoanApplicationCancellationComponent } from './components/lms-loan-application-cancellation/lms-loan-application-cancellation.component';
import { InsuranceBulkUploadApprovalComponent } from './components/insurance-bulk-upload-approval/insurance-bulk-upload-approval.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'admin/staff', component: StaffApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['user setup approval'] }
            },
            {
                path: 'admin/staff-delete', component: StaffDeleteApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['user setup approval'] }
            },
            {
                path: 'admin/staff-role', component: StaffRoleApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['user-role setup approval'] }
            },
            {
                path: 'admin/fee-charge', component: FeeChargeApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['user-role setup approval'] }
            },

            {
                path: 'admin/customer', component: CustomerApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile approval'] }
            },
            {
                path: 'admin/related-employer', component: RelatedEmployerApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['related employer approval'] }
            },
            {
                path: 'admin/product', component: ProductApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['product setup approval'] }
            },
            {
                path: 'admin/chart-of-account', component: ChartOfAccountApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['chart of account setup approval'] }
            }, 
            {
                path: 'admin/users', component: UsersApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile approval'] }
            }, 
            {
                path: 'admin/user-account-status', component: UserAccountStatusChangeApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['user setup approval'] }
            }, 
            {
                path: 'admin/customer-group', component: CustomerGroupApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['customer group setup approval'] }
            },
            {
                path: 'admin/customer-group-mapping', component: CustomerGroupMappingApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['customer group setup approval'] }
            },
            {
                path: 'approval-trail', component: ApprovalTrailComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'loan-application-cancellation', component: LoanApplicationCancellationComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'lms-loan-application-cancellation', component: LmsLoanApplicationCancellationComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'approval-workflow-level', component: ApprovalLevelModificationComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'approval-level-staff', component: ApprovalLevelStaffModificationComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'staff-relief-approval', component: StaffReliefApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'accredited-solicitors-approval', component: AccreditedSolicitorsApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },           
            {
                path: 'approval-workflow-group', component: ApprovalGroupModificationComponent, canActivate: [AuthGuard],
                data: { activities: ['approval trail'] }
            },
            {
                path: 'credit/loan-disbursement', component: LoanDisbursementComponent, canActivate: [AuthGuard],
                data: { activities: ['loan disbursment'] }
            }, 
            {
                path: 'credit/bulk-loan-disbursement-approval', component: BulkDisbursementApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['loan disbursment'] }
            },
            {
                path: 'credit/loan-booking', component: ContingentBookingApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bonds and guarantee approver'] }
            }, 
            {
                path: 'credit/loan-booking-verification', component: LoanBookingVerificationComponent, canActivate: [AuthGuard],
                data: { activities: ['booking verifier'] }
            },
            {
                path: 'credit/loan-recovery-repayment-approval', component: LoanRecoveryRepaymentApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['booking verifier'] }
            },
            {
                path: 'credit/tranche-booking', component: TrancheDrawdownApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['drawdown approval'] }
            },
            // {
            //     path: 'loan-management/review-drawdown-approval', component: TrancheDrawdownApprovalComponent, canActivate: [AuthGuard],
            //     data: { activities: ['drawdown approval'] }
            // },

            {
                path: 'credit/adhoc-approvals', component: AdhocApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Adhoc Approval'] }
            },
            {
                path: 'credit/exceptional-loan-approval', component: ExceptionalLoanApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['exceptional loan approval'] }
            },
            {
                path: 'credit/exceptional-loan-search', component: ExceptionalLoanSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['exceptional loan approval'] }
            },
            {
                path: 'credit/fee-deferral', component: FeeDeferralApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit/preliminary-evaluation-note', component: PreliminaryEvaluationApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['pen approval'] }
            },
            {
                path: 'credit/checklist-deferral-approval', component: ChecklistDeferralApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist deferral approval'] }
            },
            {
                path: 'credit/loan-restructuring', component: LoanRestructuringApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['credit operations approval'] }
            },
            {
                path: 'credit/fee-concession-approval', component: FeeConcessionApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['concession approval'] }
            },
            {
                path: 'credit/collateral-release-approval', component: CollateralReleaseApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral release approval'] }
            },
            {
                path: 'credit/collateral-information-release-approval', component: CollateralInformationReleaseApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral release approval'] }
            },            
            {
                path: 'credit/override-approval', component: ApproveOverrideComponent, canActivate: [AuthGuard],
                data: { activities: ['override approval'] }
            },
            {
                path: 'credit/collateral-assignment-approval',
                component: CollateralAssignmentApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral assignment approval'] }
            },
            {
                path: 'credit/collateral-management-approval',
                component: CollateralManagementComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral approval'] }
            },
            {
                path: 'credit/collateral-item-policy-approval',
                component: PolicyApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral policy approval'] }
            },
            {
                path: 'credit/advance-payment-sum-approval',
                component: ContingentUsageAwaitingApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['aps approval'] }
            },
            {
                path: 'credit/reasign-account',
                component: ApproveReasignedAccountComponent, canActivate: [AuthGuard],
                data: { activities: ['reasigned accounts approval'] }
            },
            {
                path: 'credit/camsol-blackbook',
                component: CamsolApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['risk assessment'] }
            },
            {
                path: 'credit/line-operation-approval', component: LineOperationApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['credit operations approval'] }
            },
            {
                path: 'credit/commercial-loan-operations-approval', component: CommercialLoanReviewOperationsApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['credit operations approval'] }
            }, 
            {
                path: 'credit/take-fee-approval', component: TakeFeeApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['manual fee approval'] }
            },
            {
                path: 'credit/global-interest-rate-change-approval', component: GlobalInterestRateChangeApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['global interest rate change approval'] }
            },
            {
                path: 'credit/original-document-approval', component: OriginalDocumentApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['Original Document Approval'] }
            },
            {
                path: 'credit/atc-lodgement-approval', component: AtcLodgementApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['ATC Lodgement Approval'] }
            },
            {
                path: 'credit/app-atc-release-approval', component: AtcReleaseApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['ATC Release Approval'] }
            },
            {
                path: 'credit/modify-facility-approval', component: ModifyFacilityApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['Modify Facility'] }
            },
            {
                path: 'credit/modify-lms-facility-approval', component: ModifyLmsFacilityApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['Modify Facility'] }
            },
            {
                path: 'project-site-report-approval', component: ProjectSiteReportApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Project Site Report Approval'] }
            },
            {
                path: 'credit/insurance-bulk-upload-approval', component: InsuranceBulkUploadApprovalComponent , canActivate: [AuthGuard],
                data: { activities: ['insurance bulk upload approval'] }
            },
            {
                path: 'letter-generation-request-approval', component: LetterGenerationRequestApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['Letter Generation Request Approval'] }
            },
            {
                path: 'collateral-valuation-approval', component: CollateralValuationApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral valuation approval'] }
            },
            {
                path: 'collateral-swap-approval', component: CollateralSwapApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral swap approval'] }
            },
            {
                path: 'security-release-approval', component: SecurityReleaseApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['security release approval'] }
            },
            {
                path: 'cash-security-release-approval', component: CashSecurityReleaseApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['security release approval'] }
            },
            {
                path: 'call-memo-approval', component: CallMemoApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['call memo approval'] }
            },
            {
                path: 'deferral-document-approval', component: DeferralDocumentApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['deferred document approval'] }
            },
            {
                path: 'deferral-extension-approval', component: DeferralExtensionApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['deferral extension approval'] }
            },
            {
                path: 'bulk-prepayment-loan-approval', component: BulkPrepaymentLoanApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk liquidation approval'] }
            },
            {
                path: 'lien-removal-approval', component: LienRemovalApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['lien removal approval'] } 
            },
            {
                path: 'bulk-recovery-assignment-to-agen-approval', component: BulkRecoveryAssignmentToAgenApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk recovery assignment to agent approval'] } 
            },
            {
                path: 'bulk-retail-recovery-assignment-to-agen-approval', component: BulkRetailRecoveryAssignmentToAgenApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk retail recovery assignment to agent approval'] } 
            },
            {
                path: 'bulk-recovery-unassignment-from-agent', component: BulkRecoveryUnassignmentFromAgentComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk recovery unassignment from agent approval'] } 
            },
            {
                path: 'bulk-retail-recovery-unassignment-from-agent', component: BulkRetailRecoveryUnassignmentFromAgentComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk retail recovery unassignment from agent approval'] } 
            },
            {
                path: 'bulk-recovery-reporting-approval', component: BulkRecoveryReportingApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk recovery assignment to agent approval'] } 
            },
            {
                path: 'bulk-recovery-commission-approval', component: BulkRecoveryCommissionApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk recovery assignment to agent approval'] } 
            },
            {
                path: 'credit/credit-documentation-filling-approval', component: CreditDocumentationFillingApprovalComponent, canActivate: [AuthGuard],
                data: { activities: ['credit documentation approval'] } 
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApprovalsRoutingModule { }

export const routedComponents = [
    StaffApprovalComponent, StaffDeleteApprovalComponent, ProductApprovalComponent,
    ChartOfAccountApprovalComponent, UsersApprovalComponent, CustomerGroupApprovalComponent, CustomerGroupMappingApprovalComponent,
    ApprovalTrailComponent, ContingentBookingApprovalComponent, PreliminaryEvaluationApprovalComponent,
    LoanRestructuringApprovalComponent, CollateralReleaseApprovalComponent,CollateralInformationReleaseApprovalComponent, CollateralAssignmentApprovalComponent,
    ApproveOverrideComponent,AtcLodgementApprovalComponent,
    ContingentUsageAwaitingApprovalComponent, ContingentUsageApprovalComponent,
    ApproveReasignedAccountComponent
];
