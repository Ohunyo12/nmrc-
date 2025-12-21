import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanApplicationCollateralInformationComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: LoanApplicationCollateralInformationComponent,
  data: { activities: ['collateral information'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanCollateralInfomationRoutingModule { }
