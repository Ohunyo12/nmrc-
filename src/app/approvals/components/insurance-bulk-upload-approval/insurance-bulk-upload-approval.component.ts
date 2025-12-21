import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalConfig, ApprovalStatus } from 'app/shared/constant/app.constant';
import { CreditAppraisalService, LoanOperationService, LoanService } from 'app/credit/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService, GeneralSetupService } from 'app/setup/services';

@Component({
    selector: 'app-insurance-bulk-upload-approval',
    templateUrl: './insurance-bulk-upload-approval.component.html'
  })
  export class InsuranceBulkUploadApprovalComponent implements OnInit {
    loanSelectedData: any = {};
  records: any[] = [];
  label: string = "Bulk Approval";
  approvalStatusData: any[];
  displayApprovalModal: boolean = false;
  displayConfirmDialog: boolean;
  activeIndex: any;
  message: any;
  title: any;
  cssClass: any;
  show: boolean = false;
  displayCommentForm: boolean = false;
  errorMessage: any;
  receiverLevelId: any;
  receiverStaffId: any;
  forwardAction: any;
  commentTitle: any;
  commentForm: any;
  activeTabindex1: any;
  multipData: any[] = [];
  width: string;
  hasFees: boolean = false;
  terminateRebook: boolean = false;
  showAttachedDocument: boolean = false;
  ammendedAmount: number = 0;
  bulkApprovalForm: FormGroup;
  totalRecords: number = 0;
  allData: any[]= [];

  constructor(
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private loanOperationService: LoanOperationService,
    private loanService: LoanService,
    private genSetupService: GeneralSetupService
  ) {}

  ngOnInit() {
    this.getBulkInsuranceUploadAwaitingApproval();
    this.getAllApprovalStatus();

    this.bulkApprovalForm = this.fb.group({
        comment: ['', Validators.required],
        approvalStatusId: ['', Validators.required]
      });
  }

  getBulkInsuranceUploadAwaitingApproval() {
    this.loadingService.show();
    this.loanService
      .getBulkInsuranceUploadAwaitingApproval()
      .subscribe((res) => {
        this.records = res.result;
        this.totalRecords = this.records.length;
        this.loadingService.hide();
      });
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response) => {
      let tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }

  approval() {
    this.allData = this.records;
    this.loanSelectedData.approvalStatusId = "";
    this.displayApprovalModal = true;
  }

  
  displayBulkApprovalModal: boolean = false;
  bulkApproval() {
    this.allData = this.records;
    this.displayBulkApprovalModal = true;
  }

  promptToGoForApproval(formObj) {
    this.goForApproval(formObj);
  }

  goForApproval(formObj) {
    let bodyObj = {
      targetId: this.records[0].bulkInsuranceUploadApprovalId,
      approvalStatusId: formObj.approvalStatusId,
      comment: formObj.comment,
      operationId: this.records[0].operationId,
    };

    const __this = this;
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.loanOperationService
          .sendBulkInsuranceUploadForApproval(bodyObj)
          .subscribe(
            (response) => {
              __this.loadingService.hide();
              if (response.success === true) {
                __this.loanSelectedData = {};
                __this.getBulkInsuranceUploadAwaitingApproval();
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "success"
                );
                __this.displayApprovalModal = false;
              } else {
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "error"
                );
                __this.displayApprovalModal = true;
              }
            },
            (err) => {
              __this.loadingService.hide();
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                JSON.stringify(err),
                "error"
              );
            }
          );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }


  goForBulkApproval(formObj) {
    let bodyObj = {
      targetId: this.loanSelectedData.bulkInsuranceUploadApprovalId,
      approvalStatusId: formObj.approvalStatusId,
      comment: formObj.comment,
      operationId: this.loanSelectedData.operationId,
    };

    const __this = this;
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.loanOperationService
          .sendBulkPolicyForBulkApproval(__this.records,bodyObj.approvalStatusId,bodyObj.comment)
          .subscribe(
            (response) => {
              __this.loadingService.hide();
              if (response.success === true) {
                __this.loanSelectedData = {};
                __this.getBulkInsuranceUploadAwaitingApproval();
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "success"
                );
                __this.displayApprovalModal = false;
              } else {
                swal(
                  `${GlobalConfig.APPLICATION_NAME}`,
                  response.message,
                  "error"
                );
                __this.displayApprovalModal = true;
              }
            },
            (err) => {
              __this.loadingService.hide();
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                JSON.stringify(err),
                "error"
              );
            }
          );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  cancelApproval() {
    swal(`${GlobalConfig.APPLICATION_NAME}`, "Approval cancelled", "error");
    this.displayConfirmDialog = false;
    this.displayApprovalModal = false;
  }

  handleChange(e) {
    this.activeIndex = e.index;
  }

  finishBad(message) {
    this.showMessage(message, "error", "FintrakBanking");
  }

  finishGood(message = "ok") {
    this.loadingService.hide();
    this.showMessage(message, "success", "FintrakBanking");
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  cancelForm() {
    this.displayCommentForm = false;
    this.errorMessage = "";
    this.receiverLevelId = null;
    this.receiverStaffId = null;
  }

  disapprove() {
    this.forwardAction = ApprovalStatus.DISAPPROVED;
    this.displayCommentForm = true;
    this.commentTitle = "Disapprove";
    this.commentForm.controls["vote"].setValue(1);
  }

  forward(targetId: number = 0, operationId: number = 0) {
    if (targetId <= 0 || operationId <= 0) {
      return;
    }
    let body = {
      targetId,
      operationId,
    };

    this.loadingService.showKeyApiCall();
    this.loanService.logApproval(body).subscribe(
      (response) => {
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, "success");
        }
        this.loadingService.hideKeyApiCall();
      },
      (err) => {
        this.loadingService.hideKeyApiCall(1000);
      }
    );
  }
  //#endregion
}
