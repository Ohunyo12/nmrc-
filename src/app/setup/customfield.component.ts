import { LoadingService } from '../shared/services/loading.service';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomFieldBase } from '../shared/models/customfieldbase';
import { CustomFieldsService } from '../shared/services/customFields/custom-fields.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: 'customfield.component.html'
})

export class CustomFieldTestComponent implements OnInit {
    myForm: FormGroup;
    fields: CustomFieldBase[] = [];
    rows: any;
    payload: any = ''
    constructor(private customService: CustomFieldsService,
        private _fb: FormBuilder, private loadingService: LoadingService) { }

    ngOnInit() {
        this.initializeForm();
        this.getCustomFields();
    }


    getCustomFields() {
        this.loadingService.show();
        this.customService.getFields(2, 1)
            .subscribe((response: any) => {
                this.fields = response;
                this.rows = Array.from(Array(Math.ceil(this.fields.length / 2)).keys());
                this.renderCustomFields();
                this.loadingService.hide(2000);
            }, (err) => {
                this.loadingService.hide(0);
            });
    }

    initializeForm() {
        this.myForm = this._fb.group({
            firstName: ['', [Validators.required, Validators.minLength(5)]],
            lastName: ['', Validators.required],
            customFields: this._fb.array([

            ])
        });
    }
    //element.required == true ? [element.dataDetails, Validators.required] : 
    initCustomArray(element) {
        return this._fb.group({
            dataDetails: [element.dataDetails],
            //controlKey: [element.controlKey],
            labelName: [element.labelName],
            //required: [element.required],
            //itemOrder: [element.itemOrder],
            // controlType: [element.controlType],
            customFieldId: [element.customFieldId]
        });
    }

    renderCustomFields() {
        const control = <FormArray>this.myForm.controls['customFields'];
        this.fields.forEach((element) => {
            control.push(this.initCustomArray(element));
        });
    }

    save(model) {
        this.payload = model.value;
    }


}