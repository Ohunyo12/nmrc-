import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaffService, AuthenticationService, AdminService } from 'app/admin/services';
import { CompanyService, BranchService, DepartmentService, CountryStateService, MisInfoService,
JobTitleService, StaffRoleService, StaffRealTimeSearchService, GeneralSetupService,} from 'app/setup/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { LoanService } from '../../../credit/services/loan.service';

@Component({
  selector: 'app-support-utility-workflow',
  templateUrl: './support-utility-workflow.component.html',
  // styleUrls: ['./support-utility-workflow.component.scss']
})
export class SupportUtilityWorkflowComponent implements OnInit {
  displayOtherInformation: boolean = false;
  otherInformationForm: FormGroup;
  otherInformation: any = {};
  entitySelect: any;
  headerText: string = '';
  failedUpload: any;
  uploadedData: any;
  user: any = {};
  staffUser: any = {};
  units: any;
  departmentUnits: any;
  searchForm: FormGroup;
  display = false;
  show = false;
  message: any;
  title: any;
  cssClass: any;
  sensitivities: any[];
  companies: any[];
  branches: any[];
  staffFormGroup: FormGroup;
  staffSearchForm: FormGroup;
  branchLoaded = false;
  departments: any[];
  wokrflowtrail: any[];
  states: any[];
  cities: any[];
  totalRecords: number;
  isUpdate = false;
  cityLoaded = false;
  jobTitles: any[];
  misInfo: any[];
  staffRoles: any[];
  facilities: any[] = [];
  displayDocumentUpload: boolean = false;
  displayADAuth: boolean = false;
  adAuthStaffCode: string = null;
  adAuthPassCode: string = null;
  selectedStaff: any = {};
  bookinApprovalRecords: any[] = [];


  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  supportingDocuments: any[] = [];
  collapseForm: boolean = true;

  operationId: any;
  productClassId: any;
  productId: any;


  supervisorCode: any;
  supervisorName: any;
  supervisorBranch: any;
  supervisorEmail: any;
  SupervisorReportings: any;
  staffEmail: any;
  staffBranch: any;
  staffName: any;
  staffCodeNo: any;
  username: any;
  teamUnit: any;
  costCent: any;
  dept: any;
  region: any;
  group: any;
  directorate: any;
  mis: any;
  staffInfo: any;
  staff: any;
  customer: any;
  wokrflowRoute: any;
  displayApprovalTrailModal = false;
  displayOperationsModal = false;
  searchString: any;
  businessRules: any = {};
  displayBusinessRuleModal = false;


  @ViewChild('fileInput', { static: false }) fileInput: any;

  activeIndex: number = 0;

  groups: any[];
  allActivities: any[];
  showAssignSupervisorButton: boolean = false;
  adActive: boolean = false;
  globalSetup: any;
  businessUnit: any;
  uniqueOperations: any[];
  expectedworkflow: any[] = [];
    activeTabindex: number = 0;
    wokrflowtrailDetails: any;
    wokrflowtrailRecord: any;
    businessRuleDetails: any;
    provideActionForm: FormGroup;
    displayProvideAction: boolean;
    selectedId: number;

  constructor(
      private companyService: CompanyService,
      private branchService: BranchService,
      private fb: FormBuilder,
      private deptService: DepartmentService,
      private staffService: StaffService,
      private loadingService: LoadingService,
      private userService: AuthenticationService,
      private loanService: LoanService,
      private misInfoService: MisInfoService,
      private jobTitleService: JobTitleService,
      private staffRolServ: StaffRoleService,
      private realSearchSrv: StaffRealTimeSearchService,
      private adminService: AdminService,
      private genSetupServ: GeneralSetupService,
      
  ) { }

  ngOnInit() {
      this.clearControls();
  }
  select(trail) {
    this.activeTabindex = 1;
    this.loadingService.show();
    this.adminService.getSingleTrail(trail.approvalTrailId).subscribe((response: any) => { 
        this.loadingService.hide();
        this.wokrflowtrailDetails = this.wokrflowtrail.find(x => x.approvalTrailId == trail.approvalTrailId);
        this.wokrflowtrailRecord = response.result;
    });
   }

   onTabChange(e) {
    this.activeTabindex = e.index;
    if (e.index == 1) { }
    if (e.index == 2) { }
   
}

  deleteStaff(id) {
      this.staffService.removeStaff(id).subscribe((res: any) => {
          if (res.success == true) {
              swal('Fintrak Credit 360', res.message, 'success');
              //this.getAllStaff();
              this.wokrflowtrail.slice;
          } else {
              swal('Fintrak Credit 360', res.message, 'error');
          }
      }, (error) => {
          this.loadingService.hide();
          swal('Fintrak Credit 360', JSON.stringify(error) ? JSON.stringify(error) : 'Error occured', 'error')
      });
  }

  confirmDelete(row) {
      const __this = this;
      var id = row.staffId;
      swal({
          title: 'Are you sure?',
          text: 'Are you sure You want to delete this user. You will not be able to undo once comitted.',
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
          __this.deleteStaff(id);
          __this.loadingService.hide(1000);
      }, function (dismiss) {
          if (dismiss === 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });
  }

  popoverSeeMore() {
        this.loadingService.show();
        this.adminService.getApprovalTrail(this.searchString).subscribe((response) => { 
            this.loadingService.hide();
            this.wokrflowtrail = response.result;
            this.facilities = [];
            this.bookinApprovalRecords = [];
            if(this.wokrflowtrail != null){
                this.adminService.getDistinctOperations(this.searchString).subscribe((response) => {  
                    this.uniqueOperations = response.result;
                });
            }
          
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
        // this.loadingService.hide();
      this.displayOperationsModal= false;
     
  }

  
  
  popoverSeeWorkflow() {
    this.loadingService.show();
    this.displayOperationsModal = true;
    this.displayApprovalTrailModal = false;
    this.loadingService.hide();
  }  


  getExpectedWorkflow(operationId){
    this.loadingService.show();
    this.displayOperationsModal = false;
    this.displayApprovalTrailModal = true;
    this.adminService.getExpectedWorkflow(operationId).subscribe((response) => { 
        this.expectedworkflow = response.result;
        this.loadingService.hide();
     });
            
  }

  viewBisRule(flowtrail){
    this.loadingService.show();
    this.displayBusinessRuleModal = true;
    this.adminService.getBusinessRule(flowtrail.approvalLevelId).subscribe((response) => { 
        this.loadingService.hide();
        this.businessRuleDetails = this.expectedworkflow.find(x => x.approvalTrailId == flowtrail.approvalTrailId);
        this.businessRules = response.result;
        
    });
  }

 
  Cancel(){
      this.displayOperationsModal = false;
      this.displayBusinessRuleModal = false;
      
  }

  submitActionForm(form) {
    const approvalTrailId =  this.wokrflowtrail.find(x => x.approvalTrailId);
    let body = {
        approvalLevelId: form.value.approvalLevelId,
    };
    swal({
        title:'Are you sure?',
        text: 'Are you sure you want to proceed? You will not be able to undo once comitted!',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success btn-move',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
    }).then(()=>{
        this.loadingService.show();
        this.adminService.updateApprovalTrail( body ,approvalTrailId).subscribe(
            (res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.displayProvideAction = false;
                } else {
                    this.finishBad(res.message);
                }
            },
            (err: any) => {
                this.finishBad(JSON.stringify(err));
            }
        );
        this.loadingService.hide(1000);
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    })

}

finishBad(message) {
    this.showMessage(message, "error", "FintrakBanking");
    this.loadingService.hide();
}

finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, "success", "FintrakBanking");
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

clearControls() {
    this.selectedId = null;
    this.provideActionForm = this.fb.group({
        approvalLevelId: ['', [Validators.required, Validators.pattern(/^[0-9\s]*$/), Validators.minLength(9)]],
    }),
    this.searchForm = this.fb.group({
        searchString: ['', Validators.required],
    });
}

provideAction(flowtrail){
    this.displayProvideAction = true;
    this.selectedId = this.wokrflowtrail.find(x => x.approvalTrailId == flowtrail.approvalTrailId);
    this.provideActionForm = this.fb.group({
        isProspect: [flowtrail.isProspect],
        accountCreationComplete: [flowtrail.accountCreationComplete],
        approvalStatusId: [flowtrail.approvalStatusId, Validators.required]

    });
}
deleteAction(){
    swal({
        title: 'Are you sure?',
        text: 'Are you sure You want to delete this record. You will not be able to undo once comitted.',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success btn-move',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
    }).then(function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    })
}
}