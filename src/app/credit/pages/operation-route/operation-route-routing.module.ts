import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { OperationRouteComponent } from 'app/credit/routes/operation-route.component';

const routes: Routes = [{
  path: '',
  //component: OperationRouteComponent,
  data: { activities: ['operation route'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRouteRoutingModule { }
