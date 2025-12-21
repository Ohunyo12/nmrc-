import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CPPrepaymentComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: CPPrepaymentComponent,
  data: { activities: ['commercial loan prepayment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpPrepaymentRoutingModule { }
