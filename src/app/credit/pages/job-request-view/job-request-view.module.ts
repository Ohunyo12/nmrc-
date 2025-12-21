import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRequestViewRoutingModule } from './job-request-view-routing.module';

@NgModule({
  imports: [
    CommonModule,
    JobRequestViewRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class JobRequestViewModule { }
