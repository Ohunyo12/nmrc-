import { JobRequestViewComponent } from './../../job-request/job-request-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: JobRequestViewComponent,
  data: { activities: ['NOT_IMPLEMENTED'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRequestViewRoutingModule { }
