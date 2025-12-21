import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kyc-checklist',
  templateUrl: './kyc-checklist.component.html'
})
export class KYCChecklistComponent implements OnInit {
  KYCLists: any[];
  KYCList: FormGroup;
  show: boolean = false;
  KYCChecklist_id: string;
  message: any;
  title: any;
  cssClass: any;
  isUpdate: boolean = false;
  display: boolean = false;
  activeIndex: boolean = false;
  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
  }
  showDialog() {
    this.initializeControls();
    this.isUpdate = false
    this.display = true;
  }
  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }
  hideMessage(event) {
    this.show = false;
  }
  initializeControls() {
    this.KYCList = this.fb.group({
      KYCItemId: ['', Validators.required],
      CustomerId: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      Provided: ['', Validators.required],
      Deferred: ['', Validators.required],
      Waived: ['', Validators.required],
      Disapproved: ['', Validators.required],
      Approved: ['', Validators.required],
    });
  }
  editKYCCheckList(kycs) {
    let returnedKYC = this.KYCLists[kycs];

    this.KYCList = this.fb.group({
      KYCItemId: [returnedKYC.KYCItemId],
      CustomerId: [returnedKYC.CustomerId],
      AccountNumber: [returnedKYC.AccountNumber],
      Provided: [returnedKYC.Provided],
      Deferred: [returnedKYC.Deferred],
      Waived: [returnedKYC.Waived],
      Disapproved: [returnedKYC.Disapproved],
      Approved: [returnedKYC.Approved]

    });
    this.KYCChecklist_id = returnedKYC.CustomerAccountKYCItemId;
    this.isUpdate = true;
    this.display = true;
  }

}
