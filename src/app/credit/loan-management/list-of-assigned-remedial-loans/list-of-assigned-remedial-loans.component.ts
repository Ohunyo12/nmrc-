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
  selector: 'app-list-of-assigned-remedial-loans',
  templateUrl: './list-of-assigned-remedial-loans.component.html'
})
export class ListOfAssignedRemedialLoansComponent implements OnInit {

  schemeSelections: any[] = [];
  schemeSelectionsBulk: any[] = [];
  pendingEmailData: any[] = [];
  schemeSelection: any;
  loanOperationApprovalData: any[] = [];
  generateMailData: any[] = [];
  loanAssignId: number = 0;
  loanRecoveryReassignmentForm: FormGroup;
  displayReassignmentForm: boolean = false;
  displayBulkReassignmentForm: boolean = false;
  displaySearchModal: boolean = false;
  source: string = "REMEDIAL";
  currentConsultant: any;
  newConsultant: any;
  searchTerm$ = new Subject<any>();
  searchResults: any;
  agentSearched: any;
  newConsultantName: any;
  expCompletionDate: any;

  recoveryApprovalId: any;
  recoveryOperationId: any;
  loanSelectedData: any;
  TEMPLATE_OPERATION_ID: number = 264;
  loanRecoveryApprovalData: any[]=[];
  private subscriptions = new Subscription();
  documentations: any[]=[];
  displayDocumentation: boolean = false;
  trail23: any[]=[];
  displayApprovalModal: boolean = false;
  trailCount: any;
  trailLevels: any[] = [];
  backtrail: any[] = [];


  label: string = "Re-Assign To Agent"

