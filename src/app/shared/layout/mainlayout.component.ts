import { AuthenticationService } from '../../admin/services/authentication.service';
import { Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationsService } from 'ng-push';
import { AppConstant, GlobalConfig } from '../constant/app.constant';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
    selector: 'app-main',
    templateUrl: './mainlayout.component.html'
})
export class MainLayoutComponent implements AfterViewInit, OnDestroy {

    layoutCompact: boolean = false;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    darkMenu: boolean = false;

    profileMode: string = 'top';

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    layoutContainer: HTMLDivElement;

    layoutMenuScroller: HTMLDivElement;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    resetMenu: boolean;


    @ViewChild('layoutContainer',{ static: false }) layourContainerViewChild: ElementRef;

    @ViewChild('layoutMenuScroller',{ static: false }) layoutMenuScrollerViewChild: ElementRef;
    loggedInUserBranch: string;
    loggedInUserCompany: string;
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    notificationHandler: Notification;
    businessUnitName: any;

    constructor(
        public renderer: Renderer,
        private authService: AuthenticationService,
        private router: Router,
        private _pushNotifications: PushNotificationsService,
        // private idle: Idle, private keepalive: Keepalive
        //  private userIdle: UserIdleService
    ) {


        this.reset();
    }
    activeAlert: boolean = false;
    countdown: number;
    showAlert() {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'System will time out in ' + this.countdown + ' seconds!' + ' seconds!', 'warning');

    }
    reset() {
        // this.idle.watch();
        // this.idleState = 'Started.';
        this.timedOut = false;
        this.activeAlert = false;
    }

    ngAfterViewInit() {
        this.layoutContainer = <HTMLDivElement>this.layourContainerViewChild.nativeElement;
        this.layoutMenuScroller = <HTMLDivElement>this.layoutMenuScrollerViewChild.nativeElement;
        let userInfo = this.authService.getUserInfo();
        this.loggedInUserBranch = userInfo.branchName;
        this.businessUnitName = userInfo.businessUnitName;
        
        this.loggedInUserCompany = userInfo.companyName;
        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuClick && this.isHorizontal()) {
                this.resetMenu = true;
            }

            this.topbarItemClick = false;
            this.menuClick = false;
        });

        setTimeout(() => {
            jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });
        }, 10);

        if (this._pushNotifications.permission === 'granted') {
            this._pushNotifications.requestPermission();
        }
        //Start watching for user inactivity.
        //  this.userIdle.startWatching();
        // Start watching when user idle is starting.
        // this.userIdle.onTimerStart().subscribe(count => {
        //     const __this = this;
        //     swal({
        //         title: 'Are you still there?',
        //         text: `You will be logged out in ${10 - count} seconds`,
        //         type: 'question',
        //         timer: 10000,
        //         showCancelButton: true,
        //         confirmButtonColor: '#3085d6',
        //         cancelButtonColor: '#d33',
        //         confirmButtonText: 'Yes',
        //         cancelButtonText: 'No, cancel!',
        //         confirmButtonClass: 'btn btn-success btn-move',
        //         cancelButtonClass: 'btn btn-danger',
        //         buttonsStyling: true,
        //     }).then(function () {
        //         __this.userIdle.stopTimer();
        //     }, function (dismiss) {
        //         if (dismiss == 'cancel') {
        //             __this.logOutIdleUser();
        //         }
        //     });
        //     if (count === 10) {
        //         swal.close();
        //     }
        // });

        // // Start watch when time is up.
        // this.userIdle.onTimeout().subscribe(() => {
        //     this.logOutIdleUser();
        // });
    }

    onMenuButtonClick(event) {
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        else {
            if (this.isDesktop())
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            else
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;

        if (!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        if (this.overlayMenuActive || this.staticMenuMobileActive) {
            this.rotateMenuButton = false;
            this.overlayMenuActive = false;
            this.staticMenuMobileActive = false;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    changeToHorizontalMenu() {
        this.layoutMode = MenuOrientation.HORIZONTAL;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }

        jQuery(this.layoutMenuScroller).nanoScroller({ flash: true });

    }

    onNotificationItemClick(evt, item) {
        evt.preventDefault();
        let route = item.actionUrl;
        this.router.navigate([route]);
    }
    settingPassword() {
        this.router.navigate(['/passwordReset']);
    }
    profileInfo() {
        this.router.navigate(['/passwordReset']);
    }
    // logOut(evt) {
    //     evt.preventDefault();
    //     this.authService.UserProfile.isLoggedIn = false;
    //     this.authService.logOffSystem().subscribe((res) => {
    //     }, (err) => {
    //     });
    //     sessionStorage.removeItem('auth');

    //     if (AppConstant.REMEMBER_LAST_WORKAREA) {
    //         this.router.navigate(['/auth/login'], {
    //             queryParams: { returnUrl: this.authService.redirectUrl }
    //         });
    //         return;
    //     }

    //     this.router.navigate(['/auth/login']);

    // }

    logOut(evt) {
        evt.preventDefault();
    
        swal({
            title: "Confirm Logout",
            text: "Are you sure you want to logout?",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout",
            cancelButtonText: "No, stay logged in"
        }).then((isConfirm) => {
            if (isConfirm) {
                this.authService.UserProfile.isLoggedIn = false;
                swal("Logout Successful", "You have been successfully logged out of the system.", "success");
    
                this.authService.logOffSystem().subscribe(
                    (res) => {
                 // swal("Logout Failed", "There was a problem logging you out. Please try again.", "error");
                    }
                );
    
                sessionStorage.removeItem('auth');
    
                if (AppConstant.REMEMBER_LAST_WORKAREA) {
                    this.router.navigate(['/auth/login'], {
                        queryParams: { returnUrl: this.authService.redirectUrl }
                    });
                    return;
                }
    
                this.router.navigate(['/auth/login']);
            }
            (err) => {
                console.error("Logout error:", err);
                swal("Logout Failed", "There was a problem logging you out. Please try again.", "error");

                this.authService.UserProfile.isLoggedIn = true;
            }
        });
    }
    

    logOutIdleUser() {
        this.authService.UserProfile.isLoggedIn = false;
        this.authService.logOffSystem().subscribe((res) => {
        }, (err) => {
        });
        sessionStorage.removeItem('auth');
        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.authService.redirectUrl }
        });
    }
}
