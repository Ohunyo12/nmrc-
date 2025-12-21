import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { CasaService } from 'app/customer/services/casa.service';
import swal from 'sweetalert2';
import { ApprovalStatus, GlobalConfig, JobSource } from '../../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanOperationService } from 'app/credit/services';
import {ApprovalService, GeneralSetupService } from 'app/setup/services';


@Component({
  selector: 'app-lien-search',
  templateUrl: './lien-search.component.html',
})
export class LienSearchComponent implements OnInit {

  stagingSearch: string;
  customerAccountData: any[];
  customerSelection: any;
  activeIndex: number;
  showSubmitModal: boolean = false;
  casaLienForm: FormGroup;
  casaLienTypes: any[];
  isLienPresent: boolean = false;
  sourceReferenceNumber: any;
  casaAccountId: any;
  casaAccountLoans: any;
  casaAccountLienData: any[];
  selectedCasaLien: any;
  accountNumber: any;
  lienReferenceNumber: any;
  displaySearchForm: boolean;
  searchForm: FormGroup;
  displaySearchTable: boolean;
  application: any;
  applications: any[] = [];
  commentForm: FormGroup;
  controls: FormGroup;
  invalid:FormGroup;
  loanOperationApprovalData: any[] = [];
  searchString: any;
  displayApplicationDetail: boolean;
  hideGeneralInfoPanel: boolean;
  applicationReferenceNumber: any;
  isOfferLetterAvailable: boolean;
  displayLienModal: boolean;
  subscriptions: any;
  trail23: any;
  trailCount: any;
  approvalStatusData: any[];
  trailRecent: any;
  trailLevels: any;
  camService: any;
  backtrail: any;
  loanApplicationDetail: any[] = [];
  loanInformation: any;
  changeLog: any;
  show: boolean = false; 
  message: any; 
  title: any; 
  cssClass: any;
  lienSearch: any[] = [];
  jobSourceId: number;
  isCRMSstaff: any;
  creditoperations: any;
  



  constructor(private fb: FormBuilder, 
              private loadingService: LoadingService, 
              private loanOperationService: LoanOperationService,
              private genSetupService: GeneralSetupService,
              private casaService: CasaService) { }

    
    ngOnInit() {
      this.clearControls();
      this.hideGeneralInfoPanel=true;
      this.jobSourceId = JobSource.LMSOperationAndApproval;
      this.getAllLLienRemovalAwaitingApproval();
      this.getAllApprovalStatus();
      this.clearControls();
      
    
      }

      clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });
        this.displayApplicationDetail = true;
    }
    showSearchForm() { this.displaySearchForm = true; }

    submitForm(form) { 
      let body = {
          searchString: form.value.searchString
      };
      this.loadingService.show();
      this.loanOperationService.lienSearch(body).subscribe((response: any) => {
          this.lienSearch = response.result;
          this.loadingService.hide();
          this.displaySearchForm = false;
          this.displaySearchTable = true;
          this.displayApplicationDetail=false;
      }, (err: any) => {
          this.loadingService.hide(1000);
      });
  }
    viewLien(row) {
      this.application = row;
      this.displayLienModal = true;
      this.isOfferLetterAvailable=!row.isOfferLetterAvailable;
      this.applicationReferenceNumber=row.applicationReferenceNumber;
      this.getTrail23(row.lienRemovalId, row.lienRemovalOperationId);
    }

    getAllLLienRemovalAwaitingApproval() {
      this.loadingService.show();
      this.loanOperationService.getAllLLienRemovalAwaitingApproval().subscribe((response: any) => {
          this.loanOperationApprovalData = response.result;
          this.loadingService.hide();
      });
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
        let tempData = response.result;
        this.approvalStatusData = tempData.slice(2, 4);
    });
}

getStaffActivity(activity) {
  this.camService.getStaffActivity(activity).subscribe((response: any) => {
      this.isCRMSstaff = response.result;
  });
}


onSelectedChanged(row) {
  this.showSubmitModal = true;
  this.customerSelection = row.data;
  this.casaAccountId = this.customerSelection.casaAccountId;
  this.accountNumber = this.customerSelection.productAccountNumber;
  this.sourceReferenceNumber = this.customerSelection.sourceReferenceNumber;
  const casaLoanControl = this.casaLienForm.get('loanId');
  this.getAllCasaLiens(this.accountNumber);
}


TARGET_ID = 0;
OPERATION_ID = 0;
CUSTOMER_ID = 0;
REFERENCE_NUMBER = 0;
displayDetail = true;
viewDocuments(row) {
  this.customerSelection = row;
  this.TARGET_ID = row.lienRemovalId;
  this.OPERATION_ID = row.lienRemovalOperationId;
  this.CUSTOMER_ID = row.customerId;
  this.REFERENCE_NUMBER = row.loanReferenceNumber;
  this.displayDetail = true;
}


  getAllCasaLiens(accountNumber: any) {
    throw new Error('Method not implemented.');
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
setTrailCount(count) { this.trailCount = count; }

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

hideMessage(event) {
  this.show = false;
}

getApprovalStatus(id) {
  let item = this.approvalStatus.find(x => x.id == id);
  return item == null ? 'n/a' : item.name;
}
  getLoanDetailChangeLog(row: any) {
    throw new Error('Method not implemented.');
  }
  getConditionPrecident(loanApplicationId: any) {
    throw new Error('Method not implemented.');
  }
  getTransacDynamics(loanApplicationId: any) {
    throw new Error('Method not implemented.');
  }
  getLoanApplicationById(loanApplicationId: any) {
    throw new Error('Method not implemented.');
  }

}