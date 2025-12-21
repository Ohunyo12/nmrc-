import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crms-regulatory',
  templateUrl: './crms-regulatory.component.html',
 // styleUrls: ['./crms-regulatory.component.scss']
})
export class CrmsRegulatoryComponent implements OnInit {
  hideTab:boolean;
  isLms: boolean;

  constructor() { }

  ngOnInit() {
    this.hideTab=true;
    this.isLms =false;
  }

}
