import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LMSCrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/lms-crms-regulatory.component';

const routes: Routes = [{
  path: '',
  component: LMSCrmsRegulatoryComponent,
  data: { activities: ['start credit application'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsCrmsRoutingModule { }
