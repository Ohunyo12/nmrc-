import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefferalManagementComponent } from 'app/credit/loans/defferal-management/defferal-management.component';

const routes: Routes = [{
  path: '',
  component: DefferalManagementComponent,
  data: { activities: ['deferral management'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeferralManagementRoutingModule { }
