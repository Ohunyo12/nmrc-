import { saveAs } from 'file-saver';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CreditAppraisalService } from '../../services/credit-appraisal.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ProductClassEnum } from '../../../shared/constant/app.constant';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ApprovalStatus, ApplicationStatus } from '../../../shared/constant/app.constant';


@Component({
  selector: 'app-loan-application-details-view',
  templateUrl: './loan-application-details-view.component.html',
})
export class LoanApplicationDetailsViewComponent implements OnInit {
  loanDocumentUploadList: any;
  uploadResult: any;
  sumAverageSchoolFees: string;
  sumTotalPreviousTermSchoolFees: string;
  sumAverageMonthlyTurnover: string;
  sumInvoiceAmount: string;
  proposedLabel: string = 'Proposed Application Information';
  sumAmount: string;
  @Input() visible: boolean = true;
  @Input() isLMS: boolean = false;
  @Input() isForModification: boolean = false;
  @Output() modify = new EventEmitter<boolean>();
  @Output() emitLoanApplicationDetaiId = new EventEmitter<number>();
  displayUpload: boolean = false;
  selectedDocument: string;
  binaryFile: string; 

  productDetails: any[];
  productClassId: number = 0;
  selectedDetails: any;
  invoiceDiscountingDetails: any[];
  firstEduDetails: any[];
  firstTraderDetails: any[];
  bondsAndGuanranteesDetails: any[];
  @Input('loanApplicationDetail') loanApplicationDetail: any = {};
  @Output() loanApplicationDetailIds = new EventEmitter<string>();
  proposedApplicationDetails: any[];
  SyndicatedLoanApplicationDetail: any[];
  approvedApplicationDetails: any[];
  @Input('isRecommendedInfo') isRecommendedInfo: boolean =false;
  //@Input('productClassId') productClassId: number;
  isSyndicatedInfo: boolean;
  @Input() loanInformation: string = '';
  @Input() showOrHideViewDetails: boolean = true;
  showSpinnerChangeLog: boolean = false;
  displayChangeLog: boolean = false;
  displayMoreDetails: boolean = false;
  hasBandGDocument: boolean = false;

  averageSchoolFees: number = 0;
  totalPreviousTermSchoolFees: number = 0;
  averageMonthlyTurnover: number = 0;
  invoiceAmount: number = 0;
  bondAmount: number = 0;
  isFacilityRating: boolean = false;
  facilityRatings: any;
  showfacilityDetails = false;
  loanAppId = 0;
  facilityStampDuty: any[] = [];
  
  @Input() set loanApplicationId(value: number) {
    if (value > 0) this.getLoanDetail(value);
    this.loanAppId = value;
  }

  @Input() set loanApplicationDetailId(value: number) {
    if (value > 0) this.getSingleLoanDetail(value);
  }

  @Input() set reloadLoan(event: boolean){
    if (event == true){
      this.getLoanDetail(this.loanAppId);
    }
  }

  constructor(
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
    private loanAppService: LoanApplicationService,
  ) { }

  ngOnInit() {
    this.showSpinnerChangeLog = true;
    
  }
  
  sendMessageToParent(message: string) {
    this.loanApplicationDetailIds.emit(message)
  }

