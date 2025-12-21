import { AdminService } from '../../services/admin.service';
import { element } from 'protractor';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Group } from '../../models/group';
import { Activity } from '../../models/activity';
import { AuthorizationService } from '../../services/authorization.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AccordionModule } from 'primeng/primeng';
import * as _ from 'lodash';
import { ActivityParentId } from 'app/shared/constant/app.constant';

@Component({
    templateUrl: 'group.activity.component.html',
    styles: [`
    .checkbox-inline{
        padding-left:17px !important;
        margin-left:0 !important;
        width:200px;
    }
    `]
})

export class GroupActivityComponent implements OnInit {

    groups: any[]
    display: boolean = false;
    showAccessDialog: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    // activities: any[] = [];
    activitiesbygrp: any[];
    selectedActivities: any[] = [];
    selectedAct: any;
    groupForm: FormGroup;
    result: any[];
    allActivities: any[];
    groupActivities: any;
    access: any = {};
    grpName: any = '';

    constructor(
        private fb: FormBuilder,
        private adminService: AdminService,
        private loadingService: LoadingService,
        private authorizationService: AuthorizationService
    ) { }

    ngOnInit() {
        this.getAllGroups();
        this.clearControls();
        //this.getActivities();
        this.getGroupActivities();
        this.getParentChildActivities();
    }


    getAllGroups() {
        // this.loadingService.show();
        this.authorizationService.getGroups().subscribe((res) => {
            this.groups = res.result;
        });
    }

    getGroupActivities() {
        this.adminService.getGroupsAndActivities().subscribe((response: any) => {
            this.groupActivities = response.result;
        });
    }

    getParentChildActivities() {
        this.adminService.getActivityParentAndChild().subscribe((response: any) => {
            this.allActivities = response.result;

        })
    }

// form

    clearControls() {
        this.groupForm = this.fb.group({
            groupId: ['', Validators.required],
            Activities: [[]]
        });
    }

    resetForm() {
        this.groupForm = this.fb.group({
            groupId: ['', Validators.required],
            groupName: [''],
            Activities: [[]]
        });
    }

    showDialog() { this.display = true; }

    onGroupChange() {
        this.getActivitesByGroup(this.groupForm.value.groupId);
    }

    getActivitesByGroup(id) {
        const returnAct = [];
        this.authorizationService.getActivitiesByGroupId(id).subscribe((res) => {
            returnAct.length = 0;
            this.activitiesbygrp = res.result;
            if (this.activitiesbygrp) {
                this.activitiesbygrp.forEach(element => {
                    returnAct.push(`${element.activityId}`);
                });
            }
            this.groupForm = this.fb.group({
                groupId: [id, Validators.required],
                Activities: [returnAct]
            });
        });
    }

    onSubmit({ value, valid }: { value: Group, valid: boolean }) {
        if (value.Activities.length === 0) {
            this.showMessage('Please select at least one activity', 'error', 'FintrakBanking');
            return;
        }
        this.loadingService.show();
        let activ = [];
        value.Activities.forEach(result => {
            activ.push({
                activityId: result,
                activityName: ''
            })
        });
        const body = {
            groupId: value.groupId,
            groupName: '',
            createdBy: 0,
            Activities: activ
        };
        this.authorizationService.addGroupActivity(body).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                // this.getActivities();
                this.getGroupActivities();
                // this.resetForm();
                this.showMessage(res.message, 'success', 'FintrakBanking');
            } else {
                this.showMessage(res.message, 'error', 'Exeption');
            }
        }, (err) => {
            this.loadingService.hide();
            this.showMessage('An error has occurred please contact your administrator', 'error', 'Exeption');
        });
    }



    // getActivities() {
    //     this.authorizationService.getActivities().subscribe((response: any) => {
    //         this.result = response.result;
    //         this.activities.length = 0;
    //         this.activities = [];
    //         this.result.forEach(element => {
    //             this.activities.push(new Activity(element.activityName, element.activityId));
    //         });
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide();
    //     });
    // }




    viewAccess(evt, data, grpName) {
        evt.preventDefault();
        this.grpName = '';
        this.selectedAct = data;
        this.access.canEdit = this.selectedAct.canEdit;
        this.access.canAdd = this.selectedAct.canAdd;
        this.access.canApprove = this.selectedAct.canApprove;
        this.access.canDelete = this.selectedAct.canDelete;
        this.access.canView = this.selectedAct.canView;
        this.grpName = grpName;
        this.showAccessDialog = true;
    }

    saveAccess(id) {
        this.loadingService.show();
        const body = {
            canEdit: this.access.canEdit,
            canAdd: this.access.canAdd,
            canView: this.access.canView,
            canDelete: this.access.canDelete,
            canApprove: this.access.canApprove
        };
        this.adminService.assignAccessRight(id, body).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.getGroupActivities();
                this.showMessage(response.message, 'success', 'FintrakBanking');
            }
        }, (err) => {
            this.loadingService.hide();
            this.showMessage('An unhandled error has occured', 'error', 'FintrakBanking');
        });
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

}