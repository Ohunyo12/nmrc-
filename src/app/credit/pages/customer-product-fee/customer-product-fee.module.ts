import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProductFeeRoutingModule } from './customer-product-fee-routing.module';
import { CustomerProductFeeComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    CustomerProductFeeRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CustomerProductFeeComponent]
})
export class CustomerProductFeeModule { }
