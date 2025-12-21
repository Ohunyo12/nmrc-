import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService } from 'app/setup/services/approval.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { DocumentUploadComponent } from 'app/shared/components/document-upload/document-upload.component';
import { CreditAppraisalService } from 'app/credit/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CallMemoService } from 'app/setup/services';

@Component({
  selector: 'app-call-memo-approval',
  templateUrl: './call-memo-approval.component.html',
  // styleUrls: ['./call-memo-approval.component.scss']
})
export class CallMemoApprovalComponent implements OnInit {
  targetId: any;
  operationId: any;
  showUploadForm: boolean;
  displayCallMemo: boolean=false;
  approvalStatusId: any;
  comment: any;
  activeTabindex: number;
  callMemoHtml: any;
  callMemoTrailData: any[] = [];
  commentForm: FormGroup;
  showApprovalBottun:any ;
  displayCommentForm: boolean = false;
  displayCallMemoComments: boolean = false;
  rowSelected: boolean = false;
  readonly OPERATION_ID: number = 150;

  startDate: any;
  endDate: any;
  searchText: any;
  searchName: any;
  callMemoSearchData: any;
  callMemoApprovedData: any;

  @ViewChild(DocumentUploadComponent, {static: false}) docUpload: DocumentUploadComponent;

  ngOnInit() {
    this.getCallMemoWaitingForApproval();
  }

  searchTerm$ = new Subject<any>();
  searchResults: any[] = [];
  callMemoId: any;
  approvalStatus: any;
  customerId: any;
  callMemoTableData: any[] = [];


  constructor(
    private fb: FormBuilder,
    private callMemoService: CallMemoService,
    private loadingService: LoadingService,
    private approvalService: ApprovalService,
    private camService: CreditAppraisalService) {

  }

  deleteLink: any;
  reload: any;
  applicationReferenceNumber: string;

  getCallMemoHtml(id) {
    this.camService.getCallMemoHtml(id).subscribe((response: any) => {
        if (response.result == null) return;
        this.callMemoHtml = response.result;
    }, (err) => {
      
    });
}

viewEditCallMemo2(data) {
  this.getCallMemoHtml(data.callMemoId);
  this.callMemoId = data.callMemoId;
  this.displayCallMemo=true;

}

searchCallMemo() {
  let data = {
    startDate: this.startDate,
    endDate: this.endDate,
    customerName: this.searchName
  }

  this.callMemoService.searchCallMemo(data).subscribe((res) => {
    this.callMemoApprovedData = res.result;
  }, (err) => {
  });
}


print(): void {
  let printTitle = 'CALL MEMO';
  let printContents, popupWin;
  printContents = document.getElementById('print-section').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
        <head>
        <title>${printTitle}</title>
        <style>s
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
}


viewEditCallMemo(data) {
  this.getCallMemoHtml(data.callMemoId);
  this.displayCallMemo=true;
  this.callMemoId = data.callMemoId;
  
}

comments(){
  this.getCallMemoTrail(this.callMemoId, this.OPERATION_ID);
  this.displayCallMemoComments = true;
  //this.displayCallMemo=false;
}
getCallMemoTrail(applicationId, operationId) {
  this.callMemoService.getCallMemoTrail(applicationId, operationId).subscribe((data) => {
    this.callMemoTrailData = data.result;
  }, (err) => {
    ////console.log('Error', err);
  });
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
        callMemoId: __this.callMemoId,
        approvalStatusId: __this.approvalStatusId,
        comment: __this.comment
        //customerId: __this.customerId//CallMemoId
      };



      __this.approvalService.submitCallMemoApproval(body).subscribe((response: any) => {

        if (response.success == true) {
          __this.approvalStatus = response.result;
          __this.getCallMemoWaitingForApproval();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'The Call Memo has been approved!', 'success');
          __this.activeTabindex = 0;
          __this.docUpload.reload = 0;
          __this.comment = null;
          __this.approvalStatusId = null;
          // this.ngModel = null;
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

  getCallMemoWaitingForApproval() {
    this.approvalService.getCallMemoWaitingForApproval().subscribe((data) => {
      this.callMemoTableData = data.result;
    }, (err) => {
    });
  }

  loadUploadValues(row) {
    this.showUploadForm = false;
    this.callMemoId = row.callMemoId;
    this.operationId = 150;
    this.docUpload.customerId = row.customerId;
    this.docUpload.targetId = row.callMemoId;
    this.docUpload.operationId = row.operationId;
    this.docUpload.getDocumentsByTarget();
    this.activeTabindex = 1;
  }

  modalControl(event) {
    if(event == true) {
        this.displayCommentForm = false;
    }
  }

  referBackResultControl(event) {
    if(event == true) {
        this.getCallMemoWaitingForApproval();
        this.displayCommentForm = false;
        this.showApprovalBottun = false;
    }
  }

  showCommentForm() {
    this.rowSelected = true;
    this.commentForm = this.fb.group({
        comment: ['', Validators.required],
        approvalLevelId: ['', Validators.required],
        searchedNameId: ['', Validators.required]
    });
    this.targetId = this.callMemoId;
    this.operationId =  150;
    this.displayCommentForm = true;
  }

}
