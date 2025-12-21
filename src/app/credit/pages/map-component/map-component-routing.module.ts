import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from 'app/credit/map/map.component';

const routes: Routes = [{
  path: '',
  component: MapComponent,
  data: { activities: ['schedule simulation'] },

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapComponentRoutingModule { }
