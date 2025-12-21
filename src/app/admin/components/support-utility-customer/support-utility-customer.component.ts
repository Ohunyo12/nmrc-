import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaffService, AuthenticationService, AdminService } from 'app/admin/services';
import { BranchService, CompanyService, CountryStateService, DepartmentService, GeneralSetupService, JobTitleService, MisInfoService, StaffRealTimeSearchService, StaffRoleService } from 'app/setup/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-support-utility-customer',
    templateUrl: './support-utility-customer.component.html',
    // styleUrls: ['./support-utility-customer.component.scss']
})
export class SupportUtilityCustomerComponent implements OnInit {
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
    issueTypes: any[] = [];
    trubledCustomers: any[] = [];

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
    selectedId: number = null;


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
    customerName: any;
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
    searchParam: any;
    searchString: any;
    customerRecord: any[];
    activeTabindex: number = 0;
    tempCustomerRecord: any;
    casaCustomerRecord: any[] = [];


    @ViewChild('fileInput', { static: false }) fileInput: any;

    activeIndex: number = 0;

    groups: any[];
    allActivities: any[];
    showAssignSupervisorButton: boolean = false;
    adActive: boolean = false;
    globalSetup: any;
    businessUnit: any;
    customerDetails: any;
    displayProvideAction: boolean = false;
    provideActionForm: FormGroup;

    constructor(
        private companyService: CompanyService,
        private branchService: BranchService,
        private fb: FormBuilder,
        private deptService: DepartmentService,
        private staffService: StaffService,
        private loadingService: LoadingService,
  
        private adminService: AdminService,
        private genSetupServ: GeneralSetupService,
    ) { }

    ngOnInit() {
        this.clearControls();
       
    }
    viewDetails(customer) {
        this.activeTabindex = 1;
        this.loadingService.show();
        this.adminService.getTempCustomerRecord(customer.customerId).subscribe((response: any) => {
            this.loadingService.hide();
            this.customerDetails = this.customerRecord.find(x => x.customerId == customer.customerId);
            this.tempCustomerRecord = response.result;

        }),
        this.adminService.getCasaCustomerRecord(customer.customerId).subscribe((response: any) => {
            this.loadingService.hide();
            this.customerDetails = this.customerRecord.find(x => x.customerId == customer.customerId);
            this.casaCustomerRecord = response.result;

        }),
        this.adminService.getCustomerRecord(this.searchString).subscribe((response) => {
            this.loadingService.hide();
            this.customerDetails = this.customerRecord.find(x => x.customerId == customer.customerId);
            this.customerRecord = response.result;

        });
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
    onTabChange(e) {
        this.activeTabindex = e.index;
        if (e.index == 1) { }
        if (e.index == 2) { }

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
        this.adminService.getCustomerRecord(this.searchString).subscribe((response) => {
            this.loadingService.hide();
            this.customerRecord = response.result;

        });
    }

    getTempCustomerRecord(customerId) {
        this.loadingService.show();
        this.adminService.getTempCustomerRecord(customerId).subscribe((response: any) => {
            this.loadingService.hide();
            this.tempCustomerRecord = response.result.record;
            console.log(this.tempCustomerRecord);
        });

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

    submitForm(form) {
        
        let body = {
            isCurrent : form.value.isCurrent,
            isProspect: form.value.isProspect,
            accountCreationComplete: form.value.accountCreationComplete,
            approvalStatus: form.value.approvalStatus
        };
        swal({
            title:'Are you sure?',
            text: 'Are you sure you want to confirm Approvals?',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(() => {
            this.loadingService.show();
            this.adminService.updateCustomerRecord(body, this.selectedId).subscribe(
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
        },function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    submitActionForm(form) {
        let body = {
            isCurrent : form.value.isCurrent,
            isProspect: form.value.isProspect,
            accountCreationComplete: form.value.accountCreationComplete,
            approvalStatus: form.value.approvalStatus
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
            __this.adminService.updateCustomerRecord(body, __this.selectedId).subscribe(
                (res) => {
                    if (res.success == true) {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        __this.displayProvideAction = false;
                        __this.viewDetails(__this.customerDetails = __this.customerRecord.find(x => x.customerId));
                        __this.activeTabindex = 0;
                                 
                
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
            isProspect: [false],
            accountCreationComplete: [false],
            approvalStatus: [Validators.required]

        });
    }

    provideAction(tempCustomerRecord){
        this.displayProvideAction = true;
        this.selectedId = tempCustomerRecord.customerId
        this.provideActionForm = this.fb.group({
            isProspect: [tempCustomerRecord.isProspect],
            isCurrent: [tempCustomerRecord.isCurrent],
            accountCreationComplete: [tempCustomerRecord.accountCreationComplete],
            approvalStatus: [tempCustomerRecord.approvalStatus]

        });
    }
}