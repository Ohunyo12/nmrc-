import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
    selector:'app-ckeditiorcb-callmemo',
    template: `<textarea name="editorcb">{{ contentcb }}</textarea>
    <input type="hidden" [ngModel]="contentcb" ngControl="contentcb" name="contentcb">`
})

export class CkeditiorcbCallmemoComponent implements OnInit {

  instanceCB: any;

  @Input() height: number;
  @Input() contentcb: any;
  @Output() contentChangeCB: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
      this.instanceCB = window['CKEDITOR']['replace']('editorcb', { height: this.height + 'px'});
      
      const __this = this;
      this.instanceCB.on('change', (evt: any) => {
          __this.customerBackgroundChange(evt.editor.getData());
      });

      this.instanceCB.on('dialogDefinitionCB', function(ev)
      {
         var dialogNameCB = ev.data.name;  
         var dialogDefinitionCB = ev.data.definition;
               
         switch (dialogNameCB) {  
          case 'image':       
          dialogDefinitionCB.removeContents('Link');
          dialogDefinitionCB.removeContents('advanced');
              break;      
          case 'link':          
          dialogDefinitionCB.removeContents('advanced');   
              break;
         }
      });
      
      
  }

  // update consumer of changes in CKEDITOR
  customerBackgroundChange(contentcb) { 
      this.contentChangeCB.emit(contentcb);
   } 

}
