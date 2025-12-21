import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistItemSimulationComponent } from 'app/credit/loans/checklist-item-simulation/checklist-item-simulation.component';

const routes: Routes = [{
  path: '',
  component: ChecklistItemSimulationComponent,
  data: { activities: ['schedule simulation'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistSimulationRoutingModule { }
