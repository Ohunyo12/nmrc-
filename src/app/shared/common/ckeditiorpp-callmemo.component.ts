import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
    selector:'app-ckeditiorpp-callmemo',
    template: `<textarea name="editorpp">{{ contentpp }}</textarea>
    <input type="hidden" [ngModel]="contentpp" ngControl="contentpp" name="contentpp">`
})

export class CkeditiorppCallmemoComponent implements OnInit {

  instancePP: any;

  @Input() height: number;
  @Input() contentpp: any;
  @Output() contentChangePP: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
      this.instancePP = window['CKEDITOR']['replace']('editorpp', { height: this.height + 'px'});
      
      const __this = this;
      this.instancePP.on('change', (evt: any) => {
          __this.participantsChange(evt.editor.getData());
      });

      this.instancePP.on('dialogDefinitionPP', function(ev)
      {
         var dialogNamePP = ev.data.name;  
         var dialogDefinitionPP = ev.data.definition;
               
         switch (dialogNamePP) {  
          case 'image':       
          dialogDefinitionPP.removeContents('Link');
          dialogDefinitionPP.removeContents('advanced');
              break;      
          case 'link':          
          dialogDefinitionPP.removeContents('advanced');   
              break;
         }
      });
      
      
  }

  // update consumer of changes in CKEDITOR
  participantsChange(contentpp) { 
      this.contentChangePP.emit(contentpp);
   } 

}
