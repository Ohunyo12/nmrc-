
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders, Component } from '@angular/core';
import { MainLayoutComponent } from './shared/layout/mainlayout.component';
import { AuthLayoutComponent } from './shared/layout/authlayout.component';
import { DashboardComponent } from './dashboard/app.dashboard.component';
import { AuthGuard } from './admin/guard/authentication.guard';
import { PasswordSettingComponent } from './profile/password-reset/password-reset.component';
 
export const routes: Routes = [

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },

    {
        path: '', component: MainLayoutComponent,

        children: [
            {
                path: 'dashboard', 
                component: DashboardComponent,
                canActivate: [AuthGuard], data: { activities: [] }
            },
            {
                path: 'changepassword', 
                component: PasswordSettingComponent,
                canActivate: [AuthGuard], data: { activities: [] }
            }
        ]
    },
    {
        path: 'setup',
        component: MainLayoutComponent,
        data: {
            title: 'Setup'
        },
        children: [
            {
                path: '',
                loadChildren: './setup/setup.module#SetupModule'
            }
        ]
    },
    {
        path: 'customer',
        component: MainLayoutComponent,
        data: {
            title: 'Customer Management'
        },
        children: [
            {
                path: '',
                loadChildren: './customer/customer.module#CustomerModule'
            }
        ]
    },
    {
        path: 'auth', component: AuthLayoutComponent, data: {title: 'Login'},
       
        children: [
            {
                path: '',
                loadChildren: './auth/auth.module#LoginModule',
              
            },
           
        ]
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        data: {
            title: 'Admin'
        },
        children: [
            {
                path: '',
                loadChildren: './admin/admin.module#AdminModule'
            }
        ]
    },
    {
        path: 'approvals',
        component: MainLayoutComponent,
        data: {
            title: 'Approvals'
        },
        children: [
            {
                path: '',
                loadChildren: './approvals/approvals.module#ApprovalsModule'
            }
        ]
    },
    {
        path: 'credit',
        component: MainLayoutComponent,
        data: {
            title: 'Credit'
        },
        children: [
            {
                path: '',
                loadChildren: './credit/credit.module#CreditModule'
            }
        ]
    },

    {
        path: 'report',
        component: MainLayoutComponent,
        data: {
            title: 'Report'
        },
        children: [
            {
                path: '',
                loadChildren: './reports/report.module#ReportModule'
            }
        ]
    },


    {
        path: '**',
        redirectTo: 'auth/not-found'
    },
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
