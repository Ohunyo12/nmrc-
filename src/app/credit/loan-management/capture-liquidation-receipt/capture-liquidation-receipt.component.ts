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
  selector: 'app-capture-liquidation-receipt',
  templateUrl: './capture-liquidation-receipt.component.html'
})
export class CaptureLiquidationReceiptComponent implements OnInit {

  conditions: any[] = [];
  selectedId: number = null;
  isSubsequent: boolean = false;
  displayConsultantForm: boolean = false;
  displayCollateralModal: boolean = false;
  displayReceiptModal: boolean = false;
  displayReassignmentForm: boolean = false;
  newConsultantName: any;
  expCompletionDate: any;
  currentConsultant: any;
  newConsultant: any;

  accreditedConsultants: any[] = [];
  agent: any;
  accreditedConsultantId: number = 0;
  agentSearched: any;
  displaySearchModal: boolean;
  searchResults: any;
  auditTypeId: any;
  searchTerm$ = new Subject<any>();
  schemeSelection: any;
  recoveredLoansSelection: any;
  loanOperationApprovalData: any[] = [];
  lonLiquidationRecoveryData: any[] = [];
  proposedCollateral: any[] = [];
  
  activeTabindex: number = 0;
  files: FileList;
  file: File;
  liquidationForm: FormGroup;
  fileDocument: any;
  binaryFile: string;
  selectedDocument: any;
  displayDocument: boolean = false;
  myPdfFile: any;
  collateralDisplay: boolean = false;
  source: string = "REMEDIAL";
  label: string = "Re-Assign To Agent"

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private loanOperationService: LoanOperationService,
    private collateralService: CollateralService
  ) {
    this.camService.agentSearchObservable(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;

      });
  }

  ngOnInit() {
    this.getAllLoansOperationRecoveryAnalysisByAgent();
    this.getAllLoansRecoveredByAgents();
    this.clearControls();
  }


  consultants: any[] = [];

  getAccreditedConsultants() {
    this.camService.getAccreditedStateConsultants().subscribe((response: any) => {
      this.accreditedConsultants = response.result;
    });
  }


  pickSearchedData(item) {
    this.agentSearched = this.searchResults.filter(x => x.accreditedConsultantId == item.accreditedConsultantId);
    this.newConsultantName = this.agentSearched[0].firmName;
    this.newConsultant = this.agentSearched[0].accreditedConsultantId;
    this.label = "Re-Assign To "+this.newConsultantName;
    this.displaySearchModal = false;
  }

  
  getAllLoansOperationRecoveryAnalysisByAgent() {
    this.loadingService.show();
    this.loanOperationService.getAllLoansOperationRecoveryAnalysisByAgent(this.source).subscribe((response: any) => {
      this.loanOperationApprovalData = response.result;
      this.loadingService.hide();
    });
  }

  getAllLoansRecoveredByAgents() {
    this.loanOperationService.getAllLoansRecoveredByAgents().subscribe((response: any) => {
      this.lonLiquidationRecoveryData = response.result;
    });
  }

  onTabChange(e) {
    this.activeTabindex = e.index;
    if (e.index == 1) { }
    //if (e.index == 2) { this.dynamicsSeen = true; }
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
    this.proposedCollateral = null;
    this.displayReceiptModal = false;
    this.collateralDisplay = false;
    this.schemeSelection = {};
  }

  clearControls(): void {
    this.liquidationForm = this.fb.group({
      fileData: [''],
      receiptDate: ['', Validators.required],
      totalRecoveryAmount: ['', Validators.required],
      recoveredAmount: ['', Validators.required],
      collateralCode: [''],
      collectionMode: ['', Validators.required],
      percentageCommission: ['', Validators.required],
    });
  }


  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  // pickSearchedData(item) {
  //   this.agentSearched = this.searchResults.filter(x => x.accreditedConsultantId == item.accreditedConsultantId);
  //   this.agent = this.agentSearched[0].firmName;
  //   this.accreditedConsultantId = this.agentSearched[0].accreditedConsultantId;
  //   this.getAllLoansOperationRecoveryAnalysisByAgent();
  //   this.getAllLoansRecoveredByAgents();
  //   this.displaySearchModal = false;
  // }


  viewLoanDetails(row): void {
    this.recoveredLoansSelection = row;
    this.getProposedCollateral(row.loanApplicationId, row.currencyId);
    this.displayCollateralModal = true;
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
    this.liquidationForm.controls["totalRecoveryAmount"].setValue(totalRecoveryAmount);
    this.schemeSelection = row;
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
      __this.saveLiquidationForm(true);
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  saveLiquidationForm(form, overwrite = false) {
    if(this.file != undefined){
    let body = {
      fileName: this.file.name,
      fileExtension: this.fileExtention(this.file.name),
      fileSize: this.file.size,
      fileSizeUnit: 'kilobyte',
      overwrite: overwrite,
      loanId: this.schemeSelection.loanId,
      applicationReferenceNumber: this.schemeSelection.applicationReferenceNumber,
      customerId: this.schemeSelection.customerId,
      accreditedConsultant: this.schemeSelection.accreditedConsultantId,
      receiptDate: form.value.receiptDate,
      totalRecoveryAmount: form.value.totalRecoveryAmount,
      recoveredAmount: form.value.recoveredAmount,
      collateralCode: form.value.collateralCode,
      collectionMode: form.value.collectionMode,
      loanAssignId: this.schemeSelection.loanAssignId,
      percentageCommission: form.value.percentageCommission,
      loanReference: this.schemeSelection.loanReferenceNumber,
    };

    this.loadingService.show();
    if (this.selectedId === null) {
      this.camService.saveLiquidationForm(this.file, body).then((response: any) => {
        this.loadingService.hide();
        if (response.result == 3) {
          this.confirmOverwrite();
        } else {
          if (response.success == true) {
            this.liquidationForm.reset();
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            this.getAllLoansOperationRecoveryAnalysisByAgent();
            this.getAllLoansRecoveredByAgents();
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
          this.liquidationForm.reset();
          this.getAllLoansOperationRecoveryAnalysisByAgent();
          this.getAllLoansRecoveredByAgents();
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
  }else{
    let body2 = {
      overwrite: overwrite,
      loanId: this.schemeSelection.loanId,
      applicationReferenceNumber: this.schemeSelection.applicationReferenceNumber,
      customerId: this.schemeSelection.customerId,
      accreditedConsultant: this.schemeSelection.accreditedConsultantId,
      receiptDate: form.value.receiptDate,
      totalRecoveryAmount: form.value.totalRecoveryAmount,
      recoveredAmount: form.value.recoveredAmount,
      collateralCode: form.value.collateralCode,
      collectionMode: form.value.collectionMode,
      loanAssignId: this.schemeSelection.loanAssignId,
      percentageCommission: form.value.percentageCommission,
      loanReference: this.schemeSelection.loanReferenceNumber,
    };

    this.loadingService.show();
    if (this.selectedId === null) {
      this.camService.saveLiquidationFormWithoutFile(body2).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.result == 3) {
          this.confirmOverwrite();
        } else {
          if (response.success == true) {
            this.liquidationForm.reset();
            this.getAllLoansOperationRecoveryAnalysisByAgent();
            this.getAllLoansRecoveredByAgents();
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
      this.camService.UpdateLiquidationForm(body2, this.selectedId).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.success == true) {
          this.liquidationForm.reset();
          this.getAllLoansOperationRecoveryAnalysisByAgent();
          this.getAllLoansRecoveredByAgents();
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
  }

  downloadDocument(row, view = false) {
    this.fileDocument = null;
    this.loadingService.show();
    this.camService.downloadLiquidationRecoveryReceipt(row.collateralLiquidationRecoveryId).subscribe((response: any) => {
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


  validateAmount(){
    const amount = this.liquidationForm.get("recoveredAmount").value;
    const amoutRecovered: number = ConvertString.TO_NUMBER(amount);

    const totalRecoveryAmount = this.liquidationForm.get("totalRecoveryAmount").value;
    const totalRecov: number = ConvertString.TO_NUMBER(totalRecoveryAmount);

    if(amoutRecovered > totalRecov){
      const __this = this;
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Recovered Amount can not be greater than the Total Outstanding Balance', 'error');
      __this.liquidationForm.controls['recoveredAmount'].setValue("");
      return;
    }
  }


  saveRecoveryReassignmentForm() {
    // var event = new Date(this.expCompletionDate);
    // let date = JSON.stringify(event);
    // date = date.slice(1, 11);

    let body = {
      expCompletionDate: this.expCompletionDate,
      loanAssignId: this.schemeSelection.loanAssignId,
      accreditedConsultant: this.newConsultant,
      source: this.source,
  };

    this.loadingService.show(); 
    this.camService.saveRecoveryReassignmentForm(body).subscribe((response: any) => {
        if (response.success === true) {
          this.loadingService.hide(1000);
            this.getAllLoansOperationRecoveryAnalysisByAgent();
            this.schemeSelection.length = 0;
            this.displayReassignmentForm = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            
        } else {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

        }
    }, (err) => {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
}

reassign(row){
  this.schemeSelection = row;
  this.currentConsultant =  this.schemeSelection.accreditedConsultantCompany;
  this.displayReassignmentForm = true;
}

}