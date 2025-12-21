import { Component, OnInit } from '@angular/core';
import { GeneralSetupService, ApprovalService, StaffRoleService } from '../../../../setup/services';
import swal from 'sweetalert2';
import { AdminService } from '../../../../admin/services';
import { LoadingService } from '../../../../shared/services/loading.service';
import { FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
  selector: 'app-staff-role-approval',
  templateUrl: './staff-role-approval.component.html',
})
export class StaffRoleApprovalComponent implements OnInit {
  staffRoleApprovalData: any[];
  displayStaffRoleModal: boolean = false;
  selectedStaffRoleData: any = {};
  approvalStatusData: any[];
  approvalWorkflowData: any[];
  activeIndex: number = 0;
  constructor(
    private genSetupService: GeneralSetupService, private loadingService: LoadingService,
    private approvalService: ApprovalService, private adminService: AdminService, private staffRolServ: StaffRoleService,

  ) { }

  ngOnInit() {
    this.loadingService.show();
    this.getAllApprovalStatus();
    this.getAllStaffRoleAwaitingApproval();
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      const tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }
  getAllStaffRoleAwaitingApproval(): void {
    this.staffRolServ.getAllStaffRoleAwaitingApproval().subscribe((response: any) => {
      this.staffRoleApprovalData = response.result;
      this.loadingService.hide();
    });
  }
  viewStaffRole(index, event) {
    event.preventDefault();
    this.selectedStaffRoleData = {};
    this.selectedStaffRoleData = index;


    const dataObj = this.selectedStaffRoleData;
    this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.staffRoleId).subscribe((res) => {
      let data: any[] = res.result;
      this.approvalWorkflowData = data.filter(d => d.systemResponseDate == null);
    });

    this.displayStaffRoleModal = true;

  }
  goForApproval(formObj, event) {

    let bodyObj = {
      targetId: formObj.staffRoleId,
      approvalStatusId: formObj.approvalStatusId,
      comment: formObj.comment
    };

    const __this = this;

    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
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
      __this.staffRolServ.goForApproval(bodyObj).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.getAllStaffRoleAwaitingApproval();
          __this.displayStaffRoleModal = false;
        } else {
          __this.displayStaffRoleModal = true;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        }
      }, (err) => {
        __this.loadingService.hide();
        __this.displayStaffRoleModal = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  hideModal() {
    this.handleChange(0);
    this.activeIndex = 0;
    this.displayStaffRoleModal = false;
  }

  handleChange(e) {
    this.activeIndex = e.index;
  }
}
