import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { GeneralSetupService } from '../../services/general-setup.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal, { SweetAlertType } from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-employer-type',
  templateUrl: './employer-type.component.html',
})
export class EmployerTypeComponent implements OnInit {
  displayEmployerModel:boolean=false;
  employerTypeForm:FormGroup;
  employerSubTypeForm:FormGroup;
  emplyerType: any;
  employerTypeTable:any[]=[];
  employerSubTypeTable: any;
  displayEmployerSubModel: boolean;
  loadingService: any;
  selectedId: any;
 
  
  constructor(private fb: FormBuilder, private loadServ: LoadingService,
     private genSetupServ: GeneralSetupService) {
}

  ngOnInit() {

    this.getEmployerType();
    
    this.IntEmployerTypeForm() ;
this.IntEmployerSubTypeForm();
this.getAllEmployerSubType();
  }

  IntEmployerTypeForm() {
    this.employerTypeForm = this.fb.group({
      EmployerTypeId: [''],
      EmployerTypeName: ['', Validators.required],
    });
}
IntEmployerSubTypeForm() {
  this.employerSubTypeForm = this.fb.group({
    EmployerTypeId: [''],
    EmployerSubTypeId:[''],
    EmployerSubTypeName: ['', Validators.required],
  });
}
  getEmployerType(): void {
    this.genSetupServ.getEmployerType().subscribe((response: any) => {
        this.employerTypeTable = response.result;


    }, (err) => {
        this.loadServ.hide(1000);
    });
}

getAllEmployerSubType(): void {
  this.genSetupServ.getAllEmployerSubType().subscribe((response: any) => {
      this.employerSubTypeTable = response.result;


  }, (err) => {
      this.loadServ.hide(1000);
  });
}

showEmployerType(){
  this.displayEmployerModel=true;
}
showEmployerSubType(){
  this.displayEmployerSubModel=true;
}


editEmployerType(x){
  
  let type = x.employerTypeName;
  this.employerTypeForm.controls["EmployerTypeName"].setValue(type);
  this.selectedId = x.employerTypeId;
  this.displayEmployerModel=true;

  
}

editEmployerSubType(x){
  
  let type = x.employerTypeId;
  let subtype = x.employerSubTypeName;
  this.employerSubTypeForm.controls["EmployerTypeId"].setValue(type);
  this.employerSubTypeForm.controls["EmployerSubTypeName"].setValue(subtype);
  this.selectedId = x.employerSubTypeId;
  this.displayEmployerSubModel=true;
}



showMessage(title: string, message: string, messageType: SweetAlertType) {
  swal(title, message, messageType);
}
    
addEmployerType() {
  this.loadServ.show();
  let data ={
    EmployerTypeName:this.employerTypeForm.value.EmployerTypeName
  };
  if (this.selectedId === null || this.selectedId === 'undefined') { 
    this.genSetupServ.addEmployerType(data).subscribe((res) => {
              this.loadServ.hide();
              if (res.success === true) {
                this.getEmployerType();
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                  this.displayEmployerModel = false
              } else {
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
              }
          }, (err) => {
              this.loadServ.hide();
              this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
          })
  } else {
    this.genSetupServ.updateEmployerType(this.selectedId,data).subscribe((res) =>  {
              this.loadServ.hide();
              if (res.success === true) {
                this.getEmployerType();
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                  this.displayEmployerModel = false
              } else {
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
              }
          }, (err) => {
              this.loadServ.hide();
              this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
          })

  }
}
addEmployerSubType() {
  this.loadServ.show();
  let data ={
    EmployerTypeName:this.employerTypeForm.value.EmployerTypeName,
    EmployerTypeId:this.employerTypeForm.value.EmployerTypeId,

  };

  
  if (this.selectedId === null || this.selectedId === 'undefined') { 
    this.genSetupServ.addEmployerSubType(data).subscribe((res) => {
              this.loadServ.hide();
              if (res.success === true) {
                this.getEmployerType();
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                  this.displayEmployerModel = false
              } else {
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
              }
          }, (err) => {
              this.loadServ.hide();
              this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
          })
  } else {
    this.genSetupServ.updateEmployerSubType(this.selectedId,data).subscribe((res) =>  {
              this.loadServ.hide();
              if (res.success === true) {
                this.getEmployerType();
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'success');
                  this.displayEmployerModel = false
              } else {
                  this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.result, 'error');
              }
          }, (err) => {
              this.loadServ.hide();
              this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
          })

  }
}
}
