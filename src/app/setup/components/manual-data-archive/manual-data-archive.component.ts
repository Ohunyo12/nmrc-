import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-manual-data-archive',
  templateUrl: './manual-data-archive.component.html'
})
export class ManualDataArchiveComponent implements OnInit {
  mainForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.clearControls();
  }

  clearControls() {
    this.mainForm = this.fb.group({
        isFullyUtilised: [''],
        isBatchUtilised: [''],
       
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]

    });
  }

  fullyUtilised(event) {}

  batchUtilised(event) {}

  saveManualArchive() {}
}
