import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanCrmsUpdateComponent } from 'app/credit/loans/booking/loan-crms-update.component';

const routes: Routes = [{
  path: '',
  component: LoanCrmsUpdateComponent,
  data: { activities: ['crms-user'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanCrmsUpdateRoutingModule { }
