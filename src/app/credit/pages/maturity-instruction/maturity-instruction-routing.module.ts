import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaturityInstructionComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: MaturityInstructionComponent,
  data: { activities: ['maturity instruction'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaturityInstructionRoutingModule { }
