import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'psr-ckeditor',
  templateUrl: './psr-ckeditor.component.html',
  //styleUrls: ['./psr-ckeditor.component.scss']
})
export class PsrCkeditorComponent implements OnInit {
  content: any;
  @Output() valueUpdate = new EventEmitter(); 
  // @Input() set reload(value: number) {

  //   if (value != NaN || value != undefined || value != null)
  //     if (value > 0) this.content = this.ckeditorContent;
  // }

  documentContent: any;
  ckeditorContent: any ;

  getContent() {
    this.valueUpdate.emit(this.ckeditorContent )
  }

  constructor() { }


  ngOnInit() {
  }


  contentChange(updates) {
    this.ckeditorContent = updates;
  }

}
