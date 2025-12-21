import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from 'app/credit/services/loan.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { ReportService } from 'app/reports/service/report.service';
import { ApplicationStatus,ApprovalStatus, GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { HelperService } from 'app/shared/services/helpers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-review-contingent-application-search',
  templateUrl: './loan-review-contingent-application-search.component.html'
})
export class LoanReviewContingentApplicationSearchComponent implements OnInit {

  
    operations: any;
    products: any[];
    applications: any[];
    displaySearchForm:boolean=false;
    searchForm: FormGroup;
    activeTabindex:any;
    hideCancelPanel:boolean;
    hideGeneralInfoPanel:boolean;
    cancellationReason: any;
    loanApplicationId: any;
    loanApplicationDetail: any;
    showCancelButton:boolean=true;
    activeSearchTabindex: any;
    displaySearchTable:boolean=true;
    reload: number = 0;
    duplications: any;
    proposedItems: any;
    facilityCount: any;
    dynamicsList: any;
    searchString: string;
    nextLevelId = 0;
    conditionList: any;
    trailCount: number = 0;
    approvalTrailId = 0;
    displayApproverSearchForm = false;
    visible:boolean=false;
    isAnalyst: boolean = false;
    allRequiredDocumentsAreUploaded = true;
    lmsOoperations: any[];
    changeLog: any;
    reportSrc: SafeResourceUrl;
    applicationReferenceNumber: any;
    displayReport: boolean;
    isOfferLetterAvailable: any;
    isLMS:boolean=true;
    panelTitle = '';
    private subscriptions = new Subscription();
    currentStaffActivities: string[] = [];
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  constructor(
      private loadingService: LoadingService,
      private loanService: LoanService,
      private fb: FormBuilder,
      private sanitizer: DomSanitizer,
      private loanAppService: LoanApplicationService,
      private camService: CreditAppraisalService,
      private documentpUloadService: DocumentpUloadService,
      private reportServ: ReportService,
      private helperService: HelperService
  ) { }
  
  ngOnInit() {
      this.clearControls(); 
      this.hideCancelPanel=false;   
      this.hideGeneralInfoPanel=true; 
      this.currentStaffActivities = JSON.parse(sessionStorage.getItem('userActivities'));
  }

  setrequiredUploadValue(value: boolean) {
    this.allRequiredDocumentsAreUploaded = value;
}

  clearControls() {
      this.searchForm = this.fb.group({
          searchString: ['', Validators.required],
      });
  }
  getTransacDynamics(loanApplicationId): void {
      this.reload = 0;
      this.loadingService.show();
      this.subscriptions.add(
      this.camService.getLMSTransacDynamics(loanApplicationId).subscribe((response: any) => {
          this.dynamicsList = response.result;
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      }));
  }
  

  getConditionPrecident(loanApplicationId): void {
      this.reload = 0;
      this.loadingService.show();
      this.subscriptions.add(
      this.camService.getLoanConditionPrecidents(loanApplicationId).subscribe((response: any) => {
          this.conditionList = response.result;
          this.loadingService.hide();
      }, (err) => {
          this.loadingService.hide(1000);
      }));
  }
  showSearchForm() { this.displaySearchForm = true; } 

  onTabChange(obj){  }

  setTrailCount(count) { this.trailCount = count; }

  submitForm(form) { 
      
    this.searchString = form.value.searchString;
    let body = {
        searchString: form.value.searchString
      };
      this.loadingService.show();
      this.subscriptions.add(
      this.loanService.loanReviewContingentApplicationSearch(body).subscribe((response: any) => {
          this.lmsOoperations = response.result;
          this.loadingService.hide();
          this.displaySearchForm = false;
          this.displaySearchTable = true;
          this.displayApplicationDetail=false;
      }, (err: any) => {
          this.loadingService.hide(1000);
      }));
  }

  displayApplicationDetail: boolean = false;
  application: any = {};

    view(row) {
        this.application = row;
        this.isOfferLetterAvailable=!row.isOfferLetterAvailable;
        
        this.displayApplicationDetail = true;
        this.displaySearchTable = false;
        this.applicationReferenceNumber=row.applicationReferenceNumber;
        this.getLoanApplicationById(row.loanApplicationId);
        this.getTransacDynamics(row.loanApplicationId);
        this.getConditionPrecident(row.loanApplicationId);
        this.getLoanDetailChangeLog(row);
        
    }

    selectapprover(row){
        this.approvalTrailId = row.approvalTrailId;
        this.nextLevelId = row.currentApprovalLevelId;
        this.displayApproverSearchForm = true;
    }

    refresh(){
        this.approvalTrailId = null;
        this.nextLevelId = null;
    }

    displayApproverSearchModal(event: boolean){
        this.displayApproverSearchForm = event;
        if(!event){
            this.refresh();
            this.reloadSearch();
        }
    }

    reloadSearch(){
        let body = {
            searchString: this.searchString
        };
        this.loadingService.show();
        this.loanService.loanReviewApplicationSearch(body).subscribe((response: any) => {
            //console.log('response--=>', JSON.stringify(response.result));
            this.applications = response.result;
            this.loadingService.hide();
            this.displaySearchForm = false;
            this.displaySearchTable = true;
            this.displayApplicationDetail=false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
    }

    isAmongActivities(activity: string): boolean {
        if (this.currentStaffActivities == undefined) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
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

  getLoanApplicationStatus(id) {
      let item = ApplicationStatus.list.find(x => x.id == id);
      return item == null ? 'n/a' : item.name;
  }

  getApplicationStatus(submitted, approvalStatus) {
      if (submitted == true) {
          if (approvalStatus == ApprovalStatus.PROCESSING)
              return '<span class="label label-info">CAM PROCESS</span>';
          if (approvalStatus == ApprovalStatus.AUTHORISED)
              return '<span class="label label-info">CAM PROCESS</span>';
          if (approvalStatus == ApprovalStatus.REFERRED)
              return '<span class="label label-info">CAM PROCESS</span>';
          if (approvalStatus == ApprovalStatus.APPROVED)
              return '<span class="label label-success">APPROVED</span>';
          if (approvalStatus == ApprovalStatus.DISAPPROVED)
              return '<span class="label label-danger">DISAPPROVED</span>';
      }
      return '<span class="label label-warning">NEW APPLICATION</span>';
  }
  // message

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

  cancelLoan(){
      this.hideCancelPanel=true;   
      this.hideGeneralInfoPanel=false; 
  }
  saveLoanApplicationCancellation()
  {

      var __this=this;

      swal({
          title: 'Are you sure?',
          text: 'This action will go for approvals. Are you sure you want to proceed?',
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

           let body = {
              cancellationReason: __this.cancellationReason,
              loanApplicationId:__this.application.loanApplicationId
          };
          this.subscriptions.add(
          __this.loanService.loanApplicationCancellationRequest(body).subscribe((response: any) => {
              __this.applications = response.result;
              __this.loadingService.hide();
              if(response.success==true){
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
              }else{
                  if(response.warning==true){
                  swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
                  }else{
                      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                  }
              }
              __this.displayApplicationDetail=false;
          }, (err: any) => {
              __this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'success');
              ////console.log('err',  err);
          }));

           __this.hideCancelPanel=false;   
           __this.hideGeneralInfoPanel=true; 

           __this.loadingService.hide();

      }, function (dismiss) {
          if (dismiss === 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });

  }

  
  cancelAction(){
  this.hideCancelPanel=false;   
      this.hideGeneralInfoPanel=true; 
  }

  getLoanApplicationById(id): void {
      this.loadingService.show();
      this.subscriptions.add(
      this.loanAppService.getLoanApplicationById(id).subscribe((response: any) => {
        this.loanApplicationDetail = response.result;
        ////console.log('Details>>>>>>>', this.loanApplicationDetail);
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
    }

  getLoanDetailChangeLog(row): void { // PLEASE LAZY LOAD THIS!!!
    this.subscriptions.add( 
    this.camService.getLoanDetailChangeLog(row.loanApplicationId).subscribe((response: any) => {
          this.changeLog = response.result;
      }, (err) => {
      }));
  }




  popoverSeeMore() {
          let path = '';
          const data = {
              applicationRefNumber:this.applicationReferenceNumber,
          }
          ////console.log(data);
          this.subscriptions.add(
          this.reportServ.getGeneratedOfferLetterLMS(data.applicationRefNumber).subscribe((response: any) => {
            ////console.log('report >>',data.applicationRefNumber);
            
                  path = response.result;
                  this.displayReport = true;
                  ////console.log(path);
                  this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
              }));
          return;
      
  }

  isCreator() {
    if (this.application == null) return false;
    const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
    return this.application.createdBy == user.staffId;
    }
  

// DOCUMENT


uploadFileTitle: string = null;
files: FileList;
file: File;
fileDocument: any;

supportingDocuments: any[] = [];
fileInput: any;

onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
}


uploadFile() {
    if (this.file != undefined || this.uploadFileTitle != null) {
        let body = {
            //  documentId:12332,
            loanApplicationId: this.application.loanApplicationId,
            loanApplicationNumber: this.application.applicationReferenceNumber,
            loanReferenceNumber: this.application.applicationReferenceNumber,
            documentTitle: this.uploadFileTitle,
            fileName: this.file.name,
            fileExtension: this.helperService.fileExtention(this.file.name),
            physicalFileNumber: 'n/a',
            physicalLocation: 'n/a',
            documentTypeId: '1', // TODO: redundant with fileExtension known
            databaseTable: 8,
            overwrite: false,
        };
        // console.log('body  >>',body);
        
        this.loadingService.show();
        this.documentpUloadService.uploadFile(this.file, body).then((response: any) => {
            if (response.result == 3) {
                body.overwrite = true;
                this.confirmOverwrite(body);
            } else {
                this.uploadFileTitle = null;
                // this.fileInput.nativeElement.value = "";
                this.getAllUploadedDocument(body);
            }
            this.loadingService.hide();
        }, (error) => {
            this.loadingService.hide(1000);
        });
    }
}

confirmOverwrite(body): void {
    const __this = this;
    swal({
        title: 'File already exist!',
        text: 'Are you sure you want to OVERWRITE it?',
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
        __this.documentpUloadService.uploadFile(__this.file, body).then((response: any) => {
        __this.uploadFileTitle = null;
        // __this.fileInput.nativeElement.value = "";
        __this.getAllUploadedDocument(body);
            __this.loadingService.hide();
        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
            __this.loadingService.hide();
        });
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
}
  
getAllUploadedDocument(body) {
    this.loadingService.show();
    //console.log("body",body);
    this.subscriptions.add(
    this.documentpUloadService.getAllUploadedDocument(body).subscribe((response: any) => {
        this.supportingDocuments = response.result;
        this.loadingService.hide();
        //this.uploadCount.emit(response.result.length);
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
    this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
        this.binaryFile = response.result.fileData;
        this.selectedDocument = response.result.documentTitle;
        this.displayDocument = true;
        this.loadingService.hide();
    }, (error) => {
        this.loadingService.hide(1000);
    }));
}

//   deleteDocument(row) {
//     this.loadingService.show();
//     this.documentpUloadService.deleteUploadedDocument(row).subscribe((response: any) => {
//         this.binaryFile = response.result.fileData;
//         this.getAllUploadedDocument(row);
//         this.loadingService.hide();
//     }, (error) => {
//         this.loadingService.hide(1000);
//     });
// }

deleteDocument(row): void {

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
        __this.documentpUloadService.deleteUploadedDocument(row).subscribe((response: any) => {
            __this.binaryFile = response.result.fileData;
            __this.loadingService.hide();

            __this.getAllUploadedDocument(row);

        }, (err: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
            __this.loadingService.hide();
        }));
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
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
        // saveAs(file)
    }
}


DownloadDocument(id: number) {
    this.fileDocument = null;
    this.subscriptions.add(
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
    }));
}
}

