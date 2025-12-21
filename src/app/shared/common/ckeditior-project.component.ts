import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 

@Component({
    selector:'app-ckeditior-project',
    template: `<textarea name="editor1">{{ content }}</textarea>
    <input type="hidden" [ngModel]="content" ngControl="content" name="content">`
})

export class CkeditiorProjectComponent implements OnInit {

    instance: any;

    @Input() height: number;
    @Input() content: any;
    @Output() contentChange: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.instance = window['CKEDITOR']['replace']('editor1', { height: this.height + 'px'});
        
        const __this = this;
        this.instance.on('change', (evt: any) => {
            __this.updateChanges(evt.editor.getData());
        });

        this.instance.on('dialogDefinition', function(ev)
        {
           var dialogName = ev.data.name;  
           var dialogDefinition = ev.data.definition;
                 
           switch (dialogName) {  
            case 'image':       
                dialogDefinition.removeContents('Link');
                dialogDefinition.removeContents('advanced');
                break;      
            case 'link':          
                dialogDefinition.removeContents('advanced');   
                break;
           }
        });
        
        
    }

    // update consumer of changes in CKEDITOR
    updateChanges(content) { 
        this.contentChange.emit(content);
     } 

}