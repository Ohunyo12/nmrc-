import { Component, OnInit } from '@angular/core';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subject, Subscription } from 'rxjs';
import { LoanOperationService } from 'app/credit/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus, ApprovalGroupRole } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-assign-loan-to-agent',
  templateUrl: './assign-loan-to-agent.component.html'
})

export class AssignLoanToAgentComponent implements OnInit {

  conditions: any[] = [];
  selectedId: number = null;
  isSubsequent: boolean = false;
  displayConsultantForm: boolean = false;
  accreditedConsultants: any[] = [];
  activeTabindex: number = 0;
  agent: any;
  loanSelection: any;
  expCompletionDate: any;
  accreditedConsultantId: number = 0;
  agentSearched: any;
  displaySearchModal: boolean;
  displayApprovalModal: boolean = false;
  isThirdPartyFacility: boolean = false;
  searchResults: any;
  auditTypeId: any;
  searchTerm$ = new Subject<any>();
  schemeSelection: any[] = [];
  loanToAssignData: any[] = [];
  loanRecoveryApplicationStatusData: any[] = [];
  loanRecoveryApprovalData: any[] = [];
  label: any;
  searchQuery: FormGroup;
  loanSelectedData: any;
  lienRemovalId: any;
  lienRemovalOperationId: any;

  forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    testModal: boolean = false;
    private subscriptions = new Subscription();
    trail: any[] = [];
    trail23: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

    // ckeditor
    ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }   

    sectionContent: any;
    sectionDescription: any = '';
    documentationSections: any[] = [];
    applicationListData: any[] = [];
    editMode: boolean = false;
    selectedSectionId: number = null;
    selectedSectionIdIndex: number = null;
    documentSectionForm: FormGroup;
    appendForm: FormGroup;
    displayDocumentation: boolean = false;
    displayapprovalRecoveryModal: boolean = false;
    documentations: any[] = [];
    updateFromEditor: number = 0;
    TEMPLATE_OPERATION_ID: number = 264;
    LMS_TEMPLATE_OPERATION_ID: number = 264;
    documentTemplates: any[] = [];
    displayAppendModal: boolean = false;

    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    reload: number = 0;
    commentLabel: string = 'Recommendation';
    loanApplicationDetail: any;
    customerProposedAmount: number = 0;
    maximumAmount: number = 0;
    loanApplicationTagsForm: FormGroup;
    isRegistrationDoneViaLoanApplication = 1; 
    allRequiredDocumentsAreUploaded = true;
    readonly OPERATION_ID_DOC: number = 6;
    readonly source: string = "REMEDIAL";
  
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private loanOperationService: LoanOperationService
  ) {
      this.camService.agentSearchObservable(this.searchTerm$)
      .subscribe(results => {
        this.searchResults = results.result;

      });
  }

  ngOnInit() {
    this.getAccreditedConsultants();
    this.getAllLoansOperationRecoveryAnalysis();
    this.getBulkRecoveryToAgentAwaitingApproval();
    this.BulkRecoveryToAgentAwaitingApprovalList();
    this.clearControlsa(); 
    
  }

  onTabChange(e) {
    this.activeTabindex = e.index;
    if (e.index == 2) {  }
}


onDocumentSectionChange(sectionId) { 
      this.loadingService.show();
      this.subscriptions.add(
      this.camService.getRecoveryAnalysisDocumentSection(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.accreditedConsultant,this.loanSelectedData.referenceId, sectionId).subscribe((response: any) => {
          if (response.result == null) return;
          this.editMode = response.result.editable;
          this.sectionContent = response.result.templateDocument;
          this.sectionDescription = response.result.description;
          this.selectedSectionId = sectionId;
          this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      }));
}

saveSection(alert=false) {
  this.sectionContent = this.ckeditorChanges; 
  const body = {
      templateDocument: this.sectionContent,
      sectionId: this.selectedSectionId
  };
  this.subscriptions.add(
  this.camService.saveSection(body).subscribe((response: any) => {
      this.ckeditorChanges = null; 
      if (alert == true) { 
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document saved!', 'success');
      }
  }));
}

nextSection(direction) {
  const max = this.documentationSections.length - 1;
  let index = direction == 1 ? this.selectedSectionIdIndex - 1 : this.selectedSectionIdIndex + 1;
  if (index > max) index = 0;
  if (index < 0) index = max;
  const sectionId = this.documentationSections[index].sectionId;
  this.documentSectionForm.controls['sectionId'].setValue(sectionId);
  this.onDocumentSectionChange(sectionId);
}

previewDocumentation(LMS_TEMPLATE_OPERATION_ID, bulkRecoveryApprovalId, referenceId, accreditedConsultant, print=false) {
  this.loadingService.show();
  this.subscriptions.add(
  this.camService.getRecoveryAnalysisDocumentation(LMS_TEMPLATE_OPERATION_ID, bulkRecoveryApprovalId , referenceId, accreditedConsultant).subscribe((response: any) => {
      this.documentations = response.result;
      this.loadingService.hide();
      if (print == false) this.displayDocumentation = true;
  else setTimeout(() => this.print(), 1000);
  }, (err) => {
      this.loadingService.hide(1000);
  }));
}

getDocumentTemplate(showLoadDocumentModal: boolean) {
  this.clearControls();
  this.loadingService.show();
  this.subscriptions.add(
  this.camService.getDocumentTemplates(this.TEMPLATE_OPERATION_ID).subscribe((response: any) => {
      this.documentTemplates = response.result;
      this.displayAppendModal = showLoadDocumentModal;
      this.loadingService.hide();
  }, (err) => {
      this.loadingService.hide(1000);
  }));
}

loadDocumentTemplate(form) {
  const body = {
      templateId: form.value.creditTemplateId,
      operationId: this.TEMPLATE_OPERATION_ID,
      targetId: this.loanSelectedData.bulkRecoveryApprovalId,
      lmsOperationId: this.LMS_TEMPLATE_OPERATION_ID,
      
  }
  this.loadingService.show();
  this.subscriptions.add(
  this.camService.loadDocumentTemplateLms(body).subscribe((response: any) => { // heavy call!
      this.loadingService.hide();
      this.displayAppendModal = false;
      this.getDocumentationSections(false);
  }, (err) => {
      this.loadingService.hide(1000);
  }));
}

getDocumentationSections(showLoadDocumentModal: boolean) {
  this.loadingService.show();
  this.subscriptions.add(
  this.camService.getDocumentSections(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.bulkRecoveryApprovalId).subscribe((response: any) => {
      this.documentationSections = response.result;
      this.loadingService.hide();
      if (this.documentationSections.length < 1) {
          this.getDocumentTemplate(showLoadDocumentModal);
      }
  }, (err) => {
      this.loadingService.hide(1000);
  }));
}

canEditDocument() { return true; }

// //----------------------- privileges and buttons --------------------------

// privilege: any = {
//   viewCamDocument: false,
//   viewUploadedFiles: false,
//   viewApproval: false,
//   canMakeChanges: false,
//   canAppendTemplate: false,
//   canApprove: false, 
//   canUploadFile: false,
//   canSendRequest: false,
//   canEscalate: false,
//   owner: false,
//   approvalLimit: 0,
//   userApprovalLevelIds: null,
//   currentApprovalLevelId: 0,
//   currentApprovalLevel: null,
//   groupRoleId: 1, // bu,ca,md,comm,bd
// };

// getUserPrivileges(levelId: number = null) {
//   let body = {
//       levelId: levelId,
//       operationId: this.loanSelectedData.operationId,
//       targetId: this.loanSelectedData.bulkRecoveryApprovalId,
//       productClassId: null,
//       productId: null
//   }
//   this.subscriptions.add(
//   this.camService.getPrivilege(body).subscribe((response: any) => {
//       this.privilege = response.result;
//       this.setGroupRole(this.privilege.groupRoleId);
//       this.reload++;
//       if (this.privilege.canApprove != true) this.commentLabel = 'Comment';
//   }));
// }

// setGroupRole(id) {
//   this.isBoard = false;
//   this.isAnalyst = false;
//   this.isBusiness = false;
//   this.isSubsequent = false;
//   switch (id) {
//       case 0: this.isBusiness = true; break;
//       case ApprovalGroupRole.BU: this.isBusiness = true; break;
//       case ApprovalGroupRole.CAP: this.isAnalyst = true; break;
//       case ApprovalGroupRole.BOD: this.isBoard = true; break;
//       default: this.isBusiness = true; break;
//   }
// }
  clearControlsa() {
    this.selectedId = null;
    this.documentSectionForm = this.fb.group({
        sectionId: ['', Validators.required],
    });

    this.appendForm = this.fb.group({
        creditTemplateId: ['', Validators.required],
    });
}

print(): void {
  let printTitle = 'RECOVERY MEMO';
  let printContents, popupWin;
  let content = '<div class="row">';
  this.documentations.forEach(x => {
  content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
});
content = content + '</div>';

printContents = content;// document.getElementById('print-section').innerHTML;
popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//popupWin.document.open();
popupWin.document.write(`
  <html>
      <head>
      <title style="font face: arial; size:12px">${printTitle}</title>
      <style>
      //........Customized style.......
      </style>
      </head>
      <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
  </html>`
);
popupWin.document.close();
}

getBulkRecoveryToAgentAwaitingApproval() {
  this.loadingService.show();
  this.loanOperationService.getBulkRecoveryToAgentAwaitingApprovalList(this.source).subscribe((response: any) => {
  this.loanRecoveryApplicationStatusData = response.result;
  this.loadingService.hide();
});
}

BulkRecoveryToAgentAwaitingApprovalList() {
  this.loadingService.show();
  this.loanOperationService.BulkRecoveryToAgentAwaitingApprovalList(this.source).subscribe((response: any) => {
  this.applicationListData = response.result;
  this.loadingService.hide();
});
}

recoveryApprovalId: any;
recoveryOperationId: any;
viewLoanDetails(row, evt) {
  evt.preventDefault();
  this.loanSelectedData = row;
  this.loanSelectedData.approvalStatusId = "";
  let dataObj = this.loanSelectedData;
  this.recoveryApprovalId = this.loanSelectedData.bulkRecoveryApprovalId;
  this.recoveryOperationId = this.loanSelectedData.operationId;
  this.getAllLoansRecoveredByAgent(this.loanSelectedData.accreditedConsultant, this.loanSelectedData.referenceId);
  this.previewDocumentation(this.TEMPLATE_OPERATION_ID,this.recoveryApprovalId, this.loanSelectedData.referenceId, this.loanSelectedData.accreditedConsultant);
  this.getTrail(this.recoveryApprovalId,this.recoveryOperationId);
  this.displayApprovalModal = true;
}

goForApproval(row, evt) {
  evt.preventDefault();
  this.loanSelectedData = {};
  this.loanSelectedData = row;
  this.displayapprovalRecoveryModal = true;
}


  clearControls(): void {
    this.searchQuery = this.fb.group({
      agent: [''],
      expCompletionDate: ['']
      
    });
  }
  consultants: any[] = [];

  getAccreditedConsultants() {
    this.camService.getAccreditedStateConsultants().subscribe((response: any) => {
      this.accreditedConsultants = response.result;
    });
  }

  getAllLoansRecoveredByAgent(accreditedConsultantId,referenceId) {
    this.loanOperationService.getAllBulkLoansRecoveredByAgent(accreditedConsultantId,referenceId).subscribe((response: any) => {
      this.loanRecoveryApprovalData = response.result;
    });
  }

  getAllLoansOperationRecoveryAnalysis() {
    this.loadingService.show();
      this.loanOperationService.getAllLoansOperationRecoveryAnalysis().subscribe((response: any) => {
          this.loanToAssignData = response.result;
          this.label = "Assign To Agent"
          this.loadingService.hide();
      });
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

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  pickSearchedData(item) {
    this.agentSearched = this.searchResults.filter(x => x.accreditedConsultantId == item.accreditedConsultantId);
    this.agent = this.agentSearched[0].firmName;
    this.accreditedConsultantId = this.agentSearched[0].accreditedConsultantId;
    this.label = "Assign To "+this.agent;
    this.displaySearchModal = false;
  }

 
  assignMultipleLoansToAgent() {
    var event = new Date(this.expCompletionDate);
    let date = JSON.stringify(event);
    date = date.slice(1, 11);
    var assignmentType = "MANUAL";
    
    this.loadingService.show(); 
    this.camService.assignMultipleLoansToAgentRem(this.schemeSelection, this.accreditedConsultantId, date, this.source,assignmentType).subscribe((response: any) => {
        if (response.success === true) {
          this.loadingService.hide(1000);
            this.getAllLoansOperationRecoveryAnalysis();
            this.getBulkRecoveryToAgentAwaitingApproval();
            this.BulkRecoveryToAgentAwaitingApprovalList();
            this.schemeSelection.length = 0;
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

submitForApproval() {
  this.loadingService.show(); 
  this.camService.assignMultipleLoansToAgentInitiateApproval(this.loanSelectedData).subscribe((response: any) => {
      if (response.success === true) {
        this.loadingService.hide(1000);
        this.getAllLoansOperationRecoveryAnalysis();
        this.getBulkRecoveryToAgentAwaitingApproval();
        this.BulkRecoveryToAgentAwaitingApprovalList();
        this.loanSelectedData = {};
        this.displayapprovalRecoveryModal = false;
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

getTrail(recoveryApprovalId,recoveryOperationId) {
  this.loadingService.show();
  this.subscriptions.add(
          this.camService.getTrailLms(recoveryApprovalId, recoveryOperationId).subscribe((response: any) => {
          this.trail23 = response.result;
          this.trailCount = this.trail23.length;
          // this.trailRecent = this.trail23[0];
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

}

