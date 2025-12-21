import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CPSubAllocationComponent } from 'app/credit/components';

const routes: Routes = [{
 path: '',
 component: CPSubAllocationComponent,
 data: { activities: ['commercial loan sub-allocation'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpSubAllocationRoutingModule { }
