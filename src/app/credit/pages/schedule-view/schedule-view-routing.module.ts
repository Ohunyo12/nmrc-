import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleViewComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: ScheduleViewComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleViewRoutingModule { }
