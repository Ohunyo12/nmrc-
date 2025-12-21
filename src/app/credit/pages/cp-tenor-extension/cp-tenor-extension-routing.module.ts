import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CPTenorExtensionComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: CPTenorExtensionComponent,
  data: { activities: ['commercial loan tenor extension'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpTenorExtensionRoutingModule { }
