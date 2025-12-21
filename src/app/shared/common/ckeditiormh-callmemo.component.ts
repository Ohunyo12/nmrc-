import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
    selector:'app-ckeditiormh-callmemo',
    template: `<textarea name="editormh">{{ contentmh }}</textarea>
    <input type="hidden" [ngModel]="contentmh" ngControl="contentmh" name="contentmh">`
})

export class CkeditiormhCallmemoComponent implements OnInit {

  instanceMH: any;

  @Input() height: number;
  @Input() contentmh: any;
  @Output() contentChangeMH: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
      this.instanceMH = window['CKEDITOR']['replace']('editormh', { height: this.height + 'px'});
      
      const __this = this;
      this.instanceMH.on('change', (evt: any) => {
          __this.meetingHighlightsChange(evt.editor.getData());
      });

      this.instanceMH.on('dialogDefinitionMH', function(ev)
      {
         var dialogNameMH = ev.data.name;  
         var dialogDefinitionMH = ev.data.definition;
               
         switch (dialogNameMH) {  
          case 'image':       
          dialogDefinitionMH.removeContents('Link');
          dialogDefinitionMH.removeContents('advanced');
              break;      
          case 'link':          
          dialogDefinitionMH.removeContents('advanced');   
              break;
         }
      });
      
      
  }

  // update consumer of changes in CKEDITOR
  meetingHighlightsChange(contentmh) { 
      this.contentChangeMH.emit(contentmh);
   } 

}
