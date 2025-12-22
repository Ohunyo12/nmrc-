import { LoanRecoverySetupComponent } from './components/loanrecovery-setup/loanrecoverysetup.component';
import { LoanApplicationService } from '../credit/services/loan-application.service';
import { MonitoringSetupService } from './services';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
//import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {
    DataTableModule, SharedModule, DialogModule, EditorModule, PickListModule,
    DropdownModule, CheckboxModule, TabViewModule, CalendarModule, RadioButtonModule,
    PanelModule, SpinnerModule, ChipsModule, TreeModule, AccordionModule, InputSwitchModule,
    //ColorPickerModule
} from 'primeng/primeng';
import { LoadingService } from '../shared/services/loading.service';
import { ValidationService } from '../shared/services/validation.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BankingSharedModule } from "../shared/shared.module";
import { SetupRoutingModule } from './setup.routing';

import { AccreditedConsultantsService } from './services/accredited-consultants.service';
import { DepartmentService } from './services';
import { ImageService } from '../shared/services/imageupload.service';
import { CustomFieldsService } from '../shared/services/customFields/custom-fields.service';
import { StaffRoleService } from './services';
import { ProductDefinitionEditComponent, ProductPriceIndexComponent } from './components';
import { AuthHttp } from '../admin/services/token.service';
import { AuthenticationService } from '../admin/services/authentication.service';

import { BranchService } from './services/branch.service';
import { LedgerService } from './services/ledger.service';
import { CustomerService } from '../customer/services/customer.service';
import { LoanService } from './services/loan.service';

import { StaffService } from '../admin/services/staff.service';

import { GeneralSetupService } from './services';
import { CustomerRealTimeSearchService } from '../credit/services/customer-realtime-search.service';
import { LoadProductDefinitionComponent } from './components';
import { CustomerGroupService } from '../customer/services/customer-group.service';

import { CustomerGroupFSCaptionDetailComponent } from './components';
import { RegionComponent } from './components/region/region.component';
import { MonitoringSetupComponent } from './components/monitoring-setup/monitoringsetup.component';
import { PrudentialGuidelinesComponent } from './components/prudential-guidelines/prudential-guidelines.component';
import { ViewFinancialStatementComponent } from './components/fs-caption/view-financial-statement/view-financial-statement.component';
import { LimitMaintenanceComponent } from './components/limit-maintenance/limitmaintenance.component';
import { LimitMaintenanceService } from './services/limit-maintenance.service';
import { LoanRecoverySetupService } from './services/loan-recovery-setup.service';
import { FinancialStatementComponent } from './components/fs-caption/view-financial-statement/financial-statement-ratio.component';
import { AlertInterfaceComponent } from './components/limit-and-monitoring-setting/alert-interface.component';
import { StaffReliefComponent } from './components/staff-relief/staff-relief.component';
import {
    CustomFieldTestComponent,
    ImageUploadComponent,
    LoanPrincipalComponent,
    ApprovedMarketComponent,
    EmployerSetupComponent,
    CityComponent,
    ProductEditComponent,
    ChartOfAccountComponent,
    CustomChartOfAccountComponent,
    ProductFeeComponent,
    ProductTypeComponent,
    ProductGroupComponent,
    ProductDefinitionComponent,
    ProductProcessComponent,
    ProductClassComponent,
    CompanyComponent,
    CustomFieldComponent,
    BranchComponent,
    ConditionPrecedentComponent,
    LedgerComponent,
    RiskScoringComponent,
    RiskIndexComponent,
    DocumentTemplateSetupComponent,
    CovenantTypeComponent,
    CustomerFSCaptionComponent,
    CustomerFSCaptionGroupComponent,
    CustomerFSCaptionDetailComponent,
    CustomerFSRatioCaptionComponent,
    CustomerFSRatioDetailComponent,
    LimitsComponent,
    ChecklistDefinitionComponent,
    ChecklistDetailComponent,
    CollateralSubTypeComponent,
    CollateralValuerComponent,
    CollateralTypeComponent,
    ChargeComponent,
    TaxComponent,
    RequestJobTypeComponent,
    ChecklistItemComponent,
    CustomerKYCComponent,
    ApprovalGroupComponent,
    ApprovalLevelComponent,
    ApprovalWorkflowComponent,
    ApprovalReliefComponent,
    BusinessRuleComponent,
    DepartmentComponent,
    DepartmentUnitComponent,
   
    EndOfDayProcessComponent,
    StateComponent,
    TransactionDynamicsComponent,
    ComplianceTimelineComponent,
    AccreditedSolicitorsComponent,
    AccreditedPrincipalsComponent,
    LimitDetailsComponent,
    CallLimitComponent
} from './components';

import {
    CallMemoService,
    EndOfDayService,
    MisInfoService,
    JobTitleService,
    CountryStateService,
    CollateralService,
    ProductService,
    ChartOfAccountService,
    CompanyService,
    ProductFeeService,
    CustomFieldService,
    ConditionPrecedentService,
    ProductTypeService,
    ProductGroupService,
    RiskRatingService,
    RiskIndexService,
    LoanCovenantService,
    ProductCategoryService,
    CurrencyService,
    ApprovalService,
    DealClassificationService,
    CustomerFSCaptionService,
    LimitsService,
    ChecklistService,
    StaffRealTimeSearchService,
    DocumentService,
    ChargeService,
    RequestJobTypeService,
} from './services';
import { StaffRoleSetupsComponent } from './components/staff-role-setups/staff-role-setups.component';
import { AdminService } from '../admin/services';
import { LocalGovtComponent } from './components/local-govt/local-govt.component';
import { JobRequestFeedbackComponent } from './components/job-request-feedback/job-request-feedback.component';
import { JobService } from '../credit/services';
import { FXAccountCreationComponent } from './components/finance/fx-account-creation/fx-account-creation.component';
import { FxAccountService } from './services/fx-account.service';
import { EgsChecklistDefinitionComponent } from './components/checklist/egs-checklist-definition.component';
import { StaffReportingLineComponent } from './components/staff-reporting-line/staff-reporting-line.component';
import { ProfileSetupComponent } from './components/profile-setting/profilesetting.component';
import { RegulatorySetupComponent } from './components/regulatory/regulatory-setup.component';
import { RegulatoryService } from './services/regulatory.service';
import { EmployerTypeComponent } from 'app/setup/components/employer-type/employer-type.component';
import { JobTypeAdminComponent } from './components/job-request/job-type-admin.component';
import { JobHubStaffComponent } from './components/job-request/job-hub-staff.component';
import { RacComponent } from './components/rac/rac.component';
import { RacService } from './services/rac.service';
import { ReferenceDocumentComponent } from './components/reference-document/reference-document.component';
import { EsgChecklistScoreComponent } from './components/checklist/esg-checklist-score.component';
import { WorkflowChangeComponent } from './components/approval/workflow-change/workflow-change.component';
import { DocumentUploadSetupComponent } from './components/document/document-upload-setup.component';
import { DocumentDefinitionComponent } from './components/product/document-definition.component';
import { DocumentMappingComponent } from './components/product/document-mapping.component';
import { AuthourisedSignatoryComponent } from './components/authourised-signatory/authourised-signatory.component';
import { LetterGenerationSearchComponent } from 'app/credit/letter-generation-search/letter-generation-search.component';
//import { InsuranceCompanyComponent } from './components/insurance/insurance-company/insurance-company.component';
import { AlertSetupComponent } from './components/alert-setup/alert-setup.component';
import { GreenRatingDefinitionComponent } from './components/checklist/green-rating-definition/green-rating-definition.component';
import { ApprovalSetupComponent } from './components/approval-setup/approval-setup.component';

