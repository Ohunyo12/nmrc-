import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guard/authentication.guard';
import { ConfirmDeactivateGuard } from './guard/confirm-deactivate.guard';
import {
    AuditTrailComponent, StaffComponent, GroupActivityComponent,OfficerRiskRatingComponent,
    GroupComponent, UsersComponent, ExchangeRateComponent, StaffSignatureComponent, UserAdministrationComponent, ProfileSettingComponent
} from './components'; 
import { ApiLogComponent } from './api-log/api-log.component';
import { ApplicationErrorLogComponent } from 'app/admin/application-error-log/application-error-log.component';
import { BatchPostingDetailComponent } from './batch-posting/batch-posting-detail/batch-posting-detail.component';
import { BatchPostingMainComponent } from './batch-posting/batch-posting-main/batch-posting-main.component';
import { RefreshStagingMonitoringComponent } from './batch-posting/batch-posting-monitoring/refresh-staging-monitoring.component';
import { DeletedStaffLogComponent } from './components/deleted-staff-log/deleted-staff-log.component';
import { DormantStaffLogComponent } from './components/dormant-staff-log/dormant-staff-log.component';
import { BulkDisbursementComponent } from './components/bulk-disbursement/bulk-disbursement.component';
import { ExternalUrlComponent } from './components/external-url/external-url.component';
import { SupportUtilityStaffComponent } from './components/support-utility-staff/support-utility-staff.component';
import { SupportUtilityCustomerComponent } from './components/support-utility-customer/support-utility-customer.component';
import { SupportUtilityWorkflowComponent } from './components/support-utility-workflow/support-utility-workflow.component';
//import { ProfileSettingComponent } from 'app/admin/components/profile-setting/profile-setting.component';


const routes: Routes = [ 
    {
        path: '',
        children: [

            {
                path: 'users', component: UsersComponent, canActivate: [AuthGuard], canDeactivate: [ConfirmDeactivateGuard],
                data: { activities: ['user registration'] }
            },
            {
                path: 'groups', component: GroupComponent, canActivate: [AuthGuard],
                data: { activities: ['user group'] }
            },
            {
                path: 'group-activity', component: GroupActivityComponent, canActivate: [AuthGuard],
                data: { activities: ['group activity'] }
            },
            {
                path: 'staff', component: StaffComponent, canActivate: [AuthGuard],
                data: { activities: ['staff registration'] }
            },
            {
                path: 'exchange-rate', component: ExchangeRateComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'audit-trail', component: AuditTrailComponent, canActivate: [AuthGuard],
                data: { activities: ['NOT_IMPLEMENTED'] }
            },
            {
                path: 'deleted-staff-log', component: DeletedStaffLogComponent, canActivate: [AuthGuard],
                data: { activities: ['deleted staff log'] }
            },                
            {
                path: 'dormant-staff-log', component: DormantStaffLogComponent, canActivate: [AuthGuard],
                data: { activities: ['dormant staff log'] }
            },
            {
                path: 'bulk-disbursement', component: BulkDisbursementComponent, canActivate: [AuthGuard],
                data: { activities: ['bulk disbursement'] }
            }, 
            {
                path: 'credit-monitoring-report', component: ExternalUrlComponent, canActivate: [AuthGuard],
                data: { activities: ['credit monitoring report'] }
            },        
            {
                path: 'staff/signature-management', component: StaffSignatureComponent, canActivate: [AuthGuard],
                data: { activities: ['signature management'] }
            },
            {
                path: 'useradministration', component: UserAdministrationComponent, canActivate: [AuthGuard],
                data: { activities: ['user account management'] }
            },
             {
                path: 'profile-settings', component: ProfileSettingComponent, canActivate: [AuthGuard],
                data: { activities: ['profile-settings'] }
             },
             {
                 path: 'api-log', component: ApiLogComponent, canActivate: [AuthGuard],
                data: { activities: ['api log'] }
             },
             {
                 path: 'error-log', component: ApplicationErrorLogComponent, canActivate: [AuthGuard],
                data: { activities: ['app error log'] }
             },
             {
                path: 'batch-posting-detail', component: BatchPostingDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['custom batch posting'] }
            },
            {
                path: 'batch-posting-main', component: BatchPostingMainComponent, canActivate: [AuthGuard],
                data: { activities: ['custom batch posting'] }
            },
            {
                path: 'refresh-staging-monitoring', component: RefreshStagingMonitoringComponent, canActivate: [AuthGuard],
                data: { activities: ['custom batch posting'] }
            },
            {
                path: 'officer-risk-rating', component: OfficerRiskRatingComponent, canActivate: [AuthGuard],
                data: { activities: ['user account management'] }
            },
            {
                path: 'support-utility-staff', component: SupportUtilityStaffComponent, canActivate: [AuthGuard],
                data: { activities: ['staff issues'] }
            },
            {
                path: 'support-utility-customer', component: SupportUtilityCustomerComponent, canActivate: [AuthGuard],
                data: { activities: ['customer issues'] }
            },
            {
                path: 'support-utility-workflow', component: SupportUtilityWorkflowComponent, canActivate: [AuthGuard],
                data: { activities: ['workflow issues'] }
            },
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }


export const routedComponents = [
    UsersComponent, GroupComponent,
    GroupActivityComponent, StaffComponent, ExchangeRateComponent, OfficerRiskRatingComponent,
    AuditTrailComponent,  UserAdministrationComponent,DeletedStaffLogComponent,DormantStaffLogComponent//,ProfileSettingComponent
];


