import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../../../setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { Message } from 'primeng/components/common/api';
import { saveAs } from 'file-saver';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-deferral-document-approval',
  templateUrl: './deferral-document-approval.component.html'
})
export class DeferralDocumentApprovalComponent implements OnInit {
  deferralDocuments: any[];
  conditionId: any;
  approvalStatusId: any;
  singleDeferredAndWaivedDocument: any[];
  comment: any;
  today = new Date();
  displayDeferralModal: boolean = false;
  displayCommentForm: boolean = false;
  approvalStatus: any;
  deferralDocumentUpload: any[];
  deferralTrailData: any[];
  viewUpload: any;
  operationId: number;
  targetId: number;
  displayUpload: boolean = false;
  rowSelected: boolean = false;
  binaryFile: string;
  selectedDocumentName: string;
  commentForm: FormGroup;


  constructor(private checklistService: ChecklistService,private loadingService: LoadingService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getDeferralDocumentsWaitingForApproval();
  }


  getDeferralChecklistByConditionId(conditionId) {
    this.loadingService.show();
    this.checklistService.getDeferralChecklistByConditionId(conditionId).subscribe((response: any) => {
      this.singleDeferredAndWaivedDocument = response.result;
      this.loadingService.hide();
    });
  }


  showCommentForm(init = false) {
    this.commentForm = this.fb.group({
        comment: ['', Validators.required],
        approvalLevelId: ['', Validators.required],
    });
    if (init == false) this.displayCommentForm = true;
}

  getDeferralDocumentsWaitingForApproval() {
    this.checklistService.getDeferralDocumentsWaitingForApproval().subscribe((data) => {
      this.deferralDocuments = data.result;
    }, (err) => {
    });
  }

  msgs: Message[] = [];
  showSuccess(type, message) {
    this.msgs = [];
    this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
  }

  getDeferralApprovalTrail(targetId, operationId) {
    this.checklistService.getDeferralApprovalTrail(targetId, operationId).subscribe((data) => {
      this.deferralTrailData = data.result;
    }, (err) => {
    });
  }

  getConditionPrecedentDocumentUpload(conditionId) {
    this.checklistService.getConditionPrecedentDocumentUpload(conditionId).subscribe((data) => {
      if (data.success == true) {
        this.deferralDocumentUpload = data.result;
      } else {
        this.showSuccess('info', 'No upload found for this deferral');
      }
    });
  }

  modalControl(event) {
    if (event == true) {
        this.displayCommentForm = false;
    }
}

referBackResultControl(event) {
  if (event == true) {
      this.getDeferralDocumentsWaitingForApproval();
      this.displayCommentForm = false;
  }
}

fileDocument: any;
selectedDocument: any;
viewDocument(d, view = false) {
  this.fileDocument = null;
  this.loadingService.show();
  this.checklistService.ViewConditionPrecedentDocumentUpload(d).subscribe((response: any) => {
      this.fileDocument = response.result;
      if (this.fileDocument != null) {
          this.loadingService.hide();
          const downloadedFileName = this.fileDocument.fileName;
          this.binaryFile = this.fileDocument.fileData;
          this.selectedDocument = this.fileDocument.documentTitle;

          if (view) {
              this.displayUpload = true;
              return;
          }

          let myDocExtention = this.fileDocument.fileExtension;
          var byteString = atob(this.binaryFile);
          var ab = new ArrayBuffer(byteString.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          var bb = new Blob([ab]);

          if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
              try {
                  var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                  saveAs(file);
              } catch (err) {
                  var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                  window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
              }
          }
          if (myDocExtention == 'png' || myDocExtention == 'png') {
              try {
                  var file = new File([bb], downloadedFileName, { type: 'image/png' });
                  saveAs(file);
              } catch (err) {
                  var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                  window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
              }
          }
          if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
              try {
                  var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                  saveAs(file);
              } catch (err) {
                  var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                  window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
              }
          }
          if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
              try {
                  var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                  saveAs(file);
              } catch (err) {
                  var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                  window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
              }
          }
          if (myDocExtention == 'doc' || myDocExtention == 'docx') {
              try {
                  var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                  saveAs(file);
              } catch (err) {
                  var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                  window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
              }
          }
      }

  }, (error) => {
      this.loadingService.hide(1000);
  });
}
  
  customerId = 0;
  deferralId = 0;
  applicationReferenceNumber = "";
  approveDeferral(row) {
    this.conditionId = row.conditionId;
    this.targetId = row.conditionId;
    this.operationId = row.operationId;
    this.customerId = row.customerId;
    this.deferralId = row.deferralId;
    this.applicationReferenceNumber = row.applicationReferenceNumber;
    this.getConditionPrecedentDocumentUpload(row.conditionId);
    this.getDeferralChecklistByConditionId(row.conditionId)
    this.getDeferralApprovalTrail(row.conditionId, row.operationId);
    this.displayDeferralModal = true;
    this.rowSelected = true;
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
      __this.loadingService.showKeyApiCall();
      __this.checklistService.submitDeferralDocumentForApproval(body).subscribe((response: any) => {
          __this.loadingService.hideKeyApiCall();
        if (response.success == true) {
          __this.approvalStatus = response.result;
          __this.getDeferralDocumentsWaitingForApproval();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.displayDeferralModal = false;
          // __this.activeTabindex = 0;
          __this.comment = null;
          __this.approvalStatusId = null;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

}
