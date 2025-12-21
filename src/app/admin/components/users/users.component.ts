import { AdminService } from '../../services/admin.service';
import { User } from '../../models/User';
import { AuthorizationService } from '../../services/authorization.service';
import { StaffService } from '../../services/staff.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal, { SweetAlertType } from 'sweetalert2';

enum LockStatusEnum {
    Locked = 1,
    Unlocked = 2
}



@Component({
    templateUrl: 'users.component.html'
})

export class UsersComponent implements OnInit {


    users: any[];
    groups: any[];
    selectedUser: any;
    display: boolean = false;
    staffs: any[];
    selectedStaff: string;
    groupArray: number[] = [];
    user: FormGroup;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    isUpdate: boolean = false;
    allActivities: any[];
    groupActivities: any;
    user_id: any;
    activeIndex: number = 0;

    constructor(private fb: FormBuilder,
        private loadingService: LoadingService,
        private staffService: StaffService,
        private adminService: AdminService) {

    }

    ngOnInit() {
        this.initializeControls();
        this.getStaff();
        this.getAllGroups();
        this.getAllUsers();
        this.getParentChildActivities();
        this.getProfileSetting();
        this.isUpdate = false;
    }

    getStaff() {
        this.staffs = [];
        this.staffService.getAllStaff()
            .subscribe((response: any) => {
                this.staffs = response.result;

                this.loadingService.hide();
            });
    }

    getAllUsers(): void {
        this.loadingService.show();
        this.adminService.getAllUsers().subscribe((result) => {
            this.users = result.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    showDialog() {
        this.initializeControls();
        this.isUpdate = false;
        this.display = true;
    }

    getAllGroups() {
        this.loadingService.show();
        this.adminService.getAllGroups()
            .subscribe((res) => {
                this.groups = res.result;
            });
    }

    getParentChildActivities() {
        this.adminService.getActivityParentAndChild()
            .subscribe((response: any) => {
                this.allActivities = response.result;
                this.loadingService.hide();
            });
    }
    profileSettings: any = {};
    minPasswordLength: number;

    getProfileSetting() {
        this.adminService.getProfileSettings()
            .subscribe((response: any) => {
                this.profileSettings = response.result;
                this.minPasswordLength = this.profileSettings.minRequiredPasswordLength;
                this.loadingService.hide();
            });
    }

    saveUser(value) {
        this.loadingService.show();

        var groups = [];
        
        value.group.forEach(result => {
            groups.push({
                groupId: result,
                groupKey: ''
            });
        });

        value.group = groups;

        let constActivities = [];

        value.activities.forEach(result => {
            constActivities.push({
                userId: 0,
                activityId: result
            });
        });

        value.activities = constActivities;

        

        this.adminService.saveUser(value).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                this.initializeControls();
                this.getAllUsers();
                this.showMessage(res.message, 'success', `${GlobalConfig.APPLICATION_NAME}`);
                this.display = false;
            } else {
                this.showMessage(res.message, 'error', `${GlobalConfig.APPLICATION_NAME}`);
                this.display = true;
            }

        }, (err: any) => {
            this.loadingService.hide();
            this.showMessage(JSON.stringify(err), 'error', `${GlobalConfig.APPLICATION_NAME}`);
        });
    }

    updateUser(id, value) {
        this.loadingService.show();

        var groups = [];
        value.group.forEach(result => {
            groups.push({
                groupId: result,
                groupKey: ''
            });
        });

        value.group = groups;

        let constActivities = [];

        value.activities.forEach(result => {
            constActivities.push({
                userId: 0,
                activityId: result
            });
        });

        value.activities = constActivities;

        this.adminService.updateUser(id, value).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                this.initializeControls();
                this.getAllUsers();
                this.showMessage(res.message, 'success', `${GlobalConfig.APPLICATION_NAME}`);
                this.display = false;
            } else {
                this.showMessage(res.message, 'error', `${GlobalConfig.APPLICATION_NAME}`);
                this.display = false;
            }
        }, (err: any) => {
            this.loadingService.hide();
            this.showMessage(JSON.stringify(err), 'error', `${GlobalConfig.APPLICATION_NAME}`);
        });
    }


    onUserFormSubmitted({ value, valid }: { value: User, valid: boolean }): void {

        if (this.isUpdate) {
            this.updateUser(this.user_id, value);
        } else {
            this.saveUser(value);
        }

    }

    showMessage(message: string, cssClass: SweetAlertType, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        swal(title, message, cssClass);
        this.activeIndex = 0;
    }

    hideMessage(event) {
        this.show = false;
    }

    editUser(users, evt) {
        evt.preventDefault();
        let returnedUser = users;

        let groups = [];
        returnedUser.groupId.forEach(element => {
            groups.push(`${element.groupId}`);
        });

        let act = [];
        returnedUser.activities.forEach(element => {
            act.push(`${element.activityId}`);
        });

        this.user = this.fb.group({
            staffId: [returnedUser.staffId],
            username: [returnedUser.username, Validators.required],
            password: ['password', Validators.required],
            confirmPassword: ['password', Validators.required],
            securityQuestion: [returnedUser.securityQuestion, Validators.required],
            securityAnswer: [returnedUser.securityAnswer, Validators.required],
            group: [groups],
            activities: [act]
        });
        this.user_id = returnedUser.user_id;
        this.isUpdate = true;
        this.display = true;
    }

    initializeControls() {
        this.user = this.fb.group({
            staffId: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            securityQuestion: ['', Validators.required],
            securityAnswer: ['', Validators.required],
            group: [[]],
            activities: [[]]
        });
    }

    changeAccountStatus(row, evt) {
        evt.preventDefault();

        const __this = this;

        let lockStatus = row.isLocked ? LockStatusEnum.Unlocked : LockStatusEnum.Locked;

        swal({
            title: 'Confirm Action',
            text: 'Are you sure?',
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
            __this.adminService.manageUserAccountStatus(row.user_id, lockStatus).subscribe((response: any) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.data.message, 'success');
                __this.getAllUsers();
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    canDeactivate() {
        const __this = this;

        if (this.user.dirty) {
            return window.confirm('Discard changes?');
        }

        return true;
    }

    handleChange(evt) {
        this.activeIndex = evt.index;
    }
}