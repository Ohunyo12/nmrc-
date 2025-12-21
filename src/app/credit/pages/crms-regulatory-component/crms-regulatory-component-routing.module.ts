import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/crms-regulatory.component';

const routes: Routes = [{
  path: '',
  component: CrmsRegulatoryComponent,
  data: { activities: ['start credit application'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmsRegulatoryComponentRoutingModule { }
