import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlaMonitoringComponent } from 'app/credit/sla/sla-monitoring.component';

const routes: Routes = [{
  path: '',
  component: SlaMonitoringComponent,
  data: { activities: ['application route'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlaMonitoringRoutingModule { }
