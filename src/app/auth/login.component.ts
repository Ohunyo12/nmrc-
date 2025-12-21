import { AuthenticationService } from '../admin/services/authentication.service';
import { AppConstant, GlobalConfig } from '../shared/constant/app.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import swal from 'sweetalert2';
import { PushNotificationsService } from 'ng-push';
import { UserNotification } from '../shared/models/notification';
import { NotificationService } from '../shared/services/notification.service';
import { MainLayoutComponent } from '../shared/layout/mainlayout.component';
import { Message } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser'
import * as CryptoJS from 'crypto-js';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./css/style.scss']
})

export class LoginComponent implements OnInit {
    displayTwoFactorAuth: boolean = false;
    allowSignoutPage: boolean = false;
    data: any = {};
    show: boolean = false;
    authenticating: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    returnUrl: any;
    displayPasswordchange: boolean = false;
    msgs: Message[] = [];
    notificationList: UserNotification[];
    username: string;
    passwordForm: FormGroup;
    isPasswordVisible: boolean = false; 

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingService,
        private authService: AuthenticationService,
        private noticeService: NotificationService,
        private _pushNotifications: PushNotificationsService,
        private fb: FormBuilder,
        private sanitized: DomSanitizer
    ) {
    }


    ngOnInit() {

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.passwordChangeForm();
        if (!('Notification' in window)) {
         
        }

        if (this._pushNotifications.permission !== 'denied') {
            this._pushNotifications.requestPermission();

           
        }

        this.togglePasswordVisibility()
 
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
      }
    onPasswordChange() {
        let body = this.passwordForm.value;
        if (body.newPassword != body.confirmPassword) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "New password and confirm password does not match.", 'info');
            return;
        }
      

        this.authService.passwordChange(body).subscribe((res) => {
           
            if (res.success) {
                this.displayPasswordchange = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }
            else {
                this.displayPasswordchange = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        });
    }

    passwordInfo: string;

    passwordChangeForm() {
        this.passwordForm = this.fb.group({
            username: ['', Validators.required],
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
        },
            { validator: this.equalValueValidator('newPassword', 'confirmPassword') }
        );
    }

    equalValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {
        return (group: FormGroup): { [key: string]: any } => {
            const target = group.controls[targetKey];
            const toMatch = group.controls[toMatchKey];
            if (target.touched || toMatch.touched) {
                const isMatch = target.value === toMatch.value;
               
                if (!isMatch && target.valid && toMatch.valid) {
                    toMatch.setErrors({ equalValue: targetKey });
                    const message = targetKey + ' != ' + toMatchKey;
                    return { 'equalValue': message };
                }
                if (isMatch && toMatch.hasError('equalValue')) {
                    toMatch.setErrors(null);
                }
            }

            return null;
        };
    }

    hideModal() {
        this.displayPasswordchange = false;
    }
    onNotificationClick(event) {
        event.preventDefault();
       
    }

    evt: any;
    signIn() {

        // var key = CryptoJS.enc.Utf8.parse('7061737323313233');
        // var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
        // var ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.data.password), key,
        //     {
        //         keySize: 128 / 8,
        //         iv: iv,
        //         mode: CryptoJS.mode.CBC,
        //         padding: CryptoJS.pad.Pkcs7
        //     });
        
        if (this.authenticating == true)
        if (this.authenticating == true) return;
        this.authenticating = true;
        this.loadingService.show();
        let body = {};
        if (AppConstant.API_VERSION === true) {
            let password = btoa(this.data.password);
            // let password = ciphertext.toString();

            this.authService.getAuthToken(this.data.username, password).subscribe((res: any) => {
                // var tokenaccess = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.access_token), key,
                //         {
                //             keySize: 128 / 8,
                //             iv: iv,
                //             mode: CryptoJS.mode.CBC,
                //             padding: CryptoJS.pad.Pkcs7
                //         });
                //     var expirydate = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.expiry_date), key,
                //         {
                //             keySize: 128 / 8,
                //             iv: iv,
                //             mode: CryptoJS.mode.CBC,
                //             padding: CryptoJS.pad.Pkcs7
                //         });
                this.authService.setDateNow();
                this.username = this.data.username;
                let token = res && res.access_token;
                if (token) {
                let accesstoken = btoa(res.access_token);
                let expiry = btoa(res.expiry_date);
                let password = btoa(this.data.password);
                // let accesstoken = tokenaccess.toString();// btoa(res.access_token);
                //         let expiry = expirydate.toString();// btoa(res.expiry_date);
                //         //let username = btoa(this.data.username);
                //         let password = ciphertext.toString();

                    body = {
                        username: this.data.username,
                        password: password,
                        encodedToken: accesstoken,
                        validTo: expiry,
                    };
                   this.authService.setRefreshToken(res.refresh_token);
                   this.authService.setTokenDuration(res.expires_in);
                //    this.authService.signIn(body).subscribe((encrptedResponse) => {
                    this.authService.signIn(body).subscribe((response) => {
                    // const decryptedResp = this.decryptCrypto(encrptedResponse);
                    //         const response: any = JSON.parse(decryptedResp);
                        this.loadingService.hide();
                        this.authenticating = false;
                        this.authService.UserProfile.isLoggedIn = true;
                        
                        if (response.userInfo.sessionStatusInfo.isFirstLogin) {
                                this.passwordInfo = `This is the first time you are login to the Credit360, you are required to change your password.`
                                 this.passwordChangeForm();
                                this.passwordForm.controls['username'].setValue(this.username);
                                this.displayPasswordchange = true;
                                return;
                            }

                            if (response.userInfo.sessionStatusInfo.isPasswordExpired) {
                                this.passwordInfo = `Your current password has expired. You have need to change your password.`
                                this.passwordChangeForm();
                                this.passwordForm.controls['username'].setValue(this.username);
                                this.displayPasswordchange = true;
                                return;
                            }

                            if (response.success === true) {

                               this.authService.setUserInfo(response.userInfo);
                                this.authService.setLoggedInUser(response.access_token);
                                this.authService.setTokenExpirationTime(response.expiration);
                                this.authService.setLastUsername(response.userInfo.userName);
                                this.authService.setLoggedInUserActivities(response.userInfo.activities);

                                if (response.userInfo.activities != undefined) {
                                    let twoFactorAuthEnabled = response.userInfo.activities.indexOf("2FA")
                                    if (twoFactorAuthEnabled > -1) {
                                        this.displayTwoFactorAuth = true;
                                    } else {
                                        this.router.navigate([this.returnUrl]);
                                    }
                                }
                               } else {
                               
                                this.showMessage('Wrong username or password!', 'error', 'Authentication Error');
                            }
                        
                    }, (err) => {
                       
                       this.authenticating = false;
                        this.loadingService.hide();
                        this.showMessage(err, 'error', 'Authentication Error');
                    });
                } else {
                    this.authenticating = false;
                    this.loadingService.hide();
                    this.showMessage('Wrong username or password!!', 'error', 'Authentication Error');
                }

            }, (err) => {
                 this.authenticating = false;

                this.loadingService.hide();
                this.showMessage(err, 'error', 'Authentication Error');
            });

        } else {
            body = {
                username: this.data.username,
                password: this.data.password
            };
        }

    }
    detailMessage: string = "You have an active session running on another system. You are required to sign out on the previous system, to end the session";

    showWarn() {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: '', detail: this.detailMessage });
    }
    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    decryptCrypto(encryptedText: string): string {
        const encrptyKey = 'SSljsdkkdlo4454M';
        const encrptySalt = 'kljsdkkdlo4454GG';

        // separate the key and Iv from the cipher phrase string
        // var key = CryptoJS.enc.Utf8.parse(cipherPhrase.split("|")[0]);
        // var iv = CryptoJS.enc.Utf8.parse(cipherPhrase.split("|")[1]);
        var key = CryptoJS.enc.Utf8.parse(encrptyKey);
        var iv = CryptoJS.enc.Utf8.parse(encrptySalt);

        var decrypted = CryptoJS.AES.decrypt(encryptedText, key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    
    hideMessage(event) {
        this.show = false;
    }
    signOut(evt) {
        evt.preventDefault();
        let body = {};
        if (AppConstant.API_VERSION === true) {

            this.authService.getAuthToken(this.data.username, this.data.password).subscribe((res: any) => {
               let token = res && res.access_token;

                if (token) {

                    body = {
                        username: this.data.username,
                        password: this.data.password,
                        encodedToken: res.access_token,
                        validTo: res.expiry_date
                    };

                    this.authService.UserProfile.isLoggedIn = true;

                    this.authService.endActiveSession(body).subscribe((response: any) => {
                        if (response.success === true) {
                            this.allowSignoutPage = false;
                            swal(GlobalConfig.APPLICATION_NAME, response.message, "success")
                            this.router.navigate(['/auth/login']);
                        } else {
                            this.data.username = "";
                            this.data.password = "";
                        }
                    });
                }
            });
        }
    }
    getNotificationForFinalState() {
        this.noticeService.getNotificationForFinalState().subscribe((res: any) => {
            this.notificationList = res;
            let tempNotification = this.notificationList;
            tempNotification.forEach((el) => {
                this.spawnNotification('Alert', 'assets/images/notification_logo.png', el.message);
                this._pushNotifications.create(
                    'Alert', {
                        body: el.message,
                        icon: 'assets/images/notification_logo.png',
                        data: el.actionUrl,
                        renotify: true,
                    }).subscribe((res) => {
                       setTimeout(res['notification'].close.bind(res['notification']), 4000);
                    }, (err) => {
                       });

            });
        }, (err) => {
           
        });
    }

    spawnNotification(theBody, theIcon, theTitle) {
        let options = {
            body: theBody,
            icon: theIcon
        }
        let n = new Notification(theTitle, options);
        setTimeout(n.close.bind(n), 5000);
    }

    logOut() {
        this.authService.UserProfile.isLoggedIn = false;
        this.authService.logOffSystem().subscribe((res: any) => {
     }, (err) => {
           
        });
        sessionStorage.removeItem('auth');

        if (AppConstant.REMEMBER_LAST_WORKAREA) {
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.authService.redirectUrl }
            });
            return;
        }
        this.router.navigate(['/auth/login']);
    }
}

