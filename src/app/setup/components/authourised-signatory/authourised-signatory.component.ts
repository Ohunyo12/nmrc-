import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { GeneralSetupService } from 'app/setup/services/general-setup.service';

@Component({
  //selector: 'app-authourised-signatory',
  templateUrl: './authourised-signatory.component.html',
  //styleUrls: ['./authourize-signatory.component.scss']
})
export class AuthourisedSignatoryComponent implements OnInit {
  
  signatoryForm: boolean = false;
  signatoryFormGroup: FormGroup;
  authourisedSignatories: any;
  formState: string;
  signatoryRow: any;
  selectedId: any;

  constructor(
    private fb:FormBuilder,
    private loadingService: LoadingService,
    private genSetupService: GeneralSetupService,
  ) 
  { }

  ngOnInit() {

    this.getAllSignatories();
    this.initilizeSignatoryForm();
  }


  addNewSignatory() {
    this.initilizeSignatoryForm();
    this.selectedId = null;
    this.formState = 'Add New';
    this.signatoryForm = true;
  }

  initilizeSignatoryForm() {
    this.signatoryFormGroup = this.fb.group({
      signatoryName: ['', Validators.required],
      signatoryInitials: ['', Validators.required],
      signatoryTitle: ['', Validators.required],
    });
  }

  getAllSignatories(): void {
    this.loadingService.show();
    this.genSetupService.getAllSignatories().subscribe((response: any) => {
      this.authourisedSignatories = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editSignatory(data): void {
    this.initilizeSignatoryForm();
    this.signatoryRow = data;
    this.selectedId = data.signatoryId;
    this.formState = 'Edit';

    this.signatoryFormGroup = this.fb.group({
      signatoryName: [data.signatoryName, Validators.required],
      signatoryInitials: [data.signatoryInitials, Validators.required],
      signatoryTitle: [data.signatoryTitle, Validators.required],
    });

    this.signatoryForm = true;
  }


  removeSignatory(data): void {

    this.selectedId = data.signatoryId;

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "Confirm Delete, Are you sure you want to Delete?",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success btn-move',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    }).then(function () {
      __this.loadingService.show();
      __this.genSetupService.removeSignatory(__this.selectedId).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success == true) {
          __this.getAllSignatories();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Removed Successfully!', 'success');
        }
        else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err: any) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  saveSignatory(form) {

    let body = {
      signatoryName: form.value.signatoryName,
      signatoryInitials: form.value.signatoryInitials,
      signatoryTitle: form.value.signatoryTitle,

  };

    this.loadingService.show();
    if(this.selectedId == null) {
      this.genSetupService.saveSignatory(body).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true){ 
              this.initilizeSignatoryForm();
              this.getAllSignatories();
              this.signatoryForm = false;
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
            }
          else{ 
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
          }
      }, (err: any) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
  } 
  else {
    this.genSetupService.updateSignatory(this.selectedId, body).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {
        this.getAllSignatories();
        this.signatoryForm = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Updated Successfully!', 'success');
      }
      else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }

  }





}
