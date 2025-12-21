import { AdminService } from '../../../../admin/services/admin.service';
import { LoanOperationService } from '../../../../credit/services/loan-operations.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ApprovalService } from '../../../../setup/services/approval.service';
import { LoanService } from '../../../../credit/services/loan.service';
import { GeneralSetupService } from '../../../../setup/services/general-setup.service';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus, ProductTypeEnum, LoanSystemTypeEnum, ApprovalStatusEnum } from '../../../../shared/constant/app.constant';
import { AuthorizationService, AuthenticationService } from '../../../../admin/services';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ReportService } from 'app/reports/service/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LMSOperationEnum } from 'app/shared/constant/app.constant';
import { ValidationService } from 'app/shared/services/validation.service';
//import { OtherLoansReviewOperationEnum } from 'app/credit/loan-management/facility-line-operations/line-operation.component';
import { commercialPaperSubAllocationSource } from 'app/credit/models/commercial-paper';
import { DatePipe } from '@angular/common';
import { CreditAppraisalService, LoanReviewApplicationService } from 'app/credit/services';
import { saveAs } from 'file-saver';

import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
@Component({
    templateUrl: 'take-fee-approval.component.html'
})
export class TakeFeeApprovalComponent implements OnInit {
  twoFactorAuthStaffCode: string = null;
  twoFactorAuthPassCode: string = null;
    totalOutstanding: number;
    operationtype: any;
    pastDue: number;
    allScheduleTypes: any[];
    terminalAndRebook: boolean;
    displayInterestRate: boolean = false;
    displayRestructure: boolean = false;
    isOverDraft: boolean = false;
  
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
    convenatDetails: any[];
    guarantorDetails: any[];
    chargeFeeDetails: any[];
    entityName: string;
    displayLoanReviewList: boolean = false;
    displayBackToList: boolean = false;
    displayCustomerLoanDetails: boolean = false;
    displayLoanReviewOperationModal: boolean = false;
    termLoanId: number = null;
    loanTakFeeApprovalData: any[];
    selectedLoanReview: any = {};
    LoanReviewOperationForm: FormGroup;
    displayTenorApprovalModal: boolean = false;

    displayCasaDetails: boolean = false;
    model: any;
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
    hasNewMaturityDate:boolean;
    tenorLeft: number;
    displayTwoFactorAuth: boolean = false;
    twoFactorAuthEnabled: boolean = false;
    loanGridRecordSelected: boolean;
    selectedReferenceNumber: any;
    subAllocationPrincipalAmount: number;
    allSelectedPrincipalAmount: number = 0;
    gridEditted: boolean;
    showFirstGrid: any;
    loanViewSelectionForSubAllocation: any;
    isGroup: boolean;
    sourceValues:commercialPaperSubAllocationSource []=[];
    subAllocatedRecord:commercialPaperSubAllocationSource []=[];
    approvalStatusData: any[];
comment: any;
approvalStatusId: number;
OPERATION_ID: number = 46;
documentations: any[] = [];
displayDocumentation: boolean = false;
selectedloanReviewApplicationId: number;
originalForm3800bSrc: any = {};
  reportSource: SafeResourceUrl;

  contingentFacility: boolean =false;

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

loanSelectedData: any = {};
loanSelection: any;
approvalWorkflowData: any[];
loanSystemTypeId: any;
loanId: any;
type: any ;
displayManualFeeApprovalModal: boolean = false;


    constructor(private loadingService: LoadingService, private fb: FormBuilder, private loanApplService: LoanApplicationService,
        private loanOperationService: LoanOperationService, private loanService: LoanService, private genSetupService: GeneralSetupService,
        private approvalService: ApprovalService,  private documentpUloadService: DocumentpUloadService,   private camService: CreditAppraisalService,private router: Router, private authService: AuthenticationService,
        private authorizationService: AuthorizationService, private reportServ: ReportService, private sanitizer: DomSanitizer, private reviewService: LoanReviewApplicationService,
        ) {
    }


    ngOnInit(): void {

        const userInfo = this.authService.getUserInfo();
        this.systemDate = userInfo.applicationDate;
        //this.username = userInfo.userName;
        this.loadingService.show();
        this.displayLoanReviewList = true;
        this.CASAAccountChange = false;
        this.getTakeFeeAwaitingApproval();
        this.clearControls();
        this.displayOrHideControl = true;
        //this.GetOperationType();
        this.getAllApprovalStatus();
        this.loadingService.hide();

    }
    viewLoanDetails(index, evt) {
        evt.preventDefault();
        this.loanSelectedData = {};
        this.loanSelectedData = index;
        this.loanSelectedData.approvalStatusId = "";
        let dataObj = this.loanSelectedData;

        this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.loanId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
        });

        this.selectedloanReviewApplicationId = this.loanSelectedData.loanReviewApplicationId;
let facilityType = this.loanSelectedData.loanSystemTypeId;
this.loanSystemTypeId = facilityType;
this.loanId = dataObj.loanId;

if(facilityType==LoanSystemTypeEnum.ContingentFacility)
{
    this.contingentFacility=true;
}
else{
    this.contingentFacility = false;
}
        //this.getSupportingDocumentsByRefNum(dataObj.preliminaryEvaluationCode);
        ////console.log('this.loanSelectedData.operationTypeId', this.loanSelectedData.operationTypeId);
        let event = this.loanSelectedData.operationTypeId;
        let type = this.loanSelectedData.scheduleDayInterestTypeId;
if (type = 0)
{
this.type = "First Day Interest";
}
else
{
    this.type = "Second Day Interest";
}
   
        this.getAllUploadedDocument();

        this.displayManualFeeApprovalModal = true;
    }
  
    hideModal() {
        this.displayManualFeeApprovalModal = false;
    }
    closeDocumentation() {
      this.displayDocumentation = false;
      this.documentations = [];
  }
    previewDocumentation(print=false) {
      this.loadingService.show();
      this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response) => {
          this.documentations = response.result;
          ////console.log('getDocumentation -> ', response);
          this.loadingService.hide();
           if (print == false) this.displayDocumentation = true;
      }, (err) => {
          this.loadingService.hide(1000);
      });
  }
  getTakeFeeAwaitingApproval() {
        this.reviewService.getTakeFeeAwaitingApproval().subscribe(results => {
          this.loanTakFeeApprovalData = results.result;
        }); 
      }
      backToLoanReviewList() {
        this.displayLoanReviewList = true;
        this.displayCustomerLoanDetails = false;
        this.displayBackToList = false;
        this.displayTenorChangeModal = false;
        this.displayInterestChangeModal = false;
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
   
       //this.interestRateChangeForm.controls['valueDate'].setValue(this.systemDate | date);
       this.hasNewMaturityDate =false;
     }
     loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
      this.loadingService.show();
      this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
          .subscribe((response) => {
              let tempSrc = response.result;
              if (tempSrc != null) {
                  this.originalForm3800bSrc = tempSrc;
              }
              else this.originalForm3800bSrc = {};
              this.loadingService.hide();
          }, (err) => {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
              ////console.log('error', err);
          });
  }
     onSelectedLoanReviewChange(event) {
        this.selectedLoanReview = event.data;
        this.systemCurrentDate = this.selectedLoanReview.systemCurrentDate;
        this.entityName =
          "Perform Loan Review Operation For: " +
          this.selectedLoanReview.customerName;
        this.GetOperationType();
        this.termLoanId = this.selectedLoanReview.loanId;
      //  this.loadOriginalForm3800BTemplate(this.selectedLoanReview.lmsApplicationReferenceNumber);
     //   this.print(this.selectedLoanReview.lmsApplicationReferenceNumber);

        this.selectedloanReviewApplicationId = this.selectedLoanReview.loanReviewApplicationId;

        ////console.log("Choice Line Data", this.selectedLoanReview);
        this.displayLoanReviewList = false;
        this.displayCustomerLoanDetails = true;
        this.displayBackToList = true;
      }
      GetOperationType() {
        this.loanOperationService.getOperationType(true).subscribe(results => {
          this.operationTypes = results.result;
          if(this.selectedLoanReview.productTypeId == ProductTypeEnum.CommercialLoans){
            if (this.selectedLoanReview.reviewDetails == "TenorChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.TenorExtension);
            }
            if (this.selectedLoanReview.reviewDetails == "InterestRateChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.InterestRateChange);
            }
            if (this.selectedLoanReview.reviewDetails == "AmountChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.FacilityLineAmountChange);
            }
            if (this.selectedLoanReview.reviewDetails == "CommercialLoanSubAllocation")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanSubAllocation);
            }
            // this.operationTypes = this.operationTypes
            // .filter
            // ( x=>
            //   x.operationTypeId == LMSOperationEnum.TenorChange ||
            //   x.operationTypeId == LMSOperationEnum.InterestRateChange ||
            //   x.operationTypeId == LMSOperationEnum.CommercialLoanSubAllocation ||
            //   x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange
            // )
          }
          else{
            if (this.selectedLoanReview.reviewDetails == "TenorChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.TenorExtension);
            }
            if (this.selectedLoanReview.reviewDetails == "InterestRateChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.InterestRateChange);
            }
            if (this.selectedLoanReview.reviewDetails == "AmountChange")
            {
                this.onOperationTypeChange(LMSOperationEnum.FacilityLineAmountChange);
            }
            if (this.selectedLoanReview.reviewDetails == "CommercialLoanSubAllocation")
            {
                this.onOperationTypeChange(LMSOperationEnum.CommercialLoanSubAllocation);
            }
            // this.operationTypes = this.operationTypes
            // .filter
            // ( x=>
            //   x.operationTypeId == LMSOperationEnum.TenorChange ||
            //   x.operationTypeId == LMSOperationEnum.InterestRateChange ||
            //   x.operationTypeId == LMSOperationEnum.FacilityLineAmountChange
            // )
          }
        });
      }
      pipe = new DatePipe('en-US');
      mdate: Date;
      calculateNewTenor(tenor) {
        let newTenor = tenor;
    
        if(newTenor <= 0){
          swal(
            'Fintrak Credit 360',
            'Tenor must be greater than zero.',
            'warning'
          );
          return;
        } 
        let maturitydate = this.selectedLoanReview.expiryDate;
        var EXdate = new Date(maturitydate);
        EXdate.setDate( EXdate.getDate() + Number(newTenor));
      
        this.totalTenor = 0;
        this.newTenorLeft = 0;
    
        this.tenorLeft = this.selectedLoanReview.approvedTenor - this.selectedLoanReview.tenorUsed;
        this.totalTenor = Number(this.selectedLoanReview.approvedTenor) + Number(newTenor);
        this.newTenorLeft = Number(this.tenorLeft) + Number(newTenor);
    
        this.tenorChangeForm.controls['newMaturity'].setValue(this.pipe.transform(EXdate,'dd/MMM/yyyy' ));
        this.hasNewMaturityDate = true;
      }
      onOperationTypeChange(event) {
        let caose = Number(event);
        if (event != undefined) {
          this.selectedLoanReview.loanReviewOperationTypeId = event;
        }
        //this.enableDisableControl(caose);
    
        if(event == LMSOperationEnum.InterestRateChange){
          this.displayLoanReviewOperationModal = false;
          this.displayTenorChangeModal = false;
          this.displaySubAllocationChangeModal = false;
          this.displayFacilityLineAmountChangeModal = false;
          this.displayInterestChangeModal = true;
        }
        
        if(event == LMSOperationEnum.TenorExtension){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displaySubAllocationChangeModal = false;
          this.displayFacilityLineAmountChangeModal = false;
          this.displayTenorChangeModal = true;
          this.calculateNewTenor(this.selectedLoanReview.tenor);
        }
    
        if(event == LMSOperationEnum.FacilityLineAmountChange){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displaySubAllocationChangeModal = false;
          this.displayFacilityLineAmountChangeModal = true;
          this.displayTenorChangeModal = false;
        }
    
        if(event == LMSOperationEnum.CommercialLoanSubAllocation){
          this.displayLoanReviewOperationModal = false;
          this.displayInterestChangeModal=false;
          this.displayFacilityLineAmountChangeModal = false;
          this.displayTenorChangeModal = false; ////console.log('loanApplicationDetailId',this.selectedLoanReview.loanApplicationDetailId)
          this.getCommercialLoanByApplicationDetailId(this.selectedLoanReview.loanApplicationDetailId);
          this.displaySubAllocationChangeModal = true;
    
        }
        //this.displayLoanReviewOperationModal = false;
      }
      pushToGrid(data){ 
        if(data != null && data != undefined){
          data.forEach(item => {
            var selectedSource = {
              customerId : item.customerId,
              loanReferenceNumber : item.loanReferenceNumber,
              principalAmount : item.principalAmount,
              newPrincipalAmount : item.principalAmount,
              currencyCode: item.currencyCode,
            }; ////console.log('selectedSource',selectedSource);
            this.sourceValues.push(selectedSource);
          });
        }
      }
      getCommercialLoanByApplicationDetailId(loanId) {
        this.loanOperationService.getCommercialLoanByApplicationDetailId(loanId).subscribe(response => {
          var data = response.result; 
          if(data != null) this.pushToGrid(data);
          this.sourceValues.slice;
          this.sumPrincipals();
          this.sumNewPrincipals();
          this.toggleSubAllocationGrid();
        });
      }
      toggleSubAllocationGrid(){
        if(this.showFirstGrid) this.showFirstGrid =false;
        else this.showFirstGrid =true;
      }
      sumPrincipals(){
        let pAmount = this.allSelectedPrincipalAmount;
        this.allSelectedPrincipalAmount = 0;
        this.sourceValues.forEach(obj =>{ this.allSelectedPrincipalAmount = pAmount + obj.principalAmount; })
      }
    
      sumNewPrincipals(){
        var newPAmount = 0;
        this.sourceValues.forEach(obj =>{ newPAmount = newPAmount + obj.newPrincipalAmount; })
        this.subAllocationPrincipalAmount = newPAmount;
      }
      getAllApprovalStatus(): void {
        this.genSetupService.getApprovalStatus().subscribe((response) => {
          let tempData = response.result;
          this.approvalStatusData = tempData.slice(2, 4);
        });
      }

      approve(index, evt) {
        this.displayLoanReviewOperationModal = true;
        this.operationtype=LMSOperationEnum.TenorExtension;
      }
      approveamountchange(){
        this.displayLoanReviewOperationModal = true;
        this.operationtype=LMSOperationEnum.FacilityLineAmountChange;

      }
      approveInterestRate(){
        this.displayLoanReviewOperationModal = true;
        this.operationtype=LMSOperationEnum.InterestRateChange;

      }

      goForApproval() {


        let bodyObj = {
          targetId: this.loanSelectedData.loanChargeFeeId,
          approvalStatusId: this.approvalStatusId,
          comment: this.comment,
            operationId: this.loanSelectedData.operationId,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode
        };
        //console.log(bodyObj);
        this.loadingService.show();
        this.reviewService.takeFeeGoForApproval(bodyObj).subscribe((response) => {
          //this.loadingService.hide(1000);
            this.twoFactorAuthPassCode = null;
            this.twoFactorAuthStaffCode = null;
            this.displayTwoFactorAuth = false;
            if (response.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.loadingService.hide(1000);
              this.getTakeFeeAwaitingApproval();
              this.clearControls();
              this.backToLoanReviewList();
                this.displayManualFeeApprovalModal = false;
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                this.displayManualFeeApprovalModal = true;
            }
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }



      changeApplicationLineInterestRate(formObj) {
        this.loadingService.show();
        let bodyObj = 
        {
          newRate: formObj.value.newInterestRate,
          loanApplicationDetailId : this.selectedLoanReview.loanApplicationDetailId,
          valueDate : formObj.value.valueDate
        }
    
        this.loanOperationService.changeApplicationLineInterestRate(bodyObj).subscribe((res) => {
          if (res.success == true) { ////console.log('success',res);
          swal(
            'Fintrak Credit Credit 360',
            res.message,
            'success'
          )
          this.getTakeFeeAwaitingApproval();
          this.clearControls();
          this.backToLoanReviewList();
          } 
          else { ////console.log('failure',res)
          swal(
            'Fintrak Credit Credit 360',
            res.message,
            'error'
          )
        }
        this.loadingService.hide();
        }, (err: any) => {
          swal(
            'Fintrak Credit Credit 360',
            JSON.stringify(err),
            'error'
          )
          this.loadingService.hide();
        });
      }


      print(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.printLMSForm3800B(data.applicationRefNumber).subscribe((response) => {
                path = response.result;
                ////console.log(path);
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            });
            //this.displayReport = true;
            return;
        }
       
    }

      getAllUploadedDocument() {
        this.loadingService.show();
        let body = {
          loanApplicationId: this.selectedLoanReview.loanReviewApplicationId,
          loanApplicationNumber: this.selectedLoanReview.lmsApplicationReferenceNumber,
          loanReferenceNumber: this.selectedLoanReview.loanReferenceNumber,
          databaseTable: 8,
        }
        //console.log("body",body);
      
        this.documentpUloadService.getAllUploadedDocument(body).subscribe((response) => {
            this.supportingDocuments = response.result;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
      }
    
      binaryFile: string;
      selectedDocument: string;
      displayDocument: boolean = false;
      myPdfFile: any;
    
      viewDocument(row) {
          this.loadingService.show();
          this.documentpUloadService.getUploadedDocument(row).subscribe((response) => {
              this.binaryFile = response.result.fileData;
              this.selectedDocument = response.result.documentTitle;
              this.displayDocument = true;
              this.loadingService.hide();
          }, (error) => {
              this.loadingService.hide(1000);
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
        });
    }

    promptToGoForApproval() {
      const __this = this;
      swal({
          title: 'Are you sure?',
          text: 'You want to proceed disbursing this loan.',
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
          __this.authorizationService.enable2FAForLastApproval(99,null,null,0).subscribe((res) => {
                  if (res.result == true) {
                      __this.displayTwoFactorAuth = true;
                      __this.loadingService.hide();
                  } else {
                      __this.goForApproval();
                      //__this.loadingService.hide();
                  }
                 // __this.loadingService.hide(1000);

              }, (err) => {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
                  __this.loadingService.hide();
              });
              __this.loadingService.hide(30000);
      }, function (dismiss) {
          if (dismiss === 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });
  }



 
  cancelApproval() {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
      //this.displayConfirmDialog = false;
      this.displayManualFeeApprovalModal = false;
  }
}