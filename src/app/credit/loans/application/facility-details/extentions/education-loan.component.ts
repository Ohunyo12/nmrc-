import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
//import { FormGroup } from '@angular/forms/src/model';

@Component({
    selector: 'education-loan',
    templateUrl: './education-loan.component.html',
 
})
export class EducationLoanComponent implements OnInit, OnChanges {
    educationLoanForm: FormGroup; 
    disableControl: boolean = false;
    @Input() disableFormControl: boolean = false;
    @Input() resetForm: boolean = false;
    @Output() educationLoan: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();


    @Input() set extendedFormDefaultBody(value: any) {
        if (value != null) { this.setDefaultFormValues(value); }
    }

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initEducationLoan();
    }
    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        if (this.disableFormControl) this.disableControl;
        if (this.resetForm)
            this.educationLoanForm.reset();
    }

    educationChange(): void{
        
      if(this.educationLoanForm.valid)
       this.educationLoan.emit(this.educationLoanForm);
    }

    initEducationLoan() {
        this.educationLoanForm = this.fb.group({
             
            schoolFeesCollected: ['', Validators.required],
            averageSchoolFees: ['', Validators.required],
            numberOfStudent: ['', Validators.required],
 
        });
    }

    setDefaultFormValues(body:any) {
        this.educationLoanForm.controls["numberOfStudent"].setValue(body.numberOfStudent);
        this.educationLoanForm.controls["averageSchoolFees"].setValue(body.averageSchoolFees);
        this.educationLoanForm.controls["schoolFeesCollected"].setValue(body.schoolFeesCollected);
    }
}