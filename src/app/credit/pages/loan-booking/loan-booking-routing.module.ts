import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanBookingComponent } from 'app/credit/loans';

const routes: Routes = [
  {path: '',
  //component: LoanBookingComponent,
  data: { activities: ['booking'] }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanBookingRoutingModule { }
