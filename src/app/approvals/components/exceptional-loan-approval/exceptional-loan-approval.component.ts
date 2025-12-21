import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CreditAppraisalService, LoanApplicationService, LoanService } from 'app/credit/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { StaffRoleService } from 'app/setup/services';

@Component({
  selector: 'app-exceptional-loan-approval',
  templateUrl: './exceptional-loan-approval.component.html',
})
export class ExceptionalLoanApprovalComponent implements OnInit {
  exceptionalLoans: any[];
  showExceptionalDetails: boolean = false;
  displayMemoModal: boolean = false;
  activeTabindex: any;
  approvalWorkflowData: any;
  operationId: number = 275;
  showCsForward: boolean;
  vote: number;
  forwardAction: number;
  displayReferBackModal: boolean;
  targetId: any;
  csForwardForm: FormGroup;
  csForwardTitle = 'Exceptional Loan';
  LMS_TEMPLATE_OPERATION_ID: number = 275;


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
  private subscriptions = new Subscription();
  documentTemplates: any[] = [];
  displayAppendModal: boolean = false;
  displayUploadedMemoModal: boolean = false;
  loanSelectedData: any;
  documentations: any[] = [];


  constructor(private loanAppService: LoanApplicationService,
    private loanService: LoanService, private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private staffRole: StaffRoleService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.clearControls();
    this.loadApprovalForm();
    this.getExceptionalLoansForApproval();
    this.getUserRole();
  }


  clearControls() {
    this.documentSectionForm = this.fb.group({
      sectionId: ['', Validators.required],
    });
    this.appendForm = this.fb.group({
      creditTemplateId: ['', Validators.required],
    });

  }
  onTabChange(event) {
    this.activeTabindex = event.index;
  }

  loadApprovalForm() {
    this.csForwardForm = this.fb.group({
      forward: [''],
      comment: ['', Validators.required]
    });
  }

  getExceptionalLoansForApproval() {
    this.loadingService.show();
    this.loanAppService.getExceptionalLoansForApproval().subscribe((response: any) => {
      this.exceptionalLoans = response.result;
      this.loadingService.hide();
    });
  }

  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
  }

  print(): void {

    let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.loanSelectedData.applicationReferenceNumber;
    let printContents, popupWin;

    let content = '<div class="row">';
    this.documentations.forEach(x => {
      content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
    });
    content = content + '</div>';

    printContents = content;// document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
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

  loadedTemplate(row){
    this.loanSelectedData = row;
    this.getDocumentationSections(false);
    // this.getDocumentTemplate(false);
    // this.loadDefaultDocumentTemplate();
  }

  loadDefaultDocumentTemplate() {  
    if (this.documentTemplates.length > 0) {
        const body = {
            templateId: this.documentTemplates[0].templateId,
            operationId: this.LMS_TEMPLATE_OPERATION_ID,
            targetId: this.loanSelectedData.loanApplicationId,
        };
        this.loadingService.show();
        this.camService.loadDocumentTemplate(body).subscribe((response: any) => { // heavy call!
        this.loadingService.hide();
        this.displayAppendModal = false;
        if(response.success == true){
            this.previewDocumentation(false);
        }

    }, (err) => {
            this.loadingService.hide(1000);
        });
    }
    this.getDocumentationSections(false);
}

  previewDocumentation(print = false) {
    this.documentations = [];
    //this.loanSelectedData = row;
    this.loadingService.show();
    this.camService.getExceptionDocumentation(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.loanApplicationId).subscribe((response: any) => {
    this.documentations = response.result;
    this.loadingService.hide();
    //if (print == false) 
    this.displayDocumentation = true;
   // else setTimeout(() => this.print(), 1000);
    }, (err) => {
        this.loadingService.hide(1000);
    });
  }

  previewDocumentation2(print = false) {
    this.documentations = [];
    this.loadingService.show();
    this.camService.getExceptionDocumentation(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.loanApplicationId).subscribe((response: any) => {
      this.documentations = response.result;
      this.loadingService.hide();
      if (print == false) this.displayDocumentation = true;
      else setTimeout(() => this.print(), 1000);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  userIsAccountOfficer = false;
  staffRoleRecord: any;
  userIsAccountOfficer2: boolean = false;
  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
      this.staffRoleRecord = res.result;
      if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'PMU' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
        this.userIsAccountOfficer = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'AO') {
        this.userIsAccountOfficer2 = true;
      }

    });
  }
  loadMemo(row) {
    this.loanSelectedData = row;
    this.displayMemoModal = true;
  }

  sendForApproval(row) {
    this.getApprovalWorkFlowComments(this.operationId, row.loanApplicationDetailId);
    this.targetId = row.loanApplicationDetailId;
    if (row.isTemplateUploaded == false && this.userIsAccountOfficer) {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly load a template for the request!', 'error');
      return;
    }
    this.showExceptionalDetails = true;

  }

  getApprovalWorkFlowComments(operationId, targetId) {
    this.loadingService.show();
    this.loanService.getApprovalTrailByOperation(operationId, targetId).subscribe((res) => {
      this.approvalWorkflowData = res.result;
      this.loadingService.hide();
    });
  }

  forward() {
    this.showCsForward = true;
    this.vote = 1;
    this.forwardAction = 2;
    this.showExceptionalDetails = false;
  }

  decline() {
    this.showCsForward = true;
    this.vote = 2;
    this.forwardAction = 3;
    this.showExceptionalDetails = false;
  }

  showReferBackModal() {
    this.displayReferBackModal = true;
    this.showExceptionalDetails = false;
  }

  close() {
    this.showExceptionalDetails = false;
  }

  modalControl(event) {
    if (event == true) {
      this.displayReferBackModal = false;
    }
  }

  referBackResultControl(event) {
    if (event == true) {
      this.getExceptionalLoansForApproval();
      this.displayReferBackModal = false;
    }
  }

  goForApproval() {
    const __this = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to submit?',
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

      let body = {
        forwardAction: __this.forwardAction,
        comment: __this.csForwardForm.controls['comment'].value,
        loanApplicationDetailId: __this.targetId,
        vote: __this.vote,
      };
      __this.loanAppService.forwardExceptionalLoanForApproval(body).subscribe((res) => {
        __this.loadingService.hide();

        if (res.success === true) {
          __this.getExceptionalLoansForApproval();
          __this.loadApprovalForm();
          __this.showCsForward = false;
          swal(`${GlobalConfig.APPLICATION_NAME}`,
            '<br/> ' + res.message, 'success');
        } else {
          __this.showCsForward = false;
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
          __this.loadingService.hide();
        }
      }, (err) => {
        __this.showCsForward = false;
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }


  onDocumentSectionChange(sectionId) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getExceptionalDocumentSection(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.loanApplicationId, sectionId).subscribe((response: any) => {
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

  saveSection(alert = false) {
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

  reload() {
    this.displayMemoModal = false;
    this.getExceptionalLoansForApproval();
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

  getDocumentTemplate(showLoadDocumentModal: boolean) {
    this.clearControls();
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentTemplates(this.LMS_TEMPLATE_OPERATION_ID).subscribe((response: any) => {
        this.documentTemplates = response.result;
        this.displayAppendModal = showLoadDocumentModal;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  isLoadTemplate: boolean = false;
  loadDocumentTemplate(form) {
    const body = {
      templateId: form.value.creditTemplateId,
      operationId: this.LMS_TEMPLATE_OPERATION_ID,
      targetId: this.loanSelectedData.loanApplicationId,
    }

    this.loadingService.show();
    this.camService.loadDocumentTemplate(body).subscribe((response: any) => { 
      this.loadingService.hide();
      if (response.success == true) {
        this.isLoadTemplate = true;
      }
      this.displayAppendModal = false;
      this.getDocumentationSections(false);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getDocumentationSections(showLoadDocumentModal: boolean) {
    this.loadingService.show();
    this.subscriptions.add(
    this.camService.getDocumentSections(this.LMS_TEMPLATE_OPERATION_ID, this.loanSelectedData.loanApplicationId).subscribe((response: any) => {
        this.documentationSections = response.result;
        this.loadingService.hide();
        this.displayMemoModal = true;
        if (this.documentationSections.length < 1) {
            this.getDocumentTemplate(showLoadDocumentModal);
        }
    }, (err) => {
        this.loadingService.hide(1000);
    }));
}



}