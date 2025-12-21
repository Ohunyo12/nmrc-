import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { saveAs } from 'file-saver';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChecklistService } from '../../../setup/services/checklist.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import swal from 'sweetalert2';
import { Message } from 'primeng/components/common/api';
@Component({
selector: 'app-condition-checklist',
templateUrl: './condition-checklist.component.html',
})
export class ConditionChecklistComponent implements OnInit {
today = new Date();
// loanApplicationId: any;
ChecklistDefinitionList: any[] = [];
ChecklistDetailsList: any[] = [];
camApprovedLoans: any[] = [];

displayDrawdownDeferralMemo: boolean = false;

displayChecklistEntry: boolean = false;
msgs: Message[] = [];
displayCheckList: boolean = false;
checklistDeferred: boolean = false;
checklistModel: any[] = [];
checklistStatusData: any[];
checklistStatusResponse: any[];
checkedChecklistItem: any[];
displayUpload: boolean = false;
@Input('isAvailmentChecklist') isAvailmentChecklist: boolean = false;
@Input('showOrHideList') showLoanList: boolean = true;
@Input('isLMSChecklist') isLMSChecklist: boolean = false;
@Input('AvailChecklist') AvailChecklist: boolean = false;
@Input() operationId: number = 0;
@Input() customerId: number = 0;
@Input() targetId: number = 0;
@Input() applicationRefNumber: string = '';
@Input() loanApplicationId: number = 0;

@Output() refreshProvidedDocuments = new EventEmitter<boolean>();
@Output() resetofferLetterChecklist = new EventEmitter<boolean>();

checklistHeader: string = 'Loan Application CheckList';
selectedChecklist: any;
displayCheckListDetails: boolean = false;
checkListStatusId: number;
// deferedNumberOfDays: number;
deferedDate: Date;
reason: string;
checklistDeffered: boolean = false;
checklistDefferedOrWaived: boolean = false;
checklistNotProvided: boolean = false;
checklistItem: string;
binaryFile: string;
selectedDocumentName: string;
displayConditionPrecedentValidation: boolean = false;
checklistDetailValidationDocument: any = {};
loanApplicationForm: FormGroup;
showUpload = false;
storedApplicationInfo: any;
loanApplicationReferance: any;
reload: number;
selectedChecklists: any[] = [];
ckEditorContent: any;
loanApplicationDetailId: any;
dateToday = new Date();
@Input() set loanReviewApplicationId(value: number) {
  //console.log("value",value);
  if (value > 0 ) {
    this.viewOfferLetterChecklist(value);
  }
}
constructor(private loanAppService: LoanApplicationService, private fb: FormBuilder,
  private checklistService: ChecklistService, private creditApprServ: CreditAppraisalService, private loadingService: LoadingService, ) { }

ngOnInit() {
  ////console.log("oninit","I'm here");
  this.loadAllChecklistStatus();
  if (this.isLMSChecklist == true) {
    this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
    this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
    } else {
    this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
    this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
    }
  
  if (this.showLoanList)
  this.getApprovedLoanApplicationsDueForAvailment();
}
loadAllChecklistStatus() {
  this.checklistService.getAllChecklistStatus().subscribe((data) => {
  this.checklistStatusData = data.result;
  
  });

}


getApprovedLoanApplicationsDueForAvailment() {
  this.loadingService.show();
  this.creditApprServ.getApplicationsDueForAvailmentChecklist().subscribe((response: any) => {
  this.camApprovedLoans = response.result;
  this.loadingService.hide();
  }, (err) => {
  this.loadingService.hide();
  });
}
viewConditionPrecedence(index, evt) {
  evt.preventDefault();
  this.loanApplicationId = index.loanApplicationId;
  this.loanApplicationDetailId = index.loanApplicationDetailId;

  //this.loadingService.show();
  this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
  this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
  this.displayCheckListDetails = true;
}

viewOfferLetterChecklist(loanApplicationId) { 
  this.loanApplicationId = loanApplicationId;
  ////console.log("this.isLMSChecklist",this.isLMSChecklist);

  if (this.isLMSChecklist == true) {
  this.checklistHeader = 'LMS Offer Letter Checklist';
  this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
  this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
  } else {
  this.checklistHeader = 'Deferals/Waivers';
  this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
  this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);

  }
  this.displayCheckListDetails = this.isAvailmentChecklist == true ? false : true;
  //this.displayConditionPrecedentValidation = true ;//this.isAvailmentChecklist;
  // this.loadingService.hide(1000);
}
getConditionPrededenceChecklist(loanApplicationId, isAvailmentChecklist) {
  if(loanApplicationId <= 0){
    return;
  }
  this.ChecklistDefinitionList = [];
  this.loadingService.show();
  this.checklistService.getConditionPrededenceChecklist(loanApplicationId, isAvailmentChecklist).subscribe((response: any) => {
  this.ChecklistDefinitionList = response.result;
  this.loadingService.hide();
  });
}

// savedChecklistDetailsList: any[] = [];
getConditionPrededenceChecklistStatus(loanId, IsAvailment) {
  if(loanId <= 0){
    return;
  }
  this.ChecklistDetailsList = [];
  this.loadingService.show();
  this.checklistService.getConditionPrededenceChecklistStatus(loanId, this.isAvailmentChecklist).subscribe((response: any) => {
    // if(this.ChecklistDetailsList != null && this.ChecklistDetailsList  != undefined && this.ChecklistDetailsList.length > 0) {
      this.ChecklistDetailsList = response.result;
      this.loadingService.hide();
      // this.savedChecklistDetailsList = this.ChecklistDetailsList.filter(x=> x.approvalStatusId == ApprovalStatusEnum.Pending);
      // this.savedChecklistDetailsList.slice;
    // }
  });
}

// getConditionPrededenceChecklistStatus(loanId, IsAvailment) {

  
// 	this.checklistService.getConditionPrededenceChecklistStatus(loanId, this.isAvailmentChecklist).subscribe((response: any) => {
// 	this.ChecklistDetailsList = response.result;
// 	});
// }
getLMSConditionPrededenceChecklist(loanReviewApplicationId) {
  if(loanReviewApplicationId <= 0){
    return;
  }
  this.loadingService.show();
  this.checklistService.getLMSConditionPrededenceChecklist(loanReviewApplicationId).subscribe((response: any) => {
  this.ChecklistDefinitionList = response.result;
  this.loadingService.hide();
  });
}

getLMSConditionPrededenceChecklistStatus(loanReviewApplicationId) {
  if(loanReviewApplicationId <= 0){
    return;
  }
  this.loadingService.show();
  this.checklistService.getLMSConditionPrededenceChecklistStatus(loanReviewApplicationId).subscribe((response: any) => {
  this.ChecklistDetailsList = response.result;
  this.loadingService.hide();
  });
}
onRemoveClicked(index) {
  const row = index;
  this.removeChecklist(row.conditionId, this.isLMSChecklist);
  // this.removeChecklistDocument(row.conditionId, row.loanApplicationId);
}
removeChecklist(conditionId, isLMSChecklist) {
  this.loadingService.show();
  this.checklistService.deleteLoanConditionPrecedenceStatus(conditionId, isLMSChecklist).subscribe((response: any) => {
  this.loadingService.hide();
  if (response.success == true) {
    if (isLMSChecklist == true) {
    this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
    this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
    } else {
    this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
    this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
    }

    this.showSuccess('success', response.message);
  }
  });
}
removeChecklistDocument(conditionId, loanApplicationId) {
  this.checklistService.removeConditionPrecedentDocumentUpload(conditionId, loanApplicationId).subscribe((response: any) => {
  this.showSuccess('success', response.message);
  });
}

onChecklistStatusChanged(status) {

  this.loadAllChecklistStatus
  if (Number(status) == 2) {
  this.checklistNotProvided = true;
  this.checklistDefferedOrWaived = true;
  this.checklistDeffered = false;
  // this.deferedNumberOfDays = null;
  this.deferedDate = null;
  }
  if (Number(status) == 3) {
  this.checklistNotProvided = true;
  this.checklistDefferedOrWaived = false;
  this.checklistDeffered = false;
  // this.deferedNumberOfDays = null;
  this.deferedDate = null;
  }
  if (Number(status) == 4) {
  this.checklistDeffered = true;
  this.checklistDefferedOrWaived = true;
  this.checklistNotProvided = true;
  }
  if (Number(status) == 5) {
  this.checklistNotProvided = true;
  }
  if (Number(status) == 6) {
  this.checklistNotProvided = true;
  }
}
n

