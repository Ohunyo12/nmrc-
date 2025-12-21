import { saveAs } from 'file-saver';
import { LoadingService } from '../../../shared/services/loading.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { ChecklistService } from '../../../setup/services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-defferal-management',
  templateUrl: './defferal-management.component.html',
})
export class DefferalManagementComponent implements OnInit {
  displayUpload: boolean;
  binaryFile: string;
  selectedDocumentName: string;
  loanApplicationId: number;
  msgs: Message[] = [];
  today = new Date();
  singleDeferredAndWaivedDocument: any[];
  deferredAndWaivedDocument: any[];
  displayDeferralDetails: boolean = false;
  displayExtentDeferral: boolean = false;
  displayDeferralProvided: boolean = false;
  conditionId: number;
  deferredDocument: string;
  extensionReason: string;
  extensionDate: string;
  hasDocument: boolean;
  deferralDocumentUpload: any[];
  deferralDeletedDocumentUpload: any[];
  viewUpload: any;
  deferralTrailData: any[];
  readonly operationId: number = 42;
  excludeLegal: boolean;
	loanApplicationDetailId: any;
	approvalTrailId = 0;
	displayApproverSearchForm = false;
	currentStaffActivities: string[] = [];

  constructor(private loadingService: LoadingService, private loanAppService: LoanApplicationService,
     private checklistService: ChecklistService,private sanitizer: DomSanitizer, ) { }

  ngOnInit() {
	  this.getAllDeferralChecklist();
	  this.currentStaffActivities = JSON.parse(sessionStorage.getItem('userActivities'));
  }

  viewDetails(row, evt) {
    // console.log("row: ", row);
    evt.preventDefault();
    this.conditionId = row.conditionId;
    this.loanApplicationId = row.loanApplicationId;
    this.loanApplicationDetailId = row.loanApplicationDetailId;
    this.getDeferralChecklistByConditionId(this.conditionId)
    this.getConditionPrecedentDocumentUpload(this.conditionId);
    this.getConditionPrecedentDeletedDocumentUpload(this.conditionId);
    this.getDeferralApprovalTrail(row.conditionId, row.operationId);
    this.getDrawdownDeferralMemo(row.operationId,row.loanApplicationDetailId);
    this.displayDeferralDetails = true;
  }


  printSelectedSection(): void {
        let printTitle = 'DEFERRAL MEMO No.:' + this.conditionId;
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
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

  displayReferBackForm: boolean = false;
  ckEditorContent: any[] = [];
  reportSrc: SafeResourceUrl;
  displayTestReport: boolean = false;
  displayReport: boolean = false;

  getDrawdownDeferralMemo(operationId,targetId) {
    this.checklistService.getDrawdownDeferralMemo(operationId, targetId).subscribe((response: any) => {
        if (response.result == null) return;
         this.displayReferBackForm = false;
        this.ckEditorContent = response.result;
    }, (err) => {
       
    });
 }
 
 
 getDeferralWaiverPdf() {
   let path = '';
    this.checklistService.getDeferralWaiverPdf(this.operationId, this.conditionId, this.loanApplicationDetailId).subscribe((response: any) => {
        if (response.result == null) return;
         path = response.result;
         this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
         this.displayTestReport = true;
         this.displayReport = true;
    }, (err) => {
       
    });
 }
 

  getAllDeferralChecklist() {
    this.loadingService.show();
    this.checklistService.getAllDeferralChecklist().subscribe((response: any) => {
      this.deferredAndWaivedDocument = response.result;
      this.loadingService.hide();
    });
  }

  deleteDocumentUpload(row) {
    const __this = this;
    swal({
        title: 'File DELETE operation!',
        text: 'Are you sure you want to DELETE the file '+ row.fileName +'?',
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
        __this.checklistService.deleteUploadDocument(row.documentId).subscribe((response: any) => {
          __this.getDeferralChecklistByConditionId(row.conditionId)
          __this.getConditionPrecedentDocumentUpload(row.conditionId);
          __this.getConditionPrecedentDeletedDocumentUpload(row.conditionId);
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
  getDeferralChecklistByConditionId(conditionId) {
    this.loadingService.show();
    this.checklistService.getDeferralChecklistByConditionId(conditionId).subscribe((response: any) => {
      this.singleDeferredAndWaivedDocument = response.result;
      this.deferredDocument = this.singleDeferredAndWaivedDocument[0].condition;
      this.loadingService.hide();
    });
  }
  showDeferralExtention() {
    this.displayExtentDeferral = true;
  }
  submitDeferralExtention() {
    if (this.today > new Date(this.extensionDate)) {
      this.showSuccess('info', `Extended date cannot be less than today's date`);
      return;
    }
    if (this.hasDocument) {

    }
    let body = {
      conditionId: this.conditionId,
      reason: this.extensionReason,
      deferedDate: this.extensionDate
    };
    this.loadingService.show();
    this.checklistService.extendChecklistDeferralDate(body).subscribe((res) => {
      if (res.success == true) {
        if (this.uploadFileTitle != null) {
          this.uploadFile();
        }
        this.getDeferralChecklistByConditionId(this.conditionId)
        this.loadingService.hide();
        this.showSuccess('success', res.message);
        this.extensionReason = null;
        this.extensionDate = null;
        this.displayExtentDeferral = false;
      } else {
        this.loadingService.hide();
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  showDeferralProvided() {
    this.displayDeferralProvided = true;
    this.excludeLegal = false;
  }
  
  submitDeferralProvided() {
    this.loadingService.show();

    let body = {
      conditionId: this.conditionId,
      excludeLegal: this.excludeLegal
    };
    
    this.checklistService.updateProvidedChecklist(body).subscribe((res) => {
      if (res.success === true) {
        if (this.uploadFileTitle != null) {
          this.uploadFile();
        }
        this.getAllDeferralChecklist();
        this.loadingService.hide();
        this.showSuccess('success', res.message);
        this.conditionId = null;
        this.displayDeferralProvided = false;
        this.displayDeferralDetails = false;
      } else {
        this.loadingService.hide();
        this.showSuccess('error', res.message);
      }
    }, (err) => {
      this.loadingService.hide();
      this.showSuccess('error', JSON.stringify(err));
    });
  }

  // file upload
  uploadFileTitle: string = null;
  files: FileList;
  file: File;

  @ViewChild('fileInput', {static: false}) fileInput: any;
  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
    this.uploadFileTitle = this.file.name;
  }
  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }
  uploadFile() {
    if (this.file != undefined || this.uploadFileTitle != null) {
      let body = {
        conditionId: this.conditionId,
        loanApplicationId: this.loanApplicationId,
        fileName: this.file.name,
        fileExtension: this.fileExtention(this.file.name),
        physicalFileNumber: 'n/a',
        physicalLocation: 'n/a',
      };
      this.loadingService.show();
      this.checklistService.uploadFile(this.file, body).then((val: any) => {
        this.uploadFileTitle = null;
        this.fileInput.nativeElement.value = "";
        this.showSuccess('success', 'Uploaded Successfully...');
        this.loadingService.hide();
      }, (error) => {
        this.loadingService.hide(1000);
        this.showSuccess('error', 'Upload not Successful...');
      });
    }
  }
  getConditionPrecedentDocumentUpload(conditionId) {
    this.checklistService.getConditionPrecedentDocumentUpload(conditionId).subscribe((data) => {
      if (data.success == true) {
        this.deferralDocumentUpload = data.result;
      } else {
        this.showSuccess('info', 'No upload found for this deferral');
      }
    });
  }

  getConditionPrecedentDeletedDocumentUpload(conditionId) {
    this.checklistService.getConditionPrecedentDeletedDocumentUpload(conditionId).subscribe((data) => {
      if (data.success == true) {
        this.deferralDeletedDocumentUpload = data.result;
      } else {
        this.showSuccess('info', 'No upload found for this deferral');
      }
    });
  }


  fileDocument: any;
  selectedDocument: any;
  viewDocument(d, view = false) {
    this.fileDocument = null;
    this.loadingService.show();
    this.checklistService.ViewConditionPrecedentDocumentUpload(d).subscribe((response: any) => {
        this.fileDocument = response.result;
        if (this.fileDocument != null) {
            this.loadingService.hide();
            const downloadedFileName = this.fileDocument.fileName;
            this.binaryFile = this.fileDocument.fileData;
            this.selectedDocument = this.fileDocument.documentTitle;
  
            if (view) {
                this.displayUpload = true;
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


  showSuccess(type, message) {
    this.msgs = [];
    this.msgs.push({ severity: type, summary: 'FinTrak Credit 360', detail: message });
  }

  getDeferralApprovalTrail(targetId, operationId) {
    this.checklistService.getDeferralApprovalTrail(targetId, operationId).subscribe((data) => {
      this.deferralTrailData = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  setExcludeLegal(event) {
    if (event.target.checked == true) {
        this.excludeLegal = true;
        // this.loanApplicationForm.controls['approvedLimitId'].disable();
    } else{
        this.excludeLegal = false;
    }
  }
  
	selectapprover(row) {
		this.approvalTrailId = row.approvalTrailId;
		this.displayApproverSearchForm = true;
	}

	isAmongActivities(activity: string): boolean {
		if (this.currentStaffActivities == undefined) {
			return false;
		}
		return (this.currentStaffActivities.indexOf(activity) >= 0);
	}

	displayApproverSearchModal(event: boolean) {
		this.displayApproverSearchForm = event;
		if (!event) {
			this.getAllDeferralChecklist();
		}
	}

}
