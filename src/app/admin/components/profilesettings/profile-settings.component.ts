import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import swal, { SweetAlertType } from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
     selector: 'profile-settings',
     templateUrl: 'profile-settings.component.html'
 })

 export class ProfileSettingComponent implements OnInit {
        [x: string]: any;
        profileSettingsForm: FormGroup;
        profileSettings: any = {};
        isUpdateAction: boolean;
        display: boolean;
        show: boolean;
        groupName: any;
    pageTitle: string='Profile Settings List';
    constructor(private fb: FormBuilder, private loadServ: LoadingService,private adminService: AdminService,)
   {}
    
        ngOnInit() {
            this.loadServ.show();
this.IntProfileSettingsForm();
this.getProfileSettings();
        }
       
        getProfileSettings() {
            this.adminService.getProfileSettings()
                .subscribe((response: any) => {
                  
                    this.profileSettings = response.result;
                    this.profileSettingsForm = this.fb.group({
                        profileSettingId: this.profileSettings.profileSettingId,
                        minRequiredPasswordLength:this.profileSettings.minRequiredPasswordLength,
                        minrequiredNonAlphanumericChar: this.profileSettings.minrequiredNonAlphanumericChar,
                        //enablePasswordRetrieval: this.profileSettings.enablePasswordRetrieval,
                        //enablePasswordReset: this.profileSettings.enablePasswordReset,
                        requiresQuestionAndAnswer: this.profileSettings.requiresQuestionAndAnswer,
                        //requiresUniqueEmail: this.profileSettings.requiresUniqueEmail,
                        maxInvalidPasswordAttempts: this.profileSettings.maxInvalidPasswordAttempts,
                       // allowPasswordReuseAfter: this.profileSettings.allowPasswordReuseAfter,
                        expirePasswordAfter: this.profileSettings.expirePasswordAfter,
                       // maxPeriodOfUserInactivity: this.profileSettings.maxPeriodOfUserInactivity,
                        sessionTimeOut: this.profileSettings.sessionTimeOut,  
    
                    }); 
                    this.loadServ.hide();
                });
                
        }
        onSubmit() {
            this.loadServ.show();
    
            let body = {
                profileSettingId: this.profileSettingsForm.value.profileSettingId,
                minRequiredPasswordLength:this.profileSettingsForm.value.minRequiredPasswordLength,
                minrequiredNonAlphanumericChar: this.profileSettingsForm.value.minrequiredNonAlphanumericChar,
                //enablePasswordRetrieval: this.profileSettingsForm.value.enablePasswordRetrieval,
                //enablePasswordReset: this.profileSettingsForm.value.enablePasswordReset,
                requiresQuestionAndAnswer: this.profileSettingsForm.value.requiresQuestionAndAnswer,
                //requiresUniqueEmail: this.profileSettingsForm.value.requiresUniqueEmail,
                maxInvalidPasswordAttempts: this.profileSettingsForm.value.maxInvalidPasswordAttempts,
                //allowPasswordReuseAfter: this.profileSettingsForm.value.allowPasswordReuseAfter,
                expirePasswordAfter: this.profileSettingsForm.value.expirePasswordAfter,
                //maxPeriodOfUserInactivity: this.profileSettingsForm.value.maxPeriodOfUserInactivity,
                sessionTimeOut: this.profileSettingsForm.value.sessionTimeOut,

            }

            this.adminService.updateProfileSettings(body)
                .subscribe((res) => {
                    if (res.success == true) {
                        this.loadServ.hide();
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message + ' Note: You Are Adviced To Logout and Login For Changes to Take Effect', 'success');
                    } else {
                        this.loadServ.hide();
                        this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (err) => {
                    this.loadServ.hide();
                    this.showMessage(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
                });
    
    
    
        }
        showMessage(title: string, message: string, messageType: SweetAlertType) {
            swal(title, message, messageType);
          }
       
    
        hideMessage() {
            this.show = false;
        }
        showDialog() {
            this.isUpdateAction = false;
            this.groupName = null;
            this.display = true;
        }
    IntProfileSettingsForm() {
        this.profileSettingsForm = this.fb.group({
            profileSettingId: [''],
            minRequiredPasswordLength: ['', Validators.required],
            minrequiredNonAlphanumericChar: ['', Validators.required],
            //enablePasswordRetrieval: ['', Validators.required],
            //enablePasswordReset: ['', Validators.required],
           requiresQuestionAndAnswer: ['', Validators.required],
           // requiresUniqueEmail: ['', Validators.required],
            maxInvalidPasswordAttempts: ['', Validators.required],
            //allowPasswordReuseAfter: ['', Validators.required],
            expirePasswordAfter: ['', Validators.required],
            //maxPeriodOfUserInactivity: ['', Validators.required],
            sessionTimeOut: ['', Validators.required],
            
        });
    }
    }