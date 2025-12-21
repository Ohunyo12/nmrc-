import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoanService, CreditAppraisalService, LoanApplicationService } from '../services';
import { ApplicationStatus } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { ReportService } from 'app/reports/service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-draw-down-application-status',
  templateUrl: './draw-down-application-status.component.html',
  styleUrls: ['./draw-down-application-status.component.scss']
})
export class DrawDownApplicationStatusComponent implements OnInit {
  displaySearchForm: boolean = false;
  searchForm: FormGroup;
  applications: any[];
  displaySearchTable: boolean = true;
  searchString: any;
 
  drawdownHtml: any;
  application: any = {};
  isOfferLetterAvailable: any;
  hideGeneralInfoPanel: boolean;
  readonly OPERATION_ID: number = 6;
  documentations: any[] = [];
  displayDocumentation: boolean = false;
  loanApplicationDetail: any;
  dynamicsList: any;
  conditionList: any;
  readonly DRAWDOWNDOC: string ="DRAW DOWN DOCUMENTS";
  reload: number = 0;
  changeLog: any;
  staffRoleId: any;
  cancellationReason: any;
  isApplicationCancelled: boolean;
  applicationStatusId: any;
  displayApplicationDetail: boolean = false;
  applicationReferenceNumber: any;
  loanApplicationId:any
  ready: boolean = false;
  displayReport: boolean;
  reportSrc: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private camService: CreditAppraisalService,
    private loanAppService: LoanApplicationService,
    private loadingService: LoadingService,
    private reportServ: ReportService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() { 
    this.clearControls();
    this.hideGeneralInfoPanel = true;
  }

  showSearchForm() { this.displaySearchForm = true; }

  view(row){
    this.application = row;
    // console.log("this.loanApplicationId",this.loanApplicationId)
    this.isOfferLetterAvailable = !row.isOfferLetterAvailable;
    
    if (row.applicationStatusId == 22) { 
      this.isApplicationCancelled = true;
  }
  else {
      this.isApplicationCancelled = false;
  }
  
  this.getDrawdownMemoHtml(row.bookingRequestId);
  this.applicationStatusId = row.applicationStatusId
  this.displayApplicationDetail = true;
  this.displaySearchTable = false;
  this.applicationReferenceNumber = row.applicationReferenceNumber;
  this.getLoanApplicationById(row.loanApplicationId);
  this.getTransacDynamics(row.loanApplicationId);
  this.getConditionPrecident(row.loanApplicationId);
  this.getAllUploadedDocument(row);
  this.getLoanDetailChangeLog(row);
  this.reload++;
  }

  submitForm(form) {
    this.searchString = form.value.searchString;  
    let body = {
        searchString: form.value.searchString
    };
    
    this.loanService.drawDownApplicationSearch(body).subscribe((response: any) => { 
        this.applications = response.result;
    
        this.displaySearchForm = false;
        this.displaySearchTable = true; 
        
    }, (err: any) => {
    
    });
}


getDrawdownMemoHtml(targetId) {
  this.camService.getDrawdownMemoHtml(targetId).subscribe((response: any) => {
      if (response.result == null) return;
      this.drawdownHtml = response.result;
  }, (err) => {
      //
  });
}

printMemo(): void {
  let printTitle = 'DRAWDOWN MEMO';
  let printContents, popupWin;
  printContents = document.getElementById('print-drawdown-section').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
        <head>
        <title>${printTitle}</title>
        <style>s
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
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

getTransacDynamics(loanApplicationId): void {
  this.reload = 0;
  this.loadingService.show();
  this.camService.getTransacDynamics(loanApplicationId).subscribe((response: any) => {
      this.dynamicsList = response.result;
      this.loadingService.hide();
  }, (err) => {
      this.loadingService.hide(1000);
  });
}

closeGrid(){
  this.displayApplicationDetail=false;
  this.displaySearchTable = true;
}

getConditionPrecident(loanApplicationId): void {
  this.reload = 0;
  this.loadingService.show();
  this.camService.getLoanConditionPrecidents(loanApplicationId).subscribe((response: any) => {
      this.conditionList = response.result;
      this.loadingService.hide();
  }, (err) => {
      this.loadingService.hide(1000);
  });
}

getAllUploadedDocument(value) {
  let data = {
      loanApplicationNumber: value.applicationReferenceNumber,
      databaseTable: 8
  }
}

getLoanDetailChangeLog(row): void { // PLEASE LAZY LOAD THIS!!!
  this.camService.getLoanDetailChangeLog(row.loanApplicationId).subscribe((response: any) => {
      this.changeLog = response.result;
  }, (err) => {
  });
}

previewDocumentation(print = false) {
  this.loadingService.show();
  this.camService.getDocumentation(this.OPERATION_ID, this.application.loanApplicationId).subscribe((response: any) => {
      this.documentations = response.result;
      this.loadingService.hide();
      if (print == false) this.displayDocumentation = true;
  }, (err) => {
      this.loadingService.hide(1000);
  });
}

print(): void {
  this.previewDocumentation(true);
  let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.application.applicationReferenceNumber;
  let printContents, popupWin;
  printContents = document.getElementById('print-section').innerHTML;
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  popupWin.document.open();
  popupWin.document.write(`
    <html>
        <head>
        <title style="font face: arial; size:12px">${printTitle}</title>
        <style>
        //........Customized style.......
        </style>
        </head>
        <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
    </html>`
  );
  popupWin.document.close();
}

isCreator() {
  if (this.application == null) return false;
  const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
  return this.application.createdBy == user.staffId;
}

closeDocumentation() {
  this.displayDocumentation = false;
  this.documentations = [];
}
   
getLoanApplicationStatus(id) {
  let item = ApplicationStatus.list.find(x => x.id == id);
  return item == null ? 'n/a' : item.name;
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

saveLoanApplicationCancellation(){

}

// popoverSeeMore() { 
//   this.ready=false; 
//   this.loadingService.show();
//   let path = '';
//   const data = {
//       applicationRefNumber: this.applicationReferenceNumber,
//   }
//   this.reportServ.getGeneratedOfferLetter(data.applicationRefNumber).subscribe((response: any) => {
//       path = response.result;
//       this.displayReport = true;
     
//       this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);

//       this.ready=true;
//   });
//   this.loadingService.hide(5000);
//    return;
// }

  clearControls() {
    this.searchForm = this.fb.group({
        searchString: ['', Validators.required],
    });
    // this.commentForm = this.fb.group({
    //     comment: ['', Validators.required],
    // });
}

}