uncheckedChecklistItem(i:any, evt) {
  evt.preventDefault();
  this.checkListStatusId = null;
  this.checklistStatusResponse = [];
  this.selectedChecklist = i;
  //this.selectedChecklist = [i];
  this.checklistItem = this.selectedChecklist.condition;
  this.checklistStatusResponse = this.checklistStatusData.filter(x => x.responseTypeId == 1);
  //this.checklistStatusResponse = this.checklistStatusData.filter(x => x.responseTypeId == this.selectedChecklist.responseTypeId);

  this.displayChecklistEntry = true;
  this.checklistDeffered = false;
  this.checklistNotProvided = false;
  this.checklistDefferedOrWaived = false;
}

updateLoanChecklist() {

  if (this.checkListStatusId == 2 || this.checkListStatusId == 4) {
  if (this.reason == null) {
    this.showSuccess('info', `Please provide reason for deferral/waival`);
    return;
  }
  }
  if (this.checkListStatusId == 4) {
  // if (this.deferedNumberOfDays <= 0 ) {
  //   this.showSuccess('info', `Deferred number of days must be greater than zero.`);
  //   return;
  // }
  if (this.deferedDate >= this.dateToday) {
    this.showSuccess('info', `Deferred Date must be later than today`);
  }
  }
  // if (this.uploadFileTitle == null) {
  //   let doc = this.selectedChecklist.itemDescription == null || "" ? '' : this.selectedChecklist.itemDescription;
  //   this.showSuccess('info', `Please Upload document to continue`);
  //   return;
  // }

  let bodyObj = {
  conditionId: this.selectedChecklist.conditionId,
  checkListStatusId: this.checkListStatusId,
  isAvailment: this.isAvailmentChecklist,
  // deferedDays: this.deferedNumberOfDays,
  deferedDate: this.deferedDate,
  isLMSChecklist: this.isLMSChecklist,
  reason: this.reason
  };
  this.selectedChecklists.push(bodyObj);
  ////console.log("submitted", bodyObj);
  this.loadingService.show();
  this.checklistService.UpdateLoanConditionPrecedenceStatus(bodyObj).subscribe((res) => {
    this.loadingService.hide();
    if (res.success == true) {
    // if (this.uploadFileTitle != null) {
    //   this.uploadFile();
    // }
      if (this.checkListStatusId == 3){
        this.refreshProvidedDocuments.emit(true);
      }
      if (this.isLMSChecklist == true) {
        this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
        this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
      } else {
        this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
        this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
      }
      this.loadingService.hide();
      this.showSuccess('success', res.message);
      this.displayChecklistEntry = false
      this.checkListStatusId = null;
      // this.deferedNumberOfDays = null;
      this.deferedDate = null;
      this.reason = null;
    } else {
      this.showSuccess('error', res.message);
    }
  }, (err) => {
  this.showSuccess('error', JSON.stringify(err));
    this.loadingService.hide(1000);
  });
}

submitLoanCheckList(){
  this.loadingService.show();
  this.checklistService.ForwardChecklistForApproval(this.ChecklistDetailsList).subscribe((res)=>{
  if (res.success == true) {
    if (this.isLMSChecklist == true) {
      this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
      this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
      } else {
      this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);
      this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
      }
    this.loadingService.hide();
    this.showSuccess('success', res.message);
  } else {
    this.loadingService.hide();
    this.showSuccess('error', res.message);
  }
  }, (err) => {
    this.loadingService.hide();
  this.showSuccess('error', JSON.stringify(err));
  });
};

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
uploadFile() {
  if (this.file != undefined || this.uploadFileTitle != null) {
  let body = {
    conditionId: this.selectedChecklist.conditionId,
    loanApplicationId: this.selectedChecklist.loanApplicationId,
    fileName: this.file.name,
    fileExtension: this.fileExtention(this.file.name),
    physicalFileNumber: 'n/a',
    physicalLocation: 'n/a',
  };
  ////console.log("upload body", body);
  this.loadingService.show();
  this.checklistService.uploadFile(this.file, body).then((val: any) => {
    this.uploadFileTitle = null;
    this.fileInput.nativeElement.value = "";
    this.showSuccess('success', 'Uploaded Successfully...');
    //swal(`${GlobalConfig.APPLICATION_NAME}`, "Uploaded Successfully...", 'success');
    this.loadingService.hide();
  }, (error) => {
    this.loadingService.hide(1000);
    this.showSuccess('error', 'Upload not Successful...');
    //swal(`${GlobalConfig.APPLICATION_NAME}`, "Upload not Successful...", 'error');
  });
  }
}
showSuccess(type, message) {
  this.msgs = [];
  this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
}

