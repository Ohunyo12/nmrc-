import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { ProductService } from 'app/setup/services/product.service';
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
import { StaffRoleService } from 'app/setup/services';
import { LoanOperationService } from 'app/credit/services';

@Component({
  selector: 'app-unfreeze-overdraft-lien',
  templateUrl: './unfreeze-overdraft-lien.component.html'
})
export class UnfreezeOverdraftLienComponent implements OnInit,OnDestroy {

  
  operations: any;
  products: any[];
  applications: any[];
  lienApplications: any[]=[];
  displaySearchForm:boolean=false;
  displayLienModal: boolean=false;
  searchForm: FormGroup;
  LienRemovalForm: FormGroup;
  activeTabindex:any;
  hideCancelPanel:boolean;
  hideGeneralInfoPanel:boolean;
  cancellationReason: any;
  loanApplicationId: any;
  loanApplicationDetail: any;
  showCancelButton:boolean=true;
  activeSearchTabindex: any;
  displaySearchTable:boolean=true;
  lienRemovalData: any[] = [];
  reload: number = 0;
  duplications: any;
  proposedItems: any;
  facilityCount: any;
  dynamicsList: any;
  conditionList: any;
  trailCount: number = 0;
  trail23: any[] = [];
  visible:boolean=false;
  isAnalyst: boolean = false;
  allRequiredDocumentsAreUploaded = true;
  displayRemoveLienModal: boolean = false;
  selectedId: any;
  changeLog: any;
  backtrail: any[] = [];
  reportSrc: SafeResourceUrl;
  applicationReferenceNumber: any;
  displayReport: boolean;
  isOfferLetterAvailable: any;
  isLMS:boolean=true;
  panelTitle = '';

  trailLevels: any[] = [];
  trailRecent: any = null;

  private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

  constructor(
      private loadingService: LoadingService,
      private productService: ProductService,
      private loanService: LoanService,
      private fb: FormBuilder,
      private sanitizer: DomSanitizer,
      private loanAppService: LoanApplicationService,
      private camService: CreditAppraisalService,
      private documentpUloadService: DocumentpUloadService,
      private reportServ: ReportService,
      private helperService: HelperService,
      private staffRole: StaffRoleService,
      private loanOperationService: LoanOperationService,
  ) { }
  
  ngOnInit() {
      this.clearControls(); 
      this.hideCancelPanel=false;   
      this.hideGeneralInfoPanel=true;  
      this.getUserRole();  
      this.getAllLienRemovalRecords();
  }

  getAllLLienRemovalDocuments(lienRemovalId) {
    this.loadingService.show();
    this.loanOperationService.getAllLLienRemovalDocuments(lienRemovalId).subscribe((response: any) => {
        this.lienRemovalData = response.result;
        this.loadingService.hide();
    });
}

  userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsUserAdmin = false;
    staffRoleRecord: any;

    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') { 
                    this.userIsAccountOfficer = true; 
                }
                if(this.staffRoleRecord.staffRoleCode == 'USER ADMIN') { 
                    this.userIsUserAdmin =true;
                }
                if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager = true; 
                }
               
            });
    }
    
  setrequiredUploadValue(value: boolean) {
    this.allRequiredDocumentsAreUploaded = value;
    // console.log( this.allRequiredDocumentsAreUploaded);
}

  clearControls() {
      this.searchForm = this.fb.group({
          searchString: ['', Validators.required],
      });

      this.LienRemovalForm = this.fb.group({
        requestDate: ['', Validators.required],
        comment: ['', Validators.required],
        fileData: ['', Validators.required],
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
      let body = {
          searchString: form.value.searchString
      };
      this.loadingService.show();
      this.subscriptions.add(
      this.loanService.loanLienApplicationSearch(body).subscribe((response: any) => {
          this.applications = response.result;
          this.loadingService.hide();
          this.displaySearchForm = false;
          this.displaySearchTable = true;
          this.displayApplicationDetail=false;
      }, (err: any) => {
          this.loadingService.hide(1000);
      }));
  }

  getAllLienRemovalRecords() { 
    this.loadingService.show();   
     this.loanService.LienApplications().subscribe((response: any) => {
        this.lienApplications = response.result;
        this.displayApplicationDetail=false;
        this.loadingService.hide();
    }, (err: any) => {
        this.loadingService.hide(1000);
    });
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

  viewLien(row) {
    this.application = row;
    this.displayLienModal = true;
    this.isOfferLetterAvailable=!row.isOfferLetterAvailable;
    this.applicationReferenceNumber=row.applicationReferenceNumber;
    //this.getLoanApplicationById(row.loanApplicationId);
    //this.getTransacDynamics(row.loanApplicationId);
    //this.getConditionPrecident(row.loanApplicationId);
    //this.getLoanDetailChangeLog(row);
    this.getAllLLienRemovalDocuments(row.lienRemovalId);
    this.getTrail23(row.lienRemovalId, row.lienRemovalOperationId);
}

  initiateLienRemoval(row) {
    this.application = row;
    this.displayRemoveLienModal = true;
}
 
getTrail23(lienRemovalId, lienRemovalOperationId) {
    this.loadingService.show();
    this.subscriptions.add(
            this.camService.getTrailLms(lienRemovalId, lienRemovalOperationId).subscribe((response: any) => {
            this.trail23 = response.result;
            this.trailCount = this.trail23.length;
            this.trailRecent = response.result[0];
            this.referBackTrail23();
            response.result.forEach((trail23) => {
                if (this.trailLevels.find(x => x.requestStaffId === trail23.requestStaffId) === undefined) {
                    this.trailLevels.push(trail23);
                }
            });

            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        }));
}

referBackTrail23(): any {
    this.trail23.forEach(x => {
        if (this.backtrail.find(t => t.fromApprovalLevelId == x.fromApprovalLevelId
            && t.requestStaffId == x.requestStaffId) == null && x.fromApprovalLevelId != null) {
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

fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
}

confirmOverwriteLien(): void {
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
        __this.saveRemoveLien(true);
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
}

saveRemoveLien(form, overwrite = false) { //add-remove-lien
    let body = {
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        fileSize: this.file.size,
        casaLienAccountId: this.application.casaLienAccountId,
        loanReferenceNumber: this.application.loanReferenceNumber,
        comment: form.value.comment,
        requestDate: form.value.requestDate,
        fileSizeUnit: 'kilobyte',
        overwrite: overwrite
    };

    this.loadingService.show();
    if (this.selectedId == null) {
        this.camService.saveRemoveLien(this.file, body).then((response: any) => {
            this.loadingService.hide();
            
            if (response.result == 3) {
                this.confirmOverwriteLien();
            } else {
                if (response.success == true) {
                    this.getAllLienRemovalRecords();
                    this.displayRemoveLienModal = false;
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.reloadGrid();
                    //this.loadingService.hide();
                }
                else this.finishBad(response.message);
                
            }
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    } else {
        this.camService.UpdateRemoveLien(body, this.selectedId).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.getAllLienRemovalRecords(); 
                this.displayRemoveLienModal=false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                this.reloadGrid();
            }
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    }
}

reloadGrid() {
    // this.displayImagesReport = false;
    // this.displayProjectSiteReportForm = false;
    // this.getProjectSiteReports();

}

displayLienRemoval(){
    //this.proposedCollateral = null;
    this.displayRemoveLienModal = false;
    //this.schemeSelection = {};
  }

  DownloadLienDocument(row, view = false) {  
    this.fileDocument = null;
    this.loadingService.show();
    this.camService.downloadLienDocument(row.unfreezeLienAccountId).subscribe((response: any) => {
      this.fileDocument = response.result;

      if (this.fileDocument != null) {
        this.loadingService.hide();
        const downloadedFileName = this.fileDocument.fileName;
        this.binaryFile = this.fileDocument.fileData;
        this.selectedDocument = this.fileDocument.fileName;

        if (view) {
          this.displayDocument = true;
          return;
         }

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
            var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'png' || myDocExtention == 'png') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'image/png' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
        if (myDocExtention == 'doc' || myDocExtention == 'docx') {
          try {
            var file = new File([bb], downloadedFileName, { type: 'application/msword' });
            saveAs(file);
          } catch (err) {
            var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
            window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
          }
        }
      }

    }, (error) => {
      this.loadingService.hide(1000);
    });
  }

}

