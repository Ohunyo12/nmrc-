import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-data-archive',
  templateUrl: './data-archive.component.html'
})
export class DataArchiveComponent implements OnInit {

  mainForm: FormGroup;

  constructor(private fb: FormBuilder, ) { }

  ngOnInit() {
    this.clearControls();
  }

  clearControls() {
    this.mainForm = this.fb.group({
        isPeriodicArchive: [''],
        triggerId: ['', Validators.required],
        periodId: ['', Validators.required],
        isUtilisedPeriodic: [''],
        isBatchUtilisedPeriodic: [''],
        isManualArchive: [''],
        isUtilisedManual: [''],
        isBatchUtilisedManual: [''],
        processingTime: [''],
        // currencyId: ['1', Validators.required],
        // validTill: ['', Validators.required]

    });
  }

  periodicArchive(event) {}

  utilisedPeriodic(event) {}

  batchUtilisedPeriodic(event) {}

  manualArchive(event) {}

  utilisedManual(event) {}

  batchUtilisedManual(event) {}
}
