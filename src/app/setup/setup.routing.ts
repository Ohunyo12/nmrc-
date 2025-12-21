import { JobRequestFeedbackComponent } from './components/job-request-feedback/job-request-feedback.component';
import { ProductClassComponent } from './components/product/product-class.component';
import { ViewFinancialStatementComponent } from './components/fs-caption/view-financial-statement/view-financial-statement.component';
import { AuthGuard } from '../admin/guard/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductFeeComponent, CollateralSubTypeComponent, CollateralValuerComponent, CollateralTypeComponent, BranchComponent, ProductTypeComponent, ProductGroupComponent, ProductDefinitionComponent, LedgerComponent, RiskScoringComponent, RiskIndexComponent, CovenantTypeComponent, CustomerFSCaptionComponent, CustomerFSCaptionDetailComponent, CustomerGroupFSCaptionDetailComponent, CustomerFSCaptionGroupComponent, CustomerFSRatioCaptionComponent, CustomerFSRatioDetailComponent, ChecklistDefinitionComponent, ChecklistDetailComponent, LimitsComponent, ChargeComponent, TaxComponent, RequestJobTypeComponent, CustomerKYCComponent, LoadProductDefinitionComponent, ProductProcessComponent, ProductPriceIndexComponent } from './components';
import { RegionComponent } from './components/region/region.component';
import { MonitoringSetupComponent } from './components/monitoring-setup/monitoringsetup.component';
import { LimitMaintenanceComponent } from './components/limit-maintenance/limitmaintenance.component';
import { PrudentialGuidelinesComponent } from './components/prudential-guidelines/prudential-guidelines.component';
import { LoanRecoverySetupComponent } from './components/loanrecovery-setup/loanrecoverysetup.component';
import { AlertInterfaceComponent } from './components/limit-and-monitoring-setting/alert-interface.component';
import { CallLimitComponent, ApprovedMarketComponent, LoanPrincipalComponent, EmployerSetupComponent, FinancialStatementComponent } from './components';

import {
    LimitDetailsComponent,
    AccreditedSolicitorsComponent,
    AccreditedPrincipalsComponent,
    StateComponent,
    EndOfDayProcessComponent,
    DepartmentComponent,
    DepartmentUnitComponent,
    ApprovalGroupComponent,
    ApprovalLevelComponent,BusinessRuleComponent,
    ApprovalWorkflowComponent,
    ApprovalReliefComponent,
    ImageUploadComponent,
    CustomFieldTestComponent,
    CompanyComponent,
    CityComponent,
    ProductDefinitionEditComponent,
    ProductEditComponent,
    CustomFieldComponent,
    ChartOfAccountComponent,
    CustomChartOfAccountComponent,
    ConditionPrecedentComponent,
    TransactionDynamicsComponent,
    ComplianceTimelineComponent
} from './components';
import { StaffRoleSetupsComponent } from './components/staff-role-setups/staff-role-setups.component';
import { LocalGovtComponent } from './components/local-govt/local-govt.component';
import { FXAccountCreationComponent } from './components/finance/fx-account-creation/fx-account-creation.component';
import { EgsChecklistDefinitionComponent } from './components/checklist/egs-checklist-definition.component';
import { StaffReportingLineComponent } from './components/staff-reporting-line/staff-reporting-line.component';
import { DocumentTemplateSetupComponent } from './components/document/document-template-setup.component';
import { RegulatorySetupComponent } from './components/regulatory/regulatory-setup.component';
import { JobTypeAdminComponent } from './components/job-request/job-type-admin.component';
import { JobHubStaffComponent } from './components/job-request/job-hub-staff.component';
import { RacComponent } from './components/rac/rac.component';
import { ReferenceDocumentComponent } from './components/reference-document/reference-document.component';
import { WorkflowChangeComponent } from './components/approval/workflow-change/workflow-change.component';
import { DocumentUploadSetupComponent } from './components/document/document-upload-setup.component';
import { DocumentDefinitionComponent } from './components/product/document-definition.component';
import { DocumentMappingComponent } from './components/product/document-mapping.component';
import { AuthourisedSignatoryComponent } from './components/authourised-signatory/authourised-signatory.component';
import { LetterGenerationSearchComponent } from 'app/credit/letter-generation-search/letter-generation-search.component';
//import { InsuranceCompanyComponent } from './components/insurance/insurance-company/insurance-company.component';
import { AlertSetupComponent } from './components/alert-setup/alert-setup.component';
import { StaffReliefComponent } from './components/staff-relief/staff-relief.component';
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

//import { OperationalFlowPageOrderComponent } from 'app/setup/components/operational-flow-page-order/operational-flow-page-order.component';


const routes: Routes = [
    {
        path: '',
        children: [

            {
                path: 'image-upload', component: ImageUploadComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'custom-fields-test', component: CustomFieldTestComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'cities', component: CityComponent, canActivate: [AuthGuard],
                data: { activities: ['city setup'] }
            },
            {
                path: 'company', component: CompanyComponent, canActivate: [AuthGuard],
                data: { activities: ['company setup'] }
            },
            // {
            //     path: 'job-request-feedback', component: JobRequestFeedbackComponent, canActivate: [AuthGuard],
            //     data: { activities: ['job request setup'] }
            // },
            {
                path: 'credit/job-type-admin', component: JobTypeAdminComponent, canActivate: [AuthGuard],
                data: { activities: ['job request setup'] }
            }, 
            {
                path: 'credit/job-hub-staff', component: JobHubStaffComponent, canActivate: [AuthGuard],
                data: { activities: ['job hub management'] }
            },
            {
                path: 'custom-field', component: CustomFieldComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'collateral/collateral-sub-type', component: CollateralSubTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral sub-type setup'] }
            },
            {
                path: 'collateral/collateral-valuer', component: CollateralValuerComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'collateral/collateral-type', component: CollateralTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral type setup'] }
            },
            {
                path: 'branch', component: BranchComponent, canActivate: [AuthGuard],
                data: { activities: ['branch setup'] }
            },
            {
                path: 'region', component: RegionComponent, canActivate: [AuthGuard],
                data: { activities: ['region setup'] }
            },
            {
                path: 'finance/account-chart', component: ChartOfAccountComponent, canActivate: [AuthGuard],
                data: { activities: ['chart of account'] }
            },
            {
                path: 'finance/custom-account-chart', component: CustomChartOfAccountComponent, canActivate: [AuthGuard],
                data: { activities: ['chart of account'] }
            },
            {
                path: 'finance/ledger', component: LedgerComponent, canActivate: [AuthGuard],
                data: { activities: ['ledger account type'] }
            },
            {
                path: 'product/product-fee', component: ProductFeeComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'customer/customer-kyc', component: CustomerKYCComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'product/product-type', component: ProductTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['product type setup'] }
            },
            {
                path: 'product/product-group', component: ProductGroupComponent, canActivate: [AuthGuard],
                data: { activities: ['product group setup'] }
            },
            {
                path: 'product/product-definition', component: ProductDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['product definition setup'] }
            },
            {
                path: 'product/document-definition', component: DocumentDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['document definition setup'] }
            },
            {
                path: 'product/document-mapping', component: DocumentMappingComponent, canActivate: [AuthGuard],
                data: { activities: ['document mapping setup'] }
            },
            {
                path: 'product/product-maintenance', component: ProductEditComponent, canActivate: [AuthGuard],
                data: { activities: ['product maintenance setup'] }
            },
            {
                path: 'product/product-price-index', component: ProductPriceIndexComponent, canActivate: [AuthGuard],
                data: { activities: ['product definition setup'] }
            },            
            {
                path: 'product/product/feeSecurity/:productId', component: ProductDefinitionEditComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'risk/risk-scoring', component: RiskScoringComponent, canActivate: [AuthGuard],
                data: { activities: ['risk scoring'] }
            },
            {
                path: 'risk/risk-index', component: RiskIndexComponent, canActivate: [AuthGuard],
                data: { activities: ['risk index'] }
            },
            {
                path: 'branch', component: BranchComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'staff-role', component: StaffRoleSetupsComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'staff-supervisor-reporting', component: StaffReportingLineComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'department', component: DepartmentComponent, canActivate: [AuthGuard],
                data: { activities: ['department setup'] }
            },
            {
                path: 'units', component: DepartmentUnitComponent, canActivate: [AuthGuard],
                data: { activities: ['unit setup'] }
            },
            {
                path: 'state', component: StateComponent, canActivate: [AuthGuard],
                data: { activities: ['state setup'] }
            },
            {
                path: 'local-govt', component: LocalGovtComponent, canActivate: [AuthGuard],
                data: { activities: ['users', 'super admin'] }
            },
            {
                path: 'end-of-day', component: EndOfDayProcessComponent, canActivate: [AuthGuard],
                data: { activities: ['eod process'] }
            },
            {
                path: 'charge/charge', component: ChargeComponent, canActivate: [AuthGuard],
                data: { activities: ['fee and charge setup'] }
            },
            {
                path: 'charge/fx-account-creation', component: FXAccountCreationComponent, canActivate: [AuthGuard],
                data: { activities: ['fee and charge setup'] }
            },
            {
                path: 'stamp-duty-condition', component: StampDutyConditionSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['fee and charge setup'] }
            },
            {
                path: 'charge/tax', component: TaxComponent, canActivate: [AuthGuard],
                data: { activities: ['tax setup'] }
            },
            {
                path: 'document/document-template-setup', component: DocumentTemplateSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['document repository setup'] }
            },
            {
                path: 'reference-document', component: ReferenceDocumentComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral sub-type setup'] }
            },
            {
                path: 'approval-group', component: ApprovalGroupComponent, canActivate: [AuthGuard],
                data: { activities: ['approval group'] }
            },
            {
                path: 'approval-level', component: ApprovalLevelComponent, canActivate: [AuthGuard],
                data: { activities: ['approval level'] }
            },
            {
                path: 'approval-level-rule', component: BusinessRuleComponent, canActivate: [AuthGuard],
                data: { activities: ['approval level'] }
            },
            {
                path: 'approval-workflow', component: ApprovalWorkflowComponent, canActivate: [AuthGuard],
                data: { activities: ['approval workflow'] }
            },

            {
                path: 'approval-workflowchange', component: WorkflowChangeComponent, canActivate: [AuthGuard],
                data: { activities: ['approval workflow'] }
            },

            {
                path: 'approval-relief', component: ApprovalReliefComponent, canActivate: [AuthGuard],
                data: { activities: ['approval relief'] }
            },
            {
                path: 'staff-relief', component: StaffReliefComponent, canActivate: [AuthGuard],
                data: { activities: [] }
            },
            {
                path: 'credit/customer-fscaption', component: CustomerFSCaptionComponent, canActivate: [AuthGuard],
                data: { activities: ['fs caption'] }
            },
            {
                path: 'credit/customer-fscaption-group', component: CustomerFSCaptionGroupComponent, canActivate: [AuthGuard],
                data: { activities: ['fs caption-group'] }
            },
            {
                path: 'credit/customer-fscaption-detail', component: CustomerFSCaptionDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['customer caption detail'] }
            },
            {
                path: 'credit/view-financial-statement', component: ViewFinancialStatementComponent, canActivate: [AuthGuard],
                data: { activities: ['view financial statement'] }
            },
            {
                path: 'credit/financial-statement', component: FinancialStatementComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit/customer-group-fscaption-detail', component: CustomerGroupFSCaptionDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['group caption-detail'] }
            },
            {
                path: 'credit/customer-fsratio-caption', component: CustomerFSRatioCaptionComponent, canActivate: [AuthGuard],
                data: { activities: ['fs ratio-caption'] }
            },
            {
                path: 'credit/customer-fsratio-detail', component: CustomerFSRatioDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['fs ratio-detail'] }
            },
            {
                path: 'credit/checklist-definition', component: ChecklistDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/rac', component: RacComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/contractor-criteria-setup', component: ContractorCriteriaSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/ibl-checklist-setup', component: IblChecklistSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/collections-retail-cron-setup', component: CollectionsRetailCronSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['retail collection cron job'] }
            },
            {
                path: 'credit/esg-checklist-definition', component: EgsChecklistDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/green-rating-definition', component: GreenRatingDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['checklist definition setup'] }
            },
            {
                path: 'credit/checklist-details', component: ChecklistDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit/covenant-type', component: CovenantTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['covenant types setup'] }
            },
            {
                path: 'credit/limits', component: LimitsComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit/limit-details', component: LimitDetailsComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'credit/call-limit', component: CallLimitComponent, canActivate: [AuthGuard],
                data: { activities: ['call limit setup'] }
            },
            {
                path: 'credit/job-request-feedback', component: JobRequestFeedbackComponent, canActivate: [AuthGuard],
                data: { activities: ['job request setup'] }
            },
            {
                path: 'credit/condition-precedent', component: ConditionPrecedentComponent, canActivate: [AuthGuard],
                data: { activities: ['default conditions setup'] }
            },
            {
                path: 'credit/transaction-dynamics', component: TransactionDynamicsComponent, canActivate: [AuthGuard],
                data: { activities: ['transaction dynamics setup'] }
            },
            {
                path: 'credit/compliance-timeline', component: ComplianceTimelineComponent, canActivate: [AuthGuard],
                data: { activities: ['compliance timeline setup'] }
            },
            {
                path: 'request-job-type', component: RequestJobTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            
            {
                path: 'accredited-principals', component: AccreditedPrincipalsComponent, canActivate: [AuthGuard],
                data: { activities: ['accredited consultants'] }
            },
            {
                path: 'accredited-solicitors', component: AccreditedSolicitorsComponent, canActivate: [AuthGuard],
                data: { activities: ['accredited consultants'] }
            },
            {
                path: 'load-product-definition', component: LoadProductDefinitionComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'monitoringsetup', component: MonitoringSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['maturity instruction setup'] }
            },
            {
                path: 'limitmaintenance', component: LimitMaintenanceComponent, canActivate: [AuthGuard],
                data: { activities: ['limit maintenance'] }
            },
            {
                path: 'product/product-process', component: ProductProcessComponent, canActivate: [AuthGuard],
                data: { activities: ['product process setup'] }
            },
            {
                path: 'product/product-class', component: ProductClassComponent, canActivate: [AuthGuard],
                data: { activities: ['product class setup'] }
            },
            {
                path: 'credit/approved-market', component: ApprovedMarketComponent, canActivate: [AuthGuard],
                data: { activities: ['approved fts markets setup'] }
            },
            {
                path: 'credit/loan-principal', component: LoanPrincipalComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'setup/employer-setup', component: EmployerSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['approved employers setup'] }
            },
            {
                path: 'credit/prudential-guideline-setup', component: PrudentialGuidelinesComponent, canActivate: [AuthGuard],
                data: { activities: ['prudential guidelines setup'] }
            },
            {
                path: 'loanrecoverysetup', component: LoanRecoverySetupComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'alertMessages', component: AlertInterfaceComponent, canActivate: [AuthGuard],
                data: { activities: ['email alert setup'] }
            },
            {
                path: 'regulatory/regulatory-setup', component: RegulatorySetupComponent, canActivate: [AuthGuard],
                data: { activities: ['collateral sub-type setup'] }
            },

            {
                path: 'document/upload-setup', component: DocumentUploadSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['document upload setup'] }
            },
            {
                path: 'digital-stamp/setup', component: DigitalStampSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['document upload setup'] }
            },
            {
                path: 'signatory/signatory-setup', component: AuthourisedSignatoryComponent, canActivate: [AuthGuard],
                data: { activities: ['authoried signatories'] }
            },
            {
                path: 'letter-generation-search', component: LetterGenerationSearchComponent, canActivate: [AuthGuard],
                data: { activities: ['Letter Generation Completed',
                                    'Letter Generation Request',
                                    'Letter Generation Request Approval'] }
            },
            // {
            //     path: 'insurance-setup', component: InsuranceCompanyComponent, canActivate: [AuthGuard],
            //     data: { activities: ['insurance setup'] }
            // },
            {
                path: 'approval-setup', component: ApprovalSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['approval setup'] }
            },
            // { 
            //     path: 'operational-flowpage', component: OperationalFlowPageOrderComponent, canActivate: [AuthGuard],
            //     data: { activities: ['operational flowpage'] }
            // },
            {
                path: 'alert-setup', component: AlertSetupComponent, canActivate: [AuthGuard],
                data: { activities: ['document upload setup'] }
            },
            {
                path: 'data-archive', component: DataArchiveComponent, canActivate: [AuthGuard],
                data: { activities: ['data archive'] }
            },
            {
                path: 'manual-data-archive', component: ManualDataArchiveComponent, canActivate: [AuthGuard],
                data: { activities: ['manual data archive'] }
            }              
           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SetupRoutingModule { }

export const routedComponents = [
    BranchComponent, ChartOfAccountComponent, ChartOfAccountComponent, LedgerComponent, CustomFieldComponent,
    ProductFeeComponent, ProductTypeComponent, ProductDefinitionComponent, TaxComponent,
    ProductGroupComponent, ApprovalLevelComponent,BusinessRuleComponent, DocumentTemplateSetupComponent, CollateralTypeComponent,
    RiskScoringComponent, RiskIndexComponent, CityComponent, CovenantTypeComponent, TransactionDynamicsComponent,
    ComplianceTimelineComponent,
    CompanyComponent, CustomerFSCaptionComponent, CustomerFSCaptionDetailComponent,
    CustomerFSCaptionGroupComponent, CustomerFSRatioCaptionComponent, CustomerFSRatioDetailComponent,
    LimitsComponent, CustomFieldTestComponent, CollateralSubTypeComponent, CollateralValuerComponent,
    RequestJobTypeComponent, ApprovalWorkflowComponent, ApprovalReliefComponent, LoadProductDefinitionComponent,
    LoadProductDefinitionComponent, ImageUploadComponent, ConditionPrecedentComponent, ProductProcessComponent,
    CustomerGroupFSCaptionDetailComponent, LoanPrincipalComponent, ApprovedMarketComponent,
    EmployerSetupComponent, PrudentialGuidelinesComponent, FinancialStatementComponent
];

