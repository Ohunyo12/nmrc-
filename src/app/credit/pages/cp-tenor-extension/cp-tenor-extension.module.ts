import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpTenorExtensionRoutingModule } from './cp-tenor-extension-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CpTenorExtensionRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CpTenorExtensionModule { }
