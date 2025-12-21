import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConvenantMaintenanceComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: ConvenantMaintenanceComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenantMaintenanceRoutingModule { }
