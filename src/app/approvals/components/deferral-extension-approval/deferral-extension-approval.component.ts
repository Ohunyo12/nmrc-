import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../../../setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-deferral-extension-approval',
  templateUrl: './deferral-extension-approval.component.html'
})
export class DeferralExtensionApprovalComponent implements OnInit {
  deferralDocuments: any;
  conditionId: any;
  approvalStatusId: any;
  comment: any;
  displayDeferralModal: boolean = false;
  approvalStatus: any;

  constructor(private checklistService: ChecklistService) { }

  ngOnInit() {
    this.getDeferralExtensionsWaitingForApproval();
  }

  getDeferralExtensionsWaitingForApproval() {
    this.checklistService.getDeferralExtensionsWaitingForApproval().subscribe((data) => {
      this.deferralDocuments = data.result;
    }, (err) => {
    });
  }

  customerId = 0;
  deferralId = 0;
  operationId = 0;
  applicationReferenceNumber = "";
  approveDeferral(row) {
    this.conditionId = row.conditionId;
    this.displayDeferralModal = true;
    this.customerId = row.customerId;
    this.deferralId = row.deferralId;
    this.operationId = row.operationId;
    this.applicationReferenceNumber = row.applicationReferenceNumber;
  }

  submitForApproval() {
    let __this = this;

    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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

      let body = {
        conditionId: __this.conditionId,
        approvalStatusId: __this.approvalStatusId,
        comment: __this.comment
      };

      __this.checklistService.submitDeferralExtensionForApproval(body).subscribe((response: any) => {

        if (response.success == true) {
          __this.approvalStatus = response.result;
          __this.getDeferralExtensionsWaitingForApproval();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'The Deferral Extension has been approved!', 'success');
          __this.displayDeferralModal = false;
          // __this.activeTabindex = 0;
          __this.comment = null;
          __this.approvalStatusId = null;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Error occured saving this record! try again', 'error');
        }

      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

}
