import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CPRolloverComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: CPRolloverComponent,
  data: { activities: ['commercial loan rollover'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpRolloverRoutingModule { }
