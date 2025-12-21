import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lms-crms-regulatory',
  templateUrl: './lms-crms-regulatory.component.html',
 // styleUrls: ['./crms-regulatory.component.scss']
})
export class LMSCrmsRegulatoryComponent implements OnInit {
  hideTab:boolean;
  isLms: boolean;

  constructor() { }

  ngOnInit() {
    this.hideTab=true;
    this.isLms =true;

  }

}