import { OperationalFlowPageOrderComponent } from 'app/setup/components/operational-flow-page-order/operational-flow-page-order.component';
import { DataArchiveComponent } from './components/data-archive/data-archive.component';
import { ManualDataArchiveComponent } from './components/manual-data-archive/manual-data-archive.component';
import { ContractorCriteriaSetupComponent } from './components/contractor-criteria-setup/contractor-criteria-setup.component';
import { CollectionsRetailCronSetupComponent } from './components/collections-retail-cron-setup/collections-retail-cron-setup.component';
import { IblChecklistSetupComponent } from './components/ibl-checklist-setup/ibl-checklist-setup.component';
import { StampDutyConditionSetupComponent } from './components/stamp-duty-condition-setup/stamp-duty-condition-setup.component';
import { DigitalStampSetupComponent } from './components/digital-stamp-setup/digital-stamp-setup.component';
//import { DownPaymentComponent } from 'src/app/setup/components/down-payment-setup/down-payment-setup.component.ts';
import { DownPaymentComponent } from './components/down-payment-setup/down-payment-setup.component';
import { HousingExpenseDebitRatioComponent } from './components/house-expense-debit-ratio-setup/house-expense-debit-ratio-setup.component';
@NgModule({
    imports: [
        SetupRoutingModule,
        CommonModule,
        DataTableModule,
        SharedModule,
        DialogModule,
        ReactiveFormsModule, FormsModule,
        BankingSharedModule, EditorModule, AccordionModule,
        DropdownModule, CheckboxModule, TabViewModule, PickListModule,
        CalendarModule, RadioButtonModule, PanelModule, ChipsModule, TreeModule,InputSwitchModule
        //ColorPickerModule
    ],
    exports: [],
    declarations: [
        ProductTypeComponent, ProductGroupComponent, CompanyComponent,
         CustomFieldComponent, BranchComponent,
        RiskScoringComponent, ChartOfAccountComponent, CustomChartOfAccountComponent,
        ProductDefinitionComponent, DocumentDefinitionComponent,
         DocumentMappingComponent, CustomerKYCComponent,
        RiskIndexComponent, LedgerComponent, DocumentTemplateSetupComponent,
        RegulatorySetupComponent,ProductPriceIndexComponent,
        ProductEditComponent, ProductDefinitionEditComponent,
        CityComponent, CovenantTypeComponent, ApprovalGroupComponent,
        CustomerFSCaptionComponent, CustomerFSCaptionGroupComponent, 
        CustomerFSCaptionDetailComponent,
        CustomerFSRatioCaptionComponent, CustomerFSRatioDetailComponent, LimitsComponent,
        ChecklistDefinitionComponent, ChecklistDetailComponent, CustomFieldTestComponent,
        CollateralSubTypeComponent, CollateralValuerComponent, CollateralTypeComponent,
        ChargeComponent, TaxComponent, RequestJobTypeComponent, ChecklistItemComponent,
        ApprovalLevelComponent, ApprovalWorkflowComponent, 
        ApprovalReliefComponent, BusinessRuleComponent,
        DepartmentComponent, DepartmentUnitComponent,
        EndOfDayProcessComponent, 
        StateComponent, LoadProductDefinitionComponent, StaffReliefComponent,
        AccreditedPrincipalsComponent, 
        AccreditedSolicitorsComponent, LimitDetailsComponent,
         CallLimitComponent,
        ImageUploadComponent, ConditionPrecedentComponent, 
        CustomerGroupFSCaptionDetailComponent, LoanPrincipalComponent,
        ApprovedMarketComponent, MonitoringSetupComponent, PrudentialGuidelinesComponent
        , ProductProcessComponent, RegionComponent, EmployerSetupComponent, 
        ViewFinancialStatementComponent, LimitMaintenanceComponent,
        ProductFeeComponent, TransactionDynamicsComponent, ComplianceTimelineComponent,
        LoanRecoverySetupComponent, FinancialStatementComponent,
        AlertInterfaceComponent, StaffRoleSetupsComponent, ProductClassComponent,
         LocalGovtComponent, JobRequestFeedbackComponent, FXAccountCreationComponent, 
         EgsChecklistDefinitionComponent, StaffReportingLineComponent
        , ProfileSetupComponent, EmployerTypeComponent, JobTypeAdminComponent,
        JobHubStaffComponent,
        RacComponent,
        ReferenceDocumentComponent,
        EsgChecklistScoreComponent,
        WorkflowChangeComponent,
        DocumentUploadSetupComponent,
        AuthourisedSignatoryComponent,
        LetterGenerationSearchComponent,
        //InsuranceCompanyComponent,
        AlertSetupComponent,
        GreenRatingDefinitionComponent,
        ApprovalSetupComponent,
        OperationalFlowPageOrderComponent,
        DataArchiveComponent,
        ManualDataArchiveComponent,
        ContractorCriteriaSetupComponent,
        CollectionsRetailCronSetupComponent,
        IblChecklistSetupComponent,
        StampDutyConditionSetupComponent,
        DigitalStampSetupComponent,
        DownPaymentComponent,
        HousingExpenseDebitRatioComponent,

    ],

    providers: [
        LoadingService, CustomFieldService, BranchService, LedgerService, CustomerService,
        RiskRatingService, RiskIndexService, ValidationService, ApprovalService, DocumentService,
        ProductTypeService, ProductGroupService, ProductFeeService, ProductCategoryService,
        CompanyService, ChartOfAccountService, AuthenticationService, ProductService, StaffService,
        CollateralService, CurrencyService, AuthHttp, DealClassificationService, CountryStateService,
        StaffRoleService, JobTitleService, MisInfoService, LoanCovenantService, CustomerFSCaptionService,
        LoanService, LimitsService, ChecklistService, CustomFieldsService, StaffRealTimeSearchService,
        ImageService, ChargeService, RequestJobTypeService, DepartmentService, EndOfDayService,
        GeneralSetupService, CustomerRealTimeSearchService, CustomerGroupService, CallMemoService,
RegulatoryService,
        LimitMaintenanceService, LoanRecoverySetupService, ConditionPrecedentService, MonitoringSetupService,
        LoanApplicationService, AdminService, AccreditedConsultantsService, JobTitleService, JobService, FxAccountService,RacService

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SetupModule { 
    
}

