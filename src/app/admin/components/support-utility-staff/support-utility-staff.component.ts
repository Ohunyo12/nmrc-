import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService, AuthenticationService, StaffService } from 'app/admin/services';
import { BranchService, CompanyService, CountryStateService, DepartmentService, GeneralSetupService, JobTitleService, MisInfoService, StaffRealTimeSearchService, StaffRoleService } from 'app/setup/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-support-utility-staff',
    templateUrl: './support-utility-staff.component.html',
    //styleUrls: ['./support-utility.component.scss']
})
export class SupportUtilityStaffComponent implements OnInit {
    displayOtherInformation: boolean = false;
   
    otherInformation: any = {};
    entitySelect: any;
    headerText: string = '';
    failedUpload: any;
    uploadedData: any;
    user: any = {};
    staffUser: any = {};
    units: any;
    departmentUnits: any;

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
    staffDataset: any[];
    states: any[];
    cities: any[];
    totalRecords: number;
    isUpdate = false;
    cityLoaded = false;
    jobTitles: any[];
    misInfo: any[];
    staffRoles: any[];
    displayDocumentUpload: boolean = false;
    displayADAuth: boolean = false;
    adAuthStaffCode: string = null;
    adAuthPassCode: string = null;
    selectedStaff: any = {};


    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    collapseForm: boolean = true;


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
    staffDetails: any;
    displayStaffDetailModal = false
    issueTypes: any[] = [];
    searchString: any;
    staffRecord: any;
    tempStaffRecord: any = {};
    activeTabindex: number = 0;


    @ViewChild('fileInput', { static: false }) fileInput: any;

    activeIndex: number = 0;

    groups: any[];
    allActivities: any[];
    showAssignSupervisorButton: boolean = false;
    adActive: boolean = false;
    globalSetup: any;
    businessUnit: any;
    provideActionForm: FormGroup;
    displayProvideAction: boolean;
    selectedId: number;
    staffCode: string;

    constructor(
    
        private fb: FormBuilder,
     
        private staffService: StaffService,
        private loadingService: LoadingService,
       
   
        private adminService: AdminService,
     
    ) { }

    ngOnInit() {
        this.clearControls();
       
    }
    viewDetails(staff) { 
        this.activeTabindex = 1;
        this.loadingService.show();
        if(staff.mainStaff == 1){
            this.staffDetails = this.staffRecord.find(x => x.staffCode == staff.staffCode);
            this.adminService.getTempStaffRecord(staff.staffCode).subscribe((response: any) => { 
                this.loadingService.hide();
                this.tempStaffRecord = response.result;     
                
            });
        }
       else{
        this.tempStaffRecord = this.staffRecord.find(x => x.staffCode == staff.staffCode);
        this.loadingService.hide();
        
       }

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
                this.staffDataset.slice;
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

    submitActionForm(form) {
            let body = {
                isCurrent : form.value.isCurrent,
                approvalStatusId: form.value.approvalStatusId
            };
            
        const __this = this;
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
        }).then(function () {
            __this.loadingService.show();
                __this.adminService.updateStaffRecord(body, __this.selectedId, __this.staffCode).subscribe(
                    (res) => {
                        if (res.success == true) {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                            __this.displayProvideAction = false;
                            __this.viewDetails(__this.staffDetails = __this.staffRecord.find(x => x.staffCode));
                        } else {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                        }
                    },
                    (err: any) => {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                    }
                );
            __this.loadingService.hide(1000);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    popoverSeeMore() {
        this.loadingService.show();
        this.adminService.getStaffRecord(this.searchString).subscribe((response: any) => { 
            this.loadingService.hide();
            this.staffRecord = response.result;
            // this.getTempStaffRecord();
           
        });
        
    }

    getTempStaffRecord() {
        this.loadingService.show();
        this.adminService.getTempStaffRecord(this.searchString).subscribe((response: any) => { 
            this.loadingService.hide();
            this.tempStaffRecord = response.result.record;
            
            
        });
        
    }

    updateStaffDetails(){

    }
    getAllSupportIssueType() {
        this.loadingService.show();
        this.issueTypes = [];
        this.adminService.getAllSupportIssueType().subscribe((response: any) => {
            this.loadingService.hide();
            this.issueTypes = response.result;
        }, (err: HttpErrorResponse) => {

        });
    }

    submitAction(form) {
        let body = {
            isCurrent : form.value.isCurrent,
            isProspect: form.value.isProspect,
            accountCreationComplete: form.value.accountCreationComplete,
            approvalStatusId: form.value.approvalStatusId
        };
        this.adminService.updateStaffRecord(body, this.selectedId, this.staffCode).subscribe(
            (res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.displayProvideAction = false;
                    this.viewDetails(this.selectedId);
                } else {
                    this.finishBad(res.message);
                }
            },
            (err: any) => {
                this.finishBad(JSON.stringify(err));
            }

        );
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
            isCurrent: [false],
            approvalStatusId: [Validators.required]

        });
    }

    provideAction(tempStaffRecord){
        this.displayProvideAction = true;
        this.selectedId = this.staffDetails.staffId;
        this.staffCode = tempStaffRecord.staffCode;
        this.provideActionForm = this.fb.group({
            isCurrent: [tempStaffRecord.isCurrent, Validators.required],
            approvalStatusId: [tempStaffRecord.approvalStatusId, Validators.required]

        });
    }

    info(){
        swal({
            title:'Advice!',
            text: 'Please follow the normal approval for new staff',
            type: 'warning', 
            cancelButtonColor: '#d33',
            cancelButtonText: 'Ok',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Thank you');
            }
        });
    }
}