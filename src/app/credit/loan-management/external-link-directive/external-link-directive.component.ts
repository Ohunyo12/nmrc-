import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-external-link-directive',
  templateUrl: './external-link-directive.component.html',
})
export class ExternalLinkDirectiveComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.open("https://powerbi.com", "_blank");
  }

}
