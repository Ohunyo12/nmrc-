import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { JobTitleService } from '../../services';
import { StaffRoleService } from '../../services/staff-role.service';
import { GlobalConfig, ActivityParentId } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { AdminService } from '../../../admin/services';
import { AuthorizationService } from 'app/admin/services/authorization.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-staff-role-setups',
    templateUrl: './staff-role-setups.component.html',
})
export class StaffRoleSetupsComponent implements OnInit {

    activeIndex: number = 0; 
    allActivities: any[];
    groups: any[]; 
    entityName: string;
    staffRoles: any[];
    jobTitles: any[];
    displayStaffRoleModal: boolean = false;
    displayJobTitleModal: boolean = false;
    staffRoleForm: FormGroup;
    jobTitleForm: FormGroup;
    onEdit: number;
    approvalFlowTypes: any[] = []

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private loadingService: LoadingService,
        private staffRolServ: StaffRoleService,
        private authorizationService: AuthorizationService,
        private jobTitleService: JobTitleService,
    ) { }

    ngOnInit() {
        this.clearStaffRoleControl();
        this.clearJobTitleControl();
        this.getAllStaffRole();
        this.getAllJobTitle();
        this.getAllGroups();
        this.getParentChildActivities();
       
    }

    clearStaffRoleControl() {
        this.staffRoleForm = this.fb.group({
            staffRoleName: ['', Validators.required],
            staffRoleId: [0, Validators.required],
            staffRoleCode: ['', Validators.required],
            staffRoleShortCode: ['', Validators.required],
            workStartDuration: [''],
            workEndDuration: [''],
            userGroup: [[]],
            activities: [[]],
            approvalFlowTypeId: [''],
            useRoundRublin: [false, Validators.required],
            useSbuRouting: [false, Validators.required]
        });
    }

    clearJobTitleControl() {
        this.jobTitleForm = this.fb.group({
            jobTitleId: [0, Validators.required],
            jobTitle: ['', Validators.required],
        });
    }
    getAllApprovalFlowTypes() {
        console.log(this.approvalFlowTypes)
        this.loadingService.show();
        this.staffRolServ.getAllApprovalFlowTypes().subscribe((response: any) => {
            this.approvalFlowTypes = response.result;
            this.loadingService.hide();
        });
    }

    getAllStaffRole() {
        this.staffRolServ.getStaffRoles().subscribe((response: any) => {
            this.staffRoles = response.result;
        });
    }

    getAllJobTitle() {
        this.jobTitleService.get().subscribe((response: any) => {
            this.jobTitles = response.result;
        });
    }

    getAllGroups() {
        this.loadingService.show();
        this.adminService.getAllGroups().subscribe((res) => {
            this.groups = res.result;
        });
    }

    getParentChildActivities() {
        this.adminService.getActivityParentAndChild().subscribe((response: any) => {
            this.allActivities = response.result;
            this.loadingService.hide();
        });
    }

    // end of init

    // job title

    showAddJobTitleModal() {
        this.entityName = "New Job Title"
        this.clearJobTitleControl();
        this.displayJobTitleModal = true;
    }

    editJobTitle(index, event) {
        event.preventDefault();
        this.entityName = "Edit Job Title"
        const row = index;
        this.jobTitleForm = this.fb.group({
            jobTitleId: [row.jobTitleId, Validators.required],
            jobTitle: [row.jobTitle, Validators.required],
        });
        this.displayJobTitleModal = true;
    }

    // staff role

    showAddStaffRolwModal() {
        this.getAllApprovalFlowTypes();
        this.entityName = "New Staff Role"
        this.onEdit = null;
        this.clearStaffRoleControl();
        this.displayStaffRoleModal = true;
    }

    editStaffRole(row, event) {
        this.getAllApprovalFlowTypes();
        event.preventDefault();
        this.entityName = "Edit Staff Role"
        this.onEdit = 1;

        this.getActivitesByRole(row.staffRoleId);
        this.getGroupsByRole(row.staffRoleId);

        // let groups = [];
        // row.userGroup.forEach(element => {
        //     groups.push(`${element.groupId}`);
        // });

        // let act = [];
        // row.activities.forEach(element => {
        //     act.push(`${element.activityId}`);
        // });

        this.staffRoleForm = this.fb.group({
            staffRoleName: [row.staffRoleName, Validators.required],
            staffRoleId: [row.staffRoleId, Validators.required],
            staffRoleCode: [row.staffRoleCode, Validators.required],
            staffRoleShortCode: [row.staffRoleShortCode, Validators.required],
            workStartDuration: [row.workStartDuration],
            workEndDuration: [row.workEndDuration],
            userGroup: [''],
            activities: [''],
            approvalFlowTypeId: [row.approvalFlowTypeId],
            useRoundRublin:[row.useRoundRublin],
            useSbuRouting:[row.useSbuRouting]
        });
        this.displayStaffRoleModal = true;
    }

    groupsByRole: any[] = [];
    activitiesByRole: any[] = [];

    getGroupsByRole(id) {
        const returnAct = [];
        this.authorizationService.getGroupsByRoleId(id).subscribe((res) => {
            returnAct.length = 0;
            this.groupsByRole = res.result;
            if (this.groupsByRole) {
                this.groupsByRole.forEach(element => {
                    returnAct.push(`${element.groupId}`);
                });
            }
            this.staffRoleForm.controls['userGroup'].setValue(returnAct);
        });
    }

    getActivitesByRole(id) {
        const returnAct = [];
        this.authorizationService.getActivitiesByRoleId(id).subscribe((res) => {
            returnAct.length = 0;
            this.activitiesByRole = res.result;
            if (this.activitiesByRole) {
                this.activitiesByRole.forEach(element => {
                    returnAct.push(`${element.activityId}`);
                });
            }
            this.staffRoleForm.controls['activities'].setValue(returnAct);
        });
    }

    submitStaffRoleForm(formObj) {
        let body = formObj.value;
        if (body.userGroup == null) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please add at least one group to continue.', 'info')
            return
        };



        body.userGroupIds = body.userGroup;
        body.activitieIds = body.activities;

        this.loadingService.show();
        this.staffRolServ.addUpdateStaffRole(body).subscribe((res) => {                                                                                                                                                                                                                 
            if (res.success == true) {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                 this.getAllStaffRole();

                // this.getActivitesByRole(body.staffRoleId);
                // this.getGroupsByRole(body.staffRoleId);

                this.clearStaffRoleControl();

                this.displayStaffRoleModal = false;
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        }, (err: any) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        });
    }

    submitJobTitleForm(formObj) {
        this.loadingService.show(); 
        let body = formObj.value;
        this.jobTitleService.addUpdateJObTitle(body).subscribe((res) => {
            if (res.success == true) {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                this.getAllJobTitle();
                this.displayJobTitleModal = false;
            } else {
                this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        }, (err: any) => {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
        });
    }

    
    handleChange(evt) {
        this.activeIndex = evt.index;
    }

}
