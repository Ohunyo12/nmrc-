import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { StaffService, AuthenticationService } from 'app/admin/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subscription } from 'rxjs';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';

@Component({
  selector: 'app-bulk-prepayment-loan-approval',
  templateUrl: './bulk-prepayment-loan-approval.component.html'
})
export class BulkPrepaymentLoanApprovalComponent implements OnInit {

  batchPrepaymentData: any;
  selectedBatchCode: any;
  showApprovalModal: boolean = false;
  TARGET_ID: number;
  CUSTOMER_ID: number;
  RELOAD: number = 1;

  deferralDocuments: any;
  approvalStatusId: any;
  comment: any;
  approvalStatus: any;
  activeIndex: any;

  OPERATION_ID: number = 258;
  GROUP_CUSTOMER_ID: number = -1;
  REFERENCE_NUMBER: string;
  showReferBackModal: boolean = false;
  preDocumentations: any[] = [];
  BULK_TEMPLATE_OPERATION_ID: number = 258;//46;
  private subscriptions = new Subscription();
  documentations: any[] = [];
  displayDocumentation: boolean = false;
  batchLoansData: any;

  constructor(
    private staffService: StaffService,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
  ) { }

  ngOnInit() {
    this.getBulkPrepaymentsAwaitingApprovalBatch();
  }

  approveBatch(row) {
    this.selectedBatchCode = row.batchCode;
    this.showApprovalModal = true;
    this.TARGET_ID = row.batchCode;
    this.CUSTOMER_ID = row.customerId;
    this.RELOAD++;
    this.preloadDocumentation();
    this.getProcessingBulkPrepaymentByBatch(this.selectedBatchCode);
  }

  getBulkPrepaymentsAwaitingApprovalBatch() {
    // this.loadingService.show();
    this.staffService.getBulkPrepaymentsAwaitingApprovalBatch().subscribe((res) => {
      this.batchPrepaymentData = res.result;
      // this.loadingService.hide();
    }, (err) => {
    });
  }

  getProcessingBulkPrepaymentByBatch(batchId: number) {
    // this.loadingService.show();
    this.staffService.getProcessingBulkPrepaymentByBatch(batchId).subscribe((res) => {
      this.batchLoansData = res.result;
      // this.loadingService.hide();
    }, (err) => {
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
        targetId: __this.selectedBatchCode,
        approvalStatusId: __this.approvalStatusId,
        comment: __this.comment
      };

      __this.staffService.submitPrepaymentBatchForWorkflowApproval(body).subscribe((response: any) => {

        if (response.success == true) {
          __this.approvalStatus = response.result;
          __this.getBulkPrepaymentsAwaitingApprovalBatch();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'The Batch Prepayment has been approved!', 'success');
          __this.showApprovalModal = false;
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


  approvalTabChange(event) {
    this.activeIndex = event.index;
  }

  referBack() {
    this.showApprovalModal = false;
    this.showReferBackModal = true;
  }

  modalControl(event) {
    if (event == true) {
      this.showReferBackModal = false;
    }
  }

  referBackResultControl(event) {
    if (event == true) {
      this.getBulkPrepaymentsAwaitingApprovalBatch();
      this.showReferBackModal = false;
    }
  }

  preloadDocumentation() {
    this.loadingService.show();
    this.staffService.getLoadedDocumentationBulkLiquidation(this.BULK_TEMPLATE_OPERATION_ID, this.selectedBatchCode).subscribe((response: any) => {
      this.preDocumentations = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  previewDocumentation(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentBulkLiquidation(this.BULK_TEMPLATE_OPERATION_ID, this.selectedBatchCode).subscribe((response: any) => {
        this.documentations = response.result;
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  print(): void {
    this.previewDocumentation(true);
    let printTitle = 'BULK LIQUIDATION - ' + this.selectedBatchCode;
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
            <head>
            <title>${printTitle}</title>
            <style>
            //........Customized style.......
            </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
        </html>`
    );
    popupWin.document.close();
  }

}
