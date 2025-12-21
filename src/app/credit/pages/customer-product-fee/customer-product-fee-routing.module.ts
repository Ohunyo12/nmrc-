import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerProductFeeComponent } from 'app/credit/components';

const routes: Routes = [ {
  path: '',
   component: CustomerProductFeeComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerProductFeeRoutingModule { }
