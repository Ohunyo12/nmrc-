import { LoanOperationService } from '../../services/loan-operations.service';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subject } from 'rxjs';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { Component, OnInit, Input } from '@angular/core';
import { LoanApplicationService, CreditAppraisalService } from 'app/credit/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-undisbursed-loan-details',
  templateUrl: './undisbursed-loan-details.component.html',
})
export class UnDisbursedLoanDetailsComponent implements OnInit {
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
  collateralDetails: any[];// LoanCovenantModel[] = [];;
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
  guarantor: boolean= false;
  selectedTypeId: number = null;
  loanSelection: any;
  model: any;
  entityName: string = "";
  originalForm3800bSrc: any = {};
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  OPERATION_ID: number = 46;
  documentations: any[] = [];
  displayDocumentation: boolean = false;
  showForm3800B: boolean = true;
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
  @Input('displayCustomerODDetails') displayCustomerODDetails: boolean = false;
  @Input('displayFacilityDetails') displayFacilityDetails: boolean = true;
  @Input('termLoanId') selectedLoanId: number = 0;
  @Input('loanSystemTypeId') loanSystemTypeId: number = 0;
  @Input('selectedApplicationRefNumber') selectedApplicationRefNumber: string;
  @Input('selectedloanReviewApplicationId') selectedloanReviewApplicationId: number;

  private _loadLoanDetails: number;
  reportSource: SafeResourceUrl;
  applicationReferenceNumber: string;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;

this.applicationReferenceNumber = this.selectedApplicationRefNumber;

    if (value > 0) this.loadDistursedLoanDetails(this._loadLoanDetails, this.loanSystemTypeId);
  }
  constructor(private loadingService: LoadingService, private loanSrv: LoanService, private loanApplService: LoanApplicationService,
    private loanOperationService: LoanOperationService, private dateUtilService: DateUtilService,  private camService: CreditAppraisalService,
    private sanitizer: DomSanitizer,
    private reportServ: ReportService,
    private documentpUloadService: DocumentpUloadService,
    ) { }

  ngOnInit() {
    this.loanSelection = [];
   
    this.check(this.loanSelection.productTypeId);
    //  this.loadDistursedLoanDetails(this.selectedLoanId);
  
  }

  showBalance(){} // i saw it in html and never knew what it meant though throwing error

  loadDistursedLoanDetails(loanId,loanType) {
    this.loanSelection = {};
     this.getApprovedLoanDetails(loanId,loanType);

// if(loanType!=0)
// {
  // this.GetLaonGuarantors(loanId);
  this.GetLoanCollateralOD(loanId,loanType);
  this.GetLaonConvenantOD(loanId,loanType);
  this.GetLaonChargeFeeOD(loanId,loanType);
  this.GetLaonScheduleByLoanId(loanId);
// }
// else
// {
//   // this.GetLaonGuarantors(loanId);
//   this.GetLoanCollateral(loanId);
//   this.GetLaonConvenant(loanId);
//   this.GetLaonChargeFee(loanId);
//   this.GetLaonScheduleByLoanId(loanId);
// }
    
  }

  check(productTypeId){

    if(productTypeId == 6 || productTypeId == 9){
      this.displayCustomerODDetails = true;
     
    }
    else
    {
      this.displayCustomerODDetails = false;
     
    }
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
  getApprovedLoanDetails(loanId,loanType) {
    this.loanOperationService.getUnDisbursedLoanDetailsById(loanId,loanType).subscribe(response => {
      this.loanSelection = response.result;

      this.GetLaonGuarantors(this.loanSelection.loanApplicationId);
      this.check(this.loanSelection.productTypeId);
      this.getAllUploadedDocument();
      if (this.selectedloanReviewApplicationId == 0){
this.showForm3800B=false;
      }
      else{
        this.showForm3800B=true;

       // this.form3800b(this.selectedApplicationRefNumber);
      }

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
        this.loadingService.hide();
         if (print == false) this.displayDocumentation = true;
    }, (err) => {
        this.loadingService.hide(1000);
    });
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

print(): void {
  //this.getAllStaffSignatures();
  this.previewDocumentation(true);
  // if (this.signatures.length > 0) {
      let printTitle = 'CREDIT APPRAISAL - ' + this.loanSelection.loanReferenceNumber;
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
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
  // }
}
  GetLaonConvenant(loanId) {
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        this.convenatDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  GetLoanCollateral(loanId) {
    this.loanOperationService.getLoanCollateral(loanId)
      .subscribe(results => {
        this.collateralDetails = results.result;
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
  GetLaonGuarantors(loanId) {
    // this.loanOperationService.getLoanGuarantors(loanId)
    //   .subscribe((results) => {
    //     this.guarantorDetails = results.result;
    //   });
    //   this.check(this.loanSelection.productTypeId);
  }
  GetLaonConvenantOD(loanId,loanType) {
    this.loanOperationService.getLoanConvenantOD(loanId,loanType)
      .subscribe(results => {
        this.convenatDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  GetLoanCollateralOD(loanId,loanType) {
    this.loanOperationService.getLoanCollateralOD(loanId,loanType)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });
      this.check(this.loanSelection.productTypeId);
  }
  GetLaonChargeFeeOD(loanId,loanType) {
    this.loanOperationService.getLoanChargeFeeOD(loanId,loanType)
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
