import { AdminService } from '../../services/admin.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: 'group.component.html'
})

export class GroupComponent implements OnInit {
    display: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    groups: any[];
    groupName: string;
    groupId: number;
    isUpdateAction: boolean = false;

    constructor(private loadingSrv: LoadingService,
        private adminService: AdminService) {

    }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this.loadingSrv.show();
        this.adminService.getAllGroups().subscribe((res) => {
            this.groups = res.result;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide();
        });
    }


    onSubmit() {
        this.loadingSrv.show();

        if (this.isUpdateAction == false) {

            let body = {
                groupId: 0,
                groupName: this.groupName,
                createdBy: 0
            }
            this.adminService.saveGroup(body)
                .subscribe((res) => {

                    this.loadingSrv.hide();
                    if (res.success == true) {
                        this.getGroups();
                        this.groupName = '';
                        this.display = false;
                        this.showMessage(res.message, "success", "Fintrak Banking");
                    } else {

                        this.showMessage(res.message, "error", "Fintrak Banking");
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage("An error has occured", "error", "Fintrak Banking");
                });


        } else {

            let body = {
                groupId: this.groupId,
                groupName: this.groupName,
                createdBy: 0
            }

            this.adminService.updateGroup(this.groupId, body)
                .subscribe((res) => {
                    if (res.success == true) {
                        this.getGroups();
                        this.groupName = '';
                        this.loadingSrv.hide();
                        this.display = false;
                        this.showMessage(res.message, "success", "Fintrak Banking");
                    } else {
                        this.loadingSrv.hide();
                        this.showMessage(res.message, "error", "Fintrak Banking");
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage("An error has occured", "error", "Fintrak Banking");
                });

        }



    }

    editGroup(index) {
        var grp = this.groups[index];
        this.groupId = grp.groupId;
        this.groupName = grp.groupName;
        this.isUpdateAction = true;
        this.display = true;
    }


    showDialog() {
        this.isUpdateAction = false;
        this.groupName = null;
        this.display = true;
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