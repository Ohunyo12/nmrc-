import { ProspectCustomerComponent } from './components/customer/prospect-customer/prospect-customer.component';
// import { CustomerInformationDetailComponent } from './components/index';
import {
    CustomerInformationComponent, CustomerEditComponent, CustomerComponent,
    CustomerGroupComponent, CasaComponent, CustomerRelationshipTypeComponent, CustomerInformationDetailComponent
} from './components';
import { AuthGuard } from '../admin/guard/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'customer', component: CustomerComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile'] }
            }, {
                path: 'customer-information', component: CustomerInformationComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile'] }
            },
            {
                path: 'customer-information-detail', component: CustomerInformationDetailComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile'] }
            },
            {
                path: 'customer-edit', component: CustomerEditComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile'] }
            },
            {
                path: 'prospect-customer', component: ProspectCustomerComponent, canActivate: [AuthGuard],
                data: { activities: ['customer profile'] }
            },
            {
                path: 'customer-relationship-type', component: CustomerRelationshipTypeComponent, canActivate: [AuthGuard],
                data: { activities: ['customer relationship type', 'group relationship type'] }
            },
            {
                path: 'customer-group', component: CustomerGroupComponent, canActivate: [AuthGuard],
                data: { activities: ['customer group'] }
            },
            {
                path: 'casa', component: CasaComponent, canActivate: [AuthGuard],
                data: { activities: ['casa search'] }
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule { }

export const routedComponents = [
    CustomerComponent, CustomerGroupComponent, CasaComponent,
    CustomerRelationshipTypeComponent, CustomerEditComponent, CustomerInformationComponent, CustomerInformationDetailComponent
];

