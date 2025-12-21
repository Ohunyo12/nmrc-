import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditJobRequestComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  data: { activities: ['job request status'] },
  component: CreditJobRequestComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditJobRequestRoutingModule { }
