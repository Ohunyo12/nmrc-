import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferLetterGenerationComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  data: { activities: ['generate offer letter'] },
  component: OfferLetterGenerationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferLetterRoutingModule { }
