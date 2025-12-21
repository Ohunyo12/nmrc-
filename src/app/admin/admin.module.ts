import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
    DataTableModule, SharedModule, DialogModule,
    DropdownModule, CheckboxModule, TabViewModule, CalendarModule, EditorModule,
    AccordionModule,
    InputSwitchModule,
    PickListModule
} from 'primeng/primeng';
import { BankingSharedModule } from "../shared/shared.module";
import { LoadingService } from '../shared/services/loading.service';
import { AdminRoutingModule } from './admin.routing';
import { AuthGuard } from './guard/authentication.guard';
import {
    AuditTrailComponent,
    ExchangeRateComponent,
    GroupComponent,
    GroupActivityComponent,
    UsersComponent,
    StaffComponent,
    StaffSignatureComponent,
    UserAdministrationComponent,
    OfficerRiskRatingComponent
} from './components';
import {
    AdminService, ExchangeRateService, StaffService,
    AuthenticationService, AuthorizationService, AuthHttp
} from './services';
import { MisInfoService } from '../setup/services/misinfo.service';
import { StaffRoleService } from '../setup/services/staff-role.service';
import { JobTitleService } from '../setup/services/jobtitle.service';
import { CountryStateService } from '../setup/services/state-country.service';
import { UtilityService } from '../shared/services/util.service';
import { DepartmentService } from '../setup/services/department.service';
import { CompanyService } from '../setup/services/company.service';
import { BranchService } from '../setup/services/branch.service';
import { StaffRealTimeSearchService } from '../setup/services/staff-realtime-search.service'; 
import { CrmsService } from '../shared/services/crms.service';
import { ProfileSettingComponent } from 'app/admin/components/profilesettings/profile-settings.component';
import { ApiLogComponent } from './api-log/api-log.component';
import { ApplicationErrorLogComponent } from './application-error-log/application-error-log.component';
import { BatchPostingDetailComponent } from './batch-posting/batch-posting-detail/batch-posting-detail.component';
import { BatchPostingMainComponent } from './batch-posting/batch-posting-main/batch-posting-main.component';
import { LoanService, GeneralSetupService } from 'app/setup/services';
import { RefreshStagingMonitoringComponent } from './batch-posting/batch-posting-monitoring/refresh-staging-monitoring.component';
import { DeletedStaffLogComponent } from './components/deleted-staff-log/deleted-staff-log.component';
import { DormantStaffLogComponent } from './components/dormant-staff-log/dormant-staff-log.component';
import { BulkDisbursementComponent } from './components/bulk-disbursement/bulk-disbursement.component';
import { ExternalUrlComponent } from './components/external-url/external-url.component';
import { SupportUtilityStaffComponent } from './components/support-utility-staff/support-utility-staff.component';
import { SupportUtilityCustomerComponent } from './components/support-utility-customer/support-utility-customer.component';
import { SupportUtilityWorkflowComponent } from './components/support-utility-workflow/support-utility-workflow.component';
import { CreditModule } from 'app/credit/credit.module';

//import { DormantStaffLogComponent } from './components/dormant-staff-log/dormant-staff-log.component';




@NgModule({
    imports: [
        AdminRoutingModule, FormsModule, CommonModule, BankingSharedModule, ReactiveFormsModule,
        DataTableModule,
        SharedModule, DialogModule,
        DropdownModule,PickListModule,
        CheckboxModule,
        TabViewModule, CalendarModule, AccordionModule, InputSwitchModule, CreditModule
    ],
    exports: [],
    declarations: [
        UsersComponent, GroupComponent, GroupActivityComponent,
        StaffComponent, ExchangeRateComponent,DeletedStaffLogComponent,DormantStaffLogComponent,
        AuditTrailComponent, StaffSignatureComponent, UserAdministrationComponent, ProfileSettingComponent, ApiLogComponent, ApplicationErrorLogComponent  ,      BatchPostingDetailComponent,
        BatchPostingMainComponent, RefreshStagingMonitoringComponent, BulkDisbursementComponent, OfficerRiskRatingComponent, ExternalUrlComponent, SupportUtilityStaffComponent, SupportUtilityCustomerComponent, SupportUtilityWorkflowComponent
],// ProfileSettingComponent],
    providers: [
        AuthenticationService, LoadingService,
        AuthGuard, AuthorizationService, CompanyService,
        BranchService, DepartmentService, StaffService, AuthHttp,LoanService,
        UtilityService, AdminService, CountryStateService,
        StaffRoleService, JobTitleService, MisInfoService, ExchangeRateService, StaffRealTimeSearchService,CrmsService
        ,GeneralSetupService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AdminModule {RefreshStagingMonitoringComponent

}
