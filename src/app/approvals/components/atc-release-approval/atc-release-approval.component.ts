import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from 'app/credit/services/loan.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoanApplicationService, CreditAppraisalService } from 'app/credit/services';

@Component({
  selector: 'app-atc-release-approval',
  templateUrl: './atc-release-approval.component.html',
  //styleUrls: ['./atc-release-approval.component.scss']
  providers: [AtcReleaseApprovalComponent]
})
export class AtcReleaseApprovalComponent implements OnInit {
  AtcLodgments: any;
  searchCustomerId: any;
  customerId: any;
  showCusotmerSearch: boolean;
  atcLodgmentId: any;
  showAdditionalDocument: boolean;
  AtcLodgmentDetailList: any;
  displayAccountBalance: boolean;
  activeTabindex: any;
  showRelease: boolean = false;
  atcLodgement: any;
  atcReleaseForm: FormGroup;
  show: boolean = false; message: any; title: any; cssClass: any;
  AtcReleaseDetail: any;
  comment: any;
  approvalStatusId: any;
  showApprovalBottun: any;
  releaseId: any;
  approvalReleaseData: any;
  accountBalances: any;
  commentList: any;
  operationId: any;
  targetId: any;
  commentForm: FormGroup;
  displayCommentForm: boolean;
  loanSelection: any;
  trailApprovalLevels: any;
  rowSelected: boolean = false;
  atcReleaseApprovals: any[] = [];
  arrayLength: any = 0;
  atcReleaseDataForApproval: any[] = [];
  editRowData: any[];
  editModal: boolean;
  convertedUnitToRelease: number;
  editedData: any[] = [];
  editedLength: number = 0;
  unitToRelease: number;
  editSelection: any;
  selectedId: any;
  editedDataBody: any;
  staffRoleId: any;
  makeEditButtonVisible: boolean = false;
  customerATC: any;
  customerATCSum: any;

  constructor(
    private loadingService: LoadingService,
    private loanService: LoanService,
    private fb: FormBuilder,
    private loanBookingService: LoanService,
    private camService: CreditAppraisalService,
    private loanApplService: LoanApplicationService
  ) { }

  ngOnInit() {
    this.getAtcLodgments();
    this.clearInput();
    this.showCommentForm(true);
    this.approvalStatusId = 0;
    this.disableAtcEditButton();
  }

  showCommentForm(init = false) {
    this.showApprovalBottun = false;
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      approvalLevelId: ['', Validators.required]
    });
    if (init == false) this.displayCommentForm = true;
  }
  getAtcLodgments() {
    this.loanService.getAtcLodgementReleaseApproval().subscribe((response: any) => {
      this.AtcLodgments = response.result;

    });
  }

  getAtcByCustomerId(id: number) {
    this.loanService.getAtcByCustomerId(id).subscribe((response: any) => {
      this.customerATC = response.result;

    });
  }

  getAtcSumByCustomerId(id){
    this.loanService.getAtcSumByCustomerId(id).subscribe((response: any) => {
      this.customerATCSum = response.result;
    });
  }

  getCustomerDetail(id, name = null): void {
    this.searchCustomerId = id;
    this.customerId = id;
    this.showCusotmerSearch = false;
  }

  addAdditionalDetail(d) {
    this.atcLodgmentId = d.atcLodgmentId
    this.showAdditionalDocument = true;

    this.getAtcLodgmentDetail(this.atcLodgmentId);
  }
  getAtcLodgmentDetail(id) {
    this.loanService.getAtcLodgmentDetail(id).subscribe((response: any) => {
      this.AtcLodgmentDetailList = response.result;

    });
  }
  getCusotmerAccountBalance() {
    this.accountBalances = this.getAccountBalance("");
    this.displayAccountBalance = true;
  }
  getAccountBalance(customerId) {
    let list: any = [
      { 'AccountNumber': '34343434343', 'AccountBalance': '20000000' },
      { 'AccountNumber': '34343434222', 'AccountBalance': '45000000' },
      { 'AccountNumber': '34343112222', 'AccountBalance': '64555000' },
      { 'AccountNumber': '32223434222', 'AccountBalance': '39900000' },
    ];
    return list;
  }

  select(d) {

    this.searchCustomerId = d.customerId;
    this.atcLodgement = d;
    this.operationId = d.operationId;
    this.targetId = d.atcLodgmentId;
    this.activeTabindex = 1;
    this.loanSelection = d;
  }

  onTabChange($event) {
    this.activeTabindex = $event.index;
  }

  newAtcRelease() {
    this.loanService.getAtcRelease(this.atcLodgement.atcLodgmentId).subscribe((response: any) => {
      this.AtcReleaseDetail = response.result;

      this.atcReleaseForm.controls['unitNumber'].setValue(this.atcLodgement.unitNumber);
      this.atcReleaseForm.controls['unitRelease'].setValue(this.AtcReleaseDetail.unitRelease);
      this.atcReleaseForm.controls['unitBalance'].setValue(this.AtcReleaseDetail.unitBalance);
      //  this.getAtcRelease(this.searchCustomerId.atcLodgmentId)
      this.showRelease = true;
    });

  }

  clearInput() {
    this.atcReleaseForm = this.fb.group({
      unitNumber: ['', Validators.required],
      unitRelease: [''],
      unitBalance: [''],
      unitToRelease: ['', Validators.required]
    });
  }

  getAtcRelease(id) {
    this.loanService.getAtcRelease(id).subscribe((response: any) => {
      this.AtcReleaseDetail = response.result;

    });
  }

  saveAtcRelase(form) {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This will go through approval workflow. Are you sure you want to proceed?",
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

      let data = {
        atcLodgmentId: __this.atcLodgement.atcLodgmentId,
        unitNumber: form.value.unitNumber,
        unitToRelease: form.value.unitToRelease,
        unitRelease: form.value.unitRelease,
        unitBalance: form.value.unitBalance
      }

      __this.loadingService.show();
      __this.loanService.saveAtcRelease(data).subscribe((response: any) => {
        if (response.success == true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
        __this.getAtcRelease(__this.atcLodgement.atcLodgmentId);
        __this.loadingService.hide();
      });


    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

  }

  approveModal() {

    this.showApprovalBottun = true;
  }

  pushCommentAndStatus() {


    for (var item of this.atcReleaseApprovals){

 
        this.atcReleaseDataForApproval.push ({

            atcReleaseId: item.atcReleaseId,
            atcLodgmentId: item.atcLodgmentId,
            approvalStatusId: this.approvalStatusId,
            comment: this.comment,
      
         });
         
        }

        this.arrayLength = this.atcReleaseDataForApproval.length; 

  }

  submitForApproval() {

    this.pushCommentAndStatus();

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
    
      __this.loanService.submitApproval(__this.atcReleaseDataForApproval).subscribe((response: any) => {
        if (response.success == true) {
          __this.getAtcLodgments(); 
          __this.showApprovalBottun = false;
          __this.clearArrayData();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.result.item1.responseMessage, 'success');
          // __this.displayApplicationStatusMessage(response);
          __this.refreshApprovalCommentAndStatus();
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  displayApplicationStatusMessage(response) { 

     if ( response.result.item2 == 0) { 
      swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.result.item1.statusName}</strong>, Sent to: ${response.result.item1.nextLevelName} <i>${response.result.item1.nextPersonName}</i>`, 'success');
     }
     if ( response.result.item2 > 0 && response.result.item2 == response.count) { 

      swal(`${GlobalConfig.APPLICATION_NAME}`, `The Transaction has been <strong>${response.result.item1.statusName}</strong> Successfully`, 'success');
     }

     if ( response.result.item2 > 0 && response.result.item2 != response.count) { 

      swal(`${GlobalConfig.APPLICATION_NAME}`, `${response.result.item2} transaction(s) has been concluded <strong> Successfully </strong> and ${response.count - response.result.item2} has been sent to the next Approving Desk`, 'success');
     }


    // if (response.stateId == 3)
    //     swal(`${GlobalConfig.APPLICATION_NAME}`, `The Transaction has been <strong>${response.statusName}</strong> Successfully`, 'success');
    // else{
    //     swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
    // }
}


  viewRowDetails(d) {
    this.approvalReleaseData = d;
    this.getAtcByCustomerId(d.customerId);
    this.getAtcSumByCustomerId(d.customerId);
    this.operationId = d.operationId;
    this.targetId = d.atcLodgmentId;
    this.rowSelected = true;
    this.activeTabindex = 2;
  }

  turnOnSearch() {

  }

  refreshApprovalCommentAndStatus() {
    this.approvalStatusId = 0;
    this.comment = "";
}

modalControl(event) {
  if(event == true) {
      this.displayCommentForm = false;
  }
}

referBackResultControl(event) {
  if(event == true) {
      this.getAtcLodgments();
      this.displayCommentForm = false;
      this.approvalReleaseData = null;
      this.activeTabindex = 0;
  }
}

clearArrayData() {
  this.atcReleaseApprovals = [];
  this.arrayLength = 0;
  this.atcReleaseDataForApproval = [];
  //this.approvalReleaseData = [];
}


  editReferredAtcRelease(data) {
    this.selectedId = data.atcReleaseId;
    this.editRowData = [];
    this.unitToRelease = 0;
    this.editRowData.push({
      approvalStatusId: data.approvalStatusId,
      approvalStatusName: data.approvalStatusName,
      atcLodgmentId: data.atcLodgmentId,
      atcReleaseId: data.atcReleaseId,
      atcTypeId: data.atcTypeId,
      branchId: data.branchId,
      branchName: data.branchName,
      companyId: data.companyId,
      createdBy: data.createdBy,
      customerCode: data.customerCode,
      customerId: data.customerId,
      customerName: data.customerName,
      depot: data.depot,
      description: data.description,
      numberOfBags: data.numberOfBags,
      totalValue: data.totalValue,
      unitNumber: data.unitNumber,
      unitToRelease: this.unitToRelease,
      unitValue: data.unitValue,
      dateCreated: data.dateCreated
  });
    this.editModal = true;
  }

  checkRow(data) {
    this.editedData = [];
    this.convertedUnitToRelease = +(data.unitToRelease);
    this.editedDataBody = data;

    
    if(data.unitNumber >= this.convertedUnitToRelease && this.convertedUnitToRelease > 0) {

      this.editedData.push ({
        approvalStatusId: data.approvalStatusId,
        approvalStatusName: data.approvalStatusName,
        atcLodgmentId: data.atcLodgmentId,
        atcReleaseId: data.atcReleaseId,
        atcTypeId: data.atcTypeId,
        branchId: data.branchId,
        branchName: data.branchName,
        companyId: data.companyId,
        createdBy: data.createdBy,
        customerCode: data.customerCode,
        customerId: data.customerId,
        customerName: data.customerName,
        depot: data.depot,
        description: data.description,
        numberOfBags: data.numberOfBags,
        totalValue: data.totalValue,
        unitNumber: data.unitNumber,
        unitToRelease: this.convertedUnitToRelease,
        unitValue: data.unitValue,
        dateCreated: data.dateCreated
    });
      this.editedLength = this.editedData.length;
    }
    else {
      this.message = 'ERROR!\nInvalid Input For Unit To Release';
      swal(`${GlobalConfig.APPLICATION_NAME}`, this.message, 'error');
    }
  }

  checkRowLength() {
    this.editedLength = this.editSelection.length;
  }

  saveEditedAtcRelease() {


    let body = {
      customerId: this.editedDataBody.customerId,
      atcTypeId: this.editedDataBody.atcTypeId,
      description: this.editedDataBody.description,
      depot: this.editedDataBody.depot,
      unitValue: this.editedDataBody.unitValue,
      unitNumber: this.editedDataBody.unitNumber,
      numberOfBags: this.editedDataBody.numberOfBags,
      branchId: this.editedDataBody.branchId,
      unitToRelease: this.editedDataBody.unitToRelease,
      totalValue: this.editedDataBody.totalValue,
      atcLodgmentId: this.editedDataBody.atcLodgmentId,
      atcReleaseId: this.editedDataBody.atcReleaseId,
      approvalStatusId: this.editedDataBody.approvalStatusId,
      customerCode: this.editedDataBody.customerCode,

  };
        this.loadingService.show();

        this.loanService.saveEditedAtc(this.selectedId, body ).subscribe((response: any) => {
        if (response.success == true) {
  
          this.getAtcLodgments();
          this.editModal = false;
          this.arrayLength = 0;
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        
        } else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
  }

  checkAtcReleaseApprovalsLength() {
    this.arrayLength = this.atcReleaseApprovals.length;
  }

  cancelEdit() {
    this.editedLength = 0;
    this.editModal=false;
  }

  disableAtcEditButton() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.staffRoleId = userInfo.staffRoleId;
    if (this.staffRoleId == 8) {
        this.makeEditButtonVisible = true;
    }
  }
  
  
}
