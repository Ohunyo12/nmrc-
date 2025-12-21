import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { DocumentService } from '../../../setup/services/document.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprovalStatus, GlobalConfig, ProductProcessEnum } from '../../../shared/constant/app.constant';
import { ProductService } from '../../../setup/services/product.service';
import { LoanService } from '../../services/loan.service';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomerInformationDetailComponent } from '../../../customer/components/customer/customer-information-detail/customer-information-detail.component';
import { LoanApplicationDetailsViewComponent } from '../loan-application-details-view/loan-application-details-view.component';

import swal from 'sweetalert2';
import { LoanApplicationStatus } from 'app/credit/models/loan-application-status';
import { ReportService } from 'app/reports/service/report.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ApprovalService } from 'app/setup/services/approval.service';


@Component({
    // styleUrls: ['credit.appraisal.style.scss'],
    templateUrl: 'bonds-and-guarantee.component.html'
})

export class BondsAndGuaranteeComponent implements OnInit {
  loanApplicationId: number = null;
    BANDG_OPERATION_ID: number = 37;
    BANDG_PRODUCT_CLASS_ID: number = 10;
    selectedId: number = null;
    
    feedback: string = null;
    commentLabel: string = 'Recommendation';
    errorMessage: string = '';
    // applications: any[];
    products: any[] = [];
    departments: any[] = [];
    conditions: any[] = [];
    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    lineSelection: any;
    workingLoanApplication: string = null;
    disableApplicationInformationTab = true;
    // disableAppraisalMemorandumTab: boolean = true;
    disableSupportingDocumentsTab: boolean = true;
    disableBandGDocumentTab: boolean = true;
     disableAOfferLetterTab: boolean = true;
    userDepartmentId = 0;

    useCkeditor: boolean = true; // from SETTINGS
    autoLoadAnalystTemplate: boolean = true; // SETTINGS
    
    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    
    formState: string = 'New';
    
    productPrograms: any[] = [];
    applications: any[] = [];

    form3800bSrc: any = {};
    applicationRefNo: string;
    reportSrc: any = {};
    originalForm3800bSrc: any = {};
    offerLetterData: any[] = [];
    docTemplateObj: any = {};
    camDocuments: any[] = [];
    creditAnalystDocument: any = {}; disableCommitteeTabs: boolean = true;
    bccDocument: any = {};
    mccDocument: any = {};
    generatedLetter: string;
    readonly CAM_OPERATION_ID: number = 6;
    readonly OPERATION_ID: number = 37;
    approvalWorkflowData: any[] = [];
    
        @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
        @ViewChild(LoanApplicationDetailsViewComponent , {static: false}) loanInfo: LoanApplicationDetailsViewComponent;
    displayTestReport: boolean;
    displayReport: boolean;
    displayGeneratedLetter: boolean;
    isFinalOfferLetter: any;
    isCAMBased: boolean;
    displayLoanDetails: boolean;
    disableApprovalBtn: boolean;
    reportSource: SafeResourceUrl;
        

    constructor(
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private documentService: DocumentService,
        private productService: ProductService,
        private loanService: LoanService,
        private loanApplService: LoanApplicationService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private _approvalService: ApprovalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
        this.getLoanApplications();
    }
    
    getLoanApplications(): void {
      this.loadingService.show();
      this.camService.getLoanApplications(this.BANDG_OPERATION_ID, this.BANDG_PRODUCT_CLASS_ID).subscribe((response: any) => { // --------------------- refactor!!!
          this.applications = response.result;
          ////console.log('applications..', response);
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      });
    }

    loadDropdowns() {
        this.camService.getProductPrograms().subscribe((response: any) => { // make refreshable
            this.productPrograms = response.result;
            ////console.log('product program..', response);
        });
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
    }

    onSelectedApplicationChange(): void {
        const applicationId = this.applicationSelection.loanApplicationId;
        this.loanApplicationId = applicationId;
        this.customerInfo.loadLoanCustomerList(applicationId);

        this.loanInfo.isRecommendedInfo = true;
        this.loanInfo.getLoanDetail(applicationId);
        this.loanInfo.loanApplicationDetail = this.applicationSelection;

        this.getObligorInformation(applicationId);
        // this.resolveUntenored();
        // this.getUserPrivileges(); // call this inside getObligorInformation
        // this.getAppraisalMemorandumDocument(applicationId);
        this.getLoanDetail();
        // this.getLoanDetailChangeLog(); // --------------- REMOVE & LAZY LOAD!
        //new
        // this.loadAllLoanApplicationDetails(this.applicationSelection); // foreign!
        this.getTrail();
        this.activeTabindex = 1; 
        this.disableApplicationInformationTab = false;
        this.disableSupportingDocumentsTab = false;
        this.disableBandGDocumentTab = false;
        this.disableAOfferLetterTab=false;
        // this.activeTabindex = 2; this.approve();
        this.getSupportingDocuments(this.applicationSelection.applicationReferenceNumber);
    }
    
    viewApplicationDetails(row) {
      this.applicationSelection = row;
      this.onSelectedApplicationChange();
      this. viewApplicationDetail(row);
    }

    activeTabindex: number = 0;
    
    untenored: boolean = false;

    displayObligorDetails: boolean = false;
    obligorInfoReady: boolean = false;
    obligor: any = {}; // may be redundant! has same info as [loanApplication]
    loanApplication: any = {};
    //isProductProgram: boolean = false;
    

    getObligorInformation(id: number): void {
      this.obligorInfoReady = false;
      let appl = this.applications.find(x => x.loanApplicationId == id);
      this.loanApplication = appl;
      if (appl != null) {
          this.obligorInfoReady = true;
          this.workingLoanApplication = appl.applicationReferenceNumber;// + ' ' + appl.applicantName;
          this.obligor = {
              applicationReferenceNumber: appl.applicationReferenceNumber,
              isPoliticallyExposed: appl.isPoliticallyExposed,
              customerGroupName: appl.customerGroupName,
              loanInformation: appl.loanInformation,
              applicationDate: appl.applicationDate,
              applicationTenor: appl.applicationTenor,
              isRelatedParty: appl.isRelatedParty,
              loanTypeName: appl.loanTypeName,
              productClassId: appl.productClassId,
              productId: null,//appl.productId, 
              productClassName: appl.productClassName,
              interestRate: appl.interestRate,
              relationshipOfficerName: appl.relationshipOfficerName,
              relationshipManagerName: appl.relationshipManagerName,
              currentApprovalLevelId: appl.currentApprovalLevelId,
              currentApprovalLevel: appl.currentApprovalLevel,
              isInvestmentGrade: appl.isInvestmentGrade,
              approvalStatusId: appl.approvalStatusId,
              approvedAmount: appl.approvedAmount,
              applicationAmount: appl.applicationAmount,
              applicationStatusId: appl.applicationStatusId,
              submittedForAppraisal: appl.submittedForAppraisal,
              customerInfoValidated: appl.customerInfoValidated,
              // notInNegativeCrms: appl.notInNegativeCrms,
              // notInBlackbook: appl.notInBlackbook,
              // notInCamsol: appl.notInCamsol,
          };
          //this.isProductProgram = this.productPrograms.some(x => x.productClassId == appl.productClassId);
          ////console.log('appl..', appl);
          // this.getSupportingDocuments(appl.applicationReferenceNumber); // <--lazy loaded documents
      }
  }

  changeLog: any[] = [];
  proposedItems: any[] = [];
  recommendedItems: any[] = [];
  touchedLineItems: number[] = [];
  selectedLineId: number;
  displayChangeLog: boolean = false;
  showSpinnerChangeLog: boolean = false;
  
  customerIds: number[] = [];

  getLoanDetail(): void {
      this.loadingService.show();
      this.camService.getLoanDetail(this.applicationSelection.loanApplicationId).subscribe((response: any) => {
          this.proposedItems = response.result;
          // this.proposedItems = [...response.result]; // place settings 1 08118499104
          ////console.log('same ===== ',(this.proposedItems == this.proposedItems));
          const ids: number[] = response.result.map(x => x.customerId);
          this.customerIds = Array.from(new Set(ids)); // unique of ids
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      });
  }
  
    onTabChange(e) {
      ////console.log( 'active index----', e.index);
        this.activeTabindex = e.index;
        if (e.index == 2) {} //this.getSupportingDocuments(this.obligor.applicationReferenceNumber); }
    }

    privilege: any = {
      canUploadFile: true,
    };

    // file upload

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    primaryDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile(primaryDocument: boolean = false) {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                loanApplicationId: this.applicationSelection.loanApplicationId,
                loanApplicationNumber: this.obligor.applicationReferenceNumber,
                loanReferenceNumber: '',
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '1', // TODO: redundant with fileExtension known
                isPrimaryDocument: primaryDocument,
            };
            this.loadingService.show();
            this.camService.uploadFile(this.file, body).then((val: any) => {
                ////console.log("val", val)
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";
                this.loadingService.hide();
                this.getSupportingDocuments(this.obligor.applicationReferenceNumber);
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
            });
        }
    }

    getSupportingDocuments(applicationNumber: any) {
        ////console.log('appl number', applicationNumber);
        this.loadingService.show();
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response: any) => {
            this.supportingDocuments = response.result.filter(x => x.isPrimaryDocument == false);;
            this.primaryDocuments = response.result.filter(x => x.isPrimaryDocument == true);
            this.loadingService.hide();
            ////console.log('documents..', response.result);
        });
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;

    viewDocument(row) {
        this.loadingService.show();
        this.camService.getSupportingDocumentByDocumentId(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result.fileData;
            this.selectedDocument = response.result.documentTitle;
            this.displayDocument = true;
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
            ////console.log("error", error);
        });
    }

    pdfFile: any;
    pdfFileName: string;
    displayPdf: boolean = false;
    myDocExtention: string;
    pdfData: any;
    fileUrl: string;

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
            saveAs(file)
        }
    }

    DownloadDocument(row) {
        let doc  = row;
        if (doc != null) {
            this.pdfFile = doc.fileData;
            this.pdfFileName = doc.documentTitle;
            this.selectedDocument = doc.documentTitle;
            this.myDocExtention = doc.fileExtension;
            var byteString = atob(this.pdfFile);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = new Blob([ab]);
            if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
                try {
                    var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                }
            }
            if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
                try {
                    var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                }
            }
            if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
                try {
                    var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                }
            }
            if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                try {
                    var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                }
            }
            if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {

                try {
                    var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                    saveAs(file);
                } catch (err) {
                    var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                    window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                }
            }
        }
    }

    print(): void {
      let printTitle = 'Bonds & Guarantee - '+ this.selectedDocument + ' for ' + this.workingLoanApplication;
      let printContents, popupWin;
      printContents = document.getElementById('print-section-document').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>${printTitle}</title>
            <style>
            //........Customized style.......
            </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }

    refer() {
      this.clearControls();
      this.forwardAction = ApprovalStatus.REFERRED;
      this.displayCommentForm = true;
      this.commentTitle = 'Refer Back';
      let control = this.commentForm.controls['trailId'];
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    }

    forward() {
      this.clearControls();
      this.forwardAction = ApprovalStatus.PROCESSING;
      this.displayCommentForm = true;
      this.commentTitle = 'Forward';
    }

    cancelForm() {
      this.displayCommentForm = false;
      this.errorMessage = '';
      this.lineSelection = null;
      this.selectedLineId = null;
    }

    commentTitle: string = null;
    forwardAction: number = 0;
    displayCommentForm: boolean = false;
    receiverLevelId: number = null;
    receiverStaffId: number = null;

    forwardCam(form) {
        let body = {
            forwardAction: this.forwardAction,
            applicationId: this.applicationSelection.loanApplicationId,
            productClassId: this.obligor.productClassId,
            productId: this.obligor.productId,
            receiverLevelId: this.receiverLevelId, // refer back
            receiverStaffId: this.receiverStaffId, // refer back
            comment: form.value.comment,
        };
        ////console.log('forward..', JSON.stringify(body));
        this.loadingService.show();
        this.camService.forwardBandg(body).subscribe((res) => {
          ////console.log('1..', res);
          
            if (res.success == true) {
                this.reset();
                this.displayCommentForm = false;
                this.clearControls();
                this.loadingService.hide();
          ////console.log('2..');
              } else {
                this.finishBad(res.message);
                this.errorMessage = res.message;
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }
    commentForm: FormGroup;
    
    clearControls() {
      this.commentForm = this.fb.group({
          comment: ['', Validators.required],
          productId: [''],
          trailId: [''],
          statusId: [''],
      });
    }

    // trail & comment

    trail: any[] = [];
    trailLevels: any[] = [];
    trailCount: number = 0;
    trailRecent: any = null;

    getTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.applicationSelection.loanApplicationId, this.BANDG_OPERATION_ID).subscribe((response: any) => {
            ////console.log('trail..', response.result);
            this.trail = response.result;
            this.trailRecent = response.result[0];
            this.trailCount = this.trail.length;
            response.result.forEach((trail) => {
              if(this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
                this.trailLevels.push(trail);
              }
            });
            
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

    reset() {
      let control = this.commentForm.controls['trailId'];
      control.setValidators(null);
      control.updateValueAndValidity();
      // this.touchedLineItems = [];
      this.activeTabindex = 0;
      this.applicationSelection = null;
      this.workingLoanApplication = null;
      this.disableApplicationInformationTab = true;
      this.getLoanApplications(); // refresh list
  }


    // ---------------------- message ----------------------

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


    generateFinalOfferLetter(evt) {
        let ref = this.applicationRefNo;
        let body = {
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
        this.camService.update(body, this.applicationSelection.loanApplicationId).subscribe((res) => {
        });

        ////console.log("Correct event >>>>>>>", evt);
        ////console.log(" event >>>>>>>", body);
    }


    popoverSeeMore() {
        if (this.applicationSelection.applicationReferenceNumber != null) {
            ////console.log('more..', startDate, endDate);
            this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
            const data = {
                applicationRefNumber: this.applicationSelection.applicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                ////console.log(path);
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                ////console.log(path);
            });
            this.displayReport = true;
            return;
        }
    }



    generateOfferLetter() {
        this.loadingService.show();
        this.displayGeneratedLetter = true;
        this.loadingService.hide(3000);
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
                ////console.log('error', err);
            });
    }
    loanGenerateFinalOfferLetter(applicationReferenceNumber) {
        this.loanApplService.getFinalOfferLetterByLoanAppId(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                this.isFinalOfferLetter = tempSrc.isFinal
                ////console.log("IS FINAL LETTER", this.isFinalOfferLetter);
            });
    }
    loadPreparedForm38BTemplate(applicationReferenceNumber: string) {
        this.loadingService.show();
        this.loanApplService.getForm3800Template(applicationReferenceNumber)
            .subscribe((response: any) => {
                let tempSrc = response.result;
                ////console.log('temp src', tempSrc);
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
    viewApplicationDetail(row) {

      //  this.displayLoanDetails = true;
        this.applicationSelection = row;
        this.applicationRefNo = row.applicationReferenceNumber;
        ////console.log('row', row);
        this.loadingService.show();
        this.generateOfferLetter()
        //this.form3800b(row.applicationReferenceNumber);
        this.loanGenerateFinalOfferLetter(this.applicationSelection.loanApplicationId);
        if (this.offerLetterData.length > 0) {
            this.docTemplateObj = this.offerLetterData.find(x => x.applicationReferenceNumber == row.applicationReferenceNumber);

            if (this.docTemplateObj != null) {
                ////console.log('found existing document', this.docTemplateObj);
                this.form3800bSrc = this.docTemplateObj;
            } else {
                this.loadPreparedForm38BTemplate(row.applicationReferenceNumber);
            }
        }
        else {
            this.loadPreparedForm38BTemplate(row.applicationReferenceNumber);
        }

        ////console.log('product class process', row.productClassProcessId);

        if (row.productClassProcessId == ProductProcessEnum.CAMBased) {
            ////console.log('cam based', row.productClassProcessId);

            this.isCAMBased = true;
        } else {
            ////console.log('product  based', row.productClassProcessId);

            this.isCAMBased = false;
        }

        //this.loadPreparedOfferLetter(row.applicationReferenceNumber);

        // row.camDocuments.map(element => {
        //     this.camDocuments.push(element);
        // });

        ////console.log('cam documents', this.camDocuments);

        if (this.camDocuments.length > 0) {
            const docLength = this.camDocuments.length;
            if (docLength > 4) { // meaning it got to mcc & bcc level 
                this.creditAnalystDocument = this.camDocuments[docLength - 2];
                this.mccDocument = this.camDocuments[docLength - 1];
                this.bccDocument = this.camDocuments[docLength - 1];
                this.disableCommitteeTabs = false;
            } else {
                ////console.log('cap doc', this.camDocuments[docLength - 1]);
                this.creditAnalystDocument = this.camDocuments[docLength - 1];
            }
        }

        ////console.log('analyst document', this.creditAnalystDocument);

        this.loadingService.show();
        // this._creditApprServ.updateApplicationStatus(row.applicationReferenceNumber,
        //     LoanApplicationStatus.OfferLetterGenerationInProgress, row).subscribe((res) => {
        //         if (res.success === true) {
        //             this.loadingService.hide();
        //         }
        //     }, (err) => {
        //         this.loadingService.hide();
        //         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        //         ////console.log('error', err);
        //     });
        this.displayLoanDetails = true;

        let dataObj = this.applicationSelection;
        this._approvalService.getApprovalTrailByOperation(this.OPERATION_ID, dataObj.loanApplicationId).subscribe((res) => {
            this.approvalWorkflowData = res.result;
            if (this.approvalWorkflowData.length > 0) this.disableApprovalBtn = false;
        });

    }

    form3800b(applicationReferenceNumber): void {
        if (applicationReferenceNumber != null) {
            let path = '';
            const data = {
                applicationRefNumber: applicationReferenceNumber,

            }
            ////console.log(data);

            this.reportServ.getPrintLetter(data.applicationRefNumber).subscribe((response: any) => {
                path = response.result;
                ////console.log(path);
                this.reportSource = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                ////console.log(path);
            });
            //this.displayReport = true;
            return;
        }
       
    }

}