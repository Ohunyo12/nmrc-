import { CreditAppraisalService } from '../../../../credit/services/credit-appraisal.service';
import { saveAs } from 'file-saver';
import { GlobalConfig } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { FeeConcessionService } from '../../../../credit/services/fee-concession.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-fee-concession-approval',
  templateUrl: './fee-concession-approval.component.html',
})
export class FeeConcessionApprovalComponent implements OnInit {
  myDocExtention: any;
  pdfFileName: any;
  pdfFile: any;
  msgs: Message[] = [];
  displayUpload: boolean;
  viewUpload: any;
  binaryFile: any;
  selectedDocumentName: any;
  feeConcessionAwaitingApproval: any[];
  selectedFeeConcession: any[];
  displayFeeConcessionApprovalModal: boolean = false;
  selectedFeeConcessionData: any = {};
  approvalStatusData: any[];
  constructor(private loadingService: LoadingService,
    private genSetupService: GeneralSetupService,
    private feeConcessionService: FeeConcessionService,
    private camService: CreditAppraisalService) { }

  ngOnInit() {
    this.getAllApprovalStatus();
    this.getFeeConcessionAwaitingApproval();
  }
  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      let tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }
  viewFeeConcessionDetails(index, evt) {
    this.selectedFeeConcessionData = index;
    this.selectedFeeConcessionData.concessionId = index.concessionId;
    this.displayFeeConcessionApprovalModal = true;
  }
  getFeeConcessionAwaitingApproval() {
    this.loadingService.show();
    this.feeConcessionService.getFeeConcessionAwaitingApproval().subscribe((response: any) => {
      this.feeConcessionAwaitingApproval = response.result;
    });
    this.loadingService.hide();
  }
  goForApproval(formObj) {
    let loading = this.loadingService;
    let bodyObj = {
      targetId: formObj.concessionId,
      approvalStatusId: formObj.approvalStatusId,
      comment: formObj.comment
    };
    const __this = this;
    __this.displayFeeConcessionApprovalModal = false;
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
      __this.feeConcessionService.sendFeeConcessionForApproval(bodyObj).subscribe((response: any) => {
        if (response.success == true) {
          __this.getFeeConcessionAwaitingApproval();
          __this.displayFeeConcessionApprovalModal = false;
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
          __this.loadingService.hide();
          __this.displayFeeConcessionApprovalModal = true;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      }, (err) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss == 'cancel') {
        __this.displayFeeConcessionApprovalModal = true;
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }
  hideModal() {
    this.displayFeeConcessionApprovalModal = false;
  }
  viewDocument(data, evt) {
    evt.preventDefault();
    this.selectedDocumentName = null;
    this.binaryFile = null;
    this.loadingService.show()
    this.camService.getDocumentUploadByRefnoAppno(data.loanApplicationDetailId, data.concessionId).subscribe((data) => {
      this.viewUpload = data.result;
      if (this.viewUpload != undefined) {
        if (['jpg', 'jpeg', 'png'].indexOf(this.viewUpload.fileExtension.toLowerCase()) > -1) {
          this.selectedDocumentName = this.viewUpload.fileName;
          this.binaryFile = this.viewUpload.fileData;
          this.displayUpload = true;
        }
        if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].indexOf(this.viewUpload.fileExtension.toLowerCase()) > -1) {
         
          this.DownloadDocument(this.viewUpload);
        }
      } else {
        this.showSuccess('info', 'No upload found for this checklist');
      }
      this.loadingService.hide()
    });
  }
  
  
  DownloadDocument(doc) {
   
    if (doc != null) {
        this.pdfFile = doc.fileData;
        this.pdfFileName = doc.documentTitle;
        this.myDocExtention = doc.fileExtension;
        var byteString = atob(this.pdfFile);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);

        if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
            try {
                var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
                saveAs(file);
            } catch (err) {
                var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
            }
        }
        if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
            try {
                var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
                saveAs(file);
            } catch (err) {
                var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
            }
        }
        if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
            try {
                var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
                saveAs(file);
            } catch (err) {
                var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
            }
        }
        if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
            try {
                var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                saveAs(file);
            } catch (err) {
                var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
            }
        }
        if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
            try {
                var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                saveAs(file);
            } catch (err) {
                var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
            }
        }

    }

}

  showSuccess(type, message) {
    this.msgs = [];
    this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
  }
}