  approvalStatus = [
    { id: 0, name: 'Pending' },
    { id: 1, name: 'Processing' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Disapproved' },
    { id: 4, name: 'Authorised' },
    { id: 5, name: 'Referred' },
  ];

  getApprovalStatus(id) {
    let item = this.approvalStatus.find(x => x.id == id);
    return item == null ? 'n/a' : item.name;
  }

  getLoanDetail(id): void {
    this.loadingService.show();
    if (this.isLMS == true) {
      this.camService.getLoanLMSDetail(id).subscribe((response: any) => {
        this.loadingService.hide();
        this.proposedApplicationDetails = response.result.facilities;
        this.approvedApplicationDetails = this.proposedApplicationDetails.filter(x => x.statusId == ApprovalStatus.APPROVED);
      }, (err) => {
        this.loadingService.hide(1000);
      });
    } else {
      this.camService.getLoanDetail(id).subscribe((response: any) => {
        this.proposedApplicationDetails = response.result.facilities;
        this.approvedApplicationDetails = this.proposedApplicationDetails.filter(x => x.statusId == ApprovalStatus.APPROVED);
        this.loanApplicationDetail = response.result.application;
        this.getFacilityStampDuty(this.proposedApplicationDetails[0].loanApplicationDetailId);
        this.sendMessageToParent(this.proposedApplicationDetails[0].loanApplicationDetailId);

        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      });
    }
    // this.loadingService.hide();
  }

  getSingleLoanDetail(id): void {
    this.proposedLabel = 'Application Information';
    this.loadingService.show();
     
    this.camService.getSingleLoanDetail(id).subscribe((response: any) => {
      this.proposedApplicationDetails = response.result.facilities;
      this.approvedApplicationDetails = this.proposedApplicationDetails.filter(x => x.statusId == ApprovalStatus.APPROVED);
      this.loanApplicationDetail = response.result.application;
      
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getLoanApplicationById(id): void {
    this.loadingService.show();
    this.loanAppService.getLoanApplicationById(id).subscribe((response: any) => {
      this.loanApplicationDetail = response.result;
      
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getFacilityStampDuty(detailId){
    this.camService.getFacilityStampDutyId(detailId).subscribe((response) => {
    
      this.facilityStampDuty = response.result;
     
    });
  }

  getApplicationProductDetails(detailId) {
    this.loadingService.show();
    this.invoiceAmount = 0;
    this.averageSchoolFees = 0;
    this.averageMonthlyTurnover = 0;
    this.bondAmount = 0;
    /* this.loanAppService.getLoanApplicationDetails(detailId)
       .subscribe((response: any) => {
         this.selectedDetails = response.result;
       }, (err) => {
       }); */

    this.loanAppService.getApplicationProductDetails(detailId).subscribe((response: any) => {
    
      this.loadingService.hide();
      this.productDetails = response.result;

      if (this.productDetails != undefined) {
        this.productClassId = this.productDetails[0].productClassId

      }

      if (this.productClassId == ProductClassEnum.INVOICEDISCOUNTINGFACILITY) {
        
        this.invoiceDiscountingDetails = this.productDetails
        if (this.invoiceDiscountingDetails.length > 0) {
          this.invoiceDiscountingDetails.forEach(inv => {
            this.invoiceAmount += inv.invoiceAmount;
          });
          this.sumInvoiceAmount = this.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
        }
      }

      // if (this.productClassId == ProductClassEnum.FIRSTEDU) {
      //   this.firstEduDetails = this.productDetails
      //   if (this.firstEduDetails.length > 0) {
      //     this.firstEduDetails.forEach(edu => {
      //       this.averageSchoolFees += edu.averageSchoolFees;
      //       this.totalPreviousTermSchoolFees += edu.totalPreviousTermSchoolFees;
      //     });
      //     this.sumAverageSchoolFees = this.averageSchoolFees.toLocaleString('en-US', { minimumFractionDigits: 2 });
      //     this.sumTotalPreviousTermSchoolFees = this.totalPreviousTermSchoolFees.toLocaleString('en-US', { minimumFractionDigits: 2 });
      //   }
      // }
      // if (this.productClassId == ProductClassEnum.FIRSTRADER) {
      //   this.firstTraderDetails = this.productDetails
      //   if (this.firstTraderDetails.length > 0) {
      //     this.firstTraderDetails.forEach(trader => {
      //       this.averageMonthlyTurnover += trader.averageMonthlyTurnover;
      //     });
      //     this.sumAverageMonthlyTurnover = this.averageMonthlyTurnover.toLocaleString('en-US', { minimumFractionDigits: 2 });
      //   }
      // }
      // if (this.productClassId == ProductClassEnum.BONDANDGUANTRANTEE) {
      //   this.bondsAndGuanranteesDetails = this.productDetails
      //   if (this.bondsAndGuanranteesDetails.length > 0) {
      //     this.bondsAndGuanranteesDetails.forEach(bonds => {
      //       if (bonds.referenceNo != null) {
      //         this.hasBandGDocument = true;
      //       }
      //       this.bondAmount += bonds.amount;
      //     });
      //     this.sumAmount = this.bondAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
      //   }
      // }
      if (this.productClassId == ProductClassEnum.CORPORATE) {
        this.SyndicatedLoanApplicationDetail = this.productDetails
        if (this.SyndicatedLoanApplicationDetail.length > 0) {
          this.SyndicatedLoanApplicationDetail.forEach(syndication => {
            if (syndication.syndicationId != null) {
              this.isSyndicatedInfo = true;
            }
          });
       }
      }
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  viewApplicationDetails(row) {
    this.productDetails = [];
    this.invoiceDiscountingDetails = null;
    this.firstEduDetails = null;
    this.firstTraderDetails = null;
    this.bondsAndGuanranteesDetails = null;
    this.SyndicatedLoanApplicationDetail=null;
    // const row = index;
    this.selectedDetails = row;
    this.getApplicationProductDetails(row.loanApplicationDetailId);

     //if (this.productClassId == 22 || this.productClassId == 25) {
        this.isFacilityRating = true;
        this.getFacilityRating(row.loanApplicationDetailId);
        //this.getFacilityRating(554);
      //}

    this.displayMoreDetails = true;
  }

  openForModification(row){
    this.emitLoanApplicationDetaiId.emit(row.loanApplicationDetailId);
    this.modify.emit(true);
  }

  getFacilityRating(loanApplicationDetailId) {
    this.loanAppService.getFacilityRating(loanApplicationDetailId).subscribe((data) => {
        this.facilityRatings = data.result;
        //console.log("loanApplicationDetailId: ", loanApplicationDetailId);
       // console.log("facilityRatings: ", this.facilityRatings);
    }, err => { });
  }

  viewInvoiceDocument(index) {
    const row = index; // this.invoiceDiscountingDetails[index]
    this.getDocumentByApplicationNumber(row.invoiceNo, this.loanApplicationDetail.applicationReferenceNumber);

  }

  viewBNGDocument(index) {
    const row = index; //this.bondsAndGuanranteesDetails[index]
    if (row.referenceNo != null) {
      this.getDocumentByApplicationNumber(row.referenceNo, this.loanApplicationDetail.applicationReferenceNumber);
    }
  }

  getDocumentByApplicationNumber(invoiceNo, contractNumber) {
    this.loanAppService.getDocumentByApplicationNumber(invoiceNo, contractNumber).subscribe((response: any) => {
      this.uploadResult = response.result;
      if (this.uploadResult != undefined) {
        if (['jpg', 'jpeg', 'png'].indexOf(this.uploadResult.fileExtension.toLowerCase()) > -1) {
          this.binaryFile = this.uploadResult.fileData;
          this.selectedDocument = this.uploadResult.documentTitle;
          this.displayUpload = true;
        }
        if (['doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt'].indexOf(this.uploadResult.fileExtension.toLowerCase()) > -1) {
          this.DownloadDocument(this.uploadResult);
        }
      }
    });
  }

  DownloadDocument(doc: any) {
    if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      let myDocExtention = doc.fileExtension;
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
    if (myDocExtention == 'txt' || myDocExtention == '.txt') {

      try {
          var file = new File([bb], this.selectedDocument + '.txt', { type: 'text/plain' });
          saveAs(file);
      } catch (err) {
          var saveFileAsBlob = new Blob([bb], { type: 'text/plain' });
          window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.txt');
      }
  }
    }
  }
  getLoanApplicationStatus(id) {
    let item = ApplicationStatus.list.find(x => x.id == id);
    return item == null ? 'n/a' : item.name;
  }

  editApplicationDetails(row){

  }
}
