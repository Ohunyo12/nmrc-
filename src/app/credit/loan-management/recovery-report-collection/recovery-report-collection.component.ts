import { Component, OnInit } from '@angular/core';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subject } from 'rxjs';
import { LoanOperationService } from 'app/credit/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig, ConvertString } from 'app/shared/constant/app.constant';
import { CollateralService } from 'app/setup/services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-recovery-report-collection',
  templateUrl: './recovery-report-collection.component.html'
})
export class RecoveryReportCollectionComponent implements OnInit {

  schemeSelection: any;
  loanOperationApprovalData: any[] = [];
  displayReportForm: boolean = false;
  recoveryReportForm: FormGroup;
  documentUploadForm: FormGroup;
  retailReportForm: FormGroup;
  selectedId: number = null;
  recoveryReportData: any[] = [];
  commissionSelection: any;
  files: FileList;
  file: File;
  fileDocument: any;
  binaryFile: string;
  selectedDocument: any;
  currentDate: Date;
  displayDocument: boolean = false;
  myPdfFile: any;
  uploadedDocumentData: any[] = [];
  recoveryAgents: any[] = [];



  source: string = "RETAIL";
  show: boolean = false; message: any; title: any; cssClass: any; // message box
  searchStartDate: string;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private loanOperationService: LoanOperationService,
    private collateralService: CollateralService
  ) {
    
  }

  ngOnInit() {
    this.retailReportForm = this.fb.group({
      startDate: ['', Validators.required],
    });
    this.clearControls()
    this.currentDate = new Date();
    //this.getAllLoansOperationRecoveryAnalysisByAgent();;
    //this.getAllRecoveryReportCollectionByAgents();
  }


  clearControls(): void {
    this.recoveryReportForm = this.fb.group({
      collectionDate: ['', Validators.required],
      modeOfCollection: ['', Validators.required],
      totalRecoveryAmount: ['', Validators.required],
      totalAmountRecovered:['',Validators.required],
      amountRecovered: ['', Validators.required],
      totalAmountLeft: ['', Validators.required],
      comment: ['', Validators.required],
    });

    this.documentUploadForm = this.fb.group({
      fileData: ['', Validators.required],
      description: ['', Validators.required]
    });


  }

  computeDifference(){
    const amount = this.recoveryReportForm.get("amountRecovered").value;
    const amoutRecovered: number = ConvertString.TO_NUMBER(amount);

    const totalRec = this.recoveryReportForm.get("totalRecoveryAmount").value;
    const totalRecov: number = ConvertString.TO_NUMBER(totalRec);

    const totalAmountRec = this.recoveryReportForm.get("totalAmountRecovered").value;
    const totAmntRecov: number=ConvertString.TO_NUMBER(totalAmountRec);

    let recoveryBalance = totalRecov - totAmntRecov;


    if(amoutRecovered > totalRecov){
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Recovered Amount can not be greater than the total amount due', 'error');
      this.recoveryReportForm.controls['amountRecovered'].setValue("");
      return;
    }

    if(amoutRecovered > recoveryBalance){
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Recovered Amount can not be greater than the balance to be recovered', 'error');
      this.recoveryReportForm.controls['amountRecovered'].setValue("");
      return;
    }

  }

  submitForm(form) {
    var start = new Date(form.value.startDate);
    start.setDate(start.getDate() + 1);
    let startDate = JSON.stringify(start);
    startDate = startDate.slice(1, 11);
  
    this.loadingService.show();
  
    // Call the first function
    this.loanOperationService.getAllLoansForRecoveryAnalysisByAgent(this.source, startDate).subscribe((response: any) => {
      this.loanOperationApprovalData = response.result;
      this.searchStartDate = startDate;
  
      // Call the second function
      this.loanOperationService.getAllMonthlyRecoveryReportCollectionByAgents(startDate).subscribe((response: any) => {
        this.recoveryReportData = response.result;
        this.loadingService.hide();
      });
    });

  }

  callResult(){
    this.loadingService.show();
    this.loanOperationService.getAllLoansForRecoveryAnalysisByAgent(this.source, this.searchStartDate).subscribe((response: any) => {
      this.loanOperationApprovalData = response.result;
      
  
      // Call the second function
      this.loanOperationService.getAllMonthlyRecoveryReportCollectionByAgents(this.searchStartDate).subscribe((response: any) => {
        this.recoveryReportData = response.result;
        this.loadingService.hide();
      });
    });
  }
  

  captureReport(row){
    this.schemeSelection = row;
    
    const capturedReport = this.recoveryReportData;
    let totalAmountRecovered = 0;
    
    for (let i = 0; i < capturedReport.length; i++) {
      if (capturedReport[i].applicationReferenceNumber === this.schemeSelection.applicationReferenceNumber) {
        if (capturedReport[i].hasOwnProperty('amountRecovered')) {
          totalAmountRecovered += capturedReport[i].amountRecovered;
        }
      }
    }  

    this.recoveryReportForm.controls['totalRecoveryAmount'].setValue(this.schemeSelection.totalUnsettledAmount);
    this.recoveryReportForm.controls['totalAmountRecovered'].setValue(totalAmountRecovered);     

    let totalAmtLeft = (this.schemeSelection.totalAmountRecovery - totalAmountRecovered).toFixed(2);
    this.recoveryReportForm.controls['totalAmountLeft'].setValue(totalAmtLeft);
    this.displayReportForm =true;
  }

  
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood() {
    this.loadingService.hide();
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  hideMessage(event) {
    this.show = false;
  }


  //=================================================================================================

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  confirmOverwrite(): void {
    const __this = this;
    swal({
      title: 'File already exist!',
      text: 'Are you sure you want to OVERWRITE it?',
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
      __this.saveRecoveryReportForm(true);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  saveDocumentUpload(form, overwrite = false) {
     
    let body = {
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        fileSize: this.file.size,
        description: form.value.description,
        fileSizeUnit: 'kilobyte',

        operationId: this.schemeSelection.operationId,
        targetId: this.schemeSelection.loanRecoveryCommissionApprovalId,
        referenceId: this.schemeSelection.referenceId,
        overwrite: overwrite
    };

    this.loadingService.show();
        this.camService.uploadRecoveryReportingDocument(this.file, body).then((response: any) => {
            this.loadingService.hide();
            if (response.result == 3) {
                this.confirmOverwrite();
            } else {
                if (response.success == true){
                  this.documentUploadForm.reset();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getAllLoanRecoveryReportingDocuments(this.schemeSelection.referenceId)
                } 
                else{this.finishBad(response.message);} 
            }
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    }


    saveRecoveryReportForm(form, overwrite = false) {
      let body = {
        referenceId: this.schemeSelection.referenceId,
        operationId: this.schemeSelection.operationId,
        agentAccountNumber: this.schemeSelection.agentAccountNumber,
        dateOfEngagement: this.schemeSelection.dateOfEngagement,
        collectionDate: form.value.collectionDate,
        modeOfCollection: form.value.modeOfCollection,
        comment: form.value.comment,
        totalAmountRecovery: form.value.totalRecoveryAmount,
        amountRecovered: form.value.amountRecovered,
        accreditedConsultant: this.schemeSelection.accreditedConsultantId,
        loanAssignId: this.schemeSelection.loanAssignId,
        loanReferenceNumber: this.schemeSelection.loanReferenceNumber,
        productId: this.schemeSelection.productId,
        productClassId: this.schemeSelection.productClassId,

      };
  
      this.loadingService.show();
        this.camService.loanRecoveryReportCollection(body).subscribe((response: any) => {
          this.loadingService.hide();
            if (response.success == true) {
              this.recoveryReportForm.reset();
              this.displayReportForm = false;
              //this.getAllLoansOperationRecoveryAnalysisByAgent();
              //this.getAllRecoveryReportCollectionByAgents(form);
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
              this.callResult();
            }
            else {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');  
          }          
        }, (err: any) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }

    getAllLoanRecoveryReportingDocuments(referenceId) {
      this.loadingService.show();
      this.loanOperationService.getAllLoanRecoveryReportingDocuments(referenceId).subscribe((response: any) => {
        this.uploadedDocumentData = response.result;
        
        this.loadingService.hide();
      });
    }

    downloadDocument(row, view = false) {
      this.fileDocument = null;
      this.loadingService.show();
      this.camService.downloadRecoveryReportDocument(row.loanRecoveryReportingDocumentId).subscribe((response: any) => {
        this.fileDocument = response.result;
  
        if (this.fileDocument != null) {
          this.loadingService.hide();
          const downloadedFileName = this.fileDocument.fileName;
          this.binaryFile = this.fileDocument.fileData;
          this.selectedDocument = this.fileDocument.fileName;
  
          if (view) {
            this.displayDocument = true;
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

}

