
import { NotificationService } from '../services/notification.service';
import { UserNotification } from '../models/notification';
import { AuthenticationService } from '../../admin/services/authentication.service';
import { Component, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { MainLayoutComponent } from '../layout/mainlayout.component';
import { Router } from '@angular/router';
import { Observable, Subscription ,  Unsubscribable as AnonymousSubscription } from 'rxjs';
import { PushNotificationsService } from 'ng-push';
import { AppConfigService } from '../services/app.config.service';
//import { IdleTimeoutService } from '../../admin/services/idle-timeouter.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../constant/app.constant';

import { Idle } from 'idlejs/dist';
import { AdminService } from 'app/admin/services';

let AppConstant: any;
@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix">
            <div class="topbar-left">
                <div class="logo"></div>
            </div>

            <div class="topbar-right">

                <div style="float: left;">
                    <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)">
                        <i></i>
                    </a>

                    <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                        <i class="material-icons">menu</i>
                    </a>
                </div>

                <div style="float:left; padding-top:11px;">
                    <h2 class="coyInfo">{{loggedInUserCompany}} :: {{businessUnitName}} ::
                    <span style="font-size:smaller"><i>{{applicationDate | date:'fullDate'}}
                    ==> Last Login {{lastLoginDate | date:'medium'}}</i></span>

                    </h2>

                </div>

                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li *ngIf="notificationList" class="notification-list" #notifications
                    [ngClass]="{'active-top-menu':app.activeTopbarItem === notifications}">
                        <a href="#" (click)="app.onTopbarItemClick($event,notifications)">
                            <i class="topbar-icon material-icons">timer</i>
                            <span class="topbar-badge animated rubberBand">
                                {{notificationList.length}}
                            </span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li *ngFor="let n of notificationList" role="menuitem">
                                <a href="#" (click)="app.onNotificationItemClick($event,n)">
                                    <i class="material-icons">bug_report</i>
                                    <span>{{n.message}}</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li  #profile class="profile-item" *ngIf="app.profileMode==='top' ||
                    app.isHorizontal()" [ngClass]="{'active-top-menu':app.activeTopbarItem === profile}">
                   <div  width=100%>                   
                        <a href="#" style="color: white;" (click)="app.onTopbarItemClick($event,profile)">
                            <div class="profile-image"></div>
                            <span class="topbar-item-name">Welcome, {{loggedInUserName}}</span>
                            
                        </a>

                        <a href="#" style="color: white;" (click)="app.logOut($event)">
                        <i class="material-icons">power_settings_new</i>
                        </a>
                    </div>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#"(click)="app.profileInfo()">
                                    <i class="material-icons">person</i>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a routerLink="/setup/staff-supervisor-reporting">
                                    <i class="material-icons">security</i>
                                    <span> Staff/Supervisor Reporting</span>
                                </a>
                            </li> 
                             <li role="menuitem">
                             <a routerLink="/setup/staff-relief">
                             <i class="material-icons">security</i>
                             <span> Relief Setup</span>
                             </a>
                            </li> 
                          <li role="menuitem">
                                <a routerLink="/changepassword" routerLinkActive="active">
                                    <i class="material-icons">security</i>
                                    <span>Change Password</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a routerLink="/changepassword" routerLinkActive="active">
                                    <i class="material-icons">settings_applications</i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <!-- <li role="menuitem">
                                <a  href="./../../../../assets/files/UserManual.pdf" target="_blank">
                                <i class="material-icons">comment</i>
                                    <span>User Manual</span>
                                </a>
                            </li> -->
                            <li role="menuitem">
                                <a href="#" (click)="app.logOut($event)">
                                    <i class="material-icons">power_settings_new</i>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})

export class AppTopBarComponent implements OnInit, OnDestroy {
    loggedInUserName: string;
    loggedInUserBranch: string;
    loggedInUserCompany: string;
    applicationDate: Date;
    notificationList: UserNotification[];
    notifications: any[] = [];
    lastLoginDate: string;
    businessUnitName: string;
    private timerSubscription: AnonymousSubscription;
    private notificationSubscriptions: AnonymousSubscription;

    _idleTimerSubscription: Subscription;

    idleInstance: any = null;

    constructor(
        private router: Router,
        private appConfigService: AppConfigService,
        private authService: AuthenticationService,
        private noticeService: NotificationService,
        private _pushNotifications: PushNotificationsService,
        private adminService: AdminService,
        // private idleTimeoutService: IdleTimeoutService,
        @Inject(forwardRef(() => MainLayoutComponent)) public app: MainLayoutComponent
    ) {
        AppConstant = this.appConfigService;
        
    }

    ngOnInit() {
        const userInfo = this.authService.getUserInfo();
        this.loggedInUserName = userInfo.staffName;
        this.loggedInUserBranch = userInfo.branchName;
        this.loggedInUserCompany = userInfo.companyName;
        this.applicationDate = userInfo.applicationDate;
        this.businessUnitName = userInfo.businessUnitName;
        this.lastLoginDate = userInfo.lastLoginDate;
       // this.getProfileSetting();
        this.idleInstance = null;
        if (this.idleInstance == null) {
            this.adminService.getProfileSettings()
            .subscribe((response: any) => {
                this.profileSettings = response.result;
                this.sessionTimeOut = this.profileSettings.sessionTimeOut;
                this.idleInstance = new Idle()
                    .whenNotInteractive()
                    .within(this.sessionTimeOut)
                    //.within(AppConstant.APP_TIMEOUT)
                    .do(() => {
                        const eodActive = sessionStorage.getItem('eodActive');
                       if(eodActive != '1') this.logOutIdleUser();})
                    .start();
            });
           
        }

        //this.getNotifications();
        //this.refreshNotifications(); // Pending a better real-time implementation
        //this.getNotificationForFinalState();
        // const __this = this;
        //const idle = 
    }
    
    profileSettings: any = {};
    sessionTimeOut: number;

    // getProfileSetting() {
    //     this.adminService.getProfileSettings()
    //         .subscribe((response: any) => {
    //             this.profileSettings = response.result;
    //             this.sessionTimeOut = this.profileSettings.sessionTimeOut;
    //         });
    // }
    ngOnDestroy(): void {
        if (this.notificationSubscriptions) {
            this.notificationSubscriptions.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
       // Observable.interval(300000).timeInterval().subscribe(() => {
            // this.getNotificationForFinalState();
       // });
    }

    getNotifications() {
        this.noticeService.getNotificationList()
            .subscribe((res) => {
            });
    }

    private refreshNotifications(): void {
        this.notificationSubscriptions = this.noticeService.getNotificationList().subscribe((res) => {
            this.subscribeToData();
        }, (err) => {
        });
    }

    private subscribeToData(): void {
        // this.timerSubscription = Observable.interval(60000).first().subscribe(() => this.refreshNotifications());
        //this.timerSubscription = Observable.interval(60000).first().subscribe(() => this.getNotificationForFinalState());
    }


    getNotificationForFinalState() {
        this.noticeService.getNotificationList().subscribe((res) => {
            this.notificationList = res;
            let tempNotification = this.notificationList;
            tempNotification.forEach((el) => {
                this._pushNotifications.create(
                    'Alert', {
                        body: el.message,
                        icon: 'assets/images/notification_logo.png',
                        data: el.actionUrl,
                        // renotify: true,
                    }).subscribe((res) => {
                        res['notification']['onclick'] = this.onNotificationClick;
                        setTimeout(res['notification'].close.bind(res['notification']), 10000);
                    }, (err) => {
                    });

            });
        }, (err) => {
        });
    }

    spawnNotification(theBody, theIcon, theTitle) { // NATIVE NOTIFICATIONS METHOD
        let options = {
            body: theBody,
            icon: theIcon
        }
        let n = new Notification(theTitle, options);
        setTimeout(n.close.bind(n), 5000);
    }

    onNotificationClick(event) {
        // evt.preventDefault();
        const route = event.target.data;
        const __this = this;
        if (route) {
            const host = AppConstant.APP_HOST;
            window.location.replace(`${host}/#${route}`);
        }
        // alert(event.target.data);
    }

    loggingoff:boolean=false;
    logOutIdleUser() {
        if(this.loggingoff == false) {
            this.loggingoff=true;
            this.idleInstance = null;
            this.authService.logOffIdle().subscribe((res) => {
            //     this.loggingoff=false;
            // }, (err) => {
            //     this.loggingoff=false;
            }, (err:any) => {

            });
            this.authService.logOut();
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.authService.redirectUrl }
            });
            // mess
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Your session has expired! You have been logged out.', 'info');
        }
    }
}