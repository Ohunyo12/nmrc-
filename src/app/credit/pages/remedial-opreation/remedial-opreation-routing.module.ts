import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { RemedialOpreationComponent } from 'app/credit/loan-management/remedial-opreation/remedial-opreation.component';

const routes: Routes = [{
  path: '',
  data: { activities: ['recovery operations'] },
  //component: RemedialOpreationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemedialOpreationRoutingModule { }
