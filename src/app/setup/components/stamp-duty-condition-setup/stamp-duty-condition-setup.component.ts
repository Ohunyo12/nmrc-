import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig, TenorType } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-stamp-duty-condition-setup',
  templateUrl: './stamp-duty-condition-setup.component.html',
  styleUrls: ['./stamp-duty-condition-setup.component.scss']
})
export class StampDutyConditionSetupComponent implements OnInit {
  displayCreateEditModal: boolean;
  stampDutyData: any;
  stampDutyFormGroup: FormGroup;
  showTenor: boolean = false;
  collateralSubTypes: any[];
  tenorType: any[] = []
  conditionId: any;

  constructor(private fb: FormBuilder, private loadingService: LoadingService,private collateralService: CollateralService
    ) { }

  ngOnInit() {
    this.loadingService.show();
    this.getAllStampSetup();
    this.loadForms(); 
    this.getCollateralSubTypes();
    this.tenorType = TenorType.list;
    this.loadingService.hide();
  }

  showModalForm() {
    this.loadForms();
    this.displayCreateEditModal = true;
  }

  getAllStampSetup() {
    this.collateralService.getAllStampSetup().subscribe((data) => {
      this.stampDutyData = data.result;
    }, (err) => {
    });
  }

  toggleForm(ischecked){
    if (ischecked){
      this.showTenor = true;
    }else{
      this.showTenor = false
    }
  }

  

  loadForms() {
    this.stampDutyFormGroup = this.fb.group({
      conditionId:[''],
      collateralSubTypeId: ['', Validators.required],
      tenorModeId: [''],
      tenor: [''],
      useTenor: [false],
      dutiableValue: ['', Validators.required]
      
    });
  }



  editStampSetup(row) {
    this.displayCreateEditModal = true;
    if(row.useTenor){
      this.showTenor = true;
    }
    //this.stampDutyData = row;
     this.stampDutyFormGroup = this.fb.group({
      conditionId:[row.conditionId],
      collateralSubTypeId: [row.collateralSubTypeId, Validators.required],
      tenorModeId: [row.tenorModeId],
      tenor: [row.tenor],
      useTenor: [row.useTenor],
      dutiableValue: [row.dutiableValue, Validators.required]
     });
  }

  deleteStampSetup(row) {
  
    //let row = this.stampDutyData[index];
    this.conditionId = row.conditionId;

    
    this.collateralService.deleteStampSetup(row.conditionId).subscribe((res: any) => {
      this.loadingService.hide();
      this.displayCreateEditModal = false;
      if (res.success === true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
      this.getAllStampSetup();
     
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }
  getCollateralSubTypes() {
    this.collateralService.getCollateralSubTypes().subscribe((response:any) => {
        this.collateralSubTypes = response.result;
        
    })
}

  submitStampSetupForm(form) {

    this.loadingService.show();
    let bodyObj = {
      conditionId: form.value.conditionId,
      collateralSubTypeId: form.value.collateralSubTypeId,
      tenor: form.value.tenor,
      tenorModeId: form.value.tenorModeId,
      useTenor: form.value.useTenor,
      dutiableValue: form.value.dutiableValue
      
    };

    let selectedId = form.value.conditionId;
    if (selectedId === '' ) { // creating a new group
      this.collateralService.addStampSetup(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllStampSetup();
        this.showTenor = false;
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
      this.collateralService.updateStampSetup(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllStampSetup();
        this.showTenor = false;
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();
    // this.displayCreateEditModal = false;
  }
}