validateConditionPrecedent(index, optionValue) {
  this.loadingService.show();
  const row = index;
  ////console.log('hmmm', row)
  ////console.log('optionValue', optionValue)
  let bodyObj = {
  conditionId: row.conditionId,
  validationStatus: optionValue,
  isLMSChecklist: this.isLMSChecklist
  }
  this.checklistService.validateConditionPrecedent(bodyObj).subscribe((res) => {
  this.loadingService.hide();
  if (res.success === true) {
    if (this.isLMSChecklist == true) {
    this.checklistHeader = 'LMS Offer Letter Checklist';
    this.getLMSConditionPrededenceChecklist(this.loanApplicationId);
    this.getLMSConditionPrededenceChecklistStatus(this.loanApplicationId);
    } else {
    this.checklistHeader = 'Offer Letter Checklist';
    this.getConditionPrededenceChecklist(this.loanApplicationId, this.isAvailmentChecklist);
    this.getConditionPrededenceChecklistStatus(this.loanApplicationId, this.isAvailmentChecklist);    
    }
    this.showSuccess('success', res.message);
  } else {
    this.showSuccess('error', res.message);
  }
  });
}

viewConditionPrecedentChecklistUpload(index) {
  const row = index; // this.form3800BChecklistDetailsList[index];
  this.getConditionPrecedentChecklistUpload(row.conditionId,row.loanApplicationId)
}

getConditionPrecedentChecklistUpload(conditionId,loanApplicationId) {
  this.selectedDocumentName = null;
  this.binaryFile = null;
  this.loadingService.show()
  this.checklistService.getConditionPrecedentChecklistUpload(conditionId,loanApplicationId).subscribe((data) => {
  this.checklistDetailValidationDocument = data.result;
  if (this.checklistDetailValidationDocument != undefined) {
    if (['jpg', 'jpeg', 'png'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
    this.selectedDocumentName = this.checklistDetailValidationDocument.fileName;
    this.binaryFile = this.checklistDetailValidationDocument.fileData;
    this.displayUpload = true;
    }
    if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].indexOf(this.checklistDetailValidationDocument.fileExtension.toLowerCase()) > -1) {
    this.DownloadDocument(this.checklistDetailValidationDocument);
    }
  } else {
    this.showSuccess('info', 'No upload found for this checklist');
  }
  this.loadingService.hide()
  });
}

setShowUpload(event) {
 // console.log(event);
    this.showUpload = true;
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
    var file = new File([bb], documentName + '.jpg', { type: 'image/jpg' });
    saveAs(file);
    } catch (err) {
    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
    window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.jpg');
    }
  }
  if (myDocExtention == 'png' || myDocExtention == 'png') {
    try {
    var file = new File([bb], documentName + '.png', { type: 'image/png' });
    saveAs(file);
    } catch (err) {
    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
    window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.png');
    }
  }
  if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
    try {
    var file = new File([bb], documentName + '.pdf', { type: 'application/pdf' });
    saveAs(file);
    } catch (err) {
    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
    window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.pdf');
    }
  }
  if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
    try {
    var file = new File([bb], documentName + '.xlsx', { type: 'application/vnd.ms-excel' });
    saveAs(file);
    } catch (err) {
    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
    window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.xlsx');
    }
  }
  if (myDocExtention == 'doc' || myDocExtention == 'docx') {

    try {
    var file = new File([bb], documentName + '.doc', { type: 'application/msword' });
    saveAs(file);
    } catch (err) {
    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
    window.navigator.msSaveBlob(saveFileAsBlob, documentName + '.doc');
    }
  }
  }
}


// for deferral memo

contentChange(updates) { 
  this.ckEditorContent = updates; 
}

getDrawdownDeferralMemo() {
   this.checklistService.getDrawdownDeferralMemo(this.operationId, this.targetId).subscribe((response: any) => {
       if (response.result == null) {
         swal(`${GlobalConfig.APPLICATION_NAME}`, "Memo cannot be generated at this point. Load checklist first", 'error');
          return;
       }
       this.ckEditorContent = response.result;
       this.displayDrawdownDeferralMemo=true;
   }, (err) => {
      
   });
}

getDeferralWaiverPdf() {
   this.checklistService.getDeferralWaiverPdf(this.operationId, this.targetId, this.loanApplicationDetailId).subscribe((response: any) => {
       if (response.result == null) return;
       this.ckEditorContent = response.result;
       this.displayDrawdownDeferralMemo=true;
   }, (err) => {
      
  });
}

}
