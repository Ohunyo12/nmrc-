import { Component, OnInit } from '@angular/core';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subject, Subscription } from 'rxjs';
import { LoanOperationService } from 'app/credit/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig, ConvertString, ApprovalStatus } from 'app/shared/constant/app.constant';
import { CollateralService } from 'app/setup/services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-recovery-commission',
  templateUrl: './recovery-commission.component.html'
})
export class RecoveryCommissionComponent implements OnInit {

  conditions: any[] = [];
  selectedId: number = null;
  isSubsequent: boolean = false;
  displayConsultantForm: boolean = false;
  displayCollateralModal: boolean = false;
  displayapprovalRecoveryReportingModal: boolean = false;
  displayApprovalModal: boolean = false;
  displayReceiptModal: boolean = false;
  accreditedConsultants: any[] = [];
  agent: any;
  accreditedConsultantId: number = 0;
  agentSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  auditTypeId: any;
  searchTerm$ = new Subject<any>();
  schemeSelection: any[] = [];
  schemeSelectionAssignment: any[] = [];
  loanSelection: any;
  loanOperationApprovalData: any[] = [];
  recoveredCommissionData: any[] = [];
  commissionListData: any[] = [];
  proposedCollateral: any[] = [];
  label: any;
  activeTabindex: number = 0;
  files: FileList;
  loanSelectedData: any;
  file: File;
  documentUploadForm: FormGroup;
  recoveryCommissionBatchForm: FormGroup;
  fileDocument: any;
  binaryFile: string;
  selectedDocument: any;
  displayDocument: boolean = false;
  myPdfFile: any;
  collateralDisplay: boolean = false;
  consultants: any[] = [];
  uploadedDocumentData: any[] = [];
  commissionApprovalData: any[] = [];
  loanSelectionDataStatus: any;
  loanRecoveryReportApprovalId: any;
  loanRecoveryCommissionApprovalId: any;
  operationId: any;
  loanRecoveryCommissionApprovalData: any[] = [];
  private subscriptions = new Subscription();

    trail: any[] = [];
    trail23: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private loanOperationService: LoanOperationService,
    private collateralService: CollateralService
  ) {
    // this.camService.agentSearchObservable(this.searchTerm$)
    //   .subscribe(results => {
    //     this.searchResults = results.result;

    //   });
  }

  ngOnInit() {
    this.getBulkRecoveryCommissionAwaitingApproval();
    this.getAllPaymentRecoveredCommissionByAgent();
    this.clearControls();
    this.BulkRecoveryCommissionApplicationList();
  }


  getAllLoansRecoveryCommissionByReference(reference) {
    this.loanOperationService.getAllLoansRecoveryCommissionByReference(reference).subscribe((response: any) => {
      this.loanRecoveryCommissionApprovalData = response.result;
    });
  }

  getBulkRecoveryCommissionAwaitingApproval() {
    this.loadingService.show();
    this.loanOperationService.getBulkRecoveryCommissionAwaitingApprovalList().subscribe((response: any) => {
    this.commissionApprovalData = response.result;
    this.loadingService.hide();
  });
  }


  BulkRecoveryCommissionApplicationList() {
    this.loadingService.show();
    this.loanOperationService.BulkRecoveryCommissionApplicationList().subscribe((response: any) => {
    this.commissionListData = response.result;
    this.loadingService.hide();
  });
  }

  goForApproval(row, evt) {
    evt.preventDefault();
    this.loanSelection = {};
    this.loanSelection = row;
    this.getAllLoanRecoveryReportingDocuments(this.loanSelection.referenceId)
    this.computeValues();
    this.displayapprovalRecoveryReportingModal = true;
  }

  getAccreditedConsultants() {
    this.camService.getAccreditedStateConsultants().subscribe((response: any) => {
      this.accreditedConsultants = response.result;
    });
  }

  getAllLoanRecoveryReportingDocuments(referenceId) {
    this.loadingService.show();
    this.loanOperationService.getAllLoanRecoveryReportingDocuments(referenceId).subscribe((response: any) => {
      this.uploadedDocumentData = response.result;
      
      this.loadingService.hide();
    });
  }

  getAllPaymentRecoveredCommissionByAgent() {
    this.loadingService.show();
    this.loanOperationService.getAllPaymentRecoveredCommissionByAgent().subscribe((response: any) => {
      this.recoveredCommissionData = response.result;
      this.loadingService.hide();
    });
  }

  onTabChange(e) {
    this.activeTabindex = e.index;
    if (e.index == 1) { }
    //if (e.index == 2) { this.dynamicsSeen = true; }
  }


  saveDocumentUpload(form, overwrite = false) {
     
    let body = {
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        fileSize: this.file.size,
        description: form.value.description,
        fileSizeUnit: 'kilobyte',

        operationId: this.loanSelection.operationId,
        targetId: this.loanSelection.loanRecoveryCommissionApprovalId,
        referenceId: this.loanSelection.referenceId,
        overwrite: overwrite
    };

    this.loadingService.show();
    //if (this.selectedId === null) {
        this.camService.uploadRecoveryReportingDocument(this.file, body).then((response: any) => {
            this.loadingService.hide();
            if (response.result == 3) {
                this.confirmOverwrite();
            } else {
                if (response.success == true){
                  this.documentUploadForm.reset();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getAllLoanRecoveryReportingDocuments(this.loanSelection.referenceId)
                } 
                else{this.finishBad(response.message);} 
            }
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    //} 
}

  assignMultipleLoansForCommission() {
    this.loadingService.show(); 
    this.camService.assignMultipleLoansForCommission(this.schemeSelectionAssignment).subscribe((response: any) => {
        if (response.success === true) {
            this.getAllPaymentRecoveredCommissionByAgent();
            this.BulkRecoveryCommissionApplicationList();
            this.schemeSelectionAssignment.length = 0;
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            this.loadingService.hide(1000);
        } else {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

        }
    }, (err) => {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
}

submitForApproval() {
  this.loadingService.show(); 
  this.camService.assignMultipleLoansToAgentInitiateApproval(this.schemeSelectionAssignment).subscribe((response: any) => {
      if (response.success === true) {
        this.getAllPaymentRecoveredCommissionByAgent();
        this.schemeSelectionAssignment.length = 0;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          this.loadingService.hide(1000);
      } else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

      }
  }, (err) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
  });
}

getApplicationStatus(submitted, approvalStatus) {
  if (submitted == true) {
      if (approvalStatus == ApprovalStatus.PROCESSING)
          return '<span class="label label-info">PROCESSING</span>';
      if (approvalStatus == ApprovalStatus.PENDING)
          return '<span class="label label-info">PROCESSING</span>';
      if (approvalStatus == ApprovalStatus.AUTHORISED)
          return '<span class="label label-info">AUTHORISED</span>';
      if (approvalStatus == ApprovalStatus.REFERRED)
          return '<span class="label label-info">REFERRED BACK</span>';
      if (approvalStatus == ApprovalStatus.APPROVED)
          return '<span class="label label-success">APPROVED</span>';
      if (approvalStatus == ApprovalStatus.DISAPPROVED)
          return '<span class="label label-danger">DISAPPROVED</span>';
  }
  return '<span class="label label-warning">NEW APPLICATION</span>';
}

  show: boolean = false; message: any; title: any; cssClass: any; // message box

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

  clearInput() {
    this.agent = "";
    this.accreditedConsultantId = 0;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  displayReceipt(): void {
    this.displayapprovalRecoveryReportingModal = false;
    this.loanSelection = {};
  }

  clearControls(): void { 
    this.recoveryCommissionBatchForm = this.fb.group({
      commissionRate: ['', Validators.required],
      modeOfCollection: ['', Validators.required],
      collectionDate: ['', Validators.required],
      comment: ['', Validators.required],
      recoveredAmount: ['', Validators.required],
      whtRate: ['', Validators.required],
      commissionAmount: ['', Validators.required],
      whtAmount: ['', Validators.required],
      commissionAmountLessWht: ['', Validators.required]
    });

    this.documentUploadForm = this.fb.group({
      fileData: ['', Validators.required],
      description: ['', Validators.required]
    });
  }


  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  pickSearchedData(item) {
    this.agentSearched = this.searchResults.filter(x => x.accreditedConsultantId == item.accreditedConsultantId);
    this.agent = this.agentSearched[0].firmName;
    this.accreditedConsultantId = this.agentSearched[0].accreditedConsultantId;
    this.getAllPaymentRecoveredCommissionByAgent();
    this.displaySearchModal = false;
  }

  
  viewLoanDetails(row, evt) {
    evt.preventDefault();
    this.loanSelectionDataStatus = {};
    this.loanSelectionDataStatus = row;
    let dataObj = this.loanSelectionDataStatus;
    this.loanRecoveryCommissionApprovalId = this.loanSelectionDataStatus.loanRecoveryCommissionApprovalId;
    this.operationId = this.loanSelectionDataStatus.operationId;
    this.getAllLoansRecoveryCommissionByReference(this.loanSelectionDataStatus.referenceId);
    this.getAllLoanRecoveryReportingDocuments(this.loanSelectionDataStatus.referenceId);
    this.getTrail();
    this.displayApprovalModal = true;
  }

 
  getTrail() {
    this.loadingService.show();
    this.subscriptions.add(
            this.camService.getTrailLms(this.loanSelectionDataStatus.loanRecoveryCommissionApprovalId, this.loanSelectionDataStatus.operationId).subscribe((response: any) => {
            this.trail23 = response.result;
            this.trailCount = this.trail23.length;
            this.trailRecent = response.result[0];
            this.referBackTrail23();
            response.result.forEach((trail23) => {
                if (this.trailLevels.find(x => x.requestStaffId === trail23.requestStaffId) === undefined) {
                    this.trailLevels.push(trail23);
                }
            });
  
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
  }
  
  referBackTrail23(): any {
    this.trail23.forEach(x => {
        if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId
            && t.requestStaffId == x.requestStaffId) == null && x.fromApprovalLevelId != null) {
            this.backtrail.push({
                approvalTrailId: x.approvalTrailId,
                fromApprovalLevelId: x.fromApprovalLevelId,
                fromApprovalLevelName: x.fromApprovalLevelName,
                requestStaffId: x.requestStaffId,
                staffName: x.staffName,
            });
        }
    });
  }

  onSectionChange(id) { 
    if(id == "Collateral"){
       this.collateralDisplay = true;
    }else{
      this.collateralDisplay = false;
    }
}

  getProposedCollateral(loanApplicationId, currencyId): void {
    this.loadingService.show();
    this.collateralService.getProposedCustomerCollateral(loanApplicationId, currencyId).subscribe((response: any) => {
      this.proposedCollateral = response.result;
      this.loadingService.hide();
    });
  }

  receipt(row): void {
    this.getProposedCollateral(row.creditAppraisalLoanApplicationId, row.currencyId);
    let totalRecoveryAmount =  +ConvertString.TO_NUMBER(row.totalAmountRecovery);
    //this.liquidationForm.controls["totalRecoveryAmount"].setValue(totalRecoveryAmount);
    this.displayReceiptModal = true;
  }

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
      __this.saveRecoveryCommissionForm(true);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  saveRecoveryCommissionForm(form, overwrite = false) {
    let body = {
      referenceId: this.loanSelection.referenceId,
      operationId: this.loanSelection.operationId,
      agentAccountNumber: this.loanSelection.agentAccountNumber,
      dateOfEngagement: this.loanSelection.dateOfEngagement,
      collectionDate: form.value.collectionDate,
      modeOfCollection: form.value.modeOfCollection,
      commissionRate: form.value.commissionRate,
      comment: form.value.comment,

      commissionAmountLessWht: form.value.commissionAmountLessWht,
      whtAmount: form.value.whtAmount,
      commissionAmount: form.value.commissionAmount,
      whtRate: form.value.whtRate,
      recoveredAmount: form.value.recoveredAmount,

    };

    this.loadingService.show();
    if (this.selectedId === null) {
      this.camService.assignMultipleLoansRecoveryCommissionApproval(body).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.result == 3) {
          this.confirmOverwrite();
        } else {
          if (response.success == true) {
            this.recoveryCommissionBatchForm.reset();
            this.getBulkRecoveryCommissionAwaitingApproval();
            this. BulkRecoveryCommissionApplicationList();
            this.getAllPaymentRecoveredCommissionByAgent();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            this.displayReceipt();
            this.clearControls();
          }
          else this.finishBad(response.message);
        }
      }, (err: any) => {
        this.loadingService.hide();
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.camService.UpdateLiquidationForm(body, this.selectedId).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.success == true) {
          this.recoveryCommissionBatchForm.reset();
          this. BulkRecoveryCommissionApplicationList();
          this.getAllPaymentRecoveredCommissionByAgent();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          this.displayReceipt();
          this.clearControls();
        }
        else this.finishBad(response.message);
      }, (err: any) => {
        this.loadingService.hide();
        this.finishBad(JSON.stringify(err));
      });
    }
  }


  deleteDocumentUpload(row) {
    const __this = this;
    swal({
        title: 'File DELETE operation!',
        text: 'Are you sure you want to DELETE the file '+ row.fileName +'?',
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
        __this.camService.deleteRecoveryDocument(row.loanRecoveryReportingDocumentId).subscribe((response: any) => {
            __this.getAllLoanRecoveryReportingDocuments(row.referenceId);
            __this.loadingService.hide();
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
            __this.loadingService.hide();
        });
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
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


computeValues(){
  this.recoveryCommissionBatchForm.controls['recoveredAmount'].setValue(this.loanSelection.amountRecovered);
  this.recoveryCommissionBatchForm.controls['commissionRate'].setValue(this.loanSelection.commissionRate);

  const recoveredAmount = this.recoveryCommissionBatchForm.get("recoveredAmount").value;
  const amoutRecovered: number = ConvertString.TO_NUMBER(recoveredAmount);

  const commissionRate = this.recoveryCommissionBatchForm.get("commissionRate").value;
  const commRate: number = ConvertString.TO_NUMBER(commissionRate);

  const commisionAmount = amoutRecovered * (commRate/100);
  this.recoveryCommissionBatchForm.controls['commissionAmount'].setValue(commisionAmount);
  }

  computeWHT(){

    const whtValue = this.recoveryCommissionBatchForm.get("whtRate").value;
    const whtVal: number = ConvertString.TO_NUMBER(whtValue);
  
    const commissionAmount = this.recoveryCommissionBatchForm.get("commissionAmount").value;
    const commAmount: number = ConvertString.TO_NUMBER(commissionAmount);
  
    const whtAmount = commAmount * (whtVal/100);
    this.recoveryCommissionBatchForm.controls['whtAmount'].setValue(whtAmount);

    const commissionAmountLessWHT = commissionAmount - whtAmount;
    this.recoveryCommissionBatchForm.controls['commissionAmountLessWht'].setValue(commissionAmountLessWHT);
    }


}