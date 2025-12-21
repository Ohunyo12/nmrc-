import { ChargeService } from '../setup/services/charge.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthHttp } from '../admin/services/token.service';
import { StaffService } from '../admin/services/staff.service';
import { ApprovalService } from '../setup/services/approval.service';
import { GeneralSetupService } from '../setup/services/general-setup.service';
import { ConditionPrecedentService, LedgerService } from '../setup/services';

import {
    StaffApprovalComponent, ProductApprovalComponent, ChartOfAccountApprovalComponent,UsersApprovalComponent, CustomerGroupApprovalComponent, ApprovalTrailComponent, PreliminaryEvaluationApprovalComponent,
    LoanRestructuringApprovalComponent, ContingentBookingApprovalComponent, FeeDeferralApprovalComponent,
    CollateralReleaseApprovalComponent, CollateralAssignmentApprovalComponent, ApproveOverrideComponent,  LoanDisbursementComponent, TrancheDisbursementApprovalComponent
} from './components';
import { ApprovalsRoutingModule } from './approvals.routing';
import { BankingSharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../admin/services/authentication.service';
import { NgModule } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { CommonModule } from '@angular/common';
import {
    DataTableModule, SharedModule, DialogModule,
    CheckboxModule, TabViewModule, CalendarModule, ScheduleModule, InputSwitchModule,
} from 'primeng/primeng';
import { ProductService } from '../setup/services/product.service';
import { ChartOfAccountService } from '../setup/services/chartofaccount.service';
import { AdminService } from '../admin/services/admin.service';
import { CustomerGroupService } from '../customer/services/customer-group.service';
import { DocumentService } from '../setup/services/document.service';
import { LoanApplicationService } from '../credit/services/loan-application.service';
import { LoanService } from '../credit/services/loan.service';
import { CreditAppraisalService } from '../credit/services/credit-appraisal.service';
import { CreditApprovalService } from '../credit/services/credit-approval.service';
import { LoanOperationService } from '../credit/services/loan-operations.service';
import { CollateralService } from '../setup/services/collateral.service';
import { AccordionModule } from 'primeng/primeng';
import { ChecklistDeferralApprovalComponent } from './components/credit-management/approvals/checklist-deferral-approval.component';
import { ChecklistService, CompanyService, BranchService, CountryStateService, StaffRoleService, LoanCovenantService, AccreditedConsultantsService } from '../setup/services';
import { OverrideService } from '../credit/services/override.service';
import { CustomerService } from '../customer/services/customer.service';
import { CustomerApprovalComponent } from './components/admin/customer-approval/customer-approval.component';
import { FeeConcessionApprovalComponent } from './components/credit-management/approvals/fee-concession-approval.component';
import { FeeConcessionService } from '../credit/services/fee-concession.service';
import { ContingentLoanService } from '../credit/loans/contingent-usage/contingentloan.service';
import { ContingentUsageAwaitingApprovalComponent } from './components/loan-management/contingentLiability/awaiting-approval-contingent-usage-list.component';
import { ContingentUsageApprovalComponent } from './components/loan-management/contingentLiability/awaiting-approval-contingent-usage.component';
import { CollateralManagementComponent } from './components/loan-management/approvals/collateral-management/collateral-management.component';
import { PolicyApprovalComponent } from './components/loan-management/approvals/collateral-management/policy-approval/policy-approval.component';

import { StaffRoleApprovalComponent } from './components/admin/staff-role-approval/staff-role-approval.component';
import { ApproveReasignedAccountComponent } from './components/credit-management/approve-reassign-account/approve-reasign.component';
import { LoanPrepaymentService } from '../credit/services/loan-prepayment.service';
import { LoanReviewApplicationService } from '../credit/services/loan-review-application.service';
import { FeeChargeApprovalComponent } from './components/admin/fee-charge-approval/fee-charge-approval.component';
import { CamsolApprovalComponent } from './camsol-approval/camsol-approval.component';
// import { CasaService } from './customer/services/casa.service';
import { AuthorizationService, ExchangeRateService } from '../admin/services';
import { ApprovalGroupModificationComponent } from './components/admin/approval-group-modification/approval-group-modification.component';
import { ApprovalLevelModificationComponent } from './components/admin/approval-level-modification/approval-level-modification.component';
import { ApprovalLevelStaffModificationComponent } from './components/admin/approval-level-staff-modification/approval-level-staff-modification.component';
import { StaffReliefApprovalComponent } from './components/staff-relief-approval/staff-relief-approval.component';
import { ReportService } from '../reports/service/report.service';
import { LoanApplicationCancellationComponent } from './components/loan-application-cancellation/loan-application-cancellation.component';
import { AccreditedSolicitorsApprovalComponent } from './components/accredited-solicitors-approval/accredited-solicitors-approval.component';
import { LineOperationApprovalComponent } from 'app/approvals/components/credit-management/approvals/line-operation-approval.component';
import { CommercialLoanReviewOperationsApprovalComponent } from 'app/approvals/components/credit-management/approvals/commercial-loan-operations-approval.component';
import { TakeFeeApprovalComponent } from './components/credit-management/approvals/take-fee-approval.component';
import { CurrencyService } from 'app/setup/services';
import { GlobalInterestRateChangeApprovalComponent } from './components/credit-management/approvals/global-interest-rate-change-approval.component';
import { CustomerGroupMappingApprovalComponent } from 'app/approvals/components/admin/customer-group-mapping/customergroupmapping-approval.component';
import { UserAccountStatusChangeApprovalComponent } from './components/admin/users/user-account-status-approval.component';
import { StaffDeleteApprovalComponent } from './components/admin/staff/staff-delete-approval.component';
import { LoanBookingVerificationComponent } from './components/credit-management/approvals/loan-booking-verification.component';
import { DateUtilService } from 'app/shared/services/dateutils';
import { CollateralInformationReleaseApprovalComponent } from './components/loan-management/approvals/collateral-information-release-approval.component';
import { OriginalDocumentApprovalComponent } from './components/original-document-approval/original-document-approval.component';
import { AdhocApprovalComponent } from 'app/credit/adhoc-approval/adhoc-approval.component';
import { AtcLodgementApprovalComponent } from './components/atc-lodgement-approval/atc-lodgement-approval.component';
import { AtcReleaseApprovalComponent } from './components/atc-release-approval/atc-release-approval.component';
import { ProjectSiteReportApprovalComponent } from './components/project-site-report-approval/project-site-report-approval.component';
import { ProjectSiteReportService } from 'app/credit/services/project-site-report.service';
import { LetterGenerationRequestApprovalComponent } from './components/letter-generation-request-approval/letter-generation-request-approval.component';
import { CollateralValuationApprovalComponent } from './components/collateral-valuation-approval/collateral-valuation-approval.component';
import { SecurityReleaseApprovalComponent } from './components/security-release-approval/security-release-approval.component';
import { LetterGenerationRequestService } from 'app/credit/services/letter-generation-request.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { CallMemoApprovalComponent } from './components/call-memo-approval/call-memo-approval.component';
import { BulkDisbursementApprovalComponent } from './components/credit-management/approvals/bulk-disbursement-approval.component';
import { LoanRecoveryRepaymentApprovalComponent } from 'app/credit/loan-management/loan-recovery-repayment-approval/loan-recovery-repayment-approval.component';
import { DeferralDocumentApprovalComponent } from './components/deferral-document-approval/deferral-document-approval.component';
import { DeferralExtensionApprovalComponent } from './components/deferral-extension-approval/deferral-extension-approval.component';
import { BulkPrepaymentLoanApprovalComponent } from './components/credit-management/approvals/bulk-prepayment-loan-approval/bulk-prepayment-loan-approval.component';
import { LienRemovalApprovalComponent } from './components/credit-management/approvals/lien-removal-approval/lien-removal-approval.component';
import { BulkRecoveryAssignmentToAgenApprovalComponent } from './components/credit-management/approvals/bulk-recovery-assignment-to-agen-approval/bulk-recovery-assignment-to-agen-approval.component';
import { BulkRecoveryReportingApprovalComponent } from './components/credit-management/approvals/bulk-recovery-reporting-approval/bulk-recovery-reporting-approval.component';
import { BulkRecoveryCommissionApprovalComponent } from './components/credit-management/approvals/bulk-recovery-commission-approval/bulk-recovery-commission-approval.component';
import { ModifyFacilityApprovalComponent } from './components/modify-facility-approval/modify-facility-approval.component';
// import { CallMemoApprovalComponent } from './call-memo/call-memo-approval/call-memo-approval.component';
import { ModifyLmsFacilityApprovalComponent } from './components/modify-lms-facility-approval/modify-lms-facility-approval.component';
import { CreditDocumentationFillingApprovalComponent } from './components/credit-documentation-filling-approval/credit-documentation-filling-approval.component';
import { CasaService } from 'app/customer/services/casa.service';
import { RelatedEmployerApprovalComponent } from 'app/setup/components/related-employer-approval/related-employer-approval.component';
import { TrancheDrawdownApprovalComponent } from './components/credit-management/approvals/tranche-drawdown-approval.component';
import { LoanReviewDrawdownApprovalComponent } from './components/credit-management/approvals/loan-review-drawdown-approval.component';

import { ExceptionalLoanApprovalComponent } from './components/exceptional-loan-approval/exceptional-loan-approval.component';
import { CreditModule } from 'app/credit/credit.module';
import { BulkRecoveryUnassignmentFromAgentComponent } from './components/credit-management/approvals/bulk-recovery-unassignment-from-agent/bulk-recovery-unassignment-from-agent.component';
import { CashSecurityReleaseApprovalComponent } from './components/cash-security-release-approval/cash-security-release-approval.component';
import { BulkRetailRecoveryAssignmentToAgenApprovalComponent } from './components/credit-management/approvals/bulk-retail-recovery-assignment-to-agen-approval/bulk-retail-recovery-assignment-to-agen-approval.component';
import { BulkRetailRecoveryUnassignmentFromAgentComponent } from './components/credit-management/approvals/bulk-retail-recovery-unassignment-from-agent/bulk-retail-recovery-unassignment-from-agent.component';
import { ExceptionalLoanSearchComponent } from './components/exceptional-loan-search/exceptional-loan-search.component';
import { LmsLoanApplicationCancellationComponent } from './components/lms-loan-application-cancellation/lms-loan-application-cancellation.component';
import { InsuranceBulkUploadApprovalComponent } from './components/insurance-bulk-upload-approval/insurance-bulk-upload-approval.component';
    

@NgModule({
    imports: [
        ApprovalsRoutingModule, CommonModule, FormsModule, BankingSharedModule,
        DataTableModule, SharedModule, DialogModule, CheckboxModule, TabViewModule,
        CalendarModule, ReactiveFormsModule, AccordionModule,
        CreditModule,InputSwitchModule
    ],
    exports: [LoanReviewDrawdownApprovalComponent],
    declarations: [
        StaffApprovalComponent, StaffDeleteApprovalComponent, ApprovalTrailComponent, ProductApprovalComponent,
        ChartOfAccountApprovalComponent, UsersApprovalComponent, CustomerGroupMappingApprovalComponent,
        UsersApprovalComponent, CustomerGroupApprovalComponent, PreliminaryEvaluationApprovalComponent,
        LoanRestructuringApprovalComponent, ContingentBookingApprovalComponent, FeeDeferralApprovalComponent,
        CollateralReleaseApprovalComponent,CollateralInformationReleaseApprovalComponent, CollateralAssignmentApprovalComponent,LineOperationApprovalComponent,
        CommercialLoanReviewOperationsApprovalComponent,
        ChecklistDeferralApprovalComponent, ApproveOverrideComponent, CustomerApprovalComponent, FeeConcessionApprovalComponent,
        ContingentUsageAwaitingApprovalComponent, ContingentUsageApprovalComponent, CollateralManagementComponent, PolicyApprovalComponent,
        StaffRoleApprovalComponent, ApproveReasignedAccountComponent,
        FeeChargeApprovalComponent, CamsolApprovalComponent,
        TrancheDisbursementApprovalComponent,
        ApprovalGroupModificationComponent,
        ApprovalLevelModificationComponent,
        ApprovalLevelStaffModificationComponent,
        StaffReliefApprovalComponent,
        LoanApplicationCancellationComponent,LmsLoanApplicationCancellationComponent, LoanBookingVerificationComponent,
        AccreditedSolicitorsApprovalComponent, UserAccountStatusChangeApprovalComponent,
        TakeFeeApprovalComponent, GlobalInterestRateChangeApprovalComponent, LoanDisbursementComponent,
        OriginalDocumentApprovalComponent,
        AdhocApprovalComponent,
        AtcLodgementApprovalComponent,
        AtcReleaseApprovalComponent,
        ProjectSiteReportApprovalComponent,
        LetterGenerationRequestApprovalComponent,
        CollateralValuationApprovalComponent,
        SecurityReleaseApprovalComponent,
        CallMemoApprovalComponent, 
        BulkDisbursementApprovalComponent, 
        LoanRecoveryRepaymentApprovalComponent, 
        DeferralDocumentApprovalComponent, 
        DeferralExtensionApprovalComponent, 
        BulkPrepaymentLoanApprovalComponent, 
        LienRemovalApprovalComponent, 
        BulkRecoveryAssignmentToAgenApprovalComponent, 
        BulkRecoveryReportingApprovalComponent, 
        BulkRecoveryCommissionApprovalComponent,
        ModifyFacilityApprovalComponent,
        ModifyLmsFacilityApprovalComponent,
        CreditDocumentationFillingApprovalComponent,
        RelatedEmployerApprovalComponent,
        TrancheDrawdownApprovalComponent,
        LoanReviewDrawdownApprovalComponent,
        ExceptionalLoanApprovalComponent,
        BulkRecoveryUnassignmentFromAgentComponent,
        CashSecurityReleaseApprovalComponent,
        BulkRetailRecoveryAssignmentToAgenApprovalComponent,
        BulkRetailRecoveryUnassignmentFromAgentComponent,
        ExceptionalLoanSearchComponent,
        InsuranceBulkUploadApprovalComponent
    ],
    providers: [
        LoadingService, AuthenticationService, StaffService, ApprovalService, GeneralSetupService,
        ProductService, ChartOfAccountService, AdminService, CustomerGroupService, DocumentService,
        LoanApplicationService, CreditAppraisalService, AuthHttp, LoanService, CreditApprovalService,
        LoanOperationService, CollateralService, ChecklistService, OverrideService, CustomerService,
        CompanyService, BranchService, CountryStateService, FeeConcessionService, ContingentLoanService,
        StaffRoleService, LoanPrepaymentService, ReportService, AccreditedConsultantsService, ConditionPrecedentService,
        LoanReviewApplicationService, ChargeService, LoanCovenantService, CasaService, AuthorizationService, CurrencyService, ExchangeRateService,
        DateUtilService, LedgerService, ProjectSiteReportService, LetterGenerationRequestService, ValidationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ApprovalsModule { }
