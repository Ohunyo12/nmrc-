import { saveAs } from 'file-saver';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { FeeConcessionService } from '../../services/fee-concession.service';
import swal from 'sweetalert2';
import { GlobalConfig, FeeConcessionTypeEnum } from '../../../shared/constant/app.constant';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-loan-fee-concession',
  templateUrl: './loan-fee-concession.component.html',
})
export class LoanFeeConcessionComponent implements OnInit {
  displayUpload: boolean = false;
  msgs: Message[] = [];
  viewUpload: any = {};
  selectedDocumentName: any;
  binaryFile: any;
  applicationReferenceNumber: any;
  hasDocument: boolean = false;
  interestRate: any;
  defaultValue: string = null;
  displayLoannFeeType: boolean;
  feeConcessionCharges: any[];
  feeConcessionData: any[];
  searchQuery: any;
  searchResult: any[];
  feeConcessiontype: any[];
  display: boolean = true;
  displayLoanSearchResults: boolean = false;
  displayLoanFeeConcession: boolean = false;
  entityName: string;
  displayAddModal: boolean = false;
  feeConcessionForm: FormGroup;
  loanApplicationDetailId: number = null;
  constructor(private loanAppService: LoanApplicationService,
    private loadingService: LoadingService,
    private feeConcessionService: FeeConcessionService,
    private fb: FormBuilder,
    private camService: CreditAppraisalService) { }

  ngOnInit() {
    this.display = true;
    this.getFeeConcessionType();
    this.loadFeeConcessionForm();
  }
  searchForLoan(queryString) {
    this.loadingService.show();
    this.loanAppService.searchForLoan(queryString).subscribe((data) => {
      this.searchResult = data.result;
      this.displayLoanSearchResults = true;
      this.loadingService.hide();
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }
  viewLoanConcession(data, evt) {
    evt.preventDefault();
    this.loanApplicationDetailId = data.loanApplicationDetailId;
    this.getLoanApplicationFeeConcession(this.loanApplicationDetailId);
    this.getFeeConcessionCharges(this.loanApplicationDetailId);
    this.interestRate = data.interestRate;
    this.applicationReferenceNumber = data.applicationReferenceNumber;
    this.display = false;
    this.displayLoanSearchResults = false;
    this.displayLoanFeeConcession = true;
  }
  getLoanApplicationFeeConcession(loanApplicationId) {
    this.loadingService.show();
    this.feeConcessionService.getLoanApplicationFeeConcession(loanApplicationId).subscribe((data: any) => {
      this.feeConcessionData = data.result;
      this.loadingService.hide();
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }
  getFeeConcessionType() {
    this.feeConcessionService.getFeeConcessionType().subscribe((data: any) => {
      this.feeConcessiontype = data.result;
    });
  }
  getFeeConcessionCharges(id) {
    this.feeConcessionService.getFeeConcessionCharges(id).subscribe((data: any) => {
      this.feeConcessionCharges = data.result;
    });
  }
  editFeeConcession(index, evt) {
    evt.preventDefault();
    this.hasDocument = false;
    this.defaultValue = null;
    this.displayLoannFeeType = false;
    this.entityName = 'Edit Fee Concession';
    const row = index;
    this.feeConcessionForm = this.fb.group({
      concessionId: [row.concessionId],
      concessionTypeId: [row.concessionTypeId, Validators.required],
      concessionReason: [row.concessionReason, Validators.required],
      concession: [row.concession, Validators.required],
      loanChargeFeeId: [row.loanChargeFeeId],
      loanApplicationDetailId: [row.loanApplicationDetailId],
      hasDocument: [false]
    });
    if (row.concessionTypeId == FeeConcessionTypeEnum.Fee) {
      this.displayLoannFeeType = true;
    } else {
      this.displayLoannFeeType = false;
    }
    this.displayAddModal = true;
  }
  
  showAddNew() {
    this.entityName = 'Add New Fee Concession';
    this.displayLoannFeeType = false;
    this.loadFeeConcessionForm();
    this.displayAddModal = true;
    this.hasDocument = false;
  }
  loadFeeConcessionForm() {
    this.feeConcessionForm = this.fb.group({
      concessionId: [0],
      concessionTypeId: ['', Validators.required],
      concessionReason: ['', Validators.required],
      defaultValue: [this.defaultValue],
      concession: ['', Validators.required],
      loanChargeFeeId: [''],
      loanApplicationDetailId: [this.loanApplicationDetailId],
      hasDocument: [false]
    })
  }
  submitFeeConcessionForm(formObj) {
    if (this.hasDocument == true && this.uploadFileTitle == null) {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please upload a document to continue', 'info');
      return;
    }
    this.loadingService.show();
    let body = formObj.value;
    this.feeConcessionService.addUpdateFeeConcession(body).subscribe((res: any) => {
      if (res.success == true) {
        this.loadingService.hide();
        if (this.hasDocument == true) {
          this.uploadFile(res.result);
        }

        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.getLoanApplicationFeeConcession(this.loanApplicationDetailId);
        this.displayAddModal = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
  BackToList() {
    this.display = false;
    this.displayLoanSearchResults = true;
    this.displayLoanFeeConcession = false;
  }
  onConcessionTypeChanged(event) {
    this.defaultValue = null;
    this.displayLoannFeeType = false;
    if (event == FeeConcessionTypeEnum.Fee) {
      this.displayLoannFeeType = true;
    } else {
      this.displayLoannFeeType = false;
      this.defaultValue = this.interestRate;
      this.feeConcessionForm.get("defaultValue").setValue(this.defaultValue);
    }
  }
  onLoanFeeTypeChanged(event) {
    this.defaultValue = null;
    if (event != null) {
      this.defaultValue = this.feeConcessionCharges.find(x => x.loanChargeFeeId == event).defaultValue;
      this.feeConcessionForm.get("defaultValue").setValue(this.defaultValue);
    } else {
      this.defaultValue = null;
    }
  }
  hasDocumentChanged(event) {
    if (event) {
      this.hasDocument = true;
    } else {
      this.hasDocument = false;
    }
  }
  // file upload
  uploadFileTitle: string = null;
  files: FileList;
  file: File;

  @ViewChild('fileInput', {static: false}) fileInput: any;
  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
    this.uploadFileTitle = this.file.name;
  }
  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }
  uploadFile(concessionId) {
    if (this.file != undefined || this.uploadFileTitle != null) {
      let body = {
        loanApplicationNumber: concessionId,
        loanReferenceNumber: this.loanApplicationDetailId,
        documentTitle: this.uploadFileTitle,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalFileNumber: 'n/a',
        physicalLocation: 'n/a',
        documentTypeId: 1, // TODO: redundant with fileExtension known
      }

      this.loadingService.show();
      this.camService.uploadFile(this.file, body).then((val: any) => {
        this.uploadFileTitle = null;
        this.fileInput.nativeElement.value = "";
        this.showSuccess('success', 'Uploaded Successfully...');
        this.loadingService.hide();
      }, (error) => {
        this.loadingService.hide(1000);
        this.showSuccess('error', 'Upload not Successful...');
      });
    }
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
  DownloadDocument(doc: any) {
    if (doc != null) {
      this.binaryFile = doc.fileData;
      let documentName = doc.documentTitle;
      let myDocExtention = doc.fileExtension;
      var byteString = atob(this.binaryFile);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);
      if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
        try {
            var file = new File([bb], documentName , { type: 'image/jpg' });
            saveAs(file);
        } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
            window.navigator.msSaveBlob(saveFileAsBlob, documentName );
        }
    }

    if (myDocExtention == 'png' || myDocExtention == 'png') {
      try {
          var file = new File([bb], documentName , { type: 'image/png' });
          saveAs(file);
      } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName );
      }
  }
  if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
      try {
          var file = new File([bb], documentName , { type: 'application/pdf' });
          saveAs(file);
      } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName );
      }
  }
  if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
      try {
          var file = new File([bb], documentName , { type: 'application/vnd.ms-excel' });
          saveAs(file);
      } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName);
      }
  }
  if (myDocExtention == 'doc' || myDocExtention == 'docx') {

      try {
          var file = new File([bb], documentName , { type: 'application/msword' });
          saveAs(file);
      } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
          window.navigator.msSaveBlob(saveFileAsBlob, documentName );
      }
  }
    }
  }
  showSuccess(type, message) {
    this.msgs = [];
    this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
  }
  backToSearch() {
    this.display = true;
    this.displayLoanSearchResults = false;
    this.displayLoanFeeConcession = false;
  }
}
