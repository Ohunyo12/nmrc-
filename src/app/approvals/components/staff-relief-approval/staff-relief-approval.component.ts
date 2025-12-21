import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ApprovalService } from '../../../setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'staff-relief-approval',
  templateUrl: './staff-relief-approval.component.html',

})
export class StaffReliefApprovalComponent implements OnInit {
  primaryForm: FormGroup;
  displayModalForm: boolean = false;
  selectedId: number = null;
  panelHeader = 'Staff Relief Details';
  comment: string = null;
  approvalStatusId: number = null;
  show: boolean = false; message: any; title: any; cssClass: any;

  pendingReliefs: any[] = [];
  selected: any = null;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private approvalService: ApprovalService,

  ) {
  }

  ngOnInit() {
    // this.clearControls();
    this.getApprovalReliefs();
  }
  getApprovalReliefs() {
    this.loadingService.show();
    this.approvalService.getApprovalReliefsAwaitingApprovals().subscribe((response: any) => {
      this.pendingReliefs = response.result;

      this.loadingService.hide();
    }, (err) => {

      this.loadingService.hide();
    });
  }
  view(item) {
    this.selected = item;
    this.displayModalForm = true;
    this.approvalStatusId = null;
    this.comment = null;
  }
  refresh() {
    this.getApprovalReliefs();
    this.displayModalForm = false;
    this.approvalStatusId = null;
    this.comment = null;
  }

  forward() {
    const __this = this;
    const status = +this.approvalStatusId == 2 ? 'Approve' : 'Disapprove';

    swal({
      title: status + ' Staff Relief?',
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

      const body = {
        targetId: __this.selected.reliefId,
        approvalStatusId: __this.approvalStatusId,
        comment: __this.comment,
      }
      __this.loadingService.show();
      __this.approvalService.getApprovalReliefsGoForApproval(body).subscribe((res) => {
        __this.loadingService.hide();
        if (res.success === true) {
          swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
          __this.refresh(); // refresh
        } else {
          swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
        }
      }, (err) => {
        swal(GlobalConfig.APPLICATION_NAME, err, 'error');
        __this.loadingService.hide();
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
      }
    });
  }

  hideMessage(evt) {

  }
  
}