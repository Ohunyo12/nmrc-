import { Subject } from 'rxjs';
import { CallMemoService } from '../../../setup/services/call-memo.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { Component, OnInit, Input } from '@angular/core';
import swal from 'sweetalert2';
import { ApprovalService } from 'app/setup/services/approval.service';
import { Server } from 'selenium-webdriver/safari';
import { CreditAppraisalService } from 'app/credit/services';
import { StaffRoleService } from 'app/setup/services';
@Component({
  selector: 'app-call-memo',
  templateUrl: './call-memo.component.html',
})
export class CallMemoComponent implements OnInit {

  entityName: string = "Add New Call Memo";
  displayCallMemoModal: boolean = false;
  displayCallMemoComments: boolean = false;
  displaySearchModal: boolean = false;
  displayLoanSearchBtn: boolean = false;
  callMemoTableData: any[] = [];
  callLimitTypes: any[] = [];
  callMemoForm: FormGroup;
  searchTerm$ = new Subject<any>();
  searchResults: any[] = [];
  customerName: string;
  selectedId: number = null;
  searchString: string;
  displayCallMemo: boolean = false;
  documentUploadComponent: boolean = false;
  memoUploadForm: FormGroup;
  deleteLink: boolean = false;
  showUploadForm: boolean = false;
  originalDocumentApprovalId: any;
  operationId: any;
  customerId: any;
  applicationReferenceNumber: any;
  activeTabindex: any = 0;
  originalDocumentApprovals: any;
  targetId: any;
  callMemoId: any;
  approvalStatus: any;
  startDate: any;
  endDate: any;
  searchText: any;
  searchName: any;
  callMemoSearchData: any;
  callMemoApprovedData: any;
  ckEditorContent: any;
  trailApprovalLevels: any[];
  callMemoHtml: any;
  readonly OPERATION_ID: number = 150;
  userisAnalyst:boolean = false;
  userIsRelationshipManager = false;
  userIsAccountOfficer = false;
  staffRoleRecord: any;
  callMemoTrailData: any[] = [];

  participants: any;
  customerBackground: any;
  recentUpdate: any;
  meetingHighlights: any;

  readonly template: string = "<table width='100%' border='1'><tr><td>SN</td><td>Action plan</td><td>Responsibility</td><td>Time line</td></tr><tr><td></td><td></td><td></td><td></td></tr></table>";

  @Input() set reload(value: number) { if (value > 0) this.getOriginalDocumentApprovals(); }

  constructor(private fb: FormBuilder, private loadingService: LoadingService,
    private callMemoService: CallMemoService,
    private approvalService: ApprovalService,
    private camService: CreditAppraisalService,
    private staffRole: StaffRoleService,
  ) {
    this.callMemoService.searchForLoan(this.searchTerm$)
      .subscribe(results => {
        if (results.success == true) {
          this.searchResults = results.result;
        }
        else {
          swal('FinTrak Credit 360', results.message, 'error');
        }
        ////console.log('search item', this.searchResults);
      });
  }


  ngOnInit() {
    this.loadAllCallMemo();
    this.loadAllCallLimitType();
    this.clearControl();
    this.InitializeForm();
    this.getApprovalTrail();
    this.getUserRole();
  }

  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
        this.staffRoleRecord = res.result;
            if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') { 
                this.userIsAccountOfficer = true; 
            }
            if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                this.userIsRelationshipManager = true; 
            }
        });
}

  getCallMemoHtml(id) {
    this.camService.getCallMemoHtml(id).subscribe((response: any) => {
        if (response.result == null) return;
        this.callMemoHtml = response.result;
    }, (err) => {
      
    });
}

  getApprovalTrail() {
    this.loadingService.show();
    this.camService.getTrailCallMemo(this.OPERATION_ID).subscribe((response: any) => {
        if(response.success){
            this.trailApprovalLevels = response.result;
            this.loadingService.hide();
        }
    }, (err) => {
        this.loadingService.hide(1000);
    });
}


  contentChange(updates) {
    this.ckEditorContent = updates;
  }

  participantsChange(updates) {
    this.participants = updates;
  }

  customerBackgroundChange(updates) {
    this.customerBackground = updates;
  }
  recentUpdateChange(updates) {
    this.recentUpdate = updates;
  }
  meetingHighlightsChange(updates) {
    this.meetingHighlights = updates;
  }

  InitializeForm() {
    this.memoUploadForm = this.fb.group({
      description: ['', Validators.required],
      applicationReferenceNumber: ['', Validators.required]
    });
  }

  clearControl() {
    this.callMemoForm = this.fb.group({
      background: [''],
      staffId: [''],
      cc: ['', Validators.required],
      customerName: [''],
      customerCode: ['', Validators.required],
      participants: [''],
      memoDate: ['', Validators.required],
      nextCallDate: [''],
      nextCallTime: [''],
      callTime: ['', Validators.required],
      purpose: ['', Validators.required],
      discusion: [''],
      approvalLevelId: [''],
      location: ['', Validators.required],
      recentUpdate: [''],
    });
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  closeSearchBox(evt) {
    evt.preventDefault();
    this.displaySearchModal = false;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  searchDataBase() {
    this.callMemoService.searchForLoanByCallLimit(this.searchString)
      .subscribe(results => {
        if (results.success == true) {
          this.searchResults = results.result;
        }
        else {
          swal('FinTrak Credit 360', results.message, 'error');
        }
        ////console.log('search item', this.searchResults);
      });
  }

  pickSearchedData(item) {
    // this.callMemoForm.controls['loanApplicationId'].setValue(item.loanApplicationId);
    this.callMemoForm.controls['customerCode'].setValue(item.customerCode);
    this.callMemoForm.controls['customerName'].setValue(item.customerName);
    this.customerName = item.customerName;
    this.customerId = item.customerId;
    this.displaySearchModal = false;
  }

  loadAllCallLimitType() {
    this.callMemoService.getAllCallLimitType().subscribe((data) => {
      this.callLimitTypes = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  loadAllCallMemo() {
    this.callMemoService.getAllCallMemo().subscribe((data) => {
      this.callMemoTableData = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  ShowAddMemoForm() { 
    this.clearControl();
    this.ckEditorContent = this.template;
    this.displayCallMemoModal = true;
  }

  viewEditCallMemo(index, data) {
    this.entityName = "View Call Memo";
    var row = null;
    row = this.callMemoTableData[index];
    this.getCallMemoHtml(row.callMemoId);
    this.selectedId = row.callMemoId;
    this.displayCallMemo=true;
    this.callMemoId = row.callMemoId;

  }

  editCallMemo(index, data) {
    this.entityName = "Edit Call Memo";
    var row = null;

    if (this.activeTabindex == 0) {
      row = this.callMemoTableData[index];
      
    }
    else if (this.activeTabindex == 1) {
      row = this.callMemoApprovedData[index];
      
    }
 
    this.selectedId = row.callMemoId;
    this.callMemoForm = this.fb.group({
      location: [row.location],
      customerName: [row.customerName],
      cc: [row.cc],
      customerCode: [row.customerCode],
      memoDate: [new Date(row.memoDate), Validators.required],
      nextCallDate: [new Date(row.nextCallDate)],
      purpose: [row.purpose, Validators.required],
      approvalLevelId: [row.approvalLevelId],
      nextCallTime: [new Date(row.callTime)],
      callTime: [new Date(row.nextCallTime)],     
    });

    this.ckEditorContent = row.action;
    this.participants =  row.participants,
    this.customerBackground = row.background;
    this.recentUpdate = row.recentUpdate;
    this.meetingHighlights =row.discusion;

    this.displayCallMemoModal = true;

  }

  submitcallMemoForm(formObj) {
    this.entityName = "Add Call Memo";
    this.loadingService.show();
    const bodyObj = formObj.value;
    bodyObj.customerId = this.customerId;
    bodyObj.action = this.ckEditorContent;
    bodyObj.participants = this.participants;
    bodyObj.background = this.customerBackground;
    bodyObj.recentUpdate = this.recentUpdate;
    bodyObj.discusion = this.meetingHighlights;
    
    if (this.selectedId === null) {
      this.callMemoService.addCallMemo(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.callMemoId = res.result;
          this.loadAllCallMemo();
          //this.getCustomerCallMemo(this.customerId);
          this.loadingService.hide();
          swal('FinTrak Credit 360', res.message, 'success');
          this.displayCallMemoModal = false;
          
        } else {
          swal('FinTrak Credit 360', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('FinTrak Credit 360', JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else {
      this.callMemoService.updateCallMemo(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.loadingService.hide();
          this.selectedId = null;
          this.loadAllCallMemo();
          swal('FinTrak Credit 360', res.message, 'success');
          this.displayCallMemoModal = false;
        } else {
          swal('FinTrak Credit 360', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('FinTrak Credit 360', JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
          this.ckEditorContent = null;
          this.participants = null;
          this.customerBackground = null;
          this.recentUpdate = null;
          this.meetingHighlights = null;
  }

  getCustomerCallMemo(customerId: Number) {
    this.callMemoService.getCustomerCallMemo(customerId).subscribe((data) => {
      this.callMemoTableData = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  getCustomerApprovedCallMemo(customerId: Number) {
    this.callMemoService.getCustomerApprovedCallMemo(customerId).subscribe((data) => {
      this.callMemoApprovedData = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  getCallMemoTrail(applicationId, operationId) {
    this.callMemoService.getCallMemoTrail(applicationId, operationId).subscribe((data) => {
      this.callMemoTrailData = data.result;
    }, (err) => {
      ////console.log('Error', err);
    });
  }

  viewEditCallMemo2(data) {
    this.getCallMemoHtml(data.callMemoId);
    this.callMemoId = data.callMemoId;
    this.displayCallMemo=true;
  
  }

  comments(){
    this.getCallMemoTrail(this.callMemoId, this.OPERATION_ID);
    this.displayCallMemoComments = true;
    this.displayCallMemo=false;
  }

  getCallMemoById(callMemoId: Number) {
    this.callMemoService.getCallMemoById(callMemoId).subscribe((res) => {
      if (res.success == true) {
        //console.log("Test3: ", res);
        this.callMemoTableData = res.result;
      }
    }, (err: any) => { });
  }

  uploadMemoDocument(row) {
    //console.log('row: ', row);
    this.customerId = row.customerId;
    // this.targetId = row.loanApplicationId;
    this.targetId = row.callMemoId;
    this.operationId = row.operationId;
    this.showUploadForm = true;
  }

  getOriginalDocumentApprovals() {
    this.approvalService.getOriginalDocumentApprovals().subscribe((response: any) => {
      this.originalDocumentApprovals = response.result;
    });
  }

  goForApproval() {
    let __this = this;

    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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

      let body = {
        callMemoId: __this.targetId,
        //customerId: __this.customerId//CallMemoId
      };
     
        __this.callMemoService.goForApproval(body).subscribe((response: any) => { 
        if (response.success == true) {
          __this.approvalStatus = response.result;
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully! Call Memo currently going for approval!!', 'success');
          __this.loadAllCallMemo();
          //__this.getCustomerCallMemo(__this.customerId);
         // __this.getCustomerApprovedCallMemo(__this.customerId);
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Error occured saving this record! try again', 'error');
        }

      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

    __this.showUploadForm = false;
  }

  searchCallMemo() {
    let data = {
      startDate: this.startDate,
      endDate: this.endDate,
      customerName: this.searchName
    }

    this.callMemoService.searchCallMemo(data).subscribe((res) => {
      this.callMemoApprovedData = res.result;
    }, (err) => {
    });
  }

  onTabChange(index){
    this.activeTabindex = index;
  }

  print(): void {
    let printTitle = 'CALL MEMO';
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
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

}

