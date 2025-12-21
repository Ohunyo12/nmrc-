import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { PasswordValidation } from '../../shared/directives/password-validetor.directive';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../shared/constant/app.constant';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { AuthenticationService } from '../../admin/services';

@Component({
    selector: 'app-passwordchange',
    templateUrl: './password-reset.component.html',
    //  styleUrls: ['./passwordchange.component.scss']
})
export class PasswordSettingComponent implements OnInit {
    passwordForm: FormGroup;
    username: string;
    @Output() closeWindow: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(private fb: FormBuilder,
        private router: Router,
        private loadingService: LoadingService,
        private authService: AuthenticationService, 
    ) { }

    ngOnInit(): void {
        const userInfo = this.authService.getUserInfo();
        this.username = userInfo.userName;

        this.passwordChangeForm()
    }

    onPasswordChange() {
        let body = this.passwordForm.value;
        if (body.newPassword != body.confirmPassword) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "New password and confirm password does not match.", 'info');
            return;
        }

        this.authService.passwordChange(body).subscribe((res) => {
            if (res.success) {
                this.router.navigate(['/auth/login']);
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        });
    }
    passwordInfo: string;
    passwordChangeForm() {
        this.passwordForm = this.fb.group({
            username: [this.username, Validators.required],
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
                // set equal value error on dirty controls
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
        this.router.navigate(['/dashboard']);
    }
}
