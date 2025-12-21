import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { StaffRoleService } from 'app/setup/services';

@Component({
  selector: 'app-approval-setup',
  templateUrl: './approval-setup.component.html',
  styleUrls: ['./approval-setup.component.scss']
})
export class ApprovalSetupComponent implements OnInit {

    entityName: string;
    approvalSetUpForm: FormGroup
    approvalSetup:any[];
    displayApprovalSetupModal: boolean = false;
    activeIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private staffRolServ: StaffRoleService,
  ) {}
    
  ngOnInit() {
    this.refresh();

  }

  clearApprovalSetupControl() { 
     this.approvalSetUpForm = this.fb.group({
      approvalsetupId: '',
       useRoundRublin: [false, Validators.required],
       isRetailOnlyRoundRobin: [false, Validators.required],
  });
 }

  refresh(){
    this.clearApprovalSetupControl();
    this.getAllApprovalSetUp();
  }

  
  handleChange(evt) {
    this.activeIndex = evt.index;
}

showAprovalSetupwModal() {
  this.entityName = "New Approval Setup"
  this.clearApprovalSetupControl();
  this.displayApprovalSetupModal = true;
}

submitApprovalSetupForm(formObj){
  this.loadingService.show(); 
        let body = formObj.value;
      this.loadingService.show();
      if (body.approvalsetupId > 0){
        this.staffRolServ.updateApprovalSetUp(body).subscribe((res) => {
          if (res.success == true) {
              this.refresh();
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
              this.displayApprovalSetupModal = false;
          } else {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
          }
      }, (err: any) => { 
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
      });
      } else {
        this.staffRolServ.addUpdateApprovalSetup(body).subscribe((res) => {
          if (res.success == true) {
              this.refresh();
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
              this.displayApprovalSetupModal = false;
          } else {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
          }
      }, (err: any) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
      });
      }
}


getAllApprovalSetUp() {
  this.staffRolServ.getApprovalSetUp().subscribe((response: any) => {
      this.approvalSetup = response.result;
  });
}


editApprovalSetUp(row, event){
  this.entityName = "Approval SetUp"
  this.approvalSetUpForm = this.fb.group({
    approvalsetupId:[row.approvalsetupId],
    useRoundRublin:[row.useRoundRublin, Validators.required],
    isRetailOnlyRoundRobin:[row.isRetailOnlyRoundRobin, Validators.required]
  });
  this.displayApprovalSetupModal = true;
}

}
