import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { InitiateLoanBookingComponent } from 'app/credit/loans';

const routes: Routes = [{
  path : '',
  //component: InitiateLoanBookingComponent,
  data: { activities: ['booking request'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitiateBookingRoutingModule { }
