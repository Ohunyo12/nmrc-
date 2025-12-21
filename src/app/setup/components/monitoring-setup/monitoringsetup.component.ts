import { MonitoringSetupService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitoringsetup',
  templateUrl: './monitoringsetup.component.html',
})
export class MonitoringSetupComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New Trigger Setup";
  monitoringSetupForm: FormGroup;
  messageTypes: any[];
  products: any[];
  monitoringSetups: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
   // private branchService: BranchService,
    private monitoringSetupService: MonitoringSetupService) { }

  ngOnInit() {
    this.getAllMessageType();
    this.getAllMonitoringSetup();
     this.GetAllProduct();
    this.clearControls();
   
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New MonitoringSetup";
    this.displayAddModal = true;
  }

    getAllMessageType(): void {
    this.loadingService.show();
    this.monitoringSetupService.getAllMessageType().subscribe((response: any) => {
      this.messageTypes = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


      GetAllProduct(): void {
    this.loadingService.show();
    this.monitoringSetupService.GetAllProduct().subscribe((response: any) => {
      this.products = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllMonitoringSetup(): void {
    this.loadingService.show();
    this.monitoringSetupService.getAllMonitoringSetups().subscribe((response: any) => {
      this.monitoringSetups = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editMonitoringSetup(index) {
    this.entityName = "Edit Trigger Setup";
    var row = this.monitoringSetups[index];
    try {
      this.monitoringSetupForm.controls['messageTemplate'].setValue(null);
    } catch (error) {
    }
    this.selectedId = row.monitoringItemId;
    this.monitoringSetupForm = this.fb.group({
      monitoringItemName: [row.monitoringItemName],
      messageTemplate: [row.messageTemplate],
      messageTypeId: [row.messageTypeId],
      notificationPeriod: [row.notificationPeriod],
      productId: [row.productId]
      //selectId: [row.monitoringSetupId],
      
    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.monitoringSetupService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllMonitoringSetup();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.monitoringSetupService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllMonitoringSetup();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  clearControls() {
    this.selectedId = null;
    try {
      this.monitoringSetupForm.controls['messageTemplate'].setValue(null);
    } catch (error) {
    }
    this.monitoringSetupForm = this.fb.group({
      monitoringItemName: ['', Validators.required],
      messageTypeId: ['', Validators.required],
      notificationPeriod: ['', Validators.required],
      messageTemplate: ['', Validators.required],
       productId: ['', Validators.required],
    });
  }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
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
}
