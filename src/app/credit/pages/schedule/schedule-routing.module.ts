import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheduleComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: SheduleComponent,
  data: { activities: ['schedule simulation'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
