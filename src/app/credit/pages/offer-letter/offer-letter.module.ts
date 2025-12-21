import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferLetterRoutingModule } from './offer-letter-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { OfferLetterGenerationComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    OfferLetterRoutingModule,
    BankingSharedModule
  ],
  //declarations: [OfferLetterGenerationComponent]
})
export class OfferLetterModule { }
