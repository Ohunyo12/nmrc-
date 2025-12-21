
import { Subject } from "rxjs";
import swal from "sweetalert2";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthenticationService } from 'app/admin/services/authentication.service';
import { LoanService } from "app/credit/services/loan.service";
import { LoanOperationService } from "app/credit/services/loan-operations.service";
import { LoadingService } from "app/shared/services/loading.service";
import { CasaService } from "app/customer/services/casa.service";
import { CustomerService } from "app/customer/services/customer.service";
import { LMSOperationEnum, ProductTypeEnum, GlobalConfig } from "app/shared/constant/app.constant";
import { DatePipe } from '@angular/common';
import { ValidationService } from "app/shared/services/validation.service";
//import { OtherLoansReviewOperationEnum } from "app/credit/loan-management/facility-line-operations/line-operation.component";
import { GeneralSetupService } from "app/setup/services/general-setup.service";
import { AuthorizationService } from "app/admin/services/authorization.service";
import { CreditAppraisalService, LoanApplicationService } from "app/credit/services";
import { ReportService } from "app/reports/service/report.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { saveAs } from 'file-saver';
import { DocumentpUloadService } from "app/shared/services/document-upload.service";

@Component({
  templateUrl: './commercial-loan-operations-approval.component.html',
  styles: [`.ui-datepicker {top: 20px !important;}`]

})
export class CommercialLoanReviewOperationsApprovalComponent implements OnInit {
    totalOutstanding: number;
    pastDue: number;
    allScheduleTypes: any[];
    terminalAndRebook: boolean;
    displayInterestRate: boolean = false;
    displayRestructure: boolean = false;
    operationtypeId: any;

    displayTenorChange: boolean = false;
    displayInterestFrequencyChange: boolean = false;
    displayPrincipalFrequencyChange: boolean = false;
    displayPaymentDateChange: boolean = false;
    displayInterestPrincipalChange: boolean = false;

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

    entityName: string;
    displayLoanReviewList: boolean = false;
    displayBackToList: boolean = false;
    displayCustomerLoanDetails: boolean = false;
    displayLoanReviewOperationModal: boolean = false;
    termLoanId: number = null;
    approvedLoanReviewData: any[];
    selectedLoanReview: any = {};
    LoanReviewOperationForm: FormGroup;

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
    systemCurrentDate: any;
    lmsApplicationDetailId: number = 0;
    displayMaturityIntructionModal: boolean;
    displayInterestChangeModal: boolean;
    displayTenorChangeModal: boolean;
    displaySubAllocationChangeModal: boolean;
    systemDate: Date;
    displayAutomaticRolloverModal: boolean;
    totalTenor: number;
    newTenorLeft: number;
    hasNewMaturityDate:boolean;
    tenorLeft: number;

    interestRateChangeForm: FormGroup;
    tenorChangeForm: FormGroup;
    subAllocationForm: FormGroup;
    facilityAmountForm: FormGroup;
    approvalStatusData: any[];
    rollOverType: any;
    displayTwoFactorAuth: boolean;
    OPERATION_ID: number = 46;
    documentations: any[] = [];
    displayDocumentation: boolean = false;
    selectedloanReviewApplicationId: number;
    originalForm3800bSrc: any = {};


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
    @Output() displayOption: EventEmitter<any> = new EventEmitter<string>();
  reportSrc: SafeResourceUrl;


    constructor(
        private fb: FormBuilder,
        private loanSrv: LoanService,
        private loanOperationService: LoanOperationService,
        private loadingService: LoadingService,
        private casaService: CasaService,
        private customerService: CustomerService,
        private authService: AuthenticationService,
        private genSetupService: GeneralSetupService,
        private camService: CreditAppraisalService,
        private loanApplService: LoanApplicationService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private documentpUloadService: DocumentpUloadService, 
        private authorizationService: AuthorizationService
      ) {
        this.casaService
          .searchForAccount(this.searchAccountTerm$)
          .subscribe(results => {
            this.casaSearchResults = results.result;
          });
      }
    ngOnInit(): void {
        
        this.displayLoanReviewList = true;
        this.CASAAccountChange = false;
        this.clearControls();
        this.getAllApprovalStatus();

        const userInfo = this.authService.getUserInfo();
        this.systemDate = userInfo.applicationDate;
        this.getApprovedNonTermLoansForReview();
        this.displayOrHideControl = true;
    }

    getApprovedNonTermLoansForReview() { 
        this.loadingService.show();
        this.loanOperationService.getApprovedNonTermLoansForReviewAwaitingApproval().subscribe(results => {
          if(results.success){
            this.loadingService.hide();
            this.approvedLoanReviewData = results.result;
          }
          else{
            this.loadingService.hide();
          }
        }, (err) => {
            this.loadingService.hide(1000);
        });
      }

      closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }
      previewDocumentation(print=false) {
        this.loadingService.show();
        this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
            this.documentations = response.result;
            //this.loadingService.hide();
             if (print == false) this.displayDocumentation = true;
        }, (err) => {
            //this.loadingService.hide(1000);
        });
    }
    loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
      this.loadingService.show();
      this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
          .subscribe((response: any) => {
              let tempSrc = response.result;
              if (tempSrc != null) {
                  this.originalForm3800bSrc = tempSrc;
              }
              else this.originalForm3800bSrc = {};
              //this.loadingService.hide();
          }, (err) => {
              //this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

          });
  }
      getCustomerAccounts(customerId) {
        this.casaService
          .getAllCustomerAccountByCustomerId(customerId)
          .subscribe(response => {
            this.customerAccounts = response.result;
          });
      }

      onSelectedLoanReviewChange(event) {

        this.loadingService.show();

        this.selectedLoanReview = event.data;
        this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
        this.entityName = "Perform Loan Review Operation For: " + this.selectedLoanReview.customerName;
        this.GetOperationType();
        this.calculateNewTenor();
        this.termLoanId = this.selectedLoanReview.loanId;
        //this.loadOriginalForm3800BTemplate(this.selectedLoanReview.lmsApplicationReferenceNumber);
       // this.print(this.selectedLoanReview.lmsApplicationReferenceNumber);
        this.selectedloanReviewApplicationId = this.selectedLoanReview.loanReviewApplicationId;
        this.displayLoanReviewList = false;
        this.displayCustomerLoanDetails = true;
        this.displayBackToList = true;
        this.getAllUploadedDocument();

        this.loadingService.hide(50000)
      }

      GetOperationType() {
        this.loanOperationService.getOperationType(true).subscribe(results => {
          this.operationTypes = results.result;
          if(this.selectedLoanReview.productTypeId == ProductTypeEnum.CommercialLoans){
            if (this.selectedLoanReview.operationPerformed == "TenorChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.TenorExtension);
            }
            if (this.selectedLoanReview.operationPerformed == "InterestRateChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.InterestRateChange);
            }
            if (this.selectedLoanReview.operationPerformed == "AmountChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.FacilityLineAmountChange);
            }
            if (this.selectedLoanReview.operationPerformed == "CommercialLoanSubAllocation")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanSubAllocation);
            }
            if (this.selectedLoanReview.operationPerformed == "RollOver")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanRollOver);
            }
          }
          else{
            if (this.selectedLoanReview.operationPerformed == "TenorChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.TenorExtension);
            }
            if (this.selectedLoanReview.operationPerformed == "InterestRateChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.InterestRateChange);
            }
            if (this.selectedLoanReview.operationPerformed == "AmountChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.FacilityLineAmountChange);
            }
            if (this.selectedLoanReview.operationPerformed == "CommercialLoanSubAllocation")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanSubAllocation);
            }
            if (this.selectedLoanReview.operationPerformed == "RollOver")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanRollOver);
            }
          }
        });
      }


      showLoanReviewForm() {
       // this.loaddataForm(this.selectedLoanReview);
        this.displayLoanReviewOperationModal = true;
      }

      clearControls() {
        this.interestRateChangeForm = this.fb.group({
         valueDate: ['', Validators.required],
         newInterestRate: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
       });

       this.tenorChangeForm = this.fb.group({
         newTenor: ['',  Validators.compose([ValidationService.isNumber, Validators.required])],
         newMaturity: [''],
         actionType: ['',Validators.required],
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

       this.hasNewMaturityDate =false;
     }

      backToLoanReviewList() {
        this.displayLoanReviewList = true;
        this.displayCustomerLoanDetails = false;
        this.displayBackToList = false;
      }

      emitClose() {
        this.displayLoanReviewOperationModal = false;
        this.displayOption.emit('Close');
      }

      getOperation(id) {
        return this.casaService.getOperation(id);
      }

      pipe = new DatePipe('en-US');
      mdate: Date;
      calculateNewTenor() {
        let newTenor = this.selectedLoanReview.newTenor;

        let maturitydate = this.selectedLoanReview.maturityDate;
        var EXdate = new Date(maturitydate);
        EXdate.setDate( EXdate.getDate() + Number(this.selectedLoanReview.newTenor));
        this.totalTenor = 0;
        this.newTenorLeft = 0;

        this.tenorLeft = this.selectedLoanReview.tenor - this.selectedLoanReview.tenorUsed;
        this.totalTenor = Number(this.selectedLoanReview.tenor) + Number(this.selectedLoanReview.newTenor);
        this.newTenorLeft = Number(this.tenorLeft) + Number(this.selectedLoanReview.newTenor);

        this.tenorChangeForm.controls['newMaturity'].setValue(this.pipe.transform(EXdate,'dd/MMM/yyyy' ));
        this.hasNewMaturityDate = true;
      }

      onOperationTypeChange(event) {
        let caose = Number(event);
        if (event != undefined) {
          this.selectedLoanReview.loanReviewOperationTypeId = event;
        }

        if(event == LMSOperationEnum.InterestRateChange){
          this.displayLoanReviewOperationModal = false;
          this.displayTenorChangeModal = false;
          this.displaySubAllocationChangeModal = false;
          this.displayInterestChangeModal = true;
          this.displayMaturityIntructionModal = false;
          this.displayAutomaticRolloverModal = false;

        }

        if(event == LMSOperationEnum.TenorExtension){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displaySubAllocationChangeModal = false;
          this.displayTenorChangeModal = true;
          this.displayMaturityIntructionModal = false;
          this.displayAutomaticRolloverModal = false;

          this.calculateNewTenor();
        }
        if(event == LMSOperationEnum.CommercialLoanSubAllocation){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displayTenorChangeModal = false;
          this.displaySubAllocationChangeModal = true;
          this.displayMaturityIntructionModal = false;
          this.displayAutomaticRolloverModal = false;

        }
        if(event == LMSOperationEnum.CommercialLoanRollOver){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displayTenorChangeModal = false;
          this.displaySubAllocationChangeModal = false;
          if(this.selectedLoanReview.maturityDate < this.systemDate){
            this.displayAutomaticRolloverModal = true;
            this.displayMaturityIntructionModal = false;
          }
          else
          {
            this.displayMaturityIntructionModal = true;
            this.displayAutomaticRolloverModal = false;
          }

        }
        //this.displayLoanReviewOperationModal = false;
      }
  
      approveInterestRate(){
        this.displayLoanReviewOperationModal = true;
        this.operationtypeId=LMSOperationEnum.InterestRateChange;

      }

      approve() {
        this.displayLoanReviewOperationModal = true;
        this.operationtypeId=LMSOperationEnum.TenorExtension;
      }

      approveRollOver() {
        this.displayLoanReviewOperationModal = true;
        this.operationtypeId=LMSOperationEnum.CommercialLoanRollOver;
        this.rollOverType= "rollover";
      }

      approveAutoRollOver() {
        this.displayLoanReviewOperationModal = true;
        this.operationtypeId=LMSOperationEnum.CommercialLoanMaturityInstruction;
        this.rollOverType= "autoRollover";
      }

      promptToGoForApproval(formObj) {
        if(formObj.operationTypeId == LMSOperationEnum.Prepayment){
          this.authorizationService.enable2FAForLastApproval(formObj.operationTypeId
            , null, formObj.productId, 0).subscribe((res) => {
                if (res.result == true) {
                    this.displayTwoFactorAuth = true;
                } else {
                    this.goForApproval(formObj);
                }
            })
        }
        else this.goForApproval(formObj);
    }

      comment: any;
      approvalStatusId: number;
      goForApproval(formObj) { 
        let bodyObj = {
          targetId: this.selectedLoanReview.loanReviewOperationId,
          approvalStatusId: this.approvalStatusId,
          approvalLevelId: this.selectedLoanReview.currentApprovalLevelId,
          comment: this.comment,
          operationId: formObj.operationTypeId,
          rollOverType:this.rollOverType,
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
           __this.loanOperationService.loanOperationGoForApproval(bodyObj).subscribe((res) => {
            if (res.success == true) { 
              swal(
                'Fintrak Credit Credit 360',
                res.message,
                'success'
              );
              __this.getApprovedNonTermLoansForReview();
              __this.emitClose();
              __this.clearControls();
              __this.backToLoanReviewList();
              this.displayLoanReviewOperationModal = false;
              __this.loadingService.hide(1000);

            }
            else { 
              swal(
                'Fintrak Credit Credit 360',
                res.message,
                'error'
              )
            }
            __this.loadingService.hide();
          }, (err: any) => {
            swal(
              'Fintrak Credit Credit 360',
              JSON.stringify(err),
              'error'
            )
            __this.loadingService.hide();
        });
         });
      }


      getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
          let tempData = response.result;
          this.approvalStatusData = tempData.slice(2, 4);
        });
      }


      getAllUploadedDocument() {
        this.loadingService.show();
        let body = {
          loanApplicationId: this.selectedLoanReview.loanReviewApplicationId,
          loanApplicationNumber: this.selectedLoanReview.lmsApplicationReferenceNumber,
          loanReferenceNumber: this.selectedLoanReview.loanReferenceNumber,
          databaseTable: 8,
        }

      
        this.documentpUloadService.getAllUploadedDocument(body).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            ////this.loadingService.hide();
        }, (error) => {
            //this.loadingService.hide(1000);
        });
      }
    
      binaryFile: string;
      selectedDocument: string;
      displayDocument: boolean = false;
      myPdfFile: any;
    
      viewDocument(row) {
          this.loadingService.show();
          this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
              this.binaryFile = response.result.fileData;
              this.selectedDocument = response.result.documentTitle;
              this.displayDocument = true;
              //this.loadingService.hide();
          }, (error) => {
              //this.loadingService.hide(1000);
          });
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
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
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
        });
    }
    
    }


