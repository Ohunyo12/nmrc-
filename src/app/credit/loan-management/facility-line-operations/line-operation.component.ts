import { ConvertString, LMSOperationEnum, LoanSystemTypeEnum, ProductTypeEnum, GlobalConfig } from '../../../shared/constant/app.constant';
import { CustomerService } from "../../../customer/services/customer.service";
import { CasaService } from "../../../customer/services/casa.service";
import { Subject, Subscription } from "rxjs";
import swal from "sweetalert2";
import { LoadingService } from "../../../shared/services/loading.service";
import { LoanService } from "../../services/loan.service";
import { DateUtilService } from "../../../shared/services/dateutils";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoanOperationService } from "../../services/loan-operations.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AuthenticationService } from 'app/admin/services/authentication.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { DatePipe } from '@angular/common';
import { commercialPaperSubAllocationSource } from '../../models/commercial-paper';
import { LoanApplicationService, CreditAppraisalService } from 'app/credit/services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { saveAs } from 'file-saver';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';

@Component({
  selector: 'app-line-operations.component',
  templateUrl: './line-operation.component.html',
  styles: [`.ui-datepicker {top: 20px !important;}`]

})
export class FacilityLineReviewOperationsComponent implements OnInit, OnDestroy {
  totalOutstanding: number;
  pastDue: number;
  allScheduleTypes: any[];
  terminalAndRebook: boolean;
  displayInterestRate: boolean = false;
  displayRestructure: boolean = false;

  displayTenorChange: boolean = false;
  displayInterestFrequencyChange: boolean = false;
  displayPrincipalFrequencyChange: boolean = false;
  displayPaymentDateChange: boolean = false;
  displayInterestPrincipalChange: boolean = false;
  applicationReferenceNumber: any;
  customerAccounts: any[] = [];
  operationTypes: any[];
  shouldDisburse: boolean;
  checked: boolean;
  hideDisbursementCheck: string = "hide";
  display: boolean = false;
  displayScheduleModalForm: boolean = false;
  show: boolean = false;
  message: any;
  title: any;
  cssClass: any;
  scheduleGroupForm: FormGroup;
  scheduleTypes: any[];
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  scheduleParams: any = {};
  basis: any[];
  frequencies: any[];
  scatteredMethod: boolean = false;
  bulletMethod: boolean = false;
  ballonMethod: boolean = false;
  scatterdPayments: any[] = [];
  irregularSchedules: any[];
  data: any = {};
  irreSchedules: boolean = false;
  principalBalance: any = 0;
  principalValanceString: any;
  callendarPixel: string;
  convenatDetails: any[];
  guarantorDetails: any[];
  chargeFeeDetails: any[];
  entityName: string;
  displayLoanReviewList: boolean = false;
  displayBackToList: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayLoanReviewOperationModal: boolean = false;
  termLoanId: number = null;
  approvedLineReviewData: any[];
  selectedLoanReview: any = {};
  LoanReviewOperationForm: FormGroup;
  CREDITAPPRIASALDOC = 'CREDITAPPRIASALDOC';

  displayCasaDetails: boolean = false;
  model: any;
  searchAccountTerm$ = new Subject<any>();
  displayCASASearchModal: boolean = false;
  CASAAccountChange: boolean = false;
  displayOrHideControl: boolean = false;
  casaSearchResults: any[];
  objBody: any = {};
  refNo: any;
  displayLoanRebookModal: boolean = false;
  loanInfo: any = {};
  AnnuityMethod: boolean = false;
  terminateAndRebookscatteredMethod: boolean = false;
  terminateAndRebookBallonMethod: boolean = false;
  terminateAndRebookBulletMethod: boolean = false;
  terminateAndRebookAnnuityMethod: boolean = false;
  systemCurrentDate: any;
  lmsApplicationDetailId: number = 0;
  displayRolloverModal: boolean;
  displayInterestChangeModal: boolean;
  displayTenorChangeModal: boolean;
  displaySubAllocationChangeModal: boolean;
  displayFacilityLineAmountChangeModal: boolean;
  systemDate: Date;
  displayAutomaticRolloverModal: boolean;
  interestRateChangeForm: FormGroup;
  tenorChangeForm: FormGroup;
  subAllocationForm: FormGroup;
  facilityAmountForm: FormGroup;
  totalTenor: number;
  newTenorLeft: number;
  hasNewMaturityDate: boolean;
  tenorLeft: number;
  sourceValues: commercialPaperSubAllocationSource[] = [];
  subAllocatedRecord: commercialPaperSubAllocationSource[] = [];
  loanGridRecordSelected: boolean;
  selectedReferenceNumber: any;
  subAllocationPrincipalAmount: number;
  allSelectedPrincipalAmount: number = 0;
  gridEditted: boolean;
  showFirstGrid: any;
  loanViewSelectionForSubAllocation: any;
  isGroup: boolean;
  originalForm3800bSrc: any = {};
  OPERATION_ID: number = 46;
  documentations: any[] = [];
  displayDocumentation: boolean = false;
  selectedloanReviewApplicationId: number;
  displayRefered: boolean = false;
  selectedLoanReviewId: number;
  approvalWorkflowData: any[];
  approvedLoanOperationReviewData: any[];
  reportSrc: any;
  reportSource: SafeResourceUrl;

  supportingDocuments: any[] = [];
  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  fileDocument: any;
  pdfFile: any;
  pdfFileName: string;
  displayPdf: boolean = false;
  myDocExtention: string;
  pdfData: any;
  fileUrl: string;

  creditAppraisalOperationId: any;
  creditAppraisalLoanApplicationId: any;

  searchString: string;
  searchForm: FormGroup;
  displaySearchForm: boolean = false;

  private subscriptions = new Subscription();
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private loanSrv: LoanService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loadingService: LoadingService,
    private casaService: CasaService,
    private customerService: CustomerService,
    private authService: AuthenticationService,
    private loanApplService: LoanApplicationService,
    private camService: CreditAppraisalService,
    private sanitizer: DomSanitizer,
    private reportServ: ReportService,
    private documentpUloadService: DocumentpUloadService,
  ) {
    // this.casaService
    //   .searchForAccount(this.searchAccountTerm$)
    //   .subscribe(results => {
    //     this.casaSearchResults = results.result;
    //     ////console.log("search item", this.casaSearchResults);
    //   });
  }
  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    this.systemDate = userInfo.applicationDate;
    //this.username = userInfo.userName;
    this.loadingService.show();
    this.displayLoanReviewList = true;
    this.CASAAccountChange = false;
    this.getApprovedLineReviewData();
    this.clearControls();
    this.displayOrHideControl = true;
    //this.GetOperationType();
    this.loadingService.hide();
  }
  clearControls() {
    this.interestRateChangeForm = this.fb.group({
      valueDate: ['', Validators.required],
      newInterestRate: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    });

    this.tenorChangeForm = this.fb.group({
      newTenor: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
      newMaturity: [''],
      actionType: ['', Validators.required],
      searchInput: [''],
    });

    this.subAllocationForm = this.fb.group({
      principalAmount: ['', Validators.required],
      loanReferenceNumber: ['', Validators.required],
      sourcePrincipal: ['', Validators.required],
    });

    this.facilityAmountForm = this.fb.group({
      newPrincipalAmount: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
    });

    this.searchForm = this.fb.group({
      searchString: ['', Validators.required]
    });

    //this.interestRateChangeForm.controls['valueDate'].setValue(this.systemDate | date);
    this.hasNewMaturityDate = false;
  }
  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
  }
  previewDocumentation(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response) => {
        this.documentations = response.result;
        ////console.log('getDocumentation -> ', response);
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  previewDocumentationLos(print = false) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId).subscribe((response) => {
        this.documentations = response.result;
        ////console.log('getDocumentation -> ', response);
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }

  getCustomerAccounts(customerId) {
    this.subscriptions.add(
      this.casaService
        .getAllCustomerAccountByCustomerId(customerId)
        .subscribe(response => {
          this.customerAccounts = response.result;
        }));
  }
  getApprovedLineReviewData() {
    this.subscriptions.add(
      this.loanOperationService.getApprovedLineReviewData().subscribe(results => {
        this.approvedLineReviewData = results.result;
      }));
  }

  GetOperationType() {
    this.subscriptions.add(
      this.loanOperationService.getOperationType(true).subscribe(results => {
        this.operationTypes = results.result;

        if (this.selectedLoanReview.productTypeId == ProductTypeEnum.CommercialLoans) {
          this.operationTypes = this.operationTypes
            .filter
            (x =>
              x.operationTypeId == LMSOperationEnum.TenorExtension ||
              x.operationTypeId == LMSOperationEnum.InterestRateChange ||
              //x.operationTypeId == LMSOperationEnum.CommercialLoanSubAllocation ||
              x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange ||
              x.operationTypeId == LMSOperationEnum.AnnualReview
            )
        }
        else {
          this.operationTypes = this.operationTypes
            .filter
            (x =>
              x.operationTypeId == LMSOperationEnum.TenorExtension ||
              x.operationTypeId == LMSOperationEnum.InterestRateChange ||
              x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange ||
              x.operationTypeId == LMSOperationEnum.AnnualReview
            )
        }

      }));
  }

  loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
        .subscribe((response) => {
          let tempSrc = response.result;
          if (tempSrc != null) {
            this.originalForm3800bSrc = tempSrc;
          }
          else {
            this.originalForm3800bSrc = {};
          }
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
          ////console.log('error', err);
        }));
  }
  loanSystemTypeId: number;
  currencyId: number;
  customerId: number;
  applicationCollection: any[] = [];

  takeFees(event) {
    this.applicationCollection = event;
    //console.log("applicationCollection",this.applicationCollection);
  }

  lineOperationId: number;
  onSelectedLoanReviewChange(event) {
    this.selectedLoanReview = event.data;
    // console.log("selectedLoanReview",this.selectedLoanReview)
    this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
    this.entityName =
      "Perform Loan Review Operation For: " +
      this.selectedLoanReview.customerName;
    this.GetOperationType();
    this.termLoanId = this.selectedLoanReview.loanId;
    this.loanSystemTypeId = this.selectedLoanReview.loanSystemTypeId;
    this.currencyId = this.selectedLoanReview.currencyId;
    this.customerId = this.selectedLoanReview.customerId;
    //console.log("Choice Line Data", this.selectedLoanReview);
    this.lineOperationId = this.selectedLoanReview.operationId;
    this.displayLoanReviewList = false;
    this.applicationReferenceNumber = this.selectedLoanReview.applicationReferenceNumber;
    this.displayCustomerLoanDetails = true;
    this.creditAppraisalOperationId = this.selectedLoanReview.creditAppraisalOperationId;
    this.creditAppraisalLoanApplicationId = this.selectedLoanReview.creditAppraisalLoanApplicationId;
    this.displayBackToList = true;
    this.selectedloanReviewApplicationId = this.selectedLoanReview.loanReviewApplicationId;
    this.approvedLoanOperationReviewData = this.selectedLoanReview.operationReview;
    this.loaddataFormOperationReview22(this.lineOperationId, this.selectedloanReviewApplicationId);
    if (this.approvedLoanOperationReviewData != null) {
      this.loaddataFormOperationReview(this.approvedLoanOperationReviewData);
      this.displayRefered = true;
    }
    else {
      //this.loaddataForm(this.selectedLoanReview);
      this.displayRefered = false;

    }
    this.loadOriginalForm3800BTemplate(this.selectedLoanReview.lmsApplicationReferenceNumber);
    this.getAllUploadedDocument();

  }

  isCreator(): boolean {
    return false;
    // if (this.application == null) return false;
    // const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
    // return this.application.createdBy == user.staffId;
  }

  loaddataFormOperationReview(data) {
    if (data != undefined) {
      const row = data;

      this.data.operationTypeId = row.operationTypeId;
      this.selectedLoanReviewId = row.loanReviewOperationsId;
      // this.subscriptions.add(
      //   this.loanSrv.getApprovalTrailByOperation(row.operationTypeId, row.loanReviewOperationsId).subscribe((res) => {
      //     this.approvalWorkflowData = res.result;
      //   }));

      this.onOperationTypeChange(row.operationTypeId);
      this.operationTypes
        .filter
        (x =>
          x.operationTypeId == row.operationTypeId
        )



      if (this.displayTenorChangeModal == true) {
        this.tenorChangeForm.controls["newTenor"].setValue(
          row.newTenor
        );
        this.calculateNewTenor();
      }
      if (this.displayInterestChangeModal == true) {
        this.interestRateChangeForm.controls["newInterestRate"].setValue(
          row.newInterateRate
        );
        this.interestRateChangeForm.controls["valueDate"].setValue(
          new Date(row.newEffectiveDate)
        );
      }
      if (this.displayFacilityLineAmountChangeModal == true) {
        this.facilityAmountForm.controls["newPrincipalAmount"].setValue(
          new Date(row.prepayment)
        );
      }

    }
  }

  loaddataFormOperationReview22(operationId, targetId) {

    this.subscriptions.add(
      this.loanSrv.getApprovalTrailByOperation22(operationId, targetId).subscribe((res) => {
        this.approvalWorkflowData = res.result;
      }));
  }


  showLoanReviewForm() {
    //this.loaddataForm(this.selectedLoanReview);
    this.displayLoanReviewOperationModal = true;
  }

  backToLoanReviewList() {
    this.displayLoanReviewList = true;
    this.displayCustomerLoanDetails = false;
    this.displayBackToList = false;
    this.displayTenorChangeModal = false;
    this.displayInterestChangeModal = false;
  }

  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount));
    this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.scatterdPayments.splice(indx, 1);
  }

  formatValue() {
    this.data.amount = this.facilityAmountForm.value.newPrincipalAmount;
    if (this.data.amount == "") return;
    var realChar: string = this.data.amount;
    var currVal: string = this.data.amount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.amount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }
  formatFeeValue() {
    if (this.data.integralFeeAmount == "") return;
    var realChar: string = this.data.integralFeeAmount;
    var currVal: string = this.data.integralFeeAmount.substr(-1);
    realChar = realChar.substr(0, realChar.length - 1);
    currVal = currVal.substr(-1);

    if (currVal === "M" || currVal == "m") {
      let result: Number = Number(realChar) * 1000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (
      currVal === "T" ||
      currVal == "t" ||
      currVal === "K" ||
      currVal === "k"
    ) {
      let result: Number = Number(realChar) * 1000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else if (currVal === "b" || currVal === "B") {
      let result: Number = Number(realChar) * 1000000000;
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    } else {
      let result: Number = Number(realChar);
      this.data.integralFeeAmount = result.toLocaleString("en-US", {
        minimumFractionDigits: 2
      });
    }
  }

  getOperation(id) {
    return this.casaService.getOperation(id);
  }
  getAccountStatus(id) {
    return this.casaService.getAccountStatus(id);
  }
  showSearchAccountNumber() {
    this.displayCASASearchModal = true;
  }
  calculateMaturityDate() {
    this.LoanReviewOperationForm.controls["maturityDate"].setValue(null);
    let newTenor = this.LoanReviewOperationForm.get("newtenor").value;
    if (newTenor <= 0) {
      swal(
        "FinTrak Credit 360",
        "System cannot calculate maturity date with zero tenor.",
        "error"
      );
    }
    let effectiveDate = this.LoanReviewOperationForm.get(
      "proposedEffectiveDate"
    ).value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    this.LoanReviewOperationForm.controls["maturityDate"].setValue(
      maturityDate
    );
  }
  calculateTenor() {
    this.LoanReviewOperationForm.controls["newtenor"].setValue(null);
    let effectiveDate = this.LoanReviewOperationForm.get(
      "proposedEffectiveDate"
    ).value;
    let maturityDate = this.LoanReviewOperationForm.get("maturityDate").value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      swal(
        "FinTrak Credit 360",
        "Effective Date cannot be greater than Maturity Date.",
        "error"
      );
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.LoanReviewOperationForm.controls["newtenor"].setValue(tenor);
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  onOperationTypeChange(event) {
    let caose = Number(event);
    if (event != undefined) {
      this.selectedLoanReview.loanReviewOperationTypeId = event;
    }
    ////console.log('operationTypes',this.operationTypes)
    //this.enableDisableControl(caose);

    if (event == LMSOperationEnum.InterestRateChange) {
      this.displayLoanReviewOperationModal = false;
      this.displayTenorChangeModal = false;
      this.displaySubAllocationChangeModal = false;
      this.displayFacilityLineAmountChangeModal = false;
      this.displayInterestChangeModal = true;
    }

    if (event == LMSOperationEnum.TenorExtension) {
      this.displayLoanReviewOperationModal = false;
      this.displayInterestChangeModal = false;
      this.displaySubAllocationChangeModal = false;
      this.displayFacilityLineAmountChangeModal = false;
      this.displayTenorChangeModal = true;
    }

    if (event == LMSOperationEnum.FacilityLineAmountChange || event == LMSOperationEnum.AnnualReview) {
      this.displayLoanReviewOperationModal = false;
      this.displayInterestChangeModal = false;
      this.displaySubAllocationChangeModal = false;
      this.displayFacilityLineAmountChangeModal = true;
      this.displayTenorChangeModal = false;
    }

    if (event == LMSOperationEnum.CommercialLoanSubAllocation) {
      this.displayLoanReviewOperationModal = false;
      this.displayInterestChangeModal = false;
      this.displayFacilityLineAmountChangeModal = false;
      this.displayTenorChangeModal = false; ////console.log('loanApplicationDetailId',this.selectedLoanReview.loanApplicationDetailId)
      this.getCommercialLoanByApplicationDetailId(this.selectedLoanReview.loanApplicationDetailId);
      this.displaySubAllocationChangeModal = true;

    }
    //this.displayLoanReviewOperationModal = false;
  }
  takeFeeStatus: number;

  /* METHODS BELOW BELONG TO TENOR CHANGE PROCESS
  * ********************************************/
  addTenor(formObj) {
    //this.loadingService.show();
    //console.log(this.applicationCollection.length);
    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else {
      this.applicationCollection = [];
    }
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }

    let bodyObj = {

      loanRef: this.selectedLoanReview.loanReferenceNumber,
      newTenor: formObj.value.newTenor,
      appRef: this.selectedLoanReview.applicationReferenceNumber,
      loanApplicationDetailId: this.selectedLoanReview.loanApplicationDetailId,
      loanReviewOperationsId: reviewId,
      operationId: this.data.operationTypeId,
      fees: this.applicationCollection,
      feeSourceModule: "LMS",

    };
    const __this = this;
    swal({
      title: 'Are you sure?',
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
      __this.subscriptions.add(
        __this.loanOperationService.addTenorToLine(bodyObj).subscribe((res) => {
          if (res.success == true) { ////console.log('success',res);
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'success'
            )
            __this.getApprovedLineReviewData();
            __this.clearControls();
            __this.backToLoanReviewList();
          }
          else { ////console.log('failure',res)
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'error'
            )
          }
          __this.loadingService.hide(1000);
        }, (err: any) => {
          swal(
            'Fintrak Credit Credit 360',
            JSON.stringify(err),
            'error'
          )
          __this.loadingService.hide(1000);
        }));
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  pipe = new DatePipe('en-US');
  mdate: Date;
  calculateNewTenor() {
    let newTenor = this.tenorChangeForm.value['newTenor'];

    if (newTenor <= 0) {
      swal(
        'Fintrak Credit 360',
        'Tenor must be greater than zero.',
        'warning'
      );
      return;
    }
    let maturitydate = this.selectedLoanReview.expiryDate;
    var EXdate = new Date(maturitydate);
    EXdate.setDate(EXdate.getDate() + Number(newTenor));

    this.totalTenor = 0;
    this.newTenorLeft = 0;

    this.tenorLeft = this.selectedLoanReview.approvedTenor - this.selectedLoanReview.tenorUsed;
    this.totalTenor = Number(this.selectedLoanReview.approvedTenor) + Number(newTenor);
    this.newTenorLeft = Number(this.tenorLeft) + Number(newTenor);

    this.tenorChangeForm.controls['newMaturity'].setValue(this.pipe.transform(EXdate, 'dd/MMM/yyyy'));
    this.hasNewMaturityDate = true;
  }
  /* ...END OF TENOR CHANGE PROCESS METHODS...
  * ********************************************/


  /* METHODS BELOW BELONG TO INTEREST RATE CHANGE PROCESS
  * ********************************************/
  changeApplicationLineInterestRate(formObj) {
    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else {
      this.applicationCollection = [];
    }
    // this.loadingService.show();
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }

    let bodyObj =
    {
      newRate: formObj.value.newInterestRate,
      loanApplicationDetailId: this.selectedLoanReview.loanApplicationDetailId,
      valueDate: formObj.value.valueDate,
      loanReviewOperationsId: reviewId,
      operationId: this.data.operationTypeId,
      fees: this.applicationCollection,
      feeSourceModule: "LMS",

    }
    const __this = this;
    swal({
      title: 'Are you sure?',
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
      __this.subscriptions.add(
        __this.loanOperationService.changeApplicationLineInterestRate(bodyObj).subscribe((res) => {
          if (res.success == true) { ////console.log('success',res);
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'success'
            )
            __this.getApprovedLineReviewData();
            __this.clearControls();
            __this.backToLoanReviewList();
          }
          else { ////console.log('failure',res)
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'error'
            )
          }
          __this.loadingService.hide(1000);
        }, (err: any) => {
          swal(
            'Fintrak Credit Credit 360',
            JSON.stringify(err),
            'error'
          )
          __this.loadingService.hide(1000);
        }));
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  /* METHODS BELOW BELONG TO CHANGE FACILITY AMOUNT PROCESS
  * ********************************************/
  changeFacilityAmount(formObj) {
    if (Number(this.selectedLoanReview.allRequestAmount) < Number(formObj.value.newPrincipalAmount)) {
      swal(
        'Fintrak Credit Credit 360',
        'Input amount cannot be less than the active total loan request amount running',
        'warning'
      )
    }
    // this.loadingService.show();
    if (this.takeFeeStatus == 1) {
      if (this.applicationCollection.length <= 0) {
        swal('FinTrak Credit 360', 'Kindly Attach One or More Fees To this Operation..', 'info');
        return
      }

    }
    else {
      this.applicationCollection = [];
    }
    let reviewId = 0;
    if (this.approvedLoanOperationReviewData != null) {
      reviewId = this.selectedLoanReviewId;
    }

    let bodyObj = {
      newAmount: formObj.value.newPrincipalAmount,
      appRef: this.selectedLoanReview.applicationReferenceNumber,
      loanApplicationDetailId: this.selectedLoanReview.loanApplicationDetailId,
      loanReviewOperationsId: reviewId,
      operationId: this.data.operationTypeId,
      fees: this.applicationCollection,

    };
    const __this = this;
    swal({
      title: 'Are you sure?',
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
      __this.subscriptions.add(
        __this.loanOperationService.changeLineFacilityAmount(bodyObj).subscribe((res) => {
          if (res.success == true) { ////console.log('success',res);
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'success'
            )
            __this.getApprovedLineReviewData();
            __this.clearControls();
            __this.backToLoanReviewList();
          }
          else { ////console.log('failure',res)
            swal(
              'Fintrak Credit Credit 360',
              res.message,
              'error'
            )
          }
          __this.loadingService.hide(1000);
        }, (err: any) => {
          swal(
            'Fintrak Credit Credit 360',
            JSON.stringify(err),
            'error'
          )
          __this.loadingService.hide(1000);
        }));
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }
  /* ...END OF CHANGE LINE FACILITY AMOUNT PROCESS */


  /* ...END OF INTEREST RATE CHANGE PROCESS METHODS...
  * ********************************************/


  /* METHODS BELOW BELONG TO SUB-ALLOCATION PROCESS */
  getCommercialLoanByApplicationDetailId(loanId) {
    this.subscriptions.add(
      this.loanOperationService.getCommercialLoanByApplicationDetailId(loanId).subscribe(response => {
        var data = response.result;
        if (data != null) this.pushToGrid(data);
        this.sourceValues.slice;
        this.sumPrincipals();
        this.sumNewPrincipals();
        this.toggleSubAllocationGrid();
      }));
  }
  pushToGrid(data) {
    if (data != null && data != undefined) {
      data.forEach(item => {
        var selectedSource = {
          customerId: item.customerId,
          loanReferenceNumber: item.loanReferenceNumber,
          principalAmount: item.principalAmount,
          newPrincipalAmount: item.principalAmount,
          currencyCode: item.currencyCode,
        }; ////console.log('selectedSource',selectedSource);
        this.sourceValues.push(selectedSource);
      });
    }
  }
  /**        public loanReferenceNumber: string,
          public principalAmount: number,
          public customerId : number,
          public newPrincipalAmount: number,
          public currencyCode : string */
  private _loadLoanDetails: number;
  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) {
      this.loadDistursedLoanDetails(this._loadLoanDetails);
    }
  }

  private _showSubAllocation: boolean;
  @Input() set ShowSubAllocation(canShow: boolean) {
    this._showSubAllocation = canShow;
    if (canShow) {
      this.getGroupLoans(this._loadLoanDetails);
    }
  }

  getGroupLoans(loanId) {
    this.subscriptions.add(
      this.loanOperationService.getGroupCustomerLoanByLoanId(loanId).subscribe(response => {
        this.pushToGrid(response.result);
        if (response.result == null || response.result == undefined) {
          swal(
            'Fintrak Credit 360',
            'The loan is not a group loan. You can only sub-allocate for groups',
            'info'
          )
          this.isGroup = false;
          return;
        }
        this.isGroup = true
      }));
  }

  loadDistursedLoanDetails(loanId) {
    this.loanViewSelectionForSubAllocation = {};
    this.getApprovedLoanDetails(loanId);
  }
  getApprovedLoanDetails(loanId) {
    this.subscriptions.add(
      this.loanOperationService.getDisbursedLoanDetailsById(loanId, LoanSystemTypeEnum.TermDisbursedFacility).subscribe(response => {
        this.loanViewSelectionForSubAllocation = response.result;
      }));
  }

  toggleSubAllocationGrid() {
    if (this.showFirstGrid) this.showFirstGrid = false;
    else this.showFirstGrid = true;
  }

  sumPrincipals() {
    let pAmount = this.allSelectedPrincipalAmount;
    this.allSelectedPrincipalAmount = 0;
    this.sourceValues.forEach(obj => { this.allSelectedPrincipalAmount = pAmount + obj.principalAmount; })
  }

  sumNewPrincipals() {
    var newPAmount = 0;
    this.sourceValues.forEach(obj => { newPAmount = newPAmount + obj.newPrincipalAmount; })
    this.subAllocationPrincipalAmount = newPAmount;
  }

  onSubAllocateLoanChange(event) {
    if (this.sourceValues.length > 1) {
      this.loanGridRecordSelected = true;
      this.selectedReferenceNumber = event.data.loanReferenceNumber;
      this.subAllocationForm.controls['sourcePrincipal'].setValue(ConvertString.ToNumberFormate(event.data.principalAmount));
    } else swal('', 'Add more loan tranches to allocate principal.', 'info');
  }

  subAllocate(form) {
    // tslint:disable-next-line:radix
    let newPrincipal = Number(parseInt(form.value.sourcePrincipal.toString().replace(/[,]+/g, "").trim()));
    this.sourceValues.find(x => x.loanReferenceNumber == this.selectedReferenceNumber).newPrincipalAmount = newPrincipal;

    this.sumNewPrincipals();
    this.toggleSubAllocationGrid();
    this.gridEditted = true;
  }

  saveSubAllocations(formObj) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanOperationService.saveSubAllocations(this.sourceValues).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.clearControls();
        } else {
          this.finishBad(res.message);
        }
        this.loadingService.hide(1000);
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
        this.loadingService.hide(1000);
      }));
  }


  getAllUploadedDocument() {
    this.loadingService.show();
    let body = {
      loanApplicationId: this.selectedLoanReview.loanReviewApplicationId,
      loanApplicationNumber: this.selectedLoanReview.lmsApplicationReferenceNumber,
      loanReferenceNumber: this.selectedLoanReview.lmsApplicationReferenceNumber,
      databaseTable: 8,
    }
    // console.log("body",body);
    this.subscriptions.add(
      this.documentpUloadService.getAllUploadedDocument(body).subscribe((response) => {
        this.supportingDocuments = response.result;
        this.loadingService.hide();
      }, (error) => {
        this.loadingService.hide(1000);
      }));
  }
  binaryFile: string;
  selectedDocument: string;
  displayDocument: boolean = false;
  myPdfFile: any;

  viewDocument(row) {
    this.loadingService.show();
    this.subscriptions.add(
      this.documentpUloadService.getUploadedDocument(row).subscribe((response) => {
        this.binaryFile = response.result.fileData;
        this.selectedDocument = response.result.documentTitle;
        this.displayDocument = true;
        this.loadingService.hide();
      }, (error) => {
        this.loadingService.hide(1000);
      }));
  }
  viewPdfDocument(id: number) {
    let doc = this.supportingDocuments.find(x => x.documentId == id);
    if (doc != null) {
      this.displayPdf = true;
      this.fileUrl = 'https://cdn.rawgit.com/DenisVuyka/pdf-test-01/4b729e21/sample.pdf';
    };
  }

  viewExcelDocument(id: number) {
    let doc = this.supportingDocuments.find(x => x.documentId == id);
    if (doc != null) {
      this.pdfFile = doc.fileData;
      this.pdfFileName = doc.documentTitle;
      var byteString = atob(this.pdfFile);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);
      var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
      // saveAs(file)
    }
  }


  DownloadDocument(id: number) {
    this.fileDocument = null;
    this.subscriptions.add(
      this.camService.getSupportingDocumentByDocumentId(id).subscribe((response) => {
        this.fileDocument = response.result;
        // let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
        if (this.fileDocument != null) {
          this.binaryFile = this.fileDocument.fileData;
          this.selectedDocument = this.fileDocument.documentTitle;
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
              var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
              saveAs(file);
            } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
            }
          }
          if (myDocExtention == 'png' || myDocExtention == 'png') {
            try {
              var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
              saveAs(file);
            } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
            }
          }
          if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
            try {
              var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
              saveAs(file);
            } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
            }
          }
          if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
            try {
              var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
              saveAs(file);
            } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
            }
          }
          if (myDocExtention == 'doc' || myDocExtention == 'docx') {

            try {
              var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
              saveAs(file);
            } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
            }
          }
        }
      }));
  }

  displayReferBackForm: boolean;
  displayStatus(event) {
    if (event == true) {
      this.displayReferBackForm = false;
      this.getApprovedLineReviewData();
      this.clearControls();
      this.backToLoanReviewList();
    }
  }

  afterReferBackSuccess(event) {
    // swal(`${GlobalConfig.APPLICATION_NAME}`, "Loan Application has been successfully referred back!", 'success');
    this.displayReferBackForm = false;
    this.getApprovedLineReviewData();
    this.clearControls();
    this.backToLoanReviewList();
    //this.displayCommentForm = false;
  }



  showSearchForm() { this.displaySearchForm = true; }

  submitForm(formObj) {
    this.loadingService.show();
    this.subscriptions.add(
      this.loanOperationService.getApprovedLineReviewDataSearch(formObj).subscribe((res) => {
        if (res.success == true) {
          this.approvedLineReviewData = res.result;
          this.displaySearchForm=false;
          this.clearControls();
        } else {
          this.finishBad(res.message);
          this.displaySearchForm=false;
        }
        this.loadingService.hide(1000);
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
        this.loadingService.hide(1000);
      }));
  }

}

// export enum OtherLoansReviewOperationEnum {
//   Rollover = 72,
//   InterestRateChange = 19,
//   TenorChange = 26,
//   SubAllocation = 74,
//   FacilityLineAmountChange = 87
// }


