import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LoadingService } from '../../services/loading.service';
import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ReportService } from '../../../reports/service/report.service';

import { TabViewModule, PanelModule, AccordionModule } from 'primeng/primeng';
import swal from 'sweetalert2';
import { GlobalConfig, LoanApplicationStatus, ApprovalStatus, AppConstant, ProductProcessEnum } from '../../constant/app.constant';
import { ApprovalService } from '../../../setup/services';
import { PrintService } from '../../services/print.service';
import { PrintModel } from '../../models/print-model';

@Component({
  styles: [` 
        .btn-move {
            margin-right: 5px;
        }
        #offerLetter .removeConditions_OL {
            display: none;
        }
        .conditionsTable_OL {
            width: 100%; overflow-x:auto;
        }
        @media screen 
        {
            #print-section {display: none;}
        }
        
        @media print 
        {
            #print-section {display: block; margin-top: 0px;
        }
    `],
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
})
export class OfferLetterComponent implements OnInit {

  isFinalOfferLetter: boolean;
  applicationRefNo: string;
  applications: any[];
  applicationSelection: any;
  signatories: string;
  existingLoans: any[];
  displayGeneratedLetter = false;
  selectedCustomer: any = {};
  displayOfferLetter = false;
  reportSrc: any = {};
  activeIndex = 0;
  displayLoanDetails = false;
  editMode = false;
  offerLetterData: any[] = [];
  docTemplateObj: any = {};
  form3800bSrc: any = {};
  originalForm3800bSrc: any = {};
  camDocuments: any[] = [];
  creditAnalystDocument: any = {};  disableCommitteeTabs: boolean = true;
  bccDocument: any = {};
  mccDocument: any = {};
  generatedLetter: string;
  showEditOfferLetterButton: any;
  approvalWorkflowData: any[] = [];
  disableApprovalBtn = true;
  displayWorkflowModal = false;
  printDocument: any; isCAMBased: boolean;
  displayLetterAcceptanceModal: boolean = false;
  rmComment: string;
  offerLetterAccepted: boolean = false;
  selectedRecord: any = {};

      // REFER BACK

      trail: any[] = [];
      forwardAction: number = 0;
      trailId: number = 0;
      receiverLevelId: number = null;
      receiverStaffId: number = null;
      readonly CAM_OPERATION_ID: number = 6;
      backtrail: any[] = [];
      displayTestReport: boolean; displayReport: boolean;reportSrcv: SafeResourceUrl;

  private readonly OFFERLETTER_OPERATIONID = 37;
    reportSource: SafeResourceUrl;

  constructor(
      private fb: FormBuilder,
      private loanApplService: LoanApplicationService, 
      private _creditApprServ: CreditAppraisalService,
      private loadingService: LoadingService, 
      private reportService: ReportService, 
      private _approvalService: ApprovalService,
      private printService: PrintService,
      private reportServ: ReportService,
      private sanitizer: DomSanitizer,
      private camService: CreditAppraisalService,


  ) {

  }

  ngOnInit() {
      this.loadingService.show();
      this.getApprovedLoanApplications(); 
      this.getAllSavedOfferLetters();
     this.generateOfferLetter()
  }

  indicateLetterAcceptance() {
      this.getTrail();
      this.displayLetterAcceptanceModal = true;
  }

  // REFER BACK

  getTrail() {
      this.loadingService.show();
      this.camService.getTrail(this.selectedCustomer.loanApplicationId, this.CAM_OPERATION_ID).subscribe((response: any) => {
          this.trail = response.result;
          this.referBackTrail();
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      });
  }

  onTargetStaffLevelChange(trailId) {
      let selected = this.trail.find(x => x.approvalTrailId == trailId);
      if (selected != null) {
          this.receiverStaffId = selected.requestStaffId;
          this.receiverLevelId = selected.fromApprovalLevelId;
      }
  }

  referBackTrail(): any {
      this.trail.forEach(x => { 
          if (
              this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId && t.requestStaffId == x.requestStaffId
          ) == null && x.fromApprovalLevelId != null) {
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


  getApprovedLoanApplications() {
      this._creditApprServ.getApprovedCamProcessedLoanApplications().subscribe((res) => {
          let temp = res.result;
          this.existingLoans = res.result;
          this.loadingService.hide();
      }, (err) => {
      });
  }

  getAllSavedOfferLetters() {
      this.loanApplService.getAllFinalOfferLetters().subscribe((res) => {
          this.offerLetterData = res.result;
      }, (err) => {
      });
  }


  sendApplicationForReview() {
      this.loadingService.show();

      const obj = {
          comment: this.rmComment,
          applicationReferenceNumber: this.selectedRecord.applicationReferenceNumber,
          productId: '',
          isAccepted: false,
          applicationStatusId: LoanApplicationStatus.ApplicationUnderReview,
          applicationId: this.selectedCustomer.loanApplicationId,
          trailId: this.trailId,
      };

      const target = this.selectedRecord;

      this.loanApplService.referBackForReview(obj).subscribe((res) => {
              if (res.success === true) {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, 'Application has been sent for further review', 'success');
                  this.displayLoanDetails = false;
                  this.displayLetterAcceptanceModal = false;
                  this.rmComment = '';
                  this.getApprovedLoanApplications();
              } else {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
              }
              this.loadingService.hide();
          }, (err) => {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
          });
  }

  

  viewApplicationDetails(target, evt) {
      evt.preventDefault();
    
      this.displayLoanDetails = true;
      this.selectedCustomer = target;
      this.applicationRefNo = target.applicationReferenceNumber;
      this.loadingService.show();
      this.generateOfferLetter()
      this.loanGenerateFinalOfferLetter(this.selectedCustomer.loanApplicationId);
      if (this.offerLetterData.length > 0) {
          this.docTemplateObj = this.offerLetterData.find(x => x.applicationReferenceNumber == target.applicationReferenceNumber);

          if (this.docTemplateObj != null) {
              this.form3800bSrc = this.docTemplateObj;
          } else {
              this.loadPreparedForm38BTemplate(target.applicationReferenceNumber);
          }
      }
      else {
          this.loadPreparedForm38BTemplate(target.applicationReferenceNumber);
      }

      if (target.productClassProcessId == ProductProcessEnum.CAMBased) {
      
          this.isCAMBased = true;
      } else {
      
          this.isCAMBased = false;
      }

      //this.loadPreparedOfferLetter(target.applicationReferenceNumber);

      target.camDocuments.map(element => {
          this.camDocuments.push(element);
      });

      if (this.camDocuments.length > 0) {
          const docLength = this.camDocuments.length;
          if ( docLength > 4) { // meaning it got to mcc & bcc level 
              this.creditAnalystDocument = this.camDocuments[docLength - 2];
              this.mccDocument = this.camDocuments[docLength - 1];
              this.bccDocument = this.camDocuments[docLength - 1];
              this.disableCommitteeTabs = false;
          } else {
          this.creditAnalystDocument = this.camDocuments[docLength - 1];
          }
      }

      this.loadingService.show();
    //   this._creditApprServ.updateApplicationStatus(target.applicationReferenceNumber,
    //       LoanApplicationStatus.OfferLetterGenerationInProgress, target).subscribe((res) => {
    //           if (res.success === true) {
    //               this.loadingService.hide();
    //               this.displayLoanDetails = true;
    //           }
    //       }, (err) => {
    //           this.loadingService.hide();
    //           swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    //       });
      this.displayLoanDetails = true;

      let dataObj = this.selectedCustomer;
      this._approvalService.getApprovalTrailByOperation(this.OFFERLETTER_OPERATIONID, dataObj.loanApplicationId).subscribe((res) => {
          this.approvalWorkflowData = res.result;
          if (this.approvalWorkflowData.length > 0) this.disableApprovalBtn = false;
      });
    
  }

  generateOfferLetter() {
      this.loadingService.show();
      this.displayGeneratedLetter = true;
      this.loadingService.hide(3000);
  }
  loanGenerateFinalOfferLetter(applicationReferenceNumber){
      this.loanApplService.getFinalOfferLetterByLoanAppId(applicationReferenceNumber)
      .subscribe((response: any) => {
          let tempSrc = response.result;
     this.isFinalOfferLetter = tempSrc.isFinal 
  });
}
  generateFinalOfferLetter(evt){
      let ref = this.applicationRefNo;
      let body  = {
          isFinal: evt,
          documentId: this.reportSrc.documentId,
          comments: '',
          documentTemplate: this.form3800bSrc.documentTemplate,
          applicationReferenceNumber: ref,
          productClassId: this.reportSrc.productClassId,
          productId: '',
          isAccepted: false,
          applicationStatusId: LoanApplicationStatus.OfferLetterGenerationCompleted,
          approvalStatusId: ApprovalStatus.PROCESSING
      }
      this._creditApprServ.update(body, this.selectedCustomer.loanApplicationId).subscribe((res) => {
       });
  }

  loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
      this.loadingService.show();
      this.loanApplService.getForm3800Template(applicationReferenceNumber)
          .subscribe((response: any) => {
              let tempSrc = response.result;
              if (tempSrc != null) {
                  this.originalForm3800bSrc = tempSrc;
              }
              else this.originalForm3800bSrc = {};
              this.loadingService.hide();
          }, (err) => {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
          });
    }
    
  loadPreparedForm38BTemplate(applicationReferenceNumber: string) {
      this.loadingService.show();
      this.loanApplService.getForm3800Template(applicationReferenceNumber)
          .subscribe((response: any) => {
              let tempSrc = response.result;
              if (tempSrc != null) {
                  this.form3800bSrc = tempSrc;
              }
              else this.form3800bSrc = {};
              this.loadingService.hide();
          }, (err) => {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
              ////console.log('error', err);
          });
  }


  loadPreparedOfferLetter(applicationReferenceNumber: string) {
      this.loanApplService.generateOfferLetterTemplate(applicationReferenceNumber)
          .subscribe((response: any) => {
              let tempSrc = response.result;
              this.generatedLetter = tempSrc.documentTemplate;
              
              this.loadingService.hide();
          }, (err) => {
              this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
             
          });
  }

  sendToReview(dataObj, evt) {
      evt.preventDefault();

      const __this = this;

      let target = dataObj;

      const obj = {
          documentId: this.reportSrc.documentId,
          comments: '',
          documentTemplate: this.reportSrc.documentTemplate,
          applicationReferenceNumber: target.applicationReferenceNumber,
          productClassId: target.productClassId,
          productId: '',
          isAccepted: false,
          applicationStatusId: LoanApplicationStatus.OfferLetterGenerationCompleted,
          approvalStatusId: ApprovalStatus.PROCESSING
      };
/*        const obj = {
          documentId: this.form3800bSrc.documentId,
          comment: this.rmComment,
          documentTemplate: this.form3800bSrc.documentTemplate,
          applicationReferenceNumber: target.applicationReferenceNumber,
          productId: '',
          // isAccepted: this.offerLetterAccepted,
          applicationStatusId: LoanApplicationStatus.OfferLetterReviewCompleted,
          approvalStatusId: this.decisionStatusId
      };*/


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
          __this.loanApplService.logOfferLetterDecisionForApproval(obj).subscribe((res) => {
              __this.loadingService.hide();
              if (res.success === true) {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                  __this.getApprovedLoanApplications();
                  __this.displayLoanDetails = false;
              } else {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
              }
          }, (err) => {
              __this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
          });

          if (__this.editMode == false && __this.form3800bSrc != null) {
              let bodyObj = {
                  documentTemplate: __this.form3800bSrc.documentTemplate,
                  applicationReferenceNumber: __this.selectedCustomer.applicationReferenceNumber,
                  productId: '',
                  comments: '',
                  isAccepted: false
              };

              __this.loanApplService.saveFinalOfferLetter(bodyObj).subscribe((response: any) => {
                  if (response.success === true) {
                  } else {
                  }
              }, (err) => {
                  __this.loadingService.hide();
                  swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
              });
          }
      }, function (dismiss) {
          if (dismiss === 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });
  }

  closeDetailsPanel() {
      this.selectedCustomer = '';
      this.activeIndex = 0;
      this.displayGeneratedLetter = false;
      this.displayLoanDetails = false;
  }

  handleChange(evt) {
      this.activeIndex = evt.index;
  }

  next() {
      this.activeIndex = (this.activeIndex === 4) ? 0 : this.activeIndex + 1;

  }

  prev() {
      this.activeIndex = (this.activeIndex === 0) ? 2 : this.activeIndex - 1;
  }

  editDocument() {
      this.loadingService.show();
      this.loadingService.hide(5000);
      this.editMode = true;
  }

  saveChanges() {
      const __this = this;

      let bodyObj = {
          documentTemplate: this.form3800bSrc.documentTemplate,
          applicationReferenceNumber: this.selectedCustomer.applicationReferenceNumber,
          productId: '',
          comments: '',
          isAccepted: true,
          saveOnly: true
      };

      swal({
          title: 'Save changes to document',
          text: 'Are you sure about this?',
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
          __this.loanApplService.saveFinalOfferLetter(bodyObj).subscribe((response: any) => {
              __this.loadingService.hide();
              if (response.success === true) {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                  __this.editMode = false;
                  __this.getApprovedLoanApplications();
              } else {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
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

  
  

  popoverSeeMore() {
      if (this.selectedCustomer.applicationReferenceNumber!= null) {
         
          this.displayTestReport = false;
          this.displayReport = false;
          let path = '';
          const data = {
              applicationRefNumber: this.selectedCustomer.applicationReferenceNumber,

          }
           
          this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                  path = response.result;
                  
                  this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                  this.displayTestReport = true;
                  
              });
          this.displayReport = true;
          return;
      }
  }

  print(content): void {
        const printObj: PrintModel = {
            htmlDocument: content,
            htmlStyles: `
            .removeConditions_OL {
                display: none;
            }`
        }
        this.printService.printDocument(printObj);
    }

  form3800b(applicationReferenceNumber): void {
    if (applicationReferenceNumber != null) {
        let path = '';
        const data = {
            applicationRefNumber:applicationReferenceNumber,

        }

        this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
            path = response.result;
            this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
            this.displayTestReport = true;
        });
       
        return;
    }
   
}
}
