import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalJobRequestConfirmation } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LegalJobRequestConfirmation,
  data: { activities: ['confirm collateral search'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalJobRequestConfirmationRoutingModule { }
