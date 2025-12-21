import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CreditAppraisalService } from "app/credit/services/credit-appraisal.service";
//import { LoanOperationService } from "app/credit/services/loan-operations.service";
import { ApprovalStatus } from "app/shared/constant/app.constant";
import { LoadingService } from "app/shared/services/loading.service";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-all-delinquent-accounts",
  templateUrl: "./all-delinquent-accounts.component.html",
  styleUrls: ["./all-delinquent-accounts.component.scss"],
})
export class AllDelinquentAccountsComponent implements OnInit {
  conditions: any[] = [];
  selectedId: number = null;
  isSubsequent: boolean = false;
  displayConsultantForm: boolean = false;
  accreditedConsultants: any[] = [];
  activeTabindex: number = 0;
  agent: any;
  disableAutoLink: boolean = false;
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
  resultStatus: any[] = [];
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
  contentChange(updates) {
    this.ckeditorChanges = updates;
  }

  sectionContent: any;
  sectionDescription: any = "";
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
  commentLabel: string = "Recommendation";
  label2: any;
  readonly source: string = "RETAIL";
  loanApplicationDetail: any;
  customerProposedAmount: number = 0;
  maximumAmount: number = 0;
  loanApplicationTagsForm: FormGroup;
  isRegistrationDoneViaLoanApplication = 1;
  allRequiredDocumentsAreUploaded = true;
  readonly OPERATION_ID_DOC: number = 6;
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    //private loanOperationService: LoanOperationService
  ) {
    this.camService
      .agentSearchObservable(this.searchTerm$)
      .subscribe((results) => {
        this.searchResults = results.result;
      });
  }

  ngOnInit() {
    this.GetDelinquentAccounts();
    //this.BulkRecoveryToAgentAwaitingApprovalList();
  }

  GetDelinquentAccounts() {
    this.loadingService.show();
    this.camService
      .GetDelinquentAccounts()
      .subscribe((response: any) => {
        this.loanToAssignData = response.result;
        this.label = "Assign To Agent";
        this.label2 = "Auto Assign Recovery";
        this.loadingService.hide();
      });
  }

  show: boolean = false;
  message: any;
  title: any;
  cssClass: any; // message box

  finishBad(message) {
    this.showMessage(message, "error", "FintrakBanking");
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

  recordDetails: any;
  displayMoreRecordDetails: boolean = false;
  viewListDetails(row) {
    this.recordDetails = row;
    this.displayMoreRecordDetails = true;
  }
}
