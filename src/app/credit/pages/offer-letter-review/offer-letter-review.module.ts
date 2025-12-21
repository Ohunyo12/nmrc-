import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferLetterReviewRoutingModule } from './offer-letter-review-routing.module';
import { OfferLetterGenererationReviewComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    OfferLetterReviewRoutingModule,
    BankingSharedModule
  ],
  //declarations: [OfferLetterGenererationReviewComponent]
})
export class OfferLetterReviewModule { }
