import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponentRoutingModule } from './map-component-routing.module';
import { MapComponent } from 'app/credit/map/map.component';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    MapComponentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [MapComponent]
})
export class MapComponentModule { }
