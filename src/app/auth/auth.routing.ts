import { AccessDeniedComponent } from './accessdenied.component';
import { NotFoundComponent } from './not-found.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'not-found', component: NotFoundComponent },
            { path: 'accessdenied', component: AccessDeniedComponent },
            { path: 'login', component: LoginComponent },
            
        ]
    }
];

@NgModule({
    imports:  [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginRoutingModule { }

export const routedComponents = [LoginComponent, NotFoundComponent, AccessDeniedComponent];