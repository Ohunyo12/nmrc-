import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverdraftOperationsRoutingModule } from './overdraft-operations-routing.module';
//import { OverdraftOperationsComponent } from 'app/credit/loan-management/overdraft-operations/overdraft-operations.component';

@NgModule({
  imports: [
    CommonModule,
    OverdraftOperationsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [OverdraftOperationsComponent]
})
export class OverdraftOperationsModule { }
