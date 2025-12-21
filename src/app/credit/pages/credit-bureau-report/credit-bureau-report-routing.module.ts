import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditBureauSearchComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: CreditBureauSearchComponent,
  data: { activities: ['NOT_IMPLEMENTED'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditBureauReportRoutingModule { }
