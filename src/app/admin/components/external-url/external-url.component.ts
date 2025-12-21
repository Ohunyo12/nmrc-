import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-external-url',
  templateUrl: './external-url.component.html',
  styleUrls: ['./external-url.component.scss']
})
export class ExternalUrlComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.open('http://credit360analytics.accessbankplc.com:8080/Reports', '_blank');
   // window.location.href ='http://credit360analytics.accessbankplc.com:8080/Reports';
    //window.open('http://credit360analytics.accessbankplc.com:8080/Reports');
  }

}
