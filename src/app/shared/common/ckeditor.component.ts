import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; // check roles

@Component({
    selector: 'CKEDITOR',
    template: `<textarea name="editor1" style="font face: arial; size:12px">{{ content }}</textarea>
    <input type="hidden" [ngModel]="content" ngControl="content" name="content">`
})
export class CkeditorComponent implements OnInit {

    instance: any;

    @Input() height: number;
    @Input() content: any;
    @Output() contentChange: EventEmitter<any> = new EventEmitter();

    ngOnInit() {

        this.instance = window['CKEDITOR']['replace']('editor1', {
        height: this.height + 'px'
        });
        const __this = this;
        this.instance.on('change', (evt: any) => {
            __this.updateChanges(evt.editor.getData());
        });

        // if (this.instance != null && this.content != null){
        // this.instance.setData(this.content);
        // }
        this.instance.on('dialogDefinition', function (ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;

            switch (dialogName) {
                case 'image': //Image Properties dialog      
                    dialogDefinition.removeContents('Link');
                    dialogDefinition.removeContents('advanced');
                    break;
                case 'link': //image Properties dialog          
                    dialogDefinition.removeContents('advanced');
                    break;
            }
        });


    }

    // update consumer of changes in CKEDITOR
    updateChanges(content) {
        this.contentChange.emit(content);
    }

    // update CKEDITOR of changes in consumer content
    ngOnChanges() {
        if (this.instance != null && this.content != null)
            this.instance.setData(this.content);
    }

    // ngOnDestroy() {
    //     if (this.instance) {
    //         setTimeout(() => {
    //             this.instance.removeAllListeners();
    //             this.instance[this.instance.name].destroy();
    //             this.instance.destroy();
    //             this.instance = null;
    //         });
    //     }
    // }

}
