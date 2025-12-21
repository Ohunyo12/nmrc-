import { LoanApplicationDetailsViewComponent } from '../../../../credit/loans/loan-application-details-view/loan-application-details-view.component';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ChecklistService, GeneralSetupService, StaffRoleService } from '../../../../setup/services';
import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig, ApprovalStatus } from '../../../../shared/constant/app.constant';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoanService, CreditApprovalService } from 'app/credit/services';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-checklist-deferral-approval',
  templateUrl: './checklist-deferral-approval.component.html',
})
export class ChecklistDeferralApprovalComponent implements OnInit {
  selectedChecklist: any;
  checklistAwaitingApproval: any[];
  displayDrawdownDeferralMemo: boolean = false;
  islms: boolean = false;
  itemSelected: boolean = false;
  selectedChecklistData: any = {};
  approvalStatusData: any[];
  activeTabindex = 0;
  reload: number = 0;
  callerId: number = 1;
  proposedItems: any[] = [];
  approvalStatusId: number;
  comment: String;
  referBackForm: FormGroup;
  displayReferBackForm: boolean = false;
  title: string;
  message: string;
  ckEditorContent: any;
  width: string;
  displayConfirmDialog: boolean;
  displayApprovalForm: boolean =false;
  displayLoanToApproveModal = false;
  approvalForm: FormGroup;
  loanApprovalData: any[] =[];
  disableSupportingDocumentsTab: boolean = true;
  applicationSelection: any;
  operationId: any;
  targetId: any;
  reportSrc: SafeResourceUrl;
  displayTestReport: boolean = false;
  displayReport: boolean = false;

  isAnalyst: boolean = true;

  @ViewChild(LoanApplicationDetailsViewComponent, {static: false}) loanInfo: LoanApplicationDetailsViewComponent;
  staffRoleRecord: any;
	loanSelectedData: any;
	// showConfirmReferDialog: any;

  constructor(
    private checklistService: ChecklistService, 
    private loanService: LoanService,
    private loanBookingService: LoanService,
    private creditApprovalService: CreditApprovalService,
    private loadingService: LoadingService,
    private genSetupService: GeneralSetupService,
    private camService: CreditAppraisalService ,
    private sanitizer: DomSanitizer,
  	private staffRole: StaffRoleService,
	  private fb: FormBuilder
        ) { }

  ngOnInit() {
    this.getAllApprovalStatus();
    this.getChecklistAwaitingApproval();
	  this.getUserRole();
    this.showReferBackForm();
    this.getInitiatedLoansAwaitingApproval();
    this.getUserRole2();
    
  }

  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
    this.staffRoleRecord = res.result;
    });
    }

   userIsAccountOfficer2 = false;   
   staffRoleRecord2: any;
   userIsRelationshipManager2 = false;

   getUserRole2() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord2 = res.result;
                if(this.staffRoleRecord2.staffRoleCode == 'AO' || this.staffRoleRecord2.staffRoleCode == 'AO / RO') { 
                    this.userIsAccountOfficer2 = true; 
                }
                if(this.staffRoleRecord2.staffRoleCode == 'RM' || this.staffRoleRecord2.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager2 = true; 
                }
            });
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      let tempData = response.result;
        this.approvalStatusData = tempData.slice(2, 4);
    });
  }
  detail: any = {};
  loanSystemTypeId: number = 0;
  reloadLoanDetails: number = 0;
  loanApplicationDetailId: any;
  viewChecklistDetails(row, event) {
  //console.log("selected records "+ JSON.stringify(row));
  this.getDrawdownDeferralMemo(row.operationId,row.loanApplicationDetailId);
    event.preventDefault();
    this.reload++;
    this.islms = row.isLms;
    
    if(this.islms == false) {
      this.callerId = 1; this.reload++;
      this.operationId = row.operationId;
      this.targetId = row.conditionId;
      this.loanApplicationDetailId = row.loanApplicationDetailId;
      this.loanInfo.isRecommendedInfo = true;
      this.loanInfo.showOrHideViewDetails = false;
      this.loanInfo.getLoanDetail(row.loanApplicationId);
      this.loanInfo.loanApplicationDetail = row;
    } else {
      this.callerId = 2; this.reload++;
      this.loanSystemTypeId = row.loanSystemTypeId;
      this.reloadLoanDetails = row.loanId;
      //this.getLoanApplicationDetail(row.loanId, row.loanSystemTypeId);
    }
	this.selectedChecklistData = row;
	this.getReferBackTrail();
    this.selectedChecklistData.conditionId = row.conditionId;
    this.itemSelected = true;
    this.getLoanDetail();
    this.activeTabindex = 1;
  }

  getLoanApplicationDetail(loanId, loanTypeId) {
    this.loadingService.show();
    this.camService.getLoanApplicationDetail(loanId, loanTypeId).subscribe((response: any) => {
        this.detail = response.result;
        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000);
    });
}

printSelectedSection(): void {
  let printTitle = 'DEFERRAL MEMO No.:' + this.targetId;
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

  getChecklistAwaitingApproval() {
    this.checklistService.getChecklistAwaitingApproval().subscribe((data) => {
      this.checklistAwaitingApproval = data.result;
      this.reload = 0;
    });
    this.activeTabindex = 0;
  }

	goForApproval() {

		if ((((this.staffRoleRecord.staffRoleCode == 'AO') || (this.staffRoleRecord.staffRoleCode == 'RM')) && 
			this.approvalStatusId == 3 ) == true) { 
				swal(`${GlobalConfig.APPLICATION_NAME}`, 
				'This cannot be rejected by the active staff role', 'error');
				return;
		}

		let loading = this.loadingService;
		let bodyObj = {
		loanApplicationId: this.selectedChecklistData.loanApplicationId,
		targetId: this.selectedChecklistData.conditionId,
		approvalStatusId: this.approvalStatusId,
		comment: this.comment,
		OperationId : this.selectedChecklistData.operationId,
		isLms: this.islms,
		//loanApplicationId: this.selectedChecklistData.loanApplicationId
		};

		const __this = this;
		__this.itemSelected = false;
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
		__this.checklistService.sendChecklistForApproval(bodyObj).subscribe((response: any) => {
			if (response.success == true) {
			__this.getChecklistAwaitingApproval();
			__this.itemSelected = false;
			__this.loadingService.hide();
			__this.activeTabindex = 0;
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
			} else {
			__this.loadingService.hide();
			__this.itemSelected = true;
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
			}
		}, (err) => {
			__this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
		}, function (dismiss) {
		if (dismiss == 'cancel') {
			__this.itemSelected = true;
			swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
		}
		});
	}

  hideModal() {
    this.itemSelected = false;
    this.reload = 0;
    this.getChecklistAwaitingApproval();
    
  }


  getLoanDetail(): void {
    this.reload = 0;
    this.loadingService.show();
    this.camService.getLoanDetail(this.selectedChecklistData.loanApplicationId).subscribe((response: any) => {
      this.proposedItems = response.result.facilities;
      this.reload++;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


  onTabChange(e) {
    this.activeTabindex = e.index;
    if (e.index == 0) { this.refresh(); }

  }

  refresh() {
    this.reload = 0;
    this.selectedChecklistData = {};
    this.itemSelected = false;
    this.getLoanDetail();
  }

  trailApprovalLevels: any;
  getReferBackTrail() {
	this.loadingService.show();
	this.camService.getTrail(this.selectedChecklistData.conditionId, this.selectedChecklistData.operationId).subscribe((response: any) => {
		
		if(response.success){
			this.trailApprovalLevels = response.result;
			this.loadingService.hide();
		}
	}, (err) => {
		this.loadingService.hide(1000);
	});
}

showConfirmDialog() {
	this.title = 'Go For Approval';
	this.message = 'Are you sure you want to perform this action ?';
	this.width = '400';
	this.displayConfirmDialog = true;
}

decideMovement() {
  if (this.displayApprovalForm == true) {
      this.goForApproval();
  } else if (this.displayReferBackForm == true) {
      this.returnBack();
  }
}

returnBack() {
  
  const target = {
    
      operationId: this.selectedChecklistData.operationId,
      targetId: this.selectedChecklistData.conditionId,
      comment: this.referBackForm.value.comment,
      approvalLevelId: this.referBackForm.value.approvalLevelId
  };

      this.loadingService.show();

      this.loanBookingService.ReferBackBooking(target).subscribe((res) => {
          this.loadingService.hide();
          if (res.success === true) {
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
              this.getInitiatedLoansAwaitingApproval();
              this.displayReferBackForm = false;
              this.displayConfirmDialog= false;
              this.displayLoanToApproveModal = false;
          } else {
              swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
          }
      }, (err) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
}

afterReferBackSuccess() {
  this.getChecklistAwaitingApproval();
  this.itemSelected = false;
  this.activeTabindex = 0;
  this.displayReferBackForm = false;
  this.displayConfirmDialog= false;
  this.displayLoanToApproveModal = false;
}

displayStatus(e) {
  if(e == true) {
      this.displayReferBackForm = false;
  }
}

cancelApproval() {
  swal(`${GlobalConfig.APPLICATION_NAME}`, 'Approval cancelled', 'error');
  this.displayConfirmDialog = false;
  this.displayLoanToApproveModal = false;
}
// gooForApproval() {
//   let loading = this.loadingService;
//   let srv = this.loanService;

//   let bodyObj = {
//       targetId: this.loanSelectedData.loanBookingRequestId,
//       approvalStatusId: this.approvalForm.controls['approvalStatusId'].value,
//       comment: this.approvalForm.controls['comment'].value,
//       operationId: this.loanSelectedData.operationId
//   };

//   loading.show();
//   this.creditApprovalService.approveInitiatedLoanBookingRequest(bodyObj,this.loanSelectedData.loanBookingRequestId).subscribe((response: any) => {
//       if (response.success === true) {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
//           this.getInitiatedLoansAwaitingApproval();
//           this.displayApprovalForm = false;
//       } else {
//           swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');

//       }
//       loading.hide();
//       this.displayLoanToApproveModal = false;
//       this.displayConfirmDialog = false;
//   }, (err) => {
//       loading.hide();
//       swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
//   });
// }

getInitiatedLoansAwaitingApproval() {
  this.loanService.getInitiatedLoansAwaitingApproval().subscribe((response: any) => {
      this.loanApprovalData = response.result;
      this.loadingService.hide();
  });
}


			//this.activeTabindex = 1;
	showReferBackForm(init = true) {
		this.referBackForm = this.fb.group({
		comment: ['', Validators.required],
		approvalLevelId: ['', Validators.required],
						
		});
		if (!init) {
			this.displayReferBackForm = true;
		}
  }
 
// contentChange(updates) { 
//   this.ckEditorContent = updates; 
// }

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
   this.checklistService.getDeferralWaiverPdf(this.operationId, this.targetId, this.loanApplicationDetailId).subscribe((response: any) => {
       if (response.result == null) return;
        path = response.result;
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
        this.displayTestReport = true;
        this.displayReport = true;
   }, (err) => {
      
   });
}


}
