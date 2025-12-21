import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductFeeConcessionComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component : ProductFeeConcessionComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeesConcessionRoutingModule { }
