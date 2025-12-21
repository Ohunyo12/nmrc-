import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanEligibilityRequirementsComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: LoanEligibilityRequirementsComponent,
  data: { activities: ['start credit application'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanEligibilityRequirementRoutingModule { }
