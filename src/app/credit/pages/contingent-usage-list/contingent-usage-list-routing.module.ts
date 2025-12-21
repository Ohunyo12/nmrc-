import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContingentUsageListComponent } from 'app/credit/loans/contingent-usage/contingent-usage-list.component';

const routes: Routes = [{
  path: '',
  component: ContingentUsageListComponent,
  data: { activities: ['aps request'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingentUsageListRoutingModule { }
