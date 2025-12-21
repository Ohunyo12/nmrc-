import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecretariatComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
   component: SecretariatComponent,
  data: { activities: ['committee secretariat'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariatRoutingModule { }
