import { CustomerFSCaptionService } from '../setup/services/customer-fscaption.service';
import { CustomerFinancialStatementComponent } from './components/customer-financial-statement/customer-financial-statement.component';
import { EditGroupCustomerInfoComponent } from '../customer/components/customer/edit-group-customer-info/edit-group-customer-info.component';
import { LoanApplicationDetailsViewComponent } from '../credit/loans/loan-application-details-view/loan-application-details-view.component';
import { CustomerSearchComponent, CustomerInformationComponent, CustomerInformationDetailComponent, CustomerGroupComponent } from '../customer/components';
import {
    DataTableModule, SharedModule, DialogModule,
    DropdownModule, CheckboxModule, TabViewModule, CalendarModule, EditorModule,
    AccordionModule,
    SplitButton,
    SplitButtonModule
} from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxListValueAccessorDirective } from './directives/checkbox-list-value-accessor';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageComponent } from './common/app.message.component';
import { ConfirmDialogComponent } from './common/app.confirmdialog.component';
import { FormatMoneyDirective } from './directives/formatmoney.onblur.directive';
import { SanitzeHtmlUrlPipe } from './pipes/sanitize-url.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CkeditorComponent } from './common/ckeditor.component';
import { PrintService } from './services/print.service';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { DocumentpUloadService } from './services/document-upload.service';
import { OfferLetterComponent } from './components/offer-letter/offer-letter.component';
import { ApprovalActionsComponent } from './components/approval-actions/approval-actions.component';
import { WorkflowRoutingComponent } from './components/workflow-routing/workflow-routing.component';
import { ApprovalCommentsComponent } from './components/approval-comments/approval-comments.component';
import { SimpleCustomerSearchComponent } from './components/search/customer-search/customer-search.component';
import { BranchSearchComponent } from './components/branch-search/branch-search.component';

import { FacilitySummaryComponent } from './components/facility-summary/facility-summary.component';
import { CreditConditionComponent } from './components/credit-conditions/credit-condition.component';
import { TranxDynamicsComponent } from './components/transaction-dynamics/transaction-dynamics.component';

import { AdditionalCommentComponent } from './components/additional-comment/additional-comment.component';
import { LoanAccreditedConsultantsComponent } from './components/loan-accredited-consultants/loan-accredited-consultants.component';
import { CollateralRecommendationComponent } from './components/collateral-recommendation/collateral-recommendation.component';
import { MonitoringTriggerComponent } from './components/monitoring-triggers/monitoring-triggers.component';
import { RepaymentTermsComponent } from './components/repayment-terms/repayment-terms.component';
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';
import { CasaAccountBalanceComponent } from './components/casa-account-balance/casa-account-balance.component';

import { DisbursedFacilityDetailComponent } from './components/disbursed-facility-detail/disbursed-facility-detail.component';
import { AuthorizationService } from '../admin/services';
import { CrmsRegulatoriesComponent } from './components/crms-regulatories/crms-regulatories.component';
import { CrmsService } from './services/crms.service';
import { DirectorRelatedCustomerComponent } from '../customer/components/customer/director-related-customer/director-related-customer.component';
import { IdleTimeoutService } from '../admin/services/idle-timeouter.service';
import { ScrollToTopComponent } from './common/scroll-to-top.component';
import { Form3800bLmsComponent } from './components/form-3800b-lms/form-3800b-lms.component';
import { Form3800bLosComponent } from './components/form-3800b-los/form-3800b-los.component';
import { TakeFeeSharedComponent } from './components/take-fee/take-fee-shared.component';
import { SheduleComponent } from 'app/credit/loans/schedule/schedule.component';
import { JobRequestComponent } from 'app/credit/job-request/job-request.component';
import { DepartmentService } from 'app/setup/services/department.service';
import { JobService } from 'app/credit/services/job.service';
import { RequestJobTypeService } from 'app/setup/services/request-job-type.service';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { CrmsRegulatoriesOperationsComponent } from './components/crms-regulatories/crms-regulatories-operations.component';
import { MappedLoanCollateralComponent } from './components/mapped-loan-collateral/mapped-loan-collateral.component';
import { AllContingentUsedComponent } from './components/all-contingent-used/all-contingent-used.component';
import { ContingentUsedDocumentComponent } from './components/contingent-used-document/contingent-used-document.component';
import { SuggestedConditionsComponent } from './components/suggested-conditions/suggested-conditions.component';
import { CreditRecommendedSuggestionsComponent } from './components/credit-recommendedsuggestions/credit-recommendedsuggestions.component';
import { DocumentUsageComponent } from './components/document-upload/document-usage.component';
import { RiskAcceptanceCriteriaComponent } from './components/risk-acceptance-criteria/risk-acceptance-criteria.component';
import { RiskAcceptanceCriteriaService } from './services/risk-acceptance-criteria.service';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { ApprovalCommentTabComponent } from './components/approval-comment-tab/approval-comment-tab.component';
import { RiskAcceptanceCriteriaDetailComponent } from './components/risk-acceptance-criteria-detail/risk-acceptance-criteria-detail.component';
import { WorkflowDecisionsComponent } from './workflow-decisions/workflow-decisions.component';
import { ReferBackComponent } from './components/refer-back/refer-back.component';
import { CkeditiorProjectComponent } from './common/ckeditior-project.component';
import { CkeditiorcbCallmemoComponent } from './common/ckeditiorcb-callmemo.component';
import { CkeditiorppCallmemoComponent } from './common/ckeditiorpp-callmemo.component';
import { CkeditiorruCallmemoComponent } from './common/ckeditiorru-callmemo.component';
import { CkeditiormhCallmemoComponent } from './common/ckeditiormh-callmemo.component';
import { ReassignRequestComponent } from './components/reassign-request/reassign-request.component';
import { CollateralSwapApprovalComponent } from 'app/approvals/components/loan-management/approvals/collateral-swap/collateral-swap-approval.component';
import { CollateralsProposedComponent } from 'app/credit/collateral/collaterals-proposed/collaterals-proposed.component';
import { CollateralInformationComponent } from 'app/credit/collateral/information/collateral-information.component';
import { CollateralInformationViewComponent } from 'app/credit/collateral/information/collateral-information-view.component';
import { CollateralFacilitiesComponent } from 'app/credit/collateral/collateral-facilities/collateral-facilities.component';
import { ApprovalMemoComponent } from './components/approval-memo/approval-memo.component';
import { NumberDirective } from './directives/numbers-only.directive';
import { AvailmentUtilizationTicketComponent } from 'app/reports/availment-utilization-ticket/availment-utilization-ticket.component';



// import { AppMenuComponent, AppSubMenuComponent } from './common/app.menu.component';


@NgModule({
    imports: [
        CommonModule,
        DataTableModule,
        SharedModule,
        DialogModule,
        DropdownModule,
        CheckboxModule,
        TabViewModule,
        CalendarModule,
        EditorModule,
        FormsModule,
        ReactiveFormsModule,
        AccordionModule,
        SplitButtonModule
    ],

    exports: [
        CreditRecommendedSuggestionsComponent,
        SuggestedConditionsComponent,
        MessageComponent,
        CheckboxListValueAccessorDirective,
        ConfirmDialogComponent,
        CustomerSearchComponent,
        FormatMoneyDirective,
        NumberDirective,
        SanitzeHtmlUrlPipe,
        TimeAgoPipe,
        CkeditorComponent,
        CkeditiorProjectComponent,
        CkeditiorcbCallmemoComponent,
        CkeditiorppCallmemoComponent,
        CkeditiorruCallmemoComponent,
        CkeditiormhCallmemoComponent,
        CustomerInformationComponent,
        CustomerInformationDetailComponent,
        LoanApplicationDetailsViewComponent,
        EditGroupCustomerInfoComponent,
        DocumentUploadComponent,
        ApprovalActionsComponent,
        ApprovalCommentsComponent,
        WorkflowRoutingComponent,
        CustomerFinancialStatementComponent,
        OfferLetterComponent,
        SimpleCustomerSearchComponent,
        BranchSearchComponent, FacilitySummaryComponent,
        CreditConditionComponent, TranxDynamicsComponent,
        CollateralRecommendationComponent, 
        AdditionalCommentComponent, 
        LoanAccreditedConsultantsComponent,
        MonitoringTriggerComponent,
        RepaymentTermsComponent,
        TwoFactorAuthComponent,
        CasaAccountBalanceComponent,
        DisbursedFacilityDetailComponent,
        CrmsRegulatoriesComponent,CrmsRegulatoriesOperationsComponent,
        DirectorRelatedCustomerComponent,
        ScrollToTopComponent,
        Form3800bLmsComponent,
        Form3800bLosComponent,
        TakeFeeSharedComponent,
        SheduleComponent,
        JobRequestComponent,
        MappedLoanCollateralComponent,
        AllContingentUsedComponent,
        ContingentUsedDocumentComponent,
        RiskAcceptanceCriteriaComponent,
        DocumentUsageComponent, ApprovalCommentTabComponent,
        RiskAcceptanceCriteriaDetailComponent,
        ReferBackComponent,
        ReassignRequestComponent,
        CollateralSwapApprovalComponent,
        CollateralsProposedComponent, 
        CollateralInformationComponent,
        CollateralInformationViewComponent,
        ApprovalMemoComponent,
        CollateralFacilitiesComponent,
        AvailmentUtilizationTicketComponent,
        SplitButtonModule

    ],

    declarations: [
        CreditRecommendedSuggestionsComponent,
        SuggestedConditionsComponent,
        MessageComponent,
        CheckboxListValueAccessorDirective,
        ConfirmDialogComponent,
        CustomerSearchComponent,
        CustomerGroupComponent,
        NumberDirective,
        FormatMoneyDirective,
        SanitzeHtmlUrlPipe,
        TimeAgoPipe,
        CkeditorComponent,
        CustomerInformationComponent,
        CustomerInformationDetailComponent,
        LoanApplicationDetailsViewComponent,
        EditGroupCustomerInfoComponent,
        DocumentUploadComponent,
        ApprovalActionsComponent,
        WorkflowRoutingComponent,
        ApprovalCommentsComponent,
        CustomerFinancialStatementComponent,
        OfferLetterComponent,
        SimpleCustomerSearchComponent,
        BranchSearchComponent,
        CreditConditionComponent, TranxDynamicsComponent,
        CollateralRecommendationComponent, FacilitySummaryComponent,
        MonitoringTriggerComponent, AdditionalCommentComponent, 
        LoanAccreditedConsultantsComponent,
        RepaymentTermsComponent,
        TwoFactorAuthComponent,
        CasaAccountBalanceComponent,
        DisbursedFacilityDetailComponent,
        CrmsRegulatoriesComponent,CrmsRegulatoriesOperationsComponent,
        DirectorRelatedCustomerComponent,
        ScrollToTopComponent,
        Form3800bLmsComponent,
        Form3800bLosComponent,
        TakeFeeSharedComponent,
        SheduleComponent,
        JobRequestComponent,
        MappedLoanCollateralComponent,
        AllContingentUsedComponent,
        ContingentUsedDocumentComponent,
        RiskAcceptanceCriteriaComponent,
        DocumentUsageComponent,
        ApprovalCommentTabComponent,
        RiskAcceptanceCriteriaDetailComponent,
        WorkflowDecisionsComponent,
        ReferBackComponent,
        CkeditiorProjectComponent,
        CkeditiorcbCallmemoComponent,
        CkeditiorppCallmemoComponent,
        CkeditiorruCallmemoComponent,
        CkeditiormhCallmemoComponent,
        ReassignRequestComponent,
        CollateralSwapApprovalComponent,
        CollateralsProposedComponent, 
        CollateralInformationViewComponent, 
        CollateralInformationComponent, 
        CollateralFacilitiesComponent,
        ApprovalMemoComponent,
        AvailmentUtilizationTicketComponent,
        // AppMenuComponent,
        // AppSubMenuComponent
    ],

    providers: [
        PrintService,
        DocumentpUloadService,
        CustomerFSCaptionService,
        AuthorizationService, CrmsService,
        IdleTimeoutService,
        DepartmentService,
        JobService,
        RequestJobTypeService,
        StaffRealTimeSearchService,
        RiskAcceptanceCriteriaService,
        CreditAppraisalService,

        
    ],
})
export class BankingSharedModule { }