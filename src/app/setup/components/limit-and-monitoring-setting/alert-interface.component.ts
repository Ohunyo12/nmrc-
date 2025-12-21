import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralSetupService } from '../../services';
import swal, { SweetAlertType } from 'sweetalert2';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
@Component({
  selector: 'app-alert-interface',
  templateUrl: './alert-interface.component.html',
  
})
export class AlertInterfaceComponent implements OnInit {

  states: any[];

  alertListForm: FormGroup;
  alertList: any[];
  displayemailMessage:boolean=false;
  TitleName: "Alert and Monitoring"

  constructor(private fb: FormBuilder,
    private generalSetupService: GeneralSetupService,
    private loadServ: LoadingService
    ) { }

  ngOnInit() {
    this.getAlertList();
    this.InitAlertForm();
  }

 
  getAlertList() {
    this.generalSetupService.getAlertList()
        .subscribe((response: any) => {
          
            this.alertList = response.result;


            this.loadServ.hide();
        }, (err) => {
            this.loadServ.hide();

        });
}

InitAlertForm() {
  this.alertListForm = this.fb.group({
    monitoringItemId: [''],
    messageTitle:[''],
    messageBody: ['', Validators.required],
    notificationPeriod1: ['', Validators.required],
    escalationLevel1: ['', Validators.required],
    notificationPeriod2: [''],
    escalationLevel2: [''],
    notificationPeriod3: [''],
    escalationLevel3: [''],
  })
}

showDialog(){
  this.displayemailMessage=true;
}
saveEmailMessage(formObj) {
  this.loadServ.show();
  let body = formObj.value;



  if (body.monitoringItemId > 0) {
    this.generalSetupService.UpdateEmailAlertMessages(body.marketId, body)
    .subscribe((res) => {
        this.loadServ.hide();
        if (res.success === true) {
          this.getAlertList();
            this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            this.displayemailMessage = false
        } else {
            this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
    }, (err) => {
        this.loadServ.hide();
        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
    })
  } else {
    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, "Record does not exist", 'error');
    this.loadServ.hide();
  }
}
showMessage(title: string, message: string, messageType: SweetAlertType) {
  swal(title, message, messageType);
}
editAlertMessage(record){

 // this.TitleName = 'Edit Alert Message';
  this.displayemailMessage = true;
 
  let row = record;

  this.alertListForm = this.fb.group({
    monitoringItemId: [row.monitoringItemId],
    messageTitle:[row.messageTitle],
    messageBody: [row.messageBody],
    notificationPeriod1: [row.notificationPeriod1],
    escalationLevel1: [row.escalationLevel1],
    notificationPeriod2: [row.notificationPeriod2],
    escalationLevel2: [row.escalationLevel2],
    notificationPeriod3: [row.notificationPeriod3],
    escalationLevel3: [row.escalationLevel3],

  })
}
}
