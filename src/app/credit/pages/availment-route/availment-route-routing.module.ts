import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailmentRouteComponent } from 'app/credit/routes/availment-route.component';

const routes: Routes = [{
  path: '',
  component: AvailmentRouteComponent,
  data: { activities: ['availment route'] }

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailmentRouteRoutingModule { }
