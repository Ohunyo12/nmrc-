import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CovenantDetailComponent } from 'app/credit/components';

const routes: Routes = [ {
  path: '',
  component: CovenantDetailComponent,
  data: { activities: ['covenant maintenance'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenantDetailRoutingModule { }
