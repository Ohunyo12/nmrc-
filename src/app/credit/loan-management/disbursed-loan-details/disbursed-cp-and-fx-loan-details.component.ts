import { LoanOperationService } from '../../services/loan-operations.service';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CPInterestRateReviewComponent } from '../commercial-loans/cp-interest-rate-review.component';
import { LoanSystemTypeEnum, GlobalConfig } from '../../../shared/constant/app.constant';
import { LoanApplicationService, CreditAppraisalService } from 'app/credit/services';
import swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-disbursed-cp-and-fx-loan-details',
  templateUrl: './disbursed-cp-and-fx-loan-details.component.html',
})
export class DisbursedCommercialLoanDetailsComponent implements OnInit {
  disbursementAccount: string;
  repaymentAccount: string;
  principalValanceString: any;
  principalBalance: any = 0;
  irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
  scatterdPayments: any[] = [];
  data: any = {};
  loanScheduleDetails: any[];
  customerLoansData: any[];
  operationTypes: any[];
  filteredProducts: any[];
  convenatDetails: any[];// LoanCovenantModel[] = [];;
  guarantorDetails: any[];// GuarantorAppModel[] = [];
  chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
  frequencies: any[];
  displaySearchModal: boolean = false;
  displayReviewModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayCASASearchModal: boolean = false;
  displayPaymentPlan: boolean = false;
  displayLoanSearch: boolean = true;
  displatBackToSearch: boolean = false;
  displayCasaDetails: boolean = false;
  selectedTypeId: number = null;
  loanSelection: any;
  model: any;
  entityName: string = "";
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  displayCustomerODDetails: boolean = false;
  originalForm3800bSrc: any = {};
  OPERATION_ID: number = 46;
  documentations: any[] = [];
  displayDocumentation: boolean = false;

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
  @Input('displayDetails') displayDetails: boolean = false;
  @Input('termLoanId') selectedLoanId: number = 0;
  @Input('selectedApplicationRefNumber') selectedApplicationRefNumber: string;
  @Input('selectedloanReviewApplicationId') selectedloanReviewApplicationId: number;
  @Input('showOperationScreen') showOperationScreen: boolean;

  @ViewChild(CPInterestRateReviewComponent, {static: false}) interestRateChange: CPInterestRateReviewComponent;
  
  private _loadLoanDetails: number;
  reportSource: SafeResourceUrl;
  applicationReferenceNumber: string;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails);
  }
  
  constructor(private loadingService: LoadingService, private loanSrv: LoanService,private loanApplService: LoanApplicationService,
    private loanOperationService: LoanOperationService, private dateUtilService: DateUtilService, private camService: CreditAppraisalService, 
    private sanitizer: DomSanitizer,
    private reportServ: ReportService,
    private documentpUloadService: DocumentpUloadService  ) { }

  ngOnInit() {
    this.loanSelection = [];
    this.check(this.loanSelection.productTypeId);
    this.applicationReferenceNumber = this.selectedApplicationRefNumber
  }
  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
}
  previewDocumentation(print=false) {
    this.loadingService.show();
    this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
        this.documentations = response.result;

        this.loadingService.hide();
         if (print == false) this.displayDocumentation = true;
    }, (err) => {
        this.loadingService.hide(1000);
    });
}
  loadDistursedLoanDetails(loanId) {
    this.loanSelection = {};
    this.getApprovedLoanDetails(loanId);
    this.GetLaonConvenant(loanId);
    this.GetLaonChargeFee(loanId);
    this.GetLaonScheduleByLoanId(loanId);
    //this.form3800b(this.selectedApplicationRefNumber);
    //this.loadOriginalForm3800BTemplate(this.selectedApplicationRefNumber);
    this.getAllUploadedDocument();

  }
  loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
    this.loadingService.show();
    this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
        .subscribe((response: any) => {
            let tempSrc = response.result;
            if (tempSrc != null) {
                this.originalForm3800bSrc = tempSrc;
            }
            else{ this.originalForm3800bSrc = {};
        }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

        });
}
  check(productTypeId){
    if(productTypeId == 6){
      this.displayCustomerODDetails = true;
    }
    else
    {
      this.displayCustomerODDetails = false;
    }
  }

  getApprovedLoanDetails(loanId) {
    this.loanOperationService.getDisbursedLoanDetailsById(loanId,LoanSystemTypeEnum.TermDisbursedFacility).subscribe(response => {
      this.loanSelection = response.result;
      this.GetLaonGuarantors(this.loanSelection.loanApplicationId);
      this.check(this.loanSelection.productTypeId);


      if(this.loanSelection.casaAccountNumber2!=null){
        this.repaymentAccount="CASA Account Number (Repayment):",
        this.disbursementAccount="CASA Account Number (Disbursement):"
      }else{
        this.repaymentAccount="CASA Account Number 2:",
        this.disbursementAccount="CASA Account Number 1:"
      }
      
    });
  }
  GetLaonGuarantors(loanId) {

  }
  GetLaonConvenant(loanId) {
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  
  GetLaonChargeFee(loanId) {
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        this.chargeFeeDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }

  GetLaonScheduleByLoanId(loanId) {
    this.loanOperationService.getLoanScheduleByLoanId(loanId)
      .subscribe(results => {
        this.loanScheduleDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  getAllUploadedDocument() {
    this.loadingService.show();
    let body = {
      loanApplicationId: this.loanSelection.loanReviewApplicationId,
      loanApplicationNumber: this.applicationReferenceNumber,
      loanReferenceNumber: this.applicationReferenceNumber,
      databaseTable: 8,
    }
  
    this.documentpUloadService.getAllUploadedDocument(body).subscribe((response: any) => {
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
      this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
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
