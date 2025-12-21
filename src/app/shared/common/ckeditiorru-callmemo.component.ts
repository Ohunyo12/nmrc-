import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
    selector:'app-ckeditiorru-callmemo',
    template: `<textarea name="editorru">{{ contentru }}</textarea>
    <input type="hidden" [ngModel]="contentru" ngControl="contentru" name="contentru">`
})

export class CkeditiorruCallmemoComponent implements OnInit {

  instanceRU: any;

    @Input() height: number;
    @Input() contentru: any;
    @Output() contentChangeRU: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.instanceRU = window['CKEDITOR']['replace']('editorru', { height: this.height + 'px'});
        
        const __this = this;
        this.instanceRU.on('change', (evt: any) => {
            __this.recentUpdateChange(evt.editor.getData());
        });

        this.instanceRU.on('dialogDefinitionRU', function(ev)
        {
           var dialogNameRU = ev.data.name;  
           var dialogDefinitionRU = ev.data.definition;
                 
           switch (dialogNameRU) {  
            case 'image':       
            dialogDefinitionRU.removeContents('Link');
            dialogDefinitionRU.removeContents('advanced');
                break;      
            case 'link':          
            dialogDefinitionRU.removeContents('advanced');   
                break;
           }
        });
        
        
    }

    // update consumer of changes in CKEDITOR
    recentUpdateChange(contentru) { 
        this.contentChangeRU.emit(contentru);
     } 

}