  show: boolean = false; message: any; title: any; cssClass: any; // message box
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
    this.getAllPendingEmailAlert();
    this.clearControls();
    this.getAllUnassignedRecoveryOperationByAgent();
  }


   viewLoanDetails(row) {
    this.loanSelectedData = row;
    this.recoveryApprovalId = this.loanSelectedData.bulkRecoveryApprovalId;
    this.recoveryOperationId = this.loanSelectedData.operationId;
    this.getAllBulkLoansRecoveredByAgentRemedial(this.loanSelectedData.accreditedConsultant, this.loanSelectedData.referenceId);
    this.previewDocumentation(this.TEMPLATE_OPERATION_ID, this.recoveryApprovalId, this.loanSelectedData.referenceId, this.loanSelectedData.accreditedConsultant);
    this.getTrail(this.recoveryApprovalId, this.recoveryOperationId);
    this.displayApprovalModal = true;
  }

  getAllBulkLoansRecoveredByAgentRemedial(accreditedConsultantId,referenceId) {
    this.loanOperationService.getAllBulkLoansRecoveredByAgentRemedial(accreditedConsultantId,referenceId).subscribe((response: any) => {
      this.loanRecoveryApprovalData = response.result;
    });
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

  getTrail(recoveryApprovalId,recoveryOperationId) {
    this.loadingService.show();
    this.subscriptions.add(
            this.camService.getTrailLms(recoveryApprovalId, recoveryOperationId).subscribe((response: any) => {
            this.trail23 = response.result;
            this.trailCount = this.trail23.length;
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

  clearInput() {
    this.currentConsultant = 0;
    this.newConsultant = 0;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  clearControls(): void {
    this.loanRecoveryReassignmentForm = this.fb.group({
      currentConsultant: ['', Validators.required],
      newConsultant: ['', Validators.required]
    });
  }

  getAllLoansOperationRecoveryAnalysisByAgent() {
    this.loadingService.show();
    this.loanOperationService.getAllLoansOperationRecoveryAnalysisByAgent(this.source).subscribe((response: any) => {
      this.loanOperationApprovalData = response.result;
      this.loadingService.hide();
    });
  }

  unAssignloanOperationApprovalData: any[] = [];
  getAllUnassignedRecoveryOperationByAgent() {
    this.loadingService.show();
    this.loanOperationService.getAllUnassignedRecoveryOperationByAgent(this.source).subscribe((response: any) => {
      this.unAssignloanOperationApprovalData = response.result;
      this.loadingService.hide();
    });
  }

  getAllPendingEmailAlert() {
    this.loadingService.show();
    this.loanOperationService.getAllPendingEmailAlert(this.source).subscribe((response: any) => {
      this.pendingEmailData = response.result;
      this.loadingService.hide();
    });
  }

  pickSearchedData(item) {
    this.agentSearched = this.searchResults.filter(x => x.accreditedConsultantId == item.accreditedConsultantId);
    this.newConsultantName = this.agentSearched[0].firmName;
    this.newConsultant = this.agentSearched[0].accreditedConsultantId;
    this.label = "Re-Assign To " + this.newConsultantName;
    this.displaySearchModal = false;
  }

  reassign(row) {
    this.schemeSelection = row;
    this.currentConsultant = this.schemeSelection.accreditedConsultantCompany;
    this.displayReassignmentForm = true;
  }

  unassign(row) {
    const __this = this;

    swal({
      title: 'You are about to carry out un-assignment of recovery',
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

      let body = {
        loanAssignId: row.loanAssignId
      };
      __this.schemeSelection = row;
      __this.loadingService.show();
      __this.camService.saveRecoveryUnassignmentForm(body).subscribe((response: any) => {
        if (response.success === true) {
          __this.loadingService.hide(1000);
          __this.getAllPendingEmailAlert();
          __this.getAllLoansOperationRecoveryAnalysisByAgent();
          __this.getAllUnassignedRecoveryOperationByAgent();
          __this.schemeSelection.length = 0;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');

        } else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

        }
      }, (err) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
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

  bulkUnAssignment() {
    const __this = this;
    swal({
      title: 'You are about to carry out bulk un-assignment of recovery',
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
      __this.camService.saveBulkRecoveryUnassignmentForm(__this.schemeSelections).subscribe((response: any) => {
        if (response.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.loadingService.hide(1000);
          __this.getAllPendingEmailAlert();
          __this.getAllLoansOperationRecoveryAnalysisByAgent();
          __this.schemeSelection.length = 0;
          
        } else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

        }
      }, (err) => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

  }

  GenerateMAil() {
    this.loadingService.show();
    this.loanOperationService.generateMailToAgents(this.source).subscribe((response: any) => {
      this.generateMailData = response.result;
      this.getAllLoansOperationRecoveryAnalysisByAgent();
      this.getAllPendingEmailAlert();
      this.loadingService.hide();
    });
  }

  bulkReAssignment() {
    this.schemeSelectionsBulk = this.schemeSelections;
    this.displayBulkReassignmentForm = true;
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
    this.camService.saveRecoveryReassignmentRemForm(body).subscribe((response: any) => {
      if (response.success === true) {
        this.loadingService.hide(1000);
        this.getAllLoansOperationRecoveryAnalysisByAgent();
        this.getAllPendingEmailAlert();
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


  saveBulkRecoveryReassignmentForm() {

    let expCompDate = new Date(this.expCompletionDate);
    let expCompletionDate = JSON.stringify(expCompDate);
    expCompletionDate = expCompletionDate.slice(1, 11);

    let body = {
      expCompletionDate: expCompletionDate,
      accreditedConsultant: this.newConsultant,
      source: this.source,
    };

    this.loadingService.show();
    this.camService.saveBulkRecoveryReassignmentForm(this.schemeSelectionsBulk, body.expCompletionDate, body.accreditedConsultant, body.source).subscribe((response: any) => {
      if (response.success === true) {
        this.loadingService.hide(1000);
        this.getAllLoansOperationRecoveryAnalysisByAgent();
        this.getAllPendingEmailAlert();
        this.schemeSelectionsBulk.length = 0;
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


}
