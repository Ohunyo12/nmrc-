import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { OverdraftOperationsComponent } from 'app/credit/loan-management/overdraft-operations/overdraft-operations.component';

const routes: Routes = [{
  path: '',
  //component: OverdraftOperationsComponent,
  data: { activities: ['overdraft operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverdraftOperationsRoutingModule { }
