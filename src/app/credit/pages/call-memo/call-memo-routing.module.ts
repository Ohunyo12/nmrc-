import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallMemoComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: CallMemoComponent,
  data: { activities: ['call memo'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallMemoRoutingModule { }
