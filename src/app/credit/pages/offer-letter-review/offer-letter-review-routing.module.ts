import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferLetterGenererationReviewComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: OfferLetterGenererationReviewComponent,
  data: { activities: ['review offer letter'] },
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferLetterReviewRoutingModule { }

