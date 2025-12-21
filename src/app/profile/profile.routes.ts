import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PasswordSettingComponent } from './password-reset/password-reset.component';
import { AuthGuard } from '../admin/guard/authentication.guard';

// import { HomeComponent } from './';
// import { Name2Component } from './';
// import { Name3Component } from './';
// import { Name4Component } from './';
// import { PageNotFoundComponent } from './';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'passwordReset', component: PasswordSettingComponent,canActivate: [AuthGuard], 
            },
            {
                path: 'group/activities', component: PasswordSettingComponent, canActivate: [AuthGuard],
            },
            {
                path: 'user/profile', component: PasswordSettingComponent,canActivate: [AuthGuard],
            }           
        ]
    }
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {}
export const routedComponents = [
    PasswordSettingComponent
]