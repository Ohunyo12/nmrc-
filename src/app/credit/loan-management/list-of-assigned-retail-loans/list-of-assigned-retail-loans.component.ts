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
  selector: 'app-list-of-assigned-retail-loans',
  templateUrl: './list-of-assigned-retail-loans.component.html'
})
export class ListOfAssignedRetailLoansComponent implements OnInit {

  schemeSelections: any[] = [];
  schemeSelectionsBulk: any[] = [];
  pendingEmailData: any[] = [];
  schemeSelection: any;
  loanOperationApprovalData: any[] = [];
  generateMailData: any[] = [];
  loanAssignId: number = 0;
  loanRecoveryReassignmentForm: FormGroup;
  retailReportForm: FormGroup;
  displayReassignmentForm: boolean = false;
  displayBulkReassignmentForm: boolean = false;
  displaySearchModal: boolean = false;
  source: string = "RETAIL";
  currentConsultant: any;
  newConsultant: any;
  searchTerm$ = new Subject<any>();
  searchResults: any;
  agentSearched: any;
  newConsultantName: any;
  expCompletionDate: any;

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
    this.retailReportForm = this.fb.group({
      startDate: ['', Validators.required],
    });
    //this.getAllLoansOperationRecoveryAnalysisByAgent();
    this.getAllPendingEmailAlert();
    this.clearControls();
  }

  submitForm(form) {
    var start = new Date(form.value.startDate);
    start.setDate(start.getDate() + 1);
    let startDate = JSON.stringify(start);
    startDate = startDate.slice(1, 11);

    this.loadingService.show();
    this.loanOperationService.getAllMonthlyLoansOperationRecoveryAnalysisByAgent(this.source, startDate).subscribe((response: any) => {
      this.loanOperationApprovalData = response.result;
      this.loadingService.hide();
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
      __this.camService.saveRetailRecoveryUnassignmentForm(body).subscribe((response: any) => {
        if (response.success === true) {
          __this.loadingService.hide(1000);
          __this.getAllPendingEmailAlert();
          __this.getAllLoansOperationRecoveryAnalysisByAgent();
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



  bulkUnAssignment() {
    this.schemeSelectionsBulk = this.schemeSelections;
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
      __this.camService.saveRetailBulkRecoveryUnassignmentForm(__this.schemeSelectionsBulk).subscribe((response: any) => {
        if (response.success === true) {
          __this.loadingService.hide(1000);
          __this.getAllPendingEmailAlert();
          __this.getAllLoansOperationRecoveryAnalysisByAgent();
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

  GenerateMAil() {
    this.loadingService.show();
    this.loanOperationService.generateMailToAgents(this.source).subscribe((response: any) => {
      this.generateMailData = response.result;
      if (response.success === true) {
        this.loadingService.hide(1000);
        this.getAllLoansOperationRecoveryAnalysisByAgent();
        this.getAllPendingEmailAlert();
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
    this.camService.saveRecoveryReassignmentForm(body).subscribe((response: any) => {
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
    this.camService.saveBulkRetailRecoveryReassignmentForm(this.schemeSelectionsBulk, body.expCompletionDate, body.accreditedConsultant, body.source).subscribe((response: any) => {
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