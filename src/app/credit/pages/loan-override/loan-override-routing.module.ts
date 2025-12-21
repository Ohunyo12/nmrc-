import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverrideComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: OverrideComponent,
  data: { activities: ['override request'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanOverrideRoutingModule { }
