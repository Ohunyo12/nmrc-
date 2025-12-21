import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemedialOpreationRoutingModule } from './remedial-opreation-routing.module';
//import { RemedialOpreationComponent } from 'app/credit/loan-management/remedial-opreation/remedial-opreation.component';

@NgModule({
  imports: [
    CommonModule,
    RemedialOpreationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [RemedialOpreationComponent]
})
export class RemedialOpreationModule { }
